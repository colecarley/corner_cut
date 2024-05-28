class Cube {
    squares: Square[][][];
    constructor(s: Square[][][]) {
        this.squares = s;
    }

    L() {}

    R() {}

    U() {
        console.log(this.squares);
    }

    D() {}

    B() {}

    F() {}
}

class Face {
    squares: Square[][];

    constructor(f: Square[][]) {
        this.squares = f;
    }
}

type Square = "r" | "y" | "b" | "o" | "g" | "w";
