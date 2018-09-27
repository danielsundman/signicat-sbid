// Settings for OIDC
const oidc = {
  baseUri: 'https://preprod.signicat.com/oidc',
  responseType: 'code',

  CLIENT_ID: 'demo-inapp', // Service name
  SCOPE: 'openid+profile',
  REDIRECT_URI: 'http://localhost/redirect', // Redirect URI ! MUST CHANGE !
  ACR_VALUES: 'urn:signicat:oidc:method:sbid-inapp',
  CRED64: 'ZGVtby1pbmFwcDptcVotXzc1LWYyd05zaVFUT05iN09uNGFBWjd6YzIxOG1yUlZrMW91ZmE4'
  // CRED64 is base64 encoded credentials for demo-preprod service. Not sure this is correct...?
  // Decoded value: 'demo-preprod:mqZ-_75-f2wNsiQTONb7On4aAZ7zc218mrRVk1oufa8' (client_id:client_secret)
};

module.exports = {

  oidc,

  authUri: (pno, state) => (
    `${oidc.baseUri}/authorize?` +
    `response_type=code&` +
    `scope=${oidc.SCOPE}&`+
    `client_id=${oidc.CLIENT_ID}&`+
    `redirect_uri=${oidc.REDIRECT_URI}&` +
    `acr_values=${oidc.ACR_VALUES}&` +
    `state=${state}&` +
    `login_hint=subject-${pno}`
  )
};
