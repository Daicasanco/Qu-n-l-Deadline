// Project Management System with Supabase

// Anti-Debug Protection - Vô hiệu hóa Developer Tools
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).DisableDevtool=t()}(this,function(){"use strict";function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function u(e,t,n){t&&r(e.prototype,t),n&&r(e,n),Object.defineProperty(e,"prototype",{writable:!1})}function e(e,t,n){t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}function n(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&a(e,t)}function c(e){return(c=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function a(e,t){return(a=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e})(e,t)}function H(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");t=e;if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function l(n){var i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}();return function(){var e,t=c(n);return H(this,i?(e=c(this).constructor,Reflect.construct(t,arguments,e)):t.apply(this,arguments))}}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function s(e,t){var n,i="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!i){if(Array.isArray(e)||(i=function(e,t){if(e){if("string"==typeof e)return f(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Map"===(n="Object"===n&&e.constructor?e.constructor.name:n)||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?f(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length)return i&&(e=i),n=0,{s:t=function(){},n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:t};throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,r=!0,u=!1;return{s:function(){i=i.call(e)},n:function(){var e=i.next();return r=e.done,e},e:function(e){u=!0,o=e},f:function(){try{r||null==i.return||i.return()}finally{if(u)throw o}}}}function t(){if(d.url)window.location.href=d.url;else if(d.rewriteHTML)try{document.documentElement.innerHTML=d.rewriteHTML}catch(e){document.documentElement.innerText=d.rewriteHTML}else{try{window.opener=null,window.open("","_self"),window.close(),window.history.back()}catch(e){console.log(e)}setTimeout(function(){window.location.href=d.timeOutUrl||"https://theajack.github.io/disable-devtool/404.html?h=".concat(encodeURIComponent(location.host))},500)}}var d={md5:"",ondevtoolopen:t,ondevtoolclose:null,url:"",timeOutUrl:"",tkName:"ddtk",interval:500,disableMenu:!0,stopIntervalTime:5e3,clearIntervalWhenDevOpenTrigger:!1,detectors:[0,1,3,4,5,6,7],clearLog:!0,disableSelect:!1,disableCopy:!1,disableCut:!1,disablePaste:!1,ignore:null,disableIframeParents:!0,seo:!0,rewriteHTML:""},U=["detectors","ondevtoolclose","ignore"];function q(e){var t,n=0<arguments.length&&void 0!==e?e:{};for(t in d){var i=t;void 0===n[i]||o(d[i])!==o(n[i])&&-1===U.indexOf(i)||(d[i]=n[i])}"function"==typeof d.ondevtoolclose&&!0===d.clearIntervalWhenDevOpenTrigger&&(d.clearIntervalWhenDevOpenTrigger=!1,console.warn("【DISABLE-DEVTOOL】clearIntervalWhenDevOpenTrigger 在使用 ondevtoolclose 时无效"))}function v(){return(new Date).getTime()}function h(e){var t=v();return e(),v()-t}function z(n,i){function e(t){return function(){n&&n();var e=t.apply(void 0,arguments);return i&&i(),e}}var t=window.alert,o=window.confirm,r=window.prompt;try{window.alert=e(t),window.confirm=e(o),window.prompt=e(r)}catch(e){}}var p,y,B,b={iframe:!1,pc:!1,qqBrowser:!1,firefox:!1,macos:!1,edge:!1,oldEdge:!1,ie:!1,iosChrome:!1,iosEdge:!1,chrome:!1,seoBot:!1,mobile:!1};function W(){function e(e){return-1!==t.indexOf(e)}var t=navigator.userAgent.toLowerCase(),n=function(){var e=navigator,t=e.platform,e=e.maxTouchPoints;if("number"==typeof e)return 1<e;if("string"==typeof t){e=t.toLowerCase();if(/(mac|win)/i.test(e))return!1;if(/(android|iphone|ipad|ipod|arch)/i.test(e))return!0}return/(iphone|ipad|ipod|ios|android)/i.test(navigator.userAgent.toLowerCase())}(),i=!!window.top&&window!==window.top,o=!n,r=e("qqbrowser"),u=e("firefox"),c=e("macintosh"),a=e("edge"),l=a&&!e("chrome"),f=l||e("trident")||e("msie"),s=e("crios"),d=e("edgios"),v=e("chrome")||s,h=!n&&/(googlebot|baiduspider|bingbot|applebot|petalbot|yandexbot|bytespider|chrome\-lighthouse|moto g power)/i.test(t);Object.assign(b,{iframe:i,pc:o,qqBrowser:r,firefox:u,macos:c,edge:a,oldEdge:l,ie:f,iosChrome:s,iosEdge:d,chrome:v,seoBot:h,mobile:n})}function M(){for(var e=function(){for(var e={},t=0;t<500;t++)e["".concat(t)]="".concat(t);return e}(),t=[],n=0;n<50;n++)t.push(e);return t}function w(){d.clearLog&&B()}var K="",V=!1;function F(){var e=d.ignore;if(e){if("function"==typeof e)return e();if(0!==e.length){var t=location.href;if(K===t)return V;K=t;var n,i=!1,o=s(e);try{for(o.s();!(n=o.n()).done;){var r=n.value;if("string"==typeof r){if(-1!==t.indexOf(r)){i=!0;break}}else if(r.test(t)){i=!0;break}}}catch(e){o.e(e)}finally{o.f()}return V=i}}}var X=function(){return!1};function g(n){var t,e,i=74,o=73,r=85,u=83,c=123,a=b.macos?function(e,t){return e.metaKey&&e.altKey&&(t===o||t===i)}:function(e,t){return e.ctrlKey&&e.shiftKey&&(t===o||t===i)},l=b.macos?function(e,t){return e.metaKey&&e.altKey&&t===r||e.metaKey&&t===u}:function(e,t){return e.ctrlKey&&(t===u||t===r)};n.addEventListener("keydown",function(e){var t=(e=e||n.event).keyCode||e.which;if(t===c||a(e,t)||l(e,t))return T(n,e)},!0),t=n,d.disableMenu&&t.addEventListener("contextmenu",function(e){if("touch"!==e.pointerType)return T(t,e)}),e=n,d.disableSelect&&m(e,"selectstart"),e=n,d.disableCopy&&m(e,"copy"),e=n,d.disableCut&&m(e,"cut"),e=n,d.disablePaste&&m(e,"paste")}function m(t,e){t.addEventListener(e,function(e){return T(t,e)})}function T(e,t){if(!F()&&!X())return(t=t||e.event).returnValue=!1,t.preventDefault(),!1}var O,D=!1,S={};function N(e){S[e]=!1}function $(){for(var e in S)if(S[e])return D=!0;return D=!1}(_=O=O||{})[_.Unknown=-1]="Unknown",_[_.RegToString=0]="RegToString",_[_.DefineId=1]="DefineId",_[_.Size=2]="Size",_[_.DateToString=3]="DateToString",_[_.FuncToString=4]="FuncToString",_[_.Debugger=5]="Debugger",_[_.Performance=6]="Performance",_[_.DebugLib=7]="DebugLib";var k=function(){function n(e){var t=e.type,e=e.enabled,e=void 0===e||e;i(this,n),this.type=O.Unknown,this.enabled=!0,this.type=t,this.enabled=e,this.enabled&&(t=this,Q.push(t),this.init())}return u(n,[{key:"onDevToolOpen",value:function(){var e;console.warn("You don't have permission to use DEVTOOL!【type = ".concat(this.type,"】")),d.clearIntervalWhenDevOpenTrigger&&te(),window.clearTimeout(J),d.ondevtoolopen(this.type,t),e=this.type,S[e]=!0}},{key:"init",value:function(){}}]),n}(),G=function(){n(t,k);var e=l(t);function t(){return i(this,t),e.call(this,{type:O.DebugLib})}return u(t,[{key:"init",value:function(){}},{key:"detect",value:function(){var e;(!0===(null==(e=null==(e=window.eruda)?void 0:e._devTools)?void 0:e._isShow)||window._vcOrigConsole&&window.document.querySelector("#__vconsole.vc-toggle"))&&this.onDevToolOpen()}}],[{key:"isUsing",value:function(){return!!window.eruda||!!window._vcOrigConsole}}]),t}(),Y=0,J=0,Q=[],Z=0;function ee(o){function e(){l=!0}function t(){l=!1}var n,i,r,u,c,a,l=!1;function f(){(a[u]===r?i:n)()}z(e,t),n=t,i=e,void 0!==(a=document).hidden?(r="hidden",c="visibilitychange",u="visibilityState"):void 0!==a.mozHidden?(r="mozHidden",c="mozvisibilitychange",u="mozVisibilityState"):void 0!==a.msHidden?(r="msHidden",c="msvisibilitychange",u="msVisibilityState"):void 0!==a.webkitHidden&&(r="webkitHidden",c="webkitvisibilitychange",u="webkitVisibilityState"),a.removeEventListener(c,f,!1),a.addEventListener(c,f,!1),Y=window.setInterval(function(){if(!(o.isSuspend||l||F())){var e,t,n=s(Q);try{for(n.s();!(e=n.n()).done;){var i=e.value;N(i.type),i.detect(Z++)}}catch(e){n.e(e)}finally{n.f()}w(),"function"==typeof d.ondevtoolclose&&(t=D,!$()&&t&&d.ondevtoolclose())}},d.interval),J=setTimeout(function(){b.pc||G.isUsing()||te()},d.stopIntervalTime)}function te(){window.clearInterval(Y)}var P=8;function ne(e){for(var t=function(e,t){e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t;for(var n=1732584193,i=-271733879,o=-1732584194,r=271733878,u=0;u<e.length;u+=16){var c=n,a=i,l=o,f=r;n=E(n,i,o,r,e[u+0],7,-680876936),r=E(r,n,i,o,e[u+1],12,-389564586),o=E(o,r,n,i,e[u+2],17,606105819),i=E(i,o,r,n,e[u+3],22,-1044525330),n=E(n,i,o,r,e[u+4],7,-176418897),r=E(r,n,i,o,e[u+5],12,1200080426),o=E(o,r,n,i,e[u+6],17,-1473231341),i=E(i,o,r,n,e[u+7],22,-45705983),n=E(n,i,o,r,e[u+8],7,1770035416),r=E(r,n,i,o,e[u+9],12,-1958414417),o=E(o,r,n,i,e[u+10],17,-42063),i=E(i,o,r,n,e[u+11],22,-1990404162),n=E(n,i,o,r,e[u+12],7,1804603682),r=E(r,n,i,o,e[u+13],12,-40341101),o=E(o,r,n,i,e[u+14],17,-1502002290),i=E(i,o,r,n,e[u+15],22,1236535329),n=j(n,i,o,r,e[u+1],5,-165796510),r=j(r,n,i,o,e[u+6],9,-1069501632),o=j(o,r,n,i,e[u+11],14,643717713),i=j(i,o,r,n,e[u+0],20,-373897302),n=j(n,i,o,r,e[u+5],5,-701558691),r=j(r,n,i,o,e[u+10],9,38016083),o=j(o,r,n,i,e[u+15],14,-660478335),i=j(i,o,r,n,e[u+4],20,-405537848),n=j(n,i,o,r,e[u+9],5,568446438),r=j(r,n,i,o,e[u+14],9,-1019803690),o=j(o,r,n,i,e[u+3],14,-187363961),i=j(i,o,r,n,e[u+8],20,1163531501),n=j(n,i,o,r,e[u+13],5,-1444681467),r=j(r,n,i,o,e[u+2],9,-51403784),o=j(o,r,n,i,e[u+7],14,1735328473),i=j(i,o,r,n,e[u+12],20,-1926607734),n=I(n,i,o,r,e[u+5],4,-378558),r=I(r,n,i,o,e[u+8],11,-2022574463),o=I(o,r,n,i,e[u+11],16,1839030562),i=I(i,o,r,n,e[u+14],23,-35309556),n=I(n,i,o,r,e[u+1],4,-1530992060),r=I(r,n,i,o,e[u+4],11,1272893353),o=I(o,r,n,i,e[u+7],16,-155497632),i=I(i,o,r,n,e[u+10],23,-1094730640),n=I(n,i,o,r,e[u+13],4,681279174),r=I(r,n,i,o,e[u+0],11,-358537222),o=I(o,r,n,i,e[u+3],16,-722521979),i=I(i,o,r,n,e[u+6],23,76029189),n=I(n,i,o,r,e[u+9],4,-640364487),r=I(r,n,i,o,e[u+12],11,-421815835),o=I(o,r,n,i,e[u+15],16,530742520),i=I(i,o,r,n,e[u+2],23,-995338651),n=L(n,i,o,r,e[u+0],6,-198630844),r=L(r,n,i,o,e[u+7],10,1126891415),o=L(o,r,n,i,e[u+14],15,-1416354905),i=L(i,o,r,n,e[u+5],21,-57434055),n=L(n,i,o,r,e[u+12],6,1700485571),r=L(r,n,i,o,e[u+3],10,-1894986606),o=L(o,r,n,i,e[u+10],15,-1051523),i=L(i,o,r,n,e[u+1],21,-2054922799),n=L(n,i,o,r,e[u+8],6,1873313359),r=L(r,n,i,o,e[u+15],10,-30611744),o=L(o,r,n,i,e[u+6],15,-1560198380),i=L(i,o,r,n,e[u+13],21,1309151649),n=L(n,i,o,r,e[u+4],6,-145523070),r=L(r,n,i,o,e[u+11],10,-1120210379),o=L(o,r,n,i,e[u+2],15,718787259),i=L(i,o,r,n,e[u+9],21,-343485551),n=C(n,c),i=C(i,a),o=C(o,l),r=C(r,f)}return Array(n,i,o,r)}(function(e){for(var t=Array(),n=(1<<P)-1,i=0;i<e.length*P;i+=P)t[i>>5]|=(e.charCodeAt(i/P)&n)<<i%32;return t}(e),e.length*P),n="0123456789abcdef",i="",o=0;o<4*t.length;o++)i+=n.charAt(t[o>>2]>>o%4*8+4&15)+n.charAt(t[o>>2]>>o%4*8&15);return i}function x(e,t,n,i,o,r){return C((t=C(C(t,e),C(i,r)))<<o|t>>>32-o,n)}function E(e,t,n,i,o,r,u){return x(t&n|~t&i,e,t,o,r,u)}function j(e,t,n,i,o,r,u){return x(t&i|n&~i,e,t,o,r,u)}function I(e,t,n,i,o,r,u){return x(t^n^i,e,t,o,r,u)}function L(e,t,n,i,o,r,u){return x(n^(t|~i),e,t,o,r,u)}function C(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}var _=function(){n(t,k);var e=l(t);function t(){return i(this,t),e.call(this,{type:O.RegToString,enabled:b.qqBrowser||b.firefox})}return u(t,[{key:"init",value:function(){var t=this;this.lastTime=0,this.reg=/./,p(this.reg),this.reg.toString=function(){var e;return b.qqBrowser?(e=(new Date).getTime(),t.lastTime&&e-t.lastTime<100?t.onDevToolOpen():t.lastTime=e):b.firefox&&t.onDevToolOpen(),""}}},{key:"detect",value:function(){p(this.reg)}}]),t}(),ie=function(){n(t,k);var e=l(t);function t(){return i(this,t),e.call(this,{type:O.DefineId})}return u(t,[{key:"init",value:function(){var e=this;this.div=document.createElement("div"),this.div.__defineGetter__("id",function(){e.onDevToolOpen()}),Object.defineProperty(this.div,"id",{get:function(){e.onDevToolOpen()}})}},{key:"detect",value:function(){p(this.div)}}]),t}(),oe=function(){n(t,k);var e=l(t);function t(){return i(this,t),e.call(this,{type:O.Size,enabled:!b.iframe&&!b.edge})}return u(t,[{key:"init",value:function(){var e=this;this.checkWindowSizeUneven(),window.addEventListener("resize",function(){setTimeout(function(){e.checkWindowSizeUneven()},100)},!0)}},{key:"detect",value:function(){}},{key:"checkWindowSizeUneven",value:function(){var e=function(){if(re(window.devicePixelRatio))return window.devicePixelRatio;var e=window.screen;return!(re(e)||!e.deviceXDPI||!e.logicalXDPI)&&e.deviceXDPI/e.logicalXDPI}();if(!1!==e){var t=200<window.outerWidth-window.innerWidth*e,e=300<window.outerHeight-window.innerHeight*e;if(t||e)return this.onDevToolOpen(),!1;N(this.type)}return!0}}]),t}();function re(e){return null!=e}var A,ue=function(){n(t,k);var e=l(t);function t(){return i(this,t),e.call(this,{type:O.DateToString,enabled:!b.iosChrome&&!b.iosEdge})}return u(t,[{key:"init",value:function(){var e=this;this.count=0,this.date=new Date,this.date.toString=function(){return e.count++,""}}},{key:"detect",value:function(){this.count=0,p(this.date),w(),2<=this.count&&this.onDevToolOpen()}}]),t}(),ce=function(){n(t,k);var e=l(t);function t(){return i(this,t),e.call(this,{type:O.FuncToString,enabled:!b.iosChrome&&!b.iosEdge})}return u(t,[{key:"init",value:function(){var e=this;this.count=0,this.func=function(){},this.func.toString=function(){return e.count++,""}}},{key:"detect",value:function(){this.count=0,p(this.func),w(),2<=this.count&&this.onDevToolOpen()}}]),t}(),ae=function(){n(t,k);var e=l(t);function t(){return i(this,t),e.call(this,{type:O.Debugger,enabled:b.iosChrome||b.iosEdge})}return u(t,[{key:"detect",value:function(){var e=v();100<v()-e&&this.onDevToolOpen()}}]),t}(),le=function(){n(t,k);var e=l(t);function t(){return i(this,t),e.call(this,{type:O.Performance,enabled:b.chrome||!b.mobile})}return u(t,[{key:"init",value:function(){this.maxPrintTime=0,this.largeObjectArray=M()}},{key:"detect",value:function(){var e=this,t=h(function(){y(e.largeObjectArray)}),n=h(function(){p(e.largeObjectArray)});if(this.maxPrintTime=Math.max(this.maxPrintTime,n),w(),0===t||0===this.maxPrintTime)return!1;t>10*this.maxPrintTime&&this.onDevToolOpen()}}]),t}(),fe=(e(A={},O.RegToString,_),e(A,O.DefineId,ie),e(A,O.Size,oe),e(A,O.DateToString,ue),e(A,O.FuncToString,ce),e(A,O.Debugger,ae),e(A,O.Performance,le),e(A,O.DebugLib,G),A);var R=Object.assign(function(e){function t(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"";return{success:!e,reason:e}}var n;if(R.isRunning)return t("already running");if(W(),n=window.console||{log:function(){},table:function(){},clear:function(){}},B=b.ie?(p=function(){return n.log.apply(n,arguments)},y=function(){return n.table.apply(n,arguments)},function(){return n.clear()}):(p=n.log,y=n.table,n.clear),q(e),d.md5&&ne(function(e){var t=window.location.search,n=window.location.hash;if(""!==(t=""===t&&""!==n?"?".concat(n.split("?")[1]):t)&&void 0!==t){n=new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i"),e=t.substr(1).match(n);if(null!=e)return unescape(e[2])}return""}(d.tkName))===d.md5)return t("token passed");if(d.seo&&b.seoBot)return t("seobot");R.isRunning=!0,ee(R);var i=R,o=(X=function(){return i.isSuspend},window.top),r=window.parent;if(g(window),d.disableIframeParents&&o&&r&&o!==window){for(;r!==o;)g(r),r=r.parent;g(o)}return("all"===d.detectors?Object.keys(fe):d.detectors).forEach(function(e){new fe[e]}),t()},{isRunning:!1,isSuspend:!1,md5:ne,version:"0.3.8",DetectorType:O,isDevToolOpened:$});_=function(){if("undefined"==typeof window||!window.document)return null;var n=document.querySelector("[disable-devtool-auto]");if(!n)return null;var i=["disable-menu","disable-select","disable-copy","disable-cut","disable-paste","clear-log"],o=["interval"],r={};return["md5","url","tk-name","detectors"].concat(i,o).forEach(function(e){var t=n.getAttribute(e);null!==t&&(-1!==o.indexOf(e)?t=parseInt(t):-1!==i.indexOf(e)?t="false"!==t:"detector"===e&&"all"!==t&&(t=t.split(" ")),r[function(e){if(-1===e.indexOf("-"))return e;var t=!1;return e.split("").map(function(e){return"-"===e?(t=!0,""):t?(t=!1,e.toUpperCase()):e}).join("")}(e)]=t)}),r}();return _&&R(_),R});

// Khởi tạo Anti-Debug Protection
(function() {
    try {
        // Khởi tạo DisableDevtool với cấu hình tùy chỉnh
        DisableDevtool({
            disableMenu: true,        // Vô hiệu hóa chuột phải
            disableSelect: true,      // Vô hiệu hóa select text
            disableCopy: true,        // Vô hiệu hóa copy
            disableCut: true,         // Vô hiệu hóa cut
            disablePaste: false,       // Vô hiệu hóa paste
            clearLog: true,           // Xóa console log
            interval: 1000,           // Kiểm tra mỗi 1 giây
            detectors: [0,1,2,3,4,5,6,7], // Tất cả các detector
            ondevtoolopen: function() {
                // Khi phát hiện Developer Tools mở
                console.warn("Developer Tools đã được phát hiện!");
                // Có thể thêm logic khác ở đây
            }
        });
    } catch (error) {
        console.warn("Anti-debug initialization failed:", error);
    }
})();

// Supabase Configuration - Thêm API keys trực tiếp vào đây
const SUPABASE_URL = 'https://blkkgtjsebkjmhqqtrwh.supabase.co'  // ← Thay bằng URL thực
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa2tndGpzZWJram1ocXF0cndoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzkzNzk0OCwiZXhwIjoyMDY5NTEzOTQ4fQ.B-YLv3Akz3OJ_gM6FtpftSgxC6OBmGOp9lToo5LMrvE'              // ← Thay bằng ANON KEY thực

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Global variables
let currentUser = null
let projects = []
let tasks = []
let employees = []
let filteredProjects = []
let currentProjectId = null

// Project Reporting Functions
let currentReportData = null

// Helper function to check if user has manager or boss permissions
function hasManagerOrBossPermissions(user) {
    return user && (user.role === 'manager' || user.role === 'boss');
}

// Helper function to check if user is boss
function isBoss(user) {
    console.log('isBoss - user:', user)
    console.log('isBoss - user.role:', user?.role)
    const result = user && user.role === 'boss'
    console.log('isBoss - result:', result)
    return result
}

// View Management Functions
function showProjectsView() {
    document.getElementById('projectsView').style.display = ''
    document.getElementById('tasksView').style.display = 'none'
    currentProjectId = null
    updateDashboard()
    
    // Update UI to show/hide buttons based on current view
    updateUserInterface()
}

function showTasksView(projectId) {
    document.getElementById('projectsView').style.display = 'none'
    document.getElementById('tasksView').style.display = ''
    
    // Set current project
    currentProjectId = projectId
    
    // Update project name in header
    const project = projects.find(p => p.id === projectId)
    if (project) {
        document.getElementById('currentProjectName').textContent = project.name
    }
    
    // Update project link buttons
    updateProjectLinkButtons()
    
    // Render tasks for this project
    renderTasksTable()
    setupTaskFilters()
    
    // Initialize beta task functionality
    initializeBetaTasks()
    
    // Re-render beta tasks table to apply rank-based styling
    renderBetaTasksTable()
    
    // Update UI to show/hide buttons based on current view
    updateUserInterface()
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp()
})

function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
        currentUser = JSON.parse(savedUser)
        updateUserInterface()
        
        // Load data from Supabase only if user is logged in
        loadDataFromSupabase()
        
        // Set up event listeners
        setupEventListeners()
        
        // Debug: Add click listener to addTaskBtn
        const addTaskBtn = document.getElementById('addTaskBtn')
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', function(e) {
                console.log('addTaskBtn clicked!')
                console.log('onclick handler:', this.onclick)
            })
        }
        
        // Set up realtime subscriptions
        setupRealtimeSubscriptions()
    } else {
        // User not logged in - show login modal and hide content
        showLoginModal()
        hideAllContent()
    }
}

// Supabase Data Management
async function loadDataFromSupabase() {
    try {
        // Load ALL employees (both managers and employees)
        const { data: allEmployeesData, error: allEmployeesError } = await supabase
            .from('employees')
            .select('*')
        
        if (allEmployeesError) throw allEmployeesError
        window.allEmployees = allEmployeesData || [] // Store all employees globally
        
        // Filter for employees (role 'employee') for assignee dropdowns
        employees = window.allEmployees.filter(emp => emp.role === 'employee')
        
        // Filter for managers (role 'manager') for manager filter
        const managers = window.allEmployees.filter(emp => emp.role === 'manager' || emp.role === 'boss')
        
        console.log('Loaded allEmployees:', window.allEmployees)
        console.log('Filtered employees:', employees)
        console.log('Filtered managers:', managers)
        
        // Update manager filter dropdown
        updateManagerFilter(managers)
        
        // Load projects
        await loadProjects()
        
        // Load tasks
        await loadTasks()
        
        // Re-render projects table after tasks are loaded to ensure accurate task counts
        renderProjectsTable()
        
        // Load leaderboards and notifications
        await loadLeaderboards()
        await loadNotifications()
        
        // Update UI
        updateDashboard()
        updateUserInterface()
        updateAssigneeDropdowns() // Ensure dropdowns are updated after data load
        setupBetaTaskFilters() // Ensure beta task filters are updated after data load
        
        // Ensure we start with projects view
        showProjectsView()
        
        // Setup realtime subscriptions
        setupRealtimeSubscriptions()
        
        // Check for overdue tasks
        checkOverdueTasks()
        
    } catch (error) {
        console.error('Error loading data from Supabase:', error)
        showNotification('Lỗi tải dữ liệu ban đầu', 'error')
    }
}

async function loadProjects() {
    try {
        let query = supabase.from('projects')
            .select(`
                *,
                manager:employees(name)
            `)
        
        // Employees can only see completed projects and cannot interact with them
        // Managers can see all projects and have full rights on their own projects
        
        const { data, error } = await query
        
        if (error) throw error
        projects = data || []
        filteredProjects = [...projects]
        
        renderProjectsTable()
        
    } catch (error) {
        console.error('Error loading projects:', error)
        showNotification('Lỗi tải dữ liệu dự án', 'error')
    }
}

async function loadTasks(projectId = null) {
    try {
        let query = supabase.from('tasks').select('*')
        
        if (projectId) {
            query = query.eq('project_id', projectId)
        }
        
        // Nhân viên có thể xem tất cả task trong dự án (đã được RLS policy xử lý)
        // RLS policy sẽ đảm bảo chỉ hiển thị task trong các dự án đang hoạt động
        
        const { data, error } = await query
        
        if (error) throw error
        tasks = data || []
        
        console.log(`Loaded ${tasks.length} tasks total`)
        if (projectId) {
            console.log(`Tasks for project ${projectId}:`, tasks.filter(t => t.project_id === projectId))
        }
        
        renderTasksTable()
        
        // Re-render projects table to update task counts
        renderProjectsTable()
        
    } catch (error) {
        console.error('Error loading tasks:', error)
        showNotification('Lỗi tải dữ liệu công việc', 'error')
    }
}

// Function to manually refresh task counts for debugging
function refreshTaskCounts() {
    console.log('Refreshing task counts...')
    console.log('Current tasks:', tasks)
    console.log('Current projects:', projects)
    
    projects.forEach(project => {
        const taskCount = tasks.filter(t => t.project_id === project.id).length
        console.log(`Project ${project.id} (${project.name}): ${taskCount} tasks`)
    })
    
    renderProjectsTable()
}

// Function to test employee visibility
function testEmployeeVisibility() {
    console.log('=== Testing Employee Visibility ===')
    console.log('Current user:', currentUser)
    console.log('Current user role:', currentUser?.role)
    console.log('Total projects loaded:', projects.length)
    console.log('Projects by status:')
    const statusCounts = {}
    projects.forEach(project => {
        statusCounts[project.status] = (statusCounts[project.status] || 0) + 1
    })
    console.log(statusCounts)
    console.log('Total tasks loaded:', tasks.length)
    console.log('Leaderboard containers exist:', {
        allTime: !!document.getElementById('allTimeLeaderboard'),
        monthly: !!document.getElementById('monthlyLeaderboard')
    })
    console.log('=== End Test ===')
}

// Realtime Subscriptions
function setupRealtimeSubscriptions() {
    // Subscribe to project changes
    supabase
        .channel('projects')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, payload => {
            console.log('Project change:', payload)
            loadProjects()
            showNotification('Dữ liệu dự án đã được cập nhật', 'info')
        })
        .subscribe()
    
    // Subscribe to task changes - Tạm thời comment để tránh conflict
    /*
    supabase
        .channel('tasks')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, payload => {
            console.log('Task change:', payload)
            if (currentProjectId) {
                loadTasks(currentProjectId)
            }
            showNotification('Dữ liệu công việc đã được cập nhật', 'info')
        })
        .subscribe()
    */
}

// User Management
async function login() {
    const email = document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value
    
    // Validate input
    if (!email || !password) {
        showNotification('Vui lòng điền đầy đủ thông tin', 'error')
        return
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        
        if (error) throw error
        
        // Get user profile from employees table
        const { data: profile, error: profileError } = await supabase
            .from('employees')
            .select('*')
            .eq('email', email)
            .single()
        
        if (profileError) throw profileError
        
        // Set current user
        currentUser = profile
        localStorage.setItem('currentUser', JSON.stringify(profile))
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'))
        modal.hide()
        
        // Update UI
        updateUserInterface()
        
        // Reload data
        loadDataFromSupabase()
        
        showNotification(`Chào mừng ${profile.name}!`, 'success')
        
        // Clear form
        document.getElementById('loginForm').reset()
        
    } catch (error) {
        console.error('Login error:', error)
        showNotification('Email hoặc mật khẩu không đúng', 'error')
    }
}

function logout() {
    currentUser = null
    localStorage.removeItem('currentUser')
    updateUserInterface()
    showNotification('Đã đăng xuất', 'info')
}

function updateUserInterface() {
    const currentUserSpan = document.getElementById('currentUser')
    const addProjectBtn = document.getElementById('addProjectBtn')
    const addTaskBtn = document.getElementById('addTaskBtn')
    const viewEmployeesBtn = document.getElementById('viewEmployeesBtn')
    const loginMessage = document.getElementById('loginMessage')
    const mainContent = document.getElementById('mainContent')
    
    if (currentUser) {
        // User is logged in - show content and hide login message
        currentUserSpan.textContent = currentUser.name
        addProjectBtn.style.display = hasManagerOrBossPermissions(currentUser) ? 'inline-block' : 'none'
        
        // Chỉ hiện nút "Thêm Deadline" khi ở trong tasks view và là manager hoặc boss
        const tasksView = document.getElementById('tasksView')
        const isInTasksView = tasksView && tasksView.style.display !== 'none'
        addTaskBtn.style.display = (hasManagerOrBossPermissions(currentUser) && isInTasksView) ? 'inline-block' : 'none'
        
        // Debug logging
        console.log('updateUserInterface - currentUser.role:', currentUser.role)
        console.log('updateUserInterface - isInTasksView:', isInTasksView)
        console.log('updateUserInterface - addTaskBtn.style.display:', addTaskBtn.style.display)
        
        viewEmployeesBtn.style.display = hasManagerOrBossPermissions(currentUser) ? 'inline-block' : 'none'
        
        // Show/hide announcement edit button for managers and bosses
        const editAnnouncementBtn = document.getElementById('editAnnouncementBtn')
        if (editAnnouncementBtn) {
            editAnnouncementBtn.style.display = hasManagerOrBossPermissions(currentUser) ? 'block' : 'none'
        }
        
        // Show main content and hide login message
        if (mainContent) mainContent.style.display = 'block'
        if (loginMessage) loginMessage.style.display = 'none'
        
        // Update assignee dropdowns
        updateAssigneeDropdowns()
        
        // Load leaderboards for all users (both employees and managers)
        loadLeaderboards()
        
        // Test employee visibility for debugging
        testEmployeeVisibility()
    } else {
        // User not logged in - hide content and show login message
        currentUserSpan.textContent = 'Guest'
        addProjectBtn.style.display = 'none'
        addTaskBtn.style.display = 'none'
        viewEmployeesBtn.style.display = 'none'
        
        // Hide main content and show login message
        if (mainContent) mainContent.style.display = 'none'
        if (loginMessage) {
            loginMessage.style.display = 'block'
            loginMessage.innerHTML = `
                <div class="text-center mt-5">
                    <h3><i class="fas fa-lock text-warning"></i> Yêu cầu đăng nhập</h3>
                    <p class="text-muted">Vui lòng đăng nhập để truy cập hệ thống quản lý dự án.</p>
                    <button class="btn btn-primary" onclick="showLoginModal()">
                        <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
                    </button>
                </div>
            `
        }
    }
}

// Project Management
async function addProject() {
    const name = document.getElementById('projectName').value
    const description = document.getElementById('projectDescription').value
    const status = document.getElementById('projectStatus').value
    const managerId = document.getElementById('projectManager').value
    const storyLink = document.getElementById('projectStoryLink').value
    const ruleLink = document.getElementById('projectRuleLink').value
    const bnvLink = document.getElementById('projectBnvLink').value
    const dialogueLink = document.getElementById('projectDialogueLink').value
    
    // Validate input
    if (!name) {
        showNotification('Vui lòng điền Tên Truyện', 'error')
        return
    }
    
    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([{
                name: name,
                description: description,
                status: status,
                manager_id: managerId || currentUser.id, // Use selected manager or current user
                story_link: storyLink || null,
                rule_link: ruleLink || null,
                bnv_link: bnvLink || null,
                dialogue_link: dialogueLink || null,
                created_at: new Date().toISOString()
            }])
            .select()
        
        if (error) throw error
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('projectModal'))
        modal.hide()
        
        showNotification('Thêm Truyện thành công!', 'success')
        
        // Apply bulk rates if specified
        if (data && data[0]) {
            await applyBulkRatesForNewProject(data[0].id)
        }
        
        // Clear form
        document.getElementById('projectForm').reset()
        
    } catch (error) {
        console.error('Error adding project:', error)
        showNotification('Lỗi Thêm Truyện', 'error')
    }
}

