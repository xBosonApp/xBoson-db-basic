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
var org = sys.request.org;
var typecd = sys.request.typecd;  //模型编码
var did = sys.request.did;      //数据源id
var en = sys.request.en;        //要创建的表英文名称

//验证参数
if(typecd==null || did == null || en == null){
    sys.setRetData("1");
    return;
}

sql.update("delete from sys_md_mm003 where typecd=? and did=? and en=?",[typecd,did,en]);
//操作数据集日志
http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});
sys.setRetData("0");

//调接口删除操纵模型
var res=http.platformGet({
    "app":"c770045becc04c7583f626faacd3b456",
    "mod":"dmlm",
    "api":"delbm002_bytable"
  },{
    "did":did,
    "table_name":en
  });
if(res.data.ret!="0"){
    sys.setRetData("2","删除操纵模型失败!"+res.data.msg);
    return;
}