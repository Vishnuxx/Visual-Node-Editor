import Socket from "./Socket.js";
import { UIButton, UIPanel, UIText } from "./ui.js";

class Node {
    constructor() {
        this.label = "vishnu";
        this.dom;
        this.inputs = [3,3,3,3,3];
        this.outputs = [3,3,3];
        
        this._initUI();
    }

    _initUI() {
       this.contents = new UIPanel().setClass("contents");//where the node props get rendered
       const dom =  new UIPanel().setClass("node");
       const head = new UIPanel().setClass("head").add(new UIText(this.label).setClass("label"));
       
       const body = new UIPanel().setClass("body"); // inputside > contents > outputside
       const inputSide = new UIPanel().setClass("inputSide")
       const outputSide = new UIPanel().setClass("outputSide")
       
       
     
       for(const i in this.inputs) {
           inputSide.add(new Socket().ui)
       }

       for(const i in this.outputs) {
          outputSide.add(new Socket().ui);
       }
    
        dom
           .add(inputSide)
           .add(body.add(head).add(this.contents))
           .add(outputSide);
       this.dom = dom.dom;
    }
}


export default Node;


