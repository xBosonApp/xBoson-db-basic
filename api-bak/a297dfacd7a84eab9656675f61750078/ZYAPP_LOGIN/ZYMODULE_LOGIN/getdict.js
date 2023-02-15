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
// getdict
// 前端获取数据字典下拉列表以及数据字典翻转使用
// 参数：
//       typecd : 大分类集合，逗号分隔
//       dt     : 验证时传入，其他情况下可以不传
// 返回结构：
// {result:
//       [
//        {大分类CD或表名:[{id:xx, name:xx名称, text:xx名称(快捷码)}, {...}, {...}]},
//        {...},
//        {...}
//       ]
// }
// var typecd = sys.request.typecd;
// var dt = sys.request.dt;
// if (typecd == null) {
//   sys.setRetData("1");
//   return;
// }
// if(sys.contain(typecd,".")){
    
// }else{
// var retList = sys.getDict(typecd, dt);
// sys.addRetData(retList, "result");
// sys.setRetData("0", "", "result");
// return;
// }
//从数据字典缓存中获取
var typecd = sys.request.typecd;
var orgid = sys.request.orgid;

if(typecd == null){
    sys.setRetData("1");
    return;
}
//orgid为null时，从平台数据字典缓存取 x
if(orgid == null){
    orgid = _ORGID_PLATFORM_; //sys.request.org;
}
//将typecd拆成数组
var typecdArray = sys.split(typecd,",");
//从缓存中获取
var retList = [];
for(t in typecdArray) {
  if(t != ""){
    var tmpList, tmpMap = {};
    try {
      tmpList = se.getCache(_CACHE_REGION_MDM_, orgid+":"+t);
    } catch(e) {
      sys.printValue("ERR: "+ e.message);
    }
      
    if (!tmpList) {
      tmpList = getFromDB(t);
    }
    
    if(tmpList != null){
      map.put(tmpMap, t, tmpList);
      list.add(retList, tmpMap);
    }
  }
}
sys.addRetData(retList, "result");
sys.setRetData("0", "", "result");


function getFromDB(typecd) {
  var s = "SELECT "
+"    dictcd id,"
+"    dictnm name,"
+"    version,"
+"    CONCAT(dictnm, '(', IFNULL(shortkey, ''), ')') text "
+" FROM "
+"    "+ orgid +".sys_mdm002 t2"
+" WHERE "
+"    t2.version = (SELECT "
+"            version "
+"        FROM "
+"            "+ orgid +".sys_mdm001 t1 "
+"        WHERE "
+"            t1.typecd = t2.typecd "
+"		)"
+"		AND t2.typecd = ? ";
	
  sql.query(s, [typecd], "_children");
  var _children = sys.result._children;
  se.setCache(_CACHE_REGION_MDM_, orgid +":"+ typecd, _children, 0);
  return _children;
}