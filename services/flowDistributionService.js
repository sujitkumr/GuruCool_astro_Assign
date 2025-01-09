const mongoose = require("mongoose");
const Astrologer = require("../models/Astrologer");
const User = require("../models/User");

exports.updateAstrologerFlow2 = async (req, res, next) => {
  try {
    const { astrologerId, isTopAstrologer, boostFactor } = req.body;
    const astrologer = await flowService.toggleTopAstrologer(astrologerId, isTopAstrologer, boostFactor);
    
    res.status(200).json({ success: true, data: astrologer });
  } catch (error) {
    next(error);
  }
};

exports.toggleTopAstrologer = async (astrologerId, isTopAstrologer, boostFactor = 1) => {
  if (boostFactor <= 0) throw new Error("Boost factor must be a positive number.");

  const updatedAstrologer = await Astrologer.findByIdAndUpdate(
    astrologerId,
    { isTopAstrologer, flowBoostFactor: boostFactor },
    { new: true } // Ensure that the updated document is returned
  );

  // Log the updated astrologer
  console.log("Updated Astrologer:", updatedAstrologer);

  if (!updatedAstrologer) {
    throw new Error("Astrologer not found or update failed.");
  }

  return updatedAstrologer;
};

exports.allocateUsersToAstrologers = async (users, astrologers) => {
  if (astrologers.length === 0) throw new Error("No astrologers available for allocation.");

  const userAssignments = [];
  let astrologerIndex = 0;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const user of users) {
      const astrologer = astrologers[astrologerIndex];

      if (astrologer.currentConnections < astrologer.connectionCapacity * astrologer.flowBoostFactor) {
        userAssignments.push({ user: user._id, astrologer: astrologer._id });

        // Increment the astrologer's connection count
        astrologer.currentConnections++;
      } else {
        // Move to the next astrologer
        astrologerIndex = (astrologerIndex + 1) % astrologers.length;
      }
    }

    // Bulk update astrologers and users
    const bulkAstrologerUpdates = astrologers.map((astrologer) => ({
      updateOne: {
        filter: { _id: astrologer._id },
        update: { currentConnections: astrologer.currentConnections },
      },
    }));
    await Astrologer.bulkWrite(bulkAstrologerUpdates, { session });

    const bulkUserUpdates = userAssignments.map((assignment) => ({
      updateOne: {
        filter: { _id: assignment.user },
        update: { astrologerId: assignment.astrologer },
      },
    }));
    await User.bulkWrite(bulkUserUpdates, { session });

    await session.commitTransaction();
    session.endSession();

    return userAssignments;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


