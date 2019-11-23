import React from 'react';
import { Platform, DatePickerIOS, Button, Text, View, DatePickerAndroid, TouchableNativeFeedback } from 'react-native';
import moment from 'moment';
import Modal from "react-native-modal";

class DatePicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      iosDate: new Date(),
    };
    this.setDate = this.setDate.bind(this);
  }

  onCalendarOpen() {
    if(Platform.OS === 'ios') {
      this.setState({ showModal: true });
    } else if(Platform.OS === 'android') {
      this.openAndroidPicker();
    }
  }

  async openAndroidPicker() {
    const { onChange, value } = this.props;
    try {
      const newDate = await DatePickerAndroid.open({
        date: new Date(value)
      });
      if (newDate.action !== DatePickerAndroid.dismissedAction) {
        onChange(moment(`${newDate.year}-${newDate.month + 1}-${newDate.day}`, "YYYY-MM-DD").format("YYYY-MM-DD"))
      }
    } catch ({code, message}) {
      console.warn('Cannot open datepicker', message);
    }
  }

  setDate(newDate) {
    this.setState({ iosDate: newDate });
  }

  hideDatePicker() {
    const { iosDate } = this.state;
    this.setState({ showModal: false });
    if(this.props.onChange) {
      this.props.onChange(iosDate);
    }
  }

  renderIosDatePicketModal() {
    return (
      <Modal isVisible={this.state.showModal} onModalHide={() => console.log('hide')}>
        <View style={{ flex: 1 }}>
          <DatePickerIOS
            date={this.state.iosDate}
            onDateChange={this.setDate}
          />
          <TouchableNativeFeedback onPress={() => this.hideDatePicker()}>
            <Text>Hide me!</Text>
          </TouchableNativeFeedback>
        </View>
      </Modal>
    )
  }

  render() {
    const { value } = this.props;
    return(
      <View style={{ padding: 5, borderBottomColor: 'white', borderBottomWidth: 2 }}>
        {this.renderIosDatePicketModal()}
        <TouchableNativeFeedback onPress={() => this.onCalendarOpen()}>
          <View style={{ display: 'flex', flexDirection: 'row'}}>
              <Text style={{ flex: 1, color: '#fff'}}>{moment(value).format("DD/MM/YYYY")}</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

export default DatePicker;
