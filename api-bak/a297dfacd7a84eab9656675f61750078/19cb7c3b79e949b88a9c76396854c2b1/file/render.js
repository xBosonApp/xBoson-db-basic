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
var structdefine = require("./_structdefine");
var plib = require("path");
var version = '0.1';

module.exports = {
  render        : render,
  createStruct  : structdefine.createStruct,
  version       : version,
};


// 引用脚本中的另一个变量
function Variable(v) {
  this.v = v+'';
}


Variable.prototype.toString = function() {
  return this.v;
}


// 返回一个不渲染对象
function Skip() {}


function Target(file, struct) {
  if (!file) {
    throw new Error("parameter file is null");
  }
  if (!struct) {
    throw new Error("parameter struct is null");
  }
  this.code = [];
  this.file = file;
  this.struct = struct;
}


Target.prototype.toString = function() {
  return this.code.join('');
}

// html 注释, 没有转译
Target.prototype.hc = function(str) {
  this.code.push('<!-- ', str, ' -->\n');
}


Target.prototype.tag = function(name, attrFunc, bodyFunc) {
  this.code.push('\n<', name);
  attrFunc && attrFunc();
  this.code.push('>');
  bodyFunc && bodyFunc();
  this.code.push('\n</', name, '>');
}


Target.prototype.classMap = function(map) {
  var keys = Object.keys(map);
  if (keys.length > 0) {
    this.code.push(' class="');
    
    var ss = this.struct.root.styles;
    for (var i=0; i<keys.length; ++i) {
      if (map[keys[i]]) {
        var styl = ss[keys[i]];
        if (styl && styl.prefix == '.') {
          this.code.push(' ', keys[i]);
        }
      }
    }
    
    this.code.push('"');
  }
}


Target.prototype.attr = function(name, val, _skipNull) {
  if (_skipNull && val !== 0 && (!val)) 
    return;
  
  if (typeof name == 'function') {
    this.code.push(' ');
    name(this.code);
  } else {
    this.code.push(' ', name);
  }
  
  if (val !== undefined) {
    this._attr_val(val);
  }
}


Target.prototype._attr_val = function(val) {
  if (val === null) {
    this.code.push("='null'");
    return;
  }
  if (val === undefined) {
    this.code.push("='undefined'");
    return;
  }
  
  var t = typeof val;
  
  if (t == 'string') {
    var dq = val.indexOf('"') >= 0;
    var sq = val.indexOf("'") >= 0;
    
    if (dq && sq) {
      throw new Error("Tag attribute value cannot has single quotes and double quotes");
    } else if (sq) {
      this.code.push('="', val, '"');
    } else {
      this.code.push("='", val, "'");    
    }
    return;
  }
  
  if (t == 'number' || t == 'boolean') {
    this.code.push("='", val, "'");  
    return;
  }
  
  this.code.push("='", JSON.stringify(val), "'");
}


Target.prototype.styleAttr = function(m) {
  if (Object.keys(m).length > 0) {
    this.code.push(" style='");
    this.styleVal(m);
    this.code.push("'");
  }
}


Target.prototype.namedStyle = function(name, val) {
  if (Object.keys(val).length > 0) {
    this.code.push('\n', name, '{');
    this.styleVal(val);
    this.code.push('}');
  }
}


Target.prototype.styleVal = function(m) {
  for (var n in m) {
    this.code.push(n, ':', m[n], ';');
  }
}


// 所有文本转义为 html 可显示字符
Target.prototype.text = function(s) {
  for (var i=0; i<s.length; ++i) {
    switch (s[i]) {
      case '"': this.code.push('&#34;'); break;
      case '&': this.code.push('&#38;'); break;
      case '<': this.code.push('&#60;'); break;
      case '>': this.code.push('&#62;'); break;
      case ' ': this.code.push('&#160;'); break;
      default:
        this.code.push(s[i]);
        break;
    }
  }
}


