# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

### Pexels API Integration (Inspiration Gallery & Moodboard)

This project uses the [Pexels API](https://www.pexels.com/api/) for curated and searched image inspiration. **Your API key must be stored securely.**

#### 1. Set up your API key

- Add a `.env` file in `visualoom_frontend/` (see `.env.example` below).  
- **Never** commit or expose secrets in your codebase.
- Follow the `.gitignore` rule to keep `.env` private.

Example:
```
REACT_APP_PEXELS_API_KEY=your-pexels-key-here
```

#### 2. Usage in code

Pexels API access is provided via the `usePexels` React hook:
```js
import { usePexels } from "./src/usePexels";

const { images, loading, error, fetchCurated } = usePexels();
useEffect(() => { fetchCurated({ per_page: 8 }); }, []);
```

- No keys are hardcoded; the hook securely reads your .env config at build.
- For inspiration galleries and moodboard image selection, use the hook to load curated or searched Pexels results.

#### 3. Demo

- To test, create `.env` and restart the dev server.
- See [src/usePexels.js](src/usePexels.js) for all options.

---

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---

## VS Code Extension Storage Migration Warning

When working with this project in Visual Studio Code, you may occasionally see a warning similar to:

```
[warn] File to move/copy does not exist (VS Code: 'extensionStorage/[...].json')
```

This message typically appears during extension storage migration (for example, when updating or restoring VS Code extensions, or moving the workspace between devices). Such warnings are common and harmless if the referenced state file was never created before. In other words, if you have not used features of an extension that would result in the creation of per-project state, VS Code may attempt to move a file that isn't present, resulting in this warning.

**What should I do?**
- _In almost all cases, **no action is needed** and these warnings can be safely ignored._  
- The warning does **not** prevent the app, your code, or your session from working correctly.
- If you use advanced VS Code extensions with workspace state, missing state files will simply be re-created as needed.

These messages are informational and are not errors. Only take further action if you are experiencing actual problems with a specific VS Code extension's functionality after migration.

