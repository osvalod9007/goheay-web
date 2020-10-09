import {AppStore} from './App.store';

describe('Test App Store', () => {
  const store = new AppStore();
  const loginAsAdmin = jest.fn().mockImplementation(store.loginAsAdmin);

  it('create App Store', () => {
    store.setIsLoading(true);
    expect(store.isLoading).toBeTruthy();
  });

  it('tsting IsEditing App Store', () => {
    store.setIsEditing(true);
    expect(store.isEditing).toBeTruthy();
  });

  it('Test auth method', () => {
    loginAsAdmin();
    expect(loginAsAdmin).toHaveBeenCalled();
  });

  test('when user is provided', () => {
    loginAsAdmin({email: 'test@test.com', password: 'test123'});
    expect(loginAsAdmin).toHaveBeenCalled();

    const result = loginAsAdmin.mock.results[0].value;
    // expect(result).toBe({});
  });

  it('Test set token', () => {
    store.setToken(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjJhZDFkNzVlYWJmODQyN2QxYjYwN2IwMjQ3NTQxN2QyNmNlNGZjMjhlMDA1ODQ1OWQ2NDc1ZDA5Njc4ZWEyNjc0YjcyM2U1NTJiYWFmMGVhIn0.eyJhdWQiOiI1IiwianRpIjoiMmFkMWQ3NWVhYmY4NDI3ZDFiNjA3YjAyNDc1NDE3ZDI2Y2U0ZmMyOGUwMDU4NDU5ZDY0NzVkMDk2NzhlYTI2NzRiNzIzZTU1MmJhYWYwZWEiLCJpYXQiOjE1NjQxNTM3MjYsIm5iZiI6MTU2NDE1MzcyNiwiZXhwIjoxNTk1Nzc2MTI2LCJzdWIiOiIxIiwic2NvcGVzIjpbIioiXX0.Opib8IAhdJ2pBqyhnoIT36FtHP7bark62Hco4hUPSrD5PGCTrbW48LTdbAlKX8-iSgRwOj6PISGcr3YWL2inX-5bHXVwTJe3kGHvkL5gOxsJeVbwD2f_YRN7D0UxvzWq-e11LJhJ-nzXxfq-Owrk8-jxDEFBs5mLHGOok4l-XeYbTwVkDPSBjPfwmQjG2VhuV2GjgImf943GNuLAei9HGcMndy0HCPRuxfYAx4ahEclFhud96ZEZmppPtXQfjihnPIjw719oCy7oI6f3pne_-t-6EH6Q2XF2Ml9orsdNrP-dRKyetrQnSJuWaEV5TNzDt_Wgz1r4HDS1YKgcU896woDsFHUh71XbGjfJquQ2ONxcYv8aKvg9bQoY3Gv_uJQnNffex9I4pWj_TnhnCr9MXvh3ozDAxPVa-Crk-mYfAaD0lvV7Wa0hRnSZvwj0KgPNLzmPdi515LYIyDt4mkiKUxwKeFxwrB7glkP0cfBQm8B5-rJGp9N7FfISjJJOApcScAqXhjysyOdYhb1u_t8_0w7aYXvHrFzgr014doHo7pvtG6etA_4h0xc1D64aF-FpNUJBrhykqwCUYQ1GjSWs-hrTaD_jWDncvnOc8B2_ni4XkNQjQVrBVbYHCk8YUF3y6mbUb8KiFVqnF-41ZHJYy0j0cMJBCXiZTAeGUtSfyCA',
    );
    expect(store.token).toStrictEqual(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjJhZDFkNzVlYWJmODQyN2QxYjYwN2IwMjQ3NTQxN2QyNmNlNGZjMjhlMDA1ODQ1OWQ2NDc1ZDA5Njc4ZWEyNjc0YjcyM2U1NTJiYWFmMGVhIn0.eyJhdWQiOiI1IiwianRpIjoiMmFkMWQ3NWVhYmY4NDI3ZDFiNjA3YjAyNDc1NDE3ZDI2Y2U0ZmMyOGUwMDU4NDU5ZDY0NzVkMDk2NzhlYTI2NzRiNzIzZTU1MmJhYWYwZWEiLCJpYXQiOjE1NjQxNTM3MjYsIm5iZiI6MTU2NDE1MzcyNiwiZXhwIjoxNTk1Nzc2MTI2LCJzdWIiOiIxIiwic2NvcGVzIjpbIioiXX0.Opib8IAhdJ2pBqyhnoIT36FtHP7bark62Hco4hUPSrD5PGCTrbW48LTdbAlKX8-iSgRwOj6PISGcr3YWL2inX-5bHXVwTJe3kGHvkL5gOxsJeVbwD2f_YRN7D0UxvzWq-e11LJhJ-nzXxfq-Owrk8-jxDEFBs5mLHGOok4l-XeYbTwVkDPSBjPfwmQjG2VhuV2GjgImf943GNuLAei9HGcMndy0HCPRuxfYAx4ahEclFhud96ZEZmppPtXQfjihnPIjw719oCy7oI6f3pne_-t-6EH6Q2XF2Ml9orsdNrP-dRKyetrQnSJuWaEV5TNzDt_Wgz1r4HDS1YKgcU896woDsFHUh71XbGjfJquQ2ONxcYv8aKvg9bQoY3Gv_uJQnNffex9I4pWj_TnhnCr9MXvh3ozDAxPVa-Crk-mYfAaD0lvV7Wa0hRnSZvwj0KgPNLzmPdi515LYIyDt4mkiKUxwKeFxwrB7glkP0cfBQm8B5-rJGp9N7FfISjJJOApcScAqXhjysyOdYhb1u_t8_0w7aYXvHrFzgr014doHo7pvtG6etA_4h0xc1D64aF-FpNUJBrhykqwCUYQ1GjSWs-hrTaD_jWDncvnOc8B2_ni4XkNQjQVrBVbYHCk8YUF3y6mbUb8KiFVqnF-41ZHJYy0j0cMJBCXiZTAeGUtSfyCA',
    );
    expect(store.isLoading).toBe(true);
  });
});
