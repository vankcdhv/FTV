/**
 * @format
 */
import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import Route from './src/common/route';
import Navigation from './src/navigation/navigation';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Navigation);
