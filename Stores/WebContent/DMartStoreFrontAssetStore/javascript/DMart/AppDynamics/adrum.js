;/* Version 20eb25d52848d8f807fb234561b4fac7 v:4.2.4.1, c:4a44d76859b40c51f389181192fabb30a360a83e, b:4885 n:27-4.2.4.next-build */(function(){new function(){if(!window.ADRUM&&!0!==window["adrum-disable"]){var g=window.ADRUM={};window["adrum-start-time"]=window["adrum-start-time"]||(new Date).getTime();(function(a){(function(a){a.Zc=function(){for(var a=[],d=0;d<arguments.length;d++)a[d-0]=arguments[d];for(d=0;d<a.length;d++){var b=a[d];b&&b.setUp()}}})(a.monitor||(a.monitor={}))})(g||(g={}));(function(a){a=a.conf||(a.conf={});a.beaconUrlHttp="http://col.eum-appdynamics.com";a.beaconUrlHttps="https://col.eum-appdynamics.com";a.corsEndpointPath="/eumcollector/beacons/browser/v1";
a.imageEndpointPath="/eumcollector/adrum.gif?";a.appKey=window["adrum-app-key"]||"AD-AAB-AAC-KEV";var d="https:"===document.location.protocol;a.adrumExtUrl=(d?"https://cdn.appdynamics.com":"http://cdn.appdynamics.com")+"/adrum-ext.20eb25d52848d8f807fb234561b4fac7.js";a.adrumXdUrl="https://cdn.appdynamics.com/adrum-xd.20eb25d52848d8f807fb234561b4fac7.html";a.agentVer="4.2.4.1";a.sendImageBeacon="false";if(window["adrum-geo-resolver-url"]){var f=window["adrum-geo-resolver-url"],c=f.indexOf("://");-1!=
c&&(f=f.substring(c+3));f=(d?"https://":"http://")+f}else f=d?"":"";a.geoResolverUrl=f;a.useStrictDomainCookies=!0===window["adrum-use-strict-domain-cookies"];a.userConf=window["adrum-config"];a.$d=10})(g||(g={}));(function(a){(function(d){function f(a){return"undefined"!==typeof a&&null!==a}function c(a){return"[object Array]"===Object.prototype.toString.apply(a)}function b(a){return"object"==typeof a&&!c(a)&&null!==a}function e(a){return"string"==
typeof a}function h(a,p){for(var e in p){var d=p[e];if(p.hasOwnProperty(e)&&f(d)){var g=a[e];b(d)&&b(g)?h(g,d):a[e]=c(g)&&c(d)?g.concat(d):d}}return a}function p(a){return e(a)?a.replace(/^\s*/,"").replace(/\s*$/,""):a}d.isDefined=f;d.isArray=c;d.isObject=b;d.isFunction=function(a){return"function"==typeof a||!1};d.isString=e;d.isNumber=function(a){return"number"==typeof a};d.Ta=function(a){setTimeout(a,0)};d.addEventListener=function(h,b,p){function e(){try{return p.apply(this,Array.prototype.slice.call(arguments))}catch(d){a.exception(d,
"M1",b,h,d)}}a.isDebug&&a.log("M0",b,h);h.addEventListener?h.addEventListener(b,e,!1):h.attachEvent&&h.attachEvent("on"+b,e)};d.loadScriptAsync=function(h){var b=document.createElement("script");b.async=!0;b.src=h;var p=document.getElementsByTagName("script")[0];p?(p.parentNode.insertBefore(b,p),a.log("M2",h)):a.log("M3",h)};d.mergeJSON=h;d.od=function(a){var h=[];a&&(d.isObject(a)?h=[a]:d.isArray(a)&&(h=a));return h};d.generateGUID="undefined"!==typeof window.crypto&&"undefined"!==typeof window.crypto.getRandomValues?
function(){function a(h){for(h=h.toString(16);4>h.length;)h="0"+h;return h}var h=new Uint16Array(8);window.crypto.getRandomValues(h);return a(h[0])+a(h[1])+"_"+a(h[2])+"_"+a(h[3])+"_"+a(h[4])+"_"+a(h[5])+a(h[6])+a(h[7])}:function(){return"xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx".replace(/[xy]/g,function(a){var h=16*Math.random()|0;return("x"==a?h:h&3|8).toString(16)})};d.fd=function(a){return a?(a=a.stack)&&"string"===typeof a?a:null:null};d.trim=p;d.wg=function(a){var h={},b,e;if(!a)return h;var d=
a.split("\n");for(e=0;e<d.length;e++){var c=d[e];b=c.indexOf(":");a=p(c.substr(0,b)).toLowerCase();b=p(c.substr(b+1));a&&(h[a]=h[a]?h[a]+(", "+b):b)}return h};d.tryPeriodically=function(a,h,b,p){function e(){if(h())b&&b();else{var c=a(++d);0<c?setTimeout(e,c):p&&p()}}var d=0;e()};d.Qb=function(a){return a.charAt(0).toUpperCase()+a.slice(1)};d.Ic=function(a){for(var h=[],b=1;b<arguments.length;b++)h[b-1]=arguments[b];return function(){for(var b=[],p=0;p<arguments.length;p++)b[p-0]=arguments[p];return a.apply(this,
h.concat(b))}};d.now=Date&&Date.now||function(){return(new Date).getTime()}})(a.utils||(a.utils={}))})(g||(g={}));(function(a){function d(h,b,e,d){h=a.conf.beaconUrlHttps+"/eumcollector/error.gif?version=1&appKey="+e+"&msg="+encodeURIComponent(h.substring(0,500));d&&(h+="&stack=",h+=encodeURIComponent(d.substring(0,1500-h.length)));return h}function f(h,b){2<=e||((new Image).src=d(h,0,a.conf.appKey,b),e++)}function c(a){return 0<=a.location.search.indexOf("ADRUM_debug=true")||0<=a.cookie.search(/(^|;)\s*ADRUM_debug=true/)}
a.iDR=c;a.isDebug=c(document);var b=[];a.logMessages=b;a.log=function(h){for(var p=1;p<arguments.length;p++);a.isDebug&&b.push(Array.prototype.slice.call(arguments).join(" | "))};a.error=function(h){for(var b=1;b<arguments.length;b++);b=Array.prototype.slice.call(arguments).join(" | ");a.log(b);f(b,null)};a.exception=function(){for(var h=[],b=0;b<arguments.length;b++)h[b-0]=arguments[b];1>arguments.length||(h=Array.prototype.slice.call(arguments),b=a.utils.fd(h[0]),h=h.slice(1).join(" | "),a.log(h),
f(h,b))};a.assert=function(h,b){h||a.error("Assert fail: "+b)};a.dumpLog=a.isDebug?function(){for(var a="",e=0;e<b.length;e++)a+=b[e].replace(RegExp("<br/>","g"),"\n\t")+"\n";return a}:function(){};a.cIEBU=d;var e=0;a.log("M4")})(g||(g={}));(function(a){var d=function(){function a(b){this.max=b;this.za=0}a.prototype.Mf=function(){this.la()||this.za++};a.prototype.la=function(){return this.za>=this.max};a.prototype.reset=function(){this.za=0};return a}(),f=function(){function c(){this.ha=[];this.Va=
new d(c.oe);this.Ka=new d(c.ce)}c.prototype.submit=function(b){this.push(b)&&a.initEXTDone&&this.processQ()};c.prototype.processQ=function(){for(var b=this.ef(),e=0;e<b.length;e++){var h=b[e];"function"===typeof a.commands[h[0]]?(a.isDebug&&a.log("M5",h[0],h.slice(1).join(", ")),a.commands[h[0]].apply(a,h.slice(1))):a.error("M6",h[0])}};c.prototype.ag=function(a){return"reportXhr"===a||"reportPageError"===a};c.prototype.push=function(b){var e=b[0],h=this.ag(e),p=h?this.Va:this.Ka;if(p.la())return a.log("M7",
h?"spontaneous":"non spontaneous",e),!1;this.ha.push(b);p.Mf();return!0};c.prototype.ef=function(){var a=this.ha;this.reset();return a};c.prototype.size=function(){return this.ha.length};c.prototype.reset=function(){this.ha=[];this.Va.reset();this.Ka.reset()};c.prototype.isSpontaneousQueueDead=function(){return this.Va.la()};c.prototype.isNonSpontaneousQueueDead=function(){return this.Ka.la()};c.oe=100;c.ce=100;return c}();a.Cd=f})(g||(g={}));(function(a){a.q=new a.Cd;a.command=function(d){for(var f=
1;f<arguments.length;f++);a.isDebug&&a.log("M8",d,Array.prototype.slice.call(arguments).slice(1).join(", "));a.q.submit(Array.prototype.slice.call(arguments))}})(g||(g={}));(function(a){(function(a){var f=function(){function a(){this.status={}}a.prototype.setUp=function(){};a.prototype.set=function(a,e){this.status[a]=e};return a}();a.mb=f})(a.monitor||(a.monitor={}))})(g||(g={}));(function(a){(function(d){window.ADRUM.aop=d;d.support=function(a){return!a||"apply"in a};d.around=function(f,c,b,e){a.assert(d.support(f),
"aop.around called on a function which does not support interception");f=f||function(){};return function(){a.isDebug&&a.log("M9",e,Array.prototype.slice.call(arguments).join(", "));var h=Array.prototype.slice.call(arguments),p;try{c&&(p=c.apply(this,h))}catch(d){a.exception(d,"M10",e,d)}a.assert(!p||"[object Array]"===Object.prototype.toString.call(p));var k=void 0;try{k=f.apply(this,p||h)}finally{try{b&&b.apply(this,h)}catch(g){a.exception(g,"M11",e,g)}}return k}};d.before=function(a,c){return d.around(a,
c)};d.after=function(a,c){return d.around(a,null,c)}})(a.aop||(a.aop={}))})(g||(g={}));(function(a){a=a.EventType||(a.EventType={});a[a.BASE_PAGE=0]="BASE_PAGE";a[a.IFRAME=1]="IFRAME";a[a.XHR=2]="XHR";a[a.VIRTUAL_PAGE=3]="VIRTUAL_PAGE";a[a.PAGE_ERROR=4]="PAGE_ERROR";a[a.ABSTRACT=100]="ABSTRACT";a[a.ADRUM_XHR=101]="ADRUM_XHR";a[a.NG_VIRTUAL_PAGE=102]="NG_VIRTUAL_PAGE"})(g||(g={}));(function(a){a=a.events||(a.events={});a.l={};a.l[100]={guid:"string",url:"string",parentGUID:"string",parentUrl:"string",
parentType:"number",timestamp:"number"};a.l[3]={resTiming:"object"};a.l[102]={digestCount:"number"};a.l[2]={method:"string",parentPhase:"string",parentPhaseId:"number",error:"object"};a.l[101]={xhr:"object"};a.l[4]={msg:"string",line:"number",stack:"string"}})(g||(g={}));(function(a){var d=function(){function a(){this.w={}}a.prototype.mark=function(a,e){f.mark.apply(this,arguments)};a.prototype.getTiming=function(a){return(a=this.getEntryByName(a))&&a.startTime};a.prototype.measure=function(a,e,h){f.measure.apply(this,
arguments)};a.prototype.getEntryByName=function(a){return f.getEntryByName.call(this,a)};a.ia=function(a){return f.ia(a)};return a}();a.PerformanceTracker=d;var f;(function(d){d.mark;d.measure;d.getEntryByName;d.ia;var b=window.performance||window.mozPerformance||window.msPerformance||window.webkitPerformance,e=b&&b.timing&&b.timing.navigationStart?b.timing.navigationStart:window["adrum-start-time"],h=a.utils.now;d.mark=function(b,e){this.w[b]={name:b,entryType:"mark",startTime:a.utils.isDefined(e)?
e:h(),duration:0}};d.measure=function(b,d,c){this.w.hasOwnProperty(d)&&this.w.hasOwnProperty(c)?this.w[b]={name:b,entryType:"measure",startTime:d?this.w[d].startTime:e,duration:(c?this.w[c].startTime:h())-(d?this.w[d].startTime:e)}:a.error("M12"+(this.w.hasOwnProperty(d)?c:d)+" does not exist. ")};d.getEntryByName=function(a){return this.w[a]||null};d.ia=function(a){return a+e}})(f||(f={}))})(g||(g={}));(function(a){(function(d){function f(b,h){b=b||{};for(var d in b)h[d]=function(){var h=d,c=b[d];
return function(b){var e="_"+h,d=this[e];if(a.utils.isDefined(b))if(typeof b===c)this[e]=b;else throw TypeError("wrong type of "+h+" value, "+typeof b+" passed in but should be a "+c+".");return d}}()}function c(a){var h={},b;for(b in a){var d=a[b];h[d.start]=!0;h[d.end]=!0}return h}var b=function(){function b(h){this.perf=new a.PerformanceTracker;this.timestamp(a.utils.now());this.guid(a.utils.generateGUID());this.url(document.URL);this.Yc(h)}b.prototype.type=function(){return 100};b.prototype.Yc=
function(b){if(a.utils.isObject(b))for(var d in b){var e=this[d]||this["mark"+a.utils.Qb(d)];e&&a.utils.isFunction(e)&&e.call(this,b[d])}};b.Mb=function(a,b,d){return{guid:function(){return a},url:function(){return b},type:function(){return d}}};b.prototype.Cf=function(){return b.Mb(this.parentGUID(),this.parentUrl(),this.parentType())};b.prototype.parent=function(b){var d=this.Cf();a.utils.isDefined(b)&&(this.parentGUID(b.guid()),this.parentUrl(b.url()),this.parentType(b.type()));return d};return b}();
d.EventTracker=b;d.W=f;d.Nb=function(b,h){b=b||{};var d=c(b),l;for(l in d)d=a.utils.Qb(l),h["mark"+d]=a.utils.Ic(function(a,b){this.perf.mark(a,b)},l),h["get"+d]=a.utils.Ic(function(a){return this.perf.getTiming(a)},l)};f(d.l[100],b.prototype)})(a.events||(a.events={}))})(g||(g={}));var s=this.He||function(a,d){function f(){this.constructor=a}for(var c in d)d.hasOwnProperty(c)&&(a[c]=d[c]);f.prototype=d.prototype;a.prototype=new f};(function(a){(function(a){var f=function(a){function b(b){a.call(this,
b)}s(b,a);b.prototype.type=function(){return 4};return b}(a.EventTracker);a.Error=f;a.W(a.l[4],f.prototype)})(a.events||(a.events={}))})(g||(g={}));(function(a){(function(d){var f=function(d){function b(){d.apply(this,arguments)}s(b,d);b.prototype.setUp=function(){d.prototype.setUp.call(this);a.listenForErrors=this.Ac;this.Ac()};b.prototype.Ac=function(){if(a.aop.support(window.onerror)){var d=this;window.onerror=a.aop.around(window.onerror,function(h,p,c,f,g){b.Ia||(b.errorsSent>=a.conf.$d?a.log("M13"):
(f=a.utils.fd(g),a.command("reportPageError",new a.events.Error(a.utils.mergeJSON({msg:h,url:p,line:c,stack:f},d.status))),b.errorsSent++,b.Ia=!0))},function(){b.Ia=!1},"onerror");a.log("M14")}else a.log("M15")};b.Ia=!1;b.errorsSent=0;return b}(d.mb);d.ErrorMonitor=f;d.Zb=new d.ErrorMonitor})(a.monitor||(a.monitor={}))})(g||(g={}));(function(a){var d=function(){function d(){this.ta=[];this.oa(d.wa,0)}d.prototype.og=function(a){this.oa(d.Gb,a)};d.prototype.qg=function(a){this.oa(d.Ob,a)};d.prototype.pg=
function(a){this.oa(d.Ib,a)};d.prototype.oa=function(a,b){this.ta.push({mg:(new Date).getTime(),lg:b,Jc:a});this.af=a};d.prototype.getPhaseName=function(){return this.af};d.prototype.getPhaseID=function(a){for(var b=0;b<d.Lb.length;b++)if(d.Lb[b]===a)return b;return null};d.prototype.getPhaseCallbackTime=function(a){for(var b=this.ta,d=0;d<b.length;d++)if(b[d].Jc===a)return b[d].mg;return null};d.prototype.findPhaseAtNominalTime=function(c){a.assert(0<=c);for(var b=this.ta,e=b.length-1;0<=e;e--)if(c>=
b[e].lg)return b[e].Jc;a.error("M16",c,a.utils.ff(b));return d.wa};d.wa="AFTER_FIRST_BYTE";d.Gb="AFTER_DOM_INTERACTIVE";d.Ob="AT_ONLOAD";d.Ib="AFTER_ONLOAD";d.Lb=[d.wa,d.Gb,d.Ob,d.Ib];return d}();a.oh=d;a.lifecycle=new d;a.lifecycle=a.lifecycle})(g||(g={}));(function(a){(function(a){var f=function(a){function b(){a.apply(this,arguments)}s(b,a);b.prototype.type=function(){return 0};return b}(a.EventTracker);a.PageView=f})(a.events||(a.events={}))})(g||(g={}));(function(a){(function(d){var f=function(){function c(){}
c.prototype.setUp=function(){c.Kg();c.Jg()};c.Jg=function(){a.utils.addEventListener(window,"load",c.pa);a.utils.addEventListener(window,"load",c.tg)};c.tg=function(b){a.lifecycle.qg(b&&b.timeStamp);a.utils.Ta(function(){var b=(new Date).getTime();a.lifecycle.pg(b);a.command("mark","onload",b);d.yb.perf&&(d.perfMonitor.Xe(),d.perfMonitor.Ye());a.command("reportOnload",new a.events.PageView);a.utils.loadScriptAsync(a.conf.adrumExtUrl)});a.log("M17")};c.Kg=function(){if(document.addEventListener)document.addEventListener("DOMContentLoaded",
c.ca,!1);else{document.attachEvent("onreadystatechange",c.ca);var b=null;try{b=null===window.frameElement?document.documentElement:null}catch(d){}null!=b&&b.doScroll&&function p(){if(!c.isReady){try{b.doScroll("left")}catch(a){setTimeout(p,10);return}c.pa()}}()}a.log("M18")};c.pa=function(b){c.Dc||(a.lifecycle.og(b&&b.timeStamp),a.command("mark","onready",(new Date).getTime()),c.Dc=!0)};c.ca=function(a){document.addEventListener?(document.removeEventListener("DOMContentLoaded",c.ca,!1),c.pa(a)):"complete"===
document.readyState&&(document.detachEvent("onreadystatechange",c.ca),c.pa(a))};c.isReady=!1;c.Dc=!1;return c}();d.Ed=f;d.df=new d.Ed})(a.monitor||(a.monitor={}))})(g||(g={}));(function(a){(function(d){var f=function(){function d(){this.navTiming=this.resTiming=null}d.prototype.setUp=function(){d.perf=window.performance||window.mozPerformance||window.msPerformance||window.webkitPerformance};d.prototype.Xe=function(){var b=d.perf;if(b=b&&b.timing)if(b.navigationStart&&b.navigationStart<=b.loadEventEnd){var e=
{},h;for(h in b){var p=b[h];"number"===typeof p&&(e[h]=p)}this.navTiming=e}else a.log("M20");else a.log("M19")};d.prototype.Ye=function(){this.resTiming=this.hc()};d.prototype.hc=function(){var b=d.perf,e=[];b&&b.getEntriesByType&&(b=b.getEntriesByType("resource"))&&b.length&&0<b.length&&b.unshift&&(e=b);0==e.length&&a.log("M21");return e};d.perf=null;return d}();d.yb=f;d.perfMonitor=new d.yb})(a.monitor||(a.monitor={}))})(g||(g={}));(function(a){a=a.events||(a.events={});a=a.b||(a.b={});a.navigationStart=
"navigationStart";a.domainLookupStart="domainLookupStart";a.domainLookupEnd="domainLookupEnd";a.connectStart="connectStart";a.secureConnectionStart="secureConnectionStart";a.connectEnd="connectEnd";a.requestStart="requestStart";a.responseStart="responseStart";a.responseEnd="responseEnd";a.domContentLoadedEventStart="domContentLoadedEventStart";a.loadEventEnd="loadEventEnd";a.Wc="sendTime";a.ac="firstByteTime";a.Sc="respAvailTime";a.Tc="respProcTime";a.cb="viewChangeStart";a.kd="viewChangeEnd";a.eb=
"viewDOMLoaded";a.qd="xhrRequestsCompleted";a.Vh="viewFragmentsLoaded";a.Wh="viewResourcesLoaded";a.fb="virtualPageStart";a.dh="virtualPageEnd"})(g||(g={}));(function(a){a=a.events||(a.events={});a.B={};a.B[0]={lf:{start:a.b.navigationStart,end:a.b.loadEventEnd,name:"PLT"},qf:{start:a.b.navigationStart,end:a.b.responseStart,name:"FBT"},Rh:{start:a.b.navigationStart,end:a.b.requestStart,name:"SCT"},Sh:{start:a.b.secureConnectionStart,end:a.b.connectEnd,name:"SHT"},yh:{start:a.b.domainLookupStart,end:a.b.domainLookupEnd,
name:"DLT"},Uh:{start:a.b.connectStart,end:a.b.connectEnd,name:"TCP"},Ph:{start:a.b.requestStart,end:a.b.responseStart,name:"RAT"},Ah:{start:a.b.responseStart,end:a.b.loadEventEnd,name:"FET"},Ch:{start:a.b.responseStart,end:a.b.domContentLoadedEventStart,name:"DRT"},sh:{start:a.b.responseStart,end:a.b.responseEnd,name:"DDT"},wh:{start:a.b.responseEnd,end:a.b.domContentLoadedEventStart,name:"DPT"},Oh:{start:a.b.domContentLoadedEventStart,end:a.b.loadEventEnd,name:"PRT"},xh:{start:a.b.navigationStart,
end:a.b.domContentLoadedEventStart,name:"DOM"}};a.B[2]={qf:{start:a.b.Wc,end:a.b.ac,name:"FBT"},Bh:{start:a.b.ac,end:a.b.Sc,name:"DDT"},rh:{start:a.b.Sc,end:a.b.Tc,name:"DPT"},lf:{start:a.b.Wc,end:a.b.Tc,name:"PLT"}};a.B[3]={Ih:{start:a.b.fb,end:a.b.dh,name:"PLT"},uh:{start:a.b.cb,end:a.b.kd,name:"DDT"},Fh:{start:a.b.cb,end:a.b.eb,name:"DRT"},jh:{start:a.b.kd,end:a.b.eb,name:"DPT"},kh:{start:a.b.cb,end:a.b.eb,name:"DOM"},Nh:{start:"viewChangeEnd",end:"xhrRequestsCompleted",name:null},Gh:{start:"viewChangeEnd",
end:"viewPartialsLoaded",name:null},Eh:{start:"viewPartialsLoaded",end:"viewFragmentsLoaded",name:null},Hh:{start:"viewPartialsLoaded",end:"viewResourcesLoaded",name:null}};a.B[102]=a.B[3]})(g||(g={}));(function(a){(function(a){var f=function(a){function b(b){a.call(this,b)}s(b,a);b.prototype.type=function(){return 2};return b}(a.EventTracker);a.Ajax=f;a.W(a.l[2],f.prototype);a.Nb(a.B[2],f.prototype)})(a.events||(a.events={}))})(g||(g={}));(function(a){(function(a){var f=function(a){function b(b){a.call(this,
b)}s(b,a);b.prototype.type=function(){return 2};return b}(a.Ajax);a.AdrumAjax=f;a.W(a.l[101],f.prototype)})(a.events||(a.events={}))})(g||(g={}));(function(a){(function(d){var f=function(d){function b(){d.call(this);this.conf=null;this.Wa=!1;!0===window["adrum-xhr-disable"]?a.log("M22"):window.XMLHttpRequest?(this.conf={exclude:[{urls:[{pattern:a.conf.beaconUrlHttp+a.conf.corsEndpointPath},{pattern:a.conf.beaconUrlHttps+a.conf.corsEndpointPath}]}],include:[]},b.Mc(this.conf,a.conf.userConf&&a.conf.userConf.xhr),
(this.d=window.XMLHttpRequest.prototype)?"open"in this.d&&"send"in this.d?(this.Wa=a.aop.support(this.d.open)&&a.aop.support(this.d.send))||a.log("M26"):a.log("M25"):a.log("M24")):a.log("M23")}s(b,d);b.Mc=function(d,h){h&&(h.include=a.utils.od(h.include),h.exclude=a.utils.od(h.exclude),a.utils.mergeJSON(d,h));var p=d.exclude;if(p)for(var c=0;c<p.length;c++){var k=p[c].urls;k&&0<k.length&&(p[c].urls=b.Ub(k))}if(p=d.include)for(c=0;c<p.length;c++)(k=p[c].urls)&&0<k.length&&(p[c].urls=b.Ub(k))};b.Ub=
function(b){for(var h=[],d=0;d<b.length;d++){var c=b[d].pattern;if("string"===typeof c)try{h.push(new RegExp(c))}catch(k){a.exception(k,"Parse regex pattern failed.")}else a.error("xhr filter pattern should be a string")}return h};b.$c=function(a,h,d){var c=d&&d.include;d=d&&d.exclude;return c&&0<c.length&&!b.xc(h,a,c)||d&&0<d.length&&b.xc(h,a,d)};b.prototype.setUp=function(){if(this.Wa){a.log("M27");a.xhrConstructor=window.XMLHttpRequest;a.xhrOpen=this.xhrOpen=this.d.open;a.xhrSend=this.xhrSend=
this.d.send;var d=this;this.d.open=a.aop.around(this.d.open,function(){var h=1<=arguments.length?String(arguments[0]):"",p=2<=arguments.length?String(arguments[1]):"";b.$c(p,h,d.conf)||(this._adrumAjaxT=new a.events.AdrumAjax(a.utils.mergeJSON({method:h,url:p,xhr:this},d.status)))},null,"XHR.open");this.d.send=a.aop.around(this.d.send,function(){var h=this,p=h._adrumAjaxT;if(p){var c=a.utils.now(),k=p.getSendTime();a.assert(null===k,"M28");p.timestamp(c);p.markSendTime(k||c);p.parentPhase(a.lifecycle.getPhaseName());
b.Zf(p.url())?h.setRequestHeader("ADRUM","isAjax:true"):a.log("M29",document.location.href,p.url());var f=0,g=function(){if(4==h.readyState)a.log("M30"),d.ua(h);else{var p=null;try{p=h.onreadystatechange}catch(c){a.log("M31",c);d.ua(h);return}f++;p?a.aop.support(p)?(h.onreadystatechange=d.Vb(p,h,"XHR.onReadyStateChange"),a.log("M32",f)):(a.log("M33"),d.ua(h)):f<b.Fe?a.utils.Ta(g):(a.log("M34"),d.ua(h))}};g()}},null,"XHR.send");"addEventListener"in this.d&&"removeEventListener"in this.d&&a.aop.support(this.d.addEventListener)&&
a.aop.support(this.d.removeEventListener)?(this.d.addEventListener=a.aop.around(this.d.addEventListener,this.$e(),null,"XHR.addEventListener"),this.d.removeEventListener=a.aop.around(this.d.removeEventListener,function(b,d){if(this._adrumAjaxT){var e=Array.prototype.slice.call(arguments);d.__adrumInterceptor?(e[1]=d.__adrumInterceptor,a.log("M35")):a.log("M36");return e}},null,"XHR.removeEventListener")):a.log("M37");a.log("M38")}};b.jg=function(a,b){for(var d=!1,c=0;c<b.length;c++){var k=b[c];if(k&&
k.test(a)){d=!0;break}}return d};b.xc=function(a,d,p){var c=!1;if(d&&p)for(var k=0;k<p.length;k++){var f=p[k];if(!(f.method&&a!==f.method||f.urls&&!b.jg(d,f.urls))){c=!0;break}}return c};b.Zf=function(a){var b=document.createElement("a");b.href=a;a=document.location;return":"===b.protocol&&""===b.hostname&&""===b.port||b.protocol===a.protocol&&b.hostname===a.hostname&&b.port===a.port};b.nc=function(b){var d=b._adrumAjaxT;if(d){var p=(new Date).getTime();2==b.readyState?d.markFirstByteTime(d.getFirstByteTime()||
p):4==b.readyState&&(a.assert(null===d.getRespAvailTime(),"M39"),d.markRespAvailTime(d.getRespAvailTime()||p),d.markFirstByteTime(d.getFirstByteTime()||p))}};b.prototype.Vb=function(d,h,p){return b.hh(d,function(){b.nc(this)},function(){var d=h._adrumAjaxT;if(d&&4==h.readyState){var e=(new Date).getTime();a.assert(null===d.getRespProcTime(),"M40");d.markRespProcTime(d.getRespProcTime()||e);b.a(h,d)}},p)};b.a=function(b,d){var p=b.status;if(400<=p){var c=b.responseText;d.error({status:p,msg:a.utils.isString(c)?
c:""})}a.command("reportXhr",d)};b.prototype.ua=function(d){if(d._adrumAjaxT){var h=(new Date).getTime()+3E4,p=function(){b.nc(d);var c=d._adrumAjaxT;if(c){var f=(new Date).getTime();4==d.readyState?(a.assert(null===c.getRespProcTime(),"M41"),c.markRespProcTime(c.markRespProcTime()||f),a.log("M42"),b.a(d,c),delete d._adrumAjaxT):f<h?setTimeout(p,b.lb):(delete d._adrumAjaxT,a.log("M43"))}};p()}};b.hh=function(b,d,p,c){var f=b;b&&"object"===typeof b&&"toString"in b&&"[xpconnect wrapped nsIDOMEventListener]"===
b.toString()&&"handleEvent"in b&&(f=function(){b.handleEvent.apply(this,Array.prototype.slice.call(arguments))});return a.aop.around(f,d,p,c)};b.prototype.$e=function(){for(var b=0;b<arguments.length;b++);var d=this;return function(b,e){if(("load"===b||"error"===b)&&e&&this._adrumAjaxT){var c;c=e;if(c.__adrumInterceptor)c=c.__adrumInterceptor;else if(a.aop.support(c)){var f=d.Vb(c,this,"XHR.invokeEventListener");c=c.__adrumInterceptor=f}else c=null;if(c)return f=Array.prototype.slice.call(arguments),
f[1]=c,a.log("M44"),f;a.log("M45",b,e)}}};b.Fe=5;b.lb=50;return b}(d.mb);d.fa=f;d.hb=new d.fa})(a.monitor||(a.monitor={}))})(g||(g={}));(function(a){(function(d){function f(a,b){var d=[],c=/^\s*(ADRUM_BT\w*)=(.*)\s*$/i.exec(a);if(c){var f=c[1],c=c[2].replace(/^"|"$/g,""),c=decodeURIComponent(c).split("|"),g=c[0].split(":");if("R"===g[0]&&Number(g[1])===b)for(e(f),f=1;f<c.length;f++)d.push(c[f])}return d}function c(a,b){var d=/^\s*(ADRUM_(\d+)_(\d+)_(\d+))=(.*)\s*$/i.exec(a);if(d){var c=d[1],f=d[4],
g=d[5];if(Number(d[3])===b)return e(c),{index:Number(f),value:g}}return null}function b(b){var d=/^\s*ADRUM=s=([\d]+)&r=(.*)\s*/.exec(b);if(d){a.log("M48",b);if(3===d.length)return e("ADRUM"),{startTime:Number(d[1]),startPage:d[2]};a.error("M49",b);return null}}function e(b){a.log("M47",b);var d=new Date;d.setTime(d.getTime()-1E3);document.cookie=b+"=;Expires="+d.toUTCString()}d.startTimeCookie=null;d.cookieMetadataChunks=null;d.Xb=function(h,e){a.log("M46");for(var g=e?e.length:0,k=[],q=h.split(";"),
m=0;m<q.length;m++){var n=q[m],s=c(n,g);s?k.push(s):(n=b(n),null!=n&&(d.startTimeCookie=n))}Array.prototype.sort.call(k,function(a,b){return a.index-b.index});n=[];for(m=0;m<k.length;m++)n.push(k[m].value);for(m=0;m<q.length;m++)(k=f(q[m],g))&&0<k.length&&(n=n.concat(k));d.cookieMetadataChunks=n};a.correlation.eck=d.Xb})(a.correlation||(a.correlation={}))})(g||(g={}));(function(a){a.report=function(d){a.utils.Ta(function(){a.command("reportEvent",d)})}})(g||(g={}));(function(a){"APP_KEY_NOT_SET"===
a.conf.appKey&&"undefined"!==typeof console&&"undefined"!==typeof console.log&&console.log("AppDynamics EUM cloud application key missing. Please specify window['adrum-app-key']");a.correlation.Xb(document.cookie,document.referrer);a.command("mark","firstbyte",window["adrum-start-time"]);a.monitor.Zc(a.monitor.Zb,a.monitor.df,a.monitor.perfMonitor,a.monitor.hb)})(g||(g={}));(function(a){a=a.ng||(a.ng={});a=a.c||(a.c={});a.Bc="locationChangeStart";a.gg="locationChangeSuccess";a.Uc="routeChangeStart";
a.Vc="routeChangeSuccess";a.bd="stateChangeStart";a.cd="stateChangeSuccess";a.ld="viewContentLoaded";a.Jf="includeContentRequested";a.If="includeContentLoaded";a.Wb="digest";a.Kh="outstandingRequestsComplete";a.Pb="beforeNgXhrRequested";a.Hb="afterNgXhrRequested";a.Jh="ngXhrLoaded";a.Sb="$$completeOutstandingRequest"})(g||(g={}));(function(a){(function(a){function f(b,c,h,p,f,g){if(c)try{return c.apply(b,[h,p,f].concat(g))}catch(q){return b.error(h,p,f,g,a.Error.Md,"an exception occurred in a caller-provided callback function",
q)}}function c(b,c){return function(){var h=this.current,p=c[h]||c[a.ea]||h,g=Array.prototype.slice.call(arguments);if(this.Ve(b))return this.error(b,h,p,g,a.Error.Nd,"event "+b+" inappropriate in current state "+this.current);if(!1===f(this,this["onbefore"+b],b,h,p,g))return a.da.ib;p===a.ea&&(p=h);if(h===p)return f(this,this["onafter"+b]||this["on"+b],b,h,p,g),a.da.qe;var k=this;this.transition=function(){k.transition=null;k.current=p;f(k,k["onenter"+p]||k["on"+p],b,h,p,g);f(k,k["onafter"+b]||k["on"+
b],b,h,p,g);return a.da.ye};if(!1===f(this,this["onleave"+h],b,h,p,g))return this.transition=null,a.da.ib;if(this.transition)return this.transition()}}a.VERSION="2.3.5";a.da={ye:1,qe:2,ib:3,mh:4};a.Error={Nd:100,nh:200,Md:300};a.ea="*";a.create=function(b,e){function h(b){var h=b.from instanceof Array?b.from:b.from?[b.from]:[a.ea];m[b.name]=m[b.name]||{};for(var c=0;c<h.length;c++)n[h[c]]=n[h[c]]||[],n[h[c]].push(b.name),m[b.name][h[c]]=b.to||h[c]}var p="string"==typeof b.initial?{state:b.initial}:
b.initial,f=e||b.target||{},g=b.events||[],q=b.callbacks||{},m={},n={};p&&(p.event=p.event||"startup",h({name:p.event,from:"none",to:p.state}));for(var s=0;s<g.length;s++)h(g[s]);for(var u in m)m.hasOwnProperty(u)&&(f[u]=c(u,m[u]));for(u in q)q.hasOwnProperty(u)&&(f[u]=q[u]);f.current="none";f.Dh=function(a){return a instanceof Array?0<=a.indexOf(this.current):this.current===a};f.Ue=function(b){return!this.transition&&(m[b].hasOwnProperty(this.current)||m[b].hasOwnProperty(a.ea))};f.Ve=function(a){return!this.Ue(a)};
f.ta=function(){return n[this.current]};f.error=b.error||function(a,b,d,h,c,e,p){throw p||e;};if(p&&!p.defer)f[p.event]();return f}})(a.Bb||(a.Bb={}))})(g||(g={}));(function(a){(function(d){var f=function(c){function b(b){c.call(this,b);this.perf=new a.PerformanceTracker;this.start()}s(b,c);b.prototype.type=function(){return 3};b.prototype.yf=function(){return d.EventTracker.Mb(this.guid(),this.url(),this.type())};b.prototype.ad=function(b){var d=this.yf();b.set("parent",d);a.log("M50",d.guid(),d.url())};
b.prototype.startCorrelatingXhrs=function(){a.log("M51");this.ad(a.monitor.hb)};b.prototype.stopCorrelatingXhrs=function(){a.monitor.hb.set("parent",null);a.log("M52")};b.prototype.Ng=function(){a.log("M53");this.ad(a.monitor.Zb)};b.prototype.start=function(){this.markVirtualPageStart();this.startCorrelatingXhrs()};b.prototype.end=function(){this.markVirtualPageEnd();this.stopCorrelatingXhrs()};return b}(d.EventTracker);d.VPageView=f;d.W(d.l[3],f.prototype);d.Nb(d.B[3],f.prototype)})(a.events||(a.events=
{}))})(g||(g={}));(function(a){var d=a.ng||(a.ng={}),d=d.conf||(d.conf={});d.disabled=a.conf.userConf&&a.conf.userConf.spa&&a.conf.userConf.spa.angular&&a.conf.userConf.spa.angular.disable;d.distinguishVPwithItsTemplateUrl=a.conf.userConf&&a.conf.userConf.spa&&a.conf.userConf.spa.angular&&!0===a.conf.userConf.spa.angular.distinguishVPwithItsTemplateUrl?!0:!1;d.xhr={};d.metrics={includeResTimingInEndUserResponseTiming:!0};a.conf.userConf&&a.conf.userConf.spa&&a.conf.userConf.spa.angular&&a.conf.userConf.spa.angular.vp&&
(a.conf.userConf.spa.angular.vp.xhr&&a.monitor.fa.Mc(d.xhr,a.conf.userConf.spa.angular.vp.xhr),a.conf.userConf.spa.angular.vp.metrics&&a.utils.mergeJSON(d.metrics,a.conf.userConf.spa.angular.vp.metrics))})(g||(g={}));(function(a){(function(d){var f=function(c){function b(a){c.call(this,a);this.vc=!0;this.Y={};this.U=0;this.stopCorrelatingXhrs()}s(b,c);b.prototype.type=function(){return 3};b.prototype.fb=function(){this.markViewChangeStart();this.markVirtualPageStart(this.getViewChangeStart());this.timestamp(this.getViewChangeStart())};
b.prototype.Kf=function(){this.digestCount(this.digestCount()+1)};b.prototype.Lf=function(){this.U++;a.log("increasing xhr count "+this.U+" pending xhr requests")};b.prototype.bf=function(){this.U--;a.log("decreasing xhr count "+this.U+" pending xhr requests")};b.prototype.Ff=function(){var b=this.perf.getEntryByName(a.events.b.qd);a.log("xhrCount "+this.U+" xhrReuqestCompleted "+b);return 0<this.U};b.prototype.Re=function(){var a={sa:0},d=document.querySelectorAll("ng-view, [ng-view], .ng-view, [ui-view]");
if(d&&0<d.length)for(var c in b.Rc)for(var f=0;f<d.length;f++){var g=angular.element(d[f]).find(c);if(0<g.length)for(var q=0;q<g.length;q++){var m=g[q][b.Rc[c].Ya];(m=m?decodeURIComponent(m):null)&&!a[m]&&(a[m]=c,a.sa++)}}this.Y=a};b.prototype.Qe=function(a){return!!this.Y[decodeURIComponent(a.name)]};b.prototype.Se=function(){var b=[],d=this;0<this.Y.sa&&(b=a.monitor.perfMonitor.hc().filter(function(a){return d.Qe(a)}));this.resTiming(b)};b.nf=function(b){for(var h=[],c=0;c<b.length;c++){var f=b[c];
2!==b[c].eventType&&101!==b[c].eventType||a.monitor.fa.$c(f.eventUrl,f.method,d.conf.xhr)||h.push(b[c])}return h};b.zf=function(a){var b,d,c=-1;b=0;for(d=a.length;b<d;b++)c=Math.max(c,a[b].timestamp+a[b].metrics.PLT);return c};b.prototype.Le=function(){if(d.conf.xhr){var c=b.nf(a.channel.getEventsWithParentGUID(this.guid())),c=b.zf(c);if(0<c){var h=this.perf.getEntryByName(a.events.b.qd);this.markXhrRequestsCompleted(Math.min(h&&h.startTime||Number.MAX_VALUE,c))}}};b.prototype.adjustTimings=function(){this.Le();
var b=this.getViewDOMLoaded(),h=this.getXhrRequestsCompleted(),b=Math.max(b,h);d.conf.metrics.includeResTimingInEndUserResponseTiming&&(this.Ke(),h=this.getViewResourcesLoaded(),h=Math.max(b,h),a.log("adjust this.end from %s to %s",b,h),b=h);this.markVirtualPageEnd(b)};b.prototype.Ke=function(){if(0<this.Y.sa){this.Se();var b=this.resTiming();if(b&&b.length>=this.Y.sa){for(var d=[],c=0;c<b.length;c++)d.push(b[c].responseEnd);b=Math.max.apply(Math,d);this.markViewResourcesLoaded(a.PerformanceTracker.ia(b))}}};
b.prototype.identifier=function(d){var h=this.nd;a.utils.isDefined(d)&&(this.nd=b.mf(d),this.url(this.nd.url));return h};b.mf=function(b){var d={};b&&b.g?(d.g={Ma:""},a.utils.mergeJSON(d.g,{Ma:b.g.originalPath,Z:b.g.template,$:b.g.templateUrl})):b&&b.state&&(d.state={url:""},a.utils.mergeJSON(d.state,{url:b.state.url,name:b.state.name,Z:b.state.template,$:b.state.templateUrl}));return d};b.Rc={img:{Ya:"src"},script:{Ya:"src"},link:{Ya:"href"}};return b}(a.events.VPageView);d.NgVPageView=f;a.events.W(a.events.l[102],
f.prototype)})(a.ng||(a.ng={}))})(g||(g={}));(function(a){(function(d){var f=function(){function c(){this.e=new d.NgVPageView}c.prototype.Dg=function(){var b=this;d.conf.metrics.includeResTimingInEndUserResponseTiming?(a.log("M54"),setTimeout(function(){b.Pa()},c.Ae)):setTimeout(function(){b.Pa()},c.Be)};c.prototype.Pa=function(){a.log("M55");var b=this.e;a.command("call",function(){b.adjustTimings();a.reporter.reportEvent(b)})};c.prototype.Ig=function(a){this.e=a};c.Ae=5E3;c.Be=2*a.monitor.fa.lb;
return c}();d.VirtualPageStateMachine=f;a.Bb.create({events:[{name:"start",from:"none",to:"ChangeView"},{name:"viewLoaded",from:"ChangeView",to:"XhrPending"},{name:"xhrCompleted",from:"XhrPending",to:"End"},{name:"abort",from:"*",to:"none"},{name:"init",from:"*",to:"none"},{name:"locChange",from:"*",to:"*"},{name:"beforeXhrReq",from:"*",to:"*"},{name:"afterXhrReq",from:"*",to:"*"}],error:function(d){a.log("M56"+d)},callbacks:{onChangeView:function(){this.e.fb();this.e.Ng()},onviewLoaded:function(){this.e.markViewDOMLoaded()},
onXhrPending:function(){this.e.vc&&this.xhrCompleted()},onleaveXhrPending:function(a,b,d){if("abort"===a)return this.Pa(),!0;if("xhrCompleted"===a&&"End"===d){if(this.e.Ff())return!1;this.e.markXhrRequestsCompleted();return!0}},onEnd:function(){this.e.Re();this.Dg()},oninit:function(a,b,d,h){this.Ig(h)},onlocChange:function(a,b,d,h){this.e.identifier.url=h},onbeforeXhrReq:function(d,b,f,h){var p=this.e;p.vc=!1;a.log("M57",h&&h[1]||"",p.guid());p.Lf();p.startCorrelatingXhrs();h[3]&&(h[3]=a.aop.before(h[3],
function(b,d,h){a.log("M58");p.bf();h&&(b=a.utils.wg(h)["content-type"])&&0<=b.indexOf("text/html")&&p.markViewFragmentsLoaded()}));return h},onafterXhrReq:function(){this.e.stopCorrelatingXhrs()}}},f.prototype)})(a.ng||(a.ng={}))})(g||(g={}));(function(a){(function(d){var f=function(){function c(){this.k=new d.VirtualPageStateMachine;this.distinguishVPwithItsTemplateUrl=a.ng.conf.distinguishVPwithItsTemplateUrl}c.prototype.h=function(b,f){a.log("M59",b);switch(b){case d.c.Uc:case d.c.bd:this.k.start();
var h=new d.NgVPageView({url:f.next.url,identifier:f.next});this.distinguishVPwithItsTemplateUrl&&c.Tf(this.k.e,h)?this.k.e.Yc({url:f.next.url,identifier:f.next}):this.Sg(h);break;case d.c.Vc:case d.c.cd:this.k.e.markViewChangeEnd();break;case d.c.ld:this.k.viewLoaded();break;case d.c.Pb:this.k.beforeXhrReq(f);break;case d.c.Hb:this.k.afterXhrReq();break;case d.c.Sb:this.k.xhrCompleted();break;case d.c.Bc:this.k.locChange(f.next.url);break;case d.c.Wb:this.k.e.Kf()}};c.prototype.Sg=function(a){this.k.abort();
this.k.init(a);this.k.start()};c.Tf=function(b,d){var h=b.identifier(),c=d.identifier(),f=!1;return f=!a.utils.isDefined(h)&&!a.utils.isDefined(c)||h===c?!0:a.utils.isDefined(h)&&a.utils.isDefined(c)?h.state||c.state?a.utils.isDefined(h.state)&&a.utils.isDefined(c.state)?h.state.name===c.state.name&&h.state.Z===c.state.Z&&h.state.$===c.state.$&&h.state.url===c.state.url:!1:h.g&&c.g?h.g.Ma===c.g.Ma&&h.g.Z===c.g.Z&&h.g.$===c.g.$:h.url===c.url:!1};return c}();d.De=f})(a.ng||(a.ng={}))})(g||(g={}));(function(a){(function(d){var f=
function(){function c(){this.j=new d.De}c.prototype.setUp=function(){var b=this;a.utils.addEventListener(document,"DOMContentLoaded",function(){a.log("M60");b.init()})};c.prototype.init=function(){if("undefined"!=typeof angular){a.log("M61");var b=this,d=angular.module("ng");d.config(["$provide",function(a){b.Qf(a);b.Pf(a)}]);d.run(["$browser",function(a){b.Of(a)}]);a.log("M62")}};c.prototype.Pf=function(b){var c=a.aop,h=this;b.decorator("$httpBackend",["$delegate",function(a){return a=c.around(a,
function(){var a=Array.prototype.slice.call(arguments);h.j.h(d.c.Pb,a);return a},function(){h.j.h(d.c.Hb)})}])};c.prototype.Qf=function(b){var c=a.aop,h=this;b.decorator("$rootScope",["$delegate",function(a){a.$digest=c.after(a.$digest,function(){h.j.h(d.c.Wb)});a.$on("$locationChangeStart",function(a,b){var c={url:b},f=a&&a.X&&a.X.$state&&a.X.$state.current;f&&(c.state=f);h.j.h(d.c.Bc,{next:c})});a.$on("$locationChangeSuccess",function(){h.j.h(d.c.gg)});a.$on("$routeChangeStart",function(a,b){var c=
{url:location.href},f=b&&b.$$route;f&&(c.g=f);h.j.h(d.c.Uc,{next:c})});a.$on("$routeChangeSuccess",function(){h.j.h(d.c.Vc)});a.$on("$stateChangeStart",function(a,b){h.j.h(d.c.bd,{next:{state:b}})});a.$on("$stateChangeSuccess",function(){h.j.h(d.c.cd)});a.$on("$viewContentLoaded",function(a){var b={url:location.href};if(a=a&&a.X&&a.X.$state&&a.X.$state.current)b.state=a;h.j.h(d.c.ld,{next:b})});a.$on("$includeContentRequested",function(){h.j.h(d.c.Jf)});a.$on("$includeContentLoaded",function(){h.j.h(d.c.If)});
return a}])};c.prototype.Of=function(b){var c=this;b.$$completeOutstandingRequest=a.aop.before(b.$$completeOutstandingRequest,function(){c.j.h(d.c.Sb)})};return c}();d.ih=f;d.ngMonitor=new f})(a.ng||(a.ng={}))})(g||(g={}));(function(a){var d=a.ng||(a.ng={});d.conf.disabled||a.monitor.Zc(d.ngMonitor)})(g||(g={}))}};})();
