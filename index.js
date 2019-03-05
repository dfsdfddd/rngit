/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// import WelcomePage from './js/pages/WelcomePage';
import { createAppContainer } from "react-navigation";
import AppNavigator from "./js/navigator/AppNavigator";

const AppContainer = createAppContainer(AppNavigator)

AppRegistry.registerComponent(appName, () => AppContainer);
