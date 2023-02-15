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
var pid = sys.getUserPID(sys.request.openid);
var pageid =sys.request.pageid;

var sqlmod = " select pid, pageid,domid, modid, optdata, createdt FROM sys_user_html WHERE pageid = ?";

sql.query(sqlmod, [pageid], "mods");

sys.setRetData("0","","mods");