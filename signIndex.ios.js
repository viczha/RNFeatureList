var NativeCommonSDK = require('react-native').NativeModules.PCReactSDK;
var NativeIphSDK = require('react-native').NativeModules.PHReactComponent;

'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    AppRegistry,
    TouchableOpacity,
    Navigator,
    StyleSheet,
    Text,
    View,
    ActivityIndicatorIOS,
    Image
    } = ReactNative;

var BasicInfo = require('./musicComponents/BasicInfo');

var NavigationBarRouteMapper = {

    LeftButton: function(route, navigator, index, navState) {

        if(route.showLeftButton === false) {
            return false;
        }

        var backAction = (r, n, i, ns) => {
            if(i === 0) {
                NativeIphSDK.nativeBackAction({animated: true}, (error, event) => {})
            } else {
                n.pop()
            }
        }

        return (
            <TouchableOpacity
                onPress={() => {
                    backAction(route, navigator, index, navState);
                }}
                style={[styles.navBarLeftButton]}>
                <Image
                    style={{width: 27, height: 27}}
                    source={{uri: 'Reg_Back'}} />
            </TouchableOpacity>
        );
    },

    RightButton: function(route, navigator, index, navState) {
        if(route.showRightButton === false) {
            return false;
        }

        var nextAction = (r, n, i, ns) => {
            n.sub && n.sub.nextStep();
        }

        var buttonTextStyle = route.buttonTextStyle || {};

        return (
            <TouchableOpacity
                onPress={() => {
                    nextAction(route, navigator, index, navState)
                }}
                style={styles.navBarRightButton}>
                <Text style={[styles.navBarText, styles.navBarButtonText, buttonTextStyle]}>
                    下一步
                </Text>
            </TouchableOpacity>
        );
    },

    Title: function(route, navigator, index, navState) {
        return (
            <View style={{height: 44, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={[styles.navBarText, styles.navBarTitleText]}>
                    {route.title}
                </Text>
            </View>

        );
    },

};

class MusicHomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLogin: true,
            token: '',
            userInfo: {},
        }

        NativeCommonSDK.userInfo({}, (error, data) => {//获取登录信息
            if (error) {
                this.setState({
                    isLogin: false
                });
            } else {
                this.setState({
                    isLogin: true,
                    userInfo: data
                })
            }
        });

        this.data = {
            teamName: '',
            teamLogo: '',
            teamKouhao: '',
            teamAddress: '',
            members: ['', '', '', '', ''],
            isBindNumber: false,
            phone: '',
            phoneToken: '',
            idNumber: ''
        }
    }

    showLoading() {
        this.setState({showLoading: true});
    }

    hideLoading() {
        this.setState({showLoading: false});
    }

    componentDidMount() {
        NativeCommonSDK.hiddenLoadingView({reactTag: 1}, (error, event) => {
        });
    }

    renderScene(route, navigator) {
        if(!this.state.isLogin) {
            return (
                <View style={{flex: 1}}>
                    <View style={{height: 65}}></View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text>未登陆</Text>
                    </View>
                </View>
            )
        }

        var SubComponent = route.component;
        return (
            <View style={{flex: 1}}>
                <View style={{height: 65}}></View>
                <SubComponent
                    ref={(sub) => {navigator.sub = sub}}
                    {...this.state}
                    data={this.data}
                    showLoading={this.showLoading.bind(this)}
                    hideLoading={this.hideLoading.bind(this)}
                    navigator={navigator}>
                </SubComponent>
            </View>
        )
    }

    renderLoading() {
        if(this.state.showLoading) {
            return (
                <View style={styles.mask}>
                    <ActivityIndicatorIOS
                        size="large"
                        color="white"
                    />
                </View>
            )
        } else {
            return false;
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <Navigator
                    debugOverlay={false}
                    style={styles.container}
                    initialRoute={{
                    title: '填写基础信息(1/4)',
                    component: BasicInfo
                }}
                    renderScene={(route, navigator) => this.renderScene(route, navigator)}
                    navigationBar={
                    <Navigator.NavigationBar
                        routeMapper={NavigationBarRouteMapper}
                        style={styles.navBar}
                    />
                }
                />
                {this.renderLoading()}
            </View>

        );
    }


}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee',
    },

    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        opacity: 0.2,
        alignItems:'center',
        justifyContent: 'center'
    },

    messageText: {
        fontSize: 17,
        fontWeight: '500',
        padding: 15,
        marginTop: 50,
        marginLeft: 15,
    },
    button: {
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#CDCDCD',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '500',
    },
    navBar: {
        paddingTop: 0,
        backgroundColor: '#eeeeee',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(200, 200, 200, 1)'
    },
    navBarText: {
        fontSize: 16,
        marginVertical: 10,
    },
    navBarTitleText: {
        fontWeight: '500',
        marginVertical: 9,
    },
    navBarLeftButton: {
        paddingLeft: 10,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center'
    },
    navBarRightButton: {
        height: 44,
        paddingRight: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    navBarButtonText: {
        color: 'rgba(239, 46, 46, 1)'
    },
    scene: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#EAEAEA',
    },
});

AppRegistry.registerComponent('reactPage', () => MusicHomePage);