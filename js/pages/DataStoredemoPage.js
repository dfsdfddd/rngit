import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Button, AsyncStorage} from 'react-native';
import DataStore from '../expand/dao/DataStore';


const KEY = 'save_key'
export default class DataStoredemoPage extends Component {
  constructor(props){
    super(props)
    this.state={
      showText:''
    }
    this.dataStore = new DataStore()
  }
  loadData(){
    let url = `https://api.github.com/search/repositories?q=${this.value}`
    this.dataStore.fetchData(url).then((data) => {
      console.log(data);
      let showData = `初次数据加载事件${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`
      this.setState({
        showText: showData
      })
    }).catch((err) => {
      err&&console.log(err.toString());
    });

  }
  render() {
    
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>离线缓存框架 的使用</Text>
        <TextInput
            style={styles.input}
            onChangeText={(text)=>{
              this.value = text
            }}
          ></TextInput>
        <Text
            onPress={()=>{
              this.loadData()
            }}
          >
          获取
        </Text>
        
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
