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
  //测试URI：http://192.168.7.225:8088/ds/api/settype?app=d2c8511b47714faba5c71506a5029d94&mod//=DataDict&org=a297dfacd7a84eab9656675f61750078&openid=B8C9BC769810A9D324523B7059F15B7EB6B438F4E//EF9A3D622E61A3351CF2D34&s=d&mdk=b415405bd63947a3aa9eccf6607dd496&userkeylocal=e08bdb531504480c8//b42987bed4bf2af&orgtype=v&parentcd=0&typenm=王莹莹测试&standard=01&status=1&typecd=444444444444//44444&
  //接口名称：更改字典类型
  //功能说明：更改字典类型或字典项
  //接口URL： settype

// HTTP 请求参数
var org=sys.request.org;
var _typecd = sys.request._typecd;
var _datatable = sys.request._datatable;
var typecd = sys.request.typecd;
var parentcd = sys.request.parentcd;
var typenm = sys.request.typenm;
var shortkey = sys.request.shortkey;
var standard = sys.request.standard;
var datatable = sys.request.datatable;
var version = sys.request.version;
var mark = sys.request.mark;
var url = sys.request.url;
var status = sys.request.status;
var dt = sys.getCurrentTimeString();//获取当前时间

//判断数据库中不允许为空的字段
if(_typecd==null || typecd==null||parentcd==null||typenm==null||standard==null||status==null){
    sys.setRetData("1");
    return;
}
// typecd是否存在
var getsk="select typecd,parentcd,typenm,shortkey,standard,datatable,url,version,status,mark from sys_mdm001 where typecd=?";
var count_sk=sql.query(getsk,[typecd],"oldR");
var oldR = sys.result.oldR;
//判断主键是否修改
// if(typecd != _typecd && count_sk>0){
// //检查修改的主键是否存在
//     sys.setRetData("2","主键-模型编码（typecd）已存在");
//     return;
// }
if(count_sk==0){
    sys.setRetData("2","类别编码不存在！");
    return;
}
//判断shortkey是否重新生成
if(oldR[0].shortkey == shortkey || shortkey==null ){
    shortkey = sys.getPinyinFirstLetter(typenm);        
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
//   if(sys.contain(typecd,".") && typecd!=_typecd){
//       sys.setRetData("1","","类别编码不可包含'.'");
//       return;
//   }
//如果修改了datatable,则判断
// if(datatable == null && _datatable == null){
// }else{
//     if(datatable != _datatable && _datatable != null){
//         var sqlc = "select typecd from "+_datatable+" where typecd =?";
//         try{
//             var sqlc_cnt = sql.query(sqlc,[_typecd], "sqlc");
//             if(sqlc_cnt > 0){
//                 sys.setRetData("2",_datatable+"表里对应的typecd有数据！");
//                 return;
//             }
//         }catch(error){
//             //_datatable表不存在时，抛异常
//             // sys.setRetData("2",_datatable+"表不存在！");  
//             // return;
//         }
//     }
// }
//检查parentcd是否存在
if(parentcd!="0"){
    if(sql.query("select 1 from sys_mdm001 where typecd=?",[parentcd],"checkR")==0){
        sys.setRetData("2","父类别编码不存在！");
        return;
    }
}
var sql="update sys_mdm001 set parentcd=?,typenm=?,shortkey=?,standard=?,datatable=?,version=?,mark=?,status=?,updatedt=?,url=? where typecd=?";
var params=[parentcd,typenm,shortkey,standard,datatable,version,mark,status,dt,url,typecd];
//修改主键
// if(typecd!=_typecd){
//     sql="update sys_mdm001 set typecd=?,parentcd=?,typenm=?,shortkey=?,standard=?,datatable=?,version=?,mark=?,status=?,updatedt=?,url=? where typecd=?";
//     params=[typecd,parentcd,typenm,shortkey,standard,datatable,version,mark,status,dt,url,_typecd];
// }
var count=sql.update(sql,params,"1");
if (count == 0) {
  sys.setRetData("5");
  return;
}
//...同时修改datatable链接的表
// if(typecd != _typecd){
//     try{
//         var sqld="update "+_datatable+" set typecd = ? where typecd=?";
//         sql.update(sqld,[typecd,_typecd]);
//     }catch(error){
//         //_datatable不存在时，会抛异常
//     }
// }
//记录日志
var before_json={
    "typecd":oldR[0].typecd,
    "parentcd":oldR[0].parentcd,
    "typenm":oldR[0].typenm,
    "shortkey":oldR[0].shortkey,
    "standard":oldR[0].standard,
    "datatable":oldR[0].datatable,
    "url":oldR[0].url,
    "version":oldR[0].version,
    "status":oldR[0].status,
    "mark":oldR[0].mark
};
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
//操作类型
var operation_type="00102";
if(before_json.version!=(after_json.version==null?"":after_json.version)){
    operation_type="00104";
}
//操作详细
var change_fields=[];
if(before_json.parentcd!=(parentcd==null?"":parentcd)){
    list.add(change_fields,"parentcd");
}
if(before_json.typenm!=(typenm==null?"":typenm)){
    list.add(change_fields,"typenm");
}
if(before_json.shortkey!=(shortkey==null?"":shortkey)){
    list.add(change_fields,"shortkey");
}
if(before_json.standard!=(standard==null?"":standard)){
    list.add(change_fields,"standard");
}
if(before_json.datatable!=(datatable==null?"":datatable)){
    list.add(change_fields,"datatable");
}
if(before_json.url!=(url==null?"":url)){
    list.add(change_fields,"url");
}
if(before_json.version!=(version==null?"":version)){
    list.add(change_fields,"version");
}
if(before_json.status!=(status==null?"":status)){
    list.add(change_fields,"status");
}
if(before_json.mark!=(mark==null?"":mark)){
    list.add(change_fields,"mark");
}
if(sys.size(change_fields)==0){
    sql.rollback();
    sys.setRetData("无修改字段");
    return;
}
sql.commit();
var log_res = http.platformPost({"app":"d2c8511b47714faba5c71506a5029d94","mod":"operation_log","api":"record_log"},{
    "typecd":typecd,
    "operation_type":operation_type,
    "before_json":sys.jsonFromInstance(before_json),
    "after_json":sys.jsonFromInstance(after_json)
});
if(log_res.data.ret!="0"){
    sys.setRetData(log_res.data.ret,"记录日志异常---"+log_res.data.msg);
    sys.printValue(log_res);
    return;
}
//更新平台数据字典缓存
var _sql = se.getCache(_CACHE_REGION_SYS_SQL_, "dict0008");
sql.query(_sql, [typecd,version], "_children");
var _children = sys.result._children;
se.setCache(_CACHE_REGION_MDM_, org+":"+typecd, _children, 0);
//更新sys_mdm002
// var mdm002 = "select dictcd from sys_mdm002 where typecd = ?";
// var cnt_002 = sql.query(mdm002,[typecd],"cnt_002");
// if(cnt_002>0){
//     var sql2 = "update sys_mdm002 set status=? where typecd=?";
//     var params2 = [status, typecd];
//     sql.update(sql2,params2);
// }
//返回数据，更新节点
// var boolean=false;
// if(datatable == null || sys.trim(datatable) == ""){
//     boolean=true;
// }
var data = {"typenm":typenm,"shownm":typecd+"("+datatable+")","typecd":typecd,"datatable":datatable,"uri":url,"version":version};
map.put(sys.result,"data",data);
sys.setRetData("0","","data");