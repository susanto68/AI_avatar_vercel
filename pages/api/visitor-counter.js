export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { countryCode, ipAddress, userAgent, currentGlobalCount, currentIndiaCount } = req.body;

    // Get current date for daily tracking
    const today = new Date().toISOString().split('T')[0];
    
    // Get visitor's IP if not provided
    const clientIP = ipAddress || req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress;

    // Determine if visitor is from India
    const isIndia = countryCode === 'IN';
    
    // Use the counts provided by the frontend (from localStorage) as base
    // This ensures consistency between frontend and backend
    let globalCount = parseInt(currentGlobalCount) || parseInt(process.env.GLOBAL_VISITOR_COUNT || '503');
    let indiaCount = parseInt(currentIndiaCount) || parseInt(process.env.INDIA_VISITOR_COUNT || '127');
    
    // Increment appropriate counter
    if (isIndia) {
      indiaCount++;
    } else {
      globalCount++;
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
      timestamp: new Date().toISOString()
    });

    // Return updated counts
    res.status(200).json({
      success: true,
      globalCount,
      indiaCount,
      message: `${isIndia ? '🇮🇳 Indian' : '🌍 International'} visitor counted`,
      note: 'Counts are managed by frontend localStorage for consistency'
    });

  } catch (error) {
    console.error('❌ Visitor counter error:', error);
    res.status(500).json({ 
      error: 'Failed to update visitor counter',
      details: error.message 
    });
  }
}
