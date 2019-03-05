import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

// 导入页面
import PopPage from './PopPage';
import FavoriterPage from './FavoriterPage';
import TrendingPage from './TrendingPage';
import MyPage from './MyPage';

// 导入Icon组件
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

// 导入 react-navigation
import {
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';

import  DynamicTabNavigator  from "../navigator/DynamicTabNavigator";



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

// 主体默认导出
export default class HomePage extends Component {

  /**
   * 第二种引入嵌套路由的方式 官网说这个引入方式是错误的，但没报错
   * 这种方式页面会有黄色警告
   */
  _tabNavigator(){
    const {PopPage,FavoriterPage,TrendingPage,MyPage} = TABSB
    const tabss = {PopPage,FavoriterPage,TrendingPage}
    return createAppContainer(createBottomTabNavigator(tabss))
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
    NavigationUtil.navigation = this.props.navigation
    /**
     * 第一种
     */
    // return <TestNav navigation={this.props.navigation} />
    /**
     * 第二种
     */
    const Tab = this._tabNavigator()
    return <Tab/>

    // return <DynamicTabNavigator/>
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
