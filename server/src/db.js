const authDB = {};

const setAuthStarted = (authReference, pno) => {
  authDB[authReference] = { pno };
};

const setAuthComplete = (authReference, data) => {
  if (authDB[authReference]) authDB[authReference].data = data;
};

const setAuthError = (authReference, error) => {
  if (authDB[authReference]) authDB[authReference].error = error;
};

const remove = authReference => {
  delete authDB[authReference];
};

const getAuthState = authReference => authDB[authReference];

const dump = () => console.log('authDB', JSON.stringify(authDB, null, 2));

module.exports = {
  setAuthStarted, setAuthComplete, setAuthError, getAuthState, dump, remove
};
