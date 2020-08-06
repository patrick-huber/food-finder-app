import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import FoodFinderLogo from '../SVG/food-finder-logo.svg';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RoomIcon from '@material-ui/icons/Room';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

import { SetVendor } from '../Vendors';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: 'rgba(235, 245, 254, .9)',
    boxShadow: 'none',
  },
  title: {
    margin: '0 auto',
    '-webkit-filter': 'drop-shadow( 1px 1px 0px #fff)',
    filter: 'drop-shadow( 1px 1px 0px #fff)',
  },
  menuButton: {
    left: theme.spacing(2),
    position: 'absolute',
    color: '#2699FB',
    '-webkit-filter': 'drop-shadow( 1px 1px 0px #fff)',
    filter: 'drop-shadow( 1px 1px 0px #fff)',
  },
  drawer: {
    '& .MuiDrawer-paper': {
      backgroundColor: 'rgba(235, 245, 254, 0.95)',  
    }
  },
  setVendor: {
    paddingBottom: 20,
  },
  list: {
    width: '100vw',
  },
  menuLink : {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
  mapIcon: {
    color: theme.palette.error.main,
  },
}));

export default function Header() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const Navigation = (anchor) => (
      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? (
            <NavigationAuth authUser={authUser}/>
          ) : (
            <NavigationNonAuth />
          )
        }
      </AuthUserContext.Consumer>
  );

  const NavigationAuth = ({ authUser }) => ( 
    <div>
      {!!authUser.roles[ROLES.ADMIN] && (
        <Container maxWidth="sm" className={clsx(classes.setVendor)}>
          <SetVendor/>
        </Container>
      )}
      <Container>
        <Typography gutterBottom component="div" variant="h5">
          {authUser.username}
          <Typography component="span" variant="subtitle1">
            &nbsp;({authUser.email} )
          </Typography>
        </Typography>
      </Container>
      <div
        className={clsx(classes.list)}
        role="presentation"
        onClick={handleDrawerClose}
        onKeyDown={handleDrawerClose}
      >
        <List className={clsx(classes.menuList)} component="nav" aria-label="Primary nav">
          <Link className={clsx(classes.menuLink)} to={ROUTES.EVENTS}>
            <ListItem
              button
            >
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Manage Events" />
            </ListItem>
          </Link>
          <Link className={clsx(classes.menuLink)} to={'/vendor/edit/' + authUser.vendor}>
            <ListItem
              button
            >
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Edit Food Stand" />
            </ListItem>
          </Link>
          {!!authUser.roles[ROLES.ADMIN] && (
            <Link className={clsx(classes.menuLink)} to={ROUTES.VENDOR_NEW}>
              <ListItem
                button
              >
                <ListItemIcon></ListItemIcon>
                <ListItemText primary="New Food Stand" />
              </ListItem>
            </Link>
          )}
          <Link className={clsx(classes.menuLink)} to={ROUTES.ACCOUNT}>
            <ListItem
              button
            >
              <ListItemIcon></ListItemIcon>
              <SignOutButton />
            </ListItem>
          </Link>
          <Divider />
          <Link className={clsx(classes.menuLink)} to={ROUTES.LANDING}>
            <ListItem
              button
            >
              <ListItemIcon>
                <RoomIcon className={clsx(classes.mapIcon)} />
              </ListItemIcon>
              <ListItemText primary="Food Finder Map" />
            </ListItem>
          </Link>
          <Link className={clsx(classes.menuLink)} to={ROUTES.SUPPORT}>
            <ListItem
              button
            >
              <ListItemText inset primary="Support & Contact" />
            </ListItem>
          </Link>
        </List>
      </div>
    </div> 
  );

  const NavigationNonAuth = () => (
    <div>
      <div
        className={clsx(classes.list)}
        role="presentation"
        onClick={handleDrawerClose}
        onKeyDown={handleDrawerClose}
      >
        <List component="nav" aria-label="Primary nav">
          <Link className={clsx(classes.menuLink)} to={ROUTES.LANDING}>
            <ListItem
              button
            >
              <ListItemIcon>
                <RoomIcon className={clsx(classes.mapIcon)} />
              </ListItemIcon>
              <ListItemText primary="Food Finder Map" />
            </ListItem>
          </Link>
          <Link className={clsx(classes.menuLink)} to={ROUTES.VENDORS}>
            <ListItem
              button
            >
              <ListItemText inset primary="Vendors" />
            </ListItem>
          </Link>
          <Link className={clsx(classes.menuLink)} to={ROUTES.SUPPORT}>
            <ListItem
              button
            >
              <ListItemText inset primary="Support & Contact" />
            </ListItem>
          </Link>
          <Divider />
          <Link className={clsx(classes.menuLink)} to={ROUTES.SIGN_IN}>
            <ListItem
              button
            >
              <ListItemIcon>
                <LockOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Vendor Login" />
            </ListItem>
          </Link>
          <Divider />
          <ListItem
            button
            onClick={() => window.open('https://forms.gle/14XSLARoKh9CBYB8A')}
          >
            <ListItemIcon>
              <ReportProblemIcon />
            </ListItemIcon>
            <ListItemText primary="Report Bad Info" />
          </ListItem>
        </List>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar)}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open menu"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton)}
          >
            <MenuIcon />
          </IconButton>
          <img className={clsx(classes.title)} src={FoodFinderLogo} alt="Fair Food Finder" />
        </Toolbar>
      </AppBar>
      <Drawer className={clsx(classes.drawer)} open={open}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setOpen(false)} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Navigation />
      </Drawer>
    </div>
  );
}
