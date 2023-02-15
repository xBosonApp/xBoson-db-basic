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

var mongodb = require('mongodb');
var client = mongodb.connect("mongodb://localhost");
var dbs = client.dbs();
sys.addRetData(dbs, "dbs");

var db = client.db("local");
sys.addRetData(db.all(), "db.local.all");

var coll = db.collection('startup_log');
var findall = coll.find();
sys.addRetData(coll.count(), "db.local.count()");
sys.addRetData(findall, "startup_log.find()");

var findx = coll.find({_id	:	'jym-PC-1514958286201'});
sys.addRetData(findx, "startup_log.find({...})");

sys.setRetData(0, 'Do nothing1.', 
  "dbs", 
  "db.local.all", 
  "db.local.count()",
  "startup_log.find()", 
  "startup_log.find({...})");