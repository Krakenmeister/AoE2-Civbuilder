//Credit to Mr. Kevin Bertman for this code
//This is hosted at http://www.mrbertman.com/penroseTilings.html

var phi=(1+Math.sqrt(5))/2;
//var a = document.getElementById("myCanvas");
//var c = a.getContext("2d"); 
//myCanvas.addEventListener("mousemove",moveMouse,false);
//myCanvas.addEventListener("mousedown",mouseDown,false);
var drawKiteShape=true;
var totalShapes=0;
var shapeCoords=[[],[],[],[]]; //x coord, y coord, angle, type (0=kite, 1=dart)
var vertX=0;
var vertY=0;
var ANG;
var size=50;
var finishMove=true;
var showCurves=false;
var hideCurrent=false; //hide the shape at cursor when cursor is near tools
var deleteShapeMode=false;
var highlightMode=false; 
var fixedHighlightMode=false; 
var foundMatchingTiling=false;
var shapeMap=[[],[],[],[]]; //used to store a record of each shapes neighbour
var totalHighlightedShapes=0;
var highlightedShapeIndex=[];
var highlightedShapeCoords=[[],[],[],[]];
var totalFixedHighlightedShapes=0;
var fixedHighlightedShapeIndex=[];
var fixedHighlightedShapeCoords=[[],[],[],[],[]]; //fifth entry is the length of a side
var fixedHighlightedShapeMap=[[],[],[],[]];
var highlightedShapeMap=[[],[],[],[]];
var tilingCentreX; //used to store the centre of highlighted tiling
var tilingCentreY;
var tilingDiameter; //store diamter of highlighted tiling
var closestCoords=[[],[],[],[]]; //the coordinates of the closest matching tiling 
var shapesToAdd=[[],[],[],[]]; //used to store forced shapes
var animating=false; //set to true when animating to stop anything else happening
var legalMode=false; //this mode will highlight an illegally placed tile
var legalTiling=true; //set to false if in legal mode but no legal tiling
var text="Place a kite.";

//used to check if we have a legal tiling
var legalTilingCoords=[[],[],[],[]]; 
var inflatedTilingCoords=[[],[],[],[]]; //the coords of the inflated tiling
var inflatedTilingIndex=[]; //the index of the inflated tiling
legalTilingCoords[0][0]=0;
legalTilingCoords[1][0]=0;
legalTilingCoords[2][0]=0;
legalTilingCoords[3][0]=0;
var totalLegalShapes=1;
var legalSize=size;
var legalShapeMap=[[],[],[],[]];
legalShapeMap=mapShapes(legalTilingCoords,totalLegalShapes,legalSize);

for (var i=0; i<9; i++) {
	deflateLegal();   
	legalShapeMap=mapShapes(legalTilingCoords,totalLegalShapes,legalSize);
}
var translateX;         //used to map tiling onto inflated tiling
var translateY;
var rotateInflation;


//drawButtons();
//displayMessage(text);
		

function moveMouse(e) {
	if (animating) return;
	c.beginPath();
	c.clearRect(0,0,1200,800);
	vertX=e.pageX-myCanvas.offsetLeft;
	vertY=e.pageY-myCanvas.offsetTop;
	ANG=0;
	//hide current shape if cursor is near tools
	if (vertX<120 && vertY<470) {hideCurrent=true;} else {hideCurrent=false;} 
	if (!(vertX<110 && vertY<460)) checkForLockOn(vertX,vertY); //check to see if we are close enough to lock onto a shape
	drawShapes(shapeCoords,totalShapes,"#AAAAAA","#EEEEEE"); //draw all of the shapes
	var t=totalShapes-1;
	if (!legalTiling && legalMode) drawShapes([[shapeCoords[0][t]],[shapeCoords[1][t]],[shapeCoords[2][t]],[shapeCoords[3][t]]],1,"red","red");
	//hide shape at cursor if cursor is near controls or we are in deleteShapeMode
	if (!(hideCurrent || deleteShapeMode || highlightMode || fixedHighlightMode)) {
		var s=[[shapeCoords[0][totalShapes]],[shapeCoords[1][totalShapes]],[shapeCoords[2][totalShapes]],[shapeCoords[3][totalShapes]]];
		drawShapes(s,1,"#AAAAAA","#EEEEEE");    
	}
		
	if (highlightMode) {
		drawShapes(highlightedShapeCoords,totalHighlightedShapes,"#BB0000","#EE0000");
		if (foundMatchingTiling) drawShapes(closestCoords,totalHighlightedShapes,"#00BB00","#00EE00"); //findSameTiling(highlightedShapeMap,totalHighlightedShapes,highlightedShapeIndex,highlightedShapeCoords,shapeMap,totalShapes,shapeCoords);
	}
	if (totalFixedHighlightedShapes>0) {
		drawFixedHighlightedShapes(fixedHighlightedShapeCoords,totalFixedHighlightedShapes);
	}
	if (vertX>10 && vertX<50 && vertY>10 && vertY<50) {
		text="Place a kite";
	} else if (vertX>60 && vertX<100 && vertY>10 && vertY<50) {
		text="Place a dart";
	} else if (vertX>10 && vertX<100 && vertY>60 && vertY<100) {
		text="Decompose tiles";
	} else if (vertX>10 && vertX<100 && vertY>110 && vertY<150) {
		text="Compose tiles (may take time to compose large tilings)";
	} else if (vertX>10 && vertX<50 && vertY>160 && vertY<200) {
		text="Zoom in";
	} else if (vertX>60 && vertX<100 && vertY>160 && vertY<200) {
		text="Zoom out";
	} else if (vertX>10 && vertX<50 && vertY>210 && vertY<250) {
		text="Centre tiling";
	} else if (vertX>60 && vertX<100 && vertY>210 && vertY<250) {
		text="Show matching rules";
	} else if (vertX>10 && vertX<50 && vertY>260 && vertY<300) {
		text="Delete selected tiles";
	} else if (vertX>60 && vertX<100 && vertY>260 && vertY<300) {
		text="Clear all tiles";
	} else if (vertX>10 && vertX<50 && vertY>310 && vertY<350) {
		text="Rotate left";
	} else if (vertX>60 && vertX<100 && vertY>310 && vertY<350) {
		text="Rotate right";
	} else if (vertX>10 && vertX<50 && vertY>360 && vertY<400) {
		text="Highlight region and search for closest matching copy";
	} else if (vertX>60 && vertX<100 && vertY>360 && vertY<400) {
		text="Add forced tiles at each vertex";
	} else if (vertX>10 && vertX<50 && vertY>410 && vertY<450) {
		text="Highlight region (will remain highlighted when tiling changes)";
	} else if (vertX>60 && vertX<100 && vertY>410 && vertY<450) {
		text="Show illegally placed tiles (may cause slowdown in large tilings)";
	} else {
		text="";    
	}
	moveShape(ANG,vertX,vertY); //move the current shape to where the cursor is
	drawButtons();
	displayMessage(text);
	finishMove=true;
}

function checkForLockOn(x,y) { //check to see if we are close enough to lock onto a shape
	var closest=-1;
	var closestDist=10000000;
	for (var i=0; i<totalShapes; i++) {
		var dist=distance(x,y,shapeCoords[0][i]+size/2*Math.sin(shapeCoords[2][i]*Math.PI/180),shapeCoords[1][i]-size/2*Math.cos(shapeCoords[2][i]*Math.PI/180))
		if (dist<closestDist) {
			closest=i;
			closestDist=dist;
		}
	}
	//if a kite is meeting a kite
	if (closest>-1 && drawKiteShape && shapeCoords[3][closest]==0/* && closestDist<size/1.7*/) {
		var distToV=distance(x,y,shapeCoords[0][closest],shapeCoords[1][closest]);
		//remember y is measured from top of screen hence the -y and x-
		var ang=Math.atan2(shapeCoords[1][closest]-y,x-shapeCoords[0][closest])*180/Math.PI;
		//long edge to long edge
		if (Math.sin((90-shapeCoords[2][closest]-ang)*Math.PI/180)>0 && distToV<size/1.5) {
			vertX=shapeCoords[0][closest];
			vertY=shapeCoords[1][closest];
			ANG=shapeCoords[2][closest]+72;
		}
		//long edge to long edge (other side)
		else if (Math.sin((90-shapeCoords[2][closest]-ang)*Math.PI/180)<0 && distToV<size/1.5) {
			vertX=shapeCoords[0][closest];
			vertY=shapeCoords[1][closest];
			ANG=shapeCoords[2][closest]-72;
		}
		//short edge to short edge
		else if (Math.sin((90-shapeCoords[2][closest]-ang)*Math.PI/180)>0) {
			vertX=shapeCoords[0][closest]+size*Math.sin(shapeCoords[2][closest]*Math.PI/180)+size*Math.sin((shapeCoords[2][closest]+36)*Math.PI/180);
			vertY=shapeCoords[1][closest]-size*Math.cos(shapeCoords[2][closest]*Math.PI/180)-size*Math.cos((shapeCoords[2][closest]+36)*Math.PI/180);
			ANG=shapeCoords[2][closest]-180+36;
		}
		//short edge to short edge (other side)
		else if (Math.sin((90-shapeCoords[2][closest]-ang)*Math.PI/180)<0) {
			vertX=shapeCoords[0][closest]+size*Math.sin(shapeCoords[2][closest]*Math.PI/180)+size*Math.sin((shapeCoords[2][closest]-36)*Math.PI/180);
			vertY=shapeCoords[1][closest]-size*Math.cos(shapeCoords[2][closest]*Math.PI/180)-size*Math.cos((shapeCoords[2][closest]-36)*Math.PI/180);
			ANG=shapeCoords[2][closest]-180-36;
		}
	} 
	
	//if a dart is meeting a kite
	if (closest>-1 && !drawKiteShape && shapeCoords[3][closest]==0/* && closestDist<size/2-2*/) {
		var distToV=distance(x,y,shapeCoords[0][closest],shapeCoords[1][closest]);
		//remember y is measured from top of screen hence the -y and x-
		var ang=Math.atan2(shapeCoords[1][closest]-y,x-shapeCoords[0][closest])*180/Math.PI;
		//long edge to long edge
		if (Math.sin((90-shapeCoords[2][closest]-ang)*Math.PI/180)>0 && distToV<size/1.5) {
			vertX=shapeCoords[0][closest]+size*Math.sin((shapeCoords[2][closest]+36)*Math.PI/180);
			vertY=shapeCoords[1][closest]-size*Math.cos((shapeCoords[2][closest]+36)*Math.PI/180);
			ANG=shapeCoords[2][closest]-180;
		}
		//long edge to long edge (other side)
		else if (Math.sin((90-shapeCoords[2][closest]-ang)*Math.PI/180)<0 && distToV<size/1.5) {
			vertX=shapeCoords[0][closest]+size*Math.sin((shapeCoords[2][closest]-36)*Math.PI/180);
			vertY=shapeCoords[1][closest]-size*Math.cos((shapeCoords[2][closest]-36)*Math.PI/180);
			ANG=shapeCoords[2][closest]-180;
		}
		//short edge to short edge
		else if (Math.sin((90-shapeCoords[2][closest]-ang)*Math.PI/180)>0) {
			vertX=shapeCoords[0][closest]+size*Math.sin(shapeCoords[2][closest]*Math.PI/180)+size*Math.sin((shapeCoords[2][closest]+72)*Math.PI/180);
			vertY=shapeCoords[1][closest]-size*Math.cos(shapeCoords[2][closest]*Math.PI/180)-size*Math.cos((shapeCoords[2][closest]+72)*Math.PI/180);
			ANG=shapeCoords[2][closest]-180+36;
		}
		//short edge to short edge (other side)
		else if (Math.sin((90-shapeCoords[2][closest]-ang)*Math.PI/180)<0) {
			vertX=shapeCoords[0][closest]+size*Math.sin(shapeCoords[2][closest]*Math.PI/180)+size*Math.sin((shapeCoords[2][closest]-72)*Math.PI/180);
			vertY=shapeCoords[1][closest]-size*Math.cos(shapeCoords[2][closest]*Math.PI/180)-size*Math.cos((shapeCoords[2][closest]-72)*Math.PI/180);
			ANG=shapeCoords[2][closest]-180-36;
		}
	} 
	//if a dart is meeting a dart
	if (closest>-1 && !drawKiteShape && shapeCoords[3][closest]==1/* && closestDist<size/1.7*/) {
		var distToV=distance(x,y,shapeCoords[0][closest],shapeCoords[1][closest]);
		//remember y is measured from top of screen hence the -y and x-
		var ang=Math.atan2(shapeCoords[1][closest]-y,x-shapeCoords[0][closest])*180/Math.PI;
		//long edge to long edge
		if (Math.sin((90-shapeCoords[2][closest]-ang)*Math.PI/180)>0 && distToV<size/1.5) {
			vertX=shapeCoords[0][closest];
			vertY=shapeCoords[1][closest];
			ANG=shapeCoords[2][closest]+72;
		}
		//long edge to long edge (other side)
		else if (Math.sin((90-shapeCoords[2][closest]-ang)*Math.PI/180)<0 && distToV<size/1.5) {
			vertX=shapeCoords[0][closest];
			vertY=shapeCoords[1][closest];
			ANG=shapeCoords[2][closest]-72;
		}
	} 
	//if a kite is meeting a dart
	if (closest>-1 && drawKiteShape && shapeCoords[3][closest]==1/* && closestDist<size/1.7*/) {
		var distToV=distance(x,y,shapeCoords[0][closest],shapeCoords[1][closest]);
		//remember y is measured from top of screen hence the -y and x-
		var ang=Math.atan2(shapeCoords[1][closest]-y,x-shapeCoords[0][closest])*180/Math.PI;
		//long edge to long edge
		if (Math.sin((90-shapeCoords[2][closest]-ang)*Math.PI/180)>0 && distToV<size/1.5) {
			vertX=shapeCoords[0][closest]+size*Math.sin((shapeCoords[2][closest]+36)*Math.PI/180);
			vertY=shapeCoords[1][closest]-size*Math.cos((shapeCoords[2][closest]+36)*Math.PI/180);
			ANG=shapeCoords[2][closest]-180;
		}
		//long edge to long edge (other side)
		else if (Math.sin((90-shapeCoords[2][closest]-ang)*Math.PI/180)<0 && distToV<size/1.5) {
			vertX=shapeCoords[0][closest]+size*Math.sin((shapeCoords[2][closest]-36)*Math.PI/180);
			vertY=shapeCoords[1][closest]-size*Math.cos((shapeCoords[2][closest]-36)*Math.PI/180);
			ANG=shapeCoords[2][closest]-180;
		}
		//short edge to short edge
		else if (Math.sin((90-shapeCoords[2][closest]-ang)*Math.PI/180)>0) {
			vertX=shapeCoords[0][closest]+size*phi*Math.sin(shapeCoords[2][closest]*Math.PI/180);
			vertY=shapeCoords[1][closest]-size*phi*Math.cos(shapeCoords[2][closest]*Math.PI/180);
			ANG=shapeCoords[2][closest]-180-36;
		}
		//short edge to short edge (other side)
		else if (Math.sin((90-shapeCoords[2][closest]-ang)*Math.PI/180)<0) {
			vertX=shapeCoords[0][closest]+size*phi*Math.sin(shapeCoords[2][closest]*Math.PI/180);
			vertY=shapeCoords[1][closest]-size*phi*Math.cos(shapeCoords[2][closest]*Math.PI/180);
			ANG=shapeCoords[2][closest]-180+36;
		}
	} 
	console.log(closest);
}

function distance(x1,y1,x2,y2) {
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));    
}

function distanceSquared(x1,y1,x2,y2) { //dont use sqrt to save time
	return ((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));    
}

