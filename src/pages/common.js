export function getInclude(item) {
	let text = '';
	if(item.breakfastInclude) {
		text = `${text}${text !== '' ? ',' : ''} Breakfast`;
	}
	if(item.lunchInclude) {
		text = `${text}${text !== '' ? ',' : ''} Lunch`;
	}
	if(item.teaInclude) {
		text = `${text}${text !== '' ? ',' : ''} Tea`;
	}
	if(item.dinnerInclude) {
		text = `${text}${text !== '' ? ',' : ''} Dinner`;
	}
	return text;
}
