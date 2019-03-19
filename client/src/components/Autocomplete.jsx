import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import { sizing } from '@material-ui/system';

const styles = {
  card: {
    width: 2000,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  root: {
    left: '0px',
    width: '100%',
  },
};

var renderAutocomplete = false;

const toggleAutocomplete = (position = renderAutocomplete) => {
  renderAutocomplete = position;
  position 
  ? document.getElementsByClassName('Autocomplete')[0].style.display = 'block'
  : setTimeout(() => {
      document.getElementsByClassName('Autocomplete')[0].style.display = 'none';
    }, 2000)
};

function Autocomplete(props) {
  const { classes } = props;  
  return (
    <div className={ classes.root + ' UIElement Autocomplete' }>
      <Slide direction='down' in={ renderAutocomplete } timeout={2000}>
        <form className={ classes.container }>
          <TextField
            id="autocomplete-input"
            label="Current Location"
            margin="normal"
            variant="outlined"
            fullWidth
          />
        </form>
      </Slide>
    </div>
  );
};

const Auto = withStyles(styles)(Autocomplete);

export { Auto, toggleAutocomplete };