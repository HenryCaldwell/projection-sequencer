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
import type { Color } from "../../lib/types";
import ColorPanel from "./ColorPanel";
import ToolbarSection from "./ToolbarSection";

type Props = {
  colors: Color[];
  onColorsChange: (colors: Color[]) => void;
};

function Toolbar({ colors, onColorsChange }: Props) {
  const [openSection, setOpenSection] = useState("color");

  const sections = [
    {
      id: "color",
      icon: Palette,
      label: "Color",
      content: <ColorPanel colors={colors} onColorsChange={onColorsChange} />,
    },
    {
      id: "camera",
      icon: Camera,
      label: "Camera",
      content: (
        <div className="text-xs text-neutral-600 tracking-widest uppercase">
          Camera
        </div>
      ),
    },
    {
      id: "projector",
      icon: Projector,
      label: "Projector",
      content: (
        <div className="text-xs text-neutral-600 tracking-widest uppercase">
          Projector
        </div>
      ),
    },
    {
      id: "detection",
      icon: Target,
      label: "Detection",
      content: (
        <div className="text-xs text-neutral-600 tracking-widest uppercase">
          Detection
        </div>
      ),
    },
    {
      id: "timing",
      icon: Clock,
      label: "Timing",
      content: (
        <div className="text-xs text-neutral-600 tracking-widest uppercase">
          Timing
        </div>
      ),
    },
    {
      id: "system",
      icon: Settings,
      label: "System",
      content: (
        <div className="text-xs text-neutral-600 tracking-widest uppercase">
          System
        </div>
      ),
    },
    {
      id: "recording",
      icon: Disc,
      label: "Recording",
      content: (
        <div className="text-xs text-neutral-600 tracking-widest uppercase">
          Recording
        </div>
      ),
    },
  ];

  return (
    <div className="h-56 shrink-0 flex flex-row overflow-x-auto overflow-y-hidden border-t border-white/5">
      {sections.map(({ id, icon, label, content }) => (
        <ToolbarSection
          key={id}
          icon={icon}
          label={label}
          open={openSection === id}
          onToggle={() => setOpenSection(id)}
        >
          {content}
        </ToolbarSection>
      ))}
    </div>
  );
}

export default Toolbar;
