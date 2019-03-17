import React from 'react';
import { BackHandler } from 'react-native';

/**
 * 安卓物理键后退
 */
export default class BackPressComponent {
  constructor(props) {
    this._handwareBackPress = this.onHardwareBackPress.bind(this)
    this.props = props
  }
  componentDidMount() {
    if(this.props.backPress)BackHandler.addEventListener("hardwareBackPress", this._handwareBackPress);
  }

  componentWillUnmount() {
    if(this.props.backPress)BackHandler.removeEventListener("hardwareBackPress", this._handwareBackPress);
  }
  onHardwareBackPress(e){
    return this.props.backPress(e)
  }
}
