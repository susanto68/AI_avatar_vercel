export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { countryCode, ipAddress, userAgent } = req.body;

    // Get current date for daily tracking
    const today = new Date().toISOString().split('T')[0];
    
    // Get visitor's IP if not provided
    const clientIP = ipAddress || req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress;

    // Determine if visitor is from India
    const isIndia = countryCode === 'IN';
    
    // Use countapi.xyz for persistent global counters
    const GLOBAL_COUNTER_KEY = 'ai-avatar-global-visitors';
    const INDIA_COUNTER_KEY = 'ai-avatar-india-visitors';
    
    let globalCount, indiaCount;
    
    try {
      // Get current counts from countapi.xyz
      const [globalResponse, indiaResponse] = await Promise.all([
        fetch(`https://api.countapi.xyz/get/susanto68/${GLOBAL_COUNTER_KEY}`),
        fetch(`https://api.countapi.xyz/get/susanto68/${INDIA_COUNTER_KEY}`)
      ]);
      
      const globalData = await globalResponse.json();
      const indiaData = await indiaResponse.json();
      
      globalCount = globalData.value || 503; // Fallback to 503 if not found
      indiaCount = indiaData.value || 2129;  // Fallback to 2129 if not found
      
      // Increment appropriate counter
      if (isIndia) {
        indiaCount++;
        await fetch(`https://api.countapi.xyz/hit/susanto68/${INDIA_COUNTER_KEY}`);
      } else {
        globalCount++;
        await fetch(`https://api.countapi.xyz/hit/susanto68/${GLOBAL_COUNTER_KEY}`);
      }
      
    } catch (apiError) {
      console.warn('⚠️ countapi.xyz failed, using fallback:', apiError.message);
      
      // Fallback to environment variables or defaults
      globalCount = parseInt(process.env.GLOBAL_VISITOR_COUNT || '503');
      indiaCount = parseInt(process.env.INDIA_VISITOR_COUNT || '2129');
      
      // Increment appropriate counter
      if (isIndia) {
        indiaCount++;
      } else {
        globalCount++;
      }
    }

    // Log visitor information (this will appear in Vercel logs)
    console.log('🌍 New Visitor:', {
      date: today,
      country: countryCode || 'Unknown',
      isIndia,
      ip: clientIP,
      userAgent: userAgent?.substring(0, 100),
      globalCount,
      indiaCount,
      timestamp: new Date().toISOString(),
      source: 'countapi.xyz'
    });

    // Return updated counts
    res.status(200).json({
      success: true,
      globalCount,
      indiaCount,
      message: `${isIndia ? '🇮🇳 Indian' : '🌍 International'} visitor counted`,
      note: 'Counts stored globally using countapi.xyz'
    });

  } catch (error) {
    console.error('❌ Visitor counter error:', error);
    res.status(500).json({ 
      error: 'Failed to update visitor counter',
      details: error.message 
    });
  }
}
