#!/bin/zsh

curl -X "POST" "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+pscomppars&format=json" > ./planetaryData/pscomppars.json
