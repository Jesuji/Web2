/**
 * @format
 */

const { AppRegistry } = require('react-native');
const App = require('./src/App').default;
const { name: appName } = require('./app.json');

AppRegistry.registerComponent(appName, () => App);