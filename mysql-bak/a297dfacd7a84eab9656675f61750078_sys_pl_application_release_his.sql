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
-- Table structure for table `sys_pl_application_release_his`
--

DROP TABLE IF EXISTS `sys_pl_application_release_his`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_pl_application_release_his` (
  `applicationid` char(32) NOT NULL COMMENT '应用ID',
  `hisid` char(32) NOT NULL COMMENT '历史ID',
  `mark` varchar(255) DEFAULT NULL COMMENT '更新描述',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`applicationid`,`hisid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='发布应用历史表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_pl_application_release_his`
--

LOCK TABLES `sys_pl_application_release_his` WRITE;
/*!40000 ALTER TABLE `sys_pl_application_release_his` DISABLE KEYS */;
INSERT INTO `sys_pl_application_release_his` VALUES ('26afd358b6144309bec99b2628ae26c7','e925a9b8f73f4e4589267e210125a2df','初始提交','2018-06-28 15:48:17'),('26afd358b6144309bec99b2628ae26c7','f63daf684509416ba13e8f6c6e1cdc03','同步数据源和智能配置权限','2022-03-01 23:40:19'),('26afd358b6144309bec99b2628ae26c7','f7b7d3c14f5e4379bfb740fb96a75042','增加数据源和智能配置权限','2022-03-01 23:31:16'),('4d00f20b10ac419184010674174032ef','51a6eacf6ec047e5b3ac3f9259f176da','初始提交','2019-04-04 20:43:32'),('516470de79b44b3ba57911c30956efa6','7dd1c75745cd49a695c182c4a69e9c1a','初始提交','2018-06-28 15:58:38'),('6ffea177f3944bf1ab8fabf7707780f8','485ea16174ca4598ba1b738de34d8540','初始提交','2021-11-06 11:54:53'),('70d6b73e9fd74b1293127f2c126eef18','5a5dbec0bb0d4ab98053eb442c589d13','初始提交','2018-06-28 15:46:50'),('70d6b73e9fd74b1293127f2c126eef18','f35687ebb6134ea9ad089fdfbc8e8ad8','更新元数据管理菜单','2018-06-28 18:01:28'),('b630b6d72d7c42aab1325ebb15f378d5','03e2fe300f524a5fb83b1ad556c6332a','增加跨平台用户管理','2019-04-04 20:40:34'),('b630b6d72d7c42aab1325ebb15f378d5','87950c89708847969065c0bd49df3302','追加用户重置随机密码API','2018-07-03 16:53:38'),('b630b6d72d7c42aab1325ebb15f378d5','a5843281713b41cd998e81a933b6e0fe','初始提交','2018-06-28 15:44:52'),('b68b40afaa354f6d8044c891f61cafd9','0a086016f9b542528dd18601fced6833','初始提交','2018-06-28 15:59:17'),('bbd8c3863a754994b4fe29407d4d218a','2fa6c83d54a444fdbdd0fae4ffd8ec9d','更新','2018-12-10 09:50:06'),('bbd8c3863a754994b4fe29407d4d218a','3cf9eadd79124060af0b7c61aef20812','更新','2018-06-28 20:09:16'),('bbd8c3863a754994b4fe29407d4d218a','43bb62569f9e4383b7c7c21305cde761','更新','2018-06-28 19:11:12'),('bbd8c3863a754994b4fe29407d4d218a','4c145eb6500f44efb9396196e90018ac','fd','2018-12-11 13:59:56'),('bbd8c3863a754994b4fe29407d4d218a','68c2cd3564ae41d08b9ae559a38e7533','f','2018-12-13 12:17:28'),('bbd8c3863a754994b4fe29407d4d218a','755543cf98364631b8c45d2b9d92f34d','初始提交','2018-06-28 17:41:01'),('bbd8c3863a754994b4fe29407d4d218a','8f7940664a3a4f2aa77494679ac005e8','xxxxx','2018-12-12 21:13:15'),('bbd8c3863a754994b4fe29407d4d218a','c424684821054cc49758bca275ba205d','f','2018-12-13 13:09:23'),('bbd8c3863a754994b4fe29407d4d218a','ca74c784f5f94059adfeb69573c41cba','的说法','2018-12-10 10:27:57'),('bbd8c3863a754994b4fe29407d4d218a','e638f4ea02934b4aa2d0822790ccb1ab','xx','2018-12-11 14:16:18'),('bbd8c3863a754994b4fe29407d4d218a','f0d9579a90f740b88660648fe53b6489','fdsafdsaf','2018-12-10 10:19:40'),('c9a7bc44ff794ce791a1e45dfc51cd1e','4434e4e5d738477f95d371ebffe71909','初始提交','2018-06-28 15:56:49'),('c9a7bc44ff794ce791a1e45dfc51cd1e','4afb4f642abb40cf8e44db6e71511ccb','追加人员查询API','2018-07-03 15:32:30'),('c9a7bc44ff794ce791a1e45dfc51cd1e','57d8fce7d6b441b9a1296b1a42a89802','权限更新','2018-07-03 15:30:20'),('c9a7bc44ff794ce791a1e45dfc51cd1e','605137d78ce04f87906b5444ce1d4b19','更新权限','2018-07-03 15:23:28'),('c9a7bc44ff794ce791a1e45dfc51cd1e','6a0473d3b3c74913abbdcd9d988ee1cf','应用名称修改','2018-06-28 17:43:35'),('c9a7bc44ff794ce791a1e45dfc51cd1e','6a44fdb57d21494bad042c0cbc75d36f','追加刷新角色缓存API','2018-07-03 15:46:04'),('c9a7bc44ff794ce791a1e45dfc51cd1e','8eccdb1503cf46c9bf2428333f6399a7','x','2018-12-14 15:39:51'),('c9a7bc44ff794ce791a1e45dfc51cd1e','954dd2439cfb4c81bf3148dab7871a86','xx','2018-12-14 15:40:34'),('d286b8a9e58344f7ba1faa060aeb579a','05e9d98172f94888a4ccf9c33e0dea27','修正API服务','2018-05-24 21:35:17'),('d286b8a9e58344f7ba1faa060aeb579a','0754d9f8e4014ba7b6e7aa8477fa1173','修改应用名称','2018-05-24 18:45:20'),('d286b8a9e58344f7ba1faa060aeb579a','332bfdd19ebf4027b1092165401f7335','更新角色权限管理','2018-05-24 21:53:10'),('d286b8a9e58344f7ba1faa060aeb579a','375ccf627d7d447c8f5236d191dc1cad','初始提交','2018-05-24 18:44:03'),('d286b8a9e58344f7ba1faa060aeb579a','6c7563b4651e4c7984fcb5e7b12ef885','更新菜单项，增加【服务管理】','2021-07-15 11:28:31'),('d286b8a9e58344f7ba1faa060aeb579a','8bba2e4f2db742a7a07f501541f29fd6','fdsafasd','2018-12-10 17:20:42'),('d286b8a9e58344f7ba1faa060aeb579a','9b7a62d340ff4ecf9d31ebaaad065c34','更新管理员角色','2018-05-24 22:23:15'),('d286b8a9e58344f7ba1faa060aeb579a','d1452a94cdb94dfd9f83ac6064d6d5b6','fdsafsadf','2019-01-12 14:48:31'),('d286b8a9e58344f7ba1faa060aeb579a','eddffd1c8452418cbc3c0dbe59c70bdb','同步测试','2018-05-24 18:52:22'),('d8fe5c4eac8043058c9417feb496b453','3492764cd0874ab180c4ae9fadda27cd','更新','2018-12-10 09:48:19'),('d8fe5c4eac8043058c9417feb496b453','b76c6d3223e84cc1ad2207e9c3af6aed','添加用户管理权限','2016-10-28 18:43:17'),('d8fe5c4eac8043058c9417feb496b453','c30534079126483b965fed3c4c0ac23d','菜单更新','2016-09-20 15:36:27'),('d8fe5c4eac8043058c9417feb496b453','d6a788367c404149bae98a5e5f542504','菜单修改','2017-03-01 13:35:36'),('d8fe5c4eac8043058c9417feb496b453','dfc83a3157114ca082f40c1155fdd862','添加共享服务管理','2016-11-29 13:50:37'),('d8fe5c4eac8043058c9417feb496b453','e0fb8131f3a941f89e63e0bfc0053c25','初始提交','2016-09-19 09:50:59'),('d8fe5c4eac8043058c9417feb496b453','e66a4abba1ea42e5b3014eca3dad64cc','20170227-BI API 元数据 数据集 值域代码','2017-02-27 12:59:25'),('d8fe5c4eac8043058c9417feb496b453','e88f035cd015421099c482b4b4feb17a','API更新','2016-11-29 15:13:31'),('d8fe5c4eac8043058c9417feb496b453','ea05f6b305c347a1a0f4db0bd118db61','服务更新','2016-09-23 09:52:26'),('d8fe5c4eac8043058c9417feb496b453','ebcb922a8a174a5f856f942bf5ba80f6','删除公共服务','2016-09-19 10:14:37'),('d8fe5c4eac8043058c9417feb496b453','ec56b89c7f6d45a3b9328b73151a7170','API更新','2016-11-29 10:31:17'),('d8fe5c4eac8043058c9417feb496b453','edad0baf37a54f5d9d6b0114031b0f83','API更新','2016-11-29 10:32:01'),('d8fe5c4eac8043058c9417feb496b453','f05db08dfc764b69805cb14209ebf9bf','更新API','2016-11-29 10:47:42'),('d8fe5c4eac8043058c9417feb496b453','f16a709898f04a26a28b2d0057f10dba','更新菜单','2016-12-30 10:12:24'),('f98f0bdf736b4c339c14d0d3a4e39c6a','386c625868f249e5a4c8e47df0989aae','初始提交','2018-06-28 15:57:26'),('f98f0bdf736b4c339c14d0d3a4e39c6a','b7b021c6a89741ada6d94c1d08c8aa14','应用名称修改','2018-06-28 17:44:44'),('f9ec8b2b45d24971abede79886e9235f','120305ffff2f41be9065b8da2d6736db','发布角色','2018-12-10 09:35:30'),('f9ec8b2b45d24971abede79886e9235f','3d01fa0a3fab4a17a1cc216030be9b4e','ffffff','2019-01-12 14:38:53'),('f9ec8b2b45d24971abede79886e9235f','471a709a232f48849f7ea577c286ea9e','更新','2018-12-10 09:39:41'),('f9ec8b2b45d24971abede79886e9235f','72fa1dd3040d42d38fb10a9c2af57cd5','111','2019-01-12 14:45:22'),('f9ec8b2b45d24971abede79886e9235f','74b3818e0c044e85a7b8116e75df7b3e','跟新','2018-12-10 09:38:13'),('f9ec8b2b45d24971abede79886e9235f','b1f4dbe2799b4e618cb90ee8cf4bcef8','菜单修改','2017-03-01 13:35:53'),('f9ec8b2b45d24971abede79886e9235f','cde21789496e49eeb78551103fed47ec','更新','2017-02-16 20:44:14'),('f9ec8b2b45d24971abede79886e9235f','d4ef2ef04b7448888d67c3f3709a56aa','初始提交','2016-11-29 14:42:56'),('f9ec8b2b45d24971abede79886e9235f','dd53856c6eff487284108889b4ed7c68','更新图表工具','2017-02-16 20:30:15'),('f9ec8b2b45d24971abede79886e9235f','f7842d7755ef44aa9ae180f23898ae28','20170227-BI API 元数据 数据集 值域代码','2017-02-27 12:59:12');
/*!40000 ALTER TABLE `sys_pl_application_release_his` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:06
