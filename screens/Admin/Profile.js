import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  RefreshControl,
  ScrollView,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Entypo, Feather } from "@expo/vector-icons";

const Profile = ({ route }) => {
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
      // Fetch data again when coming back to the screen
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

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
    { key: "3", label: "อเมล:", value: route.params.Email || "N/A" },
  ];
  const renderItem = ({ item }) => (
    <View>
      <Text style={styles.profileEmail}>{item.value}</Text>
    </View>
  );

  const handleAdminAboutPress = () => {
    navigation.navigate('AdminScreenAbout');
  };
  const handleUserListPress = () => {
    navigation.navigate('UserList');
  };

  const handleChangePassPress = () => {
    navigation.navigate("ChangePass");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <View style={styles.profileDetails}>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            style={styles.profileImage}
          />
          <FlatList
            data={profileData}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
          <TouchableOpacity
            style={styles.editprofile}
            onPress={() =>
              navigation.navigate("UpdateProfile", {
                name: user.name,
                Email: route.params.Email,
                id: user.id,
                age: user.age,
              })
            }
          >
            <Ionicons name="create-outline" size={26} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Admin */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin</Text>
        <TouchableOpacity style={styles.row} onPress={handleUserListPress}>
          <Ionicons name="people-outline" size={24} color="black" />
          <Text style={styles.rowText}>ข้อมูลผู้ใช้</Text>
          <Entypo name="chevron-right" size={24} color="black" style={styles.rowIconRight} />
        </TouchableOpacity>
      </View>

      {/* General Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Settings</Text>
        <TouchableOpacity style={styles.row} 
         onPress={() =>
          navigation.navigate("ChangePass", {
            id: user.id,
            password: user.password
          })
        }>
          <Ionicons name="key-outline" size={24} color="black" />
          <Text style={styles.rowText}>เปลี่ยนรหัสผ่าน</Text>
          <Entypo name="chevron-right" size={24} color="black" style={styles.rowIconRight} />
        </TouchableOpacity>
      </View>

      {/* Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Information</Text>
        <TouchableOpacity style={styles.row} onPress={handleAdminAboutPress}>
          <Ionicons name="information-circle-outline" size={24} color="black" />
          <Text style={styles.rowText}>เกี่ยวกับแอป</Text>
          <Entypo name="chevron-right" size={24} color="black" style={styles.rowIconRight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Feather name="share" size={24} color="black" />
          <Text style={styles.rowText}>Share This App</Text>
          <Entypo name="chevron-right" size={24} color="black" style={styles.rowIconRight} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Ionicons name="log-out" size={26} color="white" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  profileContainer: {
    padding: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginBottom: 20,
  },
  profileDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "black",
  },
  profileEmail: {
    width: 250,
    color: "gray",
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  rowText: {
    fontSize: 16,
    marginLeft: 10,
    color: "black",
    flex: 1,
  },
  rowIconRight: {
    marginLeft: "auto",
  },
  button: {
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    width: 150,
    marginHorizontal: 100,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 22,
    marginLeft: 10,
  },
});

export default Profile;
