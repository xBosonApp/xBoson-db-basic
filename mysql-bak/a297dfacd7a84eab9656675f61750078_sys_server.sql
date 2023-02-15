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
-- Table structure for table `sys_server`
--

DROP TABLE IF EXISTS `sys_server`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_server` (
  `serverid` char(32) NOT NULL COMMENT '服务器ID',
  `servernm` varchar(50) NOT NULL COMMENT '服务器名称',
  `server_v` varchar(20) NOT NULL COMMENT '运行服务版本',
  `server_type` varchar(100) NOT NULL COMMENT '服务器类型：平台运行，平台服务，缓存，MQ，数据库，代理服务器，ETL服务器，ESB，前置机，路由器，其他',
  `server_type_detail` varchar(100) DEFAULT NULL COMMENT '服务器容器：Tomcat，Node，Redis，ActiveMQ，MySQL，Nginx，Kettle，MuleESB 等',
  `inner_ip` varchar(15) NOT NULL COMMENT '内网IP',
  `inner_port` varchar(5) NOT NULL COMMENT '内网端口',
  `outer_ip` varchar(15) DEFAULT NULL COMMENT '外网IP',
  `outer_port` varchar(5) DEFAULT NULL COMMENT '外网端口',
  `mac` varchar(17) DEFAULT NULL COMMENT 'MAC地址',
  `cpu_core_count` int(11) DEFAULT NULL COMMENT '所在系统分配CPU核心数',
  `memory_size` int(11) DEFAULT NULL COMMENT '所在系统分配内存大小（GB）',
  `disc_space` int(11) DEFAULT NULL COMMENT '所在系统分配硬盘大小（GB）',
  `virtual` char(1) DEFAULT NULL COMMENT '是否在虚拟机上',
  `os` varchar(50) DEFAULT NULL COMMENT '操作系统',
  `pic_pid` char(32) DEFAULT NULL COMMENT '负责人PID',
  `pic_name` varchar(50) DEFAULT NULL COMMENT '负责人姓名',
  `pic_tel` varchar(20) DEFAULT NULL COMMENT '负责人手机号码',
  `server_desc` varchar(200) DEFAULT NULL COMMENT '服务器描述',
  `in_use` char(1) DEFAULT NULL COMMENT '是否在使用中',
  `abolish_time` datetime DEFAULT NULL COMMENT '废弃时间',
  `status` char(1) DEFAULT NULL COMMENT '状态',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`serverid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='服务器信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_server`
--

LOCK TABLES `sys_server` WRITE;
/*!40000 ALTER TABLE `sys_server` DISABLE KEYS */;
INSERT INTO `sys_server` VALUES ('b47750f4509a43b2b31a205b0ccd641e','Proxy','1.6.2','05','Nginx','127.0.0.1','8088',NULL,NULL,NULL,2,8,350,'0','CentOS 6.6','1f33f752805443e59bfe5f8f77481443','平台管理员',NULL,'主代理服务器','0',NULL,'1','2016-09-08 12:11:40','2016-09-08 12:11:40'),('d68761a3ac544bb9bfd46934f0e337ce','Cache','2.8.0','02','Redis','127.0.0.1','6370',NULL,NULL,NULL,2,8,450,'0','CentOS 6.6','1f33f752805443e59bfe5f8f77481443','平台管理员',NULL,'缓存服务器，与MQ服务器共享','0',NULL,'1','2016-09-08 12:11:40','2016-09-08 12:11:40'),('e6837147d33d43e1883da0308900f212','Core','1.0.0','01','Tomcat','127.0.0.1','8080',NULL,NULL,NULL,2,16,150,'0','CentOS 6.6','1f33f752805443e59bfe5f8f77481443','平台管理员',NULL,'平台核心服务器','0',NULL,'1','2016-09-08 12:11:40','2016-09-08 12:11:40');
/*!40000 ALTER TABLE `sys_server` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:29
