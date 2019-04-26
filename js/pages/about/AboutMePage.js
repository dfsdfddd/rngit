import React, {Component} from 'react';
import { View,Text, Linking, Clipboard} from 'react-native';
import NavigationUtil from '../../navigator/NavigationUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast'



import {MORE_MENU} from '../../common/MoreMenu';
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtil from '../../util/ViewUtil';
import AboutCommon, { FLAG_ABOUT } from './AboutCommon';
import config from '../../res/data/config';
// const config ={}


const THEME_COLOR = '#678'
export default class AboutMePage extends Component {
  constructor(props){
    super(props)
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon({
      ...this.props,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about_me
    })
    this.state = {
      data: config,
      showTutorial: true,
      showBlog: false,
      showQQ: false,
      showContact: false
    }
  }
  
  getItem(menu){
    return ViewUtil.getMenuItem(()=>{this.onClick(menu)},menu,THEME_COLOR)
  }
  _item(data,isShow,key){
    const{theme} = this.params
    return ViewUtil.getSettingItem(()=>{
      this.setState({
        [key]:!this.state[key]
      })
    },data.name,theme.themeColor,Ionicons,data.icon,isShow?'ios-arrow-up':'ios-arrow-down')
  }
  // 显示列表数据
  renderItem(dic, isShowAccount){
    if(!dic) return null
    let views = []
    const{theme} = this.params
    for (let i in dic) {
      let title =  isShowAccount ? dic[i].title + ':' +dic[i].account : dic[i].title
      views.push(
        <View key={i}>
          {ViewUtil.getSettingItem(()=> this.onClick(dic[i]),title, theme.themeColor)}
          <View style={GlobalStyles.line}/>
        </View>
      )
    }
    return views
  }
  onClick(tab){
    if(!tab) return
    const{theme}=this.params
    if(tab.url){
      NavigationUtil.goPage({theme,title:tab.title,url: tab.url},'WebViewPage')
    }
    if(tab.account && tab.account.indexOf('@')>-1){
      const url = 'mailto://' + tab.account
        Linking.canOpenURL(url).then((support) => {
          if(!support){
            console.log('不支持'+ url);
          } else {
            Linking.openURL(url)
          }
        }).catch((err) => {
          console.log(err);
        });
    }
    if(tab.account){
      Clipboard.setString(tab.account)
      this.toast.show(tab.title+tab.account+'已复制到剪切板')
    }
  }
  render() {
    const content = <View>
      {this._item(this.state.data.aboutMe.Tutorial,this.state.showTutorial,'showTutorial')}
      <View style={GlobalStyles.line}/>
      {this.state.showTutorial?this.renderItem(this.state.data.aboutMe.Tutorial.items):null}

      {this._item(this.state.data.aboutMe.Blog,this.state.showBlog,'showBlog')}
      <View style={GlobalStyles.line}/>
      {this.state.showBlog?this.renderItem(this.state.data.aboutMe.Blog.items):null}

      {this._item(this.state.data.aboutMe.QQ,this.state.showQQ,'showQQ')}
      <View style={GlobalStyles.line}/>
      {this.state.showQQ?this.renderItem(this.state.data.aboutMe.QQ.items,true):null}

      {this._item(this.state.data.aboutMe.Contact,this.state.showContact,'showContact')}
      <View style={GlobalStyles.line}/>
      {this.state.showContact?this.renderItem(this.state.data.aboutMe.Contact.items,true):null}
    </View>
    return <View style={{flex:1}}>
      {this.aboutCommon.render(content, this.state.data.author)}
      <Toast ref={toast => this.toast = toast} position={'center'}/>
    </View>
  }
}