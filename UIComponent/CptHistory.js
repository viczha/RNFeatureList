/*
*对战历史数据
*
*/
'use strict'

var React = require('react-native');
var comCss = require('../css/common');

var {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Image,
} = React;

class CptHistory extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	_onHistoryDetail() {
		if(this.props.hasOwnProperty('onHistoryDetail')) {
			this.props.onHistoryDetail('history');
		}
	}

	_getCptScore(hisObj) {
		if(!hisObj) {
			return false;
		}
		var sections = [];
		sections.push(<Text key='win' style={[styles.scoreText, styles.winColor]}>{hisObj.win}胜</Text>);
		if(this.props.cptType == 1 || hisObj.flat > 0) {
			sections.push(<Text key='flat' style={[styles.scoreText, styles.flatColor]}>{hisObj.flat}平</Text>);
		}
		sections.push(<Text key='lose' style={[styles.scoreText,styles.loseColor]}>{hisObj.lose}负</Text>);
		return sections;
	}

	_getCptSegments(hisObj) {
		if(!hisObj) {
			return false;
		}
		var sections = [];
		var total = hisObj.win + hisObj.flat + hisObj.lose;
		sections.push(<View key='win' style={[styles.winBg, styles.scoreSeg, {flex: hisObj.win/total}]}></View>);
		if(this.props.cptType == 1 || hisObj.flat > 0) {
			sections.push(<View key='flat' style={[styles.flatBg, styles.scoreSeg, {flex: hisObj.flat/total}]}></View>);
		}
		sections.push(<View key='lose' style={[styles.loseBg, styles.scoreSeg, {flex: hisObj.lose/total}]}></View>);
		return (
			<View style={[comCss.sectionItem]}>
				{sections}
			</View>
		);
	}

	renderCptHistory() {
		if(!this.props.gamehistory) {
			return false;
		}
		var scoreSections = this._getCptScore(this.props.gamehistory);
		var scoreSegments = this._getCptSegments(this.props.gamehistory);
		return (
		<View key='cpthistory'>
			<View style={[styles.cptHistoryCon]}>
				<View style={{flexDirection: 'row', flex: 1}}>
					<Text style={styles.teamName}>{this.props.hostname}</Text>
					<Text style={styles.vsText}>VS</Text>
					<Text style={styles.teamName}>{this.props.guestname}</Text>
				</View>
				<View style={{flexDirection: 'row'}}>
					{scoreSections}
				</View>
			</View>
			{scoreSegments}
		</View>
			)
	}

	renderHostHistory() {
		var sections = this._getCptScore(this.props.hosthistory);

		return(
			<View key='hosthistory' style={[comCss.sectionItem]}>
				<Text style={[styles.teamName, {flex: 1}]}>{this.props.hostname}近期战绩</Text>
				{sections}
			</View>
			)
	}

	renderGuestHistory() {
		var sections = this._getCptScore(this.props.guesthistory);

		return(
			<View key='guesthistory' style={[comCss.sectionItem]}>
				<Text style={[styles.teamName, {flex: 1}]}>{this.props.guestname}近期战绩</Text>
				{sections}
			</View>
			)
	}


	render() {
		var sections = [];

		sections.push(this.renderCptHistory());
		sections.push(this.renderHostHistory());
		sections.push(this.renderGuestHistory());

		return (
			<View style={comCss.section}>
				<View style={[comCss.sectionTitle]}>
					<Text style={[comCss.sectionTitleText]}>历史数据</Text>
					<TouchableOpacity style={{flex: 1}} onPress={this._onHistoryDetail.bind(this)}>
						<View style={comCss.sectionTitleDetailCon}>
							<Text style={comCss.sectionTitleDetail}>查看详情</Text>
							<Image style={comCss.moreDetailImg} source={{uri: 'home_arrow_icon'}} />
						</View>
					</TouchableOpacity>
					
				</View>
				{sections}
			</View>
			)
	}
}

var styles = StyleSheet.create({
	cptHistoryCon: {
		height: 50,
		paddingLeft: 12,
		paddingRight: 12,
		flexDirection: 'row',
		alignItems: "center",
	},

	teamName: {
		fontSize: 13,
		color: 'rgba(50, 50, 50, 1)',
	},

	vsText: {
		fontSize: 13,
		color: 'rgba(150, 150, 150, 1)',
		marginRight: 12,
		marginLeft: 12,
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
		marginLeft: 13,
	},

	scoreSeg: {
		height: 2,
		marginRight: 2,
	},

	hisSection: {
		paddingLeft: 12,
		paddingRight: 12,
		height: 40,
	    flexDirection: 'row',
	    alignItems: "center",
	},

	teamLogo: {
		alignItems: "center",
		justifyContent: 'center',
	},
	cptSeg: {

	},

});

module.exports = CptHistory;