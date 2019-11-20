// dependencies

// NPM
var LinkedList = require('dbly-linked-list');
var objectPath = require("object-path");

// Custom Requires
var mathUtils = require('./mathUtils.js').mathUtils;
var trig = require('./trigonomicUtils.js').trigonomicUtils;
var drawing = require('./canvasApiAugmentation.js').canvasDrawingApi;
var coloring = require('./colorUtils.js').colorUtils;
var easing = require('./easing.js').easingEquations;
var animation = require('./animation.js').animation;
var debugConfig = require('./debugUtils.js');
var debug = debugConfig.debug;
var lastCalledTime = debugConfig.lastCalledTime;
var environment = require('./environment.js').environment;
var physics = environment.forces;
var runtimeEngine = environment.runtimeEngine;

// Particle engine machinery
var EmitterEntity = require('./EmitterEntity.js').EmitterEntity;
var EmitterStoreFn = require('./emitterStore.js').EmitterStoreFn;
var particleFn = require('./particleFn.js').particleFn;
var particleArrFn = require('./particleArrFn.js').particleArrFn;

// Emitter themes
var singleBurstTheme = require('./emitterThemes/singleBurstTheme/singleBurstTheme.js').singleBurstTheme;
var baseEmitterTheme = require('./emitterThemes/baseEmitter/baseEmitterTheme.js').baseEmitterTheme;
var warpStreamTheme = require('./emitterThemes/warpStream/warpStreamTheme.js').warpStreamTheme;
var flameStreamTheme = require('./emitterThemes/flameStream/flameStreamTheme.js').flameStreamTheme;
var smokeStreamTheme = require('./emitterThemes/smokeStream/smokeStreamTheme.js').smokeStreamTheme;

// particle themes
var themes = require('./particleThemes/themes.js').themes;


// cache canvas w/h
let canW = window.innerWidth;
let canH = window.innerHeight;
let canvasCentreH = canW / 2;
let canvasCentreV = canH / 2;

let blitCanvas = document.createElement('canvas');
let blitCtx = blitCanvas.getContext("2d" );
blitCanvas.id = 'blitterCanvas';
blitCanvas.width = canW;
blitCanvas.height = canH;
// blitCtx.filter = "blur(1px)";
blitCanvas.imageSmoothingEnabled = true;

let canvas = document.querySelector("#test-base");
let ctx = canvas.getContext("2d", { alpha: false } );
canvas.width = canW;
canvas.height = canH;
ctx.imageSmoothingEnabled = true;

var canvasConfig = {
    width: canW,
    height: canH,
    centerH: canvasCentreH,
    centerV: canvasCentreV,

    bufferClearRegion: {
        x: canvasCentreH,
        y: canvasCentreV,
        w: 0,
        h: 0
    }
};

var bufferClearRegion = {
    x: canvasCentreH,
    y: canvasCentreV,
    w: 0,
    h: 0

    // emitter store
};

var emitterStore = [];
// particle store
var entityStore = [];
// particle store meta data
var entityPool = new LinkedList();
var liveEntityCount = 0;

var runtimeConfig = {

    globalClock: 0,
    globalClockTick: function globalClockTick() {
        this.globalClock++;
    },

    emitterCount: 0,
    activeEmitters: 0,

    liveEntityCount: 0,
    subtract: function subtract(amount) {
        this.liveEntityCount -= amount;
    }
};

// pre-populate entityStore
var entityPopulation = 10000;
for (var i = 0; i < entityPopulation; i++) {
    // console.log( "populating entityStore with pInstance '%d': ", i );
    // pInstance.idx = i;
    // console.log( "pInstance.idx '%d'", pInstance.idx )
    entityStore.push(createLiveParticle(0, 0, i, baseEmitterTheme, themes.reset));
    entityPool.insert('' + i);
}

// global counter
var globalClock = 0;
var counter = 0;

// set default variables 
var mouseX = void 0,
    mouseY = void 0,
    runtime = void 0,
    pLive = void 0;
    
// let currTheme = themes.fire;
// var currTheme = themes.flame;
let currTheme = themes.warpStar;
// let currTheme = themes.smoke;

