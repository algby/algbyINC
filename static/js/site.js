function require(e, t) {
    if (t && e.charAt(0) === ".") {
        e = require.normalize(t, e)
    }
    var r = require.resolve(e);
    if (!r) {
        t = t || "root";
        throw new Error('Failed to require "' + e + '" from "' + t + '"')
    }
    var n = require.modules[r];
    if (!n.exports) {
        n.exports = {};
        n.call(n.exports, n.exports, require.relative(r), n)
    }
    return n.exports
}
require.modules = {};
require.mains = {};
require.main = function(e, t) {
    require.mains[e] = t
};
require.resolve = function(e) {
    if (e.charAt(0) === "/") {
        e = e.slice(1)
    }
    var t = [e, e + ".js", e + "/index.js"];
    if (require.mains[e]) {
        t = [require.mains[e]]
    }
    for (var r = 0; r < t.length; r++) {
        var n = t[r];
        if (require.modules.hasOwnProperty(n)) {
            return n
        }
    }
};
require.normalize = function(e, t) {
    var r = [];
    if (t.charAt(0) !== ".") {
        return t
    }
    e = e.split("/");
    t = t.split("/");
    for (var n = 0; n < t.length; n++) {
        if (t[n] === "..") {
            e.pop()
        } else if (t[n] !== "." && t[n] !== "") {
            r.push(t[n])
        }
    }
    return e.concat(r).join("/")
};
require.register = function(e, t) {
    require.modules[e] = t
};
require.relative = function(e) {
    e = e.split("/");
    e.pop();
    return function(t) {
        return require(t, e.join("/"))
    }
};
require.register("query", function(e, t, r) {
    function n(e, t) {
        return t.querySelector(e)
    }
    e = r.exports = function(e, t) {
        t = t || document;
        return n(e, t)
    };
    e.all = function(e, t) {
        t = t || document;
        return t.querySelectorAll(e)
    };
    e.engine = function(t) {
        if (!t.one) throw new Error(".one callback required");
        if (!t.all) throw new Error(".all callback required");
        n = t.one;
        e.all = t.all;
        return e
    }
});
require.register("google-analytics", function(e, t, r) {
    var n = t("query");
    var o = n('meta[name="google-analytics"]');
    var i;
    if (o) {
        i = o.getAttribute("content")
    }(function(e, t, r, n, o, a, c) {
        e["GoogleAnalyticsObject"] = o;
        e[o] = e[o] || function() {
            (e[o].q = e[o].q || []).push(arguments)
        };
        e[o].l = new Date;
        a = t.createElement(r);
        c = t.getElementsByTagName(r)[0];
        a.async = 1;
        a.src = n;
        if (i) {
            c.parentNode.insertBefore(a, c)
        }
    })(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");
    ga("create", i);
    r.exports = ga
});
require.register("emitter", function(e, t, r) {
    r.exports = n;

    function n(e) {
        if (e) return o(e)
    }

    function o(e) {
        for (var t in n.prototype) {
            e[t] = n.prototype[t]
        }
        return e
    }
    n.prototype.on = n.prototype.addEventListener = function(e, t) {
        this._callbacks = this._callbacks || {};
        (this._callbacks[e] = this._callbacks[e] || []).push(t);
        return this
    };
    n.prototype.once = function(e, t) {
        var r = this;
        this._callbacks = this._callbacks || {};

        function n() {
            r.off(e, n);
            t.apply(this, arguments)
        }
        n.fn = t;
        this.on(e, n);
        return this
    };
    n.prototype.off = n.prototype.removeListener = n.prototype.removeAllListeners = n.prototype.removeEventListener = function(e, t) {
        this._callbacks = this._callbacks || {};
        if (0 == arguments.length) {
            this._callbacks = {};
            return this
        }
        var r = this._callbacks[e];
        if (!r) return this;
        if (1 == arguments.length) {
            delete this._callbacks[e];
            return this
        }
        var n;
        for (var o = 0; o < r.length; o++) {
            n = r[o];
            if (n === t || n.fn === t) {
                r.splice(o, 1);
                break
            }
        }
        return this
    };
    n.prototype.emit = function(e) {
        this._callbacks = this._callbacks || {};
        var t = [].slice.call(arguments, 1),
            r = this._callbacks[e];
        if (r) {
            r = r.slice(0);
            for (var n = 0, o = r.length; n < o; ++n) {
                r[n].apply(this, t)
            }
        }
        return this
    };
    n.prototype.listeners = function(e) {
        this._callbacks = this._callbacks || {};
        return this._callbacks[e] || []
    };
    n.prototype.hasListeners = function(e) {
        return !!this.listeners(e).length
    }
});
require.register("matches-selector", function(e, t, r) {
    var n = t("query");
    var o = Element.prototype;
    var i = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.msMatchesSelector || o.oMatchesSelector;
    r.exports = a;

    function a(e, t) {
        if (i) return i.call(e, t);
        var r = n.all(t, e.parentNode);
        for (var o = 0; o < r.length; ++o) {
            if (r[o] == e) return true
        }
        return false
    }
});
require.register("closest", function(e, t, r) {
    var n = t("matches-selector");
    r.exports = function(e, t, r, o) {
        e = r ? {
            parentNode: e
        } : e;
        o = o || document;
        while ((e = e.parentNode) && e !== document) {
            if (n(e, t)) return e;
            if (e === o) return
        }
    }
});
require.register("event", function(e, t, r) {
    var n = window.addEventListener ? "addEventListener" : "attachEvent",
        o = window.removeEventListener ? "removeEventListener" : "detachEvent",
        i = n !== "addEventListener" ? "on" : "";
    e.bind = function(e, t, r, o) {
        e[n](i + t, r, o || false);
        return r
    };
    e.unbind = function(e, t, r, n) {
        e[o](i + t, r, n || false);
        return r
    }
});
require.register("delegate", function(e, t, r) {
    var n = t("closest"),
        o = t("event");
    e.bind = function(e, t, r, i, a) {
        return o.bind(e, r, function(r) {
            var o = r.target || r.srcElement;
            r.delegateTarget = n(o, t, true, e);
            if (r.delegateTarget) i.call(e, r)
        }, a)
    };
    e.unbind = function(e, t, r, n) {
        o.unbind(e, t, r, n)
    }
});
require.register("url", function(e, t, r) {
    e.parse = function(e) {
        var t = document.createElement("a");
        t.href = e;
        return {
            href: t.href,
            host: t.host || location.host,
            port: "0" === t.port || "" === t.port ? n(t.protocol) : t.port,
            hash: t.hash,
            hostname: t.hostname || location.hostname,
            pathname: t.pathname.charAt(0) != "/" ? "/" + t.pathname : t.pathname,
            protocol: !t.protocol || ":" == t.protocol ? location.protocol : t.protocol,
            search: t.search,
            query: t.search.slice(1)
        }
    };
    e.isAbsolute = function(e) {
        return 0 == e.indexOf("//") || !!~e.indexOf("://")
    };
    e.isRelative = function(t) {
        return !e.isAbsolute(t)
    };
    e.isCrossDomain = function(t) {
        t = e.parse(t);
        return t.hostname !== location.hostname || t.port !== location.port || t.protocol !== location.protocol
    };

    function n(e) {
        switch (e) {
            case "http:":
                return 80;
            case "https:":
                return 443;
            default:
                return location.port
        }
    }
});
require.register("dom-parser", function(e, t, r) {
    function n(e) {
        var t = new DOMParser;
        return t.parseFromString(e, "text/html")
    }

    function o(e) {
        var t = document.implementation.createHTMLDocument("");
        t.documentElement.innerHTML = e;
        return t
    }

    function i(e) {
        var t = document.implementation.createHTMLDocument("");
        t.open("replace");
        t.write(e);
        t.close();
        return t
    }
    var a = "<html><body><p>test";

    function c() {
        var e;
        try {
            if (window.DOMParser) {
                e = n(a);
                return n
            }
        } catch (t) {
            e = o(a);
            return o
        } finally {
            if (!(e && e.body && e.body.childNodes.length === 1)) {
                return i
            }
        }
    }
    var u = c();

    function s(e) {
        if (u) return u(e);
        return null
    }
    s.parser = u;
    r.exports = s
});
require.register("execute-script", function(e, t, r) {
    r.exports = function(e) {
        var t = e.type;
        if (t !== "" && t !== "text/javascript") return;
        var r = document.createElement("script");
        var n = e.attributes || [];
        for (var o = 0; o < n.length; o++) {
            (function(e) {
                r.setAttribute(e.name, e.value)
            })(n[o])
        }
        r.appendChild(document.createTextNode(e.innerHTML));
        var i = e.parentNode;
        var a = e.nextSibling;
        i.removeChild(e);
        i.insertBefore(r, a)
    }
});
require.register("turbolinks", function(e, t, r) {
    var n = t("delegate");
    var o = t("dom-parser");
    var i = t("execute-script");
    var a = t("emitter");
    e = r.exports = new a;
    var c = history && history.pushState && history.replaceState && (history.state !== undefined || navigator.userAgent.match(/Firefox\/2[6|7]/));
    var u = navigator.userAgent.match(/CriOS\//);
    var s = c && !u;
    var l, f, h = {},
        p = 10;

    function d(t) {
        if (!s) return location.href = t;
        e.emit("page:visit", {
            url: t
        });
        f = location.href;
        if (p) {
            w()
        }
        if (t !== f) {
            history.pushState({
                turbolinks: true,
                url: t
            }, "", t)
        }
        var r = h[t];
        if (r) {
            return v(r)
        }
        return m(t, function() {
            if (location.hash) {
                return location.href = location.href
            } else {
                window.scrollTo(0, 0)
            }
        })
    }

    function m(t, r) {
        e.emit("page:fetch", {
            url: t
        });
        if (m.xhr) {
            m.xhr.abort()
        }
        var n = y(t);
        m.xhr = b(n, function(n) {
            e.emit("page:receive");
            var i;
            var a = n.getResponseHeader("Content-Type");
            if (q(a) && x(n.status)) {
                i = o(n.responseText)
            }
            if (!i) {
                return location.href = t
            }
            g(i, true);
            var c = n.getResponseHeader("X-XHR-Redirected-To");
            if (c) {
                var u = y(c) === c ? document.hash : "";
                history.replaceState(l, "", c + u)
            }
            r && r();
            e.emit("page:load")
        });
        m.xhr.onloadend = function() {
            m.xhr = null
        }
    }

    function v(t) {
        if (b.xhr) {
            b.xhr.abort()
        }
        g(t);
        window.scrollTo(t.positionX, t.positionY);
        e.emit("page:restore")
    }

    function g(t, r) {
        if (t.title && t.title.valueOf()) {
            document.title = t.title
        }
        var n = t.body;
        n.innerHTML = n.innerHTML.replace(/<noscript[\S\s]*?<\/noscript>/gi, "");
        document.documentElement.replaceChild(n, document.body);
        A(t.head);
        if (r) {
            k(document.body)
        }
        l = history.state;
        e.emit("page:change");
        e.emit("page:update")
    }

    function b(t, r) {
        var n = new XMLHttpRequest;
        n.open("GET", t, true);
        n.setRequestHeader("Accept", "text/html, application/xhtml+xml, application/xml");
        n.setRequestHeader("X-XHR-Referer", f);
        n.onload = function() {
            r && r(n)
        };
        n.onerror = function() {
            location.href = t
        };
        if (n.upload) {
            n.upload.onprogress = function(t) {
                t.percent = t.loaded / t.total * 100;
                e.emit("progress", t)
            }
        }
        n.send();
        return n
    }

    function w() {
        h[l.url] = {
            url: document.location.href,
            head: document.head,
            body: document.body,
            title: document.title,
            positionY: window.pageYOffset,
            positionX: window.pageXOffset,
            cachedAt: (new Date).getTime()
        };
        var t = Object.keys(h);
        var r = t.map(function(e) {
            return h[e].cachedAt
        }).sort(function(e, t) {
            return t - e
        })[p];
        t.forEach(function(t) {
            if (h[t].cachedAt < r) {
                e.emit("page:expire", h[t]);
                delete h[t]
            }
        })
    }

    function y(e) {
        var t = e;
        if (!e.href) {
            t = document.createElement("A");
            t.href = e
        }
        return t.href.replace(t.hash, "")
    }

    function q(e) {
        return e.match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/)
    }

    function x(e) {
        return e < 400
    }

    function k(e) {
        var t = e.querySelectorAll('script:not([data-turbolinks-eval="false"])');
        for (var r = 0; r < t.length; r++) {
            i(t[r])
        }
    }

    function A(e) {
        var t = e.querySelectorAll("meta");
        for (var r = 0; r < t.length; r++) {
            (function(e) {
                var t = e.getAttribute("property");
                if (!e.name && !t) return;
                var r;
                if (e.name) {
                    r = 'meta[name="' + e.name + '"]'
                } else {
                    r = 'meta[property="' + t + '"]'
                }
                var n = document.head.querySelector(r);
                if (n) {
                    n.content = e.content
                } else {
                    document.head.appendChild(e)
                }
            })(t[r])
        }
    }
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function() {
            e.emit("page:change");
            e.emit("page:update")
        }, true)
    }
    if (s) {
        history.replaceState({
            turbolinks: true,
            url: location.href
        }, "", location.href);
        l = history.state;
        n.bind(document, "a", "click", E, true);
        setTimeout(function() {
            window.addEventListener("popstate", function(e) {
                if (e.state && e.state.turbolinks) {
                    var t = h[e.state.url];
                    if (t) {
                        w();
                        v(t)
                    } else {
                        d(e.target.location.href)
                    }
                }
            }, false)
        }, 500)
    }

    function E(e) {
        if (!e.defaultPrevented) {
            var t = e.delegateTarget;
            var r = location.protocol !== t.protocol || location.host !== t.host;
            var n = (t.hash && y(t)) === y(location) || t.href === location.href + "#";
            var o = y(t);
            var i = o.match(/\.[a-z]+(\?.*)?$/g) && !o.match(/\.(?:htm|html)?(\?.*)?$/g);
            var a = t.target.length !== 0;
            var c = e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
            var u = r || n || i || a || c;
            if (!u) {
                d(t.href);
                return e.preventDefault()
            }
        }
    }
    e.cacheSize = p;
    e.isSupported = s;
    e.visit = d
});
require.register("social", function(e, t, r) {
    var n = {
        twitter: "https://twitter.com/intent/tweet?text={text}&url={url}",
        facebook: "http://www.facebook.com/sharer.php?t={text}&u={url}",
        weibo: "http://service.weibo.com/share/share.php?title={text}&url={url}"
    };
    var o = 8003029170;

    function i(e, t) {
        t = t || {};
        if (e.getAttribute("data-widget-rendered")) return;
        e.setAttribute("data-widget-rendered", "true");
        var r = t.prefix || e.getAttribute("data-prefix") || "icon-";
        var i = t.text || e.getAttribute("data-text");
        var f = t.url || e.getAttribute("data-url") || location.href;
        var h = t.image || e.getAttribute("data-image");
        var p = t.count || e.getAttribute("data-count");
        o = t.weiboKey || e.getAttribute("data-weibo-key") || o;
        var d = {
            twitter: t.twitter || e.getAttribute("data-twitter"),
            facebook: t.facebook || e.getAttribute("data-facebook"),
            weibo: t.weibo || e.getAttribute("data-weibo")
        };
        var m = {
            twitter: s,
            facebook: u,
            weibo: l
        };

        function v(t) {
            if (!d[t]) return;
            var o = document.createElement("div");
            o.className = "social-button-item social-button-" + t;
            var u = document.createElement("a");
            u.className = "social-button-icon social-button-icon-" + t + " " + r + t;
            u.setAttribute("aria-label", "Share to " + t);
            u.setAttribute("title", "Share to " + t);
            u.target = "_blank";
            var s = n[t];
            var l = i;
            if (t === "twitter") {
                s += "&via=" + encodeURIComponent(d[t])
            } else {
                l = i + " via @" + d[t]
            }
            s = s.replace("{text}", encodeURIComponent(l));
            s = s.replace("{url}", encodeURIComponent(f));
            if (t === "weibo" && h) {
                s += "&pic=" + encodeURIComponent(h)
            }
            u.href = s;
            u.onclick = function(e) {
                e.preventDefault && e.preventDefault();
                window.open(s, "_blank", "width=615,height=505")
            };
            o.appendChild(u);
            var v = m[t];
            if (v && p) {
                var g = document.createElement("span");
                o.appendChild(g);
                g.className = "hide";
                var b = e.getAttribute("data-sameas");
                b = b ? b.split(/\s+/) : [];
                b.push(f);
                try {
                    c(b, v, function(e) {
                        g.innerHTML = a(e);
                        g.className = "social-button-count";
                        setTimeout(function() {
                            g.style.marginLeft = "-" + Math.floor(g.clientWidth / 2) + "px"
                        }, 300)
                    })
                } catch (w) {
                    o.removeChild(g)
                }
            }
            e.appendChild(o);
            return o
        }
        v("twitter");
        v("facebook");
        v("weibo")
    }
    r.exports = i;

    function a(e) {
        var t = e / 1e6;
        if (t > 1) {
            return Math.round(t * 100) / 100 + "M"
        }
        t = e / 1e3;
        if (t > 1) {
            return Math.round(t * 100) / 100 + "K"
        }
        return e
    }

    function c(e, t, r) {
        var n = e.length;
        var o = 0;
        var i = 0;
        var a = [];
        while (i < n && o < n) {
            t(e[i], function(e) {
                o += 1;
                a.push(e);
                if (o === n) {
                    var t = 0;
                    for (var i = 0; i < a.length; i++) {
                        t += a[i]
                    }
                    r(t)
                }
            });
            i += 1
        }
    }

    function u(e, t) {
        var r = "https://graph.facebook.com/fql?q=";
        var n = "SELECT share_count FROM link_stat WHERE url = '" + e + "'";
        p(r + encodeURIComponent(n), function(e) {
            t(e.data[0]["share_count"])
        })
    }

    function s(e, t) {
        var r = "https://cdn.api.twitter.com/1/urls/count.json?url=";
        if (location.protocol === "http:") {
            r = "http://urls.api.twitter.com/1/urls/count.json?url="
        }
        p(r + encodeURIComponent(e), function(e) {
            t(e.count)
        })
    }

    function l(e, t) {
        var r = "https://api.weibo.com/2/short_url/shorten.json?source=";
        r += encodeURIComponent(o) + "&url_long=";
        r += encodeURIComponent(e);
        p(r, function(e) {
            var n = e.data.urls[0].url_short;
            r = "https://api.weibo.com/2/short_url/share/counts.json?source=";
            r += encodeURIComponent(o) + "&url_short=";
            r += encodeURIComponent(n);
            p(r, function(e) {
                t(parseInt(e.data.urls[0].share_counts, 10))
            })
        })
    }
    var f = {};
    var h = 0;

    function p(e, t) {
        if (f[e]) {
            return t(f[e])
        }
        var r = "_social_" + h;
        var n;
        if (~e.indexOf("?")) {
            n = e + "&"
        } else {
            n = e + "?"
        }
        var o = document.createElement("script");
        o.src = n + "callback=" + r;
        o.async = true;
        o.defer = true;
        window[r] = function(r) {
            f[e] = r;
            t(r)
        };
        o.onload = function() {
            delete window[r]
        };
        document.body.appendChild(o);
        h += 1
    }
});
require.register("lepture", function(e, t, r) {
    if (/windows/i.test(navigator.userAgent)) {
        document.getElementsByTagName("html")[0].className = "windows"
    }
    var n = t("turbolinks");
    var o = t("social");
    var i = t("query");
    t("google-analytics");
    n.on("page:visit", function() {
        document.body.className = "page-loading"
    });
    n.on("page:change", function() {
        document.body.className = "";
        f(i.all(".entry-content img"));
        var e = i(".social-button");
        if (e) o(e);
        s();
        l();
        if (location.port) return;
        c();
        ga("send", "pageview", {
            page: location.pathname,
            location: location.href,
            title: a() || document.title
        })
    });

    function a() {
        var e = document.querySelector('meta[property="og:title"]');
        if (e) {
            return e.content
        }
    }

    function c() {
        if (/MicroMessenger/i.test(navigator.userAgent) && document.querySelector) {
            var e = a();
            if (e) {
                document.title = e
            }
        }
    }

    function u(e, t) {
        var r;
        if (/\.js$/.test(e)) {
            r = "script"
        } else {
            r = "link"
        }
        var n = document,
            o = n.createElement(r),
            i = n.getElementsByTagName(r)[0];
        if (r === "link") {
            o.href = e;
            o.rel = "stylesheet"
        } else {
            o.src = e;
            o.async = true
        }
        i.parentNode.insertBefore(o, i);
        return o
    }
    window.githubCard = {};

    function s() {
        var e = i.all(".github-card");
        if (!e.length) return;
        var t = function() {
            e = i.all(".github-card");
            for (var t = 0; t < e.length; t++) {
                githubCard.render(e[t])
            }
        };
        if (!githubCard.render) {
            var r = u("//lab.lepture.com/github-cards/widget.js");
            r.onload = t
        } else {
            t()
        }
    }

    function l() {
        var e = i("#disqus_thread");
        if (!e) return;
        e.innerHTML = "";
        var t = function() {
            DISQUS.reset({
                reload: true,
                config: function() {
                    this.page.url = disqus_url
                }
            })
        };
        if (!window.DISQUS) {
            u("https://" + disqus_shortname + ".disqus.com/embed.js")
        } else {
            t()
        }
    }

    function f(e) {
        if (e.length) {
            for (var t = 0; t < e.length; t++) {
                var r = e[t].getAttribute("data-src");
                if (r) e[t].src = r
            }
        }
    }
});
require("lepture");