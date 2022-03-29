CREATE TABLE strings
(
    id     INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    string VARCHAR                           NOT NULL
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
