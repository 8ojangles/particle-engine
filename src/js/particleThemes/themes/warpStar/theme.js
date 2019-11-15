// utilities
var mathUtils = require('./../../../mathUtils.js').mathUtils;
var coloring = require('./../../../colorUtils.js').colorUtils;
var rgba = coloring.rgba;

// theme partials
var renderFn = require('./renderFn.js').renderFn;
var animationTracks = require('./animationTracks.js').animationTracks;
var killConditions = require('./killConditions.js').killConditions;
var customAttributes = require('./customAttributes.js').customAttributes;
var linkCreationAttributes = require('./linkCreationAttributes.js').linkCreationAttributes;
var renderProfiles = require('./renderProfiles.js').renderProfiles;
var colorProfiles = require('./colorProfiles.js').colorProfiles;

var warpStarTheme = {
    contextBlendingMode: 'lighter',
    active: 1,
    life: { min: 50, max: 100 },
    angle: { min: 0, max: 2 },
    // velAcceleration: 1.05,
    velAcceleration: { min: 1.001, max: 1.25 },
    magDecay: 1,
    radius: { min: 0.2, max: 0.6 },
    targetRadius: { min: 2, max: 6 },
    linkCreationAttributes: linkCreationAttributes, 
    applyGlobalForces: false,
    colorProfiles: colorProfiles,
    renderProfiles: renderProfiles,
    customAttributes: customAttributes,
    animationTracks: animationTracks,
    killConditions: killConditions,
    renderParticle: renderFn
};

module.exports.warpStarTheme = warpStarTheme;