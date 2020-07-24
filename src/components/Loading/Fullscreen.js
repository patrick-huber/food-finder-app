import React from "react";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
    '-webkit-filter': 'drop-shadow( 1px 1px 0px #fff)',
    filter: 'drop-shadow( 1px 1px 0px #fff)',
  },
}));

export default function FullscreenLoading() {
  const classes = useStyles();
 
  return (
    <Backdrop className={classes.backdrop} open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}