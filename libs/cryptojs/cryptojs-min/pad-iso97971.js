!function(e,o,r){"object"==typeof exports?module.exports=exports=o(require("./core"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],o):o(e.CryptoJS)}(this,(function(e){return e.pad.Iso97971={pad:function(o,r){o.concat(e.lib.WordArray.create([2147483648],1)),e.pad.ZeroPadding.pad(o,r)},unpad:function(o){e.pad.ZeroPadding.unpad(o),o.sigBytes--}},e.pad.Iso97971}));