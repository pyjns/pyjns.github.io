
function extend(obj, extension) {
  for (let key in extension) {
    obj[key] = extension[key];
  }
}

let controlCheckbox = document.getElementById("mainCheckbox");
let addBtn = document.getElementById("addNewObserver");
let container = document.getElementById("observersContainer");

// ConcreteSubject
// Extend the controlling checkbox with the Subject class
extend(controlCheckbox, new Subject());

// Clicking the checkbox will trigger notifications to its observers
controlCheckbox.onclick = function () {
  controlCheckbox.notify(controlCheckbox.checked);
}

// ConcreteObserver
addBtn.onclick = function () {

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  // Extend the checkbox with the Observer class
  extend(checkbox, new Observer());

  // Override with custom update behaviour
  checkbox.update = function (value) {
    this.checked = value;
  }

  // Add the new observer to our list of observers for our main subject
  controlCheckbox.addObserver(checkbox);

  container.appendChild(checkbox);
}