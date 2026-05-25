import { useState } from "react";
import DWDoorWorkbenchMockup from "./DWDoorWorkbenchMockup.jsx";
import DWSoundEffectLab from "./DWSoundEffectLab.jsx";

export default function App() {
  const [view, setView] = useState("door");

  return view === "door" ? <DWDoorWorkbenchMockup onOpenSoundLab={() => setView("sound")} /> : <DWSoundEffectLab onBackToWorkbench={() => setView("door")} />;
}
