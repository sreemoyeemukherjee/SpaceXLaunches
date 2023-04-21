import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Button, Pressable } from "react-native";
import { Table, Row, Rows } from 'react-native-table-component';

class MyComponent extends Component {
  constructor() {
    super();
    this.state = {
      jsonData: [],
      show: false,
      showAboutMe: false,
    };
  }

  componentDidMount() {
    fetch('https://api.spacexdata.com/v5/launches')
      .then(response => response.json())
      .then(data => this.setState({ jsonData: data.filter(item => item.upcoming === true) }))
      .catch(error => console.log(error));
  }
  onPress = rowData => {
    this.setState({
      show: true,
      selectedRowData: rowData,
    });
  };
  onPressAboutMe = () => {
    this.setState({
      showAboutMe: true,
    });
  };
  render() {
    const { jsonData } = this.state;
    const tableHead = ['Rocket Name', 'Rocket ID', 'Flight Number', 'Launch Date', 'Crew on board'];
    const widthArr = [80, 80, 80, 80, 80];
    const convertUTCtoLocalTime = utcDateTime => {
      const localDateTime = new Date(utcDateTime);
      return localDateTime.toString();
    };
    function getCrewNames(crewArray) {
      const values = crewArray
        .map(item => item["role"])
        .join('\n');
      return values ? values : 'No crew' ;
    }

    const tableData = jsonData.map(item => [item.name, item.rocket, item.flight_number, convertUTCtoLocalTime(item.date_utc), getCrewNames(item.crew),
      item.details?? 'N/A', item.fairings?.reused?? '', item.fairings?.recovery_attempt?? '', item.fairings?.recovered?? '']);
    return (
      <View style={tablestyles.container}>
        <Text style={tablestyles.titleText}>
          SpaceX Launches
          {'\n'}
        </Text>
        <Pressable style={styles.button} onPress={this.onPressAboutMe}>
          <Text style={styles.text}>About Me{'\n'}</Text>
        </Pressable>
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderWidth: 1, borderColor: '#000'}}>
              <Row
                data={tableHead}
                widthArr={widthArr}
                style={tablestyles.header}
                textStyle={tablestyles.text}
              />
            </Table>
            <ScrollView style={tablestyles.dataWrapper}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#000'}}>
                {tableData.map((rowData, index) => (
                  <TouchableOpacity style={tablestyles.row} onPress={() => this.onPress(rowData)}>
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={widthArr}
                      style={tablestyles.row}
                      textStyle={tablestyles.text}
                    />
                  </TouchableOpacity>
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
        <Modal transparent={false} visible={this.state.show}>
          <ScrollView>
            <View style={{backgroundColor: 'ffffff', margin:50, padding: 20, borderRadius: 10, flex: 1}}>
              <Text style={{fontSize: 20, color: '#20232a', padding: 10}}>Rocket Name: {this.state.selectedRowData ? this.state.selectedRowData[0] : ''}</Text>
              <Text style={{fontSize: 20, color: '#20232a', padding: 10}}>Rocket ID: {this.state.selectedRowData ? this.state.selectedRowData[1] : ''}</Text>
              <Text style={{fontSize: 20, color: '#20232a', padding: 10}}>Launch Date: {this.state.selectedRowData ? this.state.selectedRowData[3] : ''}</Text>
              <Text style={{fontSize: 20, color: '#20232a', padding: 10}}>Mission Details: {this.state.selectedRowData ? this.state.selectedRowData[5] : ''}</Text>
              <Text style={{fontSize: 20, color: '#20232a', padding: 10}}>Crew on board: {this.state.selectedRowData ? this.state.selectedRowData[4] : ''}</Text>
              <Text style={{fontSize: 20, color: '#20232a', padding: 10, textDecorationLine: 'underline'}}>Rocket Status:- </Text>
              <Text style={{fontSize: 20, color: '#20232a', padding: 10}}>Reused: {this.state.selectedRowData ? (this.state.selectedRowData[6] ? 'True' : 'False') : 'Not specified'}</Text>
              <Text style={{fontSize: 20, color: '#20232a', padding: 10}}>Recovery attempt: {this.state.selectedRowData? (this.state.selectedRowData[7] ? 'True' : 'False') : 'Not specified'}</Text>
              <Text style={{fontSize: 20, color: '#20232a', padding: 10}}>Recovered: {this.state.selectedRowData? (this.state.selectedRowData[8] ? 'True' : 'False') : 'Not specified'}</Text>
              <Button title="Hide details" onPress={() => this.setState({show: false})} />
            </View>
          </ScrollView>
        </Modal>
        <Modal transparent={false} visible={this.state.showAboutMe}>
          <View style={{backgroundColor: 'ffffff'}}>
            <Text style={{fontSize: 20, color: '#20232a', padding: 10}}>Name: Sreemoyee Mukherjee</Text>
            <Text style={{fontSize: 20, color: '#20232a', padding: 10}}>Phone Number: +1 (412) 909-5956</Text>
            <Text style={{fontSize: 20, color: '#20232a', padding: 10}}>Email ID: sreemoym@andrew.cmu.edu</Text>
            <Button title="Hide details" onPress={() => this.setState({showAboutMe: false})} />
          </View>
        </Modal>
      </View>
    );
  }
}
const tablestyles = StyleSheet.create({
  titleText: {
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  container: {flex: 1, padding: 5, paddingTop: 10, backgroundColor: '#fff'},
  header: {height: 50, backgroundColor: '#f1f8ff'},
  text: {textAlign: 'center', color: '#000', fontWeight: 'bold'},
  dataWrapper: {marginTop: -1},
  row: {height: 90, backgroundColor: '#fff', borderColor: '#000', borderWidth: 1},
});
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
    textDecorationLine: 'underline'
  },
});
export default MyComponent;
