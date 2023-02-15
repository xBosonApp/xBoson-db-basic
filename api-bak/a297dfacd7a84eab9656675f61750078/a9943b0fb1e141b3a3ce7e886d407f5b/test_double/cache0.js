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
console.log(">>>> ----------------- Test cache Functions.", cache);
var assert = require("assert");

var d = [["a"], ["b"], sys.randomString(10)];
cache.set("regionName", "keyName", d);
var v = cache.get("regionName", "keyName");

assert.deepEqual(d, v, "set/get");
console.log(JSON.stringify(v));
console.log("cache ok");

cache.del("regionName", "keyName");
var n = cache.get("regionName", "keyName");
assert(n == null, "del");
console.log("NULL", n);


cache.set("regionName", "k1", 1);
cache.set("regionName", "k2", 2);
cache.delAll("regionName", ['k1', 'k2']);
assert(cache.get("regionName", "k1")==null, "delAll");
assert(cache.get("regionName", "k1")==null, "delAll");


console.log("cache model ok");