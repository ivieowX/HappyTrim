import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
    Alert,
    BackHandler,
    Dimensions,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Exercises from "../components/Exercises";
import Food from "../components/Food";

const { width, height } = Dimensions.get("window");

const Home = ({ route,UserId }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState("");
  const [Name] = useState("");
  const [email, setEmail] = useState(route.params.Email);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("ออกจากแอป", "คุณต้องการออกจากแอปหรือไม่?", [
          {
            text: "ยกเลิก",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "ตกลง",
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  const fetchData = () => {
    fetch(
      "http://mgt2.pnu.ac.th/jakpong/6460704003/profile.php?email=" + email
    )
      .then((response) => response.json())
      .then((json) => {
        setUser(json);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error(error);
        setRefreshing(false);
      });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  const profileData = [{ key: "2", label: "ชื่อ:", value: user.name || "N/A" }];

  const renderItem = ({ item }) => (
    <View>
      <Text style={styles.greetingText}>{item.value}!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={styles.logoText}>สวัสดีคุณ</Text>
        <FlatList
          data={profileData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          scrollEnabled={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </View>
      <View style={styles.cardExercises}>
        <Exercises/>
      </View>
      <View style={styles.card}>
        <Food />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05, // Adjust padding based on screen width
    paddingVertical: height * 0.02, // Adjust padding based on screen height
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginBottom: 80,
  },
  greetingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: height * 0.01,
    width: "100%",
    height: height * 0.1, // Adjust height based on screen height
  },
  logoText: {
    fontSize: width * 0.05, // Adjust font size based on screen width
    fontWeight: "bold",
    color: "black",
  },
  greetingText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "black",
  },
  cardExercises: {
    flex: 1,
    width: "100%",
    marginBottom: height * 0.02,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    padding: width * 0.03, // Adjust padding based on screen width
  },
  card: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    marginBottom: height * 0.05, // Adjust margin based on screen height
    padding: width * 0.03,
  },
});

export default Home;
