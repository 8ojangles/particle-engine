let particleFn = require('./../particleFn.js').particleFn;

let updateParticleArr = function updateParticleArr( storeArr, poolArr, animation, canvasConfig, entityCounter, emitterStore) {
    // loop housekeeping

    let arrLen = storeArr.length - 1;
    for ( let i = arrLen; i >= 0; i-- ) {
        let p = storeArr[i];
        p.isAlive != 0 ? particleFn.checkParticleKillConditions(p, canvasConfig.width, canvasConfig.height) ? p.kill(poolArr, p.idx, entityCounter) : p.update(emitterStore) : false;
    } // end For loop
    // liveEntityCount === 0 ? ( console.log( 'liveEntityCount === 0 stop anim' ), animation.state = false ) : 0;

};

module.exports.updateParticleArr = updateParticleArr;