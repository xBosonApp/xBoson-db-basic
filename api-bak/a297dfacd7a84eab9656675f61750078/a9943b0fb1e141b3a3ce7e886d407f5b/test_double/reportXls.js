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

var s = "SELECT * FROM mdm_org";
sql.query(s,null,"data");

var temp_filenm = "xls-test.xls";
var _title = [{
  'orgid': "机构ID",
  'de0810013j': '机构名称',
  'create_orgid': '创建机构',
  'create_pid': "创建用户",
  'createdt': "创建时间",
}];
var template_path = "/tmp";
var download_path = "/down";
var filenm=sys.setReportData(temp_filenm,[_title,"data","data"],template_path,download_path);

sys.addRetData(download_path, "download_path");
sys.addRetData(filenm, "filename");
sys.setRetData(0, 'Do nothing.', "download_path", "filename");