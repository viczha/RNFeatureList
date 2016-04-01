/*
 *下拉刷新scrollview
 *TODO: 优化
 */

'use strict'

var React = require('react-native');

var {
    StyleSheet,
    View,
    Text,
    ScrollView,
    PanResponder,
    Image
    } = React;

const _default = 0;
const _pulldown = 1;
const _pulldownOver = 2;

const _distance = 70;

const radius = 10;

class RefreshableScrollView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tracking: false,
            refreshing: false,
            scrollStatus: _default,
            contentInset: -20,
            progress: 0,
        }

        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

            onPanResponderGrant: (evt, gestureState) => {
                if(!this.state.refreshing) {
                    this.setState({
                        tracking: true,
                    })
                    console.log('grant...')
                }

            },
            onPanResponderMove: (evt, gestureState) => {
                //console.log('move...')
            },
            onPanResponderRelease: (evt, gestureState) => {
                if(!this.state.refreshing) {
                    var _state = {
                        refreshing: false,
                        tracking: false,
                        scrollStatus: _default,
                        progress: 0,
                        contentInset: -20,
                    }
                    if(this.state.scrollStatus === _pulldownOver && this.props.hasOwnProperty('_onRefreshStart')) {
                        _state.refreshing = true;
                        _state.contentInset = 0;
                        this.props._onRefreshStart(this.refreshFinish.bind(this));

                    }
                    this.setState(_state);
                    console.log('release...' + this.state.refreshing);
                }

            },
        });
    }

    componentDidMount() {
        // setTimeout(() => {
        //   console.log('set native scroll props....');
        //   this.refs.scroll.setNativeProps({contentOffset : {top: 100}})
        // }, 2000)
    }

    componentWillUnmount() {

    }

    shouldComponentUpdate(nextProps, nextState) {
        //return !deepEqual(this.state, nextState);
        return this.state.tracking !== nextState.tracking
            || this.state.refreshing !== nextState.refreshing
            || this.state.scrollStatus !== nextState.scrollStatus
            || this.state.progress !== nextState.progress
            || this.state.contentInset !== nextState.contentInset;
    }

    handlerScroll(event) {
        let { contentInset, contentOffset } = event.nativeEvent;


        if(this.state.tracking && !this.state.refreshing) {
            if((contentOffset.y-20) < -_distance) {
                this.setState({
                    scrollStatus: _pulldownOver,
                    progress: Math.min(-(contentOffset.y-20)/_distance, 1),
                })
            } else if((contentOffset.y-20) < 0) {
                this.setState({
                    scrollStatus: _pulldown,
                    progress: Math.min(-(contentOffset.y-20)/_distance, 1),
                })
            }


            console.log('scroll x: ' + contentOffset.x)
            console.log('scroll y: ' + contentOffset.y)
            console.log('progress: ' + this.state.progress);
        }


    }

    renderScrollContent() {
        if(this.props.hasOwnProperty('renderScrollContent')) {
            return this.props.renderScrollContent();
        } else {
            return false;
        }
    }

    renderIndicator() {
        if(this.state.refreshing === true) {
            //return false;
            return (<View style={[styles.scrollViewIndicatorContainer]}>
                    <Text>pull down to refresh</Text>
                </View>
            )
        } else if(this.state.scrollStatus === _default) {
            //return false;
            return (<View style={[styles.scrollViewIndicatorContainer]}>
                    <Text>pull down to refresh</Text>
                </View>
            )
        } else if(this.state.scrollStatus === _pulldown) {
            return (<View style={[styles.scrollViewIndicatorContainer]}>
                    <Text>pull down to refresh</Text>
                </View>
            )
        } else if(this.state.scrollStatus === _pulldownOver) {
            return (<View style={[styles.scrollViewIndicatorContainer]}>
                    <Text>release to refresh</Text>
                </View>
            )
        }
    }

    renderRefreshIndicator() {
        if(this.state.refreshing === true) {
            return ( <View
                    style={{justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(250,250,250,1)'}}>
                    <Image style={{width: 25, height: 53, backgroundColor: 'transparent'}}
                           source={require('../Src/Images/loading-football.gif')}/>
                </View>
            )
        } else {
            return false;
        }
    }


    refreshFinish() {
        console.log('finish refresh');
        this.setState({
            refreshing: false,
            contentInset: -20,
        });
    }

    render() {
        console.log('scrollview render...')


        var strokeColor = this.state.progress === 1 ? 'green' : 'rgba(220,220,220,1)';
        //var inset = this.state.refreshing ? 0 : -20;
        console.log('inset = ' + this.state.contentInset);
        return (
            <View style={[styles.container]}>
                <ScrollView
                    ref='scroll'
                    {...this.props}
                    {...this._panResponder.panHandlers}
                    scrollEventThrottle={13}
                    contentInset={{top: -20}}
                    contentOffset={{y: 20}}
                    onScroll={this.handlerScroll.bind(this)}>
                    <View style={{backgroundColor: '#eeeeee'}}>
                        {this.renderIndicator()}
                        {this.renderRefreshIndicator()}
                        {this.renderScrollContent()}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },

    scrollViewBgContainer: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        alignItems: 'center',
    },

    scrollViewIndicatorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 20,
    },
});



module.exports = RefreshableScrollView;



