/*
 *
 *
 */
'use strict'

var React = require('react-native');
var comCss = require('../Common/css');
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
    TouchableOpacity,
    Image,
    } = React;

var FlexiableWebView = require('../UIComponent/FlexiableWebView');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var RefreshableScrollView = require('../UIComponent/RefreshableScrollView');
//var ErrorTip = require('./ErrorTip');

const teamInfoQuery = 'http://sports.mobile.pptv.com/team/v1/detail?teamid=';

var Dimensions = require('Dimensions')
const window = Dimensions.get('window');

const tabTexts = ['资料', '近期战绩', '队员'];
const tbWidths = [.16, .22, .23, .16, .23];

class TeamInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadStatus: 0,
            indicatorAni: new Animated.Value(0),
            basicInfo: null,
            historyInfo: null,
            playerInfo: null,
            name: null,
            icon: null,
        }

        this.focusHandle = this.didFocus.bind(this);
        this.currentRoute = this.props.navigator.navigationContext.currentRoute;
        this.props.emitter.listen(this.currentRoute.componentName + 'DidFocus', this.focusHandle)
    }

    componentWillUnmount() {
        this.props.emitter.remove(this.currentRoute.componentName + 'DidFocus', this.focusHandle)
    }

    componentDidMount() {

    }

    didFocus() {
        this.fetchTeamInfo();
    }

    fetchTeamInfo() {
        var routes = this.props.navigator.getCurrentRoutes();
        var teamid = routes[routes.length - 1].teamid ? routes[routes.length - 1].teamid : 1110;
        var queryUrl = teamInfoQuery + teamid;
        fetch(queryUrl, {
            method: 'GET',
            timeout: 15*1000
        }).then((response) => response.json())
            .then((json) => this._handlerResponse(json))
            .catch((error) => this._onFetchError(error));
    }

    _handlerResponse(json) {

        if(json.code === 200) {
            var basicInfo, historyInfo, playerInfo;

            if(json.modules && json.modules.length > 0) {
                json.modules.forEach((item, i) => {
                    if(item.tid === 't_team_detail_1' && item.data && item.data.dlist) {
                        basicInfo = item.data.dlist[0];
                    }
                    if(item.tid === 't_team_history_1' && item.data && item.data.dlist) {
                        historyInfo = item.data.dlist[0];
                    }
                    if(item.tid === 't_team_player_1' && item.data && item.data.dlist) {
                        playerInfo = item.data.dlist;
                    }
                })
            }

            this.setState({
                data: json.data,
                loadStatus: 1,
                basicInfo: basicInfo,
                historyInfo: historyInfo,
                playerInfo: playerInfo,
                name: json.name,
                icon: json.icon
            })

        } else {
            this._onFetchError();
        }
    }

    _onFetchError(error) {
        this.setState({
            loadStatus: 2,
        })
    }

    showLoading() {
        return (
            <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(250,250,250,1)'}}>
                <Image style={{width: 25, height: 53, backgroundColor: 'transparent',marginBottom: 4}} source={require('../Src/Images/loading-football.gif')} />
                <Text style={{fontSize: 10, color: '#969696'}}>正在努力加载ing...</Text>
            </View>
        );
    }

    showError(txt) {
        //return ErrorTip.renderNoContent(txt);
    }

    tabIndexChanged(i) {
        this.tabView.goToPage(i);
    }

    renderBasicSection() {
        if(this.state.loadStatus === 0) {
            return this.showLoading();
        }
        return (
            <ScrollView key='basic' style={styles.tabSectionContainer} tabLabel={tabTexts[0]}>
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionTitle}>
                        <Text>基本信息</Text>
                    </View>
                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionRowHeaderText}>国家地区</Text>
                        <Text style={styles.sectionText}>{this.state.basicInfo.country}</Text>
                    </View>
                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionRowHeaderText}>所在城市</Text>
                        <Text style={styles.sectionText}>{this.state.basicInfo.city}</Text>
                    </View>
                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionRowHeaderText}>所在球馆</Text>
                        <Text style={styles.sectionText}>{this.state.basicInfo.stadium}</Text>
                    </View>
                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionRowHeaderText}>球场容量</Text>
                        <Text style={styles.sectionText}>{this.state.basicInfo.capacity}</Text>
                    </View>
                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionRowHeaderText}>成立时间</Text>
                        <Text style={styles.sectionText}>{this.state.basicInfo.establish}</Text>
                    </View>
                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionRowHeaderText}>联系地址</Text>
                        <Text numberOfLines={1} style={styles.sectionText}>{this.state.basicInfo.address}</Text>
                    </View>
                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionRowHeaderText}>官网地址</Text>
                        <Text style={styles.sectionText}>{this.state.basicInfo.website}</Text>
                    </View>
                </View>
                {this.renderProfile()}
                {this.renderBest()}
            </ScrollView>
        )
    }

    renderProfile() {
        if(this.state.basicInfo.profile) {
            return (
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionTitle}>
                        <Text>球队简介</Text>
                    </View>
                    <FlexiableWebView html={this.state.basicInfo.profile}/>
                </View>
            )
        } else {
            return false;
        }
    }

    renderBest() {
        if(this.state.basicInfo.best) {
            return (
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionTitle}>
                        <Text>球队之最</Text>
                    </View>
                    <FlexiableWebView html={this.state.basicInfo.best}/>
                </View>
            )
        } else {
            return false;
        }
    }

    renderTableHeader(showImg, src) {
        var cellTexts = ['赛事', '日期', '主队', 'VS', '客队'];
        var cells = [];

        cellTexts.forEach(function(item, i){
            var c = (i===2 && showImg===true) ? (<Image style={styles.teamLogo} source={{uri: src}} />) : (<Text style={comCss.tableCellText}>{item}</Text>);
            cells.push(<View key={i} style={[comCss.tableCell, {flex: tbWidths[i]}]}>{c}</View>)
        }.bind(this))

        return (
            <View key='-1' style={[comCss.tableRow, comCss.tableRowEven]}>
                {cells}
            </View>
        )
    }

    renderHistorySection(){
        if(this.state.loadStatus === 0) {
            return this.showLoading();
        }  else if(this.state.loadStatus === 2) {
            return this.showError('获取信息失败');
        } else if(JSUtils.isEmptyObject(this.state.historyInfo)) {
            return this.showError('暂无相关信息');
        }
        var rows = [];
        var rowStyle =[];
        rows.push(this.renderTableHeader(false));
        this.state.historyInfo.history && this.state.historyInfo.history.forEach(function(item, i){
            rowStyle = i%2 === 1 ? [comCss.tableRow, comCss.tableRowEven] : [comCss.tableRow];
            rows.push(<View key={i} style={rowStyle}>
                <View style={[comCss.tableCell, {flex: tbWidths[0]}]}><Text style={comCss.tableCellText}>{this._getFourText(item.competitionname)}</Text></View>
                <View style={[comCss.tableCell, {flex: tbWidths[1]}]}><Text style={comCss.tableCellText}>{this._getDate(item.date, '-')}</Text></View>
                <View style={[comCss.tableCell, {flex: tbWidths[2]}]}><Text style={comCss.tableCellText}>{this._getFourText(item.hostname)}</Text></View>
                <View style={[comCss.tableCell, {flex: tbWidths[3]}]}><Text style={comCss.tableCellText}>{item.hostscore}:{item.guestscore}</Text></View>
                <View style={[comCss.tableCell, {flex: tbWidths[4]}]}><Text style={comCss.tableCellText}>{this._getFourText(item.guestname)}</Text></View>
            </View>);
        }.bind(this));

        return (
            <ScrollView key='gamehistory'  tabLabel={tabTexts[1]}>{rows}</ScrollView>
        )
    }

    _getFourText(txt) {
        return txt.length > 5 ? txt.substr(0, 4) + '...' : txt;
    }

    _getDate(time, split) {
        var _date = new Date(time);

        split = split || '-';

        return _date.getFullYear() + split + (_date.getMonth()+1) + split + _date.getDate()
    }

    renderPlayer() {
        if(this.state.loadStatus === 0) {
            return this.showLoading();
        } else if(this.state.loadStatus === 2) {
            return this.showError('获取信息失败');
        } else if(JSUtils.isEmptyObject(this.state.playerInfo)) {
            return this.showError('暂无本队相关信息');
        }

        return (
            <ScrollView style={comCss.section} tabLabel={tabTexts[2]}>
                <View style={[styles.firstTeam]}>
                    {
                        this.state.playerInfo.map((item, i) =>(
                            <View key={i}>
                                <View style={styles.sectionTitle}>
                                    <Text>{item.title}</Text>
                                </View>
                                {
                                    item.dlist.map((player, j) => (
                                        <View key={i + '-' +j} style={styles.sectionRow}>
                                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                                <Image style={[styles.playerImg, {position: 'absolute'}]} source={require('../Src/Images/cpt_player_small@2x.png')} />
                                                <Image style={styles.playerImg} source={{uri: (player.photo ? player.photo : 'cpt_player_small')}} />
                                                <Text style={[styles.playerName, {marginLeft: 6}]}>{player.name}</Text>
                                            </View>
                                            <View style={styles.playerNoCon}>
                                                <Image style={styles.playerNoImg} source={require('../Src/Images/playerNumBg@2x.png')} />
                                                <Text style={styles.playerNoText}>{player.shirtno}</Text>
                                            </View>
                                        </View>
                                    ))
                                }
                            </View>
                        ))
                    }
                </View>
            </ScrollView>
        )
    }

    renderTeamLogo() {
        if(this.state.loadStatus === 1 && this.state.icon) {
            return (<Image style={[styles.teamLogoImg]} defaultSource={{uri: 'team_default'}} source={{uri: this.state.icon}} />)
        } else {
            return (<Image style={[styles.teamLogoImg, {position: 'absolute'}]} source={{uri: 'team_default'}} />);
        }
    }

    goBack() {
        this.props.navigator.pop();
    }

    render() {
        var _animateAni = this.state.indicatorAni.interpolate({
            inputRange: [0, 2],
            outputRange: [window.width/6 - 35, window.width*5/6 - 35],
            extrapolate: 'clamp'
        });
        return (<View style={styles.constainer}>
            <View style={styles.header}>
                <Image style={styles.header_bg_img} source={require('../Src/Images/football_team_bg@2x.png')} />
                <TouchableOpacity
                    style={{paddingLeft: 12, paddingTop: 25, paddingBottom: 25, paddingRight: 12, position: 'absolute',  left: 0, top: 0, backgroundColor: 'transparent'}}
                    onPress={this.goBack.bind(this)}>
                    <Image
                        style={{width: 27, height: 27, backgroundColor: 'transparent'}}
                        source={require('../Src/Images/back.png')} />
                </TouchableOpacity>
                <View style={styles.team_basic_info}>
                    <View style={styles.teamLogoCon}>
                        {this.renderTeamLogo()}
                    </View>
                    <Text style={styles.teamname}>{this.state.name ? this.state.name : ''}</Text>
                </View>
                <View style={styles.headerTabs}>
                    <Animated.View style={[styles.indicator, {left: _animateAni}]}></Animated.View>
                    {
                        tabTexts.map((item, idx) => (
                            <TouchableOpacity style={styles.headerTab}
                                              key={idx}
                                              onPress={this.tabIndexChanged.bind(this, idx)}>
                                <Text style={styles.headerTabText}>{item}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>

            <ScrollableTabView
                style={{flex: 1}}
                onScroll={(val) => {this.state.indicatorAni.setValue(val)}}
                renderTabBar={false}
                ref={(tabView) => {this.tabView = tabView}}
            >
                <View style={{flex: 1}}>
                    {this.renderBasicSection()}
                </View>
                <View style={{flex: 1}}>
                    {this.renderHistorySection()}
                </View>
                <View style={{flex: 1}}>
                    {this.renderPlayer()}
                </View>
            </ScrollableTabView>

        </View>)
    }
}

var styles = StyleSheet.create({
    constainer: {
        flex: 1,
        backgroundColor: 'white'
    },

    header: {
        height: 180,
        backgroundColor: 'green'
    },

    headerTabs: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    headerTab: {
        flex: 1/3,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    indicator: {
        width: 70,
        height: 22,
        borderRadius: 8,
        backgroundColor: 'black',
        opacity: .3,
        position: 'absolute',
        top: 10,
        left: window.width/6 - 35,
    },

    headerTabText: {
        color: 'rgba(255,255,255, 1)',
        fontSize: 13,
    },

    header_bg_img: {
        height: 180,
        width: window.width,
        position: 'absolute',
    },
    team_basic_info: {
        marginTop: 42,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    teamLogoCon: {
        width: 60,
        height: 60,
    },
    teamLogoImg: {
        width: 60,
        height: 60,
    },
    teamname: {
        color: 'white',
        fontSize: 13,
        height: 18,
        marginBottom: 10,
        marginTop: 10,
    },

    tabSectionContainer: {
    },

    sectionContainer: {
        marginBottom: 9,
        backgroundColor: 'rgba(250, 250, 250, 1)'
    },

    sectionTitle: {
        height: 34,
        paddingLeft: 12,
        paddingRight: 12,
        alignItems: 'center',
        flexDirection: 'row',
    },
    sectionTitleText: {
        fontSize: 15,
        color: 'rgba(50, 50, 50, 1)'
    },

    sectionRow:{
        height: 44,
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
        paddingLeft: 12,
        paddingRight: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionRowHeaderText: {
        fontSize: 13,
        color: 'rgba(150, 150, 150, 1)',
        marginRight: 22,
    },

    sectionRowText: {
        fontSize: 13,
        color: 'rgba(50, 50, 50, 1)',
    },


    firstTeamCon: {
        flexDirection: 'row',
    },

    firstTeam: {
        flex: 0.5,
    },

    playerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },

    playerImg: {
        width: 30,
        height: 30,
    },

    playerName: {
        fontSize: 11,
        color: 'rgba(50, 50, 50, 1)',
        marginBottom: 2,
    },

    playerPosition: {
        fontSize: 11,
        color: 'rgba(150, 150, 150, 1)',
    },

    cptName: {
        fontSize: 13,
        color: 'rgba(50, 50, 50, 1)',
    },

    cptTime: {
        fontSize: 11,
        marginLeft: 12,
        color: 'rgba(50, 50, 50, 1)',
    },

    optImg: {
        width: 18.5,
        height: 18.5,
    },

    playerNoCon: {
        width: 25,
        height: 20,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    playerNoImg: {
        position:'absolute',
        width:25,
        height:20,
    },

    playerNoText: {
        paddingTop: 5,
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 11,
        backgroundColor: 'transparent',
    }

});

module.exports = TeamInfo;