import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const ExercisesPlan = () => {
    const navigation = useNavigation();
    const [selectedLevel, setSelectedLevel] = useState(null);

    useEffect(() => {
        checkSelectedLevel();
    }, []);

    const checkSelectedLevel = async () => {
        try {
            const token = await AsyncStorage.getItem('token'); // ดึง token ของผู้ใช้ที่เข้าสู่ระบบ
            if (!token) {
                Alert.alert('Error', 'User token not found. Please log in again.');
                return;
            }

            const savedLevel = await AsyncStorage.getItem(`selectedExerciseLevel_${token}`);
            const savedDate = await AsyncStorage.getItem(`selectedExerciseDate_${token}`);
            const today = moment().format('YYYY-MM-DD');

            if (savedLevel && savedDate === today) {
                setSelectedLevel(savedLevel);
            } else {
                // ถ้าวันที่เปลี่ยน ให้เคลียร์การเลือก
                await AsyncStorage.removeItem(`selectedExerciseLevel_${token}`);
                await AsyncStorage.removeItem(`selectedExerciseDate_${token}`);
                setSelectedLevel(null);
            }
        } catch (error) {
            console.error('Error checking selected level:', error);
        }
    };

    const handleSelectLevel = async (level) => {
        try {
            const token = await AsyncStorage.getItem('token'); // ดึง token ของผู้ใช้ที่เข้าสู่ระบบ
            if (!token) {
                Alert.alert('Error', 'User token not found. Please log in again.');
                return;
            }

            const today = moment().format('YYYY-MM-DD');
            await AsyncStorage.setItem(`selectedExerciseLevel_${token}`, level);
            await AsyncStorage.setItem(`selectedExerciseDate_${token}`, today);
            setSelectedLevel(level);

            if (level === 'easy') {
                navigation.navigate('ExercisesEasy');
            } else if (level === 'medium') {
                navigation.navigate('ExercisesMedium');
            } else if (level === 'hard') {
                navigation.navigate('ExercisesHard');
            }
        } catch (error) {
            console.error('Error saving selected level:', error);
        }
    };

    const clearSelectedLevel = async () => {
        try {
            const token = await AsyncStorage.getItem('token'); // ดึง token ของผู้ใช้ที่เข้าสู่ระบบ
            if (!token) {
                Alert.alert('Error', 'User token not found. Please log in again.');
                return;
            }

            await AsyncStorage.removeItem(`selectedExerciseLevel_${token}`);
            await AsyncStorage.removeItem(`selectedExerciseDate_${token}`);
            setSelectedLevel(null);
            // Alert.alert('สำเร็จ', 'คุณสามารถเลือกระดับใหม่ได้แล้ว');
        } catch (error) {
            console.error('Error clearing selected level:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logoTitle}>เลือกระดับการออกกำลังกาย</Text>
            <Text style={styles.title}>**สามารถเลือกได้ระดับเดียว**</Text>
            <TouchableOpacity
                onPress={() => handleSelectLevel('easy')}
                style={[styles.button, selectedLevel && selectedLevel !== 'easy' ? styles.lockedButton : {}]}
                disabled={selectedLevel && selectedLevel !== 'easy'}
            >
                <Text style={styles.TextBtn}>ระดับง่าย</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleSelectLevel('medium')}
                style={[styles.button, selectedLevel && selectedLevel !== 'medium' ? styles.lockedButton : {}]}
                disabled={selectedLevel && selectedLevel !== 'medium'}
            >
                <Text style={styles.TextBtn}>ระดับปานกลาง</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleSelectLevel('hard')}
                style={[styles.button, selectedLevel && selectedLevel !== 'hard' ? styles.lockedButton : {}]}
                disabled={selectedLevel && selectedLevel !== 'hard'}
            >
                <Text style={styles.TextBtn}>ระดับยาก</Text>
            </TouchableOpacity>
            {selectedLevel && (
                <TouchableOpacity onPress={clearSelectedLevel} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>เลือกใหม่</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
    },
    logoTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    title: {
        fontSize: 16,
        marginBottom: 30,
        color: 'red',
    },
    button: {
        width: '80%',
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    TextBtn: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
    },
    lockedButton: {
        backgroundColor: '#d3d3d3',
    },
    clearButton: {
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
    clearButtonText: {
        fontWeight: "bold",
        color: "white",
        fontSize: 22,
        marginRight: 5,
    },
});

export default ExercisesPlan;
