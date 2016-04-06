/*
*错误提示页
*/

'use strict'

var React = require('react-native');

var {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
} = React;

var styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgba(251, 251, 251, 1)',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},

	tipImg: {
		width: 78, 
		height: 78,
	},

	tipText: {
		fontSize: 13,
		color: 'rgba(50, 50, 50, 1)',
		marginTop: 25,
	},

	moreTip: {
		color: 'rgba(150, 150, 150, 1)', 
		fontSize: 11, 
		marginTop: 7.5
	}
});

module.exports = {
	renderNoContent: function(tipText) {
		return (
			<View style={styles.container}>
				<Image
				  style={styles.tipImg}
				  source={{uri: 'kongyemian_img_wuneirong'}} />
				  <Text style={styles.tipText}>{tipText}</Text>
			</View>
		)
	},
	renderNoNetwork: function(callback) {
	    return(
	      <TouchableOpacity style={styles.container} onPress={callback}>
	        <Image style={[styles.tipImg]} source={{uri: 'yinxiang_img_kongyemian'}} />
	        <Text style={styles.tipText}>
	          暂时没有检测到网络
	        </Text>
	        <Text style={styles.moreTip}>请先检查设置，再点击屏幕进行刷新</Text>
	      </TouchableOpacity>
	    )
	},
	renderLoadFail: function(callback) {
		return(
	      <TouchableOpacity style={styles.container} onPress={callback}>
	        <Image style={styles.tipImg} source={{uri: 'loadFailed'}} />
	        <Text style={styles.tipText}>
	          比赛信息加载失败, 请点击屏幕重试
	        </Text>
	      </TouchableOpacity>
	    )
	},
};


