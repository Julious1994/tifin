import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Page from './../Page';
import GradiantScreen from '../GradiantScreen';
import imageMapper from '../../images/imageMapper';
import Service from '../../services/http';
import useUser from '../../userStore';
import moment from 'moment';

const service = new Service();

function Tifin(props) {
	const [tifinList, setTifinList] = useState([])
	const [loading, setLoading] = useState(true);
	const [user] = useUser();
	// function openTifinForm() {
	// 	props.navigation.push('TifinForm', { fetchTickets: () => fetchTickets() });
	// }

	const fetchCancelTifin = useCallback(() => {
		if (user.customerId) {
			setLoading(true);
			const url = `CustomerCancelTiffinList?customerId=${user.customerId}`;
			service.get(url).then(res => {
				console.log('res', res);
				if (res.Status === '1') {
					setTifinList(res.Body);
				}
				setLoading(false);
			});
		}
	}, [user]);

	function deleteCancelTifin(tifin, i) {
		service.post(`DeleteCancelTiffin?id=${tifin.id}`).then(res => {
			if (res.Status === '1') {
				Alert.alert('Delete Tiffin', res.Body, [
					{text: 'OK', onPress: () => fetchCancelTifin()}
				]);
			} else {
				Alert.alert('Delete Tiffin', res.Body);
			}
		})
			.catch(err => console.log('err', err));
	}

	function confirmDelete(tifin) {
		Alert.alert('Cancel Tiffin', 'Are you sure? Want to cancel tiffin?', [
			{text: 'Yes', onPress: () => deleteCancelTifin(tifin)},
			{text: 'No'}
		])
	}

	useEffect(() => {
		fetchCancelTifin();
	}, [fetchCancelTifin]);

	return (
		<Page {...props}>
			<ScrollView>
				<View style={styles.menuList}>
					{
						!loading && !tifinList.length &&
						<Text style={styles.emptyTicket}>No tiffin found</Text>
					}
					{
						loading ?
							<View style={styles.loaderWrapper}>
								<ActivityIndicator style={styles.loader} size="large" />
							</View>
							:
							tifinList.map((item, i) => (
								<View key={i} style={styles.menuListItemContainer}>
									<View style={styles.itemSection}>
										<Text>Meal:</Text>
										<Text style={styles.menuTitle}>{item.mealType}</Text>
									</View>
									<View style={styles.itemSection}>
										<Text>Cancelled for </Text>
										<Text style={styles.menuDescriptionText}>{moment(item.dateofCancelday).format('DD-MM-YYYY')}</Text>
									</View>
									<View style={styles.actionWrapper}>

										{/* <View style={styles.actionView}>
											<TouchableOpacity onPress={() => viewTicket(item)}>
												<GradiantScreen>
													<Image style={styles.eyeIcon} source={imageMapper.eye.source} />
												</GradiantScreen>
											</TouchableOpacity>
										</View> */}
										<View style={styles.actionView}>
											<TouchableOpacity onPress={() => confirmDelete(item, i)}>
												<GradiantScreen>
													<Image style={styles.eyeIcon} source={imageMapper.trash.source} />
												</GradiantScreen>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							))
					}
				</View>
			</ScrollView>
		</Page>
	)
}

Tifin.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Cancelled Tiffin',
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

export default Tifin;
