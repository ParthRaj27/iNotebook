var jwt = require("jsonwebtoken")
const JWT_SECRET = "ParthIsMostHandSomePerson"; 
const fetchuser =  (req,res,next) =>{
    // get the user from thee jwt token and add id to req object
    const token = req.header('auth-token')
    if(!token)
    {
        res.status(401).send({ error : "please auhenticate using a valid token"})
    }
   try {
    const data = jwt.verify(token, JWT_SECRET)
    req.user = data.user
    next()
   } catch (error) {
    res.status(401).send({ error : "please auhenticate using a valid token"})
}
}




module.exports = fetchuser;