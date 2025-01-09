const express = require('express');
const router = express.Router();
const { signUp, signIn, logout, getAllUsers } = require('../controller/authController');
const { allocateUsers , updateUserAstrologer } = require('../controller/userController');
const {
    getAllAstrologers,
    updateAstrologerFlow,
    createAstrologer,
    deleteAstrologer,
    updateAstrologerFlow2
} = require('../controller/astrologerController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/logout', logout);


router.get('/all/users', getAllUsers);
router.put('/allocate',updateUserAstrologer)
router.post("/allocate", allocateUsers);

// Routes for astrologers
router.get("/astrologers", getAllAstrologers);
router.post("/astrologers/create", createAstrologer);
router.post("/astrologers/update-flow", updateAstrologerFlow);
router.delete("/astrologers/:id", deleteAstrologer);
router.post("/astrologers/update-flow2", updateAstrologerFlow2);

module.exports = router;
