import React, { useState, useEffect } from 'react';
import { View, Text, Picker, StyleSheet, Alert } from 'react-native';
import moment from 'moment';
import DatePicker from './../../components/DatePicker';
import Page from './../Page';
import Button from './../../components/Button';
import Input from './../../components/Input';
import useUser from './../../userStore';
import Service from './../../services/http';

const service = new Service();
const mealType = ['Breakfast', 'Lunch', 'Tea', 'Dinner'];
function OrderExtraTifin(props) {
	const [order, setOrder] = useState({dateofBooking: moment().format("YYYY-MM-DD")});
	const [orderTime, setOrderTime] = useState();
	const [user] = useUser();

	function handleChange(key, value) {
		setOrder({ ...order, [key]: value });
	}

	function handleClick() {
		if (order.quantity > 0 && order.mealType !== '') {
			const object = {
				...order,
				customerId: user.customerId,
			}
			service.post('AddExtraTiffin', object).then(res => {
				console.log('res', res);
				if (res.Status === '1') {
					Alert.alert("Success", res.Body, [{
						text: 'OK', onPress: () => {
							const fetchOrders = props.navigation.getParam('fetchOrders');
							if (fetchOrders) {
								fetchOrders();
							}
							props.navigation.pop();
						}
					}]);
				}
			})
		} else {
			Alert.alert('Validation', 'All fields are required');
		}
	}

	useEffect(() => {
		service.get('DisplayTime').then(res => {
			console.log(res);
			if(res.Status === '1') {
				setOrderTime(res.Body);
			}
		});
	}, []);

	function getMealTypes() {
		if(!orderTime) {
			return mealType;
		}
		return mealType.map(type => {
			const time = orderTime[`${type}CancelTime`];
			const mTime = moment(time, "hh:mm:ss");
			const date = moment();
			if(!mTime.isBefore(date)) {
				return type;
			}
		}).filter(e => e);
	}

	return (
		<Page {...props}>
			<View style={styles.container}>
				<View style={styles.fieldContainer}>
					<Input
						value={order.quantity}
						keyboardType={'numeric'}
						onChange={(val) => handleChange('quantity', val)}
						placeholder="Quantity"
						placeholderTextColor="#545454"
					/>
				</View>
				<View style={styles.fieldContainer}>
					<Picker
						selectedValue={order.mealType || ''}
						onValueChange={(e) => handleChange('mealType', e)}
					>
						<Picker.Item label="Meal Type" value={''} />
						{
							getMealTypes().map((type, i) => (
								<Picker.Item key={i} label={type} value={type} />
							))
						}
					</Picker>
				</View>
				<View style={styles.fieldContainer}>
					<DatePicker
						value={order.dateofBooking}
						onChange={(date) => handleChange('dateofBooking', moment(date).format("YYYY-MM-DD"))}
					/>
				</View>
				<View style={styles.buttonView}>
					<Button label="SUBMIT" onClick={handleClick} />
				</View>
			</View>
		</Page>
	)
}

OrderExtraTifin.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Order extra tifin',
	}
}

const styles = StyleSheet.create({
	container: {
		marginLeft: 25,
		marginRight: 25,
		marginTop: '10%',
	},
	buttonView: {
		marginTop: '30%',
	},
	fieldContainer: {
		paddingBottom: 15,
	}
});

export default OrderExtraTifin;
