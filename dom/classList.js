const { setIntersection } = require('./utils');

/**
 * Used to represent list of classes for each node
 */
class ClassList {
  _classes = new Set();

  add(_class) {
    this._classes.add(_class);
  }

  includes(_class) {
    return this._classes.has(_class);
  }

  get size() {
    return this._classes.size;
  }

  match(classes) {
    return setIntersection(this._classes, classes).size > 0;
  }

  toString() {
    return [...this._classes].join(' ');
  }
};

module.exports = ClassList;