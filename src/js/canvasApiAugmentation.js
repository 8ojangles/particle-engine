/**
* @description extends Canvas prototype with useful drawing mixins
* @kind constant
*/
var canvasDrawingApi = CanvasRenderingContext2D.prototype;

/**
* @augments canvasDrawingApi
* @description draw circle API
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.circle = function (x, y, r, context) {
	this.beginPath();
	this.arc(x, y, r, 0, Math.PI * 2, true);
};

/**
* @augments canvasDrawingApi
* @description API to draw filled circle
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.fillCircle = function (x, y, r, context) {
	this.circle(x, y, r, context);
	this.fill();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw stroked circle
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.strokeCircle = function (x, y, r, context) {
	context.circle(x, y, r, context);
	context.stroke();
	context.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.ellipse = function (x, y, w, h, context) {
	context.beginPath();
	for (var i = 0; i < Math.PI * 2; i += Math.PI / 16) {
		context.lineTo(x + Math.cos(i) * w / 2, y + Math.sin(i) * h / 2);
	}
	context.closePath();
};

/**
* @augments canvasDrawingApi
* @description API to draw filled ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.fillEllipse = function (x, y, w, h, context) {
	context.ellipse(x, y, w, h, context);
	context.fill();
	context.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw stroked ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.strokeEllipse = function (x, y, w, h) {
	this.ellipse(x, y, w, h);
	this.stroke();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw line between 2 vector coordinates.
* @param {number} x1 - X coordinate of vector 1.
* @param {number} y1 - Y coordinate of vector 1.
* @param {number} x2 - X coordinate of vector 2.
* @param {number} y2 - Y coordinate of vector 2.
*/
canvasDrawingApi.line = function (x1, y1, x2, y2, context) {
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
	context.beginPath();
};

module.exports.canvasDrawingApi = canvasDrawingApi;