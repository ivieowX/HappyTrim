import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FoodHistory = () => {
  const [history, setHistory] = useState([]);
  const [groupedHistory, setGroupedHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityHistory();
  }, []);

  const fetchActivityHistory = async () => {
    try {
      // Get the token of the logged-in user from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert("Error", "User token not found. Please log in again.");
        return;
      }
      const existingHistory = await AsyncStorage.getItem(`foodHistory_${token}`);
      const data = existingHistory ? JSON.parse(existingHistory) : [];
      setHistory(data);
      groupHistoryByDate(data);
    } catch (error) {
      console.error("Error fetching food history:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupHistoryByDate = (data) => {
    const grouped = data.reduce((acc, item) => {
      const key = `${item.date}_${item.mealType}`;

      if (!acc[key]) {
        acc[key] = {
          date: item.date,
          totalCalories: 0,
          foods: [],
          mealType: item.mealType,
        };
      }

      acc[key].totalCalories += parseFloat(item.calorie);
      acc[key].foods.push(item);
      return acc;
    }, {});

    // console.log("Grouped data:", grouped);
    const groupedArray = Object.values(grouped);
    setGroupedHistory(groupedArray);

    // Save the grouped history to AsyncStorage for access in the Report page
    AsyncStorage.setItem('groupedfoodHistory', JSON.stringify(groupedArray));
  };



  const deleteHistory = async (dateToDelete) => {
    try {
      // Get the token of the logged-in user from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Error", "User token not found. Please log in again.");
        return;
      }
      const updatedHistory = history.filter(item => item.date !== dateToDelete);
      await AsyncStorage.setItem(`foodHistory_${token}`, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      groupHistoryByDate(updatedHistory);
    } catch (error) {
      console.error("Error deleting exercise history:", error);
    }
  };

  const handleDeletePress = (date) => {
    Alert.alert(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือว่าต้องการลบประวัติการกินอาหารในวันที่นี้?",
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "ลบ",
          onPress: () => deleteHistory(date),
        },
      ],
      { cancelable: false }
    );
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.itemText}>วันที่: {item.date}</Text>
      <Text style={styles.itemText}>{item.mealType}</Text>
      <Text style={styles.itemText}>
        แคลอรี่ทั้งหมด: {item.totalCalories.toFixed(2)} kcal
      </Text>
      {item.foods.map((food, index) => (
        <View key={index} style={styles.foodDetail}>
          <Text style={styles.itemText}>- {food.name}: {food.calorie} kcal</Text>
        </View>
      ))}
      <TouchableOpacity onPress={() => handleDeletePress(item.date)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>ลบประวัติ</Text>
      </TouchableOpacity>
    </View>
  );



  return (
    <View style={styles.container}>
      <Text style={styles.title}>ประวัติการกินอาหาร</Text>
      {loading ? <Text>กำลังโหลด...</Text> : (
        groupedHistory.length === 0 ? (
          <Text>ไม่มีประวัติการกินอาหาร</Text>
        ) : (
          <FlatList
            data={groupedHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => `${item.date}_${item.mealType}`} // ปรับ keyExtractor ให้ไม่ซ้ำกัน
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  foodDetail: {
    marginLeft: 10,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FoodHistory;
