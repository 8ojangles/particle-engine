// utilities
let mathUtils = require('./../../../mathUtils.js').mathUtils;
let trig = require('./../../../trigonomicUtils.js').trigonomicUtils;
let coloring = require('./../../../colorUtils.js').colorUtils;
let easing = require('./../../../easing.js').easingEquations;
let rgba = coloring.rgba;
let createWarpStarImage = require('./../../../createWarpStarImage.js');
let warpStarImage = createWarpStarImage();

let easeFn = easing.easeInExpo;

let easeStartVal = 0;
let easeDeltaVal = 2000;
let easeInputMaxVal = 10;

function memStretch( mag ) {
    // console.log( 'magnitude outside: ', magnitude );
    let cache = {};

    return ( function( mag ) {

        // stringify the mag number primitive for pointer selection 
        let magStr = mag.toString();
        console.log( 'magStr: ', magStr );
        if ( magStr in cache ) {
            // console.log( 'CACHED value' );
            return cache[ magStr ];
        } else {
            // console.log( 'NEW value' );
            let result = easeFn( mag, easeStartVal, easeDeltaVal, easeInputMaxVal );
            // console.log( 'magnitude.toString(): ', magnitude.toString() );
            cache[ magStr ] = result;
            return result;
        }

    })( mag );

}



const memoizedAdd = () => {
    let cache = {};
    return (n) => {
        if (n in cache) {
            console.log('Fetching from cache');
            return cache[n];
        } else {
            console.log('Calculating result');
            let result = n + 10;
            cache[n] = result;
            return result;
        }       
    }
}





renderFn: function renderFn(x, y, r, colorData, c ) {
    let p = this;
    let vel = parseFloat( p.relativeMagnitude.toFixed( 2 ) );
    let thisR = r * 2;

    // let stretchVal = mathUtils.map( vel, 0, 200, 1, 4000 );

    let stretchVal = easeFn( vel, easeStartVal, easeDeltaVal, easeInputMaxVal );
    // let stretchVal = memStretch( vel );

    let longR = r * stretchVal;
    // var stretchVal = ( r * ( ( 50 * vel ) * vel ) ) * vel;
    // var chromeVal = mathUtils.map(stretchVal, 0, 10, 1, 4);
    
    // context.save();
    // c.translate( x, y );
    // c.rotate( p.angle );

    let spinCos = Math.cos( p.angle );
    let spinSin = Math.sin( p.angle );

    c.setTransform( spinCos, spinSin, -spinSin, spinCos, x, y );
    // if ( p.idx === 9997 ) {
    //     console.log( p.idx + ' - '+ p.globalAlpha );
    // }
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
    // if ( p.idx === 9997 || p.idx === 9995 ) {
    //     console.log( p.idx + ' - '+ p.globalAlpha );
    // }
    // c.rotate( -p.angle );
    // c.translate( -x, -y );
}

module.exports.renderFn = renderFn;