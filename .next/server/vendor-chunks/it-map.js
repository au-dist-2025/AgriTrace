"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/it-map";
exports.ids = ["vendor-chunks/it-map"];
exports.modules = {

/***/ "(ssr)/./node_modules/it-map/index.js":
/*!**************************************!*\
  !*** ./node_modules/it-map/index.js ***!
  \**************************************/
/***/ ((module) => {

eval("\n\n/**\n * Takes an (async) iterable and returns one with each item mapped by the passed\n * function.\n *\n * @template I,O\n * @param {AsyncIterable<I>|Iterable<I>} source\n * @param {function(I):O|Promise<O>} func\n * @returns {AsyncIterable<O>}\n */\nconst map = async function * (source, func) {\n  for await (const val of source) {\n    yield func(val)\n  }\n}\n\nmodule.exports = map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXQtbWFwL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLDhCQUE4QjtBQUN6QyxXQUFXLDBCQUEwQjtBQUNyQyxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZC1tYW5kYXRlcy8uL25vZGVfbW9kdWxlcy9pdC1tYXAvaW5kZXguanM/YmZhNyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBUYWtlcyBhbiAoYXN5bmMpIGl0ZXJhYmxlIGFuZCByZXR1cm5zIG9uZSB3aXRoIGVhY2ggaXRlbSBtYXBwZWQgYnkgdGhlIHBhc3NlZFxuICogZnVuY3Rpb24uXG4gKlxuICogQHRlbXBsYXRlIEksT1xuICogQHBhcmFtIHtBc3luY0l0ZXJhYmxlPEk+fEl0ZXJhYmxlPEk+fSBzb3VyY2VcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oSSk6T3xQcm9taXNlPE8+fSBmdW5jXG4gKiBAcmV0dXJucyB7QXN5bmNJdGVyYWJsZTxPPn1cbiAqL1xuY29uc3QgbWFwID0gYXN5bmMgZnVuY3Rpb24gKiAoc291cmNlLCBmdW5jKSB7XG4gIGZvciBhd2FpdCAoY29uc3QgdmFsIG9mIHNvdXJjZSkge1xuICAgIHlpZWxkIGZ1bmModmFsKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/it-map/index.js\n");

/***/ })

};
;