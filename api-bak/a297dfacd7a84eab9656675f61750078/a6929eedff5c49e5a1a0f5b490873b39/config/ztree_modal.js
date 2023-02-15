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
//获取图表专用模型
//
var typecds = [];

var end_flag = false;
  var tmp_typecd = "BM.MDDM";
  while(!end_flag){
    var _types = [];
    //获取目录
    var tmp_sqls = "select typecd from sys_bm001 where url is null and parentcd in ('"+tmp_typecd+"')";
    sql.query(tmp_sqls,[],"typecd");
    for(var d in sys.result.typecd){
      list.add(_types,d.typecd);
      list.add(typecds,d.typecd);
    }
    tmp_typecd = list.toString(_types,"','");
    if(sys.size(_types)==0){
      end_flag = true;
    }
  }
  
var typesstr = list.toString(typecds,"','");
//获取分支下所有目录
var sqlstr = "select a.typecd,a.parentcd,a.typenm,a.shortkey,a.standard,a.datatable,a.url uri,"
+" a.version,a.status,a.mark,a.createdt,a.updatedt,'1' isparent,'0' bm003,'0' bm004 "
+" from sys_bm001 a where typecd in ('"+typesstr+"')";
sql.query(sqlstr,[],"all");
var array = sys.result.all;
//图表专用
sqlstr = " select a.typecd,a.parentcd,a.typenm,a.shortkey,a.standard,a.datatable,"
+"a.url uri,a.version,a.status,a.mark,a.createdt,a.updatedt,"
//+"(select count(*) from sys_bm001 b where b.parentcd=a.typecd) isparent,"
+"'0' isparent,"
+"(select count(*) from sys_bm003 where typecd=a.typecd) bm003,"
+"(select count(*) from sys_bm004 where typecd=a.typecd) bm004 "
+"from sys_bm001 a,sys_bm003 b where a.typecd = b.typecd and b.onlychart='1' ";

sql.query(sqlstr,[],"tmp");
var tmpArr = sys.result.tmp;
list.addAll(array,tmpArr);
sys.addRetData(array,"result");
sys.setRetData("0","","result");