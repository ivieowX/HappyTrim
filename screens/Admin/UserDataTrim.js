import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Alert,
    TouchableOpacity,
    TextInput,
} from "react-native";

const UserDataTrim = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("male");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(
                "http://mgt2.pnu.ac.th/jakpong/6460704003/all-users.php"
            );
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
                setLoading(false);
            } else {
                console.error("API request failed");
                Alert.alert("Error", "API request failed");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            Alert.alert("Error", "Error fetching data: " + error.message);
        }
    };

    const calculateBMI = (weight, height) => {
        const weightFloat = parseFloat(weight);
        const heightMeters = parseFloat(height) / 100;

        if (!isNaN(weightFloat) && !isNaN(heightMeters) && heightMeters > 0) {
            return (weightFloat / (heightMeters * heightMeters)).toFixed(1);
        } else {
            return "N/A";
        }
    };

    const getBMICategory = (bmi) => {
        const bmiValue = parseFloat(bmi);
        if (bmiValue < 18.5) return { name: "ผอม", color: "black" };
        if (bmiValue >= 18.5 && bmiValue < 25) return { name: "ปกติ", color: "#15bc11" };
        if (bmiValue >= 25 && bmiValue < 30) return { name: "เริ่มอ้วน", color: "#ebbd07" };
        if (bmiValue >= 30 && bmiValue < 35) return { name: "อ้วน", color: "#ff7714" };
        if (bmiValue >= 35) return { name: "อ้วนมาก", color: "#ff0000" };
        return { name: "ไม่ทราบ", color: "gray" };
    };

    const renderUserItem = ({ item }) => {
        const bmi = calculateBMI(item.weight, item.height);
        const category = getBMICategory(bmi);

        return (
            <View style={styles.userContainer}>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>
                        | น้ำหนัก {item.weight} kg | ส่วนสูง {item.height} cm 
                        
                    </Text>
                    <Text style={{ color: category.color }}>| BMI: {bmi} |{" "}{category.name}</Text>
                </View>
            </View>
        );
    };

    const filteredUsers = users
        .filter((user) => user.gender === selectedCategory)
        .filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()));


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
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        selectedCategory === "male" && styles.selectedCategory,
                    ]}
                    onPress={() => setSelectedCategory("male")}
                >
                    <Text
                        style={[
                            styles.categoryText,
                            selectedCategory === "male" && styles.selectedText,
                        ]}
                    >
                        ผู้ใช้ชาย
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        selectedCategory === "female" && styles.selectedCategory,
                    ]}
                    onPress={() => setSelectedCategory("female")}
                >
                    <Text
                        style={[
                            styles.categoryText,
                            selectedCategory === "female" && styles.selectedText,
                        ]}
                    >
                        ผู้ใช้หญิง
                    </Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="ค้นหาชื่อผู้ใช้..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />

            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderUserItem}
                ListEmptyComponent={<Text>ไม่มีผู้ใช้ในหมวดหมู่นี้</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 0,
    },
    categoryContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
        marginTop: 10,
    },
    categoryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#ddd",
        borderRadius: 20,
        marginHorizontal: 5,
    },
    selectedCategory: {
        backgroundColor: "#007bff",
    },
    categoryText: {
        fontSize: 16,
        color: "#333",
    },
    selectedText: {
        color: "#fff",
    },
    searchInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    averageBMIText: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
    },
    userContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        marginVertical: 4,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    userEmail: {
        fontSize: 16,
        color: "#666",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default UserDataTrim;
