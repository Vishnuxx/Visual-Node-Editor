var e= document.getElementById("editor");
var btn = document.getElementById("add");


var editor = new Editor();
e.appendChild(editor.editor);

function Obj() {
  ob = {
    label: "form",
    id: "@N1",
    color: "green",
    position: { x: 0 , y: 0 },
    isDraggable: true,
    sockets: [{
        id: "@N1s1",
        node: "@N1",
        type: "out",
        label: "response",
        connections: [] ,
        opCode:"*"
            },
     {
        id: "@N1s2",
        node: "@N1",
        type: "in",
        label: "request",
        connections: [] ,
        opCode:"*"
            },
      {
        id: "@N1s3",
        node: "@N1",
        type: "out",
        label: "y",
        connections: [] ,
        opCode:"*"
            }
            ],

    controldata: "" ,
    
    code:""
    
  }
  return ob;
}

btn.addEventListener("click", () => {
  ++nodeid;
  let ob = new Obj();
  ob.id = `@N${nodeid}`;
  for (let i = 0; i < ob.sockets.length; ++i) {
    ob.sockets[i].id = `${ob.id}s${i}`;
    ob.sockets[i].node = `@N${nodeid}`;
  }
  var node = new Node(ob.id, ob.label + nodeid, ob.color, ob.position, ob.isDraggable, ob.sockets, ob.controldata);
  editor.editor.appendChild(node.layout);
  node.addSockets();
  node.setTouch();
});

/*
  ________________GLOBAL_VARIABLES_________________
*/

let nodeid = 0;
let currentinput;
//let editor;
let allowMultipleInputConnections = true; //allows multiple input connections
let allowSimilarConnection = false; // allows sockets to draw connection between same connection type

let touchOffset = {x: 0 , y: -24}
let nodeProperties = {
                      color: "#263238" , 
                      opacity: 1 ,
                      borderRadius: 5
                     }
let socketProperties = {
                         color: "green" ,
                         dropIndicator: "yellow" ,
                         radius: 20 ,
                         boundary: 20 ,
                         border: "none"
                        }
 let wireProperties = {
                         color: "default" ,
                         thickness: 2 ,
                       }                       
function Editor(){
  this.editor = document.createElement("div");
  editor = this.editor;
  this.editor.className = "editor";
  
  this.svg = createSVG();
  this.svg.className = "svg";
  this.svg.style.minWidth = "fill-parent";
  this.svg.style.minHeight = this.editor.style.height;
  this.svg.style.height = "inherit";
  this.svg.style.width = "inherit";
 // this.svg.style.borderBox = "border-box";
  this.svg.style.position = "relative";
  this.svg.style.background = "#262626";
  this.editor.appendChild(this.svg);
 
  return this;
}

/*______________NODE CLASS_______________*/

function Node(id, label, color, position, drag, sockets, controls) {
  const datas = {
    name: label,
    id: id,
    color: color,
    position: position, // { x : x , y : y}
    isDraggable: drag,
    sockets: sockets, // [sockets]
    controldata: controls
  }
  this.editor;
  
  this.layout = document.createElement("div");
  this.headbar = document.createElement("div");
  this.title = document.createElement("p");
  this.controls = document.createElement("div");

  this.layout.id = datas.id;
  this.layout.className = "node";
  this.headbar.className = "node-headbar";
  this.title.className = "node-title"
  this.controls.className = "node-controlbar";

  this.layout.data = datas;
  this.title.innerText = label;
  this.headbar.style.borderBottom = "1px solid " + datas.color;

    this.controls.innerHTML = datas.controldata;
  this.layout.appendChild(this.headbar);
  this.headbar.appendChild(this.title);
  this.layout.appendChild(this.controls);

  return this;
}



//ADDING SOCKETS TO NODE 
Node.prototype.addSockets = function() {
  let count = this.layout.data.sockets.length;
  for (let i = 0; i < count; ++i) {
    let sockt = this.layout.data.sockets[i];
    let p = new Socket(sockt.id, sockt.node, sockt.type, sockt.label, sockt.connections);
    this.controls.appendChild(p.container);
    this.updateConnection(p);
  }
}


