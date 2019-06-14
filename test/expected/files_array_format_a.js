import * as math from "lib/math";
console.log("2π = " + math.sum(math.pi, math.pi));
export function sum(x, y) {
  return x + y;
}
export var pi = 3.141593;
// Expression bodies
var odds = evens.map(v => v + 1);
var nums = evens.map((v, i) => v + i); // Statement bodies

nums.forEach(v => {
  if (v % 5 === 0) fives.push(v);
}); // Lexical this

var bob = {
  _name: "Bob",
  _friends: [],

  printFriends() {
    this._friends.forEach(f => console.log(this._name + " knows " + f));
  }

}; // Lexical arguments

function square() {
  let example = () => {
    let numbers = [];

    for (let number of arguments) {
      numbers.push(number * number);
    }

    return numbers;
  };

  return example();
}

square(2, 4, 7.5, 8, 11.5, 21); // returns: [4, 16, 56.25, 64, 132.25, 441]
class SkinnedMesh extends THREE.Mesh {
  constructor(geometry, materials) {
    super(geometry, materials);
    this.idMatrix = SkinnedMesh.defaultMatrix();
    this.bones = [];
    this.boneMatrices = []; //...
  }

  update(camera) {
    //...
    super.update();
  }

  static defaultMatrix() {
    return new THREE.Matrix4();
  }

}

var obj = {
  // Sets the prototype. "__proto__" or '__proto__' would also work.
  __proto__: theProtoObj,
  // Computed property name does not set prototype or trigger early error for
  // duplicate __proto__ properties.
  ['__proto__']: somethingElse,
  // Shorthand for ‘handler: handler’
  handler,

  // Methods
  toString() {
    // Super calls
    return "d " + super.toString();
  },

  // Computed (dynamic) property names
  ["prop_" + (() => 42)()]: 42
};