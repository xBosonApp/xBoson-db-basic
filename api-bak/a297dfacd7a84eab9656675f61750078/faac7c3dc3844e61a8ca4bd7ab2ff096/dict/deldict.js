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
var typecd=sys.request.typecd;
var version=sys.request.version;
var dictcd=sys.request.dictcd;

if(typecd==null||version==null||dictcd==null){
    sys.setRetData("1");
    return;
}

// 执行sql
var sql="delete from sys_pl_cd2 where typecd=? and version=? and dictcd=?";
var params=[typecd,version,dictcd];
sql.update(sql,params);

sys.setRetData("0");