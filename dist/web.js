!function(e){function t(t){for(var n,o,i=t[0],a=t[1],c=0,s=[];c<i.length;c++)o=i[c],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&s.push(r[o][0]),r[o]=0;for(n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n]);for(u&&u(t);s.length;)s.shift()()}var n={},r={0:0};function o(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.e=function(e){var t=[],n=r[e];if(0!==n)if(n)t.push(n[2]);else{var i=new Promise((function(t,o){n=r[e]=[t,o]}));t.push(n[2]=i);var a,c=document.createElement("script");c.charset="utf-8",c.timeout=120,o.nc&&c.setAttribute("nonce",o.nc),c.src=function(e){return o.p+""+e+".web.js"}(e);var u=new Error;a=function(t){c.onerror=c.onload=null,clearTimeout(s);var n=r[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src;u.message="Loading chunk "+e+" failed.\n("+o+": "+i+")",u.name="ChunkLoadError",u.type=o,u.request=i,n[1](u)}r[e]=void 0}};var s=setTimeout((function(){a({type:"timeout",target:c})}),12e4);c.onerror=c.onload=a,document.head.appendChild(c)}return Promise.all(t)},o.m=e,o.c=n,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/beyond/dist/",o.oe=function(e){throw console.error(e),e};var i=window.webpackJsonp=window.webpackJsonp||[],a=i.push.bind(i);i.push=t,i=i.slice();for(var c=0;c<i.length;c++)t(i[c]);var u=a;o(o.s=8)}([function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t){function n(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e))&&"[object Arguments]"!==Object.prototype.toString.call(e))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,c=e[Symbol.iterator]();!(r=(a=c.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var o,i;o=window.beyond=window.beyond||{},i=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.dom=t,this.currentIndex=0,this.init()}var t,o,i;return t=e,(o=[{key:"removeCurrentClass",value:function(){null!==this.currentIndex&&this.tabs[this.currentIndex].classList.remove("js-active")}},{key:"setBoxHeight",value:function(){var e=this.currentIndex,t=0===e?"none":"translateX(-".concat(100*e,"%)");this.panesBox.style.transform=t,this.panesBox.style.msTransform=t,this.panesBox.style.height=this.panes[e].offsetHeight+"px"}},{key:"init",value:function(){var e=this;this.tabs=this.dom.querySelectorAll("[data-tabs] > a"),this.panes=this.dom.querySelectorAll("[data-panes] > div"),this.panesBox=this.dom.querySelector("[data-panes]"),this.tabs.forEach((function(t,n){t._handleTabClick=function(){e.removeCurrentClass(),e.currentIndex=n,t.classList.add("js-active"),e.setBoxHeight()},t.addEventListener("click",t._handleTabClick,!1)}));var t=n(this.tabs,1)[0];t&&t.classList.add("js-active"),this.setBoxHeight(),this.addEvents()}},{key:"addEvents",value:function(){var e=this;void 0!==window.MutationObserver&&(this.mutationObserver=new MutationObserver((function(t,n){var r=!0,o=!1,i=void 0;try{for(var a,c=t[Symbol.iterator]();!(r=(a=c.next()).done);r=!0){var u=a.value;("childList"===u.type||"attributes"===u.type)&&e.setBoxHeight()}}catch(e){o=!0,i=e}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}})),this.mutationObserver.observe(this.dom,{attributes:!0,childList:!0,subtree:!0})),this._handleWindowResize=function(){return e.setBoxHeight()},window.addEventListener("resize",this._handleWindowResize)}},{key:"destroy",value:function(){this.mutationObserver&&this.mutationObserver.disconnect(),window.removeEventListener("resize",this._handleWindowResize)}}])&&r(t.prototype,o),i&&r(t,i),e}(),o.Codebox=i},function(e,t){!function(){var e=["路人甲","路人乙","路人丙"],t=["吃了一個漢堡","跌了一跤","說: 你當台灣人是塑膠做的喔 ! 不要欺負我們台灣人"],n=new(0,window.beyond.Toast),r=document.getElementById("btn-toast");if(r){var o=0;r.addEventListener("click",(function(){var r=(parseInt(10*Math.random(),10)+1)%e.length;n.send({message:"".concat(++o,". ").concat(e[r]).concat(t[r]),btnText:"取消",btnCb:function(e){e.clear()}})}),!1)}}()},function(e,t){var n=window.beyond.Modal;document.querySelectorAll("[data-modal-opener]").forEach((function(e){new n(e,{confirm:function(){console.log("confirmed")},cancel:function(e){console.log("cancelled",e)}})}))},function(e,t){function n(e,t,n,r,o,i,a){try{var c=e[i](a),u=c.value}catch(e){return void n(e)}c.done?t(u):Promise.resolve(u).then(r,o)}var r,o,i;r=window.beyond.Autocomplete,o=[{prefix:"SP",title:"🔥SHARE.CO🔥經典香水吊卡 ➜ 糖果茉莉, 奇蹟罌粟, 能量麝香, 甜蜜莉莉"},{prefix:"SPY",title:"🔥SHARE.CO🔥經典粉絲限定 VIP 方案"},{prefix:"SW",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"}],(i=document.querySelector("[data-autocomplete]"))&&new r(i,{getData:function(e){var t,r=e.keyword;return(t=regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",o.filter((function(e){var t=e.prefix,n=e.title,o=r.toUpperCase(),i=n.toUpperCase();return t.toUpperCase().includes(o)||i.includes(o)})));case 1:case"end":return e.stop()}}),e)})),function(){var e=this,r=arguments;return new Promise((function(o,i){var a=t.apply(e,r);function c(e){n(a,o,i,c,u,"next",e)}function u(e){n(a,o,i,c,u,"throw",e)}c(void 0)}))})()},itemClick:function(e){return e.prefix}})},function(e,t){function n(e,t,n,r,o,i,a){try{var c=e[i](a),u=c.value}catch(e){return void n(e)}c.done?t(u):Promise.resolve(u).then(r,o)}var r,o;r=window.beyond.SearchDropdown,o=[{prefix:"SP",title:"🔥SHARE.CO🔥經典香水吊卡 ➜ 糖果茉莉, 奇蹟罌粟, 能量麝香, 甜蜜莉莉"},{prefix:"SPY",title:"🔥SHARE.CO🔥經典粉絲限定 VIP 方案"},{prefix:"SW",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW1",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW2",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW3",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW4",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW5",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW6",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW7",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW8",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW9",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW10",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW11",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW12",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW13",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"},{prefix:"SW14",title:"素TEE / 內褲 / 平口褲 ➜ 版型專為亞洲人身形設計"}],document.querySelectorAll("[data-search-dropdown]").forEach((function(e){new r(e,{placeholder:"搜尋",renderItem:function(e,t,n){return'\n            <div class="search-dropdown-menu-item '.concat(n?"selected":"",'"\n                 data-item>\n              <strong>').concat(e.prefix,"</strong>\n              <span>").concat(e.title,"</span>\n            </div>\n            ")},getData:function(e){return(t=regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",o.filter((function(t){var n=t.prefix,r=t.title,o=e.toUpperCase(),i=r.toUpperCase();return n.toUpperCase().includes(o)||i.includes(o)})));case 1:case"end":return t.stop()}}),t)})),function(){var e=this,r=arguments;return new Promise((function(o,i){var a=t.apply(e,r);function c(e){n(a,o,i,c,u,"next",e)}function u(e){n(a,o,i,c,u,"throw",e)}c(void 0)}))})();var t},itemClick:function(e){return e.prefix}})}))},function(e,t){var n;n=window.beyond.Btn,document.querySelectorAll("[data-btn]").forEach((function(e){var t=new n(e);e.addEventListener("click",(function(){t.setLoading(!t.loading)}))}))},function(e,t,n){(function(t){var n=/^\s+|\s+$/g,r=/^[-+]0x[0-9a-f]+$/i,o=/^0b[01]+$/i,i=/^0o[0-7]+$/i,a=parseInt,c="object"==typeof t&&t&&t.Object===Object&&t,u="object"==typeof self&&self&&self.Object===Object&&self,s=c||u||Function("return this")(),f=Object.prototype.toString,l=Math.max,d=Math.min,p=function(){return s.Date.now()};function v(e,t,n){var r,o,i,a,c,u,s=0,f=!1,v=!1,m=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function w(t){var n=r,i=o;return r=o=void 0,s=t,a=e.apply(i,n)}function b(e){return s=e,c=setTimeout(E,t),f?w(e):a}function g(e){var n=e-u;return void 0===u||n>=t||n<0||v&&e-s>=i}function E(){var e=p();if(g(e))return x(e);c=setTimeout(E,function(e){var n=t-(e-u);return v?d(n,i-(e-s)):n}(e))}function x(e){return c=void 0,m&&r?w(e):(r=o=void 0,a)}function S(){var e=p(),n=g(e);if(r=arguments,o=this,u=e,n){if(void 0===c)return b(u);if(v)return c=setTimeout(E,t),w(u)}return void 0===c&&(c=setTimeout(E,t)),a}return t=y(t)||0,h(n)&&(f=!!n.leading,i=(v="maxWait"in n)?l(y(n.maxWait)||0,t):i,m="trailing"in n?!!n.trailing:m),S.cancel=function(){void 0!==c&&clearTimeout(c),s=0,r=u=o=c=void 0},S.flush=function(){return void 0===c?a:x(p())},S}function h(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function y(e){if("number"==typeof e)return e;if(function(e){return"symbol"==typeof e||function(e){return!!e&&"object"==typeof e}(e)&&"[object Symbol]"==f.call(e)}(e))return NaN;if(h(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=h(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(n,"");var c=o.test(e);return c||i.test(e)?a(e.slice(2),c?2:8):r.test(e)?NaN:+e}e.exports=function(e,t,n){var r=!0,o=!0;if("function"!=typeof e)throw new TypeError("Expected a function");return h(n)&&(r="leading"in n?!!n.leading:r,o="trailing"in n?!!n.trailing:o),v(e,t,{leading:r,maxWait:t,trailing:o})}}).call(this,n(0))},function(e,t,n){"use strict";n.r(t);n(1),n(2),n(3),n(4);function r(e,t){if(t.length<e)throw new TypeError(e+" argument"+e>1?"s":" required, but only "+t.length+" present")}function o(e){r(1,arguments);var t=Object.prototype.toString.call(e);return e instanceof Date||"object"==typeof e&&"[object Date]"===t?new Date(e.getTime()):"number"==typeof e||"[object Number]"===t?new Date(e):("string"!=typeof e&&"[object String]"!==t||"undefined"==typeof console||(console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"),console.warn((new Error).stack)),new Date(NaN))}function i(e){r(1,arguments);var t=o(e);return t.setHours(23,59,59,999),t}function a(){return new Promise((function(e){try{new Intl.DateTimeFormat("en",{timeZone:"Asia/Taipei"}).format(),e()}catch(t){n.e(1).then(function(t){n(19),e()}.bind(null,n)).catch(n.oe)}}))}function c(){return new Promise((function(e){"undefined"==typeof Intl?Promise.all([n.e(2),n.e(3)]).then(function(t){n(17),n(18),e()}.bind(null,n)).catch(n.oe):e()})).then(a)}var u=window.beyond.DateTimeRanger,s=function(e){return parseInt(+e/1e3,10)};c().then((function(){document.querySelectorAll("[data-date-time-ranger]").forEach((function(e){return new u(e,{startAt:s(new Date),endAt:s(i(new Date))})}))}));var f=window.beyond.Datepicker;c().then((function(){var e,t=(e=new Date,parseInt(+e/1e3,10));Array.from(document.querySelectorAll("[data-datepicker]")).forEach((function(e){return new f(e,t)}))}));n(5),n(6);var l=window.beyond,d=l.Codebox;l.bind(),document.querySelectorAll("[data-codebox]").forEach((function(e){return new d(e)}));var p=document.getElementById("width-pad"),v=n(7),h=document.querySelectorAll("[data-table-resolution]"),y=function(){p&&(p.innerText="目前視窗寬度: "+window.innerWidth+"px");var e,t=(e=window.innerWidth)>=1200?5:e>=992?4:e>=768?3:e>=576?2:1;h.forEach((function(e){!function(e,t){e.querySelectorAll("tr").forEach((function(e,n){var r=0===n?"th":"td";e.querySelectorAll(r).forEach((function(e,n){n===t?e.classList.add("active"):e.classList.remove("active")}))}))}(e,t)}))};y(),window.addEventListener("resize",v(y,100))}]);
//# sourceMappingURL=web.js.map