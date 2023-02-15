# xBoson 初始化数据备份

平台核心使用这些数据启动最基本的系统.

该项目由 [上海竹呗信息技术有限公司](https://xboson.net/) 提供技术支持.


## MongoDB 数据

### 备份

`mongodump -h 127.0.0.1 -o mongo-bak`

### 恢复

`mongorestore --dir mongo-bak`


## Mysql 数据

首次导出执行: 

`git submodule init`

### 备份

`./dump-mysql.sh`

### 恢复

`./import-mysql.sh`


## 接口脚本

目录结构: api-bak / 机构ID / 应用ID / 模块ID / 接口ID.js


## 关联项目

* [xBoson平台运算核心](https://github.com/yanmingsohu/xBoson-core)
* [把单个sql切分为多个文件](https://github.com/kedarvj/mysqldumpsplitter)