import Utils from "./Utils";

function Editor(dom) {
    this.dom = dom;
    this.nodes = {};
    this.links = {};

}

Editor.prototype = {
    addNode : function(node) {
        node.id = Utils.generateUID();
        this.nodes[node.uid] = node;
        this.dom.appendChild(node.dom)
    },

    removeNode : function(node) {
        node.dom.remove();
        delete this.nodes[node.uid];
    },

    
}

export default Editor;