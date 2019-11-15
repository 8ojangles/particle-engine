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

  var toStr = Object.prototype.toString;
  function hasOwnProperty(obj, prop) {
    if(obj == null) {
      return false
    }
    //to handle objects with null prototypes (too edge case?)
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }

  function isEmpty(value){
    if (!value) {
      return true;
    }
    if (isArray(value) && value.length === 0) {
        return true;
    } else if (typeof value !== 'string') {
        for (var i in value) {
            if (hasOwnProperty(value, i)) {
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

  function isObject(obj){
    return typeof obj === 'object' && toString(obj) === "[object Object]";
  }

  var isArray = Array.isArray || function(obj){
    /*istanbul ignore next:cant test*/
    return toStr.call(obj) === '[object Array]';
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

  function factory(options) {
    options = options || {}

    var objectPath = function(obj) {
      return Object.keys(objectPath).reduce(function(proxy, prop) {
        if(prop === 'create') {
          return proxy;
        }

        /*istanbul ignore else*/
        if (typeof objectPath[prop] === 'function') {
          proxy[prop] = objectPath[prop].bind(objectPath, obj);
        }

        return proxy;
      }, {});
    };

    function hasShallowProperty(obj, prop) {
      return (options.includeInheritedProps || (typeof prop === 'number' && Array.isArray(obj)) || hasOwnProperty(obj, prop))
    }

    function getShallowProperty(obj, prop) {
      if (hasShallowProperty(obj, prop)) {
        return obj[prop];
      }
    }

    function set(obj, path, value, doNotReplace){
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        return obj;
      }
      if (typeof path === 'string') {
        return set(obj, path.split('.').map(getKey), value, doNotReplace);
      }
      var currentPath = path[0];
      var currentValue = getShallowProperty(obj, currentPath);
      if (path.length === 1) {
        if (currentValue === void 0 || !doNotReplace) {
          obj[currentPath] = value;
        }
        return currentValue;
      }

      if (currentValue === void 0) {
        //check if we assume an array
        if(typeof path[1] === 'number') {
          obj[currentPath] = [];
        } else {
          obj[currentPath] = {};
        }
      }

      return set(obj[currentPath], path.slice(1), value, doNotReplace);
    }

    objectPath.has = function (obj, path) {
      if (typeof path === 'number') {
        path = [path];
      } else if (typeof path === 'string') {
        path = path.split('.');
      }

      if (!path || path.length === 0) {
        return !!obj;
      }

      for (var i = 0; i < path.length; i++) {
        var j = getKey(path[i]);

        if((typeof j === 'number' && isArray(obj) && j < obj.length) ||
          (options.includeInheritedProps ? (j in Object(obj)) : hasOwnProperty(obj, j))) {
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
        return void 0;
      }
      if (obj == null) {
        return void 0;
      }

      var value, i;
      if (!(value = objectPath.get(obj, path))) {
        return void 0;
      }

      if (typeof value === 'string') {
        return objectPath.set(obj, path, '');
      } else if (isBoolean(value)) {
        return objectPath.set(obj, path, false);
      } else if (typeof value === 'number') {
        return objectPath.set(obj, path, 0);
      } else if (isArray(value)) {
        value.length = 0;
      } else if (isObject(value)) {
        for (i in value) {
          if (hasShallowProperty(value, i)) {
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
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        return obj;
      }
      if (obj == null) {
        return defaultValue;
      }
      if (typeof path === 'string') {
        return objectPath.get(obj, path.split('.'), defaultValue);
      }

      var currentPath = getKey(path[0]);
      var nextObj = getShallowProperty(obj, currentPath)
      if (nextObj === void 0) {
        return defaultValue;
      }

      if (path.length === 1) {
        return nextObj;
      }

      return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
    };

    objectPath.del = function del(obj, path) {
      if (typeof path === 'number') {
        path = [path];
      }

      if (obj == null) {
        return obj;
      }

      if (isEmpty(path)) {
        return obj;
      }
      if(typeof path === 'string') {
        return objectPath.del(obj, path.split('.'));
      }

      var currentPath = getKey(path[0]);
      if (!hasShallowProperty(obj, currentPath)) {
        return obj;
      }

      if(path.length === 1) {
        if (isArray(obj)) {
          obj.splice(currentPath, 1);
        } else {
          delete obj[currentPath];
        }
      } else {
        return objectPath.del(obj[currentPath], path.slice(1));
      }

      return obj;
    }

    return objectPath;
  }

  var mod = factory();
  mod.create = factory;
  mod.withInheritedProps = factory({includeInheritedProps: true})
  return mod;
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
},{"./mathUtils.js":20}],7:[function(require,module,exports){
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
	context.beginPath();
	context.arc(x, y, r, 0, Math.PI * 2, true);
};

/**
* @augments canvasDrawingApi
* @description API to draw filled circle
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.fillCircle = function (x, y, r, context) {
	context.circle(x, y, r, context);
	context.fill();
	context.beginPath();
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
},{"./mathUtils.js":20}],10:[function(require,module,exports){
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
},{"./mathUtils.js":20}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
var EmitterStoreFn = function EmitterStoreFn() {};

EmitterStoreFn.prototype.update = function (store) {
  var i = store.length - 1;
  for (; i >= 0; i--) {
    store[i].updateEmitter();
    // store[i].renderEmitter( ctx );
  }
};

module.exports.EmitterStoreFn = EmitterStoreFn;
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
			min: 30,
			max: 60,

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
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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
        min: 5,
        max: 12,

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
},{}],18:[function(require,module,exports){
require( './particles.js' );
},{"./particles.js":39}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
var renderParticleArr = require('./particleFunctions/renderParticleArr.js').renderParticleArr;
var updateParticleArr = require('./particleFunctions/updateParticleArr.js').updateParticleArr;

var particleArrFn = {

	renderParticleArr: renderParticleArr,
	updateParticleArr: updateParticleArr

};

module.exports.particleArrFn = particleArrFn;
},{"./particleFunctions/renderParticleArr.js":26,"./particleFunctions/updateParticleArr.js":28}],22:[function(require,module,exports){
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
},{"./particleFunctions/checkParticleKillConditions.js":23,"./particleFunctions/createPerParticleAttributes.js":24,"./particleFunctions/killParticle.js":25,"./particleFunctions/updateParticle.js":27}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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
            willFlare: themed.customAttributes.lensFlare.mightFlare === true && willFlareTemp < 10 ? true : false,
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
},{"./../mathUtils.js":20,"./../trigonomicUtils.js":40,"./../utilities.js":41}],25:[function(require,module,exports){
var killParticle = function killParticle(list, index, entityCounter) {
    var self = this;
    self.isAlive = 0;
    list.insert(index);
    entityCounter.subtract(1);
};

module.exports.killParticle = killParticle;
},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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

                    for (var j = particleEvents.length - 1; j >= 0; j--) {

                        var thisParticleEvent = p.events[ j ];
                        if (thisParticleEvent.eventType = t.linkedEvent) {
                            if (t.linkedEvent === 'emit') {

                                var thisParticleEventParams = thisParticleEvent.eventParams;

                                if (typeof thisParticleEventParams.emitter !== 'undefined') {
                                    thisParticleEventParams.emitter.triggerEmitter({ x: p.x, y: p.y });
                                } else {
                                    for (var k = emitterArr.length - 1; k >= 0; k--) {
                                        if (emitterArr[ k ].name === thisParticleEventParams.emitterName) {
                                            thisParticleEventParams.emitter = emitterArr[ k ];
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

                    for (var l = animTracksLen - 1; l >= 0; l--) {
                        if (animTracks[ l ].animName === t.linkedAnim) {
                            animTracks[ l ].active = true;
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
},{"./../easing.js":11,"./../environment.js":19}],28:[function(require,module,exports){
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
},{"./../particleFn.js":22}],29:[function(require,module,exports){
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
},{"./themes/fire/theme.js":34,"./themes/flame/flameTheme.js":35,"./themes/reset/resetTheme.js":36,"./themes/smoke/smokeTheme.js":37,"./themes/warpStar/warpStarTheme.js":38}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
var customAttributes = {
    lensFlare: {
        mightFlare: true,
        willFlare: false,
        angle: 0.30
    }
};

module.exports.customAttributes = customAttributes;
},{}],32:[function(require,module,exports){
var killConditions = {
    boundaryCheck: true,
    boundaryOffset: 0,
    colorCheck: [{ name: 'a', value: 0 }],
    perAttribute: [{ name: 'radius', value: 0 }, { name: 'currLife', value: 0 }]
};

module.exports.killConditions = killConditions;
},{}],33:[function(require,module,exports){
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
},{"./../../../mathUtils.js":20,"./../../../trigonomicUtils.js":40}],34:[function(require,module,exports){
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
},{"./../../../mathUtils.js":20,"./animationTracks.js":30,"./customAttributes.js":31,"./killConditions.js":32,"./renderFn.js":33}],35:[function(require,module,exports){
var mathUtils = require('./../../../mathUtils.js').mathUtils;
var coloring = require('./../../../colorUtils.js').colorUtils;
var trig = require('./../../../trigonomicUtils.js').trigonomicUtils;

var rgba = coloring.rgba;

var flameTheme = {
    contextBlendingMode: 'lighter',
    active: 1,
    life: { min: 30, max: 60 },
    angle: { min: 1.45, max: 1.55 },
    // mag: { min: 8, max: 13 },
    // velAcceleration: 1.05,
    velAcceleration: { min: 1, max: 1 },
    magDecay: 1.5,
    radius: { min: 100, max: 180 },
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
        // linkedEvent: 'emit',
        linkedEvent: false

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
},{"./../../../colorUtils.js":9,"./../../../mathUtils.js":20,"./../../../trigonomicUtils.js":40}],36:[function(require,module,exports){
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
},{"./../../../mathUtils.js":20}],37:[function(require,module,exports){
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
},{"./../../../colorUtils.js":9,"./../../../mathUtils.js":20}],38:[function(require,module,exports){
var mathUtils = require('./../../../mathUtils.js').mathUtils;
var trig = require('./../../../trigonomicUtils.js').trigonomicUtils;
var coloring = require('./../../../colorUtils.js').colorUtils;
var rgba = coloring.rgba;

var warpStarTheme = {
    contextBlendingMode: 'lighter',
    active: 1,
    life: { min: 50, max: 100 },
    angle: { min: 0, max: 2 },
    // velAcceleration: 1.05,
    velAcceleration: { min: 1.01, max: 1.2 },
    magDecay: 1,
    radius: { min: 1.2, max: 1.6 },
    targetRadius: { min: 2.2, max: 3 },
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
    animationTracks: [
        {
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
        }
    ],
    killConditions: {
        boundaryCheck: true,
        boundaryOffset: 400,
        colorCheck: [],
        perAttribute: []
    },
    renderParticle: function renderParticle(x, y, r, colorData, context) {
        var p = this;

        var stretchVal = mathUtils.map(p.relativeMagnitude, 0, 100, 1, 10);
        var chromeVal = mathUtils.map(stretchVal, 0, 10, 1, 4);
        var thisWillFlare = p.customAttributes.lensFlare.willFlare;

        context.translate(x, y);
        context.rotate(p.angle);

        if (chromeVal < 1) {
            context.fillStyle = "rgba( 255, 255, 255, 1 )";
            context.fillEllipse(0, 0, r * stretchVal, r, context);
        } else {
            // fake chromatic abberation ( rainbowing lens effect due to light refraction
            context.fillStyle = "rgba( 255, 0, 0, " + colorData.a + " )";
            context.fillEllipse(chromeVal * -1, 0, r * stretchVal, r, context);
            context.fillStyle = "rgba( 0, 255, 0, " + colorData.a + " )";
            context.fillEllipse(0, 0, r * stretchVal, r, context);
            context.fillStyle = "rgba( 0, 0, 255, " + colorData.a + " )";
            context.fillEllipse(0, chromeVal, r * stretchVal, r, context);
        }
        context.rotate(-p.angle);
        context.translate(-x, -y);

        if ( thisWillFlare ) {

            var flareAngle = trig.angle( x, y, 960, 469 );
            var flareCos = Math.cos( flareAngle );
            var flareSin = Math.sin( flareAngle );

            // var invertedFlareAngle = trig.angle(x, y, 960, 469);


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


                context.rotate( 1.5 );
                context.fillCircle(0, 0, 800, context);
                context.rotate( 1 );
                context.fillCircle(0, 0, 800, context);
                context.rotate( -0.5 );

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

            var radDist1 = 200 * stretchVal;
            var x2 = radDist1 * flareCos + x;
            var y2 = radDist1 * flareSin + y;
            var x2a = ( radDist1 * 1.5 ) * flareCos + x;
            var y2a = ( radDist1 * 1.5 ) * flareSin + y;

            var opacity3 = p.color4Data.a * 0.025;
            // little flare 1
            var grd2 = context.createRadialGradient(x2, y2, 0, x2, y2, 50);

            grd2.addColorStop(0, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd2.addColorStop(0.8, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd2.addColorStop(1, "rgba( 255, 255, 255, 0 )");

            context.fillStyle = grd2;
            context.fillCircle(x2, y2, 50, context);

            // little flare 2
            var grd2a = context.createRadialGradient(x2a, y2a, 0, x2a, y2a, 50);

            grd2a.addColorStop(0, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd2a.addColorStop(0.8, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd2a.addColorStop(1, "rgba( 255, 255, 255, 0 )");
            context.fillStyle = grd2a;
            context.fillCircle(x2a, y2a, 50, context);

            var radDist2 = 300 * stretchVal * 1.5;
            var x3 = radDist2 * flareCos + x;
            var y3 = radDist2 * flareSin + y;
            var x3a = ( radDist2 * 1.5 ) * flareCos + x;
            var y3a = ( radDist2 * 1.5 ) * flareSin + y;

            // little flare 3
            var grd3 = context.createRadialGradient(x3, y3, 0, x3, y3, 25);

            grd3.addColorStop(0, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd3.addColorStop(0.8, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd3.addColorStop(1, "rgba( 255, 255, 255, 0 )");
            context.fillStyle = grd3;
            context.fillCircle(x3, y3, 25, context);

            // little flare 4
            var grd3a = context.createRadialGradient(x3a, y3a, 0, x3a, y3a, 25);

            grd3a.addColorStop(0, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd3a.addColorStop(0.8, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd3a.addColorStop(1, "rgba( 255, 255, 255, 0 )");
            context.fillStyle = grd3a;
            context.fillCircle(x3a, y3a, 25, context);
        }
    }
};

module.exports.warpStarTheme = warpStarTheme;
},{"./../../../colorUtils.js":9,"./../../../mathUtils.js":20,"./../../../trigonomicUtils.js":40}],39:[function(require,module,exports){
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
};var emitterStore = [];
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
var currTheme = themes.flame;
// let currTheme = themes.warpStar;
// let currTheme = themes.smoke;

// let currEmitterTheme = singleBurstTheme;
// let currEmitterTheme = warpStreamTheme;
var currEmitterTheme = flameStreamTheme;

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
},{"./EmitterEntity.js":6,"./animation.js":7,"./canvasApiAugmentation.js":8,"./colorUtils.js":9,"./debugUtils.js":10,"./easing.js":11,"./emitterStore.js":12,"./emitterThemes/baseEmitter/baseEmitterTheme.js":13,"./emitterThemes/flameStream/flameStreamTheme.js":14,"./emitterThemes/singleBurstTheme/singleBurstTheme.js":15,"./emitterThemes/smokeStream/smokeStreamTheme.js":16,"./emitterThemes/warpStream/warpStreamTheme.js":17,"./environment.js":19,"./mathUtils.js":20,"./particleArrFn.js":21,"./particleFn.js":22,"./particleThemes/themes.js":29,"./trigonomicUtils.js":40,"dbly-linked-list":1,"object-path":5}],40:[function(require,module,exports){
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

	angle: function(originX, originY, targetX, targetY) {
        var dx = originX - targetX;
        var dy = originY - targetY;
        var theta = Math.atan2(-dy, -dx);
        return theta;
    },

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
},{}],41:[function(require,module,exports){
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
},{}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGJseS1saW5rZWQtbGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kYmx5LWxpbmtlZC1saXN0L2xpYi9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9kYmx5LWxpbmtlZC1saXN0L2xpYi9saXN0LW5vZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmlzZXF1YWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LXBhdGgvaW5kZXguanMiLCJzcmMvanMvRW1pdHRlckVudGl0eS5qcyIsInNyYy9qcy9hbmltYXRpb24uanMiLCJzcmMvanMvY2FudmFzQXBpQXVnbWVudGF0aW9uLmpzIiwic3JjL2pzL2NvbG9yVXRpbHMuanMiLCJzcmMvanMvZGVidWdVdGlscy5qcyIsInNyYy9qcy9lYXNpbmcuanMiLCJzcmMvanMvZW1pdHRlclN0b3JlLmpzIiwic3JjL2pzL2VtaXR0ZXJUaGVtZXMvYmFzZUVtaXR0ZXIvYmFzZUVtaXR0ZXJUaGVtZS5qcyIsInNyYy9qcy9lbWl0dGVyVGhlbWVzL2ZsYW1lU3RyZWFtL2ZsYW1lU3RyZWFtVGhlbWUuanMiLCJzcmMvanMvZW1pdHRlclRoZW1lcy9zaW5nbGVCdXJzdFRoZW1lL3NpbmdsZUJ1cnN0VGhlbWUuanMiLCJzcmMvanMvZW1pdHRlclRoZW1lcy9zbW9rZVN0cmVhbS9zbW9rZVN0cmVhbVRoZW1lLmpzIiwic3JjL2pzL2VtaXR0ZXJUaGVtZXMvd2FycFN0cmVhbS93YXJwU3RyZWFtVGhlbWUuanMiLCJzcmMvanMvZW50cnkuanMiLCJzcmMvanMvZW52aXJvbm1lbnQuanMiLCJzcmMvanMvbWF0aFV0aWxzLmpzIiwic3JjL2pzL3BhcnRpY2xlQXJyRm4uanMiLCJzcmMvanMvcGFydGljbGVGbi5qcyIsInNyYy9qcy9wYXJ0aWNsZUZ1bmN0aW9ucy9jaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnMuanMiLCJzcmMvanMvcGFydGljbGVGdW5jdGlvbnMvY3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzLmpzIiwic3JjL2pzL3BhcnRpY2xlRnVuY3Rpb25zL2tpbGxQYXJ0aWNsZS5qcyIsInNyYy9qcy9wYXJ0aWNsZUZ1bmN0aW9ucy9yZW5kZXJQYXJ0aWNsZUFyci5qcyIsInNyYy9qcy9wYXJ0aWNsZUZ1bmN0aW9ucy91cGRhdGVQYXJ0aWNsZS5qcyIsInNyYy9qcy9wYXJ0aWNsZUZ1bmN0aW9ucy91cGRhdGVQYXJ0aWNsZUFyci5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL2ZpcmUvYW5pbWF0aW9uVHJhY2tzLmpzIiwic3JjL2pzL3BhcnRpY2xlVGhlbWVzL3RoZW1lcy9maXJlL2N1c3RvbUF0dHJpYnV0ZXMuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL2ZpcmUva2lsbENvbmRpdGlvbnMuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL2ZpcmUvcmVuZGVyRm4uanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL2ZpcmUvdGhlbWUuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL2ZsYW1lL2ZsYW1lVGhlbWUuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL3Jlc2V0L3Jlc2V0VGhlbWUuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL3Ntb2tlL3Ntb2tlVGhlbWUuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL3dhcnBTdGFyL3dhcnBTdGFyVGhlbWUuanMiLCJzcmMvanMvcGFydGljbGVzLmpzIiwic3JjL2pzL3RyaWdvbm9taWNVdGlscy5qcyIsInNyYy9qcy91dGlsaXRpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeHpEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IEltcGxlbWVudGF0aW9uIG9mIGEgZG91Ymx5IGxpbmtlZC1saXN0IGRhdGEgc3RydWN0dXJlXG4gKiBAYXV0aG9yIEphc29uIFMuIEpvbmVzXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBpc0VxdWFsID0gcmVxdWlyZSgnbG9kYXNoLmlzZXF1YWwnKTtcbiAgICB2YXIgTm9kZSA9IHJlcXVpcmUoJy4vbGliL2xpc3Qtbm9kZScpO1xuICAgIHZhciBJdGVyYXRvciA9IHJlcXVpcmUoJy4vbGliL2l0ZXJhdG9yJyk7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBEb3VibHkgbGlua2VkIGxpc3QgY2xhc3NcbiAgICAgKlxuICAgICAqIEltcGxlbWVudGF0aW9uIG9mIGEgZG91Ymx5IGxpbmtlZCBsaXN0IGRhdGEgc3RydWN0dXJlLiAgVGhpc1xuICAgICAqIGltcGxlbWVudGF0aW9uIHByb3ZpZGVzIHRoZSBnZW5lcmFsIGZ1bmN0aW9uYWxpdHkgb2YgYWRkaW5nIG5vZGVzIHRvXG4gICAgICogdGhlIGZyb250IG9yIGJhY2sgb2YgdGhlIGxpc3QsIGFzIHdlbGwgYXMgcmVtb3Zpbmcgbm9kZSBmcm9tIHRoZSBmcm9udFxuICAgICAqIG9yIGJhY2suICBUaGlzIGZ1bmN0aW9uYWxpdHkgZW5hYmxlcyB0aGlzIGltcGxlbWVudGlvbiB0byBiZSB0aGVcbiAgICAgKiB1bmRlcmx5aW5nIGRhdGEgc3RydWN0dXJlIGZvciB0aGUgbW9yZSBzcGVjaWZpYyBzdGFjayBvciBxdWV1ZSBkYXRhXG4gICAgICogc3RydWN0dXJlLlxuICAgICAqXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBMaW5rZWRMaXN0IGluc3RhbmNlLiAgRWFjaCBpbnN0YW5jZSBoYXMgYSBoZWFkIG5vZGUsIGEgdGFpbFxuICAgICAqIG5vZGUgYW5kIGEgc2l6ZSwgd2hpY2ggcmVwcmVzZW50cyB0aGUgbnVtYmVyIG9mIG5vZGVzIGluIHRoZSBsaXN0LlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gRG91Ymx5TGlua2VkTGlzdCgpIHtcbiAgICAgICAgdGhpcy5oZWFkID0gbnVsbDtcbiAgICAgICAgdGhpcy50YWlsID0gbnVsbDtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcblxuICAgICAgICAvLyBhZGQgaXRlcmF0b3IgYXMgYSBwcm9wZXJ0eSBvZiB0aGlzIGxpc3QgdG8gc2hhcmUgdGhlIHNhbWVcbiAgICAgICAgLy8gaXRlcmF0b3IgaW5zdGFuY2Ugd2l0aCBhbGwgb3RoZXIgbWV0aG9kcyB0aGF0IG1heSByZXF1aXJlXG4gICAgICAgIC8vIGl0cyB1c2UuICBOb3RlOiBiZSBzdXJlIHRvIGNhbGwgdGhpcy5pdGVyYXRvci5yZXNldCgpIHRvXG4gICAgICAgIC8vIHJlc2V0IHRoaXMgaXRlcmF0b3IgdG8gcG9pbnQgdGhlIGhlYWQgb2YgdGhlIGxpc3QuXG4gICAgICAgIHRoaXMuaXRlcmF0b3IgPSBuZXcgSXRlcmF0b3IodGhpcyk7XG4gICAgfVxuXG4gICAgLyogRnVuY3Rpb25zIGF0dGFjaGVkIHRvIHRoZSBMaW5rZWQtbGlzdCBwcm90b3R5cGUuICBBbGwgbGlua2VkLWxpc3RcbiAgICAgKiBpbnN0YW5jZXMgd2lsbCBzaGFyZSB0aGVzZSBtZXRob2RzLCBtZWFuaW5nIHRoZXJlIHdpbGwgTk9UIGJlIGNvcGllc1xuICAgICAqIG1hZGUgZm9yIGVhY2ggaW5zdGFuY2UuICBUaGlzIHdpbGwgYmUgYSBodWdlIG1lbW9yeSBzYXZpbmdzIHNpbmNlIHRoZXJlXG4gICAgICogbWF5IGJlIHNldmVyYWwgZGlmZmVyZW50IGxpbmtlZCBsaXN0cy5cbiAgICAgKi9cbiAgICBEb3VibHlMaW5rZWRMaXN0LnByb3RvdHlwZSA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBOb2RlIG9iamVjdCB3aXRoICdkYXRhJyBhc3NpZ25lZCB0byB0aGUgbm9kZSdzIGRhdGFcbiAgICAgICAgICogcHJvcGVydHlcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YSBUaGUgZGF0YSB0byBpbml0aWFsaXplIHdpdGggdGhlXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBOb2RlIG9iamVjdCBpbnRpYWxpemVkIHdpdGggJ2RhdGEnXG4gICAgICAgICAqL1xuICAgICAgICBjcmVhdGVOZXdOb2RlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBOb2RlKGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBub2RlIGluIHRoZSBsaXN0LCBjb21tb25seSByZWZlcnJlZCB0byBhcyB0aGVcbiAgICAgICAgICogJ2hlYWQnIG5vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge29iamVjdH0gdGhlIGhlYWQgbm9kZSBvZiB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0SGVhZE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhlYWQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGxhc3Qgbm9kZSBpbiB0aGUgbGlzdCwgY29tbW9ubHkgcmVmZXJyZWQgdG8gYXMgdGhlXG4gICAgICAgICAqICd0YWlsJ25vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge29iamVjdH0gdGhlIHRhaWwgbm9kZSBvZiB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0VGFpbE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhaWw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERldGVybWluZXMgaWYgdGhlIGxpc3QgaXMgZW1wdHlcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGxpc3QgaXMgZW1wdHksIGZhbHNlIG90aGVyd2lzZVxuICAgICAgICAgKi9cbiAgICAgICAgaXNFbXB0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnNpemUgPT09IDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBzaXplIG9mIHRoZSBsaXN0LCBvciBudW1iZXIgb2Ygbm9kZXNcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge251bWJlcn0gdGhlIG51bWJlciBvZiBub2RlcyBpbiB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xlYXJzIHRoZSBsaXN0IG9mIGFsbCBub2Rlcy9kYXRhXG4gICAgICAgICAqL1xuICAgICAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgd2hpbGUgKCF0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8jIyMjIyMjIyMjIyMjIyMjIyMgSU5TRVJUIG1ldGhvZHMgIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zZXJ0cyBhIG5vZGUgd2l0aCB0aGUgcHJvdmlkZWQgZGF0YSB0byB0aGUgZW5kIG9mIHRoZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IGRhdGEgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5zZXJ0IG9wZXJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgICAgICAgKi9cbiAgICAgICAgaW5zZXJ0OiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0aGlzLmNyZWF0ZU5ld05vZGUoZGF0YSk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQgPSB0aGlzLnRhaWwgPSBuZXdOb2RlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwubmV4dCA9IG5ld05vZGU7XG4gICAgICAgICAgICAgICAgbmV3Tm9kZS5wcmV2ID0gdGhpcy50YWlsO1xuICAgICAgICAgICAgICAgIHRoaXMudGFpbCA9IG5ld05vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNpemUgKz0gMTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc2VydHMgYSBub2RlIHdpdGggdGhlIHByb3ZpZGVkIGRhdGEgdG8gdGhlIGZyb250IG9mIHRoZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IGRhdGEgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5zZXJ0IG9wZXJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgICAgICAgKi9cbiAgICAgICAgaW5zZXJ0Rmlyc3Q6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluc2VydChkYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0aGlzLmNyZWF0ZU5ld05vZGUoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICBuZXdOb2RlLm5leHQgPSB0aGlzLmhlYWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkLnByZXYgPSBuZXdOb2RlO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZCA9IG5ld05vZGU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNpemUgKz0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc2VydHMgYSBub2RlIHdpdGggdGhlIHByb3ZpZGVkIGRhdGEgYXQgdGhlIGluZGV4IGluZGljYXRlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFRoZSBpbmRleCBpbiB0aGUgbGlzdCB0byBpbnNlcnQgdGhlIG5ldyBub2RlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IGRhdGEgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZSBub2RlXG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnRBdDogZnVuY3Rpb24gKGluZGV4LCBkYXRhKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMuZ2V0SGVhZE5vZGUoKSxcbiAgICAgICAgICAgICAgICBuZXdOb2RlID0gdGhpcy5jcmVhdGVOZXdOb2RlKGRhdGEpLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gMDtcblxuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGluZGV4IG91dC1vZi1ib3VuZHNcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLmdldFNpemUoKSAtIDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIGluZGV4IGlzIDAsIHdlIGp1c3QgbmVlZCB0byBpbnNlcnQgdGhlIGZpcnN0IG5vZGVcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0Rmlyc3QoZGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdXJyZW50LnByZXYubmV4dCA9IG5ld05vZGU7XG4gICAgICAgICAgICBuZXdOb2RlLnByZXYgPSBjdXJyZW50LnByZXY7XG4gICAgICAgICAgICBjdXJyZW50LnByZXYgPSBuZXdOb2RlO1xuICAgICAgICAgICAgbmV3Tm9kZS5uZXh0ID0gY3VycmVudDtcblxuICAgICAgICAgICAgdGhpcy5zaXplICs9IDE7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnNlcnRzIGEgbm9kZSBiZWZvcmUgdGhlIGZpcnN0IG5vZGUgY29udGFpbmluZyB0aGUgcHJvdmlkZWQgZGF0YVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBub2RlRGF0YSBUaGUgZGF0YSBvZiB0aGUgbm9kZSB0b1xuICAgICAgICAgKiAgICAgICAgIGZpbmQgdG8gaW5zZXJ0IHRoZSBuZXcgbm9kZSBiZWZvcmVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YVRvSW5zZXJ0IFRoZSBkYXRhIHRvIGluaXRpYWxpemUgd2l0aCB0aGUgbm9kZVxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbnNlcnQgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uIChub2RlRGF0YSwgZGF0YVRvSW5zZXJ0KSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmluZGV4T2Yobm9kZURhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0QXQoaW5kZXgsIGRhdGFUb0luc2VydCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc2VydHMgYSBub2RlIGFmdGVyIHRoZSBmaXJzdCBub2RlIGNvbnRhaW5pbmcgdGhlIHByb3ZpZGVkIGRhdGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gbm9kZURhdGEgVGhlIGRhdGEgb2YgdGhlIG5vZGUgdG9cbiAgICAgICAgICogICAgICAgICBmaW5kIHRvIGluc2VydCB0aGUgbmV3IG5vZGUgYWZ0ZXJcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YVRvSW5zZXJ0IFRoZSBkYXRhIHRvIGluaXRpYWxpemUgd2l0aCB0aGUgbm9kZVxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbnNlcnQgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnRBZnRlcjogZnVuY3Rpb24gKG5vZGVEYXRhLCBkYXRhVG9JbnNlcnQpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuaW5kZXhPZihub2RlRGF0YSk7XG4gICAgICAgICAgICB2YXIgc2l6ZSA9IHRoaXMuZ2V0U2l6ZSgpO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBpZiB3ZSB3YW50IHRvIGluc2VydCBuZXcgbm9kZSBhZnRlciB0aGUgdGFpbCBub2RlXG4gICAgICAgICAgICBpZiAoaW5kZXggKyAxID09PSBzaXplKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBzbywgY2FsbCBpbnNlcnQsIHdoaWNoIHdpbGwgYXBwZW5kIHRvIHRoZSBlbmQgYnkgZGVmYXVsdFxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluc2VydChkYXRhVG9JbnNlcnQpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBpbmNyZW1lbnQgdGhlIGluZGV4IGFuZCBpbnNlcnQgdGhlcmVcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pbnNlcnRBdChpbmRleCArIDEsIGRhdGFUb0luc2VydCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbmNhdGVuYXRlIGFub3RoZXIgbGlua2VkIGxpc3QgdG8gdGhlIGVuZCBvZiB0aGlzIGxpbmtlZCBsaXN0LiBUaGUgcmVzdWx0IGlzIHZlcnlcbiAgICAgICAgICogc2ltaWxhciB0byBhcnJheS5jb25jYXQgYnV0IGhhcyBhIHBlcmZvcm1hbmNlIGltcHJvdmVtZW50IHNpbmNlIHRoZXJlIGlzIG5vIG5lZWQgdG9cbiAgICAgICAgICogaXRlcmF0ZSBvdmVyIHRoZSBsaXN0c1xuICAgICAgICAgKiBAcGFyYW0ge0RvdWJseUxpbmtlZExpc3R9IG90aGVyTGlua2VkTGlzdFxuICAgICAgICAgKiBAcmV0dXJucyB7RG91Ymx5TGlua2VkTGlzdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbmNhdDogZnVuY3Rpb24gKG90aGVyTGlua2VkTGlzdCkge1xuICAgICAgICAgICAgaWYgKG90aGVyTGlua2VkTGlzdCBpbnN0YW5jZW9mIERvdWJseUxpbmtlZExpc3QpIHtcbiAgICAgICAgICAgICAgICAvL2NyZWF0ZSBuZXcgbGlzdCBzbyB0aGUgY2FsbGluZyBsaXN0IGlzIGltbXV0YWJsZSAobGlrZSBhcnJheS5jb25jYXQpXG4gICAgICAgICAgICAgICAgdmFyIG5ld0xpc3QgPSBuZXcgRG91Ymx5TGlua2VkTGlzdCgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpemUoKSA+IDApIHsgLy90aGlzIGxpc3QgaXMgTk9UIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3QuaGVhZCA9IHRoaXMuZ2V0SGVhZE5vZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC50YWlsID0gdGhpcy5nZXRUYWlsTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICBuZXdMaXN0LnRhaWwubmV4dCA9IG90aGVyTGlua2VkTGlzdC5nZXRIZWFkTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJMaW5rZWRMaXN0LmdldFNpemUoKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0xpc3QudGFpbCA9IG90aGVyTGlua2VkTGlzdC5nZXRUYWlsTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3Quc2l6ZSA9IHRoaXMuZ2V0U2l6ZSgpICsgb3RoZXJMaW5rZWRMaXN0LmdldFNpemUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7IC8vJ3RoaXMnIGxpc3QgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC5oZWFkID0gb3RoZXJMaW5rZWRMaXN0LmdldEhlYWROb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3QudGFpbCA9IG90aGVyTGlua2VkTGlzdC5nZXRUYWlsTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICBuZXdMaXN0LnNpemUgPSBvdGhlckxpbmtlZExpc3QuZ2V0U2l6ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3TGlzdDtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuIG9ubHkgY29uY2F0IGFub3RoZXIgaW5zdGFuY2Ugb2YgRG91Ymx5TGlua2VkTGlzdFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyMjIyMjIyMjIyMjIyMjIyMjIyBSRU1PVkUgbWV0aG9kcyAjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIHRoZSB0YWlsIG5vZGUgZnJvbSB0aGUgbGlzdFxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGVyZSBpcyBhIHNpZ25pZmljYW50IHBlcmZvcm1hbmNlIGltcHJvdmVtZW50IHdpdGggdGhlIG9wZXJhdGlvblxuICAgICAgICAgKiBvdmVyIGl0cyBzaW5nbHkgbGlua2VkIGxpc3QgY291bnRlcnBhcnQuICBUaGUgbWVyZSBmYWN0IG9mIGhhdmluZ1xuICAgICAgICAgKiBhIHJlZmVyZW5jZSB0byB0aGUgcHJldmlvdXMgbm9kZSBpbXByb3ZlcyB0aGlzIG9wZXJhdGlvbiBmcm9tIE8obilcbiAgICAgICAgICogKGluIHRoZSBjYXNlIG9mIHNpbmdseSBsaW5rZWQgbGlzdCkgdG8gTygxKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMgdGhlIG5vZGUgdGhhdCB3YXMgcmVtb3ZlZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZ2V0IGhhbmRsZSBmb3IgdGhlIHRhaWwgbm9kZVxuICAgICAgICAgICAgdmFyIG5vZGVUb1JlbW92ZSA9IHRoaXMuZ2V0VGFpbE5vZGUoKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUgbm9kZSBpbiB0aGUgbGlzdCwgc2V0IGhlYWQgYW5kIHRhaWxcbiAgICAgICAgICAgIC8vIHByb3BlcnRpZXMgdG8gbnVsbFxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2l6ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBtb3JlIHRoYW4gb25lIG5vZGUgaW4gdGhlIGxpc3RcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YWlsID0gdGhpcy5nZXRUYWlsTm9kZSgpLnByZXY7XG4gICAgICAgICAgICAgICAgdGhpcy50YWlsLm5leHQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zaXplIC09IDE7XG5cbiAgICAgICAgICAgIHJldHVybiBub2RlVG9SZW1vdmU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgdGhlIGhlYWQgbm9kZSBmcm9tIHRoZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBub2RlIHRoYXQgd2FzIHJlbW92ZWRcbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZUZpcnN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5vZGVUb1JlbW92ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2l6ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgbm9kZVRvUmVtb3ZlID0gdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbm9kZVRvUmVtb3ZlID0gdGhpcy5nZXRIZWFkTm9kZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZCA9IHRoaXMuaGVhZC5uZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZC5wcmV2ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnNpemUgLT0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5vZGVUb1JlbW92ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyB0aGUgbm9kZSBhdCB0aGUgaW5kZXggcHJvdmlkZWRcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFRoZSBpbmRleCBvZiB0aGUgbm9kZSB0byByZW1vdmVcbiAgICAgICAgICogQHJldHVybnMgdGhlIG5vZGUgdGhhdCB3YXMgcmVtb3ZlZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlQXQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgdmFyIG5vZGVUb1JlbW92ZSA9IHRoaXMuZmluZEF0KGluZGV4KTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGluZGV4IG91dC1vZi1ib3VuZHNcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLmdldFNpemUoKSAtIDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgaW5kZXggaXMgMCwgd2UganVzdCBuZWVkIHRvIHJlbW92ZSB0aGUgZmlyc3Qgbm9kZVxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlRmlyc3QoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgaW5kZXggaXMgc2l6ZS0xLCB3ZSBqdXN0IG5lZWQgdG8gcmVtb3ZlIHRoZSBsYXN0IG5vZGUsXG4gICAgICAgICAgICAvLyB3aGljaCByZW1vdmUoKSBkb2VzIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdGhpcy5nZXRTaXplKCkgLSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5vZGVUb1JlbW92ZS5wcmV2Lm5leHQgPSBub2RlVG9SZW1vdmUubmV4dDtcbiAgICAgICAgICAgIG5vZGVUb1JlbW92ZS5uZXh0LnByZXYgPSBub2RlVG9SZW1vdmUucHJldjtcbiAgICAgICAgICAgIG5vZGVUb1JlbW92ZS5uZXh0ID0gbm9kZVRvUmVtb3ZlLnByZXYgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLnNpemUgLT0gMTtcblxuICAgICAgICAgICAgcmV0dXJuIG5vZGVUb1JlbW92ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyB0aGUgZmlyc3Qgbm9kZSB0aGF0IGNvbnRhaW5zIHRoZSBkYXRhIHByb3ZpZGVkXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IG5vZGVEYXRhIFRoZSBkYXRhIG9mIHRoZSBub2RlIHRvIHJlbW92ZVxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgbm9kZSB0aGF0IHdhcyByZW1vdmVkXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmVOb2RlOiBmdW5jdGlvbiAobm9kZURhdGEpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuaW5kZXhPZihub2RlRGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVBdChpbmRleCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8jIyMjIyMjIyMjIyMjIyMjIyMgRklORCBtZXRob2RzICMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBmaXJzdCBub2RlIGNvbnRhaW5pbmcgdGhlIHByb3ZpZGVkIGRhdGEuICBJZlxuICAgICAgICAgKiBhIG5vZGUgY2Fubm90IGJlIGZvdW5kIGNvbnRhaW5pbmcgdGhlIHByb3ZpZGVkIGRhdGEsIC0xIGlzIHJldHVybmVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBub2RlRGF0YSBUaGUgZGF0YSBvZiB0aGUgbm9kZSB0byBmaW5kXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbm9kZSBpZiBmb3VuZCwgLTEgb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBpbmRleE9mOiBmdW5jdGlvbiAobm9kZURhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IucmVzZXQoKTtcbiAgICAgICAgICAgIHZhciBjdXJyZW50O1xuXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAwO1xuXG4gICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhlIGxpc3QgKGtlZXBpbmcgdHJhY2sgb2YgdGhlIGluZGV4IHZhbHVlKSB1bnRpbFxuICAgICAgICAgICAgLy8gd2UgZmluZCB0aGUgbm9kZSBjb250YWluZyB0aGUgbm9kZURhdGEgd2UgYXJlIGxvb2tpbmcgZm9yXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5pdGVyYXRvci5oYXNOZXh0KCkpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gdGhpcy5pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzRXF1YWwoY3VycmVudC5nZXREYXRhKCksIG5vZGVEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG9ubHkgZ2V0IGhlcmUgaWYgd2UgZGlkbid0IGZpbmQgYSBub2RlIGNvbnRhaW5pbmcgdGhlIG5vZGVEYXRhXG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGZpc3Qgbm9kZSBjb250YWluaW5nIHRoZSBwcm92aWRlZCBkYXRhLiAgSWYgYSBub2RlXG4gICAgICAgICAqIGNhbm5vdCBiZSBmb3VuZCBjb250YWluaW5nIHRoZSBwcm92aWRlZCBkYXRhLCAtMSBpcyByZXR1cm5lZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gbm9kZURhdGEgVGhlIGRhdGEgb2YgdGhlIG5vZGUgdG8gZmluZFxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgbm9kZSBpZiBmb3VuZCwgLTEgb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBmaW5kOiBmdW5jdGlvbiAobm9kZURhdGEpIHtcbiAgICAgICAgICAgIC8vIHN0YXJ0IGF0IHRoZSBoZWFkIG9mIHRoZSBsaXN0XG4gICAgICAgICAgICB0aGlzLml0ZXJhdG9yLnJlc2V0KCk7XG4gICAgICAgICAgICB2YXIgY3VycmVudDtcblxuICAgICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIHRoZSBsaXN0IHVudGlsIHdlIGZpbmQgdGhlIG5vZGUgY29udGFpbmluZyB0aGUgZGF0YVxuICAgICAgICAgICAgLy8gd2UgYXJlIGxvb2tpbmcgZm9yXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5pdGVyYXRvci5oYXNOZXh0KCkpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gdGhpcy5pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzRXF1YWwoY3VycmVudC5nZXREYXRhKCksIG5vZGVEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG9ubHkgZ2V0IGhlcmUgaWYgd2UgZGlkbid0IGZpbmQgYSBub2RlIGNvbnRhaW5pbmcgdGhlIG5vZGVEYXRhXG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIG5vZGUgYXQgdGhlIGxvY2F0aW9uIHByb3ZpZGVkIGJ5IGluZGV4XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG5vZGUgdG8gcmV0dXJuXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBub2RlIGxvY2F0ZWQgYXQgdGhlIGluZGV4IHByb3ZpZGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZmluZEF0OiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIC8vIGlmIGlkeCBpcyBvdXQgb2YgYm91bmRzIG9yIGZuIGNhbGxlZCBvbiBlbXB0eSBsaXN0LCByZXR1cm4gLTFcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSB8fCBpbmRleCA+IHRoaXMuZ2V0U2l6ZSgpIC0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZWxzZSwgbG9vcCB0aHJvdWdoIHRoZSBsaXN0IGFuZCByZXR1cm4gdGhlIG5vZGUgaW4gdGhlXG4gICAgICAgICAgICAvLyBwb3NpdGlvbiBwcm92aWRlZCBieSBpZHguICBBc3N1bWUgemVyby1iYXNlZCBwb3NpdGlvbnMuXG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZ2V0SGVhZE5vZGUoKTtcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IDA7XG5cbiAgICAgICAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgbGlzdCBjb250YWlucyB0aGUgcHJvdmlkZWQgbm9kZURhdGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gbm9kZURhdGEgVGhlIGRhdGEgdG8gY2hlY2sgaWYgdGhlIGxpc3RcbiAgICAgICAgICogICAgICAgIGNvbnRhaW5zXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSB0cnVlIGlmIHRoZSBsaXN0IGNvbnRhaW5zIG5vZGVEYXRhLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgICAgICovXG4gICAgICAgIGNvbnRhaW5zOiBmdW5jdGlvbiAobm9kZURhdGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGV4T2Yobm9kZURhdGEpID4gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIyMjIyMjIyMjIyMjIyMjIyMjIFVUSUxJVFkgbWV0aG9kcyAjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciB0aGUgbGlzdCBhbmQgY2FsbCB0aGUgZm4gcHJvdmlkZWRcbiAgICAgICAgICogb24gZWFjaCBub2RlLCBvciBlbGVtZW50LCBvZiB0aGUgbGlzdFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgb24gZWFjaCBub2RlIG9mIHRoZSBsaXN0XG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gcmV2ZXJzZSBVc2Ugb3Igbm90IHJldmVyc2UgaXRlcmF0aW9uICh0YWlsIHRvIGhlYWQpLCBkZWZhdWx0IHRvIGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBmb3JFYWNoOiBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICAgICAgICAgIHJldmVyc2UgPSByZXZlcnNlIHx8IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZXJhdG9yLnJlc2V0X3JldmVyc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZXJhdG9yLmVhY2hfcmV2ZXJzZShmbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IucmVzZXQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZXJhdG9yLmVhY2goZm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB0aGUgZGF0YSBjb250YWluZWQgaW4gdGhlIGxpc3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2FycmF5fSB0aGUgYXJyYXkgb2YgYWxsIHRoZSBkYXRhIGZyb20gdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgICAgIHRvQXJyYXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBsaXN0QXJyYXkgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGxpc3RBcnJheS5wdXNoKG5vZGUuZ2V0RGF0YSgpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbGlzdEFycmF5O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnRlcnJ1cHRzIGl0ZXJhdGlvbiBvdmVyIHRoZSBsaXN0XG4gICAgICAgICAqL1xuICAgICAgICBpbnRlcnJ1cHRFbnVtZXJhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5pdGVyYXRvci5pbnRlcnJ1cHQoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IERvdWJseUxpbmtlZExpc3Q7XG5cbn0oKSk7XG4iLCIvKipcbiAqIEBmaWxlT3ZlcnZpZXcgSW1wbGVtZW50YXRpb24gb2YgYW4gaXRlcmF0b3IgZm9yIGEgbGlua2VkIGxpc3RcbiAqICAgICAgICAgICAgICAgZGF0YSBzdHJ1Y3R1cmVcbiAqIEBhdXRob3IgSmFzb24gUy4gSm9uZXNcbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogSXRlcmF0b3IgY2xhc3NcbiAgICAgKlxuICAgICAqIFJlcHJlc2VudHMgYW4gaW5zdGFudGlhdGlvbiBvZiBhbiBpdGVyYXRvciB0byBiZSB1c2VkXG4gICAgICogd2l0aGluIGEgbGlua2VkIGxpc3QuICBUaGUgaXRlcmF0b3Igd2lsbCBwcm92aWRlIHRoZSBhYmlsaXR5XG4gICAgICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBub2RlcyBpbiBhIGxpc3QgYnkga2VlcGluZyB0cmFjayBvZiB0aGVcbiAgICAgKiBwb3N0aXRpb24gb2YgYSAnY3VycmVudE5vZGUnLiAgVGhpcyAnY3VycmVudE5vZGUnIHBvaW50ZXJcbiAgICAgKiB3aWxsIGtlZXAgc3RhdGUgdW50aWwgYSByZXNldCgpIG9wZXJhdGlvbiBpcyBjYWxsZWQgYXQgd2hpY2hcbiAgICAgKiB0aW1lIGl0IHdpbGwgcmVzZXQgdG8gcG9pbnQgdGhlIGhlYWQgb2YgdGhlIGxpc3QuXG4gICAgICpcbiAgICAgKiBFdmVuIHRob3VnaCB0aGlzIGl0ZXJhdG9yIGNsYXNzIGlzIGluZXh0cmljYWJseSBsaW5rZWRcbiAgICAgKiAobm8gcHVuIGludGVuZGVkKSB0byBhIGxpbmtlZCBsaXN0IGluc3RhdGlhdGlvbiwgaXQgd2FzIHJlbW92ZWRcbiAgICAgKiBmcm9tIHdpdGhpbiB0aGUgbGlua2VkIGxpc3QgY29kZSB0byBhZGhlcmUgdG8gdGhlIGJlc3QgcHJhY3RpY2VcbiAgICAgKiBvZiBzZXBhcmF0aW9uIG9mIGNvbmNlcm5zLlxuICAgICAqXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaXRlcmF0b3IgaW5zdGFuY2UgdG8gaXRlcmF0ZSBvdmVyIHRoZSBsaW5rZWQgbGlzdCBwcm92aWRlZC5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0aGVMaXN0IHRoZSBsaW5rZWQgbGlzdCB0byBpdGVyYXRlIG92ZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBJdGVyYXRvcih0aGVMaXN0KSB7XG4gICAgICAgIHRoaXMubGlzdCA9IHRoZUxpc3QgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5zdG9wSXRlcmF0aW9uRmxhZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIGEgcG9pbnRlciB0aGUgY3VycmVudCBub2RlIGluIHRoZSBsaXN0IHRoYXQgd2lsbCBiZSByZXR1cm5lZC5cbiAgICAgICAgLy8gaW5pdGlhbGx5IHRoaXMgd2lsbCBiZSBudWxsIHNpbmNlIHRoZSAnbGlzdCcgd2lsbCBiZSBlbXB0eVxuICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiBGdW5jdGlvbnMgYXR0YWNoZWQgdG8gdGhlIEl0ZXJhdG9yIHByb3RvdHlwZS4gIEFsbCBpdGVyYXRvciBpbnN0YW5jZXNcbiAgICAgKiB3aWxsIHNoYXJlIHRoZXNlIG1ldGhvZHMsIG1lYW5pbmcgdGhlcmUgd2lsbCBOT1QgYmUgY29waWVzIG1hZGUgZm9yIGVhY2hcbiAgICAgKiBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBJdGVyYXRvci5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIG5leHQgbm9kZSBpbiB0aGUgaXRlcmF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSB0aGUgbmV4dCBub2RlIGluIHRoZSBpdGVyYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMuY3VycmVudE5vZGU7XG4gICAgICAgICAgICAvLyBhIGNoZWNrIHRvIHByZXZlbnQgZXJyb3IgaWYgcmFuZG9tbHkgY2FsbGluZyBuZXh0KCkgd2hlblxuICAgICAgICAgICAgLy8gaXRlcmF0b3IgaXMgYXQgdGhlIGVuZCBvZiB0aGUgbGlzdCwgbWVhaW5pbmcgdGhlIGN1cnJlbnROb2RlXG4gICAgICAgICAgICAvLyB3aWxsIGJlIHBvaW50aW5nIHRvIG51bGwuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gV2hlbiB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCwgaXQgd2lsbCByZXR1cm4gdGhlIG5vZGUgY3VycmVudGx5XG4gICAgICAgICAgICAvLyBhc3NpZ25lZCB0byB0aGlzLmN1cnJlbnROb2RlIGFuZCBtb3ZlIHRoZSBwb2ludGVyIHRvIHRoZSBuZXh0XG4gICAgICAgICAgICAvLyBub2RlIGluIHRoZSBsaXN0IChpZiBpdCBleGlzdHMpXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Tm9kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSB0aGlzLmN1cnJlbnROb2RlLm5leHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBpdGVyYXRvciBoYXMgYSBub2RlIHRvIHJldHVyblxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBpdGVyYXRvciBoYXMgYSBub2RlIHRvIHJldHVybiwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBoYXNOZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50Tm9kZSAhPT0gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzZXRzIHRoZSBpdGVyYXRvciB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBsaXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSB0aGlzLmxpc3QuZ2V0SGVhZE5vZGUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgZmlyc3Qgbm9kZSBpbiB0aGUgbGlzdCBhbmQgbW92ZXMgdGhlIGl0ZXJhdG9yIHRvXG4gICAgICAgICAqIHBvaW50IHRvIHRoZSBzZWNvbmQgbm9kZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMgdGhlIGZpcnN0IG5vZGUgaW4gdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgICAgIGZpcnN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0aGVMaXN0IHRoZSBsaW5rZWQgbGlzdCB0byBpdGVyYXRlIG92ZXJcbiAgICAgICAgICovXG4gICAgICAgIHNldExpc3Q6IGZ1bmN0aW9uICh0aGVMaXN0KSB7XG4gICAgICAgICAgICB0aGlzLmxpc3QgPSB0aGVMaXN0O1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJdGVyYXRlcyBvdmVyIGFsbCBub2RlcyBpbiB0aGUgbGlzdCBhbmQgY2FsbHMgdGhlIHByb3ZpZGVkIGNhbGxiYWNrXG4gICAgICAgICAqIGZ1bmN0aW9uIHdpdGggZWFjaCBub2RlIGFzIGFuIGFyZ3VtZW50LlxuICAgICAgICAgKiBJdGVyYXRpb24gd2lsbCBicmVhayBpZiBpbnRlcnJ1cHQoKSBpcyBjYWxsZWRcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aXRoXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgIGVhY2ggbm9kZSBvZiB0aGUgbGlzdCBhcyBhbiBhcmdcbiAgICAgICAgICovXG4gICAgICAgIGVhY2g6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgdmFyIGVsO1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMuaGFzTmV4dCgpICYmICF0aGlzLnN0b3BJdGVyYXRpb25GbGFnKSB7XG4gICAgICAgICAgICAgICAgZWwgPSB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0b3BJdGVyYXRpb25GbGFnID0gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLypcbiAgICAgICAgICogIyMjIFJFVkVSU0UgSVRFUkFUSU9OIChUQUlMIC0+IEhFQUQpICMjI1xuICAgICAgICAgKi9cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgZmlyc3Qgbm9kZSBpbiB0aGUgbGlzdCBhbmQgbW92ZXMgdGhlIGl0ZXJhdG9yIHRvXG4gICAgICAgICAqIHBvaW50IHRvIHRoZSBzZWNvbmQgbm9kZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMgdGhlIGZpcnN0IG5vZGUgaW4gdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgICAgIGxhc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRfcmV2ZXJzZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dF9yZXZlcnNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc2V0cyB0aGUgaXRlcmF0b3IgdG8gdGhlIHRhaWwgb2YgdGhlIGxpc3QuXG4gICAgICAgICAqL1xuICAgICAgICByZXNldF9yZXZlcnNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gdGhpcy5saXN0LmdldFRhaWxOb2RlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIG5leHQgbm9kZSBpbiB0aGUgaXRlcmF0aW9uLCB3aGVuIGl0ZXJhdGluZyBmcm9tIHRhaWwgdG8gaGVhZFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSB0aGUgbmV4dCBub2RlIGluIHRoZSBpdGVyYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICBuZXh0X3JldmVyc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5jdXJyZW50Tm9kZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnROb2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IHRoaXMuY3VycmVudE5vZGUucHJldjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEl0ZXJhdGVzIG92ZXIgYWxsIG5vZGVzIGluIHRoZSBsaXN0IGFuZCBjYWxscyB0aGUgcHJvdmlkZWQgY2FsbGJhY2tcbiAgICAgICAgICogZnVuY3Rpb24gd2l0aCBlYWNoIG5vZGUgYXMgYW4gYXJndW1lbnQsXG4gICAgICAgICAqIHN0YXJ0aW5nIGZyb20gdGhlIHRhaWwgYW5kIGdvaW5nIHRvd2FyZHMgdGhlIGhlYWQuXG4gICAgICAgICAqIFRoZSBpdGVyYXRpb24gd2lsbCBicmVhayBpZiBpbnRlcnJ1cHQoKSBpcyBjYWxsZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2l0aGluXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICBlYWNoIG5vZGUgYXMgYW4gYXJnXG4gICAgICAgICAqL1xuICAgICAgICBlYWNoX3JldmVyc2U6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5yZXNldF9yZXZlcnNlKCk7XG4gICAgICAgICAgICB2YXIgZWw7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5oYXNOZXh0KCkgJiYgIXRoaXMuc3RvcEl0ZXJhdGlvbkZsYWcpIHtcbiAgICAgICAgICAgICAgICBlbCA9IHRoaXMubmV4dF9yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdG9wSXRlcmF0aW9uRmxhZyA9IGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qXG4gICAgICAgICAqICMjIyBJTlRFUlJVUFQgSVRFUkFUSU9OICMjI1xuICAgICAgICAgKi9cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmFpc2VzIGludGVycnVwdCBmbGFnICh0aGF0IHdpbGwgc3RvcCBlYWNoKCkgb3IgZWFjaF9yZXZlcnNlKCkpXG4gICAgICAgICAqL1xuXG4gICAgICAgIGludGVycnVwdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wSXRlcmF0aW9uRmxhZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBJdGVyYXRvcjtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogTGlua2VkIGxpc3Qgbm9kZSBjbGFzc1xuICAgICAqXG4gICAgICogSW50ZXJuYWwgcHJpdmF0ZSBjbGFzcyB0byByZXByZXNlbnQgYSBub2RlIHdpdGhpblxuICAgICAqIGEgbGlua2VkIGxpc3QuICBFYWNoIG5vZGUgaGFzIGEgJ2RhdGEnIHByb3BlcnR5IGFuZFxuICAgICAqIGEgcG9pbnRlciB0aGUgcHJldmlvdXMgbm9kZSBhbmQgdGhlIG5leHQgbm9kZSBpbiB0aGUgbGlzdC5cbiAgICAgKlxuICAgICAqIFNpbmNlIHRoZSAnTm9kZScgZnVuY3Rpb24gaXMgbm90IGFzc2lnbmVkIHRvXG4gICAgICogbW9kdWxlLmV4cG9ydHMgaXQgaXMgbm90IHZpc2libGUgb3V0c2lkZSBvZiB0aGlzXG4gICAgICogZmlsZSwgdGhlcmVmb3JlLCBpdCBpcyBwcml2YXRlIHRvIHRoZSBMaW5rZWRMaXN0XG4gICAgICogY2xhc3MuXG4gICAgICpcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5vZGUgb2JqZWN0IHdpdGggYSBkYXRhIHByb3BlcnR5IGFuZCBwb2ludGVyXG4gICAgICogdG8gdGhlIG5leHQgbm9kZVxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtvYmplY3R8bnVtYmVyfHN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBpbml0aWFsaXplIHdpdGggdGhlIG5vZGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBOb2RlKGRhdGEpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgdGhpcy5uZXh0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5wcmV2ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiBGdW5jdGlvbnMgYXR0YWNoZWQgdG8gdGhlIE5vZGUgcHJvdG90eXBlLiAgQWxsIG5vZGUgaW5zdGFuY2VzIHdpbGxcbiAgICAgKiBzaGFyZSB0aGVzZSBtZXRob2RzLCBtZWFuaW5nIHRoZXJlIHdpbGwgTk9UIGJlIGNvcGllcyBtYWRlIGZvciBlYWNoXG4gICAgICogaW5zdGFuY2UuICBUaGlzIHdpbGwgYmUgYSBodWdlIG1lbW9yeSBzYXZpbmdzIHNpbmNlIHRoZXJlIHdpbGwgbGlrZWx5XG4gICAgICogYmUgYSBsYXJnZSBudW1iZXIgb2YgaW5kaXZpZHVhbCBub2Rlcy5cbiAgICAgKi9cbiAgICBOb2RlLnByb3RvdHlwZSA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgbm9kZSBoYXMgYSBwb2ludGVyIHRvIHRoZSBuZXh0IG5vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlcmUgaXMgYSBuZXh0IG5vZGU7IGZhbHNlIG90aGVyd2lzZVxuICAgICAgICAgKi9cbiAgICAgICAgaGFzTmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLm5leHQgIT09IG51bGwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBub2RlIGhhcyBhIHBvaW50ZXIgdG8gdGhlIHByZXZpb3VzIG5vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlcmUgaXMgYSBwcmV2aW91cyBub2RlOyBmYWxzZSBvdGhlcndpc2VcbiAgICAgICAgICovXG4gICAgICAgIGhhc1ByZXY6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5wcmV2ICE9PSBudWxsKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgZGF0YSBvZiB0aGUgdGhlIG5vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge29iamVjdHxzdHJpbmd8bnVtYmVyfSB0aGUgZGF0YSBvZiB0aGUgbm9kZVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbmF0aW9uIG9mIHRoZSBub2RlLiAgSWYgdGhlIGRhdGEgaXMgYW5cbiAgICAgICAgICogb2JqZWN0LCBpdCByZXR1cm5zIHRoZSBKU09OLnN0cmluZ2lmeSB2ZXJzaW9uIG9mIHRoZSBvYmplY3QuXG4gICAgICAgICAqIE90aGVyd2lzZSwgaXQgc2ltcGx5IHJldHVybnMgdGhlIGRhdGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgc3RyaW5nIHJlcHJlc2VuYXRpb24gb2YgdGhlIG5vZGUgZGF0YVxuICAgICAgICAgKi9cbiAgICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5kYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKHRoaXMuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBOb2RlO1xuXG59KCkpO1xuIiwiLyoqXG4gKiBMb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBKUyBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanMuZm91bmRhdGlvbi8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNUeXBlZEFycmF5ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5maWx0ZXJgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlGaWx0ZXIoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmVzdWx0W3Jlc0luZGV4KytdID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uc29tZWAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbnkgZWxlbWVudCBwYXNzZXMgdGhlIHByZWRpY2F0ZSBjaGVjayxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5U29tZShhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGBjYWNoZWAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGNhY2hlIFRoZSBjYWNoZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBjYWNoZUhhcyhjYWNoZSwga2V5KSB7XG4gIHJldHVybiBjYWNoZS5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbi8qKlxuICogQ29udmVydHMgYG1hcGAgdG8gaXRzIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGtleS12YWx1ZSBwYWlycy5cbiAqL1xuZnVuY3Rpb24gbWFwVG9BcnJheShtYXApIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShtYXAuc2l6ZSk7XG5cbiAgbWFwLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IFtrZXksIHZhbHVlXTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBzZXRgIHRvIGFuIGFycmF5IG9mIGl0cyB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHNldFRvQXJyYXkoc2V0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoc2V0LnNpemUpO1xuXG4gIHNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSxcbiAgICBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWV0aG9kcyBtYXNxdWVyYWRpbmcgYXMgbmF0aXZlLiAqL1xudmFyIG1hc2tTcmNLZXkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB1aWQgPSAvW14uXSskLy5leGVjKGNvcmVKc0RhdGEgJiYgY29yZUpzRGF0YS5rZXlzICYmIGNvcmVKc0RhdGEua2V5cy5JRV9QUk9UTyB8fCAnJyk7XG4gIHJldHVybiB1aWQgPyAoJ1N5bWJvbChzcmMpXzEuJyArIHVpZCkgOiAnJztcbn0oKSk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgU3ltYm9sID0gcm9vdC5TeW1ib2wsXG4gICAgVWludDhBcnJheSA9IHJvb3QuVWludDhBcnJheSxcbiAgICBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlLFxuICAgIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlLFxuICAgIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMsXG4gICAgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBEYXRhVmlldyA9IGdldE5hdGl2ZShyb290LCAnRGF0YVZpZXcnKSxcbiAgICBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpLFxuICAgIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKSxcbiAgICBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpLFxuICAgIFdlYWtNYXAgPSBnZXROYXRpdmUocm9vdCwgJ1dlYWtNYXAnKSxcbiAgICBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIEhhc2hcbiAqL1xuZnVuY3Rpb24gaGFzaENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDoge307XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBsaXN0IGNhY2hlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTGlzdENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IFtdO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGdldE1hcERhdGEodGhpcywga2V5KVsnZGVsZXRlJ10oa2V5KTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGdldE1hcERhdGEodGhpcywga2V5KSxcbiAgICAgIHNpemUgPSBkYXRhLnNpemU7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSArPSBkYXRhLnNpemUgPT0gc2l6ZSA/IDAgOiAxO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbi8qKlxuICpcbiAqIENyZWF0ZXMgYW4gYXJyYXkgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIHVuaXF1ZSB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU2V0Q2FjaGUodmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzID09IG51bGwgPyAwIDogdmFsdWVzLmxlbmd0aDtcblxuICB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHRoaXMuYWRkKHZhbHVlc1tpbmRleF0pO1xuICB9XG59XG5cbi8qKlxuICogQWRkcyBgdmFsdWVgIHRvIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgYWRkXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBhbGlhcyBwdXNoXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjYWNoZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUFkZCh2YWx1ZSkge1xuICB0aGlzLl9fZGF0YV9fLnNldCh2YWx1ZSwgSEFTSF9VTkRFRklORUQpO1xuICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBpbiB0aGUgYXJyYXkgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUhhcyh2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXModmFsdWUpO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU2V0Q2FjaGVgLlxuU2V0Q2FjaGUucHJvdG90eXBlLmFkZCA9IFNldENhY2hlLnByb3RvdHlwZS5wdXNoID0gc2V0Q2FjaGVBZGQ7XG5TZXRDYWNoZS5wcm90b3R5cGUuaGFzID0gc2V0Q2FjaGVIYXM7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZShlbnRyaWVzKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0RlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgcmVzdWx0ID0gZGF0YVsnZGVsZXRlJ10oa2V5KTtcblxuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBzdGFjayB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrSGFzKGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBzdGFjayBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBzdGFjayBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgTGlzdENhY2hlKSB7XG4gICAgdmFyIHBhaXJzID0gZGF0YS5fX2RhdGFfXztcbiAgICBpZiAoIU1hcCB8fCAocGFpcnMubGVuZ3RoIDwgTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB0aGlzLnNpemUgPSArK2RhdGEuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZShwYWlycyk7XG4gIH1cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldEFsbEtleXNgIGFuZCBgZ2V0QWxsS2V5c0luYCB3aGljaCB1c2VzXG4gKiBga2V5c0Z1bmNgIGFuZCBgc3ltYm9sc0Z1bmNgIHRvIGdldCB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzeW1ib2xzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzRnVuYywgc3ltYm9sc0Z1bmMpIHtcbiAgdmFyIHJlc3VsdCA9IGtleXNGdW5jKG9iamVjdCk7XG4gIHJldHVybiBpc0FycmF5KG9iamVjdCkgPyByZXN1bHQgOiBhcnJheVB1c2gocmVzdWx0LCBzeW1ib2xzRnVuYyhvYmplY3QpKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzRXF1YWxgIHdoaWNoIHN1cHBvcnRzIHBhcnRpYWwgY29tcGFyaXNvbnNcbiAqIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtib29sZWFufSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogIDEgLSBVbm9yZGVyZWQgY29tcGFyaXNvblxuICogIDIgLSBQYXJ0aWFsIGNvbXBhcmlzb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgdmFsdWVgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIGlmICh2YWx1ZSA9PT0gb3RoZXIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBvdGhlciA9PSBudWxsIHx8ICghaXNPYmplY3RMaWtlKHZhbHVlKSAmJiAhaXNPYmplY3RMaWtlKG90aGVyKSkpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcjtcbiAgfVxuICByZXR1cm4gYmFzZUlzRXF1YWxEZWVwKHZhbHVlLCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgYmFzZUlzRXF1YWwsIHN0YWNrKTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsYCBmb3IgYXJyYXlzIGFuZCBvYmplY3RzIHdoaWNoIHBlcmZvcm1zXG4gKiBkZWVwIGNvbXBhcmlzb25zIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIGNvbXBhcmVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbERlZXAob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgb2JqSXNBcnIgPSBpc0FycmF5KG9iamVjdCksXG4gICAgICBvdGhJc0FyciA9IGlzQXJyYXkob3RoZXIpLFxuICAgICAgb2JqVGFnID0gb2JqSXNBcnIgPyBhcnJheVRhZyA6IGdldFRhZyhvYmplY3QpLFxuICAgICAgb3RoVGFnID0gb3RoSXNBcnIgPyBhcnJheVRhZyA6IGdldFRhZyhvdGhlcik7XG5cbiAgb2JqVGFnID0gb2JqVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvYmpUYWc7XG4gIG90aFRhZyA9IG90aFRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb3RoVGFnO1xuXG4gIHZhciBvYmpJc09iaiA9IG9ialRhZyA9PSBvYmplY3RUYWcsXG4gICAgICBvdGhJc09iaiA9IG90aFRhZyA9PSBvYmplY3RUYWcsXG4gICAgICBpc1NhbWVUYWcgPSBvYmpUYWcgPT0gb3RoVGFnO1xuXG4gIGlmIChpc1NhbWVUYWcgJiYgaXNCdWZmZXIob2JqZWN0KSkge1xuICAgIGlmICghaXNCdWZmZXIob3RoZXIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIG9iaklzQXJyID0gdHJ1ZTtcbiAgICBvYmpJc09iaiA9IGZhbHNlO1xuICB9XG4gIGlmIChpc1NhbWVUYWcgJiYgIW9iaklzT2JqKSB7XG4gICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICByZXR1cm4gKG9iaklzQXJyIHx8IGlzVHlwZWRBcnJheShvYmplY3QpKVxuICAgICAgPyBlcXVhbEFycmF5cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKVxuICAgICAgOiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIG9ialRhZywgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG4gIH1cbiAgaWYgKCEoYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHKSkge1xuICAgIHZhciBvYmpJc1dyYXBwZWQgPSBvYmpJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgJ19fd3JhcHBlZF9fJyksXG4gICAgICAgIG90aElzV3JhcHBlZCA9IG90aElzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsICdfX3dyYXBwZWRfXycpO1xuXG4gICAgaWYgKG9iaklzV3JhcHBlZCB8fCBvdGhJc1dyYXBwZWQpIHtcbiAgICAgIHZhciBvYmpVbndyYXBwZWQgPSBvYmpJc1dyYXBwZWQgPyBvYmplY3QudmFsdWUoKSA6IG9iamVjdCxcbiAgICAgICAgICBvdGhVbndyYXBwZWQgPSBvdGhJc1dyYXBwZWQgPyBvdGhlci52YWx1ZSgpIDogb3RoZXI7XG5cbiAgICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgICByZXR1cm4gZXF1YWxGdW5jKG9ialVud3JhcHBlZCwgb3RoVW53cmFwcGVkLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgfVxuICB9XG4gIGlmICghaXNTYW1lVGFnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gIHJldHVybiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IGlzRnVuY3Rpb24odmFsdWUpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgYXJyYXlzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0FycmF5fSBvdGhlciBUaGUgb3RoZXIgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYGFycmF5YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcnJheXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxBcnJheXMoYXJyYXksIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcsXG4gICAgICBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBvdGhlci5sZW5ndGg7XG5cbiAgaWYgKGFyckxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIShpc1BhcnRpYWwgJiYgb3RoTGVuZ3RoID4gYXJyTGVuZ3RoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KGFycmF5KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gdHJ1ZSxcbiAgICAgIHNlZW4gPSAoYml0bWFzayAmIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcpID8gbmV3IFNldENhY2hlIDogdW5kZWZpbmVkO1xuXG4gIHN0YWNrLnNldChhcnJheSwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIGFycmF5KTtcblxuICAvLyBJZ25vcmUgbm9uLWluZGV4IHByb3BlcnRpZXMuXG4gIHdoaWxlICgrK2luZGV4IDwgYXJyTGVuZ3RoKSB7XG4gICAgdmFyIGFyclZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2luZGV4XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBhcnJWYWx1ZSwgaW5kZXgsIG90aGVyLCBhcnJheSwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihhcnJWYWx1ZSwgb3RoVmFsdWUsIGluZGV4LCBhcnJheSwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgaWYgKGNvbXBhcmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChjb21wYXJlZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKHNlZW4pIHtcbiAgICAgIGlmICghYXJyYXlTb21lKG90aGVyLCBmdW5jdGlvbihvdGhWYWx1ZSwgb3RoSW5kZXgpIHtcbiAgICAgICAgICAgIGlmICghY2FjaGVIYXMoc2Vlbiwgb3RoSW5kZXgpICYmXG4gICAgICAgICAgICAgICAgKGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWVuLnB1c2gob3RoSW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKSB7XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCEoXG4gICAgICAgICAgYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8XG4gICAgICAgICAgICBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaylcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKGFycmF5KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGNvbXBhcmluZyBvYmplY3RzIG9mXG4gKiB0aGUgc2FtZSBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY29tcGFyaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3RzIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCB0YWcsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGRhdGFWaWV3VGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgIChvYmplY3QuYnl0ZU9mZnNldCAhPSBvdGhlci5ieXRlT2Zmc2V0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBvYmplY3QuYnVmZmVyO1xuICAgICAgb3RoZXIgPSBvdGhlci5idWZmZXI7XG5cbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgICFlcXVhbEZ1bmMobmV3IFVpbnQ4QXJyYXkob2JqZWN0KSwgbmV3IFVpbnQ4QXJyYXkob3RoZXIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgICAvLyBDb2VyY2UgYm9vbGVhbnMgdG8gYDFgIG9yIGAwYCBhbmQgZGF0ZXMgdG8gbWlsbGlzZWNvbmRzLlxuICAgICAgLy8gSW52YWxpZCBkYXRlcyBhcmUgY29lcmNlZCB0byBgTmFOYC5cbiAgICAgIHJldHVybiBlcSgrb2JqZWN0LCArb3RoZXIpO1xuXG4gICAgY2FzZSBlcnJvclRhZzpcbiAgICAgIHJldHVybiBvYmplY3QubmFtZSA9PSBvdGhlci5uYW1lICYmIG9iamVjdC5tZXNzYWdlID09IG90aGVyLm1lc3NhZ2U7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIC8vIENvZXJjZSByZWdleGVzIHRvIHN0cmluZ3MgYW5kIHRyZWF0IHN0cmluZ3MsIHByaW1pdGl2ZXMgYW5kIG9iamVjdHMsXG4gICAgICAvLyBhcyBlcXVhbC4gU2VlIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1yZWdleHAucHJvdG90eXBlLnRvc3RyaW5nXG4gICAgICAvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgcmV0dXJuIG9iamVjdCA9PSAob3RoZXIgKyAnJyk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHZhciBjb252ZXJ0ID0gbWFwVG9BcnJheTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRztcbiAgICAgIGNvbnZlcnQgfHwgKGNvbnZlcnQgPSBzZXRUb0FycmF5KTtcblxuICAgICAgaWYgKG9iamVjdC5zaXplICE9IG90aGVyLnNpemUgJiYgIWlzUGFydGlhbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gICAgICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICAgICAgaWYgKHN0YWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gICAgICB9XG4gICAgICBiaXRtYXNrIHw9IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUc7XG5cbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICAgICAgdmFyIHJlc3VsdCA9IGVxdWFsQXJyYXlzKGNvbnZlcnQob2JqZWN0KSwgY29udmVydChvdGhlciksIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xuICAgICAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICBpZiAoc3ltYm9sVmFsdWVPZikge1xuICAgICAgICByZXR1cm4gc3ltYm9sVmFsdWVPZi5jYWxsKG9iamVjdCkgPT0gc3ltYm9sVmFsdWVPZi5jYWxsKG90aGVyKTtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBvYmplY3RzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcsXG4gICAgICBvYmpQcm9wcyA9IGdldEFsbEtleXMob2JqZWN0KSxcbiAgICAgIG9iakxlbmd0aCA9IG9ialByb3BzLmxlbmd0aCxcbiAgICAgIG90aFByb3BzID0gZ2V0QWxsS2V5cyhvdGhlciksXG4gICAgICBvdGhMZW5ndGggPSBvdGhQcm9wcy5sZW5ndGg7XG5cbiAgaWYgKG9iakxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIWlzUGFydGlhbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgaW5kZXggPSBvYmpMZW5ndGg7XG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgdmFyIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICBpZiAoIShpc1BhcnRpYWwgPyBrZXkgaW4gb3RoZXIgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCBrZXkpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KG9iamVjdCk7XG4gIGlmIChzdGFja2VkICYmIHN0YWNrLmdldChvdGhlcikpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIG9iamVjdCk7XG5cbiAgdmFyIHNraXBDdG9yID0gaXNQYXJ0aWFsO1xuICB3aGlsZSAoKytpbmRleCA8IG9iakxlbmd0aCkge1xuICAgIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltrZXldO1xuXG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHZhciBjb21wYXJlZCA9IGlzUGFydGlhbFxuICAgICAgICA/IGN1c3RvbWl6ZXIob3RoVmFsdWUsIG9ialZhbHVlLCBrZXksIG90aGVyLCBvYmplY3QsIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIob2JqVmFsdWUsIG90aFZhbHVlLCBrZXksIG9iamVjdCwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKCEoY29tcGFyZWQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gKG9ialZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMob2JqVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpXG4gICAgICAgICAgOiBjb21wYXJlZFxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBza2lwQ3RvciB8fCAoc2tpcEN0b3IgPSBrZXkgPT0gJ2NvbnN0cnVjdG9yJyk7XG4gIH1cbiAgaWYgKHJlc3VsdCAmJiAhc2tpcEN0b3IpIHtcbiAgICB2YXIgb2JqQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgICAgb3RoQ3RvciA9IG90aGVyLmNvbnN0cnVjdG9yO1xuXG4gICAgLy8gTm9uIGBPYmplY3RgIG9iamVjdCBpbnN0YW5jZXMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1YWwuXG4gICAgaWYgKG9iakN0b3IgIT0gb3RoQ3RvciAmJlxuICAgICAgICAoJ2NvbnN0cnVjdG9yJyBpbiBvYmplY3QgJiYgJ2NvbnN0cnVjdG9yJyBpbiBvdGhlcikgJiZcbiAgICAgICAgISh0eXBlb2Ygb2JqQ3RvciA9PSAnZnVuY3Rpb24nICYmIG9iakN0b3IgaW5zdGFuY2VvZiBvYmpDdG9yICYmXG4gICAgICAgICAgdHlwZW9mIG90aEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvdGhDdG9yIGluc3RhbmNlb2Ygb3RoQ3RvcikpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzLCBnZXRTeW1ib2xzKTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHMgPSAhbmF0aXZlR2V0U3ltYm9scyA/IHN0dWJBcnJheSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIHJldHVybiBhcnJheUZpbHRlcihuYXRpdmVHZXRTeW1ib2xzKG9iamVjdCksIGZ1bmN0aW9uKHN5bWJvbCkge1xuICAgIHJldHVybiBwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKG9iamVjdCwgc3ltYm9sKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIEdldHMgdGhlIGB0b1N0cmluZ1RhZ2Agb2YgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG52YXIgZ2V0VGFnID0gYmFzZUdldFRhZztcblxuLy8gRmFsbGJhY2sgZm9yIGRhdGEgdmlld3MsIG1hcHMsIHNldHMsIGFuZCB3ZWFrIG1hcHMgaW4gSUUgMTEgYW5kIHByb21pc2VzIGluIE5vZGUuanMgPCA2LlxuaWYgKChEYXRhVmlldyAmJiBnZXRUYWcobmV3IERhdGFWaWV3KG5ldyBBcnJheUJ1ZmZlcigxKSkpICE9IGRhdGFWaWV3VGFnKSB8fFxuICAgIChNYXAgJiYgZ2V0VGFnKG5ldyBNYXApICE9IG1hcFRhZykgfHxcbiAgICAoUHJvbWlzZSAmJiBnZXRUYWcoUHJvbWlzZS5yZXNvbHZlKCkpICE9IHByb21pc2VUYWcpIHx8XG4gICAgKFNldCAmJiBnZXRUYWcobmV3IFNldCkgIT0gc2V0VGFnKSB8fFxuICAgIChXZWFrTWFwICYmIGdldFRhZyhuZXcgV2Vha01hcCkgIT0gd2Vha01hcFRhZykpIHtcbiAgZ2V0VGFnID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUdldFRhZyh2YWx1ZSksXG4gICAgICAgIEN0b3IgPSByZXN1bHQgPT0gb2JqZWN0VGFnID8gdmFsdWUuY29uc3RydWN0b3IgOiB1bmRlZmluZWQsXG4gICAgICAgIGN0b3JTdHJpbmcgPSBDdG9yID8gdG9Tb3VyY2UoQ3RvcikgOiAnJztcblxuICAgIGlmIChjdG9yU3RyaW5nKSB7XG4gICAgICBzd2l0Y2ggKGN0b3JTdHJpbmcpIHtcbiAgICAgICAgY2FzZSBkYXRhVmlld0N0b3JTdHJpbmc6IHJldHVybiBkYXRhVmlld1RhZztcbiAgICAgICAgY2FzZSBtYXBDdG9yU3RyaW5nOiByZXR1cm4gbWFwVGFnO1xuICAgICAgICBjYXNlIHByb21pc2VDdG9yU3RyaW5nOiByZXR1cm4gcHJvbWlzZVRhZztcbiAgICAgICAgY2FzZSBzZXRDdG9yU3RyaW5nOiByZXR1cm4gc2V0VGFnO1xuICAgICAgICBjYXNlIHdlYWtNYXBDdG9yU3RyaW5nOiByZXR1cm4gd2Vha01hcFRhZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSAmJlxuICAgICh2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJylcbiAgICA/ICh2YWx1ZSAhPT0gJ19fcHJvdG9fXycpXG4gICAgOiAodmFsdWUgPT09IG51bGwpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IEJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgVWludDhBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNCdWZmZXIgPSBuYXRpdmVJc0J1ZmZlciB8fCBzdHViRmFsc2U7XG5cbi8qKlxuICogUGVyZm9ybXMgYSBkZWVwIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZVxuICogZXF1aXZhbGVudC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2Qgc3VwcG9ydHMgY29tcGFyaW5nIGFycmF5cywgYXJyYXkgYnVmZmVycywgYm9vbGVhbnMsXG4gKiBkYXRlIG9iamVjdHMsIGVycm9yIG9iamVjdHMsIG1hcHMsIG51bWJlcnMsIGBPYmplY3RgIG9iamVjdHMsIHJlZ2V4ZXMsXG4gKiBzZXRzLCBzdHJpbmdzLCBzeW1ib2xzLCBhbmQgdHlwZWQgYXJyYXlzLiBgT2JqZWN0YCBvYmplY3RzIGFyZSBjb21wYXJlZFxuICogYnkgdGhlaXIgb3duLCBub3QgaW5oZXJpdGVkLCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuIEZ1bmN0aW9ucyBhbmQgRE9NXG4gKiBub2RlcyBhcmUgY29tcGFyZWQgYnkgc3RyaWN0IGVxdWFsaXR5LCBpLmUuIGA9PT1gLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmlzRXF1YWwob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogb2JqZWN0ID09PSBvdGhlcjtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRXF1YWwodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbmZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QpIDogYmFzZUtleXMob2JqZWN0KTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGEgbmV3IGVtcHR5IGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZW1wdHkgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheXMgPSBfLnRpbWVzKDIsIF8uc3R1YkFycmF5KTtcbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXMpO1xuICogLy8gPT4gW1tdLCBbXV1cbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXNbMF0gPT09IGFycmF5c1sxXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBzdHViQXJyYXkoKSB7XG4gIHJldHVybiBbXTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRXF1YWw7XG4iLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3Rvcnkpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyppc3RhbmJ1bCBpZ25vcmUgbmV4dDpjYW50IHRlc3QqL1xuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgIHJvb3Qub2JqZWN0UGF0aCA9IGZhY3RvcnkoKTtcbiAgfVxufSkodGhpcywgZnVuY3Rpb24oKXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIGZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICAgIGlmKG9iaiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgLy90byBoYW5kbGUgb2JqZWN0cyB3aXRoIG51bGwgcHJvdG90eXBlcyAodG9vIGVkZ2UgY2FzZT8pXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApXG4gIH1cblxuICBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKXtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9TdHJpbmcodHlwZSl7XG4gICAgcmV0dXJuIHRvU3RyLmNhbGwodHlwZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc09iamVjdChvYmope1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiB0b1N0cmluZyhvYmopID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xuICB9XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKG9iail7XG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgbmV4dDpjYW50IHRlc3QqL1xuICAgIHJldHVybiB0b1N0ci5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH1cblxuICBmdW5jdGlvbiBpc0Jvb2xlYW4ob2JqKXtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Jvb2xlYW4nIHx8IHRvU3RyaW5nKG9iaikgPT09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEtleShrZXkpe1xuICAgIHZhciBpbnRLZXkgPSBwYXJzZUludChrZXkpO1xuICAgIGlmIChpbnRLZXkudG9TdHJpbmcoKSA9PT0ga2V5KSB7XG4gICAgICByZXR1cm4gaW50S2V5O1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xuICB9XG5cbiAgZnVuY3Rpb24gZmFjdG9yeShvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblxuICAgIHZhciBvYmplY3RQYXRoID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0UGF0aCkucmVkdWNlKGZ1bmN0aW9uKHByb3h5LCBwcm9wKSB7XG4gICAgICAgIGlmKHByb3AgPT09ICdjcmVhdGUnKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgICAgICB9XG5cbiAgICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZWxzZSovXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0UGF0aFtwcm9wXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHByb3h5W3Byb3BdID0gb2JqZWN0UGF0aFtwcm9wXS5iaW5kKG9iamVjdFBhdGgsIG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgICB9LCB7fSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGhhc1NoYWxsb3dQcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgICAgIHJldHVybiAob3B0aW9ucy5pbmNsdWRlSW5oZXJpdGVkUHJvcHMgfHwgKHR5cGVvZiBwcm9wID09PSAnbnVtYmVyJyAmJiBBcnJheS5pc0FycmF5KG9iaikpIHx8IGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2hhbGxvd1Byb3BlcnR5KG9iaiwgcHJvcCkge1xuICAgICAgaWYgKGhhc1NoYWxsb3dQcm9wZXJ0eShvYmosIHByb3ApKSB7XG4gICAgICAgIHJldHVybiBvYmpbcHJvcF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0KG9iaiwgcGF0aCwgdmFsdWUsIGRvTm90UmVwbGFjZSl7XG4gICAgICBpZiAodHlwZW9mIHBhdGggPT09ICdudW1iZXInKSB7XG4gICAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgICB9XG4gICAgICBpZiAoIXBhdGggfHwgcGF0aC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHNldChvYmosIHBhdGguc3BsaXQoJy4nKS5tYXAoZ2V0S2V5KSwgdmFsdWUsIGRvTm90UmVwbGFjZSk7XG4gICAgICB9XG4gICAgICB2YXIgY3VycmVudFBhdGggPSBwYXRoWzBdO1xuICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IGdldFNoYWxsb3dQcm9wZXJ0eShvYmosIGN1cnJlbnRQYXRoKTtcbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAoY3VycmVudFZhbHVlID09PSB2b2lkIDAgfHwgIWRvTm90UmVwbGFjZSkge1xuICAgICAgICAgIG9ialtjdXJyZW50UGF0aF0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3VycmVudFZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudFZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgICAgLy9jaGVjayBpZiB3ZSBhc3N1bWUgYW4gYXJyYXlcbiAgICAgICAgaWYodHlwZW9mIHBhdGhbMV0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgb2JqW2N1cnJlbnRQYXRoXSA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9ialtjdXJyZW50UGF0aF0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2V0KG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSksIHZhbHVlLCBkb05vdFJlcGxhY2UpO1xuICAgIH1cblxuICAgIG9iamVjdFBhdGguaGFzID0gZnVuY3Rpb24gKG9iaiwgcGF0aCkge1xuICAgICAgaWYgKHR5cGVvZiBwYXRoID09PSAnbnVtYmVyJykge1xuICAgICAgICBwYXRoID0gW3BhdGhdO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcGF0aCA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFwYXRoIHx8IHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAhIW9iajtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBqID0gZ2V0S2V5KHBhdGhbaV0pO1xuXG4gICAgICAgIGlmKCh0eXBlb2YgaiA9PT0gJ251bWJlcicgJiYgaXNBcnJheShvYmopICYmIGogPCBvYmoubGVuZ3RoKSB8fFxuICAgICAgICAgIChvcHRpb25zLmluY2x1ZGVJbmhlcml0ZWRQcm9wcyA/IChqIGluIE9iamVjdChvYmopKSA6IGhhc093blByb3BlcnR5KG9iaiwgaikpKSB7XG4gICAgICAgICAgb2JqID0gb2JqW2pdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgb2JqZWN0UGF0aC5lbnN1cmVFeGlzdHMgPSBmdW5jdGlvbiAob2JqLCBwYXRoLCB2YWx1ZSl7XG4gICAgICByZXR1cm4gc2V0KG9iaiwgcGF0aCwgdmFsdWUsIHRydWUpO1xuICAgIH07XG5cbiAgICBvYmplY3RQYXRoLnNldCA9IGZ1bmN0aW9uIChvYmosIHBhdGgsIHZhbHVlLCBkb05vdFJlcGxhY2Upe1xuICAgICAgcmV0dXJuIHNldChvYmosIHBhdGgsIHZhbHVlLCBkb05vdFJlcGxhY2UpO1xuICAgIH07XG5cbiAgICBvYmplY3RQYXRoLmluc2VydCA9IGZ1bmN0aW9uIChvYmosIHBhdGgsIHZhbHVlLCBhdCl7XG4gICAgICB2YXIgYXJyID0gb2JqZWN0UGF0aC5nZXQob2JqLCBwYXRoKTtcbiAgICAgIGF0ID0gfn5hdDtcbiAgICAgIGlmICghaXNBcnJheShhcnIpKSB7XG4gICAgICAgIGFyciA9IFtdO1xuICAgICAgICBvYmplY3RQYXRoLnNldChvYmosIHBhdGgsIGFycik7XG4gICAgICB9XG4gICAgICBhcnIuc3BsaWNlKGF0LCAwLCB2YWx1ZSk7XG4gICAgfTtcblxuICAgIG9iamVjdFBhdGguZW1wdHkgPSBmdW5jdGlvbihvYmosIHBhdGgpIHtcbiAgICAgIGlmIChpc0VtcHR5KHBhdGgpKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9XG4gICAgICBpZiAob2JqID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlLCBpO1xuICAgICAgaWYgKCEodmFsdWUgPSBvYmplY3RQYXRoLmdldChvYmosIHBhdGgpKSkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gb2JqZWN0UGF0aC5zZXQob2JqLCBwYXRoLCAnJyk7XG4gICAgICB9IGVsc2UgaWYgKGlzQm9vbGVhbih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFBhdGguc2V0KG9iaiwgcGF0aCwgZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RQYXRoLnNldChvYmosIHBhdGgsIDApO1xuICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICB2YWx1ZS5sZW5ndGggPSAwO1xuICAgICAgfSBlbHNlIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgZm9yIChpIGluIHZhbHVlKSB7XG4gICAgICAgICAgaWYgKGhhc1NoYWxsb3dQcm9wZXJ0eSh2YWx1ZSwgaSkpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtpXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBvYmplY3RQYXRoLnNldChvYmosIHBhdGgsIG51bGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBvYmplY3RQYXRoLnB1c2ggPSBmdW5jdGlvbiAob2JqLCBwYXRoIC8qLCB2YWx1ZXMgKi8pe1xuICAgICAgdmFyIGFyciA9IG9iamVjdFBhdGguZ2V0KG9iaiwgcGF0aCk7XG4gICAgICBpZiAoIWlzQXJyYXkoYXJyKSkge1xuICAgICAgICBhcnIgPSBbXTtcbiAgICAgICAgb2JqZWN0UGF0aC5zZXQob2JqLCBwYXRoLCBhcnIpO1xuICAgICAgfVxuXG4gICAgICBhcnIucHVzaC5hcHBseShhcnIsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikpO1xuICAgIH07XG5cbiAgICBvYmplY3RQYXRoLmNvYWxlc2NlID0gZnVuY3Rpb24gKG9iaiwgcGF0aHMsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgdmFyIHZhbHVlO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGF0aHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKCh2YWx1ZSA9IG9iamVjdFBhdGguZ2V0KG9iaiwgcGF0aHNbaV0pKSAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfTtcblxuICAgIG9iamVjdFBhdGguZ2V0ID0gZnVuY3Rpb24gKG9iaiwgcGF0aCwgZGVmYXVsdFZhbHVlKXtcbiAgICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcGF0aCA9IFtwYXRoXTtcbiAgICAgIH1cbiAgICAgIGlmICghcGF0aCB8fCBwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuICAgICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RQYXRoLmdldChvYmosIHBhdGguc3BsaXQoJy4nKSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRQYXRoID0gZ2V0S2V5KHBhdGhbMF0pO1xuICAgICAgdmFyIG5leHRPYmogPSBnZXRTaGFsbG93UHJvcGVydHkob2JqLCBjdXJyZW50UGF0aClcbiAgICAgIGlmIChuZXh0T2JqID09PSB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBuZXh0T2JqO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0UGF0aC5nZXQob2JqW2N1cnJlbnRQYXRoXSwgcGF0aC5zbGljZSgxKSwgZGVmYXVsdFZhbHVlKTtcbiAgICB9O1xuXG4gICAgb2JqZWN0UGF0aC5kZWwgPSBmdW5jdGlvbiBkZWwob2JqLCBwYXRoKSB7XG4gICAgICBpZiAodHlwZW9mIHBhdGggPT09ICdudW1iZXInKSB7XG4gICAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmogPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNFbXB0eShwYXRoKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RQYXRoLmRlbChvYmosIHBhdGguc3BsaXQoJy4nKSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50UGF0aCA9IGdldEtleShwYXRoWzBdKTtcbiAgICAgIGlmICghaGFzU2hhbGxvd1Byb3BlcnR5KG9iaiwgY3VycmVudFBhdGgpKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgICBvYmouc3BsaWNlKGN1cnJlbnRQYXRoLCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgb2JqW2N1cnJlbnRQYXRoXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFBhdGguZGVsKG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIHJldHVybiBvYmplY3RQYXRoO1xuICB9XG5cbiAgdmFyIG1vZCA9IGZhY3RvcnkoKTtcbiAgbW9kLmNyZWF0ZSA9IGZhY3Rvcnk7XG4gIG1vZC53aXRoSW5oZXJpdGVkUHJvcHMgPSBmYWN0b3J5KHtpbmNsdWRlSW5oZXJpdGVkUHJvcHM6IHRydWV9KVxuICByZXR1cm4gbW9kO1xufSk7XG4iLCIvLyB1dGlsaXRpZXNcclxudmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG5cclxuZnVuY3Rpb24gRW1pdHRlckVudGl0eShlbWl0dGVyTmFtZSwgZW1pdHRlclRoZW1lLCBwYXJ0aWNsZU9wdHMsIGVtaXRGbikge1xyXG5cclxuICAgIHRoaXMubmFtZSA9IGVtaXR0ZXJOYW1lO1xyXG5cclxuICAgIC8vIGVtaXR0ZXIgZW50aXR5IGNvbmZpZ1xyXG4gICAgdGhpcy5lbWl0dGVyT3B0cyA9IGVtaXR0ZXJUaGVtZTtcclxuICAgIC8vIGVtaXR0ZXIgZW1pc3Npb24gY29uZmlnXHJcbiAgICB0aGlzLmVtaXNzaW9uT3B0cyA9IHRoaXMuZW1pdHRlck9wdHMuZW1pc3Npb247XHJcbiAgICAvLyBlbWl0dGVyIHBhcnRpY2xlIGNvbmZpZ1xyXG4gICAgdGhpcy5wYXJ0aWNsZU9wdHMgPSBwYXJ0aWNsZU9wdHM7XHJcblxyXG4gICAgLy8gc2F2ZXMgZHJpbGxpbmcgZG93blxyXG4gICAgdmFyIGVtaXR0ZXIgPSB0aGlzLmVtaXR0ZXJPcHRzLmVtaXR0ZXI7XHJcbiAgICB2YXIgZW1pc3Npb24gPSB0aGlzLmVtaXNzaW9uT3B0cztcclxuICAgIHZhciBlbWl0UmF0ZSA9IGVtaXNzaW9uLnJhdGU7XHJcbiAgICB2YXIgZW1pdFJlcGVhdCA9IGVtaXNzaW9uLnJlcGVhdGVyO1xyXG5cclxuICAgIC8vIGVtaXR0ZXIgbWFzdGVyIGNsb2NrIGluaXRcclxuICAgIHRoaXMubG9jYWxDbG9jayA9IDA7XHJcbiAgICB0aGlzLmxvY2FsQ2xvY2tSdW5uaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmVtaXRGbiA9IGVtaXRGbjtcclxuICAgIC8vIGVtaXR0ZXIgbGlmZVxyXG4gICAgdGhpcy5hY3RpdmUgPSBlbWl0dGVyLmFjdGl2ZTtcclxuXHJcbiAgICAvLyBlbWl0dGVyIHZlY3RvcnNcclxuICAgIHRoaXMueCA9IGVtaXR0ZXIueDtcclxuICAgIHRoaXMueSA9IGVtaXR0ZXIueTtcclxuICAgIHRoaXMueFZlbCA9IGVtaXR0ZXIueFZlbDtcclxuICAgIHRoaXMueVZlbCA9IGVtaXR0ZXIueVZlbDtcclxuXHJcbiAgICAvLyBlbWl0dGVyIGVudmlyb25tZW50YWwgaW5mbHVlbmNlc1xyXG4gICAgdGhpcy5hcHBseUdsb2JhbEZvcmNlcyA9IGVtaXR0ZXIuYXBwbHlHbG9iYWxGb3JjZXM7XHJcblxyXG4gICAgLy8gZW1pdHRlciBlbWlzc2lvbiBjb25maWdcclxuICAgIC8vIGVtaXNzaW9uIHJhdGVcclxuICAgIHRoaXMucmF0ZU1pbiA9IGVtaXRSYXRlLm1pbjtcclxuICAgIHRoaXMucmF0ZU1heCA9IGVtaXRSYXRlLm1heDtcclxuICAgIHRoaXMucmF0ZURlY2F5ID0gZW1pdFJhdGUuZGVjYXkucmF0ZTtcclxuICAgIHRoaXMucmF0ZURlY2F5TWF4ID0gZW1pdFJhdGUuZGVjYXkuZGVjYXlNYXg7XHJcblxyXG4gICAgLy8gZW1pc3Npb24gcmVwZXRpdGlvblxyXG4gICAgdGhpcy5yZXBlYXRSYXRlID0gZW1pdFJlcGVhdC5yYXRlO1xyXG4gICAgdGhpcy5yZXBlYXREZWNheSA9IGVtaXRSZXBlYXQuZGVjYXkucmF0ZTtcclxuICAgIHRoaXMucmVwZWF0RGVjYXlNYXggPSBlbWl0UmVwZWF0LmRlY2F5LmRlY2F5TWF4O1xyXG4gICAgdGhpcy50cmlnZ2VyVHlwZSA9ICdtb3VzZUNsaWNrRXZlbnQnO1xyXG5cclxuICAgIHRoaXMuaW5pdFZhbHVlcyA9IHtcclxuICAgICAgICByYXRlTWluOiBlbWl0UmF0ZS5taW4sXHJcbiAgICAgICAgcmF0ZU1heDogZW1pdFJhdGUubWF4LFxyXG4gICAgICAgIHJhdGVEZWNheTogZW1pdFJhdGUuZGVjYXkucmF0ZSxcclxuICAgICAgICByYXRlRGVjYXlNYXg6IGVtaXRSYXRlLmRlY2F5LmRlY2F5TWF4LFxyXG4gICAgICAgIHJlcGVhdFJhdGU6IGVtaXRSZXBlYXQucmF0ZSxcclxuICAgICAgICByZXBlYXREZWNheTogZW1pdFJlcGVhdC5kZWNheS5yYXRlLFxyXG4gICAgICAgIHJlcGVhdERlY2F5TWF4OiBlbWl0UmVwZWF0LmRlY2F5LmRlY2F5TWF4XHJcbiAgICB9O1xyXG59XHJcblxyXG5FbWl0dGVyRW50aXR5LnByb3RvdHlwZS5yZXNldEVtaXNzaW9uVmFsdWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHNlbGYucmF0ZU1pbiA9IHNlbGYuaW5pdFZhbHVlcy5yYXRlTWluO1xyXG4gICAgc2VsZi5yYXRlTWF4ID0gc2VsZi5pbml0VmFsdWVzLnJhdGVNYXg7XHJcbiAgICBzZWxmLnJhdGVEZWNheSA9IHNlbGYuaW5pdFZhbHVlcy5yYXRlRGVjYXk7XHJcbiAgICBzZWxmLnJhdGVEZWNheU1heCA9IHNlbGYuaW5pdFZhbHVlcy5yYXRlRGVjYXlNYXg7XHJcbiAgICBzZWxmLnJlcGVhdFJhdGUgPSBzZWxmLmluaXRWYWx1ZXMucmVwZWF0UmF0ZTtcclxuICAgIHNlbGYucmVwZWF0RGVjYXkgPSBzZWxmLmluaXRWYWx1ZXMucmVwZWF0RGVjYXk7XHJcbiAgICBzZWxmLnJlcGVhdERlY2F5TWF4ID0gc2VsZi5pbml0VmFsdWVzLnJlcGVhdERlY2F5TWF4O1xyXG59O1xyXG5cclxuRW1pdHRlckVudGl0eS5wcm90b3R5cGUudXBkYXRlRW1pdHRlciA9IGZ1bmN0aW9uICh1cGRhdGVPcHRzKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdmFyIHVwZGF0ZXMgPSB1cGRhdGVPcHRzIHx8IGZhbHNlO1xyXG4gICAgdmFyIHRyaWdnZXJFbWl0dGVyRmxhZyA9IGZhbHNlO1xyXG5cclxuICAgIGlmICh1cGRhdGVzICE9PSBmYWxzZSkge1xyXG4gICAgICAgIHNlbGYueCA9IHVwZGF0ZXMueDtcclxuICAgICAgICBzZWxmLnkgPSB1cGRhdGVzLnk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi54ICs9IHNlbGYueFZlbDtcclxuICAgIHNlbGYueSArPSBzZWxmLnlWZWw7XHJcblxyXG4gICAgaWYgKHNlbGYuYWN0aXZlID09PSAxKSB7XHJcblxyXG4gICAgICAgIGlmIChzZWxmLnJlcGVhdFJhdGUgPiAwICYmIHNlbGYubG9jYWxDbG9ja1J1bm5pbmcgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWxmLmxvY2FsQ2xvY2sgJSBzZWxmLnJlcGVhdFJhdGUgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXJFbWl0dGVyRmxhZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYucmVwZWF0RGVjYXkgPCBzZWxmLnJlcGVhdERlY2F5TWF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZXBlYXRSYXRlICs9IHNlbGYucmVwZWF0RGVjYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2NhbENsb2NrID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvY2FsQ2xvY2tSdW5uaW5nID09PSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnJhdGVEZWNheSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnJhdGVNaW4gPiBzZWxmLnJhdGVEZWNheU1heCA/IHNlbGYucmF0ZU1pbiAtPSBzZWxmLnJhdGVEZWNheSA6IHNlbGYucmF0ZU1pbiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yYXRlTWF4ID4gc2VsZi5yYXRlRGVjYXlNYXggPyBzZWxmLnJhdGVNYXggLT0gc2VsZi5yYXRlRGVjYXkgOiBzZWxmLnJhdGVNYXggPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlckVtaXR0ZXJGbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYubG9jYWxDbG9jaysrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0cmlnZ2VyRW1pdHRlckZsYWcgPT09IHRydWUpIHtcclxuICAgICAgICBzZWxmLnRyaWdnZXJFbWl0dGVyKHsgeDogc2VsZi54LCB5OiBzZWxmLnkgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5FbWl0dGVyRW50aXR5LnByb3RvdHlwZS50cmlnZ2VyRW1pdHRlciA9IGZ1bmN0aW9uICh0cmlnZ2VyT3B0aW9ucykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHZhciB0aGlzWCwgdGhpc1k7XHJcbiAgICB2YXIgdHJpZ2dlck9wdHMgPSB0cmlnZ2VyT3B0aW9ucyB8fCBmYWxzZTtcclxuICAgIGlmICh0cmlnZ2VyT3B0cyAhPT0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzWCA9IHRyaWdnZXJPcHRzLng7XHJcbiAgICAgICAgdGhpc1kgPSB0cmlnZ2VyT3B0cy55O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzWCA9IHNlbGYueDtcclxuICAgICAgICB0aGlzWSA9IHNlbGYueTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLnggPSB0aGlzWDtcclxuICAgIHNlbGYueSA9IHRoaXNZO1xyXG5cclxuICAgIHNlbGYuYWN0aXZlID0gdHJ1ZTtcclxuICAgIHNlbGYubG9jYWxDbG9ja1J1bm5pbmcgPSB0cnVlO1xyXG5cclxuICAgIHZhciBlbWl0QW1vdW50ID0gbWF0aFV0aWxzLnJhbmRvbUludGVnZXIoc2VsZi5yYXRlTWluLCBzZWxmLnJhdGVNYXgpO1xyXG5cclxuICAgIHNlbGYuZW1pdEZuKHRoaXNYLCB0aGlzWSwgZW1pdEFtb3VudCwgc2VsZi5lbWlzc2lvbk9wdHMsIHNlbGYucGFydGljbGVPcHRzKTtcclxuXHJcbiAgICBpZiAoc2VsZi5yZXBlYXRSYXRlID4gMCkge1xyXG4gICAgICAgIHNlbGYuYWN0aXZlID0gMTtcclxuXHJcbiAgICAgICAgLy8gc2VsZi51cGRhdGVFbWl0dGVyKCB7IHg6IHRoaXNYLCB5OiB0aGlzWSB9ICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5FbWl0dGVyRW50aXR5LnByb3RvdHlwZS5yZW5kZXJFbWl0dGVyID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAncmdiKCAyNTUsIDI1NSwgMjU1ICknO1xyXG4gICAgY29udGV4dC5zdHJva2VXaWR0aCA9IDU7XHJcbiAgICBjb250ZXh0LmxpbmUodGhpcy54LCB0aGlzLnkgLSAxNSwgdGhpcy54LCB0aGlzLnkgKyAxNSwgY29udGV4dCk7XHJcbiAgICBjb250ZXh0LmxpbmUodGhpcy54IC0gMTUsIHRoaXMueSwgdGhpcy54ICsgMTUsIHRoaXMueSwgY29udGV4dCk7XHJcbiAgICBjb250ZXh0LnN0cm9rZUNpcmNsZSh0aGlzLngsIHRoaXMueSwgMTAsIGNvbnRleHQpO1xyXG59O1xyXG5cclxuRW1pdHRlckVudGl0eS5wcm90b3R5cGUua2lsbEVtaXR0ZXIgPSBmdW5jdGlvbiAoKSB7fTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLkVtaXR0ZXJFbnRpdHkgPSBFbWl0dGVyRW50aXR5OyIsInZhciBhbmltYXRpb24gPSB7XHJcbiAgICBzdGF0ZTogZmFsc2UsXHJcbiAgICBjb3VudGVyOiAwLFxyXG4gICAgZHVyYXRpb246IDI0MFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuYW5pbWF0aW9uID0gYW5pbWF0aW9uOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBleHRlbmRzIENhbnZhcyBwcm90b3R5cGUgd2l0aCB1c2VmdWwgZHJhd2luZyBtaXhpbnNcclxuKiBAa2luZCBjb25zdGFudFxyXG4qL1xyXG52YXIgY2FudmFzRHJhd2luZ0FwaSA9IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGU7XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBkcmF3IGNpcmNsZSBBUElcclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIG9yaWdpbiBZIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0gciAtIHJhZGl1cyBvZiBjaXJjbGUuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuY2lyY2xlID0gZnVuY3Rpb24gKHgsIHksIHIsIGNvbnRleHQpIHtcclxuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG5cdGNvbnRleHQuYXJjKHgsIHksIHIsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IGZpbGxlZCBjaXJjbGVcclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIG9yaWdpbiBZIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0gciAtIHJhZGl1cyBvZiBjaXJjbGUuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuZmlsbENpcmNsZSA9IGZ1bmN0aW9uICh4LCB5LCByLCBjb250ZXh0KSB7XHJcblx0Y29udGV4dC5jaXJjbGUoeCwgeSwgciwgY29udGV4dCk7XHJcblx0Y29udGV4dC5maWxsKCk7XHJcblx0Y29udGV4dC5iZWdpblBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IHN0cm9rZWQgY2lyY2xlXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvcmlnaW4gWSBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHIgLSByYWRpdXMgb2YgY2lyY2xlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLnN0cm9rZUNpcmNsZSA9IGZ1bmN0aW9uICh4LCB5LCByLCBjb250ZXh0KSB7XHJcblx0Y29udGV4dC5jaXJjbGUoeCwgeSwgciwgY29udGV4dCk7XHJcblx0Y29udGV4dC5zdHJva2UoKTtcclxuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvZmlnaW4gWSBvciBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB3IC0gd2lkdGggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIGhlaWdodCBvZiBlbGxpcHNlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmVsbGlwc2UgPSBmdW5jdGlvbiAoeCwgeSwgdywgaCwgY29udGV4dCkge1xyXG5cdGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBNYXRoLlBJICogMjsgaSArPSBNYXRoLlBJIC8gMTYpIHtcclxuXHRcdGNvbnRleHQubGluZVRvKHggKyBNYXRoLmNvcyhpKSAqIHcgLyAyLCB5ICsgTWF0aC5zaW4oaSkgKiBoIC8gMik7XHJcblx0fVxyXG5cdGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBmaWxsZWQgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvZmlnaW4gWSBvciBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB3IC0gd2lkdGggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIGhlaWdodCBvZiBlbGxpcHNlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmZpbGxFbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIHcsIGgsIGNvbnRleHQpIHtcclxuXHRjb250ZXh0LmVsbGlwc2UoeCwgeSwgdywgaCwgY29udGV4dCk7XHJcblx0Y29udGV4dC5maWxsKCk7XHJcblx0Y29udGV4dC5iZWdpblBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IHN0cm9rZWQgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvZmlnaW4gWSBvciBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB3IC0gd2lkdGggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIGhlaWdodCBvZiBlbGxpcHNlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLnN0cm9rZUVsbGlwc2UgPSBmdW5jdGlvbiAoeCwgeSwgdywgaCkge1xyXG5cdHRoaXMuZWxsaXBzZSh4LCB5LCB3LCBoKTtcclxuXHR0aGlzLnN0cm9rZSgpO1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBsaW5lIGJldHdlZW4gMiB2ZWN0b3IgY29vcmRpbmF0ZXMuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHgxIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5MSAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuKiBAcGFyYW0ge251bWJlcn0geDIgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkyIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmxpbmUgPSBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIsIGNvbnRleHQpIHtcclxuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG5cdGNvbnRleHQubW92ZVRvKHgxLCB5MSk7XHJcblx0Y29udGV4dC5saW5lVG8oeDIsIHkyKTtcclxuXHRjb250ZXh0LnN0cm9rZSgpO1xyXG5cdGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jYW52YXNEcmF3aW5nQXBpID0gY2FudmFzRHJhd2luZ0FwaTsiLCJ2YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcblxyXG52YXIgY29sb3JVdGlscyA9IHtcclxuXHQvKipcclxuICogcHJvdmlkZXMgY29sb3IgdXRpbCBtZXRob2RzLlxyXG4gKi9cclxuXHRyZ2I6IGZ1bmN0aW9uIHJnYihyZWQsIGdyZWVuLCBibHVlKSB7XHJcblx0XHRyZXR1cm4gJ3JnYignICsgbWF0aFV0aWxzLmNsYW1wKE1hdGgucm91bmQocmVkKSwgMCwgMjU1KSArICcsICcgKyBtYXRoVXRpbHMuY2xhbXAoTWF0aC5yb3VuZChncmVlbiksIDAsIDI1NSkgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKE1hdGgucm91bmQoYmx1ZSksIDAsIDI1NSkgKyAnKSc7XHJcblx0fSxcclxuXHRyZ2JhOiBmdW5jdGlvbiByZ2JhKHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhKSB7XHJcblx0XHRyZXR1cm4gJ3JnYmEoJyArIG1hdGhVdGlscy5jbGFtcChNYXRoLnJvdW5kKHJlZCksIDAsIDI1NSkgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKE1hdGgucm91bmQoZ3JlZW4pLCAwLCAyNTUpICsgJywgJyArIG1hdGhVdGlscy5jbGFtcChNYXRoLnJvdW5kKGJsdWUpLCAwLCAyNTUpICsgJywgJyArIG1hdGhVdGlscy5jbGFtcChhbHBoYSwgMCwgMSkgKyAnKSc7XHJcblx0fSxcclxuXHRoc2w6IGZ1bmN0aW9uIGhzbChodWUsIHNhdHVyYXRpb24sIGxpZ2h0bmVzcykge1xyXG5cdFx0cmV0dXJuICdoc2woJyArIGh1ZSArICcsICcgKyBtYXRoVXRpbHMuY2xhbXAoc2F0dXJhdGlvbiwgMCwgMTAwKSArICclLCAnICsgbWF0aFV0aWxzLmNsYW1wKGxpZ2h0bmVzcywgMCwgMTAwKSArICclKSc7XHJcblx0fSxcclxuXHRoc2xhOiBmdW5jdGlvbiBoc2xhKGh1ZSwgc2F0dXJhdGlvbiwgbGlnaHRuZXNzLCBhbHBoYSkge1xyXG5cdFx0cmV0dXJuICdoc2xhKCcgKyBodWUgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKHNhdHVyYXRpb24sIDAsIDEwMCkgKyAnJSwgJyArIG1hdGhVdGlscy5jbGFtcChsaWdodG5lc3MsIDAsIDEwMCkgKyAnJSwgJyArIG1hdGhVdGlscy5jbGFtcChhbHBoYSwgMCwgMSkgKyAnKSc7XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuY29sb3JVdGlscyA9IGNvbG9yVXRpbHM7IiwidmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG5cclxudmFyIGxhc3RDYWxsZWRUaW1lID0gdm9pZCAwO1xyXG5cclxudmFyIGRlYnVnID0ge1xyXG5cclxuICAgIGhlbHBlcnM6IHtcclxuICAgICAgICBnZXRTdHlsZTogZnVuY3Rpb24gZ2V0U3R5bGUoZWxlbWVudCwgcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSkgOiBlbGVtZW50LnN0eWxlW3Byb3BlcnR5LnJlcGxhY2UoLy0oW2Etel0pL2csIGZ1bmN0aW9uIChnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ1sxXS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgICB9KV07XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbnZlcnRDb2xvcjogZnVuY3Rpb24gaW52ZXJ0Q29sb3IoaGV4LCBidykge1xyXG4gICAgICAgICAgICBpZiAoaGV4LmluZGV4T2YoJyMnKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaGV4ID0gaGV4LnNsaWNlKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnZlcnQgMy1kaWdpdCBoZXggdG8gNi1kaWdpdHMuXHJcbiAgICAgICAgICAgIGlmIChoZXgubGVuZ3RoID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICBoZXggPSBoZXhbMF0gKyBoZXhbMF0gKyBoZXhbMV0gKyBoZXhbMV0gKyBoZXhbMl0gKyBoZXhbMl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGhleC5sZW5ndGggIT09IDYpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBIRVggY29sb3IuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHIgPSBwYXJzZUludChoZXguc2xpY2UoMCwgMiksIDE2KSxcclxuICAgICAgICAgICAgICAgIGcgPSBwYXJzZUludChoZXguc2xpY2UoMiwgNCksIDE2KSxcclxuICAgICAgICAgICAgICAgIGIgPSBwYXJzZUludChoZXguc2xpY2UoNCwgNiksIDE2KTtcclxuICAgICAgICAgICAgaWYgKGJ3KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTQzMDIzLzExMjczMVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHIgKiAwLjI5OSArIGcgKiAwLjU4NyArIGIgKiAwLjExNCA+IDE4NiA/ICcjMDAwMDAwJyA6ICcjRkZGRkZGJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpbnZlcnQgY29sb3IgY29tcG9uZW50c1xyXG4gICAgICAgICAgICByID0gKDI1NSAtIHIpLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgZyA9ICgyNTUgLSBnKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgICAgIGIgPSAoMjU1IC0gYikudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgICAgICAvLyBwYWQgZWFjaCB3aXRoIHplcm9zIGFuZCByZXR1cm5cclxuICAgICAgICAgICAgcmV0dXJuIFwiI1wiICsgcGFkWmVybyhyKSArIHBhZFplcm8oZykgKyBwYWRaZXJvKGIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGRpc3BsYXk6IGZ1bmN0aW9uIGRpc3BsYXkoZGlzcGxheUZsYWcsIG1lc3NhZ2UsIHBhcmFtKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmFsbCA9PT0gdHJ1ZSB8fCBkaXNwbGF5RmxhZyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlLCBwYXJhbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBkZWJ1Z091dHB1dDogZnVuY3Rpb24gZGVidWdPdXRwdXQoY2FudmFzLCBjb250ZXh0LCBsYWJlbCwgcGFyYW0sIG91dHB1dE51bSwgb3V0cHV0Qm91bmRzKSB7XHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICBpZiAob3V0cHV0Qm91bmRzKSB7XHJcbiAgICAgICAgICAgIHZhciB0aGlzUmVkID0gbWF0aFV0aWxzLm1hcChwYXJhbSwgb3V0cHV0Qm91bmRzLm1pbiwgb3V0cHV0Qm91bmRzLm1heCwgMjU1LCAwLCB0cnVlKTtcclxuICAgICAgICAgICAgdmFyIHRoaXNHcmVlbiA9IG1hdGhVdGlscy5tYXAocGFyYW0sIG91dHB1dEJvdW5kcy5taW4sIG91dHB1dEJvdW5kcy5tYXgsIDAsIDI1NSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIC8vIHZhciB0aGlzQmx1ZSA9IG1hdGhVdGlscy5tYXAocGFyYW0sIG91dHB1dEJvdW5kcy5taW4sIG91dHB1dEJvdW5kcy5tYXgsIDAsIDI1NSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHZhciB0aGlzQ29sb3IgPSAncmdiKCAnICsgdGhpc1JlZCArICcsICcgKyB0aGlzR3JlZW4gKyAnLCAwICknO1xyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICdjaGFuZ2luZyBkZWJ1ZyBjb2xvciBvZjogJytwYXJhbSsnIHRvOiAnK3RoaXNDb2xvciApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0aGlzQ29sb3IgPSBcIiNlZmVmZWZcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB2UG9zID0gb3V0cHV0TnVtICogNTAgKyA1MDtcclxuICAgICAgICBjb250ZXh0LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgICAgIGNvbnRleHQuZm9udCA9IFwiMTRwdCBhcmlhbFwiO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpc0NvbG9yO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KGxhYmVsICsgcGFyYW0sIDUwLCB2UG9zKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2FsY3VsYXRlRnBzOiBmdW5jdGlvbiBjYWxjdWxhdGVGcHMoKSB7XHJcbiAgICAgICAgaWYgKCFsYXN0Q2FsbGVkVGltZSkge1xyXG4gICAgICAgICAgICBsYXN0Q2FsbGVkVGltZSA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkZWx0YSA9ICh3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgLSBsYXN0Q2FsbGVkVGltZSkgLyAxMDAwO1xyXG4gICAgICAgIGxhc3RDYWxsZWRUaW1lID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIHJldHVybiAxIC8gZGVsdGE7XHJcbiAgICB9LFxyXG5cclxuICAgIGZsYWdzOiB7XHJcbiAgICAgICAgYWxsOiBmYWxzZSxcclxuICAgICAgICBwYXJ0czoge1xyXG4gICAgICAgICAgICBjbGlja3M6IHRydWUsXHJcbiAgICAgICAgICAgIHJ1bnRpbWU6IHRydWUsXHJcbiAgICAgICAgICAgIHVwZGF0ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGtpbGxDb25kaXRpb25zOiBmYWxzZSxcclxuICAgICAgICAgICAgYW5pbWF0aW9uQ291bnRlcjogZmFsc2UsXHJcbiAgICAgICAgICAgIGVudGl0eVN0b3JlOiBmYWxzZSxcclxuICAgICAgICAgICAgZnBzOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZGVidWcgPSBkZWJ1ZztcclxubW9kdWxlLmV4cG9ydHMubGFzdENhbGxlZFRpbWUgPSBsYXN0Q2FsbGVkVGltZTsiLCIvKlxyXG4gKiBUaGlzIGlzIGEgbmVhci1kaXJlY3QgcG9ydCBvZiBSb2JlcnQgUGVubmVyJ3MgZWFzaW5nIGVxdWF0aW9ucy4gUGxlYXNlIHNob3dlciBSb2JlcnQgd2l0aFxyXG4gKiBwcmFpc2UgYW5kIGFsbCBvZiB5b3VyIGFkbWlyYXRpb24uIEhpcyBsaWNlbnNlIGlzIHByb3ZpZGVkIGJlbG93LlxyXG4gKlxyXG4gKiBGb3IgaW5mb3JtYXRpb24gb24gaG93IHRvIHVzZSB0aGVzZSBmdW5jdGlvbnMgaW4geW91ciBhbmltYXRpb25zLCBjaGVjayBvdXQgbXkgZm9sbG93aW5nIHR1dG9yaWFsOiBcclxuICogaHR0cDovL2JpdC5seS8xOGlISEtxXHJcbiAqXHJcbiAqIC1LaXJ1cGFcclxuICovXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBURVJNUyBPRiBVU0UgLSBFQVNJTkcgRVFVQVRJT05TXHJcbiAqIFxyXG4gKiBPcGVuIHNvdXJjZSB1bmRlciB0aGUgQlNEIExpY2Vuc2UuIFxyXG4gKiBcclxuICogQ29weXJpZ2h0IMKpIDIwMDEgUm9iZXJ0IFBlbm5lclxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiBcclxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbiwgXHJcbiAqIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcclxuICogXHJcbiAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIFxyXG4gKiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXHJcbiAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IFxyXG4gKiBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBcclxuICogcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG4gKiBcclxuICogTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgYXV0aG9yIG5vciB0aGUgbmFtZXMgb2YgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2UgXHJcbiAqIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXHJcbiAqIFxyXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkQgQU5ZIFxyXG4gKiBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0ZcclxuICogTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiAqIENPUFlSSUdIVCBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCxcclxuICogRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFXHJcbiAqIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBcclxuICogQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcclxuICogTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgXHJcbiAqIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS4gXHJcbiAqXHJcbiAqL1xyXG5cclxudmFyIGVhc2luZ0VxdWF0aW9ucyA9IHtcclxuXHQvKipcclxuICogcHJvdmlkZXMgZWFzaW5nIHV0aWwgbWV0aG9kcy5cclxuICovXHJcblx0bGluZWFyRWFzZTogZnVuY3Rpb24gbGluZWFyRWFzZShjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluUXVhZDogZnVuY3Rpb24gZWFzZUluUXVhZChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zKSAqIGN1cnJlbnRJdGVyYXRpb24gKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRRdWFkOiBmdW5jdGlvbiBlYXNlT3V0UXVhZChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiAtY2hhbmdlSW5WYWx1ZSAqIChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgKiAoY3VycmVudEl0ZXJhdGlvbiAtIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiBlYXNlSW5PdXRRdWFkKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBjdXJyZW50SXRlcmF0aW9uICogY3VycmVudEl0ZXJhdGlvbiArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gLWNoYW5nZUluVmFsdWUgLyAyICogKC0tY3VycmVudEl0ZXJhdGlvbiAqIChjdXJyZW50SXRlcmF0aW9uIC0gMikgLSAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluQ3ViaWM6IGZ1bmN0aW9uIGVhc2VJbkN1YmljKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zLCAzKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dEN1YmljOiBmdW5jdGlvbiBlYXNlT3V0Q3ViaWMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSwgMykgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uIGVhc2VJbk91dEN1YmljKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uLCAzKSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAtIDIsIDMpICsgMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJblF1YXJ0OiBmdW5jdGlvbiBlYXNlSW5RdWFydChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucywgNCkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRRdWFydDogZnVuY3Rpb24gZWFzZU91dFF1YXJ0KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIC1jaGFuZ2VJblZhbHVlICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxLCA0KSAtIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gZWFzZUluT3V0UXVhcnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24sIDQpICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAtY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAtIDIsIDQpIC0gMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJblF1aW50OiBmdW5jdGlvbiBlYXNlSW5RdWludChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucywgNSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRRdWludDogZnVuY3Rpb24gZWFzZU91dFF1aW50KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEsIDUpICsgMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiBlYXNlSW5PdXRRdWludChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiwgNSkgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLSAyLCA1KSArIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5TaW5lOiBmdW5jdGlvbiBlYXNlSW5TaW5lKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoMSAtIE1hdGguY29zKGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgKiAoTWF0aC5QSSAvIDIpKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRTaW5lOiBmdW5jdGlvbiBlYXNlT3V0U2luZShjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5zaW4oY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAqIChNYXRoLlBJIC8gMikpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRTaW5lOiBmdW5jdGlvbiBlYXNlSW5PdXRTaW5lKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKDEgLSBNYXRoLmNvcyhNYXRoLlBJICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucykpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5FeHBvOiBmdW5jdGlvbiBlYXNlSW5FeHBvKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdygyLCAxMCAqIChjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSkpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlT3V0RXhwbzogZnVuY3Rpb24gZWFzZU91dEV4cG8oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICgtTWF0aC5wb3coMiwgLTEwICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucykgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0RXhwbzogZnVuY3Rpb24gZWFzZUluT3V0RXhwbyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coMiwgMTAgKiAoY3VycmVudEl0ZXJhdGlvbiAtIDEpKSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tY3VycmVudEl0ZXJhdGlvbikgKyAyKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluQ2lyYzogZnVuY3Rpb24gZWFzZUluQ2lyYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKDEgLSBNYXRoLnNxcnQoMSAtIChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgKiBjdXJyZW50SXRlcmF0aW9uKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRDaXJjOiBmdW5jdGlvbiBlYXNlT3V0Q2lyYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5zcXJ0KDEgLSAoY3VycmVudEl0ZXJhdGlvbiA9IGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxKSAqIGN1cnJlbnRJdGVyYXRpb24pICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRDaXJjOiBmdW5jdGlvbiBlYXNlSW5PdXRDaXJjKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoMSAtIE1hdGguc3FydCgxIC0gY3VycmVudEl0ZXJhdGlvbiAqIGN1cnJlbnRJdGVyYXRpb24pKSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5zcXJ0KDEgLSAoY3VycmVudEl0ZXJhdGlvbiAtPSAyKSAqIGN1cnJlbnRJdGVyYXRpb24pICsgMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbkVsYXN0aWM6IGZ1bmN0aW9uIGVhc2VJbkVsYXN0aWModCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHMgPSAxLjcwMTU4O3ZhciBwID0gMDt2YXIgYSA9IGM7XHJcblx0XHRpZiAodCA9PSAwKSByZXR1cm4gYjtpZiAoKHQgLz0gZCkgPT0gMSkgcmV0dXJuIGIgKyBjO2lmICghcCkgcCA9IGQgKiAuMztcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHtcclxuXHRcdFx0YSA9IGM7dmFyIHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB2YXIgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKGMgLyBhKTtcclxuXHRcdHJldHVybiAtKGEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKSArIGI7XHJcblx0fSxcclxuXHRlYXNlT3V0RWxhc3RpYzogZnVuY3Rpb24gZWFzZU91dEVsYXN0aWModCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHMgPSAxLjcwMTU4O3ZhciBwID0gMDt2YXIgYSA9IGM7XHJcblx0XHRpZiAodCA9PSAwKSByZXR1cm4gYjtpZiAoKHQgLz0gZCkgPT0gMSkgcmV0dXJuIGIgKyBjO2lmICghcCkgcCA9IGQgKiAuMztcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHtcclxuXHRcdFx0YSA9IGM7dmFyIHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB2YXIgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKGMgLyBhKTtcclxuXHRcdHJldHVybiBhICogTWF0aC5wb3coMiwgLTEwICogdCkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSArIGMgKyBiO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dEVsYXN0aWM6IGZ1bmN0aW9uIGVhc2VJbk91dEVsYXN0aWModCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHMgPSAxLjcwMTU4O3ZhciBwID0gMDt2YXIgYSA9IGM7XHJcblx0XHRpZiAodCA9PSAwKSByZXR1cm4gYjtpZiAoKHQgLz0gZCAvIDIpID09IDIpIHJldHVybiBiICsgYztpZiAoIXApIHAgPSBkICogKC4zICogMS41KTtcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHtcclxuXHRcdFx0YSA9IGM7dmFyIHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB2YXIgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKGMgLyBhKTtcclxuXHRcdGlmICh0IDwgMSkgcmV0dXJuIC0uNSAqIChhICogTWF0aC5wb3coMiwgMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSkgKyBiO1xyXG5cdFx0cmV0dXJuIGEgKiBNYXRoLnBvdygyLCAtMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSAqIC41ICsgYyArIGI7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluQmFjazogZnVuY3Rpb24gZWFzZUluQmFjayh0LCBiLCBjLCBkLCBzKSB7XHJcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xyXG5cdFx0cmV0dXJuIGMgKiAodCAvPSBkKSAqIHQgKiAoKHMgKyAxKSAqIHQgLSBzKSArIGI7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dEJhY2s6IGZ1bmN0aW9uIGVhc2VPdXRCYWNrKHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRyZXR1cm4gYyAqICgodCA9IHQgLyBkIC0gMSkgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAxKSArIGI7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0QmFjazogZnVuY3Rpb24gZWFzZUluT3V0QmFjayh0LCBiLCBjLCBkLCBzKSB7XHJcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xyXG5cdFx0aWYgKCh0IC89IGQgLyAyKSA8IDEpIHJldHVybiBjIC8gMiAqICh0ICogdCAqICgoKHMgKj0gMS41MjUpICsgMSkgKiB0IC0gcykpICsgYjtcclxuXHRcdHJldHVybiBjIC8gMiAqICgodCAtPSAyKSAqIHQgKiAoKChzICo9IDEuNTI1KSArIDEpICogdCArIHMpICsgMikgKyBiO1xyXG5cdH0sXHJcblxyXG5cdC8vIGVhc2VJbkJvdW5jZTogZnVuY3Rpb24odCwgYiwgYywgZCkge1xyXG5cdC8vICAgICByZXR1cm4gYyAtIGVhc2VPdXRCb3VuY2UoZC10LCAwLCBjLCBkKSArIGI7XHJcblx0Ly8gfSxcclxuXHJcblx0ZWFzZU91dEJvdW5jZTogZnVuY3Rpb24gZWFzZU91dEJvdW5jZSh0LCBiLCBjLCBkKSB7XHJcblx0XHRpZiAoKHQgLz0gZCkgPCAxIC8gMi43NSkge1xyXG5cdFx0XHRyZXR1cm4gYyAqICg3LjU2MjUgKiB0ICogdCkgKyBiO1xyXG5cdFx0fSBlbHNlIGlmICh0IDwgMiAvIDIuNzUpIHtcclxuXHRcdFx0cmV0dXJuIGMgKiAoNy41NjI1ICogKHQgLT0gMS41IC8gMi43NSkgKiB0ICsgLjc1KSArIGI7XHJcblx0XHR9IGVsc2UgaWYgKHQgPCAyLjUgLyAyLjc1KSB7XHJcblx0XHRcdHJldHVybiBjICogKDcuNTYyNSAqICh0IC09IDIuMjUgLyAyLjc1KSAqIHQgKyAuOTM3NSkgKyBiO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGMgKiAoNy41NjI1ICogKHQgLT0gMi42MjUgLyAyLjc1KSAqIHQgKyAuOTg0Mzc1KSArIGI7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBlYXNlSW5PdXRCb3VuY2U6IGZ1bmN0aW9uKHQsIGIsIGMsIGQpIHtcclxuXHQvLyAgICAgaWYgKHQgPCBkLzIpIHJldHVybiB0aGlzLmVhc2VJbkJvdW5jZSh0KjIsIDAsIGMsIGQpICogLjUgKyBiO1xyXG5cdC8vICAgICByZXR1cm4gdGhpcy5lYXNlT3V0Qm91bmNlKHQqMi1kLCAwLCBjLCBkKSAqIC41ICsgYyouNSArIGI7XHJcblx0Ly8gfVxyXG59O1xyXG5cclxuZWFzaW5nRXF1YXRpb25zLmVhc2VJbkJvdW5jZSA9IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XHJcblx0cmV0dXJuIGMgLSBlYXNpbmdFcXVhdGlvbnMuZWFzZU91dEJvdW5jZShkIC0gdCwgMCwgYywgZCkgKyBiO1xyXG59LCBlYXNpbmdFcXVhdGlvbnMuZWFzZUluT3V0Qm91bmNlID0gZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcclxuXHRpZiAodCA8IGQgLyAyKSByZXR1cm4gZWFzaW5nRXF1YXRpb25zLmVhc2VJbkJvdW5jZSh0ICogMiwgMCwgYywgZCkgKiAuNSArIGI7XHJcblx0cmV0dXJuIGVhc2luZ0VxdWF0aW9ucy5lYXNlT3V0Qm91bmNlKHQgKiAyIC0gZCwgMCwgYywgZCkgKiAuNSArIGMgKiAuNSArIGI7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5lYXNpbmdFcXVhdGlvbnMgPSBlYXNpbmdFcXVhdGlvbnM7IiwidmFyIEVtaXR0ZXJTdG9yZUZuID0gZnVuY3Rpb24gRW1pdHRlclN0b3JlRm4oKSB7fTtcclxuXHJcbkVtaXR0ZXJTdG9yZUZuLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoc3RvcmUpIHtcclxuICB2YXIgaSA9IHN0b3JlLmxlbmd0aCAtIDE7XHJcbiAgZm9yICg7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICBzdG9yZVtpXS51cGRhdGVFbWl0dGVyKCk7XHJcbiAgICAvLyBzdG9yZVtpXS5yZW5kZXJFbWl0dGVyKCBjdHggKTtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5FbWl0dGVyU3RvcmVGbiA9IEVtaXR0ZXJTdG9yZUZuOyIsIi8vIGVtaXNzaW9uIHRoZW1lXHJcblxyXG52YXIgYmFzZUVtaXR0ZXJUaGVtZSA9IHtcclxuXHJcblx0ZW1pdHRlcjoge1xyXG5cclxuXHRcdGFjdGl2ZTogMCxcclxuXHJcblx0XHQvLyBwb3NpdGlvblxyXG5cdFx0eDogMCxcclxuXHRcdHk6IDAsXHJcblx0XHR4VmVsOiAwLFxyXG5cdFx0eVZlbDogMCxcclxuXHRcdGFwcGx5R2xvYmFsRm9yY2VzOiBmYWxzZVxyXG5cdH0sXHJcblxyXG5cdC8vIGVtaXNzaW9uIHJhdGUgY29uZmlnIChwZXIgY3ljbGUgKCBmcmFtZSApIClcclxuXHRlbWlzc2lvbjoge1xyXG5cclxuXHRcdHJhdGU6IHtcclxuXHRcdFx0bWluOiAwLFxyXG5cdFx0XHRtYXg6IDAsXHJcblxyXG5cdFx0XHRkZWNheToge1xyXG5cdFx0XHRcdHJhdGU6IDAsXHJcblx0XHRcdFx0ZGVjYXlNYXg6IDBcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBlbWlzc2lvbiByZXBlYXRlciBjb25maWdcclxuXHRcdHJlcGVhdGVyOiB7XHJcblx0XHRcdC8vIHdoYXQgaXMgdGhlIHJlcGV0aXRpb24gcmF0ZSAoIGZyYW1lcyApXHJcblx0XHRcdHJhdGU6IDAsXHJcblx0XHRcdC8vIGRvZXMgdGhlIHJlcGV0aXRpb24gcmF0ZSBkZWNheSAoIGdldCBsb25nZXIgKT8gaG93IG11Y2ggbG9uZ2VyPyBcclxuXHRcdFx0ZGVjYXk6IHtcclxuXHRcdFx0XHRyYXRlOiAwLFxyXG5cdFx0XHRcdGRlY2F5TWF4OiAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaW5pdGlhbCBkaXJlY3Rpb24gb2YgcGFydGljbGVzXHJcblx0XHRkaXJlY3Rpb246IHtcclxuXHRcdFx0cmFkOiAwLCAvLyBpbiByYWRpYW5zICgwIC0gMilcclxuXHRcdFx0bWluOiAwLCAvLyBsb3cgYm91bmRzIChyYWRpYW5zKVxyXG5cdFx0XHRtYXg6IDAgLy8gaGlnaCBib3VuZHMgKHJhZGlhbnMpXHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGFyZSBwYXJ0aWNsZXMgb2Zmc2V0IGZyb20gaW5pdGFsIHgveVxyXG5cdFx0cmFkaWFsRGlzcGxhY2VtZW50OiAwLFxyXG5cdFx0Ly8gaXMgdGhlIG9mZnNldCBmZWF0aGVyZWQ/XHJcblx0XHRyYWRpYWxEaXNwbGFjZW1lbnRPZmZzZXQ6IDAsXHJcblxyXG5cdFx0Ly9pbml0aWFsIHZlbG9jaXR5IG9mIHBhcnRpY2xlc1xyXG5cdFx0aW1wdWxzZToge1xyXG5cdFx0XHRwb3c6IDAsXHJcblx0XHRcdG1pbjogMCxcclxuXHRcdFx0bWF4OiAwXHJcblx0XHR9XHJcblx0fVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmJhc2VFbWl0dGVyVGhlbWUgPSBiYXNlRW1pdHRlclRoZW1lOyIsIi8vIGVtaXNzaW9uIHRoZW1lXHJcblxyXG52YXIgZmxhbWVTdHJlYW1UaGVtZSA9IHtcclxuXHJcblx0ZW1pdHRlcjoge1xyXG5cclxuXHRcdGFjdGl2ZTogMSxcclxuXHJcblx0XHQvLyBwb3NpdGlvblxyXG5cdFx0eDogMCxcclxuXHRcdHk6IDAsXHJcblx0XHR4VmVsOiAwLFxyXG5cdFx0eVZlbDogMCxcclxuXHRcdGFwcGx5R2xvYmFsRm9yY2VzOiBmYWxzZVxyXG5cdH0sXHJcblxyXG5cdC8vIGVtaXNzaW9uIHJhdGUgY29uZmlnIChwZXIgY3ljbGUgKCBmcmFtZSApIClcclxuXHRlbWlzc2lvbjoge1xyXG5cclxuXHRcdHJhdGU6IHtcclxuXHRcdFx0bWluOiAzMCxcclxuXHRcdFx0bWF4OiA2MCxcclxuXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0XHRkZWNheU1heDogMFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGVtaXNzaW9uIHJlcGVhdGVyIGNvbmZpZ1xyXG5cdFx0cmVwZWF0ZXI6IHtcclxuXHRcdFx0Ly8gd2hhdCBpcyB0aGUgcmVwZXRpdGlvbiByYXRlICggZnJhbWVzIClcclxuXHRcdFx0cmF0ZTogMSxcclxuXHRcdFx0Ly8gZG9lcyB0aGUgcmVwZXRpdGlvbiByYXRlIGRlY2F5ICggZ2V0IGxvbmdlciApPyBob3cgbXVjaCBsb25nZXI/IFxyXG5cdFx0XHRkZWNheToge1xyXG5cdFx0XHRcdHJhdGU6IDAsXHJcblx0XHRcdFx0ZGVjYXlNYXg6IDMwMFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGluaXRpYWwgZGlyZWN0aW9uIG9mIHBhcnRpY2xlc1xyXG5cdFx0ZGlyZWN0aW9uOiB7XHJcblx0XHRcdHJhZDogMCwgLy8gaW4gcmFkaWFucyAoMCAtIDIpXHJcblx0XHRcdG1pbjogMS40NSwgLy8gbG93IGJvdW5kcyAocmFkaWFucylcclxuXHRcdFx0bWF4OiAxLjU1IC8vIGhpZ2ggYm91bmRzIChyYWRpYW5zKVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBhcmUgcGFydGljbGVzIG9mZnNldCBmcm9tIGluaXRhbCB4L3lcclxuXHRcdHJhZGlhbERpc3BsYWNlbWVudDogMCxcclxuXHRcdC8vIGlzIHRoZSBvZmZzZXQgZmVhdGhlcmVkP1xyXG5cdFx0cmFkaWFsRGlzcGxhY2VtZW50T2Zmc2V0OiAwLFxyXG5cclxuXHRcdC8vaW5pdGlhbCB2ZWxvY2l0eSBvZiBwYXJ0aWNsZXNcclxuXHRcdGltcHVsc2U6IHtcclxuXHRcdFx0cG93OiAwLFxyXG5cdFx0XHRtaW46IDgsXHJcblx0XHRcdG1heDogMTVcclxuXHRcdH1cclxuXHR9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZmxhbWVTdHJlYW1UaGVtZSA9IGZsYW1lU3RyZWFtVGhlbWU7IiwiLy8gZW1pc3Npb24gdGhlbWVcclxuXHJcbnZhciBzaW5nbGVCdXJzdFRoZW1lID0ge1xyXG5cclxuXHRlbWl0dGVyOiB7XHJcblxyXG5cdFx0YWN0aXZlOiAxLFxyXG5cclxuXHRcdC8vIHBvc2l0aW9uXHJcblx0XHR4OiAwLFxyXG5cdFx0eTogMCxcclxuXHRcdHhWZWw6IDAsXHJcblx0XHR5VmVsOiAwLFxyXG5cdFx0YXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0Ly8gZW1pc3Npb24gcmF0ZSBjb25maWcgKHBlciBjeWNsZSAoIGZyYW1lICkgKVxyXG5cdGVtaXNzaW9uOiB7XHJcblxyXG5cdFx0cmF0ZToge1xyXG5cdFx0XHRtaW46IDMwLFxyXG5cdFx0XHRtYXg6IDEwMCxcclxuXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogNSxcclxuXHRcdFx0XHRkZWNheU1heDogMFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGVtaXNzaW9uIHJlcGVhdGVyIGNvbmZpZ1xyXG5cdFx0cmVwZWF0ZXI6IHtcclxuXHRcdFx0Ly8gd2hhdCBpcyB0aGUgcmVwZXRpdGlvbiByYXRlICggZnJhbWVzIClcclxuXHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0Ly8gZG9lcyB0aGUgcmVwZXRpdGlvbiByYXRlIGRlY2F5ICggZ2V0IGxvbmdlciApPyBob3cgbXVjaCBsb25nZXI/IFxyXG5cdFx0XHRkZWNheToge1xyXG5cdFx0XHRcdHJhdGU6IDAsXHJcblx0XHRcdFx0ZGVjYXlNYXg6IDMwMFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGluaXRpYWwgZGlyZWN0aW9uIG9mIHBhcnRpY2xlc1xyXG5cdFx0ZGlyZWN0aW9uOiB7XHJcblx0XHRcdHJhZDogMCwgLy8gaW4gcmFkaWFucyAoMCAtIDIpXHJcblx0XHRcdG1pbjogMCwgLy8gbG93IGJvdW5kcyAocmFkaWFucylcclxuXHRcdFx0bWF4OiAyIC8vIGhpZ2ggYm91bmRzIChyYWRpYW5zKVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBhcmUgcGFydGljbGVzIG9mZnNldCBmcm9tIGluaXRhbCB4L3lcclxuXHRcdHJhZGlhbERpc3BsYWNlbWVudDogMjAsXHJcblx0XHQvLyBpcyB0aGUgb2Zmc2V0IGZlYXRoZXJlZD9cclxuXHRcdHJhZGlhbERpc3BsYWNlbWVudE9mZnNldDogMCxcclxuXHJcblx0XHQvL2luaXRpYWwgdmVsb2NpdHkgb2YgcGFydGljbGVzXHJcblx0XHRpbXB1bHNlOiB7XHJcblx0XHRcdHBvdzogMCxcclxuXHRcdFx0bWluOiA1MCxcclxuXHRcdFx0bWF4OiA4MFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5zaW5nbGVCdXJzdFRoZW1lID0gc2luZ2xlQnVyc3RUaGVtZTsiLCIvLyBlbWlzc2lvbiB0aGVtZVxyXG5cclxudmFyIHNtb2tlU3RyZWFtVGhlbWUgPSB7XHJcblxyXG5cdGVtaXR0ZXI6IHtcclxuXHJcblx0XHRhY3RpdmU6IDAsXHJcblxyXG5cdFx0Ly8gcG9zaXRpb25cclxuXHRcdHg6IDAsXHJcblx0XHR5OiAwLFxyXG5cdFx0eFZlbDogMCxcclxuXHRcdHlWZWw6IDAsXHJcblx0XHRhcHBseUdsb2JhbEZvcmNlczogZmFsc2VcclxuXHR9LFxyXG5cclxuXHQvLyBlbWlzc2lvbiByYXRlIGNvbmZpZyAocGVyIGN5Y2xlICggZnJhbWUgKSApXHJcblx0ZW1pc3Npb246IHtcclxuXHJcblx0XHRyYXRlOiB7XHJcblx0XHRcdG1pbjogNSxcclxuXHRcdFx0bWF4OiAxMCxcclxuXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0XHRkZWNheU1heDogMFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGVtaXNzaW9uIHJlcGVhdGVyIGNvbmZpZ1xyXG5cdFx0cmVwZWF0ZXI6IHtcclxuXHRcdFx0Ly8gd2hhdCBpcyB0aGUgcmVwZXRpdGlvbiByYXRlICggZnJhbWVzIClcclxuXHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0Ly8gZG9lcyB0aGUgcmVwZXRpdGlvbiByYXRlIGRlY2F5ICggZ2V0IGxvbmdlciApPyBob3cgbXVjaCBsb25nZXI/IFxyXG5cdFx0XHRkZWNheToge1xyXG5cdFx0XHRcdHJhdGU6IDAsXHJcblx0XHRcdFx0ZGVjYXlNYXg6IDBcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBpbml0aWFsIGRpcmVjdGlvbiBvZiBwYXJ0aWNsZXNcclxuXHRcdGRpcmVjdGlvbjoge1xyXG5cdFx0XHRyYWQ6IDAsIC8vIGluIHJhZGlhbnMgKDAgLSAyKVxyXG5cdFx0XHRtaW46IDEuNDksIC8vIGxvdyBib3VuZHMgKHJhZGlhbnMpXHJcblx0XHRcdG1heDogMS41MSAvLyBoaWdoIGJvdW5kcyAocmFkaWFucylcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gYXJlIHBhcnRpY2xlcyBvZmZzZXQgZnJvbSBpbml0YWwgeC95XHJcblx0XHRyYWRpYWxEaXNwbGFjZW1lbnQ6IDAsXHJcblx0XHQvLyBpcyB0aGUgb2Zmc2V0IGZlYXRoZXJlZD9cclxuXHRcdHJhZGlhbERpc3BsYWNlbWVudE9mZnNldDogMCxcclxuXHJcblx0XHQvL2luaXRpYWwgdmVsb2NpdHkgb2YgcGFydGljbGVzXHJcblx0XHRpbXB1bHNlOiB7XHJcblx0XHRcdHBvdzogMCxcclxuXHRcdFx0bWluOiA1LFxyXG5cdFx0XHRtYXg6IDEwXHJcblx0XHR9XHJcblx0fVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnNtb2tlU3RyZWFtVGhlbWUgPSBzbW9rZVN0cmVhbVRoZW1lOyIsIi8vIGVtaXNzaW9uIHRoZW1lXHJcblxyXG4gIHZhciB3YXJwU3RyZWFtVGhlbWUgPSB7XHJcblxyXG4gICAgZW1pdHRlcjoge1xyXG5cclxuICAgICAgYWN0aXZlOiAxLFxyXG5cclxuICAgICAgLy8gcG9zaXRpb25cclxuICAgICAgeDogMCxcclxuICAgICAgeTogMCxcclxuICAgICAgeFZlbDogMCxcclxuICAgICAgeVZlbDogMCxcclxuICAgICAgYXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGVtaXNzaW9uIHJhdGUgY29uZmlnIChwZXIgY3ljbGUgKCBmcmFtZSApIClcclxuICAgIGVtaXNzaW9uOiB7XHJcblxyXG4gICAgICByYXRlOiB7XHJcbiAgICAgICAgbWluOiA1LFxyXG4gICAgICAgIG1heDogMTIsXHJcblxyXG4gICAgICAgIGRlY2F5OiB7XHJcbiAgICAgICAgICByYXRlOiAwLFxyXG4gICAgICAgICAgZGVjYXlNYXg6IDBcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBlbWlzc2lvbiByZXBlYXRlciBjb25maWdcclxuICAgICAgcmVwZWF0ZXI6IHtcclxuICAgICAgICAvLyB3aGF0IGlzIHRoZSByZXBldGl0aW9uIHJhdGUgKCBmcmFtZXMgKVxyXG4gICAgICAgIHJhdGU6IDUsXHJcbiAgICAgICAgLy8gZG9lcyB0aGUgcmVwZXRpdGlvbiByYXRlIGRlY2F5ICggZ2V0IGxvbmdlciApPyBob3cgbXVjaCBsb25nZXI/IFxyXG4gICAgICAgIGRlY2F5OiB7XHJcbiAgICAgICAgICByYXRlOiAwLFxyXG4gICAgICAgICAgZGVjYXlNYXg6IDMwMFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vIGluaXRpYWwgZGlyZWN0aW9uIG9mIHBhcnRpY2xlc1xyXG4gICAgICBkaXJlY3Rpb246IHtcclxuICAgICAgICByYWQ6IDAsIC8vIGluIHJhZGlhbnMgKDAgLSAyKVxyXG4gICAgICAgIG1pbjogMCwgLy8gbG93IGJvdW5kcyAocmFkaWFucylcclxuICAgICAgICBtYXg6IDIgLy8gaGlnaCBib3VuZHMgKHJhZGlhbnMpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBhcmUgcGFydGljbGVzIG9mZnNldCBmcm9tIGluaXRhbCB4L3lcclxuICAgICAgcmFkaWFsRGlzcGxhY2VtZW50OiAxMDAsXHJcbiAgICAgIC8vIGlzIHRoZSBvZmZzZXQgZmVhdGhlcmVkP1xyXG4gICAgICByYWRpYWxEaXNwbGFjZW1lbnRPZmZzZXQ6IDAsXHJcblxyXG4gICAgICAvL2luaXRpYWwgdmVsb2NpdHkgb2YgcGFydGljbGVzXHJcbiAgICAgIGltcHVsc2U6IHtcclxuICAgICAgICBwb3c6IDAsXHJcbiAgICAgICAgbWluOiAwLjI1LFxyXG4gICAgICAgIG1heDogMS4yNVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH07XHJcblxyXG4gIG1vZHVsZS5leHBvcnRzLndhcnBTdHJlYW1UaGVtZSA9IHdhcnBTdHJlYW1UaGVtZTsiLCJyZXF1aXJlKCAnLi9wYXJ0aWNsZXMuanMnICk7IiwidmFyIGVudmlyb25tZW50ID0ge1xyXG5cclxuXHRcdHJ1bnRpbWVFbmdpbmU6IHtcclxuXHJcblx0XHRcdFx0c3RhcnRBbmltYXRpb246IGZ1bmN0aW9uIHN0YXJ0QW5pbWF0aW9uKGFuaW1WYXIsIGxvb3BGbikge1xyXG5cdFx0XHRcdFx0XHRpZiAoIWFuaW1WYXIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGFuaW1WYXIgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3BGbik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cclxuXHRcdFx0XHRzdG9wQW5pbWF0aW9uOiBmdW5jdGlvbiBzdG9wQW5pbWF0aW9uKGFuaW1WYXIpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGFuaW1WYXIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShhbmltVmFyKTtcclxuXHRcdFx0XHRcdFx0XHRcdGFuaW1WYXIgPSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHRjYW52YXM6IHtcclxuXHRcdFx0XHQvLyBidWZmZXIgY2xlYXIgZk5cclxuXHRcdFx0XHRjaGVja0NsZWFyQnVmZmVyUmVnaW9uOiBmdW5jdGlvbiBjaGVja0NsZWFyQnVmZmVyUmVnaW9uKHBhcnRpY2xlLCBjYW52YXNDb25maWcpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBidWZmZXJDbGVhclJlZ2lvbiA9IGNhbnZhc0NvbmZpZy5idWZmZXJDbGVhclJlZ2lvbjtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBlbnRpdHlXaWR0aCA9IHBhcnRpY2xlLnIgLyAyO1xyXG5cdFx0XHRcdFx0XHR2YXIgZW50aXR5SGVpZ2h0ID0gcGFydGljbGUuciAvIDI7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAocGFydGljbGUueCAtIGVudGl0eVdpZHRoIDwgYnVmZmVyQ2xlYXJSZWdpb24ueCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24ueCA9IHBhcnRpY2xlLnggLSBlbnRpdHlXaWR0aDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnggKyBlbnRpdHlXaWR0aCA+IGJ1ZmZlckNsZWFyUmVnaW9uLnggKyBidWZmZXJDbGVhclJlZ2lvbi53KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi53ID0gcGFydGljbGUueCArIGVudGl0eVdpZHRoIC0gYnVmZmVyQ2xlYXJSZWdpb24ueDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnkgLSBlbnRpdHlIZWlnaHQgPCBidWZmZXJDbGVhclJlZ2lvbi55KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi55ID0gcGFydGljbGUueSAtIGVudGl0eUhlaWdodDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnkgKyBlbnRpdHlIZWlnaHQgPiBidWZmZXJDbGVhclJlZ2lvbi55ICsgYnVmZmVyQ2xlYXJSZWdpb24uaCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24uaCA9IHBhcnRpY2xlLnkgKyBlbnRpdHlIZWlnaHQgLSBidWZmZXJDbGVhclJlZ2lvbi55O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHJcblx0XHRcdFx0cmVzZXRCdWZmZXJDbGVhclJlZ2lvbjogZnVuY3Rpb24gcmVzZXRCdWZmZXJDbGVhclJlZ2lvbihjYW52YXNDb25maWcpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBidWZmZXJDbGVhclJlZ2lvbiA9IGNhbnZhc0NvbmZpZy5idWZmZXJDbGVhclJlZ2lvbjtcclxuXHJcblx0XHRcdFx0XHRcdGJ1ZmZlckNsZWFyUmVnaW9uLnggPSBjYW52YXNDb25maWcuY2VudGVySDtcclxuXHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24ueSA9IGNhbnZhc0NvbmZpZy5jZW50ZXJWO1xyXG5cdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi53ID0gY2FudmFzQ29uZmlnLndpZHRoO1xyXG5cdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi5oID0gY2FudmFzQ29uZmlnLmhlaWdodDtcclxuXHRcdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGZvcmNlczoge1xyXG5cdFx0XHRcdGZyaWN0aW9uOiAwLjAxLFxyXG5cdFx0XHRcdGJvdXlhbmN5OiAxLFxyXG5cdFx0XHRcdGdyYXZpdHk6IDAsXHJcblx0XHRcdFx0d2luZDogMSxcclxuXHRcdFx0XHR0dXJidWxlbmNlOiB7IG1pbjogLTUsIG1heDogNSB9XHJcblx0XHR9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudDsiLCIvKipcclxuKiBwcm92aWRlcyBtYXRocyB1dGlsIG1ldGhvZHMuXHJcbipcclxuKiBAbWl4aW5cclxuKi9cclxuXHJcbnZhciBtYXRoVXRpbHMgPSB7XHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZW5lcmF0ZSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIDIgdmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIC0gbWluaW11bSB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0cmFuZG9tSW50ZWdlcjogZnVuY3Rpb24gcmFuZG9tSW50ZWdlcihtaW4sIG1heCkge1xyXG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggKyAxIC0gbWluKSkgKyBtaW47XHJcblx0fSxcclxuXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZW5lcmF0ZSByYW5kb20gZmxvYXQgYmV0d2VlbiAyIHZhbHVlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIG1pbmltdW0gdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSBtYXhpbXVtIHZhbHVlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdHJhbmRvbTogZnVuY3Rpb24gcmFuZG9tKG1pbiwgbWF4KSB7XHJcblx0XHRpZiAobWluID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0bWluID0gMDtcclxuXHRcdFx0bWF4ID0gMTtcclxuXHRcdH0gZWxzZSBpZiAobWF4ID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0bWF4ID0gbWluO1xyXG5cdFx0XHRtaW4gPSAwO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcclxuXHR9LFxyXG5cclxuXHRnZXRSYW5kb21BcmJpdHJhcnk6IGZ1bmN0aW9uIGdldFJhbmRvbUFyYml0cmFyeShtaW4sIG1heCkge1xyXG5cdFx0cmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcclxuXHR9LFxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gVHJhbnNmb3JtcyB2YWx1ZSBwcm9wb3J0aW9uYXRlbHkgYmV0d2VlbiBpbnB1dCByYW5nZSBhbmQgb3V0cHV0IHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSB0aGUgdmFsdWUgaW4gdGhlIG9yaWdpbiByYW5nZSAoIG1pbjEvbWF4MSApLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluMSAtIG1pbmltdW0gdmFsdWUgaW4gb3JpZ2luIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4MSAtIG1heGltdW0gdmFsdWUgaW4gb3JpZ2luIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluMiAtIG1pbmltdW0gdmFsdWUgaW4gZGVzdGluYXRpb24gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXgyIC0gbWF4aW11bSB2YWx1ZSBpbiBkZXN0aW5hdGlvbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IGNsYW1wUmVzdWx0IC0gY2xhbXAgcmVzdWx0IGJldHdlZW4gZGVzdGluYXRpb24gcmFuZ2UgYm91bmRhcnlzLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdG1hcDogZnVuY3Rpb24gbWFwKHZhbHVlLCBtaW4xLCBtYXgxLCBtaW4yLCBtYXgyLCBjbGFtcFJlc3VsdCkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0dmFyIHJldHVybnZhbHVlID0gKHZhbHVlIC0gbWluMSkgLyAobWF4MSAtIG1pbjEpICogKG1heDIgLSBtaW4yKSArIG1pbjI7XHJcblx0XHRpZiAoY2xhbXBSZXN1bHQpIHJldHVybiBzZWxmLmNsYW1wKHJldHVybnZhbHVlLCBtaW4yLCBtYXgyKTtlbHNlIHJldHVybiByZXR1cm52YWx1ZTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIENsYW1wIHZhbHVlIGJldHdlZW4gcmFuZ2UgdmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSB0aGUgdmFsdWUgaW4gdGhlIHJhbmdlIHsgbWlufG1heCB9LlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIC0gbWluaW11bSB2YWx1ZSBpbiB0aGUgcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSBtYXhpbXVtIHZhbHVlIGluIHRoZSByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IGNsYW1wUmVzdWx0IC0gY2xhbXAgcmVzdWx0IGJldHdlZW4gcmFuZ2UgYm91bmRhcnlzLlxyXG4gKi9cclxuXHRjbGFtcDogZnVuY3Rpb24gY2xhbXAodmFsdWUsIG1pbiwgbWF4KSB7XHJcblx0XHRpZiAobWF4IDwgbWluKSB7XHJcblx0XHRcdHZhciB0ZW1wID0gbWluO1xyXG5cdFx0XHRtaW4gPSBtYXg7XHJcblx0XHRcdG1heCA9IHRlbXA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbih2YWx1ZSwgbWF4KSk7XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMubWF0aFV0aWxzID0gbWF0aFV0aWxzOyIsInZhciByZW5kZXJQYXJ0aWNsZUFyciA9IHJlcXVpcmUoJy4vcGFydGljbGVGdW5jdGlvbnMvcmVuZGVyUGFydGljbGVBcnIuanMnKS5yZW5kZXJQYXJ0aWNsZUFycjtcclxudmFyIHVwZGF0ZVBhcnRpY2xlQXJyID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUZ1bmN0aW9ucy91cGRhdGVQYXJ0aWNsZUFyci5qcycpLnVwZGF0ZVBhcnRpY2xlQXJyO1xyXG5cclxudmFyIHBhcnRpY2xlQXJyRm4gPSB7XHJcblxyXG5cdHJlbmRlclBhcnRpY2xlQXJyOiByZW5kZXJQYXJ0aWNsZUFycixcclxuXHR1cGRhdGVQYXJ0aWNsZUFycjogdXBkYXRlUGFydGljbGVBcnJcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5wYXJ0aWNsZUFyckZuID0gcGFydGljbGVBcnJGbjsiLCJ2YXIgY2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUZ1bmN0aW9ucy9jaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnMuanMnKS5jaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnM7XHJcbnZhciBjcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMgPSByZXF1aXJlKCcuL3BhcnRpY2xlRnVuY3Rpb25zL2NyZWF0ZVBlclBhcnRpY2xlQXR0cmlidXRlcy5qcycpLmNyZWF0ZVBlclBhcnRpY2xlQXR0cmlidXRlcztcclxudmFyIHVwZGF0ZVBhcnRpY2xlID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUZ1bmN0aW9ucy91cGRhdGVQYXJ0aWNsZS5qcycpLnVwZGF0ZVBhcnRpY2xlO1xyXG52YXIga2lsbFBhcnRpY2xlID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUZ1bmN0aW9ucy9raWxsUGFydGljbGUuanMnKS5raWxsUGFydGljbGU7XHJcblxyXG52YXIgcGFydGljbGVGbiA9IHtcclxuXHJcblx0Y2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zOiBjaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnMsXHJcblx0Y3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzOiBjcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMsXHJcblx0dXBkYXRlUGFydGljbGU6IHVwZGF0ZVBhcnRpY2xlLFxyXG5cdGtpbGxQYXJ0aWNsZToga2lsbFBhcnRpY2xlXHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMucGFydGljbGVGbiA9IHBhcnRpY2xlRm47IiwidmFyIGNoZWNrUGFydGljbGVLaWxsQ29uZGl0aW9ucyA9IGZ1bmN0aW9uIGNoZWNrUGFydGljbGVLaWxsQ29uZGl0aW9ucyhwLCBjYW5XLCBjYW5IKSB7XHJcbiAgICAvLyBjaGVjayBvbiBwYXJ0aWNsZSBraWxsIGNvbmRpdGlvbnNcclxuICAgIC8vIHNlZW1zIGNvbXBsaWNhdGVkICggbmVzdGVkIElGcyApIGJ1dCB0cmllcyB0byBzdG9wIGNoZWNrXHJcbiAgICAvLyB3aXRob3V0IGhhdmluZyB0byBtYWtlIGFsbCB0aGUgY2hlY2tzIGlmIGEgY29uZGl0aW9uIGlzIGhpdFxyXG4gICAgdmFyIGsgPSBwLmtpbGxDb25kaXRpb25zO1xyXG4gICAgdmFyIGtDb2wgPSBrLmNvbG9yQ2hlY2s7XHJcbiAgICB2YXIga0F0dHIgPSBrLnBlckF0dHJpYnV0ZTtcclxuICAgIHZhciBrQk8gPSBrLmJvdW5kYXJ5T2Zmc2V0O1xyXG5cclxuICAgIGlmIChrQ29sLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBmb3IgKHZhciBpID0ga0NvbC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICB2YXIgdGhpc0NoZWNrSXRlbSA9IGtDb2xbaV07XHJcbiAgICAgICAgICAgIGlmIChwLmNvbG9yNERhdGFbdGhpc0NoZWNrSXRlbS5uYW1lXSA8PSB0aGlzQ2hlY2tJdGVtLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoa0F0dHIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBrQXR0ci5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICB2YXIgdGhpc0NoZWNrSXRlbSA9IGtBdHRyW2ldO1xyXG4gICAgICAgICAgICBpZiAocFt0aGlzQ2hlY2tJdGVtLm5hbWVdIDw9IHRoaXNDaGVja0l0ZW0udmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChrLmJvdW5kYXJ5Q2hlY2sgPT09IHRydWUpIHtcclxuICAgICAgICAvLyBzdG9yZSBwLnIgYW5kIGdpdmUgYnVmZmVyICggKiA0ICkgdG8gYWNjb21vZGF0ZSBwb3NzaWJsZSB3YXJwaW5nXHJcbiAgICAgICAgdmFyIHBSYWQgPSBwLnIgKiA0O1xyXG4gICAgICAgIGlmIChwLnggLSBwUmFkIDwgMCAtIGtCTykge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocC54ICsgcFJhZCA+IGNhblcgKyBrQk8pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHAueSAtIHBSYWQgPCAwIC0ga0JPKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwLnkgKyBwUmFkID4gY2FuSCArIGtCTykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zID0gY2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zOyIsInZhciB0cmlnID0gcmVxdWlyZSgnLi8uLi90cmlnb25vbWljVXRpbHMuanMnKS50cmlnb25vbWljVXRpbHM7XHJcbnZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuLy4uL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxudmFyIGdldFZhbHVlID0gcmVxdWlyZSgnLi8uLi91dGlsaXRpZXMuanMnKS5nZXRWYWx1ZTtcclxuXHJcbnZhciBjcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMgPSBmdW5jdGlvbiBjcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMoeCwgeSwgZW1pc3Npb25PcHRzLCBwZXJQYXJ0aWNsZU9wdHMpIHtcclxuICAgIC8vIGxldCB0aGVtZWQgPSBwZXJQYXJ0aWNsZU9wdHMudGhlbWUgfHwgdGhlbWVzLnJlc2V0O1xyXG5cclxuICAgIHZhciB0aGVtZWQgPSBwZXJQYXJ0aWNsZU9wdHMgfHwgdGhlbWVzLnJlc2V0O1xyXG4gICAgdmFyIGVtaXRUaGVtZWQgPSBlbWlzc2lvbk9wdHMgfHwgZmFsc2U7XHJcbiAgICB2YXIgbGlmZSA9IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKHRoZW1lZC5saWZlLm1pbiwgdGhlbWVkLmxpZmUubWF4KTtcclxuICAgIC8vIHVzZSBiaXR3aXNlIHRvIGNoZWNrIGZvciBvZGQvZXZlbiBsaWZlIHZhbHMuIE1ha2UgZXZlbiB0byBoZWxwIHdpdGggYW5pbXMgdGhhdCBhcmUgZnJhY3Rpb24gb2YgbGlmZSAoZnJhbWVzKVxyXG4gICAgbGlmZSAmIDEgPyBsaWZlKysgOiBmYWxzZTtcclxuXHJcbiAgICB2YXIgZW1pc3Npb24gPSBlbWl0VGhlbWVkLmVtaXNzaW9uIHx8IGVtaXRUaGVtZWQ7XHJcblxyXG4gICAgdmFyIGRpcmVjdGlvbiA9IGVtaXNzaW9uLmRpcmVjdGlvbi5yYWQgPiAwID8gZW1pc3Npb24uZGlyZWN0aW9uLnJhZCA6IG1hdGhVdGlscy5nZXRSYW5kb21BcmJpdHJhcnkoZW1pc3Npb24uZGlyZWN0aW9uLm1pbiwgZW1pc3Npb24uZGlyZWN0aW9uLm1heCkgKiBNYXRoLlBJO1xyXG5cclxuICAgIC8vIHNldCBuZXcgcGFydGljbGUgb3JpZ2luIGRlcGVuZGFudCBvbiB0aGUgcmFkaWFsIGRpc3BsYWNlbWVudFxyXG4gICAgaWYgKGVtaXNzaW9uLnJhZGlhbERpc3BsYWNlbWVudCA+IDApIHtcclxuICAgICAgICB2YXIgbmV3Q29vcmRzID0gdHJpZy5yYWRpYWxEaXN0cmlidXRpb24oeCwgeSwgZW1pc3Npb24ucmFkaWFsRGlzcGxhY2VtZW50ICsgbWF0aFV0aWxzLnJhbmRvbShlbWlzc2lvbi5yYWRpYWxEaXNwbGFjZW1lbnRPZmZzZXQgKiAtMSwgZW1pc3Npb24ucmFkaWFsRGlzcGxhY2VtZW50T2Zmc2V0KSwgZGlyZWN0aW9uKTtcclxuXHJcbiAgICAgICAgeCA9IG5ld0Nvb3Jkcy54O1xyXG4gICAgICAgIHkgPSBuZXdDb29yZHMueTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaW1wdWxzZSA9IGVtaXNzaW9uLmltcHVsc2UucG93ID4gMCA/IGVtaXNzaW9uLmltcHVsc2UucG93IDogbWF0aFV0aWxzLnJhbmRvbShlbWlzc2lvbi5pbXB1bHNlLm1pbiwgZW1pc3Npb24uaW1wdWxzZS5tYXgpO1xyXG5cclxuICAgIHZhciBpbml0UiA9IG1hdGhVdGlscy5yYW5kb20odGhlbWVkLnJhZGl1cy5taW4sIHRoZW1lZC5yYWRpdXMubWF4KTtcclxuICAgIHZhciB0YXJnZXRSYWRpdXMgPSBtYXRoVXRpbHMucmFuZG9tKHRoZW1lZC50YXJnZXRSYWRpdXMubWluLCB0aGVtZWQudGFyZ2V0UmFkaXVzLm1heCk7XHJcbiAgICB2YXIgYWNjZWxlcmF0aW9uID0gbWF0aFV0aWxzLnJhbmRvbSh0aGVtZWQudmVsQWNjZWxlcmF0aW9uLm1pbiwgdGhlbWVkLnZlbEFjY2VsZXJhdGlvbi5tYXgpO1xyXG4gICAgdmFyIHZlbG9jaXRpZXMgPSB0cmlnLmNhbGN1bGF0ZVZlbG9jaXRpZXMoeCwgeSwgZGlyZWN0aW9uLCBpbXB1bHNlKTtcclxuXHJcbiAgICB2YXIgaW5pdENvbG9yID0gdGhlbWVkLmNvbG9yUHJvZmlsZXNbMF07XHJcbiAgICB2YXIgY29sb3I0RGF0YSA9IHtcclxuICAgICAgICByOiBpbml0Q29sb3IucixcclxuICAgICAgICBnOiBpbml0Q29sb3IuZyxcclxuICAgICAgICBiOiBpbml0Q29sb3IuYixcclxuICAgICAgICBhOiBpbml0Q29sb3IuYVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgd2lsbEZsYXJlID0gdm9pZCAwO1xyXG4gICAgdmFyIHdpbGxGbGFyZVRlbXAgPSBtYXRoVXRpbHMucmFuZG9tSW50ZWdlcigwLCAxMDAwKTtcclxuXHJcbiAgICB2YXIgdGVtcEN1c3RvbSA9IHtcclxuICAgICAgICBsZW5zRmxhcmU6IHtcclxuICAgICAgICAgICAgbWlnaHRGbGFyZTogdHJ1ZSxcclxuICAgICAgICAgICAgd2lsbEZsYXJlOiB0aGVtZWQuY3VzdG9tQXR0cmlidXRlcy5sZW5zRmxhcmUubWlnaHRGbGFyZSA9PT0gdHJ1ZSAmJiB3aWxsRmxhcmVUZW1wIDwgMTAgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgIGFuZ2xlOiAwLjMwXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBsZXQgY3VzdG9tQXR0cmlidXRlcyA9IHRoZW1lZC5jdXN0b21BdHRyaWJ1dGVzO1xyXG5cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBwcGEgPSB7XHJcbiAgICAgICAgYWN0aXZlOiBwZXJQYXJ0aWNsZU9wdHMuYWN0aXZlIHx8IHRoZW1lZC5hY3RpdmUgfHwgMCxcclxuICAgICAgICBpbml0UjogaW5pdFIsXHJcbiAgICAgICAgdFI6IHRhcmdldFJhZGl1cyxcclxuICAgICAgICBsaWZlU3BhbjogbGlmZSxcclxuICAgICAgICBhbmdsZTogZGlyZWN0aW9uLFxyXG4gICAgICAgIG1hZ25pdHVkZTogaW1wdWxzZSxcclxuICAgICAgICByZWxhdGl2ZU1hZ25pdHVkZTogaW1wdWxzZSxcclxuICAgICAgICBtYWduaXR1ZGVEZWNheTogdGhlbWVkLm1hZ0RlY2F5LFxyXG4gICAgICAgIHg6IHgsXHJcbiAgICAgICAgeTogeSxcclxuICAgICAgICB4VmVsOiB2ZWxvY2l0aWVzLnhWZWwsXHJcbiAgICAgICAgeVZlbDogdmVsb2NpdGllcy55VmVsLFxyXG4gICAgICAgIHZBY2M6IGFjY2VsZXJhdGlvbixcclxuICAgICAgICBhcHBseUZvcmNlczogdGhlbWVkLmFwcGx5R2xvYmFsRm9yY2VzLFxyXG4gICAgICAgIGNvbG9yNERhdGE6IHtcclxuICAgICAgICAgICAgcjogY29sb3I0RGF0YS5yLCBnOiBjb2xvcjREYXRhLmcsIGI6IGNvbG9yNERhdGEuYiwgYTogY29sb3I0RGF0YS5hXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb2xvclByb2ZpbGVzOiB0aGVtZWQuY29sb3JQcm9maWxlcyxcclxuXHJcbiAgICAgICAgLy8gY29sb3I0Q2hhbmdlOiBjb2xvcjRDaGFuZ2UsXHJcbiAgICAgICAga2lsbENvbmRpdGlvbnM6IHRoZW1lZC5raWxsQ29uZGl0aW9ucyxcclxuICAgICAgICBjdXN0b21BdHRyaWJ1dGVzOiB0ZW1wQ3VzdG9tLFxyXG4gICAgICAgIC8vIHJlbmRlckZOOiB0aGVtZWQucmVuZGVyUGFydGljbGUgfHwgcmVuZGVyUGFydGljbGUsXHJcbiAgICAgICAgcmVuZGVyRk46IHRoZW1lZC5yZW5kZXJQYXJ0aWNsZSxcclxuICAgICAgICBldmVudHM6IHRoZW1lZC5ldmVudHNcclxuICAgIH07XHJcbiAgICBcclxuICAgIC8vIGNvbnNvbGUubG9nKCAnY29sb3I0RGF0YUVuZDogJywgY29sb3I0RGF0YUVuZCApO1xyXG4gICAgdmFyIGFuaW1BcnIgPSBbXTtcclxuICAgIHZhciBwYXJ0aWNsZUFuaW1UcmFja0FyciA9IHRoZW1lZC5hbmltYXRpb25UcmFja3M7XHJcbiAgICB2YXIgc3BsQ2hycyA9ICcuJztcclxuICAgIC8vIGNvbnNvbGUubG9nKCAndGhlbWVkLmFuaW1hdGlvblRyYWNrczogJywgdGhlbWVkLmFuaW1hdGlvblRyYWNrcyApO1xyXG4gICAgaWYgKHBhcnRpY2xlQW5pbVRyYWNrQXJyICYmIHBhcnRpY2xlQW5pbVRyYWNrQXJyLmxlbmd0aCkge1xyXG4gICAgICAgIHZhciBwYXJ0aWNsZUFuaW1UcmFja0FyckxlbiA9IHBhcnRpY2xlQW5pbVRyYWNrQXJyLmxlbmd0aDtcclxuICAgICAgICBmb3IgKHZhciBpID0gcGFydGljbGVBbmltVHJhY2tBcnJMZW4gLSAxOyBpID49IDA7IGktLSkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHQgPSBwYXJ0aWNsZUFuaW1UcmFja0FycltpXTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICd0OiAnLCB0ICk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcHJtID0gdC5wYXJhbS5zcGxpdChzcGxDaHJzKTtcclxuICAgICAgICAgICAgdmFyIHBybVRlbXAgPSB7IHBhdGg6IHBybSwgcGF0aExlbjogcHJtLmxlbmd0aCB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGJhc2VWYWwgPSBnZXRWYWx1ZSh0LmJhc2VBbW91bnQsIHBwYSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0VmFsID0gdm9pZCAwO1xyXG4gICAgICAgICAgICBpZiAodC50YXJnZXRWYWx1ZVBhdGgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZ2V0VmFsdWUodC50YXJnZXRWYWx1ZVBhdGgsIHBwYSkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRWYWwgPSBiYXNlVmFsICogLTE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFZhbCA9IGdldFZhbHVlKHQudGFyZ2V0VmFsdWVQYXRoLCBwcGEpIC0gYmFzZVZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0LnRhcmdldEFtb3VudCkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0VmFsID0gdC50YXJnZXRBbW91bnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IHZvaWQgMDtcclxuICAgICAgICAgICAgdC5kdXJhdGlvbiA9PT0gJ2xpZmUnID8gZHVyYXRpb24gPSBsaWZlIDogdC5kdXJhdGlvbiA8IDEgPyBkdXJhdGlvbiA9IGxpZmUgKiB0LmR1cmF0aW9uIDogdC5kdXJhdGlvbiA+IDEgPyBkdXJhdGlvbiA9IGxpZmUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGFuaW1BcnIucHVzaCh7IGFuaW1OYW1lOiB0LmFuaW1OYW1lLCBhY3RpdmU6IHQuYWN0aXZlLCBwYXJhbTogcHJtVGVtcCwgYmFzZUFtb3VudDogYmFzZVZhbCwgdGFyZ2V0QW1vdW50OiB0YXJnZXRWYWwsIGR1cmF0aW9uOiBkdXJhdGlvbiwgZWFzaW5nOiB0LmVhc2luZywgbGlua2VkQW5pbTogdC5saW5rZWRBbmltLCBsaW5rZWRFdmVudDogdC5saW5rZWRFdmVudCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHBhLmFuaW1hdGlvblRyYWNrcyA9IGFuaW1BcnI7XHJcblxyXG4gICAgcmV0dXJuIHBwYTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVBlclBhcnRpY2xlQXR0cmlidXRlcyA9IGNyZWF0ZVBlclBhcnRpY2xlQXR0cmlidXRlczsiLCJ2YXIga2lsbFBhcnRpY2xlID0gZnVuY3Rpb24ga2lsbFBhcnRpY2xlKGxpc3QsIGluZGV4LCBlbnRpdHlDb3VudGVyKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLmlzQWxpdmUgPSAwO1xyXG4gICAgbGlzdC5pbnNlcnQoaW5kZXgpO1xyXG4gICAgZW50aXR5Q291bnRlci5zdWJ0cmFjdCgxKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmtpbGxQYXJ0aWNsZSA9IGtpbGxQYXJ0aWNsZTsiLCJ2YXIgcmVuZGVyUGFydGljbGVBcnIgPSBmdW5jdGlvbiByZW5kZXJQYXJ0aWNsZUFycihjb250ZXh0LCBhcnIsIGFuaW1hdGlvbikge1xyXG4gICAgdmFyIHRoaXNBcnIgPSBhcnI7XHJcbiAgICB2YXIgYXJyTGVuID0gdGhpc0Fyci5sZW5ndGg7XHJcblxyXG4gICAgdmFyIHJlbmRlcmVkID0gMDtcclxuICAgIHZhciBub3RSZW5kZXJlZCA9IDA7XHJcbiAgICAvLyBjb25zb2xlLmxvZyggJ3JlbmRlcmluZyBsb29wJyApO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSBhcnJMZW4gLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIHZhciBwID0gdGhpc0FycltpXTtcclxuICAgICAgICBwLmlzQWxpdmUgIT0gMCA/IChwLnJlbmRlcihwLngsIHAueSwgcC5yLCBwLmNvbG9yNERhdGEsIGNvbnRleHQpLCByZW5kZXJlZCsrKSA6IG5vdFJlbmRlcmVkKys7XHJcbiAgICB9XHJcbiAgICAvLyBjb25zb2xlLmxvZyggJ3JlbmRlcmVkOiAnK3JlbmRlcmVkKycgbm90UmVuZGVyZWQ6ICcrbm90UmVuZGVyZWQgKTtcclxuICAgIC8vIG5vdFJlbmRlcmVkID09PSBhcnJMZW4gP1xyXG4gICAgLy8gKCBjb25zb2xlLmxvZyggJ25vdFJlbmRlcmVkID09PSAwOiBzdG9wIGFuaW0nICksIGFuaW1hdGlvbi5zdGF0ZSA9IGZhbHNlICkgOiAwO1xyXG4gICAgbm90UmVuZGVyZWQgPT09IGFyckxlbiA/IGFuaW1hdGlvbi5zdGF0ZSA9IGZhbHNlIDogMDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnJlbmRlclBhcnRpY2xlQXJyID0gcmVuZGVyUGFydGljbGVBcnI7IiwidmFyIGVhc2luZyA9IHJlcXVpcmUoJy4vLi4vZWFzaW5nLmpzJykuZWFzaW5nRXF1YXRpb25zO1xyXG52YXIgZW52aXJvbm1lbnQgPSByZXF1aXJlKCcuLy4uL2Vudmlyb25tZW50LmpzJykuZW52aXJvbm1lbnQ7XHJcbnZhciBwaHlzaWNzID0gZW52aXJvbm1lbnQuZm9yY2VzO1xyXG5cclxudmFyIHVwZGF0ZVBhcnRpY2xlID0gZnVuY3Rpb24gdXBkYXRlUGFydGljbGUoZW1pdHRlckFycikge1xyXG4gICAgdmFyIHAgPSB0aGlzO1xyXG4gICAgdmFyIHRvdGFsTGlmZVRpY2tzID0gcC5saWZlU3BhbjtcclxuXHJcbiAgICAvLyBwb3NpdGlvblxyXG4gICAgLy8gcC54ICs9IHAueFZlbCAqIHAubWFnbml0dWRlRGVjYXk7XHJcbiAgICAvLyBwLnkgKz0gcC55VmVsICogcC5tYWduaXR1ZGVEZWNheTtcclxuICAgIHAueCArPSBwLnhWZWw7XHJcbiAgICBwLnkgKz0gcC55VmVsO1xyXG5cclxuICAgIHAueFZlbCAqPSBwLnZBY2M7XHJcbiAgICBwLnlWZWwgKj0gcC52QWNjO1xyXG5cclxuICAgIC8vIHAueVZlbCArPSBwaHlzaWNzLmdyYXZpdHk7XHJcbiAgICAvLyBwLnhWZWwgKz0gcGh5c2ljcy53aW5kO1xyXG4gICAgLy8gcC5yZWxhdGl2ZU1hZ25pdHVkZSAqPSBwLm1hZ25pdHVkZURlY2F5O1xyXG5cclxuICAgIHAucmVsYXRpdmVNYWduaXR1ZGUgKj0gcC52QWNjICogMS4wMDU7XHJcblxyXG4gICAgaWYgKHAuYXBwbHlGb3JjZXMpIHtcclxuICAgICAgICBwLnlWZWwgKz0gcGh5c2ljcy5ncmF2aXR5O1xyXG4gICAgfVxyXG4gICAgLy8gc3BlZWRcclxuICAgIC8vIHAubWFnbml0dWRlRGVjYXkgPiAwID8gcC5tYWduaXR1ZGVEZWNheSAtPSBwaHlzaWNzLmZyaWN0aW9uIDogcC5tYWduaXR1ZGVEZWNheSA9IDA7XHJcblxyXG4gICAgLy8gcC5tYWduaXR1ZGVEZWNheSArPSAocC52QWNjICogMC4wMDAyNSk7XHJcbiAgICAvLyBwLm1hZ25pdHVkZURlY2F5ID0gZGVjY2VsZXJhdGVNYWduaXR1ZGUoIHAgKTtcclxuICAgIC8vIHAubWFnbml0dWRlRGVjYXkgPSBhY2NlbGVyYXRlTWFnbml0dWRlKCBwICk7XHJcblxyXG4gICAgLy8gbGlmZVxyXG4gICAgcC5jdXJyTGlmZUludiA9IHRvdGFsTGlmZVRpY2tzIC0gcC5jdXJyTGlmZTtcclxuICAgIHZhciBjdXJyTGlmZVRpY2sgPSBwLmN1cnJMaWZlSW52O1xyXG4gICAgLy8gc2l6ZSAocmFkaXVzIGZvciBjaXJjbGUpXHJcblxyXG5cclxuICAgIHZhciBhbmltVHJhY2tzID0gcC5hbmltYXRpb25UcmFja3M7XHJcbiAgICB2YXIgYW5pbVRyYWNrc0xlbiA9IGFuaW1UcmFja3MubGVuZ3RoO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSBhbmltVHJhY2tzTGVuIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ2knLCBpICk7XHJcbiAgICAgICAgdmFyIHQgPSBhbmltVHJhY2tzW2ldO1xyXG5cclxuICAgICAgICBpZiAodC5hY3RpdmUgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBwYXJhbVBhdGggPSB0LnBhcmFtLnBhdGgsXHJcbiAgICAgICAgICAgICAgICBwYXJhbUxlbiA9IHQucGFyYW0ucGF0aExlbjtcclxuXHJcbiAgICAgICAgICAgIHBhcmFtTGVuID09PSAxID8gcFtwYXJhbVBhdGhbMF1dID0gZWFzaW5nW3QuZWFzaW5nXShjdXJyTGlmZVRpY2ssIHQuYmFzZUFtb3VudCwgdC50YXJnZXRBbW91bnQsIHQuZHVyYXRpb24pIDogcGFyYW1MZW4gPT09IDIgPyBwW3BhcmFtUGF0aFswXV1bcGFyYW1QYXRoWzFdXSA9IGVhc2luZ1t0LmVhc2luZ10oY3VyckxpZmVUaWNrLCB0LmJhc2VBbW91bnQsIHQudGFyZ2V0QW1vdW50LCB0LmR1cmF0aW9uKSA6IHBhcmFtTGVuID09PSAzID8gcFtwYXJhbVBhdGhbMF1dW3BhcmFtUGF0aFsxXV1bcGFyYW1QYXRoWzJdXSA9IGVhc2luZ1t0LmVhc2luZ10oY3VyckxpZmVUaWNrLCB0LmJhc2VBbW91bnQsIHQudGFyZ2V0QW1vdW50LCB0LmR1cmF0aW9uKSA6IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJMaWZlVGljayA9PT0gdC5kdXJhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdC5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodC5saW5rZWRFdmVudCAhPT0gZmFsc2UgJiYgdHlwZW9mIHQubGlua2VkRXZlbnQgIT09ICd1bmRlZmluZWQnKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJ0aWNsZUV2ZW50cyA9IHAuZXZlbnRzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gcGFydGljbGVFdmVudHMubGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzUGFydGljbGVFdmVudCA9IHAuZXZlbnRzWyBqIF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzUGFydGljbGVFdmVudC5ldmVudFR5cGUgPSB0LmxpbmtlZEV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodC5saW5rZWRFdmVudCA9PT0gJ2VtaXQnKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzUGFydGljbGVFdmVudFBhcmFtcyA9IHRoaXNQYXJ0aWNsZUV2ZW50LmV2ZW50UGFyYW1zO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNQYXJ0aWNsZUV2ZW50UGFyYW1zLmVtaXR0ZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNQYXJ0aWNsZUV2ZW50UGFyYW1zLmVtaXR0ZXIudHJpZ2dlckVtaXR0ZXIoeyB4OiBwLngsIHk6IHAueSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gZW1pdHRlckFyci5sZW5ndGggLSAxOyBrID49IDA7IGstLSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtaXR0ZXJBcnJbIGsgXS5uYW1lID09PSB0aGlzUGFydGljbGVFdmVudFBhcmFtcy5lbWl0dGVyTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNQYXJ0aWNsZUV2ZW50UGFyYW1zLmVtaXR0ZXIgPSBlbWl0dGVyQXJyWyBrIF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1BhcnRpY2xlRXZlbnRQYXJhbXMuZW1pdHRlci50cmlnZ2VyRW1pdHRlcih7IHg6IHAueCwgeTogcC55IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwLmlkeCA9PSA5OTg3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS53YXJuKCAnZmxpcHBpbmcgYW5pbScgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodC5saW5rZWRBbmltICE9PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBsID0gYW5pbVRyYWNrc0xlbiAtIDE7IGwgPj0gMDsgbC0tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmltVHJhY2tzWyBsIF0uYW5pbU5hbWUgPT09IHQubGlua2VkQW5pbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVRyYWNrc1sgbCBdLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHAuaWR4ID09IDk5ODcpIHt9XHJcbiAgICAvLyBjb25zb2xlLmxvZyggJ3RoaXNQYXJ0aWNsZUFscGhhJywgIHAuY29sb3I0RGF0YS5hICk7XHJcblxyXG5cclxuICAgIC8vIGxpZmUgdGFrZXRoIGF3YXlcclxuICAgIHAuY3VyckxpZmUtLTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnVwZGF0ZVBhcnRpY2xlID0gdXBkYXRlUGFydGljbGU7IiwidmFyIHBhcnRpY2xlRm4gPSByZXF1aXJlKCcuLy4uL3BhcnRpY2xlRm4uanMnKS5wYXJ0aWNsZUZuO1xyXG5cclxudmFyIHVwZGF0ZVBhcnRpY2xlQXJyID0gZnVuY3Rpb24gdXBkYXRlUGFydGljbGVBcnIoY29udGV4dCwgc3RvcmVBcnIsIHBvb2xBcnIsIGFuaW1hdGlvbiwgY2FudmFzQ29uZmlnLCBlbnRpdHlDb3VudGVyLCBlbWl0dGVyU3RvcmUpIHtcclxuICAgIC8vIGxvb3AgaG91c2VrZWVwaW5nXHJcbiAgICB2YXIgYXJyID0gc3RvcmVBcnI7XHJcbiAgICB2YXIgYXJyTGVuID0gYXJyLmxlbmd0aCAtIDE7XHJcbiAgICBmb3IgKHZhciBpID0gYXJyTGVuOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIHZhciBwID0gYXJyW2ldO1xyXG4gICAgICAgIHAuaXNBbGl2ZSAhPSAwID8gcGFydGljbGVGbi5jaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnMocCwgY2FudmFzQ29uZmlnLndpZHRoLCBjYW52YXNDb25maWcuaGVpZ2h0KSA/IHAua2lsbChwb29sQXJyLCBwLmlkeCwgZW50aXR5Q291bnRlcikgOiBwLnVwZGF0ZShlbWl0dGVyU3RvcmUpIDogZmFsc2U7XHJcbiAgICB9IC8vIGVuZCBGb3IgbG9vcFxyXG4gICAgLy8gbGl2ZUVudGl0eUNvdW50ID09PSAwID8gKCBjb25zb2xlLmxvZyggJ2xpdmVFbnRpdHlDb3VudCA9PT0gMCBzdG9wIGFuaW0nICksIGFuaW1hdGlvbi5zdGF0ZSA9IGZhbHNlICkgOiAwO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMudXBkYXRlUGFydGljbGVBcnIgPSB1cGRhdGVQYXJ0aWNsZUFycjsiLCJ2YXIgZmlyZVRoZW1lID0gcmVxdWlyZSgnLi90aGVtZXMvZmlyZS90aGVtZS5qcycpLmZpcmVUaGVtZTtcclxudmFyIHJlc2V0VGhlbWUgPSByZXF1aXJlKCcuL3RoZW1lcy9yZXNldC9yZXNldFRoZW1lLmpzJykucmVzZXRUaGVtZTtcclxudmFyIHdhcnBTdGFyVGhlbWUgPSByZXF1aXJlKCcuL3RoZW1lcy93YXJwU3Rhci93YXJwU3RhclRoZW1lLmpzJykud2FycFN0YXJUaGVtZTtcclxudmFyIGZsYW1lVGhlbWUgPSByZXF1aXJlKCcuL3RoZW1lcy9mbGFtZS9mbGFtZVRoZW1lLmpzJykuZmxhbWVUaGVtZTtcclxudmFyIHNtb2tlVGhlbWUgPSByZXF1aXJlKCcuL3RoZW1lcy9zbW9rZS9zbW9rZVRoZW1lLmpzJykuc21va2VUaGVtZTtcclxuXHJcbnZhciB0aGVtZXMgPSB7XHJcbiAgIHJlc2V0OiByZXNldFRoZW1lLFxyXG4gICBmaXJlOiBmaXJlVGhlbWUsXHJcbiAgIHdhcnBTdGFyOiB3YXJwU3RhclRoZW1lLFxyXG4gICBmbGFtZTogZmxhbWVUaGVtZSxcclxuICAgc21va2U6IHNtb2tlVGhlbWVcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnRoZW1lcyA9IHRoZW1lczsiLCJ2YXIgYW5pbWF0aW9uVHJhY2tzID0gW1xyXG5cdHtcclxuXHRcdCAgYW5pbU5hbWU6ICdyYWRpdXNGYWRlJyxcclxuXHRcdCAgYWN0aXZlOiB0cnVlLFxyXG5cdFx0ICBwYXJhbTogJ3InLFxyXG5cdFx0ICBiYXNlQW1vdW50OiAnaW5pdFInLFxyXG5cdFx0ICB0YXJnZXRWYWx1ZVBhdGg6ICd0UicsXHJcblx0XHQgIC8vIHRhcmdldEFtb3VudDogMC4wMDAwMixcclxuXHRcdCAgZHVyYXRpb246ICdsaWZlJyxcclxuXHRcdCAgZWFzaW5nOiAnZWFzZUluRXhwbycsXHJcblx0XHQgIGxpbmtlZEFuaW06IGZhbHNlXHJcblx0fSxcclxuXHR7XHJcblx0XHQgIGFuaW1OYW1lOiAnY29sb3I0RGF0YUNoYW5nZVJlZCcsXHJcblx0XHQgIGFjdGl2ZTogdHJ1ZSxcclxuXHRcdCAgcGFyYW06ICdjb2xvcjREYXRhLnInLFxyXG5cdFx0ICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5yJyxcclxuXHRcdCAgdGFyZ2V0VmFsdWVQYXRoOiAnY29sb3JQcm9maWxlc1sxXS5yJyxcclxuXHRcdCAgZHVyYXRpb246ICdsaWZlJyxcclxuXHRcdCAgZWFzaW5nOiAnZWFzZUluT3V0Qm91bmNlJyxcclxuXHRcdCAgbGlua2VkQW5pbTogZmFsc2VcclxuXHR9LFxyXG5cdHtcclxuXHRcdCAgYW5pbU5hbWU6ICdjb2xvcjREYXRhQ2hhbmdlR3JlZW4nLFxyXG5cdFx0ICBhY3RpdmU6IHRydWUsXHJcblx0XHQgIHBhcmFtOiAnY29sb3I0RGF0YS5nJyxcclxuXHRcdCAgYmFzZUFtb3VudDogJ2NvbG9yUHJvZmlsZXNbMF0uZycsXHJcblx0XHQgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbMV0uZycsXHJcblx0XHQgIGR1cmF0aW9uOiAnbGlmZScsXHJcblx0XHQgIGVhc2luZzogJ2Vhc2VJbk91dEJvdW5jZScsXHJcblx0XHQgIGxpbmtlZEFuaW06IGZhbHNlXHJcblx0fSxcclxuXHR7XHJcblx0XHQgIGFuaW1OYW1lOiAnY29sb3I0RGF0YUNoYW5nZUJsdWUnLFxyXG5cdFx0ICBhY3RpdmU6IHRydWUsXHJcblx0XHQgIHBhcmFtOiAnY29sb3I0RGF0YS5iJyxcclxuXHRcdCAgYmFzZUFtb3VudDogJ2NvbG9yUHJvZmlsZXNbMF0uYicsXHJcblx0XHQgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbMV0uYicsXHJcblx0XHQgIGR1cmF0aW9uOiAnbGlmZScsXHJcblx0XHQgIGVhc2luZzogJ2Vhc2VPdXRFeHBvJyxcclxuXHRcdCAgbGlua2VkQW5pbTogZmFsc2VcclxuXHR9LFxyXG5cdHtcclxuXHRcdCAgYW5pbU5hbWU6ICdjb2xvcjREYXRhQ2hhbmdlQWxwaGEnLFxyXG5cdFx0ICBhY3RpdmU6IHRydWUsXHJcblx0XHQgIHBhcmFtOiAnY29sb3I0RGF0YS5hJyxcclxuXHRcdCAgYmFzZUFtb3VudDogJ2NvbG9yUHJvZmlsZXNbMF0uYScsXHJcblx0XHQgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbM10uYScsXHJcblx0XHQgIGR1cmF0aW9uOiAnbGlmZScsXHJcblx0XHQgIGVhc2luZzogJ2Vhc2VJblF1aW50JyxcclxuXHRcdCAgbGlua2VkQW5pbTogZmFsc2VcclxuXHR9XHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5hbmltYXRpb25UcmFja3MgPSBhbmltYXRpb25UcmFja3M7IiwidmFyIGN1c3RvbUF0dHJpYnV0ZXMgPSB7XHJcbiAgICBsZW5zRmxhcmU6IHtcclxuICAgICAgICBtaWdodEZsYXJlOiB0cnVlLFxyXG4gICAgICAgIHdpbGxGbGFyZTogZmFsc2UsXHJcbiAgICAgICAgYW5nbGU6IDAuMzBcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmN1c3RvbUF0dHJpYnV0ZXMgPSBjdXN0b21BdHRyaWJ1dGVzOyIsInZhciBraWxsQ29uZGl0aW9ucyA9IHtcclxuICAgIGJvdW5kYXJ5Q2hlY2s6IHRydWUsXHJcbiAgICBib3VuZGFyeU9mZnNldDogMCxcclxuICAgIGNvbG9yQ2hlY2s6IFt7IG5hbWU6ICdhJywgdmFsdWU6IDAgfV0sXHJcbiAgICBwZXJBdHRyaWJ1dGU6IFt7IG5hbWU6ICdyYWRpdXMnLCB2YWx1ZTogMCB9LCB7IG5hbWU6ICdjdXJyTGlmZScsIHZhbHVlOiAwIH1dXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5raWxsQ29uZGl0aW9ucyA9IGtpbGxDb25kaXRpb25zOyIsIi8vIHV0aWxpdGllc1xyXG52YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcbnZhciB0cmlnID0gcmVxdWlyZSgnLi8uLi8uLi8uLi90cmlnb25vbWljVXRpbHMuanMnKS50cmlnb25vbWljVXRpbHM7XHJcblxyXG52YXIgcmVuZGVyRm4gPSBmdW5jdGlvbiByZW5kZXJGbih4LCB5LCByLCBjb2xvckRhdGEsIGNvbnRleHQpIHtcclxuICAgIHZhciBwID0gdGhpcztcclxuICAgIC8vIGNvbnNvbGUubG9nKCAncC5yZW5kZXI6ICcsIHAgKTtcclxuICAgIHZhciBuZXdBbmdsZSA9IHRyaWcuZ2V0QW5nbGVBbmREaXN0YW5jZSh4LCB5LCB4ICsgcC54VmVsLCB5ICsgcC55VmVsKTtcclxuICAgIHZhciBjb21waWxlZENvbG9yID0gXCJyZ2JhKFwiICsgY29sb3JEYXRhLnIgKyAnLCcgKyBjb2xvckRhdGEuZyArICcsJyArIGNvbG9yRGF0YS5iICsgXCIsXCIgKyBjb2xvckRhdGEuYSArIFwiKVwiO1xyXG4gICAgdmFyIGVuZENvbG9yID0gXCJyZ2JhKFwiICsgY29sb3JEYXRhLnIgKyAnLCcgKyBjb2xvckRhdGEuZyArICcsJyArIGNvbG9yRGF0YS5iICsgXCIsIDApXCI7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGNvbXBpbGVkQ29sb3I7XHJcbiAgICB2YXIgc3RyZXRjaFZhbCA9IG1hdGhVdGlscy5tYXAocC5yZWxhdGl2ZU1hZ25pdHVkZSwgMCwgMTAwLCAxLCAxMCk7XHJcblxyXG4gICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICBjb250ZXh0LnRyYW5zbGF0ZSh4LCB5KTtcclxuICAgIC8vIGNvbnRleHQucm90YXRlKCBwLmFuZ2xlICk7XHJcbiAgICBjb250ZXh0LnJvdGF0ZShuZXdBbmdsZS5hbmdsZSk7XHJcbiAgICBjb250ZXh0LmZpbGxFbGxpcHNlKDAsIDAsIHIgKiBzdHJldGNoVmFsLCByLCBjb250ZXh0KTtcclxuICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMucmVuZGVyRm4gPSByZW5kZXJGbjsiLCIvLyB1dGlsaXRpZXNcclxudmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG5cclxuLy8gdGhlbWUgcGFydGlhbHNcclxudmFyIGFuaW1hdGlvblRyYWNrcyA9IHJlcXVpcmUoJy4vYW5pbWF0aW9uVHJhY2tzLmpzJykuYW5pbWF0aW9uVHJhY2tzO1xyXG52YXIga2lsbENvbmRpdGlvbnMgPSByZXF1aXJlKCcuL2tpbGxDb25kaXRpb25zLmpzJykua2lsbENvbmRpdGlvbnM7XHJcbnZhciBjdXN0b21BdHRyaWJ1dGVzID0gcmVxdWlyZSgnLi9jdXN0b21BdHRyaWJ1dGVzLmpzJykuY3VzdG9tQXR0cmlidXRlcztcclxudmFyIHJlbmRlckZuID0gcmVxdWlyZSgnLi9yZW5kZXJGbi5qcycpLnJlbmRlckZuO1xyXG5cclxudmFyIGZpcmVUaGVtZSA9IHtcclxuICAgIGNvbnRleHRCbGVuZGluZ01vZGU6ICdsaWdodGVyJyxcclxuICAgIGFjdGl2ZTogMSxcclxuICAgIGxpZmU6IHsgbWluOiAyMCwgbWF4OiAxMDAgfSxcclxuICAgIGFuZ2xlOiB7IG1pbjogMCwgbWF4OiAyIH0sXHJcbiAgICBtYWdEZWNheTogMSxcclxuICAgIC8vIHZlbEFjY2VsZXJhdGlvbjogMC45LFxyXG4gICAgdmVsQWNjZWxlcmF0aW9uOiB7IG1pbjogMC43LCBtYXg6IDAuODUgfSxcclxuICAgIHJhZGl1czogeyBtaW46IDAuNSwgbWF4OiAyMCB9LFxyXG4gICAgdGFyZ2V0UmFkaXVzOiB7IG1pbjogMCwgbWF4OiAwIH0sXHJcbiAgICBhcHBseUdsb2JhbEZvcmNlczogdHJ1ZSxcclxuICAgIGNvbG9yUHJvZmlsZXM6IFt7IHI6IDI1NSwgZzogMjU1LCBiOiAyNTUsIGE6IDEgfSwgeyByOiAyMTUsIGc6IDAsIGI6IDAsIGE6IDAgfSwgeyByOiAwLCBnOiAyMTUsIGI6IDAsIGE6IDAgfSwgeyByOiAwLCBnOiAwLCBiOiAyMTUsIGE6IDAgfV0sXHJcbiAgICByZW5kZXJQcm9maWxlczogW3sgc2hhcGU6ICdDaXJjbGUnLCBjb2xvclByb2ZpbGVJZHg6IDAgfV0sXHJcbiAgICBjdXN0b21BdHRyaWJ1dGVzOiBjdXN0b21BdHRyaWJ1dGVzLFxyXG4gICAgYW5pbWF0aW9uVHJhY2tzOiBhbmltYXRpb25UcmFja3MsXHJcbiAgICBraWxsQ29uZGl0aW9uczoga2lsbENvbmRpdGlvbnMsXHJcbiAgICByZW5kZXJQYXJ0aWNsZTogcmVuZGVyRm5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmZpcmVUaGVtZSA9IGZpcmVUaGVtZTsiLCJ2YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcbnZhciBjb2xvcmluZyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vY29sb3JVdGlscy5qcycpLmNvbG9yVXRpbHM7XHJcbnZhciB0cmlnID0gcmVxdWlyZSgnLi8uLi8uLi8uLi90cmlnb25vbWljVXRpbHMuanMnKS50cmlnb25vbWljVXRpbHM7XHJcblxyXG52YXIgcmdiYSA9IGNvbG9yaW5nLnJnYmE7XHJcblxyXG52YXIgZmxhbWVUaGVtZSA9IHtcclxuICAgIGNvbnRleHRCbGVuZGluZ01vZGU6ICdsaWdodGVyJyxcclxuICAgIGFjdGl2ZTogMSxcclxuICAgIGxpZmU6IHsgbWluOiAzMCwgbWF4OiA2MCB9LFxyXG4gICAgYW5nbGU6IHsgbWluOiAxLjQ1LCBtYXg6IDEuNTUgfSxcclxuICAgIC8vIG1hZzogeyBtaW46IDgsIG1heDogMTMgfSxcclxuICAgIC8vIHZlbEFjY2VsZXJhdGlvbjogMS4wNSxcclxuICAgIHZlbEFjY2VsZXJhdGlvbjogeyBtaW46IDEsIG1heDogMSB9LFxyXG4gICAgbWFnRGVjYXk6IDEuNSxcclxuICAgIHJhZGl1czogeyBtaW46IDEwMCwgbWF4OiAxODAgfSxcclxuICAgIHRhcmdldFJhZGl1czogeyBtaW46IDEsIG1heDogMiB9LFxyXG4gICAgYXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlLFxyXG4gICAgY29sb3JQcm9maWxlczogW3sgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMC41IH0sIHsgcjogMjU1LCBnOiAwLCBiOiAwLCBhOiAxIH1dLFxyXG4gICAgcmVuZGVyUHJvZmlsZXM6IFt7IHNoYXBlRm46ICdmaWxsQ2lyY2xlJywgY29sb3JQcm9maWxlSWR4OiAwIH1dLFxyXG4gICAgY3VzdG9tQXR0cmlidXRlczoge1xyXG4gICAgICAgIGxlbnNGbGFyZToge1xyXG4gICAgICAgICAgICBtaWdodEZsYXJlOiB0cnVlLFxyXG4gICAgICAgICAgICB3aWxsRmxhcmU6IGZhbHNlLFxyXG4gICAgICAgICAgICBhbmdsZTogMC4zMFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwcm94aW1pdHk6IHtcclxuICAgICAgICBjaGVjazogZmFsc2UsXHJcbiAgICAgICAgdGhyZXNob2xkOiA1MFxyXG4gICAgfSxcclxuICAgIGFuaW1hdGlvblRyYWNrczogW3tcclxuICAgICAgICBhbmltTmFtZTogJ3JhZGl1c0ZhZGUnLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBwYXJhbTogJ3InLFxyXG4gICAgICAgIGJhc2VBbW91bnQ6ICdpbml0UicsXHJcbiAgICAgICAgdGFyZ2V0VmFsdWVQYXRoOiAndFInLFxyXG4gICAgICAgIGR1cmF0aW9uOiAnbGlmZScsXHJcbiAgICAgICAgZWFzaW5nOiAnZWFzZUluRXhwbycsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgIH0sIHtcclxuICAgICAgICBhbmltTmFtZTogJ2NvbG9yNERhdGFDaGFuZ2VHcmVlbicsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5nJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5nJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmcnLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjQsXHJcbiAgICAgICAgZWFzaW5nOiAnZWFzZUluUXVhcnQnLFxyXG4gICAgICAgIGxpbmtlZEFuaW06IGZhbHNlXHJcbiAgICB9LCB7XHJcbiAgICAgICAgYW5pbU5hbWU6ICdjb2xvcjREYXRhQ2hhbmdlQmx1ZScsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5iJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5iJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmInLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjUsXHJcbiAgICAgICAgZWFzaW5nOiAnZWFzZU91dFF1YXJ0JyxcclxuICAgICAgICBsaW5rZWRBbmltOiBmYWxzZVxyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnYWxwaGFEZWxheScsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5hJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5hJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzBdLmEnLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjUsXHJcbiAgICAgICAgZWFzaW5nOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgbGlua2VkQW5pbTogJ2FscGhhRmFkZUluJ1xyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnYWxwaGFGYWRlSW4nLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBwYXJhbTogJ2NvbG9yNERhdGEuYScsXHJcbiAgICAgICAgYmFzZUFtb3VudDogJ2NvbG9yUHJvZmlsZXNbMF0uYScsXHJcbiAgICAgICAgdGFyZ2V0VmFsdWVQYXRoOiAnY29sb3JQcm9maWxlc1sxXS5hJyxcclxuICAgICAgICBkdXJhdGlvbjogMC4yLFxyXG4gICAgICAgIGVhc2luZzogJ2Vhc2VJblF1aW50JyxcclxuICAgICAgICBsaW5rZWRBbmltOiAnYWxwaGFGYWRlT3V0J1xyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnYWxwaGFGYWRlT3V0JyxcclxuICAgICAgICBhY3RpdmU6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5hJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1sxXS5hJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzBdLmEnLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjMsXHJcbiAgICAgICAgZWFzaW5nOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2UsXHJcbiAgICAgICAgLy8gbGlua2VkRXZlbnQ6ICdlbWl0JyxcclxuICAgICAgICBsaW5rZWRFdmVudDogZmFsc2VcclxuXHJcbiAgICB9XSxcclxuXHJcbiAgICBldmVudHM6IFt7XHJcbiAgICAgICAgZXZlbnRUeXBlOiAnZW1pdCcsXHJcbiAgICAgICAgZXZlbnRQYXJhbXM6IHtcclxuICAgICAgICAgICAgZW1pdHRlck5hbWU6ICdzbW9rZUVtaXR0ZXInXHJcbiAgICAgICAgfVxyXG4gICAgfV0sXHJcblxyXG4gICAga2lsbENvbmRpdGlvbnM6IHtcclxuICAgICAgICBib3VuZGFyeUNoZWNrOiB0cnVlLFxyXG4gICAgICAgIGJvdW5kYXJ5T2Zmc2V0OiAwLFxyXG4gICAgICAgIGNvbG9yQ2hlY2s6IFtdLFxyXG4gICAgICAgIHBlckF0dHJpYnV0ZTogW3sgbmFtZTogJ3JhZGl1cycsIHZhbHVlOiAwIH0sIHsgbmFtZTogJ2N1cnJMaWZlJywgdmFsdWU6IDAgfV0sXHJcbiAgICAgICAgbGlua2VkRXZlbnQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyUGFydGljbGU6IGZ1bmN0aW9uIHJlbmRlclBhcnRpY2xlKHgsIHksIHIsIGNvbG9yRGF0YSwgY29udGV4dCkge1xyXG4gICAgICAgIHZhciBwID0gdGhpcztcclxuICAgICAgICB2YXIgc3RyZXRjaFZhbCA9IG1hdGhVdGlscy5tYXAocC5jdXJyTGlmZUludiwgMCwgcC5saWZlU3BhbiwgMSwgNSk7XHJcbiAgICAgICAgdmFyIG9mZnNldE1hcCA9IG1hdGhVdGlscy5tYXAocC5jdXJyTGlmZUludiwgMCwgcC5saWZlU3BhbiwgMCwgMSk7XHJcbiAgICAgICAgdmFyIG5ld0FuZ2xlID0gdHJpZy5nZXRBbmdsZUFuZERpc3RhbmNlKHgsIHksIHggKyBwLnhWZWwsIHkgKyBwLnlWZWwpO1xyXG4gICAgICAgIGlmIChjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiAhPT0gJ2xpZ2h0ZXInKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2xpZ2h0ZXInO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LnNhdmUoKTtcclxuICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSh4LCB5KTtcclxuICAgICAgICAvLyBjb250ZXh0LnNhdmUoKTtcclxuICAgICAgICB2YXIgYWxwaGEgPSBjb2xvckRhdGEuYTtcclxuICAgICAgICBpZiAoYWxwaGEgPiAxKSB7XHJcbiAgICAgICAgICAgIGFscGhhID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG9mZnNldCA9IHIgKiBvZmZzZXRNYXA7XHJcbiAgICAgICAgLy8gLy8gdmFyIG9mZnNldCA9IDA7XHJcbiAgICAgICAgdmFyIGdyZCA9IGNvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoMCwgMCArIG9mZnNldCwgMCwgMCwgMCArIG9mZnNldCwgcik7XHJcbiAgICAgICAgLy8gdmFyIGdyZCA9IGNvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgMCwgeCwgeSwgcik7XHJcbiAgICAgICAgZ3JkLmFkZENvbG9yU3RvcCgwLCByZ2JhKGNvbG9yRGF0YS5yLCBjb2xvckRhdGEuZywgY29sb3JEYXRhLmIsIDAuMDMgKiBhbHBoYSkpO1xyXG4gICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMC41LCByZ2JhKGNvbG9yRGF0YS5yLCBjb2xvckRhdGEuZywgY29sb3JEYXRhLmIsIDAuMDYgKiBhbHBoYSkpO1xyXG4gICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMC43LCByZ2JhKGNvbG9yRGF0YS5yLCBjb2xvckRhdGEuZywgY29sb3JEYXRhLmIsIDAuMDY1ICogYWxwaGEpKTtcclxuICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAuODUsIHJnYmEoY29sb3JEYXRhLnIsIGNvbG9yRGF0YS5nLCBjb2xvckRhdGEuYiwgMC4wMTUgKiBhbHBoYSkpO1xyXG4gICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMSwgcmdiYShjb2xvckRhdGEuciwgY29sb3JEYXRhLmcsIGNvbG9yRGF0YS5iLCAwKSk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBncmQ7XHJcblxyXG4gICAgICAgIGNvbnRleHQucm90YXRlKG5ld0FuZ2xlLmFuZ2xlKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxFbGxpcHNlKDAsIDAsIHIgKiBzdHJldGNoVmFsLCByLCBjb250ZXh0KTtcclxuICAgICAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmZsYW1lVGhlbWUgPSBmbGFtZVRoZW1lOyIsInZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuLy4uLy4uLy4uL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxuXHJcbnZhciByZXNldFRoZW1lID0ge1xyXG4gICAgZW1taXNpb25SYXRlOiB7IG1pbjogMCwgbWF4OiAwIH0sXHJcbiAgICBjb250ZXh0QmxlbmRpbmdNb2RlOiAnc291cmNlLW92ZXInLFxyXG4gICAgYWN0aXZlOiAwLFxyXG4gICAgbGlmZTogeyBtaW46IDAsIG1heDogMCB9LFxyXG4gICAgYW5nbGU6IHsgbWluOiAwLCBtYXg6IDAgfSxcclxuICAgIG1hZzogeyBtaW46IDAsIG1heDogMCB9LFxyXG4gICAgbWFnRGVjYXk6IDAsXHJcbiAgICAvLyB2ZWxBY2NlbGVyYXRpb246IDEsIC8vIDAgLSAxIChpLmUuIDAuNSkgPSBkZWNjZWxlcmF0aW9uLCAxKyAoaS5lLiAxLjIpID0gYWNjZWxlcmF0aW9uXHJcbiAgICB2ZWxBY2NlbGVyYXRpb246IHsgbWluOiAxLCBtYXg6IDEgfSxcclxuICAgIHJhZGl1czogeyBtaW46IDAsIG1heDogMCB9LFxyXG4gICAgdGFyZ2V0UmFkaXVzOiB7IG1pbjogMCwgbWF4OiAwIH0sXHJcbiAgICBzaHJpbmtSYXRlOiAwLFxyXG4gICAgcmFkaWFsRGlzcGxhY2VtZW50OiAwLFxyXG4gICAgcmFkaWFsRGlzcGxhY2VtZW50T2Zmc2V0OiAwLFxyXG4gICAgYXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlLFxyXG4gICAgY29sb3JQcm9maWxlczogW3sgcjogMCwgZzogMCwgYjogMCwgYTogMCB9XSxcclxuICAgIHJlbmRlclByb2ZpbGVzOiBbeyBzaGFwZTogJ0NpcmNsZScsIGNvbG9yUHJvZmlsZUlkeDogMCB9XSxcclxuICAgIGNvbG9yU3RhcnQ6IHtcclxuICAgICAgICByOiAwLFxyXG4gICAgICAgIGc6IDAsXHJcbiAgICAgICAgYjogMCxcclxuICAgICAgICBhOiAwXHJcbiAgICB9LFxyXG4gICAgY29sb3JFbmQ6IHtcclxuICAgICAgICByOiAwLFxyXG4gICAgICAgIGc6IDAsXHJcbiAgICAgICAgYjogMCxcclxuICAgICAgICBhOiAwXHJcbiAgICB9LFxyXG4gICAgY3VzdG9tQXR0cmlidXRlczoge1xyXG4gICAgICAgIGxlbnNGbGFyZToge1xyXG4gICAgICAgICAgICBtaWdodEZsYXJlOiB0cnVlLFxyXG4gICAgICAgICAgICB3aWxsRmxhcmU6IGZhbHNlLFxyXG4gICAgICAgICAgICBhbmdsZTogMC4zMFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb2xvckFuaW1hdGlvbkNvbmZpZzoge1xyXG4gICAgICAgIGVhc2luZzoge1xyXG4gICAgICAgICAgICByOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgICAgIGc6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICAgICAgYjogJ2xpbmVhckVhc2UnLFxyXG4gICAgICAgICAgICBhOiAnbGluZWFyRWFzZSdcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYW5pbWF0aW9uVHJhY2tzOiBbXSxcclxuICAgIGtpbGxDb25kaXRpb25zOiB7XHJcbiAgICAgICAgYm91bmRhcnlDaGVjazogZmFsc2UsXHJcbiAgICAgICAgY29sb3JDaGVjazogW10sXHJcbiAgICAgICAgcGVyQXR0cmlidXRlOiBbXVxyXG4gICAgfSxcclxuICAgIHJlbmRlclBhcnRpY2xlOiBmYWxzZVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMucmVzZXRUaGVtZSA9IHJlc2V0VGhlbWU7IiwidmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG52YXIgY29sb3JpbmcgPSByZXF1aXJlKCcuLy4uLy4uLy4uL2NvbG9yVXRpbHMuanMnKS5jb2xvclV0aWxzO1xyXG52YXIgcmdiYSA9IGNvbG9yaW5nLnJnYmE7XHJcblxyXG52YXIgc21va2VUaGVtZSA9IHtcclxuICAgIGNvbnRleHRCbGVuZGluZ01vZGU6ICdzb3VyY2Utb3ZlcicsXHJcbiAgICBhY3RpdmU6IDEsXHJcbiAgICBsaWZlOiB7IG1pbjogNDAwLCBtYXg6IDUwMCB9LFxyXG4gICAgYW5nbGU6IHsgbWluOiAxLjQ1LCBtYXg6IDEuNTUgfSxcclxuICAgIC8vIHZlbEFjY2VsZXJhdGlvbjogMS4wNSxcclxuICAgIHZlbEFjY2VsZXJhdGlvbjogeyBtaW46IDAuOTk5LCBtYXg6IDAuOTk5OSB9LFxyXG4gICAgLy8gbWFnRGVjYXk6IDEuNSxcclxuICAgIHJhZGl1czogeyBtaW46IDMwLCBtYXg6IDUwIH0sXHJcbiAgICB0YXJnZXRSYWRpdXM6IHsgbWluOiA3MCwgbWF4OiAxMzAgfSxcclxuICAgIGFwcGx5R2xvYmFsRm9yY2VzOiBmYWxzZSxcclxuICAgIGNvbG9yUHJvZmlsZXM6IFt7IHI6IDEwMCwgZzogMTAwLCBiOiAxMDAsIGE6IDAgfSwgeyByOiAwLCBnOiAwLCBiOiAwLCBhOiAwLjA1IH0sIHsgcjogMTAwLCBnOiAxMDAsIGI6IDEwMCwgYTogMCB9XSxcclxuICAgIHJlbmRlclByb2ZpbGVzOiBbeyBzaGFwZUZuOiAnZmlsbENpcmNsZScsIGNvbG9yUHJvZmlsZUlkeDogMCB9XSxcclxuICAgIGN1c3RvbUF0dHJpYnV0ZXM6IHtcclxuICAgICAgICBsZW5zRmxhcmU6IHtcclxuICAgICAgICAgICAgbWlnaHRGbGFyZTogdHJ1ZSxcclxuICAgICAgICAgICAgd2lsbEZsYXJlOiBmYWxzZSxcclxuICAgICAgICAgICAgYW5nbGU6IDAuMzBcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHJveGltaXR5OiB7XHJcbiAgICAgICAgY2hlY2s6IGZhbHNlLFxyXG4gICAgICAgIHRocmVzaG9sZDogNTBcclxuICAgIH0sXHJcbiAgICBhbmltYXRpb25UcmFja3M6IFt7XHJcbiAgICAgICAgYW5pbU5hbWU6ICdyYWRpdXNHcm93JyxcclxuICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgcGFyYW06ICdyJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnaW5pdFInLFxyXG4gICAgICAgIHRhcmdldFZhbHVlUGF0aDogJ3RSJyxcclxuICAgICAgICBkdXJhdGlvbjogJ2xpZmUnLFxyXG4gICAgICAgIGVhc2luZzogJ2xpbmVhckVhc2UnLFxyXG4gICAgICAgIGxpbmtlZEFuaW06IGZhbHNlXHJcbiAgICB9LCB7XHJcbiAgICAgICAgYW5pbU5hbWU6ICdhbHBoYUZhZGVJbicsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5hJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5hJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmEnLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjEsXHJcbiAgICAgICAgZWFzaW5nOiAnZWFzZU91dFF1aW50JyxcclxuICAgICAgICBsaW5rZWRBbmltOiBmYWxzZVxyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAncmVkJyxcclxuICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgcGFyYW06ICdjb2xvcjREYXRhLnInLFxyXG4gICAgICAgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLnInLFxyXG4gICAgICAgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbMV0ucicsXHJcbiAgICAgICAgZHVyYXRpb246IDAuMixcclxuICAgICAgICBlYXNpbmc6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICBsaW5rZWRBbmltOiBmYWxzZVxyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnZ3JlZW4nLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBwYXJhbTogJ2NvbG9yNERhdGEuZycsXHJcbiAgICAgICAgYmFzZUFtb3VudDogJ2NvbG9yUHJvZmlsZXNbMF0uZycsXHJcbiAgICAgICAgdGFyZ2V0VmFsdWVQYXRoOiAnY29sb3JQcm9maWxlc1sxXS5nJyxcclxuICAgICAgICBkdXJhdGlvbjogMC4yLFxyXG4gICAgICAgIGVhc2luZzogJ2xpbmVhckVhc2UnLFxyXG4gICAgICAgIGxpbmtlZEFuaW06IGZhbHNlXHJcbiAgICB9LCB7XHJcbiAgICAgICAgYW5pbU5hbWU6ICdibHVlJyxcclxuICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgcGFyYW06ICdjb2xvcjREYXRhLmInLFxyXG4gICAgICAgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmInLFxyXG4gICAgICAgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbMV0uYicsXHJcbiAgICAgICAgZHVyYXRpb246IDAuMixcclxuICAgICAgICBlYXNpbmc6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICBsaW5rZWRBbmltOiBmYWxzZVxyXG4gICAgfV0sXHJcbiAgICBraWxsQ29uZGl0aW9uczoge1xyXG4gICAgICAgIGJvdW5kYXJ5Q2hlY2s6IHRydWUsXHJcbiAgICAgICAgYm91bmRhcnlPZmZzZXQ6IDIwMCxcclxuICAgICAgICBjb2xvckNoZWNrOiBbXSxcclxuICAgICAgICBwZXJBdHRyaWJ1dGU6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyUGFydGljbGU6IGZ1bmN0aW9uIHJlbmRlclBhcnRpY2xlKHgsIHksIHIsIGNvbG9yRGF0YSwgY29udGV4dCkge1xyXG4gICAgICAgIHZhciBwID0gdGhpcztcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ3JlbmRlcmluZyBzbW9rZScgKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uICE9PSAnc291cmNlLW92ZXInKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ3NvdXJjZS1vdmVyJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBncmQgPSBjb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIDAsIHgsIHksIHIpO1xyXG4gICAgICAgIC8vIHZhciBncmQgPSBjb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIDAsIHgsIHksIHIpO1xyXG4gICAgICAgIC8vIGdyZC5hZGRDb2xvclN0b3AoMCwgcmdiYSggY29sb3JEYXRhLnIsICBjb2xvckRhdGEuZywgY29sb3JEYXRhLmIsIDAuMDUpICk7XHJcbiAgICAgICAgLy8gZ3JkLmFkZENvbG9yU3RvcCgxLCByZ2JhKCBjb2xvckRhdGEuciwgY29sb3JEYXRhLmcsIGNvbG9yRGF0YS5iLCAwKSApO1xyXG4gICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMCwgcmdiYShjb2xvckRhdGEuciwgY29sb3JEYXRhLmcsIGNvbG9yRGF0YS5iLCBjb2xvckRhdGEuYSkpO1xyXG4gICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMSwgcmdiYShjb2xvckRhdGEuciwgY29sb3JEYXRhLmcsIGNvbG9yRGF0YS5iLCAwKSk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBncmQ7XHJcbiAgICAgICAgY29udGV4dC5maWxsQ2lyY2xlKHgsIHksIHIsIGNvbnRleHQpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuc21va2VUaGVtZSA9IHNtb2tlVGhlbWU7IiwidmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG52YXIgdHJpZyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzO1xyXG52YXIgY29sb3JpbmcgPSByZXF1aXJlKCcuLy4uLy4uLy4uL2NvbG9yVXRpbHMuanMnKS5jb2xvclV0aWxzO1xyXG52YXIgcmdiYSA9IGNvbG9yaW5nLnJnYmE7XHJcblxyXG52YXIgd2FycFN0YXJUaGVtZSA9IHtcclxuICAgIGNvbnRleHRCbGVuZGluZ01vZGU6ICdsaWdodGVyJyxcclxuICAgIGFjdGl2ZTogMSxcclxuICAgIGxpZmU6IHsgbWluOiA1MCwgbWF4OiAxMDAgfSxcclxuICAgIGFuZ2xlOiB7IG1pbjogMCwgbWF4OiAyIH0sXHJcbiAgICAvLyB2ZWxBY2NlbGVyYXRpb246IDEuMDUsXHJcbiAgICB2ZWxBY2NlbGVyYXRpb246IHsgbWluOiAxLjAxLCBtYXg6IDEuMiB9LFxyXG4gICAgbWFnRGVjYXk6IDEsXHJcbiAgICByYWRpdXM6IHsgbWluOiAxLjIsIG1heDogMS42IH0sXHJcbiAgICB0YXJnZXRSYWRpdXM6IHsgbWluOiAyLjIsIG1heDogMyB9LFxyXG4gICAgYXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlLFxyXG4gICAgY29sb3JQcm9maWxlczogW3sgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMCB9LCB7IHI6IDI1NSwgZzogMjU1LCBiOiAyNTUsIGE6IDEgfV0sXHJcbiAgICByZW5kZXJQcm9maWxlczogW3sgc2hhcGU6ICdDaXJjbGUnLCBjb2xvclByb2ZpbGVJZHg6IDAgfSwgeyBzaGFwZTogJ0NpcmNsZScsIGNvbG9yUHJvZmlsZUlkeDogMSB9LCB7IHNoYXBlOiAnQ2lyY2xlJywgY29sb3JQcm9maWxlSWR4OiAyIH1dLFxyXG4gICAgY3VzdG9tQXR0cmlidXRlczoge1xyXG4gICAgICAgIGxlbnNGbGFyZToge1xyXG4gICAgICAgICAgICBtaWdodEZsYXJlOiB0cnVlLFxyXG4gICAgICAgICAgICB3aWxsRmxhcmU6IGZhbHNlLFxyXG4gICAgICAgICAgICBhbmdsZTogMS41MFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBhbmltYXRpb25UcmFja3M6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFuaW1OYW1lOiAncmFkaXVzR3JvdycsXHJcbiAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgICAgcGFyYW06ICdyJyxcclxuICAgICAgICAgICAgYmFzZUFtb3VudDogJ2luaXRSJyxcclxuICAgICAgICAgICAgdGFyZ2V0VmFsdWVQYXRoOiAndFInLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogJ2xpZmUnLFxyXG4gICAgICAgICAgICBlYXNpbmc6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGFuaW1OYW1lOiAnZmFkZUluJyxcclxuICAgICAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgICAgICBwYXJhbTogJ2NvbG9yNERhdGEuYScsXHJcbiAgICAgICAgICAgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmEnLFxyXG4gICAgICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmEnLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogJ2xpZmUnLFxyXG4gICAgICAgICAgICBlYXNpbmc6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAga2lsbENvbmRpdGlvbnM6IHtcclxuICAgICAgICBib3VuZGFyeUNoZWNrOiB0cnVlLFxyXG4gICAgICAgIGJvdW5kYXJ5T2Zmc2V0OiA0MDAsXHJcbiAgICAgICAgY29sb3JDaGVjazogW10sXHJcbiAgICAgICAgcGVyQXR0cmlidXRlOiBbXVxyXG4gICAgfSxcclxuICAgIHJlbmRlclBhcnRpY2xlOiBmdW5jdGlvbiByZW5kZXJQYXJ0aWNsZSh4LCB5LCByLCBjb2xvckRhdGEsIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgcCA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBzdHJldGNoVmFsID0gbWF0aFV0aWxzLm1hcChwLnJlbGF0aXZlTWFnbml0dWRlLCAwLCAxMDAsIDEsIDEwKTtcclxuICAgICAgICB2YXIgY2hyb21lVmFsID0gbWF0aFV0aWxzLm1hcChzdHJldGNoVmFsLCAwLCAxMCwgMSwgNCk7XHJcbiAgICAgICAgdmFyIHRoaXNXaWxsRmxhcmUgPSBwLmN1c3RvbUF0dHJpYnV0ZXMubGVuc0ZsYXJlLndpbGxGbGFyZTtcclxuXHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XHJcbiAgICAgICAgY29udGV4dC5yb3RhdGUocC5hbmdsZSk7XHJcblxyXG4gICAgICAgIGlmIChjaHJvbWVWYWwgPCAxKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCAxIClcIjtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsRWxsaXBzZSgwLCAwLCByICogc3RyZXRjaFZhbCwgciwgY29udGV4dCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gZmFrZSBjaHJvbWF0aWMgYWJiZXJhdGlvbiAoIHJhaW5ib3dpbmcgbGVucyBlZmZlY3QgZHVlIHRvIGxpZ2h0IHJlZnJhY3Rpb25cclxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoIDI1NSwgMCwgMCwgXCIgKyBjb2xvckRhdGEuYSArIFwiIClcIjtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsRWxsaXBzZShjaHJvbWVWYWwgKiAtMSwgMCwgciAqIHN0cmV0Y2hWYWwsIHIsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiYSggMCwgMjU1LCAwLCBcIiArIGNvbG9yRGF0YS5hICsgXCIgKVwiO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxFbGxpcHNlKDAsIDAsIHIgKiBzdHJldGNoVmFsLCByLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoIDAsIDAsIDI1NSwgXCIgKyBjb2xvckRhdGEuYSArIFwiIClcIjtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsRWxsaXBzZSgwLCBjaHJvbWVWYWwsIHIgKiBzdHJldGNoVmFsLCByLCBjb250ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGV4dC5yb3RhdGUoLXAuYW5nbGUpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKC14LCAteSk7XHJcblxyXG4gICAgICAgIGlmICggdGhpc1dpbGxGbGFyZSApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBmbGFyZUFuZ2xlID0gdHJpZy5hbmdsZSggeCwgeSwgOTYwLCA0NjkgKTtcclxuICAgICAgICAgICAgdmFyIGZsYXJlQ29zID0gTWF0aC5jb3MoIGZsYXJlQW5nbGUgKTtcclxuICAgICAgICAgICAgdmFyIGZsYXJlU2luID0gTWF0aC5zaW4oIGZsYXJlQW5nbGUgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHZhciBpbnZlcnRlZEZsYXJlQW5nbGUgPSB0cmlnLmFuZ2xlKHgsIHksIDk2MCwgNDY5KTtcclxuXHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LnNhdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LnRyYW5zbGF0ZSh4LCB5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBsaWdodCBnbGFyZSBob3Jpem9udGFsXHJcbiAgICAgICAgICAgICAgICB2YXIgb3BhY2l0eTEgPSBwLmNvbG9yNERhdGEuYSAqIDAuMTU7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2hpbmVSYW5kID0gbWF0aFV0aWxzLnJhbmRvbUludGVnZXIoNSwgMTApO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNoaW5lR3JkID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCgwLCAwLCAwLCAwLCAwLCA4MDApO1xyXG4gICAgICAgICAgICAgICAgc2hpbmVHcmQuYWRkQ29sb3JTdG9wKDAsIFwicmdiYSggMjU1LDI1NSwgMjU1LCBcIiArIG9wYWNpdHkxICsgXCIgKVwiKTtcclxuICAgICAgICAgICAgICAgIHNoaW5lR3JkLmFkZENvbG9yU3RvcCgxLCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIDAgKVwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuc2NhbGUoc2hpbmVSYW5kICogb3BhY2l0eTEsIDAuMDA1KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gc2hpbmVHcmQ7XHJcblxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5maWxsQ2lyY2xlKDAsIDAsIDgwMCwgY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LnNjYWxlKDAuMDA1LCBzaGluZVJhbmQpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5maWxsQ2lyY2xlKDAsIDAsIDgwMCwgY29udGV4dCk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnRleHQucm90YXRlKCAxLjUgKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbENpcmNsZSgwLCAwLCA4MDAsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5yb3RhdGUoIDEgKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbENpcmNsZSgwLCAwLCA4MDAsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5yb3RhdGUoIC0wLjUgKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIGJpZyBmbGFyZVxyXG4gICAgICAgICAgICB2YXIgb3BhY2l0eTIgPSBwLmNvbG9yNERhdGEuYSAqIDAuMDU7XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3JkID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCAwLCB4LCB5LCAxMDApO1xyXG4gICAgICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAuNzUsIFwicmdiYSggMjU1LCAwLCAwLCAwIClcIik7XHJcbiAgICAgICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMC44LCBcInJnYmEoIDI1NSwgMCwgMCwgXCIgKyBvcGFjaXR5MiArIFwiIClcIik7XHJcbiAgICAgICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMC44NSwgXCJyZ2JhKCAwLCAyNTUsIDAsIFwiICsgb3BhY2l0eTIgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAuOSwgXCJyZ2JhKCAwLCAwLCAyNTUsIFwiICsgb3BhY2l0eTIgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDEsIFwicmdiYSggMCwgMCwgMjU1LCAwIClcIik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JkO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxDaXJjbGUoeCwgeSwgMTAwLCBjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciByYWREaXN0MSA9IDIwMCAqIHN0cmV0Y2hWYWw7XHJcbiAgICAgICAgICAgIHZhciB4MiA9IHJhZERpc3QxICogZmxhcmVDb3MgKyB4O1xyXG4gICAgICAgICAgICB2YXIgeTIgPSByYWREaXN0MSAqIGZsYXJlU2luICsgeTtcclxuICAgICAgICAgICAgdmFyIHgyYSA9ICggcmFkRGlzdDEgKiAxLjUgKSAqIGZsYXJlQ29zICsgeDtcclxuICAgICAgICAgICAgdmFyIHkyYSA9ICggcmFkRGlzdDEgKiAxLjUgKSAqIGZsYXJlU2luICsgeTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvcGFjaXR5MyA9IHAuY29sb3I0RGF0YS5hICogMC4wMjU7XHJcbiAgICAgICAgICAgIC8vIGxpdHRsZSBmbGFyZSAxXHJcbiAgICAgICAgICAgIHZhciBncmQyID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4MiwgeTIsIDAsIHgyLCB5MiwgNTApO1xyXG5cclxuICAgICAgICAgICAgZ3JkMi5hZGRDb2xvclN0b3AoMCwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCBcIiArIG9wYWNpdHkzICsgXCIgKVwiKTtcclxuICAgICAgICAgICAgZ3JkMi5hZGRDb2xvclN0b3AoMC44LCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIFwiICsgb3BhY2l0eTMgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQyLmFkZENvbG9yU3RvcCgxLCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIDAgKVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JkMjtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsQ2lyY2xlKHgyLCB5MiwgNTAsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgLy8gbGl0dGxlIGZsYXJlIDJcclxuICAgICAgICAgICAgdmFyIGdyZDJhID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4MmEsIHkyYSwgMCwgeDJhLCB5MmEsIDUwKTtcclxuXHJcbiAgICAgICAgICAgIGdyZDJhLmFkZENvbG9yU3RvcCgwLCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIFwiICsgb3BhY2l0eTMgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQyYS5hZGRDb2xvclN0b3AoMC44LCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIFwiICsgb3BhY2l0eTMgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQyYS5hZGRDb2xvclN0b3AoMSwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCAwIClcIik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JkMmE7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbENpcmNsZSh4MmEsIHkyYSwgNTAsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJhZERpc3QyID0gMzAwICogc3RyZXRjaFZhbCAqIDEuNTtcclxuICAgICAgICAgICAgdmFyIHgzID0gcmFkRGlzdDIgKiBmbGFyZUNvcyArIHg7XHJcbiAgICAgICAgICAgIHZhciB5MyA9IHJhZERpc3QyICogZmxhcmVTaW4gKyB5O1xyXG4gICAgICAgICAgICB2YXIgeDNhID0gKCByYWREaXN0MiAqIDEuNSApICogZmxhcmVDb3MgKyB4O1xyXG4gICAgICAgICAgICB2YXIgeTNhID0gKCByYWREaXN0MiAqIDEuNSApICogZmxhcmVTaW4gKyB5O1xyXG5cclxuICAgICAgICAgICAgLy8gbGl0dGxlIGZsYXJlIDNcclxuICAgICAgICAgICAgdmFyIGdyZDMgPSBjb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgzLCB5MywgMCwgeDMsIHkzLCAyNSk7XHJcblxyXG4gICAgICAgICAgICBncmQzLmFkZENvbG9yU3RvcCgwLCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIFwiICsgb3BhY2l0eTMgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQzLmFkZENvbG9yU3RvcCgwLjgsIFwicmdiYSggMjU1LCAyNTUsIDI1NSwgXCIgKyBvcGFjaXR5MyArIFwiIClcIik7XHJcbiAgICAgICAgICAgIGdyZDMuYWRkQ29sb3JTdG9wKDEsIFwicmdiYSggMjU1LCAyNTUsIDI1NSwgMCApXCIpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGdyZDM7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbENpcmNsZSh4MywgeTMsIDI1LCBjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxpdHRsZSBmbGFyZSA0XHJcbiAgICAgICAgICAgIHZhciBncmQzYSA9IGNvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoeDNhLCB5M2EsIDAsIHgzYSwgeTNhLCAyNSk7XHJcblxyXG4gICAgICAgICAgICBncmQzYS5hZGRDb2xvclN0b3AoMCwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCBcIiArIG9wYWNpdHkzICsgXCIgKVwiKTtcclxuICAgICAgICAgICAgZ3JkM2EuYWRkQ29sb3JTdG9wKDAuOCwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCBcIiArIG9wYWNpdHkzICsgXCIgKVwiKTtcclxuICAgICAgICAgICAgZ3JkM2EuYWRkQ29sb3JTdG9wKDEsIFwicmdiYSggMjU1LCAyNTUsIDI1NSwgMCApXCIpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGdyZDNhO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxDaXJjbGUoeDNhLCB5M2EsIDI1LCBjb250ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy53YXJwU3RhclRoZW1lID0gd2FycFN0YXJUaGVtZTsiLCIvLyBkZXBlbmRlbmNpZXNcclxuXHJcbi8vIE5QTVxyXG52YXIgTGlua2VkTGlzdCA9IHJlcXVpcmUoJ2RibHktbGlua2VkLWxpc3QnKTtcclxudmFyIG9iamVjdFBhdGggPSByZXF1aXJlKFwib2JqZWN0LXBhdGhcIik7XHJcblxyXG4vLyBDdXN0b20gUmVxdWlyZXNcclxudmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG52YXIgdHJpZyA9IHJlcXVpcmUoJy4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzO1xyXG52YXIgZHJhd2luZyA9IHJlcXVpcmUoJy4vY2FudmFzQXBpQXVnbWVudGF0aW9uLmpzJykuY2FudmFzRHJhd2luZ0FwaTtcclxudmFyIGNvbG9yaW5nID0gcmVxdWlyZSgnLi9jb2xvclV0aWxzLmpzJykuY29sb3JVdGlscztcclxudmFyIGVhc2luZyA9IHJlcXVpcmUoJy4vZWFzaW5nLmpzJykuZWFzaW5nRXF1YXRpb25zO1xyXG52YXIgYW5pbWF0aW9uID0gcmVxdWlyZSgnLi9hbmltYXRpb24uanMnKS5hbmltYXRpb247XHJcbnZhciBkZWJ1Z0NvbmZpZyA9IHJlcXVpcmUoJy4vZGVidWdVdGlscy5qcycpO1xyXG52YXIgZGVidWcgPSBkZWJ1Z0NvbmZpZy5kZWJ1ZztcclxudmFyIGxhc3RDYWxsZWRUaW1lID0gZGVidWdDb25maWcubGFzdENhbGxlZFRpbWU7XHJcbnZhciBlbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vZW52aXJvbm1lbnQuanMnKS5lbnZpcm9ubWVudDtcclxudmFyIHBoeXNpY3MgPSBlbnZpcm9ubWVudC5mb3JjZXM7XHJcbnZhciBydW50aW1lRW5naW5lID0gZW52aXJvbm1lbnQucnVudGltZUVuZ2luZTtcclxudmFyIHRoZW1lcyA9IHJlcXVpcmUoJy4vcGFydGljbGVUaGVtZXMvdGhlbWVzLmpzJykudGhlbWVzO1xyXG5cclxudmFyIHNpbmdsZUJ1cnN0VGhlbWUgPSByZXF1aXJlKCcuL2VtaXR0ZXJUaGVtZXMvc2luZ2xlQnVyc3RUaGVtZS9zaW5nbGVCdXJzdFRoZW1lLmpzJykuc2luZ2xlQnVyc3RUaGVtZTtcclxudmFyIGJhc2VFbWl0dGVyVGhlbWUgPSByZXF1aXJlKCcuL2VtaXR0ZXJUaGVtZXMvYmFzZUVtaXR0ZXIvYmFzZUVtaXR0ZXJUaGVtZS5qcycpLmJhc2VFbWl0dGVyVGhlbWU7XHJcbnZhciB3YXJwU3RyZWFtVGhlbWUgPSByZXF1aXJlKCcuL2VtaXR0ZXJUaGVtZXMvd2FycFN0cmVhbS93YXJwU3RyZWFtVGhlbWUuanMnKS53YXJwU3RyZWFtVGhlbWU7XHJcbnZhciBmbGFtZVN0cmVhbVRoZW1lID0gcmVxdWlyZSgnLi9lbWl0dGVyVGhlbWVzL2ZsYW1lU3RyZWFtL2ZsYW1lU3RyZWFtVGhlbWUuanMnKS5mbGFtZVN0cmVhbVRoZW1lO1xyXG52YXIgc21va2VTdHJlYW1UaGVtZSA9IHJlcXVpcmUoJy4vZW1pdHRlclRoZW1lcy9zbW9rZVN0cmVhbS9zbW9rZVN0cmVhbVRoZW1lLmpzJykuc21va2VTdHJlYW1UaGVtZTtcclxuXHJcbnZhciBFbWl0dGVyRW50aXR5ID0gcmVxdWlyZSgnLi9FbWl0dGVyRW50aXR5LmpzJykuRW1pdHRlckVudGl0eTtcclxudmFyIEVtaXR0ZXJTdG9yZUZuID0gcmVxdWlyZSgnLi9lbWl0dGVyU3RvcmUuanMnKS5FbWl0dGVyU3RvcmVGbjtcclxudmFyIHBhcnRpY2xlRm4gPSByZXF1aXJlKCcuL3BhcnRpY2xlRm4uanMnKS5wYXJ0aWNsZUZuO1xyXG52YXIgcGFydGljbGVBcnJGbiA9IHJlcXVpcmUoJy4vcGFydGljbGVBcnJGbi5qcycpLnBhcnRpY2xlQXJyRm47XHJcblxyXG4vLyBkb3VibGUgYnVmZmVyIGNhbnZhcyAoZXhwZXJpbWVudClcclxuLy8gbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4vLyBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuLy8gY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbi8vIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblxyXG4vLyBsZXQgYmxpdENhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGVzdC1iYXNlXCIpO1xyXG4vLyBsZXQgYmxpdEN0eCA9IGJsaXRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuLy8gYmxpdENhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4vLyBibGl0Q2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcbi8vIHN0YW5kYXJkIGNhbnZhcyByZW5kZXJpbmdcclxuLy8gY2FudmFzIGhvdXNla2VlcGluZ1xyXG52YXIgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0ZXN0LWJhc2VcIik7XHJcbi8vIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIsIHsgYWxwaGE6IGZhbHNlIH0pO1xyXG52YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuLy8gY2FjaGUgY2FudmFzIHcvaFxyXG52YXIgY2FuVyA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG52YXIgY2FuSCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuLy8gc2V0IGNhbnZhcyB0byBmdWxsLXNjcmVlblxyXG5jYW52YXMud2lkdGggPSBjYW5XO1xyXG5jYW52YXMuaGVpZ2h0ID0gY2FuSDtcclxudmFyIGNhbnZhc0NlbnRyZUggPSBjYW5XIC8gMjtcclxudmFyIGNhbnZhc0NlbnRyZVYgPSBjYW5IIC8gMjtcclxuXHJcbnZhciBjYW52YXNDb25maWcgPSB7XHJcbiAgICB3aWR0aDogY2FuVyxcclxuICAgIGhlaWdodDogY2FuSCxcclxuICAgIGNlbnRlckg6IGNhbnZhc0NlbnRyZUgsXHJcbiAgICBjZW50ZXJWOiBjYW52YXNDZW50cmVWLFxyXG5cclxuICAgIGJ1ZmZlckNsZWFyUmVnaW9uOiB7XHJcbiAgICAgICAgeDogY2FudmFzQ2VudHJlSCxcclxuICAgICAgICB5OiBjYW52YXNDZW50cmVWLFxyXG4gICAgICAgIHc6IDAsXHJcbiAgICAgICAgaDogMFxyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIGJ1ZmZlckNsZWFyUmVnaW9uID0ge1xyXG4gICAgeDogY2FudmFzQ2VudHJlSCxcclxuICAgIHk6IGNhbnZhc0NlbnRyZVYsXHJcbiAgICB3OiAwLFxyXG4gICAgaDogMFxyXG5cclxuICAgIC8vIGVtaXR0ZXIgc3RvcmVcclxufTt2YXIgZW1pdHRlclN0b3JlID0gW107XHJcbi8vIHBhcnRpY2xlIHN0b3JlXHJcbnZhciBlbnRpdHlTdG9yZSA9IFtdO1xyXG4vLyBwYXJ0aWNsZSBzdG9yZSBtZXRhIGRhdGFcclxudmFyIGVudGl0eVBvb2wgPSBuZXcgTGlua2VkTGlzdCgpO1xyXG52YXIgbGl2ZUVudGl0eUNvdW50ID0gMDtcclxuXHJcbnZhciBydW50aW1lQ29uZmlnID0ge1xyXG5cclxuICAgIGdsb2JhbENsb2NrOiAwLFxyXG4gICAgZ2xvYmFsQ2xvY2tUaWNrOiBmdW5jdGlvbiBnbG9iYWxDbG9ja1RpY2soKSB7XHJcbiAgICAgICAgdGhpcy5nbG9iYWxDbG9jaysrO1xyXG4gICAgfSxcclxuXHJcbiAgICBlbWl0dGVyQ291bnQ6IDAsXHJcbiAgICBhY3RpdmVFbWl0dGVyczogMCxcclxuXHJcbiAgICBsaXZlRW50aXR5Q291bnQ6IDAsXHJcbiAgICBzdWJ0cmFjdDogZnVuY3Rpb24gc3VidHJhY3QoYW1vdW50KSB7XHJcbiAgICAgICAgdGhpcy5saXZlRW50aXR5Q291bnQgLT0gYW1vdW50O1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gcHJlLXBvcHVsYXRlIGVudGl0eVN0b3JlXHJcbnZhciBlbnRpdHlQb3B1bGF0aW9uID0gMTAwMDA7XHJcbmZvciAodmFyIGkgPSAwOyBpIDwgZW50aXR5UG9wdWxhdGlvbjsgaSsrKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyggXCJwb3B1bGF0aW5nIGVudGl0eVN0b3JlIHdpdGggcEluc3RhbmNlICclZCc6IFwiLCBpICk7XHJcbiAgICAvLyBwSW5zdGFuY2UuaWR4ID0gaTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCBcInBJbnN0YW5jZS5pZHggJyVkJ1wiLCBwSW5zdGFuY2UuaWR4IClcclxuICAgIGVudGl0eVN0b3JlLnB1c2goY3JlYXRlTGl2ZVBhcnRpY2xlKDAsIDAsIGksIGJhc2VFbWl0dGVyVGhlbWUsIHRoZW1lcy5yZXNldCkpO1xyXG4gICAgZW50aXR5UG9vbC5pbnNlcnQoJycgKyBpKTtcclxufVxyXG5cclxuLy8gZ2xvYmFsIGNvdW50ZXJcclxudmFyIGdsb2JhbENsb2NrID0gMDtcclxudmFyIGNvdW50ZXIgPSAwO1xyXG5cclxuLy8gc2V0IGRlZmF1bHQgdmFyaWFibGVzIFxyXG52YXIgbW91c2VYID0gdm9pZCAwLFxyXG4gICAgbW91c2VZID0gdm9pZCAwLFxyXG4gICAgcnVudGltZSA9IHZvaWQgMCxcclxuICAgIHBMaXZlID0gdm9pZCAwO1xyXG4vLyBsZXQgY3VyclRoZW1lID0gdGhlbWVzLmZpcmU7XHJcbnZhciBjdXJyVGhlbWUgPSB0aGVtZXMuZmxhbWU7XHJcbi8vIGxldCBjdXJyVGhlbWUgPSB0aGVtZXMud2FycFN0YXI7XHJcbi8vIGxldCBjdXJyVGhlbWUgPSB0aGVtZXMuc21va2U7XHJcblxyXG4vLyBsZXQgY3VyckVtaXR0ZXJUaGVtZSA9IHNpbmdsZUJ1cnN0VGhlbWU7XHJcbi8vIGxldCBjdXJyRW1pdHRlclRoZW1lID0gd2FycFN0cmVhbVRoZW1lO1xyXG52YXIgY3VyckVtaXR0ZXJUaGVtZSA9IGZsYW1lU3RyZWFtVGhlbWU7XHJcblxyXG52YXIgY3VyckVtbWlzc2lvblR5cGUgPSB7XHJcbiAgICBtb3VzZUNsaWNrRXZlbnQ6IHRydWUsXHJcbiAgICByYW5kb21CdXJzdDogZmFsc2UsXHJcbiAgICBzdGVhZHlTdHJlYW06IGZhbHNlXHJcbn07XHJcblxyXG4vLyBjYW52YXMgY2xpY2sgaGFuZGxlclxyXG5mdW5jdGlvbiByZWdpc3Rlck1vdXNlQ2xpY2tFbW1pc2lvbigpIHtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIG1vdXNlWCA9IGV2ZW50Lm9mZnNldFg7XHJcbiAgICAgICAgbW91c2VZID0gZXZlbnQub2Zmc2V0WTtcclxuXHJcbiAgICAgICAgLy8gdGVzdEVtaXR0ZXIucmVzZXRFbWlzc2lvblZhbHVlcygpO1xyXG4gICAgICAgIC8vIHRlc3RFbWl0dGVyLnRyaWdnZXJFbWl0dGVyKCB7IHg6IG1vdXNlWCwgeTogbW91c2VZIH0gKTtcclxuXHJcbiAgICAgICAgdmFyIHRlc3RFbWl0dGVyID0gbmV3IEVtaXR0ZXJFbnRpdHkoJ3Rlc3RFbWl0dGVyJywgY3VyckVtaXR0ZXJUaGVtZSwgY3VyclRoZW1lLCBlbWl0RW50aXRpZXMpO1xyXG5cclxuICAgICAgICBlbWl0dGVyU3RvcmUucHVzaCh0ZXN0RW1pdHRlcik7XHJcblxyXG4gICAgICAgIHRlc3RFbWl0dGVyLnRyaWdnZXJFbWl0dGVyKHtcclxuICAgICAgICAgICAgeDogY2FudmFzQ29uZmlnLmNlbnRlckgsXHJcbiAgICAgICAgICAgIHk6IGNhbnZhc0NvbmZpZy5jZW50ZXJWXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChhbmltYXRpb24uc3RhdGUgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgYW5pbWF0aW9uLnN0YXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmlmIChjdXJyRW1taXNzaW9uVHlwZS5tb3VzZUNsaWNrRXZlbnQpIHtcclxuICAgIHJlZ2lzdGVyTW91c2VDbGlja0VtbWlzaW9uKCk7XHJcbn1cclxuXHJcbnZhciBzbW9rZUVtaXR0ZXIgPSBuZXcgRW1pdHRlckVudGl0eSgnc21va2VFbWl0dGVyJywgc21va2VTdHJlYW1UaGVtZSwgdGhlbWVzLnNtb2tlLCBlbWl0RW50aXRpZXMpO1xyXG5lbWl0dGVyU3RvcmUucHVzaChzbW9rZUVtaXR0ZXIpO1xyXG5cclxuLy8gcGFydGljbGUgbWV0aG9kcyBmTlxyXG5mdW5jdGlvbiByZW5kZXJQYXJ0aWNsZSh4LCB5LCByLCBjb2xvckRhdGEsIGNvbnRleHQsIG1hdGhVdGlscykge1xyXG4gICAgdmFyIHAgPSB0aGlzO1xyXG4gICAgLy8gY29uc29sZS5sb2coICdwLnJlbmRlcjogJywgcCApO1xyXG4gICAgdmFyIGNvbXBpbGVkQ29sb3IgPSBcInJnYmEoXCIgKyBjb2xvckRhdGEuciArICcsJyArIGNvbG9yRGF0YS5nICsgJywnICsgY29sb3JEYXRhLmIgKyBcIixcIiArIGNvbG9yRGF0YS5hICsgXCIpXCI7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGNvbXBpbGVkQ29sb3I7XHJcbiAgICBjb250ZXh0LmZpbGxDaXJjbGUoeCwgeSwgciwgY29udGV4dCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFBhcnRpY2xlQXR0cmlidXRlcyhwLCBwcGEpIHtcclxuXHJcbiAgICBwLmlzQWxpdmUgPSBwcGEuYWN0aXZlO1xyXG4gICAgcC5saWZlU3BhbiA9IHBwYS5saWZlU3BhbjtcclxuICAgIHAuY3VyckxpZmUgPSBwcGEubGlmZVNwYW47XHJcbiAgICBwLmN1cnJMaWZlSW52ID0gMDtcclxuICAgIHAueCA9IHBwYS54O1xyXG4gICAgcC55ID0gcHBhLnk7XHJcbiAgICBwLnhWZWwgPSBwcGEueFZlbDtcclxuICAgIHAueVZlbCA9IHBwYS55VmVsO1xyXG4gICAgcC52QWNjID0gcHBhLnZBY2M7XHJcbiAgICBwLmluaXRSID0gcHBhLmluaXRSO1xyXG4gICAgcC5yID0gcHBhLmluaXRSO1xyXG4gICAgcC50UiA9IHBwYS50UjtcclxuICAgIHAuYW5nbGUgPSBwcGEuYW5nbGU7XHJcbiAgICBwLm1hZ25pdHVkZSA9IHBwYS5tYWduaXR1ZGU7XHJcbiAgICBwLnJlbGF0aXZlTWFnbml0dWRlID0gcHBhLm1hZ25pdHVkZTtcclxuICAgIHAubWFnbml0dWRlRGVjYXkgPSBwcGEubWFnbml0dWRlRGVjYXk7XHJcbiAgICBwLmVudGl0eVR5cGUgPSAnbm9uZSc7XHJcbiAgICBwLmFwcGx5Rm9yY2VzID0gcHBhLmFwcGx5Rm9yY2VzO1xyXG4gICAgcC5jb2xvcjREYXRhID0gcHBhLmNvbG9yNERhdGE7XHJcbiAgICBwLmNvbG9yUHJvZmlsZXMgPSBwcGEuY29sb3JQcm9maWxlcztcclxuICAgIHAua2lsbENvbmRpdGlvbnMgPSBwcGEua2lsbENvbmRpdGlvbnM7XHJcbiAgICBwLmN1c3RvbUF0dHJpYnV0ZXMgPSBwcGEuY3VzdG9tQXR0cmlidXRlcztcclxuICAgIHAuYW5pbWF0aW9uVHJhY2tzID0gcHBhLmFuaW1hdGlvblRyYWNrcztcclxuICAgIHAudXBkYXRlID0gcGFydGljbGVGbi51cGRhdGVQYXJ0aWNsZTtcclxuICAgIHAucmVpbmNhcm5hdGUgPSByZWluY2FybmF0ZVBhcnRpY2xlO1xyXG4gICAgcC5raWxsID0gcGFydGljbGVGbi5raWxsUGFydGljbGU7XHJcbiAgICBwLnJlbmRlciA9IHBwYS5yZW5kZXJGTjtcclxuICAgIHAuZXZlbnRzID0gcHBhLmV2ZW50cztcclxufVxyXG5cclxuLy8gcGFydGljbGUgZk5cclxuZnVuY3Rpb24gY3JlYXRlTGl2ZVBhcnRpY2xlKHRoaXNYLCB0aGlzWSwgaWR4LCBlbWlzc2lvbk9wdHMsIHBhcnRpY2xlT3B0cykge1xyXG5cclxuICAgIHZhciBuZXdQYXJ0aWNsZSA9IHt9O1xyXG4gICAgbmV3UGFydGljbGUuaWR4ID0gaWR4O1xyXG4gICAgc2V0UGFydGljbGVBdHRyaWJ1dGVzKG5ld1BhcnRpY2xlLCBwYXJ0aWNsZUZuLmNyZWF0ZVBlclBhcnRpY2xlQXR0cmlidXRlcyh0aGlzWCwgdGhpc1ksIGVtaXNzaW9uT3B0cywgcGFydGljbGVPcHRzKSk7XHJcbiAgICByZXR1cm4gbmV3UGFydGljbGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlaW5jYXJuYXRlUGFydGljbGUodGhpc1gsIHRoaXNZLCBlbWlzc2lvbk9wdHMsIHBhcnRpY2xlT3B0aW9ucykge1xyXG4gICAgc2V0UGFydGljbGVBdHRyaWJ1dGVzKHRoaXMsIHBhcnRpY2xlRm4uY3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzKHRoaXNYLCB0aGlzWSwgZW1pc3Npb25PcHRzLCBwYXJ0aWNsZU9wdGlvbnMpKTtcclxufVxyXG5cclxuLy8gZW1taXNpb24gZk5cclxuZnVuY3Rpb24gZW1pdEVudGl0aWVzKHgsIHksIGNvdW50LCBlbWlzc2lvbk9wdGlvbnMsIHBhcnRpY2xlT3B0aW9ucykge1xyXG4gICAgdmFyIGVudGl0eVN0b3JlTGVuID0gZW50aXR5U3RvcmUubGVuZ3RoO1xyXG4gICAgdmFyIGFkZGVkTmV3ID0gMDtcclxuICAgIHZhciBhZGRlZEZyb21Qb29sID0gMDtcclxuICAgIHZhciB0aGV0YTtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZyggXCJlbW1pdGluZyBhIHRvdGFsIG9mOiAnJWQnIHBhcnRpY2xlc1wiLCBjb3VudCApO1xyXG4gICAgcnVudGltZUNvbmZpZy5saXZlRW50aXR5Q291bnQgKz0gY291bnQ7XHJcbiAgICBmb3IgKHZhciBfaSA9IGNvdW50IC0gMTsgX2kgPj0gMDsgX2ktLSkge1xyXG5cclxuICAgICAgICBpZiAoZW50aXR5UG9vbC5nZXRTaXplKCkgPiAwKSB7XHJcbiAgICAgICAgICAgIGVudGl0eVN0b3JlW2VudGl0eVBvb2wuZ2V0VGFpbE5vZGUoKS5nZXREYXRhKCldLnJlaW5jYXJuYXRlKHgsIHksIGVtaXNzaW9uT3B0aW9ucywgcGFydGljbGVPcHRpb25zKTtcclxuICAgICAgICAgICAgYWRkZWRGcm9tUG9vbCsrO1xyXG4gICAgICAgICAgICBlbnRpdHlQb29sLnJlbW92ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVudGl0eVN0b3JlLnB1c2goY3JlYXRlTGl2ZVBhcnRpY2xlKHgsIHksIGVudGl0eVN0b3JlTGVuLCBlbWlzc2lvbk9wdGlvbnMsIHBhcnRpY2xlT3B0aW9ucykpO1xyXG4gICAgICAgICAgICBlbnRpdHlQb29sLmluc2VydCgnJyArIGVudGl0eVN0b3JlTGVuKTtcclxuICAgICAgICAgICAgYWRkZWROZXcrKztcclxuICAgICAgICAgICAgZW50aXR5U3RvcmVMZW4rKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBjb25zb2xlLmxvZyggXCJhZGRlZEZyb21Qb29sOiAnJWQnLCBhZGRlZE5ldzogJyVkJ1wiLCBhZGRlZEZyb21Qb29sLCBhZGRlZE5ldyApO1xyXG4gICAgLy8gY29uc29sZS5sb2coICdhZGRlZE5ldzogJywgYWRkZWROZXcgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlRW1pdHRlclN0b3JlTWVtYmVycygpIHtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gZW1pdHRlclN0b3JlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgZW1pdHRlclN0b3JlW2ldLnVwZGF0ZUVtaXR0ZXIoKTtcclxuICAgICAgICAvLyBlbWl0dGVyU3RvcmVbaV0ucmVuZGVyRW1pdHRlciggY3R4ICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIHJ1bnRpbWUgZk4gbWVtYmVyc1xyXG5mdW5jdGlvbiBkaXNwbGF5RGVidWdnaW5nKCkge1xyXG4gICAgZGVidWcuZGVidWdPdXRwdXQoY2FudmFzLCBjdHgsICdBbmltYXRpb24gQ291bnRlcjogJywgY291bnRlciwgMCk7XHJcbiAgICBkZWJ1Zy5kZWJ1Z091dHB1dChjYW52YXMsIGN0eCwgJ1BhcnRpY2xlIFBvb2w6ICcsIGVudGl0eVN0b3JlLmxlbmd0aCwgMSk7XHJcbiAgICBkZWJ1Zy5kZWJ1Z091dHB1dChjYW52YXMsIGN0eCwgJ0xpdmUgRW50aXRpZXM6ICcsIHJ1bnRpbWVDb25maWcubGl2ZUVudGl0eUNvdW50LCAyLCB7IG1pbjogZW50aXR5U3RvcmUubGVuZ3RoLCBtYXg6IDAgfSk7XHJcbiAgICBkZWJ1Zy5kZWJ1Z091dHB1dChjYW52YXMsIGN0eCwgJ0ZQUzogJywgTWF0aC5yb3VuZChkZWJ1Zy5jYWxjdWxhdGVGcHMoKSksIDMsIHsgbWluOiAwLCBtYXg6IDYwIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDeWNsZSgpIHtcclxuICAgIC8vIHJlbmRlcmluZ1xyXG4gICAgcGFydGljbGVBcnJGbi5yZW5kZXJQYXJ0aWNsZUFycihjdHgsIGVudGl0eVN0b3JlLCBhbmltYXRpb24pO1xyXG5cclxuICAgIC8vIGJsaXQgdG8gb25zY3JlZW5cclxuICAgIC8vIGJsaXRDdHguZHJhd0ltYWdlKCBjYW52YXMsIDAsIDAgKTtcclxuXHJcbiAgICAvLyB1cGRhdGluZ1xyXG4gICAgcGFydGljbGVBcnJGbi51cGRhdGVQYXJ0aWNsZUFycihjdHgsIGVudGl0eVN0b3JlLCBlbnRpdHlQb29sLCBhbmltYXRpb24sIGNhbnZhc0NvbmZpZywgcnVudGltZUNvbmZpZywgZW1pdHRlclN0b3JlKTtcclxuXHJcbiAgICB1cGRhdGVFbWl0dGVyU3RvcmVNZW1iZXJzKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsZWFyQ2FudmFzKGN0eCkge1xyXG4gICAgLy8gY2xlYW5pbmdcclxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FuVywgY2FuSCk7XHJcbiAgICAvLyBjdHguY2xlYXJSZWN0KCBidWZmZXJDbGVhclJlZ2lvbi54LCBidWZmZXJDbGVhclJlZ2lvbi55LCBidWZmZXJDbGVhclJlZ2lvbi53LCBidWZmZXJDbGVhclJlZ2lvbi5oICk7XHJcblxyXG4gICAgLy8gYmxpdEN0eC5jbGVhclJlY3QoIDAsIDAsIGNhblcsIGNhbkggKTtcclxuXHJcblxyXG4gICAgLy8gY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKCAwLCAwLCAwLCAwLjEgKSc7XHJcbiAgICAvLyBjdHguZmlsbFJlY3QoIDAsIDAsIGNhblcsIGNhbkggKTtcclxuXHJcbiAgICAvLyBzZXQgZGlydHkgYnVmZmVyXHJcbiAgICAvLyByZXNldEJ1ZmZlckNsZWFyUmVnaW9uKCk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gcnVudGltZVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuXHJcbiAgICAvLyBsb29wIGhvdXNla2VlcGluZ1xyXG4gICAgcnVudGltZSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAvLyBjbGVhbiBjYW52YXNcclxuICAgIGNsZWFyQ2FudmFzKGN0eCk7XHJcblxyXG4gICAgLy8gYmxlbmRpbmdcclxuICAgIC8vIGlmICggY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiAhPSBjdXJyVGhlbWUuY29udGV4dEJsZW5kaW5nTW9kZSApIHtcclxuICAgIC8vICAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gY3VyclRoZW1lLmNvbnRleHRCbGVuZGluZ01vZGU7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gdXBkYXRlc1xyXG4gICAgdXBkYXRlQ3ljbGUoKTtcclxuXHJcbiAgICAvLyBkZWJ1Z2dpbmdcclxuICAgIGRpc3BsYXlEZWJ1Z2dpbmcoKTtcclxuXHJcbiAgICAvLyBsb29waW5nXHJcbiAgICBhbmltYXRpb24uc3RhdGUgPT09IHRydWUgPyAocnVudGltZUVuZ2luZS5zdGFydEFuaW1hdGlvbihydW50aW1lLCB1cGRhdGUpLCBjb3VudGVyKyspIDogcnVudGltZUVuZ2luZS5zdG9wQW5pbWF0aW9uKHJ1bnRpbWUpO1xyXG5cclxuICAgIC8vIGdsb2JhbCBjbG9ja1xyXG4gICAgLy8gY291bnRlcisrO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRW5kIHJ1bnRpbWVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyIsInZhciBfdHJpZ29ub21pY1V0aWxzO1xyXG5cclxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cclxuXHJcbi8qKlxyXG4qIGNhY2hlZCB2YWx1ZXNcclxuKi9cclxuXHJcbnZhciBwaUJ5SGFsZiA9IE1hdGguUGkgLyAxODA7XHJcbnZhciBoYWxmQnlQaSA9IDE4MCAvIE1hdGguUEk7XHJcblxyXG4vKipcclxuKiBwcm92aWRlcyB0cmlnb25taWMgdXRpbCBtZXRob2RzLlxyXG4qXHJcbiogQG1peGluXHJcbiovXHJcbnZhciB0cmlnb25vbWljVXRpbHMgPSAoX3RyaWdvbm9taWNVdGlscyA9IHtcclxuXHJcblx0YW5nbGU6IGZ1bmN0aW9uKG9yaWdpblgsIG9yaWdpblksIHRhcmdldFgsIHRhcmdldFkpIHtcclxuICAgICAgICB2YXIgZHggPSBvcmlnaW5YIC0gdGFyZ2V0WDtcclxuICAgICAgICB2YXIgZHkgPSBvcmlnaW5ZIC0gdGFyZ2V0WTtcclxuICAgICAgICB2YXIgdGhldGEgPSBNYXRoLmF0YW4yKC1keSwgLWR4KTtcclxuICAgICAgICByZXR1cm4gdGhldGE7XHJcbiAgICB9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIGNhbGN1bGF0ZSBkaXN0YW5jZSBiZXR3ZWVuIDIgdmVjdG9yIGNvb3JkaW5hdGVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geDEgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MSAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHgyIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geTIgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0ZGlzdDogZnVuY3Rpb24gZGlzdCh4MSwgeTEsIHgyLCB5Mikge1xyXG5cdFx0eDIgLT0geDE7eTIgLT0geTE7XHJcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KHgyICogeDIgKyB5MiAqIHkyKTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIGNvbnZlcnQgZGVncmVlcyB0byByYWRpYW5zLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGVncmVlcyAtIHRoZSBkZWdyZWUgdmFsdWUgdG8gY29udmVydC5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRkZWdyZWVzVG9SYWRpYW5zOiBmdW5jdGlvbiBkZWdyZWVzVG9SYWRpYW5zKGRlZ3JlZXMpIHtcclxuXHRcdHJldHVybiBkZWdyZWVzICogcGlCeUhhbGY7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBjb252ZXJ0IHJhZGlhbnMgdG8gZGVncmVlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnMgLSB0aGUgZGVncmVlIHZhbHVlIHRvIGNvbnZlcnQuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0cmFkaWFuc1RvRGVncmVlczogZnVuY3Rpb24gcmFkaWFuc1RvRGVncmVlcyhyYWRpYW5zKSB7XHJcblx0XHRyZXR1cm4gcmFkaWFucyAqIGhhbGZCeVBpO1xyXG5cdH0sXHJcblxyXG5cdC8qXHJcbiByZXR1cm4gdXNlZnVsIFRyaWdvbm9taWMgdmFsdWVzIGZyb20gcG9zaXRpb24gb2YgMiBvYmplY3RzIGluIHgveSBzcGFjZVxyXG4gd2hlcmUgeDEveTEgaXMgdGhlIGN1cnJlbnQgcG9pc3Rpb24gYW5kIHgyL3kyIGlzIHRoZSB0YXJnZXQgcG9zaXRpb25cclxuICovXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBjYWxjdWxhdGUgdHJpZ29tb21pYyB2YWx1ZXMgYmV0d2VlbiAyIHZlY3RvciBjb29yZGluYXRlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IHgxIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geTEgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MiAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuICogQHBhcmFtIHtudW1iZXJ9IHkyIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBDYWxjdWxhdGlvblxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gZGlzdGFuY2UgVGhlIGRpc3RhbmNlIGJldHdlZW4gdmVjdG9yc1xyXG4gKiBAcHJvcGVydHkge251bWJlcn0gYW5nbGUgVGhlIGFuZ2xlIGJldHdlZW4gdmVjdG9yc1xyXG4gKiBAcmV0dXJucyB7IENhbGN1bGF0aW9uIH0gdGhlIGNhbGN1bGF0ZWQgYW5nbGUgYW5kIGRpc3RhbmNlIGJldHdlZW4gdmVjdG9yc1xyXG4gKi9cclxuXHRnZXRBbmdsZUFuZERpc3RhbmNlOiBmdW5jdGlvbiBnZXRBbmdsZUFuZERpc3RhbmNlKHgxLCB5MSwgeDIsIHkyKSB7XHJcblxyXG5cdFx0Ly8gc2V0IHVwIGJhc2UgdmFsdWVzXHJcblx0XHR2YXIgZFggPSB4MiAtIHgxO1xyXG5cdFx0dmFyIGRZID0geTIgLSB5MTtcclxuXHRcdC8vIGdldCB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgcG9pbnRzXHJcblx0XHR2YXIgZCA9IE1hdGguc3FydChkWCAqIGRYICsgZFkgKiBkWSk7XHJcblx0XHQvLyBhbmdsZSBpbiByYWRpYW5zXHJcblx0XHQvLyB2YXIgcmFkaWFucyA9IE1hdGguYXRhbjIoeURpc3QsIHhEaXN0KSAqIDE4MCAvIE1hdGguUEk7XHJcblx0XHQvLyBhbmdsZSBpbiByYWRpYW5zXHJcblx0XHR2YXIgciA9IE1hdGguYXRhbjIoZFksIGRYKTtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGRpc3RhbmNlOiBkLFxyXG5cdFx0XHRhbmdsZTogclxyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIGdldCBuZXcgWCBjb29yZGluYXRlIGZyb20gYW5nbGUgYW5kIGRpc3RhbmNlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gcmFkaWFucyAtIHRoZSBhbmdsZSB0byB0cmFuc2Zvcm0gaW4gcmFkaWFucy5cclxuICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gdGhlIGRpc3RhbmNlIHRvIHRyYW5zZm9ybS5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRnZXRBZGphY2VudExlbmd0aDogZnVuY3Rpb24gZ2V0QWRqYWNlbnRMZW5ndGgocmFkaWFucywgZGlzdGFuY2UpIHtcclxuXHRcdHJldHVybiBNYXRoLmNvcyhyYWRpYW5zKSAqIGRpc3RhbmNlO1xyXG5cdH1cclxuXHJcbn0sIF9kZWZpbmVQcm9wZXJ0eShfdHJpZ29ub21pY1V0aWxzLCBcImdldEFkamFjZW50TGVuZ3RoXCIsIGZ1bmN0aW9uIGdldEFkamFjZW50TGVuZ3RoKHJhZGlhbnMsIGRpc3RhbmNlKSB7XHJcblx0cmV0dXJuIE1hdGguc2luKHJhZGlhbnMpICogZGlzdGFuY2U7XHJcbn0pLCBfZGVmaW5lUHJvcGVydHkoX3RyaWdvbm9taWNVdGlscywgXCJmaW5kTmV3UG9pbnRcIiwgZnVuY3Rpb24gZmluZE5ld1BvaW50KHgsIHksIGFuZ2xlLCBkaXN0YW5jZSkge1xyXG5cdHJldHVybiB7XHJcblx0XHR4OiBNYXRoLmNvcyhhbmdsZSkgKiBkaXN0YW5jZSArIHgsXHJcblx0XHR5OiBNYXRoLnNpbihhbmdsZSkgKiBkaXN0YW5jZSArIHlcclxuXHR9O1xyXG59KSwgX2RlZmluZVByb3BlcnR5KF90cmlnb25vbWljVXRpbHMsIFwiY2FsY3VsYXRlVmVsb2NpdGllc1wiLCBmdW5jdGlvbiBjYWxjdWxhdGVWZWxvY2l0aWVzKHgsIHksIGFuZ2xlLCBpbXB1bHNlKSB7XHJcblx0dmFyIGEyID0gTWF0aC5hdGFuMihNYXRoLnNpbihhbmdsZSkgKiBpbXB1bHNlICsgeSAtIHksIE1hdGguY29zKGFuZ2xlKSAqIGltcHVsc2UgKyB4IC0geCk7XHJcblx0cmV0dXJuIHtcclxuXHRcdHhWZWw6IE1hdGguY29zKGEyKSAqIGltcHVsc2UsXHJcblx0XHR5VmVsOiBNYXRoLnNpbihhMikgKiBpbXB1bHNlXHJcblx0fTtcclxufSksIF9kZWZpbmVQcm9wZXJ0eShfdHJpZ29ub21pY1V0aWxzLCBcInJhZGlhbERpc3RyaWJ1dGlvblwiLCBmdW5jdGlvbiByYWRpYWxEaXN0cmlidXRpb24oY3gsIGN5LCByLCBhKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHg6IGN4ICsgciAqIE1hdGguY29zKGEpLFxyXG5cdFx0eTogY3kgKyByICogTWF0aC5zaW4oYSlcclxuXHR9O1xyXG59KSwgX3RyaWdvbm9taWNVdGlscyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cy50cmlnb25vbWljVXRpbHMgPSB0cmlnb25vbWljVXRpbHM7IiwiZnVuY3Rpb24gZ2V0VmFsdWUocGF0aCwgb3JpZ2luKSB7XHJcbiAgICBpZiAob3JpZ2luID09PSB2b2lkIDAgfHwgb3JpZ2luID09PSBudWxsKSBvcmlnaW4gPSBzZWxmID8gc2VsZiA6IHRoaXM7XHJcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSBwYXRoID0gJycgKyBwYXRoO1xyXG4gICAgdmFyIGMgPSAnJyxcclxuICAgICAgICBwYyxcclxuICAgICAgICBpID0gMCxcclxuICAgICAgICBuID0gcGF0aC5sZW5ndGgsXHJcbiAgICAgICAgbmFtZSA9ICcnO1xyXG4gICAgaWYgKG4pIHdoaWxlIChpIDw9IG4pIHtcclxuICAgICAgICAoYyA9IHBhdGhbaSsrXSkgPT0gJy4nIHx8IGMgPT0gJ1snIHx8IGMgPT0gJ10nIHx8IGMgPT0gdm9pZCAwID8gKG5hbWUgPyAob3JpZ2luID0gb3JpZ2luW25hbWVdLCBuYW1lID0gJycpIDogcGMgPT0gJy4nIHx8IHBjID09ICdbJyB8fCBwYyA9PSAnXScgJiYgYyA9PSAnXScgPyBpID0gbiArIDIgOiB2b2lkIDAsIHBjID0gYykgOiBuYW1lICs9IGM7XHJcbiAgICB9aWYgKGkgPT0gbiArIDIpIHRocm93IFwiSW52YWxpZCBwYXRoOiBcIiArIHBhdGg7XHJcbiAgICByZXR1cm4gb3JpZ2luO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5nZXRWYWx1ZSA9IGdldFZhbHVlOyJdfQ==
