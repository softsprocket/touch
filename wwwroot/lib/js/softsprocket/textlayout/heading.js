import Element from '../element.js';

export default class Heading extends Element {
    constructor (el) {
        super (el);
    }
}

class One extends Heading {
    constructor (cls) {
        super ('h1');
        this.addClass(cls);
    }
}

Heading.One = Object.assign(One);

class Two extends Heading {
    constructor (cls) {
        super ('h2');
        this.addClass(cls);
    }
}

Heading.Two = Object.assign(Two);

class Three extends Heading {
    constructor (cls) {
        super ('h3');
        this.addClass(cls);
    }
}

Heading.Three = Object.assign(Three);
