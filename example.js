const WhalefinRest = require('whalefin-api-rest');


(async () => {

    //test
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
    let usdvalue_total = parseFloat(asset.result.totalAvailableBalanceInUSD);
    for (const detail of asset.result.balanceDetails) {
        usdvalue_total += parseFloat(detail.dualCurrencyLockedAmount) * parseFloat(detail.priceInUSD);
    }
    console.log('usdvalue_total', usdvalue_total);

    const price = await whalefin.request({
        method: 'GET',
        path: '/api/v2/trade/rfq',
        data: {'quantity':'3',
                'direction': 'SELL',
                'symbol': 'BTC_USD'}
    });
    console.log('price', price);

    const swapprice = await whalefin.request({
        method: 'GET',
        path: '/api/v2/trade/swap/price',
        data: {'quantity':'3',
                'toCurrency': 'USD',
                'fromCurrency': 'BTC'}
    });
    console.log('swapprice', swapprice);

    const spotorder = await whalefin.request({
        method: 'POST',
        path: '/api/v2/trade/orders/spot',
        data: {'direction':'BUY',
                'price': '10500',
                'strategy': 'GTC',
                'type':'LIMIT',
                //'type':'MARKET',
                'symbol':'BTC_USD',
                'quantity':'0.1'}
    });
    console.log('spotorder', spotorder);
    console.log('orderId', spotorder.result.id);

    const cancelorder = await whalefin.request({
        method: 'PUT',
        path: '/api/v2/trade/orders/cancel',
        data: {'category':'SPOT',
                'orderId': spotorder.result.id
            }
    });
    console.log('cancelorder', cancelorder);

})().then();
