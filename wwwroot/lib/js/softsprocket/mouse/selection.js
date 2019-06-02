
class Selection extends Event {
    constructor (el) {
        super ("selection");
        this.el = el;
        this.el.addEventListener ('mouseup', function () {
            var sel = document.getSelection();
            var range = sel.getRangeAt(0);
            console.log (sel, range);
            console.log (range.startOffset, range.endOffset);
            if (range.endOffset != range.startOffset) {
                this.range = range;
                this.selection = sel;
                this.el.dispatchEvent (this);
            }
        }.bind(this));
    }

}

class SelectionClear extends Event {
    constructor (el) {
        super ("selectionClear");
        this.el = el;
        this.el.addEventListener ('mouseup', function () {
            var sel = document.getSelection();
            var range = sel.getRangeAt(0);
            console.log (sel, range);
            console.log (range.startOffset, range.endOffset);
            if (range.endOffset == range.startOffset) {
                this.el.dispatchEvent (this);
            }
        }.bind(this));
    }

}

var SelectionEvents = {
    Selection: Object.assign(Selection),
    SelectionClear: Object.assign(SelectionClear)
};

export default SelectionEvents;