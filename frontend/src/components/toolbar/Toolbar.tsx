import {
  Camera,
  Clock,
  Disc,
  Palette,
  Projector,
  Settings,
  Target,
} from "lucide-react";
import { useState } from "react";
import ToolbarSection from "./ToolbarSection";

const SECTIONS = [
  { id: "color", icon: Palette, label: "Color" },
  { id: "camera", icon: Camera, label: "Camera" },
  { id: "projector", icon: Projector, label: "Projector" },
  { id: "detection", icon: Target, label: "Detection" },
  { id: "timing", icon: Clock, label: "Timing" },
  { id: "system", icon: Settings, label: "System" },
  { id: "recording", icon: Disc, label: "Recording" },
];

function Toolbar() {
  const [openSection, setOpenSection] = useState("color");

  return (
    <div className="h-56 shrink-0 flex flex-row overflow-x-auto overflow-y-hidden border-t border-white/5">
      {SECTIONS.map(({ id, icon, label }) => (
        <ToolbarSection
          key={id}
          icon={icon}
          label={label}
          open={openSection === id}
          onToggle={() => setOpenSection(id)}
        >
          <div className="text-xs text-neutral-600 tracking-widest uppercase">
            {label}
          </div>
        </ToolbarSection>
      ))}
    </div>
  );
}

export default Toolbar;
