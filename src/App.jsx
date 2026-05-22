import { useState } from "react";
import DWDoorWorkbenchMockup from "./DWDoorWorkbenchMockup.jsx";
import DWSoundEffectLab from "./DWSoundEffectLab.jsx";

export default function App() {
  const [view, setView] = useState("door");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-sky-100/50">Doctor Who interactive lab</div>
            <div className="text-lg font-semibold">Rose Door Workbench</div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setView("door")} className={`rounded-full px-4 py-2 text-sm transition ${view === "door" ? "bg-sky-200 text-slate-950" : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}>
              D&D Workbench
            </button>
            <button type="button" onClick={() => setView("sound")} className={`rounded-full px-4 py-2 text-sm transition ${view === "sound" ? "bg-amber-200 text-slate-950" : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}>
              Sound Lab
            </button>
          </div>
        </div>
      </nav>
      {view === "door" ? <DWDoorWorkbenchMockup /> : <DWSoundEffectLab />}
    </div>
  );
}
