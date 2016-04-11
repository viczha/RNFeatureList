/*
 *下拉刷新scrollview
 */

'use strict'

var React = require('react-native');

var {
    StyleSheet,
    View,
    Text,
    ScrollView,
    PanResponder,
    Image,
    Animated,
    } = React;

const distance = 70;
const offsetHeight = 50;

class RefreshableScrollView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            innerTop: new Animated.Value(-offsetHeight),
            imageRotate: new Animated.Value(0),
            needPull: false,
            refreshing: false,
        }

        this.y = 0;
        this._panResponder = PanResponder.create({
            onPanResponderGrant: (evt, gestureState) => {
                this.grant = true;
            },
            onPanResponderRelease: (evt, gestureState) => {
                this.grant = false;
                this.state.imageRotate.setValue(0);
                if(this.state.needPull && !this.state.refreshing) {
                    this.setState({
                        refreshing: true
                    });
                    this.beginRefresh();
                }
            }
        });
    }

    handlerScroll(event) {
        let { contentInset, contentOffset } = event.nativeEvent;
        this.y = contentOffset.y;
        if(-this.y > distance && this.grant && this.state.needPull === false) {
            this.setState({needPull: true})
            this.rotateArrow(true);
        }

        if(-this.y < distance && this.grant && this.state.needPull === true) {
            this.setState({needPull: false})
            this.rotateArrow(false);
        }

        var val = -contentOffset.y - offsetHeight;
        if(this.state.needPull) {
            val = Math.max(val, 0);
        }
        this.state.innerTop.setValue(val)

    }

    rotateArrow(flag) {
        Animated.timing(
            this.state.imageRotate,
            {
                toValue: flag ? 1 : 0,
                duration: 100,
            }
        ).start(() => {
        });
    }

    beginRefresh() {

        //if(this.props.onBeginRefresh) {
        //    var _promise = new Promise()
        //}
        setTimeout(()=>{
            Animated.timing(
                this.state.innerTop,
                {
                    toValue: -offsetHeight,
                    duration: 300,
                }
            ).start(() => {
                this.setState({
                    refreshing: false,
                    needPull: false
                });
            });
        }, 3000)
    }

    renderIndicator() {
        var _rotate = this.state.imageRotate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
            extrapolate: 'clamp'
        });
        if(this.state.refreshing) {
            return (
            <View style={styles.scrollViewIndicatorContainer}>
                <Image style={{width: 25, height: 50, backgroundColor: 'transparent'}}
                       source={require('../Src/Images/loading-football.gif')}/>
            </View>
            )
        } else {
            return (
                <View style={styles.scrollViewIndicatorContainer}>
                    <Animated.View style={{ width: 25, height: 30, transform:[{rotate: _rotate}]}}>
                        <Image style={{width: 25, height: 30, backgroundColor: 'transparent'}}
                               source={require('../Src/Images/arrow@3x.png')}/>
                    </Animated.View>
                    <Text>{this.state.needPull ? 'release to refresh' : 'pull to refresh'}</Text>
                </View>
            )
        }

    }

    render() {
        console.log('scrollview render...');

        return (
            <View style={[styles.container]}>
                <ScrollView
                    ref='scroll'
                    {...this.props}
                    {...this._panResponder.panHandlers}
                    scrollEventThrottle={13}
                    onScroll={this.handlerScroll.bind(this)}>
                    <Animated.View
                        style={[styles.ScrollInner, {top: this.state.innerTop}]}
                    >
                        {this.renderIndicator()}
                        {this.props.children}
                    </Animated.View>
                </ScrollView>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },

    ScrollInner: {

        left: 0,
        right: 0,
    },

    scrollViewIndicatorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: offsetHeight,
    },
});



module.exports = RefreshableScrollView;