//FOR DRAGGING NODES
Node.prototype.setTouch = function() {
  if(this.layout.data.isDraggable){
  let offx = 0,offy = 0;
  this.headbar.addEventListener("touchstart", () => {
    offx = event.touches[0].offsetX;
    offy = event.touches[0].offsetY;
    currentnode = this;
  });

  this.headbar.addEventListener("touchmove", () => {
    event.preventDefault();
    this.layout.style.left = event.touches[0].pageX - $(editor.editor).offset().left + "px";
    this.layout.style.top = event.touches[0].pageY - $(editor.editor).offset().top + "px";
  });
  
  this.headbar.addEventListener("touchend" , ()=>{
   this.layout.data.position.x= this.layout.style.left;
   this.layout.data.position.y = this.layout.style.top;
  // console.log(this.layout.data.position);
  
  });
  }
}

//UPDATES CONNECTIONS WHILE NODE IS DRAGGED
Node.prototype.updateConnection = function(socket) {
 this.layout.addEventListener("touchmove", () => {
    let connections = socket.socket.data.connections;
    let x1 = $(socket.socket).offset().left + touchOffset.x;
    let y1 = $(socket.socket).offset().top + touchOffset.y;
    let i , length = connections.length;
    for (i = 0; i < length; ++i) {
      //console.log(`id : ${socket.socket.data.node} , connection: ${connections[i].socket} , path: ${connections[i].line}`);
      let sock = document.getElementById(connections[i].socket);
      let path = document.getElementById(connections[i].line);
      let x2 = $(sock).offset().left + touchOffset.x;
      let y2 = $(sock).offset().top + touchOffset.y;
      drawBeizer(path, x1, y1, x2, y2);
    }
  });
}



/*_________________SOCKET CLASS_________________*/


function Socket(id, node, type, label, connections) {
  datas = {
    id: id,
    node: node,
    type: type,
    connections: connections,
    label: label
  }
  this.container = document.createElement("div");
  this.socketLabel = document.createElement("p");
  this.socket = document.createElement("div");

  this.container.className = "socket-container"
  this.socketLabel.className = "socket-label";
  this.socket.className = "socket";

  this.socket.id = datas.id;
  this.socket.data = datas;
  this.socketLabel.innerHTML = datas.label;



  if (datas.type === "out") {
    this.container.appendChild(this.socketLabel);
    this.socketLabel.style.textAlign = "right";
    this.container.style.left = "8px";
    this.container.appendChild(this.socket);
  } else {
    this.container.appendChild(this.socket);
    this.container.style.left = "-8px"
    this.container.appendChild(this.socketLabel);
  }

  setupSocketListener(this.socket);
  return this;
}

function setDropColor(){
  
}

// LISTENER FOR SOCKET TO CREATE AND ACCEPT CONNECTIONS
function setupSocketListener(sock) {
  //wire drawing
  let path;
  let pathId = 0;
  let rect = $(sock);
  let par = rect.parent();
  
  //start
  sock.addEventListener("touchstart", () => {
    path = Path(getRandomColor() , 2, "round", "none");
    editor.svg.appendChild(path);
  });
  //move
  sock.addEventListener("touchmove", () => {
    event.preventDefault();
    drawBeizer(path, rect.offset().left + touchOffset.x , rect.offset().top + touchOffset.y , event.touches[0].pageX  , event.touches[0].pageY );
    currentinput = findSocket(event, sock);
  });
  //end
  sock.addEventListener("touchend", () => {

    //drop(sock , currentinput , path , pathId);
    target = currentinput;
    source = sock
    if (currentinput != undefined && !isAlreadyConnected(sock, currentinput)) {
      if (allowMultipleInputConnections) {
        ++pathId;
        path.setAttribute("id", `${sock.id}P${pathId}`);
        connectSocket(sock , currentinput , path);
      } else if (hasSingleConnection(currentinput)) {
        path.remove();
      } else {
        ++pathId;
        path.setAttribute("id", `${sock.id}P${pathId}`);
        connectSocket(sock , currentinput , path);
      }
    } else {
      path.remove();
    }

  });
  //wire drawing end
}

function drop(source , target , path , pathId){
  
}

function getLastConnection(socket){
  return connection[connection.length - 1];
}

function moveAllConnections(socket , x , y){
  let connections = socket.data.connections;
  let i , len = connections.length , path , source , sourceId , pathId;
  for(i = 0; i < len; ++i){
    pathId = connections[i].line;
    sourceId = connections[i].socket;
    path = document.getElementById(pathId);
    source = document.getElementById(sourceId);
    drawBeizer(path, source.offset().left + touchOffset.x , source.offset().top + touchOffset.y , x , y);
  }
}

