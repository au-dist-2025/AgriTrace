"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/it-peekable";
exports.ids = ["vendor-chunks/it-peekable"];
exports.modules = {

/***/ "(ssr)/./node_modules/it-peekable/index.js":
/*!*******************************************!*\
  !*** ./node_modules/it-peekable/index.js ***!
  \*******************************************/
/***/ ((module) => {

eval("\n\n/**\n * @template T\n * @typedef {Object} Peek\n * @property {() => IteratorResult<T, void>} peek\n */\n\n/**\n * @template T\n * @typedef {Object} AsyncPeek\n * @property {() => Promise<IteratorResult<T, void>>} peek\n */\n\n/**\n * @template T\n * @typedef {Object} Push\n * @property {(value:T) => void} push\n */\n\n/**\n * @template T\n * @typedef {Iterable<T> & Peek<T> & Push<T> & Iterator<T>} Peekable<T>\n */\n\n/**\n * @template T\n * @typedef {AsyncIterable<T> & AsyncPeek<T> & Push<T> & AsyncIterator<T>} AsyncPeekable<T>\n */\n\n/**\n * @template {Iterable<any> | AsyncIterable<any>} I\n * @param {I} iterable\n * @returns {I extends Iterable<infer T>\n *  ? Peekable<T>\n *  : I extends AsyncIterable<infer T>\n *  ? AsyncPeekable<T>\n *  : never\n * }\n */\nfunction peekableIterator (iterable) {\n  // @ts-ignore\n  const [iterator, symbol] = iterable[Symbol.asyncIterator]\n    // @ts-ignore\n    ? [iterable[Symbol.asyncIterator](), Symbol.asyncIterator]\n    // @ts-ignore\n    : [iterable[Symbol.iterator](), Symbol.iterator]\n\n  /** @type {any[]} */\n  const queue = []\n\n  // @ts-ignore\n  return {\n    peek: () => {\n      return iterator.next()\n    },\n    push: (value) => {\n      queue.push(value)\n    },\n    next: () => {\n      if (queue.length) {\n        return {\n          done: false,\n          value: queue.shift()\n        }\n      }\n\n      return iterator.next()\n    },\n    [symbol] () {\n      return this\n    }\n  }\n}\n\nmodule.exports = peekableIterator\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXQtcGVla2FibGUvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQVk7O0FBRVo7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixjQUFjLCtCQUErQjtBQUM3Qzs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGNBQWMsd0NBQXdDO0FBQ3REOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsY0FBYyxtQkFBbUI7QUFDakM7O0FBRUE7QUFDQTtBQUNBLGFBQWEsK0NBQStDO0FBQzVEOztBQUVBO0FBQ0E7QUFDQSxhQUFhLDhEQUE4RDtBQUMzRTs7QUFFQTtBQUNBLGNBQWMsb0NBQW9DO0FBQ2xELFdBQVcsR0FBRztBQUNkLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhLE9BQU87QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZC1tYW5kYXRlcy8uL25vZGVfbW9kdWxlcy9pdC1wZWVrYWJsZS9pbmRleC5qcz9mOWMzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBQZWVrXG4gKiBAcHJvcGVydHkgeygpID0+IEl0ZXJhdG9yUmVzdWx0PFQsIHZvaWQ+fSBwZWVrXG4gKi9cblxuLyoqXG4gKiBAdGVtcGxhdGUgVFxuICogQHR5cGVkZWYge09iamVjdH0gQXN5bmNQZWVrXG4gKiBAcHJvcGVydHkgeygpID0+IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8VCwgdm9pZD4+fSBwZWVrXG4gKi9cblxuLyoqXG4gKiBAdGVtcGxhdGUgVFxuICogQHR5cGVkZWYge09iamVjdH0gUHVzaFxuICogQHByb3BlcnR5IHsodmFsdWU6VCkgPT4gdm9pZH0gcHVzaFxuICovXG5cbi8qKlxuICogQHRlbXBsYXRlIFRcbiAqIEB0eXBlZGVmIHtJdGVyYWJsZTxUPiAmIFBlZWs8VD4gJiBQdXNoPFQ+ICYgSXRlcmF0b3I8VD59IFBlZWthYmxlPFQ+XG4gKi9cblxuLyoqXG4gKiBAdGVtcGxhdGUgVFxuICogQHR5cGVkZWYge0FzeW5jSXRlcmFibGU8VD4gJiBBc3luY1BlZWs8VD4gJiBQdXNoPFQ+ICYgQXN5bmNJdGVyYXRvcjxUPn0gQXN5bmNQZWVrYWJsZTxUPlxuICovXG5cbi8qKlxuICogQHRlbXBsYXRlIHtJdGVyYWJsZTxhbnk+IHwgQXN5bmNJdGVyYWJsZTxhbnk+fSBJXG4gKiBAcGFyYW0ge0l9IGl0ZXJhYmxlXG4gKiBAcmV0dXJucyB7SSBleHRlbmRzIEl0ZXJhYmxlPGluZmVyIFQ+XG4gKiAgPyBQZWVrYWJsZTxUPlxuICogIDogSSBleHRlbmRzIEFzeW5jSXRlcmFibGU8aW5mZXIgVD5cbiAqICA/IEFzeW5jUGVla2FibGU8VD5cbiAqICA6IG5ldmVyXG4gKiB9XG4gKi9cbmZ1bmN0aW9uIHBlZWthYmxlSXRlcmF0b3IgKGl0ZXJhYmxlKSB7XG4gIC8vIEB0cy1pZ25vcmVcbiAgY29uc3QgW2l0ZXJhdG9yLCBzeW1ib2xdID0gaXRlcmFibGVbU3ltYm9sLmFzeW5jSXRlcmF0b3JdXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgID8gW2l0ZXJhYmxlW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSgpLCBTeW1ib2wuYXN5bmNJdGVyYXRvcl1cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgOiBbaXRlcmFibGVbU3ltYm9sLml0ZXJhdG9yXSgpLCBTeW1ib2wuaXRlcmF0b3JdXG5cbiAgLyoqIEB0eXBlIHthbnlbXX0gKi9cbiAgY29uc3QgcXVldWUgPSBbXVxuXG4gIC8vIEB0cy1pZ25vcmVcbiAgcmV0dXJuIHtcbiAgICBwZWVrOiAoKSA9PiB7XG4gICAgICByZXR1cm4gaXRlcmF0b3IubmV4dCgpXG4gICAgfSxcbiAgICBwdXNoOiAodmFsdWUpID0+IHtcbiAgICAgIHF1ZXVlLnB1c2godmFsdWUpXG4gICAgfSxcbiAgICBuZXh0OiAoKSA9PiB7XG4gICAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgdmFsdWU6IHF1ZXVlLnNoaWZ0KClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXRlcmF0b3IubmV4dCgpXG4gICAgfSxcbiAgICBbc3ltYm9sXSAoKSB7XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBlZWthYmxlSXRlcmF0b3JcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/it-peekable/index.js\n");

/***/ })

};
;