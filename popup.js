// 알람 등록 부분
const min1 = document.querySelector("#min1");
const min5 = document.querySelector("#min5");
const min10 = document.querySelector("#min10");
const totalSelect = [min1, min5, min10];

totalSelect.forEach((selector) => {
  selector.addEventListener("click", handleCreateNotification);
});

async function handleCreateNotification(event) {
  const minutes = Number(event.target.value);

  const messageInfo = {
    name: "alarm",
    minutes: minutes,
  };

  chrome.storage.sync.set({ minutes: minutes });

  const response = await chrome.runtime.sendMessage(messageInfo);
  if (!response) {
    alert(
      "타이머를 셋팅하는 과정에서 에러가 발생했어요!\n새로 고침 후 다시 시도해주세요!"
    );
  } else {
    if (response.longTime) {
      alert("너무 길게 잡으셨네요^^");
    }
  }

  window.close();
}

// 알람 삭제 부분
document
  .querySelector("#clearAll")
  .addEventListener("click", handleClearNotification);

async function handleClearNotification() {
  const messageInfo = {
    name: "clear",
  };

  const response = await chrome.runtime.sendMessage(messageInfo);
}