function drawButtons() {
	c.lineWidth=2;
	c.lineCap="butt";
	//background
	c.beginPath();
	c.rect(0,0,110,460)
	c.fillStyle="#FFFFFF";
	c.fill();
	//kite button 
	c.beginPath();
	c.fillStyle="#FFFFFF";
	if (drawKiteShape && !deleteShapeMode && !highlightMode && !fixedHighlightMode) {c.fillStyle="#FFCC00";}
	c.strokeStyle="#000000";
	c.rect(10,10,40,40);
	c.fill();
	c.stroke();
	//dart button
	c.beginPath();
	c.rect(60,10,40,40);
	c.fillStyle="#FFFFFF";
	if (!drawKiteShape && !deleteShapeMode && !highlightMode && !fixedHighlightMode) {c.fillStyle="#FFCC00";}
	c.fill();
	c.stroke();
	var x=30;
	var y=42;
	//kite
	c.lineWidth=0.5;
	c.beginPath();
	c.moveTo(x,y)
	c.lineTo(x+25*Math.sin(36*Math.PI/180),y-25*Math.cos(36*Math.PI/180));
	c.lineTo(x,y-25);
	c.lineTo(x-25*Math.sin(36*Math.PI/180),y-25*Math.cos(36*Math.PI/180));
	c.fillStyle="#AAAAAA";
	c.fill();
	c.closePath();
	c.stroke(); 
	x=80;
	y=42;
	//dart
	c.beginPath();
	c.moveTo(x,y)
	c.lineTo(x+25*Math.sin(36*Math.PI/180),y-25*Math.cos(36*Math.PI/180));
	c.lineTo(x,y-25/phi);
	c.lineTo(x-25*Math.sin(36*Math.PI/180),y-25*Math.cos(36*Math.PI/180));
	c.closePath();
	c.fillStyle="#EEEEEE";
	c.fill();
	c.stroke(); 
	//deflate
	c.lineWidth=1;
	c.beginPath();
	c.rect(10,60,90,40);
	c.stroke();
	//arrow
	x=46;
	y=80;
	c.moveTo(x,y-2);
	c.lineTo(x+10,y-2);
	c.lineTo(x+10,y-7);
	c.lineTo(x+17,y);
	c.lineTo(x+10,y+7);
	c.lineTo(x+10,y+2);
	c.lineTo(x,y+2);
	c.closePath();
	c.stroke();
	c.beginPath();
	c.lineWidth=0.5;
	x=30;
	y=92;
	c.beginPath();
	c.moveTo(x,y)
	c.lineTo(x+25*Math.sin(36*Math.PI/180),y-25*Math.cos(36*Math.PI/180));
	c.lineTo(x,y-25);
	c.lineTo(x-25*Math.sin(36*Math.PI/180),y-25*Math.cos(36*Math.PI/180));
	c.closePath();
	c.fillStyle="#AAAAAA";
	c.fill();
	c.stroke(); 
	x=80;
	y=92;
	var SIZE=25;
	var tempCoords=[[],[],[],[]];
	tempCoords[0][0]=x+SIZE*Math.cos(-54*Math.PI/180);
	tempCoords[1][0]=y+SIZE*Math.sin(-54*Math.PI/180);
	tempCoords[2][0]=-108;
	tempCoords[3][0]=0;                    
	//kite
	tempCoords[0][1]=x+SIZE*Math.cos(-126*Math.PI/180);
	tempCoords[1][1]=y+SIZE*Math.sin(-126*Math.PI/180);
	tempCoords[2][1]=108;
	tempCoords[3][1]=0;
	//dart
	tempCoords[0][2]=x;
	tempCoords[1][2]=y;
	tempCoords[2][2]=-36;
	tempCoords[3][2]=1;
	//dart
	tempCoords[0][3]=x;
	tempCoords[1][3]=y;
	tempCoords[2][3]=36;
	tempCoords[3][3]=1;
	
	for (var i=0; i<4; i++) {
		var x=tempCoords[0][i];
		var y=tempCoords[1][i];
		var ang=tempCoords[2][i];
		SIZE=25/phi;
		if (tempCoords[3][i]==0) {//draw a kite
			c.beginPath();
			c.fillStyle="#AAAAAA";
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180));
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180),y-SIZE*Math.cos(ang*Math.PI/180));
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180));
			c.fill();  
			c.beginPath();
			c.strokeStyle="#000000";
			c.lineWidth=SIZE/50;
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180));
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180),y-SIZE*Math.cos(ang*Math.PI/180));
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180));
			c.closePath();
			c.stroke();   
		} else {//draw a dart
			c.beginPath();
			c.fillStyle="#EEEEEE";
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180))
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180)/phi,y-SIZE*Math.cos(ang*Math.PI/180)/phi)
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180))
			c.fill();
			c.beginPath();
			c.strokeStyle="#000000";
			c.lineWidth=SIZE/50;
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180))
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180)/phi,y-SIZE*Math.cos(ang*Math.PI/180)/phi)
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180))
			c.closePath()
			c.stroke()
		}
	}
	c.lineWidth=1;
	//inflate
	c.beginPath();
	c.rect(10,110,90,40);
	c.stroke();
	x=46;
	y=130;
	c.moveTo(x,y-2);
	c.lineTo(x+10,y-2);
	c.lineTo(x+10,y-7);
	c.lineTo(x+17,y);
	c.lineTo(x+10,y+7);
	c.lineTo(x+10,y+2);
	c.lineTo(x,y+2);
	c.closePath();
	c.stroke();
	x=30;
	y=142;
	var SIZE=25;
	var tempCoords=[[],[],[],[]];
	tempCoords[0][0]=x+SIZE*Math.cos(-54*Math.PI/180);
	tempCoords[1][0]=y+SIZE*Math.sin(-54*Math.PI/180);
	tempCoords[2][0]=-108;
	tempCoords[3][0]=0;                    
	//kite
	tempCoords[0][1]=x+SIZE*Math.cos(-126*Math.PI/180);
	tempCoords[1][1]=y+SIZE*Math.sin(-126*Math.PI/180);
	tempCoords[2][1]=108;
	tempCoords[3][1]=0;
	//dart
	tempCoords[0][2]=x;
	tempCoords[1][2]=y;
	tempCoords[2][2]=-36;
	tempCoords[3][2]=1;
	//dart
	tempCoords[0][3]=x;
	tempCoords[1][3]=y;
	tempCoords[2][3]=36;
	tempCoords[3][3]=1;
	
	for (var i=0; i<4; i++) {
		var x=tempCoords[0][i];
		var y=tempCoords[1][i];
		var ang=tempCoords[2][i];
		SIZE=25/phi;
		if (tempCoords[3][i]==0) {//draw a kite
			c.beginPath();
			c.fillStyle="#AAAAAA";
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180));
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180),y-SIZE*Math.cos(ang*Math.PI/180));
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180));
			c.fill();  
			c.beginPath();
			c.strokeStyle="#000000";
			c.lineWidth=SIZE/50;
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180));
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180),y-SIZE*Math.cos(ang*Math.PI/180));
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180));
			c.closePath();
			c.stroke();   
		} else {//draw a dart
			c.beginPath();
			c.fillStyle="#EEEEEE";
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180))
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180)/phi,y-SIZE*Math.cos(ang*Math.PI/180)/phi)
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180))
			c.fill();
			c.beginPath();
			c.strokeStyle="#000000";
			c.lineWidth=SIZE/50;
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180))
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180)/phi,y-SIZE*Math.cos(ang*Math.PI/180)/phi)
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180))
			c.closePath()
			c.stroke()
		}
	}
	x=80;
	y=142;
	c.lineWidth=0.5;
	c.beginPath();
	c.moveTo(x,y)
	c.lineTo(x+25*Math.sin(36*Math.PI/180),y-25*Math.cos(36*Math.PI/180));
	c.lineTo(x,y-25);
	c.lineTo(x-25*Math.sin(36*Math.PI/180),y-25*Math.cos(36*Math.PI/180));
	c.closePath();
	c.fillStyle="#AAAAAA";
	c.fill();
	c.stroke(); 
	c.lineWidth=2;
	//zoom in
	c.fillStyle="#FFFFFF";
	c.beginPath();
	c.rect(10,160,40,40);
	c.stroke();
	c.beginPath();
	c.moveTo(15,195);
	c.lineWidth=6;
	c.lineTo(25,185);
	c.stroke();
	c.lineWidth=3;
	c.beginPath();
	c.arc(30,180,13,0,2*Math.PI);
	c.fill();
	c.stroke();
	c.lineWidth=3;
	c.beginPath();
	c.moveTo(30,172);
	c.lineTo(30,188);
	c.moveTo(22,180);
	c.lineTo(38,180);
	c.stroke();
	c.lineWidth=2;
	//zoom out
	c.beginPath();
	c.rect(60,160,40,40);
	c.stroke();
	c.beginPath();
	c.moveTo(65,195);
	c.lineWidth=6;
	c.lineTo(75,185);
	c.stroke();
	c.lineWidth=3;
	c.beginPath();
	c.arc(80,180,13,0,2*Math.PI);
	c.fill();
	c.stroke();
	c.lineWidth=3;
	c.beginPath();
	c.moveTo(72,180);
	c.lineTo(88,180);
	c.stroke();
	c.lineWidth=2;
	//center
	c.beginPath();
	c.rect(10,210,40,40);
	c.stroke();
	c.beginPath();
	c.lineWidth=3;
	c.moveTo(15,215);
	c.lineTo(45,245);
	c.moveTo(45,215);
	c.lineTo(15,245);
	c.stroke();
	c.beginPath();
	c.lineWidth=4;
	c.moveTo(28,218);
	c.lineTo(28,242);
	c.moveTo(32,218);
	c.lineTo(32,242);
	c.moveTo(18,228);
	c.lineTo(42,228);
	c.moveTo(18,232);
	c.lineTo(42,232);
	c.stroke();
	c.lineWidth=3;
	c.strokeStyle="#FFFFFF"
	c.beginPath();
	c.moveTo(18,230);
	c.lineTo(42,230);
	c.moveTo(30,218);
	c.lineTo(30,242);
	c.stroke();
	c.lineWidth=2;
	c.strokeStyle="#000000"
	
	//show curves
	c.beginPath();
	c.rect(60,210,40,40);
	c.fillStyle="#FFFFFF";
	if (showCurves) {c.fillStyle="#FFCC00";}
	c.fill();
	c.stroke();
	 //dart
	x=80;
	y=242;
	c.lineWidth=0.5;
	c.beginPath();
	c.moveTo(x,y)
	c.lineTo(x+25*Math.sin(36*Math.PI/180),y-25*Math.cos(36*Math.PI/180));
	c.lineTo(x,y-25/phi);
	c.lineTo(x-25*Math.sin(36*Math.PI/180),y-25*Math.cos(36*Math.PI/180));
	c.closePath();
	c.fillStyle="#EEEEEE";
	c.fill();
	c.stroke(); 
	//draw blue arc
	SIZE=25;
	c.beginPath()
	c.strokeStyle="#990000";
	c.lineWidth=SIZE/25;
	c.arc(x,y,SIZE*(1-1/phi),(-36-90)*Math.PI/180,(36-90)*Math.PI/180,false)
	c.stroke();  
	//draw green arc
	y-=SIZE/phi;
	c.beginPath()
	c.strokeStyle="#009900";
	c.arc(x,y,SIZE/phi*(1-1/phi),-(90-72)*Math.PI/180,-(90+72)*Math.PI/180,false)
	c.stroke(); 
	c.lineWidth=2;
	c.strokeStyle="#000000"
	
	//delete shape
	c.beginPath();
	c.fillStyle="#FFFFFF";
	if (deleteShapeMode) {c.fillStyle="#FFCC00";}
	c.rect(10,260,40,40);
	c.fill();
	c.stroke();
	
	//delete one shape
	
	c.beginPath();
	c.lineWidth=1;
	c.moveTo(15,292);
	c.lineTo(45,292);
	c.moveTo(16,270);
	c.lineTo(35,289);
	c.lineTo(38,289);
	c.lineTo(43,284);
	c.lineTo(23,264);
	c.moveTo(32,286);
	c.lineTo(39,279);
	c.stroke();
	c.closePath();
	
	//delete all shapes
	c.lineWidth=2;
	c.beginPath();
	c.rect(60,260,40,40);
	c.stroke();
	c.beginPath();
	c.lineWidth=1;
	c.moveTo(70,265);
	c.lineTo(70,295);
	c.lineTo(90,295);
	c.lineTo(90,270);
	c.lineTo(85,265);
	c.lineTo(85,270);
	c.lineTo(90,270);
	c.moveTo(85,265);
	c.lineTo(70,265);
	c.stroke();
	
	//rotate left
	c.lineWidth=2;
	c.beginPath();
	c.rect(10,310,40,40);
	c.stroke();
	c.beginPath();
	c.lineWidth=1.5;
	c.arc(27,342,17,0,3*Math.PI/2,true);
	c.lineTo(27,318);
	c.lineTo(17,328);
	c.lineTo(27,338);
	c.lineTo(27,331);
	c.arc(27,342,11,3*Math.PI/2,0,false);
	c.closePath();
	c.stroke();
	
	//rotate right
	c.lineWidth=2;
	c.beginPath();
	c.rect(60,310,40,40);
	c.stroke();
	c.beginPath();
	c.lineWidth=1.5;
	c.arc(84,342,17,Math.PI,3*Math.PI/2,false);
	c.lineTo(84,318);
	c.lineTo(94,328);
	c.lineTo(84,338);
	c.lineTo(84,330);
	c.arc(84,342,11,3*Math.PI/2,Math.PI,true);
	c.closePath()
	c.stroke();
	
	//highlight mode
	c.lineWidth=2;
	c.beginPath();
	c.fillStyle="#FFFFFF";
	if (highlightMode) {c.fillStyle="#FFCC00";}
	c.rect(10,360,40,40);
	c.fill();
	c.stroke();
	
	x=30;
	y=392;
	var SIZE=25;
	var tempCoords=[[],[],[],[]];
	tempCoords[0][0]=x+SIZE*Math.cos(-54*Math.PI/180);
	tempCoords[1][0]=y+SIZE*Math.sin(-54*Math.PI/180);
	tempCoords[2][0]=-108;
	tempCoords[3][0]=0;                    
	//kite
	tempCoords[0][1]=x+SIZE*Math.cos(-126*Math.PI/180);
	tempCoords[1][1]=y+SIZE*Math.sin(-126*Math.PI/180);
	tempCoords[2][1]=108;
	tempCoords[3][1]=0;
	//dart
	tempCoords[0][2]=x;
	tempCoords[1][2]=y;
	tempCoords[2][2]=-36;
	tempCoords[3][2]=1;
	//dart
	tempCoords[0][3]=x;
	tempCoords[1][3]=y;
	tempCoords[2][3]=36;
	tempCoords[3][3]=1;
	//draw the shapes
	for (var i=0; i<4; i++) {
		var x=tempCoords[0][i];
		var y=tempCoords[1][i];
		var ang=tempCoords[2][i];
		SIZE=25/phi;
		if (tempCoords[3][i]==0) {//draw a kite
			c.beginPath();
			c.fillStyle="#BB0000";
			if (i==1) c.fillStyle="#00BB00";
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180));
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180),y-SIZE*Math.cos(ang*Math.PI/180));
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180));
			c.fill();  
			c.beginPath();
			c.strokeStyle="#000000";
			c.lineWidth=SIZE/50;
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180));
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180),y-SIZE*Math.cos(ang*Math.PI/180));
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180));
			c.closePath();
			c.stroke();   
		} else {//draw a dart
			c.beginPath();
			c.fillStyle="#EEEEEE";
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180))
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180)/phi,y-SIZE*Math.cos(ang*Math.PI/180)/phi)
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180))
			c.fill();
			c.beginPath();
			c.strokeStyle="#000000";
			c.lineWidth=SIZE/50;
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180))
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180)/phi,y-SIZE*Math.cos(ang*Math.PI/180)/phi)
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180))
			c.closePath()
			c.stroke()
		}
	}
	
	//force tiles
	c.lineWidth=2;
	c.beginPath();
	c.fillStyle="#FFFFFF";
	c.rect(60,360,40,40);
	c.fill();
	c.stroke();
	
	x=83;
	y=396;
	//dart
	c.beginPath();
	c.lineWidth=0.5;
	c.moveTo(x,y)
	c.lineTo(x+15*Math.sin(36*Math.PI/180),y-15*Math.cos(36*Math.PI/180));
	c.lineTo(x,y-15/phi);
	c.lineTo(x-15*Math.sin(36*Math.PI/180),y-15*Math.cos(36*Math.PI/180));
	c.closePath();
	c.fillStyle="#EEEEEE";
	c.fill();
	c.stroke(); 
	//kite
	x=78;
	y=380;
	c.beginPath();
	c.lineWidth=0.5;
	c.moveTo(x,y)
	c.lineTo(x,y-15);
	c.lineTo(x-15*Math.cos(18*Math.PI/180),y-15+15*Math.sin(18*Math.PI/180));
	c.lineTo(x-15/phi*Math.cos(18*Math.PI/180),y-15/phi*Math.sin(18*Math.PI/180));
	c.closePath();
	c.fillStyle="#00AAAA";
	c.fill();
	c.stroke();
	//kite
	x=83;
	y=387;
	c.beginPath();
	c.lineWidth=0.5;
	c.moveTo(x,y)
	c.lineTo(x,y-15);
	c.lineTo(x+15*Math.cos(18*Math.PI/180),y-15+15*Math.sin(18*Math.PI/180));
	c.lineTo(x+15/phi*Math.cos(18*Math.PI/180),y-15/phi*Math.sin(18*Math.PI/180));
	c.closePath();
	c.fillStyle="#AAAAAA";
	c.fill();
	c.stroke();
	
	//highlight tiles
	c.lineWidth=2;
	c.beginPath();
	c.fillStyle="#FFFFFF";
	if (fixedHighlightMode) {c.fillStyle="#FFCC00";}
	c.rect(10,410,40,40);
	c.fill();
	c.stroke();
	x=30;
	y=442;
	var SIZE=25;
	var tempCoords=[[],[],[],[]];
	tempCoords[0][0]=x+SIZE*Math.cos(-54*Math.PI/180);
	tempCoords[1][0]=y+SIZE*Math.sin(-54*Math.PI/180);
	tempCoords[2][0]=-108;
	tempCoords[3][0]=0;                    
	//kite
	tempCoords[0][1]=x+SIZE*Math.cos(-126*Math.PI/180);
	tempCoords[1][1]=y+SIZE*Math.sin(-126*Math.PI/180);
	tempCoords[2][1]=108;
	tempCoords[3][1]=0;
	//dart
	tempCoords[0][2]=x;
	tempCoords[1][2]=y;
	tempCoords[2][2]=-36;
	tempCoords[3][2]=1;
	//dart
	tempCoords[0][3]=x;
	tempCoords[1][3]=y;
	tempCoords[2][3]=36;
	tempCoords[3][3]=1;
	
	for (var i=0; i<4; i++) {
		var x=tempCoords[0][i];
		var y=tempCoords[1][i];
		var ang=tempCoords[2][i];
		SIZE=25/phi;
		if (tempCoords[3][i]==0) {//draw a kite
			c.beginPath();
			c.fillStyle="#AAAAAA";
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180));
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180),y-SIZE*Math.cos(ang*Math.PI/180));
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180));
			c.fill();  
			c.beginPath();
			c.strokeStyle="#000000";
			c.lineWidth=SIZE/50;
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180));
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180),y-SIZE*Math.cos(ang*Math.PI/180));
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180));
			c.closePath();
			c.stroke();   
		} else {//draw a dart
			c.beginPath();
			c.fillStyle="#EEEEEE";
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180))
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180)/phi,y-SIZE*Math.cos(ang*Math.PI/180)/phi)
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180))
			c.fill();
			c.beginPath();
			c.strokeStyle="#000000";
			c.lineWidth=SIZE/50;
			c.moveTo(x,y)
			c.lineTo(x+SIZE*Math.sin((36+ang)*Math.PI/180),y-SIZE*Math.cos((36+ang)*Math.PI/180))
			c.lineTo(x+SIZE*Math.sin(ang*Math.PI/180)/phi,y-SIZE*Math.cos(ang*Math.PI/180)/phi)
			c.lineTo(x-SIZE*Math.sin((36-ang)*Math.PI/180),y-SIZE*Math.cos((36-ang)*Math.PI/180))
			c.closePath()
			c.stroke()
		}
	}
	c.beginPath();
	c.lineWidth=1.5;
	c.strokeStyle="#0000EE"
	c.moveTo(tempCoords[0][3],tempCoords[1][3]);
	c.lineTo(tempCoords[0][3]+SIZE*Math.sin((36+tempCoords[2][3])*Math.PI/180),tempCoords[1][3]-SIZE*Math.cos((36+tempCoords[2][3])*Math.PI/180));
	c.lineTo(tempCoords[0][3]+SIZE*Math.sin(tempCoords[2][3]*Math.PI/180)/phi,tempCoords[1][3]-SIZE*Math.cos(tempCoords[2][3]*Math.PI/180)/phi);
	c.lineTo(tempCoords[0][3]+SIZE*Math.sin((36-tempCoords[2][3])*Math.PI/180),tempCoords[1][3]-SIZE*Math.cos((36-tempCoords[2][3])*Math.PI/180));
	c.lineTo(tempCoords[0][3]+SIZE*phi*Math.sin((36-tempCoords[2][3])*Math.PI/180),tempCoords[1][3]-SIZE*phi*Math.cos((36-tempCoords[2][3])*Math.PI/180));
	c.lineTo(tempCoords[0][1],tempCoords[1][1]);
	c.lineTo(tempCoords[0][2]+SIZE*Math.sin(tempCoords[2][2]*Math.PI/180)/phi,tempCoords[1][2]-SIZE*Math.cos(tempCoords[2][2]*Math.PI/180)/phi);
	c.lineTo(tempCoords[0][2]+SIZE*Math.sin((tempCoords[2][2]-36)*Math.PI/180),tempCoords[1][2]-SIZE*Math.cos((tempCoords[2][2]-36)*Math.PI/180));
	c.closePath();
	c.stroke();
	
	//legal mode
	c.strokeStyle="#000000"
	c.lineWidth=2;
	c.beginPath();
	c.fillStyle="#FFFFFF";
	if (legalMode) {c.fillStyle="#FFCC00";}
	c.rect(60,410,40,40);
	c.fill();
	c.stroke();
	
	x=80;
	y=443;
	//dart
	c.beginPath();
	c.lineWidth=0.5;
	c.moveTo(x,y)
	c.lineTo(x+15*Math.sin(36*Math.PI/180),y-15*Math.cos(36*Math.PI/180));
	c.lineTo(x,y-15/phi);
	c.lineTo(x-15*Math.sin(36*Math.PI/180),y-15*Math.cos(36*Math.PI/180));
	c.closePath();
	c.fillStyle="#EEEEEE";
	c.fill();
	c.stroke(); 
	//kite
	x=80;
	y=433;
	c.beginPath();
	c.lineWidth=0.5;
	c.moveTo(x,y)
	c.lineTo(x,y-15);
	c.lineTo(x-15/phi*Math.cos(54*Math.PI/180),y-15/phi*Math.sin(54*Math.PI/180));
	c.lineTo(x-15*Math.cos(18*Math.PI/180),y-15*Math.sin(18*Math.PI/180));
	c.closePath();
	c.fillStyle="#EE0000";
	c.fill();
	c.stroke();
	//kite
	x=80;
	y=434;
	c.beginPath();
	c.lineWidth=0.5;
	c.moveTo(x,y)
	c.lineTo(x,y-15);
	c.lineTo(x+15*Math.cos(18*Math.PI/180),y-15+15*Math.sin(18*Math.PI/180));
	c.lineTo(x+15/phi*Math.cos(18*Math.PI/180),y-15/phi*Math.sin(18*Math.PI/180));
	c.closePath();
	c.fillStyle="#AAAAAA";
	c.fill();
	c.stroke();
	c.lineWidth=1;
	c.fillStyle="#CCCCCC";
	c.font = "15px Times";
	c.textBaseline="middle";
	c.fillText("Created by Kevin Bertman",1010,20);
}

function displayMessage(message) {
	c.lineWidth=1;
	c.beginPath();
	c.fillStyle="#DDDDDD";
	c.rect(780,670,420,30);
	c.fill();
	c.stroke(); 
	c.fillStyle="#000000";
	c.font = "15px Times";
	c.textBaseline="middle";
	c.fillText(message,790,685);
}

function mouseDown(e) {
	if (animating) return;
	var mX=e.pageX-myCanvas.offsetLeft;
	var mY=e.pageY-myCanvas.offsetTop;
	var updateScreen=false;
	if (mX>10 && mX<50 && mY>10 && mY<50) {
		drawKiteShape=true; deleteShapeMode=false; updateScreen=true; highlightMode=false;
		fixedHighlightMode=false;
		foundMatchingTiling=false;
		totalHighlightedShapes=0;
		highlightedShapeCoords=[[],[],[],[]];
		closestCoords=[[],[],[],[]];
		document.getElementById("message").innerHTML="";
	}
	else if (mX>60 && mX<100 && mY>10 && mY<50) {
		drawKiteShape=false; deleteShapeMode=false; updateScreen=true; highlightMode=false;
		fixedHighlightMode=false;
		foundMatchingTiling=false;
		totalHighlightedShapes=0;
		highlightedShapeCoords=[[],[],[],[]];
		closestCoords=[[],[],[],[]];
		document.getElementById("message").innerHTML="";
	}
	else if (mX>10 && mX<100 && mY>60 && mY<100 && totalShapes>0) {
		if (totalShapes>40000) {
			alert("Will take too long to decompose. Action cancelled."); 
			return;
		}
		deflate(); 
		shapeMap=mapShapes(shapeCoords,totalShapes,size); //make a record of each shape's neighbour
		if (legalMode) checkIfLegal();
		deleteShapeMode=false; 
		highlightMode=false;
		fixedHighlightMode=false;
		foundMatchingTiling=false;
		updateScreen=true;
		totalHighlightedShapes=0;
		highlightedShapeCoords=[[],[],[],[]];
		closestCoords=[[],[],[],[]];
		document.getElementById("message").innerHTML="";
	}
	else if (mX>10 && mX<100 && mY>110 && mY<150 && totalShapes>0) {
		if (totalShapes>10000) {
			alert("Will take too long to compose. Action cancelled.");
			return;   
		}
		inflate();
		shapeMap=mapShapes(shapeCoords,totalShapes,size); //make a record of each shape's neighbour
		if (legalMode) checkIfLegal();
		deleteShapeMode=false; 
		fixedHighlightMode=false;
		highlightMode=false;
		foundMatchingTiling=false;
		updateScreen=true;
		totalHighlightedShapes=0;
		highlightedShapeCoords=[[],[],[],[]];
		closestCoords=[[],[],[],[]];
		document.getElementById("message").innerHTML="";
	}
	else if (mX>10 && mX<50 && mY>210 && mY<250 && totalShapes>0) {
		centre(); updateScreen=true;
	}
	else if (mX>10 && mX<50 && mY>160 && mY<200  && totalShapes>0) {
		if (size>600) return;
		zoomIn(); updateScreen=true;
	}
	else if (mX>60 && mX<100 && mY>160 && mY<200 && totalShapes>0) {
		if (size<10) return;
		zoomOut(); updateScreen=true;
	}
	else if (mX>60 && mX<100 && mY>210 && mY<250) {
		if (showCurves) {showCurves=false} else {showCurves=true;}; updateScreen=true;
	}
	else if (mX>10 && mX<50 && mY>260 && mY<300) {
		highlightMode=false;
		fixedHighlightMode=false;
		totalHighlightedShapes=0;
		if (deleteShapeMode) {deleteShapeMode=false;} else {deleteShapeMode=true;}
		updateScreen=true;
	}
	else if (mX>60 && mX<100 && mY>260 && mY<300) { //clear all
		highlightMode=false;
		legalMode=false;
		fixedHighlightMode=false;
		legalTiling=true;
		foundMatchingTiling=false;
		deleteShapeMode=false;
		showCurves=false;
		totalShapes=0;
		totalFixedHighlightedShapes=0;
		shapeCoords=[[],[],[],[]];
		highlightedShapeCoords=[[],[],[],[]];
		closestCoords=[[],[],[],[]];
		document.getElementById("message").innerHTML="";
		size=50;
		totalHighlightedShapes=0;
		updateScreen=true;
	}
	else if (mX>10 && mX<50 && mY>310 && mY<350) { //rotate left 
		rotate(-18);
		updateScreen=true;
	}
	else if (mX>60 && mX<100 && mY>310 && mY<350) { //rotate right 
		rotate(18);
		updateScreen=true;
	}
	else if (mX>10 && mX<50 && mY>360 && mY<400) { //highlight mode 
		if (highlightMode) {
			highlightMode=false; 
			foundMatchingTiling=false;
			totalHighlightedShapes=0;
			highlightedShapeCoords=[[],[],[],[]];
			closestCoords=[[],[],[],[]];
			document.getElementById("message").innerHTML="";
		} 
		else {highlightMode=true;}
		deleteShapeMode=false;
		fixedHighlightMode=false;
		updateScreen=true;
	}
	else if (mX>60 && mX<100 && mY>360 && mY<400) { //force tilling mode 
		deleteShapeMode=false; 
		highlightMode=false;
		fixedHighlightMode=false;
		foundMatchingTiling=false;
		shapesToAdd=[[],[],[],[]];
		addForcedTiles();
		return;
	}
	else if (mX>10 && mX<50 && mY>410 && mY<450) { //fixed highlight mode
		if (fixedHighlightMode) {fixedHighlightMode=false;} else {
			fixedHighlightMode=true;
			totalFixedHighlightedShapes=0;
		}
		updateScreen=true;
		deleteShapeMode=false; 
	   // highlightMode=false;
	//    foundMatchingTiling=false;
	}
	else if (mX>60 && mX<100 && mY>410 && mY<450) { //legal tilling mode 
		if (legalMode) {legalMode=false;} else {
			legalMode=true;
			checkIfLegal();
		}
		updateScreen=true;
	}
	else if (deleteShapeMode && !(mX<110 && mY<460)) {
		deleteShape(mX,mY); 
		shapeMap=mapShapes(shapeCoords,totalShapes,size); //make a record of each shape's neighbour
		if (legalMode) checkIfLegal();
		updateScreen=true;
	}
	else if (highlightMode && !fixedHighlightMode && !(mX<110 && mY<460)) {highlight(mX,mY); updateScreen=true;}
	else if (fixedHighlightMode && !(mX<110 && mY<460)) {fixedHighlight(mX,mY); updateScreen=true;}
	if (updateScreen) {
		c.beginPath();
		c.clearRect(0,0,1200,800);
		drawShapes(shapeCoords,totalShapes,"#AAAAAA","#EEEEEE");
		if (highlightMode) {
			drawShapes(highlightedShapeCoords,totalHighlightedShapes,"#BB0000","#EE0000");
			//make a record of each shape's neighbour
			highlightedShapeMap=mapShapes(highlightedShapeCoords,totalHighlightedShapes,size); 
			var info=diameter(highlightedShapeCoords,totalHighlightedShapes,highlightedShapeMap,false,"#FF0000");
			tilingCentreX=info[0]; //the centre of the highlighted tiling
			tilingCentreY=info[1]; //the centre of the highlighted tiling
			tilingDiameter=info[2];//the diameter of the tiling
			findSameTiling(highlightedShapeMap,totalHighlightedShapes,highlightedShapeIndex,highlightedShapeCoords,shapeMap,totalShapes,shapeCoords);
		} else {totalHighlightedShapes=0;}
		if (totalFixedHighlightedShapes>0) {
			fixedHighlightedShapeMap=mapShapes(fixedHighlightedShapeCoords,totalFixedHighlightedShapes,fixedHighlightedShapeCoords[4][0]);
			drawFixedHighlightedShapes(fixedHighlightedShapeCoords,totalFixedHighlightedShapes);  
		} 
		drawButtons();
		displayMessage(text);
		var kiteT=0;
		var dartT=0;
		for (var i=0; i<totalShapes; i++) {
			if (shapeCoords[3][i]==0) {kiteT++;} else {dartT++;}
		}
		document.getElementById("kites").innerHTML=kiteT;
		document.getElementById("darts").innerHTML=dartT;
		var t=totalShapes-1;
		if (!legalTiling && legalMode) drawShapes([[shapeCoords[0][t]],[shapeCoords[1][t]],[shapeCoords[2][t]],[shapeCoords[3][t]]],1,"red","red");
		return;
	}
	if (!(mX<110 && mY<460)) {
		totalShapes++;
		shapeMap=mapShapes(shapeCoords,totalShapes,size); //make a record of each shape's neighbour
		drawShapes(shapeCoords,totalShapes,"#AAAAAA","#EEEEEE");
		if (totalFixedHighlightedShapes>0) {
			fixedHighlightedShapeMap=mapShapes(fixedHighlightedShapeCoords,totalFixedHighlightedShapes,fixedHighlightedShapeCoords[4][0]);
			drawFixedHighlightedShapes(fixedHighlightedShapeCoords,totalFixedHighlightedShapes);  
		} 
		drawButtons();
		
		if (legalMode) checkIfLegal();
		var t=totalShapes-1;
		if (!legalTiling && legalMode) drawShapes([[shapeCoords[0][t]],[shapeCoords[1][t]],[shapeCoords[2][t]],[shapeCoords[3][t]]],1,"red","red");
		
		var kiteT=0;
		var dartT=0;
		for (var i=0; i<totalShapes; i++) {
			if (shapeCoords[3][i]==0) {kiteT++;} else {dartT++;}
		}
		document.getElementById("kites").innerHTML=kiteT;
		document.getElementById("darts").innerHTML=dartT;
	}
}

