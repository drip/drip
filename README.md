# drip

Drip is continuous integration for npm.

## Running

Starting the server:

    node script/server.js

Starting workers:

    node script/worker.js

## Requirements

drip has the following requirements:

* redis (for resque, and scheduling and working of builds)
* mongodb (for storage of build statistics)

## Compiling

    coffee -c **/*.coffee

## Testing

    npm test

## Running

Be sure to have the following environment variables set:

    NODE_ENV, PORT, REDIS_URL, REDIS_PORT, REDIS_HOST, MONGO_URL

## Authors

drip was written by [Christopher Meiklejohn](mailto:christopher.meiklejohn@gmail.com), [Simon Højberg](http://twitter.com/shojberg), and Barnaby Claydon for the [2011 Node Knockout](http://nodeknockout.com).

## License

Copyright © 2011 drip.  It is free software, and may be redistributed under the terms specified in the LICENSE file.
