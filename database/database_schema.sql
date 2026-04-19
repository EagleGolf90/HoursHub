-- Business Hours Database Schema

-- Table for different locations/businesses
CREATE TABLE IF NOT EXISTS Locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'General',
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for regular business hours (Monday-Sunday)
CREATE TABLE IF NOT EXISTS RegularHours (
  id INT PRIMARY KEY AUTO_INCREMENT,
  location_id INT NOT NULL,
  day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES Locations(id) ON DELETE CASCADE,
  UNIQUE KEY unique_location_day (location_id, day_of_week)
);

-- Table for multiple time slots per day (e.g., morning shift and evening shift)
CREATE TABLE IF NOT EXISTS TimeSlots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  location_id INT NOT NULL,
  day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
  slot_number INT DEFAULT 1,
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  break_start TIME,
  break_end TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES Locations(id) ON DELETE CASCADE
);

-- Table for holiday exceptions
CREATE TABLE IF NOT EXISTS HolidayExceptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  location_id INT NOT NULL,
  holiday_date DATE NOT NULL,
  holiday_name VARCHAR(100),
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  notes VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES Locations(id) ON DELETE CASCADE,
  UNIQUE KEY unique_location_date (location_id, holiday_date)
);

-- Example data
INSERT INTO Locations (name, category, address, city, state, zip_code) VALUES
('Main Office', 'Corporate Office', '123 Main Street', 'New York', 'NY', '10001'),
('Downtown Branch', 'Retail Branch', '456 Park Avenue', 'New York', 'NY', '10022');

INSERT INTO RegularHours (location_id, day_of_week, open_time, close_time, is_closed) VALUES
(1, 'Monday', '09:00:00', '18:00:00', FALSE),
(1, 'Tuesday', '09:00:00', '18:00:00', FALSE),
(1, 'Wednesday', '09:00:00', '18:00:00', FALSE),
(1, 'Thursday', '09:00:00', '18:00:00', FALSE),
(1, 'Friday', '09:00:00', '20:00:00', FALSE),
(1, 'Saturday', '10:00:00', '16:00:00', FALSE),
(1, 'Sunday', NULL, NULL, TRUE),
(2, 'Monday', '08:00:00', '17:00:00', FALSE),
(2, 'Tuesday', '08:00:00', '17:00:00', FALSE),
(2, 'Wednesday', '08:00:00', '17:00:00', FALSE),
(2, 'Thursday', '08:00:00', '17:00:00', FALSE),
(2, 'Friday', '08:00:00', '19:00:00', FALSE),
(2, 'Saturday', NULL, NULL, TRUE),
(2, 'Sunday', NULL, NULL, TRUE);

INSERT INTO TimeSlots (location_id, day_of_week, slot_number, open_time, close_time, break_start, break_end) VALUES
(1, 'Monday', 1, '09:00:00', '12:00:00', NULL, NULL),
(1, 'Monday', 2, '13:00:00', '18:00:00', '12:00:00', '13:00:00'),
(1, 'Tuesday', 1, '09:00:00', '12:00:00', NULL, NULL),
(1, 'Tuesday', 2, '13:00:00', '18:00:00', '12:00:00', '13:00:00');

INSERT INTO HolidayExceptions (location_id, holiday_date, holiday_name, is_closed) VALUES
(1, '2025-12-25', 'Christmas Day', TRUE),
(1, '2025-01-01', 'New Year Day', TRUE),
(2, '2025-12-25', 'Christmas Day', TRUE),
(2, '2025-07-04', 'Independence Day', TRUE);
