import moment from "moment";
import Gateway from './Gateway';
import Guideline from '../models/Guideline';
import Purpose from "../models/Purpose";
import Route from "../models/Route";
import Vehicle from "../models/Vehicle";
import User, { UserRoles, UserDevice } from '../models/User';
import Schedule from "../models/Schedule"
import Booking, { BookingStatus, BookingTypes, ServiceProviderTypes } from "../models/Booking";
import Announcement from "../models/Announcement";
import Notification from "../models/Notification";
import CryptoJS from 'crypto-js';
import { Alert } from 'react-native'

class AwsData {
  static user = {};
  static userDevice = {};

  unitBookingsResultArray;
  unitBookingsHomeArray;
  unitBookingsUpcomingArray;
  unitBookingsPendingArray;
  unitBookingsRejectedArray;
  unitBookingsPastArray;

  spBookingsCalendar;
  spBookingsHome;
  spBookingsFixed;
  spBookingsOOS;
  spBookingsAdHoc;

  dpBookingsHomeArray;

  adminBookingsPendingAllArray;
  adminBookingsPendingFixedArray;
  adminBookingsPendingAdHocArray
  adminBookingsPendingOOSArray
  adminBookingsAllArray;

  // NOTE Need to change this to a factory function if properties need to be private
  constructor() {
    if (!AwsData.instance) {
      this.guidelines = [];
      this.purposes = [];
      this.routes = [];
      this.bookingUnits = [];
      this.vehicles = [];
      this.authToken = '';
      AwsData.user = new User('', '');
      AwsData.userDevice = new UserDevice('', '');
      AwsData.instance = this;
    }

    return AwsData.instance;
  }

  fetchData() {
    this.fetchGuidelines();
    this.fetchPurposes();
    this.fetchRoutes();
    this.fetchVehicles();
    this.fetchSafUnit();
  }

  fetchGuidelines() {
    const Entities = require('html-entities').XmlEntities;
    const entities = new Entities();
    let error = false;

    // fetch(`${Gateway.URL}/ferryguideline?status=A`)
    fetch(`${Gateway.URL}/ferryguideline?status=A`, {
      headers: {
        Authorization: AwsData.user.accessToken,
      }
    })
      .then(result => {
        if (result.status == 401 || result.status == 403) {
          error = true;
          Alert.alert(
            "Authorisation Failed",
            "Please login again",
            [
              {
                text: 'OK'
              }
            ]
          )
        } else {
          return result.json()
        }
      })
      .then(guidelines => {
        if (error == false) {
          this.guidelines = guidelines.map(guideline => {
            guideline = entities.decode(JSON.stringify(guideline))
            guideline = JSON.parse(guideline)

            const {
              serviceProviderType,
              guidelines
            } = guideline;

            return new Guideline(serviceProviderType, guidelines);
          });

          Object.freeze(this.guidelines);
        }
      });
  };

  fetchPurposes() {
    const Entities = require('html-entities').XmlEntities;
    const entities = new Entities();
    let error = false;

    fetch(`${Gateway.URL}/purpose?status=A`, {
      headers: {
        Authorization: AwsData.user.accessToken,
      }
    })
      .then(result => {
        if (result.status == 401 || result.status == 403) {
          error = true;
          Alert.alert(
            "Authorisation Failed",
            "Please login again",
            [
              {
                text: 'OK'
              }
            ]
          )
        } else {
          return result.json()
        }
      })
      .then(purposes => {
        if (error == false) {
          if (purposes.body != undefined) {

            this.purposes = purposes.body.map(purpose => {
              purpose = entities.decode(JSON.stringify(purpose))
              purpose = JSON.parse(purpose)

              const {
                purposeId,
                purposeShort,
                purposeDesc,
                serviceProviderType
              } = purpose;

              return new Purpose(purposeId, purposeShort, purposeDesc, serviceProviderType);
            });
            Object.freeze(this.purposes);
          }
        }
      });
  }

  fetchRoutes() {
    const Entities = require('html-entities').XmlEntities;
    const entities = new Entities();
    let error = false;

    fetch(`${Gateway.URL}/route?status=all&serviceProviderType=all`, {
      headers: {
        Authorization: AwsData.user.accessToken,
      }
    })
      .then(result => {
        if (result.status == 401 || result.status == 403) {
          error = true;
          Alert.alert(
            "Authorisation Failed",
            "Please login again",
            [
              {
                text: 'OK'
              }
            ]
          )
        } else {
          return result.json()
        }
      })
      .then(routes => {
        if (error == false) {

          this.routes = routes.body.map(route => {
            route = entities.decode(JSON.stringify(route))
            route = JSON.parse(route)

            const {
              routeId,
              routeName,
              from,
              destination,
              serviceProviderType
            } = route;

            return new Route(routeId, routeName, from, destination, serviceProviderType);
          });

          Object.freeze(this.routes);
        }
      });
  }

  fetchSafUnit() {
    const Entities = require('html-entities').XmlEntities;
    const entities = new Entities();
    let error = false;

    fetch(`${Gateway.URL}/user/safunit`, {
      headers: {
        Authorization: AwsData.user.accessToken,
      }
    })
      .then(result => {
        if (result.status == 401 || result.status == 403) {
          error = true;
          Alert.alert(
            "Authorisation Failed",
            "Please login again",
            [
              {
                text: 'OK'
              }
            ]
          )
        } else {
          return result.json()
        }
      })
      .then(bookingUnit => {
        if (error == false) {

          this.bookingUnits = bookingUnit.body
          this.bookingUnits = entities.decode(JSON.stringify(this.bookingUnits))
          this.bookingUnits = JSON.parse(this.bookingUnits)

          console.log("API CALL: Fetch Saf Units: " + this.bookingUnits);

          Object.freeze(this.bookingUnits);
        }
      });
  }

  fetchVehicles() {
    const Entities = require('html-entities').XmlEntities;
    const entities = new Entities();
    let error = false;

    fetch(`${Gateway.URL}/vehicle?status=A`, {
      headers: {
        Authorization: AwsData.user.accessToken,
      }
    })
      .then(result => {
        if (result.status == 401 || result.status == 403) {
          error = true;
          Alert.alert(
            "Authorisation Failed",
            "Please login again",
            [
              {
                text: 'OK'
              }
            ]
          )
        } else {
          return result.json()
        }
      })
      .then(vehicles => {
        if (error == false) {
          console.log('API: Get Vehicles');
          this.vehicles = vehicles.body.map(vehicle => {
            vehicle = entities.decode(JSON.stringify(vehicle))
            vehicle = JSON.parse(vehicle)

            const {
              vehicleId,
              name,
              load
            } = vehicle;

            return new Vehicle(vehicleId, name, load);
          });

          Object.freeze(this.vehicles);
        }
      });
  }

