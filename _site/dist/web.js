!function(t){function e(e){for(var n,o,i=e[0],a=e[1],u=0,l=[];u<i.length;u++)o=i[u],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&l.push(r[o][0]),r[o]=0;for(n in a)Object.prototype.hasOwnProperty.call(a,n)&&(t[n]=a[n]);for(c&&c(e);l.length;)l.shift()()}var n={},r={0:0};function o(e){if(n[e])return n[e].exports;var r=n[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.e=function(t){var e=[],n=r[t];if(0!==n)if(n)e.push(n[2]);else{var i=new Promise((function(e,o){n=r[t]=[e,o]}));e.push(n[2]=i);var a,u=document.createElement("script");u.charset="utf-8",u.timeout=120,o.nc&&u.setAttribute("nonce",o.nc),u.src=function(t){return o.p+""+t+".web.js"}(t);var c=new Error;a=function(e){u.onerror=u.onload=null,clearTimeout(l);var n=r[t];if(0!==n){if(n){var o=e&&("load"===e.type?"missing":e.type),i=e&&e.target&&e.target.src;c.message="Loading chunk "+t+" failed.\n("+o+": "+i+")",c.name="ChunkLoadError",c.type=o,c.request=i,n[1](c)}r[t]=void 0}};var l=setTimeout((function(){a({type:"timeout",target:u})}),12e4);u.onerror=u.onload=a,document.head.appendChild(u)}return Promise.all(e)},o.m=t,o.c=n,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/beyond/dist/",o.oe=function(t){throw console.error(t),t};var i=window.webpackJsonp=window.webpackJsonp||[],a=i.push.bind(i);i.push=e,i=i.slice();for(var u=0;u<i.length;u++)e(i[u]);var c=a;o(o.s=7)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){return 0===t?"0":"".concat(t,"px")}},function(t,e,n){(function(e){var n=/^\s+|\s+$/g,r=/^[-+]0x[0-9a-f]+$/i,o=/^0b[01]+$/i,i=/^0o[0-7]+$/i,a=parseInt,u="object"==typeof e&&e&&e.Object===Object&&e,c="object"==typeof self&&self&&self.Object===Object&&self,l=u||c||Function("return this")(),s=Object.prototype.toString,f=Math.max,d=Math.min,p=function(){return l.Date.now()};function v(t,e,n){var r,o,i,a,u,c,l=0,s=!1,v=!1,h=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function b(e){var n=r,i=o;return r=o=void 0,l=e,a=t.apply(i,n)}function w(t){return l=t,u=setTimeout(E,e),s?b(t):a}function g(t){var n=t-c;return void 0===c||n>=e||n<0||v&&t-l>=i}function E(){var t=p();if(g(t))return x(t);u=setTimeout(E,function(t){var n=e-(t-c);return v?d(n,i-(t-l)):n}(t))}function x(t){return u=void 0,h&&r?b(t):(r=o=void 0,a)}function S(){var t=p(),n=g(t);if(r=arguments,o=this,c=t,n){if(void 0===u)return w(c);if(v)return u=setTimeout(E,e),b(c)}return void 0===u&&(u=setTimeout(E,e)),a}return e=m(e)||0,y(n)&&(s=!!n.leading,i=(v="maxWait"in n)?f(m(n.maxWait)||0,e):i,h="trailing"in n?!!n.trailing:h),S.cancel=function(){void 0!==u&&clearTimeout(u),l=0,r=c=o=u=void 0},S.flush=function(){return void 0===u?a:x(p())},S}function y(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function m(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return!!t&&"object"==typeof t}(t)&&"[object Symbol]"==s.call(t)}(t))return NaN;if(y(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=y(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(n,"");var u=o.test(t);return u||i.test(t)?a(t.slice(2),u?2:8):r.test(t)?NaN:+t}t.exports=function(t,e,n){var r=!0,o=!0;if("function"!=typeof t)throw new TypeError("Expected a function");return y(n)&&(r="leading"in n?!!n.leading:r,o="trailing"in n?!!n.trailing:o),v(t,e,{leading:r,maxWait:e,trailing:o})}}).call(this,n(5))},function(t,e){t.exports=function(){}},function(t,e){var n=/^\s+|\s+$/g,r=/^[-+]0x[0-9a-f]+$/i,o=/^0b[01]+$/i,i=/^0o[0-7]+$/i,a=/^(?:0|[1-9]\d*)$/,u=parseInt,c=Object.prototype.toString,l=Math.ceil,s=Math.max;function f(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function d(t){return t?(t=function(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return!!t&&"object"==typeof t}(t)&&"[object Symbol]"==c.call(t)}(t))return NaN;if(f(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=f(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(n,"");var a=o.test(t);return a||i.test(t)?u(t.slice(2),a?2:8):r.test(t)?NaN:+t}(t))===1/0||t===-1/0?17976931348623157e292*(t<0?-1:1):t==t?t:0:0===t?t:0}var p,v=function(t,e,n){return n&&"number"!=typeof n&&function(t,e,n){if(!f(n))return!1;var r=typeof e;return!!("number"==r?function(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991}(t.length)&&!function(t){var e=f(t)?c.call(t):"";return"[object Function]"==e||"[object GeneratorFunction]"==e}(t)}(n)&&function(t,e){return!!(e=null==e?9007199254740991:e)&&("number"==typeof t||a.test(t))&&t>-1&&t%1==0&&t<e}(e,n.length):"string"==r&&e in n)&&function(t,e){return t===e||t!=t&&e!=e}(n[e],t)}(t,e,n)&&(e=n=void 0),t=d(t),void 0===e?(e=t,t=0):e=d(e),function(t,e,n,r){for(var o=-1,i=s(l((e-t)/(n||1)),0),a=Array(i);i--;)a[r?i:++o]=t,t+=n;return a}(t,e,n=void 0===n?t<e?1:-1:d(n),p)};t.exports=v},function(t,e){var n=/^(?:0|[1-9]\d*)$/;function r(t,e){return function(t,e){for(var n=-1,r=t?t.length:0,o=Array(r);++n<r;)o[n]=e(t[n],n,t);return o}(e,(function(e){return t[e]}))}var o,i,a=Object.prototype,u=a.hasOwnProperty,c=a.toString,l=a.propertyIsEnumerable,s=Math.floor,f=(o=Object.keys,i=Object,function(t){return o(i(t))}),d=Math.random;function p(t,e){var n=m(t)||function(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&h(t)}(t)&&u.call(t,"callee")&&(!l.call(t,"callee")||"[object Arguments]"==c.call(t))}(t)?function(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}(t.length,String):[],r=n.length,o=!!r;for(var i in t)!e&&!u.call(t,i)||o&&("length"==i||y(i,r))||n.push(i);return n}function v(t){if(n=(e=t)&&e.constructor,r="function"==typeof n&&n.prototype||a,e!==r)return f(t);var e,n,r,o=[];for(var i in Object(t))u.call(t,i)&&"constructor"!=i&&o.push(i);return o}function y(t,e){return!!(e=null==e?9007199254740991:e)&&("number"==typeof t||n.test(t))&&t>-1&&t%1==0&&t<e}var m=Array.isArray;function h(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991}(t.length)&&!function(t){var e=function(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}(t)?c.call(t):"";return"[object Function]"==e||"[object GeneratorFunction]"==e}(t)}t.exports=function(t){var e,n,o,i=h(t)?t:(e=t)?r(e,function(t){return h(t)?p(t):v(t)}(e)):[],a=i.length;return a>0?i[(n=0,o=a-1,n+s(d()*(o-n+1)))]:void 0}},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e){function n(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}(t,e)||r(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function r(t,e){if(t){if("string"==typeof t)return o(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?o(t,e):void 0}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function i(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var a,u;a=window.beyond=window.beyond||{},u=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.dom=e,this.currentIndex=0,this.init()}var e,o,a;return e=t,(o=[{key:"removeCurrentClass",value:function(){null!==this.currentIndex&&this.tabs[this.currentIndex].classList.remove("js-active")}},{key:"setBoxHeight",value:function(){var t=this.currentIndex,e=0===t?"none":"translateX(-".concat(100*t,"%)");this.panesBox.style.transform=e,this.panesBox.style.msTransform=e,this.panesBox.style.height=this.panes[t].offsetHeight+"px"}},{key:"init",value:function(){var t=this;this.tabs=this.dom.querySelectorAll("[data-tabs] > a"),this.panes=this.dom.querySelectorAll("[data-panes] > div"),this.panesBox=this.dom.querySelector("[data-panes]"),this.tabs.forEach((function(e,n){e._handleTabClick=function(){t.removeCurrentClass(),t.currentIndex=n,e.classList.add("js-active"),t.setBoxHeight()},e.addEventListener("click",e._handleTabClick,!1)}));var e=n(this.tabs,1)[0];e&&e.classList.add("js-active"),this.setBoxHeight(),this.addEvents()}},{key:"addEvents",value:function(){var t=this;void 0!==window.MutationObserver&&(this.mutationObserver=new MutationObserver((function(e,n){var o,i=function(t,e){var n;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=r(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var o=0,i=function(){};return{s:i,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u=!0,c=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return u=t.done,t},e:function(t){c=!0,a=t},f:function(){try{u||null==n.return||n.return()}finally{if(c)throw a}}}}(e);try{for(i.s();!(o=i.n()).done;){var a=o.value;("childList"===a.type||"attributes"===a.type)&&t.setBoxHeight()}}catch(t){i.e(t)}finally{i.f()}})),this.mutationObserver.observe(this.dom,{attributes:!0,childList:!0,subtree:!0})),this._handleWindowResize=function(){return t.setBoxHeight()},window.addEventListener("resize",this._handleWindowResize)}},{key:"destroy",value:function(){this.mutationObserver&&this.mutationObserver.disconnect(),window.removeEventListener("resize",this._handleWindowResize)}}])&&i(e.prototype,o),a&&i(e,a),t}(),a.Codebox=u},function(t,e,n){"use strict";n.r(e);n(6);var r=n(2),o=n.n(r);function i(t,e,n,r,o,i,a){try{var u=t[i](a),c=u.value}catch(t){return void n(t)}u.done?e(c):Promise.resolve(c).then(r,o)}function a(){var t=document.querySelector("[data-autocomplete]");if(!t)return o.a;var e=window.beyond.Autocomplete,n=[{prefix:"SP",title:"🔥SHARE.CO🔥經典香水吊卡 ➜ 糖果茉莉, 奇蹟罌粟, 能量麝香, 甜蜜莉莉"},{prefix:"SPY",title:"🔥SHARE.CO🔥經典粉絲限定 VIP 方案"},{prefix:"SW",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"}],r=new e(t,{getData:function(t){return(e=regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.keyword,e.abrupt("return",n.filter((function(t){var e=t.prefix,n=t.title,o=r.toUpperCase(),i=n.toUpperCase();return e.toUpperCase().includes(o)||i.includes(o)})));case 2:case"end":return e.stop()}}),e)})),function(){var t=this,n=arguments;return new Promise((function(r,o){var a=e.apply(t,n);function u(t){i(a,r,o,u,c,"next",t)}function c(t){i(a,r,o,u,c,"throw",t)}u(void 0)}))})();var e},itemClick:function(t){return t.prefix}});return function(){r.destroy()}}function u(){var t=new(0,window.beyond.Toast),e=Array.from(document.querySelectorAll("div.icon")),n=document.getElementById("icon-search"),r=function(e){var n=e.target;n.classList.contains("icon")&&(n=n.children[0]);var r=function(t){switch(t.tagName){case"I":return t.className;case"IMG":return t.getAttribute("src");default:throw new Error("Unhandled tag: ".concat(t.tagName))}}(n);navigator.clipboard.writeText(r).then((function(){t.send("已複製 ".concat(r))}))};e.forEach((function(t){t.addEventListener("click",r)}));var o=document.querySelectorAll(".codebox-result > .icon > .icon-content > i"),i=document.querySelectorAll(".codebox-result > .icon > .icon-content > .svg"),a=function(t,e,n){t.toLowerCase().startsWith(e.toLowerCase())?n.parentNode.parentNode.style.display="inline-block":n.parentNode.parentNode.style.display="none"},u=function(t){var e=t.target.value;i.forEach((function(t){return a(t.alt,e,t)})),o.forEach((function(t){var n=t.className.replace(/^icon-/,"");a(n,e,t)}))};return n&&n.addEventListener("input",u,!1),function(){e.forEach((function(t){t.removeEventListener("click",r)})),n&&n.removeEventListener("input",u,!1)}}var c=n(3),l=n.n(c),s=n(4),f=n.n(s),d=n(1),p=n.n(d),v=n(0),y=n.n(v);function m(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return h(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return h(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function h(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function b(t,e){if(e.length<t)throw new TypeError(t+" argument"+t>1?"s":" required, but only "+e.length+" present")}function w(t){b(1,arguments);var e=Object.prototype.toString.call(t);return t instanceof Date||"object"==typeof t&&"[object Date]"===e?new Date(t.getTime()):"number"==typeof t||"[object Number]"===e?new Date(t):("string"!=typeof t&&"[object String]"!==e||"undefined"==typeof console||(console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"),console.warn((new Error).stack)),new Date(NaN))}function g(t){b(1,arguments);var e=w(t);return e.setHours(23,59,59,999),e}function E(){return new Promise((function(t){try{new Intl.DateTimeFormat("en",{timeZone:"Asia/Taipei"}).format(),t()}catch(e){n.e(1).then(function(e){n(18),t()}.bind(null,n)).catch(n.oe)}}))}function x(){return new Promise((function(t){"undefined"==typeof Intl?Promise.all([n.e(2),n.e(3)]).then(function(e){n(16),n(17),t()}.bind(null,n)).catch(n.oe):t()})).then(E)}function S(t){if(null===t||!0===t||!1===t)return NaN;var e=Number(t);return isNaN(e)?e:e<0?Math.ceil(e):Math.floor(e)}function j(t){b(1,arguments);var e=w(t),n=e.getFullYear(),r=e.getMonth(),o=new Date(0);return o.setFullYear(n,r+1,0),o.setHours(0,0,0,0),o.getDate()}function A(t,e){b(2,arguments);var n=w(t),r=S(e),o=n.getFullYear(),i=n.getDate(),a=new Date(0);a.setFullYear(o,r,15),a.setHours(0,0,0,0);var u=j(a);return n.setMonth(r,Math.min(i,u)),n}function T(){var t=window.beyond,e=t.DateMenu,n=t.Datepicker,r=t.Timepicker,o=[],i=[],a=[],u=!1;return x().then((function(){if(!u){var t=function(t){return parseInt(+t/1e3,10)}(new Date);o=Array.from(document.querySelectorAll("[data-datepicker]")).map((function(e){return new n(e,t)})),i=Array.from(document.querySelectorAll("[data-timepicker]")).map((function(e){return new r(e,t)}));var c=new Date;a=Array.from(document.querySelectorAll("[data-date-menu]")).map((function(t){return new e({date:c,options:{dom:t,isStatic:!0}})})).map((function(t){return t.on("td-click",(function(e,n){var r=n.year,o=n.month,i=n.date,a=function(t,e){if(b(2,arguments),"object"!=typeof e||null===e)throw new RangeError("values parameter must be an object");var n=w(t);return isNaN(n)?new Date(NaN):(null!=e.year&&n.setFullYear(e.year),null!=e.month&&(n=A(n,e.month)),null!=e.date&&n.setDate(S(e.date)),null!=e.hours&&n.setHours(S(e.hours)),null!=e.minutes&&n.setMinutes(S(e.minutes)),null!=e.seconds&&n.setSeconds(S(e.seconds)),null!=e.milliseconds&&n.setMilliseconds(S(e.milliseconds)),n)}(new Date,{year:r,month:o,date:i});t.setDate({startDate:a})})),t.setDate({date:c,startDate:c}),t.show(),t}))}})),function(){u=!0,o.forEach((function(t){return t.destroy()})),i.forEach((function(t){return t.destroy()})),a.forEach((function(t){return t.destroy()}))}}function O(t,e,n,r,o,i,a){try{var u=t[i](a),c=u.value}catch(t){return void n(t)}u.done?e(c):Promise.resolve(c).then(r,o)}function k(){var t=window.beyond.SearchDropdown,e=[{prefix:"SP",title:"🔥SHARE.CO🔥經典香水吊卡 ➜ 糖果茉莉, 奇蹟罌粟, 能量麝香, 甜蜜莉莉"},{prefix:"SPY",title:"🔥SHARE.CO🔥經典粉絲限定 VIP 方案"},{prefix:"SW",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW1",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW2",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW3",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW4",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW5",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW6",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW7",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW8",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW9",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW10",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW11",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW12",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW13",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW14",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"}],n={placeholder:"搜尋",renderItem:function(t,e,n){return'\n        <div class="search-dropdown-menu-item '.concat(n?"selected":"",'"\n             data-item>\n          <strong>').concat(t.prefix,"</strong>\n          <span>").concat(t.title,"</span>\n        </div>\n        ")},getData:function(t){return(n=regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",e.filter((function(e){var n=e.prefix,r=e.title,o=t.toUpperCase(),i=r.toUpperCase();return n.toUpperCase().includes(o)||i.includes(o)})));case 1:case"end":return n.stop()}}),n)})),function(){var t=this,e=arguments;return new Promise((function(r,o){var i=n.apply(t,e);function a(t){O(i,r,o,a,u,"next",t)}function u(t){O(i,r,o,a,u,"throw",t)}a(void 0)}))})();var n},itemClick:function(t){return t.prefix}},r=Array.from(document.querySelectorAll("[data-search-dropdown]")).map((function(e){return new t(e,n)}));return function(){r.forEach((function(t){return t.destroy()}))}}var L=window,I=L.beyond,D=L.Turbolinks,M=L.$,W=window["beyond-jquery"].default,q=[];function C(){var t,e,r,i,c,s,d,v,h,b,w,E,S,j,A,O,L,D,M;I.bind(),q.push((t=window.beyond.Codebox,e=Array.from(document.querySelectorAll("[data-codebox]")).map((function(e){return new t(e)})),function(){e.forEach((function(t){return t.destroy()}))})),q.push(function(){var t=document.getElementById("width-pad"),e=n(1),r=document.querySelectorAll("[data-table-resolution]"),o=function(){t&&(t.innerText="目前視窗寬度: "+window.innerWidth+"px");var e,n=(e=window.innerWidth)>=1200?5:e>=992?4:e>=768?3:e>=576?2:1;r.forEach((function(t){!function(t,e){t.querySelectorAll("tr").forEach((function(t,n){var r=0===n?"th":"td";t.querySelectorAll(r).forEach((function(t,n){n===e?t.classList.add("active"):t.classList.remove("active")}))}))}(t,n)}))};o();var i=e(o,100);return window.addEventListener("resize",i),function(){window.removeEventListener("resize",i)}}()),q.push(a()),q.push((r=window.beyond.Btn,(i=Array.from(document.querySelectorAll("[data-btn]")).map((function(t){return new r(t)}))).forEach((function(t){t.addEvent(t.dom,"click",(function(){t.setLoading(!t.loading)}))})),function(){i.forEach((function(t){return t.destroy()}))})),q.push(function(){var t=window.beyond.LineChart,e=document.getElementById("line-chart");if(!e)return function(){};var n=function(t){return t.toString().padStart(2,"0")},r=function(t){var e=new Date(t);return n(e.getHours())+":"+n(e.getMinutes())},o=document.getElementById("chart-menu"),i=new t(e,{toXLabel:r,toYLabel:function(t){var e=(t/1e4).toFixed(1),n=m(e.split("."),2),r=n[0],o=n[1];return"0"===r&&"0"===o?"0":"0"===o?r+"萬":e+"萬"},lineLabels:["線段1","線段2","線段3"],yStep:2e4,onPointMouseOver:function(t,e){if(e){var n=e.point;o.innerHTML="\n          <div>時間: ".concat(r(n.x),"</div>\n          <div>金錢: ").concat(n.y,"</div>\n        "),o.style.left=y()(t.x),o.style.top=y()(t.y+20),o.style.display="block"}else o.style.display="none"}}),a=+new Date,u=function(){return f()([1e3,2e3,3e3,4e3,500])},c=l()(1,21).map((function(t){return{x:a+3e5*t,y:t*u()}})),s=l()(1,21).map((function(t){return{x:a+3e5*t,y:t*u()}})),d=l()(1,21).map((function(t){return{x:a+3e5*t,y:t*u()}}));i.setData([c,s,d]);var v=e.offsetWidth,h=p()((function(){e.offsetWidth!==v&&i.refresh(),v=e.offsetWidth}),300);return window.addEventListener("resize",h),function(){window.removeEventListener("resize",h),i.destroy()}}()),q.push(function(){var t=window.beyond.BarChart,e=document.getElementById("bar-chart");if(!e)return function(){};var n=document.getElementById("chart-menu"),r=new t(e,{onBarMouseOver:function(t,e){if(e){var r=e.index,o=e.bar;n.innerHTML="\n          <div>index: ".concat(r,"</div>\n          <div>時間: ").concat(o.label,"</div>\n          <div>數字: ").concat(o.value,"</div>\n        "),n.style.left=y()(t.x),n.style.top=y()(t.y+20),n.style.display="block"}else n.style.display="none"}});r.setData([{label:"1 個月內",value:.8},{label:"3 個月內",value:1.7},{label:"6 個月內",value:1.1}]);var o=e.offsetWidth,i=p()((function(){e.offsetWidth!==o&&r.refresh(),o=e.offsetWidth}),300);return window.addEventListener("resize",i),function(){window.removeEventListener("resize",i),r.destroy()}}()),q.push((c=window.beyond.DateTimeRanger,s=function(t){return parseInt(+t/1e3,10)},d=[],v=!1,x().then((function(){v||(d=Array.from(document.querySelectorAll("[data-date-time-ranger]")).map((function(t){return new c(t,{startAt:s(new Date),endAt:s(g(new Date))})})))})),function(){v=!0,d.forEach((function(t){return t.destroy()}))})),q.push(T()),q.push((h=window.beyond.Modal,b=Array.from(document.querySelectorAll("[data-modal-opener]")).map((function(t){return new h(t,{confirm:function(){console.log("confirmed")},cancel:function(t){console.log("cancelled",t)}})})),function(){b.forEach((function(t){return t.destroy()}))})),q.push(k()),q.push(function(){var t=document.getElementById("btn-toast");if(!t)return o.a;var e=["路人甲","路人乙","路人丙"],n=["吃了一個漢堡","跌了一跤","說: 你當台灣人是塑膠做的喔 ! 不要欺負我們台灣人"],r=new(0,window.beyond.Toast),i=0,a=function(){var t=(parseInt(10*Math.random(),10)+1)%e.length;r.send({message:"".concat(++i,". ").concat(e[t]).concat(n[t]),btnText:"取消",btnCb:function(t){t.clear()}})};return t.addEventListener("click",a),function(){r.destroy(),t&&t.removeEventListener("click",a)}}()),q.push(u()),q.push((w=document.getElementById("jq-modal-btn"),E=document.getElementById("jq-modal-replace-btn"),S=document.getElementById("jq-uniq-modal-btn"),j=function(){$(".jquery-modal").modal("show"),setTimeout((function(){console.log("open?",$(".jquery-modal").modal("open?"))}),1e3)},A=function(){$(".jquery-modal").modal("show",'\n    <div class="modal jquery-modal">\n      <div class="modal-dialog">\n        <div class="modal-content">\n          <div class="modal-header">\n            <h5 class="modal-title">視窗標題</h5>\n            <button type="button" class="btn-close" data-close aria-label="Close">\n              <i class="icon icon-cross"></i>\n            </button>\n          </div>\n          <div class="modal-body bg-content">\n            換掉了...\n          </div>\n          <div class="modal-footer">\n            <button data-cancel class="btn btn-outline">取消</button>\n            <button data-confirm class="btn btn-primary">確認</button>\n          </div>\n        </div>\n      </div>\n    </div>\n  ')},O=function(){$.uniqModal().modal("show")},w&&w.addEventListener("click",j),E&&E.addEventListener("click",A),S&&S.addEventListener("click",O),function(){w&&w.removeEventListener("click",j),E&&E.removeEventListener("click",A),S&&S.removeEventListener("click",O)})),q.push((L=window.beyond.TagInput,D=["apple","lemon","love"],M=Array.from(document.querySelectorAll("[data-tag-input]")).map((function(t){return new L(t,{suggest:function(t){return t?D.find((function(e){return e.startsWith(t)})):""},validate:function(t){return D.includes(t)?{isTag:!0,classname:"tag-extra"}:{isTag:!1}},change:function(t){console.log("change",t)}})})),function(){M.forEach((function(t){return t.destroy()}))}))}void 0===D?C():D.start(),W(I,M),document.addEventListener("turbolinks:before-cache",(function(){return q.forEach((function(t){return t()})),q.length=0,void I.unbindAll()})),document.addEventListener("turbolinks:load",(function(){return C()}))}]);
//# sourceMappingURL=web.js.map