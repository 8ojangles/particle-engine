(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @fileOverview Implementation of a doubly linked-list data structure
 * @author Jason S. Jones
 * @license MIT
 */

(function () {
    'use strict';

    var isEqual = require('lodash.isequal');
    var Node = require('./lib/list-node');
    var Iterator = require('./lib/iterator');

    /**************************************************
     * Doubly linked list class
     *
     * Implementation of a doubly linked list data structure.  This
     * implementation provides the general functionality of adding nodes to
     * the front or back of the list, as well as removing node from the front
     * or back.  This functionality enables this implemention to be the
     * underlying data structure for the more specific stack or queue data
     * structure.
     *
     ***************************************************/

    /**
     * Creates a LinkedList instance.  Each instance has a head node, a tail
     * node and a size, which represents the number of nodes in the list.
     *
     * @constructor
     */
    function DoublyLinkedList() {
        this.head = null;
        this.tail = null;
        this.size = 0;

        // add iterator as a property of this list to share the same
        // iterator instance with all other methods that may require
        // its use.  Note: be sure to call this.iterator.reset() to
        // reset this iterator to point the head of the list.
        this.iterator = new Iterator(this);
    }

    /* Functions attached to the Linked-list prototype.  All linked-list
     * instances will share these methods, meaning there will NOT be copies
     * made for each instance.  This will be a huge memory savings since there
     * may be several different linked lists.
     */
    DoublyLinkedList.prototype = {

        /**
         * Creates a new Node object with 'data' assigned to the node's data
         * property
         *
         * @param {object|string|number} data The data to initialize with the
         *                                    node
         * @returns {object} Node object intialized with 'data'
         */
        createNewNode: function (data) {
            return new Node(data);
        },

        /**
         * Returns the first node in the list, commonly referred to as the
         * 'head' node
         *
         * @returns {object} the head node of the list
         */
        getHeadNode: function () {
            return this.head;
        },

        /**
         * Returns the last node in the list, commonly referred to as the
         * 'tail'node
         *
         * @returns {object} the tail node of the list
         */
        getTailNode: function () {
            return this.tail;
        },

        /**
         * Determines if the list is empty
         *
         * @returns {boolean} true if the list is empty, false otherwise
         */
        isEmpty: function () {
            return (this.size === 0);
        },

        /**
         * Returns the size of the list, or number of nodes
         *
         * @returns {number} the number of nodes in the list
         */
        getSize: function () {
            return this.size;
        },

        /**
         * Clears the list of all nodes/data
         */
        clear: function () {
            while (!this.isEmpty()) {
                this.remove();
            }
        },

        //################## INSERT methods ####################

        /**
         * Inserts a node with the provided data to the end of the list
         *
         * @param {object|string|number} data The data to initialize with the
         *                                    node
         * @returns {boolean} true if insert operation was successful
         */
        insert: function (data) {
            var newNode = this.createNewNode(data);
            if (this.isEmpty()) {
                this.head = this.tail = newNode;
            } else {
                this.tail.next = newNode;
                newNode.prev = this.tail;
                this.tail = newNode;
            }
            this.size += 1;

            return true;
        },

        /**
         * Inserts a node with the provided data to the front of the list
         *
         * @param {object|string|number} data The data to initialize with the
         *                                    node
         * @returns {boolean} true if insert operation was successful
         */
        insertFirst: function (data) {
            if (this.isEmpty()) {
                this.insert(data);
            } else {
                var newNode = this.createNewNode(data);

                newNode.next = this.head;
                this.head.prev = newNode;
                this.head = newNode;

                this.size += 1;
            }

            return true;
        },

        /**
         * Inserts a node with the provided data at the index indicated.
         *
         * @param {number} index The index in the list to insert the new node
         * @param {object|string|number} data The data to initialize with the node
         */
        insertAt: function (index, data) {
            var current = this.getHeadNode(),
                newNode = this.createNewNode(data),
                position = 0;

            // check for index out-of-bounds
            if (index < 0 || index > this.getSize() - 1) {
                return false;
            }

            // if index is 0, we just need to insert the first node
            if (index === 0) {
                this.insertFirst(data);
                return true;
            }

            while (position < index) {
                current = current.next;
                position += 1;
            }

            current.prev.next = newNode;
            newNode.prev = current.prev;
            current.prev = newNode;
            newNode.next = current;

            this.size += 1;

            return true;
        },

        /**
         * Inserts a node before the first node containing the provided data
         *
         * @param {object|string|number} nodeData The data of the node to
         *         find to insert the new node before
         * @param {object|string|number} dataToInsert The data to initialize with the node
         * @returns {boolean} true if insert operation was successful
         */
        insertBefore: function (nodeData, dataToInsert) {
            var index = this.indexOf(nodeData);
            return this.insertAt(index, dataToInsert);
        },

        /**
         * Inserts a node after the first node containing the provided data
         *
         * @param {object|string|number} nodeData The data of the node to
         *         find to insert the new node after
         * @param {object|string|number} dataToInsert The data to initialize with the node
         * @returns {boolean} true if insert operation was successful
         */
        insertAfter: function (nodeData, dataToInsert) {
            var index = this.indexOf(nodeData);
            var size = this.getSize();

            // check if we want to insert new node after the tail node
            if (index + 1 === size) {

                // if so, call insert, which will append to the end by default
                return this.insert(dataToInsert);

            } else {

                // otherwise, increment the index and insert there
                return this.insertAt(index + 1, dataToInsert);
            }
        },

        /**
         * Concatenate another linked list to the end of this linked list. The result is very
         * similar to array.concat but has a performance improvement since there is no need to
         * iterate over the lists
         * @param {DoublyLinkedList} otherLinkedList
         * @returns {DoublyLinkedList}
         */
        concat: function (otherLinkedList) {
            if (otherLinkedList instanceof DoublyLinkedList) {
                //create new list so the calling list is immutable (like array.concat)
                var newList = new DoublyLinkedList();
                if (this.getSize() > 0) { //this list is NOT empty
                    newList.head = this.getHeadNode();
                    newList.tail = this.getTailNode();
                    newList.tail.next = otherLinkedList.getHeadNode();
                    if (otherLinkedList.getSize() > 0) {
                        newList.tail = otherLinkedList.getTailNode();
                    }
                    newList.size = this.getSize() + otherLinkedList.getSize();
                }
                else { //'this' list is empty
                    newList.head = otherLinkedList.getHeadNode();
                    newList.tail = otherLinkedList.getTailNode();
                    newList.size = otherLinkedList.getSize();
                }
                return newList;

            }
            else {
                throw new Error("Can only concat another instance of DoublyLinkedList");
            }
        },

        //################## REMOVE methods ####################

        /**
         * Removes the tail node from the list
         *
         * There is a significant performance improvement with the operation
         * over its singly linked list counterpart.  The mere fact of having
         * a reference to the previous node improves this operation from O(n)
         * (in the case of singly linked list) to O(1).
         *
         * @returns the node that was removed
         */
        remove: function () {
            if (this.isEmpty()) {
                return null;
            }

            // get handle for the tail node
            var nodeToRemove = this.getTailNode();

            // if there is only one node in the list, set head and tail
            // properties to null
            if (this.getSize() === 1) {
                this.head = null;
                this.tail = null;

            // more than one node in the list
            } else {
                this.tail = this.getTailNode().prev;
                this.tail.next = null;
            }
            this.size -= 1;

            return nodeToRemove;
        },

        /**
         * Removes the head node from the list
         *
         * @returns the node that was removed
         */
        removeFirst: function () {
            if (this.isEmpty()) {
                return null;
            }

            var nodeToRemove;

            if (this.getSize() === 1) {
                nodeToRemove = this.remove();
            } else {
                nodeToRemove = this.getHeadNode();
                this.head = this.head.next;
                this.head.prev = null;
                this.size -= 1;
            }

            return nodeToRemove;
        },

        /**
         * Removes the node at the index provided
         *
         * @param {number} index The index of the node to remove
         * @returns the node that was removed
         */
        removeAt: function (index) {
            var nodeToRemove = this.findAt(index);

            // check for index out-of-bounds
            if (index < 0 || index > this.getSize() - 1) {
                return null;
            }

            // if index is 0, we just need to remove the first node
            if (index === 0) {
                return this.removeFirst();
            }

            // if index is size-1, we just need to remove the last node,
            // which remove() does by default
            if (index === this.getSize() - 1) {
                return this.remove();
            }

            nodeToRemove.prev.next = nodeToRemove.next;
            nodeToRemove.next.prev = nodeToRemove.prev;
            nodeToRemove.next = nodeToRemove.prev = null;

            this.size -= 1;

            return nodeToRemove;
        },

        /**
         * Removes the first node that contains the data provided
         *
         * @param {object|string|number} nodeData The data of the node to remove
         * @returns the node that was removed
         */
        removeNode: function (nodeData) {
            var index = this.indexOf(nodeData);
            return this.removeAt(index);
        },

        //################## FIND methods ####################

        /**
         * Returns the index of the first node containing the provided data.  If
         * a node cannot be found containing the provided data, -1 is returned.
         *
         * @param {object|string|number} nodeData The data of the node to find
         * @returns the index of the node if found, -1 otherwise
         */
        indexOf: function (nodeData) {
            this.iterator.reset();
            var current;

            var index = 0;

            // iterate over the list (keeping track of the index value) until
            // we find the node containg the nodeData we are looking for
            while (this.iterator.hasNext()) {
                current = this.iterator.next();
                if (isEqual(current.getData(), nodeData)) {
                    return index;
                }
                index += 1;
            }

            // only get here if we didn't find a node containing the nodeData
            return -1;
        },

        /**
         * Returns the fist node containing the provided data.  If a node
         * cannot be found containing the provided data, -1 is returned.
         *
         * @param {object|string|number} nodeData The data of the node to find
         * @returns the node if found, -1 otherwise
         */
        find: function (nodeData) {
            // start at the head of the list
            this.iterator.reset();
            var current;

            // iterate over the list until we find the node containing the data
            // we are looking for
            while (this.iterator.hasNext()) {
                current = this.iterator.next();
                if (isEqual(current.getData(), nodeData)) {
                    return current;
                }
            }

            // only get here if we didn't find a node containing the nodeData
            return -1;
        },

        /**
         * Returns the node at the location provided by index
         *
         * @param {number} index The index of the node to return
         * @returns the node located at the index provided.
         */
        findAt: function (index) {
            // if idx is out of bounds or fn called on empty list, return -1
            if (this.isEmpty() || index > this.getSize() - 1) {
                return -1;
            }

            // else, loop through the list and return the node in the
            // position provided by idx.  Assume zero-based positions.
            var node = this.getHeadNode();
            var position = 0;

            while (position < index) {
                node = node.next;
                position += 1;
            }

            return node;
        },

        /**
         * Determines whether or not the list contains the provided nodeData
         *
         * @param {object|string|number} nodeData The data to check if the list
         *        contains
         * @returns the true if the list contains nodeData, false otherwise
         */
        contains: function (nodeData) {
            if (this.indexOf(nodeData) > -1) {
                return true;
            } else {
                return false;
            }
        },

        //################## UTILITY methods ####################

        /**
         * Utility function to iterate over the list and call the fn provided
         * on each node, or element, of the list
         *
         * @param {object} fn The function to call on each node of the list
         * @param {bool} reverse Use or not reverse iteration (tail to head), default to false
         */
        forEach: function (fn, reverse) {
            reverse = reverse || false;
            if (reverse) {
                this.iterator.reset_reverse();
                this.iterator.each_reverse(fn);
            } else {
                this.iterator.reset();
                this.iterator.each(fn);
            }
        },

        /**
         * Returns an array of all the data contained in the list
         *
         * @returns {array} the array of all the data from the list
         */
        toArray: function () {
            var listArray = [];
            this.forEach(function (node) {
                listArray.push(node.getData());
            });

            return listArray;
        },

        /**
         * Interrupts iteration over the list
         */
        interruptEnumeration: function () {
            this.iterator.interrupt();
        }
    };

    module.exports = DoublyLinkedList;

}());

},{"./lib/iterator":2,"./lib/list-node":3,"lodash.isequal":4}],2:[function(require,module,exports){
/**
 * @fileOverview Implementation of an iterator for a linked list
 *               data structure
 * @author Jason S. Jones
 * @license MIT
 */

(function () {
    'use strict';

    /**************************************************
     * Iterator class
     *
     * Represents an instantiation of an iterator to be used
     * within a linked list.  The iterator will provide the ability
     * to iterate over all nodes in a list by keeping track of the
     * postition of a 'currentNode'.  This 'currentNode' pointer
     * will keep state until a reset() operation is called at which
     * time it will reset to point the head of the list.
     *
     * Even though this iterator class is inextricably linked
     * (no pun intended) to a linked list instatiation, it was removed
     * from within the linked list code to adhere to the best practice
     * of separation of concerns.
     *
     ***************************************************/

    /**
     * Creates an iterator instance to iterate over the linked list provided.
     *
     * @constructor
     * @param {object} theList the linked list to iterate over
     */
    function Iterator(theList) {
        this.list = theList || null;
        this.stopIterationFlag = false;

        // a pointer the current node in the list that will be returned.
        // initially this will be null since the 'list' will be empty
        this.currentNode = null;
    }

    /* Functions attached to the Iterator prototype.  All iterator instances
     * will share these methods, meaning there will NOT be copies made for each
     * instance.
     */
    Iterator.prototype = {

        /**
         * Returns the next node in the iteration.
         *
         * @returns {object} the next node in the iteration.
         */
        next: function () {
            var current = this.currentNode;
            // a check to prevent error if randomly calling next() when
            // iterator is at the end of the list, meaining the currentNode
            // will be pointing to null.
            //
            // When this function is called, it will return the node currently
            // assigned to this.currentNode and move the pointer to the next
            // node in the list (if it exists)
            if (this.currentNode !== null) {
                this.currentNode = this.currentNode.next;
            }

            return current;
        },

        /**
         * Determines if the iterator has a node to return
         *
         * @returns true if the iterator has a node to return, false otherwise
         */
        hasNext: function () {
            return this.currentNode !== null;
        },

        /**
         * Resets the iterator to the beginning of the list.
         */
        reset: function () {
            this.currentNode = this.list.getHeadNode();
        },

        /**
         * Returns the first node in the list and moves the iterator to
         * point to the second node.
         *
         * @returns the first node in the list
         */
        first: function () {
            this.reset();
            return this.next();
        },

        /**
         * Sets the list to iterate over
         *
         * @param {object} theList the linked list to iterate over
         */
        setList: function (theList) {
            this.list = theList;
            this.reset();
        },

        /**
         * Iterates over all nodes in the list and calls the provided callback
         * function with each node as an argument.
         * Iteration will break if interrupt() is called
         *
         * @param {function} callback the callback function to be called with
         *                   each node of the list as an arg
         */
        each: function (callback) {
            this.reset();
            var el;
            while (this.hasNext() && !this.stopIterationFlag) {
                el = this.next();
                callback(el);
            }
            this.stopIterationFlag = false;
        },

        /*
         * ### REVERSE ITERATION (TAIL -> HEAD) ###
         */

        /**
         * Returns the first node in the list and moves the iterator to
         * point to the second node.
         *
         * @returns the first node in the list
         */
        last: function () {
            this.reset_reverse();
            return this.next_reverse();
        },

        /**
         * Resets the iterator to the tail of the list.
         */
        reset_reverse: function () {
            this.currentNode = this.list.getTailNode();
        },

        /**
         * Returns the next node in the iteration, when iterating from tail to head
         *
         * @returns {object} the next node in the iteration.
         */
        next_reverse: function () {
            var current = this.currentNode;
            if (this.currentNode !== null) {
                this.currentNode = this.currentNode.prev;
            }

            return current;
        },

        /**
         * Iterates over all nodes in the list and calls the provided callback
         * function with each node as an argument,
         * starting from the tail and going towards the head.
         * The iteration will break if interrupt() is called.
         *
         * @param {function} callback the callback function to be called within
         *                    each node as an arg
         */
        each_reverse: function (callback) {
            this.reset_reverse();
            var el;
            while (this.hasNext() && !this.stopIterationFlag) {
                el = this.next_reverse();
                callback(el);
            }
            this.stopIterationFlag = false;
        },

        /*
         * ### INTERRUPT ITERATION ###
         */

        /**
         * Raises interrupt flag (that will stop each() or each_reverse())
         */

        interrupt: function () {
            this.stopIterationFlag = true;
        }
    };

    module.exports = Iterator;

}());

},{}],3:[function(require,module,exports){
(function () {
    'use strict';

    /**************************************************
     * Linked list node class
     *
     * Internal private class to represent a node within
     * a linked list.  Each node has a 'data' property and
     * a pointer the previous node and the next node in the list.
     *
     * Since the 'Node' function is not assigned to
     * module.exports it is not visible outside of this
     * file, therefore, it is private to the LinkedList
     * class.
     *
     ***************************************************/

    /**
     * Creates a node object with a data property and pointer
     * to the next node
     *
     * @constructor
     * @param {object|number|string} data The data to initialize with the node
     */
    function Node(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }

    /* Functions attached to the Node prototype.  All node instances will
     * share these methods, meaning there will NOT be copies made for each
     * instance.  This will be a huge memory savings since there will likely
     * be a large number of individual nodes.
     */
    Node.prototype = {

        /**
         * Returns whether or not the node has a pointer to the next node
         *
         * @returns {boolean} true if there is a next node; false otherwise
         */
        hasNext: function () {
            return (this.next !== null);
        },

        /**
         * Returns whether or not the node has a pointer to the previous node
         *
         * @returns {boolean} true if there is a previous node; false otherwise
         */
        hasPrev: function () {
            return (this.prev !== null);
        },

        /**
         * Returns the data of the the node
         *
         * @returns {object|string|number} the data of the node
         */
        getData: function () {
            return this.data;
        },

        /**
         * Returns a string represenation of the node.  If the data is an
         * object, it returns the JSON.stringify version of the object.
         * Otherwise, it simply returns the data
         *
         * @return {string} the string represenation of the node data
         */
        toString: function () {
            if (typeof this.data === 'object') {
                return JSON.stringify(this.data);
            } else {
                return String(this.data);
            }
        }
    };

    module.exports = Node;

}());

},{}],4:[function(require,module,exports){
(function (global){
/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEqual;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
(function (root, factory){
  'use strict';

  /*istanbul ignore next:cant test*/
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    root.objectPath = factory();
  }
})(this, function(){
  'use strict';

  var
    toStr = Object.prototype.toString,
    _hasOwnProperty = Object.prototype.hasOwnProperty;

  function isEmpty(value){
    if (!value) {
      return true;
    }
    if (isArray(value) && value.length === 0) {
        return true;
    } else if (!isString(value)) {
        for (var i in value) {
            if (_hasOwnProperty.call(value, i)) {
                return false;
            }
        }
        return true;
    }
    return false;
  }

  function toString(type){
    return toStr.call(type);
  }

  function isNumber(value){
    return typeof value === 'number' || toString(value) === "[object Number]";
  }

  function isString(obj){
    return typeof obj === 'string' || toString(obj) === "[object String]";
  }

  function isObject(obj){
    return typeof obj === 'object' && toString(obj) === "[object Object]";
  }

  function isArray(obj){
    return typeof obj === 'object' && typeof obj.length === 'number' && toString(obj) === '[object Array]';
  }

  function isBoolean(obj){
    return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
  }

  function getKey(key){
    var intKey = parseInt(key);
    if (intKey.toString() === key) {
      return intKey;
    }
    return key;
  }

  function set(obj, path, value, doNotReplace){
    if (isNumber(path)) {
      path = [path];
    }
    if (isEmpty(path)) {
      return obj;
    }
    if (isString(path)) {
      return set(obj, path.split('.').map(getKey), value, doNotReplace);
    }
    var currentPath = path[0];

    if (path.length === 1) {
      var oldVal = obj[currentPath];
      if (oldVal === void 0 || !doNotReplace) {
        obj[currentPath] = value;
      }
      return oldVal;
    }

    if (obj[currentPath] === void 0) {
      //check if we assume an array
      if(isNumber(path[1])) {
        obj[currentPath] = [];
      } else {
        obj[currentPath] = {};
      }
    }

    return set(obj[currentPath], path.slice(1), value, doNotReplace);
  }

  function del(obj, path) {
    if (isNumber(path)) {
      path = [path];
    }

    if (isEmpty(obj)) {
      return void 0;
    }

    if (isEmpty(path)) {
      return obj;
    }
    if(isString(path)) {
      return del(obj, path.split('.'));
    }

    var currentPath = getKey(path[0]);
    var oldVal = obj[currentPath];

    if(path.length === 1) {
      if (oldVal !== void 0) {
        if (isArray(obj)) {
          obj.splice(currentPath, 1);
        } else {
          delete obj[currentPath];
        }
      }
    } else {
      if (obj[currentPath] !== void 0) {
        return del(obj[currentPath], path.slice(1));
      }
    }

    return obj;
  }

  var objectPath = function(obj) {
    return Object.keys(objectPath).reduce(function(proxy, prop) {
      if (typeof objectPath[prop] === 'function') {
        proxy[prop] = objectPath[prop].bind(objectPath, obj);
      }

      return proxy;
    }, {});
  };

  objectPath.has = function (obj, path) {
    if (isEmpty(obj)) {
      return false;
    }

    if (isNumber(path)) {
      path = [path];
    } else if (isString(path)) {
      path = path.split('.');
    }

    if (isEmpty(path) || path.length === 0) {
      return false;
    }

    for (var i = 0; i < path.length; i++) {
      var j = path[i];
      if ((isObject(obj) || isArray(obj)) && _hasOwnProperty.call(obj, j)) {
        obj = obj[j];
      } else {
        return false;
      }
    }

    return true;
  };

  objectPath.ensureExists = function (obj, path, value){
    return set(obj, path, value, true);
  };

  objectPath.set = function (obj, path, value, doNotReplace){
    return set(obj, path, value, doNotReplace);
  };

  objectPath.insert = function (obj, path, value, at){
    var arr = objectPath.get(obj, path);
    at = ~~at;
    if (!isArray(arr)) {
      arr = [];
      objectPath.set(obj, path, arr);
    }
    arr.splice(at, 0, value);
  };

  objectPath.empty = function(obj, path) {
    if (isEmpty(path)) {
      return obj;
    }
    if (isEmpty(obj)) {
      return void 0;
    }

    var value, i;
    if (!(value = objectPath.get(obj, path))) {
      return obj;
    }

    if (isString(value)) {
      return objectPath.set(obj, path, '');
    } else if (isBoolean(value)) {
      return objectPath.set(obj, path, false);
    } else if (isNumber(value)) {
      return objectPath.set(obj, path, 0);
    } else if (isArray(value)) {
      value.length = 0;
    } else if (isObject(value)) {
      for (i in value) {
        if (_hasOwnProperty.call(value, i)) {
          delete value[i];
        }
      }
    } else {
      return objectPath.set(obj, path, null);
    }
  };

  objectPath.push = function (obj, path /*, values */){
    var arr = objectPath.get(obj, path);
    if (!isArray(arr)) {
      arr = [];
      objectPath.set(obj, path, arr);
    }

    arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
  };

  objectPath.coalesce = function (obj, paths, defaultValue) {
    var value;

    for (var i = 0, len = paths.length; i < len; i++) {
      if ((value = objectPath.get(obj, paths[i])) !== void 0) {
        return value;
      }
    }

    return defaultValue;
  };

  objectPath.get = function (obj, path, defaultValue){
    if (isNumber(path)) {
      path = [path];
    }
    if (isEmpty(path)) {
      return obj;
    }
    if (isEmpty(obj)) {
      return defaultValue;
    }
    if (isString(path)) {
      return objectPath.get(obj, path.split('.'), defaultValue);
    }

    var currentPath = getKey(path[0]);

    if (path.length === 1) {
      if (obj[currentPath] === void 0) {
        return defaultValue;
      }
      return obj[currentPath];
    }

    return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
  };

  objectPath.del = function(obj, path) {
    return del(obj, path);
  };

  return objectPath;
});

},{}],6:[function(require,module,exports){
// utilities
var mathUtils = require('./mathUtils.js').mathUtils;

function EmitterEntity(emitterName, emitterTheme, particleOpts, emitFn) {

    this.name = emitterName;

    // emitter entity config
    this.emitterOpts = emitterTheme;
    // emitter emission config
    this.emissionOpts = this.emitterOpts.emission;
    // emitter particle config
    this.particleOpts = particleOpts;

    // saves drilling down
    var emitter = this.emitterOpts.emitter;
    var emission = this.emissionOpts;
    var emitRate = emission.rate;
    var emitRepeat = emission.repeater;

    // emitter master clock init
    this.localClock = 0;
    this.localClockRunning = false;
    this.emitFn = emitFn;
    // emitter life
    this.active = emitter.active;

    // emitter vectors
    this.x = emitter.x;
    this.y = emitter.y;
    this.xVel = emitter.xVel;
    this.yVel = emitter.yVel;

    // emitter environmental influences
    this.applyGlobalForces = emitter.applyGlobalForces;

    // emitter emission config
    // emission rate
    this.rateMin = emitRate.min;
    this.rateMax = emitRate.max;
    this.rateDecay = emitRate.decay.rate;
    this.rateDecayMax = emitRate.decay.decayMax;

    // emission repetition
    this.repeatRate = emitRepeat.rate;
    this.repeatDecay = emitRepeat.decay.rate;
    this.repeatDecayMax = emitRepeat.decay.decayMax;
    this.triggerType = 'mouseClickEvent';

    this.initValues = {
        rateMin: emitRate.min,
        rateMax: emitRate.max,
        rateDecay: emitRate.decay.rate,
        rateDecayMax: emitRate.decay.decayMax,
        repeatRate: emitRepeat.rate,
        repeatDecay: emitRepeat.decay.rate,
        repeatDecayMax: emitRepeat.decay.decayMax
    };
}

EmitterEntity.prototype.resetEmissionValues = function () {
    var self = this;

    self.rateMin = self.initValues.rateMin;
    self.rateMax = self.initValues.rateMax;
    self.rateDecay = self.initValues.rateDecay;
    self.rateDecayMax = self.initValues.rateDecayMax;
    self.repeatRate = self.initValues.repeatRate;
    self.repeatDecay = self.initValues.repeatDecay;
    self.repeatDecayMax = self.initValues.repeatDecayMax;
};

EmitterEntity.prototype.updateEmitter = function (updateOpts) {
    var self = this;

    var updates = updateOpts || false;
    var triggerEmitterFlag = false;

    if (updates !== false) {
        self.x = updates.x;
        self.y = updates.y;
    }

    self.x += self.xVel;
    self.y += self.yVel;

    if (self.active === 1) {

        if (self.repeatRate > 0 && self.localClockRunning === true) {

            if (self.localClock % self.repeatRate === 0) {
                triggerEmitterFlag = true;

                if (self.repeatDecay < self.repeatDecayMax) {
                    self.repeatRate += self.repeatDecay;
                    self.localClock = 0;
                    self.localClockRunning === true;
                }

                if (self.rateDecay > 0) {
                    self.rateMin > self.rateDecayMax ? self.rateMin -= self.rateDecay : self.rateMin = 0;
                    self.rateMax > self.rateDecayMax ? self.rateMax -= self.rateDecay : self.rateMax = 0;
                }
            } else {
                triggerEmitterFlag = false;
            }
        }

        self.localClock++;
    }

    if (triggerEmitterFlag === true) {
        self.triggerEmitter({ x: self.x, y: self.y });
    }
};

EmitterEntity.prototype.triggerEmitter = function (triggerOptions) {
    var self = this;

    var thisX, thisY;
    var triggerOpts = triggerOptions || false;
    if (triggerOpts !== false) {
        thisX = triggerOpts.x;
        thisY = triggerOpts.y;
    } else {
        thisX = self.x;
        thisY = self.y;
    }

    self.x = thisX;
    self.y = thisY;

    self.active = true;
    self.localClockRunning = true;

    var emitAmount = mathUtils.randomInteger(self.rateMin, self.rateMax);

    self.emitFn(thisX, thisY, emitAmount, self.emissionOpts, self.particleOpts);

    if (self.repeatRate > 0) {
        self.active = 1;

        // self.updateEmitter( { x: thisX, y: thisY } );
    }
};

EmitterEntity.prototype.renderEmitter = function (context) {
    context.strokeStyle = 'rgb( 255, 255, 255 )';
    context.strokeWidth = 5;
    context.line(this.x, this.y - 15, this.x, this.y + 15, context);
    context.line(this.x - 15, this.y, this.x + 15, this.y, context);
    context.strokeCircle(this.x, this.y, 10, context);
};

EmitterEntity.prototype.killEmitter = function () {};

module.exports.EmitterEntity = EmitterEntity;
},{"./mathUtils.js":21}],7:[function(require,module,exports){
var animation = {
    state: false,
    counter: 0,
    duration: 240
};

module.exports.animation = animation;
},{}],8:[function(require,module,exports){
/**
* @description extends Canvas prototype with useful drawing mixins
* @kind constant
*/
var canvasDrawingApi = CanvasRenderingContext2D.prototype;

/**
* @augments canvasDrawingApi
* @description draw circle API
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.circle = function (x, y, r, context) {
	this.beginPath();
	this.arc(x, y, r, 0, Math.PI * 2, true);
};

/**
* @augments canvasDrawingApi
* @description API to draw filled circle
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.fillCircle = function (x, y, r, context) {
	this.circle(x, y, r, context);
	this.fill();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw stroked circle
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.strokeCircle = function (x, y, r, context) {
	context.circle(x, y, r, context);
	context.stroke();
	context.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.ellipse = function (x, y, w, h, context) {
	context.beginPath();
	for (var i = 0; i < Math.PI * 2; i += Math.PI / 16) {
		context.lineTo(x + Math.cos(i) * w / 2, y + Math.sin(i) * h / 2);
	}
	context.closePath();
};

/**
* @augments canvasDrawingApi
* @description API to draw filled ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.fillEllipse = function (x, y, w, h, context) {
	context.ellipse(x, y, w, h, context);
	context.fill();
	context.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw stroked ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.strokeEllipse = function (x, y, w, h) {
	this.ellipse(x, y, w, h);
	this.stroke();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw line between 2 vector coordinates.
* @param {number} x1 - X coordinate of vector 1.
* @param {number} y1 - Y coordinate of vector 1.
* @param {number} x2 - X coordinate of vector 2.
* @param {number} y2 - Y coordinate of vector 2.
*/
canvasDrawingApi.line = function (x1, y1, x2, y2, context) {
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
	context.beginPath();
};

module.exports.canvasDrawingApi = canvasDrawingApi;
},{}],9:[function(require,module,exports){
var mathUtils = require('./mathUtils.js').mathUtils;

var colorUtils = {
	/**
 * provides color util methods.
 */
	rgb: function rgb(red, green, blue) {
		return 'rgb(' + mathUtils.clamp(Math.round(red), 0, 255) + ', ' + mathUtils.clamp(Math.round(green), 0, 255) + ', ' + mathUtils.clamp(Math.round(blue), 0, 255) + ')';
	},
	rgba: function rgba(red, green, blue, alpha) {
		return 'rgba(' + mathUtils.clamp(Math.round(red), 0, 255) + ', ' + mathUtils.clamp(Math.round(green), 0, 255) + ', ' + mathUtils.clamp(Math.round(blue), 0, 255) + ', ' + mathUtils.clamp(alpha, 0, 1) + ')';
	},
	hsl: function hsl(hue, saturation, lightness) {
		return 'hsl(' + hue + ', ' + mathUtils.clamp(saturation, 0, 100) + '%, ' + mathUtils.clamp(lightness, 0, 100) + '%)';
	},
	hsla: function hsla(hue, saturation, lightness, alpha) {
		return 'hsla(' + hue + ', ' + mathUtils.clamp(saturation, 0, 100) + '%, ' + mathUtils.clamp(lightness, 0, 100) + '%, ' + mathUtils.clamp(alpha, 0, 1) + ')';
	}
};

module.exports.colorUtils = colorUtils;
},{"./mathUtils.js":21}],10:[function(require,module,exports){
var drawing = require('./canvasApiAugmentation.js').canvasDrawingApi;

let c = document.createElement( 'canvas' );
let ctx = c.getContext( '2d' );
c.width = 200;
c.height = 100;
cH = c.width / 2;
cV = c.height / 2;
let cSR = c.height / 2;
let cSO = cH / 2;

function createWarpStarImage() {

	let gRed = ctx.createRadialGradient( cH - cSO, cV, 0, cH - cSO, cV, cSR );
	gRed.addColorStop( 0, 'rgba( 255, 0, 0, 1 )' );
	gRed.addColorStop( 1, 'rgba( 255, 0, 0, 0 )' );

	let gGreen = ctx.createRadialGradient( cH, cV, 0, cH, cV, cSR );
	gGreen.addColorStop( 0, 'rgba( 0, 255, 0, 1 )' );
	gGreen.addColorStop( 1, 'rgba( 0, 255, 0, 0 )' );

	let gBlue = ctx.createRadialGradient( cH + cSO, cV, 0, cH + cSO, cV, cSR );
	gBlue.addColorStop( 0, 'rgba( 0, 0, 255, 1 )' );
	gBlue.addColorStop( 1, 'rgba( 0, 0, 255, 0 )' );

	ctx.globalCompositeOperation = 'lighter';

	ctx.fillStyle = gRed;
	ctx.fillCircle( cH - cSO, cV, cSR, c );

	ctx.fillStyle = gGreen;
	ctx.fillCircle( cH, cV, cSR, c );

	ctx.fillStyle = gBlue;
	ctx.fillCircle( cH + cSO, cV, cSR, c );

	c.renderProps = {
		src: {
			x: 0, y: 0, w: c.width, h: c.height
		},
		dest: {
			x: -cH, y: -cV
		}
	}
	console.log( 'c: ', c.renderProps );

	return c;

}

module.exports = createWarpStarImage;
},{"./canvasApiAugmentation.js":8}],11:[function(require,module,exports){
var mathUtils = require('./mathUtils.js').mathUtils;

var lastCalledTime = void 0;

var debug = {

    helpers: {
        getStyle: function getStyle(element, property) {
            return window.getComputedStyle ? window.getComputedStyle(element, null).getPropertyValue(property) : element.style[property.replace(/-([a-z])/g, function (g) {
                return g[1].toUpperCase();
            })];
        },
        invertColor: function invertColor(hex, bw) {
            if (hex.indexOf('#') === 0) {
                hex = hex.slice(1);
            }
            // convert 3-digit hex to 6-digits.
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            if (hex.length !== 6) {
                throw new Error('Invalid HEX color.');
            }
            var r = parseInt(hex.slice(0, 2), 16),
                g = parseInt(hex.slice(2, 4), 16),
                b = parseInt(hex.slice(4, 6), 16);
            if (bw) {
                // http://stackoverflow.com/a/3943023/112731
                return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
            }
            // invert color components
            r = (255 - r).toString(16);
            g = (255 - g).toString(16);
            b = (255 - b).toString(16);
            // pad each with zeros and return
            return "#" + padZero(r) + padZero(g) + padZero(b);
        }

    },

    display: function display(displayFlag, message, param) {
        var self = this;
        if (self.all === true || displayFlag === true) {
            console.log(message, param);
        }
    },

    debugOutput: function debugOutput(canvas, context, label, param, outputNum, outputBounds) {
        ;

        if (outputBounds) {
            var thisRed = mathUtils.map(param, outputBounds.min, outputBounds.max, 255, 0, true);
            var thisGreen = mathUtils.map(param, outputBounds.min, outputBounds.max, 0, 255, true);
            // var thisBlue = mathUtils.map(param, outputBounds.min, outputBounds.max, 0, 255, true);
            var thisColor = 'rgb( ' + thisRed + ', ' + thisGreen + ', 0 )';

            // console.log( 'changing debug color of: '+param+' to: '+thisColor );
        } else {
            var thisColor = "#efefef";
        }

        var vPos = outputNum * 50 + 50;
        context.textAlign = "left";
        context.font = "14pt arial";
        context.fillStyle = thisColor;

        context.fillText(label + param, 50, vPos);
    },

    calculateFps: function calculateFps() {
        if (!lastCalledTime) {
            lastCalledTime = window.performance.now();
            return 0;
        }
        var delta = (window.performance.now() - lastCalledTime) / 1000;
        lastCalledTime = window.performance.now();
        return 1 / delta;
    },

    flags: {
        all: false,
        parts: {
            clicks: true,
            runtime: true,
            update: false,
            killConditions: false,
            animationCounter: false,
            entityStore: false,
            fps: true
        }
    }
};

module.exports.debug = debug;
module.exports.lastCalledTime = lastCalledTime;
},{"./mathUtils.js":21}],12:[function(require,module,exports){
/*
 * This is a near-direct port of Robert Penner's easing equations. Please shower Robert with
 * praise and all of your admiration. His license is provided below.
 *
 * For information on how to use these functions in your animations, check out my following tutorial: 
 * http://bit.ly/18iHHKq
 *
 * -Kirupa
 */

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */

var easingEquations = {
	/**
 * provides easing util methods.
 */
	linearEase: function linearEase(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * currentIteration / totalIterations + startValue;
	},

	easeInQuad: function easeInQuad(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (currentIteration /= totalIterations) * currentIteration + startValue;
	},

	easeOutQuad: function easeOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
		return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
	},

	easeInOutQuad: function easeInOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * currentIteration * currentIteration + startValue;
		}
		return -changeInValue / 2 * (--currentIteration * (currentIteration - 2) - 1) + startValue;
	},

	easeInCubic: function easeInCubic(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
	},

	easeOutCubic: function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
	},

	easeInOutCubic: function easeInOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
		}
		return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
	},

	easeInQuart: function easeInQuart(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(currentIteration / totalIterations, 4) + startValue;
	},

	easeOutQuart: function easeOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
		return -changeInValue * (Math.pow(currentIteration / totalIterations - 1, 4) - 1) + startValue;
	},

	easeInOutQuart: function easeInOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * Math.pow(currentIteration, 4) + startValue;
		}
		return -changeInValue / 2 * (Math.pow(currentIteration - 2, 4) - 2) + startValue;
	},

	easeInQuint: function easeInQuint(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(currentIteration / totalIterations, 5) + startValue;
	},

	easeOutQuint: function easeOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 5) + 1) + startValue;
	},

	easeInOutQuint: function easeInOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * Math.pow(currentIteration, 5) + startValue;
		}
		return changeInValue / 2 * (Math.pow(currentIteration - 2, 5) + 2) + startValue;
	},

	easeInSine: function easeInSine(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (1 - Math.cos(currentIteration / totalIterations * (Math.PI / 2))) + startValue;
	},

	easeOutSine: function easeOutSine(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.sin(currentIteration / totalIterations * (Math.PI / 2)) + startValue;
	},

	easeInOutSine: function easeInOutSine(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
	},

	easeInExpo: function easeInExpo(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
	},

	easeOutExpo: function easeOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
	},

	easeInOutExpo: function easeInOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * Math.pow(2, 10 * (currentIteration - 1)) + startValue;
		}
		return changeInValue / 2 * (-Math.pow(2, -10 * --currentIteration) + 2) + startValue;
	},

	easeInCirc: function easeInCirc(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (1 - Math.sqrt(1 - (currentIteration /= totalIterations) * currentIteration)) + startValue;
	},

	easeOutCirc: function easeOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.sqrt(1 - (currentIteration = currentIteration / totalIterations - 1) * currentIteration) + startValue;
	},

	easeInOutCirc: function easeInOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * (1 - Math.sqrt(1 - currentIteration * currentIteration)) + startValue;
		}
		return changeInValue / 2 * (Math.sqrt(1 - (currentIteration -= 2) * currentIteration) + 1) + startValue;
	},

	easeInElastic: function easeInElastic(t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	easeOutElastic: function easeOutElastic(t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},

	easeInOutElastic: function easeInOutElastic(t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d / 2) == 2) return b + c;if (!p) p = d * (.3 * 1.5);
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	},

	easeInBack: function easeInBack(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},

	easeOutBack: function easeOutBack(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},

	easeInOutBack: function easeInOutBack(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
	},

	// easeInBounce: function(t, b, c, d) {
	//     return c - easeOutBounce(d-t, 0, c, d) + b;
	// },

	easeOutBounce: function easeOutBounce(t, b, c, d) {
		if ((t /= d) < 1 / 2.75) {
			return c * (7.5625 * t * t) + b;
		} else if (t < 2 / 2.75) {
			return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
		} else if (t < 2.5 / 2.75) {
			return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
		} else {
			return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
		}
	}

	// easeInOutBounce: function(t, b, c, d) {
	//     if (t < d/2) return this.easeInBounce(t*2, 0, c, d) * .5 + b;
	//     return this.easeOutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;
	// }
};

easingEquations.easeInBounce = function (t, b, c, d) {
	return c - easingEquations.easeOutBounce(d - t, 0, c, d) + b;
}, easingEquations.easeInOutBounce = function (t, b, c, d) {
	if (t < d / 2) return easingEquations.easeInBounce(t * 2, 0, c, d) * .5 + b;
	return easingEquations.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
};

module.exports.easingEquations = easingEquations;
},{}],13:[function(require,module,exports){
var EmitterStoreFn = function EmitterStoreFn() {};

EmitterStoreFn.prototype.update = function (store) {
  var i = store.length - 1;
  for (; i >= 0; i--) {
    store[i].updateEmitter();
    // store[i].renderEmitter( ctx );
  }
};

module.exports.EmitterStoreFn = EmitterStoreFn;
},{}],14:[function(require,module,exports){
// emission theme

var baseEmitterTheme = {

	emitter: {

		active: 0,

		// position
		x: 0,
		y: 0,
		xVel: 0,
		yVel: 0,
		applyGlobalForces: false
	},

	// emission rate config (per cycle ( frame ) )
	emission: {

		rate: {
			min: 0,
			max: 0,

			decay: {
				rate: 0,
				decayMax: 0
			}
		},

		// emission repeater config
		repeater: {
			// what is the repetition rate ( frames )
			rate: 0,
			// does the repetition rate decay ( get longer )? how much longer? 
			decay: {
				rate: 0,
				decayMax: 0
			}
		},

		// initial direction of particles
		direction: {
			rad: 0, // in radians (0 - 2)
			min: 0, // low bounds (radians)
			max: 0 // high bounds (radians)
		},

		// are particles offset from inital x/y
		radialDisplacement: 0,
		// is the offset feathered?
		radialDisplacementOffset: 0,

		//initial velocity of particles
		impulse: {
			pow: 0,
			min: 0,
			max: 0
		}
	}

};

module.exports.baseEmitterTheme = baseEmitterTheme;
},{}],15:[function(require,module,exports){
// emission theme

var flameStreamTheme = {

	emitter: {

		active: 1,

		// position
		x: 0,
		y: 0,
		xVel: 0,
		yVel: 0,
		applyGlobalForces: false
	},

	// emission rate config (per cycle ( frame ) )
	emission: {

		rate: {
			min: 10,
			max: 20,

			decay: {
				rate: 0,
				decayMax: 0
			}
		},

		// emission repeater config
		repeater: {
			// what is the repetition rate ( frames )
			rate: 1,
			// does the repetition rate decay ( get longer )? how much longer? 
			decay: {
				rate: 0,
				decayMax: 300
			}
		},

		// initial direction of particles
		direction: {
			rad: 0, // in radians (0 - 2)
			min: 1.45, // low bounds (radians)
			max: 1.55 // high bounds (radians)
		},

		// are particles offset from inital x/y
		radialDisplacement: 0,
		// is the offset feathered?
		radialDisplacementOffset: 0,

		//initial velocity of particles
		impulse: {
			pow: 0,
			min: 8,
			max: 15
		}
	}

};

module.exports.flameStreamTheme = flameStreamTheme;
},{}],16:[function(require,module,exports){
// emission theme

var singleBurstTheme = {

	emitter: {

		active: 1,

		// position
		x: 0,
		y: 0,
		xVel: 0,
		yVel: 0,
		applyGlobalForces: false
	},

	// emission rate config (per cycle ( frame ) )
	emission: {

		rate: {
			min: 30,
			max: 100,

			decay: {
				rate: 5,
				decayMax: 0
			}
		},

		// emission repeater config
		repeater: {
			// what is the repetition rate ( frames )
			rate: 0,
			// does the repetition rate decay ( get longer )? how much longer? 
			decay: {
				rate: 0,
				decayMax: 300
			}
		},

		// initial direction of particles
		direction: {
			rad: 0, // in radians (0 - 2)
			min: 0, // low bounds (radians)
			max: 2 // high bounds (radians)
		},

		// are particles offset from inital x/y
		radialDisplacement: 20,
		// is the offset feathered?
		radialDisplacementOffset: 0,

		//initial velocity of particles
		impulse: {
			pow: 0,
			min: 50,
			max: 80
		}
	}

};

module.exports.singleBurstTheme = singleBurstTheme;
},{}],17:[function(require,module,exports){
// emission theme

var smokeStreamTheme = {

	emitter: {

		active: 0,

		// position
		x: 0,
		y: 0,
		xVel: 0,
		yVel: 0,
		applyGlobalForces: false
	},

	// emission rate config (per cycle ( frame ) )
	emission: {

		rate: {
			min: 5,
			max: 10,

			decay: {
				rate: 0,
				decayMax: 0
			}
		},

		// emission repeater config
		repeater: {
			// what is the repetition rate ( frames )
			rate: 0,
			// does the repetition rate decay ( get longer )? how much longer? 
			decay: {
				rate: 0,
				decayMax: 0
			}
		},

		// initial direction of particles
		direction: {
			rad: 0, // in radians (0 - 2)
			min: 1.49, // low bounds (radians)
			max: 1.51 // high bounds (radians)
		},

		// are particles offset from inital x/y
		radialDisplacement: 0,
		// is the offset feathered?
		radialDisplacementOffset: 0,

		//initial velocity of particles
		impulse: {
			pow: 0,
			min: 5,
			max: 10
		}
	}

};

module.exports.smokeStreamTheme = smokeStreamTheme;
},{}],18:[function(require,module,exports){
// emission theme

  var warpStreamTheme = {

    emitter: {

      active: 1,

      // position
      x: 0,
      y: 0,
      xVel: 0,
      yVel: 0,
      applyGlobalForces: false
    },

    // emission rate config (per cycle ( frame ) )
    emission: {

      rate: {
        min: 10,
        max: 20,

        decay: {
          rate: 0,
          decayMax: 0
        }
      },

      // emission repeater config
      repeater: {
        // what is the repetition rate ( frames )
        rate: 5,
        // does the repetition rate decay ( get longer )? how much longer? 
        decay: {
          rate: 0,
          decayMax: 300
        }
      },

      // initial direction of particles
      direction: {
        rad: 0, // in radians (0 - 2)
        min: 0, // low bounds (radians)
        max: 2 // high bounds (radians)
      },

      // are particles offset from inital x/y
      radialDisplacement: 100,
      // is the offset feathered?
      radialDisplacementOffset: 0,

      //initial velocity of particles
      impulse: {
        pow: 0,
        min: 0.25,
        max: 1.25
      }
    }

  };

  module.exports.warpStreamTheme = warpStreamTheme;
},{}],19:[function(require,module,exports){
require( './particles.js' );
},{"./particles.js":40}],20:[function(require,module,exports){
var environment = {

		runtimeEngine: {

				startAnimation: function startAnimation(animVar, loopFn) {
						if (!animVar) {
								animVar = window.requestAnimationFrame(loopFn);
						}
				},

				stopAnimation: function stopAnimation(animVar) {
						if (animVar) {
								window.cancelAnimationFrame(animVar);
								animVar = undefined;
						}
				}

		},

		canvas: {
				// buffer clear fN
				checkClearBufferRegion: function checkClearBufferRegion(particle, canvasConfig) {

						var bufferClearRegion = canvasConfig.bufferClearRegion;

						var entityWidth = particle.r / 2;
						var entityHeight = particle.r / 2;

						if (particle.x - entityWidth < bufferClearRegion.x) {
								bufferClearRegion.x = particle.x - entityWidth;
						}

						if (particle.x + entityWidth > bufferClearRegion.x + bufferClearRegion.w) {
								bufferClearRegion.w = particle.x + entityWidth - bufferClearRegion.x;
						}

						if (particle.y - entityHeight < bufferClearRegion.y) {
								bufferClearRegion.y = particle.y - entityHeight;
						}

						if (particle.y + entityHeight > bufferClearRegion.y + bufferClearRegion.h) {
								bufferClearRegion.h = particle.y + entityHeight - bufferClearRegion.y;
						}
				},

				resetBufferClearRegion: function resetBufferClearRegion(canvasConfig) {

						var bufferClearRegion = canvasConfig.bufferClearRegion;

						bufferClearRegion.x = canvasConfig.centerH;
						bufferClearRegion.y = canvasConfig.centerV;
						bufferClearRegion.w = canvasConfig.width;
						bufferClearRegion.h = canvasConfig.height;
				}
		},

		forces: {
				friction: 0.01,
				bouyancy: 1,
				gravity: 0,
				wind: 1,
				turbulence: { min: -5, max: 5 }
		}

};

module.exports.environment = environment;
},{}],21:[function(require,module,exports){
/**
* provides maths util methods.
*
* @mixin
*/

var mathUtils = {
	/**
 * @description Generate random integer between 2 values.
 * @param {number} min - minimum value.
 * @param {number} max - maximum value.
 * @returns {number} result.
 */
	randomInteger: function randomInteger(min, max) {
		return Math.floor(Math.random() * (max + 1 - min)) + min;
	},

	/**
 * @description Generate random float between 2 values.
 * @param {number} min - minimum value.
 * @param {number} max - maximum value.
 * @returns {number} result.
 */
	random: function random(min, max) {
		if (min === undefined) {
			min = 0;
			max = 1;
		} else if (max === undefined) {
			max = min;
			min = 0;
		}
		return Math.random() * (max - min) + min;
	},

	getRandomArbitrary: function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	},
	/**
 * @description Transforms value proportionately between input range and output range.
 * @param {number} value - the value in the origin range ( min1/max1 ).
 * @param {number} min1 - minimum value in origin range.
 * @param {number} max1 - maximum value in origin range.
 * @param {number} min2 - minimum value in destination range.
 * @param {number} max2 - maximum value in destination range.
 * @param {number} clampResult - clamp result between destination range boundarys.
 * @returns {number} result.
 */
	map: function map(value, min1, max1, min2, max2, clampResult) {
		var self = this;
		var returnvalue = (value - min1) / (max1 - min1) * (max2 - min2) + min2;
		if (clampResult) return self.clamp(returnvalue, min2, max2);else return returnvalue;
	},

	/**
 * @description Clamp value between range values.
 * @param {number} value - the value in the range { min|max }.
 * @param {number} min - minimum value in the range.
 * @param {number} max - maximum value in the range.
 * @param {number} clampResult - clamp result between range boundarys.
 */
	clamp: function clamp(value, min, max) {
		if (max < min) {
			var temp = min;
			min = max;
			max = temp;
		}
		return Math.max(min, Math.min(value, max));
	}
};

module.exports.mathUtils = mathUtils;
},{}],22:[function(require,module,exports){
var renderParticleArr = require('./particleFunctions/renderParticleArr.js').renderParticleArr;
var updateParticleArr = require('./particleFunctions/updateParticleArr.js').updateParticleArr;

var particleArrFn = {

	renderParticleArr: renderParticleArr,
	updateParticleArr: updateParticleArr

};

module.exports.particleArrFn = particleArrFn;
},{"./particleFunctions/renderParticleArr.js":27,"./particleFunctions/updateParticleArr.js":29}],23:[function(require,module,exports){
var checkParticleKillConditions = require('./particleFunctions/checkParticleKillConditions.js').checkParticleKillConditions;
var createPerParticleAttributes = require('./particleFunctions/createPerParticleAttributes.js').createPerParticleAttributes;
var updateParticle = require('./particleFunctions/updateParticle.js').updateParticle;
var killParticle = require('./particleFunctions/killParticle.js').killParticle;

var particleFn = {

	checkParticleKillConditions: checkParticleKillConditions,
	createPerParticleAttributes: createPerParticleAttributes,
	updateParticle: updateParticle,
	killParticle: killParticle

};

module.exports.particleFn = particleFn;
},{"./particleFunctions/checkParticleKillConditions.js":24,"./particleFunctions/createPerParticleAttributes.js":25,"./particleFunctions/killParticle.js":26,"./particleFunctions/updateParticle.js":28}],24:[function(require,module,exports){
var checkParticleKillConditions = function checkParticleKillConditions(p, canW, canH) {
    // check on particle kill conditions
    // seems complicated ( nested IFs ) but tries to stop check
    // without having to make all the checks if a condition is hit
    var k = p.killConditions;
    var kCol = k.colorCheck;
    var kAttr = k.perAttribute;
    var kBO = k.boundaryOffset;

    if (kCol.length > 0) {
        for (var i = kCol.length - 1; i >= 0; i--) {
            var thisCheckItem = kCol[i];
            if (p.color4Data[thisCheckItem.name] <= thisCheckItem.value) {
                return true;
            }
        }
    }

    if (kAttr.length > 0) {
        for (var i = kAttr.length - 1; i >= 0; i--) {
            var thisCheckItem = kAttr[i];
            if (p[thisCheckItem.name] <= thisCheckItem.value) {
                return true;
            }
        }
    }

    if (k.boundaryCheck === true) {
        // store p.r and give buffer ( * 4 ) to accomodate possible warping
        var pRad = p.r * 4;
        if (p.x - pRad < 0 - kBO) {
            return true;
        } else {
            if (p.x + pRad > canW + kBO) {
                return true;
            } else {
                if (p.y - pRad < 0 - kBO) {
                    return true;
                } else {
                    if (p.y + pRad > canH + kBO) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
};

module.exports.checkParticleKillConditions = checkParticleKillConditions;
},{}],25:[function(require,module,exports){
var trig = require('./../trigonomicUtils.js').trigonomicUtils;
var mathUtils = require('./../mathUtils.js').mathUtils;
var getValue = require('./../utilities.js').getValue;

var createPerParticleAttributes = function createPerParticleAttributes(x, y, emissionOpts, perParticleOpts) {
    // let themed = perParticleOpts.theme || themes.reset;

    var themed = perParticleOpts || themes.reset;
    var emitThemed = emissionOpts || false;
    var life = mathUtils.randomInteger(themed.life.min, themed.life.max);
    // use bitwise to check for odd/even life vals. Make even to help with anims that are fraction of life (frames)
    life & 1 ? life++ : false;

    var emission = emitThemed.emission || emitThemed;

    var direction = emission.direction.rad > 0 ? emission.direction.rad : mathUtils.getRandomArbitrary(emission.direction.min, emission.direction.max) * Math.PI;

    // set new particle origin dependant on the radial displacement
    if (emission.radialDisplacement > 0) {
        var newCoords = trig.radialDistribution(x, y, emission.radialDisplacement + mathUtils.random(emission.radialDisplacementOffset * -1, emission.radialDisplacementOffset), direction);

        x = newCoords.x;
        y = newCoords.y;
    }

    var impulse = emission.impulse.pow > 0 ? emission.impulse.pow : mathUtils.random(emission.impulse.min, emission.impulse.max);

    var initR = mathUtils.random(themed.radius.min, themed.radius.max);
    var targetRadius = mathUtils.random(themed.targetRadius.min, themed.targetRadius.max);
    var acceleration = mathUtils.random(themed.velAcceleration.min, themed.velAcceleration.max);
    var velocities = trig.calculateVelocities(x, y, direction, impulse);

    var initColor = themed.colorProfiles[0];
    var color4Data = {
        r: initColor.r,
        g: initColor.g,
        b: initColor.b,
        a: initColor.a
    };

    var willFlare = void 0;
    var willFlareTemp = mathUtils.randomInteger(0, 1000);

    var tempCustom = {
        lensFlare: {
            mightFlare: true,
            willFlare: themed.customAttributes.lensFlare.mightFlare === true && willFlareTemp < 1 ? true : false,
            angle: 0.30
        }

        // let customAttributes = themed.customAttributes;


    };

    var ppa = {
        active: perParticleOpts.active || themed.active || 0,
        initR: initR,
        tR: targetRadius,
        lifeSpan: life,
        angle: direction,
        magnitude: impulse,
        relativeMagnitude: impulse,
        magnitudeDecay: themed.magDecay,
        x: x,
        y: y,
        xVel: velocities.xVel,
        yVel: velocities.yVel,
        vAcc: acceleration,
        applyForces: themed.applyGlobalForces,
        color4Data: {
            r: color4Data.r, g: color4Data.g, b: color4Data.b, a: color4Data.a
        },
        colorProfiles: themed.colorProfiles,

        // color4Change: color4Change,
        killConditions: themed.killConditions,
        customAttributes: tempCustom,
        // renderFN: themed.renderParticle || renderParticle,
        renderFN: themed.renderParticle,
        events: themed.events
    };
    
    // console.log( 'color4DataEnd: ', color4DataEnd );
    var animArr = [];
    var particleAnimTrackArr = themed.animationTracks;
    var splChrs = '.';
    // console.log( 'themed.animationTracks: ', themed.animationTracks );
    if (particleAnimTrackArr && particleAnimTrackArr.length) {
        var particleAnimTrackArrLen = particleAnimTrackArr.length;
        for (var i = particleAnimTrackArrLen - 1; i >= 0; i--) {

            var t = particleAnimTrackArr[i];
            // console.log( 't: ', t );

            var prm = t.param.split(splChrs);
            var prmTemp = { path: prm, pathLen: prm.length };

            var baseVal = getValue(t.baseAmount, ppa);

            var targetVal = void 0;
            if (t.targetValuePath) {

                if (getValue(t.targetValuePath, ppa) === 0) {
                    targetVal = baseVal * -1;
                } else {
                    targetVal = getValue(t.targetValuePath, ppa) - baseVal;
                }
            } else if (t.targetAmount) {
                targetVal = t.targetAmount;
            }

            var duration = void 0;
            t.duration === 'life' ? duration = life : t.duration < 1 ? duration = life * t.duration : t.duration > 1 ? duration = life : false;

            animArr.push({ animName: t.animName, active: t.active, param: prmTemp, baseAmount: baseVal, targetAmount: targetVal, duration: duration, easing: t.easing, linkedAnim: t.linkedAnim, linkedEvent: t.linkedEvent });
        }
    }

    ppa.animationTracks = animArr;

    return ppa;
};

module.exports.createPerParticleAttributes = createPerParticleAttributes;
},{"./../mathUtils.js":21,"./../trigonomicUtils.js":41,"./../utilities.js":42}],26:[function(require,module,exports){
var killParticle = function killParticle(list, index, entityCounter) {
    var self = this;
    self.isAlive = 0;
    list.insert(index);
    entityCounter.subtract(1);
};

module.exports.killParticle = killParticle;
},{}],27:[function(require,module,exports){
var renderParticleArr = function renderParticleArr(context, arr, animation) {
    var thisArr = arr;
    var arrLen = thisArr.length;

    var rendered = 0;
    var notRendered = 0;
    // console.log( 'rendering loop' );

    for (var i = arrLen - 1; i >= 0; i--) {
        var p = thisArr[i];
        p.isAlive != 0 ? (p.render(p.x, p.y, p.r, p.color4Data, context), rendered++) : notRendered++;
    }
    // console.log( 'rendered: '+rendered+' notRendered: '+notRendered );
    // notRendered === arrLen ?
    // ( console.log( 'notRendered === 0: stop anim' ), animation.state = false ) : 0;
    notRendered === arrLen ? animation.state = false : 0;
};

module.exports.renderParticleArr = renderParticleArr;
},{}],28:[function(require,module,exports){
var easing = require('./../easing.js').easingEquations;
var environment = require('./../environment.js').environment;
var physics = environment.forces;

var updateParticle = function updateParticle(emitterArr) {
    var p = this;
    var totalLifeTicks = p.lifeSpan;

    // position
    // p.x += p.xVel * p.magnitudeDecay;
    // p.y += p.yVel * p.magnitudeDecay;
    p.x += p.xVel;
    p.y += p.yVel;

    p.xVel *= p.vAcc;
    p.yVel *= p.vAcc;

    // p.yVel += physics.gravity;
    // p.xVel += physics.wind;
    // p.relativeMagnitude *= p.magnitudeDecay;

    p.relativeMagnitude *= p.vAcc * 1.005;

    if (p.applyForces) {
        p.yVel += physics.gravity;
    }
    // speed
    // p.magnitudeDecay > 0 ? p.magnitudeDecay -= physics.friction : p.magnitudeDecay = 0;

    // p.magnitudeDecay += (p.vAcc * 0.00025);
    // p.magnitudeDecay = deccelerateMagnitude( p );
    // p.magnitudeDecay = accelerateMagnitude( p );

    // life
    p.currLifeInv = totalLifeTicks - p.currLife;
    var currLifeTick = p.currLifeInv;
    // size (radius for circle)


    var animTracks = p.animationTracks;
    var animTracksLen = animTracks.length;

    for (var i = animTracksLen - 1; i >= 0; i--) {
        // console.log( 'i', i );
        var t = animTracks[i];

        if (t.active === true) {

            var paramPath = t.param.path,
                paramLen = t.param.pathLen;

            paramLen === 1 ? p[paramPath[0]] = easing[t.easing](currLifeTick, t.baseAmount, t.targetAmount, t.duration) : paramLen === 2 ? p[paramPath[0]][paramPath[1]] = easing[t.easing](currLifeTick, t.baseAmount, t.targetAmount, t.duration) : paramLen === 3 ? p[paramPath[0]][paramPath[1]][paramPath[2]] = easing[t.easing](currLifeTick, t.baseAmount, t.targetAmount, t.duration) : false;

            if (currLifeTick === t.duration) {
                t.active = false;

                if (t.linkedEvent !== false && typeof t.linkedEvent !== 'undefined') {

                    var particleEvents = p.events;

                    for (var i = particleEvents.length - 1; i >= 0; i--) {

                        var thisParticleEvent = p.events[i];
                        if (thisParticleEvent.eventType = t.linkedEvent) {
                            if (t.linkedEvent === 'emit') {

                                var thisParticleEventParams = thisParticleEvent.eventParams;

                                if (typeof thisParticleEventParams.emitter !== 'undefined') {
                                    thisParticleEventParams.emitter.triggerEmitter({ x: p.x, y: p.y });
                                } else {
                                    for (var j = emitterArr.length - 1; j >= 0; j--) {
                                        if (emitterArr[j].name === thisParticleEventParams.emitterName) {
                                            thisParticleEventParams.emitter = emitterArr[j];
                                            thisParticleEventParams.emitter.triggerEmitter({ x: p.x, y: p.y });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (p.idx == 9987) {
                    // console.warn( 'flipping anim' );
                }

                if (t.linkedAnim !== false) {

                    for (var j = animTracksLen - 1; j >= 0; j--) {
                        if (animTracks[j].animName === t.linkedAnim) {
                            animTracks[j].active = true;
                        }
                    }
                }
            }
        }
    }

    if (p.idx == 9987) {}
    // console.log( 'thisParticleAlpha',  p.color4Data.a );


    // life taketh away
    p.currLife--;
};

module.exports.updateParticle = updateParticle;
},{"./../easing.js":12,"./../environment.js":20}],29:[function(require,module,exports){
var particleFn = require('./../particleFn.js').particleFn;

var updateParticleArr = function updateParticleArr(context, storeArr, poolArr, animation, canvasConfig, entityCounter, emitterStore) {
    // loop housekeeping
    var arr = storeArr;
    var arrLen = arr.length - 1;
    for (var i = arrLen; i >= 0; i--) {
        var p = arr[i];
        p.isAlive != 0 ? particleFn.checkParticleKillConditions(p, canvasConfig.width, canvasConfig.height) ? p.kill(poolArr, p.idx, entityCounter) : p.update(emitterStore) : false;
    } // end For loop
    // liveEntityCount === 0 ? ( console.log( 'liveEntityCount === 0 stop anim' ), animation.state = false ) : 0;
};

module.exports.updateParticleArr = updateParticleArr;
},{"./../particleFn.js":23}],30:[function(require,module,exports){
var fireTheme = require('./themes/fire/theme.js').fireTheme;
var resetTheme = require('./themes/reset/resetTheme.js').resetTheme;
var warpStarTheme = require('./themes/warpStar/warpStarTheme.js').warpStarTheme;
var flameTheme = require('./themes/flame/flameTheme.js').flameTheme;
var smokeTheme = require('./themes/smoke/smokeTheme.js').smokeTheme;

var themes = {
   reset: resetTheme,
   fire: fireTheme,
   warpStar: warpStarTheme,
   flame: flameTheme,
   smoke: smokeTheme
};

module.exports.themes = themes;
},{"./themes/fire/theme.js":35,"./themes/flame/flameTheme.js":36,"./themes/reset/resetTheme.js":37,"./themes/smoke/smokeTheme.js":38,"./themes/warpStar/warpStarTheme.js":39}],31:[function(require,module,exports){
var animationTracks = [
	{
		  animName: 'radiusFade',
		  active: true,
		  param: 'r',
		  baseAmount: 'initR',
		  targetValuePath: 'tR',
		  // targetAmount: 0.00002,
		  duration: 'life',
		  easing: 'easeInExpo',
		  linkedAnim: false
	},
	{
		  animName: 'color4DataChangeRed',
		  active: true,
		  param: 'color4Data.r',
		  baseAmount: 'colorProfiles[0].r',
		  targetValuePath: 'colorProfiles[1].r',
		  duration: 'life',
		  easing: 'easeInOutBounce',
		  linkedAnim: false
	},
	{
		  animName: 'color4DataChangeGreen',
		  active: true,
		  param: 'color4Data.g',
		  baseAmount: 'colorProfiles[0].g',
		  targetValuePath: 'colorProfiles[1].g',
		  duration: 'life',
		  easing: 'easeInOutBounce',
		  linkedAnim: false
	},
	{
		  animName: 'color4DataChangeBlue',
		  active: true,
		  param: 'color4Data.b',
		  baseAmount: 'colorProfiles[0].b',
		  targetValuePath: 'colorProfiles[1].b',
		  duration: 'life',
		  easing: 'easeOutExpo',
		  linkedAnim: false
	},
	{
		  animName: 'color4DataChangeAlpha',
		  active: true,
		  param: 'color4Data.a',
		  baseAmount: 'colorProfiles[0].a',
		  targetValuePath: 'colorProfiles[3].a',
		  duration: 'life',
		  easing: 'easeInQuint',
		  linkedAnim: false
	}
];

module.exports.animationTracks = animationTracks;
},{}],32:[function(require,module,exports){
var customAttributes = {
    lensFlare: {
        mightFlare: true,
        willFlare: false,
        angle: 0.30
    }
};

module.exports.customAttributes = customAttributes;
},{}],33:[function(require,module,exports){
var killConditions = {
    boundaryCheck: true,
    boundaryOffset: 0,
    colorCheck: [{ name: 'a', value: 0 }],
    perAttribute: [{ name: 'radius', value: 0 }, { name: 'currLife', value: 0 }]
};

module.exports.killConditions = killConditions;
},{}],34:[function(require,module,exports){
// utilities
var mathUtils = require('./../../../mathUtils.js').mathUtils;
var trig = require('./../../../trigonomicUtils.js').trigonomicUtils;

var renderFn = function renderFn(x, y, r, colorData, context) {
    var p = this;
    // console.log( 'p.render: ', p );
    var newAngle = trig.getAngleAndDistance(x, y, x + p.xVel, y + p.yVel);
    var compiledColor = "rgba(" + colorData.r + ',' + colorData.g + ',' + colorData.b + "," + colorData.a + ")";
    var endColor = "rgba(" + colorData.r + ',' + colorData.g + ',' + colorData.b + ", 0)";
    context.fillStyle = compiledColor;
    var stretchVal = mathUtils.map(p.relativeMagnitude, 0, 100, 1, 10);

    context.save();
    context.translate(x, y);
    // context.rotate( p.angle );
    context.rotate(newAngle.angle);
    context.fillEllipse(0, 0, r * stretchVal, r, context);
    context.restore();
};

module.exports.renderFn = renderFn;
},{"./../../../mathUtils.js":21,"./../../../trigonomicUtils.js":41}],35:[function(require,module,exports){
// utilities
var mathUtils = require('./../../../mathUtils.js').mathUtils;

// theme partials
var animationTracks = require('./animationTracks.js').animationTracks;
var killConditions = require('./killConditions.js').killConditions;
var customAttributes = require('./customAttributes.js').customAttributes;
var renderFn = require('./renderFn.js').renderFn;

var fireTheme = {
    contextBlendingMode: 'lighter',
    active: 1,
    life: { min: 20, max: 100 },
    angle: { min: 0, max: 2 },
    magDecay: 1,
    // velAcceleration: 0.9,
    velAcceleration: { min: 0.7, max: 0.85 },
    radius: { min: 0.5, max: 20 },
    targetRadius: { min: 0, max: 0 },
    applyGlobalForces: true,
    colorProfiles: [{ r: 255, g: 255, b: 255, a: 1 }, { r: 215, g: 0, b: 0, a: 0 }, { r: 0, g: 215, b: 0, a: 0 }, { r: 0, g: 0, b: 215, a: 0 }],
    renderProfiles: [{ shape: 'Circle', colorProfileIdx: 0 }],
    customAttributes: customAttributes,
    animationTracks: animationTracks,
    killConditions: killConditions,
    renderParticle: renderFn
};

module.exports.fireTheme = fireTheme;
},{"./../../../mathUtils.js":21,"./animationTracks.js":31,"./customAttributes.js":32,"./killConditions.js":33,"./renderFn.js":34}],36:[function(require,module,exports){
var mathUtils = require('./../../../mathUtils.js').mathUtils;
var coloring = require('./../../../colorUtils.js').colorUtils;
var trig = require('./../../../trigonomicUtils.js').trigonomicUtils;

var rgba = coloring.rgba;

var flameTheme = {
    contextBlendingMode: 'lighter',
    active: 1,
    life: { min: 20, max: 40 },
    angle: { min: 1.45, max: 1.55 },
    // mag: { min: 8, max: 13 },
    // velAcceleration: 1.05,
    velAcceleration: { min: 1, max: 1 },
    magDecay: 1.5,
    radius: { min: 70, max: 130 },
    targetRadius: { min: 1, max: 2 },
    applyGlobalForces: false,
    colorProfiles: [{ r: 255, g: 255, b: 255, a: 0.5 }, { r: 255, g: 0, b: 0, a: 1 }],
    renderProfiles: [{ shapeFn: 'fillCircle', colorProfileIdx: 0 }],
    customAttributes: {
        lensFlare: {
            mightFlare: true,
            willFlare: false,
            angle: 0.30
        }
    },
    proximity: {
        check: false,
        threshold: 50
    },
    animationTracks: [{
        animName: 'radiusFade',
        active: true,
        param: 'r',
        baseAmount: 'initR',
        targetValuePath: 'tR',
        duration: 'life',
        easing: 'easeInExpo',
        linkedAnim: false
    }, {
        animName: 'color4DataChangeGreen',
        active: true,
        param: 'color4Data.g',
        baseAmount: 'colorProfiles[0].g',
        targetValuePath: 'colorProfiles[1].g',
        duration: 0.4,
        easing: 'easeInQuart',
        linkedAnim: false
    }, {
        animName: 'color4DataChangeBlue',
        active: true,
        param: 'color4Data.b',
        baseAmount: 'colorProfiles[0].b',
        targetValuePath: 'colorProfiles[1].b',
        duration: 0.5,
        easing: 'easeOutQuart',
        linkedAnim: false
    }, {
        animName: 'alphaDelay',
        active: true,
        param: 'color4Data.a',
        baseAmount: 'colorProfiles[0].a',
        targetValuePath: 'colorProfiles[0].a',
        duration: 0.5,
        easing: 'linearEase',
        linkedAnim: 'alphaFadeIn'
    }, {
        animName: 'alphaFadeIn',
        active: true,
        param: 'color4Data.a',
        baseAmount: 'colorProfiles[0].a',
        targetValuePath: 'colorProfiles[1].a',
        duration: 0.2,
        easing: 'easeInQuint',
        linkedAnim: 'alphaFadeOut'
    }, {
        animName: 'alphaFadeOut',
        active: false,
        param: 'color4Data.a',
        baseAmount: 'colorProfiles[1].a',
        targetValuePath: 'colorProfiles[0].a',
        duration: 0.3,
        easing: 'linearEase',
        linkedAnim: false,
        linkedEvent: 'emit'
    }],

    events: [{
        eventType: 'emit',
        eventParams: {
            emitterName: 'smokeEmitter'
        }
    }],

    killConditions: {
        boundaryCheck: true,
        boundaryOffset: 0,
        colorCheck: [],
        perAttribute: [{ name: 'radius', value: 0 }, { name: 'currLife', value: 0 }],
        linkedEvent: false
    },
    renderParticle: function renderParticle(x, y, r, colorData, context) {
        var p = this;
        var stretchVal = mathUtils.map(p.currLifeInv, 0, p.lifeSpan, 1, 5);
        var offsetMap = mathUtils.map(p.currLifeInv, 0, p.lifeSpan, 0, 1);
        var newAngle = trig.getAngleAndDistance(x, y, x + p.xVel, y + p.yVel);
        if (context.globalCompositeOperation !== 'lighter') {
            context.globalCompositeOperation = 'lighter';
        }
        context.save();
        context.translate(x, y);
        // context.save();
        var alpha = colorData.a;
        if (alpha > 1) {
            alpha = 1;
        }
        var offset = r * offsetMap;
        // // var offset = 0;
        var grd = context.createRadialGradient(0, 0 + offset, 0, 0, 0 + offset, r);
        // var grd = context.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, rgba(colorData.r, colorData.g, colorData.b, 0.03 * alpha));
        grd.addColorStop(0.5, rgba(colorData.r, colorData.g, colorData.b, 0.06 * alpha));
        grd.addColorStop(0.7, rgba(colorData.r, colorData.g, colorData.b, 0.065 * alpha));
        grd.addColorStop(0.85, rgba(colorData.r, colorData.g, colorData.b, 0.015 * alpha));
        grd.addColorStop(1, rgba(colorData.r, colorData.g, colorData.b, 0));
        context.fillStyle = grd;

        context.rotate(newAngle.angle);
        context.fillEllipse(0, 0, r * stretchVal, r, context);
        context.restore();
    }
};

module.exports.flameTheme = flameTheme;
},{"./../../../colorUtils.js":9,"./../../../mathUtils.js":21,"./../../../trigonomicUtils.js":41}],37:[function(require,module,exports){
var mathUtils = require('./../../../mathUtils.js').mathUtils;

var resetTheme = {
    emmisionRate: { min: 0, max: 0 },
    contextBlendingMode: 'source-over',
    active: 0,
    life: { min: 0, max: 0 },
    angle: { min: 0, max: 0 },
    mag: { min: 0, max: 0 },
    magDecay: 0,
    // velAcceleration: 1, // 0 - 1 (i.e. 0.5) = decceleration, 1+ (i.e. 1.2) = acceleration
    velAcceleration: { min: 1, max: 1 },
    radius: { min: 0, max: 0 },
    targetRadius: { min: 0, max: 0 },
    shrinkRate: 0,
    radialDisplacement: 0,
    radialDisplacementOffset: 0,
    applyGlobalForces: false,
    colorProfiles: [{ r: 0, g: 0, b: 0, a: 0 }],
    renderProfiles: [{ shape: 'Circle', colorProfileIdx: 0 }],
    colorStart: {
        r: 0,
        g: 0,
        b: 0,
        a: 0
    },
    colorEnd: {
        r: 0,
        g: 0,
        b: 0,
        a: 0
    },
    customAttributes: {
        lensFlare: {
            mightFlare: true,
            willFlare: false,
            angle: 0.30
        }
    },
    colorAnimationConfig: {
        easing: {
            r: 'linearEase',
            g: 'linearEase',
            b: 'linearEase',
            a: 'linearEase'
        }
    },
    animationTracks: [],
    killConditions: {
        boundaryCheck: false,
        colorCheck: [],
        perAttribute: []
    },
    renderParticle: false
};

module.exports.resetTheme = resetTheme;
},{"./../../../mathUtils.js":21}],38:[function(require,module,exports){
var mathUtils = require('./../../../mathUtils.js').mathUtils;
var coloring = require('./../../../colorUtils.js').colorUtils;
var rgba = coloring.rgba;

var smokeTheme = {
    contextBlendingMode: 'source-over',
    active: 1,
    life: { min: 400, max: 500 },
    angle: { min: 1.45, max: 1.55 },
    // velAcceleration: 1.05,
    velAcceleration: { min: 0.999, max: 0.9999 },
    // magDecay: 1.5,
    radius: { min: 30, max: 50 },
    targetRadius: { min: 70, max: 130 },
    applyGlobalForces: false,
    colorProfiles: [{ r: 100, g: 100, b: 100, a: 0 }, { r: 0, g: 0, b: 0, a: 0.05 }, { r: 100, g: 100, b: 100, a: 0 }],
    renderProfiles: [{ shapeFn: 'fillCircle', colorProfileIdx: 0 }],
    customAttributes: {
        lensFlare: {
            mightFlare: true,
            willFlare: false,
            angle: 0.30
        }
    },
    proximity: {
        check: false,
        threshold: 50
    },
    animationTracks: [{
        animName: 'radiusGrow',
        active: true,
        param: 'r',
        baseAmount: 'initR',
        targetValuePath: 'tR',
        duration: 'life',
        easing: 'linearEase',
        linkedAnim: false
    }, {
        animName: 'alphaFadeIn',
        active: true,
        param: 'color4Data.a',
        baseAmount: 'colorProfiles[0].a',
        targetValuePath: 'colorProfiles[1].a',
        duration: 0.1,
        easing: 'easeOutQuint',
        linkedAnim: false
    }, {
        animName: 'red',
        active: true,
        param: 'color4Data.r',
        baseAmount: 'colorProfiles[0].r',
        targetValuePath: 'colorProfiles[1].r',
        duration: 0.2,
        easing: 'linearEase',
        linkedAnim: false
    }, {
        animName: 'green',
        active: true,
        param: 'color4Data.g',
        baseAmount: 'colorProfiles[0].g',
        targetValuePath: 'colorProfiles[1].g',
        duration: 0.2,
        easing: 'linearEase',
        linkedAnim: false
    }, {
        animName: 'blue',
        active: true,
        param: 'color4Data.b',
        baseAmount: 'colorProfiles[0].b',
        targetValuePath: 'colorProfiles[1].b',
        duration: 0.2,
        easing: 'linearEase',
        linkedAnim: false
    }],
    killConditions: {
        boundaryCheck: true,
        boundaryOffset: 200,
        colorCheck: [],
        perAttribute: false
    },
    renderParticle: function renderParticle(x, y, r, colorData, context) {
        var p = this;
        // console.log( 'rendering smoke' );

        if (context.globalCompositeOperation !== 'source-over') {
            context.globalCompositeOperation = 'source-over';
        }

        var grd = context.createRadialGradient(x, y, 0, x, y, r);
        // var grd = context.createRadialGradient(x, y, 0, x, y, r);
        // grd.addColorStop(0, rgba( colorData.r,  colorData.g, colorData.b, 0.05) );
        // grd.addColorStop(1, rgba( colorData.r, colorData.g, colorData.b, 0) );
        grd.addColorStop(0, rgba(colorData.r, colorData.g, colorData.b, colorData.a));
        grd.addColorStop(1, rgba(colorData.r, colorData.g, colorData.b, 0));
        context.fillStyle = grd;
        context.fillCircle(x, y, r, context);
    }
};

module.exports.smokeTheme = smokeTheme;
},{"./../../../colorUtils.js":9,"./../../../mathUtils.js":21}],39:[function(require,module,exports){
var mathUtils = require('./../../../mathUtils.js').mathUtils;
var coloring = require('./../../../colorUtils.js').colorUtils;
var rgba = coloring.rgba;
let createWarpStarImage = require('./../../../createWarpStarImage.js');

let warpStarImage = createWarpStarImage();

var warpStarTheme = {
    contextBlendingMode: 'lighter',
    active: 1,
    life: { min: 50, max: 100 },
    angle: { min: 0, max: 2 },
    // velAcceleration: 1.05,
    velAcceleration: { min: 1.01, max: 1.2 },
    magDecay: 1,
    radius: { min: 0.5, max: 3 },
    targetRadius: { min: 4, max: 10 },
    applyGlobalForces: false,
    colorProfiles: [{ r: 255, g: 255, b: 255, a: 0 }, { r: 255, g: 255, b: 255, a: 1 }],
    renderProfiles: [{ shape: 'Circle', colorProfileIdx: 0 }, { shape: 'Circle', colorProfileIdx: 1 }, { shape: 'Circle', colorProfileIdx: 2 }],
    customAttributes: {
        lensFlare: {
            mightFlare: true,
            willFlare: false,
            angle: 1.50
        }
    },
    animationTracks: [{
        animName: 'radiusGrow',
        active: true,
        param: 'r',
        baseAmount: 'initR',
        targetValuePath: 'tR',
        duration: 'life',
        easing: 'linearEase',
        linkedAnim: false
    }, {
        animName: 'fadeIn',
        active: true,
        param: 'color4Data.a',
        baseAmount: 'colorProfiles[0].a',
        targetValuePath: 'colorProfiles[1].a',
        duration: 'life',
        easing: 'linearEase',
        linkedAnim: false
    }],
    killConditions: {
        boundaryCheck: true,
        boundaryOffset: 400,
        colorCheck: [],
        perAttribute: []
    },

    renderParticle: function renderParticle(x, y, r, colorData, context) {
        var p = this;

        function angle(originX, originY, targetX, targetY) {
            var dx = originX - targetX;
            var dy = originY - targetY;
            var theta = Math.atan2(-dy, -dx);
            return theta;
        }

        var stretchVal = mathUtils.map(p.relativeMagnitude, 0, 100, 1, 40);
        var chromeVal = mathUtils.map(stretchVal, 0, 10, 1, 4);
        
        // context.save();
        context.translate(x, y);
        context.rotate(p.angle);

        let renderProps = warpStarImage.renderProps;

        context.drawImage(
            warpStarImage,
            0, 0, renderProps.src.w, renderProps.src.h,
            -( ( r * stretchVal ) / 2 ), -( r / 2 ), r * stretchVal, r
        );


        // if (chromeVal < 1) {
        //     context.fillStyle = "rgba( 255, 255, 255, 1 )";
        //     context.fillEllipse(0, 0, r * stretchVal, r, context);
        // } else {
        //     // fake chromatic abberation ( rainbowing lens effect due to light refraction
        //     context.fillStyle = "rgba( 255, 0, 0, " + colorData.a + " )";
        //     context.fillEllipse(chromeVal * -1, 0, r * stretchVal, r, context);
        //     context.fillStyle = "rgba( 0, 255, 0, " + colorData.a + " )";
        //     context.fillEllipse(0, 0, r * stretchVal, r, context);
        //     context.fillStyle = "rgba( 0, 0, 255, " + colorData.a + " )";
        //     context.fillEllipse(0, chromeVal, r * stretchVal, r, context);
        // }

        context.rotate( -p.angle );
        context.translate( -x, -y );

        // context.restore();

        if (p.customAttributes.lensFlare.willFlare) {

            var flareAngle = angle(960, 469, x, y);
            var invertedFlareAngle = angle(x, y, 960, 469);

            context.save();
            context.translate(x, y);

            // light glare horizontal
            var opacity1 = p.color4Data.a * 0.15;
            var shineRand = mathUtils.randomInteger(5, 10);
            var shineGrd = context.createRadialGradient(0, 0, 0, 0, 0, 800);
            shineGrd.addColorStop(0, "rgba( 255,255, 255, " + opacity1 + " )");
            shineGrd.addColorStop(1, "rgba( 255, 255, 255, 0 )");
            context.scale(shineRand * opacity1, 0.005);
            context.fillStyle = shineGrd;

            context.fillCircle(0, 0, 800, context);
            context.scale(0.005, shineRand);
            context.fillCircle(0, 0, 800, context);
            context.save();
            context.rotate(1.5);
            context.fillCircle(0, 0, 800, context);
            context.restore();
            context.save();
            context.rotate(-1.5);
            context.fillCircle(0, 0, 800, context);
            context.restore();

            context.restore();

            // big flare
            var opacity2 = p.color4Data.a * 0.05;

            var grd = context.createRadialGradient(x, y, 0, x, y, 100);
            grd.addColorStop(0.75, "rgba( 255, 0, 0, 0 )");
            grd.addColorStop(0.8, "rgba( 255, 0, 0, " + opacity2 + " )");
            grd.addColorStop(0.85, "rgba( 0, 255, 0, " + opacity2 + " )");
            grd.addColorStop(0.9, "rgba( 0, 0, 255, " + opacity2 + " )");
            grd.addColorStop(1, "rgba( 0, 0, 255, 0 )");
            context.fillStyle = grd;
            context.fillCircle(x, y, 100, context);

            var radDist1 = 200 / stretchVal;
            var x2 = radDist1 * Math.cos(flareAngle) + x;
            var y2 = radDist1 * Math.sin(flareAngle) + y;
            var x2a = radDist1 * Math.cos(invertedFlareAngle) + x;
            var y2a = radDist1 * Math.sin(invertedFlareAngle) + y;

            var opacity3 = p.color4Data.a * 0.025;
            // little flare 1
            var grd2 = context.createRadialGradient(x2, y2, 0, x2, y2, 50);
            // grd2.addColorStop(0.75, "rgba( 255, 0, 0, 0 )" );
            // grd2.addColorStop(0.8, "rgba( 255, 0, 0, "+opacity2+" )" );
            // grd2.addColorStop(0.85, "rgba( 0, 255, 0, "+opacity2+" )" );
            // grd2.addColorStop(0.9, "rgba( 0, 0, 255, "+opacity2+" )" );
            // grd2.addColorStop(1, "rgba( 0, 0, 255, 0 )" );

            grd2.addColorStop(0, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd2.addColorStop(0.8, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd2.addColorStop(1, "rgba( 255, 255, 255, 0 )");

            context.fillStyle = grd2;
            context.fillCircle(x2, y2, 50, context);

            // little flare 2
            var grd2a = context.createRadialGradient(x2a, y2a, 0, x2a, y2a, 50);
            // grd2a.addColorStop(0.75, "rgba( 255, 0, 0, 0 )" );
            // grd2a.addColorStop(0.8, "rgba( 255, 0, 0, "+opacity3+" )" );
            // grd2a.addColorStop(0.85, "rgba( 0, 255, 0, "+opacity3+" )" );
            // grd2a.addColorStop(0.9, "rgba( 0, 0, 255, "+opacity3+" )" );
            // grd2a.addColorStop(1, "rgba( 0, 0, 255, 0 )" );
            grd2a.addColorStop(0, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd2a.addColorStop(0.8, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd2a.addColorStop(1, "rgba( 255, 255, 255, 0 )");
            context.fillStyle = grd2a;
            context.fillCircle(x2a, y2a, 50, context);

            var radDist2 = 300 / stretchVal * 1.5;
            var x3 = radDist2 * Math.cos(flareAngle) + x;
            var y3 = radDist2 * Math.sin(flareAngle) + y;
            var x3a = radDist2 * Math.cos(invertedFlareAngle) + x;
            var y3a = radDist2 * Math.sin(invertedFlareAngle) + y;

            // little flare 3
            var grd3 = context.createRadialGradient(x3, y3, 0, x3, y3, 25);
            // grd3.addColorStop(0.75, "rgba( 255, 0, 0, 0 )" );
            // grd3.addColorStop(0.8, "rgba( 255, 0, 0, "+opacity3+" )" );
            // grd3.addColorStop(0.85, "rgba( 0, 255, 0, "+opacity3+" )" );
            // grd3.addColorStop(0.9, "rgba( 0, 0, 255, "+opacity3+" )" );
            // grd3.addColorStop(1, "rgba( 0, 0, 255, 0 )" );
            grd3.addColorStop(0, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd3.addColorStop(0.8, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd3.addColorStop(1, "rgba( 255, 255, 255, 0 )");
            context.fillStyle = grd3;
            context.fillCircle(x3, y3, 25, context);

            // little flare 4
            var grd3a = context.createRadialGradient(x3a, y3a, 0, x3a, y3a, 25);
            // grd3a.addColorStop(0.75, "rgba( 255, 0, 0, 0 )" );
            // grd3a.addColorStop(0.8, "rgba( 255, 0, 0, "+opacity3+" )" );
            // grd3a.addColorStop(0.85, "rgba( 0, 255, 0, "+opacity3+" )" );
            // grd3a.addColorStop(0.9, "rgba( 0, 0, 255, "+opacity3+" )" );
            // grd3a.addColorStop(1, "rgba( 0, 0, 255, 0 )" );
            grd3a.addColorStop(0, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd3a.addColorStop(0.8, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd3a.addColorStop(1, "rgba( 255, 255, 255, 0 )");
            context.fillStyle = grd3a;
            context.fillCircle(x3a, y3a, 25, context);
        }
    }
};

module.exports.warpStarTheme = warpStarTheme;
},{"./../../../colorUtils.js":9,"./../../../createWarpStarImage.js":10,"./../../../mathUtils.js":21}],40:[function(require,module,exports){
// dependencies

// NPM
var LinkedList = require('dbly-linked-list');
var objectPath = require("object-path");

// Custom Requires
var mathUtils = require('./mathUtils.js').mathUtils;
var trig = require('./trigonomicUtils.js').trigonomicUtils;
var drawing = require('./canvasApiAugmentation.js').canvasDrawingApi;
var coloring = require('./colorUtils.js').colorUtils;
var easing = require('./easing.js').easingEquations;
var animation = require('./animation.js').animation;
var debugConfig = require('./debugUtils.js');
var debug = debugConfig.debug;
var lastCalledTime = debugConfig.lastCalledTime;
var environment = require('./environment.js').environment;
var physics = environment.forces;
var runtimeEngine = environment.runtimeEngine;
var themes = require('./particleThemes/themes.js').themes;

var singleBurstTheme = require('./emitterThemes/singleBurstTheme/singleBurstTheme.js').singleBurstTheme;
var baseEmitterTheme = require('./emitterThemes/baseEmitter/baseEmitterTheme.js').baseEmitterTheme;
var warpStreamTheme = require('./emitterThemes/warpStream/warpStreamTheme.js').warpStreamTheme;
var flameStreamTheme = require('./emitterThemes/flameStream/flameStreamTheme.js').flameStreamTheme;
var smokeStreamTheme = require('./emitterThemes/smokeStream/smokeStreamTheme.js').smokeStreamTheme;

var EmitterEntity = require('./EmitterEntity.js').EmitterEntity;
var EmitterStoreFn = require('./emitterStore.js').EmitterStoreFn;
var particleFn = require('./particleFn.js').particleFn;
var particleArrFn = require('./particleArrFn.js').particleArrFn;

// double buffer canvas (experiment)
// let canvas = document.createElement('canvas');
// let ctx = canvas.getContext("2d");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// let blitCanvas = document.querySelector("#test-base");
// let blitCtx = blitCanvas.getContext("2d");

// blitCanvas.width = window.innerWidth;
// blitCanvas.height = window.innerHeight;

// standard canvas rendering
// canvas housekeeping
var canvas = document.querySelector("#test-base");
// let ctx = canvas.getContext("2d", { alpha: false });
var ctx = canvas.getContext("2d");
// cache canvas w/h
var canW = window.innerWidth;
var canH = window.innerHeight;
// set canvas to full-screen
canvas.width = canW;
canvas.height = canH;
var canvasCentreH = canW / 2;
var canvasCentreV = canH / 2;

var canvasConfig = {
    width: canW,
    height: canH,
    centerH: canvasCentreH,
    centerV: canvasCentreV,

    bufferClearRegion: {
        x: canvasCentreH,
        y: canvasCentreV,
        w: 0,
        h: 0
    }
};




var bufferClearRegion = {
    x: canvasCentreH,
    y: canvasCentreV,
    w: 0,
    h: 0

    // emitter store
};

var emitterStore = [];
// particle store
var entityStore = [];
// particle store meta data
var entityPool = new LinkedList();
var liveEntityCount = 0;

var runtimeConfig = {

    globalClock: 0,
    globalClockTick: function globalClockTick() {
        this.globalClock++;
    },

    emitterCount: 0,
    activeEmitters: 0,

    liveEntityCount: 0,
    subtract: function subtract(amount) {
        this.liveEntityCount -= amount;
    }
};

// pre-populate entityStore
var entityPopulation = 10000;
for (var i = 0; i < entityPopulation; i++) {
    // console.log( "populating entityStore with pInstance '%d': ", i );
    // pInstance.idx = i;
    // console.log( "pInstance.idx '%d'", pInstance.idx )
    entityStore.push(createLiveParticle(0, 0, i, baseEmitterTheme, themes.reset));
    entityPool.insert('' + i);
}

// global counter
var globalClock = 0;
var counter = 0;

// set default variables 
var mouseX = void 0,
    mouseY = void 0,
    runtime = void 0,
    pLive = void 0;
    
// let currTheme = themes.fire;
// var currTheme = themes.flame;
let currTheme = themes.warpStar;
// let currTheme = themes.smoke;

// let currEmitterTheme = singleBurstTheme;
let currEmitterTheme = warpStreamTheme;
// var currEmitterTheme = flameStreamTheme;

var currEmmissionType = {
    mouseClickEvent: true,
    randomBurst: false,
    steadyStream: false
};

// canvas click handler
function registerMouseClickEmmision() {
    canvas.addEventListener('click', function (event) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;

        // testEmitter.resetEmissionValues();
        // testEmitter.triggerEmitter( { x: mouseX, y: mouseY } );

        var testEmitter = new EmitterEntity('testEmitter', currEmitterTheme, currTheme, emitEntities);

        emitterStore.push(testEmitter);

        testEmitter.triggerEmitter({
            x: canvasConfig.centerH,
            y: canvasConfig.centerV
        });

        if (animation.state !== true) {
            animation.state = true;
            update();
        }
    });
}

if (currEmmissionType.mouseClickEvent) {
    registerMouseClickEmmision();
}

var smokeEmitter = new EmitterEntity('smokeEmitter', smokeStreamTheme, themes.smoke, emitEntities);
emitterStore.push(smokeEmitter);

// particle methods fN
function renderParticle(x, y, r, colorData, context, mathUtils) {
    var p = this;
    // console.log( 'p.render: ', p );
    var compiledColor = "rgba(" + colorData.r + ',' + colorData.g + ',' + colorData.b + "," + colorData.a + ")";
    context.fillStyle = compiledColor;
    context.fillCircle(x, y, r, context);
}

function setParticleAttributes(p, ppa) {

    p.isAlive = ppa.active;
    p.lifeSpan = ppa.lifeSpan;
    p.currLife = ppa.lifeSpan;
    p.currLifeInv = 0;
    p.x = ppa.x;
    p.y = ppa.y;
    p.xVel = ppa.xVel;
    p.yVel = ppa.yVel;
    p.vAcc = ppa.vAcc;
    p.initR = ppa.initR;
    p.r = ppa.initR;
    p.tR = ppa.tR;
    p.angle = ppa.angle;
    p.magnitude = ppa.magnitude;
    p.relativeMagnitude = ppa.magnitude;
    p.magnitudeDecay = ppa.magnitudeDecay;
    p.entityType = 'none';
    p.applyForces = ppa.applyForces;
    p.color4Data = ppa.color4Data;
    p.colorProfiles = ppa.colorProfiles;
    p.killConditions = ppa.killConditions;
    p.customAttributes = ppa.customAttributes;
    p.animationTracks = ppa.animationTracks;
    p.update = particleFn.updateParticle;
    p.reincarnate = reincarnateParticle;
    p.kill = particleFn.killParticle;
    p.render = ppa.renderFN;
    p.events = ppa.events;
}

// particle fN
function createLiveParticle(thisX, thisY, idx, emissionOpts, particleOpts) {

    var newParticle = {};
    newParticle.idx = idx;
    setParticleAttributes(newParticle, particleFn.createPerParticleAttributes(thisX, thisY, emissionOpts, particleOpts));
    return newParticle;
}

function reincarnateParticle(thisX, thisY, emissionOpts, particleOptions) {
    setParticleAttributes(this, particleFn.createPerParticleAttributes(thisX, thisY, emissionOpts, particleOptions));
}

// emmision fN
function emitEntities(x, y, count, emissionOptions, particleOptions) {
    var entityStoreLen = entityStore.length;
    var addedNew = 0;
    var addedFromPool = 0;
    var theta;

    // console.log( "emmiting a total of: '%d' particles", count );
    runtimeConfig.liveEntityCount += count;
    for (var _i = count - 1; _i >= 0; _i--) {

        if (entityPool.getSize() > 0) {
            entityStore[entityPool.getTailNode().getData()].reincarnate(x, y, emissionOptions, particleOptions);
            addedFromPool++;
            entityPool.remove();
        } else {
            entityStore.push(createLiveParticle(x, y, entityStoreLen, emissionOptions, particleOptions));
            entityPool.insert('' + entityStoreLen);
            addedNew++;
            entityStoreLen++;
        }
    }
    // console.log( "addedFromPool: '%d', addedNew: '%d'", addedFromPool, addedNew );
    // console.log( 'addedNew: ', addedNew );
}

function updateEmitterStoreMembers() {

    for (var i = emitterStore.length - 1; i >= 0; i--) {
        emitterStore[i].updateEmitter();
        // emitterStore[i].renderEmitter( ctx );
    }
}

// runtime fN members
function displayDebugging() {
    debug.debugOutput(canvas, ctx, 'Animation Counter: ', counter, 0);
    debug.debugOutput(canvas, ctx, 'Particle Pool: ', entityStore.length, 1);
    debug.debugOutput(canvas, ctx, 'Live Entities: ', runtimeConfig.liveEntityCount, 2, { min: entityStore.length, max: 0 });
    debug.debugOutput(canvas, ctx, 'FPS: ', Math.round(debug.calculateFps()), 3, { min: 0, max: 60 });
}

function updateCycle() {
    // rendering
    particleArrFn.renderParticleArr(ctx, entityStore, animation);

    // blit to onscreen
    // blitCtx.drawImage( canvas, 0, 0 );

    // updating
    particleArrFn.updateParticleArr(ctx, entityStore, entityPool, animation, canvasConfig, runtimeConfig, emitterStore);

    updateEmitterStoreMembers();
}

function clearCanvas(ctx) {
    // cleaning
    ctx.clearRect(0, 0, canW, canH);
    // ctx.clearRect( bufferClearRegion.x, bufferClearRegion.y, bufferClearRegion.w, bufferClearRegion.h );

    // blitCtx.clearRect( 0, 0, canW, canH );


    // ctx.fillStyle = 'rgba( 0, 0, 0, 0.1 )';
    // ctx.fillRect( 0, 0, canW, canH );

    // set dirty buffer
    // resetBufferClearRegion();
}

/////////////////////////////////////////////////////////////
// runtime
/////////////////////////////////////////////////////////////
function update() {

    // loop housekeeping
    runtime = undefined;

    // clean canvas
    clearCanvas(ctx);

    // blending
    // if ( ctx.globalCompositeOperation != currTheme.contextBlendingMode ) {
    //     ctx.globalCompositeOperation = currTheme.contextBlendingMode;
    // }

    // updates
    updateCycle();

    // debugging
    displayDebugging();

    // looping
    animation.state === true ? (runtimeEngine.startAnimation(runtime, update), counter++) : runtimeEngine.stopAnimation(runtime);

    // global clock
    // counter++;
}
/////////////////////////////////////////////////////////////
// End runtime
/////////////////////////////////////////////////////////////
},{"./EmitterEntity.js":6,"./animation.js":7,"./canvasApiAugmentation.js":8,"./colorUtils.js":9,"./debugUtils.js":11,"./easing.js":12,"./emitterStore.js":13,"./emitterThemes/baseEmitter/baseEmitterTheme.js":14,"./emitterThemes/flameStream/flameStreamTheme.js":15,"./emitterThemes/singleBurstTheme/singleBurstTheme.js":16,"./emitterThemes/smokeStream/smokeStreamTheme.js":17,"./emitterThemes/warpStream/warpStreamTheme.js":18,"./environment.js":20,"./mathUtils.js":21,"./particleArrFn.js":22,"./particleFn.js":23,"./particleThemes/themes.js":30,"./trigonomicUtils.js":41,"dbly-linked-list":1,"object-path":5}],41:[function(require,module,exports){
var _trigonomicUtils;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
* cached values
*/

var piByHalf = Math.Pi / 180;
var halfByPi = 180 / Math.PI;

/**
* provides trigonmic util methods.
*
* @mixin
*/
var trigonomicUtils = (_trigonomicUtils = {

	/**
 * @description calculate distance between 2 vector coordinates.
 * @param {number} x1 - X coordinate of vector 1.
 * @param {number} y1 - Y coordinate of vector 1.
 * @param {number} x2 - X coordinate of vector 2.
 * @param {number} y2 - Y coordinate of vector 2.
 * @returns {number} result.
 */
	dist: function dist(x1, y1, x2, y2) {
		x2 -= x1;y2 -= y1;
		return Math.sqrt(x2 * x2 + y2 * y2);
	},

	/**
 * @description convert degrees to radians.
 * @param {number} degrees - the degree value to convert.
 * @returns {number} result.
 */
	degreesToRadians: function degreesToRadians(degrees) {
		return degrees * piByHalf;
	},

	/**
 * @description convert radians to degrees.
 * @param {number} radians - the degree value to convert.
 * @returns {number} result.
 */
	radiansToDegrees: function radiansToDegrees(radians) {
		return radians * halfByPi;
	},

	/*
 return useful Trigonomic values from position of 2 objects in x/y space
 where x1/y1 is the current poistion and x2/y2 is the target position
 */
	/**
 * @description calculate trigomomic values between 2 vector coordinates.
 * @param {number} x1 - X coordinate of vector 1.
 * @param {number} y1 - Y coordinate of vector 1.
 * @param {number} x2 - X coordinate of vector 2.
 * @param {number} y2 - Y coordinate of vector 2.
 * @typedef {Object} Calculation
 * @property {number} distance The distance between vectors
 * @property {number} angle The angle between vectors
 * @returns { Calculation } the calculated angle and distance between vectors
 */
	getAngleAndDistance: function getAngleAndDistance(x1, y1, x2, y2) {

		// set up base values
		var dX = x2 - x1;
		var dY = y2 - y1;
		// get the distance between the points
		var d = Math.sqrt(dX * dX + dY * dY);
		// angle in radians
		// var radians = Math.atan2(yDist, xDist) * 180 / Math.PI;
		// angle in radians
		var r = Math.atan2(dY, dX);
		return {
			distance: d,
			angle: r
		};
	},

	/**
 * @description get new X coordinate from angle and distance.
 * @param {number} radians - the angle to transform in radians.
 * @param {number} distance - the distance to transform.
 * @returns {number} result.
 */
	getAdjacentLength: function getAdjacentLength(radians, distance) {
		return Math.cos(radians) * distance;
	}

}, _defineProperty(_trigonomicUtils, "getAdjacentLength", function getAdjacentLength(radians, distance) {
	return Math.sin(radians) * distance;
}), _defineProperty(_trigonomicUtils, "findNewPoint", function findNewPoint(x, y, angle, distance) {
	return {
		x: Math.cos(angle) * distance + x,
		y: Math.sin(angle) * distance + y
	};
}), _defineProperty(_trigonomicUtils, "calculateVelocities", function calculateVelocities(x, y, angle, impulse) {
	var a2 = Math.atan2(Math.sin(angle) * impulse + y - y, Math.cos(angle) * impulse + x - x);
	return {
		xVel: Math.cos(a2) * impulse,
		yVel: Math.sin(a2) * impulse
	};
}), _defineProperty(_trigonomicUtils, "radialDistribution", function radialDistribution(cx, cy, r, a) {
	return {
		x: cx + r * Math.cos(a),
		y: cy + r * Math.sin(a)
	};
}), _trigonomicUtils);

module.exports.trigonomicUtils = trigonomicUtils;
},{}],42:[function(require,module,exports){
function getValue(path, origin) {
    if (origin === void 0 || origin === null) origin = self ? self : this;
    if (typeof path !== 'string') path = '' + path;
    var c = '',
        pc,
        i = 0,
        n = path.length,
        name = '';
    if (n) while (i <= n) {
        (c = path[i++]) == '.' || c == '[' || c == ']' || c == void 0 ? (name ? (origin = origin[name], name = '') : pc == '.' || pc == '[' || pc == ']' && c == ']' ? i = n + 2 : void 0, pc = c) : name += c;
    }if (i == n + 2) throw "Invalid path: " + path;
    return origin;
}

module.exports.getValue = getValue;
},{}]},{},[19])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGJseS1saW5rZWQtbGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kYmx5LWxpbmtlZC1saXN0L2xpYi9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9kYmx5LWxpbmtlZC1saXN0L2xpYi9saXN0LW5vZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmlzZXF1YWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LXBhdGgvaW5kZXguanMiLCJzcmMvanMvRW1pdHRlckVudGl0eS5qcyIsInNyYy9qcy9hbmltYXRpb24uanMiLCJzcmMvanMvY2FudmFzQXBpQXVnbWVudGF0aW9uLmpzIiwic3JjL2pzL2NvbG9yVXRpbHMuanMiLCJzcmMvanMvY3JlYXRlV2FycFN0YXJJbWFnZS5qcyIsInNyYy9qcy9kZWJ1Z1V0aWxzLmpzIiwic3JjL2pzL2Vhc2luZy5qcyIsInNyYy9qcy9lbWl0dGVyU3RvcmUuanMiLCJzcmMvanMvZW1pdHRlclRoZW1lcy9iYXNlRW1pdHRlci9iYXNlRW1pdHRlclRoZW1lLmpzIiwic3JjL2pzL2VtaXR0ZXJUaGVtZXMvZmxhbWVTdHJlYW0vZmxhbWVTdHJlYW1UaGVtZS5qcyIsInNyYy9qcy9lbWl0dGVyVGhlbWVzL3NpbmdsZUJ1cnN0VGhlbWUvc2luZ2xlQnVyc3RUaGVtZS5qcyIsInNyYy9qcy9lbWl0dGVyVGhlbWVzL3Ntb2tlU3RyZWFtL3Ntb2tlU3RyZWFtVGhlbWUuanMiLCJzcmMvanMvZW1pdHRlclRoZW1lcy93YXJwU3RyZWFtL3dhcnBTdHJlYW1UaGVtZS5qcyIsInNyYy9qcy9lbnRyeS5qcyIsInNyYy9qcy9lbnZpcm9ubWVudC5qcyIsInNyYy9qcy9tYXRoVXRpbHMuanMiLCJzcmMvanMvcGFydGljbGVBcnJGbi5qcyIsInNyYy9qcy9wYXJ0aWNsZUZuLmpzIiwic3JjL2pzL3BhcnRpY2xlRnVuY3Rpb25zL2NoZWNrUGFydGljbGVLaWxsQ29uZGl0aW9ucy5qcyIsInNyYy9qcy9wYXJ0aWNsZUZ1bmN0aW9ucy9jcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMuanMiLCJzcmMvanMvcGFydGljbGVGdW5jdGlvbnMva2lsbFBhcnRpY2xlLmpzIiwic3JjL2pzL3BhcnRpY2xlRnVuY3Rpb25zL3JlbmRlclBhcnRpY2xlQXJyLmpzIiwic3JjL2pzL3BhcnRpY2xlRnVuY3Rpb25zL3VwZGF0ZVBhcnRpY2xlLmpzIiwic3JjL2pzL3BhcnRpY2xlRnVuY3Rpb25zL3VwZGF0ZVBhcnRpY2xlQXJyLmpzIiwic3JjL2pzL3BhcnRpY2xlVGhlbWVzL3RoZW1lcy5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvZmlyZS9hbmltYXRpb25UcmFja3MuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL2ZpcmUvY3VzdG9tQXR0cmlidXRlcy5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvZmlyZS9raWxsQ29uZGl0aW9ucy5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvZmlyZS9yZW5kZXJGbi5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvZmlyZS90aGVtZS5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvZmxhbWUvZmxhbWVUaGVtZS5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvcmVzZXQvcmVzZXRUaGVtZS5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvc21va2Uvc21va2VUaGVtZS5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvd2FycFN0YXIvd2FycFN0YXJUaGVtZS5qcyIsInNyYy9qcy9wYXJ0aWNsZXMuanMiLCJzcmMvanMvdHJpZ29ub21pY1V0aWxzLmpzIiwic3JjL2pzL3V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4ekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogQGZpbGVPdmVydmlldyBJbXBsZW1lbnRhdGlvbiBvZiBhIGRvdWJseSBsaW5rZWQtbGlzdCBkYXRhIHN0cnVjdHVyZVxuICogQGF1dGhvciBKYXNvbiBTLiBKb25lc1xuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgaXNFcXVhbCA9IHJlcXVpcmUoJ2xvZGFzaC5pc2VxdWFsJyk7XG4gICAgdmFyIE5vZGUgPSByZXF1aXJlKCcuL2xpYi9saXN0LW5vZGUnKTtcbiAgICB2YXIgSXRlcmF0b3IgPSByZXF1aXJlKCcuL2xpYi9pdGVyYXRvcicpO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogRG91Ymx5IGxpbmtlZCBsaXN0IGNsYXNzXG4gICAgICpcbiAgICAgKiBJbXBsZW1lbnRhdGlvbiBvZiBhIGRvdWJseSBsaW5rZWQgbGlzdCBkYXRhIHN0cnVjdHVyZS4gIFRoaXNcbiAgICAgKiBpbXBsZW1lbnRhdGlvbiBwcm92aWRlcyB0aGUgZ2VuZXJhbCBmdW5jdGlvbmFsaXR5IG9mIGFkZGluZyBub2RlcyB0b1xuICAgICAqIHRoZSBmcm9udCBvciBiYWNrIG9mIHRoZSBsaXN0LCBhcyB3ZWxsIGFzIHJlbW92aW5nIG5vZGUgZnJvbSB0aGUgZnJvbnRcbiAgICAgKiBvciBiYWNrLiAgVGhpcyBmdW5jdGlvbmFsaXR5IGVuYWJsZXMgdGhpcyBpbXBsZW1lbnRpb24gdG8gYmUgdGhlXG4gICAgICogdW5kZXJseWluZyBkYXRhIHN0cnVjdHVyZSBmb3IgdGhlIG1vcmUgc3BlY2lmaWMgc3RhY2sgb3IgcXVldWUgZGF0YVxuICAgICAqIHN0cnVjdHVyZS5cbiAgICAgKlxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgTGlua2VkTGlzdCBpbnN0YW5jZS4gIEVhY2ggaW5zdGFuY2UgaGFzIGEgaGVhZCBub2RlLCBhIHRhaWxcbiAgICAgKiBub2RlIGFuZCBhIHNpemUsIHdoaWNoIHJlcHJlc2VudHMgdGhlIG51bWJlciBvZiBub2RlcyBpbiB0aGUgbGlzdC5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIERvdWJseUxpbmtlZExpc3QoKSB7XG4gICAgICAgIHRoaXMuaGVhZCA9IG51bGw7XG4gICAgICAgIHRoaXMudGFpbCA9IG51bGw7XG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XG5cbiAgICAgICAgLy8gYWRkIGl0ZXJhdG9yIGFzIGEgcHJvcGVydHkgb2YgdGhpcyBsaXN0IHRvIHNoYXJlIHRoZSBzYW1lXG4gICAgICAgIC8vIGl0ZXJhdG9yIGluc3RhbmNlIHdpdGggYWxsIG90aGVyIG1ldGhvZHMgdGhhdCBtYXkgcmVxdWlyZVxuICAgICAgICAvLyBpdHMgdXNlLiAgTm90ZTogYmUgc3VyZSB0byBjYWxsIHRoaXMuaXRlcmF0b3IucmVzZXQoKSB0b1xuICAgICAgICAvLyByZXNldCB0aGlzIGl0ZXJhdG9yIHRvIHBvaW50IHRoZSBoZWFkIG9mIHRoZSBsaXN0LlxuICAgICAgICB0aGlzLml0ZXJhdG9yID0gbmV3IEl0ZXJhdG9yKHRoaXMpO1xuICAgIH1cblxuICAgIC8qIEZ1bmN0aW9ucyBhdHRhY2hlZCB0byB0aGUgTGlua2VkLWxpc3QgcHJvdG90eXBlLiAgQWxsIGxpbmtlZC1saXN0XG4gICAgICogaW5zdGFuY2VzIHdpbGwgc2hhcmUgdGhlc2UgbWV0aG9kcywgbWVhbmluZyB0aGVyZSB3aWxsIE5PVCBiZSBjb3BpZXNcbiAgICAgKiBtYWRlIGZvciBlYWNoIGluc3RhbmNlLiAgVGhpcyB3aWxsIGJlIGEgaHVnZSBtZW1vcnkgc2F2aW5ncyBzaW5jZSB0aGVyZVxuICAgICAqIG1heSBiZSBzZXZlcmFsIGRpZmZlcmVudCBsaW5rZWQgbGlzdHMuXG4gICAgICovXG4gICAgRG91Ymx5TGlua2VkTGlzdC5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYSBuZXcgTm9kZSBvYmplY3Qgd2l0aCAnZGF0YScgYXNzaWduZWQgdG8gdGhlIG5vZGUncyBkYXRhXG4gICAgICAgICAqIHByb3BlcnR5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IGRhdGEgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVcbiAgICAgICAgICogQHJldHVybnMge29iamVjdH0gTm9kZSBvYmplY3QgaW50aWFsaXplZCB3aXRoICdkYXRhJ1xuICAgICAgICAgKi9cbiAgICAgICAgY3JlYXRlTmV3Tm9kZTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTm9kZShkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgZmlyc3Qgbm9kZSBpbiB0aGUgbGlzdCwgY29tbW9ubHkgcmVmZXJyZWQgdG8gYXMgdGhlXG4gICAgICAgICAqICdoZWFkJyBub2RlXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IHRoZSBoZWFkIG5vZGUgb2YgdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgICAgIGdldEhlYWROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oZWFkO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBsYXN0IG5vZGUgaW4gdGhlIGxpc3QsIGNvbW1vbmx5IHJlZmVycmVkIHRvIGFzIHRoZVxuICAgICAgICAgKiAndGFpbCdub2RlXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IHRoZSB0YWlsIG5vZGUgb2YgdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgICAgIGdldFRhaWxOb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50YWlsO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBsaXN0IGlzIGVtcHR5XG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBsaXN0IGlzIGVtcHR5LCBmYWxzZSBvdGhlcndpc2VcbiAgICAgICAgICovXG4gICAgICAgIGlzRW1wdHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5zaXplID09PSAwKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgc2l6ZSBvZiB0aGUgbGlzdCwgb3IgbnVtYmVyIG9mIG5vZGVzXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBudW1iZXIgb2Ygbm9kZXMgaW4gdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgICAgIGdldFNpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNpemU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsZWFycyB0aGUgbGlzdCBvZiBhbGwgbm9kZXMvZGF0YVxuICAgICAgICAgKi9cbiAgICAgICAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHdoaWxlICghdGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIyMjIyMjIyMjIyMjIyMjIyMjIElOU0VSVCBtZXRob2RzICMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc2VydHMgYSBub2RlIHdpdGggdGhlIHByb3ZpZGVkIGRhdGEgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBkYXRhIFRoZSBkYXRhIHRvIGluaXRpYWxpemUgd2l0aCB0aGVcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGluc2VydCBvcGVyYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICAgICAgICovXG4gICAgICAgIGluc2VydDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdGhpcy5jcmVhdGVOZXdOb2RlKGRhdGEpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkID0gdGhpcy50YWlsID0gbmV3Tm9kZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YWlsLm5leHQgPSBuZXdOb2RlO1xuICAgICAgICAgICAgICAgIG5ld05vZGUucHJldiA9IHRoaXMudGFpbDtcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwgPSBuZXdOb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zaXplICs9IDE7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnNlcnRzIGEgbm9kZSB3aXRoIHRoZSBwcm92aWRlZCBkYXRhIHRvIHRoZSBmcm9udCBvZiB0aGUgbGlzdFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBkYXRhIFRoZSBkYXRhIHRvIGluaXRpYWxpemUgd2l0aCB0aGVcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGluc2VydCBvcGVyYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICAgICAgICovXG4gICAgICAgIGluc2VydEZpcnN0OiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnQoZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdGhpcy5jcmVhdGVOZXdOb2RlKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgbmV3Tm9kZS5uZXh0ID0gdGhpcy5oZWFkO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZC5wcmV2ID0gbmV3Tm9kZTtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQgPSBuZXdOb2RlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zaXplICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnNlcnRzIGEgbm9kZSB3aXRoIHRoZSBwcm92aWRlZCBkYXRhIGF0IHRoZSBpbmRleCBpbmRpY2F0ZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBUaGUgaW5kZXggaW4gdGhlIGxpc3QgdG8gaW5zZXJ0IHRoZSBuZXcgbm9kZVxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBkYXRhIFRoZSBkYXRhIHRvIGluaXRpYWxpemUgd2l0aCB0aGUgbm9kZVxuICAgICAgICAgKi9cbiAgICAgICAgaW5zZXJ0QXQ6IGZ1bmN0aW9uIChpbmRleCwgZGF0YSkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmdldEhlYWROb2RlKCksXG4gICAgICAgICAgICAgICAgbmV3Tm9kZSA9IHRoaXMuY3JlYXRlTmV3Tm9kZShkYXRhKSxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IDA7XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGZvciBpbmRleCBvdXQtb2YtYm91bmRzXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5nZXRTaXplKCkgLSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBpbmRleCBpcyAwLCB3ZSBqdXN0IG5lZWQgdG8gaW5zZXJ0IHRoZSBmaXJzdCBub2RlXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluc2VydEZpcnN0KGRhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aGlsZSAocG9zaXRpb24gPCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gKz0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3VycmVudC5wcmV2Lm5leHQgPSBuZXdOb2RlO1xuICAgICAgICAgICAgbmV3Tm9kZS5wcmV2ID0gY3VycmVudC5wcmV2O1xuICAgICAgICAgICAgY3VycmVudC5wcmV2ID0gbmV3Tm9kZTtcbiAgICAgICAgICAgIG5ld05vZGUubmV4dCA9IGN1cnJlbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuc2l6ZSArPSAxO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zZXJ0cyBhIG5vZGUgYmVmb3JlIHRoZSBmaXJzdCBub2RlIGNvbnRhaW5pbmcgdGhlIHByb3ZpZGVkIGRhdGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gbm9kZURhdGEgVGhlIGRhdGEgb2YgdGhlIG5vZGUgdG9cbiAgICAgICAgICogICAgICAgICBmaW5kIHRvIGluc2VydCB0aGUgbmV3IG5vZGUgYmVmb3JlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IGRhdGFUb0luc2VydCBUaGUgZGF0YSB0byBpbml0aWFsaXplIHdpdGggdGhlIG5vZGVcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5zZXJ0IG9wZXJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgICAgICAgKi9cbiAgICAgICAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAobm9kZURhdGEsIGRhdGFUb0luc2VydCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5pbmRleE9mKG5vZGVEYXRhKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc2VydEF0KGluZGV4LCBkYXRhVG9JbnNlcnQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnNlcnRzIGEgbm9kZSBhZnRlciB0aGUgZmlyc3Qgbm9kZSBjb250YWluaW5nIHRoZSBwcm92aWRlZCBkYXRhXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IG5vZGVEYXRhIFRoZSBkYXRhIG9mIHRoZSBub2RlIHRvXG4gICAgICAgICAqICAgICAgICAgZmluZCB0byBpbnNlcnQgdGhlIG5ldyBub2RlIGFmdGVyXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IGRhdGFUb0luc2VydCBUaGUgZGF0YSB0byBpbml0aWFsaXplIHdpdGggdGhlIG5vZGVcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5zZXJ0IG9wZXJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgICAgICAgKi9cbiAgICAgICAgaW5zZXJ0QWZ0ZXI6IGZ1bmN0aW9uIChub2RlRGF0YSwgZGF0YVRvSW5zZXJ0KSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmluZGV4T2Yobm9kZURhdGEpO1xuICAgICAgICAgICAgdmFyIHNpemUgPSB0aGlzLmdldFNpemUoKTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgaWYgd2Ugd2FudCB0byBpbnNlcnQgbmV3IG5vZGUgYWZ0ZXIgdGhlIHRhaWwgbm9kZVxuICAgICAgICAgICAgaWYgKGluZGV4ICsgMSA9PT0gc2l6ZSkge1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgc28sIGNhbGwgaW5zZXJ0LCB3aGljaCB3aWxsIGFwcGVuZCB0byB0aGUgZW5kIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pbnNlcnQoZGF0YVRvSW5zZXJ0KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSwgaW5jcmVtZW50IHRoZSBpbmRleCBhbmQgaW5zZXJ0IHRoZXJlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0QXQoaW5kZXggKyAxLCBkYXRhVG9JbnNlcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb25jYXRlbmF0ZSBhbm90aGVyIGxpbmtlZCBsaXN0IHRvIHRoZSBlbmQgb2YgdGhpcyBsaW5rZWQgbGlzdC4gVGhlIHJlc3VsdCBpcyB2ZXJ5XG4gICAgICAgICAqIHNpbWlsYXIgdG8gYXJyYXkuY29uY2F0IGJ1dCBoYXMgYSBwZXJmb3JtYW5jZSBpbXByb3ZlbWVudCBzaW5jZSB0aGVyZSBpcyBubyBuZWVkIHRvXG4gICAgICAgICAqIGl0ZXJhdGUgb3ZlciB0aGUgbGlzdHNcbiAgICAgICAgICogQHBhcmFtIHtEb3VibHlMaW5rZWRMaXN0fSBvdGhlckxpbmtlZExpc3RcbiAgICAgICAgICogQHJldHVybnMge0RvdWJseUxpbmtlZExpc3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25jYXQ6IGZ1bmN0aW9uIChvdGhlckxpbmtlZExpc3QpIHtcbiAgICAgICAgICAgIGlmIChvdGhlckxpbmtlZExpc3QgaW5zdGFuY2VvZiBEb3VibHlMaW5rZWRMaXN0KSB7XG4gICAgICAgICAgICAgICAgLy9jcmVhdGUgbmV3IGxpc3Qgc28gdGhlIGNhbGxpbmcgbGlzdCBpcyBpbW11dGFibGUgKGxpa2UgYXJyYXkuY29uY2F0KVxuICAgICAgICAgICAgICAgIHZhciBuZXdMaXN0ID0gbmV3IERvdWJseUxpbmtlZExpc3QoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTaXplKCkgPiAwKSB7IC8vdGhpcyBsaXN0IGlzIE5PVCBlbXB0eVxuICAgICAgICAgICAgICAgICAgICBuZXdMaXN0LmhlYWQgPSB0aGlzLmdldEhlYWROb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3QudGFpbCA9IHRoaXMuZ2V0VGFpbE5vZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC50YWlsLm5leHQgPSBvdGhlckxpbmtlZExpc3QuZ2V0SGVhZE5vZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVyTGlua2VkTGlzdC5nZXRTaXplKCkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdMaXN0LnRhaWwgPSBvdGhlckxpbmtlZExpc3QuZ2V0VGFpbE5vZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXdMaXN0LnNpemUgPSB0aGlzLmdldFNpemUoKSArIG90aGVyTGlua2VkTGlzdC5nZXRTaXplKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyAvLyd0aGlzJyBsaXN0IGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3QuaGVhZCA9IG90aGVyTGlua2VkTGlzdC5nZXRIZWFkTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICBuZXdMaXN0LnRhaWwgPSBvdGhlckxpbmtlZExpc3QuZ2V0VGFpbE5vZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC5zaXplID0gb3RoZXJMaW5rZWRMaXN0LmdldFNpemUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld0xpc3Q7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBvbmx5IGNvbmNhdCBhbm90aGVyIGluc3RhbmNlIG9mIERvdWJseUxpbmtlZExpc3RcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8jIyMjIyMjIyMjIyMjIyMjIyMgUkVNT1ZFIG1ldGhvZHMgIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyB0aGUgdGFpbCBub2RlIGZyb20gdGhlIGxpc3RcbiAgICAgICAgICpcbiAgICAgICAgICogVGhlcmUgaXMgYSBzaWduaWZpY2FudCBwZXJmb3JtYW5jZSBpbXByb3ZlbWVudCB3aXRoIHRoZSBvcGVyYXRpb25cbiAgICAgICAgICogb3ZlciBpdHMgc2luZ2x5IGxpbmtlZCBsaXN0IGNvdW50ZXJwYXJ0LiAgVGhlIG1lcmUgZmFjdCBvZiBoYXZpbmdcbiAgICAgICAgICogYSByZWZlcmVuY2UgdG8gdGhlIHByZXZpb3VzIG5vZGUgaW1wcm92ZXMgdGhpcyBvcGVyYXRpb24gZnJvbSBPKG4pXG4gICAgICAgICAqIChpbiB0aGUgY2FzZSBvZiBzaW5nbHkgbGlua2VkIGxpc3QpIHRvIE8oMSkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBub2RlIHRoYXQgd2FzIHJlbW92ZWRcbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGdldCBoYW5kbGUgZm9yIHRoZSB0YWlsIG5vZGVcbiAgICAgICAgICAgIHZhciBub2RlVG9SZW1vdmUgPSB0aGlzLmdldFRhaWxOb2RlKCk7XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lIG5vZGUgaW4gdGhlIGxpc3QsIHNldCBoZWFkIGFuZCB0YWlsXG4gICAgICAgICAgICAvLyBwcm9wZXJ0aWVzIHRvIG51bGxcbiAgICAgICAgICAgIGlmICh0aGlzLmdldFNpemUoKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy50YWlsID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gbW9yZSB0aGFuIG9uZSBub2RlIGluIHRoZSBsaXN0XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGFpbCA9IHRoaXMuZ2V0VGFpbE5vZGUoKS5wcmV2O1xuICAgICAgICAgICAgICAgIHRoaXMudGFpbC5uZXh0ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2l6ZSAtPSAxO1xuXG4gICAgICAgICAgICByZXR1cm4gbm9kZVRvUmVtb3ZlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIHRoZSBoZWFkIG5vZGUgZnJvbSB0aGUgbGlzdFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgbm9kZSB0aGF0IHdhcyByZW1vdmVkXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmVGaXJzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBub2RlVG9SZW1vdmU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmdldFNpemUoKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIG5vZGVUb1JlbW92ZSA9IHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vZGVUb1JlbW92ZSA9IHRoaXMuZ2V0SGVhZE5vZGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQgPSB0aGlzLmhlYWQubmV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQucHJldiA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5zaXplIC09IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBub2RlVG9SZW1vdmU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgdGhlIG5vZGUgYXQgdGhlIGluZGV4IHByb3ZpZGVkXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG5vZGUgdG8gcmVtb3ZlXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBub2RlIHRoYXQgd2FzIHJlbW92ZWRcbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZUF0OiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBub2RlVG9SZW1vdmUgPSB0aGlzLmZpbmRBdChpbmRleCk7XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGZvciBpbmRleCBvdXQtb2YtYm91bmRzXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5nZXRTaXplKCkgLSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIGluZGV4IGlzIDAsIHdlIGp1c3QgbmVlZCB0byByZW1vdmUgdGhlIGZpcnN0IG5vZGVcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUZpcnN0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIGluZGV4IGlzIHNpemUtMSwgd2UganVzdCBuZWVkIHRvIHJlbW92ZSB0aGUgbGFzdCBub2RlLFxuICAgICAgICAgICAgLy8gd2hpY2ggcmVtb3ZlKCkgZG9lcyBieSBkZWZhdWx0XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IHRoaXMuZ2V0U2l6ZSgpIC0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBub2RlVG9SZW1vdmUucHJldi5uZXh0ID0gbm9kZVRvUmVtb3ZlLm5leHQ7XG4gICAgICAgICAgICBub2RlVG9SZW1vdmUubmV4dC5wcmV2ID0gbm9kZVRvUmVtb3ZlLnByZXY7XG4gICAgICAgICAgICBub2RlVG9SZW1vdmUubmV4dCA9IG5vZGVUb1JlbW92ZS5wcmV2ID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5zaXplIC09IDE7XG5cbiAgICAgICAgICAgIHJldHVybiBub2RlVG9SZW1vdmU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgdGhlIGZpcnN0IG5vZGUgdGhhdCBjb250YWlucyB0aGUgZGF0YSBwcm92aWRlZFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBub2RlRGF0YSBUaGUgZGF0YSBvZiB0aGUgbm9kZSB0byByZW1vdmVcbiAgICAgICAgICogQHJldHVybnMgdGhlIG5vZGUgdGhhdCB3YXMgcmVtb3ZlZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlTm9kZTogZnVuY3Rpb24gKG5vZGVEYXRhKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmluZGV4T2Yobm9kZURhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQXQoaW5kZXgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIyMjIyMjIyMjIyMjIyMjIyMjIEZJTkQgbWV0aG9kcyAjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZmlyc3Qgbm9kZSBjb250YWluaW5nIHRoZSBwcm92aWRlZCBkYXRhLiAgSWZcbiAgICAgICAgICogYSBub2RlIGNhbm5vdCBiZSBmb3VuZCBjb250YWluaW5nIHRoZSBwcm92aWRlZCBkYXRhLCAtMSBpcyByZXR1cm5lZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gbm9kZURhdGEgVGhlIGRhdGEgb2YgdGhlIG5vZGUgdG8gZmluZFxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG5vZGUgaWYgZm91bmQsIC0xIG90aGVyd2lzZVxuICAgICAgICAgKi9cbiAgICAgICAgaW5kZXhPZjogZnVuY3Rpb24gKG5vZGVEYXRhKSB7XG4gICAgICAgICAgICB0aGlzLml0ZXJhdG9yLnJlc2V0KCk7XG4gICAgICAgICAgICB2YXIgY3VycmVudDtcblxuICAgICAgICAgICAgdmFyIGluZGV4ID0gMDtcblxuICAgICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIHRoZSBsaXN0IChrZWVwaW5nIHRyYWNrIG9mIHRoZSBpbmRleCB2YWx1ZSkgdW50aWxcbiAgICAgICAgICAgIC8vIHdlIGZpbmQgdGhlIG5vZGUgY29udGFpbmcgdGhlIG5vZGVEYXRhIHdlIGFyZSBsb29raW5nIGZvclxuICAgICAgICAgICAgd2hpbGUgKHRoaXMuaXRlcmF0b3IuaGFzTmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IHRoaXMuaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgICAgICAgIGlmIChpc0VxdWFsKGN1cnJlbnQuZ2V0RGF0YSgpLCBub2RlRGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBvbmx5IGdldCBoZXJlIGlmIHdlIGRpZG4ndCBmaW5kIGEgbm9kZSBjb250YWluaW5nIHRoZSBub2RlRGF0YVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBmaXN0IG5vZGUgY29udGFpbmluZyB0aGUgcHJvdmlkZWQgZGF0YS4gIElmIGEgbm9kZVxuICAgICAgICAgKiBjYW5ub3QgYmUgZm91bmQgY29udGFpbmluZyB0aGUgcHJvdmlkZWQgZGF0YSwgLTEgaXMgcmV0dXJuZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IG5vZGVEYXRhIFRoZSBkYXRhIG9mIHRoZSBub2RlIHRvIGZpbmRcbiAgICAgICAgICogQHJldHVybnMgdGhlIG5vZGUgaWYgZm91bmQsIC0xIG90aGVyd2lzZVxuICAgICAgICAgKi9cbiAgICAgICAgZmluZDogZnVuY3Rpb24gKG5vZGVEYXRhKSB7XG4gICAgICAgICAgICAvLyBzdGFydCBhdCB0aGUgaGVhZCBvZiB0aGUgbGlzdFxuICAgICAgICAgICAgdGhpcy5pdGVyYXRvci5yZXNldCgpO1xuICAgICAgICAgICAgdmFyIGN1cnJlbnQ7XG5cbiAgICAgICAgICAgIC8vIGl0ZXJhdGUgb3ZlciB0aGUgbGlzdCB1bnRpbCB3ZSBmaW5kIHRoZSBub2RlIGNvbnRhaW5pbmcgdGhlIGRhdGFcbiAgICAgICAgICAgIC8vIHdlIGFyZSBsb29raW5nIGZvclxuICAgICAgICAgICAgd2hpbGUgKHRoaXMuaXRlcmF0b3IuaGFzTmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IHRoaXMuaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgICAgICAgIGlmIChpc0VxdWFsKGN1cnJlbnQuZ2V0RGF0YSgpLCBub2RlRGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBvbmx5IGdldCBoZXJlIGlmIHdlIGRpZG4ndCBmaW5kIGEgbm9kZSBjb250YWluaW5nIHRoZSBub2RlRGF0YVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBub2RlIGF0IHRoZSBsb2NhdGlvbiBwcm92aWRlZCBieSBpbmRleFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBub2RlIHRvIHJldHVyblxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgbm9kZSBsb2NhdGVkIGF0IHRoZSBpbmRleCBwcm92aWRlZC5cbiAgICAgICAgICovXG4gICAgICAgIGZpbmRBdDogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICAvLyBpZiBpZHggaXMgb3V0IG9mIGJvdW5kcyBvciBmbiBjYWxsZWQgb24gZW1wdHkgbGlzdCwgcmV0dXJuIC0xXG4gICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkgfHwgaW5kZXggPiB0aGlzLmdldFNpemUoKSAtIDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGVsc2UsIGxvb3AgdGhyb3VnaCB0aGUgbGlzdCBhbmQgcmV0dXJuIHRoZSBub2RlIGluIHRoZVxuICAgICAgICAgICAgLy8gcG9zaXRpb24gcHJvdmlkZWQgYnkgaWR4LiAgQXNzdW1lIHplcm8tYmFzZWQgcG9zaXRpb25zLlxuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmdldEhlYWROb2RlKCk7XG4gICAgICAgICAgICB2YXIgcG9zaXRpb24gPSAwO1xuXG4gICAgICAgICAgICB3aGlsZSAocG9zaXRpb24gPCBpbmRleCkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gKz0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERldGVybWluZXMgd2hldGhlciBvciBub3QgdGhlIGxpc3QgY29udGFpbnMgdGhlIHByb3ZpZGVkIG5vZGVEYXRhXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IG5vZGVEYXRhIFRoZSBkYXRhIHRvIGNoZWNrIGlmIHRoZSBsaXN0XG4gICAgICAgICAqICAgICAgICBjb250YWluc1xuICAgICAgICAgKiBAcmV0dXJucyB0aGUgdHJ1ZSBpZiB0aGUgbGlzdCBjb250YWlucyBub2RlRGF0YSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBjb250YWluczogZnVuY3Rpb24gKG5vZGVEYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbmRleE9mKG5vZGVEYXRhKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyMjIyMjIyMjIyMjIyMjIyMjIyBVVElMSVRZIG1ldGhvZHMgIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXRpbGl0eSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgdGhlIGxpc3QgYW5kIGNhbGwgdGhlIGZuIHByb3ZpZGVkXG4gICAgICAgICAqIG9uIGVhY2ggbm9kZSwgb3IgZWxlbWVudCwgb2YgdGhlIGxpc3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIG9uIGVhY2ggbm9kZSBvZiB0aGUgbGlzdFxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2x9IHJldmVyc2UgVXNlIG9yIG5vdCByZXZlcnNlIGl0ZXJhdGlvbiAodGFpbCB0byBoZWFkKSwgZGVmYXVsdCB0byBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZm9yRWFjaDogZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gICAgICAgICAgICByZXZlcnNlID0gcmV2ZXJzZSB8fCBmYWxzZTtcbiAgICAgICAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVyYXRvci5yZXNldF9yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVyYXRvci5lYWNoX3JldmVyc2UoZm4pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZXJhdG9yLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVyYXRvci5lYWNoKGZuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgdGhlIGRhdGEgY29udGFpbmVkIGluIHRoZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHthcnJheX0gdGhlIGFycmF5IG9mIGFsbCB0aGUgZGF0YSBmcm9tIHRoZSBsaXN0XG4gICAgICAgICAqL1xuICAgICAgICB0b0FycmF5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbGlzdEFycmF5ID0gW107XG4gICAgICAgICAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBsaXN0QXJyYXkucHVzaChub2RlLmdldERhdGEoKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGxpc3RBcnJheTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW50ZXJydXB0cyBpdGVyYXRpb24gb3ZlciB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgaW50ZXJydXB0RW51bWVyYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IuaW50ZXJydXB0KCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBEb3VibHlMaW5rZWRMaXN0O1xuXG59KCkpO1xuIiwiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IEltcGxlbWVudGF0aW9uIG9mIGFuIGl0ZXJhdG9yIGZvciBhIGxpbmtlZCBsaXN0XG4gKiAgICAgICAgICAgICAgIGRhdGEgc3RydWN0dXJlXG4gKiBAYXV0aG9yIEphc29uIFMuIEpvbmVzXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIEl0ZXJhdG9yIGNsYXNzXG4gICAgICpcbiAgICAgKiBSZXByZXNlbnRzIGFuIGluc3RhbnRpYXRpb24gb2YgYW4gaXRlcmF0b3IgdG8gYmUgdXNlZFxuICAgICAqIHdpdGhpbiBhIGxpbmtlZCBsaXN0LiAgVGhlIGl0ZXJhdG9yIHdpbGwgcHJvdmlkZSB0aGUgYWJpbGl0eVxuICAgICAqIHRvIGl0ZXJhdGUgb3ZlciBhbGwgbm9kZXMgaW4gYSBsaXN0IGJ5IGtlZXBpbmcgdHJhY2sgb2YgdGhlXG4gICAgICogcG9zdGl0aW9uIG9mIGEgJ2N1cnJlbnROb2RlJy4gIFRoaXMgJ2N1cnJlbnROb2RlJyBwb2ludGVyXG4gICAgICogd2lsbCBrZWVwIHN0YXRlIHVudGlsIGEgcmVzZXQoKSBvcGVyYXRpb24gaXMgY2FsbGVkIGF0IHdoaWNoXG4gICAgICogdGltZSBpdCB3aWxsIHJlc2V0IHRvIHBvaW50IHRoZSBoZWFkIG9mIHRoZSBsaXN0LlxuICAgICAqXG4gICAgICogRXZlbiB0aG91Z2ggdGhpcyBpdGVyYXRvciBjbGFzcyBpcyBpbmV4dHJpY2FibHkgbGlua2VkXG4gICAgICogKG5vIHB1biBpbnRlbmRlZCkgdG8gYSBsaW5rZWQgbGlzdCBpbnN0YXRpYXRpb24sIGl0IHdhcyByZW1vdmVkXG4gICAgICogZnJvbSB3aXRoaW4gdGhlIGxpbmtlZCBsaXN0IGNvZGUgdG8gYWRoZXJlIHRvIHRoZSBiZXN0IHByYWN0aWNlXG4gICAgICogb2Ygc2VwYXJhdGlvbiBvZiBjb25jZXJucy5cbiAgICAgKlxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGl0ZXJhdG9yIGluc3RhbmNlIHRvIGl0ZXJhdGUgb3ZlciB0aGUgbGlua2VkIGxpc3QgcHJvdmlkZWQuXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdGhlTGlzdCB0aGUgbGlua2VkIGxpc3QgdG8gaXRlcmF0ZSBvdmVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gSXRlcmF0b3IodGhlTGlzdCkge1xuICAgICAgICB0aGlzLmxpc3QgPSB0aGVMaXN0IHx8IG51bGw7XG4gICAgICAgIHRoaXMuc3RvcEl0ZXJhdGlvbkZsYWcgPSBmYWxzZTtcblxuICAgICAgICAvLyBhIHBvaW50ZXIgdGhlIGN1cnJlbnQgbm9kZSBpbiB0aGUgbGlzdCB0aGF0IHdpbGwgYmUgcmV0dXJuZWQuXG4gICAgICAgIC8vIGluaXRpYWxseSB0aGlzIHdpbGwgYmUgbnVsbCBzaW5jZSB0aGUgJ2xpc3QnIHdpbGwgYmUgZW1wdHlcbiAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IG51bGw7XG4gICAgfVxuXG4gICAgLyogRnVuY3Rpb25zIGF0dGFjaGVkIHRvIHRoZSBJdGVyYXRvciBwcm90b3R5cGUuICBBbGwgaXRlcmF0b3IgaW5zdGFuY2VzXG4gICAgICogd2lsbCBzaGFyZSB0aGVzZSBtZXRob2RzLCBtZWFuaW5nIHRoZXJlIHdpbGwgTk9UIGJlIGNvcGllcyBtYWRlIGZvciBlYWNoXG4gICAgICogaW5zdGFuY2UuXG4gICAgICovXG4gICAgSXRlcmF0b3IucHJvdG90eXBlID0ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBuZXh0IG5vZGUgaW4gdGhlIGl0ZXJhdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge29iamVjdH0gdGhlIG5leHQgbm9kZSBpbiB0aGUgaXRlcmF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnROb2RlO1xuICAgICAgICAgICAgLy8gYSBjaGVjayB0byBwcmV2ZW50IGVycm9yIGlmIHJhbmRvbWx5IGNhbGxpbmcgbmV4dCgpIHdoZW5cbiAgICAgICAgICAgIC8vIGl0ZXJhdG9yIGlzIGF0IHRoZSBlbmQgb2YgdGhlIGxpc3QsIG1lYWluaW5nIHRoZSBjdXJyZW50Tm9kZVxuICAgICAgICAgICAgLy8gd2lsbCBiZSBwb2ludGluZyB0byBudWxsLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIFdoZW4gdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQsIGl0IHdpbGwgcmV0dXJuIHRoZSBub2RlIGN1cnJlbnRseVxuICAgICAgICAgICAgLy8gYXNzaWduZWQgdG8gdGhpcy5jdXJyZW50Tm9kZSBhbmQgbW92ZSB0aGUgcG9pbnRlciB0byB0aGUgbmV4dFxuICAgICAgICAgICAgLy8gbm9kZSBpbiB0aGUgbGlzdCAoaWYgaXQgZXhpc3RzKVxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudE5vZGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gdGhpcy5jdXJyZW50Tm9kZS5uZXh0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGV0ZXJtaW5lcyBpZiB0aGUgaXRlcmF0b3IgaGFzIGEgbm9kZSB0byByZXR1cm5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgaXRlcmF0b3IgaGFzIGEgbm9kZSB0byByZXR1cm4sIGZhbHNlIG90aGVyd2lzZVxuICAgICAgICAgKi9cbiAgICAgICAgaGFzTmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudE5vZGUgIT09IG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc2V0cyB0aGUgaXRlcmF0b3IgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgbGlzdC5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gdGhpcy5saXN0LmdldEhlYWROb2RlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGZpcnN0IG5vZGUgaW4gdGhlIGxpc3QgYW5kIG1vdmVzIHRoZSBpdGVyYXRvciB0b1xuICAgICAgICAgKiBwb2ludCB0byB0aGUgc2Vjb25kIG5vZGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBmaXJzdCBub2RlIGluIHRoZSBsaXN0XG4gICAgICAgICAqL1xuICAgICAgICBmaXJzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBsaXN0IHRvIGl0ZXJhdGUgb3ZlclxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gdGhlTGlzdCB0aGUgbGlua2VkIGxpc3QgdG8gaXRlcmF0ZSBvdmVyXG4gICAgICAgICAqL1xuICAgICAgICBzZXRMaXN0OiBmdW5jdGlvbiAodGhlTGlzdCkge1xuICAgICAgICAgICAgdGhpcy5saXN0ID0gdGhlTGlzdDtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSXRlcmF0ZXMgb3ZlciBhbGwgbm9kZXMgaW4gdGhlIGxpc3QgYW5kIGNhbGxzIHRoZSBwcm92aWRlZCBjYWxsYmFja1xuICAgICAgICAgKiBmdW5jdGlvbiB3aXRoIGVhY2ggbm9kZSBhcyBhbiBhcmd1bWVudC5cbiAgICAgICAgICogSXRlcmF0aW9uIHdpbGwgYnJlYWsgaWYgaW50ZXJydXB0KCkgaXMgY2FsbGVkXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2l0aFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICBlYWNoIG5vZGUgb2YgdGhlIGxpc3QgYXMgYW4gYXJnXG4gICAgICAgICAqL1xuICAgICAgICBlYWNoOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHZhciBlbDtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmhhc05leHQoKSAmJiAhdGhpcy5zdG9wSXRlcmF0aW9uRmxhZykge1xuICAgICAgICAgICAgICAgIGVsID0gdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdG9wSXRlcmF0aW9uRmxhZyA9IGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qXG4gICAgICAgICAqICMjIyBSRVZFUlNFIElURVJBVElPTiAoVEFJTCAtPiBIRUFEKSAjIyNcbiAgICAgICAgICovXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGZpcnN0IG5vZGUgaW4gdGhlIGxpc3QgYW5kIG1vdmVzIHRoZSBpdGVyYXRvciB0b1xuICAgICAgICAgKiBwb2ludCB0byB0aGUgc2Vjb25kIG5vZGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBmaXJzdCBub2RlIGluIHRoZSBsaXN0XG4gICAgICAgICAqL1xuICAgICAgICBsYXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0X3JldmVyc2UoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHRfcmV2ZXJzZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNldHMgdGhlIGl0ZXJhdG9yIHRvIHRoZSB0YWlsIG9mIHRoZSBsaXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgcmVzZXRfcmV2ZXJzZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IHRoaXMubGlzdC5nZXRUYWlsTm9kZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBuZXh0IG5vZGUgaW4gdGhlIGl0ZXJhdGlvbiwgd2hlbiBpdGVyYXRpbmcgZnJvbSB0YWlsIHRvIGhlYWRcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge29iamVjdH0gdGhlIG5leHQgbm9kZSBpbiB0aGUgaXRlcmF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgbmV4dF9yZXZlcnNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMuY3VycmVudE5vZGU7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Tm9kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSB0aGlzLmN1cnJlbnROb2RlLnByZXY7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJdGVyYXRlcyBvdmVyIGFsbCBub2RlcyBpbiB0aGUgbGlzdCBhbmQgY2FsbHMgdGhlIHByb3ZpZGVkIGNhbGxiYWNrXG4gICAgICAgICAqIGZ1bmN0aW9uIHdpdGggZWFjaCBub2RlIGFzIGFuIGFyZ3VtZW50LFxuICAgICAgICAgKiBzdGFydGluZyBmcm9tIHRoZSB0YWlsIGFuZCBnb2luZyB0b3dhcmRzIHRoZSBoZWFkLlxuICAgICAgICAgKiBUaGUgaXRlcmF0aW9uIHdpbGwgYnJlYWsgaWYgaW50ZXJydXB0KCkgaXMgY2FsbGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdpdGhpblxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgZWFjaCBub2RlIGFzIGFuIGFyZ1xuICAgICAgICAgKi9cbiAgICAgICAgZWFjaF9yZXZlcnNlOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRfcmV2ZXJzZSgpO1xuICAgICAgICAgICAgdmFyIGVsO1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMuaGFzTmV4dCgpICYmICF0aGlzLnN0b3BJdGVyYXRpb25GbGFnKSB7XG4gICAgICAgICAgICAgICAgZWwgPSB0aGlzLm5leHRfcmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RvcEl0ZXJhdGlvbkZsYWcgPSBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKlxuICAgICAgICAgKiAjIyMgSU5URVJSVVBUIElURVJBVElPTiAjIyNcbiAgICAgICAgICovXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJhaXNlcyBpbnRlcnJ1cHQgZmxhZyAodGhhdCB3aWxsIHN0b3AgZWFjaCgpIG9yIGVhY2hfcmV2ZXJzZSgpKVxuICAgICAgICAgKi9cblxuICAgICAgICBpbnRlcnJ1cHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEl0ZXJhdGlvbkZsYWcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gSXRlcmF0b3I7XG5cbn0oKSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIExpbmtlZCBsaXN0IG5vZGUgY2xhc3NcbiAgICAgKlxuICAgICAqIEludGVybmFsIHByaXZhdGUgY2xhc3MgdG8gcmVwcmVzZW50IGEgbm9kZSB3aXRoaW5cbiAgICAgKiBhIGxpbmtlZCBsaXN0LiAgRWFjaCBub2RlIGhhcyBhICdkYXRhJyBwcm9wZXJ0eSBhbmRcbiAgICAgKiBhIHBvaW50ZXIgdGhlIHByZXZpb3VzIG5vZGUgYW5kIHRoZSBuZXh0IG5vZGUgaW4gdGhlIGxpc3QuXG4gICAgICpcbiAgICAgKiBTaW5jZSB0aGUgJ05vZGUnIGZ1bmN0aW9uIGlzIG5vdCBhc3NpZ25lZCB0b1xuICAgICAqIG1vZHVsZS5leHBvcnRzIGl0IGlzIG5vdCB2aXNpYmxlIG91dHNpZGUgb2YgdGhpc1xuICAgICAqIGZpbGUsIHRoZXJlZm9yZSwgaXQgaXMgcHJpdmF0ZSB0byB0aGUgTGlua2VkTGlzdFxuICAgICAqIGNsYXNzLlxuICAgICAqXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBub2RlIG9iamVjdCB3aXRoIGEgZGF0YSBwcm9wZXJ0eSBhbmQgcG9pbnRlclxuICAgICAqIHRvIHRoZSBuZXh0IG5vZGVcbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fG51bWJlcnxzdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZSBub2RlXG4gICAgICovXG4gICAgZnVuY3Rpb24gTm9kZShkYXRhKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMubmV4dCA9IG51bGw7XG4gICAgICAgIHRoaXMucHJldiA9IG51bGw7XG4gICAgfVxuXG4gICAgLyogRnVuY3Rpb25zIGF0dGFjaGVkIHRvIHRoZSBOb2RlIHByb3RvdHlwZS4gIEFsbCBub2RlIGluc3RhbmNlcyB3aWxsXG4gICAgICogc2hhcmUgdGhlc2UgbWV0aG9kcywgbWVhbmluZyB0aGVyZSB3aWxsIE5PVCBiZSBjb3BpZXMgbWFkZSBmb3IgZWFjaFxuICAgICAqIGluc3RhbmNlLiAgVGhpcyB3aWxsIGJlIGEgaHVnZSBtZW1vcnkgc2F2aW5ncyBzaW5jZSB0aGVyZSB3aWxsIGxpa2VseVxuICAgICAqIGJlIGEgbGFyZ2UgbnVtYmVyIG9mIGluZGl2aWR1YWwgbm9kZXMuXG4gICAgICovXG4gICAgTm9kZS5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIG5vZGUgaGFzIGEgcG9pbnRlciB0byB0aGUgbmV4dCBub2RlXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZXJlIGlzIGEgbmV4dCBub2RlOyBmYWxzZSBvdGhlcndpc2VcbiAgICAgICAgICovXG4gICAgICAgIGhhc05leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5uZXh0ICE9PSBudWxsKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgbm9kZSBoYXMgYSBwb2ludGVyIHRvIHRoZSBwcmV2aW91cyBub2RlXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZXJlIGlzIGEgcHJldmlvdXMgbm9kZTsgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBoYXNQcmV2OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMucHJldiAhPT0gbnVsbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGRhdGEgb2YgdGhlIHRoZSBub2RlXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gdGhlIGRhdGEgb2YgdGhlIG5vZGVcbiAgICAgICAgICovXG4gICAgICAgIGdldERhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW5hdGlvbiBvZiB0aGUgbm9kZS4gIElmIHRoZSBkYXRhIGlzIGFuXG4gICAgICAgICAqIG9iamVjdCwgaXQgcmV0dXJucyB0aGUgSlNPTi5zdHJpbmdpZnkgdmVyc2lvbiBvZiB0aGUgb2JqZWN0LlxuICAgICAgICAgKiBPdGhlcndpc2UsIGl0IHNpbXBseSByZXR1cm5zIHRoZSBkYXRhXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIHN0cmluZyByZXByZXNlbmF0aW9uIG9mIHRoZSBub2RlIGRhdGFcbiAgICAgICAgICovXG4gICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuZGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh0aGlzLmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gTm9kZTtcblxufSgpKTtcbiIsIi8qKlxuICogTG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgSlMgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pzLmZvdW5kYXRpb24vPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxLFxuICAgIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcgPSAyO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcHJvbWlzZVRhZyA9ICdbb2JqZWN0IFByb21pc2VdJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZmlsdGVyYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RmlsdGVyKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc0luZGV4ID0gMCxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJlc3VsdFtyZXNJbmRleCsrXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlQdXNoKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgb2Zmc2V0ID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbb2Zmc2V0ICsgaW5kZXhdID0gdmFsdWVzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLnNvbWVgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW55IGVsZW1lbnQgcGFzc2VzIHRoZSBwcmVkaWNhdGUgY2hlY2ssXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhcnJheVNvbWUoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBgY2FjaGVgIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBjYWNoZSBUaGUgY2FjaGUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gY2FjaGVIYXMoY2FjaGUsIGtleSkge1xuICByZXR1cm4gY2FjaGUuaGFzKGtleSk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBtYXBgIHRvIGl0cyBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBrZXktdmFsdWUgcGFpcnMuXG4gKi9cbmZ1bmN0aW9uIG1hcFRvQXJyYXkobWFwKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobWFwLnNpemUpO1xuXG4gIG1hcC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSBba2V5LCB2YWx1ZV07XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgc2V0YCB0byBhbiBhcnJheSBvZiBpdHMgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0IFRoZSBzZXQgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBzZXRUb0FycmF5KHNldCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KHNldC5zaXplKTtcblxuICBzZXQuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IHZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsXG4gICAgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkLFxuICAgIFN5bWJvbCA9IHJvb3QuU3ltYm9sLFxuICAgIFVpbnQ4QXJyYXkgPSByb290LlVpbnQ4QXJyYXksXG4gICAgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZSxcbiAgICBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZSxcbiAgICBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUdldFN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICAgIG5hdGl2ZUlzQnVmZmVyID0gQnVmZmVyID8gQnVmZmVyLmlzQnVmZmVyIDogdW5kZWZpbmVkLFxuICAgIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgRGF0YVZpZXcgPSBnZXROYXRpdmUocm9vdCwgJ0RhdGFWaWV3JyksXG4gICAgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKSxcbiAgICBQcm9taXNlID0gZ2V0TmF0aXZlKHJvb3QsICdQcm9taXNlJyksXG4gICAgU2V0ID0gZ2V0TmF0aXZlKHJvb3QsICdTZXQnKSxcbiAgICBXZWFrTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdXZWFrTWFwJyksXG4gICAgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWFwcywgc2V0cywgYW5kIHdlYWttYXBzLiAqL1xudmFyIGRhdGFWaWV3Q3RvclN0cmluZyA9IHRvU291cmNlKERhdGFWaWV3KSxcbiAgICBtYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoTWFwKSxcbiAgICBwcm9taXNlQ3RvclN0cmluZyA9IHRvU291cmNlKFByb21pc2UpLFxuICAgIHNldEN0b3JTdHJpbmcgPSB0b1NvdXJjZShTZXQpLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoV2Vha01hcCk7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xWYWx1ZU9mID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by52YWx1ZU9mIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGhhc2ggdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSA/IChkYXRhW2tleV0gIT09IHVuZGVmaW5lZCkgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGFzc29jSW5kZXhPZih0aGlzLl9fZGF0YV9fLCBrZXkpID4gLTE7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYExpc3RDYWNoZWAuXG5MaXN0Q2FjaGUucHJvdG90eXBlLmNsZWFyID0gbGlzdENhY2hlQ2xlYXI7XG5MaXN0Q2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IGxpc3RDYWNoZURlbGV0ZTtcbkxpc3RDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbGlzdENhY2hlR2V0O1xuTGlzdENhY2hlLnByb3RvdHlwZS5oYXMgPSBsaXN0Q2FjaGVIYXM7XG5MaXN0Q2FjaGUucHJvdG90eXBlLnNldCA9IGxpc3RDYWNoZVNldDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5zaXplID0gMDtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBtYXAgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlR2V0KGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmdldChrZXkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIG1hcCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG4vKipcbiAqXG4gKiBDcmVhdGVzIGFuIGFycmF5IGNhY2hlIG9iamVjdCB0byBzdG9yZSB1bmlxdWUgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFNldENhY2hlKHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcyA9PSBudWxsID8gMCA6IHZhbHVlcy5sZW5ndGg7XG5cbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB0aGlzLmFkZCh2YWx1ZXNbaW5kZXhdKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZHMgYHZhbHVlYCB0byB0aGUgYXJyYXkgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGFkZFxuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAYWxpYXMgcHVzaFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2FjaGUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVBZGQodmFsdWUpIHtcbiAgdGhpcy5fX2RhdGFfXy5zZXQodmFsdWUsIEhBU0hfVU5ERUZJTkVEKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgaW4gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVIYXModmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKHZhbHVlKTtcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFNldENhY2hlYC5cblNldENhY2hlLnByb3RvdHlwZS5hZGQgPSBTZXRDYWNoZS5wcm90b3R5cGUucHVzaCA9IHNldENhY2hlQWRkO1xuU2V0Q2FjaGUucHJvdG90eXBlLmhhcyA9IHNldENhY2hlSGFzO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzdGFjayBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTdGFjayhlbnRyaWVzKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGUoZW50cmllcyk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBTdGFja1xuICovXG5mdW5jdGlvbiBzdGFja0NsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIHJlc3VsdCA9IGRhdGFbJ2RlbGV0ZSddKGtleSk7XG5cbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHN0YWNrIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzdGFja0dldChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KGtleSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgc3RhY2sgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0hhcyhrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhY2sgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgc3RhY2sgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIExpc3RDYWNoZSkge1xuICAgIHZhciBwYWlycyA9IGRhdGEuX19kYXRhX187XG4gICAgaWYgKCFNYXAgfHwgKHBhaXJzLmxlbmd0aCA8IExBUkdFX0FSUkFZX1NJWkUgLSAxKSkge1xuICAgICAgcGFpcnMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgdGhpcy5zaXplID0gKytkYXRhLnNpemU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGUocGFpcnMpO1xuICB9XG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU3RhY2tgLlxuU3RhY2sucHJvdG90eXBlLmNsZWFyID0gc3RhY2tDbGVhcjtcblN0YWNrLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBzdGFja0RlbGV0ZTtcblN0YWNrLnByb3RvdHlwZS5nZXQgPSBzdGFja0dldDtcblN0YWNrLnByb3RvdHlwZS5oYXMgPSBzdGFja0hhcztcblN0YWNrLnByb3RvdHlwZS5zZXQgPSBzdGFja1NldDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIHRoZSBhcnJheS1saWtlIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtib29sZWFufSBpbmhlcml0ZWQgU3BlY2lmeSByZXR1cm5pbmcgaW5oZXJpdGVkIHByb3BlcnR5IG5hbWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlMaWtlS2V5cyh2YWx1ZSwgaW5oZXJpdGVkKSB7XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpLFxuICAgICAgaXNBcmcgPSAhaXNBcnIgJiYgaXNBcmd1bWVudHModmFsdWUpLFxuICAgICAgaXNCdWZmID0gIWlzQXJyICYmICFpc0FyZyAmJiBpc0J1ZmZlcih2YWx1ZSksXG4gICAgICBpc1R5cGUgPSAhaXNBcnIgJiYgIWlzQXJnICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHZhbHVlKSxcbiAgICAgIHNraXBJbmRleGVzID0gaXNBcnIgfHwgaXNBcmcgfHwgaXNCdWZmIHx8IGlzVHlwZSxcbiAgICAgIHJlc3VsdCA9IHNraXBJbmRleGVzID8gYmFzZVRpbWVzKHZhbHVlLmxlbmd0aCwgU3RyaW5nKSA6IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSAmJlxuICAgICAgICAhKHNraXBJbmRleGVzICYmIChcbiAgICAgICAgICAgLy8gU2FmYXJpIDkgaGFzIGVudW1lcmFibGUgYGFyZ3VtZW50cy5sZW5ndGhgIGluIHN0cmljdCBtb2RlLlxuICAgICAgICAgICBrZXkgPT0gJ2xlbmd0aCcgfHxcbiAgICAgICAgICAgLy8gTm9kZS5qcyAwLjEwIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIGJ1ZmZlcnMuXG4gICAgICAgICAgIChpc0J1ZmYgJiYgKGtleSA9PSAnb2Zmc2V0JyB8fCBrZXkgPT0gJ3BhcmVudCcpKSB8fFxuICAgICAgICAgICAvLyBQaGFudG9tSlMgMiBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiB0eXBlZCBhcnJheXMuXG4gICAgICAgICAgIChpc1R5cGUgJiYgKGtleSA9PSAnYnVmZmVyJyB8fCBrZXkgPT0gJ2J5dGVMZW5ndGgnIHx8IGtleSA9PSAnYnl0ZU9mZnNldCcpKSB8fFxuICAgICAgICAgICAvLyBTa2lwIGluZGV4IHByb3BlcnRpZXMuXG4gICAgICAgICAgIGlzSW5kZXgoa2V5LCBsZW5ndGgpXG4gICAgICAgICkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRBbGxLZXlzYCBhbmQgYGdldEFsbEtleXNJbmAgd2hpY2ggdXNlc1xuICogYGtleXNGdW5jYCBhbmQgYHN5bWJvbHNGdW5jYCB0byBnZXQgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kXG4gKiBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3ltYm9sc0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5c0Z1bmMsIHN5bWJvbHNGdW5jKSB7XG4gIHZhciByZXN1bHQgPSBrZXlzRnVuYyhvYmplY3QpO1xuICByZXR1cm4gaXNBcnJheShvYmplY3QpID8gcmVzdWx0IDogYXJyYXlQdXNoKHJlc3VsdCwgc3ltYm9sc0Z1bmMob2JqZWN0KSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0VxdWFsYCB3aGljaCBzdXBwb3J0cyBwYXJ0aWFsIGNvbXBhcmlzb25zXG4gKiBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy5cbiAqICAxIC0gVW5vcmRlcmVkIGNvbXBhcmlzb25cbiAqICAyIC0gUGFydGlhbCBjb21wYXJpc29uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYHZhbHVlYCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykge1xuICBpZiAodmFsdWUgPT09IG90aGVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwgfHwgb3RoZXIgPT0gbnVsbCB8fCAoIWlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgIWlzT2JqZWN0TGlrZShvdGhlcikpKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXI7XG4gIH1cbiAgcmV0dXJuIGJhc2VJc0VxdWFsRGVlcCh2YWx1ZSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGJhc2VJc0VxdWFsLCBzdGFjayk7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbGAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBjb21wYXJpc29ucyBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGVuYWJsaW5nIG9iamVjdHMgd2l0aCBjaXJjdWxhclxuICogcmVmZXJlbmNlcyB0byBiZSBjb21wYXJlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWxEZWVwKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIG9iaklzQXJyID0gaXNBcnJheShvYmplY3QpLFxuICAgICAgb3RoSXNBcnIgPSBpc0FycmF5KG90aGVyKSxcbiAgICAgIG9ialRhZyA9IG9iaklzQXJyID8gYXJyYXlUYWcgOiBnZXRUYWcob2JqZWN0KSxcbiAgICAgIG90aFRhZyA9IG90aElzQXJyID8gYXJyYXlUYWcgOiBnZXRUYWcob3RoZXIpO1xuXG4gIG9ialRhZyA9IG9ialRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb2JqVGFnO1xuICBvdGhUYWcgPSBvdGhUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG90aFRhZztcblxuICB2YXIgb2JqSXNPYmogPSBvYmpUYWcgPT0gb2JqZWN0VGFnLFxuICAgICAgb3RoSXNPYmogPSBvdGhUYWcgPT0gb2JqZWN0VGFnLFxuICAgICAgaXNTYW1lVGFnID0gb2JqVGFnID09IG90aFRhZztcblxuICBpZiAoaXNTYW1lVGFnICYmIGlzQnVmZmVyKG9iamVjdCkpIHtcbiAgICBpZiAoIWlzQnVmZmVyKG90aGVyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBvYmpJc0FyciA9IHRydWU7XG4gICAgb2JqSXNPYmogPSBmYWxzZTtcbiAgfVxuICBpZiAoaXNTYW1lVGFnICYmICFvYmpJc09iaikge1xuICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgcmV0dXJuIChvYmpJc0FyciB8fCBpc1R5cGVkQXJyYXkob2JqZWN0KSlcbiAgICAgID8gZXF1YWxBcnJheXMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaylcbiAgICAgIDogZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCBvYmpUYWcsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xuICB9XG4gIGlmICghKGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRykpIHtcbiAgICB2YXIgb2JqSXNXcmFwcGVkID0gb2JqSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsICdfX3dyYXBwZWRfXycpLFxuICAgICAgICBvdGhJc1dyYXBwZWQgPSBvdGhJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCAnX193cmFwcGVkX18nKTtcblxuICAgIGlmIChvYmpJc1dyYXBwZWQgfHwgb3RoSXNXcmFwcGVkKSB7XG4gICAgICB2YXIgb2JqVW53cmFwcGVkID0gb2JqSXNXcmFwcGVkID8gb2JqZWN0LnZhbHVlKCkgOiBvYmplY3QsXG4gICAgICAgICAgb3RoVW53cmFwcGVkID0gb3RoSXNXcmFwcGVkID8gb3RoZXIudmFsdWUoKSA6IG90aGVyO1xuXG4gICAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgICAgcmV0dXJuIGVxdWFsRnVuYyhvYmpVbndyYXBwZWQsIG90aFVud3JhcHBlZCwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spO1xuICAgIH1cbiAgfVxuICBpZiAoIWlzU2FtZVRhZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICByZXR1cm4gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGFycmF5cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtBcnJheX0gb3RoZXIgVGhlIG90aGVyIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBhcnJheWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJyYXlzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQXJyYXlzKGFycmF5LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHLFxuICAgICAgYXJyTGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoZXIubGVuZ3RoO1xuXG4gIGlmIChhcnJMZW5ndGggIT0gb3RoTGVuZ3RoICYmICEoaXNQYXJ0aWFsICYmIG90aExlbmd0aCA+IGFyckxlbmd0aCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChhcnJheSk7XG4gIGlmIChzdGFja2VkICYmIHN0YWNrLmdldChvdGhlcikpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IHRydWUsXG4gICAgICBzZWVuID0gKGJpdG1hc2sgJiBDT01QQVJFX1VOT1JERVJFRF9GTEFHKSA/IG5ldyBTZXRDYWNoZSA6IHVuZGVmaW5lZDtcblxuICBzdGFjay5zZXQoYXJyYXksIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBhcnJheSk7XG5cbiAgLy8gSWdub3JlIG5vbi1pbmRleCBwcm9wZXJ0aWVzLlxuICB3aGlsZSAoKytpbmRleCA8IGFyckxlbmd0aCkge1xuICAgIHZhciBhcnJWYWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltpbmRleF07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgYXJyVmFsdWUsIGluZGV4LCBvdGhlciwgYXJyYXksIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIoYXJyVmFsdWUsIG90aFZhbHVlLCBpbmRleCwgYXJyYXksIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIGlmIChjb21wYXJlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoY29tcGFyZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmIChzZWVuKSB7XG4gICAgICBpZiAoIWFycmF5U29tZShvdGhlciwgZnVuY3Rpb24ob3RoVmFsdWUsIG90aEluZGV4KSB7XG4gICAgICAgICAgICBpZiAoIWNhY2hlSGFzKHNlZW4sIG90aEluZGV4KSAmJlxuICAgICAgICAgICAgICAgIChhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spKSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2Vlbi5wdXNoKG90aEluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghKFxuICAgICAgICAgIGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fFxuICAgICAgICAgICAgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShhcnJheSk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBjb21wYXJpbmcgb2JqZWN0cyBvZlxuICogdGhlIHNhbWUgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNvbXBhcmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0cyB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgdGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAob2JqZWN0LmJ5dGVPZmZzZXQgIT0gb3RoZXIuYnl0ZU9mZnNldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgb2JqZWN0ID0gb2JqZWN0LmJ1ZmZlcjtcbiAgICAgIG90aGVyID0gb3RoZXIuYnVmZmVyO1xuXG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAhZXF1YWxGdW5jKG5ldyBVaW50OEFycmF5KG9iamVjdCksIG5ldyBVaW50OEFycmF5KG90aGVyKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgICAgLy8gQ29lcmNlIGJvb2xlYW5zIHRvIGAxYCBvciBgMGAgYW5kIGRhdGVzIHRvIG1pbGxpc2Vjb25kcy5cbiAgICAgIC8vIEludmFsaWQgZGF0ZXMgYXJlIGNvZXJjZWQgdG8gYE5hTmAuXG4gICAgICByZXR1cm4gZXEoK29iamVjdCwgK290aGVyKTtcblxuICAgIGNhc2UgZXJyb3JUYWc6XG4gICAgICByZXR1cm4gb2JqZWN0Lm5hbWUgPT0gb3RoZXIubmFtZSAmJiBvYmplY3QubWVzc2FnZSA9PSBvdGhlci5tZXNzYWdlO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICAvLyBDb2VyY2UgcmVnZXhlcyB0byBzdHJpbmdzIGFuZCB0cmVhdCBzdHJpbmdzLCBwcmltaXRpdmVzIGFuZCBvYmplY3RzLFxuICAgICAgLy8gYXMgZXF1YWwuIFNlZSBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcmVnZXhwLnByb3RvdHlwZS50b3N0cmluZ1xuICAgICAgLy8gZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgIHJldHVybiBvYmplY3QgPT0gKG90aGVyICsgJycpO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICB2YXIgY29udmVydCA9IG1hcFRvQXJyYXk7XG5cbiAgICBjYXNlIHNldFRhZzpcbiAgICAgIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUc7XG4gICAgICBjb252ZXJ0IHx8IChjb252ZXJ0ID0gc2V0VG9BcnJheSk7XG5cbiAgICAgIGlmIChvYmplY3Quc2l6ZSAhPSBvdGhlci5zaXplICYmICFpc1BhcnRpYWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICAgICAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgICAgIGlmIChzdGFja2VkKSB7XG4gICAgICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICAgICAgfVxuICAgICAgYml0bWFzayB8PSBDT01QQVJFX1VOT1JERVJFRF9GTEFHO1xuXG4gICAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgICAgIHZhciByZXN1bHQgPSBlcXVhbEFycmF5cyhjb252ZXJ0KG9iamVjdCksIGNvbnZlcnQob3RoZXIpLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgICAgIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgIGNhc2Ugc3ltYm9sVGFnOlxuICAgICAgaWYgKHN5bWJvbFZhbHVlT2YpIHtcbiAgICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlT2YuY2FsbChvYmplY3QpID09IHN5bWJvbFZhbHVlT2YuY2FsbChvdGhlcik7XG4gICAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3Igb2JqZWN0cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHLFxuICAgICAgb2JqUHJvcHMgPSBnZXRBbGxLZXlzKG9iamVjdCksXG4gICAgICBvYmpMZW5ndGggPSBvYmpQcm9wcy5sZW5ndGgsXG4gICAgICBvdGhQcm9wcyA9IGdldEFsbEtleXMob3RoZXIpLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoUHJvcHMubGVuZ3RoO1xuXG4gIGlmIChvYmpMZW5ndGggIT0gb3RoTGVuZ3RoICYmICFpc1BhcnRpYWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGluZGV4ID0gb2JqTGVuZ3RoO1xuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIHZhciBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgaWYgKCEoaXNQYXJ0aWFsID8ga2V5IGluIG90aGVyIDogaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwga2V5KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICBpZiAoc3RhY2tlZCAmJiBzdGFjay5nZXQob3RoZXIpKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHRydWU7XG4gIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBvYmplY3QpO1xuXG4gIHZhciBza2lwQ3RvciA9IGlzUGFydGlhbDtcbiAgd2hpbGUgKCsraW5kZXggPCBvYmpMZW5ndGgpIHtcbiAgICBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJba2V5XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBvYmpWYWx1ZSwga2V5LCBvdGhlciwgb2JqZWN0LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKG9ialZhbHVlLCBvdGhWYWx1ZSwga2V5LCBvYmplY3QsIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmICghKGNvbXBhcmVkID09PSB1bmRlZmluZWRcbiAgICAgICAgICA/IChvYmpWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKG9ialZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spKVxuICAgICAgICAgIDogY29tcGFyZWRcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc2tpcEN0b3IgfHwgKHNraXBDdG9yID0ga2V5ID09ICdjb25zdHJ1Y3RvcicpO1xuICB9XG4gIGlmIChyZXN1bHQgJiYgIXNraXBDdG9yKSB7XG4gICAgdmFyIG9iakN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgIG90aEN0b3IgPSBvdGhlci5jb25zdHJ1Y3RvcjtcblxuICAgIC8vIE5vbiBgT2JqZWN0YCBvYmplY3QgaW5zdGFuY2VzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWFsLlxuICAgIGlmIChvYmpDdG9yICE9IG90aEN0b3IgJiZcbiAgICAgICAgKCdjb25zdHJ1Y3RvcicgaW4gb2JqZWN0ICYmICdjb25zdHJ1Y3RvcicgaW4gb3RoZXIpICYmXG4gICAgICAgICEodHlwZW9mIG9iakN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvYmpDdG9yIGluc3RhbmNlb2Ygb2JqQ3RvciAmJlxuICAgICAgICAgIHR5cGVvZiBvdGhDdG9yID09ICdmdW5jdGlvbicgJiYgb3RoQ3RvciBpbnN0YW5jZW9mIG90aEN0b3IpKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5cywgZ2V0U3ltYm9scyk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0YSBmb3IgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHJlZmVyZW5jZSBrZXkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGdldE1hcERhdGEobWFwLCBrZXkpIHtcbiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187XG4gIHJldHVybiBpc0tleWFibGUoa2V5KVxuICAgID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddXG4gICAgOiBkYXRhLm1hcDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHN5bWJvbHMuXG4gKi9cbnZhciBnZXRTeW1ib2xzID0gIW5hdGl2ZUdldFN5bWJvbHMgPyBzdHViQXJyYXkgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICByZXR1cm4gYXJyYXlGaWx0ZXIobmF0aXZlR2V0U3ltYm9scyhvYmplY3QpLCBmdW5jdGlvbihzeW1ib2wpIHtcbiAgICByZXR1cm4gcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChvYmplY3QsIHN5bWJvbCk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzIDwgNi5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VHZXRUYWcodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogJyc7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgJiZcbiAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJndW1lbnRzID0gYmFzZUlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID8gYmFzZUlzQXJndW1lbnRzIDogZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn07XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgZGVlcCBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmVcbiAqIGVxdWl2YWxlbnQuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIHN1cHBvcnRzIGNvbXBhcmluZyBhcnJheXMsIGFycmF5IGJ1ZmZlcnMsIGJvb2xlYW5zLFxuICogZGF0ZSBvYmplY3RzLCBlcnJvciBvYmplY3RzLCBtYXBzLCBudW1iZXJzLCBgT2JqZWN0YCBvYmplY3RzLCByZWdleGVzLFxuICogc2V0cywgc3RyaW5ncywgc3ltYm9scywgYW5kIHR5cGVkIGFycmF5cy4gYE9iamVjdGAgb2JqZWN0cyBhcmUgY29tcGFyZWRcbiAqIGJ5IHRoZWlyIG93biwgbm90IGluaGVyaXRlZCwgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLiBGdW5jdGlvbnMgYW5kIERPTVxuICogbm9kZXMgYXJlIGNvbXBhcmVkIGJ5IHN0cmljdCBlcXVhbGl0eSwgaS5lLiBgPT09YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5pc0VxdWFsKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIG9iamVjdCA9PT0gb3RoZXI7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0VxdWFsKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIG5ldyBlbXB0eSBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGVtcHR5IGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXlzID0gXy50aW1lcygyLCBfLnN0dWJBcnJheSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzKTtcbiAqIC8vID0+IFtbXSwgW11dXG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzWzBdID09PSBhcnJheXNbMV0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3R1YkFycmF5KCkge1xuICByZXR1cm4gW107XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VxdWFsO1xuIiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qaXN0YW5idWwgaWdub3JlIG5leHQ6Y2FudCB0ZXN0Ki9cbiAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICByb290Lm9iamVjdFBhdGggPSBmYWN0b3J5KCk7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uKCl7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXJcbiAgICB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgX2hhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuICBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKXtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKCFpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKF9oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9TdHJpbmcodHlwZSl7XG4gICAgcmV0dXJuIHRvU3RyLmNhbGwodHlwZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc051bWJlcih2YWx1ZSl7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgTnVtYmVyXVwiO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNTdHJpbmcob2JqKXtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgfHwgdG9TdHJpbmcob2JqKSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzT2JqZWN0KG9iail7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIHRvU3RyaW5nKG9iaikgPT09IFwiW29iamVjdCBPYmplY3RdXCI7XG4gIH1cblxuICBmdW5jdGlvbiBpc0FycmF5KG9iail7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIHR5cGVvZiBvYmoubGVuZ3RoID09PSAnbnVtYmVyJyAmJiB0b1N0cmluZyhvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNCb29sZWFuKG9iail7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdib29sZWFuJyB8fCB0b1N0cmluZyhvYmopID09PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRLZXkoa2V5KXtcbiAgICB2YXIgaW50S2V5ID0gcGFyc2VJbnQoa2V5KTtcbiAgICBpZiAoaW50S2V5LnRvU3RyaW5nKCkgPT09IGtleSkge1xuICAgICAgcmV0dXJuIGludEtleTtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldChvYmosIHBhdGgsIHZhbHVlLCBkb05vdFJlcGxhY2Upe1xuICAgIGlmIChpc051bWJlcihwYXRoKSkge1xuICAgICAgcGF0aCA9IFtwYXRoXTtcbiAgICB9XG4gICAgaWYgKGlzRW1wdHkocGF0aCkpIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmIChpc1N0cmluZyhwYXRoKSkge1xuICAgICAgcmV0dXJuIHNldChvYmosIHBhdGguc3BsaXQoJy4nKS5tYXAoZ2V0S2V5KSwgdmFsdWUsIGRvTm90UmVwbGFjZSk7XG4gICAgfVxuICAgIHZhciBjdXJyZW50UGF0aCA9IHBhdGhbMF07XG5cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciBvbGRWYWwgPSBvYmpbY3VycmVudFBhdGhdO1xuICAgICAgaWYgKG9sZFZhbCA9PT0gdm9pZCAwIHx8ICFkb05vdFJlcGxhY2UpIHtcbiAgICAgICAgb2JqW2N1cnJlbnRQYXRoXSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9sZFZhbDtcbiAgICB9XG5cbiAgICBpZiAob2JqW2N1cnJlbnRQYXRoXSA9PT0gdm9pZCAwKSB7XG4gICAgICAvL2NoZWNrIGlmIHdlIGFzc3VtZSBhbiBhcnJheVxuICAgICAgaWYoaXNOdW1iZXIocGF0aFsxXSkpIHtcbiAgICAgICAgb2JqW2N1cnJlbnRQYXRoXSA9IFtdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW2N1cnJlbnRQYXRoXSA9IHt9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzZXQob2JqW2N1cnJlbnRQYXRoXSwgcGF0aC5zbGljZSgxKSwgdmFsdWUsIGRvTm90UmVwbGFjZSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWwob2JqLCBwYXRoKSB7XG4gICAgaWYgKGlzTnVtYmVyKHBhdGgpKSB7XG4gICAgICBwYXRoID0gW3BhdGhdO1xuICAgIH1cblxuICAgIGlmIChpc0VtcHR5KG9iaikpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuXG4gICAgaWYgKGlzRW1wdHkocGF0aCkpIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmKGlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICByZXR1cm4gZGVsKG9iaiwgcGF0aC5zcGxpdCgnLicpKTtcbiAgICB9XG5cbiAgICB2YXIgY3VycmVudFBhdGggPSBnZXRLZXkocGF0aFswXSk7XG4gICAgdmFyIG9sZFZhbCA9IG9ialtjdXJyZW50UGF0aF07XG5cbiAgICBpZihwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKG9sZFZhbCAhPT0gdm9pZCAwKSB7XG4gICAgICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgICBvYmouc3BsaWNlKGN1cnJlbnRQYXRoLCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgb2JqW2N1cnJlbnRQYXRoXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob2JqW2N1cnJlbnRQYXRoXSAhPT0gdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiBkZWwob2JqW2N1cnJlbnRQYXRoXSwgcGF0aC5zbGljZSgxKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHZhciBvYmplY3RQYXRoID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdFBhdGgpLnJlZHVjZShmdW5jdGlvbihwcm94eSwgcHJvcCkge1xuICAgICAgaWYgKHR5cGVvZiBvYmplY3RQYXRoW3Byb3BdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHByb3h5W3Byb3BdID0gb2JqZWN0UGF0aFtwcm9wXS5iaW5kKG9iamVjdFBhdGgsIG9iaik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm94eTtcbiAgICB9LCB7fSk7XG4gIH07XG5cbiAgb2JqZWN0UGF0aC5oYXMgPSBmdW5jdGlvbiAob2JqLCBwYXRoKSB7XG4gICAgaWYgKGlzRW1wdHkob2JqKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpc051bWJlcihwYXRoKSkge1xuICAgICAgcGF0aCA9IFtwYXRoXTtcbiAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICBwYXRoID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIH1cblxuICAgIGlmIChpc0VtcHR5KHBhdGgpIHx8IHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaiA9IHBhdGhbaV07XG4gICAgICBpZiAoKGlzT2JqZWN0KG9iaikgfHwgaXNBcnJheShvYmopKSAmJiBfaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGopKSB7XG4gICAgICAgIG9iaiA9IG9ialtqXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBvYmplY3RQYXRoLmVuc3VyZUV4aXN0cyA9IGZ1bmN0aW9uIChvYmosIHBhdGgsIHZhbHVlKXtcbiAgICByZXR1cm4gc2V0KG9iaiwgcGF0aCwgdmFsdWUsIHRydWUpO1xuICB9O1xuXG4gIG9iamVjdFBhdGguc2V0ID0gZnVuY3Rpb24gKG9iaiwgcGF0aCwgdmFsdWUsIGRvTm90UmVwbGFjZSl7XG4gICAgcmV0dXJuIHNldChvYmosIHBhdGgsIHZhbHVlLCBkb05vdFJlcGxhY2UpO1xuICB9O1xuXG4gIG9iamVjdFBhdGguaW5zZXJ0ID0gZnVuY3Rpb24gKG9iaiwgcGF0aCwgdmFsdWUsIGF0KXtcbiAgICB2YXIgYXJyID0gb2JqZWN0UGF0aC5nZXQob2JqLCBwYXRoKTtcbiAgICBhdCA9IH5+YXQ7XG4gICAgaWYgKCFpc0FycmF5KGFycikpIHtcbiAgICAgIGFyciA9IFtdO1xuICAgICAgb2JqZWN0UGF0aC5zZXQob2JqLCBwYXRoLCBhcnIpO1xuICAgIH1cbiAgICBhcnIuc3BsaWNlKGF0LCAwLCB2YWx1ZSk7XG4gIH07XG5cbiAgb2JqZWN0UGF0aC5lbXB0eSA9IGZ1bmN0aW9uKG9iaiwgcGF0aCkge1xuICAgIGlmIChpc0VtcHR5KHBhdGgpKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAoaXNFbXB0eShvYmopKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSwgaTtcbiAgICBpZiAoISh2YWx1ZSA9IG9iamVjdFBhdGguZ2V0KG9iaiwgcGF0aCkpKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBvYmplY3RQYXRoLnNldChvYmosIHBhdGgsICcnKTtcbiAgICB9IGVsc2UgaWYgKGlzQm9vbGVhbih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBvYmplY3RQYXRoLnNldChvYmosIHBhdGgsIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKGlzTnVtYmVyKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIG9iamVjdFBhdGguc2V0KG9iaiwgcGF0aCwgMCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgdmFsdWUubGVuZ3RoID0gMDtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgZm9yIChpIGluIHZhbHVlKSB7XG4gICAgICAgIGlmIChfaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaSkpIHtcbiAgICAgICAgICBkZWxldGUgdmFsdWVbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9iamVjdFBhdGguc2V0KG9iaiwgcGF0aCwgbnVsbCk7XG4gICAgfVxuICB9O1xuXG4gIG9iamVjdFBhdGgucHVzaCA9IGZ1bmN0aW9uIChvYmosIHBhdGggLyosIHZhbHVlcyAqLyl7XG4gICAgdmFyIGFyciA9IG9iamVjdFBhdGguZ2V0KG9iaiwgcGF0aCk7XG4gICAgaWYgKCFpc0FycmF5KGFycikpIHtcbiAgICAgIGFyciA9IFtdO1xuICAgICAgb2JqZWN0UGF0aC5zZXQob2JqLCBwYXRoLCBhcnIpO1xuICAgIH1cblxuICAgIGFyci5wdXNoLmFwcGx5KGFyciwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSk7XG4gIH07XG5cbiAgb2JqZWN0UGF0aC5jb2FsZXNjZSA9IGZ1bmN0aW9uIChvYmosIHBhdGhzLCBkZWZhdWx0VmFsdWUpIHtcbiAgICB2YXIgdmFsdWU7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGF0aHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmICgodmFsdWUgPSBvYmplY3RQYXRoLmdldChvYmosIHBhdGhzW2ldKSkgIT09IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgfTtcblxuICBvYmplY3RQYXRoLmdldCA9IGZ1bmN0aW9uIChvYmosIHBhdGgsIGRlZmF1bHRWYWx1ZSl7XG4gICAgaWYgKGlzTnVtYmVyKHBhdGgpKSB7XG4gICAgICBwYXRoID0gW3BhdGhdO1xuICAgIH1cbiAgICBpZiAoaXNFbXB0eShwYXRoKSkge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKGlzRW1wdHkob2JqKSkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICB9XG4gICAgaWYgKGlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICByZXR1cm4gb2JqZWN0UGF0aC5nZXQob2JqLCBwYXRoLnNwbGl0KCcuJyksIGRlZmF1bHRWYWx1ZSk7XG4gICAgfVxuXG4gICAgdmFyIGN1cnJlbnRQYXRoID0gZ2V0S2V5KHBhdGhbMF0pO1xuXG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAob2JqW2N1cnJlbnRQYXRoXSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqW2N1cnJlbnRQYXRoXTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqZWN0UGF0aC5nZXQob2JqW2N1cnJlbnRQYXRoXSwgcGF0aC5zbGljZSgxKSwgZGVmYXVsdFZhbHVlKTtcbiAgfTtcblxuICBvYmplY3RQYXRoLmRlbCA9IGZ1bmN0aW9uKG9iaiwgcGF0aCkge1xuICAgIHJldHVybiBkZWwob2JqLCBwYXRoKTtcbiAgfTtcblxuICByZXR1cm4gb2JqZWN0UGF0aDtcbn0pO1xuIiwiLy8gdXRpbGl0aWVzXHJcbnZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxuXHJcbmZ1bmN0aW9uIEVtaXR0ZXJFbnRpdHkoZW1pdHRlck5hbWUsIGVtaXR0ZXJUaGVtZSwgcGFydGljbGVPcHRzLCBlbWl0Rm4pIHtcclxuXHJcbiAgICB0aGlzLm5hbWUgPSBlbWl0dGVyTmFtZTtcclxuXHJcbiAgICAvLyBlbWl0dGVyIGVudGl0eSBjb25maWdcclxuICAgIHRoaXMuZW1pdHRlck9wdHMgPSBlbWl0dGVyVGhlbWU7XHJcbiAgICAvLyBlbWl0dGVyIGVtaXNzaW9uIGNvbmZpZ1xyXG4gICAgdGhpcy5lbWlzc2lvbk9wdHMgPSB0aGlzLmVtaXR0ZXJPcHRzLmVtaXNzaW9uO1xyXG4gICAgLy8gZW1pdHRlciBwYXJ0aWNsZSBjb25maWdcclxuICAgIHRoaXMucGFydGljbGVPcHRzID0gcGFydGljbGVPcHRzO1xyXG5cclxuICAgIC8vIHNhdmVzIGRyaWxsaW5nIGRvd25cclxuICAgIHZhciBlbWl0dGVyID0gdGhpcy5lbWl0dGVyT3B0cy5lbWl0dGVyO1xyXG4gICAgdmFyIGVtaXNzaW9uID0gdGhpcy5lbWlzc2lvbk9wdHM7XHJcbiAgICB2YXIgZW1pdFJhdGUgPSBlbWlzc2lvbi5yYXRlO1xyXG4gICAgdmFyIGVtaXRSZXBlYXQgPSBlbWlzc2lvbi5yZXBlYXRlcjtcclxuXHJcbiAgICAvLyBlbWl0dGVyIG1hc3RlciBjbG9jayBpbml0XHJcbiAgICB0aGlzLmxvY2FsQ2xvY2sgPSAwO1xyXG4gICAgdGhpcy5sb2NhbENsb2NrUnVubmluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5lbWl0Rm4gPSBlbWl0Rm47XHJcbiAgICAvLyBlbWl0dGVyIGxpZmVcclxuICAgIHRoaXMuYWN0aXZlID0gZW1pdHRlci5hY3RpdmU7XHJcblxyXG4gICAgLy8gZW1pdHRlciB2ZWN0b3JzXHJcbiAgICB0aGlzLnggPSBlbWl0dGVyLng7XHJcbiAgICB0aGlzLnkgPSBlbWl0dGVyLnk7XHJcbiAgICB0aGlzLnhWZWwgPSBlbWl0dGVyLnhWZWw7XHJcbiAgICB0aGlzLnlWZWwgPSBlbWl0dGVyLnlWZWw7XHJcblxyXG4gICAgLy8gZW1pdHRlciBlbnZpcm9ubWVudGFsIGluZmx1ZW5jZXNcclxuICAgIHRoaXMuYXBwbHlHbG9iYWxGb3JjZXMgPSBlbWl0dGVyLmFwcGx5R2xvYmFsRm9yY2VzO1xyXG5cclxuICAgIC8vIGVtaXR0ZXIgZW1pc3Npb24gY29uZmlnXHJcbiAgICAvLyBlbWlzc2lvbiByYXRlXHJcbiAgICB0aGlzLnJhdGVNaW4gPSBlbWl0UmF0ZS5taW47XHJcbiAgICB0aGlzLnJhdGVNYXggPSBlbWl0UmF0ZS5tYXg7XHJcbiAgICB0aGlzLnJhdGVEZWNheSA9IGVtaXRSYXRlLmRlY2F5LnJhdGU7XHJcbiAgICB0aGlzLnJhdGVEZWNheU1heCA9IGVtaXRSYXRlLmRlY2F5LmRlY2F5TWF4O1xyXG5cclxuICAgIC8vIGVtaXNzaW9uIHJlcGV0aXRpb25cclxuICAgIHRoaXMucmVwZWF0UmF0ZSA9IGVtaXRSZXBlYXQucmF0ZTtcclxuICAgIHRoaXMucmVwZWF0RGVjYXkgPSBlbWl0UmVwZWF0LmRlY2F5LnJhdGU7XHJcbiAgICB0aGlzLnJlcGVhdERlY2F5TWF4ID0gZW1pdFJlcGVhdC5kZWNheS5kZWNheU1heDtcclxuICAgIHRoaXMudHJpZ2dlclR5cGUgPSAnbW91c2VDbGlja0V2ZW50JztcclxuXHJcbiAgICB0aGlzLmluaXRWYWx1ZXMgPSB7XHJcbiAgICAgICAgcmF0ZU1pbjogZW1pdFJhdGUubWluLFxyXG4gICAgICAgIHJhdGVNYXg6IGVtaXRSYXRlLm1heCxcclxuICAgICAgICByYXRlRGVjYXk6IGVtaXRSYXRlLmRlY2F5LnJhdGUsXHJcbiAgICAgICAgcmF0ZURlY2F5TWF4OiBlbWl0UmF0ZS5kZWNheS5kZWNheU1heCxcclxuICAgICAgICByZXBlYXRSYXRlOiBlbWl0UmVwZWF0LnJhdGUsXHJcbiAgICAgICAgcmVwZWF0RGVjYXk6IGVtaXRSZXBlYXQuZGVjYXkucmF0ZSxcclxuICAgICAgICByZXBlYXREZWNheU1heDogZW1pdFJlcGVhdC5kZWNheS5kZWNheU1heFxyXG4gICAgfTtcclxufVxyXG5cclxuRW1pdHRlckVudGl0eS5wcm90b3R5cGUucmVzZXRFbWlzc2lvblZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBzZWxmLnJhdGVNaW4gPSBzZWxmLmluaXRWYWx1ZXMucmF0ZU1pbjtcclxuICAgIHNlbGYucmF0ZU1heCA9IHNlbGYuaW5pdFZhbHVlcy5yYXRlTWF4O1xyXG4gICAgc2VsZi5yYXRlRGVjYXkgPSBzZWxmLmluaXRWYWx1ZXMucmF0ZURlY2F5O1xyXG4gICAgc2VsZi5yYXRlRGVjYXlNYXggPSBzZWxmLmluaXRWYWx1ZXMucmF0ZURlY2F5TWF4O1xyXG4gICAgc2VsZi5yZXBlYXRSYXRlID0gc2VsZi5pbml0VmFsdWVzLnJlcGVhdFJhdGU7XHJcbiAgICBzZWxmLnJlcGVhdERlY2F5ID0gc2VsZi5pbml0VmFsdWVzLnJlcGVhdERlY2F5O1xyXG4gICAgc2VsZi5yZXBlYXREZWNheU1heCA9IHNlbGYuaW5pdFZhbHVlcy5yZXBlYXREZWNheU1heDtcclxufTtcclxuXHJcbkVtaXR0ZXJFbnRpdHkucHJvdG90eXBlLnVwZGF0ZUVtaXR0ZXIgPSBmdW5jdGlvbiAodXBkYXRlT3B0cykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHZhciB1cGRhdGVzID0gdXBkYXRlT3B0cyB8fCBmYWxzZTtcclxuICAgIHZhciB0cmlnZ2VyRW1pdHRlckZsYWcgPSBmYWxzZTtcclxuXHJcbiAgICBpZiAodXBkYXRlcyAhPT0gZmFsc2UpIHtcclxuICAgICAgICBzZWxmLnggPSB1cGRhdGVzLng7XHJcbiAgICAgICAgc2VsZi55ID0gdXBkYXRlcy55O1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYueCArPSBzZWxmLnhWZWw7XHJcbiAgICBzZWxmLnkgKz0gc2VsZi55VmVsO1xyXG5cclxuICAgIGlmIChzZWxmLmFjdGl2ZSA9PT0gMSkge1xyXG5cclxuICAgICAgICBpZiAoc2VsZi5yZXBlYXRSYXRlID4gMCAmJiBzZWxmLmxvY2FsQ2xvY2tSdW5uaW5nID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VsZi5sb2NhbENsb2NrICUgc2VsZi5yZXBlYXRSYXRlID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyRW1pdHRlckZsYWcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnJlcGVhdERlY2F5IDwgc2VsZi5yZXBlYXREZWNheU1heCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVwZWF0UmF0ZSArPSBzZWxmLnJlcGVhdERlY2F5O1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9jYWxDbG9jayA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2NhbENsb2NrUnVubmluZyA9PT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5yYXRlRGVjYXkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yYXRlTWluID4gc2VsZi5yYXRlRGVjYXlNYXggPyBzZWxmLnJhdGVNaW4gLT0gc2VsZi5yYXRlRGVjYXkgOiBzZWxmLnJhdGVNaW4gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmF0ZU1heCA+IHNlbGYucmF0ZURlY2F5TWF4ID8gc2VsZi5yYXRlTWF4IC09IHNlbGYucmF0ZURlY2F5IDogc2VsZi5yYXRlTWF4ID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXJFbWl0dGVyRmxhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLmxvY2FsQ2xvY2srKztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHJpZ2dlckVtaXR0ZXJGbGFnID09PSB0cnVlKSB7XHJcbiAgICAgICAgc2VsZi50cmlnZ2VyRW1pdHRlcih7IHg6IHNlbGYueCwgeTogc2VsZi55IH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuRW1pdHRlckVudGl0eS5wcm90b3R5cGUudHJpZ2dlckVtaXR0ZXIgPSBmdW5jdGlvbiAodHJpZ2dlck9wdGlvbnMpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB2YXIgdGhpc1gsIHRoaXNZO1xyXG4gICAgdmFyIHRyaWdnZXJPcHRzID0gdHJpZ2dlck9wdGlvbnMgfHwgZmFsc2U7XHJcbiAgICBpZiAodHJpZ2dlck9wdHMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpc1ggPSB0cmlnZ2VyT3B0cy54O1xyXG4gICAgICAgIHRoaXNZID0gdHJpZ2dlck9wdHMueTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpc1ggPSBzZWxmLng7XHJcbiAgICAgICAgdGhpc1kgPSBzZWxmLnk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi54ID0gdGhpc1g7XHJcbiAgICBzZWxmLnkgPSB0aGlzWTtcclxuXHJcbiAgICBzZWxmLmFjdGl2ZSA9IHRydWU7XHJcbiAgICBzZWxmLmxvY2FsQ2xvY2tSdW5uaW5nID0gdHJ1ZTtcclxuXHJcbiAgICB2YXIgZW1pdEFtb3VudCA9IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKHNlbGYucmF0ZU1pbiwgc2VsZi5yYXRlTWF4KTtcclxuXHJcbiAgICBzZWxmLmVtaXRGbih0aGlzWCwgdGhpc1ksIGVtaXRBbW91bnQsIHNlbGYuZW1pc3Npb25PcHRzLCBzZWxmLnBhcnRpY2xlT3B0cyk7XHJcblxyXG4gICAgaWYgKHNlbGYucmVwZWF0UmF0ZSA+IDApIHtcclxuICAgICAgICBzZWxmLmFjdGl2ZSA9IDE7XHJcblxyXG4gICAgICAgIC8vIHNlbGYudXBkYXRlRW1pdHRlciggeyB4OiB0aGlzWCwgeTogdGhpc1kgfSApO1xyXG4gICAgfVxyXG59O1xyXG5cclxuRW1pdHRlckVudGl0eS5wcm90b3R5cGUucmVuZGVyRW1pdHRlciA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJ3JnYiggMjU1LCAyNTUsIDI1NSApJztcclxuICAgIGNvbnRleHQuc3Ryb2tlV2lkdGggPSA1O1xyXG4gICAgY29udGV4dC5saW5lKHRoaXMueCwgdGhpcy55IC0gMTUsIHRoaXMueCwgdGhpcy55ICsgMTUsIGNvbnRleHQpO1xyXG4gICAgY29udGV4dC5saW5lKHRoaXMueCAtIDE1LCB0aGlzLnksIHRoaXMueCArIDE1LCB0aGlzLnksIGNvbnRleHQpO1xyXG4gICAgY29udGV4dC5zdHJva2VDaXJjbGUodGhpcy54LCB0aGlzLnksIDEwLCBjb250ZXh0KTtcclxufTtcclxuXHJcbkVtaXR0ZXJFbnRpdHkucHJvdG90eXBlLmtpbGxFbWl0dGVyID0gZnVuY3Rpb24gKCkge307XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5FbWl0dGVyRW50aXR5ID0gRW1pdHRlckVudGl0eTsiLCJ2YXIgYW5pbWF0aW9uID0ge1xyXG4gICAgc3RhdGU6IGZhbHNlLFxyXG4gICAgY291bnRlcjogMCxcclxuICAgIGR1cmF0aW9uOiAyNDBcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmFuaW1hdGlvbiA9IGFuaW1hdGlvbjsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZXh0ZW5kcyBDYW52YXMgcHJvdG90eXBlIHdpdGggdXNlZnVsIGRyYXdpbmcgbWl4aW5zXHJcbiogQGtpbmQgY29uc3RhbnRcclxuKi9cclxudmFyIGNhbnZhc0RyYXdpbmdBcGkgPSBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlO1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gZHJhdyBjaXJjbGUgQVBJXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvcmlnaW4gWSBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHIgLSByYWRpdXMgb2YgY2lyY2xlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmNpcmNsZSA9IGZ1bmN0aW9uICh4LCB5LCByLCBjb250ZXh0KSB7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxuXHR0aGlzLmFyYyh4LCB5LCByLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBmaWxsZWQgY2lyY2xlXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvcmlnaW4gWSBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHIgLSByYWRpdXMgb2YgY2lyY2xlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmZpbGxDaXJjbGUgPSBmdW5jdGlvbiAoeCwgeSwgciwgY29udGV4dCkge1xyXG5cdHRoaXMuY2lyY2xlKHgsIHksIHIsIGNvbnRleHQpO1xyXG5cdHRoaXMuZmlsbCgpO1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBzdHJva2VkIGNpcmNsZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gb3JpZ2luIFggb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb3JpZ2luIFkgb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSByIC0gcmFkaXVzIG9mIGNpcmNsZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5zdHJva2VDaXJjbGUgPSBmdW5jdGlvbiAoeCwgeSwgciwgY29udGV4dCkge1xyXG5cdGNvbnRleHQuY2lyY2xlKHgsIHksIHIsIGNvbnRleHQpO1xyXG5cdGNvbnRleHQuc3Ryb2tlKCk7XHJcblx0Y29udGV4dC5iZWdpblBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb2ZpZ2luIFkgb3IgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIHdpZHRoIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHcgLSBoZWlnaHQgb2YgZWxsaXBzZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5lbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIHcsIGgsIGNvbnRleHQpIHtcclxuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgTWF0aC5QSSAqIDI7IGkgKz0gTWF0aC5QSSAvIDE2KSB7XHJcblx0XHRjb250ZXh0LmxpbmVUbyh4ICsgTWF0aC5jb3MoaSkgKiB3IC8gMiwgeSArIE1hdGguc2luKGkpICogaCAvIDIpO1xyXG5cdH1cclxuXHRjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgZmlsbGVkIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb2ZpZ2luIFkgb3IgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIHdpZHRoIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHcgLSBoZWlnaHQgb2YgZWxsaXBzZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5maWxsRWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCB3LCBoLCBjb250ZXh0KSB7XHJcblx0Y29udGV4dC5lbGxpcHNlKHgsIHksIHcsIGgsIGNvbnRleHQpO1xyXG5cdGNvbnRleHQuZmlsbCgpO1xyXG5cdGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBzdHJva2VkIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb2ZpZ2luIFkgb3IgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIHdpZHRoIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHcgLSBoZWlnaHQgb2YgZWxsaXBzZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5zdHJva2VFbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIHcsIGgpIHtcclxuXHR0aGlzLmVsbGlwc2UoeCwgeSwgdywgaCk7XHJcblx0dGhpcy5zdHJva2UoKTtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgbGluZSBiZXR3ZWVuIDIgdmVjdG9yIGNvb3JkaW5hdGVzLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4MSAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuKiBAcGFyYW0ge251bWJlcn0geTEgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHgyIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5MiAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5saW5lID0gZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyLCBjb250ZXh0KSB7XHJcblx0Y29udGV4dC5iZWdpblBhdGgoKTtcclxuXHRjb250ZXh0Lm1vdmVUbyh4MSwgeTEpO1xyXG5cdGNvbnRleHQubGluZVRvKHgyLCB5Mik7XHJcblx0Y29udGV4dC5zdHJva2UoKTtcclxuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuY2FudmFzRHJhd2luZ0FwaSA9IGNhbnZhc0RyYXdpbmdBcGk7IiwidmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG5cclxudmFyIGNvbG9yVXRpbHMgPSB7XHJcblx0LyoqXHJcbiAqIHByb3ZpZGVzIGNvbG9yIHV0aWwgbWV0aG9kcy5cclxuICovXHJcblx0cmdiOiBmdW5jdGlvbiByZ2IocmVkLCBncmVlbiwgYmx1ZSkge1xyXG5cdFx0cmV0dXJuICdyZ2IoJyArIG1hdGhVdGlscy5jbGFtcChNYXRoLnJvdW5kKHJlZCksIDAsIDI1NSkgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKE1hdGgucm91bmQoZ3JlZW4pLCAwLCAyNTUpICsgJywgJyArIG1hdGhVdGlscy5jbGFtcChNYXRoLnJvdW5kKGJsdWUpLCAwLCAyNTUpICsgJyknO1xyXG5cdH0sXHJcblx0cmdiYTogZnVuY3Rpb24gcmdiYShyZWQsIGdyZWVuLCBibHVlLCBhbHBoYSkge1xyXG5cdFx0cmV0dXJuICdyZ2JhKCcgKyBtYXRoVXRpbHMuY2xhbXAoTWF0aC5yb3VuZChyZWQpLCAwLCAyNTUpICsgJywgJyArIG1hdGhVdGlscy5jbGFtcChNYXRoLnJvdW5kKGdyZWVuKSwgMCwgMjU1KSArICcsICcgKyBtYXRoVXRpbHMuY2xhbXAoTWF0aC5yb3VuZChibHVlKSwgMCwgMjU1KSArICcsICcgKyBtYXRoVXRpbHMuY2xhbXAoYWxwaGEsIDAsIDEpICsgJyknO1xyXG5cdH0sXHJcblx0aHNsOiBmdW5jdGlvbiBoc2woaHVlLCBzYXR1cmF0aW9uLCBsaWdodG5lc3MpIHtcclxuXHRcdHJldHVybiAnaHNsKCcgKyBodWUgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKHNhdHVyYXRpb24sIDAsIDEwMCkgKyAnJSwgJyArIG1hdGhVdGlscy5jbGFtcChsaWdodG5lc3MsIDAsIDEwMCkgKyAnJSknO1xyXG5cdH0sXHJcblx0aHNsYTogZnVuY3Rpb24gaHNsYShodWUsIHNhdHVyYXRpb24sIGxpZ2h0bmVzcywgYWxwaGEpIHtcclxuXHRcdHJldHVybiAnaHNsYSgnICsgaHVlICsgJywgJyArIG1hdGhVdGlscy5jbGFtcChzYXR1cmF0aW9uLCAwLCAxMDApICsgJyUsICcgKyBtYXRoVXRpbHMuY2xhbXAobGlnaHRuZXNzLCAwLCAxMDApICsgJyUsICcgKyBtYXRoVXRpbHMuY2xhbXAoYWxwaGEsIDAsIDEpICsgJyknO1xyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmNvbG9yVXRpbHMgPSBjb2xvclV0aWxzOyIsInZhciBkcmF3aW5nID0gcmVxdWlyZSgnLi9jYW52YXNBcGlBdWdtZW50YXRpb24uanMnKS5jYW52YXNEcmF3aW5nQXBpO1xyXG5cclxubGV0IGMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnY2FudmFzJyApO1xyXG5sZXQgY3R4ID0gYy5nZXRDb250ZXh0KCAnMmQnICk7XHJcbmMud2lkdGggPSAyMDA7XHJcbmMuaGVpZ2h0ID0gMTAwO1xyXG5jSCA9IGMud2lkdGggLyAyO1xyXG5jViA9IGMuaGVpZ2h0IC8gMjtcclxubGV0IGNTUiA9IGMuaGVpZ2h0IC8gMjtcclxubGV0IGNTTyA9IGNIIC8gMjtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVdhcnBTdGFySW1hZ2UoKSB7XHJcblxyXG5cdGxldCBnUmVkID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KCBjSCAtIGNTTywgY1YsIDAsIGNIIC0gY1NPLCBjViwgY1NSICk7XHJcblx0Z1JlZC5hZGRDb2xvclN0b3AoIDAsICdyZ2JhKCAyNTUsIDAsIDAsIDEgKScgKTtcclxuXHRnUmVkLmFkZENvbG9yU3RvcCggMSwgJ3JnYmEoIDI1NSwgMCwgMCwgMCApJyApO1xyXG5cclxuXHRsZXQgZ0dyZWVuID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KCBjSCwgY1YsIDAsIGNILCBjViwgY1NSICk7XHJcblx0Z0dyZWVuLmFkZENvbG9yU3RvcCggMCwgJ3JnYmEoIDAsIDI1NSwgMCwgMSApJyApO1xyXG5cdGdHcmVlbi5hZGRDb2xvclN0b3AoIDEsICdyZ2JhKCAwLCAyNTUsIDAsIDAgKScgKTtcclxuXHJcblx0bGV0IGdCbHVlID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KCBjSCArIGNTTywgY1YsIDAsIGNIICsgY1NPLCBjViwgY1NSICk7XHJcblx0Z0JsdWUuYWRkQ29sb3JTdG9wKCAwLCAncmdiYSggMCwgMCwgMjU1LCAxICknICk7XHJcblx0Z0JsdWUuYWRkQ29sb3JTdG9wKCAxLCAncmdiYSggMCwgMCwgMjU1LCAwICknICk7XHJcblxyXG5cdGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnbGlnaHRlcic7XHJcblxyXG5cdGN0eC5maWxsU3R5bGUgPSBnUmVkO1xyXG5cdGN0eC5maWxsQ2lyY2xlKCBjSCAtIGNTTywgY1YsIGNTUiwgYyApO1xyXG5cclxuXHRjdHguZmlsbFN0eWxlID0gZ0dyZWVuO1xyXG5cdGN0eC5maWxsQ2lyY2xlKCBjSCwgY1YsIGNTUiwgYyApO1xyXG5cclxuXHRjdHguZmlsbFN0eWxlID0gZ0JsdWU7XHJcblx0Y3R4LmZpbGxDaXJjbGUoIGNIICsgY1NPLCBjViwgY1NSLCBjICk7XHJcblxyXG5cdGMucmVuZGVyUHJvcHMgPSB7XHJcblx0XHRzcmM6IHtcclxuXHRcdFx0eDogMCwgeTogMCwgdzogYy53aWR0aCwgaDogYy5oZWlnaHRcclxuXHRcdH0sXHJcblx0XHRkZXN0OiB7XHJcblx0XHRcdHg6IC1jSCwgeTogLWNWXHJcblx0XHR9XHJcblx0fVxyXG5cdGNvbnNvbGUubG9nKCAnYzogJywgYy5yZW5kZXJQcm9wcyApO1xyXG5cclxuXHRyZXR1cm4gYztcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlV2FycFN0YXJJbWFnZTsiLCJ2YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcblxyXG52YXIgbGFzdENhbGxlZFRpbWUgPSB2b2lkIDA7XHJcblxyXG52YXIgZGVidWcgPSB7XHJcblxyXG4gICAgaGVscGVyczoge1xyXG4gICAgICAgIGdldFN0eWxlOiBmdW5jdGlvbiBnZXRTdHlsZShlbGVtZW50LCBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KSA6IGVsZW1lbnQuc3R5bGVbcHJvcGVydHkucmVwbGFjZSgvLShbYS16XSkvZywgZnVuY3Rpb24gKGcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnWzFdLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIH0pXTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGludmVydENvbG9yOiBmdW5jdGlvbiBpbnZlcnRDb2xvcihoZXgsIGJ3KSB7XHJcbiAgICAgICAgICAgIGlmIChoZXguaW5kZXhPZignIycpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBoZXggPSBoZXguc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY29udmVydCAzLWRpZ2l0IGhleCB0byA2LWRpZ2l0cy5cclxuICAgICAgICAgICAgaWYgKGhleC5sZW5ndGggPT09IDMpIHtcclxuICAgICAgICAgICAgICAgIGhleCA9IGhleFswXSArIGhleFswXSArIGhleFsxXSArIGhleFsxXSArIGhleFsyXSArIGhleFsyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaGV4Lmxlbmd0aCAhPT0gNikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEhFWCBjb2xvci4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgciA9IHBhcnNlSW50KGhleC5zbGljZSgwLCAyKSwgMTYpLFxyXG4gICAgICAgICAgICAgICAgZyA9IHBhcnNlSW50KGhleC5zbGljZSgyLCA0KSwgMTYpLFxyXG4gICAgICAgICAgICAgICAgYiA9IHBhcnNlSW50KGhleC5zbGljZSg0LCA2KSwgMTYpO1xyXG4gICAgICAgICAgICBpZiAoYncpIHtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM5NDMwMjMvMTEyNzMxXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gciAqIDAuMjk5ICsgZyAqIDAuNTg3ICsgYiAqIDAuMTE0ID4gMTg2ID8gJyMwMDAwMDAnIDogJyNGRkZGRkYnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGludmVydCBjb2xvciBjb21wb25lbnRzXHJcbiAgICAgICAgICAgIHIgPSAoMjU1IC0gcikudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgICAgICBnID0gKDI1NSAtIGcpLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgYiA9ICgyNTUgLSBiKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgICAgIC8vIHBhZCBlYWNoIHdpdGggemVyb3MgYW5kIHJldHVyblxyXG4gICAgICAgICAgICByZXR1cm4gXCIjXCIgKyBwYWRaZXJvKHIpICsgcGFkWmVybyhnKSArIHBhZFplcm8oYik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgZGlzcGxheTogZnVuY3Rpb24gZGlzcGxheShkaXNwbGF5RmxhZywgbWVzc2FnZSwgcGFyYW0pIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHNlbGYuYWxsID09PSB0cnVlIHx8IGRpc3BsYXlGbGFnID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UsIHBhcmFtKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGRlYnVnT3V0cHV0OiBmdW5jdGlvbiBkZWJ1Z091dHB1dChjYW52YXMsIGNvbnRleHQsIGxhYmVsLCBwYXJhbSwgb3V0cHV0TnVtLCBvdXRwdXRCb3VuZHMpIHtcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgIGlmIChvdXRwdXRCb3VuZHMpIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNSZWQgPSBtYXRoVXRpbHMubWFwKHBhcmFtLCBvdXRwdXRCb3VuZHMubWluLCBvdXRwdXRCb3VuZHMubWF4LCAyNTUsIDAsIHRydWUpO1xyXG4gICAgICAgICAgICB2YXIgdGhpc0dyZWVuID0gbWF0aFV0aWxzLm1hcChwYXJhbSwgb3V0cHV0Qm91bmRzLm1pbiwgb3V0cHV0Qm91bmRzLm1heCwgMCwgMjU1LCB0cnVlKTtcclxuICAgICAgICAgICAgLy8gdmFyIHRoaXNCbHVlID0gbWF0aFV0aWxzLm1hcChwYXJhbSwgb3V0cHV0Qm91bmRzLm1pbiwgb3V0cHV0Qm91bmRzLm1heCwgMCwgMjU1LCB0cnVlKTtcclxuICAgICAgICAgICAgdmFyIHRoaXNDb2xvciA9ICdyZ2IoICcgKyB0aGlzUmVkICsgJywgJyArIHRoaXNHcmVlbiArICcsIDAgKSc7XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ2NoYW5naW5nIGRlYnVnIGNvbG9yIG9mOiAnK3BhcmFtKycgdG86ICcrdGhpc0NvbG9yICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNDb2xvciA9IFwiI2VmZWZlZlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHZQb3MgPSBvdXRwdXROdW0gKiA1MCArIDUwO1xyXG4gICAgICAgIGNvbnRleHQudGV4dEFsaWduID0gXCJsZWZ0XCI7XHJcbiAgICAgICAgY29udGV4dC5mb250ID0gXCIxNHB0IGFyaWFsXCI7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSB0aGlzQ29sb3I7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQobGFiZWwgKyBwYXJhbSwgNTAsIHZQb3MpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjYWxjdWxhdGVGcHM6IGZ1bmN0aW9uIGNhbGN1bGF0ZUZwcygpIHtcclxuICAgICAgICBpZiAoIWxhc3RDYWxsZWRUaW1lKSB7XHJcbiAgICAgICAgICAgIGxhc3RDYWxsZWRUaW1lID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRlbHRhID0gKHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAtIGxhc3RDYWxsZWRUaW1lKSAvIDEwMDA7XHJcbiAgICAgICAgbGFzdENhbGxlZFRpbWUgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgcmV0dXJuIDEgLyBkZWx0YTtcclxuICAgIH0sXHJcblxyXG4gICAgZmxhZ3M6IHtcclxuICAgICAgICBhbGw6IGZhbHNlLFxyXG4gICAgICAgIHBhcnRzOiB7XHJcbiAgICAgICAgICAgIGNsaWNrczogdHJ1ZSxcclxuICAgICAgICAgICAgcnVudGltZTogdHJ1ZSxcclxuICAgICAgICAgICAgdXBkYXRlOiBmYWxzZSxcclxuICAgICAgICAgICAga2lsbENvbmRpdGlvbnM6IGZhbHNlLFxyXG4gICAgICAgICAgICBhbmltYXRpb25Db3VudGVyOiBmYWxzZSxcclxuICAgICAgICAgICAgZW50aXR5U3RvcmU6IGZhbHNlLFxyXG4gICAgICAgICAgICBmcHM6IHRydWVcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5kZWJ1ZyA9IGRlYnVnO1xyXG5tb2R1bGUuZXhwb3J0cy5sYXN0Q2FsbGVkVGltZSA9IGxhc3RDYWxsZWRUaW1lOyIsIi8qXHJcbiAqIFRoaXMgaXMgYSBuZWFyLWRpcmVjdCBwb3J0IG9mIFJvYmVydCBQZW5uZXIncyBlYXNpbmcgZXF1YXRpb25zLiBQbGVhc2Ugc2hvd2VyIFJvYmVydCB3aXRoXHJcbiAqIHByYWlzZSBhbmQgYWxsIG9mIHlvdXIgYWRtaXJhdGlvbi4gSGlzIGxpY2Vuc2UgaXMgcHJvdmlkZWQgYmVsb3cuXHJcbiAqXHJcbiAqIEZvciBpbmZvcm1hdGlvbiBvbiBob3cgdG8gdXNlIHRoZXNlIGZ1bmN0aW9ucyBpbiB5b3VyIGFuaW1hdGlvbnMsIGNoZWNrIG91dCBteSBmb2xsb3dpbmcgdHV0b3JpYWw6IFxyXG4gKiBodHRwOi8vYml0Lmx5LzE4aUhIS3FcclxuICpcclxuICogLUtpcnVwYVxyXG4gKi9cclxuXHJcbi8qXHJcbiAqXHJcbiAqIFRFUk1TIE9GIFVTRSAtIEVBU0lORyBFUVVBVElPTlNcclxuICogXHJcbiAqIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS4gXHJcbiAqIFxyXG4gKiBDb3B5cmlnaHQgwqkgMjAwMSBSb2JlcnQgUGVubmVyXHJcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIFxyXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLCBcclxuICogYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxyXG4gKiBcclxuICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgXHJcbiAqIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cclxuICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3QgXHJcbiAqIG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIFxyXG4gKiBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXHJcbiAqIFxyXG4gKiBOZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBhdXRob3Igbm9yIHRoZSBuYW1lcyBvZiBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBcclxuICogb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cclxuICogXHJcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORCBBTlkgXHJcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRlxyXG4gKiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuICogQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLFxyXG4gKiBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEVcclxuICogR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIFxyXG4gKiBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElOR1xyXG4gKiBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBcclxuICogT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLiBcclxuICpcclxuICovXHJcblxyXG52YXIgZWFzaW5nRXF1YXRpb25zID0ge1xyXG5cdC8qKlxyXG4gKiBwcm92aWRlcyBlYXNpbmcgdXRpbCBtZXRob2RzLlxyXG4gKi9cclxuXHRsaW5lYXJFYXNlOiBmdW5jdGlvbiBsaW5lYXJFYXNlKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5RdWFkOiBmdW5jdGlvbiBlYXNlSW5RdWFkKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMpICogY3VycmVudEl0ZXJhdGlvbiArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dFF1YWQ6IGZ1bmN0aW9uIGVhc2VPdXRRdWFkKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIC1jaGFuZ2VJblZhbHVlICogKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zKSAqIChjdXJyZW50SXRlcmF0aW9uIC0gMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dFF1YWQ6IGZ1bmN0aW9uIGVhc2VJbk91dFF1YWQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIGN1cnJlbnRJdGVyYXRpb24gKiBjdXJyZW50SXRlcmF0aW9uICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAtY2hhbmdlSW5WYWx1ZSAvIDIgKiAoLS1jdXJyZW50SXRlcmF0aW9uICogKGN1cnJlbnRJdGVyYXRpb24gLSAyKSAtIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5DdWJpYzogZnVuY3Rpb24gZWFzZUluQ3ViaWMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMsIDMpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlT3V0Q3ViaWM6IGZ1bmN0aW9uIGVhc2VPdXRDdWJpYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxLCAzKSArIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRDdWJpYzogZnVuY3Rpb24gZWFzZUluT3V0Q3ViaWMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24sIDMpICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC0gMiwgMykgKyAyKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluUXVhcnQ6IGZ1bmN0aW9uIGVhc2VJblF1YXJ0KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zLCA0KSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dFF1YXJ0OiBmdW5jdGlvbiBlYXNlT3V0UXVhcnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gLWNoYW5nZUluVmFsdWUgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEsIDQpIC0gMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dFF1YXJ0OiBmdW5jdGlvbiBlYXNlSW5PdXRRdWFydChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiwgNCkgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIC1jaGFuZ2VJblZhbHVlIC8gMiAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC0gMiwgNCkgLSAyKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluUXVpbnQ6IGZ1bmN0aW9uIGVhc2VJblF1aW50KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zLCA1KSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dFF1aW50OiBmdW5jdGlvbiBlYXNlT3V0UXVpbnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSwgNSkgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0UXVpbnQ6IGZ1bmN0aW9uIGVhc2VJbk91dFF1aW50KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uLCA1KSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAtIDIsIDUpICsgMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJblNpbmU6IGZ1bmN0aW9uIGVhc2VJblNpbmUoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICgxIC0gTWF0aC5jb3MoY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAqIChNYXRoLlBJIC8gMikpKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dFNpbmU6IGZ1bmN0aW9uIGVhc2VPdXRTaW5lKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnNpbihjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zICogKE1hdGguUEkgLyAyKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dFNpbmU6IGZ1bmN0aW9uIGVhc2VJbk91dFNpbmUoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoMSAtIE1hdGguY29zKE1hdGguUEkgKiBjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbkV4cG86IGZ1bmN0aW9uIGVhc2VJbkV4cG8oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGgucG93KDIsIDEwICogKGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRFeHBvOiBmdW5jdGlvbiBlYXNlT3V0RXhwbyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKC1NYXRoLnBvdygyLCAtMTAgKiBjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zKSArIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRFeHBvOiBmdW5jdGlvbiBlYXNlSW5PdXRFeHBvKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdygyLCAxMCAqIChjdXJyZW50SXRlcmF0aW9uIC0gMSkpICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqICgtTWF0aC5wb3coMiwgLTEwICogLS1jdXJyZW50SXRlcmF0aW9uKSArIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5DaXJjOiBmdW5jdGlvbiBlYXNlSW5DaXJjKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoMSAtIE1hdGguc3FydCgxIC0gKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zKSAqIGN1cnJlbnRJdGVyYXRpb24pKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dENpcmM6IGZ1bmN0aW9uIGVhc2VPdXRDaXJjKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnNxcnQoMSAtIChjdXJyZW50SXRlcmF0aW9uID0gY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEpICogY3VycmVudEl0ZXJhdGlvbikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dENpcmM6IGZ1bmN0aW9uIGVhc2VJbk91dENpcmMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqICgxIC0gTWF0aC5zcXJ0KDEgLSBjdXJyZW50SXRlcmF0aW9uICogY3VycmVudEl0ZXJhdGlvbikpICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIChNYXRoLnNxcnQoMSAtIChjdXJyZW50SXRlcmF0aW9uIC09IDIpICogY3VycmVudEl0ZXJhdGlvbikgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluRWxhc3RpYzogZnVuY3Rpb24gZWFzZUluRWxhc3RpYyh0LCBiLCBjLCBkKSB7XHJcblx0XHR2YXIgcyA9IDEuNzAxNTg7dmFyIHAgPSAwO3ZhciBhID0gYztcclxuXHRcdGlmICh0ID09IDApIHJldHVybiBiO2lmICgodCAvPSBkKSA9PSAxKSByZXR1cm4gYiArIGM7aWYgKCFwKSBwID0gZCAqIC4zO1xyXG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjKSkge1xyXG5cdFx0XHRhID0gYzt2YXIgcyA9IHAgLyA0O1xyXG5cdFx0fSBlbHNlIHZhciBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oYyAvIGEpO1xyXG5cdFx0cmV0dXJuIC0oYSAqIE1hdGgucG93KDIsIDEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiBkIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkpICsgYjtcclxuXHR9LFxyXG5cdGVhc2VPdXRFbGFzdGljOiBmdW5jdGlvbiBlYXNlT3V0RWxhc3RpYyh0LCBiLCBjLCBkKSB7XHJcblx0XHR2YXIgcyA9IDEuNzAxNTg7dmFyIHAgPSAwO3ZhciBhID0gYztcclxuXHRcdGlmICh0ID09IDApIHJldHVybiBiO2lmICgodCAvPSBkKSA9PSAxKSByZXR1cm4gYiArIGM7aWYgKCFwKSBwID0gZCAqIC4zO1xyXG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjKSkge1xyXG5cdFx0XHRhID0gYzt2YXIgcyA9IHAgLyA0O1xyXG5cdFx0fSBlbHNlIHZhciBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oYyAvIGEpO1xyXG5cdFx0cmV0dXJuIGEgKiBNYXRoLnBvdygyLCAtMTAgKiB0KSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApICsgYyArIGI7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0RWxhc3RpYzogZnVuY3Rpb24gZWFzZUluT3V0RWxhc3RpYyh0LCBiLCBjLCBkKSB7XHJcblx0XHR2YXIgcyA9IDEuNzAxNTg7dmFyIHAgPSAwO3ZhciBhID0gYztcclxuXHRcdGlmICh0ID09IDApIHJldHVybiBiO2lmICgodCAvPSBkIC8gMikgPT0gMikgcmV0dXJuIGIgKyBjO2lmICghcCkgcCA9IGQgKiAoLjMgKiAxLjUpO1xyXG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjKSkge1xyXG5cdFx0XHRhID0gYzt2YXIgcyA9IHAgLyA0O1xyXG5cdFx0fSBlbHNlIHZhciBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oYyAvIGEpO1xyXG5cdFx0aWYgKHQgPCAxKSByZXR1cm4gLS41ICogKGEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKSArIGI7XHJcblx0XHRyZXR1cm4gYSAqIE1hdGgucG93KDIsIC0xMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApICogLjUgKyBjICsgYjtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5CYWNrOiBmdW5jdGlvbiBlYXNlSW5CYWNrKHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRyZXR1cm4gYyAqICh0IC89IGQpICogdCAqICgocyArIDEpICogdCAtIHMpICsgYjtcclxuXHR9LFxyXG5cclxuXHRlYXNlT3V0QmFjazogZnVuY3Rpb24gZWFzZU91dEJhY2sodCwgYiwgYywgZCwgcykge1xyXG5cdFx0aWYgKHMgPT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcclxuXHRcdHJldHVybiBjICogKCh0ID0gdCAvIGQgLSAxKSAqIHQgKiAoKHMgKyAxKSAqIHQgKyBzKSArIDEpICsgYjtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRCYWNrOiBmdW5jdGlvbiBlYXNlSW5PdXRCYWNrKHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRpZiAoKHQgLz0gZCAvIDIpIDwgMSkgcmV0dXJuIGMgLyAyICogKHQgKiB0ICogKCgocyAqPSAxLjUyNSkgKyAxKSAqIHQgLSBzKSkgKyBiO1xyXG5cdFx0cmV0dXJuIGMgLyAyICogKCh0IC09IDIpICogdCAqICgoKHMgKj0gMS41MjUpICsgMSkgKiB0ICsgcykgKyAyKSArIGI7XHJcblx0fSxcclxuXHJcblx0Ly8gZWFzZUluQm91bmNlOiBmdW5jdGlvbih0LCBiLCBjLCBkKSB7XHJcblx0Ly8gICAgIHJldHVybiBjIC0gZWFzZU91dEJvdW5jZShkLXQsIDAsIGMsIGQpICsgYjtcclxuXHQvLyB9LFxyXG5cclxuXHRlYXNlT3V0Qm91bmNlOiBmdW5jdGlvbiBlYXNlT3V0Qm91bmNlKHQsIGIsIGMsIGQpIHtcclxuXHRcdGlmICgodCAvPSBkKSA8IDEgLyAyLjc1KSB7XHJcblx0XHRcdHJldHVybiBjICogKDcuNTYyNSAqIHQgKiB0KSArIGI7XHJcblx0XHR9IGVsc2UgaWYgKHQgPCAyIC8gMi43NSkge1xyXG5cdFx0XHRyZXR1cm4gYyAqICg3LjU2MjUgKiAodCAtPSAxLjUgLyAyLjc1KSAqIHQgKyAuNzUpICsgYjtcclxuXHRcdH0gZWxzZSBpZiAodCA8IDIuNSAvIDIuNzUpIHtcclxuXHRcdFx0cmV0dXJuIGMgKiAoNy41NjI1ICogKHQgLT0gMi4yNSAvIDIuNzUpICogdCArIC45Mzc1KSArIGI7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gYyAqICg3LjU2MjUgKiAodCAtPSAyLjYyNSAvIDIuNzUpICogdCArIC45ODQzNzUpICsgYjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGVhc2VJbk91dEJvdW5jZTogZnVuY3Rpb24odCwgYiwgYywgZCkge1xyXG5cdC8vICAgICBpZiAodCA8IGQvMikgcmV0dXJuIHRoaXMuZWFzZUluQm91bmNlKHQqMiwgMCwgYywgZCkgKiAuNSArIGI7XHJcblx0Ly8gICAgIHJldHVybiB0aGlzLmVhc2VPdXRCb3VuY2UodCoyLWQsIDAsIGMsIGQpICogLjUgKyBjKi41ICsgYjtcclxuXHQvLyB9XHJcbn07XHJcblxyXG5lYXNpbmdFcXVhdGlvbnMuZWFzZUluQm91bmNlID0gZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcclxuXHRyZXR1cm4gYyAtIGVhc2luZ0VxdWF0aW9ucy5lYXNlT3V0Qm91bmNlKGQgLSB0LCAwLCBjLCBkKSArIGI7XHJcbn0sIGVhc2luZ0VxdWF0aW9ucy5lYXNlSW5PdXRCb3VuY2UgPSBmdW5jdGlvbiAodCwgYiwgYywgZCkge1xyXG5cdGlmICh0IDwgZCAvIDIpIHJldHVybiBlYXNpbmdFcXVhdGlvbnMuZWFzZUluQm91bmNlKHQgKiAyLCAwLCBjLCBkKSAqIC41ICsgYjtcclxuXHRyZXR1cm4gZWFzaW5nRXF1YXRpb25zLmVhc2VPdXRCb3VuY2UodCAqIDIgLSBkLCAwLCBjLCBkKSAqIC41ICsgYyAqIC41ICsgYjtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmVhc2luZ0VxdWF0aW9ucyA9IGVhc2luZ0VxdWF0aW9uczsiLCJ2YXIgRW1pdHRlclN0b3JlRm4gPSBmdW5jdGlvbiBFbWl0dGVyU3RvcmVGbigpIHt9O1xyXG5cclxuRW1pdHRlclN0b3JlRm4ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChzdG9yZSkge1xyXG4gIHZhciBpID0gc3RvcmUubGVuZ3RoIC0gMTtcclxuICBmb3IgKDsgaSA+PSAwOyBpLS0pIHtcclxuICAgIHN0b3JlW2ldLnVwZGF0ZUVtaXR0ZXIoKTtcclxuICAgIC8vIHN0b3JlW2ldLnJlbmRlckVtaXR0ZXIoIGN0eCApO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLkVtaXR0ZXJTdG9yZUZuID0gRW1pdHRlclN0b3JlRm47IiwiLy8gZW1pc3Npb24gdGhlbWVcclxuXHJcbnZhciBiYXNlRW1pdHRlclRoZW1lID0ge1xyXG5cclxuXHRlbWl0dGVyOiB7XHJcblxyXG5cdFx0YWN0aXZlOiAwLFxyXG5cclxuXHRcdC8vIHBvc2l0aW9uXHJcblx0XHR4OiAwLFxyXG5cdFx0eTogMCxcclxuXHRcdHhWZWw6IDAsXHJcblx0XHR5VmVsOiAwLFxyXG5cdFx0YXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0Ly8gZW1pc3Npb24gcmF0ZSBjb25maWcgKHBlciBjeWNsZSAoIGZyYW1lICkgKVxyXG5cdGVtaXNzaW9uOiB7XHJcblxyXG5cdFx0cmF0ZToge1xyXG5cdFx0XHRtaW46IDAsXHJcblx0XHRcdG1heDogMCxcclxuXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0XHRkZWNheU1heDogMFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGVtaXNzaW9uIHJlcGVhdGVyIGNvbmZpZ1xyXG5cdFx0cmVwZWF0ZXI6IHtcclxuXHRcdFx0Ly8gd2hhdCBpcyB0aGUgcmVwZXRpdGlvbiByYXRlICggZnJhbWVzIClcclxuXHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0Ly8gZG9lcyB0aGUgcmVwZXRpdGlvbiByYXRlIGRlY2F5ICggZ2V0IGxvbmdlciApPyBob3cgbXVjaCBsb25nZXI/IFxyXG5cdFx0XHRkZWNheToge1xyXG5cdFx0XHRcdHJhdGU6IDAsXHJcblx0XHRcdFx0ZGVjYXlNYXg6IDBcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBpbml0aWFsIGRpcmVjdGlvbiBvZiBwYXJ0aWNsZXNcclxuXHRcdGRpcmVjdGlvbjoge1xyXG5cdFx0XHRyYWQ6IDAsIC8vIGluIHJhZGlhbnMgKDAgLSAyKVxyXG5cdFx0XHRtaW46IDAsIC8vIGxvdyBib3VuZHMgKHJhZGlhbnMpXHJcblx0XHRcdG1heDogMCAvLyBoaWdoIGJvdW5kcyAocmFkaWFucylcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gYXJlIHBhcnRpY2xlcyBvZmZzZXQgZnJvbSBpbml0YWwgeC95XHJcblx0XHRyYWRpYWxEaXNwbGFjZW1lbnQ6IDAsXHJcblx0XHQvLyBpcyB0aGUgb2Zmc2V0IGZlYXRoZXJlZD9cclxuXHRcdHJhZGlhbERpc3BsYWNlbWVudE9mZnNldDogMCxcclxuXHJcblx0XHQvL2luaXRpYWwgdmVsb2NpdHkgb2YgcGFydGljbGVzXHJcblx0XHRpbXB1bHNlOiB7XHJcblx0XHRcdHBvdzogMCxcclxuXHRcdFx0bWluOiAwLFxyXG5cdFx0XHRtYXg6IDBcclxuXHRcdH1cclxuXHR9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuYmFzZUVtaXR0ZXJUaGVtZSA9IGJhc2VFbWl0dGVyVGhlbWU7IiwiLy8gZW1pc3Npb24gdGhlbWVcclxuXHJcbnZhciBmbGFtZVN0cmVhbVRoZW1lID0ge1xyXG5cclxuXHRlbWl0dGVyOiB7XHJcblxyXG5cdFx0YWN0aXZlOiAxLFxyXG5cclxuXHRcdC8vIHBvc2l0aW9uXHJcblx0XHR4OiAwLFxyXG5cdFx0eTogMCxcclxuXHRcdHhWZWw6IDAsXHJcblx0XHR5VmVsOiAwLFxyXG5cdFx0YXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0Ly8gZW1pc3Npb24gcmF0ZSBjb25maWcgKHBlciBjeWNsZSAoIGZyYW1lICkgKVxyXG5cdGVtaXNzaW9uOiB7XHJcblxyXG5cdFx0cmF0ZToge1xyXG5cdFx0XHRtaW46IDEwLFxyXG5cdFx0XHRtYXg6IDIwLFxyXG5cclxuXHRcdFx0ZGVjYXk6IHtcclxuXHRcdFx0XHRyYXRlOiAwLFxyXG5cdFx0XHRcdGRlY2F5TWF4OiAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gZW1pc3Npb24gcmVwZWF0ZXIgY29uZmlnXHJcblx0XHRyZXBlYXRlcjoge1xyXG5cdFx0XHQvLyB3aGF0IGlzIHRoZSByZXBldGl0aW9uIHJhdGUgKCBmcmFtZXMgKVxyXG5cdFx0XHRyYXRlOiAxLFxyXG5cdFx0XHQvLyBkb2VzIHRoZSByZXBldGl0aW9uIHJhdGUgZGVjYXkgKCBnZXQgbG9uZ2VyICk/IGhvdyBtdWNoIGxvbmdlcj8gXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0XHRkZWNheU1heDogMzAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaW5pdGlhbCBkaXJlY3Rpb24gb2YgcGFydGljbGVzXHJcblx0XHRkaXJlY3Rpb246IHtcclxuXHRcdFx0cmFkOiAwLCAvLyBpbiByYWRpYW5zICgwIC0gMilcclxuXHRcdFx0bWluOiAxLjQ1LCAvLyBsb3cgYm91bmRzIChyYWRpYW5zKVxyXG5cdFx0XHRtYXg6IDEuNTUgLy8gaGlnaCBib3VuZHMgKHJhZGlhbnMpXHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGFyZSBwYXJ0aWNsZXMgb2Zmc2V0IGZyb20gaW5pdGFsIHgveVxyXG5cdFx0cmFkaWFsRGlzcGxhY2VtZW50OiAwLFxyXG5cdFx0Ly8gaXMgdGhlIG9mZnNldCBmZWF0aGVyZWQ/XHJcblx0XHRyYWRpYWxEaXNwbGFjZW1lbnRPZmZzZXQ6IDAsXHJcblxyXG5cdFx0Ly9pbml0aWFsIHZlbG9jaXR5IG9mIHBhcnRpY2xlc1xyXG5cdFx0aW1wdWxzZToge1xyXG5cdFx0XHRwb3c6IDAsXHJcblx0XHRcdG1pbjogOCxcclxuXHRcdFx0bWF4OiAxNVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5mbGFtZVN0cmVhbVRoZW1lID0gZmxhbWVTdHJlYW1UaGVtZTsiLCIvLyBlbWlzc2lvbiB0aGVtZVxyXG5cclxudmFyIHNpbmdsZUJ1cnN0VGhlbWUgPSB7XHJcblxyXG5cdGVtaXR0ZXI6IHtcclxuXHJcblx0XHRhY3RpdmU6IDEsXHJcblxyXG5cdFx0Ly8gcG9zaXRpb25cclxuXHRcdHg6IDAsXHJcblx0XHR5OiAwLFxyXG5cdFx0eFZlbDogMCxcclxuXHRcdHlWZWw6IDAsXHJcblx0XHRhcHBseUdsb2JhbEZvcmNlczogZmFsc2VcclxuXHR9LFxyXG5cclxuXHQvLyBlbWlzc2lvbiByYXRlIGNvbmZpZyAocGVyIGN5Y2xlICggZnJhbWUgKSApXHJcblx0ZW1pc3Npb246IHtcclxuXHJcblx0XHRyYXRlOiB7XHJcblx0XHRcdG1pbjogMzAsXHJcblx0XHRcdG1heDogMTAwLFxyXG5cclxuXHRcdFx0ZGVjYXk6IHtcclxuXHRcdFx0XHRyYXRlOiA1LFxyXG5cdFx0XHRcdGRlY2F5TWF4OiAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gZW1pc3Npb24gcmVwZWF0ZXIgY29uZmlnXHJcblx0XHRyZXBlYXRlcjoge1xyXG5cdFx0XHQvLyB3aGF0IGlzIHRoZSByZXBldGl0aW9uIHJhdGUgKCBmcmFtZXMgKVxyXG5cdFx0XHRyYXRlOiAwLFxyXG5cdFx0XHQvLyBkb2VzIHRoZSByZXBldGl0aW9uIHJhdGUgZGVjYXkgKCBnZXQgbG9uZ2VyICk/IGhvdyBtdWNoIGxvbmdlcj8gXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0XHRkZWNheU1heDogMzAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaW5pdGlhbCBkaXJlY3Rpb24gb2YgcGFydGljbGVzXHJcblx0XHRkaXJlY3Rpb246IHtcclxuXHRcdFx0cmFkOiAwLCAvLyBpbiByYWRpYW5zICgwIC0gMilcclxuXHRcdFx0bWluOiAwLCAvLyBsb3cgYm91bmRzIChyYWRpYW5zKVxyXG5cdFx0XHRtYXg6IDIgLy8gaGlnaCBib3VuZHMgKHJhZGlhbnMpXHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGFyZSBwYXJ0aWNsZXMgb2Zmc2V0IGZyb20gaW5pdGFsIHgveVxyXG5cdFx0cmFkaWFsRGlzcGxhY2VtZW50OiAyMCxcclxuXHRcdC8vIGlzIHRoZSBvZmZzZXQgZmVhdGhlcmVkP1xyXG5cdFx0cmFkaWFsRGlzcGxhY2VtZW50T2Zmc2V0OiAwLFxyXG5cclxuXHRcdC8vaW5pdGlhbCB2ZWxvY2l0eSBvZiBwYXJ0aWNsZXNcclxuXHRcdGltcHVsc2U6IHtcclxuXHRcdFx0cG93OiAwLFxyXG5cdFx0XHRtaW46IDUwLFxyXG5cdFx0XHRtYXg6IDgwXHJcblx0XHR9XHJcblx0fVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnNpbmdsZUJ1cnN0VGhlbWUgPSBzaW5nbGVCdXJzdFRoZW1lOyIsIi8vIGVtaXNzaW9uIHRoZW1lXHJcblxyXG52YXIgc21va2VTdHJlYW1UaGVtZSA9IHtcclxuXHJcblx0ZW1pdHRlcjoge1xyXG5cclxuXHRcdGFjdGl2ZTogMCxcclxuXHJcblx0XHQvLyBwb3NpdGlvblxyXG5cdFx0eDogMCxcclxuXHRcdHk6IDAsXHJcblx0XHR4VmVsOiAwLFxyXG5cdFx0eVZlbDogMCxcclxuXHRcdGFwcGx5R2xvYmFsRm9yY2VzOiBmYWxzZVxyXG5cdH0sXHJcblxyXG5cdC8vIGVtaXNzaW9uIHJhdGUgY29uZmlnIChwZXIgY3ljbGUgKCBmcmFtZSApIClcclxuXHRlbWlzc2lvbjoge1xyXG5cclxuXHRcdHJhdGU6IHtcclxuXHRcdFx0bWluOiA1LFxyXG5cdFx0XHRtYXg6IDEwLFxyXG5cclxuXHRcdFx0ZGVjYXk6IHtcclxuXHRcdFx0XHRyYXRlOiAwLFxyXG5cdFx0XHRcdGRlY2F5TWF4OiAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gZW1pc3Npb24gcmVwZWF0ZXIgY29uZmlnXHJcblx0XHRyZXBlYXRlcjoge1xyXG5cdFx0XHQvLyB3aGF0IGlzIHRoZSByZXBldGl0aW9uIHJhdGUgKCBmcmFtZXMgKVxyXG5cdFx0XHRyYXRlOiAwLFxyXG5cdFx0XHQvLyBkb2VzIHRoZSByZXBldGl0aW9uIHJhdGUgZGVjYXkgKCBnZXQgbG9uZ2VyICk/IGhvdyBtdWNoIGxvbmdlcj8gXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0XHRkZWNheU1heDogMFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGluaXRpYWwgZGlyZWN0aW9uIG9mIHBhcnRpY2xlc1xyXG5cdFx0ZGlyZWN0aW9uOiB7XHJcblx0XHRcdHJhZDogMCwgLy8gaW4gcmFkaWFucyAoMCAtIDIpXHJcblx0XHRcdG1pbjogMS40OSwgLy8gbG93IGJvdW5kcyAocmFkaWFucylcclxuXHRcdFx0bWF4OiAxLjUxIC8vIGhpZ2ggYm91bmRzIChyYWRpYW5zKVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBhcmUgcGFydGljbGVzIG9mZnNldCBmcm9tIGluaXRhbCB4L3lcclxuXHRcdHJhZGlhbERpc3BsYWNlbWVudDogMCxcclxuXHRcdC8vIGlzIHRoZSBvZmZzZXQgZmVhdGhlcmVkP1xyXG5cdFx0cmFkaWFsRGlzcGxhY2VtZW50T2Zmc2V0OiAwLFxyXG5cclxuXHRcdC8vaW5pdGlhbCB2ZWxvY2l0eSBvZiBwYXJ0aWNsZXNcclxuXHRcdGltcHVsc2U6IHtcclxuXHRcdFx0cG93OiAwLFxyXG5cdFx0XHRtaW46IDUsXHJcblx0XHRcdG1heDogMTBcclxuXHRcdH1cclxuXHR9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuc21va2VTdHJlYW1UaGVtZSA9IHNtb2tlU3RyZWFtVGhlbWU7IiwiLy8gZW1pc3Npb24gdGhlbWVcclxuXHJcbiAgdmFyIHdhcnBTdHJlYW1UaGVtZSA9IHtcclxuXHJcbiAgICBlbWl0dGVyOiB7XHJcblxyXG4gICAgICBhY3RpdmU6IDEsXHJcblxyXG4gICAgICAvLyBwb3NpdGlvblxyXG4gICAgICB4OiAwLFxyXG4gICAgICB5OiAwLFxyXG4gICAgICB4VmVsOiAwLFxyXG4gICAgICB5VmVsOiAwLFxyXG4gICAgICBhcHBseUdsb2JhbEZvcmNlczogZmFsc2VcclxuICAgIH0sXHJcblxyXG4gICAgLy8gZW1pc3Npb24gcmF0ZSBjb25maWcgKHBlciBjeWNsZSAoIGZyYW1lICkgKVxyXG4gICAgZW1pc3Npb246IHtcclxuXHJcbiAgICAgIHJhdGU6IHtcclxuICAgICAgICBtaW46IDEwLFxyXG4gICAgICAgIG1heDogMjAsXHJcblxyXG4gICAgICAgIGRlY2F5OiB7XHJcbiAgICAgICAgICByYXRlOiAwLFxyXG4gICAgICAgICAgZGVjYXlNYXg6IDBcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBlbWlzc2lvbiByZXBlYXRlciBjb25maWdcclxuICAgICAgcmVwZWF0ZXI6IHtcclxuICAgICAgICAvLyB3aGF0IGlzIHRoZSByZXBldGl0aW9uIHJhdGUgKCBmcmFtZXMgKVxyXG4gICAgICAgIHJhdGU6IDUsXHJcbiAgICAgICAgLy8gZG9lcyB0aGUgcmVwZXRpdGlvbiByYXRlIGRlY2F5ICggZ2V0IGxvbmdlciApPyBob3cgbXVjaCBsb25nZXI/IFxyXG4gICAgICAgIGRlY2F5OiB7XHJcbiAgICAgICAgICByYXRlOiAwLFxyXG4gICAgICAgICAgZGVjYXlNYXg6IDMwMFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vIGluaXRpYWwgZGlyZWN0aW9uIG9mIHBhcnRpY2xlc1xyXG4gICAgICBkaXJlY3Rpb246IHtcclxuICAgICAgICByYWQ6IDAsIC8vIGluIHJhZGlhbnMgKDAgLSAyKVxyXG4gICAgICAgIG1pbjogMCwgLy8gbG93IGJvdW5kcyAocmFkaWFucylcclxuICAgICAgICBtYXg6IDIgLy8gaGlnaCBib3VuZHMgKHJhZGlhbnMpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBhcmUgcGFydGljbGVzIG9mZnNldCBmcm9tIGluaXRhbCB4L3lcclxuICAgICAgcmFkaWFsRGlzcGxhY2VtZW50OiAxMDAsXHJcbiAgICAgIC8vIGlzIHRoZSBvZmZzZXQgZmVhdGhlcmVkP1xyXG4gICAgICByYWRpYWxEaXNwbGFjZW1lbnRPZmZzZXQ6IDAsXHJcblxyXG4gICAgICAvL2luaXRpYWwgdmVsb2NpdHkgb2YgcGFydGljbGVzXHJcbiAgICAgIGltcHVsc2U6IHtcclxuICAgICAgICBwb3c6IDAsXHJcbiAgICAgICAgbWluOiAwLjI1LFxyXG4gICAgICAgIG1heDogMS4yNVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH07XHJcblxyXG4gIG1vZHVsZS5leHBvcnRzLndhcnBTdHJlYW1UaGVtZSA9IHdhcnBTdHJlYW1UaGVtZTsiLCJyZXF1aXJlKCAnLi9wYXJ0aWNsZXMuanMnICk7IiwidmFyIGVudmlyb25tZW50ID0ge1xyXG5cclxuXHRcdHJ1bnRpbWVFbmdpbmU6IHtcclxuXHJcblx0XHRcdFx0c3RhcnRBbmltYXRpb246IGZ1bmN0aW9uIHN0YXJ0QW5pbWF0aW9uKGFuaW1WYXIsIGxvb3BGbikge1xyXG5cdFx0XHRcdFx0XHRpZiAoIWFuaW1WYXIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGFuaW1WYXIgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3BGbik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cclxuXHRcdFx0XHRzdG9wQW5pbWF0aW9uOiBmdW5jdGlvbiBzdG9wQW5pbWF0aW9uKGFuaW1WYXIpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGFuaW1WYXIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShhbmltVmFyKTtcclxuXHRcdFx0XHRcdFx0XHRcdGFuaW1WYXIgPSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHRjYW52YXM6IHtcclxuXHRcdFx0XHQvLyBidWZmZXIgY2xlYXIgZk5cclxuXHRcdFx0XHRjaGVja0NsZWFyQnVmZmVyUmVnaW9uOiBmdW5jdGlvbiBjaGVja0NsZWFyQnVmZmVyUmVnaW9uKHBhcnRpY2xlLCBjYW52YXNDb25maWcpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBidWZmZXJDbGVhclJlZ2lvbiA9IGNhbnZhc0NvbmZpZy5idWZmZXJDbGVhclJlZ2lvbjtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBlbnRpdHlXaWR0aCA9IHBhcnRpY2xlLnIgLyAyO1xyXG5cdFx0XHRcdFx0XHR2YXIgZW50aXR5SGVpZ2h0ID0gcGFydGljbGUuciAvIDI7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAocGFydGljbGUueCAtIGVudGl0eVdpZHRoIDwgYnVmZmVyQ2xlYXJSZWdpb24ueCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24ueCA9IHBhcnRpY2xlLnggLSBlbnRpdHlXaWR0aDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnggKyBlbnRpdHlXaWR0aCA+IGJ1ZmZlckNsZWFyUmVnaW9uLnggKyBidWZmZXJDbGVhclJlZ2lvbi53KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi53ID0gcGFydGljbGUueCArIGVudGl0eVdpZHRoIC0gYnVmZmVyQ2xlYXJSZWdpb24ueDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnkgLSBlbnRpdHlIZWlnaHQgPCBidWZmZXJDbGVhclJlZ2lvbi55KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi55ID0gcGFydGljbGUueSAtIGVudGl0eUhlaWdodDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnkgKyBlbnRpdHlIZWlnaHQgPiBidWZmZXJDbGVhclJlZ2lvbi55ICsgYnVmZmVyQ2xlYXJSZWdpb24uaCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24uaCA9IHBhcnRpY2xlLnkgKyBlbnRpdHlIZWlnaHQgLSBidWZmZXJDbGVhclJlZ2lvbi55O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHJcblx0XHRcdFx0cmVzZXRCdWZmZXJDbGVhclJlZ2lvbjogZnVuY3Rpb24gcmVzZXRCdWZmZXJDbGVhclJlZ2lvbihjYW52YXNDb25maWcpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBidWZmZXJDbGVhclJlZ2lvbiA9IGNhbnZhc0NvbmZpZy5idWZmZXJDbGVhclJlZ2lvbjtcclxuXHJcblx0XHRcdFx0XHRcdGJ1ZmZlckNsZWFyUmVnaW9uLnggPSBjYW52YXNDb25maWcuY2VudGVySDtcclxuXHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24ueSA9IGNhbnZhc0NvbmZpZy5jZW50ZXJWO1xyXG5cdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi53ID0gY2FudmFzQ29uZmlnLndpZHRoO1xyXG5cdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi5oID0gY2FudmFzQ29uZmlnLmhlaWdodDtcclxuXHRcdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGZvcmNlczoge1xyXG5cdFx0XHRcdGZyaWN0aW9uOiAwLjAxLFxyXG5cdFx0XHRcdGJvdXlhbmN5OiAxLFxyXG5cdFx0XHRcdGdyYXZpdHk6IDAsXHJcblx0XHRcdFx0d2luZDogMSxcclxuXHRcdFx0XHR0dXJidWxlbmNlOiB7IG1pbjogLTUsIG1heDogNSB9XHJcblx0XHR9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudDsiLCIvKipcclxuKiBwcm92aWRlcyBtYXRocyB1dGlsIG1ldGhvZHMuXHJcbipcclxuKiBAbWl4aW5cclxuKi9cclxuXHJcbnZhciBtYXRoVXRpbHMgPSB7XHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZW5lcmF0ZSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIDIgdmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIC0gbWluaW11bSB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0cmFuZG9tSW50ZWdlcjogZnVuY3Rpb24gcmFuZG9tSW50ZWdlcihtaW4sIG1heCkge1xyXG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggKyAxIC0gbWluKSkgKyBtaW47XHJcblx0fSxcclxuXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZW5lcmF0ZSByYW5kb20gZmxvYXQgYmV0d2VlbiAyIHZhbHVlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIG1pbmltdW0gdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSBtYXhpbXVtIHZhbHVlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdHJhbmRvbTogZnVuY3Rpb24gcmFuZG9tKG1pbiwgbWF4KSB7XHJcblx0XHRpZiAobWluID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0bWluID0gMDtcclxuXHRcdFx0bWF4ID0gMTtcclxuXHRcdH0gZWxzZSBpZiAobWF4ID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0bWF4ID0gbWluO1xyXG5cdFx0XHRtaW4gPSAwO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcclxuXHR9LFxyXG5cclxuXHRnZXRSYW5kb21BcmJpdHJhcnk6IGZ1bmN0aW9uIGdldFJhbmRvbUFyYml0cmFyeShtaW4sIG1heCkge1xyXG5cdFx0cmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcclxuXHR9LFxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gVHJhbnNmb3JtcyB2YWx1ZSBwcm9wb3J0aW9uYXRlbHkgYmV0d2VlbiBpbnB1dCByYW5nZSBhbmQgb3V0cHV0IHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSB0aGUgdmFsdWUgaW4gdGhlIG9yaWdpbiByYW5nZSAoIG1pbjEvbWF4MSApLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluMSAtIG1pbmltdW0gdmFsdWUgaW4gb3JpZ2luIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4MSAtIG1heGltdW0gdmFsdWUgaW4gb3JpZ2luIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluMiAtIG1pbmltdW0gdmFsdWUgaW4gZGVzdGluYXRpb24gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXgyIC0gbWF4aW11bSB2YWx1ZSBpbiBkZXN0aW5hdGlvbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IGNsYW1wUmVzdWx0IC0gY2xhbXAgcmVzdWx0IGJldHdlZW4gZGVzdGluYXRpb24gcmFuZ2UgYm91bmRhcnlzLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdG1hcDogZnVuY3Rpb24gbWFwKHZhbHVlLCBtaW4xLCBtYXgxLCBtaW4yLCBtYXgyLCBjbGFtcFJlc3VsdCkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0dmFyIHJldHVybnZhbHVlID0gKHZhbHVlIC0gbWluMSkgLyAobWF4MSAtIG1pbjEpICogKG1heDIgLSBtaW4yKSArIG1pbjI7XHJcblx0XHRpZiAoY2xhbXBSZXN1bHQpIHJldHVybiBzZWxmLmNsYW1wKHJldHVybnZhbHVlLCBtaW4yLCBtYXgyKTtlbHNlIHJldHVybiByZXR1cm52YWx1ZTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIENsYW1wIHZhbHVlIGJldHdlZW4gcmFuZ2UgdmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSB0aGUgdmFsdWUgaW4gdGhlIHJhbmdlIHsgbWlufG1heCB9LlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIC0gbWluaW11bSB2YWx1ZSBpbiB0aGUgcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSBtYXhpbXVtIHZhbHVlIGluIHRoZSByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IGNsYW1wUmVzdWx0IC0gY2xhbXAgcmVzdWx0IGJldHdlZW4gcmFuZ2UgYm91bmRhcnlzLlxyXG4gKi9cclxuXHRjbGFtcDogZnVuY3Rpb24gY2xhbXAodmFsdWUsIG1pbiwgbWF4KSB7XHJcblx0XHRpZiAobWF4IDwgbWluKSB7XHJcblx0XHRcdHZhciB0ZW1wID0gbWluO1xyXG5cdFx0XHRtaW4gPSBtYXg7XHJcblx0XHRcdG1heCA9IHRlbXA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbih2YWx1ZSwgbWF4KSk7XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMubWF0aFV0aWxzID0gbWF0aFV0aWxzOyIsInZhciByZW5kZXJQYXJ0aWNsZUFyciA9IHJlcXVpcmUoJy4vcGFydGljbGVGdW5jdGlvbnMvcmVuZGVyUGFydGljbGVBcnIuanMnKS5yZW5kZXJQYXJ0aWNsZUFycjtcclxudmFyIHVwZGF0ZVBhcnRpY2xlQXJyID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUZ1bmN0aW9ucy91cGRhdGVQYXJ0aWNsZUFyci5qcycpLnVwZGF0ZVBhcnRpY2xlQXJyO1xyXG5cclxudmFyIHBhcnRpY2xlQXJyRm4gPSB7XHJcblxyXG5cdHJlbmRlclBhcnRpY2xlQXJyOiByZW5kZXJQYXJ0aWNsZUFycixcclxuXHR1cGRhdGVQYXJ0aWNsZUFycjogdXBkYXRlUGFydGljbGVBcnJcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5wYXJ0aWNsZUFyckZuID0gcGFydGljbGVBcnJGbjsiLCJ2YXIgY2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUZ1bmN0aW9ucy9jaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnMuanMnKS5jaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnM7XHJcbnZhciBjcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMgPSByZXF1aXJlKCcuL3BhcnRpY2xlRnVuY3Rpb25zL2NyZWF0ZVBlclBhcnRpY2xlQXR0cmlidXRlcy5qcycpLmNyZWF0ZVBlclBhcnRpY2xlQXR0cmlidXRlcztcclxudmFyIHVwZGF0ZVBhcnRpY2xlID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUZ1bmN0aW9ucy91cGRhdGVQYXJ0aWNsZS5qcycpLnVwZGF0ZVBhcnRpY2xlO1xyXG52YXIga2lsbFBhcnRpY2xlID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUZ1bmN0aW9ucy9raWxsUGFydGljbGUuanMnKS5raWxsUGFydGljbGU7XHJcblxyXG52YXIgcGFydGljbGVGbiA9IHtcclxuXHJcblx0Y2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zOiBjaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnMsXHJcblx0Y3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzOiBjcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMsXHJcblx0dXBkYXRlUGFydGljbGU6IHVwZGF0ZVBhcnRpY2xlLFxyXG5cdGtpbGxQYXJ0aWNsZToga2lsbFBhcnRpY2xlXHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMucGFydGljbGVGbiA9IHBhcnRpY2xlRm47IiwidmFyIGNoZWNrUGFydGljbGVLaWxsQ29uZGl0aW9ucyA9IGZ1bmN0aW9uIGNoZWNrUGFydGljbGVLaWxsQ29uZGl0aW9ucyhwLCBjYW5XLCBjYW5IKSB7XHJcbiAgICAvLyBjaGVjayBvbiBwYXJ0aWNsZSBraWxsIGNvbmRpdGlvbnNcclxuICAgIC8vIHNlZW1zIGNvbXBsaWNhdGVkICggbmVzdGVkIElGcyApIGJ1dCB0cmllcyB0byBzdG9wIGNoZWNrXHJcbiAgICAvLyB3aXRob3V0IGhhdmluZyB0byBtYWtlIGFsbCB0aGUgY2hlY2tzIGlmIGEgY29uZGl0aW9uIGlzIGhpdFxyXG4gICAgdmFyIGsgPSBwLmtpbGxDb25kaXRpb25zO1xyXG4gICAgdmFyIGtDb2wgPSBrLmNvbG9yQ2hlY2s7XHJcbiAgICB2YXIga0F0dHIgPSBrLnBlckF0dHJpYnV0ZTtcclxuICAgIHZhciBrQk8gPSBrLmJvdW5kYXJ5T2Zmc2V0O1xyXG5cclxuICAgIGlmIChrQ29sLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBmb3IgKHZhciBpID0ga0NvbC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICB2YXIgdGhpc0NoZWNrSXRlbSA9IGtDb2xbaV07XHJcbiAgICAgICAgICAgIGlmIChwLmNvbG9yNERhdGFbdGhpc0NoZWNrSXRlbS5uYW1lXSA8PSB0aGlzQ2hlY2tJdGVtLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoa0F0dHIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBrQXR0ci5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICB2YXIgdGhpc0NoZWNrSXRlbSA9IGtBdHRyW2ldO1xyXG4gICAgICAgICAgICBpZiAocFt0aGlzQ2hlY2tJdGVtLm5hbWVdIDw9IHRoaXNDaGVja0l0ZW0udmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChrLmJvdW5kYXJ5Q2hlY2sgPT09IHRydWUpIHtcclxuICAgICAgICAvLyBzdG9yZSBwLnIgYW5kIGdpdmUgYnVmZmVyICggKiA0ICkgdG8gYWNjb21vZGF0ZSBwb3NzaWJsZSB3YXJwaW5nXHJcbiAgICAgICAgdmFyIHBSYWQgPSBwLnIgKiA0O1xyXG4gICAgICAgIGlmIChwLnggLSBwUmFkIDwgMCAtIGtCTykge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocC54ICsgcFJhZCA+IGNhblcgKyBrQk8pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHAueSAtIHBSYWQgPCAwIC0ga0JPKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwLnkgKyBwUmFkID4gY2FuSCArIGtCTykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zID0gY2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zOyIsInZhciB0cmlnID0gcmVxdWlyZSgnLi8uLi90cmlnb25vbWljVXRpbHMuanMnKS50cmlnb25vbWljVXRpbHM7XHJcbnZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuLy4uL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxudmFyIGdldFZhbHVlID0gcmVxdWlyZSgnLi8uLi91dGlsaXRpZXMuanMnKS5nZXRWYWx1ZTtcclxuXHJcbnZhciBjcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMgPSBmdW5jdGlvbiBjcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMoeCwgeSwgZW1pc3Npb25PcHRzLCBwZXJQYXJ0aWNsZU9wdHMpIHtcclxuICAgIC8vIGxldCB0aGVtZWQgPSBwZXJQYXJ0aWNsZU9wdHMudGhlbWUgfHwgdGhlbWVzLnJlc2V0O1xyXG5cclxuICAgIHZhciB0aGVtZWQgPSBwZXJQYXJ0aWNsZU9wdHMgfHwgdGhlbWVzLnJlc2V0O1xyXG4gICAgdmFyIGVtaXRUaGVtZWQgPSBlbWlzc2lvbk9wdHMgfHwgZmFsc2U7XHJcbiAgICB2YXIgbGlmZSA9IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKHRoZW1lZC5saWZlLm1pbiwgdGhlbWVkLmxpZmUubWF4KTtcclxuICAgIC8vIHVzZSBiaXR3aXNlIHRvIGNoZWNrIGZvciBvZGQvZXZlbiBsaWZlIHZhbHMuIE1ha2UgZXZlbiB0byBoZWxwIHdpdGggYW5pbXMgdGhhdCBhcmUgZnJhY3Rpb24gb2YgbGlmZSAoZnJhbWVzKVxyXG4gICAgbGlmZSAmIDEgPyBsaWZlKysgOiBmYWxzZTtcclxuXHJcbiAgICB2YXIgZW1pc3Npb24gPSBlbWl0VGhlbWVkLmVtaXNzaW9uIHx8IGVtaXRUaGVtZWQ7XHJcblxyXG4gICAgdmFyIGRpcmVjdGlvbiA9IGVtaXNzaW9uLmRpcmVjdGlvbi5yYWQgPiAwID8gZW1pc3Npb24uZGlyZWN0aW9uLnJhZCA6IG1hdGhVdGlscy5nZXRSYW5kb21BcmJpdHJhcnkoZW1pc3Npb24uZGlyZWN0aW9uLm1pbiwgZW1pc3Npb24uZGlyZWN0aW9uLm1heCkgKiBNYXRoLlBJO1xyXG5cclxuICAgIC8vIHNldCBuZXcgcGFydGljbGUgb3JpZ2luIGRlcGVuZGFudCBvbiB0aGUgcmFkaWFsIGRpc3BsYWNlbWVudFxyXG4gICAgaWYgKGVtaXNzaW9uLnJhZGlhbERpc3BsYWNlbWVudCA+IDApIHtcclxuICAgICAgICB2YXIgbmV3Q29vcmRzID0gdHJpZy5yYWRpYWxEaXN0cmlidXRpb24oeCwgeSwgZW1pc3Npb24ucmFkaWFsRGlzcGxhY2VtZW50ICsgbWF0aFV0aWxzLnJhbmRvbShlbWlzc2lvbi5yYWRpYWxEaXNwbGFjZW1lbnRPZmZzZXQgKiAtMSwgZW1pc3Npb24ucmFkaWFsRGlzcGxhY2VtZW50T2Zmc2V0KSwgZGlyZWN0aW9uKTtcclxuXHJcbiAgICAgICAgeCA9IG5ld0Nvb3Jkcy54O1xyXG4gICAgICAgIHkgPSBuZXdDb29yZHMueTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaW1wdWxzZSA9IGVtaXNzaW9uLmltcHVsc2UucG93ID4gMCA/IGVtaXNzaW9uLmltcHVsc2UucG93IDogbWF0aFV0aWxzLnJhbmRvbShlbWlzc2lvbi5pbXB1bHNlLm1pbiwgZW1pc3Npb24uaW1wdWxzZS5tYXgpO1xyXG5cclxuICAgIHZhciBpbml0UiA9IG1hdGhVdGlscy5yYW5kb20odGhlbWVkLnJhZGl1cy5taW4sIHRoZW1lZC5yYWRpdXMubWF4KTtcclxuICAgIHZhciB0YXJnZXRSYWRpdXMgPSBtYXRoVXRpbHMucmFuZG9tKHRoZW1lZC50YXJnZXRSYWRpdXMubWluLCB0aGVtZWQudGFyZ2V0UmFkaXVzLm1heCk7XHJcbiAgICB2YXIgYWNjZWxlcmF0aW9uID0gbWF0aFV0aWxzLnJhbmRvbSh0aGVtZWQudmVsQWNjZWxlcmF0aW9uLm1pbiwgdGhlbWVkLnZlbEFjY2VsZXJhdGlvbi5tYXgpO1xyXG4gICAgdmFyIHZlbG9jaXRpZXMgPSB0cmlnLmNhbGN1bGF0ZVZlbG9jaXRpZXMoeCwgeSwgZGlyZWN0aW9uLCBpbXB1bHNlKTtcclxuXHJcbiAgICB2YXIgaW5pdENvbG9yID0gdGhlbWVkLmNvbG9yUHJvZmlsZXNbMF07XHJcbiAgICB2YXIgY29sb3I0RGF0YSA9IHtcclxuICAgICAgICByOiBpbml0Q29sb3IucixcclxuICAgICAgICBnOiBpbml0Q29sb3IuZyxcclxuICAgICAgICBiOiBpbml0Q29sb3IuYixcclxuICAgICAgICBhOiBpbml0Q29sb3IuYVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgd2lsbEZsYXJlID0gdm9pZCAwO1xyXG4gICAgdmFyIHdpbGxGbGFyZVRlbXAgPSBtYXRoVXRpbHMucmFuZG9tSW50ZWdlcigwLCAxMDAwKTtcclxuXHJcbiAgICB2YXIgdGVtcEN1c3RvbSA9IHtcclxuICAgICAgICBsZW5zRmxhcmU6IHtcclxuICAgICAgICAgICAgbWlnaHRGbGFyZTogdHJ1ZSxcclxuICAgICAgICAgICAgd2lsbEZsYXJlOiB0aGVtZWQuY3VzdG9tQXR0cmlidXRlcy5sZW5zRmxhcmUubWlnaHRGbGFyZSA9PT0gdHJ1ZSAmJiB3aWxsRmxhcmVUZW1wIDwgMSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICAgICAgYW5nbGU6IDAuMzBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGxldCBjdXN0b21BdHRyaWJ1dGVzID0gdGhlbWVkLmN1c3RvbUF0dHJpYnV0ZXM7XHJcblxyXG5cclxuICAgIH07XHJcblxyXG4gICAgdmFyIHBwYSA9IHtcclxuICAgICAgICBhY3RpdmU6IHBlclBhcnRpY2xlT3B0cy5hY3RpdmUgfHwgdGhlbWVkLmFjdGl2ZSB8fCAwLFxyXG4gICAgICAgIGluaXRSOiBpbml0UixcclxuICAgICAgICB0UjogdGFyZ2V0UmFkaXVzLFxyXG4gICAgICAgIGxpZmVTcGFuOiBsaWZlLFxyXG4gICAgICAgIGFuZ2xlOiBkaXJlY3Rpb24sXHJcbiAgICAgICAgbWFnbml0dWRlOiBpbXB1bHNlLFxyXG4gICAgICAgIHJlbGF0aXZlTWFnbml0dWRlOiBpbXB1bHNlLFxyXG4gICAgICAgIG1hZ25pdHVkZURlY2F5OiB0aGVtZWQubWFnRGVjYXksXHJcbiAgICAgICAgeDogeCxcclxuICAgICAgICB5OiB5LFxyXG4gICAgICAgIHhWZWw6IHZlbG9jaXRpZXMueFZlbCxcclxuICAgICAgICB5VmVsOiB2ZWxvY2l0aWVzLnlWZWwsXHJcbiAgICAgICAgdkFjYzogYWNjZWxlcmF0aW9uLFxyXG4gICAgICAgIGFwcGx5Rm9yY2VzOiB0aGVtZWQuYXBwbHlHbG9iYWxGb3JjZXMsXHJcbiAgICAgICAgY29sb3I0RGF0YToge1xyXG4gICAgICAgICAgICByOiBjb2xvcjREYXRhLnIsIGc6IGNvbG9yNERhdGEuZywgYjogY29sb3I0RGF0YS5iLCBhOiBjb2xvcjREYXRhLmFcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbG9yUHJvZmlsZXM6IHRoZW1lZC5jb2xvclByb2ZpbGVzLFxyXG5cclxuICAgICAgICAvLyBjb2xvcjRDaGFuZ2U6IGNvbG9yNENoYW5nZSxcclxuICAgICAgICBraWxsQ29uZGl0aW9uczogdGhlbWVkLmtpbGxDb25kaXRpb25zLFxyXG4gICAgICAgIGN1c3RvbUF0dHJpYnV0ZXM6IHRlbXBDdXN0b20sXHJcbiAgICAgICAgLy8gcmVuZGVyRk46IHRoZW1lZC5yZW5kZXJQYXJ0aWNsZSB8fCByZW5kZXJQYXJ0aWNsZSxcclxuICAgICAgICByZW5kZXJGTjogdGhlbWVkLnJlbmRlclBhcnRpY2xlLFxyXG4gICAgICAgIGV2ZW50czogdGhlbWVkLmV2ZW50c1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLy8gY29uc29sZS5sb2coICdjb2xvcjREYXRhRW5kOiAnLCBjb2xvcjREYXRhRW5kICk7XHJcbiAgICB2YXIgYW5pbUFyciA9IFtdO1xyXG4gICAgdmFyIHBhcnRpY2xlQW5pbVRyYWNrQXJyID0gdGhlbWVkLmFuaW1hdGlvblRyYWNrcztcclxuICAgIHZhciBzcGxDaHJzID0gJy4nO1xyXG4gICAgLy8gY29uc29sZS5sb2coICd0aGVtZWQuYW5pbWF0aW9uVHJhY2tzOiAnLCB0aGVtZWQuYW5pbWF0aW9uVHJhY2tzICk7XHJcbiAgICBpZiAocGFydGljbGVBbmltVHJhY2tBcnIgJiYgcGFydGljbGVBbmltVHJhY2tBcnIubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIHBhcnRpY2xlQW5pbVRyYWNrQXJyTGVuID0gcGFydGljbGVBbmltVHJhY2tBcnIubGVuZ3RoO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBwYXJ0aWNsZUFuaW1UcmFja0FyckxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdCA9IHBhcnRpY2xlQW5pbVRyYWNrQXJyW2ldO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ3Q6ICcsIHQgKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwcm0gPSB0LnBhcmFtLnNwbGl0KHNwbENocnMpO1xyXG4gICAgICAgICAgICB2YXIgcHJtVGVtcCA9IHsgcGF0aDogcHJtLCBwYXRoTGVuOiBwcm0ubGVuZ3RoIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgYmFzZVZhbCA9IGdldFZhbHVlKHQuYmFzZUFtb3VudCwgcHBhKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRWYWwgPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIGlmICh0LnRhcmdldFZhbHVlUGF0aCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChnZXRWYWx1ZSh0LnRhcmdldFZhbHVlUGF0aCwgcHBhKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFZhbCA9IGJhc2VWYWwgKiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VmFsID0gZ2V0VmFsdWUodC50YXJnZXRWYWx1ZVBhdGgsIHBwYSkgLSBiYXNlVmFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHQudGFyZ2V0QW1vdW50KSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRWYWwgPSB0LnRhcmdldEFtb3VudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGR1cmF0aW9uID0gdm9pZCAwO1xyXG4gICAgICAgICAgICB0LmR1cmF0aW9uID09PSAnbGlmZScgPyBkdXJhdGlvbiA9IGxpZmUgOiB0LmR1cmF0aW9uIDwgMSA/IGR1cmF0aW9uID0gbGlmZSAqIHQuZHVyYXRpb24gOiB0LmR1cmF0aW9uID4gMSA/IGR1cmF0aW9uID0gbGlmZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgYW5pbUFyci5wdXNoKHsgYW5pbU5hbWU6IHQuYW5pbU5hbWUsIGFjdGl2ZTogdC5hY3RpdmUsIHBhcmFtOiBwcm1UZW1wLCBiYXNlQW1vdW50OiBiYXNlVmFsLCB0YXJnZXRBbW91bnQ6IHRhcmdldFZhbCwgZHVyYXRpb246IGR1cmF0aW9uLCBlYXNpbmc6IHQuZWFzaW5nLCBsaW5rZWRBbmltOiB0LmxpbmtlZEFuaW0sIGxpbmtlZEV2ZW50OiB0LmxpbmtlZEV2ZW50IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcGEuYW5pbWF0aW9uVHJhY2tzID0gYW5pbUFycjtcclxuXHJcbiAgICByZXR1cm4gcHBhO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzID0gY3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzOyIsInZhciBraWxsUGFydGljbGUgPSBmdW5jdGlvbiBraWxsUGFydGljbGUobGlzdCwgaW5kZXgsIGVudGl0eUNvdW50ZXIpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYuaXNBbGl2ZSA9IDA7XHJcbiAgICBsaXN0Lmluc2VydChpbmRleCk7XHJcbiAgICBlbnRpdHlDb3VudGVyLnN1YnRyYWN0KDEpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMua2lsbFBhcnRpY2xlID0ga2lsbFBhcnRpY2xlOyIsInZhciByZW5kZXJQYXJ0aWNsZUFyciA9IGZ1bmN0aW9uIHJlbmRlclBhcnRpY2xlQXJyKGNvbnRleHQsIGFyciwgYW5pbWF0aW9uKSB7XHJcbiAgICB2YXIgdGhpc0FyciA9IGFycjtcclxuICAgIHZhciBhcnJMZW4gPSB0aGlzQXJyLmxlbmd0aDtcclxuXHJcbiAgICB2YXIgcmVuZGVyZWQgPSAwO1xyXG4gICAgdmFyIG5vdFJlbmRlcmVkID0gMDtcclxuICAgIC8vIGNvbnNvbGUubG9nKCAncmVuZGVyaW5nIGxvb3AnICk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IGFyckxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgdmFyIHAgPSB0aGlzQXJyW2ldO1xyXG4gICAgICAgIHAuaXNBbGl2ZSAhPSAwID8gKHAucmVuZGVyKHAueCwgcC55LCBwLnIsIHAuY29sb3I0RGF0YSwgY29udGV4dCksIHJlbmRlcmVkKyspIDogbm90UmVuZGVyZWQrKztcclxuICAgIH1cclxuICAgIC8vIGNvbnNvbGUubG9nKCAncmVuZGVyZWQ6ICcrcmVuZGVyZWQrJyBub3RSZW5kZXJlZDogJytub3RSZW5kZXJlZCApO1xyXG4gICAgLy8gbm90UmVuZGVyZWQgPT09IGFyckxlbiA/XHJcbiAgICAvLyAoIGNvbnNvbGUubG9nKCAnbm90UmVuZGVyZWQgPT09IDA6IHN0b3AgYW5pbScgKSwgYW5pbWF0aW9uLnN0YXRlID0gZmFsc2UgKSA6IDA7XHJcbiAgICBub3RSZW5kZXJlZCA9PT0gYXJyTGVuID8gYW5pbWF0aW9uLnN0YXRlID0gZmFsc2UgOiAwO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMucmVuZGVyUGFydGljbGVBcnIgPSByZW5kZXJQYXJ0aWNsZUFycjsiLCJ2YXIgZWFzaW5nID0gcmVxdWlyZSgnLi8uLi9lYXNpbmcuanMnKS5lYXNpbmdFcXVhdGlvbnM7XHJcbnZhciBlbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vLi4vZW52aXJvbm1lbnQuanMnKS5lbnZpcm9ubWVudDtcclxudmFyIHBoeXNpY3MgPSBlbnZpcm9ubWVudC5mb3JjZXM7XHJcblxyXG52YXIgdXBkYXRlUGFydGljbGUgPSBmdW5jdGlvbiB1cGRhdGVQYXJ0aWNsZShlbWl0dGVyQXJyKSB7XHJcbiAgICB2YXIgcCA9IHRoaXM7XHJcbiAgICB2YXIgdG90YWxMaWZlVGlja3MgPSBwLmxpZmVTcGFuO1xyXG5cclxuICAgIC8vIHBvc2l0aW9uXHJcbiAgICAvLyBwLnggKz0gcC54VmVsICogcC5tYWduaXR1ZGVEZWNheTtcclxuICAgIC8vIHAueSArPSBwLnlWZWwgKiBwLm1hZ25pdHVkZURlY2F5O1xyXG4gICAgcC54ICs9IHAueFZlbDtcclxuICAgIHAueSArPSBwLnlWZWw7XHJcblxyXG4gICAgcC54VmVsICo9IHAudkFjYztcclxuICAgIHAueVZlbCAqPSBwLnZBY2M7XHJcblxyXG4gICAgLy8gcC55VmVsICs9IHBoeXNpY3MuZ3Jhdml0eTtcclxuICAgIC8vIHAueFZlbCArPSBwaHlzaWNzLndpbmQ7XHJcbiAgICAvLyBwLnJlbGF0aXZlTWFnbml0dWRlICo9IHAubWFnbml0dWRlRGVjYXk7XHJcblxyXG4gICAgcC5yZWxhdGl2ZU1hZ25pdHVkZSAqPSBwLnZBY2MgKiAxLjAwNTtcclxuXHJcbiAgICBpZiAocC5hcHBseUZvcmNlcykge1xyXG4gICAgICAgIHAueVZlbCArPSBwaHlzaWNzLmdyYXZpdHk7XHJcbiAgICB9XHJcbiAgICAvLyBzcGVlZFxyXG4gICAgLy8gcC5tYWduaXR1ZGVEZWNheSA+IDAgPyBwLm1hZ25pdHVkZURlY2F5IC09IHBoeXNpY3MuZnJpY3Rpb24gOiBwLm1hZ25pdHVkZURlY2F5ID0gMDtcclxuXHJcbiAgICAvLyBwLm1hZ25pdHVkZURlY2F5ICs9IChwLnZBY2MgKiAwLjAwMDI1KTtcclxuICAgIC8vIHAubWFnbml0dWRlRGVjYXkgPSBkZWNjZWxlcmF0ZU1hZ25pdHVkZSggcCApO1xyXG4gICAgLy8gcC5tYWduaXR1ZGVEZWNheSA9IGFjY2VsZXJhdGVNYWduaXR1ZGUoIHAgKTtcclxuXHJcbiAgICAvLyBsaWZlXHJcbiAgICBwLmN1cnJMaWZlSW52ID0gdG90YWxMaWZlVGlja3MgLSBwLmN1cnJMaWZlO1xyXG4gICAgdmFyIGN1cnJMaWZlVGljayA9IHAuY3VyckxpZmVJbnY7XHJcbiAgICAvLyBzaXplIChyYWRpdXMgZm9yIGNpcmNsZSlcclxuXHJcblxyXG4gICAgdmFyIGFuaW1UcmFja3MgPSBwLmFuaW1hdGlvblRyYWNrcztcclxuICAgIHZhciBhbmltVHJhY2tzTGVuID0gYW5pbVRyYWNrcy5sZW5ndGg7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IGFuaW1UcmFja3NMZW4gLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnaScsIGkgKTtcclxuICAgICAgICB2YXIgdCA9IGFuaW1UcmFja3NbaV07XHJcblxyXG4gICAgICAgIGlmICh0LmFjdGl2ZSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHBhcmFtUGF0aCA9IHQucGFyYW0ucGF0aCxcclxuICAgICAgICAgICAgICAgIHBhcmFtTGVuID0gdC5wYXJhbS5wYXRoTGVuO1xyXG5cclxuICAgICAgICAgICAgcGFyYW1MZW4gPT09IDEgPyBwW3BhcmFtUGF0aFswXV0gPSBlYXNpbmdbdC5lYXNpbmddKGN1cnJMaWZlVGljaywgdC5iYXNlQW1vdW50LCB0LnRhcmdldEFtb3VudCwgdC5kdXJhdGlvbikgOiBwYXJhbUxlbiA9PT0gMiA/IHBbcGFyYW1QYXRoWzBdXVtwYXJhbVBhdGhbMV1dID0gZWFzaW5nW3QuZWFzaW5nXShjdXJyTGlmZVRpY2ssIHQuYmFzZUFtb3VudCwgdC50YXJnZXRBbW91bnQsIHQuZHVyYXRpb24pIDogcGFyYW1MZW4gPT09IDMgPyBwW3BhcmFtUGF0aFswXV1bcGFyYW1QYXRoWzFdXVtwYXJhbVBhdGhbMl1dID0gZWFzaW5nW3QuZWFzaW5nXShjdXJyTGlmZVRpY2ssIHQuYmFzZUFtb3VudCwgdC50YXJnZXRBbW91bnQsIHQuZHVyYXRpb24pIDogZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VyckxpZmVUaWNrID09PSB0LmR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0LmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0LmxpbmtlZEV2ZW50ICE9PSBmYWxzZSAmJiB0eXBlb2YgdC5saW5rZWRFdmVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcnRpY2xlRXZlbnRzID0gcC5ldmVudHM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBwYXJ0aWNsZUV2ZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNQYXJ0aWNsZUV2ZW50ID0gcC5ldmVudHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzUGFydGljbGVFdmVudC5ldmVudFR5cGUgPSB0LmxpbmtlZEV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodC5saW5rZWRFdmVudCA9PT0gJ2VtaXQnKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzUGFydGljbGVFdmVudFBhcmFtcyA9IHRoaXNQYXJ0aWNsZUV2ZW50LmV2ZW50UGFyYW1zO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNQYXJ0aWNsZUV2ZW50UGFyYW1zLmVtaXR0ZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNQYXJ0aWNsZUV2ZW50UGFyYW1zLmVtaXR0ZXIudHJpZ2dlckVtaXR0ZXIoeyB4OiBwLngsIHk6IHAueSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gZW1pdHRlckFyci5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtaXR0ZXJBcnJbal0ubmFtZSA9PT0gdGhpc1BhcnRpY2xlRXZlbnRQYXJhbXMuZW1pdHRlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzUGFydGljbGVFdmVudFBhcmFtcy5lbWl0dGVyID0gZW1pdHRlckFycltqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzUGFydGljbGVFdmVudFBhcmFtcy5lbWl0dGVyLnRyaWdnZXJFbWl0dGVyKHsgeDogcC54LCB5OiBwLnkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHAuaWR4ID09IDk5ODcpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLndhcm4oICdmbGlwcGluZyBhbmltJyApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0LmxpbmtlZEFuaW0gIT09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSBhbmltVHJhY2tzTGVuIC0gMTsgaiA+PSAwOyBqLS0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1UcmFja3Nbal0uYW5pbU5hbWUgPT09IHQubGlua2VkQW5pbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVRyYWNrc1tqXS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChwLmlkeCA9PSA5OTg3KSB7fVxyXG4gICAgLy8gY29uc29sZS5sb2coICd0aGlzUGFydGljbGVBbHBoYScsICBwLmNvbG9yNERhdGEuYSApO1xyXG5cclxuXHJcbiAgICAvLyBsaWZlIHRha2V0aCBhd2F5XHJcbiAgICBwLmN1cnJMaWZlLS07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy51cGRhdGVQYXJ0aWNsZSA9IHVwZGF0ZVBhcnRpY2xlOyIsInZhciBwYXJ0aWNsZUZuID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZUZuLmpzJykucGFydGljbGVGbjtcclxuXHJcbnZhciB1cGRhdGVQYXJ0aWNsZUFyciA9IGZ1bmN0aW9uIHVwZGF0ZVBhcnRpY2xlQXJyKGNvbnRleHQsIHN0b3JlQXJyLCBwb29sQXJyLCBhbmltYXRpb24sIGNhbnZhc0NvbmZpZywgZW50aXR5Q291bnRlciwgZW1pdHRlclN0b3JlKSB7XHJcbiAgICAvLyBsb29wIGhvdXNla2VlcGluZ1xyXG4gICAgdmFyIGFyciA9IHN0b3JlQXJyO1xyXG4gICAgdmFyIGFyckxlbiA9IGFyci5sZW5ndGggLSAxO1xyXG4gICAgZm9yICh2YXIgaSA9IGFyckxlbjsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICB2YXIgcCA9IGFycltpXTtcclxuICAgICAgICBwLmlzQWxpdmUgIT0gMCA/IHBhcnRpY2xlRm4uY2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zKHAsIGNhbnZhc0NvbmZpZy53aWR0aCwgY2FudmFzQ29uZmlnLmhlaWdodCkgPyBwLmtpbGwocG9vbEFyciwgcC5pZHgsIGVudGl0eUNvdW50ZXIpIDogcC51cGRhdGUoZW1pdHRlclN0b3JlKSA6IGZhbHNlO1xyXG4gICAgfSAvLyBlbmQgRm9yIGxvb3BcclxuICAgIC8vIGxpdmVFbnRpdHlDb3VudCA9PT0gMCA/ICggY29uc29sZS5sb2coICdsaXZlRW50aXR5Q291bnQgPT09IDAgc3RvcCBhbmltJyApLCBhbmltYXRpb24uc3RhdGUgPSBmYWxzZSApIDogMDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnVwZGF0ZVBhcnRpY2xlQXJyID0gdXBkYXRlUGFydGljbGVBcnI7IiwidmFyIGZpcmVUaGVtZSA9IHJlcXVpcmUoJy4vdGhlbWVzL2ZpcmUvdGhlbWUuanMnKS5maXJlVGhlbWU7XHJcbnZhciByZXNldFRoZW1lID0gcmVxdWlyZSgnLi90aGVtZXMvcmVzZXQvcmVzZXRUaGVtZS5qcycpLnJlc2V0VGhlbWU7XHJcbnZhciB3YXJwU3RhclRoZW1lID0gcmVxdWlyZSgnLi90aGVtZXMvd2FycFN0YXIvd2FycFN0YXJUaGVtZS5qcycpLndhcnBTdGFyVGhlbWU7XHJcbnZhciBmbGFtZVRoZW1lID0gcmVxdWlyZSgnLi90aGVtZXMvZmxhbWUvZmxhbWVUaGVtZS5qcycpLmZsYW1lVGhlbWU7XHJcbnZhciBzbW9rZVRoZW1lID0gcmVxdWlyZSgnLi90aGVtZXMvc21va2Uvc21va2VUaGVtZS5qcycpLnNtb2tlVGhlbWU7XHJcblxyXG52YXIgdGhlbWVzID0ge1xyXG4gICByZXNldDogcmVzZXRUaGVtZSxcclxuICAgZmlyZTogZmlyZVRoZW1lLFxyXG4gICB3YXJwU3Rhcjogd2FycFN0YXJUaGVtZSxcclxuICAgZmxhbWU6IGZsYW1lVGhlbWUsXHJcbiAgIHNtb2tlOiBzbW9rZVRoZW1lXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy50aGVtZXMgPSB0aGVtZXM7IiwidmFyIGFuaW1hdGlvblRyYWNrcyA9IFtcclxuXHR7XHJcblx0XHQgIGFuaW1OYW1lOiAncmFkaXVzRmFkZScsXHJcblx0XHQgIGFjdGl2ZTogdHJ1ZSxcclxuXHRcdCAgcGFyYW06ICdyJyxcclxuXHRcdCAgYmFzZUFtb3VudDogJ2luaXRSJyxcclxuXHRcdCAgdGFyZ2V0VmFsdWVQYXRoOiAndFInLFxyXG5cdFx0ICAvLyB0YXJnZXRBbW91bnQ6IDAuMDAwMDIsXHJcblx0XHQgIGR1cmF0aW9uOiAnbGlmZScsXHJcblx0XHQgIGVhc2luZzogJ2Vhc2VJbkV4cG8nLFxyXG5cdFx0ICBsaW5rZWRBbmltOiBmYWxzZVxyXG5cdH0sXHJcblx0e1xyXG5cdFx0ICBhbmltTmFtZTogJ2NvbG9yNERhdGFDaGFuZ2VSZWQnLFxyXG5cdFx0ICBhY3RpdmU6IHRydWUsXHJcblx0XHQgIHBhcmFtOiAnY29sb3I0RGF0YS5yJyxcclxuXHRcdCAgYmFzZUFtb3VudDogJ2NvbG9yUHJvZmlsZXNbMF0ucicsXHJcblx0XHQgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbMV0ucicsXHJcblx0XHQgIGR1cmF0aW9uOiAnbGlmZScsXHJcblx0XHQgIGVhc2luZzogJ2Vhc2VJbk91dEJvdW5jZScsXHJcblx0XHQgIGxpbmtlZEFuaW06IGZhbHNlXHJcblx0fSxcclxuXHR7XHJcblx0XHQgIGFuaW1OYW1lOiAnY29sb3I0RGF0YUNoYW5nZUdyZWVuJyxcclxuXHRcdCAgYWN0aXZlOiB0cnVlLFxyXG5cdFx0ICBwYXJhbTogJ2NvbG9yNERhdGEuZycsXHJcblx0XHQgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmcnLFxyXG5cdFx0ICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmcnLFxyXG5cdFx0ICBkdXJhdGlvbjogJ2xpZmUnLFxyXG5cdFx0ICBlYXNpbmc6ICdlYXNlSW5PdXRCb3VuY2UnLFxyXG5cdFx0ICBsaW5rZWRBbmltOiBmYWxzZVxyXG5cdH0sXHJcblx0e1xyXG5cdFx0ICBhbmltTmFtZTogJ2NvbG9yNERhdGFDaGFuZ2VCbHVlJyxcclxuXHRcdCAgYWN0aXZlOiB0cnVlLFxyXG5cdFx0ICBwYXJhbTogJ2NvbG9yNERhdGEuYicsXHJcblx0XHQgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmInLFxyXG5cdFx0ICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmInLFxyXG5cdFx0ICBkdXJhdGlvbjogJ2xpZmUnLFxyXG5cdFx0ICBlYXNpbmc6ICdlYXNlT3V0RXhwbycsXHJcblx0XHQgIGxpbmtlZEFuaW06IGZhbHNlXHJcblx0fSxcclxuXHR7XHJcblx0XHQgIGFuaW1OYW1lOiAnY29sb3I0RGF0YUNoYW5nZUFscGhhJyxcclxuXHRcdCAgYWN0aXZlOiB0cnVlLFxyXG5cdFx0ICBwYXJhbTogJ2NvbG9yNERhdGEuYScsXHJcblx0XHQgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmEnLFxyXG5cdFx0ICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzNdLmEnLFxyXG5cdFx0ICBkdXJhdGlvbjogJ2xpZmUnLFxyXG5cdFx0ICBlYXNpbmc6ICdlYXNlSW5RdWludCcsXHJcblx0XHQgIGxpbmtlZEFuaW06IGZhbHNlXHJcblx0fVxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMuYW5pbWF0aW9uVHJhY2tzID0gYW5pbWF0aW9uVHJhY2tzOyIsInZhciBjdXN0b21BdHRyaWJ1dGVzID0ge1xyXG4gICAgbGVuc0ZsYXJlOiB7XHJcbiAgICAgICAgbWlnaHRGbGFyZTogdHJ1ZSxcclxuICAgICAgICB3aWxsRmxhcmU6IGZhbHNlLFxyXG4gICAgICAgIGFuZ2xlOiAwLjMwXHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jdXN0b21BdHRyaWJ1dGVzID0gY3VzdG9tQXR0cmlidXRlczsiLCJ2YXIga2lsbENvbmRpdGlvbnMgPSB7XHJcbiAgICBib3VuZGFyeUNoZWNrOiB0cnVlLFxyXG4gICAgYm91bmRhcnlPZmZzZXQ6IDAsXHJcbiAgICBjb2xvckNoZWNrOiBbeyBuYW1lOiAnYScsIHZhbHVlOiAwIH1dLFxyXG4gICAgcGVyQXR0cmlidXRlOiBbeyBuYW1lOiAncmFkaXVzJywgdmFsdWU6IDAgfSwgeyBuYW1lOiAnY3VyckxpZmUnLCB2YWx1ZTogMCB9XVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMua2lsbENvbmRpdGlvbnMgPSBraWxsQ29uZGl0aW9uczsiLCIvLyB1dGlsaXRpZXNcclxudmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG52YXIgdHJpZyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzO1xyXG5cclxudmFyIHJlbmRlckZuID0gZnVuY3Rpb24gcmVuZGVyRm4oeCwgeSwgciwgY29sb3JEYXRhLCBjb250ZXh0KSB7XHJcbiAgICB2YXIgcCA9IHRoaXM7XHJcbiAgICAvLyBjb25zb2xlLmxvZyggJ3AucmVuZGVyOiAnLCBwICk7XHJcbiAgICB2YXIgbmV3QW5nbGUgPSB0cmlnLmdldEFuZ2xlQW5kRGlzdGFuY2UoeCwgeSwgeCArIHAueFZlbCwgeSArIHAueVZlbCk7XHJcbiAgICB2YXIgY29tcGlsZWRDb2xvciA9IFwicmdiYShcIiArIGNvbG9yRGF0YS5yICsgJywnICsgY29sb3JEYXRhLmcgKyAnLCcgKyBjb2xvckRhdGEuYiArIFwiLFwiICsgY29sb3JEYXRhLmEgKyBcIilcIjtcclxuICAgIHZhciBlbmRDb2xvciA9IFwicmdiYShcIiArIGNvbG9yRGF0YS5yICsgJywnICsgY29sb3JEYXRhLmcgKyAnLCcgKyBjb2xvckRhdGEuYiArIFwiLCAwKVwiO1xyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBjb21waWxlZENvbG9yO1xyXG4gICAgdmFyIHN0cmV0Y2hWYWwgPSBtYXRoVXRpbHMubWFwKHAucmVsYXRpdmVNYWduaXR1ZGUsIDAsIDEwMCwgMSwgMTApO1xyXG5cclxuICAgIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XHJcbiAgICAvLyBjb250ZXh0LnJvdGF0ZSggcC5hbmdsZSApO1xyXG4gICAgY29udGV4dC5yb3RhdGUobmV3QW5nbGUuYW5nbGUpO1xyXG4gICAgY29udGV4dC5maWxsRWxsaXBzZSgwLCAwLCByICogc3RyZXRjaFZhbCwgciwgY29udGV4dCk7XHJcbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnJlbmRlckZuID0gcmVuZGVyRm47IiwiLy8gdXRpbGl0aWVzXHJcbnZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuLy4uLy4uLy4uL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxuXHJcbi8vIHRoZW1lIHBhcnRpYWxzXHJcbnZhciBhbmltYXRpb25UcmFja3MgPSByZXF1aXJlKCcuL2FuaW1hdGlvblRyYWNrcy5qcycpLmFuaW1hdGlvblRyYWNrcztcclxudmFyIGtpbGxDb25kaXRpb25zID0gcmVxdWlyZSgnLi9raWxsQ29uZGl0aW9ucy5qcycpLmtpbGxDb25kaXRpb25zO1xyXG52YXIgY3VzdG9tQXR0cmlidXRlcyA9IHJlcXVpcmUoJy4vY3VzdG9tQXR0cmlidXRlcy5qcycpLmN1c3RvbUF0dHJpYnV0ZXM7XHJcbnZhciByZW5kZXJGbiA9IHJlcXVpcmUoJy4vcmVuZGVyRm4uanMnKS5yZW5kZXJGbjtcclxuXHJcbnZhciBmaXJlVGhlbWUgPSB7XHJcbiAgICBjb250ZXh0QmxlbmRpbmdNb2RlOiAnbGlnaHRlcicsXHJcbiAgICBhY3RpdmU6IDEsXHJcbiAgICBsaWZlOiB7IG1pbjogMjAsIG1heDogMTAwIH0sXHJcbiAgICBhbmdsZTogeyBtaW46IDAsIG1heDogMiB9LFxyXG4gICAgbWFnRGVjYXk6IDEsXHJcbiAgICAvLyB2ZWxBY2NlbGVyYXRpb246IDAuOSxcclxuICAgIHZlbEFjY2VsZXJhdGlvbjogeyBtaW46IDAuNywgbWF4OiAwLjg1IH0sXHJcbiAgICByYWRpdXM6IHsgbWluOiAwLjUsIG1heDogMjAgfSxcclxuICAgIHRhcmdldFJhZGl1czogeyBtaW46IDAsIG1heDogMCB9LFxyXG4gICAgYXBwbHlHbG9iYWxGb3JjZXM6IHRydWUsXHJcbiAgICBjb2xvclByb2ZpbGVzOiBbeyByOiAyNTUsIGc6IDI1NSwgYjogMjU1LCBhOiAxIH0sIHsgcjogMjE1LCBnOiAwLCBiOiAwLCBhOiAwIH0sIHsgcjogMCwgZzogMjE1LCBiOiAwLCBhOiAwIH0sIHsgcjogMCwgZzogMCwgYjogMjE1LCBhOiAwIH1dLFxyXG4gICAgcmVuZGVyUHJvZmlsZXM6IFt7IHNoYXBlOiAnQ2lyY2xlJywgY29sb3JQcm9maWxlSWR4OiAwIH1dLFxyXG4gICAgY3VzdG9tQXR0cmlidXRlczogY3VzdG9tQXR0cmlidXRlcyxcclxuICAgIGFuaW1hdGlvblRyYWNrczogYW5pbWF0aW9uVHJhY2tzLFxyXG4gICAga2lsbENvbmRpdGlvbnM6IGtpbGxDb25kaXRpb25zLFxyXG4gICAgcmVuZGVyUGFydGljbGU6IHJlbmRlckZuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5maXJlVGhlbWUgPSBmaXJlVGhlbWU7IiwidmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG52YXIgY29sb3JpbmcgPSByZXF1aXJlKCcuLy4uLy4uLy4uL2NvbG9yVXRpbHMuanMnKS5jb2xvclV0aWxzO1xyXG52YXIgdHJpZyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzO1xyXG5cclxudmFyIHJnYmEgPSBjb2xvcmluZy5yZ2JhO1xyXG5cclxudmFyIGZsYW1lVGhlbWUgPSB7XHJcbiAgICBjb250ZXh0QmxlbmRpbmdNb2RlOiAnbGlnaHRlcicsXHJcbiAgICBhY3RpdmU6IDEsXHJcbiAgICBsaWZlOiB7IG1pbjogMjAsIG1heDogNDAgfSxcclxuICAgIGFuZ2xlOiB7IG1pbjogMS40NSwgbWF4OiAxLjU1IH0sXHJcbiAgICAvLyBtYWc6IHsgbWluOiA4LCBtYXg6IDEzIH0sXHJcbiAgICAvLyB2ZWxBY2NlbGVyYXRpb246IDEuMDUsXHJcbiAgICB2ZWxBY2NlbGVyYXRpb246IHsgbWluOiAxLCBtYXg6IDEgfSxcclxuICAgIG1hZ0RlY2F5OiAxLjUsXHJcbiAgICByYWRpdXM6IHsgbWluOiA3MCwgbWF4OiAxMzAgfSxcclxuICAgIHRhcmdldFJhZGl1czogeyBtaW46IDEsIG1heDogMiB9LFxyXG4gICAgYXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlLFxyXG4gICAgY29sb3JQcm9maWxlczogW3sgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMC41IH0sIHsgcjogMjU1LCBnOiAwLCBiOiAwLCBhOiAxIH1dLFxyXG4gICAgcmVuZGVyUHJvZmlsZXM6IFt7IHNoYXBlRm46ICdmaWxsQ2lyY2xlJywgY29sb3JQcm9maWxlSWR4OiAwIH1dLFxyXG4gICAgY3VzdG9tQXR0cmlidXRlczoge1xyXG4gICAgICAgIGxlbnNGbGFyZToge1xyXG4gICAgICAgICAgICBtaWdodEZsYXJlOiB0cnVlLFxyXG4gICAgICAgICAgICB3aWxsRmxhcmU6IGZhbHNlLFxyXG4gICAgICAgICAgICBhbmdsZTogMC4zMFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwcm94aW1pdHk6IHtcclxuICAgICAgICBjaGVjazogZmFsc2UsXHJcbiAgICAgICAgdGhyZXNob2xkOiA1MFxyXG4gICAgfSxcclxuICAgIGFuaW1hdGlvblRyYWNrczogW3tcclxuICAgICAgICBhbmltTmFtZTogJ3JhZGl1c0ZhZGUnLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBwYXJhbTogJ3InLFxyXG4gICAgICAgIGJhc2VBbW91bnQ6ICdpbml0UicsXHJcbiAgICAgICAgdGFyZ2V0VmFsdWVQYXRoOiAndFInLFxyXG4gICAgICAgIGR1cmF0aW9uOiAnbGlmZScsXHJcbiAgICAgICAgZWFzaW5nOiAnZWFzZUluRXhwbycsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgIH0sIHtcclxuICAgICAgICBhbmltTmFtZTogJ2NvbG9yNERhdGFDaGFuZ2VHcmVlbicsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5nJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5nJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmcnLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjQsXHJcbiAgICAgICAgZWFzaW5nOiAnZWFzZUluUXVhcnQnLFxyXG4gICAgICAgIGxpbmtlZEFuaW06IGZhbHNlXHJcbiAgICB9LCB7XHJcbiAgICAgICAgYW5pbU5hbWU6ICdjb2xvcjREYXRhQ2hhbmdlQmx1ZScsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5iJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5iJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmInLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjUsXHJcbiAgICAgICAgZWFzaW5nOiAnZWFzZU91dFF1YXJ0JyxcclxuICAgICAgICBsaW5rZWRBbmltOiBmYWxzZVxyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnYWxwaGFEZWxheScsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5hJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5hJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzBdLmEnLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjUsXHJcbiAgICAgICAgZWFzaW5nOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgbGlua2VkQW5pbTogJ2FscGhhRmFkZUluJ1xyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnYWxwaGFGYWRlSW4nLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBwYXJhbTogJ2NvbG9yNERhdGEuYScsXHJcbiAgICAgICAgYmFzZUFtb3VudDogJ2NvbG9yUHJvZmlsZXNbMF0uYScsXHJcbiAgICAgICAgdGFyZ2V0VmFsdWVQYXRoOiAnY29sb3JQcm9maWxlc1sxXS5hJyxcclxuICAgICAgICBkdXJhdGlvbjogMC4yLFxyXG4gICAgICAgIGVhc2luZzogJ2Vhc2VJblF1aW50JyxcclxuICAgICAgICBsaW5rZWRBbmltOiAnYWxwaGFGYWRlT3V0J1xyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnYWxwaGFGYWRlT3V0JyxcclxuICAgICAgICBhY3RpdmU6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5hJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1sxXS5hJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzBdLmEnLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjMsXHJcbiAgICAgICAgZWFzaW5nOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2UsXHJcbiAgICAgICAgbGlua2VkRXZlbnQ6ICdlbWl0J1xyXG4gICAgfV0sXHJcblxyXG4gICAgZXZlbnRzOiBbe1xyXG4gICAgICAgIGV2ZW50VHlwZTogJ2VtaXQnLFxyXG4gICAgICAgIGV2ZW50UGFyYW1zOiB7XHJcbiAgICAgICAgICAgIGVtaXR0ZXJOYW1lOiAnc21va2VFbWl0dGVyJ1xyXG4gICAgICAgIH1cclxuICAgIH1dLFxyXG5cclxuICAgIGtpbGxDb25kaXRpb25zOiB7XHJcbiAgICAgICAgYm91bmRhcnlDaGVjazogdHJ1ZSxcclxuICAgICAgICBib3VuZGFyeU9mZnNldDogMCxcclxuICAgICAgICBjb2xvckNoZWNrOiBbXSxcclxuICAgICAgICBwZXJBdHRyaWJ1dGU6IFt7IG5hbWU6ICdyYWRpdXMnLCB2YWx1ZTogMCB9LCB7IG5hbWU6ICdjdXJyTGlmZScsIHZhbHVlOiAwIH1dLFxyXG4gICAgICAgIGxpbmtlZEV2ZW50OiBmYWxzZVxyXG4gICAgfSxcclxuICAgIHJlbmRlclBhcnRpY2xlOiBmdW5jdGlvbiByZW5kZXJQYXJ0aWNsZSh4LCB5LCByLCBjb2xvckRhdGEsIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgcCA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHN0cmV0Y2hWYWwgPSBtYXRoVXRpbHMubWFwKHAuY3VyckxpZmVJbnYsIDAsIHAubGlmZVNwYW4sIDEsIDUpO1xyXG4gICAgICAgIHZhciBvZmZzZXRNYXAgPSBtYXRoVXRpbHMubWFwKHAuY3VyckxpZmVJbnYsIDAsIHAubGlmZVNwYW4sIDAsIDEpO1xyXG4gICAgICAgIHZhciBuZXdBbmdsZSA9IHRyaWcuZ2V0QW5nbGVBbmREaXN0YW5jZSh4LCB5LCB4ICsgcC54VmVsLCB5ICsgcC55VmVsKTtcclxuICAgICAgICBpZiAoY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gIT09ICdsaWdodGVyJykge1xyXG4gICAgICAgICAgICBjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdsaWdodGVyJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XHJcbiAgICAgICAgLy8gY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgdmFyIGFscGhhID0gY29sb3JEYXRhLmE7XHJcbiAgICAgICAgaWYgKGFscGhhID4gMSkge1xyXG4gICAgICAgICAgICBhbHBoYSA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBvZmZzZXQgPSByICogb2Zmc2V0TWFwO1xyXG4gICAgICAgIC8vIC8vIHZhciBvZmZzZXQgPSAwO1xyXG4gICAgICAgIHZhciBncmQgPSBjb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KDAsIDAgKyBvZmZzZXQsIDAsIDAsIDAgKyBvZmZzZXQsIHIpO1xyXG4gICAgICAgIC8vIHZhciBncmQgPSBjb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIDAsIHgsIHksIHIpO1xyXG4gICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMCwgcmdiYShjb2xvckRhdGEuciwgY29sb3JEYXRhLmcsIGNvbG9yRGF0YS5iLCAwLjAzICogYWxwaGEpKTtcclxuICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAuNSwgcmdiYShjb2xvckRhdGEuciwgY29sb3JEYXRhLmcsIGNvbG9yRGF0YS5iLCAwLjA2ICogYWxwaGEpKTtcclxuICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAuNywgcmdiYShjb2xvckRhdGEuciwgY29sb3JEYXRhLmcsIGNvbG9yRGF0YS5iLCAwLjA2NSAqIGFscGhhKSk7XHJcbiAgICAgICAgZ3JkLmFkZENvbG9yU3RvcCgwLjg1LCByZ2JhKGNvbG9yRGF0YS5yLCBjb2xvckRhdGEuZywgY29sb3JEYXRhLmIsIDAuMDE1ICogYWxwaGEpKTtcclxuICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDEsIHJnYmEoY29sb3JEYXRhLnIsIGNvbG9yRGF0YS5nLCBjb2xvckRhdGEuYiwgMCkpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JkO1xyXG5cclxuICAgICAgICBjb250ZXh0LnJvdGF0ZShuZXdBbmdsZS5hbmdsZSk7XHJcbiAgICAgICAgY29udGV4dC5maWxsRWxsaXBzZSgwLCAwLCByICogc3RyZXRjaFZhbCwgciwgY29udGV4dCk7XHJcbiAgICAgICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5mbGFtZVRoZW1lID0gZmxhbWVUaGVtZTsiLCJ2YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcblxyXG52YXIgcmVzZXRUaGVtZSA9IHtcclxuICAgIGVtbWlzaW9uUmF0ZTogeyBtaW46IDAsIG1heDogMCB9LFxyXG4gICAgY29udGV4dEJsZW5kaW5nTW9kZTogJ3NvdXJjZS1vdmVyJyxcclxuICAgIGFjdGl2ZTogMCxcclxuICAgIGxpZmU6IHsgbWluOiAwLCBtYXg6IDAgfSxcclxuICAgIGFuZ2xlOiB7IG1pbjogMCwgbWF4OiAwIH0sXHJcbiAgICBtYWc6IHsgbWluOiAwLCBtYXg6IDAgfSxcclxuICAgIG1hZ0RlY2F5OiAwLFxyXG4gICAgLy8gdmVsQWNjZWxlcmF0aW9uOiAxLCAvLyAwIC0gMSAoaS5lLiAwLjUpID0gZGVjY2VsZXJhdGlvbiwgMSsgKGkuZS4gMS4yKSA9IGFjY2VsZXJhdGlvblxyXG4gICAgdmVsQWNjZWxlcmF0aW9uOiB7IG1pbjogMSwgbWF4OiAxIH0sXHJcbiAgICByYWRpdXM6IHsgbWluOiAwLCBtYXg6IDAgfSxcclxuICAgIHRhcmdldFJhZGl1czogeyBtaW46IDAsIG1heDogMCB9LFxyXG4gICAgc2hyaW5rUmF0ZTogMCxcclxuICAgIHJhZGlhbERpc3BsYWNlbWVudDogMCxcclxuICAgIHJhZGlhbERpc3BsYWNlbWVudE9mZnNldDogMCxcclxuICAgIGFwcGx5R2xvYmFsRm9yY2VzOiBmYWxzZSxcclxuICAgIGNvbG9yUHJvZmlsZXM6IFt7IHI6IDAsIGc6IDAsIGI6IDAsIGE6IDAgfV0sXHJcbiAgICByZW5kZXJQcm9maWxlczogW3sgc2hhcGU6ICdDaXJjbGUnLCBjb2xvclByb2ZpbGVJZHg6IDAgfV0sXHJcbiAgICBjb2xvclN0YXJ0OiB7XHJcbiAgICAgICAgcjogMCxcclxuICAgICAgICBnOiAwLFxyXG4gICAgICAgIGI6IDAsXHJcbiAgICAgICAgYTogMFxyXG4gICAgfSxcclxuICAgIGNvbG9yRW5kOiB7XHJcbiAgICAgICAgcjogMCxcclxuICAgICAgICBnOiAwLFxyXG4gICAgICAgIGI6IDAsXHJcbiAgICAgICAgYTogMFxyXG4gICAgfSxcclxuICAgIGN1c3RvbUF0dHJpYnV0ZXM6IHtcclxuICAgICAgICBsZW5zRmxhcmU6IHtcclxuICAgICAgICAgICAgbWlnaHRGbGFyZTogdHJ1ZSxcclxuICAgICAgICAgICAgd2lsbEZsYXJlOiBmYWxzZSxcclxuICAgICAgICAgICAgYW5nbGU6IDAuMzBcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgY29sb3JBbmltYXRpb25Db25maWc6IHtcclxuICAgICAgICBlYXNpbmc6IHtcclxuICAgICAgICAgICAgcjogJ2xpbmVhckVhc2UnLFxyXG4gICAgICAgICAgICBnOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgICAgIGI6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICAgICAgYTogJ2xpbmVhckVhc2UnXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFuaW1hdGlvblRyYWNrczogW10sXHJcbiAgICBraWxsQ29uZGl0aW9uczoge1xyXG4gICAgICAgIGJvdW5kYXJ5Q2hlY2s6IGZhbHNlLFxyXG4gICAgICAgIGNvbG9yQ2hlY2s6IFtdLFxyXG4gICAgICAgIHBlckF0dHJpYnV0ZTogW11cclxuICAgIH0sXHJcbiAgICByZW5kZXJQYXJ0aWNsZTogZmFsc2VcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnJlc2V0VGhlbWUgPSByZXNldFRoZW1lOyIsInZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuLy4uLy4uLy4uL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxudmFyIGNvbG9yaW5nID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9jb2xvclV0aWxzLmpzJykuY29sb3JVdGlscztcclxudmFyIHJnYmEgPSBjb2xvcmluZy5yZ2JhO1xyXG5cclxudmFyIHNtb2tlVGhlbWUgPSB7XHJcbiAgICBjb250ZXh0QmxlbmRpbmdNb2RlOiAnc291cmNlLW92ZXInLFxyXG4gICAgYWN0aXZlOiAxLFxyXG4gICAgbGlmZTogeyBtaW46IDQwMCwgbWF4OiA1MDAgfSxcclxuICAgIGFuZ2xlOiB7IG1pbjogMS40NSwgbWF4OiAxLjU1IH0sXHJcbiAgICAvLyB2ZWxBY2NlbGVyYXRpb246IDEuMDUsXHJcbiAgICB2ZWxBY2NlbGVyYXRpb246IHsgbWluOiAwLjk5OSwgbWF4OiAwLjk5OTkgfSxcclxuICAgIC8vIG1hZ0RlY2F5OiAxLjUsXHJcbiAgICByYWRpdXM6IHsgbWluOiAzMCwgbWF4OiA1MCB9LFxyXG4gICAgdGFyZ2V0UmFkaXVzOiB7IG1pbjogNzAsIG1heDogMTMwIH0sXHJcbiAgICBhcHBseUdsb2JhbEZvcmNlczogZmFsc2UsXHJcbiAgICBjb2xvclByb2ZpbGVzOiBbeyByOiAxMDAsIGc6IDEwMCwgYjogMTAwLCBhOiAwIH0sIHsgcjogMCwgZzogMCwgYjogMCwgYTogMC4wNSB9LCB7IHI6IDEwMCwgZzogMTAwLCBiOiAxMDAsIGE6IDAgfV0sXHJcbiAgICByZW5kZXJQcm9maWxlczogW3sgc2hhcGVGbjogJ2ZpbGxDaXJjbGUnLCBjb2xvclByb2ZpbGVJZHg6IDAgfV0sXHJcbiAgICBjdXN0b21BdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgbGVuc0ZsYXJlOiB7XHJcbiAgICAgICAgICAgIG1pZ2h0RmxhcmU6IHRydWUsXHJcbiAgICAgICAgICAgIHdpbGxGbGFyZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGFuZ2xlOiAwLjMwXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHByb3hpbWl0eToge1xyXG4gICAgICAgIGNoZWNrOiBmYWxzZSxcclxuICAgICAgICB0aHJlc2hvbGQ6IDUwXHJcbiAgICB9LFxyXG4gICAgYW5pbWF0aW9uVHJhY2tzOiBbe1xyXG4gICAgICAgIGFuaW1OYW1lOiAncmFkaXVzR3JvdycsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAncicsXHJcbiAgICAgICAgYmFzZUFtb3VudDogJ2luaXRSJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICd0UicsXHJcbiAgICAgICAgZHVyYXRpb246ICdsaWZlJyxcclxuICAgICAgICBlYXNpbmc6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICBsaW5rZWRBbmltOiBmYWxzZVxyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnYWxwaGFGYWRlSW4nLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBwYXJhbTogJ2NvbG9yNERhdGEuYScsXHJcbiAgICAgICAgYmFzZUFtb3VudDogJ2NvbG9yUHJvZmlsZXNbMF0uYScsXHJcbiAgICAgICAgdGFyZ2V0VmFsdWVQYXRoOiAnY29sb3JQcm9maWxlc1sxXS5hJyxcclxuICAgICAgICBkdXJhdGlvbjogMC4xLFxyXG4gICAgICAgIGVhc2luZzogJ2Vhc2VPdXRRdWludCcsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgIH0sIHtcclxuICAgICAgICBhbmltTmFtZTogJ3JlZCcsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5yJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5yJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLnInLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjIsXHJcbiAgICAgICAgZWFzaW5nOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgIH0sIHtcclxuICAgICAgICBhbmltTmFtZTogJ2dyZWVuJyxcclxuICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgcGFyYW06ICdjb2xvcjREYXRhLmcnLFxyXG4gICAgICAgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmcnLFxyXG4gICAgICAgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbMV0uZycsXHJcbiAgICAgICAgZHVyYXRpb246IDAuMixcclxuICAgICAgICBlYXNpbmc6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICBsaW5rZWRBbmltOiBmYWxzZVxyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnYmx1ZScsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5iJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5iJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmInLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjIsXHJcbiAgICAgICAgZWFzaW5nOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgIH1dLFxyXG4gICAga2lsbENvbmRpdGlvbnM6IHtcclxuICAgICAgICBib3VuZGFyeUNoZWNrOiB0cnVlLFxyXG4gICAgICAgIGJvdW5kYXJ5T2Zmc2V0OiAyMDAsXHJcbiAgICAgICAgY29sb3JDaGVjazogW10sXHJcbiAgICAgICAgcGVyQXR0cmlidXRlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIHJlbmRlclBhcnRpY2xlOiBmdW5jdGlvbiByZW5kZXJQYXJ0aWNsZSh4LCB5LCByLCBjb2xvckRhdGEsIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgcCA9IHRoaXM7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICdyZW5kZXJpbmcgc21va2UnICk7XHJcblxyXG4gICAgICAgIGlmIChjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiAhPT0gJ3NvdXJjZS1vdmVyJykge1xyXG4gICAgICAgICAgICBjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdzb3VyY2Utb3Zlcic7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZ3JkID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCAwLCB4LCB5LCByKTtcclxuICAgICAgICAvLyB2YXIgZ3JkID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCAwLCB4LCB5LCByKTtcclxuICAgICAgICAvLyBncmQuYWRkQ29sb3JTdG9wKDAsIHJnYmEoIGNvbG9yRGF0YS5yLCAgY29sb3JEYXRhLmcsIGNvbG9yRGF0YS5iLCAwLjA1KSApO1xyXG4gICAgICAgIC8vIGdyZC5hZGRDb2xvclN0b3AoMSwgcmdiYSggY29sb3JEYXRhLnIsIGNvbG9yRGF0YS5nLCBjb2xvckRhdGEuYiwgMCkgKTtcclxuICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAsIHJnYmEoY29sb3JEYXRhLnIsIGNvbG9yRGF0YS5nLCBjb2xvckRhdGEuYiwgY29sb3JEYXRhLmEpKTtcclxuICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDEsIHJnYmEoY29sb3JEYXRhLnIsIGNvbG9yRGF0YS5nLCBjb2xvckRhdGEuYiwgMCkpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JkO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbENpcmNsZSh4LCB5LCByLCBjb250ZXh0KTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnNtb2tlVGhlbWUgPSBzbW9rZVRoZW1lOyIsInZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuLy4uLy4uLy4uL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxudmFyIGNvbG9yaW5nID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9jb2xvclV0aWxzLmpzJykuY29sb3JVdGlscztcclxudmFyIHJnYmEgPSBjb2xvcmluZy5yZ2JhO1xyXG5sZXQgY3JlYXRlV2FycFN0YXJJbWFnZSA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vY3JlYXRlV2FycFN0YXJJbWFnZS5qcycpO1xyXG5cclxubGV0IHdhcnBTdGFySW1hZ2UgPSBjcmVhdGVXYXJwU3RhckltYWdlKCk7XHJcblxyXG52YXIgd2FycFN0YXJUaGVtZSA9IHtcclxuICAgIGNvbnRleHRCbGVuZGluZ01vZGU6ICdsaWdodGVyJyxcclxuICAgIGFjdGl2ZTogMSxcclxuICAgIGxpZmU6IHsgbWluOiA1MCwgbWF4OiAxMDAgfSxcclxuICAgIGFuZ2xlOiB7IG1pbjogMCwgbWF4OiAyIH0sXHJcbiAgICAvLyB2ZWxBY2NlbGVyYXRpb246IDEuMDUsXHJcbiAgICB2ZWxBY2NlbGVyYXRpb246IHsgbWluOiAxLjAxLCBtYXg6IDEuMiB9LFxyXG4gICAgbWFnRGVjYXk6IDEsXHJcbiAgICByYWRpdXM6IHsgbWluOiAwLjUsIG1heDogMyB9LFxyXG4gICAgdGFyZ2V0UmFkaXVzOiB7IG1pbjogNCwgbWF4OiAxMCB9LFxyXG4gICAgYXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlLFxyXG4gICAgY29sb3JQcm9maWxlczogW3sgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMCB9LCB7IHI6IDI1NSwgZzogMjU1LCBiOiAyNTUsIGE6IDEgfV0sXHJcbiAgICByZW5kZXJQcm9maWxlczogW3sgc2hhcGU6ICdDaXJjbGUnLCBjb2xvclByb2ZpbGVJZHg6IDAgfSwgeyBzaGFwZTogJ0NpcmNsZScsIGNvbG9yUHJvZmlsZUlkeDogMSB9LCB7IHNoYXBlOiAnQ2lyY2xlJywgY29sb3JQcm9maWxlSWR4OiAyIH1dLFxyXG4gICAgY3VzdG9tQXR0cmlidXRlczoge1xyXG4gICAgICAgIGxlbnNGbGFyZToge1xyXG4gICAgICAgICAgICBtaWdodEZsYXJlOiB0cnVlLFxyXG4gICAgICAgICAgICB3aWxsRmxhcmU6IGZhbHNlLFxyXG4gICAgICAgICAgICBhbmdsZTogMS41MFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBhbmltYXRpb25UcmFja3M6IFt7XHJcbiAgICAgICAgYW5pbU5hbWU6ICdyYWRpdXNHcm93JyxcclxuICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgcGFyYW06ICdyJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnaW5pdFInLFxyXG4gICAgICAgIHRhcmdldFZhbHVlUGF0aDogJ3RSJyxcclxuICAgICAgICBkdXJhdGlvbjogJ2xpZmUnLFxyXG4gICAgICAgIGVhc2luZzogJ2xpbmVhckVhc2UnLFxyXG4gICAgICAgIGxpbmtlZEFuaW06IGZhbHNlXHJcbiAgICB9LCB7XHJcbiAgICAgICAgYW5pbU5hbWU6ICdmYWRlSW4nLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBwYXJhbTogJ2NvbG9yNERhdGEuYScsXHJcbiAgICAgICAgYmFzZUFtb3VudDogJ2NvbG9yUHJvZmlsZXNbMF0uYScsXHJcbiAgICAgICAgdGFyZ2V0VmFsdWVQYXRoOiAnY29sb3JQcm9maWxlc1sxXS5hJyxcclxuICAgICAgICBkdXJhdGlvbjogJ2xpZmUnLFxyXG4gICAgICAgIGVhc2luZzogJ2xpbmVhckVhc2UnLFxyXG4gICAgICAgIGxpbmtlZEFuaW06IGZhbHNlXHJcbiAgICB9XSxcclxuICAgIGtpbGxDb25kaXRpb25zOiB7XHJcbiAgICAgICAgYm91bmRhcnlDaGVjazogdHJ1ZSxcclxuICAgICAgICBib3VuZGFyeU9mZnNldDogNDAwLFxyXG4gICAgICAgIGNvbG9yQ2hlY2s6IFtdLFxyXG4gICAgICAgIHBlckF0dHJpYnV0ZTogW11cclxuICAgIH0sXHJcblxyXG4gICAgcmVuZGVyUGFydGljbGU6IGZ1bmN0aW9uIHJlbmRlclBhcnRpY2xlKHgsIHksIHIsIGNvbG9yRGF0YSwgY29udGV4dCkge1xyXG4gICAgICAgIHZhciBwID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYW5nbGUob3JpZ2luWCwgb3JpZ2luWSwgdGFyZ2V0WCwgdGFyZ2V0WSkge1xyXG4gICAgICAgICAgICB2YXIgZHggPSBvcmlnaW5YIC0gdGFyZ2V0WDtcclxuICAgICAgICAgICAgdmFyIGR5ID0gb3JpZ2luWSAtIHRhcmdldFk7XHJcbiAgICAgICAgICAgIHZhciB0aGV0YSA9IE1hdGguYXRhbjIoLWR5LCAtZHgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhldGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc3RyZXRjaFZhbCA9IG1hdGhVdGlscy5tYXAocC5yZWxhdGl2ZU1hZ25pdHVkZSwgMCwgMTAwLCAxLCA0MCk7XHJcbiAgICAgICAgdmFyIGNocm9tZVZhbCA9IG1hdGhVdGlscy5tYXAoc3RyZXRjaFZhbCwgMCwgMTAsIDEsIDQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKHgsIHkpO1xyXG4gICAgICAgIGNvbnRleHQucm90YXRlKHAuYW5nbGUpO1xyXG5cclxuICAgICAgICBsZXQgcmVuZGVyUHJvcHMgPSB3YXJwU3RhckltYWdlLnJlbmRlclByb3BzO1xyXG5cclxuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgd2FycFN0YXJJbWFnZSxcclxuICAgICAgICAgICAgMCwgMCwgcmVuZGVyUHJvcHMuc3JjLncsIHJlbmRlclByb3BzLnNyYy5oLFxyXG4gICAgICAgICAgICAtKCAoIHIgKiBzdHJldGNoVmFsICkgLyAyICksIC0oIHIgLyAyICksIHIgKiBzdHJldGNoVmFsLCByXHJcbiAgICAgICAgKTtcclxuXHJcblxyXG4gICAgICAgIC8vIGlmIChjaHJvbWVWYWwgPCAxKSB7XHJcbiAgICAgICAgLy8gICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCAxIClcIjtcclxuICAgICAgICAvLyAgICAgY29udGV4dC5maWxsRWxsaXBzZSgwLCAwLCByICogc3RyZXRjaFZhbCwgciwgY29udGV4dCk7XHJcbiAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAvLyAgICAgLy8gZmFrZSBjaHJvbWF0aWMgYWJiZXJhdGlvbiAoIHJhaW5ib3dpbmcgbGVucyBlZmZlY3QgZHVlIHRvIGxpZ2h0IHJlZnJhY3Rpb25cclxuICAgICAgICAvLyAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoIDI1NSwgMCwgMCwgXCIgKyBjb2xvckRhdGEuYSArIFwiIClcIjtcclxuICAgICAgICAvLyAgICAgY29udGV4dC5maWxsRWxsaXBzZShjaHJvbWVWYWwgKiAtMSwgMCwgciAqIHN0cmV0Y2hWYWwsIHIsIGNvbnRleHQpO1xyXG4gICAgICAgIC8vICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiYSggMCwgMjU1LCAwLCBcIiArIGNvbG9yRGF0YS5hICsgXCIgKVwiO1xyXG4gICAgICAgIC8vICAgICBjb250ZXh0LmZpbGxFbGxpcHNlKDAsIDAsIHIgKiBzdHJldGNoVmFsLCByLCBjb250ZXh0KTtcclxuICAgICAgICAvLyAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoIDAsIDAsIDI1NSwgXCIgKyBjb2xvckRhdGEuYSArIFwiIClcIjtcclxuICAgICAgICAvLyAgICAgY29udGV4dC5maWxsRWxsaXBzZSgwLCBjaHJvbWVWYWwsIHIgKiBzdHJldGNoVmFsLCByLCBjb250ZXh0KTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIGNvbnRleHQucm90YXRlKCAtcC5hbmdsZSApO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKCAteCwgLXkgKTtcclxuXHJcbiAgICAgICAgLy8gY29udGV4dC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIGlmIChwLmN1c3RvbUF0dHJpYnV0ZXMubGVuc0ZsYXJlLndpbGxGbGFyZSkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGZsYXJlQW5nbGUgPSBhbmdsZSg5NjAsIDQ2OSwgeCwgeSk7XHJcbiAgICAgICAgICAgIHZhciBpbnZlcnRlZEZsYXJlQW5nbGUgPSBhbmdsZSh4LCB5LCA5NjAsIDQ2OSk7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LnNhdmUoKTtcclxuICAgICAgICAgICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XHJcblxyXG4gICAgICAgICAgICAvLyBsaWdodCBnbGFyZSBob3Jpem9udGFsXHJcbiAgICAgICAgICAgIHZhciBvcGFjaXR5MSA9IHAuY29sb3I0RGF0YS5hICogMC4xNTtcclxuICAgICAgICAgICAgdmFyIHNoaW5lUmFuZCA9IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKDUsIDEwKTtcclxuICAgICAgICAgICAgdmFyIHNoaW5lR3JkID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCgwLCAwLCAwLCAwLCAwLCA4MDApO1xyXG4gICAgICAgICAgICBzaGluZUdyZC5hZGRDb2xvclN0b3AoMCwgXCJyZ2JhKCAyNTUsMjU1LCAyNTUsIFwiICsgb3BhY2l0eTEgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBzaGluZUdyZC5hZGRDb2xvclN0b3AoMSwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCAwIClcIik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc2NhbGUoc2hpbmVSYW5kICogb3BhY2l0eTEsIDAuMDA1KTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBzaGluZUdyZDtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbENpcmNsZSgwLCAwLCA4MDAsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnNjYWxlKDAuMDA1LCBzaGluZVJhbmQpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxDaXJjbGUoMCwgMCwgODAwLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQucm90YXRlKDEuNSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbENpcmNsZSgwLCAwLCA4MDAsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQucm90YXRlKC0xLjUpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxDaXJjbGUoMCwgMCwgODAwLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgY29udGV4dC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGJpZyBmbGFyZVxyXG4gICAgICAgICAgICB2YXIgb3BhY2l0eTIgPSBwLmNvbG9yNERhdGEuYSAqIDAuMDU7XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3JkID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCAwLCB4LCB5LCAxMDApO1xyXG4gICAgICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAuNzUsIFwicmdiYSggMjU1LCAwLCAwLCAwIClcIik7XHJcbiAgICAgICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMC44LCBcInJnYmEoIDI1NSwgMCwgMCwgXCIgKyBvcGFjaXR5MiArIFwiIClcIik7XHJcbiAgICAgICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMC44NSwgXCJyZ2JhKCAwLCAyNTUsIDAsIFwiICsgb3BhY2l0eTIgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAuOSwgXCJyZ2JhKCAwLCAwLCAyNTUsIFwiICsgb3BhY2l0eTIgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDEsIFwicmdiYSggMCwgMCwgMjU1LCAwIClcIik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JkO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxDaXJjbGUoeCwgeSwgMTAwLCBjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciByYWREaXN0MSA9IDIwMCAvIHN0cmV0Y2hWYWw7XHJcbiAgICAgICAgICAgIHZhciB4MiA9IHJhZERpc3QxICogTWF0aC5jb3MoZmxhcmVBbmdsZSkgKyB4O1xyXG4gICAgICAgICAgICB2YXIgeTIgPSByYWREaXN0MSAqIE1hdGguc2luKGZsYXJlQW5nbGUpICsgeTtcclxuICAgICAgICAgICAgdmFyIHgyYSA9IHJhZERpc3QxICogTWF0aC5jb3MoaW52ZXJ0ZWRGbGFyZUFuZ2xlKSArIHg7XHJcbiAgICAgICAgICAgIHZhciB5MmEgPSByYWREaXN0MSAqIE1hdGguc2luKGludmVydGVkRmxhcmVBbmdsZSkgKyB5O1xyXG5cclxuICAgICAgICAgICAgdmFyIG9wYWNpdHkzID0gcC5jb2xvcjREYXRhLmEgKiAwLjAyNTtcclxuICAgICAgICAgICAgLy8gbGl0dGxlIGZsYXJlIDFcclxuICAgICAgICAgICAgdmFyIGdyZDIgPSBjb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgyLCB5MiwgMCwgeDIsIHkyLCA1MCk7XHJcbiAgICAgICAgICAgIC8vIGdyZDIuYWRkQ29sb3JTdG9wKDAuNzUsIFwicmdiYSggMjU1LCAwLCAwLCAwIClcIiApO1xyXG4gICAgICAgICAgICAvLyBncmQyLmFkZENvbG9yU3RvcCgwLjgsIFwicmdiYSggMjU1LCAwLCAwLCBcIitvcGFjaXR5MitcIiApXCIgKTtcclxuICAgICAgICAgICAgLy8gZ3JkMi5hZGRDb2xvclN0b3AoMC44NSwgXCJyZ2JhKCAwLCAyNTUsIDAsIFwiK29wYWNpdHkyK1wiIClcIiApO1xyXG4gICAgICAgICAgICAvLyBncmQyLmFkZENvbG9yU3RvcCgwLjksIFwicmdiYSggMCwgMCwgMjU1LCBcIitvcGFjaXR5MitcIiApXCIgKTtcclxuICAgICAgICAgICAgLy8gZ3JkMi5hZGRDb2xvclN0b3AoMSwgXCJyZ2JhKCAwLCAwLCAyNTUsIDAgKVwiICk7XHJcblxyXG4gICAgICAgICAgICBncmQyLmFkZENvbG9yU3RvcCgwLCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIFwiICsgb3BhY2l0eTMgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQyLmFkZENvbG9yU3RvcCgwLjgsIFwicmdiYSggMjU1LCAyNTUsIDI1NSwgXCIgKyBvcGFjaXR5MyArIFwiIClcIik7XHJcbiAgICAgICAgICAgIGdyZDIuYWRkQ29sb3JTdG9wKDEsIFwicmdiYSggMjU1LCAyNTUsIDI1NSwgMCApXCIpO1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBncmQyO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxDaXJjbGUoeDIsIHkyLCA1MCwgY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICAvLyBsaXR0bGUgZmxhcmUgMlxyXG4gICAgICAgICAgICB2YXIgZ3JkMmEgPSBjb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgyYSwgeTJhLCAwLCB4MmEsIHkyYSwgNTApO1xyXG4gICAgICAgICAgICAvLyBncmQyYS5hZGRDb2xvclN0b3AoMC43NSwgXCJyZ2JhKCAyNTUsIDAsIDAsIDAgKVwiICk7XHJcbiAgICAgICAgICAgIC8vIGdyZDJhLmFkZENvbG9yU3RvcCgwLjgsIFwicmdiYSggMjU1LCAwLCAwLCBcIitvcGFjaXR5MytcIiApXCIgKTtcclxuICAgICAgICAgICAgLy8gZ3JkMmEuYWRkQ29sb3JTdG9wKDAuODUsIFwicmdiYSggMCwgMjU1LCAwLCBcIitvcGFjaXR5MytcIiApXCIgKTtcclxuICAgICAgICAgICAgLy8gZ3JkMmEuYWRkQ29sb3JTdG9wKDAuOSwgXCJyZ2JhKCAwLCAwLCAyNTUsIFwiK29wYWNpdHkzK1wiIClcIiApO1xyXG4gICAgICAgICAgICAvLyBncmQyYS5hZGRDb2xvclN0b3AoMSwgXCJyZ2JhKCAwLCAwLCAyNTUsIDAgKVwiICk7XHJcbiAgICAgICAgICAgIGdyZDJhLmFkZENvbG9yU3RvcCgwLCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIFwiICsgb3BhY2l0eTMgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQyYS5hZGRDb2xvclN0b3AoMC44LCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIFwiICsgb3BhY2l0eTMgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQyYS5hZGRDb2xvclN0b3AoMSwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCAwIClcIik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JkMmE7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbENpcmNsZSh4MmEsIHkyYSwgNTAsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJhZERpc3QyID0gMzAwIC8gc3RyZXRjaFZhbCAqIDEuNTtcclxuICAgICAgICAgICAgdmFyIHgzID0gcmFkRGlzdDIgKiBNYXRoLmNvcyhmbGFyZUFuZ2xlKSArIHg7XHJcbiAgICAgICAgICAgIHZhciB5MyA9IHJhZERpc3QyICogTWF0aC5zaW4oZmxhcmVBbmdsZSkgKyB5O1xyXG4gICAgICAgICAgICB2YXIgeDNhID0gcmFkRGlzdDIgKiBNYXRoLmNvcyhpbnZlcnRlZEZsYXJlQW5nbGUpICsgeDtcclxuICAgICAgICAgICAgdmFyIHkzYSA9IHJhZERpc3QyICogTWF0aC5zaW4oaW52ZXJ0ZWRGbGFyZUFuZ2xlKSArIHk7XHJcblxyXG4gICAgICAgICAgICAvLyBsaXR0bGUgZmxhcmUgM1xyXG4gICAgICAgICAgICB2YXIgZ3JkMyA9IGNvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoeDMsIHkzLCAwLCB4MywgeTMsIDI1KTtcclxuICAgICAgICAgICAgLy8gZ3JkMy5hZGRDb2xvclN0b3AoMC43NSwgXCJyZ2JhKCAyNTUsIDAsIDAsIDAgKVwiICk7XHJcbiAgICAgICAgICAgIC8vIGdyZDMuYWRkQ29sb3JTdG9wKDAuOCwgXCJyZ2JhKCAyNTUsIDAsIDAsIFwiK29wYWNpdHkzK1wiIClcIiApO1xyXG4gICAgICAgICAgICAvLyBncmQzLmFkZENvbG9yU3RvcCgwLjg1LCBcInJnYmEoIDAsIDI1NSwgMCwgXCIrb3BhY2l0eTMrXCIgKVwiICk7XHJcbiAgICAgICAgICAgIC8vIGdyZDMuYWRkQ29sb3JTdG9wKDAuOSwgXCJyZ2JhKCAwLCAwLCAyNTUsIFwiK29wYWNpdHkzK1wiIClcIiApO1xyXG4gICAgICAgICAgICAvLyBncmQzLmFkZENvbG9yU3RvcCgxLCBcInJnYmEoIDAsIDAsIDI1NSwgMCApXCIgKTtcclxuICAgICAgICAgICAgZ3JkMy5hZGRDb2xvclN0b3AoMCwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCBcIiArIG9wYWNpdHkzICsgXCIgKVwiKTtcclxuICAgICAgICAgICAgZ3JkMy5hZGRDb2xvclN0b3AoMC44LCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIFwiICsgb3BhY2l0eTMgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQzLmFkZENvbG9yU3RvcCgxLCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIDAgKVwiKTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBncmQzO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxDaXJjbGUoeDMsIHkzLCAyNSwgY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICAvLyBsaXR0bGUgZmxhcmUgNFxyXG4gICAgICAgICAgICB2YXIgZ3JkM2EgPSBjb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgzYSwgeTNhLCAwLCB4M2EsIHkzYSwgMjUpO1xyXG4gICAgICAgICAgICAvLyBncmQzYS5hZGRDb2xvclN0b3AoMC43NSwgXCJyZ2JhKCAyNTUsIDAsIDAsIDAgKVwiICk7XHJcbiAgICAgICAgICAgIC8vIGdyZDNhLmFkZENvbG9yU3RvcCgwLjgsIFwicmdiYSggMjU1LCAwLCAwLCBcIitvcGFjaXR5MytcIiApXCIgKTtcclxuICAgICAgICAgICAgLy8gZ3JkM2EuYWRkQ29sb3JTdG9wKDAuODUsIFwicmdiYSggMCwgMjU1LCAwLCBcIitvcGFjaXR5MytcIiApXCIgKTtcclxuICAgICAgICAgICAgLy8gZ3JkM2EuYWRkQ29sb3JTdG9wKDAuOSwgXCJyZ2JhKCAwLCAwLCAyNTUsIFwiK29wYWNpdHkzK1wiIClcIiApO1xyXG4gICAgICAgICAgICAvLyBncmQzYS5hZGRDb2xvclN0b3AoMSwgXCJyZ2JhKCAwLCAwLCAyNTUsIDAgKVwiICk7XHJcbiAgICAgICAgICAgIGdyZDNhLmFkZENvbG9yU3RvcCgwLCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIFwiICsgb3BhY2l0eTMgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQzYS5hZGRDb2xvclN0b3AoMC44LCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIFwiICsgb3BhY2l0eTMgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQzYS5hZGRDb2xvclN0b3AoMSwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCAwIClcIik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JkM2E7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbENpcmNsZSh4M2EsIHkzYSwgMjUsIGNvbnRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLndhcnBTdGFyVGhlbWUgPSB3YXJwU3RhclRoZW1lOyIsIi8vIGRlcGVuZGVuY2llc1xyXG5cclxuLy8gTlBNXHJcbnZhciBMaW5rZWRMaXN0ID0gcmVxdWlyZSgnZGJseS1saW5rZWQtbGlzdCcpO1xyXG52YXIgb2JqZWN0UGF0aCA9IHJlcXVpcmUoXCJvYmplY3QtcGF0aFwiKTtcclxuXHJcbi8vIEN1c3RvbSBSZXF1aXJlc1xyXG52YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcbnZhciB0cmlnID0gcmVxdWlyZSgnLi90cmlnb25vbWljVXRpbHMuanMnKS50cmlnb25vbWljVXRpbHM7XHJcbnZhciBkcmF3aW5nID0gcmVxdWlyZSgnLi9jYW52YXNBcGlBdWdtZW50YXRpb24uanMnKS5jYW52YXNEcmF3aW5nQXBpO1xyXG52YXIgY29sb3JpbmcgPSByZXF1aXJlKCcuL2NvbG9yVXRpbHMuanMnKS5jb2xvclV0aWxzO1xyXG52YXIgZWFzaW5nID0gcmVxdWlyZSgnLi9lYXNpbmcuanMnKS5lYXNpbmdFcXVhdGlvbnM7XHJcbnZhciBhbmltYXRpb24gPSByZXF1aXJlKCcuL2FuaW1hdGlvbi5qcycpLmFuaW1hdGlvbjtcclxudmFyIGRlYnVnQ29uZmlnID0gcmVxdWlyZSgnLi9kZWJ1Z1V0aWxzLmpzJyk7XHJcbnZhciBkZWJ1ZyA9IGRlYnVnQ29uZmlnLmRlYnVnO1xyXG52YXIgbGFzdENhbGxlZFRpbWUgPSBkZWJ1Z0NvbmZpZy5sYXN0Q2FsbGVkVGltZTtcclxudmFyIGVudmlyb25tZW50ID0gcmVxdWlyZSgnLi9lbnZpcm9ubWVudC5qcycpLmVudmlyb25tZW50O1xyXG52YXIgcGh5c2ljcyA9IGVudmlyb25tZW50LmZvcmNlcztcclxudmFyIHJ1bnRpbWVFbmdpbmUgPSBlbnZpcm9ubWVudC5ydW50aW1lRW5naW5lO1xyXG52YXIgdGhlbWVzID0gcmVxdWlyZSgnLi9wYXJ0aWNsZVRoZW1lcy90aGVtZXMuanMnKS50aGVtZXM7XHJcblxyXG52YXIgc2luZ2xlQnVyc3RUaGVtZSA9IHJlcXVpcmUoJy4vZW1pdHRlclRoZW1lcy9zaW5nbGVCdXJzdFRoZW1lL3NpbmdsZUJ1cnN0VGhlbWUuanMnKS5zaW5nbGVCdXJzdFRoZW1lO1xyXG52YXIgYmFzZUVtaXR0ZXJUaGVtZSA9IHJlcXVpcmUoJy4vZW1pdHRlclRoZW1lcy9iYXNlRW1pdHRlci9iYXNlRW1pdHRlclRoZW1lLmpzJykuYmFzZUVtaXR0ZXJUaGVtZTtcclxudmFyIHdhcnBTdHJlYW1UaGVtZSA9IHJlcXVpcmUoJy4vZW1pdHRlclRoZW1lcy93YXJwU3RyZWFtL3dhcnBTdHJlYW1UaGVtZS5qcycpLndhcnBTdHJlYW1UaGVtZTtcclxudmFyIGZsYW1lU3RyZWFtVGhlbWUgPSByZXF1aXJlKCcuL2VtaXR0ZXJUaGVtZXMvZmxhbWVTdHJlYW0vZmxhbWVTdHJlYW1UaGVtZS5qcycpLmZsYW1lU3RyZWFtVGhlbWU7XHJcbnZhciBzbW9rZVN0cmVhbVRoZW1lID0gcmVxdWlyZSgnLi9lbWl0dGVyVGhlbWVzL3Ntb2tlU3RyZWFtL3Ntb2tlU3RyZWFtVGhlbWUuanMnKS5zbW9rZVN0cmVhbVRoZW1lO1xyXG5cclxudmFyIEVtaXR0ZXJFbnRpdHkgPSByZXF1aXJlKCcuL0VtaXR0ZXJFbnRpdHkuanMnKS5FbWl0dGVyRW50aXR5O1xyXG52YXIgRW1pdHRlclN0b3JlRm4gPSByZXF1aXJlKCcuL2VtaXR0ZXJTdG9yZS5qcycpLkVtaXR0ZXJTdG9yZUZuO1xyXG52YXIgcGFydGljbGVGbiA9IHJlcXVpcmUoJy4vcGFydGljbGVGbi5qcycpLnBhcnRpY2xlRm47XHJcbnZhciBwYXJ0aWNsZUFyckZuID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUFyckZuLmpzJykucGFydGljbGVBcnJGbjtcclxuXHJcbi8vIGRvdWJsZSBidWZmZXIgY2FudmFzIChleHBlcmltZW50KVxyXG4vLyBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbi8vIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4vLyBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuLy8gY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcbi8vIGxldCBibGl0Q2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0ZXN0LWJhc2VcIik7XHJcbi8vIGxldCBibGl0Q3R4ID0gYmxpdENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG4vLyBibGl0Q2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbi8vIGJsaXRDYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuLy8gc3RhbmRhcmQgY2FudmFzIHJlbmRlcmluZ1xyXG4vLyBjYW52YXMgaG91c2VrZWVwaW5nXHJcbnZhciBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Rlc3QtYmFzZVwiKTtcclxuLy8gbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIiwgeyBhbHBoYTogZmFsc2UgfSk7XHJcbnZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4vLyBjYWNoZSBjYW52YXMgdy9oXHJcbnZhciBjYW5XID0gd2luZG93LmlubmVyV2lkdGg7XHJcbnZhciBjYW5IID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG4vLyBzZXQgY2FudmFzIHRvIGZ1bGwtc2NyZWVuXHJcbmNhbnZhcy53aWR0aCA9IGNhblc7XHJcbmNhbnZhcy5oZWlnaHQgPSBjYW5IO1xyXG52YXIgY2FudmFzQ2VudHJlSCA9IGNhblcgLyAyO1xyXG52YXIgY2FudmFzQ2VudHJlViA9IGNhbkggLyAyO1xyXG5cclxudmFyIGNhbnZhc0NvbmZpZyA9IHtcclxuICAgIHdpZHRoOiBjYW5XLFxyXG4gICAgaGVpZ2h0OiBjYW5ILFxyXG4gICAgY2VudGVySDogY2FudmFzQ2VudHJlSCxcclxuICAgIGNlbnRlclY6IGNhbnZhc0NlbnRyZVYsXHJcblxyXG4gICAgYnVmZmVyQ2xlYXJSZWdpb246IHtcclxuICAgICAgICB4OiBjYW52YXNDZW50cmVILFxyXG4gICAgICAgIHk6IGNhbnZhc0NlbnRyZVYsXHJcbiAgICAgICAgdzogMCxcclxuICAgICAgICBoOiAwXHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG52YXIgYnVmZmVyQ2xlYXJSZWdpb24gPSB7XHJcbiAgICB4OiBjYW52YXNDZW50cmVILFxyXG4gICAgeTogY2FudmFzQ2VudHJlVixcclxuICAgIHc6IDAsXHJcbiAgICBoOiAwXHJcblxyXG4gICAgLy8gZW1pdHRlciBzdG9yZVxyXG59O1xyXG5cclxudmFyIGVtaXR0ZXJTdG9yZSA9IFtdO1xyXG4vLyBwYXJ0aWNsZSBzdG9yZVxyXG52YXIgZW50aXR5U3RvcmUgPSBbXTtcclxuLy8gcGFydGljbGUgc3RvcmUgbWV0YSBkYXRhXHJcbnZhciBlbnRpdHlQb29sID0gbmV3IExpbmtlZExpc3QoKTtcclxudmFyIGxpdmVFbnRpdHlDb3VudCA9IDA7XHJcblxyXG52YXIgcnVudGltZUNvbmZpZyA9IHtcclxuXHJcbiAgICBnbG9iYWxDbG9jazogMCxcclxuICAgIGdsb2JhbENsb2NrVGljazogZnVuY3Rpb24gZ2xvYmFsQ2xvY2tUaWNrKCkge1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ2xvY2srKztcclxuICAgIH0sXHJcblxyXG4gICAgZW1pdHRlckNvdW50OiAwLFxyXG4gICAgYWN0aXZlRW1pdHRlcnM6IDAsXHJcblxyXG4gICAgbGl2ZUVudGl0eUNvdW50OiAwLFxyXG4gICAgc3VidHJhY3Q6IGZ1bmN0aW9uIHN1YnRyYWN0KGFtb3VudCkge1xyXG4gICAgICAgIHRoaXMubGl2ZUVudGl0eUNvdW50IC09IGFtb3VudDtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIHByZS1wb3B1bGF0ZSBlbnRpdHlTdG9yZVxyXG52YXIgZW50aXR5UG9wdWxhdGlvbiA9IDEwMDAwO1xyXG5mb3IgKHZhciBpID0gMDsgaSA8IGVudGl0eVBvcHVsYXRpb247IGkrKykge1xyXG4gICAgLy8gY29uc29sZS5sb2coIFwicG9wdWxhdGluZyBlbnRpdHlTdG9yZSB3aXRoIHBJbnN0YW5jZSAnJWQnOiBcIiwgaSApO1xyXG4gICAgLy8gcEluc3RhbmNlLmlkeCA9IGk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyggXCJwSW5zdGFuY2UuaWR4ICclZCdcIiwgcEluc3RhbmNlLmlkeCApXHJcbiAgICBlbnRpdHlTdG9yZS5wdXNoKGNyZWF0ZUxpdmVQYXJ0aWNsZSgwLCAwLCBpLCBiYXNlRW1pdHRlclRoZW1lLCB0aGVtZXMucmVzZXQpKTtcclxuICAgIGVudGl0eVBvb2wuaW5zZXJ0KCcnICsgaSk7XHJcbn1cclxuXHJcbi8vIGdsb2JhbCBjb3VudGVyXHJcbnZhciBnbG9iYWxDbG9jayA9IDA7XHJcbnZhciBjb3VudGVyID0gMDtcclxuXHJcbi8vIHNldCBkZWZhdWx0IHZhcmlhYmxlcyBcclxudmFyIG1vdXNlWCA9IHZvaWQgMCxcclxuICAgIG1vdXNlWSA9IHZvaWQgMCxcclxuICAgIHJ1bnRpbWUgPSB2b2lkIDAsXHJcbiAgICBwTGl2ZSA9IHZvaWQgMDtcclxuICAgIFxyXG4vLyBsZXQgY3VyclRoZW1lID0gdGhlbWVzLmZpcmU7XHJcbi8vIHZhciBjdXJyVGhlbWUgPSB0aGVtZXMuZmxhbWU7XHJcbmxldCBjdXJyVGhlbWUgPSB0aGVtZXMud2FycFN0YXI7XHJcbi8vIGxldCBjdXJyVGhlbWUgPSB0aGVtZXMuc21va2U7XHJcblxyXG4vLyBsZXQgY3VyckVtaXR0ZXJUaGVtZSA9IHNpbmdsZUJ1cnN0VGhlbWU7XHJcbmxldCBjdXJyRW1pdHRlclRoZW1lID0gd2FycFN0cmVhbVRoZW1lO1xyXG4vLyB2YXIgY3VyckVtaXR0ZXJUaGVtZSA9IGZsYW1lU3RyZWFtVGhlbWU7XHJcblxyXG52YXIgY3VyckVtbWlzc2lvblR5cGUgPSB7XHJcbiAgICBtb3VzZUNsaWNrRXZlbnQ6IHRydWUsXHJcbiAgICByYW5kb21CdXJzdDogZmFsc2UsXHJcbiAgICBzdGVhZHlTdHJlYW06IGZhbHNlXHJcbn07XHJcblxyXG4vLyBjYW52YXMgY2xpY2sgaGFuZGxlclxyXG5mdW5jdGlvbiByZWdpc3Rlck1vdXNlQ2xpY2tFbW1pc2lvbigpIHtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIG1vdXNlWCA9IGV2ZW50Lm9mZnNldFg7XHJcbiAgICAgICAgbW91c2VZID0gZXZlbnQub2Zmc2V0WTtcclxuXHJcbiAgICAgICAgLy8gdGVzdEVtaXR0ZXIucmVzZXRFbWlzc2lvblZhbHVlcygpO1xyXG4gICAgICAgIC8vIHRlc3RFbWl0dGVyLnRyaWdnZXJFbWl0dGVyKCB7IHg6IG1vdXNlWCwgeTogbW91c2VZIH0gKTtcclxuXHJcbiAgICAgICAgdmFyIHRlc3RFbWl0dGVyID0gbmV3IEVtaXR0ZXJFbnRpdHkoJ3Rlc3RFbWl0dGVyJywgY3VyckVtaXR0ZXJUaGVtZSwgY3VyclRoZW1lLCBlbWl0RW50aXRpZXMpO1xyXG5cclxuICAgICAgICBlbWl0dGVyU3RvcmUucHVzaCh0ZXN0RW1pdHRlcik7XHJcblxyXG4gICAgICAgIHRlc3RFbWl0dGVyLnRyaWdnZXJFbWl0dGVyKHtcclxuICAgICAgICAgICAgeDogY2FudmFzQ29uZmlnLmNlbnRlckgsXHJcbiAgICAgICAgICAgIHk6IGNhbnZhc0NvbmZpZy5jZW50ZXJWXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChhbmltYXRpb24uc3RhdGUgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgYW5pbWF0aW9uLnN0YXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmlmIChjdXJyRW1taXNzaW9uVHlwZS5tb3VzZUNsaWNrRXZlbnQpIHtcclxuICAgIHJlZ2lzdGVyTW91c2VDbGlja0VtbWlzaW9uKCk7XHJcbn1cclxuXHJcbnZhciBzbW9rZUVtaXR0ZXIgPSBuZXcgRW1pdHRlckVudGl0eSgnc21va2VFbWl0dGVyJywgc21va2VTdHJlYW1UaGVtZSwgdGhlbWVzLnNtb2tlLCBlbWl0RW50aXRpZXMpO1xyXG5lbWl0dGVyU3RvcmUucHVzaChzbW9rZUVtaXR0ZXIpO1xyXG5cclxuLy8gcGFydGljbGUgbWV0aG9kcyBmTlxyXG5mdW5jdGlvbiByZW5kZXJQYXJ0aWNsZSh4LCB5LCByLCBjb2xvckRhdGEsIGNvbnRleHQsIG1hdGhVdGlscykge1xyXG4gICAgdmFyIHAgPSB0aGlzO1xyXG4gICAgLy8gY29uc29sZS5sb2coICdwLnJlbmRlcjogJywgcCApO1xyXG4gICAgdmFyIGNvbXBpbGVkQ29sb3IgPSBcInJnYmEoXCIgKyBjb2xvckRhdGEuciArICcsJyArIGNvbG9yRGF0YS5nICsgJywnICsgY29sb3JEYXRhLmIgKyBcIixcIiArIGNvbG9yRGF0YS5hICsgXCIpXCI7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGNvbXBpbGVkQ29sb3I7XHJcbiAgICBjb250ZXh0LmZpbGxDaXJjbGUoeCwgeSwgciwgY29udGV4dCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFBhcnRpY2xlQXR0cmlidXRlcyhwLCBwcGEpIHtcclxuXHJcbiAgICBwLmlzQWxpdmUgPSBwcGEuYWN0aXZlO1xyXG4gICAgcC5saWZlU3BhbiA9IHBwYS5saWZlU3BhbjtcclxuICAgIHAuY3VyckxpZmUgPSBwcGEubGlmZVNwYW47XHJcbiAgICBwLmN1cnJMaWZlSW52ID0gMDtcclxuICAgIHAueCA9IHBwYS54O1xyXG4gICAgcC55ID0gcHBhLnk7XHJcbiAgICBwLnhWZWwgPSBwcGEueFZlbDtcclxuICAgIHAueVZlbCA9IHBwYS55VmVsO1xyXG4gICAgcC52QWNjID0gcHBhLnZBY2M7XHJcbiAgICBwLmluaXRSID0gcHBhLmluaXRSO1xyXG4gICAgcC5yID0gcHBhLmluaXRSO1xyXG4gICAgcC50UiA9IHBwYS50UjtcclxuICAgIHAuYW5nbGUgPSBwcGEuYW5nbGU7XHJcbiAgICBwLm1hZ25pdHVkZSA9IHBwYS5tYWduaXR1ZGU7XHJcbiAgICBwLnJlbGF0aXZlTWFnbml0dWRlID0gcHBhLm1hZ25pdHVkZTtcclxuICAgIHAubWFnbml0dWRlRGVjYXkgPSBwcGEubWFnbml0dWRlRGVjYXk7XHJcbiAgICBwLmVudGl0eVR5cGUgPSAnbm9uZSc7XHJcbiAgICBwLmFwcGx5Rm9yY2VzID0gcHBhLmFwcGx5Rm9yY2VzO1xyXG4gICAgcC5jb2xvcjREYXRhID0gcHBhLmNvbG9yNERhdGE7XHJcbiAgICBwLmNvbG9yUHJvZmlsZXMgPSBwcGEuY29sb3JQcm9maWxlcztcclxuICAgIHAua2lsbENvbmRpdGlvbnMgPSBwcGEua2lsbENvbmRpdGlvbnM7XHJcbiAgICBwLmN1c3RvbUF0dHJpYnV0ZXMgPSBwcGEuY3VzdG9tQXR0cmlidXRlcztcclxuICAgIHAuYW5pbWF0aW9uVHJhY2tzID0gcHBhLmFuaW1hdGlvblRyYWNrcztcclxuICAgIHAudXBkYXRlID0gcGFydGljbGVGbi51cGRhdGVQYXJ0aWNsZTtcclxuICAgIHAucmVpbmNhcm5hdGUgPSByZWluY2FybmF0ZVBhcnRpY2xlO1xyXG4gICAgcC5raWxsID0gcGFydGljbGVGbi5raWxsUGFydGljbGU7XHJcbiAgICBwLnJlbmRlciA9IHBwYS5yZW5kZXJGTjtcclxuICAgIHAuZXZlbnRzID0gcHBhLmV2ZW50cztcclxufVxyXG5cclxuLy8gcGFydGljbGUgZk5cclxuZnVuY3Rpb24gY3JlYXRlTGl2ZVBhcnRpY2xlKHRoaXNYLCB0aGlzWSwgaWR4LCBlbWlzc2lvbk9wdHMsIHBhcnRpY2xlT3B0cykge1xyXG5cclxuICAgIHZhciBuZXdQYXJ0aWNsZSA9IHt9O1xyXG4gICAgbmV3UGFydGljbGUuaWR4ID0gaWR4O1xyXG4gICAgc2V0UGFydGljbGVBdHRyaWJ1dGVzKG5ld1BhcnRpY2xlLCBwYXJ0aWNsZUZuLmNyZWF0ZVBlclBhcnRpY2xlQXR0cmlidXRlcyh0aGlzWCwgdGhpc1ksIGVtaXNzaW9uT3B0cywgcGFydGljbGVPcHRzKSk7XHJcbiAgICByZXR1cm4gbmV3UGFydGljbGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlaW5jYXJuYXRlUGFydGljbGUodGhpc1gsIHRoaXNZLCBlbWlzc2lvbk9wdHMsIHBhcnRpY2xlT3B0aW9ucykge1xyXG4gICAgc2V0UGFydGljbGVBdHRyaWJ1dGVzKHRoaXMsIHBhcnRpY2xlRm4uY3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzKHRoaXNYLCB0aGlzWSwgZW1pc3Npb25PcHRzLCBwYXJ0aWNsZU9wdGlvbnMpKTtcclxufVxyXG5cclxuLy8gZW1taXNpb24gZk5cclxuZnVuY3Rpb24gZW1pdEVudGl0aWVzKHgsIHksIGNvdW50LCBlbWlzc2lvbk9wdGlvbnMsIHBhcnRpY2xlT3B0aW9ucykge1xyXG4gICAgdmFyIGVudGl0eVN0b3JlTGVuID0gZW50aXR5U3RvcmUubGVuZ3RoO1xyXG4gICAgdmFyIGFkZGVkTmV3ID0gMDtcclxuICAgIHZhciBhZGRlZEZyb21Qb29sID0gMDtcclxuICAgIHZhciB0aGV0YTtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZyggXCJlbW1pdGluZyBhIHRvdGFsIG9mOiAnJWQnIHBhcnRpY2xlc1wiLCBjb3VudCApO1xyXG4gICAgcnVudGltZUNvbmZpZy5saXZlRW50aXR5Q291bnQgKz0gY291bnQ7XHJcbiAgICBmb3IgKHZhciBfaSA9IGNvdW50IC0gMTsgX2kgPj0gMDsgX2ktLSkge1xyXG5cclxuICAgICAgICBpZiAoZW50aXR5UG9vbC5nZXRTaXplKCkgPiAwKSB7XHJcbiAgICAgICAgICAgIGVudGl0eVN0b3JlW2VudGl0eVBvb2wuZ2V0VGFpbE5vZGUoKS5nZXREYXRhKCldLnJlaW5jYXJuYXRlKHgsIHksIGVtaXNzaW9uT3B0aW9ucywgcGFydGljbGVPcHRpb25zKTtcclxuICAgICAgICAgICAgYWRkZWRGcm9tUG9vbCsrO1xyXG4gICAgICAgICAgICBlbnRpdHlQb29sLnJlbW92ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVudGl0eVN0b3JlLnB1c2goY3JlYXRlTGl2ZVBhcnRpY2xlKHgsIHksIGVudGl0eVN0b3JlTGVuLCBlbWlzc2lvbk9wdGlvbnMsIHBhcnRpY2xlT3B0aW9ucykpO1xyXG4gICAgICAgICAgICBlbnRpdHlQb29sLmluc2VydCgnJyArIGVudGl0eVN0b3JlTGVuKTtcclxuICAgICAgICAgICAgYWRkZWROZXcrKztcclxuICAgICAgICAgICAgZW50aXR5U3RvcmVMZW4rKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBjb25zb2xlLmxvZyggXCJhZGRlZEZyb21Qb29sOiAnJWQnLCBhZGRlZE5ldzogJyVkJ1wiLCBhZGRlZEZyb21Qb29sLCBhZGRlZE5ldyApO1xyXG4gICAgLy8gY29uc29sZS5sb2coICdhZGRlZE5ldzogJywgYWRkZWROZXcgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlRW1pdHRlclN0b3JlTWVtYmVycygpIHtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gZW1pdHRlclN0b3JlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgZW1pdHRlclN0b3JlW2ldLnVwZGF0ZUVtaXR0ZXIoKTtcclxuICAgICAgICAvLyBlbWl0dGVyU3RvcmVbaV0ucmVuZGVyRW1pdHRlciggY3R4ICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIHJ1bnRpbWUgZk4gbWVtYmVyc1xyXG5mdW5jdGlvbiBkaXNwbGF5RGVidWdnaW5nKCkge1xyXG4gICAgZGVidWcuZGVidWdPdXRwdXQoY2FudmFzLCBjdHgsICdBbmltYXRpb24gQ291bnRlcjogJywgY291bnRlciwgMCk7XHJcbiAgICBkZWJ1Zy5kZWJ1Z091dHB1dChjYW52YXMsIGN0eCwgJ1BhcnRpY2xlIFBvb2w6ICcsIGVudGl0eVN0b3JlLmxlbmd0aCwgMSk7XHJcbiAgICBkZWJ1Zy5kZWJ1Z091dHB1dChjYW52YXMsIGN0eCwgJ0xpdmUgRW50aXRpZXM6ICcsIHJ1bnRpbWVDb25maWcubGl2ZUVudGl0eUNvdW50LCAyLCB7IG1pbjogZW50aXR5U3RvcmUubGVuZ3RoLCBtYXg6IDAgfSk7XHJcbiAgICBkZWJ1Zy5kZWJ1Z091dHB1dChjYW52YXMsIGN0eCwgJ0ZQUzogJywgTWF0aC5yb3VuZChkZWJ1Zy5jYWxjdWxhdGVGcHMoKSksIDMsIHsgbWluOiAwLCBtYXg6IDYwIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDeWNsZSgpIHtcclxuICAgIC8vIHJlbmRlcmluZ1xyXG4gICAgcGFydGljbGVBcnJGbi5yZW5kZXJQYXJ0aWNsZUFycihjdHgsIGVudGl0eVN0b3JlLCBhbmltYXRpb24pO1xyXG5cclxuICAgIC8vIGJsaXQgdG8gb25zY3JlZW5cclxuICAgIC8vIGJsaXRDdHguZHJhd0ltYWdlKCBjYW52YXMsIDAsIDAgKTtcclxuXHJcbiAgICAvLyB1cGRhdGluZ1xyXG4gICAgcGFydGljbGVBcnJGbi51cGRhdGVQYXJ0aWNsZUFycihjdHgsIGVudGl0eVN0b3JlLCBlbnRpdHlQb29sLCBhbmltYXRpb24sIGNhbnZhc0NvbmZpZywgcnVudGltZUNvbmZpZywgZW1pdHRlclN0b3JlKTtcclxuXHJcbiAgICB1cGRhdGVFbWl0dGVyU3RvcmVNZW1iZXJzKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsZWFyQ2FudmFzKGN0eCkge1xyXG4gICAgLy8gY2xlYW5pbmdcclxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FuVywgY2FuSCk7XHJcbiAgICAvLyBjdHguY2xlYXJSZWN0KCBidWZmZXJDbGVhclJlZ2lvbi54LCBidWZmZXJDbGVhclJlZ2lvbi55LCBidWZmZXJDbGVhclJlZ2lvbi53LCBidWZmZXJDbGVhclJlZ2lvbi5oICk7XHJcblxyXG4gICAgLy8gYmxpdEN0eC5jbGVhclJlY3QoIDAsIDAsIGNhblcsIGNhbkggKTtcclxuXHJcblxyXG4gICAgLy8gY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKCAwLCAwLCAwLCAwLjEgKSc7XHJcbiAgICAvLyBjdHguZmlsbFJlY3QoIDAsIDAsIGNhblcsIGNhbkggKTtcclxuXHJcbiAgICAvLyBzZXQgZGlydHkgYnVmZmVyXHJcbiAgICAvLyByZXNldEJ1ZmZlckNsZWFyUmVnaW9uKCk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gcnVudGltZVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuXHJcbiAgICAvLyBsb29wIGhvdXNla2VlcGluZ1xyXG4gICAgcnVudGltZSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAvLyBjbGVhbiBjYW52YXNcclxuICAgIGNsZWFyQ2FudmFzKGN0eCk7XHJcblxyXG4gICAgLy8gYmxlbmRpbmdcclxuICAgIC8vIGlmICggY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiAhPSBjdXJyVGhlbWUuY29udGV4dEJsZW5kaW5nTW9kZSApIHtcclxuICAgIC8vICAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gY3VyclRoZW1lLmNvbnRleHRCbGVuZGluZ01vZGU7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gdXBkYXRlc1xyXG4gICAgdXBkYXRlQ3ljbGUoKTtcclxuXHJcbiAgICAvLyBkZWJ1Z2dpbmdcclxuICAgIGRpc3BsYXlEZWJ1Z2dpbmcoKTtcclxuXHJcbiAgICAvLyBsb29waW5nXHJcbiAgICBhbmltYXRpb24uc3RhdGUgPT09IHRydWUgPyAocnVudGltZUVuZ2luZS5zdGFydEFuaW1hdGlvbihydW50aW1lLCB1cGRhdGUpLCBjb3VudGVyKyspIDogcnVudGltZUVuZ2luZS5zdG9wQW5pbWF0aW9uKHJ1bnRpbWUpO1xyXG5cclxuICAgIC8vIGdsb2JhbCBjbG9ja1xyXG4gICAgLy8gY291bnRlcisrO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRW5kIHJ1bnRpbWVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyIsInZhciBfdHJpZ29ub21pY1V0aWxzO1xyXG5cclxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cclxuXHJcbi8qKlxyXG4qIGNhY2hlZCB2YWx1ZXNcclxuKi9cclxuXHJcbnZhciBwaUJ5SGFsZiA9IE1hdGguUGkgLyAxODA7XHJcbnZhciBoYWxmQnlQaSA9IDE4MCAvIE1hdGguUEk7XHJcblxyXG4vKipcclxuKiBwcm92aWRlcyB0cmlnb25taWMgdXRpbCBtZXRob2RzLlxyXG4qXHJcbiogQG1peGluXHJcbiovXHJcbnZhciB0cmlnb25vbWljVXRpbHMgPSAoX3RyaWdvbm9taWNVdGlscyA9IHtcclxuXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBjYWxjdWxhdGUgZGlzdGFuY2UgYmV0d2VlbiAyIHZlY3RvciBjb29yZGluYXRlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IHgxIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geTEgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MiAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuICogQHBhcmFtIHtudW1iZXJ9IHkyIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdGRpc3Q6IGZ1bmN0aW9uIGRpc3QoeDEsIHkxLCB4MiwgeTIpIHtcclxuXHRcdHgyIC09IHgxO3kyIC09IHkxO1xyXG5cdFx0cmV0dXJuIE1hdGguc3FydCh4MiAqIHgyICsgeTIgKiB5Mik7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBjb252ZXJ0IGRlZ3JlZXMgdG8gcmFkaWFucy5cclxuICogQHBhcmFtIHtudW1iZXJ9IGRlZ3JlZXMgLSB0aGUgZGVncmVlIHZhbHVlIHRvIGNvbnZlcnQuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0ZGVncmVlc1RvUmFkaWFuczogZnVuY3Rpb24gZGVncmVlc1RvUmFkaWFucyhkZWdyZWVzKSB7XHJcblx0XHRyZXR1cm4gZGVncmVlcyAqIHBpQnlIYWxmO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gY29udmVydCByYWRpYW5zIHRvIGRlZ3JlZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWRpYW5zIC0gdGhlIGRlZ3JlZSB2YWx1ZSB0byBjb252ZXJ0LlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdHJhZGlhbnNUb0RlZ3JlZXM6IGZ1bmN0aW9uIHJhZGlhbnNUb0RlZ3JlZXMocmFkaWFucykge1xyXG5cdFx0cmV0dXJuIHJhZGlhbnMgKiBoYWxmQnlQaTtcclxuXHR9LFxyXG5cclxuXHQvKlxyXG4gcmV0dXJuIHVzZWZ1bCBUcmlnb25vbWljIHZhbHVlcyBmcm9tIHBvc2l0aW9uIG9mIDIgb2JqZWN0cyBpbiB4L3kgc3BhY2VcclxuIHdoZXJlIHgxL3kxIGlzIHRoZSBjdXJyZW50IHBvaXN0aW9uIGFuZCB4Mi95MiBpcyB0aGUgdGFyZ2V0IHBvc2l0aW9uXHJcbiAqL1xyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gY2FsY3VsYXRlIHRyaWdvbW9taWMgdmFsdWVzIGJldHdlZW4gMiB2ZWN0b3IgY29vcmRpbmF0ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MSAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHkxIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geDIgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuICogQHR5cGVkZWYge09iamVjdH0gQ2FsY3VsYXRpb25cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IGRpc3RhbmNlIFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHZlY3RvcnNcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IGFuZ2xlIFRoZSBhbmdsZSBiZXR3ZWVuIHZlY3RvcnNcclxuICogQHJldHVybnMgeyBDYWxjdWxhdGlvbiB9IHRoZSBjYWxjdWxhdGVkIGFuZ2xlIGFuZCBkaXN0YW5jZSBiZXR3ZWVuIHZlY3RvcnNcclxuICovXHJcblx0Z2V0QW5nbGVBbmREaXN0YW5jZTogZnVuY3Rpb24gZ2V0QW5nbGVBbmREaXN0YW5jZSh4MSwgeTEsIHgyLCB5Mikge1xyXG5cclxuXHRcdC8vIHNldCB1cCBiYXNlIHZhbHVlc1xyXG5cdFx0dmFyIGRYID0geDIgLSB4MTtcclxuXHRcdHZhciBkWSA9IHkyIC0geTE7XHJcblx0XHQvLyBnZXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHBvaW50c1xyXG5cdFx0dmFyIGQgPSBNYXRoLnNxcnQoZFggKiBkWCArIGRZICogZFkpO1xyXG5cdFx0Ly8gYW5nbGUgaW4gcmFkaWFuc1xyXG5cdFx0Ly8gdmFyIHJhZGlhbnMgPSBNYXRoLmF0YW4yKHlEaXN0LCB4RGlzdCkgKiAxODAgLyBNYXRoLlBJO1xyXG5cdFx0Ly8gYW5nbGUgaW4gcmFkaWFuc1xyXG5cdFx0dmFyIHIgPSBNYXRoLmF0YW4yKGRZLCBkWCk7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRkaXN0YW5jZTogZCxcclxuXHRcdFx0YW5nbGU6IHJcclxuXHRcdH07XHJcblx0fSxcclxuXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBnZXQgbmV3IFggY29vcmRpbmF0ZSBmcm9tIGFuZ2xlIGFuZCBkaXN0YW5jZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnMgLSB0aGUgYW5nbGUgdG8gdHJhbnNmb3JtIGluIHJhZGlhbnMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIHRoZSBkaXN0YW5jZSB0byB0cmFuc2Zvcm0uXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0Z2V0QWRqYWNlbnRMZW5ndGg6IGZ1bmN0aW9uIGdldEFkamFjZW50TGVuZ3RoKHJhZGlhbnMsIGRpc3RhbmNlKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5jb3MocmFkaWFucykgKiBkaXN0YW5jZTtcclxuXHR9XHJcblxyXG59LCBfZGVmaW5lUHJvcGVydHkoX3RyaWdvbm9taWNVdGlscywgXCJnZXRBZGphY2VudExlbmd0aFwiLCBmdW5jdGlvbiBnZXRBZGphY2VudExlbmd0aChyYWRpYW5zLCBkaXN0YW5jZSkge1xyXG5cdHJldHVybiBNYXRoLnNpbihyYWRpYW5zKSAqIGRpc3RhbmNlO1xyXG59KSwgX2RlZmluZVByb3BlcnR5KF90cmlnb25vbWljVXRpbHMsIFwiZmluZE5ld1BvaW50XCIsIGZ1bmN0aW9uIGZpbmROZXdQb2ludCh4LCB5LCBhbmdsZSwgZGlzdGFuY2UpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0eDogTWF0aC5jb3MoYW5nbGUpICogZGlzdGFuY2UgKyB4LFxyXG5cdFx0eTogTWF0aC5zaW4oYW5nbGUpICogZGlzdGFuY2UgKyB5XHJcblx0fTtcclxufSksIF9kZWZpbmVQcm9wZXJ0eShfdHJpZ29ub21pY1V0aWxzLCBcImNhbGN1bGF0ZVZlbG9jaXRpZXNcIiwgZnVuY3Rpb24gY2FsY3VsYXRlVmVsb2NpdGllcyh4LCB5LCBhbmdsZSwgaW1wdWxzZSkge1xyXG5cdHZhciBhMiA9IE1hdGguYXRhbjIoTWF0aC5zaW4oYW5nbGUpICogaW1wdWxzZSArIHkgLSB5LCBNYXRoLmNvcyhhbmdsZSkgKiBpbXB1bHNlICsgeCAtIHgpO1xyXG5cdHJldHVybiB7XHJcblx0XHR4VmVsOiBNYXRoLmNvcyhhMikgKiBpbXB1bHNlLFxyXG5cdFx0eVZlbDogTWF0aC5zaW4oYTIpICogaW1wdWxzZVxyXG5cdH07XHJcbn0pLCBfZGVmaW5lUHJvcGVydHkoX3RyaWdvbm9taWNVdGlscywgXCJyYWRpYWxEaXN0cmlidXRpb25cIiwgZnVuY3Rpb24gcmFkaWFsRGlzdHJpYnV0aW9uKGN4LCBjeSwgciwgYSkge1xyXG5cdHJldHVybiB7XHJcblx0XHR4OiBjeCArIHIgKiBNYXRoLmNvcyhhKSxcclxuXHRcdHk6IGN5ICsgciAqIE1hdGguc2luKGEpXHJcblx0fTtcclxufSksIF90cmlnb25vbWljVXRpbHMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMudHJpZ29ub21pY1V0aWxzID0gdHJpZ29ub21pY1V0aWxzOyIsImZ1bmN0aW9uIGdldFZhbHVlKHBhdGgsIG9yaWdpbikge1xyXG4gICAgaWYgKG9yaWdpbiA9PT0gdm9pZCAwIHx8IG9yaWdpbiA9PT0gbnVsbCkgb3JpZ2luID0gc2VsZiA/IHNlbGYgOiB0aGlzO1xyXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykgcGF0aCA9ICcnICsgcGF0aDtcclxuICAgIHZhciBjID0gJycsXHJcbiAgICAgICAgcGMsXHJcbiAgICAgICAgaSA9IDAsXHJcbiAgICAgICAgbiA9IHBhdGgubGVuZ3RoLFxyXG4gICAgICAgIG5hbWUgPSAnJztcclxuICAgIGlmIChuKSB3aGlsZSAoaSA8PSBuKSB7XHJcbiAgICAgICAgKGMgPSBwYXRoW2krK10pID09ICcuJyB8fCBjID09ICdbJyB8fCBjID09ICddJyB8fCBjID09IHZvaWQgMCA/IChuYW1lID8gKG9yaWdpbiA9IG9yaWdpbltuYW1lXSwgbmFtZSA9ICcnKSA6IHBjID09ICcuJyB8fCBwYyA9PSAnWycgfHwgcGMgPT0gJ10nICYmIGMgPT0gJ10nID8gaSA9IG4gKyAyIDogdm9pZCAwLCBwYyA9IGMpIDogbmFtZSArPSBjO1xyXG4gICAgfWlmIChpID09IG4gKyAyKSB0aHJvdyBcIkludmFsaWQgcGF0aDogXCIgKyBwYXRoO1xyXG4gICAgcmV0dXJuIG9yaWdpbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuZ2V0VmFsdWUgPSBnZXRWYWx1ZTsiXX0=
