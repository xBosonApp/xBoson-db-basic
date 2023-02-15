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
var a = ['a'];

var ret = {};
for(v in a) {
  ret[v.key] = v+'';
  // js 引擎不能正确处理 js 的 String 对象作为索引
  ret['req_'+ v.key] = sys.request[v];
  ret['type_'+ v.key] = typeof v;
}

sys.request['fdsafsadf'];
sys.put("data", ret);
sys.setRetData(0, 'Do nothing.');