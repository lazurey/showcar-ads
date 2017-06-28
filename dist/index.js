function isObject$1(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}function getRawTag$1(t){var e=hasOwnProperty.call(t,symToStringTag$1),n=t[symToStringTag$1];try{t[symToStringTag$1]=void 0;var o=!0}catch(t){}var i=nativeObjectToString.call(t);return o&&(e?t[symToStringTag$1]=n:delete t[symToStringTag$1]),i}function objectToString$1(t){return nativeObjectToString$1.call(t)}function baseGetTag$1(t){return null==t?void 0===t?undefinedTag:nullTag:symToStringTag&&symToStringTag in Object(t)?getRawTag(t):objectToString(t)}function isObjectLike$1(t){return null!=t&&"object"==typeof t}function isSymbol$1(t){return"symbol"==typeof t||isObjectLike(t)&&baseGetTag(t)==symbolTag}function toNumber$1(t){if("number"==typeof t)return t;if(isSymbol(t))return NAN;if(isObject$2(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=isObject$2(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(reTrim,"");var n=reIsBinary.test(t);return n||reIsOctal.test(t)?freeParseInt(t.slice(2),n?2:8):reIsBadHex.test(t)?NAN:+t}function debounce(t,e,n){function o(e){var n=f,o=g;return f=g=void 0,v=e,p=t.apply(o,n)}function i(t){return v=t,m=setTimeout(s,e),w?o(t):p}function r(t){var n=t-b,o=t-v,i=e-n;return y?nativeMin(i,h-o):i}function a(t){var n=t-b,o=t-v;return void 0===b||n>=e||n<0||y&&o>=h}function s(){var t=now();if(a(t))return c(t);m=setTimeout(s,r(t))}function c(t){return m=void 0,x&&f?o(t):(f=g=void 0,p)}function d(){void 0!==m&&clearTimeout(m),v=0,f=b=g=m=void 0}function l(){return void 0===m?p:c(now())}function u(){var t=now(),n=a(t);if(f=arguments,g=this,b=t,n){if(void 0===m)return i(b);if(y)return m=setTimeout(s,e),o(b)}return void 0===m&&(m=setTimeout(s,e)),p}var f,g,h,p,m,b,v=0,w=!1,y=!1,x=!0;if("function"!=typeof t)throw new TypeError(FUNC_ERROR_TEXT);return e=toNumber(e)||0,isObject(n)&&(w=!!n.leading,y="maxWait"in n,h=y?nativeMax(toNumber(n.maxWait)||0,e):h,x="trailing"in n?!!n.trailing:x),u.cancel=d,u.flush=l,u}function head(t){return t&&t.length?t[0]:void 0}function last(t){var e=null==t?0:t.length;return e?t[e-1]:void 0}var waitUntilAdsCanBeLoaded=function(){return new Promise(function(t,e){var n=window.location,o=document.cookie,i=n.href.indexOf("ads-off=true")>=0,r=o.indexOf("CustomerType=D")>=0,a=o.indexOf("testrun=true")>=0,s="www.autoscout24.de"==n.host&&n.href.indexOf("/angebote/")>=0;if(i||r&&!s||a)return void e();!function(){var t=n.hostname,e=/\.(nl|it)$/.test(t)||n.hash.indexOf("cookie-consent-needed")>=0,i=o.indexOf("cookieConsent=1;")>=0;return e&&!i}()?t():window.addEventListener("cookie-consent-given",t)})},uuid=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=16*Math.random()|0;return("x"==t?e:3&e|8).toString(16)})},getAttribute=function(t,e,n){return t&&t.getAttribute&&t.getAttribute(e)||n},hasAttribute=function(t,e){return t&&t.hasAttribute(e)},setAttribute=function(t,e,n){return t&&t.setAttribute(e,n)},removeAttribute=function(t,e){return t&&t.removeAttribute(e)},loadScript=function(t){var e=document.createElement("script"),n=document.getElementsByTagName("script")[0];e.src=t,n.parentNode.insertBefore(e,n)},ready=function(){return new Promise(function(t){if("loading"!==document.readyState)return t();document.addEventListener("DOMContentLoaded",t)})},isElementInViewport=function(t,e){if(void 0===e&&(e=0),!t||!document.body.contains(t))return!1;var n=t.getBoundingClientRect(),o=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight,i=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;return n.bottom>0-e&&n.top<o+e&&n.right>0-e&&n.left<i+e},addCss=function(t){var e=document.createElement("style");e.innerHTML=t,document.querySelector("head").appendChild(e)},isObject_1=isObject$1,commonjsGlobal="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},freeGlobal$1="object"==typeof commonjsGlobal&&commonjsGlobal&&commonjsGlobal.Object===Object&&commonjsGlobal,_freeGlobal=freeGlobal$1,freeGlobal=_freeGlobal,freeSelf="object"==typeof self&&self&&self.Object===Object&&self,root$1=freeGlobal||freeSelf||Function("return this")(),_root=root$1,root=_root,now$1=function(){return root.Date.now()},now_1=now$1,root$2=_root,Symbol$1=root$2.Symbol,_Symbol=Symbol$1,Symbol$2=_Symbol,objectProto=Object.prototype,hasOwnProperty=objectProto.hasOwnProperty,nativeObjectToString=objectProto.toString,symToStringTag$1=Symbol$2?Symbol$2.toStringTag:void 0,_getRawTag=getRawTag$1,objectProto$1=Object.prototype,nativeObjectToString$1=objectProto$1.toString,_objectToString=objectToString$1,Symbol=_Symbol,getRawTag=_getRawTag,objectToString=_objectToString,nullTag="[object Null]",undefinedTag="[object Undefined]",symToStringTag=Symbol?Symbol.toStringTag:void 0,_baseGetTag=baseGetTag$1,isObjectLike_1=isObjectLike$1,baseGetTag=_baseGetTag,isObjectLike=isObjectLike_1,symbolTag="[object Symbol]",isSymbol_1=isSymbol$1,isObject$2=isObject_1,isSymbol=isSymbol_1,NAN=NaN,reTrim=/^\s+|\s+$/g,reIsBadHex=/^[-+]0x[0-9a-f]+$/i,reIsBinary=/^0b[01]+$/i,reIsOctal=/^0o[0-7]+$/i,freeParseInt=parseInt,toNumber_1=toNumber$1,isObject=isObject_1,now=now_1,toNumber=toNumber_1,FUNC_ERROR_TEXT="Expected a function",nativeMax=Math.max,nativeMin=Math.min,debounce_1$1=debounce,gt$1=function(){return window.googletag||(window.googletag={cmd:[]})},once=function(t){var e,n=1;return function(){return n-- >0&&(e=t()),e}},slotsCache={},destroyAdSlotById=function(t){var e=slotsCache[t].slot;gt$1().cmd.push(function(){return gt$1().destroySlots([e])})},refreshAdSlotById=function(t){var e=slotsCache[t];e&&(e.waitsForRefresh=!0,refreshAdslotsWaitingToBeRefreshed())},register=function(t){var e=t.adunit,n=t.container,o=t.outOfPage,i=t.sizeMapping,r=t.slotElement,a=t.immediate,s=t.collapseEmpty,c=t.openxIgnore,d=t.preload;void 0===d&&(d=0);var l=uuid(),u={refresh:function(){return refreshAdSlotById(l)},destroy:function(){return destroyAdSlotById(l)}};return slotsCache[l]={ret:u,container:n,slotElement:r,preload:d},gt$1().cmd.push(function(){var t=gt$1().pubads(),r=o?gt$1().defineOutOfPageSlot(e,n.id).addService(t):gt$1().defineSlot(e,[],n.id).defineSizeMapping(i).addService(t);s&&r.setCollapseEmptyDiv(!0),gt$1().display(n.id),slotsCache[l].slot=r,slotsCache[l].outOfPage=o,slotsCache[l].immediate=a,slotsCache[l].openxIgnore=c,refreshAdSlotById(l)}),u},refreshOxBids=!1,refreshAdslotsWaitingToBeRefreshed=debounce_1$1(function(){var t=[];Object.keys(slotsCache).forEach(function(e){var n=slotsCache[e];n.waitsForRefresh&&(n.outOfPage||isElementInViewport(n.slotElement,n.preload)||n.immediate)&&(t.push(n),n.waitsForRefresh=!1,n.ret.onrefresh&&n.ret.onrefresh())}),t.length>0&&gt$1().cmd.push(function(){var e=window.OX&&window.OX.dfp_bidder&&window.OX.dfp_bidder.refresh&&window.OX.dfp_bidder.setOxTargeting,n=t.filter(function(t){return!t.openxIgnore}).map(function(t){return t.slot}),o=t.map(function(t){return t.slot});if(e)if(refreshOxBids){var i=once(function(){window.OX.dfp_bidder.setOxTargeting(n),gt$1().pubads().refresh(o,{changeCorrelator:!1})}),r=setTimeout(function(){i()},1500);window.OX.dfp_bidder.refresh(function(){clearTimeout(r),i()},n)}else refreshOxBids=!0,window.OX.dfp_bidder.setOxTargeting(n),gt$1().pubads().refresh(o,{changeCorrelator:!1});else window.console.log("Ad slots to refresh: ",o.map(function(t){return t.getAdUnitPath()})),gt$1().pubads().refresh(o,{changeCorrelator:!1})})},50),findXIdByGptSlot=function(t){var e=Object.keys(slotsCache).filter(function(e){return slotsCache[e].slot===t}).map(function(t){return slotsCache[t]});return e.length?e[0]:null};gt$1().cmd.push(function(){gt$1().pubads().addEventListener("slotRenderEnded",function(t){var e=findXIdByGptSlot(t.slot);t.isEmpty?e&&e.ret.onempty&&e.ret.onempty():e&&e.ret.onload&&e.ret.onload()})}),window.addEventListener("load",refreshAdslotsWaitingToBeRefreshed),window.addEventListener("scroll",refreshAdslotsWaitingToBeRefreshed),window.addEventListener("animationend",refreshAdslotsWaitingToBeRefreshed),window.addEventListener("transitionend",refreshAdslotsWaitingToBeRefreshed);var gptinit=function(){gt$1().cmd.push(function(){var t=gt$1().pubads();t.enableSingleRequest(),t.disableInitialLoad(),gt$1().enableServices()})},head_1=head,first=head_1,last_1=last,parseResolution=function(t){if(/fluid/.test(t))return"fluid";var e=t.replace(/[\s]/g,"").match(/([\d]+)x([\d]+)/i);return e&&e[2]?[0|e[1],0|e[2]]:null},parseAttributes=function(t){return Array.from(t).filter(function(t){return/size-map-/.test(t.nodeName)}).map(function(t){return[parseResolution(t.nodeName),t.value.split(",").map(parseResolution).filter(function(t){return"fluid"===t||Array.isArray(t)&&2===t.length})]})},consolidateSizeMapping=function(t){var e=t.sort(function(t,e){return e[0][0]-t[0][0]||e[0][1]-t[0][1]});return function(e){var n=last_1(e);return n&&0===n[0][0]&&0===n[0][1]||t.push([[0,0],[]]),t}(e)},getEligibleSizesForResolution=function(t,e){var n=first(t.filter(function(t){return"fluid"===t||t[0][0]<=e.x&&t[0][1]<=e.y}));return n&&n[1]||[]},parseAttributesIntoValidMapping=function(t){var e=parseAttributes(t);return consolidateSizeMapping(e)},styles="as24-ad-slot{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}as24-ad-slot>div{display:inline-block}as24-ad-slot{background-image:url(data:image/svg+xml;charset=utf-8,%3Csvg%20id%3D%22Ebene_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22141.7%22%20height%3D%2270.7%22%20viewBox%3D%220%200%20141.7%2070.7%22%3E%3Cstyle%3E%3C%21%5BCDATA%5B%0D%0A%09.st0%7Bfill%3A%23C4C4C4%3B%7D%0D%0A%5D%5D%3E%3C%2Fstyle%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M14.7%2061.4h-.2c-2.8%200-5.2-1.9-5.2-5.2%200-2%203-2%203%200%200%201.4.9%202.2%202.2%202.2h.2c1.3%200%202.3-.7%202.3-2%200-3.2-7.5-3.5-7.5-8.3v-.5c0-2.8%202.8-4.4%205-4.4h.2c2.7%200%205%201.7%205%204.1%200%201.9-3%202-3%20.1%200-.7-.8-1.2-2.1-1.2h-.2c-1.1%200-2%20.6-2%201.6v.4c0%202%207.5%202.9%207.5%208.3.1%202.9-2.2%204.9-5.2%204.9zM27.7%2061.4h-.2c-2.8%200-5.2-2.2-5.2-5.1v-8.1c0-2.9%202.3-5%205.2-5h.2c2.6%200%204.8%201.8%205.1%204.3v.3c0%20.9-.8%201.4-1.5%201.4s-1.3-.4-1.4-1.3c-.2-1.1-1.1-1.8-2.2-1.8h-.2c-1.2%200-2.2.9-2.2%202.1v8.1c0%201.2%201%202.1%202.2%202.1h.2c1.1%200%202-.7%202.2-1.8.1-.9.8-1.3%201.4-1.3.8%200%201.5.5%201.5%201.4v.3c-.3%202.6-2.5%204.4-5.1%204.4zM40.4%2061.4h-.2c-2.8%200-5.2-2.2-5.2-5.1v-8c0-2.9%202.3-5.1%205.2-5.1h.2c2.9%200%205.2%202.2%205.2%205.1v8c-.1%202.9-2.4%205.1-5.2%205.1zm2.2-13.1c0-1.2-1-2.1-2.2-2.1h-.2c-1.2%200-2.2.9-2.2%202.1v8c0%201.2%201%202.1%202.2%202.1h.2c1.2%200%202.2-.9%202.2-2.1v-8zM54%2061.4h-.2c-2.8%200-5.2-2.3-5.2-5.2V44.8c0-1%20.7-1.5%201.5-1.5.7%200%201.5.5%201.5%201.5v11.5c0%201.2%201%202.2%202.2%202.2h.2c1.2%200%202.2-1%202.2-2.2V44.8c0-1%20.7-1.5%201.5-1.5s1.5.5%201.5%201.5v11.5c0%202.8-2.3%205.1-5.2%205.1zM69.8%2046.4h-2.1v13.5c0%201-.7%201.5-1.5%201.5-.7%200-1.5-.5-1.5-1.5V46.4h-2.1c-1%200-1.5-.7-1.5-1.5%200-.7.5-1.5%201.5-1.5h7.1c1%200%201.5.7%201.5%201.5.1.7-.4%201.5-1.4%201.5zM83.7%2061.2H77c-1%200-1.5-.9-1.5-1.8%200-.3.1-.6.2-.9l5.9-9.4c.3-.5.3-.8.3-1.2v-.2c0-.8-.7-1.5-1.5-1.5h-.1c-.9%200-1.5.7-1.5%201.5v.3c0%201-.8%201.5-1.5%201.5s-1.5-.5-1.5-1.5v-.4c0-2.5%202-4.3%204.5-4.3h.1c2.4%200%204.5%201.8%204.5%204.3v.3c0%201-.4%201.8-.9%202.7l-4.7%207.7h4.5c1%200%201.5.7%201.5%201.5-.1.7-.6%201.4-1.6%201.4zM95.5%2057.7h-.6v2.2c0%201-.7%201.5-1.5%201.5s-1.4-.5-1.4-1.5v-2.2h-4.1c-1%200-1.7-.6-1.7-1.6%200-.3.1-.6.2-.8l4.8-11.2c.3-.6.8-.9%201.3-.9.8%200%201.5.6%201.5%201.4%200%20.2%200%20.4-.1.6l-4.3%209.4H92v-1.5c0-1%20.7-1.5%201.5-1.5s1.5.5%201.5%201.5v1.5h.6c1%200%201.5.7%201.5%201.5s-.6%201.6-1.6%201.6zM16.3%2014.6l-1.7%205.5h3.3zM54.7%2024.3h.2c1.2%200%202.2-.9%202.2-2.1v-8c0-1.2-1-2.1-2.2-2.1h-.2c-1.2%200-2.2.9-2.2%202.1v8c0%201.2%201%202.1%202.2%202.1z%22%2F%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M0%200v70.7h123.3c10.1%200%2018.4-8.2%2018.4-18.3V0H0zm49.5%2014.2c0-2.9%202.3-5.1%205.2-5.1h.2c2.9%200%205.2%202.2%205.2%205.1v8c0%202.9-2.3%205.1-5.2%205.1h-.2c-2.8%200-5.2-2.2-5.2-5.1v-8zm-10.4-5h7.1c1%200%201.5.7%201.5%201.5%200%20.7-.5%201.5-1.5%201.5h-2.1v13.5c0%201-.7%201.5-1.5%201.5-.7%200-1.5-.5-1.5-1.5V12.2H39c-1%200-1.5-.8-1.5-1.5.1-.7.6-1.5%201.6-1.5zm-14.3%201.4c0-1%20.7-1.5%201.5-1.5.7%200%201.5.5%201.5%201.5v11.5c0%201.2%201%202.2%202.2%202.2h.2c1.2%200%202.2-1%202.2-2.2V10.6c0-1%20.7-1.5%201.5-1.5.7%200%201.5.5%201.5%201.5v11.5c0%202.8-2.3%205.2-5.2%205.2H30c-2.8%200-5.2-2.3-5.2-5.2V10.6zM9.9%2025.3l4.7-14.9c.4-1.2%201-1.3%201.7-1.3.6%200%201.3.1%201.7%201.3l4.7%2014.9c.1.2.1.3.1.5%200%20.9-.8%201.4-1.5%201.4-.6%200-1.2-.3-1.4-1.1l-1-3.1h-5.1l-1%203.1c-.2.7-.8%201.1-1.4%201.1-.8%200-1.5-.6-1.5-1.4-.1-.2-.1-.3%200-.5zm129.6%2027.2c0%208.7-7.2%2016-16.2%2016H2.2V35.3h137.3v17.2z%22%2F%3E%3C%2Fsvg%3E);background-size:70px 35px;background-position:center center;background-repeat:no-repeat;position:relative}as24-ad-slot[out-of-page],.sc-ads-no-placeholder,.sc-ads-silent-placeholder,as24-ad-slot[loaded]:not([empty]){background-image:none}.sc-ads-silent-placeholder>div{box-shadow:inset 0 0 1px #cdcdcd}.sc-ads-silent-placeholder[loaded]:not([empty])>div{box-shadow:none}as24-ad-slot[loaded][ad-label]:not([empty]):before{content:attr(ad-label);position:absolute;top:-17px;display:inline-block;font-size:0.8125rem}\n",registerElement=function(t){void 0===t&&(t="as24-ad-slot");var e=Object.create(HTMLElement.prototype,{attachedCallback:{value:function(){var t=this,e={x:window.innerWidth,y:window.innerHeight},n=parseAttributesIntoValidMapping(this.attributes),o=getEligibleSizesForResolution(n,e),i=o&&o.length>0;if(setAttribute(this,"size-mapping",JSON.stringify(n)),setAttribute(this,"sizes",JSON.stringify(o)),!i)return setAttribute(this,"empty",""),void this.dispatchEvent(new Event("ad-slot-empty"),{bubbles:!0});var r="ad-"+uuid(),a=getAttribute(this,"ad-unit"),s=hasAttribute(this,"out-of-page"),c=hasAttribute(this,"immediate"),d=hasAttribute(this,"collapse-empty"),l=hasAttribute(this,"openx-ignore"),u=0|getAttribute(this,"preload"),f=this.container=document.createElement("div");if(f.id=r,this.appendChild(f),!d){var g=o.filter(function(t){return"fluid"!==t}).sort(function(t,e){return t[1]-e[1]}),h=g[0][1],p=g[0][0];f.style.minHeight=this.style.minHeight=h+"px",f.style.minWidth=this.style.minWidth=p+"px"}this.adslot=register({adunit:a,outOfPage:s,sizeMapping:n,container:f,slotElement:this,immediate:c,collapseEmpty:d,openxIgnore:l,preload:u}),this.adslot.onempty=function(){setAttribute(t,"empty",""),t.dispatchEvent(new Event("ad-slot-empty"),{bubbles:!0})},this.adslot.onload=function(){if(setAttribute(t,"loaded",""),t.className+=" rnd-"+(1e4*Math.random()|0),t.dispatchEvent(new Event("ad-slot-loaded"),{bubbles:!0}),!d){var e=parseInt(t.style.minHeight,10),n=f.clientHeight,o=parseInt(t.style.minWidth,10),i=f.clientWidth;t.style.minHeight=Math.max(e,n)+"px",t.style.minWidth=Math.max(o,i)+"px"}},this.adslot.onrefresh=function(){removeAttribute(t,"loaded"),removeAttribute(t,"empty")}}},detachedCallback:{value:function(){this.adslot&&(window.console.log("detachedCallback",this.adslot.adunit),this.adslot.destroy())}},refreshAdSlot:{value:function(){this.adslot&&(this.container.innerHTML="",this.adslot.refresh(),window.console.log("refreshAdSlot",this.adslot.adunit))}}}),n=styles.replace(/as24-ad-slot/g,t);addCss(n),document.registerElement(t,{prototype:e})},registerElement$1=function(t){void 0===t&&(t="as24-ad-targeting");var e=window.googletag||(window.googletag={cmd:[]}),n=function(){var n=getTargetingData(t);e.cmd.push(function(){var t=e.pubads();t.getTargetingKeys().forEach(function(e){return t.clearTargeting(e)});for(var o in n){var i=(""+n[o]).split(",");t.setTargeting(o,i)}window.Krux&&(t.setTargeting("ksg",window.Krux.segments),t.setTargeting("kuid",window.Krux.user))})},o=Object.create(HTMLElement.prototype,{attachedCallback:{value:n},detachedCallback:{value:n}});addCss(t+"{display:none}"),document.registerElement(t,{prototype:o})},getTargetingData=function(t){var e=Array.from(document.querySelectorAll(t)||[]),n=e.map(function(t){return JSON.parse(t.innerHTML.trim()||"{}")}),o={};return n.forEach(function(t){return Object.assign(o,t)}),o};waitUntilAdsCanBeLoaded().then(ready).then(function(){gptinit(),registerElement(),registerElement$1(),location.search.indexOf("contentbinder=1")>=0&&loadScript("https://s0.2mdn.net/ads/richmedia/studio/mu/templates/backdrop/resources/content_binder.js")}).then(function(){var t=location.hostname.split(".").pop(),e="de"===t||"at"===t||"it"===t||location.hash.indexOf("ads-use-openx")>=0;if(e||loadScript("https://www.googletagservices.com/tag/js/gpt.js"),e){var n=function(t){return JSON.parse(t).filter(function(t){return Array.isArray(t)&&2===t.length}).map(function(t){return t.join("x")})},o=Array.from(document.querySelectorAll('as24-ad-slot[sizes]:not([sizes="[]"]):not([out-of-page]):not([immediate]):not([openx-ignore])'));window.OX_dfp_ads=o.map(function(t){return[t.getAttribute("ad-unit"),n(t.getAttribute("sizes")),t.children[0].id]}),window.OX_cmds=window.OX_cmds||[],window.OX_cmds.push(function(){var t=window.OX&&window.OX.AdRequest;t&&(window.OX.AdRequest=function(){var e=t.apply(this,arguments),n=getTargetingData("as24-ad-targeting");return n.splz&&this.addVariable("splz",n.splz),n.zip2&&this.addVariable("zipcode",n.zip2),e},window.OX.prototype=t.prototype)}),loadScript(function(t){var e={de:"https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout",at:"https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout-at",it:"https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout-it",nl:"https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout-nl"};return e[t]||e.de}(t));var i,r=function(){clearTimeout(i),loadScript("https://www.googletagservices.com/tag/js/gpt.js")};i=setTimeout(r,3e3),window.OX_dfp_options={callback:r}}}).catch(function(t){console.warn(t)}),window.__temp__test__ads__=1;

//# sourceMappingURL=index.js.map
