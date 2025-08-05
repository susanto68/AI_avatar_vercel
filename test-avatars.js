// Quick test script to verify all avatar images are accessible
const http = require('http');

const avatars = [
  'computer-teacher', 'english-teacher', 'biology-teacher', 'physics-teacher',
  'chemistry-teacher', 'history-teacher', 'geography-teacher', 'hindi-teacher',
  'mathematics-teacher', 'doctor', 'engineer', 'lawyer'
];

async function testAvatar(avatar) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/assets/avatars/${avatar}.png`,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      const status = res.statusCode === 200 ? '✅' : '❌';
      console.log(`${status} ${avatar}.png - Status: ${res.statusCode}, Size: ${res.headers['content-length']} bytes`);
      resolve(res.statusCode === 200);
    });

    req.on('error', (err) => {
      console.log(`❌ ${avatar}.png - Error: ${err.message}`);
      resolve(false);
    });

    req.end();
  });
}

async function testAllAvatars() {
  console.log('🧪 Testing Avatar Images Accessibility...\n');
  
  let successCount = 0;
  for (const avatar of avatars) {
    const success = await testAvatar(avatar);
    if (success) successCount++;
  }
  
  console.log(`\n📊 Results: ${successCount}/${avatars.length} avatars accessible`);
  if (successCount === avatars.length) {
    console.log('🎉 All avatar images are working correctly!');
  } else {
    console.log('⚠️  Some avatar images need attention.');
  }
}

testAllAvatars();