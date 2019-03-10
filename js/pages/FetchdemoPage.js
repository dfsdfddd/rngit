import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';


export default class FetchdemoPage extends Component {
  constructor(props){
    super(props)
    this.state={
      showText:''
    }
  }
  loadData(){
    // https://api.github.com/search/repositories?q=java
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`
    fetch(url).then((response) => {
      console.log(response);
      return response.text()
    })
    .then((responseText) => {
      this.setState({
        showText: responseText
      })
    })
  }
  loadData2(){
    // https://api.github.com/search/repositories?q=java
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`
    fetch(url).then((response) => {
      console.log(response);
      if(response.ok){
        return response.text()
      }
      throw new Error('network is not ok') 
    })
    .then((responseText) => {
      this.setState({
        showText: responseText
      })
    }).catch(e=>{
      this.setState({
        showText: e.toString()
      })
    })
  }
  render() {
    
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>fetch 的使用</Text>
        <View style={styles.input_container}>
          <TextInput
            style={styles.input}
            onChangeText={(text)=>{
              this.searchKey = text
            }}
          ></TextInput>
          <Button
            title={'获取'}
            onPress={()=>{
              this.loadData2()
            }}
          />
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
    flex:1,
    borderColor:'red',
    borderWidth:1,
    marginRight:10
  },
  input_container:{
    flexDirection: 'row',
    alignItems: 'center'
  }
});
