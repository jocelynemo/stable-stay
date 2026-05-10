import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import configRoutes from './routes/index.js';

const app = express();

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
