"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/it-take";
exports.ids = ["vendor-chunks/it-take"];
exports.modules = {

/***/ "(ssr)/./node_modules/it-take/index.js":
/*!***************************************!*\
  !*** ./node_modules/it-take/index.js ***!
  \***************************************/
/***/ ((module) => {

eval("\n\n/**\n * Stop iteration after n items have been received.\n *\n * @template T\n * @param {AsyncIterable<T>|Iterable<T>} source\n * @param {number} limit\n * @returns {AsyncIterable<T>}\n */\nconst take = async function * (source, limit) {\n  let items = 0\n\n  if (limit < 1) {\n    return\n  }\n\n  for await (const entry of source) {\n    yield entry\n\n    items++\n\n    if (items === limit) {\n      return\n    }\n  }\n}\n\nmodule.exports = take\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXQtdGFrZS9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsOEJBQThCO0FBQ3pDLFdBQVcsUUFBUTtBQUNuQixhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kLW1hbmRhdGVzLy4vbm9kZV9tb2R1bGVzL2l0LXRha2UvaW5kZXguanM/ZTU0OCJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBTdG9wIGl0ZXJhdGlvbiBhZnRlciBuIGl0ZW1zIGhhdmUgYmVlbiByZWNlaXZlZC5cbiAqXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIHtBc3luY0l0ZXJhYmxlPFQ+fEl0ZXJhYmxlPFQ+fSBzb3VyY2VcbiAqIEBwYXJhbSB7bnVtYmVyfSBsaW1pdFxuICogQHJldHVybnMge0FzeW5jSXRlcmFibGU8VD59XG4gKi9cbmNvbnN0IHRha2UgPSBhc3luYyBmdW5jdGlvbiAqIChzb3VyY2UsIGxpbWl0KSB7XG4gIGxldCBpdGVtcyA9IDBcblxuICBpZiAobGltaXQgPCAxKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBmb3IgYXdhaXQgKGNvbnN0IGVudHJ5IG9mIHNvdXJjZSkge1xuICAgIHlpZWxkIGVudHJ5XG5cbiAgICBpdGVtcysrXG5cbiAgICBpZiAoaXRlbXMgPT09IGxpbWl0KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0YWtlXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/it-take/index.js\n");

/***/ })

};
;