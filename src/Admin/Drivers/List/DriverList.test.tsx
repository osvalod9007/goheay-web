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
import DriverListTable from './Table/DriverListTable';
import ModalExport from '../../../shared/components/ModalExport/ModalExport';
import DriverList from './DriverList';

afterEach(cleanup);
const HELLO_MOCKS = [
  {
    request: {
      query: gql`
        query($input: GenericFilterInput) {
          DriverList(input: $input) {
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

const client = createClient(HELLO_MOCKS);

const exportFormat = {
  title: 'labelDriverList',
  headers: [
    {
      key: 'basicProfile.fullName',
      title: 'labelFullName',
    },
    {
      key: 'basicProfile.email',
      title: 'labelEmail',
    },
    {
      key: 'basicProfile.fullMobilePhone',
      title: 'labelMobile',
    },
    {
      key: 'company.name',
      title: 'labelCompany',
    },
    {
      key: 'statusToString',
      title: 'labelStatus',
    },
    {
      key: 'rating',
      title: 'labelRating',
    },
    {
      key: 'basicProfile.createdAtExport',
      title: 'labelCreatedDate',
    },
  ],
  format: 'XLSX',
};

const exportToFile = jest.fn();

describe('Test Driver List Component', () => {
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

  it('Should render Driver List component', () => {
    // Test first render and effect
    act(() => {
      render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <DriverList />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
    });
  });

  it('Should save Snapshot for Driver List component', () => {
    act(() => {
      const app = render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <DriverList />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
      expect(app).toMatchSnapshot();
    });
  });

  it('should render the component only when the condition passes', () => {
    const dataComponent = {
      headIcon: 'car',
      headTitle: 'labelDriverList',
      createPermissions: ['DriverCreate'],
      linkToCreate: '/admin/driver/',
      labelAdd: 'labelAddDriver',
      labelItem: 'labelDriver',
      isFormModal: false,
      isUseKeyword: true,
    };

    const DriverListHoc = observer(
      listHoc(
        {
          WrappedComponent: (props: {config: any; updateConfig: any; setCountList: any}) => (
            <DriverListTable
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
            <DriverListHoc />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
    });
  });
});
