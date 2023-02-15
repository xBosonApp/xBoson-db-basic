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
var _id     = sys.request.getString('_id', 1, 255);
var prjid   = sys.request.getString('prjid', 1, 255);
var clid    = sys.request.getString('clid', 1, 99);
var name    = sys.request.getString('name', 1, 99);
var desc    = sys.request.getString('desc', 1, 99);
var type    = sys.request.getInteger('type', false, 1, 20);
var def     = sys.request['def'] || null;
var canDyn  = sys.request.isTrue('canDynamic');
var compt   = sys.request.component || null;
var select  = sys.request.select;
var cprops  = sys.request.cprops;
var pctype  = sys.request.getString('pctype', 1, 99);
var isExprA = sys.request.isTrue('isExprAttr');

var lib = require("../prjmgr/lib");
var prj = lib.checkprj(sys, prjid);
var regcoll = lib.opendb().collection('_register');
var reg = require("./reg");

if (! reg.hasClibModifyAuth(regcoll, clid, prjid)) {
  sys.setRetData(1, '无权修改该组件库');
  return;
}

if (!lib.attrNameCheck.test(name)) {
  sys.setRetData(1, "属性名格式无效");
  return;
}

if (type == 3 && select == null) {
  sys.setRetData(1, "未给下拉列表设置有效选项");
  return;
}

if (type == 7 && compt == null) {
  sys.setRetData(1, "自定义插件模式, 未设置组件");
  return;
}

if ((type == 8 && pctype != 'event') || (pctype == 'event' && type != 8)) {
  sys.setRetData(1, "事件绑定模式与类型索引不匹配");
  return;
}


var s = {};
s['props.'+ name] = {
  // 属性描述
  desc : desc,
  // 配置属性的表单类型
  type : type,
  // type==3 下拉列表
  select : select ? JSON.parse(select) : {},
  // 属性默认值
  def : parseDef(),
  // pctype==‘attribute’ 时, 允许动态属性
  canDynamic : canDyn,
  // type==7 自定义插件
  component : compt,
  // 自定义插件的参数
  props : cprops ? JSON.parse(cprops) : {},
  
  // 属性附加选项 (只设置必要属性, 其他用默认值, 示例属性不列出)
  propsConfig : {
    // "design": 设计时属性, 不渲染
    // "event": type==8 事件属性
    // "attribute": 普通属性
    type : pctype,
    // 'constant' 静态值使用动态属性渲染
    isExprAttr : isExprA,
  }
};

var u = regcoll.updateOne({
  _id  : _id,
  type : 'component-bind',
}, {
  $set: s,
}, { upsert:true });

if (u.getModifiedCount()) {
  sys.setRetData(0, '属性已经设置');
} else if (u.getMatchedCount()) {
  sys.setRetData(0, '没有改变');
} else {
  sys.setRetData(1, '属性更新失败');
}


function parseDef() {
  if (def) {
    switch (type) {
    case 2: 
      return Number(def);
    }
  }
  return def;
}