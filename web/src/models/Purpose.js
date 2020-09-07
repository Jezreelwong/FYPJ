class PurposeModel {
  constructor(
    purposeId,
    purposeShort,
    purposeDesc,
    serviceProviderType,
    status,
    updatedBy,
    createdBy
  ) {
    this.purposeId = purposeId;
    this.purposeShort = purposeShort;
    this.purposeDesc = purposeDesc;
    this.serviceProviderType = serviceProviderType;
    this.status = status;
    this.updatedBy = updatedBy;
    this.createdBy = createdBy;
  }

  convertObjToJSON() {
    return JSON.stringify({
      body:
        JSON.stringify({
        purposeId: this.purposeId,
        purposeShort: this.purposeShort,
        purposeDesc: this.purposeDesc,
        serviceProviderType: this.serviceProviderType,
        status: this.status,
        updatedBy: this.updatedBy,
        createdBy: this.createdBy,
      })
    });
  }
}

export default PurposeModel;
