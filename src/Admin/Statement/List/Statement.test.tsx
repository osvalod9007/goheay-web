import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import i18n from '../../../shared/i18n/i18n';
import {I18nextProvider} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {ApolloProvider} from 'react-apollo-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {MockLink} from 'apollo-link-mock';
import gql from 'graphql-tag';
import {cleanup} from '@testing-library/react';
import listHoc from '../../../shared/components/HoC/ListHoc/ListHoc';
import StatementListTable from './Table/StatementListTable';
import ModalExport from '../../../shared/components/ModalExport/ModalExport';
import StatementList from './StatementList';

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

const client = createClient(HELLO_MOCKS);

const exportFormat = {
  title: 'labelStatementList',
  headers: [
    {
      key: '',
      title: 'labelBookingId',
    },
    {
      key: '',
      title: 'labelCustomerName',
    },
    {
      key: '',
      title: 'labelDriverName',
    },
    {
      key: 'driver.company.id',
      title: 'labelCompany',
    },
    {
      key: 'statusToString',
      title: 'labelStatus',
    },
    {
      key: '',
      title: 'labelAmount',
    },
    {
      key: '',
      title: 'labelFleetCommissionTips',
    },
    {
      key: 'paymentStatusToString',
      title: 'labelPaymentStatus',
    },
    {
      key: 'createdAtExport',
      title: 'labelCreatedDate',
    },
  ],
  format: 'XLSX',
};

const exportToFile = jest.fn();

describe('Test Statement List Component', () => {
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

  it('Should render Statement List component', () => {
    // Test first render and effect
    act(() => {
      render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <StatementList />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
    });
  });

  it('Should save Snapshot for Statement List component', () => {
    act(() => {
      const app = render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <StatementList />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
      expect(app).toMatchSnapshot();
    });
  });

  it('should render the component only when the condition passes', () => {
    const dataComponent = {
      headIcon: 'audit',
      headTitle: 'labelStatementList',
      createPermissions: [''],
      linkToCreate: '/admin/statement/',
      labelAdd: 'labelAddStatement',
      labelItem: 'labelStatement',
      isFormModal: false,
      isUseKeyword: true,
    };

    const StatementListHoc = observer(
      listHoc(
        {
          WrappedComponent: (props: {config: any; updateConfig: any; setCountList: any}) => (
            <StatementListTable
              input={props.config}
              updateConfig={props.updateConfig}
              updateCountList={props.setCountList}
            />
          ),
          WrappedExportComponent: (props: {config: any; visibleExportModal: any; setExportModal: any}) => (
            <ModalExport
              listConfig={props.config}
              visible={props.visibleExportModal}
              setExportModal={props.setExportModal}
              exportTo={exportFormat}
              exportToFile={exportToFile}
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
