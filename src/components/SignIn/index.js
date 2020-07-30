import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

function SignInPage() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.appBarSpacer} />
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography gutterBottom component="h1" variant="h5">
          Vendor Sign in
        </Typography>
        <SignInForm />
        <PasswordForgetLink />
        <SignUpLink />
      </div>
    </Container>
  );
}

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
  loading: false,
};

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.setState({loading: true});

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.EVENTS);
      })
      .catch(error => {
        this.setState({ loading: false, error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error, loading } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={this.onChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          name="password"
          value={password}
          onChange={this.onChange}
        />
        <Button
          disabled={isInvalid || loading}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Sign In
          {loading &&
            <CircularProgress size={20} />
          }
        </Button>
        {error && <FormHelperText error aria-label="missing required fields">{error.message}</FormHelperText>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
