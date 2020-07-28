import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import FoodFinderLogo from '../SVG/food-finder-logo.svg';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RoomIcon from '@material-ui/icons/Room';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

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
  hide: {
    display: 'none',
  },
  drawer: {
    '& .MuiDrawer-paper': {
      backgroundColor: 'rgba(235, 245, 254, 0.95)',  
    }
  },
  list: {
    width: '100vw',
  },
  menuLink : {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
  mapIcon: {
    color: theme.palette.secondary.main,
  }
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
      <List className={clsx(classes.menuList)} component="nav" aria-label="Primary nav">
        <Link to={ROUTES.EVENTS}>
          <ListItem
            button
          >
            <ListItemIcon></ListItemIcon>
            <ListItemText primary="Events" />
          </ListItem>
        </Link>
        <Link to={ROUTES.ACCOUNT}>
          <ListItem
            button
          >
            <ListItemIcon></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </Link>
        {!!authUser.roles[ROLES.ADMIN] && (
        <Link to={ROUTES.ADMIN}>
          <ListItem
            button
          >
            <ListItemIcon></ListItemIcon>
            <ListItemText primary="Admin" />
          </ListItem>
        </Link>
        )}
        <Link to={ROUTES.ACCOUNT}>
          <ListItem
            button
          >
            <ListItemIcon></ListItemIcon>
            <SignOutButton />
          </ListItem>
        </Link>

        <Divider />
        <Link to={ROUTES.LANDING}>
          <ListItem
            button
          >
            <ListItemIcon>
              <RoomIcon />
            </ListItemIcon>
            <ListItemText primary="Food Finder Map" />
          </ListItem>
        </Link>
      </List>
    </div>
  );

  const NavigationNonAuth = () => (
    <div>
      <List component="nav" aria-label="Primary nav">
        <Link className={clsx(classes.menuLink)} to={ROUTES.LANDING}>
          <ListItem
            button
            selected
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
        <ListItem
          button
          onClick={() => window.open('https://forms.gle/14XSLARoKh9CBYB8A')}
        >
          <ListItemIcon>
            <ReportProblemIcon />
          </ListItemIcon>
          <ListItemText primary="Report Bad Info" />
        </ListItem>
        <Divider />

        <Link className={clsx(classes.menuLink)} to={ROUTES.SIGN_IN}>
          <ListItem
            button
          >
            <ListItemText inset primary="Vendor Sign In" />
          </ListItem>
        </Link>
      </List>
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
        <div
          className={clsx(classes.list)}
          role="presentation"
          onClick={handleDrawerClose}
          onKeyDown={handleDrawerClose}
        >
          <Navigation />
        </div>
      </Drawer>
    </div>
  );
}
