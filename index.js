/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import App from './js/App';
import {name as appName} from './app.json';

// import {createAppContainer} from 'react-navigation';
// const AppContainer = createAppContainer(App)
// import WelcomePage from './js/pages/WelcomePage';
// import AppNavigator from "./js/navigator/AppNavigator";


AppRegistry.registerComponent(appName, () => App);