function addForcedTiles() {
	//first determine coordinates of all vertices
	var vertices=[[],[]];
	for (var i=0; i<totalShapes; i++) {
		var x=shapeCoords[0][i];
		var y=shapeCoords[1][i];
		var ang=shapeCoords[2][i];
		vertices[0][4*i]=x;
		vertices[1][4*i]=y;
		vertices[0][4*i+1]=x+size*Math.sin((36+ang)*Math.PI/180);
		vertices[1][4*i+1]=y-size*Math.cos((36+ang)*Math.PI/180);
		vertices[0][4*i+2]=x+size*Math.sin(ang*Math.PI/180);
		vertices[1][4*i+2]=y-size*Math.cos(ang*Math.PI/180);
		if (shapeCoords[3][i]==1) {
			vertices[0][4*i+2]=x+size*Math.sin(ang*Math.PI/180)/phi;
			vertices[1][4*i+2]=y-size*Math.cos(ang*Math.PI/180)/phi;
		}
		vertices[0][4*i+3]=x-size*Math.sin((36-ang)*Math.PI/180);
		vertices[1][4*i+3]=y-size*Math.cos((36-ang)*Math.PI/180);
	}    

	shapeMap=mapShapes(shapeCoords,totalShapes,size); //make a record of each shape's neighbour
	
	//now we need to find how many unique vertices we have and what kind of shapes surround them
	//store the x coordinate, y-coordinate, and surrounding vertices, the surrounding indices
	var verticesInfo=[[],[],[],[]];  
	var totalVertices=0;
	verticesInfo[2][0]=[];
	verticesInfo[3][0]=[];
	for (var i=0; i<4*totalShapes; i++) {
		var x=vertices[0][i];
		var y=vertices[1][i];
		var type=(i%4)+4*shapeCoords[3][Math.floor(i/4)];
		var index=totalVertices;
		for (var j=0; j<totalVertices; j++) {
			if (Math.abs(verticesInfo[0][j]-x)<size/(Math.pow(phi,10)) && 
				Math.abs(verticesInfo[1][j]-y)<size/(Math.pow(phi,10))) {
				index=j;    
			}
		}
		verticesInfo[0][index]=x;
		verticesInfo[1][index]=y;
		verticesInfo[2][index].push(type);
		verticesInfo[3][index].push(Math.floor(i/4));
		if (index==totalVertices) {
			totalVertices++;
			verticesInfo[2][totalVertices]=[];
			verticesInfo[3][totalVertices]=[];
		}
	}
	//count how many of each type surround each vertex
	//0=72 kite, 1=72 kite (two types), 2=144 kite, 3=72 dart, 4=36 dart (two types), 5=216 dart
	var typeCount=[[],[],[],[],[],[]]; 
	for (var i=0; i<totalVertices; i++) {
		typeCount[0][i]=countVertexType(verticesInfo[2][i],0);
		typeCount[1][i]=countVertexType(verticesInfo[2][i],1)+countVertexType(verticesInfo[2][i],3);
		typeCount[2][i]=countVertexType(verticesInfo[2][i],2);
		typeCount[3][i]=countVertexType(verticesInfo[2][i],4);
		typeCount[4][i]=countVertexType(verticesInfo[2][i],5)+countVertexType(verticesInfo[2][i],7);
		typeCount[5][i]=countVertexType(verticesInfo[2][i],6);
	}
	for (var i=0; i<totalVertices; i++) {
		//if there are more than one 72 kite edges we might be able to force some shapes
		if (typeCount[0][i]>1 && typeCount[0][i]<5 &&
			typeCount[1][i]+typeCount[2][i]+typeCount[3][i]+typeCount[4][i]+typeCount[5][i]==0) {
			var a=force72Kite(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],typeCount[0][i],vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there are more than two 72 dart edges we might be able to force some shapes
		if (typeCount[3][i]>2 && typeCount[3][i]<5 && typeCount[1][i]==0) {
			var a=force72Dart(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],typeCount[3][i],vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there is a 216 dart we can force some shapes
		if (typeCount[5][i]==1 && typeCount[1][i]<2) {
			var a=force216Dart(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],typeCount[5][i]+typeCount[1][i],vertices);
			//drawShapes(a,a[0].length,"#AAAA00","#EEEE00");
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there are enough 144 kites and 36 darts we can force some more
		//note we dont need to consider the case when we have two darts as it is dealt with in the
		//previous check
		if (typeCount[2][i]==2 && typeCount[4][i]==1 && typeCount[0][i]==0) {
			var a=force144Kite36DartB(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],3,vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		if (typeCount[2][i]==1 && typeCount[4][i]==1 && typeCount[0][i]==0) {
			var a=force144Kite36DartC(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],2,vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		if (typeCount[2][i]==2 && typeCount[4][i]==0 && typeCount[0][i]==0) {
			var a=force144Kite36DartA(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],2,vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there is one 72 dart and two 72 kites we may be able to force some tiles
		if (typeCount[1][i]==2 && typeCount[3][i]==1) {
			var a=force72Kite72DartA(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],3,vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there are two 72 darts and one 72 kite then we can force tiles
		if (typeCount[1][i]==1 && typeCount[3][i]==2) {
			var a=force72Kite72DartB(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],3,vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there are three darts and one kite we can force
		if (typeCount[1][i]==1 && typeCount[3][i]==3) {
			var a=force72Kite72DartC(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],4,vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there are two darts and two kites we can force
		if (typeCount[1][i]==2 && typeCount[3][i]==2) {
			var a=force72Kite72DartD(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],4,vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there are four 72 kites we can force a dart
		if (typeCount[1][i]==4 && typeCount[3][i]==0) {
			var a=forceFour72Kite72DartA(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],4,vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there are three 72 kites and a dart we can force a kite
		if (typeCount[1][i]==3 && typeCount[3][i]==1) {
			var a=forceFour72Kite72DartB(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],4,vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there are three 72 kites we can force the rest
		if (typeCount[1][i]==3 && typeCount[3][i]==0) {
			var a=forceFour72Kite72DartC(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],3,vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there are two 72 kites and a dart we may be able to force
		if (typeCount[1][i]==2 && typeCount[3][i]==1) {
			var a=forceFour72Kite72DartD(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],3,vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there are two 36 darts and no 72 kites we can force
		if (typeCount[4][i]==2 && typeCount[0][i]==0) {
			var a=forceKite72Kite144Kite36DartA(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],typeCount[4][i]+typeCount[2][i],vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there are two 36 darts and one 72 kite we can force
		if (typeCount[4][i]==2 && typeCount[0][i]==1) {
			var a=forceKite72Kite144Kite36DartB(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],typeCount[4][i]+typeCount[2][i]+typeCount[0][i],vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there are two 72 kites and one 36 dart we can force
		if (typeCount[4][i]==1 && typeCount[0][i]==2 && typeCount[2][i]==0) {
			var a=forceKite72Kite144Kite36DartC(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],typeCount[4][i]+typeCount[2][i]+typeCount[0][i],vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there is one 36 kite and one 72 kite we can force
		if (typeCount[4][i]==1 && typeCount[0][i]==1) {
			var a=forceKite72Kite144Kite36DartD(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],typeCount[4][i]+typeCount[2][i]+typeCount[0][i],vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there is one 144 kite and one 72 kite and no darts we can force
		if (typeCount[4][i]==0 && typeCount[0][i]==1 && typeCount[2][i]==1) {
			var a=forceKite72Kite144Kite36DartE(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],typeCount[4][i]+typeCount[2][i]+typeCount[0][i],vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there is one 144 kite and two 72 kites and no darts we can force
		if (typeCount[4][i]==0 && typeCount[0][i]==2 && typeCount[2][i]==1) {
			var a=forceKite72Kite144Kite36DartF(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],typeCount[4][i]+typeCount[2][i]+typeCount[0][i],vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
		//if there is one 144 kite, two 72 kites and one dart we can force
		if (typeCount[4][i]==1 && typeCount[0][i]==2 && typeCount[2][i]==1) {
			var a=forceKite72Kite144Kite36DartG(verticesInfo[0][i],verticesInfo[1][i],verticesInfo[3][i],4,vertices);
			for (var t=0; t<a[0].length; t++) {
				shapesToAdd[0].push(a[0][t]);
				shapesToAdd[1].push(a[1][t]);
				shapesToAdd[2].push(a[2][t]);
				shapesToAdd[3].push(a[3][t]);    
			}
		}
	}
	if (shapesToAdd[3].length>0) {
		animating=true;
		animateAddingShapes(shapesToAdd);
		return true;
	} else {
		return false;
	};
}

function animateAddingShapes() {
//	drawShapes(shapesToAdd,1,"#00AAAA","#00EEEE");
//	drawButtons();
//	displayMessage(text);
	shapeCoords[0][totalShapes]=shapesToAdd[0][0];
	shapeCoords[1][totalShapes]=shapesToAdd[1][0];
	shapeCoords[2][totalShapes]=shapesToAdd[2][0];
	shapeCoords[3][totalShapes]=shapesToAdd[3][0];
	shapesToAdd[0].shift()
	shapesToAdd[1].shift()
	shapesToAdd[2].shift()
	shapesToAdd[3].shift()
	totalShapes++; 
//	if (shapesToAdd[3].length>0) {setTimeout(animateAddingShapes,10);} 
	if (shapesToAdd[3].length>0) {animateAddingShapes();} 
	else {
/*		animating=false; 
		cleanUp();
		shapeMap=mapShapes(shapeCoords,totalShapes,size);
		drawShapes(shapeCoords,totalShapes,"#AAAAAA","#EEEEEE");
		var t=totalShapes-1;
		if (!legalTiling && legalMode) {drawShapes([[shapeCoords[0][t]],[shapeCoords[1][t]],[shapeCoords[2][t]],[shapeCoords[3][t]]],1,"red","red");} 
		drawButtons();
		displayMessage(text);
		var kiteT=0;
		var dartT=0;
		for (var i=0; i<totalShapes; i++) {
			if (shapeCoords[3][i]==0) {kiteT++;} else {dartT++;}
		}
		document.getElementById("kites").innerHTML=kiteT;
		document.getElementById("darts").innerHTML=dartT;*/
	}
}

function force72Kite(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	//if there are 2 and they are not connected then we can force a sun, if they are connected we
	//cant force anything
	if (total==2) {
		//if they are connected do nothing
		var connected=false;
		for (var j=0; j<4; j++) {
			if (shapeMap[j][indices[0]]==indices[1]) connected=true;
			if (shapeMap[j][indices[1]]==indices[0]) connected=true;
		}
		if (connected) {return [[],[],[],[]];}
	}
	
	for (var k=0; k<4; k++) {
		var ind=indices[0];
		var match=false;
		//we need to check to see if the shape we add currently matches any existing shape
		//only add if it doesnt
		for (var m=1; m<total; m++) {
			var ind2=indices[m];
			var x2=x+size*Math.sin((shapeCoords[2][ind]+72+72*k)/180*Math.PI); 
			var y2=y-size*Math.cos((shapeCoords[2][ind]+72+72*k)/180*Math.PI);
			if (Math.abs(x2-vertexCoords[0][4*ind2+2])<size/(Math.pow(phi,10)) && 
				Math.abs(y2-vertexCoords[1][4*ind2+2])<size/(Math.pow(phi,10))) {match=true;}
		}
		if (match) continue;
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind]+72+72*k);
		addShapeCoords[3].push(0);
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function force72Dart(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	//if there are 3 and they are not connected then we can force a star, if they are connected we
	//cant force anything
	if (total==3) {
		//if they are connected do nothing
		var connections=0;
		for (var j=0; j<4; j++) {
			if (shapeMap[j][indices[0]]==indices[1]) connections++;
		}
		var connected2=false;
		for (var j=0; j<4; j++) {
			if (shapeMap[j][indices[0]]==indices[2]) connections++;
		}
		for (var j=0; j<4; j++) {
			if (shapeMap[j][indices[1]]==indices[2]) connections++;
		}
		if (connections==2) {return [[],[],[],[]];}
	}
	
	for (var k=0; k<4; k++) {
		var ind=indices[0];
		var match=false;
		//we need to check to see if the shape we add currently matches any existing shape
		//only add if it doesnt
		for (var m=1; m<total; m++) {
			var ind2=indices[m];
			var x2=x+size*Math.sin((shapeCoords[2][ind]+72+72*k)/180*Math.PI)/phi; 
			var y2=y-size*Math.cos((shapeCoords[2][ind]+72+72*k)/180*Math.PI)/phi;
			if (Math.abs(x2-vertexCoords[0][4*ind2+2])<size/(Math.pow(phi,10)) && 
				Math.abs(y2-vertexCoords[1][4*ind2+2])<size/(Math.pow(phi,10))) {match=true;}
		}
		if (match) continue;
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind]+72+72*k);
		addShapeCoords[3].push(1);
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function force216Dart(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is the dart
	var ind;
	var N;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1) {ind=indices[n]; N=n;}   
	}
	//if we only have one dart we definitely need to add two kites
	if (total==1) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind]-144);
		addShapeCoords[3].push(0);   
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind]+144);
		addShapeCoords[3].push(0);   
	} else if (Math.abs(vertexCoords[0][4*ind+1]-vertexCoords[0][4*indices[(N+1)%2]+2])<size/Math.pow(phi,10) && Math.abs(vertexCoords[1][4*ind+1]-vertexCoords[1][4*indices[(N+1)%2]+2])<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind]-144);
		addShapeCoords[3].push(0);
	} else {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind]+144);
		addShapeCoords[3].push(0);
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function force144Kite36DartA(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is a dart
	var ind1=indices[0];
	var ind2=indices[1];
	if (shapeMap[1][ind1]==ind2) {
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind1]-72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind1]-72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind1]+144);
		addShapeCoords[3].push(1);
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind1]-72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind1]-72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind1]+72);
		addShapeCoords[3].push(1);
	} else if (shapeMap[1][ind2]==ind1) {
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind2]-72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind2]-72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind2]+144);
		addShapeCoords[3].push(1);
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind2]-72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind2]-72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind2]+72);
		addShapeCoords[3].push(1);
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function force144Kite36DartB(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is a dart
	//first find which shape is the kite
	var ind1;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==0) {ind1=indices[n];}   
	}   
	//then find the next kite
	var ind2;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==0 && indices[n]!=ind1) {ind2=indices[n];}   
	}
	//then find the dart
	var ind3;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1) {ind3=indices[n];}   
	}
	if (shapeMap[2][ind1]==ind3) {
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind1]-72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind1]-72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind1]+72);
		addShapeCoords[3].push(1);
	} else if (shapeMap[2][ind2]==ind3) {
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind2]-72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind2]-72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind2]+72);
		addShapeCoords[3].push(1);
	} else if (shapeMap[1][ind1]==ind3) {
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind1]+72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind1]+72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind1]-72);
		addShapeCoords[3].push(1);
	} else if (shapeMap[1][ind2]==ind3) {
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind2]+72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind2]+72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind2]-72);
		addShapeCoords[3].push(1);
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function force144Kite36DartC(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is a dart
	//first find which shape is the kite
	var ind1;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==0) {ind1=indices[n];}   
	}   
	//then find the dart
	var ind2;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1) {ind2=indices[n];}   
	}
	if (shapeMap[1][ind2]==ind1 || shapeMap[2][ind2]==ind1) {
		//if the two shapes are connected we cant force    
		return [[],[],[],[]];
	}
	var X=x+size*Math.sin((shapeCoords[2][ind1]-72)*Math.PI/180);
	var Y=y-size*Math.cos((shapeCoords[2][ind1]-72)*Math.PI/180);
	var XX=x+size*Math.sin((shapeCoords[2][ind1]+72)*Math.PI/180);
	var YY=y-size*Math.cos((shapeCoords[2][ind1]+72)*Math.PI/180);
	if (Math.abs(X-shapeCoords[0][ind2])<size/Math.pow(phi,10) &&
	   Math.abs(Y-shapeCoords[1][ind2])<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind1]-72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind1]-72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind2]+72);
		addShapeCoords[3].push(1);
		//dont need to add kite as it is already dealt with in previous case
	} else if (Math.abs(XX-shapeCoords[0][ind2])<size/Math.pow(phi,10) &&
	   Math.abs(YY-shapeCoords[1][ind2])<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind1]+72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind1]+72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind2]-72);
		addShapeCoords[3].push(1);
		//dont need to add kite as it is already dealt with in previous case
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function force72Kite72DartA(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is the dart
	var ind;
	var N;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1) {ind=indices[n]; N=n;}   
	}     
	var meet=false;
	var X1=vertexCoords[0][4*ind];
	var Y1=vertexCoords[1][4*ind];
	var X2=vertexCoords[0][4*ind+1];
	var Y2=vertexCoords[1][4*ind+1];
	var X3=vertexCoords[0][4*ind+3];
	var Y3=vertexCoords[1][4*ind+3];
	
	var ind2=indices[(N+1)%3];
	var X4=vertexCoords[0][4*ind2];
	var Y4=vertexCoords[1][4*ind2];
	var X5=vertexCoords[0][4*ind2+1];
	var Y5=vertexCoords[1][4*ind2+1];
	var X6=vertexCoords[0][4*ind2+3];
	var Y6=vertexCoords[1][4*ind2+3];
	//if the dart is touching one of the kites we cant force
	if (Math.abs(X1-X5)<size/Math.pow(phi,10) && Math.abs(Y1-Y5)<size/Math.pow(phi,10) &&
	   Math.abs(X2-X4)<size/Math.pow(phi,10) && Math.abs(Y2-Y4)<size/Math.pow(phi,10)) {
		return [[],[],[],[]];
	}
	if (Math.abs(X1-X6)<size/Math.pow(phi,10) && Math.abs(Y1-Y6)<size/Math.pow(phi,10) &&
	   Math.abs(X3-X4)<size/Math.pow(phi,10) && Math.abs(Y3-Y4)<size/Math.pow(phi,10)) {
		return [[],[],[],[]];
	}
	//if the two long sides of the kites meet we have a different vertex which will be dealt 
	//with later
	if (shapeMap[0][indices[(N+1)%3]]==indices[(N+2)%3] || shapeMap[0][indices[(N+2)%3]]==indices[(N+1)%3]) return [[],[],[],[]];
	ind2=indices[(N+2)%3];
	X4=vertexCoords[0][4*ind2];
	Y4=vertexCoords[1][4*ind2];
	X5=vertexCoords[0][4*ind2+1];
	Y5=vertexCoords[1][4*ind2+1];
	X6=vertexCoords[0][4*ind2+3];
	Y6=vertexCoords[1][4*ind2+3];
	if (Math.abs(X1-X5)<size/Math.pow(phi,10) && Math.abs(Y1-Y5)<size/Math.pow(phi,10) &&
	   Math.abs(X2-X4)<size/Math.pow(phi,10) && Math.abs(Y2-Y4)<size/Math.pow(phi,10)) {
		return [[],[],[],[]];
	}
	if (Math.abs(X1-X6)<size/Math.pow(phi,10) && Math.abs(Y1-Y6)<size/Math.pow(phi,10) &&
	   Math.abs(X3-X4)<size/Math.pow(phi,10) && Math.abs(Y3-Y4)<size/Math.pow(phi,10)) {
		return [[],[],[],[]];
	}
	//if we are still here then we can add two darts, one on each side of the current dart
	addShapeCoords[0].push(x);
	addShapeCoords[1].push(y);
	addShapeCoords[2].push(shapeCoords[2][ind]-72);
	addShapeCoords[3].push(1); 
	addShapeCoords[0].push(x);
	addShapeCoords[1].push(y);
	addShapeCoords[2].push(shapeCoords[2][ind]+72);
	addShapeCoords[3].push(1); 
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function force72Kite72DartB(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is the dart
	var ind1;
	var N1;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1) {ind1=indices[n]; N1=n;}   
	}   
	//then find the other dart
	var ind2;
	var N2;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1 && indices[n]!=ind1) {ind2=indices[n]; N2=n;}   
	}  
	//then find the kite
	var ind3;
	var N3=0;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==0) {ind3=indices[n]; N3=n;}   
	}
	//if the two darts are not connected we can force
	if (shapeMap[0][ind1]!=ind2 && shapeMap[1][ind1]!=ind2 && 
		shapeMap[2][ind1]!=ind2 && shapeMap[3][ind1]!=ind2) {
		if (Math.abs(x+size*Math.sin((shapeCoords[2][ind1]+108)*Math.PI/180)-vertexCoords[0][4*ind2+3])<size/Math.pow(phi,10) && Math.abs(y-size*Math.cos((shapeCoords[2][ind1]+108)*Math.PI/180)-vertexCoords[1][4*ind2+3])<size/Math.pow(phi,10)) {
			addShapeCoords[0].push(x);
			addShapeCoords[1].push(y);
			addShapeCoords[2].push(shapeCoords[2][ind1]+72);
			addShapeCoords[3].push(1);     
		} else {
			addShapeCoords[0].push(x);
			addShapeCoords[1].push(y);
			addShapeCoords[2].push(shapeCoords[2][ind1]-72);
			addShapeCoords[3].push(1);    
		}
		if (Math.abs(vertexCoords[0][4*ind1+3]-vertexCoords[0][4*ind3])<size/Math.pow(phi,10) && 
		   Math.abs(vertexCoords[1][4*ind1+3]-vertexCoords[1][4*ind3])<size/Math.pow(phi,10)) {
			addShapeCoords[0].push(vertexCoords[0][4*ind2+1]);
			addShapeCoords[1].push(vertexCoords[1][4*ind2+1]);
			addShapeCoords[2].push(shapeCoords[2][ind2]+180);
			addShapeCoords[3].push(0); 
		} else if (Math.abs(vertexCoords[0][4*ind2+3]-vertexCoords[0][4*ind3])<size/Math.pow(phi,10) && Math.abs(vertexCoords[1][4*ind2+3]-vertexCoords[1][4*ind3])<size/Math.pow(phi,10)) {
			addShapeCoords[0].push(vertexCoords[0][4*ind1+1]);
			addShapeCoords[1].push(vertexCoords[1][4*ind1+1]);
			addShapeCoords[2].push(shapeCoords[2][ind1]+180);
			addShapeCoords[3].push(0); 
		} else if (Math.abs(vertexCoords[0][4*ind2+1]-vertexCoords[0][4*ind3])<size/Math.pow(phi,10) && Math.abs(vertexCoords[1][4*ind2+1]-vertexCoords[1][4*ind3])<size/Math.pow(phi,10)) {
			addShapeCoords[0].push(vertexCoords[0][4*ind1+3]);
			addShapeCoords[1].push(vertexCoords[1][4*ind1+3]);
			addShapeCoords[2].push(shapeCoords[2][ind1]+180);
			addShapeCoords[3].push(0); 
		} else if (Math.abs(vertexCoords[0][4*ind1+1]-vertexCoords[0][4*ind3])<size/Math.pow(phi,10) && Math.abs(vertexCoords[1][4*ind1+1]-vertexCoords[1][4*ind3])<size/Math.pow(phi,10)) {
			addShapeCoords[0].push(vertexCoords[0][4*ind2+3]);
			addShapeCoords[1].push(vertexCoords[1][4*ind2+3]);
			addShapeCoords[2].push(shapeCoords[2][ind2]+180);
			addShapeCoords[3].push(0); 
		}
	} else { //if the two darts are connected we can also force
		//first deal with the case when all three are connected
		if (shapeMap[0][ind3]==ind1 || shapeMap[0][ind3]==ind2) {
			addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind3]*Math.PI/180));
			addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind3]*Math.PI/180));
			addShapeCoords[2].push(shapeCoords[2][ind3]-144);
			addShapeCoords[3].push(0);
			addShapeCoords[0].push(x);
			addShapeCoords[1].push(y);
			addShapeCoords[2].push(shapeCoords[2][ind3]+36);
			addShapeCoords[3].push(1);
		} else if (shapeMap[3][ind3]==ind1 || shapeMap[3][ind3]==ind2) {
			addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind3]*Math.PI/180));
			addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind3]*Math.PI/180));
			addShapeCoords[2].push(shapeCoords[2][ind3]+144);
			addShapeCoords[3].push(0);
			addShapeCoords[0].push(x);
			addShapeCoords[1].push(y);
			addShapeCoords[2].push(shapeCoords[2][ind3]-36);
			addShapeCoords[3].push(1);
		}
		//now deal with the case where the kite is not connected to the darts
		else if (Math.abs(x-vertexCoords[0][4*ind3+1])<size/Math.pow(phi,10) && 
				 Math.abs(y-vertexCoords[1][4*ind3+1])<size/Math.pow(phi,10)) {
			addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind3]*Math.PI/180));
			addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind3]*Math.PI/180));
			addShapeCoords[2].push(shapeCoords[2][ind3]-144);
			addShapeCoords[3].push(0);
			addShapeCoords[0].push(x);
			addShapeCoords[1].push(y);
			addShapeCoords[2].push(shapeCoords[2][ind3]-180);
			addShapeCoords[3].push(1);    
		} else if (Math.abs(x-vertexCoords[0][4*ind3+3])<size/Math.pow(phi,10) && 
				 Math.abs(y-vertexCoords[1][4*ind3+3])<size/Math.pow(phi,10)) {
			addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind3]*Math.PI/180));
			addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind3]*Math.PI/180));
			addShapeCoords[2].push(shapeCoords[2][ind3]+144);
			addShapeCoords[3].push(0);
			addShapeCoords[0].push(x);
			addShapeCoords[1].push(y);
			addShapeCoords[2].push(shapeCoords[2][ind3]-180);
			addShapeCoords[3].push(1);    
		}
											
		
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function force72Kite72DartC(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	//find the kite
	var ind;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==0) {ind=indices[n];}   
	}
	if (Math.abs(x-vertexCoords[0][4*ind+1])<size/Math.pow(phi,10) && 
				 Math.abs(y-vertexCoords[1][4*ind+1])<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind]-144);
		addShapeCoords[3].push(0);    
	} else {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind]+144);
		addShapeCoords[3].push(0);
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function force72Kite72DartD(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is the dart
	var ind1;
	var N1;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1) {ind1=indices[n]; N1=n;}   
	}   
	//then find the other dart
	var ind2;
	var N2;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1 && indices[n]!=ind1) {ind2=indices[n]; N2=n;}   
	}  
	//then find the kite
	var ind3;
	var N3=0;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==0) {ind3=indices[n]; N3=n;}   
	}  
	//then find the other kite
	var ind4;
	var N4;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==0 && indices[n]!=ind3) {ind4=indices[n]; N4=n;}   
	}  
	//if the two darts are not connected we can force
	if (shapeMap[0][ind1]!=ind2 && shapeMap[1][ind1]!=ind2 && 
		shapeMap[2][ind1]!=ind2 && shapeMap[3][ind1]!=ind2) {
		if (Math.abs(x+size*Math.sin((shapeCoords[2][ind1]+108)*Math.PI/180)-vertexCoords[0][4*ind2+3])<size/Math.pow(phi,10) && Math.abs(y-size*Math.cos((shapeCoords[2][ind1]+108)*Math.PI/180)-vertexCoords[1][4*ind2+3])<size/Math.pow(phi,10)) {
			addShapeCoords[0].push(x);
			addShapeCoords[1].push(y);
			addShapeCoords[2].push(shapeCoords[2][ind1]+72);
			addShapeCoords[3].push(1);     
		} else {
			addShapeCoords[0].push(x);
			addShapeCoords[1].push(y);
			addShapeCoords[2].push(shapeCoords[2][ind1]-72);
			addShapeCoords[3].push(1);    
		}
	}
	//if the two darts are connected we can force
	else if (Math.abs(vertexCoords[0][4*ind3]-vertexCoords[0][4*ind1+1])<size/Math.pow(phi,10) &&
	   Math.abs(vertexCoords[1][4*ind3]-vertexCoords[1][4*ind1+1])<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind3]+36);
		addShapeCoords[3].push(1);  
	} else if (Math.abs(vertexCoords[0][4*ind3]-vertexCoords[0][4*ind2+1])<size/Math.pow(phi,10) &&
	   Math.abs(vertexCoords[1][4*ind3]-vertexCoords[1][4*ind2+1])<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind3]+36);
		addShapeCoords[3].push(1);   
	} else if (Math.abs(vertexCoords[0][4*ind4]-vertexCoords[0][4*ind1+1])<size/Math.pow(phi,10) &&
	   Math.abs(vertexCoords[1][4*ind4]-vertexCoords[1][4*ind1+1])<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind4]+36);
		addShapeCoords[3].push(1);  
	} else if (Math.abs(vertexCoords[0][4*ind4]-vertexCoords[0][4*ind2+1])<size/Math.pow(phi,10) &&
	   Math.abs(vertexCoords[1][4*ind4]-vertexCoords[1][4*ind2+1])<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind4]+36);
		addShapeCoords[3].push(1);   
	} else if (Math.abs(vertexCoords[0][4*ind3]-vertexCoords[0][4*ind1+3])<size/Math.pow(phi,10) &&
	   Math.abs(vertexCoords[1][4*ind3]-vertexCoords[1][4*ind1+3])<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind3]-36);
		addShapeCoords[3].push(1); 
	} else if (Math.abs(vertexCoords[0][4*ind3]-vertexCoords[0][4*ind2+3])<size/Math.pow(phi,10) &&
	   Math.abs(vertexCoords[1][4*ind3]-vertexCoords[1][4*ind2+3])<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind3]-36);
		addShapeCoords[3].push(1); 
	} else if (Math.abs(vertexCoords[0][4*ind4]-vertexCoords[0][4*ind1+3])<size/Math.pow(phi,10) &&
	   Math.abs(vertexCoords[1][4*ind4]-vertexCoords[1][4*ind1+3])<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind4]-36);
		addShapeCoords[3].push(1);
	} else if (Math.abs(vertexCoords[0][4*ind4]-vertexCoords[0][4*ind2+3])<size/Math.pow(phi,10) &&
	   Math.abs(vertexCoords[1][4*ind4]-vertexCoords[1][4*ind2+3])<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind4]-36);
		addShapeCoords[3].push(1);  
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function forceFour72Kite72DartA(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	var ind1=indices[0];
	var ind2=indices[1];
	var ind3=indices[2];
	var ind4=indices[3];
	//check to see which kite has its 4th vertex at the centre and no neighbour on fourth side
	// or first side then use this to add the missing dart
	if (Math.abs(vertexCoords[0][4*ind1+3]-x)<size/Math.pow(phi,10) &&
	   Math.abs(vertexCoords[1][4*ind1+3]-y)<size/Math.pow(phi,10) &&
	   shapeMap[3][ind1]!=ind2 && shapeMap[3][ind1]!=ind3 && shapeMap[3][ind1]!=ind4 &&
	   shapeMap[1][ind1]!=ind2 && shapeMap[1][ind1]!=ind3 && shapeMap[1][ind1]!=ind4) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind1]-180);
		addShapeCoords[3].push(1);     
	}
	else if (Math.abs(vertexCoords[0][4*ind2+3]-x)<size/Math.pow(phi,10) &&
	   Math.abs(vertexCoords[1][4*ind2+3]-y)<size/Math.pow(phi,10) &&
	   shapeMap[3][ind2]!=ind1 && shapeMap[3][ind2]!=ind3 && shapeMap[3][ind2]!=ind4 &&
	   shapeMap[1][ind2]!=ind1 && shapeMap[1][ind2]!=ind3 && shapeMap[1][ind2]!=ind4) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind2]-180);
		addShapeCoords[3].push(1);     
	}
	else if (Math.abs(vertexCoords[0][4*ind3+3]-x)<size/Math.pow(phi,10) &&
	   Math.abs(vertexCoords[1][4*ind3+3]-y)<size/Math.pow(phi,10) &&
	   shapeMap[3][ind3]!=ind1 && shapeMap[3][ind3]!=ind2 && shapeMap[3][ind3]!=ind4 &&
	   shapeMap[1][ind3]!=ind1 && shapeMap[1][ind3]!=ind2 && shapeMap[1][ind3]!=ind4) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind3]-180);
		addShapeCoords[3].push(1);     
	}
	else if (Math.abs(vertexCoords[0][4*ind4+3]-x)<size/Math.pow(phi,10) &&
	   Math.abs(vertexCoords[1][4*ind4+3]-y)<size/Math.pow(phi,10) &&
	   shapeMap[3][ind4]!=ind1 && shapeMap[3][ind4]!=ind2 && shapeMap[3][ind4]!=ind3 &&
	   shapeMap[1][ind4]!=ind1 && shapeMap[1][ind4]!=ind2 && shapeMap[1][ind4]!=ind3) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind4]-180);
		addShapeCoords[3].push(1);     
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function forceFour72Kite72DartB(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is the dart
	var ind1;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1) {ind1=indices[n];}   
	}   
	//then find the kites
	var ind2;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==0) {ind2=indices[n];}   
	}  
	// find the next kite
	var ind3;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==0 && indices[n]!=ind2) {ind3=indices[n];}   
	}  
	//then find the other kite
	var ind4;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==0 && indices[n]!=ind3 && indices[n]!=ind2) {ind4=indices[n];}  
	}  
	//if the dart is missing a neighbour add the kite there
	if (shapeMap[0][ind1]!=ind2 && shapeMap[0][ind1]!=ind3 && shapeMap[0][ind1]!=ind4) {
		addShapeCoords[0].push(vertexCoords[0][4*ind1+1]);
		addShapeCoords[1].push(vertexCoords[1][4*ind1+1]);
		addShapeCoords[2].push(shapeCoords[2][ind1]-180);
		addShapeCoords[3].push(0);    
	}
	else if (shapeMap[3][ind1]!=ind2 && shapeMap[3][ind1]!=ind3 && shapeMap[3][ind1]!=ind4) {
		addShapeCoords[0].push(vertexCoords[0][4*ind1+3]);
		addShapeCoords[1].push(vertexCoords[1][4*ind1+3]);
		addShapeCoords[2].push(shapeCoords[2][ind1]-180);
		addShapeCoords[3].push(0);    
	}
	//if a kite doesnt have a member on any long sides add a kite there
	else if (shapeMap[3][ind2]!=ind1 && shapeMap[0][ind2]!=ind1) {
		if (Math.abs(vertexCoords[0][4*ind2+1]-x)<size/Math.pow(phi,10) &&
		   Math.abs(vertexCoords[1][4*ind2+1]-y)<size/Math.pow(phi,10)) {
			addShapeCoords[0].push(vertexCoords[0][4*ind2]);
			addShapeCoords[1].push(vertexCoords[1][4*ind2]);
			addShapeCoords[2].push(shapeCoords[2][ind2]+72);
			addShapeCoords[3].push(0); 
		} else {
			addShapeCoords[0].push(vertexCoords[0][4*ind2]);
			addShapeCoords[1].push(vertexCoords[1][4*ind2]);
			addShapeCoords[2].push(shapeCoords[2][ind2]-72);
			addShapeCoords[3].push(0);    
		}
	}
	else if (shapeMap[3][ind3]!=ind1 && shapeMap[0][ind3]!=ind1) {
		if (Math.abs(vertexCoords[0][4*ind3+1]-x)<size/Math.pow(phi,10) &&
		   Math.abs(vertexCoords[1][4*ind3+1]-y)<size/Math.pow(phi,10)) {
			addShapeCoords[0].push(vertexCoords[0][4*ind3]);
			addShapeCoords[1].push(vertexCoords[1][4*ind3]);
			addShapeCoords[2].push(shapeCoords[2][ind3]+72);
			addShapeCoords[3].push(0); 
		} else {
			addShapeCoords[0].push(vertexCoords[0][4*ind3]);
			addShapeCoords[1].push(vertexCoords[1][4*ind3]);
			addShapeCoords[2].push(shapeCoords[2][ind3]-72);
			addShapeCoords[3].push(0);    
		}
	}
	else if (shapeMap[3][ind4]!=ind1 && shapeMap[0][ind4]!=ind1) {
		if (Math.abs(vertexCoords[0][4*ind4+1]-x)<size/Math.pow(phi,10) &&
		   Math.abs(vertexCoords[1][4*ind4+1]-y)<size/Math.pow(phi,10)) {
			addShapeCoords[0].push(vertexCoords[0][4*ind4]);
			addShapeCoords[1].push(vertexCoords[1][4*ind4]);
			addShapeCoords[2].push(shapeCoords[2][ind4]+72);
			addShapeCoords[3].push(0); 
		} else {
			addShapeCoords[0].push(vertexCoords[0][4*ind4]);
			addShapeCoords[1].push(vertexCoords[1][4*ind4]);
			addShapeCoords[2].push(shapeCoords[2][ind4]-72);
			addShapeCoords[3].push(0);    
		}
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function forceFour72Kite72DartC(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	var ind1=indices[0];
	var ind2=indices[1];
	var ind3=indices[2];
	//if a kite has no neighbour on its third side we can force
	if (shapeMap[2][ind1]!=ind2 && shapeMap[2][ind1]!=ind3 &&
		shapeMap[3][ind1]!=ind2 && shapeMap[3][ind1]!=ind3 &&
		Math.abs(vertexCoords[0][4*ind1+3]-x)<size/Math.pow(phi,10) && 
		Math.abs(vertexCoords[1][4*ind1+3]-y)<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind1]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind1]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind1]+144);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind1]-180);
		addShapeCoords[3].push(1);
	}
	else if (shapeMap[2][ind2]!=ind1 && shapeMap[2][ind2]!=ind3 &&
			 shapeMap[3][ind2]!=ind1 && shapeMap[3][ind2]!=ind3 &&
		Math.abs(vertexCoords[0][4*ind2+3]-x)<size/Math.pow(phi,10) && 
		Math.abs(vertexCoords[1][4*ind2+3]-y)<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind2]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind2]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind2]+144);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind2]-180);
		addShapeCoords[3].push(1);
	}
	else if (shapeMap[2][ind3]!=ind1 && shapeMap[2][ind3]!=ind2 &&
			 shapeMap[3][ind3]!=ind1 && shapeMap[3][ind3]!=ind2 &&
		Math.abs(vertexCoords[0][4*ind3+3]-x)<size/Math.pow(phi,10) && 
		Math.abs(vertexCoords[1][4*ind3+3]-y)<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind3]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind3]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind3]+144);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind3]-180);
		addShapeCoords[3].push(1);
	}
	//if a kite has no neighbour on its third side we can force
	else if (shapeMap[1][ind1]!=ind2 && shapeMap[1][ind1]!=ind3 &&
			 shapeMap[0][ind1]!=ind2 && shapeMap[0][ind1]!=ind3 &&
		Math.abs(vertexCoords[0][4*ind1+1]-x)<size/Math.pow(phi,10) && 
		Math.abs(vertexCoords[1][4*ind1+1]-y)<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind1]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind1]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind1]-144);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind1]-180);
		addShapeCoords[3].push(1);
	}
	else if (shapeMap[1][ind2]!=ind1 && shapeMap[1][ind2]!=ind3 &&
			 shapeMap[0][ind2]!=ind1 && shapeMap[0][ind2]!=ind3 &&
		Math.abs(vertexCoords[0][4*ind2+1]-x)<size/Math.pow(phi,10) && 
		Math.abs(vertexCoords[1][4*ind2+1]-y)<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind2]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind2]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind2]-144);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind2]-180);
		addShapeCoords[3].push(1);
	}
	else if (shapeMap[1][ind3]!=ind1 && shapeMap[1][ind3]!=ind2 &&
			 shapeMap[0][ind3]!=ind1 && shapeMap[0][ind3]!=ind2 &&
		Math.abs(vertexCoords[0][4*ind3+1]-x)<size/Math.pow(phi,10) && 
		Math.abs(vertexCoords[1][4*ind3+1]-y)<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind3]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind3]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind3]-144);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind3]-180);
		addShapeCoords[3].push(1);
	}
	else if (shapeMap[2][ind1]!=ind2 && shapeMap[2][ind1]!=ind3 &&
		Math.abs(vertexCoords[0][4*ind1+3]-x)<size/Math.pow(phi,10) && 
		Math.abs(vertexCoords[1][4*ind1+3]-y)<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind1]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind1]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind1]+144);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind1]-36);
		addShapeCoords[3].push(1);
	}
	else if (shapeMap[2][ind2]!=ind1 && shapeMap[2][ind2]!=ind3 &&
		Math.abs(vertexCoords[0][4*ind2+3]-x)<size/Math.pow(phi,10) && 
		Math.abs(vertexCoords[1][4*ind2+3]-y)<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind2]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind2]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind2]+144);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind2]-36);
		addShapeCoords[3].push(1);
	}
	else if (shapeMap[2][ind3]!=ind1 && shapeMap[2][ind3]!=ind2 &&
		Math.abs(vertexCoords[0][4*ind3+3]-x)<size/Math.pow(phi,10) && 
		Math.abs(vertexCoords[1][4*ind3+3]-y)<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind3]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind3]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind3]+144);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind3]-36);
		addShapeCoords[3].push(1);
	}
	//if a kite has no neighbour on its third side we can force
	else if (shapeMap[1][ind1]!=ind2 && shapeMap[1][ind1]!=ind3 &&
		Math.abs(vertexCoords[0][4*ind1+1]-x)<size/Math.pow(phi,10) && 
		Math.abs(vertexCoords[1][4*ind1+1]-y)<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind1]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind1]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind1]-144);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind1]+36);
		addShapeCoords[3].push(1);
	}
	else if (shapeMap[1][ind2]!=ind1 && shapeMap[1][ind2]!=ind3 &&
		Math.abs(vertexCoords[0][4*ind2+1]-x)<size/Math.pow(phi,10) && 
		Math.abs(vertexCoords[1][4*ind2+1]-y)<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind2]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind2]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind2]-144);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind2]+36);
		addShapeCoords[3].push(1);
	}
	else if (shapeMap[1][ind3]!=ind1 && shapeMap[1][ind3]!=ind2 &&
		Math.abs(vertexCoords[0][4*ind3+1]-x)<size/Math.pow(phi,10) && 
		Math.abs(vertexCoords[1][4*ind3+1]-y)<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x+size*Math.sin(shapeCoords[2][ind3]*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos(shapeCoords[2][ind3]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind3]-144);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind3]+36);
		addShapeCoords[3].push(1);
	}
   if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function forceFour72Kite72DartD(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is the dart
	var ind1;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1) {ind1=indices[n];}   
	}   
	//then find the kites
	var ind2;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==0) {ind2=indices[n];}   
	}  
	// find the next kite
	var ind3;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==0 && indices[n]!=ind2) {ind3=indices[n];}   
	} 
	//if both long sides of kites are connected we can force
	if (shapeMap[0][ind2]==ind3 || shapeMap[0][ind3]==ind2) {
		addShapeCoords[0].push(vertexCoords[0][4*ind1+1]);
		addShapeCoords[1].push(vertexCoords[1][4*ind1+1]);
		addShapeCoords[2].push(shapeCoords[2][ind1]-180);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(vertexCoords[0][4*ind1+3]);
		addShapeCoords[1].push(vertexCoords[1][4*ind1+3]);
		addShapeCoords[2].push(shapeCoords[2][ind1]-180);
		addShapeCoords[3].push(0);    
	}
	
	//if dart and a kite are connected and other kite is not connected we can force
	else if (shapeMap[0][ind1]==ind2 && shapeMap[3][ind1]!=ind3 && shapeMap[2][ind3]!=ind2) {
		addShapeCoords[0].push(vertexCoords[0][4*ind3]);
		addShapeCoords[1].push(vertexCoords[1][4*ind3]);
		addShapeCoords[2].push(shapeCoords[2][ind3]+72);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(vertexCoords[0][4*ind1+3]);
		addShapeCoords[1].push(vertexCoords[1][4*ind1+3]);
		addShapeCoords[2].push(shapeCoords[2][ind1]-180);
		addShapeCoords[3].push(0);    
	}
	else if (shapeMap[0][ind1]==ind3 && shapeMap[3][ind1]!=ind2 && shapeMap[2][ind2]!=ind3) {
		addShapeCoords[0].push(vertexCoords[0][4*ind2]);
		addShapeCoords[1].push(vertexCoords[1][4*ind2]);
		addShapeCoords[2].push(shapeCoords[2][ind2]+72);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(vertexCoords[0][4*ind1+3]);
		addShapeCoords[1].push(vertexCoords[1][4*ind1+3]);
		addShapeCoords[2].push(shapeCoords[2][ind1]-180);
		addShapeCoords[3].push(0);    
	}
	else if (shapeMap[3][ind1]==ind2 && shapeMap[0][ind1]!=ind3 && shapeMap[1][ind3]!=ind2) {
		addShapeCoords[0].push(vertexCoords[0][4*ind3]);
		addShapeCoords[1].push(vertexCoords[1][4*ind3]);
		addShapeCoords[2].push(shapeCoords[2][ind3]-72);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(vertexCoords[0][4*ind1+1]);
		addShapeCoords[1].push(vertexCoords[1][4*ind1+1]);
		addShapeCoords[2].push(shapeCoords[2][ind1]-180);
		addShapeCoords[3].push(0);    
	}
	else if (shapeMap[3][ind1]==ind3 && shapeMap[0][ind1]!=ind2 && shapeMap[1][ind2]!=ind3) {
		addShapeCoords[0].push(vertexCoords[0][4*ind2]);
		addShapeCoords[1].push(vertexCoords[1][4*ind2]);
		addShapeCoords[2].push(shapeCoords[2][ind2]-72);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(vertexCoords[0][4*ind1+1]);
		addShapeCoords[1].push(vertexCoords[1][4*ind1+1]);
		addShapeCoords[2].push(shapeCoords[2][ind1]-180);
		addShapeCoords[3].push(0);    
	}
	//if kites are connected to either side of dart we can force
	else if ((shapeMap[0][ind1]==ind2 && shapeMap[3][ind1]==ind3) ||
			(shapeMap[0][ind1]==ind3 && shapeMap[3][ind1]==ind2)) {
		addShapeCoords[0].push(x-size*Math.sin(shapeCoords[2][ind1]*Math.PI/180));
		addShapeCoords[1].push(y+size*Math.cos(shapeCoords[2][ind1]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind1]-36);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x-size*Math.sin(shapeCoords[2][ind1]*Math.PI/180));
		addShapeCoords[1].push(y+size*Math.cos(shapeCoords[2][ind1]*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind1]+36);
		addShapeCoords[3].push(0);
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function forceKite72Kite144Kite36DartA(x,y,indices,total,vertexCoords) {
	//note we dont have to force the 144 kite as that is taken care of previously
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is the dart
	var ind1;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1) {ind1=indices[n];}   
	}   
	//then find the next dart
	var ind2;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1 && indices[n]!=ind1) {ind2=indices[n];}   
	}  
	//if the darts are connected we have a different vertex dealt with earlier
	if (shapeMap[0][ind1]==ind2 || shapeMap[0][ind2]==ind1) {return [[],[],[],[]];}
	if (Math.abs(vertexCoords[0][4*ind1+3]-x)<size/Math.pow(phi,10) &&
		Math.abs(vertexCoords[1][4*ind1+3]-y)<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind1]-180);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind1]-108);
		addShapeCoords[3].push(0);
	}
	else if (Math.abs(vertexCoords[0][4*ind2+3]-x)<size/Math.pow(phi,10) &&
		Math.abs(vertexCoords[1][4*ind2+3]-y)<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind2]-180);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind2]-108);
		addShapeCoords[3].push(0);
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function forceKite72Kite144Kite36DartB(x,y,indices,total,vertexCoords) {
	//note we dont have to force the 144 kite as that is taken care of previously
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is the dart 
	var ind1;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1) {ind1=indices[n];}   
	}   
	//then find the next dart
	var ind2;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1 && indices[n]!=ind1) {ind2=indices[n];}   
	}
	//then find the kite (note that there may be a 144 kite which we need to ignore)
	var ind3;
	for (var n=0; n<total; n++) {
		if (Math.abs(shapeCoords[0][indices[n]]-x)<size/Math.pow(phi,10) &&
			Math.abs(shapeCoords[1][indices[n]]-y)<size/Math.pow(phi,10) &&
			shapeCoords[3][indices[n]]==0) {ind3=indices[n];}   
	}
	if (shapeMap[0][ind3]==ind1 || shapeMap[0][ind3]==ind2) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind3]-72);
		addShapeCoords[3].push(0);    
	}
	if (shapeMap[3][ind3]==ind1 || shapeMap[3][ind3]==ind2) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind3]+72);
		addShapeCoords[3].push(0);    
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function forceKite72Kite144Kite36DartC(x,y,indices,total,vertexCoords) {
	//note we dont have to force the 144 kite as that is taken care of previously
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is the kite
	var ind1;
	for (var n=0; n<total; n++) {
		if (Math.abs(shapeCoords[0][indices[n]]-x)<size/Math.pow(phi,10) &&
			Math.abs(shapeCoords[1][indices[n]]-y)<size/Math.pow(phi,10) &&
			shapeCoords[3][indices[n]]==0) {ind1=indices[n];}   
	}   
	//then find the next kite
	var ind2;
	for (var n=0; n<total; n++) {
		if (Math.abs(shapeCoords[0][indices[n]]-x)<size/Math.pow(phi,10) &&
			Math.abs(shapeCoords[1][indices[n]]-y)<size/Math.pow(phi,10) &&
			shapeCoords[3][indices[n]]==0 && indices[n]!=ind1) {ind2=indices[n];}   
	}
	//then find the dart
	var ind3;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1) {ind3=indices[n];}   
	}
	if (shapeMap[0][ind3]==ind1) {
		addShapeCoords[0].push(vertexCoords[0][4*ind2+3]);
		addShapeCoords[1].push(vertexCoords[1][4*ind2+3]);
		addShapeCoords[2].push(shapeCoords[2][ind2]-180);
		addShapeCoords[3].push(1);   
	}
	else if (shapeMap[0][ind3]==ind2) {
		addShapeCoords[0].push(vertexCoords[0][4*ind1+3]);
		addShapeCoords[1].push(vertexCoords[1][4*ind1+3]);
		addShapeCoords[2].push(shapeCoords[2][ind1]-180);
		addShapeCoords[3].push(1);   
	}
	else if (shapeMap[3][ind3]==ind1) {
		addShapeCoords[0].push(vertexCoords[0][4*ind2+1]);
		addShapeCoords[1].push(vertexCoords[1][4*ind2+1]);
		addShapeCoords[2].push(shapeCoords[2][ind2]-180);
		addShapeCoords[3].push(1);   
	}
	else if (shapeMap[3][ind3]==ind2) {
		addShapeCoords[0].push(vertexCoords[0][4*ind1+1]);
		addShapeCoords[1].push(vertexCoords[1][4*ind1+1]);
		addShapeCoords[2].push(shapeCoords[2][ind1]-180);
		addShapeCoords[3].push(1);   
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function forceKite72Kite144Kite36DartD(x,y,indices,total,vertexCoords) {
	//note we dont have to force the 144 kite as that is taken care of previously
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is the kite
	var ind1;
	for (var n=0; n<total; n++) {
		if (Math.abs(shapeCoords[0][indices[n]]-x)<size/Math.pow(phi,10) &&
			Math.abs(shapeCoords[1][indices[n]]-y)<size/Math.pow(phi,10) &&
			shapeCoords[3][indices[n]]==0) {ind1=indices[n];}   
	}   
	//then find the dart
	var ind2;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1) {ind2=indices[n];}   
	}
	//if the two are connected
	if (shapeMap[0][ind2]==ind1) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind2]+108);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind2]+72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind2]+72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind2]-72);
		addShapeCoords[3].push(1);
	}
	else if (shapeMap[3][ind2]==ind1) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind2]-108);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind2]-72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind2]-72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind2]+72);
		addShapeCoords[3].push(1);
		//if they are not connected 
	} else if (Math.abs(vertexCoords[0][4*ind1+3]-(x+size*Math.sin((shapeCoords[2][ind2]+72)*Math.PI/180)))<size/Math.pow(phi,10) && 
		Math.abs(vertexCoords[1][4*ind1+3]-(y-size*Math.cos((shapeCoords[2][ind2]+72)*Math.PI/180)))<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind2]-180);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind2]+72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind2]+72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind2]-72);
		addShapeCoords[3].push(1);
	}
	else if (Math.abs(vertexCoords[0][4*ind1+1]-(x+size*Math.sin((shapeCoords[2][ind2]-72)*Math.PI/180)))<size/Math.pow(phi,10) && 
		Math.abs(vertexCoords[1][4*ind1+1]-(y-size*Math.cos((shapeCoords[2][ind2]-72)*Math.PI/180)))<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind2]-180);
		addShapeCoords[3].push(0);
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind2]-72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind2]-72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind2]+72);
		addShapeCoords[3].push(1);   
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function forceKite72Kite144Kite36DartE(x,y,indices,total,vertexCoords) {
	//note we dont have to force the 144 kite as that is taken care of previously
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is the 72 kite
	var ind1;
	for (var n=0; n<total; n++) {
		if (Math.abs(shapeCoords[0][indices[n]]-x)<size/Math.pow(phi,10) &&
			Math.abs(shapeCoords[1][indices[n]]-y)<size/Math.pow(phi,10) &&
			shapeCoords[3][indices[n]]==0) {ind1=indices[n];}   
	}   
	//then find the 144 kite
	var ind2=indices[0];
	if (ind2==ind1) ind2=indices[1];
	//add the darts
	addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind2]+72)*Math.PI/180));
	addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind2]+72)*Math.PI/180));
	addShapeCoords[2].push(shapeCoords[2][ind2]-144);
	addShapeCoords[3].push(1);
	addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind2]-72)*Math.PI/180));
	addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind2]-72)*Math.PI/180));
	addShapeCoords[2].push(shapeCoords[2][ind2]+144);
	addShapeCoords[3].push(1);
	//add the kite
	if (Math.abs(x+size*Math.sin((shapeCoords[2][ind2]+72)*Math.PI/180)-vertexCoords[0][4*ind1+1])<size/Math.pow(phi,10) && Math.abs(y-size*Math.cos((shapeCoords[2][ind2]+72)*Math.PI/180)-vertexCoords[1][4*ind1+1])<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind2]-36);
		addShapeCoords[3].push(0);    
	} 
	else if (Math.abs(x+size*Math.sin((shapeCoords[2][ind2]-72)*Math.PI/180)-vertexCoords[0][4*ind1+3])<size/Math.pow(phi,10) && Math.abs(y-size*Math.cos((shapeCoords[2][ind2]-72)*Math.PI/180)-vertexCoords[1][4*ind1+3])<size/Math.pow(phi,10)) {
		addShapeCoords[0].push(x);
		addShapeCoords[1].push(y);
		addShapeCoords[2].push(shapeCoords[2][ind2]+36);
		addShapeCoords[3].push(0);    
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function forceKite72Kite144Kite36DartF(x,y,indices,total,vertexCoords) {
	//note we dont have to force the 144 kite as that is taken care of previously
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is the 144 kite
	var ind2;
	for (var n=0; n<total; n++) {
		if (!(Math.abs(shapeCoords[0][indices[n]]-x)<size/Math.pow(phi,10) &&
			Math.abs(shapeCoords[1][indices[n]]-y)<size/Math.pow(phi,10)) &&
			shapeCoords[3][indices[n]]==0) {ind2=indices[n];}   
	}   
	
	//add the darts
	addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind2]+72)*Math.PI/180));
	addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind2]+72)*Math.PI/180));
	addShapeCoords[2].push(shapeCoords[2][ind2]-144);
	addShapeCoords[3].push(1);
	addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind2]-72)*Math.PI/180));
	addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind2]-72)*Math.PI/180));
	addShapeCoords[2].push(shapeCoords[2][ind2]+144);
	addShapeCoords[3].push(1);
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

