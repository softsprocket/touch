import Element from "./element.js";
import FontAwesome from "./fontawesome.js";
import Select from "./select.js";
import EditorMode from './editormode.js';
import Heading from "./textlayout/heading.js";
import Paragraph from "./textlayout/paragraph.js";
import Panel from "./panel.js";
import TextInput from "./inputs/textinput.js";
import ButtonInput from "./inputs/buttoninput.js";
import ButtonGroup from "./buttongroup.js";
import LabeledInput from "./labeledinput.js";
import Label from "./label.js";
import Anchor from "./textlayout/anchor.js";

//import Preformatted from "./textlayout/preformatted.js";


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
        this.displayArea.addEventListener('click', function (ev) {
            var name = ev.target.getAttribute ('name');
            if (name == undefined) {
                this.header.modeSelect.setDisplayText ("Select Mode");
                this.header.selectionSelect.setAttribute('hidden', '');
            }
        }.bind(this));

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
            var mo = this.modeObjects[n];
            var txt = mo.getText();     
            this.modeSelect.setDisplayText(txt);
            
            if (this.editor.activeElement != undefined) {
                this.editor.activeElement.setEditable (false);
                if (this.editor.activeElement.getInnerHTML ().Length == 0) {
                    this.editor.document.removeChild (this.editor.activeElement);
                }
            }

            var el = mo.createElement (Editor.ModeClasses[txt]);
            
            this.addElement (el);       

        }.bind(this))

        this.appendChild(this.modeSelect);

        this.selectionObjects = [];
        var selections = [];

        for (var selection in EditorMode.Selections) {
            if (EditorMode.Selections.hasOwnProperty (selection)) {
                var m = new EditorMode.Selections[selection]();
                this.selectionObjects[m.getValue ()] = m;
                selections[m.getValue ()] = {
                    text: m.getText(),
                    value: m.getValue()
                };
            }
        }
        
        this.selectionSelect = new Select (selections);

        this.selectionSelect.addClass('base-editor-select');
        this.selectionSelect.setDisplayText ("Selection");
        this.selectionSelect.addOptionsPanelClass('base-editor-select-options-panel');
        this.selectionSelect.setAttribute('hidden', ''); 
        this.currentSelectionElements = [];
        this.numElements = 0;

        this.selectionSelect.onSelect (function (n) {
            var mo = this.selectionObjects[n];
            var txt = mo.getText();     
            console.log ('selection', txt);
            this.selectionSelect.setDisplayText(txt);
           
            if (txt == "Anchor") {
                console.log ('currentSelection', this.currentSelection);
                console.log ('currentSelection range', this.currentSelection.range);
                console.log ('currentSelection selection', this.currentSelection.selection);

                var range = this.currentSelection.range;

                var rect = range.getBoundingClientRect();

                var txt = range.startContainer.data;
                console.log (txt.slice(range.startOffset, range.endOffset));
                var displayVal = txt.slice(range.startOffset, range.endOffset);
                var preDisplay = txt.slice(0, range.startOffset);
                var postDisplay = txt.slice(range.endOffset, txt.length);
                console.log (preDisplay, postDisplay);

                console.log ('rect', rect);
                var anchorEditor = new AnchorEditor(displayVal, function () {
                    var link = anchorEditor.link.getValue();
                    if (link == "") {
                        return;
                    }

                    var anchor = new Anchor('editor-anchor');
                    anchor.setInnerHTML (displayVal);
                    anchor.setAttribute('href', link);

                    console.log (anchor.el);

                    var result = preDisplay + anchor.el.outerHTML + postDisplay;
                    console.log (result);
                    this.editor.activeElement.setInnerHTML(result);
                    anchorEditor.hide();
                    this.removeChild(anchorEditor);
                }.bind(this), function () { 
                    anchorEditor.hide();
                    this.removeChild(anchorEditor);
                }.bind (this));

                var offset = range.offsetLeft - Math.floor (anchorEditor.getWidth() / 2);
                anchorEditor.setTop (range.offsetTop + 'px');
                anchorEditor.setLeft (offset + 'px');
                this.appendChild(anchorEditor);
                anchorEditor.show ();
            }

            console.log (txt, Editor.SelectionClasses[txt]);

            var el = mo.createElement (Editor.SelectionClasses[txt]);
            
            console.log (el);    

        }.bind(this))

        this.appendChild(this.selectionSelect);



    }

    onSelection (ev) {
        console.log ('onSelection', ev)
        if (this.editor.activeElement.getTagName () != "PRE")  {
           this.selectionSelect.removeAttribute('hidden'); 
           this.currentSelection = ev;
            console.log ('onSelection', this.currentSelection);
        }
    }
    
    onSelectionClear (ev) {
        console.log ('onSelectionClear', ev)
        if (this.editor.activeElement.getTagName () != "PRE")  {
           this.selectionSelect.setAttribute('hidden', true); 
           this.currentSelection = undefined;
        }
    }
    
    
    addElement (el) {

        if (this.editor.activeElement != undefined) {
            this.editor.activeElement.removeEventListener('selection', this.onSelection.bind(this));
            this.editor.activeElement.removeEventListener('selectionClear', this.onSelectionClear.bind(this));
        }

        this.currentElements[this.numElements] = el;
        this.numElements++;
        el.setAttribute('name', this.numElements);

        el.addEventListener('click', function (ev) {
            if (this.editor.activeElement != undefined) {
                this.editor.activeElement.setEditable(false);
                if (this.editor.activeElement.getInnerHTML ().Length == 0) {
                    this.removeElement (this.editor.activeElement);
                }
            }

            var name = ev.target.getAttribute ('name');
            this.editor.activeElement = this.currentElements[name - 1];
            var tagname = this.editor.activeElement.getTagName();


            switch (tagname) {
                case 'H1':
                    this.modeSelect.setDisplayText('Heading One');
                    break;
                case 'H2':
                    this.modeSelect.setDisplayText('Heading Two');
                    break;
                case 'H3':
                    this.modeSelect.setDisplayText('Heading Three');
                    break;
                case 'P':
                    this.modeSelect.setDisplayText('Paragraph');
                    break;
                case 'PRE':
                    this.modeSelect.setDisplayText('Preformatted');
                    break;
            }

            this.editor.activeElement.setEditable(true);
            this.editor.activeElement.focus();
        }.bind(this));

        this.editor.document.appendChild(el);

        this.editor.activeElement = el;
        this.editor.activeElement.setEditable(true);
        
        this.editor.activeElement.addEventListener('selection', this.onSelection.bind(this));
        this.editor.activeElement.addEventListener('selectionClear', this.onSelectionClear.bind(this));

        this.editor.activeElement.focus();

    }

    removeElement (el) {
        el.removeEventListener('selection', this.selectListener.bind(this));
        el.removeEventListener('selectionClear', this.onSelectionClear.bind(this));

        this.editor.document.removeChild (el);
        var name = el.getAttribute('name');
        
        if (this.numElements != name) { 
            for (var i = name; i < this.numElements - 1; ++i) {
                this.currentElements[i] = this.currentElements[i + 1];
                this.currentElements[i].setAttribute('name', i);
            }

        }

        delete this.currentElements[this.numElements];
        this.numElements--;
    }
}

