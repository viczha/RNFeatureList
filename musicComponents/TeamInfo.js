'use strict'

var React = require('react-native');

var {
    Text,
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity
    } = React;

const PhoneNumber = require('./PhoneNumber');
var Toast = require('../UIToolkit/Toast');
var KeyboardAwaireView = require('../UIToolkit/KeyboardAwaireView');
var util = require('../Utils/JSUtils');

class BasicInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            capital: props.data.members[0],
            member1: props.data.members[1],
            member2: props.data.members[2],
            member3: props.data.members[3],
            member4: props.data.members[4],
        }
    }

    nextStep() {
        if(this.checkMsg()) {
            this.props.navigator.push({
                title: '手机号确认(3/4)',
                component: PhoneNumber
            })
        }

    }

    isRegularString(str) {
        var reg = /^([\u4e00-\u9fa5]|\s)+$/;
        return reg.test(str) || str === '';
    }

    checkMsg() {
        if(!this.isRegularString(this.state.capital)
            || !this.isRegularString(this.state.member1)
            || !this.isRegularString(this.state.member2)
            || !this.isRegularString(this.state.member3)
            || !this.isRegularString(this.state.member4)) {
            this.toast.show('姓名不能包含特殊字符', 160);
            return false;
        }

        if(this.state.capital.length > 10
            || this.state.member1.length > 10
            || this.state.member2.length > 10
            || this.state.member3.length > 10
            || this.state.member4.length > 10) {
            this.toast.show('姓名不能超过10个字符', 160);
            return false;
        }

        if(this.state.capital === '') {
            this.props.data.members[0] = '';
            this.toast.show('不能没有队长哦', 130);
            return false;
        } else {
            this.props.data.members[0] = this.state.capital;
        }

        var memberCount = 0;
        if(this.state.member1 !== '') {
            memberCount++;
            this.props.data.members[1] = this.state.member1;
        } else {
            this.props.data.members[1] = '';
        }

        if(this.state.member2 !== '') {
            memberCount++;
            this.props.data.members[2] = this.state.member2;
        } else {
            this.props.data.members[2] = '';
        }

        if(this.state.member3 !== '') {
            memberCount++;
            this.props.data.members[3] = this.state.member3;
        } else {
            this.props.data.members[3] = '';
        }

        if(this.state.member4 !== '') {
            memberCount++;
            this.props.data.members[4] = this.state.member4;
        } else {
            this.props.data.members[4] = '';
        }

        if(memberCount === 0) {
            this.toast.show('至少需要两名成员', 130);
            return false;
        }

        return true;
    }

    render () {
        return (
            <KeyboardAwaireView style={{flex: 1,backgroundColor: '#eeeeee',}}>
                <ScrollView style={{flex: 1,backgroundColor: '#eeeeee',}}>
                    <View style={styles.tip}>
                        <Text style={{fontSize: 12, color: '#969696'}}>最多添加5人,最少添加2人.</Text>
                    </View>
                    <View style={{backgroundColor: 'white', paddingTop: 30, paddingBottom: 30}}>
                        <View style={{flexDirection: 'row', height: 40, paddingLeft: 21, marginBottom: 15}}>
                            <Image
                                style={styles.add_capital_icon}
                                source={{uri: 'teamCapital'}} >
                                <Image
                                    style={{width: 16, height: 16, position: 'absolute', right: 0, top: 0, backgroundColor: 'transparent'}}
                                    source={{uri: 'capitalIndicator'}} />
                            </Image>

                            <View style={{flex: 1, marginLeft: 7.5}}>
                                <TextInput
                                    ref='capital'
                                    style={styles.contactTxtInput}
                                    placeholder='请填写队长真实姓名'
                                    placeholderTextColor='rgba(150, 150, 150, 1)'
                                    value={this.state.capital}
                                    onChangeText={(capital) => this.setState({capital: util.trim(capital)})}
                                />
                                <View style={styles.line}></View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', height: 40, paddingLeft: 21,marginBottom: 15}}>
                            <Image
                                style={styles.add_capital_icon}
                                source={{uri: 'teamMember'}} />
                            <View style={{flex: 1, marginLeft: 7.5}}>
                                <TextInput
                                    ref='member1'
                                    style={styles.contactTxtInput}
                                    placeholder='请填写成员真实姓名'
                                    placeholderTextColor='rgba(150, 150, 150, 1)'
                                    value={this.state.member1}
                                    onChangeText={(member1) => this.setState({member1: util.trim(member1)})}
                                />
                                <View style={styles.line}></View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', height: 40, paddingLeft: 21,marginBottom: 15}}>
                            <Image
                                style={styles.add_capital_icon}
                                source={{uri: 'teamMember'}} />
                            <View style={{flex: 1, marginLeft: 7.5}}>
                                <TextInput
                                    ref='member2'
                                    style={styles.contactTxtInput}
                                    placeholder='请填写成员真实姓名'
                                    value={this.state.member2}
                                    placeholderTextColor='rgba(150, 150, 150, 1)'
                                    onChangeText={(member2) => this.setState({member2: util.trim(member2)})}
                                />
                                <View style={styles.line}></View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', height: 40, paddingLeft: 21,marginBottom: 15}}>
                            <Image
                                style={styles.add_capital_icon}
                                source={{uri: 'teamMember'}} />
                            <View style={{flex: 1, marginLeft: 7.5}}>
                                <TextInput
                                    ref='member3'
                                    style={styles.contactTxtInput}
                                    placeholder='请填写成员真实姓名'
                                    value={this.state.member3}
                                    placeholderTextColor='rgba(150, 150, 150, 1)'
                                    onChangeText={(member3) => this.setState({member3: util.trim(member3)})}
                                />
                                <View style={styles.line}></View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', height: 40, paddingLeft: 21,marginBottom: 15}}>
                            <Image
                                style={styles.add_capital_icon}
                                source={{uri: 'teamMember'}} />
                            <View style={{flex: 1, marginLeft: 7.5}}>
                                <TextInput
                                    ref='member4'
                                    style={styles.contactTxtInput}
                                    placeholder='请填写成员真实姓名'
                                    value={this.state.member4}
                                    placeholderTextColor='rgba(150, 150, 150, 1)'
                                    onChangeText={(member4) => this.setState({member4: util.trim(member4)})}
                                />
                                <View style={styles.line}></View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Toast ref={(toast) => {this.toast = toast}}></Toast>
            </KeyboardAwaireView>

        )
    }
}

const styles = StyleSheet.create({
    line: {
        height: 1,
        backgroundColor: 'rgba(200, 200, 200, 1)',
        flex: 1,
    },

    contactTxtInput: {
        fontSize: 13,
        height: 39,
        paddingLeft: 5,
    },

    tip: {
        height: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },

    add_capital_icon: {
        width: 40,
        height: 40,
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



