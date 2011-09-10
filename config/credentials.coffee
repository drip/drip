app = require('../config/app').app;

app.set 'credentials'
  redis: 
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASS
  mongo:
    url:  process.env.MONGO_URL
