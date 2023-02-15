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
// 数据集缓存结构说明
// region:org:typecd
// {
//   typecd:DS.SYS.04.05
//   typenm:用户组
//   shortkey:
//   其他字段:
//   fields:[
//           {
//             decd:SYS01.00.005.00
//             en:ugid
//             cn:
//             mk:
//             must:
//             其他字段:
//           },{},{}
//         ]
//   tables:[
//           {
//             did:00000000000000000000000000000000
//             en:sys_ug
//             cn:
//             其他字段:
//           },{},{}
//         ]
//   indexs:[
//           {
//             en:sys_ug
//             cn:
//             fields:
//             其他字段:
//           },{},{}
//         ]
//     uis:[
//           {
//             did:00000000000000000000000000000000
//             en:sys_ug
//             field:
//             其他字段:
//           },{},{}
//         ]
// }
se.delCache(_CACHE_REGION_DATASET_);

// 使用单独连接避免替换 Schema
sql.connection("00000000000000000000000000000000");

//已初始化db的机构
var orgs=se.getCache(_CACHE_REGION_TENANT_,_CACHE_KEY_INIT_ORG_);

for(org in orgs){
  // 数据集
  sql.query("select * from "+org+".sys_md_mm001 where status='1'",null,"sys_md_mm001");
  // 数据集模型结构 存储数据集字段定义
  sql.query("select * from "+org+".sys_md_mm002 where status='1'",null,"sys_md_mm002");
  // 用户物理表映射 存储数据集对应在不同数据源的物理表信息及映射
  sql.query("select * from "+org+".sys_md_mm003 where status='1'",null,"sys_md_mm003");
  // 表索引信息 存储数据集定义的索引（不含主键）
  sql.query("select * from "+org+".sys_md_mm004 where status='1'",null,"sys_md_mm004");
  // 数据集物理表画面
  sql.query("select * from "+org+".sys_md_mm005",null,"sys_md_mm005");
  sys.setRetList(sys.result["sys_md_mm001"],sys.result["sys_md_mm002"],[["typecd", "typecd"]], "fields");
  sys.setRetList(sys.result["sys_md_mm001"],sys.result["sys_md_mm003"],[["typecd", "typecd"]], "tables");
  sys.setRetList(sys.result["sys_md_mm001"],sys.result["sys_md_mm004"],[["typecd", "typecd"]], "indexs");
  sys.setRetList(sys.result["sys_md_mm001"],sys.result["sys_md_mm005"],[["typecd", "typecd"]], "uis");

  for(row in sys.result["sys_md_mm001"]){
    se.setCache(_CACHE_REGION_DATASET_, org + ":" + row["typecd"], row, 0); 
  }
}

se.setCache(_CACHE_REGION_DATASET_, _CACHE_KEY_READY_, true, 0);