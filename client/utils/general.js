import _ from 'lodash';

export default {
  convertAssociatedArrayToObjectArray(associatedArray) {
    const array = [];

    for (let property in associatedArray) {
      if (associatedArray.hasOwnProperty(property)) {
        array.push({
          key: property,
          value: parseInt(associatedArray[property]),
        });
      }
    }

    return array;
  },
  sortByGrades(grades) {
    const sort = {
      'A+': 100,
      'A': 95,
      'A-': 92,
      'B+': 89,
      'B': 85,
      'B-': 82,
      'C+': 79,
      'C': 75,
      'C-': 72,
      'D+': 68,
      'D': 65,
      'D-': 62,
      'F': 50,
      'W': 40,
    };

    const sortedGrades = _.sortBy(grades, (o) => {
      return sort[o.key];
    });

    return _.reverse(sortedGrades);
  },
  splitData(grades) {
    const keys = [];
    const values = [];

    for (let i = 0; i < grades.length; i++) {
      keys.push(grades[i].key);
      values.push(grades[i].value);
    }

    return { keys, values };
  },
  getColors(keys) {
    const colorMap = {
      'A+': 'rgb(45, 179, 63)',
      'A': 'rgb(48, 199, 55)',
      'A-': 'rgb(107, 212, 15)',
      'B+': 'rgb(147, 209, 13)',
      'B': 'rgb(205, 255, 79)',
      'B-': 'rgb(255, 225, 77)',
      'C+': 'rgb(255, 208, 54)',
      'C': 'rgb(255, 173, 51)',
      'C-': 'rgb(255, 112, 77)',
      'D+': 'rgb(245, 24, 169)',
      'D': 'rgb(160, 30, 86)',
      'D-': 'rgb(117, 14, 58)',
      'F': 'rgb(216, 10, 55)',
      'W': 'rgb(102, 102, 102)',
    };

    const colors = [];

    for (let i = 0; i < keys.length; i++) {
      colors.push(colorMap[keys[i]]);
    }

    return colors;
  },
  extractGrades(obj) {
    let ret = {}

    function addIfNotZero(key, value) {
      if (value === 0) return;
      ret[key] = value;
    }

    addIfNotZero('A+', obj.aPlus);
    addIfNotZero('A', obj.a);
    addIfNotZero('A-', obj.aMinus);
    addIfNotZero('B+', obj.bPlus);
    addIfNotZero('B', obj.b);
    addIfNotZero('B-', obj.bMinus);
    addIfNotZero('C+', obj.cPlus);
    addIfNotZero('C', obj.c);
    addIfNotZero('C-', obj.cMinus);
    addIfNotZero('D+', obj.dPlus);
    addIfNotZero('D', obj.d);
    addIfNotZero('D-', obj.dMinus);
    addIfNotZero('F', obj.f);
    addIfNotZero('CR', obj.cr);
    addIfNotZero('NC', obj.nc);
    addIfNotZero('P', obj.p);
    addIfNotZero('W', obj.w);
    addIfNotZero('I', obj.i);
    addIfNotZero('NF', obj.nf);

    return ret;
  }
};
