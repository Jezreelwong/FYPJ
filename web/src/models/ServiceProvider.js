class ServiceProviderModel {
  constructor(
    spId,
    name,
    startDate,
    endDate,
    serviceProviderType,
    updatedBy,
    createdBy
  ) {
    this.spId = spId;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.serviceProviderType = serviceProviderType;
    this.updatedBy = updatedBy;
    this.createdBy = createdBy;
  }

  convertObjToJSON() {
    return JSON.stringify({
      body:
        JSON.stringify({
        spId: this.spId,
        name: this.name,
        startDate: this.startDate,
        endDate: this.endDate,
        serviceProviderType: this.serviceProviderType,
        updatedBy: this.updatedBy,
        createdBy: this.createdBy,
      })
    });
  }
}

export default ServiceProviderModel;
