module.exports = {
  parseSearchStringIfExists(queryParams) {
    if (queryParams) {
      const search = queryParams['search'];

      if (search) {
        queryParams = {
          ...queryParams,
          ...this.parseSearchString(search)
        };
      }
    }

    return queryParams;
  },

  parseSearchString(search) {
    const searchString = search.toLowerCase();

    const prefixPattern = /(?<!\w)(?!summer|spring|fall)([a-zA-Z]{2,4})(?=(\s|\d+))/
    const numberPattern = /(?:(?<!fall\s)|(?<!fall)|(?<!spring\s)|(?<!spring)|(?<!summer\s)|(?<!summer))(\d{4})/
    const yearPattern = /(?:(?<=fall\s)|(?<=fall)|(?<=spring\s)|(?<=spring)|(?<=summer\s)|(?<=summer))(\d{4})/
    const semesterPattern = /(fall|spring|summer)(?=\d{4}|\s\d{4})/
    const sectionPattern = /(?:(?<=\d{4})|(?<=\d{4}\s)|(?<=\.))(\d{1,3}|\w{1,3})(?=\s|$)/

    let prefix = searchString.match(prefixPattern);
    let number = searchString.match(numberPattern);
    let year = searchString.match(yearPattern);
    let semester = searchString.match(semesterPattern);
    let section = searchString.match(sectionPattern);

    const params = {};
  
    let professor = searchString;

    if (prefix) {
      prefix = prefix[0];

      professor = professor.replace(prefix, '');
    }

    if (number) {
      number = number[0];

      professor = professor.replace(number, '');
    }

    if (year) {
      year = year[0];

      professor = professor.replace(year, '');
    }
    
    if (semester) {
      semester = semester[0];

      professor = professor.replace(semester, '');
    }

    if (section) {
      section = section[0];

      professor = professor.replace(section, '');
    }

    professor = professor.replace('.', '').trim();

    if (professor) {
      if (professor.includes(',')) {
        names = professor.split(',');

        firstName = names[1].trim();
        lastName = names[0].trim();
      } else if (professor.includes(' ')) {
        names = professor.split(' ');

        firstName = names[0].trim();
        lastName = names[1].trim();
      } else {
        firstName = null;
        lastName = professor;
      }
    } else {
      firstName = null;
      lastName = null;
    }

    if (prefix) params['coursePrefix'] = prefix;
    if (number) params['courseNumber'] = number;
    if (year) params['year'] = year;
    if (semester) params['type'] = semester;
    if (section) params['sectionNumber'] = section;
    if (firstName) params['firstName'] = firstName;
    if (lastName) params['lastName'] = lastName;

    return params;
  },
  
  abbreviateSemesterName(name) {
    name = name.trim().toLowerCase();
    if (name === 'summer') {
      return 'su';
    } else if (name === 'spring') {
      return 's';
    } else if (name === 'fall') {
      return 'f';
    }
    return null;
  }
}