// Function to check if user can operate on a project
function canOperateOnProject(project) {
    if (!currentUser) return false
    
    // Boss can operate on any project
    if (isBoss(currentUser)) {
        return true
    }
    
    // Managers can only operate on their own projects
    if (currentUser.role === 'manager') {
        return currentUser.id === project.manager_id
    }
    
    // Employees cannot operate on any projects (including completed ones)
    return false
}

// Function to check if user can operate on a task
function canOperateOnTask(task) {
    console.log('canOperateOnTask - currentUser:', currentUser)
    console.log('canOperateOnTask - task:', task)
    
    if (!currentUser) {
        console.log('canOperateOnTask - no currentUser, returning false')
        return false
    }
    
    // Boss can operate on any task
    if (isBoss(currentUser)) {
        console.log('canOperateOnTask - isBoss check passed, returning true')
        return true
    }
    
    console.log('canOperateOnTask - isBoss check failed, currentUser.role:', currentUser.role)
    
    // Managers can operate on tasks in their own projects
    if (currentUser.role === 'manager') {
        const project = projects.find(p => p.id === task.project_id)
        const result = project && currentUser.id === project.manager_id
        console.log('canOperateOnTask - manager check result:', result)
        return result
    }
    
    // Employees can only operate on tasks assigned to them
    if (currentUser.role === 'employee') {
        const result = currentUser.id === task.assignee_id
        console.log('canOperateOnTask - employee check result:', result)
        return result
    }
    
    console.log('canOperateOnTask - no role matched, returning false')
    return false
}

