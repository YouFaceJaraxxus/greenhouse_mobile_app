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

var interval = null;
class Preferences extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      refreshing: false,
      auth: null
    };
  }

  componentDidMount() {
    if (this.context.data != null) {
      this.setState({
        data: this.context.data,
      });
    } else {
      this.getData();
    }
  }

  getData = () => {
    AsyncStorage.getItem("auth")
      .then((auth) => {
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
    interval = setInterval(() => {
      this.setState({
        data: null,
      });
      this.setState({
        data: this.context.data,
      });
    }, 5000);
  }

  componentWillUnmount(){
    clearInterval(interval);
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    this.getData();
  };

  mapAutoModeColor = (autoMode) => {
    if (autoMode == 0) return "#FB3D13";
    else if (autoMode == 1) return "#4CFB13";
    else return "#FB3D13";
  };

  mapAutoModeText = (autoMode) => {
    if (autoMode == 0) return "OFF";
    else if (autoMode == 1) return "ON";
    else return "UNDEFINED";
  };
  render() {
    let data = this.state.data;
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
          <Title titleText="Preferences" />
          {data == null ? (
            <Text>No data</Text>
          ) : (
            <View>
              <Container
                image={this.context.temperature_gauge_icon}
                textKey="Wanted temperature:"
                textValue={data.wntTmp}
                symbol="&deg;C"
              />
              <Container
                image={this.context.humidity_gauge_icon}
                textKey="Wanted humidity:"
                textValue={data.wntHum}
                symbol="%"
              />
              <Container
                image={this.context.soil_humidity_gauge_icon}
                textKey="Wanted ground humidity:"
                textValue={data.wntGHum}
                symbol="%"
              />
              <Container
                image={this.context.robot_icon}
                color={this.mapAutoModeColor(data.aut)}
                textKey="Auto mode:"
                textValue={this.mapAutoModeText(data.aut)}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

Preferences.contextType = CustomContext;

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
});

export default Preferences;
