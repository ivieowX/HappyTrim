import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// AdminScreen
import AdminPage from "./screens/Admin/AdminPage";
import AdminExercises from './screens/Admin/Exercises';
import EditExercisesPlan from './screens/Admin/ExercisesPlan';
import AdminFood from './screens/Admin/FoodPlan';
import EditFoodPlan from './screens/Admin/FoodPlan';
import AdminScreenAbout from './screens/Admin/About';
// import AddUser from './screens/Admin/AddUser';
import UserList from './screens/Admin/UserList';
import UserDataTrim from './screens/Admin/UserDataTrim';
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HealthInfoScreen from "./screens/HealthInfoScreen";

// UserScreen
import UserPage from "./screens/User/UserPage";
import Exercises from './screens/components/Exercises';
import ExercisesPlan from './screens/components/ExercisesPlan';
import ExercisesCard from './screens/components/ExercisesLevel/Card';
import ExercisesEasy from './screens/components/ExercisesLevel/Easy';
import ExercisesMedium from './screens/components/ExercisesLevel/Medium';
import ExercisesHard from './screens/components/ExercisesLevel/Hard';
import ExercisesHistory from './screens/components/ExercisesHistory';

import Food from './screens/components/Food';
import FoodPlan from './screens/components/FoodPlan';
import FoodCard from './screens/components/Foods/Card';
import FoodBreakfast from './screens/components/Foods/Breakfast';
import FoodLunch from './screens/components/Foods/Lunch';
import FoodDinner from './screens/components/Foods/Dinner';
import FoodSnack from './screens/components/Foods/Snack';
import FoodHistory from './screens/components/FoodHistory';
import UserScreenAbout from './screens/User/About';
import ChangePass from './screens/User/ChangePass';
import UpdateProfile from './screens/User/UpdateProfile';
import UpdateReport from './screens/User/UpdateReport';

const Stack = createStackNavigator();

const horizontalAnimation = {
  gestureDirection: "horizontal",
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={horizontalAnimation} >
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: false,
            title: "หน้า LoginScreen",
            headerStyle: {
              backgroundColor: "#FF7F50",
            },
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerShown: true,
            title: "Login",
            headerStyle: {
              backgroundColor: "#288BFF",
            },
          }}
        />
        <Stack.Screen
          name="HealthInfo"
          component={HealthInfoScreen}
          options={{
            headerShown: true,
            title: "",
            headerStyle: {
              backgroundColor: "#288BFF",
            },
          }}
        />
        <Stack.Screen
          name="AdminPage"
          component={AdminPage}
          options={{
            headerShown: false,
            title: "หน้า Admin",
            headerStyle: {
              backgroundColor: "#FF7F50",
            },
          }}
        />
        <Stack.Screen
          name="UserPage"
          component={UserPage}
          options={{
            headerShown: false,
            title: "หน้า User",
            headerStyle: {
              backgroundColor: "#FF7F50",
            },
          }}
        />

        {/* Exercises Screen Admin */}
        <Stack.Screen name="AdminExercises" component={AdminExercises} />
        <Stack.Screen
          name="EditExercisesPlan"
          component={EditExercisesPlan}
          options={{
            headerShown: true,
            headerTitle: '',
            title: "เลือกระดับออกกำลังกาย",
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />

        {/* Exercises Screen User */}
        <Stack.Screen name="Exercises" component={Exercises} />
        <Stack.Screen
          name="ExercisesHistory"
          component={ExercisesHistory}
          options={{
            headerShown: true,
            title: "ประวัติการออกกำลังกาย",
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />
        <Stack.Screen
          name="ExercisesPlan"
          component={ExercisesPlan}
          options={{
            headerTransparent: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="ExercisesCard"
          component={ExercisesCard}
          options={{
            headerTransparent: true,
            headerTitle: "",
          }}
          
        />
        <Stack.Screen
          name="ExercisesEasy"
          component={ExercisesEasy}
          options={{
            headerShown: true,
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#e4e4e4",
            },
          }}
        />
        <Stack.Screen
          name="ExercisesMedium"
          component={ExercisesMedium}
          options={{
            headerShown: true,
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#e4e4e4",
            },
          }}
        />
        <Stack.Screen
          name="ExercisesHard"
          component={ExercisesHard}
          options={{
            headerShown: true,
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#e4e4e4",

            },
          }}
        />

        {/* Food Screen Admin */}
        <Stack.Screen name="AdminFood" component={AdminFood} />
        <Stack.Screen
          name="EditFoodPlan"
          component={EditFoodPlan}
          options={{
            headerShown: true,
            title: "บริโภคอาหาร",
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />

        {/* Food Screen User */}
        <Stack.Screen name="Food" component={Food} />
        <Stack.Screen
          name="FoodHistory"
          component={FoodHistory}
          options={{
            headerShown: true,
            title: "ประวัติการบริโภคอาหาร",
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />
        <Stack.Screen
          name="FoodPlan"
          component={FoodPlan}
          options={{
            headerTransparent: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="FoodCard"
          component={FoodCard}
          options={{
            headerTransparent: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="FoodBreakfast"
          component={FoodBreakfast}
          options={{
            headerShown: true,
            headerTitle: "อาหารเช้า",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 34,
            },
            headerStyle: {
              backgroundColor: "#e4e4e4",
            },
          }}
        />
        <Stack.Screen
          name="FoodLunch"
          component={FoodLunch}
          options={{
            headerShown: true,
            headerTitle: "อาหารเที่ยง",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 34,
            },
            headerStyle: {
              backgroundColor: "#e4e4e4",
            },
          }}
        />
        <Stack.Screen
          name="FoodDinner"
          component={FoodDinner}
          options={{
            headerShown: true,
            headerTitle: "อาหารเย็น",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 34,
            },
            headerStyle: {
              backgroundColor: "#e4e4e4",
            },
          }}
        />
        <Stack.Screen
          name="FoodSnack"
          component={FoodSnack}
          options={{
            headerShown: true,
            headerTitle: "อาหารว่าง",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 34,
            },
            headerStyle: {
              backgroundColor: "#e4e4e4",
            },
          }}
        />

        {/* About admin&user */}
        <Stack.Screen
          name="AdminScreenAbout"
          component={AdminScreenAbout}
          options={{
            headerShown: true,
            title: "About App",
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />
        <Stack.Screen
          name="UserScreenAbout"
          component={UserScreenAbout}
          options={{
            headerShown: true,
            title: "About App",
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />

        {/* userlist admin screen */}
        {/* <Stack.Screen
          name="AddUser"
          component={AddUser}
          options={{
            headerShown: true,
            title: "AddUser",
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        /> */}
        <Stack.Screen
          name="UserList"
          component={UserList}
          options={{
            headerShown: true,
            title: "ข้อมูลผู้ใช้",
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />

        <Stack.Screen
          name="UserDataTrim"
          component={UserDataTrim}
          options={{
            headerShown: true,
            title: "ข้อมูลผู้ใช้",
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />

        {/* UpdateProfile User */}
        <Stack.Screen
          name="ChangePass"
          component={ChangePass}
          options={{
            headerShown: true,
            title: "เปลี่ยนรหัสผ่าน",
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />
        <Stack.Screen
          name="UpdateProfile"
          component={UpdateProfile}
          options={{
            headerTransparent: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="UpdateReport"
          component={UpdateReport}
          options={{
            headerTransparent: true,
            headerTitle: "",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;