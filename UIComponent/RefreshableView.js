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

const distance = 40;
const offsetHeight = 40;


class DefaultIndicator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageRotate: new Animated.Value(0)
        }
    }

    onPullOver() {
        this.rotateArrow(true);
    }

    onPullBack() {
        this.rotateArrow(false);
    }

    rotateArrow(flag) {
        Animated.timing(
            this.state.imageRotate,
            {
                toValue: flag ? 1 : 0,
                duration: 150,
            }
        ).start(() => {
        });
    }

    render() {
        var _rotate = this.state.imageRotate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
            extrapolate: 'clamp'
        });
        if(this.props.refreshing) {
            return (
                <View style={styles.scrollViewIndicatorContainer}>
                    <Image style={{width: 15, height: 30, backgroundColor: 'transparent'}}
                           source={require('../Src/Images/loading-football.gif')}/>
                    <Text style={styles.indicatorText}>玩命加载中...</Text>
                </View>
            )
        } else {
            return (
                <View style={styles.scrollViewIndicatorContainer}>
                    <Animated.View style={{ width: 20, height: 20, transform:[{rotate: _rotate}]}}>
                        <Image style={{width: 20, height: 20, backgroundColor: 'transparent'}}
                               source={require('../Src/Images/arrowdown@3x.png')}/>
                    </Animated.View>
                    <Text style={styles.indicatorText}>{this.props.needPull ? '松开即可刷新' : '下拉即可刷新'}</Text>
                </View>
            )
        }
    }
}

class RefreshableScrollView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            innerTop: new Animated.Value(-offsetHeight),
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
        let {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
        this.y = contentOffset.y;
        if(-this.y > distance && this.grant && this.state.needPull === false) {
            this.setState({needPull: true});
            if(this.indicator.onPullOver) {
                this.indicator.onPullOver();
            }
        }

        if(-this.y < distance && this.grant && this.state.needPull === true) {
            this.setState({needPull: false})
            if(this.indicator.onPullBack) {
                this.indicator.onPullBack();
            }
        }

        if(contentOffset.y < 0) {
            var val = -contentOffset.y - offsetHeight;
            if(this.state.refreshing) {
                val = Math.max(val, 0);
            }
            val = Math.max(val, -offsetHeight);
            val = Math.min(val, offsetHeight);
            this.state.innerTop.setValue(val)
        } else if(!this.state.refreshing) {
            var maxOffset = contentSize.height-layoutMeasurement.height;
            if(maxOffset != 0) {
                var val = contentOffset.y*offsetHeight/maxOffset - offsetHeight;
                val = Math.min(val, 0);
                val = Math.max(val, -offsetHeight);
                this.state.innerTop.setValue(val)
            }
        }
    }

    refreshEnd() {
        Animated.timing(
            this.state.innerTop,
            {
                toValue: -offsetHeight,
                duration: 180,
            }
        ).start(() => {
            this.setState({
                refreshing: false,
                needPull: false
            });
        });
    }

    beginRefresh() {
        if(this.props.onBeginRefresh) {
            var _promise = new Promise((resolve) => {
                this.props.onBeginRefresh(resolve);
            })

            Promise.all([
                    _promise,
                    new Promise((resolve) => setTimeout(resolve, 1000)),
                ])
                .then(() => {
                    this.refreshEnd();
                })
        }
    }

    render() {
        console.log('scrollview render...');
        var inProps = {
            refreshing: this.state.refreshing,
            needPull: this.state.needPull
        }
        return (
            <ScrollView
                ref='scroll'
                {...this.props}
                {...this._panResponder.panHandlers}
                scrollEventThrottle={13}
                onScroll={this.handlerScroll.bind(this)}>
                <Animated.View
                    style={[styles.ScrollInner, {top: this.state.innerTop}]}
                >
                    <DefaultIndicator
                        ref={(indicator) => {this.indicator = indicator}}
                        {...inProps}></DefaultIndicator>
                    {this.props.children}
                </Animated.View>
            </ScrollView>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    ScrollInner: {
        left: 0,
        right: 0,
    },

    scrollViewIndicatorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: offsetHeight,
    },

    indicatorText: {
        fontSize: 10,
        color: '#969696',
        marginLeft: 5,
    }
});



module.exports = RefreshableScrollView;




