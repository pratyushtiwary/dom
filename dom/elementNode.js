const { setIntersection } = require('./utils');
const ClassList = require('./classList');
const { LinkedList, Node } = require('./linkedList');

/**
 * Represents single element in the dom tree
 */
class ElementNode extends Node {
  tag = '';
  _classList = new ClassList();
  _id = new Set();
  _childrens = null;

  _next = null;
  _prev = null;

  constructor(tag) {
    super();
    this.tag = tag;
    this.childrens = new LinkedList();
  }

  /** Getters */

  get nextSibling() {
    return this._next;
  }

  get prevSibling() {
    return this._prev;
  }

  get id() {
    return this._id;
  }

  set id(newValue) {
    this._id.add(newValue);
  }

  get classList() {
    return this._classList;
  }
  
  get childNodes() {
    return this.childrens;
  }

  get next() {
    return this.nextSibling;
  }

  get prev() {
    return this.prevSibling;
  }

  /** Private functions */

  _printChildren(depth = 0) {
    let child = this.childrens.head;
    const prefix = Array.from({length: depth - 1}, () => '\t').join('');

    while(child) {
      if (child.childNodes.length == 0) {
        console.log(`${prefix} ${child.toString()}</${child.tag}>`);
      } else {
        console.log(`${prefix} ${child.toString()}`);
        child._printChildren(depth + 1);
        console.log(`${prefix} </${child.tag}>`)
      }
      child = child.nextSibling;
    }

  }

  /**
   * Uses DFS to traverse through DOM tree and returns null if no match is found or the first ElementNode statifying the criteria
   * @param {Number} currIter - used for indexing path, set to zero to start search from path[0]
   * @param {Array} path - Array of strings, this defines the address of node to be found
   * @returns {ElementNode | null}
   */
  _find(currIter, path) {
    if (currIter >= path.length) {
      return undefined;
    }

    let node = null;
    const currentCriteria = path[currIter];

    const parsedCriteria = this._parseCriteria(currentCriteria);

    // does the current node matches all the criteria
    const match = this._matchCriterias(parsedCriteria);

    if (match) {
      currIter += 1;
    }

    // look for item in children
    if (currIter < path.length) {

      let child = this.childrens.head;
      let childMatch = false;
  
      while (child && !childMatch) {
        childMatch = child._find(currIter, path);
        child = child.nextSibling;
      }

      if (childMatch) {
        node = childMatch;
      }
    } else if(match) {
      return this;
    }

    return node;
  }

  _matchCriterias(criteria) {
    // check tag (1st priority)
    if (criteria.tag && this.tag !== criteria.tag) {
      return false;
    }

    // check ids (2nd priority)
    if (criteria.ids.size > 0 && setIntersection(this._id, criteria.ids).size === 0) {
      return false;
    }
    
    // check classes (3rd priority)
    return criteria.classes.size > 0 ? this.classList.match(criteria.classes) : true;
  }

  _parseCriteria(criteria) {
    let classes = new Set();
    let ids = new Set();
    let tag = [];

    if (!criteria) {
      return {
        classes,
        ids,
        tag: undefined
      }
    }

    const CLASS_IDENTIFIER = '.';
    const ID_IDENTIFIER = '#';

    let currentBucket;
    let startIdx = 0;

    if (criteria.startsWith(ID_IDENTIFIER)) {
      currentBucket = ids; 
    } else if (criteria.startsWith(CLASS_IDENTIFIER)) {
      currentBucket = classes;
    } else {
      currentBucket = tag;
    }

    function addToCurrentBucket(part) {
      if (currentBucket instanceof Set) {
        currentBucket.add(part);
      } else {
        currentBucket.push(part);
      }
    }

    let charIdx = 0;
    
    for (const char of criteria.slice(1)) {
      charIdx++;
      
      if (char === CLASS_IDENTIFIER) {
        // make changes to currentBucket and then update currentBucket ref
        addToCurrentBucket(criteria.slice(startIdx, charIdx));
        currentBucket = classes;
        startIdx = charIdx + 1;
        continue;
      }
      
      if (char === ID_IDENTIFIER) {
        // make changes to currentBucket and then update currentBucket ref
        addToCurrentBucket(criteria.slice(startIdx, charIdx));
        currentBucket = ids;
        startIdx = charIdx + 1;
      }
    }

    if (startIdx < criteria.length) {
      addToCurrentBucket(criteria.slice(startIdx, criteria.length));
      currentBucket = undefined;
    }

    return {
      classes,
      ids,
      tag: tag[0],
    };
  }

  /** Public functions */

  append(node) {
    this.childrens.append(node);
  }

  appendChild(node) {
    this.append(node);
  }

  print() {
    console.log(this.toString());
    this._printChildren(1);
    console.log(`</${this.tag}>`);
  }

  toString() {
    let string = `<${this.tag}`;

    if (this.id.size > 0) {
      string += ` id="${[...this.id].join(' ')}"`;
    }

    if (this.classList.size > 0) {
      string += ` class="${this._classList.toString()}"`;
    }

    string += '>'

    return string;
  }

  querySelector(query) {
    return this._find(0, query.split(' '));
  }
}

module.exports = ElementNode;