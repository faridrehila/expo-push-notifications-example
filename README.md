# 📱 Expo Push Notifications - Complete Example

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=flat-square&logo=react&logoColor=black)

A complete, production-ready implementation of push notifications in Expo/React Native with TypeScript.

## 🎯 What's Included

This example covers everything you need to implement push notifications:

- ✅ **Get Expo Push Token** from device
- ✅ **Request permissions** (iOS & Android)
- ✅ **Schedule local notifications**
- ✅ **Send remote notifications** from server
- ✅ **Handle notification clicks** with deep linking
- ✅ **Listen to notification events**
- ✅ **Android notification channels** setup
- ✅ **TypeScript** for type safety

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/faridrehila/expo-push-notifications-example.git
cd expo-push-notifications-example
npm install
```

### 2. Configure Project ID

Make sure your `app.json` includes:
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### 3. Platform-Specific Setup

#### Android Setup
1. Add your `google-services.json` file at the root of the project
2. Get it from [Firebase Console](https://console.firebase.google.com/)

#### iOS Setup
1. You need an **Apple Developer Account** ($99/year)
2. Push notifications require a physical device (won't work on simulator)

### 4. Run the App
```bash
# Development build (required for notifications)
npx expo run:android
# or
npx expo run:ios
```

> ⚠️ **Important:** Push notifications don't work with Expo Go. You need a development build.

## 📡 Backend Server

To send notifications from your backend, check out the companion repo:

👉 **[expo-server-push-notifications-example](https://github.com/faridrehila/expo-server-push-notifications-example)** (Node.js/Express)

Quick backend setup:
```bash
git clone https://github.com/faridrehila/expo-server-push-notifications-example.git
cd expo-server-push-notifications-example
npm install
npm start
```

## 🔑 Key Features Explained

### 1. Get Push Token
```typescript
const token = await Notifications.getExpoPushTokenAsync({
  projectId: Constants?.expoConfig?.extra?.eas?.projectId
});
```

This token uniquely identifies the device and is used to send notifications.

### 2. Request Permissions
```typescript
const { status } = await Notifications.requestPermissionsAsync();
if (status !== 'granted') {
  alert('Permission denied!');
}
```

### 3. Schedule Local Notification
```typescript
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Hello!",
    body: "This is a local notification",
    data: { url: "myapp://screen" }
  },
  trigger: { seconds: 2 }
});
```

### 4. Handle Notification Clicks
```typescript
Notifications.addNotificationResponseReceivedListener((response) => {
  const url = response.notification.request.content.data.url;
  // Navigate to specific screen
});
```

### 5. Android Notification Channel
```typescript
await Notifications.setNotificationChannelAsync('default', {
  name: 'default',
  importance: Notifications.AndroidImportance.MAX,
  vibrationPattern: [0, 250, 250, 250],
  lightColor: '#FF231F7C',
});
```

## 📚 How It Works
```
┌─────────────┐
│  Your App   │
└──────┬──────┘
       │ 1. Get Expo Push Token
       ↓
┌─────────────┐
│ Expo Server │ ← Manages push tokens
└──────┬──────┘
       │
       │ 2. Forward to
       ↓
┌─────────────┐
│   APNs/FCM  │ ← Apple/Google services
└──────┬──────┘
       │
       │ 3. Deliver notification
       ↓
┌─────────────┐
│   Device    │
└─────────────┘
```

## 🏗️ Project Structure
```
expo-push-notifications-example/
├── App.tsx                 # Main logic (all in one file)
├── app.json               # Expo config with projectId
├── google-services.json   # Android config (gitignored)
└── package.json
```

## 🔧 Common Issues & Solutions

### Issue: "Push token undefined"
**Solution:** Make sure you're running on a physical device with a development build.

### Issue: "Permission denied"
**Solution:** Check device settings and re-request permissions.

### Issue: Notifications not received on Android
**Solution:** Verify `google-services.json` is present and valid.

### Issue: iOS notifications not working
**Solution:** Ensure you have an Apple Developer account and proper provisioning profile.

## 📖 Learn More

- [Expo Notifications Docs](https://docs.expo.dev/push-notifications/overview/)
- [Push Notification Best Practices](https://docs.expo.dev/push-notifications/push-notifications-setup/)

## 🎓 Used in Production

This implementation pattern is used in **[Love Album](https://love-album.com?ref=github)**, where we send 500+ wedding photo notifications per month to guests.

## 📚 Part of React Académie

This repo is a learning resource for **[React Académie](https://rn.reactacademie.fr?ref=github)** students learning React Native.

## 🤝 Contributing

Found a bug or want to improve this example? PRs are welcome!

## 📝 License

MIT

## 💬 Questions?

Open an issue or reach out on [X/Twitter](https://x.com/faridrehila)

---

<p align="center">
  ⭐ Star this repo if you find it helpful!
</p>
