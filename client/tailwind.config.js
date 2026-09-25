/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    // Overridden (not extended): this app's existing CSS was written desktop-first with
    // ad hoc max-width breakpoints. These mirror the exact pixel values already in use so
    // porting away from styled-components doesn't shift any responsive behavior.
    // NOTE: must live under `theme`, not top-level — Tailwind 3.4 does not treat a
    // top-level `screens` key as shorthand for `theme.screens` (it's silently ignored).
    // NOTE: order matters. Tailwind emits screens in declaration order, and for
    // equal-specificity rules the later one in the stylesheet wins. Multiple max-width
    // breakpoints can be simultaneously true at one viewport (e.g. a 300px-wide phone
    // matches max-320, max-380, ..., max-1212 all at once), so the narrower/more-specific
    // max-* must be declared LAST to correctly win over the wider ones. min-* breakpoints
    // are the opposite (mobile-first), so they stay smallest-to-largest.
    screens: {
      "max-1212": { max: "1212px" },
      "max-1200": { max: "1200px" },
      "max-992": { max: "992px" },
      "max-768": { max: "768px" },
      "max-480": { max: "480px" },
      "max-380": { max: "380px" },
      "max-320": { max: "320px" },
      "min-768": { min: "768px" },
      "min-992": { min: "992px" },
      "min-1200": { min: "1200px" },
    },
    extend: {
      colors: {
        bg: "var(--bg-color)",
        fg: "var(--text-color)",
        muted: "var(--muted-text)",
        link: "var(--link-color)",
        description: "var(--description-color)",
        header: "var(--header-color)",
        card: "var(--card-bg)",
        "card-hover": "var(--card-hover-bg)",
        chip: "var(--chip-bg)",
        "chip-hover": "var(--chip-hover-bg)",
        border: "var(--border-color)",
        "select-tag": "var(--select-tag)",
        "result-container": "var(--result-container-bg)",
        "search-placeholder": "var(--search-placeholder)",
        "tag-hover": "var(--tag-hover-bg)",
        "rmp-underline": "var(--rmp-link-underline)",
      },
      boxShadow: {
        base: "var(--box-shadow-base)",
        inactive: "var(--box-shadow-inactive)",
        active: "var(--box-shadow-active)",
        "section-card": "var(--section-card-shadow)",
      },
      fontFamily: {
        gilroy: ["Gilroy", "sans-serif"],
        "gilroy-light": ["Gilroy-Light", "sans-serif"],
        "gilroy-regular": ["Gilroy-Regular", "sans-serif"],
        "gilroy-semibold": ["Gilroy-SemiBold", "sans-serif"],
        "gilroy-bold": ["Gilroy-Bold", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0%)", opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 300ms ease-out backwards",
        slideUp: "slideUp 300ms ease-out backwards",
      },
    },
  },
  plugins: [],
  corePlugins: {
    // Disabled: antd/dist/antd.css already ships its own base reset tuned to its
    // components (Button, Input, List, Pagination, Spin, Popover, Tooltip, ...).
    // Tailwind's preflight loads after it and would strip/override those component
    // styles (button chrome, heading margins, etc.) since we're keeping antd as-is.
    preflight: false,
  },
};
