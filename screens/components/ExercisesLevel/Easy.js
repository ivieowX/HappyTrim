import { View, Text, StyleSheet, FlatList, Image, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from "react";

const Easy = () => {
    const [exercise_easy, setexercise_easy] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(
                "http://mgt2.pnu.ac.th/jakpong/6460704003/exercise_easy.php" // เปลี่ยน URL ให้ตรงกับไฟล์ PHP ที่ใช้ดึงข้อมูลจาก exercise_easy
            );
            const data = await response.json();
            if (data.success) {
                setexercise_easy(data.exercise_easy);
                setLoading(false);
            } else {
                console.error("API request failed");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCardPress = (item) => {
        navigation.navigate('ExercisesCard', { item, level: 'ง่าย' }); // เพิ่มข้อมูล level ที่จะส่งไป
    };
    

    const renderExercisesItem = ({ item }) => (
        <View style={styles.Container}>
            <View style={styles.exercisesInfo}>
                <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.itembox}>
                <View style={styles.item}>
                        <Image
                            source={{ uri: item.exercise_image }}
                            style={styles.profileImage}
                        />
                        <Text style={styles.Name}>{item.name.length > 10
                            ? item.name.substring(0, 20) + "..." // ตัดข้อความที่เกิน 50 ตัวอักษรแล้วต่อด้วย ...
                            : item.name}</Text>
                    </View>
                    <Text style={styles.detail}>
                        {item.details.length > 50
                            ? item.details.substring(0, 10) + "..." // ตัดข้อความที่เกิน 50 ตัวอักษรแล้วต่อด้วย ...
                            : item.details}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const totalCalories = exercise_easy.reduce((sum, item) => sum + parseFloat(item.calorie || 0), 0);
    const totalItems = exercise_easy.length; // จำนวนรายการทั้งหมด

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textlogo}>ระดับง่าย</Text>
            <Text style={styles.summaryText}>
                รวมแคลอรี่ทั้งหมด: {totalCalories.toFixed(2)} kcal
            </Text>
            <Text style={styles.summaryText}>
                จำนวนรายการ: {totalItems} รายการ
            </Text>
            <FlatList style={styles.list}
                data={exercise_easy}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderExercisesItem}
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
        fontWeight: "bold",
        fontSize: 30,
        color: "black",
        marginVertical: 5,
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 15,
    },
    list: {
        backgroundColor: "white",
        paddingTop: 20,
        borderRadius: 25,
    },
    exercisesInfo: {
        display: "flex",
        flexDirection: "row",
        height: 70,
        flex: 1,
    },
    itembox: {
        display: "flex",
        flexDirection: "column",
    },
    item: {
        display: "flex",
        flexDirection: "row",
        flex: 1,
    },
    Name: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    detail: {
        fontSize: 16,
        color: "#666",
        marginLeft: 85,
        paddingBottom: 5,
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    spacer: {
        width: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
        textAlign : 'left',
    },
});

export default Easy;
