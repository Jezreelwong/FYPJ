class BookingIssueModel {
  constructor(bookingCode, reportIssue, bookingIssueStatus, bookingIssueFindings, bookingUnit, updatedBy) {
    this.bookingCode = bookingCode;
    this.reportIssue = reportIssue;
    this.bookingIssueStatus = bookingIssueStatus;
    this.bookingIssueFindings = bookingIssueFindings;
    this.bookingUnit = bookingUnit;
    this.updatedBy = updatedBy;
  }

  convertObjToJSON() {
    return JSON.stringify({
      body:
        JSON.stringify({
        bookingCode: this.bookingCode,
        reportIssue: this.reportIssue,
        bookingIssueStatus: this.bookingIssueStatus,
        bookingIssueFindings: this.bookingIssueFindings,
        bookingUnit: this.bookingUnit,
        updatedBy: this.updatedBy,
      })
    });
  }
}

export default BookingIssueModel;
