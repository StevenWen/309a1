

function shape(mode, x, y) {
    this.mode = mode;
    this.x1 = x;
    this.y1 = y;
    this.mx = 0;
    this.my = 0;
}
shape.prototype.selected = false;
shape.prototype.setSelected = function(x, y) { 
    this.selected = true;
    this.mx = x;
    this.my = y;
}
shape.prototype.setUnselected = function() { this.selected = false;}
shape.prototype.isSelected = function() { return this.selected;}


function Line(mode, x1, y1, x2, y2, color, outlineW, canvas) {
    shape.call(this, mode, x1, y1);
    this.color = color;
    this.width = outlineW;
	this.x2 = x2;
	this.y2 = y2;
    this.context = canvas.getContext("2d");
    this.resize = 0;

    this.move = function (x, y) {
        this.x1 += (x - this.mx);
        this.y1 += (y - this.my);
        this.x2 += (x - this.mx);
        this.y2 += (y - this.my);
        this.mx = x;
        this.my = y;
    }


    this.resizeit = function (x, y) {
        if (this.resize == 1) {
            this.x1 = x;
            this.y1 = y;
        }
        else if (this.resize == 2) {
            this.x2 = x;
            this.y2 = y;
        }
    }


    this.draw = function () {
        this.context.beginPath();
        this.context.strokeStyle = this.color;
        this.context.moveTo(this.x1, this.y1);
        this.context.lineTo(this.x2, this.y2);
        if (this.isSelected())
        {
            
            this.context.lineWidth = 6;
        }
        else
        {
            this.context.lineWidth = this.width;
        }
        this.context.stroke();
        this.context.closePath();
    }
    
    
    this.testHitEdge = function (testX, testY) {
        if ((testY + 10 > this.y1 && testY - 10 < this.y1) && (testX + 10 > this.x1 && testX - 10 < this.x1)) {
            this.resize = 1;
            console.log("hit 1");
            return true;
        }
        else if ((testY + 10 > this.y2 && testY - 10 < this.y2) && (testX + 10 > this.x2 && testX - 10 < this.x2)) {
            this.resize = 2;
            console.log("hit 2");
            return true;
        }
        else {
            this.resize = 0;
            console.log("didn't hit");
            return false;
        }
    }
    
    this.testHit = function (testX, testY) {
        var minX = Math.min(this.x1, this.x2);
        var maxX = Math.max(this.x1, this.x2);
        var minY = Math.min(this.y1, this.y2);
        var maxY = Math.max(this.y1, this.y2);
        if ((testX >= minX - 3 && testX <= maxX + 3) && (testY >= minY - 3 && testY <= maxY + 3))
        {
            var b = Math.round((this.y2 - this.y1) / (this.x2 - this.x1) * (testX - this.x2) + this.y2);
            var a = Math.round((this.x2 - this.x1) / (this.y2 - this.y1) * (testY - this.y2) + this.x2);
            if ((testX <= a * 1.1 && testX >= a / 1.1) || (testY <= b * 1.1 && testY >= b / 1.1))
            {
                return true;
            }
        }
        return false;
    }
}
Line.prototype = new shape();
Line.prototype.constructor = Line;
	
	



function Squ(mode, x1, y1, x2, y2, color, fillC, outlineW, canvas)
{
    shape.call(this, mode, x1, y1);
    this.color = color;
    this.fill = fillC;
    this.width = outlineW;
    this.context = canvas.getContext("2d");
    this.side = x2 - this.x1;
    this.x2 = this.x1 + this.side;
    this.y2 = this.y1 + this.side;
    
    
    this.move = function (x, y) {
        this.x1 += (x - this.mx);
        this.y1 += (y - this.my);
        this.x2 += (x - this.mx);
        this.y2 += (y - this.my);
        this.mx = x;
        this.my = y;
    }

    this.draw = function ()
    {
        this.context.beginPath();
        this.context.fillStyle = this.fill;
        this.context.strokeStyle = this.color;
        this.context.globalAlpha = 0.85;
        this.context.rect(this.x1, this.y1, this.side, this.side);
        if (this.isSelected())
        {
            this.context.lineWidth = 6;
        }
        else
        {
            this.context.lineWidth = this.width;
        }
        this.context.fill();
        this.context.stroke();
    }
    
    this.testHitEdge = function(testX, testY)
    {
        console.log(testX + " " + testY);
        console.log(this.x2 + " " + this.y2);
        if ((testY + 10 > this.y1 && testY - 10 < this.y1) && (testX + 10 > this.x1 && testX - 10 < this.x1)) {
            this.resize = 1;
            return true;
        }
        else if ((testY + 10 > this.y2 && testY - 10 < this.y2) && (testX + 10 > this.x2 && testX - 10 < this.x2)) {
            this.resize = 2;
            return true;
        }
        else if ((testY + 10 > this.y1 && testY - 10 < this.y1) && (testX + 10 > this.x2 && testX - 10 < this.x2)) {
            this.resize = 3;
            return true;
        }
        else if ((testY + 10 > this.y2 && testY - 10 < this.y2) && (testX + 10 > this.x1 && testX - 10 < this.x1)) {
            this.resize = 4;
            return true;
        }
        else {
            this.resize = 0;
            return false;
        }
    }


    this.resizeit = function (x, y) {
        console.log(this.resize);
        if (this.resize == 1) {            
            this.side = this.x2 - x;
            this.x1 = this.x2 - this.side;
            this.y1 = this.y2 - this.side;
        }
        else if (this.resize == 2) {
            this.side = x - this.x1;
            this.x2 = this.x1 + this.side;
            this.y2 = this.y1 + this.side;
        }
        else if (this.resize == 3) {
            this.side = x - this.x1;
            this.x2 = this.x1 + this.side;
            this.y1 = this.y2 - this.side;
        }
        else if (this.resize == 4) {
            this.side = this.x2 - x;
            this.x1 = this.x2 - this.side;
            this.y2 = this.y1 + this.side;
        }

    }

    this.testHit = function (testX, testY)
    {
        var minX = Math.min(this.x1, this.x2);
        var maxX = Math.max(this.x1, this.x2);
        var minY = Math.min(this.y1, this.y2);
        var maxY = Math.max(this.y1, this.y2);
        console.log("x " + minX + " "  + maxX);
        console.log("y " + minX + " "  + maxX);
        console.log(testX + " " + testY);
        if (testX >= minX && testX <= maxX && testY >= minY && testY <= maxY) {
            console.log("true");
            return true;
        } 
        else {
            return false;
        }
    }
}
Squ.prototype = new shape();
Squ.prototype.constructor = Squ;





