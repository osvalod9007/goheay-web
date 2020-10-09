import React from 'react';
import ReactDOM from 'react-dom';
import {mount, shallow} from 'enzyme';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../../../shared/i18n/i18n';
import {ApolloProvider} from 'react-apollo-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {MockLink} from 'apollo-link-mock';
import gql from 'graphql-tag';
import {cleanup} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {SortTypesEnum} from '../../../../shared/enums/SortType.enum';
import DriverListTable from './DriverListTable';

afterEach(cleanup);

const HELLO_MOCKS = [
  {
    request: {
      query: gql`
        query($input: GenericFilterInput) {
          CustomerList(input: $input) {
            total
            items {
              id
              rating
              basicProfile {
                firstName
                lastName
                email
                mobilePhone
                mobilePhoneCode
              }
            }
          }
        }
      `,
      variables: {},
    },
    result: {
      data: {
        CustomerList: {
          items: [],
          paginate: {
            total: 0,
          },
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

describe('User List Table Test', () => {
  const config = {
    pageSize: 5,
    page: 1,
    keyword: '',
    orderBy: {
      id: SortTypesEnum.ASC,
    },
  };

  const updateItems = jest.fn(opts => c => c);

  it('User List Table renders correctly', () => {
    const client = createClient(HELLO_MOCKS);
    shallow(
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18n}>
          <DriverListTable input={config} updateItems={updateItems} />
        </I18nextProvider>
      </ApolloProvider>,
    );
  });
});
