const ElementNode = require('./elementNode');

/**
 * Represents single node in LinkedList
 */
class Node {
  _next = null;
  _prev = null;

  get next() {
    return undefined;
  }

  get prev() {
    return undefined
  }
};

class LinkedList {
  head = null;
  tail = null;
  _length = 0;

  get length() {
    return this._length;
  }

  /**
   * Used internally by dom tree to maintain list of childrens
   * @param {ElementNode} head - Optional 
   */
  constructor(head = null) {
    this._verifyNode(head);

    if (head !== null) {
      this._length += 1;
    }
    
    if (this.head) {
      head._next = this.head;
    } else {
      this.tail = head;
    }

    this.head = head;
  }

  _verifyNode(node) {
    if (node !== null && !(node instanceof Node)) {
      throw Error('Provided head is not of type ElementNode');
    }
  }

  append(node) {
    this._verifyNode(node);

    this._length += 1;

    if (!this.head) {
      this.head = node;
      this.tail = node;
      return;
    }

    this.tail._next = node;
    node._prev = this.tail;
    this.tail = node;
  }
}


module.exports = {
  LinkedList,
  Node
};