class SPFeedbackModel {
  constructor(
    spFeedbackId,
    bookingCode,
    feedbackType,
    comments,
    status,
    findings,
    deduct,
    bookingUnit,
    updatedBy,
  ) {
    this.spFeedbackId = spFeedbackId;
    this.bookingCode = bookingCode;
    this.feedbackType = feedbackType;
    this.comments = comments;
    this.status = status;
    this.findings = findings;
    this.deduct = deduct;
    this.bookingUnit = bookingUnit;
    this.updatedBy = updatedBy;
  }

  convertObjToJSON() {
    return JSON.stringify({
      body:
        JSON.stringify({
        spFeedbackId: this.spFeedbackId,
        bookingCode: this.bookingCode,
        feedbackType: this.feedbackType,
        comments: this.comments,
        status: this.status,
        findings: this.findings,
        deduct: this.deduct,
        bookingUnit: this.bookingUnit,
        updatedBy: this.updatedBy,
      })
    });
  }
}

export default SPFeedbackModel;
