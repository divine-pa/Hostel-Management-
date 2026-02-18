-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               9.6.0 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for room_allocation_system_db
CREATE DATABASE IF NOT EXISTS `room_allocation_system_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `room_allocation_system_db`;

-- Dumping structure for table room_allocation_system_db.admin
CREATE TABLE IF NOT EXISTS `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Super Admin','Hall Admin') DEFAULT 'Hall Admin',
  `hall_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `email` (`email`),
  KEY `hall_id` (`hall_id`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`hall_id`) REFERENCES `hall` (`hall_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.admin: ~4 rows (approximately)
INSERT INTO `admin` (`admin_id`, `name`, `email`, `password`, `role`, `hall_id`, `created_at`, `updated_at`) VALUES
	(1, 'Bethel Hall Admin', 'Uzoma.admin@babcock.edu.ng', 'admin123', 'Hall Admin', 1, '2026-01-25 22:19:27', '2026-01-25 22:19:27'),
	(2, 'Neal Wilson Hall Admin', 'Chioma.admin@babcock.edu.ng', 'admin123', 'Hall Admin', 2, '2026-01-25 22:19:27', '2026-01-25 22:19:27'),
	(3, 'Havilah Hall Admin', 'chineyere.admin@babcock.edu.ng', 'admin123', 'Hall Admin', 3, '2026-01-25 22:19:27', '2026-01-25 22:19:27'),
	(4, 'FAD Hall Admin', 'akinwumi.admin@babcock.edu.ng', 'admin123', 'Hall Admin', 4, '2026-01-25 22:19:27', '2026-01-25 22:19:27');

