import Element from './element.js';

export default class ButtonGroup extends Element {
    constructor (direction) {
        super ('div');

        this.addClass('base-buttongroup-div');
        if (direction == ButtonGroup.Direction.Horizontal) {           
            this.addClass('base-horizontal-buttongroup-div');
        } else {
            this.addClass('base-vertical-buttongroup-div');
        }
    }

    addButton (button) {
        this.appendChild(button);
    }
} 

ButtonGroup.Direction = {
    Horizontal: 0,
    Vertical: 1
}