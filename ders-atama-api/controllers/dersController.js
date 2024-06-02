const Ders = require('../models/Ders');

exports.assignDers = async (req, res) => {
    const { dersId, hocaId } = req.body;
    try {
        const ders = await Ders.findById(dersId);
        if (ders.hocaId) {
            return res.status(400).json({ message: 'Ders already assigned' });
        }
        ders.hocaId = hocaId;
        await ders.save();
        res.json(ders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
