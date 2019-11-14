// utilities
var mathUtils = require('./../../../mathUtils.js').mathUtils;
var coloring = require('./../../../colorUtils.js').colorUtils;
var rgba = coloring.rgba;

// theme partials
var renderFn = require('./renderFn.js').renderFn;


var warpStarTheme = {
    contextBlendingMode: 'lighter',
    active: 1,
    life: { min: 50, max: 100 },
    angle: { min: 0, max: 2 },
    // velAcceleration: 1.05,
    velAcceleration: { min: 1.01, max: 1.5 },
    magDecay: 1,
    radius: { min: 0.2, max: 0.6 },
    targetRadius: { min: 2, max: 6 },
    applyGlobalForces: false,
    colorProfiles: [{ r: 255, g: 255, b: 255, a: 0 }, { r: 255, g: 255, b: 255, a: 1 }],
    renderProfiles: [{ shape: 'Circle', colorProfileIdx: 0 }, { shape: 'Circle', colorProfileIdx: 1 }, { shape: 'Circle', colorProfileIdx: 2 }],
    customAttributes: {
        lensFlare: {
            mightFlare: true,
            willFlare: false,
            angle: 1.50
        }
    },
    animationTracks: [
        {
            animName: 'radiusGrow',
            active: true,
            param: 'r',
            baseAmount: 'initR',
            targetValuePath: 'tR',
            duration: 'life',
            easing: 'linearEase',
            linkedAnim: false
        },
        {
            animName: 'fadeIn',
            active: true,
            param: 'globalAlpha',
            baseAmount: 'colorProfiles[0].a',
            targetValuePath: 'colorProfiles[1].a',
            duration: 'life',
            easing: 'linearEase',
            linkedAnim: false
        }
    ],
    killConditions: {
        boundaryCheck: true,
        boundaryOffset: 400,
        colorCheck: [],
        perAttribute: []
    },

    renderParticle: renderFn
};

module.exports.warpStarTheme = warpStarTheme;