// Function to check what fields user can edit based on task type and role
function getEditableFields(taskType, userRole) {
    const editableFields = {
        rv: {
            manager: ['name', 'description', 'deadline', 'priority', 'submission_link', 'dialogue_chars', 'total_chars', 'rv_chars', 'rate', 'notes', 'assignee_id'],
            employee: ['submission_link', 'dialogue_chars', 'total_chars', 'notes'],
            boss: ['name', 'description', 'deadline', 'priority', 'submission_link', 'dialogue_chars', 'total_chars', 'rv_chars', 'rate', 'notes', 'assignee_id']
        },
        beta: {
            manager: ['name', 'description', 'deadline', 'priority', 'beta_link', 'beta_chars', 'beta_notes', 'beta_rate', 'assignee_id'],
            employee: ['beta_link', 'beta_chars', 'beta_notes'],
            boss: ['name', 'description', 'deadline', 'priority', 'beta_link', 'beta_chars', 'beta_notes', 'beta_rate', 'assignee_id']
        }
    }
    
    return editableFields[taskType]?.[userRole] || []
}

// Function to check if field is editable for current user and task type
function isFieldEditable(fieldName) {
    if (!currentUser || !currentTaskType) return false
    
    const editableFields = getEditableFields(currentTaskType, currentUser.role)
    return editableFields.includes(fieldName)
}

async function editProject(id) {
    const project = projects.find(p => p.id === id)
    if (!project) return
    
    // Check if user can operate on this project
    if (!canOperateOnProject(project)) {
        showNotification('Bạn không có quyền chỉnh sửa dự án này', 'error')
        return
    }
    
    // Fill form
    document.getElementById('projectId').value = project.id
    document.getElementById('projectName').value = project.name
    document.getElementById('projectDescription').value = project.description || ''
    document.getElementById('projectStatus').value = project.status
    document.getElementById('projectStoryLink').value = project.story_link || ''
    document.getElementById('projectRuleLink').value = project.rule_link || ''
    document.getElementById('projectBnvLink').value = project.bnv_link || ''
    document.getElementById('projectDialogueLink').value = project.dialogue_link || ''
    
    // Update modal title
    document.getElementById('projectModalTitle').textContent = 'Chỉnh sửa Dự án'
    
    // Populate manager dropdown and set selected value
    await populateManagerDropdown()
    document.getElementById('projectManager').value = project.manager_id || ''
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('projectModal'))
    modal.show()
    
    // Setup bulk rate functionality for existing project
    await setupBulkRateFunctionality(project.id)
}

// Bulk Rate Management Functions
async function setupBulkRateFunctionality(projectId) {
    // Setup event listeners for bulk rate functionality
    const rateTargetSelect = document.getElementById('projectRateTarget')
    const individualSection = document.getElementById('individualEmployeeSection')
    const employeeSelect = document.getElementById('projectEmployeeSelect')
    
    // Show/hide individual employee section based on selection
    rateTargetSelect.addEventListener('change', function() {
        if (this.value === 'individual') {
            individualSection.style.display = 'block'
            populateProjectEmployeeDropdown(projectId)
        } else {
            individualSection.style.display = 'none'
        }
    })
    
    // Populate employee dropdown for individual selection
    if (rateTargetSelect.value === 'individual') {
        await populateProjectEmployeeDropdown(projectId)
    }
}

async function populateProjectEmployeeDropdown(projectId) {
    const employeeSelect = document.getElementById('projectEmployeeSelect')
    
    let projectEmployees = []
    
    if (projectId) {
        // For existing projects, get employees who have tasks in this project
        const projectTasks = tasks.filter(task => task.project_id === projectId)
        const employeeIds = [...new Set(projectTasks.map(task => task.assignee_id).filter(id => id))]
        projectEmployees = window.allEmployees.filter(emp => employeeIds.includes(emp.id))
    } else {
        // For new projects, show all employees
        projectEmployees = window.allEmployees.filter(emp => emp.role === 'employee')
    }
    
    // Clear and populate dropdown
    employeeSelect.innerHTML = ''
    projectEmployees.forEach(employee => {
        const option = document.createElement('option')
        option.value = employee.id
        option.textContent = `${employee.name} (${employee.role})`
        employeeSelect.appendChild(option)
    })
}

async function applyBulkRates() {
    const projectId = parseInt(document.getElementById('projectId').value)
    const rvRate = parseFloat(document.getElementById('projectRVRate').value) || 0
    const betaRate = parseFloat(document.getElementById('projectBetaRate').value) || 0
    const targetType = document.getElementById('projectRateTarget').value
    const selectedEmployees = Array.from(document.getElementById('projectEmployeeSelect').selectedOptions).map(opt => opt.value)
    
    if (rvRate === 0 && betaRate === 0) {
        showNotification('Vui lòng nhập ít nhất một rate', 'error')
        return
    }
    
    if (targetType === 'individual' && selectedEmployees.length === 0) {
        showNotification('Vui lòng chọn ít nhất một nhân viên', 'error')
        return
    }
    
    try {
        let tasksToUpdate = tasks.filter(task => task.project_id === projectId)
        
        // Filter by employee if individual selection
        if (targetType === 'individual') {
            tasksToUpdate = tasksToUpdate.filter(task => selectedEmployees.includes(task.assignee_id))
        }
        
        if (tasksToUpdate.length === 0) {
            showNotification('Không có task nào để cập nhật', 'info')
            return
        }
        
        // Update tasks in batches
        const batchSize = 10
        for (let i = 0; i < tasksToUpdate.length; i += batchSize) {
            const batch = tasksToUpdate.slice(i, i + batchSize)
            
            for (const task of batch) {
                const updateData = {}
                
                // Update RV rate for RV tasks
                if (rvRate > 0 && task.task_type === 'rv') {
                    updateData.rate = rvRate
                }
                
                // Update Beta rate for Beta tasks
                if (betaRate > 0 && task.task_type === 'beta') {
                    updateData.beta_rate = betaRate
                }
                
                if (Object.keys(updateData).length > 0) {
                    const { error } = await supabase
                        .from('tasks')
                        .update(updateData)
                        .eq('id', task.id)
                    
                    if (error) throw error
                }
            }
        }
        
        // Reload data to reflect changes
        await loadTasks(projectId)
        
        const updatedCount = tasksToUpdate.length
        showNotification(`Đã cập nhật rate cho ${updatedCount} task thành công!`, 'success')
        
    } catch (error) {
        console.error('Error applying bulk rates:', error)
        showNotification('Lỗi khi áp dụng rate hàng loạt', 'error')
    }
}

async function applyBulkRatesForNewProject(projectId) {
    const rvRate = parseFloat(document.getElementById('projectRVRate').value) || 0
    const betaRate = parseFloat(document.getElementById('projectBetaRate').value) || 0
    const targetType = document.getElementById('projectRateTarget').value
    const selectedEmployees = Array.from(document.getElementById('projectEmployeeSelect').selectedOptions).map(opt => opt.value)
    
    if (rvRate === 0 && betaRate === 0) {
        return // No rates to apply
    }
    
    try {
        // Get all employees for the project (for new projects, this will be empty initially)
        let employeesToApply = []
        
        if (targetType === 'individual' && selectedEmployees.length > 0) {
            employeesToApply = selectedEmployees
        } else if (targetType === 'all') {
            // For new projects, we'll apply to all employees in the system
            employeesToApply = window.allEmployees.filter(emp => emp.role === 'employee').map(emp => emp.id)
        }
        
        if (employeesToApply.length === 0) {
            return // No employees to apply rates to
        }
        
        // Create default tasks for each employee with the specified rates
        const tasksToCreate = []
        
        for (const employeeId of employeesToApply) {
            if (rvRate > 0) {
                tasksToCreate.push({
                    name: 'Task RV mặc định',
                    description: 'Task RV được tạo tự động với rate hàng loạt',
                    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
                    priority: 'medium',
                    status: 'pending',
                    project_id: projectId,
                    assignee_id: employeeId,
                    task_type: 'rv',
                    rate: rvRate,
                    created_at: new Date().toISOString()
                })
            }
            
            if (betaRate > 0) {
                tasksToCreate.push({
                    name: 'Task Beta mặc định',
                    description: 'Task Beta được tạo tự động với rate hàng loạt',
                    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days from now
                    priority: 'medium',
                    status: 'pending',
                    project_id: projectId,
                    assignee_id: employeeId,
                    task_type: 'beta',
                    beta_rate: betaRate,
                    created_at: new Date().toISOString()
                })
            }
        }
        
        if (tasksToCreate.length > 0) {
            const { error } = await supabase
                .from('tasks')
                .insert(tasksToCreate)
            
            if (error) throw error
            
            showNotification(`Đã tạo ${tasksToCreate.length} task với rate hàng loạt cho dự án mới!`, 'success')
        }
        
    } catch (error) {
        console.error('Error applying bulk rates for new project:', error)
        showNotification('Lỗi khi tạo task với rate hàng loạt cho dự án mới', 'error')
    }
}

async function saveProject() {
    const id = document.getElementById('projectId').value
    
    if (id) {
        // Update existing project
        await updateProject()
    } else {
        // Add new project
        await addProject()
    }
}

async function updateProject() {
    const id = parseInt(document.getElementById('projectId').value)
    const name = document.getElementById('projectName').value
    const description = document.getElementById('projectDescription').value
    const status = document.getElementById('projectStatus').value
    const managerId = document.getElementById('projectManager').value
    const storyLink = document.getElementById('projectStoryLink').value
    const ruleLink = document.getElementById('projectRuleLink').value
    const bnvLink = document.getElementById('projectBnvLink').value
    const dialogueLink = document.getElementById('projectDialogueLink').value
    
    // Validate input
    if (!name) {
        showNotification('Vui lòng điền Tên Truyện', 'error')
        return
    }
    
    try {
        const { error } = await supabase
            .from('projects')
            .update({
                name: name,
                description: description,
                status: status,
                manager_id: managerId || null,
                story_link: storyLink || null,
                rule_link: ruleLink || null,
                bnv_link: bnvLink || null,
                dialogue_link: dialogueLink || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
        
        if (error) throw error
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('projectModal'))
        modal.hide()
        
        showNotification('Cập nhật dự án thành công!', 'success')
        
        // Clear form
        document.getElementById('projectForm').reset()
        document.getElementById('projectModalTitle').textContent = 'Thêm Truyện'
        
    } catch (error) {
        console.error('Error updating project:', error)
        showNotification('Lỗi cập nhật dự án', 'error')
    }
}

async function deleteProject(id) {
    const project = projects.find(p => p.id === id)
    if (!project) return
    
    // Check if user can operate on this project
    if (!canOperateOnProject(project)) {
        showNotification('Bạn không có quyền xóa dự án này', 'error')
        return
    }
    
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này?')) return
    
    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)
        
        if (error) throw error
        
        showNotification('Xóa dự án thành công!', 'success')
        
    } catch (error) {
        console.error('Error deleting project:', error)
        showNotification('Lỗi xóa dự án', 'error')
    }
}

// Task Management
async function addTask() {
    console.log('addTask() called')
    console.log('currentUser:', currentUser)
    console.log('currentTaskType:', currentTaskType)
    console.log('currentProjectId:', currentProjectId)
    
    const nameInput = document.getElementById('taskName');
    const deadlineInput = document.getElementById('taskDeadline');
    const priorityInput = document.getElementById('taskPriority');
    const projectId = currentProjectId || (document.getElementById('taskProjectId') ? document.getElementById('taskProjectId').value : null);
    const isBatch = document.getElementById('batchCreateCheckbox')?.checked;
    const batchCount = parseInt(document.getElementById('batchCount')?.value) || 1;
    const batchStart = parseInt(document.getElementById('batchStart')?.value) || 1;
    const name = nameInput ? nameInput.value : '';
    const deadline = deadlineInput ? deadlineInput.value : '';
    const priority = priorityInput ? priorityInput.value : '';

    console.log('Form values:', { name, deadline, priority, projectId, currentTaskType })

    if (!name || !deadline || !projectId) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error')
        return
    }
    
    // Kiểm tra xem dự án có đã hoàn thành không (cho nhân viên)
    if (currentUser && currentUser.role === 'employee') {
        const project = projects.find(p => p.id === parseInt(projectId))
        if (project && project.status === 'completed') {
            showNotification('Không thể Thêm Deadline vào dự án đã hoàn thành', 'error')
            return
        }
    }
    try {
        // Get additional form values
        const description = document.getElementById('taskDescription')?.value || ''
        const submissionLink = document.getElementById('taskSubmissionLink')?.value || ''
        const betaLink = document.getElementById('taskBetaLink')?.value || ''
        const assigneeId = document.getElementById('taskAssignee')?.value || null
        const dialogueChars = document.getElementById('taskDialogueChars')?.value || null
        const totalChars = document.getElementById('taskTotalChars')?.value || null
        const rvChars = document.getElementById('taskRVChars')?.value || null
        const betaChars = document.getElementById('taskBetaChars')?.value || null
        const rate = document.getElementById('taskRate')?.value || null
        const betaRate = document.getElementById('taskBetaRate')?.value || null
        const notes = document.getElementById('taskNotes')?.value || ''
        const betaNotes = document.getElementById('taskBetaNotes')?.value || ''
        
        let insertData = []
        if (isBatch && batchCount > 1) {
            for (let i = 0; i < batchCount; i++) {
                insertData.push({
                    name: name + ' ' + (batchStart + i),
                    description: description,
                    deadline: new Date(deadline).toISOString(),
                    priority: priority,
                    status: 'pending',
                    project_id: parseInt(projectId),
                    task_type: currentTaskType,
                    submission_link: submissionLink || null,
                    beta_link: betaLink || null,
                    assignee_id: assigneeId,
                    dialogue_chars: dialogueChars ? parseInt(dialogueChars) : null,
                    total_chars: totalChars ? parseInt(totalChars) : null,
                    rv_chars: rvChars ? parseInt(rvChars) : null,
                    beta_chars: betaChars ? parseInt(betaChars) : null,
                    rate: rate ? parseFloat(rate) : null,
                    beta_rate: betaRate ? parseFloat(betaRate) : null,
                    notes: notes,
                    beta_notes: betaNotes,
                    created_at: new Date().toISOString()
                })
            }
        } else {
            insertData.push({
                name: name,
                description: description,
                deadline: new Date(deadline).toISOString(),
                priority: priority,
                status: 'pending',
                project_id: parseInt(projectId),
                task_type: currentTaskType,
                submission_link: submissionLink || null,
                beta_link: betaLink || null,
                assignee_id: assigneeId,
                dialogue_chars: dialogueChars ? parseInt(dialogueChars) : null,
                total_chars: totalChars ? parseInt(totalChars) : null,
                rv_chars: rvChars ? parseInt(rvChars) : null,
                beta_chars: betaChars ? parseInt(betaChars) : null,
                rate: rate ? parseFloat(rate) : null,
                beta_rate: betaRate ? parseFloat(betaRate) : null,
                notes: notes,
                beta_notes: betaNotes,
                created_at: new Date().toISOString()
            })
        }
        const { data, error } = await supabase
            .from('tasks')
            .insert(insertData)
            .select()
        if (error) throw error
        
        // Re-render appropriate table
        if (currentTaskType === 'beta') {
            renderBetaTasksTable()
        } else {
            renderTasksTable()
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'))
        modal.hide()
        showNotification('Thêm Deadline thành công!', 'success')
        // Remove form reset - not needed since modal is already closed
        // This was causing race conditions when users quickly clicked to edit another task
    } catch (error) {
        console.error('Error adding task:', error)
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        })
        showNotification('Lỗi Thêm Deadline: ' + error.message, 'error')
    }
}

// Nhận công việc (Employee nhận task)
async function claimTask(taskId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để nhận công việc', 'error')
        return
    }
    
    try {
        console.log('Claiming task:', taskId)
        console.log('Current user:', currentUser)
        
        // Kiểm tra task hiện tại
        const currentTask = tasks.find(t => t.id === taskId)
        if (!currentTask) {
            showNotification('Không tìm thấy công việc', 'error')
            return
        }
        
        if (currentTask.assignee_id) {
            showNotification('Công việc đã được nhận bởi người khác', 'error')
            return
        }
        
        // Kiểm tra xem task có thuộc dự án đã hoàn thành không (cho nhân viên)
        if (currentUser.role === 'employee') {
            const project = projects.find(p => p.id === currentTask.project_id)
            if (project && project.status === 'completed') {
                showNotification('Không thể nhận Deadline trong truyện đã hoàn thành', 'error')
                return
            }
        }
        
        console.log('Current task before update:', currentTask)
        
        // Thực hiện update với điều kiện assignee_id IS NULL
        console.log('Updating task with user ID:', currentUser.id)
        const { data, error } = await supabase
            .from('tasks')
            .update({
                assignee_id: currentUser.id,
                status: 'in-progress',
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .is('assignee_id', null) // Chỉ update nếu chưa có người nhận
            .select()
        
        if (error) {
            console.error('Supabase error:', error)
            throw error
        }
        
        console.log('Update result:', data)
        
        if (data && data.length > 0) {
            showNotification('Đã nhận công việc thành công!', 'success')
            
            // Cập nhật local data ngay lập tức
            const updatedTask = data[0]
            console.log('Updated task:', updatedTask)
            
            // Tìm và cập nhật task trong mảng local
            const taskIndex = tasks.findIndex(t => t.id === taskId)
            if (taskIndex !== -1) {
                tasks[taskIndex] = updatedTask
                console.log('Updated local task at index:', taskIndex)
                console.log('Updated task data:', tasks[taskIndex])
            }
            
            // Re-render appropriate table after a short delay
            console.log('Re-rendering table...')
            setTimeout(() => {
                if (currentTaskType === 'beta') {
                    renderBetaTasksTable()
                } else {
                    renderTasksTable()
                }
            }, 100)
            
        } else {
            console.log('No rows updated - task may have been claimed by someone else')
            showNotification('Công việc đã được nhận bởi người khác', 'error')
        }
        
    } catch (error) {
        console.error('Error claiming task:', error)
        showNotification('Lỗi nhận công việc', 'error')
    }
}

// Chuyển giao công việc
async function transferTask(taskId, newAssigneeId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập', 'error')
        return
    }
    
    const task = tasks.find(t => t.id === taskId)
    if (!task) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check permissions - Boss can transfer any task, others can only transfer their own
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền chuyển giao công việc này', 'error')
        return
    }
    
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                assignee_id: newAssigneeId,
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
            showNotification('Chuyển giao công việc thành công!', 'success')
            
            // Cập nhật local data ngay lập tức
            const updatedTask = data[0]
            const taskIndex = tasks.findIndex(t => t.id === taskId)
            if (taskIndex !== -1) {
                tasks[taskIndex] = updatedTask
            }
            
            // Re-render table ngay lập tức
            renderTasksTable()
        } else {
            showNotification('Không thể chuyển giao công việc', 'error')
        }
        
    } catch (error) {
        console.error('Error transferring task:', error)
        showNotification('Lỗi chuyển giao công việc', 'error')
    }
}

