import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        raspberry: "#B0306A",
        blush: { DEFAULT: "#F6D6E4", soft: "#FBEAF1" },
        berry: "#7A1F4B",
        ink: { DEFAULT: "#222222", soft: "#3D2A33" },
        line: { DEFAULT: "#EFD3DF", strong: "#9E5C7B" },
        gold: { DEFAULT: "#C9A25B", ink: "#8C6420" },
        cap: "#2A0E1C",
        wa: { DEFAULT: "#13804A", ink: "#0F6B3D", dark: "#0D5E36" },
      },
      fontFamily: {
        display: ["var(--font-poppins)", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-dm-sans)", "DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(.16,1,.3,1)",
        io: "cubic-bezier(.65,0,.35,1)",
        spring: "cubic-bezier(.34,1.56,.64,1)",
      },
      keyframes: {
        "step-in-right": {
          from: { opacity: "0", transform: "translateX(28px)", filter: "blur(4px)" },
          to: { opacity: "1", transform: "none", filter: "none" },
        },
        "step-in-left": {
          from: { opacity: "0", transform: "translateX(-28px)", filter: "blur(4px)" },
          to: { opacity: "1", transform: "none", filter: "none" },
        },
        "blur-in": {
          from: { opacity: "0.01", transform: "translateY(18px)", filter: "blur(6px)" },
          to: { opacity: "1", transform: "none", filter: "none" },
        },
        pop: { "50%": { transform: "scale(1.08)" } },
        shake: { "20%,60%": { transform: "translateX(-6px)" }, "40%,80%": { transform: "translateX(6px)" } },
        "stamp-in": {
          from: { opacity: "0", transform: "scale(2.4) rotate(10deg)" },
          to: { opacity: "1", transform: "scale(1) rotate(-12deg)" },
        },
        "draw-check": { from: { strokeDashoffset: "48" }, to: { strokeDashoffset: "0" } },
        confetti: {
          "0%": { transform: "translateY(0) rotate(0)", opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(720deg)", opacity: "0" },
        },
        wiggle: { "0%,100%": { transform: "rotate(0)" }, "25%": { transform: "rotate(-12deg)" }, "60%": { transform: "rotate(8deg)" } },
      },
      animation: {
        "step-in-right": "step-in-right .45s cubic-bezier(.16,1,.3,1) both",
        "step-in-left": "step-in-left .45s cubic-bezier(.16,1,.3,1) both",
        "blur-in": "blur-in .7s cubic-bezier(.16,1,.3,1) both",
        pop: "pop .35s cubic-bezier(.34,1.56,.64,1)",
        shake: "shake .35s ease-in-out",
        "stamp-in": "stamp-in .55s .5s cubic-bezier(.34,1.56,.64,1) both",
        "draw-check": "draw-check .6s .25s cubic-bezier(.65,0,.35,1) both",
        wiggle: "wiggle .6s cubic-bezier(.34,1.56,.64,1)",
      },
    },
  },
  plugins: [],
};

export default config;
