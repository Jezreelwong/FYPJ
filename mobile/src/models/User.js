const UserRoles = {
  Unit: 'U',
  PrivilegedUser: 'PU',
  Admin: 'A',
  DutyPersonnel: 'DP',
  ServiceProvider: 'SP'
}

export default class User {
  constructor(username, accessToken, role, performanceRating, givenName, familyName, email, type, SPaverageRating)
  {
      this.username = username;
      this.accessToken = accessToken;
      this.role = role;
      this.performanceRating = performanceRating;
      if (givenName) givenName = givenName.trim();
      this.givenName = givenName;
      this.familyName = familyName;
      this.email = email;
      this.type = type;
      this.SPaverageRating = SPaverageRating;
  }
}

class UserDevice {
  constructor(platform, deviceToken)
  {
    this.platform = platform;
    this.deviceToken = deviceToken;
  }
}

export { UserRoles, UserDevice };
