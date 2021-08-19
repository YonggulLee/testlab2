'use strict';
// Object-oriendted programming
// class : template
// objesct : instance of a class
// JavaScript class
// - introduced in ES6
// - syntactical sugar over prototype-based inheritance

// 1. Class declarations
class Person {
  //constructor
  constructor(name, age) {
    //
    this.name = name;
    this.age = age;
  }
  //methods
  speak() {
    console.log(`${this.name} : hellow!`);
  }
}

const ellie = new Person('ellie', 20);
console.log(ellie.name);
console.log(ellie.age);
ellie.speak();

// 2.Getter and Setters
class User {
  constructor(firstName, lastName, age) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }

  get age() {
    return this._age;
  }

  set age(value) {
    // if (value < 0) {
    //   throw Error ('age can not be negative');
    // }
    // this._age = value;
    this._age = value < 0 ? 0 : value;
  }
}

const user = new User('Stive', 'Jobs', -1);
console.log(user.age);

// 3. Fields (public, Private)
// Too soon!
// Url..
class Expertiment {
  publicField = 2;
  #privateField = 0;
}

const experiment = new Expertiment();
console.log(experiment.publicField);
// console.log(experiment.privateField); Error

// 4. Static properties and methods
// Too Soon!
class Article {
  static publisher = 'Dream Coding';
  constructor(articleNumber) {
    this.articleNumber = articleNumber;
  }

  static printPublisher() {
    console.log(Article.publisher);
  }
}

const article1 = new Article(1);
const article2 = new Article(2);

console.log(Article.publisher);
Article.printPublisher();

// 5. Inheritance
// a way for one class to extend another class.
class Shape {
  constructor(width, height, color) {
    this.width = width;
    this.height = height;
    this.color = color;
  }

  drow() {
    console.log(`drawing ${this.color} color of`);
  }

  getArea() {
    return this.width * this.height;
  }
}

class Rectangle extends Shape {}
class Triangle extends Shape {
  drow() {
    super.drow();
    console.log(`<|`);
  }
  getArea() {
    return (this.width * this.height) / 2;
  }
}

const rectangle = new Rectangle(20, 20, 'blue');
rectangle.drow();
const triangle = new Triangle(20, 20, 'blue');
triangle.drow();

// 6. Class checking: instanceOf
console.log(rectangle instanceof Rectangle);
console.log(triangle instanceof Rectangle);
console.log(triangle instanceof Triangle);
console.log(triangle instanceof Shape);
console.log(triangle instanceof Object);
console.log(rectangle.toString());
