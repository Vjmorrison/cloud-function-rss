function listFiles(bucketName) {
  // [START storage_list_files]
  // Imports the Google Cloud client library
  const Storage = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  // const bucketName = 'Name of a bucket, e.g. my-bucket';

  // Lists files in the bucket
  storage
    .bucket(bucketName)
    .getFiles()
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