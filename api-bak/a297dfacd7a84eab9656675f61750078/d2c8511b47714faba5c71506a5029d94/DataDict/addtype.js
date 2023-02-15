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
//接口编写人：王莹莹
  //测试URI：http://192.168.7.225:8088/ds/api/addtype?app=d2c8511b47714faba5c71506a5029d94&mod//=DataDict&org=a297dfacd7a84eab9656675f61750078&openid=B8C9BC769810A9D324523B7059F15B7EB6B438F4E//EF9A3D622E61A3351CF2D34&s=d&mdk=b415405bd63947a3aa9eccf6607dd496&userkeylocal=e08bdb531504480c8//b42987bed4bf2af&orgtype=v&typecd=2222222&parentcd=0&typenm=测试&standard=02&status=1
  //接口名称：添加字典类型
  //功能说明：添加字典类型或字典项
  //接口URL： addtype

  // HTTP 请求参数
  var org=sys.request.org;
  var typecd = sys.request.typecd;
  var parentcd = sys.request.parentcd;
  var typenm = sys.request.typenm;
  var shortkey = sys.request.shortkey;
  var standard = sys.request.standard;
  var datatable = sys.request.datatable;
  var version = sys.request.version;
  var url = sys.request.url;
  var mark = sys.request.mark;
  var status = sys.request.status;

  //插入sys_mdm001表
if (typecd == null || typenm == null || parentcd == null || standard ==null|| status==null) {
    sys.setRetData("1");
    return;
}
  
  //typecd不允许以0开头
  if(typecd=="0"){
      sys.setRetData("1","","类别编码不能为0");
      return;
  }
  //typecd不允许为ZR
  if(typecd=="ZR"){
      sys.setRetData("1","","类别编码不能为ZR");
      return;
  }
  //typecd不允许存在除ZR.  GBT.之外的带点的typecd
//   if(sys.contain(typecd,".")){
//       sys.setRetData("1","","类别编码不可包含'.'");
//       return;
//   }
  
  var sqlSelMBT = "SELECT COUNT(*) CNT FROM sys_mdm001 WHERE typecd = ? ";
  var paramSelMBT = [typecd];
  var resultCounta = sql.query(sqlSelMBT,paramSelMBT,"MBT");

  var selResult = sys.result.MBT;
  // var selCount = "";
  // for (r in selResult) {
  //   selCount = r.cnt;
  // }
  // jym fix 2018.5.22
  if (selResult[0].CNT != 0) {//已存在该主键
    sys.setRetData("6");
    return;
  }
  var sqlInsM_B_T1 = "INSERT INTO sys_mdm001 (typecd";
  var sqlInsM_B_T2 = ")VALUES(?";
  var paramIns = [typecd];
  if (typenm != null) {
    sqlInsM_B_T1 = sqlInsM_B_T1 + ",typenm";
    sqlInsM_B_T2 = sqlInsM_B_T2 + ",?";
    @paramIns.add(typenm);
  } 
  if (shortkey == null) {
    shortkey = sys.getPinyinFirstLetter(typenm);
  }
  sqlInsM_B_T1 = sqlInsM_B_T1 + ",shortkey";
  sqlInsM_B_T2 = sqlInsM_B_T2 + ",?";
  @paramIns.add(shortkey);

  if (parentcd != null) {
    sqlInsM_B_T1 = sqlInsM_B_T1 + ",parentcd";
    sqlInsM_B_T2 = sqlInsM_B_T2 +",?";
    @paramIns.add(parentcd);
  }

  if (standard != null) {
    sqlInsM_B_T1 = sqlInsM_B_T1 + ",standard";
    sqlInsM_B_T2 = sqlInsM_B_T2 +",?";
    @paramIns.add(standard);
  }
  if (datatable != null) {
    sqlInsM_B_T1 = sqlInsM_B_T1 + ",datatable";
    sqlInsM_B_T2 = sqlInsM_B_T2 +",?";
    @paramIns.add(datatable);
  }
  if (version != null) {
    sqlInsM_B_T1 = sqlInsM_B_T1 + ",version";
    sqlInsM_B_T2 = sqlInsM_B_T2 +",?";
    @paramIns.add(version);
  }
  if (mark != null) {
    sqlInsM_B_T1 = sqlInsM_B_T1 + ",mark";
    sqlInsM_B_T2 = sqlInsM_B_T2 +",?";
    @paramIns.add(mark);
  }

  if (status != null) {
    sqlInsM_B_T1 = sqlInsM_B_T1 + ",status";
    sqlInsM_B_T2 = sqlInsM_B_T2 +",?";
    @paramIns.add(status);
  }

  sqlInsM_B_T1 = sqlInsM_B_T1 + ",createdt,updatedt,url";
  sqlInsM_B_T2 = sqlInsM_B_T2 +",?,?,?";
  var dt = sys.getCurrentTimeString();
  @paramIns.add(dt);
  @paramIns.add(dt);
  @paramIns.add(url);
  var sqlInsM_B_T = sqlInsM_B_T1 + sqlInsM_B_T2 + ")";
  var insM_B_T =sql.update(sqlInsM_B_T,paramIns);
  if (insM_B_T == 0) {
    sys.setRetData("5");
    return;
  }
//记录日志
var before_json={};
var after_json={
    "typecd":typecd,
    "parentcd":parentcd,
    "typenm":typenm,
    "shortkey":shortkey,
    "standard":standard,
    "datatable":datatable,
    "url":url,
    "version":version,
    "status":status,
    "mark":mark
};
var log_res = http.platformPost({"app":"d2c8511b47714faba5c71506a5029d94","mod":"operation_log","api":"record_log"},{
    "typecd":typecd,
    "operation_type":"00101",
    "before_json":sys.jsonFromInstance(before_json),
    "after_json":sys.jsonFromInstance(after_json)
});
if(log_res.data.ret!="0"){
    sys.setRetData(log_res.data.ret,log_res.data.msg);
    return;
}
//更新平台数据字典缓存
var _sql = se.getCache(_CACHE_REGION_SYS_SQL_, "dict0008");
sql.query(_sql, [typecd,version], "_children");
var _children = sys.result._children;
se.setCache(_CACHE_REGION_MDM_, org+":"+typecd, _children, 0);
  //返回数据，更新节点
// var boolean=false;
// if(datatable == null || sys.trim(datatable) == ""){
//     boolean=true;
// }
var data = {"typenm":typenm,"shownm":typecd+"("+datatable+")","typecd":typecd,"datatable":datatable,"uri": url,"version":version};
map.put(sys.result,"data",data);
sys.setRetData("0","","data");