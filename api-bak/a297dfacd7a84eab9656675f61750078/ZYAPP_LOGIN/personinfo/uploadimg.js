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
//id:uploadimg
//name:上传图片

var openid= sys.request.openid;
var pid=sys.getUserPID(openid);
var image_path = sys.request.image_path;

//判断image_path是否为空.
var sqlSel;
var paramSel=[];
var queryPagingCount;
if(image_path == null){
   sqlSel = "select image_path from sys_userinfo where pid = ? ";
   list.add(paramSel,pid);
   queryPagingCount= sql.query(sqlSel,paramSel,"result");
   sys.setRetData("0","","result");
 }
  else{
   var sql1 = "update sys_userinfo set image_path = ?,updatedt = ? where pid = ?"; 
   paramSel=[image_path,sys.currentTimeString(),pid];
   var updCount = sql.update(sql1,paramSel); 
  if (updCount == 0) {
  sys.setRetData("5");
   return;
    }
    sys.setRetData("0");
  }