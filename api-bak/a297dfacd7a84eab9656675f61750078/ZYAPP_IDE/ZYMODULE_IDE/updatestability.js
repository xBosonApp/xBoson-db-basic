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
//id:updatestability
//name:API 内容稳定性字段更新

//获取必要参数

var contentid=sys.request.contentid;
var stability=sys.request.stability;

if(contentid==null){
    sys.setRetData("1");
    return;
}
//检查stability值范围
var _tmp = se.getCache(_CACHE_REGION_MDM_, _ORGID_PLATFORM_+":ZR.0031");
if(_tmp==null){
    sys.setRetData("2","获取缓存异常");
    return;
}
var _boolean = false;
for(r in _tmp){
    if(r.id == stability){
        _boolean = true;
        break;
    }
}
if(!_boolean){
    sys.setRetData("2");
    return;
}
var sql_up="update sys_api_content set stability=? where contentid=?";
var param=[stability, contentid];
var cnt=sql.update(sql_up,param);
if(cnt==0){
    sys.setRetData("2");
    return;
}else{
    sys.setRetData("0");
}