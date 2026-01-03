const { User, Activity } = require("../models");
const Joi = require("joi");

const schema = Joi.object({
  bio: Joi.string().allow(""),
  avatar_url: Joi.string().uri().allow(""),
  display_name: Joi.string().min(3).max(30),
  theme: Joi.string().valid("light", "dark"),
  timezone: Joi.string(),
});

exports.getUserProfile = async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ["id", "username", "bio", "avatar_url", "theme", "timezone"],
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

exports.updateMyProfile = async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const user = await User.findByPk(req.user.id);

  await user.update(req.body);

  await Activity.create({
    user_id: user.id,
    action_type: "profile_updated",
  });

  res.json(user);
};

exports.getMyActivity = async (req, res) => {
  const activities = await Activity.findAll({
    where: { user_id: req.user.id },
    order: [["createdAt", "DESC"]],
  });

  res.json(activities);
};

exports.updatePreferences = async (req, res) => {
  const user = await User.findByPk(req.user.id);

  user.preferences = {
    ...user.preferences,
    ...req.body,
  };

  await user.save();

  await Activity.create({
    user_id: user.id,
    action_type: "preferences_updated",
  });

  res.json(user.preferences);
};
