import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import moment from 'moment';
import Page from './../Page';
import Service from './../../services/http';
import mapper from './../../images/imageMapper';

const service = new Service();

function TicketDetails(props) {
	const { navigation } = props;
	const supportId = navigation.getParam('supportId');
	const [reply, setReply] = useState({ supportId, message: '', userType: 'Customer' })
	const [messageList, setMessageList] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (supportId) {
			setLoading(true);
			service.get(`DisplaySupportTicket?supportId=${supportId}`).then(res => {
				console.log('res', res);
				if (res.Status === '1') {
					setMessageList([...res.Body]);
				}
				setLoading(false);
			});
		}
	}, [supportId]);
	function handleChange(value) {
		setReply({ ...reply, message: value });
	}
	function handleReply() {
		service.post('ReplySupportTicket', reply).then(res => {
			if (res.Status === '1') {
				setMessageList([...messageList, { ...reply, replyDate: moment().format('MM/DD/YYYY') }]);
				setReply({ ...reply, message: '' });
			}
		})
	}

	function renderReplies() {
		return (
			<ScrollView>
				<View style={styles.replyContainer}>
					{
						messageList.map((msg, i) => (
							<View key={i} style={[styles.messageRow, msg.userType === 'Customer' && styles.customerRow]}>
								<View style={styles.profileIcon}></View>
								<View style={[styles.msgWrapper, msg.userType === 'Customer' && styles.customerMessage]}>
									<Text style={styles.msgText}>{msg.message}</Text>
									<Text style={styles.msgDate}>{msg.replyDate}</Text>
								</View>
							</View>
						))
					}
				</View>
			</ScrollView>
		)
	}
	return (
		<Page {...props}>
			<View style={styles.contentWrapper}>
				{
					loading ?
						<View style={styles.loaderWrapper}>
							<ActivityIndicator style={styles.loader} size="large" />
						</View>
						:
						renderReplies()
				}
				<View style={styles.commentView}>
					<View style={styles.commentTextWrapper}>
						<TextInput onChangeText={value => handleChange(value)} value={reply.message} placeholder="Type a message" />
					</View>
					<TouchableOpacity style={styles.rightBar} onPress={handleReply}>
						<Image source={mapper.sendArrow.source} />
					</TouchableOpacity>
				</View>
			</View>
		</Page>
	)
}

TicketDetails.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Ticket',
	}
}

const styles = StyleSheet.create({
	contentWrapper: {
		position: 'relative',
		height: '100%',
	},
	commentView: {
		display: 'flex',
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		width: '100%',
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: 'red',
	},
	rightBar: {
		width: '25%',
	},
	commentTextWrapper: {
		flex: 1,
	},
	replyContainer: {
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 75,
	},
	messageRow: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 10,
		marginBottom: 10,
	},
	customerRow: {
		flexDirection: 'row-reverse',
	},
	profileIcon: {
		width: 50,
		height: 50,
		backgroundColor: '#2f47ba',
		borderColor: '#fff',
		borderWidth: 2,
		borderRadius: 100,
	},
	msgWrapper: {
		marginLeft: 10,
		backgroundColor: '#fff',
		width: '65%',
		borderRadius: 5,
		padding: 10,
	},
	customerMessage: {
		marginRight: 10
	},
	msgText: {
		fontSize: 15,
	},
	msgDate: {
		color: '#AFAFAF',
	},
	loaderWrapper: {
		height: 200,
	},
	loader: {
		marginTop: '10%',
	},
});

export default TicketDetails;
