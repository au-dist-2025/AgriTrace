"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/web-encoding";
exports.ids = ["vendor-chunks/web-encoding"];
exports.modules = {

/***/ "(ssr)/./node_modules/web-encoding/src/lib.mjs":
/*!***********************************************!*\
  !*** ./node_modules/web-encoding/src/lib.mjs ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TextDecoder: () => (/* binding */ Decoder),\n/* harmony export */   TextEncoder: () => (/* binding */ Encoder)\n/* harmony export */ });\n// In node `export { TextEncoder }` throws:\n// \"Export 'TextEncoder' is not defined in module\"\n// To workaround we first define constants and then export with as.\nconst Encoder = TextEncoder\nconst Decoder = TextDecoder\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvd2ViLWVuY29kaW5nL3NyYy9saWIubWpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUJBQXFCLGFBQWE7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRXlEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZC1tYW5kYXRlcy8uL25vZGVfbW9kdWxlcy93ZWItZW5jb2Rpbmcvc3JjL2xpYi5tanM/OTMyYiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbiBub2RlIGBleHBvcnQgeyBUZXh0RW5jb2RlciB9YCB0aHJvd3M6XG4vLyBcIkV4cG9ydCAnVGV4dEVuY29kZXInIGlzIG5vdCBkZWZpbmVkIGluIG1vZHVsZVwiXG4vLyBUbyB3b3JrYXJvdW5kIHdlIGZpcnN0IGRlZmluZSBjb25zdGFudHMgYW5kIHRoZW4gZXhwb3J0IHdpdGggYXMuXG5jb25zdCBFbmNvZGVyID0gVGV4dEVuY29kZXJcbmNvbnN0IERlY29kZXIgPSBUZXh0RGVjb2RlclxuXG5leHBvcnQgeyBFbmNvZGVyIGFzIFRleHRFbmNvZGVyLCBEZWNvZGVyIGFzIFRleHREZWNvZGVyIH1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/web-encoding/src/lib.mjs\n");

/***/ })

};
;