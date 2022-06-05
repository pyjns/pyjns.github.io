
function Subject() {
  this.observersList = new ObserverList();
}

Subject.prototype.addObserver = function (observer) {
  this.observersList.add(observer);
}

Subject.prototype.removeObserver = function (observer) {
  this.observersList.removeAt(this.observers.indexOf(observer, 0))
}

Subject.prototype.notify = function (context) {
  let observersListLength = this.observersList.count();
  for (let i = 0; i < observersListLength; i++) {
    this.observersList.get(i).update(context);
  }
}