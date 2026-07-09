-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 06, 2026 at 12:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zenfitness`
--

-- --------------------------------------------------------

--
-- Table structure for table `badges`
--

CREATE TABLE `badges` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `requirement_type` enum('streak','points','challenges_completed','water_reached') NOT NULL,
  `requirement_value` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `badges`
--

INSERT INTO `badges` (`id`, `name`, `description`, `image_url`, `requirement_type`, `requirement_value`) VALUES
(1, 'First Steps', 'Complete your first challenge', NULL, 'challenges_completed', 1),
(2, 'Getting Started', 'Earn 50 points', NULL, 'points', 50),
(3, 'Hydrated', 'Reach 8 glasses of water in a day', NULL, 'water_reached', 8),
(4, 'Dedicated', 'Complete 3 daily challenges', NULL, 'challenges_completed', 3),
(5, 'On Fire', 'Reach a 3-day challenge streak', NULL, 'streak', 3),
(6, 'Point master', 'Earn 100 points', NULL, 'points', 100);

-- --------------------------------------------------------

--
-- Table structure for table `daily_challenges`
--

CREATE TABLE `daily_challenges` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `micro_workout_id` int(11) NOT NULL,
  `challenge_date` date NOT NULL,
  `completed` tinyint(1) DEFAULT 0,
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `daily_challenges`
--

INSERT INTO `daily_challenges` (`id`, `user_id`, `micro_workout_id`, `challenge_date`, `completed`, `completed_at`) VALUES
(7, 1, 12, '2026-07-04', 0, NULL),
(8, 1, 6, '2026-07-04', 0, NULL),
(9, 1, 6, '2026-07-04', 0, NULL),
(13, 2, 4, '2026-07-04', 1, '2026-07-05 00:07:26'),
(14, 2, 1, '2026-07-04', 1, '2026-07-05 00:58:21'),
(15, 2, 2, '2026-07-04', 1, '2026-07-05 00:58:22'),
(19, 1, 2, '2026-07-05', 1, '2026-07-05 22:37:24'),
(20, 1, 6, '2026-07-05', 1, '2026-07-05 12:40:55'),
(21, 1, 9, '2026-07-05', 1, '2026-07-05 12:40:57'),
(31, 1, 12, '2026-07-06', 1, '2026-07-06 16:47:50'),
(32, 1, 8, '2026-07-06', 1, '2026-07-06 16:47:50'),
(33, 1, 15, '2026-07-06', 1, '2026-07-06 16:47:51'),
(43, 10, 15, '2026-07-06', 1, '2026-07-06 17:36:14'),
(44, 10, 6, '2026-07-06', 1, '2026-07-06 17:36:13'),
(45, 10, 10, '2026-07-06', 1, '2026-07-06 17:36:12');

-- --------------------------------------------------------

--
-- Table structure for table `exercise_logs`
--

CREATE TABLE `exercise_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `activity_type` varchar(50) NOT NULL,
  `duration_minutes` int(11) NOT NULL,
  `calories_burned` int(11) DEFAULT NULL,
  `logged_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exercise_logs`
--

INSERT INTO `exercise_logs` (`id`, `user_id`, `activity_type`, `duration_minutes`, `calories_burned`, `logged_at`) VALUES
(10, 1, 'Running', 30, 100, '2026-07-06 17:32:57');

-- --------------------------------------------------------

--
-- Table structure for table `feed_posts`
--

CREATE TABLE `feed_posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_type` enum('challenge_completed','badge_unlocked','streak_milestone') NOT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feed_posts`
--

INSERT INTO `feed_posts` (`id`, `user_id`, `post_type`, `reference_id`, `message`, `created_at`) VALUES
(38, 10, 'badge_unlocked', NULL, 'Unlocked the \"First Steps\" badge! 🏅', '2026-07-06 17:36:12'),
(39, 10, 'challenge_completed', NULL, 'Completed a challenge and earned 15 points! 💪', '2026-07-06 17:36:12'),
(40, 10, 'challenge_completed', NULL, 'Completed a challenge and earned 15 points! 💪', '2026-07-06 17:36:13'),
(41, 10, 'badge_unlocked', NULL, 'Unlocked the \"Dedicated\" badge! 🏅', '2026-07-06 17:36:14'),
(42, 10, 'challenge_completed', NULL, 'Completed a challenge and earned 10 points! 💪', '2026-07-06 17:36:14');

-- --------------------------------------------------------

--
-- Table structure for table `meal_logs`
--

CREATE TABLE `meal_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `meal_name` varchar(100) NOT NULL,
  `calories` int(11) DEFAULT NULL,
  `logged_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meal_logs`
