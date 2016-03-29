/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

var Game2048 = require('./Views/Game2048')

class RNFeatureList extends Component {
  render() {
    //return (
    //  <View style={styles.container}>
    //              <View style={styles.container} tabLabel="111">
    //                  <Text style={styles.welcome}>
    //                      Welcome to React Native!
    //                  </Text>
    //                  <Text style={styles.instructions}>
    //                      To get started, edit index.android.js
    //                  </Text>
    //                  <Text style={styles.instructions}>
    //                      Shake or press menu button for dev menu
    //                  </Text>
    //              </View>
    //  </View>
    //);
      return (
          <Game2048></Game2048>
      );
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
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('RNFeatureList', () => RNFeatureList);
