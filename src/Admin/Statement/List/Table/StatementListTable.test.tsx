import React from 'react';
import {shallow} from 'enzyme';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../../../shared/i18n/i18n';
import {ApolloProvider} from 'react-apollo-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {MockLink} from 'apollo-link-mock';
import gql from 'graphql-tag';
import {cleanup} from '@testing-library/react';
import {SortTypesEnum} from '../../../../shared/enums/SortType.enum';
import StatementListTable from './StatementListTable';

afterEach(cleanup);

const HELLO_MOCKS = [
  {
    request: {
      query: gql`
        query($input: GenericFilterInput) {
          OrderList(input: $input) {
            page
            pageSize
            total
            items {
              id
              customerFullName
              createdAt
              status
              driverFullName
              driver {
                company {
                  id
                  name
                }
              }
              fare {
                measureTotalPrice {
                  amount
                  currency
                }
              }
            }
          }
        }
      `,
      variables: {},
    },
    result: {
      data: {
        OrderList: {
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

describe('Statement List Table Test', () => {
  const config = {
    pageSize: 10,
    page: 1,
    keyword: '',
    orderBy: {
      id: SortTypesEnum.ASC,
    },
  };

  const updateItems = jest.fn(opts => c => c);

  it('Statement List Table renders correctly', () => {
    const client = createClient(HELLO_MOCKS);
    shallow(
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18n}>
          <StatementListTable input={config} updateItems={updateItems} />
        </I18nextProvider>
      </ApolloProvider>,
    );
  });
});
