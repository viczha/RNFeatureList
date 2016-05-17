'use strict'

var React = require('react-native');

var {
    Component,
    StyleSheet,
    TextInput,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Navigator,
    ScrollView,
    Image
    } = React;

var KeyboardAwareView = require('../UIComponent/KeyboradAwareView/index');

class InputKeyboard extends Component {
    constructor(props) {
        super(props);

        this.scrollHeight = 0;
        this.scrollPadding = 0;
        this.scrollOffset = 0;
    }

    //componentDidMount() {
    //    this.scroll.refs.ScrollView.measure((sox, soy, sWidth, sHeight, spx, spy) => {
    //        this.scrollHeight = sHeight;
    //        this.scrollPadding = soy;
    //    })
    //}

    inputFocused(ref) {
        setTimeout(() => {
            this.scroll.refs.ScrollView.measure((sox, soy, sWidth, sHeight, spx, spy) => {
                this.scrollHeight = sHeight;
                this.scrollPadding = soy;

                this.refs[ref].measure((ox, oy, width, height, px, py) => {
                    console.log(ox, oy, width, height, px, py);
                    console.log('scrollHeight:' + this.scrollHeight);
                    console.log('scrollOffset:' + this.scrollOffset);
                    console.log('scrollPadding:' + this.scrollPadding);
                    var y =  oy + height;
                    //if(y - this.scrollOffset > this.scrollHeight) {
                    //    this.scroll.scrollTo({x: 0, y: (y - this.scrollHeight)})
                    //}
                    if(y - this.scrollHeight > 0) {
                        this.scroll.scrollTo({x: 0, y: (y - this.scrollHeight)})
                    }
                });
            })
        }, 400);



    }

    handleScroll(e) {
        this.scrollOffset = e.nativeEvent.contentOffset.y
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <KeyboardAwareView animated={true}>
                    <View style={{flex: 1}}>
                        <ScrollView
                            ref={(scroll) => {this.scroll = scroll}}
                            onScroll={this.handleScroll.bind(this)}
                            style={{flex: 1}}>
                            <TextInput
                                ref="txt1"
                                onFocus={this.inputFocused.bind(this, 'txt1')}
                                style={styles.contactTxtInput}
                                placeholder='QQ/手机号/E-mail'
                                placeholderTextColor='rgba(150, 150, 150, 1)'
                            />
                            <TextInput
                                ref="txt2"
                                onFocus={this.inputFocused.bind(this, 'txt2')}
                                style={styles.contactTxtInput}
                                placeholder='QQ/手机号/E-mail'
                                placeholderTextColor='rgba(150, 150, 150, 1)'
                            />
                            <TextInput
                                ref="txt3"
                                onFocus={this.inputFocused.bind(this, 'txt3')}
                                style={styles.contactTxtInput}
                                placeholder='QQ/手机号/E-mail'
                                placeholderTextColor='rgba(150, 150, 150, 1)'
                            />
                            <TextInput
                                ref="txt4"
                                onFocus={this.inputFocused.bind(this, 'txt4')}
                                style={styles.contactTxtInput}
                                placeholder='QQ/手机号/E-mail'
                                placeholderTextColor='rgba(150, 150, 150, 1)'
                            />
                            <TextInput
                                ref="txt5"
                                onFocus={this.inputFocused.bind(this, 'txt5')}
                                style={styles.contactTxtInput}
                                placeholder='QQ/手机号/E-mail'
                                placeholderTextColor='rgba(150, 150, 150, 1)'
                            />
                            <TextInput
                                ref="txt6"
                                onFocus={this.inputFocused.bind(this, 'txt6')}
                                style={styles.contactTxtInput}
                                placeholder='QQ/手机号/E-mail'
                                placeholderTextColor='rgba(150, 150, 150, 1)'
                            />
                            <TextInput
                                ref="txt7"
                                onFocus={this.inputFocused.bind(this, 'txt7')}
                                style={styles.contactTxtInput}
                                placeholder='QQ/手机号/E-mail'
                                placeholderTextColor='rgba(150, 150, 150, 1)'
                            />
                            <TextInput
                                ref="txt8"
                                onFocus={this.inputFocused.bind(this, 'txt8')}
                                style={styles.contactTxtInput}
                                placeholder='QQ/手机号/E-mail'
                                placeholderTextColor='rgba(150, 150, 150, 1)'
                            />
                            <TextInput
                                ref="txt9"
                                onFocus={this.inputFocused.bind(this, 'txt9')}
                                style={styles.contactTxtInput}
                                placeholder='QQ/手机号/E-mail'
                                placeholderTextColor='rgba(150, 150, 150, 1)'
                            />
                            <TextInput
                                ref="txt10"
                                onFocus={this.inputFocused.bind(this, 'txt10')}
                                style={styles.contactTxtInput}
                                placeholder='QQ/手机号/E-mail'
                                placeholderTextColor='rgba(150, 150, 150, 1)'
                            />
                            <TextInput
                                ref="txt11"
                                onFocus={this.inputFocused.bind(this, 'txt11')}
                                style={styles.contactTxtInput}
                                placeholder='QQ/手机号/E-mail'
                                placeholderTextColor='rgba(150, 150, 150, 1)'
                            />
                            <TextInput
                                ref="txt12"
                                onFocus={this.inputFocused.bind(this, 'txt12')}
                                style={styles.contactTxtInput}
                                placeholder='QQ/手机号/E-mail'
                                placeholderTextColor='rgba(150, 150, 150, 1)'
                            />
                        </ScrollView>
                    </View>
                </KeyboardAwareView>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    contactTxtInput: {
        borderColor: 'rgba(200, 200, 200, 1)',
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        height: 50,
        fontSize: 13,
        margin: 12,
    },
})

