class ScheduleTemplateModel {
  constructor(
    serviceProviderType,
    routeId,
    schedule
  ) {
    this.serviceProviderType = serviceProviderType;
    this.routeId = routeId;
    this.schedule = schedule;
  }

  convertObjToJSON() {
    return JSON.stringify({
      body:
        JSON.stringify({
        serviceProviderType: this.serviceProviderType,
        routeId: this.routeId,
        schedule: this.schedule,
      })
    });
  }
}

export default ScheduleTemplateModel;
