timeTracker
-----------------------

Based on Electron + Webpack + React + Sass + pouchdb.
Features:
- add or select a customer
- add or select a project for a selected customer
- press the time button to start and stop a time record
- edit time record if you need to correct it
- see overview of all time records for a customer / project
- export project's time records to a cvs file
- select between german and english language
- select date and time formt (dd.mm.yyy hh:mm 24h, yyyy/dd/mm hh:mm 12h, yyyy-mm-dd hh:mm 24h)

Feel free to give feedback to the phrases as i am no native english speaker... feel free to give feedback anyways ;)

UPDATES 2020
- fixed a bug that occured while filtering for a month in the overview page

UPDATES 2019
- moved to webpack 4
- remove callbacks with async-await
- add PropTypes
- localization (language and formats)

run 
- npm install to unstall all npm modules
- npm run web to test app in a webbrowser (electron main process functionality is not available)
- npm run electronDebug to open electron window with console output
- npm run electron to open electron window without console output
- npm run bin to create app for mac (win and linux are in place, edit package.json)

TODOS:
- add linter
- add tests

A Mac-build can be downloaded from here: http://timetracker.wendenburg.de/download/TimeTracker.app.zip

Select a project
-----------------------
![projects](https://user-images.githubusercontent.com/15124946/59964336-b07c0580-94ff-11e9-9b18-94b63998613f.png)

Press the button
-----------------------
![button](https://user-images.githubusercontent.com/15124946/59964334-b07c0580-94ff-11e9-80d6-ca0d19aa6c65.png)

Keep overview
-----------------------
![overview](https://user-images.githubusercontent.com/15124946/59964335-b07c0580-94ff-11e9-934c-a26fadaf2d9c.png)