-- Dumping structure for table room_allocation_system_db.allocation
CREATE TABLE IF NOT EXISTS `allocation` (
  `allocation_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `room_id` int NOT NULL,
  `allocation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Active','Cancelled','Completed') DEFAULT 'Active',
  `receipt_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`allocation_id`),
  UNIQUE KEY `unique_allocation` (`student_id`,`status`),
  KEY `room_id` (`room_id`),
  KEY `receipt_id` (`receipt_id`),
  KEY `idx_allocation_status` (`status`),
  CONSTRAINT `allocation_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `allocation_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE CASCADE,
  CONSTRAINT `allocation_ibfk_3` FOREIGN KEY (`receipt_id`) REFERENCES `receipt` (`receipt_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.allocation: ~14 rows (approximately)
INSERT INTO `allocation` (`allocation_id`, `student_id`, `room_id`, `allocation_date`, `status`, `receipt_id`, `created_at`, `updated_at`) VALUES
	(1, 2, 61, '2026-02-08 14:46:20', 'Active', NULL, NULL, NULL),
	(2, 9, 61, '2026-02-12 20:31:51', 'Active', NULL, NULL, NULL),
	(3, 11, 61, '2026-02-12 20:33:06', 'Active', NULL, NULL, NULL),
	(4, 13, 61, '2026-02-12 20:33:42', 'Active', NULL, NULL, NULL),
	(5, 15, 62, '2026-02-12 21:15:56', 'Active', NULL, NULL, NULL),
	(6, 61, 1, '2026-02-12 23:44:04', 'Active', NULL, NULL, NULL),
	(7, 19, 62, '2026-02-13 10:00:41', 'Active', NULL, NULL, NULL),
	(8, 8, 1, '2026-02-14 22:53:22', 'Active', 1, NULL, NULL),
	(10, 62, 41, '2026-02-17 10:15:11', 'Active', 3, NULL, NULL),
	(14, 63, 1, '2026-02-17 12:32:05', 'Active', 7, NULL, NULL),
	(16, 10, 1, '2026-02-17 19:22:18', 'Active', 9, NULL, NULL),
	(17, 12, 2, '2026-02-17 19:24:22', 'Active', 10, NULL, NULL),
	(18, 41, 21, '2026-02-17 22:48:13', 'Active', 11, NULL, NULL),
	(19, 37, 22, '2026-02-17 22:49:47', 'Active', 12, NULL, NULL);

-- Dumping structure for table room_allocation_system_db.auth_group
CREATE TABLE IF NOT EXISTS `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.auth_group: ~0 rows (approximately)

-- Dumping structure for table room_allocation_system_db.auth_group_permissions
CREATE TABLE IF NOT EXISTS `auth_group_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.auth_group_permissions: ~0 rows (approximately)

-- Dumping structure for table room_allocation_system_db.auth_permission
CREATE TABLE IF NOT EXISTS `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.auth_permission: ~56 rows (approximately)
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
	(1, 'Can add log entry', 1, 'add_logentry'),
	(2, 'Can change log entry', 1, 'change_logentry'),
	(3, 'Can delete log entry', 1, 'delete_logentry'),
	(4, 'Can view log entry', 1, 'view_logentry'),
	(5, 'Can add permission', 2, 'add_permission'),
	(6, 'Can change permission', 2, 'change_permission'),
	(7, 'Can delete permission', 2, 'delete_permission'),
	(8, 'Can view permission', 2, 'view_permission'),
	(9, 'Can add group', 3, 'add_group'),
	(10, 'Can change group', 3, 'change_group'),
	(11, 'Can delete group', 3, 'delete_group'),
	(12, 'Can view group', 3, 'view_group'),
	(13, 'Can add user', 4, 'add_user'),
	(14, 'Can change user', 4, 'change_user'),
	(15, 'Can delete user', 4, 'delete_user'),
	(16, 'Can view user', 4, 'view_user'),
	(17, 'Can add content type', 5, 'add_contenttype'),
	(18, 'Can change content type', 5, 'change_contenttype'),
	(19, 'Can delete content type', 5, 'delete_contenttype'),
	(20, 'Can view content type', 5, 'view_contenttype'),
	(21, 'Can add session', 6, 'add_session'),
	(22, 'Can change session', 6, 'change_session'),
	(23, 'Can delete session', 6, 'delete_session'),
	(24, 'Can view session', 6, 'view_session'),
	(25, 'Can add admin', 7, 'add_admin'),
	(26, 'Can change admin', 7, 'change_admin'),
	(27, 'Can delete admin', 7, 'delete_admin'),
	(28, 'Can view admin', 7, 'view_admin'),
	(29, 'Can add allocation', 8, 'add_allocation'),
	(30, 'Can change allocation', 8, 'change_allocation'),
	(31, 'Can delete allocation', 8, 'delete_allocation'),
	(32, 'Can view allocation', 8, 'view_allocation'),
	(33, 'Can add hall', 9, 'add_hall'),
	(34, 'Can change hall', 9, 'change_hall'),
	(35, 'Can delete hall', 9, 'delete_hall'),
	(36, 'Can view hall', 9, 'view_hall'),
	(37, 'Can add log', 10, 'add_log'),
	(38, 'Can change log', 10, 'change_log'),
	(39, 'Can delete log', 10, 'delete_log'),
	(40, 'Can view log', 10, 'view_log'),
	(41, 'Can add payment', 11, 'add_payment'),
	(42, 'Can change payment', 11, 'change_payment'),
	(43, 'Can delete payment', 11, 'delete_payment'),
	(44, 'Can view payment', 11, 'view_payment'),
	(45, 'Can add receipt', 12, 'add_receipt'),
	(46, 'Can change receipt', 12, 'change_receipt'),
	(47, 'Can delete receipt', 12, 'delete_receipt'),
	(48, 'Can view receipt', 12, 'view_receipt'),
	(49, 'Can add room', 13, 'add_room'),
	(50, 'Can change room', 13, 'change_room'),
	(51, 'Can delete room', 13, 'delete_room'),
	(52, 'Can view room', 13, 'view_room'),
	(53, 'Can add student', 14, 'add_student'),
	(54, 'Can change student', 14, 'change_student'),
	(55, 'Can delete student', 14, 'delete_student'),
	(56, 'Can view student', 14, 'view_student');

-- Dumping structure for table room_allocation_system_db.auth_user
CREATE TABLE IF NOT EXISTS `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.auth_user: ~0 rows (approximately)

-- Dumping structure for table room_allocation_system_db.auth_user_groups
CREATE TABLE IF NOT EXISTS `auth_user_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.auth_user_groups: ~0 rows (approximately)

-- Dumping structure for table room_allocation_system_db.auth_user_user_permissions
CREATE TABLE IF NOT EXISTS `auth_user_user_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.auth_user_user_permissions: ~0 rows (approximately)

-- Dumping structure for table room_allocation_system_db.django_admin_log
CREATE TABLE IF NOT EXISTS `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.django_admin_log: ~0 rows (approximately)

-- Dumping structure for table room_allocation_system_db.django_content_type
CREATE TABLE IF NOT EXISTS `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.django_content_type: ~14 rows (approximately)
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
	(1, 'admin', 'logentry'),
	(3, 'auth', 'group'),
	(2, 'auth', 'permission'),
	(4, 'auth', 'user'),
	(5, 'contenttypes', 'contenttype'),
	(6, 'sessions', 'session'),
	(7, 'testdbModel', 'admin'),
	(8, 'testdbModel', 'allocation'),
	(9, 'testdbModel', 'hall'),
	(10, 'testdbModel', 'log'),
	(11, 'testdbModel', 'payment'),
	(12, 'testdbModel', 'receipt'),
	(13, 'testdbModel', 'room'),
	(14, 'testdbModel', 'student');

-- Dumping structure for table room_allocation_system_db.django_migrations
CREATE TABLE IF NOT EXISTS `django_migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.django_migrations: ~18 rows (approximately)
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
	(1, 'contenttypes', '0001_initial', '2026-01-26 10:27:48.135401'),
	(2, 'auth', '0001_initial', '2026-01-26 10:28:09.940550'),
	(3, 'admin', '0001_initial', '2026-01-26 10:28:14.858898'),
	(4, 'admin', '0002_logentry_remove_auto_add', '2026-01-26 10:28:15.140215'),
	(5, 'admin', '0003_logentry_add_action_flag_choices', '2026-01-26 10:28:15.325987'),
	(6, 'contenttypes', '0002_remove_content_type_name', '2026-01-26 10:28:18.057271'),
	(7, 'auth', '0002_alter_permission_name_max_length', '2026-01-26 10:28:20.070870'),
	(8, 'auth', '0003_alter_user_email_max_length', '2026-01-26 10:28:20.318344'),
	(9, 'auth', '0004_alter_user_username_opts', '2026-01-26 10:28:20.470516'),
	(10, 'auth', '0005_alter_user_last_login_null', '2026-01-26 10:28:22.025176'),
	(11, 'auth', '0006_require_contenttypes_0002', '2026-01-26 10:28:22.183938'),
	(12, 'auth', '0007_alter_validators_add_error_messages', '2026-01-26 10:28:22.209831'),
	(13, 'auth', '0008_alter_user_username_max_length', '2026-01-26 10:28:23.979536'),
	(14, 'auth', '0009_alter_user_last_name_max_length', '2026-01-26 10:28:25.312400'),
	(15, 'auth', '0010_alter_group_name_max_length', '2026-01-26 10:28:25.596848'),
	(16, 'auth', '0011_update_proxy_permissions', '2026-01-26 10:28:25.750381'),
	(17, 'auth', '0012_alter_user_first_name_max_length', '2026-01-26 10:28:27.350485'),
	(18, 'sessions', '0001_initial', '2026-01-26 10:28:28.097050'),
	(19, 'testdbModel', '0001_initial', '2026-02-11 08:52:10.752793'),
	(20, 'testdbModel', '0002_alter_room_options', '2026-02-11 09:07:34.527760');

-- Dumping structure for table room_allocation_system_db.django_session
CREATE TABLE IF NOT EXISTS `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.django_session: ~0 rows (approximately)

-- Dumping structure for table room_allocation_system_db.hall
CREATE TABLE IF NOT EXISTS `hall` (
  `hall_id` int NOT NULL AUTO_INCREMENT,
  `hall_name` varchar(100) NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `total_rooms` int NOT NULL DEFAULT '0',
  `available_rooms` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`hall_id`),
  KEY `idx_hall_gender` (`gender`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.hall: ~4 rows (approximately)
INSERT INTO `hall` (`hall_id`, `hall_name`, `gender`, `total_rooms`, `available_rooms`, `created_at`, `updated_at`) VALUES
	(1, 'Bethel Hall', 'Male', 20, 19, '2026-01-25 21:18:22', '2026-02-17 20:22:18'),
	(2, 'Neal Wilson Hall', 'Male', 20, 20, '2026-01-25 21:18:22', '2026-01-25 21:18:22'),
	(3, 'Havilah Hall', 'Female', 20, 19, '2026-01-25 21:18:56', '2026-02-12 21:33:41'),
	(4, 'FAD Hall', 'Female', 20, 20, '2026-01-25 21:18:56', '2026-01-25 21:18:56');

-- Dumping structure for table room_allocation_system_db.log
CREATE TABLE IF NOT EXISTS `log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `action` varchar(255) NOT NULL,
  `user_role` varchar(100) NOT NULL,
  `user_id` int DEFAULT NULL,
  `description` text,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.log: ~11 rows (approximately)
INSERT INTO `log` (`log_id`, `action`, `user_role`, `user_id`, `description`, `timestamp`) VALUES
	(1, 'Toggled Room H103 Maintenance Status', 'Admin', NULL, 'Changed Room H103 in Havilah Hall maintenance status from False to True', '2026-02-17 20:16:47'),
	(2, 'Toggled Room H104 Maintenance Status', 'ADMIN', NULL, 'Changed Room H104 in Havilah Hall maintenance status from False to True', '2026-02-17 20:27:18'),
	(3, 'Toggled Room H105 Maintenance Status', 'ADMIN', NULL, 'Changed Room H105 in Havilah Hall maintenance status from False to True', '2026-02-17 20:31:40'),
	(4, 'Toggled Room H104 Maintenance Status', 'chineyere.admin@babcock.edu.ng', NULL, 'Changed Room H104 in Havilah Hall maintenance status from True to False', '2026-02-17 20:34:25'),
	(5, 'Toggled Room H103 Maintenance Status', 'chineyere.admin@babcock.edu.ng', NULL, 'Changed Room H103 in Havilah Hall maintenance status from True to False', '2026-02-17 20:38:30'),
	(6, 'Toggled Room H105 Maintenance Status', 'chineyere.admin@babcock.edu.ng', NULL, 'Changed Room H105 in Havilah Hall maintenance status from True to False', '2026-02-17 20:38:34'),
	(7, 'Toggled Room H102 Maintenance Status', 'chineyere.admin@babcock.edu.ng', NULL, 'Changed Room H102 in Havilah Hall maintenance status from False to True', '2026-02-17 21:01:50'),
	(8, 'Toggled Room H102 Maintenance Status', 'chineyere.admin@babcock.edu.ng', NULL, 'Changed Room H102 in Havilah Hall maintenance status from True to False', '2026-02-17 21:01:55'),
	(9, 'Toggled Room H103 Maintenance Status', 'chineyere.admin@babcock.edu.ng', NULL, 'Changed Room H103 in Havilah Hall maintenance status from False to True', '2026-02-17 22:46:27'),
	(10, 'Toggled Room H103 Maintenance Status', 'chineyere.admin@babcock.edu.ng', NULL, 'Changed Room H103 in Havilah Hall maintenance status from True to False', '2026-02-17 22:46:30'),
	(11, 'Toggled Room NW101 Maintenance Status', 'Chioma.admin@babcock.edu.ng', NULL, 'Changed Room NW101 in Neal Wilson Hall maintenance status from False to True', '2026-02-17 22:49:09');

-- Dumping structure for table room_allocation_system_db.payment
CREATE TABLE IF NOT EXISTS `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `matric_number` varchar(20) NOT NULL,
  `payment_reference` varchar(100) NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `date_paid` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_status` enum('Pending','Verified','Failed') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `payment_reference` (`payment_reference`),
  KEY `matric_number` (`matric_number`),
  KEY `idx_payment_status` (`payment_status`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`matric_number`) REFERENCES `student` (`matric_number`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.payment: ~62 rows (approximately)
INSERT INTO `payment` (`payment_id`, `matric_number`, `payment_reference`, `amount_paid`, `date_paid`, `payment_status`, `created_at`) VALUES
	(1, '22/0101', 'PAY-2024-004', 2850000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(2, '22/0102', 'PAY-2024-005', 2900000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(3, '22/0103', 'PAY-2024-006', 3000000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(4, '22/0104', 'PAY-2024-007', 2750000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(5, '22/0105', 'PAY-2024-008', 2950000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(6, '22/0106', 'PAY-2024-009', 2800000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(7, '22/0107', 'PAY-2024-010', 2700000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(8, '22/0108', 'PAY-2024-011', 2880000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(9, '22/0109', 'PAY-2024-012', 3000000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(10, '22/0110', 'PAY-2024-013', 2920000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(11, '22/0111', 'PAY-2024-014', 2890000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(12, '22/0112', 'PAY-2024-015', 2760000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(13, '22/0113', 'PAY-2024-016', 2810000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(14, '23/0201', 'PAY-2024-017', 2850000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(15, '23/0202', 'PAY-2024-018', 3000000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(16, '23/0203', 'PAY-2024-019', 2900000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(17, '23/0204', 'PAY-2024-020', 2700000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(18, '23/0205', 'PAY-2024-021', 2950000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(19, '23/0206', 'PAY-2024-022', 2750000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(20, '23/0207', 'PAY-2024-023', 2800000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(21, '23/0208', 'PAY-2024-024', 2880000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(22, '23/0209', 'PAY-2024-025', 2900000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(23, '23/0210', 'PAY-2024-026', 3000000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(24, '23/0211', 'PAY-2024-027', 2920000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(25, '23/0212', 'PAY-2024-028', 2760000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(26, '24/0301', 'PAY-2024-029', 2850000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(27, '24/0302', 'PAY-2024-030', 2700000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(28, '24/0303', 'PAY-2024-031', 2800000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(29, '24/0304', 'PAY-2024-032', 2900000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(30, '24/0305', 'PAY-2024-033', 3000000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(31, '24/0306', 'PAY-2024-034', 2750000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(32, '24/0307', 'PAY-2024-035', 2950000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(33, '24/0308', 'PAY-2024-036', 2880000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(34, '24/0309', 'PAY-2024-037', 2890000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(35, '24/0310', 'PAY-2024-038', 3000000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(36, '24/0311', 'PAY-2024-039', 2800000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(37, '24/0312', 'PAY-2024-040', 2700000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(38, '25/0401', 'PAY-2024-041', 2850000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(39, '25/0402', 'PAY-2024-042', 2950000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(40, '25/0403', 'PAY-2024-043', 2900000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(41, '25/0404', 'PAY-2024-044', 3000000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(42, '25/0405', 'PAY-2024-045', 2750000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(43, '25/0406', 'PAY-2024-046', 2800000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(44, '25/0407', 'PAY-2024-047', 2700000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(45, '25/0408', 'PAY-2024-048', 2880000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(46, '25/0409', 'PAY-2024-049', 2890000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(47, '25/0410', 'PAY-2024-050', 2920000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(48, '25/0411', 'PAY-2024-051', 3000000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(49, '25/0412', 'PAY-2024-052', 2760000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(50, '25/0413', 'PAY-2024-053', 2810000.00, '2026-01-25 21:46:46', 'Verified', '2026-01-25 21:46:46'),
	(51, '22/0901', 'PAY-2024-054', 1500000.00, '2026-01-25 21:46:46', 'Pending', '2026-01-25 21:46:46'),
	(52, '22/0902', 'PAY-2024-055', 0.00, '2026-01-25 21:46:46', 'Pending', '2026-01-25 21:46:46'),
	(53, '23/0903', 'PAY-2024-056', 1000000.00, '2026-01-25 21:46:46', 'Pending', '2026-01-25 21:46:46'),
	(54, '23/0904', 'PAY-2024-057', 2800000.00, '2026-01-25 21:46:46', 'Pending', '2026-01-25 21:46:46'),
	(55, '24/0905', 'PAY-2024-058', 500000.00, '2026-01-25 21:46:46', 'Pending', '2026-01-25 21:46:46'),
	(56, '24/0906', 'PAY-2024-059', 0.00, '2026-01-25 21:46:46', 'Pending', '2026-01-25 21:46:46'),
	(57, '24/0907', 'PAY-2024-060', 1200000.00, '2026-01-25 21:46:46', 'Pending', '2026-01-25 21:46:46'),
	(58, '25/0908', 'PAY-2024-061', 2900000.00, '2026-01-25 21:46:46', 'Pending', '2026-01-25 21:46:46'),
	(59, '25/0909', 'PAY-2024-062', 0.00, '2026-01-25 21:46:46', 'Pending', '2026-01-25 21:46:46'),
	(60, '25/0910', 'PAY-2024-063', 200000.00, '2026-01-25 21:46:46', 'Pending', '2026-01-25 21:46:46'),
	(62, '22/1218', 'PAY-2025-001', 2950000.00, '2026-01-27 18:48:50', 'Verified', '2026-01-27 18:48:50'),
	(63, '22/1219', 'PAY-2025-002', 2750000.00, '2026-01-27 18:48:50', 'Verified', '2026-01-27 18:48:50');

-- Dumping structure for table room_allocation_system_db.receipt
CREATE TABLE IF NOT EXISTS `receipt` (
  `receipt_id` int NOT NULL AUTO_INCREMENT,
  `matric_number` varchar(20) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `payment_reference` varchar(100) NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `date_paid` timestamp NOT NULL,
  `verified` tinyint(1) DEFAULT '0',
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`receipt_id`),
  KEY `matric_number` (`matric_number`),
  CONSTRAINT `receipt_ibfk_1` FOREIGN KEY (`matric_number`) REFERENCES `student` (`matric_number`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.receipt: ~7 rows (approximately)
INSERT INTO `receipt` (`receipt_id`, `matric_number`, `student_name`, `payment_reference`, `amount_paid`, `date_paid`, `verified`, `file_path`, `created_at`) VALUES
	(1, '22/0108', 'Nwachukwu Emeka', 'BU-A58P1SXM', 2880000.00, '2026-02-14 22:53:22', NULL, NULL, NULL),
	(3, '22/1218', 'Favour ', 'BU-UMCY6HMI', 0.00, '2026-02-17 10:15:11', 1, NULL, '2026-02-17 10:15:11'),
	(7, '22/1219', 'chika excel james ', 'BU-Y3KWK5WI', 2750000.00, '2026-02-17 12:32:05', 1, NULL, '2026-02-17 12:32:05'),
	(9, '22/0110', 'Danladi Yusuf', 'BU-G5HZ8364', 2920000.00, '2026-02-17 19:22:18', 1, NULL, '2026-02-17 19:22:18'),
	(10, '22/0112', 'Osagie Kelvin', 'BU-VAGP18DB', 2760000.00, '2026-02-17 19:24:22', 1, NULL, '2026-02-17 19:24:22'),
	(11, '25/0404', 'Attah Moses', 'BU-UH45US22', 3000000.00, '2026-02-17 22:48:13', 1, NULL, '2026-02-17 22:48:13'),
	(12, '24/0312', 'Yakubu Ali', 'BU-YZFS7DZK', 2700000.00, '2026-02-17 22:49:47', 1, NULL, '2026-02-17 22:49:47');

-- Dumping structure for table room_allocation_system_db.room
CREATE TABLE IF NOT EXISTS `room` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `hall_id` int NOT NULL,
  `room_number` varchar(20) NOT NULL,
  `capacity` int NOT NULL DEFAULT '4',
  `current_occupants` int NOT NULL DEFAULT '0',
  `room_status` enum('Available','Occupied','Full','Maintenance') DEFAULT 'Available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_under_maintenance` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `unique_room` (`hall_id`,`room_number`),
  KEY `idx_room_status` (`room_status`),
  CONSTRAINT `room_ibfk_1` FOREIGN KEY (`hall_id`) REFERENCES `hall` (`hall_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.room: ~80 rows (approximately)
INSERT INTO `room` (`room_id`, `hall_id`, `room_number`, `capacity`, `current_occupants`, `room_status`, `created_at`, `updated_at`, `is_under_maintenance`) VALUES
	(1, 1, 'B101', 4, 4, 'Full', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(2, 1, 'B102', 4, 1, 'Occupied', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(3, 1, 'B103', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(4, 1, 'B104', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(5, 1, 'B105', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(6, 1, 'B106', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(7, 1, 'B107', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(8, 1, 'B108', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(9, 1, 'B109', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(10, 1, 'B110', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(11, 1, 'B111', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(12, 1, 'B112', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(13, 1, 'B113', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(14, 1, 'B114', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(15, 1, 'B115', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(16, 1, 'B116', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(17, 1, 'B117', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(18, 1, 'B118', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(19, 1, 'B119', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(20, 1, 'B120', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(21, 2, 'NW101', 4, 1, 'Occupied', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 1),
	(22, 2, 'NW102', 4, 1, 'Occupied', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(23, 2, 'NW103', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(24, 2, 'NW104', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(25, 2, 'NW105', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(26, 2, 'NW106', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(27, 2, 'NW107', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(28, 2, 'NW108', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(29, 2, 'NW109', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(30, 2, 'NW110', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(31, 2, 'NW111', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(32, 2, 'NW112', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(33, 2, 'NW113', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(34, 2, 'NW114', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(35, 2, 'NW115', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(36, 2, 'NW116', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(37, 2, 'NW117', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(38, 2, 'NW118', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(39, 2, 'NW119', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(40, 2, 'NW120', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(41, 4, 'F101', 4, 1, 'Occupied', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(42, 4, 'F102', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(43, 4, 'F103', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(44, 4, 'F104', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(45, 4, 'F105', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(46, 4, 'F106', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(47, 4, 'F107', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(48, 4, 'F108', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(49, 4, 'F109', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(50, 4, 'F110', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(51, 4, 'F111', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(52, 4, 'F112', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(53, 4, 'F113', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(54, 4, 'F114', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(55, 4, 'F115', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(56, 4, 'F116', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(57, 4, 'F117', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(58, 4, 'F118', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(59, 4, 'F119', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(60, 4, 'F120', 4, 0, 'Available', '2026-01-25 21:19:17', '2026-01-25 21:19:17', 0),
	(61, 3, 'H101', 4, 4, 'Full', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(62, 3, 'H102', 4, 2, 'Occupied', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(63, 3, 'H103', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(64, 3, 'H104', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(65, 3, 'H105', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(66, 3, 'H106', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(67, 3, 'H107', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(68, 3, 'H108', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(69, 3, 'H109', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(70, 3, 'H110', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(71, 3, 'H111', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(72, 3, 'H112', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(73, 3, 'H113', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(74, 3, 'H114', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(75, 3, 'H115', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(76, 3, 'H116', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(77, 3, 'H117', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(78, 3, 'H118', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(79, 3, 'H119', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0),
	(80, 3, 'H120', 4, 0, 'Available', '2026-01-25 21:19:18', '2026-01-25 21:19:18', 0);

-- Dumping structure for table room_allocation_system_db.student
CREATE TABLE IF NOT EXISTS `student` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `matric_number` varchar(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `level` varchar(10) DEFAULT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `parent_phone` varchar(20) DEFAULT NULL,
  `house_address` text,
  `denomination` varchar(50) DEFAULT NULL,
  `payment_status` enum('Pending','Verified','Failed') DEFAULT 'Pending',
  `hall_selected` int DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `matric_number` (`matric_number`),
  UNIQUE KEY `email` (`email`),
  KEY `hall_selected` (`hall_selected`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`hall_selected`) REFERENCES `hall` (`hall_id`) ON DELETE SET NULL,
  CONSTRAINT `student_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table room_allocation_system_db.student: ~63 rows (approximately)
INSERT INTO `student` (`student_id`, `matric_number`, `full_name`, `email`, `password`, `department`, `level`, `gender`, `phone_number`, `parent_phone`, `house_address`, `denomination`, `payment_status`, `hall_selected`, `room_id`, `created_at`, `updated_at`) VALUES
	(1, '22/0101', 'Adeyemi Tunde', 'adeyemi.tunde@student.babcock.edu.ng', 'student123', 'Computer Science', '400', 'Male', '08011111111', '08099990001', '14 Adeola Odeku St, VI, Lagos', 'Pentecostal', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(2, '22/0102', 'Okonkwo Chioma', 'okonkwo.chioma@student.babcock.edu.ng', 'student123', 'Law', '400', 'Female', '08011111112', '08099990002', '5 New Haven, Enugu', 'Catholic', 'Verified', 3, 61, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(3, '22/0103', 'Musa Ibrahim', 'musa.ibrahim@student.babcock.edu.ng', 'student123', 'Medicine', '400', 'Male', '08011111113', '08099990003', '22 Wuse Zone 4, Abuja', 'Muslim', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(4, '22/0104', 'Balogun Funke', 'balogun.funke@student.babcock.edu.ng', 'student123', 'Accounting', '400', 'Female', '08011111114', '08099990004', '8 Ring Road, Ibadan', 'Seventh-day Adventist', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(5, '22/0105', 'Eze David', 'eze.david@student.babcock.edu.ng', 'student123', 'Software Engineering', '400', 'Male', '08011111115', '08099990005', '10 Aba Road, Port Harcourt', 'Anglican', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(6, '22/0106', 'Sanni Aisha', 'sanni.aisha@student.babcock.edu.ng', 'student123', 'Economics', '400', 'Female', '08011111116', '08099990006', '12 Barnawa, Kaduna', 'Muslim', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(7, '22/0107', 'Okeowo Femi', 'okeowo.femi@student.babcock.edu.ng', 'student123', 'Mass Communication', '400', 'Male', '08011111117', '08099990007', '4 Surulere Way, Lagos', 'Seventh-day Adventist', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(8, '22/0108', 'Nwachukwu Emeka', 'nwachukwu.emeka@student.babcock.edu.ng', 'student123', 'Computer Science', '400', 'Male', '08011111118', '08099990008', '15 Douglas Rd, Owerri', 'Catholic', 'Verified', 1, 1, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(9, '22/0109', 'Adebayo Simi', 'adebayo.simi@student.babcock.edu.ng', 'student123', 'Medicine', '400', 'Female', '08011111119', '08099990009', '3 Bodija Estate, Ibadan', 'Pentecostal', 'Verified', 3, 61, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(10, '22/0110', 'Danladi Yusuf', 'danladi.yusuf@student.babcock.edu.ng', 'student123', 'Software Engineering', '400', 'Male', '08011111120', '08099990010', '9 Rayfield, Jos', 'Methodist', 'Verified', 1, 1, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(11, '22/0111', 'George Sarah', 'george.sarah@student.babcock.edu.ng', 'student123', 'Law', '400', 'Female', '08011111121', '08099990011', '11 Lekki Phase 1, Lagos', 'Seventh-day Adventist', 'Verified', 3, 61, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(12, '22/0112', 'Osagie Kelvin', 'osagie.kelvin@student.babcock.edu.ng', 'student123', 'Accounting', '400', 'Male', '08011111122', '08099990012', '7 Ugbowo, Benin City', 'Pentecostal', 'Verified', 1, 2, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(13, '22/0113', 'Bello Amina', 'bello.amina@student.babcock.edu.ng', 'student123', 'Economics', '400', 'Female', '08011111123', '08099990013', '5 Garki Area 2, Abuja', 'Muslim', 'Verified', 3, 61, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(14, '23/0201', 'Williams John', 'williams.john@student.babcock.edu.ng', 'student123', 'Computer Science', '300', 'Male', '08022222221', '08088880001', '21 Isaac John, Ikeja, Lagos', 'Anglican', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(15, '23/0202', 'Kalu Ngozi', 'kalu.ngozi@student.babcock.edu.ng', 'student123', 'Medicine', '300', 'Female', '08022222222', '08088880002', '10 Okpara Ave, Enugu', 'Presbyterian', 'Verified', 3, 62, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(16, '23/0203', 'Alabi Seun', 'alabi.seun@student.babcock.edu.ng', 'student123', 'Law', '300', 'Male', '08022222223', '08088880003', '8 Tanke, Ilorin', 'Seventh-day Adventist', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(17, '23/0204', 'Peters Grace', 'peters.grace@student.babcock.edu.ng', 'student123', 'Mass Communication', '300', 'Female', '08022222224', '08088880004', '16 Calabar Road, Calabar', 'Pentecostal', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(18, '23/0205', 'Idris Kabir', 'idris.kabir@student.babcock.edu.ng', 'student123', 'Software Engineering', '300', 'Male', '08022222225', '08088880005', '4 Kano City Walls, Kano', 'Muslim', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(19, '23/0206', 'Akpan Utibe', 'akpan.utibe@student.babcock.edu.ng', 'student123', 'Accounting', '300', 'Female', '08022222226', '08088880006', '9 Aka Road, Uyo', 'Catholic', 'Verified', 3, 62, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(20, '23/0207', 'Fashola Samuel', 'fashola.samuel@student.babcock.edu.ng', 'student123', 'Economics', '300', 'Male', '08022222227', '08088880007', '12 Yaba, Lagos', 'Methodist', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(21, '23/0208', 'Obi Chinedu', 'obi.chinedu@student.babcock.edu.ng', 'student123', 'Computer Science', '300', 'Male', '08022222228', '08088880008', '5 Awka Rd, Onitsha', 'Catholic', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(22, '23/0209', 'Jimoh Zainab', 'jimoh.zainab@student.babcock.edu.ng', 'student123', 'Law', '300', 'Female', '08022222229', '08088880009', '6 Unity Road, Ilorin', 'Muslim', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(23, '23/0210', 'Harry Paul', 'harry.paul@student.babcock.edu.ng', 'student123', 'Medicine', '300', 'Male', '08022222230', '08088880010', '3 Trans Amadi, Port Harcourt', 'Seventh-day Adventist', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(24, '23/0211', 'Effiong Mercy', 'effiong.mercy@student.babcock.edu.ng', 'student123', 'Software Engineering', '300', 'Female', '08022222231', '08088880011', '8 Eket Highway, Eket', 'Pentecostal', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(25, '23/0212', 'Lawal Ahmed', 'lawal.ahmed@student.babcock.edu.ng', 'student123', 'Accounting', '300', 'Male', '08022222232', '08088880012', '2 Oluyole Estate, Ibadan', 'Muslim', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(26, '24/0301', 'Coker Tobi', 'coker.tobi@student.babcock.edu.ng', 'student123', 'Computer Science', '200', 'Male', '08033333331', '08077770001', '50 Allen Avenue, Ikeja', 'Seventh-day Adventist', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(27, '24/0302', 'Dike Amaka', 'dike.amaka@student.babcock.edu.ng', 'student123', 'Mass Communication', '200', 'Female', '08033333332', '08077770002', '14 Wetheral Rd, Owerri', 'Catholic', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(28, '24/0303', 'Momoh Sule', 'momoh.sule@student.babcock.edu.ng', 'student123', 'Economics', '200', 'Male', '08033333333', '08077770003', '5 Auchi Rd, Auchi', 'Muslim', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(29, '24/0304', 'Ajayi Bukola', 'ajayi.bukola@student.babcock.edu.ng', 'student123', 'Law', '200', 'Female', '08033333334', '08077770004', '9 Akure Main St, Akure', 'Anglican', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(30, '24/0305', 'Ogbonna Victor', 'ogbonna.victor@student.babcock.edu.ng', 'student123', 'Medicine', '200', 'Male', '08033333335', '08077770005', '22 Umuahia Rd, Abia', 'Pentecostal', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(31, '24/0306', 'Sowemimo Bola', 'sowemimo.bola@student.babcock.edu.ng', 'student123', 'Accounting', '200', 'Female', '08033333336', '08077770006', '3 Abeokuta Exp, Ogun', 'Seventh-day Adventist', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(32, '24/0307', 'Abubakar Usman', 'abubakar.usman@student.babcock.edu.ng', 'student123', 'Software Engineering', '200', 'Male', '08033333337', '08077770007', '8 Maiduguri Rd, Borno', 'Muslim', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(33, '24/0308', 'Uche Collins', 'uche.collins@student.babcock.edu.ng', 'student123', 'Computer Science', '200', 'Male', '08033333338', '08077770008', '11 Asaba Benin Exp, Asaba', 'Catholic', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(34, '24/0309', 'Jegede Tosin', 'jegede.tosin@student.babcock.edu.ng', 'student123', 'Law', '200', 'Female', '08033333339', '08077770009', '4 Ekiti State Govt Rd, Ado', 'Pentecostal', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(35, '24/0310', 'Bassey Essien', 'bassey.essien@student.babcock.edu.ng', 'student123', 'Medicine', '200', 'Male', '08033333340', '08077770010', '7 Marina Rd, Calabar', 'Presbyterian', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(36, '24/0311', 'Ojo Kemi', 'ojo.kemi@student.babcock.edu.ng', 'student123', 'Economics', '200', 'Female', '08033333341', '08077770011', '6 Osogbo St, Osun', 'Baptist', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(37, '24/0312', 'Yakubu Ali', 'yakubu.ali@student.babcock.edu.ng', 'student123', 'Mass Communication', '200', 'Male', '08033333342', '08077770012', '12 Minna Rd, Niger', 'Muslim', 'Verified', 2, 22, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(38, '25/0401', 'Adeniyi Daniel', 'adeniyi.daniel@student.babcock.edu.ng', 'student123', 'Computer Science', '100', 'Male', '08044444441', '08066660001', '10 Magodo Phase 2, Lagos', 'Seventh-day Adventist', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(39, '25/0402', 'Briggs Tamuno', 'briggs.tamuno@student.babcock.edu.ng', 'student123', 'Software Engineering', '100', 'Male', '08044444442', '08066660002', '5 Old GRA, Port Harcourt', 'Anglican', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(40, '25/0403', 'Cole Elizabeth', 'cole.elizabeth@student.babcock.edu.ng', 'student123', 'Law', '100', 'Female', '08044444443', '08066660003', '8 VGC, Lekki, Lagos', 'Pentecostal', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(41, '25/0404', 'Attah Moses', 'attah.moses@student.babcock.edu.ng', 'student123', 'Medicine', '100', 'Male', '08044444444', '08066660004', '15 Otukpo Rd, Makurdi', 'Catholic', 'Verified', 2, 21, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(42, '25/0405', 'Gbadamosi Halima', 'gbadamosi.halima@student.babcock.edu.ng', 'student123', 'Accounting', '100', 'Female', '08044444445', '08066660005', '3 Ijebu Ode Rd, Ogun', 'Muslim', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(43, '25/0406', 'Ibe Chidi', 'ibe.chidi@student.babcock.edu.ng', 'student123', 'Economics', '100', 'Male', '08044444446', '08066660006', '9 Royce Rd, Owerri', 'Seventh-day Adventist', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(44, '25/0407', 'Etuk Eno', 'etuk.eno@student.babcock.edu.ng', 'student123', 'Mass Communication', '100', 'Female', '08044444447', '08066660007', '4 Uyo Village Rd, Uyo', 'Methodist', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(45, '25/0408', 'Olabisi Wale', 'olabisi.wale@student.babcock.edu.ng', 'student123', 'Computer Science', '100', 'Male', '08044444448', '08066660008', '7 Festac Town, Lagos', 'Pentecostal', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(46, '25/0409', 'Nnaji Rose', 'nnaji.rose@student.babcock.edu.ng', 'student123', 'Law', '100', 'Female', '08044444449', '08066660009', '11 Nsukka Rd, Enugu', 'Catholic', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(47, '25/0410', 'Mohammed Sadiq', 'mohammed.sadiq@student.babcock.edu.ng', 'student123', 'Software Engineering', '100', 'Male', '08044444450', '08066660010', '5 Lafia Rd, Nasarawa', 'Muslim', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(48, '25/0411', 'Oni Peju', 'oni.peju@student.babcock.edu.ng', 'student123', 'Medicine', '100', 'Female', '08044444451', '08066660011', '12 Ilesa Rd, Osun', 'Baptist', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(49, '25/0412', 'Duke Eyo', 'duke.eyo@student.babcock.edu.ng', 'student123', 'Accounting', '100', 'Male', '08044444452', '08066660012', '3 Marian Rd, Calabar', 'Pentecostal', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(50, '25/0413', 'Agbaje Toyin', 'agbaje.toyin@student.babcock.edu.ng', 'student123', 'Economics', '100', 'Female', '08044444453', '08066660013', '8 Ogbomoso Rd, Oyo', 'Seventh-day Adventist', 'Verified', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(51, '22/0901', 'Olatunji Seyi', 'olatunji.seyi@student.babcock.edu.ng', 'student123', 'Computer Science', '400', 'Male', '08055555551', '08055550001', '19 Surulere, Lagos', 'Anglican', 'Pending', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(52, '22/0902', 'Ebuka Mary', 'ebuka.mary@student.babcock.edu.ng', 'student123', 'Law', '400', 'Female', '08055555552', '08055550002', '4 Independence Layout, Enugu', 'Catholic', 'Pending', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(53, '23/0903', 'Ademola Kunle', 'ademola.kunle@student.babcock.edu.ng', 'student123', 'Medicine', '300', 'Male', '08055555553', '08055550003', '10 Mokola, Ibadan', 'Seventh-day Adventist', 'Pending', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(54, '23/0904', 'Ishola Fatima', 'ishola.fatima@student.babcock.edu.ng', 'student123', 'Accounting', '300', 'Female', '08055555554', '08055550004', '6 GRA, Ilorin', 'Muslim', 'Pending', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(55, '24/0905', 'Okoro Peter', 'okoro.peter@student.babcock.edu.ng', 'student123', 'Economics', '200', 'Male', '08055555555', '08055550005', '12 Warri Sapele Rd, Delta', 'Pentecostal', 'Pending', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(56, '24/0906', 'Bamidele Joy', 'bamidele.joy@student.babcock.edu.ng', 'student123', 'Mass Communication', '200', 'Female', '08055555556', '08055550006', '8 Akure Rd, Ondo', 'Anglican', 'Pending', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(57, '24/0907', 'Umar Farouk', 'umar.farouk@student.babcock.edu.ng', 'student123', 'Software Engineering', '200', 'Male', '08055555557', '08055550007', '5 Sokoto Rd, Sokoto', 'Muslim', 'Pending', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(58, '25/0908', 'Ekeh Chinwe', 'ekeh.chinwe@student.babcock.edu.ng', 'student123', 'Computer Science', '100', 'Female', '08055555558', '08055550008', '3 Abakaliki Rd, Ebonyi', 'Catholic', 'Pending', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(59, '25/0909', 'Solomon King', 'solomon.king@student.babcock.edu.ng', 'student123', 'Law', '100', 'Male', '08055555559', '08055550009', '14 Yenagoa Rd, Bayelsa', 'Pentecostal', 'Pending', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(60, '25/0910', 'Audu Laraba', 'audu.laraba@student.babcock.edu.ng', 'student123', 'Medicine', '100', 'Female', '08055555560', '08055550010', '9 Jalingo Rd, Taraba', 'Seventh-day Adventist', 'Pending', NULL, NULL, '2026-01-25 21:55:58', '2026-01-25 21:55:58'),
	(61, '22/1217', 'Chika Excel', 'cexcel58@gmail.com', 'student123', 'Computer Science', '400', 'Male', '08011111655', '080999565001', '14 Adeola Odeku St, VI, Lagos', 'Pentecostal', 'Verified', 1, 1, '2026-01-25 20:55:58', '2026-01-25 20:55:58'),
	(62, '22/1218', 'Favour ', 'murewabamigbola@gamil.com', 'student123', 'Computer Science', '400', 'Female', '08011111655', '080999565001', '14 Adeola Odeku St, VI, Lagos', 'Pentecostal', 'Verified', 4, 41, '2026-01-25 20:55:58', '2026-01-25 20:55:58'),
	(63, '22/1219', 'chika excel james ', 'chikachikaexcel@gmail.com', 'student123', 'Computer Science', '400', 'Male', '09155564452', '08029296650', '14 Adeola Odeku St, VI, Lagos', 'Pentecostal', 'Verified', 1, 1, '2026-01-25 20:55:58', '2026-01-25 20:55:58');

-- Dumping structure for trigger room_allocation_system_db.update_hall_availability
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `update_hall_availability` AFTER UPDATE ON `room` FOR EACH ROW BEGIN
    DECLARE available_count INT;
    SELECT COUNT(*) INTO available_count 
    FROM Room 
    WHERE hall_id = NEW.hall_id AND room_status IN ('Available', 'Occupied');
    
    UPDATE Hall SET available_rooms = available_count WHERE hall_id = NEW.hall_id;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger room_allocation_system_db.update_room_status_before_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `update_room_status_before_update` BEFORE UPDATE ON `room` FOR EACH ROW BEGIN
    IF NEW.current_occupants >= NEW.capacity THEN
        SET NEW.room_status = 'Full';
    ELSEIF NEW.current_occupants > 0 THEN
        SET NEW.room_status = 'Occupied';
    ELSE
        SET NEW.room_status = 'Available';
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
