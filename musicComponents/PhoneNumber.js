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
var IdCardConfirm = require('./IdCardConfirm');
var Toast = require('../UIToolkit/Toast');

const phoneReg = /^1[0-9]{10}$/

class PhoneNumber extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            phoneNumber: props.data.phone,
            yanzhengma: props.data.phoneToken,
            isBindNumber: props.data.isBindNumber,
            isGetNum: false,
            seconds: 60,
        }
    }

    componentWillUnmount() {
        if(this.timerId) {
            clearInterval(this.timerId);
        }
    }

    nextStep() {
        var pushNavgator = () => {
            this.props.navigator.push({
                title: '身份证确认(4/4)',
                component: IdCardConfirm
            })
        };


        if(this.state.isBindNumber) {
            pushNavgator();
            return;
        }

        if(this.checkMsg()) {
            this.props.showLoading();
            fetch('http://api.aptech.pptv.com/api/molibecheck/'+ this.state.phoneNumber +'/'+ this.state.yanzhengma +'?platform=aph web', {
                method: 'get',
                headers: {
                    cobratoken: this.props.userInfo.token
                }
            }).then((data) => {
                this.props.hideLoading();
                if(data.ok === true) {
                    var responseData = JSON.parse(data._bodyText);
                    if(responseData.status == 1) {
                        this.props.data.isBindNumber = true;
                        this.setState({
                            isBindNumber: true,
                        });
                        pushNavgator();
                    } else {
                        this.showError(responseData.status)
                    }

                } else {
                    this.toast.show("验证码不正确")
                }

            }).catch((error) => {
                this.props.hideLoading();
                console.log(error);
            })


        }
    }

    showError(code) {
        switch (code) {
            case -1:
                this.toast.show("验证码不正确", 140);
                break;
            case -2:
                this.toast.show("验证码不正确",140);
                break;
            case -3:
                this.toast.show("验证码过期");
                break;
            case -4:
                this.toast.show("手机号已经被绑定", 140);
                break;
            default:
                this.toast.show("验证失败");
        }
    }

    checkMsg() {
        if(this.state.phoneNumber === '') {
            this.toast.show('请输入手机号码', 130);
            return false;
        }

        if(!phoneReg.test(this.state.phoneNumber)) {
            this.toast.show('手机号格式错误', 130);
            return false;
        } else {
            this.props.data.phone = this.state.phoneNumber;
        }

        if(this.state.yanzhengma === '') {
            this.toast.show('请输入验证码', 130);
            return false;
        } else {
            this.props.data.phoneToken = this.state.yanzhengma;
        }

        return true;
    }

    getNum() {
        //this.changeNum();
        //return;
        if(this.state.phoneNumber === '') {
            this.toast.show('请输入手机号码', 130);
            return false;
        }
        fetch('http://api.aptech.pptv.com/api/phonetoken?telphone='+ this.state.phoneNumber +'&platform=aph web', {
            method: 'get',
            headers: {
                cobratoken: this.props.userInfo.token
            }
        }).then((data) => {
            console.log(data)
            if(data.ok == true) {
                var responseData = JSON.parse(data._bodyText);
                console.log('status--------------')
                console.log(responseData.status);
                console.log(responseData.status == 1);
                if(responseData.status == 1) {
                    this.toast.show('验证码已发送, 请查收短息', 230);
                } else if(responseData.status == -2) {
                    this.toast.show('该手机号已被使用', 130);
                    this.resetState();
                } else {
                    this.toast.show('验证码发送失败', 130);
                    this.resetState();
                }
            } else {
                this.toast.show('验证码发送失败', 130);
                this.resetState();
            }
        }).catch((error) => {
            console.log('error---------')
            console.log(error);
            this.toast.show('验证码发送失败', 130);
            this.resetState();
        });
        this.setState({isGetNum:true});
        this.countDown();
    }

    resetState() {
        if(this.timerId) {
            clearInterval(this.timerId);
        }

        this.setState({
            isGetNum:false,
            seconds: 60
        });
    }

    countDown() {
        if(this.timerId) {
            clearInterval(this.timerId);
        }

        this.timerId = setInterval(() => {
            if(this.state.seconds > 0) {
                console.log(this.state.seconds)
                this.setState({seconds: (this.state.seconds - 1)})
            } else {
                this.resetState();
            }
        }, 1000);
    }

    changeNum() {
        fetch('http://api.aptech.pptv.com/api/unbind?phone='+ this.state.phoneNumber +'&platform=aph web', {
            method: 'get',
            headers: {
                cobratoken: this.props.userInfo.token
            }
        }).then((data) => {
            //var data = data;
            //if(data.ok === true) {
                this.setState({
                    phoneNumber: '',
                    yanzhengma: '',
                    isBindNumber: false,
                    isGetNum: false,
                    seconds: 60,
                });
                this.props.data.phoneNumber = '';
                this.props.data.phoneToken = '';
                this.props.data.isBindNumber = false;
            //} else {
            //    this.toast.show('更换失败')
            //}

        })

    }

    render() {
        if(this.state.isBindNumber) {
            return (
                <KeyboardAwaireView style={{flex: 1, backgroundColor: '#eeeeee'}}>
                    <ScrollView ref='scrollView' style={{flex: 1}}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

                            <Image
                                style={{width: 94, height: 126, marginTop: 32, marginBottom: 38}}
                                source={{uri: 'shoujiyirenzheng'}} />

                            <View style={{marginLeft: 20, marginRight: 20}}>
                                <Text style={{fontSize: 12, color: '#969696'}}>已绑定{this.state.phoneNumber.substr(0, 3)}****{this.state.phoneNumber.substr(7)}</Text>
                            </View>

                            <TouchableOpacity style={{borderWidth: 1, borderRadius: 4,borderColor: '#EE1987', backgroundColor: '#EE1987', width: 200, height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 59, marginBottom: 20}}
                                onPress={this.changeNum.bind(this)}
                            >
                                <Text style={{color: 'white', fontSize: 16}}>更换手机号</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <Toast ref={(toast) => {this.toast = toast}}></Toast>
                </KeyboardAwaireView>
            )
        }

        return (
            <KeyboardAwaireView style={{flex: 1, backgroundColor: '#eeeeee', overflow: 'hidden'}}>
                <ScrollView ref='scrollView' style={{flex: 1}}>
                    <View style={styles.tip}>
                        <Text style={{fontSize: 12, color: '#969696'}}>为了及时将晋级和赛事信息通知到您</Text>
                        <Text style={{fontSize: 12, color: '#969696'}}>请验证手机号码,我们不会泄露您的任何信息!</Text>
                    </View>
                    <View style={{padding: 12, backgroundColor: 'white',}}>
                        <View style={{flexDirection:'row', alignItems: 'center',justifyContent: 'center', height: 44, marginRight: 6,}}>
                            <Image
                                style={{width: 25, height: 25}}
                                source={{uri: 'shouji'}} />
                            <View style={{flex: 1, marginLeft: 10, height: 44}}>
                                <TextInput
                                    ref='phoneNumber'
                                    style={styles.contactTxtInput}
                                    placeholder='输入手机号'
                                    placeholderTextColor='rgba(150, 150, 150, 1)'
                                    value={this.state.phoneNumber}
                                    onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                                />
                                <View style={styles.line}></View>
                            </View>
                        </View>
                        <View style={{flexDirection:'row', alignItems: 'center',justifyContent: 'center', height: 44, marginRight: 6,}}>
                            <Image
                                style={{width: 25, height: 25}}
                                source={{uri: 'yanzhengma'}} />
                            <View style={{flex: 1, marginLeft: 10,height: 43}}>
                                <TextInput
                                    ref='yanzhengma'
                                    style={styles.contactTxtInput}
                                    placeholder='输入验证码'
                                    value={this.state.yanzhengma}
                                    placeholderTextColor='rgba(150, 150, 150, 1)'
                                    onChangeText={(yanzhengma) => this.setState({yanzhengma})}
                                />
                            </View>
                            {this.state.isGetNum ?
                                (<Text style={{color:'#969696', marginRight: 6}}>{this.state.seconds}s</Text>) :
                                (<TouchableOpacity onPress={this.getNum.bind(this)}><Text style={{color:'#ef2e2e'}}>获取验证码</Text></TouchableOpacity>)}
                        </View>
                    </View>
                </ScrollView>
                <Toast ref={(toast) => {this.toast = toast}}></Toast>
            </KeyboardAwaireView>
        )
    }
}

const styles = StyleSheet.create({
    contactTxtInput: {
        fontSize: 13,
        height: 38,
        flex: 1,
    },
    line: {
        height: 1,
        backgroundColor: 'rgba(200, 200, 200, 1)',
    },

    tip: {
        height: 43,
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

module.exports = PhoneNumber;



