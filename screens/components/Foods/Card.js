import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Card = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { item, mealType } = route.params;// Destructure the passed item
    const [token, setUserId] = useState(null);

    const saveFoodHistory = async (food) => {
        try {
            // Get the token of the logged-in user from AsyncStorage
            const token = await AsyncStorage.getItem('token'); // Make sure you have stored the token earlier

            if (!token) {
                Alert.alert("Error", "User token not found. Please log in again.");
                return;
            }
    
            const existingHistory = await AsyncStorage.getItem(`foodHistory_${token}`);
            const history = existingHistory ? JSON.parse(existingHistory) : [];
    
            // Prepare the food data
            const foodData = { 
                id: food.id,
                name: food.name,
                date: new Date().toLocaleDateString(), // Add the date for history
                calorie: food.calorie,
                mealType: mealType // Include mealType here
            };
    
            // Add the new food to the history
            history.push(foodData);
    
            // Save the updated history back to AsyncStorage
            await AsyncStorage.setItem(`foodHistory_${token}`, JSON.stringify(history));
    
            Alert.alert("Success", "Food history saved successfully!");
        } catch (error) {
            console.error("Error saving food history:", error);
            Alert.alert("Error", "Failed to save food history.");
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{item.name}</Text>
            <Image 
                source={{ uri: item.diet_image }} // URL ของรูปภาพ
                style={styles.image}
            />
            <Text style={styles.details}>จำนวนแคลอรี่: {item.calorie} kcal</Text>
            <Text style={styles.details}>รายละเอียด: {item.details}</Text>
            <Button title="Save to Diary" onPress={() => saveFoodHistory(item)} />
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
        marginBottom: 10,
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
});

export default Card;
