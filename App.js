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
                        title="Blue Tab"
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

    render() {
        return (
            <Navigator
                style={{flex:1}}
                debugOverlay={false}
                ref={(navigator) => {this.navigator = navigator}}
                initialRoute={ROUTE_STACK[0]}
                initialRouteStack={ROUTE_STACK}
                renderScene={(router, navigator) => {
                    if(router.name == 'ViewList') {
                        return (<ViewList></ViewList>)
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
                onDidFocus={this.navigatorDidFocus.bind(this)}
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
    }
}

var styles = StyleSheet.create({
    button: {
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#CDCDCD',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '500',
    },
    appContainer: {
        overflow: 'hidden',
        backgroundColor: '#dddddd',
        flex: 1,
    },
    messageText: {
        fontSize: 17,
        fontWeight: '500',
        padding: 15,
        marginTop: 50,
        marginLeft: 15,
    },
    scene: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#EAEAEA',
    },
    tabs: {
        height: 70,
    }
});

module.exports = App;
