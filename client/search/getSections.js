const { abbreviateSemesterName, parseSearchStringIfExists } = require('./utils');
const { Grades } = require("utd-grades-models");

module.exports = async (queryParams, con) => {

  queryParams = parseSearchStringIfExists(queryParams);

  const {
    sectionNumber,
    firstName,
    lastName,
    courseNumber,
    coursePrefix,
    year,
    type,
    sortField = 'number',
    sortDirection = 'ASC'
  } = queryParams;

  let query = con.getRepository(Grades).createQueryBuilder("grades");

  let sectionCondition = "";
  let sectionConditionParams = {};

  if (sectionNumber != null) {
    sectionCondition = "section.name = :sectionName";
    sectionConditionParams.sectionName = sectionNumber.toUpperCase();
  }

  query = query.innerJoinAndSelect("grades.section", "section", sectionCondition, sectionConditionParams);

  let professorCondition = "";
  let professorConditionParams = {};

  // TODO: better name matching
  if (firstName != null) {
    professorCondition += "professor.first LIKE :firstName";
    professorConditionParams.firstName = `%${firstName.trim()}%`;
  }

  if (lastName != null) {
    if (professorCondition) {
      professorCondition += " AND ";
    }
    professorCondition += "professor.last LIKE :lastName";
    professorConditionParams.lastName = `%${lastName.trim()}%`;
  }

  // TODO: other instructors ignored
  query = query.innerJoinAndSelect("grades.instructor1", "professor", professorCondition, professorConditionParams);

  let catalogNumberCondition = "";
  let catalogNumberConditionParams = {};

  if (courseNumber != null) {
    catalogNumberCondition += "catalogNumber.name = :courseNumber";
    catalogNumberConditionParams.courseNumber = courseNumber.trim();
  }

  query = query.innerJoinAndSelect("grades.catalogNumber", "catalogNumber", catalogNumberCondition, catalogNumberConditionParams);

  let subjectCondition = "";
  let subjectConditionParams = {};

  if (coursePrefix != null) {
    subjectCondition += "subject.name = :coursePrefix";
    subjectConditionParams.coursePrefix = coursePrefix.toUpperCase().trim();
  }

  query = query.innerJoinAndSelect("grades.subject", "subject", subjectCondition, subjectConditionParams);

  let semesterCondition = "";
  let semesterConditionParams = {};

  if (year != null) {
    semesterCondition += "semester.name LIKE :semesterYear";
    semesterConditionParams.semesterYear = `%${year.trim()[2] + year.trim()[3]}%`; // TODO: bad
  }

  if (type != null) {
    if (semesterCondition) {
      semesterCondition += " AND ";
    }
    semesterCondition += "semester.name LIKE :semesterType";
    semesterConditionParams.semesterType = `%${abbreviateSemesterName(type)}%`;
  }

  query = query.innerJoinAndSelect("grades.semester", "semester", semesterCondition, semesterConditionParams);

  return await query
    // TODO: ordering
    // .addOrderBy("semester.year", "DESC")
    // .addOrderBy("section.number", "ASC")
    .getMany();
};
