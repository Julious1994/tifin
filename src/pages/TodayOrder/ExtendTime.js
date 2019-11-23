import React, {useState} from 'react';
import { View, Text, StyleSheet, Alert, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import Page from './../Page';
import Service from './../../services/http';
import Button from './../../components/Button';
import Dialog from './../Request/Dialog';
import moment from 'moment';
import useUser from './../../userStore';


const service = new Service();

const collectingTimeFormat='YYYY/MM/DD hh:mm:ss A';

function ExtendTime(props) {
		const { navigation} = props;
		const fetchTifin = navigation.getParam('fetchTifin');
		const [order, setOrder] = useState(navigation.getParam('order'))
		const [minute,setMinute] = useState();
		const [modal, setModal] = useState(false);
		const [user] = useUser();

		function handleExtendTime() {
			return (
				<Dialog 
					visible={modal}
					closeDialog={() => setModal(false)}
				>
					<View style={{ marginTop: 25, marginBottom: 25}}>
						<TextInput 
							value={minute}
							onChangeText={setMinute}
							placeholder="Minutes"
							keyboardType={"number-pad"}
						/>
						<View style={[styles.dialogButton]}>
							<Button label="Extend" onClick={() => extendTime()} />
						</View>
					</View>
				</Dialog>
			)
		}
		function extendTime() {
			service.get(`ExtendTime?id=${order.id}&minute=${minute}`).then(res => {
				order.collectingTime = moment(order.collectingTime).add(minute, 'minutes').format(collectingTimeFormat);
				fetchTifin && fetchTifin();
				setOrder(order);
				setModal(false);
				Alert.alert('Extend Time', res.Body);
			});
		}
		console.log(order.collectingTime);
		return(
			<Page {...props}>
				<View style={styles.menuListItemContainer}>
					<View style={styles.itemSection}>
						<Text style={[styles.menuTitle]}>Name:</Text>
						<Text style={styles.menuDescriptionText}>{order.deliveryBoyname}</Text>								
					</View>
					<View style={styles.itemSection}>
						<Text style={[styles.menuTitle]}>Mobile:</Text>
						<Text style={styles.menuDescriptionText}>{order.mobile}</Text>
					</View>
					<View style={styles.itemSection}>
						<Text style={[styles.menuTitle]}>Quantity:</Text>
						<Text style={styles.menuDescriptionText}>{order.quantity}</Text>
					</View>
					<View style={styles.itemSection}>
						<Text style={[styles.menuTitle]}>Collecting Time:</Text>
						<Text style={styles.menuDescriptionText}>{order.collectingTime ? moment(order.collectingTime).format(collectingTimeFormat) : '-'}</Text>
					</View>
					<View style={[styles.cancelButton]}>
						<Button label="Extend time" onClick={() => setModal(true)} />
					</View>
				</View>
				{handleExtendTime()}
			</Page>
		);
}

ExtendTime.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Delivery Schedule',
	}
}

const styles = StyleSheet.create({
	menuListItemContainer: {
		display: 'flex',
		flexDirection: 'column',
		margin: 20,
		marginBottom: 15,
		marginTop: 50,
	},
	menuTitle: {
		fontWeight: 'bold',
		fontSize: 14,
		display: 'flex',
		flexDirection: 'row',
		width: '40%',
	},
	menuDescriptionText: {
		color: '#fff',
	},
	menuList: {
		marginLeft: 25,
		marginRight: 25,
		marginTop: 15,
	},
	itemSection: {
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: 'black',
		display: 'flex',
		flexDirection: 'row',
		paddingBottom: 5,
		paddingTop: 5,
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
	cancelButton: {
		marginTop: 50,
	},
	dialogButton: {
		marginTop: 15
	}
})

export default ExtendTime;
