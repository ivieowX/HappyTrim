import { View, TouchableOpacity, Text, ImageBackground, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const Food = () => {
    const navigation = useNavigation();

    const handleHistoryPress = () => {
        navigation.navigate('FoodHistory');
    };
    const handlePlanPress = () => {
        navigation.navigate('FoodPlan');
    };
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('./images/Food.png')}
                style={styles.image}>
                <TouchableOpacity onPress={handleHistoryPress} style={styles.button}>
                    <Text style={styles.TextBtn}>ประวัติ</Text>
                </TouchableOpacity>

                <View style={styles.spacer} />

                <TouchableOpacity onPress={handlePlanPress} style={styles.button}>
                    <Text style={[styles.TextBtn, { backgroundColor: 'white' }]}>เข้าดู</Text>
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
        width: 125,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    spacer: {
        flex: 1,
    },
});

export default Food