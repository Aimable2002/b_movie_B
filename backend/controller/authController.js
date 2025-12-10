import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../model/userModel.js'

export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) 
        return res.status(400).json({ success: false, message: 'Missing data' })
    const user_exist = await User.findOne({ username })
    return !user_exist
      ? res.status(404).json({ success: false, message: 'Incorrect userName' })
      : await bcrypt.compare(password, user_exist.password)
        ? (() => {
            const token = jwt.sign({ id: user_exist._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.status(200).json({ success: true, message: 'Enjoy', token })
          })()
        : res.status(401).json({ success: false, message: 'Incorrect password' })

  } catch (err) {
    console.error('Error on login server:', err)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}



export const signup = async (req, res) => {
  try {
    console.log('req body data :', req.body)
    const { username, password } = req.body

    if (!username || !password){
        return res.status(400).json({ success: false, message: 'Missing data' })
    }
        
    const user_exist = await User.findOne({ username })
    return user_exist
      ? res.status(409).json({ success: false, message: 'Username already taken' })
      : await bcrypt.hash(password, 10)
        .then(hashedPassword => 
          new User({ username, password: hashedPassword }).save()
        )
        .then(newUser => 
          res.status(201).json({ success: true, message: 'User created', userId: newUser._id })
        )
        .catch(err => res.status(500).json({ success: false, message: 'Error creating user', error: err.message }))

  } catch (err) {
    console.error('Error on signup server:', err)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
};



export const verifyRoute = async (req, res) => {
    try{
        const token = req.headers.authorization?.replace('Bearer ', '')
        if(!token)return res.status(400).json({message: 'missing token', status: false})
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decode.id).select('-password')
        if(!user)return res.status(404).json({message: 'User is missing', status: false})
        
        return res.status(200).json({message: 'live', status: true})
    }catch(err){
        console.log('error :', err.message)
        return res.status(500).json({message: 'Internal server error'})
    }
}
