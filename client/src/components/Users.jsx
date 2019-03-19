import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
  },
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    overflow: 'hidden'
  },
});

var renderUsers = false;
var userList = [];

const toggleUsers = (position = !renderUsers) => {
  renderUsers = position;
  if (position) {
    fetchUsers();
  } else {
    userList = [];
  }
};

const fetchUsers = () => {
  fetch('/users')
  .then(res => res.json())
  .then(users => {
    console.log(users);
    userList = users;
  })
  .catch(err => console.error(err))  
};
fetchUsers();

function UsersPanel(props) {
  const { classes } = props;
  return (
    <div>
      <Fab color="primary" aria-label="Add" className={classes.fab} onClick={props.toggleUsersPanel}>
        <AddIcon />
      </Fab>
      <List className={classes.root + ' Users' }>
        { 
          userList.map(user => (
            <ListItem 
              data-name={ user.name }
              data-icon={ user.icon }
              data-x={ user.location.coordinates[0] }
              data-y={ user.location.coordinates[1] }
              button 
              key={ user._id } 
              onClick={props.handleUserChange}
            >
              <img src={ `/images/${user.icon}.png` } />
              <ListItemText 
                primary={ user.name } 
                secondary={ `@${user.location.coordinates[0]},${user.location.coordinates[1]}` } 
              />            
            <li>
              <Divider variant="inset" />
            </li>
            </ListItem>
          ))
        }
      </List>
    </div>
  );
}

const Users = withStyles(styles)(UsersPanel);

export { Users, toggleUsers };