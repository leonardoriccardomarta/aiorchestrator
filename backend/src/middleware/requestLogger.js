"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
var logger_1 = require("../config/logger");
var requestLogger = function (req, res, next) {
    var start = Date.now();
    // Log request
    logger_1.logger.info("".concat(req.method, " ").concat(req.path), {
        method: req.method,
        path: req.path,
        query: req.query,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    // Override res.end to log response
    var originalEnd = res.end;
    res.end = function (chunk, encoding) {
        var duration = Date.now() - start;
        logger_1.logger.info("".concat(req.method, " ").concat(req.path, " - ").concat(res.statusCode), {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: "".concat(duration, "ms"),
            ip: req.ip,
        });
        // Call original end method
        return originalEnd.call(this, chunk, encoding);
    };
    next();
};
exports.requestLogger = requestLogger;
