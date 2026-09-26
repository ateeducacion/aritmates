/**
 * Entry point: read config.json first, then evaluate the app with DEFAULTS
 * already updated. esbuild bundles the dynamic import in the same file.
 */
import {loadConfig} from './defaultOptions';

loadConfig().then(() => import('./app.js'));
