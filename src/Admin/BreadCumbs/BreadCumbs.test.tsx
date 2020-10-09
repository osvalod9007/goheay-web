import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import i18n from '../../shared/i18n/i18n';
import {ApolloProvider} from 'react-apollo-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {MockLink} from 'apollo-link-mock';
import {I18nextProvider} from 'react-i18next';
import gql from 'graphql-tag';
import {cleanup} from '@testing-library/react';
import BreadCumbs from './BreadCumbs';

afterEach(cleanup);

const HELLO_MOCKS = [];

const createClient = mocks => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new MockLink(mocks),
  });
};

describe('Test BreadCumbs Component', () => {
  let container: any = null;
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  i18n.changeLanguage(require(`antd/lib/locale-provider/en_US.js`).default.locale);
  const client = createClient(HELLO_MOCKS);

  it('Should render BreadCumbs component', () => {
    // Test first render and effect
    act(() => {
      render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <BreadCumbs />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
    });
  });

  it('Should save Snapshot for BreadCumbs component', () => {
    act(() => {
      const app = render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <BreadCumbs />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
      expect(app).toMatchSnapshot();
    });
  });
});
