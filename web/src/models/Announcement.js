class AnnouncementModel {
  constructor(createdBy, message, targetAudience) {
    this.createdBy = createdBy;
    this.message = message;
    this.targetAudience = targetAudience;
  }

  convertObjToJSON() {
    return JSON.stringify({
      body:
        JSON.stringify({
        createdBy: this.createdBy,
        message: this.message,
        targetAudience: this.targetAudience,
      })
    });
  }
}

export default AnnouncementModel;
