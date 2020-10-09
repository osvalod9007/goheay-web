import {BaseClient} from '../config/BaseClient';

class AppModel extends BaseClient {
  infoForLogin() {
    const schema = `
      query{
        BasicProfileGet{
          firstName
          lastName
          email
          mobilePhone
          mobilePhoneCode
          avatar
          roles
          permissions
        }
      }
      `;
    return this.query('websiteBackend', schema, undefined);
  }

  getCountries() {
    const schema = `
      query{
        CountryList {
          total
          items {
            id
            name
        }
        }
      }
    `;
    return this.publiQuery(schema, undefined);
  }

  getStates(input: any) {
    const schema = `
    query($input: GenericFilterInput){
      StateList(input: $input){
        total
        items {
          id
          name
        }
      }
    }
    `;
    return this.publiQuery(schema, {input});
  }

  getCurrencyList(input: any) {
    const schema = `
    query($input: GenericFilterInput){
      CurrencyList(input: $input){
        total
        items {
          id
          name
          alphabeticCode
        }
      }
    }
    `;
    return this.publiQuery(schema, {input});
  }

  authLoginByPhone(input) {
    const schema = `
      mutation($input:AuthLoginByPhoneInput! ){
        AuthLoginByPhone(input: $input){
          token
          url
        }
      }
    `;
    return this.publicMutate(schema, {input});
  }

  authLoginByEmail(input) {
    const schema = `
      mutation($input: LoginInput! ){
        login(input: $input){
          token
          valid
          message
        }
      }
    `;
    return this.mutate('websiteBackend', schema, {input});
  }

  getPermissions() {
    const schema = `
      query {
        UserMe {
          name
          last_name
          email
          mobile
          picture
          roles {
            permissions {
              name
              display_name
              description
              type
            }
          }
        }
      }
    `;
    return this.query('websiteBackend', schema, undefined);
  }

  forgotPasswordRequestCreate(input) {
    const schema = `
      mutation($input:ForgotPasswordRequestCreateInput! ){
        ForgotPasswordRequestCreate(input: $input){
          isSuccess
        }
      }
    `;
    return this.publicMutate(schema, {input});
  }
  userPasswordUpdateUsingCode(input) {
    const schema = `
      mutation($input:UserPasswordUpdateUsingCodeInput! ){
        UserPasswordUpdateUsingCode(input: $input){
          isSuccess
        }
      }
    `;
    return this.publicMutate(schema, {input});
  }
  getCompanyList(input: any) {
    const schema = `
    query($input: GenericFilterInput){
      CompanyList(input: $input){
        total
        items {
          id
          name
        }
      }
    }
    `;
    return this.query('websiteBackend', schema, {input});
  }
}

const appModel = new AppModel();
export default appModel;
