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

var renderInfoWindow = false;
var info = {
  imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Bosphorus.jpg/397px-Bosphorus.jpg",
  name: "Istanbul",
  address: "Istanbul is a major city in Turkey that straddles Europe and Asia across the Bosphorus Strait. Its Old City reflects cultural influences of the many empires that once ruled here.",
  website: "google.com",
  mapURL: "google.com",
  distance: null,
  duration: null,
  review: {
    text: "lorem",
    author: "lorey"
  },
  open: false
};

const toggleInfoWindow = (position = renderInfoWindow) => {
  renderInfoWindow = position;
  position 
  ? document.getElementsByClassName('InfoWindow')[0].style.display = 'block'
  : setTimeout(() => {
      document.getElementsByClassName('InfoWindow')[0].style.display = 'none';
    }, 2000)
};

const updateInfoWindow = (results, tripInfo) => {
  info.imageURL = results.photos[0].getUrl();
  info.name = results.name;
  info.address = results.formatted_address;
  info.website = results.website;
  info.mapURL = results.url;
  info.review = results.reviews[0];
  info.distance = tripInfo.distance.text;
  info.duration = tripInfo.duration.text;
  info.open = results.opening_hours.open_now;
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
          />
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              { info.name } 
            </Typography>
            <Typography gutterBottom variant="headline" component="h3">
              { info.open ? <b>OPEN NOW</b> : <i>closed</i> }
            </Typography>
            <Typography component="p">
              <b>Address:</b> { info.address }
            </Typography>
            <Typography component="p">
              <b>Distance:</b> { info.distance }
            </Typography>
            <Typography component="p">
              <b>Duration:</b> { info.duration }
            </Typography>
            <Typography component="p">
              <b>Review:</b> { info.review.text }
            </Typography>
            <Typography component="p">
              <b>Author:</b> { info.review.author_name }
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