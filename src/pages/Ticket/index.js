import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Page from './../Page';
import GradiantScreen from '../GradiantScreen';
import imageMapper from '../../images/imageMapper';
import Service from '../../services/http';
import useUser from '../../userStore';

const service = new Service();

function Ticket(props) {
	const [ticketList, setTicketList] = useState([])
	const [loading, setLoading] = useState(true);
	const [user] = useUser();
	function openTicketForm() {
		props.navigation.push('TicketForm', { fetchTickets: () => fetchTickets() });
	}

	const fetchTickets = useCallback(() => {
		if (user.customerId) {
			setLoading(true);
			const url = `SupportListByUserId?customerId=${user.customerId}`;
			service.get(url).then(res => {
				if (res.Status === '1') {
					setTicketList(res.Body);
				}
				setLoading(false);
			});
		}
	}, [user]);

	function deleteTicket(ticket, i) {
		service.post(`DeleteSupportTicket?supportId=${ticket.supportId}`).then(res => {
			if (res.Status === '1') {
				Alert.alert('Delete Ticket', res.Body);
			}
			Alert.alert('Delete Ticket', res.Body);
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

	useEffect(() => {
		fetchTickets();
	}, [fetchTickets]);

	return (
		<Page {...props}>
			<View style={{ marginTop: 10, marginBottom: 10 }}>
				<TouchableOpacity style={styles.createTicketButton} onPress={openTicketForm}>
					<GradiantScreen style={styles.createButtonGradiant}>
						<Text style={styles.createButtonText}>CREATE TICKET</Text>
					</GradiantScreen>
				</TouchableOpacity>
			</View>
			<ScrollView>
				<View style={styles.menuList}>
					{
						!loading && !ticketList.length &&
						<Text style={styles.emptyTicket}>No ticket found</Text>
					}
					{
						loading ?
							<View style={styles.loaderWrapper}>
								<ActivityIndicator style={styles.loader} size="large" />
							</View>
							:
							ticketList.map((item, i) => (
								<View key={i} style={styles.menuListItemContainer}>
									<View style={styles.itemSection}>
										<Text style={styles.menuTitle}>{item.title}</Text>
									</View>
									<View style={styles.itemSection}>
										<Text style={styles.menuDescriptionText}>{item.message}</Text>
									</View>
									<View style={styles.actionWrapper}>

										<View style={styles.actionView}>
											<TouchableOpacity onPress={() => viewTicket(item)}>
												<GradiantScreen>
													<Image style={styles.eyeIcon} source={imageMapper.eye.source} />
												</GradiantScreen>
											</TouchableOpacity>
										</View>
										<View style={styles.actionView}>
											<TouchableOpacity onPress={() => closeTicket(item)}>
												<GradiantScreen>
													<Image style={styles.eyeIcon} source={imageMapper.cancel.source} />
												</GradiantScreen>
											</TouchableOpacity>
										</View>
										<View style={styles.actionView}>
											<TouchableOpacity onPress={() => deleteTicket(item, i)}>
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

Ticket.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Ticket',
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

export default Ticket;
