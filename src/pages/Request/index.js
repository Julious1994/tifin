import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Page from './../Page';
import Dialog from './Dialog';
import mapper from './../../images/imageMapper';
import Button from './../../components/Button';
import Service from './../../services/http';
import useUser from '../../userStore';
const service = new Service();

function Request(props) {
	const [cancelConfirm, setCancelConfirm] = useState(false);
	const [success, setSuccess] = useState(false);
	const [multiple, setMultiple] = useState(false);
	const [plan, setPlan] = useState();
	const [user] = useUser();

	function handleRequestClick(routeName, params = {}) {
		const { navigation } = props;
		navigation.navigate(routeName, params);
	}

	function handleCancelConfirm() {
		handleRequestClick('CancelTifin', {multiple, cashPayment: false, handleSuccess: (flag) => setSuccess(flag)});
		setMultiple(false);
		setCancelConfirm(false);
	}

	function renderSuccessDialog() {
		return (
			<Dialog 
				visible={success}
				closeDialog={() => setSuccess(false)}
			>
				<View>
					<Image style={{ height: 200, width: '100%'}} source={mapper.tifinBanner.source} />
				</View>
				<Text style={styles.successTitle}>Success!</Text>
				<Text style={styles.successText}>Your tiffin has been cancelled Successfully!</Text>
				<View style={[styles.dialogButton]}>
					<Button label="OK" onClick={() => setSuccess(false)} />
				</View>
			</Dialog>
		)
	}

	function renewPlan(payment) {
		const {type} = payment;
		console.log(plan);
		const object = {
			paymentType: type,
			planId: user.planId,
			customerId: user.customerId,
		}
		service.post('RenewPlan', object).then(res => {
			Alert.alert('Renew Plan', res.Body)
		})
	}

	function handlePlanRenew() {
		console.log('ppp', user.planId);
		if(user.planId) {
			service.get(`DisplayPlanDetail?PlanID=${user.planId}`).then(res => {
				console.log('res', res);
				if(res.Status === '1') {
					const newPlan = res.Body;
					setPlan(newPlan);
					props.navigation.push('Payment', {plan: newPlan, renewPlan, cashPayment: false, customerId: user.customerId});
				}
			});
		}
	}

	return (
		<Page {...props}>
			<View style={styles.requestContainer}>
				<Text style={styles.requestPanelTitle}>CancelTifin</Text>
				<View style={styles.requestRow}>
					<TouchableOpacity onPress={() => setCancelConfirm(true)}>
						<Text style={styles.requestItemTextColor}>Cancel Tiffin for a day</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.requestRow}>
						<TouchableOpacity 
							onPress={() => {
								setCancelConfirm(true)
								setMultiple(true);
							}}
						>
						<Text style={styles.requestItemTextColor}>Cancel Tiffin for multiple days</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.requestRow}>
						<TouchableOpacity 
							onPress={() => handleRequestClick('CancelTifinList')}
						>
						<Text style={styles.requestItemTextColor}>Cancelled Tiffin List</Text>
					</TouchableOpacity>
				</View>
				
				<View style={styles.requestRow}>
					<TouchableOpacity onPress={() => handleRequestClick('BillingCycle')}>
						<Text style={styles.requestItemTextColor}>Billing Cycle</Text>
					</TouchableOpacity>
				</View>

				<Text style={styles.requestPanelTitle}>Other Options</Text>
				<View style={styles.requestRow}>
					<TouchableOpacity onPress={() => handleRequestClick('Ticket')}>
						<Text style={styles.requestItemTextColor}>Add Ticket</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.requestRow}>
					<TouchableOpacity onPress={() => handleRequestClick('Plan')}>
						<Text style={styles.requestItemTextColor}>Change Plan</Text>
					</TouchableOpacity>
				</View>	
				<View style={styles.requestRow}>
					<TouchableOpacity onPress={() => handlePlanRenew()}>
						<Text style={styles.requestItemTextColor}>Renew Plan</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.requestRow}>
					<TouchableOpacity onPress={() => handleRequestClick('')}>
						<Text style={styles.requestItemTextColor}>Terms & conditions</Text>
					</TouchableOpacity>
				</View>
			</View>
			<Dialog 
				visible={cancelConfirm}
				closeDialog={() => {
					setCancelConfirm(false);
					setMultiple(false);
				}}
			>
				<View>
					<Image style={{ height: 200, width: '100%'}} source={mapper.tifinBanner.source} />
				</View>
				<Text style={styles.cancelDialogTifinText}>CANCEL TIFFIN FOR A {multiple && 'MULTIPLE'} DAY</Text>
				<View style={[styles.dialogButton]}>
					<Button label="YES" onClick={handleCancelConfirm} />
				</View>
			</Dialog>
			{renderSuccessDialog()}
		</Page>
	)
}

Request.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Request',
	}
}

const styles = StyleSheet.create({
	requestContainer: {
		marginLeft: '10%',
		marginRight: '10%',
		paddingTop: 30,
	},
	requestRow: {
		backgroundColor: '#fff',
		padding: 12,
		borderBottomColor: '#545454',
		borderBottomWidth: 0.2,
	},
	requestItemTextColor: {
		color: '#a73965',
	},
	requestPanelTitle: {
		marginTop: 25,
		marginBottom: 5,
		marginLeft: 10,
		color: '#fff'
	},
	cancelDialogTifinText: {
		color: '#ed3851',
		fontSize: 18,
		alignSelf: 'center',
		textAlign: 'center',
	},
	dialogButton: {
		marginTop: 25,
		paddingBottom: 15,
	},
	successTitle: {
		color: 'green',
		fontSize: 22,
		fontWeight: 'bold',
		alignSelf: 'center',
	},
	successText: {
		fontSize: 15,
		alignSelf: 'center',
		fontWeight: 'bold',
		color: 'green',
		textAlign: 'center',
		marginTop: 15,
	},
})

export default Request;
