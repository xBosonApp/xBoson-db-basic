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
sys.authorization('api.opc.manager.functions()');

var desc = sys.request.getString('desc', 1, 555);
var host = sys.request.getString('host', 1, 25);
var user = sys.request.getString('user', 1, 25);
var pass = sys.request.getString('pass', 1, 25);
var sche = sys.request.getString('schema', 0, 255);
var sql  = sys.request.getString('sql', 1, 9999);
var pric = sys.request.getString('primary_column', 1, 255);
var valc = sys.request.getString('val_column', 1, 255);

var lib = require('../server/lib');
var cli = lib.createClient(desc);

lib.setConn(cli.clientid, {
  host : host,
  user : user,
  pass : pass,
  schema : sche,
  sql  : sql,
});

lib.opendb().collection('item').updateOne(
  {_id:cli.clientid},
  { 
    $set: {
      meta:[], 
      data:[], 
      primary_column: pric,
      val_column: valc,
      mapping: {},
    }
  },
  {upsert: true});

sys.setRetData(0);