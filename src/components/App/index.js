import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import Page from '../PageView';
import Header from '../Header';
import LandingPage from '../Landing';
import AboutPage from '../About';
import { VendorEdit } from '../Vendors';
import { EventsPage, EventEdit } from '../Events';
import SupportPage from '../Support';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';
import * as ROUTE_TITLES from '../../constants/titles';
import { withAuthentication } from '../Session';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2699FB',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#12ceaf',
      contrastText: '#ffffff',
    },
    error: {
      main: '#FF0A58',
      contrastText: '#ffffff',
    }
  },
});

function App (props) {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Header />
        <Route
          exact
          path={ROUTES.LANDING}
          render={() => (
            <Page title={ROUTE_TITLES.LANDING} firebase={props.firebase} >
              <LandingPage />
            </Page>
          )}
        />
        <Route
          path={ROUTES.ABOUT}
          render={() => (
            <Page title={ROUTE_TITLES.ABOUT} firebase={props.firebase} >
              <AboutPage />
            </Page>
          )}
        />
        <Route
          path={ROUTES.SUPPORT}
          render={() => (
            <Page title={ROUTE_TITLES.SUPPORT} firebase={props.firebase} >
              <SupportPage />
            </Page>
          )}
        />
        <Route
          exact
          path={ROUTES.EVENTS}
          render={() => (
            <Page title={ROUTE_TITLES.EVENTS} firebase={props.firebase} >
              <EventsPage />
            </Page>
          )}
        />
        <Route
          path={ROUTES.EVENT_EDIT}
          render={() => (
            <Page title={ROUTE_TITLES.EVENT_EDIT} firebase={props.firebase} >
              <EventEdit />
            </Page>
          )}
        />
        <Route
          exact
          path={ROUTES.EVENT_NEW}
          render={() => (
            <Page title={ROUTE_TITLES.EVENT_NEW} firebase={props.firebase} >
              <EventEdit />
            </Page>
          )}
        />
        <Route
          path={ROUTES.VENDOR_EDIT}
          render={() => (
            <Page title={ROUTE_TITLES.VENDOR_EDIT} firebase={props.firebase} >
              <VendorEdit />
            </Page>
          )}
        />
        <Route
          exact
          path={ROUTES.VENDOR_NEW}
          render={() => (
            <Page title={ROUTE_TITLES.VENDOR_NEW} firebase={props.firebase} >
              <VendorEdit />
            </Page>
          )}
        />
        <Route
          path={ROUTES.SIGN_UP}
          render={() => (
            <Page title={ROUTE_TITLES.SIGN_UP} firebase={props.firebase} >
              <SignUpPage />
            </Page>
          )}
        />
        <Route
          path={ROUTES.SIGN_IN}
          render={() => (
            <Page title={ROUTE_TITLES.SIGN_IN} firebase={props.firebase} >
              <SignInPage />
            </Page>
          )}
        />
        <Route
          path={ROUTES.PASSWORD_FORGET}
          render={() => (
            <Page title={ROUTE_TITLES.PASSWORD_FORGET} firebase={props.firebase} >
              <PasswordForgetPage />
            </Page>
          )}
        />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
      </ThemeProvider>
    </Router>
  );
}

export default withAuthentication(App);
