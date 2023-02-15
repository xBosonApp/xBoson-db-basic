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
-- Table structure for table `sys_page`
--

DROP TABLE IF EXISTS `sys_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_page` (
  `pageid` varchar(40) NOT NULL DEFAULT '' COMMENT '页面ID',
  `pagenm` varchar(100) NOT NULL COMMENT '页面名称',
  `prjid` char(32) NOT NULL COMMENT '项目ID',
  `page_path` varchar(200) DEFAULT NULL COMMENT '页面相对路径',
  `status` char(1) NOT NULL COMMENT '状态',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`pageid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='页面表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_page`
--

LOCK TABLES `sys_page` WRITE;
/*!40000 ALTER TABLE `sys_page` DISABLE KEYS */;
INSERT INTO `sys_page` VALUES ('bi_chart_config','图表工具-图表编辑器','a5bf236af3724812bc46ee30a64e6f9d','bi/moduleD/moduleD_edit.htm','1','2017-02-23 10:27:13','2017-02-23 10:27:13'),('bi_chart_view_config','图表工具-图表展示配置','a5bf236af3724812bc46ee30a64e6f9d','bi/moduleD/moduleD_show.htm','1','2017-02-23 10:28:15','2017-02-23 10:28:15'),('bm_bms_cz','操作模型管理','a5bf236af3724812bc46ee30a64e6f9d','bm/bms/bms_cz.html','1','2017-02-27 11:30:27','2017-02-27 11:30:27'),('bm_bms_dw','多维模型管理','a5bf236af3724812bc46ee30a64e6f9d','bm/bms/bms_dw.html','1','2017-02-27 11:31:08','2017-02-27 11:31:08'),('mdms_datadictD_index','值域代码','a5bf236af3724812bc46ee30a64e6f9d','mdms/datadictD/index.htm','1','2017-01-20 11:00:27','2017-03-02 11:13:11'),('md_gen_index','生成测试数据','a5bf236af3724812bc46ee30a64e6f9d','md/generate_test_data/index.htm','1','2017-01-18 10:14:06','2017-01-19 14:07:06'),('md_mmd_index','元数据管理','a5bf236af3724812bc46ee30a64e6f9d','md/mmD/index.htm','1','2017-03-01 12:57:56','2017-03-02 11:13:38'),('rbac_auth_mgt01','授权管理','a5bf236af3724812bc46ee30a64e6f9d','rbac/auth_mgt/rbac_auth_mgt01.htm','1','2016-09-06 17:11:09','2016-09-06 17:11:09'),('rbac_auth_mgt02','客户端权限设定','a5bf236af3724812bc46ee30a64e6f9d','rbac/auth_mgt/rbac_auth_mgt02.htm','1','2016-09-08 15:52:47','2016-09-08 15:52:47'),('rbac_prj_mgt01','项目管理主界面','a5bf236af3724812bc46ee30a64e6f9d','rbac/prj_mgt/rbac_prj_mgt01.htm','1','2016-08-25 08:42:35','2016-09-02 16:49:41'),('rbac_prj_mgt02','项目widget','a5bf236af3724812bc46ee30a64e6f9d','rbac/prj_mgt/rbac_prj_mgt02.htm','1','2016-08-25 08:43:50','2016-08-25 09:05:33'),('rbac_prj_mgt03','添加修改项目','a5bf236af3724812bc46ee30a64e6f9d','rbac/prj_mgt/rbac_prj_mgt03.htm','1','2016-08-25 08:44:42','2016-08-25 08:44:42'),('rbac_prj_mgt04','API操作','a5bf236af3724812bc46ee30a64e6f9d','rbac/prj_mgt/rbac_prj_mgt04.htm','1','2016-08-25 08:45:08','2016-08-25 08:45:08'),('rbac_prj_mgt05','APP 模块 API 维护页面','a5bf236af3724812bc46ee30a64e6f9d','rbac/prj_mgt/rbac_prj_mgt05.htm','1','2016-08-25 08:46:28','2016-08-25 08:46:28'),('rbac_prj_mgt06','添加用户','a5bf236af3724812bc46ee30a64e6f9d','rbac/mgt_prj/rbac_prj_mgt06.htm','1','2016-08-25 08:46:58','2016-08-25 08:46:58'),('rbac_prj_mgt07','项目菜单','a5bf236af3724812bc46ee30a64e6f9d','rbac/prj_mgt/rbac_prj_mgt07.htm','1','2016-08-25 08:47:24','2016-08-25 10:19:03'),('rbac_prj_mgt08','添加修改菜单','a5bf236af3724812bc46ee30a64e6f9d','rbac/prj_mgt/rbac_prj_mgt08.htm','1','2016-08-25 08:47:48','2016-08-25 10:19:46'),('rbac_prj_mgt09','页面ID配置页面','a5bf236af3724812bc46ee30a64e6f9d','rbac/prj_mgt/rbac_prj_mgt09.htm','1','2016-08-25 08:48:15','2016-08-25 09:24:42'),('rbac_prj_mgt10','服务选择页面','a5bf236af3724812bc46ee30a64e6f9d','rbac/prj_mgt/rbac_prj_mgt10.htm','1','2016-08-25 08:49:22','2016-08-25 09:27:33'),('rbac_prj_mgt11','项目页面管理','a5bf236af3724812bc46ee30a64e6f9d','rbac/prj_mgt/rbac_prj_mgt11.htm','1','2016-08-25 08:49:45','2016-08-25 09:50:55'),('rbac_prj_mgt12','页面选择页面','a5bf236af3724812bc46ee30a64e6f9d','rbac/prj_mgt/rbac_prj_mgt12.htm','1','2016-08-25 08:52:28','2016-08-25 09:52:43'),('rbac_role_mgt01','角色管理','a5bf236af3724812bc46ee30a64e6f9d','rbac/role_mgt/rbac_role_mgt01.htm','1','2016-08-25 11:03:05','2016-09-02 16:51:09'),('rbac_role_mgt02','授权情况页面','a5bf236af3724812bc46ee30a64e6f9d','rbac/role_mgt/rbac_role_mgt02.htm','1','2016-08-25 11:10:34','2016-08-25 11:10:34'),('rbac_role_mgt03','授权情况页面','a5bf236af3724812bc46ee30a64e6f9d','rbac/role_mgt/rbac_role_mgt03.htm','1','2016-08-25 11:12:51','2016-08-25 11:12:51'),('rbac_role_mgt04','角色/角色组维护页面','a5bf236af3724812bc46ee30a64e6f9d','rbac/role_mgt/rbac_role_mgt04.htm','1','2016-08-25 11:19:03','2016-08-25 12:09:47'),('rbac_role_mgt05','页面权限配置','a5bf236af3724812bc46ee30a64e6f9d','rbac/role_mgt/rbac_role_mgt05.htm','1','2016-08-25 11:20:58','2016-08-25 11:20:58'),('rbac_role_mgt06','角色页面Tab','a5bf236af3724812bc46ee30a64e6f9d','rbac/role_mgt/rbac_role_mgt06.htm','1','2016-08-25 11:22:07','2016-08-25 11:22:19'),('rbac_role_mgt07','角色服务确认','a5bf236af3724812bc46ee30a64e6f9d','rbac/prj_role/rbac_role_mgt07.htm','1','2016-09-02 16:43:21','2016-09-02 16:43:21');
/*!40000 ALTER TABLE `sys_page` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:03
