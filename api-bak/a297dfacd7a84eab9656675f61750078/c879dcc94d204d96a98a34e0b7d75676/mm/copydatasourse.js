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
//name:添加模型分类
//id:addtreedata

//获取参数
var openid = sys.request.openid;
var org = sys.request.org;
var copytypecd = sys.request.copytypecd;
var typecd = sys.request.typecd;
var parentcd = sys.request.parentcd;
var typenm = sys.request.typenm;
var shortkey = sys.request.shortkey;
var standard = sys.request.standard;
var datatable = sys.request.datatable;
var version = sys.request.version;
var status = sys.request.status;
var mark = sys.request.mark;

var userid = sys.getUserIdByOpenId(openid);

//验证必要参数
if(typecd == null || parentcd == null || typenm == null || standard == null || status == null){
    sys.setRetData("1");
    return;
}
if (datatable == "e") datatable=null;
//如果datatable不为空，则验证datatable
if(datatable != null){
    if(datatable == "sys_mdm003" || datatable == "sys_md_mm002"){
    }else{
        sys.setRetData("2","datatable参数错误");
        return;
    }
}

//为shortkey赋值
if (shortkey == null) {
    shortkey = sys.getPinyinFirstLetter(typenm);
}
//验证parentcd是否存在
var checkExist = "select typecd from sys_md_mm001 where typecd=?";
var checkExist_cnt = sql.query(checkExist,[parentcd],"checkexist_r");
if(checkExist_cnt == 0){
    sys.setRetData("2","父类别编码不存在");
    return;
}
//验证是否重复
checkExist_cnt = sql.query(checkExist,[typecd],"checkexist_r1");
if(checkExist_cnt == 1){
    sys.setRetData("2","类别编码已存在");
    return;
}

//当前时间
var dt = sys.currentTimeString();
//sql参数
var params = [typecd, parentcd, typenm, shortkey, standard, datatable, version, status,mark,dt,dt];

var sqlIns = "insert into sys_md_mm001 (typecd, parentcd, typenm, shortkey, standard, datatable, version, status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?)";

var cnt = sql.update(sqlIns, params,"1");

//记录日志
if(datatable!=null){
    var op_type="";
    if(datatable=="sys_mdm003"){
        op_type="00101";    //元数据节点注册
    }else if(datatable=="sys_md_mm002"){
        op_type="00201";    //数据集标准注册
    }
    if(op_type!=""){
        var after_json={
            "typecd":typecd,
            "parentcd":parentcd,
            "typenm":typenm,
            "shortkey":shortkey,
            "standard":standard,
            "datatable":datatable,
            "version":version,
            "status":status,
            "mark":mark
        };
        var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
            "typecd":typecd,
            "operation_type":op_type,
            "before_json":"",
            "after_json":sys.jsonFromInstance(after_json)
        });
        if(log_res.data.ret!="0"){
            sys.setRetData(log_res.data.ret,log_res.data.msg);
            return;
        }
    }
}

if(cnt == 0){
    sys.setRetData("2");
    return;
}else{
  var sql = "select typecd,decd,en,cn,mk,must,dv,sorting,status,mark,createdt,updatedt,elemtype,version from sys_md_mm002 where typecd = ? ";//copytypecd
  sql.query(sql,[copytypecd],"data");
  var insert = "insert into sys_md_mm002(typecd,decd,en,cn,mk,must,dv,sorting,status,mark,createdt,updatedt,elemtype,version) values  (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  params = [];
  for(var d in sys.result.data){
    var p = [typecd,d.decd,d.en,d.cn,d.mk,d.must,d.dv,d.sorting,d.status,d.mark,dt,dt,d.elemtype,d.version];
    list.add(params,p);
  }
  var num=sql.updateBatch(insert, params,"1");
  if(num>0){
    sql.commit();
    //返回数据，更新节点
    var data = {"typenm":typenm,"shownm":typecd+"("+datatable+")","typecd":typecd,"datatable":datatable};
    map.put(sys.result,"data",data);
    //操作数据集日志
    http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});
    sys.setRetData("0","","data");
  } else{
    sql.rollback();
    sys.setRetData("1","数据集复制时出错。");
  }
}