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

var data = {
  _id: lib.genid(),
  wx: sys.request.getString("wx"),//wx唯一标识
  tel: sys.request.tel,
  wxnm: sys.request.wxnm, // 微信昵称
  name: sys.request.name, //姓名
  sex: sys.request.sex, //性别
  bdate: sys.request.bdate, //出生日期
  add: sys.request.add, //地址
}

personAdd(data);

sys.put("personid", data._id);
sys.setRetData(0);

function personAdd(data){
  
  coll.insertOne({
    _id:data._id,
    tel: data.tel,
    wx: data.wx,
    wxnm: data.wxnm,
    tag: [],// 标签（默认），用户自定义属性，如：患者、亲属、同事、领导等
    group: [],  // 关系组，支持一对多，按标签分组，如：医生与患者之间的逻辑关系
    name: data.name,
    sex: data.sex,
    bdate: data.bdate,
    add: data.add,
    status: "1", // 状态：SYSX0001='0':无效；'1':有效，默认值：'1'
    createdt: new Date(),
    updatedt: new Date()
  });
}