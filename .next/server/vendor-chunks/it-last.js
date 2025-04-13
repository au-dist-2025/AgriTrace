"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/it-last";
exports.ids = ["vendor-chunks/it-last"];
exports.modules = {

/***/ "(ssr)/./node_modules/it-last/index.js":
/*!***************************************!*\
  !*** ./node_modules/it-last/index.js ***!
  \***************************************/
/***/ ((module) => {

eval("\n\n/**\n * Returns the last item of an (async) iterable, unless empty, in which case\n * return `undefined`.\n *\n * @template T\n * @param {AsyncIterable<T>|Iterable<T>} source\n */\nconst last = async (source) => {\n  let res\n\n  for await (const entry of source) {\n    res = entry\n  }\n\n  return res\n}\n\nmodule.exports = last\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXQtbGFzdC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBOEI7QUFDekM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZC1tYW5kYXRlcy8uL25vZGVfbW9kdWxlcy9pdC1sYXN0L2luZGV4LmpzPzRiOWUiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogUmV0dXJucyB0aGUgbGFzdCBpdGVtIG9mIGFuIChhc3luYykgaXRlcmFibGUsIHVubGVzcyBlbXB0eSwgaW4gd2hpY2ggY2FzZVxuICogcmV0dXJuIGB1bmRlZmluZWRgLlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0ge0FzeW5jSXRlcmFibGU8VD58SXRlcmFibGU8VD59IHNvdXJjZVxuICovXG5jb25zdCBsYXN0ID0gYXN5bmMgKHNvdXJjZSkgPT4ge1xuICBsZXQgcmVzXG5cbiAgZm9yIGF3YWl0IChjb25zdCBlbnRyeSBvZiBzb3VyY2UpIHtcbiAgICByZXMgPSBlbnRyeVxuICB9XG5cbiAgcmV0dXJuIHJlc1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxhc3RcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/it-last/index.js\n");

/***/ })

};
;