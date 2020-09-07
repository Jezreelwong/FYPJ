class VehicleModel {
  constructor(vehicleId, name, load, status, updatedBy, createdBy) {
    this.vehicleId = vehicleId;
    this.name = name;
    this.load = load;
    this.status = status;
    this.updatedBy = updatedBy;
    this.createdBy = createdBy;
  }

  convertObjToJSON() {
    return JSON.stringify({
      body:
        JSON.stringify({
        vehicleId: this.vehicleId,
        name: this.name,
        load: this.load,
        status: this.status,
        updatedBy: this.updatedBy,
        createdBy: this.createdBy,
      })
    });
  }
}

export default VehicleModel;
