import { UIPanel } from "./ui.js";

class Socket {
    constructor()  {
        this.ui;
        this._initUI();
    }

    _initUI() {
        this.ui = new UIPanel().setClass("socket");
    }
}
export default Socket;