const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/profile.controller");
const auth = require("../middlewares/auth");

router.get("/users/:id/profile", auth, ctrl.getUserProfile);
router.put("/users/me/profile", auth, ctrl.updateMyProfile);
router.get("/users/me/activity", auth, ctrl.getMyActivity);
router.patch("/users/me/preferences", auth, ctrl.updatePreferences);

module.exports = router;
