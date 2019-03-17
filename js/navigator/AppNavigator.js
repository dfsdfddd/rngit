import React from "react";
import {
  createStackNavigator,
  createSwitchNavigator,
  createMaterialTopTabNavigator,
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation';

// redux 相关依赖
import {connect} from 'react-redux';
import {
  createReduxContainer,//3.0 的时候改名了 reduxifyNavigator
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
} from 'react-navigation-redux-helpers';

import WelcomePage from '../pages/WelcomePage';
import HomePage from '../pages/HomePage';
import DetailPage from '../pages/DetailPage';
import FetchdemoPage from '../pages/FetchdemoPage';
import AsyncStoragedemoPage from '../pages/AsyncStoragedemoPage';
import DataStoredemoPage from '../pages/DataStoredemoPage';

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
      header:null// 设置headernull  禁用头部
    }
  },
  FetchdemoPage:{
    screen: FetchdemoPage,
    navigationOptions:{
      // header:null// 设置headernull  禁用头部
    }
  },
  AsyncStoragedemoPage:{
    screen: AsyncStoragedemoPage,
    navigationOptions:{
      // header:null// 设置headernull  禁用头部
    }
  },
  DataStoredemoPage:{
    screen: DataStoredemoPage,
    navigationOptions:{
      // header:null// 设置headernull  禁用头部
    }
  },
})

// 定义根路由 (Init,Main)
export const rootCom = 'Init'

// defaultNavigationOptions
export const RootNavigator = createAppContainer(createSwitchNavigator({
  Init:InitNavigator,
  Main:MainNavigator
},{
  defaultNavigationOptions:{
    header: null
  }
})
)

/**
 * 1.初始化react-navigation与redux的中间件
 * 该方法的一个很大的作用就是为createReduxContainer的key设置actionSubscribers（行为订阅者）
 * https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js
 * 
 * 任何改变 navigation state 的事件都能正确触发事件监听器
 * 返回可应用于Redux存储的中间件。
Param navStateSelector从您的商店中选择导航状态。
Param key需要对Redux商店来说是唯一的，并且与createReduxContainer下面的调用一致。如果你只有一家商店，你可以把它留下来。

 */
// Note: createReactNavigationReduxMiddleware must be run before createReduxContainer
export const middleware = createReactNavigationReduxMiddleware(
  state => state.nav,
  "root",
);

/**
 * 2.将根导航组件传递给createReduxContainer 函数
 * 将根导航器组件传递给 createReduxContainer 函数, 并返回一个新组件, 该组件需要 navigation state 和 dispatch 函数作为 props。
 * 返回包装根导航器的HOC（高阶组件）。
createReactNavigationReduxMiddleware 必须在此之前调用！
Param navigator是您的根导航器（React组件）。
Param key需要与createReactNavigationReduxMiddleware上面的调用保持一致。如果你只有一家商店，你可以把它留下来。
返回用于代替根导航器的组件。传递它state和dispatch你通过react-redux的道具connect。
 */

const AppWithNav = createReduxContainer(RootNavigator, "root");

//（这一步是缺少的）在 Redux 内的 navigation state 将需要使用 React Navigation 的 navigation reducer 保持更新。你将从 Redux 的主 reducer 调用这个 reducer。

/**
 * State到Props的映射关系
 */

const mapStateToProps = (state) => ({
  state: state.nav,
});

/**
 * 3连接 react 组件与redux store
 * 
 * 用于从 UI 组件生成容器组件。connect的意思，就是将这两种组件连起来
 */
export default connect(mapStateToProps)(AppWithNav);