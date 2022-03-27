export default {
  getColors(keys) {
    const colorMap = {
      'A+': 'rgb(45, 179, 63)',
      A: 'rgb(48, 199, 55)',
      'A-': 'rgb(107, 212, 15)',
      'B+': 'rgb(147, 209, 13)',
      B: 'rgb(205, 255, 79)',
      'B-': 'rgb(255, 225, 77)',
      'C+': 'rgb(255, 208, 54)',
      C: 'rgb(255, 173, 51)',
      'C-': 'rgb(255, 112, 77)',
      'D+': 'rgb(245, 24, 169)',
      D: 'rgb(160, 30, 86)',
      'D-': 'rgb(117, 14, 58)',
      F: 'rgb(216, 10, 55)',
      W: 'rgb(102, 102, 102)',
    };

    return keys.map((key) => colorMap[key]);
  },
  extractGrades(obj) {
    let ret = {};

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
  },
  getTotalStudents(obj) {
    return Object.values(this.extractGrades(obj)).reduce(
      (acc, x) => acc + x,
      0
    );
  },
};
