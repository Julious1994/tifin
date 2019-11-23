import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Picker, Alert } from 'react-native';
import Button from './../../components/Button';
import Page from './../Page';
import Input from './../../components/Input';
import Service from './../../services/http';
import AsyncStorage from '@react-native-community/async-storage';

function TicketForm(props) {
	const [ticket, setTicket] = useState({});
	const fetchTickets = props.navigation.getParam('fetchTickets');
	useEffect(() => {
		try {
			AsyncStorage.getItem('user').then((data) => {
				const record = JSON.parse(data);
				console.log('record', record);
				if (record) {
					setTicket({ ...ticket, customerId: record.customerId });
				}
			});
		} catch (err) {
			console.log('err', err);
		}
	}, []);
	function handleChange(key, value) {
		setTicket({ ...ticket, [key]: value });
	}
	function submitTicket() {
		const service = new Service();
		service.post('CreateSupportTicket', ticket).then(res => {
			console.log('res', res);
			if (res.Status === '1') {
				Alert.alert("Success", res.Body, [{
					text: 'OK', onPress: () => {
						if(fetchTickets) {
							fetchTickets();
						}
						props.navigation.pop();
					}
				}]);
			}
		});
	}
	return (
		<Page {...props}>
			<View style={styles.container}>
				<View style={styles.ticketForm}>
					<View style={styles.fieldContainer}>
						<Picker
							style={{ color: '#fff' }}
							selectedValue={ticket.requestType || ''}
							onValueChange={(e) => handleChange('requestType', e)}
						>
							<Picker.Item label="Type" value={''} />
							<Picker.Item label="Complaint" value="Complaint" />
							<Picker.Item label="Support" value="Support" />
						</Picker>
					</View>
					<View style={styles.fieldContainer}>
						<Input
							value={ticket.title || ''}
							onChange={(val) => handleChange('title', val)}
							placeholder={"Subject"}
						/>
					</View>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={ticket.message || ''}
						onChange={(val) => handleChange('message', val)}
						placeholder={"Description"}
						multiline={true}
						numberOfLines={4}
					/>
				</View>
				<View style={styles.dialogButton}>
					<Button label="SUBMIT" onClick={submitTicket} />
				</View>
			</View>
		</Page>
	)
}

TicketForm.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Add Ticket',
	}
}

const styles = StyleSheet.create({
	container: {
		marginLeft: 30,
		marginRight: 30,
	},
	fieldContainer: {
		paddingBottom: 15,
	},
	dialogButton: {
		marginTop: 25,
		paddingBottom: 15,
	},
	ticketForm: {
		marginTop: 25,
		marginBottom: 25,
	}
})

export default TicketForm;
