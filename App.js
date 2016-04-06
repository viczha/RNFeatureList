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
    navigatorDidFocus(evt) {
        console.log(evt)
        if(this._currentComponent._reactInternalInstance.getName() == evt.componentName) {
            this._currentComponent._componentDidFocus && this._currentComponent._componentDidFocus();
        }

        console.log(evt)
    }


    renderNavComponet(route, navigator) {
        var ComponentView = appViews[route.componentName];
        return <ComponentView
            ref={(c) => {this._currentComponent = c}}
            navigator = {navigator}
           ></ComponentView>
    }

    render() {
        return (
            <Navigator
                ref={(nav) => {this.nav = nav}}
                initialRoute={{name: 'S', index: 0, componentName: 'ViewList'}}
                renderScene={this.renderNavComponet.bind(this)}
                onDidFocus={this.navigatorDidFocus.bind(this)}
                onBack={() => {
                    if(route.index > 0) {
                        navigator.pop();
                    }
                }}
            />
        );
    }
}

module.exports = App;
