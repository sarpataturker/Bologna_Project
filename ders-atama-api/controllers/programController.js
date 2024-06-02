const Program = require('../models/Program');

exports.getProgram = async (req, res) => {
    try {
        const program = await Program.find();
        res.json(program);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
