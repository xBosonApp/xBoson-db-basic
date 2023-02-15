-- Copyright 2023 Jing Yanming
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
USE `a297dfacd7a84eab9656675f61750078`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: a297dfacd7a84eab9656675f61750078
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sys_apps`
--

DROP TABLE IF EXISTS `sys_apps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_apps` (
  `appid` varchar(32) NOT NULL DEFAULT '',
  `appnm` varchar(50) NOT NULL COMMENT '应用名称',
  `about` varchar(255) DEFAULT NULL COMMENT '关于应用信息',
  `appflag` char(1) DEFAULT NULL,
  `status` char(1) NOT NULL COMMENT '状态对应数据字典0无效1有效2移除',
  `createdt` datetime DEFAULT NULL COMMENT '注册时间戳',
  `updatedt` datetime DEFAULT NULL COMMENT '更新时间戳',
  `uri` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`appid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_apps`
--

LOCK TABLES `sys_apps` WRITE;
/*!40000 ALTER TABLE `sys_apps` DISABLE KEYS */;
INSERT INTO `sys_apps` VALUES ('03229cbe4f4f11e48d6d6f51497a883b','应用信息管理','应用管理_应用信息','0','1','2014-10-08 15:44:06','2014-10-08 15:44:06',NULL),('0418a865dac144cfa77a1e4573e3f549','xBoson运营管理','智云运营管理','0','1','2014-10-11 16:17:35','2019-01-15 16:57:49',NULL),('0d8b740dbaa9440c8ddfc392cc9780a4','图',NULL,'0','1','2020-12-08 12:08:25','2020-12-08 12:08:25',NULL),('19cb7c3b79e949b88a9c76396854c2b1','低代码',NULL,'0','1','2021-06-19 10:40:56','2021-06-19 10:40:56',NULL),('26c0f25501d24c0993515d445e1215a5','缓存管理',NULL,'0','1','2014-10-15 10:44:17','2014-11-11 16:22:50',NULL),('2e617eb7e1744bbcb6a0518fa85a84a5','IOT基础设施','IOT的基本功能/接口, 应用层另启项目.','0','1','2020-11-17 11:14:57','2020-11-17 11:14:57',NULL),('46bf6c9c9f884ad79ea6078c03b0cdb2','模块测试',NULL,'0','1','2018-01-05 09:45:47','2018-01-05 09:45:47',NULL),('81092b8cd82041a2b81296409eba92da','区块链管理',NULL,'0','1','2018-07-20 13:39:46','2018-07-20 13:39:46',NULL),('8f5906e6880e4758bab5895f10fa0450','区块链(示例代码)',NULL,'0','1','2018-11-09 10:47:34','2018-12-10 10:27:32',NULL),('9da3e4550d1f42d3979ae30931d498c9','数据交换应用',NULL,'0','1','2018-06-08 10:05:50','2018-06-28 17:18:34',NULL),('a1e22425b8574d67bf4f200b4ccde506','数据交换基础',NULL,'0','1','2018-06-08 10:05:44','2018-07-03 15:51:26',NULL),('a20a0c6a82fb4cb085cb816e5526d4bc','计划任务','计划任务及任务提醒等功能 添加修改删除等','0','1','2015-01-19 16:57:32','2015-01-19 16:57:32',NULL),('a510370fd076433dbe8eb33a885f0199','流程图',NULL,'0','1','2018-08-16 10:43:21','2018-08-16 10:43:21',NULL),('a6929eedff5c49e5a1a0f5b490873b39','百度图表EChart',NULL,'0','1','2015-01-16 15:52:20','2015-01-16 15:52:20',NULL),('a9943b0fb1e141b3a3ce7e886d407f5b','基础测试',NULL,'0','1','2017-11-16 15:37:30','2019-01-11 09:44:12',NULL),('ab59c369d5ca4bc5acc0cf44ed0caa89','OPC管理','对接远程OPC服务器','0','1','2020-09-13 19:09:26','2020-09-13 19:09:26',NULL),('ac25e37830ec4e6cbe367a51a4005b7e','导入导出',NULL,'0','1','2015-07-24 10:14:10','2015-07-24 10:14:10',NULL),('af1880a8938f4756a3f377c93be99d78','公共服务',NULL,'0','1','2018-12-11 13:16:07','2018-12-12 11:49:55',NULL),('apils','平台 API 列表','平台 API 列表','0','1','2015-04-16 16:14:15','2015-04-16 16:14:15',NULL),('auth','授权管理','授权系统 - Authorization','0','1','2014-05-19 09:33:44','2014-05-19 09:33:44',NULL),('bf1d70edb9d6463d968a175ce7a6fd3a','EEB','EEB管理','0','1','2015-04-13 10:52:37','2015-04-13 10:52:37',NULL),('c770045becc04c7583f626faacd3b456','业务模型管理',NULL,'0','1','2015-01-26 09:23:35','2015-01-26 09:23:35',NULL),('c879dcc94d204d96a98a34e0b7d75676','元数据管理',NULL,'0','1','2014-11-12 10:32:04','2014-11-12 10:32:04',NULL),('c88373e2a24944fb9783343c4a4ff139','核心数据迁移','永远不被发布','0','1','2019-01-18 11:59:53','2019-01-18 11:59:53',NULL),('c9e98ea6fc7148d186289e8c33776f8a','xBoson运营管理通用',NULL,'0','1','2014-10-13 10:55:52','2019-01-15 16:57:55',NULL),('cfb82858dc0a4598834d356c661a678f','日志分析',NULL,'0','1','2015-05-13 14:14:04','2015-05-13 14:14:04',NULL),('d2c8511b47714faba5c71506a5029d94','主数据管理系统','主数据管理系统','0','1','2014-10-21 15:48:35','2014-10-23 15:04:34',NULL),('e0ef1b25da204227b305fd40382693e6','进程管理',NULL,'0','1','2018-01-27 10:40:27','2018-01-27 10:40:27',NULL),('e76add28f5eb4309be20780d191f6309','内容管理',NULL,'0','1','2018-05-21 22:15:48','2018-05-21 22:18:26',NULL),('ef9ba6208c3a443e8d6691fb92b19fb4','升级',NULL,'0','1','2019-04-03 10:13:03','2019-04-03 10:13:03',NULL),('f7b67a9e96864350963f1a470ff0eda7','日志管理',NULL,'0','1','2015-02-09 14:28:18','2015-02-09 14:28:18',NULL),('faac7c3dc3844e61a8ca4bd7ab2ff096','标准服务通用',NULL,'0','1','2015-07-14 16:01:40','2015-07-14 16:01:40',NULL),('ZYAPP_IDE','IDE','平台系统应用 - IDE','0','1','2014-04-30 11:20:55','2014-10-20 12:40:27',NULL),('ZYAPP_LOGIN','用户登录','用户登录通用应用','0','1','2014-09-23 15:57:39','2014-09-23 15:57:39',NULL),('ZYAPP_MENU','MENU','主界面菜单','0','1','2014-05-04 15:59:48','2014-05-04 15:59:48',NULL),('ZYAPP_SYSMGT','xBoson系统管理','智云系统管理','0','1','2016-07-04 15:54:11','2019-01-15 16:57:45',NULL);
/*!40000 ALTER TABLE `sys_apps` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:50