// Hủy nhận công việc (trả về trạng thái chưa có người nhận)
async function unclaimTask(taskId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập', 'error')
        return
    }
    
    const task = tasks.find(t => t.id === taskId)
    if (!task) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check permissions - Boss can unclaim any task, others can only unclaim their own
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền hủy nhận công việc này', 'error')
        return
    }
    
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                assignee_id: null,
                status: 'pending',
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
            showNotification('Đã hủy nhận công việc!', 'success')
            
            // Cập nhật local data ngay lập tức
            const updatedTask = data[0]
            const taskIndex = tasks.findIndex(t => t.id === taskId)
            if (taskIndex !== -1) {
                tasks[taskIndex] = updatedTask
            }
            
            // Re-render appropriate table after a short delay
            setTimeout(() => {
                if (currentTaskType === 'beta') {
                    renderBetaTasksTable()
                } else {
                    renderTasksTable()
                }
            }, 100)
        } else {
            showNotification('Không thể hủy nhận công việc', 'error')
        }
        
    } catch (error) {
        console.error('Error unclaiming task:', error)
        showNotification('Lỗi hủy nhận công việc', 'error')
    }
}

async function editTask(id) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    
    // Kiểm tra xem task có thuộc dự án đã hoàn thành không (cho nhân viên)
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể chỉnh sửa Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền chỉnh sửa công việc này', 'error')
        return
    }
    // Fill form with null checks
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    document.getElementById('taskId').value = task.id
    setVal('taskName', task.name || '')
    setVal('taskDescription', task.description || '')
    setVal('taskDeadline', task.deadline ? task.deadline.slice(0, 16) : '')
    setVal('taskPriority', task.priority || '')
    setVal('taskStatus', task.status || '')
    setVal('taskSubmissionLink', task.submission_link || '')
    setVal('taskBetaLink', task.beta_link || '')
    setVal('taskDialogueChars', task.dialogue_chars || '')
    setVal('taskTotalChars', task.total_chars || '')
    setVal('taskRVChars', task.rv_chars || '')
    setVal('taskBetaChars', task.beta_chars || '')
    setVal('taskRate', task.rate || '')
    setVal('taskBetaRate', task.beta_rate || '')
    setVal('taskNotes', task.notes || '')
    setVal('taskBetaNotes', task.beta_notes || '')
    document.getElementById('taskStatusField').style.display = 'block'
    document.getElementById('taskModalTitle').textContent = 'Chỉnh sửa Công việc'
    updateAssigneeDropdowns()
    
    // Show/hide fields based on task type
    const isBetaTask = task.task_type === 'beta'
    const notesField = document.getElementById('taskNotes').parentElement
    const betaNotesField = document.getElementById('betaNotesField')
    
    if (isBetaTask) {
        if (notesField) notesField.style.display = 'none'
        if (betaNotesField) betaNotesField.style.display = ''
    } else {
        if (notesField) notesField.style.display = ''
        if (betaNotesField) betaNotesField.style.display = 'none'
    }
    const assigneeEl = document.getElementById('taskAssignee');
    if (assigneeEl) assigneeEl.value = task.assignee_id || '';
    const isEmployee = currentUser.role === 'employee'
    const nameEl = document.getElementById('taskName');
    const deadlineEl = document.getElementById('taskDeadline');
    const priorityEl = document.getElementById('taskPriority');
    const priorityNote = document.getElementById('priorityNote');
    const rateEl = document.getElementById('taskRate');
    const batchCheckboxEl = document.getElementById('batchCreateCheckbox');
    const batchCountEl = document.getElementById('batchCount');
    const batchStartEl = document.getElementById('batchStart');
    
    if (nameEl) nameEl.readOnly = isEmployee;
    if (deadlineEl) deadlineEl.readOnly = isEmployee;
    if (priorityEl) priorityEl.disabled = isEmployee;
    if (priorityNote) priorityNote.style.display = isEmployee ? 'inline' : 'none';
    if (rateEl) rateEl.readOnly = isEmployee;
    if (batchCheckboxEl) batchCheckboxEl.disabled = isEmployee;
    if (batchCountEl) batchCountEl.readOnly = isEmployee;
    if (batchStartEl) batchStartEl.readOnly = isEmployee;
    
    // Set field permissions based on task type
    setFieldPermissions(task.task_type || 'rv')
    
    const modal = new bootstrap.Modal(document.getElementById('taskModal'))
    modal.show()
}

async function saveTask() {
    const id = document.getElementById('taskId').value
    
    if (id) {
        // Update existing task
        if (currentTaskType === 'beta') {
            await updateBetaTask()
        } else {
            await updateTask()
        }
    } else {
        // Add new task
        await addTask()
    }
}

async function updateTask() {
    const id = parseInt(document.getElementById('taskId').value)
    const name = document.getElementById('taskName').value
    const description = document.getElementById('taskDescription').value
    const deadline = document.getElementById('taskDeadline').value
    const priority = document.getElementById('taskPriority').value
    const assigneeId = document.getElementById('taskAssignee').value
    const status = document.getElementById('taskStatus').value
    
    // New fields
    const submissionLink = document.getElementById('taskSubmissionLink').value
    const betaLink = document.getElementById('taskBetaLink').value
    const dialogueChars = document.getElementById('taskDialogueChars').value
    const totalChars = document.getElementById('taskTotalChars').value
    const rvChars = document.getElementById('taskRVChars').value
    const betaChars = document.getElementById('taskBetaChars').value
    const rate = document.getElementById('taskRate').value
    const betaRate = document.getElementById('taskBetaRate').value
    const notes = document.getElementById('taskNotes').value
    const betaNotes = document.getElementById('taskBetaNotes').value
    
    // Validate input
    if (!name || !deadline) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error')
        return
    }
    
    // Find the task to check permissions
    const task = tasks.find(t => t.id === id)
    if (!task) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check permissions - Boss, Manager, hoặc người đang làm task
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền cập nhật công việc này', 'error')
        return
    }
    
    // Kiểm tra xem task có thuộc dự án đã hoàn thành không (cho nhân viên)
    if (currentUser && currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể cập nhật Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                name: name,
                description: description,
                deadline: new Date(deadline).toISOString(),
                priority: priority,
                assignee_id: assigneeId || null, // Có thể null
                status: status,
                submission_link: submissionLink || null,
                beta_link: betaLink || null,
                dialogue_chars: dialogueChars ? parseInt(dialogueChars) : null,
                total_chars: totalChars ? parseInt(totalChars) : null,
                rv_chars: rvChars ? parseInt(rvChars) : null,
                beta_chars: betaChars ? parseInt(betaChars) : null,
                rate: rate ? parseFloat(rate) : null,
                beta_rate: betaRate ? parseFloat(betaRate) : null,
                notes: notes || null,
                beta_notes: betaNotes || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
            // Cập nhật local data ngay lập tức
            const updatedTask = data[0]
            const taskIndex = tasks.findIndex(t => t.id === id)
            if (taskIndex !== -1) {
                tasks[taskIndex] = updatedTask
            }
            
            // Close modal first
            const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'))
            if (modal) {
                modal.hide()
            }
            
            // Re-render table after modal is closed
            setTimeout(() => {
                if (currentTaskType === 'beta') {
                    renderBetaTasksTable()
                } else {
                    renderTasksTable()
                }
            }, 100)
            
            showNotification('Cập nhật công việc thành công!', 'success')
            
            // Remove form reset and title change - not needed since modal is already closed
            // This was causing race conditions when users quickly clicked to edit another task
        } else {
            showNotification('Không thể cập nhật công việc', 'error')
        }
        
    } catch (error) {
        console.error('Error updating task:', error)
        showNotification('Lỗi cập nhật công việc', 'error')
    }
}

async function deleteTask(id) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    
    // Kiểm tra xem task có thuộc dự án đã hoàn thành không (cho nhân viên)
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể xóa Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    // Check permissions - Boss, Manager, hoặc người đang làm task
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền xóa công việc này', 'error')
        return
    }
    
    if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
        try {
            // Trước tiên, xóa tất cả task con (child tasks) nếu có
            const childTasks = tasks.filter(t => t.parent_task_id === id)
            if (childTasks.length > 0) {
                console.log(`Xóa ${childTasks.length} task con trước khi xóa task cha`)
                
                for (const childTask of childTasks) {
                    const { error: childError } = await supabase
                        .from('tasks')
                        .delete()
                        .eq('id', childTask.id)
                    
                    if (childError) {
                        console.error('Error deleting child task:', childError)
                        throw childError
                    }
                }
                
                // Cập nhật local data - xóa task con
                tasks = tasks.filter(t => t.parent_task_id !== id)
            }
            
            // Sau đó xóa task cha
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id)
            
            if (error) throw error
            
            // Remove from local data
            tasks = tasks.filter(t => t.id !== id)
            
            // Re-render appropriate table after a short delay
            setTimeout(() => {
                if (currentTaskType === 'beta') {
                    renderBetaTasksTable()
                } else {
                    renderTasksTable()
                }
            }, 100)
            
            showNotification('Xóa công việc thành công!', 'success')
            
        } catch (error) {
            console.error('Error deleting task:', error)
            showNotification('Lỗi xóa công việc', 'error')
        }
    }
}

async function changeTaskStatus(id, newStatus) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    
    // Kiểm tra xem task có thuộc dự án đã hoàn thành không (cho nhân viên)
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể thay đổi trạng thái Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    // Check permissions - Boss, Manager, hoặc người đang làm task
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền thay đổi trạng thái công việc này', 'error')
        return
    }
    
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
        
        if (error) throw error
        
        if (data && data.length > 0) {
            showNotification('Cập nhật trạng thái thành công!', 'success')
            
            // Cập nhật local data ngay lập tức
            const updatedTask = data[0]
            const taskIndex = tasks.findIndex(t => t.id === id)
            if (taskIndex !== -1) {
                tasks[taskIndex] = updatedTask
            }
            
            // Re-render appropriate table
            if (currentTaskType === 'beta') {
                renderBetaTasksTable()
            } else {
                renderTasksTable()
            }
        } else {
            showNotification('Không thể cập nhật trạng thái', 'error')
        }
        
    } catch (error) {
        console.error('Error updating task status:', error)
        showNotification('Lỗi cập nhật trạng thái', 'error')
    }
}

// UI Functions
function renderProjectsTable() {
    const tbody = document.getElementById('projectsTableBody')
    tbody.innerHTML = ''
    
    console.log('Rendering projects table with', filteredProjects.length, 'projects')
    console.log('Current tasks array has', tasks.length, 'tasks')
    
    if (filteredProjects.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-project-diagram"></i>
                        <h4>Không có dự án nào</h4>
                        <p>Hãy Thêm Truyện đầu tiên để bắt đầu</p>
                    </div>
                </td>
            </tr>
        `
        return
    }
    
    filteredProjects.forEach(project => {
        const row = document.createElement('tr')
        
        // Add row class based on status
        if (project.status === 'completed') {
            row.classList.add('table-row-completed')
        } else if (project.status === 'paused') {
            row.classList.add('table-row-paused')
        }
        
        // Get task count for this project - fix the count display
        const taskCount = tasks.filter(t => t.project_id === project.id).length
        console.log(`Project ${project.id} (${project.name}): ${taskCount} tasks found`)
        
        row.innerHTML = `
            <td>${project.id}</td>
            <td>
                <a href="#" onclick="selectProject(${project.id})" class="text-decoration-none">
                    <strong>${project.name}</strong>
                </a>
            </td>
            <td>${project.description || '-'}</td>
            <td>${getProjectStatusBadge(project.status)}</td>
            <td>${project.manager?.name || 'N/A'}</td>
            <td>${formatDateTime(project.created_at)}</td>
            <td><span class="badge bg-info">${taskCount} công việc</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    ${hasManagerOrBossPermissions(currentUser) ? 
                        `<button class="btn btn-outline-info btn-sm" onclick="showProjectReport(${project.id})" title="Báo cáo dự án">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="btn btn-outline-success btn-sm" onclick="downloadBetaFiles(${project.id})" title="Tải file Beta">
                            <i class="fas fa-download"></i>
                        </button>` : ''
                    }
                    ${canOperateOnProject(project) ? 
                        `<button class="btn btn-outline-warning btn-sm" onclick="editProject(${project.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteProject(${project.id})">
                            <i class="fas fa-trash"></i>
                        </button>` : ''
                    }
                </div>
            </td>
        `
        
        tbody.appendChild(row)
    })
}

function renderTasksTable() {
    const tbody = document.getElementById('tasksTableBody')
    tbody.innerHTML = ''
    if (!currentProjectId) {
        tbody.innerHTML = `<tr><td colspan="12" class="text-center"><div class="empty-state"><i class="fas fa-tasks"></i><h4>Chưa chọn dự án</h4><p>Vui lòng chọn một dự án để xem công việc</p></div></td></tr>`
        return
    }
    // Lọc theo trạng thái và người thực hiện
    const statusFilter = document.getElementById('taskStatusFilter')?.value || ''
    const assigneeFilter = document.getElementById('taskAssigneeFilter')?.value || ''
    
    console.log('Filtering tasks...')
    console.log('Status filter:', statusFilter)
    console.log('Assignee filter:', assigneeFilter)
    console.log('Current project ID:', currentProjectId)
    console.log('Total tasks:', tasks.length)
    
    let projectTasks = tasks.filter(t => t.project_id === currentProjectId && t.task_type === 'rv')
    console.log('Tasks in current project:', projectTasks.length)
    
    if (statusFilter) {
        projectTasks = projectTasks.filter(t => t.status === statusFilter)
        console.log('After status filter:', projectTasks.length)
    }
    if (assigneeFilter) {
        projectTasks = projectTasks.filter(t => String(t.assignee_id) === assigneeFilter)
        console.log('After assignee filter:', projectTasks.length)
    }
    
    // Sắp xếp theo tên deadline A-Z
    projectTasks.sort((a, b) => {
        const extractNumber = (name) => {
            const match = (name || '').match(/\d+/)
            return match ? parseInt(match[0], 10) : null
        }
        const numA = extractNumber(a.name)
        const numB = extractNumber(b.name)
        if (numA !== null && numB !== null) {
            return numA - numB
        }
        return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' })
    })    
    
    if (projectTasks.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" class="text-center"><div class="empty-state"><i class="fas fa-tasks"></i><h4>Không có công việc nào</h4><p>Hãy Thêm Deadline đầu tiên cho dự án này</p></div></td></tr>`
        return
    }
    projectTasks.forEach(task => {
        const row = document.createElement('tr')
        // Xác định trạng thái deadline
        let deadline = new Date(task.deadline);
        let now = new Date();
        const isCompleted = task.status === 'completed';
        const isOverdue = deadline < now && !isCompleted;
        const timeLeft = deadline - now;
        // Xóa các class cũ
        row.className = '';
        // Chỉ giữ lại class priority nếu cần
        if (task.priority === 'urgent') {
            row.classList.add('table-row-urgent');
        } else if (task.priority === 'high') {
            row.classList.add('table-row-high');
        }
        const assignee = window.allEmployees.find(e => e.id === task.assignee_id)
        const assigneeName = assignee ? assignee.name : 'Chưa có người nhận'
        const isCurrentUserAssignee = currentUser && currentUser.id === task.assignee_id
        const canClaim = currentUser && !task.assignee_id && currentUser.role === 'employee'
        
        // Lấy rank và màu sắc cho người thực hiện
        const assigneeRank = getEmployeeRank(task.assignee_id)
        const assigneeColorClass = getAssigneeColorClass(assigneeRank)
        const submissionLink = task.submission_link ? `<a href="${task.submission_link}" target="_blank" class="text-primary"><i class="fas fa-external-link-alt me-1"></i>Xem</a>` : '<span class="text-muted">-</span>'
        const dialogueChars = task.dialogue_chars ? `<span class="badge badge-gradient-blue">${task.dialogue_chars.toLocaleString()}</span>` : '<span class="text-muted">-</span>'
        const totalChars = task.total_chars ? `<span class="badge badge-gradient-green">${task.total_chars.toLocaleString()}</span>` : '<span class="text-muted">-</span>'
        const rvChars = task.rv_chars ? `<span class="badge badge-gradient-yellow">${task.rv_chars.toLocaleString()}</span>` : '<span class="text-muted">-</span>'
        // Thành tiền = rate * rv_chars
        let payment = '<span class="text-muted">-</span>';
        if (typeof task.rate === 'number' && typeof task.rv_chars === 'number' && !isNaN(task.rate) && !isNaN(task.rv_chars)) {
            const money = Math.round((task.rate * task.rv_chars) / 1000);
            payment = `<span class="badge badge-money">${money.toLocaleString('vi-VN')}đ</span>`;
        }
        // Format notes with link if extensive
        let notesDisplay = '<span class="text-muted">-</span>'
        if (task.notes && task.notes.trim()) {
            if (task.notes.length > 100) {
                notesDisplay = `<a href="task-notes.html?taskId=${task.id}&type=rv" target="_blank" class="btn btn-sm btn-outline-info"><i class="fas fa-sticky-note"></i> Xem ghi chú RV</a>`
            } else {
                notesDisplay = `<span title="${task.notes}">${task.notes.substring(0, 50)}${task.notes.length > 50 ? '...' : ''}</span>`
            }
        }
        // Nút thao tác
        let actionButtons = '';
        
        // Kiểm tra xem dự án hiện tại có đã hoàn thành không
        const currentProject = projects.find(p => p.id === currentProjectId);
        const isCompletedProject = currentProject && currentProject.status === 'completed';
        
        if (currentUser && (isBoss(currentUser) || (currentUser.role === 'manager' && canOperateOnTask(task)))) {
            actionButtons += `<button class="btn btn-action btn-edit" onclick="editTask(${task.id})" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>`;
            actionButtons += `<button class="btn btn-action btn-delete" onclick="deleteTask(${task.id})" title="Xóa"><i class="fas fa-trash"></i></button>`;
        } else if (currentUser && currentUser.role === 'employee') {
            // Nhân viên không thể thao tác với Deadline trong truyện đã hoàn thành
            if (!isCompletedProject) {
                if (isCurrentUserAssignee) {
                    actionButtons += `<button class="btn btn-action btn-edit" onclick="editTask(${task.id})" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>`;
                } else if (!task.assignee_id) {
                    actionButtons += `<button class="btn btn-action btn-claim" onclick="claimTask(${task.id})" title="Nhận công việc"><i class="fas fa-hand-pointer"></i> Nhận</button>`;
                }
            }
            // Không hiển thị nút xóa, unclaim, chuyển trạng thái, chuyển giao cho nhân viên
        }
        // Countdown deadline
        let countdown = '';
        if (isNaN(deadline.getTime())) {
            countdown = '<span class="text-muted">-</span>';
        } else if (isCompleted) {
            countdown = '<span class="badge bg-success">Hoàn thành</span>';
        } else if (deadline < now) {
            countdown = '<span class="badge bg-danger">Quá hạn</span>';
        } else if (timeLeft < 10 * 60 * 60 * 1000) {
            countdown = `<span class="countdown-timer bg-danger text-white" data-deadline="${task.deadline}" data-taskid="${task.id}"></span>`;
        } else {
            countdown = `<span class="countdown-timer" data-deadline="${task.deadline}" data-taskid="${task.id}"></span>`;
        }
        row.innerHTML = `
            <td>${countdown}</td>
            <td><strong>${task.name}</strong></td>
            <td>${getTaskStatusBadge(task.status)}</td>
            <td>${getPriorityBadge(task.priority)}</td>
            <td>${submissionLink}</td>
            <td>${dialogueChars}</td>
            <td>${totalChars}</td>
            <td>${rvChars}</td>
            <td>${payment}</td>
            <td><span class="${task.assignee_id ? assigneeColorClass : 'text-muted'}">${assigneeName}</span></td>
            <td>${notesDisplay}</td>
            <td><div class="btn-group-actions">${actionButtons}</div></td>`
        tbody.appendChild(row)
    })
    updateAllCountdowns();
}

