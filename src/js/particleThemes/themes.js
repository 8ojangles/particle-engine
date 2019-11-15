let fireTheme = require('./themes/fire/theme.js').fireTheme;
let resetTheme = require('./themes/reset/resetTheme.js').resetTheme;
let warpStarTheme = require('./themes/warpStar/theme.js').warpStarTheme;
let flameTheme = require('./themes/flame/flameTheme.js').flameTheme;
let smokeTheme = require('./themes/smoke/smokeTheme.js').smokeTheme;

let themes = {
   reset: resetTheme,
   fire: fireTheme,
   warpStar: warpStarTheme,
   flame: flameTheme,
   smoke: smokeTheme
};

module.exports.themes = themes;