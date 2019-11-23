import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import moment from 'moment';
import Page from './../Page';
import useUser from '../../userStore';
import Service from './../../services/http';
const service = new Service();

function BilingHistory(props) {
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [user] = useUser();

	const [tabIndex, setTabIndex] = React.useState('Pending');
	
	function handleRequestClick(routeName) {
		const { navigation } = props;
		navigation.navigate(routeName);
	}

	function changeTab(index) {
		setTabIndex(index);
	}

	function renderItem(item) {
		console.log(item, item.amount)
		return(
			<View style={styles.itemWrapper}>
				<View style={styles.itemRow}>
					<Text style={styles.itemTitleText}>Amount: </Text>
					<Text style={styles.itemTitleText}>{item.amount}</Text>
				</View>
				<View style={styles.itemRow}>
					<Text style={styles.itemTitleText}>Paid on: </Text>
					<Text style={styles.itemTitleText}>{moment(item.paymentDate).format('DD-MM-YYYY')}</Text>
				</View>
				<View style={styles.itemRow}>
					<Text>Paid in {item.paymentType}</Text>
				</View>
			</View>
		)
	}

	function getFilteredList() {
		if(tabIndex === 'Pending') {
			return list.filter(item => item.status === 'Pending');
		} else {
			return list.filter(item => item.status === 'Complete');
		}
	}

	useEffect(() => {
		const id = user.customerId
		console.log('user', user);
		if(id) {
			service.get(`BillingHistory?customerId=${id}`).then(res => {
				console.log('res', res);
				setLoading(false);
				if(res.Status === '1') {
					setList(res.Body);
				}
			});
		}
	}, [user]);

	return (
		<Page {...props}>
			<View style={styles.container}>
				<View style={styles.tabViewWrapper}>
					<TouchableOpacity onPress={() => changeTab('Pending')}>
						<View style={[styles.tabItemWrapper, {...(tabIndex === 'Pending' && styles.activeTabWrapper)}]}>
							<Text style={[styles.tabText, {...(tabIndex === 'Pending' && styles.activeTabText)}]}>PENDING</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => changeTab('Complete')}>
						<View style={[styles.tabItemWrapper, {...(tabIndex === 'Complete' && styles.activeTabWrapper)}]}>
							<Text style={[styles.tabText, {...(tabIndex === 'Complete' && styles.activeTabText)}]}>COMPLETE</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ marginTop: 10, height: '90%'}}>
					{
						loading ?
						<View style={styles.loaderWrapper}>
							<ActivityIndicator style={styles.loader} size="large" />
						</View>
						:
						<FlatList 
							data={getFilteredList(list)}
							renderItem={({ item }) => renderItem(item)}
							keyExtractor={(item, index) => `${index}`}
							ListEmptyComponent={<Text style={styles.emptyList}>No bill history found</Text>}
						/>
					}
				</View>
			</View>
		</Page>
	)
}

BilingHistory.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Biling History',
	}
}

const styles = StyleSheet.create({
	container: {
		marginLeft: '10%',
		marginRight: '10%',
		marginTop: 10,
	},
	tabViewWrapper: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	tabItemWrapper: {
		padding: 10,
	},
	tabText: {
		fontWeight: 'bold',
	},
	activeTabText: {
		color: '#fff',
	},
	activeTabWrapper: {
		borderBottomColor: '#a73965',
		borderBottomWidth: 2,
	},
	itemWrapper: {
		backgroundColor: '#fff',
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 7,
		paddingBottom: 10,
		marginBottom: 15,
	},
	itemTitleText: {
		fontSize: 15,
		fontWeight: 'bold',
	},
	subItemText: {
		fontSize: 15,
		fontWeight: 'bold',
	},
	itemRow: {
		display: 'flex',
		flexDirection: 'row',
	},
	emptyList: {
		fontWeight: 'bold',
		alignSelf: 'center',
		marginTop: 10,
		color: '#fff',
	},
	loaderWrapper: {
		height: 200,
	},
	loader: {
		marginTop: '10%',
	},
})

export default BilingHistory;
