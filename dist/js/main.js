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

let blurBuffer = 5;

// w = 210, h = 110
c.width = 160 + ( blurBuffer * 2 );
c.height = 100 + ( blurBuffer * 2 );

cH = c.width / 2;
cV = c.height / 2;

// spot radius: ( 100 - 10 ) / 2 = 45 
let cSR = ( c.height - ( blurBuffer * 2 ) ) / 2;

// 105 / 4 = 26.25
let cSO = (cH / 4) * 1.4;

// 100 + 26.25 = 126.25
let redShift = cH + cSO;

// 100 - 26.25 = 73.75
let blueShift = cH - cSO;

function createWarpStarImage() {

	let gRed = ctx.createRadialGradient( redShift, cV, 0, redShift, cV, cSR );
	gRed.addColorStop( 0, 'rgba( 255, 0, 0, 1 )' );
	gRed.addColorStop( 1, 'rgba( 255, 0, 0, 0 )' );

	let gGreen = ctx.createRadialGradient( cH, cV, 0, cH, cV, cSR );
	gGreen.addColorStop( 0, 'rgba( 0, 255, 0, 1 )' );
	gGreen.addColorStop( 1, 'rgba( 0, 255, 0, 0 )' );

	let gBlue = ctx.createRadialGradient( blueShift, cV, 0, blueShift, cV, cSR );
	gBlue.addColorStop( 0, 'rgba( 0, 0, 255, 1 )' );
	gBlue.addColorStop( 1, 'rgba( 0, 0, 255, 0 )' );

	ctx.globalCompositeOperation = 'lighter';

	ctx.filter = "blur( 1px )";

	ctx.fillStyle = gRed;
	ctx.fillCircle( redShift, cV, cSR, c );

	ctx.fillStyle = gGreen;
	ctx.fillCircle( cH, cV, cSR, c );

	ctx.fillStyle = gBlue;
	ctx.fillCircle( blueShift, cV, cSR, c );


	// ctx.translate( cH, cV );
	// ctx.scale( 1.25, 0.5 );
	// let gWhite = ctx.createRadialGradient( 0, 0, 0, 0, 0, cSR );
	// gWhite.addColorStop( 0.3, 'rgba( 255, 255, 255, 0.8 )' );
	// gWhite.addColorStop( 1, 'rgba( 255, 255, 255, 0 )' );

	// ctx.fillStyle = gWhite;
	// ctx.fillCircle( 0, 0, cSR, c );

	// ctx.scale( 1, 2 );
	// ctx.translate( -cH, -cV );

	c.renderProps = {
		src: {
			x: 0, y: 0, w: c.width, h: c.height
		},
		dest: {
			x: -cH, y: -cV
		}
	}
	// console.log( 'c: ', c.renderProps );

	$( '.warpStarImageCanvas' ).append( c );

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

EmitterStoreFn.prototype.update = function ( store ) {
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
        min: 4,
        max: 10,

        decay: {
          rate: 0,
          decayMax: 0
        }
      },

      // emission repeater config
      repeater: {
        // what is the repetition rate ( frames )
        rate: 2,
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
        min: 0.05,
        max: 0.15
      }
    }

  };

  module.exports.warpStreamTheme = warpStreamTheme;
},{}],19:[function(require,module,exports){
require( './particles.js' );
},{"./particles.js":47}],20:[function(require,module,exports){
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
    let k = p.killConditions;
    let kCol = k.colorCheck;
    let kAttr = k.perAttribute;
    let kBO = k.boundaryOffset;

    if ( kCol.length > 0 ) {
        for ( let i = kCol.length - 1; i >= 0; i-- ) {
            let col = kCol[ i ];
            if ( p.color4Data[ col.name ] <= col.value) {
                return true;
            }
        }
    }

    if ( kAttr.length > 0 ) {
        for ( let i = kAttr.length - 1; i >= 0; i-- ) {
            let attr = kAttr[ i ];
            if ( p[ attr.name ] <= attr.value ) {
                return true;
            }
        }
    }

    if ( k.boundaryCheck === true ) {
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
let trig = require('./../trigonomicUtils.js').trigonomicUtils;
let mathUtils = require('./../mathUtils.js').mathUtils;
let getValue = require('./../utilities.js').getValue;

let PI = Math.PI;
let rand = mathUtils.random;

function createAnimationTracks( arr, ppa ) {
    var animArr = [];
    var splChrs = '.';

    if (arr && arr.length > 0) {
        let arrLen = arr.length;
        for (let i = arrLen - 1; i >= 0; i--) {

            var t = arr[i];
            var prm = t.param.split(splChrs);
            var prmTemp = { path: prm, pathLen: prm.length };
            var baseVal = getValue( t.baseAmount, ppa );
            var targetVal = void 0;
            
            if ( t.targetValuePath ) {

                if ( getValue( t.targetValuePath, ppa ) === 0 ) {
                    targetVal = baseVal * -1;
                } else {
                    targetVal = getValue( t.targetValuePath, ppa ) - baseVal;
                }
            } else if ( t.targetAmount ) {
                targetVal = t.targetAmount;
            }

            var duration = 60 * t.duration;
            // let life = ppa.lifeSpan;
            // t.duration === 'life' ? duration = life : t.duration < 1 ? duration = life * t.duration : t.duration > 1 ? duration = life : false;

            let thisAnim = {
                animName: t.animName,
                active: t.active,
                param: prmTemp,
                baseAmount: t.baseAmount,
                targetAmount: t.targetValuePath, 
                currTick: 0,
                duration: duration,
                easing: t.easing,
                linkedAnim: t.linkedAnim,
                linkedEvent: t.linkedEvent
            }
            // console.log( 'thisAnim: ', thisAnim );
            animArr.push( thisAnim );
        }

        return animArr;
    }

    return false;

};


function linkCreationAttributes( item ) {

}


var createPerParticleAttributes = function createPerParticleAttributes(x, y, emissionOpts, perParticleOpts) {
    // let themed = perParticleOpts.theme || themes.reset;

    // direct particle options from theme
    var themed = perParticleOpts || themes.reset;
    var emitThemed = emissionOpts || false;
    var lifeSpan = mathUtils.randomInteger(themed.life.min, themed.life.max);
    // use bitwise to check for odd/even life vals. Make even to help with anims that are fraction of life (frames)
    lifeSpan & 1 ? lifeSpan++ : false;

    // emmiter based attributes
    var emission = emitThemed.emission || emitThemed;
    
    let dir = emission.direction;
    var direction = dir.rad > 0 ? dir.rad : mathUtils.getRandomArbitrary(dir.min, dir.max) * PI;
    
    let imp = emission.impulse;
    var impulse = imp.pow > 0 ? imp.pow : rand( imp.min, imp.max);

    // set new particle origin dependent on the radial displacement
    if ( emission.radialDisplacement > 0 ) {
        var newCoords = trig.radialDistribution(x, y, emission.radialDisplacement + rand( emission.radialDisplacementOffset * -1, emission.radialDisplacementOffset), direction);

        x = newCoords.x;
        y = newCoords.y;
    }

    var velocities = trig.calculateVelocities(x, y, direction, impulse);

    
    // theme based attributes

    var initR = rand( themed.radius.min, themed.radius.max );
    var acceleration = rand( themed.velAcceleration.min, themed.velAcceleration.max );
    this.acceleration = acceleration;
    var targetRadius = rand( themed.targetRadius.min, themed.targetRadius.max) ;

    let tempStore = {};
    // console.log( 'themed.linkCreationAttributes: ', themed.linkCreationAttributes );
    if ( themed.linkCreationAttributes && themed.linkCreationAttributes.length > 0 ) {
        // console.log( 'themed.linkCreationAttributes true: ');
        // console.log( 'themed.linkCreationAttributes: ', themed.linkCreationAttributes );
        let linkCreationAttributesLen = themed.linkCreationAttributes.length;
        for ( let i = linkCreationAttributesLen - 1; i >= 0; i-- ) {

            let thisLink = themed.linkCreationAttributes[ i ];

            let srcAttr = thisLink.src;
            let targetAttr = thisLink.target;
            let attr = thisLink.attr;

            tempStore[ attr ] = {
                value: mathUtils.map(
                    this[ thisLink.srcValue ],
                    themed[ srcAttr ].min, themed[ srcAttr ].max,
                    themed[ targetAttr ].min, themed[ targetAttr ].max
                      )
            }

        }


    } else {
        // console.log( 'themed.linkCreationAttributes false: ');
    }


    var initColor = themed.colorProfiles[0];
    var color4Data = { r: initColor.r, g: initColor.g, b: initColor.b, a: initColor.a };

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

    // let tempCheck = tempStore.targetRadius ? true : false;
    // if ( tempCheck ) {
    //     console.log( 'temp target radius exists' );
    // } else {
    //     console.log( 'temp target radius NOT exists' );
    // }

    var ppa = {
        active: perParticleOpts.active || themed.active || 0,
        initR: tempStore.initR ? tempStore.initR.value : initR,
        targetRadius: tempStore.targetRadius ? tempStore.targetRadius.value : targetRadius,
        lifeSpan: tempStore.lifeSpan ? tempStore.lifeSpan.value : lifeSpan,
        angle: direction,
        magnitude: impulse,
        relativeMagnitude: impulse,
        magnitudeDecay: themed.magDecay,
        x: x,
        y: y,
        xOld: x,
        yOld: y,
        vel: 0,
        xVel: velocities.xVel,
        yVel: velocities.yVel,
        vAcc: acceleration,
        applyForces: themed.applyGlobalForces,
        globalAlpha: themed.globalAlpha,
        globalAlphaInitial: themed.globalAlphaInitial,
        globalAlphaTarget: themed.globalAlphaTarget,
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

    ppa.animationTracks = createAnimationTracks( themed.animationTracks, ppa );

    return ppa;
};

module.exports.createPerParticleAttributes = createPerParticleAttributes;
},{"./../mathUtils.js":21,"./../trigonomicUtils.js":48,"./../utilities.js":49}],26:[function(require,module,exports){
var killParticle = function killParticle(list, index, entityCounter) {
    var self = this;
    self.isAlive = 0;
    list.insert(index);
    entityCounter.subtract(1);
};

module.exports.killParticle = killParticle;
},{}],27:[function(require,module,exports){
var renderParticleArr = function renderParticleArr( context, arr, animation) {
    // var thisArr = arr;
    var arrLen = arr.length;

    // var rendered = 0;
    var notRendered = 0;

    for (var i = arrLen - 1; i >= 0; i--) {
        var p = arr[ i ];

        // p.isAlive != 0 ? ( p.render( p.x, p.y, p.r, p.color4Data, context), rendered++ ) : notRendered++;

        p.isAlive != 0 ?
            p.render( p.x, p.y, p.r, p.color4Data, context ) :
            notRendered++;

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
var trig = require('./../trigonomicUtils.js').trigonomicUtils;
var physics = environment.forces;

var updateParticle = function updateParticle( emitterArr ) {
    var p = this;
    var totalLifeTicks = p.lifeSpan;

    // position
    // p.x += p.xVel * p.magnitudeDecay;
    // p.y += p.yVel * p.magnitudeDecay;
    p.x += p.xVel;
    p.y += p.yVel;

    // p.vel = trig.dist( p.xOld, p.yOld, p.x, p.y );

    p.xOld = p.x;
    p.yOld = p.y;

    p.xVel *= p.vAcc;
    p.yVel *= p.vAcc;

    // p.yVel += physics.gravity;
    // p.xVel += physics.wind;
    // p.relativeMagnitude *= p.magnitudeDecay;

    // p.relativeMagnitude *= p.vAcc * 1.005;
    p.relativeMagnitude *= p.vAcc;
    
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

    let thisAnim = p.animationTracks[ 0 ];

    if ( thisAnim.active === true ) {

        if ( thisAnim.currTick == 0 ) {
            // console.log( 'anim start');
            p[ thisAnim.param.path[ 0 ] ] = thisAnim.baseAmount;
        } else {
            // console.log( 'anim progress');
            p[ thisAnim.param.path[ 0 ] ] = easing[ thisAnim.easing ]( thisAnim.currTick, thisAnim.baseAmount, thisAnim.targetAmount, thisAnim.duration );
        }
        

        if ( p.idx == 9987 ) {
            // console.log( 'thisValue: ', thisValue );
            // console.log( 'thisAnim.param.path[ 0 ]: ', thisAnim.param.path[ 0 ] );
            // console.log( 'thisAnim.baseAmount: ', thisAnim.baseAmount );
            // console.log( 'thisAnim.targetValuePath: ', thisAnim.targetAmount );
            // console.log( 'thisAnim.duration: ', thisAnim.duration );
        }

        // console.log( 'thisValue: ', thisValue );
        // p[ thisAnim.param.path[ 0 ] ] = thisValue;

        thisAnim.currTick++;

        if ( thisAnim.currTick >= thisAnim.duration ) {
            thisAnim.active = false;
        }
    }



    // if ( animTracks && animTracksLen > 0 ) {
    //     for ( var i = animTracksLen - 1; i >= 0; i-- ) {
    //         // console.log( 'i', i );
    //         var t = animTracks[ i ];

    //         if ( t.active === true ) {

    //             var paramPath = t.param.path,
    //                 paramLen = t.param.pathLen,
    //                 currTick = t.currTick;

    //             paramLen === 1 ? 
    //                 p[paramPath[ 0 ] ] = easing[ t.easing ]( currTick, t.baseAmount, t.targetAmount, t.duration ) :

    //                     paramLen === 2 ?
    //                         p[ paramPath[ 0 ] ][ paramPath[ 1 ] ] = easing[ t.easing ](currTick, t.baseAmount, t.targetAmount, t.duration ) :

    //                             paramLen === 3 ? p[ paramPath[ 0 ] ][ paramPath[ 1 ] ][ paramPath[ 2 ] ] = easing[ t.easing ]( currTick, t.baseAmount, t.targetAmount, t.duration ) :
    //                             false;


    //             t.currTick++;

    //             if (currTick >= t.duration) {
    //                 t.active = false;

    //                 if (t.linkedEvent !== false && typeof t.linkedEvent !== 'undefined') {

    //                     let particleEvents = p.events;

    //                     for (let j = particleEvents.length - 1; j >= 0; j--) {

    //                         let thisParticleEvent = p.events[ j ];
    //                         if (thisParticleEvent.eventType = t.linkedEvent) {
    //                             if (t.linkedEvent === 'emit') {

    //                                 let thisParticleEventParams = thisParticleEvent.eventParams;

    //                                 if ( typeof thisParticleEventParams.emitter !== 'undefined' ) {
    //                                     thisParticleEventParams.emitter.triggerEmitter({ x: p.x, y: p.y });
    //                                 } else {
    //                                     for (let k = emitterArr.length - 1; k >= 0; k--) {
    //                                         if (emitterArr[ k ].name === thisParticleEventParams.emitterName) {
    //                                             thisParticleEventParams.emitter = emitterArr[ k ];
    //                                             thisParticleEventParams.emitter.triggerEmitter({ x: p.x, y: p.y });
    //                                         }
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }

    //                 // if ( p.idx == 9987 ) {
    //                 //     console.warn( 'p.vel: ', p.vel );
    //                 // }

    //                 if ( t.linkedAnim !== false ) {

    //                     for ( let l = animTracksLen - 1; l >= 0; l-- ) {
    //                         if ( animTracks[ l ].animName === t.linkedAnim ) {
    //                             animTracks[ l ].active = true;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    // if ( p.idx == 9987 ) {
    //     console.log( 'p.vel',  p.vel );
    // }

    // life taketh away
    p.currLife--;
};

module.exports.updateParticle = updateParticle;
},{"./../easing.js":12,"./../environment.js":20,"./../trigonomicUtils.js":48}],29:[function(require,module,exports){
let particleFn = require('./../particleFn.js').particleFn;

let updateParticleArr = function updateParticleArr( storeArr, poolArr, animation, canvasConfig, entityCounter, emitterStore) {
    // loop housekeeping

    let arrLen = storeArr.length - 1;
    for ( let i = arrLen; i >= 0; i-- ) {
        let p = storeArr[i];
        p.isAlive != 0 ? particleFn.checkParticleKillConditions(p, canvasConfig.width, canvasConfig.height) ? p.kill(poolArr, p.idx, entityCounter) : p.update(emitterStore) : false;
    } // end For loop
    // liveEntityCount === 0 ? ( console.log( 'liveEntityCount === 0 stop anim' ), animation.state = false ) : 0;

};

module.exports.updateParticleArr = updateParticleArr;
},{"./../particleFn.js":23}],30:[function(require,module,exports){
let fireTheme = require('./themes/fire/theme.js').fireTheme;
let resetTheme = require('./themes/reset/resetTheme.js').resetTheme;
let warpStarTheme = require('./themes/warpStar/theme.js').warpStarTheme;
let flameTheme = require('./themes/flame/flameTheme.js').flameTheme;
let smokeTheme = require('./themes/smoke/smokeTheme.js').smokeTheme;

let themes = {
   reset: resetTheme,
   fire: fireTheme,
   warpStar: warpStarTheme,
   flame: flameTheme,
   smoke: smokeTheme
};

module.exports.themes = themes;
},{"./themes/fire/theme.js":35,"./themes/flame/flameTheme.js":36,"./themes/reset/resetTheme.js":37,"./themes/smoke/smokeTheme.js":38,"./themes/warpStar/theme.js":46}],31:[function(require,module,exports){
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
},{"./../../../mathUtils.js":21,"./../../../trigonomicUtils.js":48}],35:[function(require,module,exports){
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
},{"./../../../colorUtils.js":9,"./../../../mathUtils.js":21,"./../../../trigonomicUtils.js":48}],37:[function(require,module,exports){
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
    globalAlphaInitial: 0,
    globalAlphaTarget: 0,
    globalAlpha: 0,
    linkCreationAttributes: [],
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
let animationTracks = [
    // {
    //     animName: 'radiusGrow',
    //     active: true,
    //     param: 'r',
    //     baseAmount: 'initR',
    //     targetValuePath: 'targetRadius',
    //     duration: 'life',
    //     easing: 'linearEase',
    //     linkedAnim: false
    // },
    {
        animName: 'fadeIn',
        active: true,
        param: 'globalAlpha',
        baseAmount: 0,
        targetValuePath: 1,
        duration: 4,
        easing: 'easeInCubic',
        linkedAnim: false
    }
]

module.exports.animationTracks = animationTracks;
},{}],40:[function(require,module,exports){
let colorProfiles = [
	{ r: 255, g: 255, b: 255, a: 0 }, { r: 255, g: 255, b: 255, a: 1 }
];

module.exports.colorProfiles = colorProfiles;
},{}],41:[function(require,module,exports){
let customAttributes = {
    lensFlare: {
        mightFlare: true,
        willFlare: false,
        angle: 1.50
    }
};

module.exports.customAttributes = customAttributes;
},{}],42:[function(require,module,exports){
let killConditions = {
    boundaryCheck: true,
    boundaryOffset: 400,
    colorCheck: [],
    perAttribute: []
};

module.exports.killConditions = killConditions;
},{}],43:[function(require,module,exports){
let linkCreationAttributes = [
	{	
		type: 'map',
		function: 'linear',
		src: 'velAcceleration',
		srcValue: 'acceleration',
		target: 'targetRadius',
		attr: 'targetRadius'
	},
	{	
		type: 'map',
		function: 'linear',
		src: 'velAcceleration',
		srcValue: 'acceleration',
		target: 'radius',
		attr: 'initR'
	}
];

module.exports.linkCreationAttributes = linkCreationAttributes;
},{}],44:[function(require,module,exports){
// utilities
let mathUtils = require('./../../../mathUtils.js').mathUtils;
let trig = require('./../../../trigonomicUtils.js').trigonomicUtils;
let coloring = require('./../../../colorUtils.js').colorUtils;
let easing = require('./../../../easing.js').easingEquations;
let rgba = coloring.rgba;
let createWarpStarImage = require('./../../../createWarpStarImage.js');
let warpStarImage = createWarpStarImage();

let easeFn = easing.easeInExpo;

let easeStartVal = 0;
let easeDeltaVal = 2000;
let easeInputMaxVal = 10;

function memStretch( mag ) {
    // console.log( 'magnitude outside: ', magnitude );
    let cache = {};

    return ( function( mag ) {

        // stringify the mag number primitive for pointer selection 
        let magStr = mag.toString();
        console.log( 'magStr: ', magStr );
        if ( magStr in cache ) {
            // console.log( 'CACHED value' );
            return cache[ magStr ];
        } else {
            // console.log( 'NEW value' );
            let result = easeFn( mag, easeStartVal, easeDeltaVal, easeInputMaxVal );
            // console.log( 'magnitude.toString(): ', magnitude.toString() );
            cache[ magStr ] = result;
            return result;
        }

    })( mag );

}



const memoizedAdd = () => {
    let cache = {};
    return (n) => {
        if (n in cache) {
            console.log('Fetching from cache');
            return cache[n];
        } else {
            console.log('Calculating result');
            let result = n + 10;
            cache[n] = result;
            return result;
        }       
    }
}





renderFn: function renderFn(x, y, r, colorData, c ) {
    let p = this;
    let vel = parseFloat( p.relativeMagnitude.toFixed( 2 ) );
    let thisR = r * 2;

    // let stretchVal = mathUtils.map( vel, 0, 200, 1, 4000 );

    let stretchVal = easeFn( vel, easeStartVal, easeDeltaVal, easeInputMaxVal );
    // let stretchVal = memStretch( vel );

    let longR = r * stretchVal;
    // var stretchVal = ( r * ( ( 50 * vel ) * vel ) ) * vel;
    // var chromeVal = mathUtils.map(stretchVal, 0, 10, 1, 4);
    
    // context.save();
    // c.translate( x, y );
    // c.rotate( p.angle );

    let spinCos = Math.cos( p.angle );
    let spinSin = Math.sin( p.angle );

    c.setTransform( spinCos, spinSin, -spinSin, spinCos, x, y );
    // if ( p.idx === 9997 ) {
    //     console.log( p.idx + ' - '+ p.globalAlpha );
    // }
    c.globalAlpha = p.globalAlpha;
    // c.globalAlpha = 1;
    let renderProps = warpStarImage.renderProps;

    c.drawImage(
        warpStarImage,
        0, 0, renderProps.src.w, renderProps.src.h,
        0, -( thisR / 2 ), longR, thisR
    );

    c.resetTransform();
    c.globalAlpha = 1;
    // if ( p.idx === 9997 || p.idx === 9995 ) {
    //     console.log( p.idx + ' - '+ p.globalAlpha );
    // }
    // c.rotate( -p.angle );
    // c.translate( -x, -y );
}

module.exports.renderFn = renderFn;
},{"./../../../colorUtils.js":9,"./../../../createWarpStarImage.js":10,"./../../../easing.js":12,"./../../../mathUtils.js":21,"./../../../trigonomicUtils.js":48}],45:[function(require,module,exports){
let renderProfiles = [
	{ shape: 'Circle', colorProfileIdx: 0 }, { shape: 'Circle', colorProfileIdx: 1 }, { shape: 'Circle', colorProfileIdx: 2 }
];

module.exports.renderProfiles = renderProfiles;
},{}],46:[function(require,module,exports){
// utilities
var mathUtils = require('./../../../mathUtils.js').mathUtils;
var coloring = require('./../../../colorUtils.js').colorUtils;
var rgba = coloring.rgba;

// theme partials
var renderFn = require('./renderFn.js').renderFn;
var animationTracks = require('./animationTracks.js').animationTracks;
var killConditions = require('./killConditions.js').killConditions;
var customAttributes = require('./customAttributes.js').customAttributes;
var linkCreationAttributes = require('./linkCreationAttributes.js').linkCreationAttributes;
var renderProfiles = require('./renderProfiles.js').renderProfiles;
var colorProfiles = require('./colorProfiles.js').colorProfiles;

var warpStarTheme = {
    contextBlendingMode: 'source-over',
    active: 1,
    life: { min: 50, max: 100 },
    angle: { min: 0, max: 2 },
    // velAcceleration: 1.05,
    velAcceleration: { min: 1.001, max: 1.015 },
    magDecay: 1,
    radius: { min: 1, max: 1.5 },
    targetRadius: { min: 4, max: 20 },
    globalAlphaInitial: 0,
    globalAlphaTarget: 1,
    globalAlpha: 0,
    linkCreationAttributes: linkCreationAttributes, 
    applyGlobalForces: false,
    colorProfiles: colorProfiles,
    renderProfiles: renderProfiles,
    customAttributes: customAttributes,
    animationTracks: animationTracks,
    killConditions: killConditions,
    renderParticle: renderFn
};

module.exports.warpStarTheme = warpStarTheme;
},{"./../../../colorUtils.js":9,"./../../../mathUtils.js":21,"./animationTracks.js":39,"./colorProfiles.js":40,"./customAttributes.js":41,"./killConditions.js":42,"./linkCreationAttributes.js":43,"./renderFn.js":44,"./renderProfiles.js":45}],47:[function(require,module,exports){
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

// Particle engine machinery
var EmitterEntity = require('./EmitterEntity.js').EmitterEntity;
var EmitterStoreFn = require('./emitterStore.js').EmitterStoreFn;
var particleFn = require('./particleFn.js').particleFn;
var particleArrFn = require('./particleArrFn.js').particleArrFn;

// Emitter themes
var singleBurstTheme = require('./emitterThemes/singleBurstTheme/singleBurstTheme.js').singleBurstTheme;
var baseEmitterTheme = require('./emitterThemes/baseEmitter/baseEmitterTheme.js').baseEmitterTheme;
var warpStreamTheme = require('./emitterThemes/warpStream/warpStreamTheme.js').warpStreamTheme;
var flameStreamTheme = require('./emitterThemes/flameStream/flameStreamTheme.js').flameStreamTheme;
var smokeStreamTheme = require('./emitterThemes/smokeStream/smokeStreamTheme.js').smokeStreamTheme;

// particle themes
var themes = require('./particleThemes/themes.js').themes;


// cache canvas w/h
let canW = window.innerWidth;
let canH = window.innerHeight;
let canvasCentreH = canW / 2;
let canvasCentreV = canH / 2;

let blitCanvas = document.createElement('canvas');
let blitCtx = blitCanvas.getContext("2d" );
blitCanvas.id = 'blitterCanvas';
blitCanvas.width = canW;
blitCanvas.height = canH;
// blitCtx.filter = "blur(1px)";
blitCanvas.imageSmoothingEnabled = true;

let canvas = document.querySelector("#test-base");
let ctx = canvas.getContext("2d", { alpha: false } );
canvas.width = canW;
canvas.height = canH;
ctx.imageSmoothingEnabled = true;

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
    // console.log( 'initial particle: ', entityStore[ i ] );
    entityPool.insert('' + i);
}

// console.log( 'initial particle: ', entityStore[ 9997 ] );

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
    mouseClickEvent: false,
    randomBurst: false,
    steadyStream: true
};


let holeGrad = ctx.createRadialGradient( canvasCentreH, canvasCentreV, 0, canvasCentreH, canvasCentreV, 200 );
holeGrad.addColorStop( 0, 'rgba( 0, 0, 0, 1 )' );
holeGrad.addColorStop( 1, 'rgba( 0, 0, 0, 0 )' );

let streamEmmisionLimiter = false;

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


function registerMouseMove( event ) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
};

document.addEventListener('mousemove', registerMouseMove);

if (currEmmissionType.mouseClickEvent) {
    registerMouseClickEmmision();
}

if (currEmmissionType.steadyStream) {

    var testEmitter = new EmitterEntity('testEmitter', currEmitterTheme, currTheme, emitEntities);
    emitterStore.push(testEmitter);

    testEmitter.triggerEmitter({
        x: canvasConfig.centerH,
        y: canvasConfig.centerV
    });

    // testEmitter.triggerEmitter({
    //     x: mouseX,
    //     y: mouseY
    // });

    // console.log( 'emitterStore[ 9997 ]', emitterStore[ 9997] );
    if (animation.state !== true) {
        animation.state = true;
        update();
    }
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
    p.globalAlpha = ppa.globalAlpha;
    p.globalAlphaInitial = ppa.globalAlphaInitial;
    p.globalAlphaTarget = ppa.globalAlphaTarget;
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
    setParticleAttributes( newParticle, particleFn.createPerParticleAttributes( thisX, thisY, emissionOpts, particleOpts ) );
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
    for ( let i = count - 1; i >= 0; i-- ) {

        if (entityPool.getSize() > 0) {
            entityStore[ entityPool.getTailNode().getData() ].reincarnate( x, y, emissionOptions, particleOptions );
            addedFromPool++;
            entityPool.remove();
        } else {
            entityStore.push( createLiveParticle( x, y, entityStoreLen, emissionOptions, particleOptions ) );
            entityPool.insert('' + entityStoreLen);
            addedNew++;
            entityStoreLen++;
        }
    }
    // console.log( "addedFromPool: '%d', addedNew: '%d'", addedFromPool, addedNew );
    // console.warn( 'addedNew: ', addedNew );
}

function updateEmitterStoreMembers() {

    for ( let i = emitterStore.length - 1; i >= 0; i-- ) {
        emitterStore[ i ].updateEmitter();
        // emitterStore[i].renderEmitter( ctx );
    }
}

// runtime fN members
function displayDebugging() {
    // ctx.globalAlpha = 1;
    // debug.debugOutput(canvas, ctx, 'Animation Counter: ', counter, 0);
    // debug.debugOutput(canvas, ctx, 'Particle Pool: ', entityStore.length, 1);
    // debug.debugOutput(canvas, ctx, 'Live Entities: ', runtimeConfig.liveEntityCount, 2, { min: entityStore.length, max: 0 });
    debug.debugOutput(canvas, ctx, 'FPS: ', Math.round(debug.calculateFps()), 3, { min: 0, max: 60 });
}


function updateCycle() {

    // if ( currEmmissionType.steadyStream === true ) {
    //     if ( streamEmmisionLimiter === false ) {
    //         testEmitter.triggerEmitter({
    //             x: canvasConfig.centerH,
    //             y: canvasConfig.centerV
    //         });
    //         streamEmmisionLimiter = true;
    //         animation.state = true;
    //     }
    // }


    // rendering
    
    particleArrFn.renderParticleArr( blitCtx, entityStore, animation );
    // blitCtx.filter = "blur(0px)";
    // blit to onscreen
    ctx.drawImage( blitCanvas, 0, 0 );
    // ctx.fillStyle = holeGrad;
    // ctx.fillCircle( canvasCentreH, canvasCentreV, 200 );

    // updating
    particleArrFn.updateParticleArr( entityStore, entityPool, animation, canvasConfig, runtimeConfig, emitterStore );

    updateEmitterStoreMembers();

}

function clearCanvas( ctx ) {

    // cleaning
    ctx.fillStyle = 'black';
    ctx.fillRect( 0, 0, canW, canH );
    // ctx.clearRect( 0, 0, canW, canH );
    // ctx.clearRect( bufferClearRegion.x, bufferClearRegion.y, bufferClearRegion.w, bufferClearRegion.h );
    blitCtx.clearRect( 0, 0, canW, canH );


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
    clearCanvas( ctx );

    // blending
    if ( blitCtx.globalCompositeOperation != currTheme.contextBlendingMode ) {
        blitCtx.globalCompositeOperation = currTheme.contextBlendingMode;
    }

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
},{"./EmitterEntity.js":6,"./animation.js":7,"./canvasApiAugmentation.js":8,"./colorUtils.js":9,"./debugUtils.js":11,"./easing.js":12,"./emitterStore.js":13,"./emitterThemes/baseEmitter/baseEmitterTheme.js":14,"./emitterThemes/flameStream/flameStreamTheme.js":15,"./emitterThemes/singleBurstTheme/singleBurstTheme.js":16,"./emitterThemes/smokeStream/smokeStreamTheme.js":17,"./emitterThemes/warpStream/warpStreamTheme.js":18,"./environment.js":20,"./mathUtils.js":21,"./particleArrFn.js":22,"./particleFn.js":23,"./particleThemes/themes.js":30,"./trigonomicUtils.js":48,"dbly-linked-list":1,"object-path":5}],48:[function(require,module,exports){
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
},{}],49:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGJseS1saW5rZWQtbGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kYmx5LWxpbmtlZC1saXN0L2xpYi9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9kYmx5LWxpbmtlZC1saXN0L2xpYi9saXN0LW5vZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmlzZXF1YWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LXBhdGgvaW5kZXguanMiLCJzcmMvanMvRW1pdHRlckVudGl0eS5qcyIsInNyYy9qcy9hbmltYXRpb24uanMiLCJzcmMvanMvY2FudmFzQXBpQXVnbWVudGF0aW9uLmpzIiwic3JjL2pzL2NvbG9yVXRpbHMuanMiLCJzcmMvanMvY3JlYXRlV2FycFN0YXJJbWFnZS5qcyIsInNyYy9qcy9kZWJ1Z1V0aWxzLmpzIiwic3JjL2pzL2Vhc2luZy5qcyIsInNyYy9qcy9lbWl0dGVyU3RvcmUuanMiLCJzcmMvanMvZW1pdHRlclRoZW1lcy9iYXNlRW1pdHRlci9iYXNlRW1pdHRlclRoZW1lLmpzIiwic3JjL2pzL2VtaXR0ZXJUaGVtZXMvZmxhbWVTdHJlYW0vZmxhbWVTdHJlYW1UaGVtZS5qcyIsInNyYy9qcy9lbWl0dGVyVGhlbWVzL3NpbmdsZUJ1cnN0VGhlbWUvc2luZ2xlQnVyc3RUaGVtZS5qcyIsInNyYy9qcy9lbWl0dGVyVGhlbWVzL3Ntb2tlU3RyZWFtL3Ntb2tlU3RyZWFtVGhlbWUuanMiLCJzcmMvanMvZW1pdHRlclRoZW1lcy93YXJwU3RyZWFtL3dhcnBTdHJlYW1UaGVtZS5qcyIsInNyYy9qcy9lbnRyeS5qcyIsInNyYy9qcy9lbnZpcm9ubWVudC5qcyIsInNyYy9qcy9tYXRoVXRpbHMuanMiLCJzcmMvanMvcGFydGljbGVBcnJGbi5qcyIsInNyYy9qcy9wYXJ0aWNsZUZuLmpzIiwic3JjL2pzL3BhcnRpY2xlRnVuY3Rpb25zL2NoZWNrUGFydGljbGVLaWxsQ29uZGl0aW9ucy5qcyIsInNyYy9qcy9wYXJ0aWNsZUZ1bmN0aW9ucy9jcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMuanMiLCJzcmMvanMvcGFydGljbGVGdW5jdGlvbnMva2lsbFBhcnRpY2xlLmpzIiwic3JjL2pzL3BhcnRpY2xlRnVuY3Rpb25zL3JlbmRlclBhcnRpY2xlQXJyLmpzIiwic3JjL2pzL3BhcnRpY2xlRnVuY3Rpb25zL3VwZGF0ZVBhcnRpY2xlLmpzIiwic3JjL2pzL3BhcnRpY2xlRnVuY3Rpb25zL3VwZGF0ZVBhcnRpY2xlQXJyLmpzIiwic3JjL2pzL3BhcnRpY2xlVGhlbWVzL3RoZW1lcy5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvZmlyZS9hbmltYXRpb25UcmFja3MuanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL2ZpcmUvY3VzdG9tQXR0cmlidXRlcy5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvZmlyZS9raWxsQ29uZGl0aW9ucy5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvZmlyZS9yZW5kZXJGbi5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvZmlyZS90aGVtZS5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvZmxhbWUvZmxhbWVUaGVtZS5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvcmVzZXQvcmVzZXRUaGVtZS5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvc21va2Uvc21va2VUaGVtZS5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvd2FycFN0YXIvYW5pbWF0aW9uVHJhY2tzLmpzIiwic3JjL2pzL3BhcnRpY2xlVGhlbWVzL3RoZW1lcy93YXJwU3Rhci9jb2xvclByb2ZpbGVzLmpzIiwic3JjL2pzL3BhcnRpY2xlVGhlbWVzL3RoZW1lcy93YXJwU3Rhci9jdXN0b21BdHRyaWJ1dGVzLmpzIiwic3JjL2pzL3BhcnRpY2xlVGhlbWVzL3RoZW1lcy93YXJwU3Rhci9raWxsQ29uZGl0aW9ucy5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvd2FycFN0YXIvbGlua0NyZWF0aW9uQXR0cmlidXRlcy5qcyIsInNyYy9qcy9wYXJ0aWNsZVRoZW1lcy90aGVtZXMvd2FycFN0YXIvcmVuZGVyRm4uanMiLCJzcmMvanMvcGFydGljbGVUaGVtZXMvdGhlbWVzL3dhcnBTdGFyL3JlbmRlclByb2ZpbGVzLmpzIiwic3JjL2pzL3BhcnRpY2xlVGhlbWVzL3RoZW1lcy93YXJwU3Rhci90aGVtZS5qcyIsInNyYy9qcy9wYXJ0aWNsZXMuanMiLCJzcmMvanMvdHJpZ29ub21pY1V0aWxzLmpzIiwic3JjL2pzL3V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4ekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IEltcGxlbWVudGF0aW9uIG9mIGEgZG91Ymx5IGxpbmtlZC1saXN0IGRhdGEgc3RydWN0dXJlXG4gKiBAYXV0aG9yIEphc29uIFMuIEpvbmVzXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBpc0VxdWFsID0gcmVxdWlyZSgnbG9kYXNoLmlzZXF1YWwnKTtcbiAgICB2YXIgTm9kZSA9IHJlcXVpcmUoJy4vbGliL2xpc3Qtbm9kZScpO1xuICAgIHZhciBJdGVyYXRvciA9IHJlcXVpcmUoJy4vbGliL2l0ZXJhdG9yJyk7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBEb3VibHkgbGlua2VkIGxpc3QgY2xhc3NcbiAgICAgKlxuICAgICAqIEltcGxlbWVudGF0aW9uIG9mIGEgZG91Ymx5IGxpbmtlZCBsaXN0IGRhdGEgc3RydWN0dXJlLiAgVGhpc1xuICAgICAqIGltcGxlbWVudGF0aW9uIHByb3ZpZGVzIHRoZSBnZW5lcmFsIGZ1bmN0aW9uYWxpdHkgb2YgYWRkaW5nIG5vZGVzIHRvXG4gICAgICogdGhlIGZyb250IG9yIGJhY2sgb2YgdGhlIGxpc3QsIGFzIHdlbGwgYXMgcmVtb3Zpbmcgbm9kZSBmcm9tIHRoZSBmcm9udFxuICAgICAqIG9yIGJhY2suICBUaGlzIGZ1bmN0aW9uYWxpdHkgZW5hYmxlcyB0aGlzIGltcGxlbWVudGlvbiB0byBiZSB0aGVcbiAgICAgKiB1bmRlcmx5aW5nIGRhdGEgc3RydWN0dXJlIGZvciB0aGUgbW9yZSBzcGVjaWZpYyBzdGFjayBvciBxdWV1ZSBkYXRhXG4gICAgICogc3RydWN0dXJlLlxuICAgICAqXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBMaW5rZWRMaXN0IGluc3RhbmNlLiAgRWFjaCBpbnN0YW5jZSBoYXMgYSBoZWFkIG5vZGUsIGEgdGFpbFxuICAgICAqIG5vZGUgYW5kIGEgc2l6ZSwgd2hpY2ggcmVwcmVzZW50cyB0aGUgbnVtYmVyIG9mIG5vZGVzIGluIHRoZSBsaXN0LlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gRG91Ymx5TGlua2VkTGlzdCgpIHtcbiAgICAgICAgdGhpcy5oZWFkID0gbnVsbDtcbiAgICAgICAgdGhpcy50YWlsID0gbnVsbDtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcblxuICAgICAgICAvLyBhZGQgaXRlcmF0b3IgYXMgYSBwcm9wZXJ0eSBvZiB0aGlzIGxpc3QgdG8gc2hhcmUgdGhlIHNhbWVcbiAgICAgICAgLy8gaXRlcmF0b3IgaW5zdGFuY2Ugd2l0aCBhbGwgb3RoZXIgbWV0aG9kcyB0aGF0IG1heSByZXF1aXJlXG4gICAgICAgIC8vIGl0cyB1c2UuICBOb3RlOiBiZSBzdXJlIHRvIGNhbGwgdGhpcy5pdGVyYXRvci5yZXNldCgpIHRvXG4gICAgICAgIC8vIHJlc2V0IHRoaXMgaXRlcmF0b3IgdG8gcG9pbnQgdGhlIGhlYWQgb2YgdGhlIGxpc3QuXG4gICAgICAgIHRoaXMuaXRlcmF0b3IgPSBuZXcgSXRlcmF0b3IodGhpcyk7XG4gICAgfVxuXG4gICAgLyogRnVuY3Rpb25zIGF0dGFjaGVkIHRvIHRoZSBMaW5rZWQtbGlzdCBwcm90b3R5cGUuICBBbGwgbGlua2VkLWxpc3RcbiAgICAgKiBpbnN0YW5jZXMgd2lsbCBzaGFyZSB0aGVzZSBtZXRob2RzLCBtZWFuaW5nIHRoZXJlIHdpbGwgTk9UIGJlIGNvcGllc1xuICAgICAqIG1hZGUgZm9yIGVhY2ggaW5zdGFuY2UuICBUaGlzIHdpbGwgYmUgYSBodWdlIG1lbW9yeSBzYXZpbmdzIHNpbmNlIHRoZXJlXG4gICAgICogbWF5IGJlIHNldmVyYWwgZGlmZmVyZW50IGxpbmtlZCBsaXN0cy5cbiAgICAgKi9cbiAgICBEb3VibHlMaW5rZWRMaXN0LnByb3RvdHlwZSA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBOb2RlIG9iamVjdCB3aXRoICdkYXRhJyBhc3NpZ25lZCB0byB0aGUgbm9kZSdzIGRhdGFcbiAgICAgICAgICogcHJvcGVydHlcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YSBUaGUgZGF0YSB0byBpbml0aWFsaXplIHdpdGggdGhlXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBOb2RlIG9iamVjdCBpbnRpYWxpemVkIHdpdGggJ2RhdGEnXG4gICAgICAgICAqL1xuICAgICAgICBjcmVhdGVOZXdOb2RlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBOb2RlKGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBub2RlIGluIHRoZSBsaXN0LCBjb21tb25seSByZWZlcnJlZCB0byBhcyB0aGVcbiAgICAgICAgICogJ2hlYWQnIG5vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge29iamVjdH0gdGhlIGhlYWQgbm9kZSBvZiB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0SGVhZE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhlYWQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGxhc3Qgbm9kZSBpbiB0aGUgbGlzdCwgY29tbW9ubHkgcmVmZXJyZWQgdG8gYXMgdGhlXG4gICAgICAgICAqICd0YWlsJ25vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge29iamVjdH0gdGhlIHRhaWwgbm9kZSBvZiB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0VGFpbE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhaWw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERldGVybWluZXMgaWYgdGhlIGxpc3QgaXMgZW1wdHlcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGxpc3QgaXMgZW1wdHksIGZhbHNlIG90aGVyd2lzZVxuICAgICAgICAgKi9cbiAgICAgICAgaXNFbXB0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnNpemUgPT09IDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBzaXplIG9mIHRoZSBsaXN0LCBvciBudW1iZXIgb2Ygbm9kZXNcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge251bWJlcn0gdGhlIG51bWJlciBvZiBub2RlcyBpbiB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xlYXJzIHRoZSBsaXN0IG9mIGFsbCBub2Rlcy9kYXRhXG4gICAgICAgICAqL1xuICAgICAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgd2hpbGUgKCF0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8jIyMjIyMjIyMjIyMjIyMjIyMgSU5TRVJUIG1ldGhvZHMgIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zZXJ0cyBhIG5vZGUgd2l0aCB0aGUgcHJvdmlkZWQgZGF0YSB0byB0aGUgZW5kIG9mIHRoZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IGRhdGEgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5zZXJ0IG9wZXJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgICAgICAgKi9cbiAgICAgICAgaW5zZXJ0OiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0aGlzLmNyZWF0ZU5ld05vZGUoZGF0YSk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQgPSB0aGlzLnRhaWwgPSBuZXdOb2RlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwubmV4dCA9IG5ld05vZGU7XG4gICAgICAgICAgICAgICAgbmV3Tm9kZS5wcmV2ID0gdGhpcy50YWlsO1xuICAgICAgICAgICAgICAgIHRoaXMudGFpbCA9IG5ld05vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNpemUgKz0gMTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc2VydHMgYSBub2RlIHdpdGggdGhlIHByb3ZpZGVkIGRhdGEgdG8gdGhlIGZyb250IG9mIHRoZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IGRhdGEgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5zZXJ0IG9wZXJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgICAgICAgKi9cbiAgICAgICAgaW5zZXJ0Rmlyc3Q6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluc2VydChkYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0aGlzLmNyZWF0ZU5ld05vZGUoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICBuZXdOb2RlLm5leHQgPSB0aGlzLmhlYWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkLnByZXYgPSBuZXdOb2RlO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZCA9IG5ld05vZGU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNpemUgKz0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc2VydHMgYSBub2RlIHdpdGggdGhlIHByb3ZpZGVkIGRhdGEgYXQgdGhlIGluZGV4IGluZGljYXRlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFRoZSBpbmRleCBpbiB0aGUgbGlzdCB0byBpbnNlcnQgdGhlIG5ldyBub2RlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IGRhdGEgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZSBub2RlXG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnRBdDogZnVuY3Rpb24gKGluZGV4LCBkYXRhKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMuZ2V0SGVhZE5vZGUoKSxcbiAgICAgICAgICAgICAgICBuZXdOb2RlID0gdGhpcy5jcmVhdGVOZXdOb2RlKGRhdGEpLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gMDtcblxuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGluZGV4IG91dC1vZi1ib3VuZHNcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLmdldFNpemUoKSAtIDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIGluZGV4IGlzIDAsIHdlIGp1c3QgbmVlZCB0byBpbnNlcnQgdGhlIGZpcnN0IG5vZGVcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0Rmlyc3QoZGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdXJyZW50LnByZXYubmV4dCA9IG5ld05vZGU7XG4gICAgICAgICAgICBuZXdOb2RlLnByZXYgPSBjdXJyZW50LnByZXY7XG4gICAgICAgICAgICBjdXJyZW50LnByZXYgPSBuZXdOb2RlO1xuICAgICAgICAgICAgbmV3Tm9kZS5uZXh0ID0gY3VycmVudDtcblxuICAgICAgICAgICAgdGhpcy5zaXplICs9IDE7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnNlcnRzIGEgbm9kZSBiZWZvcmUgdGhlIGZpcnN0IG5vZGUgY29udGFpbmluZyB0aGUgcHJvdmlkZWQgZGF0YVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBub2RlRGF0YSBUaGUgZGF0YSBvZiB0aGUgbm9kZSB0b1xuICAgICAgICAgKiAgICAgICAgIGZpbmQgdG8gaW5zZXJ0IHRoZSBuZXcgbm9kZSBiZWZvcmVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YVRvSW5zZXJ0IFRoZSBkYXRhIHRvIGluaXRpYWxpemUgd2l0aCB0aGUgbm9kZVxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbnNlcnQgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uIChub2RlRGF0YSwgZGF0YVRvSW5zZXJ0KSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmluZGV4T2Yobm9kZURhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0QXQoaW5kZXgsIGRhdGFUb0luc2VydCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc2VydHMgYSBub2RlIGFmdGVyIHRoZSBmaXJzdCBub2RlIGNvbnRhaW5pbmcgdGhlIHByb3ZpZGVkIGRhdGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gbm9kZURhdGEgVGhlIGRhdGEgb2YgdGhlIG5vZGUgdG9cbiAgICAgICAgICogICAgICAgICBmaW5kIHRvIGluc2VydCB0aGUgbmV3IG5vZGUgYWZ0ZXJcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YVRvSW5zZXJ0IFRoZSBkYXRhIHRvIGluaXRpYWxpemUgd2l0aCB0aGUgbm9kZVxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbnNlcnQgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnRBZnRlcjogZnVuY3Rpb24gKG5vZGVEYXRhLCBkYXRhVG9JbnNlcnQpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuaW5kZXhPZihub2RlRGF0YSk7XG4gICAgICAgICAgICB2YXIgc2l6ZSA9IHRoaXMuZ2V0U2l6ZSgpO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBpZiB3ZSB3YW50IHRvIGluc2VydCBuZXcgbm9kZSBhZnRlciB0aGUgdGFpbCBub2RlXG4gICAgICAgICAgICBpZiAoaW5kZXggKyAxID09PSBzaXplKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBzbywgY2FsbCBpbnNlcnQsIHdoaWNoIHdpbGwgYXBwZW5kIHRvIHRoZSBlbmQgYnkgZGVmYXVsdFxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluc2VydChkYXRhVG9JbnNlcnQpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBpbmNyZW1lbnQgdGhlIGluZGV4IGFuZCBpbnNlcnQgdGhlcmVcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pbnNlcnRBdChpbmRleCArIDEsIGRhdGFUb0luc2VydCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbmNhdGVuYXRlIGFub3RoZXIgbGlua2VkIGxpc3QgdG8gdGhlIGVuZCBvZiB0aGlzIGxpbmtlZCBsaXN0LiBUaGUgcmVzdWx0IGlzIHZlcnlcbiAgICAgICAgICogc2ltaWxhciB0byBhcnJheS5jb25jYXQgYnV0IGhhcyBhIHBlcmZvcm1hbmNlIGltcHJvdmVtZW50IHNpbmNlIHRoZXJlIGlzIG5vIG5lZWQgdG9cbiAgICAgICAgICogaXRlcmF0ZSBvdmVyIHRoZSBsaXN0c1xuICAgICAgICAgKiBAcGFyYW0ge0RvdWJseUxpbmtlZExpc3R9IG90aGVyTGlua2VkTGlzdFxuICAgICAgICAgKiBAcmV0dXJucyB7RG91Ymx5TGlua2VkTGlzdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbmNhdDogZnVuY3Rpb24gKG90aGVyTGlua2VkTGlzdCkge1xuICAgICAgICAgICAgaWYgKG90aGVyTGlua2VkTGlzdCBpbnN0YW5jZW9mIERvdWJseUxpbmtlZExpc3QpIHtcbiAgICAgICAgICAgICAgICAvL2NyZWF0ZSBuZXcgbGlzdCBzbyB0aGUgY2FsbGluZyBsaXN0IGlzIGltbXV0YWJsZSAobGlrZSBhcnJheS5jb25jYXQpXG4gICAgICAgICAgICAgICAgdmFyIG5ld0xpc3QgPSBuZXcgRG91Ymx5TGlua2VkTGlzdCgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpemUoKSA+IDApIHsgLy90aGlzIGxpc3QgaXMgTk9UIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3QuaGVhZCA9IHRoaXMuZ2V0SGVhZE5vZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC50YWlsID0gdGhpcy5nZXRUYWlsTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICBuZXdMaXN0LnRhaWwubmV4dCA9IG90aGVyTGlua2VkTGlzdC5nZXRIZWFkTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJMaW5rZWRMaXN0LmdldFNpemUoKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0xpc3QudGFpbCA9IG90aGVyTGlua2VkTGlzdC5nZXRUYWlsTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3Quc2l6ZSA9IHRoaXMuZ2V0U2l6ZSgpICsgb3RoZXJMaW5rZWRMaXN0LmdldFNpemUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7IC8vJ3RoaXMnIGxpc3QgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC5oZWFkID0gb3RoZXJMaW5rZWRMaXN0LmdldEhlYWROb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3QudGFpbCA9IG90aGVyTGlua2VkTGlzdC5nZXRUYWlsTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICBuZXdMaXN0LnNpemUgPSBvdGhlckxpbmtlZExpc3QuZ2V0U2l6ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3TGlzdDtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuIG9ubHkgY29uY2F0IGFub3RoZXIgaW5zdGFuY2Ugb2YgRG91Ymx5TGlua2VkTGlzdFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyMjIyMjIyMjIyMjIyMjIyMjIyBSRU1PVkUgbWV0aG9kcyAjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIHRoZSB0YWlsIG5vZGUgZnJvbSB0aGUgbGlzdFxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGVyZSBpcyBhIHNpZ25pZmljYW50IHBlcmZvcm1hbmNlIGltcHJvdmVtZW50IHdpdGggdGhlIG9wZXJhdGlvblxuICAgICAgICAgKiBvdmVyIGl0cyBzaW5nbHkgbGlua2VkIGxpc3QgY291bnRlcnBhcnQuICBUaGUgbWVyZSBmYWN0IG9mIGhhdmluZ1xuICAgICAgICAgKiBhIHJlZmVyZW5jZSB0byB0aGUgcHJldmlvdXMgbm9kZSBpbXByb3ZlcyB0aGlzIG9wZXJhdGlvbiBmcm9tIE8obilcbiAgICAgICAgICogKGluIHRoZSBjYXNlIG9mIHNpbmdseSBsaW5rZWQgbGlzdCkgdG8gTygxKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMgdGhlIG5vZGUgdGhhdCB3YXMgcmVtb3ZlZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZ2V0IGhhbmRsZSBmb3IgdGhlIHRhaWwgbm9kZVxuICAgICAgICAgICAgdmFyIG5vZGVUb1JlbW92ZSA9IHRoaXMuZ2V0VGFpbE5vZGUoKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUgbm9kZSBpbiB0aGUgbGlzdCwgc2V0IGhlYWQgYW5kIHRhaWxcbiAgICAgICAgICAgIC8vIHByb3BlcnRpZXMgdG8gbnVsbFxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2l6ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBtb3JlIHRoYW4gb25lIG5vZGUgaW4gdGhlIGxpc3RcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YWlsID0gdGhpcy5nZXRUYWlsTm9kZSgpLnByZXY7XG4gICAgICAgICAgICAgICAgdGhpcy50YWlsLm5leHQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zaXplIC09IDE7XG5cbiAgICAgICAgICAgIHJldHVybiBub2RlVG9SZW1vdmU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgdGhlIGhlYWQgbm9kZSBmcm9tIHRoZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBub2RlIHRoYXQgd2FzIHJlbW92ZWRcbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZUZpcnN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5vZGVUb1JlbW92ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2l6ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgbm9kZVRvUmVtb3ZlID0gdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbm9kZVRvUmVtb3ZlID0gdGhpcy5nZXRIZWFkTm9kZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZCA9IHRoaXMuaGVhZC5uZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZC5wcmV2ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnNpemUgLT0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5vZGVUb1JlbW92ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyB0aGUgbm9kZSBhdCB0aGUgaW5kZXggcHJvdmlkZWRcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFRoZSBpbmRleCBvZiB0aGUgbm9kZSB0byByZW1vdmVcbiAgICAgICAgICogQHJldHVybnMgdGhlIG5vZGUgdGhhdCB3YXMgcmVtb3ZlZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlQXQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgdmFyIG5vZGVUb1JlbW92ZSA9IHRoaXMuZmluZEF0KGluZGV4KTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGluZGV4IG91dC1vZi1ib3VuZHNcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLmdldFNpemUoKSAtIDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgaW5kZXggaXMgMCwgd2UganVzdCBuZWVkIHRvIHJlbW92ZSB0aGUgZmlyc3Qgbm9kZVxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlRmlyc3QoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgaW5kZXggaXMgc2l6ZS0xLCB3ZSBqdXN0IG5lZWQgdG8gcmVtb3ZlIHRoZSBsYXN0IG5vZGUsXG4gICAgICAgICAgICAvLyB3aGljaCByZW1vdmUoKSBkb2VzIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdGhpcy5nZXRTaXplKCkgLSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5vZGVUb1JlbW92ZS5wcmV2Lm5leHQgPSBub2RlVG9SZW1vdmUubmV4dDtcbiAgICAgICAgICAgIG5vZGVUb1JlbW92ZS5uZXh0LnByZXYgPSBub2RlVG9SZW1vdmUucHJldjtcbiAgICAgICAgICAgIG5vZGVUb1JlbW92ZS5uZXh0ID0gbm9kZVRvUmVtb3ZlLnByZXYgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLnNpemUgLT0gMTtcblxuICAgICAgICAgICAgcmV0dXJuIG5vZGVUb1JlbW92ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyB0aGUgZmlyc3Qgbm9kZSB0aGF0IGNvbnRhaW5zIHRoZSBkYXRhIHByb3ZpZGVkXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IG5vZGVEYXRhIFRoZSBkYXRhIG9mIHRoZSBub2RlIHRvIHJlbW92ZVxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgbm9kZSB0aGF0IHdhcyByZW1vdmVkXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmVOb2RlOiBmdW5jdGlvbiAobm9kZURhdGEpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuaW5kZXhPZihub2RlRGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVBdChpbmRleCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8jIyMjIyMjIyMjIyMjIyMjIyMgRklORCBtZXRob2RzICMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBmaXJzdCBub2RlIGNvbnRhaW5pbmcgdGhlIHByb3ZpZGVkIGRhdGEuICBJZlxuICAgICAgICAgKiBhIG5vZGUgY2Fubm90IGJlIGZvdW5kIGNvbnRhaW5pbmcgdGhlIHByb3ZpZGVkIGRhdGEsIC0xIGlzIHJldHVybmVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBub2RlRGF0YSBUaGUgZGF0YSBvZiB0aGUgbm9kZSB0byBmaW5kXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbm9kZSBpZiBmb3VuZCwgLTEgb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBpbmRleE9mOiBmdW5jdGlvbiAobm9kZURhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IucmVzZXQoKTtcbiAgICAgICAgICAgIHZhciBjdXJyZW50O1xuXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAwO1xuXG4gICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhlIGxpc3QgKGtlZXBpbmcgdHJhY2sgb2YgdGhlIGluZGV4IHZhbHVlKSB1bnRpbFxuICAgICAgICAgICAgLy8gd2UgZmluZCB0aGUgbm9kZSBjb250YWluZyB0aGUgbm9kZURhdGEgd2UgYXJlIGxvb2tpbmcgZm9yXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5pdGVyYXRvci5oYXNOZXh0KCkpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gdGhpcy5pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzRXF1YWwoY3VycmVudC5nZXREYXRhKCksIG5vZGVEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG9ubHkgZ2V0IGhlcmUgaWYgd2UgZGlkbid0IGZpbmQgYSBub2RlIGNvbnRhaW5pbmcgdGhlIG5vZGVEYXRhXG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGZpc3Qgbm9kZSBjb250YWluaW5nIHRoZSBwcm92aWRlZCBkYXRhLiAgSWYgYSBub2RlXG4gICAgICAgICAqIGNhbm5vdCBiZSBmb3VuZCBjb250YWluaW5nIHRoZSBwcm92aWRlZCBkYXRhLCAtMSBpcyByZXR1cm5lZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gbm9kZURhdGEgVGhlIGRhdGEgb2YgdGhlIG5vZGUgdG8gZmluZFxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgbm9kZSBpZiBmb3VuZCwgLTEgb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBmaW5kOiBmdW5jdGlvbiAobm9kZURhdGEpIHtcbiAgICAgICAgICAgIC8vIHN0YXJ0IGF0IHRoZSBoZWFkIG9mIHRoZSBsaXN0XG4gICAgICAgICAgICB0aGlzLml0ZXJhdG9yLnJlc2V0KCk7XG4gICAgICAgICAgICB2YXIgY3VycmVudDtcblxuICAgICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIHRoZSBsaXN0IHVudGlsIHdlIGZpbmQgdGhlIG5vZGUgY29udGFpbmluZyB0aGUgZGF0YVxuICAgICAgICAgICAgLy8gd2UgYXJlIGxvb2tpbmcgZm9yXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5pdGVyYXRvci5oYXNOZXh0KCkpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gdGhpcy5pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzRXF1YWwoY3VycmVudC5nZXREYXRhKCksIG5vZGVEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG9ubHkgZ2V0IGhlcmUgaWYgd2UgZGlkbid0IGZpbmQgYSBub2RlIGNvbnRhaW5pbmcgdGhlIG5vZGVEYXRhXG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIG5vZGUgYXQgdGhlIGxvY2F0aW9uIHByb3ZpZGVkIGJ5IGluZGV4XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG5vZGUgdG8gcmV0dXJuXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBub2RlIGxvY2F0ZWQgYXQgdGhlIGluZGV4IHByb3ZpZGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZmluZEF0OiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIC8vIGlmIGlkeCBpcyBvdXQgb2YgYm91bmRzIG9yIGZuIGNhbGxlZCBvbiBlbXB0eSBsaXN0LCByZXR1cm4gLTFcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSB8fCBpbmRleCA+IHRoaXMuZ2V0U2l6ZSgpIC0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZWxzZSwgbG9vcCB0aHJvdWdoIHRoZSBsaXN0IGFuZCByZXR1cm4gdGhlIG5vZGUgaW4gdGhlXG4gICAgICAgICAgICAvLyBwb3NpdGlvbiBwcm92aWRlZCBieSBpZHguICBBc3N1bWUgemVyby1iYXNlZCBwb3NpdGlvbnMuXG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZ2V0SGVhZE5vZGUoKTtcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IDA7XG5cbiAgICAgICAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgbGlzdCBjb250YWlucyB0aGUgcHJvdmlkZWQgbm9kZURhdGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gbm9kZURhdGEgVGhlIGRhdGEgdG8gY2hlY2sgaWYgdGhlIGxpc3RcbiAgICAgICAgICogICAgICAgIGNvbnRhaW5zXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSB0cnVlIGlmIHRoZSBsaXN0IGNvbnRhaW5zIG5vZGVEYXRhLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgICAgICovXG4gICAgICAgIGNvbnRhaW5zOiBmdW5jdGlvbiAobm9kZURhdGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGV4T2Yobm9kZURhdGEpID4gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIyMjIyMjIyMjIyMjIyMjIyMjIFVUSUxJVFkgbWV0aG9kcyAjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciB0aGUgbGlzdCBhbmQgY2FsbCB0aGUgZm4gcHJvdmlkZWRcbiAgICAgICAgICogb24gZWFjaCBub2RlLCBvciBlbGVtZW50LCBvZiB0aGUgbGlzdFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgb24gZWFjaCBub2RlIG9mIHRoZSBsaXN0XG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gcmV2ZXJzZSBVc2Ugb3Igbm90IHJldmVyc2UgaXRlcmF0aW9uICh0YWlsIHRvIGhlYWQpLCBkZWZhdWx0IHRvIGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBmb3JFYWNoOiBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICAgICAgICAgIHJldmVyc2UgPSByZXZlcnNlIHx8IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZXJhdG9yLnJlc2V0X3JldmVyc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZXJhdG9yLmVhY2hfcmV2ZXJzZShmbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IucmVzZXQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZXJhdG9yLmVhY2goZm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB0aGUgZGF0YSBjb250YWluZWQgaW4gdGhlIGxpc3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2FycmF5fSB0aGUgYXJyYXkgb2YgYWxsIHRoZSBkYXRhIGZyb20gdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgICAgIHRvQXJyYXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBsaXN0QXJyYXkgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGxpc3RBcnJheS5wdXNoKG5vZGUuZ2V0RGF0YSgpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbGlzdEFycmF5O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnRlcnJ1cHRzIGl0ZXJhdGlvbiBvdmVyIHRoZSBsaXN0XG4gICAgICAgICAqL1xuICAgICAgICBpbnRlcnJ1cHRFbnVtZXJhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5pdGVyYXRvci5pbnRlcnJ1cHQoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IERvdWJseUxpbmtlZExpc3Q7XG5cbn0oKSk7XG4iLCIvKipcbiAqIEBmaWxlT3ZlcnZpZXcgSW1wbGVtZW50YXRpb24gb2YgYW4gaXRlcmF0b3IgZm9yIGEgbGlua2VkIGxpc3RcbiAqICAgICAgICAgICAgICAgZGF0YSBzdHJ1Y3R1cmVcbiAqIEBhdXRob3IgSmFzb24gUy4gSm9uZXNcbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogSXRlcmF0b3IgY2xhc3NcbiAgICAgKlxuICAgICAqIFJlcHJlc2VudHMgYW4gaW5zdGFudGlhdGlvbiBvZiBhbiBpdGVyYXRvciB0byBiZSB1c2VkXG4gICAgICogd2l0aGluIGEgbGlua2VkIGxpc3QuICBUaGUgaXRlcmF0b3Igd2lsbCBwcm92aWRlIHRoZSBhYmlsaXR5XG4gICAgICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBub2RlcyBpbiBhIGxpc3QgYnkga2VlcGluZyB0cmFjayBvZiB0aGVcbiAgICAgKiBwb3N0aXRpb24gb2YgYSAnY3VycmVudE5vZGUnLiAgVGhpcyAnY3VycmVudE5vZGUnIHBvaW50ZXJcbiAgICAgKiB3aWxsIGtlZXAgc3RhdGUgdW50aWwgYSByZXNldCgpIG9wZXJhdGlvbiBpcyBjYWxsZWQgYXQgd2hpY2hcbiAgICAgKiB0aW1lIGl0IHdpbGwgcmVzZXQgdG8gcG9pbnQgdGhlIGhlYWQgb2YgdGhlIGxpc3QuXG4gICAgICpcbiAgICAgKiBFdmVuIHRob3VnaCB0aGlzIGl0ZXJhdG9yIGNsYXNzIGlzIGluZXh0cmljYWJseSBsaW5rZWRcbiAgICAgKiAobm8gcHVuIGludGVuZGVkKSB0byBhIGxpbmtlZCBsaXN0IGluc3RhdGlhdGlvbiwgaXQgd2FzIHJlbW92ZWRcbiAgICAgKiBmcm9tIHdpdGhpbiB0aGUgbGlua2VkIGxpc3QgY29kZSB0byBhZGhlcmUgdG8gdGhlIGJlc3QgcHJhY3RpY2VcbiAgICAgKiBvZiBzZXBhcmF0aW9uIG9mIGNvbmNlcm5zLlxuICAgICAqXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaXRlcmF0b3IgaW5zdGFuY2UgdG8gaXRlcmF0ZSBvdmVyIHRoZSBsaW5rZWQgbGlzdCBwcm92aWRlZC5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0aGVMaXN0IHRoZSBsaW5rZWQgbGlzdCB0byBpdGVyYXRlIG92ZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBJdGVyYXRvcih0aGVMaXN0KSB7XG4gICAgICAgIHRoaXMubGlzdCA9IHRoZUxpc3QgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5zdG9wSXRlcmF0aW9uRmxhZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIGEgcG9pbnRlciB0aGUgY3VycmVudCBub2RlIGluIHRoZSBsaXN0IHRoYXQgd2lsbCBiZSByZXR1cm5lZC5cbiAgICAgICAgLy8gaW5pdGlhbGx5IHRoaXMgd2lsbCBiZSBudWxsIHNpbmNlIHRoZSAnbGlzdCcgd2lsbCBiZSBlbXB0eVxuICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiBGdW5jdGlvbnMgYXR0YWNoZWQgdG8gdGhlIEl0ZXJhdG9yIHByb3RvdHlwZS4gIEFsbCBpdGVyYXRvciBpbnN0YW5jZXNcbiAgICAgKiB3aWxsIHNoYXJlIHRoZXNlIG1ldGhvZHMsIG1lYW5pbmcgdGhlcmUgd2lsbCBOT1QgYmUgY29waWVzIG1hZGUgZm9yIGVhY2hcbiAgICAgKiBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBJdGVyYXRvci5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIG5leHQgbm9kZSBpbiB0aGUgaXRlcmF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSB0aGUgbmV4dCBub2RlIGluIHRoZSBpdGVyYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMuY3VycmVudE5vZGU7XG4gICAgICAgICAgICAvLyBhIGNoZWNrIHRvIHByZXZlbnQgZXJyb3IgaWYgcmFuZG9tbHkgY2FsbGluZyBuZXh0KCkgd2hlblxuICAgICAgICAgICAgLy8gaXRlcmF0b3IgaXMgYXQgdGhlIGVuZCBvZiB0aGUgbGlzdCwgbWVhaW5pbmcgdGhlIGN1cnJlbnROb2RlXG4gICAgICAgICAgICAvLyB3aWxsIGJlIHBvaW50aW5nIHRvIG51bGwuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gV2hlbiB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCwgaXQgd2lsbCByZXR1cm4gdGhlIG5vZGUgY3VycmVudGx5XG4gICAgICAgICAgICAvLyBhc3NpZ25lZCB0byB0aGlzLmN1cnJlbnROb2RlIGFuZCBtb3ZlIHRoZSBwb2ludGVyIHRvIHRoZSBuZXh0XG4gICAgICAgICAgICAvLyBub2RlIGluIHRoZSBsaXN0IChpZiBpdCBleGlzdHMpXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Tm9kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSB0aGlzLmN1cnJlbnROb2RlLm5leHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBpdGVyYXRvciBoYXMgYSBub2RlIHRvIHJldHVyblxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBpdGVyYXRvciBoYXMgYSBub2RlIHRvIHJldHVybiwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBoYXNOZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50Tm9kZSAhPT0gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzZXRzIHRoZSBpdGVyYXRvciB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBsaXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSB0aGlzLmxpc3QuZ2V0SGVhZE5vZGUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgZmlyc3Qgbm9kZSBpbiB0aGUgbGlzdCBhbmQgbW92ZXMgdGhlIGl0ZXJhdG9yIHRvXG4gICAgICAgICAqIHBvaW50IHRvIHRoZSBzZWNvbmQgbm9kZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMgdGhlIGZpcnN0IG5vZGUgaW4gdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgICAgIGZpcnN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0aGVMaXN0IHRoZSBsaW5rZWQgbGlzdCB0byBpdGVyYXRlIG92ZXJcbiAgICAgICAgICovXG4gICAgICAgIHNldExpc3Q6IGZ1bmN0aW9uICh0aGVMaXN0KSB7XG4gICAgICAgICAgICB0aGlzLmxpc3QgPSB0aGVMaXN0O1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJdGVyYXRlcyBvdmVyIGFsbCBub2RlcyBpbiB0aGUgbGlzdCBhbmQgY2FsbHMgdGhlIHByb3ZpZGVkIGNhbGxiYWNrXG4gICAgICAgICAqIGZ1bmN0aW9uIHdpdGggZWFjaCBub2RlIGFzIGFuIGFyZ3VtZW50LlxuICAgICAgICAgKiBJdGVyYXRpb24gd2lsbCBicmVhayBpZiBpbnRlcnJ1cHQoKSBpcyBjYWxsZWRcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aXRoXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgIGVhY2ggbm9kZSBvZiB0aGUgbGlzdCBhcyBhbiBhcmdcbiAgICAgICAgICovXG4gICAgICAgIGVhY2g6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgdmFyIGVsO1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMuaGFzTmV4dCgpICYmICF0aGlzLnN0b3BJdGVyYXRpb25GbGFnKSB7XG4gICAgICAgICAgICAgICAgZWwgPSB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0b3BJdGVyYXRpb25GbGFnID0gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLypcbiAgICAgICAgICogIyMjIFJFVkVSU0UgSVRFUkFUSU9OIChUQUlMIC0+IEhFQUQpICMjI1xuICAgICAgICAgKi9cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgZmlyc3Qgbm9kZSBpbiB0aGUgbGlzdCBhbmQgbW92ZXMgdGhlIGl0ZXJhdG9yIHRvXG4gICAgICAgICAqIHBvaW50IHRvIHRoZSBzZWNvbmQgbm9kZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMgdGhlIGZpcnN0IG5vZGUgaW4gdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgICAgIGxhc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRfcmV2ZXJzZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dF9yZXZlcnNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc2V0cyB0aGUgaXRlcmF0b3IgdG8gdGhlIHRhaWwgb2YgdGhlIGxpc3QuXG4gICAgICAgICAqL1xuICAgICAgICByZXNldF9yZXZlcnNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gdGhpcy5saXN0LmdldFRhaWxOb2RlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIG5leHQgbm9kZSBpbiB0aGUgaXRlcmF0aW9uLCB3aGVuIGl0ZXJhdGluZyBmcm9tIHRhaWwgdG8gaGVhZFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSB0aGUgbmV4dCBub2RlIGluIHRoZSBpdGVyYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICBuZXh0X3JldmVyc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5jdXJyZW50Tm9kZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnROb2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IHRoaXMuY3VycmVudE5vZGUucHJldjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEl0ZXJhdGVzIG92ZXIgYWxsIG5vZGVzIGluIHRoZSBsaXN0IGFuZCBjYWxscyB0aGUgcHJvdmlkZWQgY2FsbGJhY2tcbiAgICAgICAgICogZnVuY3Rpb24gd2l0aCBlYWNoIG5vZGUgYXMgYW4gYXJndW1lbnQsXG4gICAgICAgICAqIHN0YXJ0aW5nIGZyb20gdGhlIHRhaWwgYW5kIGdvaW5nIHRvd2FyZHMgdGhlIGhlYWQuXG4gICAgICAgICAqIFRoZSBpdGVyYXRpb24gd2lsbCBicmVhayBpZiBpbnRlcnJ1cHQoKSBpcyBjYWxsZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2l0aGluXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICBlYWNoIG5vZGUgYXMgYW4gYXJnXG4gICAgICAgICAqL1xuICAgICAgICBlYWNoX3JldmVyc2U6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5yZXNldF9yZXZlcnNlKCk7XG4gICAgICAgICAgICB2YXIgZWw7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5oYXNOZXh0KCkgJiYgIXRoaXMuc3RvcEl0ZXJhdGlvbkZsYWcpIHtcbiAgICAgICAgICAgICAgICBlbCA9IHRoaXMubmV4dF9yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdG9wSXRlcmF0aW9uRmxhZyA9IGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qXG4gICAgICAgICAqICMjIyBJTlRFUlJVUFQgSVRFUkFUSU9OICMjI1xuICAgICAgICAgKi9cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmFpc2VzIGludGVycnVwdCBmbGFnICh0aGF0IHdpbGwgc3RvcCBlYWNoKCkgb3IgZWFjaF9yZXZlcnNlKCkpXG4gICAgICAgICAqL1xuXG4gICAgICAgIGludGVycnVwdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wSXRlcmF0aW9uRmxhZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBJdGVyYXRvcjtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogTGlua2VkIGxpc3Qgbm9kZSBjbGFzc1xuICAgICAqXG4gICAgICogSW50ZXJuYWwgcHJpdmF0ZSBjbGFzcyB0byByZXByZXNlbnQgYSBub2RlIHdpdGhpblxuICAgICAqIGEgbGlua2VkIGxpc3QuICBFYWNoIG5vZGUgaGFzIGEgJ2RhdGEnIHByb3BlcnR5IGFuZFxuICAgICAqIGEgcG9pbnRlciB0aGUgcHJldmlvdXMgbm9kZSBhbmQgdGhlIG5leHQgbm9kZSBpbiB0aGUgbGlzdC5cbiAgICAgKlxuICAgICAqIFNpbmNlIHRoZSAnTm9kZScgZnVuY3Rpb24gaXMgbm90IGFzc2lnbmVkIHRvXG4gICAgICogbW9kdWxlLmV4cG9ydHMgaXQgaXMgbm90IHZpc2libGUgb3V0c2lkZSBvZiB0aGlzXG4gICAgICogZmlsZSwgdGhlcmVmb3JlLCBpdCBpcyBwcml2YXRlIHRvIHRoZSBMaW5rZWRMaXN0XG4gICAgICogY2xhc3MuXG4gICAgICpcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5vZGUgb2JqZWN0IHdpdGggYSBkYXRhIHByb3BlcnR5IGFuZCBwb2ludGVyXG4gICAgICogdG8gdGhlIG5leHQgbm9kZVxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtvYmplY3R8bnVtYmVyfHN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBpbml0aWFsaXplIHdpdGggdGhlIG5vZGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBOb2RlKGRhdGEpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgdGhpcy5uZXh0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5wcmV2ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiBGdW5jdGlvbnMgYXR0YWNoZWQgdG8gdGhlIE5vZGUgcHJvdG90eXBlLiAgQWxsIG5vZGUgaW5zdGFuY2VzIHdpbGxcbiAgICAgKiBzaGFyZSB0aGVzZSBtZXRob2RzLCBtZWFuaW5nIHRoZXJlIHdpbGwgTk9UIGJlIGNvcGllcyBtYWRlIGZvciBlYWNoXG4gICAgICogaW5zdGFuY2UuICBUaGlzIHdpbGwgYmUgYSBodWdlIG1lbW9yeSBzYXZpbmdzIHNpbmNlIHRoZXJlIHdpbGwgbGlrZWx5XG4gICAgICogYmUgYSBsYXJnZSBudW1iZXIgb2YgaW5kaXZpZHVhbCBub2Rlcy5cbiAgICAgKi9cbiAgICBOb2RlLnByb3RvdHlwZSA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgbm9kZSBoYXMgYSBwb2ludGVyIHRvIHRoZSBuZXh0IG5vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlcmUgaXMgYSBuZXh0IG5vZGU7IGZhbHNlIG90aGVyd2lzZVxuICAgICAgICAgKi9cbiAgICAgICAgaGFzTmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLm5leHQgIT09IG51bGwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBub2RlIGhhcyBhIHBvaW50ZXIgdG8gdGhlIHByZXZpb3VzIG5vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlcmUgaXMgYSBwcmV2aW91cyBub2RlOyBmYWxzZSBvdGhlcndpc2VcbiAgICAgICAgICovXG4gICAgICAgIGhhc1ByZXY6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5wcmV2ICE9PSBudWxsKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgZGF0YSBvZiB0aGUgdGhlIG5vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge29iamVjdHxzdHJpbmd8bnVtYmVyfSB0aGUgZGF0YSBvZiB0aGUgbm9kZVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbmF0aW9uIG9mIHRoZSBub2RlLiAgSWYgdGhlIGRhdGEgaXMgYW5cbiAgICAgICAgICogb2JqZWN0LCBpdCByZXR1cm5zIHRoZSBKU09OLnN0cmluZ2lmeSB2ZXJzaW9uIG9mIHRoZSBvYmplY3QuXG4gICAgICAgICAqIE90aGVyd2lzZSwgaXQgc2ltcGx5IHJldHVybnMgdGhlIGRhdGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgc3RyaW5nIHJlcHJlc2VuYXRpb24gb2YgdGhlIG5vZGUgZGF0YVxuICAgICAgICAgKi9cbiAgICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5kYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKHRoaXMuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBOb2RlO1xuXG59KCkpO1xuIiwiLyoqXG4gKiBMb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBKUyBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanMuZm91bmRhdGlvbi8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNUeXBlZEFycmF5ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5maWx0ZXJgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlGaWx0ZXIoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmVzdWx0W3Jlc0luZGV4KytdID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uc29tZWAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbnkgZWxlbWVudCBwYXNzZXMgdGhlIHByZWRpY2F0ZSBjaGVjayxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5U29tZShhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGBjYWNoZWAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGNhY2hlIFRoZSBjYWNoZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBjYWNoZUhhcyhjYWNoZSwga2V5KSB7XG4gIHJldHVybiBjYWNoZS5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbi8qKlxuICogQ29udmVydHMgYG1hcGAgdG8gaXRzIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGtleS12YWx1ZSBwYWlycy5cbiAqL1xuZnVuY3Rpb24gbWFwVG9BcnJheShtYXApIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShtYXAuc2l6ZSk7XG5cbiAgbWFwLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IFtrZXksIHZhbHVlXTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBzZXRgIHRvIGFuIGFycmF5IG9mIGl0cyB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHNldFRvQXJyYXkoc2V0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoc2V0LnNpemUpO1xuXG4gIHNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSxcbiAgICBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWV0aG9kcyBtYXNxdWVyYWRpbmcgYXMgbmF0aXZlLiAqL1xudmFyIG1hc2tTcmNLZXkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB1aWQgPSAvW14uXSskLy5leGVjKGNvcmVKc0RhdGEgJiYgY29yZUpzRGF0YS5rZXlzICYmIGNvcmVKc0RhdGEua2V5cy5JRV9QUk9UTyB8fCAnJyk7XG4gIHJldHVybiB1aWQgPyAoJ1N5bWJvbChzcmMpXzEuJyArIHVpZCkgOiAnJztcbn0oKSk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgU3ltYm9sID0gcm9vdC5TeW1ib2wsXG4gICAgVWludDhBcnJheSA9IHJvb3QuVWludDhBcnJheSxcbiAgICBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlLFxuICAgIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlLFxuICAgIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMsXG4gICAgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBEYXRhVmlldyA9IGdldE5hdGl2ZShyb290LCAnRGF0YVZpZXcnKSxcbiAgICBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpLFxuICAgIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKSxcbiAgICBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpLFxuICAgIFdlYWtNYXAgPSBnZXROYXRpdmUocm9vdCwgJ1dlYWtNYXAnKSxcbiAgICBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIEhhc2hcbiAqL1xuZnVuY3Rpb24gaGFzaENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDoge307XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBsaXN0IGNhY2hlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTGlzdENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IFtdO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGdldE1hcERhdGEodGhpcywga2V5KVsnZGVsZXRlJ10oa2V5KTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGdldE1hcERhdGEodGhpcywga2V5KSxcbiAgICAgIHNpemUgPSBkYXRhLnNpemU7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSArPSBkYXRhLnNpemUgPT0gc2l6ZSA/IDAgOiAxO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbi8qKlxuICpcbiAqIENyZWF0ZXMgYW4gYXJyYXkgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIHVuaXF1ZSB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU2V0Q2FjaGUodmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzID09IG51bGwgPyAwIDogdmFsdWVzLmxlbmd0aDtcblxuICB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHRoaXMuYWRkKHZhbHVlc1tpbmRleF0pO1xuICB9XG59XG5cbi8qKlxuICogQWRkcyBgdmFsdWVgIHRvIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgYWRkXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBhbGlhcyBwdXNoXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjYWNoZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUFkZCh2YWx1ZSkge1xuICB0aGlzLl9fZGF0YV9fLnNldCh2YWx1ZSwgSEFTSF9VTkRFRklORUQpO1xuICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBpbiB0aGUgYXJyYXkgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUhhcyh2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXModmFsdWUpO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU2V0Q2FjaGVgLlxuU2V0Q2FjaGUucHJvdG90eXBlLmFkZCA9IFNldENhY2hlLnByb3RvdHlwZS5wdXNoID0gc2V0Q2FjaGVBZGQ7XG5TZXRDYWNoZS5wcm90b3R5cGUuaGFzID0gc2V0Q2FjaGVIYXM7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZShlbnRyaWVzKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0RlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgcmVzdWx0ID0gZGF0YVsnZGVsZXRlJ10oa2V5KTtcblxuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBzdGFjayB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrSGFzKGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBzdGFjayBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBzdGFjayBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgTGlzdENhY2hlKSB7XG4gICAgdmFyIHBhaXJzID0gZGF0YS5fX2RhdGFfXztcbiAgICBpZiAoIU1hcCB8fCAocGFpcnMubGVuZ3RoIDwgTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB0aGlzLnNpemUgPSArK2RhdGEuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZShwYWlycyk7XG4gIH1cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldEFsbEtleXNgIGFuZCBgZ2V0QWxsS2V5c0luYCB3aGljaCB1c2VzXG4gKiBga2V5c0Z1bmNgIGFuZCBgc3ltYm9sc0Z1bmNgIHRvIGdldCB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzeW1ib2xzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzRnVuYywgc3ltYm9sc0Z1bmMpIHtcbiAgdmFyIHJlc3VsdCA9IGtleXNGdW5jKG9iamVjdCk7XG4gIHJldHVybiBpc0FycmF5KG9iamVjdCkgPyByZXN1bHQgOiBhcnJheVB1c2gocmVzdWx0LCBzeW1ib2xzRnVuYyhvYmplY3QpKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzRXF1YWxgIHdoaWNoIHN1cHBvcnRzIHBhcnRpYWwgY29tcGFyaXNvbnNcbiAqIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtib29sZWFufSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogIDEgLSBVbm9yZGVyZWQgY29tcGFyaXNvblxuICogIDIgLSBQYXJ0aWFsIGNvbXBhcmlzb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgdmFsdWVgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIGlmICh2YWx1ZSA9PT0gb3RoZXIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBvdGhlciA9PSBudWxsIHx8ICghaXNPYmplY3RMaWtlKHZhbHVlKSAmJiAhaXNPYmplY3RMaWtlKG90aGVyKSkpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcjtcbiAgfVxuICByZXR1cm4gYmFzZUlzRXF1YWxEZWVwKHZhbHVlLCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgYmFzZUlzRXF1YWwsIHN0YWNrKTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsYCBmb3IgYXJyYXlzIGFuZCBvYmplY3RzIHdoaWNoIHBlcmZvcm1zXG4gKiBkZWVwIGNvbXBhcmlzb25zIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIGNvbXBhcmVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbERlZXAob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgb2JqSXNBcnIgPSBpc0FycmF5KG9iamVjdCksXG4gICAgICBvdGhJc0FyciA9IGlzQXJyYXkob3RoZXIpLFxuICAgICAgb2JqVGFnID0gb2JqSXNBcnIgPyBhcnJheVRhZyA6IGdldFRhZyhvYmplY3QpLFxuICAgICAgb3RoVGFnID0gb3RoSXNBcnIgPyBhcnJheVRhZyA6IGdldFRhZyhvdGhlcik7XG5cbiAgb2JqVGFnID0gb2JqVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvYmpUYWc7XG4gIG90aFRhZyA9IG90aFRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb3RoVGFnO1xuXG4gIHZhciBvYmpJc09iaiA9IG9ialRhZyA9PSBvYmplY3RUYWcsXG4gICAgICBvdGhJc09iaiA9IG90aFRhZyA9PSBvYmplY3RUYWcsXG4gICAgICBpc1NhbWVUYWcgPSBvYmpUYWcgPT0gb3RoVGFnO1xuXG4gIGlmIChpc1NhbWVUYWcgJiYgaXNCdWZmZXIob2JqZWN0KSkge1xuICAgIGlmICghaXNCdWZmZXIob3RoZXIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIG9iaklzQXJyID0gdHJ1ZTtcbiAgICBvYmpJc09iaiA9IGZhbHNlO1xuICB9XG4gIGlmIChpc1NhbWVUYWcgJiYgIW9iaklzT2JqKSB7XG4gICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICByZXR1cm4gKG9iaklzQXJyIHx8IGlzVHlwZWRBcnJheShvYmplY3QpKVxuICAgICAgPyBlcXVhbEFycmF5cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKVxuICAgICAgOiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIG9ialRhZywgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG4gIH1cbiAgaWYgKCEoYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHKSkge1xuICAgIHZhciBvYmpJc1dyYXBwZWQgPSBvYmpJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgJ19fd3JhcHBlZF9fJyksXG4gICAgICAgIG90aElzV3JhcHBlZCA9IG90aElzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsICdfX3dyYXBwZWRfXycpO1xuXG4gICAgaWYgKG9iaklzV3JhcHBlZCB8fCBvdGhJc1dyYXBwZWQpIHtcbiAgICAgIHZhciBvYmpVbndyYXBwZWQgPSBvYmpJc1dyYXBwZWQgPyBvYmplY3QudmFsdWUoKSA6IG9iamVjdCxcbiAgICAgICAgICBvdGhVbndyYXBwZWQgPSBvdGhJc1dyYXBwZWQgPyBvdGhlci52YWx1ZSgpIDogb3RoZXI7XG5cbiAgICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgICByZXR1cm4gZXF1YWxGdW5jKG9ialVud3JhcHBlZCwgb3RoVW53cmFwcGVkLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgfVxuICB9XG4gIGlmICghaXNTYW1lVGFnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gIHJldHVybiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IGlzRnVuY3Rpb24odmFsdWUpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgYXJyYXlzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0FycmF5fSBvdGhlciBUaGUgb3RoZXIgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYGFycmF5YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcnJheXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxBcnJheXMoYXJyYXksIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcsXG4gICAgICBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBvdGhlci5sZW5ndGg7XG5cbiAgaWYgKGFyckxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIShpc1BhcnRpYWwgJiYgb3RoTGVuZ3RoID4gYXJyTGVuZ3RoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KGFycmF5KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gdHJ1ZSxcbiAgICAgIHNlZW4gPSAoYml0bWFzayAmIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcpID8gbmV3IFNldENhY2hlIDogdW5kZWZpbmVkO1xuXG4gIHN0YWNrLnNldChhcnJheSwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIGFycmF5KTtcblxuICAvLyBJZ25vcmUgbm9uLWluZGV4IHByb3BlcnRpZXMuXG4gIHdoaWxlICgrK2luZGV4IDwgYXJyTGVuZ3RoKSB7XG4gICAgdmFyIGFyclZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2luZGV4XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBhcnJWYWx1ZSwgaW5kZXgsIG90aGVyLCBhcnJheSwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihhcnJWYWx1ZSwgb3RoVmFsdWUsIGluZGV4LCBhcnJheSwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgaWYgKGNvbXBhcmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChjb21wYXJlZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKHNlZW4pIHtcbiAgICAgIGlmICghYXJyYXlTb21lKG90aGVyLCBmdW5jdGlvbihvdGhWYWx1ZSwgb3RoSW5kZXgpIHtcbiAgICAgICAgICAgIGlmICghY2FjaGVIYXMoc2Vlbiwgb3RoSW5kZXgpICYmXG4gICAgICAgICAgICAgICAgKGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWVuLnB1c2gob3RoSW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKSB7XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCEoXG4gICAgICAgICAgYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8XG4gICAgICAgICAgICBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaylcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKGFycmF5KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGNvbXBhcmluZyBvYmplY3RzIG9mXG4gKiB0aGUgc2FtZSBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY29tcGFyaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3RzIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCB0YWcsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGRhdGFWaWV3VGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgIChvYmplY3QuYnl0ZU9mZnNldCAhPSBvdGhlci5ieXRlT2Zmc2V0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBvYmplY3QuYnVmZmVyO1xuICAgICAgb3RoZXIgPSBvdGhlci5idWZmZXI7XG5cbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgICFlcXVhbEZ1bmMobmV3IFVpbnQ4QXJyYXkob2JqZWN0KSwgbmV3IFVpbnQ4QXJyYXkob3RoZXIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgICAvLyBDb2VyY2UgYm9vbGVhbnMgdG8gYDFgIG9yIGAwYCBhbmQgZGF0ZXMgdG8gbWlsbGlzZWNvbmRzLlxuICAgICAgLy8gSW52YWxpZCBkYXRlcyBhcmUgY29lcmNlZCB0byBgTmFOYC5cbiAgICAgIHJldHVybiBlcSgrb2JqZWN0LCArb3RoZXIpO1xuXG4gICAgY2FzZSBlcnJvclRhZzpcbiAgICAgIHJldHVybiBvYmplY3QubmFtZSA9PSBvdGhlci5uYW1lICYmIG9iamVjdC5tZXNzYWdlID09IG90aGVyLm1lc3NhZ2U7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIC8vIENvZXJjZSByZWdleGVzIHRvIHN0cmluZ3MgYW5kIHRyZWF0IHN0cmluZ3MsIHByaW1pdGl2ZXMgYW5kIG9iamVjdHMsXG4gICAgICAvLyBhcyBlcXVhbC4gU2VlIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1yZWdleHAucHJvdG90eXBlLnRvc3RyaW5nXG4gICAgICAvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgcmV0dXJuIG9iamVjdCA9PSAob3RoZXIgKyAnJyk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHZhciBjb252ZXJ0ID0gbWFwVG9BcnJheTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRztcbiAgICAgIGNvbnZlcnQgfHwgKGNvbnZlcnQgPSBzZXRUb0FycmF5KTtcblxuICAgICAgaWYgKG9iamVjdC5zaXplICE9IG90aGVyLnNpemUgJiYgIWlzUGFydGlhbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gICAgICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICAgICAgaWYgKHN0YWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gICAgICB9XG4gICAgICBiaXRtYXNrIHw9IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUc7XG5cbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICAgICAgdmFyIHJlc3VsdCA9IGVxdWFsQXJyYXlzKGNvbnZlcnQob2JqZWN0KSwgY29udmVydChvdGhlciksIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xuICAgICAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICBpZiAoc3ltYm9sVmFsdWVPZikge1xuICAgICAgICByZXR1cm4gc3ltYm9sVmFsdWVPZi5jYWxsKG9iamVjdCkgPT0gc3ltYm9sVmFsdWVPZi5jYWxsKG90aGVyKTtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBvYmplY3RzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcsXG4gICAgICBvYmpQcm9wcyA9IGdldEFsbEtleXMob2JqZWN0KSxcbiAgICAgIG9iakxlbmd0aCA9IG9ialByb3BzLmxlbmd0aCxcbiAgICAgIG90aFByb3BzID0gZ2V0QWxsS2V5cyhvdGhlciksXG4gICAgICBvdGhMZW5ndGggPSBvdGhQcm9wcy5sZW5ndGg7XG5cbiAgaWYgKG9iakxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIWlzUGFydGlhbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgaW5kZXggPSBvYmpMZW5ndGg7XG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgdmFyIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICBpZiAoIShpc1BhcnRpYWwgPyBrZXkgaW4gb3RoZXIgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCBrZXkpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KG9iamVjdCk7XG4gIGlmIChzdGFja2VkICYmIHN0YWNrLmdldChvdGhlcikpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIG9iamVjdCk7XG5cbiAgdmFyIHNraXBDdG9yID0gaXNQYXJ0aWFsO1xuICB3aGlsZSAoKytpbmRleCA8IG9iakxlbmd0aCkge1xuICAgIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltrZXldO1xuXG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHZhciBjb21wYXJlZCA9IGlzUGFydGlhbFxuICAgICAgICA/IGN1c3RvbWl6ZXIob3RoVmFsdWUsIG9ialZhbHVlLCBrZXksIG90aGVyLCBvYmplY3QsIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIob2JqVmFsdWUsIG90aFZhbHVlLCBrZXksIG9iamVjdCwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKCEoY29tcGFyZWQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gKG9ialZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMob2JqVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpXG4gICAgICAgICAgOiBjb21wYXJlZFxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBza2lwQ3RvciB8fCAoc2tpcEN0b3IgPSBrZXkgPT0gJ2NvbnN0cnVjdG9yJyk7XG4gIH1cbiAgaWYgKHJlc3VsdCAmJiAhc2tpcEN0b3IpIHtcbiAgICB2YXIgb2JqQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgICAgb3RoQ3RvciA9IG90aGVyLmNvbnN0cnVjdG9yO1xuXG4gICAgLy8gTm9uIGBPYmplY3RgIG9iamVjdCBpbnN0YW5jZXMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1YWwuXG4gICAgaWYgKG9iakN0b3IgIT0gb3RoQ3RvciAmJlxuICAgICAgICAoJ2NvbnN0cnVjdG9yJyBpbiBvYmplY3QgJiYgJ2NvbnN0cnVjdG9yJyBpbiBvdGhlcikgJiZcbiAgICAgICAgISh0eXBlb2Ygb2JqQ3RvciA9PSAnZnVuY3Rpb24nICYmIG9iakN0b3IgaW5zdGFuY2VvZiBvYmpDdG9yICYmXG4gICAgICAgICAgdHlwZW9mIG90aEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvdGhDdG9yIGluc3RhbmNlb2Ygb3RoQ3RvcikpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzLCBnZXRTeW1ib2xzKTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHMgPSAhbmF0aXZlR2V0U3ltYm9scyA/IHN0dWJBcnJheSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIHJldHVybiBhcnJheUZpbHRlcihuYXRpdmVHZXRTeW1ib2xzKG9iamVjdCksIGZ1bmN0aW9uKHN5bWJvbCkge1xuICAgIHJldHVybiBwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKG9iamVjdCwgc3ltYm9sKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIEdldHMgdGhlIGB0b1N0cmluZ1RhZ2Agb2YgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG52YXIgZ2V0VGFnID0gYmFzZUdldFRhZztcblxuLy8gRmFsbGJhY2sgZm9yIGRhdGEgdmlld3MsIG1hcHMsIHNldHMsIGFuZCB3ZWFrIG1hcHMgaW4gSUUgMTEgYW5kIHByb21pc2VzIGluIE5vZGUuanMgPCA2LlxuaWYgKChEYXRhVmlldyAmJiBnZXRUYWcobmV3IERhdGFWaWV3KG5ldyBBcnJheUJ1ZmZlcigxKSkpICE9IGRhdGFWaWV3VGFnKSB8fFxuICAgIChNYXAgJiYgZ2V0VGFnKG5ldyBNYXApICE9IG1hcFRhZykgfHxcbiAgICAoUHJvbWlzZSAmJiBnZXRUYWcoUHJvbWlzZS5yZXNvbHZlKCkpICE9IHByb21pc2VUYWcpIHx8XG4gICAgKFNldCAmJiBnZXRUYWcobmV3IFNldCkgIT0gc2V0VGFnKSB8fFxuICAgIChXZWFrTWFwICYmIGdldFRhZyhuZXcgV2Vha01hcCkgIT0gd2Vha01hcFRhZykpIHtcbiAgZ2V0VGFnID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUdldFRhZyh2YWx1ZSksXG4gICAgICAgIEN0b3IgPSByZXN1bHQgPT0gb2JqZWN0VGFnID8gdmFsdWUuY29uc3RydWN0b3IgOiB1bmRlZmluZWQsXG4gICAgICAgIGN0b3JTdHJpbmcgPSBDdG9yID8gdG9Tb3VyY2UoQ3RvcikgOiAnJztcblxuICAgIGlmIChjdG9yU3RyaW5nKSB7XG4gICAgICBzd2l0Y2ggKGN0b3JTdHJpbmcpIHtcbiAgICAgICAgY2FzZSBkYXRhVmlld0N0b3JTdHJpbmc6IHJldHVybiBkYXRhVmlld1RhZztcbiAgICAgICAgY2FzZSBtYXBDdG9yU3RyaW5nOiByZXR1cm4gbWFwVGFnO1xuICAgICAgICBjYXNlIHByb21pc2VDdG9yU3RyaW5nOiByZXR1cm4gcHJvbWlzZVRhZztcbiAgICAgICAgY2FzZSBzZXRDdG9yU3RyaW5nOiByZXR1cm4gc2V0VGFnO1xuICAgICAgICBjYXNlIHdlYWtNYXBDdG9yU3RyaW5nOiByZXR1cm4gd2Vha01hcFRhZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSAmJlxuICAgICh2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJylcbiAgICA/ICh2YWx1ZSAhPT0gJ19fcHJvdG9fXycpXG4gICAgOiAodmFsdWUgPT09IG51bGwpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IEJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgVWludDhBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNCdWZmZXIgPSBuYXRpdmVJc0J1ZmZlciB8fCBzdHViRmFsc2U7XG5cbi8qKlxuICogUGVyZm9ybXMgYSBkZWVwIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZVxuICogZXF1aXZhbGVudC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2Qgc3VwcG9ydHMgY29tcGFyaW5nIGFycmF5cywgYXJyYXkgYnVmZmVycywgYm9vbGVhbnMsXG4gKiBkYXRlIG9iamVjdHMsIGVycm9yIG9iamVjdHMsIG1hcHMsIG51bWJlcnMsIGBPYmplY3RgIG9iamVjdHMsIHJlZ2V4ZXMsXG4gKiBzZXRzLCBzdHJpbmdzLCBzeW1ib2xzLCBhbmQgdHlwZWQgYXJyYXlzLiBgT2JqZWN0YCBvYmplY3RzIGFyZSBjb21wYXJlZFxuICogYnkgdGhlaXIgb3duLCBub3QgaW5oZXJpdGVkLCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuIEZ1bmN0aW9ucyBhbmQgRE9NXG4gKiBub2RlcyBhcmUgY29tcGFyZWQgYnkgc3RyaWN0IGVxdWFsaXR5LCBpLmUuIGA9PT1gLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmlzRXF1YWwob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogb2JqZWN0ID09PSBvdGhlcjtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRXF1YWwodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbmZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QpIDogYmFzZUtleXMob2JqZWN0KTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGEgbmV3IGVtcHR5IGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZW1wdHkgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheXMgPSBfLnRpbWVzKDIsIF8uc3R1YkFycmF5KTtcbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXMpO1xuICogLy8gPT4gW1tdLCBbXV1cbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXNbMF0gPT09IGFycmF5c1sxXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBzdHViQXJyYXkoKSB7XG4gIHJldHVybiBbXTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRXF1YWw7XG4iLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3Rvcnkpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyppc3RhbmJ1bCBpZ25vcmUgbmV4dDpjYW50IHRlc3QqL1xuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgIHJvb3Qub2JqZWN0UGF0aCA9IGZhY3RvcnkoKTtcbiAgfVxufSkodGhpcywgZnVuY3Rpb24oKXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhclxuICAgIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcbiAgICBfaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4gIGZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpe1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoIWlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICBmb3IgKHZhciBpIGluIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoX2hhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiB0b1N0cmluZyh0eXBlKXtcbiAgICByZXR1cm4gdG9TdHIuY2FsbCh0eXBlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKXtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCI7XG4gIH1cblxuICBmdW5jdGlvbiBpc1N0cmluZyhvYmope1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJyB8fCB0b1N0cmluZyhvYmopID09PSBcIltvYmplY3QgU3RyaW5nXVwiO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNPYmplY3Qob2JqKXtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgdG9TdHJpbmcob2JqKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQXJyYXkob2JqKXtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG9iai5sZW5ndGggPT09ICdudW1iZXInICYmIHRvU3RyaW5nKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH1cblxuICBmdW5jdGlvbiBpc0Jvb2xlYW4ob2JqKXtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Jvb2xlYW4nIHx8IHRvU3RyaW5nKG9iaikgPT09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEtleShrZXkpe1xuICAgIHZhciBpbnRLZXkgPSBwYXJzZUludChrZXkpO1xuICAgIGlmIChpbnRLZXkudG9TdHJpbmcoKSA9PT0ga2V5KSB7XG4gICAgICByZXR1cm4gaW50S2V5O1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0KG9iaiwgcGF0aCwgdmFsdWUsIGRvTm90UmVwbGFjZSl7XG4gICAgaWYgKGlzTnVtYmVyKHBhdGgpKSB7XG4gICAgICBwYXRoID0gW3BhdGhdO1xuICAgIH1cbiAgICBpZiAoaXNFbXB0eShwYXRoKSkge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYgKGlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICByZXR1cm4gc2V0KG9iaiwgcGF0aC5zcGxpdCgnLicpLm1hcChnZXRLZXkpLCB2YWx1ZSwgZG9Ob3RSZXBsYWNlKTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRQYXRoID0gcGF0aFswXTtcblxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIG9sZFZhbCA9IG9ialtjdXJyZW50UGF0aF07XG4gICAgICBpZiAob2xkVmFsID09PSB2b2lkIDAgfHwgIWRvTm90UmVwbGFjZSkge1xuICAgICAgICBvYmpbY3VycmVudFBhdGhdID0gdmFsdWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2xkVmFsO1xuICAgIH1cblxuICAgIGlmIChvYmpbY3VycmVudFBhdGhdID09PSB2b2lkIDApIHtcbiAgICAgIC8vY2hlY2sgaWYgd2UgYXNzdW1lIGFuIGFycmF5XG4gICAgICBpZihpc051bWJlcihwYXRoWzFdKSkge1xuICAgICAgICBvYmpbY3VycmVudFBhdGhdID0gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmpbY3VycmVudFBhdGhdID0ge307XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNldChvYmpbY3VycmVudFBhdGhdLCBwYXRoLnNsaWNlKDEpLCB2YWx1ZSwgZG9Ob3RSZXBsYWNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlbChvYmosIHBhdGgpIHtcbiAgICBpZiAoaXNOdW1iZXIocGF0aCkpIHtcbiAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgfVxuXG4gICAgaWYgKGlzRW1wdHkob2JqKSkge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG5cbiAgICBpZiAoaXNFbXB0eShwYXRoKSkge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgaWYoaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgIHJldHVybiBkZWwob2JqLCBwYXRoLnNwbGl0KCcuJykpO1xuICAgIH1cblxuICAgIHZhciBjdXJyZW50UGF0aCA9IGdldEtleShwYXRoWzBdKTtcbiAgICB2YXIgb2xkVmFsID0gb2JqW2N1cnJlbnRQYXRoXTtcblxuICAgIGlmKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAob2xkVmFsICE9PSB2b2lkIDApIHtcbiAgICAgICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgICAgIG9iai5zcGxpY2UoY3VycmVudFBhdGgsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBvYmpbY3VycmVudFBhdGhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvYmpbY3VycmVudFBhdGhdICE9PSB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIGRlbChvYmpbY3VycmVudFBhdGhdLCBwYXRoLnNsaWNlKDEpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIG9iamVjdFBhdGggPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0UGF0aCkucmVkdWNlKGZ1bmN0aW9uKHByb3h5LCBwcm9wKSB7XG4gICAgICBpZiAodHlwZW9mIG9iamVjdFBhdGhbcHJvcF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcHJveHlbcHJvcF0gPSBvYmplY3RQYXRoW3Byb3BdLmJpbmQob2JqZWN0UGF0aCwgb2JqKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH0sIHt9KTtcbiAgfTtcblxuICBvYmplY3RQYXRoLmhhcyA9IGZ1bmN0aW9uIChvYmosIHBhdGgpIHtcbiAgICBpZiAoaXNFbXB0eShvYmopKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGlzTnVtYmVyKHBhdGgpKSB7XG4gICAgICBwYXRoID0gW3BhdGhdO1xuICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgIHBhdGggPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgfVxuXG4gICAgaWYgKGlzRW1wdHkocGF0aCkgfHwgcGF0aC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBqID0gcGF0aFtpXTtcbiAgICAgIGlmICgoaXNPYmplY3Qob2JqKSB8fCBpc0FycmF5KG9iaikpICYmIF9oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaikpIHtcbiAgICAgICAgb2JqID0gb2JqW2pdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIG9iamVjdFBhdGguZW5zdXJlRXhpc3RzID0gZnVuY3Rpb24gKG9iaiwgcGF0aCwgdmFsdWUpe1xuICAgIHJldHVybiBzZXQob2JqLCBwYXRoLCB2YWx1ZSwgdHJ1ZSk7XG4gIH07XG5cbiAgb2JqZWN0UGF0aC5zZXQgPSBmdW5jdGlvbiAob2JqLCBwYXRoLCB2YWx1ZSwgZG9Ob3RSZXBsYWNlKXtcbiAgICByZXR1cm4gc2V0KG9iaiwgcGF0aCwgdmFsdWUsIGRvTm90UmVwbGFjZSk7XG4gIH07XG5cbiAgb2JqZWN0UGF0aC5pbnNlcnQgPSBmdW5jdGlvbiAob2JqLCBwYXRoLCB2YWx1ZSwgYXQpe1xuICAgIHZhciBhcnIgPSBvYmplY3RQYXRoLmdldChvYmosIHBhdGgpO1xuICAgIGF0ID0gfn5hdDtcbiAgICBpZiAoIWlzQXJyYXkoYXJyKSkge1xuICAgICAgYXJyID0gW107XG4gICAgICBvYmplY3RQYXRoLnNldChvYmosIHBhdGgsIGFycik7XG4gICAgfVxuICAgIGFyci5zcGxpY2UoYXQsIDAsIHZhbHVlKTtcbiAgfTtcblxuICBvYmplY3RQYXRoLmVtcHR5ID0gZnVuY3Rpb24ob2JqLCBwYXRoKSB7XG4gICAgaWYgKGlzRW1wdHkocGF0aCkpIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGlmIChpc0VtcHR5KG9iaikpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlLCBpO1xuICAgIGlmICghKHZhbHVlID0gb2JqZWN0UGF0aC5nZXQob2JqLCBwYXRoKSkpIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIG9iamVjdFBhdGguc2V0KG9iaiwgcGF0aCwgJycpO1xuICAgIH0gZWxzZSBpZiAoaXNCb29sZWFuKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIG9iamVjdFBhdGguc2V0KG9iaiwgcGF0aCwgZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICByZXR1cm4gb2JqZWN0UGF0aC5zZXQob2JqLCBwYXRoLCAwKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB2YWx1ZS5sZW5ndGggPSAwO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICBmb3IgKGkgaW4gdmFsdWUpIHtcbiAgICAgICAgaWYgKF9oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBpKSkge1xuICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqZWN0UGF0aC5zZXQob2JqLCBwYXRoLCBudWxsKTtcbiAgICB9XG4gIH07XG5cbiAgb2JqZWN0UGF0aC5wdXNoID0gZnVuY3Rpb24gKG9iaiwgcGF0aCAvKiwgdmFsdWVzICovKXtcbiAgICB2YXIgYXJyID0gb2JqZWN0UGF0aC5nZXQob2JqLCBwYXRoKTtcbiAgICBpZiAoIWlzQXJyYXkoYXJyKSkge1xuICAgICAgYXJyID0gW107XG4gICAgICBvYmplY3RQYXRoLnNldChvYmosIHBhdGgsIGFycik7XG4gICAgfVxuXG4gICAgYXJyLnB1c2guYXBwbHkoYXJyLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpKTtcbiAgfTtcblxuICBvYmplY3RQYXRoLmNvYWxlc2NlID0gZnVuY3Rpb24gKG9iaiwgcGF0aHMsIGRlZmF1bHRWYWx1ZSkge1xuICAgIHZhciB2YWx1ZTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYXRocy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKCh2YWx1ZSA9IG9iamVjdFBhdGguZ2V0KG9iaiwgcGF0aHNbaV0pKSAhPT0gdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICB9O1xuXG4gIG9iamVjdFBhdGguZ2V0ID0gZnVuY3Rpb24gKG9iaiwgcGF0aCwgZGVmYXVsdFZhbHVlKXtcbiAgICBpZiAoaXNOdW1iZXIocGF0aCkpIHtcbiAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgfVxuICAgIGlmIChpc0VtcHR5KHBhdGgpKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAoaXNFbXB0eShvYmopKSB7XG4gICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBpZiAoaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgIHJldHVybiBvYmplY3RQYXRoLmdldChvYmosIHBhdGguc3BsaXQoJy4nKSwgZGVmYXVsdFZhbHVlKTtcbiAgICB9XG5cbiAgICB2YXIgY3VycmVudFBhdGggPSBnZXRLZXkocGF0aFswXSk7XG5cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmIChvYmpbY3VycmVudFBhdGhdID09PSB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmpbY3VycmVudFBhdGhdO1xuICAgIH1cblxuICAgIHJldHVybiBvYmplY3RQYXRoLmdldChvYmpbY3VycmVudFBhdGhdLCBwYXRoLnNsaWNlKDEpLCBkZWZhdWx0VmFsdWUpO1xuICB9O1xuXG4gIG9iamVjdFBhdGguZGVsID0gZnVuY3Rpb24ob2JqLCBwYXRoKSB7XG4gICAgcmV0dXJuIGRlbChvYmosIHBhdGgpO1xuICB9O1xuXG4gIHJldHVybiBvYmplY3RQYXRoO1xufSk7XG4iLCIvLyB1dGlsaXRpZXNcclxudmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG5cclxuZnVuY3Rpb24gRW1pdHRlckVudGl0eShlbWl0dGVyTmFtZSwgZW1pdHRlclRoZW1lLCBwYXJ0aWNsZU9wdHMsIGVtaXRGbikge1xyXG5cclxuICAgIHRoaXMubmFtZSA9IGVtaXR0ZXJOYW1lO1xyXG5cclxuICAgIC8vIGVtaXR0ZXIgZW50aXR5IGNvbmZpZ1xyXG4gICAgdGhpcy5lbWl0dGVyT3B0cyA9IGVtaXR0ZXJUaGVtZTtcclxuICAgIC8vIGVtaXR0ZXIgZW1pc3Npb24gY29uZmlnXHJcbiAgICB0aGlzLmVtaXNzaW9uT3B0cyA9IHRoaXMuZW1pdHRlck9wdHMuZW1pc3Npb247XHJcbiAgICAvLyBlbWl0dGVyIHBhcnRpY2xlIGNvbmZpZ1xyXG4gICAgdGhpcy5wYXJ0aWNsZU9wdHMgPSBwYXJ0aWNsZU9wdHM7XHJcblxyXG4gICAgLy8gc2F2ZXMgZHJpbGxpbmcgZG93blxyXG4gICAgdmFyIGVtaXR0ZXIgPSB0aGlzLmVtaXR0ZXJPcHRzLmVtaXR0ZXI7XHJcbiAgICB2YXIgZW1pc3Npb24gPSB0aGlzLmVtaXNzaW9uT3B0cztcclxuICAgIHZhciBlbWl0UmF0ZSA9IGVtaXNzaW9uLnJhdGU7XHJcbiAgICB2YXIgZW1pdFJlcGVhdCA9IGVtaXNzaW9uLnJlcGVhdGVyO1xyXG5cclxuICAgIC8vIGVtaXR0ZXIgbWFzdGVyIGNsb2NrIGluaXRcclxuICAgIHRoaXMubG9jYWxDbG9jayA9IDA7XHJcbiAgICB0aGlzLmxvY2FsQ2xvY2tSdW5uaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmVtaXRGbiA9IGVtaXRGbjtcclxuICAgIC8vIGVtaXR0ZXIgbGlmZVxyXG4gICAgdGhpcy5hY3RpdmUgPSBlbWl0dGVyLmFjdGl2ZTtcclxuXHJcbiAgICAvLyBlbWl0dGVyIHZlY3RvcnNcclxuICAgIHRoaXMueCA9IGVtaXR0ZXIueDtcclxuICAgIHRoaXMueSA9IGVtaXR0ZXIueTtcclxuICAgIHRoaXMueFZlbCA9IGVtaXR0ZXIueFZlbDtcclxuICAgIHRoaXMueVZlbCA9IGVtaXR0ZXIueVZlbDtcclxuXHJcbiAgICAvLyBlbWl0dGVyIGVudmlyb25tZW50YWwgaW5mbHVlbmNlc1xyXG4gICAgdGhpcy5hcHBseUdsb2JhbEZvcmNlcyA9IGVtaXR0ZXIuYXBwbHlHbG9iYWxGb3JjZXM7XHJcblxyXG4gICAgLy8gZW1pdHRlciBlbWlzc2lvbiBjb25maWdcclxuICAgIC8vIGVtaXNzaW9uIHJhdGVcclxuICAgIHRoaXMucmF0ZU1pbiA9IGVtaXRSYXRlLm1pbjtcclxuICAgIHRoaXMucmF0ZU1heCA9IGVtaXRSYXRlLm1heDtcclxuICAgIHRoaXMucmF0ZURlY2F5ID0gZW1pdFJhdGUuZGVjYXkucmF0ZTtcclxuICAgIHRoaXMucmF0ZURlY2F5TWF4ID0gZW1pdFJhdGUuZGVjYXkuZGVjYXlNYXg7XHJcblxyXG4gICAgLy8gZW1pc3Npb24gcmVwZXRpdGlvblxyXG4gICAgdGhpcy5yZXBlYXRSYXRlID0gZW1pdFJlcGVhdC5yYXRlO1xyXG4gICAgdGhpcy5yZXBlYXREZWNheSA9IGVtaXRSZXBlYXQuZGVjYXkucmF0ZTtcclxuICAgIHRoaXMucmVwZWF0RGVjYXlNYXggPSBlbWl0UmVwZWF0LmRlY2F5LmRlY2F5TWF4O1xyXG4gICAgdGhpcy50cmlnZ2VyVHlwZSA9ICdtb3VzZUNsaWNrRXZlbnQnO1xyXG5cclxuICAgIHRoaXMuaW5pdFZhbHVlcyA9IHtcclxuICAgICAgICByYXRlTWluOiBlbWl0UmF0ZS5taW4sXHJcbiAgICAgICAgcmF0ZU1heDogZW1pdFJhdGUubWF4LFxyXG4gICAgICAgIHJhdGVEZWNheTogZW1pdFJhdGUuZGVjYXkucmF0ZSxcclxuICAgICAgICByYXRlRGVjYXlNYXg6IGVtaXRSYXRlLmRlY2F5LmRlY2F5TWF4LFxyXG4gICAgICAgIHJlcGVhdFJhdGU6IGVtaXRSZXBlYXQucmF0ZSxcclxuICAgICAgICByZXBlYXREZWNheTogZW1pdFJlcGVhdC5kZWNheS5yYXRlLFxyXG4gICAgICAgIHJlcGVhdERlY2F5TWF4OiBlbWl0UmVwZWF0LmRlY2F5LmRlY2F5TWF4XHJcbiAgICB9O1xyXG59XHJcblxyXG5FbWl0dGVyRW50aXR5LnByb3RvdHlwZS5yZXNldEVtaXNzaW9uVmFsdWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHNlbGYucmF0ZU1pbiA9IHNlbGYuaW5pdFZhbHVlcy5yYXRlTWluO1xyXG4gICAgc2VsZi5yYXRlTWF4ID0gc2VsZi5pbml0VmFsdWVzLnJhdGVNYXg7XHJcbiAgICBzZWxmLnJhdGVEZWNheSA9IHNlbGYuaW5pdFZhbHVlcy5yYXRlRGVjYXk7XHJcbiAgICBzZWxmLnJhdGVEZWNheU1heCA9IHNlbGYuaW5pdFZhbHVlcy5yYXRlRGVjYXlNYXg7XHJcbiAgICBzZWxmLnJlcGVhdFJhdGUgPSBzZWxmLmluaXRWYWx1ZXMucmVwZWF0UmF0ZTtcclxuICAgIHNlbGYucmVwZWF0RGVjYXkgPSBzZWxmLmluaXRWYWx1ZXMucmVwZWF0RGVjYXk7XHJcbiAgICBzZWxmLnJlcGVhdERlY2F5TWF4ID0gc2VsZi5pbml0VmFsdWVzLnJlcGVhdERlY2F5TWF4O1xyXG59O1xyXG5cclxuRW1pdHRlckVudGl0eS5wcm90b3R5cGUudXBkYXRlRW1pdHRlciA9IGZ1bmN0aW9uICh1cGRhdGVPcHRzKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdmFyIHVwZGF0ZXMgPSB1cGRhdGVPcHRzIHx8IGZhbHNlO1xyXG4gICAgdmFyIHRyaWdnZXJFbWl0dGVyRmxhZyA9IGZhbHNlO1xyXG5cclxuICAgIGlmICh1cGRhdGVzICE9PSBmYWxzZSkge1xyXG4gICAgICAgIHNlbGYueCA9IHVwZGF0ZXMueDtcclxuICAgICAgICBzZWxmLnkgPSB1cGRhdGVzLnk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi54ICs9IHNlbGYueFZlbDtcclxuICAgIHNlbGYueSArPSBzZWxmLnlWZWw7XHJcblxyXG4gICAgaWYgKHNlbGYuYWN0aXZlID09PSAxKSB7XHJcblxyXG4gICAgICAgIGlmIChzZWxmLnJlcGVhdFJhdGUgPiAwICYmIHNlbGYubG9jYWxDbG9ja1J1bm5pbmcgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWxmLmxvY2FsQ2xvY2sgJSBzZWxmLnJlcGVhdFJhdGUgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXJFbWl0dGVyRmxhZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYucmVwZWF0RGVjYXkgPCBzZWxmLnJlcGVhdERlY2F5TWF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZXBlYXRSYXRlICs9IHNlbGYucmVwZWF0RGVjYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2NhbENsb2NrID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvY2FsQ2xvY2tSdW5uaW5nID09PSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnJhdGVEZWNheSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnJhdGVNaW4gPiBzZWxmLnJhdGVEZWNheU1heCA/IHNlbGYucmF0ZU1pbiAtPSBzZWxmLnJhdGVEZWNheSA6IHNlbGYucmF0ZU1pbiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yYXRlTWF4ID4gc2VsZi5yYXRlRGVjYXlNYXggPyBzZWxmLnJhdGVNYXggLT0gc2VsZi5yYXRlRGVjYXkgOiBzZWxmLnJhdGVNYXggPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlckVtaXR0ZXJGbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYubG9jYWxDbG9jaysrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0cmlnZ2VyRW1pdHRlckZsYWcgPT09IHRydWUpIHtcclxuICAgICAgICBzZWxmLnRyaWdnZXJFbWl0dGVyKHsgeDogc2VsZi54LCB5OiBzZWxmLnkgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5FbWl0dGVyRW50aXR5LnByb3RvdHlwZS50cmlnZ2VyRW1pdHRlciA9IGZ1bmN0aW9uICh0cmlnZ2VyT3B0aW9ucykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHZhciB0aGlzWCwgdGhpc1k7XHJcbiAgICB2YXIgdHJpZ2dlck9wdHMgPSB0cmlnZ2VyT3B0aW9ucyB8fCBmYWxzZTtcclxuICAgIGlmICh0cmlnZ2VyT3B0cyAhPT0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzWCA9IHRyaWdnZXJPcHRzLng7XHJcbiAgICAgICAgdGhpc1kgPSB0cmlnZ2VyT3B0cy55O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzWCA9IHNlbGYueDtcclxuICAgICAgICB0aGlzWSA9IHNlbGYueTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLnggPSB0aGlzWDtcclxuICAgIHNlbGYueSA9IHRoaXNZO1xyXG5cclxuICAgIHNlbGYuYWN0aXZlID0gdHJ1ZTtcclxuICAgIHNlbGYubG9jYWxDbG9ja1J1bm5pbmcgPSB0cnVlO1xyXG5cclxuICAgIHZhciBlbWl0QW1vdW50ID0gbWF0aFV0aWxzLnJhbmRvbUludGVnZXIoc2VsZi5yYXRlTWluLCBzZWxmLnJhdGVNYXgpO1xyXG5cclxuICAgIHNlbGYuZW1pdEZuKHRoaXNYLCB0aGlzWSwgZW1pdEFtb3VudCwgc2VsZi5lbWlzc2lvbk9wdHMsIHNlbGYucGFydGljbGVPcHRzKTtcclxuXHJcbiAgICBpZiAoc2VsZi5yZXBlYXRSYXRlID4gMCkge1xyXG4gICAgICAgIHNlbGYuYWN0aXZlID0gMTtcclxuXHJcbiAgICAgICAgLy8gc2VsZi51cGRhdGVFbWl0dGVyKCB7IHg6IHRoaXNYLCB5OiB0aGlzWSB9ICk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5FbWl0dGVyRW50aXR5LnByb3RvdHlwZS5yZW5kZXJFbWl0dGVyID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAncmdiKCAyNTUsIDI1NSwgMjU1ICknO1xyXG4gICAgY29udGV4dC5zdHJva2VXaWR0aCA9IDU7XHJcbiAgICBjb250ZXh0LmxpbmUodGhpcy54LCB0aGlzLnkgLSAxNSwgdGhpcy54LCB0aGlzLnkgKyAxNSwgY29udGV4dCk7XHJcbiAgICBjb250ZXh0LmxpbmUodGhpcy54IC0gMTUsIHRoaXMueSwgdGhpcy54ICsgMTUsIHRoaXMueSwgY29udGV4dCk7XHJcbiAgICBjb250ZXh0LnN0cm9rZUNpcmNsZSh0aGlzLngsIHRoaXMueSwgMTAsIGNvbnRleHQpO1xyXG59O1xyXG5cclxuRW1pdHRlckVudGl0eS5wcm90b3R5cGUua2lsbEVtaXR0ZXIgPSBmdW5jdGlvbiAoKSB7fTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLkVtaXR0ZXJFbnRpdHkgPSBFbWl0dGVyRW50aXR5OyIsInZhciBhbmltYXRpb24gPSB7XHJcbiAgICBzdGF0ZTogZmFsc2UsXHJcbiAgICBjb3VudGVyOiAwLFxyXG4gICAgZHVyYXRpb246IDI0MFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuYW5pbWF0aW9uID0gYW5pbWF0aW9uOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBleHRlbmRzIENhbnZhcyBwcm90b3R5cGUgd2l0aCB1c2VmdWwgZHJhd2luZyBtaXhpbnNcclxuKiBAa2luZCBjb25zdGFudFxyXG4qL1xyXG52YXIgY2FudmFzRHJhd2luZ0FwaSA9IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGU7XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBkcmF3IGNpcmNsZSBBUElcclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIG9yaWdpbiBZIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0gciAtIHJhZGl1cyBvZiBjaXJjbGUuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuY2lyY2xlID0gZnVuY3Rpb24gKHgsIHksIHIsIGNvbnRleHQpIHtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG5cdHRoaXMuYXJjKHgsIHksIHIsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IGZpbGxlZCBjaXJjbGVcclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIG9yaWdpbiBZIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0gciAtIHJhZGl1cyBvZiBjaXJjbGUuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuZmlsbENpcmNsZSA9IGZ1bmN0aW9uICh4LCB5LCByLCBjb250ZXh0KSB7XHJcblx0dGhpcy5jaXJjbGUoeCwgeSwgciwgY29udGV4dCk7XHJcblx0dGhpcy5maWxsKCk7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IHN0cm9rZWQgY2lyY2xlXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvcmlnaW4gWSBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHIgLSByYWRpdXMgb2YgY2lyY2xlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLnN0cm9rZUNpcmNsZSA9IGZ1bmN0aW9uICh4LCB5LCByLCBjb250ZXh0KSB7XHJcblx0Y29udGV4dC5jaXJjbGUoeCwgeSwgciwgY29udGV4dCk7XHJcblx0Y29udGV4dC5zdHJva2UoKTtcclxuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvZmlnaW4gWSBvciBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB3IC0gd2lkdGggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIGhlaWdodCBvZiBlbGxpcHNlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmVsbGlwc2UgPSBmdW5jdGlvbiAoeCwgeSwgdywgaCwgY29udGV4dCkge1xyXG5cdGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBNYXRoLlBJICogMjsgaSArPSBNYXRoLlBJIC8gMTYpIHtcclxuXHRcdGNvbnRleHQubGluZVRvKHggKyBNYXRoLmNvcyhpKSAqIHcgLyAyLCB5ICsgTWF0aC5zaW4oaSkgKiBoIC8gMik7XHJcblx0fVxyXG5cdGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBmaWxsZWQgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvZmlnaW4gWSBvciBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB3IC0gd2lkdGggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIGhlaWdodCBvZiBlbGxpcHNlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmZpbGxFbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIHcsIGgsIGNvbnRleHQpIHtcclxuXHRjb250ZXh0LmVsbGlwc2UoeCwgeSwgdywgaCwgY29udGV4dCk7XHJcblx0Y29udGV4dC5maWxsKCk7XHJcblx0Y29udGV4dC5iZWdpblBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IHN0cm9rZWQgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvZmlnaW4gWSBvciBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB3IC0gd2lkdGggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIGhlaWdodCBvZiBlbGxpcHNlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLnN0cm9rZUVsbGlwc2UgPSBmdW5jdGlvbiAoeCwgeSwgdywgaCkge1xyXG5cdHRoaXMuZWxsaXBzZSh4LCB5LCB3LCBoKTtcclxuXHR0aGlzLnN0cm9rZSgpO1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBsaW5lIGJldHdlZW4gMiB2ZWN0b3IgY29vcmRpbmF0ZXMuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHgxIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5MSAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuKiBAcGFyYW0ge251bWJlcn0geDIgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkyIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmxpbmUgPSBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIsIGNvbnRleHQpIHtcclxuXHRjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG5cdGNvbnRleHQubW92ZVRvKHgxLCB5MSk7XHJcblx0Y29udGV4dC5saW5lVG8oeDIsIHkyKTtcclxuXHRjb250ZXh0LnN0cm9rZSgpO1xyXG5cdGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jYW52YXNEcmF3aW5nQXBpID0gY2FudmFzRHJhd2luZ0FwaTsiLCJ2YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcblxyXG52YXIgY29sb3JVdGlscyA9IHtcclxuXHQvKipcclxuICogcHJvdmlkZXMgY29sb3IgdXRpbCBtZXRob2RzLlxyXG4gKi9cclxuXHRyZ2I6IGZ1bmN0aW9uIHJnYihyZWQsIGdyZWVuLCBibHVlKSB7XHJcblx0XHRyZXR1cm4gJ3JnYignICsgbWF0aFV0aWxzLmNsYW1wKE1hdGgucm91bmQocmVkKSwgMCwgMjU1KSArICcsICcgKyBtYXRoVXRpbHMuY2xhbXAoTWF0aC5yb3VuZChncmVlbiksIDAsIDI1NSkgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKE1hdGgucm91bmQoYmx1ZSksIDAsIDI1NSkgKyAnKSc7XHJcblx0fSxcclxuXHRyZ2JhOiBmdW5jdGlvbiByZ2JhKHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhKSB7XHJcblx0XHRyZXR1cm4gJ3JnYmEoJyArIG1hdGhVdGlscy5jbGFtcChNYXRoLnJvdW5kKHJlZCksIDAsIDI1NSkgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKE1hdGgucm91bmQoZ3JlZW4pLCAwLCAyNTUpICsgJywgJyArIG1hdGhVdGlscy5jbGFtcChNYXRoLnJvdW5kKGJsdWUpLCAwLCAyNTUpICsgJywgJyArIG1hdGhVdGlscy5jbGFtcChhbHBoYSwgMCwgMSkgKyAnKSc7XHJcblx0fSxcclxuXHRoc2w6IGZ1bmN0aW9uIGhzbChodWUsIHNhdHVyYXRpb24sIGxpZ2h0bmVzcykge1xyXG5cdFx0cmV0dXJuICdoc2woJyArIGh1ZSArICcsICcgKyBtYXRoVXRpbHMuY2xhbXAoc2F0dXJhdGlvbiwgMCwgMTAwKSArICclLCAnICsgbWF0aFV0aWxzLmNsYW1wKGxpZ2h0bmVzcywgMCwgMTAwKSArICclKSc7XHJcblx0fSxcclxuXHRoc2xhOiBmdW5jdGlvbiBoc2xhKGh1ZSwgc2F0dXJhdGlvbiwgbGlnaHRuZXNzLCBhbHBoYSkge1xyXG5cdFx0cmV0dXJuICdoc2xhKCcgKyBodWUgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKHNhdHVyYXRpb24sIDAsIDEwMCkgKyAnJSwgJyArIG1hdGhVdGlscy5jbGFtcChsaWdodG5lc3MsIDAsIDEwMCkgKyAnJSwgJyArIG1hdGhVdGlscy5jbGFtcChhbHBoYSwgMCwgMSkgKyAnKSc7XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuY29sb3JVdGlscyA9IGNvbG9yVXRpbHM7IiwidmFyIGRyYXdpbmcgPSByZXF1aXJlKCcuL2NhbnZhc0FwaUF1Z21lbnRhdGlvbi5qcycpLmNhbnZhc0RyYXdpbmdBcGk7XHJcblxyXG5sZXQgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdjYW52YXMnICk7XHJcbmxldCBjdHggPSBjLmdldENvbnRleHQoICcyZCcgKTtcclxuXHJcbmxldCBibHVyQnVmZmVyID0gNTtcclxuXHJcbi8vIHcgPSAyMTAsIGggPSAxMTBcclxuYy53aWR0aCA9IDE2MCArICggYmx1ckJ1ZmZlciAqIDIgKTtcclxuYy5oZWlnaHQgPSAxMDAgKyAoIGJsdXJCdWZmZXIgKiAyICk7XHJcblxyXG5jSCA9IGMud2lkdGggLyAyO1xyXG5jViA9IGMuaGVpZ2h0IC8gMjtcclxuXHJcbi8vIHNwb3QgcmFkaXVzOiAoIDEwMCAtIDEwICkgLyAyID0gNDUgXHJcbmxldCBjU1IgPSAoIGMuaGVpZ2h0IC0gKCBibHVyQnVmZmVyICogMiApICkgLyAyO1xyXG5cclxuLy8gMTA1IC8gNCA9IDI2LjI1XHJcbmxldCBjU08gPSAoY0ggLyA0KSAqIDEuNDtcclxuXHJcbi8vIDEwMCArIDI2LjI1ID0gMTI2LjI1XHJcbmxldCByZWRTaGlmdCA9IGNIICsgY1NPO1xyXG5cclxuLy8gMTAwIC0gMjYuMjUgPSA3My43NVxyXG5sZXQgYmx1ZVNoaWZ0ID0gY0ggLSBjU087XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVXYXJwU3RhckltYWdlKCkge1xyXG5cclxuXHRsZXQgZ1JlZCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCggcmVkU2hpZnQsIGNWLCAwLCByZWRTaGlmdCwgY1YsIGNTUiApO1xyXG5cdGdSZWQuYWRkQ29sb3JTdG9wKCAwLCAncmdiYSggMjU1LCAwLCAwLCAxICknICk7XHJcblx0Z1JlZC5hZGRDb2xvclN0b3AoIDEsICdyZ2JhKCAyNTUsIDAsIDAsIDAgKScgKTtcclxuXHJcblx0bGV0IGdHcmVlbiA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCggY0gsIGNWLCAwLCBjSCwgY1YsIGNTUiApO1xyXG5cdGdHcmVlbi5hZGRDb2xvclN0b3AoIDAsICdyZ2JhKCAwLCAyNTUsIDAsIDEgKScgKTtcclxuXHRnR3JlZW4uYWRkQ29sb3JTdG9wKCAxLCAncmdiYSggMCwgMjU1LCAwLCAwICknICk7XHJcblxyXG5cdGxldCBnQmx1ZSA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCggYmx1ZVNoaWZ0LCBjViwgMCwgYmx1ZVNoaWZ0LCBjViwgY1NSICk7XHJcblx0Z0JsdWUuYWRkQ29sb3JTdG9wKCAwLCAncmdiYSggMCwgMCwgMjU1LCAxICknICk7XHJcblx0Z0JsdWUuYWRkQ29sb3JTdG9wKCAxLCAncmdiYSggMCwgMCwgMjU1LCAwICknICk7XHJcblxyXG5cdGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnbGlnaHRlcic7XHJcblxyXG5cdGN0eC5maWx0ZXIgPSBcImJsdXIoIDFweCApXCI7XHJcblxyXG5cdGN0eC5maWxsU3R5bGUgPSBnUmVkO1xyXG5cdGN0eC5maWxsQ2lyY2xlKCByZWRTaGlmdCwgY1YsIGNTUiwgYyApO1xyXG5cclxuXHRjdHguZmlsbFN0eWxlID0gZ0dyZWVuO1xyXG5cdGN0eC5maWxsQ2lyY2xlKCBjSCwgY1YsIGNTUiwgYyApO1xyXG5cclxuXHRjdHguZmlsbFN0eWxlID0gZ0JsdWU7XHJcblx0Y3R4LmZpbGxDaXJjbGUoIGJsdWVTaGlmdCwgY1YsIGNTUiwgYyApO1xyXG5cclxuXHJcblx0Ly8gY3R4LnRyYW5zbGF0ZSggY0gsIGNWICk7XHJcblx0Ly8gY3R4LnNjYWxlKCAxLjI1LCAwLjUgKTtcclxuXHQvLyBsZXQgZ1doaXRlID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KCAwLCAwLCAwLCAwLCAwLCBjU1IgKTtcclxuXHQvLyBnV2hpdGUuYWRkQ29sb3JTdG9wKCAwLjMsICdyZ2JhKCAyNTUsIDI1NSwgMjU1LCAwLjggKScgKTtcclxuXHQvLyBnV2hpdGUuYWRkQ29sb3JTdG9wKCAxLCAncmdiYSggMjU1LCAyNTUsIDI1NSwgMCApJyApO1xyXG5cclxuXHQvLyBjdHguZmlsbFN0eWxlID0gZ1doaXRlO1xyXG5cdC8vIGN0eC5maWxsQ2lyY2xlKCAwLCAwLCBjU1IsIGMgKTtcclxuXHJcblx0Ly8gY3R4LnNjYWxlKCAxLCAyICk7XHJcblx0Ly8gY3R4LnRyYW5zbGF0ZSggLWNILCAtY1YgKTtcclxuXHJcblx0Yy5yZW5kZXJQcm9wcyA9IHtcclxuXHRcdHNyYzoge1xyXG5cdFx0XHR4OiAwLCB5OiAwLCB3OiBjLndpZHRoLCBoOiBjLmhlaWdodFxyXG5cdFx0fSxcclxuXHRcdGRlc3Q6IHtcclxuXHRcdFx0eDogLWNILCB5OiAtY1ZcclxuXHRcdH1cclxuXHR9XHJcblx0Ly8gY29uc29sZS5sb2coICdjOiAnLCBjLnJlbmRlclByb3BzICk7XHJcblxyXG5cdCQoICcud2FycFN0YXJJbWFnZUNhbnZhcycgKS5hcHBlbmQoIGMgKTtcclxuXHJcblx0cmV0dXJuIGM7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVdhcnBTdGFySW1hZ2U7IiwidmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG5cclxudmFyIGxhc3RDYWxsZWRUaW1lID0gdm9pZCAwO1xyXG5cclxudmFyIGRlYnVnID0ge1xyXG5cclxuICAgIGhlbHBlcnM6IHtcclxuICAgICAgICBnZXRTdHlsZTogZnVuY3Rpb24gZ2V0U3R5bGUoZWxlbWVudCwgcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSkgOiBlbGVtZW50LnN0eWxlW3Byb3BlcnR5LnJlcGxhY2UoLy0oW2Etel0pL2csIGZ1bmN0aW9uIChnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ1sxXS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgICB9KV07XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbnZlcnRDb2xvcjogZnVuY3Rpb24gaW52ZXJ0Q29sb3IoaGV4LCBidykge1xyXG4gICAgICAgICAgICBpZiAoaGV4LmluZGV4T2YoJyMnKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaGV4ID0gaGV4LnNsaWNlKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnZlcnQgMy1kaWdpdCBoZXggdG8gNi1kaWdpdHMuXHJcbiAgICAgICAgICAgIGlmIChoZXgubGVuZ3RoID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICBoZXggPSBoZXhbMF0gKyBoZXhbMF0gKyBoZXhbMV0gKyBoZXhbMV0gKyBoZXhbMl0gKyBoZXhbMl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGhleC5sZW5ndGggIT09IDYpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBIRVggY29sb3IuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHIgPSBwYXJzZUludChoZXguc2xpY2UoMCwgMiksIDE2KSxcclxuICAgICAgICAgICAgICAgIGcgPSBwYXJzZUludChoZXguc2xpY2UoMiwgNCksIDE2KSxcclxuICAgICAgICAgICAgICAgIGIgPSBwYXJzZUludChoZXguc2xpY2UoNCwgNiksIDE2KTtcclxuICAgICAgICAgICAgaWYgKGJ3KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTQzMDIzLzExMjczMVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHIgKiAwLjI5OSArIGcgKiAwLjU4NyArIGIgKiAwLjExNCA+IDE4NiA/ICcjMDAwMDAwJyA6ICcjRkZGRkZGJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpbnZlcnQgY29sb3IgY29tcG9uZW50c1xyXG4gICAgICAgICAgICByID0gKDI1NSAtIHIpLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgZyA9ICgyNTUgLSBnKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgICAgIGIgPSAoMjU1IC0gYikudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgICAgICAvLyBwYWQgZWFjaCB3aXRoIHplcm9zIGFuZCByZXR1cm5cclxuICAgICAgICAgICAgcmV0dXJuIFwiI1wiICsgcGFkWmVybyhyKSArIHBhZFplcm8oZykgKyBwYWRaZXJvKGIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGRpc3BsYXk6IGZ1bmN0aW9uIGRpc3BsYXkoZGlzcGxheUZsYWcsIG1lc3NhZ2UsIHBhcmFtKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmFsbCA9PT0gdHJ1ZSB8fCBkaXNwbGF5RmxhZyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlLCBwYXJhbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBkZWJ1Z091dHB1dDogZnVuY3Rpb24gZGVidWdPdXRwdXQoY2FudmFzLCBjb250ZXh0LCBsYWJlbCwgcGFyYW0sIG91dHB1dE51bSwgb3V0cHV0Qm91bmRzKSB7XHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICBpZiAob3V0cHV0Qm91bmRzKSB7XHJcbiAgICAgICAgICAgIHZhciB0aGlzUmVkID0gbWF0aFV0aWxzLm1hcChwYXJhbSwgb3V0cHV0Qm91bmRzLm1pbiwgb3V0cHV0Qm91bmRzLm1heCwgMjU1LCAwLCB0cnVlKTtcclxuICAgICAgICAgICAgdmFyIHRoaXNHcmVlbiA9IG1hdGhVdGlscy5tYXAocGFyYW0sIG91dHB1dEJvdW5kcy5taW4sIG91dHB1dEJvdW5kcy5tYXgsIDAsIDI1NSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIC8vIHZhciB0aGlzQmx1ZSA9IG1hdGhVdGlscy5tYXAocGFyYW0sIG91dHB1dEJvdW5kcy5taW4sIG91dHB1dEJvdW5kcy5tYXgsIDAsIDI1NSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHZhciB0aGlzQ29sb3IgPSAncmdiKCAnICsgdGhpc1JlZCArICcsICcgKyB0aGlzR3JlZW4gKyAnLCAwICknO1xyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICdjaGFuZ2luZyBkZWJ1ZyBjb2xvciBvZjogJytwYXJhbSsnIHRvOiAnK3RoaXNDb2xvciApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0aGlzQ29sb3IgPSBcIiNlZmVmZWZcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB2UG9zID0gb3V0cHV0TnVtICogNTAgKyA1MDtcclxuICAgICAgICBjb250ZXh0LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgICAgIGNvbnRleHQuZm9udCA9IFwiMTRwdCBhcmlhbFwiO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpc0NvbG9yO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KGxhYmVsICsgcGFyYW0sIDUwLCB2UG9zKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2FsY3VsYXRlRnBzOiBmdW5jdGlvbiBjYWxjdWxhdGVGcHMoKSB7XHJcbiAgICAgICAgaWYgKCFsYXN0Q2FsbGVkVGltZSkge1xyXG4gICAgICAgICAgICBsYXN0Q2FsbGVkVGltZSA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkZWx0YSA9ICh3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgLSBsYXN0Q2FsbGVkVGltZSkgLyAxMDAwO1xyXG4gICAgICAgIGxhc3RDYWxsZWRUaW1lID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIHJldHVybiAxIC8gZGVsdGE7XHJcbiAgICB9LFxyXG5cclxuICAgIGZsYWdzOiB7XHJcbiAgICAgICAgYWxsOiBmYWxzZSxcclxuICAgICAgICBwYXJ0czoge1xyXG4gICAgICAgICAgICBjbGlja3M6IHRydWUsXHJcbiAgICAgICAgICAgIHJ1bnRpbWU6IHRydWUsXHJcbiAgICAgICAgICAgIHVwZGF0ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGtpbGxDb25kaXRpb25zOiBmYWxzZSxcclxuICAgICAgICAgICAgYW5pbWF0aW9uQ291bnRlcjogZmFsc2UsXHJcbiAgICAgICAgICAgIGVudGl0eVN0b3JlOiBmYWxzZSxcclxuICAgICAgICAgICAgZnBzOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZGVidWcgPSBkZWJ1ZztcclxubW9kdWxlLmV4cG9ydHMubGFzdENhbGxlZFRpbWUgPSBsYXN0Q2FsbGVkVGltZTsiLCIvKlxyXG4gKiBUaGlzIGlzIGEgbmVhci1kaXJlY3QgcG9ydCBvZiBSb2JlcnQgUGVubmVyJ3MgZWFzaW5nIGVxdWF0aW9ucy4gUGxlYXNlIHNob3dlciBSb2JlcnQgd2l0aFxyXG4gKiBwcmFpc2UgYW5kIGFsbCBvZiB5b3VyIGFkbWlyYXRpb24uIEhpcyBsaWNlbnNlIGlzIHByb3ZpZGVkIGJlbG93LlxyXG4gKlxyXG4gKiBGb3IgaW5mb3JtYXRpb24gb24gaG93IHRvIHVzZSB0aGVzZSBmdW5jdGlvbnMgaW4geW91ciBhbmltYXRpb25zLCBjaGVjayBvdXQgbXkgZm9sbG93aW5nIHR1dG9yaWFsOiBcclxuICogaHR0cDovL2JpdC5seS8xOGlISEtxXHJcbiAqXHJcbiAqIC1LaXJ1cGFcclxuICovXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBURVJNUyBPRiBVU0UgLSBFQVNJTkcgRVFVQVRJT05TXHJcbiAqIFxyXG4gKiBPcGVuIHNvdXJjZSB1bmRlciB0aGUgQlNEIExpY2Vuc2UuIFxyXG4gKiBcclxuICogQ29weXJpZ2h0IMKpIDIwMDEgUm9iZXJ0IFBlbm5lclxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiBcclxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbiwgXHJcbiAqIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcclxuICogXHJcbiAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIFxyXG4gKiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXHJcbiAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IFxyXG4gKiBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBcclxuICogcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG4gKiBcclxuICogTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgYXV0aG9yIG5vciB0aGUgbmFtZXMgb2YgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2UgXHJcbiAqIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXHJcbiAqIFxyXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkQgQU5ZIFxyXG4gKiBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0ZcclxuICogTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiAqIENPUFlSSUdIVCBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCxcclxuICogRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFXHJcbiAqIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBcclxuICogQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcclxuICogTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgXHJcbiAqIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS4gXHJcbiAqXHJcbiAqL1xyXG5cclxudmFyIGVhc2luZ0VxdWF0aW9ucyA9IHtcclxuXHQvKipcclxuICogcHJvdmlkZXMgZWFzaW5nIHV0aWwgbWV0aG9kcy5cclxuICovXHJcblx0bGluZWFyRWFzZTogZnVuY3Rpb24gbGluZWFyRWFzZShjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluUXVhZDogZnVuY3Rpb24gZWFzZUluUXVhZChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zKSAqIGN1cnJlbnRJdGVyYXRpb24gKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRRdWFkOiBmdW5jdGlvbiBlYXNlT3V0UXVhZChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiAtY2hhbmdlSW5WYWx1ZSAqIChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgKiAoY3VycmVudEl0ZXJhdGlvbiAtIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiBlYXNlSW5PdXRRdWFkKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBjdXJyZW50SXRlcmF0aW9uICogY3VycmVudEl0ZXJhdGlvbiArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gLWNoYW5nZUluVmFsdWUgLyAyICogKC0tY3VycmVudEl0ZXJhdGlvbiAqIChjdXJyZW50SXRlcmF0aW9uIC0gMikgLSAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluQ3ViaWM6IGZ1bmN0aW9uIGVhc2VJbkN1YmljKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zLCAzKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dEN1YmljOiBmdW5jdGlvbiBlYXNlT3V0Q3ViaWMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSwgMykgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uIGVhc2VJbk91dEN1YmljKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uLCAzKSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAtIDIsIDMpICsgMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJblF1YXJ0OiBmdW5jdGlvbiBlYXNlSW5RdWFydChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucywgNCkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRRdWFydDogZnVuY3Rpb24gZWFzZU91dFF1YXJ0KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIC1jaGFuZ2VJblZhbHVlICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxLCA0KSAtIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gZWFzZUluT3V0UXVhcnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24sIDQpICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAtY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAtIDIsIDQpIC0gMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJblF1aW50OiBmdW5jdGlvbiBlYXNlSW5RdWludChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucywgNSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRRdWludDogZnVuY3Rpb24gZWFzZU91dFF1aW50KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEsIDUpICsgMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiBlYXNlSW5PdXRRdWludChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiwgNSkgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLSAyLCA1KSArIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5TaW5lOiBmdW5jdGlvbiBlYXNlSW5TaW5lKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoMSAtIE1hdGguY29zKGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgKiAoTWF0aC5QSSAvIDIpKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRTaW5lOiBmdW5jdGlvbiBlYXNlT3V0U2luZShjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5zaW4oY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAqIChNYXRoLlBJIC8gMikpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRTaW5lOiBmdW5jdGlvbiBlYXNlSW5PdXRTaW5lKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKDEgLSBNYXRoLmNvcyhNYXRoLlBJICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucykpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5FeHBvOiBmdW5jdGlvbiBlYXNlSW5FeHBvKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdygyLCAxMCAqIChjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSkpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlT3V0RXhwbzogZnVuY3Rpb24gZWFzZU91dEV4cG8oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICgtTWF0aC5wb3coMiwgLTEwICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucykgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0RXhwbzogZnVuY3Rpb24gZWFzZUluT3V0RXhwbyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coMiwgMTAgKiAoY3VycmVudEl0ZXJhdGlvbiAtIDEpKSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tY3VycmVudEl0ZXJhdGlvbikgKyAyKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluQ2lyYzogZnVuY3Rpb24gZWFzZUluQ2lyYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKDEgLSBNYXRoLnNxcnQoMSAtIChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgKiBjdXJyZW50SXRlcmF0aW9uKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRDaXJjOiBmdW5jdGlvbiBlYXNlT3V0Q2lyYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5zcXJ0KDEgLSAoY3VycmVudEl0ZXJhdGlvbiA9IGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxKSAqIGN1cnJlbnRJdGVyYXRpb24pICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRDaXJjOiBmdW5jdGlvbiBlYXNlSW5PdXRDaXJjKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoMSAtIE1hdGguc3FydCgxIC0gY3VycmVudEl0ZXJhdGlvbiAqIGN1cnJlbnRJdGVyYXRpb24pKSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5zcXJ0KDEgLSAoY3VycmVudEl0ZXJhdGlvbiAtPSAyKSAqIGN1cnJlbnRJdGVyYXRpb24pICsgMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbkVsYXN0aWM6IGZ1bmN0aW9uIGVhc2VJbkVsYXN0aWModCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHMgPSAxLjcwMTU4O3ZhciBwID0gMDt2YXIgYSA9IGM7XHJcblx0XHRpZiAodCA9PSAwKSByZXR1cm4gYjtpZiAoKHQgLz0gZCkgPT0gMSkgcmV0dXJuIGIgKyBjO2lmICghcCkgcCA9IGQgKiAuMztcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHtcclxuXHRcdFx0YSA9IGM7dmFyIHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB2YXIgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKGMgLyBhKTtcclxuXHRcdHJldHVybiAtKGEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKSArIGI7XHJcblx0fSxcclxuXHRlYXNlT3V0RWxhc3RpYzogZnVuY3Rpb24gZWFzZU91dEVsYXN0aWModCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHMgPSAxLjcwMTU4O3ZhciBwID0gMDt2YXIgYSA9IGM7XHJcblx0XHRpZiAodCA9PSAwKSByZXR1cm4gYjtpZiAoKHQgLz0gZCkgPT0gMSkgcmV0dXJuIGIgKyBjO2lmICghcCkgcCA9IGQgKiAuMztcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHtcclxuXHRcdFx0YSA9IGM7dmFyIHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB2YXIgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKGMgLyBhKTtcclxuXHRcdHJldHVybiBhICogTWF0aC5wb3coMiwgLTEwICogdCkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSArIGMgKyBiO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dEVsYXN0aWM6IGZ1bmN0aW9uIGVhc2VJbk91dEVsYXN0aWModCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHMgPSAxLjcwMTU4O3ZhciBwID0gMDt2YXIgYSA9IGM7XHJcblx0XHRpZiAodCA9PSAwKSByZXR1cm4gYjtpZiAoKHQgLz0gZCAvIDIpID09IDIpIHJldHVybiBiICsgYztpZiAoIXApIHAgPSBkICogKC4zICogMS41KTtcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHtcclxuXHRcdFx0YSA9IGM7dmFyIHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB2YXIgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKGMgLyBhKTtcclxuXHRcdGlmICh0IDwgMSkgcmV0dXJuIC0uNSAqIChhICogTWF0aC5wb3coMiwgMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSkgKyBiO1xyXG5cdFx0cmV0dXJuIGEgKiBNYXRoLnBvdygyLCAtMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSAqIC41ICsgYyArIGI7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluQmFjazogZnVuY3Rpb24gZWFzZUluQmFjayh0LCBiLCBjLCBkLCBzKSB7XHJcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xyXG5cdFx0cmV0dXJuIGMgKiAodCAvPSBkKSAqIHQgKiAoKHMgKyAxKSAqIHQgLSBzKSArIGI7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dEJhY2s6IGZ1bmN0aW9uIGVhc2VPdXRCYWNrKHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRyZXR1cm4gYyAqICgodCA9IHQgLyBkIC0gMSkgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAxKSArIGI7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0QmFjazogZnVuY3Rpb24gZWFzZUluT3V0QmFjayh0LCBiLCBjLCBkLCBzKSB7XHJcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xyXG5cdFx0aWYgKCh0IC89IGQgLyAyKSA8IDEpIHJldHVybiBjIC8gMiAqICh0ICogdCAqICgoKHMgKj0gMS41MjUpICsgMSkgKiB0IC0gcykpICsgYjtcclxuXHRcdHJldHVybiBjIC8gMiAqICgodCAtPSAyKSAqIHQgKiAoKChzICo9IDEuNTI1KSArIDEpICogdCArIHMpICsgMikgKyBiO1xyXG5cdH0sXHJcblxyXG5cdC8vIGVhc2VJbkJvdW5jZTogZnVuY3Rpb24odCwgYiwgYywgZCkge1xyXG5cdC8vICAgICByZXR1cm4gYyAtIGVhc2VPdXRCb3VuY2UoZC10LCAwLCBjLCBkKSArIGI7XHJcblx0Ly8gfSxcclxuXHJcblx0ZWFzZU91dEJvdW5jZTogZnVuY3Rpb24gZWFzZU91dEJvdW5jZSh0LCBiLCBjLCBkKSB7XHJcblx0XHRpZiAoKHQgLz0gZCkgPCAxIC8gMi43NSkge1xyXG5cdFx0XHRyZXR1cm4gYyAqICg3LjU2MjUgKiB0ICogdCkgKyBiO1xyXG5cdFx0fSBlbHNlIGlmICh0IDwgMiAvIDIuNzUpIHtcclxuXHRcdFx0cmV0dXJuIGMgKiAoNy41NjI1ICogKHQgLT0gMS41IC8gMi43NSkgKiB0ICsgLjc1KSArIGI7XHJcblx0XHR9IGVsc2UgaWYgKHQgPCAyLjUgLyAyLjc1KSB7XHJcblx0XHRcdHJldHVybiBjICogKDcuNTYyNSAqICh0IC09IDIuMjUgLyAyLjc1KSAqIHQgKyAuOTM3NSkgKyBiO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGMgKiAoNy41NjI1ICogKHQgLT0gMi42MjUgLyAyLjc1KSAqIHQgKyAuOTg0Mzc1KSArIGI7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBlYXNlSW5PdXRCb3VuY2U6IGZ1bmN0aW9uKHQsIGIsIGMsIGQpIHtcclxuXHQvLyAgICAgaWYgKHQgPCBkLzIpIHJldHVybiB0aGlzLmVhc2VJbkJvdW5jZSh0KjIsIDAsIGMsIGQpICogLjUgKyBiO1xyXG5cdC8vICAgICByZXR1cm4gdGhpcy5lYXNlT3V0Qm91bmNlKHQqMi1kLCAwLCBjLCBkKSAqIC41ICsgYyouNSArIGI7XHJcblx0Ly8gfVxyXG59O1xyXG5cclxuZWFzaW5nRXF1YXRpb25zLmVhc2VJbkJvdW5jZSA9IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XHJcblx0cmV0dXJuIGMgLSBlYXNpbmdFcXVhdGlvbnMuZWFzZU91dEJvdW5jZShkIC0gdCwgMCwgYywgZCkgKyBiO1xyXG59LCBlYXNpbmdFcXVhdGlvbnMuZWFzZUluT3V0Qm91bmNlID0gZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcclxuXHRpZiAodCA8IGQgLyAyKSByZXR1cm4gZWFzaW5nRXF1YXRpb25zLmVhc2VJbkJvdW5jZSh0ICogMiwgMCwgYywgZCkgKiAuNSArIGI7XHJcblx0cmV0dXJuIGVhc2luZ0VxdWF0aW9ucy5lYXNlT3V0Qm91bmNlKHQgKiAyIC0gZCwgMCwgYywgZCkgKiAuNSArIGMgKiAuNSArIGI7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5lYXNpbmdFcXVhdGlvbnMgPSBlYXNpbmdFcXVhdGlvbnM7IiwidmFyIEVtaXR0ZXJTdG9yZUZuID0gZnVuY3Rpb24gRW1pdHRlclN0b3JlRm4oKSB7fTtcclxuXHJcbkVtaXR0ZXJTdG9yZUZuLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoIHN0b3JlICkge1xyXG4gIHZhciBpID0gc3RvcmUubGVuZ3RoIC0gMTtcclxuICBmb3IgKDsgaSA+PSAwOyBpLS0pIHtcclxuICAgIHN0b3JlW2ldLnVwZGF0ZUVtaXR0ZXIoKTtcclxuICAgIC8vIHN0b3JlW2ldLnJlbmRlckVtaXR0ZXIoIGN0eCApO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLkVtaXR0ZXJTdG9yZUZuID0gRW1pdHRlclN0b3JlRm47IiwiLy8gZW1pc3Npb24gdGhlbWVcclxuXHJcbnZhciBiYXNlRW1pdHRlclRoZW1lID0ge1xyXG5cclxuXHRlbWl0dGVyOiB7XHJcblxyXG5cdFx0YWN0aXZlOiAwLFxyXG5cclxuXHRcdC8vIHBvc2l0aW9uXHJcblx0XHR4OiAwLFxyXG5cdFx0eTogMCxcclxuXHRcdHhWZWw6IDAsXHJcblx0XHR5VmVsOiAwLFxyXG5cdFx0YXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0Ly8gZW1pc3Npb24gcmF0ZSBjb25maWcgKHBlciBjeWNsZSAoIGZyYW1lICkgKVxyXG5cdGVtaXNzaW9uOiB7XHJcblxyXG5cdFx0cmF0ZToge1xyXG5cdFx0XHRtaW46IDAsXHJcblx0XHRcdG1heDogMCxcclxuXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0XHRkZWNheU1heDogMFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGVtaXNzaW9uIHJlcGVhdGVyIGNvbmZpZ1xyXG5cdFx0cmVwZWF0ZXI6IHtcclxuXHRcdFx0Ly8gd2hhdCBpcyB0aGUgcmVwZXRpdGlvbiByYXRlICggZnJhbWVzIClcclxuXHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0Ly8gZG9lcyB0aGUgcmVwZXRpdGlvbiByYXRlIGRlY2F5ICggZ2V0IGxvbmdlciApPyBob3cgbXVjaCBsb25nZXI/IFxyXG5cdFx0XHRkZWNheToge1xyXG5cdFx0XHRcdHJhdGU6IDAsXHJcblx0XHRcdFx0ZGVjYXlNYXg6IDBcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBpbml0aWFsIGRpcmVjdGlvbiBvZiBwYXJ0aWNsZXNcclxuXHRcdGRpcmVjdGlvbjoge1xyXG5cdFx0XHRyYWQ6IDAsIC8vIGluIHJhZGlhbnMgKDAgLSAyKVxyXG5cdFx0XHRtaW46IDAsIC8vIGxvdyBib3VuZHMgKHJhZGlhbnMpXHJcblx0XHRcdG1heDogMCAvLyBoaWdoIGJvdW5kcyAocmFkaWFucylcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gYXJlIHBhcnRpY2xlcyBvZmZzZXQgZnJvbSBpbml0YWwgeC95XHJcblx0XHRyYWRpYWxEaXNwbGFjZW1lbnQ6IDAsXHJcblx0XHQvLyBpcyB0aGUgb2Zmc2V0IGZlYXRoZXJlZD9cclxuXHRcdHJhZGlhbERpc3BsYWNlbWVudE9mZnNldDogMCxcclxuXHJcblx0XHQvL2luaXRpYWwgdmVsb2NpdHkgb2YgcGFydGljbGVzXHJcblx0XHRpbXB1bHNlOiB7XHJcblx0XHRcdHBvdzogMCxcclxuXHRcdFx0bWluOiAwLFxyXG5cdFx0XHRtYXg6IDBcclxuXHRcdH1cclxuXHR9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuYmFzZUVtaXR0ZXJUaGVtZSA9IGJhc2VFbWl0dGVyVGhlbWU7IiwiLy8gZW1pc3Npb24gdGhlbWVcclxuXHJcbnZhciBmbGFtZVN0cmVhbVRoZW1lID0ge1xyXG5cclxuXHRlbWl0dGVyOiB7XHJcblxyXG5cdFx0YWN0aXZlOiAxLFxyXG5cclxuXHRcdC8vIHBvc2l0aW9uXHJcblx0XHR4OiAwLFxyXG5cdFx0eTogMCxcclxuXHRcdHhWZWw6IDAsXHJcblx0XHR5VmVsOiAwLFxyXG5cdFx0YXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlXHJcblx0fSxcclxuXHJcblx0Ly8gZW1pc3Npb24gcmF0ZSBjb25maWcgKHBlciBjeWNsZSAoIGZyYW1lICkgKVxyXG5cdGVtaXNzaW9uOiB7XHJcblxyXG5cdFx0cmF0ZToge1xyXG5cdFx0XHRtaW46IDMwLFxyXG5cdFx0XHRtYXg6IDYwLFxyXG5cclxuXHRcdFx0ZGVjYXk6IHtcclxuXHRcdFx0XHRyYXRlOiAwLFxyXG5cdFx0XHRcdGRlY2F5TWF4OiAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gZW1pc3Npb24gcmVwZWF0ZXIgY29uZmlnXHJcblx0XHRyZXBlYXRlcjoge1xyXG5cdFx0XHQvLyB3aGF0IGlzIHRoZSByZXBldGl0aW9uIHJhdGUgKCBmcmFtZXMgKVxyXG5cdFx0XHRyYXRlOiAxLFxyXG5cdFx0XHQvLyBkb2VzIHRoZSByZXBldGl0aW9uIHJhdGUgZGVjYXkgKCBnZXQgbG9uZ2VyICk/IGhvdyBtdWNoIGxvbmdlcj8gXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0XHRkZWNheU1heDogMzAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaW5pdGlhbCBkaXJlY3Rpb24gb2YgcGFydGljbGVzXHJcblx0XHRkaXJlY3Rpb246IHtcclxuXHRcdFx0cmFkOiAwLCAvLyBpbiByYWRpYW5zICgwIC0gMilcclxuXHRcdFx0bWluOiAxLjQ1LCAvLyBsb3cgYm91bmRzIChyYWRpYW5zKVxyXG5cdFx0XHRtYXg6IDEuNTUgLy8gaGlnaCBib3VuZHMgKHJhZGlhbnMpXHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGFyZSBwYXJ0aWNsZXMgb2Zmc2V0IGZyb20gaW5pdGFsIHgveVxyXG5cdFx0cmFkaWFsRGlzcGxhY2VtZW50OiAwLFxyXG5cdFx0Ly8gaXMgdGhlIG9mZnNldCBmZWF0aGVyZWQ/XHJcblx0XHRyYWRpYWxEaXNwbGFjZW1lbnRPZmZzZXQ6IDAsXHJcblxyXG5cdFx0Ly9pbml0aWFsIHZlbG9jaXR5IG9mIHBhcnRpY2xlc1xyXG5cdFx0aW1wdWxzZToge1xyXG5cdFx0XHRwb3c6IDAsXHJcblx0XHRcdG1pbjogOCxcclxuXHRcdFx0bWF4OiAxNVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5mbGFtZVN0cmVhbVRoZW1lID0gZmxhbWVTdHJlYW1UaGVtZTsiLCIvLyBlbWlzc2lvbiB0aGVtZVxyXG5cclxudmFyIHNpbmdsZUJ1cnN0VGhlbWUgPSB7XHJcblxyXG5cdGVtaXR0ZXI6IHtcclxuXHJcblx0XHRhY3RpdmU6IDEsXHJcblxyXG5cdFx0Ly8gcG9zaXRpb25cclxuXHRcdHg6IDAsXHJcblx0XHR5OiAwLFxyXG5cdFx0eFZlbDogMCxcclxuXHRcdHlWZWw6IDAsXHJcblx0XHRhcHBseUdsb2JhbEZvcmNlczogZmFsc2VcclxuXHR9LFxyXG5cclxuXHQvLyBlbWlzc2lvbiByYXRlIGNvbmZpZyAocGVyIGN5Y2xlICggZnJhbWUgKSApXHJcblx0ZW1pc3Npb246IHtcclxuXHJcblx0XHRyYXRlOiB7XHJcblx0XHRcdG1pbjogMzAsXHJcblx0XHRcdG1heDogMTAwLFxyXG5cclxuXHRcdFx0ZGVjYXk6IHtcclxuXHRcdFx0XHRyYXRlOiA1LFxyXG5cdFx0XHRcdGRlY2F5TWF4OiAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gZW1pc3Npb24gcmVwZWF0ZXIgY29uZmlnXHJcblx0XHRyZXBlYXRlcjoge1xyXG5cdFx0XHQvLyB3aGF0IGlzIHRoZSByZXBldGl0aW9uIHJhdGUgKCBmcmFtZXMgKVxyXG5cdFx0XHRyYXRlOiAwLFxyXG5cdFx0XHQvLyBkb2VzIHRoZSByZXBldGl0aW9uIHJhdGUgZGVjYXkgKCBnZXQgbG9uZ2VyICk/IGhvdyBtdWNoIGxvbmdlcj8gXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0XHRkZWNheU1heDogMzAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gaW5pdGlhbCBkaXJlY3Rpb24gb2YgcGFydGljbGVzXHJcblx0XHRkaXJlY3Rpb246IHtcclxuXHRcdFx0cmFkOiAwLCAvLyBpbiByYWRpYW5zICgwIC0gMilcclxuXHRcdFx0bWluOiAwLCAvLyBsb3cgYm91bmRzIChyYWRpYW5zKVxyXG5cdFx0XHRtYXg6IDIgLy8gaGlnaCBib3VuZHMgKHJhZGlhbnMpXHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGFyZSBwYXJ0aWNsZXMgb2Zmc2V0IGZyb20gaW5pdGFsIHgveVxyXG5cdFx0cmFkaWFsRGlzcGxhY2VtZW50OiAyMCxcclxuXHRcdC8vIGlzIHRoZSBvZmZzZXQgZmVhdGhlcmVkP1xyXG5cdFx0cmFkaWFsRGlzcGxhY2VtZW50T2Zmc2V0OiAwLFxyXG5cclxuXHRcdC8vaW5pdGlhbCB2ZWxvY2l0eSBvZiBwYXJ0aWNsZXNcclxuXHRcdGltcHVsc2U6IHtcclxuXHRcdFx0cG93OiAwLFxyXG5cdFx0XHRtaW46IDUwLFxyXG5cdFx0XHRtYXg6IDgwXHJcblx0XHR9XHJcblx0fVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnNpbmdsZUJ1cnN0VGhlbWUgPSBzaW5nbGVCdXJzdFRoZW1lOyIsIi8vIGVtaXNzaW9uIHRoZW1lXHJcblxyXG52YXIgc21va2VTdHJlYW1UaGVtZSA9IHtcclxuXHJcblx0ZW1pdHRlcjoge1xyXG5cclxuXHRcdGFjdGl2ZTogMCxcclxuXHJcblx0XHQvLyBwb3NpdGlvblxyXG5cdFx0eDogMCxcclxuXHRcdHk6IDAsXHJcblx0XHR4VmVsOiAwLFxyXG5cdFx0eVZlbDogMCxcclxuXHRcdGFwcGx5R2xvYmFsRm9yY2VzOiBmYWxzZVxyXG5cdH0sXHJcblxyXG5cdC8vIGVtaXNzaW9uIHJhdGUgY29uZmlnIChwZXIgY3ljbGUgKCBmcmFtZSApIClcclxuXHRlbWlzc2lvbjoge1xyXG5cclxuXHRcdHJhdGU6IHtcclxuXHRcdFx0bWluOiA1LFxyXG5cdFx0XHRtYXg6IDEwLFxyXG5cclxuXHRcdFx0ZGVjYXk6IHtcclxuXHRcdFx0XHRyYXRlOiAwLFxyXG5cdFx0XHRcdGRlY2F5TWF4OiAwXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gZW1pc3Npb24gcmVwZWF0ZXIgY29uZmlnXHJcblx0XHRyZXBlYXRlcjoge1xyXG5cdFx0XHQvLyB3aGF0IGlzIHRoZSByZXBldGl0aW9uIHJhdGUgKCBmcmFtZXMgKVxyXG5cdFx0XHRyYXRlOiAwLFxyXG5cdFx0XHQvLyBkb2VzIHRoZSByZXBldGl0aW9uIHJhdGUgZGVjYXkgKCBnZXQgbG9uZ2VyICk/IGhvdyBtdWNoIGxvbmdlcj8gXHJcblx0XHRcdGRlY2F5OiB7XHJcblx0XHRcdFx0cmF0ZTogMCxcclxuXHRcdFx0XHRkZWNheU1heDogMFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIGluaXRpYWwgZGlyZWN0aW9uIG9mIHBhcnRpY2xlc1xyXG5cdFx0ZGlyZWN0aW9uOiB7XHJcblx0XHRcdHJhZDogMCwgLy8gaW4gcmFkaWFucyAoMCAtIDIpXHJcblx0XHRcdG1pbjogMS40OSwgLy8gbG93IGJvdW5kcyAocmFkaWFucylcclxuXHRcdFx0bWF4OiAxLjUxIC8vIGhpZ2ggYm91bmRzIChyYWRpYW5zKVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBhcmUgcGFydGljbGVzIG9mZnNldCBmcm9tIGluaXRhbCB4L3lcclxuXHRcdHJhZGlhbERpc3BsYWNlbWVudDogMCxcclxuXHRcdC8vIGlzIHRoZSBvZmZzZXQgZmVhdGhlcmVkP1xyXG5cdFx0cmFkaWFsRGlzcGxhY2VtZW50T2Zmc2V0OiAwLFxyXG5cclxuXHRcdC8vaW5pdGlhbCB2ZWxvY2l0eSBvZiBwYXJ0aWNsZXNcclxuXHRcdGltcHVsc2U6IHtcclxuXHRcdFx0cG93OiAwLFxyXG5cdFx0XHRtaW46IDUsXHJcblx0XHRcdG1heDogMTBcclxuXHRcdH1cclxuXHR9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuc21va2VTdHJlYW1UaGVtZSA9IHNtb2tlU3RyZWFtVGhlbWU7IiwiLy8gZW1pc3Npb24gdGhlbWVcclxuXHJcbiAgdmFyIHdhcnBTdHJlYW1UaGVtZSA9IHtcclxuXHJcbiAgICBlbWl0dGVyOiB7XHJcblxyXG4gICAgICBhY3RpdmU6IDEsXHJcblxyXG4gICAgICAvLyBwb3NpdGlvblxyXG4gICAgICB4OiAwLFxyXG4gICAgICB5OiAwLFxyXG4gICAgICB4VmVsOiAwLFxyXG4gICAgICB5VmVsOiAwLFxyXG4gICAgICBhcHBseUdsb2JhbEZvcmNlczogZmFsc2VcclxuICAgIH0sXHJcblxyXG4gICAgLy8gZW1pc3Npb24gcmF0ZSBjb25maWcgKHBlciBjeWNsZSAoIGZyYW1lICkgKVxyXG4gICAgZW1pc3Npb246IHtcclxuXHJcbiAgICAgIHJhdGU6IHtcclxuICAgICAgICBtaW46IDQsXHJcbiAgICAgICAgbWF4OiAxMCxcclxuXHJcbiAgICAgICAgZGVjYXk6IHtcclxuICAgICAgICAgIHJhdGU6IDAsXHJcbiAgICAgICAgICBkZWNheU1heDogMFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vIGVtaXNzaW9uIHJlcGVhdGVyIGNvbmZpZ1xyXG4gICAgICByZXBlYXRlcjoge1xyXG4gICAgICAgIC8vIHdoYXQgaXMgdGhlIHJlcGV0aXRpb24gcmF0ZSAoIGZyYW1lcyApXHJcbiAgICAgICAgcmF0ZTogMixcclxuICAgICAgICAvLyBkb2VzIHRoZSByZXBldGl0aW9uIHJhdGUgZGVjYXkgKCBnZXQgbG9uZ2VyICk/IGhvdyBtdWNoIGxvbmdlcj8gXHJcbiAgICAgICAgZGVjYXk6IHtcclxuICAgICAgICAgIHJhdGU6IDAsXHJcbiAgICAgICAgICBkZWNheU1heDogMzAwXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gaW5pdGlhbCBkaXJlY3Rpb24gb2YgcGFydGljbGVzXHJcbiAgICAgIGRpcmVjdGlvbjoge1xyXG4gICAgICAgIHJhZDogMCwgLy8gaW4gcmFkaWFucyAoMCAtIDIpXHJcbiAgICAgICAgbWluOiAwLCAvLyBsb3cgYm91bmRzIChyYWRpYW5zKVxyXG4gICAgICAgIG1heDogMiAvLyBoaWdoIGJvdW5kcyAocmFkaWFucylcclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vIGFyZSBwYXJ0aWNsZXMgb2Zmc2V0IGZyb20gaW5pdGFsIHgveVxyXG4gICAgICByYWRpYWxEaXNwbGFjZW1lbnQ6IDIwLFxyXG4gICAgICAvLyBpcyB0aGUgb2Zmc2V0IGZlYXRoZXJlZD9cclxuICAgICAgcmFkaWFsRGlzcGxhY2VtZW50T2Zmc2V0OiAwLFxyXG5cclxuICAgICAgLy9pbml0aWFsIHZlbG9jaXR5IG9mIHBhcnRpY2xlc1xyXG4gICAgICBpbXB1bHNlOiB7XHJcbiAgICAgICAgcG93OiAwLFxyXG4gICAgICAgIG1pbjogMC4wNSxcclxuICAgICAgICBtYXg6IDAuMTVcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9O1xyXG5cclxuICBtb2R1bGUuZXhwb3J0cy53YXJwU3RyZWFtVGhlbWUgPSB3YXJwU3RyZWFtVGhlbWU7IiwicmVxdWlyZSggJy4vcGFydGljbGVzLmpzJyApOyIsInZhciBlbnZpcm9ubWVudCA9IHtcclxuXHJcblx0XHRydW50aW1lRW5naW5lOiB7XHJcblxyXG5cdFx0XHRzdGFydEFuaW1hdGlvbjogZnVuY3Rpb24gc3RhcnRBbmltYXRpb24oYW5pbVZhciwgbG9vcEZuKSB7XHJcblx0XHRcdFx0XHRpZiAoIWFuaW1WYXIpIHtcclxuXHRcdFx0XHRcdFx0XHRhbmltVmFyID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wRm4pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0c3RvcEFuaW1hdGlvbjogZnVuY3Rpb24gc3RvcEFuaW1hdGlvbihhbmltVmFyKSB7XHJcblx0XHRcdFx0XHRpZiAoYW5pbVZhcikge1xyXG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShhbmltVmFyKTtcclxuXHRcdFx0XHRcdFx0XHRhbmltVmFyID0gdW5kZWZpbmVkO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHRjYW52YXM6IHtcclxuXHRcdFx0Ly8gYnVmZmVyIGNsZWFyIGZOXHJcblx0XHRcdGNoZWNrQ2xlYXJCdWZmZXJSZWdpb246IGZ1bmN0aW9uIGNoZWNrQ2xlYXJCdWZmZXJSZWdpb24ocGFydGljbGUsIGNhbnZhc0NvbmZpZykge1xyXG5cclxuXHRcdFx0XHRcdHZhciBidWZmZXJDbGVhclJlZ2lvbiA9IGNhbnZhc0NvbmZpZy5idWZmZXJDbGVhclJlZ2lvbjtcclxuXHJcblx0XHRcdFx0XHR2YXIgZW50aXR5V2lkdGggPSBwYXJ0aWNsZS5yIC8gMjtcclxuXHRcdFx0XHRcdHZhciBlbnRpdHlIZWlnaHQgPSBwYXJ0aWNsZS5yIC8gMjtcclxuXHJcblx0XHRcdFx0XHRpZiAocGFydGljbGUueCAtIGVudGl0eVdpZHRoIDwgYnVmZmVyQ2xlYXJSZWdpb24ueCkge1xyXG5cdFx0XHRcdFx0XHRcdGJ1ZmZlckNsZWFyUmVnaW9uLnggPSBwYXJ0aWNsZS54IC0gZW50aXR5V2lkdGg7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnggKyBlbnRpdHlXaWR0aCA+IGJ1ZmZlckNsZWFyUmVnaW9uLnggKyBidWZmZXJDbGVhclJlZ2lvbi53KSB7XHJcblx0XHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24udyA9IHBhcnRpY2xlLnggKyBlbnRpdHlXaWR0aCAtIGJ1ZmZlckNsZWFyUmVnaW9uLng7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnkgLSBlbnRpdHlIZWlnaHQgPCBidWZmZXJDbGVhclJlZ2lvbi55KSB7XHJcblx0XHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24ueSA9IHBhcnRpY2xlLnkgLSBlbnRpdHlIZWlnaHQ7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnkgKyBlbnRpdHlIZWlnaHQgPiBidWZmZXJDbGVhclJlZ2lvbi55ICsgYnVmZmVyQ2xlYXJSZWdpb24uaCkge1xyXG5cdFx0XHRcdFx0XHRcdGJ1ZmZlckNsZWFyUmVnaW9uLmggPSBwYXJ0aWNsZS55ICsgZW50aXR5SGVpZ2h0IC0gYnVmZmVyQ2xlYXJSZWdpb24ueTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHJlc2V0QnVmZmVyQ2xlYXJSZWdpb246IGZ1bmN0aW9uIHJlc2V0QnVmZmVyQ2xlYXJSZWdpb24oY2FudmFzQ29uZmlnKSB7XHJcblxyXG5cdFx0XHRcdFx0dmFyIGJ1ZmZlckNsZWFyUmVnaW9uID0gY2FudmFzQ29uZmlnLmJ1ZmZlckNsZWFyUmVnaW9uO1xyXG5cclxuXHRcdFx0XHRcdGJ1ZmZlckNsZWFyUmVnaW9uLnggPSBjYW52YXNDb25maWcuY2VudGVySDtcclxuXHRcdFx0XHRcdGJ1ZmZlckNsZWFyUmVnaW9uLnkgPSBjYW52YXNDb25maWcuY2VudGVyVjtcclxuXHRcdFx0XHRcdGJ1ZmZlckNsZWFyUmVnaW9uLncgPSBjYW52YXNDb25maWcud2lkdGg7XHJcblx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi5oID0gY2FudmFzQ29uZmlnLmhlaWdodDtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRmb3JjZXM6IHtcclxuXHRcdFx0XHRmcmljdGlvbjogMC4wMSxcclxuXHRcdFx0XHRib3V5YW5jeTogMSxcclxuXHRcdFx0XHRncmF2aXR5OiAwLFxyXG5cdFx0XHRcdHdpbmQ6IDEsXHJcblx0XHRcdFx0dHVyYnVsZW5jZTogeyBtaW46IC01LCBtYXg6IDUgfVxyXG5cdFx0fVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmVudmlyb25tZW50ID0gZW52aXJvbm1lbnQ7IiwiLyoqXHJcbiogcHJvdmlkZXMgbWF0aHMgdXRpbCBtZXRob2RzLlxyXG4qXHJcbiogQG1peGluXHJcbiovXHJcblxyXG52YXIgbWF0aFV0aWxzID0ge1xyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2VuZXJhdGUgcmFuZG9tIGludGVnZXIgYmV0d2VlbiAyIHZhbHVlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIG1pbmltdW0gdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSBtYXhpbXVtIHZhbHVlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdHJhbmRvbUludGVnZXI6IGZ1bmN0aW9uIHJhbmRvbUludGVnZXIobWluLCBtYXgpIHtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4ICsgMSAtIG1pbikpICsgbWluO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2VuZXJhdGUgcmFuZG9tIGZsb2F0IGJldHdlZW4gMiB2YWx1ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4gLSBtaW5pbXVtIHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4IC0gbWF4aW11bSB2YWx1ZS5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRyYW5kb206IGZ1bmN0aW9uIHJhbmRvbShtaW4sIG1heCkge1xyXG5cdFx0aWYgKG1pbiA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdG1pbiA9IDA7XHJcblx0XHRcdG1heCA9IDE7XHJcblx0XHR9IGVsc2UgaWYgKG1heCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdG1heCA9IG1pbjtcclxuXHRcdFx0bWluID0gMDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XHJcblx0fSxcclxuXHJcblx0Z2V0UmFuZG9tQXJiaXRyYXJ5OiBmdW5jdGlvbiBnZXRSYW5kb21BcmJpdHJhcnkobWluLCBtYXgpIHtcclxuXHRcdHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XHJcblx0fSxcclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIFRyYW5zZm9ybXMgdmFsdWUgcHJvcG9ydGlvbmF0ZWx5IGJldHdlZW4gaW5wdXQgcmFuZ2UgYW5kIG91dHB1dCByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gdGhlIHZhbHVlIGluIHRoZSBvcmlnaW4gcmFuZ2UgKCBtaW4xL21heDEgKS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbjEgLSBtaW5pbXVtIHZhbHVlIGluIG9yaWdpbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heDEgLSBtYXhpbXVtIHZhbHVlIGluIG9yaWdpbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbjIgLSBtaW5pbXVtIHZhbHVlIGluIGRlc3RpbmF0aW9uIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4MiAtIG1heGltdW0gdmFsdWUgaW4gZGVzdGluYXRpb24gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjbGFtcFJlc3VsdCAtIGNsYW1wIHJlc3VsdCBiZXR3ZWVuIGRlc3RpbmF0aW9uIHJhbmdlIGJvdW5kYXJ5cy5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRtYXA6IGZ1bmN0aW9uIG1hcCh2YWx1ZSwgbWluMSwgbWF4MSwgbWluMiwgbWF4MiwgY2xhbXBSZXN1bHQpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHZhciByZXR1cm52YWx1ZSA9ICh2YWx1ZSAtIG1pbjEpIC8gKG1heDEgLSBtaW4xKSAqIChtYXgyIC0gbWluMikgKyBtaW4yO1xyXG5cdFx0aWYgKGNsYW1wUmVzdWx0KSByZXR1cm4gc2VsZi5jbGFtcChyZXR1cm52YWx1ZSwgbWluMiwgbWF4Mik7ZWxzZSByZXR1cm4gcmV0dXJudmFsdWU7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBDbGFtcCB2YWx1ZSBiZXR3ZWVuIHJhbmdlIHZhbHVlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gdGhlIHZhbHVlIGluIHRoZSByYW5nZSB7IG1pbnxtYXggfS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIG1pbmltdW0gdmFsdWUgaW4gdGhlIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4IC0gbWF4aW11bSB2YWx1ZSBpbiB0aGUgcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjbGFtcFJlc3VsdCAtIGNsYW1wIHJlc3VsdCBiZXR3ZWVuIHJhbmdlIGJvdW5kYXJ5cy5cclxuICovXHJcblx0Y2xhbXA6IGZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW4sIG1heCkge1xyXG5cdFx0aWYgKG1heCA8IG1pbikge1xyXG5cdFx0XHR2YXIgdGVtcCA9IG1pbjtcclxuXHRcdFx0bWluID0gbWF4O1xyXG5cdFx0XHRtYXggPSB0ZW1wO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4odmFsdWUsIG1heCkpO1xyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLm1hdGhVdGlscyA9IG1hdGhVdGlsczsiLCJ2YXIgcmVuZGVyUGFydGljbGVBcnIgPSByZXF1aXJlKCcuL3BhcnRpY2xlRnVuY3Rpb25zL3JlbmRlclBhcnRpY2xlQXJyLmpzJykucmVuZGVyUGFydGljbGVBcnI7XHJcbnZhciB1cGRhdGVQYXJ0aWNsZUFyciA9IHJlcXVpcmUoJy4vcGFydGljbGVGdW5jdGlvbnMvdXBkYXRlUGFydGljbGVBcnIuanMnKS51cGRhdGVQYXJ0aWNsZUFycjtcclxuXHJcbnZhciBwYXJ0aWNsZUFyckZuID0ge1xyXG5cclxuXHRyZW5kZXJQYXJ0aWNsZUFycjogcmVuZGVyUGFydGljbGVBcnIsXHJcblx0dXBkYXRlUGFydGljbGVBcnI6IHVwZGF0ZVBhcnRpY2xlQXJyXHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMucGFydGljbGVBcnJGbiA9IHBhcnRpY2xlQXJyRm47IiwidmFyIGNoZWNrUGFydGljbGVLaWxsQ29uZGl0aW9ucyA9IHJlcXVpcmUoJy4vcGFydGljbGVGdW5jdGlvbnMvY2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zLmpzJykuY2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zO1xyXG52YXIgY3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUZ1bmN0aW9ucy9jcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMuanMnKS5jcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXM7XHJcbnZhciB1cGRhdGVQYXJ0aWNsZSA9IHJlcXVpcmUoJy4vcGFydGljbGVGdW5jdGlvbnMvdXBkYXRlUGFydGljbGUuanMnKS51cGRhdGVQYXJ0aWNsZTtcclxudmFyIGtpbGxQYXJ0aWNsZSA9IHJlcXVpcmUoJy4vcGFydGljbGVGdW5jdGlvbnMva2lsbFBhcnRpY2xlLmpzJykua2lsbFBhcnRpY2xlO1xyXG5cclxudmFyIHBhcnRpY2xlRm4gPSB7XHJcblxyXG5cdGNoZWNrUGFydGljbGVLaWxsQ29uZGl0aW9uczogY2hlY2tQYXJ0aWNsZUtpbGxDb25kaXRpb25zLFxyXG5cdGNyZWF0ZVBlclBhcnRpY2xlQXR0cmlidXRlczogY3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzLFxyXG5cdHVwZGF0ZVBhcnRpY2xlOiB1cGRhdGVQYXJ0aWNsZSxcclxuXHRraWxsUGFydGljbGU6IGtpbGxQYXJ0aWNsZVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnBhcnRpY2xlRm4gPSBwYXJ0aWNsZUZuOyIsInZhciBjaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnMgPSBmdW5jdGlvbiBjaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnMocCwgY2FuVywgY2FuSCkge1xyXG4gICAgLy8gY2hlY2sgb24gcGFydGljbGUga2lsbCBjb25kaXRpb25zXHJcbiAgICAvLyBzZWVtcyBjb21wbGljYXRlZCAoIG5lc3RlZCBJRnMgKSBidXQgdHJpZXMgdG8gc3RvcCBjaGVja1xyXG4gICAgLy8gd2l0aG91dCBoYXZpbmcgdG8gbWFrZSBhbGwgdGhlIGNoZWNrcyBpZiBhIGNvbmRpdGlvbiBpcyBoaXRcclxuICAgIGxldCBrID0gcC5raWxsQ29uZGl0aW9ucztcclxuICAgIGxldCBrQ29sID0gay5jb2xvckNoZWNrO1xyXG4gICAgbGV0IGtBdHRyID0gay5wZXJBdHRyaWJ1dGU7XHJcbiAgICBsZXQga0JPID0gay5ib3VuZGFyeU9mZnNldDtcclxuXHJcbiAgICBpZiAoIGtDb2wubGVuZ3RoID4gMCApIHtcclxuICAgICAgICBmb3IgKCBsZXQgaSA9IGtDb2wubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0gKSB7XHJcbiAgICAgICAgICAgIGxldCBjb2wgPSBrQ29sWyBpIF07XHJcbiAgICAgICAgICAgIGlmICggcC5jb2xvcjREYXRhWyBjb2wubmFtZSBdIDw9IGNvbC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCBrQXR0ci5sZW5ndGggPiAwICkge1xyXG4gICAgICAgIGZvciAoIGxldCBpID0ga0F0dHIubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0gKSB7XHJcbiAgICAgICAgICAgIGxldCBhdHRyID0ga0F0dHJbIGkgXTtcclxuICAgICAgICAgICAgaWYgKCBwWyBhdHRyLm5hbWUgXSA8PSBhdHRyLnZhbHVlICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCBrLmJvdW5kYXJ5Q2hlY2sgPT09IHRydWUgKSB7XHJcbiAgICAgICAgLy8gc3RvcmUgcC5yIGFuZCBnaXZlIGJ1ZmZlciAoICogNCApIHRvIGFjY29tb2RhdGUgcG9zc2libGUgd2FycGluZ1xyXG4gICAgICAgIHZhciBwUmFkID0gcC5yICogNDtcclxuICAgICAgICBpZiAocC54IC0gcFJhZCA8IDAgLSBrQk8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHAueCArIHBSYWQgPiBjYW5XICsga0JPKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChwLnkgLSBwUmFkIDwgMCAtIGtCTykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocC55ICsgcFJhZCA+IGNhbkggKyBrQk8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmNoZWNrUGFydGljbGVLaWxsQ29uZGl0aW9ucyA9IGNoZWNrUGFydGljbGVLaWxsQ29uZGl0aW9uczsiLCJsZXQgdHJpZyA9IHJlcXVpcmUoJy4vLi4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzO1xyXG5sZXQgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi8uLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcbmxldCBnZXRWYWx1ZSA9IHJlcXVpcmUoJy4vLi4vdXRpbGl0aWVzLmpzJykuZ2V0VmFsdWU7XHJcblxyXG5sZXQgUEkgPSBNYXRoLlBJO1xyXG5sZXQgcmFuZCA9IG1hdGhVdGlscy5yYW5kb207XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVBbmltYXRpb25UcmFja3MoIGFyciwgcHBhICkge1xyXG4gICAgdmFyIGFuaW1BcnIgPSBbXTtcclxuICAgIHZhciBzcGxDaHJzID0gJy4nO1xyXG5cclxuICAgIGlmIChhcnIgJiYgYXJyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBsZXQgYXJyTGVuID0gYXJyLmxlbmd0aDtcclxuICAgICAgICBmb3IgKGxldCBpID0gYXJyTGVuIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB0ID0gYXJyW2ldO1xyXG4gICAgICAgICAgICB2YXIgcHJtID0gdC5wYXJhbS5zcGxpdChzcGxDaHJzKTtcclxuICAgICAgICAgICAgdmFyIHBybVRlbXAgPSB7IHBhdGg6IHBybSwgcGF0aExlbjogcHJtLmxlbmd0aCB9O1xyXG4gICAgICAgICAgICB2YXIgYmFzZVZhbCA9IGdldFZhbHVlKCB0LmJhc2VBbW91bnQsIHBwYSApO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0VmFsID0gdm9pZCAwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCB0LnRhcmdldFZhbHVlUGF0aCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGdldFZhbHVlKCB0LnRhcmdldFZhbHVlUGF0aCwgcHBhICkgPT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VmFsID0gYmFzZVZhbCAqIC0xO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRWYWwgPSBnZXRWYWx1ZSggdC50YXJnZXRWYWx1ZVBhdGgsIHBwYSApIC0gYmFzZVZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmICggdC50YXJnZXRBbW91bnQgKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRWYWwgPSB0LnRhcmdldEFtb3VudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGR1cmF0aW9uID0gNjAgKiB0LmR1cmF0aW9uO1xyXG4gICAgICAgICAgICAvLyBsZXQgbGlmZSA9IHBwYS5saWZlU3BhbjtcclxuICAgICAgICAgICAgLy8gdC5kdXJhdGlvbiA9PT0gJ2xpZmUnID8gZHVyYXRpb24gPSBsaWZlIDogdC5kdXJhdGlvbiA8IDEgPyBkdXJhdGlvbiA9IGxpZmUgKiB0LmR1cmF0aW9uIDogdC5kdXJhdGlvbiA+IDEgPyBkdXJhdGlvbiA9IGxpZmUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGxldCB0aGlzQW5pbSA9IHtcclxuICAgICAgICAgICAgICAgIGFuaW1OYW1lOiB0LmFuaW1OYW1lLFxyXG4gICAgICAgICAgICAgICAgYWN0aXZlOiB0LmFjdGl2ZSxcclxuICAgICAgICAgICAgICAgIHBhcmFtOiBwcm1UZW1wLFxyXG4gICAgICAgICAgICAgICAgYmFzZUFtb3VudDogdC5iYXNlQW1vdW50LFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0QW1vdW50OiB0LnRhcmdldFZhbHVlUGF0aCwgXHJcbiAgICAgICAgICAgICAgICBjdXJyVGljazogMCxcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgICAgICAgICAgICAgIGVhc2luZzogdC5lYXNpbmcsXHJcbiAgICAgICAgICAgICAgICBsaW5rZWRBbmltOiB0LmxpbmtlZEFuaW0sXHJcbiAgICAgICAgICAgICAgICBsaW5rZWRFdmVudDogdC5saW5rZWRFdmVudFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCAndGhpc0FuaW06ICcsIHRoaXNBbmltICk7XHJcbiAgICAgICAgICAgIGFuaW1BcnIucHVzaCggdGhpc0FuaW0gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhbmltQXJyO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuXHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gbGlua0NyZWF0aW9uQXR0cmlidXRlcyggaXRlbSApIHtcclxuXHJcbn1cclxuXHJcblxyXG52YXIgY3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzID0gZnVuY3Rpb24gY3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzKHgsIHksIGVtaXNzaW9uT3B0cywgcGVyUGFydGljbGVPcHRzKSB7XHJcbiAgICAvLyBsZXQgdGhlbWVkID0gcGVyUGFydGljbGVPcHRzLnRoZW1lIHx8IHRoZW1lcy5yZXNldDtcclxuXHJcbiAgICAvLyBkaXJlY3QgcGFydGljbGUgb3B0aW9ucyBmcm9tIHRoZW1lXHJcbiAgICB2YXIgdGhlbWVkID0gcGVyUGFydGljbGVPcHRzIHx8IHRoZW1lcy5yZXNldDtcclxuICAgIHZhciBlbWl0VGhlbWVkID0gZW1pc3Npb25PcHRzIHx8IGZhbHNlO1xyXG4gICAgdmFyIGxpZmVTcGFuID0gbWF0aFV0aWxzLnJhbmRvbUludGVnZXIodGhlbWVkLmxpZmUubWluLCB0aGVtZWQubGlmZS5tYXgpO1xyXG4gICAgLy8gdXNlIGJpdHdpc2UgdG8gY2hlY2sgZm9yIG9kZC9ldmVuIGxpZmUgdmFscy4gTWFrZSBldmVuIHRvIGhlbHAgd2l0aCBhbmltcyB0aGF0IGFyZSBmcmFjdGlvbiBvZiBsaWZlIChmcmFtZXMpXHJcbiAgICBsaWZlU3BhbiAmIDEgPyBsaWZlU3BhbisrIDogZmFsc2U7XHJcblxyXG4gICAgLy8gZW1taXRlciBiYXNlZCBhdHRyaWJ1dGVzXHJcbiAgICB2YXIgZW1pc3Npb24gPSBlbWl0VGhlbWVkLmVtaXNzaW9uIHx8IGVtaXRUaGVtZWQ7XHJcbiAgICBcclxuICAgIGxldCBkaXIgPSBlbWlzc2lvbi5kaXJlY3Rpb247XHJcbiAgICB2YXIgZGlyZWN0aW9uID0gZGlyLnJhZCA+IDAgPyBkaXIucmFkIDogbWF0aFV0aWxzLmdldFJhbmRvbUFyYml0cmFyeShkaXIubWluLCBkaXIubWF4KSAqIFBJO1xyXG4gICAgXHJcbiAgICBsZXQgaW1wID0gZW1pc3Npb24uaW1wdWxzZTtcclxuICAgIHZhciBpbXB1bHNlID0gaW1wLnBvdyA+IDAgPyBpbXAucG93IDogcmFuZCggaW1wLm1pbiwgaW1wLm1heCk7XHJcblxyXG4gICAgLy8gc2V0IG5ldyBwYXJ0aWNsZSBvcmlnaW4gZGVwZW5kZW50IG9uIHRoZSByYWRpYWwgZGlzcGxhY2VtZW50XHJcbiAgICBpZiAoIGVtaXNzaW9uLnJhZGlhbERpc3BsYWNlbWVudCA+IDAgKSB7XHJcbiAgICAgICAgdmFyIG5ld0Nvb3JkcyA9IHRyaWcucmFkaWFsRGlzdHJpYnV0aW9uKHgsIHksIGVtaXNzaW9uLnJhZGlhbERpc3BsYWNlbWVudCArIHJhbmQoIGVtaXNzaW9uLnJhZGlhbERpc3BsYWNlbWVudE9mZnNldCAqIC0xLCBlbWlzc2lvbi5yYWRpYWxEaXNwbGFjZW1lbnRPZmZzZXQpLCBkaXJlY3Rpb24pO1xyXG5cclxuICAgICAgICB4ID0gbmV3Q29vcmRzLng7XHJcbiAgICAgICAgeSA9IG5ld0Nvb3Jkcy55O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB2ZWxvY2l0aWVzID0gdHJpZy5jYWxjdWxhdGVWZWxvY2l0aWVzKHgsIHksIGRpcmVjdGlvbiwgaW1wdWxzZSk7XHJcblxyXG4gICAgXHJcbiAgICAvLyB0aGVtZSBiYXNlZCBhdHRyaWJ1dGVzXHJcblxyXG4gICAgdmFyIGluaXRSID0gcmFuZCggdGhlbWVkLnJhZGl1cy5taW4sIHRoZW1lZC5yYWRpdXMubWF4ICk7XHJcbiAgICB2YXIgYWNjZWxlcmF0aW9uID0gcmFuZCggdGhlbWVkLnZlbEFjY2VsZXJhdGlvbi5taW4sIHRoZW1lZC52ZWxBY2NlbGVyYXRpb24ubWF4ICk7XHJcbiAgICB0aGlzLmFjY2VsZXJhdGlvbiA9IGFjY2VsZXJhdGlvbjtcclxuICAgIHZhciB0YXJnZXRSYWRpdXMgPSByYW5kKCB0aGVtZWQudGFyZ2V0UmFkaXVzLm1pbiwgdGhlbWVkLnRhcmdldFJhZGl1cy5tYXgpIDtcclxuXHJcbiAgICBsZXQgdGVtcFN0b3JlID0ge307XHJcbiAgICAvLyBjb25zb2xlLmxvZyggJ3RoZW1lZC5saW5rQ3JlYXRpb25BdHRyaWJ1dGVzOiAnLCB0aGVtZWQubGlua0NyZWF0aW9uQXR0cmlidXRlcyApO1xyXG4gICAgaWYgKCB0aGVtZWQubGlua0NyZWF0aW9uQXR0cmlidXRlcyAmJiB0aGVtZWQubGlua0NyZWF0aW9uQXR0cmlidXRlcy5sZW5ndGggPiAwICkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAndGhlbWVkLmxpbmtDcmVhdGlvbkF0dHJpYnV0ZXMgdHJ1ZTogJyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICd0aGVtZWQubGlua0NyZWF0aW9uQXR0cmlidXRlczogJywgdGhlbWVkLmxpbmtDcmVhdGlvbkF0dHJpYnV0ZXMgKTtcclxuICAgICAgICBsZXQgbGlua0NyZWF0aW9uQXR0cmlidXRlc0xlbiA9IHRoZW1lZC5saW5rQ3JlYXRpb25BdHRyaWJ1dGVzLmxlbmd0aDtcclxuICAgICAgICBmb3IgKCBsZXQgaSA9IGxpbmtDcmVhdGlvbkF0dHJpYnV0ZXNMZW4gLSAxOyBpID49IDA7IGktLSApIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB0aGlzTGluayA9IHRoZW1lZC5saW5rQ3JlYXRpb25BdHRyaWJ1dGVzWyBpIF07XHJcblxyXG4gICAgICAgICAgICBsZXQgc3JjQXR0ciA9IHRoaXNMaW5rLnNyYztcclxuICAgICAgICAgICAgbGV0IHRhcmdldEF0dHIgPSB0aGlzTGluay50YXJnZXQ7XHJcbiAgICAgICAgICAgIGxldCBhdHRyID0gdGhpc0xpbmsuYXR0cjtcclxuXHJcbiAgICAgICAgICAgIHRlbXBTdG9yZVsgYXR0ciBdID0ge1xyXG4gICAgICAgICAgICAgICAgdmFsdWU6IG1hdGhVdGlscy5tYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1sgdGhpc0xpbmsuc3JjVmFsdWUgXSxcclxuICAgICAgICAgICAgICAgICAgICB0aGVtZWRbIHNyY0F0dHIgXS5taW4sIHRoZW1lZFsgc3JjQXR0ciBdLm1heCxcclxuICAgICAgICAgICAgICAgICAgICB0aGVtZWRbIHRhcmdldEF0dHIgXS5taW4sIHRoZW1lZFsgdGFyZ2V0QXR0ciBdLm1heFxyXG4gICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ3RoZW1lZC5saW5rQ3JlYXRpb25BdHRyaWJ1dGVzIGZhbHNlOiAnKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdmFyIGluaXRDb2xvciA9IHRoZW1lZC5jb2xvclByb2ZpbGVzWzBdO1xyXG4gICAgdmFyIGNvbG9yNERhdGEgPSB7IHI6IGluaXRDb2xvci5yLCBnOiBpbml0Q29sb3IuZywgYjogaW5pdENvbG9yLmIsIGE6IGluaXRDb2xvci5hIH07XHJcblxyXG4gICAgdmFyIHdpbGxGbGFyZSA9IHZvaWQgMDtcclxuICAgIHZhciB3aWxsRmxhcmVUZW1wID0gbWF0aFV0aWxzLnJhbmRvbUludGVnZXIoMCwgMTAwMCk7XHJcblxyXG4gICAgdmFyIHRlbXBDdXN0b20gPSB7XHJcbiAgICAgICAgbGVuc0ZsYXJlOiB7XHJcbiAgICAgICAgICAgIG1pZ2h0RmxhcmU6IHRydWUsXHJcbiAgICAgICAgICAgIHdpbGxGbGFyZTogdGhlbWVkLmN1c3RvbUF0dHJpYnV0ZXMubGVuc0ZsYXJlLm1pZ2h0RmxhcmUgPT09IHRydWUgJiYgd2lsbEZsYXJlVGVtcCA8IDEwID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgICAgICBhbmdsZTogMC4zMFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbGV0IGN1c3RvbUF0dHJpYnV0ZXMgPSB0aGVtZWQuY3VzdG9tQXR0cmlidXRlcztcclxuICAgIH07XHJcblxyXG4gICAgLy8gbGV0IHRlbXBDaGVjayA9IHRlbXBTdG9yZS50YXJnZXRSYWRpdXMgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAvLyBpZiAoIHRlbXBDaGVjayApIHtcclxuICAgIC8vICAgICBjb25zb2xlLmxvZyggJ3RlbXAgdGFyZ2V0IHJhZGl1cyBleGlzdHMnICk7XHJcbiAgICAvLyB9IGVsc2Uge1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKCAndGVtcCB0YXJnZXQgcmFkaXVzIE5PVCBleGlzdHMnICk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgdmFyIHBwYSA9IHtcclxuICAgICAgICBhY3RpdmU6IHBlclBhcnRpY2xlT3B0cy5hY3RpdmUgfHwgdGhlbWVkLmFjdGl2ZSB8fCAwLFxyXG4gICAgICAgIGluaXRSOiB0ZW1wU3RvcmUuaW5pdFIgPyB0ZW1wU3RvcmUuaW5pdFIudmFsdWUgOiBpbml0UixcclxuICAgICAgICB0YXJnZXRSYWRpdXM6IHRlbXBTdG9yZS50YXJnZXRSYWRpdXMgPyB0ZW1wU3RvcmUudGFyZ2V0UmFkaXVzLnZhbHVlIDogdGFyZ2V0UmFkaXVzLFxyXG4gICAgICAgIGxpZmVTcGFuOiB0ZW1wU3RvcmUubGlmZVNwYW4gPyB0ZW1wU3RvcmUubGlmZVNwYW4udmFsdWUgOiBsaWZlU3BhbixcclxuICAgICAgICBhbmdsZTogZGlyZWN0aW9uLFxyXG4gICAgICAgIG1hZ25pdHVkZTogaW1wdWxzZSxcclxuICAgICAgICByZWxhdGl2ZU1hZ25pdHVkZTogaW1wdWxzZSxcclxuICAgICAgICBtYWduaXR1ZGVEZWNheTogdGhlbWVkLm1hZ0RlY2F5LFxyXG4gICAgICAgIHg6IHgsXHJcbiAgICAgICAgeTogeSxcclxuICAgICAgICB4T2xkOiB4LFxyXG4gICAgICAgIHlPbGQ6IHksXHJcbiAgICAgICAgdmVsOiAwLFxyXG4gICAgICAgIHhWZWw6IHZlbG9jaXRpZXMueFZlbCxcclxuICAgICAgICB5VmVsOiB2ZWxvY2l0aWVzLnlWZWwsXHJcbiAgICAgICAgdkFjYzogYWNjZWxlcmF0aW9uLFxyXG4gICAgICAgIGFwcGx5Rm9yY2VzOiB0aGVtZWQuYXBwbHlHbG9iYWxGb3JjZXMsXHJcbiAgICAgICAgZ2xvYmFsQWxwaGE6IHRoZW1lZC5nbG9iYWxBbHBoYSxcclxuICAgICAgICBnbG9iYWxBbHBoYUluaXRpYWw6IHRoZW1lZC5nbG9iYWxBbHBoYUluaXRpYWwsXHJcbiAgICAgICAgZ2xvYmFsQWxwaGFUYXJnZXQ6IHRoZW1lZC5nbG9iYWxBbHBoYVRhcmdldCxcclxuICAgICAgICBjb2xvcjREYXRhOiB7XHJcbiAgICAgICAgICAgIHI6IGNvbG9yNERhdGEuciwgZzogY29sb3I0RGF0YS5nLCBiOiBjb2xvcjREYXRhLmIsIGE6IGNvbG9yNERhdGEuYVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29sb3JQcm9maWxlczogdGhlbWVkLmNvbG9yUHJvZmlsZXMsXHJcblxyXG4gICAgICAgIC8vIGNvbG9yNENoYW5nZTogY29sb3I0Q2hhbmdlLFxyXG4gICAgICAgIGtpbGxDb25kaXRpb25zOiB0aGVtZWQua2lsbENvbmRpdGlvbnMsXHJcbiAgICAgICAgY3VzdG9tQXR0cmlidXRlczogdGVtcEN1c3RvbSxcclxuICAgICAgICAvLyByZW5kZXJGTjogdGhlbWVkLnJlbmRlclBhcnRpY2xlIHx8IHJlbmRlclBhcnRpY2xlLFxyXG4gICAgICAgIHJlbmRlckZOOiB0aGVtZWQucmVuZGVyUGFydGljbGUsXHJcbiAgICAgICAgZXZlbnRzOiB0aGVtZWQuZXZlbnRzXHJcbiAgICB9O1xyXG5cclxuICAgIHBwYS5hbmltYXRpb25UcmFja3MgPSBjcmVhdGVBbmltYXRpb25UcmFja3MoIHRoZW1lZC5hbmltYXRpb25UcmFja3MsIHBwYSApO1xyXG5cclxuICAgIHJldHVybiBwcGE7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXMgPSBjcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXM7IiwidmFyIGtpbGxQYXJ0aWNsZSA9IGZ1bmN0aW9uIGtpbGxQYXJ0aWNsZShsaXN0LCBpbmRleCwgZW50aXR5Q291bnRlcikge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi5pc0FsaXZlID0gMDtcclxuICAgIGxpc3QuaW5zZXJ0KGluZGV4KTtcclxuICAgIGVudGl0eUNvdW50ZXIuc3VidHJhY3QoMSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5raWxsUGFydGljbGUgPSBraWxsUGFydGljbGU7IiwidmFyIHJlbmRlclBhcnRpY2xlQXJyID0gZnVuY3Rpb24gcmVuZGVyUGFydGljbGVBcnIoIGNvbnRleHQsIGFyciwgYW5pbWF0aW9uKSB7XHJcbiAgICAvLyB2YXIgdGhpc0FyciA9IGFycjtcclxuICAgIHZhciBhcnJMZW4gPSBhcnIubGVuZ3RoO1xyXG5cclxuICAgIC8vIHZhciByZW5kZXJlZCA9IDA7XHJcbiAgICB2YXIgbm90UmVuZGVyZWQgPSAwO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSBhcnJMZW4gLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIHZhciBwID0gYXJyWyBpIF07XHJcblxyXG4gICAgICAgIC8vIHAuaXNBbGl2ZSAhPSAwID8gKCBwLnJlbmRlciggcC54LCBwLnksIHAuciwgcC5jb2xvcjREYXRhLCBjb250ZXh0KSwgcmVuZGVyZWQrKyApIDogbm90UmVuZGVyZWQrKztcclxuXHJcbiAgICAgICAgcC5pc0FsaXZlICE9IDAgP1xyXG4gICAgICAgICAgICBwLnJlbmRlciggcC54LCBwLnksIHAuciwgcC5jb2xvcjREYXRhLCBjb250ZXh0ICkgOlxyXG4gICAgICAgICAgICBub3RSZW5kZXJlZCsrO1xyXG5cclxuICAgIH1cclxuICAgIC8vIGNvbnNvbGUubG9nKCAncmVuZGVyZWQ6ICcrcmVuZGVyZWQrJyBub3RSZW5kZXJlZDogJytub3RSZW5kZXJlZCApO1xyXG4gICAgLy8gbm90UmVuZGVyZWQgPT09IGFyckxlbiA/XHJcbiAgICAvLyAoIGNvbnNvbGUubG9nKCAnbm90UmVuZGVyZWQgPT09IDA6IHN0b3AgYW5pbScgKSwgYW5pbWF0aW9uLnN0YXRlID0gZmFsc2UgKSA6IDA7XHJcbiAgICBub3RSZW5kZXJlZCA9PT0gYXJyTGVuID8gYW5pbWF0aW9uLnN0YXRlID0gZmFsc2UgOiAwO1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnJlbmRlclBhcnRpY2xlQXJyID0gcmVuZGVyUGFydGljbGVBcnI7IiwidmFyIGVhc2luZyA9IHJlcXVpcmUoJy4vLi4vZWFzaW5nLmpzJykuZWFzaW5nRXF1YXRpb25zO1xyXG52YXIgZW52aXJvbm1lbnQgPSByZXF1aXJlKCcuLy4uL2Vudmlyb25tZW50LmpzJykuZW52aXJvbm1lbnQ7XHJcbnZhciB0cmlnID0gcmVxdWlyZSgnLi8uLi90cmlnb25vbWljVXRpbHMuanMnKS50cmlnb25vbWljVXRpbHM7XHJcbnZhciBwaHlzaWNzID0gZW52aXJvbm1lbnQuZm9yY2VzO1xyXG5cclxudmFyIHVwZGF0ZVBhcnRpY2xlID0gZnVuY3Rpb24gdXBkYXRlUGFydGljbGUoIGVtaXR0ZXJBcnIgKSB7XHJcbiAgICB2YXIgcCA9IHRoaXM7XHJcbiAgICB2YXIgdG90YWxMaWZlVGlja3MgPSBwLmxpZmVTcGFuO1xyXG5cclxuICAgIC8vIHBvc2l0aW9uXHJcbiAgICAvLyBwLnggKz0gcC54VmVsICogcC5tYWduaXR1ZGVEZWNheTtcclxuICAgIC8vIHAueSArPSBwLnlWZWwgKiBwLm1hZ25pdHVkZURlY2F5O1xyXG4gICAgcC54ICs9IHAueFZlbDtcclxuICAgIHAueSArPSBwLnlWZWw7XHJcblxyXG4gICAgLy8gcC52ZWwgPSB0cmlnLmRpc3QoIHAueE9sZCwgcC55T2xkLCBwLngsIHAueSApO1xyXG5cclxuICAgIHAueE9sZCA9IHAueDtcclxuICAgIHAueU9sZCA9IHAueTtcclxuXHJcbiAgICBwLnhWZWwgKj0gcC52QWNjO1xyXG4gICAgcC55VmVsICo9IHAudkFjYztcclxuXHJcbiAgICAvLyBwLnlWZWwgKz0gcGh5c2ljcy5ncmF2aXR5O1xyXG4gICAgLy8gcC54VmVsICs9IHBoeXNpY3Mud2luZDtcclxuICAgIC8vIHAucmVsYXRpdmVNYWduaXR1ZGUgKj0gcC5tYWduaXR1ZGVEZWNheTtcclxuXHJcbiAgICAvLyBwLnJlbGF0aXZlTWFnbml0dWRlICo9IHAudkFjYyAqIDEuMDA1O1xyXG4gICAgcC5yZWxhdGl2ZU1hZ25pdHVkZSAqPSBwLnZBY2M7XHJcbiAgICBcclxuICAgIGlmIChwLmFwcGx5Rm9yY2VzKSB7XHJcbiAgICAgICAgcC55VmVsICs9IHBoeXNpY3MuZ3Jhdml0eTtcclxuICAgIH1cclxuICAgIC8vIHNwZWVkXHJcbiAgICAvLyBwLm1hZ25pdHVkZURlY2F5ID4gMCA/IHAubWFnbml0dWRlRGVjYXkgLT0gcGh5c2ljcy5mcmljdGlvbiA6IHAubWFnbml0dWRlRGVjYXkgPSAwO1xyXG5cclxuICAgIC8vIHAubWFnbml0dWRlRGVjYXkgKz0gKHAudkFjYyAqIDAuMDAwMjUpO1xyXG4gICAgLy8gcC5tYWduaXR1ZGVEZWNheSA9IGRlY2NlbGVyYXRlTWFnbml0dWRlKCBwICk7XHJcbiAgICAvLyBwLm1hZ25pdHVkZURlY2F5ID0gYWNjZWxlcmF0ZU1hZ25pdHVkZSggcCApO1xyXG5cclxuICAgIC8vIGxpZmVcclxuICAgIHAuY3VyckxpZmVJbnYgPSB0b3RhbExpZmVUaWNrcyAtIHAuY3VyckxpZmU7XHJcbiAgICB2YXIgY3VyckxpZmVUaWNrID0gcC5jdXJyTGlmZUludjtcclxuICAgIC8vIHNpemUgKHJhZGl1cyBmb3IgY2lyY2xlKVxyXG5cclxuXHJcbiAgICB2YXIgYW5pbVRyYWNrcyA9IHAuYW5pbWF0aW9uVHJhY2tzO1xyXG4gICAgdmFyIGFuaW1UcmFja3NMZW4gPSBhbmltVHJhY2tzLmxlbmd0aDtcclxuXHJcbiAgICBsZXQgdGhpc0FuaW0gPSBwLmFuaW1hdGlvblRyYWNrc1sgMCBdO1xyXG5cclxuICAgIGlmICggdGhpc0FuaW0uYWN0aXZlID09PSB0cnVlICkge1xyXG5cclxuICAgICAgICBpZiAoIHRoaXNBbmltLmN1cnJUaWNrID09IDAgKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCAnYW5pbSBzdGFydCcpO1xyXG4gICAgICAgICAgICBwWyB0aGlzQW5pbS5wYXJhbS5wYXRoWyAwIF0gXSA9IHRoaXNBbmltLmJhc2VBbW91bnQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICdhbmltIHByb2dyZXNzJyk7XHJcbiAgICAgICAgICAgIHBbIHRoaXNBbmltLnBhcmFtLnBhdGhbIDAgXSBdID0gZWFzaW5nWyB0aGlzQW5pbS5lYXNpbmcgXSggdGhpc0FuaW0uY3VyclRpY2ssIHRoaXNBbmltLmJhc2VBbW91bnQsIHRoaXNBbmltLnRhcmdldEFtb3VudCwgdGhpc0FuaW0uZHVyYXRpb24gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGlmICggcC5pZHggPT0gOTk4NyApIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICd0aGlzVmFsdWU6ICcsIHRoaXNWYWx1ZSApO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ3RoaXNBbmltLnBhcmFtLnBhdGhbIDAgXTogJywgdGhpc0FuaW0ucGFyYW0ucGF0aFsgMCBdICk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCAndGhpc0FuaW0uYmFzZUFtb3VudDogJywgdGhpc0FuaW0uYmFzZUFtb3VudCApO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ3RoaXNBbmltLnRhcmdldFZhbHVlUGF0aDogJywgdGhpc0FuaW0udGFyZ2V0QW1vdW50ICk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCAndGhpc0FuaW0uZHVyYXRpb246ICcsIHRoaXNBbmltLmR1cmF0aW9uICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ3RoaXNWYWx1ZTogJywgdGhpc1ZhbHVlICk7XHJcbiAgICAgICAgLy8gcFsgdGhpc0FuaW0ucGFyYW0ucGF0aFsgMCBdIF0gPSB0aGlzVmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXNBbmltLmN1cnJUaWNrKys7XHJcblxyXG4gICAgICAgIGlmICggdGhpc0FuaW0uY3VyclRpY2sgPj0gdGhpc0FuaW0uZHVyYXRpb24gKSB7XHJcbiAgICAgICAgICAgIHRoaXNBbmltLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIC8vIGlmICggYW5pbVRyYWNrcyAmJiBhbmltVHJhY2tzTGVuID4gMCApIHtcclxuICAgIC8vICAgICBmb3IgKCB2YXIgaSA9IGFuaW1UcmFja3NMZW4gLSAxOyBpID49IDA7IGktLSApIHtcclxuICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2coICdpJywgaSApO1xyXG4gICAgLy8gICAgICAgICB2YXIgdCA9IGFuaW1UcmFja3NbIGkgXTtcclxuXHJcbiAgICAvLyAgICAgICAgIGlmICggdC5hY3RpdmUgPT09IHRydWUgKSB7XHJcblxyXG4gICAgLy8gICAgICAgICAgICAgdmFyIHBhcmFtUGF0aCA9IHQucGFyYW0ucGF0aCxcclxuICAgIC8vICAgICAgICAgICAgICAgICBwYXJhbUxlbiA9IHQucGFyYW0ucGF0aExlbixcclxuICAgIC8vICAgICAgICAgICAgICAgICBjdXJyVGljayA9IHQuY3VyclRpY2s7XHJcblxyXG4gICAgLy8gICAgICAgICAgICAgcGFyYW1MZW4gPT09IDEgPyBcclxuICAgIC8vICAgICAgICAgICAgICAgICBwW3BhcmFtUGF0aFsgMCBdIF0gPSBlYXNpbmdbIHQuZWFzaW5nIF0oIGN1cnJUaWNrLCB0LmJhc2VBbW91bnQsIHQudGFyZ2V0QW1vdW50LCB0LmR1cmF0aW9uICkgOlxyXG5cclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgcGFyYW1MZW4gPT09IDIgP1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgcFsgcGFyYW1QYXRoWyAwIF0gXVsgcGFyYW1QYXRoWyAxIF0gXSA9IGVhc2luZ1sgdC5lYXNpbmcgXShjdXJyVGljaywgdC5iYXNlQW1vdW50LCB0LnRhcmdldEFtb3VudCwgdC5kdXJhdGlvbiApIDpcclxuXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1MZW4gPT09IDMgPyBwWyBwYXJhbVBhdGhbIDAgXSBdWyBwYXJhbVBhdGhbIDEgXSBdWyBwYXJhbVBhdGhbIDIgXSBdID0gZWFzaW5nWyB0LmVhc2luZyBdKCBjdXJyVGljaywgdC5iYXNlQW1vdW50LCB0LnRhcmdldEFtb3VudCwgdC5kdXJhdGlvbiApIDpcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZTtcclxuXHJcblxyXG4gICAgLy8gICAgICAgICAgICAgdC5jdXJyVGljaysrO1xyXG5cclxuICAgIC8vICAgICAgICAgICAgIGlmIChjdXJyVGljayA+PSB0LmR1cmF0aW9uKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdC5hY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYgKHQubGlua2VkRXZlbnQgIT09IGZhbHNlICYmIHR5cGVvZiB0LmxpbmtlZEV2ZW50ICE9PSAndW5kZWZpbmVkJykge1xyXG5cclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcnRpY2xlRXZlbnRzID0gcC5ldmVudHM7XHJcblxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gcGFydGljbGVFdmVudHMubGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pIHtcclxuXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGhpc1BhcnRpY2xlRXZlbnQgPSBwLmV2ZW50c1sgaiBdO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNQYXJ0aWNsZUV2ZW50LmV2ZW50VHlwZSA9IHQubGlua2VkRXZlbnQpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodC5saW5rZWRFdmVudCA9PT0gJ2VtaXQnKSB7XHJcblxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGhpc1BhcnRpY2xlRXZlbnRQYXJhbXMgPSB0aGlzUGFydGljbGVFdmVudC5ldmVudFBhcmFtcztcclxuXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIHRoaXNQYXJ0aWNsZUV2ZW50UGFyYW1zLmVtaXR0ZXIgIT09ICd1bmRlZmluZWQnICkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1BhcnRpY2xlRXZlbnRQYXJhbXMuZW1pdHRlci50cmlnZ2VyRW1pdHRlcih7IHg6IHAueCwgeTogcC55IH0pO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IGVtaXR0ZXJBcnIubGVuZ3RoIC0gMTsgayA+PSAwOyBrLS0pIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1pdHRlckFyclsgayBdLm5hbWUgPT09IHRoaXNQYXJ0aWNsZUV2ZW50UGFyYW1zLmVtaXR0ZXJOYW1lKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNQYXJ0aWNsZUV2ZW50UGFyYW1zLmVtaXR0ZXIgPSBlbWl0dGVyQXJyWyBrIF07XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNQYXJ0aWNsZUV2ZW50UGFyYW1zLmVtaXR0ZXIudHJpZ2dlckVtaXR0ZXIoeyB4OiBwLngsIHk6IHAueSB9KTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgLy8gICAgICAgICAgICAgICAgIC8vIGlmICggcC5pZHggPT0gOTk4NyApIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS53YXJuKCAncC52ZWw6ICcsIHAudmVsICk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgIC8vICAgICAgICAgICAgICAgICBpZiAoIHQubGlua2VkQW5pbSAhPT0gZmFsc2UgKSB7XHJcblxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBmb3IgKCBsZXQgbCA9IGFuaW1UcmFja3NMZW4gLSAxOyBsID49IDA7IGwtLSApIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggYW5pbVRyYWNrc1sgbCBdLmFuaW1OYW1lID09PSB0LmxpbmtlZEFuaW0gKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVRyYWNrc1sgbCBdLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gaWYgKCBwLmlkeCA9PSA5OTg3ICkge1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKCAncC52ZWwnLCAgcC52ZWwgKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBsaWZlIHRha2V0aCBhd2F5XHJcbiAgICBwLmN1cnJMaWZlLS07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy51cGRhdGVQYXJ0aWNsZSA9IHVwZGF0ZVBhcnRpY2xlOyIsImxldCBwYXJ0aWNsZUZuID0gcmVxdWlyZSgnLi8uLi9wYXJ0aWNsZUZuLmpzJykucGFydGljbGVGbjtcclxuXHJcbmxldCB1cGRhdGVQYXJ0aWNsZUFyciA9IGZ1bmN0aW9uIHVwZGF0ZVBhcnRpY2xlQXJyKCBzdG9yZUFyciwgcG9vbEFyciwgYW5pbWF0aW9uLCBjYW52YXNDb25maWcsIGVudGl0eUNvdW50ZXIsIGVtaXR0ZXJTdG9yZSkge1xyXG4gICAgLy8gbG9vcCBob3VzZWtlZXBpbmdcclxuXHJcbiAgICBsZXQgYXJyTGVuID0gc3RvcmVBcnIubGVuZ3RoIC0gMTtcclxuICAgIGZvciAoIGxldCBpID0gYXJyTGVuOyBpID49IDA7IGktLSApIHtcclxuICAgICAgICBsZXQgcCA9IHN0b3JlQXJyW2ldO1xyXG4gICAgICAgIHAuaXNBbGl2ZSAhPSAwID8gcGFydGljbGVGbi5jaGVja1BhcnRpY2xlS2lsbENvbmRpdGlvbnMocCwgY2FudmFzQ29uZmlnLndpZHRoLCBjYW52YXNDb25maWcuaGVpZ2h0KSA/IHAua2lsbChwb29sQXJyLCBwLmlkeCwgZW50aXR5Q291bnRlcikgOiBwLnVwZGF0ZShlbWl0dGVyU3RvcmUpIDogZmFsc2U7XHJcbiAgICB9IC8vIGVuZCBGb3IgbG9vcFxyXG4gICAgLy8gbGl2ZUVudGl0eUNvdW50ID09PSAwID8gKCBjb25zb2xlLmxvZyggJ2xpdmVFbnRpdHlDb3VudCA9PT0gMCBzdG9wIGFuaW0nICksIGFuaW1hdGlvbi5zdGF0ZSA9IGZhbHNlICkgOiAwO1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnVwZGF0ZVBhcnRpY2xlQXJyID0gdXBkYXRlUGFydGljbGVBcnI7IiwibGV0IGZpcmVUaGVtZSA9IHJlcXVpcmUoJy4vdGhlbWVzL2ZpcmUvdGhlbWUuanMnKS5maXJlVGhlbWU7XHJcbmxldCByZXNldFRoZW1lID0gcmVxdWlyZSgnLi90aGVtZXMvcmVzZXQvcmVzZXRUaGVtZS5qcycpLnJlc2V0VGhlbWU7XHJcbmxldCB3YXJwU3RhclRoZW1lID0gcmVxdWlyZSgnLi90aGVtZXMvd2FycFN0YXIvdGhlbWUuanMnKS53YXJwU3RhclRoZW1lO1xyXG5sZXQgZmxhbWVUaGVtZSA9IHJlcXVpcmUoJy4vdGhlbWVzL2ZsYW1lL2ZsYW1lVGhlbWUuanMnKS5mbGFtZVRoZW1lO1xyXG5sZXQgc21va2VUaGVtZSA9IHJlcXVpcmUoJy4vdGhlbWVzL3Ntb2tlL3Ntb2tlVGhlbWUuanMnKS5zbW9rZVRoZW1lO1xyXG5cclxubGV0IHRoZW1lcyA9IHtcclxuICAgcmVzZXQ6IHJlc2V0VGhlbWUsXHJcbiAgIGZpcmU6IGZpcmVUaGVtZSxcclxuICAgd2FycFN0YXI6IHdhcnBTdGFyVGhlbWUsXHJcbiAgIGZsYW1lOiBmbGFtZVRoZW1lLFxyXG4gICBzbW9rZTogc21va2VUaGVtZVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMudGhlbWVzID0gdGhlbWVzOyIsInZhciBhbmltYXRpb25UcmFja3MgPSBbXHJcblx0e1xyXG5cdFx0ICBhbmltTmFtZTogJ3JhZGl1c0ZhZGUnLFxyXG5cdFx0ICBhY3RpdmU6IHRydWUsXHJcblx0XHQgIHBhcmFtOiAncicsXHJcblx0XHQgIGJhc2VBbW91bnQ6ICdpbml0UicsXHJcblx0XHQgIHRhcmdldFZhbHVlUGF0aDogJ3RSJyxcclxuXHRcdCAgLy8gdGFyZ2V0QW1vdW50OiAwLjAwMDAyLFxyXG5cdFx0ICBkdXJhdGlvbjogJ2xpZmUnLFxyXG5cdFx0ICBlYXNpbmc6ICdlYXNlSW5FeHBvJyxcclxuXHRcdCAgbGlua2VkQW5pbTogZmFsc2VcclxuXHR9LFxyXG5cdHtcclxuXHRcdCAgYW5pbU5hbWU6ICdjb2xvcjREYXRhQ2hhbmdlUmVkJyxcclxuXHRcdCAgYWN0aXZlOiB0cnVlLFxyXG5cdFx0ICBwYXJhbTogJ2NvbG9yNERhdGEucicsXHJcblx0XHQgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLnInLFxyXG5cdFx0ICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLnInLFxyXG5cdFx0ICBkdXJhdGlvbjogJ2xpZmUnLFxyXG5cdFx0ICBlYXNpbmc6ICdlYXNlSW5PdXRCb3VuY2UnLFxyXG5cdFx0ICBsaW5rZWRBbmltOiBmYWxzZVxyXG5cdH0sXHJcblx0e1xyXG5cdFx0ICBhbmltTmFtZTogJ2NvbG9yNERhdGFDaGFuZ2VHcmVlbicsXHJcblx0XHQgIGFjdGl2ZTogdHJ1ZSxcclxuXHRcdCAgcGFyYW06ICdjb2xvcjREYXRhLmcnLFxyXG5cdFx0ICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5nJyxcclxuXHRcdCAgdGFyZ2V0VmFsdWVQYXRoOiAnY29sb3JQcm9maWxlc1sxXS5nJyxcclxuXHRcdCAgZHVyYXRpb246ICdsaWZlJyxcclxuXHRcdCAgZWFzaW5nOiAnZWFzZUluT3V0Qm91bmNlJyxcclxuXHRcdCAgbGlua2VkQW5pbTogZmFsc2VcclxuXHR9LFxyXG5cdHtcclxuXHRcdCAgYW5pbU5hbWU6ICdjb2xvcjREYXRhQ2hhbmdlQmx1ZScsXHJcblx0XHQgIGFjdGl2ZTogdHJ1ZSxcclxuXHRcdCAgcGFyYW06ICdjb2xvcjREYXRhLmInLFxyXG5cdFx0ICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5iJyxcclxuXHRcdCAgdGFyZ2V0VmFsdWVQYXRoOiAnY29sb3JQcm9maWxlc1sxXS5iJyxcclxuXHRcdCAgZHVyYXRpb246ICdsaWZlJyxcclxuXHRcdCAgZWFzaW5nOiAnZWFzZU91dEV4cG8nLFxyXG5cdFx0ICBsaW5rZWRBbmltOiBmYWxzZVxyXG5cdH0sXHJcblx0e1xyXG5cdFx0ICBhbmltTmFtZTogJ2NvbG9yNERhdGFDaGFuZ2VBbHBoYScsXHJcblx0XHQgIGFjdGl2ZTogdHJ1ZSxcclxuXHRcdCAgcGFyYW06ICdjb2xvcjREYXRhLmEnLFxyXG5cdFx0ICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5hJyxcclxuXHRcdCAgdGFyZ2V0VmFsdWVQYXRoOiAnY29sb3JQcm9maWxlc1szXS5hJyxcclxuXHRcdCAgZHVyYXRpb246ICdsaWZlJyxcclxuXHRcdCAgZWFzaW5nOiAnZWFzZUluUXVpbnQnLFxyXG5cdFx0ICBsaW5rZWRBbmltOiBmYWxzZVxyXG5cdH1cclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmFuaW1hdGlvblRyYWNrcyA9IGFuaW1hdGlvblRyYWNrczsiLCJ2YXIgY3VzdG9tQXR0cmlidXRlcyA9IHtcclxuICAgIGxlbnNGbGFyZToge1xyXG4gICAgICAgIG1pZ2h0RmxhcmU6IHRydWUsXHJcbiAgICAgICAgd2lsbEZsYXJlOiBmYWxzZSxcclxuICAgICAgICBhbmdsZTogMC4zMFxyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuY3VzdG9tQXR0cmlidXRlcyA9IGN1c3RvbUF0dHJpYnV0ZXM7IiwidmFyIGtpbGxDb25kaXRpb25zID0ge1xyXG4gICAgYm91bmRhcnlDaGVjazogdHJ1ZSxcclxuICAgIGJvdW5kYXJ5T2Zmc2V0OiAwLFxyXG4gICAgY29sb3JDaGVjazogW3sgbmFtZTogJ2EnLCB2YWx1ZTogMCB9XSxcclxuICAgIHBlckF0dHJpYnV0ZTogW3sgbmFtZTogJ3JhZGl1cycsIHZhbHVlOiAwIH0sIHsgbmFtZTogJ2N1cnJMaWZlJywgdmFsdWU6IDAgfV1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmtpbGxDb25kaXRpb25zID0ga2lsbENvbmRpdGlvbnM7IiwiLy8gdXRpbGl0aWVzXHJcbnZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuLy4uLy4uLy4uL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxudmFyIHRyaWcgPSByZXF1aXJlKCcuLy4uLy4uLy4uL3RyaWdvbm9taWNVdGlscy5qcycpLnRyaWdvbm9taWNVdGlscztcclxuXHJcbnZhciByZW5kZXJGbiA9IGZ1bmN0aW9uIHJlbmRlckZuKHgsIHksIHIsIGNvbG9yRGF0YSwgY29udGV4dCkge1xyXG4gICAgdmFyIHAgPSB0aGlzO1xyXG4gICAgLy8gY29uc29sZS5sb2coICdwLnJlbmRlcjogJywgcCApO1xyXG4gICAgdmFyIG5ld0FuZ2xlID0gdHJpZy5nZXRBbmdsZUFuZERpc3RhbmNlKHgsIHksIHggKyBwLnhWZWwsIHkgKyBwLnlWZWwpO1xyXG4gICAgdmFyIGNvbXBpbGVkQ29sb3IgPSBcInJnYmEoXCIgKyBjb2xvckRhdGEuciArICcsJyArIGNvbG9yRGF0YS5nICsgJywnICsgY29sb3JEYXRhLmIgKyBcIixcIiArIGNvbG9yRGF0YS5hICsgXCIpXCI7XHJcbiAgICB2YXIgZW5kQ29sb3IgPSBcInJnYmEoXCIgKyBjb2xvckRhdGEuciArICcsJyArIGNvbG9yRGF0YS5nICsgJywnICsgY29sb3JEYXRhLmIgKyBcIiwgMClcIjtcclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29tcGlsZWRDb2xvcjtcclxuICAgIHZhciBzdHJldGNoVmFsID0gbWF0aFV0aWxzLm1hcChwLnJlbGF0aXZlTWFnbml0dWRlLCAwLCAxMDAsIDEsIDEwKTtcclxuXHJcbiAgICBjb250ZXh0LnNhdmUoKTtcclxuICAgIGNvbnRleHQudHJhbnNsYXRlKHgsIHkpO1xyXG4gICAgLy8gY29udGV4dC5yb3RhdGUoIHAuYW5nbGUgKTtcclxuICAgIGNvbnRleHQucm90YXRlKG5ld0FuZ2xlLmFuZ2xlKTtcclxuICAgIGNvbnRleHQuZmlsbEVsbGlwc2UoMCwgMCwgciAqIHN0cmV0Y2hWYWwsIHIsIGNvbnRleHQpO1xyXG4gICAgY29udGV4dC5yZXN0b3JlKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5yZW5kZXJGbiA9IHJlbmRlckZuOyIsIi8vIHV0aWxpdGllc1xyXG52YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcblxyXG4vLyB0aGVtZSBwYXJ0aWFsc1xyXG52YXIgYW5pbWF0aW9uVHJhY2tzID0gcmVxdWlyZSgnLi9hbmltYXRpb25UcmFja3MuanMnKS5hbmltYXRpb25UcmFja3M7XHJcbnZhciBraWxsQ29uZGl0aW9ucyA9IHJlcXVpcmUoJy4va2lsbENvbmRpdGlvbnMuanMnKS5raWxsQ29uZGl0aW9ucztcclxudmFyIGN1c3RvbUF0dHJpYnV0ZXMgPSByZXF1aXJlKCcuL2N1c3RvbUF0dHJpYnV0ZXMuanMnKS5jdXN0b21BdHRyaWJ1dGVzO1xyXG52YXIgcmVuZGVyRm4gPSByZXF1aXJlKCcuL3JlbmRlckZuLmpzJykucmVuZGVyRm47XHJcblxyXG52YXIgZmlyZVRoZW1lID0ge1xyXG4gICAgY29udGV4dEJsZW5kaW5nTW9kZTogJ2xpZ2h0ZXInLFxyXG4gICAgYWN0aXZlOiAxLFxyXG4gICAgbGlmZTogeyBtaW46IDIwLCBtYXg6IDEwMCB9LFxyXG4gICAgYW5nbGU6IHsgbWluOiAwLCBtYXg6IDIgfSxcclxuICAgIG1hZ0RlY2F5OiAxLFxyXG4gICAgLy8gdmVsQWNjZWxlcmF0aW9uOiAwLjksXHJcbiAgICB2ZWxBY2NlbGVyYXRpb246IHsgbWluOiAwLjcsIG1heDogMC44NSB9LFxyXG4gICAgcmFkaXVzOiB7IG1pbjogMC41LCBtYXg6IDIwIH0sXHJcbiAgICB0YXJnZXRSYWRpdXM6IHsgbWluOiAwLCBtYXg6IDAgfSxcclxuICAgIGFwcGx5R2xvYmFsRm9yY2VzOiB0cnVlLFxyXG4gICAgY29sb3JQcm9maWxlczogW3sgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMSB9LCB7IHI6IDIxNSwgZzogMCwgYjogMCwgYTogMCB9LCB7IHI6IDAsIGc6IDIxNSwgYjogMCwgYTogMCB9LCB7IHI6IDAsIGc6IDAsIGI6IDIxNSwgYTogMCB9XSxcclxuICAgIHJlbmRlclByb2ZpbGVzOiBbeyBzaGFwZTogJ0NpcmNsZScsIGNvbG9yUHJvZmlsZUlkeDogMCB9XSxcclxuICAgIGN1c3RvbUF0dHJpYnV0ZXM6IGN1c3RvbUF0dHJpYnV0ZXMsXHJcbiAgICBhbmltYXRpb25UcmFja3M6IGFuaW1hdGlvblRyYWNrcyxcclxuICAgIGtpbGxDb25kaXRpb25zOiBraWxsQ29uZGl0aW9ucyxcclxuICAgIHJlbmRlclBhcnRpY2xlOiByZW5kZXJGblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZmlyZVRoZW1lID0gZmlyZVRoZW1lOyIsInZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuLy4uLy4uLy4uL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxudmFyIGNvbG9yaW5nID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9jb2xvclV0aWxzLmpzJykuY29sb3JVdGlscztcclxudmFyIHRyaWcgPSByZXF1aXJlKCcuLy4uLy4uLy4uL3RyaWdvbm9taWNVdGlscy5qcycpLnRyaWdvbm9taWNVdGlscztcclxuXHJcbnZhciByZ2JhID0gY29sb3JpbmcucmdiYTtcclxuXHJcbnZhciBmbGFtZVRoZW1lID0ge1xyXG4gICAgY29udGV4dEJsZW5kaW5nTW9kZTogJ2xpZ2h0ZXInLFxyXG4gICAgYWN0aXZlOiAxLFxyXG4gICAgbGlmZTogeyBtaW46IDMwLCBtYXg6IDYwIH0sXHJcbiAgICBhbmdsZTogeyBtaW46IDEuNDUsIG1heDogMS41NSB9LFxyXG4gICAgLy8gbWFnOiB7IG1pbjogOCwgbWF4OiAxMyB9LFxyXG4gICAgLy8gdmVsQWNjZWxlcmF0aW9uOiAxLjA1LFxyXG4gICAgdmVsQWNjZWxlcmF0aW9uOiB7IG1pbjogMSwgbWF4OiAxIH0sXHJcbiAgICBtYWdEZWNheTogMS41LFxyXG4gICAgcmFkaXVzOiB7IG1pbjogMTAwLCBtYXg6IDE4MCB9LFxyXG4gICAgdGFyZ2V0UmFkaXVzOiB7IG1pbjogMSwgbWF4OiAyIH0sXHJcbiAgICBhcHBseUdsb2JhbEZvcmNlczogZmFsc2UsXHJcbiAgICBjb2xvclByb2ZpbGVzOiBbeyByOiAyNTUsIGc6IDI1NSwgYjogMjU1LCBhOiAwLjUgfSwgeyByOiAyNTUsIGc6IDAsIGI6IDAsIGE6IDEgfV0sXHJcbiAgICByZW5kZXJQcm9maWxlczogW3sgc2hhcGVGbjogJ2ZpbGxDaXJjbGUnLCBjb2xvclByb2ZpbGVJZHg6IDAgfV0sXHJcbiAgICBjdXN0b21BdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgbGVuc0ZsYXJlOiB7XHJcbiAgICAgICAgICAgIG1pZ2h0RmxhcmU6IHRydWUsXHJcbiAgICAgICAgICAgIHdpbGxGbGFyZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGFuZ2xlOiAwLjMwXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHByb3hpbWl0eToge1xyXG4gICAgICAgIGNoZWNrOiBmYWxzZSxcclxuICAgICAgICB0aHJlc2hvbGQ6IDUwXHJcbiAgICB9LFxyXG4gICAgYW5pbWF0aW9uVHJhY2tzOiBbe1xyXG4gICAgICAgIGFuaW1OYW1lOiAncmFkaXVzRmFkZScsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAncicsXHJcbiAgICAgICAgYmFzZUFtb3VudDogJ2luaXRSJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICd0UicsXHJcbiAgICAgICAgZHVyYXRpb246ICdsaWZlJyxcclxuICAgICAgICBlYXNpbmc6ICdlYXNlSW5FeHBvJyxcclxuICAgICAgICBsaW5rZWRBbmltOiBmYWxzZVxyXG4gICAgfSwge1xyXG4gICAgICAgIGFuaW1OYW1lOiAnY29sb3I0RGF0YUNoYW5nZUdyZWVuJyxcclxuICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgcGFyYW06ICdjb2xvcjREYXRhLmcnLFxyXG4gICAgICAgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmcnLFxyXG4gICAgICAgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbMV0uZycsXHJcbiAgICAgICAgZHVyYXRpb246IDAuNCxcclxuICAgICAgICBlYXNpbmc6ICdlYXNlSW5RdWFydCcsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgIH0sIHtcclxuICAgICAgICBhbmltTmFtZTogJ2NvbG9yNERhdGFDaGFuZ2VCbHVlJyxcclxuICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgcGFyYW06ICdjb2xvcjREYXRhLmInLFxyXG4gICAgICAgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmInLFxyXG4gICAgICAgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbMV0uYicsXHJcbiAgICAgICAgZHVyYXRpb246IDAuNSxcclxuICAgICAgICBlYXNpbmc6ICdlYXNlT3V0UXVhcnQnLFxyXG4gICAgICAgIGxpbmtlZEFuaW06IGZhbHNlXHJcbiAgICB9LCB7XHJcbiAgICAgICAgYW5pbU5hbWU6ICdhbHBoYURlbGF5JyxcclxuICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgcGFyYW06ICdjb2xvcjREYXRhLmEnLFxyXG4gICAgICAgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmEnLFxyXG4gICAgICAgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbMF0uYScsXHJcbiAgICAgICAgZHVyYXRpb246IDAuNSxcclxuICAgICAgICBlYXNpbmc6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICBsaW5rZWRBbmltOiAnYWxwaGFGYWRlSW4nXHJcbiAgICB9LCB7XHJcbiAgICAgICAgYW5pbU5hbWU6ICdhbHBoYUZhZGVJbicsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5hJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5hJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmEnLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjIsXHJcbiAgICAgICAgZWFzaW5nOiAnZWFzZUluUXVpbnQnLFxyXG4gICAgICAgIGxpbmtlZEFuaW06ICdhbHBoYUZhZGVPdXQnXHJcbiAgICB9LCB7XHJcbiAgICAgICAgYW5pbU5hbWU6ICdhbHBoYUZhZGVPdXQnLFxyXG4gICAgICAgIGFjdGl2ZTogZmFsc2UsXHJcbiAgICAgICAgcGFyYW06ICdjb2xvcjREYXRhLmEnLFxyXG4gICAgICAgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzFdLmEnLFxyXG4gICAgICAgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbMF0uYScsXHJcbiAgICAgICAgZHVyYXRpb246IDAuMyxcclxuICAgICAgICBlYXNpbmc6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICBsaW5rZWRBbmltOiBmYWxzZSxcclxuICAgICAgICAvLyBsaW5rZWRFdmVudDogJ2VtaXQnLFxyXG4gICAgICAgIGxpbmtlZEV2ZW50OiBmYWxzZVxyXG5cclxuICAgIH1dLFxyXG5cclxuICAgIGV2ZW50czogW3tcclxuICAgICAgICBldmVudFR5cGU6ICdlbWl0JyxcclxuICAgICAgICBldmVudFBhcmFtczoge1xyXG4gICAgICAgICAgICBlbWl0dGVyTmFtZTogJ3Ntb2tlRW1pdHRlcidcclxuICAgICAgICB9XHJcbiAgICB9XSxcclxuXHJcbiAgICBraWxsQ29uZGl0aW9uczoge1xyXG4gICAgICAgIGJvdW5kYXJ5Q2hlY2s6IHRydWUsXHJcbiAgICAgICAgYm91bmRhcnlPZmZzZXQ6IDAsXHJcbiAgICAgICAgY29sb3JDaGVjazogW10sXHJcbiAgICAgICAgcGVyQXR0cmlidXRlOiBbeyBuYW1lOiAncmFkaXVzJywgdmFsdWU6IDAgfSwgeyBuYW1lOiAnY3VyckxpZmUnLCB2YWx1ZTogMCB9XSxcclxuICAgICAgICBsaW5rZWRFdmVudDogZmFsc2VcclxuICAgIH0sXHJcbiAgICByZW5kZXJQYXJ0aWNsZTogZnVuY3Rpb24gcmVuZGVyUGFydGljbGUoeCwgeSwgciwgY29sb3JEYXRhLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIHAgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzdHJldGNoVmFsID0gbWF0aFV0aWxzLm1hcChwLmN1cnJMaWZlSW52LCAwLCBwLmxpZmVTcGFuLCAxLCA1KTtcclxuICAgICAgICB2YXIgb2Zmc2V0TWFwID0gbWF0aFV0aWxzLm1hcChwLmN1cnJMaWZlSW52LCAwLCBwLmxpZmVTcGFuLCAwLCAxKTtcclxuICAgICAgICB2YXIgbmV3QW5nbGUgPSB0cmlnLmdldEFuZ2xlQW5kRGlzdGFuY2UoeCwgeSwgeCArIHAueFZlbCwgeSArIHAueVZlbCk7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uICE9PSAnbGlnaHRlcicpIHtcclxuICAgICAgICAgICAgY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnbGlnaHRlcic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgICAgIGNvbnRleHQudHJhbnNsYXRlKHgsIHkpO1xyXG4gICAgICAgIC8vIGNvbnRleHQuc2F2ZSgpO1xyXG4gICAgICAgIHZhciBhbHBoYSA9IGNvbG9yRGF0YS5hO1xyXG4gICAgICAgIGlmIChhbHBoYSA+IDEpIHtcclxuICAgICAgICAgICAgYWxwaGEgPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgb2Zmc2V0ID0gciAqIG9mZnNldE1hcDtcclxuICAgICAgICAvLyAvLyB2YXIgb2Zmc2V0ID0gMDtcclxuICAgICAgICB2YXIgZ3JkID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCgwLCAwICsgb2Zmc2V0LCAwLCAwLCAwICsgb2Zmc2V0LCByKTtcclxuICAgICAgICAvLyB2YXIgZ3JkID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCh4LCB5LCAwLCB4LCB5LCByKTtcclxuICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAsIHJnYmEoY29sb3JEYXRhLnIsIGNvbG9yRGF0YS5nLCBjb2xvckRhdGEuYiwgMC4wMyAqIGFscGhhKSk7XHJcbiAgICAgICAgZ3JkLmFkZENvbG9yU3RvcCgwLjUsIHJnYmEoY29sb3JEYXRhLnIsIGNvbG9yRGF0YS5nLCBjb2xvckRhdGEuYiwgMC4wNiAqIGFscGhhKSk7XHJcbiAgICAgICAgZ3JkLmFkZENvbG9yU3RvcCgwLjcsIHJnYmEoY29sb3JEYXRhLnIsIGNvbG9yRGF0YS5nLCBjb2xvckRhdGEuYiwgMC4wNjUgKiBhbHBoYSkpO1xyXG4gICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMC44NSwgcmdiYShjb2xvckRhdGEuciwgY29sb3JEYXRhLmcsIGNvbG9yRGF0YS5iLCAwLjAxNSAqIGFscGhhKSk7XHJcbiAgICAgICAgZ3JkLmFkZENvbG9yU3RvcCgxLCByZ2JhKGNvbG9yRGF0YS5yLCBjb2xvckRhdGEuZywgY29sb3JEYXRhLmIsIDApKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGdyZDtcclxuXHJcbiAgICAgICAgY29udGV4dC5yb3RhdGUobmV3QW5nbGUuYW5nbGUpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbEVsbGlwc2UoMCwgMCwgciAqIHN0cmV0Y2hWYWwsIHIsIGNvbnRleHQpO1xyXG4gICAgICAgIGNvbnRleHQucmVzdG9yZSgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZmxhbWVUaGVtZSA9IGZsYW1lVGhlbWU7IiwidmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG5cclxudmFyIHJlc2V0VGhlbWUgPSB7XHJcbiAgICBlbW1pc2lvblJhdGU6IHsgbWluOiAwLCBtYXg6IDAgfSxcclxuICAgIGNvbnRleHRCbGVuZGluZ01vZGU6ICdzb3VyY2Utb3ZlcicsXHJcbiAgICBhY3RpdmU6IDAsXHJcbiAgICBsaWZlOiB7IG1pbjogMCwgbWF4OiAwIH0sXHJcbiAgICBhbmdsZTogeyBtaW46IDAsIG1heDogMCB9LFxyXG4gICAgbWFnOiB7IG1pbjogMCwgbWF4OiAwIH0sXHJcbiAgICBtYWdEZWNheTogMCxcclxuICAgIC8vIHZlbEFjY2VsZXJhdGlvbjogMSwgLy8gMCAtIDEgKGkuZS4gMC41KSA9IGRlY2NlbGVyYXRpb24sIDErIChpLmUuIDEuMikgPSBhY2NlbGVyYXRpb25cclxuICAgIHZlbEFjY2VsZXJhdGlvbjogeyBtaW46IDEsIG1heDogMSB9LFxyXG4gICAgcmFkaXVzOiB7IG1pbjogMCwgbWF4OiAwIH0sXHJcbiAgICB0YXJnZXRSYWRpdXM6IHsgbWluOiAwLCBtYXg6IDAgfSxcclxuICAgIHNocmlua1JhdGU6IDAsXHJcbiAgICByYWRpYWxEaXNwbGFjZW1lbnQ6IDAsXHJcbiAgICByYWRpYWxEaXNwbGFjZW1lbnRPZmZzZXQ6IDAsXHJcbiAgICBnbG9iYWxBbHBoYUluaXRpYWw6IDAsXHJcbiAgICBnbG9iYWxBbHBoYVRhcmdldDogMCxcclxuICAgIGdsb2JhbEFscGhhOiAwLFxyXG4gICAgbGlua0NyZWF0aW9uQXR0cmlidXRlczogW10sXHJcbiAgICBhcHBseUdsb2JhbEZvcmNlczogZmFsc2UsXHJcbiAgICBjb2xvclByb2ZpbGVzOiBbeyByOiAwLCBnOiAwLCBiOiAwLCBhOiAwIH1dLFxyXG4gICAgcmVuZGVyUHJvZmlsZXM6IFt7IHNoYXBlOiAnQ2lyY2xlJywgY29sb3JQcm9maWxlSWR4OiAwIH1dLFxyXG4gICAgY29sb3JTdGFydDoge1xyXG4gICAgICAgIHI6IDAsXHJcbiAgICAgICAgZzogMCxcclxuICAgICAgICBiOiAwLFxyXG4gICAgICAgIGE6IDBcclxuICAgIH0sXHJcbiAgICBjb2xvckVuZDoge1xyXG4gICAgICAgIHI6IDAsXHJcbiAgICAgICAgZzogMCxcclxuICAgICAgICBiOiAwLFxyXG4gICAgICAgIGE6IDBcclxuICAgIH0sXHJcbiAgICBjdXN0b21BdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgbGVuc0ZsYXJlOiB7XHJcbiAgICAgICAgICAgIG1pZ2h0RmxhcmU6IHRydWUsXHJcbiAgICAgICAgICAgIHdpbGxGbGFyZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGFuZ2xlOiAwLjMwXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbG9yQW5pbWF0aW9uQ29uZmlnOiB7XHJcbiAgICAgICAgZWFzaW5nOiB7XHJcbiAgICAgICAgICAgIHI6ICdsaW5lYXJFYXNlJyxcclxuICAgICAgICAgICAgZzogJ2xpbmVhckVhc2UnLFxyXG4gICAgICAgICAgICBiOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgICAgIGE6ICdsaW5lYXJFYXNlJ1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBhbmltYXRpb25UcmFja3M6IFtdLFxyXG4gICAga2lsbENvbmRpdGlvbnM6IHtcclxuICAgICAgICBib3VuZGFyeUNoZWNrOiBmYWxzZSxcclxuICAgICAgICBjb2xvckNoZWNrOiBbXSxcclxuICAgICAgICBwZXJBdHRyaWJ1dGU6IFtdXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyUGFydGljbGU6IGZhbHNlXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5yZXNldFRoZW1lID0gcmVzZXRUaGVtZTsiLCJ2YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcbnZhciBjb2xvcmluZyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vY29sb3JVdGlscy5qcycpLmNvbG9yVXRpbHM7XHJcbnZhciByZ2JhID0gY29sb3JpbmcucmdiYTtcclxuXHJcbnZhciBzbW9rZVRoZW1lID0ge1xyXG4gICAgY29udGV4dEJsZW5kaW5nTW9kZTogJ3NvdXJjZS1vdmVyJyxcclxuICAgIGFjdGl2ZTogMSxcclxuICAgIGxpZmU6IHsgbWluOiA0MDAsIG1heDogNTAwIH0sXHJcbiAgICBhbmdsZTogeyBtaW46IDEuNDUsIG1heDogMS41NSB9LFxyXG4gICAgLy8gdmVsQWNjZWxlcmF0aW9uOiAxLjA1LFxyXG4gICAgdmVsQWNjZWxlcmF0aW9uOiB7IG1pbjogMC45OTksIG1heDogMC45OTk5IH0sXHJcbiAgICAvLyBtYWdEZWNheTogMS41LFxyXG4gICAgcmFkaXVzOiB7IG1pbjogMzAsIG1heDogNTAgfSxcclxuICAgIHRhcmdldFJhZGl1czogeyBtaW46IDcwLCBtYXg6IDEzMCB9LFxyXG4gICAgYXBwbHlHbG9iYWxGb3JjZXM6IGZhbHNlLFxyXG4gICAgY29sb3JQcm9maWxlczogW3sgcjogMTAwLCBnOiAxMDAsIGI6IDEwMCwgYTogMCB9LCB7IHI6IDAsIGc6IDAsIGI6IDAsIGE6IDAuMDUgfSwgeyByOiAxMDAsIGc6IDEwMCwgYjogMTAwLCBhOiAwIH1dLFxyXG4gICAgcmVuZGVyUHJvZmlsZXM6IFt7IHNoYXBlRm46ICdmaWxsQ2lyY2xlJywgY29sb3JQcm9maWxlSWR4OiAwIH1dLFxyXG4gICAgY3VzdG9tQXR0cmlidXRlczoge1xyXG4gICAgICAgIGxlbnNGbGFyZToge1xyXG4gICAgICAgICAgICBtaWdodEZsYXJlOiB0cnVlLFxyXG4gICAgICAgICAgICB3aWxsRmxhcmU6IGZhbHNlLFxyXG4gICAgICAgICAgICBhbmdsZTogMC4zMFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwcm94aW1pdHk6IHtcclxuICAgICAgICBjaGVjazogZmFsc2UsXHJcbiAgICAgICAgdGhyZXNob2xkOiA1MFxyXG4gICAgfSxcclxuICAgIGFuaW1hdGlvblRyYWNrczogW3tcclxuICAgICAgICBhbmltTmFtZTogJ3JhZGl1c0dyb3cnLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBwYXJhbTogJ3InLFxyXG4gICAgICAgIGJhc2VBbW91bnQ6ICdpbml0UicsXHJcbiAgICAgICAgdGFyZ2V0VmFsdWVQYXRoOiAndFInLFxyXG4gICAgICAgIGR1cmF0aW9uOiAnbGlmZScsXHJcbiAgICAgICAgZWFzaW5nOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgIH0sIHtcclxuICAgICAgICBhbmltTmFtZTogJ2FscGhhRmFkZUluJyxcclxuICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgcGFyYW06ICdjb2xvcjREYXRhLmEnLFxyXG4gICAgICAgIGJhc2VBbW91bnQ6ICdjb2xvclByb2ZpbGVzWzBdLmEnLFxyXG4gICAgICAgIHRhcmdldFZhbHVlUGF0aDogJ2NvbG9yUHJvZmlsZXNbMV0uYScsXHJcbiAgICAgICAgZHVyYXRpb246IDAuMSxcclxuICAgICAgICBlYXNpbmc6ICdlYXNlT3V0UXVpbnQnLFxyXG4gICAgICAgIGxpbmtlZEFuaW06IGZhbHNlXHJcbiAgICB9LCB7XHJcbiAgICAgICAgYW5pbU5hbWU6ICdyZWQnLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBwYXJhbTogJ2NvbG9yNERhdGEucicsXHJcbiAgICAgICAgYmFzZUFtb3VudDogJ2NvbG9yUHJvZmlsZXNbMF0ucicsXHJcbiAgICAgICAgdGFyZ2V0VmFsdWVQYXRoOiAnY29sb3JQcm9maWxlc1sxXS5yJyxcclxuICAgICAgICBkdXJhdGlvbjogMC4yLFxyXG4gICAgICAgIGVhc2luZzogJ2xpbmVhckVhc2UnLFxyXG4gICAgICAgIGxpbmtlZEFuaW06IGZhbHNlXHJcbiAgICB9LCB7XHJcbiAgICAgICAgYW5pbU5hbWU6ICdncmVlbicsXHJcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIHBhcmFtOiAnY29sb3I0RGF0YS5nJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAnY29sb3JQcm9maWxlc1swXS5nJyxcclxuICAgICAgICB0YXJnZXRWYWx1ZVBhdGg6ICdjb2xvclByb2ZpbGVzWzFdLmcnLFxyXG4gICAgICAgIGR1cmF0aW9uOiAwLjIsXHJcbiAgICAgICAgZWFzaW5nOiAnbGluZWFyRWFzZScsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgIH0sIHtcclxuICAgICAgICBhbmltTmFtZTogJ2JsdWUnLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBwYXJhbTogJ2NvbG9yNERhdGEuYicsXHJcbiAgICAgICAgYmFzZUFtb3VudDogJ2NvbG9yUHJvZmlsZXNbMF0uYicsXHJcbiAgICAgICAgdGFyZ2V0VmFsdWVQYXRoOiAnY29sb3JQcm9maWxlc1sxXS5iJyxcclxuICAgICAgICBkdXJhdGlvbjogMC4yLFxyXG4gICAgICAgIGVhc2luZzogJ2xpbmVhckVhc2UnLFxyXG4gICAgICAgIGxpbmtlZEFuaW06IGZhbHNlXHJcbiAgICB9XSxcclxuICAgIGtpbGxDb25kaXRpb25zOiB7XHJcbiAgICAgICAgYm91bmRhcnlDaGVjazogdHJ1ZSxcclxuICAgICAgICBib3VuZGFyeU9mZnNldDogMjAwLFxyXG4gICAgICAgIGNvbG9yQ2hlY2s6IFtdLFxyXG4gICAgICAgIHBlckF0dHJpYnV0ZTogZmFsc2VcclxuICAgIH0sXHJcbiAgICByZW5kZXJQYXJ0aWNsZTogZnVuY3Rpb24gcmVuZGVyUGFydGljbGUoeCwgeSwgciwgY29sb3JEYXRhLCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIHAgPSB0aGlzO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAncmVuZGVyaW5nIHNtb2tlJyApO1xyXG5cclxuICAgICAgICBpZiAoY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gIT09ICdzb3VyY2Utb3ZlcicpIHtcclxuICAgICAgICAgICAgY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnc291cmNlLW92ZXInO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGdyZCA9IGNvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgMCwgeCwgeSwgcik7XHJcbiAgICAgICAgLy8gdmFyIGdyZCA9IGNvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoeCwgeSwgMCwgeCwgeSwgcik7XHJcbiAgICAgICAgLy8gZ3JkLmFkZENvbG9yU3RvcCgwLCByZ2JhKCBjb2xvckRhdGEuciwgIGNvbG9yRGF0YS5nLCBjb2xvckRhdGEuYiwgMC4wNSkgKTtcclxuICAgICAgICAvLyBncmQuYWRkQ29sb3JTdG9wKDEsIHJnYmEoIGNvbG9yRGF0YS5yLCBjb2xvckRhdGEuZywgY29sb3JEYXRhLmIsIDApICk7XHJcbiAgICAgICAgZ3JkLmFkZENvbG9yU3RvcCgwLCByZ2JhKGNvbG9yRGF0YS5yLCBjb2xvckRhdGEuZywgY29sb3JEYXRhLmIsIGNvbG9yRGF0YS5hKSk7XHJcbiAgICAgICAgZ3JkLmFkZENvbG9yU3RvcCgxLCByZ2JhKGNvbG9yRGF0YS5yLCBjb2xvckRhdGEuZywgY29sb3JEYXRhLmIsIDApKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGdyZDtcclxuICAgICAgICBjb250ZXh0LmZpbGxDaXJjbGUoeCwgeSwgciwgY29udGV4dCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5zbW9rZVRoZW1lID0gc21va2VUaGVtZTsiLCJsZXQgYW5pbWF0aW9uVHJhY2tzID0gW1xyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIGFuaW1OYW1lOiAncmFkaXVzR3JvdycsXHJcbiAgICAvLyAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgLy8gICAgIHBhcmFtOiAncicsXHJcbiAgICAvLyAgICAgYmFzZUFtb3VudDogJ2luaXRSJyxcclxuICAgIC8vICAgICB0YXJnZXRWYWx1ZVBhdGg6ICd0YXJnZXRSYWRpdXMnLFxyXG4gICAgLy8gICAgIGR1cmF0aW9uOiAnbGlmZScsXHJcbiAgICAvLyAgICAgZWFzaW5nOiAnbGluZWFyRWFzZScsXHJcbiAgICAvLyAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgIC8vIH0sXHJcbiAgICB7XHJcbiAgICAgICAgYW5pbU5hbWU6ICdmYWRlSW4nLFxyXG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBwYXJhbTogJ2dsb2JhbEFscGhhJyxcclxuICAgICAgICBiYXNlQW1vdW50OiAwLFxyXG4gICAgICAgIHRhcmdldFZhbHVlUGF0aDogMSxcclxuICAgICAgICBkdXJhdGlvbjogNCxcclxuICAgICAgICBlYXNpbmc6ICdlYXNlSW5DdWJpYycsXHJcbiAgICAgICAgbGlua2VkQW5pbTogZmFsc2VcclxuICAgIH1cclxuXVxyXG5cclxubW9kdWxlLmV4cG9ydHMuYW5pbWF0aW9uVHJhY2tzID0gYW5pbWF0aW9uVHJhY2tzOyIsImxldCBjb2xvclByb2ZpbGVzID0gW1xyXG5cdHsgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMCB9LCB7IHI6IDI1NSwgZzogMjU1LCBiOiAyNTUsIGE6IDEgfVxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMuY29sb3JQcm9maWxlcyA9IGNvbG9yUHJvZmlsZXM7IiwibGV0IGN1c3RvbUF0dHJpYnV0ZXMgPSB7XHJcbiAgICBsZW5zRmxhcmU6IHtcclxuICAgICAgICBtaWdodEZsYXJlOiB0cnVlLFxyXG4gICAgICAgIHdpbGxGbGFyZTogZmFsc2UsXHJcbiAgICAgICAgYW5nbGU6IDEuNTBcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmN1c3RvbUF0dHJpYnV0ZXMgPSBjdXN0b21BdHRyaWJ1dGVzOyIsImxldCBraWxsQ29uZGl0aW9ucyA9IHtcclxuICAgIGJvdW5kYXJ5Q2hlY2s6IHRydWUsXHJcbiAgICBib3VuZGFyeU9mZnNldDogNDAwLFxyXG4gICAgY29sb3JDaGVjazogW10sXHJcbiAgICBwZXJBdHRyaWJ1dGU6IFtdXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5raWxsQ29uZGl0aW9ucyA9IGtpbGxDb25kaXRpb25zOyIsImxldCBsaW5rQ3JlYXRpb25BdHRyaWJ1dGVzID0gW1xyXG5cdHtcdFxyXG5cdFx0dHlwZTogJ21hcCcsXHJcblx0XHRmdW5jdGlvbjogJ2xpbmVhcicsXHJcblx0XHRzcmM6ICd2ZWxBY2NlbGVyYXRpb24nLFxyXG5cdFx0c3JjVmFsdWU6ICdhY2NlbGVyYXRpb24nLFxyXG5cdFx0dGFyZ2V0OiAndGFyZ2V0UmFkaXVzJyxcclxuXHRcdGF0dHI6ICd0YXJnZXRSYWRpdXMnXHJcblx0fSxcclxuXHR7XHRcclxuXHRcdHR5cGU6ICdtYXAnLFxyXG5cdFx0ZnVuY3Rpb246ICdsaW5lYXInLFxyXG5cdFx0c3JjOiAndmVsQWNjZWxlcmF0aW9uJyxcclxuXHRcdHNyY1ZhbHVlOiAnYWNjZWxlcmF0aW9uJyxcclxuXHRcdHRhcmdldDogJ3JhZGl1cycsXHJcblx0XHRhdHRyOiAnaW5pdFInXHJcblx0fVxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMubGlua0NyZWF0aW9uQXR0cmlidXRlcyA9IGxpbmtDcmVhdGlvbkF0dHJpYnV0ZXM7IiwiLy8gdXRpbGl0aWVzXHJcbmxldCBtYXRoVXRpbHMgPSByZXF1aXJlKCcuLy4uLy4uLy4uL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxubGV0IHRyaWcgPSByZXF1aXJlKCcuLy4uLy4uLy4uL3RyaWdvbm9taWNVdGlscy5qcycpLnRyaWdvbm9taWNVdGlscztcclxubGV0IGNvbG9yaW5nID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9jb2xvclV0aWxzLmpzJykuY29sb3JVdGlscztcclxubGV0IGVhc2luZyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vZWFzaW5nLmpzJykuZWFzaW5nRXF1YXRpb25zO1xyXG5sZXQgcmdiYSA9IGNvbG9yaW5nLnJnYmE7XHJcbmxldCBjcmVhdGVXYXJwU3RhckltYWdlID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9jcmVhdGVXYXJwU3RhckltYWdlLmpzJyk7XHJcbmxldCB3YXJwU3RhckltYWdlID0gY3JlYXRlV2FycFN0YXJJbWFnZSgpO1xyXG5cclxubGV0IGVhc2VGbiA9IGVhc2luZy5lYXNlSW5FeHBvO1xyXG5cclxubGV0IGVhc2VTdGFydFZhbCA9IDA7XHJcbmxldCBlYXNlRGVsdGFWYWwgPSAyMDAwO1xyXG5sZXQgZWFzZUlucHV0TWF4VmFsID0gMTA7XHJcblxyXG5mdW5jdGlvbiBtZW1TdHJldGNoKCBtYWcgKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyggJ21hZ25pdHVkZSBvdXRzaWRlOiAnLCBtYWduaXR1ZGUgKTtcclxuICAgIGxldCBjYWNoZSA9IHt9O1xyXG5cclxuICAgIHJldHVybiAoIGZ1bmN0aW9uKCBtYWcgKSB7XHJcblxyXG4gICAgICAgIC8vIHN0cmluZ2lmeSB0aGUgbWFnIG51bWJlciBwcmltaXRpdmUgZm9yIHBvaW50ZXIgc2VsZWN0aW9uIFxyXG4gICAgICAgIGxldCBtYWdTdHIgPSBtYWcudG9TdHJpbmcoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyggJ21hZ1N0cjogJywgbWFnU3RyICk7XHJcbiAgICAgICAgaWYgKCBtYWdTdHIgaW4gY2FjaGUgKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCAnQ0FDSEVEIHZhbHVlJyApO1xyXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVbIG1hZ1N0ciBdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCAnTkVXIHZhbHVlJyApO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gZWFzZUZuKCBtYWcsIGVhc2VTdGFydFZhbCwgZWFzZURlbHRhVmFsLCBlYXNlSW5wdXRNYXhWYWwgKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICdtYWduaXR1ZGUudG9TdHJpbmcoKTogJywgbWFnbml0dWRlLnRvU3RyaW5nKCkgKTtcclxuICAgICAgICAgICAgY2FjaGVbIG1hZ1N0ciBdID0gcmVzdWx0O1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KSggbWFnICk7XHJcblxyXG59XHJcblxyXG5cclxuXHJcbmNvbnN0IG1lbW9pemVkQWRkID0gKCkgPT4ge1xyXG4gICAgbGV0IGNhY2hlID0ge307XHJcbiAgICByZXR1cm4gKG4pID0+IHtcclxuICAgICAgICBpZiAobiBpbiBjYWNoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmV0Y2hpbmcgZnJvbSBjYWNoZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVbbl07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NhbGN1bGF0aW5nIHJlc3VsdCcpO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gbiArIDEwO1xyXG4gICAgICAgICAgICBjYWNoZVtuXSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9ICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxucmVuZGVyRm46IGZ1bmN0aW9uIHJlbmRlckZuKHgsIHksIHIsIGNvbG9yRGF0YSwgYyApIHtcclxuICAgIGxldCBwID0gdGhpcztcclxuICAgIGxldCB2ZWwgPSBwYXJzZUZsb2F0KCBwLnJlbGF0aXZlTWFnbml0dWRlLnRvRml4ZWQoIDIgKSApO1xyXG4gICAgbGV0IHRoaXNSID0gciAqIDI7XHJcblxyXG4gICAgLy8gbGV0IHN0cmV0Y2hWYWwgPSBtYXRoVXRpbHMubWFwKCB2ZWwsIDAsIDIwMCwgMSwgNDAwMCApO1xyXG5cclxuICAgIGxldCBzdHJldGNoVmFsID0gZWFzZUZuKCB2ZWwsIGVhc2VTdGFydFZhbCwgZWFzZURlbHRhVmFsLCBlYXNlSW5wdXRNYXhWYWwgKTtcclxuICAgIC8vIGxldCBzdHJldGNoVmFsID0gbWVtU3RyZXRjaCggdmVsICk7XHJcblxyXG4gICAgbGV0IGxvbmdSID0gciAqIHN0cmV0Y2hWYWw7XHJcbiAgICAvLyB2YXIgc3RyZXRjaFZhbCA9ICggciAqICggKCA1MCAqIHZlbCApICogdmVsICkgKSAqIHZlbDtcclxuICAgIC8vIHZhciBjaHJvbWVWYWwgPSBtYXRoVXRpbHMubWFwKHN0cmV0Y2hWYWwsIDAsIDEwLCAxLCA0KTtcclxuICAgIFxyXG4gICAgLy8gY29udGV4dC5zYXZlKCk7XHJcbiAgICAvLyBjLnRyYW5zbGF0ZSggeCwgeSApO1xyXG4gICAgLy8gYy5yb3RhdGUoIHAuYW5nbGUgKTtcclxuXHJcbiAgICBsZXQgc3BpbkNvcyA9IE1hdGguY29zKCBwLmFuZ2xlICk7XHJcbiAgICBsZXQgc3BpblNpbiA9IE1hdGguc2luKCBwLmFuZ2xlICk7XHJcblxyXG4gICAgYy5zZXRUcmFuc2Zvcm0oIHNwaW5Db3MsIHNwaW5TaW4sIC1zcGluU2luLCBzcGluQ29zLCB4LCB5ICk7XHJcbiAgICAvLyBpZiAoIHAuaWR4ID09PSA5OTk3ICkge1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKCBwLmlkeCArICcgLSAnKyBwLmdsb2JhbEFscGhhICk7XHJcbiAgICAvLyB9XHJcbiAgICBjLmdsb2JhbEFscGhhID0gcC5nbG9iYWxBbHBoYTtcclxuICAgIC8vIGMuZ2xvYmFsQWxwaGEgPSAxO1xyXG4gICAgbGV0IHJlbmRlclByb3BzID0gd2FycFN0YXJJbWFnZS5yZW5kZXJQcm9wcztcclxuXHJcbiAgICBjLmRyYXdJbWFnZShcclxuICAgICAgICB3YXJwU3RhckltYWdlLFxyXG4gICAgICAgIDAsIDAsIHJlbmRlclByb3BzLnNyYy53LCByZW5kZXJQcm9wcy5zcmMuaCxcclxuICAgICAgICAwLCAtKCB0aGlzUiAvIDIgKSwgbG9uZ1IsIHRoaXNSXHJcbiAgICApO1xyXG5cclxuICAgIGMucmVzZXRUcmFuc2Zvcm0oKTtcclxuICAgIGMuZ2xvYmFsQWxwaGEgPSAxO1xyXG4gICAgLy8gaWYgKCBwLmlkeCA9PT0gOTk5NyB8fCBwLmlkeCA9PT0gOTk5NSApIHtcclxuICAgIC8vICAgICBjb25zb2xlLmxvZyggcC5pZHggKyAnIC0gJysgcC5nbG9iYWxBbHBoYSApO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gYy5yb3RhdGUoIC1wLmFuZ2xlICk7XHJcbiAgICAvLyBjLnRyYW5zbGF0ZSggLXgsIC15ICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLnJlbmRlckZuID0gcmVuZGVyRm47IiwibGV0IHJlbmRlclByb2ZpbGVzID0gW1xyXG5cdHsgc2hhcGU6ICdDaXJjbGUnLCBjb2xvclByb2ZpbGVJZHg6IDAgfSwgeyBzaGFwZTogJ0NpcmNsZScsIGNvbG9yUHJvZmlsZUlkeDogMSB9LCB7IHNoYXBlOiAnQ2lyY2xlJywgY29sb3JQcm9maWxlSWR4OiAyIH1cclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnJlbmRlclByb2ZpbGVzID0gcmVuZGVyUHJvZmlsZXM7IiwiLy8gdXRpbGl0aWVzXHJcbnZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuLy4uLy4uLy4uL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxudmFyIGNvbG9yaW5nID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9jb2xvclV0aWxzLmpzJykuY29sb3JVdGlscztcclxudmFyIHJnYmEgPSBjb2xvcmluZy5yZ2JhO1xyXG5cclxuLy8gdGhlbWUgcGFydGlhbHNcclxudmFyIHJlbmRlckZuID0gcmVxdWlyZSgnLi9yZW5kZXJGbi5qcycpLnJlbmRlckZuO1xyXG52YXIgYW5pbWF0aW9uVHJhY2tzID0gcmVxdWlyZSgnLi9hbmltYXRpb25UcmFja3MuanMnKS5hbmltYXRpb25UcmFja3M7XHJcbnZhciBraWxsQ29uZGl0aW9ucyA9IHJlcXVpcmUoJy4va2lsbENvbmRpdGlvbnMuanMnKS5raWxsQ29uZGl0aW9ucztcclxudmFyIGN1c3RvbUF0dHJpYnV0ZXMgPSByZXF1aXJlKCcuL2N1c3RvbUF0dHJpYnV0ZXMuanMnKS5jdXN0b21BdHRyaWJ1dGVzO1xyXG52YXIgbGlua0NyZWF0aW9uQXR0cmlidXRlcyA9IHJlcXVpcmUoJy4vbGlua0NyZWF0aW9uQXR0cmlidXRlcy5qcycpLmxpbmtDcmVhdGlvbkF0dHJpYnV0ZXM7XHJcbnZhciByZW5kZXJQcm9maWxlcyA9IHJlcXVpcmUoJy4vcmVuZGVyUHJvZmlsZXMuanMnKS5yZW5kZXJQcm9maWxlcztcclxudmFyIGNvbG9yUHJvZmlsZXMgPSByZXF1aXJlKCcuL2NvbG9yUHJvZmlsZXMuanMnKS5jb2xvclByb2ZpbGVzO1xyXG5cclxudmFyIHdhcnBTdGFyVGhlbWUgPSB7XHJcbiAgICBjb250ZXh0QmxlbmRpbmdNb2RlOiAnc291cmNlLW92ZXInLFxyXG4gICAgYWN0aXZlOiAxLFxyXG4gICAgbGlmZTogeyBtaW46IDUwLCBtYXg6IDEwMCB9LFxyXG4gICAgYW5nbGU6IHsgbWluOiAwLCBtYXg6IDIgfSxcclxuICAgIC8vIHZlbEFjY2VsZXJhdGlvbjogMS4wNSxcclxuICAgIHZlbEFjY2VsZXJhdGlvbjogeyBtaW46IDEuMDAxLCBtYXg6IDEuMDE1IH0sXHJcbiAgICBtYWdEZWNheTogMSxcclxuICAgIHJhZGl1czogeyBtaW46IDEsIG1heDogMS41IH0sXHJcbiAgICB0YXJnZXRSYWRpdXM6IHsgbWluOiA0LCBtYXg6IDIwIH0sXHJcbiAgICBnbG9iYWxBbHBoYUluaXRpYWw6IDAsXHJcbiAgICBnbG9iYWxBbHBoYVRhcmdldDogMSxcclxuICAgIGdsb2JhbEFscGhhOiAwLFxyXG4gICAgbGlua0NyZWF0aW9uQXR0cmlidXRlczogbGlua0NyZWF0aW9uQXR0cmlidXRlcywgXHJcbiAgICBhcHBseUdsb2JhbEZvcmNlczogZmFsc2UsXHJcbiAgICBjb2xvclByb2ZpbGVzOiBjb2xvclByb2ZpbGVzLFxyXG4gICAgcmVuZGVyUHJvZmlsZXM6IHJlbmRlclByb2ZpbGVzLFxyXG4gICAgY3VzdG9tQXR0cmlidXRlczogY3VzdG9tQXR0cmlidXRlcyxcclxuICAgIGFuaW1hdGlvblRyYWNrczogYW5pbWF0aW9uVHJhY2tzLFxyXG4gICAga2lsbENvbmRpdGlvbnM6IGtpbGxDb25kaXRpb25zLFxyXG4gICAgcmVuZGVyUGFydGljbGU6IHJlbmRlckZuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy53YXJwU3RhclRoZW1lID0gd2FycFN0YXJUaGVtZTsiLCIvLyBkZXBlbmRlbmNpZXNcclxuXHJcbi8vIE5QTVxyXG52YXIgTGlua2VkTGlzdCA9IHJlcXVpcmUoJ2RibHktbGlua2VkLWxpc3QnKTtcclxudmFyIG9iamVjdFBhdGggPSByZXF1aXJlKFwib2JqZWN0LXBhdGhcIik7XHJcblxyXG4vLyBDdXN0b20gUmVxdWlyZXNcclxudmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG52YXIgdHJpZyA9IHJlcXVpcmUoJy4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzO1xyXG52YXIgZHJhd2luZyA9IHJlcXVpcmUoJy4vY2FudmFzQXBpQXVnbWVudGF0aW9uLmpzJykuY2FudmFzRHJhd2luZ0FwaTtcclxudmFyIGNvbG9yaW5nID0gcmVxdWlyZSgnLi9jb2xvclV0aWxzLmpzJykuY29sb3JVdGlscztcclxudmFyIGVhc2luZyA9IHJlcXVpcmUoJy4vZWFzaW5nLmpzJykuZWFzaW5nRXF1YXRpb25zO1xyXG52YXIgYW5pbWF0aW9uID0gcmVxdWlyZSgnLi9hbmltYXRpb24uanMnKS5hbmltYXRpb247XHJcbnZhciBkZWJ1Z0NvbmZpZyA9IHJlcXVpcmUoJy4vZGVidWdVdGlscy5qcycpO1xyXG52YXIgZGVidWcgPSBkZWJ1Z0NvbmZpZy5kZWJ1ZztcclxudmFyIGxhc3RDYWxsZWRUaW1lID0gZGVidWdDb25maWcubGFzdENhbGxlZFRpbWU7XHJcbnZhciBlbnZpcm9ubWVudCA9IHJlcXVpcmUoJy4vZW52aXJvbm1lbnQuanMnKS5lbnZpcm9ubWVudDtcclxudmFyIHBoeXNpY3MgPSBlbnZpcm9ubWVudC5mb3JjZXM7XHJcbnZhciBydW50aW1lRW5naW5lID0gZW52aXJvbm1lbnQucnVudGltZUVuZ2luZTtcclxuXHJcbi8vIFBhcnRpY2xlIGVuZ2luZSBtYWNoaW5lcnlcclxudmFyIEVtaXR0ZXJFbnRpdHkgPSByZXF1aXJlKCcuL0VtaXR0ZXJFbnRpdHkuanMnKS5FbWl0dGVyRW50aXR5O1xyXG52YXIgRW1pdHRlclN0b3JlRm4gPSByZXF1aXJlKCcuL2VtaXR0ZXJTdG9yZS5qcycpLkVtaXR0ZXJTdG9yZUZuO1xyXG52YXIgcGFydGljbGVGbiA9IHJlcXVpcmUoJy4vcGFydGljbGVGbi5qcycpLnBhcnRpY2xlRm47XHJcbnZhciBwYXJ0aWNsZUFyckZuID0gcmVxdWlyZSgnLi9wYXJ0aWNsZUFyckZuLmpzJykucGFydGljbGVBcnJGbjtcclxuXHJcbi8vIEVtaXR0ZXIgdGhlbWVzXHJcbnZhciBzaW5nbGVCdXJzdFRoZW1lID0gcmVxdWlyZSgnLi9lbWl0dGVyVGhlbWVzL3NpbmdsZUJ1cnN0VGhlbWUvc2luZ2xlQnVyc3RUaGVtZS5qcycpLnNpbmdsZUJ1cnN0VGhlbWU7XHJcbnZhciBiYXNlRW1pdHRlclRoZW1lID0gcmVxdWlyZSgnLi9lbWl0dGVyVGhlbWVzL2Jhc2VFbWl0dGVyL2Jhc2VFbWl0dGVyVGhlbWUuanMnKS5iYXNlRW1pdHRlclRoZW1lO1xyXG52YXIgd2FycFN0cmVhbVRoZW1lID0gcmVxdWlyZSgnLi9lbWl0dGVyVGhlbWVzL3dhcnBTdHJlYW0vd2FycFN0cmVhbVRoZW1lLmpzJykud2FycFN0cmVhbVRoZW1lO1xyXG52YXIgZmxhbWVTdHJlYW1UaGVtZSA9IHJlcXVpcmUoJy4vZW1pdHRlclRoZW1lcy9mbGFtZVN0cmVhbS9mbGFtZVN0cmVhbVRoZW1lLmpzJykuZmxhbWVTdHJlYW1UaGVtZTtcclxudmFyIHNtb2tlU3RyZWFtVGhlbWUgPSByZXF1aXJlKCcuL2VtaXR0ZXJUaGVtZXMvc21va2VTdHJlYW0vc21va2VTdHJlYW1UaGVtZS5qcycpLnNtb2tlU3RyZWFtVGhlbWU7XHJcblxyXG4vLyBwYXJ0aWNsZSB0aGVtZXNcclxudmFyIHRoZW1lcyA9IHJlcXVpcmUoJy4vcGFydGljbGVUaGVtZXMvdGhlbWVzLmpzJykudGhlbWVzO1xyXG5cclxuXHJcbi8vIGNhY2hlIGNhbnZhcyB3L2hcclxubGV0IGNhblcgPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxubGV0IGNhbkggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbmxldCBjYW52YXNDZW50cmVIID0gY2FuVyAvIDI7XHJcbmxldCBjYW52YXNDZW50cmVWID0gY2FuSCAvIDI7XHJcblxyXG5sZXQgYmxpdENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5sZXQgYmxpdEN0eCA9IGJsaXRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIgKTtcclxuYmxpdENhbnZhcy5pZCA9ICdibGl0dGVyQ2FudmFzJztcclxuYmxpdENhbnZhcy53aWR0aCA9IGNhblc7XHJcbmJsaXRDYW52YXMuaGVpZ2h0ID0gY2FuSDtcclxuLy8gYmxpdEN0eC5maWx0ZXIgPSBcImJsdXIoMXB4KVwiO1xyXG5ibGl0Q2FudmFzLmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IHRydWU7XHJcblxyXG5sZXQgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0ZXN0LWJhc2VcIik7XHJcbmxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIsIHsgYWxwaGE6IGZhbHNlIH0gKTtcclxuY2FudmFzLndpZHRoID0gY2FuVztcclxuY2FudmFzLmhlaWdodCA9IGNhbkg7XHJcbmN0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xyXG5cclxudmFyIGNhbnZhc0NvbmZpZyA9IHtcclxuICAgIHdpZHRoOiBjYW5XLFxyXG4gICAgaGVpZ2h0OiBjYW5ILFxyXG4gICAgY2VudGVySDogY2FudmFzQ2VudHJlSCxcclxuICAgIGNlbnRlclY6IGNhbnZhc0NlbnRyZVYsXHJcblxyXG4gICAgYnVmZmVyQ2xlYXJSZWdpb246IHtcclxuICAgICAgICB4OiBjYW52YXNDZW50cmVILFxyXG4gICAgICAgIHk6IGNhbnZhc0NlbnRyZVYsXHJcbiAgICAgICAgdzogMCxcclxuICAgICAgICBoOiAwXHJcbiAgICB9XHJcbn07XHJcblxyXG52YXIgYnVmZmVyQ2xlYXJSZWdpb24gPSB7XHJcbiAgICB4OiBjYW52YXNDZW50cmVILFxyXG4gICAgeTogY2FudmFzQ2VudHJlVixcclxuICAgIHc6IDAsXHJcbiAgICBoOiAwXHJcblxyXG4gICAgLy8gZW1pdHRlciBzdG9yZVxyXG59O1xyXG5cclxudmFyIGVtaXR0ZXJTdG9yZSA9IFtdO1xyXG4vLyBwYXJ0aWNsZSBzdG9yZVxyXG52YXIgZW50aXR5U3RvcmUgPSBbXTtcclxuLy8gcGFydGljbGUgc3RvcmUgbWV0YSBkYXRhXHJcbnZhciBlbnRpdHlQb29sID0gbmV3IExpbmtlZExpc3QoKTtcclxudmFyIGxpdmVFbnRpdHlDb3VudCA9IDA7XHJcblxyXG52YXIgcnVudGltZUNvbmZpZyA9IHtcclxuXHJcbiAgICBnbG9iYWxDbG9jazogMCxcclxuICAgIGdsb2JhbENsb2NrVGljazogZnVuY3Rpb24gZ2xvYmFsQ2xvY2tUaWNrKCkge1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsQ2xvY2srKztcclxuICAgIH0sXHJcblxyXG4gICAgZW1pdHRlckNvdW50OiAwLFxyXG4gICAgYWN0aXZlRW1pdHRlcnM6IDAsXHJcblxyXG4gICAgbGl2ZUVudGl0eUNvdW50OiAwLFxyXG4gICAgc3VidHJhY3Q6IGZ1bmN0aW9uIHN1YnRyYWN0KGFtb3VudCkge1xyXG4gICAgICAgIHRoaXMubGl2ZUVudGl0eUNvdW50IC09IGFtb3VudDtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIHByZS1wb3B1bGF0ZSBlbnRpdHlTdG9yZVxyXG52YXIgZW50aXR5UG9wdWxhdGlvbiA9IDEwMDAwO1xyXG5mb3IgKHZhciBpID0gMDsgaSA8IGVudGl0eVBvcHVsYXRpb247IGkrKykge1xyXG4gICAgLy8gY29uc29sZS5sb2coIFwicG9wdWxhdGluZyBlbnRpdHlTdG9yZSB3aXRoIHBJbnN0YW5jZSAnJWQnOiBcIiwgaSApO1xyXG4gICAgLy8gcEluc3RhbmNlLmlkeCA9IGk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyggXCJwSW5zdGFuY2UuaWR4ICclZCdcIiwgcEluc3RhbmNlLmlkeCApXHJcbiAgICBlbnRpdHlTdG9yZS5wdXNoKGNyZWF0ZUxpdmVQYXJ0aWNsZSgwLCAwLCBpLCBiYXNlRW1pdHRlclRoZW1lLCB0aGVtZXMucmVzZXQpKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCAnaW5pdGlhbCBwYXJ0aWNsZTogJywgZW50aXR5U3RvcmVbIGkgXSApO1xyXG4gICAgZW50aXR5UG9vbC5pbnNlcnQoJycgKyBpKTtcclxufVxyXG5cclxuLy8gY29uc29sZS5sb2coICdpbml0aWFsIHBhcnRpY2xlOiAnLCBlbnRpdHlTdG9yZVsgOTk5NyBdICk7XHJcblxyXG4vLyBnbG9iYWwgY291bnRlclxyXG52YXIgZ2xvYmFsQ2xvY2sgPSAwO1xyXG52YXIgY291bnRlciA9IDA7XHJcblxyXG4vLyBzZXQgZGVmYXVsdCB2YXJpYWJsZXMgXHJcbnZhciBtb3VzZVggPSB2b2lkIDAsXHJcbiAgICBtb3VzZVkgPSB2b2lkIDAsXHJcbiAgICBydW50aW1lID0gdm9pZCAwLFxyXG4gICAgcExpdmUgPSB2b2lkIDA7XHJcbiAgICBcclxuLy8gbGV0IGN1cnJUaGVtZSA9IHRoZW1lcy5maXJlO1xyXG4vLyB2YXIgY3VyclRoZW1lID0gdGhlbWVzLmZsYW1lO1xyXG5sZXQgY3VyclRoZW1lID0gdGhlbWVzLndhcnBTdGFyO1xyXG4vLyBsZXQgY3VyclRoZW1lID0gdGhlbWVzLnNtb2tlO1xyXG5cclxuLy8gbGV0IGN1cnJFbWl0dGVyVGhlbWUgPSBzaW5nbGVCdXJzdFRoZW1lO1xyXG5sZXQgY3VyckVtaXR0ZXJUaGVtZSA9IHdhcnBTdHJlYW1UaGVtZTtcclxuLy8gdmFyIGN1cnJFbWl0dGVyVGhlbWUgPSBmbGFtZVN0cmVhbVRoZW1lO1xyXG5cclxudmFyIGN1cnJFbW1pc3Npb25UeXBlID0ge1xyXG4gICAgbW91c2VDbGlja0V2ZW50OiBmYWxzZSxcclxuICAgIHJhbmRvbUJ1cnN0OiBmYWxzZSxcclxuICAgIHN0ZWFkeVN0cmVhbTogdHJ1ZVxyXG59O1xyXG5cclxuXHJcbmxldCBob2xlR3JhZCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCggY2FudmFzQ2VudHJlSCwgY2FudmFzQ2VudHJlViwgMCwgY2FudmFzQ2VudHJlSCwgY2FudmFzQ2VudHJlViwgMjAwICk7XHJcbmhvbGVHcmFkLmFkZENvbG9yU3RvcCggMCwgJ3JnYmEoIDAsIDAsIDAsIDEgKScgKTtcclxuaG9sZUdyYWQuYWRkQ29sb3JTdG9wKCAxLCAncmdiYSggMCwgMCwgMCwgMCApJyApO1xyXG5cclxubGV0IHN0cmVhbUVtbWlzaW9uTGltaXRlciA9IGZhbHNlO1xyXG5cclxuLy8gY2FudmFzIGNsaWNrIGhhbmRsZXJcclxuZnVuY3Rpb24gcmVnaXN0ZXJNb3VzZUNsaWNrRW1taXNpb24oKSB7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBtb3VzZVggPSBldmVudC5vZmZzZXRYO1xyXG4gICAgICAgIG1vdXNlWSA9IGV2ZW50Lm9mZnNldFk7XHJcblxyXG4gICAgICAgIC8vIHRlc3RFbWl0dGVyLnJlc2V0RW1pc3Npb25WYWx1ZXMoKTtcclxuICAgICAgICAvLyB0ZXN0RW1pdHRlci50cmlnZ2VyRW1pdHRlciggeyB4OiBtb3VzZVgsIHk6IG1vdXNlWSB9ICk7XHJcblxyXG4gICAgICAgIHZhciB0ZXN0RW1pdHRlciA9IG5ldyBFbWl0dGVyRW50aXR5KCd0ZXN0RW1pdHRlcicsIGN1cnJFbWl0dGVyVGhlbWUsIGN1cnJUaGVtZSwgZW1pdEVudGl0aWVzKTtcclxuXHJcbiAgICAgICAgZW1pdHRlclN0b3JlLnB1c2godGVzdEVtaXR0ZXIpO1xyXG5cclxuICAgICAgICB0ZXN0RW1pdHRlci50cmlnZ2VyRW1pdHRlcih7XHJcbiAgICAgICAgICAgIHg6IGNhbnZhc0NvbmZpZy5jZW50ZXJILFxyXG4gICAgICAgICAgICB5OiBjYW52YXNDb25maWcuY2VudGVyVlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoYW5pbWF0aW9uLnN0YXRlICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbi5zdGF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJNb3VzZU1vdmUoIGV2ZW50ICkge1xyXG4gICAgICAgIG1vdXNlWCA9IGV2ZW50Lm9mZnNldFg7XHJcbiAgICAgICAgbW91c2VZID0gZXZlbnQub2Zmc2V0WTtcclxufTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHJlZ2lzdGVyTW91c2VNb3ZlKTtcclxuXHJcbmlmIChjdXJyRW1taXNzaW9uVHlwZS5tb3VzZUNsaWNrRXZlbnQpIHtcclxuICAgIHJlZ2lzdGVyTW91c2VDbGlja0VtbWlzaW9uKCk7XHJcbn1cclxuXHJcbmlmIChjdXJyRW1taXNzaW9uVHlwZS5zdGVhZHlTdHJlYW0pIHtcclxuXHJcbiAgICB2YXIgdGVzdEVtaXR0ZXIgPSBuZXcgRW1pdHRlckVudGl0eSgndGVzdEVtaXR0ZXInLCBjdXJyRW1pdHRlclRoZW1lLCBjdXJyVGhlbWUsIGVtaXRFbnRpdGllcyk7XHJcbiAgICBlbWl0dGVyU3RvcmUucHVzaCh0ZXN0RW1pdHRlcik7XHJcblxyXG4gICAgdGVzdEVtaXR0ZXIudHJpZ2dlckVtaXR0ZXIoe1xyXG4gICAgICAgIHg6IGNhbnZhc0NvbmZpZy5jZW50ZXJILFxyXG4gICAgICAgIHk6IGNhbnZhc0NvbmZpZy5jZW50ZXJWXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyB0ZXN0RW1pdHRlci50cmlnZ2VyRW1pdHRlcih7XHJcbiAgICAvLyAgICAgeDogbW91c2VYLFxyXG4gICAgLy8gICAgIHk6IG1vdXNlWVxyXG4gICAgLy8gfSk7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coICdlbWl0dGVyU3RvcmVbIDk5OTcgXScsIGVtaXR0ZXJTdG9yZVsgOTk5N10gKTtcclxuICAgIGlmIChhbmltYXRpb24uc3RhdGUgIT09IHRydWUpIHtcclxuICAgICAgICBhbmltYXRpb24uc3RhdGUgPSB0cnVlO1xyXG4gICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxudmFyIHNtb2tlRW1pdHRlciA9IG5ldyBFbWl0dGVyRW50aXR5KCdzbW9rZUVtaXR0ZXInLCBzbW9rZVN0cmVhbVRoZW1lLCB0aGVtZXMuc21va2UsIGVtaXRFbnRpdGllcyk7XHJcbmVtaXR0ZXJTdG9yZS5wdXNoKHNtb2tlRW1pdHRlcik7XHJcblxyXG4vLyBwYXJ0aWNsZSBtZXRob2RzIGZOXHJcbmZ1bmN0aW9uIHJlbmRlclBhcnRpY2xlKHgsIHksIHIsIGNvbG9yRGF0YSwgY29udGV4dCwgbWF0aFV0aWxzKSB7XHJcbiAgICB2YXIgcCA9IHRoaXM7XHJcbiAgICAvLyBjb25zb2xlLmxvZyggJ3AucmVuZGVyOiAnLCBwICk7XHJcbiAgICB2YXIgY29tcGlsZWRDb2xvciA9IFwicmdiYShcIiArIGNvbG9yRGF0YS5yICsgJywnICsgY29sb3JEYXRhLmcgKyAnLCcgKyBjb2xvckRhdGEuYiArIFwiLFwiICsgY29sb3JEYXRhLmEgKyBcIilcIjtcclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29tcGlsZWRDb2xvcjtcclxuICAgIGNvbnRleHQuZmlsbENpcmNsZSh4LCB5LCByLCBjb250ZXh0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0UGFydGljbGVBdHRyaWJ1dGVzKHAsIHBwYSkge1xyXG5cclxuICAgIHAuaXNBbGl2ZSA9IHBwYS5hY3RpdmU7XHJcbiAgICBwLmxpZmVTcGFuID0gcHBhLmxpZmVTcGFuO1xyXG4gICAgcC5jdXJyTGlmZSA9IHBwYS5saWZlU3BhbjtcclxuICAgIHAuY3VyckxpZmVJbnYgPSAwO1xyXG4gICAgcC54ID0gcHBhLng7XHJcbiAgICBwLnkgPSBwcGEueTtcclxuICAgIHAueFZlbCA9IHBwYS54VmVsO1xyXG4gICAgcC55VmVsID0gcHBhLnlWZWw7XHJcbiAgICBwLnZBY2MgPSBwcGEudkFjYztcclxuICAgIHAuaW5pdFIgPSBwcGEuaW5pdFI7XHJcbiAgICBwLnIgPSBwcGEuaW5pdFI7XHJcbiAgICBwLnRSID0gcHBhLnRSO1xyXG4gICAgcC5hbmdsZSA9IHBwYS5hbmdsZTtcclxuICAgIHAubWFnbml0dWRlID0gcHBhLm1hZ25pdHVkZTtcclxuICAgIHAucmVsYXRpdmVNYWduaXR1ZGUgPSBwcGEubWFnbml0dWRlO1xyXG4gICAgcC5tYWduaXR1ZGVEZWNheSA9IHBwYS5tYWduaXR1ZGVEZWNheTtcclxuICAgIHAuZW50aXR5VHlwZSA9ICdub25lJztcclxuICAgIHAuYXBwbHlGb3JjZXMgPSBwcGEuYXBwbHlGb3JjZXM7XHJcbiAgICBwLmdsb2JhbEFscGhhID0gcHBhLmdsb2JhbEFscGhhO1xyXG4gICAgcC5nbG9iYWxBbHBoYUluaXRpYWwgPSBwcGEuZ2xvYmFsQWxwaGFJbml0aWFsO1xyXG4gICAgcC5nbG9iYWxBbHBoYVRhcmdldCA9IHBwYS5nbG9iYWxBbHBoYVRhcmdldDtcclxuICAgIHAuY29sb3I0RGF0YSA9IHBwYS5jb2xvcjREYXRhO1xyXG4gICAgcC5jb2xvclByb2ZpbGVzID0gcHBhLmNvbG9yUHJvZmlsZXM7XHJcbiAgICBwLmtpbGxDb25kaXRpb25zID0gcHBhLmtpbGxDb25kaXRpb25zO1xyXG4gICAgcC5jdXN0b21BdHRyaWJ1dGVzID0gcHBhLmN1c3RvbUF0dHJpYnV0ZXM7XHJcbiAgICBwLmFuaW1hdGlvblRyYWNrcyA9IHBwYS5hbmltYXRpb25UcmFja3M7XHJcbiAgICBwLnVwZGF0ZSA9IHBhcnRpY2xlRm4udXBkYXRlUGFydGljbGU7XHJcbiAgICBwLnJlaW5jYXJuYXRlID0gcmVpbmNhcm5hdGVQYXJ0aWNsZTtcclxuICAgIHAua2lsbCA9IHBhcnRpY2xlRm4ua2lsbFBhcnRpY2xlO1xyXG4gICAgcC5yZW5kZXIgPSBwcGEucmVuZGVyRk47XHJcbiAgICBwLmV2ZW50cyA9IHBwYS5ldmVudHM7XHJcbn1cclxuXHJcbi8vIHBhcnRpY2xlIGZOXHJcbmZ1bmN0aW9uIGNyZWF0ZUxpdmVQYXJ0aWNsZSh0aGlzWCwgdGhpc1ksIGlkeCwgZW1pc3Npb25PcHRzLCBwYXJ0aWNsZU9wdHMpIHtcclxuXHJcbiAgICB2YXIgbmV3UGFydGljbGUgPSB7fTtcclxuICAgIG5ld1BhcnRpY2xlLmlkeCA9IGlkeDtcclxuICAgIHNldFBhcnRpY2xlQXR0cmlidXRlcyggbmV3UGFydGljbGUsIHBhcnRpY2xlRm4uY3JlYXRlUGVyUGFydGljbGVBdHRyaWJ1dGVzKCB0aGlzWCwgdGhpc1ksIGVtaXNzaW9uT3B0cywgcGFydGljbGVPcHRzICkgKTtcclxuICAgIHJldHVybiBuZXdQYXJ0aWNsZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVpbmNhcm5hdGVQYXJ0aWNsZSh0aGlzWCwgdGhpc1ksIGVtaXNzaW9uT3B0cywgcGFydGljbGVPcHRpb25zKSB7XHJcbiAgICBzZXRQYXJ0aWNsZUF0dHJpYnV0ZXModGhpcywgcGFydGljbGVGbi5jcmVhdGVQZXJQYXJ0aWNsZUF0dHJpYnV0ZXModGhpc1gsIHRoaXNZLCBlbWlzc2lvbk9wdHMsIHBhcnRpY2xlT3B0aW9ucykpO1xyXG59XHJcblxyXG4vLyBlbW1pc2lvbiBmTlxyXG5mdW5jdGlvbiBlbWl0RW50aXRpZXMoeCwgeSwgY291bnQsIGVtaXNzaW9uT3B0aW9ucywgcGFydGljbGVPcHRpb25zKSB7XHJcbiAgICB2YXIgZW50aXR5U3RvcmVMZW4gPSBlbnRpdHlTdG9yZS5sZW5ndGg7XHJcbiAgICB2YXIgYWRkZWROZXcgPSAwO1xyXG4gICAgdmFyIGFkZGVkRnJvbVBvb2wgPSAwO1xyXG4gICAgdmFyIHRoZXRhO1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCBcImVtbWl0aW5nIGEgdG90YWwgb2Y6ICclZCcgcGFydGljbGVzXCIsIGNvdW50ICk7XHJcbiAgICBydW50aW1lQ29uZmlnLmxpdmVFbnRpdHlDb3VudCArPSBjb3VudDtcclxuICAgIGZvciAoIGxldCBpID0gY291bnQgLSAxOyBpID49IDA7IGktLSApIHtcclxuXHJcbiAgICAgICAgaWYgKGVudGl0eVBvb2wuZ2V0U2l6ZSgpID4gMCkge1xyXG4gICAgICAgICAgICBlbnRpdHlTdG9yZVsgZW50aXR5UG9vbC5nZXRUYWlsTm9kZSgpLmdldERhdGEoKSBdLnJlaW5jYXJuYXRlKCB4LCB5LCBlbWlzc2lvbk9wdGlvbnMsIHBhcnRpY2xlT3B0aW9ucyApO1xyXG4gICAgICAgICAgICBhZGRlZEZyb21Qb29sKys7XHJcbiAgICAgICAgICAgIGVudGl0eVBvb2wucmVtb3ZlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZW50aXR5U3RvcmUucHVzaCggY3JlYXRlTGl2ZVBhcnRpY2xlKCB4LCB5LCBlbnRpdHlTdG9yZUxlbiwgZW1pc3Npb25PcHRpb25zLCBwYXJ0aWNsZU9wdGlvbnMgKSApO1xyXG4gICAgICAgICAgICBlbnRpdHlQb29sLmluc2VydCgnJyArIGVudGl0eVN0b3JlTGVuKTtcclxuICAgICAgICAgICAgYWRkZWROZXcrKztcclxuICAgICAgICAgICAgZW50aXR5U3RvcmVMZW4rKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBjb25zb2xlLmxvZyggXCJhZGRlZEZyb21Qb29sOiAnJWQnLCBhZGRlZE5ldzogJyVkJ1wiLCBhZGRlZEZyb21Qb29sLCBhZGRlZE5ldyApO1xyXG4gICAgLy8gY29uc29sZS53YXJuKCAnYWRkZWROZXc6ICcsIGFkZGVkTmV3ICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUVtaXR0ZXJTdG9yZU1lbWJlcnMoKSB7XHJcblxyXG4gICAgZm9yICggbGV0IGkgPSBlbWl0dGVyU3RvcmUubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0gKSB7XHJcbiAgICAgICAgZW1pdHRlclN0b3JlWyBpIF0udXBkYXRlRW1pdHRlcigpO1xyXG4gICAgICAgIC8vIGVtaXR0ZXJTdG9yZVtpXS5yZW5kZXJFbWl0dGVyKCBjdHggKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gcnVudGltZSBmTiBtZW1iZXJzXHJcbmZ1bmN0aW9uIGRpc3BsYXlEZWJ1Z2dpbmcoKSB7XHJcbiAgICAvLyBjdHguZ2xvYmFsQWxwaGEgPSAxO1xyXG4gICAgLy8gZGVidWcuZGVidWdPdXRwdXQoY2FudmFzLCBjdHgsICdBbmltYXRpb24gQ291bnRlcjogJywgY291bnRlciwgMCk7XHJcbiAgICAvLyBkZWJ1Zy5kZWJ1Z091dHB1dChjYW52YXMsIGN0eCwgJ1BhcnRpY2xlIFBvb2w6ICcsIGVudGl0eVN0b3JlLmxlbmd0aCwgMSk7XHJcbiAgICAvLyBkZWJ1Zy5kZWJ1Z091dHB1dChjYW52YXMsIGN0eCwgJ0xpdmUgRW50aXRpZXM6ICcsIHJ1bnRpbWVDb25maWcubGl2ZUVudGl0eUNvdW50LCAyLCB7IG1pbjogZW50aXR5U3RvcmUubGVuZ3RoLCBtYXg6IDAgfSk7XHJcbiAgICBkZWJ1Zy5kZWJ1Z091dHB1dChjYW52YXMsIGN0eCwgJ0ZQUzogJywgTWF0aC5yb3VuZChkZWJ1Zy5jYWxjdWxhdGVGcHMoKSksIDMsIHsgbWluOiAwLCBtYXg6IDYwIH0pO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ3ljbGUoKSB7XHJcblxyXG4gICAgLy8gaWYgKCBjdXJyRW1taXNzaW9uVHlwZS5zdGVhZHlTdHJlYW0gPT09IHRydWUgKSB7XHJcbiAgICAvLyAgICAgaWYgKCBzdHJlYW1FbW1pc2lvbkxpbWl0ZXIgPT09IGZhbHNlICkge1xyXG4gICAgLy8gICAgICAgICB0ZXN0RW1pdHRlci50cmlnZ2VyRW1pdHRlcih7XHJcbiAgICAvLyAgICAgICAgICAgICB4OiBjYW52YXNDb25maWcuY2VudGVySCxcclxuICAgIC8vICAgICAgICAgICAgIHk6IGNhbnZhc0NvbmZpZy5jZW50ZXJWXHJcbiAgICAvLyAgICAgICAgIH0pO1xyXG4gICAgLy8gICAgICAgICBzdHJlYW1FbW1pc2lvbkxpbWl0ZXIgPSB0cnVlO1xyXG4gICAgLy8gICAgICAgICBhbmltYXRpb24uc3RhdGUgPSB0cnVlO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuXHJcblxyXG4gICAgLy8gcmVuZGVyaW5nXHJcbiAgICBcclxuICAgIHBhcnRpY2xlQXJyRm4ucmVuZGVyUGFydGljbGVBcnIoIGJsaXRDdHgsIGVudGl0eVN0b3JlLCBhbmltYXRpb24gKTtcclxuICAgIC8vIGJsaXRDdHguZmlsdGVyID0gXCJibHVyKDBweClcIjtcclxuICAgIC8vIGJsaXQgdG8gb25zY3JlZW5cclxuICAgIGN0eC5kcmF3SW1hZ2UoIGJsaXRDYW52YXMsIDAsIDAgKTtcclxuICAgIC8vIGN0eC5maWxsU3R5bGUgPSBob2xlR3JhZDtcclxuICAgIC8vIGN0eC5maWxsQ2lyY2xlKCBjYW52YXNDZW50cmVILCBjYW52YXNDZW50cmVWLCAyMDAgKTtcclxuXHJcbiAgICAvLyB1cGRhdGluZ1xyXG4gICAgcGFydGljbGVBcnJGbi51cGRhdGVQYXJ0aWNsZUFyciggZW50aXR5U3RvcmUsIGVudGl0eVBvb2wsIGFuaW1hdGlvbiwgY2FudmFzQ29uZmlnLCBydW50aW1lQ29uZmlnLCBlbWl0dGVyU3RvcmUgKTtcclxuXHJcbiAgICB1cGRhdGVFbWl0dGVyU3RvcmVNZW1iZXJzKCk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhckNhbnZhcyggY3R4ICkge1xyXG5cclxuICAgIC8vIGNsZWFuaW5nXHJcbiAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcclxuICAgIGN0eC5maWxsUmVjdCggMCwgMCwgY2FuVywgY2FuSCApO1xyXG4gICAgLy8gY3R4LmNsZWFyUmVjdCggMCwgMCwgY2FuVywgY2FuSCApO1xyXG4gICAgLy8gY3R4LmNsZWFyUmVjdCggYnVmZmVyQ2xlYXJSZWdpb24ueCwgYnVmZmVyQ2xlYXJSZWdpb24ueSwgYnVmZmVyQ2xlYXJSZWdpb24udywgYnVmZmVyQ2xlYXJSZWdpb24uaCApO1xyXG4gICAgYmxpdEN0eC5jbGVhclJlY3QoIDAsIDAsIGNhblcsIGNhbkggKTtcclxuXHJcblxyXG4gICAgLy8gY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKCAwLCAwLCAwLCAwLjEgKSc7XHJcbiAgICAvLyBjdHguZmlsbFJlY3QoIDAsIDAsIGNhblcsIGNhbkggKTtcclxuXHJcbiAgICAvLyBzZXQgZGlydHkgYnVmZmVyXHJcbiAgICAvLyByZXNldEJ1ZmZlckNsZWFyUmVnaW9uKCk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gcnVudGltZVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuXHJcbiAgICAvLyBsb29wIGhvdXNla2VlcGluZ1xyXG4gICAgcnVudGltZSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAvLyBjbGVhbiBjYW52YXNcclxuICAgIGNsZWFyQ2FudmFzKCBjdHggKTtcclxuXHJcbiAgICAvLyBibGVuZGluZ1xyXG4gICAgaWYgKCBibGl0Q3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiAhPSBjdXJyVGhlbWUuY29udGV4dEJsZW5kaW5nTW9kZSApIHtcclxuICAgICAgICBibGl0Q3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IGN1cnJUaGVtZS5jb250ZXh0QmxlbmRpbmdNb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZXNcclxuICAgIHVwZGF0ZUN5Y2xlKCk7XHJcblxyXG4gICAgLy8gZGVidWdnaW5nXHJcbiAgICBkaXNwbGF5RGVidWdnaW5nKCk7XHJcblxyXG4gICAgLy8gbG9vcGluZ1xyXG4gICAgYW5pbWF0aW9uLnN0YXRlID09PSB0cnVlID8gKHJ1bnRpbWVFbmdpbmUuc3RhcnRBbmltYXRpb24ocnVudGltZSwgdXBkYXRlKSwgY291bnRlcisrKSA6IHJ1bnRpbWVFbmdpbmUuc3RvcEFuaW1hdGlvbihydW50aW1lKTtcclxuXHJcbiAgICAvLyBnbG9iYWwgY2xvY2tcclxuICAgIC8vIGNvdW50ZXIrKztcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEVuZCBydW50aW1lXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8iLCJ2YXIgX3RyaWdvbm9taWNVdGlscztcclxuXHJcbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XHJcblxyXG4vKipcclxuKiBjYWNoZWQgdmFsdWVzXHJcbiovXHJcblxyXG52YXIgcGlCeUhhbGYgPSBNYXRoLlBpIC8gMTgwO1xyXG52YXIgaGFsZkJ5UGkgPSAxODAgLyBNYXRoLlBJO1xyXG5cclxuLyoqXHJcbiogcHJvdmlkZXMgdHJpZ29ubWljIHV0aWwgbWV0aG9kcy5cclxuKlxyXG4qIEBtaXhpblxyXG4qL1xyXG52YXIgdHJpZ29ub21pY1V0aWxzID0gKF90cmlnb25vbWljVXRpbHMgPSB7XHJcblxyXG5cdGFuZ2xlOiBmdW5jdGlvbihvcmlnaW5YLCBvcmlnaW5ZLCB0YXJnZXRYLCB0YXJnZXRZKSB7XHJcbiAgICAgICAgdmFyIGR4ID0gb3JpZ2luWCAtIHRhcmdldFg7XHJcbiAgICAgICAgdmFyIGR5ID0gb3JpZ2luWSAtIHRhcmdldFk7XHJcbiAgICAgICAgdmFyIHRoZXRhID0gTWF0aC5hdGFuMigtZHksIC1keCk7XHJcbiAgICAgICAgcmV0dXJuIHRoZXRhO1xyXG4gICAgfSxcclxuXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBjYWxjdWxhdGUgZGlzdGFuY2UgYmV0d2VlbiAyIHZlY3RvciBjb29yZGluYXRlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IHgxIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geTEgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MiAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuICogQHBhcmFtIHtudW1iZXJ9IHkyIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdGRpc3Q6IGZ1bmN0aW9uIGRpc3QoeDEsIHkxLCB4MiwgeTIpIHtcclxuXHRcdHgyIC09IHgxO3kyIC09IHkxO1xyXG5cdFx0cmV0dXJuIE1hdGguc3FydCh4MiAqIHgyICsgeTIgKiB5Mik7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBjb252ZXJ0IGRlZ3JlZXMgdG8gcmFkaWFucy5cclxuICogQHBhcmFtIHtudW1iZXJ9IGRlZ3JlZXMgLSB0aGUgZGVncmVlIHZhbHVlIHRvIGNvbnZlcnQuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0ZGVncmVlc1RvUmFkaWFuczogZnVuY3Rpb24gZGVncmVlc1RvUmFkaWFucyhkZWdyZWVzKSB7XHJcblx0XHRyZXR1cm4gZGVncmVlcyAqIHBpQnlIYWxmO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gY29udmVydCByYWRpYW5zIHRvIGRlZ3JlZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWRpYW5zIC0gdGhlIGRlZ3JlZSB2YWx1ZSB0byBjb252ZXJ0LlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdHJhZGlhbnNUb0RlZ3JlZXM6IGZ1bmN0aW9uIHJhZGlhbnNUb0RlZ3JlZXMocmFkaWFucykge1xyXG5cdFx0cmV0dXJuIHJhZGlhbnMgKiBoYWxmQnlQaTtcclxuXHR9LFxyXG5cclxuXHQvKlxyXG4gcmV0dXJuIHVzZWZ1bCBUcmlnb25vbWljIHZhbHVlcyBmcm9tIHBvc2l0aW9uIG9mIDIgb2JqZWN0cyBpbiB4L3kgc3BhY2VcclxuIHdoZXJlIHgxL3kxIGlzIHRoZSBjdXJyZW50IHBvaXN0aW9uIGFuZCB4Mi95MiBpcyB0aGUgdGFyZ2V0IHBvc2l0aW9uXHJcbiAqL1xyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gY2FsY3VsYXRlIHRyaWdvbW9taWMgdmFsdWVzIGJldHdlZW4gMiB2ZWN0b3IgY29vcmRpbmF0ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MSAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHkxIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geDIgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuICogQHR5cGVkZWYge09iamVjdH0gQ2FsY3VsYXRpb25cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IGRpc3RhbmNlIFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHZlY3RvcnNcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IGFuZ2xlIFRoZSBhbmdsZSBiZXR3ZWVuIHZlY3RvcnNcclxuICogQHJldHVybnMgeyBDYWxjdWxhdGlvbiB9IHRoZSBjYWxjdWxhdGVkIGFuZ2xlIGFuZCBkaXN0YW5jZSBiZXR3ZWVuIHZlY3RvcnNcclxuICovXHJcblx0Z2V0QW5nbGVBbmREaXN0YW5jZTogZnVuY3Rpb24gZ2V0QW5nbGVBbmREaXN0YW5jZSh4MSwgeTEsIHgyLCB5Mikge1xyXG5cclxuXHRcdC8vIHNldCB1cCBiYXNlIHZhbHVlc1xyXG5cdFx0dmFyIGRYID0geDIgLSB4MTtcclxuXHRcdHZhciBkWSA9IHkyIC0geTE7XHJcblx0XHQvLyBnZXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHBvaW50c1xyXG5cdFx0dmFyIGQgPSBNYXRoLnNxcnQoZFggKiBkWCArIGRZICogZFkpO1xyXG5cdFx0Ly8gYW5nbGUgaW4gcmFkaWFuc1xyXG5cdFx0Ly8gdmFyIHJhZGlhbnMgPSBNYXRoLmF0YW4yKHlEaXN0LCB4RGlzdCkgKiAxODAgLyBNYXRoLlBJO1xyXG5cdFx0Ly8gYW5nbGUgaW4gcmFkaWFuc1xyXG5cdFx0dmFyIHIgPSBNYXRoLmF0YW4yKGRZLCBkWCk7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRkaXN0YW5jZTogZCxcclxuXHRcdFx0YW5nbGU6IHJcclxuXHRcdH07XHJcblx0fSxcclxuXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBnZXQgbmV3IFggY29vcmRpbmF0ZSBmcm9tIGFuZ2xlIGFuZCBkaXN0YW5jZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnMgLSB0aGUgYW5nbGUgdG8gdHJhbnNmb3JtIGluIHJhZGlhbnMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIHRoZSBkaXN0YW5jZSB0byB0cmFuc2Zvcm0uXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0Z2V0QWRqYWNlbnRMZW5ndGg6IGZ1bmN0aW9uIGdldEFkamFjZW50TGVuZ3RoKHJhZGlhbnMsIGRpc3RhbmNlKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5jb3MocmFkaWFucykgKiBkaXN0YW5jZTtcclxuXHR9XHJcblxyXG59LCBfZGVmaW5lUHJvcGVydHkoX3RyaWdvbm9taWNVdGlscywgXCJnZXRBZGphY2VudExlbmd0aFwiLCBmdW5jdGlvbiBnZXRBZGphY2VudExlbmd0aChyYWRpYW5zLCBkaXN0YW5jZSkge1xyXG5cdHJldHVybiBNYXRoLnNpbihyYWRpYW5zKSAqIGRpc3RhbmNlO1xyXG59KSwgX2RlZmluZVByb3BlcnR5KF90cmlnb25vbWljVXRpbHMsIFwiZmluZE5ld1BvaW50XCIsIGZ1bmN0aW9uIGZpbmROZXdQb2ludCh4LCB5LCBhbmdsZSwgZGlzdGFuY2UpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0eDogTWF0aC5jb3MoYW5nbGUpICogZGlzdGFuY2UgKyB4LFxyXG5cdFx0eTogTWF0aC5zaW4oYW5nbGUpICogZGlzdGFuY2UgKyB5XHJcblx0fTtcclxufSksIF9kZWZpbmVQcm9wZXJ0eShfdHJpZ29ub21pY1V0aWxzLCBcImNhbGN1bGF0ZVZlbG9jaXRpZXNcIiwgZnVuY3Rpb24gY2FsY3VsYXRlVmVsb2NpdGllcyh4LCB5LCBhbmdsZSwgaW1wdWxzZSkge1xyXG5cdHZhciBhMiA9IE1hdGguYXRhbjIoTWF0aC5zaW4oYW5nbGUpICogaW1wdWxzZSArIHkgLSB5LCBNYXRoLmNvcyhhbmdsZSkgKiBpbXB1bHNlICsgeCAtIHgpO1xyXG5cdHJldHVybiB7XHJcblx0XHR4VmVsOiBNYXRoLmNvcyhhMikgKiBpbXB1bHNlLFxyXG5cdFx0eVZlbDogTWF0aC5zaW4oYTIpICogaW1wdWxzZVxyXG5cdH07XHJcbn0pLCBfZGVmaW5lUHJvcGVydHkoX3RyaWdvbm9taWNVdGlscywgXCJyYWRpYWxEaXN0cmlidXRpb25cIiwgZnVuY3Rpb24gcmFkaWFsRGlzdHJpYnV0aW9uKGN4LCBjeSwgciwgYSkge1xyXG5cdHJldHVybiB7XHJcblx0XHR4OiBjeCArIHIgKiBNYXRoLmNvcyhhKSxcclxuXHRcdHk6IGN5ICsgciAqIE1hdGguc2luKGEpXHJcblx0fTtcclxufSksIF90cmlnb25vbWljVXRpbHMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMudHJpZ29ub21pY1V0aWxzID0gdHJpZ29ub21pY1V0aWxzOyIsImZ1bmN0aW9uIGdldFZhbHVlKHBhdGgsIG9yaWdpbikge1xyXG4gICAgaWYgKG9yaWdpbiA9PT0gdm9pZCAwIHx8IG9yaWdpbiA9PT0gbnVsbCkgb3JpZ2luID0gc2VsZiA/IHNlbGYgOiB0aGlzO1xyXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykgcGF0aCA9ICcnICsgcGF0aDtcclxuICAgIHZhciBjID0gJycsXHJcbiAgICAgICAgcGMsXHJcbiAgICAgICAgaSA9IDAsXHJcbiAgICAgICAgbiA9IHBhdGgubGVuZ3RoLFxyXG4gICAgICAgIG5hbWUgPSAnJztcclxuICAgIGlmIChuKSB3aGlsZSAoaSA8PSBuKSB7XHJcbiAgICAgICAgKGMgPSBwYXRoW2krK10pID09ICcuJyB8fCBjID09ICdbJyB8fCBjID09ICddJyB8fCBjID09IHZvaWQgMCA/IChuYW1lID8gKG9yaWdpbiA9IG9yaWdpbltuYW1lXSwgbmFtZSA9ICcnKSA6IHBjID09ICcuJyB8fCBwYyA9PSAnWycgfHwgcGMgPT0gJ10nICYmIGMgPT0gJ10nID8gaSA9IG4gKyAyIDogdm9pZCAwLCBwYyA9IGMpIDogbmFtZSArPSBjO1xyXG4gICAgfWlmIChpID09IG4gKyAyKSB0aHJvdyBcIkludmFsaWQgcGF0aDogXCIgKyBwYXRoO1xyXG4gICAgcmV0dXJuIG9yaWdpbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuZ2V0VmFsdWUgPSBnZXRWYWx1ZTsiXX0=
