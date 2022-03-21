const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "section",
  columns: {
    id: {
      primary: true,
      type: "integer",
      generated: true
    },
    number: {
      type: "text",
      nullable: false,
    },
    grades: {
      type: "jsonb",
      nullable: false,
    },
  },
  relations: {
    course: {
      type: "many-to-one",
      target: "course",
      inverseSide: "sections",
    },
    professor: {
      type: "many-to-one",
      target: "professor",
      inverseSide: "sections",
    },
  },
});