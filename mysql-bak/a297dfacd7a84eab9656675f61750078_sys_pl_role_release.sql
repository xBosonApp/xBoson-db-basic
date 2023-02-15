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
-- Table structure for table `sys_pl_role_release`
--

DROP TABLE IF EXISTS `sys_pl_role_release`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_pl_role_release` (
  `roleid` char(32) NOT NULL COMMENT '角色ID',
  `rolenm` varchar(100) DEFAULT NULL COMMENT '角色名',
  `role_desc` varchar(200) DEFAULT NULL COMMENT '角色描述',
  `applicationid` char(32) NOT NULL COMMENT '应用ID',
  `local_roleid` char(32) DEFAULT NULL COMMENT '发布机构本地角色ID',
  `status` char(1) NOT NULL COMMENT '状态 0无效1有效',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`roleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='发布角色表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_pl_role_release`
--

LOCK TABLES `sys_pl_role_release` WRITE;
/*!40000 ALTER TABLE `sys_pl_role_release` DISABLE KEYS */;
INSERT INTO `sys_pl_role_release` VALUES ('01ae3380619941afa4d4890dfae208b1','数据分析角色','','d286b8a9e58344f7ba1faa060aeb579a','6c3192de078540c18538252b5795cce1','1','2018-05-24 18:44:03','2018-05-24 18:44:03'),('120b89d899cd4ac3a67b376eb49c56a9','数据交换服务','','bbd8c3863a754994b4fe29407d4d218a','d23a15ad0f404708b32b5a1930a8b196','1','2018-06-28 17:41:01','2018-06-28 17:41:01'),('1900d59f3f124ecf92bbece610f96e49','开发者','','d286b8a9e58344f7ba1faa060aeb579a','bbf9908b0cbc4df8bea7c12855a3217e','1','2018-05-24 18:44:03','2018-05-24 18:44:03'),('2a1c203ff283475ca39e669fed0b5c4a','集成开发角色',NULL,'b68b40afaa354f6d8044c891f61cafd9','4c52a5e45aeb424cbf0bc1adf97d50e8','1','2018-06-28 15:59:17','2018-06-28 15:59:17'),('36cb3283d8cd4a459c47049082502e68','知识图谱',NULL,'6ffea177f3944bf1ab8fabf7707780f8','ea873dded23446f9b32e3c1e3a55e4a0','1','2021-11-06 11:54:53','2021-11-06 11:54:53'),('40103c9cb24e483cbfe5bd249feddb5f','互联网使用者','','bbd8c3863a754994b4fe29407d4d218a','1439f4b35f874c9b89d2ab1efd135bff','1','2018-12-10 09:50:06','2018-12-10 09:50:06'),('436ec7060fd94aefbaba120c0ec53883','匿名用户','','f9ec8b2b45d24971abede79886e9235f','e86f6eb53bd34a4f9e49b0ab83a016d2','1','2018-12-10 09:35:30','2018-12-10 09:35:30'),('499d94c8e57949e6a738588a3a5f3192','信息标准管理角色','','70d6b73e9fd74b1293127f2c126eef18','aeac3d92a3b94c02aea482ce12fa78db','1','2018-06-28 15:46:50','2018-06-28 15:46:50'),('5b2ffa5a9f1f4e7792f94f4d96036ff1','用户','','d286b8a9e58344f7ba1faa060aeb579a','a0f9f62d3f6c47289615103b31dca3d5','1','2018-05-24 18:44:03','2018-05-24 18:44:03'),('63886f5fbbab41c5b2fab8250569c504','管理角色','','d286b8a9e58344f7ba1faa060aeb579a','beb0c24fa27649bb920171eb55036c53','1','2018-05-24 18:44:03','2018-05-24 18:44:03'),('7712827b94a243d094e44226f1a659ef','开发管理角色','','d286b8a9e58344f7ba1faa060aeb579a','900cfc6b13fa4b09a41be31b411a1bdb','1','2018-05-24 18:44:03','2018-05-24 18:44:03'),('7aa642ebe5cb489fa230092b30c87e87','数据分析角色',NULL,'516470de79b44b3ba57911c30956efa6','6c3192de078540c18538252b5795cce1','1','2018-06-28 15:58:38','2018-06-28 15:58:38'),('875bce56b98c447ebc482dda3fcb2d1d','管理角色','','b630b6d72d7c42aab1325ebb15f378d5','beb0c24fa27649bb920171eb55036c53','1','2018-06-28 15:44:52','2018-06-28 15:44:52'),('97269b329316460c989d4c62fd7adfa5','互联网使用者','','f9ec8b2b45d24971abede79886e9235f','1439f4b35f874c9b89d2ab1efd135bff','1','2018-12-10 09:35:30','2018-12-10 09:35:30'),('9891d5aec2914956958d16d95ccaa48e','匿名用户','','bbd8c3863a754994b4fe29407d4d218a','e86f6eb53bd34a4f9e49b0ab83a016d2','1','2018-12-10 09:50:06','2018-12-10 09:50:06'),('be2da992fdd449c2a114b7f84ea83de1','用户','','f9ec8b2b45d24971abede79886e9235f','a0f9f62d3f6c47289615103b31dca3d5','1','2019-01-12 14:38:53','2019-01-12 14:38:53'),('bfa79c99893149dbaad19ec8d0f9ee4d','跨机构用户管理',NULL,'4d00f20b10ac419184010674174032ef','02256cd3d184477aaaf6e330bb8c71f7','1','2019-04-04 20:43:32','2019-04-04 20:43:32'),('c7c7b96c0dc04d87bfa0c585c9af0003','平台运维角色','','26afd358b6144309bec99b2628ae26c7','c5f6b53a47ce4705b03d9a0903447e25','1','2018-06-28 15:48:17','2018-06-28 15:48:17'),('c8fb803c1cbd4dcb91a185afbd485cbd','信息标准管理角色','','d286b8a9e58344f7ba1faa060aeb579a','aeac3d92a3b94c02aea482ce12fa78db','1','2018-05-24 18:44:03','2018-05-24 18:44:03'),('cb1756c256f34cea9fb245c36bf72829','跨机构用户管理',NULL,'b630b6d72d7c42aab1325ebb15f378d5','02256cd3d184477aaaf6e330bb8c71f7','1','2019-04-04 20:40:34','2019-04-04 20:40:34'),('d020268f191448908f0f9e98f89406a1','开发者','','f98f0bdf736b4c339c14d0d3a4e39c6a','bbf9908b0cbc4df8bea7c12855a3217e','1','2018-06-28 15:57:26','2018-06-28 15:57:26'),('d24ae1e56734459d9722974064a21634','管理角色','','d8fe5c4eac8043058c9417feb496b453','beb0c24fa27649bb920171eb55036c53','1','2016-09-19 10:39:50','2016-09-19 10:39:50'),('df13c75d8fa54304b910ebb6bef1bd49','演示应用角色','','f9ec8b2b45d24971abede79886e9235f','a8abfb2ecb084d7784f125b7d0a2ccb5','1','2016-11-29 14:42:56','2016-11-29 14:42:56'),('e808291fae3c43698757c35f5313a94a','开发管理角色','','c9a7bc44ff794ce791a1e45dfc51cd1e','900cfc6b13fa4b09a41be31b411a1bdb','1','2018-06-28 15:56:49','2018-06-28 15:56:49'),('eb4962efc6e848f692de562888c31aad','开发者','','d8fe5c4eac8043058c9417feb496b453','bbf9908b0cbc4df8bea7c12855a3217e','1','2016-09-19 10:39:50','2016-09-19 10:39:50'),('fe506296f5ee4023bd6b48c5fa1393ca','数据源配置者',NULL,'26afd358b6144309bec99b2628ae26c7','b0b46fc9d8aa475ebce6723ac71e37f2','1','2022-03-01 23:40:19','2022-03-01 23:40:19');
/*!40000 ALTER TABLE `sys_pl_role_release` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:22
