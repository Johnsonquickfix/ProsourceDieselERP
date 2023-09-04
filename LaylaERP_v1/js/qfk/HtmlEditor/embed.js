var unlayer;
!function () {
    var e = {
        9051: function (e, t) {
            var r, i;
            void 0 === (i = "function" == typeof (r = function () {
                var e = /^v?(?:\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+))?(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;
                function t(e) {
                    var t, r, i = e.replace(/^v/, "").replace(/\+.*$/, ""), n = (r = "-",
                        -1 === (t = i).indexOf(r) ? t.length : t.indexOf(r)), a = i.substring(0, n).split(".");
                    return a.push(i.substring(n + 1)),
                        a
                }
                function r(e) {
                    return isNaN(Number(e)) ? e : Number(e)
                }
                function i(t) {
                    if ("string" != typeof t)
                        throw new TypeError("Invalid argument expected string");
                    if (!e.test(t))
                        throw new Error("Invalid argument not valid semver ('" + t + "' received)")
                }
                function n(e, n) {
                    [e, n].forEach(i);
                    for (var a = t(e), s = t(n), o = 0; o < Math.max(a.length - 1, s.length - 1); o++) {
                        var l = parseInt(a[o] || 0, 10)
                            , u = parseInt(s[o] || 0, 10);
                        if (l > u)
                            return 1;
                        if (u > l)
                            return -1
                    }
                    var c = a[a.length - 1]
                        , h = s[s.length - 1];
                    if (c && h) {
                        var f = c.split(".").map(r)
                            , d = h.split(".").map(r);
                        for (o = 0; o < Math.max(f.length, d.length); o++) {
                            if (void 0 === f[o] || "string" == typeof d[o] && "number" == typeof f[o])
                                return -1;
                            if (void 0 === d[o] || "string" == typeof f[o] && "number" == typeof d[o])
                                return 1;
                            if (f[o] > d[o])
                                return 1;
                            if (d[o] > f[o])
                                return -1
                        }
                    } else if (c || h)
                        return c ? -1 : 1;
                    return 0
                }
                var a = [">", ">=", "=", "<", "<="]
                    , s = {
                        ">": [1],
                        ">=": [0, 1],
                        "=": [0],
                        "<=": [-1, 0],
                        "<": [-1]
                    };
                return n.validate = function (t) {
                    return "string" == typeof t && e.test(t)
                }
                    ,
                    n.compare = function (e, t, r) {
                        !function (e) {
                            if ("string" != typeof e)
                                throw new TypeError("Invalid operator type, expected string but got " + typeof e);
                            if (-1 === a.indexOf(e))
                                throw new TypeError("Invalid operator, expected one of " + a.join("|"))
                        }(r);
                        var i = n(e, t);
                        return s[r].indexOf(i) > -1
                    }
                    ,
                    n
            }
            ) ? r.apply(t, []) : r) || (e.exports = i)
        }
    }
        , t = {};
    function r(i) {
        var n = t[i];
        if (void 0 !== n)
            return n.exports;
        var a = t[i] = {
            exports: {}
        };
        return e[i].call(a.exports, a, a.exports, r),
            a.exports
    }
    r.d = function (e, t) {
        for (var i in t)
            r.o(t, i) && !r.o(e, i) && Object.defineProperty(e, i, {
                enumerable: !0,
                get: t[i]
            })
    }
        ,
        r.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }
        ,
        r.p = "/";
    var i, n, a = {};
    Window.prototype.forceJURL = !1,
        function (e) {
            "use strict";
            var t = !1;
            if (!e.forceJURL)
                try {
                    var r = new URL("b", "http://a");
                    r.pathname = "c%20d",
                        t = "http://a/c%20d" === r.href
                } catch (e) { }
            if (!t) {
                var i = Object.create(null);
                i.ftp = 21,
                    i.file = 0,
                    i.gopher = 70,
                    i.http = 80,
                    i.https = 443,
                    i.ws = 80,
                    i.wss = 443;
                var n = Object.create(null);
                n["%2e"] = ".",
                    n[".%2e"] = "..",
                    n["%2e."] = "..",
                    n["%2e%2e"] = "..";
                var a = void 0
                    , s = /[a-zA-Z]/
                    , o = /[a-zA-Z0-9\+\-\.]/;
                y.prototype = {
                    toString: function () {
                        return this.href
                    },
                    get href() {
                        if (this._isInvalid)
                            return this._url;
                        var e = "";
                        return "" == this._username && null == this._password || (e = this._username + (null != this._password ? ":" + this._password : "") + "@"),
                            this.protocol + (this._isRelative ? "//" + e + this.host : "") + this.pathname + this._query + this._fragment
                    },
                    set href(e) {
                        p.call(this),
                            v.call(this, e)
                    },
                    get protocol() {
                        return this._scheme + ":"
                    },
                    set protocol(e) {
                        this._isInvalid || v.call(this, e + ":", "scheme start")
                    },
                    get host() {
                        return this._isInvalid ? "" : this._port ? this._host + ":" + this._port : this._host
                    },
                    set host(e) {
                        !this._isInvalid && this._isRelative && v.call(this, e, "host")
                    },
                    get hostname() {
                        return this._host
                    },
                    set hostname(e) {
                        !this._isInvalid && this._isRelative && v.call(this, e, "hostname")
                    },
                    get port() {
                        return this._port
                    },
                    set port(e) {
                        !this._isInvalid && this._isRelative && v.call(this, e, "port")
                    },
                    get pathname() {
                        return this._isInvalid ? "" : this._isRelative ? "/" + this._path.join("/") : this._schemeData
                    },
                    set pathname(e) {
                        !this._isInvalid && this._isRelative && (this._path = [],
                            v.call(this, e, "relative path start"))
                    },
                    get search() {
                        return this._isInvalid || !this._query || "?" == this._query ? "" : this._query
                    },
                    set search(e) {
                        !this._isInvalid && this._isRelative && (this._query = "?",
                            "?" == e[0] && (e = e.slice(1)),
                            v.call(this, e, "query"))
                    },
                    get hash() {
                        return this._isInvalid || !this._fragment || "#" == this._fragment ? "" : this._fragment
                    },
                    set hash(e) {
                        this._isInvalid || (e ? (this._fragment = "#",
                            "#" == e[0] && (e = e.slice(1)),
                            v.call(this, e, "fragment")) : this._fragment = "")
                    },
                    get origin() {
                        var e;
                        if (this._isInvalid || !this._scheme)
                            return "";
                        switch (this._scheme) {
                            case "data":
                            case "file":
                            case "javascript":
                            case "mailto":
                                return "null"
                        }
                        return (e = this.host) ? this._scheme + "://" + e : ""
                    }
                };
                var l = e.URL;
                l && (y.createObjectURL = function (e) {
                    return l.createObjectURL.apply(l, arguments)
                }
                    ,
                    y.revokeObjectURL = function (e) {
                        l.revokeObjectURL(e)
                    }
                ),
                    e.URL = y
            }
            function u(e) {
                return void 0 !== i[e]
            }
            function c() {
                p.call(this),
                    this._isInvalid = !0
            }
            function h(e) {
                return "" == e && c.call(this),
                    e.toLowerCase()
            }
            function f(e) {
                var t = e.charCodeAt(0);
                return t > 32 && t < 127 && -1 == [34, 35, 60, 62, 63, 96].indexOf(t) ? e : encodeURIComponent(e)
            }
            function d(e) {
                var t = e.charCodeAt(0);
                return t > 32 && t < 127 && -1 == [34, 35, 60, 62, 96].indexOf(t) ? e : encodeURIComponent(e)
            }
            function v(e, t, r) {
                function l(e) {
                    _.push(e)
                }
                var v = t || "scheme start"
                    , p = 0
                    , y = ""
                    , m = !1
                    , g = !1
                    , _ = [];
                e: for (; (e[p - 1] != a || 0 == p) && !this._isInvalid;) {
                    var b = e[p];
                    switch (v) {
                        case "scheme start":
                            if (!b || !s.test(b)) {
                                if (t) {
                                    l("Invalid scheme.");
                                    break e
                                }
                                y = "",
                                    v = "no scheme";
                                continue
                            }
                            y += b.toLowerCase(),
                                v = "scheme";
                            break;
                        case "scheme":
                            if (b && o.test(b))
                                y += b.toLowerCase();
                            else {
                                if (":" != b) {
                                    if (t) {
                                        if (a == b)
                                            break e;
                                        l("Code point not allowed in scheme: " + b);
                                        break e
                                    }
                                    y = "",
                                        p = 0,
                                        v = "no scheme";
                                    continue
                                }
                                if (this._scheme = y,
                                    y = "",
                                    t)
                                    break e;
                                u(this._scheme) && (this._isRelative = !0),
                                    v = "file" == this._scheme ? "relative" : this._isRelative && r && r._scheme == this._scheme ? "relative or authority" : this._isRelative ? "authority first slash" : "scheme data"
                            }
                            break;
                        case "scheme data":
                            "?" == b ? (this._query = "?",
                                v = "query") : "#" == b ? (this._fragment = "#",
                                    v = "fragment") : a != b && "\t" != b && "\n" != b && "\r" != b && (this._schemeData += f(b));
                            break;
                        case "no scheme":
                            if (r && u(r._scheme)) {
                                v = "relative";
                                continue
                            }
                            l("Missing scheme."),
                                c.call(this);
                            break;
                        case "relative or authority":
                            if ("/" != b || "/" != e[p + 1]) {
                                l("Expected /, got: " + b),
                                    v = "relative";
                                continue
                            }
                            v = "authority ignore slashes";
                            break;
                        case "relative":
                            if (this._isRelative = !0,
                                "file" != this._scheme && (this._scheme = r._scheme),
                                a == b) {
                                this._host = r._host,
                                    this._port = r._port,
                                    this._path = r._path.slice(),
                                    this._query = r._query,
                                    this._username = r._username,
                                    this._password = r._password;
                                break e
                            }
                            if ("/" == b || "\\" == b)
                                "\\" == b && l("\\ is an invalid code point."),
                                    v = "relative slash";
                            else if ("?" == b)
                                this._host = r._host,
                                    this._port = r._port,
                                    this._path = r._path.slice(),
                                    this._query = "?",
                                    this._username = r._username,
                                    this._password = r._password,
                                    v = "query";
                            else {
                                if ("#" != b) {
                                    var w = e[p + 1]
                                        , k = e[p + 2];
                                    ("file" != this._scheme || !s.test(b) || ":" != w && "|" != w || a != k && "/" != k && "\\" != k && "?" != k && "#" != k) && (this._host = r._host,
                                        this._port = r._port,
                                        this._username = r._username,
                                        this._password = r._password,
                                        this._path = r._path.slice(),
                                        this._path.pop()),
                                        v = "relative path";
                                    continue
                                }
                                this._host = r._host,
                                    this._port = r._port,
                                    this._path = r._path.slice(),
                                    this._query = r._query,
                                    this._fragment = "#",
                                    this._username = r._username,
                                    this._password = r._password,
                                    v = "fragment"
                            }
                            break;
                        case "relative slash":
                            if ("/" != b && "\\" != b) {
                                "file" != this._scheme && (this._host = r._host,
                                    this._port = r._port,
                                    this._username = r._username,
                                    this._password = r._password),
                                    v = "relative path";
                                continue
                            }
                            "\\" == b && l("\\ is an invalid code point."),
                                v = "file" == this._scheme ? "file host" : "authority ignore slashes";
                            break;
                        case "authority first slash":
                            if ("/" != b) {
                                l("Expected '/', got: " + b),
                                    v = "authority ignore slashes";
                                continue
                            }
                            v = "authority second slash";
                            break;
                        case "authority second slash":
                            if (v = "authority ignore slashes",
                                "/" != b) {
                                l("Expected '/', got: " + b);
                                continue
                            }
                            break;
                        case "authority ignore slashes":
                            if ("/" != b && "\\" != b) {
                                v = "authority";
                                continue
                            }
                            l("Expected authority, got: " + b);
                            break;
                        case "authority":
                            if ("@" == b) {
                                m && (l("@ already seen."),
                                    y += "%40"),
                                    m = !0;
                                for (var M = 0; M < y.length; M++) {
                                    var I = y[M];
                                    if ("\t" != I && "\n" != I && "\r" != I)
                                        if (":" != I || null !== this._password) {
                                            var T = f(I);
                                            null !== this._password ? this._password += T : this._username += T
                                        } else
                                            this._password = "";
                                    else
                                        l("Invalid whitespace in authority.")
                                }
                                y = ""
                            } else {
                                if (a == b || "/" == b || "\\" == b || "?" == b || "#" == b) {
                                    p -= y.length,
                                        y = "",
                                        v = "host";
                                    continue
                                }
                                y += b
                            }
                            break;
                        case "file host":
                            if (a == b || "/" == b || "\\" == b || "?" == b || "#" == b) {
                                2 != y.length || !s.test(y[0]) || ":" != y[1] && "|" != y[1] ? (0 == y.length || (this._host = h.call(this, y),
                                    y = ""),
                                    v = "relative path start") : v = "relative path";
                                continue
                            }
                            "\t" == b || "\n" == b || "\r" == b ? l("Invalid whitespace in file host.") : y += b;
                            break;
                        case "host":
                        case "hostname":
                            if (":" != b || g) {
                                if (a == b || "/" == b || "\\" == b || "?" == b || "#" == b) {
                                    if (this._host = h.call(this, y),
                                        y = "",
                                        v = "relative path start",
                                        t)
                                        break e;
                                    continue
                                }
                                "\t" != b && "\n" != b && "\r" != b ? ("[" == b ? g = !0 : "]" == b && (g = !1),
                                    y += b) : l("Invalid code point in host/hostname: " + b)
                            } else if (this._host = h.call(this, y),
                                y = "",
                                v = "port",
                                "hostname" == t)
                                break e;
                            break;
                        case "port":
                            if (/[0-9]/.test(b))
                                y += b;
                            else {
                                if (a == b || "/" == b || "\\" == b || "?" == b || "#" == b || t) {
                                    if ("" != y) {
                                        var j = parseInt(y, 10);
                                        j != i[this._scheme] && (this._port = j + ""),
                                            y = ""
                                    }
                                    if (t)
                                        break e;
                                    v = "relative path start";
                                    continue
                                }
                                "\t" == b || "\n" == b || "\r" == b ? l("Invalid code point in port: " + b) : c.call(this)
                            }
                            break;
                        case "relative path start":
                            if ("\\" == b && l("'\\' not allowed in path."),
                                v = "relative path",
                                "/" != b && "\\" != b)
                                continue;
                            break;
                        case "relative path":
                            var S;
                            a != b && "/" != b && "\\" != b && (t || "?" != b && "#" != b) ? "\t" != b && "\n" != b && "\r" != b && (y += f(b)) : ("\\" == b && l("\\ not allowed in relative path."),
                                (S = n[y.toLowerCase()]) && (y = S),
                                ".." == y ? (this._path.pop(),
                                    "/" != b && "\\" != b && this._path.push("")) : "." == y && "/" != b && "\\" != b ? this._path.push("") : "." != y && ("file" == this._scheme && 0 == this._path.length && 2 == y.length && s.test(y[0]) && "|" == y[1] && (y = y[0] + ":"),
                                        this._path.push(y)),
                                y = "",
                                "?" == b ? (this._query = "?",
                                    v = "query") : "#" == b && (this._fragment = "#",
                                        v = "fragment"));
                            break;
                        case "query":
                            t || "#" != b ? a != b && "\t" != b && "\n" != b && "\r" != b && (this._query += d(b)) : (this._fragment = "#",
                                v = "fragment");
                            break;
                        case "fragment":
                            a != b && "\t" != b && "\n" != b && "\r" != b && (this._fragment += b)
                    }
                    p++
                }
            }
            function p() {
                this._scheme = "",
                    this._schemeData = "",
                    this._username = "",
                    this._password = null,
                    this._host = "",
                    this._port = "",
                    this._path = [],
                    this._query = "",
                    this._fragment = "",
                    this._isInvalid = !1,
                    this._isRelative = !1
            }
            function y(e, t) {
                void 0 === t || t instanceof y || (t = new y(String(t))),
                    this._url = "" + e,
                    p.call(this);
                var r = this._url.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, "");
                v.call(this, r, null, t)
            }
        }(window),
        function (e) {
            var t = "currentScript"
                , r = e.getElementsByTagName("script");
            t in e || Object.defineProperty(e, t, {
                get: function () {
                    try {
                        throw new Error
                    } catch (i) {
                        var e, t = (/.*at [^\(]*\((.*):.+:.+\)$/gi.exec(i.stack) || [!1])[1];
                        for (e in r)
                            if (r[e].src == t || "interactive" == r[e].readyState)
                                return r[e];
                        return null
                    }
                }
            })
        }(document),
        n = (i = new URL(document.currentScript.src)).href.substring(0, i.href.lastIndexOf("/") + 1),
        r.p = n,
        function () {
            "use strict";
            function e(e, r) {
                return function (e) {
                    if (Array.isArray(e))
                        return e
                }(e) || function (e, t) {
                    var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                    if (null != r) {
                        var i, n, a = [], s = !0, o = !1;
                        try {
                            for (r = r.call(e); !(s = (i = r.next()).done) && (a.push(i.value),
                                !t || a.length !== t); s = !0)
                                ;
                        } catch (e) {
                            o = !0,
                                n = e
                        } finally {
                            try {
                                s || null == r.return || r.return()
                            } finally {
                                if (o)
                                    throw n
                            }
                        }
                        return a
                    }
                }(e, r) || function (e, r) {
                    if (e) {
                        if ("string" == typeof e)
                            return t(e, r);
                        var i = Object.prototype.toString.call(e).slice(8, -1);
                        return "Object" === i && e.constructor && (i = e.constructor.name),
                            "Map" === i || "Set" === i ? Array.from(e) : "Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? t(e, r) : void 0
                    }
                }(e, r) || function () {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }()
            }
            function t(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var r = 0, i = new Array(t); r < t; r++)
                    i[r] = e[r];
                return i
            }
            function i(e) {
                return i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                }
                    : function (e) {
                        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                    }
                    ,
                    i(e)
            }
            function n(t, r) {
                var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
                    , s = a._path
                    , o = void 0 === s ? [] : s
                    , l = []
                    , u = "function" == typeof r ? r : function (e) {
                        return e === r
                    }
                    ;
                u(t) && l.push(o);
                try {
                    (Array.isArray(t) || t && "object" === i(t)) && Object.entries(t).forEach((function (t) {
                        var r = e(t, 2)
                            , i = r[0];
                        n(r[1], u, {
                            _path: o.concat(i)
                        }).forEach((function (e) {
                            return l.push(e)
                        }
                        ))
                    }
                    ))
                } catch (e) {
                    console.error(e)
                }
                return l
            }
            var s;
            function o(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var i = t[r];
                    i.enumerable = i.enumerable || !1,
                        i.configurable = !0,
                        "value" in i && (i.writable = !0),
                        Object.defineProperty(e, i.key, i)
                }
            }
            function l(e, t, r) {
                return t in e ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = r,
                    e
            }
            r.d(a, {
                default: function () {
                    return O
                }
            }),
                window.__unlayer_lastFrameId = window.__unlayer_lastFrameId || 0,
                window.__unlayer_multipleEditors = null === (s = window.__unlayer_multipleEditors) || void 0 === s || s;
            var u = {}
                , c = function () {
                    function e(t) {
                        var r = this;
                        !function (e, t) {
                            if (!(e instanceof t))
                                throw new TypeError("Cannot call a class as a function")
                        }(this, e),
                            l(this, "id", void 0),
                            l(this, "ready", void 0),
                            l(this, "iframe", void 0),
                            l(this, "messages", void 0),
                            l(this, "callbackId", void 0),
                            l(this, "callbacks", void 0),
                            l(this, "destroy", (function () {
                                var e;
                                window.removeEventListener("message", r.onWindowMessage, !1),
                                    null === (e = r.iframe) || void 0 === e || e.remove(),
                                    delete r.iframe
                            }
                            )),
                            l(this, "onWindowMessage", (function (e) {
                                var t, i, n;
                                if ((null == e ? void 0 : e.source) === (null === (t = r.iframe) || void 0 === t ? void 0 : t.contentWindow))
                                    if ("unlayer:destroy" !== (null == e || null === (i = e.data) || void 0 === i ? void 0 : i.action)) {
                                        var a, s = window.__unlayer_multipleEditors ? null == e || null === (n = e.data) || void 0 === n ? void 0 : n.frameId : 1;
                                        s && (null === (a = u[s]) || void 0 === a || a.receiveMessage(e))
                                    } else
                                        r.destroy()
                            }
                            )),
                            this.id = ++window.__unlayer_lastFrameId,
                            u[this.id] = this,
                            this.ready = !1,
                            this.iframe = this.createIframe(t),
                            this.messages = [],
                            this.iframe.onload = function () {
                                r.ready = !0,
                                    r.flushMessages()
                            }
                            ,
                            this.callbackId = 0,
                            this.callbacks = {},
                            window.removeEventListener("message", this.onWindowMessage, !1),
                            window.addEventListener("message", this.onWindowMessage, !1)
                    }
                    var t, r;
                    return t = e,
                        r = [{
                            key: "createIframe",
                            value: function (e) {
                                var t = document.createElement("iframe");
                                return t.src = e,
                                    t.frameBorder = "0",
                                    t.width = "100%",
                                    t.height = "100%",
                                    t.style.minWidth = "1024px",
                                    t.style.minHeight = "100%",
                                    t.style.height = "100%",
                                    t.style.width = "100%",
                                    t.style.border = "0px",
                                    t
                            }
                        }, {
                            key: "appendTo",
                            value: function (e) {
                                this.iframe && e.appendChild(this.iframe)
                            }
                        }, {
                            key: "postMessage",
                            value: function (e, t) {
                                this.scheduleMessage(Object.assign({
                                    action: e
                                }, t)),
                                    this.flushMessages()
                            }
                        }, {
                            key: "withMessage",
                            value: function (e, t, r) {
                                var i = this.callbackId++;
                                this.callbacks[i] = r,
                                    this.postMessage(e, Object.assign({
                                        frameId: this.id,
                                        callbackId: i
                                    }, t))
                            }
                        }, {
                            key: "preprocessMessage",
                            value: function (e) {
                                var t = this
                                    , r = Object.assign({}, e, {
                                        __unlayer_functions_map: Object.assign({}, null == e ? void 0 : e.__unlayer_functions_map, {})
                                    });
                                return n(e, (function (e) {
                                    return "function" == typeof e
                                }
                                )).forEach((function (i) {
                                    var n;
                                    try {
                                        n = i.reduce((function (e, t) {
                                            return e[t]
                                        }
                                        ), e),
                                            i.slice(0, -1).reduce((function (e, t) {
                                                return e[t]
                                            }
                                            ), e)[i.slice(-1)[0]] = null
                                    } catch (e) {
                                        console.error(e)
                                    }
                                    var a = t.callbackId++
                                        , s = t.id;
                                    t.callbacks[a] = n,
                                        r.__unlayer_functions_map[i.join(".")] = {
                                            frameId: s,
                                            callbackId: a
                                        }
                                }
                                )),
                                    r
                            }
                        }, {
                            key: "scheduleMessage",
                            value: function (e) {
                                var t = this.preprocessMessage(e);
                                this.messages.push(t)
                            }
                        }, {
                            key: "flushMessages",
                            value: function () {
                                var e = this;
                                this.ready && (this.messages.forEach((function (t) {
                                    e.iframe && e.iframe.contentWindow && e.iframe.contentWindow.postMessage(t, "*")
                                }
                                )),
                                    this.messages = [])
                            }
                        }, {
                            key: "handleMessage",
                            value: function (e) {
                                var t = e.action
                                    , r = e.callbackId
                                    , i = e.doneId
                                    , n = e.result
                                    , a = e.resultArgs
                                    , s = Array.isArray(a) ? a : [n]
                                    , o = null != n ? n : s[0]
                                    , l = this.callbacks[r];
                                switch (t) {
                                    case "response":
                                        l && (l(o),
                                            delete this.callbacks[r]);
                                        break;
                                    case "callback":
                                        var u;
                                        if (null != s && null !== (u = s[0]) && void 0 !== u && u.attachments && (s[0].attachments = s[0].attachments.map((function (e) {
                                            return new File([e.content], e.name, {
                                                type: e.type
                                            })
                                        }
                                        ))),
                                            l) {
                                            var c = this;
                                            l.apply(null, s.concat((function () {
                                                c.postMessage("done", {
                                                    doneId: i,
                                                    resultArgs: Array.from(arguments),
                                                    result: Array.from(arguments)[0]
                                                })
                                            }
                                            )))
                                        }
                                }
                            }
                        }, {
                            key: "receiveMessage",
                            value: function (e) {
                                e.data && this.handleMessage(e.data)
                            }
                        }],
                        r && o(t.prototype, r),
                        Object.defineProperty(t, "prototype", {
                            writable: !1
                        }),
                        e
                }();
            function h(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var r = 0, i = new Array(t); r < t; r++)
                    i[r] = e[r];
                return i
            }
            function f(e) {
                return f = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                }
                    : function (e) {
                        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                    }
                    ,
                    f(e)
            }
            function d(e) {
                return e && "object" === f(e) ? Object.entries(e || {}).reduce((function (e, t) {
                    var r, i, n, a = (n = 2,
                        function (e) {
                            if (Array.isArray(e))
                                return e
                        }(i = t) || function (e, t) {
                            var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                            if (null != r) {
                                var i, n, a = [], s = !0, o = !1;
                                try {
                                    for (r = r.call(e); !(s = (i = r.next()).done) && (a.push(i.value),
                                        !t || a.length !== t); s = !0)
                                        ;
                                } catch (e) {
                                    o = !0,
                                        n = e
                                } finally {
                                    try {
                                        s || null == r.return || r.return()
                                    } finally {
                                        if (o)
                                            throw n
                                    }
                                }
                                return a
                            }
                        }(i, n) || function (e, t) {
                            if (e) {
                                if ("string" == typeof e)
                                    return h(e, t);
                                var r = Object.prototype.toString.call(e).slice(8, -1);
                                return "Object" === r && e.constructor && (r = e.constructor.name),
                                    "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? h(e, t) : void 0
                            }
                        }(i, n) || function () {
                            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                        }()), s = a[0], o = a[1];
                    return Object.assign({}, e, function (e, t, r) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: r,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = r,
                            e
                    }({}, s, "function" == typeof o ? "".concat(null != (r = o) ? r : "") : o))
                }
                ), {}) : e
            }
            function v(e) {
                if (e)
                    return Object.assign({}, e, !!e.attrs && {
                        attrs: d(e.attrs)
                    })
            }
            function p(e) {
                return v(e)
            }
            function y(e) {
                return e && Array.isArray(e) ? e.map(p) : []
            }
            function m(e, t) {
                return function (e) {
                    if (Array.isArray(e))
                        return e
                }(e) || function (e, t) {
                    var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                    if (null != r) {
                        var i, n, a = [], s = !0, o = !1;
                        try {
                            for (r = r.call(e); !(s = (i = r.next()).done) && (a.push(i.value),
                                !t || a.length !== t); s = !0)
                                ;
                        } catch (e) {
                            o = !0,
                                n = e
                        } finally {
                            try {
                                s || null == r.return || r.return()
                            } finally {
                                if (o)
                                    throw n
                            }
                        }
                        return a
                    }
                }(e, t) || function (e, t) {
                    if (e) {
                        if ("string" == typeof e)
                            return g(e, t);
                        var r = Object.prototype.toString.call(e).slice(8, -1);
                        return "Object" === r && e.constructor && (r = e.constructor.name),
                            "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? g(e, t) : void 0
                    }
                }(e, t) || function () {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }()
            }
            function g(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var r = 0, i = new Array(t); r < t; r++)
                    i[r] = e[r];
                return i
            }
            function _(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var i = t[r];
                    i.enumerable = i.enumerable || !1,
                        i.configurable = !0,
                        "value" in i && (i.writable = !0),
                        Object.defineProperty(e, i.key, i)
                }
            }
            function b(e, t, r) {
                return t in e ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = r,
                    e
            }
            var w = function (e) {
                return "".concat(e, " method is not available here. It must be passed as customJS. More info at https://docs.unlayer.com/docs/custom-js-css")
            }
                , k = function () {
                    function e(t) {
                        !function (e, t) {
                            if (!(e instanceof t))
                                throw new TypeError("Cannot call a class as a function")
                        }(this, e),
                            b(this, "frame", null),
                            t && this.init(t)
                    }
                    var t, i;
                    return t = e,
                        i = [{
                            key: "init",
                            value: function () {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                                this.loadEditor(e),
                                    this.renderEditor(e),
                                    this.initEditor(e)
                            }
                        }, {
                            key: "destroy",
                            value: function () {
                                var e;
                                null === (e = this.frame) || void 0 === e || e.destroy(),
                                    this.frame = null
                            }
                        }, {
                            key: "loadEditor",
                            value: function (e) {
                                var t;
                                (e.offline || null !== (t = e.appearance) && void 0 !== t && t.loader) && (e.render = !1);
                                var i, n = e.version || "1.5.5", a = "".concat(r.p).concat(n, "/editor.html"), s = !1 === e.render ? "".concat(a, "?norender=true") : a;
                                ((i = n).startsWith("dev") || i.startsWith("qa") ? 1 : r(9051)(i, "1.0.57")) <= 0 && (window.__unlayer_multipleEditors = !1),
                                    this.frame = new c(s)
                            }
                        }, {
                            key: "renderEditor",
                            value: function (e) {
                                var t, r = null;
                                if (e.id ? r = document.getElementById(e.id) : e.className && (r = document.getElementsByClassName(e.className)[0]),
                                    !e.id && !e.className)
                                    throw new Error("id or className must be provided.");
                                if (!r)
                                    throw new Error("Could not find a valid element for given id or className.");
                                null === (t = this.frame) || void 0 === t || t.appendTo(r)
                            }
                        }, {
                            key: "initEditor",
                            value: function (e) {
                                var t, i = {};
                                if (e.env && (i.env = e.env),
                                    e.offline && (i.licenseUrl = "".concat(r.p, "license.json"),
                                        i.offline = e.offline),
                                    i.referrer = window.location.href,
                                    e.source && (i.source = e.source),
                                    e.amp && (i.amp = e.amp),
                                    e.defaultDevice && (i.defaultDevice = e.defaultDevice),
                                    e.devices && (i.devices = e.devices),
                                    e.displayMode && (i.displayMode = e.displayMode),
                                    e.designMode && (i.designMode = e.designMode),
                                    e.designId && (i.designId = e.designId),
                                    e.projectId && (i.projectId = e.projectId),
                                    e.user && (i.user = e.user),
                                    e.templateId && (i.templateId = e.templateId),
                                    e.stockTemplateId && (i.stockTemplateId = e.stockTemplateId),
                                    e.loadTimeout && (i.loadTimeout = e.loadTimeout),
                                    (e.safeHtml || e.safeHTML) && (i.safeHtml = e.safeHtml || e.safeHTML || !0),
                                    e.options && (i.options = e.options),
                                    e.validator && (i.validator = e.validator.toString()),
                                    e.tools) {
                                    var n = Object.entries(e.tools).reduce((function (e, t) {
                                        var r = m(t, 2)
                                            , i = r[0]
                                            , n = r[1];
                                        return Object.assign({}, e, b({}, i, Object.entries(n).reduce((function (e, t) {
                                            var r = m(t, 2)
                                                , i = r[0]
                                                , n = r[1];
                                            return Object.assign({}, e, b({}, i, "function" == typeof n ? n.toString() : n))
                                        }
                                        ), {})))
                                    }
                                    ), {});
                                    i.tools = n
                                }
                                e.excludeTools && (i.excludeTools = e.excludeTools),
                                    e.blocks && (i.blocks = e.blocks),
                                    e.editor && (i.editor = e.editor),
                                    e.fonts && (i.fonts = e.fonts),
                                    e.linkTypes && (i.linkTypes = y(e.linkTypes)),
                                    e.linkTypesSharedConfig && (i.linkTypesSharedConfig = v(e.linkTypesSharedConfig)),
                                    e.mergeTags && (i.mergeTags = e.mergeTags),
                                    e.displayConditions && (i.displayConditions = e.displayConditions),
                                    e.specialLinks && (i.specialLinks = e.specialLinks),
                                    e.designTags && (i.designTags = e.designTags),
                                    e.customCSS && (i.customCSS = e.customCSS),
                                    e.customJS && (i.customJS = e.customJS),
                                    e.locale && (i.locale = e.locale),
                                    e.textDirection && (i.textDirection = e.textDirection),
                                    e.translations && (i.translations = e.translations),
                                    e.appearance && (i.appearance = e.appearance),
                                    e.features && (i.features = e.features),
                                    e.designTagsConfig && (i.designTagsConfig = e.designTagsConfig),
                                    e.mergeTagsConfig && (i.mergeTagsConfig = e.mergeTagsConfig),
                                    e.tabs && (i.tabs = e.tabs),
                                    window.Cypress && (i.IS_TEST = !0),
                                    null === (t = this.frame) || void 0 === t || t.postMessage("config", i)
                            }
                        }, {
                            key: "registerColumns",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.withMessage("registerColumns", {
                                    cells: e
                                })
                            }
                        }, {
                            key: "registerCallback",
                            value: function (e, t) {
                                var r;
                                null === (r = this.frame) || void 0 === r || r.withMessage("registerCallback", {
                                    type: e
                                }, t)
                            }
                        }, {
                            key: "unregisterCallback",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.withMessage("unregisterCallback", {
                                    type: e
                                })
                            }
                        }, {
                            key: "registerProvider",
                            value: function (e, t) {
                                var r;
                                null === (r = this.frame) || void 0 === r || r.withMessage("registerProvider", {
                                    type: e
                                }, t)
                            }
                        }, {
                            key: "unregisterProvider",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.withMessage("unregisterProvider", {
                                    type: e
                                })
                            }
                        }, {
                            key: "reloadProvider",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.withMessage("reloadProvider", {
                                    type: e
                                })
                            }
                        }, {
                            key: "addEventListener",
                            value: function (e, t) {
                                var r;
                                null === (r = this.frame) || void 0 === r || r.withMessage("registerCallback", {
                                    type: e
                                }, t)
                            }
                        }, {
                            key: "removeEventListener",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.withMessage("unregisterCallback", {
                                    type: e
                                })
                            }
                        }, {
                            key: "setDesignId",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.withMessage("setDesignId", {
                                    id: e
                                })
                            }
                        }, {
                            key: "setDesignMode",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.withMessage("setDesignMode", {
                                    designMode: e
                                })
                            }
                        }, {
                            key: "setDisplayMode",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.withMessage("setDisplayMode", {
                                    displayMode: e
                                })
                            }
                        }, {
                            key: "loadProject",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("loadProject", {
                                    projectId: e
                                })
                            }
                        }, {
                            key: "loadUser",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("loadUser", {
                                    user: e
                                })
                            }
                        }, {
                            key: "loadTemplate",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("loadTemplate", {
                                    templateId: e
                                })
                            }
                        }, {
                            key: "loadStockTemplate",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("loadStockTemplate", {
                                    stockTemplateId: e
                                })
                            }
                        }, {
                            key: "setLinkTypes",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("setLinkTypes", {
                                    linkTypes: y(e)
                                })
                            }
                        }, {
                            key: "setLinkTypesSharedConfig",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("setLinkTypesSharedConfig", {
                                    linkTypesSharedConfig: v(e)
                                })
                            }
                        }, {
                            key: "setMergeTags",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("setMergeTags", {
                                    mergeTags: e
                                })
                            }
                        }, {
                            key: "setSpecialLinks",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("setSpecialLinks", {
                                    specialLinks: e
                                })
                            }
                        }, {
                            key: "setDisplayConditions",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("setDisplayConditions", {
                                    displayConditions: e
                                })
                            }
                        }, {
                            key: "setLocale",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("setLocale", {
                                    locale: e
                                })
                            }
                        }, {
                            key: "setTextDirection",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("setTextDirection", {
                                    textDirection: e
                                })
                            }
                        }, {
                            key: "setTranslations",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("setTranslations", {
                                    translations: e
                                })
                            }
                        }, {
                            key: "loadBlank",
                            value: function () {
                                var e, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                                null === (e = this.frame) || void 0 === e || e.postMessage("loadBlank", {
                                    bodyValues: t
                                })
                            }
                        }, {
                            key: "loadDesign",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("loadDesign", {
                                    design: e
                                })
                            }
                        }, {
                            key: "saveDesign",
                            value: function (e) {
                                var t, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                                null === (t = this.frame) || void 0 === t || t.withMessage("saveDesign", r, e)
                            }
                        }, {
                            key: "exportHtml",
                            value: function (e, t) {
                                var r;
                                null === (r = this.frame) || void 0 === r || r.withMessage("exportHtml", t, e)
                            }
                        }, {
                            key: "exportLiveHtml",
                            value: function (e) {
                                var t, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                                null === (t = this.frame) || void 0 === t || t.withMessage("exportLiveHtml", r, e)
                            }
                        }, {
                            key: "exportPlainText",
                            value: function (e) {
                                var t, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                                null === (t = this.frame) || void 0 === t || t.withMessage("exportPlainText", r, e)
                            }
                        }, {
                            key: "exportImage",
                            value: function (e, t) {
                                var r;
                                null === (r = this.frame) || void 0 === r || r.withMessage("exportImage", t, e)
                            }
                        }, {
                            key: "exportPdf",
                            value: function (e, t) {
                                var r;
                                null === (r = this.frame) || void 0 === r || r.withMessage("exportPdf", t, e)
                            }
                        }, {
                            key: "exportZip",
                            value: function (e, t) {
                                var r;
                                null === (r = this.frame) || void 0 === r || r.withMessage("exportZip", t, e)
                            }
                        }, {
                            key: "setAppearance",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("setAppearance", {
                                    appearance: e
                                })
                            }
                        }, {
                            key: "setBodyValues",
                            value: function (e, t) {
                                var r;
                                null === (r = this.frame) || void 0 === r || r.postMessage("setBodyValues", {
                                    bodyId: t,
                                    bodyValues: e
                                })
                            }
                        }, {
                            key: "setDesignTagsConfig",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("setDesignTagsConfig", {
                                    designTagsConfig: e
                                })
                            }
                        }, {
                            key: "setMergeTagsConfig",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("setMergeTagsConfig", {
                                    mergeTagsConfig: e
                                })
                            }
                        }, {
                            key: "showPreview",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.postMessage("showPreview", {
                                    device: e
                                })
                            }
                        }, {
                            key: "hidePreview",
                            value: function () {
                                var e;
                                null === (e = this.frame) || void 0 === e || e.postMessage("hidePreview", {})
                            }
                        }, {
                            key: "canUndo",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.withMessage("canUndo", {}, e)
                            }
                        }, {
                            key: "canRedo",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.withMessage("canRedo", {}, e)
                            }
                        }, {
                            key: "undo",
                            value: function () {
                                var e;
                                null === (e = this.frame) || void 0 === e || e.postMessage("undo", {})
                            }
                        }, {
                            key: "redo",
                            value: function () {
                                var e;
                                null === (e = this.frame) || void 0 === e || e.postMessage("redo", {})
                            }
                        }, {
                            key: "audit",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.withMessage("audit", {}, e)
                            }
                        }, {
                            key: "setValidator",
                            value: function (e) {
                                var t;
                                "function" == typeof e || null === e ? null === (t = this.frame) || void 0 === t || t.withMessage("setValidator", {
                                    validator: null === e ? null : e.toString()
                                }) : console.error("Validator must be a function or null")
                            }
                        }, {
                            key: "setToolValidator",
                            value: function (e, t) {
                                var r;
                                e && "string" == typeof e ? "function" == typeof t || null === t ? null === (r = this.frame) || void 0 === r || r.withMessage("setToolValidator", {
                                    tool: e,
                                    validator: null === t ? null : t.toString()
                                }) : console.error("Validator must be a function") : console.error("Tool name must be a string")
                            }
                        }, {
                            key: "updateTabs",
                            value: function (e) {
                                var t;
                                null === (t = this.frame) || void 0 === t || t.withMessage("updateTabs", {
                                    tabs: e
                                })
                            }
                        }, {
                            key: "clearValidators",
                            value: function () {
                                var e;
                                null === (e = this.frame) || void 0 === e || e.withMessage("clearValidators", {})
                            }
                        }, {
                            key: "registerContainerExporter",
                            value: function () {
                                throw new Error(w("registerContainerExporter"))
                            }
                        }, {
                            key: "registerItemExporter",
                            value: function () {
                                throw new Error(w("registerItemExporter"))
                            }
                        }, {
                            key: "registerTool",
                            value: function () {
                                throw new Error(w("registerTool"))
                            }
                        }, {
                            key: "registerPropertyEditor",
                            value: function () {
                                throw new Error(w("registerPropertyEditor"))
                            }
                        }, {
                            key: "registerTab",
                            value: function () {
                                throw new Error(w("registerTab"))
                            }
                        }, {
                            key: "createPanel",
                            value: function () {
                                throw new Error(w("createPanel"))
                            }
                        }, {
                            key: "createViewer",
                            value: function () {
                                throw new Error(w("createViewer"))
                            }
                        }, {
                            key: "createWidget",
                            value: function () {
                                throw new Error(w("createWidget"))
                            }
                        }],
                        i && _(t.prototype, i),
                        Object.defineProperty(t, "prototype", {
                            writable: !1
                        }),
                        e
                }();
            function M(e) {
                return M = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                }
                    : function (e) {
                        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                    }
                    ,
                    M(e)
            }
            function I(e, t) {
                if (!(e instanceof t))
                    throw new TypeError("Cannot call a class as a function")
            }
            function T(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var i = t[r];
                    i.enumerable = i.enumerable || !1,
                        i.configurable = !0,
                        "value" in i && (i.writable = !0),
                        Object.defineProperty(e, i.key, i)
                }
            }
            function j(e, t) {
                return j = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (e, t) {
                    return e.__proto__ = t,
                        e
                }
                    ,
                    j(e, t)
            }
            function S(e, t) {
                if (t && ("object" === M(t) || "function" == typeof t))
                    return t;
                if (void 0 !== t)
                    throw new TypeError("Derived constructors may only return object or undefined");
                return function (e) {
                    if (void 0 === e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return e
                }(e)
            }
            function x(e) {
                return x = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                }
                    ,
                    x(e)
            }
            var E = function (e) {
                !function (e, t) {
                    if ("function" != typeof t && null !== t)
                        throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            writable: !0,
                            configurable: !0
                        }
                    }),
                        Object.defineProperty(e, "prototype", {
                            writable: !1
                        }),
                        t && j(e, t)
                }(s, e);
                var t, r, i, n, a = (i = s,
                    n = function () {
                        if ("undefined" == typeof Reflect || !Reflect.construct)
                            return !1;
                        if (Reflect.construct.sham)
                            return !1;
                        if ("function" == typeof Proxy)
                            return !0;
                        try {
                            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () { }
                            ))),
                                !0
                        } catch (e) {
                            return !1
                        }
                    }(),
                    function () {
                        var e, t = x(i);
                        if (n) {
                            var r = x(this).constructor;
                            e = Reflect.construct(t, arguments, r)
                        } else
                            e = t.apply(this, arguments);
                        return S(this, e)
                    }
                );
                function s() {
                    return I(this, s),
                        a.apply(this, arguments)
                }
                return t = s,
                    (r = [{
                        key: "createEditor",
                        value: function (e) {
                            return new k(e)
                        }
                    }]) && T(t.prototype, r),
                    Object.defineProperty(t, "prototype", {
                        writable: !1
                    }),
                    s
            }(k)
                , O = new E
        }(),
        unlayer = a.default
}();
