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
    radius: { min: 0.5, max: 1.5 },
    targetRadius: { min: 1.5, max: 1.65 },
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

        var stretchVal = mathUtils.map(p.relativeMagnitude, 0, 100, 1, 10);
        var chromeVal = mathUtils.map(stretchVal, 0, 10, 1, 4);
        context.save();
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

        context.restore();

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
},{"./../../../colorUtils.js":9,"./../../../mathUtils.js":20}],39:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGJseS1saW5rZWQtbGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kYmx5LWxpbmtlZC1saXN0L2xpYi9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9kYmx5LWxpbmtlZC1saXN0L2xpYi9saXN0LW5vZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmlzZXF1YWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LXBhdGgvaW5kZXguanMiLCJzcmMvanMvRW1pdHRlckVudGl0eS5qcyIsInNyYy9qcy9hbmltYXRpb24uanMiLCJzcmMvanMvY2FudmFzQXBpQXVnbWVudGF0aW9uLmpzIiwic3JjL2pzL2NvbG9yVXRpbHMuanMiLCJzcmMvanMvZGVidWdVdGlscy5qcyIsInNyYy9qcy9lYXNpbmcuanMiLCJzcmMvanMvZW1pdHRlclN0b3JlLmpzIiwic3JjL2pzL2VtaXR0ZXJUaGVtZXMvYmFzZUVtaXR0ZXIvYmFzZUVtaXR0ZXJUaGVtZS5qcyIsInNyYy9qcy9lbWl0dGVyVGhlbWVzL2ZsYW1lU3RyZWFtL2ZsYW1lU3RyZWFtVGhlbWUuanMiLCJzcmMvanMvZW1pdHRlclRoZW1lcy9zaW5nbGVCdXJzdFRoZW1lL3NpbmdsZUJ1cnN0VGhlbWUuanMiLCJzcmMvanMvZW1pdHRlclRoZW1lcy9zbW9rZVN0cmVhbS9zbW9rZVN0cmVhbVRoZW1lLmpzIiwic3JjL2pzL2VtaXR0ZXJUaGVtZXMvd2FycFN0cmVhbS93YXJwU3RyZWFtVGhlbWUuanMiLCJzcmMvanMvZW50cnkuanMiLCJzcmMvanMvZW52aXJvbm1lbnQuanMiLCJzcmMvanMvbWF0aFV0aWxzLmpzIiwic3JjL2pzL3BhcnRpY2xlQXJyRm4uanMiLCJzcmMvanMvcGFydGljbGVGbi5qcyIsInNyYy9qcy9wYXJ0aWNsZUZ1bmN0aW9ucy9jaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnMuanMiLCJzcmMvanMvcGFydGljbGVGdW5jdGlvbnMvY3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzLmpzIiwic3JjL2pzL3BhcnRpY2xlRnVuY3Rpb25zL2tpbGxQYXJ0aWNsZS5qcyIsInNyYy9qcy9wYXJ0aWNsZUZ1bmN0aW9ucy9yZW5kZXJQYXJ0aWNsZUFyci5qcyIsInNyYy9qcy9wYXJ0aWNsZUZ1bmN0aW9ucy91cGRhdGVQYXJ0aWNsZS5qcyIsInNyYy9qcy9wYXJ0aWNsZUZ1bmN0aW9ucy91cGRhdGVQYXJ0aWNsZUFyci5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL2ZpcmUvYW5pbWF0aW9uVHJhY2tzLmpzIiwic3JjL2pzL3BhcnRpY2xlVGhlbWVzL3RoZW1lcy9maXJlL2N1c3RvbUF0dHJpYnV0ZXMuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL2ZpcmUva2lsbENvbmRpdGlvbnMuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL2ZpcmUvcmVuZGVyRm4uanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL2ZpcmUvdGhlbWUuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL2ZsYW1lL2ZsYW1lVGhlbWUuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL3Jlc2V0L3Jlc2V0VGhlbWUuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL3Ntb2tlL3Ntb2tlVGhlbWUuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL3dhcnBTdGFyL3dhcnBTdGFyVGhlbWUuanMiLCJzcmMvanMvcGFydGljbGVzLmpzIiwic3JjL2pzL3RyaWdvbm9taWNVdGlscy5qcyIsInNyYy9qcy91dGlsaXRpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeHpEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIEBmaWxlT3ZlcnZpZXcgSW1wbGVtZW50YXRpb24gb2YgYSBkb3VibHkgbGlua2VkLWxpc3QgZGF0YSBzdHJ1Y3R1cmVcbiAqIEBhdXRob3IgSmFzb24gUy4gSm9uZXNcbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGlzRXF1YWwgPSByZXF1aXJlKCdsb2Rhc2guaXNlcXVhbCcpO1xuICAgIHZhciBOb2RlID0gcmVxdWlyZSgnLi9saWIvbGlzdC1ub2RlJyk7XG4gICAgdmFyIEl0ZXJhdG9yID0gcmVxdWlyZSgnLi9saWIvaXRlcmF0b3InKTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIERvdWJseSBsaW5rZWQgbGlzdCBjbGFzc1xuICAgICAqXG4gICAgICogSW1wbGVtZW50YXRpb24gb2YgYSBkb3VibHkgbGlua2VkIGxpc3QgZGF0YSBzdHJ1Y3R1cmUuICBUaGlzXG4gICAgICogaW1wbGVtZW50YXRpb24gcHJvdmlkZXMgdGhlIGdlbmVyYWwgZnVuY3Rpb25hbGl0eSBvZiBhZGRpbmcgbm9kZXMgdG9cbiAgICAgKiB0aGUgZnJvbnQgb3IgYmFjayBvZiB0aGUgbGlzdCwgYXMgd2VsbCBhcyByZW1vdmluZyBub2RlIGZyb20gdGhlIGZyb250XG4gICAgICogb3IgYmFjay4gIFRoaXMgZnVuY3Rpb25hbGl0eSBlbmFibGVzIHRoaXMgaW1wbGVtZW50aW9uIHRvIGJlIHRoZVxuICAgICAqIHVuZGVybHlpbmcgZGF0YSBzdHJ1Y3R1cmUgZm9yIHRoZSBtb3JlIHNwZWNpZmljIHN0YWNrIG9yIHF1ZXVlIGRhdGFcbiAgICAgKiBzdHJ1Y3R1cmUuXG4gICAgICpcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIExpbmtlZExpc3QgaW5zdGFuY2UuICBFYWNoIGluc3RhbmNlIGhhcyBhIGhlYWQgbm9kZSwgYSB0YWlsXG4gICAgICogbm9kZSBhbmQgYSBzaXplLCB3aGljaCByZXByZXNlbnRzIHRoZSBudW1iZXIgb2Ygbm9kZXMgaW4gdGhlIGxpc3QuXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBEb3VibHlMaW5rZWRMaXN0KCkge1xuICAgICAgICB0aGlzLmhlYWQgPSBudWxsO1xuICAgICAgICB0aGlzLnRhaWwgPSBudWxsO1xuICAgICAgICB0aGlzLnNpemUgPSAwO1xuXG4gICAgICAgIC8vIGFkZCBpdGVyYXRvciBhcyBhIHByb3BlcnR5IG9mIHRoaXMgbGlzdCB0byBzaGFyZSB0aGUgc2FtZVxuICAgICAgICAvLyBpdGVyYXRvciBpbnN0YW5jZSB3aXRoIGFsbCBvdGhlciBtZXRob2RzIHRoYXQgbWF5IHJlcXVpcmVcbiAgICAgICAgLy8gaXRzIHVzZS4gIE5vdGU6IGJlIHN1cmUgdG8gY2FsbCB0aGlzLml0ZXJhdG9yLnJlc2V0KCkgdG9cbiAgICAgICAgLy8gcmVzZXQgdGhpcyBpdGVyYXRvciB0byBwb2ludCB0aGUgaGVhZCBvZiB0aGUgbGlzdC5cbiAgICAgICAgdGhpcy5pdGVyYXRvciA9IG5ldyBJdGVyYXRvcih0aGlzKTtcbiAgICB9XG5cbiAgICAvKiBGdW5jdGlvbnMgYXR0YWNoZWQgdG8gdGhlIExpbmtlZC1saXN0IHByb3RvdHlwZS4gIEFsbCBsaW5rZWQtbGlzdFxuICAgICAqIGluc3RhbmNlcyB3aWxsIHNoYXJlIHRoZXNlIG1ldGhvZHMsIG1lYW5pbmcgdGhlcmUgd2lsbCBOT1QgYmUgY29waWVzXG4gICAgICogbWFkZSBmb3IgZWFjaCBpbnN0YW5jZS4gIFRoaXMgd2lsbCBiZSBhIGh1Z2UgbWVtb3J5IHNhdmluZ3Mgc2luY2UgdGhlcmVcbiAgICAgKiBtYXkgYmUgc2V2ZXJhbCBkaWZmZXJlbnQgbGlua2VkIGxpc3RzLlxuICAgICAqL1xuICAgIERvdWJseUxpbmtlZExpc3QucHJvdG90eXBlID0ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGVzIGEgbmV3IE5vZGUgb2JqZWN0IHdpdGggJ2RhdGEnIGFzc2lnbmVkIHRvIHRoZSBub2RlJ3MgZGF0YVxuICAgICAgICAgKiBwcm9wZXJ0eVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBkYXRhIFRoZSBkYXRhIHRvIGluaXRpYWxpemUgd2l0aCB0aGVcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlXG4gICAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IE5vZGUgb2JqZWN0IGludGlhbGl6ZWQgd2l0aCAnZGF0YSdcbiAgICAgICAgICovXG4gICAgICAgIGNyZWF0ZU5ld05vZGU6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGZpcnN0IG5vZGUgaW4gdGhlIGxpc3QsIGNvbW1vbmx5IHJlZmVycmVkIHRvIGFzIHRoZVxuICAgICAgICAgKiAnaGVhZCcgbm9kZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSB0aGUgaGVhZCBub2RlIG9mIHRoZSBsaXN0XG4gICAgICAgICAqL1xuICAgICAgICBnZXRIZWFkTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVhZDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgbGFzdCBub2RlIGluIHRoZSBsaXN0LCBjb21tb25seSByZWZlcnJlZCB0byBhcyB0aGVcbiAgICAgICAgICogJ3RhaWwnbm9kZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSB0aGUgdGFpbCBub2RlIG9mIHRoZSBsaXN0XG4gICAgICAgICAqL1xuICAgICAgICBnZXRUYWlsTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGFpbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGV0ZXJtaW5lcyBpZiB0aGUgbGlzdCBpcyBlbXB0eVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgbGlzdCBpcyBlbXB0eSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBpc0VtcHR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuc2l6ZSA9PT0gMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIHNpemUgb2YgdGhlIGxpc3QsIG9yIG51bWJlciBvZiBub2Rlc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIG5vZGVzIGluIHRoZSBsaXN0XG4gICAgICAgICAqL1xuICAgICAgICBnZXRTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaXplO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGVhcnMgdGhlIGxpc3Qgb2YgYWxsIG5vZGVzL2RhdGFcbiAgICAgICAgICovXG4gICAgICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3aGlsZSAoIXRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyMjIyMjIyMjIyMjIyMjIyMjIyBJTlNFUlQgbWV0aG9kcyAjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnNlcnRzIGEgbm9kZSB3aXRoIHRoZSBwcm92aWRlZCBkYXRhIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YSBUaGUgZGF0YSB0byBpbml0aWFsaXplIHdpdGggdGhlXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbnNlcnQgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnQ6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRoaXMuY3JlYXRlTmV3Tm9kZShkYXRhKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZCA9IHRoaXMudGFpbCA9IG5ld05vZGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGFpbC5uZXh0ID0gbmV3Tm9kZTtcbiAgICAgICAgICAgICAgICBuZXdOb2RlLnByZXYgPSB0aGlzLnRhaWw7XG4gICAgICAgICAgICAgICAgdGhpcy50YWlsID0gbmV3Tm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2l6ZSArPSAxO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zZXJ0cyBhIG5vZGUgd2l0aCB0aGUgcHJvdmlkZWQgZGF0YSB0byB0aGUgZnJvbnQgb2YgdGhlIGxpc3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YSBUaGUgZGF0YSB0byBpbml0aWFsaXplIHdpdGggdGhlXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbnNlcnQgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnRGaXJzdDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0KGRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRoaXMuY3JlYXRlTmV3Tm9kZShkYXRhKTtcblxuICAgICAgICAgICAgICAgIG5ld05vZGUubmV4dCA9IHRoaXMuaGVhZDtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQucHJldiA9IG5ld05vZGU7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkID0gbmV3Tm9kZTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZSArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zZXJ0cyBhIG5vZGUgd2l0aCB0aGUgcHJvdmlkZWQgZGF0YSBhdCB0aGUgaW5kZXggaW5kaWNhdGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggVGhlIGluZGV4IGluIHRoZSBsaXN0IHRvIGluc2VydCB0aGUgbmV3IG5vZGVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YSBUaGUgZGF0YSB0byBpbml0aWFsaXplIHdpdGggdGhlIG5vZGVcbiAgICAgICAgICovXG4gICAgICAgIGluc2VydEF0OiBmdW5jdGlvbiAoaW5kZXgsIGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5nZXRIZWFkTm9kZSgpLFxuICAgICAgICAgICAgICAgIG5ld05vZGUgPSB0aGlzLmNyZWF0ZU5ld05vZGUoZGF0YSksXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSAwO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgaW5kZXggb3V0LW9mLWJvdW5kc1xuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuZ2V0U2l6ZSgpIC0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgaW5kZXggaXMgMCwgd2UganVzdCBuZWVkIHRvIGluc2VydCB0aGUgZmlyc3Qgbm9kZVxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRGaXJzdChkYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN1cnJlbnQucHJldi5uZXh0ID0gbmV3Tm9kZTtcbiAgICAgICAgICAgIG5ld05vZGUucHJldiA9IGN1cnJlbnQucHJldjtcbiAgICAgICAgICAgIGN1cnJlbnQucHJldiA9IG5ld05vZGU7XG4gICAgICAgICAgICBuZXdOb2RlLm5leHQgPSBjdXJyZW50O1xuXG4gICAgICAgICAgICB0aGlzLnNpemUgKz0gMTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc2VydHMgYSBub2RlIGJlZm9yZSB0aGUgZmlyc3Qgbm9kZSBjb250YWluaW5nIHRoZSBwcm92aWRlZCBkYXRhXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IG5vZGVEYXRhIFRoZSBkYXRhIG9mIHRoZSBub2RlIHRvXG4gICAgICAgICAqICAgICAgICAgZmluZCB0byBpbnNlcnQgdGhlIG5ldyBub2RlIGJlZm9yZVxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBkYXRhVG9JbnNlcnQgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZSBub2RlXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGluc2VydCBvcGVyYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICAgICAgICovXG4gICAgICAgIGluc2VydEJlZm9yZTogZnVuY3Rpb24gKG5vZGVEYXRhLCBkYXRhVG9JbnNlcnQpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuaW5kZXhPZihub2RlRGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnNlcnRBdChpbmRleCwgZGF0YVRvSW5zZXJ0KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zZXJ0cyBhIG5vZGUgYWZ0ZXIgdGhlIGZpcnN0IG5vZGUgY29udGFpbmluZyB0aGUgcHJvdmlkZWQgZGF0YVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBub2RlRGF0YSBUaGUgZGF0YSBvZiB0aGUgbm9kZSB0b1xuICAgICAgICAgKiAgICAgICAgIGZpbmQgdG8gaW5zZXJ0IHRoZSBuZXcgbm9kZSBhZnRlclxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBkYXRhVG9JbnNlcnQgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZSBub2RlXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGluc2VydCBvcGVyYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICAgICAgICovXG4gICAgICAgIGluc2VydEFmdGVyOiBmdW5jdGlvbiAobm9kZURhdGEsIGRhdGFUb0luc2VydCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5pbmRleE9mKG5vZGVEYXRhKTtcbiAgICAgICAgICAgIHZhciBzaXplID0gdGhpcy5nZXRTaXplKCk7XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHdlIHdhbnQgdG8gaW5zZXJ0IG5ldyBub2RlIGFmdGVyIHRoZSB0YWlsIG5vZGVcbiAgICAgICAgICAgIGlmIChpbmRleCArIDEgPT09IHNpemUpIHtcblxuICAgICAgICAgICAgICAgIC8vIGlmIHNvLCBjYWxsIGluc2VydCwgd2hpY2ggd2lsbCBhcHBlbmQgdG8gdGhlIGVuZCBieSBkZWZhdWx0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0KGRhdGFUb0luc2VydCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UsIGluY3JlbWVudCB0aGUgaW5kZXggYW5kIGluc2VydCB0aGVyZVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluc2VydEF0KGluZGV4ICsgMSwgZGF0YVRvSW5zZXJ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29uY2F0ZW5hdGUgYW5vdGhlciBsaW5rZWQgbGlzdCB0byB0aGUgZW5kIG9mIHRoaXMgbGlua2VkIGxpc3QuIFRoZSByZXN1bHQgaXMgdmVyeVxuICAgICAgICAgKiBzaW1pbGFyIHRvIGFycmF5LmNvbmNhdCBidXQgaGFzIGEgcGVyZm9ybWFuY2UgaW1wcm92ZW1lbnQgc2luY2UgdGhlcmUgaXMgbm8gbmVlZCB0b1xuICAgICAgICAgKiBpdGVyYXRlIG92ZXIgdGhlIGxpc3RzXG4gICAgICAgICAqIEBwYXJhbSB7RG91Ymx5TGlua2VkTGlzdH0gb3RoZXJMaW5rZWRMaXN0XG4gICAgICAgICAqIEByZXR1cm5zIHtEb3VibHlMaW5rZWRMaXN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uY2F0OiBmdW5jdGlvbiAob3RoZXJMaW5rZWRMaXN0KSB7XG4gICAgICAgICAgICBpZiAob3RoZXJMaW5rZWRMaXN0IGluc3RhbmNlb2YgRG91Ymx5TGlua2VkTGlzdCkge1xuICAgICAgICAgICAgICAgIC8vY3JlYXRlIG5ldyBsaXN0IHNvIHRoZSBjYWxsaW5nIGxpc3QgaXMgaW1tdXRhYmxlIChsaWtlIGFycmF5LmNvbmNhdClcbiAgICAgICAgICAgICAgICB2YXIgbmV3TGlzdCA9IG5ldyBEb3VibHlMaW5rZWRMaXN0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2l6ZSgpID4gMCkgeyAvL3RoaXMgbGlzdCBpcyBOT1QgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC5oZWFkID0gdGhpcy5nZXRIZWFkTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICBuZXdMaXN0LnRhaWwgPSB0aGlzLmdldFRhaWxOb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3QudGFpbC5uZXh0ID0gb3RoZXJMaW5rZWRMaXN0LmdldEhlYWROb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdGhlckxpbmtlZExpc3QuZ2V0U2l6ZSgpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC50YWlsID0gb3RoZXJMaW5rZWRMaXN0LmdldFRhaWxOb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC5zaXplID0gdGhpcy5nZXRTaXplKCkgKyBvdGhlckxpbmtlZExpc3QuZ2V0U2l6ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgLy8ndGhpcycgbGlzdCBpcyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICBuZXdMaXN0LmhlYWQgPSBvdGhlckxpbmtlZExpc3QuZ2V0SGVhZE5vZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC50YWlsID0gb3RoZXJMaW5rZWRMaXN0LmdldFRhaWxOb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3Quc2l6ZSA9IG90aGVyTGlua2VkTGlzdC5nZXRTaXplKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXdMaXN0O1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gb25seSBjb25jYXQgYW5vdGhlciBpbnN0YW5jZSBvZiBEb3VibHlMaW5rZWRMaXN0XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIyMjIyMjIyMjIyMjIyMjIyMjIFJFTU9WRSBtZXRob2RzICMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgdGhlIHRhaWwgbm9kZSBmcm9tIHRoZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZXJlIGlzIGEgc2lnbmlmaWNhbnQgcGVyZm9ybWFuY2UgaW1wcm92ZW1lbnQgd2l0aCB0aGUgb3BlcmF0aW9uXG4gICAgICAgICAqIG92ZXIgaXRzIHNpbmdseSBsaW5rZWQgbGlzdCBjb3VudGVycGFydC4gIFRoZSBtZXJlIGZhY3Qgb2YgaGF2aW5nXG4gICAgICAgICAqIGEgcmVmZXJlbmNlIHRvIHRoZSBwcmV2aW91cyBub2RlIGltcHJvdmVzIHRoaXMgb3BlcmF0aW9uIGZyb20gTyhuKVxuICAgICAgICAgKiAoaW4gdGhlIGNhc2Ugb2Ygc2luZ2x5IGxpbmtlZCBsaXN0KSB0byBPKDEpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgbm9kZSB0aGF0IHdhcyByZW1vdmVkXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBnZXQgaGFuZGxlIGZvciB0aGUgdGFpbCBub2RlXG4gICAgICAgICAgICB2YXIgbm9kZVRvUmVtb3ZlID0gdGhpcy5nZXRUYWlsTm9kZSgpO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSBub2RlIGluIHRoZSBsaXN0LCBzZXQgaGVhZCBhbmQgdGFpbFxuICAgICAgICAgICAgLy8gcHJvcGVydGllcyB0byBudWxsXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRTaXplKCkgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMudGFpbCA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIG1vcmUgdGhhbiBvbmUgbm9kZSBpbiB0aGUgbGlzdFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwgPSB0aGlzLmdldFRhaWxOb2RlKCkucHJldjtcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwubmV4dCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNpemUgLT0gMTtcblxuICAgICAgICAgICAgcmV0dXJuIG5vZGVUb1JlbW92ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyB0aGUgaGVhZCBub2RlIGZyb20gdGhlIGxpc3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMgdGhlIG5vZGUgdGhhdCB3YXMgcmVtb3ZlZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlRmlyc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbm9kZVRvUmVtb3ZlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRTaXplKCkgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBub2RlVG9SZW1vdmUgPSB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlVG9SZW1vdmUgPSB0aGlzLmdldEhlYWROb2RlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkID0gdGhpcy5oZWFkLm5leHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkLnByZXYgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZSAtPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbm9kZVRvUmVtb3ZlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIHRoZSBub2RlIGF0IHRoZSBpbmRleCBwcm92aWRlZFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBub2RlIHRvIHJlbW92ZVxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgbm9kZSB0aGF0IHdhcyByZW1vdmVkXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmVBdDogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgbm9kZVRvUmVtb3ZlID0gdGhpcy5maW5kQXQoaW5kZXgpO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgaW5kZXggb3V0LW9mLWJvdW5kc1xuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuZ2V0U2l6ZSgpIC0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBpbmRleCBpcyAwLCB3ZSBqdXN0IG5lZWQgdG8gcmVtb3ZlIHRoZSBmaXJzdCBub2RlXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVGaXJzdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBpbmRleCBpcyBzaXplLTEsIHdlIGp1c3QgbmVlZCB0byByZW1vdmUgdGhlIGxhc3Qgbm9kZSxcbiAgICAgICAgICAgIC8vIHdoaWNoIHJlbW92ZSgpIGRvZXMgYnkgZGVmYXVsdFxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSB0aGlzLmdldFNpemUoKSAtIDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbm9kZVRvUmVtb3ZlLnByZXYubmV4dCA9IG5vZGVUb1JlbW92ZS5uZXh0O1xuICAgICAgICAgICAgbm9kZVRvUmVtb3ZlLm5leHQucHJldiA9IG5vZGVUb1JlbW92ZS5wcmV2O1xuICAgICAgICAgICAgbm9kZVRvUmVtb3ZlLm5leHQgPSBub2RlVG9SZW1vdmUucHJldiA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuc2l6ZSAtPSAxO1xuXG4gICAgICAgICAgICByZXR1cm4gbm9kZVRvUmVtb3ZlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIHRoZSBmaXJzdCBub2RlIHRoYXQgY29udGFpbnMgdGhlIGRhdGEgcHJvdmlkZWRcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gbm9kZURhdGEgVGhlIGRhdGEgb2YgdGhlIG5vZGUgdG8gcmVtb3ZlXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBub2RlIHRoYXQgd2FzIHJlbW92ZWRcbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZU5vZGU6IGZ1bmN0aW9uIChub2RlRGF0YSkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5pbmRleE9mKG5vZGVEYXRhKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUF0KGluZGV4KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyMjIyMjIyMjIyMjIyMjIyMjIyBGSU5EIG1ldGhvZHMgIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IG5vZGUgY29udGFpbmluZyB0aGUgcHJvdmlkZWQgZGF0YS4gIElmXG4gICAgICAgICAqIGEgbm9kZSBjYW5ub3QgYmUgZm91bmQgY29udGFpbmluZyB0aGUgcHJvdmlkZWQgZGF0YSwgLTEgaXMgcmV0dXJuZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IG5vZGVEYXRhIFRoZSBkYXRhIG9mIHRoZSBub2RlIHRvIGZpbmRcbiAgICAgICAgICogQHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBub2RlIGlmIGZvdW5kLCAtMSBvdGhlcndpc2VcbiAgICAgICAgICovXG4gICAgICAgIGluZGV4T2Y6IGZ1bmN0aW9uIChub2RlRGF0YSkge1xuICAgICAgICAgICAgdGhpcy5pdGVyYXRvci5yZXNldCgpO1xuICAgICAgICAgICAgdmFyIGN1cnJlbnQ7XG5cbiAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XG5cbiAgICAgICAgICAgIC8vIGl0ZXJhdGUgb3ZlciB0aGUgbGlzdCAoa2VlcGluZyB0cmFjayBvZiB0aGUgaW5kZXggdmFsdWUpIHVudGlsXG4gICAgICAgICAgICAvLyB3ZSBmaW5kIHRoZSBub2RlIGNvbnRhaW5nIHRoZSBub2RlRGF0YSB3ZSBhcmUgbG9va2luZyBmb3JcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLml0ZXJhdG9yLmhhc05leHQoKSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSB0aGlzLml0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNFcXVhbChjdXJyZW50LmdldERhdGEoKSwgbm9kZURhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gb25seSBnZXQgaGVyZSBpZiB3ZSBkaWRuJ3QgZmluZCBhIG5vZGUgY29udGFpbmluZyB0aGUgbm9kZURhdGFcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgZmlzdCBub2RlIGNvbnRhaW5pbmcgdGhlIHByb3ZpZGVkIGRhdGEuICBJZiBhIG5vZGVcbiAgICAgICAgICogY2Fubm90IGJlIGZvdW5kIGNvbnRhaW5pbmcgdGhlIHByb3ZpZGVkIGRhdGEsIC0xIGlzIHJldHVybmVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBub2RlRGF0YSBUaGUgZGF0YSBvZiB0aGUgbm9kZSB0byBmaW5kXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBub2RlIGlmIGZvdW5kLCAtMSBvdGhlcndpc2VcbiAgICAgICAgICovXG4gICAgICAgIGZpbmQ6IGZ1bmN0aW9uIChub2RlRGF0YSkge1xuICAgICAgICAgICAgLy8gc3RhcnQgYXQgdGhlIGhlYWQgb2YgdGhlIGxpc3RcbiAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IucmVzZXQoKTtcbiAgICAgICAgICAgIHZhciBjdXJyZW50O1xuXG4gICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhlIGxpc3QgdW50aWwgd2UgZmluZCB0aGUgbm9kZSBjb250YWluaW5nIHRoZSBkYXRhXG4gICAgICAgICAgICAvLyB3ZSBhcmUgbG9va2luZyBmb3JcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLml0ZXJhdG9yLmhhc05leHQoKSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSB0aGlzLml0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNFcXVhbChjdXJyZW50LmdldERhdGEoKSwgbm9kZURhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gb25seSBnZXQgaGVyZSBpZiB3ZSBkaWRuJ3QgZmluZCBhIG5vZGUgY29udGFpbmluZyB0aGUgbm9kZURhdGFcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgbm9kZSBhdCB0aGUgbG9jYXRpb24gcHJvdmlkZWQgYnkgaW5kZXhcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFRoZSBpbmRleCBvZiB0aGUgbm9kZSB0byByZXR1cm5cbiAgICAgICAgICogQHJldHVybnMgdGhlIG5vZGUgbG9jYXRlZCBhdCB0aGUgaW5kZXggcHJvdmlkZWQuXG4gICAgICAgICAqL1xuICAgICAgICBmaW5kQXQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgLy8gaWYgaWR4IGlzIG91dCBvZiBib3VuZHMgb3IgZm4gY2FsbGVkIG9uIGVtcHR5IGxpc3QsIHJldHVybiAtMVxuICAgICAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpIHx8IGluZGV4ID4gdGhpcy5nZXRTaXplKCkgLSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBlbHNlLCBsb29wIHRocm91Z2ggdGhlIGxpc3QgYW5kIHJldHVybiB0aGUgbm9kZSBpbiB0aGVcbiAgICAgICAgICAgIC8vIHBvc2l0aW9uIHByb3ZpZGVkIGJ5IGlkeC4gIEFzc3VtZSB6ZXJvLWJhc2VkIHBvc2l0aW9ucy5cbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5nZXRIZWFkTm9kZSgpO1xuICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gMDtcblxuICAgICAgICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBsaXN0IGNvbnRhaW5zIHRoZSBwcm92aWRlZCBub2RlRGF0YVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBub2RlRGF0YSBUaGUgZGF0YSB0byBjaGVjayBpZiB0aGUgbGlzdFxuICAgICAgICAgKiAgICAgICAgY29udGFpbnNcbiAgICAgICAgICogQHJldHVybnMgdGhlIHRydWUgaWYgdGhlIGxpc3QgY29udGFpbnMgbm9kZURhdGEsIGZhbHNlIG90aGVyd2lzZVxuICAgICAgICAgKi9cbiAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uIChub2RlRGF0YSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXhPZihub2RlRGF0YSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8jIyMjIyMjIyMjIyMjIyMjIyMgVVRJTElUWSBtZXRob2RzICMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFV0aWxpdHkgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIHRoZSBsaXN0IGFuZCBjYWxsIHRoZSBmbiBwcm92aWRlZFxuICAgICAgICAgKiBvbiBlYWNoIG5vZGUsIG9yIGVsZW1lbnQsIG9mIHRoZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBvbiBlYWNoIG5vZGUgb2YgdGhlIGxpc3RcbiAgICAgICAgICogQHBhcmFtIHtib29sfSByZXZlcnNlIFVzZSBvciBub3QgcmV2ZXJzZSBpdGVyYXRpb24gKHRhaWwgdG8gaGVhZCksIGRlZmF1bHQgdG8gZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgICAgICAgICAgcmV2ZXJzZSA9IHJldmVyc2UgfHwgZmFsc2U7XG4gICAgICAgICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IucmVzZXRfcmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IuZWFjaF9yZXZlcnNlKGZuKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVyYXRvci5yZXNldCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IuZWFjaChmbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHRoZSBkYXRhIGNvbnRhaW5lZCBpbiB0aGUgbGlzdFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7YXJyYXl9IHRoZSBhcnJheSBvZiBhbGwgdGhlIGRhdGEgZnJvbSB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgdG9BcnJheTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGxpc3RBcnJheSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgbGlzdEFycmF5LnB1c2gobm9kZS5nZXREYXRhKCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBsaXN0QXJyYXk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEludGVycnVwdHMgaXRlcmF0aW9uIG92ZXIgdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgICAgIGludGVycnVwdEVudW1lcmF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLml0ZXJhdG9yLmludGVycnVwdCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gRG91Ymx5TGlua2VkTGlzdDtcblxufSgpKTtcbiIsIi8qKlxuICogQGZpbGVPdmVydmlldyBJbXBsZW1lbnRhdGlvbiBvZiBhbiBpdGVyYXRvciBmb3IgYSBsaW5rZWQgbGlzdFxuICogICAgICAgICAgICAgICBkYXRhIHN0cnVjdHVyZVxuICogQGF1dGhvciBKYXNvbiBTLiBKb25lc1xuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBJdGVyYXRvciBjbGFzc1xuICAgICAqXG4gICAgICogUmVwcmVzZW50cyBhbiBpbnN0YW50aWF0aW9uIG9mIGFuIGl0ZXJhdG9yIHRvIGJlIHVzZWRcbiAgICAgKiB3aXRoaW4gYSBsaW5rZWQgbGlzdC4gIFRoZSBpdGVyYXRvciB3aWxsIHByb3ZpZGUgdGhlIGFiaWxpdHlcbiAgICAgKiB0byBpdGVyYXRlIG92ZXIgYWxsIG5vZGVzIGluIGEgbGlzdCBieSBrZWVwaW5nIHRyYWNrIG9mIHRoZVxuICAgICAqIHBvc3RpdGlvbiBvZiBhICdjdXJyZW50Tm9kZScuICBUaGlzICdjdXJyZW50Tm9kZScgcG9pbnRlclxuICAgICAqIHdpbGwga2VlcCBzdGF0ZSB1bnRpbCBhIHJlc2V0KCkgb3BlcmF0aW9uIGlzIGNhbGxlZCBhdCB3aGljaFxuICAgICAqIHRpbWUgaXQgd2lsbCByZXNldCB0byBwb2ludCB0aGUgaGVhZCBvZiB0aGUgbGlzdC5cbiAgICAgKlxuICAgICAqIEV2ZW4gdGhvdWdoIHRoaXMgaXRlcmF0b3IgY2xhc3MgaXMgaW5leHRyaWNhYmx5IGxpbmtlZFxuICAgICAqIChubyBwdW4gaW50ZW5kZWQpIHRvIGEgbGlua2VkIGxpc3QgaW5zdGF0aWF0aW9uLCBpdCB3YXMgcmVtb3ZlZFxuICAgICAqIGZyb20gd2l0aGluIHRoZSBsaW5rZWQgbGlzdCBjb2RlIHRvIGFkaGVyZSB0byB0aGUgYmVzdCBwcmFjdGljZVxuICAgICAqIG9mIHNlcGFyYXRpb24gb2YgY29uY2VybnMuXG4gICAgICpcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpdGVyYXRvciBpbnN0YW5jZSB0byBpdGVyYXRlIG92ZXIgdGhlIGxpbmtlZCBsaXN0IHByb3ZpZGVkLlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHRoZUxpc3QgdGhlIGxpbmtlZCBsaXN0IHRvIGl0ZXJhdGUgb3ZlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEl0ZXJhdG9yKHRoZUxpc3QpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gdGhlTGlzdCB8fCBudWxsO1xuICAgICAgICB0aGlzLnN0b3BJdGVyYXRpb25GbGFnID0gZmFsc2U7XG5cbiAgICAgICAgLy8gYSBwb2ludGVyIHRoZSBjdXJyZW50IG5vZGUgaW4gdGhlIGxpc3QgdGhhdCB3aWxsIGJlIHJldHVybmVkLlxuICAgICAgICAvLyBpbml0aWFsbHkgdGhpcyB3aWxsIGJlIG51bGwgc2luY2UgdGhlICdsaXN0JyB3aWxsIGJlIGVtcHR5XG4gICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSBudWxsO1xuICAgIH1cblxuICAgIC8qIEZ1bmN0aW9ucyBhdHRhY2hlZCB0byB0aGUgSXRlcmF0b3IgcHJvdG90eXBlLiAgQWxsIGl0ZXJhdG9yIGluc3RhbmNlc1xuICAgICAqIHdpbGwgc2hhcmUgdGhlc2UgbWV0aG9kcywgbWVhbmluZyB0aGVyZSB3aWxsIE5PVCBiZSBjb3BpZXMgbWFkZSBmb3IgZWFjaFxuICAgICAqIGluc3RhbmNlLlxuICAgICAqL1xuICAgIEl0ZXJhdG9yLnByb3RvdHlwZSA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgbmV4dCBub2RlIGluIHRoZSBpdGVyYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IHRoZSBuZXh0IG5vZGUgaW4gdGhlIGl0ZXJhdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5jdXJyZW50Tm9kZTtcbiAgICAgICAgICAgIC8vIGEgY2hlY2sgdG8gcHJldmVudCBlcnJvciBpZiByYW5kb21seSBjYWxsaW5nIG5leHQoKSB3aGVuXG4gICAgICAgICAgICAvLyBpdGVyYXRvciBpcyBhdCB0aGUgZW5kIG9mIHRoZSBsaXN0LCBtZWFpbmluZyB0aGUgY3VycmVudE5vZGVcbiAgICAgICAgICAgIC8vIHdpbGwgYmUgcG9pbnRpbmcgdG8gbnVsbC5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBXaGVuIHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkLCBpdCB3aWxsIHJldHVybiB0aGUgbm9kZSBjdXJyZW50bHlcbiAgICAgICAgICAgIC8vIGFzc2lnbmVkIHRvIHRoaXMuY3VycmVudE5vZGUgYW5kIG1vdmUgdGhlIHBvaW50ZXIgdG8gdGhlIG5leHRcbiAgICAgICAgICAgIC8vIG5vZGUgaW4gdGhlIGxpc3QgKGlmIGl0IGV4aXN0cylcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnROb2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IHRoaXMuY3VycmVudE5vZGUubmV4dDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERldGVybWluZXMgaWYgdGhlIGl0ZXJhdG9yIGhhcyBhIG5vZGUgdG8gcmV0dXJuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGl0ZXJhdG9yIGhhcyBhIG5vZGUgdG8gcmV0dXJuLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgICAgICovXG4gICAgICAgIGhhc05leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnROb2RlICE9PSBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNldHMgdGhlIGl0ZXJhdG9yIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGxpc3QuXG4gICAgICAgICAqL1xuICAgICAgICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IHRoaXMubGlzdC5nZXRIZWFkTm9kZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBub2RlIGluIHRoZSBsaXN0IGFuZCBtb3ZlcyB0aGUgaXRlcmF0b3IgdG9cbiAgICAgICAgICogcG9pbnQgdG8gdGhlIHNlY29uZCBub2RlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgZmlyc3Qgbm9kZSBpbiB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgZmlyc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgbGlzdCB0byBpdGVyYXRlIG92ZXJcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHRoZUxpc3QgdGhlIGxpbmtlZCBsaXN0IHRvIGl0ZXJhdGUgb3ZlclxuICAgICAgICAgKi9cbiAgICAgICAgc2V0TGlzdDogZnVuY3Rpb24gKHRoZUxpc3QpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdCA9IHRoZUxpc3Q7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEl0ZXJhdGVzIG92ZXIgYWxsIG5vZGVzIGluIHRoZSBsaXN0IGFuZCBjYWxscyB0aGUgcHJvdmlkZWQgY2FsbGJhY2tcbiAgICAgICAgICogZnVuY3Rpb24gd2l0aCBlYWNoIG5vZGUgYXMgYW4gYXJndW1lbnQuXG4gICAgICAgICAqIEl0ZXJhdGlvbiB3aWxsIGJyZWFrIGlmIGludGVycnVwdCgpIGlzIGNhbGxlZFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdpdGhcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgZWFjaCBub2RlIG9mIHRoZSBsaXN0IGFzIGFuIGFyZ1xuICAgICAgICAgKi9cbiAgICAgICAgZWFjaDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB2YXIgZWw7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5oYXNOZXh0KCkgJiYgIXRoaXMuc3RvcEl0ZXJhdGlvbkZsYWcpIHtcbiAgICAgICAgICAgICAgICBlbCA9IHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RvcEl0ZXJhdGlvbkZsYWcgPSBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKlxuICAgICAgICAgKiAjIyMgUkVWRVJTRSBJVEVSQVRJT04gKFRBSUwgLT4gSEVBRCkgIyMjXG4gICAgICAgICAqL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBub2RlIGluIHRoZSBsaXN0IGFuZCBtb3ZlcyB0aGUgaXRlcmF0b3IgdG9cbiAgICAgICAgICogcG9pbnQgdG8gdGhlIHNlY29uZCBub2RlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgZmlyc3Qgbm9kZSBpbiB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgbGFzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5yZXNldF9yZXZlcnNlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0X3JldmVyc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzZXRzIHRoZSBpdGVyYXRvciB0byB0aGUgdGFpbCBvZiB0aGUgbGlzdC5cbiAgICAgICAgICovXG4gICAgICAgIHJlc2V0X3JldmVyc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSB0aGlzLmxpc3QuZ2V0VGFpbE5vZGUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgbmV4dCBub2RlIGluIHRoZSBpdGVyYXRpb24sIHdoZW4gaXRlcmF0aW5nIGZyb20gdGFpbCB0byBoZWFkXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IHRoZSBuZXh0IG5vZGUgaW4gdGhlIGl0ZXJhdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIG5leHRfcmV2ZXJzZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnROb2RlO1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudE5vZGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gdGhpcy5jdXJyZW50Tm9kZS5wcmV2O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSXRlcmF0ZXMgb3ZlciBhbGwgbm9kZXMgaW4gdGhlIGxpc3QgYW5kIGNhbGxzIHRoZSBwcm92aWRlZCBjYWxsYmFja1xuICAgICAgICAgKiBmdW5jdGlvbiB3aXRoIGVhY2ggbm9kZSBhcyBhbiBhcmd1bWVudCxcbiAgICAgICAgICogc3RhcnRpbmcgZnJvbSB0aGUgdGFpbCBhbmQgZ29pbmcgdG93YXJkcyB0aGUgaGVhZC5cbiAgICAgICAgICogVGhlIGl0ZXJhdGlvbiB3aWxsIGJyZWFrIGlmIGludGVycnVwdCgpIGlzIGNhbGxlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aXRoaW5cbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgIGVhY2ggbm9kZSBhcyBhbiBhcmdcbiAgICAgICAgICovXG4gICAgICAgIGVhY2hfcmV2ZXJzZTogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0X3JldmVyc2UoKTtcbiAgICAgICAgICAgIHZhciBlbDtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmhhc05leHQoKSAmJiAhdGhpcy5zdG9wSXRlcmF0aW9uRmxhZykge1xuICAgICAgICAgICAgICAgIGVsID0gdGhpcy5uZXh0X3JldmVyc2UoKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0b3BJdGVyYXRpb25GbGFnID0gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLypcbiAgICAgICAgICogIyMjIElOVEVSUlVQVCBJVEVSQVRJT04gIyMjXG4gICAgICAgICAqL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSYWlzZXMgaW50ZXJydXB0IGZsYWcgKHRoYXQgd2lsbCBzdG9wIGVhY2goKSBvciBlYWNoX3JldmVyc2UoKSlcbiAgICAgICAgICovXG5cbiAgICAgICAgaW50ZXJydXB0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BJdGVyYXRpb25GbGFnID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEl0ZXJhdG9yO1xuXG59KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBMaW5rZWQgbGlzdCBub2RlIGNsYXNzXG4gICAgICpcbiAgICAgKiBJbnRlcm5hbCBwcml2YXRlIGNsYXNzIHRvIHJlcHJlc2VudCBhIG5vZGUgd2l0aGluXG4gICAgICogYSBsaW5rZWQgbGlzdC4gIEVhY2ggbm9kZSBoYXMgYSAnZGF0YScgcHJvcGVydHkgYW5kXG4gICAgICogYSBwb2ludGVyIHRoZSBwcmV2aW91cyBub2RlIGFuZCB0aGUgbmV4dCBub2RlIGluIHRoZSBsaXN0LlxuICAgICAqXG4gICAgICogU2luY2UgdGhlICdOb2RlJyBmdW5jdGlvbiBpcyBub3QgYXNzaWduZWQgdG9cbiAgICAgKiBtb2R1bGUuZXhwb3J0cyBpdCBpcyBub3QgdmlzaWJsZSBvdXRzaWRlIG9mIHRoaXNcbiAgICAgKiBmaWxlLCB0aGVyZWZvcmUsIGl0IGlzIHByaXZhdGUgdG8gdGhlIExpbmtlZExpc3RcbiAgICAgKiBjbGFzcy5cbiAgICAgKlxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbm9kZSBvYmplY3Qgd2l0aCBhIGRhdGEgcHJvcGVydHkgYW5kIHBvaW50ZXJcbiAgICAgKiB0byB0aGUgbmV4dCBub2RlXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge29iamVjdHxudW1iZXJ8c3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGluaXRpYWxpemUgd2l0aCB0aGUgbm9kZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIE5vZGUoZGF0YSkge1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICB0aGlzLm5leHQgPSBudWxsO1xuICAgICAgICB0aGlzLnByZXYgPSBudWxsO1xuICAgIH1cblxuICAgIC8qIEZ1bmN0aW9ucyBhdHRhY2hlZCB0byB0aGUgTm9kZSBwcm90b3R5cGUuICBBbGwgbm9kZSBpbnN0YW5jZXMgd2lsbFxuICAgICAqIHNoYXJlIHRoZXNlIG1ldGhvZHMsIG1lYW5pbmcgdGhlcmUgd2lsbCBOT1QgYmUgY29waWVzIG1hZGUgZm9yIGVhY2hcbiAgICAgKiBpbnN0YW5jZS4gIFRoaXMgd2lsbCBiZSBhIGh1Z2UgbWVtb3J5IHNhdmluZ3Mgc2luY2UgdGhlcmUgd2lsbCBsaWtlbHlcbiAgICAgKiBiZSBhIGxhcmdlIG51bWJlciBvZiBpbmRpdmlkdWFsIG5vZGVzLlxuICAgICAqL1xuICAgIE5vZGUucHJvdG90eXBlID0ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBub2RlIGhhcyBhIHBvaW50ZXIgdG8gdGhlIG5leHQgbm9kZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGVyZSBpcyBhIG5leHQgbm9kZTsgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBoYXNOZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMubmV4dCAhPT0gbnVsbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIG5vZGUgaGFzIGEgcG9pbnRlciB0byB0aGUgcHJldmlvdXMgbm9kZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGVyZSBpcyBhIHByZXZpb3VzIG5vZGU7IGZhbHNlIG90aGVyd2lzZVxuICAgICAgICAgKi9cbiAgICAgICAgaGFzUHJldjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnByZXYgIT09IG51bGwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBkYXRhIG9mIHRoZSB0aGUgbm9kZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IHRoZSBkYXRhIG9mIHRoZSBub2RlXG4gICAgICAgICAqL1xuICAgICAgICBnZXREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VuYXRpb24gb2YgdGhlIG5vZGUuICBJZiB0aGUgZGF0YSBpcyBhblxuICAgICAgICAgKiBvYmplY3QsIGl0IHJldHVybnMgdGhlIEpTT04uc3RyaW5naWZ5IHZlcnNpb24gb2YgdGhlIG9iamVjdC5cbiAgICAgICAgICogT3RoZXJ3aXNlLCBpdCBzaW1wbHkgcmV0dXJucyB0aGUgZGF0YVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBzdHJpbmcgcmVwcmVzZW5hdGlvbiBvZiB0aGUgbm9kZSBkYXRhXG4gICAgICAgICAqL1xuICAgICAgICB0b1N0cmluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcodGhpcy5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IE5vZGU7XG5cbn0oKSk7XG4iLCIvKipcbiAqIExvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IEpTIEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcy5mb3VuZGF0aW9uLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb21pc2VUYWcgPSAnW29iamVjdCBQcm9taXNlXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGBcbiAqIFtzeW50YXggY2hhcmFjdGVyc10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcGF0dGVybnMpLlxuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZpbHRlcmAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheUZpbHRlcihhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXNJbmRleCA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBcHBlbmRzIHRoZSBlbGVtZW50cyBvZiBgdmFsdWVzYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gYXBwZW5kLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5UHVzaChhcnJheSwgdmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIG9mZnNldCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W29mZnNldCArIGluZGV4XSA9IHZhbHVlc1tpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5zb21lYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFueSBlbGVtZW50IHBhc3NlcyB0aGUgcHJlZGljYXRlIGNoZWNrLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlTb21lKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgYGNhY2hlYCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gY2FjaGUgVGhlIGNhY2hlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGNhY2hlSGFzKGNhY2hlLCBrZXkpIHtcbiAgcmV0dXJuIGNhY2hlLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgbWFwYCB0byBpdHMga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUga2V5LXZhbHVlIHBhaXJzLlxuICovXG5mdW5jdGlvbiBtYXBUb0FycmF5KG1hcCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG1hcC5zaXplKTtcblxuICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gW2tleSwgdmFsdWVdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkgb2YgaXRzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLFxuICAgIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBTeW1ib2wgPSByb290LlN5bWJvbCxcbiAgICBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5LFxuICAgIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGUsXG4gICAgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2UsXG4gICAgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcbiAgICBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpLFxuICAgIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyksXG4gICAgUHJvbWlzZSA9IGdldE5hdGl2ZShyb290LCAnUHJvbWlzZScpLFxuICAgIFNldCA9IGdldE5hdGl2ZShyb290LCAnU2V0JyksXG4gICAgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpLFxuICAgIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1hcHMsIHNldHMsIGFuZCB3ZWFrbWFwcy4gKi9cbnZhciBkYXRhVmlld0N0b3JTdHJpbmcgPSB0b1NvdXJjZShEYXRhVmlldyksXG4gICAgbWFwQ3RvclN0cmluZyA9IHRvU291cmNlKE1hcCksXG4gICAgcHJvbWlzZUN0b3JTdHJpbmcgPSB0b1NvdXJjZShQcm9taXNlKSxcbiAgICBzZXRDdG9yU3RyaW5nID0gdG9Tb3VyY2UoU2V0KSxcbiAgICB3ZWFrTWFwQ3RvclN0cmluZyA9IHRvU291cmNlKFdlYWtNYXApO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIDogaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICAtLXRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGxpc3QgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgICsrdGhpcy5zaXplO1xuICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGRhdGFbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuc2l6ZSA9IDA7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUdldChrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxuLyoqXG4gKlxuICogQ3JlYXRlcyBhbiBhcnJheSBjYWNoZSBvYmplY3QgdG8gc3RvcmUgdW5pcXVlIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTZXRDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMgPT0gbnVsbCA/IDAgOiB2YWx1ZXMubGVuZ3RoO1xuXG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGU7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdGhpcy5hZGQodmFsdWVzW2luZGV4XSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBZGRzIGB2YWx1ZWAgdG8gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBhZGRcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQGFsaWFzIHB1c2hcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNhY2hlLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlQWRkKHZhbHVlKSB7XG4gIHRoaXMuX19kYXRhX18uc2V0KHZhbHVlLCBIQVNIX1VOREVGSU5FRCk7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGluIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlSGFzKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyh2YWx1ZSk7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTZXRDYWNoZWAuXG5TZXRDYWNoZS5wcm90b3R5cGUuYWRkID0gU2V0Q2FjaGUucHJvdG90eXBlLnB1c2ggPSBzZXRDYWNoZUFkZDtcblNldENhY2hlLnByb3RvdHlwZS5oYXMgPSBzZXRDYWNoZUhhcztcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBzdGFjayB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tHZXQoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmdldChrZXkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFN0YWNrYC5cblN0YWNrLnByb3RvdHlwZS5jbGVhciA9IHN0YWNrQ2xlYXI7XG5TdGFjay5wcm90b3R5cGVbJ2RlbGV0ZSddID0gc3RhY2tEZWxldGU7XG5TdGFjay5wcm90b3R5cGUuZ2V0ID0gc3RhY2tHZXQ7XG5TdGFjay5wcm90b3R5cGUuaGFzID0gc3RhY2tIYXM7XG5TdGFjay5wcm90b3R5cGUuc2V0ID0gc3RhY2tTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNFcXVhbGAgd2hpY2ggc3VwcG9ydHMgcGFydGlhbCBjb21wYXJpc29uc1xuICogYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuXG4gKiAgMSAtIFVub3JkZXJlZCBjb21wYXJpc29uXG4gKiAgMiAtIFBhcnRpYWwgY29tcGFyaXNvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spIHtcbiAgaWYgKHZhbHVlID09PSBvdGhlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IG90aGVyID09IG51bGwgfHwgKCFpc09iamVjdExpa2UodmFsdWUpICYmICFpc09iamVjdExpa2Uob3RoZXIpKSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyO1xuICB9XG4gIHJldHVybiBiYXNlSXNFcXVhbERlZXAodmFsdWUsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBiYXNlSXNFcXVhbCwgc3RhY2spO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgY29tcGFyaXNvbnMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgY29tcGFyZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsRGVlcChvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBvYmpJc0FyciA9IGlzQXJyYXkob2JqZWN0KSxcbiAgICAgIG90aElzQXJyID0gaXNBcnJheShvdGhlciksXG4gICAgICBvYmpUYWcgPSBvYmpJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG9iamVjdCksXG4gICAgICBvdGhUYWcgPSBvdGhJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG90aGVyKTtcblxuICBvYmpUYWcgPSBvYmpUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG9ialRhZztcbiAgb3RoVGFnID0gb3RoVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvdGhUYWc7XG5cbiAgdmFyIG9iaklzT2JqID0gb2JqVGFnID09IG9iamVjdFRhZyxcbiAgICAgIG90aElzT2JqID0gb3RoVGFnID09IG9iamVjdFRhZyxcbiAgICAgIGlzU2FtZVRhZyA9IG9ialRhZyA9PSBvdGhUYWc7XG5cbiAgaWYgKGlzU2FtZVRhZyAmJiBpc0J1ZmZlcihvYmplY3QpKSB7XG4gICAgaWYgKCFpc0J1ZmZlcihvdGhlcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgb2JqSXNBcnIgPSB0cnVlO1xuICAgIG9iaklzT2JqID0gZmFsc2U7XG4gIH1cbiAgaWYgKGlzU2FtZVRhZyAmJiAhb2JqSXNPYmopIHtcbiAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgIHJldHVybiAob2JqSXNBcnIgfHwgaXNUeXBlZEFycmF5KG9iamVjdCkpXG4gICAgICA/IGVxdWFsQXJyYXlzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spXG4gICAgICA6IGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgfVxuICBpZiAoIShiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcpKSB7XG4gICAgdmFyIG9iaklzV3JhcHBlZCA9IG9iaklzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCAnX193cmFwcGVkX18nKSxcbiAgICAgICAgb3RoSXNXcmFwcGVkID0gb3RoSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwgJ19fd3JhcHBlZF9fJyk7XG5cbiAgICBpZiAob2JqSXNXcmFwcGVkIHx8IG90aElzV3JhcHBlZCkge1xuICAgICAgdmFyIG9ialVud3JhcHBlZCA9IG9iaklzV3JhcHBlZCA/IG9iamVjdC52YWx1ZSgpIDogb2JqZWN0LFxuICAgICAgICAgIG90aFVud3JhcHBlZCA9IG90aElzV3JhcHBlZCA/IG90aGVyLnZhbHVlKCkgOiBvdGhlcjtcblxuICAgICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICAgIHJldHVybiBlcXVhbEZ1bmMob2JqVW53cmFwcGVkLCBvdGhVbndyYXBwZWQsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFpc1NhbWVUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgcmV0dXJuIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBhcnJheXMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7QXJyYXl9IG90aGVyIFRoZSBvdGhlciBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgYXJyYXlgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFycmF5cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEFycmF5cyhhcnJheSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRyxcbiAgICAgIGFyckxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIG90aExlbmd0aCA9IG90aGVyLmxlbmd0aDtcblxuICBpZiAoYXJyTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhKGlzUGFydGlhbCAmJiBvdGhMZW5ndGggPiBhcnJMZW5ndGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQoYXJyYXkpO1xuICBpZiAoc3RhY2tlZCAmJiBzdGFjay5nZXQob3RoZXIpKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gIH1cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSB0cnVlLFxuICAgICAgc2VlbiA9IChiaXRtYXNrICYgQ09NUEFSRV9VTk9SREVSRURfRkxBRykgPyBuZXcgU2V0Q2FjaGUgOiB1bmRlZmluZWQ7XG5cbiAgc3RhY2suc2V0KGFycmF5LCBvdGhlcik7XG4gIHN0YWNrLnNldChvdGhlciwgYXJyYXkpO1xuXG4gIC8vIElnbm9yZSBub24taW5kZXggcHJvcGVydGllcy5cbiAgd2hpbGUgKCsraW5kZXggPCBhcnJMZW5ndGgpIHtcbiAgICB2YXIgYXJyVmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJbaW5kZXhdO1xuXG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHZhciBjb21wYXJlZCA9IGlzUGFydGlhbFxuICAgICAgICA/IGN1c3RvbWl6ZXIob3RoVmFsdWUsIGFyclZhbHVlLCBpbmRleCwgb3RoZXIsIGFycmF5LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKGFyclZhbHVlLCBvdGhWYWx1ZSwgaW5kZXgsIGFycmF5LCBvdGhlciwgc3RhY2spO1xuICAgIH1cbiAgICBpZiAoY29tcGFyZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGNvbXBhcmVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBpZiAoc2Vlbikge1xuICAgICAgaWYgKCFhcnJheVNvbWUob3RoZXIsIGZ1bmN0aW9uKG90aFZhbHVlLCBvdGhJbmRleCkge1xuICAgICAgICAgICAgaWYgKCFjYWNoZUhhcyhzZWVuLCBvdGhJbmRleCkgJiZcbiAgICAgICAgICAgICAgICAoYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlZW4ucHVzaChvdGhJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIShcbiAgICAgICAgICBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHxcbiAgICAgICAgICAgIGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKVxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10oYXJyYXkpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgY29tcGFyaW5nIG9iamVjdHMgb2ZcbiAqIHRoZSBzYW1lIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjb21wYXJpbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdHMgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIHRhZywgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgZGF0YVZpZXdUYWc6XG4gICAgICBpZiAoKG9iamVjdC5ieXRlTGVuZ3RoICE9IG90aGVyLmJ5dGVMZW5ndGgpIHx8XG4gICAgICAgICAgKG9iamVjdC5ieXRlT2Zmc2V0ICE9IG90aGVyLmJ5dGVPZmZzZXQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIG9iamVjdCA9IG9iamVjdC5idWZmZXI7XG4gICAgICBvdGhlciA9IG90aGVyLmJ1ZmZlcjtcblxuICAgIGNhc2UgYXJyYXlCdWZmZXJUYWc6XG4gICAgICBpZiAoKG9iamVjdC5ieXRlTGVuZ3RoICE9IG90aGVyLmJ5dGVMZW5ndGgpIHx8XG4gICAgICAgICAgIWVxdWFsRnVuYyhuZXcgVWludDhBcnJheShvYmplY3QpLCBuZXcgVWludDhBcnJheShvdGhlcikpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICAgIC8vIENvZXJjZSBib29sZWFucyB0byBgMWAgb3IgYDBgIGFuZCBkYXRlcyB0byBtaWxsaXNlY29uZHMuXG4gICAgICAvLyBJbnZhbGlkIGRhdGVzIGFyZSBjb2VyY2VkIHRvIGBOYU5gLlxuICAgICAgcmV0dXJuIGVxKCtvYmplY3QsICtvdGhlcik7XG5cbiAgICBjYXNlIGVycm9yVGFnOlxuICAgICAgcmV0dXJuIG9iamVjdC5uYW1lID09IG90aGVyLm5hbWUgJiYgb2JqZWN0Lm1lc3NhZ2UgPT0gb3RoZXIubWVzc2FnZTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgLy8gQ29lcmNlIHJlZ2V4ZXMgdG8gc3RyaW5ncyBhbmQgdHJlYXQgc3RyaW5ncywgcHJpbWl0aXZlcyBhbmQgb2JqZWN0cyxcbiAgICAgIC8vIGFzIGVxdWFsLiBTZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXJlZ2V4cC5wcm90b3R5cGUudG9zdHJpbmdcbiAgICAgIC8vIGZvciBtb3JlIGRldGFpbHMuXG4gICAgICByZXR1cm4gb2JqZWN0ID09IChvdGhlciArICcnKTtcblxuICAgIGNhc2UgbWFwVGFnOlxuICAgICAgdmFyIGNvbnZlcnQgPSBtYXBUb0FycmF5O1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHO1xuICAgICAgY29udmVydCB8fCAoY29udmVydCA9IHNldFRvQXJyYXkpO1xuXG4gICAgICBpZiAob2JqZWN0LnNpemUgIT0gb3RoZXIuc2l6ZSAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgICAgIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KG9iamVjdCk7XG4gICAgICBpZiAoc3RhY2tlZCkge1xuICAgICAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgICAgIH1cbiAgICAgIGJpdG1hc2sgfD0gQ09NUEFSRV9VTk9SREVSRURfRkxBRztcblxuICAgICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gICAgICB2YXIgcmVzdWx0ID0gZXF1YWxBcnJheXMoY29udmVydChvYmplY3QpLCBjb252ZXJ0KG90aGVyKSwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG4gICAgICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIGlmIChzeW1ib2xWYWx1ZU9mKSB7XG4gICAgICAgIHJldHVybiBzeW1ib2xWYWx1ZU9mLmNhbGwob2JqZWN0KSA9PSBzeW1ib2xWYWx1ZU9mLmNhbGwob3RoZXIpO1xuICAgICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIG9iamVjdHMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRyxcbiAgICAgIG9ialByb3BzID0gZ2V0QWxsS2V5cyhvYmplY3QpLFxuICAgICAgb2JqTGVuZ3RoID0gb2JqUHJvcHMubGVuZ3RoLFxuICAgICAgb3RoUHJvcHMgPSBnZXRBbGxLZXlzKG90aGVyKSxcbiAgICAgIG90aExlbmd0aCA9IG90aFByb3BzLmxlbmd0aDtcblxuICBpZiAob2JqTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBpbmRleCA9IG9iakxlbmd0aDtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIGlmICghKGlzUGFydGlhbCA/IGtleSBpbiBvdGhlciA6IGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsIGtleSkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciByZXN1bHQgPSB0cnVlO1xuICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gIHN0YWNrLnNldChvdGhlciwgb2JqZWN0KTtcblxuICB2YXIgc2tpcEN0b3IgPSBpc1BhcnRpYWw7XG4gIHdoaWxlICgrK2luZGV4IDwgb2JqTGVuZ3RoKSB7XG4gICAga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2tleV07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgb2JqVmFsdWUsIGtleSwgb3RoZXIsIG9iamVjdCwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihvYmpWYWx1ZSwgb3RoVmFsdWUsIGtleSwgb2JqZWN0LCBvdGhlciwgc3RhY2spO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBpZiAoIShjb21wYXJlZCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyAob2JqVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhvYmpWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSlcbiAgICAgICAgICA6IGNvbXBhcmVkXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHNraXBDdG9yIHx8IChza2lwQ3RvciA9IGtleSA9PSAnY29uc3RydWN0b3InKTtcbiAgfVxuICBpZiAocmVzdWx0ICYmICFza2lwQ3Rvcikge1xuICAgIHZhciBvYmpDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgICBvdGhDdG9yID0gb3RoZXIuY29uc3RydWN0b3I7XG5cbiAgICAvLyBOb24gYE9iamVjdGAgb2JqZWN0IGluc3RhbmNlcyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVhbC5cbiAgICBpZiAob2JqQ3RvciAhPSBvdGhDdG9yICYmXG4gICAgICAgICgnY29uc3RydWN0b3InIGluIG9iamVjdCAmJiAnY29uc3RydWN0b3InIGluIG90aGVyKSAmJlxuICAgICAgICAhKHR5cGVvZiBvYmpDdG9yID09ICdmdW5jdGlvbicgJiYgb2JqQ3RvciBpbnN0YW5jZW9mIG9iakN0b3IgJiZcbiAgICAgICAgICB0eXBlb2Ygb3RoQ3RvciA9PSAnZnVuY3Rpb24nICYmIG90aEN0b3IgaW5zdGFuY2VvZiBvdGhDdG9yKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXMob2JqZWN0KSB7XG4gIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXMsIGdldFN5bWJvbHMpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGFycmF5RmlsdGVyKG5hdGl2ZUdldFN5bWJvbHMob2JqZWN0KSwgZnVuY3Rpb24oc3ltYm9sKSB7XG4gICAgcmV0dXJuIHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBzeW1ib2wpO1xuICB9KTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbnZhciBnZXRUYWcgPSBiYXNlR2V0VGFnO1xuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcyA8IDYuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBiYXNlR2V0VGFnKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6ICcnO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIGRlZXAgY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlXG4gKiBlcXVpdmFsZW50LlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBzdXBwb3J0cyBjb21wYXJpbmcgYXJyYXlzLCBhcnJheSBidWZmZXJzLCBib29sZWFucyxcbiAqIGRhdGUgb2JqZWN0cywgZXJyb3Igb2JqZWN0cywgbWFwcywgbnVtYmVycywgYE9iamVjdGAgb2JqZWN0cywgcmVnZXhlcyxcbiAqIHNldHMsIHN0cmluZ3MsIHN5bWJvbHMsIGFuZCB0eXBlZCBhcnJheXMuIGBPYmplY3RgIG9iamVjdHMgYXJlIGNvbXBhcmVkXG4gKiBieSB0aGVpciBvd24sIG5vdCBpbmhlcml0ZWQsIGVudW1lcmFibGUgcHJvcGVydGllcy4gRnVuY3Rpb25zIGFuZCBET01cbiAqIG5vZGVzIGFyZSBjb21wYXJlZCBieSBzdHJpY3QgZXF1YWxpdHksIGkuZS4gYD09PWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uaXNFcXVhbChvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBvYmplY3QgPT09IG90aGVyO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFcXVhbCh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYSBuZXcgZW1wdHkgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBlbXB0eSBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5cyA9IF8udGltZXMoMiwgXy5zdHViQXJyYXkpO1xuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5cyk7XG4gKiAvLyA9PiBbW10sIFtdXVxuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5c1swXSA9PT0gYXJyYXlzWzFdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN0dWJBcnJheSgpIHtcbiAgcmV0dXJuIFtdO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFcXVhbDtcbiIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSl7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKmlzdGFuYnVsIGlnbm9yZSBuZXh0OmNhbnQgdGVzdCovXG4gIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgcm9vdC5vYmplY3RQYXRoID0gZmFjdG9yeSgpO1xuICB9XG59KSh0aGlzLCBmdW5jdGlvbigpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyXG4gICAgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgIF9oYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbiAgZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSl7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICghaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChfaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvU3RyaW5nKHR5cGUpe1xuICAgIHJldHVybiB0b1N0ci5jYWxsKHR5cGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpe1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8IHRvU3RyaW5nKHZhbHVlKSA9PT0gXCJbb2JqZWN0IE51bWJlcl1cIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU3RyaW5nKG9iail7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdzdHJpbmcnIHx8IHRvU3RyaW5nKG9iaikgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XG4gIH1cblxuICBmdW5jdGlvbiBpc09iamVjdChvYmope1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiB0b1N0cmluZyhvYmopID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNBcnJheShvYmope1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb2JqLmxlbmd0aCA9PT0gJ251bWJlcicgJiYgdG9TdHJpbmcob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQm9vbGVhbihvYmope1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnYm9vbGVhbicgfHwgdG9TdHJpbmcob2JqKSA9PT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0S2V5KGtleSl7XG4gICAgdmFyIGludEtleSA9IHBhcnNlSW50KGtleSk7XG4gICAgaWYgKGludEtleS50b1N0cmluZygpID09PSBrZXkpIHtcbiAgICAgIHJldHVybiBpbnRLZXk7XG4gICAgfVxuICAgIHJldHVybiBrZXk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXQob2JqLCBwYXRoLCB2YWx1ZSwgZG9Ob3RSZXBsYWNlKXtcbiAgICBpZiAoaXNOdW1iZXIocGF0aCkpIHtcbiAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgfVxuICAgIGlmIChpc0VtcHR5KHBhdGgpKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAoaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgIHJldHVybiBzZXQob2JqLCBwYXRoLnNwbGl0KCcuJykubWFwKGdldEtleSksIHZhbHVlLCBkb05vdFJlcGxhY2UpO1xuICAgIH1cbiAgICB2YXIgY3VycmVudFBhdGggPSBwYXRoWzBdO1xuXG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgb2xkVmFsID0gb2JqW2N1cnJlbnRQYXRoXTtcbiAgICAgIGlmIChvbGRWYWwgPT09IHZvaWQgMCB8fCAhZG9Ob3RSZXBsYWNlKSB7XG4gICAgICAgIG9ialtjdXJyZW50UGF0aF0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvbGRWYWw7XG4gICAgfVxuXG4gICAgaWYgKG9ialtjdXJyZW50UGF0aF0gPT09IHZvaWQgMCkge1xuICAgICAgLy9jaGVjayBpZiB3ZSBhc3N1bWUgYW4gYXJyYXlcbiAgICAgIGlmKGlzTnVtYmVyKHBhdGhbMV0pKSB7XG4gICAgICAgIG9ialtjdXJyZW50UGF0aF0gPSBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialtjdXJyZW50UGF0aF0gPSB7fTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2V0KG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSksIHZhbHVlLCBkb05vdFJlcGxhY2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVsKG9iaiwgcGF0aCkge1xuICAgIGlmIChpc051bWJlcihwYXRoKSkge1xuICAgICAgcGF0aCA9IFtwYXRoXTtcbiAgICB9XG5cbiAgICBpZiAoaXNFbXB0eShvYmopKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cblxuICAgIGlmIChpc0VtcHR5KHBhdGgpKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZihpc1N0cmluZyhwYXRoKSkge1xuICAgICAgcmV0dXJuIGRlbChvYmosIHBhdGguc3BsaXQoJy4nKSk7XG4gICAgfVxuXG4gICAgdmFyIGN1cnJlbnRQYXRoID0gZ2V0S2V5KHBhdGhbMF0pO1xuICAgIHZhciBvbGRWYWwgPSBvYmpbY3VycmVudFBhdGhdO1xuXG4gICAgaWYocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmIChvbGRWYWwgIT09IHZvaWQgMCkge1xuICAgICAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgb2JqLnNwbGljZShjdXJyZW50UGF0aCwgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIG9ialtjdXJyZW50UGF0aF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG9ialtjdXJyZW50UGF0aF0gIT09IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gZGVsKG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgb2JqZWN0UGF0aCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3RQYXRoKS5yZWR1Y2UoZnVuY3Rpb24ocHJveHksIHByb3ApIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqZWN0UGF0aFtwcm9wXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwcm94eVtwcm9wXSA9IG9iamVjdFBhdGhbcHJvcF0uYmluZChvYmplY3RQYXRoLCBvYmopO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfSwge30pO1xuICB9O1xuXG4gIG9iamVjdFBhdGguaGFzID0gZnVuY3Rpb24gKG9iaiwgcGF0aCkge1xuICAgIGlmIChpc0VtcHR5KG9iaikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaXNOdW1iZXIocGF0aCkpIHtcbiAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgfSBlbHNlIGlmIChpc1N0cmluZyhwYXRoKSkge1xuICAgICAgcGF0aCA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICB9XG5cbiAgICBpZiAoaXNFbXB0eShwYXRoKSB8fCBwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGogPSBwYXRoW2ldO1xuICAgICAgaWYgKChpc09iamVjdChvYmopIHx8IGlzQXJyYXkob2JqKSkgJiYgX2hhc093blByb3BlcnR5LmNhbGwob2JqLCBqKSkge1xuICAgICAgICBvYmogPSBvYmpbal07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgb2JqZWN0UGF0aC5lbnN1cmVFeGlzdHMgPSBmdW5jdGlvbiAob2JqLCBwYXRoLCB2YWx1ZSl7XG4gICAgcmV0dXJuIHNldChvYmosIHBhdGgsIHZhbHVlLCB0cnVlKTtcbiAgfTtcblxuICBvYmplY3RQYXRoLnNldCA9IGZ1bmN0aW9uIChvYmosIHBhdGgsIHZhbHVlLCBkb05vdFJlcGxhY2Upe1xuICAgIHJldHVybiBzZXQob2JqLCBwYXRoLCB2YWx1ZSwgZG9Ob3RSZXBsYWNlKTtcbiAgfTtcblxuICBvYmplY3RQYXRoLmluc2VydCA9IGZ1bmN0aW9uIChvYmosIHBhdGgsIHZhbHVlLCBhdCl7XG4gICAgdmFyIGFyciA9IG9iamVjdFBhdGguZ2V0KG9iaiwgcGF0aCk7XG4gICAgYXQgPSB+fmF0O1xuICAgIGlmICghaXNBcnJheShhcnIpKSB7XG4gICAgICBhcnIgPSBbXTtcbiAgICAgIG9iamVjdFBhdGguc2V0KG9iaiwgcGF0aCwgYXJyKTtcbiAgICB9XG4gICAgYXJyLnNwbGljZShhdCwgMCwgdmFsdWUpO1xuICB9O1xuXG4gIG9iamVjdFBhdGguZW1wdHkgPSBmdW5jdGlvbihvYmosIHBhdGgpIHtcbiAgICBpZiAoaXNFbXB0eShwYXRoKSkge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKGlzRW1wdHkob2JqKSkge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUsIGk7XG4gICAgaWYgKCEodmFsdWUgPSBvYmplY3RQYXRoLmdldChvYmosIHBhdGgpKSkge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICByZXR1cm4gb2JqZWN0UGF0aC5zZXQob2JqLCBwYXRoLCAnJyk7XG4gICAgfSBlbHNlIGlmIChpc0Jvb2xlYW4odmFsdWUpKSB7XG4gICAgICByZXR1cm4gb2JqZWN0UGF0aC5zZXQob2JqLCBwYXRoLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmIChpc051bWJlcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBvYmplY3RQYXRoLnNldChvYmosIHBhdGgsIDApO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHZhbHVlLmxlbmd0aCA9IDA7XG4gICAgfSBlbHNlIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgIGZvciAoaSBpbiB2YWx1ZSkge1xuICAgICAgICBpZiAoX2hhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGkpKSB7XG4gICAgICAgICAgZGVsZXRlIHZhbHVlW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvYmplY3RQYXRoLnNldChvYmosIHBhdGgsIG51bGwpO1xuICAgIH1cbiAgfTtcblxuICBvYmplY3RQYXRoLnB1c2ggPSBmdW5jdGlvbiAob2JqLCBwYXRoIC8qLCB2YWx1ZXMgKi8pe1xuICAgIHZhciBhcnIgPSBvYmplY3RQYXRoLmdldChvYmosIHBhdGgpO1xuICAgIGlmICghaXNBcnJheShhcnIpKSB7XG4gICAgICBhcnIgPSBbXTtcbiAgICAgIG9iamVjdFBhdGguc2V0KG9iaiwgcGF0aCwgYXJyKTtcbiAgICB9XG5cbiAgICBhcnIucHVzaC5hcHBseShhcnIsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikpO1xuICB9O1xuXG4gIG9iamVjdFBhdGguY29hbGVzY2UgPSBmdW5jdGlvbiAob2JqLCBwYXRocywgZGVmYXVsdFZhbHVlKSB7XG4gICAgdmFyIHZhbHVlO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhdGhzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoKHZhbHVlID0gb2JqZWN0UGF0aC5nZXQob2JqLCBwYXRoc1tpXSkpICE9PSB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gIH07XG5cbiAgb2JqZWN0UGF0aC5nZXQgPSBmdW5jdGlvbiAob2JqLCBwYXRoLCBkZWZhdWx0VmFsdWUpe1xuICAgIGlmIChpc051bWJlcihwYXRoKSkge1xuICAgICAgcGF0aCA9IFtwYXRoXTtcbiAgICB9XG4gICAgaWYgKGlzRW1wdHkocGF0aCkpIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmIChpc0VtcHR5KG9iaikpIHtcbiAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICAgIGlmIChpc1N0cmluZyhwYXRoKSkge1xuICAgICAgcmV0dXJuIG9iamVjdFBhdGguZ2V0KG9iaiwgcGF0aC5zcGxpdCgnLicpLCBkZWZhdWx0VmFsdWUpO1xuICAgIH1cblxuICAgIHZhciBjdXJyZW50UGF0aCA9IGdldEtleShwYXRoWzBdKTtcblxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKG9ialtjdXJyZW50UGF0aF0gPT09IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9ialtjdXJyZW50UGF0aF07XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iamVjdFBhdGguZ2V0KG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSksIGRlZmF1bHRWYWx1ZSk7XG4gIH07XG5cbiAgb2JqZWN0UGF0aC5kZWwgPSBmdW5jdGlvbihvYmosIHBhdGgpIHtcbiAgICByZXR1cm4gZGVsKG9iaiwgcGF0aCk7XG4gIH07XG5cbiAgcmV0dXJuIG9iamVjdFBhdGg7XG59KTtcbiIsIi8vIHV0aWxpdGllc1xyXG52YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcblxyXG5mdW5jdGlvbiBFbWl0dGVyRW50aXR5KGVtaXR0ZXJOYW1lLCBlbWl0dGVyVGhlbWUsIHBhcnRpY2xlT3B0cywgZW1pdEZuKSB7XHJcblxyXG4gICAgdGhpcy5uYW1lID0gZW1pdHRlck5hbWU7XHJcblxyXG4gICAgLy8gZW1pdHRlciBlbnRpdHkgY29uZmlnXHJcbiAgICB0aGlzLmVtaXR0ZXJPcHRzID0gZW1pdHRlclRoZW1lO1xyXG4gICAgLy8gZW1pdHRlciBlbWlzc2lvbiBjb25maWdcclxuICAgIHRoaXMuZW1pc3Npb25PcHRzID0gdGhpcy5lbWl0dGVyT3B0cy5lbWlzc2lvbjtcclxuICAgIC8vIGVtaXR0ZXIgcGFydGljbGUgY29uZmlnXHJcbiAgICB0aGlzLnBhcnRpY2xlT3B0cyA9IHBhcnRpY2xlT3B0cztcclxuXHJcbiAgICAvLyBzYXZlcyBkcmlsbGluZyBkb3duXHJcbiAgICB2YXIgZW1pdHRlciA9IHRoaXMuZW1pdHRlck9wdHMuZW1pdHRlcjtcclxuICAgIHZhciBlbWlzc2lvbiA9IHRoaXMuZW1pc3Npb25PcHRzO1xyXG4gICAgdmFyIGVtaXRSYXRlID0gZW1pc3Npb24ucmF0ZTtcclxuICAgIHZhciBlbWl0UmVwZWF0ID0gZW1pc3Npb24ucmVwZWF0ZXI7XHJcblxyXG4gICAgLy8gZW1pdHRlciBtYXN0ZXIgY2xvY2sgaW5pdFxyXG4gICAgdGhpcy5sb2NhbENsb2NrID0gMDtcclxuICAgIHRoaXMubG9jYWxDbG9ja1J1bm5pbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuZW1pdEZuID0gZW1pdEZuO1xyXG4gICAgLy8gZW1pdHRlciBsaWZlXHJcbiAgICB0aGlzLmFjdGl2ZSA9IGVtaXR0ZXIuYWN0aXZlO1xyXG5cclxuICAgIC8vIGVtaXR0ZXIgdmVjdG9yc1xyXG4gICAgdGhpcy54ID0gZW1pdHRlci54O1xyXG4gICAgdGhpcy55ID0gZW1pdHRlci55O1xyXG4gICAgdGhpcy54VmVsID0gZW1pdHRlci54VmVsO1xyXG4gICAgdGhpcy55VmVsID0gZW1pdHRlci55VmVsO1xyXG5cclxuICAgIC8vIGVtaXR0ZXIgZW52aXJvbm1lbnRhbCBpbmZsdWVuY2VzXHJcbiAgICB0aGlzLmFwcGx5R2xvYmFsRm9yY2VzID0gZW1pdHRlci5hcHBseUdsb2JhbEZvcmNlcztcclxuXHJcbiAgICAvLyBlbWl0dGVyIGVtaXNzaW9uIGNvbmZpZ1xyXG4gICAgLy8gZW1pc3Npb24gcmF0ZVxyXG4gICAgdGhpcy5yYXRlTWluID0gZW1pdFJhdGUubWluO1xyXG4gICAgdGhpcy5yYXRlTWF4ID0gZW1pdFJhdGUubWF4O1xyXG4gICAgdGhpcy5yYXRlRGVjYXkgPSBlbWl0UmF0ZS5kZWNheS5yYXRlO1xyXG4gICAgdGhpcy5yYXRlRGVjYXlNYXggPSBlbWl0UmF0ZS5kZWNheS5kZWNheU1heDtcclxuXHJcbiAgICAvLyBlbWlzc2lvbiByZXBldGl0aW9uXHJcbiAgICB0aGlzLnJlcGVhdFJhdGUgPSBlbWl0UmVwZWF0LnJhdGU7XHJcbiAgICB0aGlzLnJlcGVhdERlY2F5ID0gZW1pdFJlcGVhdC5kZWNheS5yYXRlO1xyXG4gICAgdGhpcy5yZXBlYXREZWNheU1heCA9IGVtaXRSZXBlYXQuZGVjYXkuZGVjYXlNYXg7XHJcbiAgICB0aGlzLnRyaWdnZXJUeXBlID0gJ21vdXNlQ2xpY2tFdmVudCc7XHJcblxyXG4gICAgdGhpcy5pbml0VmFsdWVzID0ge1xyXG4gICAgICAgIHJhdGVNaW46IGVtaXRSYXRlLm1pbixcclxuICAgICAgICByYXRlTWF4OiBlbWl0UmF0ZS5tYXgsXHJcbiAgICAgICAgcmF0ZURlY2F5OiBlbWl0UmF0ZS5kZWNheS5yYXRlLFxyXG4gICAgICAgIHJhdGVEZWNheU1heDogZW1pdFJhdGUuZGVjYXkuZGVjYXlNYXgsXHJcbiAgICAgICAgcmVwZWF0UmF0ZTogZW1pdFJlcGVhdC5yYXRlLFxyXG4gICAgICAgIHJlcGVhdERlY2F5OiBlbWl0UmVwZWF0LmRlY2F5LnJhdGUsXHJcbiAgICAgICAgcmVwZWF0RGVjYXlNYXg6IGVtaXRSZXBlYXQuZGVjYXkuZGVjYXlNYXhcclxuICAgIH07XHJcbn1cclxuXHJcbkVtaXR0ZXJFbnRpdHkucHJvdG90eXBlLnJlc2V0RW1pc3Npb25WYWx1ZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgc2VsZi5yYXRlTWluID0gc2VsZi5pbml0VmFsdWVzLnJhdGVNaW47XHJcbiAgICBzZWxmLnJhdGVNYXggPSBzZWxmLmluaXRWYWx1ZXMucmF0ZU1heDtcclxuICAgIHNlbGYucmF0ZURlY2F5ID0gc2VsZi5pbml0VmFsdWVzLnJhdGVEZWNheTtcclxuICAgIHNlbGYucmF0ZURlY2F5TWF4ID0gc2VsZi5pbml0VmFsdWVzLnJhdGVEZWNheU1heDtcclxuICAgIHNlbGYucmVwZWF0UmF0ZSA9IHNlbGYuaW5pdFZhbHVlcy5yZXBlYXRSYXRlO1xyXG4gICAgc2VsZi5yZXBlYXREZWNheSA9IHNlbGYuaW5pdFZhbHVlcy5yZXBlYXREZWNheTtcclxuICAgIHNlbGYucmVwZWF0RGVjYXlNYXggPSBzZWxmLmluaXRWYWx1ZXMucmVwZWF0RGVjYXlNYXg7XHJcbn07XHJcblxyXG5FbWl0dGVyRW50aXR5LnByb3RvdHlwZS51cGRhdGVFbWl0dGVyID0gZnVuY3Rpb24gKHVwZGF0ZU9wdHMpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB2YXIgdXBkYXRlcyA9IHVwZGF0ZU9wdHMgfHwgZmFsc2U7XHJcbiAgICB2YXIgdHJpZ2dlckVtaXR0ZXJGbGFnID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKHVwZGF0ZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgc2VsZi54ID0gdXBkYXRlcy54O1xyXG4gICAgICAgIHNlbGYueSA9IHVwZGF0ZXMueTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLnggKz0gc2VsZi54VmVsO1xyXG4gICAgc2VsZi55ICs9IHNlbGYueVZlbDtcclxuXHJcbiAgICBpZiAoc2VsZi5hY3RpdmUgPT09IDEpIHtcclxuXHJcbiAgICAgICAgaWYgKHNlbGYucmVwZWF0UmF0ZSA+IDAgJiYgc2VsZi5sb2NhbENsb2NrUnVubmluZyA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlbGYubG9jYWxDbG9jayAlIHNlbGYucmVwZWF0UmF0ZSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlckVtaXR0ZXJGbGFnID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5yZXBlYXREZWNheSA8IHNlbGYucmVwZWF0RGVjYXlNYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlcGVhdFJhdGUgKz0gc2VsZi5yZXBlYXREZWNheTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvY2FsQ2xvY2sgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9jYWxDbG9ja1J1bm5pbmcgPT09IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYucmF0ZURlY2F5ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmF0ZU1pbiA+IHNlbGYucmF0ZURlY2F5TWF4ID8gc2VsZi5yYXRlTWluIC09IHNlbGYucmF0ZURlY2F5IDogc2VsZi5yYXRlTWluID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnJhdGVNYXggPiBzZWxmLnJhdGVEZWNheU1heCA/IHNlbGYucmF0ZU1heCAtPSBzZWxmLnJhdGVEZWNheSA6IHNlbGYucmF0ZU1heCA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyRW1pdHRlckZsYWcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi5sb2NhbENsb2NrKys7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRyaWdnZXJFbWl0dGVyRmxhZyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHNlbGYudHJpZ2dlckVtaXR0ZXIoeyB4OiBzZWxmLngsIHk6IHNlbGYueSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbkVtaXR0ZXJFbnRpdHkucHJvdG90eXBlLnRyaWdnZXJFbWl0dGVyID0gZnVuY3Rpb24gKHRyaWdnZXJPcHRpb25zKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdmFyIHRoaXNYLCB0aGlzWTtcclxuICAgIHZhciB0cmlnZ2VyT3B0cyA9IHRyaWdnZXJPcHRpb25zIHx8IGZhbHNlO1xyXG4gICAgaWYgKHRyaWdnZXJPcHRzICE9PSBmYWxzZSkge1xyXG4gICAgICAgIHRoaXNYID0gdHJpZ2dlck9wdHMueDtcclxuICAgICAgICB0aGlzWSA9IHRyaWdnZXJPcHRzLnk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXNYID0gc2VsZi54O1xyXG4gICAgICAgIHRoaXNZID0gc2VsZi55O1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYueCA9IHRoaXNYO1xyXG4gICAgc2VsZi55ID0gdGhpc1k7XHJcblxyXG4gICAgc2VsZi5hY3RpdmUgPSB0cnVlO1xyXG4gICAgc2VsZi5sb2NhbENsb2NrUnVubmluZyA9IHRydWU7XHJcblxyXG4gICAgdmFyIGVtaXRBbW91bnQgPSBtYXRoVXRpbHMucmFuZG9tSW50ZWdlcihzZWxmLnJhdGVNaW4sIHNlbGYucmF0ZU1heCk7XHJcblxyXG4gICAgc2VsZi5lbWl0Rm4odGhpc1gsIHRoaXNZLCBlbWl0QW1vdW50LCBzZWxmLmVtaXNzaW9uT3B0cywgc2VsZi5wYXJ0aWNsZU9wdHMpO1xyXG5cclxuICAgIGlmIChzZWxmLnJlcGVhdFJhdGUgPiAwKSB7XHJcbiAgICAgICAgc2VsZi5hY3RpdmUgPSAxO1xyXG5cclxuICAgICAgICAvLyBzZWxmLnVwZGF0ZUVtaXR0ZXIoIHsgeDogdGhpc1gsIHk6IHRoaXNZIH0gKTtcclxuICAgIH1cclxufTtcclxuXHJcbkVtaXR0ZXJFbnRpdHkucHJvdG90eXBlLnJlbmRlckVtaXR0ZXIgPSBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICdyZ2IoIDI1NSwgMjU1LCAyNTUgKSc7XHJcbiAgICBjb250ZXh0LnN0cm9rZVdpZHRoID0gNTtcclxuICAgIGNvbnRleHQubGluZSh0aGlzLngsIHRoaXMueSAtIDE1LCB0aGlzLngsIHRoaXMueSArIDE1LCBjb250ZXh0KTtcclxuICAgIGNvbnRleHQubGluZSh0aGlzLnggLSAxNSwgdGhpcy55LCB0aGlzLnggKyAxNSwgdGhpcy55LCBjb250ZXh0KTtcclxuICAgIGNvbnRleHQuc3Ryb2tlQ2lyY2xlKHRoaXMueCwgdGhpcy55LCAxMCwgY29udGV4dCk7XHJcbn07XHJcblxyXG5FbWl0dGVyRW50aXR5LnByb3RvdHlwZS5raWxsRW1pdHRlciA9IGZ1bmN0aW9uICgpIHt9O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuRW1pdHRlckVudGl0eSA9IEVtaXR0ZXJFbnRpdHk7IiwidmFyIGFuaW1hdGlvbiA9IHtcclxuICAgIHN0YXRlOiBmYWxzZSxcclxuICAgIGNvdW50ZXI6IDAsXHJcbiAgICBkdXJhdGlvbjogMjQwXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5hbmltYXRpb24gPSBhbmltYXRpb247IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGV4dGVuZHMgQ2FudmFzIHByb3RvdHlwZSB3aXRoIHVzZWZ1bCBkcmF3aW5nIG1peGluc1xyXG4qIEBraW5kIGNvbnN0YW50XHJcbiovXHJcbnZhciBjYW52YXNEcmF3aW5nQXBpID0gQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIGRyYXcgY2lyY2xlIEFQSVxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gb3JpZ2luIFggb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb3JpZ2luIFkgb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSByIC0gcmFkaXVzIG9mIGNpcmNsZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5jaXJjbGUgPSBmdW5jdGlvbiAoeCwgeSwgciwgY29udGV4dCkge1xyXG5cdGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcblx0Y29udGV4dC5hcmMoeCwgeSwgciwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgZmlsbGVkIGNpcmNsZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gb3JpZ2luIFggb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb3JpZ2luIFkgb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSByIC0gcmFkaXVzIG9mIGNpcmNsZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5maWxsQ2lyY2xlID0gZnVuY3Rpb24gKHgsIHksIHIsIGNvbnRleHQpIHtcclxuXHRjb250ZXh0LmNpcmNsZSh4LCB5LCByLCBjb250ZXh0KTtcclxuXHRjb250ZXh0LmZpbGwoKTtcclxuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgc3Ryb2tlZCBjaXJjbGVcclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIG9yaWdpbiBZIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0gciAtIHJhZGl1cyBvZiBjaXJjbGUuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuc3Ryb2tlQ2lyY2xlID0gZnVuY3Rpb24gKHgsIHksIHIsIGNvbnRleHQpIHtcclxuXHRjb250ZXh0LmNpcmNsZSh4LCB5LCByLCBjb250ZXh0KTtcclxuXHRjb250ZXh0LnN0cm9rZSgpO1xyXG5cdGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gb3JpZ2luIFggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIG9maWdpbiBZIG9yIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHcgLSB3aWR0aCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB3IC0gaGVpZ2h0IG9mIGVsbGlwc2UuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuZWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCB3LCBoLCBjb250ZXh0KSB7XHJcblx0Y29udGV4dC5iZWdpblBhdGgoKTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IE1hdGguUEkgKiAyOyBpICs9IE1hdGguUEkgLyAxNikge1xyXG5cdFx0Y29udGV4dC5saW5lVG8oeCArIE1hdGguY29zKGkpICogdyAvIDIsIHkgKyBNYXRoLnNpbihpKSAqIGggLyAyKTtcclxuXHR9XHJcblx0Y29udGV4dC5jbG9zZVBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IGZpbGxlZCBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gb3JpZ2luIFggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIG9maWdpbiBZIG9yIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHcgLSB3aWR0aCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB3IC0gaGVpZ2h0IG9mIGVsbGlwc2UuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuZmlsbEVsbGlwc2UgPSBmdW5jdGlvbiAoeCwgeSwgdywgaCwgY29udGV4dCkge1xyXG5cdGNvbnRleHQuZWxsaXBzZSh4LCB5LCB3LCBoLCBjb250ZXh0KTtcclxuXHRjb250ZXh0LmZpbGwoKTtcclxuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgc3Ryb2tlZCBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gb3JpZ2luIFggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIG9maWdpbiBZIG9yIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHcgLSB3aWR0aCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB3IC0gaGVpZ2h0IG9mIGVsbGlwc2UuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuc3Ryb2tlRWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCB3LCBoKSB7XHJcblx0dGhpcy5lbGxpcHNlKHgsIHksIHcsIGgpO1xyXG5cdHRoaXMuc3Ryb2tlKCk7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IGxpbmUgYmV0d2VlbiAyIHZlY3RvciBjb29yZGluYXRlcy5cclxuKiBAcGFyYW0ge251bWJlcn0geDEgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkxIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4MiAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuKiBAcGFyYW0ge251bWJlcn0geTIgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkubGluZSA9IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5MiwgY29udGV4dCkge1xyXG5cdGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcblx0Y29udGV4dC5tb3ZlVG8oeDEsIHkxKTtcclxuXHRjb250ZXh0LmxpbmVUbyh4MiwgeTIpO1xyXG5cdGNvbnRleHQuc3Ryb2tlKCk7XHJcblx0Y29udGV4dC5iZWdpblBhdGgoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmNhbnZhc0RyYXdpbmdBcGkgPSBjYW52YXNEcmF3aW5nQXBpOyIsInZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxuXHJcbnZhciBjb2xvclV0aWxzID0ge1xyXG5cdC8qKlxyXG4gKiBwcm92aWRlcyBjb2xvciB1dGlsIG1ldGhvZHMuXHJcbiAqL1xyXG5cdHJnYjogZnVuY3Rpb24gcmdiKHJlZCwgZ3JlZW4sIGJsdWUpIHtcclxuXHRcdHJldHVybiAncmdiKCcgKyBtYXRoVXRpbHMuY2xhbXAoTWF0aC5yb3VuZChyZWQpLCAwLCAyNTUpICsgJywgJyArIG1hdGhVdGlscy5jbGFtcChNYXRoLnJvdW5kKGdyZWVuKSwgMCwgMjU1KSArICcsICcgKyBtYXRoVXRpbHMuY2xhbXAoTWF0aC5yb3VuZChibHVlKSwgMCwgMjU1KSArICcpJztcclxuXHR9LFxyXG5cdHJnYmE6IGZ1bmN0aW9uIHJnYmEocmVkLCBncmVlbiwgYmx1ZSwgYWxwaGEpIHtcclxuXHRcdHJldHVybiAncmdiYSgnICsgbWF0aFV0aWxzLmNsYW1wKE1hdGgucm91bmQocmVkKSwgMCwgMjU1KSArICcsICcgKyBtYXRoVXRpbHMuY2xhbXAoTWF0aC5yb3VuZChncmVlbiksIDAsIDI1NSkgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKE1hdGgucm91bmQoYmx1ZSksIDAsIDI1NSkgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKGFscGhhLCAwLCAxKSArICcpJztcclxuXHR9LFxyXG5cdGhzbDogZnVuY3Rpb24gaHNsKGh1ZSwgc2F0dXJhdGlvbiwgbGlnaHRuZXNzKSB7XHJcblx0XHRyZXR1cm4gJ2hzbCgnICsgaHVlICsgJywgJyArIG1hdGhVdGlscy5jbGFtcChzYXR1cmF0aW9uLCAwLCAxMDApICsgJyUsICcgKyBtYXRoVXRpbHMuY2xhbXAobGlnaHRuZXNzLCAwLCAxMDApICsgJyUpJztcclxuXHR9LFxyXG5cdGhzbGE6IGZ1bmN0aW9uIGhzbGEoaHVlLCBzYXR1cmF0aW9uLCBsaWdodG5lc3MsIGFscGhhKSB7XHJcblx0XHRyZXR1cm4gJ2hzbGEoJyArIGh1ZSArICcsICcgKyBtYXRoVXRpbHMuY2xhbXAoc2F0dXJhdGlvbiwgMCwgMTAwKSArICclLCAnICsgbWF0aFV0aWxzLmNsYW1wKGxpZ2h0bmVzcywgMCwgMTAwKSArICclLCAnICsgbWF0aFV0aWxzLmNsYW1wKGFscGhhLCAwLCAxKSArICcpJztcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jb2xvclV0aWxzID0gY29sb3JVdGlsczsiLCJ2YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcblxyXG52YXIgbGFzdENhbGxlZFRpbWUgPSB2b2lkIDA7XHJcblxyXG52YXIgZGVidWcgPSB7XHJcblxyXG4gICAgaGVscGVyczoge1xyXG4gICAgICAgIGdldFN0eWxlOiBmdW5jdGlvbiBnZXRTdHlsZShlbGVtZW50LCBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KSA6IGVsZW1lbnQuc3R5bGVbcHJvcGVydHkucmVwbGFjZSgvLShbYS16XSkvZywgZnVuY3Rpb24gKGcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnWzFdLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIH0pXTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGludmVydENvbG9yOiBmdW5jdGlvbiBpbnZlcnRDb2xvcihoZXgsIGJ3KSB7XHJcbiAgICAgICAgICAgIGlmIChoZXguaW5kZXhPZignIycpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBoZXggPSBoZXguc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY29udmVydCAzLWRpZ2l0IGhleCB0byA2LWRpZ2l0cy5cclxuICAgICAgICAgICAgaWYgKGhleC5sZW5ndGggPT09IDMpIHtcclxuICAgICAgICAgICAgICAgIGhleCA9IGhleFswXSArIGhleFswXSArIGhleFsxXSArIGhleFsxXSArIGhleFsyXSArIGhleFsyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaGV4Lmxlbmd0aCAhPT0gNikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEhFWCBjb2xvci4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgciA9IHBhcnNlSW50KGhleC5zbGljZSgwLCAyKSwgMTYpLFxyXG4gICAgICAgICAgICAgICAgZyA9IHBhcnNlSW50KGhleC5zbGljZSgyLCA0KSwgMTYpLFxyXG4gICAgICAgICAgICAgICAgYiA9IHBhcnNlSW50KGhleC5zbGljZSg0LCA2KSwgMTYpO1xyXG4gICAgICAgICAgICBpZiAoYncpIHtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM5NDMwMjMvMTEyNzMxXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gciAqIDAuMjk5ICsgZyAqIDAuNTg3ICsgYiAqIDAuMTE0ID4gMTg2ID8gJyMwMDAwMDAnIDogJyNGRkZGRkYnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGludmVydCBjb2xvciBjb21wb25lbnRzXHJcbiAgICAgICAgICAgIHIgPSAoMjU1IC0gcikudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgICAgICBnID0gKDI1NSAtIGcpLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgYiA9ICgyNTUgLSBiKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgICAgIC8vIHBhZCBlYWNoIHdpdGggemVyb3MgYW5kIHJldHVyblxyXG4gICAgICAgICAgICByZXR1cm4gXCIjXCIgKyBwYWRaZXJvKHIpICsgcGFkWmVybyhnKSArIHBhZFplcm8oYik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgZGlzcGxheTogZnVuY3Rpb24gZGlzcGxheShkaXNwbGF5RmxhZywgbWVzc2FnZSwgcGFyYW0pIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHNlbGYuYWxsID09PSB0cnVlIHx8IGRpc3BsYXlGbGFnID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UsIHBhcmFtKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGRlYnVnT3V0cHV0OiBmdW5jdGlvbiBkZWJ1Z091dHB1dChjYW52YXMsIGNvbnRleHQsIGxhYmVsLCBwYXJhbSwgb3V0cHV0TnVtLCBvdXRwdXRCb3VuZHMpIHtcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgIGlmIChvdXRwdXRCb3VuZHMpIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNSZWQgPSBtYXRoVXRpbHMubWFwKHBhcmFtLCBvdXRwdXRCb3VuZHMubWluLCBvdXRwdXRCb3VuZHMubWF4LCAyNTUsIDAsIHRydWUpO1xyXG4gICAgICAgICAgICB2YXIgdGhpc0dyZWVuID0gbWF0aFV0aWxzLm1hcChwYXJhbSwgb3V0cHV0Qm91bmRzLm1pbiwgb3V0cHV0Qm91bmRzLm1heCwgMCwgMjU1LCB0cnVlKTtcclxuICAgICAgICAgICAgLy8gdmFyIHRoaXNCbHVlID0gbWF0aFV0aWxzLm1hcChwYXJhbSwgb3V0cHV0Qm91bmRzLm1pbiwgb3V0cHV0Qm91bmRzLm1heCwgMCwgMjU1LCB0cnVlKTtcclxuICAgICAgICAgICAgdmFyIHRoaXNDb2xvciA9ICdyZ2IoICcgKyB0aGlzUmVkICsgJywgJyArIHRoaXNHcmVlbiArICcsIDAgKSc7XHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ2NoYW5naW5nIGRlYnVnIGNvbG9yIG9mOiAnK3BhcmFtKycgdG86ICcrdGhpc0NvbG9yICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNDb2xvciA9IFwiI2VmZWZlZlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHZQb3MgPSBvdXRwdXROdW0gKiA1MCArIDUwO1xyXG4gICAgICAgIGNvbnRleHQudGV4dEFsaWduID0gXCJsZWZ0XCI7XHJcbiAgICAgICAgY29udGV4dC5mb250ID0gXCIxNHB0IGFyaWFsXCI7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSB0aGlzQ29sb3I7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbFRleHQobGFiZWwgKyBwYXJhbSwgNTAsIHZQb3MpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjYWxjdWxhdGVGcHM6IGZ1bmN0aW9uIGNhbGN1bGF0ZUZwcygpIHtcclxuICAgICAgICBpZiAoIWxhc3RDYWxsZWRUaW1lKSB7XHJcbiAgICAgICAgICAgIGxhc3RDYWxsZWRUaW1lID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRlbHRhID0gKHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAtIGxhc3RDYWxsZWRUaW1lKSAvIDEwMDA7XHJcbiAgICAgICAgbGFzdENhbGxlZFRpbWUgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgcmV0dXJuIDEgLyBkZWx0YTtcclxuICAgIH0sXHJcblxyXG4gICAgZmxhZ3M6IHtcclxuICAgICAgICBhbGw6IGZhbHNlLFxyXG4gICAgICAgIHBhcnRzOiB7XHJcbiAgICAgICAgICAgIGNsaWNrczogdHJ1ZSxcclxuICAgICAgICAgICAgcnVudGltZTogdHJ1ZSxcclxuICAgICAgICAgICAgdXBkYXRlOiBmYWxzZSxcclxuICAgICAgICAgICAga2lsbENvbmRpdGlvbnM6IGZhbHNlLFxyXG4gICAgICAgICAgICBhbmltYXRpb25Db3VudGVyOiBmYWxzZSxcclxuICAgICAgICAgICAgZW50aXR5U3RvcmU6IGZhbHNlLFxyXG4gICAgICAgICAgICBmcHM6IHRydWVcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5kZWJ1ZyA9IGRlYnVnO1xyXG5tb2R1bGUuZXhwb3J0cy5sYXN0Q2FsbGVkVGltZSA9IGxhc3RDYWxsZWRUaW1lOyIsIi8qXHJcbiAqIFRoaXMgaXMgYSBuZWFyLWRpcmVjdCBwb3J0IG9mIFJvYmVydCBQZW5uZXIncyBlYXNpbmcgZXF1YXRpb25zLiBQbGVhc2Ugc2hvd2VyIFJvYmVydCB3aXRoXHJcbiAqIHByYWlzZSBhbmQgYWxsIG9mIHlvdXIgYWRtaXJhdGlvbi4gSGlzIGxpY2Vuc2UgaXMgcHJvdmlkZWQgYmVsb3cuXHJcbiAqXHJcbiAqIEZvciBpbmZvcm1hdGlvbiBvbiBob3cgdG8gdXNlIHRoZXNlIGZ1bmN0aW9ucyBpbiB5b3VyIGFuaW1hdGlvbnMsIGNoZWNrIG91dCBteSBmb2xsb3dpbmcgdHV0b3JpYWw6IFxyXG4gKiBodHRwOi8vYml0Lmx5LzE4aUhIS3FcclxuICpcclxuICogLUtpcnVwYVxyXG4gKi9cclxuXHJcbi8qXHJcbiAqXHJcbiAqIFRFUk1TIE9GIFVTRSAtIEVBU0lORyBFUVVBVElPTlNcclxuICogXHJcbiAqIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS4gXHJcbiAqIFxyXG4gKiBDb3B5cmlnaHQgwqkgMjAwMSBSb2JlcnQgUGVubmVyXHJcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIFxyXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLCBcclxuICogYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxyXG4gKiBcclxuICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgXHJcbiAqIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cclxuICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3QgXHJcbiAqIG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIFxyXG4gKiBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXHJcbiAqIFxyXG4gKiBOZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBhdXRob3Igbm9yIHRoZSBuYW1lcyBvZiBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBcclxuICogb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cclxuICogXHJcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORCBBTlkgXHJcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRlxyXG4gKiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuICogQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLFxyXG4gKiBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEVcclxuICogR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIFxyXG4gKiBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElOR1xyXG4gKiBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBcclxuICogT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLiBcclxuICpcclxuICovXHJcblxyXG52YXIgZWFzaW5nRXF1YXRpb25zID0ge1xyXG5cdC8qKlxyXG4gKiBwcm92aWRlcyBlYXNpbmcgdXRpbCBtZXRob2RzLlxyXG4gKi9cclxuXHRsaW5lYXJFYXNlOiBmdW5jdGlvbiBsaW5lYXJFYXNlKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5RdWFkOiBmdW5jdGlvbiBlYXNlSW5RdWFkKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMpICogY3VycmVudEl0ZXJhdGlvbiArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dFF1YWQ6IGZ1bmN0aW9uIGVhc2VPdXRRdWFkKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIC1jaGFuZ2VJblZhbHVlICogKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zKSAqIChjdXJyZW50SXRlcmF0aW9uIC0gMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dFF1YWQ6IGZ1bmN0aW9uIGVhc2VJbk91dFF1YWQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIGN1cnJlbnRJdGVyYXRpb24gKiBjdXJyZW50SXRlcmF0aW9uICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAtY2hhbmdlSW5WYWx1ZSAvIDIgKiAoLS1jdXJyZW50SXRlcmF0aW9uICogKGN1cnJlbnRJdGVyYXRpb24gLSAyKSAtIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5DdWJpYzogZnVuY3Rpb24gZWFzZUluQ3ViaWMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMsIDMpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlT3V0Q3ViaWM6IGZ1bmN0aW9uIGVhc2VPdXRDdWJpYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxLCAzKSArIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRDdWJpYzogZnVuY3Rpb24gZWFzZUluT3V0Q3ViaWMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24sIDMpICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC0gMiwgMykgKyAyKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluUXVhcnQ6IGZ1bmN0aW9uIGVhc2VJblF1YXJ0KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zLCA0KSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dFF1YXJ0OiBmdW5jdGlvbiBlYXNlT3V0UXVhcnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gLWNoYW5nZUluVmFsdWUgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEsIDQpIC0gMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dFF1YXJ0OiBmdW5jdGlvbiBlYXNlSW5PdXRRdWFydChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiwgNCkgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIC1jaGFuZ2VJblZhbHVlIC8gMiAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC0gMiwgNCkgLSAyKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluUXVpbnQ6IGZ1bmN0aW9uIGVhc2VJblF1aW50KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zLCA1KSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dFF1aW50OiBmdW5jdGlvbiBlYXNlT3V0UXVpbnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSwgNSkgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0UXVpbnQ6IGZ1bmN0aW9uIGVhc2VJbk91dFF1aW50KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uLCA1KSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAtIDIsIDUpICsgMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJblNpbmU6IGZ1bmN0aW9uIGVhc2VJblNpbmUoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICgxIC0gTWF0aC5jb3MoY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAqIChNYXRoLlBJIC8gMikpKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dFNpbmU6IGZ1bmN0aW9uIGVhc2VPdXRTaW5lKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnNpbihjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zICogKE1hdGguUEkgLyAyKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dFNpbmU6IGZ1bmN0aW9uIGVhc2VJbk91dFNpbmUoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoMSAtIE1hdGguY29zKE1hdGguUEkgKiBjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbkV4cG86IGZ1bmN0aW9uIGVhc2VJbkV4cG8oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGgucG93KDIsIDEwICogKGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRFeHBvOiBmdW5jdGlvbiBlYXNlT3V0RXhwbyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKC1NYXRoLnBvdygyLCAtMTAgKiBjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zKSArIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRFeHBvOiBmdW5jdGlvbiBlYXNlSW5PdXRFeHBvKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdygyLCAxMCAqIChjdXJyZW50SXRlcmF0aW9uIC0gMSkpICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqICgtTWF0aC5wb3coMiwgLTEwICogLS1jdXJyZW50SXRlcmF0aW9uKSArIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5DaXJjOiBmdW5jdGlvbiBlYXNlSW5DaXJjKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoMSAtIE1hdGguc3FydCgxIC0gKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zKSAqIGN1cnJlbnRJdGVyYXRpb24pKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dENpcmM6IGZ1bmN0aW9uIGVhc2VPdXRDaXJjKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnNxcnQoMSAtIChjdXJyZW50SXRlcmF0aW9uID0gY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEpICogY3VycmVudEl0ZXJhdGlvbikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dENpcmM6IGZ1bmN0aW9uIGVhc2VJbk91dENpcmMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqICgxIC0gTWF0aC5zcXJ0KDEgLSBjdXJyZW50SXRlcmF0aW9uICogY3VycmVudEl0ZXJhdGlvbikpICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIChNYXRoLnNxcnQoMSAtIChjdXJyZW50SXRlcmF0aW9uIC09IDIpICogY3VycmVudEl0ZXJhdGlvbikgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluRWxhc3RpYzogZnVuY3Rpb24gZWFzZUluRWxhc3RpYyh0LCBiLCBjLCBkKSB7XHJcblx0XHR2YXIgcyA9IDEuNzAxNTg7dmFyIHAgPSAwO3ZhciBhID0gYztcclxuXHRcdGlmICh0ID09IDApIHJldHVybiBiO2lmICgodCAvPSBkKSA9PSAxKSByZXR1cm4gYiArIGM7aWYgKCFwKSBwID0gZCAqIC4zO1xyXG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjKSkge1xyXG5cdFx0XHRhID0gYzt2YXIgcyA9IHAgLyA0O1xyXG5cdFx0fSBlbHNlIHZhciBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oYyAvIGEpO1xyXG5cdFx0cmV0dXJuIC0oYSAqIE1hdGgucG93KDIsIDEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiBkIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkpICsgYjtcclxuXHR9LFxyXG5cdGVhc2VPdXRFbGFzdGljOiBmdW5jdGlvbiBlYXNlT3V0RWxhc3RpYyh0LCBiLCBjLCBkKSB7XHJcblx0XHR2YXIgcyA9IDEuNzAxNTg7dmFyIHAgPSAwO3ZhciBhID0gYztcclxuXHRcdGlmICh0ID09IDApIHJldHVybiBiO2lmICgodCAvPSBkKSA9PSAxKSByZXR1cm4gYiArIGM7aWYgKCFwKSBwID0gZCAqIC4zO1xyXG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjKSkge1xyXG5cdFx0XHRhID0gYzt2YXIgcyA9IHAgLyA0O1xyXG5cdFx0fSBlbHNlIHZhciBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oYyAvIGEpO1xyXG5cdFx0cmV0dXJuIGEgKiBNYXRoLnBvdygyLCAtMTAgKiB0KSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApICsgYyArIGI7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0RWxhc3RpYzogZnVuY3Rpb24gZWFzZUluT3V0RWxhc3RpYyh0LCBiLCBjLCBkKSB7XHJcblx0XHR2YXIgcyA9IDEuNzAxNTg7dmFyIHAgPSAwO3ZhciBhID0gYztcclxuXHRcdGlmICh0ID09IDApIHJldHVybiBiO2lmICgodCAvPSBkIC8gMikgPT0gMikgcmV0dXJuIGIgKyBjO2lmICghcCkgcCA9IGQgKiAoLjMgKiAxLjUpO1xyXG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjKSkge1xyXG5cdFx0XHRhID0gYzt2YXIgcyA9IHAgLyA0O1xyXG5cdFx0fSBlbHNlIHZhciBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oYyAvIGEpO1xyXG5cdFx0aWYgKHQgPCAxKSByZXR1cm4gLS41ICogKGEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKSArIGI7XHJcblx0XHRyZXR1cm4gYSAqIE1hdGgucG93KDIsIC0xMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApICogLjUgKyBjICsgYjtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5CYWNrOiBmdW5jdGlvbiBlYXNlSW5CYWNrKHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRyZXR1cm4gYyAqICh0IC89IGQpICogdCAqICgocyArIDEpICogdCAtIHMpICsgYjtcclxuXHR9LFxyXG5cclxuXHRlYXNlT3V0QmFjazogZnVuY3Rpb24gZWFzZU91dEJhY2sodCwgYiwgYywgZCwgcykge1xyXG5cdFx0aWYgKHMgPT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcclxuXHRcdHJldHVybiBjICogKCh0ID0gdCAvIGQgLSAxKSAqIHQgKiAoKHMgKyAxKSAqIHQgKyBzKSArIDEpICsgYjtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRCYWNrOiBmdW5jdGlvbiBlYXNlSW5PdXRCYWNrKHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRpZiAoKHQgLz0gZCAvIDIpIDwgMSkgcmV0dXJuIGMgLyAyICogKHQgKiB0ICogKCgocyAqPSAxLjUyNSkgKyAxKSAqIHQgLSBzKSkgKyBiO1xyXG5cdFx0cmV0dXJuIGMgLyAyICogKCh0IC09IDIpICogdCAqICgoKHMgKj0gMS41MjUpICsgMSkgKiB0ICsgcykgKyAyKSArIGI7XHJcblx0fSxcclxuXHJcblx0Ly8gZWFzZUluQm91bmNlOiBmdW5jdGlvbih0LCBiLCBjLCBkKSB7XHJcblx0Ly8gICAgIHJldHVybiBjIC0gZWFzZU91dEJvdW5jZShkLXQsIDAsIGMsIGQpICsgYjtcclxuXHQvLyB9LFxyXG5cclxuXHRlYXNlT3V0Qm91bmNlOiBmdW5jdGlvbiBlYXNlT3V0Qm91bmNlKHQsIGIsIGMsIGQpIHtcclxuXHRcdGlmICgodCAvPSBkKSA8IDEgLyAyLjc1KSB7XHJcblx0XHRcdHJldHVybiBjICogKDcuNTYyNSAqIHQgKiB0KSArIGI7XHJcblx0XHR9IGVsc2UgaWYgKHQgPCAyIC8gMi43NSkge1xyXG5cdFx0XHRyZXR1cm4gYyAqICg3LjU2MjUgKiAodCAtPSAxLjUgLyAyLjc1KSAqIHQgKyAuNzUpICsgYjtcclxuXHRcdH0gZWxzZSBpZiAodCA8IDIuNSAvIDIuNzUpIHtcclxuXHRcdFx0cmV0dXJuIGMgKiAoNy41NjI1ICogKHQgLT0gMi4yNSAvIDIuNzUpICogdCArIC45Mzc1KSArIGI7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gYyAqICg3LjU2MjUgKiAodCAtPSAyLjYyNSAvIDIuNzUpICogdCArIC45ODQzNzUpICsgYjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGVhc2VJbk91dEJvdW5jZTogZnVuY3Rpb24odCwgYiwgYywgZCkge1xyXG5cdC8vICAgICBpZiAodCA8IGQvMikgcmV0dXJuIHRoaXMuZWFzZUluQm91bmNlKHQqMiwgMCwgYywgZCkgKiAuNSArIGI7XHJcblx0Ly8gICAgIHJldHVybiB0aGlzLmVhc2VPdXRCb3VuY2UodCoyLWQsIDAsIGMsIGQpICogLjUgKyBjKi41ICsgYjtcclxuXHQvLyB9XHJcbn07XHJcblxyXG5lYXNpbmdFcXVhdGlvbnMuZWFzZUluQm91bmNlID0gZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcclxuXHRyZXR1cm4gYyAtIGVhc2luZ0VxdWF0aW9ucy5lYXNlT3V0Qm91bmNlKGQgLSB0LCAwLCBjLCBkKSArIGI7XHJcbn0sIGVhc2luZ0VxdWF0aW9ucy5lYXNlSW5PdXRCb3VuY2UgPSBmdW5jdGlvbiAodCwgYiwgYywgZCkge1xyXG5cdGlmICh0IDwgZCAvIDIpIHJldHVybiBlYXNpbmdFcXVhdGlvbnMuZWFzZUluQm91bmNlKHQgKiAyLCAwLCBjLCBkKSAqIC41ICsgYjtcclxuXHRyZXR1cm4gZWFzaW5nRXF1YXRpb25zLmVhc2VPdXRCb3VuY2UodCAqIDIgLSBkLCAwLCBjLCBkKSAqIC41ICsgYyAqIC41ICsgYjtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmVhc2luZ0VxdWF0aW9ucyA9IGVhc2luZ0VxdWF0aW9uczsiLCJ2YXIgRW1pdHRlclN0b3JlRm4gPSBmdW5jdGlvbiBFbWl0dGVyU3RvcmVGbigpIHt9O1xyXG5cclxuRW1pdHRlclN0b3JlRm4ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChzdG9yZSkge1xyXG4gIHZhciBpID0gc3RvcmUubGVuZ3RoIC0gMTtcclxuICBmb3IgKDsgaSA+PSAwOyBpLS0pIHtcclxuICAgIHN0b3JlW2ldLnVwZGF0ZUVtaXR0ZXIoKTtcclxuICAgIC8vIHN0b3JlW2ldLnJlbmRlckVtaXR0ZXIoIGN0eCApO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLkVtaXR0ZXJTdG9yZUZuID0gRW1pdHRlclN0b3JlRm47IiwiLy8gZW1pc3Npb24gdGhlbWVcclxuXHJcbnZhciBiYXNlRW1pdHRlclRoZW1lID0ge1xyXG5cclxuXHRlbWl0dGVyOiB7XHJcblxyXG5cdFx0YWN0aXZlOiAwLFxyXG5cclxuXHRcdC8vIHBvc2l0aW9uXHJcblx0XHR4OiAwLFxyXG5cdFx0eTogMCxcclxuXHRcdHhWZWw6IDAsXHJcblx0XHR5VmVsOiAwLFxyXG5cdFx0YXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0Ly8gZW1pc3Npb24gcmF0ZSBjb25maWcgKHBlciBjeWNsZSAoIGZyYW1lICkgKVxyXG5cdGVtaXNzaW9uOiB7XHJcblxyXG5cdFx0cmF0ZToge1xyXG5cdFx0XHRtaW46IDAsXHJcblx0XHRcdG1heDogMCxcclxuXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0XHRkZWNheU1heDogMFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGVtaXNzaW9uIHJlcGVhdGVyIGNvbmZpZ1xyXG5cdFx0cmVwZWF0ZXI6IHtcclxuXHRcdFx0Ly8gd2hhdCBpcyB0aGUgcmVwZXRpdGlvbiByYXRlICggZnJhbWVzIClcclxuXHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0Ly8gZG9lcyB0aGUgcmVwZXRpdGlvbiByYXRlIGRlY2F5ICggZ2V0IGxvbmdlciApPyBob3cgbXVjaCBsb25nZXI/IFxyXG5cdFx0XHRkZWNheToge1xyXG5cdFx0XHRcdHJhdGU6IDAsXHJcblx0XHRcdFx0ZGVjYXlNYXg6IDBcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBpbml0aWFsIGRpcmVjdGlvbiBvZiBwYXJ0aWNsZXNcclxuXHRcdGRpcmVjdGlvbjoge1xyXG5cdFx0XHRyYWQ6IDAsIC8vIGluIHJhZGlhbnMgKDAgLSAyKVxyXG5cdFx0XHRtaW46IDAsIC8vIGxvdyBib3VuZHMgKHJhZGlhbnMpXHJcblx0XHRcdG1heDogMCAvLyBoaWdoIGJvdW5kcyAocmFkaWFucylcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gYXJlIHBhcnRpY2xlcyBvZmZzZXQgZnJvbSBpbml0YWwgeC95XHJcblx0XHRyYWRpYWxEaXNwbGFjZW1lbnQ6IDAsXHJcblx0XHQvLyBpcyB0aGUgb2Zmc2V0IGZlYXRoZXJlZD9cclxuXHRcdHJhZGlhbERpc3BsYWNlbWVudE9mZnNldDogMCxcclxuXHJcblx0XHQvL2luaXRpYWwgdmVsb2NpdHkgb2YgcGFydGljbGVzXHJcblx0XHRpbXB1bHNlOiB7XHJcblx0XHRcdHBvdzogMCxcclxuXHRcdFx0bWluOiAwLFxyXG5cdFx0XHRtYXg6IDBcclxuXHRcdH1cclxuXHR9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuYmFzZUVtaXR0ZXJUaGVtZSA9IGJhc2VFbWl0dGVyVGhlbWU7IiwiLy8gZW1pc3Npb24gdGhlbWVcclxuXHJcbnZhciBmbGFtZVN0cmVhbVRoZW1lID0ge1xyXG5cclxuXHRlbWl0dGVyOiB7XHJcblxyXG5cdFx0YWN0aXZlOiAxLFxyXG5cclxuXHRcdC8vIHBvc2l0aW9uXHJcblx0XHR4OiAwLFxyXG5cdFx0eTogMCxcclxuXHRcdHhWZWw6IDAsXHJcblx0XHR5VmVsOiAwLFxyXG5cdFx0YXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0Ly8gZW1pc3Npb24gcmF0ZSBjb25maWcgKHBlciBjeWNsZSAoIGZyYW1lICkgKVxyXG5cdGVtaXNzaW9uOiB7XHJcblxyXG5cdFx0cmF0ZToge1xyXG5cdFx0XHRtaW46IDEwLFxyXG5cdFx0XHRtYXg6IDIwLFxyXG5cclxuXHRcdFx0ZGVjYXk6IHtcclxuXHRcdFx0XHRyYXRlOiAwLFxyXG5cdFx0XHRcdGRlY2F5TWF4OiAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gZW1pc3Npb24gcmVwZWF0ZXIgY29uZmlnXHJcblx0XHRyZXBlYXRlcjoge1xyXG5cdFx0XHQvLyB3aGF0IGlzIHRoZSByZXBldGl0aW9uIHJhdGUgKCBmcmFtZXMgKVxyXG5cdFx0XHRyYXRlOiAxLFxyXG5cdFx0XHQvLyBkb2VzIHRoZSByZXBldGl0aW9uIHJhdGUgZGVjYXkgKCBnZXQgbG9uZ2VyICk/IGhvdyBtdWNoIGxvbmdlcj8gXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0XHRkZWNheU1heDogMzAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaW5pdGlhbCBkaXJlY3Rpb24gb2YgcGFydGljbGVzXHJcblx0XHRkaXJlY3Rpb246IHtcclxuXHRcdFx0cmFkOiAwLCAvLyBpbiByYWRpYW5zICgwIC0gMilcclxuXHRcdFx0bWluOiAxLjQ1LCAvLyBsb3cgYm91bmRzIChyYWRpYW5zKVxyXG5cdFx0XHRtYXg6IDEuNTUgLy8gaGlnaCBib3VuZHMgKHJhZGlhbnMpXHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGFyZSBwYXJ0aWNsZXMgb2Zmc2V0IGZyb20gaW5pdGFsIHgveVxyXG5cdFx0cmFkaWFsRGlzcGxhY2VtZW50OiAwLFxyXG5cdFx0Ly8gaXMgdGhlIG9mZnNldCBmZWF0aGVyZWQ/XHJcblx0XHRyYWRpYWxEaXNwbGFjZW1lbnRPZmZzZXQ6IDAsXHJcblxyXG5cdFx0Ly9pbml0aWFsIHZlbG9jaXR5IG9mIHBhcnRpY2xlc1xyXG5cdFx0aW1wdWxzZToge1xyXG5cdFx0XHRwb3c6IDAsXHJcblx0XHRcdG1pbjogOCxcclxuXHRcdFx0bWF4OiAxNVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5mbGFtZVN0cmVhbVRoZW1lID0gZmxhbWVTdHJlYW1UaGVtZTsiLCIvLyBlbWlzc2lvbiB0aGVtZVxyXG5cclxudmFyIHNpbmdsZUJ1cnN0VGhlbWUgPSB7XHJcblxyXG5cdGVtaXR0ZXI6IHtcclxuXHJcblx0XHRhY3RpdmU6IDEsXHJcblxyXG5cdFx0Ly8gcG9zaXRpb25cclxuXHRcdHg6IDAsXHJcblx0XHR5OiAwLFxyXG5cdFx0eFZlbDogMCxcclxuXHRcdHlWZWw6IDAsXHJcblx0XHRhcHBseUdsb2JhbEZvcmNlczogZmFsc2VcclxuXHR9LFxyXG5cclxuXHQvLyBlbWlzc2lvbiByYXRlIGNvbmZpZyAocGVyIGN5Y2xlICggZnJhbWUgKSApXHJcblx0ZW1pc3Npb246IHtcclxuXHJcblx0XHRyYXRlOiB7XHJcblx0XHRcdG1pbjogMzAsXHJcblx0XHRcdG1heDogMTAwLFxyXG5cclxuXHRcdFx0ZGVjYXk6IHtcclxuXHRcdFx0XHRyYXRlOiA1LFxyXG5cdFx0XHRcdGRlY2F5TWF4OiAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gZW1pc3Npb24gcmVwZWF0ZXIgY29uZmlnXHJcblx0XHRyZXBlYXRlcjoge1xyXG5cdFx0XHQvLyB3aGF0IGlzIHRoZSByZXBldGl0aW9uIHJhdGUgKCBmcmFtZXMgKVxyXG5cdFx0XHRyYXRlOiAwLFxyXG5cdFx0XHQvLyBkb2VzIHRoZSByZXBldGl0aW9uIHJhdGUgZGVjYXkgKCBnZXQgbG9uZ2VyICk/IGhvdyBtdWNoIGxvbmdlcj8gXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0XHRkZWNheU1heDogMzAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaW5pdGlhbCBkaXJlY3Rpb24gb2YgcGFydGljbGVzXHJcblx0XHRkaXJlY3Rpb246IHtcclxuXHRcdFx0cmFkOiAwLCAvLyBpbiByYWRpYW5zICgwIC0gMilcclxuXHRcdFx0bWluOiAwLCAvLyBsb3cgYm91bmRzIChyYWRpYW5zKVxyXG5cdFx0XHRtYXg6IDIgLy8gaGlnaCBib3VuZHMgKHJhZGlhbnMpXHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGFyZSBwYXJ0aWNsZXMgb2Zmc2V0IGZyb20gaW5pdGFsIHgveVxyXG5cdFx0cmFkaWFsRGlzcGxhY2VtZW50OiAyMCxcclxuXHRcdC8vIGlzIHRoZSBvZmZzZXQgZmVhdGhlcmVkP1xyXG5cdFx0cmFkaWFsRGlzcGxhY2VtZW50T2Zmc2V0OiAwLFxyXG5cclxuXHRcdC8vaW5pdGlhbCB2ZWxvY2l0eSBvZiBwYXJ0aWNsZXNcclxuXHRcdGltcHVsc2U6IHtcclxuXHRcdFx0cG93OiAwLFxyXG5cdFx0XHRtaW46IDUwLFxyXG5cdFx0XHRtYXg6IDgwXHJcblx0XHR9XHJcblx0fVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnNpbmdsZUJ1cnN0VGhlbWUgPSBzaW5nbGVCdXJzdFRoZW1lOyIsIi8vIGVtaXNzaW9uIHRoZW1lXHJcblxyXG52YXIgc21va2VTdHJlYW1UaGVtZSA9IHtcclxuXHJcblx0ZW1pdHRlcjoge1xyXG5cclxuXHRcdGFjdGl2ZTogMCxcclxuXHJcblx0XHQvLyBwb3NpdGlvblxyXG5cdFx0eDogMCxcclxuXHRcdHk6IDAsXHJcblx0XHR4VmVsOiAwLFxyXG5cdFx0eVZlbDogMCxcclxuXHRcdGFwcGx5R2xvYmFsRm9yY2VzOiBmYWxzZVxyXG5cdH0sXHJcblxyXG5cdC8vIGVtaXNzaW9uIHJhdGUgY29uZmlnIChwZXIgY3ljbGUgKCBmcmFtZSApIClcclxuXHRlbWlzc2lvbjoge1xyXG5cclxuXHRcdHJhdGU6IHtcclxuXHRcdFx0bWluOiA1LFxyXG5cdFx0XHRtYXg6IDEwLFxyXG5cclxuXHRcdFx0ZGVjYXk6IHtcclxuXHRcdFx0XHRyYXRlOiAwLFxyXG5cdFx0XHRcdGRlY2F5TWF4OiAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gZW1pc3Npb24gcmVwZWF0ZXIgY29uZmlnXHJcblx0XHRyZXBlYXRlcjoge1xyXG5cdFx0XHQvLyB3aGF0IGlzIHRoZSByZXBldGl0aW9uIHJhdGUgKCBmcmFtZXMgKVxyXG5cdFx0XHRyYXRlOiAwLFxyXG5cdFx0XHQvLyBkb2VzIHRoZSByZXBldGl0aW9uIHJhdGUgZGVjYXkgKCBnZXQgbG9uZ2VyICk/IGhvdyBtdWNoIGxvbmdlcj8gXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0XHRkZWNheU1heDogMFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGluaXRpYWwgZGlyZWN0aW9uIG9mIHBhcnRpY2xlc1xyXG5cdFx0ZGlyZWN0aW9uOiB7XHJcblx0XHRcdHJhZDogMCwgLy8gaW4gcmFkaWFucyAoMCAtIDIpXHJcblx0XHRcdG1pbjogMS40OSwgLy8gbG93IGJvdW5kcyAocmFkaWFucylcclxuXHRcdFx0bWF4OiAxLjUxIC8vIGhpZ2ggYm91bmRzIChyYWRpYW5zKVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBhcmUgcGFydGljbGVzIG9mZnNldCBmcm9tIGluaXRhbCB4L3lcclxuXHRcdHJhZGlhbERpc3BsYWNlbWVudDogMCxcclxuXHRcdC8vIGlzIHRoZSBvZmZzZXQgZmVhdGhlcmVkP1xyXG5cdFx0cmFkaWFsRGlzcGxhY2VtZW50T2Zmc2V0OiAwLFxyXG5cclxuXHRcdC8vaW5pdGlhbCB2ZWxvY2l0eSBvZiBwYXJ0aWNsZXNcclxuXHRcdGltcHVsc2U6IHtcclxuXHRcdFx0cG93OiAwLFxyXG5cdFx0XHRtaW46IDUsXHJcblx0XHRcdG1heDogMTBcclxuXHRcdH1cclxuXHR9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuc21va2VTdHJlYW1UaGVtZSA9IHNtb2tlU3RyZWFtVGhlbWU7IiwiLy8gZW1pc3Npb24gdGhlbWVcclxuXHJcbiAgdmFyIHdhcnBTdHJlYW1UaGVtZSA9IHtcclxuXHJcbiAgICBlbWl0dGVyOiB7XHJcblxyXG4gICAgICBhY3RpdmU6IDEsXHJcblxyXG4gICAgICAvLyBwb3NpdGlvblxyXG4gICAgICB4OiAwLFxyXG4gICAgICB5OiAwLFxyXG4gICAgICB4VmVsOiAwLFxyXG4gICAgICB5VmVsOiAwLFxyXG4gICAgICBhcHBseUdsb2JhbEZvcmNlczogZmFsc2VcclxuICAgIH0sXHJcblxyXG4gICAgLy8gZW1pc3Npb24gcmF0ZSBjb25maWcgKHBlciBjeWNsZSAoIGZyYW1lICkgKVxyXG4gICAgZW1pc3Npb246IHtcclxuXHJcbiAgICAgIHJhdGU6IHtcclxuICAgICAgICBtaW46IDEwLFxyXG4gICAgICAgIG1heDogMjAsXHJcblxyXG4gICAgICAgIGRlY2F5OiB7XHJcbiAgICAgICAgICByYXRlOiAwLFxyXG4gICAgICAgICAgZGVjYXlNYXg6IDBcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBlbWlzc2lvbiByZXBlYXRlciBjb25maWdcclxuICAgICAgcmVwZWF0ZXI6IHtcclxuICAgICAgICAvLyB3aGF0IGlzIHRoZSByZXBldGl0aW9uIHJhdGUgKCBmcmFtZXMgKVxyXG4gICAgICAgIHJhdGU6IDUsXHJcbiAgICAgICAgLy8gZG9lcyB0aGUgcmVwZXRpdGlvbiByYXRlIGRlY2F5ICggZ2V0IGxvbmdlciApPyBob3cgbXVjaCBsb25nZXI/IFxyXG4gICAgICAgIGRlY2F5OiB7XHJcbiAgICAgICAgICByYXRlOiAwLFxyXG4gICAgICAgICAgZGVjYXlNYXg6IDMwMFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vIGluaXRpYWwgZGlyZWN0aW9uIG9mIHBhcnRpY2xlc1xyXG4gICAgICBkaXJlY3Rpb246IHtcclxuICAgICAgICByYWQ6IDAsIC8vIGluIHJhZGlhbnMgKDAgLSAyKVxyXG4gICAgICAgIG1pbjogMCwgLy8gbG93IGJvdW5kcyAocmFkaWFucylcclxuICAgICAgICBtYXg6IDIgLy8gaGlnaCBib3VuZHMgKHJhZGlhbnMpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBhcmUgcGFydGljbGVzIG9mZnNldCBmcm9tIGluaXRhbCB4L3lcclxuICAgICAgcmFkaWFsRGlzcGxhY2VtZW50OiAxMDAsXHJcbiAgICAgIC8vIGlzIHRoZSBvZmZzZXQgZmVhdGhlcmVkP1xyXG4gICAgICByYWRpYWxEaXNwbGFjZW1lbnRPZmZzZXQ6IDAsXHJcblxyXG4gICAgICAvL2luaXRpYWwgdmVsb2NpdHkgb2YgcGFydGljbGVzXHJcbiAgICAgIGltcHVsc2U6IHtcclxuICAgICAgICBwb3c6IDAsXHJcbiAgICAgICAgbWluOiAwLjI1LFxyXG4gICAgICAgIG1heDogMS4yNVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH07XHJcblxyXG4gIG1vZHVsZS5leHBvcnRzLndhcnBTdHJlYW1UaGVtZSA9IHdhcnBTdHJlYW1UaGVtZTsiLCJyZXF1aXJlKCAnLi9wYXJ0aWNsZXMuanMnICk7IiwidmFyIGVudmlyb25tZW50ID0ge1xyXG5cclxuXHRcdHJ1bnRpbWVFbmdpbmU6IHtcclxuXHJcblx0XHRcdFx0c3RhcnRBbmltYXRpb246IGZ1bmN0aW9uIHN0YXJ0QW5pbWF0aW9uKGFuaW1WYXIsIGxvb3BGbikge1xyXG5cdFx0XHRcdFx0XHRpZiAoIWFuaW1WYXIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGFuaW1WYXIgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3BGbik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cclxuXHRcdFx0XHRzdG9wQW5pbWF0aW9uOiBmdW5jdGlvbiBzdG9wQW5pbWF0aW9uKGFuaW1WYXIpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGFuaW1WYXIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShhbmltVmFyKTtcclxuXHRcdFx0XHRcdFx0XHRcdGFuaW1WYXIgPSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHRjYW52YXM6IHtcclxuXHRcdFx0XHQvLyBidWZmZXIgY2xlYXIgZk5cclxuXHRcdFx0XHRjaGVja0NsZWFyQnVmZmVyUmVnaW9uOiBmdW5jdGlvbiBjaGVja0NsZWFyQnVmZmVyUmVnaW9uKHBhcnRpY2xlLCBjYW52YXNDb25maWcpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBidWZmZXJDbGVhclJlZ2lvbiA9IGNhbnZhc0NvbmZpZy5idWZmZXJDbGVhclJlZ2lvbjtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBlbnRpdHlXaWR0aCA9IHBhcnRpY2xlLnIgLyAyO1xyXG5cdFx0XHRcdFx0XHR2YXIgZW50aXR5SGVpZ2h0ID0gcGFydGljbGUuciAvIDI7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAocGFydGljbGUueCAtIGVudGl0eVdpZHRoIDwgYnVmZmVyQ2xlYXJSZWdpb24ueCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24ueCA9IHBhcnRpY2xlLnggLSBlbnRpdHlXaWR0aDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnggKyBlbnRpdHlXaWR0aCA+IGJ1ZmZlckNsZWFyUmVnaW9uLnggKyBidWZmZXJDbGVhclJlZ2lvbi53KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi53ID0gcGFydGljbGUueCArIGVudGl0eVdpZHRoIC0gYnVmZmVyQ2xlYXJSZWdpb24ueDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnkgLSBlbnRpdHlIZWlnaHQgPCBidWZmZXJDbGVhclJlZ2lvbi55KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi55ID0gcGFydGljbGUueSAtIGVudGl0eUhlaWdodDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnkgKyBlbnRpdHlIZWlnaHQgPiBidWZmZXJDbGVhclJlZ2lvbi55ICsgYnVmZmVyQ2xlYXJSZWdpb24uaCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24uaCA9IHBhcnRpY2xlLnkgKyBlbnRpdHlIZWlnaHQgLSBidWZmZXJDbGVhclJlZ2lvbi55O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHJcblx0XHRcdFx0cmVzZXRCdWZmZXJDbGVhclJlZ2lvbjogZnVuY3Rpb24gcmVzZXRCdWZmZXJDbGVhclJlZ2lvbihjYW52YXNDb25maWcpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBidWZmZXJDbGVhclJlZ2lvbiA9IGNhbnZhc0NvbmZpZy5idWZmZXJDbGVhclJlZ2lvbjtcclxuXHJcblx0XHRcdFx0XHRcdGJ1ZmZlckNsZWFyUmVnaW9uLnggPSBjYW52YXNDb25maWcuY2VudGVySDtcclxuXHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24ueSA9IGNhbnZhc0NvbmZpZy5jZW50ZXJWO1xyXG5cdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi53ID0gY2FudmFzQ29uZmlnLndpZHRoO1xyXG5cdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi5oID0gY2FudmFzQ29uZmlnLmhlaWdodDtcclxuXHRcdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGZvcmNlczoge1xyXG5cdFx0XHRcdGZyaWN0aW9uOiAwLjAxLFxyXG5cdFx0XHRcdGJvdXlhbmN5OiAxLFxyXG5cdFx0XHRcdGdyYXZpdHk6IDAsXHJcblx0XHRcdFx0d2luZDogMSxcclxuXHRcdFx0XHR0dXJidWxlbmNlOiB7IG1pbjogLTUsIG1heDogNSB9XHJcblx0XHR9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudDsiLCIvKipcclxuKiBwcm92aWRlcyBtYXRocyB1dGlsIG1ldGhvZHMuXHJcbipcclxuKiBAbWl4aW5cclxuKi9cclxuXHJcbnZhciBtYXRoVXRpbHMgPSB7XHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZW5lcmF0ZSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIDIgdmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIC0gbWluaW11bSB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0cmFuZG9tSW50ZWdlcjogZnVuY3Rpb24gcmFuZG9tSW50ZWdlcihtaW4sIG1heCkge1xyXG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggKyAxIC0gbWluKSkgKyBtaW47XHJcblx0fSxcclxuXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZW5lcmF0ZSByYW5kb20gZmxvYXQgYmV0d2VlbiAyIHZhbHVlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIG1pbmltdW0gdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSBtYXhpbXVtIHZhbHVlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdHJhbmRvbTogZnVuY3Rpb24gcmFuZG9tKG1pbiwgbWF4KSB7XHJcblx0XHRpZiAobWluID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0bWluID0gMDtcclxuXHRcdFx0bWF4ID0gMTtcclxuXHRcdH0gZWxzZSBpZiAobWF4ID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0bWF4ID0gbWluO1xyXG5cdFx0XHRtaW4gPSAwO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcclxuXHR9LFxyXG5cclxuXHRnZXRSYW5kb21BcmJpdHJhcnk6IGZ1bmN0aW9uIGdldFJhbmRvbUFyYml0cmFyeShtaW4sIG1heCkge1xyXG5cdFx0cmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcclxuXHR9LFxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gVHJhbnNmb3JtcyB2YWx1ZSBwcm9wb3J0aW9uYXRlbHkgYmV0d2VlbiBpbnB1dCByYW5nZSBhbmQgb3V0cHV0IHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSB0aGUgdmFsdWUgaW4gdGhlIG9yaWdpbiByYW5nZSAoIG1pbjEvbWF4MSApLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluMSAtIG1pbmltdW0gdmFsdWUgaW4gb3JpZ2luIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4MSAtIG1heGltdW0gdmFsdWUgaW4gb3JpZ2luIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluMiAtIG1pbmltdW0gdmFsdWUgaW4gZGVzdGluYXRpb24gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXgyIC0gbWF4aW11bSB2YWx1ZSBpbiBkZXN0aW5hdGlvbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IGNsYW1wUmVzdWx0IC0gY2xhbXAgcmVzdWx0IGJldHdlZW4gZGVzdGluYXRpb24gcmFuZ2UgYm91bmRhcnlzLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdG1hcDogZnVuY3Rpb24gbWFwKHZhbHVlLCBtaW4xLCBtYXgxLCBtaW4yLCBtYXgyLCBjbGFtcFJlc3VsdCkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0dmFyIHJldHVybnZhbHVlID0gKHZhbHVlIC0gbWluMSkgLyAobWF4MSAtIG1pbjEpICogKG1heDIgLSBtaW4yKSArIG1pbjI7XHJcblx0XHRpZiAoY2xhbXBSZXN1bHQpIHJldHVybiBzZWxmLmNsYW1wKHJldHVybnZhbHVlLCBtaW4yLCBtYXgyKTtlbHNlIHJldHVybiByZXR1cm52YWx1ZTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIENsYW1wIHZhbHVlIGJldHdlZW4gcmFuZ2UgdmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSB0aGUgdmFsdWUgaW4gdGhlIHJhbmdlIHsgbWlufG1heCB9LlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIC0gbWluaW11bSB2YWx1ZSBpbiB0aGUgcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSBtYXhpbXVtIHZhbHVlIGluIHRoZSByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IGNsYW1wUmVzdWx0IC0gY2xhbXAgcmVzdWx0IGJldHdlZW4gcmFuZ2UgYm91bmRhcnlzLlxyXG4gKi9cclxuXHRjbGFtcDogZnVuY3Rpb24gY2xhbXAodmFsdWUsIG1pbiwgbWF4KSB7XHJcblx0XHRpZiAobWF4IDwgbWluKSB7XHJcblx0XHRcdHZhciB0ZW1wID0gbWluO1xyXG5cdFx0XHRtaW4gPSBtYXg7XHJcblx0XHRcdG1heCA9IHRlbXA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbih2YWx1ZSwgbWF4KSk7XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMubWF0aFV0aWxzID0gbWF0aFV0aWxzOyIsInZhciByZW5kZXJQYXJ0aWNsZUFyciA9IHJlcXVpcmUoJy4vcGFydGljbGVGdW5jdGlvbnMvcmVuZGVyUGFydGljbGVBcnIuanMnKS5yZW5kZXJQYXJ0aWNsZUFycjtcclxudmFyIHVwZGF0ZVBhcnRpY2xlQXJyID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUZ1bmN0aW9ucy91cGRhdGVQYXJ0aWNsZUFyci5qcycpLnVwZGF0ZVBhcnRpY2xlQXJyO1xyXG5cclxudmFyIHBhcnRpY2xlQXJyRm4gPSB7XHJcblxyXG5cdHJlbmRlclBhcnRpY2xlQXJyOiByZW5kZXJQYXJ0aWNsZUFycixcclxuXHR1cGRhdGVQYXJ0aWNsZUFycjogdXBkYXRlUGFydGljbGVBcnJcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5wYXJ0aWNsZUFyckZuID0gcGFydGljbGVBcnJGbjsiLCJ2YXIgY2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUZ1bmN0aW9ucy9jaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnMuanMnKS5jaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnM7XHJcbnZhciBjcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMgPSByZXF1aXJlKCcuL3BhcnRpY2xlRnVuY3Rpb25zL2NyZWF0ZVBlclBhcnRpY2xlQXR0cmlidXRlcy5qcycpLmNyZWF0ZVBlclBhcnRpY2xlQXR0cmlidXRlcztcclxudmFyIHVwZGF0ZVBhcnRpY2xlID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUZ1bmN0aW9ucy91cGRhdGVQYXJ0aWNsZS5qcycpLnVwZGF0ZVBhcnRpY2xlO1xyXG52YXIga2lsbFBhcnRpY2xlID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUZ1bmN0aW9ucy9raWxsUGFydGljbGUuanMnKS5raWxsUGFydGljbGU7XHJcblxyXG52YXIgcGFydGljbGVGbiA9IHtcclxuXHJcblx0Y2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zOiBjaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnMsXHJcblx0Y3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzOiBjcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMsXHJcblx0dXBkYXRlUGFydGljbGU6IHVwZGF0ZVBhcnRpY2xlLFxyXG5cdGtpbGxQYXJ0aWNsZToga2lsbFBhcnRpY2xlXHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMucGFydGljbGVGbiA9IHBhcnRpY2xlRm47IiwidmFyIGNoZWNrUGFydGljbGVLaWxsQ29uZGl0aW9ucyA9IGZ1bmN0aW9uIGNoZWNrUGFydGljbGVLaWxsQ29uZGl0aW9ucyhwLCBjYW5XLCBjYW5IKSB7XHJcbiAgICAvLyBjaGVjayBvbiBwYXJ0aWNsZSBraWxsIGNvbmRpdGlvbnNcclxuICAgIC8vIHNlZW1zIGNvbXBsaWNhdGVkICggbmVzdGVkIElGcyApIGJ1dCB0cmllcyB0byBzdG9wIGNoZWNrXHJcbiAgICAvLyB3aXRob3V0IGhhdmluZyB0byBtYWtlIGFsbCB0aGUgY2hlY2tzIGlmIGEgY29uZGl0aW9uIGlzIGhpdFxyXG4gICAgdmFyIGsgPSBwLmtpbGxDb25kaXRpb25zO1xyXG4gICAgdmFyIGtDb2wgPSBrLmNvbG9yQ2hlY2s7XHJcbiAgICB2YXIga0F0dHIgPSBrLnBlckF0dHJpYnV0ZTtcclxuICAgIHZhciBrQk8gPSBrLmJvdW5kYXJ5T2Zmc2V0O1xyXG5cclxuICAgIGlmIChrQ29sLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBmb3IgKHZhciBpID0ga0NvbC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICB2YXIgdGhpc0NoZWNrSXRlbSA9IGtDb2xbaV07XHJcbiAgICAgICAgICAgIGlmIChwLmNvbG9yNERhdGFbdGhpc0NoZWNrSXRlbS5uYW1lXSA8PSB0aGlzQ2hlY2tJdGVtLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoa0F0dHIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBrQXR0ci5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICB2YXIgdGhpc0NoZWNrSXRlbSA9IGtBdHRyW2ldO1xyXG4gICAgICAgICAgICBpZiAocFt0aGlzQ2hlY2tJdGVtLm5hbWVdIDw9IHRoaXNDaGVja0l0ZW0udmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChrLmJvdW5kYXJ5Q2hlY2sgPT09IHRydWUpIHtcclxuICAgICAgICAvLyBzdG9yZSBwLnIgYW5kIGdpdmUgYnVmZmVyICggKiA0ICkgdG8gYWNjb21vZGF0ZSBwb3NzaWJsZSB3YXJwaW5nXHJcbiAgICAgICAgdmFyIHBSYWQgPSBwLnIgKiA0O1xyXG4gICAgICAgIGlmIChwLnggLSBwUmFkIDwgMCAtIGtCTykge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocC54ICsgcFJhZCA+IGNhblcgKyBrQk8pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHAueSAtIHBSYWQgPCAwIC0ga0JPKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwLnkgKyBwUmFkID4gY2FuSCArIGtCTykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zID0gY2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zOyIsInZhciB0cmlnID0gcmVxdWlyZSgnLi8uLi90cmlnb25vbWljVXRpbHMuanMnKS50cmlnb25vbWljVXRpbHM7XHJcbnZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuLy4uL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxudmFyIGdldFZhbHVlID0gcmVxdWlyZSgnLi8uLi91dGlsaXRpZXMuanMnKS5nZXRWYWx1ZTtcclxuXHJcbnZhciBjcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMgPSBmdW5jdGlvbiBjcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMoeCwgeSwgZW1pc3Npb25PcHRzLCBwZXJQYXJ0aWNsZU9wdHMpIHtcclxuICAgIC8vIGxldCB0aGVtZWQgPSBwZXJQYXJ0aWNsZU9wdHMudGhlbWUgfHwgdGhlbWVzLnJlc2V0O1xyXG5cclxuICAgIHZhciB0aGVtZWQgPSBwZXJQYXJ0aWNsZU9wdHMgfHwgdGhlbWVzLnJlc2V0O1xyXG4gICAgdmFyIGVtaXRUaGVtZWQgPSBlbWlzc2lvbk9wdHMgfHwgZmFsc2U7XHJcbiAgICB2YXIgbGlmZSA9IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKHRoZW1lZC5saWZlLm1pbiwgdGhlbWVkLmxpZmUubWF4KTtcclxuICAgIC8vIHVzZSBiaXR3aXNlIHRvIGNoZWNrIGZvciBvZGQvZXZlbiBsaWZlIHZhbHMuIE1ha2UgZXZlbiB0byBoZWxwIHdpdGggYW5pbXMgdGhhdCBhcmUgZnJhY3Rpb24gb2YgbGlmZSAoZnJhbWVzKVxyXG4gICAgbGlmZSAmIDEgPyBsaWZlKysgOiBmYWxzZTtcclxuXHJcbiAgICB2YXIgZW1pc3Npb24gPSBlbWl0VGhlbWVkLmVtaXNzaW9uIHx8IGVtaXRUaGVtZWQ7XHJcblxyXG4gICAgdmFyIGRpcmVjdGlvbiA9IGVtaXNzaW9uLmRpcmVjdGlvbi5yYWQgPiAwID8gZW1pc3Npb24uZGlyZWN0aW9uLnJhZCA6IG1hdGhVdGlscy5nZXRSYW5kb21BcmJpdHJhcnkoZW1pc3Npb24uZGlyZWN0aW9uLm1pbiwgZW1pc3Npb24uZGlyZWN0aW9uLm1heCkgKiBNYXRoLlBJO1xyXG5cclxuICAgIC8vIHNldCBuZXcgcGFydGljbGUgb3JpZ2luIGRlcGVuZGFudCBvbiB0aGUgcmFkaWFsIGRpc3BsYWNlbWVudFxyXG4gICAgaWYgKGVtaXNzaW9uLnJhZGlhbERpc3BsYWNlbWVudCA+IDApIHtcclxuICAgICAgICB2YXIgbmV3Q29vcmRzID0gdHJpZy5yYWRpYWxEaXN0cmlidXRpb24oeCwgeSwgZW1pc3Npb24ucmFkaWFsRGlzcGxhY2VtZW50ICsgbWF0aFV0aWxzLnJhbmRvbShlbWlzc2lvbi5yYWRpYWxEaXNwbGFjZW1lbnRPZmZzZXQgKiAtMSwgZW1pc3Npb24ucmFkaWFsRGlzcGxhY2VtZW50T2Zmc2V0KSwgZGlyZWN0aW9uKTtcclxuXHJcbiAgICAgICAgeCA9IG5ld0Nvb3Jkcy54O1xyXG4gICAgICAgIHkgPSBuZXdDb29yZHMueTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaW1wdWxzZSA9IGVtaXNzaW9uLmltcHVsc2UucG93ID4gMCA/IGVtaXNzaW9uLmltcHVsc2UucG93IDogbWF0aFV0aWxzLnJhbmRvbShlbWlzc2lvbi5pbXB1bHNlLm1pbiwgZW1pc3Npb24uaW1wdWxzZS5tYXgpO1xyXG5cclxuICAgIHZhciBpbml0UiA9IG1hdGhVdGlscy5yYW5kb20odGhlbWVkLnJhZGl1cy5taW4sIHRoZW1lZC5yYWRpdXMubWF4KTtcclxuICAgIHZhciB0YXJnZXRSYWRpdXMgPSBtYXRoVXRpbHMucmFuZG9tKHRoZW1lZC50YXJnZXRSYWRpdXMubWluLCB0aGVtZWQudGFyZ2V0UmFkaXVzLm1heCk7XHJcbiAgICB2YXIgYWNjZWxlcmF0aW9uID0gbWF0aFV0aWxzLnJhbmRvbSh0aGVtZWQudmVsQWNjZWxlcmF0aW9uLm1pbiwgdGhlbWVkLnZlbEFjY2VsZXJhdGlvbi5tYXgpO1xyXG4gICAgdmFyIHZlbG9jaXRpZXMgPSB0cmlnLmNhbGN1bGF0ZVZlbG9jaXRpZXMoeCwgeSwgZGlyZWN0aW9uLCBpbXB1bHNlKTtcclxuXHJcbiAgICB2YXIgaW5pdENvbG9yID0gdGhlbWVkLmNvbG9yUHJvZmlsZXNbMF07XHJcbiAgICB2YXIgY29sb3I0RGF0YSA9IHtcclxuICAgICAgICByOiBpbml0Q29sb3IucixcclxuICAgICAgICBnOiBpbml0Q29sb3IuZyxcclxuICAgICAgICBiOiBpbml0Q29sb3IuYixcclxuICAgICAgICBhOiBpbml0Q29sb3IuYVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgd2lsbEZsYXJlID0gdm9pZCAwO1xyXG4gICAgdmFyIHdpbGxGbGFyZVRlbXAgPSBtYXRoVXRpbHMucmFuZG9tSW50ZWdlcigwLCAxMDAwKTtcclxuXHJcbiAgICB2YXIgdGVtcEN1c3RvbSA9IHtcclxuICAgICAgICBsZW5zRmxhcmU6IHtcclxuICAgICAgICAgICAgbWlnaHRGbGFyZTogdHJ1ZSxcclxuICAgICAgICAgICAgd2lsbEZsYXJlOiB0aGVtZWQuY3VzdG9tQXR0cmlidXRlcy5sZW5zRmxhcmUubWlnaHRGbGFyZSA9PT0gdHJ1ZSAmJiB3aWxsRmxhcmVUZW1wIDwgMSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICAgICAgYW5nbGU6IDAuMzBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGxldCBjdXN0b21BdHRyaWJ1dGVzID0gdGhlbWVkLmN1c3RvbUF0dHJpYnV0ZXM7XHJcblxyXG5cclxuICAgIH07XHJcblxyXG4gICAgdmFyIHBwYSA9IHtcclxuICAgICAgICBhY3RpdmU6IHBlclBhcnRpY2xlT3B0cy5hY3RpdmUgfHwgdGhlbWVkLmFjdGl2ZSB8fCAwLFxyXG4gICAgICAgIGluaXRSOiBpbml0UixcclxuICAgICAgICB0UjogdGFyZ2V0UmFkaXVzLFxyXG4gICAgICAgIGxpZmVTcGFuOiBsaWZlLFxyXG4gICAgICAgIGFuZ2xlOiBkaXJlY3Rpb24sXHJcbiAgICAgICAgbWFnbml0dWRlOiBpbXB1bHNlLFxyXG4gICAgICAgIHJlbGF0aXZlTWFnbml0dWRlOiBpbXB1bHNlLFxyXG4gICAgICAgIG1hZ25pdHVkZURlY2F5OiB0aGVtZWQubWFnRGVjYXksXHJcbiAgICAgICAgeDogeCxcclxuICAgICAgICB5OiB5LFxyXG4gICAgICAgIHhWZWw6IHZlbG9jaXRpZXMueFZlbCxcclxuICAgICAgICB5VmVsOiB2ZWxvY2l0aWVzLnlWZWwsXHJcbiAgICAgICAgdkFjYzogYWNjZWxlcmF0aW9uLFxyXG4gICAgICAgIGFwcGx5Rm9yY2VzOiB0aGVtZWQuYXBwbHlHbG9iYWxGb3JjZXMsXHJcbiAgICAgICAgY29sb3I0RGF0YToge1xyXG4gICAgICAgICAgICByOiBjb2xvcjREYXRhLnIsIGc6IGNvbG9yNERhdGEuZywgYjogY29sb3I0RGF0YS5iLCBhOiBjb2xvcjREYXRhLmFcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbG9yUHJvZmlsZXM6IHRoZW1lZC5jb2xvclByb2ZpbGVzLFxyXG5cclxuICAgICAgICAvLyBjb2xvcjRDaGFuZ2U6IGNvbG9yNENoYW5nZSxcclxuICAgICAgICBraWxsQ29uZGl0aW9uczogdGhlbWVkLmtpbGxDb25kaXRpb25zLFxyXG4gICAgICAgIGN1c3RvbUF0dHJpYnV0ZXM6IHRlbXBDdXN0b20sXHJcbiAgICAgICAgLy8gcmVuZGVyRk46IHRoZW1lZC5yZW5kZXJQYXJ0aWNsZSB8fCByZW5kZXJQYXJ0aWNsZSxcclxuICAgICAgICByZW5kZXJGTjogdGhlbWVkLnJlbmRlclBhcnRpY2xlLFxyXG4gICAgICAgIGV2ZW50czogdGhlbWVkLmV2ZW50c1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLy8gY29uc29sZS5sb2coICdjb2xvcjREYXRhRW5kOiAnLCBjb2xvcjREYXRhRW5kICk7XHJcbiAgICB2YXIgYW5pbUFyciA9IFtdO1xyXG4gICAgdmFyIHBhcnRpY2xlQW5pbVRyYWNrQXJyID0gdGhlbWVkLmFuaW1hdGlvblRyYWNrcztcclxuICAgIHZhciBzcGxDaHJzID0gJy4nO1xyXG4gICAgLy8gY29uc29sZS5sb2coICd0aGVtZWQuYW5pbWF0aW9uVHJhY2tzOiAnLCB0aGVtZWQuYW5pbWF0aW9uVHJhY2tzICk7XHJcbiAgICBpZiAocGFydGljbGVBbmltVHJhY2tBcnIgJiYgcGFydGljbGVBbmltVHJhY2tBcnIubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIHBhcnRpY2xlQW5pbVRyYWNrQXJyTGVuID0gcGFydGljbGVBbmltVHJhY2tBcnIubGVuZ3RoO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBwYXJ0aWNsZUFuaW1UcmFja0FyckxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdCA9IHBhcnRpY2xlQW5pbVRyYWNrQXJyW2ldO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ3Q6ICcsIHQgKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwcm0gPSB0LnBhcmFtLnNwbGl0KHNwbENocnMpO1xyXG4gICAgICAgICAgICB2YXIgcHJtVGVtcCA9IHsgcGF0aDogcHJtLCBwYXRoTGVuOiBwcm0ubGVuZ3RoIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgYmFzZVZhbCA9IGdldFZhbHVlKHQuYmFzZUFtb3VudCwgcHBhKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRWYWwgPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIGlmICh0LnRhcmdldFZhbHVlUGF0aCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChnZXRWYWx1ZSh0LnRhcmdldFZhbHVlUGF0aCwgcHBhKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFZhbCA9IGJhc2VWYWwgKiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VmFsID0gZ2V0VmFsdWUodC50YXJnZXRWYWx1ZVBhdGgsIHBwYSkgLSBiYXNlVmFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHQudGFyZ2V0QW1vdW50KSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRWYWwgPSB0LnRhcmdldEFtb3VudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGR1cmF0aW9uID0gdm9pZCAwO1xyXG4gICAgICAgICAgICB0LmR1cmF0aW9uID09PSAnbGlmZScgPyBkdXJhdGlvbiA9IGxpZmUgOiB0LmR1cmF0aW9uIDwgMSA/IGR1cmF0aW9uID0gbGlmZSAqIHQuZHVyYXRpb24gOiB0LmR1cmF0aW9uID4gMSA/IGR1cmF0aW9uID0gbGlmZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgYW5pbUFyci5wdXNoKHsgYW5pbU5hbWU6IHQuYW5pbU5hbWUsIGFjdGl2ZTogdC5hY3RpdmUsIHBhcmFtOiBwcm1UZW1wLCBiYXNlQW1vdW50OiBiYXNlVmFsLCB0YXJnZXRBbW91bnQ6IHRhcmdldFZhbCwgZHVyYXRpb246IGR1cmF0aW9uLCBlYXNpbmc6IHQuZWFzaW5nLCBsaW5rZWRBbmltOiB0LmxpbmtlZEFuaW0sIGxpbmtlZEV2ZW50OiB0LmxpbmtlZEV2ZW50IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcGEuYW5pbWF0aW9uVHJhY2tzID0gYW5pbUFycjtcclxuXHJcbiAgICByZXR1cm4gcHBhO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzID0gY3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzOyIsInZhciBraWxsUGFydGljbGUgPSBmdW5jdGlvbiBraWxsUGFydGljbGUobGlzdCwgaW5kZXgsIGVudGl0eUNvdW50ZXIpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYuaXNBbGl2ZSA9IDA7XHJcbiAgICBsaXN0Lmluc2VydChpbmRleCk7XHJcbiAgICBlbnRpdHlDb3VudGVyLnN1YnRyYWN0KDEpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMua2lsbFBhcnRpY2xlID0ga2lsbFBhcnRpY2xlOyIsInZhciByZW5kZXJQYXJ0aWNsZUFyciA9IGZ1bmN0aW9uIHJlbmRlclBhcnRpY2xlQXJyKGNvbnRleHQsIGFyciwgYW5pbWF0aW9uKSB7XHJcbiAgICB2YXIgdGhpc0FyciA9IGFycjtcclxuICAgIHZhciBhcnJMZW4gPSB0aGlzQXJyLmxlbmd0aDtcclxuXHJcbiAgICB2YXIgcmVuZGVyZWQgPSAwO1xyXG4gICAgdmFyIG5vdFJlbmRlcmVkID0gMDtcclxuICAgIC8vIGNvbnNvbGUubG9nKCAncmVuZGVyaW5nIGxvb3AnICk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IGFyckxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgdmFyIHAgPSB0aGlzQXJyW2ldO1xyXG4gICAgICAgIHAuaXNBbGl2ZSAhPSAwID8gKHAucmVuZGVyKHAueCwgcC55LCBwLnIsIHAuY29sb3I0RGF0YSwgY29udGV4dCksIHJlbmRlcmVkKyspIDogbm90UmVuZGVyZWQrKztcclxuICAgIH1cclxuICAgIC8vIGNvbnNvbGUubG9nKCAncmVuZGVyZWQ6ICcrcmVuZGVyZWQrJyBub3RSZW5kZXJlZDogJytub3RSZW5kZXJlZCApO1xyXG4gICAgLy8gbm90UmVuZGVyZWQgPT09IGFyckxlbiA/XHJcbiAgICAvLyAoIGNvbnNvbGUubG9nKCAnbm90UmVuZGVyZWQgPT09IDA6IHN0b3AgYW5pbScgKSwgYW5pbWF0aW9uLnN0YXRlID0gZmFsc2UgKSA6IDA7XHJcbiAgICBub3RSZW5kZXJlZCA9PT0gYXJyTGVuID8gYW5pbWF0aW9uLnN0YXRlID0gZmFsc2UgOiAwO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMucmVuZGVyUGFydGljbGVBcnIgPSByZW5kZXJQYXJ0aWNsZUFycjsiLCJ2YXIgZWFzaW5nID0gcmVxdWlyZSgnLi8uLi9lYXNpbmcuanMnKS5lYXNpbmdFcXVhdGlvbnM7XHJcbnZhciBlbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vLi4vZW52aXJvbm1lbnQuanMnKS5lbnZpcm9ubWVudDtcclxudmFyIHBoeXNpY3MgPSBlbnZpcm9ubWVudC5mb3JjZXM7XHJcblxyXG52YXIgdXBkYXRlUGFydGljbGUgPSBmdW5jdGlvbiB1cGRhdGVQYXJ0aWNsZShlbWl0dGVyQXJyKSB7XHJcbiAgICB2YXIgcCA9IHRoaXM7XHJcbiAgICB2YXIgdG90YWxMaWZlVGlja3MgPSBwLmxpZmVTcGFuO1xyXG5cclxuICAgIC8vIHBvc2l0aW9uXHJcbiAgICAvLyBwLnggKz0gcC54VmVsICogcC5tYWduaXR1ZGVEZWNheTtcclxuICAgIC8vIHAueSArPSBwLnlWZWwgKiBwLm1hZ25pdHVkZURlY2F5O1xyXG4gICAgcC54ICs9IHAueFZlbDtcclxuICAgIHAueSArPSBwLnlWZWw7XHJcblxyXG4gICAgcC54VmVsICo9IHAudkFjYztcclxuICAgIHAueVZlbCAqPSBwLnZBY2M7XHJcblxyXG4gICAgLy8gcC55VmVsICs9IHBoeXNpY3MuZ3Jhdml0eTtcclxuICAgIC8vIHAueFZlbCArPSBwaHlzaWNzLndpbmQ7XHJcbiAgICAvLyBwLnJlbGF0aXZlTWFnbml0dWRlICo9IHAubWFnbml0dWRlRGVjYXk7XHJcblxyXG4gICAgcC5yZWxhdGl2ZU1hZ25pdHVkZSAqPSBwLnZBY2MgKiAxLjAwNTtcclxuXHJcbiAgICBpZiAocC5hcHBseUZvcmNlcykge1xyXG4gICAgICAgIHAueVZlbCArPSBwaHlzaWNzLmdyYXZpdHk7XHJcbiAgICB9XHJcbiAgICAvLyBzcGVlZFxyXG4gICAgLy8gcC5tYWduaXR1ZGVEZWNheSA+IDAgPyBwLm1hZ25pdHVkZURlY2F5IC09IHBoeXNpY3MuZnJpY3Rpb24gOiBwLm1hZ25pdHVkZURlY2F5ID0gMDtcclxuXHJcbiAgICAvLyBwLm1hZ25pdHVkZURlY2F5ICs9IChwLnZBY2MgKiAwLjAwMDI1KTtcclxuICAgIC8vIHAubWFnbml0dWRlRGVjYXkgPSBkZWNjZWxlcmF0ZU1hZ25pdHVkZSggcCApO1xyXG4gICAgLy8gcC5tYWduaXR1ZGVEZWNheSA9IGFjY2VsZXJhdGVNYWduaXR1ZGUoIHAgKTtcclxuXHJcbiAgICAvLyBsaWZlXHJcbiAgICBwLmN1cnJMaWZlSW52ID0gdG90YWxMaWZlVGlja3MgLSBwLmN1cnJMaWZlO1xyXG4gICAgdmFyIGN1cnJMaWZlVGljayA9IHAuY3VyckxpZmVJbnY7XHJcbiAgICAvLyBzaXplIChyYWRpdXMgZm9yIGNpcmNsZSlcclxuXHJcblxyXG4gICAgdmFyIGFuaW1UcmFja3MgPSBwLmFuaW1hdGlvblRyYWNrcztcclxuICAgIHZhciBhbmltVHJhY2tzTGVuID0gYW5pbVRyYWNrcy5sZW5ndGg7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IGFuaW1UcmFja3NMZW4gLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnaScsIGkgKTtcclxuICAgICAgICB2YXIgdCA9IGFuaW1UcmFja3NbaV07XHJcblxyXG4gICAgICAgIGlmICh0LmFjdGl2ZSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHBhcmFtUGF0aCA9IHQucGFyYW0ucGF0aCxcclxuICAgICAgICAgICAgICAgIHBhcmFtTGVuID0gdC5wYXJhbS5wYXRoTGVuO1xyXG5cclxuICAgICAgICAgICAgcGFyYW1MZW4gPT09IDEgPyBwW3BhcmFtUGF0aFswXV0gPSBlYXNpbmdbdC5lYXNpbmddKGN1cnJMaWZlVGljaywgdC5iYXNlQW1vdW50LCB0LnRhcmdldEFtb3VudCwgdC5kdXJhdGlvbikgOiBwYXJhbUxlbiA9PT0gMiA/IHBbcGFyYW1QYXRoWzBdXVtwYXJhbVBhdGhbMV1dID0gZWFzaW5nW3QuZWFzaW5nXShjdXJyTGlmZVRpY2ssIHQuYmFzZUFtb3VudCwgdC50YXJnZXRBbW91bnQsIHQuZHVyYXRpb24pIDogcGFyYW1MZW4gPT09IDMgPyBwW3BhcmFtUGF0aFswXV1bcGFyYW1QYXRoWzFdXVtwYXJhbVBhdGhbMl1dID0gZWFzaW5nW3QuZWFzaW5nXShjdXJyTGlmZVRpY2ssIHQuYmFzZUFtb3VudCwgdC50YXJnZXRBbW91bnQsIHQuZHVyYXRpb24pIDogZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VyckxpZmVUaWNrID09PSB0LmR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0LmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0LmxpbmtlZEV2ZW50ICE9PSBmYWxzZSAmJiB0eXBlb2YgdC5saW5rZWRFdmVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcnRpY2xlRXZlbnRzID0gcC5ldmVudHM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBwYXJ0aWNsZUV2ZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNQYXJ0aWNsZUV2ZW50ID0gcC5ldmVudHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzUGFydGljbGVFdmVudC5ldmVudFR5cGUgPSB0LmxpbmtlZEV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodC5saW5rZWRFdmVudCA9PT0gJ2VtaXQnKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzUGFydGljbGVFdmVudFBhcmFtcyA9IHRoaXNQYXJ0aWNsZUV2ZW50LmV2ZW50UGFyYW1zO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNQYXJ0aWNsZUV2ZW50UGFyYW1zLmVtaXR0ZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNQYXJ0aWNsZUV2ZW50UGFyYW1zLmVtaXR0ZXIudHJpZ2dlckVtaXR0ZXIoeyB4OiBwLngsIHk6IHAueSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gZW1pdHRlckFyci5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtaXR0ZXJBcnJbal0ubmFtZSA9PT0gdGhpc1BhcnRpY2xlRXZlbnRQYXJhbXMuZW1pdHRlck5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzUGFydGljbGVFdmVudFBhcmFtcy5lbWl0dGVyID0gZW1pdHRlckFycltqXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzUGFydGljbGVFdmVudFBhcmFtcy5lbWl0dGVyLnRyaWdnZXJFbWl0dGVyKHsgeDogcC54LCB5OiBwLnkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHAuaWR4ID09IDk5ODcpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLndhcm4oICdmbGlwcGluZyBhbmltJyApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0LmxpbmtlZEFuaW0gIT09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSBhbmltVHJhY2tzTGVuIC0gMTsgaiA+PSAwOyBqLS0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1UcmFja3Nbal0uYW5pbU5hbWUgPT09IHQubGlua2VkQW5pbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVRyYWNrc1tqXS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChwLmlkeCA9PSA5OTg3KSB7fVxyXG4gICAgLy8gY29uc29sZS5sb2coICd0aGlzUGFydGljbGVBbHBoYScsICBwLmNvbG9yNERhdGEuYSApO1xyXG5cclxuXHJcbiAgICAvLyBsaWZlIHRha2V0aCBhd2F5XHJcbiAgICBwLmN1cnJMaWZlLS07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy51cGRhdGVQYXJ0aWNsZSA9IHVwZGF0ZVBhcnRpY2xlOyIsInZhciBwYXJ0aWNsZUZuID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZUZuLmpzJykucGFydGljbGVGbjtcclxuXHJcbnZhciB1cGRhdGVQYXJ0aWNsZUFyciA9IGZ1bmN0aW9uIHVwZGF0ZVBhcnRpY2xlQXJyKGNvbnRleHQsIHN0b3JlQXJyLCBwb29sQXJyLCBhbmltYXRpb24sIGNhbnZhc0NvbmZpZywgZW50aXR5Q291bnRlciwgZW1pdHRlclN0b3JlKSB7XHJcbiAgICAvLyBsb29wIGhvdXNla2VlcGluZ1xyXG4gICAgdmFyIGFyciA9IHN0b3JlQXJyO1xyXG4gICAgdmFyIGFyckxlbiA9IGFyci5sZW5ndGggLSAxO1xyXG4gICAgZm9yICh2YXIgaSA9IGFyckxlbjsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICB2YXIgcCA9IGFycltpXTtcclxuICAgICAgICBwLmlzQWxpdmUgIT0gMCA/IHBhcnRpY2xlRm4uY2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zKHAsIGNhbnZhc0NvbmZpZy53aWR0aCwgY2FudmFzQ29uZmlnLmhlaWdodCkgPyBwLmtpbGwocG9vbEFyciwgcC5pZHgsIGVudGl0eUNvdW50ZXIpIDogcC51cGRhdGUoZW1pdHRlclN0b3JlKSA6IGZhbHNlO1xyXG4gICAgfSAvLyBlbmQgRm9yIGxvb3BcclxuICAgIC8vIGxpdmVFbnRpdHlDb3VudCA9PT0gMCA/ICggY29uc29sZS5sb2coICdsaXZlRW50aXR5Q291bnQgPT09IDAgc3RvcCBhbmltJyApLCBhbmltYXRpb24uc3RhdGUgPSBmYWxzZSApIDogMDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnVwZGF0ZVBhcnRpY2xlQXJyID0gdXBkYXRlUGFydGljbGVBcnI7IiwidmFyIGZpcmVUaGVtZSA9IHJlcXVpcmUoJy4vdGhlbWVzL2ZpcmUvdGhlbWUuanMnKS5maXJlVGhlbWU7XHJcbnZhciByZXNldFRoZW1lID0gcmVxdWlyZSgnLi90aGVtZXMvcmVzZXQvcmVzZXRUaGVtZS5qcycpLnJlc2V0VGhlbWU7XHJcbnZhciB3YXJwU3RhclRoZW1lID0gcmVxdWlyZSgnLi90aGVtZXMvd2FycFN0YXIvd2FycFN0YXJUaGVtZS5qcycpLndhcnBTdGFyVGhlbWU7XHJcbnZhciBmbGFtZVRoZW1lID0gcmVxdWlyZSgnLi90aGVtZXMvZmxhbWUvZmxhbWVUaGVtZS5qcycpLmZsYW1lVGhlbWU7XHJcbnZhciBzbW9rZVRoZW1lID0gcmVxdWlyZSgnLi90aGVtZXMvc21va2Uvc21va2VUaGVtZS5qcycpLnNtb2tlVGhlbWU7XHJcblxyXG52YXIgdGhlbWVzID0ge1xyXG4gICByZXNldDogcmVzZXRUaGVtZSxcclxuICAgZmlyZTogZmlyZVRoZW1lLFxyXG4gICB3YXJwU3Rhcjogd2FycFN0YXJUaGVtZSxcclxuICAgZmxhbWU6IGZsYW1lVGhlbWUsXHJcbiAgIHNtb2tlOiBzbW9rZVRoZW1lXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy50aGVtZXMgPSB0aGVtZXM7IiwidmFyIGFuaW1hdGlvblRyYWNrcyA9IFtcclxuXHR7XHJcblx0XHQgIGFuaW1OYW1lOiAncmFkaXVzRmFkZScsXHJcblx0XHQgIGFjdGl2ZTogdHJ1ZSxcclxuXHRcdCAgcGFyYW06ICdyJyxcclxuXHRcdCAgYmFzZUFtb3VudDogJ2luaXRSJyxcclxuXHRcdCAgdGFyZ2V0VmFsdWVQYXRoOiAndFInLFxyXG5cdFx0ICAvLyB0YXJnZXRBbW91bnQ6IDAuMDAwMDIsXHJcblx0XHQgIGR1cmF0aW9uOiAnbGlmZScsXHJcblx0XHQgIGVhc2luZzogJ2Vhc2VJbkV4cG8nLFxyXG5cdFx0ICBsaW5rZWRBbmltOiBmYWxzZVxyXG5cdH0sXHJcblx0e1xyXG5cdFx0ICBhbmltTmFtZTogJ2NvbG9yNERhdGFDaGFuZ2VSZWQnLFxyXG5cdFx0ICBhY3RpdmU6IHRydWUsXHJcblx0XHQgIHBhcmFtOiAnY29sb3I0RGF0YS5yJyxcclxuXHRcdCAgYmFzZUFtb3VudDogJ2NvbG9yUHJvZmlsZXNbMF0ucicsXHJcblx0XHQgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbMV0ucicsXHJcblx0XHQgIGR1cmF0aW9uOiAnbGlmZScsXHJcblx0XHQgIGVhc2luZzogJ2Vhc2VJbk91dEJvdW5jZScsXHJcblx0XHQgIGxpbmtlZEFuaW06IGZhbHNlXHJcblx0fSxcclxuXHR7XHJcblx0XHQgIGFuaW1OYW1lOiAnY29sb3I0RGF0YUNoYW5nZUdyZWVuJyxcclxuXHRcdCAgYWN0aXZlOiB0cnVlLFxyXG5cdFx0ICBwYXJhbTogJ2NvbG9yNERhdGEuZycsXHJcblx0XHQgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmcnLFxyXG5cdFx0ICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmcnLFxyXG5cdFx0ICBkdXJhdGlvbjogJ2xpZmUnLFxyXG5cdFx0ICBlYXNpbmc6ICdlYXNlSW5PdXRCb3VuY2UnLFxyXG5cdFx0ICBsaW5rZWRBbmltOiBmYWxzZVxyXG5cdH0sXHJcblx0e1xyXG5cdFx0ICBhbmltTmFtZTogJ2NvbG9yNERhdGFDaGFuZ2VCbHVlJyxcclxuXHRcdCAgYWN0aXZlOiB0cnVlLFxyXG5cdFx0ICBwYXJhbTogJ2NvbG9yNERhdGEuYicsXHJcblx0XHQgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmInLFxyXG5cdFx0ICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmInLFxyXG5cdFx0ICBkdXJhdGlvbjogJ2xpZmUnLFxyXG5cdFx0ICBlYXNpbmc6ICdlYXNlT3V0RXhwbycsXHJcblx0XHQgIGxpbmtlZEFuaW06IGZhbHNlXHJcblx0fSxcclxuXHR7XHJcblx0XHQgIGFuaW1OYW1lOiAnY29sb3I0RGF0YUNoYW5nZUFscGhhJyxcclxuXHRcdCAgYWN0aXZlOiB0cnVlLFxyXG5cdFx0ICBwYXJhbTogJ2NvbG9yNERhdGEuYScsXHJcblx0XHQgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmEnLFxyXG5cdFx0ICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzNdLmEnLFxyXG5cdFx0ICBkdXJhdGlvbjogJ2xpZmUnLFxyXG5cdFx0ICBlYXNpbmc6ICdlYXNlSW5RdWludCcsXHJcblx0XHQgIGxpbmtlZEFuaW06IGZhbHNlXHJcblx0fVxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMuYW5pbWF0aW9uVHJhY2tzID0gYW5pbWF0aW9uVHJhY2tzOyIsInZhciBjdXN0b21BdHRyaWJ1dGVzID0ge1xyXG4gICAgbGVuc0ZsYXJlOiB7XHJcbiAgICAgICAgbWlnaHRGbGFyZTogdHJ1ZSxcclxuICAgICAgICB3aWxsRmxhcmU6IGZhbHNlLFxyXG4gICAgICAgIGFuZ2xlOiAwLjMwXHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jdXN0b21BdHRyaWJ1dGVzID0gY3VzdG9tQXR0cmlidXRlczsiLCJ2YXIga2lsbENvbmRpdGlvbnMgPSB7XHJcbiAgICBib3VuZGFyeUNoZWNrOiB0cnVlLFxyXG4gICAgYm91bmRhcnlPZmZzZXQ6IDAsXHJcbiAgICBjb2xvckNoZWNrOiBbeyBuYW1lOiAnYScsIHZhbHVlOiAwIH1dLFxyXG4gICAgcGVyQXR0cmlidXRlOiBbeyBuYW1lOiAncmFkaXVzJywgdmFsdWU6IDAgfSwgeyBuYW1lOiAnY3VyckxpZmUnLCB2YWx1ZTogMCB9XVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMua2lsbENvbmRpdGlvbnMgPSBraWxsQ29uZGl0aW9uczsiLCIvLyB1dGlsaXRpZXNcclxudmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG52YXIgdHJpZyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzO1xyXG5cclxudmFyIHJlbmRlckZuID0gZnVuY3Rpb24gcmVuZGVyRm4oeCwgeSwgciwgY29sb3JEYXRhLCBjb250ZXh0KSB7XHJcbiAgICB2YXIgcCA9IHRoaXM7XHJcbiAgICAvLyBjb25zb2xlLmxvZyggJ3AucmVuZGVyOiAnLCBwICk7XHJcbiAgICB2YXIgbmV3QW5nbGUgPSB0cmlnLmdldEFuZ2xlQW5kRGlzdGFuY2UoeCwgeSwgeCArIHAueFZlbCwgeSArIHAueVZlbCk7XHJcbiAgICB2YXIgY29tcGlsZWRDb2xvciA9IFwicmdiYShcIiArIGNvbG9yRGF0YS5yICsgJywnICsgY29sb3JEYXRhLmcgKyAnLCcgKyBjb2xvckRhdGEuYiArIFwiLFwiICsgY29sb3JEYXRhLmEgKyBcIilcIjtcclxuICAgIHZhciBlbmRDb2xvciA9IFwicmdiYShcIiArIGNvbG9yRGF0YS5yICsgJywnICsgY29sb3JEYXRhLmcgKyAnLCcgKyBjb2xvckRhdGEuYiArIFwiLCAwKVwiO1xyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBjb21waWxlZENvbG9yO1xyXG4gICAgdmFyIHN0cmV0Y2hWYWwgPSBtYXRoVXRpbHMubWFwKHAucmVsYXRpdmVNYWduaXR1ZGUsIDAsIDEwMCwgMSwgMTApO1xyXG5cclxuICAgIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XHJcbiAgICAvLyBjb250ZXh0LnJvdGF0ZSggcC5hbmdsZSApO1xyXG4gICAgY29udGV4dC5yb3RhdGUobmV3QW5nbGUuYW5nbGUpO1xyXG4gICAgY29udGV4dC5maWxsRWxsaXBzZSgwLCAwLCByICogc3RyZXRjaFZhbCwgciwgY29udGV4dCk7XHJcbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnJlbmRlckZuID0gcmVuZGVyRm47IiwiLy8gdXRpbGl0aWVzXHJcbnZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuLy4uLy4uLy4uL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxuXHJcbi8vIHRoZW1lIHBhcnRpYWxzXHJcbnZhciBhbmltYXRpb25UcmFja3MgPSByZXF1aXJlKCcuL2FuaW1hdGlvblRyYWNrcy5qcycpLmFuaW1hdGlvblRyYWNrcztcclxudmFyIGtpbGxDb25kaXRpb25zID0gcmVxdWlyZSgnLi9raWxsQ29uZGl0aW9ucy5qcycpLmtpbGxDb25kaXRpb25zO1xyXG52YXIgY3VzdG9tQXR0cmlidXRlcyA9IHJlcXVpcmUoJy4vY3VzdG9tQXR0cmlidXRlcy5qcycpLmN1c3RvbUF0dHJpYnV0ZXM7XHJcbnZhciByZW5kZXJGbiA9IHJlcXVpcmUoJy4vcmVuZGVyRm4uanMnKS5yZW5kZXJGbjtcclxuXHJcbnZhciBmaXJlVGhlbWUgPSB7XHJcbiAgICBjb250ZXh0QmxlbmRpbmdNb2RlOiAnbGlnaHRlcicsXHJcbiAgICBhY3RpdmU6IDEsXHJcbiAgICBsaWZlOiB7IG1pbjogMjAsIG1heDogMTAwIH0sXHJcbiAgICBhbmdsZTogeyBtaW46IDAsIG1heDogMiB9LFxyXG4gICAgbWFnRGVjYXk6IDEsXHJcbiAgICAvLyB2ZWxBY2NlbGVyYXRpb246IDAuOSxcclxuICAgIHZlbEFjY2VsZXJhdGlvbjogeyBtaW46IDAuNywgbWF4OiAwLjg1IH0sXHJcbiAgICByYWRpdXM6IHsgbWluOiAwLjUsIG1heDogMjAgfSxcclxuICAgIHRhcmdldFJhZGl1czogeyBtaW46IDAsIG1heDogMCB9LFxyXG4gICAgYXBwbHlHbG9iYWxGb3JjZXM6IHRydWUsXHJcbiAgICBjb2xvclByb2ZpbGVzOiBbeyByOiAyNTUsIGc6IDI1NSwgYjogMjU1LCBhOiAxIH0sIHsgcjogMjE1LCBnOiAwLCBiOiAwLCBhOiAwIH0sIHsgcjogMCwgZzogMjE1LCBiOiAwLCBhOiAwIH0sIHsgcjogMCwgZzogMCwgYjogMjE1LCBhOiAwIH1dLFxyXG4gICAgcmVuZGVyUHJvZmlsZXM6IFt7IHNoYXBlOiAnQ2lyY2xlJywgY29sb3JQcm9maWxlSWR4OiAwIH1dLFxyXG4gICAgY3VzdG9tQXR0cmlidXRlczogY3VzdG9tQXR0cmlidXRlcyxcclxuICAgIGFuaW1hdGlvblRyYWNrczogYW5pbWF0aW9uVHJhY2tzLFxyXG4gICAga2lsbENvbmRpdGlvbnM6IGtpbGxDb25kaXRpb25zLFxyXG4gICAgcmVuZGVyUGFydGljbGU6IHJlbmRlckZuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5maXJlVGhlbWUgPSBmaXJlVGhlbWU7IiwidmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG52YXIgY29sb3JpbmcgPSByZXF1aXJlKCcuLy4uLy4uLy4uL2NvbG9yVXRpbHMuanMnKS5jb2xvclV0aWxzO1xyXG52YXIgdHJpZyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzO1xyXG5cclxudmFyIHJnYmEgPSBjb2xvcmluZy5yZ2JhO1xyXG5cclxudmFyIGZsYW1lVGhlbWUgPSB7XHJcbiAgICBjb250ZXh0QmxlbmRpbmdNb2RlOiAnbGlnaHRlcicsXHJcbiAgICBhY3RpdmU6IDEsXHJcbiAgICBsaWZlOiB7IG1pbjogMjAsIG1heDogNDAgfSxcclxuICAgIGFuZ2xlOiB7IG1pbjogMS40NSwgbWF4OiAxLjU1IH0sXHJcbiAgICAvLyBtYWc6IHsgbWluOiA4LCBtYXg6IDEzIH0sXHJcbiAgICAvLyB2ZWxBY2NlbGVyYXRpb246IDEuMDUsXHJcbiAgICB2ZWxBY2NlbGVyYXRpb246IHsgbWluOiAxLCBtYXg6IDEgfSxcclxuICAgIG1hZ0RlY2F5OiAxLjUsXHJcbiAgICByYWRpdXM6IHsgbWluOiA3MCwgbWF4OiAxMzAgfSxcclxuICAgIHRhcmdldFJhZGl1czogeyBtaW46IDEsIG1heDogMiB9LFxyXG4gICAgYXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlLFxyXG4gICAgY29sb3JQcm9maWxlczogW3sgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMC41IH0sIHsgcjogMjU1LCBnOiAwLCBiOiAwLCBhOiAxIH1dLFxyXG4gICAgcmVuZGVyUHJvZmlsZXM6IFt7IHNoYXBlRm46ICdmaWxsQ2lyY2xlJywgY29sb3JQcm9maWxlSWR4OiAwIH1dLFxyXG4gICAgY3VzdG9tQXR0cmlidXRlczoge1xyXG4gICAgICAgIGxlbnNGbGFyZToge1xyXG4gICAgICAgICAgICBtaWdodEZsYXJlOiB0cnVlLFxyXG4gICAgICAgICAgICB3aWxsRmxhcmU6IGZhbHNlLFxyXG4gICAgICAgICAgICBhbmdsZTogMC4zMFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwcm94aW1pdHk6IHtcclxuICAgICAgICBjaGVjazogZmFsc2UsXHJcbiAgICAgICAgdGhyZXNob2xkOiA1MFxyXG4gICAgfSxcclxuICAgIGFuaW1hdGlvblRyYWNrczogW3tcclxuICAgICAgICBhbmltTmFtZTogJ3JhZGl1c0ZhZGUnLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBwYXJhbTogJ3InLFxyXG4gICAgICAgIGJhc2VBbW91bnQ6ICdpbml0UicsXHJcbiAgICAgICAgdGFyZ2V0VmFsdWVQYXRoOiAndFInLFxyXG4gICAgICAgIGR1cmF0aW9uOiAnbGlmZScsXHJcbiAgICAgICAgZWFzaW5nOiAnZWFzZUluRXhwbycsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgIH0sIHtcclxuICAgICAgICBhbmltTmFtZTogJ2NvbG9yNERhdGFDaGFuZ2VHcmVlbicsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5nJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5nJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmcnLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjQsXHJcbiAgICAgICAgZWFzaW5nOiAnZWFzZUluUXVhcnQnLFxyXG4gICAgICAgIGxpbmtlZEFuaW06IGZhbHNlXHJcbiAgICB9LCB7XHJcbiAgICAgICAgYW5pbU5hbWU6ICdjb2xvcjREYXRhQ2hhbmdlQmx1ZScsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5iJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5iJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmInLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjUsXHJcbiAgICAgICAgZWFzaW5nOiAnZWFzZU91dFF1YXJ0JyxcclxuICAgICAgICBsaW5rZWRBbmltOiBmYWxzZVxyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnYWxwaGFEZWxheScsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5hJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5hJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzBdLmEnLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjUsXHJcbiAgICAgICAgZWFzaW5nOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgbGlua2VkQW5pbTogJ2FscGhhRmFkZUluJ1xyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnYWxwaGFGYWRlSW4nLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBwYXJhbTogJ2NvbG9yNERhdGEuYScsXHJcbiAgICAgICAgYmFzZUFtb3VudDogJ2NvbG9yUHJvZmlsZXNbMF0uYScsXHJcbiAgICAgICAgdGFyZ2V0VmFsdWVQYXRoOiAnY29sb3JQcm9maWxlc1sxXS5hJyxcclxuICAgICAgICBkdXJhdGlvbjogMC4yLFxyXG4gICAgICAgIGVhc2luZzogJ2Vhc2VJblF1aW50JyxcclxuICAgICAgICBsaW5rZWRBbmltOiAnYWxwaGFGYWRlT3V0J1xyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnYWxwaGFGYWRlT3V0JyxcclxuICAgICAgICBhY3RpdmU6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5hJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1sxXS5hJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzBdLmEnLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjMsXHJcbiAgICAgICAgZWFzaW5nOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2UsXHJcbiAgICAgICAgbGlua2VkRXZlbnQ6ICdlbWl0J1xyXG4gICAgfV0sXHJcblxyXG4gICAgZXZlbnRzOiBbe1xyXG4gICAgICAgIGV2ZW50VHlwZTogJ2VtaXQnLFxyXG4gICAgICAgIGV2ZW50UGFyYW1zOiB7XHJcbiAgICAgICAgICAgIGVtaXR0ZXJOYW1lOiAnc21va2VFbWl0dGVyJ1xyXG4gICAgICAgIH1cclxuICAgIH1dLFxyXG5cclxuICAgIGtpbGxDb25kaXRpb25zOiB7XHJcbiAgICAgICAgYm91bmRhcnlDaGVjazogdHJ1ZSxcclxuICAgICAgICBib3VuZGFyeU9mZnNldDogMCxcclxuICAgICAgICBjb2xvckNoZWNrOiBbXSxcclxuICAgICAgICBwZXJBdHRyaWJ1dGU6IFt7IG5hbWU6ICdyYWRpdXMnLCB2YWx1ZTogMCB9LCB7IG5hbWU6ICdjdXJyTGlmZScsIHZhbHVlOiAwIH1dLFxyXG4gICAgICAgIGxpbmtlZEV2ZW50OiBmYWxzZVxyXG4gICAgfSxcclxuICAgIHJlbmRlclBhcnRpY2xlOiBmdW5jdGlvbiByZW5kZXJQYXJ0aWNsZSh4LCB5LCByLCBjb2xvckRhdGEsIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgcCA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHN0cmV0Y2hWYWwgPSBtYXRoVXRpbHMubWFwKHAuY3VyckxpZmVJbnYsIDAsIHAubGlmZVNwYW4sIDEsIDUpO1xyXG4gICAgICAgIHZhciBvZmZzZXRNYXAgPSBtYXRoVXRpbHMubWFwKHAuY3VyckxpZmVJbnYsIDAsIHAubGlmZVNwYW4sIDAsIDEpO1xyXG4gICAgICAgIHZhciBuZXdBbmdsZSA9IHRyaWcuZ2V0QW5nbGVBbmREaXN0YW5jZSh4LCB5LCB4ICsgcC54VmVsLCB5ICsgcC55VmVsKTtcclxuICAgICAgICBpZiAoY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gIT09ICdsaWdodGVyJykge1xyXG4gICAgICAgICAgICBjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdsaWdodGVyJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XHJcbiAgICAgICAgLy8gY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgdmFyIGFscGhhID0gY29sb3JEYXRhLmE7XHJcbiAgICAgICAgaWYgKGFscGhhID4gMSkge1xyXG4gICAgICAgICAgICBhbHBoYSA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBvZmZzZXQgPSByICogb2Zmc2V0TWFwO1xyXG4gICAgICAgIC8vIC8vIHZhciBvZmZzZXQgPSAwO1xyXG4gICAgICAgIHZhciBncmQgPSBjb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KDAsIDAgKyBvZmZzZXQsIDAsIDAsIDAgKyBvZmZzZXQsIHIpO1xyXG4gICAgICAgIC8vIHZhciBncmQgPSBjb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgsIHksIDAsIHgsIHksIHIpO1xyXG4gICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMCwgcmdiYShjb2xvckRhdGEuciwgY29sb3JEYXRhLmcsIGNvbG9yRGF0YS5iLCAwLjAzICogYWxwaGEpKTtcclxuICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAuNSwgcmdiYShjb2xvckRhdGEuciwgY29sb3JEYXRhLmcsIGNvbG9yRGF0YS5iLCAwLjA2ICogYWxwaGEpKTtcclxuICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAuNywgcmdiYShjb2xvckRhdGEuciwgY29sb3JEYXRhLmcsIGNvbG9yRGF0YS5iLCAwLjA2NSAqIGFscGhhKSk7XHJcbiAgICAgICAgZ3JkLmFkZENvbG9yU3RvcCgwLjg1LCByZ2JhKGNvbG9yRGF0YS5yLCBjb2xvckRhdGEuZywgY29sb3JEYXRhLmIsIDAuMDE1ICogYWxwaGEpKTtcclxuICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDEsIHJnYmEoY29sb3JEYXRhLnIsIGNvbG9yRGF0YS5nLCBjb2xvckRhdGEuYiwgMCkpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JkO1xyXG5cclxuICAgICAgICBjb250ZXh0LnJvdGF0ZShuZXdBbmdsZS5hbmdsZSk7XHJcbiAgICAgICAgY29udGV4dC5maWxsRWxsaXBzZSgwLCAwLCByICogc3RyZXRjaFZhbCwgciwgY29udGV4dCk7XHJcbiAgICAgICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5mbGFtZVRoZW1lID0gZmxhbWVUaGVtZTsiLCJ2YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcblxyXG52YXIgcmVzZXRUaGVtZSA9IHtcclxuICAgIGVtbWlzaW9uUmF0ZTogeyBtaW46IDAsIG1heDogMCB9LFxyXG4gICAgY29udGV4dEJsZW5kaW5nTW9kZTogJ3NvdXJjZS1vdmVyJyxcclxuICAgIGFjdGl2ZTogMCxcclxuICAgIGxpZmU6IHsgbWluOiAwLCBtYXg6IDAgfSxcclxuICAgIGFuZ2xlOiB7IG1pbjogMCwgbWF4OiAwIH0sXHJcbiAgICBtYWc6IHsgbWluOiAwLCBtYXg6IDAgfSxcclxuICAgIG1hZ0RlY2F5OiAwLFxyXG4gICAgLy8gdmVsQWNjZWxlcmF0aW9uOiAxLCAvLyAwIC0gMSAoaS5lLiAwLjUpID0gZGVjY2VsZXJhdGlvbiwgMSsgKGkuZS4gMS4yKSA9IGFjY2VsZXJhdGlvblxyXG4gICAgdmVsQWNjZWxlcmF0aW9uOiB7IG1pbjogMSwgbWF4OiAxIH0sXHJcbiAgICByYWRpdXM6IHsgbWluOiAwLCBtYXg6IDAgfSxcclxuICAgIHRhcmdldFJhZGl1czogeyBtaW46IDAsIG1heDogMCB9LFxyXG4gICAgc2hyaW5rUmF0ZTogMCxcclxuICAgIHJhZGlhbERpc3BsYWNlbWVudDogMCxcclxuICAgIHJhZGlhbERpc3BsYWNlbWVudE9mZnNldDogMCxcclxuICAgIGFwcGx5R2xvYmFsRm9yY2VzOiBmYWxzZSxcclxuICAgIGNvbG9yUHJvZmlsZXM6IFt7IHI6IDAsIGc6IDAsIGI6IDAsIGE6IDAgfV0sXHJcbiAgICByZW5kZXJQcm9maWxlczogW3sgc2hhcGU6ICdDaXJjbGUnLCBjb2xvclByb2ZpbGVJZHg6IDAgfV0sXHJcbiAgICBjb2xvclN0YXJ0OiB7XHJcbiAgICAgICAgcjogMCxcclxuICAgICAgICBnOiAwLFxyXG4gICAgICAgIGI6IDAsXHJcbiAgICAgICAgYTogMFxyXG4gICAgfSxcclxuICAgIGNvbG9yRW5kOiB7XHJcbiAgICAgICAgcjogMCxcclxuICAgICAgICBnOiAwLFxyXG4gICAgICAgIGI6IDAsXHJcbiAgICAgICAgYTogMFxyXG4gICAgfSxcclxuICAgIGN1c3RvbUF0dHJpYnV0ZXM6IHtcclxuICAgICAgICBsZW5zRmxhcmU6IHtcclxuICAgICAgICAgICAgbWlnaHRGbGFyZTogdHJ1ZSxcclxuICAgICAgICAgICAgd2lsbEZsYXJlOiBmYWxzZSxcclxuICAgICAgICAgICAgYW5nbGU6IDAuMzBcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgY29sb3JBbmltYXRpb25Db25maWc6IHtcclxuICAgICAgICBlYXNpbmc6IHtcclxuICAgICAgICAgICAgcjogJ2xpbmVhckVhc2UnLFxyXG4gICAgICAgICAgICBnOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgICAgIGI6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICAgICAgYTogJ2xpbmVhckVhc2UnXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFuaW1hdGlvblRyYWNrczogW10sXHJcbiAgICBraWxsQ29uZGl0aW9uczoge1xyXG4gICAgICAgIGJvdW5kYXJ5Q2hlY2s6IGZhbHNlLFxyXG4gICAgICAgIGNvbG9yQ2hlY2s6IFtdLFxyXG4gICAgICAgIHBlckF0dHJpYnV0ZTogW11cclxuICAgIH0sXHJcbiAgICByZW5kZXJQYXJ0aWNsZTogZmFsc2VcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnJlc2V0VGhlbWUgPSByZXNldFRoZW1lOyIsInZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuLy4uLy4uLy4uL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxudmFyIGNvbG9yaW5nID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9jb2xvclV0aWxzLmpzJykuY29sb3JVdGlscztcclxudmFyIHJnYmEgPSBjb2xvcmluZy5yZ2JhO1xyXG5cclxudmFyIHNtb2tlVGhlbWUgPSB7XHJcbiAgICBjb250ZXh0QmxlbmRpbmdNb2RlOiAnc291cmNlLW92ZXInLFxyXG4gICAgYWN0aXZlOiAxLFxyXG4gICAgbGlmZTogeyBtaW46IDQwMCwgbWF4OiA1MDAgfSxcclxuICAgIGFuZ2xlOiB7IG1pbjogMS40NSwgbWF4OiAxLjU1IH0sXHJcbiAgICAvLyB2ZWxBY2NlbGVyYXRpb246IDEuMDUsXHJcbiAgICB2ZWxBY2NlbGVyYXRpb246IHsgbWluOiAwLjk5OSwgbWF4OiAwLjk5OTkgfSxcclxuICAgIC8vIG1hZ0RlY2F5OiAxLjUsXHJcbiAgICByYWRpdXM6IHsgbWluOiAzMCwgbWF4OiA1MCB9LFxyXG4gICAgdGFyZ2V0UmFkaXVzOiB7IG1pbjogNzAsIG1heDogMTMwIH0sXHJcbiAgICBhcHBseUdsb2JhbEZvcmNlczogZmFsc2UsXHJcbiAgICBjb2xvclByb2ZpbGVzOiBbeyByOiAxMDAsIGc6IDEwMCwgYjogMTAwLCBhOiAwIH0sIHsgcjogMCwgZzogMCwgYjogMCwgYTogMC4wNSB9LCB7IHI6IDEwMCwgZzogMTAwLCBiOiAxMDAsIGE6IDAgfV0sXHJcbiAgICByZW5kZXJQcm9maWxlczogW3sgc2hhcGVGbjogJ2ZpbGxDaXJjbGUnLCBjb2xvclByb2ZpbGVJZHg6IDAgfV0sXHJcbiAgICBjdXN0b21BdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgbGVuc0ZsYXJlOiB7XHJcbiAgICAgICAgICAgIG1pZ2h0RmxhcmU6IHRydWUsXHJcbiAgICAgICAgICAgIHdpbGxGbGFyZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGFuZ2xlOiAwLjMwXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHByb3hpbWl0eToge1xyXG4gICAgICAgIGNoZWNrOiBmYWxzZSxcclxuICAgICAgICB0aHJlc2hvbGQ6IDUwXHJcbiAgICB9LFxyXG4gICAgYW5pbWF0aW9uVHJhY2tzOiBbe1xyXG4gICAgICAgIGFuaW1OYW1lOiAncmFkaXVzR3JvdycsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAncicsXHJcbiAgICAgICAgYmFzZUFtb3VudDogJ2luaXRSJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICd0UicsXHJcbiAgICAgICAgZHVyYXRpb246ICdsaWZlJyxcclxuICAgICAgICBlYXNpbmc6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICBsaW5rZWRBbmltOiBmYWxzZVxyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnYWxwaGFGYWRlSW4nLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBwYXJhbTogJ2NvbG9yNERhdGEuYScsXHJcbiAgICAgICAgYmFzZUFtb3VudDogJ2NvbG9yUHJvZmlsZXNbMF0uYScsXHJcbiAgICAgICAgdGFyZ2V0VmFsdWVQYXRoOiAnY29sb3JQcm9maWxlc1sxXS5hJyxcclxuICAgICAgICBkdXJhdGlvbjogMC4xLFxyXG4gICAgICAgIGVhc2luZzogJ2Vhc2VPdXRRdWludCcsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgIH0sIHtcclxuICAgICAgICBhbmltTmFtZTogJ3JlZCcsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5yJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5yJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLnInLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjIsXHJcbiAgICAgICAgZWFzaW5nOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgIH0sIHtcclxuICAgICAgICBhbmltTmFtZTogJ2dyZWVuJyxcclxuICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgcGFyYW06ICdjb2xvcjREYXRhLmcnLFxyXG4gICAgICAgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmcnLFxyXG4gICAgICAgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbMV0uZycsXHJcbiAgICAgICAgZHVyYXRpb246IDAuMixcclxuICAgICAgICBlYXNpbmc6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICBsaW5rZWRBbmltOiBmYWxzZVxyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnYmx1ZScsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5iJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5iJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmInLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjIsXHJcbiAgICAgICAgZWFzaW5nOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgIH1dLFxyXG4gICAga2lsbENvbmRpdGlvbnM6IHtcclxuICAgICAgICBib3VuZGFyeUNoZWNrOiB0cnVlLFxyXG4gICAgICAgIGJvdW5kYXJ5T2Zmc2V0OiAyMDAsXHJcbiAgICAgICAgY29sb3JDaGVjazogW10sXHJcbiAgICAgICAgcGVyQXR0cmlidXRlOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIHJlbmRlclBhcnRpY2xlOiBmdW5jdGlvbiByZW5kZXJQYXJ0aWNsZSh4LCB5LCByLCBjb2xvckRhdGEsIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgcCA9IHRoaXM7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICdyZW5kZXJpbmcgc21va2UnICk7XHJcblxyXG4gICAgICAgIGlmIChjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiAhPT0gJ3NvdXJjZS1vdmVyJykge1xyXG4gICAgICAgICAgICBjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdzb3VyY2Utb3Zlcic7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZ3JkID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCAwLCB4LCB5LCByKTtcclxuICAgICAgICAvLyB2YXIgZ3JkID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCAwLCB4LCB5LCByKTtcclxuICAgICAgICAvLyBncmQuYWRkQ29sb3JTdG9wKDAsIHJnYmEoIGNvbG9yRGF0YS5yLCAgY29sb3JEYXRhLmcsIGNvbG9yRGF0YS5iLCAwLjA1KSApO1xyXG4gICAgICAgIC8vIGdyZC5hZGRDb2xvclN0b3AoMSwgcmdiYSggY29sb3JEYXRhLnIsIGNvbG9yRGF0YS5nLCBjb2xvckRhdGEuYiwgMCkgKTtcclxuICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAsIHJnYmEoY29sb3JEYXRhLnIsIGNvbG9yRGF0YS5nLCBjb2xvckRhdGEuYiwgY29sb3JEYXRhLmEpKTtcclxuICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDEsIHJnYmEoY29sb3JEYXRhLnIsIGNvbG9yRGF0YS5nLCBjb2xvckRhdGEuYiwgMCkpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JkO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbENpcmNsZSh4LCB5LCByLCBjb250ZXh0KTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnNtb2tlVGhlbWUgPSBzbW9rZVRoZW1lOyIsInZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuLy4uLy4uLy4uL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxudmFyIGNvbG9yaW5nID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9jb2xvclV0aWxzLmpzJykuY29sb3JVdGlscztcclxudmFyIHJnYmEgPSBjb2xvcmluZy5yZ2JhO1xyXG5cclxudmFyIHdhcnBTdGFyVGhlbWUgPSB7XHJcbiAgICBjb250ZXh0QmxlbmRpbmdNb2RlOiAnbGlnaHRlcicsXHJcbiAgICBhY3RpdmU6IDEsXHJcbiAgICBsaWZlOiB7IG1pbjogNTAsIG1heDogMTAwIH0sXHJcbiAgICBhbmdsZTogeyBtaW46IDAsIG1heDogMiB9LFxyXG4gICAgLy8gdmVsQWNjZWxlcmF0aW9uOiAxLjA1LFxyXG4gICAgdmVsQWNjZWxlcmF0aW9uOiB7IG1pbjogMS4wMSwgbWF4OiAxLjIgfSxcclxuICAgIG1hZ0RlY2F5OiAxLFxyXG4gICAgcmFkaXVzOiB7IG1pbjogMC41LCBtYXg6IDEuNSB9LFxyXG4gICAgdGFyZ2V0UmFkaXVzOiB7IG1pbjogMS41LCBtYXg6IDEuNjUgfSxcclxuICAgIGFwcGx5R2xvYmFsRm9yY2VzOiBmYWxzZSxcclxuICAgIGNvbG9yUHJvZmlsZXM6IFt7IHI6IDI1NSwgZzogMjU1LCBiOiAyNTUsIGE6IDAgfSwgeyByOiAyNTUsIGc6IDI1NSwgYjogMjU1LCBhOiAxIH1dLFxyXG4gICAgcmVuZGVyUHJvZmlsZXM6IFt7IHNoYXBlOiAnQ2lyY2xlJywgY29sb3JQcm9maWxlSWR4OiAwIH0sIHsgc2hhcGU6ICdDaXJjbGUnLCBjb2xvclByb2ZpbGVJZHg6IDEgfSwgeyBzaGFwZTogJ0NpcmNsZScsIGNvbG9yUHJvZmlsZUlkeDogMiB9XSxcclxuICAgIGN1c3RvbUF0dHJpYnV0ZXM6IHtcclxuICAgICAgICBsZW5zRmxhcmU6IHtcclxuICAgICAgICAgICAgbWlnaHRGbGFyZTogdHJ1ZSxcclxuICAgICAgICAgICAgd2lsbEZsYXJlOiBmYWxzZSxcclxuICAgICAgICAgICAgYW5nbGU6IDEuNTBcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYW5pbWF0aW9uVHJhY2tzOiBbe1xyXG4gICAgICAgIGFuaW1OYW1lOiAncmFkaXVzR3JvdycsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAncicsXHJcbiAgICAgICAgYmFzZUFtb3VudDogJ2luaXRSJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICd0UicsXHJcbiAgICAgICAgZHVyYXRpb246ICdsaWZlJyxcclxuICAgICAgICBlYXNpbmc6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICBsaW5rZWRBbmltOiBmYWxzZVxyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnZmFkZUluJyxcclxuICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgcGFyYW06ICdjb2xvcjREYXRhLmEnLFxyXG4gICAgICAgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmEnLFxyXG4gICAgICAgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbMV0uYScsXHJcbiAgICAgICAgZHVyYXRpb246ICdsaWZlJyxcclxuICAgICAgICBlYXNpbmc6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICBsaW5rZWRBbmltOiBmYWxzZVxyXG4gICAgfV0sXHJcbiAgICBraWxsQ29uZGl0aW9uczoge1xyXG4gICAgICAgIGJvdW5kYXJ5Q2hlY2s6IHRydWUsXHJcbiAgICAgICAgYm91bmRhcnlPZmZzZXQ6IDQwMCxcclxuICAgICAgICBjb2xvckNoZWNrOiBbXSxcclxuICAgICAgICBwZXJBdHRyaWJ1dGU6IFtdXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyUGFydGljbGU6IGZ1bmN0aW9uIHJlbmRlclBhcnRpY2xlKHgsIHksIHIsIGNvbG9yRGF0YSwgY29udGV4dCkge1xyXG4gICAgICAgIHZhciBwID0gdGhpcztcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYW5nbGUob3JpZ2luWCwgb3JpZ2luWSwgdGFyZ2V0WCwgdGFyZ2V0WSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkeCA9IG9yaWdpblggLSB0YXJnZXRYO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkeSA9IG9yaWdpblkgLSB0YXJnZXRZO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGV0YSA9IE1hdGguYXRhbjIoLWR5LCAtZHgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGV0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzdHJldGNoVmFsID0gbWF0aFV0aWxzLm1hcChwLnJlbGF0aXZlTWFnbml0dWRlLCAwLCAxMDAsIDEsIDEwKTtcclxuICAgICAgICB2YXIgY2hyb21lVmFsID0gbWF0aFV0aWxzLm1hcChzdHJldGNoVmFsLCAwLCAxMCwgMSwgNCk7XHJcbiAgICAgICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XHJcbiAgICAgICAgY29udGV4dC5yb3RhdGUocC5hbmdsZSk7XHJcblxyXG4gICAgICAgIGlmIChjaHJvbWVWYWwgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIDEgKVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbEVsbGlwc2UoMCwgMCwgciAqIHN0cmV0Y2hWYWwsIHIsIGNvbnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZmFrZSBjaHJvbWF0aWMgYWJiZXJhdGlvbiAoIHJhaW5ib3dpbmcgbGVucyBlZmZlY3QgZHVlIHRvIGxpZ2h0IHJlZnJhY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiYSggMjU1LCAwLCAwLCBcIiArIGNvbG9yRGF0YS5hICsgXCIgKVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbEVsbGlwc2UoY2hyb21lVmFsICogLTEsIDAsIHIgKiBzdHJldGNoVmFsLCByLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwicmdiYSggMCwgMjU1LCAwLCBcIiArIGNvbG9yRGF0YS5hICsgXCIgKVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbEVsbGlwc2UoMCwgMCwgciAqIHN0cmV0Y2hWYWwsIHIsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCJyZ2JhKCAwLCAwLCAyNTUsIFwiICsgY29sb3JEYXRhLmEgKyBcIiApXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsRWxsaXBzZSgwLCBjaHJvbWVWYWwsIHIgKiBzdHJldGNoVmFsLCByLCBjb250ZXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICBpZiAocC5jdXN0b21BdHRyaWJ1dGVzLmxlbnNGbGFyZS53aWxsRmxhcmUpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBmbGFyZUFuZ2xlID0gYW5nbGUoOTYwLCA0NjksIHgsIHkpO1xyXG4gICAgICAgICAgICB2YXIgaW52ZXJ0ZWRGbGFyZUFuZ2xlID0gYW5nbGUoeCwgeSwgOTYwLCA0NjkpO1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQudHJhbnNsYXRlKHgsIHkpO1xyXG5cclxuICAgICAgICAgICAgLy8gbGlnaHQgZ2xhcmUgaG9yaXpvbnRhbFxyXG4gICAgICAgICAgICB2YXIgb3BhY2l0eTEgPSBwLmNvbG9yNERhdGEuYSAqIDAuMTU7XHJcbiAgICAgICAgICAgIHZhciBzaGluZVJhbmQgPSBtYXRoVXRpbHMucmFuZG9tSW50ZWdlcig1LCAxMCk7XHJcbiAgICAgICAgICAgIHZhciBzaGluZUdyZCA9IGNvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoMCwgMCwgMCwgMCwgMCwgODAwKTtcclxuICAgICAgICAgICAgc2hpbmVHcmQuYWRkQ29sb3JTdG9wKDAsIFwicmdiYSggMjU1LDI1NSwgMjU1LCBcIiArIG9wYWNpdHkxICsgXCIgKVwiKTtcclxuICAgICAgICAgICAgc2hpbmVHcmQuYWRkQ29sb3JTdG9wKDEsIFwicmdiYSggMjU1LCAyNTUsIDI1NSwgMCApXCIpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnNjYWxlKHNoaW5lUmFuZCAqIG9wYWNpdHkxLCAwLjAwNSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gc2hpbmVHcmQ7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxDaXJjbGUoMCwgMCwgODAwLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgY29udGV4dC5zY2FsZSgwLjAwNSwgc2hpbmVSYW5kKTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsQ2lyY2xlKDAsIDAsIDgwMCwgY29udGV4dCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnJvdGF0ZSgxLjUpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxDaXJjbGUoMCwgMCwgODAwLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnJvdGF0ZSgtMS41KTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsQ2lyY2xlKDAsIDAsIDgwMCwgY29udGV4dCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBiaWcgZmxhcmVcclxuICAgICAgICAgICAgdmFyIG9wYWNpdHkyID0gcC5jb2xvcjREYXRhLmEgKiAwLjA1O1xyXG5cclxuICAgICAgICAgICAgdmFyIGdyZCA9IGNvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgMCwgeCwgeSwgMTAwKTtcclxuICAgICAgICAgICAgZ3JkLmFkZENvbG9yU3RvcCgwLjc1LCBcInJnYmEoIDI1NSwgMCwgMCwgMCApXCIpO1xyXG4gICAgICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAuOCwgXCJyZ2JhKCAyNTUsIDAsIDAsIFwiICsgb3BhY2l0eTIgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAuODUsIFwicmdiYSggMCwgMjU1LCAwLCBcIiArIG9wYWNpdHkyICsgXCIgKVwiKTtcclxuICAgICAgICAgICAgZ3JkLmFkZENvbG9yU3RvcCgwLjksIFwicmdiYSggMCwgMCwgMjU1LCBcIiArIG9wYWNpdHkyICsgXCIgKVwiKTtcclxuICAgICAgICAgICAgZ3JkLmFkZENvbG9yU3RvcCgxLCBcInJnYmEoIDAsIDAsIDI1NSwgMCApXCIpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGdyZDtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsQ2lyY2xlKHgsIHksIDEwMCwgY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmFkRGlzdDEgPSAyMDAgLyBzdHJldGNoVmFsO1xyXG4gICAgICAgICAgICB2YXIgeDIgPSByYWREaXN0MSAqIE1hdGguY29zKGZsYXJlQW5nbGUpICsgeDtcclxuICAgICAgICAgICAgdmFyIHkyID0gcmFkRGlzdDEgKiBNYXRoLnNpbihmbGFyZUFuZ2xlKSArIHk7XHJcbiAgICAgICAgICAgIHZhciB4MmEgPSByYWREaXN0MSAqIE1hdGguY29zKGludmVydGVkRmxhcmVBbmdsZSkgKyB4O1xyXG4gICAgICAgICAgICB2YXIgeTJhID0gcmFkRGlzdDEgKiBNYXRoLnNpbihpbnZlcnRlZEZsYXJlQW5nbGUpICsgeTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvcGFjaXR5MyA9IHAuY29sb3I0RGF0YS5hICogMC4wMjU7XHJcbiAgICAgICAgICAgIC8vIGxpdHRsZSBmbGFyZSAxXHJcbiAgICAgICAgICAgIHZhciBncmQyID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4MiwgeTIsIDAsIHgyLCB5MiwgNTApO1xyXG4gICAgICAgICAgICAvLyBncmQyLmFkZENvbG9yU3RvcCgwLjc1LCBcInJnYmEoIDI1NSwgMCwgMCwgMCApXCIgKTtcclxuICAgICAgICAgICAgLy8gZ3JkMi5hZGRDb2xvclN0b3AoMC44LCBcInJnYmEoIDI1NSwgMCwgMCwgXCIrb3BhY2l0eTIrXCIgKVwiICk7XHJcbiAgICAgICAgICAgIC8vIGdyZDIuYWRkQ29sb3JTdG9wKDAuODUsIFwicmdiYSggMCwgMjU1LCAwLCBcIitvcGFjaXR5MitcIiApXCIgKTtcclxuICAgICAgICAgICAgLy8gZ3JkMi5hZGRDb2xvclN0b3AoMC45LCBcInJnYmEoIDAsIDAsIDI1NSwgXCIrb3BhY2l0eTIrXCIgKVwiICk7XHJcbiAgICAgICAgICAgIC8vIGdyZDIuYWRkQ29sb3JTdG9wKDEsIFwicmdiYSggMCwgMCwgMjU1LCAwIClcIiApO1xyXG5cclxuICAgICAgICAgICAgZ3JkMi5hZGRDb2xvclN0b3AoMCwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCBcIiArIG9wYWNpdHkzICsgXCIgKVwiKTtcclxuICAgICAgICAgICAgZ3JkMi5hZGRDb2xvclN0b3AoMC44LCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIFwiICsgb3BhY2l0eTMgKyBcIiApXCIpO1xyXG4gICAgICAgICAgICBncmQyLmFkZENvbG9yU3RvcCgxLCBcInJnYmEoIDI1NSwgMjU1LCAyNTUsIDAgKVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JkMjtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsQ2lyY2xlKHgyLCB5MiwgNTAsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgLy8gbGl0dGxlIGZsYXJlIDJcclxuICAgICAgICAgICAgdmFyIGdyZDJhID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4MmEsIHkyYSwgMCwgeDJhLCB5MmEsIDUwKTtcclxuICAgICAgICAgICAgLy8gZ3JkMmEuYWRkQ29sb3JTdG9wKDAuNzUsIFwicmdiYSggMjU1LCAwLCAwLCAwIClcIiApO1xyXG4gICAgICAgICAgICAvLyBncmQyYS5hZGRDb2xvclN0b3AoMC44LCBcInJnYmEoIDI1NSwgMCwgMCwgXCIrb3BhY2l0eTMrXCIgKVwiICk7XHJcbiAgICAgICAgICAgIC8vIGdyZDJhLmFkZENvbG9yU3RvcCgwLjg1LCBcInJnYmEoIDAsIDI1NSwgMCwgXCIrb3BhY2l0eTMrXCIgKVwiICk7XHJcbiAgICAgICAgICAgIC8vIGdyZDJhLmFkZENvbG9yU3RvcCgwLjksIFwicmdiYSggMCwgMCwgMjU1LCBcIitvcGFjaXR5MytcIiApXCIgKTtcclxuICAgICAgICAgICAgLy8gZ3JkMmEuYWRkQ29sb3JTdG9wKDEsIFwicmdiYSggMCwgMCwgMjU1LCAwIClcIiApO1xyXG4gICAgICAgICAgICBncmQyYS5hZGRDb2xvclN0b3AoMCwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCBcIiArIG9wYWNpdHkzICsgXCIgKVwiKTtcclxuICAgICAgICAgICAgZ3JkMmEuYWRkQ29sb3JTdG9wKDAuOCwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCBcIiArIG9wYWNpdHkzICsgXCIgKVwiKTtcclxuICAgICAgICAgICAgZ3JkMmEuYWRkQ29sb3JTdG9wKDEsIFwicmdiYSggMjU1LCAyNTUsIDI1NSwgMCApXCIpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGdyZDJhO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxDaXJjbGUoeDJhLCB5MmEsIDUwLCBjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciByYWREaXN0MiA9IDMwMCAvIHN0cmV0Y2hWYWwgKiAxLjU7XHJcbiAgICAgICAgICAgIHZhciB4MyA9IHJhZERpc3QyICogTWF0aC5jb3MoZmxhcmVBbmdsZSkgKyB4O1xyXG4gICAgICAgICAgICB2YXIgeTMgPSByYWREaXN0MiAqIE1hdGguc2luKGZsYXJlQW5nbGUpICsgeTtcclxuICAgICAgICAgICAgdmFyIHgzYSA9IHJhZERpc3QyICogTWF0aC5jb3MoaW52ZXJ0ZWRGbGFyZUFuZ2xlKSArIHg7XHJcbiAgICAgICAgICAgIHZhciB5M2EgPSByYWREaXN0MiAqIE1hdGguc2luKGludmVydGVkRmxhcmVBbmdsZSkgKyB5O1xyXG5cclxuICAgICAgICAgICAgLy8gbGl0dGxlIGZsYXJlIDNcclxuICAgICAgICAgICAgdmFyIGdyZDMgPSBjb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHgzLCB5MywgMCwgeDMsIHkzLCAyNSk7XHJcbiAgICAgICAgICAgIC8vIGdyZDMuYWRkQ29sb3JTdG9wKDAuNzUsIFwicmdiYSggMjU1LCAwLCAwLCAwIClcIiApO1xyXG4gICAgICAgICAgICAvLyBncmQzLmFkZENvbG9yU3RvcCgwLjgsIFwicmdiYSggMjU1LCAwLCAwLCBcIitvcGFjaXR5MytcIiApXCIgKTtcclxuICAgICAgICAgICAgLy8gZ3JkMy5hZGRDb2xvclN0b3AoMC44NSwgXCJyZ2JhKCAwLCAyNTUsIDAsIFwiK29wYWNpdHkzK1wiIClcIiApO1xyXG4gICAgICAgICAgICAvLyBncmQzLmFkZENvbG9yU3RvcCgwLjksIFwicmdiYSggMCwgMCwgMjU1LCBcIitvcGFjaXR5MytcIiApXCIgKTtcclxuICAgICAgICAgICAgLy8gZ3JkMy5hZGRDb2xvclN0b3AoMSwgXCJyZ2JhKCAwLCAwLCAyNTUsIDAgKVwiICk7XHJcbiAgICAgICAgICAgIGdyZDMuYWRkQ29sb3JTdG9wKDAsIFwicmdiYSggMjU1LCAyNTUsIDI1NSwgXCIgKyBvcGFjaXR5MyArIFwiIClcIik7XHJcbiAgICAgICAgICAgIGdyZDMuYWRkQ29sb3JTdG9wKDAuOCwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCBcIiArIG9wYWNpdHkzICsgXCIgKVwiKTtcclxuICAgICAgICAgICAgZ3JkMy5hZGRDb2xvclN0b3AoMSwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCAwIClcIik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JkMztcclxuICAgICAgICAgICAgY29udGV4dC5maWxsQ2lyY2xlKHgzLCB5MywgMjUsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgLy8gbGl0dGxlIGZsYXJlIDRcclxuICAgICAgICAgICAgdmFyIGdyZDNhID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4M2EsIHkzYSwgMCwgeDNhLCB5M2EsIDI1KTtcclxuICAgICAgICAgICAgLy8gZ3JkM2EuYWRkQ29sb3JTdG9wKDAuNzUsIFwicmdiYSggMjU1LCAwLCAwLCAwIClcIiApO1xyXG4gICAgICAgICAgICAvLyBncmQzYS5hZGRDb2xvclN0b3AoMC44LCBcInJnYmEoIDI1NSwgMCwgMCwgXCIrb3BhY2l0eTMrXCIgKVwiICk7XHJcbiAgICAgICAgICAgIC8vIGdyZDNhLmFkZENvbG9yU3RvcCgwLjg1LCBcInJnYmEoIDAsIDI1NSwgMCwgXCIrb3BhY2l0eTMrXCIgKVwiICk7XHJcbiAgICAgICAgICAgIC8vIGdyZDNhLmFkZENvbG9yU3RvcCgwLjksIFwicmdiYSggMCwgMCwgMjU1LCBcIitvcGFjaXR5MytcIiApXCIgKTtcclxuICAgICAgICAgICAgLy8gZ3JkM2EuYWRkQ29sb3JTdG9wKDEsIFwicmdiYSggMCwgMCwgMjU1LCAwIClcIiApO1xyXG4gICAgICAgICAgICBncmQzYS5hZGRDb2xvclN0b3AoMCwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCBcIiArIG9wYWNpdHkzICsgXCIgKVwiKTtcclxuICAgICAgICAgICAgZ3JkM2EuYWRkQ29sb3JTdG9wKDAuOCwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCBcIiArIG9wYWNpdHkzICsgXCIgKVwiKTtcclxuICAgICAgICAgICAgZ3JkM2EuYWRkQ29sb3JTdG9wKDEsIFwicmdiYSggMjU1LCAyNTUsIDI1NSwgMCApXCIpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGdyZDNhO1xyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxDaXJjbGUoeDNhLCB5M2EsIDI1LCBjb250ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy53YXJwU3RhclRoZW1lID0gd2FycFN0YXJUaGVtZTsiLCIvLyBkZXBlbmRlbmNpZXNcclxuXHJcbi8vIE5QTVxyXG52YXIgTGlua2VkTGlzdCA9IHJlcXVpcmUoJ2RibHktbGlua2VkLWxpc3QnKTtcclxudmFyIG9iamVjdFBhdGggPSByZXF1aXJlKFwib2JqZWN0LXBhdGhcIik7XHJcblxyXG4vLyBDdXN0b20gUmVxdWlyZXNcclxudmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG52YXIgdHJpZyA9IHJlcXVpcmUoJy4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzO1xyXG52YXIgZHJhd2luZyA9IHJlcXVpcmUoJy4vY2FudmFzQXBpQXVnbWVudGF0aW9uLmpzJykuY2FudmFzRHJhd2luZ0FwaTtcclxudmFyIGNvbG9yaW5nID0gcmVxdWlyZSgnLi9jb2xvclV0aWxzLmpzJykuY29sb3JVdGlscztcclxudmFyIGVhc2luZyA9IHJlcXVpcmUoJy4vZWFzaW5nLmpzJykuZWFzaW5nRXF1YXRpb25zO1xyXG52YXIgYW5pbWF0aW9uID0gcmVxdWlyZSgnLi9hbmltYXRpb24uanMnKS5hbmltYXRpb247XHJcbnZhciBkZWJ1Z0NvbmZpZyA9IHJlcXVpcmUoJy4vZGVidWdVdGlscy5qcycpO1xyXG52YXIgZGVidWcgPSBkZWJ1Z0NvbmZpZy5kZWJ1ZztcclxudmFyIGxhc3RDYWxsZWRUaW1lID0gZGVidWdDb25maWcubGFzdENhbGxlZFRpbWU7XHJcbnZhciBlbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vZW52aXJvbm1lbnQuanMnKS5lbnZpcm9ubWVudDtcclxudmFyIHBoeXNpY3MgPSBlbnZpcm9ubWVudC5mb3JjZXM7XHJcbnZhciBydW50aW1lRW5naW5lID0gZW52aXJvbm1lbnQucnVudGltZUVuZ2luZTtcclxudmFyIHRoZW1lcyA9IHJlcXVpcmUoJy4vcGFydGljbGVUaGVtZXMvdGhlbWVzLmpzJykudGhlbWVzO1xyXG5cclxudmFyIHNpbmdsZUJ1cnN0VGhlbWUgPSByZXF1aXJlKCcuL2VtaXR0ZXJUaGVtZXMvc2luZ2xlQnVyc3RUaGVtZS9zaW5nbGVCdXJzdFRoZW1lLmpzJykuc2luZ2xlQnVyc3RUaGVtZTtcclxudmFyIGJhc2VFbWl0dGVyVGhlbWUgPSByZXF1aXJlKCcuL2VtaXR0ZXJUaGVtZXMvYmFzZUVtaXR0ZXIvYmFzZUVtaXR0ZXJUaGVtZS5qcycpLmJhc2VFbWl0dGVyVGhlbWU7XHJcbnZhciB3YXJwU3RyZWFtVGhlbWUgPSByZXF1aXJlKCcuL2VtaXR0ZXJUaGVtZXMvd2FycFN0cmVhbS93YXJwU3RyZWFtVGhlbWUuanMnKS53YXJwU3RyZWFtVGhlbWU7XHJcbnZhciBmbGFtZVN0cmVhbVRoZW1lID0gcmVxdWlyZSgnLi9lbWl0dGVyVGhlbWVzL2ZsYW1lU3RyZWFtL2ZsYW1lU3RyZWFtVGhlbWUuanMnKS5mbGFtZVN0cmVhbVRoZW1lO1xyXG52YXIgc21va2VTdHJlYW1UaGVtZSA9IHJlcXVpcmUoJy4vZW1pdHRlclRoZW1lcy9zbW9rZVN0cmVhbS9zbW9rZVN0cmVhbVRoZW1lLmpzJykuc21va2VTdHJlYW1UaGVtZTtcclxuXHJcbnZhciBFbWl0dGVyRW50aXR5ID0gcmVxdWlyZSgnLi9FbWl0dGVyRW50aXR5LmpzJykuRW1pdHRlckVudGl0eTtcclxudmFyIEVtaXR0ZXJTdG9yZUZuID0gcmVxdWlyZSgnLi9lbWl0dGVyU3RvcmUuanMnKS5FbWl0dGVyU3RvcmVGbjtcclxudmFyIHBhcnRpY2xlRm4gPSByZXF1aXJlKCcuL3BhcnRpY2xlRm4uanMnKS5wYXJ0aWNsZUZuO1xyXG52YXIgcGFydGljbGVBcnJGbiA9IHJlcXVpcmUoJy4vcGFydGljbGVBcnJGbi5qcycpLnBhcnRpY2xlQXJyRm47XHJcblxyXG4vLyBkb3VibGUgYnVmZmVyIGNhbnZhcyAoZXhwZXJpbWVudClcclxuLy8gbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4vLyBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuLy8gY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbi8vIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblxyXG4vLyBsZXQgYmxpdENhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGVzdC1iYXNlXCIpO1xyXG4vLyBsZXQgYmxpdEN0eCA9IGJsaXRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuLy8gYmxpdENhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4vLyBibGl0Q2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcbi8vIHN0YW5kYXJkIGNhbnZhcyByZW5kZXJpbmdcclxuLy8gY2FudmFzIGhvdXNla2VlcGluZ1xyXG52YXIgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0ZXN0LWJhc2VcIik7XHJcbi8vIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIsIHsgYWxwaGE6IGZhbHNlIH0pO1xyXG52YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuLy8gY2FjaGUgY2FudmFzIHcvaFxyXG52YXIgY2FuVyA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG52YXIgY2FuSCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuLy8gc2V0IGNhbnZhcyB0byBmdWxsLXNjcmVlblxyXG5jYW52YXMud2lkdGggPSBjYW5XO1xyXG5jYW52YXMuaGVpZ2h0ID0gY2FuSDtcclxudmFyIGNhbnZhc0NlbnRyZUggPSBjYW5XIC8gMjtcclxudmFyIGNhbnZhc0NlbnRyZVYgPSBjYW5IIC8gMjtcclxuXHJcbnZhciBjYW52YXNDb25maWcgPSB7XHJcbiAgICB3aWR0aDogY2FuVyxcclxuICAgIGhlaWdodDogY2FuSCxcclxuICAgIGNlbnRlckg6IGNhbnZhc0NlbnRyZUgsXHJcbiAgICBjZW50ZXJWOiBjYW52YXNDZW50cmVWLFxyXG5cclxuICAgIGJ1ZmZlckNsZWFyUmVnaW9uOiB7XHJcbiAgICAgICAgeDogY2FudmFzQ2VudHJlSCxcclxuICAgICAgICB5OiBjYW52YXNDZW50cmVWLFxyXG4gICAgICAgIHc6IDAsXHJcbiAgICAgICAgaDogMFxyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIGJ1ZmZlckNsZWFyUmVnaW9uID0ge1xyXG4gICAgeDogY2FudmFzQ2VudHJlSCxcclxuICAgIHk6IGNhbnZhc0NlbnRyZVYsXHJcbiAgICB3OiAwLFxyXG4gICAgaDogMFxyXG5cclxuICAgIC8vIGVtaXR0ZXIgc3RvcmVcclxufTtcclxuXHJcbnZhciBlbWl0dGVyU3RvcmUgPSBbXTtcclxuLy8gcGFydGljbGUgc3RvcmVcclxudmFyIGVudGl0eVN0b3JlID0gW107XHJcbi8vIHBhcnRpY2xlIHN0b3JlIG1ldGEgZGF0YVxyXG52YXIgZW50aXR5UG9vbCA9IG5ldyBMaW5rZWRMaXN0KCk7XHJcbnZhciBsaXZlRW50aXR5Q291bnQgPSAwO1xyXG5cclxudmFyIHJ1bnRpbWVDb25maWcgPSB7XHJcblxyXG4gICAgZ2xvYmFsQ2xvY2s6IDAsXHJcbiAgICBnbG9iYWxDbG9ja1RpY2s6IGZ1bmN0aW9uIGdsb2JhbENsb2NrVGljaygpIHtcclxuICAgICAgICB0aGlzLmdsb2JhbENsb2NrKys7XHJcbiAgICB9LFxyXG5cclxuICAgIGVtaXR0ZXJDb3VudDogMCxcclxuICAgIGFjdGl2ZUVtaXR0ZXJzOiAwLFxyXG5cclxuICAgIGxpdmVFbnRpdHlDb3VudDogMCxcclxuICAgIHN1YnRyYWN0OiBmdW5jdGlvbiBzdWJ0cmFjdChhbW91bnQpIHtcclxuICAgICAgICB0aGlzLmxpdmVFbnRpdHlDb3VudCAtPSBhbW91bnQ7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBwcmUtcG9wdWxhdGUgZW50aXR5U3RvcmVcclxudmFyIGVudGl0eVBvcHVsYXRpb24gPSAxMDAwMDtcclxuZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRpdHlQb3B1bGF0aW9uOyBpKyspIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCBcInBvcHVsYXRpbmcgZW50aXR5U3RvcmUgd2l0aCBwSW5zdGFuY2UgJyVkJzogXCIsIGkgKTtcclxuICAgIC8vIHBJbnN0YW5jZS5pZHggPSBpO1xyXG4gICAgLy8gY29uc29sZS5sb2coIFwicEluc3RhbmNlLmlkeCAnJWQnXCIsIHBJbnN0YW5jZS5pZHggKVxyXG4gICAgZW50aXR5U3RvcmUucHVzaChjcmVhdGVMaXZlUGFydGljbGUoMCwgMCwgaSwgYmFzZUVtaXR0ZXJUaGVtZSwgdGhlbWVzLnJlc2V0KSk7XHJcbiAgICBlbnRpdHlQb29sLmluc2VydCgnJyArIGkpO1xyXG59XHJcblxyXG4vLyBnbG9iYWwgY291bnRlclxyXG52YXIgZ2xvYmFsQ2xvY2sgPSAwO1xyXG52YXIgY291bnRlciA9IDA7XHJcblxyXG4vLyBzZXQgZGVmYXVsdCB2YXJpYWJsZXMgXHJcbnZhciBtb3VzZVggPSB2b2lkIDAsXHJcbiAgICBtb3VzZVkgPSB2b2lkIDAsXHJcbiAgICBydW50aW1lID0gdm9pZCAwLFxyXG4gICAgcExpdmUgPSB2b2lkIDA7XHJcbiAgICBcclxuLy8gbGV0IGN1cnJUaGVtZSA9IHRoZW1lcy5maXJlO1xyXG52YXIgY3VyclRoZW1lID0gdGhlbWVzLmZsYW1lO1xyXG4vLyBsZXQgY3VyclRoZW1lID0gdGhlbWVzLndhcnBTdGFyO1xyXG4vLyBsZXQgY3VyclRoZW1lID0gdGhlbWVzLnNtb2tlO1xyXG5cclxuLy8gbGV0IGN1cnJFbWl0dGVyVGhlbWUgPSBzaW5nbGVCdXJzdFRoZW1lO1xyXG4vLyBsZXQgY3VyckVtaXR0ZXJUaGVtZSA9IHdhcnBTdHJlYW1UaGVtZTtcclxudmFyIGN1cnJFbWl0dGVyVGhlbWUgPSBmbGFtZVN0cmVhbVRoZW1lO1xyXG5cclxudmFyIGN1cnJFbW1pc3Npb25UeXBlID0ge1xyXG4gICAgbW91c2VDbGlja0V2ZW50OiB0cnVlLFxyXG4gICAgcmFuZG9tQnVyc3Q6IGZhbHNlLFxyXG4gICAgc3RlYWR5U3RyZWFtOiBmYWxzZVxyXG59O1xyXG5cclxuLy8gY2FudmFzIGNsaWNrIGhhbmRsZXJcclxuZnVuY3Rpb24gcmVnaXN0ZXJNb3VzZUNsaWNrRW1taXNpb24oKSB7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBtb3VzZVggPSBldmVudC5vZmZzZXRYO1xyXG4gICAgICAgIG1vdXNlWSA9IGV2ZW50Lm9mZnNldFk7XHJcblxyXG4gICAgICAgIC8vIHRlc3RFbWl0dGVyLnJlc2V0RW1pc3Npb25WYWx1ZXMoKTtcclxuICAgICAgICAvLyB0ZXN0RW1pdHRlci50cmlnZ2VyRW1pdHRlciggeyB4OiBtb3VzZVgsIHk6IG1vdXNlWSB9ICk7XHJcblxyXG4gICAgICAgIHZhciB0ZXN0RW1pdHRlciA9IG5ldyBFbWl0dGVyRW50aXR5KCd0ZXN0RW1pdHRlcicsIGN1cnJFbWl0dGVyVGhlbWUsIGN1cnJUaGVtZSwgZW1pdEVudGl0aWVzKTtcclxuXHJcbiAgICAgICAgZW1pdHRlclN0b3JlLnB1c2godGVzdEVtaXR0ZXIpO1xyXG5cclxuICAgICAgICB0ZXN0RW1pdHRlci50cmlnZ2VyRW1pdHRlcih7XHJcbiAgICAgICAgICAgIHg6IGNhbnZhc0NvbmZpZy5jZW50ZXJILFxyXG4gICAgICAgICAgICB5OiBjYW52YXNDb25maWcuY2VudGVyVlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoYW5pbWF0aW9uLnN0YXRlICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbi5zdGF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5pZiAoY3VyckVtbWlzc2lvblR5cGUubW91c2VDbGlja0V2ZW50KSB7XHJcbiAgICByZWdpc3Rlck1vdXNlQ2xpY2tFbW1pc2lvbigpO1xyXG59XHJcblxyXG52YXIgc21va2VFbWl0dGVyID0gbmV3IEVtaXR0ZXJFbnRpdHkoJ3Ntb2tlRW1pdHRlcicsIHNtb2tlU3RyZWFtVGhlbWUsIHRoZW1lcy5zbW9rZSwgZW1pdEVudGl0aWVzKTtcclxuZW1pdHRlclN0b3JlLnB1c2goc21va2VFbWl0dGVyKTtcclxuXHJcbi8vIHBhcnRpY2xlIG1ldGhvZHMgZk5cclxuZnVuY3Rpb24gcmVuZGVyUGFydGljbGUoeCwgeSwgciwgY29sb3JEYXRhLCBjb250ZXh0LCBtYXRoVXRpbHMpIHtcclxuICAgIHZhciBwID0gdGhpcztcclxuICAgIC8vIGNvbnNvbGUubG9nKCAncC5yZW5kZXI6ICcsIHAgKTtcclxuICAgIHZhciBjb21waWxlZENvbG9yID0gXCJyZ2JhKFwiICsgY29sb3JEYXRhLnIgKyAnLCcgKyBjb2xvckRhdGEuZyArICcsJyArIGNvbG9yRGF0YS5iICsgXCIsXCIgKyBjb2xvckRhdGEuYSArIFwiKVwiO1xyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBjb21waWxlZENvbG9yO1xyXG4gICAgY29udGV4dC5maWxsQ2lyY2xlKHgsIHksIHIsIGNvbnRleHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRQYXJ0aWNsZUF0dHJpYnV0ZXMocCwgcHBhKSB7XHJcblxyXG4gICAgcC5pc0FsaXZlID0gcHBhLmFjdGl2ZTtcclxuICAgIHAubGlmZVNwYW4gPSBwcGEubGlmZVNwYW47XHJcbiAgICBwLmN1cnJMaWZlID0gcHBhLmxpZmVTcGFuO1xyXG4gICAgcC5jdXJyTGlmZUludiA9IDA7XHJcbiAgICBwLnggPSBwcGEueDtcclxuICAgIHAueSA9IHBwYS55O1xyXG4gICAgcC54VmVsID0gcHBhLnhWZWw7XHJcbiAgICBwLnlWZWwgPSBwcGEueVZlbDtcclxuICAgIHAudkFjYyA9IHBwYS52QWNjO1xyXG4gICAgcC5pbml0UiA9IHBwYS5pbml0UjtcclxuICAgIHAuciA9IHBwYS5pbml0UjtcclxuICAgIHAudFIgPSBwcGEudFI7XHJcbiAgICBwLmFuZ2xlID0gcHBhLmFuZ2xlO1xyXG4gICAgcC5tYWduaXR1ZGUgPSBwcGEubWFnbml0dWRlO1xyXG4gICAgcC5yZWxhdGl2ZU1hZ25pdHVkZSA9IHBwYS5tYWduaXR1ZGU7XHJcbiAgICBwLm1hZ25pdHVkZURlY2F5ID0gcHBhLm1hZ25pdHVkZURlY2F5O1xyXG4gICAgcC5lbnRpdHlUeXBlID0gJ25vbmUnO1xyXG4gICAgcC5hcHBseUZvcmNlcyA9IHBwYS5hcHBseUZvcmNlcztcclxuICAgIHAuY29sb3I0RGF0YSA9IHBwYS5jb2xvcjREYXRhO1xyXG4gICAgcC5jb2xvclByb2ZpbGVzID0gcHBhLmNvbG9yUHJvZmlsZXM7XHJcbiAgICBwLmtpbGxDb25kaXRpb25zID0gcHBhLmtpbGxDb25kaXRpb25zO1xyXG4gICAgcC5jdXN0b21BdHRyaWJ1dGVzID0gcHBhLmN1c3RvbUF0dHJpYnV0ZXM7XHJcbiAgICBwLmFuaW1hdGlvblRyYWNrcyA9IHBwYS5hbmltYXRpb25UcmFja3M7XHJcbiAgICBwLnVwZGF0ZSA9IHBhcnRpY2xlRm4udXBkYXRlUGFydGljbGU7XHJcbiAgICBwLnJlaW5jYXJuYXRlID0gcmVpbmNhcm5hdGVQYXJ0aWNsZTtcclxuICAgIHAua2lsbCA9IHBhcnRpY2xlRm4ua2lsbFBhcnRpY2xlO1xyXG4gICAgcC5yZW5kZXIgPSBwcGEucmVuZGVyRk47XHJcbiAgICBwLmV2ZW50cyA9IHBwYS5ldmVudHM7XHJcbn1cclxuXHJcbi8vIHBhcnRpY2xlIGZOXHJcbmZ1bmN0aW9uIGNyZWF0ZUxpdmVQYXJ0aWNsZSh0aGlzWCwgdGhpc1ksIGlkeCwgZW1pc3Npb25PcHRzLCBwYXJ0aWNsZU9wdHMpIHtcclxuXHJcbiAgICB2YXIgbmV3UGFydGljbGUgPSB7fTtcclxuICAgIG5ld1BhcnRpY2xlLmlkeCA9IGlkeDtcclxuICAgIHNldFBhcnRpY2xlQXR0cmlidXRlcyhuZXdQYXJ0aWNsZSwgcGFydGljbGVGbi5jcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXModGhpc1gsIHRoaXNZLCBlbWlzc2lvbk9wdHMsIHBhcnRpY2xlT3B0cykpO1xyXG4gICAgcmV0dXJuIG5ld1BhcnRpY2xlO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWluY2FybmF0ZVBhcnRpY2xlKHRoaXNYLCB0aGlzWSwgZW1pc3Npb25PcHRzLCBwYXJ0aWNsZU9wdGlvbnMpIHtcclxuICAgIHNldFBhcnRpY2xlQXR0cmlidXRlcyh0aGlzLCBwYXJ0aWNsZUZuLmNyZWF0ZVBlclBhcnRpY2xlQXR0cmlidXRlcyh0aGlzWCwgdGhpc1ksIGVtaXNzaW9uT3B0cywgcGFydGljbGVPcHRpb25zKSk7XHJcbn1cclxuXHJcbi8vIGVtbWlzaW9uIGZOXHJcbmZ1bmN0aW9uIGVtaXRFbnRpdGllcyh4LCB5LCBjb3VudCwgZW1pc3Npb25PcHRpb25zLCBwYXJ0aWNsZU9wdGlvbnMpIHtcclxuICAgIHZhciBlbnRpdHlTdG9yZUxlbiA9IGVudGl0eVN0b3JlLmxlbmd0aDtcclxuICAgIHZhciBhZGRlZE5ldyA9IDA7XHJcbiAgICB2YXIgYWRkZWRGcm9tUG9vbCA9IDA7XHJcbiAgICB2YXIgdGhldGE7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coIFwiZW1taXRpbmcgYSB0b3RhbCBvZjogJyVkJyBwYXJ0aWNsZXNcIiwgY291bnQgKTtcclxuICAgIHJ1bnRpbWVDb25maWcubGl2ZUVudGl0eUNvdW50ICs9IGNvdW50O1xyXG4gICAgZm9yICh2YXIgX2kgPSBjb3VudCAtIDE7IF9pID49IDA7IF9pLS0pIHtcclxuXHJcbiAgICAgICAgaWYgKGVudGl0eVBvb2wuZ2V0U2l6ZSgpID4gMCkge1xyXG4gICAgICAgICAgICBlbnRpdHlTdG9yZVtlbnRpdHlQb29sLmdldFRhaWxOb2RlKCkuZ2V0RGF0YSgpXS5yZWluY2FybmF0ZSh4LCB5LCBlbWlzc2lvbk9wdGlvbnMsIHBhcnRpY2xlT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGFkZGVkRnJvbVBvb2wrKztcclxuICAgICAgICAgICAgZW50aXR5UG9vbC5yZW1vdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlbnRpdHlTdG9yZS5wdXNoKGNyZWF0ZUxpdmVQYXJ0aWNsZSh4LCB5LCBlbnRpdHlTdG9yZUxlbiwgZW1pc3Npb25PcHRpb25zLCBwYXJ0aWNsZU9wdGlvbnMpKTtcclxuICAgICAgICAgICAgZW50aXR5UG9vbC5pbnNlcnQoJycgKyBlbnRpdHlTdG9yZUxlbik7XHJcbiAgICAgICAgICAgIGFkZGVkTmV3Kys7XHJcbiAgICAgICAgICAgIGVudGl0eVN0b3JlTGVuKys7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gY29uc29sZS5sb2coIFwiYWRkZWRGcm9tUG9vbDogJyVkJywgYWRkZWROZXc6ICclZCdcIiwgYWRkZWRGcm9tUG9vbCwgYWRkZWROZXcgKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCAnYWRkZWROZXc6ICcsIGFkZGVkTmV3ICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUVtaXR0ZXJTdG9yZU1lbWJlcnMoKSB7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IGVtaXR0ZXJTdG9yZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIGVtaXR0ZXJTdG9yZVtpXS51cGRhdGVFbWl0dGVyKCk7XHJcbiAgICAgICAgLy8gZW1pdHRlclN0b3JlW2ldLnJlbmRlckVtaXR0ZXIoIGN0eCApO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBydW50aW1lIGZOIG1lbWJlcnNcclxuZnVuY3Rpb24gZGlzcGxheURlYnVnZ2luZygpIHtcclxuICAgIGRlYnVnLmRlYnVnT3V0cHV0KGNhbnZhcywgY3R4LCAnQW5pbWF0aW9uIENvdW50ZXI6ICcsIGNvdW50ZXIsIDApO1xyXG4gICAgZGVidWcuZGVidWdPdXRwdXQoY2FudmFzLCBjdHgsICdQYXJ0aWNsZSBQb29sOiAnLCBlbnRpdHlTdG9yZS5sZW5ndGgsIDEpO1xyXG4gICAgZGVidWcuZGVidWdPdXRwdXQoY2FudmFzLCBjdHgsICdMaXZlIEVudGl0aWVzOiAnLCBydW50aW1lQ29uZmlnLmxpdmVFbnRpdHlDb3VudCwgMiwgeyBtaW46IGVudGl0eVN0b3JlLmxlbmd0aCwgbWF4OiAwIH0pO1xyXG4gICAgZGVidWcuZGVidWdPdXRwdXQoY2FudmFzLCBjdHgsICdGUFM6ICcsIE1hdGgucm91bmQoZGVidWcuY2FsY3VsYXRlRnBzKCkpLCAzLCB7IG1pbjogMCwgbWF4OiA2MCB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ3ljbGUoKSB7XHJcbiAgICAvLyByZW5kZXJpbmdcclxuICAgIHBhcnRpY2xlQXJyRm4ucmVuZGVyUGFydGljbGVBcnIoY3R4LCBlbnRpdHlTdG9yZSwgYW5pbWF0aW9uKTtcclxuXHJcbiAgICAvLyBibGl0IHRvIG9uc2NyZWVuXHJcbiAgICAvLyBibGl0Q3R4LmRyYXdJbWFnZSggY2FudmFzLCAwLCAwICk7XHJcblxyXG4gICAgLy8gdXBkYXRpbmdcclxuICAgIHBhcnRpY2xlQXJyRm4udXBkYXRlUGFydGljbGVBcnIoY3R4LCBlbnRpdHlTdG9yZSwgZW50aXR5UG9vbCwgYW5pbWF0aW9uLCBjYW52YXNDb25maWcsIHJ1bnRpbWVDb25maWcsIGVtaXR0ZXJTdG9yZSk7XHJcblxyXG4gICAgdXBkYXRlRW1pdHRlclN0b3JlTWVtYmVycygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhckNhbnZhcyhjdHgpIHtcclxuICAgIC8vIGNsZWFuaW5nXHJcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhblcsIGNhbkgpO1xyXG4gICAgLy8gY3R4LmNsZWFyUmVjdCggYnVmZmVyQ2xlYXJSZWdpb24ueCwgYnVmZmVyQ2xlYXJSZWdpb24ueSwgYnVmZmVyQ2xlYXJSZWdpb24udywgYnVmZmVyQ2xlYXJSZWdpb24uaCApO1xyXG5cclxuICAgIC8vIGJsaXRDdHguY2xlYXJSZWN0KCAwLCAwLCBjYW5XLCBjYW5IICk7XHJcblxyXG5cclxuICAgIC8vIGN0eC5maWxsU3R5bGUgPSAncmdiYSggMCwgMCwgMCwgMC4xICknO1xyXG4gICAgLy8gY3R4LmZpbGxSZWN0KCAwLCAwLCBjYW5XLCBjYW5IICk7XHJcblxyXG4gICAgLy8gc2V0IGRpcnR5IGJ1ZmZlclxyXG4gICAgLy8gcmVzZXRCdWZmZXJDbGVhclJlZ2lvbigpO1xyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIHJ1bnRpbWVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5mdW5jdGlvbiB1cGRhdGUoKSB7XHJcblxyXG4gICAgLy8gbG9vcCBob3VzZWtlZXBpbmdcclxuICAgIHJ1bnRpbWUgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgLy8gY2xlYW4gY2FudmFzXHJcbiAgICBjbGVhckNhbnZhcyhjdHgpO1xyXG5cclxuICAgIC8vIGJsZW5kaW5nXHJcbiAgICAvLyBpZiAoIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gIT0gY3VyclRoZW1lLmNvbnRleHRCbGVuZGluZ01vZGUgKSB7XHJcbiAgICAvLyAgICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IGN1cnJUaGVtZS5jb250ZXh0QmxlbmRpbmdNb2RlO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHVwZGF0ZXNcclxuICAgIHVwZGF0ZUN5Y2xlKCk7XHJcblxyXG4gICAgLy8gZGVidWdnaW5nXHJcbiAgICBkaXNwbGF5RGVidWdnaW5nKCk7XHJcblxyXG4gICAgLy8gbG9vcGluZ1xyXG4gICAgYW5pbWF0aW9uLnN0YXRlID09PSB0cnVlID8gKHJ1bnRpbWVFbmdpbmUuc3RhcnRBbmltYXRpb24ocnVudGltZSwgdXBkYXRlKSwgY291bnRlcisrKSA6IHJ1bnRpbWVFbmdpbmUuc3RvcEFuaW1hdGlvbihydW50aW1lKTtcclxuXHJcbiAgICAvLyBnbG9iYWwgY2xvY2tcclxuICAgIC8vIGNvdW50ZXIrKztcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEVuZCBydW50aW1lXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8iLCJ2YXIgX3RyaWdvbm9taWNVdGlscztcclxuXHJcbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XHJcblxyXG4vKipcclxuKiBjYWNoZWQgdmFsdWVzXHJcbiovXHJcblxyXG52YXIgcGlCeUhhbGYgPSBNYXRoLlBpIC8gMTgwO1xyXG52YXIgaGFsZkJ5UGkgPSAxODAgLyBNYXRoLlBJO1xyXG5cclxuLyoqXHJcbiogcHJvdmlkZXMgdHJpZ29ubWljIHV0aWwgbWV0aG9kcy5cclxuKlxyXG4qIEBtaXhpblxyXG4qL1xyXG52YXIgdHJpZ29ub21pY1V0aWxzID0gKF90cmlnb25vbWljVXRpbHMgPSB7XHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gY2FsY3VsYXRlIGRpc3RhbmNlIGJldHdlZW4gMiB2ZWN0b3IgY29vcmRpbmF0ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MSAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHkxIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geDIgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRkaXN0OiBmdW5jdGlvbiBkaXN0KHgxLCB5MSwgeDIsIHkyKSB7XHJcblx0XHR4MiAtPSB4MTt5MiAtPSB5MTtcclxuXHRcdHJldHVybiBNYXRoLnNxcnQoeDIgKiB4MiArIHkyICogeTIpO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gY29udmVydCBkZWdyZWVzIHRvIHJhZGlhbnMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkZWdyZWVzIC0gdGhlIGRlZ3JlZSB2YWx1ZSB0byBjb252ZXJ0LlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdGRlZ3JlZXNUb1JhZGlhbnM6IGZ1bmN0aW9uIGRlZ3JlZXNUb1JhZGlhbnMoZGVncmVlcykge1xyXG5cdFx0cmV0dXJuIGRlZ3JlZXMgKiBwaUJ5SGFsZjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIGNvbnZlcnQgcmFkaWFucyB0byBkZWdyZWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gcmFkaWFucyAtIHRoZSBkZWdyZWUgdmFsdWUgdG8gY29udmVydC5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRyYWRpYW5zVG9EZWdyZWVzOiBmdW5jdGlvbiByYWRpYW5zVG9EZWdyZWVzKHJhZGlhbnMpIHtcclxuXHRcdHJldHVybiByYWRpYW5zICogaGFsZkJ5UGk7XHJcblx0fSxcclxuXHJcblx0LypcclxuIHJldHVybiB1c2VmdWwgVHJpZ29ub21pYyB2YWx1ZXMgZnJvbSBwb3NpdGlvbiBvZiAyIG9iamVjdHMgaW4geC95IHNwYWNlXHJcbiB3aGVyZSB4MS95MSBpcyB0aGUgY3VycmVudCBwb2lzdGlvbiBhbmQgeDIveTIgaXMgdGhlIHRhcmdldCBwb3NpdGlvblxyXG4gKi9cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIGNhbGN1bGF0ZSB0cmlnb21vbWljIHZhbHVlcyBiZXR3ZWVuIDIgdmVjdG9yIGNvb3JkaW5hdGVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geDEgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MSAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHgyIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geTIgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IENhbGN1bGF0aW9uXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkaXN0YW5jZSBUaGUgZGlzdGFuY2UgYmV0d2VlbiB2ZWN0b3JzXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBhbmdsZSBUaGUgYW5nbGUgYmV0d2VlbiB2ZWN0b3JzXHJcbiAqIEByZXR1cm5zIHsgQ2FsY3VsYXRpb24gfSB0aGUgY2FsY3VsYXRlZCBhbmdsZSBhbmQgZGlzdGFuY2UgYmV0d2VlbiB2ZWN0b3JzXHJcbiAqL1xyXG5cdGdldEFuZ2xlQW5kRGlzdGFuY2U6IGZ1bmN0aW9uIGdldEFuZ2xlQW5kRGlzdGFuY2UoeDEsIHkxLCB4MiwgeTIpIHtcclxuXHJcblx0XHQvLyBzZXQgdXAgYmFzZSB2YWx1ZXNcclxuXHRcdHZhciBkWCA9IHgyIC0geDE7XHJcblx0XHR2YXIgZFkgPSB5MiAtIHkxO1xyXG5cdFx0Ly8gZ2V0IHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBwb2ludHNcclxuXHRcdHZhciBkID0gTWF0aC5zcXJ0KGRYICogZFggKyBkWSAqIGRZKTtcclxuXHRcdC8vIGFuZ2xlIGluIHJhZGlhbnNcclxuXHRcdC8vIHZhciByYWRpYW5zID0gTWF0aC5hdGFuMih5RGlzdCwgeERpc3QpICogMTgwIC8gTWF0aC5QSTtcclxuXHRcdC8vIGFuZ2xlIGluIHJhZGlhbnNcclxuXHRcdHZhciByID0gTWF0aC5hdGFuMihkWSwgZFgpO1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZGlzdGFuY2U6IGQsXHJcblx0XHRcdGFuZ2xlOiByXHJcblx0XHR9O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gZ2V0IG5ldyBYIGNvb3JkaW5hdGUgZnJvbSBhbmdsZSBhbmQgZGlzdGFuY2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWRpYW5zIC0gdGhlIGFuZ2xlIHRvIHRyYW5zZm9ybSBpbiByYWRpYW5zLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSB0aGUgZGlzdGFuY2UgdG8gdHJhbnNmb3JtLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdGdldEFkamFjZW50TGVuZ3RoOiBmdW5jdGlvbiBnZXRBZGphY2VudExlbmd0aChyYWRpYW5zLCBkaXN0YW5jZSkge1xyXG5cdFx0cmV0dXJuIE1hdGguY29zKHJhZGlhbnMpICogZGlzdGFuY2U7XHJcblx0fVxyXG5cclxufSwgX2RlZmluZVByb3BlcnR5KF90cmlnb25vbWljVXRpbHMsIFwiZ2V0QWRqYWNlbnRMZW5ndGhcIiwgZnVuY3Rpb24gZ2V0QWRqYWNlbnRMZW5ndGgocmFkaWFucywgZGlzdGFuY2UpIHtcclxuXHRyZXR1cm4gTWF0aC5zaW4ocmFkaWFucykgKiBkaXN0YW5jZTtcclxufSksIF9kZWZpbmVQcm9wZXJ0eShfdHJpZ29ub21pY1V0aWxzLCBcImZpbmROZXdQb2ludFwiLCBmdW5jdGlvbiBmaW5kTmV3UG9pbnQoeCwgeSwgYW5nbGUsIGRpc3RhbmNlKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHg6IE1hdGguY29zKGFuZ2xlKSAqIGRpc3RhbmNlICsgeCxcclxuXHRcdHk6IE1hdGguc2luKGFuZ2xlKSAqIGRpc3RhbmNlICsgeVxyXG5cdH07XHJcbn0pLCBfZGVmaW5lUHJvcGVydHkoX3RyaWdvbm9taWNVdGlscywgXCJjYWxjdWxhdGVWZWxvY2l0aWVzXCIsIGZ1bmN0aW9uIGNhbGN1bGF0ZVZlbG9jaXRpZXMoeCwgeSwgYW5nbGUsIGltcHVsc2UpIHtcclxuXHR2YXIgYTIgPSBNYXRoLmF0YW4yKE1hdGguc2luKGFuZ2xlKSAqIGltcHVsc2UgKyB5IC0geSwgTWF0aC5jb3MoYW5nbGUpICogaW1wdWxzZSArIHggLSB4KTtcclxuXHRyZXR1cm4ge1xyXG5cdFx0eFZlbDogTWF0aC5jb3MoYTIpICogaW1wdWxzZSxcclxuXHRcdHlWZWw6IE1hdGguc2luKGEyKSAqIGltcHVsc2VcclxuXHR9O1xyXG59KSwgX2RlZmluZVByb3BlcnR5KF90cmlnb25vbWljVXRpbHMsIFwicmFkaWFsRGlzdHJpYnV0aW9uXCIsIGZ1bmN0aW9uIHJhZGlhbERpc3RyaWJ1dGlvbihjeCwgY3ksIHIsIGEpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0eDogY3ggKyByICogTWF0aC5jb3MoYSksXHJcblx0XHR5OiBjeSArIHIgKiBNYXRoLnNpbihhKVxyXG5cdH07XHJcbn0pLCBfdHJpZ29ub21pY1V0aWxzKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnRyaWdvbm9taWNVdGlscyA9IHRyaWdvbm9taWNVdGlsczsiLCJmdW5jdGlvbiBnZXRWYWx1ZShwYXRoLCBvcmlnaW4pIHtcclxuICAgIGlmIChvcmlnaW4gPT09IHZvaWQgMCB8fCBvcmlnaW4gPT09IG51bGwpIG9yaWdpbiA9IHNlbGYgPyBzZWxmIDogdGhpcztcclxuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHBhdGggPSAnJyArIHBhdGg7XHJcbiAgICB2YXIgYyA9ICcnLFxyXG4gICAgICAgIHBjLFxyXG4gICAgICAgIGkgPSAwLFxyXG4gICAgICAgIG4gPSBwYXRoLmxlbmd0aCxcclxuICAgICAgICBuYW1lID0gJyc7XHJcbiAgICBpZiAobikgd2hpbGUgKGkgPD0gbikge1xyXG4gICAgICAgIChjID0gcGF0aFtpKytdKSA9PSAnLicgfHwgYyA9PSAnWycgfHwgYyA9PSAnXScgfHwgYyA9PSB2b2lkIDAgPyAobmFtZSA/IChvcmlnaW4gPSBvcmlnaW5bbmFtZV0sIG5hbWUgPSAnJykgOiBwYyA9PSAnLicgfHwgcGMgPT0gJ1snIHx8IHBjID09ICddJyAmJiBjID09ICddJyA/IGkgPSBuICsgMiA6IHZvaWQgMCwgcGMgPSBjKSA6IG5hbWUgKz0gYztcclxuICAgIH1pZiAoaSA9PSBuICsgMikgdGhyb3cgXCJJbnZhbGlkIHBhdGg6IFwiICsgcGF0aDtcclxuICAgIHJldHVybiBvcmlnaW47XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmdldFZhbHVlID0gZ2V0VmFsdWU7Il19
