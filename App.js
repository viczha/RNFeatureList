/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    Component,
    StyleSheet,
    Text,
    View,
    Navigator,
    TouchableOpacity,
    Image
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
    }

    componentWillUnmount() {
        this._emitter.removeAll();
    }


    renderBody(route, navigator) {
        return (
            <View>
                {this.renderHeaderSection(route, navigator)}
                {this.renderNavComponet(route, navigator)}
            </View>
        )
    }

    renderHeaderSection(route, navigator) {
        if(route.index > 0 && route.hasHeader) {
            return (
                <View style={{height: 70, justifyContent: 'center',}}>
                    <TouchableOpacity
                        style={{paddingLeft: 12, backgroundColor: 'transparent'}}
                        onPress={() => {navigator.pop()}}>
                        <View style={{width: 27, height: 27, borderRadius: 13.5, backgroundColor: 'black', opacity: 0.5}}>
                            <Image
                                style={{width: 27, height: 27, backgroundColor: 'transparent'}}
                                source={require('./Src/Images/back.png')} />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return false;
        }

    }


    renderNavComponet(route, navigator) {
        var ComponentView = appViews[route.componentName];
        return <ComponentView
            ref={(c) => {this._currentComponent = c}}
            style={{flex: 1}}
            navigator={navigator}
            emitter={this._emitter}
        ></ComponentView>
    }

    //navigatorBack(route, navigator) {
    //    if(route.index > 0) {
    //        navigator.pop();
    //    }
    //}

    render() {
        return (
            <Navigator
                ref={(nav) => {this.nav = nav}}
                initialRoute={{name: 'S', index: 0, componentName: 'ViewList'}}
                renderScene={this.renderBody.bind(this)}
                onDidFocus={this.navigatorDidFocus.bind(this)}

            />
        );
    }
}

module.exports = App;
