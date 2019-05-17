
export default class Request {
    constructor () {
        this.xhr = new XMLHttpRequest();
    }

    get (url, onload) {
        this.xhr.open("GET", url);
        if (onload != undefined) {
            this.xhr.addEventListener('load', onload);
        }

        this.xhr.send();
    }

    post (url, data, onload) {
        this.xhr.open("POST", url);
        if (onload != undefined) {
            this.xhr.addEventListener('load', onload);
        }

        this.xhr.send(data);
    }

    getState () {
        return this.xhr.readyState;
    }

    getResponse () {
        return this.xhr.response;
    }

    getResponseText () {
        return this.xhr.responseText;
    }

    getResponseType () {
        return this.xhr.responseType;
    }


    setReadyStateChange (fn) {
        this.xhr.onreadystatechange = fn;
    }

    abort () {
        this.xhr.abort();
    }

    getAllResponseHeaders () {
        return this.xhr.getAllResponseHeaders ();
    }
    
    getResponseHeader (header) {
        return this.xhr.getResponseHeader (header);
    }

    overrideMimeType (type) {
        this.xhr.overrideMimeType (type);
    }

    getStatus () {
        return this.xhr.status;
    }

    getStatusText () {
        return this.xhr.statusText;
    }
}

Request.ReadyState = {
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4
}