  async loginAsync(username, password) {
    this.unitBookingsResultArray = undefined;
    this.unitBookingsHomeArray = undefined;
    this.unitBookingsUpcomingArray = undefined;
    this.unitBookingsPendingArray = undefined;
    this.unitBookingsRejectedArray = undefined;
    this.unitBookingsPastArray = undefined;

    this.adminBookingsAllArray = undefined;
    this.adminBookingsPendingAllArray = undefined;
    this.adminBookingsPendingFixedArray = undefined;
    this.adminBookingsPendingAdHocArray = undefined;
    this.adminBookingsPendingOOSArray = undefined;

    this.dpBookingsHomeArray = undefined;

    try {
      const raw = JSON.stringify({
        UserInfo: username,
        UserPass: password,
        Platform: AwsData.userDevice.platform,
        DeviceToken: AwsData.userDevice.deviceToken,
      })
      const encryptRaw = CryptoJS.AES.encrypt(raw, Gateway.SecretKey).toString()
      // console.log(encryptRaw)

      const response = await fetch(`${Gateway.URL}/user/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: encryptRaw
        })
      });
      console.log("API: Login")
      const json = await response.json();
      // console.log(JSON.stringify(json))

      if (json.statusCode == 200 && json.body.ChallengeName == undefined) {
        obj = JSON.parse(json.body);
        AwsData.user = new User(
          obj.userData.preferred_username,
          obj.keys.IdToken,
          obj.userData['custom:role'],
          obj.userData['custom:performanceRating'],
          obj.userData.given_name,
          obj.userData.family_name,
          obj.userData.email,
          obj.userData['custom:safUnit'],
          this.rating
        );
        await this.getSPaverageRating();
      }
      else if (json.statusCode == 200 && json.body.ChallengeName != undefined) {
        const firstTimeSession = json.body.Session
        console.log("API RESPONSE: First Time Login")
        return firstTimeSession;
      }
      else {
        AwsData.user = new User('', '', '');
      }
      return AwsData.user;
    }
    catch (error) {
      console.error(error);
    }
  }

  async loginEncrypted(username, password) {
    this.unitBookingsResultArray = undefined;
    this.unitBookingsHomeArray = undefined;
    this.unitBookingsUpcomingArray = undefined;
    this.unitBookingsPendingArray = undefined;
    this.unitBookingsRejectedArray = undefined;
    this.unitBookingsPastArray = undefined;

    this.adminBookingsAllArray = undefined;
    this.adminBookingsPendingAllArray = undefined;
    this.adminBookingsPendingFixedArray = undefined;
    this.adminBookingsPendingAdHocArray = undefined;
    this.adminBookingsPendingOOSArray = undefined;

    this.dpBookingsHomeArray = undefined;

    const raw = JSON.stringify({
      UserInfo: username,
      UserPass: password,
      Platform: AwsData.userDevice.platform,
      DeviceToken: AwsData.userDevice.deviceToken,
    })
    const encryptRaw = CryptoJS.AES.encrypt(raw, Gateway.SecretKey).toString()
    // console.log(encryptRaw)

    const response = await fetch(`${Gateway.URL}/user/lionlogin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        body: encryptRaw
      })
    });
    console.log("API: Encrypted Login")
    const json = await response.json()

    if (json.statusCode == 200 && json.body.ChallengeName == undefined) {
      const decryptRaw = await CryptoJS.AES.decrypt(json.data, Gateway.SecretKey).toString(CryptoJS.enc.Utf8)
      obj = JSON.parse(decryptRaw);
      AwsData.user = new User(
        obj.preferred_username,
        obj.IdToken,
        obj['custom:role'],
        obj['custom:performanceRating'],
        obj.given_name,
        obj.family_name,
        obj.email,
        obj['custom:safUnit'],
        this.rating
      );
      return "Redirect2FA"
    } else if (json.statusCode == 200 && json.body.ChallengeName != undefined) {
      const firstTimeSession = json.body.Session
      console.log("API RESPONSE: First Time Login")
      return firstTimeSession;
    }
    else {
      AwsData.user = new User('', '', '');
    }
    return AwsData.user;
  }

  async forgetPassword(username) {
    try {
      const response = await fetch(`${Gateway.URL}/user/forget`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: JSON.stringify({
            UserInfo: username,
          })
        })
      });
      console.log("API: Request Forget Password")
      const json = await response.json()
      if (json.statusCode == 200) {
        return "Success"
      } else {
        return json.body.message
      }
    } catch (error) {
      console.error(error)
    }
  }

  // No longer using this, moved on to confirmForgetPasswordEncrypted
  async confirmForgetPassword(username, password, otp) {
    try {
      const response = await fetch(`${Gateway.URL}/user/forget`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: JSON.stringify({
            UserInfo: username,
            UserPass: password,
            Code: otp
          })
        })
      });
      console.log("API: Confirm Forget Password")
      const json = await response.json()
      if (json.statusCode == 200) {
        return "Success"
      } else {
        return json.body.message
      }

    } catch (error) {
      console.error(error)
    }
  }

  async confirmForgetPasswordEncrypted(username, password, otp) {
    try {
      const raw = JSON.stringify({
        UserInfo: username,
        UserPass: password,
        Code: otp
      })
      const encryptRaw = CryptoJS.AES.encrypt(raw, Gateway.SecretKey).toString()
      // console.log(encryptRaw)

      const response = await fetch(`${Gateway.URL}/user/verifyforgetpassword`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: encryptRaw
        })
      });
      console.log("API: Encrypted Confirm Forget Password")
      const json = await response.json()

      if (json.statusCode == 200) {
        return "Success"
      } else {
        return json.body.message
      }

    } catch (error) {
      console.error(error)
    }
  }

  // No longer using this, moved on to firstTimeLogin (below this)
  async completeRegistration(email, username, password, session) {
    try {
      const response = await fetch(`${Gateway.URL}/user/login`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: JSON.stringify({
            UserInfo: email,
            NewPass: password,
            NewUsername: username,
            Session: session,
            Platform: AwsData.userDevice.platform,
            DeviceToken: AwsData.userDevice.deviceToken,
          })
        })
      });
      console.log("API: First Time Registration")
      const json = await response.json()
      if (json.statusCode == 200) {
        return "Success"
      } else {
        return json.body.message
      }

    } catch (error) {
      console.error(error)
    }
  }

  async firstTimeLogin(email, username, password, session) {
    try {
      const raw = JSON.stringify({
        UserInfo: email,
        NewPass: password,
        NewUsername: username,
        Session: session,
        Platform: AwsData.userDevice.platform,
        DeviceToken: AwsData.userDevice.deviceToken,
      })
      const encryptRaw = CryptoJS.AES.encrypt(raw, Gateway.SecretKey).toString()
      // console.log(encryptRaw)

      const response = await fetch(`${Gateway.URL}/user/firsttimelogin`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: encryptRaw
        })
      });
      console.log("API: Encrypted First Time Login")

      const json = await response.json()
      if (json.statusCode == 200) {
        return "Success"
      } else {
        return json.body.message
      }

    } catch (error) {
      console.log(error)
    }
  }

  async resendOTP() {
    try {
      const response = await fetch(`${Gateway.URL}/user/sendotp`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: AwsData.user.email,
        })
      });
      console.log("API: Resend OTP")
      const json = await response.json()
      if (json.statusCode == 200) {
        return "Success"
      } else {
        return json.body.message
      }
    } catch (error) {
      console.error(error)
    }
  }

  async verifyOTP(email, otp) {
    try {
      const raw = JSON.stringify({
        email: email,
        otpDigit: otp
      })
      // console.log(raw)
      const encryptRaw = CryptoJS.AES.encrypt(raw, Gateway.SecretKey).toString()

      const response = await fetch(`${Gateway.URL}/user/verifyotp`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: encryptRaw
        })
      });
      console.log("API: Encrypted Verify OTP (2FA)")

      const json = await response.json()

      if (json.message == 'Valid') {
        const decryptRaw = await CryptoJS.AES.decrypt(json.data, Gateway.SecretKey).toString(CryptoJS.enc.Utf8)
        obj = JSON.parse(decryptRaw);
        AwsData.user.accessToken = obj.idToken
        await this.getSPaverageRating();
        return "Success"
      } else {
        return json.message
      }

    } catch (error) {
      console.log(error)
    }
  }

  async getSPaverageRating() {
    const response = await fetch(`${Gateway.URL}/averagerating`, {
      headers: {
        Authorization: AwsData.user.accessToken,
      }
    });
    console.log("API: getSPaverageRating")
    if (response.status == 401 || response.status == 403) {
      Alert.alert(
        "Authorisation Failed",
        "Please login again",
        [
          {
            text: 'OK'
          }
        ]
      )
    } else {
      const json = await response.json();
      if (json.statusCode == 200) {
        obj = json.body;
        obj = ((obj[0].avgRating + obj[1].avgRating) / 2).toFixed(2);
        this.rating = obj;
      }
    }
  }

  async getUnitPerformanceRating() {
    try {
      console.log("API: Get performance rating for " + AwsData.user.username)
      const response = await fetch(`${Gateway.URL}/user/getperformancerating?username=${AwsData.user.username}`, {
        method: 'GET',
        headers: {
          Authorization: AwsData.user.accessToken,
        }
      });
      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      } else {

        const json = await response.json();
        if (json.statusCode !== 400) {
          const rating = json.performanceRating + '%'
          return rating
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  getBookingBody(booking) {

    let bookingUnit = '';
    let displayUserName = '';
    if (AwsData.user.role === UserRoles.Admin || AwsData.user.role === UserRoles.DutyPersonnel) {
      bookingUnit = booking.bookingUnit;
      displayUserName = 'ADMIN - ' + booking.bookingUnit;
    }
    else {
      displayUserName = AwsData.user.username;
      bookingUnit = AwsData.user.username;
    }

    // console.log("BU: " + bookingUnit + " DU: " + displayUserName)
    const Entities = require('html-entities').XmlEntities;
    const entities = new Entities();

    const raw = JSON.stringify({
      body: JSON.stringify({
        roleId: AwsData.user.role,
        createdBy: AwsData.user.username,
        performanceRating: AwsData.user.performanceRating,
        bookingUnit: bookingUnit,
        displayUserName: displayUserName,
        departureDate: booking.getDepartureDate(),
        departureTime: booking.departureTime,
        routeId: booking.routeId,
        purposeId: booking.purposeId,
        scheduleId: booking.scheduleId,
        bookingType: booking.bookingType,
        serviceProviderType: booking.serviceProviderType,
        numPassenger: entities.encode(booking.numPassenger),
        vehicles: booking.getVehicles(),
        totalLoad: booking.totalLoad,
        remarks: entities.encode(booking.remarks),
        bookingCode: booking.bookingCode,
        status: booking.status,
        purposeShort: booking.purposeShort,
        routeName: booking.routeName
      })
    });
    // console.log('API: Confirm Booking - Body ' + raw);
    return raw;
  }

  getRecurringBookingBody(booking, endDateText, weekday) {
    let bookingUnit = '';
    let displayUserName = '';
    if (AwsData.user.role === UserRoles.Admin || AwsData.user.role === UserRoles.DutyPersonnel) {
      bookingUnit = booking.bookingUnit;
      displayUserName = 'ADMIN - ' + booking.bookingUnit;
    }
    else {
      displayUserName = AwsData.user.username;
      bookingUnit = AwsData.user.username;
    }
    const endDate = moment(endDateText).format("YYYY-MM-DD");
    const weekdayNumber = this.getRecurringWeekdayNum(weekday)

    // console.log("BU: " + bookingUnit + " DU: " + displayUserName)
    const Entities = require('html-entities').XmlEntities;
    const entities = new Entities();

    const raw = JSON.stringify({
      body: JSON.stringify({
        roleId: AwsData.user.role,
        createdBy: AwsData.user.username,
        performanceRating: AwsData.user.performanceRating,
        bookingUnit: bookingUnit,
        displayUserName: displayUserName,
        departureDate: booking.getDepartureDate(),
        departureTime: booking.departureTime,
        routeId: booking.routeId,
        purposeId: booking.purposeId,
        scheduleId: booking.scheduleId,
        bookingType: booking.bookingType,
        serviceProviderType: booking.serviceProviderType,
        numPassenger: entities.encode(booking.numPassenger),
        vehicles: booking.getVehicles(),
        totalLoad: booking.totalLoad,
        endRepeatDate: endDate,
        recurring: weekdayNumber,
        remarks: entities.encode(booking.remarks),
        bookingCode: booking.bookingCode,
        status: booking.status,
        purposeShort: booking.purposeShort,
        routeName: booking.routeName,
      })
    });
    // console.log('API: Confirm Recurring Booking - Body ' + raw);
    return raw;
  }

  getRecurringWeekdayNum(weekday) {
    let weekdayNum = "";
    for (let i = 0; i < weekday.length; i++) {
      if (i > 0 && weekday[i] !== "") {
        weekdayNum = weekdayNum + ";"
      }
      switch (weekday[i]) {
        case "Every Monday":
          weekdayNum = weekdayNum + "1"
          break;
        case "Every Tuesday":
          weekdayNum = weekdayNum + "2"
          break;
        case "Every Wednesday":
          weekdayNum = weekdayNum + "3"
          break;
        case "Every Thursday":
          weekdayNum = weekdayNum + "4"
          break;
        case "Every Friday":
          weekdayNum = weekdayNum + "5"
          break;
        case "Every Saturday":
          weekdayNum = weekdayNum + "6"
          break;
        case "Every Sunday":
          weekdayNum = weekdayNum + "7"
          break;
        default:
          break;
      }
    }
    return weekdayNum
  }

  putIntoDpArray(data) {
    const today = moment(new Date()).format('YYYY-MM-DD');
    const tomorrow = moment(new Date()).add(1, 'day').format('YYYY-MM-DD');

    let formattedToday = 'TODAY ' + moment(today).format("DD MMM");
    let formattedTomorrow = 'TOMORROW ' + moment(tomorrow).format("DD MMM");

    if (data.departureDate === today) {
      if (this.dpBookingsHomeArray != undefined) {
        var index = this.dpBookingsHomeArray.findIndex(booking => booking.bookingDate === formattedToday);
      } else {
        index = -1;
      }

      if (index === -1) {
        console.log("There is no today bookings");
        let unsortedArray;
        if (this.dpBookingsHomeArray === undefined) {
          unsortedArray = [];
        } else {
          unsortedArray = Booking.unsortArray(this.dpBookingsHomeArray);
        }
        unsortedArray.push(data);
        this.dpBookingsHomeArray = Booking.sortBookingsByDay(unsortedArray);
      } else {
        this.dpBookingsHomeArray[0].data.push(data);
        this.dpBookingsHomeArray[0].data.sort(function (a, b) {
          return a.departureTime - b.departureTime;
        });
      }
    } else if (data.departureDate === tomorrow) {
      if (this.dpBookingsHomeArray != undefined) {
        var index = this.dpBookingsHomeArray.findIndex(booking => booking.bookingDate === formattedTomorrow);
      } else {
        index = -1;
      }
      if (index === -1) {
        console.log("There is no tomorrow bookings");
        let unsortedArray;
        if (this.dpBookingsHomeArray === undefined) {
          unsortedArray = [];
        } else {
          unsortedArray = Booking.unsortArray(this.dpBookingsHomeArray);
        }
        unsortedArray.push(data);
        this.dpBookingsHomeArray = Booking.sortBookingsByDay(unsortedArray);

      } else {
        this.dpBookingsHomeArray[1].data.push(data);
        this.dpBookingsHomeArray[1].data.sort(function (a, b) {
          return a.departureTime - b.departureTime;
        });
      }
    }
  }

  async confirmBooking(booking) {
    try {
      const response = await fetch(`${Gateway.URL}/booking/confirmbooking`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: AwsData.user.accessToken,
        },
        body: this.getBookingBody(booking)
      });
      console.log("API: Confirm Booking");

      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }

      const json = await response.json();
      console.log("API Booking Response: " + JSON.stringify(json))
      if (json.statusCode == 200) {
        obj = JSON.parse(json.body);
        booking.status = obj.body.status
        booking.bookingCode = obj.body.bookingCode

        // Push new booking into Unit Array storage
        if (AwsData.user.role === "PU" || AwsData.user.role === "U") {
          this.unitBookingsResultArray.push(JSON.parse(JSON.parse(this.getBookingBody(booking)).body))
        } else if (AwsData.user.role === "DP") {
          let data = JSON.parse(JSON.parse(this.getBookingBody(booking)).body);
          this.putIntoDpArray(data);

        } else if (AwsData.user.role === "A") {
          if (this.adminBookingsAllArray != undefined) {
            this.adminBookingsAllArray.push(JSON.parse(JSON.parse(this.getBookingBody(booking)).body));
            this.adminBookingsAllArray.sort((a, b) => a.departureDate.localeCompare(b.departureDate) || a.departureTime.localeCompare(b.departureTime));
          }
          else {
            let array = [];
            array.push(JSON.parse(JSON.parse(this.getBookingBody(booking)).body));
            this.adminBookingsAllArray = array;
          }
        }
        return obj.body.status;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async confirmRecurringBooking(booking, endDateText, weekday) {
    // console.log("Recurring Request: " + endDateText + " " + weekday)
    // this.getRecurringBookingBody(booking, endDateText, weekday)
    try {
      const response = await fetch(`${Gateway.URL}/booking/confirmrecurringbooking`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: AwsData.user.accessToken,
        },
        body: this.getRecurringBookingBody(booking, endDateText, weekday)
      });

      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }

      // console.log("Body: " + this.getRecurringBookingBody(booking, endDateText, weekday));
      const json = await response.json();
      console.log("API RecurringBooking Response: " + JSON.stringify(json));
      if (json.statusCode == 200) {
        obj = JSON.parse(json.body);
        booking.status = obj.body[0][0].status;
        booking.bookingCode = obj.body.bookingCode;
        this.unitBookingsResultArray = null;
        this.adminBookingsAllArray = null;
        // Push new booking into Unit Array storage
        // if(this.unitBookingsResultArray != undefined){
        //   this.unitBookingsResultArray.push(JSON.parse(JSON.parse(this.getRecurringBookingBody(booking)).body))
        // }

        return obj.body[0][0].status;
      }
    } catch (error) {
      console.error(error);
    }
  }


  async approveBooking(booking) {
    try {
      const raw = JSON.stringify({
        body: JSON.stringify({
          bookingCode: booking.bookingCode,
          departureDate: booking.departureDate,
          departureTime: booking.departureTime,
          bookingUnit: booking.bookingUnit,
          status: BookingStatus.APPROVED,
          remarks: booking.remarks,
          updatedBy: AwsData.user.username,
        })
      });

      const response = await fetch(`${Gateway.URL}/booking/update`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: AwsData.user.accessToken,
        },
        body: raw
      });

      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }
      // console.log(raw);

      const json = await response.json();
      if (json.statusCode == 200) {
        console.log('API: Approve booking ' + JSON.stringify(json));
        return true;
      }
      else {
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async approveReccurringBooking(booking) {
    try {
      const raw = JSON.stringify({
        body: JSON.stringify({
          bookingCode: booking.bookingCode,
          departureDate: booking.departureDate,
          departureTime: booking.departureTime,
          bookingUnit: booking.bookingUnit,
          status: BookingStatus.APPROVED,
          remarks: booking.remarks,
          updatedBy: AwsData.user.username,
          bookingGroup: booking.bookingGroup
        })
      });

      // console.log(raw);
      const response = await fetch(`${Gateway.URL}/booking/update`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: AwsData.user.accessToken,
        },
        body: raw
      });

      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }

      const json = await response.json();
      if (json.statusCode == 200) {
        console.log('API: Approve Recurring booking ' + JSON.stringify(json));
        return true;
      }
      else {
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async cancelAdminBooking(booking, reason) {
    try {
      const Entities = require('html-entities').XmlEntities;
      const entities = new Entities();

      reason = entities.encode(reason);

      const raw = JSON.stringify({
        body: JSON.stringify({
          bookingCode: booking.bookingCode,
          bookingUnit: booking.bookingUnit,
          cancellationReason: reason,
          bookingGroup: "",
          departureDate: booking.departureDate,
          departureTime: booking.departureTime,
          updatedBy: AwsData.user.username,
        })
      });
      const response = await fetch(`${Gateway.URL}/booking/cancel`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: AwsData.user.accessToken,
        },
        body: raw
      });

      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }
      // console.log("Body: " + JSON.stringify(raw));
      const json = await response.json();
      console.log('API: Cancel booking ' + JSON.stringify(json));
      if (json.statusCode == 200) {
        return "Success";
      }
      else {
        return "Failed";
      }
    } catch (error) {
      console.error(error);
    }
  }

  async rejectBooking(booking, remarks) {
    try {
      const Entities = require('html-entities').XmlEntities;
      const entities = new Entities();

      remarks = entities.encode(remarks);

      const raw = JSON.stringify({
        body: JSON.stringify({
          bookingCode: booking.bookingCode,
          departureDate: booking.departureDate,
          departureTime: booking.departureTime,
          bookingUnit: booking.bookingUnit,
          status: BookingStatus.REJECTED,
          rejectedReason: remarks,
          updatedBy: AwsData.user.username,
        })
      });

      const response = await fetch(`${Gateway.URL}/booking/update`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: AwsData.user.accessToken,
        },
        body: raw
      });

      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }
      const json = await response.json();

      // console.log(raw);
      if (json.statusCode == 200 && json.statusCode != null) {
        console.log("API: Reject Booking " + JSON.stringify(json));
        return true;
      }
      else {
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async rejectRecurringBooking(booking, remarks) {
    try {
      const Entities = require('html-entities').XmlEntities;
      const entities = new Entities();

      remarks = entities.encode(remarks);

      const raw = JSON.stringify({
        body: JSON.stringify({
          bookingCode: booking.bookingCode,
          departureDate: booking.departureDate,
          departureTime: booking.departureTime,
          bookingUnit: booking.bookingUnit,
          status: BookingStatus.REJECTED,
          rejectedReason: remarks,
          updatedBy: AwsData.user.username,
          bookingGroup: booking.bookingGroup
        })
      });

      const response = await fetch(`${Gateway.URL}/booking/update`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: AwsData.user.accessToken,
        },
        body: raw
      });

      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }

      // console.log(raw);
      const json = await response.json();
      if (json.statusCode == 200 && json.statusCode != null) {
        console.log("API: Reject Recurring Booking " + JSON.stringify(json));
        return true;
      }
      else {
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async checkSchedule(booking) {
    try {
      const capacity = booking.serviceProviderType == ServiceProviderTypes.PASSENGER ?
        booking.numPassenger : booking.totalLoad;
      const params = 'serviceProviderType=' + booking.serviceProviderType
        + '&departureDate=' + booking.getDepartureDate()
        + '&routeId=' + booking.routeId
        + '&capacity=' + capacity;
      const response = await fetch(`${Gateway.URL}/booking/checkschedule?` + params, {
        headers: {
          Authorization: AwsData.user.accessToken,
        }
      });

      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }

      const json = await response.json();
      console.log("API: Check Schedule")
      if (json.statusCode == 200 && json.body != undefined && json.body !== "" && json.body !== "[]") {
        const schedules = json.body.map(schedule => {
          const {
            scheduleId,
            departureTime,
            maxLimit,
            available
          } = schedule;
          return new Schedule(scheduleId, departureTime, maxLimit, available);
        });
        return schedules;
      } else {
        return []
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getAdminBookings(bookingType) {
    try {
      if (this.adminBookingsAllArray == null || this.adminBookingsAllArray == undefined) {
        const startDate = moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD');
        const endDate = moment(new Date()).add(3, 'month').format('YYYY-MM-DD');
        const yesterday = moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD');
        const response = await fetch(`${Gateway.URL}/bookings/startdateenddate?serviceProviderType=all&startDate=` + startDate + `&endDate=` + endDate, {
          headers: {
            Authorization: AwsData.user.accessToken,
          }
        });

        if (response.status == 401 || response.status == 403) {
          Alert.alert(
            "Authorisation Failed",
            "Please login again",
            [
              {
                text: 'OK'
              }
            ]
          )
        }

        const json = await response.json();

        if (json.statusCode == 200 && json.body && json.body.map) {
          let result = json.body;
          console.log('API: Get Admin Bookings');

          this.adminBookingsAllArray = result;

          this.adminBookingsPendingAllArray = result.filter(booking => {
            return booking.status == BookingStatus.PENDING && moment(booking.departureDate).isAfter(yesterday);
          })

          this.adminBookingsPendingFixedArray = this.adminBookingsPendingAllArray.filter(booking => {
            return booking.bookingType == BookingTypes.FIXED;
          })

          this.adminBookingsPendingAdHocArray = this.adminBookingsPendingAllArray.filter(booking => {
            return booking.bookingType == BookingTypes.ADHOC;
          })

          this.adminBookingsPendingOOSArray = this.adminBookingsPendingAllArray.filter(booking => {
            return booking.bookingType == BookingTypes.OOS;
          })
        }
      } else {
        console.log("Admin: Get from local storage");
      }

      switch (bookingType) {
        case "Pending":
          result = this.adminBookingsPendingAllArray;
          break;

        case "Fixed":
          result = this.adminBookingsPendingFixedArray;
          break;

        case "Ad-Hoc":
          result = this.adminBookingsPendingAdHocArray;
          break;

        case "OOS":
          result = this.adminBookingsPendingOOSArray;
          break;

        case "All":
          result = this.adminBookingsAllArray;
          break;

        default:
          result = this.adminBookingsAllArray;
      }

      // Do a mapping from API to data model 
      // so that if API changes (e.g. from routeId to RouteID), 
      // no codes need to be changed in the components
      result = result.map(booking => {
        const Entities = require('html-entities').XmlEntities;
        const entities = new Entities();

        booking = entities.decode(JSON.stringify(booking))
        booking = JSON.parse(booking)

        return Booking.createBooking(booking);
      });

      if (bookingType != "All") {
        result = Booking.sortBookingsSwipeable(result);
      }
      return result;

    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getDPBookings() {
    try {
      if (this.dpBookingsHomeArray == null || this.dpBookingsHomeArray == undefined) {
        const today = moment(new Date()).format('YYYY-MM-DD');
        const tomorrow = moment(new Date()).add(1, 'day').format('YYYY-MM-DD');
        const response = await fetch(`${Gateway.URL}/bookings/startdateenddate?serviceProviderType=RPL&startDate=` + today + `&endDate=` + tomorrow, {
          headers: {
            Authorization: AwsData.user.accessToken,
          }
        });

        if (response.status == 401 || response.status == 403) {
          Alert.alert(
            "Authorisation Failed",
            "Please login again",
            [
              {
                text: 'OK'
              }
            ]
          )
        }

        const json = await response.json();

        if (json.statusCode == 200 && json.body && json.body.map) {
          let result = json.body;
          console.log('API: Get All DP Bookings');

          // Do a mapping from API to data model 
          // so that if API changes (e.g. from routeId to RouteID), 
          // no codes need to be changed in the components

          result = result.map(booking => {
            const Entities = require('html-entities').XmlEntities;
            const entities = new Entities();

            booking = entities.decode(JSON.stringify(booking))
            booking = JSON.parse(booking)

            return Booking.createBooking(booking);
          });

          this.dpBookingsHomeArray = Booking.sortBookingsByDay(result);

          return this.dpBookingsHomeArray;
        }
      }
      else {
        console.log("Get DP Bookings from local storage");
        return this.dpBookingsHomeArray
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getSPBookings(bookingType) {
    try {
      let result;
      if (
        this.spBookingsCalendar == null ||
        this.spBookingsCalendar == undefined
      ) {
        let date = new Date();
        let threemonthsaft = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        );
        let threemonthsbef = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        );
        threemonthsaft.setMonth(threemonthsaft.getMonth() + 3);
        threemonthsbef.setMonth(threemonthsbef.getMonth() - 1);
        threemonthsaft =
          threemonthsaft.getUTCFullYear() +
          '-' +
          ('0' + (threemonthsaft.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + threemonthsaft.getDate()).slice(-2);
        threemonthsbef =
          threemonthsbef.getUTCFullYear() +
          '-' +
          ('0' + (threemonthsbef.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + threemonthsbef.getDate()).slice(-2);
        AwsData.user.givenName = AwsData.user.givenName.replace(
          /\s+/g,
          '',
        );
        const response = await fetch(
          `${
          Gateway.URL
          }/bookings/serviceprovidername/startdateenddate?serviceProviderType=` +
          AwsData.user.type +
          `&sp=` +
          AwsData.user.givenName +
          ` ` +
          AwsData.user.familyName +
          `&startDate=` +
          threemonthsbef +
          `&endDate=` +
          threemonthsaft,
          {
            headers: {
              Authorization: AwsData.user.accessToken,
            }
          });

        if (response.status == 401 || response.status == 403) {
          Alert.alert(
            "Authorisation Failed",
            "Please login again",
            [
              {
                text: 'OK'
              }
            ]
          )
        }

        const json = await response.json();
        console.log('AWSDATA getSPBookings');

        if (json.statusCode == 200 && json.body != undefined) {
          result = json.body;
          this.spBookingsCalendar = result;

          const today = moment(new Date()).format('YYYY-MM-DD');

          this.spBookingsHome = this.spBookingsCalendar.filter(
            booking => {
              return booking.departureDate >= today;
            },
          );

          this.spBookingsOOS = this.spBookingsHome.filter(booking => {
            return booking.bookingType == BookingTypes.OOS;
          });

          this.spBookingsAdHoc = this.spBookingsHome.filter(booking => {
            return booking.bookingType == BookingTypes.ADHOC;
          });

          this.spBookingsFixed = this.spBookingsHome.filter(booking => {
            return booking.bookingType == BookingTypes.FIXED;
          });
        }
      }

      switch (bookingType) {
        case BookingTypes.ALL:
          result = this.spBookingsHome;
          break;

        case BookingTypes.FIXED:
          result = this.spBookingsFixed;
          break;

        case BookingTypes.ADHOC:
          result = this.spBookingsAdHoc;
          break;

        case BookingTypes.OOS:
          result = this.spBookingsOOS;
          break;

        default:
          result = this.spBookingsCalendar;
      }

      result = result.map(booking => {
        const Entities = require('html-entities').XmlEntities;
        const entities = new Entities();

        booking = entities.decode(JSON.stringify(booking))
        booking = JSON.parse(booking)

        return Booking.createBooking(booking);
      });

      // Sort bookings by data and service provider type
      if (bookingType != 'CALENDAR')
        result = Booking.sortBookingsSwipeable(result);

      return result;

    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async putSPFeedback(bookingCode, feedback, comment) {
    try {
      const Entities = require('html-entities').XmlEntities;
      const entities = new Entities();

      comment = entities.encode(comment);

      AwsData.user.givenName = AwsData.user.givenName.replace(/\s+/g, '');
      let data = {
        bookingCode: bookingCode,
        feedbackType: feedback,
        comments: comment,
        createdBy: AwsData.user.username // AwsData.user.givenName
      };
      //console.log(data);

      this.spBookingsCalendar.filter(booking => {
        return booking.bookingCode == bookingCode;
      })[0].SPFFeedback = {
        "bookingCode": bookingCode,
        "comments": comment,
        "feedbackType": feedback,
        "reportedBy": AwsData.user.username // AwsData.user.givenName
      };

      // console.log(this.spBookingsCalendar.filter(booking => {
      //   return booking.bookingCode == bookingCode;
      // }));

      const response = await fetch(`${Gateway.URL}/feedback/spfeedback/add`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: AwsData.user.accessToken,
        },
        body: JSON.stringify({
          body: JSON.stringify(data)
        })
      });
      
      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }

      const json = await response.json();
      console.log('AWSDATA putSPFeedback');

      if (json.statusCode == 200) {
        let result = json.body;
        //console.log(result);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async spVerifyBooking(bookingCode) {

    let Booking = this.spBookingsCalendar.filter(booking => {
      return booking.bookingCode == bookingCode;
    })[0];

    if (Booking != null && Booking != undefined) {
      let bookingDateTime = moment(Booking.departureDate + ' ' + Booking.departureTime, 'YYYY-MM-DD HHmm')

      if (Booking.status == 'Approved' && moment().add(30, 'minutes').isAfter(bookingDateTime) && moment().subtract(15, 'minutes').isBefore(bookingDateTime)) {
        bookingDateTime = moment(bookingDateTime).subtract(15, 'minutes');
        if (moment().isBefore(bookingDateTime)) {
          this.spBookingsCalendar.filter(booking => {
            return booking.bookingCode == bookingCode;
          })[0].status = 'Completed';
        } else {
          this.spBookingsCalendar.filter(booking => {
            return booking.bookingCode == bookingCode;
          })[0].status = 'Late';
        }

        Date.prototype.addHours = function (h) {
          this.setTime(this.getTime() + (h * 60 * 60 * 1000));
          return this;
        };
        this.spBookingsCalendar.filter(booking => {
          return booking.bookingCode == bookingCode;
        })[0].onBoardTime = new Date().addHours(8);
      } else {
        Booking = '';
      }
    } else {
      Booking = '';
    }

    AwsData.user.givenName = AwsData.user.givenName.replace(/\s+/g, '');
    const response = await fetch(`${Gateway.URL}/booking/verifybooking`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: AwsData.user.accessToken,
      },
      body: JSON.stringify({
        body: JSON.stringify({
          bookingCode: bookingCode,
          updatedBy: AwsData.user.username //AwsData.user.givenName
        })
      })
    });

    if (response.status == 401 || response.status == 403) {
      Alert.alert(
        "Authorisation Failed",
        "Please login again",
        [
          {
            text: 'OK'
          }
        ]
      )
    }

    // console.log(JSON.stringify({
    //   body: JSON.stringify({
    //     bookingCode: bookingCode,
    //     updatedBy: AwsData.user.username //AwsData.user.givenName
    //   })
    // }));
    const json = await response.json();
    let result = json.body;
    // console.log(result);
    console.log('AWSDATA spVerifyBooking');

    result = JSON.parse(result);
    return {
      Booking,
      result
    };
  }

  async spExportReport(startDate, endDate, purposeId, bookingType) {
    if (purposeId == 0)
      purposeId = '';
    let data = {
      serviceProviderType: AwsData.user.type,
      startDate: startDate,
      endDate: endDate,
      purposeId: purposeId,
      bookingType: bookingType.join(),
      email: AwsData.user.email
    }

    //console.log(data);
    // console.log(JSON.stringify({
    //   body: JSON.stringify(data)
    // }));

    const response = await fetch(`${Gateway.URL}/bookings/generatereport`, {
      method: 'POST',
      headers: {
        Authorization: AwsData.user.accessToken,
      },
      body: JSON.stringify(
        JSON.stringify(data)
      )
    });

    if (response.status == 401 || response.status == 403) {
      Alert.alert(
        "Authorisation Failed",
        "Please login again",
        [
          {
            text: 'OK'
          }
        ]
      )
    }

    const json = await response.json();
    console.log('AWSDATA spExportReport');

    if (json.statusCode == 200) {
      return true;
    }
    else {
      return false;
    }
  }

  async getUnitBookings(status) {
    try {
      // Call API if it hasnt been called before
      if (this.unitBookingsResultArray == null || this.unitBookingsResultArray == undefined) {
        // const response = await fetch(`${Gateway.URL}/bookings/pastcurrent?bookingUnit=` + AwsData.user.username);
        const response = await fetch(`${Gateway.URL}/bookings/pastcurrent?bookingUnit=` + AwsData.user.username, {
          headers: {
            Authorization: AwsData.user.accessToken,
          }
        })

        if (response.status == 401 || response.status == 403) {
          Alert.alert(
            "Authorisation Failed",
            "Please login again",
            [
              {
                text: 'OK'
              }
            ]
          )
        }

        const json = await response.json();
        console.log('API: Get Unit Bookings');
        if (json.statusCode == 200 && json.body && json.body.map) {
          this.unitBookingsResultArray = json.body;
        } else {
          let result = [];
          this.unitBookingsResultArray = result;
          return result
        }
      } else {
        console.log("Get Unit Bookings from Local Storage")
      }

      // Filter bookings into respective arrays
      const today = moment(new Date()).format('YYYY-MM-DD');

      this.unitBookingsHomeArray = this.unitBookingsResultArray.filter(booking => {
        return booking.departureDate >= today;
      });

      this.unitBookingsUpcomingArray = this.unitBookingsResultArray.filter(booking => {
        return booking.status === "Approved" && booking.departureDate >= today;
      });

      this.unitBookingsPendingArray = this.unitBookingsResultArray.filter(booking => {
        return booking.status === "Pending" && booking.departureDate >= today;
      });

      this.unitBookingsRejectedArray = this.unitBookingsResultArray.filter(booking => {
        return booking.status === "Rejected" && booking.departureDate >= today;
      });

      this.unitBookingsPastArray = this.unitBookingsResultArray.filter(booking => {
        return booking.departureDate < today;
      });

      let todayFiltered = this.unitBookingsResultArray.filter(booking => {
        return booking.departureDate === today;
      });

      todayFiltered = todayFiltered.filter(booking => {
        return booking.status === "Completed" || booking.status === "Late" || booking.status === "Cancelled" || booking.status === "Rejected"
      })
      for (let i = 0; i < todayFiltered.length; i++) {
        this.unitBookingsPastArray.push(todayFiltered[i])
      }

      let result = this.unitBookingsResultArray;
      // Get the correct array depending on status
      switch (status) {
        default:
        case BookingStatus.ALL:
          result = this.unitBookingsHomeArray
          break;

        case BookingStatus.APPROVED:
          result = this.unitBookingsUpcomingArray
          break;
        case BookingStatus.PENDING:
          result = this.unitBookingsPendingArray
          break;

        case BookingStatus.REJECTED:
          result = this.unitBookingsRejectedArray
          break;

        case BookingStatus.PAST:
          result = this.unitBookingsPastArray
          break;
      }

      // Do a mapping from API to data model 
      // so that if API changes (e.g. from routeId to RouteID), 
      // no codes need to be changed in the components       
      result = result.map(booking => {
        const Entities = require('html-entities').XmlEntities;
        const entities = new Entities();

        booking = entities.decode(JSON.stringify(booking))
        booking = JSON.parse(booking)

        return Booking.createBooking(booking);
      });

      // Sort bookings by date and service provider type
      if (status == BookingStatus.PAST) {
        result = Booking.sortBookingsByDateAndSPTypeReversed(result);
      } else {
        result = Booking.sortBookingsByDateAndSPType(result);
      }
      return result;

    } catch (error) {
      console.error(error);
    }
  }

  async cancelUnitBooking(booking, reason) {
    try {
      const Entities = require('html-entities').XmlEntities;
      const entities = new Entities();

      reason = entities.encode(reason)

      const response = await fetch(`${Gateway.URL}/booking/cancel`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: AwsData.user.accessToken,
        },
        body: JSON.stringify({
          body: JSON.stringify({
            bookingCode: booking.bookingCode,
            bookingUnit: booking.bookingUnit,
            cancellationReason: reason,
            bookingGroup: "",
            departureDate: booking.departureDate,
            departureTime: booking.departureTime,
            updatedBy: booking.bookingUnit
          })
        })
      });

      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }

      const json = await response.json();
      console.log("API Cancel response: " + JSON.stringify(json))

      if (json.statusCode == 200) {
        // Change status in local array (Replace with the cancelled booking)
        let tempBooking = this.unitBookingsResultArray.find(item => item.bookingCode === booking.bookingCode)
        tempBooking.status = "Cancelled"
        tempBooking.cancellationReason = reason
        let tempBookingIndex = this.unitBookingsResultArray.findIndex(item => item.bookingCode === booking.bookingCode)
        this.unitBookingsResultArray[tempBookingIndex] = tempBooking

        return "Success"
      } else {
        return "Unable to cancel booking"
      }

    } catch (error) {
      console.error(error);
    }
  }

  async cancelUnitRecurringBooking(booking, reason) {
    try {
      const Entities = require('html-entities').XmlEntities;
      const entities = new Entities();

      reason = entities.encode(reason)

      const response = await fetch(`${Gateway.URL}/booking/cancel`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: AwsData.user.accessToken,
        },
        body: JSON.stringify({
          body: JSON.stringify({
            bookingCode: booking.bookingCode,
            bookingUnit: booking.bookingUnit,
            cancellationReason: reason,
            bookingGroup: booking.bookingGroup,
            departureDate: booking.departureDate,
            departureTime: booking.departureTime,
            updatedBy: booking.bookingUnit
          })
        })
      });

      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }

      const json = await response.json();
      console.log("API Cancel Recurring response: " + JSON.stringify(json))
      if (json.statusCode == 200) {
        this.unitBookingsResultArray = null;
        return "Success"
      } else {
        return "Unable to cancel bookings"
      }

    } catch (error) {
      console.error(error);
    }
  }

  async giveRatingUnit(starRating, comment, bookcode, user) {
    // console.log("Rating request: " + bookcode + " " + starRating + " " + comment + " " + user)

    try {
      const Entities = require('html-entities').XmlEntities;
      const entities = new Entities();

      comment = entities.encode(comment)

      const response = await fetch(`${Gateway.URL}/feedback/saffeedback/add`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: AwsData.user.accessToken,
        },
        body: JSON.stringify({
          body: JSON.stringify({
            bookingCode: bookcode,
            feedbackType: "General",
            rating: starRating,
            comments: comment,
            createdBy: user
          })
        })
      });

      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }

      const json = await response.json();
      console.log("API Rating response: " + JSON.stringify(json))
      if (json.statusCode == 200) {
        let tempBooking = this.unitBookingsResultArray.find(item => item.bookingCode === bookcode)
        tempBooking.SAFFeedback = {
          rating: starRating,
          comments: comment
        }
        let tempBookingIndex = this.unitBookingsResultArray.findIndex(item => item.bookingCode === bookcode)
        this.unitBookingsResultArray[tempBookingIndex] = tempBooking

        return "Success"
      }
    } catch (error) {
      console.error(error);
    }
  }

  async reportBookingIssue(issueComment, user, code) {
    // console.log("Issue request: " + issueComment + " " + AwsData.user.username + " " + code)
    try {
      const Entities = require('html-entities').XmlEntities;
      const entities = new Entities();

      issueComment = entities.encode(issueComment)

      const response = await fetch(`${Gateway.URL}/bookingissue/add`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: AwsData.user.accessToken,
        },
        body: JSON.stringify({
          body: JSON.stringify({
            bookingCode: code,
            reportIssue: issueComment,
            createdBy: AwsData.user.username
          })
        })
      });

      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }

      const json = await response.json();
      console.log("API Report response: " + JSON.stringify(json))
      if (json.statusCode == 200) {

        let tempBooking = this.unitBookingsResultArray.find(item => item.bookingCode === code)
        tempBooking.BookingIssue = {
          reportIssue: issueComment,
          reportedDate: moment()
        }
        let tempBookingIndex = this.unitBookingsResultArray.findIndex(item => item.bookingCode === code)
        this.unitBookingsResultArray[tempBookingIndex] = tempBooking

        return "Success"
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getAnnouncements() {
    try {
      console.log("API: Get Announcements for " + AwsData.user.role)
      const response = await fetch(`${Gateway.URL}/announcement?role=` + AwsData.user.role, {
        method: 'GET',
        headers: {
          Authorization: AwsData.user.accessToken,
        }
      });

      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }

      const json = await response.json()
      if (json.statusCode == 200 && json.body && json.body.map) {
        let result = json.body;

        result = result.map(announcement => {
          const Entities = require('html-entities').XmlEntities;
          const entities = new Entities();

          announcement = entities.decode(JSON.stringify(announcement))
          announcement = JSON.parse(announcement)

          return Announcement.createAnnouncement(announcement);
        })

        result.sort(function (a, b) {
          return a.createdDate < b.createdDate;
        })

        var newAnnouncements = [];
        newAnnouncements.push({ "title": 'announcements', "data": result })

        return newAnnouncements;
      }

    } catch (error) {
      console.error(error);
    }
  }

  async checkBooking(dateText, timeText, serviceProviderType) {
    try {
      const response = await fetch(`${Gateway.URL}/booking/checkbooking?serviceProviderType=` + serviceProviderType +
        `&departureDate=` + dateText + `&departureTime=` + timeText, {
        headers: {
          Authorization: AwsData.user.accessToken,
        }
      });

      if (response.status == 401 || response.status == 403) {
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
      }

      const json = await response.json();
      console.log("API: Check booking type (Ad-Hoc/OOS)")
      if (json.statusCode == 200 && json.body) {
        return json.body.bookingType
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getNotifications() {
    try {
      let response;
      if (AwsData.user.role === "A") {
        console.log("API: Get Notifications for Admin")
        response = await fetch(`${Gateway.URL}/notification?username=A`, {
          method: 'GET',
          headers: {
            Authorization: AwsData.user.accessToken,
          }
        });
      } else {
        console.log("API: Get Notifications for " + AwsData.user.username)
        response = await fetch(`${Gateway.URL}/notification?username=` + AwsData.user.username, {
          method: 'GET',
          headers: {
            // This long string is an expired token (to test invalid token error, uncomment it and comment the other one)
            // Authorization: 'eyJraWQiOiJHMDFvOGVjRUdcL2dtOWdQU2NzbW1KSUNyc1VSZEp4cllLb3JrdkJOTUl6dz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlYTRiMGRlYS0yOTA4LTQwNGUtYTZkNS01MWNlN2NmZmE5MjMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiY3VzdG9tOnVwZGF0ZWRCeSI6ImJ0cHkyODUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfbzFWWHVjVUFhIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoibGlvbmFjY291bnQxIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibGlvbmFkbWluIiwiY3VzdG9tOnBlcmZvcm1hbmNlUmF0aW5nIjoiNzAiLCJnaXZlbl9uYW1lIjoiTGlvbiIsImF1ZCI6IjJhOGJ0Y2Z1N283NGtib2ViM2NwYm9jbDl2IiwiZXZlbnRfaWQiOiI4ZmQ5ZTg3Yi0xYzA1LTQzYjYtOGJjMi00M2I5YWVkYTkxOTYiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU5NzI4OTQ0NiwicGhvbmVfbnVtYmVyIjoiKzY1OTY3NDU2NDIiLCJleHAiOjE1OTcyOTMwNDYsImN1c3RvbTpyb2xlIjoiQSIsImlhdCI6MTU5NzI4OTQ0NiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImN1c3RvbTpzYWZVbml0IjoiQWRtaW4iLCJlbWFpbCI6ImwxQGdtYWlsLmNvbSJ9.eS5wNJLF2GeOhtdMDW4FSvRikEKO66WEVrwVDWho4ypTi7bF3KHGngD7Fdcuxh7Fmw4uWUv9nxCKjY8y7IPDUws-UKDJVkzn2yCuI4cEQ7WCSQyt3Sv-jKAOY4kyiuhMLm9uemcwo3vIZA-GB2fRxg8YE0YEByYL70VbbzbBGgzPXwuR_SrzRnfHhipY0iEKryAWv1e1OqT2OrgN7omJ2Lziz1_wDjpOgLvCxzQg5NYUjpIoI0jKEYIbzNO3UET9YuF-NB2Li7UWnJQoRRQxhXCNADntk5_psIoGBrqXPitkdb5h6YHiAOb1xeVYFwEiyDnwSuzvynQG2uJvMjuVWg',
            Authorization: AwsData.user.accessToken
          }
        });
      }

      // Handles unauthorised or invalid token error
      if (response.status == 401 || response.status == 403) {
        // Shows alert if token error
        Alert.alert(
          "Authorisation Failed",
          "Please login again",
          [
            {
              text: 'OK'
            }
          ]
        )
        // Returns this string to signify to the screen that token is invalid (See unit-notification-screen fetchData method)
        return "InvalidToken"
      } else { 
        const json = await response.json()
        if (json.statusCode == 200 && json.body && json.body.map) {
          let result = json.body;
          
          result = result.map(notification => {
            const Entities = require('html-entities').XmlEntities;
            const entities = new Entities();
            
            notification = entities.decode(JSON.stringify(notification))
            notification = JSON.parse(notification)
            
            return Notification.createNotification(notification);
          })
          
          result.sort(function (a, b) {
            return a.createdDate < b.createdDate;
          })
          
          var newNotifications = [];
          newNotifications.push({ "title": 'notifications', "data": result })
          
          return newNotifications;
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export default AwsData;