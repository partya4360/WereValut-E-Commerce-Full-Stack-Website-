# React + Vite

## Production

Run `npm run build` in the `frontend` directory to create `frontend/dist`. Set
`NODE_ENV=production` when starting the backend from `Backend`; it serves this
build and the API from the same origin. The frontend uses same-origin API
requests by default. Set `VITE_API_BASE_URL` before building only when the API
is hosted on a different origin.

For separate Render web services, set `VITE_API_BASE_URL` on the frontend
service to the backend service URL (for example, `https://your-api.onrender.com`)
and redeploy the frontend. Set `FRONTEND_URL` on the backend service to the
frontend service URL. The API base URL is shared by storefront and admin API
requests.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
