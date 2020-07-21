import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { lightBlue } from '@material-ui/core/colors';

import Header from '../Header';
import LandingPage from '../Landing';
import AboutPage from '../About';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2699FB',
    },
  },
});

function App () {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Header />

        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.ABOUT} component={AboutPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route
          path={ROUTES.PASSWORD_FORGET}
          component={PasswordForgetPage}
        />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
      </ThemeProvider>
    </Router>
  );
}

export default withAuthentication(App);
