import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';


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
            linkedin
        });

        // Save the user to DB!!
        await newUser.save();

        // Responding..!
        res.status(201).json({ message: "🎉 Registration successful! You’re in the CreateIt now!" });
        // Pending: Tokens
    } catch (error) {
        console.error("Registration Error:", error);
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

        // 3. Return success msg!!
        res.status(200).json({
            message: "🛸 “Login successful! Beam us up, dev!”",
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
