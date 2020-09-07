class SAFFeedbackModel {
  constructor(safFeedbackId, bookingCode, rating, comments, updatedBy, createdBy) {
    this.safFeedbackId = safFeedbackId;
    this.bookingCode = bookingCode;
    this.rating = rating;
    this.comments = comments;
    this.updatedBy = updatedBy;
    this.createdBy = createdBy;
  }

  convertObjToJSON() {
    return JSON.stringify({
      body:
          JSON.stringify({
        safFeedbackId: this.safFeedbackId,
        bookingCode: this.bookingCode,
        feedbackType: this.feedbackType,
        comments: this.comments,
        updatedBy: this.updatedBy,
        createdBy: this.createdBy,
      })
    });
  }
}

export default SAFFeedbackModel;
