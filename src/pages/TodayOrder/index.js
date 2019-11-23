import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Page from './../Page';
import GradiantScreen from '../GradiantScreen';
import imageMapper from '../../images/imageMapper';
import Service from './../../services/http';
import useUser from './../../userStore';

const service = new Service();
function OrderList(props) {
	const { navigation } = props;
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [user] = useUser();

	function handleDetails(item) {
		navigation.push('TodayOrderDetails', { order: item });
	}

	function handleExtendTime(item) {
		navigation.push('ExtendTime', { order: item, fetchTifin });
	}
	const fetchTifin = useCallback(() => {
		if (user.customerId) {
			service.get(`CustomerTiffinList?customerId=${user.customerId}`).then(res => {
				setLoading(false);
				if (res.Status === '1') {
					setList(res.Body);
				}
			})
		}
	}, [user])

	useEffect(() => {
		fetchTifin();
	}, [fetchTifin]);

	console.log('list', list);
	return (
		<Page {...props}>
			<ScrollView>
				<View style={styles.menuList}>
					{
						!loading && !list.length &&
						<Text style={styles.emptyList}>No menu found</Text>
					}
					{
						loading ?
							<View style={styles.loaderWrapper}>
								<ActivityIndicator style={styles.loader} size="large" />
							</View>
							:
							list.map((item, i) => (
								<View key={i} style={styles.menuListItemContainer}>
									<View style={styles.itemSection}>
										<Text style={styles.menuTitle}>{item.mealType}</Text>
									</View>
									<View style={styles.subItemSection}>
										<Text style={styles.menuDescriptionText}>Quantity: {item.quantity}</Text>
									</View>
									<View style={styles.subItemSection}>
										<Text style={styles.menuDescriptionText}>Deliver by: {item.deliveryBoyname}</Text>
									</View>
									<View style={styles.actionView}>
										<TouchableOpacity style={{ width: 30 }} onPress={() => handleDetails(item)}>
											<GradiantScreen>
												<Image style={styles.eyeIcon} source={imageMapper.eye.source} />
											</GradiantScreen>
										</TouchableOpacity>
										<TouchableOpacity style={{ marginLeft: 5, width: 30 }} onPress={() => handleExtendTime(item)}>
											<GradiantScreen>
												<Image style={styles.eyeIcon} source={imageMapper.clock.source} />
											</GradiantScreen>
										</TouchableOpacity>
									</View>
								</View>
							))
					}
				</View>
			</ScrollView>
		</Page>
	)
}

OrderList.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: `Today's Tiffin`,
		headerRight: (
			<TouchableOpacity onPress={() => navigation.reset([NavigationActions.navigate({ routeName: 'OrderExtraTifin' })], 0)}>
				<Text style={styles.rightLink}>Extra Tiffin</Text>
			</TouchableOpacity>
		),
	}
}

const styles = StyleSheet.create({
	menuListItemContainer: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#fff',
		padding: 10,
		marginBottom: 15,
	},
	menuTitle: {
		fontWeight: 'bold',
		fontSize: 14
	},
	menuDescriptionText: {
		fontSize: 11,
	},
	actionView: {
		// width: 30, 
		height: 30,
		alignSelf: 'flex-end',
		display: 'flex',
		flexDirection: 'row',
	},
	eyeIcon: {
		tintColor: "#fff",
		width: 15,
		height: 15,
		alignSelf: 'center',
		marginTop: 8,
	},
	menuList: {
		marginLeft: 25,
		marginRight: 25,
		marginTop: 15,
	},
	itemSection: {
		marginBottom: 10
	},
	emptyList: {
		fontSize: 18,
		fontWeight: 'bold',
		alignSelf: 'center',
		color: '#fff',
	},
	loaderWrapper: {
		height: 200,
	},
	loader: {
		marginTop: '10%',
	},
	menuHeader: {
		marginBottom: 2,
	},
	subItemSection: {
		marginBottom: 2,
	},
	rightLink: {
		fontWeight: 'bold',
		marginRight: 10,
		color: 'blue',
	},
})

export default OrderList;
