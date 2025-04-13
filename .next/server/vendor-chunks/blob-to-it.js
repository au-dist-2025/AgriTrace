"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/blob-to-it";
exports.ids = ["vendor-chunks/blob-to-it"];
exports.modules = {

/***/ "(ssr)/./node_modules/blob-to-it/index.js":
/*!******************************************!*\
  !*** ./node_modules/blob-to-it/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/* eslint-env browser */\n\n\n\nconst browserReadableStreamToIt = __webpack_require__(/*! browser-readablestream-to-it */ \"(ssr)/./node_modules/browser-readablestream-to-it/index.js\")\n\n/**\n * @param {Blob} blob\n * @returns {AsyncIterable<Uint8Array>}\n */\nfunction blobToIt (blob) {\n  if (typeof blob.stream === 'function') {\n    // @ts-ignore missing some properties\n    return browserReadableStreamToIt(blob.stream())\n  }\n\n  // firefox < 69 does not support blob.stream()\n  // @ts-ignore - response.body is optional, but in practice it's a stream.\n  return browserReadableStreamToIt(new Response(blob).body)\n}\n\nmodule.exports = blobToIt\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvYmxvYi10by1pdC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTs7QUFFWTs7QUFFWixrQ0FBa0MsbUJBQU8sQ0FBQyxnR0FBOEI7O0FBRXhFO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kLW1hbmRhdGVzLy4vbm9kZV9tb2R1bGVzL2Jsb2ItdG8taXQvaW5kZXguanM/NzZiNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGJyb3dzZXJSZWFkYWJsZVN0cmVhbVRvSXQgPSByZXF1aXJlKCdicm93c2VyLXJlYWRhYmxlc3RyZWFtLXRvLWl0JylcblxuLyoqXG4gKiBAcGFyYW0ge0Jsb2J9IGJsb2JcbiAqIEByZXR1cm5zIHtBc3luY0l0ZXJhYmxlPFVpbnQ4QXJyYXk+fVxuICovXG5mdW5jdGlvbiBibG9iVG9JdCAoYmxvYikge1xuICBpZiAodHlwZW9mIGJsb2Iuc3RyZWFtID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gQHRzLWlnbm9yZSBtaXNzaW5nIHNvbWUgcHJvcGVydGllc1xuICAgIHJldHVybiBicm93c2VyUmVhZGFibGVTdHJlYW1Ub0l0KGJsb2Iuc3RyZWFtKCkpXG4gIH1cblxuICAvLyBmaXJlZm94IDwgNjkgZG9lcyBub3Qgc3VwcG9ydCBibG9iLnN0cmVhbSgpXG4gIC8vIEB0cy1pZ25vcmUgLSByZXNwb25zZS5ib2R5IGlzIG9wdGlvbmFsLCBidXQgaW4gcHJhY3RpY2UgaXQncyBhIHN0cmVhbS5cbiAgcmV0dXJuIGJyb3dzZXJSZWFkYWJsZVN0cmVhbVRvSXQobmV3IFJlc3BvbnNlKGJsb2IpLmJvZHkpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmxvYlRvSXRcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/blob-to-it/index.js\n");

/***/ })

};
;