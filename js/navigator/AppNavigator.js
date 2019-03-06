import React from "react";
import {
  createStackNavigator,
  createSwitchNavigator,
  createMaterialTopTabNavigator,
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation';


import WelcomePage from '../pages/WelcomePage';
import HomePage from '../pages/HomePage';
import DetailPage from '../pages/DetailPage';

import PopPage from '../pages/PopPage';
import FavoriterPage from '../pages/FavoriterPage';
import TrendingPage from '../pages/TrendingPage';
import MyPage from '../pages/MyPage';


const BottomNav = createBottomTabNavigator({
  PopPage:{
    screen:PopPage,
    navigationOptions:{
      tabBarLabel:'流行'
    }
  },
  TrendingPage:{
    screen:TrendingPage,
    navigationOptions:{
      tabBarLabel:'趋势'
    }
  },
  FavoriterPage:{
    screen:FavoriterPage,
    navigationOptions:{
      tabBarLabel:'收藏'
    }
  },
  MyPage:{
    screen:MyPage,
    navigationOptions:{
      tabBarLabel:'我的'
    }
  }
})


const InitNavigator = createStackNavigator({
  WelcomePage:{
    screen: WelcomePage,
    navigationOptions:{
      header:null// 设置headernull  禁用头部
    }
  },
  BottomNav:{
    screen: BottomNav,
    navigationOptions:{
      title: 'BottomTabNavigator'
    }
  }
})
const MainNavigator = createStackNavigator({
  HomePage:{
    screen: HomePage,
    navigationOptions:{
      header:null// 设置headernull  禁用头部
    }
  },
  DetailPage:{
    screen: DetailPage,
    navigationOptions:{
      // header:null// 设置headernull  禁用头部
    }
  },
})


// defaultNavigationOptions
export default createAppContainer(createSwitchNavigator({
  Init:InitNavigator,
  Main:MainNavigator
},{
  defaultNavigationOptions:{
    header: null
  }
})
)
