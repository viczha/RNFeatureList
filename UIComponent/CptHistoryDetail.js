/*
*对战历史数据详情
*
*/

'use strict'

var React = require('react-native');
var comCss = require('../css/common');

const tbWidths = [.16, .22, .23, .16, .23];

var {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Image,
	ScrollView,
} = React;

class CptHistory extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	_onLayerHide() {
		if(this.props.hasOwnProperty('onHideLayer')) {
			this.props.onHideLayer();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	_getCptScore(hisObj) {
		var sections = [];
		sections.push(<Text key='win' style={[styles.scoreText, styles.winColor]}>{hisObj.win}胜</Text>);
		if(this.props.cptType == 1 || hisObj.flat > 0) {
			sections.push(<Text key='flat' style={[styles.scoreText, styles.flatColor]}>{hisObj.flat}平</Text>);
		}
		sections.push(<Text key='lose' style={[styles.scoreText,styles.loseColor]}>{hisObj.lose}负</Text>);
		return sections;
	}

	_getDate(time, split) {
		var _date = new Date(time);

		split = split || '-';

		return _date.getFullYear() + split + (_date.getMonth()+1) + split + _date.getDate()
	}

	renderTableHeader(showImg, src) {
		var cellTexts = ['赛事', '日期', '主队', 'VS', '客队'];
		var cells = [];

		if(showImg) {
			cellTexts[4] = '对手';
		}

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

	renderGameHistory(){
		var rows = [];
		var rowStyle =[];
		rows.push(this.renderTableHeader(false));
		this.props.teamHistory.gamehistory && this.props.teamHistory.gamehistory.history.forEach(function(item, i){
			rowStyle = i%2 === 1 ? [comCss.tableRow, comCss.tableRowEven] : [comCss.tableRow];
			rows.push(<View key={i} style={rowStyle}>
						<View style={[comCss.tableCell, {flex: tbWidths[0]}]}><Text style={comCss.tableCellText}>{this._getFourText(item.competitionname)}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[1]}]}><Text style={comCss.tableCellText}>{this._getDate(item.date, '-')}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[2]}]}><Text style={comCss.tableCellText}>{this._getFourText(item.hostname)}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[3]}]}><Text style={comCss.tableCellText}>{item.hostscore}:{item.guestscore}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[4]}]}><Text style={comCss.tableCellText}>{this._getFourText(item.guestname)}</Text></View>
				</View>);
		}.bind(this));

		if(rows.length > 1) {
			return (
				<View style={styles.section}>
						<View key='gamehistorySection' style={styles.sectionTitle}>
							<Text style={styles.sectionTitleText}>对战历史</Text>
						</View>
						<View key='gamehistory' style={comCss.table}>{rows}</View>
				</View>
			)
		} else {
			return false;
		}
		
	}

	_getFourText(txt) {
		return txt.length > 5 ? txt.substr(0, 4) + '...' : txt;
	}

	renderHostHistory() {
		var rows = [];
		var rowStyle = [];

		rows.push(this.renderTableHeader(true, this.props.hosticon));

		this.props.teamHistory.hosthistory && this.props.teamHistory.hosthistory.history.forEach(function(item, i){
			rowStyle = i%2 === 1 ? [comCss.tableRow, comCss.tableRowEven] : [comCss.tableRow];
			var isHost = this.props.hostid === item.hostid;
			var score = isHost ? (item.hostscore + ':' + item.guestscore) : (item.guestscore + ':' + item.hostscore);
			rows.push(<View key={i} style={rowStyle}>
						<View style={[comCss.tableCell, {flex: tbWidths[0]}]}><Text style={comCss.tableCellText}>{this._getFourText(item.competitionname)}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[1]}]}><Text style={comCss.tableCellText}>{this._getDate(item.date, '-')}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[2]}]}><Text style={comCss.tableCellText}>{isHost ? '主队' : '客队'}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[3]}]}><Text style={comCss.tableCellText}>{score}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[4]}]}><Text style={comCss.tableCellText}>{this._getFourText(item.guestname)}</Text></View>
				</View>);
		}.bind(this))

		if(rows.length > 1) {
			return (
				<View style={styles.section}>
					<View key='hosthistorySection' style={[styles.sectionTitle, {flexDirection: 'row'}]}>
						<Text style={styles.sectionTitleText}>{this.props.hostname}近期战绩</Text>
						{this._getCptScore(this.props.teamHistory.hosthistory)}
					</View>
					<View key='hosthistory' style={comCss.table}>{rows}</View>
				</View>
			)
		} else {
			return false;
		}
		
	}

	renderGuestHistory() {
		var rows = [];
		var rowStyle = [];

		rows.push(this.renderTableHeader(true, this.props.guesticon));

		this.props.teamHistory.guesthistory && this.props.teamHistory.guesthistory.history.forEach(function(item, i){
			rowStyle = i%2 === 1 ? [comCss.tableRow, comCss.tableRowEven] : [comCss.tableRow];
			var isHost = this.props.guestid === item.hostid;
			var score = isHost ? (item.hostscore + ':' + item.guestscore) : (item.guestscore + ':' + item.hostscore);
			rows.push(<View key={i} style={rowStyle}>
						<View style={[comCss.tableCell, {flex: tbWidths[0]}]}><Text style={comCss.tableCellText}>{this._getFourText(item.competitionname)}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[1]}]}><Text style={comCss.tableCellText}>{this._getDate(item.date, '-')}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[2]}]}><Text style={comCss.tableCellText}>{isHost ? '主队' : '客队'}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[3]}]}><Text style={comCss.tableCellText}>{score}</Text></View>
						<View style={[comCss.tableCell, {flex: tbWidths[4]}]}><Text style={comCss.tableCellText}>{isHost ? this._getFourText(item.guestname) : this._getFourText(item.hostname)}</Text></View>
				</View>);
		}.bind(this))

		if(rows.length > 1) {
			return (
				<View style={styles.section}>
					<View key='guesthistorySection' style={[styles.sectionTitle, {flexDirection: 'row'}]}>
						<Text style={styles.sectionTitleText}>{this.props.guestname}近期战绩</Text>
						{this._getCptScore(this.props.teamHistory.guesthistory)}
					</View>
					<View key='guestistory' style={comCss.table}>{rows}</View>
				</View>
			)
		} else {
			return false;
		}
	}

	render() {
		return (
			<View style={comCss.overLayerCon}>
				<View style={comCss.overLayHeader}>
					<Text style={comCss.overLayHeaderOpt}></Text>
					<Text style={comCss.overLayHeaderText}>历史数据</Text>
					<TouchableOpacity style={comCss.overLayHeaderOpt} onPress={this._onLayerHide.bind(this)}><Image style={styles.closeImg} source={{uri: 'cpt_close'}} /></TouchableOpacity>
				</View>
				<ScrollView style={comCss.overLayerContent}>
					{this.renderGameHistory()}
					{this.renderHostHistory()}
					{this.renderGuestHistory()}
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
	teamLogo: {
		width: 18,
		height: 18,
	},
	title: {
		flexDirection: 'row',
		height: 40,
		padding: 10,
		justifyContent: 'center',
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

	section: {
		marginBottom: 15,
	},

	sectionTitle: {
		flexDirection: 'row',
		height: 18,
		marginBottom:8,
		marginTop: 10,
		alignItems: 'center',
	},

	sectionTitleText: {
		fontSize: 13,
		marginRight: 9.5,
	},

	winColor: {
		color: 'rgba(255, 101, 101, 1)',
	},

	winBg: {
		backgroundColor: 'rgba(255, 101, 101, 1)',
	},

	flatColor: {
		color: 'rgba(150, 150, 150, 1)',
	}, 

	flatBg: {
		backgroundColor: 'rgba(150, 150, 150, 1)',
	},

	loseColor: {
		color: 'rgba(4, 173, 246, 1)',
	},

	loseBg: {
		backgroundColor: 'rgba(4, 173, 246, 1)',
	},

	scoreText: {
		fontSize: 13,
		marginLeft: 10.5,
	},

	scoreSeg: {
		height: 2,
		marginRight: 2.5,
	},


});

module.exports = CptHistory;