function forceKite72Kite144Kite36DartG(x,y,indices,total,vertexCoords) {
	var addShapeCoords=[[],[],[],[]];
	//first find which shape is the 144 kite
	var ind1;
	var N;
	for (var n=0; n<total; n++) {
		if (shapeCoords[3][indices[n]]==1) {ind1=indices[n]; N=n}   
	}   
	var ind2=indices[(N+1)%4];
	var ind3=indices[(N+2)%4];
	var ind4=indices[(N+3)%4];
	if (shapeMap[1][ind1]==ind2 || shapeMap[1][ind1]==ind3 || shapeMap[1][ind1]==ind4) {
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind1]+72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind1]+72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind1]-72);
		addShapeCoords[3].push(1);    
	} else if (shapeMap[3][ind1]==ind2 || shapeMap[3][ind1]==ind3 || shapeMap[3][ind1]==ind4) {
		addShapeCoords[0].push(x+size*Math.sin((shapeCoords[2][ind1]-72)*Math.PI/180));
		addShapeCoords[1].push(y-size*Math.cos((shapeCoords[2][ind1]-72)*Math.PI/180));
		addShapeCoords[2].push(shapeCoords[2][ind1]+72);
		addShapeCoords[3].push(1);    
	}
	if (addShapeCoords[0].length>0) return(addShapeCoords); else return [[],[],[],[]];
}

