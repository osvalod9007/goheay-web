import React from 'react';
import {unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import i18n from '../../../shared/i18n/i18n';
import {ApolloProvider} from 'react-apollo-hooks';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {MockLink} from 'apollo-link-mock';
import {I18nextProvider} from 'react-i18next';
import {RiftProvider} from 'rift-router';
import {cleanup, fireEvent, render} from '@testing-library/react';
// import { render, fireEvent } from "react-testing-library";
import AccountManagerForm from './AccountManagerForm';
import {routes} from '../../../Routes/Routes';
import {AppStore} from '../../../shared/stores/App.store';

afterEach(cleanup);

const HELLO_MOCKS = [];

const createClient = mocks => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new MockLink(mocks),
  });
};

describe('Test Account Manager Form Component', () => {
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

  it('Should render Account Manager Form component', () => {
    // Test first render and effect
    act(() => {
      render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <AccountManagerForm />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
    });
  });

  it('Should save Snapshot for Account Manager Form component', () => {
    act(() => {
      const app = render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <AccountManagerForm />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
      expect(app).toMatchSnapshot();
    });
  });

  it('Should modify field for Account Manager Form component', () => {
    act(() => {
      render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <AccountManagerForm />
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
    });
    const input: any = document.getElementById('firstName');
    expect(input.value).toBe('');
    input.value = 'change';
    expect(input.value).toBe('change');
  });

  it('Should click in cancel button for Account Manager Form component', () => {
    act(() => {
      render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <RiftProvider routes={routes}>
              <AccountManagerForm />
            </RiftProvider>
          </I18nextProvider>
        </ApolloProvider>,
        container,
      );
    });
    const cancelButton: any = document.getElementById('accountManagerCancelButton');
    const onCancelForm = jest.fn();
    fireEvent.click(cancelButton);
    // expect().toEqual('1');

    // expect(onCancelForm).toHave;
    // expect(input.value).toBe('');
    // input.value = 'change';
    // expect(input.value).toBe('change');
  });

  // it("submits", () => {
  //   const onSubmit = jest.fn();
  //   const { getByTestId } = render(<Form onSubmit={onSubmit} />);
  //   fireEvent.submit(getByTestId("form"));
  //   expect(onSubmit).toHaveBeenCalled();
  // });
});
