/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Image, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import foodPage from './Screens/Food';
import HomePage from './Screens/Home';
import CalendarPage from './Screens/Calendar';
import Individual from './Screens/Individual';
import SettingsPage from './Screens/Settings';
import AddPage from './Screens/Add';

const HomeStack = createNativeStackNavigator();
const StackHome = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomePage}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

const CalendarStack = createNativeStackNavigator();
const StackCalendar = () => {
  return (
    <CalendarStack.Navigator>
      <CalendarStack.Screen
        name="CalendarScreen"
        component={CalendarPage}
        options={{headerShown: false}}
      />
      <CalendarStack.Screen
        name="IndividualScreen"
        component={Individual}
        options={({route}) => ({title: route.params.title})}
      />
      <CalendarStack.Screen
        name="AddPage"
        component={AddPage}
        options={({route}) => ({title: route.params.title})}
      />
    </CalendarStack.Navigator>
  );
};

const FoodStack = createNativeStackNavigator();
const StackFood = () => {
  return (
    <FoodStack.Navigator>
      <FoodStack.Screen
        name="FoodScreen"
        component={foodPage}
        options={{headerShown: false}}
      />
      <FoodStack.Screen name="Settings" component={SettingsPage} />
      <FoodStack.Screen
        name="IndividualScreen"
        component={Individual}
        options={({route}) => ({title: route.params.title})}
      />
    </FoodStack.Navigator>
  );
};

const App: () => Node = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={StackHome}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View>
                <Image
                  source={require('./Img/Home.png')}
                  resizeMode="contain"
                  style={{
                    height: 30,
                    width: 30,
                    tintColor: focused ? '#007AFF' : 'black',
                  }}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={StackCalendar}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View>
                <Image
                  source={require('./Img/Calendar.png')}
                  resizeMode="contain"
                  style={{
                    height: 30,
                    width: 30,
                    tintColor: focused ? '#007AFF' : 'black',
                  }}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Food"
          component={StackFood}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View>
                <Image
                  source={require('./Img/Food.png')}
                  resizeMode="contain"
                  style={{
                    height: 30,
                    width: 30,
                    tintColor: focused ? '#007AFF' : 'black',
                  }}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
