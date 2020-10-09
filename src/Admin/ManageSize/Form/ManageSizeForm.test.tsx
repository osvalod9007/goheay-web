// import * as React from 'react';
// import {shallow, mount} from 'enzyme';
// import {Form} from 'antd';
// import {I18nextProvider} from 'react-i18next';
// import i18n from '../../../shared/i18n/i18n';
// import ManageSizeForm from './ManageSizeForm';
// import {ApolloProvider} from 'react-apollo-hooks';
// import gqlClient from '../../../shared/config/gqlClient';

// const FormComponent = Form.create()(ManageSizeForm);

// describe('Manage Size Form', () => {
//   let wrapper;
//   let formRef;

//   it('Manage Size Form renders correctly', () => {
//     gqlClient.getClient().then(client => {
//       shallow(
//         <ApolloProvider client={client}>
//           <FormComponent />
//         </ApolloProvider>,
//       );
//     });
//   });

//   it('Should render correctly Manage Size Form without Snapshot', () => {
//     gqlClient.getClient().then(client => {
//       const component = shallow(
//         <ApolloProvider client={client}>
//           <FormComponent />
//         </ApolloProvider>,
//       );
//       expect(component).toMatchSnapshot();
//     });
//   });
//   it('render Manage Size Form without crashing', () => {
//     gqlClient.getClient().then(client => {
//       wrapper = mount(
//         <ApolloProvider client={client}>
//           <FormComponent
//             wrappedComponentRef={inst => {
//               formRef = inst;
//             }}
//           />
//         </ApolloProvider>,
//       );
//     });
//   });

//   it('should set weightMax value for Manage Size Form', () => {
//     const {form} = formRef.props;
//     form.setFieldsValue({
//       weightMax: 30,
//     });
//     expect(form.getFieldValue('weightMax')).toEqual(30);
//   });

//   it('should set weightMin value for Manage Size Form', () => {
//     const {form} = formRef.props;
//     form.setFieldsValue({
//       weightMin: 0,
//     });
//     expect(form.getFieldValue('weightMin')).toEqual(0);
//   });

//   it('when the form is submitted the event is cancelled for Manage Size Form', () => {
//     let prevented = false;
//     wrapper.find('form#manage-size-form').simulate('submit', {
//       preventDefault: () => {
//         prevented = true;
//       },
//     });
//     expect(prevented).toBe(true);
//   });

//   it('Test handle submit', () => {
//     const handleSubmit = jest.fn();
//     handleSubmit();
//     expect(handleSubmit).toHaveBeenCalled();
//   });
// });

import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import i18n from '../../../shared/i18n/i18n';
import {ApolloProvider} from 'react-apollo-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {MockLink} from 'apollo-link-mock';
import {I18nextProvider} from 'react-i18next';
import gql from 'graphql-tag';
import {cleanup} from '@testing-library/react';
import ManageSizeForm from './ManageSizeForm';
import {UnitMassEnum} from '../../../shared/enums/UnitMass.enum';
import {UnitLengthEnum} from '../../../shared/enums/UnitLength.enum';
import {UnitTimeEnum} from '../../../shared/enums/UnitTime.enum';

afterEach(cleanup);

const HELLO_MOCKS = [
  {
    request: {
      query: gql`
        mutation($id: EncryptId!, $input: ProductSizeUpdateInput!) {
          ProductSizeUpdate(id: $id, input: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          measureWeightMax: {
            amount: 14,
            unit: UnitMassEnum.pounds,
          },
          measureLwh: {
            amount: 14.2,
            unit: UnitLengthEnum.inches,
          },
          measureTotalLinearMin: {
            amount: 12,
            unit: UnitLengthEnum.inches,
          },
          measureTotalLinearMax: {
            amount: 24,
            unit: UnitLengthEnum.inches,
          },
          measureLabourLoadingSingle: {
            amount: 23,
            unit: UnitTimeEnum.minutes,
          },
          measureLabourLoadingMultiple: {
            amount: 45,
            unit: UnitTimeEnum.minutes,
          },
          measureLabourUnloadingSingle: {
            amount: 34,
            unit: UnitTimeEnum.minutes,
          },
          measureLabourUnloadingMultiple: {
            amount: 23,
            unit: UnitTimeEnum.minutes,
          },
        },
        id: 'NmUzZmY3OTA5OTA5ZjgyOWZiZTcyNjhiZjkxODBiZGM6MQ',
      },
    },
    result: {
      data: {
        ProductSizeUpdate: {
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

describe('Test Manage Size Form Component', () => {
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

  it('Should render Manage Size Form component', () => {
    // Test first render and effect
    act(() => {
      render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <ManageSizeForm />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
    });
  });

  it('Should save Snapshot for Manage Size Form component', () => {
    act(() => {
      const app = render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <ManageSizeForm />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
      expect(app).toMatchSnapshot();
    });
  });

  it('Should modify field for Manage Size Form component', () => {
    act(() => {
      render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <ManageSizeForm />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
    });
    const input: any = document.getElementById('lwhValue');
    expect(input.value).toBe('');
    input.value = 3;
    expect(+input.value).toBe(3);
  });
});
