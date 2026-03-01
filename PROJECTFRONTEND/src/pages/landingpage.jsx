// src/pages/LandingPage.jsx
// Pure inline styles — no Tailwind dependency, nothing squishes.
// onEnter()           → role picker  (Get Started, nav, footer, CTA)
// onEnter("student")  → student form (portal card)
// onEnter("admin")    → admin form   (portal card)


import { Link } from "react-router-dom"
import React from "react";

const NAVY = "#1e3a6e";
const NAVY_D = "#152d57";
const GRID = {
  backgroundImage: "linear-gradient(rgba(255,255,255,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.12) 1px,transparent 1px)",
  backgroundSize: "36px 36px",
};

const FEATURES = [
  { icon: "⚡", tag: "Objective 1", title: "Rule-Based Allocation Engine", desc: "A four-rule algorithm assigns rooms by verifying payment, matching gender, checking real-time availability, and applying best-fit selection — zero manual work." },
  { icon: "🔄", tag: "Objective 2", title: "Real-Time Database Sync", desc: "Every allocation instantly updates room occupancy across the system. Admins and students always see live, accurate data — no refresh needed." },
  { icon: "🧾", tag: "Objective 2", title: "Secure E-Receipt Delivery", desc: "The moment a room is confirmed, an official digital receipt is generated and delivered to both student and hall administrator." },
  { icon: "📊", tag: "Objective 3", title: "System Effectiveness Analytics", desc: "Track allocation success rates, payment compliance, room utilization, and algorithm performance — all metrics needed to evaluate the system." },
  { icon: "🔒", tag: "Security", title: "Payment Verification Gate", desc: "Students with unverified payments are blocked from the allocation queue. Only confirmed payments unlock the booking flow." },
  { icon: "🏠", tag: "Admin", title: "Multi-Hall Room Management", desc: "Admins manage all hostel halls, blocks, and rooms from one console. Toggle maintenance, eject occupants, and add new rooms instantly." },
];

const STEPS = [
  { step: "01", title: "Student Pays", desc: "Student pays the hostel fee. The admin verifies and marks the payment confirmed in the system." },
  { step: "02", title: "Algorithm Runs", desc: "The rule-based engine checks payment, matches gender to the correct hall, confirms availability, and selects the best-fit room." },
  { step: "03", title: "Room Assigned", desc: "The student's room is instantly allocated. Occupancy data updates in real time across the admin dashboard." },
  { step: "04", title: "Receipt Delivered", desc: "A secure e-receipt with a unique transaction reference is generated and sent to both student and hall administrator." },
];