function selectProject(projectId) {
    // Switch to tasks view
    showTasksView(projectId)
}

function updateDashboard() {
    const totalProjects = projects.length
    const totalTasks = tasks.length
    const activeProjects = projects.filter(p => p.status === 'active').length
    const completedProjects = projects.filter(p => p.status === 'completed').length
    
    document.getElementById('totalProjects').textContent = totalProjects
    document.getElementById('totalTasks').textContent = totalTasks
    document.getElementById('activeProjects').textContent = activeProjects
    document.getElementById('completedProjects').textContent = completedProjects
}

function updateManagerFilter(managers) {
    const managerSelect = document.getElementById('managerFilter')
    managerSelect.innerHTML = '<option value="">Tất cả</option>'
    
    managers.forEach(manager => {
        const option = document.createElement('option')
        option.value = manager.id
        option.textContent = manager.name
        managerSelect.appendChild(option)
    })
}

// Filter Functions
function applyProjectFilters() {
    const statusFilter = document.getElementById('projectStatusFilter').value
    const managerFilter = document.getElementById('managerFilter').value
    
    filteredProjects = projects.filter(project => {
        let matches = true
        
        if (statusFilter && project.status !== statusFilter) {
            matches = false
        }
        
        if (managerFilter && project.manager_id !== managerFilter) {
            matches = false
        }
        
        return matches
    })
    
    renderProjectsTable()
}

function setupTaskFilters() {
    const statusFilter = document.getElementById('taskStatusFilter')
    const assigneeFilter = document.getElementById('taskAssigneeFilter')
    if (statusFilter) statusFilter.onchange = renderTasksTable
    if (assigneeFilter) assigneeFilter.onchange = renderTasksTable
    updateTaskAssigneeFilter();
}

// Utility Functions
function formatDateTime(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN')
}

function getProjectStatusBadge(status) {
    const badges = {
        'active': '<span class="badge badge-active">Đang hoạt động</span>',
        'paused': '<span class="badge badge-paused">Tạm dừng</span>',
        'completed': '<span class="badge badge-completed">Hoàn thành</span>'
    }
    return badges[status] || ''
}

function getTaskStatusBadge(status) {
    const badges = {
        'pending': '<span class="badge badge-pending">Chờ thực hiện</span>',
        'in-progress': '<span class="badge badge-in-progress">Đang thực hiện</span>',
        'completed': '<span class="badge badge-completed">Hoàn thành</span>',
        'overdue': '<span class="badge badge-overdue">Quá hạn</span>'
    }
    return badges[status] || ''
}

function getPriorityBadge(priority) {
    const badges = {
        'low': '<span class="badge badge-priority-low">Thấp</span>',
        'medium': '<span class="badge badge-priority-medium">Trung bình</span>',
        'high': '<span class="badge badge-priority-high">Cao</span>',
        'urgent': '<span class="badge badge-priority-urgent">Khẩn cấp</span>'
    }
    return badges[priority] || ''
}

function showNotification(message, type = 'info') {
    const toast = document.getElementById('notificationToast')
    const toastTitle = document.getElementById('toastTitle')
    const toastMessage = document.getElementById('toastMessage')
    
    // Set title and message
    toastTitle.textContent = type === 'error' ? 'Lỗi' : 
                           type === 'success' ? 'Thành công' : 
                           type === 'warning' ? 'Cảnh báo' : 'Thông báo'
    toastMessage.textContent = message
    
    // Set toast class with new optimized styling
    toast.className = `toast toast-${type}`
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast)
    bsToast.show()
}

// Modal Functions
function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'))
    modal.show()
}

function hideAllContent() {
    // Hide all main content sections
    const mainContent = document.getElementById('mainContent')
    const projectsView = document.getElementById('projectsView')
    const tasksView = document.getElementById('tasksView')
    const dashboardView = document.getElementById('dashboardView')
    
    if (mainContent) mainContent.style.display = 'none'
    if (projectsView) projectsView.style.display = 'none'
    if (tasksView) tasksView.style.display = 'none'
    if (dashboardView) dashboardView.style.display = 'none'
    
    // Show login message
    const loginMessage = document.getElementById('loginMessage')
    if (loginMessage) {
        loginMessage.style.display = 'block'
        loginMessage.innerHTML = `
            <div class="text-center mt-5">
                <h3><i class="fas fa-lock text-warning"></i> Yêu cầu đăng nhập</h3>
                <p class="text-muted">Vui lòng đăng nhập để truy cập hệ thống quản lý dự án.</p>
                <button class="btn btn-primary" onclick="showLoginModal()">
                    <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
                </button>
            </div>
        `
    }
}

async function showAddProjectModal() {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để Thêm Truyện', 'error')
        return
    }
    
    // Clear form
    document.getElementById('projectForm').reset()
    document.getElementById('projectId').value = ''
    document.getElementById('projectModalTitle').textContent = 'Thêm Truyện'
    
    // Clear link fields
    document.getElementById('projectStoryLink').value = ''
    document.getElementById('projectRuleLink').value = ''
    document.getElementById('projectBnvLink').value = ''
    document.getElementById('projectDialogueLink').value = ''
    
    // Clear bulk rate fields
    document.getElementById('projectRVRate').value = ''
    document.getElementById('projectBetaRate').value = ''
    document.getElementById('projectRateTarget').value = 'all'
    document.getElementById('individualEmployeeSection').style.display = 'none'
    document.getElementById('projectEmployeeSelect').innerHTML = ''
    
    // Populate manager dropdown
    populateManagerDropdown()
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('projectModal'))
    modal.show()
    
    // Setup bulk rate functionality for new project
    await setupBulkRateFunctionality(null)
}

// Function to populate manager dropdown
async function populateManagerDropdown() {
    try {
        const { data: managers, error } = await supabase
            .from('employees')
            .select('id, name')
            .in('role', ['manager', 'boss'])
            .order('name')
        
        if (error) throw error
        
        const managerSelect = document.getElementById('projectManager')
        managerSelect.innerHTML = '<option value="">Chọn người quản lý...</option>'
        
        managers.forEach(manager => {
            const option = document.createElement('option')
            option.value = manager.id
            option.textContent = manager.name
            managerSelect.appendChild(option)
        })
        
    } catch (error) {
        console.error('Error loading managers:', error)
        showNotification('Lỗi tải danh sách người quản lý', 'error')
    }
}

function toggleBatchCreate() {
    const checked = document.getElementById('batchCreateCheckbox').checked
    document.querySelectorAll('.batch-hide').forEach(el => {
        el.style.display = checked ? 'none' : ''
    })
    document.getElementById('batchCountGroup').style.display = checked ? '' : 'none'
    document.getElementById('batchStartGroup').style.display = checked ? '' : 'none'
}

function showAddTaskModal() {
    console.log('showAddTaskModal() called')
    console.log('currentUser:', currentUser)
    console.log('currentProjectId:', currentProjectId)
    
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để Thêm Deadline', 'error')
        return
    }
    if (!currentProjectId) {
        showNotification('Vui lòng chọn một dự án trước', 'error')
        return
    }
    
    // Kiểm tra xem dự án có đã hoàn thành không (cho nhân viên)
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === currentProjectId)
        if (project && project.status === 'completed') {
            showNotification('Không thể Thêm Deadline vào dự án đã hoàn thành', 'error')
            return
        }
    }
    document.getElementById('taskForm').reset()
    document.getElementById('taskId').value = ''
    document.getElementById('taskProjectId').value = currentProjectId
    document.getElementById('taskStatusField').style.display = 'none'
    document.getElementById('taskModalTitle').textContent = 'Thêm Deadline'
    updateAssigneeDropdowns()
    
    // Handle field restrictions for employees
    const isEmployee = currentUser.role === 'employee'
    const priorityEl = document.getElementById('taskPriority');
    const priorityNote = document.getElementById('priorityNote');
    const nameEl = document.getElementById('taskName');
    const deadlineEl = document.getElementById('taskDeadline');
    const rateEl = document.getElementById('taskRate');
    const batchCheckboxEl = document.getElementById('batchCreateCheckbox');
    const batchCountEl = document.getElementById('batchCount');
    const batchStartEl = document.getElementById('batchStart');
    
    if (priorityEl) priorityEl.disabled = isEmployee;
    if (priorityNote) priorityNote.style.display = isEmployee ? 'inline' : 'none';
    if (nameEl) nameEl.readOnly = isEmployee;
    if (deadlineEl) deadlineEl.readOnly = isEmployee;
    if (rateEl) rateEl.readOnly = isEmployee;
    if (batchCheckboxEl) batchCheckboxEl.disabled = isEmployee;
    if (batchCountEl) batchCountEl.readOnly = isEmployee;
    if (batchStartEl) batchStartEl.readOnly = isEmployee;
    
    // Reset batch UI
    document.getElementById('batchCreateCheckbox').checked = false
    document.getElementById('batchCountGroup').style.display = 'none'
    document.getElementById('batchStartGroup').style.display = 'none'
    document.querySelectorAll('.batch-hide').forEach(el => { el.style.display = '' })
    
    // Show/hide fields based on task type
    const isBetaTask = currentTaskType === 'beta'
    const rvCharsField = document.getElementById('taskRVChars')
    const betaCharsField = document.getElementById('taskBetaChars')
    const dialogueCharsField = document.getElementById('taskDialogueChars')
    const totalCharsField = document.getElementById('taskTotalChars')
    const submissionLinkField = document.getElementById('taskSubmissionLink')
    const betaLinkField = document.getElementById('taskBetaLink')
    const notesField = document.getElementById('taskNotes').parentElement
    const betaNotesField = document.getElementById('betaNotesField')
    
    if (isBetaTask) {
        // For beta tasks, show beta chars field and hide RV calculation fields
        if (rvCharsField) rvCharsField.parentElement.style.display = 'none'
        if (betaCharsField) betaCharsField.parentElement.style.display = ''
        if (dialogueCharsField) dialogueCharsField.parentElement.style.display = 'none'
        if (totalCharsField) totalCharsField.parentElement.style.display = 'none'
        if (submissionLinkField) submissionLinkField.parentElement.style.display = 'none'
        if (betaLinkField) betaLinkField.parentElement.style.display = ''
        if (notesField) notesField.style.display = 'none'
        if (betaNotesField) betaNotesField.style.display = ''
        
        // Set field permissions for beta tasks
        setFieldPermissions('beta')
    } else {
        // For RV tasks, show RV calculation fields and hide beta chars field
        if (rvCharsField) rvCharsField.parentElement.style.display = ''
        if (betaCharsField) betaCharsField.parentElement.style.display = 'none'
        if (dialogueCharsField) dialogueCharsField.parentElement.style.display = ''
        if (totalCharsField) totalCharsField.parentElement.style.display = ''
        if (submissionLinkField) submissionLinkField.parentElement.style.display = ''
        if (betaLinkField) betaLinkField.parentElement.style.display = 'none'
        if (notesField) notesField.style.display = ''
        if (betaNotesField) betaNotesField.style.display = 'none'
        
        // Set field permissions for RV tasks
        setFieldPermissions('rv')
    }
    
    // Setup event listeners for auto-calculation
    document.getElementById('taskDialogueChars').addEventListener('input', calculateRVChars)
    document.getElementById('taskTotalChars').addEventListener('input', calculateRVChars)
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('taskModal'))
    modal.show()
}

// Function to set field permissions based on task type and user role
function setFieldPermissions(taskType) {
    if (!currentUser) return
    
    // Clear any previous field states first
    const allFields = [
        'taskName', 'taskDescription', 'taskDeadline', 'taskPriority', 
        'taskSubmissionLink', 'taskDialogueChars', 'taskTotalChars', 
        'taskRVChars', 'taskRate', 'taskNotes', 'taskAssignee',
        'taskBetaLink', 'taskBetaChars', 'taskBetaNotes', 'taskBetaRate'
    ]
    
    allFields.forEach(fieldId => {
        const field = document.getElementById(fieldId)
        if (field) {
            field.classList.remove('field-disabled', 'field-enabled')
            field.disabled = false
            field.readOnly = false
        }
    })
    
    const fields = {
        'taskName': 'name',
        'taskDescription': 'description', 
        'taskDeadline': 'deadline',
        'taskPriority': 'priority',
        'taskSubmissionLink': 'submission_link',
        'taskDialogueChars': 'dialogue_chars',
        'taskTotalChars': 'total_chars',
        'taskRVChars': 'rv_chars',
        'taskRate': 'rate',
        'taskNotes': 'notes',
        'taskAssignee': 'assignee_id',
        'taskBetaLink': 'beta_link',
        'taskBetaChars': 'beta_chars',
        'taskBetaNotes': 'beta_notes',
        'taskBetaRate': 'beta_rate'
    }
    
    Object.entries(fields).forEach(([fieldId, fieldName]) => {
        const field = document.getElementById(fieldId)
        if (field) {
            const isEditable = isFieldEditable(fieldName)
            field.disabled = !isEditable
            field.readOnly = !isEditable
            
            // Add visual indication
            if (isEditable) {
                field.classList.remove('field-disabled')
                field.classList.add('field-enabled')
            } else {
                field.classList.remove('field-enabled')
                field.classList.add('field-disabled')
            }
        }
    })
    
    // Handle notes field visibility based on task type
    const notesField = document.getElementById('taskNotes').parentElement
    const betaNotesField = document.getElementById('betaNotesField')
    
    if (taskType === 'rv') {
        if (notesField) notesField.style.display = ''
        if (betaNotesField) betaNotesField.style.display = 'none'
    } else if (taskType === 'beta') {
        if (notesField) notesField.style.display = 'none'
        if (betaNotesField) betaNotesField.style.display = ''
    }
}

// Modal chuyển giao công việc
function showTransferModal(taskId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập', 'error')
        return
    }
    
    const task = tasks.find(t => t.id === taskId)
    if (!task) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check permissions - Boss can transfer any task, others can only transfer their own
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền chuyển giao công việc này', 'error')
        return
    }
    
    // Set task ID cho transfer form
    document.getElementById('transferTaskId').value = taskId
    
    // Populate employee dropdown
    const transferAssigneeSelect = document.getElementById('transferAssignee')
    transferAssigneeSelect.innerHTML = '<option value="">Chọn người nhận</option>'
    
    employees.forEach(employee => {
        if (employee.id !== currentUser.id) { // Không hiển thị chính mình
            const option = document.createElement('option')
            option.value = employee.id
            option.textContent = employee.name
            transferAssigneeSelect.appendChild(option)
        }
    })
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('transferModal'))
    modal.show()
}

// Xử lý chuyển giao công việc
async function handleTransferTask() {
    const taskId = document.getElementById('transferTaskId').value
    const newAssigneeId = document.getElementById('transferAssignee').value
    
    if (!newAssigneeId) {
        showNotification('Vui lòng chọn người nhận', 'error')
        return
    }
    
    try {
        await transferTask(taskId, newAssigneeId)
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('transferModal'))
        modal.hide()
        
        // Clear form
        document.getElementById('transferForm').reset()
        
        // UI sẽ được cập nhật tự động thông qua transferTask function
        
    } catch (error) {
        console.error('Error in handleTransferTask:', error)
    }
}

