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
-- Table structure for table `sys_pl_log_access`
--

DROP TABLE IF EXISTS `sys_pl_log_access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_pl_log_access` (
  `logid` char(32) NOT NULL COMMENT '日志ID',
  `log_time` char(28) NOT NULL COMMENT '日志产生时间',
  `log_level` varchar(8) NOT NULL COMMENT '日志级别',
  `log_error_type` varchar(10) NOT NULL COMMENT '日志异常类型',
  `requestid` char(32) DEFAULT NULL COMMENT '请求ID',
  `serverid` char(32) DEFAULT NULL COMMENT '服务器ID',
  `log` varchar(2000) DEFAULT NULL COMMENT '日志内容',
  `pid` char(32) DEFAULT NULL COMMENT '访问者PID',
  `user_key` char(32) DEFAULT NULL COMMENT '会话标识符',
  `access_cd` char(5) DEFAULT NULL COMMENT '登录状态代码',
  `clientid` varchar(32) DEFAULT NULL COMMENT '应用ID',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`logid`),
  KEY `sys_pl_log_access_access_cd` (`access_cd`),
  KEY `sys_pl_log_access_appid` (`clientid`),
  KEY `sys_pl_log_access_log_error_type` (`log_error_type`),
  KEY `sys_pl_log_access_log_level` (`log_level`),
  KEY `sys_pl_log_access_log_time` (`log_time`),
  KEY `sys_pl_log_access_pid` (`pid`),
  KEY `sys_pl_log_access_user_key` (`user_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='登录访问日志';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_pl_log_access`
--

LOCK TABLES `sys_pl_log_access` WRITE;
/*!40000 ALTER TABLE `sys_pl_log_access` DISABLE KEYS */;
INSERT INTO `sys_pl_log_access` VALUES ('8a977ab1ede342569d58b52b78d05a17','2023-02-15T13:20:47.999+0800','INFO','NONE',NULL,NULL,'成功登录系统','1f33f752805443e59bfe5f8f77481443',NULL,'0',NULL,'2023-02-15 13:20:47'),('a009627f107d4476ac1e7de61266c9b3','2023-02-15T13:20:39.999+0800','INFO','NONE',NULL,NULL,'用户名或密码错误','admin-pl',NULL,'1001',NULL,'2023-02-15 13:20:39'),('a015fbc837d64963b39fc5f79ba01dc2','2023-02-15T13:51:05.999+0800','INFO','NONE',NULL,NULL,'用户已经登录','1f33f752805443e59bfe5f8f77481443',NULL,'0',NULL,'2023-02-15 13:51:05'),('c6ce039ff5644367a66729e3c9ea7d9b','2023-02-15T13:20:32.999+0800','INFO','NONE',NULL,NULL,'已登出','1f33f752805443e59bfe5f8f77481443',NULL,'1007',NULL,'2023-02-15 13:20:32');
/*!40000 ALTER TABLE `sys_pl_log_access` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:11
