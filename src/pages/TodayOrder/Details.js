import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Page from './../Page';
import imageMapper from '../../images/imageMapper';
import moment from 'moment';

function Details(props) {
	const { navigation} = props;
	const order = navigation.getParam('order', {});
	return(
		<Page {...props}>
			<View style={styles.slideContainer}>
				<Text style={styles.contentTitle}>Your Order Details</Text>
				<View style={styles.itemSection}>
					<View style={styles.dot}></View>
					<View style={styles.sectionDetails}>
						<Text style={[styles.menuTitle, styles.menuHeader]}>{order.status}</Text>
						<View style={styles.timeText}>
							<Image source={imageMapper.clock.source} style={styles.clockImage} />
							<Text style={styles.clockTime}>{moment(order.deliveryDate).format('hh:mm A MMM DD,YYYY ')}</Text>								
						</View>
					</View>
				</View>
				<View>
				</View>
				<View style={styles.callIcon}></View>
			</View>
		</Page>
	);
}

Details.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Tracking',
	}
}

const styles = StyleSheet.create({
	slideContainer: {
		marginTop: 25,
		marginBottom: 25,
		marginLeft: 15,
		marginRight: 15,
		backgroundColor: '#fff',
		borderRadius: 5,
		padding: 15,
		height: '80%',
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.34,
		shadowRadius: 6.27,

		elevation: 10,
	},
	dot: {
		width: 15,
		height: 15,
		backgroundColor: 'blue',
		borderRadius: 100,
		marginTop: 2,
	},
	timeText: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 5,
	},
	contentTitle: {
		alignSelf: 'center',
		fontWeight: 'bold',
		color: 'blue',
		marginBottom: 20,
	},
	itemSection: {
		display: 'flex',
		flexDirection: 'row',
	},
	sectionDetails: {
		marginLeft: 30,
	},
	clockImage: {
		height: 15,
		width: 15,
		marginRight: 5,
	},
	clockTime: {
		fontSize: 11,
	}
})

export default Details;