//used by addForcedTiles function
function countVertexType(types,val) {
	var count=0;
	for (var j=0; j<types.length; j++) {
		if (types[j]==val) count++;    
	}
	return count;
}

function inflate() {
	var oldTiling=[[],[],[],[]]; //used to remember old tiling so we can possible tidy infalted tiling
	for (var i=0; i<totalShapes; i++) {
		oldTiling[0][i]=shapeCoords[0][i];
		oldTiling[1][i]=shapeCoords[1][i];
		oldTiling[2][i]=shapeCoords[2][i];
		oldTiling[3][i]=shapeCoords[3][i];
	}
	var oldTotal=totalShapes;
	if (totalShapes==0) return;
	var subsetMap=[[],[],[],[]];
	for (var i=0; i<4; i++) {
		for (var j=0; j<shapeMap[0].length; j++) {
			subsetMap[i][j]=shapeMap[i][j];    
		}
	}
	if (subsetMap[0].length==0) return;
	//start with first shape, add index to this list, add all neighbouring indices to 
	//list move to next shape in this list and repeat (only add if we havent already)
	var routeIndex=[];
	var totalRoutes=0;
	var stop=false;
	//we need to make store all possible routes through the tiling as arrays
	while (!stop) {
		var routeLength=0;
		routeIndex[totalRoutes]=[];
		routeIndex[totalRoutes][routeLength]=0;
		routeLength++;
		var reachedEnd=false;
		var currentIndex=0;
		stop=true;
		//first check to see if indices of all shapes connected to first shape have been set to -1
		//and stop if so
		for (var i=0; i<4; i++) {
			for (var j=0; j<4; j++) {
				if (subsetMap[j][0]!=-1 && subsetMap[i][subsetMap[j][0]]!=-1) {stop=false;}
			}
		}
		if (stop) totalRoutes++;
		if (!stop) {
			
			while (!reachedEnd) {
				if (subsetMap[0][currentIndex]!=-1 && !contains(routeIndex[totalRoutes],subsetMap[0][currentIndex]) && (subsetMap[0][subsetMap[0][currentIndex]]!=-1 || subsetMap[1][subsetMap[0][currentIndex]]!=-1 || subsetMap[2][subsetMap[0][currentIndex]]!=-1 || subsetMap[3][subsetMap[0][currentIndex]]!=-1)) {
					routeIndex[totalRoutes][routeLength]=subsetMap[0][currentIndex];
					currentIndex=subsetMap[0][currentIndex];
					routeLength++;
				}
				else if (subsetMap[1][currentIndex]!=-1 && !contains(routeIndex[totalRoutes],subsetMap[1][currentIndex]) && (subsetMap[0][subsetMap[1][currentIndex]]!=-1 || subsetMap[1][subsetMap[1][currentIndex]]!=-1 || subsetMap[2][subsetMap[1][currentIndex]]!=-1 || subsetMap[3][subsetMap[1][currentIndex]]!=-1)) {
					routeIndex[totalRoutes][routeLength]=subsetMap[1][currentIndex];
					currentIndex=subsetMap[1][currentIndex];
					routeLength++;
				}
				else if (subsetMap[2][currentIndex]!=-1 && !contains(routeIndex[totalRoutes],subsetMap[2][currentIndex]) && (subsetMap[0][subsetMap[2][currentIndex]]!=-1 || subsetMap[1][subsetMap[2][currentIndex]]!=-1 || subsetMap[2][subsetMap[2][currentIndex]]!=-1 || subsetMap[3][subsetMap[2][currentIndex]]!=-1)) {
					routeIndex[totalRoutes][routeLength]=subsetMap[2][currentIndex];
					currentIndex=subsetMap[2][currentIndex];
					routeLength++;
				}
				else if (subsetMap[3][currentIndex]!=-1 && !contains(routeIndex[totalRoutes],subsetMap[3][currentIndex]) && (subsetMap[0][subsetMap[3][currentIndex]]!=-1 || subsetMap[1][subsetMap[3][currentIndex]]!=-1 || subsetMap[2][subsetMap[3][currentIndex]]!=-1 || subsetMap[3][subsetMap[3][currentIndex]]!=-1)) {
					routeIndex[totalRoutes][routeLength]=subsetMap[3][currentIndex];
					currentIndex=subsetMap[3][currentIndex];
					routeLength++;
				} else {
					subsetMap[0][currentIndex]=-1;
					subsetMap[1][currentIndex]=-1;
					subsetMap[2][currentIndex]=-1;
					subsetMap[3][currentIndex]=-1;
					reachedEnd=true;
				}
			}
			totalRoutes++;
		}
		
	}
	//many routes appear multiple times within other routes. Delete these
	for (var i=0; i<totalRoutes; i++) {
		if (totalRoutes==1) continue;
		for (var j=0; j<totalRoutes; j++) {
			if (i==j) continue;
			if (routeIndex[i].length>routeIndex[j].length) continue;
			var same=true;
			for (var k=0; k<routeIndex[i].length; k++) {
				if (routeIndex[i][k]!=routeIndex[j][k]) {
					same=false;
				}
			}
			if (same) {
				for (var k=i; k<totalRoutes-1; k++) {
					routeIndex[k]=routeIndex[k+1]; 
				}
				totalRoutes--;
				i=0;
				j=-1;
			}
		}
	}
	//WE SHOULD CHECK HERE TO SEE IF ALL SHAPE INDICES APPEAR IN THIS ARRAY
	var found=false;
	for (var i=0; i<totalShapes; i++) {
		found=false;
		for (var j=0; j<totalRoutes; j++) {
			for (var k=0; k<routeIndex[j].length; k++) {
				if (routeIndex[j][k]==i) found=true;    
			}
		}
		if (!found) i=totalShapes;
	}
	if (!found) {
		foundMatchingTiling=false;
		legalTiling=false;
		alert("Cannot inflate an illegal or unconnected tiling"); 
		return;
	}
	
	//now we need the type of each shape in the routeIndex, and the side which leads to the next
	//shape in the index
	var routeInfo=[];
	for (var i=0; i<totalRoutes; i++) {
		routeInfo[i]=[];
		for (var j=0; j<routeIndex[i].length; j++) {
			routeInfo[i][3*j]=routeIndex[i][j];//the index of the shape 
			routeInfo[i][3*j+1]=shapeCoords[3][routeIndex[i][j]];//the type of the shape
			var nextV=-1;
			if (j<routeIndex[i].length-1) {
				nextV=routeIndex[i][j+1];
				for (var k=0; k<4; k++) {
					if (shapeMap[k][routeIndex[i][j]]==routeIndex[i][j+1] ) nextV=k;   
				}
			}
			routeInfo[i][3*j+2]=nextV;//the edge that leads to the next shape
		}
	}
	//now we have a list of routes of the form shape type, edge to next shape, shape type, edge to next shape etc.
	var currentIndex=[];
	var closest=100000000000;
	//now we need to search the other tiles to see if this is a subset
	//and save the indices of these tiles to currentIndex
	var foundMatch=false;
	for (var i=0; i<totalLegalShapes; i++) {
		if (foundMatch) {i=totalLegalShapes+1; continue;}
		var matches=true;
		currentIndex=[];
		for (var j=0; j<totalRoutes; j++) {
			if (foundMatch) {j=totalRoutes+1; continue;}
			if (!matches) {j=totalRoutes+1; continue;}
			var setIndex=i;
			for (var k=0; k<routeIndex[j].length; k++) {
				if (foundMatch) {k=routeIndex[j].length+1; continue;}
				if (!matches) {k=routeIndex[j].length+1; continue;}
				if (legalTilingCoords[3][setIndex]==routeInfo[j][3*k+1]) { //the shape types should match
					var e=routeInfo[j][3*k+2]; //the edge to next shape
					if (e!=-1 && legalShapeMap[e][setIndex]==-1) {matches=false;} 
					else if (e!=-1 && legalShapeMap[e][setIndex]!=-1){
						if (!contains(currentIndex,setIndex)) currentIndex.push(setIndex);
						setIndex=legalShapeMap[e][setIndex];                      
					} else if (e!=-1) {matches=false;} 
					else if (e==-1) {
						if (!contains(currentIndex,setIndex)) currentIndex.push(setIndex);
						k=routeIndex[j].length;
					}
				}  else {matches=false;}
				
			}
			
		}
		if (matches) {
			foundMatch=true; 
			var inflatedIndices=[];
			var totalInflated=0;
			//delete repeated indices of inflated shapes
			for (var m=0; m<totalShapes; m++) {
				var found=false;
				for (var n=0; n<totalInflated; n++) {
					if (inflatedIndices[n]==inflatedTilingIndex[currentIndex[m]]) found=true;    
				}
				if (!found) {
					inflatedIndices[totalInflated]=inflatedTilingIndex[currentIndex[m]]; 
					totalInflated++;
				}
			}
			totalShapes=totalInflated;
			var enlargeFactor=Math.round((Math.log(size)-Math.log(legalSize))/Math.log(phi));
			var newCoords=[[],[],[],[]];
			for (var m=0; m<totalInflated; m++) {
				newCoords[0][m]=inflatedTilingCoords[0][inflatedIndices[m]]*Math.pow(phi,enlargeFactor); 
				newCoords[1][m]=inflatedTilingCoords[1][inflatedIndices[m]]*Math.pow(phi,enlargeFactor); 
				newCoords[2][m]=inflatedTilingCoords[2][inflatedIndices[m]]; 
				newCoords[3][m]=inflatedTilingCoords[3][inflatedIndices[m]]; 
			}
			translateX=shapeCoords[0][0]-legalTilingCoords[0][currentIndex[0]]*Math.pow(phi,enlargeFactor); translateY=shapeCoords[1][0]-legalTilingCoords[1][currentIndex[0]]*Math.pow(phi,enlargeFactor); rotateInflation=(shapeCoords[2][0]-legalTilingCoords[2][currentIndex[0]]);
			size=size*phi;
			var moveX=legalTilingCoords[0][currentIndex[0]]*Math.pow(phi,enlargeFactor);
			var moveY=legalTilingCoords[1][currentIndex[0]]*Math.pow(phi,enlargeFactor);
			for (var m=0; m<totalInflated; m++) {
				newCoords[0][m]-=moveX;
				newCoords[1][m]-=moveY;
				var X=newCoords[0][m]; 
				var Y=newCoords[1][m];
				newCoords[0][m]=Math.cos(rotateInflation*Math.PI/180)*X-Math.sin(rotateInflation*Math.PI/180)*Y;
				newCoords[1][m]=Math.sin(rotateInflation*Math.PI/180)*X+Math.cos(rotateInflation*Math.PI/180)*Y;
				newCoords[0][m]+=moveX;
				newCoords[1][m]+=moveY;
				newCoords[2][m]+=rotateInflation;
			}
			for (var m=0; m<totalInflated; m++) {
				shapeCoords[0][m]=newCoords[0][m]+translateX; 
				shapeCoords[1][m]=newCoords[1][m]+translateY;  
				shapeCoords[2][m]=newCoords[2][m];
				shapeCoords[3][m]=newCoords[3][m];
			}
		}
	}
	if (foundMatch) {
		legalTiling=true;
	}else {
		legalTiling=false;    
		alert("Cannot inflate an illegal or unconnected tiling");    
	}
	if (legalTiling && totalShapes<2000) {
		//because of the way we deflate the inflated tiling may not be the smallest
		//this will deflate the inflated tiling and compare it to our original tiling to see if we can
		//get rid of any of the shapes
		tidyUpInflation(oldTiling,oldTotal);     
	}
}

