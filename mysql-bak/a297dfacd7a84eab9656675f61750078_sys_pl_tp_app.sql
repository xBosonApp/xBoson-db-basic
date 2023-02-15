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
-- Table structure for table `sys_pl_tp_app`
--

DROP TABLE IF EXISTS `sys_pl_tp_app`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_pl_tp_app` (
  `tp_appid` char(32) NOT NULL COMMENT '第三方应用ID',
  `tp_appnm` varchar(100) DEFAULT NULL COMMENT '第三方应用名称',
  `orgid` char(100) NOT NULL COMMENT '所属机构ID',
  `mark` varchar(200) DEFAULT NULL COMMENT '说明',
  `status` char(1) NOT NULL COMMENT '状态 0无效1有效',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  `uri` varchar(200) DEFAULT NULL COMMENT '应用回调URI',
  `app_secret` char(32) NOT NULL COMMENT '密钥',
  `scope` varchar(100) DEFAULT NULL COMMENT 'Client 授权范围（Scope）',
  PRIMARY KEY (`tp_appid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='第三方应用注册表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_pl_tp_app`
--

LOCK TABLES `sys_pl_tp_app` WRITE;
/*!40000 ALTER TABLE `sys_pl_tp_app` DISABLE KEYS */;
INSERT INTO `sys_pl_tp_app` VALUES ('beb6d8af57244078b185c551b0c1718e','第三方应用 Demo','bc02994ec23341708e54c97f6b3f9f48','第三方应用 Demo','1','2015-11-10 15:08:12','2015-11-12 11:49:20','http://testsubdomain.tunnel.phpor.me/OAuth2.0_Demo/afterlogin.do','d3e69dccd80b4a01b82a84d94aaee548','openid'),('c03cb70666014db7b56d105af351120c','EMPI','a297dfacd7a84eab9656675f61750078','EMPI接入','1','2017-01-05 15:26:02','2017-01-05 16:06:13','http://localhost:8081/','ec3a9567a8c34706b9448e2a39ab1ef7','EMPI'),('cc1be2aff85f49a58a599877f2c40909','EMPI-ZL','afb9a9a1c80647e6a0d7e807f68e055a',NULL,'1','2017-01-05 16:24:59','2017-03-01 13:52:53','baidu.com','a9e2f84499a345a3b19a17f307e000d3','empi2'),('d8016ba77dc345dfa8681eeee7814d7f','OAuth 2.0 客户端授权测试','a297dfacd7a84eab9656675f61750078','在 localhost:90 上运行 oauth 测试服务器','1','2014-12-09 14:19:49','2018-03-14 13:31:25','http://localhost:90/oauth/code','22222995a0134b22a99956ee184cc527',NULL),('dfe437babe4c44e08bf2634aeff97cc9','平台NODE服务','a297dfacd7a84eab9656675f61750078','（新）平台内部NODE服务，部署时应更新URI属性','1','2016-10-24 20:16:51','2017-01-18 15:12:59','http://localhost/api','a5227f60ffeb44ba9cc788a8ad869cc3',NULL),('e0b5f238be924796b318a97d4e7e022c','平台计划任务服务','a297dfacd7a84eab9656675f61750078','平台计划任务服务','1','2016-12-08 11:44:39','2017-01-16 13:15:57','http://localhost/cron/','a3e1041d0e6842efa00c7daf16f7e3b7',NULL);
/*!40000 ALTER TABLE `sys_pl_tp_app` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:23
