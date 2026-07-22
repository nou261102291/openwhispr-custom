const DEFAULT_DEV_SERVER_PORT = 5183;
const parseDevServerPort = () => {
  const raw =
    process.env.OPENWHISPR_DEV_SERVER_PORT ||
    process.env.VITE_DEV_SERVER_PORT ||
    String(DEFAULT_DEV_SERVER_PORT);
  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    return DEFAULT_DEV_SERVER_PORT;
  }

  return parsed;
};

const DEV_SERVER_PORT = parseDevServerPort();
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}/`;

class DevServerManager {
  static async waitForDevServer(url = DEV_SERVER_URL, maxAttempts = 30, delay = 1000) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const http = require("http");
        const urlObj = new URL(url);

        const result = await new Promise((resolve) => {
          const req = http.get(
            {
              hostname: urlObj.hostname,
              port: urlObj.port || 80,
              path: urlObj.pathname,
              timeout: 2000,
            },
            (res) => {
              resolve(res.statusCode >= 200 && res.statusCode < 400);
            }
          );

          req.on("error", () => resolve(false));
          req.on("timeout", () => {
            req.destroy();
            resolve(false);
          });
        });

        if (result) {
          return true;
        }
      } catch {
        // Dev server not ready yet, continue waiting
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return false;
  }

  static getAppUrl(isControlPanel = false) {
    if (process.env.NODE_ENV === "development") {
      return isControlPanel ? `${DEV_SERVER_URL}?panel=true` : DEV_SERVER_URL;
    } else {
      // For production, return null - caller should use loadFile() instead
      return null;
    }
  }

  /**
   * Get the path to the index.html file for production builds.
   * In Electron 36+, loadFile() is preferred over loadURL() with file:// protocol.
   * @param {boolean} isControlPanel - Whether this is for the control panel
   * @returns {{ path: string, query: object } | null} - Path info for loadFile() or null for dev
   */
  static getAppFilePath(isControlPanel = false) {
    if (process.env.NODE_ENV === "development") {
      return null; // Use getAppUrl() for dev server
    }

    const path = require("path");
    const { app } = require("electron");

    // In packaged app, files are relative to app.getAppPath()
    const appPath = app.getAppPath();

    // Try a few common locations for the built renderer files. Different
    // packaging/build steps may place the Vite output under `src/dist` or
    // directly under `dist` inside the app path or asar. Return the first
    // existing path so loadFile() succeeds in both dev and packaged layouts.
    const fs = require("fs");

    const candidates = [
      path.join(appPath, "src", "dist", "index.html"),
      path.join(appPath, "dist", "index.html"),
      path.join(appPath, "index.html"),
    ];

    for (const candidate of candidates) {
      try {
        // If the candidate path points inside an ASAR archive, `fs.existsSync`
        // may return false even though Electron can load the file from the
        // archive. In that case, accept the asar path and return it so
        // `BrowserWindow.loadFile()` can resolve it internally.
        if (candidate.includes(".asar")) {
          return { path: candidate, query: isControlPanel ? { panel: "true" } : {} };
        }

        if (fs.existsSync(candidate)) {
          return { path: candidate, query: isControlPanel ? { panel: "true" } : {} };
        }
      } catch (e) {
        // ignore and try next
      }
    }

    // As a last resort, still return the conventional path so callers can
    // report a helpful error if nothing was found.
    return { path: path.join(appPath, "src", "dist", "index.html"), query: isControlPanel ? { panel: "true" } : {} };
  }
}

module.exports = DevServerManager;
module.exports.DEV_SERVER_PORT = DEV_SERVER_PORT;
module.exports.DEV_SERVER_URL = DEV_SERVER_URL;
