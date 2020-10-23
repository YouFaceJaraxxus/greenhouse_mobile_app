import React, { Component } from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity} from 'react-native';


class Container extends Component {
    state = { 
        textKey: this.props.textKey,
        textValue: this.props.textValue,
        image : this.props.image,
        symbol : this.props.symbol,
        color : this.props.color
     }
    render() { 
        return ( 
            <View style={styles.mainContainer}>
                <Image source={this.state.image} style={styles.image} />
                <View style={styles.textWrapper}>
                    {this.state.textKey?<Text style={styles.keyText}>
                        {this.state.textKey}
                    </Text> : null}
                    <Text style={{fontWeight: '700',fontSize: 25, color:this.state.color?this.state.color:'black'}}>
                        {this.state.textValue?this.state.textValue.toString():"NO DATA"} {this.props.symbol}
                    </Text>
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
    textWrapper:{
        width: 250,
        marginLeft: 20
    }
})
 
export default Container;