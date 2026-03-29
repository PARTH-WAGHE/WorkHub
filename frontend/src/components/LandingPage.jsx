import ThemeToggle from "./ThemeToggle.jsx";

const productPillars = [
  {
    title: "People Directory",
    description:
      "Track employee records, profiles, and status updates from one clean workspace.",
  },
  {
    title: "Role-Aware Access",
    description:
      "Keep sensitive actions in admin hands while giving employees secure self-service flows.",
  },
  {
    title: "Fast Daily Ops",
    description:
      "Search, filter, edit, and review data quickly so teams spend less time on admin tasks.",
  },
];

const quickStats = [
  { value: "99.9%", label: "Uptime Ready" },
  { value: "1 Hub", label: "For Every Team" },
  { value: "24/7", label: "Operational Visibility" },
];

const workflow = [
  {
    step: "01",
    title: "Invite & Onboard",
    details: "Create accounts and add core employee details in minutes.",
  },
  {
    step: "02",
    title: "Organize & Control",
    details: "Assign departments, permissions, and maintain structured records.",
  },
  {
    step: "03",
    title: "Operate & Improve",
    details: "Use fast search and updates to keep operations accurate and current.",
  },
];

export default function LandingPage({
  onGetStarted,
  onJoinNow,
  theme = "dark",
  onThemeChange,
}) {
  const isDark = theme === "dark";

  const palette = isDark
    ? {
        shell: "bg-[#041a2f] text-slate-100",
        orbA: "bg-[#17bebb]/30",
        orbB: "bg-[#ff9f1c]/30",
        orbC: "bg-[#5b8df8]/25",
        grid: "opacity-25",
        headerBorder: "border-white/10",
        headerOverlay: "backdrop-blur-sm",
        logoCircle:
          "bg-gradient-to-br from-cyan-300 to-blue-500 text-[#042447] shadow-cyan-500/40",
        title: "text-white",
        subtitle: "text-cyan-200/90",
        accentPill: "border-cyan-200/30 bg-cyan-300/10 text-cyan-100",
        heading: "text-white",
        body: "text-slate-200",
        statCard: "border-white/20 bg-white/10",
        statText: "text-white",
        statLabel: "text-slate-200",
        snapshotOuter: "border-white/20 bg-[#06223f]/85",
        snapshotInner: "border-cyan-100/20 bg-slate-900/70",
        snapshotLine: "border-white/10",
        snapshotLabel: "text-cyan-200",
        snapshotTitle: "text-white",
        updatedPill: "bg-emerald-400/15 text-emerald-300",
        progressCard: "border-white/10 bg-white/5",
        progressTrack: "bg-white/10",
        progressText: "text-slate-200",
        metricPrimary: "text-cyan-200",
        metricSecondary: "text-orange-200",
        metricTertiary: "text-violet-200",
        featureCard: "border-white/20 bg-white/10",
        featureTitle: "text-white",
        featureBody: "text-slate-200",
        ctaPrimary:
          "border-cyan-200/70 bg-cyan-300/20 text-white hover:bg-cyan-300/30",
        ctaSecondary:
          "border-orange-200/70 bg-orange-400/20 text-white hover:bg-orange-400/30",
        ctaWorkflow:
          "border-cyan-100/70 bg-cyan-400/20 text-white hover:bg-cyan-400/30",
        workflowShell: "border-white/20 bg-[#052747]/80 shadow-[#041a2f]/40",
        workflowTag: "text-cyan-200",
        workflowTitle: "text-white",
        workflowItem: "border-white/15 bg-slate-900/40",
      }
    : {
        shell: "bg-[#f4efe2] text-slate-900",
        orbA: "bg-[#22d3ee]/30",
        orbB: "bg-[#f59e0b]/30",
        orbC: "bg-[#60a5fa]/25",
        grid: "opacity-35",
        headerBorder: "border-slate-300/70",
        headerOverlay: "backdrop-blur-sm bg-white/55",
        logoCircle:
          "bg-gradient-to-br from-[#0ea5e9] to-[#6366f1] text-white shadow-blue-500/30",
        title: "text-slate-900",
        subtitle: "text-slate-600",
        accentPill: "border-slate-400/50 bg-white/70 text-slate-700",
        heading: "text-slate-900",
        body: "text-slate-700",
        statCard: "border-slate-300/80 bg-white/80",
        statText: "text-slate-900",
        statLabel: "text-slate-600",
        snapshotOuter: "border-slate-300/70 bg-white/80",
        snapshotInner: "border-slate-300/80 bg-[#eef4ff]/85",
        snapshotLine: "border-slate-300/70",
        snapshotLabel: "text-sky-700",
        snapshotTitle: "text-slate-900",
        updatedPill: "bg-emerald-100 text-emerald-700",
        progressCard: "border-slate-300/70 bg-white/80",
        progressTrack: "bg-slate-200",
        progressText: "text-slate-700",
        metricPrimary: "text-cyan-700",
        metricSecondary: "text-amber-700",
        metricTertiary: "text-violet-700",
        featureCard: "border-slate-300/80 bg-white/85",
        featureTitle: "text-slate-900",
        featureBody: "text-slate-700",
        ctaPrimary:
          "border-sky-500/80 bg-sky-100 text-sky-900 hover:bg-sky-200",
        ctaSecondary:
          "border-amber-500/80 bg-amber-100 text-amber-900 hover:bg-amber-200",
        ctaWorkflow:
          "border-sky-500/80 bg-sky-100 text-sky-900 hover:bg-sky-200",
        workflowShell: "border-slate-300/80 bg-white/80 shadow-slate-300/60",
        workflowTag: "text-sky-700",
        workflowTitle: "text-slate-900",
        workflowItem: "border-slate-300/70 bg-white/80",
      };

  return (
    <div className={`min-h-screen relative overflow-hidden ${palette.shell}`}>
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute -top-24 left-[-5%] h-80 w-80 rounded-full blur-3xl animate-lp-drift-slow ${palette.orbA}`}
        />
        <div
          className={`absolute top-40 right-[-6%] h-96 w-96 rounded-full blur-3xl animate-lp-drift-fast ${palette.orbB}`}
        />
        <div
          className={`absolute bottom-[-8rem] left-1/2 h-96 w-[34rem] -translate-x-1/2 rounded-[999px] blur-3xl ${palette.orbC}`}
        />
        <div
          className={`absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] ${palette.grid}`}
        />
      </div>

      <header className={`relative z-10 border-b ${palette.headerBorder} ${palette.headerOverlay}`}>
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:flex-nowrap sm:px-8 sm:py-5">
          <div className="flex items-center gap-3">
            <div className={`grid h-10 w-10 place-items-center rounded-xl font-black shadow-lg ${palette.logoCircle}`}>
              W
            </div>
            <div>
              <p className={`text-xl font-black tracking-tight ${palette.title}`}>
                WorkHub
              </p>
              <p
                className={`text-[10px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.22em] ${palette.subtitle}`}
              >
                Employee Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle
              theme={theme}
              onChange={onThemeChange}
              size="sm"
              className={
                isDark
                  ? "border-white/30 bg-black/20"
                  : "border-slate-400/60 bg-black/20"
              }
            />
            <button
              type="button"
              onClick={onGetStarted}
              className={`rounded-xl border px-3.5 py-2 text-[11px] font-bold transition-all duration-200 sm:px-4 sm:text-xs ${
                isDark
                  ? "border-cyan-200/40 bg-white/10 text-white hover:bg-white/20"
                  : "border-slate-500 bg-slate-900 text-slate-100 hover:bg-slate-700"
              }`}
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-8 sm:pt-12 lg:pb-20">
        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${palette.accentPill}`}>
              Built For Growing Teams
            </span>

            <h1
              className={`max-w-2xl text-3xl font-black leading-tight sm:text-5xl lg:text-6xl ${palette.heading}`}
            >
              The command center for your people operations.
            </h1>

            <p className={`max-w-xl text-base leading-relaxed sm:text-lg ${palette.body}`}>
              WorkHub centralizes employee data, secure access, and day-to-day
              updates so your organization can move faster with confidence.
            </p>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onGetStarted}
                className={`w-full rounded-xl border-2 px-6 py-3 text-sm font-extrabold transition-all duration-200 hover:shadow-lg sm:w-auto ${palette.ctaPrimary}`}
              >
                Enter Dashboard
              </button>
              <button
                type="button"
                onClick={onJoinNow}
                className={`w-full rounded-xl border-2 px-6 py-3 text-sm font-extrabold transition-all duration-200 hover:shadow-lg sm:w-auto ${palette.ctaSecondary}`}
              >
                Create Account
              </button>
            </div>

            <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {quickStats.map((item) => (
                <article
                  key={item.label}
                  className={`rounded-2xl border p-4 text-center backdrop-blur-md ${palette.statCard}`}
                >
                  <p className={`text-2xl font-black sm:text-3xl ${palette.statText}`}>
                    {item.value}
                  </p>
                  <p className={`mt-1 text-xs uppercase tracking-[0.12em] ${palette.statLabel}`}>
                    {item.label}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative animate-lp-rise">
            <div className={`rounded-3xl border p-4 shadow-[0_25px_80px_rgba(7,11,34,0.22)] backdrop-blur-lg sm:p-6 ${palette.snapshotOuter}`}>
              <div className={`rounded-2xl border p-4 sm:p-5 ${palette.snapshotInner}`}>
                <div className={`mb-5 flex items-center justify-between border-b pb-4 ${palette.snapshotLine}`}>
                  <div>
                    <p className={`text-xs uppercase tracking-[0.16em] ${palette.snapshotLabel}`}>
                      Live Snapshot
                    </p>
                    <p className={`mt-1 text-lg font-bold ${palette.snapshotTitle}`}>
                      Team Activity Today
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${palette.updatedPill}`}>
                    <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                    Updated
                  </span>
                </div>

                <div className="space-y-3">
                  <div className={`rounded-xl border p-3 ${palette.progressCard}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${palette.progressText}`}>New Profiles Added</p>
                      <p className={`text-lg font-black ${palette.metricPrimary}`}>14</p>
                    </div>
                    <div className={`mt-2 h-2 rounded-full ${palette.progressTrack}`}>
                      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 animate-lp-grow" />
                    </div>
                  </div>

                  <div className={`rounded-xl border p-3 ${palette.progressCard}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${palette.progressText}`}>Department Coverage</p>
                      <p className={`text-lg font-black ${palette.metricSecondary}`}>92%</p>
                    </div>
                    <div className={`mt-2 h-2 rounded-full ${palette.progressTrack}`}>
                      <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-orange-300 to-yellow-300 animate-lp-grow" />
                    </div>
                  </div>

                  <div className={`rounded-xl border p-3 ${palette.progressCard}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${palette.progressText}`}>Pending Approvals</p>
                      <p className={`text-lg font-black ${palette.metricTertiary}`}>5</p>
                    </div>
                    <div className={`mt-2 h-2 rounded-full ${palette.progressTrack}`}>
                      <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-violet-300 to-fuchsia-300 animate-lp-grow" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productPillars.map((pillar, index) => (
            <article
              key={pillar.title}
              className={`rounded-2xl border p-5 backdrop-blur-lg animate-fade-in-up ${palette.featureCard}`}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <h2 className={`text-xl font-black ${palette.featureTitle}`}>{pillar.title}</h2>
              <p className={`mt-2 text-sm leading-relaxed ${palette.featureBody}`}>
                {pillar.description}
              </p>
            </article>
          ))}
        </section>

        <section className={`mt-14 rounded-3xl border p-6 shadow-xl sm:p-8 ${palette.workflowShell}`}>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={`text-xs uppercase tracking-[0.2em] ${palette.workflowTag}`}>
                Simple Workflow
              </p>
              <h2
                className={`mt-2 text-2xl font-black sm:text-3xl ${palette.workflowTitle}`}
              >
                From onboarding to everyday management.
              </h2>
            </div>
            <button
              type="button"
              onClick={onGetStarted}
              className={`w-full rounded-xl border-2 px-5 py-3 text-sm font-extrabold transition-all duration-200 hover:shadow-lg sm:w-auto ${palette.ctaWorkflow}`}
            >
              Launch WorkHub
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workflow.map((item) => (
              <article
                key={item.step}
                className={`rounded-2xl border p-4 ${palette.workflowItem}`}
              >
                <p className={`text-sm font-black tracking-[0.14em] ${palette.workflowTag}`}>
                  STEP {item.step}
                </p>
                <h3 className={`mt-2 text-lg font-bold ${palette.workflowTitle}`}>{item.title}</h3>
                <p className={`mt-2 text-sm ${palette.featureBody}`}>{item.details}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        @keyframes lpDriftSlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(32px, -18px); }
        }

        @keyframes lpDriftFast {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-36px, 22px); }
        }

        @keyframes lpGrow {
          0% { transform: scaleX(0.55); opacity: 0.4; }
          100% { transform: scaleX(1); opacity: 1; }
        }

        @keyframes lpRise {
          0% { transform: translateY(18px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .animate-lp-drift-slow {
          animation: lpDriftSlow 11s ease-in-out infinite;
        }

        .animate-lp-drift-fast {
          animation: lpDriftFast 9s ease-in-out infinite;
        }

        .animate-lp-grow {
          transform-origin: left center;
          animation: lpGrow 1.1s ease-out;
        }

        .animate-lp-rise {
          animation: lpRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
}
