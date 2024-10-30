import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native';

const FoodPlan = () => {

  const navigation = useNavigation();

    const handleBreakfastPress = () => {
        navigation.navigate('FoodBreakfast');
    };
    const handleLunchPress = () => {
        navigation.navigate('FoodLunch');
    };
    const handleDinnerPress = () => {
        navigation.navigate('FoodDinner');
    };
    const handleSnackrPress = () => {
      navigation.navigate('FoodSnack');
  };
  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>FoodPlan</Text>
      <TouchableOpacity onPress={handleBreakfastPress} style={styles.button}>
        <Text style={styles.TextBtn}>อาหารเช้า</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLunchPress} style={styles.button}>
        <Text style={styles.TextBtn}>อาหารเที่ยง</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDinnerPress} style={styles.button}>
        <Text style={styles.TextBtn}>อาหารเย็น</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSnackrPress} style={styles.button}>
        <Text style={styles.TextBtn}>อาหารว่าง</Text>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
},
title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
},
button: {
    width: '80%',
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
},
TextBtn: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
},
});
export default FoodPlan