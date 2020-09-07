import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { Input, Icon, Divider } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons"
import SelectableVehicle from "../../components/vehicles/SelectableVehicle";
import SelectedVehicle from "../../components/vehicles/SelectedVehicle"
import AwsData from "../../shared/AwsData";

const MAX_LOAD = 15;
const SEARCH_PATTERN = /^[a-z0-9]+\s*(<=|>=|=|!=|<|>)\s*[+-]?\d+(\.\d+)?$/;
const KEY_PATTERN = /^[a-z0-9]+/g;
const OP_PATTERN = /(<=|>=|=|!=|<|>)/g;
const VALUE_PATTERN = /[+-]?\d+(\.\d+)?$/g;

class VehicleSelectionScreen extends Component {
  constructor(props) {
    super(props);
    props.navigation.setOptions({
      // headerLeft: () => (
      //   <TouchableOpacity
      //     style={styles.headerLeftTouchable}
      //     onPress={this.goBack}
      //   >
      //     <Ionicons name="ios-close" color="white" size={45} style={{ width: 45, height: 45 }} />
      //   </TouchableOpacity>
      // ),
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerRightTouchable}
          onPress={this.updateSelectedVehicles}
        >
          <Text style={styles.done}>Done</Text>
        </TouchableOpacity>
      ),
      title: 'Select Vehicles',
    });
    this.vehicles = new AwsData().vehicles;
    this.state = {
      searchValue: "",
      availableVehicles: this.vehicles,
      selectedVehicleIds: [],
      selectedVehicles: []
    };
  }

  componentDidMount() {
    this.setState(this.props.route.params);
  }

  goBack = () => {
    this.props.navigation.navigate(this.state.screen);
  };

  updateSelectedVehicles = () => {
    const { selectedVehicleIds, selectedVehicles } = this.state;
    this.props.navigation.navigate(this.state.screen, {
      selectedVehicleIds,
      selectedVehicles,
      totalLoad: this.getLoad(),
    });
  };

  addVehicle = vehicle => {
    const vehicleLoad = vehicle.load;
    const load = this.getLoad();

    if (load + vehicleLoad > MAX_LOAD) {
      return;
    }

    const vehicleId = vehicle.id;
    const index = this.state.selectedVehicleIds.indexOf(vehicleId);

    if (index === -1) {
      this.setState(prevState => ({
        selectedVehicleIds: [...prevState.selectedVehicleIds, vehicleId],
        selectedVehicles: [...prevState.selectedVehicles, { ...vehicle, quantity: 1 }]
      }));
    }
    else {
      this.setState(prevState => {
        const selectedVehicles = JSON.parse(JSON.stringify(prevState.selectedVehicles));
        selectedVehicles[index]["quantity"] = prevState.selectedVehicles[index].quantity + 1;
        return { selectedVehicles };
      });
    }
  };

  removeVehicle = index => {
    const vehicle = this.state.selectedVehicles[index];

    if (vehicle.quantity > 1) {
      this.setState(prevState => {
        const selectedVehicles = JSON.parse(JSON.stringify(prevState.selectedVehicles));
        selectedVehicles[index]["quantity"] = prevState.selectedVehicles[index].quantity - 1;
        return { selectedVehicles };
      });
    }
    else {
      this.removeAllVehicleQuantity(index);
    }
  };

  removeAllVehicleQuantity = index => {
    this.setState(prevState => {
      const selectedVehicleIds = JSON.parse(JSON.stringify(prevState.selectedVehicleIds));
      const selectedVehicles = JSON.parse(JSON.stringify(prevState.selectedVehicles));

      selectedVehicleIds.splice(index, 1);
      selectedVehicles.splice(index, 1);

      return { selectedVehicleIds, selectedVehicles };
    });
  };

  getLoad = () => {
    const reducer = (accumulator, vehicle) => accumulator + vehicle.quantity * vehicle.load;
    const load = this.state.selectedVehicles.reduce(reducer, 0);
    return Math.round(load * 10) / 10;
  };

  searchVehicle = text => {
    const lowerCaseText = text.toLowerCase().trim();
    let predicate;

    if (SEARCH_PATTERN.test(lowerCaseText)) {
      const key = lowerCaseText.match(KEY_PATTERN)[0];
      const operator = lowerCaseText.match(OP_PATTERN)[0];
      const inputValue = parseFloat(lowerCaseText.match(VALUE_PATTERN)[0]);

      predicate = vehicle => {
        const value = vehicle[key];
        let condition;

        switch (operator) {
          case "<":
            condition = value < inputValue;
            break;
          case ">":
            condition = value > inputValue;
            break;
          case "<=":
            condition = value <= inputValue;
            break;
          case ">=":
            condition = value >= inputValue;
            break;
          case "=":
            condition = value === inputValue;
            break;
          case "!=":
            condition = value !== inputValue;
            break;
          default:
            condition = true;
            break;
        }

        return condition;
      };
    }
    else {
      predicate = vehicle => vehicle.name.toLowerCase().indexOf(lowerCaseText) !== -1;
    }

    this.setState({
      searchValue: text,
      availableVehicles: this.vehicles.filter(predicate)
    });
  };

  render() {
    const {
      searchValue,
      availableVehicles,
      selectedVehicles
    } = this.state;

    return (
      <>
        <Input
          leftIcon={
            <Icon
              type="ionicon"
              name="ios-search"
              color="#4e4e4e"
              size={30}
              iconStyle={styles.searchIcon}
            />
          }
          placeholder="Search Vehicles"
          placeholderTextColor="#b1b1b1"
          value={searchValue}
          leftIconContainerStyle={styles.searchIconContainer}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          inputStyle={styles.searchInput}
          onChangeText={text => this.searchVehicle(text)}
        />
        <ScrollView style={styles.screen}>
          <View style={styles.load}>
            <Text>{this.getLoad()}/{MAX_LOAD}</Text>
          </View>
          <ScrollView
            horizontal={true}
            style={styles.selectedVehicles}
          >
            {
              selectedVehicles.map((vehicle, index) => (
                <SelectedVehicle
                  key={vehicle.id}
                  vehicle={vehicle}
                  index={index}
                  onPress={this.removeVehicle}
                  onLongPress={this.removeAllVehicleQuantity}
                />
              ))
            }
          </ScrollView>
          <Divider style={styles.divider} />
          {
            availableVehicles.length > 0 ?
              availableVehicles.map(vehicle => (
                <SelectableVehicle
                  key={vehicle.id}
                  vehicle={vehicle}
                  onPress={this.addVehicle}
                />
              ))
              :
              <Text style={styles.noVehiclesFoundText}>No vehicles found</Text>
          }
        </ScrollView>
      </>
    );
  }
}

export default VehicleSelectionScreen;

const styles = StyleSheet.create({
  headerLeftTouchable: {
    marginLeft: 15
  },
  headerRightTouchable: {
    marginRight: 15
  },
  done: {
    fontSize: 15,
    color: 'white'
  },
  screen: {
    padding: 20,
    backgroundColor: "#fff"
  },
  searchIconContainer: {
    marginLeft: 0
  },
  searchIcon: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: 0,
    backgroundColor: "#f0f0f0",
  },
  searchInputContainer: {
    paddingLeft: 15,
    borderBottomColor: "#dadada",
  },
  searchInput: {
    paddingHorizontal: 7,
    paddingVertical: 15,
  },
  load: {
    marginBottom: 10,
    alignItems: "flex-end"
  },
  selectedVehicles: {
    height: 100,
    flexDirection: "row"
  },
  divider: {
    height: 2,
    marginVertical: 10,
    backgroundColor: "#f3f3f3"
  },
  noVehiclesFoundText: {
    paddingVertical: 15,
    alignSelf: "center",
    fontSize: 20
  }
});
