// Comprehensive avatar image test
const http = require('http');

const AVATAR_CONFIG = {
  'computer-teacher': { name: 'Computer Teacher', image: '/assets/avatars/computer-teacher.png' },
  'english-teacher': { name: 'English Teacher', image: '/assets/avatars/english-teacher.png' },
  'biology-teacher': { name: 'Biology Teacher', image: '/assets/avatars/biology-teacher.png' },
  'physics-teacher': { name: 'Physics Teacher', image: '/assets/avatars/physics-teacher.png' },
  'chemistry-teacher': { name: 'Chemistry Teacher', image: '/assets/avatars/chemistry-teacher.png' },
  'history-teacher': { name: 'History Teacher', image: '/assets/avatars/history-teacher.png' },
  'geography-teacher': { name: 'Geography Teacher', image: '/assets/avatars/geography-teacher.png' },
  'hindi-teacher': { name: 'Hindi Teacher', image: '/assets/avatars/hindi-teacher.png' },
  'mathematics-teacher': { name: 'Mathematics Teacher', image: '/assets/avatars/mathematics-teacher.png' },
  'doctor': { name: 'AI Doctor', image: '/assets/avatars/doctor.png' },
  'engineer': { name: 'AI Engineer', image: '/assets/avatars/engineer.png' },
  'lawyer': { name: 'AI Lawyer', image: '/assets/avatars/lawyer.png' }
};

async function testAvatarImage(key, config) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: config.image,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      const status = res.statusCode === 200 ? '✅' : '❌';
      const size = res.headers['content-length'] || 'Unknown';
      const contentType = res.headers['content-type'] || 'Unknown';
      
      console.log(`${status} ${config.name}`);
      console.log(`   Path: ${config.image}`);
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Size: ${size} bytes`);
      console.log(`   Type: ${contentType}`);
      console.log('');
      
      resolve({
        key,
        name: config.name,
        success: res.statusCode === 200,
        size: parseInt(size) || 0,
        contentType
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${config.name} - ERROR: ${err.message}`);
      resolve({
        key,
        name: config.name,
        success: false,
        error: err.message
      });
    });

    req.end();
  });
}

async function testAllAvatars() {
  console.log('🧪 COMPREHENSIVE AVATAR IMAGE TEST');
  console.log('=' .repeat(50));
  console.log('');
  
  const results = [];
  
  for (const [key, config] of Object.entries(AVATAR_CONFIG)) {
    const result = await testAvatarImage(key, config);
    results.push(result);
  }
  
  console.log('📊 FINAL SUMMARY');
  console.log('=' .repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Working Images: ${successful.length}/${results.length}`);
  console.log(`❌ Failed Images: ${failed.length}/${results.length}`);
  
  if (successful.length > 0) {
    console.log('\n✅ WORKING AVATARS:');
    successful.forEach(r => console.log(`   • ${r.name} (${r.size} bytes)`));
  }
  
  if (failed.length > 0) {
    console.log('\n❌ FAILED AVATARS:');
    failed.forEach(r => console.log(`   • ${r.name} - ${r.error || 'HTTP Error'}`));
  }
  
  if (successful.length === results.length) {
    console.log('\n🎉 ALL AVATAR IMAGES ARE WORKING PERFECTLY!');
    console.log('📱 All 12 avatars will display correctly on your website.');
  } else {
    console.log(`\n⚠️  ${failed.length} avatar(s) need attention.`);
  }
  
  // Check for consistent file sizes
  const sizes = successful.map(r => r.size).filter(s => s > 0);
  const uniqueSizes = [...new Set(sizes)];
  
  if (uniqueSizes.length === 1 && uniqueSizes[0] > 0) {
    console.log(`\n📏 All images have consistent size: ${uniqueSizes[0]} bytes`);
  } else if (uniqueSizes.length > 1) {
    console.log(`\n📏 Image sizes vary: ${uniqueSizes.join(', ')} bytes`);
  }
}

testAllAvatars().catch(console.error);