async function refreshData() {
    await loadDataFromSupabase()
    
    // Update project link buttons if we're in tasks view
    if (currentProjectId) {
        updateProjectLinkButtons()
    }
    
    // Re-render tables to apply updated rank-based styling
    renderTasksTable()
    renderBetaTasksTable()
    
    showNotification('Đã làm mới dữ liệu', 'info')
}

// Event Listeners
function setupEventListeners() {
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault()
        login()
    })
    
    // Auto-calculate RV chars when dialogue or total chars change
    document.getElementById('taskDialogueChars').addEventListener('input', calculateRVChars)
    document.getElementById('taskTotalChars').addEventListener('input', calculateRVChars)
    
    document.getElementById('projectForm').addEventListener('submit', function(e) {
        e.preventDefault()
        saveProject()
    })
    
    document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault()
        saveTask()
    })
    
    document.getElementById('transferForm').addEventListener('submit', function(e) {
        e.preventDefault()
        handleTransferTask()
    })
    
    // Auto-check overdue tasks
    setInterval(checkOverdueTasks, 60000) // Check every minute
    
    // Bulk rate functionality event listeners
    const rateTargetSelect = document.getElementById('projectRateTarget')
    if (rateTargetSelect) {
        rateTargetSelect.addEventListener('change', function() {
            const individualSection = document.getElementById('individualEmployeeSection')
            if (this.value === 'individual') {
                individualSection.style.display = 'block'
            } else {
                individualSection.style.display = 'none'
            }
        })
    }
}

function checkOverdueTasks() {
    const now = new Date()
    let hasOverdue = false
    
    tasks.forEach(task => {
        const deadlineDate = new Date(task.deadline)
        if (deadlineDate < now && task.status !== 'completed') {
            task.status = 'overdue'
            hasOverdue = true
        }
    })
    
    if (hasOverdue) {
        showNotification('Có công việc quá hạn!', 'warning')
    }
}

// Initialize overdue check on load
checkOverdueTasks() 

// Employee Management Functions
function showEmployeesList() {
    if (!currentUser || !hasManagerOrBossPermissions(currentUser)) {
        showNotification('Chỉ quản lý và boss mới có thể xem danh sách nhân viên', 'error')
        return
    }
    
    // Populate employees table with allEmployees
    const tbody = document.getElementById('employeesTableBody')
    tbody.innerHTML = ''
    
    if (window.allEmployees.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h4>Không có nhân viên nào</h4>
                        <p>Chưa có nhân viên trong hệ thống</p>
                    </div>
                </td>
            </tr>
        `
        return
    }
    
    // Sort employees by role hierarchy: boss -> manager -> employee
    const roleOrder = { 'boss': 1, 'manager': 2, 'employee': 3 };
    let sortedEmployees = [...window.allEmployees];
    
    sortedEmployees.sort((a, b) => {
        const roleA = roleOrder[a.role] || 99; // Assign a high number for unknown roles
        const roleB = roleOrder[b.role] || 99;
        
        if (roleA !== roleB) {
            return roleA - roleB;
        }
        // If roles are the same, sort by name alphabetically
        return a.name.localeCompare(b.name);
    });

    sortedEmployees.forEach(employee => {
        const row = document.createElement('tr')
        const roleBadge = employee.role === 'boss' 
            ? `<span class="badge bg-danger">Boss</span>` 
            : employee.role === 'manager' 
            ? `<span class="badge bg-primary">Quản lý</span>` 
            : `<span class="badge bg-secondary">Nhân viên</span>`
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>${roleBadge}</td>
        `
        tbody.appendChild(row)
    })
    
    const modal = new bootstrap.Modal(document.getElementById('employeesModal'))
    modal.show()
}

function updateAssigneeDropdowns() {
    const assigneeSelects = document.querySelectorAll('#taskAssignee')
    
    console.log('Updating assignee dropdowns, employees count:', employees.length)
    console.log('Employees data:', employees)
    
    assigneeSelects.forEach(select => {
        select.innerHTML = '<option value="">Không chỉ định (để nhân viên tự nhận)</option>'
        // Chỉ hiển thị employees (không phải managers) trong dropdown assign task
        employees.forEach(employee => {
            const option = document.createElement('option')
            option.value = employee.id
            option.textContent = employee.name
            select.appendChild(option)
        })
    })
}

// Auto-calculate RV chars (total - dialogue)
function calculateRVChars() {
    const dialogueChars = parseInt(document.getElementById('taskDialogueChars').value) || 0
    const totalChars = parseInt(document.getElementById('taskTotalChars').value) || 0
    const rvChars = totalChars - dialogueChars
    
    document.getElementById('taskRVChars').value = rvChars >= 0 ? rvChars : 0
} 

// Thêm hàm cập nhật dropdown nhân viên cho bộ lọc
function updateTaskAssigneeFilter() {
    const select = document.getElementById('taskAssigneeFilter')
    if (!select) return
    select.innerHTML = '<option value="">Tất cả</option>'
    if (window.allEmployees) {
        window.allEmployees.filter(e => e.role === 'employee').forEach(e => {
            const option = document.createElement('option')
            option.value = e.id
            option.textContent = e.name
            select.appendChild(option)
        })
    }
}

// Gắn event cho filter
function setupTaskFilters() {
    updateTaskAssigneeFilter();
}

// Gọi setupTaskFilters sau khi load dữ liệu hoặc chuyển dự án
// Ví dụ: trong showTasksView(projectId) hoặc loadDataFromSupabase() thêm setupTaskFilters() 

function updateAllCountdowns() {
    const timers = document.querySelectorAll('.countdown-timer');
    timers.forEach(timer => {
        const deadlineStr = timer.getAttribute('data-deadline');
        const deadline = new Date(deadlineStr);
        const now = new Date();
        let diff = deadline - now;
        if (isNaN(deadline.getTime())) {
            timer.textContent = '-';
            return;
        }
        if (diff <= 0) {
            timer.innerHTML = '<span class="badge bg-danger">Quá hạn</span>';
            return;
        }
        // Tính số ngày, giờ, phút, giây còn lại
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);
        const minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * (1000 * 60);
        const seconds = Math.floor(diff / 1000);
        let str = '';
        if (days > 0) str += days + 'd ';
        if (hours > 0 || days > 0) str += hours + 'h ';
        str += minutes + 'm ' + seconds + 's';
        
        // Kiểm tra nếu còn dưới 10h thì giữ nền đỏ
        const totalHours = days * 24 + hours;
        if (totalHours < 10) {
            timer.innerHTML = `<span class="badge bg-danger text-white">${str}</span>`;
        } else {
            timer.innerHTML = `<span class="badge bg-primary">${str}</span>`;
        }
    });
}
// Tự động cập nhật countdown mỗi giây
setInterval(updateAllCountdowns, 1000);

// --- LEADERBOARD FUNCTIONS ---
async function loadLeaderboards() {
    try {
        console.log('Loading leaderboards...')
        // Load all-time leaderboard (TOP 5)
        await loadAllTimeLeaderboard()
        
        // Load monthly leaderboard (TOP 10)
        await loadMonthlyLeaderboard()
        console.log('Leaderboards loaded successfully')
    } catch (error) {
        console.error('Error loading leaderboards:', error)
    }
}

async function loadAllTimeLeaderboard() {
    try {
        // Get all employees first
        const { data: allEmployees, error: employeesError } = await supabase
            .from('employees')
            .select('*')
            .eq('role', 'employee')

        if (employeesError) throw employeesError

        // Get all completed tasks with employee data
        const { data: completedTasks, error } = await supabase
            .from('tasks')
            .select(`
                *,
                employees!tasks_assignee_id_fkey (
                    id,
                    name,
                    email
                )
            `)
            .eq('status', 'completed')
            .not('assignee_id', 'is', null)

        if (error) throw error

        // Initialize statistics for all employees
        const employeeStats = {}
        
        // Initialize all employees with 0 stats
        allEmployees.forEach(employee => {
            employeeStats[employee.id] = {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                totalTasks: 0,
                totalChars: 0
            }
        })
        
        // Calculate statistics for each employee
        completedTasks.forEach(task => {
            const employeeId = task.assignee_id
            if (employeeStats[employeeId]) {
                employeeStats[employeeId].totalTasks++
                
                // Tính số chữ theo loại task
                let taskChars = 0
                if (task.task_type === 'beta') {
                    // Task beta: chỉ tính beta_chars
                    taskChars = task.beta_chars || 0
                } else {
                    // Task rv: chỉ tính rv_chars
                    taskChars = task.rv_chars || 0
                }
                
                employeeStats[employeeId].totalChars += taskChars
            }
        })

        // Convert to array and sort by total chars, then by total tasks
        const leaderboardData = Object.values(employeeStats)
            .sort((a, b) => {
                if (b.totalChars !== a.totalChars) {
                    return b.totalChars - a.totalChars
                }
                return b.totalTasks - a.totalTasks
            })
            .slice(0, 5) // TOP 5

        console.log('All-time leaderboard data:', leaderboardData)
        // Lưu dữ liệu vào window object để sử dụng cho màu sắc
        window.allTimeLeaderboardData = leaderboardData
        renderLeaderboard('allTimeLeaderboard', leaderboardData, 'all-time')
        
        // Re-render tables to apply updated rank-based styling
        if (currentProjectId) {
            renderTasksTable()
            renderBetaTasksTable()
        }
    } catch (error) {
        console.error('Error loading all-time leaderboard:', error)
    }
}

async function loadMonthlyLeaderboard() {
    try {
        const currentDate = new Date()
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        // Get all employees first
        const { data: allEmployees, error: employeesError } = await supabase
            .from('employees')
            .select('*')
            .eq('role', 'employee')

        if (employeesError) throw employeesError

        // Get completed tasks for current month
        const { data: completedTasks, error } = await supabase
            .from('tasks')
            .select(`
                *,
                employees!tasks_assignee_id_fkey (
                    id,
                    name,
                    email
                )
            `)
            .eq('status', 'completed')
            .not('assignee_id', 'is', null)
            .gte('updated_at', startOfMonth.toISOString())
            .lte('updated_at', endOfMonth.toISOString())

        if (error) throw error

        // Initialize statistics for all employees
        const employeeStats = {}
        
        // Initialize all employees with 0 stats
        allEmployees.forEach(employee => {
            employeeStats[employee.id] = {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                totalTasks: 0,
                totalChars: 0
            }
        })
        
        // Calculate statistics for each employee
        completedTasks.forEach(task => {
            const employeeId = task.assignee_id
            if (employeeStats[employeeId]) {
                employeeStats[employeeId].totalTasks++
                
                // Tính số chữ theo loại task
                let taskChars = 0
                if (task.task_type === 'beta') {
                    // Task beta: chỉ tính beta_chars
                    taskChars = task.beta_chars || 0
                } else {
                    // Task rv: chỉ tính rv_chars
                    taskChars = task.rv_chars || 0
                }
                
                employeeStats[employeeId].totalChars += taskChars
            }
        })

        // Convert to array and sort by total chars, then by total tasks
        const leaderboardData = Object.values(employeeStats)
            .sort((a, b) => {
                if (b.totalChars !== a.totalChars) {
                    return b.totalChars - a.totalChars
                }
                return b.totalTasks - a.totalTasks
            })
            .slice(0, 10) // TOP 10

        console.log('Monthly leaderboard data:', leaderboardData)
        // Lưu dữ liệu vào window object để sử dụng cho màu sắc
        window.monthlyLeaderboardData = leaderboardData
        renderLeaderboard('monthlyLeaderboard', leaderboardData, 'monthly')
        
        // Re-render tables to apply updated rank-based styling
        if (currentProjectId) {
            renderTasksTable()
            renderBetaTasksTable()
        }
    } catch (error) {
        console.error('Error loading monthly leaderboard:', error)
    }
}

function renderLeaderboard(containerId, data, type) {
    const container = document.getElementById(containerId)
    if (!container) return

    if (data.length === 0) {
        container.innerHTML = `
            <div class="leaderboard-item">
                <div class="text-center text-muted py-4">
                    <i class="fas fa-trophy fa-3x mb-3" style="color: rgba(255,255,255,0.6);"></i>
                    <p class="mb-0" style="color: rgba(255,255,255,0.8); font-weight: 600;">Chưa có dữ liệu</p>
                    <small style="color: rgba(255,255,255,0.6);">Hãy bắt đầu hoàn thành công việc!</small>
                </div>
            </div>
        `
        return
    }

    container.innerHTML = data.map((employee, index) => {
        const rank = index + 1
        const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other'
        const initials = employee.name.split(' ').map(n => n[0]).join('').toUpperCase()
        
        // Thêm class rainbow cho top 3
        const rainbowClass = rank <= 3 ? `rainbow-text-${rank}` : ''
        
        return `
            <div class="leaderboard-item">
                <div class="leaderboard-rank ${rankClass}">
                    ${rank}
                </div>
                <div class="leaderboard-avatar">
                    ${initials}
                </div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name ${rainbowClass}">
                        ${employee.name}
                    </div>
                    <div class="leaderboard-stats">
                        <div class="leaderboard-stat">
                            <i class="fas fa-tasks"></i>
                            <span>${employee.totalTasks} công việc</span>
                        </div>
                        <div class="leaderboard-stat">
                            <i class="fas fa-font"></i>
                            <span>${employee.totalChars.toLocaleString()} chữ</span>
                        </div>
                    </div>
                </div>
            </div>
        `
    }).join('')
}

// --- NOTIFICATION FUNCTIONS ---
async function loadNotifications() {
    try {
        // Load system announcement
        await loadSystemAnnouncement()
        
        // Load recent notifications
        await loadRecentNotifications()
        
        // Load upcoming deadlines
        await loadUpcomingDeadlines()
    } catch (error) {
        console.error('Error loading notifications:', error)
    }
}

async function loadSystemAnnouncement() {
    try {
        const { data, error } = await supabase
            .from('system_announcements')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned

        const announcementEl = document.getElementById('systemAnnouncement')
        if (data) {
            announcementEl.innerHTML = `
                <p class="mb-0">${data.content}</p>
                <small class="text-muted">Cập nhật: ${formatDateTime(data.updated_at)}</small>
            `
        } else {
            announcementEl.innerHTML = '<p class="text-muted mb-0">Chưa có thông báo nào</p>'
        }
    } catch (error) {
        console.error('Error loading system announcement:', error)
    }
}

async function loadRecentNotifications() {
    try {
        // Get recent task activities
        const { data: recentTasks, error } = await supabase
            .from('tasks')
            .select(`
                *,
                employees!tasks_assignee_id_fkey (
                    name
                )
            `)
            .order('updated_at', { ascending: false })
            .limit(5)

        if (error) throw error

        const container = document.getElementById('recentNotifications')
        
        if (recentTasks.length === 0) {
            container.innerHTML = `
                <div class="notification-item">
                    <div class="text-center text-muted py-4">
                        <i class="fas fa-bell-slash fa-2x mb-3" style="color: rgba(255,255,255,0.6);"></i>
                        <p class="mb-0" style="color: rgba(255,255,255,0.8); font-weight: 600;">Chưa có hoạt động</p>
                        <small style="color: rgba(255,255,255,0.6);">Sẽ hiển thị khi có cập nhật</small>
                    </div>
                </div>
            `
            return
        }

        container.innerHTML = recentTasks.map(task => {
            const action = getTaskActionText(task)
            const time = formatTimeAgo(task.updated_at)
            const statusIcon = getStatusIcon(task.status)
            const statusColor = getStatusColor(task.status)
            
            return `
                <div class="notification-item">
                    <div class="notification-header-row">
                        <div class="notification-icon" style="color: ${statusColor};">
                            ${statusIcon}
                        </div>
                        <div class="notification-title">${task.name}</div>
                    </div>
                    <div class="notification-time">
                        <i class="fas fa-clock"></i>
                        ${action} - ${time}
                    </div>
                </div>
            `
        }).join('')
    } catch (error) {
        console.error('Error loading recent notifications:', error)
    }
}

async function loadUpcomingDeadlines() {
    try {
        const now = new Date()
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

        const { data: upcomingTasks, error } = await supabase
            .from('tasks')
            .select(`
                *,
                employees!tasks_assignee_id_fkey (
                    name
                )
            `)
            .in('status', ['pending', 'in-progress'])
            .lte('deadline', tomorrow.toISOString())
            .order('deadline', { ascending: true })
            .limit(5)

        if (error) throw error

        const container = document.getElementById('upcomingDeadlines')
        
        if (upcomingTasks.length === 0) {
            container.innerHTML = `
                <div class="deadline-item">
                    <div class="text-center text-muted py-4">
                        <i class="fas fa-calendar-check fa-2x mb-3" style="color: rgba(255,255,255,0.6);"></i>
                        <p class="mb-0" style="color: rgba(255,255,255,0.8); font-weight: 600;">Không có deadline sắp đến</p>
                        <small style="color: rgba(255,255,255,0.6);">Tất cả đều đúng hạn!</small>
                    </div>
                </div>
            `
            return
        }

        container.innerHTML = upcomingTasks.map(task => {
            const timeLeft = calculateTimeLeft(task.deadline)
            const isUrgent = new Date(task.deadline) - now < 10 * 60 * 60 * 1000 // Less than 10 hours
            const urgentClass = isUrgent ? 'deadline-urgent' : ''
            
            return `
                <div class="deadline-item ${urgentClass}">
                    <div class="deadline-task">${task.name}</div>
                    <div class="deadline-time">
                        <i class="fas fa-clock"></i>
                        ${timeLeft}
                    </div>
                </div>
            `
        }).join('')
    } catch (error) {
        console.error('Error loading upcoming deadlines:', error)
    }
}

function getTaskActionText(task) {
    const status = task.status
    const assignee = task.assignee_id ? task.employees?.name : null
    
    switch (status) {
        case 'completed':
            return assignee ? `${assignee} đã hoàn thành` : 'Đã hoàn thành'
        case 'in-progress':
            return assignee ? `${assignee} đang thực hiện` : 'Đang thực hiện'
        case 'pending':
            return assignee ? `${assignee} đã nhận` : 'Chờ thực hiện'
        default:
            return 'Cập nhật trạng thái'
    }
}

