# Source images, kept out of the deploy

Underscore-prefixed, so Jekyll leaves this directory out of what GitHub Pages publishes
(there is no `.nojekyll` file, so the Jekyll build runs and skips anything starting with `_`).

Nothing on the site references any of these, but they were sitting under `img/` where the
whole directory is published, so 13MB of full-resolution originals were downloadable from
kristiandavis.com and counted against every clone of the repo.

| file | what it is |
|---|---|
| `kristian-about.jpg` | uncropped bio portrait, 2316x3088 |
| `kristian-about-crop.jpg` | the 4:5 crop of it, 1400x1750. `img/kristian-about-crop-800.jpg` is this at 800px, which is what the site loads |
| `kristian-about-mobile.jpg` | uncropped, 2174x2436 |
| `kristian-about-mobile-crop.jpg` | the tighter mobile crop, 1000x1250. The site loads `img/kristian-about-mobile-crop-900.jpg` |
| `hero-goal-tracking-pair.jpg` | the Zentra hero this project used before the onboarding cascade replaced it |

Moved, not deleted: these are the masters the served sizes were cut from, and the next time
the bio photo needs a different crop or a larger size, this is where it comes from.
