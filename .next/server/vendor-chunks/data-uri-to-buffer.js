"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/data-uri-to-buffer";
exports.ids = ["vendor-chunks/data-uri-to-buffer"];
exports.modules = {

/***/ "(ssr)/./node_modules/data-uri-to-buffer/dist/src/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/data-uri-to-buffer/dist/src/index.js ***!
  \***********************************************************/
/***/ ((module) => {

eval("\n/**\n * Returns a `Buffer` instance from the given data URI `uri`.\n *\n * @param {String} uri Data URI to turn into a Buffer instance\n * @return {Buffer} Buffer instance from Data URI\n * @api public\n */\nfunction dataUriToBuffer(uri) {\n    if (!/^data:/i.test(uri)) {\n        throw new TypeError('`uri` does not appear to be a Data URI (must begin with \"data:\")');\n    }\n    // strip newlines\n    uri = uri.replace(/\\r?\\n/g, '');\n    // split the URI up into the \"metadata\" and the \"data\" portions\n    const firstComma = uri.indexOf(',');\n    if (firstComma === -1 || firstComma <= 4) {\n        throw new TypeError('malformed data: URI');\n    }\n    // remove the \"data:\" scheme and parse the metadata\n    const meta = uri.substring(5, firstComma).split(';');\n    let charset = '';\n    let base64 = false;\n    const type = meta[0] || 'text/plain';\n    let typeFull = type;\n    for (let i = 1; i < meta.length; i++) {\n        if (meta[i] === 'base64') {\n            base64 = true;\n        }\n        else {\n            typeFull += `;${meta[i]}`;\n            if (meta[i].indexOf('charset=') === 0) {\n                charset = meta[i].substring(8);\n            }\n        }\n    }\n    // defaults to US-ASCII only if type is not provided\n    if (!meta[0] && !charset.length) {\n        typeFull += ';charset=US-ASCII';\n        charset = 'US-ASCII';\n    }\n    // get the encoded data portion and decode URI-encoded chars\n    const encoding = base64 ? 'base64' : 'ascii';\n    const data = unescape(uri.substring(firstComma + 1));\n    const buffer = Buffer.from(data, encoding);\n    // set `.type` and `.typeFull` properties to MIME type\n    buffer.type = type;\n    buffer.typeFull = typeFull;\n    // set the `.charset` property\n    buffer.charset = charset;\n    return buffer;\n}\nmodule.exports = dataUriToBuffer;\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZGF0YS11cmktdG8tYnVmZmVyL2Rpc3Qvc3JjL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGlCQUFpQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixFQUFFLFFBQVE7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZC1tYW5kYXRlcy8uL25vZGVfbW9kdWxlcy9kYXRhLXVyaS10by1idWZmZXIvZGlzdC9zcmMvaW5kZXguanM/ZTQwMCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogUmV0dXJucyBhIGBCdWZmZXJgIGluc3RhbmNlIGZyb20gdGhlIGdpdmVuIGRhdGEgVVJJIGB1cmlgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmkgRGF0YSBVUkkgdG8gdHVybiBpbnRvIGEgQnVmZmVyIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtCdWZmZXJ9IEJ1ZmZlciBpbnN0YW5jZSBmcm9tIERhdGEgVVJJXG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBkYXRhVXJpVG9CdWZmZXIodXJpKSB7XG4gICAgaWYgKCEvXmRhdGE6L2kudGVzdCh1cmkpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2B1cmlgIGRvZXMgbm90IGFwcGVhciB0byBiZSBhIERhdGEgVVJJIChtdXN0IGJlZ2luIHdpdGggXCJkYXRhOlwiKScpO1xuICAgIH1cbiAgICAvLyBzdHJpcCBuZXdsaW5lc1xuICAgIHVyaSA9IHVyaS5yZXBsYWNlKC9cXHI/XFxuL2csICcnKTtcbiAgICAvLyBzcGxpdCB0aGUgVVJJIHVwIGludG8gdGhlIFwibWV0YWRhdGFcIiBhbmQgdGhlIFwiZGF0YVwiIHBvcnRpb25zXG4gICAgY29uc3QgZmlyc3RDb21tYSA9IHVyaS5pbmRleE9mKCcsJyk7XG4gICAgaWYgKGZpcnN0Q29tbWEgPT09IC0xIHx8IGZpcnN0Q29tbWEgPD0gNCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtYWxmb3JtZWQgZGF0YTogVVJJJyk7XG4gICAgfVxuICAgIC8vIHJlbW92ZSB0aGUgXCJkYXRhOlwiIHNjaGVtZSBhbmQgcGFyc2UgdGhlIG1ldGFkYXRhXG4gICAgY29uc3QgbWV0YSA9IHVyaS5zdWJzdHJpbmcoNSwgZmlyc3RDb21tYSkuc3BsaXQoJzsnKTtcbiAgICBsZXQgY2hhcnNldCA9ICcnO1xuICAgIGxldCBiYXNlNjQgPSBmYWxzZTtcbiAgICBjb25zdCB0eXBlID0gbWV0YVswXSB8fCAndGV4dC9wbGFpbic7XG4gICAgbGV0IHR5cGVGdWxsID0gdHlwZTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG1ldGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKG1ldGFbaV0gPT09ICdiYXNlNjQnKSB7XG4gICAgICAgICAgICBiYXNlNjQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdHlwZUZ1bGwgKz0gYDske21ldGFbaV19YDtcbiAgICAgICAgICAgIGlmIChtZXRhW2ldLmluZGV4T2YoJ2NoYXJzZXQ9JykgPT09IDApIHtcbiAgICAgICAgICAgICAgICBjaGFyc2V0ID0gbWV0YVtpXS5zdWJzdHJpbmcoOCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gZGVmYXVsdHMgdG8gVVMtQVNDSUkgb25seSBpZiB0eXBlIGlzIG5vdCBwcm92aWRlZFxuICAgIGlmICghbWV0YVswXSAmJiAhY2hhcnNldC5sZW5ndGgpIHtcbiAgICAgICAgdHlwZUZ1bGwgKz0gJztjaGFyc2V0PVVTLUFTQ0lJJztcbiAgICAgICAgY2hhcnNldCA9ICdVUy1BU0NJSSc7XG4gICAgfVxuICAgIC8vIGdldCB0aGUgZW5jb2RlZCBkYXRhIHBvcnRpb24gYW5kIGRlY29kZSBVUkktZW5jb2RlZCBjaGFyc1xuICAgIGNvbnN0IGVuY29kaW5nID0gYmFzZTY0ID8gJ2Jhc2U2NCcgOiAnYXNjaWknO1xuICAgIGNvbnN0IGRhdGEgPSB1bmVzY2FwZSh1cmkuc3Vic3RyaW5nKGZpcnN0Q29tbWEgKyAxKSk7XG4gICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmZyb20oZGF0YSwgZW5jb2RpbmcpO1xuICAgIC8vIHNldCBgLnR5cGVgIGFuZCBgLnR5cGVGdWxsYCBwcm9wZXJ0aWVzIHRvIE1JTUUgdHlwZVxuICAgIGJ1ZmZlci50eXBlID0gdHlwZTtcbiAgICBidWZmZXIudHlwZUZ1bGwgPSB0eXBlRnVsbDtcbiAgICAvLyBzZXQgdGhlIGAuY2hhcnNldGAgcHJvcGVydHlcbiAgICBidWZmZXIuY2hhcnNldCA9IGNoYXJzZXQ7XG4gICAgcmV0dXJuIGJ1ZmZlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZGF0YVVyaVRvQnVmZmVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/data-uri-to-buffer/dist/src/index.js\n");

/***/ })

};
;