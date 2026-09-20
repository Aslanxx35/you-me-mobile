import * as Notifications from 'expo-notifications';

const DAILY_NOTIFICATION_ID_KEY = 'daily-notification';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function scheduleDailyNotification(
  hour: number = 9,
  minute: number = 0,
  title: string = 'YOU me',
  body: string = 'Bugünkü doğum haritan ve tarot yorumun hazır.'
): Promise<string | null> {
  const { status } = await Notifications.getPermissionsAsync();
  let finalStatus = status;

  if (finalStatus !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    finalStatus = newStatus;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  await cancelDailyNotification();

  const id = await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      hour,
      minute,
      repeats: true,
    } as Notifications.CalendarTriggerInput,
  });

  return id;
}

export async function cancelDailyNotification(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
