const bcrypt = require('bcryptjs');

const plain = 'AdminPassword123';   // <-- This is the password you want
const hash = bcrypt.hashSync(plain, 10);

console.log('PLAINTEXT:', plain);
console.log('HASH:', hash);
console.log('LENGTH:', hash.length);