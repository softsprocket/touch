import Element from '../element.js';

export default class Input extends Element {
    constructor(type) {
        super('input');
        this.setAttribute('type', type);
    }
    
    setName (name) {
        this.setAttribute("name", name);
    }

    setAutocomplete (value) {
        this.setAttribute("autocomplete", value);
    }

    setAutofocus (value) {
        this.setAttribute("autofocus", value);
    }
    
    setDisabled (value) {
        this.setAttribute("disabled", value);
    }
    
    setForm (value) {
        this.setAttribute("form", value);
    }
    
    setList (value) {
        this.setAttribute("list", value);
    }
    
    setReadonly (value) {
        this.setAttribute("readonly", value);
    }
    
    setRequired (value) {
        this.setAttribute("required", value);
    }
    
    setTabindex (value) {
        this.setAttribute("tabindex", value);
    }
    
    setType (value) {
        this.setAttribute("type", value);
    }
    
    setValue (value) {
        this.setAttribute("value", value);
    }

    getValue () {
        return this.el.value;
    }
}