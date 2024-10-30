import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert, Modal, TextInput, Button } from 'react-native';

const FoodPlan = () => {
  const [dietBreakfast, setDietBreakfast] = useState([]);
  const [dietLunch, setDietLunch] = useState([]);
  const [dietDinner, setDietDinner] = useState([]);
  const [dietSnack, setDietSnack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('breakfast');
  const [modalVisible, setModalVisible] = useState(false);
  const [foodData, setFoodData] = useState({
    id: null,
    name: '',
    calorie: '',
    diet_image: '',
    details: '',
  });
  const [pressedCategory, setPressedCategory] = useState(null); // State to track pressed category

  useEffect(() => {
    fetchDietData('breakfast');
    fetchDietData('lunch');
    fetchDietData('dinner');
    fetchDietData('snack');
  }, []);

  const fetchDietData = async (category) => {
    try {
      const response = await fetch(`http://mgt2.pnu.ac.th/jakpong/6460704003/diet_${category}.php`);
      const data = await response.json();
      if (data.success) {
        switch (category) {
          case 'breakfast':
            setDietBreakfast(data.diet_breakfast);
            break;
          case 'lunch':
            setDietLunch(data.diet_lunch);
            break;
          case 'dinner':
            setDietDinner(data.diet_dinner);
            break;
          case 'snack':
            setDietSnack(data.diet_snack);
            break;
          default:
            break;
        }
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEditFood = () => {
    if (foodData.name.trim() === '') {
      Alert.alert('Error', 'กรุณากรอกชื่ออาหาร');
      return;
    }
  
    if (foodData.id) {
      // แก้ไขอาหาร
      if (selectedCategory === 'breakfast') {
        updateFood(foodData, "http://mgt2.pnu.ac.th/jakpong/6460704003/update_food_breakfast.php"); // ใช้ API สำหรับแก้ไขอาหารเช้า
      } else if (selectedCategory === 'lunch') {
        updateFood(foodData, "http://mgt2.pnu.ac.th/jakpong/6460704003/update_food_lunch.php"); // ใช้ API สำหรับแก้ไขอาหารกลางวัน
      } else if (selectedCategory === 'dinner') {
        updateFood(foodData, "http://mgt2.pnu.ac.th/jakpong/6460704003/update_food_dinner.php"); // ใช้ API สำหรับแก้ไขอาหารเย็น
      } else {
        updateFood(foodData, "http://mgt2.pnu.ac.th/jakpong/6460704003/update_food_snack.php"); // ใช้ API สำหรับแก้ไขอาหารว่าง
      }
    } else {
      // เพิ่มอาหาร
      if (selectedCategory === 'breakfast') {
        addFood(foodData, "http://mgt2.pnu.ac.th/jakpong/6460704003/add_food_breackfast.php"); // ใช้ API สำหรับเพิ่มอาหารเช้า
      } else if (selectedCategory === 'lunch') {
        addFood(foodData, "http://mgt2.pnu.ac.th/jakpong/6460704003/add_food_lunch.php"); // ใช้ API สำหรับเพิ่มอาหารกลางวัน
      } else if (selectedCategory === 'dinner') {
        addFood(foodData, "http://mgt2.pnu.ac.th/jakpong/6460704003/add_food_dinner.php"); // ใช้ API สำหรับเพิ่มอาหารเย็น
      } else {
        addFood(foodData, "http://mgt2.pnu.ac.th/jakpong/6460704003/add_food_snack.php"); // ใช้ API สำหรับเพิ่มอาหารว่าง
      }
    }
  
    setModalVisible(false);
    setFoodData({ id: null, name: '', calorie: '', diet_image: '', details: '' });
  };
  

  const addFood = async (food, apiUrl) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(food),
      });
      const data = await response.json();
      console.log(data);
      fetchDietData(selectedCategory); // Refresh data after adding
    } catch (error) {
      console.error("Error adding food:", error);
    }
  };
  
  const updateFood = async (food, apiUrl) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(food),
      });
      const data = await response.json();
      console.log(data);
      fetchDietData(selectedCategory); // Refresh data after updating
    } catch (error) {
      console.error("Error updating food:", error);
    }
  };
  

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodItem}>
      <Text style={styles.foodName}>{item.name}</Text>
      <TouchableOpacity onPress={() => editFood(item)}>
        <Text style={styles.editButton}>แก้ไข</Text>
      </TouchableOpacity>
    </View>
  );

  const editFood = (item) => {
    setFoodData({
      id: item.id,
      name: item.name,
      calorie: item.calorie,
      diet_image: item.diet_image,
      details: item.details,
    });
    setModalVisible(true);
  };

  const getCurrentCategoryData = () => {
    switch (selectedCategory) {
      case 'breakfast':
        return dietBreakfast;
      case 'lunch':
        return dietLunch;
      case 'dinner':
        return dietDinner;
      case 'snack':
        return dietSnack;
      default:
        return [];
    }
  };

  const renderCategoryButton = (category, label) => (
    <TouchableOpacity
      style={[styles.categoryButton, pressedCategory === category && styles.categoryButtonPressed]}
      onPress={() => {
        setSelectedCategory(category);
        setPressedCategory(category); // Set pressed category
      }}
      onPressOut={() => setPressedCategory(null)} // Reset pressed category on release
    >
      <Text style={styles.categoryText}>{label}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        {renderCategoryButton('breakfast', 'อาหารเช้า')}
        {renderCategoryButton('lunch', 'อาหารกลางวัน')}
        {renderCategoryButton('dinner', 'อาหารเย็น')}
        {renderCategoryButton('snack', 'ของว่าง')}
      </View>

      <FlatList
        data={getCurrentCategoryData()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFoodItem}
        ListEmptyComponent={<Text>ไม่มีข้อมูลในหมวดหมู่นี้</Text>}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>เพิ่มอาหาร</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setFoodData({ id: null, name: '', calorie: '', diet_image: '', details: '' });
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="ชื่ออาหาร"
              value={foodData.name}
              onChangeText={(text) => setFoodData({ ...foodData, name: text })}
              style={styles.textInput}
            />
            <TextInput
              placeholder="แคลอรี"
              value={foodData.calorie}
              onChangeText={(text) => setFoodData({ ...foodData, calorie: text })}
              style={styles.textInput}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="รูปภาพ"
              value={foodData.diet_image}
              onChangeText={(text) => setFoodData({ ...foodData, diet_image: text })}
              style={styles.textInput}
            />
            <TextInput
              placeholder="รายละเอียด"
              value={foodData.details}
              onChangeText={(text) => setFoodData({ ...foodData, details: text })}
              style={styles.textInput}
            />
            <Button title="บันทึก" onPress={handleAddOrEditFood} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 16,
  },
  categoryButtonPressed: {
    backgroundColor: '#aaa', // เปลี่ยนสีเมื่อ hover
  },
  categoryText: {
    fontSize: 16,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  foodName: {
    fontSize: 16,
  },
  editButton: {
    color: '#007BFF',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default FoodPlan;
