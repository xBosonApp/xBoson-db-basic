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
//name: 修改一条datatable状态
//id: setdtstatus

var datatable = sys.request.datatable;

if(datatable == null){
    sys.setRetData("1");
    return;
}
if(datatable == "sys_md_mm001"){
    var typecd = sys.request.typecd;
    var status = sys.request.status;
    if(typecd == null || status == null){
        sys.setRetData("1");
        return;
    }
    var sqlUpd = "update sys_md_mm001 set status=? where typecd=?";
    var cnt = sql.update(sqlUpd, [status, typecd]);
    if(cnt == 1){
      //操作数据集日志
      http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});
      sys.setRetData("0");
      return;
    }else{
      sys.setRetData("2");
      return;
    }
}
else if(datatable == "sys_md_mm003"){
    var typecd = sys.request.typecd;
    var did = sys.request.did;
    var en = sys.request.en;
    var status = sys.request.status;
    if(typecd == null || did == null || en == null||status == null){
        sys.setRetData("1");
        return;
    }
    var sqlUpd = "update sys_md_mm003 set status=? where typecd=? and did=? and en=?";
    var cnt = sql.update(sqlUpd, [status, typecd, did,en]);
    if(cnt == 1){
      //操作数据集日志
      http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});
      sys.setRetData("0");
      return;
    }else{
      sys.setRetData("2");
      return;
    }
}else if(datatable == "sys_md_mm004"){
    var typecd = sys.request.typecd;
    var did = sys.request.did;
    var en = sys.request.en;
    var status = sys.request.status;
    if(typecd == null || did == null || en == null || status == null){
        sys.setRetData("1");
        return;
    }
    var sqlUpd = "update sys_md_mm004 set status=? where typecd=? and did=? and en=?";
    var cnt = sql.update(sqlUpd, [status, typecd, did, en]);
    if(cnt == 1){
      //操作数据集日志
      http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});

      sys.setRetData("0");
      return;
    }else{
      sys.setRetData("2");
      return;
    }
}