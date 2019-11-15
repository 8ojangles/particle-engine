// utilities
var mathUtils = require('./../../../mathUtils.js').mathUtils;
var trig = require('./../../../trigonomicUtils.js').trigonomicUtils;
var coloring = require('./../../../colorUtils.js').colorUtils;

var rgba = coloring.rgba;
let createWarpStarImage = require('./../../../createWarpStarImage.js');
let warpStarImage = createWarpStarImage();

renderFn: function renderFn(x, y, r, colorData, context) {
    var p = this;
    let vel = p.relativeMagnitude;
    let thisR = (r/4) * vel;

    // var stretchVal = mathUtils.map( p.vel, 0, 200, 1, 400);
    var stretchVal = (r*20) * vel;
    // var chromeVal = mathUtils.map(stretchVal, 0, 10, 1, 4);
    
    // context.save();
    context.translate( x, y );
    context.rotate( p.angle );

    context.globalAlpha = p.globalAlpha;
    let renderProps = warpStarImage.renderProps;

    context.drawImage(
        warpStarImage,
        0, 0, renderProps.src.w, renderProps.src.h,
        0, -( thisR / 2 ), stretchVal, thisR
    );

    // context.globalAlpha = 1;

    context.rotate( -p.angle );
    context.translate( -x, -y );

}

module.exports.renderFn = renderFn;