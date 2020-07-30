import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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

import Footer from '../Footer';

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

function PasswordForgetPage(props) {
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
          Password Reset
        </Typography>
        <PasswordForgetForm {...props} />
      </div>
    </Container>
  );
}

const INITIAL_STATE = {
  email: '',
  error: null,
  loading: false,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.setState({loading: true});

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        alert('Password reset email sent. Please check your inbox for a link to reset your password.');
        this.props.history.goBack();
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
    const { email, error, loading } = this.state;

    const isInvalid = email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          
          value={this.state.email}
          onChange={this.onChange}
        />

        <Button
          disabled={isInvalid || loading}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Reset My Password
          {loading &&
            <CircularProgress size={20} />
          }
        </Button>

        {error && <FormHelperText error aria-label="missing required fields">{error.message}</FormHelperText>}
      </form>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
