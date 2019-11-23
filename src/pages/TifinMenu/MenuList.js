import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Page from './../Page';
import GradiantScreen from '../GradiantScreen';
import imageMapper from '../../images/imageMapper';
import Service from './../../services/http';

const service = new Service();
function MenuList(props) {
	const { navigation } = props;
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		service.get('MenuList').then(async res => {
			if (res.Status === '1') {
				const list = res.Body || [];
				setLoading(false);
				setList(list);
			} else {
				setLoading(false);
			}
		})
	}, []);

	function handleMenuClick(menu) {
		navigation.push('DishList', { menu });
	}
	console.log('list', list);
	return (
		<Page {...props}>
			<ScrollView>
				<View style={styles.menuList}>
					{
						!loading && !list.length &&
						<Text style={styles.emptyList}>No menu found</Text>
					}
					{
						loading ?
							<View style={styles.loaderWrapper}>
								<ActivityIndicator style={styles.loader} size="large" />
							</View>
							:
							<React.Fragment>
								{
									list.map((item, i) => (
										<TouchableOpacity key={i} style={styles.menuListItemContainer} onPress={() => handleMenuClick(item)}>
											<Text style={styles.menuTitle}>{item.mealType}</Text>
										</TouchableOpacity>
									))
								}
							</React.Fragment>
					}
				</View>
			</ScrollView>
		</Page>
	)
}

MenuList.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'MenuList',
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
		marginBottom: 10
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

export default MenuList;
