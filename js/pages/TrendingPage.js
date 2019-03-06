import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';


export default class FavoriterPage extends Component {
  render() {
    const {navigation} = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>FavoriterPage</Text>
        <Button
          title={'改变主题颜色'}
          onpress={()=>{
            navigation.setParams({
              theme:{
                tintColor: 'green',
                updateTime: new Date().getTime()
              }
            })
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