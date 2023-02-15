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
-- Table structure for table `sys_page_element`
--

DROP TABLE IF EXISTS `sys_page_element`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_page_element` (
  `pageid` varchar(40) NOT NULL DEFAULT '' COMMENT '页面ID',
  `elementid` varchar(40) NOT NULL DEFAULT '' COMMENT '元素ID',
  `elementnm` varchar(100) DEFAULT NULL COMMENT '元素名称',
  `status` char(1) NOT NULL COMMENT '状态',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`elementid`,`pageid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='页面元素';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_page_element`
--

LOCK TABLES `sys_page_element` WRITE;
/*!40000 ALTER TABLE `sys_page_element` DISABLE KEYS */;
INSERT INTO `sys_page_element` VALUES ('bi_chart_config','0','初始化事件','1','2017-02-23 10:27:13','2017-02-23 10:27:13'),('bi_chart_view_config','0','初始化事件','1','2017-02-23 10:28:15','2017-02-23 10:28:15'),('bm_bms_cz','0','初始化事件','1','2017-02-27 11:30:27','2017-02-27 11:30:27'),('bm_bms_dw','0','初始化事件','1','2017-02-27 11:31:08','2017-02-27 11:31:08'),('mdms_datadictD_index','0','初始化事件','1','2017-03-02 11:13:11','2017-03-02 11:13:11'),('md_gen_index','0','初始化事件','1','2017-01-19 14:07:06','2017-01-19 14:07:06'),('md_mmd_index','0','初始化事件','1','2017-03-02 11:13:38','2017-03-02 11:13:38'),('rbac_auth_mgt01','0','初始化事件','1','2016-09-06 17:11:09','2016-09-06 17:11:09'),('rbac_auth_mgt02','0','初始化事件','1','2016-09-08 15:52:47','2016-09-08 15:52:47'),('rbac_prj_mgt01','0','初始化事件','1','2016-09-02 16:49:41','2016-09-02 16:49:41'),('rbac_prj_mgt02','0','初始化事件','1','2016-08-25 09:05:33','2016-08-25 09:05:33'),('rbac_prj_mgt03','0','初始化事件','1','2016-08-25 08:44:42','2016-08-25 08:44:42'),('rbac_prj_mgt04','0','初始化事件','1','2016-08-25 08:45:08','2016-08-25 08:45:08'),('rbac_prj_mgt05','0','初始化事件','1','2016-08-25 08:46:28','2016-08-25 08:46:28'),('rbac_prj_mgt06','0','初始化事件','1','2016-08-25 08:46:58','2016-08-25 08:46:58'),('rbac_prj_mgt07','0','初始化事件','1','2016-08-25 10:19:03','2016-08-25 10:19:03'),('rbac_prj_mgt08','0','初始化事件','1','2016-08-25 10:19:46','2016-08-25 10:19:46'),('rbac_prj_mgt09','0','初始化事件','1','2016-08-25 09:24:42','2016-08-25 09:24:42'),('rbac_prj_mgt10','0','初始化事件','1','2016-08-25 09:27:33','2016-08-25 09:27:33'),('rbac_prj_mgt11','0','初始化事件','1','2016-08-25 09:50:55','2016-08-25 09:50:55'),('rbac_prj_mgt12','0','初始化事件','1','2016-08-25 09:52:43','2016-08-25 09:52:43'),('rbac_role_mgt01','0','初始化事件','1','2016-09-02 16:51:09','2016-09-02 16:51:09'),('rbac_role_mgt02','0','初始化事件','1','2016-08-25 11:10:34','2016-08-25 11:10:34'),('rbac_role_mgt03','0','初始化事件','1','2016-08-25 11:12:51','2016-08-25 11:12:51'),('rbac_role_mgt04','0','初始化事件','1','2016-08-25 12:09:47','2016-08-25 12:09:47'),('rbac_role_mgt05','0','初始化事件','1','2016-08-25 11:20:58','2016-08-25 11:20:58'),('rbac_role_mgt06','0','初始化事件','1','2016-08-25 11:22:19','2016-08-25 11:22:19'),('rbac_role_mgt07','0','初始化事件','1','2016-09-02 16:43:21','2016-09-02 16:43:21'),('rbac_auth_mgt02','a','删除','1','2016-09-08 15:52:47','2016-09-08 15:52:47'),('rbac_prj_mgt01','add_project','创建新项目','1','2016-09-02 16:49:41','2016-09-02 16:49:41'),('rbac_prj_mgt07','closeCtree','关闭排序','1','2016-08-25 10:19:03','2016-08-25 10:19:03'),('rbac_prj_mgt09','del_element','删除组件','1','2016-08-25 09:24:42','2016-08-25 09:24:42'),('rbac_prj_mgt09','del_next_page','删除关联页面','1','2016-08-25 09:24:42','2016-08-25 09:24:42'),('rbac_prj_mgt02','edit_project','修改','1','2016-08-25 09:05:33','2016-08-25 09:05:33'),('mdms_datadictD_index','filter_sx','筛选按钮','1','2017-03-02 11:13:11','2017-03-02 11:13:11'),('rbac_prj_mgt08','na','保存','1','2016-08-25 10:19:46','2016-08-25 10:19:46'),('rbac_prj_mgt09','na','确定','1','2016-08-25 09:24:42','2016-08-25 09:24:42'),('mdms_datadictD_index','other_operate','其他操作控制按钮','1','2017-03-02 11:13:11','2017-03-02 11:13:11'),('rbac_prj_mgt09','pageid','页面ID','1','2016-08-25 09:24:42','2016-08-25 09:24:42'),('rbac_auth_mgt01','rbac_auth_mgt01_save','确定','1','2016-09-06 17:11:09','2016-09-06 17:11:09'),('rbac_auth_mgt02','rbac_auth_mgt02_client_container','客户端列表','1','2016-09-08 15:52:47','2016-09-08 15:52:47'),('rbac_auth_mgt02','rbac_auth_mgt02_scope_save','保存','1','2016-09-08 15:52:47','2016-09-08 15:52:47'),('rbac_prj_mgt09','rbac_prj_mgt09_btn_add_element','添加组件','1','2016-08-25 09:24:42','2016-08-25 09:24:42'),('rbac_prj_mgt09','rbac_prj_mgt09_btn_add_page','添加关联页面','1','2016-08-25 09:24:42','2016-08-25 09:24:42'),('rbac_prj_mgt10','rbac_prj_mgt10_submit','确定','1','2016-08-25 09:27:33','2016-08-25 09:27:33'),('rbac_prj_mgt11','rbac_prj_mgt11_add','添加','1','2016-08-25 09:50:55','2016-08-25 09:50:55'),('rbac_prj_mgt11','rbac_prj_mgt11_del','删除','1','2016-08-25 09:50:55','2016-08-25 09:50:55'),('rbac_prj_mgt11','rbac_prj_mgt11_edit','修改','1','2016-08-25 09:50:55','2016-08-25 09:50:55'),('rbac_prj_mgt11','rbac_prj_mgt11_search','查询','1','2016-08-25 09:50:55','2016-08-25 09:50:55'),('rbac_prj_mgt12','rbac_prj_mgt12_confirm','选择','1','2016-08-25 09:52:43','2016-08-25 09:52:43'),('rbac_prj_mgt12','rbac_prj_mgt12_search','查询','1','2016-08-25 09:52:43','2016-08-25 09:52:43'),('rbac_role_mgt01','rbac_role_mgt01_add','添加角色','1','2016-09-02 16:51:09','2016-09-02 16:51:09'),('rbac_role_mgt01','rbac_role_mgt01_del','删除角色','1','2016-09-02 16:51:09','2016-09-02 16:51:09'),('rbac_role_mgt01','rbac_role_mgt01_edit','修改角色','1','2016-09-02 16:51:09','2016-09-02 16:51:09'),('rbac_role_mgt01','rbac_role_mgt01_effect','授权情况','1','2016-09-02 16:51:09','2016-09-02 16:51:09'),('rbac_role_mgt01','rbac_role_mgt01_menu_node','菜单Tree节点','1','2016-09-02 16:51:09','2016-09-02 16:51:09'),('rbac_role_mgt01','rbac_role_mgt01_menu_refresh','重置菜单','1','2016-09-02 16:51:09','2016-09-02 16:51:09'),('rbac_role_mgt01','rbac_role_mgt01_menu_save','保存菜单','1','2016-09-02 16:51:09','2016-09-02 16:51:09'),('rbac_role_mgt01','rbac_role_mgt01_srv','服务确认','1','2016-09-02 16:51:09','2016-09-02 16:51:09'),('rbac_role_mgt02','rbac_role_mgt02_btn_user_more','更多用户','1','2016-08-25 11:10:34','2016-08-25 11:10:34'),('rbac_role_mgt04','rbac_role_mgt04_confirm','确定','1','2016-08-25 12:09:47','2016-08-25 12:09:47'),('rbac_role_mgt04','rbac_role_mgt04_rg_add','添加','1','2016-08-25 12:09:47','2016-08-25 12:09:47'),('rbac_role_mgt04','rbac_role_mgt04_rg_cancel','取消','1','2016-08-25 12:09:47','2016-08-25 12:09:47'),('rbac_role_mgt04','rbac_role_mgt04_rg_del','删除','1','2016-08-25 12:09:47','2016-08-25 12:09:47'),('rbac_role_mgt04','rbac_role_mgt04_rg_edit','更新','1','2016-08-25 12:09:47','2016-08-25 12:09:47'),('rbac_role_mgt06','rbac_role_mgt06_page_confirm','确认配置并返回','1','2016-08-25 11:22:19','2016-08-25 11:22:19'),('rbac_role_mgt07','rbac_role_mgt07_submit','保存','1','2016-09-02 16:43:21','2016-09-02 16:43:21'),('rbac_prj_mgt09','set_srv','选择服务','1','2016-08-25 09:24:42','2016-08-25 09:24:42'),('rbac_prj_mgt07','sort','排序','1','2016-08-25 10:19:03','2016-08-25 10:19:03'),('md_gen_index','submit','提交','1','2017-01-19 14:07:06','2017-01-19 14:07:06');
/*!40000 ALTER TABLE `sys_page_element` ENABLE KEYS */;
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
