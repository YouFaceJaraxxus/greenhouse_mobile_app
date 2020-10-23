import React, { Component } from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import Container from './Container';


class TouchableContainer extends Component {
    state = { 
        textKey: this.props.textKey,
        textValue: this.props.textValue,
        image : this.props.image,
        symbol : this.props.symbol
     }
    render() { 
        return ( 
            <TouchableOpacity style={{flex:1}}>
                <Container textKey = {this.state.textKey} textValue ={this.state.textValue} image = {this.state.image} symbol={this.state.symbol}/>
            </TouchableOpacity>
         );
    }
}

 
export default TouchableContainer;