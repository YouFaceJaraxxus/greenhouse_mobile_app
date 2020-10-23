import React, {Component} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {  SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import State from './State';
import Preferences from './Preferences';
import Settings from './Settings';
import CustomContext from './CustomContext';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import ChartScreen from './ChartScreen';
const Tab = createMaterialTopTabNavigator();

class MainApp extends Component {
    state={
        data:null,
        setContextData:(newData)=>{
          this.setState({
            data:newData
          })
        },
        brain_icon : require("../assets/brain_icon.png"),
        humidity_gauge_icon : require("../assets/humidity_gauge_icon.png"),
        humidity_icon : require("../assets/humidity_icon.png"),
        robot_icon : require("../assets/robot_icon.png"),
        soil_humidity_gauge_icon : require("../assets/soil_humidity_gauge_icon.png"),
        soil_icon : require("../assets/soil_icon.jpg"),
        state_icon : require("../assets/state_icon.png"),
        temperature_gauge_icon : require("../assets/temperature_gauge_icon.png"),
        temperature_icon : require("../assets/temperature_icon.png")
      }
      static navigationOptions = {
        title: "E-greenhouse"
      };
    render() { 
        return ( 
            <CustomContext.Provider value={this.state}>
                <SafeAreaProvider style={{ flex: 1 }}>
                    <SafeAreaView style={{ flex: 1 }}>
                      <NavigationContainer style={{flex:1}} independent={true}>
                          <Tab.Navigator style={{flex:1}}>
                          <Tab.Screen name="State" component={State} style={{flex:1}}/>
                          <Tab.Screen name="Preferences" component={Preferences} style={{flex:1}}/>
                          <Tab.Screen name="Settings" component={Settings} style={{flex:1}}/>
                          <Tab.Screen name="Data" component={ChartScreen} style={{flex:1}}/>
                          </Tab.Navigator>
                      </NavigationContainer>
                    </SafeAreaView>
                </SafeAreaProvider>
            </CustomContext.Provider>
         );
    }
}
 
export default MainApp;