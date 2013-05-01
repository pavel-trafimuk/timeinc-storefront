
Compile strategy:

  all filenames except cache manifest and index.html become:

    {md5_hash_of_file_contents}.original_ext

  cache manifest will obviously have to include all these files, but no 
  versioning comment is necessary like in the apple docs because if any file 
  is changed the filename will also change.

  Only exception is the index.html file, but since it's embedded, it shouldn't
  be changing.

  Application Cache has javascript events: http://developer.apple.com/library/safari/#documentation/iPhone/Conceptual/SafariJSDatabaseGuide/OfflineApplicationCache/OfflineApplicationCache.html
