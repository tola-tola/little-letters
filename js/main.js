const $ = (selector) => document.querySelector(selector);
const loginView = $("#loginView");
const mailboxView = $("#mailboxView");
const readingView = $("#readingView");
const lettersGrid = $("#lettersGrid");
const emptyState = $("#emptyState");
const letters = Array.isArray(window.LETTERS) ? window.LETTERS : [];

function show(view) {
  [loginView, mailboxView, readingView].forEach(item => item.classList.add("hidden"));
  view.classList.remove("hidden");
}
function formatDate(value) {
  return new Intl.DateTimeFormat("ar-JO", {
    dateStyle: "long", timeStyle: "short"
  }).format(new Date(value));
}
function isAvailable(letter) {
  const time = new Date(letter.opensAt).getTime();
  return Number.isFinite(time) && time <= Date.now();
}
function renderMailbox() {
  show(mailboxView);
  lettersGrid.innerHTML = "";
  const ordered = [...letters].sort((a,b) => new Date(a.opensAt) - new Date(b.opensAt));
  emptyState.classList.toggle("hidden", ordered.length > 0);
  ordered.forEach(letter => {
    const available = isAvailable(letter);
    const card = document.createElement("button");
    card.className = "letter-card";
    card.disabled = !available;
    const envelope = document.createElement("div");
    envelope.className = "card-envelope";
    envelope.textContent = available ? "♡" : "· · ·";
    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = available ? letter.title : "رسالة تنتظر موعدها";
    const date = document.createElement("p");
    date.className = "card-date";
    date.textContent = available ? `متاحة للقراءة · ${formatDate(letter.opensAt)}` : `تُفتح في ${formatDate(letter.opensAt)}`;
    const status = document.createElement("span");
    status.className = "card-status";
    status.textContent = available ? "افتح رسالتك" : "ما زالت مختومة";
    card.append(envelope, title, date, status);
    if (available) card.addEventListener("click", () => openLetter(letter));
    lettersGrid.append(card);
  });
}
function openLetter(letter) {
  if (!isAvailable(letter)) return;
  $("#readingTitle").textContent = letter.title;
  $("#readingDate").textContent = `موعد وصولها: ${formatDate(letter.opensAt)}`;
  $("#readingContent").textContent = letter.content;
  show(readingView);
}
$("#enterButton").addEventListener("click", renderMailbox);
$("#backButton").addEventListener("click", renderMailbox);
