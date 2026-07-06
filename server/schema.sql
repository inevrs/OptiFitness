-- OptiFitness Database Schema
-- Run this file to create all tables: mysql -u root -p optifitness < schema.sql

CREATE DATABASE IF NOT EXISTS optifitness;
USE optifitness;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  total_points INT NOT NULL DEFAULT 0,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_active_date DATE,
  weight_kg DECIMAL(5,2),
  height_cm DECIMAL(5,2),
  age INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);




-- Water intake, one row per glass logged
CREATE TABLE IF NOT EXISTS water_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  log_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Exercise logs
CREATE TABLE IF NOT EXISTS exercise_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  duration_minutes INT NOT NULL,
  calories_burned INT,
  photo_path LONGTEXT NULL,
  logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Meal logs
CREATE TABLE IF NOT EXISTS meal_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  meal_name VARCHAR(100) NOT NULL,
  calories INT,
  logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- === Social / Gamification tables ===

-- Squads (teams users can join)
CREATE TABLE IF NOT EXISTS squads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_by INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Membership join table
CREATE TABLE IF NOT EXISTS squad_members (
  squad_id INT NOT NULL,
  user_id INT NOT NULL UNIQUE,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (squad_id, user_id),
  FOREIGN KEY (squad_id) REFERENCES squads(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Catalog of possible micro-workouts (seeded data)
CREATE TABLE IF NOT EXISTS micro_workouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  points INT NOT NULL DEFAULT 10
);

-- Daily challenges assigned to a user
CREATE TABLE IF NOT EXISTS daily_challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  micro_workout_id INT NOT NULL,
  challenge_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at DATETIME NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (micro_workout_id) REFERENCES micro_workouts(id) ON DELETE CASCADE
);


-- Badge catalog
CREATE TABLE IF NOT EXISTS badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  image_url VARCHAR(255),
  requirement_type ENUM('streak', 'points', 'challenges_completed', 'water_reached') NOT NULL,
  requirement_value INT NOT NULL
);

-- Which badges a user has unlocked
CREATE TABLE IF NOT EXISTS user_badges (
  user_id INT NOT NULL,
  badge_id INT NOT NULL,
  unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, badge_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

-- Challenge Feed: shareable posts
CREATE TABLE IF NOT EXISTS feed_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  post_type ENUM('challenge_completed', 'badge_unlocked', 'streak_milestone') NOT NULL,
  reference_id INT,
  message VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);



-- === Seed Data ===

-- Micro-workout catalog
INSERT INTO micro_workouts (title, description, points) VALUES
  ('20 Jumping Jacks', 'Do 20 jumping jacks in a row', 10),
  ('15 Push-ups', 'Complete 15 push-ups with good form', 15),
  ('30-Second Plank', 'Hold a plank for 30 seconds', 10),
  ('20 Squats', 'Do 20 bodyweight squats', 10),
  ('10 Burpees', 'Complete 10 burpees', 20),
  ('1-Minute Wall Sit', 'Hold a wall sit for 60 seconds', 15),
  ('20 Lunges', 'Do 10 lunges per leg', 10),
  ('15 Sit-ups', 'Complete 15 sit-ups', 10),
  ('30 High Knees', 'Do 30 high knees in place', 10),
  ('10 Tricep Dips', 'Use a chair for 10 tricep dips', 15),
  ('20 Mountain Climbers', 'Do 20 mountain climbers', 15),
  ('15 Calf Raises', 'Do 15 calf raises', 10),
  ('5 Minute Stretch', 'Full body stretch for 5 minutes', 10),
  ('1 Minute Jump Rope', 'Jump rope or mimic for 1 minute', 15),
  ('10 Superman Holds', 'Lie face down, lift arms and legs 10 times', 10)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Badge catalog (exactly 6 badges)
INSERT INTO badges (id, name, description, requirement_type, requirement_value) VALUES
  (1, 'First Steps', 'Complete your first challenge', 'challenges_completed', 1),
  (2, 'Getting Started', 'Earn 50 points', 'points', 50),
  (3, 'Hydrated', 'Reach 8 glasses of water in a day', 'water_reached', 8),
  (4, 'Dedicated', 'Complete 3 daily challenges', 'challenges_completed', 3),
  (5, 'On Fire', 'Reach a 3-day challenge streak', 'streak', 3),
  (6, 'Point master', 'Earn 100 points', 'points', 100)
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  description = VALUES(description),
  requirement_type = VALUES(requirement_type),
  requirement_value = VALUES(requirement_value);

