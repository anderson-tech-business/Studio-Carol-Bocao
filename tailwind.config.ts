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
        /* Landing: loops decorativos (CSS puro, sem depender de JS) */
        "line-up": { from: { transform: "translateY(110%) rotate(4deg)" }, to: { transform: "none" } },
        "polish-fill": { to: { backgroundSize: "100% 100%" } },
        gloss: { from: { backgroundPosition: "120% 0" }, to: { backgroundPosition: "-130% 0" } },
        drip: { from: { transform: "scaleY(.35)" }, to: { transform: "scaleY(1)" } },
        fall: { "0%,55%": { transform: "translateY(0)", opacity: "1" }, "100%": { transform: "translateY(130px)", opacity: "0" } },
        wave: { to: { rotate: "360deg" } },
        sway: { "0%,100%": { transform: "rotate(-3deg)" }, "50%": { transform: "rotate(3deg)" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        marquee: { to: { transform: "translateX(-50%)" } },
        beat: { "70%": { boxShadow: "0 0 0 10px rgba(201,162,91,0)" }, "100%": { boxShadow: "0 0 0 0 rgba(201,162,91,0)" } },
        "pin-bob": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        "pulse-ring": { "0%": { transform: "scale(.5)", opacity: "1" }, "100%": { transform: "scale(3.4)", opacity: "0" } },
        "pulse-ring-sm": { from: { transform: "scale(1)", opacity: ".7" }, to: { transform: "scale(1.7)", opacity: "0" } },
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
        "line-up": "line-up 1.1s cubic-bezier(.16,1,.3,1) both",
        "line-up-fill": "line-up 1.1s cubic-bezier(.16,1,.3,1) both, polish-fill 1.3s 1s cubic-bezier(.65,0,.35,1) forwards",
        "line-up-gloss": "line-up 1.1s cubic-bezier(.16,1,.3,1) both, gloss 4s 2s linear infinite",
        drip: "drip 6s cubic-bezier(.65,0,.35,1) infinite alternate",
        fall: "fall 6s ease-in infinite",
        wave: "wave 7s linear infinite",
        "wave-slow": "wave 9s linear infinite",
        sway: "sway 6s ease-in-out infinite",
        floaty: "floaty 5s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "marquee-rev": "marquee 36s linear infinite reverse",
        "spin-slow": "spin 18s linear infinite",
        "spin-slower": "spin 24s linear infinite",
        "spin-6": "spin 6s linear infinite",
        beat: "beat 2s infinite",
        "pin-bob": "pin-bob 2.4s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
        "pulse-ring-sm": "pulse-ring-sm 2.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
