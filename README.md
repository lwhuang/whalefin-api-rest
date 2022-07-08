# whalefin-api-rest

    npm install github:lwhuang/whalefin-api-rest

API wrapper for the [whalefin REST API](https://pro.whalefin.com/apidoc/). Please refer to [their documentation](https://pro.whalefin.com/apidoc/) for all calls explained. Check out `sample.js` for lib usage.

This is a fork based of  library: https://github.com/askmike/ftx-api-rest

## Usage

See sample.js.

```
const WhalefinRest = require('whalefin-api-rest');
const whalefin = new WhalefinRest({
        key: 'your_key',
        secret: 'your_secret',
        production: false   //false for test node, true for production node
});
const asset = await whalefin.request({
        method: 'GET',
        path: '/api/v2/asset/balance'
    });
console.log('asset', asset);
```



## TODO

- 

## Final

If this library is helping you trade better on whalefin feel free to use [my ref link](https://h5.whalefin.com/register?referral_code=SY56x3).