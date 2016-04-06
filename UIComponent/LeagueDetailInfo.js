/*
*联赛排名详情
*/
'use strict'

var React = require('react-native');
var comCss = require('../css/common');

const tbWidths = [.12, .31, .15, .15, .15, .12];
const basketWidths = [.12, .4, .15, .15, .18];

var {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Image,
	ScrollView,
} = React;

class LeaguDetailInfo extends React.Component {
	constructor(props) {
		super(props)
	}

	_onLayerHide() {
		if(this.props.hasOwnProperty('onHideLayer')) {
			this.props.onHideLayer();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false;
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

	renderLeagueList(item){
		var rows = [];
		var rowStyle =[];
		var cellStyle = {};
		item.data.forEach(function(item, i){
			rowStyle = i%2 === 1 ? [comCss.tableRow, comCss.tableRowEven] : [comCss.tableRow];
			cellStyle = item.order === 1 ?  comCss.winCom : {};
			switch(parseInt(item.order)) {
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
			if(this.props.cptType == 1) {
				rows.push(<View key={i} style={rowStyle}>
						<View style={[comCss.tableCell, {flex: tbWidths[0]}]}><Text style={cellStyle}>{item.order}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[1]}]}><Text style={comCss.tableCellText}>{item.teamname}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[2]}]}><Text style={comCss.tableCellText}>{item.win}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[3]}]}><Text style={comCss.tableCellText}>{item.flat}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[4]}]}><Text style={comCss.tableCellText}>{item.lose}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[5]}]}><Text style={comCss.tableCellText}>{item.score}</Text></View>
				</View>);
			} else if(this.props.cptType ==2) {
				rows.push(<View key={i} style={rowStyle}>
						<View style={[comCss.tableCell, {flex: basketWidths[0]}]}><Text style={cellStyle}>{item.order}</Text></View>
						<View style={[comCss.tableCell, {flex: basketWidths[1]}]}><Text style={comCss.tableCellText}>{item.teamname}</Text></View>
						<View style={[comCss.tableCell, {flex: basketWidths[2]}]}><Text style={comCss.tableCellText}>{item.win}</Text></View>
						<View style={[comCss.tableCell, {flex: basketWidths[3]}]}><Text style={comCss.tableCellText}>{item.lose}</Text></View>
						<View style={[comCss.tableCell, {flex: basketWidths[4]}]}><Text style={comCss.tableCellText}>{item.winrate}</Text></View>
				</View>);
			}
		}.bind(this));
		return (<View>
					{rows}
				</View>
				)
	}

	renderGroupList(group) {
		var cellWidth = [.3, .3, .1, .3];
		var leftTeamId = group.data[0].teamid;
		var rightTeamId = group.data[0].guestteamid;
		var leftScore = null;
		var rightScroe = null;
		var vsText = 'vs';
		group.data.forEach((item, i) => {
			if(item.teamid === leftTeamId && item.score != null) {
				leftScore = leftScore == null ? item.score : (leftScore + item.score);
			} else if(item.teamid === rightTeamId && item.score != null) {
				rightScroe = rightScroe == null ? item.score : (rightScroe + item.score);
			}	

			if(item.guestteamid === rightTeamId && item.guestscore != null) {
				rightScroe = rightScroe == null ? item.guestscore : (rightScroe + item.guestscore);
			} else if(item.guestteamid === leftTeamId && item.guestscore != null) {
				leftScore = leftScore == null ? item.guestscore : (leftScore + item.guestscore);
			}	
		})

		if(leftScore != null && rightScroe !=null) {
			vsText = leftScore + ':' + rightScroe;
		}

		return (
			<View style={[comCss.table, {marginBottom: 9}]}>
				<View style={styles.groupheader}>
					<Text style={[styles.groupheaderText, {textAlign: 'right'}]}>{group.data[0].teamname}</Text>
					<Text style={styles.groupheaderScore}>{vsText}</Text> 
					<Text style={styles.groupheaderText}>{group.data[0].guestteamname}</Text> 
				</View>
				<View style={[comCss.tableRow, {borderBottomWidth: 1, borderColor: 'rgba(240, 240, 240, 1)'}]}>
					<View style={[comCss.tableCell, {flex: cellWidth[0]}]}><Text style={comCss.tableCellText}>日期</Text></View>
					<View style={[comCss.tableCell, {flex: cellWidth[1]}]}><Text style={comCss.tableCellText}>主队</Text></View>
					<View style={[comCss.tableCell, {flex: cellWidth[2]}]}><Text style={comCss.tableCellText}>比分</Text></View>
					<View style={[comCss.tableCell, {flex: cellWidth[3]}]}><Text style={comCss.tableCellText}>客队</Text></View>
				</View>
				{
					group.data.map((item, i) => (
						<View style={comCss.tableRow}>
							<View style={[comCss.tableCell, {flex: cellWidth[0]}]}><Text style={comCss.tableCellText}>{item.matchstartdate && item.matchstartdate.substr(5, 11)}</Text></View>
							<View style={[comCss.tableCell, {flex: cellWidth[1]}]}><Text style={comCss.tableCellText}>{item.teamname}</Text></View>
							<View style={[comCss.tableCell, {flex: cellWidth[2]}]}><Text style={comCss.tableCellText}>{item.score == null ? 'vs' : (item.score + ':' + item.guestscore)}</Text></View>
							<View style={[comCss.tableCell, {flex: cellWidth[3]}]}><Text style={comCss.tableCellText}>{item.guestteamname}</Text></View>
						</View>
					))
				}
			</View>
		);
	}

	render() {
		return (
			<View style={comCss.overLayerCon}>
				<View style={comCss.overLayHeader}>
					<Text style={comCss.overLayHeaderOpt}></Text>
					<Text style={comCss.overLayHeaderText}>排行榜</Text>
					<TouchableOpacity style={comCss.overLayHeaderOpt} onPress={this._onLayerHide.bind(this)}><Image style={styles.closeImg} source={require('../Src/Images/cpt_close@2x.png')} /></TouchableOpacity>
				</View>
				<ScrollView>
				{
					this.props.teamOrderInfo.map && this.props.teamOrderInfo.map((item, i) => {
						if(item.styletype == 1 && item.data && item.data.map) {
							return item.data.map((group, j) => (
									<View key={j} style={[{marginLeft: 12.5, marginRight: 12.5, marginTop: 16}]}>
										<View>
											<Text style={styles.groupname}>{group.groupname}</Text>
										</View>
										<View style={comCss.table}>
											{this.renderTableHeader(false)}
											{this.renderLeagueList(group)}
										</View>
									</View>
								))
						} else if(item.styletype == 2 && item.data && item.data.map) {
							return (
								<View style={{marginLeft: 12.5, marginRight: 12.5, marginTop: 16}}>
									<View>
										<Text style={styles.groupname}>{item.grouptypename}</Text>
									</View>
									{item.data.map((group, j) => {
										if(group.data && group.data.length > 0) {
											return this.renderGroupList(group)
										} else {
											return false;
										}
										
									})}
								</View>)
						} else {
							return false;
						}
					})
				}
				</ScrollView>
			</View>
			)
		
	}
}

var styles = StyleSheet.create({
	closeImg: {
		width: 20,
		height: 20,
	},

	title: {
		flexDirection: 'row',
		height: 40,
		padding: 10,
		justifyContent: 'center',
		backgroundColor: 'yellow',
	},

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

	groupheader: {
		backgroundColor: 'rgba(240, 240, 240, 1)',
		height: 24,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},

	groupheaderText: {
		color: 'rgba(50, 50, 50, 1)',
		fontSize: 11,
		flex: 0.5,
	},

	groupheaderScore: {
		width: 80,
		textAlign: 'center',
		justifyContent: 'center',
		color: 'rgba(50, 50, 50, 1)',
		fontSize: 11,
	}, 

});

module.exports = LeaguDetailInfo;

