"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  label,
  icon,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-1.5">
          {icon}
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all text-left text-sm ${
          open
            ? "bg-white/[0.07] border-violet-500/50 ring-1 ring-violet-500/25"
            : "bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-white/15"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selected?.icon}
          <span className={selected ? "text-white" : "text-white/30"}>
            {selected ? selected.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-neutral-950/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden animate-scale-in origin-top">
          <div className="max-h-[240px] overflow-y-auto py-1 custom-scrollbar">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                    isSelected
                      ? "bg-violet-500/10 text-white"
                      : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
