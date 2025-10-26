# WhatsApp Contact Button

## Overview
A beautiful, mobile-friendly WhatsApp contact button that allows users to easily contact you via WhatsApp.

## Features

### 🎨 **Design & UI/UX**
- **Top-right corner positioning** - Always visible and accessible
- **Mobile-friendly** - Responsive design that works on all devices
- **Smooth animations** - Hover effects, pulse animation, and scale transitions
- **Professional styling** - Green gradient matching WhatsApp branding
- **Notification badge** - Red exclamation mark to draw attention

### 📱 **Functionality**
- **Dual phone numbers** - Supports both your primary and secondary numbers
- **Smart menu** - Expands to show both numbers when clicked
- **Direct messaging** - Opens WhatsApp with pre-filled message
- **Auto-detection** - Shows appropriate size for mobile vs desktop

### 🔧 **Technical Features**
- **React component** - Fully integrated with your Next.js app
- **Responsive design** - Adapts to different screen sizes
- **Smooth transitions** - CSS animations for better UX
- **Accessibility** - Proper ARIA labels and keyboard support
- **Performance optimized** - Only renders after page load

## Phone Numbers
- **Primary**: +91 7004043422
- **Secondary**: +91 9835379900

## How It Works

### 1. **Single Click Behavior**
- If only one number: Directly opens WhatsApp
- If multiple numbers: Shows expandable menu

### 2. **Menu Options**
- Click on any number to open WhatsApp
- Pre-filled message: "Hi! I'm interested in your AI Avatar Assistant. Can you help me with more information?"
- Opens in new tab/window

### 3. **Visual Feedback**
- **Hover**: Button scales up and changes color
- **Click**: Button scales down for tactile feedback
- **Pulse**: Continuous animation to draw attention
- **Tooltip**: Shows "Chat with us on WhatsApp" on hover

## Integration

### Pages Where It Appears
- ✅ **Main page** (`/`) - Homepage with avatar selection
- ✅ **Avatar pages** (`/computer-teacher`, `/math-teacher`, etc.) - Individual avatar chat pages

### Positioning
- **Desktop**: Top-right corner, 16px from edges
- **Mobile**: Top-right corner, 16px from edges, smaller size
- **Z-index**: 50 (above all other content)

## Customization

### Message Template
The pre-filled WhatsApp message can be customized in the component:
```javascript
const message = encodeURIComponent(
  `Hi! I'm interested in your AI Avatar Assistant. Can you help me with more information?`
)
```

### Phone Numbers
To change phone numbers, edit the `phoneNumbers` array in `WhatsAppButton.js`:
```javascript
const phoneNumbers = [
  { number: '7004043422', label: 'Primary', countryCode: '+91' },
  { number: '9835379900', label: 'Secondary', countryCode: '+91' }
]
```

### Styling
The button uses Tailwind CSS classes and can be customized by modifying the component's className properties.

## Browser Support
- ✅ **Chrome** - Full support
- ✅ **Firefox** - Full support  
- ✅ **Safari** - Full support
- ✅ **Edge** - Full support
- ✅ **Mobile browsers** - Full support

## Performance
- **Lightweight** - Minimal JavaScript footprint
- **Fast loading** - Appears after 2 seconds to avoid blocking initial render
- **Smooth animations** - Hardware-accelerated CSS transitions
- **No external dependencies** - Uses only React and Tailwind CSS

## Accessibility
- **ARIA labels** - Screen reader friendly
- **Keyboard navigation** - Tab-accessible
- **High contrast** - Visible on all backgrounds
- **Focus indicators** - Clear visual feedback

## Future Enhancements
- [ ] **Online status** - Show if you're currently online
- [ ] **Business hours** - Display availability status
- [ ] **Multiple languages** - Support for different languages
- [ ] **Analytics** - Track click rates and conversions
