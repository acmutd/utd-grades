CREATE TABLE strings
(
    id     INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    string VARCHAR                           NOT NULL
);

CREATE TABLE instructors
(
    id     INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    rmp_id   VARCHAR,
    name TEXT                           NOT NULL, 
    url  TEXT,
    instructor_id TEXT NOT NULL,
    quality_rating FLOAT,
    difficulty_rating FLOAT,
    would_take_again FLOAT,
    ratings_count INTEGER,
    tags TEXT,
    overall_grade_rating FLOAT,
    total_grade_count INTEGER
);


CREATE TABLE course_ratings 
(
    id     INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    instructor_id TEXT REFERENCES instructors(instructor_id),
    instructor_name TEXT,
    course_code VARCHAR,
    rating TEXT
);



CREATE TABLE grades
(
    id              INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    aPlus           INTEGER                           NOT NULL,
    a               INTEGER                           NOT NULL,
    aMinus          INTEGER                           NOT NULL,
    bPlus           INTEGER                           NOT NULL,
    b               INTEGER                           NOT NULL,
    bMinus          INTEGER                           NOT NULL,
    cPlus           INTEGER                           NOT NULL,
    c               INTEGER                           NOT NULL,
    cMinus          INTEGER                           NOT NULL,
    dPlus           INTEGER                           NOT NULL,
    d               INTEGER                           NOT NULL,
    dMinus          INTEGER                           NOT NULL,
    f               INTEGER                           NOT NULL,
    cr              INTEGER                           NOT NULL,
    nc              INTEGER                           NOT NULL,
    p               INTEGER                           NOT NULL,
    w               INTEGER                           NOT NULL,
    i               INTEGER                           NOT NULL,
    nf              INTEGER                           NOT NULL,
    semesterId      INTEGER                           NOT NULL REFERENCES strings (id),
    subjectId       INTEGER                           NOT NULL REFERENCES strings (id),
    catalogNumberId INTEGER                           NOT NULL REFERENCES strings (id),
    sectionId       INTEGER                           NOT NULL REFERENCES strings (id),
    instructor1Id   INTEGER REFERENCES strings (id),
    instructor2Id   INTEGER REFERENCES strings (id),
    instructor3Id   INTEGER REFERENCES strings (id),
    instructor4Id   INTEGER REFERENCES strings (id),
    instructor5Id   INTEGER REFERENCES strings (id),
    instructor6Id   INTEGER REFERENCES strings (id)
);

CREATE VIEW grades_populated AS
SELECT grades.id AS gradesId,
       grades.aPlus,
       grades.a,
       grades.aMinus,
       grades.bPlus,
       grades.b,
       grades.bMinus,
       grades.cPlus,
       grades.c,
       grades.cMinus,
       grades.dPlus,
       grades.d,
       grades.dMinus,
       grades.f,
       grades.cr,
       grades.nc,
       grades.p,
       grades.w,
       grades.i,
       grades.nf,
       semester.string AS semester,
       subject.string AS subject,
       catalogNumber.string AS catalogNumber,
       section.string AS section,
       instructor1.string AS instructor1
FROM grades
         INNER JOIN strings semester ON semester.id = grades.semesterId
         INNER JOIN strings subject ON subject.id = grades.subjectId
         INNER JOIN strings catalogNumber ON catalogNumber.id = grades.catalogNumberId
         INNER JOIN strings section ON section.id = grades.sectionId
         INNER JOIN strings instructor1 ON instructor1.id = grades.instructor1Id;

-- FIXME: grades_strings is no longer an appropriate name, since autocomplete now use autocomplete_strings
CREATE VIEW grades_strings(id,subject,courseSection,semester,instructor1) AS
SELECT gradesId,
       subject,
       catalogNumber || '.' || section,
       semester,
       instructor1
FROM grades_populated;

CREATE VIEW autocomplete_strings(priority,string,subject,courseSection,semester,instructor1) AS
-- CS 1337.001 Fall 2020 Firstname Lastname
SELECT 4,
       subject       || ' ' ||
       catalogNumber || '.' ||
       section       || ' ' ||
       semester      || ' ' ||
       instructor1,
       subject,
       catalogNumber || '.' || section,
       semester,
       instructor1
from grades_populated
UNION
-- CS 1337 Fall 2020 Firstname Lastname
SELECT 3,
       subject       || ' ' ||
       catalogNumber || ' ' ||
       semester      || ' ' ||
       instructor1,
       subject,
       catalogNumber,
       semester,
       instructor1
FROM grades_populated
UNION
-- CS 1337 Firstname Lastname
SELECT 2,
       subject || ' ' ||
       catalogNumber || ' ' ||
       instructor1,
       subject,
       catalogNumber,
       '',
       instructor1
from grades_populated
UNION
-- CS 1337 Fall 2020
SELECT 1,
       subject       || ' ' ||
       catalogNumber || ' ' ||
       semester,
       subject,
       catalogNumber,
       semester,
       ''
FROM grades_populated
UNION
-- CS 1337
SELECT 0,
       subject || ' ' ||
       catalogNumber,
       subject,
       catalogNumber,
       '',
       ''
FROM grades_populated;
