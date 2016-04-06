
/*
 *全局遮罩层
 */

'use strict'

var React = require('react-native');

var {
    StyleSheet,
    View,
    Text,
    Animated,
    } = React;
var Dimensions = require('Dimensions')
const window = Dimensions.get('window');

class Toast extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showing: false,
            opacity: new Animated.Value(.5),
            txt: '',
            width: 90,
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        if(this.toastTimer) {
            clearTimeout(this.toastTimer);
        }
    }

    show(txt, width) {
        var _state = {
            showing: true,
            txt: txt,
            width: width || 90
        }

        if(this.animationFn && this.animationFn.stop) {
            this.animationFn.stop();
        }

        this.setState(_state);

        this.state.opacity.setValue(.5);
        this.animationFn = Animated.timing(
            this.state.opacity,
            {
                toValue: 0,
                delay: 1000,
                duration: 300
            }
        );

        this.animationFn.start((finish) => {
            if(finish) {
                this.setState({
                    showing: false
                });
            }
        });
    }

    render() {
        if(!this.state.showing) {
            return false;
        }

        return (
            <Animated.View style={[styles.toast, {opacity: this.state.opacity, width: this.state.width, left: window.width/2 - this.state.width/2}]}>
                <Text style={{color: 'white', fontSize: 15}}>{this.state.txt}</Text>
            </Animated.View>
        )
    }
}

var styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        backgroundColor: 'black',
        opacity: .5,
        bottom: 50,
        width: 90,
        height: 50,
        left: window.width/2 - 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
});



module.exports = Toast;


