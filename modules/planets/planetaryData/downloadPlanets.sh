#!/bin/zsh

# TODO: fix path
curl -X "POST" "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+pscomppars&format=json" > ./planetaryData/pscomppars.json
