const User = require('../models/user');
const byrcpt = require('bcrypt');
const sendMail = require('../utility/nodeMailer');
const crypto  = require('crypto');
const Login = require('../models/login');
module.exports.getLogin = (req, res, next)=>{
     const errorMessage = req.session.errorMessage;
     delete req.session.errorMessage;
     res.render('account/login', {
        title:'Login',
        path:'/account/login',
        errorMessage:errorMessage
        
     })
}

module.exports.postLogin = (req, res, next)=>{
   
     const email = req.body.email
     const password= req.body.password
     const login = new Login({
          email:email,
          password:password
     });
     login.validate()
          .then(()=>{
               User.findOne({email:email})
               .then(user => {
                     if(!user)
                     {
                         req.session.errorMessage = "E mail Bulunamadı";
                         return req.session.save(function (err) {
                               //console.log(err)
                               return res.redirect('/account/login')
                         })
                         
                     }
                   else
                     byrcpt.compare(password, user.password)
                     .then(isSuccess => {
                          if(isSuccess)
                          {
                               req.session.user = user
                               req.session.isAuthenticated = true;
                               return req.session.save(function(err) {
                                    var url = req.session.redirectTo || '/'
                                    delete req.session.redirectTo 
                                    res.redirect(url)
                               })
                          }
                          req.session.errorMessage = "Lütfen bilgilerinizi kontrol ediniz!";
                         return req.session.save(function (err) {
                               //console.log(err)
                               return res.redirect('/account/login')
                         })
                     })
                     .catch(err => console.log(err))
               })
               .catch(err => console.log(err))
          })
          .catch(err => {
               if(err.name == 'ValidationError')
          {
            let message = "";
            for (field in err.errors) {
                message += err.errors[field].message + '\n<br/>'
            }
                res.render('account/login', {
                    title:'Login',
                    path:'/account/login',
                    errorMessage:message
                    
                 })
           
          }
          else{
             next(err)
          }
          })
  
}

module.exports.getRegister = (req, res, next)=>{
     const errorMessage = req.session.errorMessage;
     delete req.session.errorMessage;
     res.render('account/register', {
          path:'/account/register',
          title:'Register',
          errorMessage:errorMessage
       })
}

module.exports.postRegister = (req, res, next)=>{
     const userName = req.body.userName
     const email = req.body.email
     const password = req.body.password
   
     User.findOne({email:email})
     .then(user => {
          if(user)
          {
               req.session.errorMessage = "Bu email kullanımda!"
               return req.session.save(function (err) {
                    //console.log(err)
                    return res.redirect('/account/register')
               })
               
          }
                return byrcpt.hash(password, 10);
               
     })
     .then(hashPassword => {
          const newUser = new User({userName:userName, email:email, password:hashPassword, cart:{items:[]}})
          
          return newUser.save()
     })

     .then(()=> {
          res.redirect('/account/login')
          sendMail(email, "Üyelik Kaydı", "<h1 style='background:blue; padding:40px'> Üyelik kaydınız başarılı bir şekilde oluşturuldu");
     })
     .catch(err => {
          if(err.name == 'ValidationError')
          {
            let message = "";
            for (field in err.errors) {
                message += err.errors[field].message + '\n<br/>'
            }
            res.render('account/register', {
               path:'/account/register',
               title:'Register',
               errorMessage:message
            })
          }
     })


     
}

module.exports.getResetPassword = (req, res, next)=>{
     const errorMessage = req.session.errorMessage;
     delete req.session.errorMessage;
   
     res.render('account/reset', {
          title:'Reset',
          errorMessage:errorMessage
       })
}

module.exports.postResetPassword = (req, res, next)=>{
     const email = req.body.email;
     
     crypto.randomBytes(32, (err, buffer) => {
          if(err)
          {
               console.log(err);
               return res.redirect('/account/reset-password');
          }
          const token = buffer.toString('hex');
          
    

     User.findOne({email:email})
     .then(user=>{
          if(!user)
          {
               req.session.errorMessage = "Mail adresi bulunamadı";
               req.session.save(function (err) {
                   console.log(err)
                   return res.redirect('/account/reset-password')

               })
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now()+3600000
          return user.save();
     })
      .then(() => {
             res.redirect('/account/login')
             sendMail(email, "Parola Reset", 
             `
             <p>Parolanızı güncelemek için aşağıdaki linke tıklayınız</p>
             <p>
             <a href="http://localhost:3000/account/reset-password/${token}" target="_blank">Password Reset >>> </a>
             </p>
             `
             )
      })
      .catch(err => console.log(err))
     })
}

module.exports.getLogout= (req, res, next) => {
     req.session.destroy(err => {
          console.log(err);
          res.redirect('/')
     })
     
}

module.exports.getNewPassword = (req, res, next) => {
     const errorMessage = req.session.errorMessage;
     delete req.session.errorMessage;
     const token = req.params.token;
     User.findOne({resetToken:token, resetTokenExpiration:{
          $gt:Date.now()
     }})
     .then(user => {
          res.render('account/new-password', {
               title:'New Password',
               path:'/account/new-password',
               errorMessage : errorMessage,
               userId:user._id.toString(),
               passwordToken:token
          })
     })
     .catch(err =>console.log())

}
module.exports.postNewPassword = (req, res, next) => {
          const newPassword = req.body.password
          const token = req.body.passwordToken
          const userId = req.body.userId
          let _user;
          User.findOne({
               resetToken:token, 
               resetTokenExpiration:{
               $gt:Date.now()
               },
               _id:userId
          })
          .then(user => {
                _user=user
               return byrcpt.hash(newPassword, 10)
          })
          .then(hashedPassword => {
                _user.password = hashedPassword;
                _user.resetToken = undefined;
                _user.resetTokenExpiration = undefined;
                return _user.save();
          })
          .then(() => {
               res.redirect('/account/login')
          })
          .catch(err => console.log(err))
}