function tidyUpInflation(oldTiling,oldTotal) {
	var tempCoords=[[],[],[],[]]; //x coord, y coord, angle, type (0=kite, 1=dart) 
	var inflatedDeflated=[[],[],[],[]];
	var inflatedDeflatedTotal;
	var tempTotal=0;
	//first inflate the new tiling
	for (var i=0; i<oldTotal; i++) {
		//deflate dart
		if (shapeCoords[3][i]==0) {
			//kite
			var j=tempTotal;
			tempCoords[0][j]=shapeCoords[0][i]+size*Math.cos((shapeCoords[2][i]-54)*Math.PI/180);
			tempCoords[1][j]=shapeCoords[1][i]+size*Math.sin((shapeCoords[2][i]-54)*Math.PI/180);
			tempCoords[2][j]=shapeCoords[2][i]-108;
			tempCoords[3][j]=0;
			tempTotal++;
			//kite
			j=tempTotal;
			tempCoords[0][j]=shapeCoords[0][i]+size*Math.cos((shapeCoords[2][i]-126)*Math.PI/180);
			tempCoords[1][j]=shapeCoords[1][i]+size*Math.sin((shapeCoords[2][i]-126)*Math.PI/180);
			tempCoords[2][j]=shapeCoords[2][i]+108;
			tempCoords[3][j]=0;
			tempTotal++;
			//dart
			j=tempTotal;
			tempCoords[0][j]=shapeCoords[0][i];
			tempCoords[1][j]=shapeCoords[1][i];
			tempCoords[2][j]=shapeCoords[2][i]-36;
			tempCoords[3][j]=1;
			tempTotal++;
			//dart
			j=tempTotal;
			tempCoords[0][j]=shapeCoords[0][i];
			tempCoords[1][j]=shapeCoords[1][i];
			tempCoords[2][j]=shapeCoords[2][i]+36;
			tempCoords[3][j]=1;
			tempTotal++;
		}
		else if (shapeCoords[3][i]==1) {
			//kite
			var j=tempTotal;
			tempCoords[0][j]=shapeCoords[0][i];
			tempCoords[1][j]=shapeCoords[1][i];
			tempCoords[2][j]=shapeCoords[2][i];
			tempCoords[3][j]=0;
			tempTotal++;
			//dart
			j=tempTotal;
			tempCoords[0][j]=shapeCoords[0][i]+size*Math.cos((shapeCoords[2][i]-126)*Math.PI/180);
			tempCoords[1][j]=shapeCoords[1][i]+size*Math.sin((shapeCoords[2][i]-126)*Math.PI/180);
			tempCoords[2][j]=shapeCoords[2][i]+144;
			tempCoords[3][j]=1;
			tempTotal++;
			//dart
			j=tempTotal;
			tempCoords[0][j]=shapeCoords[0][i]+size*Math.cos((shapeCoords[2][i]-54)*Math.PI/180);
			tempCoords[1][j]=shapeCoords[1][i]+size*Math.sin((shapeCoords[2][i]-54)*Math.PI/180);
			tempCoords[2][j]=shapeCoords[2][i]-144;
			tempCoords[3][j]=1;
			tempTotal++;
			//dummy kite (used so we can know that every four shapes in the inflatedDeflated array
			//correspond to one tile in the inflated array
			var j=tempTotal;
			tempCoords[0][j]=shapeCoords[0][i];
			tempCoords[1][j]=shapeCoords[1][i];
			tempCoords[2][j]=shapeCoords[2][i];
			tempCoords[3][j]=0;
			tempTotal++;
		}
	}
	
	for (var i=0; i<tempTotal; i++) {
		inflatedDeflated[0][i]=tempCoords[0][i]; 
		inflatedDeflated[1][i]=tempCoords[1][i]; 
		inflatedDeflated[2][i]=tempCoords[2][i]; 
		inflatedDeflated[3][i]=tempCoords[3][i]; 
	}
	inflatedDeflatedTotal=tempTotal;        
	//now we need to cycle through inflatedDeflated, ignoring one set of deflated shapes at a 
	//time to see if we can create the old tiling. If we can we erase those ignored shapes from the
	//array
	var ignoreIndices=[];
	var totalIgnored=0;
	var minD=size/Math.pow(phi,10);
	for (var ignore=0; ignore<totalShapes; ignore++) {
		var foundShape=[]; //set to true when we have found a shape 
		for (var i=0; i<oldTotal; i++) {
			foundShape[i]=false;    
		}
		for (var i=0; i<inflatedDeflatedTotal; i++) {
			var nextI=false;
			if (Math.floor(i/4)==ignore) nextI=true;
			//we cannot include shapes we have previously ignored, we need to keep ignoring them
			for (var n=0; n<totalIgnored; n++) {
				if (Math.floor(i/4)==ignoreIndices[n]) nextI=true;   
			}
			if (nextI) continue;
			var ang1=inflatedDeflated[2][i];
			while (ang1<0) {ang1+=360;}
			while (ang1>=360) {ang1-=360;}
			for (var j=0; j<oldTotal; j++) {
				if (foundShape[j]) continue;
				var ang2=oldTiling[2][j];
				while (ang2<0) {ang2+=360;}
				while (ang2>=360) {ang2-=360;}
				if (Math.abs(inflatedDeflated[0][i]-oldTiling[0][j])<minD &&
				   Math.abs(inflatedDeflated[1][i]-oldTiling[1][j])<minD &&
				   Math.abs(ang1-ang2)<0.00001 &&
				   inflatedDeflated[3][i]==oldTiling[3][j]) {            
					foundShape[j]=true; 
					j=oldTotal;
				}
			}
		}
		var foundAll=true;
		for (var j=0; j<oldTotal; j++) {
			if (!foundShape[j]) foundAll=false;    
		}
		if (foundAll) {
			ignoreIndices[totalIgnored]=ignore;
			totalIgnored++;
		}
	}
	for (var i=0; i<totalIgnored; i++) {
		//set the shape type of the ones we wish to delete to -1
		shapeCoords[3][ignoreIndices[i]]=2;  
	}
	for (var i=0; i<totalShapes; i++) {
		if (shapeCoords[3][i]==2) {
			for (var j=i; j<totalShapes-1; j++) {
				shapeCoords[0][j]=shapeCoords[0][j+1];
				shapeCoords[1][j]=shapeCoords[1][j+1];
				shapeCoords[2][j]=shapeCoords[2][j+1];
				shapeCoords[3][j]=shapeCoords[3][j+1];
			}
			i-=1;
			totalShapes-=1;
		}
	}
}



function checkIfLegal() {
	if (totalShapes==0) return;
	var subsetMap=[[],[],[],[]];
	for (var i=0; i<4; i++) {
		for (var j=0; j<shapeMap[0].length; j++) {
			subsetMap[i][j]=shapeMap[i][j];    
		}
	}
	if (subsetMap[0].length==0) return;
	//start with first shape, add index to this list, add all neighbouring indices to 
	//list move to next shape in this list and repeat (only add if we havent already)
	var routeIndex=[];
	var totalRoutes=0;
	var stop=false;
	//we need to make store all possible routes through the tiling as arrays
	while (!stop) {
		var routeLength=0;
		routeIndex[totalRoutes]=[];
		routeIndex[totalRoutes][routeLength]=0;
		routeLength++;
		var reachedEnd=false;
		var currentIndex=0;
		stop=true;
		//first check to see if indices of all shapes connected to first shape have been set to -1
		//and stop if so
		for (var i=0; i<4; i++) {
			for (var j=0; j<4; j++) {
				if (subsetMap[j][0]!=-1 && subsetMap[i][subsetMap[j][0]]!=-1) {stop=false;}
			}
		}
		if (stop) totalRoutes++;
		if (!stop) {
			
			while (!reachedEnd) {
				if (subsetMap[0][currentIndex]!=-1 && !contains(routeIndex[totalRoutes],subsetMap[0][currentIndex]) && (subsetMap[0][subsetMap[0][currentIndex]]!=-1 || subsetMap[1][subsetMap[0][currentIndex]]!=-1 || subsetMap[2][subsetMap[0][currentIndex]]!=-1 || subsetMap[3][subsetMap[0][currentIndex]]!=-1)) {
					routeIndex[totalRoutes][routeLength]=subsetMap[0][currentIndex];
					currentIndex=subsetMap[0][currentIndex];
					routeLength++;
				}
				else if (subsetMap[1][currentIndex]!=-1 && !contains(routeIndex[totalRoutes],subsetMap[1][currentIndex]) && (subsetMap[0][subsetMap[1][currentIndex]]!=-1 || subsetMap[1][subsetMap[1][currentIndex]]!=-1 || subsetMap[2][subsetMap[1][currentIndex]]!=-1 || subsetMap[3][subsetMap[1][currentIndex]]!=-1)) {
					routeIndex[totalRoutes][routeLength]=subsetMap[1][currentIndex];
					currentIndex=subsetMap[1][currentIndex];
					routeLength++;
				}
				else if (subsetMap[2][currentIndex]!=-1 && !contains(routeIndex[totalRoutes],subsetMap[2][currentIndex]) && (subsetMap[0][subsetMap[2][currentIndex]]!=-1 || subsetMap[1][subsetMap[2][currentIndex]]!=-1 || subsetMap[2][subsetMap[2][currentIndex]]!=-1 || subsetMap[3][subsetMap[2][currentIndex]]!=-1)) {
					routeIndex[totalRoutes][routeLength]=subsetMap[2][currentIndex];
					currentIndex=subsetMap[2][currentIndex];
					routeLength++;
				}
				else if (subsetMap[3][currentIndex]!=-1 && !contains(routeIndex[totalRoutes],subsetMap[3][currentIndex]) && (subsetMap[0][subsetMap[3][currentIndex]]!=-1 || subsetMap[1][subsetMap[3][currentIndex]]!=-1 || subsetMap[2][subsetMap[3][currentIndex]]!=-1 || subsetMap[3][subsetMap[3][currentIndex]]!=-1)) {
					routeIndex[totalRoutes][routeLength]=subsetMap[3][currentIndex];
					currentIndex=subsetMap[3][currentIndex];
					routeLength++;
				} else {
					subsetMap[0][currentIndex]=-1;
					subsetMap[1][currentIndex]=-1;
					subsetMap[2][currentIndex]=-1;
					subsetMap[3][currentIndex]=-1;
					reachedEnd=true;
				}
			}
			totalRoutes++;
		}
		
	}
	//many routes appear multiple times within other routes. Delete these
	for (var i=0; i<totalRoutes; i++) {
		if (totalRoutes==1) continue;
		for (var j=0; j<totalRoutes; j++) {
			if (i==j) continue;
			if (routeIndex[i].length>routeIndex[j].length) continue;
			var same=true;
			for (var k=0; k<routeIndex[i].length; k++) {
				if (routeIndex[i][k]!=routeIndex[j][k]) {
					same=false;
				}
			}
			if (same) {
				for (var k=i; k<totalRoutes-1; k++) {
					routeIndex[k]=routeIndex[k+1]; 
				}
				totalRoutes--;
				i=0;
				j=-1;
			}
		}
	}
	//WE SHOULD CHECK HERE TO SEE IF ALL SHAPE INDICES APPEAR IN THIS ARRAY
	var found=false;
	for (var i=0; i<totalShapes; i++) {
		found=false;
		for (var j=0; j<totalRoutes; j++) {
			for (var k=0; k<routeIndex[j].length; k++) {
				if (routeIndex[j][k]==i) found=true;    
			}
		}
		if (!found) i=totalShapes;
	}
	if (!found) {
		foundMatchingTiling=false;
		legalTiling=false;
		//alert("Cannot inflate if tiles are not all connected"); 
		return;
	}
	
	//now we need the type of each shape in the routeIndex, and the side which leads to the next
	//shape in the index
	var routeInfo=[];
	for (var i=0; i<totalRoutes; i++) {
		routeInfo[i]=[];
		for (var j=0; j<routeIndex[i].length; j++) {
			routeInfo[i][3*j]=routeIndex[i][j];//the index of the shape 
			routeInfo[i][3*j+1]=shapeCoords[3][routeIndex[i][j]];//the type of the shape
			var nextV=-1;
			if (j<routeIndex[i].length-1) {
				nextV=routeIndex[i][j+1];
				for (var k=0; k<4; k++) {
					if (shapeMap[k][routeIndex[i][j]]==routeIndex[i][j+1] ) nextV=k;   
				}
			}
			routeInfo[i][3*j+2]=nextV;//the edge that leads to the next shape
		}
	}
	//now we have a list of routes of the form shape type, edge to next shape, shape type, edge to next shape etc.
	var currentIndex=[];
	var closest=100000000000;
	//now we need to search the other tiles to see if this is a subset
	var foundMatch=false;
	for (var i=0; i<totalLegalShapes; i++) {
		if (foundMatch) {i=totalLegalShapes+1; continue;}
		var matches=true;
		currentIndex=[];
		for (var j=0; j<totalRoutes; j++) {
			if (foundMatch) {j=totalRoutes+1; continue;}
			if (!matches) {j=totalRoutes+1; continue;}
			var setIndex=i;
			for (var k=0; k<routeIndex[j].length; k++) {
				if (foundMatch) {k=routeIndex[j].length+1; continue;}
				if (!matches) {k=routeIndex[j].length+1; continue;}
				if (legalTilingCoords[3][setIndex]==routeInfo[j][3*k+1]) { //the shape types should match
					var e=routeInfo[j][3*k+2]; //the edge to next shape
					if (e!=-1 && legalShapeMap[e][setIndex]==-1) {matches=false;} 
					else if (e!=-1 && legalShapeMap[e][setIndex]!=-1){
						if (!contains(currentIndex,setIndex)) currentIndex.push(setIndex);
						setIndex=legalShapeMap[e][setIndex];                      
					} else if (e!=-1) {matches=false;} 
					else if (e==-1) {
						if (!contains(currentIndex,setIndex)) currentIndex.push(setIndex);
						k=routeIndex[j].length;
					}
				}  else {matches=false;}
				
			}
			
		}
		if (matches) {
			foundMatch=true;    
		}
	}
	if (foundMatch) legalTiling=true; else legalTiling=false;
}

function findSameTiling(subsetMap2,subsetTotal,subsetIndices,subsetCoords,setMap,setTotal,setCoords) {
	var subsetMap=[[],[],[],[]];
	for (var i=0; i<4; i++) {
		for (var j=0; j<subsetMap2[0].length; j++) {
			subsetMap[i][j]=subsetMap2[i][j];    
		}
	}
	if (subsetMap[0].length==0) return;
	//start with first shape, add index to this list, add all neighbouring indices to 
	//list move to next shape in this list and repeat (only add if we havent already)
	var routeIndex=[];
	var totalRoutes=0;
	var stop=false;
	//we need to make store all possible routes through the tiling as arrays
	while (!stop) {
		var routeLength=0;
		routeIndex[totalRoutes]=[];
		routeIndex[totalRoutes][routeLength]=0;
		routeLength++;
		var reachedEnd=false;
		var currentIndex=0;
		stop=true;
		//first check to see if indices of all shapes connected to first shape have been set to -1
		//and stop if so
		for (var i=0; i<4; i++) {
			for (var j=0; j<4; j++) {
				if (subsetMap[j][0]!=-1 && subsetMap[i][subsetMap[j][0]]!=-1) {stop=false;}
			}
		}
		if (stop) totalRoutes++;
		if (!stop) {
			
			while (!reachedEnd) {
				if (subsetMap[0][currentIndex]!=-1 && !contains(routeIndex[totalRoutes],subsetMap[0][currentIndex]) && (subsetMap[0][subsetMap[0][currentIndex]]!=-1 || subsetMap[1][subsetMap[0][currentIndex]]!=-1 || subsetMap[2][subsetMap[0][currentIndex]]!=-1 || subsetMap[3][subsetMap[0][currentIndex]]!=-1)) {
					routeIndex[totalRoutes][routeLength]=subsetMap[0][currentIndex];
					currentIndex=subsetMap[0][currentIndex];
					routeLength++;
				}
				else if (subsetMap[1][currentIndex]!=-1 && !contains(routeIndex[totalRoutes],subsetMap[1][currentIndex]) && (subsetMap[0][subsetMap[1][currentIndex]]!=-1 || subsetMap[1][subsetMap[1][currentIndex]]!=-1 || subsetMap[2][subsetMap[1][currentIndex]]!=-1 || subsetMap[3][subsetMap[1][currentIndex]]!=-1)) {
					routeIndex[totalRoutes][routeLength]=subsetMap[1][currentIndex];
					currentIndex=subsetMap[1][currentIndex];
					routeLength++;
				}
				else if (subsetMap[2][currentIndex]!=-1 && !contains(routeIndex[totalRoutes],subsetMap[2][currentIndex]) && (subsetMap[0][subsetMap[2][currentIndex]]!=-1 || subsetMap[1][subsetMap[2][currentIndex]]!=-1 || subsetMap[2][subsetMap[2][currentIndex]]!=-1 || subsetMap[3][subsetMap[2][currentIndex]]!=-1)) {
					routeIndex[totalRoutes][routeLength]=subsetMap[2][currentIndex];
					currentIndex=subsetMap[2][currentIndex];
					routeLength++;
				}
				else if (subsetMap[3][currentIndex]!=-1 && !contains(routeIndex[totalRoutes],subsetMap[3][currentIndex]) && (subsetMap[0][subsetMap[3][currentIndex]]!=-1 || subsetMap[1][subsetMap[3][currentIndex]]!=-1 || subsetMap[2][subsetMap[3][currentIndex]]!=-1 || subsetMap[3][subsetMap[3][currentIndex]]!=-1)) {
					routeIndex[totalRoutes][routeLength]=subsetMap[3][currentIndex];
					currentIndex=subsetMap[3][currentIndex];
					routeLength++;
				} else {
					subsetMap[0][currentIndex]=-1;
					subsetMap[1][currentIndex]=-1;
					subsetMap[2][currentIndex]=-1;
					subsetMap[3][currentIndex]=-1;
					reachedEnd=true;
				}
			}
			totalRoutes++;
		}
		
	}
	//many routes appear multiple times within other routes. Delete these
	for (var i=0; i<totalRoutes; i++) {
		if (totalRoutes==1) continue;
		for (var j=0; j<totalRoutes; j++) {
			if (i==j) continue;
			if (routeIndex[i].length>routeIndex[j].length) continue;
			var same=true;
			for (var k=0; k<routeIndex[i].length; k++) {
				if (routeIndex[i][k]!=routeIndex[j][k]) {
					same=false;
				}
			}
			if (same) {
				for (var k=i; k<totalRoutes-1; k++) {
					routeIndex[k]=routeIndex[k+1]; 
				}
				totalRoutes--;
				i=0;
				j=-1;
			}
		}
	}
	//WE SHOULD CHECK HERE TO SEE IF ALL SHAPE INDICES WHICH ARE HIGHLIGHTED APPEAR IN THIS ARRAY
	var found=false;
	for (var i=0; i<subsetTotal; i++) {
		found=false;
		for (var j=0; j<totalRoutes; j++) {
			for (var k=0; k<routeIndex[j].length; k++) {
				if (routeIndex[j][k]==i) found=true;    
			}
		}
		if (!found) i=subsetTotal;
	}
	if (!found) {
		foundMatchingTiling=false;
		alert("Please highlight one connected tiling"); 
		return;
	}
	
	//now we need the type of each shape in the routeIndex, and the side which leads to the next
	//shape in the index
	var routeInfo=[];
	for (var i=0; i<totalRoutes; i++) {
		routeInfo[i]=[];
		for (var j=0; j<routeIndex[i].length; j++) {
			routeInfo[i][3*j]=routeIndex[i][j];//the index of the shape 
			routeInfo[i][3*j+1]=subsetCoords[3][routeIndex[i][j]];//the type of the shape
			var nextV=-1;
			if (j<routeIndex[i].length-1) {
				nextV=routeIndex[i][j+1];
				for (var k=0; k<4; k++) {
					if (subsetMap2[k][routeIndex[i][j]]==routeIndex[i][j+1] ) nextV=k;   
				}
			}
			routeInfo[i][3*j+2]=nextV;//the edge that leads to the next shape
		}
	}
	//now we have a list of routes of the form shape type, edge to next shape, shape type, edge to next shape etc.
	
	var currentIndex=[];
	var closest=100000000000;
	//now we need to search the other tiles to see if this is a subset
	for (var i=0; i<setTotal; i++) {
		var matches=true;
		currentIndex=[];
		for (var j=0; j<totalRoutes; j++) {
			var setIndex=i;
			if (!matches) continue;
			for (var k=0; k<routeIndex[j].length; k++) {
				if (!matches) continue;
				if (setCoords[3][setIndex]==routeInfo[j][3*k+1]) { //the shape types should match
					var e=routeInfo[j][3*k+2]; //the edge to next shape
					if (e!=-1 && setMap[e][setIndex]==-1) {matches=false;} 
					else if (e!=-1 && setMap[e][setIndex]!=-1){
						if (!contains(currentIndex,setIndex)) currentIndex.push(setIndex);
						setIndex=setMap[e][setIndex];                      
					} else if (e!=-1) {matches=false;} 
					else if (e==-1) {
						if (!contains(currentIndex,setIndex)) currentIndex.push(setIndex);
						k=routeIndex[j].length;
					}
				}  else {matches=false;}
				
			}
			
		}
		//now check to see if matching tiling contains any tiles from highlighted tiling
		for (var m=0; m<subsetTotal; m++) {
			for (var n=0; n<subsetTotal; n++) {
				if (currentIndex[m]==subsetIndices[n]) matches=false;    
			}
		}
		if (matches) {
			var matchCoords=[[],[],[],[]];
			for (var m=0; m<subsetTotal; m++) {
				matchCoords[0][m]=setCoords[0][currentIndex[m]]; 
				matchCoords[1][m]=setCoords[1][currentIndex[m]];
				matchCoords[2][m]=setCoords[2][currentIndex[m]];
				matchCoords[3][m]=setCoords[3][currentIndex[m]];
			}
			var matchMap=mapShapes(matchCoords,subsetTotal,size);
			var matchInfo=diameter(matchCoords,subsetTotal,matchMap,false,"#FF0000");
			var MX=matchInfo[0];
			var MY=matchInfo[1];
			var matchDistance=distance(MX,MY,tilingCentreX,tilingCentreY);
			if (matchDistance<closest) {
				for (var m=0; m<subsetTotal; m++) {
					closestCoords[0][m]=matchCoords[0][m];
					closestCoords[1][m]=matchCoords[1][m];
					closestCoords[2][m]=matchCoords[2][m];
					closestCoords[3][m]=matchCoords[3][m];
				}
				closest=matchDistance;
			}
			//alert("Found a match\n"+currentIndex+"\n"+subsetIndices);
		}
	}
	if (closest<100000000000) {
		var closestMap=mapShapes(closestCoords,subsetTotal,size);
		diameter(closestCoords,subsetTotal,closestMap,true,"#00FF00");
		drawShapes(closestCoords,subsetTotal,"#00BB00","#00EE00");
		document.getElementById("message").innerHTML=", Distance to closest matching tiling: "+Math.round(closest/tilingDiameter*1000)/1000+"<i>d</i>";
		foundMatchingTiling=true;
	} else {
		document.getElementById("message").innerHTML="";
		closestCoords=[[],[],[],[]];
		foundMatchingTiling=false;
	}
	diameter(highlightedShapeCoords,totalHighlightedShapes,highlightedShapeMap,true,"#FF0000");
}

//used when finding a matching tiling 
function contains(list,value) {
	for (var i=0; i<list.length; i++) {
		if (value==list[i]) return true;    
	}
	return false;
}

