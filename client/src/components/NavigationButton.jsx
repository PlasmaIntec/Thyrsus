import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
};

var renderNavButton = false;

const toggleNavButton = (position = renderNavButton) => {
  renderNavButton = position;
  position 
  ? document.getElementsByClassName('NavButton')[0].style.display = 'block'
  : setTimeout(() => {
      document.getElementsByClassName('NavButton')[0].style.display = 'none';
    }, 2000)
};

const NavigationButton = (props) => {
  const { classes } = props;
  return (
    <div className='UIElement NavButton'>
      <Slide direction='up' in={ renderNavButton } timeout={2000}>
        <Card className={classes.card}>
          <CardActions>
            <Button size="small" color="primary" onClick={ props.prevBar }>
              Prev
            </Button>
            <Button size="small" color="primary" onClick={ props.nextBar }>
              Next
            </Button>
          </CardActions>
        </Card>
      </Slide>
    </div>
  );
};

const NavButton = withStyles(styles)(NavigationButton);

export { NavButton, toggleNavButton };