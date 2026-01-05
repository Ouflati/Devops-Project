module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT
  }, {
    tableName: 'activities',
    timestamps: false
  });

  Activity.associate = models => {
    Activity.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };

  return Activity;
};
