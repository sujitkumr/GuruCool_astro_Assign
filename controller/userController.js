const User = require("../models/User");
const flowService = require("../services/flowDistributionService");
const Astrologer = require("../models/Astrologer");


exports.allocateUsers = async (req, res, next) => {
  try {
    const { astrologerIds ,userIds } = req.body;

    if (!astrologerIds || astrologerIds.length === 0) {
      return res.status(400).json({ success: false, message: "Astrologer IDs are required" });
    }

    // Fetch astrologer details for allocation
    const astrologers = await Astrologer.find({ _id: { $in: astrologerIds } });

    if (astrologers.length === 0) {
      return res.status(404).json({ success: false, message: "No astrologers found with the provided IDs" });
    }

    // Find unassigned users
    const users = await User.find({ _id: { $in: userIds }, astrologerId: null });


    if (users.length === 0) {
      return res.status(200).json({ success: true, message: "No users available for allocation", data: [] });
    }

    // Perform allocation
    const assignments = await flowService.allocateUsersToAstrologers(users, astrologers);

    if (assignments.length === 0) {
      return res.status(200).json({ success: true, message: "Allocation completed but no assignments were made", data: [] });
    }

    res.status(200).json({ success: true, message: "Allocation successful", data: assignments });
  } catch (error) {
    console.error("Error in allocateUsers:", error);
    next(error);
  }
};

exports.updateUserAstrologer = async (req, res, next) => {
  const { userId, newAstrologerId } = req.body; // `newAstrologerId` can be null to unassign

  // Validate input
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required." });
  }

  try {
    // Fetch the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // If a new astrologer ID is provided and different from the current one, update it
    if (newAstrologerId !== undefined && newAstrologerId !== null) {
      const astrologer = await Astrologer.findById(newAstrologerId);

      if (!astrologer) {
        return res.status(404).json({ success: false, message: "Astrologer not found." });
      }

      // Assign the new astrologer to the user
      user.astrologerId = newAstrologerId;
    } else {
      // Unassign astrologer (set astrologerId to null)
      user.astrologerId = null;
    }

    // Save the updated user
    await user.save();
    return res.status(200).json({ success: true, data: user });

  } catch (error) {
    console.error("Error in updateUserAstrologer:", error);
    next(error);
  }
};
