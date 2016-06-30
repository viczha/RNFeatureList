'use strict'

var React = require('react-native');

var {
    Text,
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image
    } = React;

var KeyboardAwaireView = require('../UIToolkit/KeyboardAwaireView');
var NativeCommonSDK = require('react-native').NativeModules.PCReactSDK;

class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.postNativeNotification('MFEnrolledNotification')
    }

    gotoUploadVideo() {
        var pageurl = 'app://iph.pptv.com/v4/activity/ugc';
        NativeCommonSDK.openNativePage({pageUrl: pageurl}, (error, events) => {
            if (error) {
            } else {
            }
        });
    }

    postNativeNotification(name) {
        NativeCommonSDK.postNotiveNotification({name: name}, (error, data) =>{});
    }

    render() {

        return (
            <KeyboardAwaireView style={{flex: 1, backgroundColor: '#eeeeee'}}>
                <ScrollView ref='scrollView' style={{flex: 1}}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

                        <Image
                            style={{width: 110, height: 123, marginTop: 32, marginBottom: 38}}
                            source={{uri: 'baomingzhenggong'}} />

                        <View style={{marginLeft: 20, marginRight: 20}}>
                            <Text style={{fontSize: 12, color: '#969696'}}>您已成功参加P聚力举办的"大学生音乐节"歌唱比赛,您填写的报名信息我们需要进行审核,请您耐心等待</Text>
                        </View>

                        <TouchableOpacity style={{borderWidth: 1, borderRadius: 4,borderColor: '#EE1987', backgroundColor: '#EE1987', width: 200, height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 59, marginBottom: 20}}
                            onPress={() => this.gotoUploadVideo()}
                        >
                            <Text style={{color: 'white', fontSize: 16}}>上传视频</Text>
                            <Text style={{color: 'white', fontSize:10, marginTop: 5}}>请选择2-5分钟的视频</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.postNativeNotification('MFBackActionNotification')}
                            style={{borderWidth: 1, borderRadius: 4,borderColor: '#EE1987', width: 200, height: 44, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: '#EE1987'}}>返回活动首页</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAwaireView>
        )
    }
}

const styles = StyleSheet.create({
    contactTxtInput: {
        borderColor: 'rgba(200, 200, 200, 1)',
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 13,
        padding: 8,
        height: 38,
    },
});

module.exports = BasicInfo;




