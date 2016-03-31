/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    Component,
    StyleSheet,
    Text,
    View,
    Navigator
} from 'react-native';

var appViews = require('./Views/AppViews')


class App extends Component {
    renderNavComponet(route, navigator) {
        var ComponentView = appViews[route.componentName];
        return <ComponentView
            navigator = {navigator}
            onBack={() => {
                if(route.index > 0) {
                    navigator.pop();
                }
            }}></ComponentView>
    }

    render() {
        return (
            <Navigator
                initialRoute={{name: 'S', index: 0, componentName: 'ViewList'}}
                renderScene={this.renderNavComponet.bind(this)}
            />
        );
    }
}

module.exports = App;
