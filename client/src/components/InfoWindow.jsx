import React from 'react';
import { Link } from 'react-router-dom';
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

var renderInfoWindow = false;
var info = {
  imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Bosphorus.jpg/397px-Bosphorus.jpg",
  name: "Istanbul",
  description: "Istanbul is a major city in Turkey that straddles Europe and Asia across the Bosphorus Strait. Its Old City reflects cultural influences of the many empires that once ruled here.",
  website: "google.com",
  mapURL: "google.com",

};

const toggleInfoWindow = (position = renderInfoWindow) => {
  renderInfoWindow = position;
  position 
  ? document.getElementsByClassName('InfoWindow')[0].style.display = 'block'
  : setTimeout(() => {
      document.getElementsByClassName('InfoWindow')[0].style.display = 'none';
    }, 2000)
};

const updateInfoWindow = results => {
  info.imageURL = results.photos[0].getUrl();
  info.name = results.name;
  info.description = results.formatted_address;
  info.website = results.website;
  info.mapURL = results.url;
  console.log(info);
};

function InfoWindow(props) {
  const { classes } = props;
  return (
    <div className='UIElement InfoWindow'>
      <Slide direction='left' in={ renderInfoWindow } timeout={2000}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={ info.imageURL }
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              { info.name }
            </Typography>
            <Typography component="p">
              { info.description }
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" href={ info.website } target="_blank">
              Website
            </Button>
            <Button size="small" color="primary" href={ info.mapURL } target="_blank">
              Map
            </Button>
          </CardActions>
        </Card>
      </Slide>
    </div>
  );
};

const Info = withStyles(styles)(InfoWindow);

export { Info, toggleInfoWindow, updateInfoWindow };