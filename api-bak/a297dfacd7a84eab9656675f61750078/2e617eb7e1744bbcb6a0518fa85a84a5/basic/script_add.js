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
var iot = require("iot").open();

var new_sc = {
  _id       : sys.request.getString("_id", 1),
  desc      : sys.request.desc || '',
  owner     : sys.getUserIdByOpenId(),
  share     : lib.getShare(sys.request.share),
  code      : null,
  cd        : new Date(),
  md        : new Date(),
};
iot.encrypt(new_sc, lib.defScript());

lib.open("script").insert(new_sc);

sys.setRetData(0);