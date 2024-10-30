import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Lunch = () => {
    const [diet_lunch, setdiet_lunch] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchUserData();
    }, []);
    
    const fetchUserData = async () => {
        try {
            const response = await fetch(
                "http://mgt2.pnu.ac.th/jakpong/6460704003/diet_lunch.php" 
            );
            const data = await response.json();
            if (data.success) {
                setdiet_lunch(data.diet_lunch);
                setLoading(false);
            } else {
                console.error("API request failed");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCardPress = (item) => {
        navigation.navigate('FoodCard', { item, mealType: 'อาหารเที่ยง' }); 
    };

    const renderFoodsItem = ({ item }) => (
        <View style={styles.Container}>
            <View style={styles.FoodInfo}>
                <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.itembox}>
                    <View style={styles.item}>
                        <Image
                            source={{ uri: item.diet_image  }}
                            style={styles.profileImage}
                        />
                        <Text style={styles.Name}>{item.name}</Text>
                    </View>
                    <Text style={styles.detail}>จำนวนแคลอรี่ {item.calorie} cal.</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // คำนวณแคลอรี่รวมและจำนวนรายการทั้งหมด
    const totalCalories = diet_lunch.reduce((sum, item) => sum + parseFloat(item.calorie || 0), 0);
    const totalItems = diet_lunch.length;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textlogo}>รายการอาหารที่ควรรับประทาน</Text>
            <Text style={styles.summaryText}>
                รวมแคลอรี่ทั้งหมด: {totalCalories.toFixed(0)} kcal
            </Text>
            <Text style={styles.summaryText}>
                จำนวนรายการ: {totalItems} รายการ
            </Text>
            <FlatList
                style={styles.list}
                data={diet_lunch}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderFoodsItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e4e4e4",
        padding: 1,
    },
    Container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        padding: 20,
        marginVertical: 4,
        margin: 10,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    textlogo: {
        fontSize: 16,
        color: "black",
        marginVertical: 5,
        marginLeft: 10,
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
        textAlign : 'left',
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 15,
    },
    item: {
        display: "flex",
        flexDirection: "row",
        flex: 1,
    },
    itembox: {
        display: "flex",
        flexDirection: "column",
    },
    list: {
        backgroundColor: "white",
        paddingTop: 20,
        borderRadius: 25,
    },
    FoodInfo: {
        display: "flex",
        flexDirection: "row",
        height: 60,
        flex: 1,
    },
    Name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    detail: {
        fontSize: 16,
        color: "#666",
        marginLeft: 85,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Lunch;
