import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const UpdateReport = ({ route, navigation }) => {
    const [email, setEmail] = useState(route.params.Email);
    const [weight, setWeight] = useState(route.params.weight);
    const [height, setHeight] = useState(route.params.height);
    const [Weightgoal, setWeightgoal] = useState(route.params.weight_goal);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                navigation.navigate("LoginScreen");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateUser = async () => {
        setIsLoading(true);
        const data = {
            weight: weight,
            weight_goal: Weightgoal,
            height: height,
            email: email,
            id: route.params.id,
        };
        fetch("http://mgt2.pnu.ac.th/jakpong/6460704003/update_user.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("อัปเดทสำเร็จ!");
                    navigation.navigate("Report", { refresh: true });
                } else {
                    alert("Failed to update profile.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <View style={styles.container}>
            {isLoading && <ActivityIndicator size="large" color="blue" />}
            <Text style={styles.logo}>ป้อนข้อมูล</Text>
            <View style={styles.inputView}>
                <View style={styles.label}>
                    <Text style={styles.textLabel}>น้ำหนัก (ก.ก.)</Text>
                </View>
                <TextInput
                    style={styles.inputText}
                    onChangeText={(text) => setWeight(text)}
                    value={weight}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputView}>
                <View style={styles.label}>
                    <Text style={styles.textLabel}>เป้าหมายน้ำหนัก (ก.ก.)</Text>
                </View>
                <TextInput
                    style={styles.inputText}
                    onChangeText={(text) => setWeightgoal(text)}
                    value={Weightgoal}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputView}>
                <View style={styles.label}>
                    <Text style={styles.textLabel}>ส่วนสูง (ซ.ม.)</Text>
                </View>
                <TextInput
                    style={styles.inputText}
                    onChangeText={(text) => setHeight(text)}
                    value={height}
                    keyboardType="numeric"
                />
            </View>
            <TouchableOpacity style={styles.updateBtn} onPress={handleUpdateUser} disabled={isLoading}>
                <Text style={styles.text}>อัปเดต</Text>
                <MaterialIcons name="update" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: width * 0.05,
    },
    logo: {
        fontWeight: "bold",
        fontSize: height * 0.05,
        color: "black",
        marginBottom: height * 0.04,
    },
    label: {
        alignItems: "center",
        fontWeight: "bold",
        color: "#333",
    },
    textLabel: {
        fontSize: height * 0.02,
    },
    inputView: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 25,
        height: height * 0.12,
        marginBottom: height * 0.02,
        justifyContent: "center",
        paddingHorizontal: width * 0.05,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputText: {
        fontSize: height * 0.03,
        color: "black",
        textAlign: "center",
    },
    updateBtn: {
        display: "flex",
        flexDirection: "row",
        width: "60%",
        backgroundColor: "black",
        borderRadius: 25,
        height: height * 0.08,
        alignItems: "center",
        justifyContent: "center",
        marginTop: height * 0.04,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    text: {
        fontWeight: "bold",
        color: "white",
        fontSize: height * 0.03,
        marginRight: 5,
    },
});

export default UpdateReport;
