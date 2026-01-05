module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,

    bio: DataTypes.TEXT,
    avatar_url: DataTypes.TEXT,
    display_name: DataTypes.STRING,
    theme: {
      type: DataTypes.STRING,
      defaultValue: 'light'
    },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'UTC'
    },
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = models => {
    User.hasMany(models.Activity, {
      foreignKey: 'user_id'
    });
  };

  return User;
};
