const crypto = require('crypto');
const querystring = require('querystring');
const Client = require('node-rest-client').Client;

const version = 'whalefin-api-rest'//require('./package.json').version;
const name = '0.0.1';//require('./package.json').name;

const USER_AGENT = `${name}@${version}`;
const PRODUCTION_ENDPOINT = 'https://be.whalefin.com';
const TEST_ENDPOINT = 'https://be-alpha.whalefin.com';

class WhalefinRest {
    constructor(config) {

        if (!config) {
            return;
        }

        if (config.key && config.secret) {
            this.key = config.key;
            this.secret = config.secret;
        }

        this.client = new Client();
        if (typeof config.production === 'undefined')
            this.endpoint = PRODUCTION_ENDPOINT
        else if (config.production)
            this.endpoint = PRODUCTION_ENDPOINT
        else
            this.endpoint = TEST_ENDPOINT;
    }

    // this fn can easily take more than 0.15ms due to heavy crypto functions
    // if your application is _very_ latency sensitive prepare the drafts
    // before you realize you want to send them.
    createDraft({ path, method, data }) {

        let payload = '';
        let signStr = '';
        const timestamp_now = Date.now();

        if (method === 'GET')// && data) 
        {
            if (data)
                path += '?' + querystring.stringify(data);
            signStr = `method=${method}&path=${path}&timestamp=${timestamp_now}`;
        } else if (method === 'DELETE' && typeof data === 'number') {
            // cancel single order
            path += data;
        } else if (data) {
            //POST PUT
            payload = JSON.stringify(data);
            signStr = `method=${method}&path=${path}&timestamp=${timestamp_now}&body=${payload}`;
        }

        const signature = crypto.createHmac('sha256', this.secret)
            .update(signStr).digest('hex');

        const options = {
            headers: {
                'content-type' : 'application/json',
                'access-key': this.key,
                'access-timestamp': timestamp_now,
                'access-sign': signature
            },
            // merely passed through for requestDraft
            //timeout,
            data: payload
        };



        return {
            'options': options,
            'fullpath': (this.endpoint + path),
            'method': method
        }
            ;
    }

    // a draft is an option object created (potentially previously) with createDraft
    requestDraft(draft) {
        return new Promise((resolve, reject) => {

            if (draft.method === 'GET') {
                this.client.get(draft.fullpath, draft.options,
                    function (data, response) {
                        if (data.code != 0) {
                            return reject(new Error(data.code));
                        }
                        return resolve(data);
                    });
            }
            else if (draft.method === 'POST') {
                this.client.post(draft.fullpath, draft.options,
                    function (data, response) {
                        if (data.code != 0) {
                            return reject(new Error(data.code));
                        }
                        return resolve(data);
                    }
                    );
            }
            else if (draft.method === 'PUT') {
                this.client.put(draft.fullpath, draft.options,
                    function (data, response) {
                        if (data.code != 0) {
                            return reject(new Error(data.code));
                        }
                        return resolve(data);
                    }
                    );
            }
        });
    }

    // props: {path, method, data}
    request(props) {
        return this.requestDraft(this.createDraft(props));
    }

};

module.exports = WhalefinRest;
