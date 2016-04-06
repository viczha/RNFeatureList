/*
*倒计时
*/

var React = require('react-native');
var deepEqual = require('../Utils/deepEqual');

var {
    StyleSheet,
    View,
    Text,
    } = React;

const _d = 24*60*60*1000;
const _h = 60*60*1000;
const _m = 60*1000;
const _s = 1000;

var Dimensions = require('Dimensions')
const window = Dimensions.get('window');


class CountDown extends React.Component {
	constructor(props) {
		super(props);
		var _time =this.getTime(this.props.remainTime)

		this.state = {
			day: _time[0],
			hour: _time[1],
			minus: _time[2],
			second: _time[3],
		}

		this.remainTime = this.props.remainTime;
	}

	componentDidMount() {
		if(this.countDownTimer) {
			clearInterval(this.countDownTimer);
		}
		this.countDownTimer = setInterval(this.setRemainTime.bind(this), 1000)
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !(deepEqual(this.props, nextProps) && deepEqual(this.state, nextState));
	}

	componentWillUnmount() {
		clearInterval(this.countDownTimer);
	}

	getTime(t) {
		var _day = Math.floor(t/_d);
		t = t%_d;
		var _hour = Math.floor(t/_h);
		t = t%_h;
		var _minus = Math.floor(t/_m);
		t = t%_m;
		var _second = Math.floor(t/_s);

		return [_day, _hour, _minus, _second];
	}

	setRemainTime() {
		var t = this.getTime(this.remainTime);

		this.setState({
			day: t[0],
			hour: t[1],
			minus: t[2],
			second: t[3],
		});

		if(t[0] === 0 && t[1] === 0 && t[2] === 0 && t[3] === 0) {
			clearInterval(this.countDownTimer);
			this.countdownFinish();
		} else {
			this.remainTime = this.remainTime - 1000 || 0;
		}
	}

	countdownFinish() {
		if(this.props.hasOwnProperty('onCountdownFinish')) {
			this.props.onCountdownFinish();
		}
	}

	getTitle() {
		if(this.props.schedulemark) {
			return this.props.schedulemark;
		} else {
			return this.props.title;
		}

	}

	formateTime(number) {
		var number = "" + number
		var pad = "00"
		return pad.substring(0, pad.length - number.length) + number
	}

	render() {
		if(this.props.hasalarm) {
			return (
				<View style={styles.container}>
					<View style={styles.header}>
						<Text style={styles.headerText}>距离开始还有</Text>
					</View>
					<View style={styles.contentSection}>
						<View style={[styles.line, {marginRight: 10}]}></View>
						<View style={styles.countDownNum}><Text style={styles.countDownNumTxt}>{this.formateTime(this.state.day)}</Text></View>
						<Text style={styles.countDownTxt}>天</Text>
						<View style={styles.countDownNum}><Text style={styles.countDownNumTxt}>{this.formateTime(this.state.hour)}</Text></View>
						<Text style={styles.countDownTxt}>时</Text>
						<View style={styles.countDownNum}><Text style={styles.countDownNumTxt}>{this.formateTime(this.state.minus)}</Text></View>
						<Text style={styles.countDownTxt}>分</Text>
						<View style={styles.countDownNum}><Text style={styles.countDownNumTxt}>{this.formateTime(this.state.second)}</Text></View>
						<Text style={styles.countDownTxt}>秒</Text>
						<View style={[styles.line, {marginLeft: 10}]}></View>
					</View>
				</View>
				)
		} else {
			return false;
		}

	}
}

var styles = StyleSheet.create({
	container: {
		backgroundColor: 'transparent',
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 10*window.width/375,
	},

	header: {
		height: 12.5,
		justifyContent: 'center',
		alignItems: 'center',
	},

	headerText: {
		color: 'rgba(255, 255, 255, 1)',
		fontSize: 9,
	},

	contentSection: {
		height:38*window.width/375,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

	line: {
		width: 30,
		height: 1,
		backgroundColor: 'rgba(25, 91, 158, 1)',
	},

	countDownNum:  {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(40, 109, 177, 1)',
		width: 20*window.width/375,
		height: 22*window.width/375,
		shadowColor: "rgb(52,21,23)",
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowOpacity: 0.32,
	},

	countDownNumTxt: {
		fontSize: 10.4*window.width/375,
		color: 'rgba(255, 255, 255, 1)',
	},

	countDownTxt: {
		fontSize: 9,
		margin: 4.6,
		color: 'rgba(61, 98, 145, 1)',
	},
});

module.exports = CountDown;