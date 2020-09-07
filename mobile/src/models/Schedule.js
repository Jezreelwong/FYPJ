export default class Schedule {
  constructor(scheduleId, departureTime, maxLimit, available) {
    this.scheduleId = scheduleId;
    this.departureTime = departureTime;
    this.maxLimit = maxLimit;
    this.available = available;
  }
}