class SkinnedMesh extends THREE.Mesh {
    constructor(geometry, materials) {
        super(geometry, materials);

        this.idMatrix = SkinnedMesh.defaultMatrix();
        this.bones = [];
        this.boneMatrices = [];
        //...
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