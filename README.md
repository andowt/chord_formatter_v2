# chord_formatter_v2
Application to format and key change chord sheets

## Environment Setup

1. Downlode node.js from https://nodejs.org/en
2. npm install --save-dev electron
3. npm install --save-dev docx

### For unit tests only

4. npm install --save-dev jest

## Building

1. npm run start

## Unit testing

2. npm run test


## ES Modules and Common JS

There is a mix of module systems used in this project (and in electron projects in general)

The "backend" main process (main.cjs) and extensions (helpers) use commonJs (*.cjs)
    - Done due to deep integration with NodeJs and existing node libs
    - cjs was the original module system used in NodeJS
    - Modules imported using require

The "frontend" renderers (windowMain.js, windowConfig.js) use ES modules (*.mjs)
    - Package json type set to "module" so defaults *.js to be interpreted as *.mjs
    - Allows front end code to use modern JS and integratr with React/Vue/Angular etc if needed
    - Prevents security holes from allowing direct access to node from web end