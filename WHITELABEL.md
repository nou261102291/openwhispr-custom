Whitelabel Summary for "Mitra"

Applied Changes (Required/Done):
- package.json: `name` -> `mitra`, `productName` -> `Mitra` (required)
- electron-builder.json: `appId` -> `com.mitra.app`, `productName` -> `Mitra`, protocol scheme -> `mitra` (required)
- src/index.html: `<title>` -> `Mitra` (required)
- src/utils/agentName.ts: default agent name -> `Mitra` (required)

Placeholders / To Be Supplied (Optional):
- App icons: add Windows `.ico`, macOS `.icns`, and Linux `.png` at `src/assets/` (sizes required: 16/32/64/128/256/512/1024).
 - App icons: add Windows `.ico`, macOS `.icns`, and Linux `.png` at `src/assets/` (sizes required: 16/32/64/128/256/512/1024).
 - Icon generation: run `node scripts/generate-icons.js` after installing `sharp` and `png-to-ico` to produce required sizes into `resources/icons/` and copy a 512px PNG into `src/assets/icon.png`.
- Brand color: primary color set to `#90EE90` (light green) — update Tailwind config or CSS variables if desired.
- App ID / reverse-DNS: current `com.mitra.app` is a placeholder; replace with your real domain-style identifier if available.
- Legal/author: update `author` and `license` metadata in `package.json` if needed.

Optional Changes Recommended:
- Replace instances of the string "OpenWhispr" in `src/locales/*/translation.json` files to `Mitra` for localized UI strings.
- Update README, LICENSE header text, and other documentation references.
- Update `resources/` scripts and installer metadata (NSIS, flatpak, etc.) if you want fully branded installers.

Notes & Next Steps:
- The project still requires a clean `npm install` to run `scripts/*` download/build steps. Run in an elevated PowerShell and ensure no node/electron processes are running.
- If downloads from GitHub return 403, set `GITHUB_TOKEN` in the environment.
- I can continue: (1) replace localized strings, (2) add placeholder icons, (3) apply brand color to CSS/Tailwind, (4) run `npm install` and build assets. Which would you like next?
