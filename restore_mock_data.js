const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zenfitness',
    port: 3306
  });

  const users = [
    { username: 'Yquefue',  weight_kg: 65, height_cm: 180, age: 17, total_points: 450, current_streak: 5,  longest_streak: 7  },
    { username: 'Messy',    weight_kg: 72, height_cm: 170, age: 36, total_points: 800, current_streak: 10, longest_streak: 15 },
    { username: 'Ronaldo7', weight_kg: 85, height_cm: 187, age: 39, total_points: 950, current_streak: 14, longest_streak: 21 },
    { username: 'Bob',      weight_kg: 90, height_cm: 175, age: 40, total_points: 120, current_streak: 2,  longest_streak: 3  },
    { username: 'Nestum',   weight_kg: 70, height_cm: 178, age: 25, total_points: 340, current_streak: 4,  longest_streak: 6  },
  ];

  for (const u of users) {
    await conn.query(
      `UPDATE users SET weight_kg = ?, height_cm = ?, age = ?, total_points = ?, current_streak = ?, longest_streak = ? WHERE username = ?`,
      [u.weight_kg, u.height_cm, u.age, u.total_points, u.current_streak, u.longest_streak, u.username]
    );
    console.log(`✓ Updated ${u.username}`);
  }

  console.log('\nAll mock data restored successfully!');
  await conn.end();
}

main().catch(console.error);
