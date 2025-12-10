import User from "../model/userModel.js"
import jwt from 'jsonwebtoken'

export const authenticateRoute = async (req, res, next) => {
    try{
        const token = req.headers.authorization?.replace('Bearer ', '')
        if(!token)return res.status(400).json({message: 'missing token', status: false})
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decode.id).select('-password')
        if(!user)return res.status(404).json({message: 'User is missing', status: false})
        
        req.userId = user._id
        next()
    }catch(err){
        console.log('error :', err)
        return res.status(501).json({message: 'authentication failed'})
    }
}