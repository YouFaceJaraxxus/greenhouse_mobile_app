import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  AsyncStorage,
} from "react-native";
import Container from "./Container";
import Title from "./Title";
import CustomContext from "./CustomContext";
import Constants from "../config";
import axios from "axios";
import qs from "qs";

class State extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      refreshing: false,
      auth: null,
    };
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.getData();
  };

  getData = () => {
    AsyncStorage.getItem("auth")
      .then((auth) => {
        this.setState({
          refreshing: true,
        });
        let data = qs.stringify({
          auth: auth,
        });
        axios
          .post(Constants.DATA_SERVER + "data-new", data)
          .then((response) => {
            let dataObject = response.data.data;
            dataObject = Object.assign(response.data.settings, dataObject);
            this.setState({
              data: null,
              refreshing: false,
            });
            this.setState({
              data: dataObject,
            });
            this.context.setContextData(dataObject);
          })
          .catch((error) => {
            console.log("ERROR", error);
          });
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
  };

  componentDidMount() {
    if (this.context.data != null) {
      this.setState({
        data: this.context.data,
      });
    } else {
      this.getData();
    }
  }

  mapAction = (recommendedDoorState, recommendedWaterState) => {
    if (recommendedDoorState == 0 && recommendedWaterState == 0)
      return "All ok.";
    else {
      let response = "";
      if (recommendedWaterState == 1) response += "Ground too humid. ";
      else if (recommendedWaterState == 2) response += "Ground too dry. ";
      if (recommendedDoorState == 1)
        response += "Air temperature and humidity too high.";
      else if (recommendedDoorState == 2)
        response += "Air temperature and humidity too low.";
      return response;
    }
  };

  mapReccAction = (
    recommendedDoorState,
    recommendedWaterState,
    doorState,
    waterState
  ) => {
    if (recommendedDoorState == 0 && recommendedWaterState == 0)
      return "No action necessary.";
    else {
      let response = "";

      if (recommendedWaterState == 1) {
        response += "Should close the valve. ";
        if (waterState == 1) response += "(Done) ";
      } else if (recommendedWaterState == 2) {
        response += "Should open the valve. ";
        if (waterState == 2) response += "(Done) ";
      }
      if (recommendedDoorState == 1) {
        response += "Should open the door.";
        if (doorState == 1) response += "(Done) ";
      } else if (recommendedDoorState == 2) {
        response += "Should close the door.";
        if (doorState == 2) response += "(Done) ";
      }
      return response;
    }
  };

  parseColor = (param, wantedParam, bottomDiff, topDiff) => {
    param = parseInt(param);
    wantedParam = parseInt(wantedParam);
    bottomDiff = parseInt(bottomDiff);
    topDiff = parseInt(topDiff);
    if (param - wantedParam < bottomDiff) return "#339EFF";
    else if (param - wantedParam > topDiff) return "#FB3D13";
    else return "#4CFB13";
  };

  render() {
    var doorState;
    var waterState;
    var reccDoorState;
    var reccWaterState;
    let data = this.state.data;
    if (data != null) {
      doorState = parseInt(data.act / 10);
      waterState = data.act % 10;
      reccDoorState = parseInt(data.reccAct / 10);
      reccWaterState = data.reccAct % 10;
    }
    return (
      <View style={styles.mainWrapper}>
        <ScrollView
          contentContainerStyle={styles.containersWrapper}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <Title titleText="State" />
          {data == null ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noData}>No data</Text>
            </View>
          ) : (
            <View>
              <Container
                image={this.context.temperature_icon}
                color={this.parseColor(
                  data.tmp,
                  data.wntTmp,
                  Constants.tempDiffBottom,
                  Constants.tempDiffTop
                )}
                textKey="Temperature:"
                textValue={data.tmp}
                symbol="&deg;C"
              />
              <Container
                image={this.context.humidity_icon}
                color={this.parseColor(
                  data.hum,
                  data.wntHum,
                  Constants.humDiffBottom,
                  Constants.humDiffTop
                )}
                textKey="Humidity:"
                textValue={data.hum}
                symbol="%"
              />
              <Container
                image={this.context.soil_icon}
                color={this.parseColor(
                  data.gHum,
                  data.wntGHum,
                  Constants.humDiffBottom,
                  Constants.humDiffTop
                )}
                textKey="Ground humidity:"
                textValue={data.gHum}
                symbol="%"
              />
              <Container
                image={this.context.state_icon}
                textValue={this.mapAction(reccDoorState, reccWaterState)}
              />
              <Container
                image={this.context.brain_icon}
                textValue={this.mapReccAction(
                  reccDoorState,
                  reccWaterState,
                  doorState,
                  waterState
                )}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

State.contextType = CustomContext;

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    alignContent: "flex-start",
    backgroundColor: "#cacaca",
    flexDirection: "column",
    justifyContent: "center",
  },
  containersWrapper: {
    padding: 10,
    alignSelf: "center",
  },
  noDataContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  noData: {
    textAlign: "center",
    marginTop: "50%",
    fontSize: 40,
    fontWeight: "700",
    color: "red",
  },
});

export default State;