function getStatusIcon(status) {
    switch (status) {
        case 'completed':
            return '<i class="fas fa-check-circle"></i>'
        case 'in-progress':
            return '<i class="fas fa-play-circle"></i>'
        case 'overdue':
            return '<i class="fas fa-exclamation-triangle"></i>'
        case 'pending':
        default:
            return '<i class="fas fa-clock"></i>'
    }
}

function getStatusColor(status) {
    switch (status) {
        case 'completed':
            return '#28a745'
        case 'in-progress':
            return '#17a2b8'
        case 'overdue':
            return '#dc3545'
        case 'pending':
        default:
            return '#ffc107'
    }
}

function formatTimeAgo(dateString) {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    return formatDateTime(dateString)
}

function calculateTimeLeft(deadline) {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffMs = deadlineDate - now

    if (diffMs <= 0) return 'Quá hạn'

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 24) {
        const diffDays = Math.floor(diffHours / 24)
        return `${diffDays} ngày ${diffHours % 24}h`
    }
    if (diffHours > 0) {
        return `${diffHours}h ${diffMins}m`
    }
    return `${diffMins}m`
}

// --- ANNOUNCEMENT MANAGEMENT ---
function editAnnouncement() {
    const contentEl = document.getElementById('systemAnnouncement')
    const editFormEl = document.getElementById('announcementEditForm')
    const textareaEl = document.getElementById('announcementText')
    
    // Get current announcement text
    const currentText = contentEl.querySelector('p')?.textContent || ''
    textareaEl.value = currentText
    
    // Show edit form, hide content
    contentEl.style.display = 'none'
    editFormEl.style.display = 'block'
}

function cancelEditAnnouncement() {
    const contentEl = document.getElementById('systemAnnouncement')
    const editFormEl = document.getElementById('announcementEditForm')
    
    // Hide edit form, show content
    contentEl.style.display = 'block'
    editFormEl.style.display = 'none'
}

async function saveAnnouncement() {
    try {
        const textareaEl = document.getElementById('announcementText')
        const content = textareaEl.value.trim()
        
        if (!content) {
            showNotification('Vui lòng nhập nội dung thông báo', 'warning')
            return
        }

        // Save to database
        const { error } = await supabase
            .from('system_announcements')
            .upsert({
                content: content,
                created_by: currentUser.id,
                updated_at: new Date().toISOString()
            })

        if (error) throw error

        // Update UI
        cancelEditAnnouncement()
        await loadSystemAnnouncement()
        
        showNotification('Thông báo đã được cập nhật', 'success')
    } catch (error) {
        console.error('Error saving announcement:', error)
        showNotification('Lỗi khi lưu thông báo', 'error')
    }
} 

// --- BETA TASK MANAGEMENT ---

// Global variable to track current task type
let currentTaskType = 'rv'

// Switch between RV and Beta task types
function switchTaskType(taskType) {
    currentTaskType = taskType
    
    // Update active tab
    document.querySelectorAll('#taskTypeTabs .nav-link').forEach(tab => {
        tab.classList.remove('active')
    })
    document.querySelector(`#${taskType}-tab`).classList.add('active')
    
    // Update tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('show', 'active')
    })
    document.querySelector(`#${taskType}-tasks`).classList.add('show', 'active')
    
    // Render appropriate table
    if (taskType === 'rv') {
        renderTasksTable()
    } else {
        setupBetaTaskFilters() // Ensure beta task filters are updated
        renderBetaTasksTable()
    }
}

