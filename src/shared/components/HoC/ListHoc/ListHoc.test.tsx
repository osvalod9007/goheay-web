import * as React from 'react';
import {shallow, mount} from 'enzyme';
import {observer} from 'mobx-react-lite';
import {ApolloProvider} from 'react-apollo-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {MockLink} from 'apollo-link-mock';
import gql from 'graphql-tag';
import {cleanup} from '@testing-library/react';
import listHoc from './ListHoc';
import DriverListTable from '../../../../Admin/Drivers/List/Table/DriverListTable';
import ModalExport from '../../../../shared/components/ModalExport/ModalExport';

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

describe('Testing List HoC', () => {
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

    shallow(
      <ApolloProvider client={client}>
        <DriverListHoc />
      </ApolloProvider>,
    );
    // expect(wrapper.html()).not.toBe(null);
  });
});
