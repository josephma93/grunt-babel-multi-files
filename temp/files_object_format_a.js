"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sum = sum;
exports.pi = void 0;

var math = _interopRequireWildcard(require("lib/math"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

console.log("2π = " + math.sum(math.pi, math.pi));

function sum(x, y) {
  return x + y;
}

var pi = 3.141593;
exports.pi = pi;
"use strict";

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
"use strict";

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
//# sourceMappingURL=files_object_format_a.js.map