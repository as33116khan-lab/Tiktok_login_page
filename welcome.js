"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const statusEl = document.getElementById("countdownStatus");
  const welcomeMessageEl = document.getElementById("welcomeMessage");

  if (!hoursEl || !minutesEl || !secondsEl || !statusEl || !welcomeMessageEl) {
    return;
  }

  const userEmail = sessionStorage.getItem("connectlyUserEmail");
  if (userEmail) {
    welcomeMessageEl.textContent = `Welcome, ${userEmail}. You are now part of the Connectly community.`;
  }

  const storageKey = "connectlyDashboardEta";
  const now = Date.now();
  const existingEta = Number(localStorage.getItem(storageKey));
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;

  const eta = Number.isFinite(existingEta) && existingEta > now
    ? existingEta
    : now + twentyFourHoursMs;

  localStorage.setItem(storageKey, String(eta));

  const formatPart = (value) => String(value).padStart(2, "0");

  const updateTimer = () => {
    const remainingMs = eta - Date.now();

    if (remainingMs <= 0) {
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      statusEl.textContent = "Your dashboard setup window is complete. Please refresh to continue.";
      localStorage.removeItem(storageKey);
      return false;
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    hoursEl.textContent = formatPart(hours);
    minutesEl.textContent = formatPart(minutes);
    secondsEl.textContent = formatPart(seconds);

    return true;
  };

  updateTimer();

  const timerId = setInterval(() => {
    const shouldContinue = updateTimer();
    if (!shouldContinue) {
      clearInterval(timerId);
    }
  }, 1000);
});
