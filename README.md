# Ayuda iPhone (for Mom)

A Spanish-language practice app (installable PWA, works offline). She practices on drawn MOCK iPhone screens; a pulsing yellow ring shows where to tap, with large text and a spoken voice. iOS does not allow overlays on real apps, so this is a simulator. No network calls, no data stored except her progress and settings (localStorage). Typed text is kept in memory only and cleared when she leaves the lesson.

Files: `index.html` (everything), `manifest.webmanifest`, `sw.js`, `icon.svg`, `icon-180.png`, `icon-512.png`. `check.js` is an optional dev check (`node check.js`).

## Host it free

**GitHub Pages:** create a repo, upload all files in this folder to the root, then Settings > Pages > Deploy from branch `main` / root. Your URL will be `https://<user>.github.io/<repo>/`.

**Netlify Drop:** go to https://app.netlify.com/drop and drag this whole folder onto the page. You get an https URL immediately.

HTTPS is required for the offline service worker (both options provide it).

## Add to her Home Screen

On her iPhone, open the URL in **Safari** (not Chrome). Tap Compartir (the square with the arrow) > **Agregar a pantalla de inicio** > Agregar. Open it once with internet; after that it works offline. Voice needs her phone to have a Spanish voice (Ajustes > Accesibilidad > Contenido hablado > Voces) and the ringer/silent switch off.

## Change the helper name

Edit `const HELPER_NAME = 'Steve';` at the top of the script in `index.html`.

## Add a lesson

1. In `SCREENS` add a render function returning HTML for a mock screen. Give every tappable element a unique `id` (e.g. `id="myBtn"`). Mock text fields use `fld('fId','placeholder')`.
2. In `LESSONS` add an object:
```js
{id:'mi', emoji:'📷', title:'Tomar una foto', steps:[
  {screen:'home', target:'#appCam', say:'Toca Cámara.'},
  {screen:'my_screen', target:'#shutter', say:'Toca el botón blanco.'},
  {screen:'my_form', target:'#fName', type:'input', placeholder:'Escribe...', say:'Escribe tu nombre.'},
  {screen:'my_info', target:'#msg', type:'next', say:'Lee esto. Toca Siguiente.'}
], done:'Texto opcional en la pantalla final.'}
```
`type` is `tap` (default), `input` (typing + Listo button) or `next` (explanation, Siguiente button). Run `node check.js` to verify each target id exists in its screen.

## Activity log, requests and summary (all on-device)

Everything is stored in localStorage only, each access in try/catch. Nothing is sent automatically; she always taps Enviar in Messages herself.

- **Activity log** (`ayuda.log`, last 500 events): lesson_open, lesson_done, lesson_quit (with step), wrong_tap, repeat, back. Summarized into done / unfinished lessons, hardest steps and most repeated lessons.
- **Home buttons:** Pedir una lección, check-in questionnaire (Ya lo uso / Quiero aprender / Me da miedo), Enviar mi resumen (preview, then an `sms:` link, with a Borrar mi historial button), and Configurar (helper's phone number, saved on the device only; without it she is told to ask the helper, with a Share fallback).
- **Requests:** she gets a code like `P-7K2M`. To answer one, add `answers:['P-7K2M']` (format `^P-[A-Z2-9]{4}$`) and `added:'YYYY-MM-DD'` to a lesson; on her next load the request shows "Ya está tu lección". `added` also shows a Nuevo pill until she opens that lesson. Track requests in the gitignored `LESSON_QUEUE.md`.
- `check.js` also verifies lesson ids are unique and `answers` codes are well formed.

## Known limits
- Speech on iOS only starts after a tap, so the first spoken step comes from tapping a lesson card.
- Bump `CACHE` in `sw.js` (e.g. `ayuda-iphone-v4`) whenever you change files so phones refresh.
