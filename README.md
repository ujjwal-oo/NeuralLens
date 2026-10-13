# NeuralLens: Inside the Algorithm

Interactive deep learning playground (React + Vite). Runs fully in the browser.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Each playground lives in `src/modules/<name>.js` (logic) and `src/panes/<name>.html` (markup). To add one, create both files, then register them in `src/modules/index.js` and `src/data/tabs.js`.