Target.prototype.funcParam = function(v) {
  var t = this;
  if (v === null) {
    t.p('null');
  }
  else if (v === undefined) {
    t.p('undefined');
  }
  else if (typeof v == 'number') {
    t.p(v);
  }
  else if (v.constructor == Variable) {
    t.p(v);
  }
  else if (v.constructor == Skip) {
    return false;
  }
  else if (typeof v == 'function') {
    return v();
  }
  else {
    t.p(JSON.stringify(v));
  }
  return true;
} 


Target.prototype.addPlugin = function(name, path) {
  if (path.endsWith('.vue')) {
    this.p("\nVue.component('", name, "', require('", path, "', 1,1));");
  } else if (path.endsWith('.js')) {
    this.p("\nrequire('", path, "');");
  } else {
    throw new Error("unknow plugin file "+ path);
  }
}


Target.prototype.scope = function(name, fn, _end) {
  if (name) {
    this.p('\n', name, '{');
  } else {
    this.p('{');
  }
  fn();
  this.p('\n}', _end||',');
}


// 压入原始字符串
Target.prototype.p = function() {
  this.code.push.apply(this.code, arguments);
}


Target.prototype.pop = function() {
  return this.code.pop();
}


function callFunction(pc) {
  if (!pc.ref) return null;
  
  var NULL = "null";
  var c = [pc.ref, '(',];
  
  if (pc.callParams && pc.callParams.length) {
    for (var i = 0; i<pc.callParams.length; ++i) {
      var p = pc.callParams[i];
      switch (p.t) {
        case 0:
          c.push(p.v || NULL, ',');
          break;
        case 1:
          c.push('"', p.v, '"', ',');
        default:
          throw new Error("Invalid argument type "+ p.t);
      }
    }
    c.pop();
  }
  c.push(')');
  return c.join('');
}


function addAttribute(t, k, v, pc) {
  var dynk = k.startsWith('v-') ? k : ':'+k;
  
  switch (pc.varType) {
    case 'constant':
      if (pc.isExprAttr) {
        t.attr(dynk, v, true);
      } else {
        t.attr(k, v, true);
      }
      break;
      
    case 'function':
    case 'variable':
      t.attr(dynk, pc.ref, true);
      break;
      
    case 'call':
      t.attr(dynk, callFunction(pc), true);
      break;
      
    case 'expr':
      t.attr(dynk, pc.expr, true);
      break;
      
    default:
      throw new Error("unknow property varType when type is 'attribute' "+ k);
  }
}


function addEvent(t, k, tc) {
  var pc = tc.propsConfig[k];
  var name_fn = vueAttrName('@', k, pc.modifiers);
  
  switch (pc.varType) {
    case 'function':
    case 'variable':
      t.attr(name_fn, pc.ref, true);
      break;
      
    case 'call':
      t.attr(name_fn, callFunction(pc), true);
      break;
      
    case 'expr':
      t.attr(name_fn, pc.expr, true);
      break;
      
    default:
      throw new Error("Bad property varType "+ pc.varType+" when type is 'event' "+ k);
  }
}


function bindSpecial(t, k, tc) {
  if (!tc) return;
  var pc = tc.propsConfig;
  
  switch (pc.varType) {
    case 'constant':
      t.attr(k, tc.value, true);
      break;
      
    case 'function':
    case 'variable':
      t.attr(k, pc.ref, true);
      break;
      
    case 'call':
      t.attr(k, callFunction(pc), true);
      break;
      
    case 'expr':
      t.attr(k, pc.expr, true);
      break;
      
    default:
      throw new Error("unknow property varType "+ k);
  }
}


function bindSlot(t, slot) {
  if (!slot) return;
  if (!slot.propsConfig.isExprAttr) return;
  
  t.p(' v-slot');
  var slotName = slot.propsConfig.ref;
  if (slotName) {
    t.p(':', slotName);
  }
  
  if (slot.value) {
    t._attr_val(slot.value);
  }
}


