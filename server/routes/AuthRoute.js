import passport from "passport"
import express from "express"
import { LoginUser, SignUpUser } from "../controllers/AuthController.js"
import { requireAuth, validateLogin, validateRegister } from "../middleware/AuthMiddleware.js"
import "../config/passport.js"

const router = express.Router()

router.post('/signup', validateRegister, SignUpUser)
router.post('/login', validateLogin, LoginUser)

// Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
});


export default router