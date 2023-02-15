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
var start = date.currentTimeMillis();

var _i = 10000;
var _j = 100;

var i = _i; // 
var j = _j;
while (j>0) {
  while (i>0) {
    //sys.randomNumber(6);
    --i;
  }
  --j;
  i = _i;
}

var end = date.currentTimeMillis();
var elapsedMillis = end - start;


sys.addRetData(elapsedMillis + " ms", "result");
sys.addRetData("循环了" + (_j*_i), "count");
sys.setRetData("0", "use Time", "result", "count");