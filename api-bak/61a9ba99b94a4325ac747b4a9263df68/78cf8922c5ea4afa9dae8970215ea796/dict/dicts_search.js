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

// 搜索
var keyword = (sys.request.keyword)?sys.request.keyword:"";

var result = type_search(keyword);
  
sys.put("result",result);

sys.setRetData(0, 'ok');

//字典搜索
function type_search(keyword){
  var regex = ".*"+keyword+".*";
   //sys.printValue(regex);
  
  var r = collection.find(
    {
      $or:[
        {"_id.cd": {$regex:regex, $options: "is"}},
        {nm: {$regex:regex, $options: "is"}},
        {mark: {$regex:regex, $options: "is"}},
        {"dict.mark": {$regex:regex, $options: "is"}},
        {"dict.data.cd": {$regex:regex, $options: "is"}},
        {"dict.data.nm": {$regex:regex, $options: "is"}},
        {"dict.data.mark": {$regex:regex, $options: "is"}}
      ]
      
    }
  );
  return r;
}