Editor.ModeClasses = {
    'Heading One': 'editor-heading-one',  
    'Heading Two': 'editor-heading-two',  
    'Heading Three': 'editor-heading-three',
    'Preformatted': 'editor-preformatted',
    'Paragraph': 'editor-paragraph'
};

Editor.SelectionClasses = {
    'Anchor': 'editor-anchor'
}

class EditorFooter extends Element {
    constructor () {
        super ('footer');
        this.addClass ('base-editor-footer');
    }
}

function isIn (tagName, tags) {

    for (var i in tags) {
        var tag = tags[i];
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
                if (e.isComposing || e.keyCode === 229) {
                    return;
                }

                var activeEl = this.editor.activeElement;

                var tagname = activeEl.getTagName();
                

                if (e.key == "Enter" && isIn (tagname, ['H1', 'H2', 'H3', 'P'])) {
                    var header = this.editor.header;
                    
                    if (activeEl.getInnerHTML().trim () == "") {
                        header.removeElement (activeEl);
                    }

                    var modeSelect = header.modeSelect; 
                    switch (tagname) {
                        case 'H1':
                            activeEl = new Heading.Two(Editor.ModeClasses['Heading Two']);
                            modeSelect.setDisplayText('Heading Two');
                            break;
                        case 'H2':
                            activeEl = new Heading.Three(Editor.ModeClasses['Heading Three']);
                            modeSelect.setDisplayText('Heading Three');
                            break;
                        case 'H3':
                            activeEl = new Paragraph(Editor.ModeClasses['Paragraph']);
                            modeSelect.setDisplayText('Paragraph');
                            break;
                        case 'P':
                            activeEl = new Paragraph(Editor.ModeClasses['Paragraph']);
                            modeSelect.setDisplayText('Paragraph');
                            break;
                    }
                        
                    header.addElement(activeEl);
                    e.preventDefault ();

                    return;
                } else if (e.key == "Tab") {
                    e.preventDefault ();

                    console.log ('tagname', tagname, tagname == "PRE", isIn (tagname, ['PRE']));
                    if (tagname == 'PRE') {
                        var sel = document.getSelection();
                        var range = sel.getRangeAt(0);
                        var tabNode = document.createTextNode('\t');
                        range.insertNode(tabNode);
                        sel.collapseToEnd();
                    }
                }
            }
        }.bind(this));

    }
}

class AnchorEditor extends Panel {
    constructor (txt, okfn, cancelfn) {
        super();
        this.addClass('editor-anchor-editor');
        this.selectedText = new TextInput();
        this.selectedText.setValue(txt);
        this.selectedText.addClass('anchor-editor-selected-text');
        this.labeledText = new LabeledInput(new Label('SelectedText', 'Text: '), this.selectedText);
        this.labeledText.addClass('anchor-editor-text');
        this.appendChild(this.labeledText);
        
        this.link = new TextInput();
        this.link.addClass('anchor-editor-link-text');
        this.labeledLink = new LabeledInput(new Label('LinkText', 'Link: '), this.link);
        this.labeledLink.addClass('anchor-editor-link');
        this.appendChild(this.labeledLink);

        this.buttonGroup = new ButtonGroup (ButtonGroup.Direction.Horizontal);
        this.cancelButton = new ButtonInput ('Cancel');
        this.cancelButton.addEventListener('click', cancelfn);

        this.buttonGroup.appendChild(this.cancelButton);
        this.okButton = new ButtonInput ('Ok');
        this.okButton.addEventListener('click', okfn);
        this.buttonGroup.appendChild(this.okButton);
        this.buttonGroup.addClass('anchor-editor-buttongroup');
        this.appendChild(this.buttonGroup);

    }
}
