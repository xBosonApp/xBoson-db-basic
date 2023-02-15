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
// var sql_his="select updatedt,mark from sys_pl_application_release_his where applicationid=?  order by updatedt desc";
// var applicationid=sys.request.applicationid;
// sql.query(sql_his,[applicationid],"result");
// var listhis=[];
// var resmap={};
// for(var i=0;i<sys.size(sys.result.result);i++){
//     //结果集取出更新时间截取前十位
//     map.put(sys.result.result[i],"updatedt",sys.subStringTo(sys.result.result[i].updatedt,0,10));
//     //判断resmap这个map中是否有已经截取的相同的更新日期
//     if(map.containsKey(resmap,sys.result.result[i].updatedt)){
//         var _list=[];
//         _list=resmap[sys.result.result[i].updatedt];
//         list.add(_list,sys.result.result[i].mark);
//         // var _mark=resmap[sys.result.result[i].updatedt];
//         // _mark=_mark+"!@"+sys.result.result[i].mark;
//         // map.put(resmap,sys.result.result[i].updatedt,_list);
//     }else{
//         map.put(resmap,sys.result.result[i].updatedt,[sys.result.result[i].mark]);
//     }
//     // var resmap={};
//     // map.put(resmap,"updatedt",sys.result.result[i].updatedt);
//     // var marks=sys.split(sys.result.result[i].mark,"!@");
//     // map.put(resmap,"mark",marks);
//     // list.add(listhis,resmap);
// }
// sys.printValue(resmap);
// for(r in resmap){
//     list.add(listhis,{"updatedt":r.key,"mark":r.value});
// }
// sys.printValue(listhis);

// sys.addRetData(listhis,"hismark");
// sys.setRetData("0","","hismark");





var sql_his="select updatedt,mark from sys_pl_application_release_his where applicationid=?  order by updatedt desc";
var applicationid=sys.request.applicationid;
sql.query(sql_his,[applicationid],"result");
var hismark=[];
for(r in sys.result.result){
    list.add(hismark,{
        "updatedt":sys.subStringTo(r.updatedt,0,19),
        "mark":[r.mark]
    });
}
sys.addRetData(hismark,"hismark");
sys.setRetData("0","","hismark");