class ReservationNotifier {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(reservation) {
    this.observers.forEach((observer) => observer.update(reservation));
  }
}

module.exports = ReservationNotifier;
