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
var apiid = sys.request.apiid;
   var apinm = sys.request.apinm;

   var kpinm = sys.request.kpinm;
   var kpiunit  = sys.request.kpiunit;
   var createdt  = sys.request.createdt;
   var updatedt  = sys.request.updatedt;
   var nextapiid = sys.request.nextapiid;
  
   var gpdate ="";
   var whereorand=" WHERE ";
   if(null!=apiid)       
   {
       var delstr = "delete from sys_drilldown_api where apiid=?";
       
       sql.update(delstr,[apiid],"1");//事务开启
       
       var savesql = "Insert into sys_drilldown_api(apiid, apinm, kpinm, kpiunit, createdt, updatedt, nextapiid)  values( ？，？，？，？，？，？，？ )" ;
       var paramIns = [apiid,apinm,kpinm,kpiunit,createdt,updatedt,nextapiid];
      
       var upcount = sql.update(savesql,paramIns,"1");
       if(upcount>0){
            sql.commit();//提交事务
       }else{
           sql.rollback();//回滚事务
       }
       sys.setRetData("0");
   }