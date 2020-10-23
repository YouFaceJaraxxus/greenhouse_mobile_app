import React, {Component} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainApp from './components/MainApp';
import LoginScreen from './components/LoginScreen';

const Tab = createMaterialTopTabNavigator();




class App extends Component {
  

  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen 
            name="LoginScreen" 
            component={LoginScreen} 
            options={{ title: 'Login' }}
          />
          <Stack.Screen 
            name="MainApp" 
            component={MainApp}
            options={{ title: 'E-greenhouse' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}


export default App;

const Stack = createStackNavigator();