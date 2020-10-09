import React from 'react';
import {shallow} from 'enzyme';
import {ApolloProvider} from 'react-apollo-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {MockLink} from 'apollo-link-mock';
import gql from 'graphql-tag';
import {cleanup} from '@testing-library/react';
import {SortTypesEnum} from '../../../../shared/enums/SortType.enum';
import CustomersListTable from './CustomersListTable';

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

describe('Customers List Table Test', () => {
  const config = {
    pageSize: 5,
    page: 1,
    keyword: '',
    orderBy: {
      id: SortTypesEnum.ASC,
    },
  };

  const updateItems = jest.fn(opts => c => c);

  it('Customers List Table renders correctly', () => {
    const client = createClient(HELLO_MOCKS);
    shallow(
      <ApolloProvider client={client}>
        <CustomersListTable input={config} updateItems={updateItems} />
      </ApolloProvider>,
    );
  });
});
