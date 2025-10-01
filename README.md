# Rift-Rewind
Riot Hackathon 2025

## App scaffold
The React app lives in `app/` (created with Create React App for compatibility with current Node on this machine). It includes routing via `react-router-dom@6`, minimal pages, and an Amplify-ready ignore configuration.

### Prerequisites
- Node 18+ and npm
- GitHub repository connected to this directory (root contains `app/`)
- AWS account with Amplify access
- AWS CLI and Amplify CLI (optional for local `amplify init`): `npm i -g @aws-amplify/cli`

### Install & run locally
```bash
cd app
npm install
npm start
```
App runs at `http://localhost:3000`.

### Project structure (app/)
- `src/pages/Home.jsx` — Home route `/`
- `src/pages/About.jsx` — About route `/about`
- `src/pages/PlayerDetails.jsx` — Dynamic route `/player/:id`
- `src/App.js` — Router and top nav
- `src/index.js` — App bootstrap with BrowserRouter

### AWS Amplify hosting (GitHub-connected)
1. Push this repo to GitHub.
2. In AWS Console → Amplify Hosting → New app → Host web app → Connect GitHub → select this repo.
3. Choose the root as repository root. Build settings:
   - Monorepo path: `app`
   - Build command: `npm ci && npm run build`
   - Start command (preview builds): `npm start` (optional)
   - Output directory: `build`
4. Amplify will auto-detect Create React App and build from `app/` subfolder.

If Amplify doesn’t auto-detect monorepo path, add a build spec in the Amplify console with base directory `app`.

### Initializing Amplify locally (optional)
If you plan to add Auth/API/Storage locally first:
```bash
npm i -g @aws-amplify/cli
cd app
amplify configure   # one-time account/credentials setup (opens browser)
amplify init        # initialize backend environment in this project
# Later examples:
# amplify add auth | api | storage
# amplify push
```
This repo’s `.gitignore` ignores common Amplify-generated local files. Commit `amplify/` as needed per your workflow.

### Notes / TODOs
- TODO: Replace basic markup with Material UI components later.
- TODO: Wire API calls for player data and details pages.
- TODO: Add environment variables for API endpoints using `.env` files.