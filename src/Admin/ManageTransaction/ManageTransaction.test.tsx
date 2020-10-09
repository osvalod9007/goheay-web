import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import i18n from '../../shared/i18n/i18n';
import {I18nextProvider} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {ApolloProvider} from 'react-apollo-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {MockLink} from 'apollo-link-mock';
import gql from 'graphql-tag';
import {cleanup} from '@testing-library/react';
import ManageTransaction from './ManageTransaction';
import TransactionsListTable from './List/Table/TransactionListTable';
import transactionHoC from '../../shared/components/HoC/TransactionHoc/TransactionHoc';

afterEach(cleanup);

const HELLO_MOCKS = [
  {
    request: {
      query: gql`
        query($input: GenericFilterInput) {
          FleetOwnerTransactionList(input: $input) {
            page
            pageSize
            total
            items {
              id
              periodStartAt
              periodEndAt
              periodToString
              companyName
              fleetOwnerFullName
              orderCount
              moneyAmountCurrency {
                amount
                currency
              }
              status
              fleetOwner {
                basicProfile {
                  isConfigurePaymentStripeAccount
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
        FleetOwnerTransactionList: {
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

const client = createClient(HELLO_MOCKS);

describe('Test Manage Transaction Component', () => {
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

  it('Should render Manage Transaction component', () => {
    // Test first render and effect
    act(() => {
      render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <ManageTransaction />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
    });
  });

  it('Should save Snapshot for Manage Transaction component', () => {
    act(() => {
      const app = render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <ManageTransaction />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
      expect(app).toMatchSnapshot();
    });
  });

  it('should render the component only when the condition passes', () => {
    const dataComponent = {
      headIcon: 'interaction',
      headTitle: 'labelManageTransactionList',
      createPermissions: [''],
      linkToCreate: '/admin/transaction/',
      labelAdd: '',
      labelItem: 'labelTransaction',
      isUseFilter: true,
    };

    const StatementListHoc = observer(
      transactionHoC(
        {
          WrappedComponent: (props: {config: any; updateConfig: any; setCountList: any}) => (
            <TransactionsListTable
              input={props.config}
              updateConfig={props.updateConfig}
              updateCountList={props.setCountList}
            />
          ),
        },
        dataComponent,
      ),
    );

    act(() => {
      render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <StatementListHoc />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
    });
  });
});
