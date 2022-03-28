CREATE TABLE "catalog_number"
(
    "id"   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "name" VARCHAR                           NOT NULL UNIQUE
);

CREATE TABLE "professor"
(
    "id"    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "first" VARCHAR,
    "last"  VARCHAR                           NOT NULL
);

CREATE TABLE "section"
(
    "id"   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "name" VARCHAR                           NOT NULL UNIQUE
);

CREATE TABLE "semester"
(
    "id"   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "name" VARCHAR                           NOT NULL UNIQUE
);

CREATE TABLE "subject"
(
    "id"   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "name" VARCHAR                           NOT NULL UNIQUE
);

CREATE TABLE "grades"
(
    "id"              INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "aPlus"           INTEGER                           NOT NULL,
    "a"               INTEGER                           NOT NULL,
    "aMinus"          INTEGER                           NOT NULL,
    "bPlus"           INTEGER                           NOT NULL,
    "b"               INTEGER                           NOT NULL,
    "bMinus"          INTEGER                           NOT NULL,
    "cPlus"           INTEGER                           NOT NULL,
    "c"               INTEGER                           NOT NULL,
    "cMinus"          INTEGER                           NOT NULL,
    "dPlus"           INTEGER                           NOT NULL,
    "d"               INTEGER                           NOT NULL,
    "dMinus"          INTEGER                           NOT NULL,
    "f"               INTEGER                           NOT NULL,
    "cr"              INTEGER                           NOT NULL,
    "nc"              INTEGER                           NOT NULL,
    "p"               INTEGER                           NOT NULL,
    "w"               INTEGER                           NOT NULL,
    "i"               INTEGER                           NOT NULL,
    "nf"              INTEGER                           NOT NULL,
    "semesterId"      INTEGER                           NOT NULL REFERENCES "semester" ("id"),
    "subjectId"       INTEGER                           NOT NULL REFERENCES "subject" ("id"),
    "catalogNumberId" INTEGER                           NOT NULL REFERENCES "catalog_number" ("id"),
    "sectionId"       INTEGER                           NOT NULL REFERENCES "section" ("id"),
    "instructor1Id"   INTEGER REFERENCES "professor" ("id"),
    "instructor2Id"   INTEGER REFERENCES "professor" ("id"),
    "instructor3Id"   INTEGER REFERENCES "professor" ("id"),
    "instructor4Id"   INTEGER REFERENCES "professor" ("id"),
    "instructor5Id"   INTEGER REFERENCES "professor" ("id"),
    "instructor6Id"   INTEGER REFERENCES "professor" ("id")
);
