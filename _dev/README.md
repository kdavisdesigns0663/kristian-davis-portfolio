# Not part of the deployed site

The leading underscore is doing the work here. GitHub Pages builds this repo with Jekyll
(there is no `.nojekyll` file), and Jekyll leaves any directory whose name starts with `_`
out of the build. So everything in here stays in the repo and out of `kristiandavis.com`.

These four were sitting at the repo root, unlinked from anything but publicly reachable and
indexable on the deploy:

| file | what it is |
|---|---|
| `hero-pattern.html` | mockup of a hero design that has since changed |
| `raindrop-v4.html` | mockup of the raindrop, before it moved into `js/main.js` |
| `img-treatment-preview.html` | duotone photo treatment study. Its `<img>` points at `kristian.jpeg`, which is not in the repo, so it has been broken for a while |
| `HERO-BUILD-SPEC.md` | an early hero spec. Its own first line says do not build from it |

Kept rather than deleted because each one records a decision. Nothing links to them and
nothing should.
