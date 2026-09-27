# Rituraj Poudel — Portfolio Website

## Structure
- index.html        Main page
- css/style.css      All styles (theme, layout, animations)
- js/questions.js    Pharmacy MCQ question bank (120 questions, extracted from the original quize/javascript/dip.js and lightly cleaned for spelling)
- js/main.js         All interactivity: theme toggle, nav, scroll reveal, hero canvas animation, quiz logic, confetti

## Editing
- Replace placeholder contact info in the "Contact" section of index.html (email, phone, LinkedIn, GitHub, Facebook).
- Add/remove quiz questions in js/questions.js — each entry is {question, answers[4], correct (0-3 index), category}.
- Update skill lists inside js/main.js (search for `pharmSkills` and `techSkills`).

## Running locally
Just open index.html in a browser, or serve the folder with any static server
(e.g. `python3 -m http.server` from inside this folder) since it uses no build step or backend.
