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
-- Table structure for table `sys_pl_drm_ds001`
--

DROP TABLE IF EXISTS `sys_pl_drm_ds001`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_pl_drm_ds001` (
  `did` char(32) NOT NULL DEFAULT '' COMMENT '数据源ID',
  `dn` varchar(150) NOT NULL COMMENT '数据源名称',
  `owner` char(32) NOT NULL COMMENT '所有者',
  `dbtype` char(4) NOT NULL COMMENT '数据库类型',
  `en` varchar(32) DEFAULT NULL COMMENT '数据库物理名称',
  `cn` varchar(150) DEFAULT NULL COMMENT '数据库中文名称',
  `dhost` varchar(50) DEFAULT NULL COMMENT 'HOST',
  `dport` decimal(10,0) DEFAULT NULL COMMENT '端口',
  `url` varchar(200) DEFAULT NULL COMMENT 'URL地址',
  `user_name` varchar(50) DEFAULT NULL COMMENT '用户名',
  `pass` varchar(50) DEFAULT NULL COMMENT '密码',
  `flg` char(1) NOT NULL DEFAULT '0' COMMENT '标记',
  `dbsize` decimal(10,0) DEFAULT NULL COMMENT '数据库存储大小',
  `tcount` decimal(10,0) DEFAULT NULL COMMENT '用户表总数量',
  `mark` varchar(600) DEFAULT NULL COMMENT '说明',
  `status` char(1) NOT NULL,
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  `prop` varchar(1000) DEFAULT NULL COMMENT '连接池配置信息',
  `pool_enabled` char(1) DEFAULT NULL COMMENT '连接池是否生效',
  PRIMARY KEY (`did`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='数据库管理';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_pl_drm_ds001`
--