function highlight(X,Y) {
	var closestIndex=-1;
	var closestDist=10000000;
	//first get the closest shape
	for (var i=0; i<totalShapes; i++) {
		var d=distance(X,Y,shapeCoords[0][i]+Math.sin(shapeCoords[2][i]*Math.PI/180)*size/2,shapeCoords[1][i]-Math.cos(shapeCoords[2][i]*Math.PI/180)*size/2)
		if ((closestIndex==-1 || d<closestDist) && d<size/2)  {
			closestDist=d;
			closestIndex=i;
		}
	}
	if (closestIndex==-1) {return;}
	var alreadyHighlighted=false;
	for (var i=0; i<totalHighlightedShapes; i++) {
		//if it is already highlighted then unhighlight it
		if (highlightedShapeIndex[i]==closestIndex) {
			alreadyHighlighted=true;
			for (var j=i; j<totalHighlightedShapes-1; j++) {
				highlightedShapeIndex[j]=highlightedShapeIndex[j+1];   
				highlightedShapeCoords[0][j]=highlightedShapeCoords[0][j+1];
				highlightedShapeCoords[1][j]=highlightedShapeCoords[1][j+1];
				highlightedShapeCoords[2][j]=highlightedShapeCoords[2][j+1];
				highlightedShapeCoords[3][j]=highlightedShapeCoords[3][j+1];
				highlightedShapeMap[0][j]=highlightedShapeMap[0][j+1];
				highlightedShapeMap[1][j]=highlightedShapeMap[1][j+1];
				highlightedShapeMap[2][j]=highlightedShapeMap[2][j+1];
				highlightedShapeMap[3][j]=highlightedShapeMap[3][j+1];
			}
			totalHighlightedShapes--;
		}
	}
	//otherwise highlight it
	if (!alreadyHighlighted) {
		highlightedShapeIndex[totalHighlightedShapes]=closestIndex;   
		highlightedShapeCoords[0][totalHighlightedShapes]=shapeCoords[0][closestIndex];
		highlightedShapeCoords[1][totalHighlightedShapes]=shapeCoords[1][closestIndex];
		highlightedShapeCoords[2][totalHighlightedShapes]=shapeCoords[2][closestIndex];
		highlightedShapeCoords[3][totalHighlightedShapes]=shapeCoords[3][closestIndex]; 
		totalHighlightedShapes++;
	}
}

function fixedHighlight(X,Y) {
	var closestIndex=-1;
	var closestDist=10000000;
	//first get the closest shape
	for (var i=0; i<totalShapes; i++) {
		var d=distance(X,Y,shapeCoords[0][i]+Math.sin(shapeCoords[2][i]*Math.PI/180)*size/2,shapeCoords[1][i]-Math.cos(shapeCoords[2][i]*Math.PI/180)*size/2)
		if ((closestIndex==-1 || d<closestDist) && d<size/2)  {
			closestDist=d;
			closestIndex=i;
		}
	}
	if (closestIndex==-1) {return;}
	var alreadyHighlighted=false;
	for (var i=0; i<totalFixedHighlightedShapes; i++) {
		//if it is already highlighted then unhighlight it
		if (fixedHighlightedShapeIndex[i]==closestIndex) {
			alreadyHighlighted=true;
			for (var j=i; j<totalFixedHighlightedShapes-1; j++) {
				fixedHighlightedShapeIndex[j]=fixedHighlightedShapeIndex[j+1];   
				fixedHighlightedShapeCoords[0][j]=fixedHighlightedShapeCoords[0][j+1];
				fixedHighlightedShapeCoords[1][j]=fixedHighlightedShapeCoords[1][j+1];
				fixedHighlightedShapeCoords[2][j]=fixedHighlightedShapeCoords[2][j+1];
				fixedHighlightedShapeCoords[3][j]=fixedHighlightedShapeCoords[3][j+1];
				fixedHighlightedShapeCoords[4][j]=fixedHighlightedShapeCoords[4][j+1];
			}
			totalFixedHighlightedShapes--;
		}
	}
	//otherwise highlight it
	if (!alreadyHighlighted) {
		fixedHighlightedShapeIndex[totalFixedHighlightedShapes]=closestIndex;   
		fixedHighlightedShapeCoords[0][totalFixedHighlightedShapes]=shapeCoords[0][closestIndex];
		fixedHighlightedShapeCoords[1][totalFixedHighlightedShapes]=shapeCoords[1][closestIndex];
		fixedHighlightedShapeCoords[2][totalFixedHighlightedShapes]=shapeCoords[2][closestIndex];
		fixedHighlightedShapeCoords[3][totalFixedHighlightedShapes]=shapeCoords[3][closestIndex];
		fixedHighlightedShapeCoords[4][totalFixedHighlightedShapes]=size;
		totalFixedHighlightedShapes++;
	}
}

function mapShapes(coords,total,length) { //make a record of each shape's neighbour
	var minD=length/Math.pow(phi,10);
	//first set indices of all neighbours to -1
	var tempShapeMap=[[],[],[],[]];
	for (var i=0; i<total; i++) {
		tempShapeMap[0][i]=-1;
		tempShapeMap[1][i]=-1;
		tempShapeMap[2][i]=-1;
		tempShapeMap[3][i]=-1;
	}
	
	//create an array that contains all coordinates of vertices
	var vertices=[[],[]];
	for (var i=0; i<total; i++) {
		var x=coords[0][i];
		var y=coords[1][i];
		var ang=coords[2][i];
		vertices[0][4*i]=x;
		vertices[1][4*i]=y;
		vertices[0][4*i+1]=x+length*Math.sin((36+ang)*Math.PI/180);
		vertices[1][4*i+1]=y-length*Math.cos((36+ang)*Math.PI/180);
		vertices[0][4*i+2]=x+length*Math.sin(ang*Math.PI/180);
		vertices[1][4*i+2]=y-length*Math.cos(ang*Math.PI/180);
		if (coords[3][i]==1) {
			vertices[0][4*i+2]=x+length*Math.sin(ang*Math.PI/180)/phi;
			vertices[1][4*i+2]=y-length*Math.cos(ang*Math.PI/180)/phi;
		}
		vertices[0][4*i+3]=x-length*Math.sin((36-ang)*Math.PI/180);
		vertices[1][4*i+3]=y-length*Math.cos((36-ang)*Math.PI/180);
	}
	for (var i=0; i<total-1; i++) {
		if (tempShapeMap[0][i]!=-1 && tempShapeMap[1][i]!=-1 && tempShapeMap[2][i]!=-1 && tempShapeMap[3][i]!=-1) {
			continue;
		}
		for (var j=i+1; j<total; j++) {
			if (tempShapeMap[0][j]!=-1 && tempShapeMap[1][j]!=-1 && tempShapeMap[2][j]!=-1 && tempShapeMap[3][j]!=-1) {
			continue;
			}
			if (coords[3][i]==0 && coords[3][j]==0) {
				//two kites meeting right long side to left long side
				if (Math.abs(vertices[0][4*i]-vertices[0][4*j])<minD && 
				   Math.abs(vertices[1][4*i]-vertices[1][4*j])<minD &&
				   Math.abs(vertices[0][4*i+1]-vertices[0][4*j+3])<minD && 
				   Math.abs(vertices[1][4*i+1]-vertices[1][4*j+3])<minD) {
					tempShapeMap[0][i]=j;
					tempShapeMap[3][j]=i;
				}
				//two kites meeting left long side to right long side
				if (Math.abs(vertices[0][4*i]-vertices[0][4*j])<minD && 
				   Math.abs(vertices[1][4*i]-vertices[1][4*j])<minD &&
				   Math.abs(vertices[0][4*i+3]-vertices[0][4*j+1])<minD && 
				   Math.abs(vertices[1][4*i+3]-vertices[1][4*j+1])<minD) {
					tempShapeMap[3][i]=j;
					tempShapeMap[0][j]=i;
				}
				//two kites meeting right short side to left short side
				if (Math.abs(vertices[0][4*i+1]-vertices[0][4*j+3])<minD && 
				   Math.abs(vertices[1][4*i+1]-vertices[1][4*j+3])<minD &&
				   Math.abs(vertices[0][4*i+2]-vertices[0][4*j+2])<minD && 
				   Math.abs(vertices[1][4*i+2]-vertices[1][4*j+2])<minD) {
					tempShapeMap[1][i]=j;
					tempShapeMap[2][j]=i;
				}
				//two kites meeting right short side to left short side
				if (Math.abs(vertices[0][4*i+3]-vertices[0][4*j+1])<minD && 
				   Math.abs(vertices[1][4*i+3]-vertices[1][4*j+1])<minD &&
				   Math.abs(vertices[0][4*i+2]-vertices[0][4*j+2])<minD && 
				   Math.abs(vertices[1][4*i+2]-vertices[1][4*j+2])<minD) {
					tempShapeMap[2][i]=j;
					tempShapeMap[1][j]=i;
				}
			}
			if (coords[3][i]==1 && coords[3][j]==1) {
				//two darts meeting right long side to left long side
				if (Math.abs(vertices[0][4*i]-vertices[0][4*j])<minD && 
				   Math.abs(vertices[1][4*i]-vertices[1][4*j])<minD &&
				   Math.abs(vertices[0][4*i+1]-vertices[0][4*j+3])<minD && 
				   Math.abs(vertices[1][4*i+1]-vertices[1][4*j+3])<minD) {
					tempShapeMap[0][i]=j;
					tempShapeMap[3][j]=i;
				}
				//two darts meeting left long side to right long side
				if (Math.abs(vertices[0][4*i]-vertices[0][4*j])<minD && 
				   Math.abs(vertices[1][4*i]-vertices[1][4*j])<minD &&
				   Math.abs(vertices[0][4*i+3]-vertices[0][4*j+1])<minD && 
				   Math.abs(vertices[1][4*i+3]-vertices[1][4*j+1])<minD) {
					tempShapeMap[3][i]=j;
					tempShapeMap[0][j]=i;
				}
			}
			if (coords[3][i]!=coords[3][j]) {
				//kite meeting dart right long side to right long side (or vice versa)
				if (Math.abs(vertices[0][4*i]-vertices[0][4*j+1])<minD && 
				   Math.abs(vertices[1][4*i]-vertices[1][4*j+1])<minD &&
				   Math.abs(vertices[0][4*i+1]-vertices[0][4*j])<minD && 
				   Math.abs(vertices[1][4*i+1]-vertices[1][4*j])<minD) {
					tempShapeMap[0][i]=j;
					tempShapeMap[0][j]=i;
				}
				//kite meeting dart left long side to left long side (or vice versa)
				if (Math.abs(vertices[0][4*i]-vertices[0][4*j+3])<minD && 
				   Math.abs(vertices[1][4*i]-vertices[1][4*j+3])<minD &&
				   Math.abs(vertices[0][4*i+3]-vertices[0][4*j])<minD && 
				   Math.abs(vertices[1][4*i+3]-vertices[1][4*j])<minD) {
					tempShapeMap[3][i]=j;
					tempShapeMap[3][j]=i;
				}
				//kite meeting dart right short side to right short side (or vice versa)
				if (Math.abs(vertices[0][4*i+1]-vertices[0][4*j+2])<minD && 
				   Math.abs(vertices[1][4*i+1]-vertices[1][4*j+2])<minD &&
				   Math.abs(vertices[0][4*i+2]-vertices[0][4*j+1])<minD && 
				   Math.abs(vertices[1][4*i+2]-vertices[1][4*j+1])<minD) {
					tempShapeMap[1][i]=j;
					tempShapeMap[1][j]=i;
				}
				//kites meeting dart left short side to left short side (or vice versa)
				if (Math.abs(vertices[0][4*i+3]-vertices[0][4*j+2])<minD && 
				   Math.abs(vertices[1][4*i+3]-vertices[1][4*j+2])<minD &&
				   Math.abs(vertices[0][4*i+2]-vertices[0][4*j+3])<minD && 
				   Math.abs(vertices[1][4*i+2]-vertices[1][4*j+3])<minD) {
					tempShapeMap[2][i]=j;
					tempShapeMap[2][j]=i;
				}
			}
		}
	}
	return tempShapeMap;
}

function diameter(coords,total,map,drawCircle,color) {
	var vertices=[[],[]];
	//first create an array that contains all coordinates of vertices that arent completely surrounded
	var ind=0;
	for (var i=0; i<total; i++) {
		if (map[0][i]!=-1 && map[1][i]!=-1 && map[2][i]!=-1 && map[3][i]!=-1) {
			continue;
			//if shape has four neighbours then it isnt on edge so we can ignore
		}
		var x=coords[0][i];
		var y=coords[1][i];
		var ang=coords[2][i];
		vertices[0][ind]=x;
		vertices[1][ind]=y;
		vertices[0][ind+1]=x+size*Math.sin((36+ang)*Math.PI/180);
		vertices[1][ind+1]=y-size*Math.cos((36+ang)*Math.PI/180);
		vertices[0][ind+2]=x+size*Math.sin(ang*Math.PI/180);
		vertices[1][ind+2]=y-size*Math.cos(ang*Math.PI/180);
		if (coords[3][i]==1) {
			vertices[0][ind+2]=x+size*Math.sin(ang*Math.PI/180)/phi;
			vertices[1][ind+2]=y-size*Math.cos(ang*Math.PI/180)/phi;
		}
		vertices[0][ind+3]=x-size*Math.sin((36-ang)*Math.PI/180);
		vertices[1][ind+3]=y-size*Math.cos((36-ang)*Math.PI/180);
		ind+=4
	}
	
	//delete identical vertices
	var deleteT=0;
	for (var i=0; i<ind-1-deleteT; i++) {
		for (var j=i+1; j<ind-deleteT; j++) {
			var minD=size/(phi*phi*phi*phi);
			if (Math.abs(vertices[0][i]-vertices[0][j])<minD &&
			   Math.abs(vertices[1][i]-vertices[1][j])<minD) {
				for (k=j; k<ind-1-deleteT; k++) {
					vertices[0][k]=vertices[0][k+1];
					vertices[1][k]=vertices[1][k+1];
				}
				deleteT++;
			}
		}
	}
	ind-=deleteT;
	
	//the next 100 lines or so search for only vertices which lay on bounding polygon
	
	//now we need to find the lowest vertex
	
	var lowest=10000000000;
	var lowestInd=-1;
	for (var i=0; i<ind; i++) {
		if (vertices[1][i]<=lowest) {
			lowest=vertices[1][i];
			lowestInd=i;
		}
	}
	//next we need to find the next vertex looking anti-clockwise
	
	//find the vertex which creates a line with gradient closest to zero (and negative if possible)
	//with lowestInd vertex
	
	var smallestGrad=-100000000000;
	var smallestGradInd=-1;
	for (var i=0; i<ind; i++) {
		if (i==lowestInd) continue;
		if (vertices[0][i]!=vertices[0][lowestInd]) {
			var m=(vertices[1][i]-vertices[1][lowestInd])/(vertices[0][i]-vertices[0][lowestInd]);
			if (m>smallestGrad && m<=0) {
				smallestGrad=m;
				smallestGradInd=i;
			}
		} else {
			if (-1000>smallestGrad) {
				smallestGrad=-1000;
				smallestGradInd=i;
			}
		}
	}
	//if there are no points which create a negative gradient look for largest positive gradient
	if (smallestGradInd==-1) {
		for (var i=0; i<ind; i++) {
			if (i==lowestInd) continue;
			var m=(vertices[1][i]-vertices[1][lowestInd])/(vertices[0][i]-vertices[0][lowestInd]);
			if (m>smallestGrad) {
				smallestGrad=m;
				smallestGradInd=i;
			}
		}    
	}
	 
	var boundingIndex=[];
	boundingIndex[0]=lowestInd;
	boundingIndex[1]=smallestGradInd;
	var IND=2;
	while (boundingIndex[IND-1]!=lowestInd) {
		var val=-2;
		var valInd;
		for (var i=0; i<ind; i++) {
			if (i==boundingIndex[IND-1] || i==boundingIndex[IND-2]) continue;  
			var i1=boundingIndex[IND-1];
			var i2=boundingIndex[IND-2];
			var ang1=Math.atan2(vertices[1][i1]-vertices[1][i2],vertices[0][i1]-vertices[0][i2]);
			var ang2=Math.atan2(vertices[1][i]-vertices[1][i1],vertices[0][i]-vertices[0][i1]);
			var sinA=Math.sin(ang1-ang2);
			var cosA=Math.cos(ang1-ang2);
			if (cosA>=val) {
				val=cosA;
				valInd=i;
			}
		}
		boundingIndex[IND]=valInd;
		IND++;
	}
	//delete the vertices that dont form part of boundary
	var tempVertices=[[],[]];
	for (var i=0; i<IND; i++) {
		tempVertices[0][i]=vertices[0][boundingIndex[i]];
		tempVertices[1][i]=vertices[1][boundingIndex[i]];
	}
	for (var i=0; i<IND; i++) {
		vertices[0][i]=tempVertices[0][i];
		vertices[1][i]=tempVertices[1][i];
	}
	
	/*c.beginPath(); //show the bounding polygon
	c.strokeStyle="red";
	c.moveTo(vertices[0][0],vertices[1][0]);
	for (var i=1; i<IND; i++) {
		c.lineTo(vertices[0][i],vertices[1][i]);    
	}
	c.lineTo(vertices[0][0],vertices[1][0]);
	c.stroke();
	c.closePath();*/
	
	
	var smallestR=1000000000;
	var index1=-1;
	var index2=-1;
	//first choose two points and see if we can find the smallest circle with these two points
	//either side of the diameter with every other point contained inside the circle
	for (var i=0; i<IND-1; i++) {
		for (var j=i+1; j<IND; j++) {
			var centreX=0.5*(vertices[0][i]+vertices[0][j]);
			var centreY=0.5*(vertices[1][i]+vertices[1][j]);
			var r=distanceSquared(vertices[0][i],vertices[1][i],vertices[0][j],vertices[1][j])/4;
			if (r>=smallestR) {continue;}
			var contained=true; //set to false if another point is more than r away from centre
			for (var k=0; k<IND; k++) {
				if (k==i || k==j) {continue;}
				var d=distanceSquared(centreX,centreY,vertices[0][k],vertices[1][k]);  
				if (d>r+0.000001) {contained=false; break;}
			}
			if (contained && r<smallestR) {
				smallestR=r;
				index1=i;
				index2=j;
			}
		}
	}
	//if the smallest circle contains only two points no need to continue
	if (smallestR<1000000000) {
		if (drawCircle) {
			c.beginPath();
			c.lineWidth=size/20;
			c.strokeStyle=color;
			c.arc((vertices[0][index1]+vertices[0][index2])*0.5,(vertices[1][index1]+vertices[1][index2])*0.5,Math.sqrt(smallestR),0,Math.PI*2,true);
			c.stroke();
			c.closePath();
		}
		var D=Math.round((Math.sqrt(smallestR)*2000)/size)/1000;
		//return the centre of the tiling and the diameter
		return [(vertices[0][index1]+vertices[0][index2])*0.5,(vertices[1][index1]+vertices[1][index2])*0.5,2*Math.sqrt(smallestR)];
	}
	
	
	var centreXSmallest;
	var centreYSmallest;
	smallestR=1000000000;
	//now search for the smallest circle with three points on its edge and containing all other points
	for (var i=0; i<IND-2; i++) {
		for (var j=i+1; j<IND-1; j++) {
			for (var k=j+1; k<IND; k++) {
				//change the y-coords by a *tiny* amount to avoid vertical bisector lines
				while (Math.abs(vertices[1][i]-vertices[1][j])<0.000001 ||
					  Math.abs(vertices[1][j]-vertices[1][k])<0.000001) {
					vertices[1][i]+=0.000001;
					vertices[1][j]-=0.000001;
				}
				
				//gradient of perpendicular bisector
				var m1=-(vertices[0][j]-vertices[0][i])/(vertices[1][j]-vertices[1][i]);
				//coordinates of midpoint
				var x1=0.5*(vertices[0][j]+vertices[0][i]);
				var y1=0.5*(vertices[1][j]+vertices[1][i]);
				//y-intercept
				var c1=y1-m1*x1;
					
				//gradient of perpendicular bisector
				var m2=-(vertices[0][k]-vertices[0][j])/(vertices[1][k]-vertices[1][j]);
				//coordinates of midpoint
				var x2=0.5*(vertices[0][k]+vertices[0][j]);
				var y2=0.5*(vertices[1][k]+vertices[1][j]);
				//y-intercept
				var c2=y2-m2*x2;
				
				//if shapes are almost collinear they will produce an extremely large circle 
				if (Math.abs(m1-m2)<0.0001) {continue;}
					
				//x coordinate of intersection of perpendicular bisector
				var xInt=(c2-c1)/(m1-m2);
				var yInt=m1*xInt+c1;
				var r=distanceSquared(xInt,yInt,vertices[0][j],vertices[1][j]);  
				if (r>=smallestR) {continue;}
				var contained=true; //set to false if another point is more than r away from centre
				for (var m=0; m<IND; m++) {
					if (m==i || m==j || m==k) {continue;}
					var d=distanceSquared(xInt,yInt,vertices[0][m],vertices[1][m]);  
					if (d>r+0.001) {contained=false; break;}
				}
				if (contained && r<smallestR) {
					smallestR=r;
					centreXSmallest=xInt;
					centreYSmallest=yInt;
				}
			}
		}
	}
	if (drawCircle) {
		c.beginPath();
		c.lineWidth=size/20;
		c.strokeStyle=color;
		c.arc(centreXSmallest,centreYSmallest,Math.sqrt(smallestR),0,Math.PI*2,true);
		c.stroke();
		c.closePath();
	}
	var D=Math.round(Math.sqrt(smallestR)*2000)/1000
	var D=Math.round((Math.sqrt(smallestR)*2000)/size)/1000;
	return [centreXSmallest,centreYSmallest,2*Math.sqrt(smallestR)];
}

function rotate(ang) {
	if (totalShapes==0) {return;}
	var x=0;
	var y=0;
	for (var i=0; i<totalShapes; i++) {
		x+=shapeCoords[0][i];
		y+=shapeCoords[1][i];
	}
	x=x/totalShapes;
	y=y/totalShapes;
	for (var i=0; i<totalShapes; i++) {
		var X=shapeCoords[0][i]-x;
		var Y=shapeCoords[1][i]-y;
		var newX=X*Math.cos(ang*Math.PI/180)-Y*Math.sin(ang*Math.PI/180);
		var newY=X*Math.sin(ang*Math.PI/180)+Y*Math.cos(ang*Math.PI/180);
		shapeCoords[0][i]=newX+x;
		shapeCoords[1][i]=newY+y;
		shapeCoords[2][i]+=ang;
		while (shapeCoords[2][i]<0) {shapeCoords[2][i]+=360;}
		while (shapeCoords[2][i]>=360) {shapeCoords[2][i]-=360;}
	}
	for (var i=0; i<totalHighlightedShapes; i++) {
		var X=highlightedShapeCoords[0][i]-x;
		var Y=highlightedShapeCoords[1][i]-y;
		var newX=X*Math.cos(ang*Math.PI/180)-Y*Math.sin(ang*Math.PI/180);
		var newY=X*Math.sin(ang*Math.PI/180)+Y*Math.cos(ang*Math.PI/180);
		highlightedShapeCoords[0][i]=newX+x;
		highlightedShapeCoords[1][i]=newY+y;
		highlightedShapeCoords[2][i]+=ang;
		while (highlightedShapeCoords[2][i]<0) {highlightedShapeCoords[2][i]+=360;}
		while (highlightedShapeCoords[2][i]>=360) {highlightedShapeCoords[2][i]-=360;}
	}
	for (var i=0; i<totalFixedHighlightedShapes; i++) {
		var X=fixedHighlightedShapeCoords[0][i]-x;
		var Y=fixedHighlightedShapeCoords[1][i]-y;
		var newX=X*Math.cos(ang*Math.PI/180)-Y*Math.sin(ang*Math.PI/180);
		var newY=X*Math.sin(ang*Math.PI/180)+Y*Math.cos(ang*Math.PI/180);
		fixedHighlightedShapeCoords[0][i]=newX+x;
		fixedHighlightedShapeCoords[1][i]=newY+y;
		fixedHighlightedShapeCoords[2][i]+=ang;
		while (fixedHighlightedShapeCoords[2][i]<0) {fixedHighlightedShapeCoords[2][i]+=360;}
		while (fixedHighlightedShapeCoords[2][i]>=360) {fixedHighlightedShapeCoords[2][i]-=360;}
	}
}

