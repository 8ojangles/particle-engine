// utilities
var mathUtils = require('./../../../mathUtils.js').mathUtils;
var trig = require('./../../../trigonomicUtils.js').trigonomicUtils;
var coloring = require('./../../../colorUtils.js').colorUtils;

var rgba = coloring.rgba;
let createWarpStarImage = require('./../../../createWarpStarImage.js');
let warpStarImage = createWarpStarImage();

renderFn: function renderFn(x, y, r, colorData, c ) {
    var p = this;
    let vel = p.relativeMagnitude;
    let thisR = r + ( r * vel ) ;

    // var stretchVal = mathUtils.map( p.vel, 0, 200, 1, 400);
    var stretchVal = ( r * ( 5 * vel ) ) * vel;
    // var chromeVal = mathUtils.map(stretchVal, 0, 10, 1, 4);
    
    // context.save();
    // c.translate( x, y );
    // c.rotate( p.angle );

    let spinCos = Math.cos( p.angle );
    let spinSin = Math.sin( p.angle );

    c.setTransform( spinCos, spinSin, -spinSin, spinCos, x, y );

    c.globalAlpha = p.globalAlpha;
    // c.globalAlpha = 1;
    let renderProps = warpStarImage.renderProps;

    c.drawImage(
        warpStarImage,
        0, 0, renderProps.src.w, renderProps.src.h,
        0, -( thisR / 2 ), stretchVal, thisR
    );

    c.resetTransform();
    c.globalAlpha = 1;

    // c.rotate( -p.angle );
    // c.translate( -x, -y );
}

module.exports.renderFn = renderFn;