--

INSERT INTO `meal_logs` (`id`, `user_id`, `meal_name`, `calories`, `logged_at`) VALUES
(1, 1, 'Nasi Lemak', 200, '2026-07-04 23:32:18');

-- --------------------------------------------------------

--
-- Table structure for table `micro_workouts`
--

CREATE TABLE `micro_workouts` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `points` int(11) NOT NULL DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `micro_workouts`
--

INSERT INTO `micro_workouts` (`id`, `title`, `description`, `points`) VALUES
(1, '20 Jumping Jacks', 'Do 20 jumping jacks in a row', 10),
(2, '15 Push-ups', 'Complete 15 push-ups with good form', 15),
(3, '30-Second Plank', 'Hold a plank for 30 seconds', 10),
(4, '20 Squats', 'Do 20 bodyweight squats', 10),
(5, '10 Burpees', 'Complete 10 burpees', 20),
(6, '1-Minute Wall Sit', 'Hold a wall sit for 60 seconds', 15),
(7, '20 Lunges', 'Do 10 lunges per leg', 10),
(8, '15 Sit-ups', 'Complete 15 sit-ups', 10),
(9, '30 High Knees', 'Do 30 high knees in place', 10),
(10, '10 Tricep Dips', 'Use a chair for 10 tricep dips', 15),
(11, '20 Mountain Climbers', 'Do 20 mountain climbers', 15),
(12, '15 Calf Raises', 'Do 15 calf raises', 10),
(13, '5 Minute Stretch', 'Full body stretch for 5 minutes', 10),
(14, '1 Minute Jump Rope', 'Jump rope or mimic for 1 minute', 15),
(15, '10 Superman Holds', 'Lie face down, lift arms and legs 10 times', 10);

-- --------------------------------------------------------

--
-- Table structure for table `squads`
--

CREATE TABLE `squads` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `squads`
--

INSERT INTO `squads` (`id`, `name`, `created_by`, `created_at`) VALUES
(3, 'GymShark', 1, '2026-07-06 16:50:02'),
(4, 'ThunderBasket', 10, '2026-07-06 17:36:02');

-- --------------------------------------------------------

--
-- Table structure for table `squad_members`
--

