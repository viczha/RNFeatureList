/*
 *直播详情页
 */
var React = require('react-native');
var Dimensions = require('Dimensions');
var CptHistory = require('../UIComponent/CptHistory');
var CptHistoryDetail = require('../UIComponent/CptHistoryDetail');
var LeagueInfo = require('../UIComponent/LeagueInfo');
var LeagueDetailInfo = require('../UIComponent/LeagueDetailInfo');
var CountDown = require('../UIComponent/CountDown');
var CptBasic = require('../UIComponent/CptBasic');
var Mask = require('../UIComponent/Mask');
var SelCommentator = require('../UIComponent/SelCommentator');
var CompetitionQuery = 'http://sports.mobile.pptv.com/competitionschedule/v1/detail?competitionscheduleid=';
var deepEqual = require('../Utils/deepEqual');
var Toast = require('../UIComponent/Toast');
var ErrorTip = require('../UIComponent/ErrorTip');
var CptLike = require('../UIComponent/CptLike');
var JSUtils = {
    isEmptyObject: function(obj) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        if (obj == null) return true;

        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    }
};

var {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Animated,
    RefreshControl,
    Image,
    NetInfo,
    } = React;

const window = Dimensions.get('window');
const loadStatus = {
    init: 0,
    loaded: 1,
    failed: 2,
}

class CptInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loadStatus: loadStatus.init, //0,1,2,3,4
            isRefreshing: false,
            userChecked: false,
            topicLoaded: false,
            hasOverLayer: false,
            hasCommentatorSel: false, //是否显示选择解说
            commentatorAniFacotr: new Animated.Value(0),
            currentCommentatorIdx: 0,//当前解说 index
            //containerHeight: window.height,
            historyDetailAniTop: new Animated.Value(window.height - window.width * 9 / 16),
            leagueDetailAni: new Animated.Value(window.height - window.width * 9 / 16),
            layerType: '',
            cptType: 1, //比赛类型 1 足球， 2 篮球
            isLogin: false,
            userName: '0',
            status: this.props.status,
            likeOption: { //点赞信息
                total: 0,
                guestOpt: {},
                hostOpt: {},
            },
            connectionInfo: 'wifi',
            hasVideos: false,
            hasCommentators: false
        }

        NetInfo.fetch().done(
            (connectionInfo) => {
                if (connectionInfo === 'none') {
                    this.setState({connectionInfo});
                }
            }
        );

        this._props = {//保存数据，便于读取
            servertime: -1,
            guestId: 0,
            guestName: '',
            guestIcon: '',
            hostId: 0,
            hostName: '',
            hostIcon: '',
            isversus: true, //是否为对战类型
            containerHeight: window.height - window.width * 9 / 16,
        }

        this.loaded = false;
        this.curPlayingVid = {lindId: ''};
    }

    componentWillMount() {
        //this._fetchData();
    }

    _componentDidFocus() {
        this._fetchData();
    }


    componentWillUnmount() {
        if (this.statusTimerID) {
            clearTimeout(this.statusTimerID);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !deepEqual(this.props, nextProps) || !deepEqual(this.state, nextState);
    }

    componentDidMount() {

    }

    _fetchData() {
        var queryUrl = CompetitionQuery + 111;
        fetch(queryUrl, {
            method: 'GET',
            timeout: 15 * 1000
        }).then(response => response.json())
            .then(json => this._handlerResponse(json))
            .catch(error => this._onFetchError(error));
    }

    _showHistoryDetailLayer(type) {
        if (this.state.hasOverLayer === true) {//避免多次点击
            return;
        }
        this.needHisDetail = true;
        this.setState({layerType: type, hasOverLayer: true});
        Animated.timing(
            this.state.historyDetailAniTop,
            {
                toValue: 0,
                delay: 0,
                duration: 300,
            }
        ).start();
    }

    _hideHistoryDetailLayer() {
        if (this.state.hasOverLayer === false) {//避免多次点击
            return;
        }
        this.setState({hasOverLayer: false});
        Animated.timing(
            this.state.historyDetailAniTop,
            {
                toValue: this._props.containerHeight,
                delay: 0,
                duration: 300,
            }
        ).start();
    }

    _showCommentator() {
        if (!this.state.hasCommentatorSel) {//避免多次点击
            this.setState({hasCommentatorSel: true});
            Animated.timing(
                this.state.commentatorAniFacotr,
                {
                    toValue: 1,
                    delay: 0,
                    duration: 300,
                }
            ).start();
        }
    }

    _hideCommentator() {
        if (this.state.hasCommentatorSel) {
            this.state.commentatorAniFacotr.setValue(1);
            Animated.timing(
                this.state.commentatorAniFacotr,
                {
                    toValue: 0,
                    delay: 0,
                    duration: 300,
                }
            ).start(() => {
                this.setState({hasCommentatorSel: false,});
            });
        }
    }

    _changeCommentator(idx) {
        if (this.state.currentCommentatorIdx !== idx) {
            var c = this.state.cptBasicInfo[0].commentators[idx];
            this.setState({
                currentCommentatorIdx: idx,
            })
        }

    }

    _getCptTitle(basicInfo) {
        var title = basicInfo.title || '';
        var cptName = basicInfo.competitionname || '';
        var round = basicInfo.round || '';
        var hostname = basicInfo.hostname || '';
        var guestname = basicInfo.guestname || '';

        if (basicInfo.title) {
            return basicInfo.title;
        } else {
            return basicInfo.schedulemark + ' ' + hostname + 'VS' + guestname;
        }
    }

    _handlerResponse(json) {
        if (json.code === 200) {
            var modules = json.modules;
            var _state = {
                isRefreshing: false,
                connectionInfo: 'wifi',
            };
            if (this.state.loadStatus === loadStatus.init || this.state.loadStatus === loadStatus.failed) {
                _state.loadStatus = loadStatus.loaded;
            }
            var moduleKeys = {
                't_competition_schedule_1': 'cptBasicInfo', //比赛基本信息
                't_competition_score_1': 'teamOrderInfo', //球队排名  t_competition_score_1
                't_competition_history_1': 'teamCompetHistory', //历史对战信息
                't_competition_schedule_goal_1': 'footballLiveData', //足球比赛实录数据
                't_competition_schedule_team_prediction_1': 'footballPlayerInfo',//足球首发球员信息
                't_competition_schedule_palyer_statistics_1': 'footballPlayerData',//足球球员数据统计
                't_competition_schedule_team_basketballscore_1': 'basketballTeamData',//篮球球队比分数据
                't_competition_schedule_player_statistics_1': 'basketballPlayerData',//篮球球员数据
                't_competition_schedule_team_statistics_1': 'footballTeamData',   //足球球队技术统计
            };

            for (var i = 0; i < modules.length; i++) {
                if (moduleKeys.hasOwnProperty(modules[i]['tid'])) {
                    _state[moduleKeys[modules[i]['tid']]] = modules[i].data.dlist;
                }
            }

            if (_state.hasOwnProperty('cptBasicInfo')) {//抓取比赛状态，类型等基本信息
                this._props.cptType = _state.cptBasicInfo[0].type;
                this._props.hostId = _state.cptBasicInfo[0].hostid;
                this._props.hostName = _state.cptBasicInfo[0].hostname;
                this._props.hostIcon = _state.cptBasicInfo[0].hosticon;
                this._props.guestId = _state.cptBasicInfo[0].guestid;
                this._props.guestName = _state.cptBasicInfo[0].guestname;
                this._props.guestIcon = _state.cptBasicInfo[0].guesticon;
                this._props.isversus = _state.cptBasicInfo[0].isversus;
                this._props.hasalarm = _state.cptBasicInfo[0].hasalarm;
                this._props.servertime = json.servertime;
                this._props.remainTime = _state.cptBasicInfo[0].starttime - json.servertime;
                if (this._props.isversus == true) {
                    _state.likeOption = {
                        total: 0,
                        guestOpt: {},
                        hostOpt: {},
                    };
                    if (_state.cptBasicInfo[0].hasOwnProperty('option')) {
                        _state.cptBasicInfo[0].option.options.forEach(function (item, i) {
                            if (item.option == this._props.guestId) {
                                _state.likeOption.guestOpt = item;
                            } else if (item.option == this._props.hostId) {
                                _state.likeOption.hostOpt = item;
                            }
                            _state.likeOption.total += item.result;
                        }.bind(this));
                    } else {
                        _state.likeOption = null;
                    }

                }
                if (json.servertime < _state.cptBasicInfo[0].starttime) {//比赛状态判断
                    _state.status = 0;
                } else if (json.servertime >= _state.cptBasicInfo[0].starttime && json.servertime <= _state.cptBasicInfo[0].endtime) {
                    _state.status = 1;
                } else {
                    _state.status = 2;
                }

                if (!this.loaded && _state.status === 1) {
                    this.loaded = true;
                }

                _state.hasVideos = !JSUtils.isEmptyObject(_state.cptBasicInfo[0].videos);
                _state.hasCommentators = !JSUtils.isEmptyObject(_state.cptBasicInfo[0].commentators);
                if (((_state.hasVideos && _state.status === 2) || (_state.hasCommentators && _state.status ===1 ))
                    && !this.state.isRefreshing) {//直播中或者已结束但有花絮
                    var title = this._getCptTitle(_state.cptBasicInfo[0]);
                    if (_state.status === 1 && _state.cptBasicInfo[0].reservetitle) {
                        title = _state.cptBasicInfo[0].reservetitle;
                    }
                }
                this.setState(_state);
                this.initOverLayer();
            } else {
                this._onFetchError();
            }

        } else {
            this._onFetchError();
        }
    }

    initOverLayer() {
        setTimeout(() => {
            this.setState({
                needHisDetail: true,
                needLeagueDetail: true,
            })
        }, 0);

    }

    _onFetchError(error) {
        if (this.state.loadStatus === loadStatus.init) {
            this.setState({
                loadStatus: loadStatus.failed,
                isRefreshing: false,
            })
        }
        if (this.state.isRefreshing === true) {
            this.setState({
                isRefreshing: false,
            })
            this.refs.toast.show('刷新失败')
        }
    }

    showLoading() {
        return (
            <View
                style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(250,250,250,1)'}}>
                <Image style={{width: 25, height: 53, backgroundColor: 'transparent',marginBottom: 4}}
                       source={require('../Src/Images/loading-football.gif')}/>
                <Text style={{fontSize: 10, color: '#969696'}}>正在努力加载ing...</Text>
            </View>
        );
    }


    //比赛开始前头部信息
    renderCptPreInfo() {
        if (this.state.loadStatus !== loadStatus.loaded  || this.state.connectionInfo === 'none') {
            var h = window.width * 9 / 16;
            return (<View style={styles.videoContainer}>
                <Image style={styles.videoBgImg} source={require('../Src/Images/spot_video_bg@2x.jpg')}/>
            </View>);
        }
        if (this.state.status === 0) {
            //this._props.remainTime = 5*1000;
            return (
                <View style={styles.videoContainer}>
                    <Image style={styles.videoBgImg} source={require('../Src/Images/spot_video_bg@2x.jpg')}/>
                    <View style={styles.preInfoCon}>
                        {this.renderCptLike(0)}
                    </View>
                    <CountDown {...this.state.cptBasicInfo[0]} onCountdownFinish={this.countDownFinish.bind(this)}
                                                               style={styles.preInfoCountDown}
                                                               remainTime={this._props.remainTime}></CountDown>
                </View>
            )
        } else if (this.state.status === 2 || (this.state.status === 1 && !this.state.hasCommentators)) {
            return (
                <View style={styles.videoContainer}>
                    <Image style={styles.videoBgImg} source={require('../Src/Images/spot_video_bg@2x.jpg')}/>
                    <View style={styles.preInfoCon}>
                        {this.renderCptLike(0, true)}
                    </View>
                    <View
                        style={{alignItems: 'center', backgroundColor: 'transparent', marginTop: 10*window.width/375}}>
                        <View
                            style={{width: 74*window.width/375, height: 26.5*window.width/375, backgroundColor: 'rgba(7, 7, 7, 0.19)', alignItems: 'center', justifyContent: 'center', borderRadius: 15}}>
                            <Text style={{color: 'rgba(255, 255, 255, 1)', fontSize: 14*window.width/375}}>{this.state.status === 1 ? '直播中' : '已结束'}</Text>
                        </View>
                    </View>
                </View>
            )
        } else {
            var h = window.width * 9 / 16;
            return (<View style={{height: h}}></View>);
        }
    }

    countDownFinish() {
        var cptTitle = this.state.cptBasicInfo[0].reservetitle || this._getCptTitle(this.state.cptBasicInfo[0]);
        this.setState({
            status: 1,
        })
    }

    //赛程基本信息
    renderCptBasic() {
        var _props = this.state.cptBasicInfo[0];
        return (
            <CptBasic
                key='cptbasicinfo'
                cptid={this.props.cptid}
                {..._props}
                currentCommentatorIdx={this.state.currentCommentatorIdx}
                status={this.state.status}
                servertime={this._props.servertime}
                onMaskShow={this._showCommentator.bind(this)}
                AppointFail={()=>{this.refs.toast.show('预订失败')}}
                AppointSuccess={()=>{this.refs.toast.show('预订成功')}}
                UnAppointFail={()=>{this.refs.toast.show('取消失败')}}
                UnAppointSuccess={()=>{this.refs.toast.show('取消成功')}}
                curPlayingVid={this.curPlayingVid}
            ></CptBasic>
        )
    }

    renderSelCommentator() {
        if (this.state.cptBasicInfo[0].hasOwnProperty('commentators')) {
            var _props = this.state.cptBasicInfo[0];
            var _bottom = this.state.commentatorAniFacotr.interpolate({
                inputRange: [0, 1],
                outputRange: [-50 * (this.state.cptBasicInfo[0].commentators.length + 1), 0],
                extrapolate: 'clamp'
            })
            return (
                <SelCommentator {..._props} bottom={_bottom} onCancle={this._hideCommentator.bind(this)}
                                            onChangeCommentator={this._changeCommentator.bind(this)}
                                            cIdx={this.state.currentCommentatorIdx}></SelCommentator>
            )
        } else {
            return false;
        }

    }

    //对战历史
    renderCptHistory() {
        var _props = this.state.teamCompetHistory[0] || {};
        _props.guestname = this._props.guestName;
        _props.hostname = this._props.hostName;
        _props.cptType = this._props.cptType;
        return (
            <CptHistory key="2"  {..._props} onHistoryDetail={this._showHistoryDetailLayer.bind(this)}></CptHistory>
        )
    }

    //联赛排名
    renderLeagueInfo() {
        var _props = {
            teamOrderInfo: this.state.teamOrderInfo || [],
            guestId: this._props.guestId,
            hostId: this._props.hostId,
            cptType: this._props.cptType,
        };
        return (
            <LeagueInfo {..._props} key='leagueInfo' onLeagueDetail={this.showLeagueDetail.bind(this)}></LeagueInfo>
        )
    }

    showLeagueDetail() {
        if (this.state.hasOverLayer === true) {//避免多次点击
            return;
        }
        this.needLeagueDetail = true;
        this.setState({hasOverLayer: true});
        Animated.timing(
            this.state.leagueDetailAni,
            {
                toValue: 0,
                delay: 0,
                duration: 300,
            }
        ).start();
    }

    hideLeagueDetail() {
        if (this.state.hasOverLayer === false) {//避免多次点击
            return;
        }
        this.setState({hasOverLayer: false});
        Animated.timing(
            this.state.leagueDetailAni,
            {
                toValue: this._props.containerHeight,
                delay: 0,
                duration: 300,
            }
        ).start();
    }

    renderLeagueDetailLayer() {
        if (!this.state.hasOwnProperty('teamOrderInfo')) {
            return false;
        }

        if (!this.state.needLeagueDetail) {
            return false;
        }
        var _props = {
            hostid: this._props.hostId,
            hostname: this._props.hostName,
            hosticon: this._props.hostIcon,
            guestid: this._props.guestId,
            guestname: this._props.guestName,
            guesticon: this._props.guestIcon,
            cptType: this._props.cptType,
        }
        _props.teamOrderInfo = this.state.teamOrderInfo || {};
        return (
            <Animated.View key="leagueDetail" style={[styles.mask, {top: this.state.leagueDetailAni}]}>
                <LeagueDetailInfo
                    key='leagueDetail' {..._props}
                    onHideLayer={this.hideLeagueDetail.bind(this)}>
                </LeagueDetailInfo>
            </Animated.View>
        )
    }

    renderCptLike(status, isOver) {//status 0:未赛， 1:比赛中, 2
        if (this._props.isversus) {
            var _props = {
                isOver: !!isOver,
                status: status,
                isLogin: this.state.isLogin,
                userName: this.state.userName,
                cptInfo: this.state.cptBasicInfo[0] || {},
                likeOption: this.state.likeOption,
            }
            return (
                <CptLike ref='cptlike' key='cptlike' {..._props}></CptLike>
            )
        } else {
            return (<View style={{alignItems:"center", justifyContent: "center", height: 98}}>
                <View
                    style={{width: 220*window.width/375, height: 3, backgroundColor: "rgba(216, 216, 216, 0.08)"}}></View>
                <View
                    style={{width: 220*window.width/375, height: 1, backgroundColor: "rgba(216, 216, 216, 0.08)", marginTop: 2,}}></View>
                <Text numberOfLines={2}
                      style={{color: 'white', fontSize: 18*window.width/375, marginTop: 15*window.width/375, marginBottom: 15*window.width/375, marginLeft: 60*window.width/375, marginRight: 60*window.width/375,}}>
                    {this._getCptTitle(this.state.cptBasicInfo[0])}
                </Text>
                <View
                    style={{width: 286*window.width/375, height: 1, backgroundColor: "rgba(216, 216, 216, 0.08)", marginBottom: 2,}}></View>
                <View
                    style={{width: 286*window.width/375, height: 3, backgroundColor: "rgba(216, 216, 216, 0.08)",}}></View>
            </View>);
        }


    }

    renderCptHistoryDetailLayer() {
        if (!this.state.hasOwnProperty('teamCompetHistory')) {
            return false;
        }

        if (!this.state.needHisDetail) {
            return false;
        }

        var _props = {
            hostid: this._props.hostId,
            hostname: this._props.hostName,
            hosticon: this._props.hostIcon,
            guestid: this._props.guestId,
            guestname: this._props.guestName,
            guesticon: this._props.guestIcon,
            cptType: this._props.cptType,
            teamHistory: this.state.teamCompetHistory[0] || {},
        }
        return (
            <Animated.View key="5" style={[styles.mask, {top: this.state.historyDetailAniTop}]}>
                <CptHistoryDetail
                    key='historyDetail'
                    {..._props}
                    onHideLayer={this._hideHistoryDetailLayer.bind(this)}>
                </CptHistoryDetail>
            </Animated.View>
        )
    }

    renderSections() {
        var sections = [];
        sections.push(this.renderCptBasic());

        var hasCptLike = this.state.status !== 0 && this.state.cptBasicInfo[0].isversus && this.state.cptBasicInfo[0].hasOwnProperty('option');
        var videos = this.state.cptBasicInfo[0].videos || [];
        if (this.state.status === 2 && !this.state.hasVideos) {
            hasCptLike = false;
        }

        if (this.state.status === 1 && !this.state.hasCommentators) {
            hasCptLike = false;
        }

        if (hasCptLike) {
            if (this.state.status)
                sections.push(this.renderCptLike(this.state.status));
        }

        if (this.state.hasOwnProperty('teamCompetHistory')) {
            sections.push(this.renderCptHistory());
        }

        if (this.state.hasOwnProperty('teamOrderInfo')) {
            sections.push(this.renderLeagueInfo());
        }
        return sections;
    }

    renderMask() {
        if (this.state.hasCommentatorSel) {
            var _opacity = this.state.commentatorAniFacotr.interpolate({
                inputRange: [0, 1],
                outputRange: [0, .5],
                extrapolate: 'clamp'
            })
            return (
                <Mask opacity={_opacity} onHideMask={this._hideCommentator.bind(this)}>
                </Mask>
            );
        } else {
            return false;
        }
    }

    renderToast() {
        return (
            <Toast ref='toast'></Toast>
        )
    }

    renderBody() {
        if (this.state.connectionInfo === 'none') {
            return ErrorTip.renderNoNetwork(this._fetchData.bind(this))
        }

        if (this.state.loadStatus === loadStatus.failed) {
            return ErrorTip.renderLoadFail(this._fetchData.bind(this))
        }

        if (this.state.loadStatus === loadStatus.init) {
            return this.showLoading();
        }

        return (<View style={{flex: 1,backgroundColor: '#eeeeee',}}>
            <ScrollView
                refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this.handleRefresh.bind(this)}
                />
              }
                scrollEnabled={!this.state.hasOverLayer} style={[styles.container, {backgroundColor: 'transparent'}]}>
                {this.renderSections()}
            </ScrollView>
            {this.renderMask()}
            {this.renderSelCommentator()}
            {this.renderCptHistoryDetailLayer()}
            {this.renderLeagueDetailLayer()}
            {this.renderToast()}
        </View>)
    }

    render() {
        return (
            <View ref='rootContainer' style={[{flex: 1}]}>
                {this.renderCptPreInfo()}
                {this.renderBody()}
            </View>
        );
    }

    handleRefresh() {
        if (this.state.isRefreshing === true) {
            return;
        }
        this.setState({isRefreshing: true});
        this._fetchData();
        if (this.refs.guessResult && this.refs.guessResult.fetchData) {
            this.refs.guessResult.fetchData();
        }
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    videoContainer: {
        width: window.width,
        height: window.width * 9 / 16,
    },

    preInfoCon: {
        marginTop: 49.5 * window.width / 375,
        backgroundColor: 'transparent',
    },

    videoBgImg: {
        width: window.width,
        height: window.width * 9 / 16,
        position: 'absolute',
    },

    overLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'yellow',
    },

    section: {
        marginBottom: 10,
        backgroundColor: 'white'
    },

    video: {
        height: .50
    },

    cptRound: {
        fontSize: 18,
        marginLeft: 5
    },

    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
    }
});

module.exports = CptInfo;
