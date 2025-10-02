"use client";

import React from "react";
import { useTheme } from "../utils/useTheme";
import { PiMoonStarsFill, PiSunHorizonFill } from "react-icons/pi";

const ThemeButton = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className={`cursor-pointer flex duration-400
      ${theme === "dark" ? "rotate-[270deg] translate-x-1 text-yellow-100"
        : "rotate-0 -translate-x-1 text-yellow-400"}`}
      onClick={toggleTheme}>
      {theme === "dark" ? <PiMoonStarsFill className="size-6" /> : <PiSunHorizonFill className="size-6" />}
    </div>
  );
};

export default ThemeButton;
