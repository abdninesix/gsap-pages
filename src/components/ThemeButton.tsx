"use client";

import React from "react";
import { useTheme } from "../utils/useTheme";
import { PiMoonStars, PiSunHorizon } from "react-icons/pi";

const ThemeButton = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className={`rounded-full flex items-center duration-200
      ${theme === "dark" ? "p-0 translate-x-2 rotate-[360deg]"
        : "p-2 -translate-x-2 rotate-0 bg-yellow-300 text-slate-900"}`}
      onClick={toggleTheme}>
      {theme === "dark" ? <PiMoonStars className="size-6" /> : <PiSunHorizon className="size-6" />}
    </div>
  );
};

export default ThemeButton;