// let currEmitterTheme = singleBurstTheme;
let currEmitterTheme = warpStreamTheme;
// var currEmitterTheme = flameStreamTheme;

var currEmmissionType = {
    mouseClickEvent: false,
    randomBurst: false,
    steadyStream: true
};


let holeGrad = ctx.createRadialGradient( canvasCentreH, canvasCentreV, 0, canvasCentreH, canvasCentreV, 200 );
holeGrad.addColorStop( 0, 'rgba( 0, 0, 0, 1 )' );
holeGrad.addColorStop( 1, 'rgba( 0, 0, 0, 0 )' );

let streamEmmisionLimiter = false;

// canvas click handler
function registerMouseClickEmmision() {
    canvas.addEventListener('click', function (event) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;

        // testEmitter.resetEmissionValues();
        // testEmitter.triggerEmitter( { x: mouseX, y: mouseY } );

        var testEmitter = new EmitterEntity('testEmitter', currEmitterTheme, currTheme, emitEntities);

        emitterStore.push(testEmitter);

        testEmitter.triggerEmitter({
            x: canvasConfig.centerH,
            y: canvasConfig.centerV
        });

        if (animation.state !== true) {
            animation.state = true;
            update();
        }
    });
}

if (currEmmissionType.mouseClickEvent) {
    registerMouseClickEmmision();
}

if (currEmmissionType.steadyStream) {
    var testEmitter = new EmitterEntity('testEmitter', currEmitterTheme, currTheme, emitEntities);
    emitterStore.push(testEmitter);
    testEmitter.triggerEmitter({
        x: canvasConfig.centerH,
        y: canvasConfig.centerV
    });

    if (animation.state !== true) {
        animation.state = true;
        update();
    }
}


var smokeEmitter = new EmitterEntity('smokeEmitter', smokeStreamTheme, themes.smoke, emitEntities);
emitterStore.push(smokeEmitter);

// particle methods fN
function renderParticle(x, y, r, colorData, context, mathUtils) {
    var p = this;
    // console.log( 'p.render: ', p );
    var compiledColor = "rgba(" + colorData.r + ',' + colorData.g + ',' + colorData.b + "," + colorData.a + ")";
    context.fillStyle = compiledColor;
    context.fillCircle(x, y, r, context);
}

function setParticleAttributes(p, ppa) {

    p.isAlive = ppa.active;
    p.lifeSpan = ppa.lifeSpan;
    p.currLife = ppa.lifeSpan;
    p.currLifeInv = 0;
    p.x = ppa.x;
    p.y = ppa.y;
    p.xVel = ppa.xVel;
    p.yVel = ppa.yVel;
    p.vAcc = ppa.vAcc;
    p.initR = ppa.initR;
    p.r = ppa.initR;
    p.tR = ppa.tR;
    p.angle = ppa.angle;
    p.magnitude = ppa.magnitude;
    p.relativeMagnitude = ppa.magnitude;
    p.magnitudeDecay = ppa.magnitudeDecay;
    p.entityType = 'none';
    p.applyForces = ppa.applyForces;
    p.color4Data = ppa.color4Data;
    p.colorProfiles = ppa.colorProfiles;
    p.killConditions = ppa.killConditions;
    p.customAttributes = ppa.customAttributes;
    p.animationTracks = ppa.animationTracks;
    p.update = particleFn.updateParticle;
    p.reincarnate = reincarnateParticle;
    p.kill = particleFn.killParticle;
    p.render = ppa.renderFN;
    p.events = ppa.events;
}

// particle fN
function createLiveParticle(thisX, thisY, idx, emissionOpts, particleOpts) {

    var newParticle = {};
    newParticle.idx = idx;
    setParticleAttributes( newParticle, particleFn.createPerParticleAttributes( thisX, thisY, emissionOpts, particleOpts ) );
    return newParticle;
}

function reincarnateParticle(thisX, thisY, emissionOpts, particleOptions) {
    setParticleAttributes(this, particleFn.createPerParticleAttributes(thisX, thisY, emissionOpts, particleOptions));
}

