exports.getUserProfile = async (req, res) => {
  const userId = req.params.id;

  
  res.json({
    id: userId,
    username: "demo_user",
    bio: "Profile bio",
    avatar_url: null,
    theme: "light",
    timezone: "UTC"
  });
};

exports.updateMyProfile = async (req, res) => {
  res.json({
    message: "Profile updated successfully",
    data: req.body
  });
};

exports.getMyActivity = async (req, res) => {
  res.json([
    {
      action_type: "profile_updated",
      created_at: new Date()
    }
  ]);
};

exports.getMyStats = async (req, res) => {
  res.json({
    tasks_completed: 0,
    events_created: 0,
    polls_voted: 0
  });
};

exports.updatePreferences = async (req, res) => {
  res.json({
    message: "Preferences updated",
    preferences: req.body
  });
};

exports.getUsers = async (req, res) => {
  res.json([
    { id: 1, username: "user1" },
    { id: 2, username: "user2" }
  ]);
};

