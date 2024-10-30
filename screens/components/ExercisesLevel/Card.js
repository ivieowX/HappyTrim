import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Card = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [userId] = useState(1); // Replace with the logged-in user ID
    const { item, level } = route.params; // รับข้อมูล level ที่ส่งมา

    const saveExerciseHistory = async (exercise) => {
        try {
            // Get the token of the logged-in user from AsyncStorage
            const token = await AsyncStorage.getItem('token'); // Make sure you have stored the token earlier

            if (!token) {
                Alert.alert("Error", "User token not found. Please log in again.");
                return;
            }

            const existingHistory = await AsyncStorage.getItem(`exerciseHistory_${token}`);
            const history = existingHistory ? JSON.parse(existingHistory) : [];

            // Prepare the exercise data
            const exerciseData = {
                id: exercise.id,
                name: exercise.name,
                date: new Date().toLocaleDateString(),
                calorie: exercise.calorie,
                level: level, // Use the level received from route.params
            };

            // Add the new exercise to the history
            history.push(exerciseData);

            // Save the updated history back to AsyncStorage with the token-based key
            await AsyncStorage.setItem(`exerciseHistory_${token}`, JSON.stringify(history));

            Alert.alert("Success", "Exercise history saved successfully!");
        } catch (error) {
            console.error("Error saving exercise history:", error);
            Alert.alert("Error", "Failed to save exercise history.");
        }
    };



    return (
        <View style={styles.container}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.details}>จำนวนแคลเลอรี่ {item.calorie} kcal.</Text>
            <Text style={styles.details}>{item.details}</Text>

            {/* แสดงรูปภาพ */}
            <Image
                source={{ uri: item.exercise_image }} // URL ของรูปภาพ
                style={styles.image}
            />

            

            <Button title="เสร็จ(บันทึก)" onPress={() => saveExerciseHistory(item)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#e4e4e4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 18,
        marginVertical: 10,
    },
    image: {
        width: 200,  // ขนาดรูปภาพ
        height: 200, // ขนาดรูปภาพ
        marginVertical: 10,
    },
    video: {
        width: '100%', // ปรับขนาดวิดีโอให้เต็มความกว้าง
        height: 300,   // ขนาดความสูงของวิดีโอ
    },
});

export default Card;
