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

var modeMap = { 'pc':1, 'mobile':1, };

module.exports = {
  genIndexFile    : genIndexFile,
  genAppFileEmpty : genAppFileEmpty,
  genAppFile      : genAppFile,
  genStore        : genStore,
  modeMap         : modeMap,
  genStyle        : genStyle,
};

var storeContent = `
//
// Vuex 初始化选项, 该文件需要手工编辑
//
module.exports = {
  // Vuex store 实例的根 state 对象
  state: {},
  
  // 在 store 上注册 mutation，处理函数总是接受 state 作为第一个参数
  // payload 作为第二个参数
  mutations: {},
  
  // 在 store 上注册 action。处理函数总是接受 context 作为第一个参数，
  // payload 作为第二个参数
  actions: {},
  
  // 在 store 上注册 getter，getter 方法接受以下参数：
  // state,     // 如果在模块中定义则为模块的局部状态
  // getters,   // 等同于 store.getters
  getters: {},
  
  // 包含了子模块的对象，会被合并到 store
  // 如果希望你的模块具有更高的封装度和复用性，
  // 你可以通过添加 namespaced: true 的方式使其成为带命名空间的模块。
  modules: {},
  
  // 一个数组，包含应用在 store 上的插件方法。
  plugins: [],
  
  // 为某个特定的 Vuex 实例打开或关闭 devtools
  // devtools : true,
}`;

var appTemplate = `
<component :is='rootComponent' class='mx'>
<div class='mx animate__animated animate__fadeInDown' v-if='showLogin'>
  <component is='_$_login_page' :title='appName'>
    <div>没有设置登陆页面</div>
  </component>
</div>
<div class='mx animate__animated animate__fadeInDown' :class='{mainf: !doNotShowMainMenu}' v-else>
  <div class='m mx mf' v-if='!doNotShowMainMenu'>
    <sidebar-menu 
      :menu="menu" 
      :theme="theme"
      :width="width"
      :relative='false'
      class='menu'
      @item-click="onJump"
    />
  </div>
  <div class='content-frame m mx'>
    <component is='_$_page_head'></component>
    <router-view></router-view>
  </div>
  
  <x-api org='a297dfacd7a84eab9656675f61750078'
    app='19cb7c3b79e949b88a9c76396854c2b1'
    mod='prjmgr' api='roleslist' 
    @success='setRolesList' />
</div>
</component>`;

var appStyle = `
.mx { height: 100%; }
.mainf { display: grid; grid-template-columns: auto 1fr; }
.content-frame { width: 100%; }
.menu { width: 300px; position: static; }
.m { overflow: auto; }
.mf { border-right: 3px solid #eee; }
`;

var appScript = `
const store = new Vuex.Store(require('./store.js'));
const router = new VueRouter({ routes: jump });

const url = window.URL ? new URL(location.href) : {};
const js = [];
const css = [];
const components = {};
const pretendVue = {
  component(name, plugin) {
    // components[name] = plugin;
    Vue.set(components, name, plugin);
  }
};

let doNotShowMainMenu = url.searchParams && url.searchParams.has('_dnsmm'); 
let notNeedLoginCheck = url.searchParams && url.searchParams.has('_dncl');

importscss.forEach(f=>{
  require(f, 1).then(c=>{
    css.push(c);
  }).catch(err=>{
    xv.popError("加载样式", err);
  });
});

importsjs.forEach(f=>{
  try {
    var lib = require(f);
    lib.install(pretendVue);
    js.push(lib);
  } catch(err) {
    xv.popError("加载脚本", err);
  }
});

if (!loginPage) loginPage = 'cdn/xboson-vue/1.0.0/x-login-page.vue';
components['_$_login_page'] = require(loginPage, 1, 1);

if (!headPage) headPage = 'cdn/xboson-vue/1.0.0/x-null.vue';
components['_$_page_head'] = require(headPage, 1, 1);
 
export default {
  store, router, components,
  
  data() {
    return {
      showLogin : false,
      requires  : { js, css },
      width     : '300px',
      menu      : [],
      roles     : {},
      theme,
      appName,
      rootComponent,
      doNotShowMainMenu,
      notNeedLoginCheck,
    };
  },
  
  mounted() {
    if (!notNeedLoginCheck) {
      this.checkLogin();
    }
  },
  
  methods: {
    onJump(e, item, node) {
      console.debug('link', this.$route.name, this.$route.path, item.href);
      if (item.href && item.href.logout) {
        this.logout();
      }
    },
    
    setRolesList(v) {
      v.roles.forEach(i=>{
        this.roles[i.id] = i.name;
      });
      
      this.filterMenu(menu);
      this.menu = menu;
    },
    
    filterMenu(a) {
      for (let i=0; i<a.length; ++i) {
        let m = a[i];
        if (this.blockAuth(m.roles)) {
          a.splice(i, 1);
          --i;
          console.debug("Remove no auth menu", m.title);
          continue;
        }
        if (m.isContainer) {
          this.filterMenu(m.child);
        }
      }
    },
    
    blockAuth(r) {
      if (!r) return false;
      if (r.length <= 0) return false;
      
      for (let i=0; i<r.length; ++i) {
        if (this.roles[r[i]]) return false;
      }
      return true;
    },
    
    checkLogin() {
      this.$globalBus.on('x-login', ()=>{
        this.showLogin = true;
      });
      this.$globalBus.on('x-login-success', ()=>{
        this.showLogin = false;
      });
      this.$globalBus.on('x-logout', this.logout);
    },
    
    logout() {
      let over = ()=>this.$globalBus.emit('x-login');
      this.$xapi(xv.ctx_prefix +'/user/logout', {}).then(over).catch(over);
    },
  },
}`;


