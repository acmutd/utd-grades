const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "professor",
  columns: {
    id: {
      primary: true,
      type: "integer",
      generated: true
    },
    firstName: {
      type: "text",
      nullable: false,
    },
    lastName: {
      type: "text",
      nullable: false,
    },
  },
  relations: {
    sections: {
      type: "one-to-many",
      target: "section",
      inverseSide: "professor",
    },
  },
});