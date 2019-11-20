var renderParticleArr = function renderParticleArr( context, arr, animation) {
    // var thisArr = arr;
    var arrLen = arr.length;

    // var rendered = 0;
    var notRendered = 0;

    for (var i = arrLen - 1; i >= 0; i--) {
        var p = arr[ i ];

        // p.isAlive != 0 ? ( p.render( p.x, p.y, p.r, p.color4Data, context), rendered++ ) : notRendered++;

        p.isAlive != 0 ?
            p.render( p.x, p.y, p.r, p.color4Data, context ) :
            notRendered++;

    }
    // console.log( 'rendered: '+rendered+' notRendered: '+notRendered );
    // notRendered === arrLen ?
    // ( console.log( 'notRendered === 0: stop anim' ), animation.state = false ) : 0;
    notRendered === arrLen ? animation.state = false : 0;

};

module.exports.renderParticleArr = renderParticleArr;