function removeLastConnectionFrom(socket){
  let connection = socket.data.connections;
  connection.splice(connection.length - 1 , 1);
}

function removeAllConnectionsFrom(socket){
  let connection = socket.data.connections;
  connection.length = 0;
}

//replace connection of a socket to another socket
function replaceLastConnection(from , to){
  let list = from.data.connections;
  let listlen = list.length;
  if(listlen > 0){
    let lastconnection = getLastConnection()
  }
}
function hasSingleConnection(input){
  return input.data.connections.length === 1;
}

// RETURNS THE TARGET SOCKET WHEN TOUCH ENTERS
function findSocket(event, view) {
  let sockets = document.getElementsByClassName("socket");
  let socketlength = sockets.length;
  let child;
  let data;
  let x = event.touches[0].pageX + touchOffset.x;
  let y = event.touches[0].pageY - touchOffset.y;
  let i;
  for (i = 0; i < socketlength; ++i) {
    child = sockets[i];
    if(checkCompatability(child.data.type , view.data.type , allowSimilarConnection)){
       let rect = child.getBoundingClientRect();
       if (view.data.node !== child.data.node) {
         if (x > rect.left && x < rect.left + rect.width && y > rect.top && y < rect.top + rect.height) {
           child.style.background = "yellow";
           return child;
           break;
         } else {
           child.style.background = "green";
         }
       }
    }
  }
}

//checks if drop compatible -- allowBoth allows you to connect wires input to input and output to output
function checkCompatability(childtype , outputtype , allowBoth){
  if(!allowBoth){
    return childtype !== outputtype;
  }else{
    return true;
  }
}

//_______________CONNECTION CLASS________________
function Connection(socket, path) {
  let ob = {
    line: path.getAttribute("id"),
    socket: socket.data.id
  }
  return ob;
}

//returns true if the target socket is already connected
function isAlreadyConnected(current, target) {
  let connections = current.data.connections;
  let child;
  let bool;
  let i , length = connections.length;
  for (i = 0; i < length; ++i) {
    child = connections[i].socket;
    if (child === target.id) {
      console.log(" having connection");
      bool = true;
      return true;
    } else {
      continue;
    }
  }
  return false;
}

// CONNECTS TO THE TARGET SOCKET
function connectSocket(output, input, mPath) {
  let ob1 = new Connection(input, mPath);
  output.data.connections.push(ob1);

  let ob2 = new Connection(output, mPath);
  input.data.connections.push(ob2);

}
//DISCONNECTS THE CONNECTION
function disconnectSocket(socket1 , socket2){
  let connection = socket1.data.connections;
  let i , length = connection.length;
  for(i= 0; i < length; ++i){
    if(socket2.id === connection[i].socket){
      document.getElementById(connection[i].line).remove();
      connection.splice(i , 1);
      console.log(connection);
      break;
    }
  }
  connection = socket2.data.connections;
  length = connection.length;
  for(i = 0; i < length; ++i){
    if(socket1.id === connection[i].socket){
      connection.splice(i , 1);
      break;
    }
  }
}

function allowMultipleConnections(socket) {
  
}


//______________________CODE RENDERING CLASSES__________________________


//updates code inside a node
function updateCode(node , socket){
  let code = node.layout.data.code;
  node.layout.data.code = code.replace(socket.id , )
}

//gets the code from another socket to this socket
function getCodeFrom(socket){
  let node = socket.parent;
  let code = node.layout.data.code;
  let i , socks = node.layout.data.sockets , len = socks.length , sock;
  if(socket.socket.opCode === "*" ){
    for(i = 0; i < len; ++i){
      sock = socks[i];
      
    }
  }
}



/*______________________GENERIC FUNCTIONS_________________________*/

function createSVG() {
  return document.createElementNS("http://www.w3.org/2000/svg", "svg");
}

function Path(color, strokewidth, linecap, fill) {
  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-width", strokewidth);
  path.setAttribute("stroke-linecap", linecap);
  path.setAttribute("fill", fill);
  return path;
}

function drawBeizer(path, x1, y1, x2, y2  ) {
  let xdiff = (x2 + x1) / 2  ;
  path.setAttribute("d", `M${x1} , ${y1} C ${xdiff}, ${y1} ${xdiff} ,${y2} ${x2},${y2}`);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

