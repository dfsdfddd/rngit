import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Button, AsyncStorage} from 'react-native';


const KEY = 'save_key'
export default class AsyncStoragedemoPage extends Component {
  constructor(props){
    super(props)
    this.state={
      showText:''
    }
  }
  async doSave(){
    AsyncStorage.setItem(KEY,this.value, error=>{
      error&&console.log(error.toString());
    })
  }
  async doRemove(){
    AsyncStorage.removeItem(KEY, error=>{
      error&&console.log(error.toString());
    })
  }
  async getData(){
    AsyncStorage.getItem(KEY, (error,value)=>{
      this.setState({
        showText: value
      })
      console.log(value);
      error&&console.log(error.toString());
    })
  }
  render() {
    
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>AsyncStorage 的使用</Text>
        <TextInput
            style={styles.input}
            onChangeText={(text)=>{
              this.value = text
            }}
          ></TextInput>
        <View style={styles.input_container}>
          <Text
            onPress={()=>{
              this.doSave()
            }}
          >
            存储
          </Text>
          <Text
            onPress={()=>{
              this.doRemove()
            }}
          >
            删除
          </Text>
          <Text
            onPress={()=>{
              this.getData()
            }}
          >
            获取
          </Text>
        </View>
        
        <Text>{this.state.showText}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input:{
    height: 30,
    borderColor:'red',
    borderWidth:1,
    marginRight:10
  },
  input_container:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});
