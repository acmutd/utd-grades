const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "semester",
  columns: {
    id: {
      primary: true,
      type: "integer",
      generated: true
    },
    year: {
      type: "integer",
      nullable: false,
    },
    type: {
      type: "enum",
      enum: ["fall", "spring", "summer"],
      nullable: false,
    },
  },
  relations: {
    courses: {
      type: "one-to-many",
      target: "course",
      inverseSide: "semester",
    },
  },
});
