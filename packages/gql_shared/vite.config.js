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
      "@hrbolek/uoisfrontend-gql-shared": path.resolve(__dirname, "src/index.js"),
      "@hrbolek/uoisfrontend-shared": path.resolve(__dirname, "../../packages/shared/src")
    },
  },

  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "UoisfrontendGqlShared",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-redux",
        "react-bootstrap",
        "react-router-dom",
        "@reduxjs/toolkit",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-redux": "ReactRedux",
          "react-bootstrap": "ReactBootstrap",
          "react-router-dom": "ReactRouterDOM",
          "@reduxjs/toolkit": "RTK",
        },
      },
    },
  },
});