function attrModifiers(out, modifiers) {
  for (var i=0; i<modifiers.length; ++i) {
    var m = modifiers[i];
    if (m) {
      if (m[0] != '.') out.push('.');
      out.push(m);
    }
  }
}


function vueAttrName(type, name, modifiers) {
  return function(o) { 
    o.push(type, name);
    if (modifiers) {
      attrModifiers(o, modifiers);
    }
  };
}


function renderTemplate(file, struct, t) {
  t.tag('template', null, function() {
    if (struct.list.length > 1) {
      t.tag('div', null, function() {
        struct.list.forEach(createTag);
      });
    } else {
      struct.list.forEach(createTag);
    }
  });
    
  function createTag(tc, i) {
    t.tag(tc.component, _attr, _body);
    
    function vsAttr(k) {
      var vs = tc.vspecial[k];
      if (vs) {
        addAttribute(t, k, vs.value, vs.propsConfig);
      }
    }
    
    function _attr() {
      if (tc.vspecial) {
        bindSpecial(t, 'v-if',  tc.vspecial['v-if']);
        bindSpecial(t, 'v-for', tc.vspecial['v-for']);
        bindSlot(t, tc.vspecial['v-slot']);
        vsAttr('key');
        vsAttr('ref');
        vsAttr('is');
      }
      
      for (var k in tc.props) {
        var pc = tc.propsConfig[k];
        // 如果组件设计器加入新属性, 使用先前版本设计器
        // 实例化的组件会缺少属性配置.
        if (pc) {
          if (pc.type == 'attribute') {
            addAttribute(t, k, tc.props[k], pc);
          } 
          else if (pc.type == 'event') {
            addEvent(t, k, tc);
          }
          else if (pc.type == 'design') {
            // 忽略为设计器提供参数的属性
          }
          else {
            throw new Error("unknow property config type "+ pc.type);
          }
        }
      }
      
      if (tc.props.style) {
        t.styleAttr(tc.props.style);
      }
      
      if (tc.bindStyle) {
        t.classMap(tc.bindStyle);
      }
    }
    
    function _body() {
      if (!tc.removeTxt) {
        t.text(tc.txt);
      }
      if (tc.isContainer) {
        tc.props.nestedList.forEach(createTag);
      }
    }
  }
}


function defineVar(t, n, vcfg) {
  t.p(n, ':');
    
  if (vcfg.def) {
    switch (vcfg.type) {
      case 'Number':
        t.p(Number(vcfg.def), ',');
        break;
        
      case 'String':
        t.p(JSON.stringify(vcfg.def), ',');
        break;
        
      case 'Object':
        t.p(vcfg.def, ',');
        break;
        
      case 'Array':
        t.p(vcfg.def, ',');
        break;
        
      case 'Date':
        t.p('new Date("', vcfg.dev, '"),');
        break;
        
      case 'Boolean':
        t.p(Boolean(vcfg.def), ',');
        break;
        
      default:
        throw new Error("unknow var type "+ vcfg.type +": "+ vcfg.def);
    }
  } 
  else {
    t.p('null,');
  }
}


function processCode(c) {
  var sp = c.split("\n");
  
  for (var i=0; i<sp.length;) {
    var s = sp[i].trim();
    
    if ((!s) || (s[0] == '/' && s[1] == '/')) {
      // sp[i] = null;
      sp.splice(i, 1);
      continue;
    }
    ++i;
  }
  return sp.join('\n');
}


function defineFunc(t, n, f) {
  t.p(n, '(');
  if (f.params.length) {
    for (var i=0; i<f.params.length; ++i) {
      t.p(f.params[i].pn, ',');
    }
    t.pop();
  }
  t.p(')');
  
  t.scope(null, function() {
    switch (f.type) {
      case 'code':
        t.p(processCode(f.code));
        break;
        
      case 'inner':
        t.p(getInnerFunctionCode(f.innerRef));
        break;
        
      default:
        throw new Error("unknow function type "+ f.type);
    }
  });
}


