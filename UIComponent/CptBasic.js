/*
*直播基本信息
*/

var React = require('react-native');
var deepEqual = require('../Utils/deepEqual');

var {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Image,
} = React;

class CptBasic extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			appointed: false,
		}

        this.isWithinSevenDays = this.isInSevenDays(this.props.servertime, this.props.starttime);
	}

	componentDidMount() {

		this._syncAppoint();
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.currentCommentatorIdx !== nextProps.currentCommentatorIdx
			|| this.props.status !== nextProps.status
			|| !deepEqual(this.state, nextState)
			|| !deepEqual(this.props.commentators, nextProps.commentators);
	}

	_getCommenter() {
		var rect ='';
		this.props.commentators.forEach(function(item, i){
			if(i === this.props.currentCommentatorIdx) {
				rect = item.commentator;
			}
		}.bind(this))

		return rect;
	}

	_share() {
		var title = this.props.reservetitle || this.getTitle();
	}

	_showMask() {
		if(this.props.hasOwnProperty('onMaskShow')) {
			this.props.onMaskShow();
		}
	}

	_syncAppoint() {
		var cid =  this.props.id;
		var _this = this
	}

	_appointHandler() {
		var title = this.props.reservetitle || this.getTitle();

		if(this.state.appointed) {
            this.setState({
                appointed: false,
            })
            this.pushEvent('UnAppointSuccess');
		} else {
            this.setState({
                appointed: true,
            });
            this.pushEvent('AppointSuccess');
		}
		
	}

	pushEvent(name) {
		if(this.props.hasOwnProperty(name)) {
			this.props[name]();
		}
	}

	_downloadHandler() {

	}

	getTitle() {
		var rect = '';
		if(this.props.schedulemark) {
			rect = this.props.schedulemark;
		} else {
			rect = this.props.title;
		}
		
		return rect.length > 20 ? (rect.substr(0, 20) + '...') : rect;
	}

	getStartTime(t) {
		return this.formate(t, 'MM-dd hh:mm');
	}

    isInSevenDays(now, start) {//七天内或者第七天
        var bnow = now + 7*24*60*60*1000;
        return bnow > start || new Date(bnow).getDate() === new Date(start).getDate();
    }

	formate(t, fmt) {
	  var d = new Date(t);
	  var o = {   
	    "M+" : d.getMonth()+1,                 //月份
	    "d+" : d.getDate(),                    //日
	    "h+" : d.getHours(),                   //小时
	    "m+" : d.getMinutes(),                 //分
	    "s+" : d.getSeconds(),                 //秒
	    "q+" : Math.floor((d.getMonth()+3)/3), //季度
	    "S"  : d.getMilliseconds()             //毫秒
	  };   
	  if(/(y+)/.test(fmt))   
	    fmt=fmt.replace(RegExp.$1, (d.getFullYear()+"").substr(4 - RegExp.$1.length));   
	  for(var k in o)   
	    if(new RegExp("("+ k +")").test(fmt))   
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	  return fmt;   
	} 

	render() {
		var subscribe = [];
		var commenter = [];
		if(this.props.status === 0 && this.isWithinSevenDays) {//未赛可设置提醒
			var subscribeUrl = this.state.appointed ? 'sport_unplayed_color' : 'subscribe_gray';
			subscribe.push(<TouchableOpacity onPress={this._appointHandler.bind(this)} style={{paddingLeft: 12, paddingRight: 12}} key='subscribe'>
						<Image style={styles.optImg} source={{uri: subscribeUrl}} />
					</TouchableOpacity>);
		}

		if(this.props.status === 1 && this.props.hasOwnProperty('commentators') && this.props.commentators.length > 1) {//比赛中且解说人数大于一，可切换解说
			commenter.push(<TouchableOpacity key='commentator' onPress={this._showMask.bind(this)}><View  style={styles.commentatorCon}>
							<Text style={styles.commentatorText}>
								[解说: {this._getCommenter()}]
							</Text>
							<Image style={styles.commentatorDown} source={{uri: 'cpt_down_green'}} />
						</View></TouchableOpacity>);
		}

		if(this.props.status === 2 && this.props.hasOwnProperty('videos') && this.props.videos.length > 0) {
			subscribe.push(<TouchableOpacity onPress={this._downloadHandler.bind(this)} style={{paddingLeft: 12, paddingRight: 12}} key='download'>
						<Image style={styles.commentatorDown} source={{uri: 'down'}} />
					</TouchableOpacity>)
		}

		return (
				<View style={styles.container}>
					<View style={{flex: 1,padding: 12,}}>
						<View style={styles.infoContainer}>
				            <Text numberOfLines={1} style={styles.cptName}>{this.getTitle()}</Text>
				            <Text style={styles.cptTime}>{this.getStartTime(this.props.starttime)}</Text>
						</View>
						{commenter}
					</View>
					{subscribe}
					<TouchableOpacity style={{paddingLeft: 12, paddingRight: 12}} onPress={this._share.bind(this)}>
						<Image style={styles.optImg} source={{uri: 'Share'}} />
					</TouchableOpacity>
				</View>
			)
	}
}

var styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(250, 250, 250, 1)', 
			marginBottom: 10,
	},

	infoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},

	commentatorCon: {
		height: 18.5,
		marginTop: 2.5,
		flexDirection: 'row',
		alignItems: 'center',
	},

	commentatorText: {
		color: 'rgba(4, 173, 246, 1)',
		fontSize: 13,
	},

	commentatorDown: {
		width: 20,
		height: 20,
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
		width: 18,
		height: 18,
	},
});

module.exports = CptBasic;