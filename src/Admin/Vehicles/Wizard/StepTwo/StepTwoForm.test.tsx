import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import i18n from '../../../../shared/i18n/i18n';
import {ApolloProvider} from 'react-apollo-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {MockLink} from 'apollo-link-mock';
import {I18nextProvider} from 'react-i18next';
import gql from 'graphql-tag';
import {cleanup} from '@testing-library/react';
import StepTwoForm from './StepTwoForm';

afterEach(cleanup);

const HELLO_MOCKS = [
  {
    request: {
      query: gql`
        mutation($id: EncryptId!, $input: VehicleUpdateInput!) {
          VehicleUpdate(id: $id, input: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          basicProfile: {
            firstName: 'Manu',
            mobilePhone: '34345345',
            mobilePhoneCode: '+1',
            lastName: 'Perezz',
            email: 'manuone@manuone.com',
          },
        },
        id: 'NmUzZmY3OTA5OTA5ZjgyOWZiZTcyNjhiZjkxODBiZGM6MQ',
      },
    },
    result: {
      data: {
        VehicleUpdate: {
          id: 'NTYxYWVlZmQ4MjdjOGM0ZWY1MmYwOTliOTJhYWM5NDc6Mg',
        },
      },
    },
  },
];

const createClient = mocks => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new MockLink(mocks),
  });
};

describe('Test StepTwo Form Component', () => {
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

  it('Should render StepTwo Form component', () => {
    // Test first render and effect
    act(() => {
      render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <StepTwoForm />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
    });
  });

  it('Should save Snapshot for StepTwo Form component', () => {
    act(() => {
      const app = render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <StepTwoForm />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
      expect(app).toMatchSnapshot();
    });
  });

  it('Should modify field for StepTwo Form component', () => {
    act(() => {
      render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <StepTwoForm />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
    });
    const input: any = document.getElementById('make');
    expect(input.value).toBe('');
    input.value = 'change';
    expect(input.value).toBe('change');
  });
});
