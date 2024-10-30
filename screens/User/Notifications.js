import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  // Notifications.js
  useEffect(() => {
    const fetchNotifications = async () => {
      const needWeightUpdate = await AsyncStorage.getItem("needWeightUpdate");
      let updatedNotifications = [];

      if (needWeightUpdate === "true") {
        updatedNotifications.push({
          id: "weight_update_reminder",
          title: "อัปเดตน้ำหนัก",
          message: "คุณไม่ได้อัปเดตน้ำหนักมานานกว่า 7 วัน กรุณาอัปเดตข้อมูล",
          time: new Date().toLocaleString(),
          read: false,
        });
      }

      setNotifications([...data.notifications, ...updatedNotifications]);
    };

    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    setLoading(true);
    fetch('http://mgt2.pnu.ac.th/jakpong/6460704003/get_notifications.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const notificationsWithStatus = data.notifications.map(notification => ({
            ...notification,
            read: false // ค่าเริ่มต้นเป็น false
          }));
          setNotifications(notificationsWithStatus);
          updateBadgeCount(notificationsWithStatus); // Update badge count
        } else {
          console.error('Failed to fetch notifications');
        }
      })
      .catch((error) => console.error('Error:', error))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const updateBadgeCount = (notifications) => {
    const unreadCount = notifications.filter(n => !n.read).length;
    navigation.setOptions({
      tabBarBadge: unreadCount > 0 ? unreadCount : null,
    });
  };

  useEffect(() => {
    const checkReadNotifications = async () => {
      // เช็คว่ามีการอ่านการแจ้งเตือนใน AsyncStorage หรือไม่
      const keys = await AsyncStorage.getAllKeys();
      const readKeys = keys.filter(key => key.startsWith('notification_read_'));
      if (readKeys.length > 0) {
        const updatedNotifications = notifications.map(notification =>
          readKeys.includes(`notification_read_${notification.id}`) ? { ...notification, read: true } : notification
        );
        setNotifications(updatedNotifications);
        updateBadgeCount(updatedNotifications); // Update badge count
      }
    };

    fetchNotifications();
    checkReadNotifications(); // เช็คการอ่านการแจ้งเตือนเมื่อเริ่มต้นแอป
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleNotificationPress = async (id) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    updateBadgeCount(updatedNotifications); // Update badge count

    // เก็บ token ของผู้ใช้ที่อ่านการแจ้งเตือนนี้
    try {
      const userToken = "your_user_token_here"; // แทนที่ด้วย token ของผู้ใช้จริง
      await AsyncStorage.setItem(`notification_read_${id}`, userToken);
    } catch (error) {
      console.error("Error saving token:", error);
    }

    console.log(`Notification with ID ${id} was read.`);
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item.id)} style={styles.notificationItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{item.time}</Text>
      {item.read && <Text style={styles.readStatus}>อ่านแล้ว</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderTopWidth: 5,
    borderTopColor: "#ccc",
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
  readStatus: {
    marginTop: 5,
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default Notifications;
