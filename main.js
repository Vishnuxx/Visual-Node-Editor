import Node from "./js/Node.js";
import { UIButton } from "./js/ui.js";
import Utils from "./js/Utils.js";

const editorpane = document.getElementById("editorpane");
const tools = document.getElementById("tools");

const canvas = document.querySelector(".canvas")
const linkpane = document.querySelector(".linkpane");

const path = Path(getRandomColor() , 2, "round", "none");
const svg = createSVG()
svg.appendChild(path);
linkpane.appendChild(svg)
drawBeizer(path, 300, 100, 600, 200);

function createSVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.minWidth = "fill-parent";
  svg.style.minHeight = canvas.style.height;
  svg.style.height = "inherit";
  svg.style.width = "inherit";
  // svg.style.borderBox = "border-box";
  svg.style.position = "relative";
  svg.style.background = "#262626";
  return svg;
}

function Path(color, strokewidth, linecap, fill) {
  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-width", strokewidth);
  path.setAttribute("stroke-linecap", linecap);
  path.setAttribute("fill", fill);
  return path;
}

function drawBeizer(path, x1, y1, x2, y2) {
  let xdiff = (x2 + x1) / 2;
  path.setAttribute(
    "d",
    `M${x1} , ${y1} C ${xdiff}, ${y1} ${xdiff} ,${y2} ${x2},${y2}`
  );
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}




const node = new Node();
const node1 = new Node();
dragElement(node.dom)
dragElement(node1.dom);
canvas.appendChild(node.dom);
canvas.appendChild(node1.dom);


function dragElement(elem) {
  var candrag = false;
  var top = canvas.getBoundingClientRect().top,
    left = canvas.getBoundingClientRect().left,
    pos3 = 0,
    pos4 = 0;

    elem.onmousedown = onStart;
    elem.ontouchdown = onStart;
  
  

  function onStart(e) {
    candrag = true;
    e = e || window.event;
    e.preventDefault();

     var ev = e.type == "touchmove" ? e.touches[0] : e;
    pos3 = ev.offsetX;
    pos4 = ev.offsetY;

    canvas.onmousemove = onMove;
    canvas.onmouseup = onEnd;

     elem.ontouchmove = onMove;
     elem.ontouchend = onEnd;
  }

  function onMove(e) {
    if (candrag) {
      e = e || window.event;
      e.preventDefault();

      var ev = (e.type == "touchmove")? e.touches[0] : e;
      elem.style.top =
        ev.clientY - top - pos4+ "px";
      elem.style.left = ev.clientX - left - pos3+ "px"; //elem.offsetLeft - pos1 + "px";
      console.table({
          "pos3" : pos3,
          "pos2" : left,
          "client" : ev.clientX,
          "style" :elem.style.left
        })
    }
   
}

  function onEnd() {
    candrag = false;
    
    canvas.onpointermove = null;
    canvas.onpointerup = null;
  }
}