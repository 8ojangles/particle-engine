let trig = require('./../trigonomicUtils.js').trigonomicUtils;
let mathUtils = require('./../mathUtils.js').mathUtils;
let getValue = require('./../utilities.js').getValue;

let PI = Math.PI;
let rand = mathUtils.random;

function createAnimationTracks( arr, ppa ) {
    var animArr = [];
    var splChrs = '.';

    if (arr && arr.length > 0) {
        let arrLen = arr.length;
        for (let i = arrLen - 1; i >= 0; i--) {

            var t = arr[i];
            var prm = t.param.split(splChrs);
            var prmTemp = { path: prm, pathLen: prm.length };
            var baseVal = getValue( t.baseAmount, ppa );
            var targetVal = void 0;
            
            if ( t.targetValuePath ) {

                if ( getValue( t.targetValuePath, ppa ) === 0 ) {
                    targetVal = baseVal * -1;
                } else {
                    targetVal = getValue( t.targetValuePath, ppa ) - baseVal;
                }
            } else if ( t.targetAmount ) {
                targetVal = t.targetAmount;
            }

            var duration = void 0;
            let life = ppa.lifeSpan;
            t.duration === 'life' ? duration = life : t.duration < 1 ? duration = life * t.duration : t.duration > 1 ? duration = life : false;

            animArr.push(
                { animName: t.animName, active: t.active, param: prmTemp, baseAmount: baseVal, targetAmount: targetVal, duration: duration, easing: t.easing, linkedAnim: t.linkedAnim, linkedEvent: t.linkedEvent }
            );
        }

        return animArr;
    }

    return false;

};



var createPerParticleAttributes = function createPerParticleAttributes(x, y, emissionOpts, perParticleOpts) {
    // let themed = perParticleOpts.theme || themes.reset;

    // direct particle options from theme
    var themed = perParticleOpts || themes.reset;
    var emitThemed = emissionOpts || false;
    var lifeSpan = mathUtils.randomInteger(themed.life.min, themed.life.max);
    // use bitwise to check for odd/even life vals. Make even to help with anims that are fraction of life (frames)
    lifeSpan & 1 ? lifeSpan++ : false;

    // emmiter based attributes
    var emission = emitThemed.emission || emitThemed;
    
    let dir = emission.direction;
    var direction = dir.rad > 0 ? dir.rad : mathUtils.getRandomArbitrary(dir.min, dir.max) * PI;
    
    let imp = emission.impulse;
    var impulse = imp.pow > 0 ? imp.pow : rand( imp.min, imp.max);

    // set new particle origin dependent on the radial displacement
    if (emission.radialDisplacement > 0) {
        var newCoords = trig.radialDistribution(x, y, emission.radialDisplacement + rand( emission.radialDisplacementOffset * -1, emission.radialDisplacementOffset), direction);

        x = newCoords.x;
        y = newCoords.y;
    }

    var velocities = trig.calculateVelocities(x, y, direction, impulse);

    
    // theme based attributes

    var initR = rand( themed.radius.min, themed.radius.max );
    var acceleration = rand( themed.velAcceleration.min, themed.velAcceleration.max );
    var targetRadius = rand( themed.targetRadius.min, themed.targetRadius.max) ;

    let tempStore = {};
    // console.log( 'themed.linkCreationAttributes: ', themed.linkCreationAttributes );
    if ( themed.linkCreationAttributes && themed.linkCreationAttributes.length > 0 ) {
        // console.log( 'themed.linkCreationAttributes true: ');
        // console.log( 'themed.linkCreationAttributes: ', themed.linkCreationAttributes );
        let linkCreationAttributesLen = themed.linkCreationAttributes.length;
        for ( let i = linkCreationAttributesLen - 1; i >= 0; i-- ) {

            let thisLink = themed.linkCreationAttributes[ i ];

            let srcAttr = thisLink.src;
            let targetAttr = thisLink.target;
            let attr = thisLink.attr;

            tempStore[ attr ] = {
                value: mathUtils.map(
                    acceleration,
                    themed[ srcAttr ].min, themed[ srcAttr ].max,
                    themed[ targetAttr ].min, themed[ targetAttr ].max
                      )
            }

        }


    } else {
        // console.log( 'themed.linkCreationAttributes false: ');
    }


    var initColor = themed.colorProfiles[0];
    var color4Data = { r: initColor.r, g: initColor.g, b: initColor.b, a: initColor.a };

    var willFlare = void 0;
    var willFlareTemp = mathUtils.randomInteger(0, 1000);

    var tempCustom = {
        lensFlare: {
            mightFlare: true,
            willFlare: themed.customAttributes.lensFlare.mightFlare === true && willFlareTemp < 10 ? true : false,
            angle: 0.30
        }

        // let customAttributes = themed.customAttributes;
    };

    // let tempCheck = tempStore.targetRadius ? true : false;
    // if ( tempCheck ) {
    //     console.log( 'temp target radius exists' );
    // } else {
    //     console.log( 'temp target radius NOT exists' );
    // }

    var ppa = {
        active: perParticleOpts.active || themed.active || 0,
        initR: tempStore.initR ? tempStore.initR.value : initR,
        targetRadius: tempStore.targetRadius ? tempStore.targetRadius.value : targetRadius,
        lifeSpan: tempStore.lifeSpan ? tempStore.lifeSpan.value : lifeSpan,
        angle: direction,
        magnitude: impulse,
        relativeMagnitude: impulse,
        magnitudeDecay: themed.magDecay,
        x: x,
        y: y,
        xOld: x,
        yOld: y,
        vel: 0,
        xVel: velocities.xVel,
        yVel: velocities.yVel,
        vAcc: acceleration,
        applyForces: themed.applyGlobalForces,
        color4Data: {
            r: color4Data.r, g: color4Data.g, b: color4Data.b, a: color4Data.a
        },
        colorProfiles: themed.colorProfiles,

        // color4Change: color4Change,
        killConditions: themed.killConditions,
        customAttributes: tempCustom,
        // renderFN: themed.renderParticle || renderParticle,
        renderFN: themed.renderParticle,
        events: themed.events
    };

    ppa.animationTracks = createAnimationTracks( themed.animationTracks, ppa );

    return ppa;
};

module.exports.createPerParticleAttributes = createPerParticleAttributes;