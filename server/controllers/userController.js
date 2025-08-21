import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


//Register User : /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password,  contactNumber, country } = req.body;

        if (!name || !email || !password || !contactNumber || !country) {
            return res.json({ success: false, message: 'Missing Details' })
        }
        const existingUser = await User.findOne({ email })

        if (existingUser)
            return res.json({ success: false, message: 'User already exists.' })

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, password: hashedPassword, contactNumber, country })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,    //prevent javascript to access cookie
            secure: process.env.NODE_ENV === 'production',  //Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',    //CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000  // Cookie expiration time
        })

        return res.json({ success: true, user: { email: user.email, name: user.name, contactNumber: user.contactNumber, country: user.country } })

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }

}

//Login user : /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.json({ success: false, message: 'Email and password are required' });

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch)

            return res.json({ success: false, message: 'Invalid password' });


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,    //prevent javascript to access cookie
            secure: process.env.NODE_ENV === 'production',  //Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',    //CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000  // Cookie expiration time
        })

        return res.json({ success: true, user: { email: user.email, name: user.name, contactNumber: user.contactNumber, country: user.country } })

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }

}

//Check Auth : /api/user/is-auth

export const isAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.json({ success: true, user });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

//Get User Profile : /api/user/profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        return res.json({ 
            success: true, 
            user: {
                name: user.name,
                email: user.email,
                contactNumber: user.contactNumber || '',
                country: user.country || ''
            }
        });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};


//Update User Profile : /api/user/profile
export const updateUserProfile = async (req, res) => {
    try {
        const { name, contactNumber, country } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!name || name.trim() === '') {
            return res.json({ success: false, message: 'Name is required' });
        }

        // Find and update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name: name.trim(),
                contactNumber: contactNumber || '',
                country: country || ''
            },
            { 
                new: true, // Return updated document
                runValidators: true // Run schema validations
            }
        ).select("-password");

        if (!updatedUser) {
            return res.json({ success: false, message: 'User not found' });
        }

        return res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                contactNumber: updatedUser.contactNumber || '',
                country: updatedUser.country || ''
            }
        });

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

//Logout user : /api/user/logout

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  //Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',    //CSRF protection

        });
        return res.json({ success: true, message: 'Logged out' });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });

    }
}