import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  RefreshControl,
} from "react-native";
import RNSpeedometer from "react-native-speedometer";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from 'moment';

const ReportUser = ({ route }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState("");
  const [groupedFoodHistory, setGroupedFoodHistory] = useState([]);
  const [groupedExercisesHistory, setGroupedExercisesHistory] = useState([]);
  const [email, setEmail] = useState(route.params.Email);
  const { UserId, Name, Height, Weight, WeightGoal, age, gender } = route.params;
  const [bmiValue, setBmiValue] = useState(0.0);
  const [bmrValue, setBmrValue] = useState(0);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    checkToken();
    fetchData();
    fetchGroupedExercisesHistory();
    fetchGroupedFoodHistory();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
      fetchGroupedExercisesHistory();
      fetchGroupedFoodHistory();
    });
    return unsubscribe;
  }, [navigation]);
  // ReportUser.js
useEffect(() => {
  const checkLastWeightUpdate = async () => {
    const lastUpdateDate = await AsyncStorage.getItem("lastWeightUpdate");
    if (lastUpdateDate) {
      const now = new Date();
      const diffTime = Math.abs(now - new Date(lastUpdateDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 7) {
        AsyncStorage.setItem("needWeightUpdate", "true");
      }
    }
  };
  checkLastWeightUpdate();
}, []);


  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        navigation.replace("LoginScreen");
      }
    } catch (error) {
      console.error(error);
    }
  };


  const fetchData = () => {
    fetch(`http://mgt2.pnu.ac.th/jakpong/6460704003/profile.php?email=${email}`)
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
  };

  const calculateBMI = () => {
    const weight = parseFloat(user.weight);
    const heightMeters = parseFloat(user.height) / 100;

    if (!isNaN(weight) && !isNaN(heightMeters) && heightMeters > 0) {
      const newBMI = weight / (heightMeters * heightMeters);
      setBmiValue(newBMI);
    }
  };

  const calculateBMR = () => {
    const weight = parseFloat(user.weight);
    const height = parseFloat(user.height);
    const age = parseInt(user.age);

    if (!isNaN(weight) && !isNaN(height) && !isNaN(age)) {
      let bmr = 0;
      if (user.gender === "male") {
        // ใช้สูตร BMR สำหรับผู้ชาย
        bmr = 66 + (13.7 * weight) + (5 * height) - (6.8 * age);
      } else if (user.gender === "female") {
        // ใช้สูตร BMR สำหรับผู้หญิง
        bmr = 665 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
      }
      setBmrValue(bmr);
    }
  };


  useEffect(() => {
    calculateBMI();
    calculateBMR();
  }, [user.weight, user.height, user.age, user.gender]);

  const weightArrow = parseFloat(user.weight) > parseFloat(WeightGoal) ? "\u2193" : "\u2191";
  const textArrow = parseFloat(user.weight) > parseFloat(WeightGoal) ? "คุณต้องลดน้ำหนัก" : "คุณต้องเพิ่มน้ำหนัก";

  const profileData = [
    { key: "1", label: "น้ำหนักปัจจุบัน (ก.ก.)", value: user.weight || "N/A" },
    { key: "2", label: "เป้าหมาย น้ำหนัก (ก.ก.)", value: user.weight_goal || "N/A" },
    { key: "3", label: "ส่วนสูงปัจจุบัน (ซ.ม.)", value: user.height || "N/A" },
    { key: "4", label: "อายุ (ปี)", value: user.age || "N/A" },
    { key: "5", label: "BMR (กิโลแคลอรี่)", value: bmrValue ? bmrValue.toFixed(1) : "N/A" },
  ];

  const filteredData = profileData.filter((item) => ["1", "2", "3"].includes(item.key));

  const renderItem = ({ item }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.inputRow}>{item.value}</Text>
    </View>
  );
  const calculateTDEE = (bmr, activityLevel) => {
    let factor = 1.2; // ค่าเริ่มต้นสำหรับคนไม่ออกกำลังกายเลย

    switch (activityLevel) {
      case "light":
        factor = 1.375;
        break;
      case "moderate":
        factor = 1.55;
        break;
      case "very":
        factor = 1.725;
        break;
      case "super":
        factor = 1.9;
        break;
      default:
        factor = 1.2; // กรณีไม่ได้ระบุ level ใช้ค่าเริ่มต้น
        break;
    }

    return bmr * factor;
  };

  // คำนวณ TDEE และแสดงผลลัพธ์
  const tdeeValue = calculateTDEE(bmrValue, user.activityLevel); // user.activityLevel ควรเป็นค่าเช่น 'light', 'moderate', 'very', 'super'

  const fetchGroupedExercisesHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('groupedExerciseHistory');
      if (historyData) {
        const parsedHistory = JSON.parse(historyData);
        const groupedByLevel = parsedHistory.reduce((acc, item) => {
          if (!acc[item.level]) {
            acc[item.level] = {
              date: item.date,
              level: item.level,
              totalCalories: 0,
            };
          }
          acc[item.level].totalCalories += item.totalCalories;
          return acc;
        }, {});

        setGroupedExercisesHistory(Object.values(groupedByLevel));
      }
    } catch (error) {
      console.error("Error fetching grouped exercise history:", error);
    }
  };

  const fetchGroupedFoodHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const historyData = await AsyncStorage.getItem(`foodHistory_${token}`);
      if (historyData) {
        const parsedHistory = JSON.parse(historyData);
        const groupedByDate = parsedHistory.reduce((acc, item) => {
          const date = item.date;
          const calories = parseFloat(item.calorie);

          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += calories;
          return acc;
        }, {});

        const groupedArray = Object.keys(groupedByDate).map(date => ({
          date,
          totalCalories: groupedByDate[date],
        }));

        setGroupedFoodHistory(groupedArray);
      }
    } catch (error) {
      console.error("Error fetching grouped food history:", error);
    }
  };
  const renderExercisesHistory = () => (
    <View style={styles.caloriesHistoryContainer}>
      <Text style={styles.sectionTitle}>แคลอรี่รวมที่เผาผลาญตามระดับ</Text>
      {groupedExercisesHistory.map((item, index) => (
        <View key={index} style={styles.caloriesRow}>
          <Text style={styles.dateText}>{item.date} | {item.level}</Text>
          <Text style={styles.caloriesText}> | จำนวน {item.totalCalories} kcal</Text>
        </View>
      ))}
    </View>
  );


  // Render total calories burned per day

  const renderFoodHistory = () => (
    <View style={styles.caloriesHistoryContainer}>
      <Text style={styles.sectionTitle}>ปริมาณแคลอรี่รวมที่บริโภคต่อวัน</Text>
      {groupedFoodHistory.map((item, index) => (
        <View key={index} style={styles.caloriesRow}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.caloriesText}> | รวมแคลอรี่ที่บริโภค {item.totalCalories} kcal</Text>
        </View>
      ))}
    </View>
  );

  const renderNetCalories = () => {
    const netCaloriesData = groupedFoodHistory.map((foodItem) => {
      const exerciseItem = groupedExercisesHistory.find(
        (exercise) => exercise.date === foodItem.date
      );
      const netCalories =
        foodItem.totalCalories - (exerciseItem ? exerciseItem.totalCalories : 0);
      return {
        date: foodItem.date,
        netCalories,
      };
    });

    return (
      <View style={styles.totalCaloriesContainer}>
        <Text style={styles.sectionTitle}>ปริมาณแคลอรี่สุทธิต่อวัน</Text>
        {netCaloriesData.map((item, index) => (
          <View key={index} style={styles.caloriesRow}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.caloriesText}> | แคลอรี่สุทธิ {item.netCalories} kcal</Text>
          </View>
        ))}
      </View>
    );
  };

  const groupByWeek = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      // Specify the input format to ensure correct parsing
      const date = moment(item.date, "DD/MM/YYYY").startOf('isoWeek').format('YYYY-MM-DD');
      
      if (!groupedData[date]) {
        groupedData[date] = { totalCalories: 0 };
      }
      groupedData[date].totalCalories += item.totalCalories;
    });

    return Object.entries(groupedData).map(([date, values]) => ({
      date,
      totalCalories: values.totalCalories,
    }));
  };

  const renderWeeklyReport = () => {
    const weeklyFoodHistory = groupByWeek(groupedFoodHistory);
    const weeklyExerciseHistory = groupByWeek(groupedExercisesHistory);

    return (
      <View style={styles.reportWeek}>
        <Text style={styles.sectionTitle}>รายงานแคลอรี่รายสัปดาห์</Text>
        {weeklyFoodHistory.map((foodItem, index) => {
          const exerciseItem = weeklyExerciseHistory.find(
            (exercise) => exercise.date === foodItem.date
          );
          const netCalories = foodItem.totalCalories - (exerciseItem ? exerciseItem.totalCalories : 0);
          return (
            <View key={index} style={styles.reportRow}>
              <Text style={styles.dateText}>{`สัปดาห์ที่เริ่มวันที่ ${foodItem.date}`}</Text>
              <Text style={styles.caloriesText}>แคลอรี่บริโภค: {foodItem.totalCalories} kcal</Text>
              <Text style={styles.caloriesText}>แคลอรี่เผาผลาญ: {exerciseItem ? exerciseItem.totalCalories : 0} kcal</Text>
              <Text style={styles.caloriesText}>แคลอรี่สุทธิ: {netCalories} kcal</Text>
              <Text style={styles.lineHeightText}></Text>
            </View>
          );
        })}
      </View>

    );
  };
  const groupByMonth = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      // เพิ่มฟอร์แมตวันที่ให้ชัดเจน
      const month = moment(item.date, "DD/MM/YYYY").startOf('month').format('YYYY-MM');
      if (!groupedData[month]) {
        groupedData[month] = { totalCalories: 0 };
      }
      groupedData[month].totalCalories += item.totalCalories;
    });

    return Object.entries(groupedData).map(([date, values]) => ({
      date,
      totalCalories: values.totalCalories,
    }));
  };

  const renderMonthlyReport = () => {
    const monthlyFoodHistory = groupByMonth(groupedFoodHistory);
    const monthlyExerciseHistory = groupByMonth(groupedExercisesHistory);

    return (
      <View style={styles.reportWeek}>
        <Text style={styles.sectionTitle}>รายงานแคลอรี่รายเดือน</Text>
        {monthlyFoodHistory.map((foodItem, index) => {
          const exerciseItem = monthlyExerciseHistory.find(
            (exercise) => exercise.date === foodItem.date
          );
          const netCalories = foodItem.totalCalories - (exerciseItem ? exerciseItem.totalCalories : 0);
          return (
            <View key={index} style={styles.reportRow}>
              <Text style={styles.dateText}>{`เดือน ${foodItem.date}`}</Text>
              <Text style={styles.caloriesText}>แคลอรี่บริโภค: {foodItem.totalCalories} kcal</Text>
              <Text style={styles.caloriesText}>แคลอรี่เผาผลาญ: {exerciseItem ? exerciseItem.totalCalories : 0} kcal</Text>
              <Text style={styles.caloriesText}>แคลอรี่สุทธิ: {netCalories} kcal</Text>
              <Text style={styles.lineHeightText}></Text>
            </View>
          );
        })}
      </View>
    );
  };



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputBox}>
          <Text style={styles.sectionTitle}>น้ำหนักและส่วนสูง</Text>
          <Text style={styles.sectionTitle}>ของคุณ {user.name}</Text>
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            scrollEnabled={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            horizontal={true}
          />
          <View style={styles.arrowContainer}>
            <Text style={styles.weightArrow}>{weightArrow}</Text>
            <Text style={styles.textArrow}>{textArrow}</Text>
            <TouchableOpacity
              style={styles.editprofile}
              onPress={() =>
                navigation.navigate("UpdateReport", {
                  weight: user.weight,
                  weight_goal: user.weight_goal,
                  height: user.height,
                  age: user.age,
                  gender: user.gender,
                  Email: route.params.Email,
                  id: user.id,
                })
              }
            >
              <Text style={styles.textUpdate}>อัปเดต <Ionicons name="create-outline" size={22} color="black" /></Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.speedometerBox}>
          <RNSpeedometer
            value={bmiValue}
            size={250}
            minValue={10.5}
            maxValue={40.0}
            allowedDecimals={1}
            labels={speedometerLabels}
          />
          <Text style={styles.bmiText}>BMI = {bmiValue.toFixed(1)}</Text>

          <View style={styles.arrowContainer}>
            {renderLabel("ผอม", styles.textBlack)}
            {renderLabel("ปกติ", styles.textGreen)}
            {renderLabel("เริ่มอ้วน", styles.textYellow)}
            {renderLabel("อ้วน", styles.textOrange)}
            {renderLabel("อ้วนมาก", styles.textRed)}
          </View>
        </View>
        <View style={styles.bmrBox}>
          <Text style={styles.sectionTitleBmr}> ปริมาณแคลอรี่ที่ร่างกายที่ต้องเผาผลาญต่อวัน </Text>
          <Text style={styles.bmrText}>BMR = {bmrValue.toFixed(0)} (kcal)</Text>
          <Text style={styles.sectionTitleBmr}>ปริมาณแคลอรี่ที่ควรบริโภคต่อวัน</Text>
          <Text style={styles.tdeeText}>TDEE = {tdeeValue.toFixed(0)} kcal/วัน</Text>
          <Text style={styles.tdeeDescription}>
            {`พลังงานที่ควรบริโภคเพื่อรักษาน้ำหนัก`}
          </Text>
        </View>
        {renderExercisesHistory()}
        {renderFoodHistory()}
        {renderNetCalories()}
        {renderWeeklyReport()}
        {renderMonthlyReport()}
        <View style={styles.tdeeBox}>

        </View>


      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const renderLabel = (text, style) => (
  <Text style={style}>{text}</Text>
);

