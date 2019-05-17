import Heading from '../softsprocket/textlayout/heading.js';
import Preformatted  from './textlayout/preformatted.js';
import Paragraph from '../softsprocket/textlayout/paragraph.js';
import Anchor from '../softsprocket/textlayout/anchor.js';

export default class EditorMode {
    constructor(value, text) {
        this.value = value;
        this.text = text;
        this.content = "";
        this.element = undefined;
    }

    getContent () {
        return this.content;
    }

    setContent (text) {
        this.content = text;
    }

    getValue () {
        return this.value;
    }

    getText () {
        return this.text;
    }
}

class HeadingOneMode extends EditorMode {
    constructor () {
        super (0, 'Heading One');
    }

    createElement (cls) {
        return new Heading.One(cls);       
    }
}

class HeadingTwoMode extends EditorMode {
    constructor () {
        super (1, 'Heading Two');
    }

    createElement (cls) {
        return new Heading.Two(cls);       
    }
}

class HeadingThreeMode extends EditorMode {
    constructor () {
        super (2, 'Heading Three');
    }

    createElement (cls) {
        return new Heading.Three(cls);       
    }
}


class ParagraphMode extends EditorMode {
    constructor () {
        super (3, 'Paragraph');
    }

    createElement (cls) {
        return new Paragraph(cls);       
    }
}

class PreformattedMode extends EditorMode {
    constructor () {
        super (4, 'Preformatted');
    }

    createElement (cls) {
        return new Preformatted(cls);       
    }
}

class AnchorMode extends EditorMode {
    constructor () {
        super (5, 'Anchor');
    }

    createElement (cls) {
        return new Anchor(cls);       
    }
}

EditorMode.Modes = {};
EditorMode.Modes.HeadingOne = Object.assign(HeadingOneMode);
EditorMode.Modes.HeadingTwo = Object.assign(HeadingTwoMode);
EditorMode.Modes.HeadingThree = Object.assign(HeadingThreeMode);
EditorMode.Modes.Paragraph = Object.assign(ParagraphMode);
EditorMode.Modes.Preformatted = Object.assign(PreformattedMode);
EditorMode.Modes.Anchor = Object.assign(AnchorMode);