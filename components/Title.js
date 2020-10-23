import React, { Component } from 'react';
import {View, Text, StyleSheet} from 'react-native';
class Title extends Component {
    state = { 
        titleText: this.props.titleText
     }
    render() { 
        return ( 
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                    {this.state.titleText}
                </Text>
            </View>
         );
    }
}


const styles = StyleSheet.create({
    titleContainer:{
        marginTop: 5,
        marginBottom: 10,
        justifyContent:'center',
        alignItems:'center'
    },
    titleText:{
        textAlign: 'center',
        fontSize:40,
        fontWeight: '700',
        color: '#009bd4'
    }
})
 
export default Title;