CREATE TABLE `squad_members` (
  `squad_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `joined_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `squad_members`
--

INSERT INTO `squad_members` (`squad_id`, `user_id`, `joined_at`) VALUES
(3, 1, '2026-07-06 16:53:17'),
(4, 10, '2026-07-06 17:36:02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `total_points` int(11) NOT NULL DEFAULT 0,
  `current_streak` int(11) NOT NULL DEFAULT 0,
  `longest_streak` int(11) NOT NULL DEFAULT 0,
  `last_active_date` date DEFAULT NULL,
  `weight_kg` decimal(5,2) DEFAULT NULL,
  `height_cm` decimal(5,2) DEFAULT NULL,
  `age` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `full_name`, `created_at`, `total_points`, `current_streak`, `longest_streak`, `last_active_date`, `weight_kg`, `height_cm`, `age`) VALUES
(1, 'Isyraf', '$2b$10$Vm9rh8JDarOD0ERaCtDg0ekl6fF3VE.iZddFAGkdzkgVRG086ELbq', 'Isyraf Nasruddin', '2026-07-04 23:24:44', 100, 1, 1, '2026-07-06', 58.00, 120.00, 20),
(2, 'Hasnul', '$2b$10$EBnCkuQ4SpULWLCenTCDmepErjEOzUW/xY.WMHhnYjnslmrYjMdSC', 'Hasnul Hakim', '2026-07-04 23:54:36', 35, 1, 1, '2026-07-04', 80.00, 190.00, 26),
(3, 'Yquefue', '$2b$10$wZJbm/PHNrPNZwjY4Ph.0Oc22t/bXE78hF/EKeaMIbWaFl4h4JTVK', 'Lamine Yamal', '2026-07-05 00:02:18', 450, 5, 7, NULL, 65.00, 180.00, 17),
(4, 'Messy', '$2b$10$wZJbm/PHNrPNZwjY4Ph.0Oc22t/bXE78hF/EKeaMIbWaFl4h4JTVK', 'Lionel Messi', '2026-07-05 00:02:18', 800, 10, 15, NULL, 72.00, 170.00, 36),
(5, 'Ronaldo7', '$2b$10$wZJbm/PHNrPNZwjY4Ph.0Oc22t/bXE78hF/EKeaMIbWaFl4h4JTVK', 'Christiano Ronaldo', '2026-07-05 00:02:18', 950, 14, 21, NULL, 85.00, 187.00, 39),
(6, 'Bob', '$2b$10$wZJbm/PHNrPNZwjY4Ph.0Oc22t/bXE78hF/EKeaMIbWaFl4h4JTVK', 'Bob Bob', '2026-07-05 00:02:18', 120, 2, 3, NULL, 90.00, 175.00, 40),
(7, 'Nestum', '$2b$10$aHgW1AnmDpmMhfrzhC3os.K4jeXnOpcikSrbwWRQOWCuuhSe/aR/6', 'Anas Syukri', '2026-07-05 00:02:18', 340, 4, 6, NULL, 70.00, 178.00, 25),
(10, 'Nenas', '$2b$10$RPQmxbWpNdVB.WHb.jMps.zIQ9u/IStddT5NL0Tsdbon7txqTfXPC', 'Nazmie Syamil', '2026-07-06 17:35:33', 40, 1, 1, '2026-07-06', 60.00, 163.00, 19);

-- --------------------------------------------------------

--
-- Table structure for table `user_badges`
--

CREATE TABLE `user_badges` (
  `user_id` int(11) NOT NULL,
  `badge_id` int(11) NOT NULL,
  `unlocked_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_badges`
--

INSERT INTO `user_badges` (`user_id`, `badge_id`, `unlocked_at`) VALUES
(1, 1, '2026-07-04 23:34:23'),
(1, 2, '2026-07-05 12:40:57'),
(1, 3, '2026-07-04 23:41:19'),
(1, 4, '2026-07-04 23:43:53'),
(1, 6, '2026-07-06 16:47:51'),
(2, 1, '2026-07-05 00:07:26'),
(2, 3, '2026-07-05 00:58:04'),
(2, 4, '2026-07-05 00:58:22'),
(10, 1, '2026-07-06 17:36:12'),
(10, 4, '2026-07-06 17:36:14');

-- --------------------------------------------------------

--
-- Table structure for table `water_logs`
--

CREATE TABLE `water_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `logged_at` datetime DEFAULT current_timestamp(),
  `log_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `water_logs`
--

INSERT INTO `water_logs` (`id`, `user_id`, `logged_at`, `log_date`) VALUES
(16, 2, '2026-07-05 00:09:00', '2026-07-04'),
(17, 2, '2026-07-05 00:09:01', '2026-07-04'),
(18, 2, '2026-07-05 00:09:02', '2026-07-04'),
(31, 1, '2026-07-05 00:51:50', '2026-07-04'),
(32, 2, '2026-07-05 00:58:01', '2026-07-04'),
(33, 2, '2026-07-05 00:58:02', '2026-07-04'),
(34, 2, '2026-07-05 00:58:03', '2026-07-04'),
(35, 2, '2026-07-05 00:58:03', '2026-07-04'),
(36, 2, '2026-07-05 00:58:04', '2026-07-04'),
(37, 1, '2026-07-05 01:24:40', '2026-07-04'),
(46, 1, '2026-07-05 22:37:37', '2026-07-05'),
(47, 1, '2026-07-05 22:37:38', '2026-07-05'),
(48, 1, '2026-07-05 22:37:39', '2026-07-05'),
(49, 1, '2026-07-05 22:37:40', '2026-07-05'),
(50, 1, '2026-07-05 22:37:41', '2026-07-05'),
(51, 1, '2026-07-05 22:37:44', '2026-07-05'),
(52, 1, '2026-07-05 22:37:45', '2026-07-05'),
(53, 1, '2026-07-05 22:37:47', '2026-07-05'),
(85, 1, '2026-07-06 17:32:25', '2026-07-06'),
(86, 1, '2026-07-06 17:32:25', '2026-07-06'),
(87, 1, '2026-07-06 17:32:26', '2026-07-06'),
(88, 1, '2026-07-06 17:32:26', '2026-07-06'),
(89, 1, '2026-07-06 17:32:27', '2026-07-06'),
(90, 1, '2026-07-06 17:32:27', '2026-07-06'),
(91, 1, '2026-07-06 17:32:28', '2026-07-06'),
(92, 1, '2026-07-06 17:32:28', '2026-07-06'),
(93, 10, '2026-07-06 17:36:27', '2026-07-06'),
(94, 10, '2026-07-06 17:36:28', '2026-07-06'),
(95, 10, '2026-07-06 17:36:28', '2026-07-06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `badges`
--
ALTER TABLE `badges`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `daily_challenges`
--
ALTER TABLE `daily_challenges`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `micro_workout_id` (`micro_workout_id`);

--
-- Indexes for table `exercise_logs`
--
ALTER TABLE `exercise_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `feed_posts`
--
ALTER TABLE `feed_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `meal_logs`
--
ALTER TABLE `meal_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `micro_workouts`
--
ALTER TABLE `micro_workouts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `squads`
--
ALTER TABLE `squads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `squad_members`
--
ALTER TABLE `squad_members`
  ADD PRIMARY KEY (`squad_id`,`user_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_badges`
--
ALTER TABLE `user_badges`
  ADD PRIMARY KEY (`user_id`,`badge_id`),
  ADD KEY `badge_id` (`badge_id`);

--
-- Indexes for table `water_logs`
--
ALTER TABLE `water_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `badges`
--
ALTER TABLE `badges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `daily_challenges`
--
ALTER TABLE `daily_challenges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `exercise_logs`
--
ALTER TABLE `exercise_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `feed_posts`
--
ALTER TABLE `feed_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `meal_logs`
--
ALTER TABLE `meal_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `micro_workouts`
--
ALTER TABLE `micro_workouts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `squads`
--
ALTER TABLE `squads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `water_logs`
--
ALTER TABLE `water_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `daily_challenges`
--
ALTER TABLE `daily_challenges`
  ADD CONSTRAINT `daily_challenges_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `daily_challenges_ibfk_2` FOREIGN KEY (`micro_workout_id`) REFERENCES `micro_workouts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `exercise_logs`
--
ALTER TABLE `exercise_logs`
  ADD CONSTRAINT `exercise_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `feed_posts`
--
ALTER TABLE `feed_posts`
  ADD CONSTRAINT `feed_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `meal_logs`
--
ALTER TABLE `meal_logs`
  ADD CONSTRAINT `meal_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `squads`
--
ALTER TABLE `squads`
  ADD CONSTRAINT `squads_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `squad_members`
--
ALTER TABLE `squad_members`
  ADD CONSTRAINT `squad_members_ibfk_1` FOREIGN KEY (`squad_id`) REFERENCES `squads` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `squad_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_badges`
--
ALTER TABLE `user_badges`
  ADD CONSTRAINT `user_badges_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_badges_ibfk_2` FOREIGN KEY (`badge_id`) REFERENCES `badges` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `water_logs`
--
ALTER TABLE `water_logs`
  ADD CONSTRAINT `water_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
