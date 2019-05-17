import Element from "./element.js";
import Inputs from "./inputs/inputs.js";
import TextArea from "./textarea.js";
import ButtonGroup from './buttongroup.js';
import Popup from './popup.js';

export default class Contact extends Element {
    constructor(handler) {
        super('div');
        this.addClass('base-contact-div');

        this.nameInput = new Inputs.Text();
        this.nameInput.setPlaceholder ("Your name");
        this.nameInput.setRequired(true);

        this.appendChild(this.nameInput);

        this.emailInput = new Inputs.Email();
        this.emailInput.setPlaceholder("Your email");
        this.emailInput.setRequired(true);

        this.appendChild(this.emailInput);

        this.messageInput = new TextArea();
        this.messageInput.setPlaceholder("Your message");

        this.appendChild(this.messageInput);
       
        this.clearButton = new Inputs.Button("Clear");

        this.clearButton.addEventListener ('click', function () {
            this.messageInput.setValue ("");
        }.bind(this));


        this.sendButton = new Inputs.Button("Send");

        this.sendButton.addEventListener ('click', function () {
            if (this.emailInput.getValue () == "" || this.nameInput.getValue () == "" || this.messageInput.getValue () == "") {
                this.setErrorMessage ("All fields are required");
                return;
            }

            var rect = this.getBoundingClientRect();
            var parent = this.getParent ();
            this.continuePopup = new ContinuePopup (handler, parent);
            this.continuePopup.setTop('0px');
            this.continuePopup.setLeft('0px');
            this.continuePopup.setWidth (`${this.getWidth()}px`);
            this.continuePopup.setHeight (`${this.getHeight()}px`);

            this.continuePopup.show();
        }.bind(this));
        
        this.buttonGroup = new ButtonGroup(ButtonGroup.Direction.Horizontal);
        this.buttonGroup.addButton(this.sendButton);
        this.buttonGroup.addButton(this.clearButton);

        this.appendChild(this.buttonGroup);

        this.outputMessageDiv = new Element ('div');
        this.outputMessageDiv.addClass ('base-contact-error-msg');
        this.appendChild (this.outputMessageDiv);

    }

    getEmail () {
        return this.emailInput.getValue();
    }

    getName () {
        return this.nameInput.getValue();
    }

    getMessage () {
        return this.messageInput.getValue();
    }

    setErrorMessage (msg) {
        this.outputMessageDiv.setInnerHTML (msg);   
    }
}

class ContinuePopup extends Popup {
    constructor(handler, parent) {
        super();

        this.addClass ("base-continue-popup");
  
        var textEl = new Element ('div');
        textEl.addClass ("base-continue-text-popup");
        textEl.setInnerHTML ("One more thing if you don't mind.")

        var button = new Inputs.Button("Click me to prove you're not a Robot!");
        button.addClass ("base-continue-button");

        var robotInput = new Inputs.Text();
        robotInput.setPlaceholder ("Robots only");
        robotInput.addClass ("base-rbt-input");
        this.appendChild (robotInput);

        button.addEventListener('click', function () {
            if (robotInput.getValue () == "") {
                handler ();
            }

            this.removeChild (button);
            this.removeChild (robotInput);
            textEl.setInnerHTML ("Thank you. You message has been sent.");

        }.bind(this));

        this.appendChild (textEl);
        this.appendChild (button)
        parent.appendChild(this);
    }   
}