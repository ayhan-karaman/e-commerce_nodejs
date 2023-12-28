exports.get404Page = (req, res, next) => {
    res.status(404).render('errors/404', {
        title:'404 Error Page'
    })
}

exports.get500Page = (req, res, next) => {
    res.status(500).render('errors/500', {
        title:'500 Error Page'
    })
}