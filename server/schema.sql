CREATE DATABASE IF NOT EXISTS jobflow;
USE jobflow;

CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company VARCHAR(120) NOT NULL,
  position VARCHAR(120) NOT NULL,
  status ENUM('Wishlist','Applied','Interview','Offer','Rejected') NOT NULL DEFAULT 'Wishlist',
  link VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO applications (company, position, status, link, notes) VALUES
('Demo Company', 'Junior Frontend Developer', 'Applied', 'https://example.com', 'Portfolio demo entry');
