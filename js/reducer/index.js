import {combineReducers} from 'redux';
import theme from './theme';
import popular from './pop';
import treading from './treading';
import favorite from './favorite';
import language from './language';
import search from './search';
import {rootCom, RootNavigator} from '../navigator/AppNavigator';


/**
 * 创建自己的 navigation reducer
 * 如果要替换 createNavigationReducer 这个 reducer 创建者, 请执行以下操作
 */

/**
 * 1.指定默认的state
 */
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));

/**
 * 2.创建自己的 navigation reducer
 */

const navReducer = (state = navState, action) => {
  const nextState = RootNavigator.router.getStateForAction(action, state);
  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};

/**
 * 3.合并 reducer
 */

 const index = combineReducers({
   nav: navReducer,
   theme:theme,
   popular:popular,
   treading:treading,
   favorite:favorite,
   language:language,
   search:search
 })

 export default index