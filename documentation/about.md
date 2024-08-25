# 7 Days to Die Mod - Immersive Loading Screens
[![nexus-mods-collection-immersive-hud](https://img.shields.io/badge/Nexus%20Mods%20Collection-Immersive%20HUD%20-orange?style=flat-square&logo=spinrilla)](https://next.nexusmods.com/7daystodie/collections/epfqzi) [![nexus-mods-page](https://img.shields.io/badge/Nexus%20Mod-Immersive%20Loading%20Screens%20-orange?style=flat-square&logo=spinrilla)](https://www.nexusmods.com/7daystodie/mods/5716) [![github-repository](https://img.shields.io/badge/GitHub-Repository-green?style=flat-square&logo=github)](https://github.com/rdok/7daystodie_mod_immersive_loading_screens)

> Replace immersion-breaking loading screens with dynamic backgrounds and immersive lore.
> **EAC:** This mod uses custom code that is not compatible with Easy Anti-Cheat (EAC).
 
[![Immersive Loading Screens](https://raw.githubusercontent.com/rdok/7daystodie_mod_immersive_loading_screens/main/documentation/showcase.gif)](https://www.nexusmods.com/7daystodie/mods/5716)

## Features
- Replace immersion-breaking loading screens with dynamic backgrounds and immersive lore.
- Optional mod file with lore snippets disabled. Install main or optional version; not both.
- [Danzo Hide Version](https://www.nexusmods.com/7daystodie/mods/5405) is recommended to hide the game version located on the top right of the screen.
- Game Version: 1.0. Install with [Vortex](https://www.nexusmods.com/about/vortex/).

#### v1.3.4 - v1.0.2 Optional No Lore - 24-Aug-24
- fix: Potential minor improvement for when to cycle backgrounds using unity's engine time functions.
- fix: Use latest improvements from v1.3.4 main version
#### v1.3.3 17-Aug-24
- fix: The text overlaps during the transition, making it difficult to read.
#### v1.3.2 16-Aug-24
- fix: Add all remaining lore snippets
- fix: Add more background images.
#### v1.0.1 Optional No Lore - 16-Aug-24
- fix: Add more background images.
#### v1.0.0 Optional No Lore - 16-Aug-24
- feat: Hide lore snippets. Install main or optional version; not both.
#### v1.3.1 16-Aug-24
- fix: Add more lore snippets:
  - The fall of humanity 
  - Navezgane's Dark Secret
  - Seven Days to Die
- fix: Revert image quality back to original; quality had degraded too much.
#### v1.2.0 15-Aug-24
- feat: Cycle through background images & tips every nine seconds.
- feat: Apply fade effect, of 1s duration, for a better UX.
- feat: Use images with RDR2 loading screen filter (silver halide/wet collodion process)
- feat: Add new lore snippet: The Origins of the outbreak.
#### v1.1.0 15-Aug-24
- feat: Replace starting loading screen with: "War. War never changes."
- feat: Enables tips, and replace them with lore-friendly messages that include snippets of the storyline.
- feat: Translated to all in game languages.
#### v1.0.1 09-Aug-24
- fix: loading_image wasn't properly hidden leading to XML errors; although it hadn't any negative user impact.
#### v1.0.0 09-Aug-24
- Hides tips; silenced click sound, mouse icons, and spawn header panel.
- Replaces the main loading screen with the main image, logo removed, vignette, vintaged.
- Changes & translates:
    - 'Spawn' button to 'Open Your Eyes'
    - 'Building environment...' button to "You're awake"
- First loading screen message: 'In a world gone silent only the strong endure.'
- Translates to all languages in game.

## Development
- Use Google Sheet to edit the Localization.txt; only add the english version.
  - Use `translate:localization` instead to use Google Translate API to automate the translation to all other in game languages.
- Use `npm run rdr2:filter` to apply RDR2 filters to images.

## Sources
- [silver halide or wet collodion process](https://www.reddit.com/r/reddeadredemption2/comments/asn805/the_load_screens_emulate_the_development_process/)
- [RDR2 filters](https://x.com/radcowboylad/status/1307336588129566720?s=21)