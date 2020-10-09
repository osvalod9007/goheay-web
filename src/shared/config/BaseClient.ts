import {ApolloClient} from 'apollo-client';
import gql from 'graphql-tag';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error';
import {ApolloLink, Observable} from 'apollo-link';
import {createUploadLink} from 'apollo-upload-client';
import openNotificationWithIcon from '../components/OpenNotificationWithIcon/OpenNotificationWithIcon';

const API = `${process.env.REACT_APP_API}`;
const ENV = `${process.env.REACT_APP_ENV}`;
const STORE_VAR = `jwtGoHeavy-${ENV}`;

export abstract class BaseClient {
  client;

  login(data) {
    const {token} = data;
    if (token) {
      localStorage.setItem(STORE_VAR, JSON.stringify(data));
    }
  }

  logout() {
    localStorage.removeItem(STORE_VAR);
  }

  hasToken() {
    const jwtData: any = localStorage.getItem(STORE_VAR);
    return jwtData !== undefined && jwtData !== null ? true : false;
  }

  getToken() {
    const jwtData: any = localStorage.getItem(STORE_VAR) ? localStorage.getItem(STORE_VAR) : {};
    return jwtData;
  }

  getSessionData(): Promise<any> {
    const jwtData: any = localStorage.getItem(STORE_VAR);
    if (jwtData) {
      return new Promise<any>((resolve, reject) => {
        resolve(JSON.parse(jwtData));
      });
    }
    return new Promise<any>((resolve, reject) => {
      resolve({token: '', roles: [], permissions: []});
    });
  }

  createPublicClient() {
    return new ApolloClient({
      link: ApolloLink.from([
        onError(({graphQLErrors, networkError}) => {
          // if (graphQLErrors) {
          //   graphQLErrors.forEach(({message, locations, path}) =>
          //     openNotificationWithIcon('error', `GraphQL: ${message}`, ''),
          //   );
          // }
          if (networkError) {
            if ((networkError as any).statusCode === 403) {
              this.logout();
              window.location.href = '/admin/login';
            } else {
              openNotificationWithIcon('error', `Please wait, at this moment cannot connect to the server.`, '');
            }
          }
        }),
        new HttpLink({
          uri: `${API}/api/public`,
          credentials: 'same-origin',
        }),
      ]),
      cache: new InMemoryCache(),
    });
  }

  createPrivateClient(scope, token: string) {
    const request = async operation => {
      await operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : '',
        },
      });
    };
    const requestLink = new ApolloLink(
      (operation, forward: any) =>
        new Observable(observer => {
          let handle;
          Promise.resolve(operation)
            .then(oper => request(oper))
            .then(() => {
              handle = forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            })
            .catch(observer.error.bind(observer));

          return () => {
            if (handle) {
              handle.unsubscribe();
            }
          };
        }),
    );

    return new ApolloClient({
      link: ApolloLink.from([
        onError(({graphQLErrors, networkError}) => {
          // if (graphQLErrors) {
          //   graphQLErrors.forEach(({message, locations, path}) =>
          //     openNotificationWithIcon('error', `GraphQL: ${message}`, ''),
          //   );
          // }
          if (networkError) {
            if ((networkError as any).statusCode === 403) {
              this.logout();
              window.location.href = '/admin/login';
            } else {
              openNotificationWithIcon('error', `Please wait, at this moment cannot connect to the server.`, '');
            }
          }
        }),
        requestLink,
        new createUploadLink({
          uri: `${API}/api/${scope}`,
        }),
      ]),
      cache: new InMemoryCache(),
    });
  }

  getClient(scope) {
    return this.getSessionData().then(response => {
      const {token} = response;
      let client;
      if (this.client) {
        client = this.client;
      } else {
        this.login(response);
        client = this.createPrivateClient(scope, token);
      }
      return Promise.resolve(client);
    });
  }

  request(scope, callback) {
    return new Promise((resolve, reject) => {
      this.getSessionData().then(response => {
        const {token} = response;
        let client;
        if (this.client) {
          client = this.client;
        } else {
          // this.login({ user: {}, token });
          client = this.createPrivateClient(scope, token);
        }
        resolve(callback(client));
      });
    });
  }

  query(scope, schema, variables) {
    return this.request(scope, client => {
      return client.query({
        query: gql`
          ${schema}
        `,
        variables,
      });
    });
  }

  mutate(scope, schema, variables) {
    return this.request(scope, client => {
      return client.mutate({
        mutation: gql`
          ${schema}
        `,
        variables,
      });
    });
  }

  publicRequest(callback) {
    return new Promise((resolve, reject) => {
      const client = this.createPublicClient();
      resolve(callback(client));
    });
  }

  publiQuery(schema, variables) {
    return this.publicRequest(client => {
      return client.query({
        query: gql`
          ${schema}
        `,
        variables,
      });
    });
  }

  publicMutate(schema, variables) {
    return this.publicRequest(client => {
      return client.mutate({
        mutation: gql`
          ${schema}
        `,
        variables,
      });
    });
  }
}
