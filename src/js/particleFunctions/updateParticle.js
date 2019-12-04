var easing = require('./../easing.js').easingEquations;
var environment = require('./../environment.js').environment;
var trig = require('./../trigonomicUtils.js').trigonomicUtils;
var physics = environment.forces;

var updateParticle = function updateParticle( emitterArr ) {
    var p = this;
    var totalLifeTicks = p.lifeSpan;

    // position
    // p.x += p.xVel * p.magnitudeDecay;
    // p.y += p.yVel * p.magnitudeDecay;
    p.x += p.xVel;
    p.y += p.yVel;

    // p.vel = trig.dist( p.xOld, p.yOld, p.x, p.y );

    p.xOld = p.x;
    p.yOld = p.y;

    p.xVel *= p.vAcc;
    p.yVel *= p.vAcc;

    // p.yVel += physics.gravity;
    // p.xVel += physics.wind;
    // p.relativeMagnitude *= p.magnitudeDecay;

    // p.relativeMagnitude *= p.vAcc * 1.005;
    p.relativeMagnitude *= p.vAcc;
    
    if (p.applyForces) {
        p.yVel += physics.gravity;
    }
    // speed
    // p.magnitudeDecay > 0 ? p.magnitudeDecay -= physics.friction : p.magnitudeDecay = 0;

    // p.magnitudeDecay += (p.vAcc * 0.00025);
    // p.magnitudeDecay = deccelerateMagnitude( p );
    // p.magnitudeDecay = accelerateMagnitude( p );

    // life
    p.currLifeInv = totalLifeTicks - p.currLife;
    var currLifeTick = p.currLifeInv;
    // size (radius for circle)


    var animTracks = p.animationTracks;
    var animTracksLen = animTracks.length;

    let thisAnim = p.animationTracks[ 0 ];

    if ( thisAnim.active === true ) {

        if ( thisAnim.currTick == 0 ) {
            // console.log( 'anim start');
            p[ thisAnim.param.path[ 0 ] ] = thisAnim.baseAmount;
        } else {
            // console.log( 'anim progress');
            p[ thisAnim.param.path[ 0 ] ] = easing[ thisAnim.easing ]( thisAnim.currTick, thisAnim.baseAmount, thisAnim.targetAmount, thisAnim.duration );
        }
        

        if ( p.idx == 9987 ) {
            // console.log( 'thisValue: ', thisValue );
            // console.log( 'thisAnim.param.path[ 0 ]: ', thisAnim.param.path[ 0 ] );
            // console.log( 'thisAnim.baseAmount: ', thisAnim.baseAmount );
            // console.log( 'thisAnim.targetValuePath: ', thisAnim.targetAmount );
            // console.log( 'thisAnim.duration: ', thisAnim.duration );
        }

        // console.log( 'thisValue: ', thisValue );
        // p[ thisAnim.param.path[ 0 ] ] = thisValue;

        thisAnim.currTick++;

        if ( thisAnim.currTick >= thisAnim.duration ) {
            thisAnim.active = false;
        }
    }



    // if ( animTracks && animTracksLen > 0 ) {
    //     for ( var i = animTracksLen - 1; i >= 0; i-- ) {
    //         // console.log( 'i', i );
    //         var t = animTracks[ i ];

    //         if ( t.active === true ) {

    //             var paramPath = t.param.path,
    //                 paramLen = t.param.pathLen,
    //                 currTick = t.currTick;

    //             paramLen === 1 ? 
    //                 p[paramPath[ 0 ] ] = easing[ t.easing ]( currTick, t.baseAmount, t.targetAmount, t.duration ) :

    //                     paramLen === 2 ?
    //                         p[ paramPath[ 0 ] ][ paramPath[ 1 ] ] = easing[ t.easing ](currTick, t.baseAmount, t.targetAmount, t.duration ) :

    //                             paramLen === 3 ? p[ paramPath[ 0 ] ][ paramPath[ 1 ] ][ paramPath[ 2 ] ] = easing[ t.easing ]( currTick, t.baseAmount, t.targetAmount, t.duration ) :
    //                             false;


    //             t.currTick++;

    //             if (currTick >= t.duration) {
    //                 t.active = false;

    //                 if (t.linkedEvent !== false && typeof t.linkedEvent !== 'undefined') {

    //                     let particleEvents = p.events;

    //                     for (let j = particleEvents.length - 1; j >= 0; j--) {

    //                         let thisParticleEvent = p.events[ j ];
    //                         if (thisParticleEvent.eventType = t.linkedEvent) {
    //                             if (t.linkedEvent === 'emit') {

    //                                 let thisParticleEventParams = thisParticleEvent.eventParams;

    //                                 if ( typeof thisParticleEventParams.emitter !== 'undefined' ) {
    //                                     thisParticleEventParams.emitter.triggerEmitter({ x: p.x, y: p.y });
    //                                 } else {
    //                                     for (let k = emitterArr.length - 1; k >= 0; k--) {
    //                                         if (emitterArr[ k ].name === thisParticleEventParams.emitterName) {
    //                                             thisParticleEventParams.emitter = emitterArr[ k ];
    //                                             thisParticleEventParams.emitter.triggerEmitter({ x: p.x, y: p.y });
    //                                         }
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }

    //                 // if ( p.idx == 9987 ) {
    //                 //     console.warn( 'p.vel: ', p.vel );
    //                 // }

    //                 if ( t.linkedAnim !== false ) {

    //                     for ( let l = animTracksLen - 1; l >= 0; l-- ) {
    //                         if ( animTracks[ l ].animName === t.linkedAnim ) {
    //                             animTracks[ l ].active = true;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    // if ( p.idx == 9987 ) {
    //     console.log( 'p.vel',  p.vel );
    // }

    // life taketh away
    p.currLife--;
};

module.exports.updateParticle = updateParticle;