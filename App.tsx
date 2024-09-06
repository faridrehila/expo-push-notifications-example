import { StatusBar } from "expo-status-bar";
import { Button, Platform, StyleSheet, Text, View } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const notificationsRef = useRef<Notifications.Subscription | null>(null);
  const responseRef = useRef<Notifications.Subscription | null>(null);

  // Expo Push token
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);

  const getExpoPushToken = async () => {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId:
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId,
        })
      ).data;
      console.log("expo push token", token);
      return token;
    } else {
      console.error("Ce n'est un device !");
    }
  };

  useEffect(() => {
    getExpoPushToken().then((token) => token && setExpoPushToken(token));

    // Listener for notifications / response
    notificationsRef.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("notification", notification);
        setNotification(notification);
      }
    );

    responseRef.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("response", response);
      }
    );

    return () => {
      if (notificationsRef.current) {
        notificationsRef.current.remove();
      }
      if (responseRef.current) {
        responseRef.current.remove();
      }
    };
  }, []);

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "React Academie",
        body: "Push Notifications !",
        data: { url: "https://" },
      },
      trigger: { seconds: 2 },
    });
  };

  const sendPN = async () => {
    const data = {
      token: expoPushToken,
      title: "React Academie",
      body: "Push notifications !",
    };

    try {
      console.log("data", data);

      await fetch("http://192.168.0.13:4000/send-notification", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Push Token: {expoPushToken}</Text>
      <Text>Notification: {notification?.request?.content?.body}</Text>
      <Text>Notification URL: {notification?.request?.content?.data?.url}</Text>

      <Button title="Schedule notification" onPress={scheduleNotification} />

      <Button title="Send notification" onPress={sendPN} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
