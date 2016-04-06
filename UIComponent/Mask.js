/*
 *全局遮罩层
 */

'use strict'

var React = require('react-native');

var {
    StyleSheet,
    Animated,
    PanResponder,
    } = React;

class Mask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    _hideMask() {
        this.props.onHideMask();
    }

    render() {
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
            },
            onPanResponderMove: (evt, gestureState) => {
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                if(this.props.hasOwnProperty('onHideMask')) {
                    this.props.onHideMask();
                }
            },
            onPanResponderTerminate: (evt, gestureState) => {
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                return true;
            },
        });

        console.log('render mask...');

        return (
            <Animated.View {...this._panResponder.panHandlers} style={[styles.mask, {opacity: this.props.opacity}]}>
            </Animated.View>
        )
    }
}

var styles = StyleSheet.create({
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        opacity: 0.2,
    },
});



module.exports = Mask;