// emmision fN
function emitEntities(x, y, count, emissionOptions, particleOptions) {
    var entityStoreLen = entityStore.length;
    var addedNew = 0;
    var addedFromPool = 0;
    var theta;

    // console.log( "emmiting a total of: '%d' particles", count );
    runtimeConfig.liveEntityCount += count;
    for ( let i = count - 1; i >= 0; i-- ) {

        if (entityPool.getSize() > 0) {
            entityStore[ entityPool.getTailNode().getData() ].reincarnate( x, y, emissionOptions, particleOptions );
            addedFromPool++;
            entityPool.remove();
        } else {
            entityStore.push( createLiveParticle( x, y, entityStoreLen, emissionOptions, particleOptions ) );
            entityPool.insert('' + entityStoreLen);
            addedNew++;
            entityStoreLen++;
        }
    }
    // console.log( "addedFromPool: '%d', addedNew: '%d'", addedFromPool, addedNew );
    // console.warn( 'addedNew: ', addedNew );
}

function updateEmitterStoreMembers() {

    for ( let i = emitterStore.length - 1; i >= 0; i-- ) {
        emitterStore[ i ].updateEmitter();
        // emitterStore[i].renderEmitter( ctx );
    }
}

// runtime fN members
function displayDebugging() {
    // ctx.globalAlpha = 1;
    // debug.debugOutput(canvas, ctx, 'Animation Counter: ', counter, 0);
    // debug.debugOutput(canvas, ctx, 'Particle Pool: ', entityStore.length, 1);
    // debug.debugOutput(canvas, ctx, 'Live Entities: ', runtimeConfig.liveEntityCount, 2, { min: entityStore.length, max: 0 });
    debug.debugOutput(canvas, ctx, 'FPS: ', Math.round(debug.calculateFps()), 3, { min: 0, max: 60 });
}


function updateCycle() {

    // if ( currEmmissionType.steadyStream === true ) {
    //     if ( streamEmmisionLimiter === false ) {
    //         testEmitter.triggerEmitter({
    //             x: canvasConfig.centerH,
    //             y: canvasConfig.centerV
    //         });
    //         streamEmmisionLimiter = true;
    //         animation.state = true;
    //     }
    // }


    // rendering
    
    particleArrFn.renderParticleArr( blitCtx, entityStore, animation );
    // blitCtx.filter = "blur(0px)";
    // blit to onscreen
    ctx.drawImage( blitCanvas, 0, 0 );
    // ctx.fillStyle = holeGrad;
    // ctx.fillCircle( canvasCentreH, canvasCentreV, 200 );

    // updating
    particleArrFn.updateParticleArr( entityStore, entityPool, animation, canvasConfig, runtimeConfig, emitterStore );

    updateEmitterStoreMembers();

}

function clearCanvas( ctx ) {

    // cleaning
    ctx.fillStyle = 'black';
    ctx.fillRect( 0, 0, canW, canH );
    // ctx.clearRect( 0, 0, canW, canH );
    // ctx.clearRect( bufferClearRegion.x, bufferClearRegion.y, bufferClearRegion.w, bufferClearRegion.h );
    blitCtx.clearRect( 0, 0, canW, canH );


    // ctx.fillStyle = 'rgba( 0, 0, 0, 0.1 )';
    // ctx.fillRect( 0, 0, canW, canH );

    // set dirty buffer
    // resetBufferClearRegion();
}

/////////////////////////////////////////////////////////////
// runtime
/////////////////////////////////////////////////////////////
function update() {

    // loop housekeeping
    runtime = undefined;

    // clean canvas
    clearCanvas( ctx );

    // blending
    if ( blitCtx.globalCompositeOperation != currTheme.contextBlendingMode ) {
        blitCtx.globalCompositeOperation = currTheme.contextBlendingMode;
    }

    // updates
    updateCycle();

    // debugging
    displayDebugging();

    // looping
    animation.state === true ? (runtimeEngine.startAnimation(runtime, update), counter++) : runtimeEngine.stopAnimation(runtime);

    // global clock
    // counter++;
}
/////////////////////////////////////////////////////////////
// End runtime
/////////////////////////////////////////////////////////////