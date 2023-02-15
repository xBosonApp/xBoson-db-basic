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
// 获取参数
var typecd=sys.request.typecd;
var parentcd=sys.request.parentcd;
var typenm=sys.request.typenm;
var shortkey=sys.request.shortkey;
var standard=sys.request.standard;
var version=sys.request.version;
var status=sys.request.status;
var mark=sys.request.mark;
var dt=sys.currentTimeString();
// 验证参数
if(typecd==null||parentcd==null||typenm==null||standard==null||status==null){
    sys.setRetData("1");
    return;
}
// 快捷码
if(shortkey==null){
    shortkey=sys.pinyinFirstLetter(typenm);
}
// 检查主键是否存在
var chkpk = "select typecd from sys_pl_cd1 where typecd=?";
var count = sql.query(chkpk,[typecd],"chkpk_r");
if(count == 0){
    sys.setRetData("2","类别编码不存在！");
    return;
}
// 检查父类别编码是否存在
count = sql.query(chkpk,[parentcd],"chkpid_r");
if(count == 0 || sys.result.chkpid_r[0].typecd!=parentcd){
    sys.setRetData("2","父类别编码不存在！");
    return;
}
// 执行sql
var sql="update sys_pl_cd1 set parentcd=?,typenm=?,shortkey=?,standard=?,version=?,status=?,mark=?,updatedt=? where typecd=?";
var params=[parentcd,typenm,shortkey,standard,version,status,mark,dt,typecd];
sql.update(sql,params);