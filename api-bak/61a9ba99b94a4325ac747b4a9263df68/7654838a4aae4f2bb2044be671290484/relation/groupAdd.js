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
"use strict";

var lib = require("../cust/lib");


var coll = lib.open("person");

var relationColl = lib.open("relation");

var session = lib.getSession(sys.request, cache);

if(!session){
  sys.ret(1,"获取不到用户session");
  return;
}

sys.printValue(session);

// post json数据
var reqJson = sys.requestJson;

if(!reqJson.token){
  sys.ret(1,"缺少token参数");
  return;
}

// 获取另一个人session
var anotherPerson = lib.getSessionByToken(reqJson.token, cache);
if(!anotherPerson){
  sys.ret(1,"获取不到用户session！token:"+reqJson.token);
  return;
}


sys.printValue(anotherPerson);
// sys.printValue(a);

if(!session.personid || !anotherPerson.personid){
  sys.ret(1,"用户会话中获取不到personid，请重新登录！");
  return;
}

// 判断是否是同一个人
if(session.personid == anotherPerson.personid){
  sys.ret(1,"无法添加自己！");
  return;
}

var data = {
  
  // tenantId: sys.request.tenantId,//租户id
  
  // wx : sys.request.getString("wx"),   //wxid
  // wxnm : sys.request.getString("wxnm"),
  
  // wx2 : sys.request.getString("wx2"),
  // wxnm2 : sys.request.getString("wxnm2")
  personid1 : session.personid,
  personid2 : anotherPerson.personid,
  mark: reqJson.mark, // 为第二个人设置的备注
  tag: reqJson.tag  //为第二个人设置的标签
  
  // personid1 : sys.request.personid1,
  // personid2 : sys.request.personid2
}

var result = addRelations(data);

if(result == 1){
  sys.ret(2,"已经是好友");
  return;
}

// 返回好友personid
sys.put("personid",anotherPerson.personid);
sys.setRetData(0);



function addRelations(data){
  
  var cnt = coll.count({
    _id: data.personid1,
    "group.personid": data.personid2
  });
  
  if(cnt == 0){
    coll.updateOne(
      {
        _id: data.personid1
      },
      {
        $push: {
          group: {
            personid: data.personid2,
            mark: data.mark,  // 备注
            tag: data.tag // 标签
          }
        }
      }
    );
  }else{
    return 1; // 已经是好友
  }
  
  cnt = coll.count({
    _id: data.personid2,
    "group.personid": data.personid1
  });
  
  if(cnt == 0){
    coll.updateOne(
      {
        _id: data.personid2
      },
      {
        $push: {
          group: {
            personid: data.personid1,
            mark: "来自被扫码添加"
          }
        }
      }
    );
  }
  
  
  var tenantId = getTenantByPersonid(data.personid1);
  
  // 如果有租户ID，则将wx2添加到relation表
  if(tenantId){
    
    // 查询personid2是否已在租户存在
    var cnt = relationColl.count({
      "group.personid": data.personid2
    });
    
    if(cnt==0){
    
      relationColl.updateOne(
        {
          _id: tenantId
        },
        {
          $push: {
            group: {
              personid: data.personid2
            }
          }
        }
      );
    }
    
  }
  
}

// 根据personid获取租户id
function getTenantByPersonid(personid){
  // /78cf8922c5ea4afa9dae8970215ea796/tenant/orgGet
  var ret = http.platformGet(
    {app:"78cf8922c5ea4afa9dae8970215ea796",mod:"tenant",api:"orgGet"},
    {personid: personid});
  // 被调用的 API 返回的数据，JSON 结构	
  var data = ret.data;
  if(data.result && data.result[0]){
    return data.result[0]._id;
  }else{
    sys.printValue(personid+":不是租户成员");
  }
}