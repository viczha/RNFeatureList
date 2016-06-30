var React = require('react-native');

var {
    Text,
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    Image,
    PickerIOS,
    TouchableOpacity,
    Animated
    } = React;

var KeyboardAwaireView = require('../UIToolkit/KeyboardAwaireView')

class BasicInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addedNum: 0
        }
    }

    nextStep() {
        this.props.navigator.pop();
    }

    inputFocused (refName) {
        setTimeout(() => {
            let scrollResponder = this.refs.scrollView.getScrollResponder();
            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                React.findNodeHandle(this.refs[refName]),
                -400, //additionalOffset
                true
            );
        }, 200);
    }

    render() {
        return (
            <KeyboardAwaireView style={{flex: 1, backgroundColor: '#eeeeee', overflow: 'hidden'}}>
                <ScrollView ref='scrollView' style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row', marginTop: 12, padding: 12, backgroundColor: 'white', height: 100, alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{flex: 0.7}}>
                                <TextInput
                                    ref='contactText'
                                    style={styles.contactTxtInput}
                                    placeholder='请填写真实姓名'
                                    placeholderTextColor='rgba(150, 150, 150, 1)'
                                />
                                <View style={styles.line}></View>
                            </View>
                            <View style={{flex: 0.3, alignItems:'center', justifyContent:'center'}}>
                                <Image
                                    style={{width: 75, height: 75}}
                                    source={{uri: 'dianjishangchuangroup'}} />
                            </View>
                        </View>
                    </View>
                    <View style={{marginTop: 12, padding: 12, backgroundColor: 'white',}}>
                        <View style={{flexDirection:'row', alignItems: 'center', marginRight: 6,}}>
                            <Image
                                style={{width: 25, height: 25}}
                                source={{uri: 'xingbie'}} />
                            <View style={{flex: 1, marginLeft: 10, flexDirection: 'row'}}>
                                <Image
                                    style={{width: 15, height: 15, marginRight: 6}}
                                    source={{uri: 'xuanze_gou'}} />
                                <Text>男</Text>
                                <Image
                                    style={{width: 15, height: 15, marginLeft: 25, marginRight: 6}}
                                    source={{uri: 'xuanze_kong'}} />
                                <Text>女</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row', alignItems: 'center', marginRight: 6,}}>
                            <Image
                                style={{width: 25, height: 25}}
                                source={{uri: 'shengri'}} />
                            <TouchableOpacity style={{flex: 1, marginLeft: 10}}>
                                <TextInput
                                    ref='shenri'
                                    style={styles.contactTxtInput}
                                    value={this.state.areaStr}
                                    placeholder='生日'
                                    placeholderTextColor='rgba(150, 150, 150, 1)'
                                    onFocus={this.inputFocused.bind(this, 'shenri')}
                                />
                                <View style={styles.line}></View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAwaireView>
        )
    }
}

const styles = StyleSheet.create({
    contactTxtInput: {
        fontSize: 13,
        height: 38,
    },
    line: {
        height: 1,
        backgroundColor: 'rgba(200, 200, 200, 1)',
        flex: 1,
    },

    tip: {
        height: 25,
        backgroundColor: '#DCDCDC',
        alignItems: 'center',
        justifyContent: 'center',
    },

    add_capital_icon: {
        width: 25,
        height: 25,
    },

    capitalContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#969696',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },

    capitalText: {
        fontSize: 15,
        color: '#DCDCDC',
        marginTop: 6,
    }
});

module.exports = BasicInfo;



