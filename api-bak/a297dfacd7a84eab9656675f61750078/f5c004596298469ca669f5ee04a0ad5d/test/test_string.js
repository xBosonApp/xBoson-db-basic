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
var a = '1';
a.toString = function() {
  return 'a';
}

var b = new String('2');
b.toString = function() {
  return 'b';
}

var c = {a:'aa right', b:'bb right', 1:'bad 1', 2:'bad 2'};

sys.put('a', c[a]);
sys.put('b', c[b]);
sys.put('getUserPID', sys.getUserPID());
sys.put('getUserIdByPID', sys.getUserIdByPID());
sys.setRetData(0, 'Do nothing.'+b);