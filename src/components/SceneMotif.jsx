import { useMemo } from "react";

function Badge({ children }) {
  return <span className="rounded-full border border-sky-300/20 bg-sky-300/5 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-sky-100/70">{children}</span>;
}
function DoorMotif({ active }) {
  return (
    <div className="relative mx-auto flex h-44 w-28 items-center justify-center">
      <div className={`absolute left-1/2 top-4 h-36 w-2.5 -translate-x-1/2 rounded-full bg-amber-300 blur-xl transition-all duration-700 ${active ? "opacity-100 scale-y-110" : "opacity-50 scale-y-95"}`} />
      <div className="absolute h-40 w-24 rounded-t-2xl border border-sky-200/15 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-950 shadow-[0_0_40px_rgba(14,165,233,.15)]" />
      <div className="absolute top-7 grid grid-cols-2 gap-1.5">
        {[0, 1, 2, 3].map((n) => (
          <div key={n} className="h-6 w-6 rounded-md border border-sky-100/20 bg-sky-100/10 shadow-inner" />
        ))}
      </div>
      <div className="absolute bottom-7 left-1/2 h-24 w-[3px] -translate-x-1/2 rounded-full bg-amber-200 shadow-[0_0_18px_rgba(251,191,36,.9)]" />
      <div className="absolute bottom-16 right-5 h-2.5 w-2.5 rounded-full border border-amber-100/60 bg-amber-200/70" />
      <div className="absolute bottom-4 rounded bg-white/5 px-2.5 py-1 text-[8px] font-semibold tracking-[0.22em] text-white/60">PULL</div>
    </div>
  );
}

function PhoneMotif() {
  return (
    <div className="mx-auto flex h-44 w-28 items-center justify-center">
      <div className="h-40 w-24 rounded-[28px] border border-sky-100/20 bg-slate-950 p-2 shadow-[0_0_35px_rgba(56,189,248,.12)]">
        <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-slate-600/60" />
        <div className="flex h-[120px] flex-col justify-between rounded-2xl border border-sky-100/10 bg-gradient-to-b from-sky-950/80 to-slate-900 p-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[7px] text-sky-100/45">
              <span>NO SERVICE</span>
              <span>17%</span>
            </div>
            <div className="h-2 w-12 rounded-full bg-sky-100/25" />
            <div className="h-2 w-8 rounded-full bg-sky-100/15" />
          </div>
          <div className="rounded-xl border border-amber-100/20 bg-amber-100/10 p-2 text-[8px] font-semibold leading-3 text-amber-100">NO SENDER</div>
          <div className="h-2 w-10 rounded-full bg-sky-100/20" />
        </div>
      </div>
    </div>
  );
}

function ThresholdMotif() {
  return (
    <div className="relative mx-auto flex h-44 w-28 items-center justify-center overflow-hidden rounded-2xl border border-amber-100/10 bg-black/20">
      <div className="absolute h-40 w-16 rounded-full bg-amber-200/25 blur-2xl" />
      <div className="absolute left-1/2 h-44 w-[3px] -translate-x-1/2 bg-amber-100 shadow-[0_0_30px_rgba(251,191,36,.9)]" />
      <div className="absolute bottom-8 h-20 w-32 rotate-12 rounded-[50%] border border-amber-100/20" />
      <div className="absolute top-8 h-16 w-20 rounded-[50%] border border-sky-100/15" />
      <div className="absolute bottom-5 text-[8px] uppercase tracking-[0.22em] text-amber-100/70">threshold</div>
    </div>
  );
}

function ShadowMotif() {
  return (
    <div className="relative mx-auto flex h-44 w-28 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50">
      <div className="absolute top-8 h-24 w-16 rounded-t-2xl border border-sky-100/15 bg-blue-950/70" />
      <div className="absolute bottom-8 left-1/2 h-20 w-7 -translate-x-1/2 skew-x-[-18deg] rounded-full bg-slate-900 shadow-[0_0_22px_rgba(15,23,42,.9)]" />
      <div className="absolute right-5 top-14 h-2.5 w-2.5 rounded-full bg-amber-200/80" />
      <div className="absolute bottom-5 text-[8px] uppercase tracking-[0.22em] text-slate-400">exit?</div>
    </div>
  );
}

export default function SceneMotif({ nodeId, active, tags }) {
  const motif = useMemo(() => {
    if (nodeId === "phone") return <PhoneMotif />;
    if (nodeId === "pull") return <ThresholdMotif />;
    if (nodeId === "stepback") return <ShadowMotif />;
    return <DoorMotif active={active} />;
  }, [nodeId, active]);

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-3">
      {motif}
      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
}
