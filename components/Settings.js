import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  AsyncStorage,
} from "react-native";
import SettingsContainer from "./SettingsContainer";
import Title from "./Title";
import CustomContext from "./CustomContext";
import axios from "axios";
import qs from "qs";
import Constants from "../config";
import { ScrollView } from "react-native-gesture-handler";


class Settings extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      refreshing: false,
      changeAutoMode: true,
      changeDoor: false,
      changeWater: false,
      changeWantedTemperature: "25",
      changeWantedHumidity: "40",
      changeWantedGroundHumidity: "25",
      auth:null
    };
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.getData();
  };

  getData = () => {
    AsyncStorage.getItem("auth").then((auth) => {
      if (auth) {
        this.setState({
          refreshing: true,
        });
        let data = qs.stringify({
          auth: auth
        });
        axios
          .post(Constants.DATA_SERVER + "data-new", data)
          .then((response) => {
            let dataObject = response.data.data;
            dataObject = Object.assign(response.data.settings, dataObject);
            this.setState({
              data: null,
              refreshing: false,
              auth:auth
            });
            this.setState({
              data: dataObject,
            });
            this.context.setContextData(dataObject);
          })
          .catch((error) => {
            console.log("ERROR", error);
          });
      }
    })
    .catch(error=>{
        console.log("ERROR", error);
    });
  };

  componentDidMount() {
    if (this.context.data != null) {
      this.setState({
        data: this.context.data,
        changeWantedTemperature: this.context.data.wntTmp || 25,
        changeWantedHumidity: this.context.data.wntHum || 40,
        changeWantedGroundHumidity: this.context.data.wntGHum || 25,
        changeAutoMode: this.context.data.aut == "1",
        changeWater: parseInt(this.context.data.act % 10) == 2,
        changeDoor: parseInt(this.context.data.act / 10) == 1,
      });
    } else {
      this.getData();
    }
  }

  toggleAutoMode = () => {
    this.setState({
      changeAutoMode: !this.state.changeAutoMode,
    });
  };
  toggleDoor = () => {
    this.setState({
      changeDoor: !this.state.changeDoor,
    });
  };
  toggleWater = () => {
    this.setState({
      changeWater: !this.state.changeWater,
    });
  };

  sendData = () => {
    this.setState({
      refreshing: true,
    });
    let aut = this.state.changeAutoMode ? 1 : 0;
    let changeDoor = this.state.changeDoor ? 10 : 20;
    let changeWater = this.state.changeWater ? 2 : 1;
    let act = parseInt(changeDoor) + parseInt(changeWater);
    let data = qs.stringify({
      wntTmp: String(this.state.changeWantedTemperature),
      wntHum: String(this.state.changeWantedHumidity),
      act: act,
      aut: aut,
      wntGHum: String(this.state.changeWantedGroundHumidity),
      auth: this.state.auth,
    });
    axios
      .post(Constants.DATA_SERVER + "settings", data)
      .then((response) => {
        this.setState({
          data: response.data,
          refreshing: false,
        });
        this.context.setContextData(response.data);
      })
      .catch((error) => {
        console.log("POST ERROR", error);
      });
  };

  changeTmpHandler = (temperature) => {
    this.setState({
      changeWantedTemperature: temperature,
    });
  };
  changeHumHandler = (humidity) => {
    this.setState({
      changeWantedHumidity: humidity,
    });
  };
  changeGHumHandler = (gHumidity) => {
    this.setState({
      changeWantedGroundHumidity: gHumidity,
    });
  };

  render() {
    let data = this.state.data;
    return (
      <View style={styles.mainWrapper}>
        <View contentContainerStyle={styles.containersWrapper}>
          <Title titleText="Settings" />
          {data == null ? (
            <Text>No data</Text>
          ) : (
            <View>
              <SettingsContainer
                image={this.context.temperature_icon}
                textKey="Temperature:"
                value={this.state.changeWantedTemperature}
                symbol="&deg;C"
                changeHandler={this.changeTmpHandler}
              />
              <SettingsContainer
                image={this.context.humidity_icon}
                textKey="Humidity:"
                value={this.state.changeWantedHumidity}
                symbol="%"
                changeHandler={this.changeHumHandler}
              />
              <SettingsContainer
                image={this.context.soil_icon}
                textKey="Ground humidity:"
                value={this.state.changeWantedGroundHumidity}
                symbol="%"
                changeHandler={this.changeGHumHandler}
              />
              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>Auto mode</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={this.state.changeAutoMode ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => this.toggleAutoMode()}
                  value={this.state.changeAutoMode}
                />
              </View>
              <View style={styles.switchContainer}>
                <Text
                  style={[
                    styles.switchText,
                    this.state.changeAutoMode != null &&
                    this.state.changeAutoMode == true
                      ? styles.disabledText
                      : null,
                  ]}
                >
                  Close door
                </Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={this.state.changeDoor ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => this.toggleDoor()}
                  value={this.state.changeDoor}
                  disabled={
                    this.state.changeAutoMode != null &&
                    this.state.changeAutoMode == true
                  }
                />
                <Text
                  style={[
                    styles.switchText,
                    this.state.changeAutoMode != null &&
                    this.state.changeAutoMode == true
                      ? styles.disabledText
                      : null,
                  ]}
                >
                  Open door
                </Text>
              </View>
              <View style={styles.switchContainer}>
                <Text
                  style={[
                    styles.switchText,
                    this.state.changeAutoMode != null &&
                    this.state.changeAutoMode == true
                      ? styles.disabledText
                      : null,
                  ]}
                >
                  Close valve
                </Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={this.state.changeWater ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => this.toggleWater()}
                  value={this.state.changeWater}
                  disabled={
                    this.state.changeAutoMode != null &&
                    this.state.changeAutoMode == true
                  }
                />
                <Text
                  style={[
                    styles.switchText,
                    this.state.changeAutoMode != null &&
                    this.state.changeAutoMode == true
                      ? styles.disabledText
                      : null,
                  ]}
                >
                  Open valve
                </Text>
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => this.sendData()}
              >
                <Text style={styles.buttonText}>SUBMIT</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

Settings.contextType = CustomContext;

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#cacaca",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  containersWrapper: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  submitButton: {
    backgroundColor: "#009bd4",
    borderRadius: 20,
    padding: 10,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  switchText: {
    fontSize: 20,
    fontWeight: "700",
    marginRight: 10,
  },
  disabledText: {
    color: "grey",
  },
});

export default Settings;
