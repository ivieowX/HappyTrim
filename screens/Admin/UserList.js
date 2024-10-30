import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    TextInput,
    Button,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native'; // นำเข้า useNavigation

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const navigation = useNavigation();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(
                "http://mgt2.pnu.ac.th/jakpong/6460704003/all-users.php"
            );
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
                setLoading(false);
            } else {
                console.error("API request failed"); 
                Alert.alert("Error", "API request failed"); 
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            Alert.alert("Error", "Error fetching data: " + error.message); 
        }
    };

    const deleteUser = async (userId) => {
        try {
            const response = await fetch(
                `http://mgt2.pnu.ac.th/jakpong/6460704003/delete_users.php?id=${userId}`
            );
            const data = await response.json();
            if (data.success) {
                setUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== userId)
                );
                alert("User deleted successfully!");
            } else {
                alert("User deletion failed. Please try again.");
            }
        } catch (error) {
            alert("An error occurred while deleting the user.");
        }
    };

    const handleModal = (user = null) => {
        setModalVisible(true);
        if (user) {
            setSelectedUser(user);
            setFormData({ name: user.name, email: user.email, password: "" });
        } else {
            setSelectedUser(null);
            setFormData({ name: "", email: "", password: "" });
        }
    };

    const handleSubmit = async () => {
        const url = `http://mgt2.pnu.ac.th/jakpong/6460704003/update_users.php?id=${selectedUser.id}`;
        const method = "POST"; // Use POST method for the update

        const body = {
            id: selectedUser.id,
            name: formData.name,
            email: formData.email,
            password: formData.password ? formData.password : undefined, // Include password if it's provided
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (data.success) {
                // Update user in the list
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === selectedUser.id
                            ? { ...user, name: formData.name, email: formData.email }
                            : user
                    )
                );
                alert("User updated successfully!");
            } else {
                alert("Update failed.");
            }
            setModalVisible(false);
        } catch (error) {
            alert("An error occurred.");
        }
    };

    const renderUserItem = ({ item }) => (
        <View style={styles.userContainer}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name} ({item.status})</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => deleteUser(item.id)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
                <View style={styles.spacer} />
                <TouchableOpacity onPress={() => handleModal(item)}>
                    <Ionicons name="create-outline" size={24} color="orange" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // Filter users based on the search query
    const filteredUsers = users.filter(user => {
        const userData = `${user.name.toLowerCase()} ${user.email.toLowerCase()}`;
        return userData.includes(searchQuery.toLowerCase());
    });

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="ค้นหา ชื่อ อีเมล..."
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)} // Update search query
            />
            <FlatList
                data={filteredUsers} // Use filtered users
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderUserItem}
            />
            {/* Modal สำหรับแก้ไขผู้ใช้ */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Name"
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Email"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                        />
                        <TextInput
                            style={styles.textInput}
                            secureTextEntry={true}
                            placeholder="New Password"
                            value={formData.password}
                            onChangeText={(text) => setFormData({ ...formData, password: text })}
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                title={selectedUser ? "Update" : "Add User"}
                                onPress={handleSubmit}
                            />
                            <View style={styles.spacer} />
                            <Button
                                title="Cancel"
                                onPress={() => setModalVisible(false)}
                                color="#db3541"
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 1,
    },
    userContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        marginVertical: 4,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    userEmail: {
        fontSize: 16,
        color: "#666",
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    spacer: {
        width: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    searchInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default UserList;
