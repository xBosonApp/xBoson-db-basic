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
var dt=sys.request.dt;  //日期点
var dt_from =sys.request.dt_from;   //开始日期
var dt_to=sys.request.dt_to;    //结束日期
var instanceid=sys.request.instanceid;    //节点ID

if(dt != null){
    var res = http.platformGet({"app":"bf1d70edb9d6463d968a175ce7a6fd3a","mod":"etl_statistics","api":"node"},{"dt":dt,"instanceid":instanceid});
    var result = res["data"].data;
    var result2 = [];
    // 是否指定节点ID
    if(instanceid != null){
        for(r in result){
            if(r.instanceid == instanceid){
                list.add(result2,r);
            }
        }
    }else{
        result2 = result;
    }
    // 获取处理总数，成功总数，失败总数
    var p = 0, s=0, f=0;
    for(r in result2){
        p=p+sys.parseInt(r.processedcnt);
        s=s+sys.parseInt(r.successedcnt);
        f=f+sys.parseInt(r.failedcnt);
    }
    // 列的描述
    var type = [
        {
            "en":"instancenm",
            "cn":"节点",
            "view":"1",
            "chart":""
        },
        // {
        //     "en":"jobcnt",
        //     "cn":"作业量",
        //     "view":"1",
        //     "chart":"bar"
        // },
        // {
        //     "en":"runningcnt",
        //     "cn":"执行次数",
        //     "view":"1",
        //     "chart":"bar"
        // },
        {
            "en":"processedcnt",
            "cn":"处理数",
            "view":"1",
            "chart":"bar",
            "stack":""
        },
        {
            "en":"successedcnt",
            "cn":"成功数",
            "view":"1",
            "chart":"bar",
            "stack":"成功数失败数"
        },
        {
            "en":"failedcnt",
            "cn":"失败数",
            "view":"1",
            "chart":"bar",
            "stack":"成功数失败数"
        },
        {
            "en":"instanceid",
            "cn":"节点ID",
            "view":"0",
            "chart":""
        }
    ];
    sys.addRetData({"p":p,"s":s,"f":f},"count");
    sys.addRetData(type,"type");
    sys.addRetData(result2,"data");
    sys.setRetData("0","","data","type","count");
}else if(dt_from != null && dt_to != null){
    var res = http.platformGet({"app":"bf1d70edb9d6463d968a175ce7a6fd3a","mod":"etl_statistics","api":"node"},{"dt_from":dt_from,"dt_to":dt_to});
    var result = res["data"].data;
    var result2 = [];
    // 是否指定节点ID
    if(instanceid != null){
        for(r in result){
            if(r.instanceid == instanceid){
                list.add(result2,r);
            }
        }    
    }else{
        for(r in result){
            var find = false;
            for(r2 in result2){
                if(r2.dt == r.dt){
                    find = true;
                    map.put(r2,"processedcnt",sys.parseInt(r.processedcnt)+r2.processedcnt);
                    map.put(r2,"successedcnt",sys.parseInt(r.successedcnt)+r2.successedcnt);
                    map.put(r2,"failedcnt",sys.parseInt(r.failedcnt)+r2.failedcnt);
                    break;
                }
            }
            if(!find){
                list.add(result2,{
                    "dt":r.dt,
                    "processedcnt":sys.parseInt(r.processedcnt),
                    "successedcnt":sys.parseInt(r.successedcnt),
                    "failedcnt":sys.parseInt(r.failedcnt)
                });
            }
        }
    }
    // 获取处理总数，成功总数，失败总数
    var p = 0, s=0, f=0;
    for(r in result2){
        p=p+sys.parseInt(r.processedcnt);
        s=s+sys.parseInt(r.successedcnt);
        f=f+sys.parseInt(r.failedcnt);
    }
    var type=[
        {
            "en":"dt",
            "cn":"日期",
            "view":"1",
            "chart":""
        },
        {
            "en":"processedcnt",
            "cn":"处理数",
            "view":"1",
            "chart":"bar",
            "stack":""
        },
        {
            "en":"successedcnt",
            "cn":"成功数",
            "view":"1",
            "chart":"bar",
            "stack":"成功数失败数"
        },
        {
            "en":"failedcnt",
            "cn":"失败数",
            "view":"1",
            "chart":"bar",
            "stack":"成功数失败数"
        }
    ];
    sys.addRetData(type,"type");
    sys.addRetData({"p":p,"s":s,"f":f},"count");
    sys.addRetData(result2,"data");
    sys.setRetData("0","","data","type","count");
}else{
    sys.setRetData("1");
}