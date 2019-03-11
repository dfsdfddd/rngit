import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';


export default class MyPage extends Component {
  render() {
    return (
      <View style={styles.container}>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
