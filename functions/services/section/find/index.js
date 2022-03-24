const _ = require('lodash');
const utils = require('./utils');
const { Section, Grades } = require("utd-grades-models");
const { getRepository } = require("typeorm");
const { abbreviateSemesterName } = require('./utils');

module.exports = async (queryParams) => {

  queryParams = utils.parseSearchStringIfExists(queryParams);

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

  let query = getRepository(Grades).createQueryBuilder("grades");

  let sectionCondition = "";
  let sectionConditionParams = {};

  if (!_.isNil(sectionNumber)) {
    sectionCondition = "section.name = :sectionName";
    sectionConditionParams.sectionName = sectionNumber.toUpperCase();
  }

  query = query.innerJoinAndSelect("grades.section", "section", sectionCondition, sectionConditionParams);

  let professorCondition = "";
  let professorConditionParams = {};

  // TODO: better name matching
  if (!_.isNil(firstName)) {
    professorCondition += "professor.first ILIKE :firstName";
    professorConditionParams.firstName = `%${firstName.trim()}%`;
  }

  if (!_.isNil(lastName)) {
    if (professorCondition) {
      professorCondition += " AND ";
    }
    professorCondition += "professor.last ILIKE :lastName";
    professorConditionParams.lastName = `%${lastName.trim()}%`;
  }

  // TODO: other instructors ignored
  query = query.innerJoinAndSelect("grades.instructor1", "professor", professorCondition, professorConditionParams);

  let catalogNumberCondition = "";
  let catalogNumberConditionParams = {};

  if (!_.isNil(courseNumber)) {
    catalogNumberCondition += "catalogNumber.name = :courseNumber";
    catalogNumberConditionParams.courseNumber = courseNumber.trim();
  }

  query = query.innerJoinAndSelect("grades.catalogNumber", "catalogNumber", catalogNumberCondition, catalogNumberConditionParams);

  let subjectCondition = "";
  let subjectConditionParams = {};

  if (!_.isNil(coursePrefix)) {
    subjectCondition += "subject.name = :coursePrefix";
    subjectConditionParams.coursePrefix = coursePrefix.toUpperCase().trim();
  }

  query = query.innerJoinAndSelect("grades.subject", "subject", subjectCondition, subjectConditionParams);

  let semesterCondition = "";
  let semesterConditionParams = {};

  if (!_.isNil(year)) {
    semesterCondition += "semester.name ILIKE :semesterYear";
    semesterConditionParams.semesterYear = `%${year.trim()[2] + year.trim()[3]}%`; // TODO: bad
  }

  if (!_.isNil(type)) {
    if (semesterCondition) {
      semesterCondition += " AND ";
    }
    semesterCondition += "semester.name ILIKE :semesterType";
    semesterConditionParams.semesterType = `%${abbreviateSemesterName(type)}%`;
  }

  query = query.innerJoinAndSelect("grades.semester", "semester", semesterCondition, semesterConditionParams);

  return await query
    // TODO: ordering
    // .addOrderBy("semester.year", "DESC")
    // .addOrderBy("section.number", "ASC")
    .getMany();
};
