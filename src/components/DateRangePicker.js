import React, {useState, useEffect} from 'react';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';


export default function DateRangePicker(props) {
	const { onSuccess } = props;
	const [range, setRange] = useState(props.range || []);
	const minDate = new Date();

	useEffect(() => {
		setRange(props.range || []);
	},[props.range])

	function formatDate(date) {
		return moment(date).format('YYYY-MM-DD');
	}

	function onDateChange(value, type) {
		if(type === 'END_DATE') {
			const newRange = range;
			newRange[1] = value;
			setRange(newRange);
			onSuccess && onSuccess(formatDate(newRange[0]), formatDate(newRange[1]));
		} else {
			const newRange = range;
			newRange[0] = value;
			setRange(newRange);
		}
	}

	return (
		<CalendarPicker
			allowRangeSelection={true}
			minDate={minDate}
			selectedStartDate={range ? range[0] : ''}
			selectedEndDate={range ? range[1] : ''}
			todayBackgroundColor="#f2e6ff"
			selectedDayColor="#86d7fb"
			selectedDayTextColor="#FFFFFF"
			onDateChange={onDateChange}
		/>
	)
}
