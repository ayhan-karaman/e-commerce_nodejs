module.exports = (req, res, next)=> {
    
     if(!req.session.isAuthenticated)
    {
        req.session.redirectTo = req.originalUrl;
        return res.redirect('/account/login');
    }
     next();
}

