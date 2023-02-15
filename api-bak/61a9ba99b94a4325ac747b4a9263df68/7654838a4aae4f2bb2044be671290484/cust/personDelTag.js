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

var lib = require("./lib");

var coll = lib.open("person");

// 从wx登录用户session里获取信息
var session = lib.getSession(sys.request, cache);

if(!session){
  sys.ret(1,"获取不到用户session");
  return;
}
if(!session.personid){
  sys.ret(1,"获取不到用户session中的personid，请重新登录");
  return;
}
var personid = session.personid;
var tag = sys.request.getString("tag");

var result = deleteTag(personid, tag);

sys.put("result",result);

sys.setRetData(0);


function deleteTag(personid, tag){
  
  if(!personid || !tag){
    return;
  }
  
  var r = coll.find({_id:personid});
  
  if(r.length == 0) return;
  
  var person = r[0];
  
  // 不存在标签时
  if(!person.tag) return;
  
  // var isFind = false;
  // person.tag.forEach(function(){
    
  // });
  var i = person.tag.indexOf(tag);
  if(i<0) return;
  
  // 删除标签
  person.tag.splice(i,1);
  
  // 删除group中的人员标签
  if(!person.group) return;
  person.group.forEach(function(v){
    if(!v.tag) return;
    var index = v.tag.indexOf(tag);
    if(index<0) return;
    v.tag.splice(index,1);
  });
  
  // 更新到数据库
  var r_update = coll.updateOne(
    {_id: personid},
    {
      $set: {
        tag: person.tag,
        group: person.group
      }
    }
  );
  //返回 匹配文档数量和更新数量
  return {
    matched: r_update.getMatchedCount(),
    modified: r_update.isModifiedCountAvailable() ? r_update.getModifiedCount() : 0
  }
}