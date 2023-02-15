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
//id:getdscolumns
//name:获取数据集模型列信息

// 参数 方式1
var did = sys.request.did;  //数据源ID
var table_name = sys.request.table_name;  //表名

//参数 方式2
var typecd = sys.request.typecd;    //数据集ID

var flag = 1;   //参数方式
if(did != null && table_name != null){
    flag = 1;
}else if(typecd != null){
    flag = 2;
}else{
    sys.printValue(sys.request);
    sys.setRetData("1");
    return;
}

if(flag == 1){
    var sel = "select c.en table_name,a.en,a.cn,a.mk,a.must,b.datatype,b.numrange from sys_md_mm002 a, sys_mdm003 b, sys_md_mm003 c where c.did = ? and c.en=? and a.typecd=c.typecd and a.decd = b.decd and a.status='1' and b.status='1' and  c.status='1' order by a.sorting";
    sql.query(sel,[did,table_name]);
}
else if(flag == 2){
    var sel = "select a.en,a.cn,a.mk,a.must,b.datatype,b.numrange from sys_md_mm002 a, sys_mdm003 b where a.typecd=? and a.decd = b.decd and a.status='1' and b.status='1' order by a.sorting";
    sql.query(sel,[typecd]);
}

sys.setRetData("0","","result");