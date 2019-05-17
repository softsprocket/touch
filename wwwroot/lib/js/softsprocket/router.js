

export default class Router {
    constructor (config, defaultAction) {
        this.config = config;  
        this.defaultAction = defaultAction;

        window.onpopstate = function (event) {
            if (event.state != null) {
                if (!this.request (event.state.path)) {
                    this.defaultAction();
                }
            } else {
                this.defaultAction();
            }
        }.bind(this);

    }

    request (path) {

        var stateChange = this.getPathname() != path;

        var rv = false;
        var obj = this.config[path];
        if (obj != undefined) {
            obj.action();
            rv = true;
        } else {
            rv = false;   
        }
        path = rv ? path : "";

        if (stateChange) {
            window.history.pushState ({ path: path }, path, path);
        }

        return rv;
    }

    getPathname () {
        return document.location.pathname;
    }
}