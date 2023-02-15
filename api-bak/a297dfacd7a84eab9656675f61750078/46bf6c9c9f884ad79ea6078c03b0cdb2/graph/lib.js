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
"use strict";

var graph = require("graph");
var sess = 

module.exports = {
  t : t,
};

function t(cql) {
  var sess = open();
  var data = [];
  var r2 = sess.query(cql);
  while (r2.hasNext()) {
    data.push(r2.next());
  } 
  sess.close();
  return data;
}


function open() {
  return graph.connect("bolt://localhost:7687", "neo4j", "magnet-prelude-orbit-mercury-beast-7953");
}