/*
*联赛排名
*/
'use strict'

var React = require('react-native');
var comCss = require('../css/common');
var deepEqual = require('../Utils/deepEqual');

const tbWidths = [.12, .31, .15, .15, .15, .12];
const basketWidths = [.12, .4, .15, .15, .18];

var {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Image,
} = React;

class LeaguInfo extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			teamInfo : this.getTeamInfo(),
		};
	}

	componentDidMount() {

	}

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	_onLeagueDetail() {
		if(this.props.hasOwnProperty('onLeagueDetail')) {
			this.props.onLeagueDetail('league');
		}
	}

	getTeamInfo() {
		var hostGroup = {};
		var guestGroup = {};
		this.props.teamOrderInfo.forEach && this.props.teamOrderInfo.forEach((item, i) => {
			if(item.styletype === 1) {
				item.data.forEach((group, j) => {
					group.data.forEach((team, k) => {
						if(team.teamid == this.props.guestId) {
							guestGroup = group;
							guestGroup['j'] = j;
							guestGroup['gk'] = k;
						} else if(team.teamid == this.props.hostId) {
							hostGroup = group;
							hostGroup['j'] = j;
							hostGroup['hk'] = k;
						}
					})
					
				});
			}
		});

		if(hostGroup.j === guestGroup.j) {//主客队在同一组
			return [hostGroup];
		} else {
			return[hostGroup, guestGroup];
		}
	}

	renderTableHeader(showImg, src) {
		if(this.props.cptType == 1) {
			var cells = ['排名', '队伍', '胜', '平', '负','积分'];
			return (
					<View key='-1' style={[comCss.tableRow, comCss.tableRowEven]}>
						{cells.map((cell, i) => <View key={i} style={[comCss.tableCell, {flex: tbWidths[i]}]}><Text style={comCss.tableCellText}>{cell}</Text></View>)}
					</View>
				)
		} else if(this.props.cptType == 2) {
			var cells = ['排名', '队伍', '胜', '负','胜率'];
			return (
					<View key='-1' style={[comCss.tableRow, comCss.tableRowEven]}>
						{cells.map((cell, i) => <View key={i} style={[comCss.tableCell, {flex: basketWidths[i]}]}><Text style={comCss.tableCellText}>{cell}</Text></View>)}
					</View>
				)
		}
	}

	renderTableRow(team, key, idx, isGray) {
		var rowStyle = idx++%2 === 1 ? [comCss.tableRow, comCss.tableRowEven] : [comCss.tableRow];
		var cellStyle = team.order === 1 ?  comCss.winCom : {};
		var fontColor = isGray ? {color: 'rgba(150, 150, 150, 1)'} : {};
		switch(parseInt(team.order)) {
			case 1:
				cellStyle = comCss.win1;
				break;
			case 2:
				cellStyle = comCss.win2;
				break;
			case 3:
				cellStyle = comCss.win3;
				break;
			default:
				cellStyle = comCss.winCom;
				break;
		}

		if(isGray) {
			cellStyle = comCss.winCom;
		}

		if(this.props.cptType == 1) {
			return (<View key={key} style={rowStyle}>
					<View style={[comCss.tableCell, {flex: tbWidths[0]}]}><Text style={cellStyle}>{team.order}</Text></View>
					<View style={[comCss.tableCell, {flex: tbWidths[1]}]}><Text style={[comCss.tableCellText, fontColor]}>{team.teamname}</Text></View>
					<View style={[comCss.tableCell, {flex: tbWidths[2]}]}><Text style={[comCss.tableCellText, fontColor]}>{team.win}</Text></View>
					<View style={[comCss.tableCell, {flex: tbWidths[3]}]}><Text style={[comCss.tableCellText, fontColor]}>{team.flat}</Text></View>
					<View style={[comCss.tableCell, {flex: tbWidths[4]}]}><Text style={[comCss.tableCellText, fontColor]}>{team.lose}</Text></View>
					<View style={[comCss.tableCell, {flex: tbWidths[5]}]}><Text style={[comCss.tableCellText, fontColor]}>{team.score}</Text></View>
			</View>);
		} else if(this.props.cptType ==2) {
			return (<View key={key} style={rowStyle}>
					<View style={[comCss.tableCell, {flex: basketWidths[0]}]}><Text style={cellStyle}>{team.order}</Text></View>
					<View style={[comCss.tableCell, {flex: basketWidths[1]}]}><Text style={[comCss.tableCellText, fontColor]}>{team.teamname}</Text></View>
					<View style={[comCss.tableCell, {flex: basketWidths[2]}]}><Text style={[comCss.tableCellText, fontColor]}>{team.win}</Text></View>
					<View style={[comCss.tableCell, {flex: basketWidths[3]}]}><Text style={[comCss.tableCellText, fontColor]}>{team.lose}</Text></View>
					<View style={[comCss.tableCell, {flex: basketWidths[4]}]}><Text style={[comCss.tableCellText, fontColor]}>{team.winrate}</Text></View>
			</View>);
		}
	}

	renderGroupRows(group,idx) {
		var rows = [];
		var i = 0;
		if((idx - 1) >= 0) {
			rows.push(this.renderTableRow(group.data[idx - 1], i, i, true));
			i++;
		}
		rows.push(this.renderTableRow(group.data[idx], i, i, false));
		i++;
		if((idx + 1) < group.data.length) {
			rows.push(this.renderTableRow(group.data[idx + 1], i, i, true));
			i++;
		}
		return rows;
	}

	renderGroup(group, idx) {
		return (<View style={{marginBottom: 18, marginTop: 2}}>
			<View>
				<Text style={styles.groupname}>{group.groupname}</Text>
			</View>
			<View style={comCss.table}>
					{this.renderTableHeader(false)}
					{this.renderGroupRows(group, idx)}
			</View>
		</View>);
	}

	renderList() {
		var rows = [];
		if(this.state.teamInfo.length === 1 && this.state.teamInfo[0].data) {
			rows.push(this.renderTableHeader(false));
			var hk = this.state.teamInfo[0].hk;
			var gk = this.state.teamInfo[0].gk;
			var hostTeam = this.state.teamInfo[0].data[hk];
			var guestTeam = this.state.teamInfo[0].data[gk];
			if(hk > gk) {
				rows.push(this.renderTableRow(guestTeam, 'guest'));
				rows.push(this.renderTableRow(hostTeam, 'host'));
			} else {
				rows.push(this.renderTableRow(hostTeam, 'guest'));
				rows.push(this.renderTableRow(guestTeam, 'host'));
			}
			
		} else if(this.state.teamInfo.length === 2) {

			this.state.teamInfo[0].data && rows.push(this.renderGroup(this.state.teamInfo[0], this.state.teamInfo[0].hk))
			this.state.teamInfo[1].data && rows.push(this.renderGroup(this.state.teamInfo[1], this.state.teamInfo[1].gk))
		}

		return rows;
	}

	render() {
		if(this.props.teamOrderInfo.length > 0) {
			return (
			<View style={comCss.section}>
					<View style={[comCss.sectionTitle]}>
						<Text style={[comCss.sectionTitleText]}>排行榜</Text>
						<TouchableOpacity style={{flex: 1}} onPress={this._onLeagueDetail.bind(this)}>
							<View style={comCss.sectionTitleDetailCon}>
								<Text style={comCss.sectionTitleDetail}>查看详情</Text>
								<Image style={comCss.moreDetailImg} source={require('../Src/Images/home_arrow_icon@2x.png')} />
							</View>
						</TouchableOpacity>
					</View>
					<View style={{padding: 10}}>
						{this.renderList()}
					</View>
			</View>
			)
		} else {
			return false;
		}

		
		
	}
}

var styles = StyleSheet.create({
	titleText: {
		fontWeight: "bold",
		fontSize: 20,
		flex: 0.6,
		alignItems: 'center', 
		justifyContent: 'center',
		textAlign: 'center',
	},
	titleFix: {
		width: 60,
		textAlign: 'center',
	},

	sectionTitle: {
		flexDirection: 'row',
		height: 40,
		padding: 10,
		marginTop: 20,
		
	},

	sectionTitleText: {
		fontSize: 18,
	},

	groupname: {
		fontSize: 13,
		color: 'rgba(50, 50, 50, 1)',
	},

});

module.exports = LeaguInfo;

