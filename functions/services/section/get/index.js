const Section = require("../../../models/Section");

module.exports = async (id, con) => {
  return await con.getRepository(Section).createQueryBuilder("section")
    .where({ id })
    .innerJoinAndSelect("section.professor", "professor")
    .innerJoinAndSelect("section.course", "course")
    .innerJoinAndSelect("course.semester", "semester")
    .getOne();
};
