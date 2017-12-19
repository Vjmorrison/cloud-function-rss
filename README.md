# RSS Generator

A simple RSS feed generator for google cloud functions.

## Requirements
* Inside the GCS bucket, there should be a folder in the bucket called "episodes". Any MP3 file within that folder will be determined to be an episode.
* Files will be sorted by the metadata label "episode-number".  This should be an integer value.
* If no metadata is set, files will be sorted by modified timestamp and then alphabetically.

## Setup
* replace stuff
* push stuff
* profit