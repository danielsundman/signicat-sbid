const authDB = {};

const setAuthStarted = (state, pno) => {
  authDB[state] = { pno };
};

const setAuthComplete = (state, data) => {
  if (authDB[state]) authDB[state].data = data;
};

const setAuthError = (state, error) => {
  if (authDB[state]) authDB[state].error = error;
};

const getAuthState = state => authDB[state];

const dump = () => console.log('authDB', JSON.stringify(authDB, null, 2));

module.exports = {
  setAuthStarted, setAuthComplete, setAuthError, getAuthState, dump
};
