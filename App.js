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

var JSUtils = require('./Utils/common');
var appViews = require('./Views/AppViews')


class App extends Component {
    constructor(props) {
        super(props);

        this._emitter = new JSUtils.EventEmitter();
        super(props);
    }

    navigatorDidFocus(evt) {
        this._emitter.trigger(null, evt.componentName + 'DidFocus', evt);
        //if(this._currentComponent._reactInternalInstance.getName() == evt.componentName) {
        //    this._currentComponent._componentDidFocus && this._currentComponent._componentDidFocus();
        //}
    }

    componentWillUnmount() {
        this._emitter.removeAll();
    }


    renderNavComponet(route, navigator) {
        var ComponentView = appViews[route.componentName];
        return <ComponentView
            ref={(c) => {this._currentComponent = c}}
            navigator={navigator}
            emitter={this._emitter}
        ></ComponentView>
    }

    navigatorBack(route, navigator) {
        if(route.index > 0) {
            navigator.pop();
        }
    }

    render() {
        return (
            <Navigator
                ref={(nav) => {this.nav = nav}}
                initialRoute={{name: 'S', index: 0, componentName: 'ViewList'}}
                renderScene={this.renderNavComponet.bind(this)}
                onDidFocus={this.navigatorDidFocus.bind(this)}
                onBack={this.navigatorBack}
            />
        );
    }
}

module.exports = App;
