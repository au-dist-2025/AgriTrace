"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/ipfs-core-utils";
exports.ids = ["vendor-chunks/ipfs-core-utils"];
exports.modules = {

/***/ "(ssr)/./node_modules/ipfs-core-utils/esm/src/files/normalise-candidate-multiple.js":
/*!************************************************************************************!*\
  !*** ./node_modules/ipfs-core-utils/esm/src/files/normalise-candidate-multiple.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   normaliseCandidateMultiple: () => (/* binding */ normaliseCandidateMultiple)\n/* harmony export */ });\n/* harmony import */ var err_code__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! err-code */ \"(ssr)/./node_modules/err-code/index.js\");\n/* harmony import */ var browser_readablestream_to_it__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! browser-readablestream-to-it */ \"(ssr)/./node_modules/browser-readablestream-to-it/index.js\");\n/* harmony import */ var it_peekable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! it-peekable */ \"(ssr)/./node_modules/it-peekable/index.js\");\n/* harmony import */ var it_map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! it-map */ \"(ssr)/./node_modules/it-map/index.js\");\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils.js */ \"(ssr)/./node_modules/ipfs-core-utils/esm/src/files/utils.js\");\n/* harmony import */ var ipfs_unixfs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ipfs-unixfs */ \"(ssr)/./node_modules/ipfs-unixfs/esm/src/index.js\");\n\n\n\n\n\n\nasync function* normaliseCandidateMultiple(input, normaliseContent) {\n  if (typeof input === 'string' || input instanceof String || (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isBytes)(input) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isBlob)(input) || input._readableState) {\n    throw err_code__WEBPACK_IMPORTED_MODULE_0__(new Error('Unexpected input: single item passed - if you are using ipfs.addAll, please use ipfs.add instead'), 'ERR_UNEXPECTED_INPUT');\n  }\n  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isReadableStream)(input)) {\n    input = browser_readablestream_to_it__WEBPACK_IMPORTED_MODULE_1__(input);\n  }\n  if (Symbol.iterator in input || Symbol.asyncIterator in input) {\n    const peekable = it_peekable__WEBPACK_IMPORTED_MODULE_2__(input);\n    const {value, done} = await peekable.peek();\n    if (done) {\n      yield* [];\n      return;\n    }\n    peekable.push(value);\n    if (Number.isInteger(value)) {\n      throw err_code__WEBPACK_IMPORTED_MODULE_0__(new Error('Unexpected input: single item passed - if you are using ipfs.addAll, please use ipfs.add instead'), 'ERR_UNEXPECTED_INPUT');\n    }\n    if (value._readableState) {\n      yield* it_map__WEBPACK_IMPORTED_MODULE_3__(peekable, value => toFileObject({ content: value }, normaliseContent));\n      return;\n    }\n    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isBytes)(value)) {\n      yield toFileObject({ content: peekable }, normaliseContent);\n      return;\n    }\n    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isFileObject)(value) || value[Symbol.iterator] || value[Symbol.asyncIterator] || (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isReadableStream)(value) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isBlob)(value)) {\n      yield* it_map__WEBPACK_IMPORTED_MODULE_3__(peekable, value => toFileObject(value, normaliseContent));\n      return;\n    }\n  }\n  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.isFileObject)(input)) {\n    throw err_code__WEBPACK_IMPORTED_MODULE_0__(new Error('Unexpected input: single item passed - if you are using ipfs.addAll, please use ipfs.add instead'), 'ERR_UNEXPECTED_INPUT');\n  }\n  throw err_code__WEBPACK_IMPORTED_MODULE_0__(new Error('Unexpected input: ' + typeof input), 'ERR_UNEXPECTED_INPUT');\n}\nasync function toFileObject(input, normaliseContent) {\n  const {path, mode, mtime, content} = input;\n  const file = {\n    path: path || '',\n    mode: (0,ipfs_unixfs__WEBPACK_IMPORTED_MODULE_5__.parseMode)(mode),\n    mtime: (0,ipfs_unixfs__WEBPACK_IMPORTED_MODULE_5__.parseMtime)(mtime)\n  };\n  if (content) {\n    file.content = await normaliseContent(content);\n  } else if (!path) {\n    file.content = await normaliseContent(input);\n  }\n  return file;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXBmcy1jb3JlLXV0aWxzL2VzbS9zcmMvZmlsZXMvbm9ybWFsaXNlLWNhbmRpZGF0ZS1tdWx0aXBsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQStCO0FBQzhCO0FBQ3hCO0FBQ1o7QUFNTDtBQUlDO0FBQ2Q7QUFDUCw4REFBOEQsa0RBQU8sV0FBVyxpREFBTTtBQUN0RixVQUFVLHFDQUFPO0FBQ2pCO0FBQ0EsTUFBTSwyREFBZ0I7QUFDdEIsWUFBWSx5REFBaUI7QUFDN0I7QUFDQTtBQUNBLHFCQUFxQix3Q0FBVTtBQUMvQixXQUFXLGFBQWE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxxQ0FBTztBQUNuQjtBQUNBO0FBQ0EsYUFBYSxtQ0FBRyxtQ0FBbUMsZ0JBQWdCO0FBQ25FO0FBQ0E7QUFDQSxRQUFRLGtEQUFPO0FBQ2YsMkJBQTJCLG1CQUFtQjtBQUM5QztBQUNBO0FBQ0EsUUFBUSx1REFBWSxvRUFBb0UsMkRBQWdCLFdBQVcsaURBQU07QUFDekgsYUFBYSxtQ0FBRztBQUNoQjtBQUNBO0FBQ0E7QUFDQSxNQUFNLHVEQUFZO0FBQ2xCLFVBQVUscUNBQU87QUFDakI7QUFDQSxRQUFRLHFDQUFPO0FBQ2Y7QUFDQTtBQUNBLFNBQVMsNEJBQTRCO0FBQ3JDO0FBQ0E7QUFDQSxVQUFVLHNEQUFTO0FBQ25CLFdBQVcsdURBQVU7QUFDckI7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZC1tYW5kYXRlcy8uL25vZGVfbW9kdWxlcy9pcGZzLWNvcmUtdXRpbHMvZXNtL3NyYy9maWxlcy9ub3JtYWxpc2UtY2FuZGlkYXRlLW11bHRpcGxlLmpzP2ZmMGEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVyckNvZGUgZnJvbSAnZXJyLWNvZGUnO1xuaW1wb3J0IGJyb3dzZXJTdHJlYW1Ub0l0IGZyb20gJ2Jyb3dzZXItcmVhZGFibGVzdHJlYW0tdG8taXQnO1xuaW1wb3J0IGl0UGVla2FibGUgZnJvbSAnaXQtcGVla2FibGUnO1xuaW1wb3J0IG1hcCBmcm9tICdpdC1tYXAnO1xuaW1wb3J0IHtcbiAgaXNCeXRlcyxcbiAgaXNCbG9iLFxuICBpc1JlYWRhYmxlU3RyZWFtLFxuICBpc0ZpbGVPYmplY3Rcbn0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQge1xuICBwYXJzZU10aW1lLFxuICBwYXJzZU1vZGVcbn0gZnJvbSAnaXBmcy11bml4ZnMnO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uKiBub3JtYWxpc2VDYW5kaWRhdGVNdWx0aXBsZShpbnB1dCwgbm9ybWFsaXNlQ29udGVudCkge1xuICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyB8fCBpbnB1dCBpbnN0YW5jZW9mIFN0cmluZyB8fCBpc0J5dGVzKGlucHV0KSB8fCBpc0Jsb2IoaW5wdXQpIHx8IGlucHV0Ll9yZWFkYWJsZVN0YXRlKSB7XG4gICAgdGhyb3cgZXJyQ29kZShuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgaW5wdXQ6IHNpbmdsZSBpdGVtIHBhc3NlZCAtIGlmIHlvdSBhcmUgdXNpbmcgaXBmcy5hZGRBbGwsIHBsZWFzZSB1c2UgaXBmcy5hZGQgaW5zdGVhZCcpLCAnRVJSX1VORVhQRUNURURfSU5QVVQnKTtcbiAgfVxuICBpZiAoaXNSZWFkYWJsZVN0cmVhbShpbnB1dCkpIHtcbiAgICBpbnB1dCA9IGJyb3dzZXJTdHJlYW1Ub0l0KGlucHV0KTtcbiAgfVxuICBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIGlucHV0IHx8IFN5bWJvbC5hc3luY0l0ZXJhdG9yIGluIGlucHV0KSB7XG4gICAgY29uc3QgcGVla2FibGUgPSBpdFBlZWthYmxlKGlucHV0KTtcbiAgICBjb25zdCB7dmFsdWUsIGRvbmV9ID0gYXdhaXQgcGVla2FibGUucGVlaygpO1xuICAgIGlmIChkb25lKSB7XG4gICAgICB5aWVsZCogW107XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHBlZWthYmxlLnB1c2godmFsdWUpO1xuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgdGhyb3cgZXJyQ29kZShuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgaW5wdXQ6IHNpbmdsZSBpdGVtIHBhc3NlZCAtIGlmIHlvdSBhcmUgdXNpbmcgaXBmcy5hZGRBbGwsIHBsZWFzZSB1c2UgaXBmcy5hZGQgaW5zdGVhZCcpLCAnRVJSX1VORVhQRUNURURfSU5QVVQnKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLl9yZWFkYWJsZVN0YXRlKSB7XG4gICAgICB5aWVsZCogbWFwKHBlZWthYmxlLCB2YWx1ZSA9PiB0b0ZpbGVPYmplY3QoeyBjb250ZW50OiB2YWx1ZSB9LCBub3JtYWxpc2VDb250ZW50KSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc0J5dGVzKHZhbHVlKSkge1xuICAgICAgeWllbGQgdG9GaWxlT2JqZWN0KHsgY29udGVudDogcGVla2FibGUgfSwgbm9ybWFsaXNlQ29udGVudCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc0ZpbGVPYmplY3QodmFsdWUpIHx8IHZhbHVlW1N5bWJvbC5pdGVyYXRvcl0gfHwgdmFsdWVbU3ltYm9sLmFzeW5jSXRlcmF0b3JdIHx8IGlzUmVhZGFibGVTdHJlYW0odmFsdWUpIHx8IGlzQmxvYih2YWx1ZSkpIHtcbiAgICAgIHlpZWxkKiBtYXAocGVla2FibGUsIHZhbHVlID0+IHRvRmlsZU9iamVjdCh2YWx1ZSwgbm9ybWFsaXNlQ29udGVudCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBpZiAoaXNGaWxlT2JqZWN0KGlucHV0KSkge1xuICAgIHRocm93IGVyckNvZGUobmV3IEVycm9yKCdVbmV4cGVjdGVkIGlucHV0OiBzaW5nbGUgaXRlbSBwYXNzZWQgLSBpZiB5b3UgYXJlIHVzaW5nIGlwZnMuYWRkQWxsLCBwbGVhc2UgdXNlIGlwZnMuYWRkIGluc3RlYWQnKSwgJ0VSUl9VTkVYUEVDVEVEX0lOUFVUJyk7XG4gIH1cbiAgdGhyb3cgZXJyQ29kZShuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgaW5wdXQ6ICcgKyB0eXBlb2YgaW5wdXQpLCAnRVJSX1VORVhQRUNURURfSU5QVVQnKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHRvRmlsZU9iamVjdChpbnB1dCwgbm9ybWFsaXNlQ29udGVudCkge1xuICBjb25zdCB7cGF0aCwgbW9kZSwgbXRpbWUsIGNvbnRlbnR9ID0gaW5wdXQ7XG4gIGNvbnN0IGZpbGUgPSB7XG4gICAgcGF0aDogcGF0aCB8fCAnJyxcbiAgICBtb2RlOiBwYXJzZU1vZGUobW9kZSksXG4gICAgbXRpbWU6IHBhcnNlTXRpbWUobXRpbWUpXG4gIH07XG4gIGlmIChjb250ZW50KSB7XG4gICAgZmlsZS5jb250ZW50ID0gYXdhaXQgbm9ybWFsaXNlQ29udGVudChjb250ZW50KTtcbiAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgIGZpbGUuY29udGVudCA9IGF3YWl0IG5vcm1hbGlzZUNvbnRlbnQoaW5wdXQpO1xuICB9XG4gIHJldHVybiBmaWxlO1xufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/ipfs-core-utils/esm/src/files/normalise-candidate-multiple.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/ipfs-core-utils/esm/src/files/normalise-candidate-single.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/ipfs-core-utils/esm/src/files/normalise-candidate-single.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   normaliseCandidateSingle: () => (/* binding */ normaliseCandidateSingle)\n/* harmony export */ });\n/* harmony import */ var err_code__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! err-code */ \"(ssr)/./node_modules/err-code/index.js\");\n/* harmony import */ var browser_readablestream_to_it__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! browser-readablestream-to-it */ \"(ssr)/./node_modules/browser-readablestream-to-it/index.js\");\n/* harmony import */ var it_peekable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! it-peekable */ \"(ssr)/./node_modules/it-peekable/index.js\");\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ \"(ssr)/./node_modules/ipfs-core-utils/esm/src/files/utils.js\");\n/* harmony import */ var ipfs_unixfs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ipfs-unixfs */ \"(ssr)/./node_modules/ipfs-unixfs/esm/src/index.js\");\n\n\n\n\n\nasync function* normaliseCandidateSingle(input, normaliseContent) {\n  if (input === null || input === undefined) {\n    throw err_code__WEBPACK_IMPORTED_MODULE_0__(new Error(`Unexpected input: ${ input }`), 'ERR_UNEXPECTED_INPUT');\n  }\n  if (typeof input === 'string' || input instanceof String) {\n    yield toFileObject(input.toString(), normaliseContent);\n    return;\n  }\n  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isBytes)(input) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isBlob)(input)) {\n    yield toFileObject(input, normaliseContent);\n    return;\n  }\n  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isReadableStream)(input)) {\n    input = browser_readablestream_to_it__WEBPACK_IMPORTED_MODULE_1__(input);\n  }\n  if (Symbol.iterator in input || Symbol.asyncIterator in input) {\n    const peekable = it_peekable__WEBPACK_IMPORTED_MODULE_2__(input);\n    const {value, done} = await peekable.peek();\n    if (done) {\n      yield { content: [] };\n      return;\n    }\n    peekable.push(value);\n    if (Number.isInteger(value) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isBytes)(value) || typeof value === 'string' || value instanceof String) {\n      yield toFileObject(peekable, normaliseContent);\n      return;\n    }\n    throw err_code__WEBPACK_IMPORTED_MODULE_0__(new Error('Unexpected input: multiple items passed - if you are using ipfs.add, please use ipfs.addAll instead'), 'ERR_UNEXPECTED_INPUT');\n  }\n  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFileObject)(input)) {\n    yield toFileObject(input, normaliseContent);\n    return;\n  }\n  throw err_code__WEBPACK_IMPORTED_MODULE_0__(new Error('Unexpected input: cannot convert \"' + typeof input + '\" into ImportCandidate'), 'ERR_UNEXPECTED_INPUT');\n}\nasync function toFileObject(input, normaliseContent) {\n  const {path, mode, mtime, content} = input;\n  const file = {\n    path: path || '',\n    mode: (0,ipfs_unixfs__WEBPACK_IMPORTED_MODULE_4__.parseMode)(mode),\n    mtime: (0,ipfs_unixfs__WEBPACK_IMPORTED_MODULE_4__.parseMtime)(mtime)\n  };\n  if (content) {\n    file.content = await normaliseContent(content);\n  } else if (!path) {\n    file.content = await normaliseContent(input);\n  }\n  return file;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXBmcy1jb3JlLXV0aWxzL2VzbS9zcmMvZmlsZXMvbm9ybWFsaXNlLWNhbmRpZGF0ZS1zaW5nbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQStCO0FBQzhCO0FBQ3hCO0FBTWpCO0FBSUM7QUFDZDtBQUNQO0FBQ0EsVUFBVSxxQ0FBTyxpQ0FBaUMsT0FBTztBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxrREFBTyxXQUFXLGlEQUFNO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLE1BQU0sMkRBQWdCO0FBQ3RCLFlBQVkseURBQWlCO0FBQzdCO0FBQ0E7QUFDQSxxQkFBcUIsd0NBQVU7QUFDL0IsV0FBVyxhQUFhO0FBQ3hCO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxrREFBTztBQUMxQztBQUNBO0FBQ0E7QUFDQSxVQUFVLHFDQUFPO0FBQ2pCO0FBQ0EsTUFBTSx1REFBWTtBQUNsQjtBQUNBO0FBQ0E7QUFDQSxRQUFRLHFDQUFPO0FBQ2Y7QUFDQTtBQUNBLFNBQVMsNEJBQTRCO0FBQ3JDO0FBQ0E7QUFDQSxVQUFVLHNEQUFTO0FBQ25CLFdBQVcsdURBQVU7QUFDckI7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZC1tYW5kYXRlcy8uL25vZGVfbW9kdWxlcy9pcGZzLWNvcmUtdXRpbHMvZXNtL3NyYy9maWxlcy9ub3JtYWxpc2UtY2FuZGlkYXRlLXNpbmdsZS5qcz9iMmE0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlcnJDb2RlIGZyb20gJ2Vyci1jb2RlJztcbmltcG9ydCBicm93c2VyU3RyZWFtVG9JdCBmcm9tICdicm93c2VyLXJlYWRhYmxlc3RyZWFtLXRvLWl0JztcbmltcG9ydCBpdFBlZWthYmxlIGZyb20gJ2l0LXBlZWthYmxlJztcbmltcG9ydCB7XG4gIGlzQnl0ZXMsXG4gIGlzQmxvYixcbiAgaXNSZWFkYWJsZVN0cmVhbSxcbiAgaXNGaWxlT2JqZWN0XG59IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtcbiAgcGFyc2VNdGltZSxcbiAgcGFyc2VNb2RlXG59IGZyb20gJ2lwZnMtdW5peGZzJztcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiogbm9ybWFsaXNlQ2FuZGlkYXRlU2luZ2xlKGlucHV0LCBub3JtYWxpc2VDb250ZW50KSB7XG4gIGlmIChpbnB1dCA9PT0gbnVsbCB8fCBpbnB1dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgZXJyQ29kZShuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgaW5wdXQ6ICR7IGlucHV0IH1gKSwgJ0VSUl9VTkVYUEVDVEVEX0lOUFVUJyk7XG4gIH1cbiAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgfHwgaW5wdXQgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICB5aWVsZCB0b0ZpbGVPYmplY3QoaW5wdXQudG9TdHJpbmcoKSwgbm9ybWFsaXNlQ29udGVudCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChpc0J5dGVzKGlucHV0KSB8fCBpc0Jsb2IoaW5wdXQpKSB7XG4gICAgeWllbGQgdG9GaWxlT2JqZWN0KGlucHV0LCBub3JtYWxpc2VDb250ZW50KTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGlzUmVhZGFibGVTdHJlYW0oaW5wdXQpKSB7XG4gICAgaW5wdXQgPSBicm93c2VyU3RyZWFtVG9JdChpbnB1dCk7XG4gIH1cbiAgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBpbnB1dCB8fCBTeW1ib2wuYXN5bmNJdGVyYXRvciBpbiBpbnB1dCkge1xuICAgIGNvbnN0IHBlZWthYmxlID0gaXRQZWVrYWJsZShpbnB1dCk7XG4gICAgY29uc3Qge3ZhbHVlLCBkb25lfSA9IGF3YWl0IHBlZWthYmxlLnBlZWsoKTtcbiAgICBpZiAoZG9uZSkge1xuICAgICAgeWllbGQgeyBjb250ZW50OiBbXSB9O1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwZWVrYWJsZS5wdXNoKHZhbHVlKTtcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkgfHwgaXNCeXRlcyh2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgeWllbGQgdG9GaWxlT2JqZWN0KHBlZWthYmxlLCBub3JtYWxpc2VDb250ZW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhyb3cgZXJyQ29kZShuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgaW5wdXQ6IG11bHRpcGxlIGl0ZW1zIHBhc3NlZCAtIGlmIHlvdSBhcmUgdXNpbmcgaXBmcy5hZGQsIHBsZWFzZSB1c2UgaXBmcy5hZGRBbGwgaW5zdGVhZCcpLCAnRVJSX1VORVhQRUNURURfSU5QVVQnKTtcbiAgfVxuICBpZiAoaXNGaWxlT2JqZWN0KGlucHV0KSkge1xuICAgIHlpZWxkIHRvRmlsZU9iamVjdChpbnB1dCwgbm9ybWFsaXNlQ29udGVudCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRocm93IGVyckNvZGUobmV3IEVycm9yKCdVbmV4cGVjdGVkIGlucHV0OiBjYW5ub3QgY29udmVydCBcIicgKyB0eXBlb2YgaW5wdXQgKyAnXCIgaW50byBJbXBvcnRDYW5kaWRhdGUnKSwgJ0VSUl9VTkVYUEVDVEVEX0lOUFVUJyk7XG59XG5hc3luYyBmdW5jdGlvbiB0b0ZpbGVPYmplY3QoaW5wdXQsIG5vcm1hbGlzZUNvbnRlbnQpIHtcbiAgY29uc3Qge3BhdGgsIG1vZGUsIG10aW1lLCBjb250ZW50fSA9IGlucHV0O1xuICBjb25zdCBmaWxlID0ge1xuICAgIHBhdGg6IHBhdGggfHwgJycsXG4gICAgbW9kZTogcGFyc2VNb2RlKG1vZGUpLFxuICAgIG10aW1lOiBwYXJzZU10aW1lKG10aW1lKVxuICB9O1xuICBpZiAoY29udGVudCkge1xuICAgIGZpbGUuY29udGVudCA9IGF3YWl0IG5vcm1hbGlzZUNvbnRlbnQoY29udGVudCk7XG4gIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICBmaWxlLmNvbnRlbnQgPSBhd2FpdCBub3JtYWxpc2VDb250ZW50KGlucHV0KTtcbiAgfVxuICByZXR1cm4gZmlsZTtcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/ipfs-core-utils/esm/src/files/normalise-candidate-single.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/ipfs-core-utils/esm/src/files/normalise-content.js":
