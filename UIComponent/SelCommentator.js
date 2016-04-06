/*
*选择解说
*/

'use strict'

var React = require('react-native');
var deepEqual = require('../Utils/deepEqual');
var Dimensions = require('Dimensions');

var {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Image,
	Animated,
} = React;

const window = Dimensions.get('window');

class SelCommentator extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !deepEqual(this.props, nextProps) && deepEqual(this.state, nextState);
	}
	
	_cancle() {
		this.props.onCancle();
	}

	changeCommentator(idx) {
		this.props.onChangeCommentator(idx);
		this.props.onCancle();
	}

	renderCommentators() {
		var sections = [];
		this.props.commentators.forEach(function(item, i){
			if(i === this.props.cIdx) {
				sections.push(<TouchableOpacity onPress={this.changeCommentator.bind(this, i)} key={i}><View  style={styles.sections}>
					<View style={styles.opt}>
					<Image style={styles.selectedImg} source={{uri: 'cpt_selected'}} /></View>
					<Text  style={styles.cCommentator}>{item.commentator}</Text>
					<View style={styles.opt}></View>
					</View></TouchableOpacity>);
			} else {
				sections.push(<TouchableOpacity key={i} onPress={this.changeCommentator.bind(this, i)}>
					<View  style={styles.sections}>
					<Text  style={styles.commentator}>{item.commentator}</Text>
					</View></TouchableOpacity>);
			}
		}.bind(this));

		sections.push(<TouchableOpacity key='cancle' onPress={this._cancle.bind(this)}><View style={styles.sections} ><Text  style={styles.cCommentator}>取消</Text></View></TouchableOpacity>);

		return sections;
	}

	render() {
		return (
			<Animated.View  style={[styles.container, {bottom: this.props.bottom}]}>
				<View ref='container'>
		    		{this.renderCommentators()}
				</View>
		    </Animated.View>
			)
	}
}

var styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		borderStyle: 'solid',
		borderColor: '#eeeeee',
		borderWidth: 1,
		backgroundColor: 'rgba(250, 250, 250, 1)',
	},

	opt: {
		flex: .5,
		alignItems: 'flex-end',
	},

	sections: {
		alignItems: 'center', 
		justifyContent: 'center',
		paddingTop: 17,
		paddingBottom: 14,
		height:50,
		borderStyle: 'solid',
		borderColor: '#eeeeee',
		borderBottomWidth: 1,
		flex: 1,
		flexDirection: 'row',
	},

	cCommentator: {
		color: 'rgba(4, 176, 248, 1)',
		fontSize: 15,
	},

	commentator: {
		fontSize: 15,
		color: 'rgba(50, 50, 50, 1)',
	},

	selectedImg: {
		width: 16,
		height: 16,
		marginRight: 12,
	},
});



module.exports = SelCommentator;


