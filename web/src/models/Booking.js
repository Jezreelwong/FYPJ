class BookingModel {
  constructor(
    roleId,
    bookingCode,
    departureDate,
    departureTime,
    bookingUnit,
    displayUserName,
    scheduleId,
    purposeId,
    routeId,
    advancedNotice,
    serviceProviderType,
    bookingType,
    status,
    remarks,
    totalLoad,
    vehicles,
    numPassenger,
    bookingGroup,
    createdBy,
    updatedBy,
    performanceRating,
    recurring,
    endRepeatDate,
    cancellationReason,
    rejectedReason,
  ) {
    this.roleId = roleId
    this.bookingCode = bookingCode;
    this.departureDate = departureDate;
    this.departureTime = departureTime;
    this.bookingUnit = bookingUnit;
    this.displayUserName = displayUserName;
    this.scheduleId = scheduleId;
    this.purposeId = purposeId;
    this.routeId = routeId;
    this.advancedNotice = advancedNotice;
    this.serviceProviderType = serviceProviderType;
    this.bookingType = bookingType;
    this.status = status;
    this.remarks = remarks;
    this.totalLoad = totalLoad
    this.vehicles = vehicles;
    this.numPassenger = numPassenger;
    this.bookingGroup = bookingGroup;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.performanceRating = performanceRating;
    this.recurring = recurring;
    this.endRepeatDate = endRepeatDate;
    this.cancellationReason = cancellationReason;
    this.rejectedReason = rejectedReason;
  }

  convertObjToJSON() {
    return JSON.stringify({
      body: JSON.stringify({
        roleId: this.roleId,
        bookingCode: this.bookingCode,
        departureDate: this.departureDate,
        departureTime: this.departureTime,
        bookingUnit: this.bookingUnit,
        displayUserName: this.displayUserName,
        scheduleId: this.scheduleId,
        purposeId: this.purposeId,
        routeId: this.routeId,
        advancedNotice: this.advancedNotice,
        serviceProviderType: this.serviceProviderType,
        bookingType: this.bookingType,
        status: this.status,
        remarks: this.remarks,
        totalLoad: this.totalLoad,
        vehicles: this.vehicles,
        numPassenger: this.numPassenger,
        bookingGroup: this.bookingGroup,
        createdBy: this.createdBy,
        updatedBy: this.updatedBy,
        performanceRating: this.performanceRating,
        recurring: this.recurring,
        endRepeatDate: this.endRepeatDate,
        cancellationReason: this.cancellationReason,
        rejectedReason: this.rejectedReason,
      }),
    });
  }
}

export default BookingModel;