function Tri(mode, x1, y1, x2, y2, color, fillC, outlineW, canvas)
{
    shape.call(this, mode, x1, y1);
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.fill = fillC;
    this.width = outlineW;
	
    this.x3 = Math.round(this.x1 + (this.x2 - this.x1) / 2);
	this.y3 = Math.round(this.y1 * 2);
    this.context = canvas.getContext("2d");

	
	
	
    this.draw = function () {
	
        this.context.beginPath();
        this.context.strokeStyle = this.color;
        this.context.moveTo(this.x1, this.y1);
        this.context.lineTo(this.x2, this.y2);
        this.context.lineTo(this.x3, this.y3);
        this.context.lineTo(this.x1, this.y1);
		this.context.fill();
        if (this.isSelected())
        {
            this.context.lineWidth = 6;
        }
        else
        {
            this.context.lineWidth = this.width;
        }
        this.context.stroke();
        this.context.closePath();
    }
    
    
    
    this.testHit = function (testX, testY)
    {
       return false
    }
}
Tri.prototype = new shape();
Tri.prototype.constructor = Tri;



var action;
var mode;
var subaction;
var outlinecolor;
var outlinesize;
var fillcolor;
var color;
var sizeMarker;
var preoutlinesize;
var canvas;
var ctx;
var drawing;
var x, y;
var previouslySelectedShape = null;
var shapes = [];
var objcopy;
var moving;
var resizing;
var translate;



window.onload = function () {
		mode = "Line";
		action = "addShape";
    	fillcolor = "Blue";
    	outlinesize = 1;
    	outlinecolor = "black";
		canvas = document.getElementById("myCanvas");
		context = canvas.getContext("2d");
		canvas.onmousedown = canvaDown;
    	canvas.onmouseup = canvasRelease;
    	canvas.onmousemove = interact; 	
	
	}

function setMode(shape_to_draw) {
	mode = shape_to_draw;
	action = "addShape";
}

function setAction(action_wanted) {
	action = action_wanted;
}


function add(x1, y1, x2, y2)
{
    if (mode == "Line")
    {
        var newobj = new Line(mode, x1, y1, x2, y2, outlinecolor, outlinesize, canvas);
    }
    else if (mode == "Squ")
    {
        var newobj = new Squ(mode, x1, y1, x2, y2, outlinecolor, fillcolor, outlinesize, canvas);
    }
    else if (mode == "Tri")
    {
        var newobj = new Tri(mode, x1, y1, x2, y2, outlinecolor, fillcolor, outlinesize, canvas);
    }
    newobj.setUnselected();
    shapes.push(newobj);
}





	
function canvaDown(e) {
    x = e.clientX - canvas.offsetLeft;
    y = e.clientY - canvas.offsetTop;
    if (action != "select") {
		drawing = true;
		add(x, y, x, y);
		shapeDraw();
	} else if (action == "select") {        
        sel = false;
		for(var i=shapes.length-1; i>=0; i--) {
			var shape = shapes[i];
            console.log(shape.testHit(x,y));
			if (shape.testHit(x,y) && !sel) {
				//if (previouslySelectedShape != null)// previouslySelectedShape.setSelected(false);
				//previouslySelectedShape = shape;

                shapes.splice(i, 1);
				shape.setSelected(x, y);
                shapes.push(shape);                
				sel = true;
                if (shape.testHitEdge(x, y)) {
                    console.log("resizing");
                    resizing = true;
                }
                else {
                    moving = true;
                }                
			}
            else {
                shape.setUnselected();
            }
		}

        shapeDraw();
	}
}


function canvasRelease(e)
{
    if (drawing) {
        drawing = false;
	    x2 = e.clientX - canvas.offsetLeft;
        y2 = e.clientY - canvas.offsetTop;
	    shapes.pop();
        add(x, y, x2, y2);
	    shapeDraw();
    }
    else if (moving) {
        moving = false;
    }
    else if (resizing) {
        resizing = false;
    }
}


function interact(e)
{

	if (drawing) {
        shapes.pop();
        add(x, y, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        shapeDraw();
	}
    else if (moving) {

        last = shapes.length - 1;
        shapes[last].move(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        shapeDraw();
    }
    else if (resizing) {
        last = shapes.length - 1;
        shapes[last].resizeit(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        shapeDraw();
    }
}


function clearerase()
{

    for (var i = shapes.length - 1; i >= 0; i--)
    {
        if (shapes[i].isSelected())
        {
            shapes.splice(i, 1);
            shapeDraw();
            return;
        }
    }


    shapes = [];
    shapeDraw();

}

	


function shapeDraw()
{
	
	
    context.clearRect(0, 0, canvas.width, canvas.height);
    var i = 0;
    while (i < shapes.length)
    {
        shapes[i].draw();
        i++;
    }
}
