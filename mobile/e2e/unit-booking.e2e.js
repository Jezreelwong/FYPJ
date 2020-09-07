import moment from 'moment'

describe('Unit Booking', () => {
  // beforeEach(async () => {
  //   await device.reloadReactNative();
  // });

  it("Make a One-Time RPL booking (bluefrog)", async () => {
    await device.reloadReactNative();

    // Log in
    await element(by.id('UsernameInput')).typeText('bluefrog');
    await element(by.id('PasswordInput')).typeText('P@ssw0rd');
    await element(by.text('Log in')).tap();

    // Make booking
    await element(by.id('bookRPL')).tap();

    // Select Date
    await element(by.id("datePicker")).tap();
    // IOS IS ABLE TO SET DATEPICKER VALUE, ANDROID IS UNABLE TO
    // HENCE, ANDROID'S DATEPICKER NEEDS TO TAP AT X AND Y VALUE OF SCREEN
    if (global.device.getPlatform() === 'ios') {
      const testElement = element(
        by.type('UIPickerView').withAncestor(by.id('dateTimePicker')),
      );
      await testElement.setColumnToValue(0, 'November'); // IMPLEMENT MOMENT FOR THIS (SO CAN HAVE 1 WEEK FROM CURRENT DATE, etc)
      await testElement.setColumnToValue(1, '3');
      await testElement.setColumnToValue(2, '1800');

      await expect(dateText).toHaveText('11/03/1800');
    } else {
      const testElement = element(
        by
          .type('android.widget.ScrollView')
          .withAncestor(by.type('android.widget.DatePicker')),
      );
      // await testElement.swipe('left', 'fast', '100'); // GOES TO NEXT MONTH (SWIPE LEFT)
      await testElement.tapAtPoint({ x: 250, y: 225 });
      await element(by.text('OK')).tap();
    }

    // Select Route
    await element(by.id('routePicker')).tap();
    await element(by.text('Mainland Ramp-Ladang Ramp')).tap();

    // Select Purpose
    await element(by.id('purposePicker')).tap();
    await element(by.text('Others')).tap();

    // Enter vehicles
    await element(by.id('vehiclesInput')).tap();
    await element(by.id("vehicle")).atIndex(2).tap()
    await element(by.text("Done")).tap()

    // Advance to timings screen
    await element(by.text('Continue')).tap();

    // Verify timings screen
    await expect(element(by.text("Pick a Scheduled Timing"))).toBeVisible();

    // Choose current time
    await element(by.text("Request for Other Timeslots")).tap();

    const minuteTextInput = element(
      by.type('android.widget.NumberPicker'),
    ).atIndex(1);

    await minuteTextInput.swipe('up', 'fast', '50')
    // await waitFor(element(by.text('44'))).toBeVisible().whileElement(minuteTextInput).scroll(50, 'down');

    await element(by.text('OK')).tap();

    // Verify review screen
    await expect(element(by.text("Please review your booking:")))

    // Enter remarks
    await element(by.id('scrollView')).scroll(100, 'down');
    await element(by.id("remarksInput")).typeText("SGA1234A");

    // Press Confirm booking
    await element(by.id("confirmButton")).tap();
    try {
      await element(by.text("OK")).tap();
    } catch (e) {
      await element(by.text("Yes, continue")).tap();
      await element(by.text("OK")).tap();
    }

    // Check if bottom tab navigator is generated
    await expect(element(by.text('Home'))).toBeVisible();
    await expect(element(by.text('Booking'))).toBeVisible();
    await expect(element(by.text('Announcement'))).toBeVisible();
    await expect(element(by.text('Account'))).toBeVisible();

    // Log out
    await element(by.text("Account")).tap();
    await element(by.text("Logout")).tap();

    // Verify that log in screen is shown
    await expect(element(by.text('Log in'))).toBeVisible();

    await element(by.id('UsernameInput')).typeText('lionadmin');
    await element(by.id('PasswordInput')).typeText('P@ssw0rd');
    await element(by.text('Log in')).tap();

    // Check if bottom tab is generated
    await expect(element(by.text('Booking'))).toBeVisible();

    await element(by.text("Booking")).tap();
    await element(by.text("22")).tap(); // SELECT DAY IN CALENDAR
    await waitFor(element(by.text('Pending'))).toBeVisible().whileElement(by.id('bookingSwipeList')).scroll(400, 'down');
    await element(by.text("Pending")).tap();

    await expect(element(by.text('SGA1234A'))).toBeVisible();
    await expect(element(by.text('Date 2020-08-22'))).toBeVisible();
    await expect(element(by.text('From MR-LR'))).toBeVisible();

    if (global.device.getPlatform() === 'android') {
      await device.pressBack(); // THIS IS ANDROID ONLY
    } else {
      // ADD A IOS TAP BACK BUTTON TOP LEFT
    }
    await element(by.text("Pending")).swipe('left', 'fast', '100')
    await element(by.id("approveButton")).tap();
    await element(by.text("OK")).tap();
  })

  // it("Make a One-time Passenger booking (bluefrog)", async () => {
  //   await device.reloadReactNative();

  //   // Log in
  //   await element(by.id('UsernameInput')).typeText('bluefrog');
  //   await element(by.id('PasswordInput')).typeText('P@ssw0rd');
  //   await element(by.text('Log in')).tap();

  //   // Make booking
  //   await element(by.id('bookPassenger')).tap();

  //   // Select Date
  //   await element(by.id("datePicker")).tap();
  //   // IOS IS ABLE TO SET DATEPICKER VALUE, ANDROID IS UNABLE TO
  //   // HENCE, ANDROID'S DATEPICKER NEEDS TO TAP AT X AND Y VALUE OF SCREEN
  //   if (global.device.getPlatform() === 'ios') {
  //     const testElement = element(
  //       by.type('UIPickerView').withAncestor(by.id('dateTimePicker')),
  //     );
  //     await testElement.setColumnToValue(0, 'November'); // IMPLEMENT MOMENT FOR THIS (SO CAN HAVE 1 WEEK FROM CURRENT DATE, etc)
  //     await testElement.setColumnToValue(1, '3');
  //     await testElement.setColumnToValue(2, '1800');

  //     await expect(dateText).toHaveText('11/03/1800');
  //   } else {
  //     const testElement = element(
  //       by
  //         .type('android.widget.ScrollView')
  //         .withAncestor(by.type('android.widget.DatePicker')),
  //     );
  //     // await testElement.swipe('left', 'fast', '100'); // GOES TO NEXT MONTH (SWIPE LEFT)
  //     await testElement.tapAtPoint({ x: 50, y: 225 });
  //     await element(by.text('OK')).tap();
  //   }

  //   // Select Route
  //   await element(by.id('routePicker')).tap();
  //   await element(by.text('SAF Ferry Terminal-Tekong Ferry Terminal')).tap();

  //   // Select Purpose
  //   await element(by.id('purposePicker')).tap();
  //   await element(by.text('Others')).tap();

  //   // Enter passenger number
  //   await element(by.id('passengerInput')).typeText('50');

  //   // Advance to timings screen
  //   await element(by.text('Continue')).tap();

  //   // Verify timings screen
  //   await expect(element(by.text("Pick a Scheduled Timing"))).toBeVisible();

  //   // Choose current time
  //   await element(by.text("Request for Other Timeslots")).tap();
  //   await element(by.text('OK')).tap();

  //   // Verify review screen
  //   await expect(element(by.text("Please review your booking:")))

  //   // Press Confirm booking
  //   await element(by.id("confirmButton")).tap();
  //   await element(by.text("OK")).tap();

  //   // Check if bottom tab navigator is generated
  //   await expect(element(by.text('Home'))).toBeVisible();
  //   await expect(element(by.text('Booking'))).toBeVisible();
  //   await expect(element(by.text('Announcement'))).toBeVisible();
  //   await expect(element(by.text('Account'))).toBeVisible();

  //   // Log out
  //   await element(by.text("Account")).tap();
  //   await element(by.text("Logout")).tap();

  //   // Verify that log in screen is shown
  //   await expect(element(by.text('Log in'))).toBeVisible();
  // })

});
