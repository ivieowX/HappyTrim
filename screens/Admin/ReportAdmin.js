import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get('window').width;

const ReportAdmin = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({ labels: [], counts: [] });
  const [loading, setLoading] = useState(true);
  const [totalLoginsThisMonth, setTotalLoginsThisMonth] = useState(0);
  const [totalLoginsLastMonth, setTotalLoginsLastMonth] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      fetch('http://mgt2.pnu.ac.th/jakpong/6460704003/user_login_history.php')
        .then((response) => response.json())
        .then((json) => {
          if (json.success) {
            const transformedData = transformData(json.loginData);
            setData(transformedData);
          } else {
            console.error('Failed to fetch data');
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    };

    // Fetch data initially
    fetchData();

    // Set interval for fetching data every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const transformData = (loginData) => {
    const dailyCounts = {};
    let totalLoginsThisMonth = 0;
    let totalLoginsLastMonth = 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    const lastYear = (currentMonth === 0) ? currentYear - 1 : currentYear;

    loginData.forEach((item) => {
      const date = new Date(item.date);
      const count = item.count;

      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        totalLoginsThisMonth += count;
      } else if (date.getMonth() === lastMonth && date.getFullYear() === lastYear) {
        totalLoginsLastMonth += count;
      }

      const dateString = date.toISOString().split('T')[0];

      if (dailyCounts[dateString]) {
        dailyCounts[dateString] += count;
      } else {
        dailyCounts[dateString] = count;
      }
    });

    const sortedDates = Object.keys(dailyCounts).sort();
    const counts = sortedDates.map((date) => dailyCounts[date]);

    setTotalLoginsThisMonth(totalLoginsThisMonth);
    setTotalLoginsLastMonth(totalLoginsLastMonth);

    return {
      labels: sortedDates,
      counts,
    };
  };

  const calculatePercentageChange = () => {
    if (totalLoginsLastMonth === 0) {
      return {
        percentage: totalLoginsThisMonth > 0 ? 100 : 0,
        message: totalLoginsThisMonth > 0 ? 'เพิ่มขึ้น' : 'ไม่เปลี่ยนแปลง',
      };
    }

    const percentage = ((totalLoginsThisMonth - totalLoginsLastMonth) / totalLoginsLastMonth) * 100;
    const message = percentage > 0 ? 'เพิ่มขึ้น' : 'ลดลง';

    return { percentage, message };
  };

  const { percentage, message } = calculatePercentageChange();


  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Daily User Logins</Text>
      <View style={styles.chartContainer}>
        <BarChart
          data={{
            labels: data.labels,
            datasets: [
              {
                data: data.counts,
              },
            ],
          }}
          width={screenWidth - 40}
          height={300}
          yAxisLabel=""
          yAxisSuffix=" คน"
          fromZero={true}
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chartStyle}
        />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          จำนวนผู้ล็อกอินในเดือนนี้: {totalLoginsThisMonth} คน
        </Text>
        <Text style={styles.statsText}>
          เปอร์เซ็นต์การเปลี่ยนแปลง: {percentage.toFixed(0)}% ({message})
        </Text>
      </View>


      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserDataTrim')}>
        <Text style={styles.buttonText}> ข้อมูลผู้ใช้ </Text>
        <Ionicons name="people-outline" size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: "bold",
    color: '#343a40',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  chartStyle: {
    borderRadius: 16,
    elevation: 4, // Shadow for Android
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statsText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 5,
    color: '#495057',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginRight: 10,
  },
});

export default ReportAdmin;