/*!*************************************************************************!*\
  !*** ./node_modules/ipfs-core-utils/esm/src/files/normalise-content.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   normaliseContent: () => (/* binding */ normaliseContent)\n/* harmony export */ });\n/* harmony import */ var err_code__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! err-code */ \"(ssr)/./node_modules/err-code/index.js\");\n/* harmony import */ var uint8arrays_from_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uint8arrays/from-string */ \"(ssr)/./node_modules/uint8arrays/esm/src/from-string.js\");\n/* harmony import */ var browser_readablestream_to_it__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! browser-readablestream-to-it */ \"(ssr)/./node_modules/browser-readablestream-to-it/index.js\");\n/* harmony import */ var blob_to_it__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! blob-to-it */ \"(ssr)/./node_modules/blob-to-it/index.js\");\n/* harmony import */ var it_peekable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! it-peekable */ \"(ssr)/./node_modules/it-peekable/index.js\");\n/* harmony import */ var it_all__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! it-all */ \"(ssr)/./node_modules/it-all/index.js\");\n/* harmony import */ var it_map__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! it-map */ \"(ssr)/./node_modules/it-map/index.js\");\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils.js */ \"(ssr)/./node_modules/ipfs-core-utils/esm/src/files/utils.js\");\n\n\n\n\n\n\n\n\nasync function* toAsyncIterable(thing) {\n  yield thing;\n}\nasync function normaliseContent(input) {\n  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.isBytes)(input)) {\n    return toAsyncIterable(toBytes(input));\n  }\n  if (typeof input === 'string' || input instanceof String) {\n    return toAsyncIterable(toBytes(input.toString()));\n  }\n  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.isBlob)(input)) {\n    return blob_to_it__WEBPACK_IMPORTED_MODULE_3__(input);\n  }\n  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.isReadableStream)(input)) {\n    input = browser_readablestream_to_it__WEBPACK_IMPORTED_MODULE_2__(input);\n  }\n  if (Symbol.iterator in input || Symbol.asyncIterator in input) {\n    const peekable = it_peekable__WEBPACK_IMPORTED_MODULE_4__(input);\n    const {value, done} = await peekable.peek();\n    if (done) {\n      return toAsyncIterable(new Uint8Array(0));\n    }\n    peekable.push(value);\n    if (Number.isInteger(value)) {\n      return toAsyncIterable(Uint8Array.from(await it_all__WEBPACK_IMPORTED_MODULE_5__(peekable)));\n    }\n    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.isBytes)(value) || typeof value === 'string' || value instanceof String) {\n      return it_map__WEBPACK_IMPORTED_MODULE_6__(peekable, toBytes);\n    }\n  }\n  throw err_code__WEBPACK_IMPORTED_MODULE_0__(new Error(`Unexpected input: ${ input }`), 'ERR_UNEXPECTED_INPUT');\n}\nfunction toBytes(chunk) {\n  if (chunk instanceof Uint8Array) {\n    return chunk;\n  }\n  if (ArrayBuffer.isView(chunk)) {\n    return new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);\n  }\n  if (chunk instanceof ArrayBuffer) {\n    return new Uint8Array(chunk);\n  }\n  if (Array.isArray(chunk)) {\n    return Uint8Array.from(chunk);\n  }\n  return (0,uint8arrays_from_string__WEBPACK_IMPORTED_MODULE_1__.fromString)(chunk.toString());\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXBmcy1jb3JlLXV0aWxzL2VzbS9zcmMvZmlsZXMvbm9ybWFsaXNlLWNvbnRlbnQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQStCO0FBQzhDO0FBQ2hCO0FBQzNCO0FBQ0c7QUFDWjtBQUNBO0FBS0w7QUFDcEI7QUFDQTtBQUNBO0FBQ087QUFDUCxNQUFNLGtEQUFPO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0saURBQU07QUFDWixXQUFXLHVDQUFRO0FBQ25CO0FBQ0EsTUFBTSwyREFBZ0I7QUFDdEIsWUFBWSx5REFBaUI7QUFDN0I7QUFDQTtBQUNBLHFCQUFxQix3Q0FBVTtBQUMvQixXQUFXLGFBQWE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxtQ0FBRztBQUN0RDtBQUNBLFFBQVEsa0RBQU87QUFDZixhQUFhLG1DQUFHO0FBQ2hCO0FBQ0E7QUFDQSxRQUFRLHFDQUFPLGlDQUFpQyxPQUFPO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLG1FQUFvQjtBQUM3QiIsInNvdXJjZXMiOlsid2VicGFjazovL2QtbWFuZGF0ZXMvLi9ub2RlX21vZHVsZXMvaXBmcy1jb3JlLXV0aWxzL2VzbS9zcmMvZmlsZXMvbm9ybWFsaXNlLWNvbnRlbnQuanM/MTMzMCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXJyQ29kZSBmcm9tICdlcnItY29kZSc7XG5pbXBvcnQgeyBmcm9tU3RyaW5nIGFzIHVpbnQ4QXJyYXlGcm9tU3RyaW5nIH0gZnJvbSAndWludDhhcnJheXMvZnJvbS1zdHJpbmcnO1xuaW1wb3J0IGJyb3dzZXJTdHJlYW1Ub0l0IGZyb20gJ2Jyb3dzZXItcmVhZGFibGVzdHJlYW0tdG8taXQnO1xuaW1wb3J0IGJsb2JUb0l0IGZyb20gJ2Jsb2ItdG8taXQnO1xuaW1wb3J0IGl0UGVla2FibGUgZnJvbSAnaXQtcGVla2FibGUnO1xuaW1wb3J0IGFsbCBmcm9tICdpdC1hbGwnO1xuaW1wb3J0IG1hcCBmcm9tICdpdC1tYXAnO1xuaW1wb3J0IHtcbiAgaXNCeXRlcyxcbiAgaXNSZWFkYWJsZVN0cmVhbSxcbiAgaXNCbG9iXG59IGZyb20gJy4vdXRpbHMuanMnO1xuYXN5bmMgZnVuY3Rpb24qIHRvQXN5bmNJdGVyYWJsZSh0aGluZykge1xuICB5aWVsZCB0aGluZztcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBub3JtYWxpc2VDb250ZW50KGlucHV0KSB7XG4gIGlmIChpc0J5dGVzKGlucHV0KSkge1xuICAgIHJldHVybiB0b0FzeW5jSXRlcmFibGUodG9CeXRlcyhpbnB1dCkpO1xuICB9XG4gIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnIHx8IGlucHV0IGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgcmV0dXJuIHRvQXN5bmNJdGVyYWJsZSh0b0J5dGVzKGlucHV0LnRvU3RyaW5nKCkpKTtcbiAgfVxuICBpZiAoaXNCbG9iKGlucHV0KSkge1xuICAgIHJldHVybiBibG9iVG9JdChpbnB1dCk7XG4gIH1cbiAgaWYgKGlzUmVhZGFibGVTdHJlYW0oaW5wdXQpKSB7XG4gICAgaW5wdXQgPSBicm93c2VyU3RyZWFtVG9JdChpbnB1dCk7XG4gIH1cbiAgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBpbnB1dCB8fCBTeW1ib2wuYXN5bmNJdGVyYXRvciBpbiBpbnB1dCkge1xuICAgIGNvbnN0IHBlZWthYmxlID0gaXRQZWVrYWJsZShpbnB1dCk7XG4gICAgY29uc3Qge3ZhbHVlLCBkb25lfSA9IGF3YWl0IHBlZWthYmxlLnBlZWsoKTtcbiAgICBpZiAoZG9uZSkge1xuICAgICAgcmV0dXJuIHRvQXN5bmNJdGVyYWJsZShuZXcgVWludDhBcnJheSgwKSk7XG4gICAgfVxuICAgIHBlZWthYmxlLnB1c2godmFsdWUpO1xuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHRvQXN5bmNJdGVyYWJsZShVaW50OEFycmF5LmZyb20oYXdhaXQgYWxsKHBlZWthYmxlKSkpO1xuICAgIH1cbiAgICBpZiAoaXNCeXRlcyh2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgcmV0dXJuIG1hcChwZWVrYWJsZSwgdG9CeXRlcyk7XG4gICAgfVxuICB9XG4gIHRocm93IGVyckNvZGUobmV3IEVycm9yKGBVbmV4cGVjdGVkIGlucHV0OiAkeyBpbnB1dCB9YCksICdFUlJfVU5FWFBFQ1RFRF9JTlBVVCcpO1xufVxuZnVuY3Rpb24gdG9CeXRlcyhjaHVuaykge1xuICBpZiAoY2h1bmsgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgcmV0dXJuIGNodW5rO1xuICB9XG4gIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoY2h1bmspKSB7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGNodW5rLmJ1ZmZlciwgY2h1bmsuYnl0ZU9mZnNldCwgY2h1bmsuYnl0ZUxlbmd0aCk7XG4gIH1cbiAgaWYgKGNodW5rIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoY2h1bmspO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KGNodW5rKSkge1xuICAgIHJldHVybiBVaW50OEFycmF5LmZyb20oY2h1bmspO1xuICB9XG4gIHJldHVybiB1aW50OEFycmF5RnJvbVN0cmluZyhjaHVuay50b1N0cmluZygpKTtcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/ipfs-core-utils/esm/src/files/normalise-content.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/ipfs-core-utils/esm/src/files/normalise-input-multiple.js":
