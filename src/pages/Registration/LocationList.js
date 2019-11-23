import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, FlatList } from 'react-native';
import Page from './../Page';
import GradiantScreen from '../GradiantScreen';
import imageMapper from '../../images/imageMapper';
import Service from './../../services/http';

const service = new Service();
function AreaList(props) {
	const {navigation} = props;
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);

	function closeMenu() {
		setDish(null);
	}

	useEffect(() => {
		service.get(`AreaListWithLocation`).then(res => {
			console.log('res', res);
			if(res.Status === '1') {
				const list = res.Body || [];
				console.log(list);
				setLoading(false);
				setList(list);
			} else {
				setLoading(false);
			}
		})
	}, []);
	console.log('list', list);
	function renderItem(item) {
		return (
			<View style={styles.menuListItemContainer}>
				<View style={styles.itemSection}>
					<Text style={styles.menuTitle}>{item.areaName}</Text>
				</View>
				<View style={styles.itemSection}>
					<Text style={styles.menuDescriptionText}>{item.location}</Text>
				</View>
			</View>
		)
	}

	return (
		<Page {...props}>
			<ScrollView>
				<View style={styles.menuList}>
					{
						loading ?
						<View style={styles.loaderWrapper}>
							<ActivityIndicator style={styles.loader} size="large" />
						</View>
						:
						<FlatList 
							data={list}
							renderItem={({ item }) => renderItem(item)}
							keyExtractor={(item, index) => `${index}`}
							ListEmptyComponent={!loading && !list.length && <Text style={styles.emptyList}>No Area found</Text>}
						/>
					}
				</View>
			</ScrollView>
		</Page>
	)
}

AreaList.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Locations',
	}
}

const styles = StyleSheet.create({
	menuListItemContainer: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#fff',
		padding: 10,
		marginBottom: 15,
		borderRadius: 2,
	},
	menuTitle: {
		fontWeight: 'bold',
		fontSize: 14
	},
	menuDescriptionText: {
		fontSize: 11,
	},
	actionView: {
		width: 30, 
		height: 30,
		alignSelf: 'flex-end',
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
	},
	itemSection: {
		marginBottom: 2
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
	menuHeader: {
		marginBottom: 2,
	}
})

export default AreaList;
