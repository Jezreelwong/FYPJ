import moment from "moment";

export default class Notification {
  notificationId = '';
  title = '';
  notificationType = '';
  message = '';
  bookingCode = '';
  createdDate = '';
  username = '';

  constructor(
    notificationId,
    title,
    notificationType = '',
    message,
    bookingCode,
    createdDate,
    username
  ) {
    this.notificationId = notificationId;
    this.title = title;
    this.notificationType = notificationType;
    this.message = message;
    this.bookingCode = bookingCode;
    this.createdDate = createdDate;
    this.username = username;
  }

  static createNotification(notification) {
    const result = new Notification(
      notification.notificationId,
      notification.title,
      notification.notificationType,
      notification.message,
      notification.bookingCode,
      notification.createdDate,
      notification.username,
    );

    return result;
  }

}

