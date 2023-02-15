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
-- Table structure for table `sys_md_mm004`
--

DROP TABLE IF EXISTS `sys_md_mm004`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_md_mm004` (
  `typecd` varchar(100) NOT NULL COMMENT '模型编码',
  `en` varchar(100) NOT NULL COMMENT '索引物理名称',
  `cn` varchar(150) DEFAULT NULL COMMENT '索引中文名称',
  `fields` varchar(150) NOT NULL COMMENT '表字段物理名称',
  `sort` char(1) DEFAULT NULL COMMENT '排序',
  `status` char(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `mark` varchar(600) DEFAULT NULL COMMENT '说明',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`typecd`,`en`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='表索引信息';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_md_mm004`
--

LOCK TABLES `sys_md_mm004` WRITE;
/*!40000 ALTER TABLE `sys_md_mm004` DISABLE KEYS */;
INSERT INTO `sys_md_mm004` VALUES ('DS.SYS.02','ds','ds','dhost asc','0','1',NULL,'2015-10-30 11:19:35','2015-10-30 11:19:35'),('DS.SYS.04.03','sys_userinfo_email','平台用户信息表_电子邮件','email asc','0','1',NULL,'2015-09-25 13:52:25','2015-09-25 13:52:25'),('DS.SYS.04.03','sys_userinfo_tel','平台用户信息表_电话号码','tel asc','0','1',NULL,'2015-09-25 13:51:20','2015-09-25 13:51:55'),('DS.SYS.04.03','sys_userinfo_userid','平台用户信息表_userid','userid asc','0','1',NULL,'2014-12-16 10:09:21','2014-12-16 10:09:21'),('DS.SYS.09.06','d','d','createdt asc','0','1',NULL,'2015-10-30 11:30:28','2015-10-30 11:30:28'),('DS.SYS.12','sys_files_filenm','文件存储信息表_filenm','filenm asc','0','1',NULL,'2014-12-16 10:14:04','2015-01-26 17:27:19'),('DS.SYS.13','mdm_personal_info_de0201010','个人基本信息表_de0201010','de0201010 asc','0','1',NULL,'2014-12-16 10:52:25','2014-12-16 10:52:25'),('DS.SYS.13','mdm_personal_info_de0201012','个人基本信息表_de0201012','de0201012 asc','0','1',NULL,'2014-12-16 10:52:54','2014-12-16 10:52:54'),('DS.SYS.13','mdm_personal_info_de0201030','个人基本信息表_de0201030','de0201030 asc','0','1',NULL,'2014-12-16 10:48:56','2014-12-16 10:48:56'),('DS.SYS.13','mdm_personal_info_de0201039_de0201040_de0201005','个人基本信息表_de0201039_de0201040_de0201005','de0201039 asc,de0201040 asc,de0201005 asc','0','1',NULL,'2014-12-16 10:51:50','2014-12-16 10:51:50'),('DS.SYS.14','mdm_org_de0810011','机构基本信息表_de0810011','de0810011 asc','0','1',NULL,'2014-12-16 10:54:30','2014-12-16 10:54:30'),('DS.SYS.14','mdm_org_de0810013j','机构基本信息表_de0810013j','de0810013j asc','0','1',NULL,'2014-12-16 10:54:03','2014-12-16 10:54:03'),('DS.SYS.14','mdm_org_de0810052','机构基本信息表_de0810052','de0810052 asc','0','1',NULL,'2014-12-16 10:53:36','2014-12-16 10:53:36'),('DS.SYS.15','mdm_dept_deptcd','部门基本信息表_deptcd','deptcd asc','0','1',NULL,'2014-12-16 10:55:05','2014-12-16 10:55:05'),('DS.SYS.15','mdm_dept_deptnm','部门基本信息表_deptnm','deptnm asc','0','1',NULL,'2014-12-16 10:55:31','2014-12-16 10:55:31'),('DS.SYS.17.01','sys_pl_log_system_log_time','系统日志表_log_time','log_time asc','0','1',NULL,'2014-12-16 10:16:37','2015-02-09 14:35:58'),('DS.SYS.17.02','sys_pl_log_system_error_log_error_type','系统异常日志表_log_error_type','log_error_type asc','0','1',NULL,'2014-12-16 10:19:53','2015-02-09 14:36:24'),('DS.SYS.17.02','sys_pl_log_system_error_log_level','系统异常日志表_log_level','log_level asc','0','1',NULL,'2014-12-16 10:19:28','2015-02-09 14:36:38'),('DS.SYS.17.02','sys_pl_log_system_error_log_time','系统异常日志表_log_time','log_time asc','0','1',NULL,'2014-12-16 10:18:57','2015-02-09 14:36:44'),('DS.SYS.17.03','sys_pl_log_app_log_error_type','应用系统配置日志表_log_error_type','log_error_type asc','0','1',NULL,'2014-12-16 10:22:28','2015-02-09 14:40:44'),('DS.SYS.17.03','sys_pl_log_app_log_level','应用系统配置日志表_log_level','log_level asc','0','1',NULL,'2014-12-16 10:21:43','2015-02-09 14:46:01'),('DS.SYS.17.03','sys_pl_log_app_log_time','应用系统配置日志表_log_time','log_time asc','0','1',NULL,'2014-12-16 10:21:12','2015-02-09 14:40:53'),('DS.SYS.17.03','sys_pl_log_app_op_cd','应用系统配置日志表_op_cd','op_cd asc','0','1',NULL,'2014-12-16 10:24:26','2015-02-09 14:40:58'),('DS.SYS.17.03','sys_pl_log_app_pid','应用系统配置日志表_pid','pid asc','0','1',NULL,'2014-12-16 10:22:56','2015-02-09 14:41:02'),('DS.SYS.17.04','sys_pl_log_access_access_cd','登录访问日志表_access_cd','access_cd asc','0','1',NULL,'2014-12-16 10:31:12','2015-02-09 14:37:26'),('DS.SYS.17.04','sys_pl_log_access_appid','登录访问日志表_appid','appid asc','0','1',NULL,'2014-12-16 10:32:02','2015-02-09 14:37:31'),('DS.SYS.17.04','sys_pl_log_access_log_error_type','登录访问日志表_log_error_type','log_error_type asc','0','1',NULL,'2014-12-16 10:29:32','2015-02-09 14:37:37'),('DS.SYS.17.04','sys_pl_log_access_log_level','登录访问日志表_log_level','log_level asc','0','1',NULL,'2014-12-16 10:28:09','2015-02-09 14:37:43'),('DS.SYS.17.04','sys_pl_log_access_log_time','登录访问日志表_log_time','log_time asc','0','1',NULL,'2014-12-16 10:27:40','2015-02-09 14:37:48'),('DS.SYS.17.04','sys_pl_log_access_pid','登录访问日志表_pid','pid asc','0','1',NULL,'2014-12-16 10:30:13','2015-02-09 14:37:52'),('DS.SYS.17.04','sys_pl_log_access_user_key','登录访问日志表_user_key','user_key asc','0','1',NULL,'2014-12-16 10:30:48','2015-02-09 14:37:57'),('DS.SYS.17.05','sys_pl_log_unauth_log_error_type','未授权访问日志表_log_error_type','log_error_type asc','0','1',NULL,'2014-12-16 10:34:04','2015-02-09 14:30:49'),('DS.SYS.17.05','sys_pl_log_unauth_log_level','未授权访问日志表_log_level','log_level asc','0','1',NULL,'2014-12-16 10:33:36','2015-02-09 14:30:58'),('DS.SYS.17.05','sys_pl_log_unauth_log_time','未授权访问日志表_log_time','log_time asc','0','1',NULL,'2014-12-16 10:32:55','2015-02-09 14:31:03'),('DS.SYS.17.05','sys_pl_log_unauth_pid','未授权访问日志表_pid','pid asc','0','1',NULL,'2014-12-16 10:34:30','2015-02-09 14:31:14'),('DS.SYS.17.05','sys_pl_log_unauth_user_key','未授权访问日志表_user_key','user_key asc','0','1',NULL,'2014-12-16 10:34:56','2015-02-09 14:31:20'),('DS.SYS.17.06','sys_pl_log_request_apiid','APIID','apiid asc','0','1',NULL,'2015-10-21 15:58:52','2015-10-21 15:58:52'),('DS.SYS.17.06','sys_pl_log_request_appid','APPID','appid asc','0','1',NULL,'2015-10-21 15:58:07','2015-10-21 15:58:07'),('DS.SYS.17.06','sys_pl_log_request_elapsed','请求日志表_elapsed','elapsed asc','0','1',NULL,'2014-12-16 10:39:00','2015-02-09 14:33:59'),('DS.SYS.17.06','sys_pl_log_request_log_error_type','请求日志表_log_error_type','log_error_type asc','0','1',NULL,'2014-12-16 10:37:02','2015-02-09 14:34:09'),('DS.SYS.17.06','sys_pl_log_request_log_level','请求日志表_log_level','log_level asc','0','1',NULL,'2014-12-16 10:36:33','2015-02-09 14:34:17'),('DS.SYS.17.06','sys_pl_log_request_log_time','请求日志表_log_time','log_time asc','0','1',NULL,'2014-12-16 10:36:08','2015-02-09 14:34:22'),('DS.SYS.17.06','sys_pl_log_request_moduleid','模块ID','moduleid asc','0','1',NULL,'2015-10-21 15:58:31','2015-10-21 15:58:31'),('DS.SYS.17.06','sys_pl_log_request_pid','请求日志表_pid','pid asc','0','1',NULL,'2014-12-16 10:37:30','2015-02-09 14:34:27'),('DS.SYS.17.06','sys_pl_log_request_user_key','请求日志表_user_key','user_key asc','0','1',NULL,'2014-12-16 10:38:21','2015-02-09 14:34:32'),('DS.SYS.20.03','sys_pl_log_etl_flowid','数据流ID','flowid asc','0','1',NULL,'2015-03-10 13:45:00','2015-03-10 13:45:00'),('DS.SYS.20.03','sys_pl_log_etl_flowid_runningid','数据流ID执行ID','flowid asc,runningid asc','0','1',NULL,'2015-05-13 15:28:25','2015-05-13 15:28:25'),('DS.SYS.20.04','sys_pl_log_esb_flowid','数据流ID','flowid asc','0','1',NULL,'2015-03-10 13:48:01','2015-03-10 13:48:01'),('DS.SYS.20.04','sys_pl_log_esb_flowid_runningid',NULL,'flowid asc,runningid asc','0','1',NULL,'2015-05-13 15:28:49','2015-05-13 15:28:49'),('DS.SYS.20.07','sys_pl_log_etl_summary_flowid','数据流ID','flowid asc','0','1',NULL,'2015-05-13 15:25:19','2015-05-13 15:25:19'),('DS.SYS.20.08','sys_pl_log_esb_summary_flowid','数据流ID','flowid asc','0','1',NULL,'2015-05-13 15:26:03','2015-05-13 15:26:03'),('DS.SYS.20.09','dt_instanceid','日期_节点ID','log_date_char desc,instanceid asc','0','1',NULL,'2015-08-24 16:33:00','2015-08-24 16:33:00'),('DS.SYS.20.09','dt_instanceid_daqid','dt_instanceid_daqid','log_date_char asc,instanceid asc,daqid asc','0','1',NULL,'2015-08-24 16:57:17','2015-08-24 16:57:17'),('DS.SYS.20.09','dt_instanceid_daqid_jobid','dt_instanceid_daqid_jobid','log_date_char asc,instanceid asc,daqid asc,jobid asc','0','1',NULL,'2015-08-24 17:06:25','2015-08-24 17:06:25'),('DS.SYS.20.09','sys_pl_log_etl_statistics_instanceid','ETL实例ID','instanceid asc','0','1',NULL,'2015-06-15 16:34:56','2015-06-15 16:34:56'),('DS.SYS.20.09','sys_pl_log_etl_statistics_log_date_char','ETL日志日期','log_date_char desc','0','1',NULL,'2015-06-15 16:33:54','2015-06-15 16:33:54'),('DS.test.001','t','t','de asc','0','1',NULL,'2015-03-06 12:34:53','2015-03-06 12:34:53'),('DS.test.dd','ddd','ddd','typecd asc','0','1',NULL,'2015-01-16 08:40:30','2015-01-16 08:40:30');
/*!40000 ALTER TABLE `sys_md_mm004` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:58
