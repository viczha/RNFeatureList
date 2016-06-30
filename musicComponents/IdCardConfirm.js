'use strict'

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

var KeyboardAwaireView = require('../UIToolkit/KeyboardAwaireView');
var Toast = require('../UIToolkit/Toast');

var SignUpFinish = require('./SignUpFinish');
var NativeCommonSDK = require('react-native').NativeModules.PCReactSDK;

var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}

function isCardID(sId){
    var iSum=0 ;
    var info="" ;
    if(!/^\d{17}(\d|x)$/i.test(sId)) return false;
    sId=sId.replace(/x$/i,"a");
    if(aCity[parseInt(sId.substr(0,2))]==null) return false;
    var sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
    var d=new Date(sBirthday.replace(/-/g,"/")) ;
    if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return false;
    for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
    if(iSum%11!=1) return false;
    return true;
}

class BasicInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            idNum: props.data.idNum,
            isRead: false,
        }
    }

    nextStep() {
        if(this.checkMsg()) {
            this.props.showLoading();
            var postData = [
                "cname=" + this.props.data.members[0],
                "phone=" + this.props.data.phone,
                "address=" + this.props.data.teamAddress,
                "card=" + this.props.data.idNumber,
                "photo=" + decodeURIComponent(this.props.data.teamLogo),
                "phonetoken=" + this.props.data.phoneToken ,
                "g_name=" + this.props.data.teamName,
                "members=" + this.props.data.members.slice(1).filter(v => v != '').join(','),
                "introduction=" + this.props.data.teamKouhao + '          '.substr(this.props.data.teamKouhao.length) //测试测试测试测试测试测试
            ];
            fetch('http://api.aptech.pptv.com/api/sign?platform=aph web&' + postData.join('&'), {
                method: 'get',
                headers: {
                    cobratoken: this.props.userInfo.token
                }
            }).then((data) => {
                this.props.hideLoading();

                if(data.ok === true) {

                    var responseData = JSON.parse(data._bodyText);
                    console.log('response data ----------');
                    console.log(responseData);
                    if(responseData.status == 1) {
                        this.props.navigator.push({
                            title: '报名完成',
                            component: SignUpFinish,
                            showLeftButton: false,
                            showRightButton: false,
                        })
                    }
                    this.toast.show('提交失败')
                } else {
                    this.toast.show('提交失败')
                }

            }).catch((error) => {
                this.props.hideLoading();
            });


        }
    }

    checkMsg() {
        if(this.state.idNum === '') {
            this.toast.show('请输入身份证号', 130)
            return false;
        }

        if(!isCardID(this.state.idNum)) {
            this.toast.show('身份证号格式不正确', 145)
            return false;
        }

        if(!this.state.isRead) {
            this.toast.show('请先阅读参赛协议', 145)
            return false;
        }

        this.props.data.idNumber = this.state.idNum;

        return true;
    }

    openExtLink(url) {
        var pageurl ='app://iph.pptv.com/v4/web?url=' + encodeURIComponent(url);
        NativeCommonSDK.openNativePage({pageUrl: pageurl}, (error, events) => {
            if (error) {
            } else {
            }
        });
    }

    render() {
        return (
            <KeyboardAwaireView style={{flex: 1, backgroundColor: '#eeeeee', overflow: 'hidden'}}>
                <ScrollView ref='scrollView' style={{flex: 1}}>
                    <View style={styles.tip}>
                        <Text style={{fontSize: 12, color: '#969696'}}>我们需要确认您的身份信息来保证比赛奖励给到你本人</Text>
                        <Text style={{fontSize: 12, color: '#969696'}}>PPTV聚力会严格保护您的个人信息!</Text>
                    </View>
                    <View style={{padding: 12, backgroundColor: 'white',}}>
                        <View style={{flexDirection:'row', alignItems: 'center', marginRight: 6,}}>
                            <Image
                                style={{width: 25, height: 25,marginRight: 10}}
                                source={{uri: 'zhengjianhaoma'}} />
                            <View style={{flex: 1, marginLeft: 10}}>
                                <TextInput
                                    ref='contactText'
                                    style={styles.contactTxtInput}
                                    placeholder='请输入队长身份证号'
                                    value={this.state.idNum}
                                    placeholderTextColor='rgba(150, 150, 150, 1)'
                                    onChangeText={(idNum) => this.setState({idNum})}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center', marginTop: 36,}}>
                        <TouchableOpacity onPress={() => this.setState({isRead: !this.state.isRead})}>
                            <Image
                                style={{width: 12, height: 12,marginRight: 10, marginLeft: 10}}
                                source={{uri: this.state.isRead ? 'xuanze_gou' : 'xuanze_kong'}} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => this.openExtLink('http://bdqn.pptv.com/protocol/')}>
                            <Text style={{color: 'rgba(150, 150, 150, 1)'}}>我已阅读并同意本参赛协议</Text>
                            <Image
                                style={{width: 12, height: 12,marginLeft: 10}}
                                source={{uri: 'jiantou_you'}} />
                        </TouchableOpacity>
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
        flex: 1,
    },

    tip: {
        height: 43,
        backgroundColor: '#DCDCDC',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

module.exports = BasicInfo;




