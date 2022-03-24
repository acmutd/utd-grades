export default {
  expandSemesterNames(response) {
    if (response) {
      for (let i = 0; i < response.length; i++) {
        response[i] = this.expandSemesterName(response[i]);
      }
    }
    return response;
  },
  expandSemesterName(response) {
    let s = response.semester.name;

    if (s.startsWith('su')) {
      s = `Summer 20${s.substring(2)}`
    } else if (s.startsWith('s')) {
      s = `Spring 20${s.substring(1)}`
    } else if (s.startsWith('f')) {
      s = `Fall 20${s.substring(1)}`
    }

    response.semester.name = s;

    return response;
  }
}
