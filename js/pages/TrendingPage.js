import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';

import {connect} from 'react-redux';
import actions from '../action/index';


class TrendingPage extends Component {
  render() {
    const {navigation} = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>TrendingPage</Text>
        <Button
          title={'改变主题颜色'}
          onPress={()=>{
            console.log(123456)
            this.props.onThemeChange("green")
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

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})

export default connect(mapStateToProps,mapDispatchToProps)(TrendingPage)