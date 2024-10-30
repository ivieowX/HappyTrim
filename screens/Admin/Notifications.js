import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

const Notifications = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications(); // เรียกฟังก์ชัน fetchNotifications เมื่อติดตั้งคอมโพเนนต์
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://mgt2.pnu.ac.th/jakpong/6460704003/get_notifications.php');
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  const handleAddNotification = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'http://mgt2.pnu.ac.th/jakpong/6460704003/add_notification.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title,
            message: message,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Notification added successfully!');
        setTitle('');
        setMessage('');
        await fetchNotifications(); // เรียกข้อมูลใหม่หลังจากเพิ่มการแจ้งเตือนสำเร็จ
      } else {
        Alert.alert('Error', data.message || 'Failed to add notification.');
      }
    } catch (error) {
      console.error('Error adding notification:', error);
      Alert.alert('Error', 'Something went wrong while adding the notification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add a Notification</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        multiline={true}
        numberOfLines={4}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Add Notification" onPress={handleAddNotification} />
      )}
      <View style={styles.flatList}>
        <FlatList 
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingBottom: 130,
  },
  flatList: {
    height: '100%',
    paddingBottom: 200,
    marginBottom: 520,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  message: {
    marginTop: 5,
    fontSize: 16,
    color: '#555',
  },
  time: {
    fontSize: 14,
    color: '#888',
  },
});

export default Notifications;
