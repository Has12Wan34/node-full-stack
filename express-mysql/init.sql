CREATE TABLE IF NOT EXISTS attractions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name varchar(50) NOT NULL,
  detail varchar(500) NOT NULL,
  coverimage varchar(100) NOT NULL,
  latitude decimal(11,7) NOT NULL,
  longitude decimal(11,7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO attractions (name, detail, coverimage, latitude, longitude) VALUES
('Phi Phi Islands', 'Phi Phi Islands are a group of islands in Thailand between the large island of Phuket and the Malacca Coastal Strait of Thailand.', 'https://www.melivecode.com/attractions/1.jpg', '7.7376190', '98.7068755');

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fname VARCHAR(100) NOT NULL,
    lname VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);