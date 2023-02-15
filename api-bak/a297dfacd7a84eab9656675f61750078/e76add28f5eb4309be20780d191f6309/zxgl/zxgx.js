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
var zxbh = sys.request.zxbh;
var zxbt = sys.request.title;
var zxzy = sys.request.info;
var xgtp = sys.request.xgtp;
var gxrq = sql.currentDBTimeString();
var zxnr = sys.request.content;
var xgsp = sys.request.xgsp;
var zxlx = sys.request.type;
var params = [zxbt,zxzy,xgtp,gxrq,zxnr,xgsp,zxlx,zxbh];
var sqls = "update zsyl_zxgl set zxbt = ?, zxzy = ?, xgtp = ?, gxrq = ?, zxnr = ?, xgsp = ?, zxlx = ? where zxbh = ?";
var count = sql.update(sqls,params);
if(count == 0){
  sys.setRetData(5);
  return;
}
sys.setRetData("0","资讯更新成功");