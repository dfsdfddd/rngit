import React, { Component } from 'react';
import { View, Text, ViewPropTypes,StyleSheet,StatusBar, Platform, DeviceInfo } from 'react-native';
import {PropTypes} from 'prop-types';

const StatusBarShape ={
  barStyle:PropTypes.oneOf(['light-content','default']),// oneOf 属性取值为特定的几个值
  hidden:PropTypes.bool,
  backgroundColor:PropTypes.string
}
const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = DeviceInfo.isIPhoneX_deprecated ? 0 : 20;
export default class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  // 提供属性的类型检查
  static propTypes = {
    style:ViewPropTypes.style,
    title:PropTypes.string,
    titleView:PropTypes.element,
    titleLayoutStyle:ViewPropTypes.style,
    hide:PropTypes.bool,
    statusBar:PropTypes.shape(StatusBarShape),// shape对象构成方式
    rightButton:PropTypes.element,
    leftButton:PropTypes.element
  }
  static defaultProps = {
    statusBar:{
      barStyle:'light-content',
      hidden:false
    }
  }

  render() {
    let statusBar = !this.props.statusBar.hidden?
    <View style={styles.statusBar}>
      <StatusBar {...this.props.statusBar}></StatusBar>
    </View>:null;

    let titleView = this.props.titleView ? this.props.titleView : 
    <Text ellipsizeMode='head' numberOfLines={1} style={styles.title}>
      {this.props.title}
    </Text>

    let content = this.props.hide ? null :
    <View style={styles.navBar}>
      {this.getButtonElement(this.props.leftButton)}
      <View style={[styles.navBarTitleContainer,this.props.titleLayoutStyle]}>
        {titleView}
      </View>
      {this.getButtonElement(this.props.rightButton)}
    </View>
    return (
      <View style={[styles.container,this.props.style]}>
        {statusBar}
        {content}
      </View>
    );
  }
  getButtonElement(data){
    return (
      <View style={styles.navBarButton}>
        {data?data:null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navBar:{
    alignItems: 'center',
    flexDirection:'row',
    justifyContent:'space-between',
    height: Platform.OS === 'ios' ?NAV_BAR_HEIGHT_IOS:NAV_BAR_HEIGHT_ANDROID
  },
  navBarButton:{
    alignItems:'center'
  },
  navBarTitleContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left:40,
    right:40,
    top:0,
    bottom:0
  },
  container:{
    backgroundColor:'#2196f3'
  },
  statusBar:{
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT :0
  },
  title:{
    fontSize: 20,
    color:'white'
  }
})