const speedometerLabels = [
  { name: "ผอม", labelColor: "black", activeBarColor: "black", minValue: 10.5, maxValue: 18.5 },
  { name: "ปกติ", labelColor: "#15bc11", activeBarColor: "#15bc11", minValue: 18.5, maxValue: 25.0 },
  { name: "เริ่มอ้วน", labelColor: "#ebbd07", activeBarColor: "#ebbd07", minValue: 25.0, maxValue: 30.0 },
  { name: "อ้วน", labelColor: "#ff7714", activeBarColor: "#ff7714", minValue: 30.0, maxValue: 35.0 },
  { name: "อ้วนมาก", labelColor: "#ff0000", activeBarColor: "#ff0000", minValue: 35.0, maxValue: 40.0 },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inputBox: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
    marginVertical: 10,
    elevation: 5,
    height: 310,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  sectionTitleBmr: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: "center",
    width: 90,
    height: 130,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    paddingTop: 15,
    color: "#666",
    textAlign: "center",
  },
  input: {
    color: "black",
    borderRadius: 10,
    fontSize: 38,
    textAlign: "center",
  },
  inputRow: {
    color: "black",
    borderRadius: 10,
    fontSize: 38,
    textAlign: "center",
  },
  arrowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  weightArrow: {
    fontSize: 40,
    color: "#ff0000",

  },
  textArrow: {
    fontSize: 16,
    color: "black",
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  editprofile: {
    backgroundColor: "red",
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  textUpdate: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  speedometerBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    alignItems: "center",
    elevation: 5,
  },
  bmiText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 50,
  },
  bmrBox: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 10,
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
  },
  bmrText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderRightColor: "#ccc",
  },
  tdeeBox: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tdeeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  tdeeDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4a4a4a",
    marginBottom: 10,
  },
  textBlack: {
    backgroundColor: "black",
    fontSize: 16,
    color: "white",
    padding: 5,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  textGreen: {
    backgroundColor: "#15bc11",
    fontSize: 16,
    color: "white",
    padding: 5,
    borderRadius: 25,

  },
  textYellow: {
    backgroundColor: "#ebbd07",
    fontSize: 16,
    color: "white",
    padding: 5,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  textOrange: {
    backgroundColor: "#ff7714",
    fontSize: 16,
    color: "white",
    padding: 5,
    borderRadius: 25,
  },
  textRed: {
    backgroundColor: "#ff0000",
    fontSize: 16,
    color: "white",
    padding: 5,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  caloriesHistoryContainer: {
    width: 320,
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 5,
  },
  reportWeek:{
    width: 320,
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 5,
  },
  totalCaloriesContainer: {
    width: 320,
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 5,
  },
  caloriesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  reportRow: {
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  caloriesText: {
    fontSize: 16,
    color: "#333",
  },
  lineHeightText:{
    borderBottomWidth: 1,
    borderRightColor: "#ccc",
  }
});

export default ReportUser;