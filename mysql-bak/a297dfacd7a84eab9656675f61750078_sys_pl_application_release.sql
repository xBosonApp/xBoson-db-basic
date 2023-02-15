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
-- Table structure for table `sys_pl_application_release`
--

DROP TABLE IF EXISTS `sys_pl_application_release`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_pl_application_release` (
  `applicationid` char(32) NOT NULL COMMENT '应用ID',
  `applicationnm` varchar(50) NOT NULL COMMENT '应用名称',
  `application_desc` varchar(255) DEFAULT NULL COMMENT '应用描述',
  `intro_path` varchar(200) DEFAULT NULL COMMENT '应用介绍HTML文件相对路径',
  `image_path` varchar(200) DEFAULT NULL COMMENT '应用Logo相对路径',
  `p_applicationid` char(32) DEFAULT NULL COMMENT '标准版应用ID',
  `excl` char(1) DEFAULT NULL COMMENT '专属应用标记',
  `category` char(2) DEFAULT NULL COMMENT '应用分类',
  `orgid` char(32) DEFAULT NULL COMMENT '机构ID',
  `status` char(1) DEFAULT NULL COMMENT '状态',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`applicationid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='发布应用表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_pl_application_release`
--

LOCK TABLES `sys_pl_application_release` WRITE;
/*!40000 ALTER TABLE `sys_pl_application_release` DISABLE KEYS */;
INSERT INTO `sys_pl_application_release` VALUES ('26afd358b6144309bec99b2628ae26c7','运维管理','平台运维管理','','','','0','01','a297dfacd7a84eab9656675f61750078','1','2018-06-28 15:48:17','2022-03-01 23:40:19'),('4d00f20b10ac419184010674174032ef','跨平台用户管理','跨平台用户添加及管理API','','','d8fe5c4eac8043058c9417feb496b453','0','01','a297dfacd7a84eab9656675f61750078','1','2019-04-04 20:43:32','2019-04-04 20:43:32'),('516470de79b44b3ba57911c30956efa6','数据分析管理','数据分析功能模块','','','','0','01','a297dfacd7a84eab9656675f61750078','1','2018-06-28 15:58:38','2018-06-28 15:58:38'),('6ffea177f3944bf1ab8fabf7707780f8','知识图谱','知识图谱','','','','0','01','a297dfacd7a84eab9656675f61750078','1','2021-11-06 11:54:53','2021-11-06 11:54:53'),('70d6b73e9fd74b1293127f2c126eef18','信息标准管理','信息标准及信息共享服务','','','','0','01','a297dfacd7a84eab9656675f61750078','1','2018-06-28 15:46:50','2018-06-28 18:01:28'),('b630b6d72d7c42aab1325ebb15f378d5','系统权限管理','对人员进行权限管理','','','','0','01','a297dfacd7a84eab9656675f61750078','1','2018-06-28 15:44:52','2019-04-04 20:40:34'),('b68b40afaa354f6d8044c891f61cafd9','集成开发管理','信息集成开发功能模块','','','','0','01','a297dfacd7a84eab9656675f61750078','1','2018-06-28 15:59:17','2018-06-28 15:59:17'),('bbd8c3863a754994b4fe29407d4d218a','数据交换管理','数据服务及上传服务','','','','0','01','a297dfacd7a84eab9656675f61750078','1','2018-06-28 17:41:01','2018-12-13 13:09:23'),('c9a7bc44ff794ce791a1e45dfc51cd1e','开发项目管理','云应用开发管理','','','','0','01','a297dfacd7a84eab9656675f61750078','1','2018-06-28 15:56:49','2018-12-14 15:40:34'),('d286b8a9e58344f7ba1faa060aeb579a','云应用开发','云应用在线开发系统','','','','0','01','a297dfacd7a84eab9656675f61750078','1','2018-05-24 18:44:03','2021-07-15 11:28:31'),('d8fe5c4eac8043058c9417feb496b453','新平台应用','平台应用整合','','','','0','01','a297dfacd7a84eab9656675f61750078','1','2016-09-19 09:50:59','2018-12-10 09:48:19'),('f98f0bdf736b4c339c14d0d3a4e39c6a','云应用开发工具','云应用开发者功能模块','','','','0','01','a297dfacd7a84eab9656675f61750078','1','2018-06-28 15:57:26','2018-06-28 17:44:44'),('f9ec8b2b45d24971abede79886e9235f','演示应用','SHOW演示','','','','0','01','a297dfacd7a84eab9656675f61750078','1','2016-11-29 14:42:56','2019-01-12 14:45:22');
/*!40000 ALTER TABLE `sys_pl_application_release` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:05
