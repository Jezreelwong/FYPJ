describe('Login', () => {
  // beforeEach(async () => {
  //   await device.reloadReactNative();
  // });


  it("Log in as bluefrog (PU)", async () => {
    await device.reloadReactNative();

    await element(by.id('UsernameInput')).typeText('bluefrog');
    await element(by.id('PasswordInput')).typeText('P@ssw0rd');
    await element(by.text('Log in')).tap();

    // Check if bottom tab is generated
    await expect(element(by.text('Home'))).toBeVisible();
    await expect(element(by.text('Booking'))).toBeVisible();
    await expect(element(by.text('Announcement'))).toBeVisible();
    await expect(element(by.text('Account'))).toBeVisible();

    // Log out
    await element(by.text("Account")).tap();
    await element(by.text("Logout")).tap();

    // Check login button is visible
    await expect(element(by.text('Log in'))).toBeVisible();
  })

  it("Log in as lionadmin (A)", async () => {
    // await device.reloadReactNative();

    await element(by.id('UsernameInput')).typeText('lionadmin');
    await element(by.id('PasswordInput')).typeText('P@ssw0rd');
    await element(by.text('Log in')).tap();

    // Check if top header is generated
    await expect(element(by.text('Pending Requests'))).toBeVisible();

    // Log out
    await element(by.text("Account")).tap();
    await element(by.text("Logout")).tap();

        // Check login button is visible
    await expect(element(by.text('Log in'))).toBeVisible();
  })

  // it('Forgot Password button visible', async () => {
  //   await element(by.text('Forgot Password?')).tap();
  //   await expect(element(by.text('Send OTP to Email'))).toBeVisible();
  // });

});
