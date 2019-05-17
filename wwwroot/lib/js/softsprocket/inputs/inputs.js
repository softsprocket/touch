import TextInput from './textinput.js';
import EmailInput from './emailinput.js';
import ButtonInput from './buttoninput.js';


var Inputs = {
    Text: Object.assign(TextInput),
    Email: Object.assign(EmailInput),
    Button: Object.assign(ButtonInput)
};

export default Inputs;