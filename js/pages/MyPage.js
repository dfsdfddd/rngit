import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity, ScrollView} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationBar from '../common/NavigationBar';
import {MORE_MENU} from '../common/MoreMenu';
import GlobalStyles from '../res/styles/GlobalStyles';
import ViewUtil from '../util/ViewUtil';
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';

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
  getItem(menu){
    return ViewUtil.getMenuItem(()=>{this.onClick(menu)},menu,THEME_COLOR)
  }
  onClick(menu){
    let RouteName,params={};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title= '教程';
        params.url = 'https://www.baidu.com/'
        // params.url = 'https://coding.m.imooc.com/classindex.html?cid=89'
        // params.url = 'http://58.250.168.182:48004/trust/openAcc'
        break;
      case MORE_MENU.About:
        RouteName = 'AboutPage';
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage'
        break;
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
        RouteName = 'CustomKeyPage'
        params.isRemoveKey = menu === MORE_MENU.Remove_Key
        params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language
        break;
    }
    if(RouteName){
      NavigationUtil.goPage(params,RouteName)
    }
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
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView

        >
          <TouchableOpacity
            style={styles.item}
            onPress={()=>{
              this.onClick(MORE_MENU.About)
            }}
          >
            <View style={styles.about_left}>
              <Ionicons
                style={{marginRight: 10,color: THEME_COLOR}}
                name={MORE_MENU.About.icon}
                size={40}
              />
              <Text>Github Popular</Text>
            </View>
            <Ionicons
                style={{marginRight: 10,color: THEME_COLOR, alignSelf: 'center',}}
                name={'ios-arrow-forward'}
                size={16}
              />
          </TouchableOpacity>  
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Tutorial)}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {this.getItem(MORE_MENU.Custom_Language)}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Sort_Language)}

          <Text style={styles.groupTitle}>最热管理</Text>
          {this.getItem(MORE_MENU.Custom_Key)}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Sort_Key)}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Remove_Key)}

          <Text style={styles.groupTitle}>设置</Text>
          {this.getItem(MORE_MENU.Custom_Theme)}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Custom_Theme)}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Feedback)}
        </ScrollView>
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
    backgroundColor: '#F5FCFF',
  },
  about_left: {
    alignItems: 'center',
    flexDirection:'row'
  },
  item:{
    backgroundColor:'white',
    padding:10,
    height:90,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color:'gray'
  }
});
