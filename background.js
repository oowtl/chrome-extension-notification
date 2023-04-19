chrome.runtime.onMessage.addListener(function (request, sender, sendResopnse) {
  if (!request.name) {
    return sendResopnse(false);
  }
  if (request.name === "alarm") {
    if (request.minutes === 10) return sendResopnse({ longTime: true });
    createAlarm({ minutes: request.minutes });
    return sendResopnse(true);
  } else if (request.name === "clear") {
    clearAlarms();
    clearNotifications();
    return sendResopnse(true);
  }
});

const createAlarm = (alarmInfo) => {
  chrome.action.setBadgeText({ text: "ON" });
  chrome.alarms.create("notiAlarm", {
    delayInMinutes: alarmInfo.minutes,
  });
};

chrome.alarms.onAlarm.addListener((eventAlarm) => {
  chrome.action.setBadgeText({ text: "" });

  if (eventAlarm.name === "notiAlarm") {
    createNotification();
  }
});

const createNotification = (notificationInfo) => {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "./images/icon-cyclist-24.png",
    title: "Time to Rest!",
    message: "Need a break time",
    buttons: [{ title: "Go?" }],
    priority: 0,
  });
};

chrome.notifications.onButtonClicked.addListener(async () => {
  const item = await chrome.storage.sync.get(["minutes"]);
  createAlarm({ minutes: item.minutes });
});

const clearAlarms = () => {
  chrome.alarms.clearAll();
};

const clearNotifications = () => {
  chrome.notifications.getAll((notifications) => {
    Object.keys(notifications).forEach((notificationId) => {
      if (notifications[notificationId]) {
        chrome.notifications.clear(notificationId);
      }
    });
  });
};
