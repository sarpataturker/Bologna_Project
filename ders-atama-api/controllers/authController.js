const User = require('../models/User');

exports.login = async (req, res) => {
    const { tc, password } = req.body;
    try {
        const user = await User.findOne({ tc });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ userType: user.userType });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
