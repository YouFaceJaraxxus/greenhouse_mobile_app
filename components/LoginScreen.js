import React, { Component } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {  SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import qs from 'qs';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import Constants from '../config';

class LoginScreen extends Component {
    state = { 
        navigate:this.props.navigation.navigate,
        email : "",
        password: "",
        error : null
     }
    static navigationOptions = {
        title: "Login"
      };

      componentDidMount(){
          AsyncStorage.getItem('auth')
          .then(auth=>{
              if(auth){
                let data = qs.stringify({
                    auth:auth,
                    mobile:true
                })
                axios.post(Constants.DATA_SERVER+'login',data)
                .then(response=>{
                  if(response.status==200){
                      this.state.navigate('MainApp');
                  }
                })
                .catch(error=>{
                  console.log("ERROR", error)
                })
              }
          })
          .catch(error=>{
              console.log('ERROR', error);
              this.setState({
                error:'Invalid credentials.'
            })
          })
      }
    
      login = ()=>{
        let data = qs.stringify({
            email : this.state.email,
            password : this.state.password,
            mobile:true
        })
        axios.post(Constants.DATA_SERVER+'login',data)
        .then(response=>{
          if(response.status==200){
                this.setState({
                    error:null
                })
              AsyncStorage.setItem('auth', response.data.auth)
              .then(value=>{
                this.state.navigate('MainApp');
              })
          }else{
              this.setState({
                  error:'Invalid credentials.'
              })
          }
        })
        .catch(error=>{
          console.log("ERROR", error)
          this.setState({
            error:'Invalid credentials.'
            })
        })
      }

      handleEmailChange = (email)=>{
        this.setState({
          email:email
        })
    }

      handlePasswordChange = (password)=>{
          this.setState({
            password:password
          })
      }
    render() { 
        return ( 
            <SafeAreaProvider style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.mainContainer}>
                        <View style={styles.formContainer}>
                            <Text style={styles.formLabel}>E-mail</Text>
                            <TextInput style={styles.formTextnput} value={this.state.email} onChangeText={text => this.handleEmailChange(text)}></TextInput>
                            <Text style={styles.formLabel}>Password</Text>
                            <TextInput style={styles.formTextnput} secureTextEntry={true} value={this.state.password} onChangeText={text => this.handlePasswordChange(text)}></TextInput>
                            <TouchableOpacity style={styles.formButton} onPress={this.login}>
                                <Text style={styles.formButtonText}>
                                    Login
                                </Text>
                            </TouchableOpacity>
                            {this.state.error?
                            <Text style={styles.errorLabel}>{this.state.error}</Text>:null}
                        </View>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
         );
    }
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center'
    },
    formContainer:{
        justifyContent:'center',
        alignItems: 'center',
        padding: 25,
        borderRadius: 10
    },
    formLabel:{
        fontSize: 25
    },
    formTextnput:{
        fontSize: 20,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: 350,
        marginBottom: 50,
        textAlign: 'center',
        marginTop: 20,
        padding: 1
    },
    formButton:{
        textAlign:'center',
        marginVertical: 50,
        backgroundColor: '#0356fc',
        padding: 12,
        borderRadius: 10,
        width: 300
    },
    formButtonText:{
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    errorLabel:{
        fontSize: 20,
        color: 'red'
    }
})
 
export default LoginScreen;