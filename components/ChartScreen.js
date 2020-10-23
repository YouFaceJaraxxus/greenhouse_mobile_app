import React, { Component } from "react";
import { View, Text, Dimensions, AsyncStorage, ScrollView,StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import qs from 'qs';
import Constants from "../config";

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
  }
class ChartScreen extends Component {
  state = {
    loading: true,
    tempData: null,
    humData: null,
    gHumData: null,
    auth: null,
  };

  getData = () => {
    AsyncStorage.getItem("auth")
      .then((auth) => {
        this.setState({
          refreshing: true,
        });
        let authData = qs.stringify({
          auth: auth,
        });
        axios
          .post(Constants.DATA_SERVER + "data", authData)
          .then((response) => {
            let data = response.data.data;
            let temperatures = [];
            let humidities = [];
            let groundHumidities = [];
            let labels = [];
            let dataCopy = [];
            for (var i in data) {
              dataCopy.push(data[i]);
            }
            dataCopy.sort((a, b) => {
              return a.counter - b.counter;
            });
            //dataCopy = dataCopy.slice(Math.max(dataCopy.length - 6, 0));
            let len = dataCopy.length - 1;
            for (var i in dataCopy) {
              let element = data[len - i];
              temperatures.push(element.tmp);
              humidities.push(element.hum);
              groundHumidities.push(element.gHum);
              let date = new Date(element.date);
              labels.push(date.getHours() + ":" + date.getMinutes().pad(2));
            }
            let tempData = new Object();
            tempData.datasets = [];
            tempData.datasets.push({
              label: "Temperature (\u2103)",
              data: temperatures,
              borderColor: "red",
              fill: false,
            });
            tempData.labels = labels;

            let humData = new Object();
            humData.datasets = [];
            humData.datasets.push({
              label: "Humidity ( % )",
              data: humidities,
              borderColor: "blue",
              fill: false,
            });
            humData.labels = labels;

            let gHumData = new Object();
            gHumData.datasets = [];
            gHumData.datasets.push({
              label: "Ground humidity ( % )",
              data: groundHumidities,
              borderColor: "green",
              fill: false,
            });
            gHumData.labels = labels;
            if  (data)
              this.setState({
                tempData: tempData,
                humData: humData,
                gHumData: gHumData,
                loading: false,
              });
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
    this.getData();
  }
  render() {
    return (
      <ScrollView style={{flex:1}}>
        <Text style={styles.chartTitle}>{`Air temperature (\u2103)`}</Text>
        
        {this.state.tempData == null ? null : (
            <ScrollView horizontal={true}>
          <LineChart style={styles.chart}
          data={this.state.tempData} 
          width={Dimensions.get("window").width*5} // from react-native
          height={300}
          yAxisSuffix={`\u2103`}
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          fromZero = {true}
          bezier
          style={{
            marginVertical: 8
          }}/></ScrollView>
        )}
        <Text style={styles.chartTitle}>{`Air humidity (%)`}</Text>
        {this.state.humData == null ? null : (
            <ScrollView horizontal={true}>
          <LineChart style={styles.chart}
          data={this.state.humData} 
          width={Dimensions.get("window").width*5} // from react-native
          height={300}
          yAxisSuffix={`%`}
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          fromZero = {true}
          bezier
          style={{
            marginVertical: 8
          }}/></ScrollView>
        )}
        <Text style={styles.chartTitle}>{`Ground humidity (%)`}</Text>
        {this.state.gHumData == null ? null : (
            <ScrollView horizontal={true}>
          <LineChart style={styles.chart}
          data={this.state.gHumData} 
          width={Dimensions.get("window").width*5} // from react-native
          height={300}
          yAxisSuffix={`%`}
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          fromZero = {true}
          bezier
          style={{
            marginVertical: 8
          }}/></ScrollView>
        )}
      </ScrollView>
    );
  }
}

export default ChartScreen;

const styles = StyleSheet.create({
    chartTitle:{
        justifyContent: 'center',
        alignItems:'center',
        textAlign:'center',
        marginVertical:10,
        fontSize:20,
        fontWeight:'700'
    },
    chart:{
        marginBottom: 50,
        paddingBottom: 20
    }
})
