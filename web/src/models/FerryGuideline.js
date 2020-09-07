class FerryGuidelineModel {
  constructor(ferryGuidelineId, serviceProviderType, guidelines, status, updatedBy, createdBy) {
    this.ferryGuidelineId = ferryGuidelineId;
    this.serviceProviderType = serviceProviderType;
    this.guidelines = guidelines;
    this.status = status;
    this.updatedBy = updatedBy;
    this.createdBy = createdBy;
  }

  convertObjToJSON() {
    return JSON.stringify({
      body:
        JSON.stringify({
          ferryGuidelineId: this.ferryGuidelineId,
          serviceProviderType: this.serviceProviderType,
          guidelines: this.guidelines,
          status: this.status,
          updatedBy: this.updatedBy,
          createdBy: this.createdBy,
        })
    });
  }
}

export default FerryGuidelineModel;
