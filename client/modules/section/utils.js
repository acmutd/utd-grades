export default {
  buildSectionNames(sections) {
    if (sections) {
      for (let i = 0; i < sections.length; i++) {
        sections[i] = this.buildSectionName(sections[i]);
      }
    }

    return sections;
  },
  buildSectionName(section) {
    if (section && section.course && section.course.semester) {
      section.course.semester.name = this.getSemesterName(section.course.semester)
    }

    return section;
  },
  getSemesterName(semester) {
    const capitalizedType = semester.type.charAt(0).toUpperCase() + semester.type.slice(1);

    return `${capitalizedType} ${semester.year}`;
  }
}
