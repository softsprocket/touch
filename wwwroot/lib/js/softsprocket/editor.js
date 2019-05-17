import Element from "./element.js";
import FontAwesome from "./fontawesome.js";
import Select from "./select.js";
import EditorMode from './editormode.js';



export default class Editor extends Element {
    constructor () {
        super ('div');
        this.addClass ('base-editor');
        this.header = new EditorHeader(this);
        this.footer = new EditorFooter();
        this.displayArea = new EditorDisplayArea(this);
        this.appendChild (this.header);
        this.appendChild (this.displayArea);
        this.appendChild (this.footer);
        this.document = new Element ('div');
        this.displayArea.appendChild (this.document);
        this.activeElement = undefined;
    }
}


class EditorHeader extends Element {
    constructor (editor) {
        super ('header');
        this.editor = editor;
        this.addClass ('base-editor-header');

        this.editIcon = new FontAwesome('fa-edit');
        this.editIcon.addClass("base-editor-toolbar-icon-style");
        this.appendChild(this.editIcon);

        this.modeObjects = [];
        var modes = [];

        for (var mode in EditorMode.Modes) {
            if (EditorMode.Modes.hasOwnProperty (mode)) {
                var m = new EditorMode.Modes[mode]();
                this.modeObjects[m.getValue ()] = m;
                modes[m.getValue ()] = {
                    text: m.getText(),
                    value: m.getValue()
                };
            }
        }
        
        this.modeSelect = new Select (modes);

        this.modeSelect.addClass('base-editor-select');
        this.modeSelect.setDisplayText ("Select Mode");
        this.modeSelect.addOptionsPanelClass('base-editor-select-options-panel');

        this.currentElements = [];
        this.numElements = 0;

        this.modeSelect.onSelect (function (n) {
            if (this.editor.activeElement != undefined) {
                this.editor.activeElement.removeAttribute ('contentEditable');
                if (this.editor.activeElement.getInnerHTML ().Length == 0) {
                    this.editor.document.removeChild (this.editor.activeElement);
                }
            }

            var mo = this.modeObjects[n];
            var txt = mo.getText();            
            this.modeSelect.setDisplayText(txt);
            var el = mo.createElement (Editor.ModeClasses[txt]);
            this.currentElements[this.numElements] = el;
            el.setAttribute('name', this.numElements);
            this.numElements++;

            el.addEventListener('click', function (ev) {
                if (this.editor.activeElement != undefined) {
                    this.editor.activeElement.removeAttribute ('contentEditable');
                    if (this.editor.activeElement.getInnerHTML ().Length == 0) {
                        this.editor.document.removeChild (this.editor.activeElement);
                    }
                }

                console.log (ev, ev.target);
                var name = ev.target.getAttribute ('name');
                this.editor.activeElement = this.currentElements[name];
                this.editor.activeElement.setAttribute ('contentEditable', true);
                this.editor.activeElement.focus();
            }.bind(this));

            this.editor.document.appendChild(el);
            this.editor.activeElement = el;

            this.editor.activeElement.setAttribute ('contentEditable', true);

            this.editor.activeElement.focus();

        }.bind(this))

        this.appendChild(this.modeSelect);
    }


}

Editor.ModeClasses = {
    'Heading One': 'editor-heading-one',  
    'Heading Two': 'editor-heading-two',  
    'Heading Three': 'editor-heading-three',
    'Preformatted': 'editor-preformatted',
    'Paragraph': 'editor-paragraph',
    'Anchor': 'editor-anchor'  
};

class EditorFooter extends Element {
    constructor () {
        super ('footer');
        this.addClass ('base-editor-footer');
    }
}

function isIn (tagName, tags) {

    for (var i in tags) {
        var tag = tags[i];
        console.log (tag, tagName, tag == tagName);
        if (tagName == tag) {
            return true;
        }
    }

    return false;
}

class EditorDisplayArea extends Element {
    constructor (editor) {
        super ('div');
        this.editor = editor;

        this.addClass ('base-editor-displayarea');
        this.setAttribute ('tabindex', 0);

        this.addEventListener('keydown', function (e) {
            if (this.editor.activeElement) {
                console.log (e.keyCode, e.key);
                if (e.isComposing || e.keyCode === 229) {
                    return;
                }

                if (e.key == "Enter" && isIn (this.editor.activeElement.getTagName(), ['H1', 'H2', 'H3'])) {
                    e.preventDefault ();
                    return;
                } else  if (e.key == "Enter" && isIn (this.editor.activeElement.getTagName(), ['PARAGRAPH', 'ANCHOR'])) {
                    this.editor.activeElement.appendChild(new Element('br'));
                    e.preventDefault ();
                    return;
                }
            }
        }.bind(this));

    }
}
