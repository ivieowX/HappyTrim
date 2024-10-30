import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExercisesHistory = () => {
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

            const existingHistory = await AsyncStorage.getItem(`exerciseHistory_${token}`);
            const data = existingHistory ? JSON.parse(existingHistory) : [];
            setHistory(data);
            groupHistoryByDate(data);
        } catch (error) {
            console.error("Error fetching exercise history:", error);
        } finally {
            setLoading(false);
        }
    };

    const groupHistoryByDate = (data) => {
        const grouped = data.reduce((acc, item) => {
            const key = `${item.date}_${item.level}`; // ใช้วันที่และระดับเป็น key

            if (!acc[key]) {
                acc[key] = {
                    date: item.date,
                    totalCalories: 0,
                    exercises: [],
                    level: item.level,
                };
            }

            acc[key].totalCalories += parseFloat(item.calorie);
            acc[key].exercises.push(item);
            return acc;
        }, {});

        const groupedArray = Object.values(grouped);
        setGroupedHistory(groupedArray);

        // Save the grouped history to AsyncStorage for access in the Report page
        AsyncStorage.setItem('groupedExerciseHistory', JSON.stringify(groupedArray));
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
            await AsyncStorage.setItem(`exerciseHistory_${token}`, JSON.stringify(updatedHistory));
            setHistory(updatedHistory);
            groupHistoryByDate(updatedHistory);
        } catch (error) {
            console.error("Error deleting exercise history:", error);
        }
    };

    const handleDeletePress = (date) => {
        Alert.alert(
            "ยืนยันการลบ",
            "คุณแน่ใจหรือไม่ว่าต้องการลบประวัติการออกกำลังกายในวันที่นี้?",
            [
                { text: "ยกเลิก", style: "cancel" },
                { text: "ลบ", onPress: () => deleteHistory(date) }
            ],
            { cancelable: false }
        );
    };

    const renderHistoryItem = ({ item }) => (
        <View style={styles.historyItem}>
            <Text style={styles.itemText}>วันที่: {item.date}</Text>
            <Text style={styles.itemText}>ระดับ: {item.level}</Text>
            <Text style={styles.itemText}>แคลอรี่ทั้งหมด: {item.totalCalories.toFixed(2)} kcal</Text>
            {item.exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseDetail}>
                    <Text style={styles.itemText}>- {exercise.name}: {exercise.calorie} kcal</Text>
                </View>
            ))}
            <TouchableOpacity onPress={() => handleDeletePress(item.date)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>ลบประวัติ</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <View style={styles.container}>
            <Text style={styles.title}>ประวัติการออกกำลังกาย</Text>
            {loading ? <Text>กำลังโหลด...</Text> : (
                groupedHistory.length === 0 ? (
                    <Text>ไม่มีประวัติการออกกำลังกาย</Text>
                ) : (
                    <FlatList
                        data={groupedHistory}
                        renderItem={renderHistoryItem}
                        keyExtractor={(item) => `${item.date}_${item.level}`} // ปรับ keyExtractor ให้ไม่ซ้ำกัน
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
        backgroundColor: '#e4e4e4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    historyItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
    },
    itemText: {
        fontSize: 16,
    },
    exerciseDetail: {
        marginTop: 5,
    },
    deleteButton: {
        backgroundColor: '#ff4444',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ExercisesHistory;
