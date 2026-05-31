import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try{
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({
                message: 'Unauthenticated user',
                success: false
            })
        }
        const decode = jwt.verify(token, process.env.SECRET);
        if(!decode){
            return res.status(401).json({
                message: 'Unauthenticated user',
                success: false
            })
        }
        req.id = decode.userId;
        next();
    }catch(err){
        console.error(err)
        return res.status(401).json({
            message: 'Unauthenticated user',
            success: false
        })
    }
}

export default isAuthenticated;