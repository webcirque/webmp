!function(e,r,o){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],r):r(e.CryptoJS)}(this,(function(e){var r,o;return e.mode.CTR=(r=e.lib.BlockCipherMode.extend(),o=r.Encryptor=r.extend({processBlock:function(e,r){var o=this._cipher,i=o.blockSize,t=this._iv,c=this._counter;t&&(c=this._counter=t.slice(0),this._iv=void 0);var n=c.slice(0);o.encryptBlock(n,0),c[i-1]=c[i-1]+1|0;for(var p=0;p<i;p++)e[r+p]^=n[p]}}),r.Decryptor=o,r),e.mode.CTR}));