function deleteShape(mX,mY) {
	var closestIndex=-1;
	var closestDist=10000000;
	for (var i=0; i<totalShapes; i++) {
		var d=distance(mX,mY,shapeCoords[0][i]+Math.sin(shapeCoords[2][i]*Math.PI/180)*size/2,shapeCoords[1][i]-Math.cos(shapeCoords[2][i]*Math.PI/180)*size/2)
		if ((closestIndex==-1 || d<closestDist) && d<size/2)  {
			closestDist=d;
			closestIndex=i;
		}
	}
	if (closestIndex==-1) {return;}
	for (var i=closestIndex; i<totalShapes-1; i++) {
		shapeCoords[0][i]=shapeCoords[0][i+1];
		shapeCoords[1][i]=shapeCoords[1][i+1];
		shapeCoords[2][i]=shapeCoords[2][i+1];
		shapeCoords[3][i]=shapeCoords[3][i+1];
	}
	totalShapes--;
}

function zoomIn() {
	if (totalShapes==0) {return;}
	var x=0;
	var y=0;
	for (var i=0; i<totalShapes; i++) {
		x+=shapeCoords[0][i]+size/2*Math.sin(shapeCoords[2][i]*Math.PI/180);
		y+=shapeCoords[1][i]-size/2*Math.cos(shapeCoords[2][i]*Math.PI/180);
	}
	x=x/totalShapes;
	y=y/totalShapes;
	for (var i=0; i<totalShapes; i++) {
		shapeCoords[0][i]=(shapeCoords[0][i]-x)*phi+x;
		shapeCoords[1][i]=(shapeCoords[1][i]-y)*phi+y;
	}
	for (var i=0; i<totalHighlightedShapes; i++) {
		highlightedShapeCoords[0][i]=(highlightedShapeCoords[0][i]-x)*phi+x;
		highlightedShapeCoords[1][i]=(highlightedShapeCoords[1][i]-y)*phi+y;
	}
	for (var i=0; i<totalFixedHighlightedShapes; i++) {
		fixedHighlightedShapeCoords[0][i]=(fixedHighlightedShapeCoords[0][i]-x)*phi+x;
		fixedHighlightedShapeCoords[1][i]=(fixedHighlightedShapeCoords[1][i]-y)*phi+y;
		fixedHighlightedShapeCoords[4][i]=fixedHighlightedShapeCoords[4][i]*phi;
	}
	size=size*phi;
}

function zoomOut() {
	if (totalShapes==0) {return;}
	var x=0;
	var y=0;
	for (var i=0; i<totalShapes; i++) {
		x+=shapeCoords[0][i]+size/2*Math.sin(shapeCoords[2][i]*Math.PI/180);
		y+=shapeCoords[1][i]-size/2*Math.cos(shapeCoords[2][i]*Math.PI/180);
	}
	x=x/totalShapes;
	y=y/totalShapes;
	for (var i=0; i<totalShapes; i++) {
		shapeCoords[0][i]=(shapeCoords[0][i]-x)/phi+x;
		shapeCoords[1][i]=(shapeCoords[1][i]-y)/phi+y;
	}
	for (var i=0; i<totalHighlightedShapes; i++) {
		highlightedShapeCoords[0][i]=(highlightedShapeCoords[0][i]-x)/phi+x;
		highlightedShapeCoords[1][i]=(highlightedShapeCoords[1][i]-y)/phi+y;
	}
	for (var i=0; i<totalFixedHighlightedShapes; i++) {
		fixedHighlightedShapeCoords[0][i]=(fixedHighlightedShapeCoords[0][i]-x)/phi+x;
		fixedHighlightedShapeCoords[1][i]=(fixedHighlightedShapeCoords[1][i]-y)/phi+y;
		fixedHighlightedShapeCoords[4][i]=fixedHighlightedShapeCoords[4][i]/phi;
	}
	size=size/phi;
}

function centre() {
	if (totalShapes==0) {return;}
	var x=0;
	var y=0;
	for (var i=0; i<totalShapes; i++) {
		x+=shapeCoords[0][i]+size/2*Math.sin(shapeCoords[2][i]*Math.PI/180);
		y+=shapeCoords[1][i]-size/2*Math.cos(shapeCoords[2][i]*Math.PI/180);
	}
	x=x/totalShapes;
	y=y/totalShapes;
	for (var i=0; i<totalShapes; i++) {
		shapeCoords[0][i]+=600-x;
		shapeCoords[1][i]+=350-y;
	}
	
	for (var i=0; i<totalHighlightedShapes; i++) {
		highlightedShapeCoords[0][i]+=600-x;
		highlightedShapeCoords[1][i]+=350-y;
	}
	for (var i=0; i<totalFixedHighlightedShapes; i++) {
		fixedHighlightedShapeCoords[0][i]+=600-x;
		fixedHighlightedShapeCoords[1][i]+=350-y;
	}
}

function deflate() {
	var tempCoords=[[],[],[],[]]; //x coord, y coord, angle, type (0=kite, 1=dart) 
	var tempTotal=0;
	for (var i=0; i<totalShapes; i++) {
		//deflate dart
		if (shapeCoords[3][i]==0) {
			//kite
			var j=tempTotal;
			tempCoords[0][j]=shapeCoords[0][i]+size*Math.cos((shapeCoords[2][i]-54)*Math.PI/180);
			tempCoords[1][j]=shapeCoords[1][i]+size*Math.sin((shapeCoords[2][i]-54)*Math.PI/180);
			tempCoords[2][j]=shapeCoords[2][i]-108;
			tempCoords[3][j]=0;
			tempTotal++;
			//kite
			j=tempTotal;
			tempCoords[0][j]=shapeCoords[0][i]+size*Math.cos((shapeCoords[2][i]-126)*Math.PI/180);
			tempCoords[1][j]=shapeCoords[1][i]+size*Math.sin((shapeCoords[2][i]-126)*Math.PI/180);
			tempCoords[2][j]=shapeCoords[2][i]+108;
			tempCoords[3][j]=0;
			tempTotal++;
			//dart
			if (shapeMap[3][i]==-1) {//used to avoid overlapping shapes
				j=tempTotal;
				tempCoords[0][j]=shapeCoords[0][i];
				tempCoords[1][j]=shapeCoords[1][i];
				tempCoords[2][j]=shapeCoords[2][i]-36;
				tempCoords[3][j]=1;
				tempTotal++;
			}
			//dart
			j=tempTotal;
			tempCoords[0][j]=shapeCoords[0][i];
			tempCoords[1][j]=shapeCoords[1][i];
			tempCoords[2][j]=shapeCoords[2][i]+36;
			tempCoords[3][j]=1;
			tempTotal++;
		}
		else if (shapeCoords[3][i]==1) {
			//kite
			var j=tempTotal;
			tempCoords[0][j]=shapeCoords[0][i];
			tempCoords[1][j]=shapeCoords[1][i];
			tempCoords[2][j]=shapeCoords[2][i];
			tempCoords[3][j]=0;
			tempTotal++;
			//dart
			j=tempTotal;
			tempCoords[0][j]=shapeCoords[0][i]+size*Math.cos((shapeCoords[2][i]-126)*Math.PI/180);
			tempCoords[1][j]=shapeCoords[1][i]+size*Math.sin((shapeCoords[2][i]-126)*Math.PI/180);
			tempCoords[2][j]=shapeCoords[2][i]+144;
			tempCoords[3][j]=1;
			tempTotal++;
			
			//dart
			if (shapeMap[0][i]==-1) {//used to avoid overlapping shapes
				j=tempTotal;
				tempCoords[0][j]=shapeCoords[0][i]+size*Math.cos((shapeCoords[2][i]-54)*Math.PI/180);
				tempCoords[1][j]=shapeCoords[1][i]+size*Math.sin((shapeCoords[2][i]-54)*Math.PI/180);
				tempCoords[2][j]=shapeCoords[2][i]-144;
				tempCoords[3][j]=1;
				tempTotal++;
			}
		}
	}
	for (var i=0; i<tempTotal; i++) {
		shapeCoords[0][i]=tempCoords[0][i]; 
		shapeCoords[1][i]=tempCoords[1][i]; 
		shapeCoords[2][i]=tempCoords[2][i]; 
		shapeCoords[3][i]=tempCoords[3][i]; 
	}
	totalShapes=tempTotal;
	size=size/phi
}

function deflateLegal() {
	var tempCoords=[[],[],[],[]]; //x coord, y coord, angle, type (0=kite, 1=dart) 
	var tempTotal=0;
	for (var i=0; i<totalLegalShapes; i++) {
		inflatedTilingCoords[0][i]=legalTilingCoords[0][i];
		inflatedTilingCoords[1][i]=legalTilingCoords[1][i];
		inflatedTilingCoords[2][i]=legalTilingCoords[2][i];
		inflatedTilingCoords[3][i]=legalTilingCoords[3][i];
		//deflate dart
		if (legalTilingCoords[3][i]==0) {
			//kite
			var j=tempTotal;
			tempCoords[0][j]=legalTilingCoords[0][i]+legalSize*Math.cos((legalTilingCoords[2][i]-54)*Math.PI/180);
			tempCoords[1][j]=legalTilingCoords[1][i]+legalSize*Math.sin((legalTilingCoords[2][i]-54)*Math.PI/180);
			tempCoords[2][j]=legalTilingCoords[2][i]-108;
			tempCoords[3][j]=0;
			inflatedTilingIndex[j]=i;
			tempTotal++;
			//kite
			j=tempTotal;
			tempCoords[0][j]=legalTilingCoords[0][i]+legalSize*Math.cos((legalTilingCoords[2][i]-126)*Math.PI/180);
			tempCoords[1][j]=legalTilingCoords[1][i]+legalSize*Math.sin((legalTilingCoords[2][i]-126)*Math.PI/180);
			tempCoords[2][j]=legalTilingCoords[2][i]+108;
			tempCoords[3][j]=0;
			inflatedTilingIndex[j]=i;
			tempTotal++;
			//dart
			if (legalShapeMap[3][i]==-1) {
				//used to avoid overlapping shapes 
				j=tempTotal;
				tempCoords[0][j]=legalTilingCoords[0][i];
				tempCoords[1][j]=legalTilingCoords[1][i];
				tempCoords[2][j]=legalTilingCoords[2][i]-36;
				tempCoords[3][j]=1;
				inflatedTilingIndex[j]=i;
				tempTotal++;
			}
			//dart
			j=tempTotal;
			tempCoords[0][j]=legalTilingCoords[0][i];
			tempCoords[1][j]=legalTilingCoords[1][i];
			tempCoords[2][j]=legalTilingCoords[2][i]+36;
			tempCoords[3][j]=1;
			inflatedTilingIndex[j]=i;
			tempTotal++;
		}
		else if (legalTilingCoords[3][i]==1) {
			//kite
			var j=tempTotal;
			tempCoords[0][j]=legalTilingCoords[0][i];
			tempCoords[1][j]=legalTilingCoords[1][i];
			tempCoords[2][j]=legalTilingCoords[2][i];
			tempCoords[3][j]=0;
			inflatedTilingIndex[j]=i;
			tempTotal++;
			//dart
			j=tempTotal;
			tempCoords[0][j]=legalTilingCoords[0][i]+legalSize*Math.cos((legalTilingCoords[2][i]-126)*Math.PI/180);
			tempCoords[1][j]=legalTilingCoords[1][i]+legalSize*Math.sin((legalTilingCoords[2][i]-126)*Math.PI/180);
			tempCoords[2][j]=legalTilingCoords[2][i]+144;
			tempCoords[3][j]=1;
			inflatedTilingIndex[j]=i;
			tempTotal++;
			//dart
			if (legalShapeMap[0][i]==-1) {//used to avoid overlapping shapes
				j=tempTotal;
				tempCoords[0][j]=legalTilingCoords[0][i]+legalSize*Math.cos((legalTilingCoords[2][i]-54)*Math.PI/180);
				tempCoords[1][j]=legalTilingCoords[1][i]+legalSize*Math.sin((legalTilingCoords[2][i]-54)*Math.PI/180);
				tempCoords[2][j]=legalTilingCoords[2][i]-144;
				tempCoords[3][j]=1;
				inflatedTilingIndex[j]=i;
				tempTotal++;
			}
		}
	}
	for (var i=0; i<tempTotal; i++) {
		legalTilingCoords[0][i]=tempCoords[0][i]; 
		legalTilingCoords[1][i]=tempCoords[1][i]; 
		legalTilingCoords[2][i]=tempCoords[2][i]; 
		legalTilingCoords[3][i]=tempCoords[3][i]; 
	}
	totalLegalShapes=tempTotal;
	legalSize=legalSize/phi;
}

function cleanUp() {
	var minD=size/Math.pow(phi,10);
	for (var i=0; i<totalShapes-1; i++) {
		for (var j=i+1; j<totalShapes; j++) {
			var ang1=shapeCoords[2][i];
			while (ang1<0) {ang1+=360;}
			while (ang1>=360) {ang1-=360;}
			var ang2=shapeCoords[2][j];
			while (ang2<0) {ang2+=360;}
			while (ang2>=360) {ang2-=360;}
			if (Math.abs(shapeCoords[0][i]-shapeCoords[0][j])<minD && 
				Math.abs(shapeCoords[1][i]-shapeCoords[1][j])<minD && 
				Math.abs(ang1-ang2)<0.001) {
				for (var k=j; k<totalShapes; k++) {
					shapeCoords[0][k]=shapeCoords[0][k+1];
					shapeCoords[1][k]=shapeCoords[1][k+1];
					shapeCoords[2][k]=shapeCoords[2][k+1];
					shapeCoords[3][k]=shapeCoords[3][k+1];
				}
				totalShapes--;
				j--;
			}
		}
	}
	for (let i=0; i<shapeCoords[0].length; i++) {
		if (shapeCoords[0][i] == undefined) {
			shapeCoords[0].splice(i, 1);
			shapeCoords[1].splice(i, 1);
			shapeCoords[2].splice(i, 1);
			shapeCoords[3].splice(i, 1);
			i--;
		}
	}
}

function drawShapes(coords,total,col1,col2) {//draw all of the shapes
	//if (0==total && (hideCurrent || deleteShapeMode || highlightMode)) return;
	c.beginPath();
	c.fillStyle=col1; 
	//fill kites
	for (var i=0; i<total; i++) {
		//hide shape at cursor if cursor is near controls or we are in deleteShapeMode
		if (i==total && (hideCurrent || deleteShapeMode || highlightMode)) continue; 
		var x=coords[0][i];
		var y=coords[1][i];
		var ang=coords[2][i];
		if (coords[3][i]==0) {//draw a kite
			c.moveTo(x,y)
			c.lineTo(x+size*Math.sin((36+ang)*Math.PI/180),y-size*Math.cos((36+ang)*Math.PI/180));
			c.lineTo(x+size*Math.sin(ang*Math.PI/180),y-size*Math.cos(ang*Math.PI/180));
			c.lineTo(x-size*Math.sin((36-ang)*Math.PI/180),y-size*Math.cos((36-ang)*Math.PI/180));
		}
	}
	c.fill();
	c.closePath();
	c.beginPath();
	c.fillStyle=col2;
	//fill darts
	for (var i=0; i<total; i++) {
		var x=coords[0][i];
		var y=coords[1][i];
		var ang=coords[2][i];
		if (coords[3][i]==1)  {//draw a dart
			c.moveTo(x,y)
			c.lineTo(x+size*Math.sin((36+ang)*Math.PI/180),y-size*Math.cos((36+ang)*Math.PI/180))
			c.lineTo(x+size*Math.sin(ang*Math.PI/180)/phi,y-size*Math.cos(ang*Math.PI/180)/phi)
			c.lineTo(x-size*Math.sin((36-ang)*Math.PI/180),y-size*Math.cos((36-ang)*Math.PI/180))
		}
	}
	c.fill();
	c.closePath();
	
	c.beginPath();
	c.strokeStyle="#990000";
	c.lineWidth=size/25;
	for (var i=0; i<total; i++) {
		var x=coords[0][i];
		var y=coords[1][i];
		var ang=coords[2][i];
		if (coords[3][i]==0) {//draw a kite
			if (showCurves) {
				//draw red arc
				c.moveTo(x+size/phi*Math.cos((ang-36-90)*Math.PI/180),y+size/phi*Math.sin((ang-36-90)*Math.PI/180));
				c.arc(x,y,size/phi,(ang-36-90)*Math.PI/180,(ang+36-90)*Math.PI/180,false)  
			}
		} else {//draw a dart
			if (showCurves) {
				//draw red arc
				c.moveTo(x+size*(1-1/phi)*Math.cos((ang-36-90)*Math.PI/180),y+size*(1-1/phi)*Math.sin((ang-36-90)*Math.PI/180));
				c.arc(x,y,size*(1-1/phi),(ang-36-90)*Math.PI/180,(ang+36-90)*Math.PI/180,false) 
			}
		}
	}
	c.stroke();
	c.closePath();
	//draw arcs
	c.beginPath();
	c.strokeStyle="#009900";
	for (var i=0; i<total; i++) {
		var x=coords[0][i];
		var y=coords[1][i];
		var ang=coords[2][i];
		if (coords[3][i]==0) {//draw a kite
			if (showCurves) {
				//draw green arc
				x+=size*Math.sin(coords[2][i]*Math.PI/180);
				y-=size*Math.cos(coords[2][i]*Math.PI/180);
				c.moveTo(x+size/(phi*phi)*Math.cos(-(90-ang-108)*Math.PI/180),y+size/(phi*phi)*Math.sin(-(90-ang-108)*Math.PI/180));
				c.arc(x,y,size/(phi*phi),-(90-ang-108)*Math.PI/180,-(90-ang+108)*Math.PI/180,false)
				x-=size*Math.sin(coords[2][i]*Math.PI/180);
				y+=size*Math.cos(coords[2][i]*Math.PI/180);
			}
		} else {//draw a dart
			if (showCurves) {  
				//draw green arc
				x+=size/phi*Math.sin(coords[2][i]*Math.PI/180);
				y-=size/phi*Math.cos(coords[2][i]*Math.PI/180);
				c.moveTo(x+size/phi*(1-1/phi)*Math.cos(-(90-ang-72)*Math.PI/180),y+size/phi*(1-1/phi)*Math.sin(-(90-ang-72)*Math.PI/180));
				c.arc(x,y,size/phi*(1-1/phi),-(90-ang-72)*Math.PI/180,-(90-ang+72)*Math.PI/180,false)
				x-=size/phi*Math.sin(coords[2][i]*Math.PI/180);
				y+=size/phi*Math.cos(coords[2][i]*Math.PI/180);
			}
		}
	}
	c.stroke();
	c.closePath();
	c.beginPath();
	c.strokeStyle="#000000";
	c.lineWidth=size/50;
	//draw the outlines
	for (var i=0; i<total; i++) {
		var x=coords[0][i];
		var y=coords[1][i];
		var ang=coords[2][i];
		if (coords[3][i]==0) {//draw a kite
			c.moveTo(x,y)
			c.lineTo(x+size*Math.sin((36+ang)*Math.PI/180),y-size*Math.cos((36+ang)*Math.PI/180));
			c.lineTo(x+size*Math.sin(ang*Math.PI/180),y-size*Math.cos(ang*Math.PI/180));
			c.lineTo(x-size*Math.sin((36-ang)*Math.PI/180),y-size*Math.cos((36-ang)*Math.PI/180));  
			c.lineTo(x,y);
		} else {//draw a dart
			c.moveTo(x,y)
			c.lineTo(x+size*Math.sin((36+ang)*Math.PI/180),y-size*Math.cos((36+ang)*Math.PI/180))
			c.lineTo(x+size*Math.sin(ang*Math.PI/180)/phi,y-size*Math.cos(ang*Math.PI/180)/phi)
			c.lineTo(x-size*Math.sin((36-ang)*Math.PI/180),y-size*Math.cos((36-ang)*Math.PI/180))
			c.lineTo(x,y);
		}
	}
	c.stroke();
	c.closePath();
}

function drawFixedHighlightedShapes(coords,total) {//draw all of the shapes
	c.beginPath();
	c.strokeStyle="#0000EE";
	c.lineCap="round";
	c.lineWidth=coords[4][0]/15;
	//draw the outlines
	for (var i=0; i<total; i++) {
		var x=coords[0][i];
		var y=coords[1][i];
		var ang=coords[2][i];
		if (coords[3][i]==0) {//draw a kite
			c.moveTo(x,y)
			if (fixedHighlightedShapeMap[0][i]==-1) {c.lineTo(x+coords[4][i]*Math.sin((36+ang)*Math.PI/180),y-coords[4][i]*Math.cos((36+ang)*Math.PI/180));}
			c.moveTo(x+coords[4][i]*Math.sin((36+ang)*Math.PI/180),y-coords[4][i]*Math.cos((36+ang)*Math.PI/180));
			if (fixedHighlightedShapeMap[1][i]==-1) {c.lineTo(x+coords[4][i]*Math.sin(ang*Math.PI/180),y-coords[4][i]*Math.cos(ang*Math.PI/180));}
			c.moveTo(x+coords[4][i]*Math.sin(ang*Math.PI/180),y-coords[4][i]*Math.cos(ang*Math.PI/180));
			if (fixedHighlightedShapeMap[2][i]==-1) {c.lineTo(x-coords[4][i]*Math.sin((36-ang)*Math.PI/180),y-coords[4][i]*Math.cos((36-ang)*Math.PI/180));}
			c.moveTo(x-coords[4][i]*Math.sin((36-ang)*Math.PI/180),y-coords[4][i]*Math.cos((36-ang)*Math.PI/180));
			if (fixedHighlightedShapeMap[3][i]==-1) {c.lineTo(x,y);}
		} else {//draw a dart
			c.moveTo(x,y)
			if (fixedHighlightedShapeMap[0][i]==-1) {c.lineTo(x+coords[4][i]*Math.sin((36+ang)*Math.PI/180),y-coords[4][i]*Math.cos((36+ang)*Math.PI/180));}
			c.moveTo(x+coords[4][i]*Math.sin((36+ang)*Math.PI/180),y-coords[4][i]*Math.cos((36+ang)*Math.PI/180));
			if (fixedHighlightedShapeMap[1][i]==-1) {c.lineTo(x+coords[4][i]*Math.sin(ang*Math.PI/180)/phi,y-coords[4][i]*Math.cos(ang*Math.PI/180)/phi);}
			c.moveTo(x+coords[4][i]*Math.sin(ang*Math.PI/180)/phi,y-coords[4][i]*Math.cos(ang*Math.PI/180)/phi);
			if (fixedHighlightedShapeMap[2][i]==-1) {c.lineTo(x-coords[4][i]*Math.sin((36-ang)*Math.PI/180),y-coords[4][i]*Math.cos((36-ang)*Math.PI/180));}
			c.moveTo(x-coords[4][i]*Math.sin((36-ang)*Math.PI/180),y-coords[4][i]*Math.cos((36-ang)*Math.PI/180));
			if (fixedHighlightedShapeMap[3][i]==-1) c.lineTo(x,y);
		}
	}
	c.stroke();
	c.closePath();
}


function moveShape(ang,x,y) {//move the current shape to where the cursor is
	shapeCoords[0][totalShapes]=x
	shapeCoords[1][totalShapes]=y
	shapeCoords[2][totalShapes]=ang
	if (drawKiteShape) {shapeCoords[3][totalShapes]=0} else {shapeCoords[3][totalShapes]=1}
}
