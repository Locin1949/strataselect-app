DELETE FROM users;

INSERT INTO users (id, password, role)
VALUES 
  ('admin1', '$2b$10$dqh25/XYawatWquT.cWhvucm2d6SoOFZBSoPbiJ7lGD4o0Pis7QAy', 'admin'),
  ('manager1', '$2b$10$n5IXsW2ZyiYxyhZNI7j9QuR7o9.7r8YiPkC4Hx7isiRy6OQC2mO8e', 'manager'),
  ('committee1', '$2b$10$uE5Qx/Q2DLSWCO9CrKfXQO1LRR6/WwaEo3OVnxm2t8X8KXTTHY5sC', 'committee');