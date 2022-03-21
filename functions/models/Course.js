const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "course",
  columns: {
    id: {
      primary: true,
      type: "integer",
      generated: true
    },
    description: {
      type: "text",
      nullable: true,
    },
    number: {
      type: "text",
      nullable: false,
    },
    prefix: {
      type: "text",
      nullable: false,
    },
  },
  relations: {
    sections: {
      type: "one-to-many",
      target: "section",
      inverseSide: "course"
    },
    semester: {
      type: "many-to-one",
      target: "semester",
      inverseSide: "courses",
    },
  },
});