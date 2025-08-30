-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 30, 2025 at 06:58 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `JUST`
--

-- --------------------------------------------------------

--
-- Table structure for table `BatteryMaintenance`
--

CREATE TABLE `BatteryMaintenance` (
  `id` int(11) NOT NULL,
  `serial_number` varchar(255) DEFAULT NULL,
  `maintenance_date` date DEFAULT NULL,
  `battery_condition` tinyint(1) DEFAULT NULL,
  `no_leakage` tinyint(1) DEFAULT NULL,
  `easily_seated` tinyint(1) DEFAULT NULL,
  `adequate_level` tinyint(1) DEFAULT NULL,
  `secure_connections` tinyint(1) DEFAULT NULL,
  `charger_functions` tinyint(1) DEFAULT NULL,
  `display_functions` tinyint(1) DEFAULT NULL,
  `accurate_indicators` tinyint(1) DEFAULT NULL,
  `no_flickering` tinyint(1) DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `BatteryMaintenance`
--

INSERT INTO `BatteryMaintenance` (`id`, `serial_number`, `maintenance_date`, `battery_condition`, `no_leakage`, `easily_seated`, `adequate_level`, `secure_connections`, `charger_functions`, `display_functions`, `accurate_indicators`, `no_flickering`, `comments`, `name`, `designation`) VALUES
(1, 'JUS/RJ/V3/002', '2025-07-29', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'hello', 'testdata', NULL),
(2, 'JUS/RJ/V3/009', '2025-07-29', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'ehehdabfaSDFadgsdG', 'testdata', 'yoo'),
(3, 'JUS/RJ/V3/001', '2024-08-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 1', 'Specialist'),
(4, 'JUS/RJ/V3/001', '2024-09-10', 1, 0, 1, 1, 1, 1, 1, 1, 0, 'Auto-entry', 'Tech 1', 'Specialist'),
(5, 'JUS/RJ/V3/001', '2024-10-10', 0, 1, 1, 0, 1, 1, 1, 0, 1, 'Auto-entry', 'Tech 1', 'Specialist'),
(6, 'JUS/RJ/V3/001', '2024-11-10', 1, 1, 0, 1, 0, 1, 0, 1, 1, 'Auto-entry', 'Tech 1', 'Specialist'),
(7, 'JUS/RJ/V3/001', '2025-01-10', 1, 0, 1, 1, 1, 1, 1, 1, 0, 'Auto-entry', 'Tech 1', 'Specialist'),
(8, 'JUS/RJ/V3/001', '2025-02-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 1', 'Specialist'),
(9, 'JUS/RJ/V3/001', '2025-03-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 1', 'Specialist'),
(10, 'JUS/RJ/V3/001', '2025-04-10', 0, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 1', 'Specialist'),
(11, 'JUS/RJ/V3/001', '2025-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 1', 'Specialist'),
(12, 'JUS/RJ/V3/002', '2024-08-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 2', 'Specialist'),
(13, 'JUS/RJ/V3/002', '2024-09-10', 1, 0, 1, 1, 1, 1, 1, 1, 0, 'Auto-entry', 'Tech 2', 'Specialist'),
(14, 'JUS/RJ/V3/002', '2024-11-10', 1, 1, 0, 1, 0, 1, 0, 1, 1, 'Auto-entry', 'Tech 2', 'Specialist'),
(15, 'JUS/RJ/V3/002', '2024-12-10', 1, 1, 1, 1, 1, 0, 1, 1, 1, 'Auto-entry', 'Tech 2', 'Specialist'),
(16, 'JUS/RJ/V3/002', '2025-01-10', 1, 0, 1, 1, 1, 1, 1, 1, 0, 'Auto-entry', 'Tech 2', 'Specialist'),
(17, 'JUS/RJ/V3/002', '2025-02-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 2', 'Specialist'),
(18, 'JUS/RJ/V3/002', '2025-04-10', 0, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 2', 'Specialist'),
(19, 'JUS/RJ/V3/002', '2025-05-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 2', 'Specialist'),
(20, 'JUS/RJ/V3/002', '2025-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 2', 'Specialist'),
(21, 'JUS/RJ/V3/003', '2024-09-10', 1, 0, 1, 1, 1, 1, 1, 1, 0, 'Auto-entry', 'Tech 3', 'Specialist'),
(22, 'JUS/RJ/V3/003', '2024-10-10', 0, 1, 1, 0, 1, 1, 1, 0, 1, 'Auto-entry', 'Tech 3', 'Specialist'),
(23, 'JUS/RJ/V3/003', '2024-11-10', 1, 1, 0, 1, 0, 1, 0, 1, 1, 'Auto-entry', 'Tech 3', 'Specialist'),
(24, 'JUS/RJ/V3/003', '2024-12-10', 1, 1, 1, 1, 1, 0, 1, 1, 1, 'Auto-entry', 'Tech 3', 'Specialist'),
(25, 'JUS/RJ/V3/003', '2025-01-10', 1, 0, 1, 1, 1, 1, 1, 1, 0, 'Auto-entry', 'Tech 3', 'Specialist'),
(26, 'JUS/RJ/V3/003', '2025-02-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 3', 'Specialist'),
(27, 'JUS/RJ/V3/003', '2025-03-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 3', 'Specialist'),
(28, 'JUS/RJ/V3/003', '2025-04-10', 0, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 3', 'Specialist'),
(29, 'JUS/RJ/V3/003', '2025-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 3', 'Specialist'),
(30, 'JUS/RJ/V3/003', '2025-07-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 3', 'Specialist'),
(31, 'JUS/RJ/V3/004', '2024-08-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 4', 'Specialist'),
(32, 'JUS/RJ/V3/004', '2024-11-10', 1, 1, 0, 1, 0, 1, 0, 1, 1, 'Auto-entry', 'Tech 4', 'Specialist'),
(33, 'JUS/RJ/V3/004', '2025-01-10', 1, 0, 1, 1, 1, 1, 1, 1, 0, 'Auto-entry', 'Tech 4', 'Specialist'),
(34, 'JUS/RJ/V3/004', '2025-02-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 4', 'Specialist'),
(35, 'JUS/RJ/V3/004', '2025-03-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 4', 'Specialist'),
(36, 'JUS/RJ/V3/004', '2025-04-10', 0, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 4', 'Specialist'),
(37, 'JUS/RJ/V3/004', '2025-05-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 4', 'Specialist'),
(38, 'JUS/RJ/V3/004', '2025-07-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 4', 'Specialist'),
(39, 'JUS/RJ/V3/005', '2024-08-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 5', 'Specialist'),
(40, 'JUS/RJ/V3/005', '2024-09-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 5', 'Specialist'),
(41, 'JUS/RJ/V3/005', '2024-12-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 5', 'Specialist'),
(42, 'JUS/RJ/V3/005', '2025-01-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 5', 'Specialist'),
(43, 'JUS/RJ/V3/005', '2025-02-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 5', 'Specialist'),
(44, 'JUS/RJ/V3/005', '2025-03-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 5', 'Specialist'),
(45, 'JUS/RJ/V3/005', '2025-04-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 5', 'Specialist'),
(46, 'JUS/RJ/V3/005', '2025-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 5', 'Specialist'),
(47, 'JUS/RJ/V3/005', '2025-07-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 5', 'Specialist'),
(48, 'JUS/RJ/V3/006', '2024-08-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 6', 'Specialist'),
(49, 'JUS/RJ/V3/006', '2024-11-10', 1, 0, 1, 1, 0, 1, 1, 1, 0, 'Auto-entry', 'Tech 6', 'Specialist'),
(50, 'JUS/RJ/V3/006', '2025-03-10', 1, 1, 1, 1, 1, 1, 1, 0, 1, 'Auto-entry', 'Tech 6', 'Specialist'),
(51, 'JUS/RJ/V3/006', '2025-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 6', 'Specialist'),
(52, 'JUS/RJ/V3/007', '2024-09-10', 1, 1, 0, 1, 1, 0, 1, 1, 1, 'Auto-entry', 'Tech 7', 'Specialist'),
(53, 'JUS/RJ/V3/007', '2025-01-10', 1, 1, 1, 0, 1, 1, 1, 1, 0, 'Auto-entry', 'Tech 7', 'Specialist'),
(54, 'JUS/RJ/V3/007', '2025-05-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 7', 'Specialist'),
(55, 'JUS/RJ/V3/007', '2025-07-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 7', 'Specialist'),
(56, 'JUS/RJ/V3/008', '2024-10-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 8', 'Specialist'),
(57, 'JUS/RJ/V3/008', '2024-12-10', 1, 1, 1, 1, 0, 1, 1, 0, 1, 'Auto-entry', 'Tech 8', 'Specialist'),
(58, 'JUS/RJ/V3/008', '2025-04-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 8', 'Specialist'),
(59, 'JUS/RJ/V3/008', '2025-07-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 8', 'Specialist'),
(60, 'JUS/RJ/V3/009', '2024-08-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 9', 'Specialist'),
(61, 'JUS/RJ/V3/009', '2024-10-10', 0, 1, 1, 1, 1, 1, 0, 1, 1, 'Auto-entry', 'Tech 9', 'Specialist'),
(62, 'JUS/RJ/V3/009', '2025-02-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 9', 'Specialist'),
(63, 'JUS/RJ/V3/009', '2025-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 9', 'Specialist'),
(64, 'JUS/RJ/V3/010', '2024-09-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 10', 'Specialist'),
(65, 'JUS/RJ/V3/010', '2025-01-10', 1, 1, 1, 1, 0, 1, 1, 1, 1, 'Auto-entry', 'Tech 10', 'Specialist'),
(66, 'JUS/RJ/V3/010', '2025-05-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 10', 'Specialist'),
(67, 'JUS/RJ/V3/010', '2025-07-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 10', 'Specialist'),
(68, 'JUS/RJ/V3/011', '2024-08-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 11', 'Specialist'),
(69, 'JUS/RJ/V3/011', '2024-11-10', 1, 1, 0, 1, 1, 1, 1, 0, 1, 'Auto-entry', 'Tech 11', 'Specialist'),
(70, 'JUS/RJ/V3/011', '2025-01-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 11', 'Specialist'),
(71, 'JUS/RJ/V3/011', '2025-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 11', 'Specialist'),
(72, 'JUS/RJ/V3/012', '2024-09-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 12', 'Specialist'),
(73, 'JUS/RJ/V3/012', '2024-12-10', 1, 1, 1, 0, 1, 1, 1, 1, 0, 'Auto-entry', 'Tech 12', 'Specialist'),
(74, 'JUS/RJ/V3/012', '2025-03-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 12', 'Specialist'),
(75, 'JUS/RJ/V3/012', '2025-07-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 12', 'Specialist'),
(76, 'JUS/RJ/V3/013', '2024-08-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 13', 'Specialist'),
(77, 'JUS/RJ/V3/013', '2025-02-10', 1, 1, 0, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 13', 'Specialist'),
(78, 'JUS/RJ/V3/013', '2025-04-10', 1, 1, 1, 1, 1, 1, 1, 0, 1, 'Auto-entry', 'Tech 13', 'Specialist'),
(79, 'JUS/RJ/V3/013', '2025-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 13', 'Specialist'),
(80, 'JUS/RJ/V3/014', '2024-10-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 14', 'Specialist'),
(81, 'JUS/RJ/V3/014', '2025-01-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 14', 'Specialist'),
(82, 'JUS/RJ/V3/014', '2025-03-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 14', 'Specialist'),
(83, 'JUS/RJ/V3/014', '2025-07-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 14', 'Specialist'),
(84, 'JUS/RJ/V3/015', '2024-09-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 15', 'Specialist'),
(85, 'JUS/RJ/V3/015', '2024-11-10', 1, 0, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 15', 'Specialist'),
(86, 'JUS/RJ/V3/015', '2025-04-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 15', 'Specialist'),
(87, 'JUS/RJ/V3/015', '2025-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 15', 'Specialist'),
(88, 'JUS/RJ/V3/016', '2024-08-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 16', 'Specialist'),
(89, 'JUS/RJ/V3/016', '2024-12-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 16', 'Specialist'),
(90, 'JUS/RJ/V3/016', '2025-02-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 16', 'Specialist'),
(91, 'JUS/RJ/V3/016', '2025-07-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 16', 'Specialist'),
(92, 'JUS/RJ/V3/017', '2024-10-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 17', 'Specialist'),
(93, 'JUS/RJ/V3/017', '2025-01-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 17', 'Specialist'),
(94, 'JUS/RJ/V3/017', '2025-03-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 17', 'Specialist'),
(95, 'JUS/RJ/V3/017', '2025-05-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 17', 'Specialist'),
(96, 'JUS/RJ/V3/018', '2024-08-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 18', 'Specialist'),
(97, 'JUS/RJ/V3/018', '2024-11-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 18', 'Specialist'),
(98, 'JUS/RJ/V3/018', '2025-04-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 18', 'Specialist'),
(99, 'JUS/RJ/V3/018', '2025-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 18', 'Specialist'),
(100, 'JUS/RJ/V3/019', '2024-09-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 19', 'Specialist'),
(101, 'JUS/RJ/V3/019', '2025-02-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 19', 'Specialist'),
(102, 'JUS/RJ/V3/019', '2025-05-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 19', 'Specialist'),
(103, 'JUS/RJ/V3/019', '2025-07-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 19', 'Specialist'),
(104, 'JUS/RJ/V3/020', '2024-08-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 20', 'Specialist'),
(105, 'JUS/RJ/V3/020', '2024-10-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 20', 'Specialist'),
(106, 'JUS/RJ/V3/020', '2025-01-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 20', 'Specialist'),
(107, 'JUS/RJ/V3/020', '2025-04-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 20', 'Specialist'),
(108, 'JUS/RJ/V3/021', '2024-09-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 21', 'Specialist'),
(109, 'JUS/RJ/V3/021', '2024-12-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 21', 'Specialist'),
(110, 'JUS/RJ/V3/021', '2025-03-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 21', 'Specialist'),
(111, 'JUS/RJ/V3/021', '2025-07-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 21', 'Specialist'),
(112, 'JUS/RJ/V3/022', '2024-08-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 22', 'Specialist'),
(113, 'JUS/RJ/V3/022', '2025-02-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 22', 'Specialist'),
(114, 'JUS/RJ/V3/022', '2025-05-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 22', 'Specialist'),
(115, 'JUS/RJ/V3/022', '2025-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 22', 'Specialist'),
(116, 'JUS/RJ/V3/023', '2024-10-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 23', 'Specialist'),
(117, 'JUS/RJ/V3/023', '2025-01-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 23', 'Specialist'),
(118, 'JUS/RJ/V3/023', '2025-04-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 23', 'Specialist'),
(119, 'JUS/RJ/V3/023', '2025-07-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 23', 'Specialist'),
(120, 'JUS/RJ/V3/024', '2024-09-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 24', 'Specialist'),
(121, 'JUS/RJ/V3/024', '2024-12-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 24', 'Specialist'),
(122, 'JUS/RJ/V3/024', '2025-03-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 24', 'Specialist'),
(123, 'JUS/RJ/V3/024', '2025-06-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 24', 'Specialist'),
(124, 'JUS/RJ/V3/025', '2024-08-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 25', 'Specialist'),
(125, 'JUS/RJ/V3/025', '2025-01-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 25', 'Specialist'),
(126, 'JUS/RJ/V3/025', '2025-05-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 25', 'Specialist'),
(127, 'JUS/RJ/V3/025', '2025-07-10', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Auto-entry', 'Tech 25', 'Specialist');

-- --------------------------------------------------------

--
-- Table structure for table `engineers`
--

CREATE TABLE `engineers` (
  `engineer_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email_id` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `engineers`
--

INSERT INTO `engineers` (`engineer_id`, `name`, `email_id`) VALUES
(1, 'aditya', 'aditya512gohil@gmail.com'),
(2, 'test', 'nethra.nayak23@spit.ac.in');

-- --------------------------------------------------------

--
-- Table structure for table `FunctionalTest`
--

CREATE TABLE `FunctionalTest` (
  `id` int(11) NOT NULL,
  `maintenance_date` date DEFAULT NULL,
  `serial_number` varchar(255) DEFAULT NULL,
  `powers_correctly` tinyint(1) DEFAULT NULL,
  `trigger_functions` tinyint(1) DEFAULT NULL,
  `jamming_activates` tinyint(1) DEFAULT NULL,
  `jamming_range` tinyint(1) DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `FunctionalTest`
--

INSERT INTO `FunctionalTest` (`id`, `maintenance_date`, `serial_number`, `powers_correctly`, `trigger_functions`, `jamming_activates`, `jamming_range`, `comments`, `name`, `designation`) VALUES
(1, '2025-07-29', 'JUS/RJ/V3/002', 1, 1, 1, 1, 'aZXcZXC', 'zzzzzzz', 'zzzzz');

-- --------------------------------------------------------

--
-- Table structure for table `jammer_details`
--

CREATE TABLE `jammer_details` (
  `id` int(11) NOT NULL,
  `frequencies` varchar(50) DEFAULT NULL,
  `gloves` int(11) DEFAULT 0,
  `strap` int(11) DEFAULT 0,
  `manual` int(11) DEFAULT 0,
  `battery` int(11) DEFAULT 0,
  `charger` int(11) DEFAULT 0,
  `jacket` int(11) DEFAULT 1,
  `bag` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jammer_details`
--

INSERT INTO `jammer_details` (`id`, `frequencies`, `gloves`, `strap`, `manual`, `battery`, `charger`, `jacket`, `bag`) VALUES
(1, '1.2 GHz, 1.5 GHz, 2.4 GHz, 5.8 GHz', 2, 1, 1, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`) VALUES
(1, 'INS Angre'),
(2, 'INS Trata'),
(3, 'INS Tanaji'),
(4, 'INS Kunjali'),
(5, 'INS Tunir'),
(6, 'INS Abhimanyu'),
(7, 'INS Kolkata'),
(8, 'INS Shikra'),
(9, 'INS Sagar'),
(10, 'CANAC'),
(11, 'NEC'),
(12, 'Material Organisation'),
(13, 'INS Kadambala');

-- --------------------------------------------------------

--
-- Table structure for table `PhysicalInspection`
--

CREATE TABLE `PhysicalInspection` (
  `id` int(11) NOT NULL,
  `inspection_date` date DEFAULT NULL,
  `serial_number` varchar(255) DEFAULT NULL,
  `no_visible_cracks` tinyint(1) DEFAULT NULL,
  `clean_surface` tinyint(1) DEFAULT NULL,
  `no_corrosion` tinyint(1) DEFAULT NULL,
  `buttons_intact` tinyint(1) DEFAULT NULL,
  `strap_intact` tinyint(1) DEFAULT NULL,
  `no_fraying` tinyint(1) DEFAULT NULL,
  `secure_attachment` tinyint(1) DEFAULT NULL,
  `bag_no_damage` tinyint(1) DEFAULT NULL,
  `zippers_function` tinyint(1) DEFAULT NULL,
  `clean_interior` tinyint(1) DEFAULT NULL,
  `compartments_intact` tinyint(1) DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `PhysicalInspection`
--

INSERT INTO `PhysicalInspection` (`id`, `inspection_date`, `serial_number`, `no_visible_cracks`, `clean_surface`, `no_corrosion`, `buttons_intact`, `strap_intact`, `no_fraying`, `secure_attachment`, `bag_no_damage`, `zippers_function`, `clean_interior`, `compartments_intact`, `comments`, `name`, `designation`) VALUES
(1, '2025-07-29', 'JUS/RJ/V3/002', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'zd', 'ZXX', 'ZXxvzdf');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`) VALUES
(1, 'rifle_jammer');

-- --------------------------------------------------------

--
-- Table structure for table `rifle_jammer`
--

CREATE TABLE `rifle_jammer` (
  `id` int(11) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `serial_number` varchar(20) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `client_status` varchar(255) DEFAULT NULL,
  `type` tinyint(4) NOT NULL DEFAULT 4,
  `jammer_details_id` int(11) DEFAULT NULL,
  `manufacturing_date` date DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `admin_status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rifle_jammer`
--

INSERT INTO `rifle_jammer` (`id`, `location_id`, `serial_number`, `user_id`, `client_status`, `type`, `jammer_details_id`, `manufacturing_date`, `delivery_date`, `admin_status`) VALUES
(1, 1, 'JUS/RJ/V3/001', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(2, 2, 'JUS/RJ/V3/002', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(3, 12, 'JUS/RJ/V3/003', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(4, 3, 'JUS/RJ/V3/004', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(5, 4, 'JUS/RJ/V3/005', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(6, 4, 'JUS/RJ/V3/006', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(7, 4, 'JUS/RJ/V3/007', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(8, 4, 'JUS/RJ/V3/008', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(9, 5, 'JUS/RJ/V3/009', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(10, 6, 'JUS/RJ/V3/010', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(11, 7, 'JUS/RJ/V3/011', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(12, 8, 'JUS/RJ/V3/012', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(13, 1, 'JUS/RJ/V3/013', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(14, 1, 'JUS/RJ/V3/014', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(15, 9, 'JUS/RJ/V3/015', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(16, 10, 'JUS/RJ/V3/016', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(17, 1, 'JUS/RJ/V3/017', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(18, 1, 'JUS/RJ/V3/018', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(19, 1, 'JUS/RJ/V3/019', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(20, 11, 'JUS/RJ/V3/020', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(21, 1, 'JUS/RJ/V3/021', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(22, 13, 'JUS/RJ/V3/022', 2, '1', 4, 1, '2024-09-01', '2024-09-20', NULL),
(23, 1, 'JUS/RJ/V3/023', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(24, 1, 'JUS/RJ/V3/024', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL),
(25, 1, 'JUS/RJ/V3/025', 2, '0', 4, 1, '2024-09-01', '2024-09-20', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `service_tickets`
--

CREATE TABLE `service_tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ticket_number` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `serial_number` varchar(50) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `incident_date` date NOT NULL,
  `incident_details` text NOT NULL,
  `status` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `attachments` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `updates` text DEFAULT NULL,
  `assigned_engineer_id` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `service_under_progress_at` datetime DEFAULT NULL,
  `service_completed_at` datetime DEFAULT NULL,
  `pending_at` datetime DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `quotation_inspection_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_tickets`
--

INSERT INTO `service_tickets` (`id`, `ticket_number`, `user_id`, `serial_number`, `contact_number`, `incident_date`, `incident_details`, `status`, `created_at`, `attachments`, `designation`, `name`, `updates`, `assigned_engineer_id`, `email`, `service_under_progress_at`, `service_completed_at`, `pending_at`, `resolved_at`, `quotation_inspection_at`) VALUES
(13, 'TKT-202502-7420', 2, 'JUS/RJ/V3/009', '9137810547', '2002-12-29', 'sdfghjk', 2, '2025-02-19 09:40:40', '[\"img/tickets/ticket_1739958040220_10 Best Natural Wonder Family Vacations _ Family Vacation Critic.jpg\"]', 'software', 'Aditya Gohil', 'yooo how are you\n[Admin admin] Your ticket is now being serviced by our team.\n[Admin admin] qwe\n[Admin admin] qwe\n[Admin admin] Your ticket is now being serviced by our team.\n[Admin admin] Your ticket is now being serviced by our team.', 1, 'ajinkyapatil0210@gmail.com', '2025-08-18 12:40:09', NULL, NULL, NULL, NULL),
(14, 'TKT-202502-2419', 2, 'JUS/RJ/V3/014', '7900157664', '2025-02-18', 'FROUND HANDLE BROKEN ,BATTERY BOX BROKEN', 2, '2025-02-19 12:42:01', '[\"img/tickets/ticket_1739968921420_PCC Format.docx.pdf\"]', 'EC ENGINEER', 'VRUSHABH BARIMANI', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 'TKT-202502-3337', 2, 'JUS/RJ/V3/014', '8574341238', '2025-02-23', 'NA', 1, '2025-02-24 04:54:31', '[\"img/tickets/ticket_1740372871006_Back View.jpeg\"]', 'COO', 'Rahul', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 'TKT-202504-8563', 3, 'JUS/RJ/V3/001', '998674376', '2025-04-03', 'Jammer Is not Working', 1, '2025-04-09 10:35:31', '[\"img/tickets/ticket_1744194931676_2025-04-09-160515.jpg\"]', 'Electronics Engineer', 'Vrushabh', NULL, 2, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 'TKT-202504-4217', 2, 'JUS/RJ/V3/019', '8652709829', '2025-04-08', 'Jammer front portion damage', 3, '2025-04-09 10:40:07', '[\"img/tickets/ticket_1744195207080_Screenshot 2025-03-28 122420.png\"]', 'Lead', 'Prathmesh', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 'TKT-202506-3105', 2, 'JUS/RJ/V3/019', '9137810547', '2025-06-30', 'asdas', 1, '2025-06-30 06:11:23', '[\"img/tickets/ticket_1751263883814_i-converter_com.pdf\"]', 'software', 'testdata', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, 'TKT-202502-2479', 3, 'JUS/RJ/V3/022', '9846463263', '2025-01-09', 'damaged jammer', 4, '2025-07-09 05:03:34', NULL, 'engineer', 'Anonymous', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(31, 'TKT-202502-2454', 2, 'JUS/RJ/V3/003', '8748439485', '2025-04-08', 'jammer not functional', 2, '2025-07-09 05:09:22', NULL, 'Technical Staff', 'XYZ', NULL, 2, NULL, NULL, NULL, NULL, NULL, NULL),
(34, 'TKT-20250819-111720-781', 2, 'JUS/RJ/V3/011', '9921149607', '2025-08-19', 'test', 1, '2025-08-19 05:48:32', '[\"img/tickets/ticket_1755582512859_0457c69c-dc63-4dec-9690-470849056c4e.png\"]', 'testdata', 'Ajinkya Patil', NULL, NULL, 'vrushabbarimani29353@gmail.com', NULL, NULL, NULL, NULL, NULL),
(40, 'TKT-20250819-165917-402', 2, 'JUS/RJ/V3/005', '9921149607', '2025-08-11', 'final format for open status', 1, '2025-08-19 11:30:02', '[\"img/tickets/ticket_1755603002355_0457c69c-dc63-4dec-9690-470849056c4e.png\"]', 'testdata', 'Ajinkya Patil', NULL, NULL, 'gohiladityaa@gmail.com', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1, 'admin', '$2a$10$Wa1CDacgSjSUq9QTnyrQXeqarm6cK0SwPtXqAd3K.iOESao1.LHl6', 'admin'),
(2, 'INS_ANGRE', '$2a$10$Wa1CDacgSjSUq9QTnyrQXeqarm6cK0SwPtXqAd3K.iOESao1.LHl6', 'user'),
(3, 'ABC', '$2a$10$2IYZY7aPTF3uSXqpDiI7IOTOYWxZBTqp/ObOpwnejZvvABJu3v6Yu', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `BatteryMaintenance`
--
ALTER TABLE `BatteryMaintenance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `engineers`
--
ALTER TABLE `engineers`
  ADD PRIMARY KEY (`engineer_id`),
  ADD UNIQUE KEY `email_id` (`email_id`);

--
-- Indexes for table `FunctionalTest`
--
ALTER TABLE `FunctionalTest`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jammer_details`
--
ALTER TABLE `jammer_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `PhysicalInspection`
--
ALTER TABLE `PhysicalInspection`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rifle_jammer`
--
ALTER TABLE `rifle_jammer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `serial_number` (`serial_number`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `fk_jammer_details` (`jammer_details_id`);

--
-- Indexes for table `service_tickets`
--
ALTER TABLE `service_tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ticket_number` (`ticket_number`),
  ADD KEY `serial_number` (`serial_number`),
  ADD KEY `fk_engineer` (`assigned_engineer_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `BatteryMaintenance`
--
ALTER TABLE `BatteryMaintenance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT for table `FunctionalTest`
--
ALTER TABLE `FunctionalTest`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `jammer_details`
--
ALTER TABLE `jammer_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `PhysicalInspection`
--
ALTER TABLE `PhysicalInspection`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `rifle_jammer`
--
ALTER TABLE `rifle_jammer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `service_tickets`
--
ALTER TABLE `service_tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `rifle_jammer`
--
ALTER TABLE `rifle_jammer`
  ADD CONSTRAINT `fk_jammer_details` FOREIGN KEY (`jammer_details_id`) REFERENCES `jammer_details` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `rifle_jammer_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

--
-- Constraints for table `service_tickets`
--
ALTER TABLE `service_tickets`
  ADD CONSTRAINT `fk_engineer` FOREIGN KEY (`assigned_engineer_id`) REFERENCES `engineers` (`engineer_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `service_tickets_ibfk_1` FOREIGN KEY (`serial_number`) REFERENCES `rifle_jammer` (`serial_number`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
