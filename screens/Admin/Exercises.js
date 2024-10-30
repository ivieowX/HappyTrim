import { View, TouchableOpacity, Text, ImageBackground, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const Exercises = () => {
  const navigation = useNavigation();

  const handleEditPlanPress = () => {
    navigation.navigate('EditExercisesPlan');
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('./images/Exercises.png')} style={styles.image}>
        <TouchableOpacity onPress={handleEditPlanPress} style={styles.button}>
          <Text style={[styles.TextBtn,{backgroundColor: 'red'}]}>แก้ไข</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  button: {
    flex: 2,
    flexDirection: 'column-reverse',
  },
  TextBtn: {
    width: 315,
    height: 40,
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'gray',
    borderRadius: 25,
    marginHorizontal: '5%',
    marginBottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    lineHeight: 40,
    fontWeight: "bold",
  },
  spacer: {
    flex: 1,
  },
});

export default Exercises;
