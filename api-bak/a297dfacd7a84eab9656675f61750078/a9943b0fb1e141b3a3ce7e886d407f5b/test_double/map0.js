/**
 *  Copyright 2023 Jing Yanming
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
console.log(">>>> ---------------------------------- Test map Functions.", map);
var assert = require("assert");

assert.eq(1, map.get({a:1}, 'a'), "map.get()");
var map0 = map.put({a:1, b:2}, 'c', 3);
assert.eq(1, map0.a, "map.put");
assert.eq(3, map0.c, "map.put");

var all = map.putAll({a:1, b:2}, {c:3});
assert.eq(3, all.c, "map.putAll");
assert.eq(1, all.a, "map.putAll");

var r = map.remove({a:1, b:2}, "a");
assert(!r.a, 'map.remove');
assert(r.b==2, "map.remove");

assert(map.containsKey({a:1, b:2}, 'a'), "map.containsKey");
assert.eq(2, map.size({a:10, b:20}), "map.size");