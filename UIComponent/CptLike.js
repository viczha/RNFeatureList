/*
*点赞
*/
'use strict'

var React = require('react-native');
var deepEqual = require('../Utils/deepEqual');
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
	View,
	TouchableOpacity,
	Text,
	Image,
	Animated,
} = React;

const likePostUrl = 'http://sports.mobile.pptv.com/topic/v1/vote';
const cptLikeName = 'pptvCptLike';

var Dimensions = require('Dimensions')
const window = Dimensions.get('window');

class CptLike extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			likeStatus: 0, //0 未赞， 1 赞主队， 2 赞客队
			total: 0, //总赞数
			hostOpt: {}, //主队赞信息
			guestOpt: {}, //客队赞信息
			likeOption: this.props.likeOption,
			//plusAni: new Animated.Value(0),
			likeAni: new Animated.Value(1),
			leftPlus: 0,
			rightPlus: 0,
			cptid: this.props.cptInfo.id,
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(!(deepEqual(this.props, nextProps) && deepEqual(this.state, nextState))){
			if(!deepEqual(this.state.likeOption, nextProps.likeOption)) {//同步点赞信息
				this.state.likeOption = nextProps.likeOption;
			}
			return true;
		} else {
			return false;
		}
	}

	componentDidMount() {
		//this.playAnimation();
	}

	componentDidUpdate() {
	}

	//赞主队
	likeHost() {
		if(this.state.likeStatus === 0) {//只能赞一次

			this.state.likeOption.hostOpt.result++;
			this.setState({
				likeStatus: 1,
				hostOpt: this.state.likeOption,
			})
			this.postLikeData(this.props.cptInfo.option.id, this.state.likeOption.hostOpt.id, this.props.cptInfo.hostid);
		}
	}

	//赞客队
	likeGuest() {
		if(this.state.likeStatus === 0) {//只能赞一次

			this.state.likeOption.guestOpt.result++;
			this.setState({
				likeStatus: 2,
				likeOption: this.state.likeOption,
			})
			this.postLikeData(this.props.cptInfo.option.id, this.state.likeOption.guestOpt.id, this.props.cptInfo.guestid);
		}
	}

	postLikeData(topicid, optionid, teamId) {
		var postUrl = likePostUrl + '?topicid=' + topicid + '&optionid=' + optionid;
		fetch(postUrl, {
	      method: 'POST'
	    });
	    this.playAnimation();
	}

	goCptTeamInfo(teamid) {

	}

	playAnimation() {
		if(this.playing == true) {
			return;
		}
		this.playing = true;
		this.state.likeAni.setValue(0);
		Animated.timing(
	        this.state.likeAni,
	        {
	          toValue: 1,
	          duration: 300,
	          delay: 0,
	        }
	      ).start(() => {
	      	this.playing = false;
	      });
	}

	renderLikeImg(cssStyle, imgUrl) {
		if(this.props.status === 0) {
			return (<Image style={cssStyle} source={imgUrl} />)
		} else {
			return (<View style={cssStyle}>
								<Image style={styles.likeImg} source={ imgUrl} />
							</View>);
		}
	}


	renderLikeButton (evtHandler, cssStyle, imgUrl) {
		if(this.state.likeStatus == 0) {
			return (<TouchableOpacity onPress={evtHandler}>
							{this.renderLikeImg(cssStyle, imgUrl)}
						</TouchableOpacity>)
		} else {
			return this.renderLikeImg(cssStyle, imgUrl);
		}
	}

	renderLikeSegmentsAndButtons () {
		if(this.state.likeOption == null) {
			return false;
		}

        if(JSUtils.isEmptyObject(this.state.likeOption.hostOpt) || JSUtils.isEmptyObject(this.state.likeOption.guestOpt)) {
            return false;
        }

		var leftFlex = 0.5;
		 var rightFlex= 0.5;
		 var total = this.state.likeOption.hostOpt.result + this.state.likeOption.guestOpt.result;

		 if(total !== 0) {
	 	 	var leftFlex = this.state.likeOption.hostOpt.result/total;
		 	var rightFlex= this.state.likeOption.guestOpt.result/total;
		 }

		 var hostLikeStyle = [this.props.status === 0 ? styles.likeButton : styles.likeButton1];
		 var guestLikeUrl = this.props.status === 0 ? require('../Src/Images/cpt_like_sel@2x.png') : require('../Src/Images/cpt_like@2x.png');
		 var guestLikeStyle = [this.props.status === 0 ? styles.likeButton : styles.likeButton1];
		 var hostLikeUrl = this.props.status === 0 ? require('../Src/Images/cpt_like_sel@2x.png') : require('../Src/Images/cpt_like@2x.png');

		 if(this.state.likeStatus === 0) {
		 	hostLikeStyle.push(this.props.status === 0 ? styles.prelikeButton : styles.prelikeButton1);
		 	guestLikeStyle.push(this.props.status === 0 ? styles.prelikeButton : styles.prelikeButton1);
		 	guestLikeUrl = this.props.status === 0 ? require('../Src/Images/pre_like_normal@2x.png') : require('../Src/Images/cpt_like@2x.png');
		 	hostLikeUrl = this.props.status === 0 ? require('../Src/Images/pre_like_normal@2x.png') : require('../Src/Images/cpt_like@2x.png');
		 }

		 if(this.state.likeStatus === 1) {
			hostLikeStyle.push(this.props.status === 0 ? {} : styles.likedButton);
		 	guestLikeStyle.push(this.props.status === 0 ? {} : styles.disLikeButton);
		 	guestLikeUrl = this.props.status === 0 ? require('../Src/Images/pre_like_dis@2x.png') : require('../Src/Images/cpt_like_dis@2x.png');
		 	hostLikeUrl = this.props.status === 0 ? 'pre_like_yellow' : 'cpt_like_sel';
		 }

		 if(this.state.likeStatus === 2) {
			hostLikeStyle.push(this.props.status === 0 ? {} : styles.disLikeButton);
		 	guestLikeStyle.push(this.props.status === 0 ? {} : styles.likedButton1);
		 	hostLikeUrl = this.props.status === 0 ? require('../Src/Images/pre_like_dis@2x.png') : require('../Src/Images/cpt_like_dis@2x.png');
		 	guestLikeUrl = this.props.status === 0 ? require('../Src/Images/pre_like_blue@2x.png') : require('../Src/Images/cpt_like_sel@2x.png');
		 }

		 var placeHolderLike = this.state.likeAni.interpolate({
	          inputRange: [0, 1],
	          outputRange: [1, 0],
	          extrapolate: 'clamp'
	      });

		 var segHeigth = this.props.status === 0 ? styles.segHeigth : styles.segHeigth1;

		return (<View><View style={[this.props.status === 0 ? styles.likeSegments : styles.likeSegments1, segHeigth]}>
						<View style={[{flex: leftFlex, flexDirection: 'row'}]}>
							<Animated.View style={[segHeigth, styles.leftSeg, segHeigth, {flex: this.state.likeAni}]}></Animated.View>
							<Animated.View style={[segHeigth,{flex: placeHolderLike}]}></Animated.View>
						</View>
						<View style={[{flex: rightFlex, flexDirection: 'row'}]}>
							<Animated.View style={[segHeigth, {flex: placeHolderLike}]}></Animated.View>
							<Animated.View style={[segHeigth, styles.rightSeg, {flex: this.state.likeAni}]}></Animated.View>
						</View>
					</View>
					<View style={styles.likeButtons}>
						{this.renderLikeButton(this.likeHost.bind(this), hostLikeStyle, hostLikeUrl)}
						<View>
							<Text style={this.props.status === 0 ? styles.likeNum : styles.likeNum1}>{this.state.likeOption.hostOpt.result}</Text>
						</View>

						<View style={{flex:1}}></View>
						<View>
							<Text style={this.props.status === 0 ? styles.likeNum : styles.likeNum1}>{this.state.likeOption.guestOpt.result}</Text>
						</View>
						{this.renderLikeButton(this.likeGuest.bind(this), guestLikeStyle, guestLikeUrl)}
					</View></View>)
	}

	renderScore() {
		var scoreBgColor = this.props.status == 1 ? styles.socreColor : styles.socreColor1;
		if(this.props.isOver
			&& this.props.cptInfo.hostscore != undefined
			&& this.props.cptInfo.guestscore != undefined) {
			return (<View style={styles.scoreCon}>
								<View style={[styles.scoreBlok3, scoreBgColor]}><Text style={styles.scoreText}>{this.props.cptInfo.hostscore || 0}</Text></View>
								<View style={[styles.scoreDash, scoreBgColor]}></View>
								<View style={[styles.scoreBlok3, scoreBgColor]}><Text style={styles.scoreText}>{this.props.cptInfo.guestscore || 0}</Text></View>
							</View>);
		}

		if(this.props.status === 0) {
			return (<Text style={styles.vsText}>VS</Text>)
		} else if(this.props.cptInfo.hostscore == undefined || this.props.cptInfo.guestscore == undefined) {
			return (<Text style={{color: this.props.status === 1 ? 'rgba(255, 147, 19, 1)' : 'rgba(159, 159, 159, 1)', fontSize: 11, width: 94, textAlign: 'center'}}>{this.props.status === 1 ? '直播中' : '已结束'}</Text>)
		} else {
			return (<View style={styles.scoreCon}>
								<View style={[styles.scoreBlok3, scoreBgColor]}><Text style={styles.scoreText}>{this.props.cptInfo.hostscore || 0}</Text></View>
								<View style={[styles.scoreDash, scoreBgColor]}></View>
								<View style={[styles.scoreBlok3, scoreBgColor]}><Text style={styles.scoreText}>{this.props.cptInfo.guestscore || 0}</Text></View>
							</View>);
		}
	}

	render() {
		var scoreBgColor = this.props.status == 1 ? styles.socreColor : styles.socreColor1;
		var logWidth = this.props.status === 0 ? 37*window.width/375 : 26;
		var nameWidth = (window.width - 2*logWidth - 24 - 94)/2;
		return (
				<View style={[this.props.status === 0 ? styles.container : styles.container1]}>
					<View style={[this.props.status === 0 ? styles.teamInfo : styles.teamInfo1]}>
						<View style={{width: nameWidth, justifyContent: 'center',}}>
							<Text style={this.props.status === 0 ? styles.teamName : styles.teamName1}>{this.props.cptInfo.hostname}</Text>
						</View>
						<TouchableOpacity onPress={this.goCptTeamInfo.bind(this, this.props.cptInfo.hostid)}>
						<Image style={this.props.status === 0 ? styles.teamLogo : styles.teamLogo1} defaultSource={{uri: 'team_default'}} source={{uri: this.props.cptInfo.hosticon || 'team_default'}} />
						</TouchableOpacity>
						{this.renderScore()}
						<TouchableOpacity onPress={this.goCptTeamInfo.bind(this, this.props.cptInfo.guestid)}>
						<Image style={this.props.status === 0 ? styles.teamLogo : styles.teamLogo1} defaultSource={{uri: 'team_default'}} source={{uri: this.props.cptInfo.guesticon || 'team_default'}} />
						</TouchableOpacity>
						<View style={{width: nameWidth, alignItems: 'flex-end',justifyContent: 'center', flexDirection: 'column'}}>
							<Text style={[this.props.status === 0 ? styles.teamName : styles.teamName1, {textAlign: 'left'}]}>{this.props.cptInfo.guestname}</Text>
						</View>
					</View>
					{this.renderLikeSegmentsAndButtons ()}
				</View>
			)
	}
}

