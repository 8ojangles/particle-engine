var drawing = require('./canvasApiAugmentation.js').canvasDrawingApi;

let c = document.createElement( 'canvas' );
let ctx = c.getContext( '2d' );

let blurBuffer = 5;

c.width = 200 + ( blurBuffer * 2 );
c.height = 100 + ( blurBuffer * 2 );


cH = c.width / 2;
cV = c.height / 2;
let cSR = ( c.height - ( blurBuffer * 2 ) ) / 2;
let cSO = cH / 4;

function createWarpStarImage() {

	let gRed = ctx.createRadialGradient( cH - cSO, cV, 0, cH - cSO, cV, cSR );
	gRed.addColorStop( 0, 'rgba( 255, 0, 0, 1 )' );
	gRed.addColorStop( 1, 'rgba( 255, 0, 0, 0 )' );

	let gGreen = ctx.createRadialGradient( cH, cV, 0, cH, cV, cSR );
	gGreen.addColorStop( 0, 'rgba( 0, 255, 0, 1 )' );
	gGreen.addColorStop( 1, 'rgba( 0, 255, 0, 0 )' );

	let gBlue = ctx.createRadialGradient( cH + cSO, cV, 0, cH + cSO, cV, cSR );
	gBlue.addColorStop( 0, 'rgba( 0, 0, 255, 1 )' );
	gBlue.addColorStop( 1, 'rgba( 0, 0, 255, 0 )' );

	ctx.globalCompositeOperation = 'lighter';

	ctx.filter = "blur( 1px )";

	ctx.fillStyle = gRed;
	ctx.fillCircle( cH - cSO, cV, cSR, c );

	ctx.fillStyle = gGreen;
	ctx.fillCircle( cH, cV, cSR, c );

	ctx.fillStyle = gBlue;
	ctx.fillCircle( cH + cSO, cV, cSR, c );


	// ctx.translate( cH, cV );
	// ctx.scale( 1.25, 0.5 );
	// let gWhite = ctx.createRadialGradient( 0, 0, 0, 0, 0, cSR );
	// gWhite.addColorStop( 0.3, 'rgba( 255, 255, 255, 0.8 )' );
	// gWhite.addColorStop( 1, 'rgba( 255, 255, 255, 0 )' );

	// ctx.fillStyle = gWhite;
	// ctx.fillCircle( 0, 0, cSR, c );

	// ctx.scale( 1, 2 );
	// ctx.translate( -cH, -cV );

	c.renderProps = {
		src: {
			x: 0, y: 0, w: c.width, h: c.height
		},
		dest: {
			x: -cH, y: -cV
		}
	}
	// console.log( 'c: ', c.renderProps );

	$( '.warpStarImageCanvas' ).append( c );

	return c;

}

module.exports = createWarpStarImage;