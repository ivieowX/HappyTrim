import { View, Text, StyleSheet, RefreshControl, ScrollView, FlatList,Alert,BackHandler,Dimensions, } from 'react-native';
import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect  } from "@react-navigation/native";
import Exercises from "./Exercises";
import Food from "./Food";

const Home = ({ route }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState("");
  const [email, setEmail] = useState(route.params.Email);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkToken(); // Check token when the component mounts
    fetchData(); // Fetch data on mount
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

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        // If no token exists, navigate the user to the login screen
        navigation.replace("LoginScreen");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = () => {
    fetch("http://mgt2.pnu.ac.th/jakpong/6460704003/profile.php?email=" + email)
      .then((response) => response.json())
      .then((json) => {
        setUser(json);
        setRefreshing(false); // Stop the refreshing spinner after data is fetched
      })
      .catch((error) => {
        console.error(error);
        setRefreshing(false); // Stop the refreshing spinner even if there's an error
      });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(); // Fetch new data
    setRefreshing(false);
  };
  const profileData = [
    { key: "2", label: "ชอ:", value: user.name || "N/A" },
  ];
  const renderItem = ({ item }) => (
    <View>
      <Text style={styles.greetingText}>{item.value}!</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={styles.logoText}>สวัสดีคุณ(แอดมิน)</Text>
        <FlatList
          data={profileData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </View>
      <View style={styles.cardExercises}>
        <Exercises />
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
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    width: "100%",
    height: "10%",
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  cardExercises: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    marginBottom: 150,
  },
});

export default Home;
