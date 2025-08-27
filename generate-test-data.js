const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Generate random user data
function generateRandomUser() {
  const names = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eva Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor', 'Ivy Chen', 'Jack Anderson'];
  const name = names[Math.floor(Math.random() * names.length)];
  
  return {
    name: name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=150&h=150&fit=crop&crop=face`,
    createdAt: new Date(),
    level: 'Intermediate',
    membership: 'Premium'
  };
}

// Generate random metrics
function generateRandomMetrics() {
  return {
    maxWeightLifted: Math.floor(Math.random() * 300) + 50,
    totalWorkouts: Math.floor(Math.random() * 100) + 10,
    averageWorkoutDuration: Math.floor(Math.random() * 60) + 20,
    consistencyScore: Math.floor(Math.random() * 40) + 60,
    improvementRate: Math.random() * 20 + 5,
    lastWorkoutDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    workoutStreak: Math.floor(Math.random() * 20) + 1,
    totalCaloriesBurned: Math.floor(Math.random() * 50000) + 10000,
    averageHeartRate: Math.floor(Math.random() * 40) + 120,
    maxHeartRate: Math.floor(Math.random() * 60) + 160,
    flexibilityScore: Math.floor(Math.random() * 40) + 60,
    enduranceScore: Math.floor(Math.random() * 40) + 60,
    strengthScore: Math.floor(Math.random() * 40) + 60,
    lastUpdated: new Date()
  };
}

// Generate test data
async function generateTestData() {
  console.log('🚀 Generating test data for Smart Ranking System...\n');

  try {
    // Generate 10 test users
    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = generateRandomUser();
      users.push(user);
    }

    // Create users and their metrics
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const userId = `test-user-${i + 1}`;
      
      console.log(`📝 Creating user: ${user.name}`);
      
      // Create user document
      await db.collection('users').doc(userId).set({
        ...user,
        uid: userId,
        points: 0,
        rank: 'Bronze'
      });

      // Create user metrics
      const metrics = generateRandomMetrics();
      await db.collection('userMetrics').doc(userId).set(metrics);
      
      console.log(`✅ Created user ${user.name} with metrics`);
    }

    // Initialize system configuration
    console.log('\n⚙️ Initializing system configuration...');
    
    await db.collection('systemConfig').doc('rankingWeights').set({
      strength: 0.3,
      stamina: 0.25,
      consistency: 0.25,
      improvement: 0.2,
      lastUpdated: new Date()
    });

    await db.collection('statistics').doc('system').set({
      totalUsers: users.length,
      totalWorkouts: users.reduce((sum, user) => sum + Math.floor(Math.random() * 100) + 10, 0),
      averageScore: 0,
      lastUpdated: new Date()
    });

    console.log('✅ System configuration initialized');

    console.log('\n🎉 Test data generation complete!');
    console.log(`📊 Created ${users.length} test users`);
    console.log('🔗 Visit your ranking page to see the results');
    console.log('📚 Run the test suite: node test/ranking-system-test.js');

  } catch (error) {
    console.error('❌ Error generating test data:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  generateTestData();
}

module.exports = { generateTestData };
