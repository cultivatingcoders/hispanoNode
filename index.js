// Adds express to our project
const express = require('express');
// Adds express handlebars to our project
const exphbs = require('express-handlebars');
// Adds sequelize to the project
const Sequelize = require('sequelize');
// Adds body-parser so we can read form data
const bodyParser = require('body-parser');
// Adds bcrypt so we can hash passwords
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const passportLocal = require('passport-local');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// This is the actual part that activates express
const app = express();

// Define folder for public assets
app.use(express.static('lib'));

// Set the view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//This is how we parse html forms
app.use(bodyParser.urlencoded({ extended: true }));

// Setup database
var sequelize = new Sequelize('testdb', 'root', 'root');


// Model for keeping track of user accounts.
const User = sequelize.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING
});

sequelize.sync();

// Initialize passport and take care of cookie stuff
app.use(cookieParser());
app.use(session({secret: "secret-key"}));
app.use(passport.initialize());
app.use(passport.session());

// This is the strategy that we use to authenticate users
passport.use(new passportLocal(

  function(uname, password, done) {

    User.findOne({
      where: {
        username: uname
      }
    }).then(function(user) {

      // Check to see if we actually got a user back from our database
      if (!user) {
        return done(null, false, {message: "User could not be found"});
      }

      // If we do get a user back, we want to check to see if passwords match
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, {message: "Password is incorrect"});
      }

      // User is authenticated, return user object
      return done(null, user);
    });
  }

));

// Tell passport how to give users session cookies
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Turns session cookies back into users
passport.deserializeUser(function(userID, done) {
  User.findOne({
    where: {
      id: userID
    }
  }).then(function(user) {
    done(null, user);
  });
});

// This function renders our home page
app.get('/', function(req, res){
  res.render('home');
});

// This function renders our about page




// This function handles requests to the signup page
app.get('/', function(req, res) {
  res.render('home', {title: "Create an Account"});
});

app.post('/', function(req, res) {

  const hash = bcrypt.hashSync(req.body.password);

  User.create({
    username: req.body.username,
    password: hash,
    email: req.body.email
  }).then(function() {
    res.render('account_created');
  });

});

const port = 3000;
app.listen(port, function () {
  console.log("Example app listening on port " + port + "!");
});
