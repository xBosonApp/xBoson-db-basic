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
var pagesize=sys.request.pagesize;
var pagenum=sys.request.pagenum;
if(typecd==null||pagesize==null||pagenum==null){
    sys.setRetData("1");
    return;
}
var sql="select * from sys_mdm003 where typecd=? and status='1'";
sql.queryPaging(sql,[typecd],pagenum,pagesize);

sys.setRetData("0","","result");