import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';


export const SignUpUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, dob, profileImage, collegeName, degreeName, currentSemester, preferredLanguage, pastProjects, purpose, github, linkedin } = req.body;

        // Check if user already exists!!!!!
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: "😬 Whose email or phone are you trying?!" });
        }

        // Securing(Hashing) the password!!!!
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP for email verification
        const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit OTP as string
        const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 mins expiry

        // Create a new user!!!
        const newUser = new User({
            fullName,
            email,
            phone,
            password: hashedPassword,
            dob,
            profileImage,
            collegeName,
            degreeName,
            currentSemester,
            preferredLanguage,
            pastProjects,
            purpose,
            github,
            linkedin,
            otp,
            otpExpiry,
            isVerified: false
        });

        // Save the user to DB!!
        await newUser.save();

        // Send OTP email
        try {
            await sendEmail({
                to: email,
                subject: 'Your CreateIt Verification Code 🤫\n Verify before 15 minutes',
                text: `Your OTP is ${otp}`
            });
        } catch (emailError) {
            console.error("Email sending error:", emailError);
            // Don't fail signup if email fails, but log it
        }

        // Responding..!
        res.status(201).json({ 
            message: "🎉 Registration successful! Check your email for verification code!",
            email: email // Return email for frontend to use
        });
    } catch (error) {
        console.error("Registration Error:", error);
        if (error.code === 11000) {
            // Duplicate key error
            return res.status(400).json({ message: "😬 Email or phone number already exists!" });
        }
        res.status(500).json({ message: "💥 Server blew up. Try again later." });
    }
};


export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user's existstance!!!!
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "🙈 “We looked everywhere... but couldn’t find that email!”"
            });
        }

        // Comparing password!!!
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "🧟 “Wrong password. Even your shadow knew it wasn’t right.”"
            });
        }

        // 3. JWT TOKEN
        const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "🛸 “Login successful! Beam us up, dev!”",
            token,
            user: {
                fullName: user.fullName,
                email: user.email,
                _id: user._id
            }
        });
        // Pending: Tokens
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "😵 “Our server is doing cartwheels right now...”" });
    }
};

// Add to AuthController.js
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please sign up first." });
        }

        // Generate new OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit OTP as string
        const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 mins expiry

        // Update user with new OTP
        await User.findOneAndUpdate(
            { email },
            { otp, otpExpiry }
        );

        // Send OTP email
        try {
            await sendEmail({
                to: email,
                subject: 'Your CreateIt Verification Code 🤫\n Verify before 15 minutes',
                text: `Your OTP is ${otp}`
            });
        } catch (emailError) {
            console.error("Email sending error:", emailError);
            return res.status(500).json({ message: "Failed to send OTP email. Please try again." });
        }

        res.status(200).json({ message: "OTP sent to email successfully" });
    } catch (error) {
        console.error("Send OTP Error:", error);
        res.status(500).json({ message: "Failed to send OTP. Please try again." });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        // Normalize OTP to string for comparison
        const otpString = String(otp).trim();

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found. Please sign up first." });
        }

        // Check if OTP matches (both stored as strings in DB)
        const userOtp = String(user.otp || '').trim();
        if (userOtp !== otpString) {
            return res.status(400).json({ message: "Invalid OTP. Please check and try again." });
        }

        // Check if OTP is expired
        if (!user.otpExpiry || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        // Verify user and clear OTP
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // ✅ Generate JWT token
        const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "Email verified successfully! 🎉",
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ message: "Failed to verify OTP. Please try again." });
    }
};

export const googleAuth = async (req, res) => {
    let user = await User.findOne({ email: req.user.email });

    if (!user) {
        // Create new user for Google auth
        user = await User.create({
            email: req.user.email,
            fullName: req.user.displayName,
            profileImage: req.user.photos[0].value,
            isGoogleAuth: true,
            isVerified: true // Google users auto-verified
        });
    }

    const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
}