function defineProp(t, n, p) {
  t.scope(n +':', function() {
    t.p('type:',      p.type, ',');
    t.p('required:',  p.required == true, ',');
    t.p('name:',      JSON.stringify(p.name), ',');
    defineVar(t, 'default', p);
  });
}


function defineComputeProp(t, n, cp) {
  t.scope(n +':', function() {
    t.p('get( ) {', processCode(cp.gcode), '},');
    t.p('set(v) {', processCode(cp.scode), '}');
  });
}


function defineWatch(t, n, w) {
  t.scope('"'+ n +'": function(nv, ov)', function() {
    t.p(processCode(w.code));
  });
}


function defineLoadComponent(t, k, path) {
  t.p('\n"', k, '":');
  if (path.endsWith('.vue')) {
    t.p(" require('", path, "', 1,1),");
  } else {
    throw new Error("Unknow component file "+ path);
  }
}


function callList(t, list) {
  list && list.forEach(function(n) {
    if (n) t.p('this.', n, '();');
  });
}


function buildRequire(t, root) {
  var namemap = {};
  
  for (var path in root.requires) {
    if ((!path) || (!root.requires[path])) continue;
    var c = 0;
    var name = plib.basename(path);
    var fname = name;
    
    while (namemap[fname]) fname = name + (c++);
    namemap[fname] = true;
    
    t.p('"', fname, '" : require("', path, '"),');
  }
}


function renderScript(file, struct, t) {
  var root = struct.root;
  
  t.tag('script', null, function() {
    t.scope("const _cl_requires = ", function() {
      buildRequire(t, root);
    }, ';');
    
    t.scope('export default', function() {
      
      t.scope('props:', function() {
        for (var n in root.argProps) {
          defineProp(t, n, root.argProps[n]);
        }
      });
      
      t.scope('computed:', function() {
        for (var n in root.computeProps) {
          defineComputeProp(t, n, root.computeProps[n]);
        }
      });
      
      t.scope('watch:', function() {
        for (var n in root.watchs) {
          defineWatch(t, n, root.watchs[n]);
        }
      });
      
      t.scope('data()', function() {
        // t.p("let _up = ()=>{ this.$nextTick(this.$forceUpdate); };");
        t.scope('return', function() {
          t.p('requires: _cl_requires,');
          
          for (var n in root.vars) {
            defineVar(t, n, root.vars[n]);
          }
        }, ';');
      });

      t.scope('methods:', function() {
        for (var n in root.funcs) {
          defineFunc(t, n, root.funcs[n]);
        }  
      });
      
      t.scope('components:', function() {
        for (var n in root.plugins) {
          defineLoadComponent(t, n, root.plugins[n]);
        }
      });
      
      t.scope('mounted()', function() {
        callList(t, root.mounted);
      });
      
      t.scope('beforeDestroy()', function() {
        callList(t, root.beforeDestroy);
      });
      
    }, ' ');
  });
}


function renderStyle(file, struct, t) {
  t.tag('style', function() {
    t.attr('scoped');
  }, function() {
    for (var n in struct.root.styles) {
      var sc = struct.root.styles[n];
      t.namedStyle(sc.prefix + n, sc.val);
    }  
  });
}


function renderTitle(t) {
  t.hc('这是 xboson 低代码平台自动生成的文件, 勿手动编辑')
  t.hc('Automatic('+ version +') generated at '+ new Date().toLocaleString());
  t.hc('http://xboson.net');
}


function render(file, struct) {
  var t = new Target(file, struct);
  renderTitle(t);
  renderTemplate(file, struct, t);
  renderScript(file, struct, t);
  renderStyle(file, struct, t);
  return t.toString();
}