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

var lib = require('./lib');

var collection = lib.open("dicts");

var result = collection.find({},{
  
  "dict.data": 0
  
});

// var result = collection.find({});



// if(result.length === 0){
  
//   result = [
//     {
//       "_id": {
//         "cd": "0",
//         "parentcd": "0"
//       },
//       nm:"值域代码",
//       status: "1"
//     }
//   ];
  
//   collection.insert(result);
  
// }

//数据格式转换(Tree)
dataTrans(result);

sys.put("result",result);
sys.setRetData(0);

//数据格式转换(Tree)
function dataTrans(result){
  
  for(var i in result){
    var r = result[i];
    r.cd = r._id.cd;
    r.parentcd = r._id.parentcd;
    // r.nodenm = r.nm;
    // r.shownm = r.nm;
  }
  
}