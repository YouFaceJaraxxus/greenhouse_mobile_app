import React, { Component } from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity, TextInput} from 'react-native';


class SettingsContainer extends Component {
    state = { 
        textKey: this.props.textKey,
        value: this.props.value,
        image : this.props.image,
        symbol : this.props.symbol,
        changeHandler : this.props.changeHandler
     }

     changeValue = (increase)=>{
         let val = parseInt(this.state.value);
         increase? val==100? val=100 : val++ : val==0?val=0:val--;
         this.setState({
             value: val.toString()
         })
         this.state.changeHandler(val.toString());
     }

     renderValueChange=(newValue)=>{
         if(newValue!=null&&!isNaN(parseFloat(newValue)) && isFinite(newValue)){
            newValue = parseInt(newValue, 10);
            newValue = newValue>100? 100 : newValue<0? 0 : newValue;
         }
         this.setState({
            value: newValue.toString()
        })
        this.state.changeHandler(newValue.toString())
     }

     /*for some reason this is a workaround to make sure the numbers are actually displayed
     otherwise, they don't get displayed even though the proper value IS passed */
     componentDidMount(){
         this.setState({
             value : this.state.value
         })
     }

    render() { 
        return ( 
            <View style={styles.mainContainer}>
                <Image source={this.state.image} style={styles.image} />
                <View style={styles.textWrapper}>
                    {this.state.textKey?<Text style={styles.keyText}>
                        {this.state.textKey}
                    </Text> : null}
                    <View style={styles.valueWrapper}>
                        <TouchableOpacity style={styles.incrementButton} onPress={()=>this.changeValue(false)}>
                            <Text style={[styles.incrementButtonText, styles.redText]}>
                                -
                            </Text>
                        </TouchableOpacity>
                        <TextInput keyboardType = 'numeric' onChangeText={(text)=>this.renderValueChange(text)} value={this.state.value} style={styles.valueText}>
                            
                        </TextInput>
                        <Text style={styles.valueText}>
                            {this.props.symbol}
                        </Text>
                        <TouchableOpacity style={styles.incrementButton} onPress={()=>this.changeValue(true)}>
                            <Text style={[styles.incrementButtonText, styles.greenText]}>
                                +
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
         );
    }
}


const styles = StyleSheet.create({
    mainContainer:{
        marginVertical: 15,
        flexDirection:'row',
        padding: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 1
    },
    image:{
        width:100,
        height:100
    },
    keyText:{
        fontWeight:'700',
        fontSize: 28
    },
    valueText:{
        fontWeight: '700',
        fontSize: 25
    },
    textWrapper:{
        width: 250,
        marginLeft: 20
    },
    valueWrapper :{
        flex:1,
        flexDirection: "row",
        justifyContent:"flex-start",
        alignItems:"center"
    },
    incrementButton:{
        padding: 5,
        marginHorizontal: 30
    },
    incrementButtonText:{
        fontSize: 45
    },
    greenText:{
        color:'green'
    },
    redText: {
        color:'red'
    }
})
 
export default SettingsContainer;