import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; //Import AsyncStorage

const UpdateProfile = ({ route, navigation }) => {
    const [name, setName] = useState(route.params.name);
    const [email, setEmail] = useState(route.params.Email);
    const [age, setAge] = useState(route.params.age);
    const [UserId] = useState(route.params.id);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        checkToken(); // Check token when the component mounts
    }, []);
    // Function to check if a token exists in AsyncStorage
    const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                // If no token exists, navigate the user to the login screen
                navigation.navigate("LoginScreen");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateProfile = async () => {
        // Perform validation if needed

        // Show loading indicator
        setIsLoading(true);
        // Prepare the data to send to the server as JSON
        const data = {
            name: name,
            email: email,
            age: age,
            id: route.params.id,
        };
        // Send a POST request to the API with JSON data
        fetch("http://mgt2.pnu.ac.th/jakpong/6460704003/update_profile.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())

            .then((data) => {
                if (data.success) {
                    // Handle success (e.g., display a success message)
                    alert("อัปเดทสำเร็จ!");
                    // Navigate back to the profile screen
                    navigation.goBack();
                } else {
                    // Handle error (e.g., display an error message)
                    alert("Failed to update profile.");
                }
            })
            .catch((error) => {
                // Handle network error
                console.log(error);
                console.error("Error:", error);
            })
            .finally(() => {
                // Hide loading indicator
                setIsLoading(false);
            });
    };
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>ผู้ใช้ id : {UserId}</Text>
            <View style={styles.inputView}>
                <View style={styles.label}>
                    <Text style={styles.textLabel}>ชื่อ</Text>
                </View>
                <TextInput
                    style={styles.inputText}
                    placeholder="Name"
                    onChangeText={(text) => setName(text)}
                    value={name}
                />
            </View>
            <View style={styles.inputView}>
                <View style={styles.label}>
                    <Text style={styles.textLabel}>อีเมล</Text>
                </View>
                <TextInput
                    style={styles.inputText}
                    placeholder="Email"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    keyboardType="email-address"
                />
            </View>
            <View style={styles.inputView}>
                <View style={styles.label}>
                    <Text style={styles.textLabel}>อายุ</Text>
                </View>
                <TextInput
                    style={styles.inputText}
                    placeholder="Age"
                    onChangeText={(text) => setAge(text)}
                    value={age}
                    keyboardType="number"
                />
            </View>
            <TouchableOpacity style={styles.updateBtn} onPress={handleUpdateProfile} disabled={isLoading}>
                <Text style={styles.text}>อัปเดต</Text>
                <MaterialIcons name="update" size={24} color="white" />
            </TouchableOpacity>
            {isLoading && <ActivityIndicator size="large" color="blue" />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        fontWeight: "bold",
        fontSize: 50,
        color: "black",
        marginBottom: 40,
    },
    label: {
        fontWeight: "bold",
        color: "#333",
        marginLeft: 20,
    },
    textLabel: {
        fontSize: 20,
    },
    inputView: {
        width: "90%",

    },
    inputText: {
        width: "100%",
        color: "black",
        backgroundColor: "white",
        fontSize: 20,
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    updateBtn: {
        display: "flex",
        flexDirection: "row",
        width: "40%",
        backgroundColor: "black",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    text: {
        fontWeight: "bold",
        color: "white",
        fontSize: 22,
        marginRight: 5,
    },
});
export default UpdateProfile;