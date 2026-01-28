// Yoto CLI - Library exports
// Use these to interact with Yoto API programmatically

// API Client
export { YotoClient, type YotoClientConfig } from "./api/client.ts";

// Schemas and types
export * from "./api/schemas.ts";

// Auth functions
export {
  login,
  logout,
  status,
  getAuthenticatedClient,
} from "./commands/auth.ts";

// Content/Playlist functions
export {
  listPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addChapter,
  addTrack,
  addTrackSmart,
  updateTrack,
  deleteChapter,
  deleteTrack,
  updateChapter,
  uploadAudio,
  getTranscodeStatus,
} from "./commands/content.ts";

// Entry functions (upload + add to playlist in one step)
export {
  addEntry,
  updateEntry,
  deleteEntry,
} from "./commands/entry.ts";

// Icon functions
export {
  listPublicIcons,
  listUserIcons,
  uploadIcon,
} from "./commands/icons.ts";

// Device functions
export {
  listDevices,
  getDeviceStatus,
  sendCommand,
} from "./commands/devices.ts";

// Config utilities
export {
  loadConfig,
  saveConfig,
  clearConfig,
  getConfigPath,
} from "./utils/config.ts";
