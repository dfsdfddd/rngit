import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
// import NavigationUtil from '../navigator/NavigationUtil';

// 导入启动屏设置
import SplashScreen from 'react-native-splash-screen'

export default class WelcomePage extends Component {
  componentDidMount(){
    this.timer = setTimeout(() => {
      SplashScreen.hide();
      // const {navigation} = this.props
      // navigation.navigate('Main')
    }, 200);
  }
  componentWillUnmount(){
    this.timer&&clearTimeout(this.timer)
  }
  
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>WelcomePage</Text>
        
        <Button
          title={'Go To Main'}
          onPress={()=>{
            navigation.navigate('Main');
          }}
        />
        <Button
          title={'go to bottomNavigator'}
          onPress={()=>{
            navigation.navigate('BottomNav');
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
