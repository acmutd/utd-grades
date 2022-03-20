require('dotenv').config();

const fs = require('fs');
const init = require('../functions/models/index');
const ProgressBar = require('progress');
const glob = require("glob-promise");

async function run() {
  try {
    const conn = new init();
    await conn.connect();
    const sequelize = conn.sequelize;

    const dataFiles = await glob("../data/**/*.json");

    for (const file of dataFiles) {
      console.log(file);
      try {
        let content = JSON.parse(fs.readFileSync(file, 'utf8'));

        const models = sequelize.models;

        const bar = new ProgressBar(':bar :current | :total', { total: content.length });

        for (let i = 0; i < content.length; i++) {
          await saveItem(content[i], i, models);

          bar.tick();
        }
      } catch (e) {
        console.log(e);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

async function saveItem(item, i, models) {
  try {
    // Find or create semester
    const term = item.term.split(' ');
    const term_year = parseInt(term[0]);
    const term_term = term[1].toLowerCase();

    const [semester, semester_created] = await models.semester.findOrCreate({
      where: {
        year: term[0],
        type: term_term,
      },
    });

    // Find or create professor
    const prof = item.prof.split(', ');
    const lastName = prof[0];
    const firstName = prof[1];

    const [professor, professor_created] = await models.professor.findOrCreate({
      where: {
        firstName,
        lastName,
      },
    });

    // Find or create course
    const [course, course_created] = await models.course.findOrCreate({
      where: {
        number: item.num,
        prefix: item.subj,
        semesterId: semester.id,
      },
    });

    // Finally, we can add the section
    const [section, section_created] = await models.section.findOrCreate({
      where: {
        number: item.sect,
        grades: item.grades,
        courseId: course.id,
        professorId: professor.id,
      },
    });
  } catch (e) {
    console.log(e);
    console.log(`Could not load: ${i}`);
  }
}

run()
