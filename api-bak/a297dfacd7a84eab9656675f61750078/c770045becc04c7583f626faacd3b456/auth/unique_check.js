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
var typecd = sys.request.typecd;    // 模型ID
if(typecd==null){
    sys.setRetData("1");
    return;
}
var isUnique = true;
// 获取初始化DB的机构
var initOrg = se.getCache(_CACHE_REGION_TENANT_,_CACHE_KEY_INIT_ORG_);

// 循环机构，查看typecd是否存在
var count = 0;
for(r in initOrg){
    var sql_bm001 = "select typecd from "+r+".sys_bm001 where typecd=?";
    var sql_bm002 = "select modolcd from "+r+".sys_bm002 where modolcd=?";
    try{
        count = se.query(sql_bm001,[typecd],"check_r");
        if(count != 0){
            isUnique = false;
            break;
        }
        count = se.query(sql_bm002,[typecd],"check_r");
        if(count != 0){
            isUnique = false;
            break;
        }
    }catch(e){}
}
sys.addRetData([{"isUnique":isUnique}],"result");
sys.setRetData("0","","result","re");