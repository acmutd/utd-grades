const { Grades } = require("utd-grades-models");

module.exports = async (id, con) => {
  return await con.getRepository(Grades).createQueryBuilder("grades")
    .where({ id })
    .innerJoinAndSelect("grades.section", "section")
    .innerJoinAndSelect("grades.instructor1", "professor")
    .innerJoinAndSelect("grades.catalogNumber", "catalogNumber")
    .innerJoinAndSelect("grades.subject", "subject")
    .innerJoinAndSelect("grades.semester", "semester")
    .getOne();
}