/*!********************************************************************************!*\
  !*** ./node_modules/ipfs-core-utils/esm/src/files/normalise-input-multiple.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   normaliseInput: () => (/* binding */ normaliseInput)\n/* harmony export */ });\n/* harmony import */ var _normalise_content_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./normalise-content.js */ \"(ssr)/./node_modules/ipfs-core-utils/esm/src/files/normalise-content.js\");\n/* harmony import */ var _normalise_candidate_multiple_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./normalise-candidate-multiple.js */ \"(ssr)/./node_modules/ipfs-core-utils/esm/src/files/normalise-candidate-multiple.js\");\n\n\nfunction normaliseInput(input) {\n  return (0,_normalise_candidate_multiple_js__WEBPACK_IMPORTED_MODULE_1__.normaliseCandidateMultiple)(input, _normalise_content_js__WEBPACK_IMPORTED_MODULE_0__.normaliseContent);\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXBmcy1jb3JlLXV0aWxzL2VzbS9zcmMvZmlsZXMvbm9ybWFsaXNlLWlucHV0LW11bHRpcGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEwRDtBQUNxQjtBQUN4RTtBQUNQLFNBQVMsNEZBQTBCLFFBQVEsbUVBQWdCO0FBQzNEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZC1tYW5kYXRlcy8uL25vZGVfbW9kdWxlcy9pcGZzLWNvcmUtdXRpbHMvZXNtL3NyYy9maWxlcy9ub3JtYWxpc2UtaW5wdXQtbXVsdGlwbGUuanM/YTc4OSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBub3JtYWxpc2VDb250ZW50IH0gZnJvbSAnLi9ub3JtYWxpc2UtY29udGVudC5qcyc7XG5pbXBvcnQgeyBub3JtYWxpc2VDYW5kaWRhdGVNdWx0aXBsZSB9IGZyb20gJy4vbm9ybWFsaXNlLWNhbmRpZGF0ZS1tdWx0aXBsZS5qcyc7XG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXNlSW5wdXQoaW5wdXQpIHtcbiAgcmV0dXJuIG5vcm1hbGlzZUNhbmRpZGF0ZU11bHRpcGxlKGlucHV0LCBub3JtYWxpc2VDb250ZW50KTtcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/ipfs-core-utils/esm/src/files/normalise-input-multiple.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/ipfs-core-utils/esm/src/files/normalise-input-single.js":
