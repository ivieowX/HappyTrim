import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Modal, TextInput, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';

const ExercisesPlan = () => {
  const [loading, setLoading] = useState(true);
  const [exerciseEasy, setExerciseEasy] = useState([]);
  const [exerciseMedium, setExerciseMedium] = useState([]);
  const [exerciseHard, setExerciseHard] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('easy');
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseData, setExerciseData] = useState({
    id: null,
    name: '',
    calorie: '',
    exercise_image: '',
    video_link: '',
    details: '',
  });

  useEffect(() => {
    fetchExerciseData();
  }, []);

  const fetchExerciseData = async () => {
    try {
      const easyResponse = await fetch("http://mgt2.pnu.ac.th/jakpong/6460704003/exercise_easy.php");
      const easyData = await easyResponse.json();
      if (easyData.success) setExerciseEasy(easyData.exercise_easy);

      const mediumResponse = await fetch("http://mgt2.pnu.ac.th/jakpong/6460704003/exercise_medium.php");
      const mediumData = await mediumResponse.json();
      if (mediumData.success) setExerciseMedium(mediumData.exercise_medium);

      const hardResponse = await fetch("http://mgt2.pnu.ac.th/jakpong/6460704003/exercise_hard.php");
      const hardData = await hardResponse.json();
      if (hardData.success) setExerciseHard(hardData.exercise_hard);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddOrEditExercise = () => {
    if (exerciseData.name.trim() === '') {
      Alert.alert('Error', 'กรุณากรอกชื่อท่าออกกำลังกาย');
      return;
    }

    if (exerciseData.id) {
      // แก้ไขท่าออกกำลังกาย
      const apiUrl = getApiUrlForUpdate();
      updateExercise(exerciseData, apiUrl);
    } else {
      // เพิ่มท่าออกกำลังกาย
      addExercise(exerciseData);
    }

    setModalVisible(false);
    resetExerciseData();
  };

  const getApiUrlForUpdate = () => {
    switch (selectedCategory) {
      case 'easy':
        return "http://mgt2.pnu.ac.th/jakpong/6460704003/update_exercise_easy.php";
      case 'medium':
        return "http://mgt2.pnu.ac.th/jakpong/6460704003/update_exercise_medium.php";
      case 'hard':
        return "http://mgt2.pnu.ac.th/jakpong/6460704003/update_exercise_hard.php";
      default:
        return "";
    }
  };

  const resetExerciseData = () => {
    setExerciseData({
      id: null,
      name: '',
      calorie: '',
      exercise_image: '',
      video_link: '',
      details: '',
    });
  };

  const addExercise = async (exercise) => {
    const apiUrl = getApiUrlForAdd();

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exercise),
      });
      const data = await response.json();
      console.log(data);
      fetchExerciseData(); // Refresh data after adding
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  const getApiUrlForAdd = () => {
    switch (selectedCategory) {
      case 'easy':
        return "http://mgt2.pnu.ac.th/jakpong/6460704003/add_exercise_easy.php";
      case 'medium':
        return "http://mgt2.pnu.ac.th/jakpong/6460704003/add_exercise_medium.php";
      case 'hard':
        return "http://mgt2.pnu.ac.th/jakpong/6460704003/add_exercise_hard.php";
      default:
        return "";
    }
  };

  const updateExercise = async (exercise, apiUrl) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exercise),
      });
      const data = await response.json();
      console.log(data);
      fetchExerciseData(); // Refresh data after updating
    } catch (error) {
      console.error("Error updating exercise:", error);
    }
  };

  const renderExerciseItem = ({ item }) => (
    <View style={styles.exerciseItem}>
      <Text style={styles.exerciseText}>{item.name}</Text>
      <TouchableOpacity onPress={() => editExercise(item)}>
        <Text style={styles.editButton}>แก้ไข</Text>
      </TouchableOpacity>
    </View>
  );

  const editExercise = (item) => {
    setExerciseData({
      id: item.id,
      name: item.name,
      calorie: item.calorie,
      exercise_image: item.exercise_image,
      video_link: item.video_link,
      details: item.details,
    });
    setModalVisible(true);
  };

  const getExercisesByCategory = () => {
    switch (selectedCategory) {
      case 'easy':
        return exerciseEasy;
      case 'medium':
        return exerciseMedium;
      case 'hard':
        return exerciseHard;
      default:
        return [];
    }
  };

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
          style={[styles.categoryButton, selectedCategory === 'easy' && styles.selectedCategory]}
          onPress={() => setSelectedCategory('easy')}
        >
          <Text style={styles.categoryText}>ง่าย</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, selectedCategory === 'medium' && styles.selectedCategory]}
          onPress={() => setSelectedCategory('medium')}
        >
          <Text style={styles.categoryText}>กลาง</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, selectedCategory === 'hard' && styles.selectedCategory]}
          onPress={() => setSelectedCategory('hard')}
        >
          <Text style={styles.categoryText}>ยาก</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getExercisesByCategory()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExerciseItem}
        ListEmptyComponent={<Text>ไม่มีข้อมูลการออกกำลังกายในหมวดหมู่นี้</Text>}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => {
        resetExerciseData(); // Reset data before opening modal
        setModalVisible(true);
      }}>
        <Text style={styles.addButtonText}>เพิ่มท่าออกกำลังกาย</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetExerciseData();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="ชื่อท่าออกกำลังกาย"
              value={exerciseData.name}
              onChangeText={(text) => setExerciseData({ ...exerciseData, name: text })}
              style={styles.textInput}
            />
            <TextInput
              placeholder="แคลอรี"
              value={exerciseData.calorie}
              onChangeText={(text) => setExerciseData({ ...exerciseData, calorie: text })}
              style={styles.textInput}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="ลิงก์วิดีโอ"
              value={exerciseData.video_link}
              onChangeText={(text) => setExerciseData({ ...exerciseData, video_link: text })}
              style={styles.textInput}
            />
            <TextInput
              placeholder="รายละเอียด"
              value={exerciseData.details}
              onChangeText={(text) => setExerciseData({ ...exerciseData, details: text })}
              style={styles.textInput}
            />
            <TextInput
              placeholder="รูปภาพ"
              value={exerciseData.exercise_image}
              onChangeText={(text) => setExerciseData({ ...exerciseData, exercise_image: text })}
              style={styles.textInput}
            />
            <Button title={exerciseData.id ? "แก้ไข" : "เพิ่ม"} onPress={handleAddOrEditExercise} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  selectedCategory: {
    backgroundColor: '#aaa',
  },
  categoryText: {
    fontSize: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  exerciseText: {
    fontSize: 16,
  },
  editButton: {
    color: 'blue',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default ExercisesPlan;
