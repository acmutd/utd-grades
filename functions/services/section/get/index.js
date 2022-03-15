module.exports = async (id, sequelize) => {
  const models = sequelize.models;
  const Section = models.section;

  const section = await Section.findOne({
    where: {
      id,
    },
    include: [
      {
        model: models.professor,
      },
      {
        model: models.course,
        include: [{ model: models.semester }],
      },
    ],
  });

  return section;
};
