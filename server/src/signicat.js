const requestPromise = require('request-promise-native').defaults({ jar: true }); // We need to do this properly on a
const queryString = require('query-string');

const cfg = require('./settings_preprod_demo');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const getToken = async code => {
  // """ Returns a valid token with a code from user authentication
  //     (see https://developer.signicat.com/documentation/authentication/protocols/openid-connect/full-flow-example/)
  // """
  const body = queryString.stringify({
    'client_id': cfg.oidc.CLIENT_ID,
    'redirect_uri': cfg.oidc.REDIRECT_URI,
    'grant_type': 'authorization_code',
    code
  });

  const headers = {
    // TODO: Where did this one come from...something like client_id: client_secret Base64
    Authorization: `Basic ${cfg.oidc.CRED64}`,
    'content-type': 'application/x-www-form-urlencoded'
  };

  const options = {
    method: 'POST',
    uri: `${cfg.oidc.baseUri}/token`,
    headers,
    body,
    jar: true
  };

  try {
    const r = await requestPromise(options);
    const res = JSON.parse(r);
    return res.access_token;
  } catch (e) {
    return { error_description: e.message }
  }
};

const getUserInfo = async token => {
  // """ Returns JSON-formatted user info with a token from getToken
  //     (see https://developer.signicat.com/documentation/authentication/protocols/openid-connect/full-flow-example/)
  // """
  console.log('token', token);

  const auth_str = 'Bearer ' + token;
  const headers = {'Authorization': auth_str};
  const options = {
    uri: `${cfg.oidc.baseUri}/userinfo`,
    headers,
    jar: true
  };

  try {
    const r = await requestPromise(options);
    return JSON.parse(r);
  } catch (e) {
    return { error_description: e.message }
  }
};

const authenticate = async (pno, state) => {
  const auth = (pno, state) => {
    const options = {
      uri: cfg.authUri(state, pno),
      json: true
    };

    return requestPromise(options);
  };

  const collect = (collectUrl, orderRef) => {
    const options = {
      uri: `${collectUrl}?orderRef=${orderRef}`,
      json: true
    };
    return requestPromise(options);
  };

  const getCompleteUrl = async (collectUrl, orderRef) => {
    let done = false;
    while (!done) {
      const { progressStatus, completeUrl = null } = await collect(collectUrl, orderRef);
      console.log('progressStatus', progressStatus);
      done = progressStatus === 'COMPLETE';
      if (done) return completeUrl;
      await sleep(2000);
    }
  };

  const complete = async uri => {
    return await requestPromise({ uri });
  };

  try {
    const { autoStartToken, collectUrl, orderRef } = await auth(pno, state);

    const bankIdUrl = `bankid:///?autostarttoken=${autoStartToken}&redirect=null`;
    console.log('bankIdUrl', bankIdUrl);

    const completeUrl = await getCompleteUrl(collectUrl, orderRef);
    return await complete(completeUrl);
  } catch (e) {
    console.log('e', e.message);
  }
};

const auth = (state) => {
  const options = {
    uri: cfg.authUri(state),
    json: true
  };

  console.log('options', options);

  return requestPromise(options);
};

const authenticate2 = async (collectUrl, orderRef) => {
  const collect = (collectUrl, orderRef) => {
    const options = {
      uri: `${collectUrl}?orderRef=${orderRef}`,
      json: true
    };
    return requestPromise(options);
  };

  const getCompleteUrl = async (collectUrl, orderRef) => {
    let done = false;
    while (!done) {
      const { progressStatus, completeUrl = null } = await collect(collectUrl, orderRef);
      console.log('progressStatus', progressStatus);
      done = progressStatus === 'COMPLETE';
      if (done) return completeUrl;
      await sleep(2000);
    }
  };

  const complete = async uri => {
    return await requestPromise({ uri });
  };

  try {
    const completeUrl = await getCompleteUrl(collectUrl, orderRef);
    return await complete(completeUrl);
  } catch (e) {
    console.log('e', e.message);
  }
};

module.exports = {
  getToken,
  getUserInfo,
  authenticate,
  authenticate2,
  auth
};
