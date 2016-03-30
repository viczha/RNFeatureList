/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    Component,
    StyleSheet,
    Text,
    View
} from 'react-native';

var ScrollableTabView = require('react-native-scrollable-tab-view');

class App extends Component {
    render() {
        return (
            <ScrollableTabView>
                <View tabLabel="React">
                    <Text>1</Text>
                </View>
                <View tabLabel="Flow">
                    <Text>2</Text>
                </View>
                <View tabLabel="Just">
                    <Text>3</Text>
                </View>
            </ScrollableTabView>
        );
    }
}

module.exports = App;
