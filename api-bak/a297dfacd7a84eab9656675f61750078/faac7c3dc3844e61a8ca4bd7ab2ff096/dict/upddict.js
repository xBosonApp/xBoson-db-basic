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
// 参数
var typecd=sys.request.typecd;
var version=sys.request.version;
var dictcd=sys.request.dictcd;
var dictnm=sys.request.dictnm;
var shortkey=sys.request.shortkey;
var status=sys.request.status;
var mark=sys.request.mark;
var _version=sys.request._version;
var _dictcd=sys.request._dictcd;

var dt=sys.currentTimeString();

// 验证参数
if(typecd==null||version==null||dictcd==null||dictnm==null||status==null||_version==null||_dictcd==null){
    sys.setRetData("1");
    return;
}
// shortkey
if(shortkey==null){
    shortkey=sys.pinyinFirstLetter(dictnm);
}
// 原主键是否存在
var chksql = "select typecd from sys_pl_cd2 where typecd=? and version=? and dictcd=?";
var count = sql.query(chksql,[typecd,_version,_dictcd],"chkpk_r");
if(count == 0){
    sys.setRetData("2","此条记录已不存在！");
    return;
}
//修改了主键，则判断主键是否重复
if(dictcd!=_dictcd||version!=_version){
    count = sql.query(chksql,[typecd,version,dictcd],"chkpk_r");
    if(count > 0){
        sys.setRetData("2","主键重复！");
        return;
    }
}

// 执行sql
var sql="update sys_pl_cd2 set version=?,dictcd=?,dictnm=?,shortkey=?,status=?,mark=?,updatedt=? where typecd=? and version=? and dictcd=?";
var params=[version,dictcd,dictnm,shortkey,status,mark,dt,typecd,_version,_dictcd];
sql.update(sql,params);

sys.setRetData("0");