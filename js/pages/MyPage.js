import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationBar from '../common/NavigationBar';

const THEME_COLOR = '#678'

export default class MyPage extends Component {

  getRightButton(){
    return <View style={{flexDirection: 'row',}}>
      <TouchableOpacity
        onPress={()=>{}}
      >
        <View style={{padding:5,marginRight: 8,}}>
          <Feather
            name={'search'}
            size={24}
            style={{color:'white'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }
  getLeftButton(callBack){
    return <TouchableOpacity
      style={{padding:8,paddingLeft: 12}}
      onPress={callBack}
    >
      <Ionicons
        name={'ios-arrow-back'}
        size={26}
        style={{color:'white'}}
      />
    </TouchableOpacity>
  }
  render() {
    let statusBar = {
      backgroundColor:THEME_COLOR,
      barStyle:'light-content'
    }
    let navigationBar = <NavigationBar
      title={'我的'}
      statusBar={statusBar}
      style={{backgroundColor:THEME_COLOR}}
      rightButton={this.getRightButton()}
      leftButton={this.getLeftButton()}
    />;
    return (
      <View style={styles.container}>
        {navigationBar}
        <Text style={styles.welcome}>MyPage</Text>
        <Text onPress={()=>{
          NavigationUtil.goPage({
            navigation: this.props.navigation
          },'DetailPage')
        }}>跳转到详情页面</Text>
        <Button
          title={'fetchdemo'}
          onPress={()=>{
            NavigationUtil.goPage({
              navigation: this.props.navigation
            },'FetchdemoPage')
          }}
        />
        <Button
          title={'AsyncStoragedemoPage'}
          onPress={()=>{
            NavigationUtil.goPage({
              navigation: this.props.navigation
            },'AsyncStoragedemoPage')
          }}
        />
        <Button
          title={'DataStoredemoPage'}
          onPress={()=>{
            NavigationUtil.goPage({
              navigation: this.props.navigation
            },'DataStoredemoPage')
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
