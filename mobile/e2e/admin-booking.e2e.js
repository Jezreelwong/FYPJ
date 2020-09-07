describe('Admin Booking', () => {
  // beforeEach(async () => {
  //   await device.reloadReactNative();
  // });

  // This approves the booking at the top of the list at the home screen
  it("Approve latest booking", async () => {
    await device.reloadReactNative();

    await element(by.id('UsernameInput')).typeText('lionadmin');
    await element(by.id('PasswordInput')).typeText('P@ssw0rd');
    await element(by.text('Log in')).tap();

    // Check if bottom tab is generated
    await expect(element(by.text('Home'))).toBeVisible();
    await expect(element(by.text('Booking'))).toBeVisible();
    await expect(element(by.text('Announcement'))).toBeVisible();
    await expect(element(by.text('Account'))).toBeVisible();

    await element(by.text("Pending")).atIndex(0).swipe('left', 'fast', '100')
    await element(by.id("approveButton")).atIndex(0).tap();

    // If recurring, it will go to the 'catch'
    try {
      await element(by.text("OK")).tap();
    } catch (e) {
      await element(by.text("Submit")).tap();
      await element(by.text("OK")).tap();
    }

    // Log out
    await element(by.text("Account")).tap();
    await element(by.text("Logout")).tap();

    // Check login button is visible
    await expect(element(by.text('Log in'))).toBeVisible();

  })


  // it("Approve booking", async () => {
  //   await device.reloadReactNative();

  //   await element(by.id('UsernameInput')).typeText('lionadmin');
  //   await element(by.id('PasswordInput')).typeText('P@ssw0rd');
  //   await element(by.text('Log in')).tap();

  //   // Check if bottom tab is generated
  //   await expect(element(by.text('Home'))).toBeVisible();
  //   await expect(element(by.text('Booking'))).toBeVisible();
  //   await expect(element(by.text('Announcement'))).toBeVisible();
  //   await expect(element(by.text('Account'))).toBeVisible();

  //   await element(by.text("Pending")).swipe('left', 'fast', '100')

  //   await element(by.text("Booking")).tap();
  //   await element(by.text("11")).tap(); // SELECT DAY IN CALENDAR
  //   await waitFor(element(by.text('Pending'))).toBeVisible().whileElement(by.id('bookingSwipeList')).scroll(400, 'down');
  //   await element(by.text("Pending")).tap();
  //   if (global.device.getPlatform() === 'android') {
  //     await device.pressBack(); // THIS IS ANDROID ONLY
  //   } else {
  //     // ADD A IOS TAP BACK BUTTON TOP LEFT
  //   }
  //   await element(by.text("Pending")).swipe('left', 'fast', '100')
  //   await element(by.id("approveButton")).tap();
  //   await element(by.text("OK")).tap();

  //   // Log out
  //   await element(by.text("Account")).tap();
  //   await element(by.text("Logout")).tap();

  //   // Check login button is visible
  //   await expect(element(by.text('Log in'))).toBeVisible();
  // })

});
