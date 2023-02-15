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
//id:updnode
//name:修改类别节点

var typecd=sys.request.typecd;
var parentcd=sys.request.parentcd;
var typenm=sys.request.typenm;
var shortkey=sys.request.shortkey;
var standard=sys.request.standard;
var datatable=sys.request.datatable;
var url=sys.request.url;
var version=sys.request.version;
var status=sys.request.status;
var mark=sys.request.mark;
var updatedt=sys.currentTimeString();

if(typecd==null || parentcd==null || typenm==null || standard==null || status==null){
    sys.setRetData("1");
    return;
}
//判断parentcd是否存在
var cnt = sql.query("select typecd from sys_bm001 where typecd=?",[parentcd],"chk_parentcd");
if(cnt==0){
    sys.setRetData("2","父类别编码不存在！");
    return;
}

var sql="update sys_bm001 set status=?,mark=?,updatedt=?,parentcd=?,typenm=?,shortkey=?,standard=?,datatable=?,url=?,version=? where typecd=?";
//生成快捷码
if(shortkey==null){
    shortkey=sys.getPinyinFirstLetter(typenm);
}
var params=[status,mark,updatedt,parentcd,typenm,shortkey,standard,datatable,url,version,typecd];


sql.update(sql,params);
var data={"typecd":typecd,"parentcd":parentcd,"typenm":typenm,"datatable":datatable,"uri":url};
sys.addRetData(data,"data");
sys.setRetData("0","","data");