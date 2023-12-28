const express = require('express');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const  path  = require('path');
const app = express()
const User = require('./models/user');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const MongodbStore = require('connect-mongodb-session')(session)
const csurf = require('csurf');
const multer = require('multer');

const connectionString = "mongodb://localhost:27017/node-app"

var store = new MongodbStore({
    uri:connectionString,
    collection:'mySessions'
})
const storage = multer.diskStorage({
  destination:function (req, file, cb) {
      cb(null, './public/img/')
  },
  filename:function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}` )
  }
})
app.set('view engine', 'pug')
app.set('views', './views')

app.use(bodyParser.urlencoded({extended:false}))

app.use(multer({storage:storage}).single('img'))

app.use(cookieParser())
app.use(session({
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:false,
  cookie:{maxAge:36000000},
  store:store
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) =>{
  if(!req.session.user)
  {
    return next();
  }
 

  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err))
})

app.use(csurf())

app.use('/', routes)
app.use((err, req, res, next) => {
   res.status(500).render('errors/500')
})


mongoose.connect(connectionString)
.then(()=>{
  console.log('Connected to mongodb');
  
    app.listen(3000, ()=> console.log("Listening app port 3000"));
})
.catch(err => {
    console.log(err)
});      



