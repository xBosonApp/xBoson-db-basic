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
// 获取系统可执行的模型 tree数据结构
var sysid=sys.request.sysid;	//系统ID
if(sysid == null){
  sys.setRetData("1");
  return;
}

// 获取角色的操纵模型
var getSysRoleModel = "select a.typecd,b.dstypecd parentcd,b.modolnm typenm from sys_role_model a,sys_bm002 b where a.roleid in (select c.roleid from sys_system_role c where c.sysid=?) and a.typecd = b.modolcd";
sql.query(getSysRoleModel,[sysid],"SysRoleModel");
var sysRoleModel = sys.result.SysRoleModel;

// 调接口获取数据集tree
var res = http.platformGet({app:'c879dcc94d204d96a98a34e0b7d75676',mod:'outdatasource',api:'getdedstree'});
var dsTree = res["data"].result1;
var result = sys.getRelatedTreeData(dsTree,sysRoleModel,"typecd","parentcd");
sys.printValue(result);
for(r in result){
    if(r.typecd == "DS"){
        map.put(r,"typenm","操纵模型");
    }
}

// 获取角色的多维模型
var getSysRoleModel2 = "select a.typecd,b.parentcd,b.typenm from sys_role_model a,sys_bm001 b where a.roleid in (select c.roleid from sys_system_role c where c.sysid=?) and a.typecd = b.typecd";
sql.query(getSysRoleModel2,[sysid],"SysRoleModel2");
var sysRoleModel2 = sys.result.SysRoleModel2;

// 获取多维业务模型类别tree
var getTree = "select typecd,parentcd,typenm from sys_bm001 where status = '1'";
sql.query(getTree,null,"treeData");
var treeData = sys.result.treeData;
var result2 = sys.getRelatedTreeData(treeData,sysRoleModel2,"typecd","parentcd");
sys.printValue(result2);
for(var i=0,len=sys.size(result2);i<len;i++){
    if(result2[i].typecd == "BM"){
        list.removeAt(result2,i);
        break;
    }
}

// 获取系统角色中应用角色的模型
var h1 = {"typecd":"[[ReleaseModel]]","parentcd":"0","typenm":"应用角色模型","isParent":true};
var getReleaseModel = "select typecd from sys_pl_role_model_release where roleid in (select roleid from sys_system_role where sysid=?)";
sql.query(getReleaseModel,[sysid],"ReleaseModel");
for(r in sys.result.ReleaseModel){
    map.put(r,"parentcd","[[ReleaseModel]]");
    var tmp = se.getCache(_CACHE_REGION_BIZ_MODEL_,r.typecd);
    if (tmp == null) {
      map.put(r,"typenm","-");
    } else {
      map.put(r,"typenm",tmp["name"]);
    }
}
list.add(sys.result.ReleaseModel,h1);

// 获取公共模型
var h2 = {"typecd":"[[PubModel]]","parentcd":"0","typenm":"公共模型","isParent":true};
var getPubModel = "select typecd from sys_pl_pub_model_release";
sql.query(getPubModel,null,"PubModel");
for(r in sys.result.PubModel){
    map.put(r,"parentcd","[[PubModel]]");
    var tmp = se.getCache(_CACHE_REGION_BIZ_MODEL_,r.typecd);
    if (tmp == null) {
      map.put(r,"typenm","-");
    } else {
      map.put(r,"typenm",tmp["name"]);
    }
}
list.add(sys.result.PubModel,h2);

// 合并操纵模型和多维模型Tree数据等
list.addAll(result,result2);
list.addAll(result,sys.result.ReleaseModel);
list.addAll(result,sys.result.PubModel);
sys.addRetData(result,"result");
sys.setRetData("0","","result");