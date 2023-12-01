"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};

const jsonHeader = { "Content-Type": "application/json" };
function isArray(value) {
    return !!value && value.constructor === Array;
}
function isObject(value) {
    return !!value && value.constructor === Object;
}
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["GET"] = "GET";
    RequestMethod["POST"] = "POST";
    RequestMethod["PATCH"] = "PATCH";
    RequestMethod["PUT"] = "PUT";
    RequestMethod["DELETE"] = "DELETE";
})(RequestMethod || (RequestMethod = {}));
class Http {
    static objectToQueryString(object) {
        const reducer = (obj, parentPrefix = null) => (prev, key) => {
            const val = obj[key];
            key = encodeURIComponent(key);
            const prefix = parentPrefix ? `${parentPrefix}[${key}]` : key;
            if (val == null || typeof val === "function") {
                prev.push(`${prefix}=`);
                return prev;
            }
            if (["number", "boolean", "string"].includes(typeof val)) {
                prev.push(`${prefix}=${encodeURIComponent(val)}`);
                return prev;
            }
            prev.push(Object.keys(val).reduce(reducer(val, prefix), []).join("&"));
            return prev;
        };
        return object != undefined && object != null && object != ""
            ? Object.keys(object).reduce(reducer(object), []).join("&")
            : "";
    }
    static searchParamsToObject(value) {
        const groupParamsByKey = (params) => [...params.entries()].reduce((acc, tuple) => {
            // getting the key and value from each tuple
            const [key, val] = tuple;
            if (acc.hasOwnProperty(key)) {
                // if the current key is already an array, we'll add the value to it
                if (Array.isArray(acc[key])) {
                    acc[key] = [...acc[key], val];
                }
                else {
                    // if it's not an array, but contains a value, we'll convert it into an array
                    // and add the current value to it
                    acc[key] = [acc[key], val];
                }
            }
            else {
                // plain assignment if no special case is present
                acc[key] = val;
            }
            return acc;
        }, {});
        return groupParamsByKey(new URLSearchParams(value));
    }
    static buildUrl(url, params) {
        const value = `${url}${Http.objectToQueryString(params)
            ? `?${Http.objectToQueryString(params)}`
            : ""}`;
        // console.log(value)
        return value;
    }
    static prepareOptions(options) {
        const _a = (options === null || options === void 0 ? void 0 : options.config) || {}, { headers } = _a, requestConfig = __rest(_a, ["headers"]);
        const isJson = isArray(options === null || options === void 0 ? void 0 : options.body) || isObject(options === null || options === void 0 ? void 0 : options.body);
        const requestBody = isJson ? JSON.stringify(options === null || options === void 0 ? void 0 : options.body) : options === null || options === void 0 ? void 0 : options.body;
        const init = Object.assign(Object.assign(Object.assign({}, requestConfig), { body: requestBody }), (isJson
            ? {
                headers: Object.assign(Object.assign({}, headers), jsonHeader),
            }
            : {
                headers: Object.assign({}, headers),
            }));
        return init;
    }
    static http(url, params, config, extraParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 10000);
                const request = new Request(this.buildUrl(url, params), Object.assign({ keepalive: true, signal: (extraParams === null || extraParams === void 0 ? void 0 : extraParams.withAbort) ? controller.signal : undefined }, config));
                let startTime;
                let endTime;
                let timeDiff;
                if (extraParams === null || extraParams === void 0 ? void 0 : extraParams.withBench) {
                    startTime = performance.now();
                }
                const response = yield fetch(request);
                if (extraParams === null || extraParams === void 0 ? void 0 : extraParams.withBench) {
                    endTime = performance.now();
                    timeDiff = (endTime - startTime) / 1000;
                    console.log(this.buildUrl(url, params) + " => " + `${timeDiff.toFixed(2)}s`);
                }
                clearTimeout(timeout);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static get(url, options) {
        const _a = (options === null || options === void 0 ? void 0 : options.config) || {}, { headers } = _a, requestConfig = __rest(_a, ["headers"]);
        const init = Object.assign(Object.assign({}, requestConfig), { method: RequestMethod.GET, headers: Object.assign({}, headers) });
        return this.http(url, options === null || options === void 0 ? void 0 : options.params, init);
    }
    static post(url, options) {
        const requestOptions = Http.prepareOptions(options || {});
        return this.http(url, options === null || options === void 0 ? void 0 : options.params, Object.assign(Object.assign({}, requestOptions), { method: RequestMethod.POST }));
    }
    static patch(url, options) {
        const requestOptions = Http.prepareOptions(options || {});
        return this.http(url, options === null || options === void 0 ? void 0 : options.params, Object.assign(Object.assign({}, requestOptions), { method: RequestMethod.PATCH }));
    }
    static put(url, options) {
        const requestOptions = Http.prepareOptions(options || {});
        return this.http(url, options === null || options === void 0 ? void 0 : options.params, Object.assign(Object.assign({}, requestOptions), { method: RequestMethod.PUT }));
    }
    static delete(url, options) {
        const requestOptions = Http.prepareOptions(options || {});
        return this.http(url, options === null || options === void 0 ? void 0 : options.params, Object.assign(Object.assign({}, requestOptions), { method: RequestMethod.DELETE }));
    }
}
export default Http;
