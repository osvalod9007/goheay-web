import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import App from './App';
// import * as serviceWorker from './serviceWorker';

import {ApolloProvider} from 'react-apollo-hooks';
import gqlClient from './shared/config/gqlClient';

gqlClient.getClient('websiteBackend').then(client => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('root'),
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
