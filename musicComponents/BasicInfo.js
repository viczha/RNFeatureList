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
var NativeCommonSDK = require('react-native').NativeModules.PCReactSDK;

var TeamInfo = require('./TeamInfo');

class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            areaStr: props.data.teamAddress,
            teamName: props.data.teamName,
            teamKouhao: props.data.teamKouhao,
            teamUrl: props.data.teamLogo,
        }

        this.data = {
            aIdx: 0,
            pName: '北京市'
        }
    }

    nextStep() {
        if(this.checkMsg()) {
            this.props.navigator.push({
                title: '填写成员信息(2/4)',
                component: TeamInfo
            })
        }

    }

     componentDidMount() {

         //this.refs['teamName'] && this.refs['teamName'].focus();

         setTimeout(() => {
             this.refs['teamName'] && this.refs['teamName'].focus();
         }, 600)
     }

    checkMsg() {
        //return true;

        if(this.state.teamName.length > 15) {
            this.toast.show('组合名称最多15个字符', 160);
            return false;
        }

        if(this.state.teamKouhao.length > 30) {
            this.toast.show('组合口号最多30个字符', 160);
            return false;
        }


        if(this.state.teamName === '') {
            this.toast.show('请填写组合名称', 130);
            return false;
        } else {
            this.props.data.teamName = this.state.teamName;
        }

        if(this.state.teamKouhao === '') {
            this.toast.show('请填写组合口号', 130);
            return false;
        } else {
            this.props.data.teamKouhao = this.state.teamKouhao;
        }

        if(this.state.areaStr === '') {
            this.toast.show('请选择组合所在地', 130);
            return false;
        } else {
            this.props.data.teamAddress = this.state.areaStr;
        }

        if(this.state.teamUrl === '') {
            this.toast.show('请选择组合照片', 130);
            return false;
        }

        return true;
    }

    inputFocused (refName) {
        setTimeout(() => {
            let scrollResponder = this.refs.scrollView.getScrollResponder();
            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                React.findNodeHandle(this.refs[refName]),
                -100, //additionalOffset
                true
            );
        }, 200);
    }

    uploadPic() {
        NativeCommonSDK.uploadPic({
            info: {prod: 'yccm_pic'},
            type: 0,
            size: {width: 400, height: 400}
        }, (error, info) => {
            if(error) {

            } else {
                if(info && info.url) {
                    this.setState({
                        teamUrl: info.url
                    })
                    this.props.data.teamLogo = info.url;
                }
            }

        })
    }

    confirmSelection(str, aIdx, pName) {
        this.data.aIdx = aIdx;
        this.data.pName = pName;
        this.setState({
            areaStr: str,
        })
    }

    renderTeamLog() {
        if(this.state.teamUrl === '') {
            return (<TouchableOpacity style={{flex: 0.3, marginLeft: 15, alignItems:'center', justifyContent:'center'}}
                                      onPress={this.uploadPic.bind(this)}
            >
                <Image
                    style={{width: 85, height: 85}}
                    source={{uri: 'dianjishangchuangroup'}} />
            </TouchableOpacity>)
        } else {
            return (
                <TouchableOpacity style={{flex: 0.3, marginLeft: 15, alignItems:'center', justifyContent:'center'}}
                                  onPress={this.uploadPic.bind(this)}
                >
                    <Image
                        style={{width: 85, height: 85, borderRadius: 42.5}}
                        source={{uri: decodeURIComponent(this.state.teamUrl)}} />
                </TouchableOpacity>
            )
        }
    }

    isRegularString(str) {
        var reg = /^([a-z]|[A-Z]|[\u4e00-\u9fa5]|\s|\d)+$/;
        return reg.test(str) || str === '';
    }



    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#eeeeee', overflow: 'hidden'}}>
                <KeyboardAwaireView style={{flex: 1, backgroundColor: '#eeeeee', overflow: 'hidden'}}>
                    <ScrollView ref='scrollView' style={{flex: 1}}>
                        <View style={{flexDirection: 'row', height: 116, marginTop: 10, padding: 10, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{flex: 0.7}}>
                                <Text style={{color: '#323232', fontSize: 14, marginBottom: 6}}>组合名称:</Text>
                                <TextInput
                                    ref='teamName'
                                    style={styles.contactTxtInput}
                                    placeholder='请填写组合名称'
                                    maxLength={15}
                                    value={this.state.teamName}
                                    placeholderTextColor='rgba(150, 150, 150, 1)'
                                    onFocus={this.inputFocused.bind(this, 'teamName')}
                                    onChangeText={(teamName) => {
                                        if(this.isRegularString(teamName)) {
                                                    this.setState({teamName})
                                                } else {
                                                    this.toast.show('不能输入特殊字符', 130)
                                                }
                                    }}
                                >
                                </TextInput>
                                <View style={styles.line}></View>
                            </View>
                            {this.renderTeamLog()}
                        </View>
                        <View style={{marginTop: 10, padding: 12, backgroundColor: 'white',}}>
                            <View style={{flexDirection:'row', alignItems: 'center', marginRight: 6,}}>
                                <Image
                                    style={{width: 25, height: 25}}
                                    source={{uri: 'kouhao'}} />
                                <View style={{flex: 1, marginLeft: 10}}>
                                    <TextInput
                                        ref='teamKouhao'
                                        style={styles.contactTxtInput}
                                        placeholder='请填写组合口号'
                                        maxLength={30}
                                        placeholderTextColor='rgba(150, 150, 150, 1)'
                                        value={this.state.teamKouhao}
                                        onFocus={this.inputFocused.bind(this, 'teamKouhao')}
                                        onChangeText={(teamKouhao) => {
                                            var reg = /^([a-z]|[A-Z]|[\u4e00-\u9fa5]|\s|\d|`|~|!|@|#|$|^|&|=|'|:|;|'|,|\.|\?|@|#|￥|…|&|；|：|”|“|'|。|，|、|)+$/;
                                            if(reg.test(teamKouhao) || teamKouhao=='') {
                                                this.setState({teamKouhao})
                                            } else {
                                                this.toast.show('不能输入特殊字符', 130)
                                            }
                                        }}
                                    />
                                    <View style={styles.line}></View>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', alignItems: 'center', marginRight: 6,}}>
                                <Image
                                    style={{width: 25, height: 25}}
                                    source={{uri: 'diqu'}} />
                                <TouchableOpacity style={{flex: 1, marginLeft: 10}} onPress={() =>{this.picker.show(this.data.aIdx, this.data.pName)}}>
                                    <TextInput
                                        ref='contactText'
                                        editable={false}
                                        style={styles.contactTxtInput}
                                        value={this.state.areaStr}
                                        placeholder='所在地'
                                        placeholderTextColor='rgba(150, 150, 150, 1)'
                                    />
                                    <View style={styles.line}></View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    <Toast ref={(toast) => {this.toast = toast}}></Toast>
                </KeyboardAwaireView>
                <AeraPicker ref={(picker) => {this.picker = picker}} onConfirm={this.confirmSelection.bind(this)} />
            </View>

        )
    }
}

class AeraPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bottomAni: new Animated.Value(-240),
            aIdx: 0,
            pName: '北京市'
        }
    }

    componentDidMount() {
        NativeCommonSDK.readFile({
            path: 'area.plist',
            directory: 'main_bundle'
        },(error, data) => {
            var tmp = {};
            if(data) {
                for(var o in data) {
                    var obj = data[o]
                    var key = Object.keys(obj)[0];
                    var tmp1 = [];
                    for(var i in obj[key]) {
                        var obji = obj[key][i];
                        var keyi = Object.keys(obji)[0];
                        tmp1.push(keyi);
                    }

                    tmp[key] = tmp1;
                }
            }

            this.setState({
                data: tmp,
                aIdx: 0,
                pName: '北京市'
            })
        })

    }

    show(idx, pname) {
        this.setState({
            aIdx: idx,
            pName: pname,
        })
        Animated.timing(
            this.state.bottomAni,
            {
                toValue: 0,
                delay: 0,
                duration: 300,
            }
        ).start();
    }

    hide() {
        Animated.timing(
            this.state.bottomAni,
            {
                toValue: -240,
                delay: 0,
                duration: 300,
            }
        ).start();
    }

    render() {
        var PickerItemIOS = PickerIOS.Item;
        if(!this.state.data) {
            return false;
        }
        return (
            <Animated.View style={{position: 'absolute', right: 0, left: 0, bottom: this.state.bottomAni}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 40, backgroundColor: 'rgba(250, 250, 250, 1)'}}>
                    <TouchableOpacity onPress={() => {this.hide()}}>
                        <Text style={styles.button}>取消</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1}}></View>
                    <TouchableOpacity onPress={() => {
                        this.hide();
                        var selectionString = this.state.pName + ' ' + this.state.data[this.state.pName][this.state.aIdx];
                        this.props.onConfirm && this.props.onConfirm(selectionString, this.state.aIdx, this.state.pName);
                    }}>
                        <Text style={styles.button}>确定</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', height: 200, backgroundColor: 'white'}}>
                    <PickerIOS
                        style={{flex: 0.5}}
                        itemStyle={{fontSize: 25, fontWeight: 'bold'}}
                        selectedValue={this.state.pName}
                        onValueChange={(val) => this.setState({pName: val, aIdx: 0})}>
                        {
                            Object.keys(this.state.data).map((d) => (
                                <PickerItemIOS
                                    key={d}
                                    value={d}
                                    label={d}
                                />
                            ))
                        }
                    </PickerIOS>
                    <PickerIOS
                        style={{flex: 0.5}}
                        selectedValue={this.state.aIdx}
                        key={this.state.pName}
                        onValueChange={(val) => this.setState({aIdx: val})}>
                        {
                            this.state.data[this.state.pName].map((val, idx) => (
                                <PickerItemIOS
                                    key={val}
                                    value={idx}
                                    label={val}
                                />
                            ))
                        }
                    </PickerIOS>
                </View>
            </Animated.View>
        );
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

    button: {
        color: 'rgba(50, 50, 50, 1)',
        width: 60,
        height: 20,
        fontSize: 16,
        textAlign: 'center'
    }
});

module.exports = BasicInfo;



