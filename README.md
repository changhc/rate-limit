# rate-limit
Simple rate limit middleware for express

## Dependency
* redis

## Usage
```
const RateLimit = require('./RateLimit');
const rateLimit = new RateLimit({
    resetPeriod: 60000,     // reset all records after a period of time
    max: 10,                // max requests allowed
});

app.use(rateLimit);
```