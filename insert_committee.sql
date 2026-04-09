DELETE FROM users WHERE id = 'committee1';

INSERT INTO users (id, password, role)
VALUES (
  'committee1',
  '$2b$10$CwTycUXWue0Thq9StjUM0uJ8u6xVnZl8Yp9q7xv8Qe4p6dQJ7G8yW',
  'committee'
);