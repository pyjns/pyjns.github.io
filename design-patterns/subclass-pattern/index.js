
let Person = function (firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.gender = "male";
};

let clark = new Person("Clark", "Kent");

let SuperHero = function (firstName, lastName, powers) {

  Person.call(this, firstName, lastName);

  this.powers = powers;
}

SuperHero.prototype = Object.create(Person.prototype);

let superman = new SuperHero("Clark", "Kent", ["flight", "heat-vision"]);

console.log(superman);