var styles = StyleSheet.create({
	plusText: {
		position: 'absolute',
		top: 0,
		left:0,
		alignItems: 'center',
		width: 50,
		height: 22,
		backgroundColor: 'transparent',
	},

	container: {
		marginBottom: 10,
		paddingLeft: 12,
		paddingRight: 12,
	},

	container1: {
		paddingTop: 20,
		paddingBottom: 17,
		paddingLeft: 12,
		paddingRight: 12,
		backgroundColor: 'rgba(250, 250, 250, 1)',
		marginBottom: 10,
	},

	teamInfo: {
		height:38*window.width/375,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

	teamInfo1: {
		height:38,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

	teamName: {
		fontSize: 11,
		justifyContent: 'center',
		color: 'rgba(255, 255, 255, 1)',
	},

	teamName1: {
		fontSize: 11,
		justifyContent: 'center',
		color: 'rgba(50, 50, 50, 1)'
	},

	teamLogo: {
		width: 37*window.width/375,
		height: 38*window.width/375,
	},

	teamLogo1: {
		width: 26,
		height: 26,
	},

	vsText: {
		width: 70,
		textAlign: 'center',
		color: 'rgba(25, 108, 180, 1)',
		fontSize: 24,
		marginLeft: 12,
		marginRight: 12,
	},

	vsText1: {
		color: 'rgba(200, 200, 200, 1)',
		width: 70,
		textAlign: 'center',
		fontSize: 24,
		marginLeft: 12,
		marginRight: 12,
	},

	likeSegments: {
		marginTop: 16*window.width/375,
		marginBottom: 13*window.width/375,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

	likeSegments1: {
		marginTop: 11.5,
		marginBottom: 13,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

	segHeigth: {
		height: 8*window.width/375,
	},

	segHeigth1: {
		height: 6,
	},

	leftSeg: {
		backgroundColor: 'rgba(255, 213, 0, 1)',
		marginRight: 2.2,
		flex: 0.5,
	},

	rightSeg: {
		backgroundColor: 'rgba(0, 195, 237, 1)',
		flex: 0.5,
	},
	likeButtons: {
		height:22,
		flexDirection: 'row',
		alignItems: 'center',
	},

	likeButton: {
		width: 54,
		height: 30,
	},

	likeButton1: {
		width: 50,
		height: 22,
		alignItems: 'center',
		justifyContent: 'center',
        shadowRadius: 4,
        borderRadius: 4,
	},

	prelikeButton: {

	},

	prelikeButton1: {
		backgroundColor: 'rgba(240, 240, 240, 1)',
	},



	likedButton: {
		backgroundColor: 'rgba(255, 213, 0, 1)'
	},

	likedButton1: {
		backgroundColor: 'rgba(0, 195, 237, 1)',
	},
	disLikeButton: {
		backgroundColor: 'rgba(200, 200, 200, 1)'
	},
	likeImg: {
		width: 16,
		height: 16,

	},
	likeNum: {
		color: 'rgba(96, 121, 155, 1)',
		fontSize: 15,
		marginLeft: 6,
		marginRight: 6,
	},
	likeNum1: {
		color: 'rgba(150, 150, 150, 1)',
		fontSize: 11,
		marginLeft: 6,
		marginRight: 6,

	},
	scoreBlok2: {
		width: 26,
		height: 20,
		fontSize: 11,
		textAlign: 'center',
		justifyContent: 'center',
		borderRadius: 2,

	},

	scoreBlok3: {
		width: 26,
		height: 20,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 3,
	},

	scoreDash: {
		height: 1,
		width: 6,
		marginLeft: 2,
		marginRight: 3,

	},

	socreColor: {
		backgroundColor: 'rgba(253, 81, 81, 1)'
	},

	socreColor1: {
		backgroundColor: 'rgba(200, 200, 200, 1)',
	},

	scoreText: {
		fontSize: 11,
		color: 'rgba(255, 255, 255, 1)',
	},

	scoreCon: {
		flexDirection: 'row',
		marginLeft: 16,
		marginRight: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

module.exports = CptLike;