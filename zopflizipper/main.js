/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/immediate/lib/browser.js":
/*!***********************************************!*\
  !*** ./node_modules/immediate/lib/browser.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var Mutation = __webpack_require__.g.MutationObserver || __webpack_require__.g.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = __webpack_require__.g.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function () {
      element.data = (called = ++called % 2);
    };
  } else if (!__webpack_require__.g.setImmediate && typeof __webpack_require__.g.MessageChannel !== 'undefined') {
    var channel = new __webpack_require__.g.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function () {
      channel.port2.postMessage(0);
    };
  } else if ('document' in __webpack_require__.g && 'onreadystatechange' in __webpack_require__.g.document.createElement('script')) {
    scheduleDrain = function () {

      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var scriptEl = __webpack_require__.g.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      __webpack_require__.g.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function () {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}


/***/ }),

/***/ "./node_modules/jszip/lib/base64.js":
/*!******************************************!*\
  !*** ./node_modules/jszip/lib/base64.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var utils = __webpack_require__(/*! ./utils */ "./node_modules/jszip/lib/utils.js");
var support = __webpack_require__(/*! ./support */ "./node_modules/jszip/lib/support.js");
// private property
var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";


// public method for encoding
exports.encode = function(input) {
    var output = [];
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0, len = input.length, remainingBytes = len;

    var isArray = utils.getTypeOf(input) !== "string";
    while (i < input.length) {
        remainingBytes = len - i;

        if (!isArray) {
            chr1 = input.charCodeAt(i++);
            chr2 = i < len ? input.charCodeAt(i++) : 0;
            chr3 = i < len ? input.charCodeAt(i++) : 0;
        } else {
            chr1 = input[i++];
            chr2 = i < len ? input[i++] : 0;
            chr3 = i < len ? input[i++] : 0;
        }

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = remainingBytes > 1 ? (((chr2 & 15) << 2) | (chr3 >> 6)) : 64;
        enc4 = remainingBytes > 2 ? (chr3 & 63) : 64;

        output.push(_keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4));

    }

    return output.join("");
};

// public method for decoding
exports.decode = function(input) {
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0, resultIndex = 0;

    var dataUrlPrefix = "data:";

    if (input.substr(0, dataUrlPrefix.length) === dataUrlPrefix) {
        // This is a common error: people give a data url
        // (data:image/png;base64,iVBOR...) with a {base64: true} and
        // wonders why things don't work.
        // We can detect that the string input looks like a data url but we
        // *can't* be sure it is one: removing everything up to the comma would
        // be too dangerous.
        throw new Error("Invalid base64 input, it looks like a data url.");
    }

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    var totalLength = input.length * 3 / 4;
    if(input.charAt(input.length - 1) === _keyStr.charAt(64)) {
        totalLength--;
    }
    if(input.charAt(input.length - 2) === _keyStr.charAt(64)) {
        totalLength--;
    }
    if (totalLength % 1 !== 0) {
        // totalLength is not an integer, the length does not match a valid
        // base64 content. That can happen if:
        // - the input is not a base64 content
        // - the input is *almost* a base64 content, with a extra chars at the
        //   beginning or at the end
        // - the input uses a base64 variant (base64url for example)
        throw new Error("Invalid base64 input, bad content length.");
    }
    var output;
    if (support.uint8array) {
        output = new Uint8Array(totalLength|0);
    } else {
        output = new Array(totalLength|0);
    }

    while (i < input.length) {

        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output[resultIndex++] = chr1;

        if (enc3 !== 64) {
            output[resultIndex++] = chr2;
        }
        if (enc4 !== 64) {
            output[resultIndex++] = chr3;
        }

    }

    return output;
};


/***/ }),

/***/ "./node_modules/jszip/lib/compressedObject.js":
/*!****************************************************!*\
  !*** ./node_modules/jszip/lib/compressedObject.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var external = __webpack_require__(/*! ./external */ "./node_modules/jszip/lib/external.js");
var DataWorker = __webpack_require__(/*! ./stream/DataWorker */ "./node_modules/jszip/lib/stream/DataWorker.js");
var Crc32Probe = __webpack_require__(/*! ./stream/Crc32Probe */ "./node_modules/jszip/lib/stream/Crc32Probe.js");
var DataLengthProbe = __webpack_require__(/*! ./stream/DataLengthProbe */ "./node_modules/jszip/lib/stream/DataLengthProbe.js");

/**
 * Represent a compressed object, with everything needed to decompress it.
 * @constructor
 * @param {number} compressedSize the size of the data compressed.
 * @param {number} uncompressedSize the size of the data after decompression.
 * @param {number} crc32 the crc32 of the decompressed file.
 * @param {object} compression the type of compression, see lib/compressions.js.
 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the compressed data.
 */
function CompressedObject(compressedSize, uncompressedSize, crc32, compression, data) {
    this.compressedSize = compressedSize;
    this.uncompressedSize = uncompressedSize;
    this.crc32 = crc32;
    this.compression = compression;
    this.compressedContent = data;
}

CompressedObject.prototype = {
    /**
     * Create a worker to get the uncompressed content.
     * @return {GenericWorker} the worker.
     */
    getContentWorker: function () {
        var worker = new DataWorker(external.Promise.resolve(this.compressedContent))
            .pipe(this.compression.uncompressWorker())
            .pipe(new DataLengthProbe("data_length"));

        var that = this;
        worker.on("end", function () {
            if (this.streamInfo['data_length'] !== that.uncompressedSize) {
                throw new Error("Bug : uncompressed data size mismatch");
            }
        });
        return worker;
    },
    /**
     * Create a worker to get the compressed content.
     * @return {GenericWorker} the worker.
     */
    getCompressedWorker: function () {
        return new DataWorker(external.Promise.resolve(this.compressedContent))
            .withStreamInfo("compressedSize", this.compressedSize)
            .withStreamInfo("uncompressedSize", this.uncompressedSize)
            .withStreamInfo("crc32", this.crc32)
            .withStreamInfo("compression", this.compression)
            ;
    }
};

/**
 * Chain the given worker with other workers to compress the content with the
 * given compression.
 * @param {GenericWorker} uncompressedWorker the worker to pipe.
 * @param {Object} compression the compression object.
 * @param {Object} compressionOptions the options to use when compressing.
 * @return {GenericWorker} the new worker compressing the content.
 */
CompressedObject.createWorkerFrom = function (uncompressedWorker, compression, compressionOptions) {
    return uncompressedWorker
        .pipe(new Crc32Probe())
        .pipe(new DataLengthProbe("uncompressedSize"))
        .pipe(compression.compressWorker(compressionOptions))
        .pipe(new DataLengthProbe("compressedSize"))
        .withStreamInfo("compression", compression);
};

module.exports = CompressedObject;


/***/ }),

/***/ "./node_modules/jszip/lib/compressions.js":
/*!************************************************!*\
  !*** ./node_modules/jszip/lib/compressions.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var GenericWorker = __webpack_require__(/*! ./stream/GenericWorker */ "./node_modules/jszip/lib/stream/GenericWorker.js");

exports.STORE = {
    magic: "\x00\x00",
    compressWorker : function (compressionOptions) {
        return new GenericWorker("STORE compression");
    },
    uncompressWorker : function () {
        return new GenericWorker("STORE decompression");
    }
};
exports.DEFLATE = __webpack_require__(/*! ./flate */ "./node_modules/jszip/lib/flate.js");


/***/ }),

/***/ "./node_modules/jszip/lib/crc32.js":
/*!*****************************************!*\
  !*** ./node_modules/jszip/lib/crc32.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/jszip/lib/utils.js");

/**
 * The following functions come from pako, from pako/lib/zlib/crc32.js
 * released under the MIT license, see pako https://github.com/nodeca/pako/
 */

// Use ordinary array, since untyped makes no boost here
function makeTable() {
    var c, table = [];

    for(var n =0; n < 256; n++){
        c = n;
        for(var k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        table[n] = c;
    }

    return table;
}

// Create table on load. Just 255 signed longs. Not a problem.
var crcTable = makeTable();


function crc32(crc, buf, len, pos) {
    var t = crcTable, end = pos + len;

    crc = crc ^ (-1);

    for (var i = pos; i < end; i++ ) {
        crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
    }

    return (crc ^ (-1)); // >>> 0;
}

// That's all for the pako functions.

/**
 * Compute the crc32 of a string.
 * This is almost the same as the function crc32, but for strings. Using the
 * same function for the two use cases leads to horrible performances.
 * @param {Number} crc the starting value of the crc.
 * @param {String} str the string to use.
 * @param {Number} len the length of the string.
 * @param {Number} pos the starting position for the crc32 computation.
 * @return {Number} the computed crc32.
 */
function crc32str(crc, str, len, pos) {
    var t = crcTable, end = pos + len;

    crc = crc ^ (-1);

    for (var i = pos; i < end; i++ ) {
        crc = (crc >>> 8) ^ t[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)); // >>> 0;
}

module.exports = function crc32wrapper(input, crc) {
    if (typeof input === "undefined" || !input.length) {
        return 0;
    }

    var isArray = utils.getTypeOf(input) !== "string";

    if(isArray) {
        return crc32(crc|0, input, input.length, 0);
    } else {
        return crc32str(crc|0, input, input.length, 0);
    }
};


/***/ }),

/***/ "./node_modules/jszip/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/jszip/lib/defaults.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.base64 = false;
exports.binary = false;
exports.dir = false;
exports.createFolders = true;
exports.date = null;
exports.compression = null;
exports.compressionOptions = null;
exports.comment = null;
exports.unixPermissions = null;
exports.dosPermissions = null;


/***/ }),

/***/ "./node_modules/jszip/lib/external.js":
/*!********************************************!*\
  !*** ./node_modules/jszip/lib/external.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* global Promise */


// load the global object first:
// - it should be better integrated in the system (unhandledRejection in node)
// - the environment may have a custom Promise implementation (see zone.js)
var ES6Promise = null;
if (typeof Promise !== "undefined") {
    ES6Promise = Promise;
} else {
    ES6Promise = __webpack_require__(/*! lie */ "./node_modules/lie/lib/browser.js");
}

/**
 * Let the user use/change some implementations.
 */
module.exports = {
    Promise: ES6Promise
};


/***/ }),

/***/ "./node_modules/jszip/lib/flate.js":
/*!*****************************************!*\
  !*** ./node_modules/jszip/lib/flate.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var USE_TYPEDARRAY = (typeof Uint8Array !== 'undefined') && (typeof Uint16Array !== 'undefined') && (typeof Uint32Array !== 'undefined');

var pako = __webpack_require__(/*! pako */ "./src/zopfli-pako-adapter.js");
var utils = __webpack_require__(/*! ./utils */ "./node_modules/jszip/lib/utils.js");
var GenericWorker = __webpack_require__(/*! ./stream/GenericWorker */ "./node_modules/jszip/lib/stream/GenericWorker.js");

var ARRAY_TYPE = USE_TYPEDARRAY ? "uint8array" : "array";

exports.magic = "\x08\x00";

/**
 * Create a worker that uses pako to inflate/deflate.
 * @constructor
 * @param {String} action the name of the pako function to call : either "Deflate" or "Inflate".
 * @param {Object} options the options to use when (de)compressing.
 */
function FlateWorker(action, options) {
    GenericWorker.call(this, "FlateWorker/" + action);

    this._pako = null;
    this._pakoAction = action;
    this._pakoOptions = options;
    // the `meta` object from the last chunk received
    // this allow this worker to pass around metadata
    this.meta = {};
}

utils.inherits(FlateWorker, GenericWorker);

/**
 * @see GenericWorker.processChunk
 */
FlateWorker.prototype.processChunk = function (chunk) {
    this.meta = chunk.meta;
    if (this._pako === null) {
        this._createPako();
    }
    this._pako.push(utils.transformTo(ARRAY_TYPE, chunk.data), false);
};

/**
 * @see GenericWorker.flush
 */
FlateWorker.prototype.flush = function () {
    GenericWorker.prototype.flush.call(this);
    if (this._pako === null) {
        this._createPako();
    }
    this._pako.push([], true);
};
/**
 * @see GenericWorker.cleanUp
 */
FlateWorker.prototype.cleanUp = function () {
    GenericWorker.prototype.cleanUp.call(this);
    this._pako = null;
};

/**
 * Create the _pako object.
 * TODO: lazy-loading this object isn't the best solution but it's the
 * quickest. The best solution is to lazy-load the worker list. See also the
 * issue #446.
 */
FlateWorker.prototype._createPako = function () {
    this._pako = new pako[this._pakoAction]({
        raw: true,
        level: this._pakoOptions.level || -1 // default compression
    });
    var self = this;
    this._pako.onData = function(data) {
        self.push({
            data : data,
            meta : self.meta
        });
    };
};

exports.compressWorker = function (compressionOptions) {
    return new FlateWorker("Deflate", compressionOptions);
};
exports.uncompressWorker = function () {
    return new FlateWorker("Inflate", {});
};


/***/ }),

/***/ "./node_modules/jszip/lib/generate/ZipFileWorker.js":
/*!**********************************************************!*\
  !*** ./node_modules/jszip/lib/generate/ZipFileWorker.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/jszip/lib/utils.js");
var GenericWorker = __webpack_require__(/*! ../stream/GenericWorker */ "./node_modules/jszip/lib/stream/GenericWorker.js");
var utf8 = __webpack_require__(/*! ../utf8 */ "./node_modules/jszip/lib/utf8.js");
var crc32 = __webpack_require__(/*! ../crc32 */ "./node_modules/jszip/lib/crc32.js");
var signature = __webpack_require__(/*! ../signature */ "./node_modules/jszip/lib/signature.js");

/**
 * Transform an integer into a string in hexadecimal.
 * @private
 * @param {number} dec the number to convert.
 * @param {number} bytes the number of bytes to generate.
 * @returns {string} the result.
 */
var decToHex = function(dec, bytes) {
    var hex = "", i;
    for (i = 0; i < bytes; i++) {
        hex += String.fromCharCode(dec & 0xff);
        dec = dec >>> 8;
    }
    return hex;
};

/**
 * Generate the UNIX part of the external file attributes.
 * @param {Object} unixPermissions the unix permissions or null.
 * @param {Boolean} isDir true if the entry is a directory, false otherwise.
 * @return {Number} a 32 bit integer.
 *
 * adapted from http://unix.stackexchange.com/questions/14705/the-zip-formats-external-file-attribute :
 *
 * TTTTsstrwxrwxrwx0000000000ADVSHR
 * ^^^^____________________________ file type, see zipinfo.c (UNX_*)
 *     ^^^_________________________ setuid, setgid, sticky
 *        ^^^^^^^^^________________ permissions
 *                 ^^^^^^^^^^______ not used ?
 *                           ^^^^^^ DOS attribute bits : Archive, Directory, Volume label, System file, Hidden, Read only
 */
var generateUnixExternalFileAttr = function (unixPermissions, isDir) {

    var result = unixPermissions;
    if (!unixPermissions) {
        // I can't use octal values in strict mode, hence the hexa.
        //  040775 => 0x41fd
        // 0100664 => 0x81b4
        result = isDir ? 0x41fd : 0x81b4;
    }
    return (result & 0xFFFF) << 16;
};

/**
 * Generate the DOS part of the external file attributes.
 * @param {Object} dosPermissions the dos permissions or null.
 * @param {Boolean} isDir true if the entry is a directory, false otherwise.
 * @return {Number} a 32 bit integer.
 *
 * Bit 0     Read-Only
 * Bit 1     Hidden
 * Bit 2     System
 * Bit 3     Volume Label
 * Bit 4     Directory
 * Bit 5     Archive
 */
var generateDosExternalFileAttr = function (dosPermissions, isDir) {

    // the dir flag is already set for compatibility
    return (dosPermissions || 0)  & 0x3F;
};

/**
 * Generate the various parts used in the construction of the final zip file.
 * @param {Object} streamInfo the hash with information about the compressed file.
 * @param {Boolean} streamedContent is the content streamed ?
 * @param {Boolean} streamingEnded is the stream finished ?
 * @param {number} offset the current offset from the start of the zip file.
 * @param {String} platform let's pretend we are this platform (change platform dependents fields)
 * @param {Function} encodeFileName the function to encode the file name / comment.
 * @return {Object} the zip parts.
 */
var generateZipParts = function(streamInfo, streamedContent, streamingEnded, offset, platform, encodeFileName) {
    var file = streamInfo['file'],
    compression = streamInfo['compression'],
    useCustomEncoding = encodeFileName !== utf8.utf8encode,
    encodedFileName = utils.transformTo("string", encodeFileName(file.name)),
    utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file.name)),
    comment = file.comment,
    encodedComment = utils.transformTo("string", encodeFileName(comment)),
    utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)),
    useUTF8ForFileName = utfEncodedFileName.length !== file.name.length,
    useUTF8ForComment = utfEncodedComment.length !== comment.length,
    dosTime,
    dosDate,
    extraFields = "",
    unicodePathExtraField = "",
    unicodeCommentExtraField = "",
    dir = file.dir,
    date = file.date;


    var dataInfo = {
        crc32 : 0,
        compressedSize : 0,
        uncompressedSize : 0
    };

    // if the content is streamed, the sizes/crc32 are only available AFTER
    // the end of the stream.
    if (!streamedContent || streamingEnded) {
        dataInfo.crc32 = streamInfo['crc32'];
        dataInfo.compressedSize = streamInfo['compressedSize'];
        dataInfo.uncompressedSize = streamInfo['uncompressedSize'];
    }

    var bitflag = 0;
    if (streamedContent) {
        // Bit 3: the sizes/crc32 are set to zero in the local header.
        // The correct values are put in the data descriptor immediately
        // following the compressed data.
        bitflag |= 0x0008;
    }
    if (!useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment)) {
        // Bit 11: Language encoding flag (EFS).
        bitflag |= 0x0800;
    }


    var extFileAttr = 0;
    var versionMadeBy = 0;
    if (dir) {
        // dos or unix, we set the dos dir flag
        extFileAttr |= 0x00010;
    }
    if(platform === "UNIX") {
        versionMadeBy = 0x031E; // UNIX, version 3.0
        extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);
    } else { // DOS or other, fallback to DOS
        versionMadeBy = 0x0014; // DOS, version 2.0
        extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);
    }

    // date
    // @see http://www.delorie.com/djgpp/doc/rbinter/it/52/13.html
    // @see http://www.delorie.com/djgpp/doc/rbinter/it/65/16.html
    // @see http://www.delorie.com/djgpp/doc/rbinter/it/66/16.html

    dosTime = date.getUTCHours();
    dosTime = dosTime << 6;
    dosTime = dosTime | date.getUTCMinutes();
    dosTime = dosTime << 5;
    dosTime = dosTime | date.getUTCSeconds() / 2;

    dosDate = date.getUTCFullYear() - 1980;
    dosDate = dosDate << 4;
    dosDate = dosDate | (date.getUTCMonth() + 1);
    dosDate = dosDate << 5;
    dosDate = dosDate | date.getUTCDate();

    if (useUTF8ForFileName) {
        // set the unicode path extra field. unzip needs at least one extra
        // field to correctly handle unicode path, so using the path is as good
        // as any other information. This could improve the situation with
        // other archive managers too.
        // This field is usually used without the utf8 flag, with a non
        // unicode path in the header (winrar, winzip). This helps (a bit)
        // with the messy Windows' default compressed folders feature but
        // breaks on p7zip which doesn't seek the unicode path extra field.
        // So for now, UTF-8 everywhere !
        unicodePathExtraField =
            // Version
            decToHex(1, 1) +
            // NameCRC32
            decToHex(crc32(encodedFileName), 4) +
            // UnicodeName
            utfEncodedFileName;

        extraFields +=
            // Info-ZIP Unicode Path Extra Field
            "\x75\x70" +
            // size
            decToHex(unicodePathExtraField.length, 2) +
            // content
            unicodePathExtraField;
    }

    if(useUTF8ForComment) {

        unicodeCommentExtraField =
            // Version
            decToHex(1, 1) +
            // CommentCRC32
            decToHex(crc32(encodedComment), 4) +
            // UnicodeName
            utfEncodedComment;

        extraFields +=
            // Info-ZIP Unicode Path Extra Field
            "\x75\x63" +
            // size
            decToHex(unicodeCommentExtraField.length, 2) +
            // content
            unicodeCommentExtraField;
    }

    var header = "";

    // version needed to extract
    header += "\x0A\x00";
    // general purpose bit flag
    header += decToHex(bitflag, 2);
    // compression method
    header += compression.magic;
    // last mod file time
    header += decToHex(dosTime, 2);
    // last mod file date
    header += decToHex(dosDate, 2);
    // crc-32
    header += decToHex(dataInfo.crc32, 4);
    // compressed size
    header += decToHex(dataInfo.compressedSize, 4);
    // uncompressed size
    header += decToHex(dataInfo.uncompressedSize, 4);
    // file name length
    header += decToHex(encodedFileName.length, 2);
    // extra field length
    header += decToHex(extraFields.length, 2);


    var fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields;

    var dirRecord = signature.CENTRAL_FILE_HEADER +
        // version made by (00: DOS)
        decToHex(versionMadeBy, 2) +
        // file header (common to file and central directory)
        header +
        // file comment length
        decToHex(encodedComment.length, 2) +
        // disk number start
        "\x00\x00" +
        // internal file attributes TODO
        "\x00\x00" +
        // external file attributes
        decToHex(extFileAttr, 4) +
        // relative offset of local header
        decToHex(offset, 4) +
        // file name
        encodedFileName +
        // extra field
        extraFields +
        // file comment
        encodedComment;

    return {
        fileRecord: fileRecord,
        dirRecord: dirRecord
    };
};

/**
 * Generate the EOCD record.
 * @param {Number} entriesCount the number of entries in the zip file.
 * @param {Number} centralDirLength the length (in bytes) of the central dir.
 * @param {Number} localDirLength the length (in bytes) of the local dir.
 * @param {String} comment the zip file comment as a binary string.
 * @param {Function} encodeFileName the function to encode the comment.
 * @return {String} the EOCD record.
 */
var generateCentralDirectoryEnd = function (entriesCount, centralDirLength, localDirLength, comment, encodeFileName) {
    var dirEnd = "";
    var encodedComment = utils.transformTo("string", encodeFileName(comment));

    // end of central dir signature
    dirEnd = signature.CENTRAL_DIRECTORY_END +
        // number of this disk
        "\x00\x00" +
        // number of the disk with the start of the central directory
        "\x00\x00" +
        // total number of entries in the central directory on this disk
        decToHex(entriesCount, 2) +
        // total number of entries in the central directory
        decToHex(entriesCount, 2) +
        // size of the central directory   4 bytes
        decToHex(centralDirLength, 4) +
        // offset of start of central directory with respect to the starting disk number
        decToHex(localDirLength, 4) +
        // .ZIP file comment length
        decToHex(encodedComment.length, 2) +
        // .ZIP file comment
        encodedComment;

    return dirEnd;
};

/**
 * Generate data descriptors for a file entry.
 * @param {Object} streamInfo the hash generated by a worker, containing information
 * on the file entry.
 * @return {String} the data descriptors.
 */
var generateDataDescriptors = function (streamInfo) {
    var descriptor = "";
    descriptor = signature.DATA_DESCRIPTOR +
        // crc-32                          4 bytes
        decToHex(streamInfo['crc32'], 4) +
        // compressed size                 4 bytes
        decToHex(streamInfo['compressedSize'], 4) +
        // uncompressed size               4 bytes
        decToHex(streamInfo['uncompressedSize'], 4);

    return descriptor;
};


/**
 * A worker to concatenate other workers to create a zip file.
 * @param {Boolean} streamFiles `true` to stream the content of the files,
 * `false` to accumulate it.
 * @param {String} comment the comment to use.
 * @param {String} platform the platform to use, "UNIX" or "DOS".
 * @param {Function} encodeFileName the function to encode file names and comments.
 */
function ZipFileWorker(streamFiles, comment, platform, encodeFileName) {
    GenericWorker.call(this, "ZipFileWorker");
    // The number of bytes written so far. This doesn't count accumulated chunks.
    this.bytesWritten = 0;
    // The comment of the zip file
    this.zipComment = comment;
    // The platform "generating" the zip file.
    this.zipPlatform = platform;
    // the function to encode file names and comments.
    this.encodeFileName = encodeFileName;
    // Should we stream the content of the files ?
    this.streamFiles = streamFiles;
    // If `streamFiles` is false, we will need to accumulate the content of the
    // files to calculate sizes / crc32 (and write them *before* the content).
    // This boolean indicates if we are accumulating chunks (it will change a lot
    // during the lifetime of this worker).
    this.accumulate = false;
    // The buffer receiving chunks when accumulating content.
    this.contentBuffer = [];
    // The list of generated directory records.
    this.dirRecords = [];
    // The offset (in bytes) from the beginning of the zip file for the current source.
    this.currentSourceOffset = 0;
    // The total number of entries in this zip file.
    this.entriesCount = 0;
    // the name of the file currently being added, null when handling the end of the zip file.
    // Used for the emitted metadata.
    this.currentFile = null;



    this._sources = [];
}
utils.inherits(ZipFileWorker, GenericWorker);

/**
 * @see GenericWorker.push
 */
ZipFileWorker.prototype.push = function (chunk) {

    var currentFilePercent = chunk.meta.percent || 0;
    var entriesCount = this.entriesCount;
    var remainingFiles = this._sources.length;

    if(this.accumulate) {
        this.contentBuffer.push(chunk);
    } else {
        this.bytesWritten += chunk.data.length;

        GenericWorker.prototype.push.call(this, {
            data : chunk.data,
            meta : {
                currentFile : this.currentFile,
                percent : entriesCount ? (currentFilePercent + 100 * (entriesCount - remainingFiles - 1)) / entriesCount : 100
            }
        });
    }
};

/**
 * The worker started a new source (an other worker).
 * @param {Object} streamInfo the streamInfo object from the new source.
 */
ZipFileWorker.prototype.openedSource = function (streamInfo) {
    this.currentSourceOffset = this.bytesWritten;
    this.currentFile = streamInfo['file'].name;

    var streamedContent = this.streamFiles && !streamInfo['file'].dir;

    // don't stream folders (because they don't have any content)
    if(streamedContent) {
        var record = generateZipParts(streamInfo, streamedContent, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        this.push({
            data : record.fileRecord,
            meta : {percent:0}
        });
    } else {
        // we need to wait for the whole file before pushing anything
        this.accumulate = true;
    }
};

/**
 * The worker finished a source (an other worker).
 * @param {Object} streamInfo the streamInfo object from the finished source.
 */
ZipFileWorker.prototype.closedSource = function (streamInfo) {
    this.accumulate = false;
    var streamedContent = this.streamFiles && !streamInfo['file'].dir;
    var record = generateZipParts(streamInfo, streamedContent, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);

    this.dirRecords.push(record.dirRecord);
    if(streamedContent) {
        // after the streamed file, we put data descriptors
        this.push({
            data : generateDataDescriptors(streamInfo),
            meta : {percent:100}
        });
    } else {
        // the content wasn't streamed, we need to push everything now
        // first the file record, then the content
        this.push({
            data : record.fileRecord,
            meta : {percent:0}
        });
        while(this.contentBuffer.length) {
            this.push(this.contentBuffer.shift());
        }
    }
    this.currentFile = null;
};

/**
 * @see GenericWorker.flush
 */
ZipFileWorker.prototype.flush = function () {

    var localDirLength = this.bytesWritten;
    for(var i = 0; i < this.dirRecords.length; i++) {
        this.push({
            data : this.dirRecords[i],
            meta : {percent:100}
        });
    }
    var centralDirLength = this.bytesWritten - localDirLength;

    var dirEnd = generateCentralDirectoryEnd(this.dirRecords.length, centralDirLength, localDirLength, this.zipComment, this.encodeFileName);

    this.push({
        data : dirEnd,
        meta : {percent:100}
    });
};

/**
 * Prepare the next source to be read.
 */
ZipFileWorker.prototype.prepareNextSource = function () {
    this.previous = this._sources.shift();
    this.openedSource(this.previous.streamInfo);
    if (this.isPaused) {
        this.previous.pause();
    } else {
        this.previous.resume();
    }
};

/**
 * @see GenericWorker.registerPrevious
 */
ZipFileWorker.prototype.registerPrevious = function (previous) {
    this._sources.push(previous);
    var self = this;

    previous.on('data', function (chunk) {
        self.processChunk(chunk);
    });
    previous.on('end', function () {
        self.closedSource(self.previous.streamInfo);
        if(self._sources.length) {
            self.prepareNextSource();
        } else {
            self.end();
        }
    });
    previous.on('error', function (e) {
        self.error(e);
    });
    return this;
};

/**
 * @see GenericWorker.resume
 */
ZipFileWorker.prototype.resume = function () {
    if(!GenericWorker.prototype.resume.call(this)) {
        return false;
    }

    if (!this.previous && this._sources.length) {
        this.prepareNextSource();
        return true;
    }
    if (!this.previous && !this._sources.length && !this.generatedError) {
        this.end();
        return true;
    }
};

/**
 * @see GenericWorker.error
 */
ZipFileWorker.prototype.error = function (e) {
    var sources = this._sources;
    if(!GenericWorker.prototype.error.call(this, e)) {
        return false;
    }
    for(var i = 0; i < sources.length; i++) {
        try {
            sources[i].error(e);
        } catch(e) {
            // the `error` exploded, nothing to do
        }
    }
    return true;
};

/**
 * @see GenericWorker.lock
 */
ZipFileWorker.prototype.lock = function () {
    GenericWorker.prototype.lock.call(this);
    var sources = this._sources;
    for(var i = 0; i < sources.length; i++) {
        sources[i].lock();
    }
};

module.exports = ZipFileWorker;


/***/ }),

/***/ "./node_modules/jszip/lib/generate/index.js":
/*!**************************************************!*\
  !*** ./node_modules/jszip/lib/generate/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var compressions = __webpack_require__(/*! ../compressions */ "./node_modules/jszip/lib/compressions.js");
var ZipFileWorker = __webpack_require__(/*! ./ZipFileWorker */ "./node_modules/jszip/lib/generate/ZipFileWorker.js");

/**
 * Find the compression to use.
 * @param {String} fileCompression the compression defined at the file level, if any.
 * @param {String} zipCompression the compression defined at the load() level.
 * @return {Object} the compression object to use.
 */
var getCompression = function (fileCompression, zipCompression) {

    var compressionName = fileCompression || zipCompression;
    var compression = compressions[compressionName];
    if (!compression) {
        throw new Error(compressionName + " is not a valid compression method !");
    }
    return compression;
};

/**
 * Create a worker to generate a zip file.
 * @param {JSZip} zip the JSZip instance at the right root level.
 * @param {Object} options to generate the zip file.
 * @param {String} comment the comment to use.
 */
exports.generateWorker = function (zip, options, comment) {

    var zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName);
    var entriesCount = 0;
    try {

        zip.forEach(function (relativePath, file) {
            entriesCount++;
            var compression = getCompression(file.options.compression, options.compression);
            var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};
            var dir = file.dir, date = file.date;

            file._compressWorker(compression, compressionOptions)
            .withStreamInfo("file", {
                name : relativePath,
                dir : dir,
                date : date,
                comment : file.comment || "",
                unixPermissions : file.unixPermissions,
                dosPermissions : file.dosPermissions
            })
            .pipe(zipFileWorker);
        });
        zipFileWorker.entriesCount = entriesCount;
    } catch (e) {
        zipFileWorker.error(e);
    }

    return zipFileWorker;
};


/***/ }),

/***/ "./node_modules/jszip/lib/index.js":
/*!*****************************************!*\
  !*** ./node_modules/jszip/lib/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Representation a of zip file in js
 * @constructor
 */
function JSZip() {
    // if this constructor is used without `new`, it adds `new` before itself:
    if(!(this instanceof JSZip)) {
        return new JSZip();
    }

    if(arguments.length) {
        throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
    }

    // object containing the files :
    // {
    //   "folder/" : {...},
    //   "folder/data.txt" : {...}
    // }
    // NOTE: we use a null prototype because we do not
    // want filenames like "toString" coming from a zip file
    // to overwrite methods and attributes in a normal Object.
    this.files = Object.create(null);

    this.comment = null;

    // Where we are in the hierarchy
    this.root = "";
    this.clone = function() {
        var newObj = new JSZip();
        for (var i in this) {
            if (typeof this[i] !== "function") {
                newObj[i] = this[i];
            }
        }
        return newObj;
    };
}
JSZip.prototype = __webpack_require__(/*! ./object */ "./node_modules/jszip/lib/object.js");
JSZip.prototype.loadAsync = __webpack_require__(/*! ./load */ "./node_modules/jszip/lib/load.js");
JSZip.support = __webpack_require__(/*! ./support */ "./node_modules/jszip/lib/support.js");
JSZip.defaults = __webpack_require__(/*! ./defaults */ "./node_modules/jszip/lib/defaults.js");

// TODO find a better way to handle this version,
// a require('package.json').version doesn't work with webpack, see #327
JSZip.version = "3.10.0";

JSZip.loadAsync = function (content, options) {
    return new JSZip().loadAsync(content, options);
};

JSZip.external = __webpack_require__(/*! ./external */ "./node_modules/jszip/lib/external.js");
module.exports = JSZip;


/***/ }),

/***/ "./node_modules/jszip/lib/load.js":
/*!****************************************!*\
  !*** ./node_modules/jszip/lib/load.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var utils = __webpack_require__(/*! ./utils */ "./node_modules/jszip/lib/utils.js");
var external = __webpack_require__(/*! ./external */ "./node_modules/jszip/lib/external.js");
var utf8 = __webpack_require__(/*! ./utf8 */ "./node_modules/jszip/lib/utf8.js");
var ZipEntries = __webpack_require__(/*! ./zipEntries */ "./node_modules/jszip/lib/zipEntries.js");
var Crc32Probe = __webpack_require__(/*! ./stream/Crc32Probe */ "./node_modules/jszip/lib/stream/Crc32Probe.js");
var nodejsUtils = __webpack_require__(/*! ./nodejsUtils */ "./node_modules/jszip/lib/nodejsUtils.js");

/**
 * Check the CRC32 of an entry.
 * @param {ZipEntry} zipEntry the zip entry to check.
 * @return {Promise} the result.
 */
function checkEntryCRC32(zipEntry) {
    return new external.Promise(function (resolve, reject) {
        var worker = zipEntry.decompressed.getContentWorker().pipe(new Crc32Probe());
        worker.on("error", function (e) {
            reject(e);
        })
            .on("end", function () {
                if (worker.streamInfo.crc32 !== zipEntry.decompressed.crc32) {
                    reject(new Error("Corrupted zip : CRC32 mismatch"));
                } else {
                    resolve();
                }
            })
            .resume();
    });
}

module.exports = function (data, options) {
    var zip = this;
    options = utils.extend(options || {}, {
        base64: false,
        checkCRC32: false,
        optimizedBinaryString: false,
        createFolders: false,
        decodeFileName: utf8.utf8decode
    });

    if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
        return external.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file."));
    }

    return utils.prepareContent("the loaded zip file", data, true, options.optimizedBinaryString, options.base64)
        .then(function (data) {
            var zipEntries = new ZipEntries(options);
            zipEntries.load(data);
            return zipEntries;
        }).then(function checkCRC32(zipEntries) {
            var promises = [external.Promise.resolve(zipEntries)];
            var files = zipEntries.files;
            if (options.checkCRC32) {
                for (var i = 0; i < files.length; i++) {
                    promises.push(checkEntryCRC32(files[i]));
                }
            }
            return external.Promise.all(promises);
        }).then(function addFiles(results) {
            var zipEntries = results.shift();
            var files = zipEntries.files;
            for (var i = 0; i < files.length; i++) {
                var input = files[i];

                var unsafeName = input.fileNameStr;
                var safeName = utils.resolve(input.fileNameStr);

                zip.file(safeName, input.decompressed, {
                    binary: true,
                    optimizedBinaryString: true,
                    date: input.date,
                    dir: input.dir,
                    comment: input.fileCommentStr.length ? input.fileCommentStr : null,
                    unixPermissions: input.unixPermissions,
                    dosPermissions: input.dosPermissions,
                    createFolders: options.createFolders
                });
                if (!input.dir) {
                    zip.file(safeName).unsafeOriginalName = unsafeName;
                }
            }
            if (zipEntries.zipComment.length) {
                zip.comment = zipEntries.zipComment;
            }

            return zip;
        });
};


/***/ }),

/***/ "./node_modules/jszip/lib/nodejs/NodejsStreamInputAdapter.js":
/*!*******************************************************************!*\
  !*** ./node_modules/jszip/lib/nodejs/NodejsStreamInputAdapter.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/jszip/lib/utils.js");
var GenericWorker = __webpack_require__(/*! ../stream/GenericWorker */ "./node_modules/jszip/lib/stream/GenericWorker.js");

/**
 * A worker that use a nodejs stream as source.
 * @constructor
 * @param {String} filename the name of the file entry for this stream.
 * @param {Readable} stream the nodejs stream.
 */
function NodejsStreamInputAdapter(filename, stream) {
    GenericWorker.call(this, "Nodejs stream input adapter for " + filename);
    this._upstreamEnded = false;
    this._bindStream(stream);
}

utils.inherits(NodejsStreamInputAdapter, GenericWorker);

/**
 * Prepare the stream and bind the callbacks on it.
 * Do this ASAP on node 0.10 ! A lazy binding doesn't always work.
 * @param {Stream} stream the nodejs stream to use.
 */
NodejsStreamInputAdapter.prototype._bindStream = function (stream) {
    var self = this;
    this._stream = stream;
    stream.pause();
    stream
    .on("data", function (chunk) {
        self.push({
            data: chunk,
            meta : {
                percent : 0
            }
        });
    })
    .on("error", function (e) {
        if(self.isPaused) {
            this.generatedError = e;
        } else {
            self.error(e);
        }
    })
    .on("end", function () {
        if(self.isPaused) {
            self._upstreamEnded = true;
        } else {
            self.end();
        }
    });
};
NodejsStreamInputAdapter.prototype.pause = function () {
    if(!GenericWorker.prototype.pause.call(this)) {
        return false;
    }
    this._stream.pause();
    return true;
};
NodejsStreamInputAdapter.prototype.resume = function () {
    if(!GenericWorker.prototype.resume.call(this)) {
        return false;
    }

    if(this._upstreamEnded) {
        this.end();
    } else {
        this._stream.resume();
    }

    return true;
};

module.exports = NodejsStreamInputAdapter;


/***/ }),

/***/ "./node_modules/jszip/lib/nodejs/NodejsStreamOutputAdapter.js":
/*!********************************************************************!*\
  !*** ./node_modules/jszip/lib/nodejs/NodejsStreamOutputAdapter.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Readable = (__webpack_require__(/*! readable-stream */ "./node_modules/jszip/lib/readable-stream-browser.js").Readable);

var utils = __webpack_require__(/*! ../utils */ "./node_modules/jszip/lib/utils.js");
utils.inherits(NodejsStreamOutputAdapter, Readable);

/**
* A nodejs stream using a worker as source.
* @see the SourceWrapper in http://nodejs.org/api/stream.html
* @constructor
* @param {StreamHelper} helper the helper wrapping the worker
* @param {Object} options the nodejs stream options
* @param {Function} updateCb the update callback.
*/
function NodejsStreamOutputAdapter(helper, options, updateCb) {
    Readable.call(this, options);
    this._helper = helper;

    var self = this;
    helper.on("data", function (data, meta) {
        if (!self.push(data)) {
            self._helper.pause();
        }
        if(updateCb) {
            updateCb(meta);
        }
    })
    .on("error", function(e) {
        self.emit('error', e);
    })
    .on("end", function () {
        self.push(null);
    });
}


NodejsStreamOutputAdapter.prototype._read = function() {
    this._helper.resume();
};

module.exports = NodejsStreamOutputAdapter;


/***/ }),

/***/ "./node_modules/jszip/lib/nodejsUtils.js":
/*!***********************************************!*\
  !*** ./node_modules/jszip/lib/nodejsUtils.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";


module.exports = {
    /**
     * True if this is running in Nodejs, will be undefined in a browser.
     * In a browser, browserify won't include this file and the whole module
     * will be resolved an empty object.
     */
    isNode : typeof Buffer !== "undefined",
    /**
     * Create a new nodejs Buffer from an existing content.
     * @param {Object} data the data to pass to the constructor.
     * @param {String} encoding the encoding to use.
     * @return {Buffer} a new Buffer.
     */
    newBufferFrom: function(data, encoding) {
        if (Buffer.from && Buffer.from !== Uint8Array.from) {
            return Buffer.from(data, encoding);
        } else {
            if (typeof data === "number") {
                // Safeguard for old Node.js versions. On newer versions,
                // Buffer.from(number) / Buffer(number, encoding) already throw.
                throw new Error("The \"data\" argument must not be a number");
            }
            return new Buffer(data, encoding);
        }
    },
    /**
     * Create a new nodejs Buffer with the specified size.
     * @param {Integer} size the size of the buffer.
     * @return {Buffer} a new Buffer.
     */
    allocBuffer: function (size) {
        if (Buffer.alloc) {
            return Buffer.alloc(size);
        } else {
            var buf = new Buffer(size);
            buf.fill(0);
            return buf;
        }
    },
    /**
     * Find out if an object is a Buffer.
     * @param {Object} b the object to test.
     * @return {Boolean} true if the object is a Buffer, false otherwise.
     */
    isBuffer : function(b){
        return Buffer.isBuffer(b);
    },

    isStream : function (obj) {
        return obj &&
            typeof obj.on === "function" &&
            typeof obj.pause === "function" &&
            typeof obj.resume === "function";
    }
};


/***/ }),

/***/ "./node_modules/jszip/lib/object.js":
/*!******************************************!*\
  !*** ./node_modules/jszip/lib/object.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var utf8 = __webpack_require__(/*! ./utf8 */ "./node_modules/jszip/lib/utf8.js");
var utils = __webpack_require__(/*! ./utils */ "./node_modules/jszip/lib/utils.js");
var GenericWorker = __webpack_require__(/*! ./stream/GenericWorker */ "./node_modules/jszip/lib/stream/GenericWorker.js");
var StreamHelper = __webpack_require__(/*! ./stream/StreamHelper */ "./node_modules/jszip/lib/stream/StreamHelper.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/jszip/lib/defaults.js");
var CompressedObject = __webpack_require__(/*! ./compressedObject */ "./node_modules/jszip/lib/compressedObject.js");
var ZipObject = __webpack_require__(/*! ./zipObject */ "./node_modules/jszip/lib/zipObject.js");
var generate = __webpack_require__(/*! ./generate */ "./node_modules/jszip/lib/generate/index.js");
var nodejsUtils = __webpack_require__(/*! ./nodejsUtils */ "./node_modules/jszip/lib/nodejsUtils.js");
var NodejsStreamInputAdapter = __webpack_require__(/*! ./nodejs/NodejsStreamInputAdapter */ "./node_modules/jszip/lib/nodejs/NodejsStreamInputAdapter.js");


/**
 * Add a file in the current folder.
 * @private
 * @param {string} name the name of the file
 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data of the file
 * @param {Object} originalOptions the options of the file
 * @return {Object} the new file.
 */
var fileAdd = function(name, data, originalOptions) {
    // be sure sub folders exist
    var dataType = utils.getTypeOf(data),
        parent;


    /*
     * Correct options.
     */

    var o = utils.extend(originalOptions || {}, defaults);
    o.date = o.date || new Date();
    if (o.compression !== null) {
        o.compression = o.compression.toUpperCase();
    }

    if (typeof o.unixPermissions === "string") {
        o.unixPermissions = parseInt(o.unixPermissions, 8);
    }

    // UNX_IFDIR  0040000 see zipinfo.c
    if (o.unixPermissions && (o.unixPermissions & 0x4000)) {
        o.dir = true;
    }
    // Bit 4    Directory
    if (o.dosPermissions && (o.dosPermissions & 0x0010)) {
        o.dir = true;
    }

    if (o.dir) {
        name = forceTrailingSlash(name);
    }
    if (o.createFolders && (parent = parentFolder(name))) {
        folderAdd.call(this, parent, true);
    }

    var isUnicodeString = dataType === "string" && o.binary === false && o.base64 === false;
    if (!originalOptions || typeof originalOptions.binary === "undefined") {
        o.binary = !isUnicodeString;
    }


    var isCompressedEmpty = (data instanceof CompressedObject) && data.uncompressedSize === 0;

    if (isCompressedEmpty || o.dir || !data || data.length === 0) {
        o.base64 = false;
        o.binary = true;
        data = "";
        o.compression = "STORE";
        dataType = "string";
    }

    /*
     * Convert content to fit.
     */

    var zipObjectContent = null;
    if (data instanceof CompressedObject || data instanceof GenericWorker) {
        zipObjectContent = data;
    } else if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
        zipObjectContent = new NodejsStreamInputAdapter(name, data);
    } else {
        zipObjectContent = utils.prepareContent(name, data, o.binary, o.optimizedBinaryString, o.base64);
    }

    var object = new ZipObject(name, zipObjectContent, o);
    this.files[name] = object;
    /*
    TODO: we can't throw an exception because we have async promises
    (we can have a promise of a Date() for example) but returning a
    promise is useless because file(name, data) returns the JSZip
    object for chaining. Should we break that to allow the user
    to catch the error ?

    return external.Promise.resolve(zipObjectContent)
    .then(function () {
        return object;
    });
    */
};

/**
 * Find the parent folder of the path.
 * @private
 * @param {string} path the path to use
 * @return {string} the parent folder, or ""
 */
var parentFolder = function (path) {
    if (path.slice(-1) === '/') {
        path = path.substring(0, path.length - 1);
    }
    var lastSlash = path.lastIndexOf('/');
    return (lastSlash > 0) ? path.substring(0, lastSlash) : "";
};

/**
 * Returns the path with a slash at the end.
 * @private
 * @param {String} path the path to check.
 * @return {String} the path with a trailing slash.
 */
var forceTrailingSlash = function(path) {
    // Check the name ends with a /
    if (path.slice(-1) !== "/") {
        path += "/"; // IE doesn't like substr(-1)
    }
    return path;
};

/**
 * Add a (sub) folder in the current folder.
 * @private
 * @param {string} name the folder's name
 * @param {boolean=} [createFolders] If true, automatically create sub
 *  folders. Defaults to false.
 * @return {Object} the new folder.
 */
var folderAdd = function(name, createFolders) {
    createFolders = (typeof createFolders !== 'undefined') ? createFolders : defaults.createFolders;

    name = forceTrailingSlash(name);

    // Does this folder already exist?
    if (!this.files[name]) {
        fileAdd.call(this, name, null, {
            dir: true,
            createFolders: createFolders
        });
    }
    return this.files[name];
};

/**
* Cross-window, cross-Node-context regular expression detection
* @param  {Object}  object Anything
* @return {Boolean}        true if the object is a regular expression,
* false otherwise
*/
function isRegExp(object) {
    return Object.prototype.toString.call(object) === "[object RegExp]";
}

// return the actual prototype of JSZip
var out = {
    /**
     * @see loadAsync
     */
    load: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
    },


    /**
     * Call a callback function for each entry at this folder level.
     * @param {Function} cb the callback function:
     * function (relativePath, file) {...}
     * It takes 2 arguments : the relative path and the file.
     */
    forEach: function(cb) {
        var filename, relativePath, file;
        /* jshint ignore:start */
        // ignore warning about unwanted properties because this.files is a null prototype object
        for (filename in this.files) {
            file = this.files[filename];
            relativePath = filename.slice(this.root.length, filename.length);
            if (relativePath && filename.slice(0, this.root.length) === this.root) { // the file is in the current root
                cb(relativePath, file); // TODO reverse the parameters ? need to be clean AND consistent with the filter search fn...
            }
        }
        /* jshint ignore:end */
    },

    /**
     * Filter nested files/folders with the specified function.
     * @param {Function} search the predicate to use :
     * function (relativePath, file) {...}
     * It takes 2 arguments : the relative path and the file.
     * @return {Array} An array of matching elements.
     */
    filter: function(search) {
        var result = [];
        this.forEach(function (relativePath, entry) {
            if (search(relativePath, entry)) { // the file matches the function
                result.push(entry);
            }

        });
        return result;
    },

    /**
     * Add a file to the zip file, or search a file.
     * @param   {string|RegExp} name The name of the file to add (if data is defined),
     * the name of the file to find (if no data) or a regex to match files.
     * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
     * @param   {Object} o     File options
     * @return  {JSZip|Object|Array} this JSZip object (when adding a file),
     * a file (when searching by string) or an array of files (when searching by regex).
     */
    file: function(name, data, o) {
        if (arguments.length === 1) {
            if (isRegExp(name)) {
                var regexp = name;
                return this.filter(function(relativePath, file) {
                    return !file.dir && regexp.test(relativePath);
                });
            }
            else { // text
                var obj = this.files[this.root + name];
                if (obj && !obj.dir) {
                    return obj;
                } else {
                    return null;
                }
            }
        }
        else { // more than one argument : we have data !
            name = this.root + name;
            fileAdd.call(this, name, data, o);
        }
        return this;
    },

    /**
     * Add a directory to the zip file, or search.
     * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
     * @return  {JSZip} an object with the new directory as the root, or an array containing matching folders.
     */
    folder: function(arg) {
        if (!arg) {
            return this;
        }

        if (isRegExp(arg)) {
            return this.filter(function(relativePath, file) {
                return file.dir && arg.test(relativePath);
            });
        }

        // else, name is a new folder
        var name = this.root + arg;
        var newFolder = folderAdd.call(this, name);

        // Allow chaining by returning a new object with this folder as the root
        var ret = this.clone();
        ret.root = newFolder.name;
        return ret;
    },

    /**
     * Delete a file, or a directory and all sub-files, from the zip
     * @param {string} name the name of the file to delete
     * @return {JSZip} this JSZip object
     */
    remove: function(name) {
        name = this.root + name;
        var file = this.files[name];
        if (!file) {
            // Look for any folders
            if (name.slice(-1) !== "/") {
                name += "/";
            }
            file = this.files[name];
        }

        if (file && !file.dir) {
            // file
            delete this.files[name];
        } else {
            // maybe a folder, delete recursively
            var kids = this.filter(function(relativePath, file) {
                return file.name.slice(0, name.length) === name;
            });
            for (var i = 0; i < kids.length; i++) {
                delete this.files[kids[i].name];
            }
        }

        return this;
    },

    /**
     * Generate the complete zip file
     * @param {Object} options the options to generate the zip file :
     * - compression, "STORE" by default.
     * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
     * @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the zip file
     */
    generate: function(options) {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
    },

    /**
     * Generate the complete zip file as an internal stream.
     * @param {Object} options the options to generate the zip file :
     * - compression, "STORE" by default.
     * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
     * @return {StreamHelper} the streamed zip file.
     */
    generateInternalStream: function(options) {
      var worker, opts = {};
      try {
          opts = utils.extend(options || {}, {
              streamFiles: false,
              compression: "STORE",
              compressionOptions : null,
              type: "",
              platform: "DOS",
              comment: null,
              mimeType: 'application/zip',
              encodeFileName: utf8.utf8encode
          });

          opts.type = opts.type.toLowerCase();
          opts.compression = opts.compression.toUpperCase();

          // "binarystring" is preferred but the internals use "string".
          if(opts.type === "binarystring") {
            opts.type = "string";
          }

          if (!opts.type) {
            throw new Error("No output type specified.");
          }

          utils.checkSupport(opts.type);

          // accept nodejs `process.platform`
          if(
              opts.platform === 'darwin' ||
              opts.platform === 'freebsd' ||
              opts.platform === 'linux' ||
              opts.platform === 'sunos'
          ) {
              opts.platform = "UNIX";
          }
          if (opts.platform === 'win32') {
              opts.platform = "DOS";
          }

          var comment = opts.comment || this.comment || "";
          worker = generate.generateWorker(this, opts, comment);
      } catch (e) {
        worker = new GenericWorker("error");
        worker.error(e);
      }
      return new StreamHelper(worker, opts.type || "string", opts.mimeType);
    },
    /**
     * Generate the complete zip file asynchronously.
     * @see generateInternalStream
     */
    generateAsync: function(options, onUpdate) {
        return this.generateInternalStream(options).accumulate(onUpdate);
    },
    /**
     * Generate the complete zip file asynchronously.
     * @see generateInternalStream
     */
    generateNodeStream: function(options, onUpdate) {
        options = options || {};
        if (!options.type) {
            options.type = "nodebuffer";
        }
        return this.generateInternalStream(options).toNodejsStream(onUpdate);
    }
};
module.exports = out;


/***/ }),

/***/ "./node_modules/jszip/lib/readable-stream-browser.js":
/*!***********************************************************!*\
  !*** ./node_modules/jszip/lib/readable-stream-browser.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * This file is used by module bundlers (browserify/webpack/etc) when
 * including a stream implementation. We use "readable-stream" to get a
 * consistent behavior between nodejs versions but bundlers often have a shim
 * for "stream". Using this shim greatly improve the compatibility and greatly
 * reduce the final size of the bundle (only one stream implementation, not
 * two).
 */
module.exports = __webpack_require__(/*! stream */ "?1172");


/***/ }),

/***/ "./node_modules/jszip/lib/reader/ArrayReader.js":
/*!******************************************************!*\
  !*** ./node_modules/jszip/lib/reader/ArrayReader.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DataReader = __webpack_require__(/*! ./DataReader */ "./node_modules/jszip/lib/reader/DataReader.js");
var utils = __webpack_require__(/*! ../utils */ "./node_modules/jszip/lib/utils.js");

function ArrayReader(data) {
    DataReader.call(this, data);
	for(var i = 0; i < this.data.length; i++) {
		data[i] = data[i] & 0xFF;
	}
}
utils.inherits(ArrayReader, DataReader);
/**
 * @see DataReader.byteAt
 */
ArrayReader.prototype.byteAt = function(i) {
    return this.data[this.zero + i];
};
/**
 * @see DataReader.lastIndexOfSignature
 */
ArrayReader.prototype.lastIndexOfSignature = function(sig) {
    var sig0 = sig.charCodeAt(0),
        sig1 = sig.charCodeAt(1),
        sig2 = sig.charCodeAt(2),
        sig3 = sig.charCodeAt(3);
    for (var i = this.length - 4; i >= 0; --i) {
        if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
            return i - this.zero;
        }
    }

    return -1;
};
/**
 * @see DataReader.readAndCheckSignature
 */
ArrayReader.prototype.readAndCheckSignature = function (sig) {
    var sig0 = sig.charCodeAt(0),
        sig1 = sig.charCodeAt(1),
        sig2 = sig.charCodeAt(2),
        sig3 = sig.charCodeAt(3),
        data = this.readData(4);
    return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
};
/**
 * @see DataReader.readData
 */
ArrayReader.prototype.readData = function(size) {
    this.checkOffset(size);
    if(size === 0) {
        return [];
    }
    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
};
module.exports = ArrayReader;


/***/ }),

/***/ "./node_modules/jszip/lib/reader/DataReader.js":
/*!*****************************************************!*\
  !*** ./node_modules/jszip/lib/reader/DataReader.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var utils = __webpack_require__(/*! ../utils */ "./node_modules/jszip/lib/utils.js");

function DataReader(data) {
    this.data = data; // type : see implementation
    this.length = data.length;
    this.index = 0;
    this.zero = 0;
}
DataReader.prototype = {
    /**
     * Check that the offset will not go too far.
     * @param {string} offset the additional offset to check.
     * @throws {Error} an Error if the offset is out of bounds.
     */
    checkOffset: function(offset) {
        this.checkIndex(this.index + offset);
    },
    /**
     * Check that the specified index will not be too far.
     * @param {string} newIndex the index to check.
     * @throws {Error} an Error if the index is out of bounds.
     */
    checkIndex: function(newIndex) {
        if (this.length < this.zero + newIndex || newIndex < 0) {
            throw new Error("End of data reached (data length = " + this.length + ", asked index = " + (newIndex) + "). Corrupted zip ?");
        }
    },
    /**
     * Change the index.
     * @param {number} newIndex The new index.
     * @throws {Error} if the new index is out of the data.
     */
    setIndex: function(newIndex) {
        this.checkIndex(newIndex);
        this.index = newIndex;
    },
    /**
     * Skip the next n bytes.
     * @param {number} n the number of bytes to skip.
     * @throws {Error} if the new index is out of the data.
     */
    skip: function(n) {
        this.setIndex(this.index + n);
    },
    /**
     * Get the byte at the specified index.
     * @param {number} i the index to use.
     * @return {number} a byte.
     */
    byteAt: function(i) {
        // see implementations
    },
    /**
     * Get the next number with a given byte size.
     * @param {number} size the number of bytes to read.
     * @return {number} the corresponding number.
     */
    readInt: function(size) {
        var result = 0,
            i;
        this.checkOffset(size);
        for (i = this.index + size - 1; i >= this.index; i--) {
            result = (result << 8) + this.byteAt(i);
        }
        this.index += size;
        return result;
    },
    /**
     * Get the next string with a given byte size.
     * @param {number} size the number of bytes to read.
     * @return {string} the corresponding string.
     */
    readString: function(size) {
        return utils.transformTo("string", this.readData(size));
    },
    /**
     * Get raw data without conversion, <size> bytes.
     * @param {number} size the number of bytes to read.
     * @return {Object} the raw data, implementation specific.
     */
    readData: function(size) {
        // see implementations
    },
    /**
     * Find the last occurrence of a zip signature (4 bytes).
     * @param {string} sig the signature to find.
     * @return {number} the index of the last occurrence, -1 if not found.
     */
    lastIndexOfSignature: function(sig) {
        // see implementations
    },
    /**
     * Read the signature (4 bytes) at the current position and compare it with sig.
     * @param {string} sig the expected signature
     * @return {boolean} true if the signature matches, false otherwise.
     */
    readAndCheckSignature: function(sig) {
        // see implementations
    },
    /**
     * Get the next date.
     * @return {Date} the date.
     */
    readDate: function() {
        var dostime = this.readInt(4);
        return new Date(Date.UTC(
        ((dostime >> 25) & 0x7f) + 1980, // year
        ((dostime >> 21) & 0x0f) - 1, // month
        (dostime >> 16) & 0x1f, // day
        (dostime >> 11) & 0x1f, // hour
        (dostime >> 5) & 0x3f, // minute
        (dostime & 0x1f) << 1)); // second
    }
};
module.exports = DataReader;


/***/ }),

/***/ "./node_modules/jszip/lib/reader/NodeBufferReader.js":
/*!***********************************************************!*\
  !*** ./node_modules/jszip/lib/reader/NodeBufferReader.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var Uint8ArrayReader = __webpack_require__(/*! ./Uint8ArrayReader */ "./node_modules/jszip/lib/reader/Uint8ArrayReader.js");
var utils = __webpack_require__(/*! ../utils */ "./node_modules/jszip/lib/utils.js");

function NodeBufferReader(data) {
    Uint8ArrayReader.call(this, data);
}
utils.inherits(NodeBufferReader, Uint8ArrayReader);

/**
 * @see DataReader.readData
 */
NodeBufferReader.prototype.readData = function(size) {
    this.checkOffset(size);
    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
};
module.exports = NodeBufferReader;


/***/ }),

/***/ "./node_modules/jszip/lib/reader/StringReader.js":
/*!*******************************************************!*\
  !*** ./node_modules/jszip/lib/reader/StringReader.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DataReader = __webpack_require__(/*! ./DataReader */ "./node_modules/jszip/lib/reader/DataReader.js");
var utils = __webpack_require__(/*! ../utils */ "./node_modules/jszip/lib/utils.js");

function StringReader(data) {
    DataReader.call(this, data);
}
utils.inherits(StringReader, DataReader);
/**
 * @see DataReader.byteAt
 */
StringReader.prototype.byteAt = function(i) {
    return this.data.charCodeAt(this.zero + i);
};
/**
 * @see DataReader.lastIndexOfSignature
 */
StringReader.prototype.lastIndexOfSignature = function(sig) {
    return this.data.lastIndexOf(sig) - this.zero;
};
/**
 * @see DataReader.readAndCheckSignature
 */
StringReader.prototype.readAndCheckSignature = function (sig) {
    var data = this.readData(4);
    return sig === data;
};
/**
 * @see DataReader.readData
 */
StringReader.prototype.readData = function(size) {
    this.checkOffset(size);
    // this will work because the constructor applied the "& 0xff" mask.
    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
};
module.exports = StringReader;


/***/ }),

/***/ "./node_modules/jszip/lib/reader/Uint8ArrayReader.js":
/*!***********************************************************!*\
  !*** ./node_modules/jszip/lib/reader/Uint8ArrayReader.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var ArrayReader = __webpack_require__(/*! ./ArrayReader */ "./node_modules/jszip/lib/reader/ArrayReader.js");
var utils = __webpack_require__(/*! ../utils */ "./node_modules/jszip/lib/utils.js");

function Uint8ArrayReader(data) {
    ArrayReader.call(this, data);
}
utils.inherits(Uint8ArrayReader, ArrayReader);
/**
 * @see DataReader.readData
 */
Uint8ArrayReader.prototype.readData = function(size) {
    this.checkOffset(size);
    if(size === 0) {
        // in IE10, when using subarray(idx, idx), we get the array [0x00] instead of [].
        return new Uint8Array(0);
    }
    var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
};
module.exports = Uint8ArrayReader;


/***/ }),

/***/ "./node_modules/jszip/lib/reader/readerFor.js":
/*!****************************************************!*\
  !*** ./node_modules/jszip/lib/reader/readerFor.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/jszip/lib/utils.js");
var support = __webpack_require__(/*! ../support */ "./node_modules/jszip/lib/support.js");
var ArrayReader = __webpack_require__(/*! ./ArrayReader */ "./node_modules/jszip/lib/reader/ArrayReader.js");
var StringReader = __webpack_require__(/*! ./StringReader */ "./node_modules/jszip/lib/reader/StringReader.js");
var NodeBufferReader = __webpack_require__(/*! ./NodeBufferReader */ "./node_modules/jszip/lib/reader/NodeBufferReader.js");
var Uint8ArrayReader = __webpack_require__(/*! ./Uint8ArrayReader */ "./node_modules/jszip/lib/reader/Uint8ArrayReader.js");

/**
 * Create a reader adapted to the data.
 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data to read.
 * @return {DataReader} the data reader.
 */
module.exports = function (data) {
    var type = utils.getTypeOf(data);
    utils.checkSupport(type);
    if (type === "string" && !support.uint8array) {
        return new StringReader(data);
    }
    if (type === "nodebuffer") {
        return new NodeBufferReader(data);
    }
    if (support.uint8array) {
        return new Uint8ArrayReader(utils.transformTo("uint8array", data));
    }
    return new ArrayReader(utils.transformTo("array", data));
};


/***/ }),

/***/ "./node_modules/jszip/lib/signature.js":
/*!*********************************************!*\
  !*** ./node_modules/jszip/lib/signature.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.LOCAL_FILE_HEADER = "PK\x03\x04";
exports.CENTRAL_FILE_HEADER = "PK\x01\x02";
exports.CENTRAL_DIRECTORY_END = "PK\x05\x06";
exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x06\x07";
exports.ZIP64_CENTRAL_DIRECTORY_END = "PK\x06\x06";
exports.DATA_DESCRIPTOR = "PK\x07\x08";


/***/ }),

/***/ "./node_modules/jszip/lib/stream/ConvertWorker.js":
/*!********************************************************!*\
  !*** ./node_modules/jszip/lib/stream/ConvertWorker.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GenericWorker = __webpack_require__(/*! ./GenericWorker */ "./node_modules/jszip/lib/stream/GenericWorker.js");
var utils = __webpack_require__(/*! ../utils */ "./node_modules/jszip/lib/utils.js");

/**
 * A worker which convert chunks to a specified type.
 * @constructor
 * @param {String} destType the destination type.
 */
function ConvertWorker(destType) {
    GenericWorker.call(this, "ConvertWorker to " + destType);
    this.destType = destType;
}
utils.inherits(ConvertWorker, GenericWorker);

/**
 * @see GenericWorker.processChunk
 */
ConvertWorker.prototype.processChunk = function (chunk) {
    this.push({
        data : utils.transformTo(this.destType, chunk.data),
        meta : chunk.meta
    });
};
module.exports = ConvertWorker;


/***/ }),

/***/ "./node_modules/jszip/lib/stream/Crc32Probe.js":
/*!*****************************************************!*\
  !*** ./node_modules/jszip/lib/stream/Crc32Probe.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GenericWorker = __webpack_require__(/*! ./GenericWorker */ "./node_modules/jszip/lib/stream/GenericWorker.js");
var crc32 = __webpack_require__(/*! ../crc32 */ "./node_modules/jszip/lib/crc32.js");
var utils = __webpack_require__(/*! ../utils */ "./node_modules/jszip/lib/utils.js");

/**
 * A worker which calculate the crc32 of the data flowing through.
 * @constructor
 */
function Crc32Probe() {
    GenericWorker.call(this, "Crc32Probe");
    this.withStreamInfo("crc32", 0);
}
utils.inherits(Crc32Probe, GenericWorker);

/**
 * @see GenericWorker.processChunk
 */
Crc32Probe.prototype.processChunk = function (chunk) {
    this.streamInfo.crc32 = crc32(chunk.data, this.streamInfo.crc32 || 0);
    this.push(chunk);
};
module.exports = Crc32Probe;


/***/ }),

/***/ "./node_modules/jszip/lib/stream/DataLengthProbe.js":
/*!**********************************************************!*\
  !*** ./node_modules/jszip/lib/stream/DataLengthProbe.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/jszip/lib/utils.js");
var GenericWorker = __webpack_require__(/*! ./GenericWorker */ "./node_modules/jszip/lib/stream/GenericWorker.js");

/**
 * A worker which calculate the total length of the data flowing through.
 * @constructor
 * @param {String} propName the name used to expose the length
 */
function DataLengthProbe(propName) {
    GenericWorker.call(this, "DataLengthProbe for " + propName);
    this.propName = propName;
    this.withStreamInfo(propName, 0);
}
utils.inherits(DataLengthProbe, GenericWorker);

/**
 * @see GenericWorker.processChunk
 */
DataLengthProbe.prototype.processChunk = function (chunk) {
    if(chunk) {
        var length = this.streamInfo[this.propName] || 0;
        this.streamInfo[this.propName] = length + chunk.data.length;
    }
    GenericWorker.prototype.processChunk.call(this, chunk);
};
module.exports = DataLengthProbe;



/***/ }),

/***/ "./node_modules/jszip/lib/stream/DataWorker.js":
/*!*****************************************************!*\
  !*** ./node_modules/jszip/lib/stream/DataWorker.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/jszip/lib/utils.js");
var GenericWorker = __webpack_require__(/*! ./GenericWorker */ "./node_modules/jszip/lib/stream/GenericWorker.js");

// the size of the generated chunks
// TODO expose this as a public variable
var DEFAULT_BLOCK_SIZE = 16 * 1024;

/**
 * A worker that reads a content and emits chunks.
 * @constructor
 * @param {Promise} dataP the promise of the data to split
 */
function DataWorker(dataP) {
    GenericWorker.call(this, "DataWorker");
    var self = this;
    this.dataIsReady = false;
    this.index = 0;
    this.max = 0;
    this.data = null;
    this.type = "";

    this._tickScheduled = false;

    dataP.then(function (data) {
        self.dataIsReady = true;
        self.data = data;
        self.max = data && data.length || 0;
        self.type = utils.getTypeOf(data);
        if(!self.isPaused) {
            self._tickAndRepeat();
        }
    }, function (e) {
        self.error(e);
    });
}

utils.inherits(DataWorker, GenericWorker);

/**
 * @see GenericWorker.cleanUp
 */
DataWorker.prototype.cleanUp = function () {
    GenericWorker.prototype.cleanUp.call(this);
    this.data = null;
};

/**
 * @see GenericWorker.resume
 */
DataWorker.prototype.resume = function () {
    if(!GenericWorker.prototype.resume.call(this)) {
        return false;
    }

    if (!this._tickScheduled && this.dataIsReady) {
        this._tickScheduled = true;
        utils.delay(this._tickAndRepeat, [], this);
    }
    return true;
};

/**
 * Trigger a tick a schedule an other call to this function.
 */
DataWorker.prototype._tickAndRepeat = function() {
    this._tickScheduled = false;
    if(this.isPaused || this.isFinished) {
        return;
    }
    this._tick();
    if(!this.isFinished) {
        utils.delay(this._tickAndRepeat, [], this);
        this._tickScheduled = true;
    }
};

/**
 * Read and push a chunk.
 */
DataWorker.prototype._tick = function() {

    if(this.isPaused || this.isFinished) {
        return false;
    }

    var size = DEFAULT_BLOCK_SIZE;
    var data = null, nextIndex = Math.min(this.max, this.index + size);
    if (this.index >= this.max) {
        // EOF
        return this.end();
    } else {
        switch(this.type) {
            case "string":
                data = this.data.substring(this.index, nextIndex);
            break;
            case "uint8array":
                data = this.data.subarray(this.index, nextIndex);
            break;
            case "array":
            case "nodebuffer":
                data = this.data.slice(this.index, nextIndex);
            break;
        }
        this.index = nextIndex;
        return this.push({
            data : data,
            meta : {
                percent : this.max ? this.index / this.max * 100 : 0
            }
        });
    }
};

module.exports = DataWorker;


/***/ }),

/***/ "./node_modules/jszip/lib/stream/GenericWorker.js":
/*!********************************************************!*\
  !*** ./node_modules/jszip/lib/stream/GenericWorker.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * A worker that does nothing but passing chunks to the next one. This is like
 * a nodejs stream but with some differences. On the good side :
 * - it works on IE 6-9 without any issue / polyfill
 * - it weights less than the full dependencies bundled with browserify
 * - it forwards errors (no need to declare an error handler EVERYWHERE)
 *
 * A chunk is an object with 2 attributes : `meta` and `data`. The former is an
 * object containing anything (`percent` for example), see each worker for more
 * details. The latter is the real data (String, Uint8Array, etc).
 *
 * @constructor
 * @param {String} name the name of the stream (mainly used for debugging purposes)
 */
function GenericWorker(name) {
    // the name of the worker
    this.name = name || "default";
    // an object containing metadata about the workers chain
    this.streamInfo = {};
    // an error which happened when the worker was paused
    this.generatedError = null;
    // an object containing metadata to be merged by this worker into the general metadata
    this.extraStreamInfo = {};
    // true if the stream is paused (and should not do anything), false otherwise
    this.isPaused = true;
    // true if the stream is finished (and should not do anything), false otherwise
    this.isFinished = false;
    // true if the stream is locked to prevent further structure updates (pipe), false otherwise
    this.isLocked = false;
    // the event listeners
    this._listeners = {
        'data':[],
        'end':[],
        'error':[]
    };
    // the previous worker, if any
    this.previous = null;
}

GenericWorker.prototype = {
    /**
     * Push a chunk to the next workers.
     * @param {Object} chunk the chunk to push
     */
    push : function (chunk) {
        this.emit("data", chunk);
    },
    /**
     * End the stream.
     * @return {Boolean} true if this call ended the worker, false otherwise.
     */
    end : function () {
        if (this.isFinished) {
            return false;
        }

        this.flush();
        try {
            this.emit("end");
            this.cleanUp();
            this.isFinished = true;
        } catch (e) {
            this.emit("error", e);
        }
        return true;
    },
    /**
     * End the stream with an error.
     * @param {Error} e the error which caused the premature end.
     * @return {Boolean} true if this call ended the worker with an error, false otherwise.
     */
    error : function (e) {
        if (this.isFinished) {
            return false;
        }

        if(this.isPaused) {
            this.generatedError = e;
        } else {
            this.isFinished = true;

            this.emit("error", e);

            // in the workers chain exploded in the middle of the chain,
            // the error event will go downward but we also need to notify
            // workers upward that there has been an error.
            if(this.previous) {
                this.previous.error(e);
            }

            this.cleanUp();
        }
        return true;
    },
    /**
     * Add a callback on an event.
     * @param {String} name the name of the event (data, end, error)
     * @param {Function} listener the function to call when the event is triggered
     * @return {GenericWorker} the current object for chainability
     */
    on : function (name, listener) {
        this._listeners[name].push(listener);
        return this;
    },
    /**
     * Clean any references when a worker is ending.
     */
    cleanUp : function () {
        this.streamInfo = this.generatedError = this.extraStreamInfo = null;
        this._listeners = [];
    },
    /**
     * Trigger an event. This will call registered callback with the provided arg.
     * @param {String} name the name of the event (data, end, error)
     * @param {Object} arg the argument to call the callback with.
     */
    emit : function (name, arg) {
        if (this._listeners[name]) {
            for(var i = 0; i < this._listeners[name].length; i++) {
                this._listeners[name][i].call(this, arg);
            }
        }
    },
    /**
     * Chain a worker with an other.
     * @param {Worker} next the worker receiving events from the current one.
     * @return {worker} the next worker for chainability
     */
    pipe : function (next) {
        return next.registerPrevious(this);
    },
    /**
     * Same as `pipe` in the other direction.
     * Using an API with `pipe(next)` is very easy.
     * Implementing the API with the point of view of the next one registering
     * a source is easier, see the ZipFileWorker.
     * @param {Worker} previous the previous worker, sending events to this one
     * @return {Worker} the current worker for chainability
     */
    registerPrevious : function (previous) {
        if (this.isLocked) {
            throw new Error("The stream '" + this + "' has already been used.");
        }

        // sharing the streamInfo...
        this.streamInfo = previous.streamInfo;
        // ... and adding our own bits
        this.mergeStreamInfo();
        this.previous =  previous;
        var self = this;
        previous.on('data', function (chunk) {
            self.processChunk(chunk);
        });
        previous.on('end', function () {
            self.end();
        });
        previous.on('error', function (e) {
            self.error(e);
        });
        return this;
    },
    /**
     * Pause the stream so it doesn't send events anymore.
     * @return {Boolean} true if this call paused the worker, false otherwise.
     */
    pause : function () {
        if(this.isPaused || this.isFinished) {
            return false;
        }
        this.isPaused = true;

        if(this.previous) {
            this.previous.pause();
        }
        return true;
    },
    /**
     * Resume a paused stream.
     * @return {Boolean} true if this call resumed the worker, false otherwise.
     */
    resume : function () {
        if(!this.isPaused || this.isFinished) {
            return false;
        }
        this.isPaused = false;

        // if true, the worker tried to resume but failed
        var withError = false;
        if(this.generatedError) {
            this.error(this.generatedError);
            withError = true;
        }
        if(this.previous) {
            this.previous.resume();
        }

        return !withError;
    },
    /**
     * Flush any remaining bytes as the stream is ending.
     */
    flush : function () {},
    /**
     * Process a chunk. This is usually the method overridden.
     * @param {Object} chunk the chunk to process.
     */
    processChunk : function(chunk) {
        this.push(chunk);
    },
    /**
     * Add a key/value to be added in the workers chain streamInfo once activated.
     * @param {String} key the key to use
     * @param {Object} value the associated value
     * @return {Worker} the current worker for chainability
     */
    withStreamInfo : function (key, value) {
        this.extraStreamInfo[key] = value;
        this.mergeStreamInfo();
        return this;
    },
    /**
     * Merge this worker's streamInfo into the chain's streamInfo.
     */
    mergeStreamInfo : function () {
        for(var key in this.extraStreamInfo) {
            if (!this.extraStreamInfo.hasOwnProperty(key)) {
                continue;
            }
            this.streamInfo[key] = this.extraStreamInfo[key];
        }
    },

    /**
     * Lock the stream to prevent further updates on the workers chain.
     * After calling this method, all calls to pipe will fail.
     */
    lock: function () {
        if (this.isLocked) {
            throw new Error("The stream '" + this + "' has already been used.");
        }
        this.isLocked = true;
        if (this.previous) {
            this.previous.lock();
        }
    },

    /**
     *
     * Pretty print the workers chain.
     */
    toString : function () {
        var me = "Worker " + this.name;
        if (this.previous) {
            return this.previous + " -> " + me;
        } else {
            return me;
        }
    }
};

module.exports = GenericWorker;


/***/ }),

/***/ "./node_modules/jszip/lib/stream/StreamHelper.js":
/*!*******************************************************!*\
  !*** ./node_modules/jszip/lib/stream/StreamHelper.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/jszip/lib/utils.js");
var ConvertWorker = __webpack_require__(/*! ./ConvertWorker */ "./node_modules/jszip/lib/stream/ConvertWorker.js");
var GenericWorker = __webpack_require__(/*! ./GenericWorker */ "./node_modules/jszip/lib/stream/GenericWorker.js");
var base64 = __webpack_require__(/*! ../base64 */ "./node_modules/jszip/lib/base64.js");
var support = __webpack_require__(/*! ../support */ "./node_modules/jszip/lib/support.js");
var external = __webpack_require__(/*! ../external */ "./node_modules/jszip/lib/external.js");

var NodejsStreamOutputAdapter = null;
if (support.nodestream) {
    try {
        NodejsStreamOutputAdapter = __webpack_require__(/*! ../nodejs/NodejsStreamOutputAdapter */ "./node_modules/jszip/lib/nodejs/NodejsStreamOutputAdapter.js");
    } catch(e) {}
}

/**
 * Apply the final transformation of the data. If the user wants a Blob for
 * example, it's easier to work with an U8intArray and finally do the
 * ArrayBuffer/Blob conversion.
 * @param {String} type the name of the final type
 * @param {String|Uint8Array|Buffer} content the content to transform
 * @param {String} mimeType the mime type of the content, if applicable.
 * @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the content in the right format.
 */
function transformZipOutput(type, content, mimeType) {
    switch(type) {
        case "blob" :
            return utils.newBlob(utils.transformTo("arraybuffer", content), mimeType);
        case "base64" :
            return base64.encode(content);
        default :
            return utils.transformTo(type, content);
    }
}

/**
 * Concatenate an array of data of the given type.
 * @param {String} type the type of the data in the given array.
 * @param {Array} dataArray the array containing the data chunks to concatenate
 * @return {String|Uint8Array|Buffer} the concatenated data
 * @throws Error if the asked type is unsupported
 */
function concat (type, dataArray) {
    var i, index = 0, res = null, totalLength = 0;
    for(i = 0; i < dataArray.length; i++) {
        totalLength += dataArray[i].length;
    }
    switch(type) {
        case "string":
            return dataArray.join("");
          case "array":
            return Array.prototype.concat.apply([], dataArray);
        case "uint8array":
            res = new Uint8Array(totalLength);
            for(i = 0; i < dataArray.length; i++) {
                res.set(dataArray[i], index);
                index += dataArray[i].length;
            }
            return res;
        case "nodebuffer":
            return Buffer.concat(dataArray);
        default:
            throw new Error("concat : unsupported type '"  + type + "'");
    }
}

/**
 * Listen a StreamHelper, accumulate its content and concatenate it into a
 * complete block.
 * @param {StreamHelper} helper the helper to use.
 * @param {Function} updateCallback a callback called on each update. Called
 * with one arg :
 * - the metadata linked to the update received.
 * @return Promise the promise for the accumulation.
 */
function accumulate(helper, updateCallback) {
    return new external.Promise(function (resolve, reject){
        var dataArray = [];
        var chunkType = helper._internalType,
            resultType = helper._outputType,
            mimeType = helper._mimeType;
        helper
        .on('data', function (data, meta) {
            dataArray.push(data);
            if(updateCallback) {
                updateCallback(meta);
            }
        })
        .on('error', function(err) {
            dataArray = [];
            reject(err);
        })
        .on('end', function (){
            try {
                var result = transformZipOutput(resultType, concat(chunkType, dataArray), mimeType);
                resolve(result);
            } catch (e) {
                reject(e);
            }
            dataArray = [];
        })
        .resume();
    });
}

/**
 * An helper to easily use workers outside of JSZip.
 * @constructor
 * @param {Worker} worker the worker to wrap
 * @param {String} outputType the type of data expected by the use
 * @param {String} mimeType the mime type of the content, if applicable.
 */
function StreamHelper(worker, outputType, mimeType) {
    var internalType = outputType;
    switch(outputType) {
        case "blob":
        case "arraybuffer":
            internalType = "uint8array";
        break;
        case "base64":
            internalType = "string";
        break;
    }

    try {
        // the type used internally
        this._internalType = internalType;
        // the type used to output results
        this._outputType = outputType;
        // the mime type
        this._mimeType = mimeType;
        utils.checkSupport(internalType);
        this._worker = worker.pipe(new ConvertWorker(internalType));
        // the last workers can be rewired without issues but we need to
        // prevent any updates on previous workers.
        worker.lock();
    } catch(e) {
        this._worker = new GenericWorker("error");
        this._worker.error(e);
    }
}

StreamHelper.prototype = {
    /**
     * Listen a StreamHelper, accumulate its content and concatenate it into a
     * complete block.
     * @param {Function} updateCb the update callback.
     * @return Promise the promise for the accumulation.
     */
    accumulate : function (updateCb) {
        return accumulate(this, updateCb);
    },
    /**
     * Add a listener on an event triggered on a stream.
     * @param {String} evt the name of the event
     * @param {Function} fn the listener
     * @return {StreamHelper} the current helper.
     */
    on : function (evt, fn) {
        var self = this;

        if(evt === "data") {
            this._worker.on(evt, function (chunk) {
                fn.call(self, chunk.data, chunk.meta);
            });
        } else {
            this._worker.on(evt, function () {
                utils.delay(fn, arguments, self);
            });
        }
        return this;
    },
    /**
     * Resume the flow of chunks.
     * @return {StreamHelper} the current helper.
     */
    resume : function () {
        utils.delay(this._worker.resume, [], this._worker);
        return this;
    },
    /**
     * Pause the flow of chunks.
     * @return {StreamHelper} the current helper.
     */
    pause : function () {
        this._worker.pause();
        return this;
    },
    /**
     * Return a nodejs stream for this helper.
     * @param {Function} updateCb the update callback.
     * @return {NodejsStreamOutputAdapter} the nodejs stream.
     */
    toNodejsStream : function (updateCb) {
        utils.checkSupport("nodestream");
        if (this._outputType !== "nodebuffer") {
            // an object stream containing blob/arraybuffer/uint8array/string
            // is strange and I don't know if it would be useful.
            // I you find this comment and have a good usecase, please open a
            // bug report !
            throw new Error(this._outputType + " is not supported by this method");
        }

        return new NodejsStreamOutputAdapter(this, {
            objectMode : this._outputType !== "nodebuffer"
        }, updateCb);
    }
};


module.exports = StreamHelper;


/***/ }),

/***/ "./node_modules/jszip/lib/support.js":
/*!*******************************************!*\
  !*** ./node_modules/jszip/lib/support.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.base64 = true;
exports.array = true;
exports.string = true;
exports.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
exports.nodebuffer = typeof Buffer !== "undefined";
// contains true if JSZip can read/generate Uint8Array, false otherwise.
exports.uint8array = typeof Uint8Array !== "undefined";

if (typeof ArrayBuffer === "undefined") {
    exports.blob = false;
}
else {
    var buffer = new ArrayBuffer(0);
    try {
        exports.blob = new Blob([buffer], {
            type: "application/zip"
        }).size === 0;
    }
    catch (e) {
        try {
            var Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
            var builder = new Builder();
            builder.append(buffer);
            exports.blob = builder.getBlob('application/zip').size === 0;
        }
        catch (e) {
            exports.blob = false;
        }
    }
}

try {
    exports.nodestream = !!(__webpack_require__(/*! readable-stream */ "./node_modules/jszip/lib/readable-stream-browser.js").Readable);
} catch(e) {
    exports.nodestream = false;
}


/***/ }),

/***/ "./node_modules/jszip/lib/utf8.js":
/*!****************************************!*\
  !*** ./node_modules/jszip/lib/utf8.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/jszip/lib/utils.js");
var support = __webpack_require__(/*! ./support */ "./node_modules/jszip/lib/support.js");
var nodejsUtils = __webpack_require__(/*! ./nodejsUtils */ "./node_modules/jszip/lib/nodejsUtils.js");
var GenericWorker = __webpack_require__(/*! ./stream/GenericWorker */ "./node_modules/jszip/lib/stream/GenericWorker.js");

/**
 * The following functions come from pako, from pako/lib/utils/strings
 * released under the MIT license, see pako https://github.com/nodeca/pako/
 */

// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
var _utf8len = new Array(256);
for (var i=0; i<256; i++) {
  _utf8len[i] = (i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1);
}
_utf8len[254]=_utf8len[254]=1; // Invalid sequence start

// convert string to array (typed, when possible)
var string2buf = function (str) {
    var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

    // count binary size
    for (m_pos = 0; m_pos < str_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 0xfc00) === 0xd800 && (m_pos+1 < str_len)) {
            c2 = str.charCodeAt(m_pos+1);
            if ((c2 & 0xfc00) === 0xdc00) {
                c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
                m_pos++;
            }
        }
        buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
    }

    // allocate buffer
    if (support.uint8array) {
        buf = new Uint8Array(buf_len);
    } else {
        buf = new Array(buf_len);
    }

    // convert
    for (i=0, m_pos = 0; i < buf_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 0xfc00) === 0xd800 && (m_pos+1 < str_len)) {
            c2 = str.charCodeAt(m_pos+1);
            if ((c2 & 0xfc00) === 0xdc00) {
                c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
                m_pos++;
            }
        }
        if (c < 0x80) {
            /* one byte */
            buf[i++] = c;
        } else if (c < 0x800) {
            /* two bytes */
            buf[i++] = 0xC0 | (c >>> 6);
            buf[i++] = 0x80 | (c & 0x3f);
        } else if (c < 0x10000) {
            /* three bytes */
            buf[i++] = 0xE0 | (c >>> 12);
            buf[i++] = 0x80 | (c >>> 6 & 0x3f);
            buf[i++] = 0x80 | (c & 0x3f);
        } else {
            /* four bytes */
            buf[i++] = 0xf0 | (c >>> 18);
            buf[i++] = 0x80 | (c >>> 12 & 0x3f);
            buf[i++] = 0x80 | (c >>> 6 & 0x3f);
            buf[i++] = 0x80 | (c & 0x3f);
        }
    }

    return buf;
};

// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
var utf8border = function(buf, max) {
    var pos;

    max = max || buf.length;
    if (max > buf.length) { max = buf.length; }

    // go back from last position, until start of sequence found
    pos = max-1;
    while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

    // Fuckup - very small and broken sequence,
    // return max, because we should return something anyway.
    if (pos < 0) { return max; }

    // If we came to start of buffer - that means vuffer is too small,
    // return max too.
    if (pos === 0) { return max; }

    return (pos + _utf8len[buf[pos]] > max) ? pos : max;
};

// convert array to string
var buf2string = function (buf) {
    var str, i, out, c, c_len;
    var len = buf.length;

    // Reserve max possible length (2 words per char)
    // NB: by unknown reasons, Array is significantly faster for
    //     String.fromCharCode.apply than Uint16Array.
    var utf16buf = new Array(len*2);

    for (out=0, i=0; i<len;) {
        c = buf[i++];
        // quick process ascii
        if (c < 0x80) { utf16buf[out++] = c; continue; }

        c_len = _utf8len[c];
        // skip 5 & 6 byte codes
        if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len-1; continue; }

        // apply mask on first byte
        c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
        // join the rest
        while (c_len > 1 && i < len) {
            c = (c << 6) | (buf[i++] & 0x3f);
            c_len--;
        }

        // terminated by end of string?
        if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

        if (c < 0x10000) {
            utf16buf[out++] = c;
        } else {
            c -= 0x10000;
            utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
            utf16buf[out++] = 0xdc00 | (c & 0x3ff);
        }
    }

    // shrinkBuf(utf16buf, out)
    if (utf16buf.length !== out) {
        if(utf16buf.subarray) {
            utf16buf = utf16buf.subarray(0, out);
        } else {
            utf16buf.length = out;
        }
    }

    // return String.fromCharCode.apply(null, utf16buf);
    return utils.applyFromCharCode(utf16buf);
};


// That's all for the pako functions.


/**
 * Transform a javascript string into an array (typed if possible) of bytes,
 * UTF-8 encoded.
 * @param {String} str the string to encode
 * @return {Array|Uint8Array|Buffer} the UTF-8 encoded string.
 */
exports.utf8encode = function utf8encode(str) {
    if (support.nodebuffer) {
        return nodejsUtils.newBufferFrom(str, "utf-8");
    }

    return string2buf(str);
};


/**
 * Transform a bytes array (or a representation) representing an UTF-8 encoded
 * string into a javascript string.
 * @param {Array|Uint8Array|Buffer} buf the data de decode
 * @return {String} the decoded string.
 */
exports.utf8decode = function utf8decode(buf) {
    if (support.nodebuffer) {
        return utils.transformTo("nodebuffer", buf).toString("utf-8");
    }

    buf = utils.transformTo(support.uint8array ? "uint8array" : "array", buf);

    return buf2string(buf);
};

/**
 * A worker to decode utf8 encoded binary chunks into string chunks.
 * @constructor
 */
function Utf8DecodeWorker() {
    GenericWorker.call(this, "utf-8 decode");
    // the last bytes if a chunk didn't end with a complete codepoint.
    this.leftOver = null;
}
utils.inherits(Utf8DecodeWorker, GenericWorker);

/**
 * @see GenericWorker.processChunk
 */
Utf8DecodeWorker.prototype.processChunk = function (chunk) {

    var data = utils.transformTo(support.uint8array ? "uint8array" : "array", chunk.data);

    // 1st step, re-use what's left of the previous chunk
    if (this.leftOver && this.leftOver.length) {
        if(support.uint8array) {
            var previousData = data;
            data = new Uint8Array(previousData.length + this.leftOver.length);
            data.set(this.leftOver, 0);
            data.set(previousData, this.leftOver.length);
        } else {
            data = this.leftOver.concat(data);
        }
        this.leftOver = null;
    }

    var nextBoundary = utf8border(data);
    var usableData = data;
    if (nextBoundary !== data.length) {
        if (support.uint8array) {
            usableData = data.subarray(0, nextBoundary);
            this.leftOver = data.subarray(nextBoundary, data.length);
        } else {
            usableData = data.slice(0, nextBoundary);
            this.leftOver = data.slice(nextBoundary, data.length);
        }
    }

    this.push({
        data : exports.utf8decode(usableData),
        meta : chunk.meta
    });
};

/**
 * @see GenericWorker.flush
 */
Utf8DecodeWorker.prototype.flush = function () {
    if(this.leftOver && this.leftOver.length) {
        this.push({
            data : exports.utf8decode(this.leftOver),
            meta : {}
        });
        this.leftOver = null;
    }
};
exports.Utf8DecodeWorker = Utf8DecodeWorker;

/**
 * A worker to endcode string chunks into utf8 encoded binary chunks.
 * @constructor
 */
function Utf8EncodeWorker() {
    GenericWorker.call(this, "utf-8 encode");
}
utils.inherits(Utf8EncodeWorker, GenericWorker);

/**
 * @see GenericWorker.processChunk
 */
Utf8EncodeWorker.prototype.processChunk = function (chunk) {
    this.push({
        data : exports.utf8encode(chunk.data),
        meta : chunk.meta
    });
};
exports.Utf8EncodeWorker = Utf8EncodeWorker;


/***/ }),

/***/ "./node_modules/jszip/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/jszip/lib/utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var support = __webpack_require__(/*! ./support */ "./node_modules/jszip/lib/support.js");
var base64 = __webpack_require__(/*! ./base64 */ "./node_modules/jszip/lib/base64.js");
var nodejsUtils = __webpack_require__(/*! ./nodejsUtils */ "./node_modules/jszip/lib/nodejsUtils.js");
var external = __webpack_require__(/*! ./external */ "./node_modules/jszip/lib/external.js");
__webpack_require__(/*! setimmediate */ "./node_modules/setimmediate/setImmediate.js");


/**
 * Convert a string that pass as a "binary string": it should represent a byte
 * array but may have > 255 char codes. Be sure to take only the first byte
 * and returns the byte array.
 * @param {String} str the string to transform.
 * @return {Array|Uint8Array} the string in a binary format.
 */
function string2binary(str) {
    var result = null;
    if (support.uint8array) {
      result = new Uint8Array(str.length);
    } else {
      result = new Array(str.length);
    }
    return stringToArrayLike(str, result);
}

/**
 * Create a new blob with the given content and the given type.
 * @param {String|ArrayBuffer} part the content to put in the blob. DO NOT use
 * an Uint8Array because the stock browser of android 4 won't accept it (it
 * will be silently converted to a string, "[object Uint8Array]").
 *
 * Use only ONE part to build the blob to avoid a memory leak in IE11 / Edge:
 * when a large amount of Array is used to create the Blob, the amount of
 * memory consumed is nearly 100 times the original data amount.
 *
 * @param {String} type the mime type of the blob.
 * @return {Blob} the created blob.
 */
exports.newBlob = function(part, type) {
    exports.checkSupport("blob");

    try {
        // Blob constructor
        return new Blob([part], {
            type: type
        });
    }
    catch (e) {

        try {
            // deprecated, browser only, old way
            var Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
            var builder = new Builder();
            builder.append(part);
            return builder.getBlob(type);
        }
        catch (e) {

            // well, fuck ?!
            throw new Error("Bug : can't construct the Blob.");
        }
    }


};
/**
 * The identity function.
 * @param {Object} input the input.
 * @return {Object} the same input.
 */
function identity(input) {
    return input;
}

/**
 * Fill in an array with a string.
 * @param {String} str the string to use.
 * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to fill in (will be mutated).
 * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated array.
 */
function stringToArrayLike(str, array) {
    for (var i = 0; i < str.length; ++i) {
        array[i] = str.charCodeAt(i) & 0xFF;
    }
    return array;
}

/**
 * An helper for the function arrayLikeToString.
 * This contains static information and functions that
 * can be optimized by the browser JIT compiler.
 */
var arrayToStringHelper = {
    /**
     * Transform an array of int into a string, chunk by chunk.
     * See the performances notes on arrayLikeToString.
     * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
     * @param {String} type the type of the array.
     * @param {Integer} chunk the chunk size.
     * @return {String} the resulting string.
     * @throws Error if the chunk is too big for the stack.
     */
    stringifyByChunk: function(array, type, chunk) {
        var result = [], k = 0, len = array.length;
        // shortcut
        if (len <= chunk) {
            return String.fromCharCode.apply(null, array);
        }
        while (k < len) {
            if (type === "array" || type === "nodebuffer") {
                result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
            }
            else {
                result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
            }
            k += chunk;
        }
        return result.join("");
    },
    /**
     * Call String.fromCharCode on every item in the array.
     * This is the naive implementation, which generate A LOT of intermediate string.
     * This should be used when everything else fail.
     * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
     * @return {String} the result.
     */
    stringifyByChar: function(array){
        var resultStr = "";
        for(var i = 0; i < array.length; i++) {
            resultStr += String.fromCharCode(array[i]);
        }
        return resultStr;
    },
    applyCanBeUsed : {
        /**
         * true if the browser accepts to use String.fromCharCode on Uint8Array
         */
        uint8array : (function () {
            try {
                return support.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
            } catch (e) {
                return false;
            }
        })(),
        /**
         * true if the browser accepts to use String.fromCharCode on nodejs Buffer.
         */
        nodebuffer : (function () {
            try {
                return support.nodebuffer && String.fromCharCode.apply(null, nodejsUtils.allocBuffer(1)).length === 1;
            } catch (e) {
                return false;
            }
        })()
    }
};

/**
 * Transform an array-like object to a string.
 * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
 * @return {String} the result.
 */
function arrayLikeToString(array) {
    // Performances notes :
    // --------------------
    // String.fromCharCode.apply(null, array) is the fastest, see
    // see http://jsperf.com/converting-a-uint8array-to-a-string/2
    // but the stack is limited (and we can get huge arrays !).
    //
    // result += String.fromCharCode(array[i]); generate too many strings !
    //
    // This code is inspired by http://jsperf.com/arraybuffer-to-string-apply-performance/2
    // TODO : we now have workers that split the work. Do we still need that ?
    var chunk = 65536,
        type = exports.getTypeOf(array),
        canUseApply = true;
    if (type === "uint8array") {
        canUseApply = arrayToStringHelper.applyCanBeUsed.uint8array;
    } else if (type === "nodebuffer") {
        canUseApply = arrayToStringHelper.applyCanBeUsed.nodebuffer;
    }

    if (canUseApply) {
        while (chunk > 1) {
            try {
                return arrayToStringHelper.stringifyByChunk(array, type, chunk);
            } catch (e) {
                chunk = Math.floor(chunk / 2);
            }
        }
    }

    // no apply or chunk error : slow and painful algorithm
    // default browser on android 4.*
    return arrayToStringHelper.stringifyByChar(array);
}

exports.applyFromCharCode = arrayLikeToString;


/**
 * Copy the data from an array-like to an other array-like.
 * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayFrom the origin array.
 * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayTo the destination array which will be mutated.
 * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated destination array.
 */
function arrayLikeToArrayLike(arrayFrom, arrayTo) {
    for (var i = 0; i < arrayFrom.length; i++) {
        arrayTo[i] = arrayFrom[i];
    }
    return arrayTo;
}

// a matrix containing functions to transform everything into everything.
var transform = {};

// string to ?
transform["string"] = {
    "string": identity,
    "array": function(input) {
        return stringToArrayLike(input, new Array(input.length));
    },
    "arraybuffer": function(input) {
        return transform["string"]["uint8array"](input).buffer;
    },
    "uint8array": function(input) {
        return stringToArrayLike(input, new Uint8Array(input.length));
    },
    "nodebuffer": function(input) {
        return stringToArrayLike(input, nodejsUtils.allocBuffer(input.length));
    }
};

// array to ?
transform["array"] = {
    "string": arrayLikeToString,
    "array": identity,
    "arraybuffer": function(input) {
        return (new Uint8Array(input)).buffer;
    },
    "uint8array": function(input) {
        return new Uint8Array(input);
    },
    "nodebuffer": function(input) {
        return nodejsUtils.newBufferFrom(input);
    }
};

// arraybuffer to ?
transform["arraybuffer"] = {
    "string": function(input) {
        return arrayLikeToString(new Uint8Array(input));
    },
    "array": function(input) {
        return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
    },
    "arraybuffer": identity,
    "uint8array": function(input) {
        return new Uint8Array(input);
    },
    "nodebuffer": function(input) {
        return nodejsUtils.newBufferFrom(new Uint8Array(input));
    }
};

// uint8array to ?
transform["uint8array"] = {
    "string": arrayLikeToString,
    "array": function(input) {
        return arrayLikeToArrayLike(input, new Array(input.length));
    },
    "arraybuffer": function(input) {
        return input.buffer;
    },
    "uint8array": identity,
    "nodebuffer": function(input) {
        return nodejsUtils.newBufferFrom(input);
    }
};

// nodebuffer to ?
transform["nodebuffer"] = {
    "string": arrayLikeToString,
    "array": function(input) {
        return arrayLikeToArrayLike(input, new Array(input.length));
    },
    "arraybuffer": function(input) {
        return transform["nodebuffer"]["uint8array"](input).buffer;
    },
    "uint8array": function(input) {
        return arrayLikeToArrayLike(input, new Uint8Array(input.length));
    },
    "nodebuffer": identity
};

/**
 * Transform an input into any type.
 * The supported output type are : string, array, uint8array, arraybuffer, nodebuffer.
 * If no output type is specified, the unmodified input will be returned.
 * @param {String} outputType the output type.
 * @param {String|Array|ArrayBuffer|Uint8Array|Buffer} input the input to convert.
 * @throws {Error} an Error if the browser doesn't support the requested output type.
 */
exports.transformTo = function(outputType, input) {
    if (!input) {
        // undefined, null, etc
        // an empty string won't harm.
        input = "";
    }
    if (!outputType) {
        return input;
    }
    exports.checkSupport(outputType);
    var inputType = exports.getTypeOf(input);
    var result = transform[inputType][outputType](input);
    return result;
};

/**
 * Resolve all relative path components, "." and "..", in a path. If these relative components
 * traverse above the root then the resulting path will only contain the final path component.
 *
 * All empty components, e.g. "//", are removed.
 * @param {string} path A path with / or \ separators
 * @returns {string} The path with all relative path components resolved.
 */
exports.resolve = function(path) {
    var parts = path.split("/");
    var result = [];
    for (var index = 0; index < parts.length; index++) {
        var part = parts[index];
        // Allow the first and last component to be empty for trailing slashes.
        if (part === "." || (part === "" && index !== 0 && index !== parts.length - 1)) {
            continue;
        } else if (part === "..") {
            result.pop();
        } else {
            result.push(part);
        }
    }
    return result.join("/");
};

/**
 * Return the type of the input.
 * The type will be in a format valid for JSZip.utils.transformTo : string, array, uint8array, arraybuffer.
 * @param {Object} input the input to identify.
 * @return {String} the (lowercase) type of the input.
 */
exports.getTypeOf = function(input) {
    if (typeof input === "string") {
        return "string";
    }
    if (Object.prototype.toString.call(input) === "[object Array]") {
        return "array";
    }
    if (support.nodebuffer && nodejsUtils.isBuffer(input)) {
        return "nodebuffer";
    }
    if (support.uint8array && input instanceof Uint8Array) {
        return "uint8array";
    }
    if (support.arraybuffer && input instanceof ArrayBuffer) {
        return "arraybuffer";
    }
};

/**
 * Throw an exception if the type is not supported.
 * @param {String} type the type to check.
 * @throws {Error} an Error if the browser doesn't support the requested type.
 */
exports.checkSupport = function(type) {
    var supported = support[type.toLowerCase()];
    if (!supported) {
        throw new Error(type + " is not supported by this platform");
    }
};

exports.MAX_VALUE_16BITS = 65535;
exports.MAX_VALUE_32BITS = -1; // well, "\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF" is parsed as -1

/**
 * Prettify a string read as binary.
 * @param {string} str the string to prettify.
 * @return {string} a pretty string.
 */
exports.pretty = function(str) {
    var res = '',
        code, i;
    for (i = 0; i < (str || "").length; i++) {
        code = str.charCodeAt(i);
        res += '\\x' + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
    }
    return res;
};

/**
 * Defer the call of a function.
 * @param {Function} callback the function to call asynchronously.
 * @param {Array} args the arguments to give to the callback.
 */
exports.delay = function(callback, args, self) {
    setImmediate(function () {
        callback.apply(self || null, args || []);
    });
};

/**
 * Extends a prototype with an other, without calling a constructor with
 * side effects. Inspired by nodejs' `utils.inherits`
 * @param {Function} ctor the constructor to augment
 * @param {Function} superCtor the parent constructor to use
 */
exports.inherits = function (ctor, superCtor) {
    var Obj = function() {};
    Obj.prototype = superCtor.prototype;
    ctor.prototype = new Obj();
};

/**
 * Merge the objects passed as parameters into a new one.
 * @private
 * @param {...Object} var_args All objects to merge.
 * @return {Object} a new object with the data of the others.
 */
exports.extend = function() {
    var result = {}, i, attr;
    for (i = 0; i < arguments.length; i++) { // arguments is not enumerable in some browsers
        for (attr in arguments[i]) {
            if (arguments[i].hasOwnProperty(attr) && typeof result[attr] === "undefined") {
                result[attr] = arguments[i][attr];
            }
        }
    }
    return result;
};

/**
 * Transform arbitrary content into a Promise.
 * @param {String} name a name for the content being processed.
 * @param {Object} inputData the content to process.
 * @param {Boolean} isBinary true if the content is not an unicode string
 * @param {Boolean} isOptimizedBinaryString true if the string content only has one byte per character.
 * @param {Boolean} isBase64 true if the string content is encoded with base64.
 * @return {Promise} a promise in a format usable by JSZip.
 */
exports.prepareContent = function(name, inputData, isBinary, isOptimizedBinaryString, isBase64) {

    // if inputData is already a promise, this flatten it.
    var promise = external.Promise.resolve(inputData).then(function(data) {


        var isBlob = support.blob && (data instanceof Blob || ['[object File]', '[object Blob]'].indexOf(Object.prototype.toString.call(data)) !== -1);

        if (isBlob && typeof FileReader !== "undefined") {
            return new external.Promise(function (resolve, reject) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.onerror = function(e) {
                    reject(e.target.error);
                };
                reader.readAsArrayBuffer(data);
            });
        } else {
            return data;
        }
    });

    return promise.then(function(data) {
        var dataType = exports.getTypeOf(data);

        if (!dataType) {
            return external.Promise.reject(
                new Error("Can't read the data of '" + name + "'. Is it " +
                          "in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?")
            );
        }
        // special case : it's way easier to work with Uint8Array than with ArrayBuffer
        if (dataType === "arraybuffer") {
            data = exports.transformTo("uint8array", data);
        } else if (dataType === "string") {
            if (isBase64) {
                data = base64.decode(data);
            }
            else if (isBinary) {
                // optimizedBinaryString === true means that the file has already been filtered with a 0xFF mask
                if (isOptimizedBinaryString !== true) {
                    // this is a string, not in a base64 format.
                    // Be sure that this is a correct "binary string"
                    data = string2binary(data);
                }
            }
        }
        return data;
    });
};


/***/ }),

/***/ "./node_modules/jszip/lib/zipEntries.js":
/*!**********************************************!*\
  !*** ./node_modules/jszip/lib/zipEntries.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var readerFor = __webpack_require__(/*! ./reader/readerFor */ "./node_modules/jszip/lib/reader/readerFor.js");
var utils = __webpack_require__(/*! ./utils */ "./node_modules/jszip/lib/utils.js");
var sig = __webpack_require__(/*! ./signature */ "./node_modules/jszip/lib/signature.js");
var ZipEntry = __webpack_require__(/*! ./zipEntry */ "./node_modules/jszip/lib/zipEntry.js");
var utf8 = __webpack_require__(/*! ./utf8 */ "./node_modules/jszip/lib/utf8.js");
var support = __webpack_require__(/*! ./support */ "./node_modules/jszip/lib/support.js");
//  class ZipEntries {{{
/**
 * All the entries in the zip file.
 * @constructor
 * @param {Object} loadOptions Options for loading the stream.
 */
function ZipEntries(loadOptions) {
    this.files = [];
    this.loadOptions = loadOptions;
}
ZipEntries.prototype = {
    /**
     * Check that the reader is on the specified signature.
     * @param {string} expectedSignature the expected signature.
     * @throws {Error} if it is an other signature.
     */
    checkSignature: function(expectedSignature) {
        if (!this.reader.readAndCheckSignature(expectedSignature)) {
            this.reader.index -= 4;
            var signature = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature " + "(" + utils.pretty(signature) + ", expected " + utils.pretty(expectedSignature) + ")");
        }
    },
    /**
     * Check if the given signature is at the given index.
     * @param {number} askedIndex the index to check.
     * @param {string} expectedSignature the signature to expect.
     * @return {boolean} true if the signature is here, false otherwise.
     */
    isSignature: function(askedIndex, expectedSignature) {
        var currentIndex = this.reader.index;
        this.reader.setIndex(askedIndex);
        var signature = this.reader.readString(4);
        var result = signature === expectedSignature;
        this.reader.setIndex(currentIndex);
        return result;
    },
    /**
     * Read the end of the central directory.
     */
    readBlockEndOfCentral: function() {
        this.diskNumber = this.reader.readInt(2);
        this.diskWithCentralDirStart = this.reader.readInt(2);
        this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
        this.centralDirRecords = this.reader.readInt(2);
        this.centralDirSize = this.reader.readInt(4);
        this.centralDirOffset = this.reader.readInt(4);

        this.zipCommentLength = this.reader.readInt(2);
        // warning : the encoding depends of the system locale
        // On a linux machine with LANG=en_US.utf8, this field is utf8 encoded.
        // On a windows machine, this field is encoded with the localized windows code page.
        var zipComment = this.reader.readData(this.zipCommentLength);
        var decodeParamType = support.uint8array ? "uint8array" : "array";
        // To get consistent behavior with the generation part, we will assume that
        // this is utf8 encoded unless specified otherwise.
        var decodeContent = utils.transformTo(decodeParamType, zipComment);
        this.zipComment = this.loadOptions.decodeFileName(decodeContent);
    },
    /**
     * Read the end of the Zip 64 central directory.
     * Not merged with the method readEndOfCentral :
     * The end of central can coexist with its Zip64 brother,
     * I don't want to read the wrong number of bytes !
     */
    readBlockZip64EndOfCentral: function() {
        this.zip64EndOfCentralSize = this.reader.readInt(8);
        this.reader.skip(4);
        // this.versionMadeBy = this.reader.readString(2);
        // this.versionNeeded = this.reader.readInt(2);
        this.diskNumber = this.reader.readInt(4);
        this.diskWithCentralDirStart = this.reader.readInt(4);
        this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
        this.centralDirRecords = this.reader.readInt(8);
        this.centralDirSize = this.reader.readInt(8);
        this.centralDirOffset = this.reader.readInt(8);

        this.zip64ExtensibleData = {};
        var extraDataSize = this.zip64EndOfCentralSize - 44,
            index = 0,
            extraFieldId,
            extraFieldLength,
            extraFieldValue;
        while (index < extraDataSize) {
            extraFieldId = this.reader.readInt(2);
            extraFieldLength = this.reader.readInt(4);
            extraFieldValue = this.reader.readData(extraFieldLength);
            this.zip64ExtensibleData[extraFieldId] = {
                id: extraFieldId,
                length: extraFieldLength,
                value: extraFieldValue
            };
        }
    },
    /**
     * Read the end of the Zip 64 central directory locator.
     */
    readBlockZip64EndOfCentralLocator: function() {
        this.diskWithZip64CentralDirStart = this.reader.readInt(4);
        this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
        this.disksCount = this.reader.readInt(4);
        if (this.disksCount > 1) {
            throw new Error("Multi-volumes zip are not supported");
        }
    },
    /**
     * Read the local files, based on the offset read in the central part.
     */
    readLocalFiles: function() {
        var i, file;
        for (i = 0; i < this.files.length; i++) {
            file = this.files[i];
            this.reader.setIndex(file.localHeaderOffset);
            this.checkSignature(sig.LOCAL_FILE_HEADER);
            file.readLocalPart(this.reader);
            file.handleUTF8();
            file.processAttributes();
        }
    },
    /**
     * Read the central directory.
     */
    readCentralDir: function() {
        var file;

        this.reader.setIndex(this.centralDirOffset);
        while (this.reader.readAndCheckSignature(sig.CENTRAL_FILE_HEADER)) {
            file = new ZipEntry({
                zip64: this.zip64
            }, this.loadOptions);
            file.readCentralPart(this.reader);
            this.files.push(file);
        }

        if (this.centralDirRecords !== this.files.length) {
            if (this.centralDirRecords !== 0 && this.files.length === 0) {
                // We expected some records but couldn't find ANY.
                // This is really suspicious, as if something went wrong.
                throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
            } else {
                // We found some records but not all.
                // Something is wrong but we got something for the user: no error here.
                // console.warn("expected", this.centralDirRecords, "records in central dir, got", this.files.length);
            }
        }
    },
    /**
     * Read the end of central directory.
     */
    readEndOfCentral: function() {
        var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);
        if (offset < 0) {
            // Check if the content is a truncated zip or complete garbage.
            // A "LOCAL_FILE_HEADER" is not required at the beginning (auto
            // extractible zip for example) but it can give a good hint.
            // If an ajax request was used without responseType, we will also
            // get unreadable data.
            var isGarbage = !this.isSignature(0, sig.LOCAL_FILE_HEADER);

            if (isGarbage) {
                throw new Error("Can't find end of central directory : is this a zip file ? " +
                                "If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
            } else {
                throw new Error("Corrupted zip: can't find end of central directory");
            }

        }
        this.reader.setIndex(offset);
        var endOfCentralDirOffset = offset;
        this.checkSignature(sig.CENTRAL_DIRECTORY_END);
        this.readBlockEndOfCentral();


        /* extract from the zip spec :
            4)  If one of the fields in the end of central directory
                record is too small to hold required data, the field
                should be set to -1 (0xFFFF or 0xFFFFFFFF) and the
                ZIP64 format record should be created.
            5)  The end of central directory record and the
                Zip64 end of central directory locator record must
                reside on the same disk when splitting or spanning
                an archive.
         */
        if (this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {
            this.zip64 = true;

            /*
            Warning : the zip64 extension is supported, but ONLY if the 64bits integer read from
            the zip file can fit into a 32bits integer. This cannot be solved : JavaScript represents
            all numbers as 64-bit double precision IEEE 754 floating point numbers.
            So, we have 53bits for integers and bitwise operations treat everything as 32bits.
            see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Bitwise_Operators
            and http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf section 8.5
            */

            // should look for a zip64 EOCD locator
            offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
            if (offset < 0) {
                throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            }
            this.reader.setIndex(offset);
            this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
            this.readBlockZip64EndOfCentralLocator();

            // now the zip64 EOCD record
            if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END)) {
                // console.warn("ZIP64 end of central directory not where expected.");
                this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
                if (this.relativeOffsetEndOfZip64CentralDir < 0) {
                    throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
                }
            }
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
            this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
            this.readBlockZip64EndOfCentral();
        }

        var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;
        if (this.zip64) {
            expectedEndOfCentralDirOffset += 20; // end of central dir 64 locator
            expectedEndOfCentralDirOffset += 12 /* should not include the leading 12 bytes */ + this.zip64EndOfCentralSize;
        }

        var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;

        if (extraBytes > 0) {
            // console.warn(extraBytes, "extra bytes at beginning or within zipfile");
            if (this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER)) {
                // The offsets seem wrong, but we have something at the specified offset.
                // So… we keep it.
            } else {
                // the offset is wrong, update the "zero" of the reader
                // this happens if data has been prepended (crx files for example)
                this.reader.zero = extraBytes;
            }
        } else if (extraBytes < 0) {
            throw new Error("Corrupted zip: missing " + Math.abs(extraBytes) + " bytes.");
        }
    },
    prepareReader: function(data) {
        this.reader = readerFor(data);
    },
    /**
     * Read a zip file and create ZipEntries.
     * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
     */
    load: function(data) {
        this.prepareReader(data);
        this.readEndOfCentral();
        this.readCentralDir();
        this.readLocalFiles();
    }
};
// }}} end of ZipEntries
module.exports = ZipEntries;


/***/ }),

/***/ "./node_modules/jszip/lib/zipEntry.js":
/*!********************************************!*\
  !*** ./node_modules/jszip/lib/zipEntry.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var readerFor = __webpack_require__(/*! ./reader/readerFor */ "./node_modules/jszip/lib/reader/readerFor.js");
var utils = __webpack_require__(/*! ./utils */ "./node_modules/jszip/lib/utils.js");
var CompressedObject = __webpack_require__(/*! ./compressedObject */ "./node_modules/jszip/lib/compressedObject.js");
var crc32fn = __webpack_require__(/*! ./crc32 */ "./node_modules/jszip/lib/crc32.js");
var utf8 = __webpack_require__(/*! ./utf8 */ "./node_modules/jszip/lib/utf8.js");
var compressions = __webpack_require__(/*! ./compressions */ "./node_modules/jszip/lib/compressions.js");
var support = __webpack_require__(/*! ./support */ "./node_modules/jszip/lib/support.js");

var MADE_BY_DOS = 0x00;
var MADE_BY_UNIX = 0x03;

/**
 * Find a compression registered in JSZip.
 * @param {string} compressionMethod the method magic to find.
 * @return {Object|null} the JSZip compression object, null if none found.
 */
var findCompression = function(compressionMethod) {
    for (var method in compressions) {
        if (!compressions.hasOwnProperty(method)) {
            continue;
        }
        if (compressions[method].magic === compressionMethod) {
            return compressions[method];
        }
    }
    return null;
};

// class ZipEntry {{{
/**
 * An entry in the zip file.
 * @constructor
 * @param {Object} options Options of the current file.
 * @param {Object} loadOptions Options for loading the stream.
 */
function ZipEntry(options, loadOptions) {
    this.options = options;
    this.loadOptions = loadOptions;
}
ZipEntry.prototype = {
    /**
     * say if the file is encrypted.
     * @return {boolean} true if the file is encrypted, false otherwise.
     */
    isEncrypted: function() {
        // bit 1 is set
        return (this.bitFlag & 0x0001) === 0x0001;
    },
    /**
     * say if the file has utf-8 filename/comment.
     * @return {boolean} true if the filename/comment is in utf-8, false otherwise.
     */
    useUTF8: function() {
        // bit 11 is set
        return (this.bitFlag & 0x0800) === 0x0800;
    },
    /**
     * Read the local part of a zip file and add the info in this object.
     * @param {DataReader} reader the reader to use.
     */
    readLocalPart: function(reader) {
        var compression, localExtraFieldsLength;

        // we already know everything from the central dir !
        // If the central dir data are false, we are doomed.
        // On the bright side, the local part is scary  : zip64, data descriptors, both, etc.
        // The less data we get here, the more reliable this should be.
        // Let's skip the whole header and dash to the data !
        reader.skip(22);
        // in some zip created on windows, the filename stored in the central dir contains \ instead of /.
        // Strangely, the filename here is OK.
        // I would love to treat these zip files as corrupted (see http://www.info-zip.org/FAQ.html#backslashes
        // or APPNOTE#4.4.17.1, "All slashes MUST be forward slashes '/'") but there are a lot of bad zip generators...
        // Search "unzip mismatching "local" filename continuing with "central" filename version" on
        // the internet.
        //
        // I think I see the logic here : the central directory is used to display
        // content and the local directory is used to extract the files. Mixing / and \
        // may be used to display \ to windows users and use / when extracting the files.
        // Unfortunately, this lead also to some issues : http://seclists.org/fulldisclosure/2009/Sep/394
        this.fileNameLength = reader.readInt(2);
        localExtraFieldsLength = reader.readInt(2); // can't be sure this will be the same as the central dir
        // the fileName is stored as binary data, the handleUTF8 method will take care of the encoding.
        this.fileName = reader.readData(this.fileNameLength);
        reader.skip(localExtraFieldsLength);

        if (this.compressedSize === -1 || this.uncompressedSize === -1) {
            throw new Error("Bug or corrupted zip : didn't get enough information from the central directory " + "(compressedSize === -1 || uncompressedSize === -1)");
        }

        compression = findCompression(this.compressionMethod);
        if (compression === null) { // no compression found
            throw new Error("Corrupted zip : compression " + utils.pretty(this.compressionMethod) + " unknown (inner file : " + utils.transformTo("string", this.fileName) + ")");
        }
        this.decompressed = new CompressedObject(this.compressedSize, this.uncompressedSize, this.crc32, compression, reader.readData(this.compressedSize));
    },

    /**
     * Read the central part of a zip file and add the info in this object.
     * @param {DataReader} reader the reader to use.
     */
    readCentralPart: function(reader) {
        this.versionMadeBy = reader.readInt(2);
        reader.skip(2);
        // this.versionNeeded = reader.readInt(2);
        this.bitFlag = reader.readInt(2);
        this.compressionMethod = reader.readString(2);
        this.date = reader.readDate();
        this.crc32 = reader.readInt(4);
        this.compressedSize = reader.readInt(4);
        this.uncompressedSize = reader.readInt(4);
        var fileNameLength = reader.readInt(2);
        this.extraFieldsLength = reader.readInt(2);
        this.fileCommentLength = reader.readInt(2);
        this.diskNumberStart = reader.readInt(2);
        this.internalFileAttributes = reader.readInt(2);
        this.externalFileAttributes = reader.readInt(4);
        this.localHeaderOffset = reader.readInt(4);

        if (this.isEncrypted()) {
            throw new Error("Encrypted zip are not supported");
        }

        // will be read in the local part, see the comments there
        reader.skip(fileNameLength);
        this.readExtraFields(reader);
        this.parseZIP64ExtraField(reader);
        this.fileComment = reader.readData(this.fileCommentLength);
    },

    /**
     * Parse the external file attributes and get the unix/dos permissions.
     */
    processAttributes: function () {
        this.unixPermissions = null;
        this.dosPermissions = null;
        var madeBy = this.versionMadeBy >> 8;

        // Check if we have the DOS directory flag set.
        // We look for it in the DOS and UNIX permissions
        // but some unknown platform could set it as a compatibility flag.
        this.dir = this.externalFileAttributes & 0x0010 ? true : false;

        if(madeBy === MADE_BY_DOS) {
            // first 6 bits (0 to 5)
            this.dosPermissions = this.externalFileAttributes & 0x3F;
        }

        if(madeBy === MADE_BY_UNIX) {
            this.unixPermissions = (this.externalFileAttributes >> 16) & 0xFFFF;
            // the octal permissions are in (this.unixPermissions & 0x01FF).toString(8);
        }

        // fail safe : if the name ends with a / it probably means a folder
        if (!this.dir && this.fileNameStr.slice(-1) === '/') {
            this.dir = true;
        }
    },

    /**
     * Parse the ZIP64 extra field and merge the info in the current ZipEntry.
     * @param {DataReader} reader the reader to use.
     */
    parseZIP64ExtraField: function(reader) {

        if (!this.extraFields[0x0001]) {
            return;
        }

        // should be something, preparing the extra reader
        var extraReader = readerFor(this.extraFields[0x0001].value);

        // I really hope that these 64bits integer can fit in 32 bits integer, because js
        // won't let us have more.
        if (this.uncompressedSize === utils.MAX_VALUE_32BITS) {
            this.uncompressedSize = extraReader.readInt(8);
        }
        if (this.compressedSize === utils.MAX_VALUE_32BITS) {
            this.compressedSize = extraReader.readInt(8);
        }
        if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) {
            this.localHeaderOffset = extraReader.readInt(8);
        }
        if (this.diskNumberStart === utils.MAX_VALUE_32BITS) {
            this.diskNumberStart = extraReader.readInt(4);
        }
    },
    /**
     * Read the central part of a zip file and add the info in this object.
     * @param {DataReader} reader the reader to use.
     */
    readExtraFields: function(reader) {
        var end = reader.index + this.extraFieldsLength,
            extraFieldId,
            extraFieldLength,
            extraFieldValue;

        if (!this.extraFields) {
            this.extraFields = {};
        }

        while (reader.index + 4 < end) {
            extraFieldId = reader.readInt(2);
            extraFieldLength = reader.readInt(2);
            extraFieldValue = reader.readData(extraFieldLength);

            this.extraFields[extraFieldId] = {
                id: extraFieldId,
                length: extraFieldLength,
                value: extraFieldValue
            };
        }

        reader.setIndex(end);
    },
    /**
     * Apply an UTF8 transformation if needed.
     */
    handleUTF8: function() {
        var decodeParamType = support.uint8array ? "uint8array" : "array";
        if (this.useUTF8()) {
            this.fileNameStr = utf8.utf8decode(this.fileName);
            this.fileCommentStr = utf8.utf8decode(this.fileComment);
        } else {
            var upath = this.findExtraFieldUnicodePath();
            if (upath !== null) {
                this.fileNameStr = upath;
            } else {
                // ASCII text or unsupported code page
                var fileNameByteArray =  utils.transformTo(decodeParamType, this.fileName);
                this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);
            }

            var ucomment = this.findExtraFieldUnicodeComment();
            if (ucomment !== null) {
                this.fileCommentStr = ucomment;
            } else {
                // ASCII text or unsupported code page
                var commentByteArray =  utils.transformTo(decodeParamType, this.fileComment);
                this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);
            }
        }
    },

    /**
     * Find the unicode path declared in the extra field, if any.
     * @return {String} the unicode path, null otherwise.
     */
    findExtraFieldUnicodePath: function() {
        var upathField = this.extraFields[0x7075];
        if (upathField) {
            var extraReader = readerFor(upathField.value);

            // wrong version
            if (extraReader.readInt(1) !== 1) {
                return null;
            }

            // the crc of the filename changed, this field is out of date.
            if (crc32fn(this.fileName) !== extraReader.readInt(4)) {
                return null;
            }

            return utf8.utf8decode(extraReader.readData(upathField.length - 5));
        }
        return null;
    },

    /**
     * Find the unicode comment declared in the extra field, if any.
     * @return {String} the unicode comment, null otherwise.
     */
    findExtraFieldUnicodeComment: function() {
        var ucommentField = this.extraFields[0x6375];
        if (ucommentField) {
            var extraReader = readerFor(ucommentField.value);

            // wrong version
            if (extraReader.readInt(1) !== 1) {
                return null;
            }

            // the crc of the comment changed, this field is out of date.
            if (crc32fn(this.fileComment) !== extraReader.readInt(4)) {
                return null;
            }

            return utf8.utf8decode(extraReader.readData(ucommentField.length - 5));
        }
        return null;
    }
};
module.exports = ZipEntry;


/***/ }),

/***/ "./node_modules/jszip/lib/zipObject.js":
/*!*********************************************!*\
  !*** ./node_modules/jszip/lib/zipObject.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var StreamHelper = __webpack_require__(/*! ./stream/StreamHelper */ "./node_modules/jszip/lib/stream/StreamHelper.js");
var DataWorker = __webpack_require__(/*! ./stream/DataWorker */ "./node_modules/jszip/lib/stream/DataWorker.js");
var utf8 = __webpack_require__(/*! ./utf8 */ "./node_modules/jszip/lib/utf8.js");
var CompressedObject = __webpack_require__(/*! ./compressedObject */ "./node_modules/jszip/lib/compressedObject.js");
var GenericWorker = __webpack_require__(/*! ./stream/GenericWorker */ "./node_modules/jszip/lib/stream/GenericWorker.js");

/**
 * A simple object representing a file in the zip file.
 * @constructor
 * @param {string} name the name of the file
 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data
 * @param {Object} options the options of the file
 */
var ZipObject = function(name, data, options) {
    this.name = name;
    this.dir = options.dir;
    this.date = options.date;
    this.comment = options.comment;
    this.unixPermissions = options.unixPermissions;
    this.dosPermissions = options.dosPermissions;

    this._data = data;
    this._dataBinary = options.binary;
    // keep only the compression
    this.options = {
        compression : options.compression,
        compressionOptions : options.compressionOptions
    };
};

ZipObject.prototype = {
    /**
     * Create an internal stream for the content of this object.
     * @param {String} type the type of each chunk.
     * @return StreamHelper the stream.
     */
    internalStream: function (type) {
        var result = null, outputType = "string";
        try {
            if (!type) {
                throw new Error("No output type specified.");
            }
            outputType = type.toLowerCase();
            var askUnicodeString = outputType === "string" || outputType === "text";
            if (outputType === "binarystring" || outputType === "text") {
                outputType = "string";
            }
            result = this._decompressWorker();

            var isUnicodeString = !this._dataBinary;

            if (isUnicodeString && !askUnicodeString) {
                result = result.pipe(new utf8.Utf8EncodeWorker());
            }
            if (!isUnicodeString && askUnicodeString) {
                result = result.pipe(new utf8.Utf8DecodeWorker());
            }
        } catch (e) {
            result = new GenericWorker("error");
            result.error(e);
        }

        return new StreamHelper(result, outputType, "");
    },

    /**
     * Prepare the content in the asked type.
     * @param {String} type the type of the result.
     * @param {Function} onUpdate a function to call on each internal update.
     * @return Promise the promise of the result.
     */
    async: function (type, onUpdate) {
        return this.internalStream(type).accumulate(onUpdate);
    },

    /**
     * Prepare the content as a nodejs stream.
     * @param {String} type the type of each chunk.
     * @param {Function} onUpdate a function to call on each internal update.
     * @return Stream the stream.
     */
    nodeStream: function (type, onUpdate) {
        return this.internalStream(type || "nodebuffer").toNodejsStream(onUpdate);
    },

    /**
     * Return a worker for the compressed content.
     * @private
     * @param {Object} compression the compression object to use.
     * @param {Object} compressionOptions the options to use when compressing.
     * @return Worker the worker.
     */
    _compressWorker: function (compression, compressionOptions) {
        if (
            this._data instanceof CompressedObject &&
            this._data.compression.magic === compression.magic
        ) {
            return this._data.getCompressedWorker();
        } else {
            var result = this._decompressWorker();
            if(!this._dataBinary) {
                result = result.pipe(new utf8.Utf8EncodeWorker());
            }
            return CompressedObject.createWorkerFrom(result, compression, compressionOptions);
        }
    },
    /**
     * Return a worker for the decompressed content.
     * @private
     * @return Worker the worker.
     */
    _decompressWorker : function () {
        if (this._data instanceof CompressedObject) {
            return this._data.getContentWorker();
        } else if (this._data instanceof GenericWorker) {
            return this._data;
        } else {
            return new DataWorker(this._data);
        }
    }
};

var removedMethods = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"];
var removedFn = function () {
    throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
};

for(var i = 0; i < removedMethods.length; i++) {
    ZipObject.prototype[removedMethods[i]] = removedFn;
}
module.exports = ZipObject;


/***/ }),

/***/ "./node_modules/lie/lib/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/lie/lib/browser.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var immediate = __webpack_require__(/*! immediate */ "./node_modules/immediate/lib/browser.js");

/* istanbul ignore next */
function INTERNAL() {}

var handlers = {};

var REJECTED = ['REJECTED'];
var FULFILLED = ['FULFILLED'];
var PENDING = ['PENDING'];

module.exports = Promise;

function Promise(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('resolver must be a function');
  }
  this.state = PENDING;
  this.queue = [];
  this.outcome = void 0;
  if (resolver !== INTERNAL) {
    safelyResolveThenable(this, resolver);
  }
}

Promise.prototype["finally"] = function (callback) {
  if (typeof callback !== 'function') {
    return this;
  }
  var p = this.constructor;
  return this.then(resolve, reject);

  function resolve(value) {
    function yes () {
      return value;
    }
    return p.resolve(callback()).then(yes);
  }
  function reject(reason) {
    function no () {
      throw reason;
    }
    return p.resolve(callback()).then(no);
  }
};
Promise.prototype["catch"] = function (onRejected) {
  return this.then(null, onRejected);
};
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
    typeof onRejected !== 'function' && this.state === REJECTED) {
    return this;
  }
  var promise = new this.constructor(INTERNAL);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.outcome);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }

  return promise;
};
function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (typeof onFulfilled === 'function') {
    this.onFulfilled = onFulfilled;
    this.callFulfilled = this.otherCallFulfilled;
  }
  if (typeof onRejected === 'function') {
    this.onRejected = onRejected;
    this.callRejected = this.otherCallRejected;
  }
}
QueueItem.prototype.callFulfilled = function (value) {
  handlers.resolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function (value) {
  unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function (value) {
  handlers.reject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function (value) {
  unwrap(this.promise, this.onRejected, value);
};

function unwrap(promise, func, value) {
  immediate(function () {
    var returnValue;
    try {
      returnValue = func(value);
    } catch (e) {
      return handlers.reject(promise, e);
    }
    if (returnValue === promise) {
      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      handlers.resolve(promise, returnValue);
    }
  });
}

handlers.resolve = function (self, value) {
  var result = tryCatch(getThen, value);
  if (result.status === 'error') {
    return handlers.reject(self, result.value);
  }
  var thenable = result.value;

  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    self.state = FULFILLED;
    self.outcome = value;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callFulfilled(value);
    }
  }
  return self;
};
handlers.reject = function (self, error) {
  self.state = REJECTED;
  self.outcome = error;
  var i = -1;
  var len = self.queue.length;
  while (++i < len) {
    self.queue[i].callRejected(error);
  }
  return self;
};

function getThen(obj) {
  // Make sure we only access the accessor once as required by the spec
  var then = obj && obj.then;
  if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments);
    };
  }
}

function safelyResolveThenable(self, thenable) {
  // Either fulfill, reject or reject with error
  var called = false;
  function onError(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.reject(self, value);
  }

  function onSuccess(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.resolve(self, value);
  }

  function tryToUnwrap() {
    thenable(onSuccess, onError);
  }

  var result = tryCatch(tryToUnwrap);
  if (result.status === 'error') {
    onError(result.value);
  }
}

function tryCatch(func, value) {
  var out = {};
  try {
    out.value = func(value);
    out.status = 'success';
  } catch (e) {
    out.status = 'error';
    out.value = e;
  }
  return out;
}

Promise.resolve = resolve;
function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return handlers.resolve(new this(INTERNAL), value);
}

Promise.reject = reject;
function reject(reason) {
  var promise = new this(INTERNAL);
  return handlers.reject(promise, reason);
}

Promise.all = all;
function all(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    self.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        handlers.resolve(promise, values);
      }
    }
  }
}

Promise.race = race;
function race(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        handlers.resolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }
}


/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof __webpack_require__.g === "undefined" ? this : __webpack_require__.g : self));


/***/ }),

/***/ "./node_modules/zopfli.js/bin/zopfli.min.js":
/*!**************************************************!*\
  !*** ./node_modules/zopfli.js/bin/zopfli.min.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var __dirname = "/";
/**
 * @license zopfli.js 2013 - imaya [ https://github.com/imaya/zopfli.js ] The Apache License 2.0
 * Original C implementation: Google Inc. [ https://code.google.com/p/zopfli/ ] The Apache License 2.0
 */
(function() {function ca(c){throw c;}var a=void 0,D=!0,F=null,G=!1,ga=this;function ha(c,b){var d=c.split("."),e=ga;!(d[0]in e)&&e.execScript&&e.execScript("var "+d[0]);for(var g;d.length&&(g=d.shift());)!d.length&&b!==a?e[g]=b:e=e[g]?e[g]:e[g]={}};try{this.Module=Module}catch(la){this.Module=Module={}}var ma="object"===typeof process&&"function"==="function",na="object"===typeof window,oa="function"===typeof importScripts,pa=!na&&!ma&&!oa;
if(ma){Module.print=function(c){process.stdout.write(c+"\n")};Module.printErr=function(c){process.stderr.write(c+"\n")};var qa=__webpack_require__(/*! fs */ "?84b8"),ra=__webpack_require__(/*! path */ "?ec5a");Module.read=function(c){var c=ra.normalize(c),b=qa.readFileSync(c).toString();!b&&c!=ra.resolve(c)&&(c=path.join(__dirname,"..","src",c),b=qa.readFileSync(c).toString());return b};Module.load=function(c){sa(read(c))};Module.arguments||(Module.arguments=process.argv.slice(2))}
pa&&(Module.print=print,"undefined"!=typeof printErr&&(Module.printErr=printErr),Module.read="undefined"!=typeof read?read:function(c){snarf(c)},Module.arguments||("undefined"!=typeof scriptArgs?Module.arguments=scriptArgs:"undefined"!=typeof arguments&&(Module.arguments=arguments)));na&&!oa&&(Module.print||(Module.print=function(c){console.log(c)}),Module.printErr||(Module.printErr=function(c){console.log(c)}));
if(na||oa)Module.read=function(c){var b=new XMLHttpRequest;b.open("GET",c,G);b.send(F);return b.responseText},Module.arguments||"undefined"!=typeof arguments&&(Module.arguments=arguments);oa&&(Module.print||(Module.print=function(){}),Module.load=importScripts);!oa&&(!na&&!ma&&!pa)&&ca("Unknown runtime environment. Where are we?");function sa(c){eval.call(F,c)}"undefined"==!Module.load&&Module.read&&(Module.load=function(c){sa(Module.read(c))});Module.print||(Module.print=function(){});
Module.printErr||(Module.printErr=Module.print);Module.arguments||(Module.arguments=[]);Module.print=Module.print;Module.c=Module.printErr;Module.preRun||(Module.preRun=[]);Module.postRun||(Module.postRun=[]);function va(c){if(1==wa)return 1;var b={"%i1":1,"%i8":1,"%i16":2,"%i32":4,"%i64":8,"%float":4,"%double":8}["%"+c];b||("*"==c.charAt(c.length-1)?b=wa:"i"==c[0]&&(c=parseInt(c.substr(1)),ya(0==c%8),b=c/8));return b}function za(c,b){return b&&b.length?Aa[c].apply(F,b):Aa[c]()}var Ba;
function Da(){var c=[],b=0;this.z=function(d){d&=255;b&&(c.push(d),b--);if(0==c.length){if(128>d)return String.fromCharCode(d);c.push(d);b=191<d&&224>d?1:2;return""}if(0<b)return"";var d=c[0],e=c[1],g=c[2],d=191<d&&224>d?String.fromCharCode((d&31)<<6|e&63):String.fromCharCode((d&15)<<12|(e&63)<<6|g&63);c.length=0;return d};this.G=function(b){for(var b=unescape(encodeURIComponent(b)),c=[],g=0;g<b.length;g++)c.push(b.charCodeAt(g));return c}}function Ea(c){var b=H;H=H+c|0;H=H+3>>2<<2;return b}
function Fa(c){var b=Ga;Ga=Ga+c|0;Ga=Ga+3>>2<<2;if(Ga>=Ha){for(;Ha<=Ga;)Ha=2*Ha+4095>>12<<12;ya(Ha<=Math.pow(2,30));var c=I,d=new ArrayBuffer(Ha);Module.HEAP8=I=new Int8Array(d);Module.HEAP16=K=new Int16Array(d);Module.HEAP32=L=new Int32Array(d);Module.HEAPU8=Ia=new Uint8Array(d);Module.HEAPU16=Ja=new Uint16Array(d);Module.HEAPU32=Ka=new Uint32Array(d);Module.HEAPF32=La=new Float32Array(d);Module.HEAPF64=Ma=new Float64Array(d);I.set(c)}return b}var wa=4,Na={},Oa,Pa;
function Qa(c){Module.print(c+":\n"+Error().stack);ca("Assertion: "+c)}function ya(c,b){c||Qa("Assertion failed: "+b)}var Sa=this;Module.ccall=function(c,b,d,e){return Ta(Ua(c),b,d,e)};function Ua(c){try{var b=Sa.Module["_"+c];b||(b=eval("_"+c))}catch(d){}ya(b,"Cannot call unknown function "+c+" (perhaps LLVM optimizations or closure removed it?)");return b}
function Ta(c,b,d,e){function g(b,c){if("string"==c){if(b===F||b===a||0===b)return 0;j||(j=H);var d=Ea(b.length+1);Va(b,d);return d}return"array"==c?(j||(j=H),d=Ea(b.length),Wa(b,d),d):b}var j=0,k=0,e=e?e.map(function(b){return g(b,d[k++])}):[];c=c.apply(F,e);"string"==b?b=Xa(c):(ya("array"!=b),b=c);j&&(H=j);return b}Module.cwrap=function(c,b,d){var e=Ua(c);return function(){return Ta(e,b,d,Array.prototype.slice.call(arguments))}};
function Ya(c,b,d){d=d||"i8";"*"===d.charAt(d.length-1)&&(d="i32");switch(d){case "i1":I[c]=b;break;case "i8":I[c]=b;break;case "i16":K[c>>1]=b;break;case "i32":L[c>>2]=b;break;case "i64":Pa=[b>>>0,Math.min(Math.floor(b/4294967296),4294967295)>>>0];L[c>>2]=Pa[0];L[c+4>>2]=Pa[1];break;case "float":La[c>>2]=b;break;case "double":Ma[M>>3]=b;L[c>>2]=L[M>>2];L[c+4>>2]=L[M+4>>2];break;default:Qa("invalid type for setValue: "+d)}}Module.setValue=Ya;
Module.getValue=function(c,b){b=b||"i8";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":return I[c];case "i8":return I[c];case "i16":return K[c>>1];case "i32":return L[c>>2];case "i64":return L[c>>2];case "float":return La[c>>2];case "double":return L[M>>2]=L[c>>2],L[M+4>>2]=L[c+4>>2],Ma[M>>3];default:Qa("invalid type for setValue: "+b)}return F};var Za=1,$a=2,N=3;Module.ALLOC_NORMAL=0;Module.ALLOC_STACK=Za;Module.ALLOC_STATIC=$a;Module.ALLOC_NONE=N;
function Q(c,b,d,e){var g,j;"number"===typeof c?(g=D,j=c):(g=G,j=c.length);var k="string"===typeof b?b:F,d=d==N?e:[R,Ea,Fa][d===a?$a:d](Math.max(j,k?1:b.length));if(g){e=d;ya(0==(d&3));for(c=d+(j&-4);e<c;e+=4)L[e>>2]=0;for(c=d+j;e<c;)I[e++|0]=0;return d}if("i8"===k)return Ia.set(new Uint8Array(c),d),d;for(var e=0,f,h;e<j;){var n=c[e];"function"===typeof n&&(n=Na.K(n));g=k||b[e];0===g?e++:("i64"==g&&(g="i32"),Ya(d+e,n,g),h!==g&&(f=va(g),h=g),e+=f)}return d}Module.allocate=Q;
function Xa(c,b){for(var d=new Da,e="undefined"==typeof b,g="",j=0,k;;){k=Ia[c+j|0];if(e&&0==k)break;g+=d.z(k);j+=1;if(!e&&j==b)break}return g}Module.Pointer_stringify=Xa;Module.Array_stringify=function(c){for(var b="",d=0;d<c.length;d++)b+=String.fromCharCode(c[d]);return b};var ab=4096,I,Ia,K,Ja,L,Ka,La,Ma,H,Ga,bb=Module.TOTAL_STACK||5242880,Ha=Module.TOTAL_MEMORY||16777216;ya(!!Int32Array&&!!Float64Array&&!!(new Int32Array(1)).subarray&&!!(new Int32Array(1)).set,"Cannot fallback to non-typed array case: Code is too specialized");
var cb=new ArrayBuffer(Ha);I=new Int8Array(cb);K=new Int16Array(cb);L=new Int32Array(cb);Ia=new Uint8Array(cb);Ja=new Uint16Array(cb);Ka=new Uint32Array(cb);La=new Float32Array(cb);Ma=new Float64Array(cb);L[0]=255;ya(255===Ia[0]&&0===Ia[3],"Typed arrays 2 must be run on a little-endian system");Module.HEAP=a;Module.HEAP8=I;Module.HEAP16=K;Module.HEAP32=L;Module.HEAPU8=Ia;Module.HEAPU16=Ja;Module.HEAPU32=Ka;Module.HEAPF32=La;Module.HEAPF64=Ma;H=4*Math.ceil(0.25);var M,db=Q(12,"i8",Za);
M=8*Math.ceil(db/8);ya(0==M%8);Ga=bb;ya(Ga<Ha);var fb=Q(eb("(null)"),"i8",Za);function gb(c){for(;0<c.length;){var b=c.shift(),d=b.o;"number"===typeof d?b.l===a?za(d):za(d,[b.l]):d(b.l===a?F:b.l)}}var hb=[],jb=[],kb=[];function eb(c,b,d){c=(new Da).G(c);d&&(c.length=d);b||c.push(0);return c}Module.intArrayFromString=eb;Module.intArrayToString=function(c){for(var b=[],d=0;d<c.length;d++){var e=c[d];255<e&&(e&=255);b.push(String.fromCharCode(e))}return b.join("")};
function Va(c,b,d){c=eb(c,d);for(d=0;d<c.length;)I[b+d|0]=c[d],d+=1}Module.writeStringToMemory=Va;function Wa(c,b){for(var d=0;d<c.length;d++)I[b+d|0]=c[d]}Module.writeArrayToMemory=Wa;function lb(c,b){return 0<=c?c:32>=b?2*Math.abs(1<<b-1)+c:Math.pow(2,b)+c}function mb(c,b){if(0>=c)return c;var d=32>=b?Math.abs(1<<b-1):Math.pow(2,b-1);if(c>=d&&(32>=b||c>d))c=-2*d+c;return c}Math.i||(Math.i=function(c,b){var d=c&65535,e=b&65535;return d*e+((c>>>16)*e+d*(b>>>16)<<16)|0});var nb=0,ob={},pb=G,qb=F;
function rb(c){nb++;Module.monitorRunDependencies&&Module.monitorRunDependencies(nb);c?(ya(!ob[c]),ob[c]=1,qb===F&&"undefined"!==typeof setInterval&&(qb=setInterval(function(){var b=G,c;for(c in ob)b||(b=D,Module.c("still waiting on run dependencies:")),Module.c("dependency: "+c);b&&Module.c("(end of list)")},6E3))):Module.c("warning: run dependency added without ID")}Module.addRunDependency=rb;
function sb(c){nb--;Module.monitorRunDependencies&&Module.monitorRunDependencies(nb);c?(ya(ob[c]),delete ob[c]):Module.c("warning: run dependency removed without ID");0==nb&&(qb!==F&&(clearInterval(qb),qb=F),!pb&&tb&&ub())}Module.removeRunDependency=sb;Module.preloadedImages={};Module.preloadedAudios={};ya(Ga==bb);ya(bb==bb);Ga+=7528;ya(Ga<Ha);var vb,wb;Q(24,"i8",N,5242880);Q(4,"i8",N,5242904);Q(1024,"i8",N,5242908);Q([107,32,60,61,32,90,79,80,70,76,73,95,77,65,88,95,77,65,84,67,72,0],"i8",N,5243932);
Q([109,97,120,32,115,121,115,116,101,109,32,98,121,116,101,115,32,61,32,37,49,48,108,117,10,0],"i8",N,5243956);Q([112,32,60,32,90,79,80,70,76,73,95,87,73,78,68,79,87,95,83,73,90,69,0],"i8",N,5243984);Q([47,85,115,101,114,115,47,121,117,116,97,46,105,109,97,121,97,47,103,105,116,47,122,111,112,102,108,105,46,106,115,47,122,111,112,102,108,105,47,122,111,112,102,108,105,95,108,105,98,46,99,0],"i8",N,5244008);
Q([79,114,105,103,105,110,97,108,32,83,105,122,101,58,32,37,100,44,32,67,111,109,112,114,101,115,115,101,100,58,32,37,100,44,32,67,111,109,112,114,101,115,115,105,111,110,58,32,37,102,37,37,32,82,101,109,111,118,101,100,10,0],"i8",N,5244060);Q([108,105,116,108,101,110,32,62,61,32,51,32,38,38,32,108,105,116,108,101,110,32,60,61,32,50,56,56,0],"i8",N,5244124);Q([32,37,120,0],"i8",N,5244156);Q([110,101,119,67,111,115,116,32,62,61,32,48,0],"i8",N,5244160);
Q([112,112,32,61,61,32,104,112,111,115,0],"i8",N,5244176);Q([108,108,95,108,101,110,103,116,104,115,91,108,105,116,108,101,110,93,32,62,32,48,0],"i8",N,5244188);Q([40,104,101,120,58,0],"i8",N,5244212);Q([108,101,110,103,116,104,95,97,114,114,97,121,91,105,110,100,101,120,93,32,33,61,32,48,0],"i8",N,5244220);Q([104,118,97,108,32,60,32,54,53,53,51,54,0],"i8",N,5244248);Q([108,105,116,108,101,110,32,60,32,50,53,54,0],"i8",N,5244264);
Q([47,85,115,101,114,115,47,121,117,116,97,46,105,109,97,121,97,47,103,105,116,47,122,111,112,102,108,105,46,106,115,47,122,111,112,102,108,105,47,116,114,101,101,46,99,0],"i8",N,5244280);Q([37,100,32,0],"i8",N,5244328);Q([108,101,110,103,116,104,95,97,114,114,97,121,91,105,110,100,101,120,93,32,60,61,32,90,79,80,70,76,73,95,77,65,88,95,77,65,84,67,72,0],"i8",N,5244332);Q([112,111,115,32,60,32,115,105,122,101,0],"i8",N,5244372);
Q([99,111,109,112,114,101,115,115,101,100,32,98,108,111,99,107,32,115,105,122,101,58,32,37,100,32,40,37,100,107,41,32,40,117,110,99,58,32,37,100,41,10,0],"i8",N,5244384);Q([98,108,111,99,107,32,115,112,108,105,116,32,112,111,105,110,116,115,58,32,0],"i8",N,5244428);Q([108,101,110,103,116,104,95,97,114,114,97,121,91,105,110,100,101,120,93,32,60,61,32,105,110,100,101,120,0],"i8",N,5244452);
Q([47,85,115,101,114,115,47,121,117,116,97,46,105,109,97,121,97,47,103,105,116,47,122,111,112,102,108,105,46,106,115,47,122,111,112,102,108,105,47,115,113,117,101,101,122,101,46,99,0],"i8",N,5244484);Q([108,105,109,105,116,32,62,61,32,90,79,80,70,76,73,95,77,73,78,95,77,65,84,67,72,0],"i8",N,5244536);Q([100,95,99,111,117,110,116,115,91,105,93,32,61,61,32,48,32,124,124,32,100,95,108,101,110,103,116,104,115,91,105,93,32,62,32,48,0],"i8",N,5244564);
Q([110,112,111,105,110,116,115,32,61,61,32,110,108,122,55,55,112,111,105,110,116,115,0],"i8",N,5244604);Q([112,111,115,32,43,32,108,101,110,103,116,104,32,60,61,32,105,110,101,110,100,0],"i8",N,5244628);Q([108,105,109,105,116,32,60,61,32,90,79,80,70,76,73,95,77,65,88,95,77,65,84,67,72,0],"i8",N,5244652);Q([108,108,95,99,111,117,110,116,115,91,105,93,32,61,61,32,48,32,124,124,32,108,108,95,108,101,110,103,116,104,115,91,105,93,32,62,32,48,0],"i8",N,5244680);
Q([42,110,112,111,105,110,116,115,32,61,61,32,110,108,122,55,55,112,111,105,110,116,115,0],"i8",N,5244720);Q([115,116,100,58,58,98,97,100,95,97,108,108,111,99,0],"i8",N,5244744);Q([33,101,114,114,111,114,0],"i8",N,5244760);Q([33,40,100,117,109,109,121,95,108,101,110,103,116,104,32,33,61,32,108,101,110,103,116,104,32,38,38,32,108,101,110,103,116,104,32,62,32,50,32,38,38,32,100,117,109,109,121,95,108,101,110,103,116,104,32,62,32,50,41,0],"i8",N,5244768);
Q([112,111,115,32,43,32,42,108,101,110,103,116,104,32,60,61,32,115,105,122,101,0],"i8",N,5244828);Q([116,114,101,101,115,105,122,101,58,32,37,100,10,0],"i8",N,5244852);Q([98,101,115,116,108,101,110,103,116,104,32,61,61,32,90,111,112,102,108,105,77,97,120,67,97,99,104,101,100,83,117,98,108,101,110,40,108,109,99,44,32,112,111,115,44,32,108,101,110,103,116,104,41,0],"i8",N,5244868);
Q([47,85,115,101,114,115,47,121,117,116,97,46,105,109,97,121,97,47,103,105,116,47,122,111,112,102,108,105,46,106,115,47,122,111,112,102,108,105,47,108,122,55,55,46,99,0],"i8",N,5244924);Q([79,114,105,103,105,110,97,108,32,83,105,122,101,58,32,37,100,44,32,67,111,109,112,114,101,115,115,101,100,58,32,37,100,44,32,67,111,109,112,114,101,115,115,105,111,110,58,32,37,102,37,37,32,82,101,109,111,118,101,100,10,0],"i8",N,5244972);Q([108,108,112,111,115,32,60,32,108,101,110,100,0],"i8",N,5245036);
Q([105,110,32,117,115,101,32,98,121,116,101,115,32,32,32,32,32,61,32,37,49,48,108,117,10,0],"i8",N,5245052);Q([98,105,116,108,101,110,103,116,104,115,91,105,93,32,62,61,32,48,0],"i8",N,5245080);Q([112,111,115,32,60,32,105,110,101,110,100,0],"i8",N,5245100);Q([100,97,116,97,91,112,111,115,32,45,32,100,105,115,116,32,43,32,105,93,32,61,61,32,100,97,116,97,91,112,111,115,32,43,32,105,93,0],"i8",N,5245112);Q([98,116,121,112,101,32,61,61,32,50,0],"i8",N,5245152);
Q([98,101,115,116,108,101,110,103,116,104,32,60,61,32,108,101,110,103,116,104,0],"i8",N,5245164);Q([108,108,112,111,115,32,62,32,108,115,116,97,114,116,0],"i8",N,5245188);Q([115,121,115,116,101,109,32,98,121,116,101,115,32,32,32,32,32,61,32,37,49,48,108,117,10,0],"i8",N,5245204);Q([48,0],"i8",N,5245232);Q([108,101,110,103,116,104,115,91,105,93,32,60,61,32,109,97,120,98,105,116,115,0],"i8",N,5245236);
Q([115,117,98,108,101,110,91,42,108,101,110,103,116,104,93,32,61,61,32,115,45,62,108,109,99,45,62,100,105,115,116,91,108,109,99,112,111,115,93,0],"i8",N,5245260);Q([33,40,115,45,62,108,109,99,45,62,108,101,110,103,116,104,91,108,109,99,112,111,115,93,32,61,61,32,49,32,38,38,32,115,45,62,108,109,99,45,62,100,105,115,116,91,108,109,99,112,111,115,93,32,61,61,32,48,41,0],"i8",N,5245300);Q([98,116,121,112,101,32,61,61,32,49,0],"i8",N,5245360);
Q([99,111,115,116,32,60,32,90,79,80,70,76,73,95,76,65,82,71,69,95,70,76,79,65,84,0],"i8",N,5245372);Q([115,45,62,108,109,99,45,62,108,101,110,103,116,104,91,108,109,99,112,111,115,93,32,61,61,32,49,32,38,38,32,115,45,62,108,109,99,45,62,100,105,115,116,91,108,109,99,112,111,115,93,32,61,61,32,48,0],"i8",N,5245400);Q([98,108,111,99,107,115,105,122,101,32,60,32,54,53,53,51,54,0],"i8",N,5245460);
Q([47,85,115,101,114,115,47,121,117,116,97,46,105,109,97,121,97,47,103,105,116,47,122,111,112,102,108,105,46,106,115,47,122,111,112,102,108,105,47,100,101,102,108,97,116,101,46,99,0],"i8",N,5245480);Q([105,32,60,32,105,110,101,110,100,0],"i8",N,5245532);Q([98,97,100,95,97,114,114,97,121,95,110,101,119,95,108,101,110,103,116,104,0],"i8",N,5245544);Q([114,108,101,91,114,108,101,95,115,105,122,101,32,45,32,49,93,32,60,61,32,49,56,0],"i8",N,5245568);
Q([98,101,115,116,108,101,110,103,116,104,32,60,61,32,108,105,109,105,116,0],"i8",N,5245592);Q([112,111,115,32,43,32,108,101,110,103,116,104,32,60,61,32,100,97,116,97,115,105,122,101,0],"i8",N,5245612);Q([108,108,100,95,108,101,110,103,116,104,115,91,105,93,32,60,32,49,54,0],"i8",N,5245640);Q([100,105,115,116,32,60,61,32,112,111,115,0],"i8",N,5245660);
Q([101,120,112,101,99,116,101,100,95,100,97,116,97,95,115,105,122,101,32,61,61,32,48,32,124,124,32,116,101,115,116,108,101,110,103,116,104,32,61,61,32,101,120,112,101,99,116,101,100,95,100,97,116,97,95,115,105,122,101,0],"i8",N,5245672);Q([98,116,121,112,101,32,61,61,32,49,32,124,124,32,98,116,121,112,101,32,61,61,32,50,0],"i8",N,5245732);Q([104,104,97,115,104,118,97,108,91,112,93,32,61,61,32,104,118,97,108,0],"i8",N,5245760);
Q([100,95,108,101,110,103,116,104,115,91,100,115,93,32,62,32,48,0],"i8",N,5245780);Q([98,101,115,116,108,101,110,103,116,104,32,61,61,32,108,101,110,103,116,104,0],"i8",N,5245800);Q([47,85,115,101,114,115,47,121,117,116,97,46,105,109,97,121,97,47,103,105,116,47,122,111,112,102,108,105,46,106,115,47,122,111,112,102,108,105,47,99,97,99,104,101,46,99,0],"i8",N,5245824);Q([99,111,115,116,115,91,98,108,111,99,107,115,105,122,101,93,32,62,61,32,48,0],"i8",N,5245872);
Q([112,32,61,61,32,104,112,114,101,118,91,112,112,93,0],"i8",N,5245896);Q([108,108,95,108,101,110,103,116,104,115,91,108,108,115,93,32,62,32,48,0],"i8",N,5245912);Q([41,10,0],"i8",N,5245932);Q([108,115,116,97,114,116,32,60,32,108,101,110,100,0],"i8",N,5245936);Q([47,85,115,101,114,115,47,121,117,116,97,46,105,109,97,121,97,47,103,105,116,47,122,111,112,102,108,105,46,106,115,47,122,111,112,102,108,105,47,98,108,111,99,107,115,112,108,105,116,116,101,114,46,99,0],"i8",N,5245952);Q(472,"i8",N,5246008);
Q([90,111,112,102,108,105,86,101,114,105,102,121,76,101,110,68,105,115,116,0],"i8",N,5246480);Q([90,111,112,102,108,105,83,117,98,108,101,110,84,111,67,97,99,104,101,0],"i8",N,5246500);Q([90,111,112,102,108,105,76,101,110,103,116,104,115,84,111,83,121,109,98,111,108,115,0],"i8",N,5246520);Q([90,111,112,102,108,105,76,90,55,55,71,114,101,101,100,121,0],"i8",N,5246544);Q([90,111,112,102,108,105,70,105,110,100,76,111,110,103,101,115,116,77,97,116,99,104,0],"i8",N,5246564);
Q([90,111,112,102,108,105,67,111,109,112,114,101,115,115,0],"i8",N,5246588);Q([90,111,112,102,108,105,67,97,108,99,117,108,97,116,101,69,110,116,114,111,112,121,0],"i8",N,5246604);Q([90,111,112,102,108,105,67,97,108,99,117,108,97,116,101,66,108,111,99,107,83,105,122,101,0],"i8",N,5246628);Q([90,111,112,102,108,105,67,97,108,99,117,108,97,116,101,66,105,116,76,101,110,103,116,104,115,0],"i8",N,5246656);Q([90,111,112,102,108,105,66,108,111,99,107,83,112,108,105,116,76,90,55,55,0],"i8",N,5246684);
Q([90,111,112,102,108,105,66,108,111,99,107,83,112,108,105,116,0],"i8",N,5246708);Q([84,114,121,71,101,116,70,114,111,109,76,111,110,103,101,115,116,77,97,116,99,104,67,97,99,104,101,0],"i8",N,5246728);Q([84,114,97,99,101,66,97,99,107,119,97,114,100,115,0],"i8",N,5246756);Q([83,116,111,114,101,73,110,76,111,110,103,101,115,116,77,97,116,99,104,67,97,99,104,101,0],"i8",N,5246772);Q([80,114,105,110,116,66,108,111,99,107,83,112,108,105,116,80,111,105,110,116,115,0],"i8",N,5246800);
Q([76,90,55,55,79,112,116,105,109,97,108,82,117,110,0],"i8",N,5246824);Q([71,101,116,66,101,115,116,76,101,110,103,116,104,115,0],"i8",N,5246840);Q([70,111,108,108,111,119,80,97,116,104,0],"i8",N,5246856);Q([68,101,102,108,97,116,101,83,112,108,105,116,116,105,110,103,76,97,115,116,0],"i8",N,5246868);Q([68,101,102,108,97,116,101,78,111,110,67,111,109,112,114,101,115,115,101,100,66,108,111,99,107,0],"i8",N,5246892);Q([68,101,102,108,97,116,101,66,108,111,99,107,0],"i8",N,5246920);
Q([65,100,100,76,90,55,55,68,97,116,97,0],"i8",N,5246936);Q([65,100,100,76,90,55,55,66,108,111,99,107,0],"i8",N,5246948);Q([65,100,100,68,121,110,97,109,105,99,84,114,101,101,0],"i8",N,5246964);Q([0,0,0,0,96,16,80,0,0,0,0,0,0,0,0,0,0,0,0,0],"i8",N,5246980);Q(1,"i8",N,5247E3);Q([0,0,0,0,108,16,80,0,0,0,0,0,0,0,0,0,0,0,0,0],"i8",N,5247004);Q(1,"i8",N,5247024);Q([83,116,57,98,97,100,95,97,108,108,111,99,0],"i8",N,5247028);
Q([83,116,50,48,98,97,100,95,97,114,114,97,121,95,110,101,119,95,108,101,110,103,116,104,0],"i8",N,5247044);Q(12,"i8",N,5247072);Q([0,0,0,0,0,0,0,0,96,16,80,0],"i8",N,5247084);Q(1,"i8",N,5247096);Q(4,"i8",N,5247100);
Q([0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,2,1,0,0,3,1,0,0,4,1,0,0,5,1,0,0,6,1,0,0,7,1,0,0,8,1,0,0,9,1,0,0,9,1,0,0,10,1,0,0,10,1,0,0,11,1,0,0,11,1,0,0,12,1,0,0,12,1,0,0,13,1,0,0,13,1,0,0,13,1,0,0,13,1,0,0,14,1,0,0,14,1,0,0,14,1,0,0,14,1,0,0,15,1,0,0,15,1,0,0,15,1,0,0,15,1,0,0,16,1,0,0,16,1,0,0,16,1,0,0,16,1,0,0,17,1,0,0,17,1,0,0,17,1,0,0,17,1,0,0,17,1,0,0,17,1,0,0,17,1,0,0,17,1,0,0,18,1,0,0,18,1,0,0,18,1,0,0,18,1,0,0,18,1,0,0,18,1,0,0,18,1,0,0,18,1,0,0,19,1,0,0,19,1,0,0,19,1,0,0,19,1,0,0,19,1,0,0,19,1,0,
0,19,1,0,0,19,1,0,0,20,1,0,0,20,1,0,0,20,1,0,0,20,1,0,0,20,1,0,0,20,1,0,0,20,1,0,0,20,1,0,0,21,1,0,0,21,1,0,0,21,1,0,0,21,1,0,0,21,1,0,0,21,1,0,0,21,1,0,0,21,1,0,0,21,1,0,0,21,1,0,0,21,1,0,0,21,1,0,0,21,1,0,0,21,1,0,0,21,1,0,0,21,1,0,0,22,1,0,0,22,1,0,0,22,1,0,0,22,1,0,0,22,1,0,0,22,1,0,0,22,1,0,0,22,1,0,0,22,1,0,0,22,1,0,0,22,1,0,0,22,1,0,0,22,1,0,0,22,1,0,0,22,1,0,0,22,1,0,0,23,1,0,0,23,1,0,0,23,1,0,0,23,1,0,0,23,1,0,0,23,1,0,0,23,1,0,0,23,1,0,0,23,1,0,0,23,1,0,0,23,1,0,0,23,1,0,0,23,1,0,0,23,1,
0,0,23,1,0,0,23,1,0,0,24,1,0,0,24,1,0,0,24,1,0,0,24,1,0,0,24,1,0,0,24,1,0,0,24,1,0,0,24,1,0,0,24,1,0,0,24,1,0,0,24,1,0,0,24,1,0,0,24,1,0,0,24,1,0,0,24,1,0,0,24,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,25,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,
1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,26,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,27,1,0,0,
27,1,0,0,27,1,0,0,27,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,28,1,0,0,29,1,0,0],"i8",N,5247104);
Q([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,
0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,
4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,
0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,
0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,5,0,0,0,0,0,0,0],"i8",N,5248140);
Q([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,
0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,9,0,0,0,10,0,0,0,11,0,0,0,12,0,0,0,13,0,0,0,14,0,0,0,15,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,9,0,0,0,10,0,0,0,11,0,0,0,12,0,0,0,13,0,0,0,14,0,0,0,15,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,9,0,0,0,10,0,0,0,11,0,0,0,12,0,0,0,13,0,0,0,14,0,0,0,15,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,
0,8,0,0,0,9,0,0,0,10,0,0,0,11,0,0,0,12,0,0,0,13,0,0,0,14,0,0,0,15,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,9,0,0,0,10,0,0,0,11,0,0,0,12,0,0,0,13,0,0,0,14,0,0,0,15,0,0,0,16,0,0,0,17,0,0,0,18,0,0,0,19,0,0,0,20,0,0,0,21,0,0,0,22,0,0,0,23,0,0,0,24,0,0,0,25,0,0,0,26,0,0,0,27,0,0,0,28,0,0,0,29,0,0,0,30,0,0,0,31,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,9,0,0,0,10,0,0,0,11,0,0,0,12,0,0,0,13,0,0,0,14,0,0,0,15,0,0,0,16,0,0,0,17,0,0,0,
18,0,0,0,19,0,0,0,20,0,0,0,21,0,0,0,22,0,0,0,23,0,0,0,24,0,0,0,25,0,0,0,26,0,0,0,27,0,0,0,28,0,0,0,29,0,0,0,30,0,0,0,31,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,9,0,0,0,10,0,0,0,11,0,0,0,12,0,0,0,13,0,0,0,14,0,0,0,15,0,0,0,16,0,0,0,17,0,0,0,18,0,0,0,19,0,0,0,20,0,0,0,21,0,0,0,22,0,0,0,23,0,0,0,24,0,0,0,25,0,0,0,26,0,0,0,27,0,0,0,28,0,0,0,29,0,0,0,30,0,0,0,31,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,9,0,0,0,10,0,0,0,11,0,0,0,
12,0,0,0,13,0,0,0,14,0,0,0,15,0,0,0,16,0,0,0,17,0,0,0,18,0,0,0,19,0,0,0,20,0,0,0,21,0,0,0,22,0,0,0,23,0,0,0,24,0,0,0,25,0,0,0,26,0,0,0,27,0,0,0,28,0,0,0,29,0,0,0,30,0,0,0,0,0,0,0],"i8",N,5249176);Q([1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,7,0,0,0,9,0,0,0,13,0,0,0,17,0,0,0,25,0,0,0,33,0,0,0,49,0,0,0,65,0,0,0,97,0,0,0,129,0,0,0,193,0,0,0,1,1,0,0,129,1,0,0,1,2,0,0,1,3,0,0,1,4,0,0,1,6,0,0,1,8,0,0,1,12,0,0,1,16,0,0,1,24,0,0,1,32,0,0,1,48,0,0,1,64,0,0,1,96,0,0],"i8",N,5250212);
Q([16,0,0,0,17,0,0,0,18,0,0,0,0,0,0,0,8,0,0,0,7,0,0,0,9,0,0,0,6,0,0,0,10,0,0,0,5,0,0,0,11,0,0,0,4,0,0,0,12,0,0,0,3,0,0,0,13,0,0,0,2,0,0,0,14,0,0,0,1,0,0,0,15,0,0,0],"i8",N,5250332);L[1311747]=4;L[1311748]=12;L[1311749]=8;L[1311753]=16;L[1311754]=2;L[1311755]=10;wb=Q([2,0,0,0],"i8",$a);L[1311768]=wb+8|0;L[1311769]=5247028;L[1311770]=a;L[1311771]=wb+8|0;L[1311772]=5247044;function xb(){gb(kb);ca("exit(-1) called, at "+Error().stack)}
function S(c,b,d,e){ca("Assertion failed: "+(e?Xa(e):"unknown condition")+", at: "+[c?Xa(c):"unknown filename",b,d?Xa(d):"unknown function"]+" at "+Error().stack)}var yb=13,zb=9,Ab=22,Bb=5,Cb=21,Db=6;function Eb(c){Fb||(Fb=Q([0],"i32",$a));L[Fb>>2]=c}var Fb,Gb=Q(1,"i32*",Za),Hb=Q(1,"i32*",Za);vb=Q(1,"i32*",Za);var Ib=Q(1,"i32*",Za),Jb=2,Kb=[F],Lb=D;
function Mb(c,b){if("string"!==typeof c)return F;b===a&&(b="/");c&&"/"==c[0]&&(b="");for(var d=(b+"/"+c).split("/").reverse(),e=[""];d.length;){var g=d.pop();""==g||"."==g||(".."==g?1<e.length&&e.pop():e.push(g))}return 1==e.length?"/":e.join("/")}
function Nb(c,b,d){var e={F:G,n:G,error:0,name:F,path:F,object:F,u:G,w:F,v:F},c=Mb(c);if("/"==c)e.F=D,e.n=e.u=D,e.name="/",e.path=e.w="/",e.object=e.v=Ob;else if(c!==F)for(var d=d||0,c=c.slice(1).split("/"),g=Ob,j=[""];c.length;){1==c.length&&g.d&&(e.u=D,e.w=1==j.length?"/":j.join("/"),e.v=g,e.name=c[0]);var k=c.shift();if(g.d)if(g.A){if(!g.a.hasOwnProperty(k)){e.error=2;break}}else{e.error=yb;break}else{e.error=20;break}g=g.a[k];if(g.link&&!(b&&0==c.length)){if(40<d){e.error=40;break}e=Mb(g.link,
j.join("/"));e=Nb([e].concat(c).join("/"),b,d+1);break}j.push(k);0==c.length&&(e.n=D,e.path=j.join("/"),e.object=g)}return e}function Pb(c){Qb();c=Nb(c,a);if(c.n)return c.object;Eb(c.error);return F}
function Rb(c,b,d,e,g){c||(c="/");"string"===typeof c&&(c=Pb(c));c||(Eb(yb),ca(Error("Parent path must exist.")));c.d||(Eb(20),ca(Error("Parent must be a folder.")));!c.write&&!Lb&&(Eb(yb),ca(Error("Parent folder must be writeable.")));if(!b||"."==b||".."==b)Eb(2),ca(Error("Name must not be empty."));c.a.hasOwnProperty(b)&&(Eb(17),ca(Error("Can't overwrite object.")));c.a[b]={A:e===a?D:e,write:g===a?G:g,timestamp:Date.now(),D:Jb++};for(var j in d)d.hasOwnProperty(j)&&(c.a[b][j]=d[j]);return c.a[b]}
function Sb(c,b,d,e){return Rb(c,b,{d:D,b:G,a:{}},d,e)}function Tb(c,b,d,e){c=Pb(c);c===F&&ca(Error("Invalid parent."));for(b=b.split("/").reverse();b.length;){var g=b.pop();g&&(c.a.hasOwnProperty(g)||Sb(c,g,d,e),c=c.a[g])}return c}function Ub(c,b,d,e,g){d.d=G;return Rb(c,b,d,e,g)}function Vb(c,b,d,e,g){if("string"===typeof d){for(var j=Array(d.length),k=0,f=d.length;k<f;++k)j[k]=d.charCodeAt(k);d=j}d={b:G,a:d.subarray?d.subarray(0):d};return Ub(c,b,d,e,g)}
function Wb(c,b,d,e){!d&&!e&&ca(Error("A device must have at least one callback defined."));return Ub(c,b,{b:D,input:d,e:e},Boolean(d),Boolean(e))}function Qb(){Ob||(Ob={A:D,write:D,d:D,b:G,timestamp:Date.now(),D:1,a:{}})}var Xb,Ob;
function Yb(c,b,d){var e=Kb[c];if(e){if(e.j){if(0>d)return Eb(Ab),-1;if(e.object.b){if(e.object.e){for(var g=0;g<d;g++)try{e.object.e(I[b+g|0])}catch(j){return Eb(Bb),-1}e.object.timestamp=Date.now();return g}Eb(Db);return-1}g=e.position;c=Kb[c];if(!c||c.object.b)Eb(zb),b=-1;else if(c.j)if(c.object.d)Eb(Cb),b=-1;else if(0>d||0>g)Eb(Ab),b=-1;else{for(var k=c.object.a;k.length<g;)k.push(0);for(var f=0;f<d;f++)k[g+f]=Ia[b+f|0];c.object.timestamp=Date.now();b=f}else Eb(yb),b=-1;-1!=b&&(e.position+=b);
return b}Eb(yb);return-1}Eb(zb);return-1}function Zb(c,b,d,e){b*=d;0!=b&&(-1==Yb(e,c,b)&&Kb[e])&&(Kb[e].error=D)}
function $b(c,b,d){function e(b){var c;"double"===b?c=(L[M>>2]=L[d+g>>2],L[M+4>>2]=L[d+(g+4)>>2],Ma[M>>3]):"i64"==b?c=[L[d+g>>2],L[d+(g+4)>>2]]:(b="i32",c=L[d+g>>2]);g+=Math.max(va(b),wa);return c}for(var g=0,j=[],k,f;;){var h=b;k=I[b];if(0===k)break;f=I[b+1|0];if(37==k){var n=G,m=G,i=G,l=G;a:for(;;){switch(f){case 43:n=D;break;case 45:m=D;break;case 35:i=D;break;case 48:if(l)break a;else{l=D;break}default:break a}b++;f=I[b+1|0]}var q=0;if(42==f)q=e("i32"),b++,f=I[b+1|0];else for(;48<=f&&57>=f;)q=
10*q+(f-48),b++,f=I[b+1|0];var v=G;if(46==f){var u=0,v=D;b++;f=I[b+1|0];if(42==f)u=e("i32"),b++;else for(;;){f=I[b+1|0];if(48>f||57<f)break;u=10*u+(f-48);b++}f=I[b+1|0]}else u=6;var s;switch(String.fromCharCode(f)){case "h":f=I[b+2|0];104==f?(b++,s=1):s=2;break;case "l":f=I[b+2|0];108==f?(b++,s=8):s=4;break;case "L":case "q":case "j":s=8;break;case "z":case "t":case "I":s=4;break;default:s=F}s&&b++;f=I[b+1|0];if(-1!="diuoxXp".split("").indexOf(String.fromCharCode(f))){h=100==f||105==f;s=s||4;var r=
k=e("i"+8*s),p;8==s&&(k=117==f?(k[0]>>>0)+4294967296*(k[1]>>>0):(k[0]>>>0)+4294967296*(k[1]|0));4>=s&&(k=(h?mb:lb)(k&Math.pow(256,s)-1,8*s));var w=Math.abs(k),h="";if(100==f||105==f)p=8==s&&ac?ac.stringify(r[0],r[1],F):mb(k,8*s).toString(10);else if(117==f)p=8==s&&ac?ac.stringify(r[0],r[1],D):lb(k,8*s).toString(10),k=Math.abs(k);else if(111==f)p=(i?"0":"")+w.toString(8);else if(120==f||88==f){h=i?"0x":"";if(8==s&&ac)p=(r[1]>>>0).toString(16)+(r[0]>>>0).toString(16);else if(0>k){k=-k;p=(w-1).toString(16);
r=[];for(i=0;i<p.length;i++)r.push((15-parseInt(p[i],16)).toString(16));for(p=r.join("");p.length<2*s;)p="f"+p}else p=w.toString(16);88==f&&(h=h.toUpperCase(),p=p.toUpperCase())}else 112==f&&(0===w?p="(nil)":(h="0x",p=w.toString(16)));if(v)for(;p.length<u;)p="0"+p;for(n&&(h=0>k?"-"+h:"+"+h);h.length+p.length<q;)m?p+=" ":l?p="0"+p:h=" "+h;p=h+p;p.split("").forEach(function(b){j.push(b.charCodeAt(0))})}else if(-1!="fFeEgG".split("").indexOf(String.fromCharCode(f))){k=e("double");if(isNaN(k))p="nan",
l=G;else if(isFinite(k)){v=G;s=Math.min(u,20);if(103==f||71==f)v=D,u=u||1,s=parseInt(k.toExponential(s).split("e")[1],10),u>s&&-4<=s?(f=(103==f?"f":"F").charCodeAt(0),u-=s+1):(f=(103==f?"e":"E").charCodeAt(0),u--),s=Math.min(u,20);if(101==f||69==f)p=k.toExponential(s),/[eE][-+]\d$/.test(p)&&(p=p.slice(0,-1)+"0"+p.slice(-1));else if(102==f||70==f)p=k.toFixed(s);h=p.split("e");if(v&&!i)for(;1<h[0].length&&-1!=h[0].indexOf(".")&&("0"==h[0].slice(-1)||"."==h[0].slice(-1));)h[0]=h[0].slice(0,-1);else for(i&&
-1==p.indexOf(".")&&(h[0]+=".");u>s++;)h[0]+="0";p=h[0]+(1<h.length?"e"+h[1]:"");69==f&&(p=p.toUpperCase());n&&0<=k&&(p="+"+p)}else p=(0>k?"-":"")+"inf",l=G;for(;p.length<q;)p=m?p+" ":l&&("-"==p[0]||"+"==p[0])?p[0]+"0"+p.slice(1):(l?"0":" ")+p;97>f&&(p=p.toUpperCase());p.split("").forEach(function(b){j.push(b.charCodeAt(0))})}else if(115==f){l=n=e("i8*")||fb;l|=0;f=0;for(f=l;I[f]|0;)f=f+1|0;l=f-l|0;v&&(l=Math.min(l,u));if(!m)for(;l<q--;)j.push(32);for(i=0;i<l;i++)j.push(Ia[n++|0]);if(m)for(;l<q--;)j.push(32)}else if(99==
f){for(m&&j.push(e("i8"));0<--q;)j.push(32);m||j.push(e("i8"))}else if(110==f)m=e("i32*"),L[m>>2]=j.length;else if(37==f)j.push(k);else for(i=h;i<b+2;i++)j.push(I[i]);b+=2}else j.push(k),b+=1}p=H;Zb(Q(j,"i8",Za),1,j.length,c);H=p}function bc(c,b,d){c|=0;b|=0;d|=0;if((c&3)==(b&3)){for(;c&3;){if(0==(d|0))return;I[c]=I[b];c=c+1|0;b=b+1|0;d=d-1|0}for(;4<=(d|0);)L[c>>2]=L[b>>2],c=c+4|0,b=b+4|0,d=d-4|0}for(;0<(d|0);)I[c]=I[b],c=c+1|0,b=b+1|0,d=d-1|0}
function cc(c,b){var d,c=c|0;d=0;var b=b|0,e=0,g=0,j=0,k=0,e=c+b|0;if(20<=(b|0)){d&=255;k=c&3;g=d|d<<8|d<<16|d<<24;j=e&-4;if(k)for(k=c+4-k|0;(c|0)<(k|0);)I[c]=d,c=c+1|0;for(;(c|0)<(j|0);)L[c>>2]=g,c=c+4|0}for(;(c|0)<(e|0);)I[c]=d,c=c+1|0}
var dc=[8,7,6,6,5,5,5,5,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0];function ec(c){var b=dc[c>>>24];if(8>b)return b;b=dc[c>>16&255];if(8>b)return b+8;b=dc[c>>8&255];return 8>b?b+16:dc[c&255]+24}function U(){ca("abort() at "+Error().stack)}
function fc(){switch(8){case 8:return ab;case 54:case 56:case 21:case 61:case 63:case 22:case 67:case 23:case 24:case 25:case 26:case 27:case 69:case 28:case 101:case 70:case 71:case 29:case 30:case 199:case 75:case 76:case 32:case 43:case 44:case 80:case 46:case 47:case 45:case 48:case 49:case 42:case 82:case 33:case 7:case 108:case 109:case 107:case 112:case 119:case 121:return 200809;case 13:case 104:case 94:case 95:case 34:case 35:case 77:case 81:case 83:case 84:case 85:case 86:case 87:case 88:case 89:case 90:case 91:case 94:case 95:case 110:case 111:case 113:case 114:case 115:case 116:case 117:case 118:case 120:case 40:case 16:case 79:case 19:return-1;
case 92:case 93:case 5:case 72:case 6:case 74:case 92:case 93:case 96:case 97:case 98:case 99:case 102:case 103:case 105:return 1;case 38:case 66:case 50:case 51:case 4:return 1024;case 15:case 64:case 41:return 32;case 55:case 37:case 17:return 2147483647;case 18:case 1:return 47839;case 59:case 57:return 99;case 68:case 58:return 2048;case 0:return 2097152;case 3:return 65536;case 14:return 32768;case 73:return 32767;case 39:return 16384;case 60:return 1E3;case 106:return 700;case 52:return 256;
case 62:return 255;case 2:return 100;case 65:return 64;case 36:return 20;case 100:return 16;case 20:return 6;case 53:return 4}Eb(Ab);return-1}function gc(c){hc||(Ga=Ga+4095>>12<<12,hc=D);var b=Ga;0!=c&&Fa(c);return b}var hc,ic=G,jc,kc,lc,mc;
hb.unshift({o:function(){if(!Module.noFSInit&&!Xb){var c,b,d,e=function(c){c===F||10===c?(b.k(b.buffer.join("")),b.buffer=[]):b.buffer.push(f.z(c))};ya(!Xb,"FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");Xb=D;Qb();c=c||Module.stdin;b=b||Module.stdout;d=d||Module.stderr;var g=D,j=D,k=D;c||(g=G,c=function(){if(!c.m||!c.m.length){var b;"undefined"!=typeof window&&"function"==
typeof window.prompt?(b=window.prompt("Input: "),b===F&&(b=String.fromCharCode(0))):"function"==typeof readline&&(b=readline());b||(b="");c.m=eb(b+"\n",D)}return c.m.shift()});var f=new Da;b||(j=G,b=e);b.k||(b.k=Module.print);b.buffer||(b.buffer=[]);d||(k=G,d=e);d.k||(d.k=Module.print);d.buffer||(d.buffer=[]);try{Sb("/","tmp",D,D)}catch(h){}var e=Sb("/","dev",D,D),n=Wb(e,"stdin",c),m=Wb(e,"stdout",F,b);d=Wb(e,"stderr",F,d);Wb(e,"tty",c,b);Kb[1]={path:"/dev/stdin",object:n,position:0,s:D,j:G,r:G,t:!g,
error:G,q:G,B:[]};Kb[2]={path:"/dev/stdout",object:m,position:0,s:G,j:D,r:G,t:!j,error:G,q:G,B:[]};Kb[3]={path:"/dev/stderr",object:d,position:0,s:G,j:D,r:G,t:!k,error:G,q:G,B:[]};ya(128>Math.max(Gb,Hb,vb));L[Gb>>2]=1;L[Hb>>2]=2;L[vb>>2]=3;Tb("/","dev/shm/tmp",D,D);for(g=Kb.length;g<Math.max(Gb,Hb,vb)+4;g++)Kb[g]=F;Kb[Gb]=Kb[1];Kb[Hb]=Kb[2];Kb[vb]=Kb[3];Q([Q([0,0,0,0,Gb,0,0,0,Hb,0,0,0,vb,0,0,0],"void*",$a)],"void*",N,Ib)}}});jb.push({o:function(){Lb=G}});
kb.push({o:function(){Xb&&(Kb[2]&&0<Kb[2].object.e.buffer.length&&Kb[2].object.e(10),Kb[3]&&0<Kb[3].object.e.buffer.length&&Kb[3].object.e(10))}});Module.FS_createFolder=Sb;Module.FS_createPath=Tb;Module.FS_createDataFile=Vb;
Module.FS_createPreloadedFile=function(c,b,d,e,g,j,k,f){function h(b){return{jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",bmp:"image/bmp",ogg:"audio/ogg",wav:"audio/wav",mp3:"audio/mpeg"}[b.substr(-3)]}function n(d){function h(d){f||Vb(c,b,d,e,g);j&&j();sb("cp "+i)}var l=G;Module.preloadPlugins.forEach(function(b){!l&&b.canHandle(i)&&(b.handle(d,i,h,function(){k&&k();sb("cp "+i)}),l=D)});l||h(d)}if(!jc){jc=D;try{new Blob,kc=D}catch(m){kc=G,console.log("warning: no blob constructor, cannot create blobs with mimetypes")}lc=
"undefined"!=typeof MozBlobBuilder?MozBlobBuilder:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:!kc?console.log("warning: no BlobBuilder"):F;mc="undefined"!=typeof window?window.URL?window.URL:window.webkitURL:console.log("warning: cannot create object URLs");Module.preloadPlugins||(Module.preloadPlugins=[]);Module.preloadPlugins.push({canHandle:function(b){return!Module.N&&/\.(jpg|jpeg|png|bmp)$/.exec(b)},handle:function(b,c,d,e){var f=F;if(kc)try{f=new Blob([b],{type:h(c)})}catch(g){var i=
"Blob constructor present but fails: "+g+"; falling back to blob builder";Ba||(Ba={});Ba[i]||(Ba[i]=1,Module.c(i))}f||(f=new lc,f.append((new Uint8Array(b)).buffer),f=f.getBlob());var j=mc.createObjectURL(f),k=new Image;k.onload=function(){ya(k.complete,"Image "+c+" could not be decoded");var e=document.createElement("canvas");e.width=k.width;e.height=k.height;e.getContext("2d").drawImage(k,0,0);Module.preloadedImages[c]=e;mc.revokeObjectURL(j);d&&d(b)};k.onerror=function(){console.log("Image "+j+
" could not be decoded");e&&e()};k.src=j}});Module.preloadPlugins.push({canHandle:function(b){return!Module.M&&b.substr(-4)in{".ogg":1,".wav":1,".mp3":1}},handle:function(b,c,d,e){function f(e){i||(i=D,Module.preloadedAudios[c]=e,d&&d(b))}function g(){i||(i=D,Module.preloadedAudios[c]=new Audio,e&&e())}var i=G;if(kc){try{var j=new Blob([b],{type:h(c)})}catch(k){return g()}var j=mc.createObjectURL(j),l=new Audio;l.addEventListener("canplaythrough",function(){f(l)},G);l.onerror=function(){if(!i){console.log("warning: browser could not fully decode audio "+
c+", trying slower base64 approach");for(var d="",e=0,g=0,h=0;h<b.length;h++){e=e<<8|b[h];for(g+=8;6<=g;)var j=e>>g-6&63,g=g-6,d=d+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[j]}2==g?(d+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(e&3)<<4],d+="=="):4==g&&(d+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(e&15)<<2],d+="=");l.src="data:audio/x-"+c.substr(-3)+";base64,"+d;f(l)}};l.src=j;setTimeout(function(){f(l)},1E4)}else return g()}})}for(var i,
l=[c,b],q=l[0],v=1;v<l.length;v++)"/"!=q[q.length-1]&&(q+="/"),q+=l[v];"/"==q[0]&&(q=q.substr(1));i=q;rb("cp "+i);if("string"==typeof d){var u=k,s=function(){u?u():ca('Loading data file "'+d+'" failed.')},r=new XMLHttpRequest;r.open("GET",d,D);r.responseType="arraybuffer";r.onload=function(){if(200==r.status){var b=r.response;ya(b,'Loading data file "'+d+'" failed (no arrayBuffer).');b=new Uint8Array(b);n(b);sb("al "+d)}else s()};r.onerror=s;r.send(F);rb("al "+d)}else n(d)};
Module.FS_createLazyFile=function(c,b,d,e,g){if("undefined"!==typeof XMLHttpRequest){oa||ca("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");var j=function(b,c){this.length=c;this.p=b;this.h=[]};j.prototype.J=function(b){this.L=b};var k=new XMLHttpRequest;k.open("HEAD",d,G);k.send(F);200<=k.status&&300>k.status||304===k.status||ca(Error("Couldn't load "+d+". Status: "+k.status));var f=Number(k.getResponseHeader("Content-length")),
h,n=1048576;if(!((h=k.getResponseHeader("Accept-Ranges"))&&"bytes"===h))n=f;var m=new j(n,f);m.J(function(b){var c=b*m.p,e=(b+1)*m.p-1,e=Math.min(e,f-1);if("undefined"===typeof m.h[b]){var g=m.h;c>e&&ca(Error("invalid range ("+c+", "+e+") or no bytes requested!"));e>f-1&&ca(Error("only "+f+" bytes available! programmer error!"));var h=new XMLHttpRequest;h.open("GET",d,G);f!==n&&h.setRequestHeader("Range","bytes="+c+"-"+e);"undefined"!=typeof Uint8Array&&(h.responseType="arraybuffer");h.overrideMimeType&&
h.overrideMimeType("text/plain; charset=x-user-defined");h.send(F);200<=h.status&&300>h.status||304===h.status||ca(Error("Couldn't load "+d+". Status: "+h.status));c=h.response!==a?new Uint8Array(h.response||[]):eb(h.responseText||"",D);g[b]=c}"undefined"===typeof m.h[b]&&ca(Error("doXHR failed!"));return m.h[b]});j={b:G,a:m}}else j={b:G,url:d};return Ub(c,b,j,e,g)};Module.FS_createLink=function(c,b,d,e,g){return Ub(c,b,{b:G,link:d},e,g)};Module.FS_createDevice=Wb;Eb(0);Q(12,"void*",$a);
Module.requestFullScreen=function(){function c(){}function b(){var b=G;if((document.webkitFullScreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.mozFullscreenElement||document.fullScreenElement||document.fullscreenElement)===d)d.I=d.requestPointerLock||d.mozRequestPointerLock||d.webkitRequestPointerLock,d.I(),b=D;if(Module.onFullScreen)Module.onFullScreen(b)}var d=Module.canvas;document.addEventListener("fullscreenchange",b,G);document.addEventListener("mozfullscreenchange",
b,G);document.addEventListener("webkitfullscreenchange",b,G);document.addEventListener("pointerlockchange",c,G);document.addEventListener("mozpointerlockchange",c,G);document.addEventListener("webkitpointerlockchange",c,G);d.H=d.requestFullScreen||d.mozRequestFullScreen||(d.webkitRequestFullScreen?function(){d.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)}:F);d.H()};
Module.requestAnimationFrame=function(c){window.requestAnimationFrame||(window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame||window.setTimeout);window.requestAnimationFrame(c)};Module.pauseMainLoop=function(){};Module.resumeMainLoop=function(){ic&&(ic=G,F())};var Aa=[0,0,nc,0,oc,0,pc,0,qc,0,rc,0,sc,0,tc,0,uc,0,vc,0];
function wc(c,b){var d=0,d=24*b&-1,b=L[c+8>>2];return 0==I[b+(d|1)|0]<<24>>24&&0==I[b+(d|2)|0]<<24>>24?0:d=Ia[d+(b+21)|0]+3|0}
function xc(c,b,d){var e,g,j,k,f,h,n,m,i,l,q,v,u,s,r,p,w,t,y,x,B;e=0;g=H;H=H+108|0;j=g>>2;k=g+36;if(1024>(d-b|0)>>>0){if(b>>>0<d>>>0)f=1E30,n=h=b;else return H=g,b;for(;;)if(i=yc(n,c),l=(b=i<f)?n:h,q=n+1|0,(q|0)==(d|0)){m=l;break}else f=b?i:f,h=l,n=q;H=g;return m}n=d-b|0;if(10>n>>>0)return H=g,b;h=k|0;f=b;q=d;d=1E30;l=b;for(b=n;;){n=Math.floor((b>>>0)/10);i=n+f|0;L[j]=i;b=yc(i,c);i=k|0;Ma[M>>3]=b;L[i>>2]=L[M>>2];L[i+4>>2]=L[M+4>>2];i=(n<<1)+f|0;L[j+1]=i;b=yc(i,c);i=k+8|0;Ma[M>>3]=b;L[i>>2]=L[M>>2];
L[i+4>>2]=L[M+4>>2];i=(3*n&-1)+f|0;L[j+2]=i;b=yc(i,c);i=k+16|0;Ma[M>>3]=b;L[i>>2]=L[M>>2];L[i+4>>2]=L[M+4>>2];i=(n<<2)+f|0;L[j+3]=i;b=yc(i,c);i=k+24|0;Ma[M>>3]=b;L[i>>2]=L[M>>2];L[i+4>>2]=L[M+4>>2];i=(5*n&-1)+f|0;L[j+4]=i;b=yc(i,c);i=k+32|0;Ma[M>>3]=b;L[i>>2]=L[M>>2];L[i+4>>2]=L[M+4>>2];i=(6*n&-1)+f|0;L[j+5]=i;b=yc(i,c);i=k+40|0;Ma[M>>3]=b;L[i>>2]=L[M>>2];L[i+4>>2]=L[M+4>>2];i=(7*n&-1)+f|0;L[j+6]=i;b=yc(i,c);i=k+48|0;Ma[M>>3]=b;L[i>>2]=L[M>>2];L[i+4>>2]=L[M+4>>2];i=(n<<3)+f|0;L[j+7]=i;b=yc(i,c);i=
k+56|0;Ma[M>>3]=b;L[i>>2]=L[M>>2];L[i+4>>2]=L[M+4>>2];i=(9*n&-1)+f|0;L[j+8]=i;n=yc(i,c);i=k+64|0;Ma[M>>3]=n;L[i>>2]=L[M>>2];L[i+4>>2]=L[M+4>>2];i=(L[M>>2]=L[h>>2],L[M+4>>2]=L[h+4>>2],Ma[M>>3]);n=k+8|0;b=(L[M>>2]=L[n>>2],L[M+4>>2]=L[n+4>>2],Ma[M>>3]);v=(n=b<i)?b:i;i=k+16|0;b=(L[M>>2]=L[i>>2],L[M+4>>2]=L[i+4>>2],Ma[M>>3]);u=(i=b<v)?b:v;v=k+24|0;b=(L[M>>2]=L[v>>2],L[M+4>>2]=L[v+4>>2],Ma[M>>3]);s=(v=b<u)?b:u;u=k+32|0;b=(L[M>>2]=L[u>>2],L[M+4>>2]=L[u+4>>2],Ma[M>>3]);r=(u=b<s)?b:s;s=k+40|0;b=(L[M>>2]=L[s>>
2],L[M+4>>2]=L[s+4>>2],Ma[M>>3]);p=(s=b<r)?b:r;r=k+48|0;b=(L[M>>2]=L[r>>2],L[M+4>>2]=L[r+4>>2],Ma[M>>3]);w=(r=b<p)?b:p;p=k+56|0;b=(L[M>>2]=L[p>>2],L[M+4>>2]=L[p+4>>2],Ma[M>>3]);t=(p=b<w)?b:w;w=k+64|0;b=(L[M>>2]=L[w>>2],L[M+4>>2]=L[w+4>>2],Ma[M>>3]);i=(w=b<t)?8:p?7:r?6:s?5:u?4:v?3:i?2:n&1;n=w?b:t;if(n>d){m=l;e=30;break}0==(i|0)?(y=f,e=25):(t=L[(i-1<<2>>2)+j],8==(i|0)?(x=q,B=t):(y=t,e=25));25==e&&(e=0,x=L[(i+1<<2>>2)+j],B=y);t=L[(i<<2>>2)+j];b=x-B|0;if(10>b>>>0){m=t;e=32;break}else f=B,q=x,d=n,l=t}if(30==
e||32==e)return H=g,m}function yc(c,b){var d;d=b+4|0;return zc(L[b>>2],L[d>>2],L[b+12>>2],c,2)+zc(L[b>>2],L[d>>2],c,L[b+16>>2],2)}function Ac(c,b){var d,e,g,j,k;d=c<<1;e=R(d);g=b|0;L[g>>2]=e;e=R(d);d=b+4|0;L[d>>2]=e;e=24*c&-1;j=R(e);k=b+8|0;L[k>>2]=j;a:do if(0!=(c|0)){for(j=0;!(K[L[g>>2]+(j<<1)>>1]=1,b=j+1|0,(b|0)==(c|0));)j=b;if(0!=(c|0))for(j=0;;)if(K[L[d>>2]+(j<<1)>>1]=0,j=j+1|0,(j|0)==(c|0))break a}while(0);if(0!=(e|0)){e=24*c&-1;for(c=0;!(I[L[k>>2]+c|0]=0,j=c+1|0,(j|0)==(e|0));)c=j}}
function Bc(c){X(L[c>>2]);X(L[c+4>>2]);X(L[c+8>>2])}
function Cc(c,b,d,e,g,j,k){var f,h,n,m,i,l,q,v,u,s,r,p,w,t,y,x;f=0;h=H;H=H+28|0;n=h>>2;m=h+4;i=m>>2;l=h+8;if(!(10>e>>>0)){q=R(e);0==(q|0)&&xb();0!=(e|0)&&cc(q,e);L[n]=0;L[i]=e;v=0==(g|0);u=l|0;s=l+4|0;r=l+8|0;p=l+12|0;w=l+16|0;t=l;for(l=1;v|l>>>0<g>>>0;){L[u>>2]=b;L[s>>2]=d;L[r>>2]=e;L[p>>2]=L[n];L[w>>2]=L[i];L[n]>>>0>=L[i]>>>0&&S(5245952,252,5246684,5245936);y=xc(t,L[n]+1|0,L[i]);y>>>0<=L[n]>>>0&&S(5245952,255,5246684,5245188);y>>>0>=L[i]>>>0&&S(5245952,256,5246684,5245036);if(zc(b,d,L[n],y,2)+zc(b,
d,y,L[i],2)>zc(b,d,L[n],L[i],2))f=146;else if((y|0)==(L[n]+1|0)|(y|0)==(L[i]|0))f=146;else{x=y;y=j;var B=k,z=a,A=a,C=a,E=a,z=B>>2,B=y>>2;y=0;A=L[z];0==(A-1&A|0)&&(C=0==(A|0)?R(4):$(L[B],A<<3),L[B]=C);L[L[B]+(L[z]<<2)>>2]=x;C=L[z]+1|0;L[z]=C;if(0!=(C|0)){C=L[z]-1|0;for(z=0;;){if(z>>>0>=C>>>0){y=49;break}if(L[L[B]+(z<<2)>>2]>>>0>x>>>0)break;else z=z+1|0}if(49!=y){a:do if(C>>>0>z>>>0)for(y=C;;)if(A=y-1|0,E=L[B],L[E+(y<<2)>>2]=L[E+(A<<2)>>2],A>>>0>z>>>0)y=A;else break a;while(0);L[L[B]+(z<<2)>>2]=x}}x=
l+1|0}146==f&&(f=0,I[q+L[n]|0]=1,x=l);l=e;y=q;for(var B=L[j>>2],z=L[k>>2],A=h,C=m,J=E=a,O=a,P=a,Y=a,aa=a,P=O=a,E=l-1|0,O=J=l=0;!(P=0==(l|0)?0:L[B+(l-1<<2)>>2],Y=(l|0)==(z|0)?E:L[B+(l<<2)>>2],0==I[y+P|0]<<24>>24?(aa=Y-P|0,aa>>>0<=O>>>0?P=J:(L[A>>2]=P,L[C>>2]=Y,O=aa,P=1)):P=J,aa=l+1|0,aa>>>0>z>>>0);)l=aa,J=P;if(0==(P|0))break;if(10>(L[i]-L[n]|0)>>>0)break;else l=x}if(0!=(L[c>>2]|0)){var c=L[j>>2],g=L[k>>2],Z,T,V,W,k=H;a:do if(0==(g|0)|0==(e|0))T=Z=0;else for(i=f=j=m=0;;){n=0==K[d+(j<<1)>>1]<<16>>16?
1:Ja[b+(j<<1)>>1];if((L[c+(m<<2)>>2]|0)==(j|0))if(0==(m-1&m|0)&&(i=0==(m|0)?R(4):$(i,m<<3)),v=i,L[v+(m<<2)>>2]=f,i=m+1|0,(i|0)==(g|0)){Z=v;T=i;break a}else m=i;else v=i;i=j+1|0;if(i>>>0<e>>>0)j=i,f=n+f|0,i=v;else{Z=v;T=m;break a}}while(0);(T|0)!=(g|0)&&S(5245952,172,5246800,5244604);Zb(5244428,20,1,L[vb>>2]);g=L[vb>>2];if(0==(T|0))Zb(5244212,5,1,g),V=L[vb>>2];else{b=0;for(d=g;!($b(d,5244328,(Oa=H,H=H+4|0,L[Oa>>2]=L[Z+(b<<2)>>2],Oa)),g=b+1|0,W=L[vb>>2],(g|0)==(T|0));)b=g,d=W;Zb(5244212,5,1,W);W=L[vb>>
2];if(0==(T|0))V=W;else for(b=0;;)if($b(W,5244156,(Oa=H,H=H+4|0,L[Oa>>2]=L[Z+(b<<2)>>2],Oa)),W=b+1|0,d=L[vb>>2],(W|0)==(T|0)){V=d;break}else b=W,W=d}Zb(5245932,2,1,V);X(Z);H=k}X(q)}H=h}
function Dc(c,b){var d,e,g;d=c>>2;for(c=0;;)if(L[(c<<2>>2)+d]=8,e=c+1|0,144==(e|0)){g=144;break}else c=e;for(;!(L[(g<<2>>2)+d]=9,c=g+1|0,256==(c|0));)g=c;L[d+256]=7;L[d+257]=7;L[d+258]=7;L[d+259]=7;L[d+260]=7;L[d+261]=7;L[d+262]=7;L[d+263]=7;L[d+264]=7;L[d+265]=7;L[d+266]=7;L[d+267]=7;L[d+268]=7;L[d+269]=7;L[d+270]=7;L[d+271]=7;L[d+272]=7;L[d+273]=7;L[d+274]=7;L[d+275]=7;L[d+276]=7;L[d+277]=7;L[d+278]=7;L[d+279]=7;L[d+280]=8;L[d+281]=8;L[d+282]=8;L[d+283]=8;L[d+284]=8;L[d+285]=8;L[d+286]=8;L[d+287]=
8;for(d=0;!(L[b+(d<<2)>>2]=5,g=d+1|0,32==(g|0));)d=g}function Ec(c){var b,d,e,g;b=c>>2;for(e=d=c=0;!(30<=(d|0));)if(g=(0!=(L[(d<<2>>2)+b]|0)&1)+e|0,1<(g|0)){c=172;break}else d=d+1|0,e=g;172!=c&&(1==(e|0)?L[((0!=(L[b]|0)&1)<<2>>2)+b]=1:0==(e|0)&&(L[b+1]=1,L[b]=1))}
function zc(c,b,d,e,g){var j,k,f,h,n;j=H;H=H+2560|0;k=j+1280;f=j+2432;2<=(g-1|0)>>>0&&S(5245480,324,5246628,5245732);if(1==(g|0))Dc(k|0,f|0),g=3;else{g=j|0;h=j+1152|0;Fc(c,b,d,e,g,h);n=k|0;Gc(g,288,15,n);g=f|0;Gc(h,32,15,g);Ec(g);var m,i;h=H;H=H+12|0;m=h+4;i=h+8;L[h>>2]=0;L[m>>2]=0;I[i]=0;Hc(n,g,i,h,m);X(L[h>>2]);H=h;g=((I[i]&7|L[m>>2]<<3)>>>0)+3}k|=0;h=d;var l;if(h>>>0<e>>>0){i=0;for(d=h;;)if(h=K[b+(d<<1)>>1],m=Ja[c+(d<<1)>>1],0==h<<16>>16?h=L[k+(m<<2)>>2]+i|0:(n=(Ic(m)<<2)+k|0,i=L[n>>2]+i|0,n=h&
65535,h=(Jc(n)<<2)+(f|0)|0,h=((i+L[h>>2]|0)+L[(m<<2)+5248140>>2]|0)+Kc(n)|0),n=d+1|0,(n|0)==(e|0)){l=h;break}else i=h,d=n}else l=0;c=L[(k+1024|0)>>2]+l|0;H=j;return g+(c>>>0)}
function Lc(c,b,d,e,g,j,k,f){var h,n,m,i,l,q,v,u;h=H;H=H+40|0;n=h+16;m=n>>2;i=h+28;l=i>>2;q=g-e|0;Mc(n);v=h|0;L[v>>2]=c;L[h+8>>2]=e;L[h+12>>2]=g;c=R(12);u=(h+4|0)>>2;L[u]=c;Ac(q,c);Nc(h,d,e,g,n);c=(n+8|0)>>2;1E3>L[c]>>>0?(Mc(i),Oc(h,d,e,g,i),d=zc(L[m],L[m+1],0,L[c],2),zc(L[l],L[l+1],0,L[l+2],1)<d?(Pc(n),d=n>>2,e=i>>2,L[d]=L[e],L[d+1]=L[e+1],L[d+2]=L[e+2],d=1):(Pc(i),d=2)):d=2;Qc(L[v>>2],d,b,L[m],L[m+1],0,L[c],q,j,k,f);Bc(L[u]);X(L[u]);Pc(n);H=h}
function Rc(c,b,d,e,g,j){var k,f,h,n;if(0!=(d|0)){f=!0;for(k=0;;){h=(k+2E7|0)>>>0>=d>>>0;n=(h?d-k|0:2E7)+k|0;var m=c;h=h&f&1;var i=b,l=n,q=e,v=g,u=j;if(0==(L[m+8>>2]|0))Lc(m,h,i,k,l,q,v,u);else{if(0==(L[m+12>>2]|0)){var s=a,r=a,p=a,w=a,t=a,y=a,x=a,t=a,s=H;H=H+8|0;r=s;p=r>>2;w=s+4;L[p]=0;L[w>>2]=0;var t=m,y=i,x=l,B=L[m+16>>2],z=w,A=a,C=a,E=a,J=a,O=a,P=a,Y=a,aa=a,Z=a,T=a,V=a,W=a,W=a,A=z>>2,z=H;H=H+36|0;C=z;E=C>>2;J=z+16;O=J>>2;P=z+20;Y=P>>2;aa=z+24;L[O]=0;L[Y]=0;Mc(aa);L[E]=t;L[E+2]=k;L[E+3]=x;L[E+
1]=0;L[A]=0;L[r>>2]=0;Sc(C,y,k,x,aa);x=aa|0;y=aa+4|0;C=(aa+8|0)>>2;Cc(t,L[x>>2],L[y>>2],L[C],B,J,P);a:do if(0!=(L[Y]|0)&&0!=(L[C]|0)){P=L[y>>2];J=L[O];B=L[Y];t=L[C];E=L[x>>2];Z=0;for(T=k;;){V=0==K[P+(Z<<1)>>1]<<16>>16?1:Ja[E+(Z<<1)>>1];W=L[A];if((L[J+(W<<2)>>2]|0)==(Z|0)&&(0==(W-1&W|0)&&(W=0==(W|0)?R(4):$(L[r>>2],W<<3),L[r>>2]=W),L[L[r>>2]+(L[A]<<2)>>2]=T,W=L[A]+1|0,L[A]=W,(W|0)==(B|0)))break a;W=Z+1|0;if(W>>>0<t>>>0)Z=W,T=V+T|0;else break a}}while(0);(L[A]|0)!=(L[Y]|0)&&S(5245952,328,5246708,5244720);
X(L[O]);Pc(aa);H=z;r=L[w>>2];w=0!=(h|0);h=L[p];for(t=0;!(y=0==(t|0)?k:L[h+(t-1<<2)>>2],x=(t|0)==(r|0)?l:L[h+(t<<2)>>2],Lc(m,(t|0)==(r|0)&w&1,i,y,x,q,v,u),t=t+1|0,t>>>0>r>>>0););X(L[p])}else{A=z=C=r=C=r=B=x=y=t=w=p=A=s=z=a;z=0;s=H;H=H+36|0;A=s>>2;p=s+16;w=p>>2;t=s+28;y=s+32;x=y>>2;L[t>>2]=0;L[x]=0;r=G;C=D;211==z&&(S(5245480,612,5246868,5245732),r=a,C=B);Mc(p);L[A]=m;L[A+2]=k;L[A+3]=l;A=R(12);B=(s+4|0)>>2;L[B]=A;Ac(l-k|0,A);C?Nc(s,i,k,l,p):(r||S(5245480,627,5246868,5245360),Oc(s,i,k,l,p));r||Cc(m,L[w],
L[w+1],L[w+2],L[m+16>>2],t,y);y=L[x];r=L[w+2];l=0!=(h|0);h=L[w];k=L[w+1];w=L[x];x=L[t>>2];for(t=0;!(z=0==(t|0)?0:L[x+(t-1<<2)>>2],A=(t|0)==(y|0)?r:L[x+(t<<2)>>2],Qc(m,2,(t|0)==(y|0)&l&1,h,k,z,A,0,q,v,u),i=t+1|0,i>>>0>w>>>0);)t=i;Bc(L[B]);X(L[B]);Pc(p)}H=s}if(n>>>0<d>>>0)k=n;else break}}}
function Qc(c,b,d,e,g,j,k,f,h,n,m){var i,l,q,v,u,s,r,p,w,t;i=0;l=H;H=H+3840|0;q=l+1152;v=l+1280;u=l+2432;s=l+2560;r=l+3712;Tc(d,h,n,m);Tc(b&1,h,n,m);Tc(b>>>1&1,h,n,m);1==(b|0)?Dc(v|0,u|0):(2!=(b|0)&&S(5245480,386,5246948,5245152),i=292);a:do if(292==i){b=l|0;d=q|0;Fc(e,g,j,k,b,d);p=v|0;Gc(b,288,15,p);b=u|0;Gc(d,32,15,b);Ec(b);d=L[m>>2];Hc(p,b,h,n,m);0!=(L[c>>2]|0)&&$b(L[vb>>2],5244852,(Oa=H,H=H+4|0,L[Oa>>2]=L[m>>2]-d|0,Oa));for(b=0;;)if(0!=(L[l+(b<<2)>>2]|0)&&0==(L[v+(b<<2)>>2]|0)&&S(5245480,399,
5246948,5244680),d=b+1|0,288==(d|0)){w=0;break}else b=d;for(;;)if(0!=(L[q+(w<<2)>>2]|0)&&0==(L[u+(w<<2)>>2]|0)&&S(5245480,400,5246948,5244564),d=w+1|0,32==(d|0))break a;else w=d}while(0);w=v|0;q=s|0;Uc(w,288,15,q);b=u|0;u=r|0;Uc(b,32,15,u);r=L[m>>2];i=k;d=h;p=n;var y,x,B,z,A,C,E,J,O;a:do if(j>>>0<i>>>0){y=j;for(x=0;;)if(B=K[g+(y<<1)>>1],z=B&65535,A=K[e+(y<<1)>>1],C=A&65535,0==B<<16>>16?(256<=(A&65535)&&S(5245480,256,5246936,5244264),B=(C<<2)+w|0,0==(L[B>>2]|0)&&S(5245480,257,5246936,5244188),Vc(L[q+
(C<<2)>>2],L[B>>2],d,p,m),x=x+1|0):(B=Ic(C),E=Jc(z),286<=(A-3&65535)&&S(5245480,263,5246936,5244124),A=(B<<2)+w|0,0==(L[A>>2]|0)&&S(5245480,264,5246936,5245912),J=(E<<2)+b|0,0==(L[J>>2]|0)&&S(5245480,265,5246936,5245780),Vc(L[q+(B<<2)>>2],L[A>>2],d,p,m),Wc(L[(C<<2)+5249176>>2],L[(C<<2)+5248140>>2],d,p,m),Vc(L[u+(E<<2)>>2],L[J>>2],d,p,m),B=B=a,5>(z|0)?B=0:(B=ec(z-1|0)^31,B=(1<<B-1)-1&(-1<<B)+(z-1)),Wc(B,Kc(z),d,p,m),x=C+x|0),C=y+1|0,(C|0)==(i|0)){O=x;break a}else y=C}else O=0;while(0);0==(f|0)|(O|
0)==(f|0)||S(5245480,277,5246936,5245672);Vc(L[s+1024>>2],L[v+1024>>2],h,n,m);a:do if(j>>>0<k>>>0){n=0;for(h=j;;)if(f=0==K[g+(h<<1)>>1]<<16>>16?1:Ja[e+(h<<1)>>1],v=f+n|0,s=h+1|0,(s|0)==(k|0)){t=v;break a}else n=v,h=s}else t=0;while(0);k=L[m>>2]-r|0;0!=(L[c>>2]|0)&&$b(L[vb>>2],5244384,(Oa=H,H=H+12|0,L[Oa>>2]=k,L[Oa+4>>2]=k>>>10,L[Oa+8>>2]=t,Oa));H=l}
function Tc(c,b,d,e){var g;g=e>>2;0==(I[b]&7)<<24>>24&&(e=L[g],0==(e-1&e|0)&&(e=0==(e|0)?R(1):$(L[d>>2],e<<1),L[d>>2]=e),I[L[d>>2]+L[g]|0]=0,L[g]=L[g]+1|0);e=L[d>>2]+(L[g]-1)|0;I[e]=(Ia[e]|c<<(I[b]&7))&255;I[b]=I[b]+1&255}
function Hc(c,b,d,e,g){var j,k,f,h,n,m,i,l,q,v,u,s,r,p,w,t,y,x,B,z,A,C,E,J,O,P,Y,aa,Z,T,V,W,ba,ia,ea,ka,ja,fa,da,ta,Ca,xa,ua,Ra,ib;j=0;k=H;f=H=H+76|0;h=H=H+76|0;H=H+76|0;n=29;for(m=316;;){if(0==(n|0)){i=29;l=m;break}if(0==(L[c+(n+256<<2)>>2]|0))n=n-1|0,m=m-1|0;else{i=29;l=m;break}}for(;0!=(i|0);)if(0==(L[b+(i<<2)>>2]|0))i=i-1|0,l=l-1|0;else break;m=n+257|0;q=i+(n+258)|0;v=R(q<<2);u=v>>2;0==(v|0)&&xb();a:do if(0==(q|0))j=429;else{s=-257-n|0;for(r=0;!(p=r>>>0<m>>>0?(r<<2)+c|0:(s+r<<2)+b|0,p=L[p>>2],
L[(r<<2>>2)+u]=p,16<=p>>>0&&S(5245480,134,5246964,5245640),p=r+1|0,(p|0)==(l|0));)r=p;if(0==(q|0))j=429;else{for(B=x=y=t=w=0;;){do if(B>>>0<q>>>0){r=L[(B<<2>>2)+u];s=B;for(p=0;;){if((r|0)!=(L[(s<<2>>2)+u]|0)){z=p;break}A=p+1|0;C=s+1|0;if(C>>>0<q>>>0)s=C,p=A;else{z=A;break}}if(3>=z>>>0){if(2>=z>>>0){j=415;break}if(0!=(L[(B<<2>>2)+u]|0)){j=415;break}}p=((B<<2)+v|0)>>2;do if(0==(L[p]|0))10<z>>>0?(s=138<z>>>0?138:z,E=0==(y-1&y|0)?r=0==(y|0)?R(4):$(w,y<<3):w,L[E+(y<<2)>>2]=18,r=y+1|0,J=0==(x-1&x|0)?A=
0==(x|0)?R(4):$(t,x<<3):t,L[J+(x<<2)>>2]=s-11|0):(E=0==(y-1&y|0)?r=0==(y|0)?R(4):$(w,y<<3):w,L[E+(y<<2)>>2]=17,r=y+1|0,J=0==(x-1&x|0)?A=0==(x|0)?R(4):$(t,x<<3):t,L[J+(x<<2)>>2]=z-3|0,s=z),A=x+1|0,C=J,O=E;else{r=z-1|0;P=0==(y-1&y|0)?A=0==(y|0)?R(4):$(w,y<<3):w;L[P+(y<<2)>>2]=L[p];Y=0==(x-1&x|0)?A=0==(x|0)?R(4):$(t,x<<3):t;L[Y+(x<<2)>>2]=0;s=x+1|0;A=y+1|0;b:do if(5<r>>>0){C=P;aa=Y;Z=y;O=x;T=r;E=s;for(J=A;;)if(0==(J&Z|0)&&(C=0==(J|0)?R(4):$(C,J<<3)),L[C+(J<<2)>>2]=16,O=0==(E&O|0)?0==(E|0)?R(4):$(aa,
E<<3):aa,L[O+(E<<2)>>2]=3,T=T-6|0,V=E+1|0,W=J+1|0,5<T>>>0)aa=O,Z=J,O=E,E=V,J=W;else{ba=C;ia=O;ea=J;ka=E;ja=T;fa=V;da=W;break b}}else ba=P,ia=Y,ea=y,ka=x,ja=r,fa=s,da=A;while(0);2<ja>>>0?(r=0==(da&ea|0)?0==(da|0)?R(4):$(ba,da<<3):ba,L[r+(da<<2)>>2]=16,A=ea+2|0,s=0==(fa&ka|0)?0==(fa|0)?R(4):$(ia,fa<<3):ia,L[s+(fa<<2)>>2]=0,C=ja-3|0,J=ka+2|0,P=A,E=s,T=r):(C=ja,J=fa,P=da,E=ia,T=ba);if(0==(C|0))s=z,A=J,r=P,C=E,O=T;else{A=C+J|0;s=T;r=E;E=P;for(T=C;!(ta=0==(E-1&E|0)?0==(E|0)?R(4):$(s,E<<3):s,L[ta+(E<<2)>>
2]=L[p],O=E+1|0,Ca=0==(J-1&J|0)?0==(J|0)?R(4):$(r,J<<3):r,L[Ca+(J<<2)>>2]=0,Z=T-1|0,0==(Z|0));)s=ta,r=Ca,E=O,J=J+1|0,T=Z;s=z;r=C+P|0;C=Ca;O=ta}}while(0);E=B-1+s|0;J=A;T=r;P=C}else j=415;while(0);415==j&&(j=0,0==(y-1&y|0)&&(w=p=0==(y|0)?R(4):$(w,y<<3)),L[w+(y<<2)>>2]=L[(B<<2>>2)+u],p=y+1|0,0==(x-1&x|0)&&(t=0==(x|0)?R(4):$(t,x<<3)),L[t+(x<<2)>>2]=0,E=B,J=x+1|0,T=p,P=t,O=w);19<=L[O+(T-1<<2)>>2]>>>0&&S(5245480,178,5246964,5245568);p=E+1|0;if(p>>>0<q>>>0)w=O,t=P,y=T,x=J,B=p;else break}p=k>>2;for(x=p+19;p<
x;p++)L[p]=0;if(0==(T|0))xa=0,ua=P,Ra=ua>>2,ib=O;else for(x=0;;)if(p=(L[O+(x<<2)>>2]<<2)+k|0,L[p>>2]=L[p>>2]+1|0,p=x+1|0,(p|0)==(T|0)){xa=T;ua=P;Ra=ua>>2;ib=O;break a}else x=p}}while(0);if(429==j){p=k>>2;for(x=p+19;p<x;p++)L[p]=0;ua=xa=0;Ra=ua>>2;ib=0}p=f|0;Gc(k|0,19,7,p);Uc(p,19,7,h|0);p=15;for(x=19;0!=(p|0);)if(0==(L[k+(L[(p+3<<2)+5250332>>2]<<2)>>2]|0))p=p-1|0,x=x-1|0;else break;Wc(n,5,d,e,g);Wc(i,5,d,e,g);Wc(p,4,d,e,g);a:do if(-4!=(p|0))for(i=0;;)if(Wc(L[f+(L[(i<<2)+5250332>>2]<<2)>>2],3,d,e,
g),n=i+1|0,(n|0)==(x|0))break a;else i=n;while(0);if(0!=(xa|0))for(c=0;!(x=(c<<2)+ib|0,p=L[x>>2],Vc(L[h+(p<<2)>>2],L[f+(p<<2)>>2],d,e,g),p=L[x>>2],16==(p|0)?Wc(L[(c<<2>>2)+Ra],2,d,e,g):17==(p|0)?Wc(L[(c<<2>>2)+Ra],3,d,e,g):18==(p|0)&&Wc(L[(c<<2>>2)+Ra],7,d,e,g),p=c+1|0,(p|0)==(xa|0));)c=p;X(v);X(ib);X(ua);H=k}
function Vc(c,b,d,e,g){var j,k,f,h;j=g>>2;if(0!=(b|0)){g=b-1|0;for(k=0;!(f=c>>>((g-k|0)>>>0)&1,0==(I[d]&7)<<24>>24&&(h=L[j],0==(h-1&h|0)&&(h=0==(h|0)?R(1):$(L[e>>2],h<<1),L[e>>2]=h),I[L[e>>2]+L[j]|0]=0,L[j]=L[j]+1|0),h=L[e>>2]+(L[j]-1)|0,I[h]=(Ia[h]|f<<(I[d]&7))&255,I[d]=I[d]+1&255,f=k+1|0,(f|0)==(b|0));)k=f}}
function Wc(c,b,d,e,g){var j,k,f;j=g>>2;if(0!=(b|0))for(k=0;!(g=c>>>(k>>>0)&1,0==(I[d]&7)<<24>>24&&(f=L[j],0==(f-1&f|0)&&(f=0==(f|0)?R(1):$(L[e>>2],f<<1),L[e>>2]=f),I[L[e>>2]+L[j]|0]=0,L[j]=L[j]+1|0),f=L[e>>2]+(L[j]-1)|0,I[f]=(Ia[f]|g<<(I[d]&7))&255,I[d]=I[d]+1&255,g=k+1|0,(g|0)==(b|0));)k=g}function tc(c,b){return L[c>>2]-L[b>>2]|0}function Xc(c,b){var d;d=c+12|0;L[d>>2]=L[d>>2]<<5&32736^b&255}
function Yc(c,b,d){var e,g,j,k,f,h,n;e=(d+4|0)>>2;g=(d+8|0)>>2;j=(d|0)>>2;d=0==(c|0);k=b<<1;for(f=b<<1;;){if(L[e]>>>0>=((L[g]<<4)+L[j]|0)>>>0){a:do if(0<(L[g]|0))for(b=0;;)if(I[(b<<4)+L[j]+12|0]=0,h=b+1|0,(h|0)<(L[g]|0))b=h;else break a;while(0);a:do if(!(d|1>(k|0)))for(b=0;;){h=L[c+(((b|0)/2&-1)<<3)+((b|0)%2<<2)>>2];b:do if(0!=(h|0))for(n=h;;)if(I[n+12|0]=1,n=L[n+4>>2],0==(n|0))break b;while(0);h=b+1|0;if((h|0)==(f|0))break a;else b=h}while(0);L[e]=L[j]}h=L[e];b=0==I[h+12|0]<<24>>24;L[e]=h+16|0;
if(b)break}return h}function Zc(c,b,d,e){L[e>>2]=c;L[e+8>>2]=b;L[e+4>>2]=d;I[e+12|0]=1}function Mc(c){L[c+8>>2]=0;L[c>>2]=0;L[c+4>>2]=0}
function $c(c){var b,d,e,g,j,k;L[c+12>>2]=0;b=R(262144);d=c|0;L[d>>2]=b;b=65536;e=R(b);g=c+4|0;L[g>>2]=e;e=131072;j=R(e);k=c+8|0;L[k>>2]=j;for(j=0;!(L[L[d>>2]+(j<<2)>>2]=-1,j=j+1|0,65536==(j|0)););a:do for(j=0;;)if(K[L[g>>2]+(j<<1)>>1]=j&65535,L[L[k>>2]+(j<<2)>>2]=-1,d=j+1|0,32768==(d|0))break a;else j=d;while(0);k=R(b);g=c+32|0;L[g>>2]=k;a:do for(k=0;;)if(K[L[g>>2]+(k<<1)>>1]=0,j=k+1|0,32768==(j|0))break a;else k=j;while(0);L[c+28>>2]=0;g=R(262144);k=c+16|0;L[k>>2]=g;g=R(b);b=c+20|0;L[b>>2]=g;g=
R(e);e=c+24|0;L[e>>2]=g;for(g=0;!(L[L[k>>2]+(g<<2)>>2]=-1,c=g+1|0,65536==(c|0));)g=c;for(c=0;!(K[L[b>>2]+(c<<1)>>1]=c&65535,L[L[e>>2]+(c<<2)>>2]=-1,g=c+1|0,32768==(g|0));)c=g}function ad(c){c>>=2;X(L[c]);X(L[c+1]);X(L[c+2]);X(L[c+4]);X(L[c+5]);X(L[c+6]);X(L[c+8])}
function bd(c,b,d,e){var g,j,k,f,h,n,m,i;g=0;j=b&32767;k=(b+3|0)>>>0>d>>>0?0:I[b+(c+2)|0];Xc(e,k);k=(e+12|0)>>2;f=j&65535;h=e+8|0;L[L[h>>2]+(f<<2)>>2]=L[k];n=L[k];m=e|0;i=L[L[m>>2]+(n<<2)>>2];-1==(i|0)?g=639:(L[L[h>>2]+(i<<2)>>2]|0)!=(n|0)?g=639:K[L[e+4>>2]+(f<<1)>>1]=i&65535;639==g&&(K[L[e+4>>2]+(f<<1)>>1]=j);L[L[m>>2]+(L[k]<<2)>>2]=f;m=(e+32|0)>>2;g=K[L[m]+((b+32767&32767)<<1)>>1];h=1<(g&65535)?(g&65535)-1|0:0;g=b+1|0;i=c+b|0;for(b=h;;){h=g+b|0;if(h>>>0>=d>>>0)break;if(I[i]<<24>>24==I[c+h|0]<<24>>
24&65535>b>>>0)b=b+1|0;else break}K[L[m]+(f<<1)>>1]=b&65535;b=Ja[L[m]+(f<<1)>>1]+253&255^L[k];k=(e+28|0)>>2;L[k]=b;m=e+24|0;L[L[m>>2]+(f<<2)>>2]=b;b=L[k];c=(e+16|0)>>2;i=L[L[c]+(b<<2)>>2];K[L[e+20>>2]+(f<<1)>>1]=-1!=(i|0)&&(L[L[m>>2]+(i<<2)>>2]|0)==(b|0)?i&65535:j;L[((L[k]<<2)+L[c]|0)>>2]=f}function cd(c,b,d){Xc(d,I[c+b|0]);Xc(d,I[b+(c+1)|0])}
function dd(c,b,d,e,g,j,k){var f,h,n,m,i,l,q,v,u,s,r;f=0;h=(j<<3)+c+4|0;n=L[L[h>>2]+8>>2];m=0==(j|0);i=(n|0)<(e|0);if(i|m^1){l=k;q=h;v=n;n=m;for(k=i;;){u=Yc(c,b,g);s=L[q>>2];L[c+(j<<3)>>2]=s;L[q>>2]=u;if(n){f=681;break}i=j-1|0;m=(i<<3)+c+4|0;n=L[L[m>>2]>>2]+L[L[c+(i<<3)>>2]>>2]|0;if(k&&(r=L[d+(v<<4)>>2],n>>>0>r>>>0)){f=684;break}Zc(n,v,L[m>>2],u);if(0!=l<<24>>24){f=690;break}dd(c,b,d,e,g,i,0);m=(i<<3)+c+4|0;n=L[L[m>>2]+8>>2];h=0==(i|0);k=(n|0)<(e|0);if(k|h^1)j=i,l=0,q=m,v=n,n=h;else{f=691;break}}681==
f?Zc(L[d+(v<<4)>>2],v+1|0,0,u):684==f&&Zc(r,v+1|0,L[s+4>>2],u)}}function Pc(c){X(L[c>>2]);X(L[c+4>>2])}function ed(c,b,d){var e,g,j,k,f;e=d>>2;g=(d+8|0)>>2;d=L[g];(j=0!=(d-1&d|0))?(K[L[e]+(d<<1)>>1]=c,L[g]=L[g]+1|0):(f=(k=0==(d|0))?R(2):$(L[e],d<<2),L[e]=f,K[f+(L[g]<<1)>>1]=c,L[g]=L[g]+1|0,j||(c=k?R(2):$(L[e+1],d<<2),L[e+1]=c));K[L[e+1]+(d<<1)>>1]=b}
function fd(c,b,d,e,g){var j;j=0;g&=65535;(g+d|0)>>>0>b>>>0&&S(5244924,87,5246480,5245612);b=d-(e&65535)|0;for(e=0;;){if(e>>>0>=g>>>0){j=713;break}if(I[c+b+e|0]<<24>>24==I[c+e+d|0]<<24>>24)e=e+1|0;else break}713!=j&&S(5244924,90,5246480,5245112)}
function gd(c,b,d,e,g,j,k,f,h){var n,m,i,l,q,v,u,s,r,p,w,t,y,x,B,z,A,C,E,J,O,P,Y,aa,Z,T,V,W,ba,ia,ea;n=H;H=H+4|0;m=n;i=m>>2;L[i]=j;j=e&32767;l=L[b>>2];q=L[b+4>>2];v=L[b+8>>2];u=L[b+12>>2];if(0!=(hd(c,e,m,k,f,h)|0))(Ja[h>>1]+e|0)>>>0<=g>>>0||S(5244924,243,5246564,5244828);else if(m=L[i],259>m>>>0?s=m:(S(5244924,248,5246564,5244652),s=L[i]),2>=s>>>0&&S(5244924,249,5246564,5244536),(s=e>>>0<g>>>0)||S(5244924,250,5246564,5244372),m=g-e|0,3>m>>>0)K[h>>1]=0,K[f>>1]=0;else{(L[i]+e|0)>>>0>g>>>0&&(L[i]=m);
m=d+e|0;r=L[i]+e|0;p=d+r|0;w=d+(r-8)|0;65536<=(u|0)&&S(5244924,266,5246564,5244248);r=L[l+(u<<2)>>2];t=r&65535;y=K[q+(t<<1)>>1];(t|0)!=(j|0)&&S(5244924,271,5246564,5244176);x=y&65535;B=b+16|0;z=b+32|0;A=b+28|0;C=b+24|0;E=b+20|0;J=b+32|0;b=m;O=0==(k|0);P=y;y=r&65535;r=u;u=v;v=q;q=l;l=(x>>>0<t>>>0?t:t+32768|0)-x|0;x=8192;t=0;Y=1;a:for(;;){if(32768<=l>>>0){aa=t;Z=Y;break}T=P&65535;-1>=P<<16>>16&&S(5244924,279,5246564,5243984);P<<16>>16!=K[v+((y&65535)<<1)>>1]<<16>>16&&S(5244924,280,5246564,5245896);
(L[u+(T<<2)>>2]|0)!=(r|0)&&S(5244924,281,5246564,5245760);do if(0==(l|0))V=t,W=Y;else if(s||S(5244924,284,5246564,5244372),l>>>0>e>>>0&&S(5244924,285,5246564,5245660),y=e-l|0,ba=d+y|0,ia=Y&65535,V=ia+e|0,V>>>0<g>>>0&&I[d+V|0]<<24>>24!=I[d+y+ia|0]<<24>>24)V=t,W=Y;else{ia=L[J>>2];V=K[ia+(j<<1)>>1];2<(V&65535)?I[m]<<24>>24!=I[ba]<<24>>24?ea=m:(ba=K[ia+((y&32767)<<1)>>1],ea=(V&65535)<(ba&65535)?V:ba,ba=L[i],ea=((ea&65535)>>>0>ba>>>0?ba&65535:ea)&65535,ba=d+ea+y|0,ea=d+ea+e|0):ea=m;var ka=ia=a,ja=a,fa=
y=V=a,da=a,ja=ka=W=a;ia=0;c:do if(ea>>>0<w>>>0){ka=ba;for(ja=ea;;){if(I[ja]<<24>>24!=I[ka]<<24>>24){V=ja;y=ka;break c}fa=ja+1|0;da=ka+1|0;if(I[fa]<<24>>24!=I[da]<<24>>24){V=fa;y=da;break c}da=ja+2|0;fa=ka+2|0;if(I[da]<<24>>24!=I[fa]<<24>>24){V=da;y=fa;break c}fa=ja+3|0;da=ka+3|0;if(I[fa]<<24>>24!=I[da]<<24>>24){V=fa;y=da;break c}da=ja+4|0;fa=ka+4|0;if(I[da]<<24>>24!=I[fa]<<24>>24){V=da;y=fa;break c}fa=ja+5|0;da=ka+5|0;if(I[fa]<<24>>24!=I[da]<<24>>24){V=fa;y=da;break c}da=ja+6|0;fa=ka+6|0;if(I[da]<<
24>>24!=I[fa]<<24>>24){V=da;y=fa;break c}fa=ja+7|0;da=ka+7|0;if(I[fa]<<24>>24!=I[da]<<24>>24){V=fa;y=da;break c}da=ja+8|0;fa=ka+8|0;if(da>>>0<w>>>0)ka=fa,ja=da;else{V=da;y=fa;break c}}}else V=ea,y=ba;while(0);if((V|0)==(p|0))ba=W=V;else{ka=y;for(ja=V;;){if(I[ja]<<24>>24!=I[ka]<<24>>24){W=ja;ia=737;break}V=ja+1|0;if((V|0)==(p|0)){W=V;ia=738;break}else ka=ka+1|0,ja=V}ba=737==ia||738==ia?W:a}ba=ba-b|0;y=ba&65535;V=ba&65535;if((y&65535)<=(Y&65535))V=t,W=Y;else{b:do if(!O&&(ba=Y+1&65535,!((ba&65535)>(y&
65535)))){ia=l&65535;for(ea=ba;;)if(K[k+((ea&65535)<<1)>>1]=ia,ba=ea+1&65535,(ba&65535)>(y&65535))break b;else ea=ba}while(0);ea=l&65535;if(V>>>0<L[i]>>>0)V=ea,W=y;else{aa=ea;Z=y;break a}}}while(0);ea=L[B>>2];(q|0)!=(ea|0)&&!((W&65535)<Ja[L[z>>2]+(j<<1)>>1])&&(ia=L[A>>2],ba=L[C>>2],(ia|0)==(L[ba+(T<<2)>>2]|0)&&(r=ia,u=ba,v=L[E>>2],q=ea));ea=K[v+(T<<1)>>1];if(ea<<16>>16==P<<16>>16){aa=V;Z=W;break}ba=((ea&65535)<(P&65535)?T:T+32768|0)-(ea&65535)+l|0;ia=x-1|0;if(1>(ia|0)){aa=V;Z=W;break}else y=P,P=ea,
l=ba,x=ia,t=V,Y=W}b=c;j=aa;m=Z;l=0;c=e-L[b+8>>2]|0;d=(b+4|0)>>2;b=L[d];s=0==(b|0)?0:0==K[L[b>>2]+(c<<1)>>1]<<16>>16?1:0!=K[L[b+4>>2]+(c<<1)>>1]<<16>>16;b=L[d];if(!(258!=(L[i]|0)|0==(b|0)|0==(k|0)|s)){1==K[L[b>>2]+(c<<1)>>1]<<16>>16?0!=K[L[b+4>>2]+(c<<1)>>1]<<16>>16&&(l=833):l=833;833==l&&S(5244924,210,5246772,5245400);l=m&65535;b=3>(m&65535);K[L[L[d]+4>>2]+(c<<1)>>1]=b?0:j;K[L[L[d]>>2]+(c<<1)>>1]=b?0:m;m=L[d];1==K[L[m>>2]+(c<<1)>>1]<<16>>16&&0==K[L[m+4>>2]+(c<<1)>>1]<<16>>16&&S(5244924,213,5246772,
5245300);var b=l,d=L[d],ta,Ca,xa,ua,j=0;m=24*c&-1;l=L[d+8>>2];if(!(3>b>>>0)){s=m|1;p=m|2;z=w=0;for(x=3;;){(x|0)==(b|0)?j=117:K[k+(x<<1)>>1]<<16>>16==K[k+(x+1<<1)>>1]<<16>>16?(ta=z,Ca=w):j=117;if(117==j)if(j=0,z=3*w&-1,I[l+z+m|0]=x+253&255,B=(x<<1)+k|0,I[l+s+z|0]=K[B>>1]&255,I[l+p+z|0]=Ja[B>>1]>>>8&255,B=w+1|0,7<B>>>0){xa=x;j=123;break}else ta=x,Ca=B;B=x+1|0;if(B>>>0>b>>>0){j=119;break}else w=Ca,z=ta,x=B}119==j&&(8<=Ca>>>0?(xa=ta,j=123):((ta|0)!=(b|0)&&S(5245824,73,5246500,5245800),I[m+(l+21)|0]=ta+
253&255,ua=ta));123==j&&(xa>>>0<=b>>>0||S(5245824,76,5246500,5245164),ua=xa);(ua|0)!=(wc(d,c)|0)&&S(5245824,78,5246500,5244868)}}k=Z&65535;k>>>0>L[i]>>>0&&S(5244924,349,5246564,5245592);K[f>>1]=aa;K[h>>1]=Z;(k+e|0)>>>0<=g>>>0||S(5244924,353,5246564,5244828)}H=n}
function hd(c,b,d,e,g,j){var k,f,h;k=j>>1;j=b-L[c+8>>2]|0;b=(c+4|0)>>2;c=L[b];if(0==(c|0)||0!=K[L[c>>2]+(j<<1)>>1]<<16>>16&&0==K[L[c+4>>2]+(j<<1)>>1]<<16>>16)return 0;c=L[d>>2];if(258==(c|0))f=0;else if(h=L[b],Ja[L[h>>2]+(j<<1)>>1]>>>0<=c>>>0)f=0;else{if(0==(e|0))return 0;f=wc(h,j)>>>0<c>>>0}c=L[b];if(0==(c|0)|f)return 0;if(f=0!=(e|0))if(h=Ja[L[c>>2]+(j<<1)>>1],!(h>>>0<=wc(c,j)>>>0))return L[d>>2]=h,0;c=K[L[L[b]>>2]+(j<<1)>>1];K[k]=c;h=L[d>>2];(c&65535)>>>0>h>>>0&&(K[k]=h&65535);h=L[b];if(!f)return K[g>>
1]=K[L[h+4>>2]+(j<<1)>>1],1;c=h;f=j;h=Ja[k];var n,m,i,l,q,v,u,s,r,p;n=wc(c,f);if(!(3>h>>>0)){h=24*f&-1;f=L[c+8>>2];c=h|1;m=h|2;for(l=i=0;;){q=3*l&-1;v=I[f+q+h|0];u=v&255;s=u+3|0;r=Ia[f+m+q|0]<<8|Ia[f+c+q|0];a:do if(i>>>0<=s>>>0){q=(v&255)+4|0;for(p=i;;)if(K[e+(p<<1)>>1]=r,p=p+1|0,(p|0)==(q|0))break a}while(0);if((s|0)==(n|0))break;r=l+1|0;if(8>r>>>0)i=u+4|0,l=r;else break}}K[g>>1]=K[e+(Ja[k]<<1)>>1];if(258!=(L[d>>2]|0))return 1;d=K[k];if(2>=(d&65535)||K[e+((d&65535)<<1)>>1]<<16>>16==K[L[L[b]+4>>2]+
(j<<1)>>1]<<16>>16)return 1;S(5244924,177,5246728,5245260);return 1}
function Sc(c,b,d,e,g){var j,k,f,h,n,m,i,l,q,v,u,s,r,p,w,t,y,x,B,z;j=0;k=H;H=H+564|0;f=k>>1;h=k+4;n=h>>1;m=k+8;i=k+528;l=32768<d>>>0?d-32768|0:0;if((d|0)!=(e|0)){$c(i);cd(b,l,i);a:do if(l>>>0<d>>>0)for(q=l;;)if(bd(b,q,e,i),v=q+1|0,(v|0)==(d|0))break a;else q=v;while(0);a:do if(d>>>0<e>>>0){l=m|0;v=q=0;u=d;for(s=0;;){bd(b,u,e,i);gd(c,i,b,u,e,258,l,h,k);r=K[f];p=r&65535;w=Ja[n];t=((1024<(w|0))<<31>>31)+p|0;if(0==(s|0))2>=(t|0)?j=859:258>(r&65535)?(y=1,x=u,B=w,z=p):j=858;else if((t|0)>((((1024<(v|0))<<
31>>31)+q|0)+1|0))ed(Ia[b+(u-1)|0],0,g),255>(t-3|0)>>>0?(y=1,x=u,B=Ja[n],z=Ja[f]):j=2<(t|0)?858:859;else{x=q&65535;K[f]=x;y=v&65535;K[n]=y;fd(b,e,u-1|0,y,x);ed(K[f],K[n],g);if(2>=Ja[f])y=0,x=u;else{x=K[f];y=x&65535;B=x&65535;x=3<B>>>0?B:3;B=2;for(z=u;!(z>>>0>=e>>>0&&S(5244924,415,5246544,5245532),z=z+1|0,bd(b,z,e,i),B=B+1|0,!(B>>>0<y>>>0)););y=0;x=u-2+x|0}B=v;z=q}858==j?(fd(b,e,u,K[n],K[f]),ed(K[f],K[n],g),j=860):859==j&&(K[f]=1,ed(Ia[b+u|0],0,g),j=860);do if(860==j){j=0;if(1>=Ja[f])y=0,x=u;else{t=
K[f];p=t&65535;w=t&65535;t=2<w>>>0?w:2;w=1;for(r=u;;)if(r>>>0>=e>>>0&&S(5244924,440,5246544,5245532),z=r+1|0,bd(b,z,e,i),B=w+1|0,B>>>0<p>>>0)w=B,r=z;else break;y=0;x=u-1+t|0}B=v;z=q}while(0);r=x+1|0;if(r>>>0<e>>>0)q=z,v=B,u=r,s=y;else break a}}while(0);ad(i)}H=k}
function Fc(c,b,d,e,g,j){var k,f,h;k=g>>2;for(f=k+288;k<f;k++)L[k]=0;k=j>>2;for(f=k+32;k<f;k++)L[k]=0;if(d>>>0<e>>>0)for(h=d;!(d=(h<<1)+b|0,k=Ja[c+(h<<1)>>1],0==K[d>>1]<<16>>16?f=(k<<2)+g|0:(f=(Ic(k)<<2)+g|0,L[f>>2]=L[f>>2]+1|0,f=(Jc(Ja[d>>1])<<2)+j|0),L[f>>2]=L[f>>2]+1|0,f=h+1|0,(f|0)==(e|0));)h=f;L[(g+1024|0)>>2]=1}function id(c){var b,d;b=(c+4|0)>>2;d=L[b];L[b]=(36969*(d&65535)&-1)+(d>>>16)|0;d=c|0;c=L[d>>2];c=(18E3*(c&65535)&-1)+(c>>>16)|0;L[d>>2]=c;return(L[b]<<16)+c|0}
function jd(c,b){var d,e,g,j;d=c+8|0;if(0!=(L[d>>2]|0)){e=c+4|0;g=c|0;for(c=0;;)if(j=Ja[L[g>>2]+(c<<1)>>1],0==K[L[e>>2]+(c<<1)>>1]<<16>>16?j=(j<<2)+b|0:(j=(Ic(j)<<2)+b|0,L[j>>2]=L[j>>2]+1|0,j=(Jc(Ja[L[e>>2]+(c<<1)>>1])<<2)+b+1152|0),L[j>>2]=L[j>>2]+1|0,j=c+1|0,j>>>0<L[d>>2]>>>0)c=j;else break}L[(b+1024|0)>>2]=1;kd(b)}
function ld(c,b,d,e,g,j,k,f,h,n){var m;var i=e,l,q,v,u,s,r,p,w,t,y,x,B,z,A,C,E,J,O,P,Y,aa,Z,T;m=H;H=H+564|0;l=m+4;q=m+8;v=m+528;u=i-d|0;s=32768<d>>>0?d-32768|0:0;A=3;C=0;for(r=1E30;;)if(x=Aa[f](A,1,h),p=(B=x<r)?A:C,A=A+1|0,259==(A|0)){t=w=0;z=1E30;break}else C=p,r=B?x:r;for(;!(r=(t<<2)+5250212|0,C=Aa[f](3,L[r>>2],h),C<z?(x=C,y=L[r>>2]):(x=z,y=w),r=t+1|0,30==(r|0));)w=y,t=r,z=x;r=Aa[f](p,y,h);if((d|0)==(i|0))f=0;else{p=u+1|0;t=w=R(p<<2);y=t>>2;0==(w|0)&&xb();$c(v);cd(b,s,v);b:do if(s>>>0<d>>>0)for(x=
s;;)if(bd(b,x,i,v),B=x+1|0,(B|0)==(d|0))break b;else x=B;while(0);b:do if(1<p>>>0){s=i+1-d|0;for(x=1;;)if(La[(x<<2>>2)+y]=1.0000000150474662E30,B=x+1|0,(B|0)==(s|0))break b;else x=B}while(0);La[y]=0;K[k>>1]=0;b:do if(d>>>0<i>>>0){p=v+32|0;x=d+259|0;s=q|0;B=258-d|0;for(z=d;;){A=z-d|0;bd(b,z,i,v);C=L[p>>2];if(516<Ja[C+((z&32767)<<1)>>1])if(z>>>0>x>>>0&(z+517|0)>>>0<i>>>0)if(258>=Ja[C+((z+32510&32767)<<1)>>1])E=z,J=A;else{O=Aa[f](258,1,h);J=B+z|0;P=A;Y=0;for(aa=z;!(Z=P+258|0,La[(Z<<2>>2)+y]=O+La[(P<<
2>>2)+y],K[k+(Z<<1)>>1]=258,Z=aa+1|0,bd(b,Z,i,v),T=Y+1|0,258==(T|0));)P=P+1|0,Y=T,aa=Z;E=z+258|0}else E=z,J=A;else E=z,J=A;gd(c,v,b,E,i,258,s,l,m);A=E+1|0;A>>>0<=i>>>0&&(C=La[(J<<2>>2)+y]+Aa[f](Ia[b+E|0],0,h),0>C&&S(5244484,274,5246840,5244160),aa=J+1|0,Y=(aa<<2)+t|0,C>=La[Y>>2]||(La[Y>>2]=C,K[k+(aa<<1)>>1]=1));c:do if(3<=Ja[m>>1]){aa=(J<<2)+t|0;C=Ja[m>>1];for(Y=3;;){if((Y+E|0)>>>0>i>>>0)break c;P=Y+J|0;O=((P<<2)+t|0)>>2;Z=La[aa>>2];La[O]-Z>r&&(T=Z+Aa[f](Y,Ja[q+(Y<<1)>>1],h),0>T&&S(5244484,289,5246840,
5244160),T>=La[O]||(259<=Y>>>0&&S(5244484,291,5246840,5243932),La[O]=T,K[k+(P<<1)>>1]=Y&65535));P=Y+1|0;if(P>>>0>C>>>0)break c;else Y=P}}while(0);if(A>>>0<i>>>0)z=A;else break b}}while(0);i=(u<<2)+t|0;0>La[i>>2]&&S(5244484,298,5246840,5245872);t=La[i>>2];ad(v);X(w);f=t}H=m;m=f;X(L[g>>2]);L[g>>2]=0;L[j>>2]=0;q=e-d|0;h=j>>2;f=g>>2;if(0!=(q|0)){for(i=q;!(q=L[h],0==(q-1&q|0)&&(l=0==(q|0)?R(2):$(L[f],q<<2),L[f]=l),q=((i<<1)+k|0)>>1,K[L[f]+(L[h]<<1)>>1]=K[q],L[h]=L[h]+1|0,l=K[q],(l&65535)>>>0>i>>>0&&(S(5244484,
319,5246756,5244452),l=K[q]),259<=(l&65535)&&S(5244484,320,5246756,5244332),0==K[q]<<16>>16&&S(5244484,321,5246756,5244220),l=Ja[q],(i|0)==(l|0));)i=i-l|0;i=L[h];if(1<i>>>0){v=q=0;for(u=i;;)if(i=L[f],l=(q<<1)+i|0,k=K[l>>1],K[l>>1]=K[i+(v-1+u<<1)>>1],K[L[f]+(v-1+L[h]<<1)>>1]=k,k=q+1|0,i=q^-1,l=L[h],k>>>0<l>>>1>>>0)q=k,v=i,u=l;else break}}g=L[g>>2];j=L[j>>2];k=H;H=H+44|0;f=k+36;h=k+40;i=32768<d>>>0?d-32768|0:0;if((d|0)!=(e|0)){$c(k);cd(b,i,k);a:do if(i>>>0<d>>>0)for(l=i;;)if(bd(b,l,e,k),q=l+1|0,(q|
0)==(d|0))break a;else l=q;while(0);a:do if(0!=(j|0)){i=d;for(l=0;;){q=K[g+(l<<1)>>1];i>>>0>=e>>>0&&S(5244484,360,5246856,5245100);bd(b,i,e,k);(s=2<(q&65535))?(v=q&65535,gd(c,k,b,i,e,v,0,h,f),u=K[f>>1],u<<16>>16!=q<<16>>16&s&2<(u&65535)&&S(5244484,370,5246856,5244768),fd(b,e,i,K[h>>1],q),ed(q,K[h>>1],n),s=v):(ed(Ia[b+i|0],0,n),s=1);v=s+i|0;v>>>0>e>>>0&&S(5244484,381,5246856,5244628);b:do if(1<s>>>0)for(q=1;;)if(bd(b,q+i|0,e,k),u=q+1|0,(u|0)==(s|0))break b;else q=u;while(0);q=l+1|0;if((q|0)==(j|0))break a;
else i=v,l=q}}while(0);ad(k)}H=k;1E30>m||S(5244484,443,5246824,5245372)}function pc(c,b,d){var e,g,j;0==(b|0)?(e=(c<<3)+d+1280|0,c=(L[M>>2]=L[e>>2],L[M+4>>2]=L[e+4>>2],Ma[M>>3])):(e=Ic(c),g=L[(c<<2)+5248140>>2],c=Jc(b),j=Kc(b),b=(e<<3)+d+1280|0,e=(c<<3)+d+3584|0,c=(g|0)+(L[M>>2]=L[b>>2],L[M+4>>2]=L[b+4>>2],Ma[M>>3])+(j|0)+(L[M>>2]=L[e>>2],L[M+4>>2]=L[e+4>>2],Ma[M>>3]));return c}function md(c,b){bc(b,c,1152);bc(b+1152|0,c+1152|0,128);bc(b+1280|0,c+1280|0,2304);bc(b+3584|0,c+3584|0,256)}
function kd(c){nd(c|0,288,c+1280|0);nd(c+1152|0,32,c+3584|0)}function vc(c,b,d){0==(b|0)?d=144>c>>>0?8:9:(b=Kc(b),d=(L[(c<<2)+5248140>>2]|0)+(b|0)+(280>(Ic(c)|0)?12:13));return d}function od(c,b,d){var e,g;if(0<(d|0))for(e=0;!(0==((id(c)>>>4>>>0)%3|0)&&(g=((id(c)>>>0)%(d>>>0)<<2)+b|0,L[b+(e<<2)>>2]=L[g>>2]),g=e+1|0,(g|0)==(d|0));)e=g}
function Nc(c,b,d,e,g){var j,k,f,h,n,m,i,l,q,v,u,s,r,p,w,t,y,x;j=H;H=H+11548|0;k=j>>2;f=j+4;h=j+8;n=j+20;m=j+3860;i=j+7700;l=j+11540;q=R((e-d<<1)+2|0);L[k]=0;L[f>>2]=0;0==(q|0)&&xb();L[l>>2]=1;L[l+4>>2]=2;cc(n,3840);Mc(h);Sc(c,b,d,e,h);jd(h,n);v=c|0;if(!(0>=(L[L[v>>2]+4>>2]|0))){u=h|0;s=h+4|0;r=h+8|0;p=0;w=1E30;t=0;for(y=-1;;){Pc(h);Mc(h);ld(c,b,d,e,j,f,q,6,n,h);x=zc(L[u>>2],L[s>>2],0,L[r>>2],2);if(x<w){w=h;var B=g,z=a,A=a,C=a,E=a,J=a;Pc(B);z=(w+8|0)>>2;A=R(L[z]<<1);C=(B|0)>>2;L[C]=A;A=R(L[z]<<1);
E=B+4|0;L[E>>2]=A;0==(L[C]|0)|0==(A|0)&&xb();L[B+8>>2]=L[z];if(0!=(L[z]|0)){B=w|0;A=w+4|0;for(w=0;;)if(K[L[C]+(w<<1)>>1]=K[L[B>>2]+(w<<1)>>1],K[L[E>>2]+(w<<1)>>1]=K[L[A>>2]+(w<<1)>>1],J=w+1|0,J>>>0<L[z]>>>0)w=J;else break}md(n,m);w=x}md(n,i);B=n;A=z=z=a;z=B;z>>=2;for(A=z+288;z<A;z++)L[z]=0;z=B+1152|0;z>>=2;for(A=z+32;z<A;z++)L[z]=0;jd(h,n);if(-1!=(y|0)){B=n;z=i;A=n;E=J=J=C=a;for(C=0;;)if(J=(L[B+(C<<2)>>2]>>>0)+0.5*(L[z+(C<<2)>>2]>>>0),J=0<=J?Math.floor(J):Math.ceil(J),L[A+(C<<2)>>2]=J,J=C+1|0,288==
(J|0)){E=0;break}else C=J;for(;!(C=(L[B+(E<<2)+1152>>2]>>>0)+0.5*(L[z+(E<<2)+1152>>2]>>>0),J=0<=C?Math.floor(C):Math.ceil(C),L[A+(E<<2)+1152>>2]=J,J=E+1|0,32==(J|0));)E=J;L[A+1024>>2]=1;kd(n)}5<(p|0)&x==t&&(md(m,n),t=l,y=n,od(t,y|0,288),od(t,y+1152|0,32),L[y+1024>>2]=1,kd(n),y=p);p=p+1|0;if((p|0)<(L[L[v>>2]+4>>2]|0))t=x;else break}}X(q);X(L[k]);Pc(h);H=j}
function Oc(c,b,d,e,g){var j,k,f;j=H;H=H+8|0;k=j+4;f=R((e-d<<1)+2|0);L[j>>2]=0;L[k>>2]=0;0==(f|0)?xb():(L[c+8>>2]=d,L[c+12>>2]=e,ld(c,b,d,e,j,k,f,18,0,g),X(f),X(L[j>>2]),H=j)}function Ic(c){return L[(c<<2)+5247104>>2]}
function Uc(c,b,d,e){var g,j,k,f,h,n,m,i;g=(d<<2)+4|0;k=j=R(g);f=k>>2;g=h=R(g);0!=(b|0)&&cc(e,b<<2);for(n=0;!(L[(n<<2>>2)+f]=0,m=n+1|0,m>>>0>d>>>0);)n=m;a:do if(0!=(b|0))for(n=0;;)if(m=(n<<2)+c|0,L[m>>2]>>>0>d>>>0&&S(5244280,47,5246520,5245236),i=(L[m>>2]<<2)+k|0,L[i>>2]=L[i>>2]+1|0,i=n+1|0,(i|0)==(b|0))break a;else n=i;while(0);L[f]=0;a:do if(0!=(d|0)){k=0;for(n=1;;)if(i=L[(n-1<<2>>2)+f]+k<<1,L[g+(n<<2)>>2]=i,m=n+1|0,m>>>0>d>>>0)break a;else k=i,n=m}while(0);if(0!=(b|0))for(k=0;!(d=L[c+(k<<2)>>2],
0!=(d|0)&&(f=((d<<2)+g|0)>>2,L[e+(k<<2)>>2]=L[f],L[f]=L[f]+1|0),f=k+1|0,(f|0)==(b|0));)k=f;X(j);X(h)}
function nd(c,b,d){var e,g,j,k,f;e=0;if(0==(b|0))e=1060;else{for(j=g=0;!(k=L[c+(g<<2)>>2]+j|0,g=g+1|0,(g|0)==(b|0));)j=k;0==(k|0)?e=1060:f=Math.log(k>>>0)}1060==e&&(f=Math.log(b>>>0));e=1.4426950408889*f;if(0!=(b|0))for(g=0;!(f=L[c+(g<<2)>>2],0==(f|0)?(k=(g<<3)+d|0,Ma[M>>3]=e,L[k>>2]=L[M>>2],L[k+4>>2]=L[M+4>>2]):(k=e-1.4426950408889*Math.log(f>>>0),f=(g<<3)+d|0,Ma[M>>3]=k,L[f>>2]=L[M>>2],L[f+4>>2]=L[M+4>>2]),f=((g<<3)+d|0)>>2,k=(L[M>>2]=L[f],L[M+4>>2]=L[f+1],Ma[M>>3]),0>k&-1E-5<k?(Ma[M>>3]=0,L[f]=
L[M>>2],L[f+1]=L[M+4>>2]):0<=k||S(5244280,92,5246604,5245080),k=g+1|0,(k|0)==(b|0));)g=k}
function Gc(c,b,d,e){var g=c,c=b,j,k,f,h,n,m,i,l,b=H;H=H+12|0;j=R(c<<4);b:do if(0<(c|0)){cc(e,c<<2);for(f=k=0;;)if(h=L[g+(f<<2)>>2],0==(h|0)?n=k:(L[j+(k<<4)>>2]=h,L[j+(k<<4)+8>>2]=f,n=k+1|0),h=f+1|0,(h|0)==(c|0)){m=n;break b}else k=n,f=h}else m=0;while(0);if((1<<d|0)<(m|0))X(j),e=1;else{if(0==(m|0))X(j);else if(1==(m|0))L[e+(L[j+8>>2]<<2)>>2]=1,X(j);else{c=m;if(0!=c){n=[];for(g=0;g<c;g++)n.push(g);n.sort(function(b,c){return za(14,[j+16*b,j+16*c])});k=R(16*c);bc(k,j,16*c);for(g=0;g<c;g++)n[g]!=g&&
bc(j+16*g,k+16*n[g],16);X(k)}n=Math.i(d<<1,d+1|0);c=(b+8|0)>>2;L[c]=n;g=R(n<<4);n=(b|0)>>2;L[n]=g;L[b+4>>2]=g;b:do if(0<(L[c]|0))for(g=0;;)if(I[(g<<4)+L[n]+12|0]=0,f=g+1|0,(f|0)<(L[c]|0))g=f;else break b;while(0);g=c=R(d<<3);i=j;k=g;f=Yc(0,d,b);h=Yc(0,d,b);Zc(L[i>>2],1,0,f);Zc(L[i+16>>2],2,0,h);if(0<(d|0))for(i=0;!(L[k+(i<<3)>>2]=f,L[k+(i<<3)+4>>2]=h,i=i+1|0,(i|0)==(d|0)););f=m<<1;b:do if(0<(f-4|0)){k=f-5|0;h=d-1|0;i=(m<<1)-4|0;for(l=0;;)if(dd(g,d,j,m,b,h,(l|0)==(k|0)&1),l=l+1|0,(l|0)==(i|0))break b}while(0);
d=L[g+(d-1<<3)+4>>2];if(0!=(d|0))for(m=d;;){d=m+8|0;b:do if(0<(L[d>>2]|0))for(g=0;;)if(k=(L[j+(g<<4)+8>>2]<<2)+e|0,L[k>>2]=L[k>>2]+1|0,k=g+1|0,(k|0)<(L[d>>2]|0))g=k;else break b;while(0);d=L[m+4>>2];if(0==(d|0))break;else m=d}X(c);X(j);X(L[n])}e=0}H=b;0!=(e|0)&&S(5244280,100,5246656,5244760)}function Kc(c){return 5>(c|0)?0:c=(ec(c-1|0)^31)-1|0}function Jc(c){var b;b=c-1|0;if(5>(c|0))return b;c=ec(b)^31;return b>>>((c-1|0)>>>0)&1|c<<1}
function pd(c,b){var d;d=H;H=H+20|0;var e;e=d>>2;L[e]=0;L[e+1]=15;L[e+2]=1;L[e+3]=0;L[e+4]=15;L[d+4>>2]=b;b=c>>2;c=d>>2;L[b]=L[c];L[b+1]=L[c+1];L[b+2]=L[c+2];L[b+3]=L[c+3];L[b+4]=L[c+4];H=d}function qd(c){var b,d;0!=(c|0)&&(b=c|0,d=L[b>>2],0!=(d|0)&&(X(d),L[b>>2]=0),X(c))}function rd(c,b,d,e){var g,j,k,f;g=H;H=H+32|0;j=g+20;k=g+24;f=g+28;I[f]=0;L[k>>2]=0;L[j>>2]=0;pd(g,e);Rc(g,b,d,f,j,k);L[c>>2]=L[j>>2];L[c+4>>2]=L[k>>2];H=g}
function sd(c,b,d,e){var g,j,k;g=H;H=H+28|0;j=g+20;k=g+24;L[k>>2]=0;L[j>>2]=0;pd(g,e);var f=k,h,n,m,i,l,e=f>>2;h=j>>2;n=H;H=H+4|0;I[n]=0;l=b;var q=d,v,u,s,r,p,w,t;if(0==(q|0))m=1,i=0;else{v=l;u=q;s=1;for(r=0;;){q=5550<u>>>0?5550:u;l=u-q|0;if(0==(q|0))p=s;else{p=5550>u>>>0;w=v;for(t=q;!(m=Ia[w]+s|0,i=m+r|0,t=t-1|0,0==(t|0));)w=w+1|0,s=m,r=i;v=v+(p?u:5550)|0;p=m;r=i}p=(p>>>0)%65521;w=(r>>>0)%65521;if((u|0)==(q|0))break;else u=l,s=p,r=w}m=p;i=w<<16}m|=i;i=L[e];0==(i-1&i|0)&&(l=0==(i|0)?R(1):$(L[h],i<<
1),L[h]=l);I[L[h]+L[e]|0]=120;l=L[e];i=l+1|0;L[e]=i;0==(i&l|0)&&(i=0==(i|0)?R(1):$(L[h],i<<1),L[h]=i);I[L[h]+L[e]|0]=1;L[e]=L[e]+1|0;Rc(g,b,d,n,j,f);f=L[e];0==(f-1&f|0)&&(b=0==(f|0)?R(1):$(L[h],f<<1),L[h]=b);I[L[h]+L[e]|0]=m>>>24&255;b=L[e];f=b+1|0;L[e]=f;0==(f&b|0)&&(b=0==(f|0)?R(1):$(L[h],f<<1),L[h]=b);I[L[h]+L[e]|0]=m>>>16&255;b=L[e];f=b+1|0;L[e]=f;0==(f&b|0)&&(b=0==(f|0)?R(1):$(L[h],f<<1),L[h]=b);I[L[h]+L[e]|0]=m>>>8&255;b=L[e];f=b+1|0;L[e]=f;0==(f&b|0)&&(f=0==(f|0)?R(1):$(L[h],f<<1),L[h]=f);
I[L[h]+L[e]|0]=m&255;m=L[e]+1|0;L[e]=m;0!=(L[g>>2]|0)&&$b(L[vb>>2],5244060,(Oa=H,H=H+16|0,L[Oa>>2]=d,L[Oa+4>>2]=m,Ma[M>>3]=100*((d-m|0)>>>0)/(d>>>0),L[Oa+8>>2]=L[M>>2],L[Oa+12>>2]=L[M+4>>2],Oa));H=n;L[c>>2]=L[j>>2];L[c+4>>2]=L[k>>2];H=g}
function td(c,b,d,e){var g,j,k;g=H;H=H+28|0;j=g+20;k=g+24;L[k>>2]=0;L[j>>2]=0;pd(g,e);var f=k,h,n,m,i,l,e=f>>2;h=j>>2;n=H;H=H+4|0;if(!I[5242904]){var q;for(i=0;!(l=i>>>1,q=0==(i&1|0)?l:l^-306674912,l=q>>>1,q=0==(q&1|0)?l:l^-306674912,l=q>>>1,q=0==(q&1|0)?l:l^-306674912,l=q>>>1,q=0==(q&1|0)?l:l^-306674912,l=q>>>1,q=0==(q&1|0)?l:l^-306674912,l=q>>>1,q=0==(q&1|0)?l:l^-306674912,l=q>>>1,q=0==(q&1|0)?l:l^-306674912,l=q>>>1,L[(i<<2)+5242908>>2]=0==(q&1|0)?l:l^-306674912,l=i+1|0,256==(l|0));)i=l;I[5242904]=
1}if(0==(d|0))m=0;else{i=-1;for(l=0;!(m=L[((Ia[b+l|0]^i&255)<<2)+5242908>>2]^i>>>8,l=l+1|0,(l|0)==(d|0));)i=m;m^=-1}I[n]=0;i=L[e];0==(i-1&i|0)&&(l=0==(i|0)?R(1):$(L[h],i<<1),L[h]=l);I[L[h]+L[e]|0]=31;l=L[e];i=l+1|0;L[e]=i;0==(i&l|0)&&(l=0==(i|0)?R(1):$(L[h],i<<1),L[h]=l);I[L[h]+L[e]|0]=-117;l=L[e];i=l+1|0;L[e]=i;0==(i&l|0)&&(l=0==(i|0)?R(1):$(L[h],i<<1),L[h]=l);I[L[h]+L[e]|0]=8;l=L[e];i=l+1|0;L[e]=i;0==(i&l|0)&&(l=0==(i|0)?R(1):$(L[h],i<<1),L[h]=l);I[L[h]+L[e]|0]=0;l=L[e];i=l+1|0;L[e]=i;0==(i&l|0)&&
(l=0==(i|0)?R(1):$(L[h],i<<1),L[h]=l);I[L[h]+L[e]|0]=0;l=L[e];i=l+1|0;L[e]=i;0==(i&l|0)&&(l=0==(i|0)?R(1):$(L[h],i<<1),L[h]=l);I[L[h]+L[e]|0]=0;l=L[e];i=l+1|0;L[e]=i;0==(i&l|0)&&(l=0==(i|0)?R(1):$(L[h],i<<1),L[h]=l);I[L[h]+L[e]|0]=0;l=L[e];i=l+1|0;L[e]=i;0==(i&l|0)&&(l=0==(i|0)?R(1):$(L[h],i<<1),L[h]=l);I[L[h]+L[e]|0]=0;l=L[e];i=l+1|0;L[e]=i;0==(i&l|0)&&(l=0==(i|0)?R(1):$(L[h],i<<1),L[h]=l);I[L[h]+L[e]|0]=2;l=L[e];i=l+1|0;L[e]=i;0==(i&l|0)&&(i=0==(i|0)?R(1):$(L[h],i<<1),L[h]=i);I[L[h]+L[e]|0]=3;L[e]=
L[e]+1|0;Rc(g,b,d,n,j,f);f=L[e];0==(f-1&f|0)&&(b=0==(f|0)?R(1):$(L[h],f<<1),L[h]=b);I[L[h]+L[e]|0]=m&255;b=L[e];f=b+1|0;L[e]=f;0==(f&b|0)&&(b=0==(f|0)?R(1):$(L[h],f<<1),L[h]=b);I[L[h]+L[e]|0]=m>>>8&255;b=L[e];f=b+1|0;L[e]=f;0==(f&b|0)&&(b=0==(f|0)?R(1):$(L[h],f<<1),L[h]=b);I[L[h]+L[e]|0]=m>>>16&255;b=L[e];f=b+1|0;L[e]=f;0==(f&b|0)&&(f=0==(f|0)?R(1):$(L[h],f<<1),L[h]=f);I[L[h]+L[e]|0]=m>>>24&255;m=L[e];f=m+1|0;L[e]=f;0==(f&m|0)&&(b=0==(f|0)?R(1):$(L[h],f<<1),L[h]=b);I[L[h]+L[e]|0]=d&255;b=L[e];f=b+
1|0;L[e]=f;0==(f&b|0)&&(b=0==(f|0)?R(1):$(L[h],f<<1),L[h]=b);I[L[h]+L[e]|0]=d>>>8&255;b=L[e];f=b+1|0;L[e]=f;0==(f&b|0)&&(b=0==(f|0)?R(1):$(L[h],f<<1),L[h]=b);I[L[h]+L[e]|0]=d>>>16&255;b=L[e];f=b+1|0;L[e]=f;0==(f&b|0)&&(f=0==(f|0)?R(1):$(L[h],f<<1),L[h]=f);I[L[h]+L[e]|0]=d>>>24&255;h=L[e]+1|0;L[e]=h;0!=(L[g>>2]|0)&&$b(L[vb>>2],5244972,(Oa=H,H=H+16|0,L[Oa>>2]=d,L[Oa+4>>2]=h,Ma[M>>3]=100*((d-h|0)>>>0)/(d>>>0),L[Oa+8>>2]=L[M>>2],L[Oa+12>>2]=L[M+4>>2],Oa));H=n;L[c>>2]=L[j>>2];L[c+4>>2]=L[k>>2];H=g}
function R(c){var b,d,e,g,j,k,f,h,n,m;do if(245>c>>>0){b=11>c>>>0?16:c+11&-8;d=b>>>3;e=L[1311502];g=e>>>(d>>>0);if(0!=(g&3|0))return j=(g&1^1)+d|0,b=j<<1,c=(b<<2)+5246048|0,k=(b+2<<2)+5246048|0,b=L[k>>2],f=b+8|0,h=L[f>>2],(c|0)==(h|0)?L[1311502]=e&(1<<j^-1):(h>>>0<L[1311506]>>>0&&U(),n=h+12|0,(L[n>>2]|0)==(b|0)?(L[n>>2]=c,L[k>>2]=h):U()),h=j<<3,L[b+4>>2]=h|3,k=b+(h|4)|0,L[k>>2]|=1,j=f;if(b>>>0<=L[1311504]>>>0)e=b;else{if(0==(g|0)){if(0==(L[1311503]|0)){e=b;break}j=b;var i=d=g=m=n=h=f=k=a,l=a,q=a,
v=a,u=a,s=k=k=l=v=u=e=c=a;k=L[1311503];f=(k&-k)-1|0;k=f>>>12&16;h=f>>>(k>>>0);f=h>>>5&8;n=h>>>(f>>>0);h=n>>>2&4;m=n>>>(h>>>0);n=m>>>1&2;g=m>>>(n>>>0);m=g>>>1&1;g=m=d=L[((f|k|h|n|m)+(g>>>(m>>>0))<<2)+5246312>>2];n=g>>2;for(h=(L[d+4>>2]&-8)-j|0;;){d=L[m+16>>2];if(0==(d|0))if(k=L[m+20>>2],0==(k|0))break;else i=k;else i=d;d=(L[i+4>>2]&-8)-j|0;k=d>>>0<h>>>0;m=i;g=k?i:g;n=g>>2;h=k?d:h}i=g;m=L[1311506];i>>>0<m>>>0&&U();k=d=i+j|0;i>>>0>=d>>>0&&U();d=L[n+6];f=L[n+3];b:do if((f|0)==(g|0)){l=g+20|0;q=L[l>>2];
do if(0==(q|0)){if(v=g+16|0,u=L[v>>2],0==(u|0)){c=0;e=c>>2;break b}}else u=q,v=l;while(0);for(;;){l=u+20|0;if(0==(L[l>>2]|0))if(q=u+16|0,0==(L[q>>2]|0))break;else l=q;u=L[l>>2];v=l}v>>>0<L[1311506]>>>0?U():(L[v>>2]=0,c=u,e=c>>2)}else l=L[n+2],l>>>0<m>>>0&&U(),q=l+12|0,(L[q>>2]|0)!=(g|0)&&U(),v=f+8|0,(L[v>>2]|0)==(g|0)?(L[q>>2]=f,L[v>>2]=l,c=f,e=c>>2):U();while(0);b:do if(0!=(d|0)){f=g+28|0;m=(L[f>>2]<<2)+5246312|0;do if((g|0)==(L[m>>2]|0)){if(L[m>>2]=c,0==(c|0)){L[1311503]&=1<<L[f>>2]^-1;break b}}else if(d>>>
0<L[1311506]>>>0&&U(),u=d+16|0,(L[u>>2]|0)==(g|0)?L[u>>2]=c:L[d+20>>2]=c,0==(c|0))break b;while(0);c>>>0<L[1311506]>>>0&&U();L[e+6]=d;f=L[n+4];0!=(f|0)&&(f>>>0<L[1311506]>>>0?U():(L[e+4]=f,L[f+24>>2]=c));f=L[n+5];0!=(f|0)&&(f>>>0<L[1311506]>>>0?U():(L[e+5]=f,L[f+24>>2]=c))}while(0);16>h>>>0?(c=h+j|0,L[n+1]=c|3,e=c+(i+4)|0,L[e>>2]|=1):(L[n+1]=j|3,L[j+(i+4)>>2]=h|1,L[i+h+j>>2]=h,j=L[1311504],0!=(j|0)&&(i=L[1311507],n=j>>>3,j=n<<1,e=(j<<2)+5246048|0,c=L[1311502],d=1<<n,0==(c&d|0)?(L[1311502]=c|d,s=e):
(n=L[(j+2<<2)+5246048>>2],n>>>0>=L[1311506]>>>0?s=n:U()),L[(j+2<<2)+5246048>>2]=i,L[s+12>>2]=i,L[i+8>>2]=s,L[i+12>>2]=e),L[1311504]=h,L[1311507]=k);k=g+8|0;if(0==(k|0)){e=b;break}else j=k;return j}k=2<<d;h=g<<d&(k|-k);k=(h&-h)-1|0;h=k>>>12&16;c=k>>>(h>>>0);k=c>>>5&8;n=c>>>(k>>>0);c=n>>>2&4;f=n>>>(c>>>0);n=f>>>1&2;m=f>>>(n>>>0);f=m>>>1&1;g=(k|h|c|n|f)+(m>>>(f>>>0))|0;f=g<<1;m=(f<<2)+5246048|0;n=(f+2<<2)+5246048|0;f=L[n>>2];c=f+8|0;h=L[c>>2];(m|0)==(h|0)?L[1311502]=e&(1<<g^-1):(h>>>0<L[1311506]>>>0&&
U(),k=h+12|0,(L[k>>2]|0)==(f|0)?(L[k>>2]=m,L[n>>2]=h):U());h=g<<3;n=h-b|0;L[f+4>>2]=b|3;m=f;e=m+b|0;L[m+(b|4)>>2]=n|1;L[m+h>>2]=n;h=L[1311504];0!=(h|0)&&(m=L[1311507],d=h>>>3,h=d<<1,g=(h<<2)+5246048|0,f=L[1311502],b=1<<d,0==(f&b|0)?(L[1311502]=f|b,j=g):(d=L[(h+2<<2)+5246048>>2],d>>>0>=L[1311506]>>>0?j=d:U()),L[(h+2<<2)+5246048>>2]=m,L[j+12>>2]=m,L[m+8>>2]=j,L[m+12>>2]=g);L[1311504]=n;L[1311507]=e;return j=c}}else if(4294967231<c>>>0)e=-1;else if(b=c+11&-8,0==(L[1311503]|0))e=b;else{e=b;var r=s=i=
d=a,p=l=a,w=a,t=a,y=a,x=a,B=t=h=f=k=a,z=a,A=a,C=r=r=v=r=t=w=u=q=d=g=m=n=p=B=w=x=a;d=e>>2;i=0;s=-e|0;r=e>>>8;0==(r|0)?l=0:16777215<e>>>0?l=31:(p=(r+1048320|0)>>>16&8,w=r<<p,t=(w+520192|0)>>>16&4,y=w<<t,w=(y+245760|0)>>>16&2,x=14-(t|p|w)+(y<<w>>>15)|0,l=e>>>((x+7|0)>>>0)&1|x<<1);r=L[(l<<2)+5246312>>2];b:do if(0==(r|0))k=0,f=s,h=0;else{t=31==(l|0)?0:25-(l>>>1)|0;x=0;w=s;y=r;p=y>>2;t=e<<t;for(B=0;;){z=L[p+1]&-8;A=z-e|0;if(A>>>0<w>>>0)if((z|0)==(e|0)){k=y;f=A;h=y;break b}else x=y,w=A;A=L[p+5];z=L[((t>>>
31<<2)+16>>2)+p];B=0==(A|0)|(A|0)==(z|0)?B:A;if(0==(z|0)){k=x;f=w;h=B;break b}else y=z,p=y>>2,t<<=1}}while(0);0==(h|0)&0==(k|0)?(w=2<<l,x=L[1311503]&(w|-w),0==(x|0)?p=h:(w=(x&-x)-1|0,x=w>>>12&16,t=w>>>(x>>>0),w=t>>>5&8,r=t>>>(w>>>0),t=r>>>2&4,s=r>>>(t>>>0),r=s>>>1&2,B=s>>>(r>>>0),s=B>>>1&1,p=L[((w|x|t|r|s)+(B>>>(s>>>0))<<2)+5246312>>2])):p=h;b:do if(0==(p|0))n=f,m=k,g=m>>2;else{h=p;l=h>>2;s=f;for(B=k;;)if(r=(L[l+1]&-8)-e|0,x=(t=r>>>0<s>>>0)?r:s,r=t?h:B,t=L[l+4],0!=(t|0))h=t,l=h>>2,s=x,B=r;else if(t=
L[l+5],0==(t|0)){n=x;m=r;g=m>>2;break b}else h=t,l=h>>2,s=x,B=r}while(0);if(0==(m|0))d=0;else if(n>>>0>=(L[1311504]-e|0)>>>0)d=0;else{k=m;f=k>>2;p=L[1311506];k>>>0<p>>>0&&U();s=B=k+e|0;k>>>0>=B>>>0&&U();h=L[g+6];l=L[g+3];b:do if((l|0)==(m|0)){r=m+20|0;x=L[r>>2];do if(0==(x|0)){if(t=m+16|0,w=L[t>>2],0==(w|0)){q=0;u=q>>2;break b}}else w=x,t=r;while(0);for(;;){r=w+20|0;if(0==(L[r>>2]|0))if(x=w+16|0,0==(L[x>>2]|0))break;else r=x;w=L[r>>2];t=r}t>>>0<L[1311506]>>>0?U():(L[t>>2]=0,q=w,u=q>>2)}else r=L[g+
2],r>>>0<p>>>0&&U(),x=r+12|0,(L[x>>2]|0)!=(m|0)&&U(),t=l+8|0,(L[t>>2]|0)==(m|0)?(L[x>>2]=l,L[t>>2]=r,q=l,u=q>>2):U();while(0);b:do if(0!=(h|0)){l=m+28|0;p=(L[l>>2]<<2)+5246312|0;do if((m|0)==(L[p>>2]|0)){if(L[p>>2]=q,0==(q|0)){L[1311503]&=1<<L[l>>2]^-1;break b}}else if(h>>>0<L[1311506]>>>0&&U(),w=h+16|0,(L[w>>2]|0)==(m|0)?L[w>>2]=q:L[h+20>>2]=q,0==(q|0))break b;while(0);q>>>0<L[1311506]>>>0&&U();L[u+6]=h;l=L[g+4];0!=(l|0)&&(l>>>0<L[1311506]>>>0?U():(L[u+4]=l,L[l+24>>2]=q));l=L[g+5];0!=(l|0)&&(l>>>
0<L[1311506]>>>0?U():(L[u+5]=l,L[l+24>>2]=q))}while(0);do if(16>n>>>0)q=n+e|0,L[g+1]=q|3,u=q+(k+4)|0,L[u>>2]|=1;else if(L[g+1]=e|3,L[d+(f+1)]=n|1,L[(n>>2)+f+d]=n,u=n>>>3,256>n>>>0)q=u<<1,h=(q<<2)+5246048|0,l=L[1311502],p=1<<u,0==(l&p|0)?(L[1311502]=l|p,v=h):(u=L[(q+2<<2)+5246048>>2],u>>>0>=L[1311506]>>>0?v=u:U()),L[(q+2<<2)+5246048>>2]=s,L[v+12>>2]=s,L[d+(f+2)]=v,L[d+(f+3)]=h;else if(p=B,l=n>>>8,0==(l|0)?r=0:16777215<n>>>0?r=31:(u=(l+1048320|0)>>>16&8,w=l<<u,t=(w+520192|0)>>>16&4,r=w<<t,w=(r+245760|
0)>>>16&2,r=14-(t|u|w)+(r<<w>>>15)|0,r=n>>>((r+7|0)>>>0)&1|r<<1),l=(r<<2)+5246312|0,L[d+(f+7)]=r,L[d+(f+5)]=0,L[d+(f+4)]=0,h=L[1311503],q=1<<r,0==(h&q|0))L[1311503]=h|q,L[l>>2]=p,L[d+(f+6)]=l,L[d+(f+3)]=p,L[d+(f+2)]=p;else{r=31==(r|0)?0:25-(r>>>1)|0;q=n<<r;for(h=L[l>>2];(L[h+4>>2]&-8|0)!=(n|0);)if(C=(q>>>31<<2)+h+16|0,l=L[C>>2],0==(l|0)){i=1328;break}else q<<=1,h=l;if(1328==i)if(C>>>0<L[1311506]>>>0)U();else{L[C>>2]=p;L[d+(f+6)]=h;L[d+(f+3)]=p;L[d+(f+2)]=p;break}q=h+8|0;l=L[q>>2];r=L[1311506];h>>>
0<r>>>0&&U();l>>>0<r>>>0?U():(L[l+12>>2]=p,L[q>>2]=p,L[d+(f+2)]=l,L[d+(f+3)]=h,L[d+(f+6)]=0)}while(0);d=m+8|0}f=d;if(0==(f|0))e=b;else return j=f}while(0);c=L[1311504];e>>>0>c>>>0?(j=L[1311505],e>>>0<j>>>0?(b=j-e|0,L[1311505]=b,f=j=L[1311508],L[1311508]=f+e|0,L[e+(f+4)>>2]=b|1,L[j+4>>2]=e|3,j=j+8|0):j=ud(e)):(j=c-e|0,b=L[1311507],15<j>>>0?(f=b,L[1311507]=f+e|0,L[1311504]=j,L[e+(f+4)>>2]=j|1,L[f+c>>2]=j,L[b+4>>2]=e|3):(L[1311504]=0,L[1311507]=0,L[b+4>>2]=c|3,e=c+(b+4)|0,L[e>>2]|=1),j=b+8|0);return j}
function ud(c){var b,d,e,g,j,k,f,h,n,m,i,l,q,v,u,s,r,p,w,t,y,x;b=0;0==(L[1310720]|0)&&vd();d=c+48|0;e=L[1310722];g=e+(c+47)&-e;if(g>>>0<=c>>>0)return 0;e=L[1311612];if(0!=(e|0)&&(j=L[1311610],k=j+g|0,k>>>0<=j>>>0|k>>>0>e>>>0))return 0;a:do{if(0==(L[1311613]&4|0)){e=L[1311508];0==(e|0)?b=1356:(k=wd(e),0==(k|0)?b=1356:(j=L[1310722],f=c+47-L[1311505]+j&-j,2147483647<=f>>>0?h=0:(j=gc(f),n=(k=(j|0)==(L[k>>2]+L[k+4>>2]|0))?j:-1,m=k?f:0,i=j,l=f,b=1365)));1356==b&&(e=gc(0),-1==(e|0)?h=0:(f=e,j=L[1310721],
k=j-1|0,q=0==(k&f|0)?g:g-f+(k+f&-j)|0,j=L[1311610],f=j+q|0,q>>>0>c>>>0&2147483647>q>>>0?(k=L[1311612],0!=(k|0)&&f>>>0<=j>>>0|f>>>0>k>>>0?h=0:(k=gc(q),n=(f=(k|0)==(e|0))?e:-1,m=f?q:0,i=k,l=q,b=1365)):h=0));b:do if(1365==b){k=-l|0;if(-1!=(n|0)){v=m;u=n;b=1376;break a}do if(-1!=(i|0)&2147483647>l>>>0&l>>>0<d>>>0)if(f=L[1310722],e=c+47-l+f&-f,2147483647<=e>>>0)e=l;else if(-1==(gc(e)|0)){gc(k);h=m;break b}else e=e+l|0;else e=l;while(0);if(-1==(i|0))h=m;else{v=e;u=i;b=1376;break a}}while(0);L[1311613]|=
4;s=h}else s=0;b=1373}while(0);1373==b&&!(2147483647<=g>>>0)&&(h=gc(g),i=gc(0),-1!=(i|0)&-1!=(h|0)&h>>>0<i>>>0&&(e=i-h|0,m=(i=e>>>0>(c+40|0)>>>0)?h:-1,-1!=(m|0)&&(v=i?e:s,u=m,b=1376)));do if(1376==b){s=L[1311610]+v|0;L[1311610]=s;s>>>0>L[1311611]>>>0&&(L[1311611]=s);a:do if(0==(L[1311508]|0)){s=L[1311506];0==(s|0)|u>>>0<s>>>0&&(L[1311506]=u);L[1311614]=u;L[1311615]=v;L[1311617]=0;L[1311511]=L[1310720];L[1311510]=-1;h=g=d=a;for(d=0;!(g=d<<1,h=(g<<2)+5246048|0,L[(g+3<<2)+5246048>>2]=h,L[(g+2<<2)+5246048>>
2]=h,h=d+1|0,32==(h|0));)d=h;xd(u,v-40|0)}else{s=5246456;for(g=s>>2;;){r=L[g];p=s+4|0;w=L[p>>2];t=r+w|0;if((u|0)==(t|0)){b=1384;break}m=L[g+2];if(0==(m|0))break;else s=m,g=s>>2}do if(1384==b&&0==(L[g+3]&8|0)&&(s=L[1311508],s>>>0>=r>>>0&s>>>0<t>>>0)){L[p>>2]=w+v|0;xd(L[1311508],L[1311505]+v|0);break a}while(0);u>>>0<L[1311506]>>>0&&(L[1311506]=u);g=u+v|0;for(s=5246456;;){y=s|0;x=L[y>>2];if((x|0)==(g|0)){b=1392;break}m=L[s+8>>2];if(0==(m|0))break;else s=m}if(1392==b&&0==(L[s+12>>2]&8|0))return L[y>>
2]=u,g=s+4|0,L[g>>2]=L[g>>2]+v|0,c=yd(u,x,c);d=u;g=v;e=j=f=s=q=l=j=k=i=f=m=n=h=a;h=0;n=L[1311508];m=n>>2;f=n;i=wd(f);k=L[i>>2];j=L[i+4>>2];i=k+j|0;l=k+(j-39)|0;q=0==(l&7|0)?0:-l&7;l=k+(j-47)+q|0;q=l>>>0<(n+16|0)>>>0?f:l;l=q+8|0;j=l>>2;xd(d,g-40|0);L[q+4>>2]=27;L[j]=L[1311614];L[j+1]=L[1311615];L[j+2]=L[1311616];L[j+3]=L[1311617];L[1311614]=d;L[1311615]=g;L[1311617]=0;L[1311616]=l;l=q+28|0;L[l>>2]=7;b:do if((q+32|0)>>>0<i>>>0)for(g=l;;)if(d=g+4|0,L[d>>2]=7,(g+8|0)>>>0<i>>>0)g=d;else break b;while(0);
if((q|0)!=(f|0))if(i=q-n|0,q=i+(f+4)|0,L[q>>2]&=-2,L[m+1]=i|1,L[f+i>>2]=i,f=i>>>3,256>i>>>0)q=f<<1,l=(q<<2)+5246048|0,g=L[1311502],d=1<<f,0==(g&d|0)?(L[1311502]=g|d,s=l):(f=L[(q+2<<2)+5246048>>2],f>>>0>=L[1311506]>>>0?s=f:U()),L[(q+2<<2)+5246048>>2]=n,L[s+12>>2]=n,L[m+2]=s,L[m+3]=l;else if(l=n,s=i>>>8,0==(s|0)?f=0:16777215<i>>>0?f=31:(q=(s+1048320|0)>>>16&8,d=s<<q,g=(d+520192|0)>>>16&4,f=d<<g,d=(f+245760|0)>>>16&2,j=14-(g|q|d)+(f<<d>>>15)|0,f=i>>>((j+7|0)>>>0)&1|j<<1),s=(f<<2)+5246312|0,L[m+7]=f,
L[m+5]=0,L[m+4]=0,j=L[1311503],d=1<<f,0==(j&d|0))L[1311503]=j|d,L[s>>2]=l,L[m+6]=s,L[m+3]=n,L[m+2]=n;else{j=31==(f|0)?0:25-(f>>>1)|0;f=i<<j;for(j=L[s>>2];(L[j+4>>2]&-8|0)!=(i|0);)if(e=(f>>>31<<2)+j+16|0,s=L[e>>2],0==(s|0)){h=2187;break}else f<<=1,j=s;2187==h?(e>>>0<L[1311506]>>>0&&U(),L[e>>2]=l,L[m+6]=j,L[m+3]=n,L[m+2]=n):(n=j+8|0,e=L[n>>2],h=L[1311506],j>>>0<h>>>0&&U(),e>>>0<h>>>0&&U(),L[e+12>>2]=l,L[n>>2]=l,L[m+2]=e,L[m+3]=j,L[m+6]=0)}}while(0);s=L[1311505];if(!(s>>>0<=c>>>0))return g=s-c|0,L[1311505]=
g,m=s=L[1311508],L[1311508]=m+c|0,L[c+(m+4)>>2]=g|1,L[s+4>>2]=c|3,c=s+8|0}while(0);c=Fb;L[c>>2]=12;return 0}
function X(c){var b,d,e,g,j,k,f,h,n,m,i,l,q,v,u,s,r,p,w,t,y,x,B,z,A,C,E,J,O,P;b=c>>2;d=0;if(0!=(c|0)){g=e=c-8|0;j=L[1311506];e>>>0<j>>>0&&U();k=L[c-4>>2];f=k&3;1==(f|0)&&U();h=k&-8;n=h>>2;m=c+(h-8)|0;a:do if(0==(k&1|0)){i=L[e>>2];if(0==(f|0))return;l=-8-i|0;q=l>>2;u=v=c+l|0;s=i+h|0;v>>>0<j>>>0&&U();if((u|0)==(L[1311507]|0)){r=(c+(h-4)|0)>>2;if(3!=(L[r]&3|0)){p=u;w=p>>2;t=s;break}L[1311504]=s;L[r]&=-2;L[q+(b+1)]=s|1;L[m>>2]=s;return}r=i>>>3;if(256>i>>>0)i=L[q+(b+2)],p=L[q+(b+3)],y=(r<<3)+5246048|0,
(i|0)!=(y|0)&&(i>>>0<j>>>0&&U(),(L[i+12>>2]|0)!=(u|0)&&U()),(p|0)==(i|0)?L[1311502]&=1<<r^-1:((p|0)!=(y|0)&&(p>>>0<L[1311506]>>>0&&U(),(L[p+8>>2]|0)!=(u|0)&&U()),L[i+12>>2]=p,L[p+8>>2]=i),p=u,w=p>>2,t=s;else{y=v;r=L[q+(b+6)];x=L[q+(b+3)];b:do if((x|0)==(y|0)){v=l+(c+20)|0;B=L[v>>2];do if(0==(B|0)){if(z=l+(c+16)|0,i=L[z>>2],0==(i|0)){A=0;C=A>>2;break b}}else i=B,z=v;while(0);for(;;){v=i+20|0;if(0==(L[v>>2]|0))if(B=i+16|0,0==(L[B>>2]|0))break;else v=B;i=L[v>>2];z=v}z>>>0<L[1311506]>>>0?U():(L[z>>2]=
0,A=i,C=A>>2)}else v=L[q+(b+2)],v>>>0<j>>>0&&U(),B=v+12|0,(L[B>>2]|0)!=(y|0)&&U(),z=x+8|0,(L[z>>2]|0)==(y|0)?(L[B>>2]=x,L[z>>2]=v,A=x,C=A>>2):U();while(0);if(0==(r|0))p=u,w=p>>2,t=s;else{x=l+(c+28)|0;v=(L[x>>2]<<2)+5246312|0;do if((y|0)==(L[v>>2]|0)){if(L[v>>2]=A,0==(A|0)){L[1311503]&=1<<L[x>>2]^-1;p=u;w=p>>2;t=s;break a}}else if(r>>>0<L[1311506]>>>0&&U(),i=r+16|0,(L[i>>2]|0)==(y|0)?L[i>>2]=A:L[r+20>>2]=A,0==(A|0)){p=u;w=p>>2;t=s;break a}while(0);A>>>0<L[1311506]>>>0&&U();L[C+6]=r;y=L[q+(b+4)];0!=
(y|0)&&(y>>>0<L[1311506]>>>0?U():(L[C+4]=y,L[y+24>>2]=A));y=L[q+(b+5)];0==(y|0)?(p=u,w=p>>2,t=s):y>>>0<L[1311506]>>>0?U():(L[C+5]=y,L[y+24>>2]=A,p=u,w=p>>2,t=s)}}}else p=g,w=p>>2,t=h;while(0);g=p;A=g>>2;g>>>0>=m>>>0&&U();g=c+(h-4)|0;C=L[g>>2];0==(C&1|0)&&U();do if(0==(C&2|0)){if((m|0)==(L[1311508]|0)){j=L[1311505]+t|0;L[1311505]=j;L[1311508]=p;L[w+1]=j|1;(p|0)==(L[1311507]|0)&&(L[1311507]=0,L[1311504]=0);if(j>>>0<=L[1311509]>>>0)return;a:if(O=J=E=C=d=C=E=a,0==(L[1310720]|0)&&vd(),E=L[1311508],0!=
(E|0)){C=L[1311505];if(40<C>>>0&&(d=L[1310722],C=Math.i(Math.floor(((-41+C+d|0)>>>0)/(d>>>0))-1|0,d),E=wd(E),J=E>>2,0==(L[J+3]&8|0)&&(O=gc(0),(O|0)==(L[J]+L[J+1]|0)&&(J=gc(-(2147483646<C>>>0?-2147483648-d|0:C)|0),C=gc(0),-1!=(J|0)&C>>>0<O>>>0&&(J=O-C|0,(O|0)!=(C|0)))))){d=E+4|0;L[d>>2]=L[d>>2]-J|0;L[1311610]=L[1311610]-J|0;xd(L[1311508],L[1311505]-J|0);break a}L[1311505]>>>0<=L[1311509]>>>0||(L[1311509]=-1)}return}if((m|0)==(L[1311507]|0)){j=L[1311504]+t|0;L[1311504]=j;L[1311507]=p;L[w+1]=j|1;L[(j>>
2)+A]=j;return}j=(C&-8)+t|0;i=C>>>3;a:do if(256>C>>>0)z=L[b+n],v=L[((h|4)>>2)+b],f=(i<<3)+5246048|0,(z|0)!=(f|0)&&(z>>>0<L[1311506]>>>0&&U(),(L[z+12>>2]|0)!=(m|0)&&U()),(v|0)==(z|0)?L[1311502]&=1<<i^-1:((v|0)!=(f|0)&&(v>>>0<L[1311506]>>>0&&U(),(L[v+8>>2]|0)!=(m|0)&&U()),L[z+12>>2]=v,L[v+8>>2]=z);else{f=m;e=L[n+(b+4)];k=L[((h|4)>>2)+b];b:do if((k|0)==(f|0)){y=h+(c+12)|0;r=L[y>>2];do if(0==(r|0))if(x=h+(c+8)|0,v=L[x>>2],0==(v|0)){E=0;J=E>>2;break b}else u=v,s=x;else u=r,s=y;while(0);for(;;){y=u+20|
0;if(0==(L[y>>2]|0)){if(r=u+16|0,0==(L[r>>2]|0))break}else r=y;u=L[r>>2];s=r}s>>>0<L[1311506]>>>0?U():(L[s>>2]=0,E=u,J=E>>2)}else y=L[b+n],y>>>0<L[1311506]>>>0&&U(),r=y+12|0,(L[r>>2]|0)!=(f|0)&&U(),x=k+8|0,(L[x>>2]|0)==(f|0)?(L[r>>2]=k,L[x>>2]=y,E=k,J=E>>2):U();while(0);if(0!=(e|0)){k=h+(c+20)|0;z=(L[k>>2]<<2)+5246312|0;do if((f|0)==(L[z>>2]|0)){if(L[z>>2]=E,0==(E|0)){L[1311503]&=1<<L[k>>2]^-1;break a}}else if(e>>>0<L[1311506]>>>0&&U(),v=e+16|0,(L[v>>2]|0)==(f|0)?L[v>>2]=E:L[e+20>>2]=E,0==(E|0))break a;
while(0);E>>>0<L[1311506]>>>0&&U();L[J+6]=e;f=L[n+(b+2)];0!=(f|0)&&(f>>>0<L[1311506]>>>0?U():(L[J+4]=f,L[f+24>>2]=E));f=L[n+(b+3)];0!=(f|0)&&(f>>>0<L[1311506]>>>0?U():(L[J+5]=f,L[f+24>>2]=E))}}while(0);L[w+1]=j|1;L[(j>>2)+A]=j;if((p|0)!=(L[1311507]|0))e=j;else{L[1311504]=j;return}}else L[g>>2]=C&-2,L[w+1]=t|1,e=L[(t>>2)+A]=t;while(0);t=e>>>3;if(256>e>>>0)A=t<<1,C=(A<<2)+5246048|0,g=L[1311502],E=1<<t,0==(g&E|0)?(L[1311502]=g|E,O=C):(t=L[(A+2<<2)+5246048>>2],t>>>0>=L[1311506]>>>0?O=t:U()),L[(A+2<<2)+
5246048>>2]=p,L[O+12>>2]=p,L[w+2]=O,L[w+3]=C;else{C=p;O=e>>>8;0==(O|0)?c=0:16777215<e>>>0?c=31:(A=(O+1048320|0)>>>16&8,E=O<<A,g=(E+520192|0)>>>16&4,t=E<<g,E=(t+245760|0)>>>16&2,J=14-(g|A|E)+(t<<E>>>15)|0,c=e>>>((J+7|0)>>>0)&1|J<<1);O=(c<<2)+5246312|0;L[w+7]=c;L[w+5]=0;L[w+4]=0;J=L[1311503];E=1<<c;do if(0==(J&E|0))L[1311503]=J|E,L[O>>2]=C,L[w+6]=O,L[w+3]=p,L[w+2]=p;else{g=31==(c|0)?0:25-(c>>>1)|0;t=e<<g;for(A=L[O>>2];(L[A+4>>2]&-8|0)!=(e|0);)if(P=(t>>>31<<2)+A+16|0,g=L[P>>2],0==(g|0)){d=1534;break}else t<<=
1,A=g;if(1534==d)if(P>>>0<L[1311506]>>>0)U();else{L[P>>2]=C;L[w+6]=A;L[w+3]=p;L[w+2]=p;break}t=A+8|0;j=L[t>>2];g=L[1311506];A>>>0<g>>>0&&U();j>>>0<g>>>0?U():(L[j+12>>2]=C,L[t>>2]=C,L[w+2]=j,L[w+3]=A,L[w+6]=0)}while(0);w=L[1311510]-1|0;L[1311510]=w;if(0==(w|0)){for(d=5246464;!(d=L[d>>2],0==(d|0));)d=d+8|0;L[1311510]=-1}}}}
Module._calloc=function(c,b){var d;0==(c|0)?d=0:(d=Math.i(b,c),d=65535>=(b|c)>>>0?d:(Math.floor((d>>>0)/(c>>>0))|0)==(b|0)?d:-1);b=R(d);if(0==(b|0)||0==(L[b-4>>2]&3|0))return b;cc(b,d);return b};function $(c,b){var d,e;if(0==(c|0))return d=R(b);if(4294967231<b>>>0)return d=Fb,L[d>>2]=12,0;d=zd(c-8|0,11>b>>>0?16:b+11&-8);if(0!=(d|0))return d+8|0;d=R(b);if(0==(d|0))return 0;e=L[c-4>>2];e=(e&-8)-(0==(e&3|0)?8:4)|0;bc(d,c,e>>>0<b>>>0?e:b);X(c);return d}Module._realloc=$;
function zd(c,b){var d,e,g,j,k,f,h,n,m,i,l,q,v,u,s,r,p,w,t;d=(c+4|0)>>2;e=L[d];g=e&-8;j=g>>2;k=c>>2;f=c+g|0;h=L[1311506];c>>>0<h>>>0&&U();n=e&3;1!=(n|0)&c>>>0<f>>>0||U();m=(c+(g|4)|0)>>2;i=L[m];0==(i&1|0)&&U();if(0==(n|0))return d=L[c+4>>2]&-8,d=256>b>>>0?0:d>>>0>=(b+4|0)>>>0&&!((d-b|0)>>>0>L[1310722]<<1>>>0)?c:0,d;if(g>>>0>=b>>>0){n=g-b|0;if(15>=n>>>0)return c;L[d]=e&1|b|2;L[(b+4>>2)+k]=n|3;L[m]|=1;Ad(c+b|0,n);return c}if((f|0)==(L[1311508]|0)){n=L[1311505]+g|0;if(n>>>0<=b>>>0)return 0;m=n-b|0;L[d]=
e&1|b|2;L[(b+4>>2)+k]=m|1;L[1311508]=c+b|0;L[1311505]=m;return c}if((f|0)==(L[1311507]|0)){m=L[1311504]+g|0;if(m>>>0<b>>>0)return 0;n=m-b|0;15<n>>>0?(L[d]=e&1|b|2,L[(b+4>>2)+k]=n|1,L[(m>>2)+k]=n,l=m+(c+4)|0,L[l>>2]&=-2,q=c+b|0,v=n):(L[d]=e&1|m|2,e=m+(c+4)|0,L[e>>2]|=1,v=q=0);L[1311504]=v;L[1311507]=q;return c}if(0!=(i&2|0))return 0;q=(i&-8)+g|0;if(q>>>0<b>>>0)return 0;v=q-b|0;e=i>>>3;a:do if(256>i>>>0)m=L[j+(k+2)],n=L[j+(k+3)],l=(e<<3)+5246048|0,(m|0)!=(l|0)&&(m>>>0<h>>>0&&U(),(L[m+12>>2]|0)!=(f|
0)&&U()),(n|0)==(m|0)?L[1311502]&=1<<e^-1:((n|0)!=(l|0)&&(n>>>0<L[1311506]>>>0&&U(),(L[n+8>>2]|0)!=(f|0)&&U()),L[m+12>>2]=n,L[n+8>>2]=m);else{l=f;u=L[j+(k+6)];s=L[j+(k+3)];b:do if((s|0)==(l|0)){n=g+(c+20)|0;m=L[n>>2];do if(0==(m|0)){if(r=g+(c+16)|0,p=L[r>>2],0==(p|0)){w=0;t=w>>2;break b}}else p=m,r=n;while(0);for(;;){n=p+20|0;if(0==(L[n>>2]|0))if(m=p+16|0,0==(L[m>>2]|0))break;else n=m;p=L[n>>2];r=n}r>>>0<L[1311506]>>>0?U():(L[r>>2]=0,w=p,t=w>>2)}else n=L[j+(k+2)],n>>>0<h>>>0&&U(),m=n+12|0,(L[m>>2]|
0)!=(l|0)&&U(),r=s+8|0,(L[r>>2]|0)==(l|0)?(L[m>>2]=s,L[r>>2]=n,w=s,t=w>>2):U();while(0);if(0!=(u|0)){s=g+(c+28)|0;m=(L[s>>2]<<2)+5246312|0;do if((l|0)==(L[m>>2]|0)){if(L[m>>2]=w,0==(w|0)){L[1311503]&=1<<L[s>>2]^-1;break a}}else if(u>>>0<L[1311506]>>>0&&U(),n=u+16|0,(L[n>>2]|0)==(l|0)?L[n>>2]=w:L[u+20>>2]=w,0==(w|0))break a;while(0);w>>>0<L[1311506]>>>0&&U();L[t+6]=u;l=L[j+(k+4)];0!=(l|0)&&(l>>>0<L[1311506]>>>0?U():(L[t+4]=l,L[l+24>>2]=w));l=L[j+(k+5)];0!=(l|0)&&(l>>>0<L[1311506]>>>0?U():(L[t+5]=l,
L[l+24>>2]=w))}}while(0);16>v>>>0?(L[d]=q|L[d]&1|2,w=c+(q|4)|0,L[w>>2]|=1):(L[d]=L[d]&1|b|2,L[(b+4>>2)+k]=v|3,k=c+(q|4)|0,L[k>>2]|=1,Ad(c+b|0,v));return c}function vd(){var c;0==(L[1310720]|0)&&(c=fc(),0!=(c-1&c|0)&&U(),L[1310722]=c,L[1310721]=c,L[1310723]=-1,L[1310724]=2097152,L[1310725]=0,L[1311613]=0,c=Math.floor(Date.now()/1E3)&-16^1431655768,L[1310720]=c)}
function wd(c){var b,d,e,g,j;b=0;d=5246456;for(e=d>>2;;){g=L[e];if(g>>>0<=c>>>0&&(g+L[e+1]|0)>>>0>c>>>0){j=d;b=1902;break}g=L[e+2];if(0==(g|0)){j=0;b=1903;break}else d=g,e=d>>2}if(1903==b||1902==b)return j}
function Ad(c,b){var d,e,g,j,k,f,h,n,m,i,l,q,v,u,s,r,p,w,t,y,x,B,z,A,C,E,J;d=b>>2;e=0;g=c;j=g>>2;k=g+b|0;f=L[c+4>>2];a:do if(0==(f&1|0)){h=L[c>>2];if(0==(f&3|0))return;m=n=g+-h|0;i=h+b|0;l=L[1311506];n>>>0<l>>>0&&U();if((m|0)==(L[1311507]|0)){q=(b+(g+4)|0)>>2;if(3!=(L[q]&3|0)){v=m;u=v>>2;s=i;break}L[1311504]=i;L[q]&=-2;L[(4-h>>2)+j]=i|1;L[k>>2]=i;return}q=h>>>3;if(256>h>>>0)r=L[(8-h>>2)+j],p=L[(12-h>>2)+j],w=(q<<3)+5246048|0,(r|0)!=(w|0)&&(r>>>0<l>>>0&&U(),(L[r+12>>2]|0)!=(m|0)&&U()),(p|0)==(r|0)?
L[1311502]&=1<<q^-1:((p|0)!=(w|0)&&(p>>>0<L[1311506]>>>0&&U(),(L[p+8>>2]|0)!=(m|0)&&U()),L[r+12>>2]=p,L[p+8>>2]=r),v=m,u=v>>2,s=i;else{w=n;q=L[(24-h>>2)+j];t=L[(12-h>>2)+j];b:do if((t|0)==(w|0)){n=16-h|0;r=n+(g+4)|0;p=L[r>>2];do if(0==(p|0)){if(y=g+n|0,x=L[y>>2],0==(x|0)){B=0;z=B>>2;break b}}else x=p,y=r;while(0);for(;;){r=x+20|0;if(0==(L[r>>2]|0))if(p=x+16|0,0==(L[p>>2]|0))break;else n=p;else n=r;x=L[n>>2];y=n}y>>>0<L[1311506]>>>0?U():(L[y>>2]=0,B=x,z=B>>2)}else r=L[(8-h>>2)+j],r>>>0<l>>>0&&U(),
p=r+12|0,(L[p>>2]|0)!=(w|0)&&U(),n=t+8|0,(L[n>>2]|0)==(w|0)?(L[p>>2]=t,L[n>>2]=r,B=t,z=B>>2):U();while(0);if(0==(q|0))v=m,u=v>>2,s=i;else{t=g+(28-h)|0;l=(L[t>>2]<<2)+5246312|0;do if((w|0)==(L[l>>2]|0)){if(L[l>>2]=B,0==(B|0)){L[1311503]&=1<<L[t>>2]^-1;v=m;u=v>>2;s=i;break a}}else if(q>>>0<L[1311506]>>>0&&U(),n=q+16|0,(L[n>>2]|0)==(w|0)?L[n>>2]=B:L[q+20>>2]=B,0==(B|0)){v=m;u=v>>2;s=i;break a}while(0);B>>>0<L[1311506]>>>0&&U();L[z+6]=q;w=16-h|0;t=L[(w>>2)+j];0!=(t|0)&&(t>>>0<L[1311506]>>>0?U():(L[z+
4]=t,L[t+24>>2]=B));t=L[(w+4>>2)+j];0==(t|0)?(v=m,u=v>>2,s=i):t>>>0<L[1311506]>>>0?U():(L[z+5]=t,L[t+24>>2]=B,v=m,u=v>>2,s=i)}}}else v=c,u=v>>2,s=b;while(0);c=L[1311506];k>>>0<c>>>0&&U();B=b+(g+4)|0;z=L[B>>2];do if(0==(z&2|0)){if((k|0)==(L[1311508]|0)){x=L[1311505]+s|0;L[1311505]=x;L[1311508]=v;L[u+1]=x|1;if((v|0)!=(L[1311507]|0))return;L[1311507]=0;L[1311504]=0;return}if((k|0)==(L[1311507]|0)){x=L[1311504]+s|0;L[1311504]=x;L[1311507]=v;L[u+1]=x|1;L[(x>>2)+u]=x;return}x=(z&-8)+s|0;y=z>>>3;a:do if(256>
z>>>0)n=L[d+(j+2)],f=L[d+(j+3)],t=(y<<3)+5246048|0,(n|0)!=(t|0)&&(n>>>0<c>>>0&&U(),(L[n+12>>2]|0)!=(k|0)&&U()),(f|0)==(n|0)?L[1311502]&=1<<y^-1:((f|0)!=(t|0)&&(f>>>0<L[1311506]>>>0&&U(),(L[f+8>>2]|0)!=(k|0)&&U()),L[n+12>>2]=f,L[f+8>>2]=n);else{t=k;h=L[d+(j+6)];q=L[d+(j+3)];b:do if((q|0)==(t|0)){l=b+(g+20)|0;n=L[l>>2];do if(0==(n|0))if(r=b+(g+16)|0,p=L[r>>2],0==(p|0)){A=0;C=A>>2;break b}else f=p,m=r;else f=n,m=l;while(0);for(;;){l=f+20|0;if(0==(L[l>>2]|0))if(n=f+16|0,0==(L[n>>2]|0))break;else l=n;
f=L[l>>2];m=l}m>>>0<L[1311506]>>>0?U():(L[m>>2]=0,A=f,C=A>>2)}else l=L[d+(j+2)],l>>>0<c>>>0&&U(),n=l+12|0,(L[n>>2]|0)!=(t|0)&&U(),r=q+8|0,(L[r>>2]|0)==(t|0)?(L[n>>2]=q,L[r>>2]=l,A=q,C=A>>2):U();while(0);if(0!=(h|0)){q=b+(g+28)|0;n=(L[q>>2]<<2)+5246312|0;do if((t|0)==(L[n>>2]|0)){if(L[n>>2]=A,0==(A|0)){L[1311503]&=1<<L[q>>2]^-1;break a}}else if(h>>>0<L[1311506]>>>0&&U(),f=h+16|0,(L[f>>2]|0)==(t|0)?L[f>>2]=A:L[h+20>>2]=A,0==(A|0))break a;while(0);A>>>0<L[1311506]>>>0&&U();L[C+6]=h;t=L[d+(j+4)];0!=(t|
0)&&(t>>>0<L[1311506]>>>0?U():(L[C+4]=t,L[t+24>>2]=A));t=L[d+(j+5)];0!=(t|0)&&(t>>>0<L[1311506]>>>0?U():(L[C+5]=t,L[t+24>>2]=A))}}while(0);L[u+1]=x|1;L[(x>>2)+u]=x;if((v|0)!=(L[1311507]|0))h=x;else{L[1311504]=x;return}}else L[B>>2]=z&-2,L[u+1]=s|1,h=L[(s>>2)+u]=s;while(0);s=h>>>3;if(256>h>>>0)z=s<<1,B=(z<<2)+5246048|0,A=L[1311502],C=1<<s,0==(A&C|0)?(L[1311502]=A|C,E=B):(s=L[(z+2<<2)+5246048>>2],s>>>0>=L[1311506]>>>0?E=s:U()),L[(z+2<<2)+5246048>>2]=v,L[E+12>>2]=v,L[u+2]=E,L[u+3]=B;else if(B=v,E=h>>>
8,0==(E|0)?d=0:16777215<h>>>0?d=31:(z=(E+1048320|0)>>>16&8,C=E<<z,A=(C+520192|0)>>>16&4,s=C<<A,C=(s+245760|0)>>>16&2,j=14-(A|z|C)+(s<<C>>>15)|0,d=h>>>((j+7|0)>>>0)&1|j<<1),E=(d<<2)+5246312|0,L[u+7]=d,L[u+5]=0,L[u+4]=0,j=L[1311503],C=1<<d,0==(j&C|0))L[1311503]=j|C,L[E>>2]=B,L[u+6]=E,L[u+3]=v,L[u+2]=v;else{d=h<<(31==(d|0)?0:25-(d>>>1)|0);for(j=L[E>>2];(L[j+4>>2]&-8|0)!=(h|0);)if(J=(d>>>31<<2)+j+16|0,E=L[J>>2],0==(E|0)){e=2029;break}else d<<=1,j=E;2029==e?(J>>>0<L[1311506]>>>0&&U(),L[J>>2]=B,L[u+6]=
j,L[u+3]=v,L[u+2]=v):(v=j+8|0,J=L[v>>2],e=L[1311506],j>>>0<e>>>0&&U(),J>>>0<e>>>0&&U(),L[J+12>>2]=B,L[v>>2]=B,L[u+2]=J,L[u+3]=j,L[u+6]=0)}}function xd(c,b){var d,e;d=c+8|0;e=0==(d&7|0)?0:-d&7;d=b-e|0;L[1311508]=c+e|0;L[1311505]=d;L[e+(c+4)>>2]=d|1;L[b+(c+4)>>2]=40;L[1311509]=L[1310724]}
function yd(c,b,d){var e,g,j,k,f,h,n,m,i,l,q,v,u,s,r,p,w,t,y,x,B,z,A,C,E,J;e=b>>2;g=c>>2;j=0;k=c+8|0;f=0==(k&7|0)?0:-k&7;k=b+8|0;h=0==(k&7|0)?0:-k&7;n=h>>2;m=k=b+h|0;i=f+d|0;l=i>>2;i=q=c+i|0;v=k-(c+f)-d|0;L[(f+4>>2)+g]=d|3;if((m|0)==(L[1311508]|0))return d=L[1311505]+v|0,L[1311505]=d,L[1311508]=i,L[l+(g+1)]=d|1,c=c+(f|8)|0;if((m|0)==(L[1311507]|0))return d=L[1311504]+v|0,L[1311504]=d,L[1311507]=i,L[l+(g+1)]=d|1,L[(d>>2)+g+l]=d,c=c+(f|8)|0;d=L[n+(e+1)];if(1==(d&3|0)){u=d&-8;s=d>>>3;a:do if(256>d>>>
0)r=L[((h|8)>>2)+e],p=L[n+(e+3)],w=(s<<3)+5246048|0,(r|0)!=(w|0)&&(r>>>0<L[1311506]>>>0&&U(),(L[r+12>>2]|0)!=(m|0)&&U()),(p|0)==(r|0)?L[1311502]&=1<<s^-1:((p|0)!=(w|0)&&(p>>>0<L[1311506]>>>0&&U(),(L[p+8>>2]|0)!=(m|0)&&U()),L[r+12>>2]=p,L[p+8>>2]=r);else{w=k;t=L[((h|24)>>2)+e];y=L[n+(e+3)];b:do if((y|0)==(w|0)){r=h|16;p=r+(b+4)|0;x=L[p>>2];do if(0==(x|0)){if(B=b+r|0,z=L[B>>2],0==(z|0)){A=0;C=A>>2;break b}}else z=x,B=p;while(0);for(;;){p=z+20|0;if(0==(L[p>>2]|0))if(x=z+16|0,0==(L[x>>2]|0))break;else r=
x;else r=p;z=L[r>>2];B=r}B>>>0<L[1311506]>>>0?U():(L[B>>2]=0,A=z,C=A>>2)}else p=L[((h|8)>>2)+e],p>>>0<L[1311506]>>>0&&U(),x=p+12|0,(L[x>>2]|0)!=(w|0)&&U(),r=y+8|0,(L[r>>2]|0)==(w|0)?(L[x>>2]=y,L[r>>2]=p,A=y,C=A>>2):U();while(0);if(0!=(t|0)){y=h+(b+28)|0;r=(L[y>>2]<<2)+5246312|0;do if((w|0)==(L[r>>2]|0)){if(L[r>>2]=A,0==(A|0)){L[1311503]&=1<<L[y>>2]^-1;break a}}else if(t>>>0<L[1311506]>>>0&&U(),p=t+16|0,(L[p>>2]|0)==(w|0)?L[p>>2]=A:L[t+20>>2]=A,0==(A|0))break a;while(0);A>>>0<L[1311506]>>>0&&U();L[C+
6]=t;w=h|16;y=L[(w>>2)+e];0!=(y|0)&&(y>>>0<L[1311506]>>>0?U():(L[C+4]=y,L[y+24>>2]=A));y=L[(w+4>>2)+e];0!=(y|0)&&(y>>>0<L[1311506]>>>0?U():(L[C+5]=y,L[y+24>>2]=A))}}while(0);d=b+(u|h)|0;b=u+v|0}else d=m,b=v;v=d+4|0;L[v>>2]&=-2;L[l+(g+1)]=b|1;L[(b>>2)+g+l]=b;v=b>>>3;if(256>b>>>0)return d=v<<1,m=(d<<2)+5246048|0,u=L[1311502],h=1<<v,0==(u&h|0)?(L[1311502]=u|h,E=m):(v=L[(d+2<<2)+5246048>>2],v>>>0>=L[1311506]>>>0?E=v:U()),L[(d+2<<2)+5246048>>2]=i,L[E+12>>2]=i,L[l+(g+2)]=E,L[l+(g+3)]=m,c=c+(f|8)|0;m=q;
q=b>>>8;0==(q|0)?h=0:16777215<b>>>0?h=31:(E=(q+1048320|0)>>>16&8,i=q<<E,d=(i+520192|0)>>>16&4,h=i<<d,i=(h+245760|0)>>>16&2,u=14-(d|E|i)+(h<<i>>>15)|0,h=b>>>((u+7|0)>>>0)&1|u<<1);q=(h<<2)+5246312|0;L[l+(g+7)]=h;L[l+(g+5)]=0;L[l+(g+4)]=0;u=L[1311503];i=1<<h;if(0==(u&i|0))return L[1311503]=u|i,L[q>>2]=m,L[l+(g+6)]=q,L[l+(g+3)]=m,L[l+(g+2)]=m,c=c+(f|8)|0;h=b<<(31==(h|0)?0:25-(h>>>1)|0);for(i=L[q>>2];(L[i+4>>2]&-8|0)!=(b|0);)if(J=(h>>>31<<2)+i+16|0,q=L[J>>2],0==(q|0)){j=2143;break}else h<<=1,i=q;if(2143==
j)return J>>>0<L[1311506]>>>0&&U(),L[J>>2]=m,L[l+(g+6)]=i,L[l+(g+3)]=m,L[l+(g+2)]=m,c=c+(f|8)|0;J=i+8|0;j=L[J>>2];h=L[1311506];i>>>0<h>>>0&&U();j>>>0<h>>>0&&U();L[j+12>>2]=m;L[J>>2]=m;L[l+(g+2)]=j;L[l+(g+3)]=i;L[l+(g+6)]=0;return c=c+(f|8)|0}function qc(){return 5244744}function rc(){return 5245544}function oc(){}function sc(c){0!=(c|0)&&X(c)}function nc(c){0!=(c|0)&&X(c)}function uc(){}var ac=F;
Module.C=function(c){function b(){for(var b=0;3>b;b++)e.push(0)}var d=c.length+1,e=[Q(eb("/bin/this.program"),"i8",$a)];b();for(var g=0;g<d-1;g+=1)e.push(Q(eb(c[g]),"i8",$a)),b();e.push(0);e=Q(e,"i32",$a);return Module._main(d,e,0)};
function ub(c){function b(){var b=0;pb=D;Module._main&&(gb(jb),b=Module.C(c),Module.noExitRuntime||gb(kb));if(Module.postRun)for("function"==typeof Module.postRun&&(Module.postRun=[Module.postRun]);0<Module.postRun.length;)Module.postRun.pop()();return b}c=c||Module.arguments;if(0<nb)return Module.c("run() called, but dependencies remain, so not running"),0;if(Module.preRun){"function"==typeof Module.preRun&&(Module.preRun=[Module.preRun]);var d=Module.preRun;Module.preRun=[];for(var e=d.length-1;0<=
e;e--)d[e]();if(0<nb)return 0}return Module.setStatus?(Module.setStatus("Running..."),setTimeout(function(){setTimeout(function(){Module.setStatus("")},1);b()},1),0):b()}Module.run=Module.O=ub;if(Module.preInit)for("function"==typeof Module.preInit&&(Module.preInit=[Module.preInit]);0<Module.preInit.length;)Module.preInit.pop()();gb(hb);var tb=D;Module.noInitialRun&&(tb=G);tb&&ub();function Bd(c,b){b=b||{};this.input=c;this.g="number"===typeof b.iterations?b.iterations:15}Bd.prototype.f=function(){var c=this.input,b,d,e=R(8),g;try{Ta(rd,a,["number","array","number","number"],[e,c,c.length,this.g]),b=L[e>>2],d=L[e+4>>2],g=new Uint8Array(I.subarray(b,b+d))}finally{qd(e)}return g};ha("Zopfli.RawDeflate",Bd);ha("Zopfli.RawDeflate.prototype.compress",Bd.prototype.f);function Cd(c,b){b=b||{};this.input=c;this.g="number"===typeof b.iterations?b.iterations:15}Cd.prototype.f=function(){var c=this.input,b,d,e=R(8),g;try{Ta(sd,a,["number","array","number","number"],[e,c,c.length,this.g]),b=L[e>>2],d=L[e+4>>2],g=new Uint8Array(I.subarray(b,b+d))}finally{qd(e)}return g};ha("Zopfli.Deflate",Cd);ha("Zopfli.Deflate.prototype.compress",Cd.prototype.f);function Dd(c,b){b=b||{};this.input=c;this.g="number"===typeof b.iterations?b.iterations:15}Dd.prototype.f=function(){var c=this.input,b,d,e=R(8),g;try{Ta(td,a,["number","array","number","number"],[e,c,c.length,this.g]),b=L[e>>2],d=L[e+4>>2],g=new Uint8Array(I.subarray(b,b+d))}finally{qd(e)}return g};ha("Zopfli.Gzip",Dd);ha("Zopfli.Gzip.prototype.compress",Dd.prototype.f);}).call(this);


/***/ }),

/***/ "./src/index.html":
/*!************************!*\
  !*** ./src/index.html ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "index.html";

/***/ }),

/***/ "?1172":
/*!************************!*\
  !*** stream (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?84b8":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?ec5a":
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jszip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jszip */ "./node_modules/jszip/lib/index.js");


{
	document.documentElement.addEventListener('dragover', (e) => {
		const droppableOkay = ([...e.dataTransfer.items]
			.some(item => item.kind === 'file')
		);
		if (droppableOkay) {
			// Show our interest in the data dragged over
			e.preventDefault();
		}
	
		document.documentElement.classList.toggle('droppable-nope', !droppableOkay);
		document.documentElement.classList.toggle('droppable-okay', droppableOkay);
	});

	const resetClasses = () => {
		document.documentElement.classList.remove('droppable-nope');
		document.documentElement.classList.remove('droppable-okay');
	}
	
	document.documentElement.addEventListener('dragend', resetClasses);
	document.documentElement.addEventListener('dragleave', resetClasses);
	document.documentElement.addEventListener('drop', resetClasses);
}


document.documentElement.addEventListener('drop', async (e) => {
	const files = (Array.from(e.dataTransfer.items, item => item.getAsFile())
		.filter(Boolean)
	);
	if (files.length === 0) {
		throw new Error('No files dropped');
	}
	e.preventDefault();
	console.log(files);
	const zipArchive = await createZip(files);
	console.log(zipArchive);
	downloadFile(zipArchive);
});


/**
 * @param {ReadonlyArray<File>} files
 */
async function createZip(files) {
	const zip = new jszip__WEBPACK_IMPORTED_MODULE_0__();
	for (const file of files) {
		zip.file(file.name, file, { compression: "DEFLATE" });
	}
	return zip.generateAsync({ type: 'blob' });
}

/**
 * @param {Blob} blob 
 * @param {string} [filename]
 */
function downloadFile(blob, filename) {
	filename ||= `${new Date().toISOString()}.zip`;
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = filename;
	a.click();
}

/***/ }),

/***/ "./src/zopfli-pako-adapter.js":
/*!************************************!*\
  !*** ./src/zopfli-pako-adapter.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Deflate": () => (/* binding */ PakoLikeDeflate)
/* harmony export */ });
/* harmony import */ var zopfli_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zopfli.js */ "./node_modules/zopfli.js/bin/zopfli.min.js");
// Expose zopfli.js API using pako interface
// so webpack alias can do its dirty work



class PakoLikeDeflate {
	constructor() {
		console.log('Using zopfli instead of pako');
		this._chunks = [];
	}
	push(chunk, final=false) {
		if (chunk.length > 0) {
			// zopfli.js doesn't work with streaming
			// we have to collect them until the final flag is set
			this._chunks.push(chunk);
		}
		if (!final) {
			return;
		}
		const merged = mergeChunks(this._chunks.splice(0));
		const zopfli = new zopfli_js__WEBPACK_IMPORTED_MODULE_0__.Zopfli.RawDeflate(
			merged,
			{ iterations: 15 }
		);
		const compressed = zopfli.compress();
		if (this.onData) {
			this.onData(compressed);
		}
		return compressed;
	}
}

/**
 * @param {ReadonlyArray<Uint8Array>} uias 
 * @returns {Uint8Array}
 */
function mergeChunks(chunks) {
	// How much memory to allocate
	let totalLength = 0;
	for (const chunk of chunks) {
		totalLength += chunk.byteLength;
	}
	const rv = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		rv.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return rv;
}





/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("./src/main.js");
/******/ 	// This entry module doesn't tell about it's top-level declarations so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.html");
/******/ 	
/******/ })()
;