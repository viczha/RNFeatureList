/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    Component,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Navigator,
    PixelRatio,
    ScrollView,
    TabBarIOS,
} from 'react-native';

var JSUtils = require('./Utils/common');
var ViewList = require('./Views/ViewList');
var appViews = require('./Views/AppViews');

var ROUTE_STACK = [
    {name: 'ViewList', index: 0},
    {name: '', index: 1},
    {name: '', index: 2}
]

class BottomNavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: props.initTabIndex,
        };
    }
    render() {
        return (
            <View style={styles.tabs}>
                <TabBarIOS>
                    <TabBarIOS.Item
                        icon={require('./Src/Images/playerNumBg@2x.png')}
                        title="Basic"
                        selected={this.state.tabIndex === 0}
                        onPress={() => {
                          this.props.onTabIndex(0);
                          this.setState({ tabIndex: 0, });
                        }}>
                        <View />
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        icon={require('./Src/Images/playerNumBg@2x.png')}
                        title="Blue"
                        selected={this.state.tabIndex === 1}
                        onPress={() => {
                          this.props.onTabIndex(1);
                          this.setState({ tabIndex: 1, });
                        }}>
                        <View />
                    </TabBarIOS.Item>
                    <TabBarIOS.Item
                        icon={require('./Src/Images/playerNumBg@2x.png')}
                        title="Blue Tab"
                        selected={this.state.tabIndex === 2}
                        onPress={() => {
                          this.props.onTabIndex(2);
                          this.setState({ tabIndex: 2, });
                        }}>
                        <View />
                    </TabBarIOS.Item>
                </TabBarIOS>
            </View>
        );
    }
}


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

    renderScene(router, navigator) {
        if(router.componentName === 'home') {
            return (
                <Navigator
                    style={{flex:1}}
                    debugOverlay={false}
                    ref={(navigator) => {this.navigator = navigator}}
                    initialRoute={ROUTE_STACK[0]}
                    initialRouteStack={ROUTE_STACK}
                    renderScene={(router, nav) => {
                        if(router.name == 'ViewList') {
                            return (<ViewList navigator={navigator}></ViewList>)
                        } else {
                            return (<View
                                style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                            >
                                <Text>tab index: {router.index}</Text>
                            </View>)
                        }
                    }}
                    configureScene={() => ({
                      ...Navigator.SceneConfigs.HorizontalSwipeJump,
                      gestures: {}
                    })}
                    navigationBar={
                        <BottomNavBar
                            ref={(navBar) => { this.navBar = navBar; }}
                            initTabIndex={0}
                            onTabIndex={(index) => {
                                this.navigator.jumpTo(ROUTE_STACK[index])
                            }}
                        />
                    }
                />
            );
        } else {
            var ComponentView = appViews[router.componentName];
            return (
                <View style={{flex: 1}}>
                    {this.renderHeaderSection(router, navigator)}
                    <ComponentView
                        ref={(c) => {this._currentComponent = c}}
                        style={{flex: 1}}
                        navigator={navigator}
                        emitter={this._emitter}
                    ></ComponentView>
                </View>)
        }
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

    render() {
        return (
            <Navigator
                ref={(nav) => {this.nav = nav}}
                initialRoute={{name: 'S', index: 0, componentName: 'home'}}
                renderScene={this.renderScene.bind(this)}
                onDidFocus={this.navigatorDidFocus.bind(this)}
            />
        )
    }
}

var styles = StyleSheet.create({
    tabs: {
        height: 50,
    }
});

module.exports = App;
