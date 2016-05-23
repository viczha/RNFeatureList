import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

var App = require('./App')

class RNFeatureList extends Component {
  render() {
      return <App {...this.props}></App>
  }
}
AppRegistry.registerComponent('RNFeatureList', () => RNFeatureList);
