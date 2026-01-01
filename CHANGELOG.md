# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-01

### Added

- New `entry` command group for managing playlist entries (chapter + track as one unit)
  - `entry add` - Add entry with audio file and optional icon
  - `entry update` - Update title/icon for both chapter and track together
  - `entry delete` - Delete an entry

### Changed

- Renamed `edit` subcommand to `update` across all command groups for consistency
  - `playlist edit` → `playlist update`
  - `chapter edit` → `chapter update`
  - `track edit` → `track update`
- Removed `--file` option from `chapter add` (use `entry add` instead)
- Moved chapter/track documentation to "Advanced" section in README
- Improved playlist structure to match Yoto UI-created playlists:
  - Icons now set on both chapter and track levels
  - Added `overlayLabel`, `format`, `fileSize`, `ambient` fields
  - Added `_originalFileName`, `availableFrom`, `defaultTrackDisplay`, `defaultTrackAmbient` to chapters

## [0.1.0] - 2024-12-16

### Added

- Audio file upload and transcoding support
- Smart file detection for audio sources (file path, yoto:# hash, or URL)
- `track upload` command for standalone audio uploads
- `track status` command to check transcoding progress
- `--on-end` option for track playback behavior (repeat, stop, none)

### Changed

- Restructured CLI to use space-separated subcommands (e.g., `yoto playlist list`)
- Icons now auto-upload when given a file path

## [0.0.1] - 2024-12-15

### Added

- Initial release
- Authentication via device flow (`login`, `logout`, `status`)
- Playlist management (`playlist list`, `show`, `create`, `delete`)
- Chapter management (`chapter add`, `delete`)
- Track management (`track add`, `delete`)
- Icon management (`icon list`, `upload`)
- Device control (`device list`, `show`, `play`, `pause`, `stop`, `next`, `previous`, `volume`)
- Cross-platform binaries (Linux x64/arm64, macOS x64/arm64, Windows x64)
- Install script for easy setup

[0.2.0]: https://github.com/TheBestMoshe/yoto-cli/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/TheBestMoshe/yoto-cli/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/TheBestMoshe/yoto-cli/releases/tag/v0.0.1
