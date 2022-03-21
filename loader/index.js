require('dotenv').config();

const fs = require('fs');
const ProgressBar = require('progress');
const glob = require("glob-promise");

const doDbOp = require('../functions/models');
const Course = require('../functions/models/Course');
const Professor = require('../functions/models/Professor');
const Section = require('../functions/models/Section');
const Semester = require('../functions/models/Semester');


async function run() {
  const dataFiles = await glob("../data/**/*.json");

  for (const file of dataFiles) {
    try {
      let content = JSON.parse(fs.readFileSync(file, 'utf8'));
      const bar = new ProgressBar(`${file} :bar :current | :total`, { total: content.length });

      for (let i = 0; i < content.length; i++) {
        try {
          await saveItem(content[i], i);
        } catch (e) {
          console.log("Failed to save item, skipping.", e);
        }

        bar.tick();
      }
    } catch (e) {
      console.log("Completely failed file, skipping.", e);
    }
  }
}

async function findOrCreate(entity, where) {
  const found = await doDbOp(async (con) => {
    return con.getRepository(entity).find({ where });
  });

  if (found.length == 0) {
    return await doDbOp(async (con) => {
      return await con.getRepository(entity).save(where);
    });
  } else {
    return found[0];
  }
}

async function saveItem(item, i) {
  // Find or create semester
  const term = item.term.split(' ');
  const term_year = parseInt(term[0]);
  const term_term = term[1].toLowerCase();

  const semester = await findOrCreate(Semester, {
    year: term[0],
    type: term_term
  });

  // Find or create professor
  const prof = item.prof.split(', ');
  const lastName = prof[0];
  const firstName = prof[1];

  const professor = await findOrCreate(Professor, {
    firstName,
    lastName,
  });

  // Find or create course
  const course = await findOrCreate(Course, {
    number: item.num,
    prefix: item.subj,
    semester: {
      id: semester.id,
    },
  });

  // Finally, we can add the section
  await findOrCreate(Section, {
    number: item.sect,
    grades: item.grades,
    course: {
      id: course.id,
    },
    professor: {
      id: professor.id,
    },
  });
}

run()
