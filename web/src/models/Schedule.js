class ScheduleModel {
  constructor(
    scheduleId,
    departureDate,
    departureTime,
    maxLimit,
    routeId,
    status,
    serviceProviderType,
    endRepeatDate,
    recurring,
    createdBy,
    updatedBy,
  ) {
    this.scheduleId = scheduleId;
    this.departureDate = departureDate;
    this.departureTime = departureTime;
    this.maxLimit = maxLimit;
    this.routeId = routeId;
    this.status = status;
    this.serviceProviderType = serviceProviderType;
    this.endRepeatDate = endRepeatDate;
    this.recurring = recurring; // eg. 1;2;3 (Day of the week)
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }

  convertObjToJSON() {
    return JSON.stringify({
      body:
        JSON.stringify({
        scheduleId: this.scheduleId,
        departureDate: this.departureDate,
        departureTime: this.departureTime,
        maxLimit: this.maxLimit,
        routeId: this.routeId,
        status: this.status,
        serviceProviderType: this.serviceProviderType,
        endRepeatDate: this.endRepeatDate,
        recurring: this.recurring,
        createdBy: this.createdBy,
        updatedBy: this.updatedBy,
      })
    });
  }
}

export default ScheduleModel;
