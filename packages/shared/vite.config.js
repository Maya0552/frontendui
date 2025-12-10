import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Když někdo v tomhle balíku (nebo jeho deps) udělá
      // import '@hrbolek/uoisfrontend-gql-shared'
      // → vezme se přímo src/index.js, ne package.json/main/dist
      "@hrbolek/uoisfrontend-shared": path.resolve(__dirname, "src/index.js"),
    },
  },

  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // external: (id) =>
      //   /^react($|\/)/.test(id) ||        // react, react/jsx-runtime, ...
      //   /^react-dom($|\/)/.test(id) ||    // react-dom, react-dom/client, ...
      //   [
      //     "react-redux",
      //     "react-bootstrap",
      //     "react-router-dom",
      //     "@reduxjs/toolkit",
      //   ].includes(id),
      // external: vše, co NENÍ relativní/absolutní cesta (tj. import z node_modules)
      external: (id) => {
        if (id.startsWith("@hrbolek/uoisfrontend")) return true;
        if (id.startsWith(".") || path.isAbsolute(id)) return false;
        return true;
      },
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-redux": "ReactRedux",
          "react-bootstrap": "ReactBootstrap",
          "react-router-dom": "ReactRouterDOM",
          "@reduxjs/toolkit": "RTK",
          "react-is": "ReactIs", 
        },
      },
    },
  },
});
