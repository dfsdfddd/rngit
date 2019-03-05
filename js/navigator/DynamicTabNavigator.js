import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';


// 导入页面
import PopPage from '../pages/PopPage';
import FavoriterPage from '../pages/FavoriterPage';
import TrendingPage from '../pages/TrendingPage';
import MyPage from '../pages/MyPage';

// 导入Icon组件
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

// 导入 react-navigation
import {
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation';
import {BottomTabBar} from 'react-navigation-tabs';

import NavigationUtil from './NavigationUtil';



const TABSB = {
  PopPage:{
    screen:PopPage,
    navigationOptions:{
      tabBarLabel:'最热',
      tabBarIcon:({tintColor,focused})=>{ // 系统会传这两个参数，能用到
        return <MaterialIcons
          name={'whatshot'}
          size={26}
          style={{color:tintColor}}
        />
      }
    }
  },
  TrendingPage:{
    screen:TrendingPage,
    navigationOptions:{
      tabBarLabel:'趋势',
      tabBarIcon:({tintColor,focused})=>{ // 系统会传这两个参数，能用到
        return <Ionicons
          name={'md-trending-up'}
          size={26}
          style={{color:tintColor}}
        />
      }
    }
  },
  FavoriterPage:{
    screen:FavoriterPage,
    navigationOptions:{
      tabBarLabel:'收藏',
      tabBarIcon:({tintColor,focused})=>{ // 系统会传这两个参数，能用到
        return <MaterialIcons
          name={'favorite'}
          size={26}
          style={{color:tintColor}}
        />
      }
    }
  },
  MyPage:{
    screen:MyPage,
    navigationOptions:{
      tabBarLabel:'我的',
      tabBarIcon:({tintColor,focused})=>{ // 系统会传这两个参数，能用到
        return <Entypo
          name={'user'}
          size={26}
          style={{color:tintColor}}
        />
      }
    }
  }
}


/**
 * https://reactnavigation.org/docs/zh-Hans/common-mistakes.html
 * 两种方式引入嵌套的路由
 * 第一种 直接把 TestNav 作为一个组件return ，并且传递navigation
 * 然后定义 static router = TestNav.router;
 */
const TestNav = createBottomTabNavigator({
  PopPage:{
    screen:PopPage,
    navigationOptions:{
      tabBarLabel:'最热',
      tabBarIcon:({tintColor,focused})=>{ // 系统会传这两个参数，能用到
        return <MaterialIcons
          name={'whatshot'}
          size={26}
          style={{color:tintColor}}
        />
      }
    }
  },
  TrendingPage:{
    screen:TrendingPage,
    navigationOptions:{
      tabBarLabel:'趋势',
      tabBarIcon:({tintColor,focused})=>{ // 系统会传这两个参数，能用到
        return <Ionicons
          name={'md-trending-up'}
          size={26}
          style={{color:tintColor}}
        />
      }
    }
  },
  FavoriterPage:{
    screen:FavoriterPage,
    navigationOptions:{
      tabBarLabel:'收藏',
      tabBarIcon:({tintColor,focused})=>{ // 系统会传这两个参数，能用到
        return <MaterialIcons
          name={'favorite'}
          size={26}
          style={{color:tintColor}}
        />
      }
    }
  },
  MyPage:{
    screen:MyPage,
    navigationOptions:{
      tabBarLabel:'我的',
      tabBarIcon:({tintColor,focused})=>{ // 系统会传这两个参数，能用到
        return <Entypo
          name={'user'}
          size={26}
          style={{color:tintColor}}
        />
      }
    }
  }
})

class TabBarComponent extends Component{
  constructor(props){
    super(props);
    this.theme = {
      tintColor: props.activeTintColor,
      updateTime: new Date().getTime()
    }
  }
  render(){
    const {routes,index} = this.props.navigation.state;
    if(routes[index].params){
      const {theme} = routes[index].params
      if(theme&&theme.updateTime>this.theme.updateTime){
        this.theme=theme
      }
    }
    return <BottomTabBar
      {...this.props}
      activeTintColor = {this.theme.tintColor||this.props.activeTintColor}
    />
  }
}
// 主体默认导出
export default class DynamicTabNavigator extends Component {

  /**
   * 第二种引入嵌套路由的方式 官网说这个引入方式是错误的，但没报错
   * 这种方式页面会有黄色警告
   */
  _tabNavigator(){
    const {PopPage,FavoriterPage,TrendingPage,MyPage} = TABSB
    const tabss = {PopPage,TrendingPage,FavoriterPage,MyPage} // 动态配置tab属性
    PopPage.navigationOptions.tabBarLabel= 'sb'
    return createAppContainer(createBottomTabNavigator(tabss,{
      tabBarComponent:TabBarComponent
    }))
  }
  /**
   * 第一种
   */
  // static router = TestNav.router;



  render() {
    /**
     * 第二种 设置HomePage居里面的navigation，
     * 第一种就不需要这个操作
     */
    // NavigationUtil.navigation = this.props.navigation
    /**
     * 第一种
     */
    // return <TestNav navigation={this.props.navigation} />
    /**
     * 第二种
     */
    const Tabss = this._tabNavigator()
    return <Tabss/>
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