LOCK TABLES `sys_pl_drm_ds001` WRITE;
/*!40000 ALTER TABLE `sys_pl_drm_ds001` DISABLE KEYS */;
INSERT INTO `sys_pl_drm_ds001` VALUES ('00000000000000000000000000000000','平台','a297dfacd7a84eab9656675f61750078','01','a297dfacd7a84eab9656675f61750078','平台','mysql-x',3306,'jdbc:mysql://127.0.0.1:3306/a297dfacd7a84eab9656675f61750078?zeroDateTimeBehavior=convertToNull&characterEncoding=UTF-8','root','root','0',NULL,NULL,'平台DB配置，勿改','1','2014-11-28 17:52:33','2023-02-15 12:46:29',NULL,'0'),('00d5804b55a64ddbbf53327542c43506','测试Postgre数据库','a297dfacd7a84eab9656675f61750078','21','test','test','localhost',5432,'jdbc:postgresql://localhost:5432/test','jym','1111','1',NULL,NULL,NULL,'1','2019-01-22 10:56:39','2019-01-22 10:56:39',NULL,'0'),('0d7e27c10a8940ce9510d7d1d8171419','ES连接测试','a297dfacd7a84eab9656675f61750078','22','es1','ESW','localhost',9200,'jdbc:elasticsearch://http://localhost:9200/','root','123456','1',NULL,NULL,NULL,'1','2021-05-01 10:48:49','2021-05-01 11:03:48',NULL,'0'),('1cf34e8c3c804d1cb5706fe3644acd8e','Test Oracle','a297dfacd7a84eab9656675f61750078','03','xe','ORCL','10.0.0.7',1521,'jdbc:oracle:thin:@10.0.0.7:1521:xe','system','oracle','1',NULL,NULL,NULL,'1','2018-02-13 16:15:16','2018-02-13 16:26:20',NULL,'0'),('1da4fe3bf0904078b249d008d001ed84','TASC数据','3da44270469945f19fa7192c9a6a5d44','01','tasc','TASC','mysql-x',3306,'jdbc:mysql://mysql-x:3306/tasc','root','12345678','1',NULL,NULL,NULL,'1','2021-10-18 16:21:31','2023-02-15 13:26:25',NULL,'0'),('242b1a65f54d48dda6f2c92406889758','xBonson API 数据源','afb9a9a1c80647e6a0d7e807f68e055a','01','afb9a9a1c80647e6a0d7e807f68e055a','脚本数据源','mysql-x',3306,NULL,'pAsBTWVle8','to4ro8pJ(&;E[x8UuMT*EShYkOwpYC','9',NULL,NULL,'由 xBonson 平台生成, 每个机构一个数据源配置, 勿手动修改','1','2017-12-09 10:08:44','2017-12-09 10:08:44',NULL,NULL),('2a151f55be564114a9b897885240cf42','TASC','a297dfacd7a84eab9656675f61750078','01','tasc','轨道交通','mysql-x',3306,'jdbc:mysql://mysql-x:3306/tasc','root','12345678','1',NULL,NULL,NULL,'1','2021-08-23 13:45:53','2023-02-15 13:26:13',NULL,'0'),('3597d6adee514a96b986380527490e09','xBonson API 数据源','3da44270469945f19fa7192c9a6a5d44','1','3da44270469945f19fa7192c9a6a5d44','脚本数据源','mysql-x',3306,'jdbc:mysql://mysql-x:3306/3da44270469945f19fa7192c9a6a5d44?zeroDateTimeBehavior=convertToNull&characterEncoding=UTF-8','root','FYW2Gtd4l7i2o3W5PaqQJ+hKhXs=','9',NULL,NULL,'由 xBonson 平台生成, 每个机构一个数据源配置, 勿手动修改','1','2021-10-18 17:46:15','2021-10-18 19:05:49',NULL,'0'),('3815ba6491c345afa9b3e7a9a0360d14','机构~a297dfacd7a84eab9656675f61750078','a297dfacd7a84eab9656675f61750078','01','a297dfacd7a84eab9656675f61750078','机构~a297dfacd7a84eab9656675f61750078','mysql-x',3306,NULL,'DZwJ1oRuVS/wbA','yACqZbBu4v0vLGBKSJg/HOpAhf/zKLQ+uP34QvRa','9',NULL,NULL,'由 xBonson 平台生成, 每个机构一个数据源配置, 勿手动修改','1','2017-11-22 16:16:50','2017-11-22 16:16:50',NULL,NULL),('3dcce12b2833434bae955e57b44b0070','Test Sqlserver','a297dfacd7a84eab9656675f61750078','02','master','mssql','10.0.0.7',1401,'jdbc:sqlserver://10.0.0.7:1401;databaseName=master','SA','<12345678>','1',NULL,NULL,NULL,'1','2018-02-13 18:01:17','2018-02-13 18:06:40',NULL,'0'),('60d99cddf162410bb0df43ac44ce4541','流程图用连接','61a9ba99b94a4325ac747b4a9263df68','1000','flow-diagram','流程图','mongo-x',27017,NULL,NULL,NULL,'1',NULL,NULL,NULL,'1','2018-12-10 17:37:27','2019-09-17 09:35:17',NULL,'0'),('a2c0311f948f4114aeeefbcd851c4713','ehr','afb9a9a1c80647e6a0d7e807f68e055a','03','DB11G','区域健康档案','172.16.90.224',1521,'jdbc:oracle:thin:@172.16.90.224:1521:DB11G','ehr','11111111','1',NULL,NULL,NULL,'1','2017-01-11 16:16:30','2023-02-15 13:26:36',NULL,'0'),('b1ff36684d6f4821af035014c94ee01b','emr','afb9a9a1c80647e6a0d7e807f68e055a','03','DB11G','区域电子病历','172.16.90.224',1521,'jdbc:oracle:thin:@172.16.90.224:1521:DB11G','emr','emr','1',NULL,NULL,NULL,'1','2017-01-11 16:15:14','2017-02-21 09:03:58','{\r\n\"name\":\"emr\",\r\n\"url\":\"jdbc:oracle:thin:@172.16.90.213:1521:DB11G\",\r\n\"driverClassName\":\"oracle.jdbc.driver.OracleDriver\",\r\n\"username\":\"emr\",\r\n\"password\":\"emr\",\r\n\"filters\":\"stat\",\r\n\"initialSize\":\"5\",\r\n\"minIdle\":\"5\",\r\n\"maxActive\":\"20\",\r\n\"timeBetweenEvictionRunsMillis\":\"20000\",\r\n\"minEvictableIdleTimeMillis\":\"60000\",\r\n\"validationQuery\":\"SELECT sysdate from dual\",\r\n\"validationQueryTimeout\":\"2\",\r\n\"testWhileIdle\":true,\r\n\"testOnBorrow\":false,\r\n\"testOnReturn\":false,\r\n\"poolPreparedStatements\":\"false\",\r\n\"maxOpenPreparedStatements\":\"-1\"\r\n}','1'),('b6134fecd5fc4652bc1402a05c7dcd0b','information_schema','a297dfacd7a84eab9656675f61750078','01','information_schema','information_schema','mysql-x',33066,'jdbc:mysql://127.0.0.1:33066/information_schema?zeroDateTimeBehavior=convertToNull','connuser','dalianzhirong321_A','0',NULL,NULL,NULL,'1','2015-12-30 10:27:27','2016-07-15 14:52:50',NULL,'0'),('b934c895491340f59d2ed7713fe52c03','流程图用连接','a297dfacd7a84eab9656675f61750078','1000','flow-diagram','流程图','mongo-x',27017,NULL,'admin',NULL,'1',NULL,NULL,NULL,'1','2018-08-17 09:41:26','2018-08-17 09:41:26',NULL,'0'),('be2873a626e8401eb38e9511dc40aa86','h3c_mpp_80','a297dfacd7a84eab9656675f61750078','05','test','测试数据库h3c_80','192.168.10.80',5258,'jdbc:mpp://192.168.10.80:5258/test','mpp','h3c','1',NULL,NULL,NULL,'1','2017-01-18 20:19:42','2017-01-18 20:19:42',NULL,'0'),('c3bd9331b608469cbb62d2f16e6a9023','performance_schema','a297dfacd7a84eab9656675f61750078','01','performance_schema','performance_schema','mysql-x',33066,'jdbc:mysql://127.0.0.1:33066/performance_schema?zeroDateTimeBehavior=convertToNull','connuser','dalianzhirong321_A','0',NULL,NULL,NULL,'1','2015-12-30 10:28:47','2016-07-15 14:53:40',NULL,'0'),('d4723f9db3044ba9851af5dc209b1ed7','xBonson API 数据源','61a9ba99b94a4325ac747b4a9263df68','01','61a9ba99b94a4325ac747b4a9263df68','脚本数据源','mysql-x',3306,NULL,'o*9aZ)%3M3-!5$6YBiLevWcg-0SE:(','fR#v![(X:D','9',NULL,NULL,'由 xBonson 平台生成, 每个机构一个数据源配置, 勿手动修改','1','2018-06-28 18:42:03','2018-06-28 18:42:03',NULL,NULL),('d51d355a89bb4736b058c6235b2c8965','区域卫生','a297dfacd7a84eab9656675f61750078','01','bc02994ec23341708e54c97f6b3f9f48','区域卫生','mysql-x',3306,'jdbc:mysql://mysql-x:3306/bc02994ec23341708e54c97f6b3f9f48','root','12345678','1',NULL,NULL,NULL,'1','2016-10-27 17:26:35','2023-02-15 13:25:55',NULL,'0'),('e1deb0e7918b45118d40b759bd57ef40','华检业务数据源','afb9a9a1c80647e6a0d7e807f68e055a','01','qyyws','华检','mysql-x',3306,'jdbc:mysql://mysql-x:3306/qyyws','qyyws','12345678','1',NULL,NULL,NULL,'1','2019-04-03 12:29:48','2023-02-15 13:25:46',NULL,'0'),('e54805a7adc24ca7b7c0384cb73762c9','empi','afb9a9a1c80647e6a0d7e807f68e055a','03','DB11G','人口数据库','172.16.90.224',1521,'jdbc:oracle:thin:@172.16.90.224:1521:DB11G','empi','11111111','1',NULL,NULL,NULL,'1','2017-01-06 16:08:46','2023-02-15 13:27:32',NULL,'0'),('eb56c902785140f49bd66ee5af0926f5','Ora_EMR_20','a297dfacd7a84eab9656675f61750078','03','orcl','区域电子病历','172.16.90.20',1521,'jdbc:oracle:thin:@172.16.90.20:1521:orcl','BSCDR_EMR','11111111','1',NULL,NULL,NULL,'1','2016-12-30 09:32:10','2023-02-15 13:27:24',NULL,'0'),('ed8874bc28454756822a556f52720002','xBonson API 数据源','fd0ec7186f9247daac2b3183b8782081','01','fd0ec7186f9247daac2b3183b8782081','脚本数据源','mysql-x',3306,NULL,'.T`>!mQy5]cD7X#A6Dm(9;)g`;{s#9','@^^8P&_Cad','9',NULL,NULL,'由 xBonson 平台生成, 每个机构一个数据源配置, 勿手动修改','1','2018-05-22 18:21:24','2018-05-22 18:21:24',NULL,NULL),('f3f8b967bd664673a12c3823b007b1a8','localhost','a297dfacd7a84eab9656675f61750078','01','sys','sys','mysql-x',3306,'jdbc:mysql://localhost:3306/sys','root','root','1',NULL,NULL,NULL,'1','2017-11-30 12:46:04','2017-12-15 10:22:29',NULL,'0'),('fa11b7839dfd400f92916e316bc3c429','mysql-data-test','a297dfacd7a84eab9656675f61750078','01','test','测试','mysql-x',3306,'jdbc:mysql://mysql-x:3306/test','root','root','1',NULL,NULL,'生成测试数据用','1','2020-02-04 10:32:39','2020-02-04 10:32:39',NULL,'0'),('fca1d3990b394fb3a5493460bc94e9e4','xBonson API 数据源','bc02994ec23341708e54c97f6b3f9f48','1','bc02994ec23341708e54c97f6b3f9f48','脚本数据源','127.0.0.1',3306,NULL,'^MR4y4n100XcGL_.$$~LP$\"cc|4Hc)','Ase\"xp5m~}','9',NULL,NULL,'由 xBonson 平台生成, 每个机构一个数据源配置, 勿手动修改','1','2019-05-28 12:45:56','2019-05-28 12:45:56',NULL,NULL);
/*!40000 ALTER TABLE `sys_pl_drm_ds001` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:09
