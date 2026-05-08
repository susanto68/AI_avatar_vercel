// API endpoint to track WhatsApp button clicks
// This will log user interactions for analytics

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { phoneNumber, userName, userEmail, userPhone, referrer, timestamp } = req.body

    // Log the click data (you can send this to Google Sheets later)
    console.log('📱 WhatsApp Click Tracked:', {
      phoneNumber,
      userName,
      userEmail,
      userPhone,
      referrer: referrer || 'Direct',
      timestamp: timestamp || new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    })

    // Return success
    return res.status(200).json({
      success: true,
      message: 'Click tracked successfully',
      data: {
        phoneNumber,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Error tracking WhatsApp click:', error)
    return res.status(500).json({ error: 'Failed to track click' })
  }
}
