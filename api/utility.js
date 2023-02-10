function requireUser(req, res, next){
    if(!req.user){
        res.send(401)
        next({
            name: "missing user error",
            message: "You must be logged in to perform this action"
        }
        )
}
    next()
}

module.exports = {requireUser}