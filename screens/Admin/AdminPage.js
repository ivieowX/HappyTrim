import React, { useEffect, useState } from "react";
import { Alert, BackHandler } from "react-native"; // เพิ่ม BackHandler
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Home from "./Home";
import ReportAdmin from "./ReportAdmin";
import Profile from "./Profile";
import Notifications from "./Notifications";

const Tab = createBottomTabNavigator();

const AdminPage = ({ route }) => {
  const navigation = useNavigation();
  const { Email, Name } = route.params;
  const { Weight, WeightGoal } = route.params;
  const { UserId, Height } = route.params;
  const [token, setToken] = useState("");

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


  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      const icons = {
        Home: "home",
        ReportAdmin: "document-text",
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
        initialParams={{ Email, Name }}
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
        name="ReportAdmin"
        component={ReportAdmin}
        initialParams={{ UserId, Email, Name, Weight, WeightGoal, Height }}
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

export default AdminPage;
