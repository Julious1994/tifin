import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import moment from 'moment';
import Page from './../Page';
import GradiantScreen from '../GradiantScreen';
import imageMapper from '../../images/imageMapper';
import Service from '../../services/http';
import useUser from '../../userStore';

const service = new Service();

function Order(props) {
	const [orderList, setOrderList] = useState([])
	const [loading, setLoading] = useState(true);
	const [user] = useUser();
	function openForm() {
		props.navigation.push('OrderForm', { fetchOrders: () => fetchOrders() });
	}

	const fetchOrders = useCallback(() => {
		if (user.customerId) {
			setLoading(true);
			const url = `ExtraTiffinList?customerId=${user.customerId}`;
			service.get(url).then(res => {
				console.log('res', res);
				if (res.Status === '1') {
					setOrderList(res.Body);
				}
				setLoading(false);
			});
		}
	}, [user]);

	function deleteOrder(order, i) {
		service.post(`DeleteExtraTiffin?id=${order.id}`).then(res => {
			console.log(res);
			if (res.Status === '1') {
				Alert.alert("Success", res.Body, [{
					text: 'OK', onPress: () => {
						fetchOrders();
					}
				}]);
			} else {
				Alert.alert('Delete Tiffin', res.Body || res.Message);
			}
		})
			.catch(err => console.log('err', err));
	}

	function closeTicket(ticket) {
		service.post(`SupportTicketClose?supportId=${ticket.supportId}`).then(res => {
			if (res.Status === '1') {
				Alert.alert('Close Ticket', res.Body);
			}
			Alert.alert('Close Ticket', res.Body);
		})
			.catch(err => console.log('err', err));
	}
	function viewTicket(ticket) {
		console.log('ticket', ticket);
		props.navigation.push('TicketDetails', { supportId: ticket.supportId });
	}

	function confirmDelete(order) {
		Alert.alert('Cancel Tiffin', 'Are you sure? Want to cancel tiffin?', [
			{text: 'Yes', onPress: () => deleteOrder(order)},
			{text: 'No'}
		])
	}

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	return (
		<Page {...props}>
			<View style={{ marginTop: 10, marginBottom: 10 }}>
				<TouchableOpacity style={styles.createTicketButton} onPress={openForm}>
					<GradiantScreen style={styles.createButtonGradiant}>
						<Text style={styles.createButtonText}>EXTRA TIFIN</Text>
					</GradiantScreen>
				</TouchableOpacity>
			</View>
			<ScrollView>
				<View style={styles.menuList}>
					{
						!loading && !orderList.length &&
						<Text style={styles.emptyTicket}>No extra tiffin found</Text>
					}
					{
						loading ?
							<View style={styles.loaderWrapper}>
								<ActivityIndicator style={styles.loader} size="large" />
							</View>
							:
							orderList.map((item, i) => (
								<View key={i} style={styles.menuListItemContainer}>
									<View style={styles.itemSection}>
										<Text style={styles.menuTitle}>{item.mealType}</Text>
									</View>
									<View style={styles.itemSection}>
										<Text style={styles.menuTitle}>Quantity: {item.quantity}</Text>
									</View>
									<View style={styles.itemSection}>
										<Text style={styles.menuDescriptionText}>{moment(item.dateofBooking).format('DD/MM/YYYY')}</Text>
									</View>
									<View style={styles.actionWrapper}>
										{/* <View style={styles.actionView}>
											<TouchableOpacity onPress={() => confirmDelete(item, i)}>
												<GradiantScreen>
													<Image style={styles.eyeIcon} source={imageMapper.trash.source} />
												</GradiantScreen>
											</TouchableOpacity>
										</View> */}
									</View>
								</View>
							))
					}
					{
					}
				</View>
			</ScrollView>
		</Page>
	)
}

Order.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Extra tiffin',
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
		width: 35,
		height: 35,
		alignSelf: 'flex-end',
		marginLeft: 7,
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
		marginBottom: 50,
		position: 'relative',
	},
	itemSection: {
		marginBottom: 10
	},
	createTicketButton: {
		alignSelf: 'center',
		width: 140,
		height: 40,
		alignItems: 'center',
		borderRadius: 10,
	},
	createButtonText: {
		alignSelf: 'center',
		marginTop: 10,
		color: '#fff',
		fontWeight: 'bold'
	},
	createButtonGradiant: {
		width: '100%',
		borderRadius: 5
	},
	actionWrapper: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	loaderWrapper: {
		height: 200,
	},
	loader: {
		marginTop: '10%',
	},
	emptyTicket: {
		fontSize: 18,
		fontWeight: 'bold',
		alignSelf: 'center',
		color: '#fff',
	}
})

export default Order;