/*!******************************************************************************!*\
  !*** ./node_modules/ipfs-core-utils/esm/src/files/normalise-input-single.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   normaliseInput: () => (/* binding */ normaliseInput)\n/* harmony export */ });\n/* harmony import */ var _normalise_content_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./normalise-content.js */ \"(ssr)/./node_modules/ipfs-core-utils/esm/src/files/normalise-content.js\");\n/* harmony import */ var _normalise_candidate_single_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./normalise-candidate-single.js */ \"(ssr)/./node_modules/ipfs-core-utils/esm/src/files/normalise-candidate-single.js\");\n\n\nfunction normaliseInput(input) {\n  return (0,_normalise_candidate_single_js__WEBPACK_IMPORTED_MODULE_1__.normaliseCandidateSingle)(input, _normalise_content_js__WEBPACK_IMPORTED_MODULE_0__.normaliseContent);\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXBmcy1jb3JlLXV0aWxzL2VzbS9zcmMvZmlsZXMvbm9ybWFsaXNlLWlucHV0LXNpbmdsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBMEQ7QUFDaUI7QUFDcEU7QUFDUCxTQUFTLHdGQUF3QixRQUFRLG1FQUFnQjtBQUN6RCIsInNvdXJjZXMiOlsid2VicGFjazovL2QtbWFuZGF0ZXMvLi9ub2RlX21vZHVsZXMvaXBmcy1jb3JlLXV0aWxzL2VzbS9zcmMvZmlsZXMvbm9ybWFsaXNlLWlucHV0LXNpbmdsZS5qcz9lMzdmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG5vcm1hbGlzZUNvbnRlbnQgfSBmcm9tICcuL25vcm1hbGlzZS1jb250ZW50LmpzJztcbmltcG9ydCB7IG5vcm1hbGlzZUNhbmRpZGF0ZVNpbmdsZSB9IGZyb20gJy4vbm9ybWFsaXNlLWNhbmRpZGF0ZS1zaW5nbGUuanMnO1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGlzZUlucHV0KGlucHV0KSB7XG4gIHJldHVybiBub3JtYWxpc2VDYW5kaWRhdGVTaW5nbGUoaW5wdXQsIG5vcm1hbGlzZUNvbnRlbnQpO1xufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/ipfs-core-utils/esm/src/files/normalise-input-single.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/ipfs-core-utils/esm/src/files/utils.js":
