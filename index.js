


function shape(mode, x, y) {
    this.mode = mode;
    this.x1 = x;
    this.y1 = y;
    this.sx = 0;
    this.sy = 0;
}
shape.prototype.selected = false;
shape.prototype.setSelected = function(x, y) { 
    this.selected = true;
    this.sx = x;
    this.sy = y;
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


    this.draw = function () {
        this.context.beginPath();
        this.context.strokeStyle = this.color;
        this.context.moveTo(this.x1, this.y1);
        this.context.lineTo(this.x2, this.y2);
        console.log(this.isSelected());
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
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.fill = fillC;
    this.width = outlineW;
    this.context = canvas.getContext("2d");
    this.side = this.x2 - this.x1;
    
    
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
    
    
    this.testHit = function (testX, testY)
    {
        var minX = Math.min(this.x1, this.x2);
        var maxX = Math.max(this.x1, this.x2);
        var minY = Math.min(this.y1, this.y2);
        var maxY = Math.max(this.y1, this.y2);
        if (testX >= minX && testX <= maxX && testY >= minY && testY <= maxY) return true;
        return false;
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
    this.context = canvas.getContext("2d");
    
    
	this.find_vertice = function () {
		this.x3 = (this.x2 - this.x1) / 2;
		
	}
	
	
	
    this.draw = function () {
        this.context.beginPath();
        this.context.strokeStyle = this.color;
        this.context.moveTo(this.x1, this.y1);
        this.context.lineTo(this.x2, this.y2);
        this.context.lineTo(this.x3, this.y3);
        this.context.lineTo(this.x1, this.y1);
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


function add(x1, y1, x2, y2, x3, y3)
{
    if (mode == "Line")
    {
        var newobj = new Line(mode, x1, y1, x3, y3, outlinecolor, outlinesize, canvas);
    }
    else if (mode == "Squ")
    {
        var newobj = new Squ(mode, x1, y1, x3, y3, outlinecolor, fillcolor, outlinesize, canvas);
    }
    else if (mode == "Tri")
    {
        var newobj = new Tri(mode, x1, y1, x2, y2, x3, y3, outlinecolor, fillcolor, outlinesize, canvas);
    }
    newobj.setUnselected();
    shapes.push(newobj);
    console.log("length: " + shapes.length);
}





	
function canvaDown(e) {
    x = e.clientX - canvas.offsetLeft;
    y = e.clientY - canvas.offsetTop;
    if (action != "select") {
		drawing = true;
		add(x, y, x, y, x, y);
		shapeDraw();
	} else if (action == "select") {
		for(var i=shapes.length-1; i>=0; i--) {
			var shape = shapes[i];
            //console.log(i);
			if (shape.testHit(x,y)) {
                console.log(i);
				//if (previouslySelectedShape != null)// previouslySelectedShape.setSelected(false);
				//previouslySelectedShape = shape;
                shapes.splice(i, 1);
				shape.setSelected(x, y);
                shapes.push(shape);
				
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
        moving = false;
        resizing = false;
	    x2 = e.clientX - canvas.offsetLeft;
        y2 = e.clientY - canvas.offsetTop;
	    shapes.pop();
        add(x, y, x, y, x2, y2);
	    shapeDraw();
    }
}


function interact(e)
{
	if (drawing){
        shapes.pop();
        add(x, y, x, y, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
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
        console.log("drawing " + i);
        shapes[i].draw();
        i++;
    }
}