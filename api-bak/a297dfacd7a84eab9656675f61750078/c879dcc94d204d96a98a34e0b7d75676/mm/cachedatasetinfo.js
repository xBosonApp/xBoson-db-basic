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
// cachedatasetinfo 缓存数据集完整信息
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
var typecd = sys.request.typecd;
var org = sys.request.org;
if (typecd == null) {
  sys.setRetData("1", "数据集ID未指定");
  return;
}
// 数据集
sql.query("select * from sys_md_mm001 where typecd=? and status='1'",[typecd],"sys_md_mm001");
if(sys.size(sys.result["sys_md_mm001"]) > 0){
  // 数据集模型结构 存储数据集字段定义
  sql.query("select * from sys_md_mm002 where typecd=? and status='1'",[typecd],"sys_md_mm002");
  // 用户物理表映射 存储数据集对应在不同数据源的物理表信息及映射
  sql.query("select * from sys_md_mm003 where typecd=? and status='1'",[typecd],"sys_md_mm003");
  // 表索引信息 存储数据集定义的索引（不含主键）
  sql.query("select * from sys_md_mm004 where typecd=? and status='1'",[typecd],"sys_md_mm004");
  // 数据集物理表画面
  sql.query("select * from sys_md_mm005 where typecd=?",[typecd],"sys_md_mm005");
  sys.setRetList(sys.result["sys_md_mm001"],sys.result["sys_md_mm002"],[["typecd", "typecd"]], "fields");
  sys.setRetList(sys.result["sys_md_mm001"],sys.result["sys_md_mm003"],[["typecd", "typecd"]], "tables");
  sys.setRetList(sys.result["sys_md_mm001"],sys.result["sys_md_mm004"],[["typecd", "typecd"]], "indexs");
  sys.setRetList(sys.result["sys_md_mm001"],sys.result["sys_md_mm005"],[["typecd", "typecd"]], "uis");

  se.setCache(_CACHE_REGION_DATASET_, org + ":" + typecd, sys.result["sys_md_mm001"][0], 0); 
} else {
  se.delCache(_CACHE_REGION_DATASET_, org + ":" + typecd);
}
sys.setRetData("0");