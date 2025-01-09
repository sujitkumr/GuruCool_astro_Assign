const Astrologer = require('../models/Astrologer');
const flowService = require('../services/flowDistributionService');

// Fetch all astrologers
exports.getAllAstrologers = async (req, res, next) => {
  try {
    const astrologers = await Astrologer.find();
    res.status(200).json({ success: true, data: astrologers });
  } catch (error) {
    next(error);
  }
};

// Create a new astrologer
exports.createAstrologer = async (req, res, next) => {
  try {
    const astrologer = await Astrologer.create(req.body);
    res.status(201).json({ success: true, data: astrologer });
  } catch (error) {
    next(error);
  }
};

// Update astrologer flow
exports.updateAstrologerFlow = async (req, res, next) => {
  try {
    const { astrologerId, isTopAstrologer, boostFactor } = req.body;
    const astrologer = await Astrologer.findByIdAndUpdate(
      astrologerId,
      { isTopAstrologer, flowBoostFactor: boostFactor },
      { new: true }
    );
    res.status(200).json({ success: true, data: astrologer });
  } catch (error) {
    next(error);
  }
};

// Delete an astrologer
exports.deleteAstrologer = async (req, res, next) => {
  try {
    const astrologerId = req.params.id;
    await Astrologer.findByIdAndDelete(astrologerId);
    res.status(200).json({ success: true, message: "Astrologer deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Toggle flow for top astrologer
exports.updateAstrologerFlow2 = async (req, res, next) => {
  try {
    const { astrologerId, isTopAstrologer, boostFactor } = req.body;
    const astrologer = await flowService.toggleTopAstrologer(astrologerId, isTopAstrologer, boostFactor);
    res.status(200).json({ success: true, data: astrologer });
  } catch (error) {
    next(error);
  }
};
