import moment from "moment";

export default class Announcement {
  announcementId = '';
  title = '';
  message = '';
  createdBy = '';
  createdDate = '';
  role = '';

  constructor(
    announcementId,
    title,
    message,
    createdBy,
    createdDate,
    role
  ) {
    this.announcementId = announcementId;
    this.title = title;
    this.message = message;
    this.createdBy = createdBy;
    this.createdDate = createdDate;
    this.role = role;
  }

  static createAnnouncement(announcement) {
    const result = new Announcement(
      announcement.announcementId,
      announcement.title,
      announcement.message,
      announcement.createdBy,
      announcement.createdDate,
      announcement.role,
    );

    return result;
  }

}

