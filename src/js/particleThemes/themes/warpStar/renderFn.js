// utilities
let mathUtils = require('./../../../mathUtils.js').mathUtils;
let trig = require('./../../../trigonomicUtils.js').trigonomicUtils;
let coloring = require('./../../../colorUtils.js').colorUtils;
let easing = require('./../../../easing.js').easingEquations;
let rgba = coloring.rgba;
let createWarpStarImage = require('./../../../createWarpStarImage.js');
let warpStarImage = createWarpStarImage();

renderFn: function renderFn(x, y, r, colorData, c ) {
    let p = this;
    let vel = p.relativeMagnitude;
    let thisR = r * 2;

    // let stretchVal = mathUtils.map( vel, 0, 200, 1, 4000 );

    let stretchVal = easing.easeInExpo( vel, 0, 2000, 20 );


    let longR = r * stretchVal;
    // var stretchVal = ( r * ( ( 50 * vel ) * vel ) ) * vel;
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
        0, -( thisR / 2 ), longR, thisR
    );

    c.resetTransform();
    c.globalAlpha = 1;
    if ( p.idx === 9997 || p.idx === 9995 ) {
        console.log( p.idx + ' - '+ p.globalAlpha );
    }
    // c.rotate( -p.angle );
    // c.translate( -x, -y );
}

module.exports.renderFn = renderFn;