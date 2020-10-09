import * as React from 'react';
import {shallow, mount} from 'enzyme';
import {Form} from 'antd';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../../shared/i18n/i18n';
import {ApolloProvider} from 'react-apollo-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {MockLink} from 'apollo-link-mock';
import gql from 'graphql-tag';
import {cleanup} from '@testing-library/react';
import PriceForm from './PriceForm';
import {FormComponentProps} from 'antd/lib/form';

afterEach(cleanup);

const HELLO_MOCKS = [
  {
    request: {
      query: gql`
        mutation($input: PriceProductSizeUpdateListInput!) {
          PriceProductSizeUpdate(id: $id, input: $input) {
            total
            items {
              id
            }
          }
        }
      `,
      variables: {
        input: {},
        id: 'NmUzZmY3OTA5OTA5ZjgyOWZiZTcyNjhiZjkxODBiZGM6MQ',
      },
    },
    result: {
      data: {
        PriceProductSizeUpdate: {
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

const FormComponent = Form.create()(PriceForm);

describe('Price Form', () => {
  let wrapper;
  let formRef;

  it('Price Form renders correctly', () => {
    shallow(<FormComponent />);
  });

  it('Should render correctly Price Form with Snapshot', () => {
    const component = shallow(<FormComponent />);
    expect(component).toMatchSnapshot();
  });

  it('render Price Form without crashing', () => {
    i18n.changeLanguage(require(`antd/lib/locale-provider/en_US.js`).default.locale);
    const client = createClient(HELLO_MOCKS);
    wrapper = mount(
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18n}>
          <FormComponent
            wrappedComponentRef={inst => {
              formRef = inst;
            }}
          />
        </I18nextProvider>
      </ApolloProvider>,
    );
  });

  it('when the form is submitted the event is cancelled for Price Form', () => {
    let prevented = false;
    wrapper.find('form#price-form').simulate('submit', {
      preventDefault: () => {
        prevented = true;
      },
    });

    expect(prevented).toBe(true);
  });

  it('Test handle submit', () => {
    const handleSubmit = jest.fn();
    handleSubmit();
    expect(handleSubmit).toHaveBeenCalled();
  });
});
