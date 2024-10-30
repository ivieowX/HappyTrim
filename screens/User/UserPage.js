import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Home from "./Home";
import ReportUser from "./ReportUser";
import Profile from "./Profile";
import Notifications from "./Notifications";

const Tab = createBottomTabNavigator();

const UserPage = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { UserId, Email, Name, Weight, Height, WeightGoal, Gender, Age } = route.params;
  const [token, setToken] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (!storedToken) {
          navigation.replace("LoginScreen");
        } else {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error checking token:", error);
        Alert.alert("Error", "An error occurred while checking the token.");
      }
    };
    checkToken();
  }, [navigation]);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await fetch('http://mgt2.pnu.ac.th/jakpong/6460704003/get_notifications.php');
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUnreadNotifications();
    }
  }, [isFocused]);

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      const icons = {
        Home: "home",
        Report: "document-text",
        Notifications: "notifications",
        Profile: "person",
      };
      return <Ionicons name={icons[route.name]} color={color} size={size} />;
    },
    tabBarActiveTintColor: "#288BFF",
    tabBarInactiveTintColor: "black",
    tabBarStyle: {
      position: "absolute",
      backgroundColor: "#ffffff",
      paddingBottom: 8,
      margin: 10,
      height: 60,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      paddingVertical: 5,
    },
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen 
        name="Home" 
        component={Home}
        initialParams={{ UserId, Email, Name }}
        options={{
          headerShown: true,
          headerTitle: "Home",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 44,
            color: "#288BFF",
          },
          headerStyle: {
            backgroundColor: "#f0f0f0",
          },
        }} 
      />
      <Tab.Screen 
        name="Report"
        component={ReportUser}
        initialParams={{ UserId, Email, Name, Weight, WeightGoal, Height, Gender, Age }}
        options={{
          headerShown: true,
          headerTitle: "รายงานผล",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 44,
            color: "#288BFF",
          },
          headerStyle: {
            backgroundColor: "#f0f0f0",
          },
        }} 
      />
      <Tab.Screen 
        name="Notifications" 
        component={Notifications} 
        options={{
          headerShown: true,
          headerTitle: "แจ้งเตือน",
          headerTitleAlign: "center",
          tabBarBadge: unreadCount > 0 ? unreadCount : null,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 44,
            color: "#288BFF",
          },
          headerStyle: {
            backgroundColor: "#f0f0f0",
          },
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        initialParams={{ UserId, Email, Name }}
        options={{
          headerShown: true,
          headerTitle: "Profile",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 44,
            color: "#288BFF",
          },
          headerStyle: {
            backgroundColor: "#f0f0f0",
          },
        }} 
      />
    </Tab.Navigator>
  );
};

export default UserPage;
