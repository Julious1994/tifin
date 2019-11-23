import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import Page from './../Page';
import Button from './../../components/Button';
import mapper from './../../images/imageMapper';
import Service from './../../services/http';


const methods = [
	{ id: 1, title: 'PAYTM', type: 'Online', image: mapper.creditCardIcon },
	// { id: 2, title: 'PAYPAL', type: 'Online', image: mapper.paypalIcon},
	{ id: 3, title: 'CASH', type: 'Cash', image: mapper.paypalIcon },
];

function Payment(props) {
	const { navigation } = props;
	const plan = navigation.getParam('plan');
	const customerId = navigation.getParam('customerId');
	const changePlan = navigation.getParam('changePlan');
	const renewPlan = navigation.getParam('renewPlan');
	const [paymentMethod, setPaymentMethod] = useState(null);
	const cashPayment = navigation.getParam('cashPayment', true);

	function onPaymentMethodChange(method) {
		setPaymentMethod(method);
	}

	function renderMethod(method, index) {
		if (method.type === 'Cash' && !cashPayment) {
			return null;
		}
		return (
			<TouchableOpacity key={index} style={[styles.paymentMethodLine, styles.firstMethod]} onPress={() => onPaymentMethodChange(method)}>
				<View style={[styles.methodRadio, { ...(paymentMethod && paymentMethod.id === method.id && styles.selectedMethod) }]}></View>
				<Image style={styles.methodImage} source={method.image.source} />
				<Text style={styles.paymentMethodTitle}>{method.title}</Text>
			</TouchableOpacity>
		)
	}

	function handlePaymentSubmit(event) {
		const data = JSON.parse(event.nativeEvent.data);
		console.log(data);
		if(data.RESPCODE === '01') {
			changePlan && changePlan({ ...paymentMethod });
			renewPlan && renewPlan({ ...paymentMethod });
			navigation.pop();
		} else {
			Alert.alert("Payment Failed", data.RESPMSG);
			setPaymentMethod(null);
		}
	}

	return (
		paymentMethod && paymentMethod.id === 1 ?
			<WebView
				style={{ height: 100 }}
				onMessage={(event) => handlePaymentSubmit(event)}
				source={{
					uri: 'http://tiffincentre.somee.com/Home/Index', method: 'POST', body:
						`customerId=${customerId}&amount=${plan.amount}`
				}}
			/>
			:
			<Page {...props}>
				<View style={styles.container}>
					<Text style={styles.paymentMethodText}>Select Payment Method</Text>
					<View style={styles.paymentMethodList}>
						{
							methods.map((method, i) => (
								renderMethod(method, i)
							))
						}
					</View>
					{/* <Text style={styles.paymentFormTitle}>
					{paymentMethod.id === 1 && 'Select Card'}
					{paymentMethod.id === 2 && 'Select Paypal'}
				</Text>
				<View>
					
				</View>
				<View style={styles.nextButton}>
					<Button label='Next' onClick={handlePaymentSubmit} />
				</View> */}
				</View>
			</Page>
	)
}

const styles = StyleSheet.create({
	container: {
		marginLeft: 30,
		marginRight: 30,
	},
	paymentMethodText: {
		alignSelf: 'center',
		marginTop: 15,
		marginBottom: 15,
	},
	paymentMethodList: {
		backgroundColor: '#fff',
		borderRadius: 5,
	},
	paymentMethodLine: {
		display: 'flex',
		flexDirection: 'row',
		padding: 10,
	},
	methodImage: {
		width: 45,
		height: 32,
		marginRight: 10,
	},
	methodRadio: {
		height: 15,
		width: 15,
		borderRadius: 100,
		marginTop: 10,
		marginRight: 10,
		borderColor: '#afafaf',
		borderWidth: 1,
	},
	selectedMethod: {
		backgroundColor: 'green',
	},
	firstMethod: {
		borderBottomWidth: 1,
		borderColor: '#ddd',
	},
	paymentMethodTitle: {
		marginTop: 5,
	},
	paymentFormTitle: {
		fontWeight: 'bold',
		color: '#fff',
		alignSelf: 'center',
		marginTop: 20,
		marginBottom: 20,
	},
	nextButton: {
		alignItems: 'center',
	},
});

Payment.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Payment',
	}
}

export default Payment;
