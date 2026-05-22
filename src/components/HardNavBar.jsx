import { chapterGroups, nodes } from "../data/doorNodes.js";

export default function HardNavBar({ mode, started, activeChapter, hoveredChapter, chapterMenuOpen, openChapterMenu, scheduleCloseChapterMenu, closeChapterMenu, setHoveredChapterId, onPageOne, onSelectNode, onCreator, onReturnPlay, onSoundLab }) {
  return (
    <header className="relative z-40 -mx-4 border-b border-white/10 bg-slate-950/85 px-4 py-2 backdrop-blur md:-mx-6 md:px-6">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-sky-100/40">Doctor Who Interactive Lab</div>
          <div className="text-base font-semibold tracking-tight text-slate-100">Rose Door Workbench</div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-sky-200 px-3 py-1.5 text-xs text-slate-950">D&D Workbench</span>
          <div className="relative" onMouseEnter={openChapterMenu} onMouseLeave={scheduleCloseChapterMenu}>
            <button
              type="button"
              onClick={() => {
                if (chapterMenuOpen) closeChapterMenu();
                else openChapterMenu();
              }}
              className="h-[30px] rounded-full border border-white/10 bg-white/5 px-3 text-xs text-slate-200 transition hover:bg-white/10"
            >
              章节 · {started ? activeChapter.label : "Page 1"}
            </button>
            {chapterMenuOpen && (
              <div className="absolute right-0 top-[34px] z-50 flex min-w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur">
                <div className="w-40 border-r border-white/10 p-2">
                  {chapterGroups.map((chapter) => (
                    <button
                      key={chapter.id}
                      type="button"
                      onMouseEnter={() => setHoveredChapterId(chapter.id)}
                      className={`w-full rounded-xl px-3 py-2 text-left transition ${hoveredChapter.id === chapter.id ? "bg-sky-200/15 text-sky-50" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
                    >
                      <div className="text-xs font-semibold">{chapter.label}</div>
                      <div className="mt-0.5 truncate text-[10px] text-slate-500">{chapter.title}</div>
                    </button>
                  ))}
                </div>
                <div className="w-56 p-2">
                  <div className="mb-1 px-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">分支</div>
                  {hoveredChapter.page === "start" ? (
                    <button type="button" onClick={onPageOne} className="w-full rounded-xl px-3 py-2 text-left text-slate-300 transition hover:bg-white/5 hover:text-slate-100">
                      <div className="truncate text-xs font-semibold">Page 1</div>
                      <div className="mt-0.5 truncate text-[10px] text-slate-500">序章 / 角色准备</div>
                    </button>
                  ) : (
                    hoveredChapter.nodeIds.map((nodeId) => {
                      const item = nodes[nodeId];
                      return (
                        <button key={item.id} type="button" onClick={() => onSelectNode(item.id)} className="w-full rounded-xl px-3 py-2 text-left text-slate-300 transition hover:bg-white/5 hover:text-slate-100">
                          <div className="truncate text-xs font-semibold">{item.title}</div>
                          <div className="mt-0.5 truncate text-[10px] text-slate-500">{item.scene}</div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
          <button type="button" onClick={onSoundLab} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10">
            Sound Lab
          </button>
          {mode === "游玩" ? (
            <button type="button" onClick={onCreator} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10">
              创作者入口
            </button>
          ) : (
            <>
              <span className="rounded-full border border-sky-200/30 bg-sky-200/10 px-3 py-1.5 text-xs text-sky-100">搭建模式</span>
              <button type="button" onClick={onReturnPlay} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10">
                返回游玩
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
