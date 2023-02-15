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
//id:gettablepk
//name:获取表主键
var org = sys.request.org;
var typecd = sys.request.typecd;
var did = sys.request.did;
var en = sys.request.en;

//验证参数
if(typecd == null || did == null || en == null){
    sys.setRetData("1");
    return;
}
//根据typecd查询sys_md_mm002获取表的主键
var getfields = "select en from sys_md_mm002 where typecd = ? and mk = '1'";
var getfields_cnt = sql.query(getfields,[typecd]);
if(getfields_cnt == 0){
    sys.setRetData("2","数据异常，物理表没有主键，不可删除数据");
    return;
}
sys.setRetData("0","","result");