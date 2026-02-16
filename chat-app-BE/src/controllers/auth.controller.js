import User from "../models/User.js";
import bcrypt from "bcrypt"
import { generateToken } from "../utils/token.js";

export const registerUser = async (req, res) => {
    const { email, password, name, avatar } = await req.body;

    console.log(req.body)
    try {
        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ success: false, msg: "User already exist" });
            return
        }
        user = new User({
            email, password, name, avatar: avatar || ""
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save()

        const token = generateToken(user);
        res.status(200).json({ success: true, token })
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ success: false, msg: "Server error" })
    }
}
export const loginUser = async (req, res) => {
    const { email, password } = await req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ success: false, msg: "Invalid credentials" })
            return
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).json({ success: false, msg: "Invalid credentials" })
            return
        }
        const token = generateToken(user);
        res.status(200).json({ success: true, token })

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ success: false, msg: "Server error" })
    }
}