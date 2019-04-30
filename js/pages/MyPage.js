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

import {connect} from 'react-redux';
import actions from '../action/index';

const THEME_COLOR = '#678'

class MyPage extends Component {

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
    const {theme} = this.props
    return ViewUtil.getMenuItem(()=>{this.onClick(menu)},menu,theme.themeColor)
  }
  onClick(menu){
    let RouteName,params={};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title= '教程';
        params.url = 'https://www.baidu.com/'
        params.theme = this.props.theme

        // params.url = 'https://coding.m.imooc.com/classindex.html?cid=89'
        // params.url = 'http://58.250.168.182:48004/trust/openAcc'
        break;
      case MORE_MENU.About:
        RouteName = 'AboutPage';
        params.theme = this.props.theme
        break;
      case MORE_MENU.Custom_Theme:
        const{onShowCustomThemeView} = this.props
        onShowCustomThemeView(true)
        break;
      case MORE_MENU.Sort_Key:
        RouteName = 'SortKeyPage';
        params.theme = this.props.theme
        params.flag = FLAG_LANGUAGE.flag_key
        break;
      case MORE_MENU.Sort_Language:
        RouteName = 'SortKeyPage';
        params.theme = this.props.theme
        params.flag = FLAG_LANGUAGE.flag_language
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage'
        params.theme = this.props.theme
        break;
      case MORE_MENU.CodePush:
        RouteName = 'CodePushPage'
        params.theme = this.props.theme
        break;
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
        RouteName = 'CustomKeyPage'
        params.theme = this.props.theme
        params.isRemoveKey = menu === MORE_MENU.Remove_Key
        params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language
        break;
    }
    if(RouteName){
      NavigationUtil.goPage(params,RouteName)
    }
  }
  render() {
    const {theme} = this.props
    let statusBar = {
      backgroundColor:theme.themeColor,
      barStyle:'light-content'
    }
    let navigationBar = <NavigationBar
      title={'我的123'}
      statusBar={statusBar}
      style={theme.styles.navBar}
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
                style={{marginRight: 10,color: theme.themeColor}}
                name={MORE_MENU.About.icon}
                size={40}
              />
              <Text>Github Popular</Text>
            </View>
            <Ionicons
                style={{marginRight: 10,color: theme.themeColor, alignSelf: 'center',}}
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
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.CodePush)}
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  theme: state.theme.theme
})
const mapDispatchToProps = (dispatch) => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
})
export default connect(mapStateToProps,mapDispatchToProps)(MyPage)
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
