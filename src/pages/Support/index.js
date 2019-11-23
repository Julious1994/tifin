import React, { useState } from 'react';
import { View, Text, Picker, StyleSheet } from 'react-native';
import Page from './../Page';
import Button from './../../components/Button';
import Input from './../../components/Input';

function Support(props) {
	const [support, setSupport] = useState({});

	function handleChange(key, value) {
		setSupport({ ...support, [key]: value });
	}

	function handleClick() {
		console.log('click');
	}

	return (
		<Page {...props}>
			<View style={styles.container}>
				<View style={styles.fieldContainer}>
					<Picker
						selectedValue={support.supportType || ''}
						onValueChange={(e) => handleChange('supportType', e)}
					>
						<Picker.Item label="Support" value={''} />
						<Picker.Item label="Cash" value="CASH" />
						<Picker.Item label="Online" value="ONLINE" />
					</Picker>
				</View>
				<View style={styles.fieldContainer}>
					<Input
						value={support.message}
						onChange={(val) => handleChange('message', val)}
						placeholder="Message"
						placeholderTextColor="#545454"
						multiline={true}
        		numberOfLines={4}
					/>
				</View>
				<View style={styles.buttonView}>
					<Button label="SUBMIT" onClick={handleClick} />
				</View>
			</View>
		</Page>
	)
}

Support.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: 'Support',
	}
}

const styles = StyleSheet.create({
	container: {
		marginLeft: 25,
		marginRight: 25,
		marginTop: '10%',
	},
	buttonView: {
		marginTop: '40%',
	},
	fieldContainer: {
		paddingBottom: 15,
	}
});

export default Support;
