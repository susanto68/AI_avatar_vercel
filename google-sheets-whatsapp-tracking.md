# WhatsApp Click Tracking with Google Sheets

## Setup Instructions

### Step 1: Create a Google Sheet
1. Go to https://sheets.google.com
2. Create a new spreadsheet
3. Name it "WhatsApp Click Tracking"
4. In the first row, add these headers:
   - Column A: Timestamp
   - Column B: Phone Number Clicked
   - Column C: User Name
   - Column D: User Email
   - Column E: User Phone
   - Column F: Referrer URL
   - Column G: IP Address

### Step 2: Create Google Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete the default code and paste this:

```javascript
function doPost(e) {
  try {
    // Get the active sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Get current timestamp
    var timestamp = new Date();
    
    // Prepare row data
    var rowData = [
      timestamp,
      data.phoneNumber || '',
      data.userName || 'Anonymous',
      data.userEmail || '',
      data.userPhone || '',
      data.referrer || 'Direct',
      data.ipAddress || ''
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: 'Data saved successfully'
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (run this to test the script)
function testPost() {
  var testData = {
    phoneNumber: '917004043422',
    userName: 'Test User',
    userEmail: 'test@example.com',
    userPhone: '9876543210',
    referrer: 'https://example.com',
    ipAddress: '127.0.0.1'
  };
  
  var mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  doPost(mockEvent);
}
```

3. Click **Save** (Ctrl+S or Cmd+S)
4. Click **Deploy > New Deployment**
5. Select type: **Web app**
6. Set:
   - Description: "WhatsApp Click Tracker"
   - Execute as: **Me**
   - Who has access: **Anyone** (if you want public access) or **Only myself**
7. Click **Deploy**
8. Copy the **Web app URL** (looks like: `https://script.google.com/macros/s/...`)
9. Click **Done**

### Step 3: Update Your API
Update the file: `pages/api/whatsapp-click.js`

Replace the existing code with this:

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { phoneNumber, userName, userEmail, userPhone, referrer, timestamp } = req.body

    // Your Google Apps Script Web App URL
    const GOOGLE_SHEETS_URL = 'YOUR_WEB_APP_URL_HERE' // Replace this!

    // Prepare data for Google Sheets
    const dataToSend = {
      phoneNumber: phoneNumber || 'Unknown',
      userName: userName || 'Anonymous',
      userEmail: userEmail || '',
      userPhone: userPhone || '',
      referrer: referrer || req.headers.referer || 'Direct',
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown'
    }

    // Send to Google Sheets
    try {
      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      })
    } catch (sheetsError) {
      console.error('Failed to send to Google Sheets:', sheetsError)
      // Don't fail if Google Sheets fails
    }

    // Also log to console (for Vercel logs)
    console.log('📱 WhatsApp Click Tracked:', dataToSend)

    // Return success
    return res.status(200).json({
      success: true,
      message: 'Click tracked successfully'
    })

  } catch (error) {
    console.error('❌ Error tracking WhatsApp click:', error)
    return res.status(500).json({ error: 'Failed to track click' })
  }
}
```

### Step 4: Update WhatsAppButton Component
Add a function call when the user clicks on a WhatsApp number:

```javascript
// Add this function call in the onClick handler of the WhatsApp button
const trackWhatsAppClick = async (phoneNumber) => {
  try {
    await fetch('/api/whatsapp-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber,
        timestamp: new Date().toISOString(),
        referrer: window.location.href
      })
    })
  } catch (error) {
    console.error('Failed to track click:', error)
  }
}
```

## Testing

1. Make sure your Google Sheet has the headers set up
2. Deploy the Google Apps Script
3. Test by clicking the WhatsApp button
4. Check your Google Sheet for new entries

## Privacy Notes

⚠️ **Important:**
- User data collection requires consent and privacy policy
- Make sure you comply with GDPR/CCPA if applicable
- Inform users that you're collecting data
- Store data securely
- Allow users to opt-out

## Alternative: Simple Server Logs

If you don't want to use Google Sheets, you can just check your Vercel logs:
1. Go to your Vercel dashboard
2. Click on your project
3. Go to "Logs" tab
4. Look for the "📱 WhatsApp Click Tracked:" entries

This is simpler but less organized than Google Sheets.
