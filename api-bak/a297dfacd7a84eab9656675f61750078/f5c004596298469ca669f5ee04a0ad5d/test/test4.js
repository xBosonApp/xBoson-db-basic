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

var assert     = require('assert');

var tmp = ["aa"];
// var tmp
// list.add(tmp,"aa");
var tmp2 = {
  aa:456
}


//当r为objec类型时，sys.request里取不到对应的参数值
// for(r in tmp){
//   sys.printValue(r, typeof(r), tmp2[r], sys.request[r], sys.request[r+""]);
  
//   // if(r == "aa"){
//   //   sys.printValue("r == 'aa'",r[0],r[1])
//   // }
// }

// var lowerWhe=sys.toLowerCase(sys.trim(' order by 123'));

// sys.printValue( lowerWhe );

sys.printValue(sys.regexFind("^order\\s+by\\s+","order by 123"));

sys.printValue(sys.regexFind("order by","order by12"));

sys.printValue(sys.regexFind("Java.*", "测试Java测试"));

sys.printValue(sys.regexMatches("Java.*", "Java测试"));

assert(sys.regexFind("^Java.*", "Java测试"), "sys.regexFind");

// for(var r in tmp){
//   var v = tmp[r];
//   sys.printValue(r, v, typeof(v), tmp2[v], sys.request[v]);
// }




sys.setRetData(0, 'Do nothing.');