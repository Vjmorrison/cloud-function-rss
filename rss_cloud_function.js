function generate_rss(config){
  var RSS = require('rss')

  /* lets create an rss feed */
  var feed = new RSS({
      title: config['title'],
      description: config['description'],
      feed_url: config['feed_url'],
      site_url: config['site_url'],
      image_url: config['image_url'],
      docs: config['docs'],
      managingEditor: config['managingEditor'],
      webMaster: config['webMaster'],
      copyright: config['copyright'],
      language: config['language'],
      categories: config['categories'],
      pubDate: config['pubDate'],
      ttl: config['ttl'],
      custom_elements: [
        {'itunes:subtitle': config['itunes:subtitle']},
        {'itunes:author': config['itunes:author']},
        {'itunes:summary': config['itunes:summary']},
        {'itunes:owner': [
          {'itunes:name': config['itunes:owner']['itunes:name']},
          {'itunes:email': config['itunes:owner']['itunes:email']}
        ]},
        {'itunes:email': config['itunes:email']}
        {'itunes:image': {
          _attr: {
            href: config['itunes:image']
          }
        }},
        {'itunes:category': [
          {_attr: {
            text: config['itunes:category']
          }}
        ]}
      ]
  })
  const defaults = config['episodeConfig']
  for (var i = config['episodeList'].length - 1; i >= 0; i--) {
    /* loop over data and add to feed */
    var episode = config['episodeList'][i]
    var itemOptions = {
      title:  episode['title'],
      description: episode['description'],
      url: episode['url'],
      date: episode['date']
    }
    //Add in default vars where needed
    for(key in defaults){
      if (!(key in episode)){
        episode[key] = defaults[key]
      }
      itemOptions[key] = episode[key]
    }

    feed.item(itemOptions)
  }
  

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