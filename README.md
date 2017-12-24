# RSS Generator

A simple RSS feed generator for google cloud functions.

## Functionality
* when you upload the rss_config.json file, The cloud function will trigger and read the config.
* It will use the config to generate an rss xml file and upload it in the same directory as the config file.
* You can now use that rss.xml file in any podcast reader or service like Google play or iTunes.
