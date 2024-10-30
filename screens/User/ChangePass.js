import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const ChangePass = ({ route }) => {
  const navigation = useNavigation();
  const [UserId] = useState(route.params.id);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('กรุณากรอกข้อมูลให้ครบถ้วน!');
    } else if (newPassword !== confirmPassword) {
      Alert.alert('รหัสผ่านใหม่และรหัสผ่านยืนยันไม่ตรงกัน!');
    } else {
      // Call the API to change the password
      fetch("http://mgt2.pnu.ac.th/jakpong/6460704003/change_password.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: oldPassword,
          new_password: newPassword,
          id: route.params.id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Alert.alert('เปลี่ยนรหัสผ่านสำเร็จ!');
            navigation.goBack();
            // Reset states
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
          } else {
            Alert.alert(data.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน!');
          }
        })
        .catch((error) => {
          console.error(error);
          Alert.alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์!');
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ผู้ใช้ id : {UserId}</Text>
      <Text style={styles.title}>เปลี่ยนรหัสผ่าน</Text>
      
      {/* Old Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="รหัสผ่านเก่า"
          secureTextEntry={!showOldPassword}
          onChangeText={setOldPassword}
          value={oldPassword}
        />
        <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
          <Text style={styles.toggleText}>{showOldPassword ? 'ซ่อน' : 'แสดง'}</Text>
        </TouchableOpacity>
      </View>

      {/* New Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="รหัสผ่านใหม่"
          secureTextEntry={!showNewPassword}
          onChangeText={setNewPassword}
          value={newPassword}
        />
        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
          <Text style={styles.toggleText}>{showNewPassword ? 'ซ่อน' : 'แสดง'}</Text>
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="ยืนยันรหัสผ่านใหม่"
          secureTextEntry={!showConfirmPassword}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Text style={styles.toggleText}>{showConfirmPassword ? 'ซ่อน' : 'แสดง'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>ยืนยัน</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
  },
  button: {
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  toggleText: {
    color: '#288BFF',
    marginLeft: 10,
  },
});

export default ChangePass;
