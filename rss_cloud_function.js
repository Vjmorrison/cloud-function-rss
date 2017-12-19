function listFiles(bucketName) {
  // [START storage_list_files]
  // Imports the Google Cloud client library
  const Storage = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  const bucketName = 'Name of a bucket, e.g. my-bucket';

  // Lists files in the bucket
  storage
    .bucket(bucketName)
    .getFiles()
    .then(results => {
      const files = results[0];

      files.forEach(file => {
        console.log(file.name);
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END storage_list_files]
}

function listFilesByPrefix(bucketName, prefix, delimiter) {
  // [START storage_list_files_with_prefix]
  // Imports the Google Cloud client library
  const Storage = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const bucketName = 'Name of a bucket, e.g. my-bucket';
  // const prefix = 'Prefix by which to filter, e.g. public/';
  // const delimiter = 'Delimiter to use, e.g. /';

  /**
   * This can be used to list all blobs in a "folder", e.g. "public/".
   *
   * The delimiter argument can be used to restrict the results to only the
   * "files" in the given "folder". Without the delimiter, the entire tree under
   * the prefix is returned. For example, given these blobs:
   *
   *   /a/1.txt
   *   /a/b/2.txt
   *
   * If you just specify prefix = '/a', you'll get back:
   *
   *   /a/1.txt
   *   /a/b/2.txt
   *
   * However, if you specify prefix='/a' and delimiter='/', you'll get back:
   *
   *   /a/1.txt
   */
  const options = {
    prefix: prefix,
  };

  if (delimiter) {
    options.delimiter = delimiter;
  }

  // Lists files in the bucket, filtered by a prefix
  storage
    .bucket(bucketName)
    .getFiles(options)
    .then(results => {
      const files = results[0];

      console.log('Files:');
      files.forEach(file => {
        console.log(file.name);
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END storage_list_files_with_prefix]
}

function generate_rss(){

  var RSS = require('rss');

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
  });

  
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
  });

  // cache the xml to send to clients
  return feed.xml();
}

exports.return_rss = function generate_rss(req, res) {
  // Everything is okay.
    console.log(req.body.message);
    res.status(200).send('Success: ' + req.body.message);
};