/*!*************************************************************!*\
  !*** ./node_modules/ipfs-core-utils/esm/src/files/utils.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   isBlob: () => (/* binding */ isBlob),\n/* harmony export */   isBytes: () => (/* binding */ isBytes),\n/* harmony export */   isFileObject: () => (/* binding */ isFileObject),\n/* harmony export */   isReadableStream: () => (/* binding */ isReadableStream)\n/* harmony export */ });\nfunction isBytes(obj) {\n  return ArrayBuffer.isView(obj) || obj instanceof ArrayBuffer;\n}\nfunction isBlob(obj) {\n  return obj.constructor && (obj.constructor.name === 'Blob' || obj.constructor.name === 'File') && typeof obj.stream === 'function';\n}\nfunction isFileObject(obj) {\n  return typeof obj === 'object' && (obj.path || obj.content);\n}\nconst isReadableStream = value => value && typeof value.getReader === 'function';//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXBmcy1jb3JlLXV0aWxzL2VzbS9zcmMvZmlsZXMvdXRpbHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNPIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZC1tYW5kYXRlcy8uL25vZGVfbW9kdWxlcy9pcGZzLWNvcmUtdXRpbHMvZXNtL3NyYy9maWxlcy91dGlscy5qcz80ZDUyIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBpc0J5dGVzKG9iaikge1xuICByZXR1cm4gQXJyYXlCdWZmZXIuaXNWaWV3KG9iaikgfHwgb2JqIGluc3RhbmNlb2YgQXJyYXlCdWZmZXI7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNCbG9iKG9iaikge1xuICByZXR1cm4gb2JqLmNvbnN0cnVjdG9yICYmIChvYmouY29uc3RydWN0b3IubmFtZSA9PT0gJ0Jsb2InIHx8IG9iai5jb25zdHJ1Y3Rvci5uYW1lID09PSAnRmlsZScpICYmIHR5cGVvZiBvYmouc3RyZWFtID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzRmlsZU9iamVjdChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIChvYmoucGF0aCB8fCBvYmouY29udGVudCk7XG59XG5leHBvcnQgY29uc3QgaXNSZWFkYWJsZVN0cmVhbSA9IHZhbHVlID0+IHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5nZXRSZWFkZXIgPT09ICdmdW5jdGlvbic7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/ipfs-core-utils/esm/src/files/utils.js\n");

/***/ })

};
;