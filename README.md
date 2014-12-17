ePub Check for Node.js
==============

Node wrapper for epubcheck.

### How to install it?

```
$ npm install epubcheck
```

### How to use it?

```
var epubCheck = require("epubcheck");

epubCheck("./book.epub", function(err, details) {
	// do something
});
```
