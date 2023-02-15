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
var url = "http://120.194.140.172:8088/api/v1/auth/login";
var bparm = {"username":"tokentest","password":"123456"};
var h = {"Content-Type":"application/json"};//http.headers();
var tokenRet = http.post(url,bparm,null,"json",h);
sys.put('data', tokenRet.data);
sys.setRetData(0);