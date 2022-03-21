const _ = require('lodash');
const utils = require('./utils');
const Section = require("../../../models/Section");

module.exports = async (queryParams, con) => {

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

  let query = con.getRepository(Section).createQueryBuilder("section");

  if (!_.isNil(sectionNumber)) {
    query = query.andWhere({
      number: sectionNumber.trim().toUpperCase().padStart(3, '0')
    });
  }

  let professorCondition = "";
  let professorConditionParams = {};

  if (!_.isNil(firstName)) {
    professorCondition += "professor.firstName ILIKE :firstName";
    professorConditionParams.firstName = `%${firstName.trim()}%`;
  }

  if (!_.isNil(lastName)) {
    if (professorCondition) {
      professorCondition += " AND ";
    }
    professorCondition += "professor.lastName ILIKE :lastName";
    professorConditionParams.lastName = `%${lastName.trim()}%`;
  }

  query = query.innerJoinAndSelect("section.professor", "professor", professorCondition, professorConditionParams);

  let courseCondition = "";
  let courseConditionParams = {};

  if (!_.isNil(courseNumber)) {
    courseCondition += "course.number = :courseNumber";
    courseConditionParams.courseNumber = courseNumber.trim();
  }

  if (!_.isNil(coursePrefix)) {
    if (courseCondition) {
      courseCondition += " AND ";
    }
    courseCondition += "course.prefix = :coursePrefix";
    courseConditionParams.coursePrefix = coursePrefix.toUpperCase().trim();
  }

  query = query.innerJoinAndSelect("section.course", "course", courseCondition, courseConditionParams);

  let semesterCondition = "";
  let semesterConditionParams = {};

  if (!_.isNil(year)) {
    semesterCondition += "semester.year = :semesterYear";
    semesterConditionParams.semesterYear = year.trim();
  }

  if (!_.isNil(type)) {
    if (semesterCondition) {
      semesterCondition += " AND ";
    }
    semesterCondition += "semester.type = :semesterType";
    semesterConditionParams.semesterType = type.toLowerCase().trim();
  }

  query = query.innerJoinAndSelect("course.semester", "semester", semesterCondition, semesterConditionParams);

  return await query
    .addOrderBy("semester.year", "DESC")
    .addOrderBy("section.number", "ASC")
    .getMany();
};