module.exports = InputKeyboard;

//import React, {
//    Component,
//    View,
//    TextInput,
//    StyleSheet,
//    Text,
//    TouchableOpacity
//} from 'react-native';
//
//import dismissKeyboard from 'dismissKeyboard';
//
//import SmartScrollView from 'react-native-smart-scroll-view';
//
//class Example extends Component {
//
//    constructor() {
//        super();
//        this.state = {}
//    }
//
//    render () {
//        return (
//            <View style={styles.container}>
//                <SmartScrollView
//                    contentContainerStyle = { styles.contentContainerStyle }
//                    scrollPadding         = { 10 }
//                >
//                        <TextInput
//                            smartScrollOptions = {{
//                                type:       'text'
//                              }}
//                            style              = {styles.textInput}
//                            autoCorrect        = {false}
//                        />
//                    <TextInput
//                        smartScrollOptions = {{
//                                type:       'text'
//                              }}
//                        style              = {styles.textInput}
//                        autoCorrect        = {false}
//                    />
//                    <TextInput
//                        smartScrollOptions = {{
//                                type:       'text'
//                              }}
//                        style              = {styles.textInput}
//                        autoCorrect        = {false}
//                    />
//                    <TextInput
//                        smartScrollOptions = {{
//                                type:       'text'
//                              }}
//                        style              = {styles.textInput}
//                        autoCorrect        = {false}
//                    />
//                    <TextInput
//                        smartScrollOptions = {{
//                                type:       'text'
//                              }}
//                        style              = {styles.textInput}
//                        autoCorrect        = {false}
//                    />
//                    <TextInput
//                        smartScrollOptions = {{
//                                type:       'text'
//                              }}
//                        style              = {styles.textInput}
//                        autoCorrect        = {false}
//                    />
//                    <TextInput
//                        smartScrollOptions = {{
//                                type:       'text'
//                              }}
//                        style              = {styles.textInput}
//                        autoCorrect        = {false}
//                    />
//                    <TextInput
//                        smartScrollOptions = {{
//                                type:       'text'
//                              }}
//                        style              = {styles.textInput}
//                        autoCorrect        = {false}
//                    />
//                    <TextInput
//                        smartScrollOptions = {{
//                                type:       'text'
//                              }}
//                        style              = {styles.textInput}
//                        autoCorrect        = {false}
//                    />
//                </SmartScrollView>
//            </View>
//        )
//    }
//}
//
//const styles = StyleSheet.create({
//    container: {
//        flex:1,
//    },
//    header: {
//        height: 60,
//        backgroundColor: '#4682B4',
//        alignItems:      'center',
//        justifyContent:  'center'
//    },
//    headerText: {
//        fontSize:  30,
//        color:     '#FFFFFF',
//    },
//    contentContainerStyle: {
//        flex: 1,
//        backgroundColor:   '#F0F8FF',
//        paddingHorizontal: 15
//    },
//    button: {
//        backgroundColor: '#1E90FF',
//        height:            40,
//        alignItems:        'center',
//        justifyContent:    'center',
//        paddingHorizontal: 20,
//        borderRadius:      10
//    },
//    buttonText: {
//        fontSize:  15,
//        color:     '#FFFFFF',
//        textAlign: 'center'
//    },
//    inputContainer: {
//        flexDirection:  'row',
//        justifyContent: 'space-between',
//        alignItems:     'center'
//    },
//    fieldName: {
//        fontSize: 10,
//        color:    '#42647F'
//    },
//    textInput: {
//        height:          30,
//        width:           220,
//        paddingLeft:     10,
//        borderWidth:     1,
//        borderRadius:    5,
//        backgroundColor: 'white',
//        fontSize:        12,
//        marginTop: 100,
//    },
//    footer: {
//        height: 40,
//        backgroundColor: '#42647F'
//    }
//});

//module.exports = Example;