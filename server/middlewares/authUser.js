import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({success:false, message: 'Not Authorized'});
    }

    try{
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecoded.id){
            req.user = tokenDecoded;
            next();
        }else{
            return res.status(401).json({ success: false, message: 'Not Authorized'});
        }
        
    } catch (error) {
        res.json({ success: false, message: error.message});
    }
}

export default authUser;