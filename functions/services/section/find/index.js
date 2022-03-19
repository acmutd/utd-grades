const _ = require('lodash');
const Sequelize = require("sequelize");
const utils = require('./utils');

const Op = Sequelize.Op;

module.exports = async (queryParams, sequelize) => {

  console.log(queryParams);


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

  const models = sequelize.models;
  const Section = models.section;

  function sectionWhere() {
    let where = {};

    if (!_.isNil(sectionNumber)) {
      where.number = sectionNumber.trim();

      if (typeof where.number === 'string') {
        where.number = where.number.toUpperCase();

        if (where.number.length < 3) {
          where.number = where.number.padStart(3, '0');
        }
      }
    }

    return where;
  }

  function professorWhere() {
    let where = {};

    if (!_.isNil(firstName)) {
      const firstName = firstName.trim();

      where.firstName = {
        [Op.iLike]: `%${firstName}%`,
      };
    }

    if (!_.isNil(lastName)) {
      const lastName = lastName.trim();

      where.lastName = {
        [Op.iLike]: `%${lastName}%`,
      };
    }

    return where;
  }

  function courseWhere() {
    let where = {};

    if (!_.isNil(courseNumber)) {
      where.number = courseNumber.trim();
    }

    if (!_.isNil(coursePrefix)) {
      where.prefix = coursePrefix.toUpperCase().trim();
    }

    return where;
  }

  function semesterWhere() {
    let where = {};

    if (!_.isNil(year)) {
      where.year = year.trim();
    }

    if (!_.isNil(type)) {
      where.type = type.toLowerCase().trim();
    }

    return where;
  }

  const sectionOrder = () => {
    // const { sortField = 'number', sortDirection = 'ASC' } = queryParams;
    let order = [];

    if (sortField === 'year' || sortField === 'type') {
      order.push([
        models.course,
        models.semester,
        sortField,
        sortDirection,
      ]);
    } else if (sortField === 'firstName' || sortField === 'lastName') {
      order.push([models.professor, sortField, sortDirection]);
    } else if (
      sortField === 'coursePrefix' ||
      sortField === 'courseNumber'
    ) {
      order.push([models.course, sortField, sortDirection]);
    }

    const sectionNumber = sequelize.cast(
      sequelize.fn('coalesce',
        sequelize.fn(
          'nullif',
          sequelize.fn(
            'REGEXP_REPLACE',
            sequelize.col('section.number'),
            '[^0-9]*',
            '',
            'g'
          ),
          ''
        ),
        '0'
      ),
      'integer'
    );

    if (sortField === 'number') {
      order.push([sectionNumber, sortDirection]);
    } else {
      order.push([sectionNumber, 'ASC']);
    }

    return order;
  };

  const sections = await Section.findAll({
    where: sectionWhere(),
    order: sectionOrder(),
    include: [
      {
        model: models.professor,
        where: professorWhere(),
      },
      {
        model: models.course,
        where: courseWhere(),
        include: [
          {
            model: models.semester,
            where: semesterWhere(),
          },
        ],
      },
    ],
  });

  return sections;
};