const STATS = [
  { value: "4", label: "Allocation Rules", sub: "Payment · Gender · Availability · Best-Fit" },
  { value: "< 2s", label: "Receipt Delivery", sub: "Instant e-receipt on allocation confirm" },
  { value: "100%", label: "Payment Gated", sub: "No allocation without verified payment" },
  { value: "Live", label: "Occupancy Tracking", sub: "Real-time updates across all halls" },
];

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#0f172a", background: "#F5F5F5", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── NAV ──────────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: NAVY, height: 64 }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", ...GRID }} />
        <div style={{ position: "relative", maxWidth: 1152, margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>🏠</div>
            <span style={{ fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: "-0.01em" }}>HostelMS</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {[["#how-it-works", "How It Works"], ["#features", "Features"], ["#stats", "System Stats"]].map(([href, lbl]) => (
              <a key={href} href={href} style={{ color: "#bfdbfe", fontSize: 12, fontWeight: 500, textDecoration: "none", letterSpacing: "0.02em" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "#bfdbfe"}>{lbl}</a>
            ))}
          </div>

          <Link to="/LoginPage" style={{ background: "#fff", color: NAVY, fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer" }}>

            Sign In →
          </Link>

        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{ background: NAVY, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: 64 }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.07) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "rgba(96,165,250,0.1)", filter: "blur(130px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>

          {/* Eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "8px 20px", marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#dbeafe" }}>2025/2026 Academic Session</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: "clamp(2.5rem,6vw,4.2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.06, letterSpacing: "-0.02em", marginBottom: 24 }}>
            Hostel allocation,{" "}
            <span style={{ color: "#bfdbfe", textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.3)", textUnderlineOffset: 6 }}>automated.</span>
          </h1>

          {/* Sub */}
          <p style={{ fontSize: 17, color: "#bfdbfe", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 40px" }}>
            HostelMS assigns rooms based on{" "}
            <span style={{ color: "#fff", fontWeight: 600 }}>payment status</span>,{" "}
            <span style={{ color: "#fff", fontWeight: 600 }}>student gender</span>, and{" "}
            <span style={{ color: "#fff", fontWeight: 600 }}>real-time availability</span>{" "}
            — then instantly delivers a secure e-receipt to both student and administrator.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            {/* Get Started → role picker */}


            <Link to="/LoginPage" style={{ background: "#fff", color: NAVY, fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", padding: "16px 40px", borderRadius: 10, border: "none", cursor: "pointer", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
              onMouseEnter={e => e.currentTarget.style.background = "#F0F4FF"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              Get Started →
            </Link>

            <a href="#how-it-works"
              style={{ color: "#fff", fontWeight: 600, fontSize: 13, letterSpacing: "0.04em", padding: "16px 40px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.3)", cursor: "pointer", textDecoration: "none", display: "inline-block" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              See How It Works
            </a>
          </div>

          {/* Scroll hint */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.35, marginTop: 16 }}>
            <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#bfdbfe" }}>Scroll</span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(191,219,254,0.6), transparent)" }} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ background: "#fff", padding: "96px 0" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 32, height: 1, background: NAVY }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: NAVY }}>The Process</span>
          </div>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", marginBottom: 12, letterSpacing: "-0.01em" }}>How It Works</h2>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, maxWidth: 480, marginBottom: 64 }}>
            From payment to room key — the entire allocation process happens in four automated steps.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
            {STEPS.map((s) => (
              <div key={s.step} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 12px" }}>
                <div style={{ position: "relative", marginBottom: 24 }}>
                  <div style={{ width: 88, height: 88, borderRadius: "50%", background: "#EFF6FF", border: "2px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: `${NAVY}40`, userSelect: "none" }}>{s.step}</span>
                  </div>
                  <div style={{ position: "absolute", top: 8, right: 6, width: 12, height: 12, borderRadius: "50%", background: NAVY, boxShadow: `0 0 10px ${NAVY}80` }} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section id="features" style={{ background: "#F5F5F5", borderTop: "1px solid #E2E8F0", padding: "96px 0" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 32, height: 1, background: NAVY }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: NAVY }}>What It Does</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 56 }}>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em", maxWidth: 400, lineHeight: 1.2 }}>Built around three core objectives</h2>
            <p style={{ fontSize: 14, color: "#64748b", maxWidth: 340, lineHeight: 1.7 }}>Every feature maps directly to the system's research objectives — no bloat, no fluff.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {FEATURES.map((f) => (
              <div key={f.title}
                style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", cursor: "default", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${NAVY}50`; e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,58,110,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
                <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 4, background: "#EFF6FF", border: "1px solid #BFDBFE", color: NAVY, marginBottom: 18 }}>{f.tag}</span>
                <div style={{ fontSize: 30, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 10, lineHeight: 1.4 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <section id="stats" style={{ background: NAVY, padding: "72px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", ...GRID }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1152, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 8, letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#bfdbfe", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "rgba(191,219,254,0.6)", lineHeight: 1.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TWO PORTALS ──────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", borderTop: "1px solid #E2E8F0", padding: "96px 0" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 32, height: 1, background: NAVY }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: NAVY }}>Two Portals</span>
          </div>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", marginBottom: 56, letterSpacing: "-0.01em" }}>One system, two experiences</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

            {/* Student card */}
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 20, padding: 40, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${NAVY}40`; e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,58,110,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#EFF6FF", border: "1px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 22 }}>🎒</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Student Portal</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 28 }}>
                Log in, browse available halls filtered by your gender, request your room allocation, and download your official e-receipt — all in one place.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
                {["View all available halls and rooms", "One-click room allocation request", "Real-time payment status indicator", "Downloadable PDF e-receipt", "Roommate information display"].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, marginBottom: 10 }}>
                    <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ color: "#64748b" }}>{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/studentlogin" className="btn btn-primary btn-lg"
                onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = NAVY; }}

                style={{ width: "100%", padding: "12px 0", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 8, border: `2px solid ${NAVY}`, color: NAVY, background: "transparent", cursor: "pointer", transition: "all 0.2s" }}
              >
                Student Sign In →
              </Link>

            </div>

            {/* Admin card */}
            <div style={{ background: NAVY, borderRadius: 20, padding: 40, position: "relative", overflow: "hidden", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 40px rgba(30,58,110,0.35)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
              <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, borderRadius: "0 20px 0 100%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 22 }}>🛡</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Admin Console</h3>
                <p style={{ fontSize: 14, color: "#bfdbfe", lineHeight: 1.7, marginBottom: 28 }}>
                  A full management dashboard to oversee rooms, students, payments, and reports — with complete control over the allocation engine and system settings.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
                  {["Live occupancy dashboard with KPIs", "Room inventory — add, edit, set maintenance", "Student records with payment verification", "Analytics, effectiveness metrics & reports", "Configurable allocation rules & settings"].map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, marginBottom: 10 }}>
                      <span style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ color: "#bfdbfe" }}>{item}</span>
                    </li>
                  ))}
                </ul>


                <Link to="/adminlogin" className="btn btn-primary btn-lg"
                  style={{ width: "100%", padding: "12px 0", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 8, border: "none", background: "#fff", color: NAVY, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F0F4FF"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  Admin Sign In →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section style={{ background: NAVY, padding: "112px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "rgba(96,165,250,0.08)", filter: "blur(120px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "8px 20px", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#dbeafe" }}>System Active</span>
          </div>
          <h2 style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 20 }}>Ready to get your room?</h2>
          <p style={{ fontSize: 15, color: "#bfdbfe", lineHeight: 1.7, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
            Sign in with your matric number to browse available halls, request your allocation, and receive your official e-receipt instantly.
          </p>


          <p style={{ fontSize: 11, color: "rgba(191,219,254,0.5)", marginTop: 16 }}>No registration needed · Use your existing matric number</p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ background: NAVY_D, padding: "36px 0" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🏠</div>
            <span style={{ fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>HostelMS</span>
            <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 4px" }}>·</span>
            <span style={{ fontSize: 12, color: "#bfdbfe" }}>Automated Hostel Allocation System</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 12, color: "#bfdbfe" }}>
            <span>2025/2026 Session</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <span>Final Year Project</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>


            <Link to="/LoginPage" style={{ background: "none", border: "none", color: "#bfdbfe", cursor: "pointer", fontSize: 12, padding: 0 }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "#bfdbfe"}>
              Sign In →
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}