function genIndexFile() {
  var out = genHeader([]);
  out.push('<vue:app>');
  out.push('<vue:xboson/>');
  out.push('<link rel="stylesheet" type="text/css" href="app-style.css"/>');
  out.push('</vue:app>');
  return out.join('');
}


function genAppFileEmpty() {
  var out = genHeader([]);
  return out.join("");
}


function genHeader(out) {
  out.push("<!-- Create By xBoson System -->\n");
  out.push("<!-- http://xboson.net -->\n");
  out.push("<!-- ", new Date(), " -->\n");
  out.vars = {};
  return out;
}


function genStore() {
  var out = genHeader([]);
  out.push(storeContent);
  return out.join('');
}


function genStyle() {
  return '/* xBoson system .. app style */';
}


function genAppFile(opt) {
  var o = genHeader([]);
  o.push('<template>');
  o.push(appTemplate);
  o.push('</template>');
  
  o.push('<style scoped>');
  o.push(appStyle);
  o.push('</style>');
  
  o.push('<script>');
  genScriptConfig(o, opt);
  o.push(appScript);
  o.push('</script>');
  return o.join('');
}


function defvar(o, name, data, type) {
  defvars(o, name, JSON.stringify(data), type);
}


function defvars(o, name, data, type) {
  if (o.vars[name]) {
    if (o.vars[name] == 'const') {
      throw new Error("Assignment to constant variable: "+ name);
    }
    o.push('\n', name, ' = ', data, ';');
  } else {
    var t = o.vars[name] = type || 'const';
    o.push('\n', t, ' ', name, ' = ', data, ';');
  }
}


function pageId2url(id) {
  if (id) {
    return '../'+ id +'.vue';
  }
  return null;
}


function genScriptConfig(o, opt) {
  // 为不通的平台生成对应的菜单数据
  defvar(o, 'theme', null, 'var');
  defvar(o, 'rootComponent', opt.rootcid || 'div', 'var');
  defvar(o, 'loginPage', pageId2url(opt.loginid), 'var');
  defvar(o, 'headPage', pageId2url(opt.headid), 'var');
  var menu = [];
  switch (opt.mode) {
    case 'pc':
      genPCMenuData(o, opt, menu);
      break;
      
    case 'mobile':
      //TODO 完成移动渲染器
      
    default:
      throw new Error("渲染器未实现");
  }
  defvar(o, 'menu', menu);
  
  o.push('\nconst jump = [');
  genJump(o, opt);
  o.push('\n];');
}


function genJump(o, opt) {
  for (var id in opt.nomenu) {
    var nm = opt.nomenu[id];
    o.push('\n  { path: "', nm.path, '", name: "', id,
      '", component: require("../', nm.fid, '.vue", 1,1) },');
  }
}


function genPCMenuData(o, opt, menu) {
  defvar(o, 'importsjs', [
    'cdn/vue-sidebar-menu/4.8.1/vue-sidebar-menu.js'
  ]);
  defvar(o, 'importscss', [
    'cdn/fontawesome/5.15.3/css/all.min.css',
    'cdn/vue-sidebar-menu/4.8.1/vue-sidebar-menu.css',
    'cdn/animate.css/4.1.1/animate.min.css',
  ]);
  defvar(o, 'theme', 'white-theme');
  defvar(o, 'appName', opt.appname);
  
  menu.push({ header: true, title: opt.appname });
  buildSidebarMenu(opt, menu, opt.menu);
  menu.push({
    title : '退出系统',
    href  : { logout : true },
    icon  : 'fas fa-power-off',
  });
}


// 该转换为 vue-sidebar-menu 设计
function buildSidebarMenu(opt, tar, src) {
  src.forEach(function(m) {
    var sbm = { title:'', href:null, icon:'', child:null, roles:null };
    
    if (m.isContainer) {
      // if (m.roles && notRight(opt, m.roles)) return;
      
      sbm.title = m.title;
      sbm.icon  = m.icon;
      sbm.roles = m.roles;
      sbm.child = [];
      buildSidebarMenu(opt, sbm.child, m.child);
    } else {
      var ref  = opt.nomenu[m.id];
      // if (ref.roles && notRight(opt, ref.roles)) return;
      
      sbm.id    = m.id;
      sbm.title = ref.title;
      sbm.icon  = ref.icon;
      sbm.roles = ref.roles;
      sbm.href  = { name : m.id };
    }
    tar.push(sbm);
  });
}


// 渲染时不应该过滤菜单
function notRight(opt, r) {
  if (r.length < 1) return false;
  for (var i=0; i<r.length; ++i) {
    if (opt.roles[r[i]]) {
      return false;
    }
  }
  return true;
}