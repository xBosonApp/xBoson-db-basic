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

var lib = require("./lib");
var data = {
  _id       : lib.genid(),
  owner     : sys.getUserIdByOpenId(),
  share     : lib.getShare(sys.request.share),
  name      : sys.request.getString('name', 2),
  desc      : sys.request.desc || '',
  cd        : new Date(),
  md        : new Date(),
};

lib.open("scenes").insert(data);

sys.setRetData(0);