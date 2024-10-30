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
import { Picker } from "@react-native-picker/picker";

const HealthInfoScreen = ({ route, navigation }) => {
    const { name, email, password } = route.params;
    const [Weight, setWeight] = useState("");
    const [Height, setHeight] = useState("");
    const [WeightGoal, setWeightGoal] = useState("");
    const [Gender, setGender] = useState("male");
    const [Age, setAge] = useState("");

    const handleRegister = () => {
        if (!Weight || !Height || !WeightGoal || !Age) {
            Alert.alert("กรุณากรอกน้ำหนัก ส่วนสูง เป้าหมายน้ำหนัก และอายุให้ครบถ้วน!");
        } else {
            registerUser();
        }
    };

    const registerUser = () => {
        fetch("http://mgt2.pnu.ac.th/jakpong/6460704003/register.php", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
                weight: Weight,
                height: Height,
                weight_goal: WeightGoal,
                gender: Gender,
                age: Age,
            }),
        })
            .then((response) => response.json())
            .then(() => {
                Alert.alert("สมัครสมาชิกเรียบร้อยแล้ว");
                navigation.replace("LoginScreen");
            })
            .catch((error) => {
                console.log(error);
            });
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
                <Text style={styles.logoRegister}>ข้อมูลสุขภาพ</Text>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="น้ำหนัก (กิโลกรัม)"
                        onChangeText={setWeight}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="ส่วนสูง (เซนติเมตร)"
                        onChangeText={setHeight}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="เป้าหมายน้ำหนัก (กิโลกรัม)"
                        onChangeText={setWeightGoal}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputView}>
                    <Picker
                        selectedValue={Gender}
                        style={styles.picker}
                        onValueChange={setGender}
                    >
                        <Picker.Item label="ชาย" value="male" />
                        <Picker.Item label="หญิง" value="female" />
                    </Picker>
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="อายุ"
                        onChangeText={setAge}
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
                    <Text style={styles.registerText}>สมัครสมาชิก</Text>
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
    registerBtn: {
        width: "80%",
        backgroundColor: "black",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    registerText: {
        fontWeight: "bold",
        color: "white",
        fontSize: 22,
    },
});

export default HealthInfoScreen;
