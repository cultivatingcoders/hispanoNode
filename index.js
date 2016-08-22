const express = require('express');

const exphbs = require('express-handlebars');

var bodyParser = require('body-parser');
const app = express();

app.use(express.static('lib'));
app.use(bodyParser.urlencoded({extended: true}));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
  res.render('home');
});

app.post('/', function(req, res){
  console.log(req.body.username);
});

const port = 3000;
app.listen(port, function(){
  console.log("Example app listening on port " + port + "!");
});
