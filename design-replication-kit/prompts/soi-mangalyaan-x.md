# SOI Mangalyaan-X — design replication prompt

Recreate the responsive SOI Mangalyaan-X human Mars-mission concept site from `soi-mangalyaan-x/`. It is fictional, not a government agency or an actual mission. Keep concept disclaimers visible anywhere future mission dates, SOI heritage data, or interest collection appear.

## Art direction

Use an editorial aerospace field-guide aesthetic: ink navy/near-black and warm pearl/stone themes, rust Mars terrain, muted gold, lilac and sage accents, translucent glass cards, fine technical coordinates and compact mono labels. Display type Michroma, body Manrope, metadata Space Mono with fallbacks. The background 3D Mars scene is cinematic but softened by a wash so foreground copy stays legible. Offer dark/light theme toggle, defaulting to user's stored choice/system preference; synchronize CSS tokens and scene lighting.

## Page story

1. Fixed/translucent nav with SOI seal, Why Mars, Journey, Heritage, Crew Support, theme toggle, seat CTA; accessible mobile menu.
2. Hero: large “WE GO / FARTHER / TOGETHER.” three-line headline, mission-concept date marker, concise mission invitation, two CTAs, three stats; behind/right use a full-bleed procedural 3D Mars with orbiting moon, Earth, spacecraft and route, coordinate annotation, local-sol readout, scroll cue.
3. Mars guide: six glass cards, each inline SVG terrain illustration, index, tag, descriptive fact and link: Olympus Mons, Valles Marineris, Jezero Crater, polar ice, dust storms, Phobos/Deimos.
4. Pause-capable illustrative mission partner marquee.
5. Journey: editorial left intro and mission clock; eight numbered date-labelled timeline milestones from training and launch through cruise, insertion, landing, surface stay, return. Desktop sticky intro/progress rail, mobile natural reading flow.
6. Heritage: four orbital/spacecraft/Mars-class/years dials, animated count values, illustrative milestone strip/gallery, unmistakable fiction note.
7. Crew support: six services (training, medical screening, life support, habitat, communications, cover/counsel) plus explicitly non-binding checklist with live “N of 4 considered” progress.
8. Mission interest form: full name, email, country/region, interest path, required acknowledgement that it is fictional; validation, submitting/success/error states. Explain this is a local demo unless backend truly runs; never imply an actual seat.
9. FAQ with native accessible disclosure rows clarifying no real mission, seat, payment or selection.
10. Footer mission desk links, concept/legal labels and back to top.

## Scene and motion implementation

Use the existing Three.js procedural approach if available: deterministic multi-octave noise vertex displacement and color for Mars surface; crater bowls/lips and polar ice; translucent atmosphere; stars/dust particles; Phobos, Earth, orbital ring; detailed spacecraft with panels, route curve and restrained thruster; soft multi-light environment and light bloom. Scroll progress moves the spacecraft along route; theme event eases scene colors/lighting/opacity. Handle no WebGL via CSS gradient; cap DPR and particle count, pause when hidden, dispose resources on unmount. GSAP/ScrollTrigger can handle line reveals, section entrance, progress bars, timeline/gallery, cursor/tilt, and count-up. Lenis only if installed and motion is allowed. Respect reduced motion comprehensively and keep mobile performant.

## Fidelity and safety of claims

Theme colors must be tokenized and shared with scene CSS vars. Preserve high readability over canvas; no fake authoritative logos or photographic claims. Use `role=status` for form response; labels and proper input types; accessible nav/theme buttons, checkbox names, FAQ summary, skip link, focus states. Collapse timeline and cards cleanly at mobile widths. Use custom SVG landscapes instead of image downloads when replicating. Keep all future dates and stats clearly marked illustrative/fictional; the reservation handler is an interest demo and must not claim booking or payment. Inspect current package and source before implementing; use existing libraries, not extra ones without cause.
