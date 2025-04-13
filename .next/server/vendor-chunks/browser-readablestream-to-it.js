"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/browser-readablestream-to-it";
exports.ids = ["vendor-chunks/browser-readablestream-to-it"];
exports.modules = {

/***/ "(ssr)/./node_modules/browser-readablestream-to-it/index.js":
/*!************************************************************!*\
  !*** ./node_modules/browser-readablestream-to-it/index.js ***!
  \************************************************************/
/***/ ((module) => {

eval("\n\n/**\n * Turns a browser readable stream into an async iterable. Async iteration over\n * returned iterable will lock give stream, preventing any other consumer from\n * acquiring a reader. The lock will be released if iteration loop is broken. To\n * prevent stream cancelling optional `{ preventCancel: true }` could be passed\n * as a second argument.\n * @template T\n * @param {ReadableStream<T>} stream\n * @param {Object} [options]\n * @param {boolean} [options.preventCancel=boolean]\n * @returns {AsyncIterable<T>}\n */\nasync function * browserReadableStreamToIt (stream, options = {}) {\n  const reader = stream.getReader()\n\n  try {\n    while (true) {\n      const result = await reader.read()\n\n      if (result.done) {\n        return\n      }\n\n      yield result.value\n    }\n  } finally {\n    if (options.preventCancel !== true) {\n      reader.cancel()\n    }\n\n    reader.releaseLock()\n  }\n}\n\nmodule.exports = browserReadableStreamToIt\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZWFkYWJsZXN0cmVhbS10by1pdC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxxQkFBcUI7QUFDOUQ7QUFDQTtBQUNBLFdBQVcsbUJBQW1CO0FBQzlCLFdBQVcsUUFBUTtBQUNuQixXQUFXLFNBQVM7QUFDcEIsYUFBYTtBQUNiO0FBQ0EsZ0VBQWdFO0FBQ2hFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZC1tYW5kYXRlcy8uL25vZGVfbW9kdWxlcy9icm93c2VyLXJlYWRhYmxlc3RyZWFtLXRvLWl0L2luZGV4LmpzP2E4YmYiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogVHVybnMgYSBicm93c2VyIHJlYWRhYmxlIHN0cmVhbSBpbnRvIGFuIGFzeW5jIGl0ZXJhYmxlLiBBc3luYyBpdGVyYXRpb24gb3ZlclxuICogcmV0dXJuZWQgaXRlcmFibGUgd2lsbCBsb2NrIGdpdmUgc3RyZWFtLCBwcmV2ZW50aW5nIGFueSBvdGhlciBjb25zdW1lciBmcm9tXG4gKiBhY3F1aXJpbmcgYSByZWFkZXIuIFRoZSBsb2NrIHdpbGwgYmUgcmVsZWFzZWQgaWYgaXRlcmF0aW9uIGxvb3AgaXMgYnJva2VuLiBUb1xuICogcHJldmVudCBzdHJlYW0gY2FuY2VsbGluZyBvcHRpb25hbCBgeyBwcmV2ZW50Q2FuY2VsOiB0cnVlIH1gIGNvdWxkIGJlIHBhc3NlZFxuICogYXMgYSBzZWNvbmQgYXJndW1lbnQuXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIHtSZWFkYWJsZVN0cmVhbTxUPn0gc3RyZWFtXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnByZXZlbnRDYW5jZWw9Ym9vbGVhbl1cbiAqIEByZXR1cm5zIHtBc3luY0l0ZXJhYmxlPFQ+fVxuICovXG5hc3luYyBmdW5jdGlvbiAqIGJyb3dzZXJSZWFkYWJsZVN0cmVhbVRvSXQgKHN0cmVhbSwgb3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IHJlYWRlciA9IHN0cmVhbS5nZXRSZWFkZXIoKVxuXG4gIHRyeSB7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlYWRlci5yZWFkKClcblxuICAgICAgaWYgKHJlc3VsdC5kb25lKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB5aWVsZCByZXN1bHQudmFsdWVcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgaWYgKG9wdGlvbnMucHJldmVudENhbmNlbCAhPT0gdHJ1ZSkge1xuICAgICAgcmVhZGVyLmNhbmNlbCgpXG4gICAgfVxuXG4gICAgcmVhZGVyLnJlbGVhc2VMb2NrKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJyb3dzZXJSZWFkYWJsZVN0cmVhbVRvSXRcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/browser-readablestream-to-it/index.js\n");

/***/ })

};
;