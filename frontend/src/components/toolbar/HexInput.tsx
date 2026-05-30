import { useEffect, useState, type ChangeEvent } from "react";

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

type Props = {
  hex: string;
  onHexChange: (hex: string) => void;
};

function HexInput({ hex, onHexChange }: Props) {
  const [draft, setDraft] = useState(hex);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    setDraft(hex);
    setValid(true);
  }, [hex]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDraft(value);
    const full = value.startsWith("#") ? value : "#" + value;

    if (isValidHex(full)) {
      setValid(true);
      onHexChange(full);
    } else {
      setValid(false);
    }
  };

  const handleBlur = () => {
    const full = draft.startsWith("#") ? draft : "#" + draft;

    if (!isValidHex(full)) {
      setDraft(hex);
      setValid(true);
    }
  };

  return (
    <input
      value={draft}
      onChange={handleChange}
      onBlur={handleBlur}
      spellCheck={false}
      className={`w-20 px-2 py-1 rounded-sm bg-white/5 border text-xs text-center outline-none tracking-wider ${valid ? "border-white/10 text-neutral-500" : "border-red-500/40 text-red-500"}`}
    />
  );
}

export default HexInput;
