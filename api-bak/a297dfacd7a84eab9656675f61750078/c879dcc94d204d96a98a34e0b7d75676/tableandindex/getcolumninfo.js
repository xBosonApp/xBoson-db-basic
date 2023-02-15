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
//id:getcolumninfo
//name:获取指定表列信息

var typecd = sys.request.typecd;
var flag = sys.request.flag;    //添加还是修改

if(typecd == null){
    sys.setRetData("1");
    return;
}

//获取列名
var getTitle = "select sys_md_mm002.en,sys_md_mm002.cn,sys_md_mm002.mk,sys_md_mm002.must,sys_mdm003.datatype,sys_mdm003.numrange,sys_mdm003.dict from sys_md_mm002,sys_mdm003 where sys_md_mm002.decd=sys_mdm003.decd and sys_md_mm002.typecd=? and sys_md_mm002.status='1' order by sys_md_mm002.sorting";
sql.query(getTitle,[typecd],"type");
var type = sys.result.type;
for(r in type){
    if(flag == "u"){
        //修改时，主键为只读
        if(r.mk == "1"){
            map.put(r,"ro","1");
        }else{
            map.put(r,"ro","0");
        }
    }else{
        map.put(r,"ro","0");
    }
    
    map.put(r,"view","1");
    // map.put(r,"search","0");
    if(r.dict!=""){
        map.put(r,"elemtype", "select2_radio");
    }else{
        map.put(r,"elemtype", "text");
    }
}
sys.setRetData("0","","type");