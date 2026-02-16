import jwt from "jsonwebtoken"

export const generateToken = (user) => {
    const payload = {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" })
}


// "30d" from 30days
// "1m fro 1month"
// "1y" for 1 year
// "24h" for 24 hours
// "60s" for 60 seconds