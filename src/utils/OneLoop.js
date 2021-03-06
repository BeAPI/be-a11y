/* eslint-disable */
/**
 * OneLoop.js
 * @author Nicolas Langle
 * https://github.com/n-langle/OneLoop.js
 */
 "use strict";

 function assign() {
   var args = arguments,
     rt = args[0],
     i,
     prop;
 
   for (i = 1; i < args.length; i++) {
     for (prop in args[i]) {
       if (typeof args[i][prop] !== "undefined") {
         rt[prop] = args[i][prop];
       }
     }
   }
 
   return rt;
 }
 
 /*
  * source: https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
  */
 var easings = (function () {
   var pow = Math.pow;
   var sqrt = Math.sqrt;
   var sin = Math.sin;
   var cos = Math.cos;
   var PI = Math.PI;
   var c1 = 1.70158;
   var c2 = c1 * 1.525;
   var c3 = c1 + 1;
   var c4 = (2 * PI) / 3;
   var c5 = (2 * PI) / 4.5;
 
   function bounceOut(x) {
     var n1 = 7.5625;
     var d1 = 2.75;
 
     if (x < 1 / d1) {
       return n1 * x * x;
     } else if (x < 2 / d1) {
       return n1 * (x -= 1.5 / d1) * x + 0.75;
     } else if (x < 2.5 / d1) {
       return n1 * (x -= 2.25 / d1) * x + 0.9375;
     } else {
       return n1 * (x -= 2.625 / d1) * x + 0.984375;
     }
   }
 
   return {
     linear(x) {
       return x;
     },
     easeInQuad(x) {
       return x * x;
     },
     easeOutQuad(x) {
       return 1 - (1 - x) * (1 - x);
     },
     easeInOutQuad(x) {
       return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
     },
     easeInCubic(x) {
       return x * x * x;
     },
     easeOutCubic(x) {
       return 1 - pow(1 - x, 3);
     },
     easeInOutCubic(x) {
       return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
     },
     easeInQuart(x) {
       return x * x * x * x;
     },
     easeOutQuart(x) {
       return 1 - pow(1 - x, 4);
     },
     easeInOutQuart(x) {
       return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
     },
     easeInQuint(x) {
       return x * x * x * x * x;
     },
     easeOutQuint(x) {
       return 1 - pow(1 - x, 5);
     },
     easeInOutQuint(x) {
       return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
     },
     easeInSine(x) {
       return 1 - cos((x * PI) / 2);
     },
     easeOutSine(x) {
       return sin((x * PI) / 2);
     },
     easeInOutSine(x) {
       return -(cos(PI * x) - 1) / 2;
     },
     easeInExpo(x) {
       return x === 0 ? 0 : pow(2, 10 * x - 10);
     },
     easeOutExpo(x) {
       return x === 1 ? 1 : 1 - pow(2, -10 * x);
     },
     easeInOutExpo(x) {
       return x === 0
         ? 0
         : x === 1
         ? 1
         : x < 0.5
         ? pow(2, 20 * x - 10) / 2
         : (2 - pow(2, -20 * x + 10)) / 2;
     },
     easeInCirc(x) {
       return 1 - sqrt(1 - pow(x, 2));
     },
     easeOutCirc(x) {
       return sqrt(1 - pow(x - 1, 2));
     },
     easeInOutCirc(x) {
       return x < 0.5
         ? (1 - sqrt(1 - pow(2 * x, 2))) / 2
         : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
     },
     easeInBack(x) {
       return c3 * x * x * x - c1 * x * x;
     },
     easeOutBack(x) {
       return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
     },
     easeInOutBack(x) {
       return x < 0.5
         ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
         : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
     },
     easeInElastic(x) {
       return x === 0
         ? 0
         : x === 1
         ? 1
         : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
     },
     easeOutElastic(x) {
       return x === 0
         ? 0
         : x === 1
         ? 1
         : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
     },
     easeInOutElastic(x) {
       return x === 0
         ? 0
         : x === 1
         ? 1
         : x < 0.5
         ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
         : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;
     },
     easeInBounce(x) {
       return 1 - bounceOut(1 - x);
     },
     easeOutBounce: bounceOut,
     easeInOutBounce(x) {
       return x < 0.5
         ? (1 - bounceOut(1 - 2 * x)) / 2
         : (1 + bounceOut(2 * x - 1)) / 2;
     }
   };
 })();
 
 var mainLoopInstance = null;
 
 function MainLoop() {
   if (mainLoopInstance) {
     return mainLoopInstance;
   }
 
   mainLoopInstance = this;
 
   this._entries = [];
   this._raf = null;
 }
 
 assign(MainLoop.prototype, {
   add: function (entry) {
     if (this._entries.indexOf(entry) === -1) {
       this._entries.push(entry);
 
       if (this._raf === null) {
         this.start();
       }
     }
 
     return this;
   },
 
   remove: function (entry) {
     var index = this._entries.indexOf(entry);
     if (index > -1) {
       this._entries.splice(index, 1)[0].stop();
     }
 
     return this;
   },
 
   start: function () {
     var that = this,
       entries = that._entries,
       lastTime;
 
     if (that._raf === null) {
       lastTime = performance.now();
 
       function loop(timestamp) {
         var tick = (timestamp - lastTime) / (1000 / 60),
           i;
 
         for (i = 0; i < entries.length; i++) {
           if (entries[i].needsUpdate(timestamp)) {
             entries[i].update(timestamp, tick);
           } else {
             entries.splice(i, 1)[0].complete(timestamp, tick);
             i--;
           }
         }
 
         if (entries.length) {
           lastTime = timestamp;
           that._raf = requestAnimationFrame(loop);
         } else {
           that._raf = null;
         }
       }
 
       that._raf = requestAnimationFrame(loop);
     }
 
     return this;
   },
 
   stop: function () {
     cancelAnimationFrame(this._raf);
     this._raf = null;
     return this;
   },
 
   destroy: function () {
     this._entries.length = 0;
     this.stop();
     mainLoopInstance = null;
   }
 });
 
 function noop() {}
 
 function MainLoopEntry(options) {
   assign(this, MainLoopEntry.defaults, options);
 
   this._mainLoop = new MainLoop();
   this._startTime = 0;
 
   if (this.autoStart) {
     this.start();
   }
 }
 
 MainLoopEntry.defaults = {
   delay: 0,
   onStart: noop,
   onUpdate: noop,
   onStop: noop,
   onComplete: noop,
   autoStart: true
 };
 
 assign(MainLoopEntry.prototype, {
   start: function (delay, onStartAdditionalParameter) {
     if (delay !== 0 && !delay) {
       delay = this.delay;
     }
 
     if (delay === 0) {
       this._startTime = performance.now();
       this._mainLoop.add(this);
       this.onStart(this._startTime, 0, onStartAdditionalParameter);
     } else {
       setTimeout(this.start.bind(this, 0, onStartAdditionalParameter), delay);
     }
 
     return this;
   },
 
   stop: function () {
     this._mainLoop.remove(this);
     this.onStop();
     return this;
   },
 
   update: function (timestamp, tick) {
     this.onUpdate(timestamp, tick);
     return this;
   },
 
   complete: function (timestamp, tick) {
     this.onComplete(timestamp, tick);
     return this;
   },
 
   needsUpdate: function (timestamp) {
     return true;
   }
 });
 
 function Tween(options) {
   var settings = assign({}, Tween.defaults, options);
 
   this._range = 1;
   this._executed = 0;
   this._direction = settings.reverse ? 1 : 0;
 
   MainLoopEntry.call(this, settings);
 }
 
 Tween.defaults = {
   duration: 1000,
   easing: "linear",
   loop: 0,
   reverse: false
 };
 
 assign(Tween.prototype, MainLoopEntry.prototype, {
   start: function (delay) {
     if (this.reverse) {
       this._range = compute[this._direction](this._executed);
       this._direction = (this._direction + 1) % 2;
     }
 
     return MainLoopEntry.prototype.start.call(this, delay, 1 - this._range);
   },
 
   update: function (timestamp, tick) {
     var result =
         easings[this.easing](
           (timestamp - this._startTime) / (this.duration * this._range)
         ) *
           this._range +
         1 -
         this._range,
       percent = compute[this._direction](result);
 
     this._executed = percent;
 
     this.onUpdate(timestamp, tick, percent);
     return this;
   },
 
   complete: function (timestamp, tick) {
     var lastValue = (this._direction + 1) % 2;
 
     this.onUpdate(timestamp, tick, lastValue);
     this.onComplete(timestamp, tick, lastValue);
 
     if (this.loop > 0) {
       this.loop--;
       this.start();
     }
 
     return this;
   },
 
   needsUpdate: function (timestamp) {
     return timestamp - this._startTime < this.duration * this._range;
   }
 });
 
 var compute = [
   // forward
   function (value) {
     return value;
   },
   // backward
   function (value) {
     return 1 - value;
   }
 ];
 
 function getElements(element, context) {
   return typeof element === "string"
     ? (context || document).querySelectorAll(element)
     : element.length >= 0
     ? element
     : [element];
 }
 
 var throttledEventInstances = [];
 
 function ThrottledEvent(target, eventType) {
   var oldInstance = getThrottledEventInstance(target, eventType);
 
   if (oldInstance) {
     return oldInstance;
   } else {
     addToThrottledEventInstances(this, target, eventType);
   }
 
   MainLoopEntry.call(this, { autoStart: false });
 
   var events = {};
 
   events[eventType + "start"] = [];
   events[eventType] = [];
   events[eventType + "end"] = [];
 
   this._events = events;
 
   this._needsUpdate = false;
   this._reset = reset.bind(this);
   this._onEvent = onEvent.bind(this);
   this._timer = null;
   this._target = target;
   this._eventType = eventType;
   this._event = null;
 
   this._target.addEventListener(this._eventType, this._onEvent);
 }
 
 assign(ThrottledEvent.prototype, MainLoopEntry.prototype, {
   destroy: function () {
     removeFromThrottledEventInstances(this._target, this._eventType);
     this._target.removeEventListener(this._eventType, this._onEvent);
   },
 
   add: function (when, callback) {
     if (this._events[when].indexOf(callback) === -1) {
       this._events[when].push(callback);
     }
 
     return this;
   },
 
   remove: function (when, callback) {
     var index = this._events[when].indexOf(callback);
     if (index > -1) {
       this._events[when].splice(index, 1);
     }
     return this;
   },
 
   update: function (timestamp, tick) {
     callCallbacks(this._events[this._eventType], this._event);
     return this;
   },
 
   complete: function (timestamp, tick) {
     callCallbacks(this._events[this._eventType + "end"], this._event);
     return this;
   },
 
   needsUpdate: function (timestamp) {
     return this._needsUpdate;
   }
 });
 
 ThrottledEvent.destroy = function () {
   while (throttledEventInstances.length) {
     throttledEventInstances[0].instance.destroy();
   }
 };
 
 // ----
 // utils
 // ----
 function reset() {
   this._needsUpdate = false;
 }
 
 function callCallbacks(array, e) {
   var i = 0;
 
   for (; i < array.length; i++) {
     array[i](e);
   }
 }
 
 // ----
 // event
 // ----
 function onEvent(e) {
   this._event = e;
 
   if (!this._needsUpdate) {
     this._needsUpdate = true;
     this.start();
     callCallbacks(this._events[this._eventType + "start"], e);
   }
 
   clearTimeout(this._timer);
   this._timer = setTimeout(this._reset, 128);
 }
 
 // ----
 // throttledEventInstances
 // ----
 function addToThrottledEventInstances(instance, target, eventType) {
   throttledEventInstances.push({
     instance: instance,
     target: target,
     eventType: eventType
   });
 }
 
 function removeFromThrottledEventInstances(target, eventType) {
   var i;
 
   for (i = 0; i < throttledEventInstances.length; i++) {
     if (
       throttledEventInstances[i].eventType === eventType &&
       throttledEventInstances[i].target === target
     ) {
       throttledEventInstances.splice(i, 1);
     }
   }
 }
 
 function getThrottledEventInstance(target, eventType) {
   var i;
 
   for (i = 0; i < throttledEventInstances.length; i++) {
     if (
       throttledEventInstances[i].eventType === eventType &&
       throttledEventInstances[i].target === target
     ) {
       return throttledEventInstances[i].instance;
     }
   }
 
   return null;
 }
 
 function ScrollObserverEntry(element, options, scroll) {
   assign(this, ScrollObserverEntry.defaults, options);
 
   this.element = element;
   this._isVisible = false;
   this.children = this.children ? getElements(this.children, this.element) : [];
 
   this.refresh(scroll);
 }
 
 ScrollObserverEntry.defaults = {
   children: "",
   onVisible: noop,
   onVisibilityStart: noop,
   onVisibilityEnd: noop,
   onAlways: noop
 };
 
 assign(ScrollObserverEntry.prototype, {
   refresh: function (scroll) {
     var bounding = this.element.getBoundingClientRect();
     var scrollY = window.pageYOffset;
     var height = window.innerHeight;
     this.distance = height + bounding.bottom - bounding.top;
     this.start = bounding.bottom - this.distance + scrollY;
 
     this.realStart = Math.max(bounding.top + scrollY - height, 0);
     this.realDistance = Math.min(
       bounding.bottom + scrollY - this.realStart,
       document.documentElement.scrollHeight - height
     );
 
     this.boundingClientRect = bounding;
 
     this.control(scroll);
 
     return this;
   },
 
   control: function (scroll) {
     var p1 = (scroll.y - this.start) / this.distance,
       p2 = (scroll.y - this.realStart) / this.realDistance;
 
     if (p1 >= 0 && p1 <= 1) {
       if (!this._isVisible) {
         this._isVisible = true;
         this.onVisibilityStart.call(this, scroll, round(p1), round(p2));
         this.onVisible.call(this, scroll, round(p1), round(p2));
       }
 
       this.onVisible.call(this, scroll, p1, p2);
     } else if (this._isVisible) {
       this._isVisible = false;
 
       this.onVisible.call(this, scroll, round(p1), round(p2));
       this.onVisibilityEnd.call(this, scroll, round(p1), round(p2));
     }
 
     this.onAlways.call(this, scroll, p1, p2);
 
     return this;
   }
 });
 
 function round(v) {
   return Math.abs(Math.round(v));
 }
 
 var scrollObserverInstances = [],
   scrollObserverAutoRefreshTimer = null;
 
 function ScrollObserver(options) {
   MainLoopEntry.call(
     this,
     assign({}, ScrollObserver.defaults, options, { autoStart: false })
   );
 
   this._elements = [];
   this._entries = [];
   this._onScroll = this.start.bind(this);
   this._onResize = this.refresh.bind(this);
   this._lastScrollY = 0;
 
   this._resize = new ThrottledEvent(window, "resize");
   this._scroll = new ThrottledEvent(window, "scroll");
 
   this._resize.add("resize", this._onResize);
   this._scroll.add("scrollstart", this._onScroll);
 
   scrollObserverInstances.push(this);
   ScrollObserver.startAutoRefresh();
 }
 
 ScrollObserver.defaults = {
   scrollDivider: 1
 };
 
 assign(ScrollObserver.prototype, MainLoopEntry.prototype, {
   destroy: function () {
     this._scroll.remove("scrollstart", this._onScroll);
     this._resize.remove("resize", this._onResize);
     scrollObserverInstances.splice(scrollObserverInstances.indexOf(this), 1);
 
     if (scrollObserverInstances.length === 0) {
       ScrollObserver.stopAutoRefresh();
     }
   },
 
   observe: function (element, options) {
     var els = getElements(element),
       scroll = this.getScrollInfos(),
       i;
 
     for (i = 0; i < els.length; i++) {
       if (this._elements.indexOf(element) === -1) {
         this._entries.push(new ScrollObserverEntry(els[i], options, scroll));
         this._elements.push(els[i]);
       }
     }
 
     return this;
   },
 
   unobserve: function (element) {
     var els = getElements(element),
       index,
       i;
 
     for (i = 0; i < els.length; i++) {
       index = this._elements.indexOf(element);
       if (index > -1) {
         this._elements.splice(index, 1);
         this._entries.splice(index, 1);
       }
     }
 
     return this;
   },
 
   update: function (timestamp, tick) {
     this.onUpdate(timestamp, tick);
 
     var scroll = this.getScrollInfos(),
       i;
 
     for (i = 0; i < this._entries.length; i++) {
       this._entries[i].control(scroll);
     }
 
     this._lastScrollY = scroll.y;
 
     return this;
   },
 
   needsUpdate: function (timestamp) {
     return (
       this._scroll.needsUpdate() ||
       (this.scrollDivider > 1 &&
         Math.abs(window.pageYOffset - this._lastScrollY) > 1)
     );
   },
 
   getScrollInfos: function () {
     var y =
         this._lastScrollY +
         (window.pageYOffset - this._lastScrollY) / this.scrollDivider,
       deltaY = y - this._lastScrollY;
 
     return {
       y: y,
       deltaY: deltaY,
       directionY: deltaY / Math.abs(deltaY) || 0
     };
   },
 
   refresh: function () {
     var scroll = this.getScrollInfos(),
       i;
 
     for (i = 0; i < this._entries.length; i++) {
       this._entries[i].refresh(scroll);
     }
 
     return this;
   }
 });
 
 // ----
 // utils
 // ----
 function getDocumentHeight() {
   var html = document.documentElement,
     body = document.body;
 
   return Math.max(
     body.scrollHeight,
     body.offsetHeight,
     html.clientHeight,
     html.scrollHeight,
     html.offsetHeight
   );
 }
 
 // ----
 // statics
 // ----
 ScrollObserver.autoRefreshDelay = 1000;
 
 ScrollObserver.startAutoRefresh = function () {
   if (
     scrollObserverAutoRefreshTimer === null &&
     ScrollObserver.autoRefreshDelay !== null
   ) {
     var lastDocumentHeight = getDocumentHeight();
 
     scrollObserverAutoRefreshTimer = setInterval(function () {
       var height = getDocumentHeight(),
         i;
 
       if (height !== lastDocumentHeight) {
         for (i = 0; i < scrollObserverInstances.length; i++) {
           scrollObserverInstances[i].refresh();
         }
         lastDocumentHeight = height;
       }
     }, ScrollObserver.autoRefreshDelay);
   }
   return this;
 };
 
 ScrollObserver.stopAutoRefresh = function () {
   clearInterval(scrollObserverAutoRefreshTimer);
   scrollObserverAutoRefreshTimer = null;
   return this;
 };
 
 ScrollObserver.destroy = function () {
   while (scrollObserverInstances.length) {
     scrollObserverInstances[0].destroy();
   }
 };
 
 export {
   easings,
   MainLoop,
   MainLoopEntry,
   Tween,
   ScrollObserver,
   ScrollObserverEntry,
   ThrottledEvent
 };
 