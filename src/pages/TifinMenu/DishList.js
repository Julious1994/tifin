import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Page from './../Page';
import GradiantScreen from '../GradiantScreen';
import imageMapper from '../../images/imageMapper';
import Service from './../../services/http';

const service = new Service();
function DishList(props) {
	const {navigation} = props;
	const menu = navigation.getParam('menu');
	const dishList = menu.dishList;
	const [list, setList] = useState([]);
	const [dish, setDish] = useState(null);
	const [loading, setLoading] = useState(true);

	function renderMenuDetails() {
		return(
			<View style={styles.menuListItemContainer}>
				<Image source={{ uri: `${service.domain}${dish.image}`}} style={{ height: 175, width: 200, alignSelf: 'center'}} />
				<View style={styles.itemSection}>
					<Text style={[styles.menuTitle, { textAlign: 'center'}]}>{dish.title}</Text>
				</View>
				<View style={[styles.itemSection]}>
					<Text style={styles.menuDescriptionText}>{dish.description}</Text>
				</View>
				<View style={[styles.itemSection]}>
					<Text style={[styles.menuTitle, styles.menuHeader]}>Category:</Text>
					<Text style={styles.menuDescriptionText}>{dish.name}</Text>
				</View>
				<View style={[styles.itemSection]}>
					<Text style={[styles.menuTitle, styles.menuHeader]}>Calorie:</Text>
					<Text style={styles.menuDescriptionText}>{dish.calorie}</Text>
				</View>
				<View>
					<Text style={[styles.menuTitle, styles.menuHeader]}>Recipe:</Text>
					<Text style={styles.menuDescriptionText}>{dish.description}</Text>								
				</View>
				<View style={styles.itemSection}>
					<Text style={[styles.menuTitle, styles.menuHeader]}>Ingredients:</Text>
					<Text style={styles.menuDescriptionText}>{dish.ingredients}</Text>
				</View>
				<View style={styles.actionView}>
					<TouchableOpacity onPress={() => closeMenu()}>
						<GradiantScreen>
							<Image style={styles.eyeIcon} source={imageMapper.cancel.source} />
						</GradiantScreen>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	function closeMenu() {
		setDish(null);
	}

	function handleShowDetails(item) {
		setLoading(true);
		service.get(`DishDetailById?dishId=${item.dishId}`).then(res => {
			console.log(res);
			if(res.Status === '1') {
				setDish(res.Body[0]);
			} else {
				Alert.alert('Dish', res.Body);
			}
			setLoading(false);
		});

	}

	useEffect(() => {
		service.get(`DishDishListById?dishList=${dishList}`).then(res => {
			console.log('res', res);
			if(res.Status === '1') {
				const itemList = []
				const list = res.Body || [];
				// for(let i=0; i< list.length; i++) {
				// 	const item = list[i];
				// 	console.log('llll', item);
				// 	const resp = await service.get(`DishDishListById?dishList=${item.dishList}`);
				// 	console.log('resp', resp);
				// 	if(resp.Status === '1') {
				// 		itemList.push(...resp.Body);
				// 	}
				// }
				console.log(list);
				setLoading(false);
				setList(list);
			} else {
				setLoading(false);
			}
		})
	}, [dishList]);
	console.log('list', list);
	return (
		<Page {...props}>
			<ScrollView>
				<View style={styles.menuList}>
					{
						!loading && !list.length &&
						<Text style={styles.emptyList}>No dish found</Text>
					}
					{
						loading ?
						<View style={styles.loaderWrapper}>
							<ActivityIndicator style={styles.loader} size="large" />
						</View>
						:
						<React.Fragment>
							{
								dish ?
									renderMenuDetails()
								:
									list.map((item, i) => (
										<View key={i} style={styles.menuListItemContainer}>
											<View style={styles.itemSection}>
												<Text style={styles.menuTitle}>{item.title}</Text>
											</View>
											<View style={styles.itemSection}>
												<Text style={styles.menuDescriptionText}>{item.description}</Text>
											</View>
											<View style={styles.actionView}>
												<TouchableOpacity onPress={() => handleShowDetails(item)}>
													<GradiantScreen>
														<Image style={styles.eyeIcon} source={imageMapper.eye.source} />
													</GradiantScreen>
												</TouchableOpacity>
											</View>
										</View>
									))
							}
						</React.Fragment>
					}
				</View>
			</ScrollView>
		</Page>
	)
}

DishList.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Dishes',
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

export default DishList;
