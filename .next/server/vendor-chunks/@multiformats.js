"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@multiformats";
exports.ids = ["vendor-chunks/@multiformats"];
exports.modules = {

/***/ "(ssr)/./node_modules/@multiformats/murmur3/esm/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@multiformats/murmur3/esm/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   murmur3128: () => (/* binding */ murmur3128),\n/* harmony export */   murmur332: () => (/* binding */ murmur332)\n/* harmony export */ });\n/* harmony import */ var multiformats_hashes_hasher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! multiformats/hashes/hasher */ \"(ssr)/./node_modules/multiformats/esm/src/hashes/hasher.js\");\n/* harmony import */ var multiformats__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! multiformats */ \"(ssr)/./node_modules/multiformats/esm/src/index.js\");\n/* harmony import */ var murmurhash3js_revisited__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! murmurhash3js-revisited */ \"(ssr)/./node_modules/murmurhash3js-revisited/index.js\");\n\n\n\nfunction fromNumberTo32BitBuf(number) {\n  const bytes = new Array(4);\n  for (let i = 0; i < 4; i++) {\n    bytes[i] = number & 255;\n    number = number >> 8;\n  }\n  return new Uint8Array(bytes);\n}\nconst murmur332 = (0,multiformats_hashes_hasher__WEBPACK_IMPORTED_MODULE_0__.from)({\n  name: 'murmur3-32',\n  code: 35,\n  encode: input => fromNumberTo32BitBuf(murmurhash3js_revisited__WEBPACK_IMPORTED_MODULE_2__.x86.hash32(input))\n});\nconst murmur3128 = (0,multiformats_hashes_hasher__WEBPACK_IMPORTED_MODULE_0__.from)({\n  name: 'murmur3-128',\n  code: 34,\n  encode: input => multiformats__WEBPACK_IMPORTED_MODULE_1__.bytes.fromHex(murmurhash3js_revisited__WEBPACK_IMPORTED_MODULE_2__.x64.hash128(input))\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvQG11bHRpZm9ybWF0cy9tdXJtdXIzL2VzbS9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFrRDtBQUNiO0FBQ0s7QUFDMUM7QUFDQTtBQUNBLGtCQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxrQkFBa0IsZ0VBQUk7QUFDN0I7QUFDQTtBQUNBLHdDQUF3Qyx3REFBTztBQUMvQyxDQUFDO0FBQ00sbUJBQW1CLGdFQUFJO0FBQzlCO0FBQ0E7QUFDQSxtQkFBbUIsdURBQWEsQ0FBQyx3REFBTztBQUN4QyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZC1tYW5kYXRlcy8uL25vZGVfbW9kdWxlcy9AbXVsdGlmb3JtYXRzL211cm11cjMvZXNtL2luZGV4LmpzPzdmNmEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZnJvbSB9IGZyb20gJ211bHRpZm9ybWF0cy9oYXNoZXMvaGFzaGVyJztcbmltcG9ydCB7IGJ5dGVzIH0gZnJvbSAnbXVsdGlmb3JtYXRzJztcbmltcG9ydCBtdXIgZnJvbSAnbXVybXVyaGFzaDNqcy1yZXZpc2l0ZWQnO1xuZnVuY3Rpb24gZnJvbU51bWJlclRvMzJCaXRCdWYobnVtYmVyKSB7XG4gIGNvbnN0IGJ5dGVzID0gbmV3IEFycmF5KDQpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgIGJ5dGVzW2ldID0gbnVtYmVyICYgMjU1O1xuICAgIG51bWJlciA9IG51bWJlciA+PiA4O1xuICB9XG4gIHJldHVybiBuZXcgVWludDhBcnJheShieXRlcyk7XG59XG5leHBvcnQgY29uc3QgbXVybXVyMzMyID0gZnJvbSh7XG4gIG5hbWU6ICdtdXJtdXIzLTMyJyxcbiAgY29kZTogMzUsXG4gIGVuY29kZTogaW5wdXQgPT4gZnJvbU51bWJlclRvMzJCaXRCdWYobXVyLng4Ni5oYXNoMzIoaW5wdXQpKVxufSk7XG5leHBvcnQgY29uc3QgbXVybXVyMzEyOCA9IGZyb20oe1xuICBuYW1lOiAnbXVybXVyMy0xMjgnLFxuICBjb2RlOiAzNCxcbiAgZW5jb2RlOiBpbnB1dCA9PiBieXRlcy5mcm9tSGV4KG11ci54NjQuaGFzaDEyOChpbnB1dCkpXG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/@multiformats/murmur3/esm/index.js\n");

/***/ })

};
;