import React, {Component} from 'react';
import { View,Text, Linking} from 'react-native';
import NavigationUtil from '../../navigator/NavigationUtil';


import {MORE_MENU} from '../../common/MoreMenu';
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtil from '../../util/ViewUtil';
import AboutCommon, { FLAG_ABOUT } from './AboutCommon';
import config from '../../res/data/config';
// const config ={}


const THEME_COLOR = '#678'
export default class AboutPage extends Component {
  constructor(props){
    super(props)
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon({
      ...this.props,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about
    })
    this.state = {
      data: config
    }
  }
  
  getItem(menu){
    const {theme} = this.params
    return ViewUtil.getMenuItem(()=>{this.onClick(menu)},menu,theme.themeColor)
  }
  onClick(menu){
    const{theme}=this.params
    let RouteName,params={};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title= '教程';
        params.url = 'https://www.baidu.com/'
        params.theme = theme
        // params.url = 'https://coding.m.imooc.com/classindex.html?cid=89'
        // params.url = 'http://58.250.168.182:48004/trust/openAcc'
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage'
        params.theme=this.params.theme
        break;
      case MORE_MENU.Feedback:
        const url = 'mailto://1004928208@qq.com'
        Linking.canOpenURL(url).then((support) => {
          if(!support){
            console.log('不支持'+ url);
          } else {
            Linking.openURL(url)
          }
        }).catch((err) => {
          console.log(err);
        });
        break;
    }
    if(RouteName){
      NavigationUtil.goPage(params,RouteName)
    }
  }
  render() {
    const content = <View>
      {this.getItem(MORE_MENU.Tutorial)}
      <View style={GlobalStyles.line}/>
      {this.getItem(MORE_MENU.About_Author)}
      <View style={GlobalStyles.line}/>
      {this.getItem(MORE_MENU.Feedback)}
    </View>
    return this.aboutCommon.render(content, this.state.data.app)
    // return (
    //   <Text>fasd</Text>
    // )
  }
}