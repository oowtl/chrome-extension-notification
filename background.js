// 백그라운드 메시지 수신부분
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
  } else if (request.name === "inject") {
    injectScriptCode();
    return sendResopnse(true);
  }
});

// 알람 생성
const createAlarm = (alarmInfo) => {
  chrome.action.setBadgeText({ text: "ON" });
  chrome.alarms.create("notiAlarm", {
    delayInMinutes: alarmInfo.minutes,
  });
};

// 알람 이벤트 리스너
chrome.alarms.onAlarm.addListener((eventAlarm) => {
  chrome.action.setBadgeText({ text: "" });

  if (eventAlarm.name === "notiAlarm") {
    createNotification();
  }
});

// 노티 생성
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

// 노티 옵션 클릭 이벤트 리스너
chrome.notifications.onButtonClicked.addListener(async () => {
  const item = await chrome.storage.sync.get(["minutes"]);
  createAlarm({ minutes: item.minutes });
});

// 알람 삭제
const clearAlarms = () => {
  chrome.alarms.clearAll();
};

// 노티 삭제
const clearNotifications = () => {
  chrome.notifications.getAll((notifications) => {
    Object.keys(notifications).forEach((notificationId) => {
      if (notifications[notificationId]) {
        chrome.notifications.clear(notificationId);
      }
    });
  });
};

// 스크립트 코드 주입하기
const injectScriptCode = async () => {
  const curTab = await getCurrentTab();
  console.log(curTab);

  chrome.scripting.executeScript({
    target: { tabId: curTab.id },
    files: ["./script.js"],
  });
};

// 현재 탭 위치 알아내기
const getCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};
