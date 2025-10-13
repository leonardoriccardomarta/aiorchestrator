"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganStream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
var index_1 = require("./index");
// Define log levels
var levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
// Define colors for each level
var colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
// Tell winston that you want to link the colors
winston_1.default.addColors(colors);
// Define which transports the logger must use
var transports = [
    // Console transport
    new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(function (info) { return "".concat(info['timestamp'], " ").concat(info.level, ": ").concat(info.message); })),
    }),
];
// Create the logger
exports.logger = winston_1.default.createLogger({
    level: index_1.config?.LOG_LEVEL || 'info',
    levels: levels,
    transports: transports,
    exitOnError: false,
});
// Create a stream object with a 'write' function that will be used by Morgan
exports.morganStream = {
    write: function (message) {
        exports.logger.http(message.trim());
    },
};
exports.default = exports.logger;
