function generate_rss(config){
  var RSS = require('rss')

  /* lets create an rss feed */
  var feed = new RSS({
      title: 'title',
      description: 'description',
      feed_url: 'http://example.com/rss.xml',
      site_url: 'http://example.com',
      image_url: 'http://example.com/icon.png',
      docs: 'http://example.com/rss/docs.html',
      managingEditor: 'Dylan Greene',
      webMaster: 'Dylan Greene',
      copyright: '2013 Dylan Greene',
      language: 'en',
      categories: ['Category 1','Category 2','Category 3'],
      pubDate: 'May 20, 2012 04:00:00 GMT',
      ttl: '60',
      custom_elements: [
        {'itunes:subtitle': 'A show about everything'},
        {'itunes:author': 'John Doe'},
        {'itunes:summary': 'All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our podcast in the Podcasts app or in the iTunes Store'},
        {'itunes:owner': [
          {'itunes:name': 'John Doe'},
          {'itunes:email': 'john.doe@example.com'}
        ]},
        {'itunes:email': 'john.doe@example.com'}
        {'itunes:image': {
          _attr: {
            href: 'http://example.com/podcasts/everything/AllAboutEverything.jpg'
          }
        }},
        {'itunes:category': [
          {_attr: {
            text: 'Technology'
          }},
          {'itunes:category': {
            _attr: {
              text: 'Gadgets'
            }
          }}
        ]}
      ]
  })

  for (var i = Things.length - 1; i >= 0; i--) {
    Things[i]
  }
  /* loop over data and add to feed */
  feed.item({
      title:  'item title',
      description: 'use this for the content. It can include html.',
      url: 'http://example.com/article4?this&that', // link to the item
      guid: '1123', // optional - defaults to url
      categories: ['Category 1','Category 2','Category 3','Category 4'], // optional - array of item categories
      author: 'Guest Author', // optional - defaults to feed author property
      date: 'May 27, 2012', // any format that js Date can parse.
      lat: 33.417974, //optional latitude field for GeoRSS
      long: -111.933231, //optional longitude field for GeoRSS
      enclosure: {url:'...', file:'path-to-file'}, // optional enclosure
      custom_elements: [
        {'itunes:author': 'John Doe'},
        {'itunes:subtitle': 'A short primer on table spices'},
        {'itunes:image': {
          _attr: {
            href: 'http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg'
          }
        }},
        {'itunes:duration': '7:04'}
      ]
  })

  // cache the xml to send to clients
  return feed.xml()
}

exports.gcs_object_trigger = function (event, callback) {
  if (file.resourceState === 'not_exists') {
    // ignore deletion
  }
  else if (!file.name.includes("rss_config.json")) {
      //Ignore non config file changes
  }
  else{
      rss_config_changed(event)
  }
  callback();
}

function rss_config_changed = function (event) {
  const gcs = require('@google-cloud/storage');
  // Creates a client
  const storage = new gcs()

  const file = event.data;
  const filePath = file.name
  const fileName = filePath.split('/').pop()
  const fileBucket = file.bucket
  const bucket = storage.bucket(fileBucket)
  const tempFilePath = '/tmp/${fileName}'
  const tempRssFilePath = '/tmp/podcast.xml'
  //load config
  //generate rss xml
  //save xml to tempRssFilePath
  bucket.file(filePath).download({
    destination: tempFilePath
  })
  .then(() => {
    var fs = require('fs');
    return fs.readFile(tempFilePath, (err, data) => {
      const config = JSON.parse(data)
      rss_xml = generate_rss(config)
      fs.writeFile(tempRssFilePath, rss_xml, (err) => {
        if(err) {
          console.log(err)
        }
        else{
          console.log('Saved Updated RSS Feed')
        }
      })
    })
  })
  .then(() => {
    const rss_file_path = filePath.replace(/(\/)?([^\/]*)$/,"$1podcast.xml")
    return bucket.upload(tempRssFilePath, {
      destination: rss_file_path
    })
  })
};