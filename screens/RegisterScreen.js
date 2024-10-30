import React, { useState } from "react";
import {
    Text,
    View,
    TextInput,
    Alert,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from "react-native";

const RegisterScreen = ({ navigation }) => {
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState(""); // State สำหรับรหัสยืนยัน

    const isEmailValid = (Email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(Email).toLowerCase());
    };

    const handleNext = () => {
        if (!Name || Name.length < 6) {
            Alert.alert("กรุณากรอกชื่อ-นามสกุลที่ถูกต้อง!");
        } else if (!Email || !isEmailValid(Email)) {
            Alert.alert("กรุณากรอกอีเมลที่ถูกต้อง!");
        } else if (!Password || Password.length < 6) {
            Alert.alert("กรุณากรอกรหัสผ่านที่มีอย่างน้อย 6 ตัวอักษร!");
        } else if (Password !== ConfirmPassword) { // ตรวจสอบรหัสยืนยัน
            Alert.alert("รหัสผ่านและรหัสยืนยันไม่ตรงกัน!");
        } else {
            navigation.navigate("HealthInfo", {
                name: Name,
                email: Email,
                password: Password,
            });
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.logoRegister}>ป้อนข้อมูล</Text>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="ชื่อ-สกุล"
                        onChangeText={setName}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="อีเมล"
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="รหัสผ่าน"
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="ยืนยันรหัสผ่าน" // เพิ่ม Input สำหรับยืนยันรหัสผ่าน
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>
                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                    <Text style={styles.nextText}>ถัดไป</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#288BFF",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    logoRegister: {
        fontWeight: "bold",
        fontSize: 50,
        color: "black",
        marginBottom: 20,
    },
    inputView: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    inputText: {
        height: 50,
        color: "black",
    },
    nextBtn: {
        width: "80%",
        backgroundColor: "black",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    nextText: {
        fontWeight: "bold",
        color: "white",
        fontSize: 22,
    },
});

export default RegisterScreen;
