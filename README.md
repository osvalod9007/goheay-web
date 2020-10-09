This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

##  The .env file

The .env file must be created in the root of the project, with the following content:<br>
REACT_APP_WEB=http://url-web.com<br>
REACT_APP_API=http://url-api.com<br>
REACT_APP_SECRET_KEY=secret_key<br>
REACT_APP_SECRET_ID=secret_id<br>
REACT_APP_ENV='env'<br>
REACT_APP_GOOGLE_MAP=secret_key_of_google_map<br>
REACT_APP_SOCKET=http://url-socket.com<br>
REACT_APP_STORAGE=storage_dir_from_api<br>
REACT_APP_CLIENT_ID_STRIPE=secret_client_id_stripe

## Available Scripts

In the project directory, you can run:

### `yarn start` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test` or `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build` or `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn lint` or `npm run lint`

Linting makes more sense when run before committing your code. By doing so you can ensure no errors go into the repository and enforce code
style. But running a lint process on a whole project is slow and linting results can be irrelevant. Ultimately you only want to lint files that will be committed. 

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