// Render beta tasks table
function renderBetaTasksTable() {
    if (!currentProjectId) return
    
    const filteredTasks = tasks.filter(task => 
        task.project_id === currentProjectId && 
        task.task_type === 'beta'
    )
    
    // Apply filters
    const statusFilter = document.getElementById('betaTaskStatusFilter').value
    const assigneeFilter = document.getElementById('betaTaskAssigneeFilter').value
    
    let filteredBetaTasks = filteredTasks
    
    if (statusFilter) {
        filteredBetaTasks = filteredBetaTasks.filter(task => task.status === statusFilter)
    }
    
    if (assigneeFilter) {
        filteredBetaTasks = filteredBetaTasks.filter(task => String(task.assignee_id) === assigneeFilter)
    }
    
    // Sắp xếp theo tên deadline A-Z (ưu tiên số trước, fallback chữ)
    filteredBetaTasks.sort((a, b) => {
        const extractNumber = (name) => {
            const match = (name || '').match(/\d+/)
            return match ? parseInt(match[0], 10) : null
        }
        const numA = extractNumber(a.name)
        const numB = extractNumber(b.name)
        if (numA !== null && numB !== null) {
            return numA - numB
        }
        return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' })
    })

    const tbody = document.getElementById('betaTasksTableBody')
    if (!tbody) return
    
    if (filteredBetaTasks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" class="text-center text-muted">
                    <i class="fas fa-inbox fa-2x mb-2"></i>
                    <p>Chưa có công việc beta nào</p>
                </td>
            </tr>
        `
        return
    }
    
    tbody.innerHTML = filteredBetaTasks.map(task => {
        const assignee = employees.find(emp => emp.id === task.assignee_id)
        const isCurrentUserAssignee = currentUser && task.assignee_id === currentUser.id
        const isCurrentUserManager = currentUser && (isBoss(currentUser) || (currentUser.role === 'manager' && canOperateOnTask(task)))
        
        // Lấy rank và màu sắc cho người thực hiện
        const assigneeRank = getEmployeeRank(task.assignee_id)
        const assigneeColorClass = getAssigneeColorClass(assigneeRank)
        
        // Calculate time left
        const timeLeft = calculateTimeLeft(task.deadline)
        const deadline = new Date(task.deadline)
        const now = new Date()
        const isCompleted = task.status === 'completed'
        const isOverdue = deadline < now && !isCompleted
        
        // Format RV chars (from parent task)
        const rvChars = task.rv_chars ? `<span class="badge badge-gradient-yellow">${task.rv_chars.toLocaleString()}</span>` : '<span class="text-muted">-</span>'
        
        // Format Beta chars
        const betaChars = task.beta_chars ? `<span class="badge badge-gradient-blue">${task.beta_chars.toLocaleString()}</span>` : '<span class="text-muted">-</span>'
        
        // Calculate payment (beta_rate * beta_chars)
        let payment = '<span class="text-muted">-</span>'
        if (typeof task.beta_rate === 'number' && typeof task.beta_chars === 'number' && !isNaN(task.beta_rate) && !isNaN(task.beta_chars)) {
            const money = Math.round((task.beta_rate * task.beta_chars) / 1000)
            payment = `<span class="badge badge-money">${money.toLocaleString('vi-VN')}đ</span>`
        }
        
        // Format RV link - lấy submission_link từ parent RV task (link nộp thực tế)
        let rvLink = '<span class="text-muted">-</span>'
        if (task.parent_task_id) {
            // Tìm parent RV task để lấy submission_link (link nộp thực tế)
            const parentRVTask = tasks.find(t => t.id === task.parent_task_id && t.task_type === 'rv')
            if (parentRVTask && parentRVTask.submission_link && parentRVTask.submission_link.trim()) {
                rvLink = `<a href="${parentRVTask.submission_link}" target="_blank" class="btn btn-sm btn-outline-primary"><i class="fas fa-external-link-alt"></i> Xem RV</a>`
            } else {
                // Debug: hiển thị thông tin nếu không có link
                console.log('Beta task missing parent RV submission link:', {
                    taskId: task.id,
                    taskName: task.name,
                    parentTaskId: task.parent_task_id,
                    parentRVTask: parentRVTask,
                    parentSubmissionLink: parentRVTask ? parentRVTask.submission_link : null
                })
            }
        } else {
            console.log('Beta task missing parent_task_id:', {
                taskId: task.id,
                taskName: task.name,
                parentTaskId: task.parent_task_id
            })
        }
        
        // Format Beta link với phân quyền mới
        let betaLinkDisplay = ''
        
        if (currentUser && (isBoss(currentUser) || currentUser.role === 'manager')) {
            // Boss/Manager: Luôn thấy button "Chỉnh sửa Beta" nếu có dữ liệu
            if (task.beta_link) {
                betaLinkDisplay = `<button class="btn btn-sm btn-outline-primary" onclick="editBetaData(${task.id})">
                    <i class="fas fa-edit"></i> Chỉnh sửa Beta
                </button>`
            } else {
                betaLinkDisplay = '<span class="text-muted">-</span>'
            }
        } else if (currentUser && currentUser.role === 'employee') {
            // Employee: Chỉ thấy button nếu là người được assign task này
            if (task.assignee_id === currentUser.id) {
                if (task.beta_link) {
                    betaLinkDisplay = `<button class="btn btn-sm btn-outline-primary" onclick="editBetaData(${task.id})">
                        <i class="fas fa-edit"></i> Cập nhật Beta
                    </button>`
                } else {
                    betaLinkDisplay = `<button class="btn btn-sm btn-outline-success" onclick="inputBetaData(${task.id})">
                        <i class="fas fa-plus"></i> Nhập Beta
                    </button>`
                }
            } else {
                // Nhân viên khác: Không thấy gì
                betaLinkDisplay = '<span class="text-muted">-</span>'
            }
        } else {
            // Khách: Không thấy gì
            betaLinkDisplay = '<span class="text-muted">-</span>'
        }
        
        // Format notes with link if extensive
        let notesDisplay = '<span class="text-muted">-</span>'
        if (task.beta_notes && task.beta_notes.trim()) {
            if (task.beta_notes.length > 100) {
                notesDisplay = `<a href="task-notes.html?taskId=${task.id}&type=beta" target="_blank" class="btn btn-sm btn-outline-info"><i class="fas fa-sticky-note"></i> Xem ghi chú Beta</a>`
            } else {
                notesDisplay = `<span title="${task.beta_notes}">${task.beta_notes.substring(0, 50)}${task.beta_notes.length > 50 ? '...' : ''}</span>`
            }
        }
        
        // Action buttons
        let actionButtons = ''
        
        // Check if project is completed (for employees)
        const currentProject = projects.find(p => p.id === currentProjectId)
        const isCompletedProject = currentProject && currentProject.status === 'completed'
        
        if (currentUser && (isBoss(currentUser) || (currentUser.role === 'manager' && canOperateOnTask(task)))) {
            // Boss can edit any task, Manager can edit tasks in their projects
            actionButtons += `<button class="btn btn-action btn-edit" onclick="editBetaTask(${task.id})" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>`
            actionButtons += `<button class="btn btn-action btn-delete" onclick="deleteBetaTask(${task.id})" title="Xóa"><i class="fas fa-trash"></i></button>`
        } else if (currentUser && currentUser.role === 'employee') {
            // Employee can only interact with tasks in active projects
            if (!isCompletedProject) {
                if (isCurrentUserAssignee) {
                    actionButtons += `<button class="btn btn-action btn-edit" onclick="editBetaTask(${task.id})" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>`
                } else if (!task.assignee_id) {
                    actionButtons += `<button class="btn btn-action btn-claim" onclick="claimBetaTask(${task.id})" title="Nhận công việc"><i class="fas fa-hand-pointer"></i> Nhận</button>`
                }
            }
        }
        
        // Countdown deadline
        let countdown = ''
        if (isNaN(deadline.getTime())) {
            countdown = '<span class="text-muted">-</span>'
        } else if (isCompleted) {
            countdown = '<span class="badge bg-success">Hoàn thành</span>'
        } else if (deadline < now) {
            countdown = '<span class="badge bg-danger">Quá hạn</span>'
        } else if (timeLeft < 10 * 60 * 60 * 1000) {
            countdown = `<span class="countdown-timer bg-danger text-white" data-deadline="${task.deadline}" data-taskid="${task.id}"></span>`
        } else {
            countdown = `<span class="countdown-timer" data-deadline="${task.deadline}" data-taskid="${task.id}"></span>`
        }

        return `
            <tr class="${isOverdue ? 'table-danger' : ''}">
                <td>
                    <div class="d-flex flex-column">
                        <small class="text-muted">${formatDateTime(task.deadline)}</small>
                        ${countdown}
                    </div>
                </td>
                <td>
                    <div class="fw-bold">${task.name}</div>
                    <small class="text-muted">${task.description || ''}</small>
                </td>
                <td>${getTaskStatusBadge(task.status)}</td>
                <td>${rvLink}</td>
                <td>${betaLinkDisplay}</td>
                <td>${rvChars}</td>
                <td>${betaChars}</td>
                <td>${payment}</td>
                <td>
                    ${assignee ? `<span class="${assigneeColorClass}">${assignee.name}</span>` : '<span class="text-muted">Chưa phân công</span>'}
                </td>
                <td>${notesDisplay}</td>
                <td>
                    <div class="btn-group" role="group">
                        ${actionButtons}
                    </div>
                </td>
            </tr>
        `
    }).join('')
}

// Edit beta task
async function editBetaTask(id) {
    const task = tasks.find(t => t.id === id)
    if (!task) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check permissions
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền chỉnh sửa công việc này', 'error')
        return
    }
    
    // Additional check for employees
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể chỉnh sửa Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    // Set currentTaskType to 'beta' for proper field permissions
    currentTaskType = 'beta'
    
    // Set form values
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    
    setVal('taskName', task.name)
    setVal('taskDescription', task.description || '')
    setVal('taskDeadline', task.deadline ? task.deadline.slice(0, 16) : '')
    setVal('taskPriority', task.priority)
    setVal('taskStatus', task.status)
    setVal('taskAssignee', task.assignee_id || '')
    setVal('taskBetaChars', task.beta_chars || '')
    setVal('taskBetaLink', task.beta_link || '')
    setVal('taskNotes', task.notes || '')
    setVal('taskBetaNotes', task.beta_notes || '')
    setVal('taskBetaRate', task.beta_rate || '')
    
    // Store current task ID for update
    window.currentEditingTaskId = id
    document.getElementById('taskId').value = id
    
    // Set modal title for editing
    document.getElementById('taskModalTitle').textContent = 'Chỉnh sửa Công việc'
    
    // Set field permissions for beta tasks (this will handle UI reset)
    setFieldPermissions('beta')
    
    // Show status field
    document.getElementById('taskStatusField').style.display = 'block'
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('taskModal'))
    modal.show()
}

// Claim beta task
async function claimBetaTask(taskId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để nhận công việc', 'warning')
        return
    }
    
    const currentTask = tasks.find(t => t.id === taskId)
    if (!currentTask) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check if task is already assigned
    if (currentTask.assignee_id) {
        showNotification('Công việc này đã được phân công', 'warning')
        return
    }
    
    // Check if project is completed (for employees)
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === currentTask.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể nhận Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    try {
        // Only update the assignee_id, don't create new task
        const { error } = await supabase
            .from('tasks')
            .update({ 
                assignee_id: currentUser.id,
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .eq('task_type', 'beta') // Ensure we're only updating beta tasks
        
        if (error) throw error
        
        // Update local data
        const taskIndex = tasks.findIndex(t => t.id === taskId)
        if (taskIndex !== -1) {
            tasks[taskIndex].assignee_id = currentUser.id
            tasks[taskIndex].updated_at = new Date().toISOString()
        }
        
        // Re-render tables with delay to prevent UI freezing
        setTimeout(() => {
            renderBetaTasksTable()
            renderProjectsTable()
        }, 100)
        
        showNotification('Đã nhận công việc thành công', 'success')
    } catch (error) {
        console.error('Error claiming beta task:', error)
        showNotification('Lỗi khi nhận công việc', 'error')
    }
}

// Delete beta task
async function deleteBetaTask(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa công việc này?')) return
    
    const task = tasks.find(t => t.id === id)
    if (!task) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check permissions
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền xóa công việc này', 'error')
        return
    }
    
    // Additional check for employees
    if (currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể xóa Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    try {
        // Trước tiên, xóa tất cả task con (child tasks) nếu có
        const childTasks = tasks.filter(t => t.parent_task_id === id)
        if (childTasks.length > 0) {
            console.log(`Xóa ${childTasks.length} task con trước khi xóa task cha`)
            
            for (const childTask of childTasks) {
                const { error: childError } = await supabase
                    .from('tasks')
                    .delete()
                    .eq('id', childTask.id)
                
                if (childError) {
                    console.error('Error deleting child task:', childError)
                    throw childError
                }
            }
            
            // Cập nhật local data - xóa task con
            tasks = tasks.filter(t => t.parent_task_id !== id)
        }
        
        // Sau đó xóa task cha
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)
        
        if (error) throw error
        
        // Remove from local data
        tasks = tasks.filter(t => t.id !== id)
        
        // Re-render tables
        renderBetaTasksTable()
        renderProjectsTable()
        
        showNotification('Đã xóa công việc thành công', 'success')
    } catch (error) {
        console.error('Error deleting beta task:', error)
        showNotification('Lỗi khi xóa công việc', 'error')
    }
}

// Update beta task
async function updateBetaTask() {
    const taskId = window.currentEditingTaskId
    if (!taskId) {
        showNotification('Không tìm thấy ID công việc', 'error')
        return
    }
    
    const task = tasks.find(t => t.id === taskId)
    if (!task) {
        showNotification('Không tìm thấy công việc', 'error')
        return
    }
    
    // Check permissions
    if (!canOperateOnTask(task)) {
        showNotification('Bạn không có quyền cập nhật công việc này', 'error')
        return
    }
    
    // Additional check for employees
    if (currentUser && currentUser.role === 'employee') {
        const project = projects.find(p => p.id === task.project_id)
        if (project && project.status === 'completed') {
            showNotification('Không thể cập nhật Deadline trong truyện đã hoàn thành', 'error')
            return
        }
    }
    
    // Get form values
    const name = document.getElementById('taskName').value.trim()
    const description = document.getElementById('taskDescription').value.trim()
    const deadline = document.getElementById('taskDeadline').value
    const priority = document.getElementById('taskPriority').value
    const status = document.getElementById('taskStatus').value
    const assigneeId = document.getElementById('taskAssignee').value || null
    const betaChars = document.getElementById('taskBetaChars').value
    const betaLink = document.getElementById('taskBetaLink').value.trim()
    const notes = document.getElementById('taskNotes').value.trim()
    const betaNotes = document.getElementById('taskBetaNotes').value.trim()
    const betaRate = document.getElementById('taskBetaRate').value
    
    if (!name || !deadline) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning')
        return
    }
    
    try {
        const updateData = {
            name: name,
            description: description,
            deadline: deadline,
            priority: priority,
            status: status,
            assignee_id: assigneeId,
            beta_chars: betaChars ? parseInt(betaChars) : null,
            beta_link: betaLink || null,
            notes: notes,
            beta_notes: betaNotes,
            beta_rate: betaRate ? parseFloat(betaRate) : null,
            updated_at: new Date().toISOString()
        }
        
        const { error } = await supabase
            .from('tasks')
            .update(updateData)
            .eq('id', taskId)
        
        if (error) throw error
        
        // Update local data
        const taskIndex = tasks.findIndex(t => t.id === taskId)
        if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...updateData }
        }
        
        // Re-render tables
        renderBetaTasksTable()
        renderProjectsTable()
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'))
        modal.hide()
        
        // Remove form reset - not needed since modal is already closed
        // This was causing race conditions when users quickly clicked to edit another task
        window.currentEditingTaskId = null
        
        showNotification('Đã cập nhật công việc thành công', 'success')
    } catch (error) {
        console.error('Error updating beta task:', error)
        showNotification('Lỗi khi cập nhật công việc', 'error')
    }
}

// Setup beta task filters
function setupBetaTaskFilters() {
    const assigneeFilter = document.getElementById('betaTaskAssigneeFilter')
    if (assigneeFilter) {
        assigneeFilter.innerHTML = '<option value="">Tất cả</option>'
        if (window.allEmployees) {
            window.allEmployees.filter(e => e.role === 'employee').forEach(e => {
                const option = document.createElement('option')
                option.value = e.id
                option.textContent = e.name
                assigneeFilter.appendChild(option)
            })
        }
    }
}

// Initialize beta task functionality
function initializeBetaTasks() {
    // Setup filters
    setupBetaTaskFilters()
} 

// Project link functions
function openStoryLink() {
    const currentProject = projects.find(p => p.id === currentProjectId)
    if (currentProject && currentProject.story_link) {
        window.open(currentProject.story_link, '_blank')
    } else {
        showNotification('Link truyện chưa được thiết lập', 'warning')
    }
}

function openRuleLink() {
    const currentProject = projects.find(p => p.id === currentProjectId)
    if (currentProject && currentProject.rule_link) {
        window.open(currentProject.rule_link, '_blank')
    } else {
        showNotification('Link Rule chưa được thiết lập', 'warning')
    }
}

function openBnvLink() {
    const currentProject = projects.find(p => p.id === currentProjectId)
    if (currentProject && currentProject.bnv_link) {
        window.open(currentProject.bnv_link, '_blank')
    } else {
        showNotification('Link BNV chưa được thiết lập', 'warning')
    }
}

function openDialogueLink() {
    const currentProject = projects.find(p => p.id === currentProjectId)
    if (currentProject && currentProject.dialogue_link) {
        window.open(currentProject.dialogue_link, '_blank')
    } else {
        showNotification('Link thoại chưa được thiết lập', 'warning')
    }
}

function updateProjectLinkButtons() {
    const currentProject = projects.find(p => p.id === currentProjectId)
    const storyBtn = document.getElementById('storyLinkBtn')
    const ruleBtn = document.getElementById('ruleLinkBtn')
    const bnvBtn = document.getElementById('bnvLinkBtn')
    const dialogueBtn = document.getElementById('dialogueLinkBtn')
    
    if (currentProject) {
        // Show/hide buttons based on available links
        if (currentProject.story_link) {
            storyBtn.style.display = 'inline-block'
        } else {
            storyBtn.style.display = 'none'
        }
        
        if (currentProject.rule_link) {
            ruleBtn.style.display = 'inline-block'
        } else {
            ruleBtn.style.display = 'none'
        }
        
        if (currentProject.bnv_link) {
            bnvBtn.style.display = 'inline-block'
        } else {
            bnvBtn.style.display = 'none'
        }
        
        if (currentProject.dialogue_link) {
            dialogueBtn.style.display = 'inline-block'
        } else {
            dialogueBtn.style.display = 'none'
        }
    } else {
        // Hide all buttons if no project selected
        storyBtn.style.display = 'none'
        ruleBtn.style.display = 'none'
        bnvBtn.style.display = 'none'
        dialogueBtn.style.display = 'none'
    }
}

// Function để lấy rank của nhân viên từ leaderboard
function getEmployeeRank(employeeId) {
    if (!employeeId) return null
    
    // Tìm trong all-time leaderboard trước
    const allTimeLeaderboard = window.allTimeLeaderboardData || []
    const allTimeRank = allTimeLeaderboard.findIndex(emp => emp.id === employeeId)
    if (allTimeRank !== -1) {
        console.log(`Employee ${employeeId} found in all-time leaderboard at rank ${allTimeRank + 1}`)
        return { type: 'all-time', rank: allTimeRank + 1 }
    }
    
    // Tìm trong monthly leaderboard
    const monthlyLeaderboard = window.monthlyLeaderboardData || []
    const monthlyRank = monthlyLeaderboard.findIndex(emp => emp.id === employeeId)
    if (monthlyRank !== -1) {
        console.log(`Employee ${employeeId} found in monthly leaderboard at rank ${monthlyRank + 1}`)
        return { type: 'monthly', rank: monthlyRank + 1 }
    }
    
    console.log(`Employee ${employeeId} not found in any leaderboard`)
    return null
}

// Function để lấy class màu sắc dựa trên rank
function getAssigneeColorClass(rankInfo) {
    if (!rankInfo) {
        console.log('No rank info, using default color')
        return 'text-success' // Mặc định màu xanh
    }
    
    const { type, rank } = rankInfo
    console.log(`Applying color for ${type} rank ${rank}`)
    
    // Ưu tiên all-time rank và áp dụng hiệu ứng rainbow cho top 3
    if (rank === 1) {
        console.log('Applying rainbow-text-1 for rank 1')
        return 'rainbow-text-1 fw-bold' // Rainbow effect cho rank 1
    } else if (rank === 2) {
        console.log('Applying rainbow-text-2 for rank 2')
        return 'rainbow-text-2 fw-bold' // Rainbow effect cho rank 2
    } else if (rank === 3) {
        console.log('Applying rainbow-text-3 for rank 3')
        return 'rainbow-text-3 fw-bold' // Rainbow effect cho rank 3
    } else if (rank <= 5) {
        console.log('Applying text-primary for top 5')
        return 'text-primary fw-bold' // Xanh dương cho top 5
    } else if (rank <= 10) {
        console.log('Applying text-info for top 10')
        return 'text-info fw-bold' // Xanh nhạt cho top 10
    } else {
        console.log('Applying text-success for others')
        return 'text-success' // Xanh lá cho những người khác
    }
}

// Test function để kiểm tra rank-based styling
function testRankBasedStyling() {
    console.log('=== Testing Rank-Based Styling ===')
    console.log('All-time leaderboard data:', window.allTimeLeaderboardData)
    console.log('Monthly leaderboard data:', window.monthlyLeaderboardData)
    
    // Test với một số employee IDs
    const testEmployeeIds = ['test-1', 'test-2', 'test-3']
    
    testEmployeeIds.forEach(employeeId => {
        const rank = getEmployeeRank(employeeId)
        const colorClass = getAssigneeColorClass(rank)
        console.log(`Employee ${employeeId}:`, { rank, colorClass })
    })
    
    console.log('=== End Test ===')
}

// Project Reporting Functions
async function showProjectReport(projectId) {
    // Check if user has permission to view reports (only boss and manager)
    if (!currentUser || !hasManagerOrBossPermissions(currentUser)) {
        showNotification('Bạn không có quyền xem báo cáo thống kê', 'error')
        return
    }

    const project = projects.find(p => p.id === projectId)
    if (!project) {
        showNotification('Không tìm thấy dự án', 'error')
        return
    }
    
    // Set project name in modal
    document.getElementById('reportProjectName').textContent = project.name
    
    // Populate employee filter dropdown
    const employeeFilter = document.getElementById('reportEmployeeFilter')
    employeeFilter.innerHTML = '<option value="">Tất cả nhân viên</option>'
    
    const projectEmployees = window.allEmployees.filter(emp => {
        const projectTasks = tasks.filter(task => task.project_id === projectId && task.assignee_id === emp.id)
        return projectTasks.length > 0
    })
    
    projectEmployees.forEach(employee => {
        const option = document.createElement('option')
        option.value = employee.id
        option.textContent = employee.name
        employeeFilter.appendChild(option)
    })
    
    // Calculate and display report
    await calculateProjectReport(projectId)
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('projectReportModal'))
    modal.show()
}

async function calculateProjectReport(projectId) {
    const projectTasks = tasks.filter(task => task.project_id === projectId)
    const reportData = {}
    
    // Group tasks by employee
    projectTasks.forEach(task => {
        const employeeId = task.assignee_id
        if (!employeeId) return
        
        const employee = window.allEmployees.find(emp => emp.id === employeeId)
        if (!employee) return
        
        if (!reportData[employeeId]) {
            reportData[employeeId] = {
                employee: employee,
                taskCount: 0,
                rvChars: 0,
                betaChars: 0,
                rvMoney: 0,
                betaMoney: 0,
                totalMoney: 0
            }
        }
        
        const data = reportData[employeeId]
        data.taskCount++
        
        if (task.task_type === 'rv') {
            data.rvChars += parseInt(task.rv_chars || 0)
            data.rvMoney += parseFloat(task.rate || 0) * (parseInt(task.rv_chars || 0) / 1000)
        } else if (task.task_type === 'beta') {
            data.betaChars += parseInt(task.beta_chars || 0)
            data.betaMoney += parseFloat(task.beta_rate || 0) * (parseInt(task.beta_chars || 0) / 1000)
        }
        
        data.totalMoney = data.rvMoney + data.betaMoney
    })
    
    currentReportData = reportData
    displayReportData(reportData)
}

function displayReportData(reportData) {
    const tbody = document.getElementById('reportTableBody')
    tbody.innerHTML = ''
    
    let totalTasks = 0
    let totalRVChars = 0
    let totalBetaChars = 0
    let totalMoney = 0
    
    Object.values(reportData).forEach(data => {
        totalTasks += data.taskCount
        totalRVChars += data.rvChars
        totalBetaChars += data.betaChars
        totalMoney += data.totalMoney
        
        const row = document.createElement('tr')
        row.innerHTML = `
            <td><strong>${data.employee.name}</strong></td>
            <td><span class="badge bg-primary">${data.taskCount}</span></td>
            <td>${data.rvChars.toLocaleString()}</td>
            <td>${data.betaChars.toLocaleString()}</td>
            <td>${data.rvMoney.toLocaleString()} VNĐ</td>
            <td>${data.betaMoney.toLocaleString()} VNĐ</td>
            <td><strong>${data.totalMoney.toLocaleString()} VNĐ</strong></td>
        `
        tbody.appendChild(row)
    })
    
    // Update summary cards
    document.getElementById('totalTasksCount').textContent = totalTasks
    document.getElementById('totalRVChars').textContent = totalRVChars.toLocaleString()
    document.getElementById('totalBetaChars').textContent = totalBetaChars.toLocaleString()
    document.getElementById('totalMoney').textContent = totalMoney.toLocaleString() + ' VNĐ'
}

function filterReportData() {
    const selectedEmployee = document.getElementById('reportEmployeeFilter').value
    
    if (!currentReportData) return
    
    let filteredData = currentReportData
    
    if (selectedEmployee) {
        filteredData = {}
        if (currentReportData[selectedEmployee]) {
            filteredData[selectedEmployee] = currentReportData[selectedEmployee]
        }
    }
    
    displayReportData(filteredData)
}

function exportReportToCSV() {
    if (!currentReportData) {
        showNotification('Không có dữ liệu để xuất', 'error')
        return
    }
    
    const selectedEmployee = document.getElementById('reportEmployeeFilter').value
    let dataToExport = currentReportData
    
    if (selectedEmployee) {
        dataToExport = {}
        if (currentReportData[selectedEmployee]) {
            dataToExport[selectedEmployee] = currentReportData[selectedEmployee]
        }
    }
    
    // Create CSV content
    let csvContent = 'Nhân viên,Số công việc,Chữ RV,Chữ Beta,Tiền RV,Tiền Beta,Tổng tiền\n'
    
    Object.values(dataToExport).forEach(data => {
        csvContent += `"${data.employee.name}",${data.taskCount},${data.rvChars},${data.betaChars},${data.rvMoney},${data.betaMoney},${data.totalMoney}\n`
    })
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `bao-cao-du-an-${Date.now()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showNotification('Đã xuất báo cáo thành công!', 'success')
}

// Beta Data Functions
function viewBetaData(taskId) {
    // Chuyển hướng đến edit mode thay vì chỉ xem
    editBetaData(taskId)
}

function inputBetaData(taskId) {
    window.open(`beta-input.html?taskId=${taskId}&mode=input`, '_blank')
}

function editBetaData(taskId) {
    window.open(`beta-input.html?taskId=${taskId}&mode=edit`, '_blank')
}

// Download Beta Files Functions
async function downloadBetaFiles(projectId) {
    const project = projects.find(p => p.id === projectId)
    if (!project) return
    
    // Kiểm tra quyền
    if (!currentUser || (!isBoss(currentUser) && currentUser.role !== 'manager')) {
        showNotification('Bạn không có quyền tải file beta', 'error')
        return
    }
    
    // Lấy danh sách beta tasks của dự án
    const betaTasks = tasks.filter(t => 
        t.project_id === projectId && 
        t.task_type === 'beta' && 
        t.beta_link // Chỉ những task có dữ liệu beta
    )
    
    if (betaTasks.length === 0) {
        showNotification('Không có file beta nào để tải', 'info')
        return
    }
    
    // Populate modal
    document.getElementById('downloadProjectName').textContent = project.name
    populateBetaFilesTable(betaTasks)
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('downloadBetaModal'))
    modal.show()
}

function populateBetaFilesTable(betaTasks) {
    const tbody = document.getElementById('betaFilesTableBody')
    tbody.innerHTML = ''
    
    // Sắp xếp betaTasks theo số chap
    betaTasks.sort((a, b) => {
        const extractNumber = (name) => {
            const match = (name || '').match(/\d+/)
            return match ? parseInt(match[0], 10) : null
        }
        const numA = extractNumber(a.name)
        const numB = extractNumber(b.name)
        if (numA !== null && numB !== null) {
            return numA - numB
        }
        return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' })
    })
    
    betaTasks.forEach(task => {
        const assignee = window.allEmployees.find(e => e.id === task.assignee_id)
        const row = document.createElement('tr')
        row.innerHTML = `
            <td><input type="checkbox" class="beta-file-checkbox" value="${task.id}" checked></td>
            <td>${task.name}</td>
            <td>${assignee ? assignee.name : 'N/A'}</td>
            <td>${getTaskStatusBadge(task.status)}</td>
            <td>${formatDateTime(task.updated_at || task.created_at)}</td>
        `
        tbody.appendChild(row)
    })
    
    // Setup select all checkbox
    setupSelectAllBetaFiles()
}

function setupSelectAllBetaFiles() {
    const selectAll = document.getElementById('selectAllBetaFiles')
    const checkboxes = document.querySelectorAll('.beta-file-checkbox')
    
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            checkboxes.forEach(cb => cb.checked = this.checked)
        })
        
        // Update select all when individual checkboxes change
        checkboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                const allChecked = Array.from(checkboxes).every(c => c.checked)
                const someChecked = Array.from(checkboxes).some(c => c.checked)
                selectAll.checked = allChecked
                selectAll.indeterminate = someChecked && !allChecked
            })
        })
    }
}

async function executeDownload() {
    const downloadMode = document.getElementById('downloadMode').value
    const mergeOption = document.getElementById('mergeOption').value
    const selectedTasks = Array.from(document.querySelectorAll('.beta-file-checkbox:checked'))
        .map(cb => parseInt(cb.value))
    
    if (selectedTasks.length === 0) {
        showNotification('Vui lòng chọn ít nhất một file để tải', 'error')
        return
    }
    
    try {
        if (mergeOption === 'merge') {
            // Gộp thành 1 file
            await downloadMergedBetaFiles(selectedTasks)
        } else {
            // Tải file riêng biệt
            await downloadSeparateBetaFiles(selectedTasks)
        }
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('downloadBetaModal'))
        modal.hide()
        
        showNotification('Tải file thành công!', 'success')
        
    } catch (error) {
        console.error('Error downloading files:', error)
        showNotification('Lỗi khi tải file: ' + error.message, 'error')
    }
}

async function downloadMergedBetaFiles(taskIds) {
    const betaTasks = tasks.filter(t => taskIds.includes(t.id));
    let mergedContent = '';

    for (const task of betaTasks) {
        if (task.beta_link) {
            mergedContent += task.beta_link + '<br><br>';
        }
    }

    const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office'
              xmlns:w='urn:schemas-microsoft-com:office:word'
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'></head>
        <body>${mergedContent.trim()}</body>
        </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/msword',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beta_merged_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function downloadSeparateBetaFiles(taskIds) {
    const betaTasks = tasks.filter(t => taskIds.includes(t.id))
    
    for (const task of betaTasks) {
        try {
            let content = ''
            
            if (task.beta_link) {
                content = task.beta_link
            }
            
            // Tạo file riêng cho từng task
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `beta_${task.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            
            // Delay nhỏ để tránh browser block multiple downloads
            await new Promise(resolve => setTimeout(resolve, 100))
            
        } catch (error) {
            console.error(`Error downloading file for task ${task.id}:`, error)
        }
    }
}