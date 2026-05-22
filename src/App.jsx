import { useEffect, useState } from "react";
import DWDoorWorkbenchMockup from "./DWDoorWorkbenchMockup.jsx";
import DWSoundEffectLab from "./DWSoundEffectLab.jsx";

function scrollToStoryTextOnMobile() {
  if (!window.matchMedia("(max-width: 768px)").matches) return;
  window.setTimeout(() => {
    const marker = Array.from(document.querySelectorAll("div")).find((element) => element.textContent?.trim() === "关键物件");
    const target = marker?.closest(".rounded-3xl");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 160);
}

export default function App() {
  const [view, setView] = useState("door");

  useEffect(() => {
    function handleClick(event) {
      const button = event.target instanceof Element ? event.target.closest("button") : null;
      if (button?.textContent?.includes("确认结果")) scrollToStoryTextOnMobile();
    }

    function handleKeyDown(event) {
      const target = event.target;
      if (event.key === "Enter" && target instanceof HTMLInputElement && target.placeholder === "输入 1-20") {
        scrollToStoryTextOnMobile();
      }
    }

    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  return view === "door" ? <DWDoorWorkbenchMockup onOpenSoundLab={() => setView("sound")} /> : <DWSoundEffectLab />;
}
