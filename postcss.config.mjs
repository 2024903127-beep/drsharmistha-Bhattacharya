export default {
  plugins: {
    "@tailwindcss/postcss": {},
    "@csstools/postcss-color-mix-function": { preserve: false },
    "@csstools/postcss-oklab-function": { preserve: true },
    "@csstools/postcss-cascade-layers": {},
    autoprefixer: {
      overrideBrowserslist: [
        ">= 0.2%",
        "iOS >= 13",
        "Safari >= 13",
        "Chrome >= 80",
        "Firefox >= 80",
        "not dead",
      ],
    },
  },
};
