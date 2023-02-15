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

//id:getsqllist
//name:获取sql语句一览
//编写人：陈棋
//测试url：192.168.7.120/ds/api/getsqllist?openid=admin&app=zyapp_sysmgt&mod=sys_sql_mgt&org=zr&s=d&

var sqlId=sys.request.sqlid;
var sql_Desc=sys.request.sql_desc;
var sql_Group=sys.request.sql_group;
var content=sys.request.content;
var pageNum =sys.request.pagenum;
var pageSize = sys.request.pagesize;
var pNDefualt = 1;
var PSDefualt =10;
var sqlPaging="SELECT sqlid,content,sql_desc,sql_group From sys_sqls WHERE 1=1";
var paramSel=[];
if (sqlId != null) {
    sqlPaging = sqlPaging + " AND sqlid LIKE ?";
    @paramSel.add("%" + sqlId + "%");
}
if (sql_Desc != null) {
    sqlPaging = sqlPaging + " AND sql_desc LIKE ?";
    @paramSel.add("%" + sql_Desc + "%");
}
if (content != null) {
    sqlPaging = sqlPaging + " AND content like ?";
    @paramSel.add("%" + content + "%");
}
if (sql_Group != null) {
    sqlPaging = sqlPaging + " AND sql_group = ?";
    @paramSel.add(sql_Group);
}
if (pageNum==null) {
    pageNum = pNDefualt;
}
if (pageSize == null) {
    pageSize = PSDefualt;
}

sql.queryPaging(sqlPaging,paramSel,pageNum,pageSize);
sys.setRetData("0","","result");