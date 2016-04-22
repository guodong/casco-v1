-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016-04-22 03:27:41
-- 服务器版本： 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `cascodb`
--

-- --------------------------------------------------------

--
-- 表的结构 `testjob_tmp`
--

CREATE TABLE IF NOT EXISTS `testjob_tmp` (
  `id` varchar(40) NOT NULL COMMENT 'key',
  `name` varchar(40) NOT NULL,
  `details` text NOT NULL,
  `size` int(11) NOT NULL,
  `type` varchar(30) NOT NULL,
  `path` text NOT NULL,
  `project_id` varchar(40) NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `testjob_tmp`
--

INSERT INTO `testjob_tmp` (`id`, `name`, `details`, `size`, `type`, `path`, `project_id`, `created_at`, `updated_at`) VALUES
('3573b3f0-140a-43e9-bc7e-da0b87cf76a3', 'heheda1321', '12345', 8704, 'xls', 'E:\\wamp\\www\\casco-api\\public/exceltpls/5716356e63388.xls', 'a8c6d18b-fa8a-4144-82f3-e138edfb40a3', '2016-04-19 13:41:02', '2016-04-19 13:42:10'),
('5a67c83d-2800-4085-9622-77f5070db98e', '2341', '1234', 5632, 'xls', 'E:\\wamp\\www\\casco-api\\public/exceltpls/57163485255f1.xls', 'a8c6d18b-fa8a-4144-82f3-e138edfb40a3', '2016-04-19 13:37:09', '2016-04-19 13:37:09'),
('790567b8-4cf6-4d4c-a224-864ee2134489', 'name', '', 0, '', '', '', '2016-04-18 07:00:01', '2016-04-18 07:00:01'),
('81cdeab4-ac39-4849-a53f-88c747d2b5a4', 'name', '', 0, '', '', '', '2016-04-18 06:59:01', '2016-04-18 06:59:01');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
