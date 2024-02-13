import { defineConfig, configDefaults } from 'vite';

export default defineConfig(({ command }) => {
  return {
    build: {
      lib: {
        entry: 'src/main.js',
        name: 'noir-ethereum-history-api',
        // the proper extensions will be added
        fileName: (format) => `my-lib.${format}.js`
      }
    },
    test: {
      globals: true,
      exclude: [...configDefaults.exclude, 'dist']
    }
  };
});
