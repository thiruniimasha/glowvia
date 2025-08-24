import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
            req.user = null;
            return next();
        }

        req.user = decoded;
        next();
    } catch (error) {
         console.error('Auth middleware error:', error);
        req.user = null;
        next();
    }
};

export default authUser;