import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

const AddUser = ({ navigation }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        weight: "",
        height: "",
        weight_goal: "",
        gender: "male",
        age: "",
    });

    const handleSubmit = async () => {
        console.log("Form Data:", formData); // เพิ่มบรรทัดนี้เพื่อเช็คค่า formData ก่อนส่ง
    
        try {
            const response = await fetch("http://mgt2.pnu.ac.th/jakpong/6460704003/add_users.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log("Response:", data); // แสดงผลลัพธ์ที่ได้รับจาก PHP
            if (data.success) {
                Alert.alert("User added successfully!");
                navigation.goBack();
            } else {
                Alert.alert(data.message || "Addition failed.");
            }
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("An error occurred.");
        }
    };
    

    return (
        <View style={styles.container}>
            <Text>ป้อนข้อมูล</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            <TextInput
                style={styles.textInput}
                secureTextEntry={true}
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Weight (kg)"
                value={formData.weight}
                keyboardType="numeric"
                onChangeText={(text) => setFormData({ ...formData, weight: text })}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Height (cm)"
                value={formData.height}
                keyboardType="numeric"
                onChangeText={(text) => setFormData({ ...formData, height: text })}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Weight Goal (kg)"
                value={formData.weight_goal}
                keyboardType="numeric"
                onChangeText={(text) => setFormData({ ...formData, weight_goal: text })}
            />
            <Picker
                selectedValue={formData.gender}
                style={styles.picker}
                onValueChange={(itemValue) => setFormData({ ...formData, gender: itemValue })}
            >
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
            </Picker>
            <TextInput
                style={styles.textInput}
                placeholder="Age"
                value={formData.age}
                keyboardType="numeric"
                onChangeText={(text) => setFormData({ ...formData, age: text })}
            />
            <Button title="Add User" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    textInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    picker: {
        height: 50,
        marginBottom: 15,
    },
});

export default AddUser;
