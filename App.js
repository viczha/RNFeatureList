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
    Platform,
    BackAndroid
} from 'react-native';

var JSUtils = require('./Utils/common');
var appViews = require('./Views/AppViews');
var Tabbar = require('./UIComponent/Tabbar/index');
var Icon = require('react-native-vector-icons/FontAwesome');

var NativeModules = require('react-native').NativeModules;

var ROUTE_STACK = [
    {name: 'BasicList', index: 0},
    {name: 'MyLibList', index: 1},
    {name: 'ThirdPartyList', index: 2}
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
                <Tabbar
                    items={[
                        {
                            icon: 'code',
                            title: 'Basic Usage',
                            selected:this.state.tabIndex === 0,
                            onPress:() => {
                              this.props.onTabIndex(0);
                              this.setState({ tabIndex: 0, });
                            }
                        },
                        {
                            icon: 'star',
                            title: 'My Lib',
                            selected:this.state.tabIndex === 1,
                            onPress:() => {
                              this.props.onTabIndex(1);
                              this.setState({ tabIndex: 1, });
                            }
                        },
                        {
                            icon: 'heart',
                            title: 'Third Party',
                            selected:this.state.tabIndex === 2,
                            onPress:() => {
                              this.props.onTabIndex(2);
                              this.setState({ tabIndex: 2, });
                            }
                        }
                    ]}
                />
            </View>
        );
    }
}


class App extends Component {
    constructor(props) {
        super(props);

        this._emitter = new JSUtils.EventEmitter();
        super(props);

        this.androidBackHandle = () => {
            this.nav.pop();
            return true;
        };

        //
    }

    navigatorDidFocus(evt) {
        this._emitter.trigger(null, evt.componentName + 'DidFocus', evt);
    }

    componentDidMount() {
        if(Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.androidBackHandle);
        }
    }

    componentWillUnmount() {
        this._emitter.removeAll();
        if(Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.androidBackHandle);
        }
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
                        var ComponentView = appViews[router.name];
                        return (
                            <View style={{flex: 1}}>
                                <ComponentView navigator={navigator} />
                            </View>)
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
                    />
                </View>)
        }
    }

    renderHeaderSection(route, navigator) {
        if(route.index > 0 && route.hasHeader) {
            return (
                <View style={{marginTop: 20, height: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderBottomWidth: 1}}>
                    <TouchableOpacity
                        style={{width: 50,justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}
                        onPress={() => {navigator.pop()}}>
                        <Icon name={'chevron-left'}
                              size={25}
                              color={'gray'} />
                    </TouchableOpacity>
                    <View style={{flex:1, alignItems: 'center', justifyContent: 'center',}}><Text style={{fontSize: 13, color: 'rgba(50, 50, 50, 1)',}}>{route.title}</Text></View>
                    <View
                        style={{width: 50,justifyContent: 'center', alignItems: 'center',}}>
                    </View>
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
