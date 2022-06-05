
let Car = function (settings) {
  this.model = settings.model || "no model provided";
  this.color = settings.color || "no colour provided";
};

let Mixin = function () { };

Mixin.prototype = {
  driveForward: function () {
    console.log("drive forward");
  },

  driveBackward: function () {
    console.log("drive backward");
  },

  driveSideways: function () {
    console.log("drive sideways");
  }
}

function augment(receivingClass, givingClass) {
  for (let methodName in givingClass.prototype) {
    if (!Object.hasOwnProperty.call(receivingClass.prototype, methodName)) {
      receivingClass.prototype[methodName] = givingClass.prototype[methodName];
    }
  }
}

augment(Car, Mixin);

let myCar = new Car({
  model: "Ford Escort",
  color: "blue"
});

myCar.driveForward();
myCar.driveBackward();

augment(Car, Mixin);

let mySportsCar = new Car({
  model: "Porsche",
  color: "red"
});

mySportsCar.driveSideways();