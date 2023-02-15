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

var msg  = sys.request.getString('msg', 1, 999);
var id   = sys.request.getString('_id', 1, 32);

var t = require("./lib").openTable();
var ret = t.updateOne({
  _id : parseInt(id)
}, {
  $set : { have_read: true,  },
  $push: { reply: '['+ sys.getUserIdByPID() +','+ date.currentTimeString() +'] '+ msg },
})

sys.put('modifiedCount', ret.modifiedCount);
sys.put('matchedCount', ret.matchedCount);
sys.setRetData(0, '完成');