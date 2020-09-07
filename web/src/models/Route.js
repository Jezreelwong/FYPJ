class RouteModel {
  constructor(routeId, routeName, from, destination, serviceProviderType, status, updatedBy, createdBy) {
    this.routeId = routeId;
    this.routeName = routeName;
    this.from = from;
    this.destination = destination;
    this.serviceProviderType = serviceProviderType;
    this.status = status;
    this.updatedBy = updatedBy;
    this.createdBy = createdBy;
  }

  convertObjToJSON() {
    return JSON.stringify({
      body:
        JSON.stringify({
        routeId: this.routeId,
        routeName: this.routeName,
        from: this.from,
        destination: this.destination,
        serviceProviderType: this.serviceProviderType,
        status: this.status,
        updatedBy: this.updatedBy,
        createdBy: this.createdBy,
      })
    });
  }
}

export default RouteModel;
