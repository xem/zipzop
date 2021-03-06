"use strict";
/**
    Copyright 2017, FUJI Goro (gfx).

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deflateAsync = exports.zlibAsync = exports.gzipAsync = exports.deflate = exports.zlib = exports.gzip = void 0;
var z = require("./libzopfli");
var defaultOptions = {
    verbose: false,
    verbose_more: false,
    numiterations: 15,
    blocksplitting: true,
    blocksplittingmax: 15,
};
var queue = new Array();
z.onRuntimeInitialized = function () {
    for (var _i = 0, _a = queue; _i < _a.length; _i++) {
        var task = _a[_i];
        task();
    }
    queue = null;
};
function ensureByteBuffer(input) {
    if (typeof input === 'string') {
        var a = z.intArrayFromString(input);
        a.length--; // because emscripten's intArrayFromString() adds trailing nul
        return a;
    }
    else {
        return input;
    }
}
function callCompress(input, format, options, cb) {
    console.assert(input != null, "buffer must not be null");
    console.assert(options != null, "options must not be null");
    console.assert(cb != null, "cb must not be null");
    var byteBuffer = ensureByteBuffer(input);
    var bufferPtr = z.allocate(byteBuffer, 'i8', z.ALLOC_NORMAL);
    var opts = __assign(__assign({}, defaultOptions), options);
    var output = z._createZopfliJsOutput();
    z._compress(bufferPtr, byteBuffer.length, output, format, opts.verbose, opts.verbose_more, opts.numiterations, opts.blocksplitting, opts.blocksplittingmax);
    var outputPtr = z._getBuffer(output);
    var outputSize = z._getBufferSize(output);
    var result = z.HEAPU8.slice(outputPtr, outputPtr + outputSize);
    z._deallocate(outputPtr);
    z._deallocate(output);
    z._deallocate(bufferPtr);
    // zopfli does not fail unless a violation of preconditions occurs.
    cb(null, result);
}
function compress(buffer, format, options, cb) {
    if (queue) {
        queue.push(function () {
            callCompress(buffer, format, options, cb);
        });
    }
    else {
        callCompress(buffer, format, options, cb);
    }
}
function gzip(buffer, options, cb) {
    compress(buffer, 0 /* GZIP */, options, cb);
}
exports.gzip = gzip;
function zlib(buffer, options, cb) {
    compress(buffer, 1 /* ZLIB */, options, cb);
}
exports.zlib = zlib;
function deflate(buffer, options, cb) {
    compress(buffer, 2 /* DEFLATE */, options, cb);
}
exports.deflate = deflate;
function promisify(f) {
    return function (buffer, options) {
        return new Promise(function (resolve, reject) {
            f(buffer, options, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    };
}
exports.gzipAsync = promisify(gzip);
exports.zlibAsync = promisify(zlib);
exports.deflateAsync = promisify(deflate);

//# sourceMappingURL=index.js.map