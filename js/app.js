"use strict";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
let nextTaskNumber = 1;

function createButton(className, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(className);
  button.textContent = label;
  return button;
}

function createTaskElement(taskText, taskId) {
  const item = document.createElement("li");
  item.classList.add("task-item");
  item.dataset.taskId = taskId;
  item.dataset.state = "pending";
  const text = document.createElement("span");
  text.classList.add("task-text");
  text.textContent = taskText;
  item.append(text, createButton("complete-btn", "Complete"), createButton("edit-btn", "Edit"), createButton("remove-btn", "Remove"));
  return item;
}

function showEmptyTaskMessage() { taskMessage.textContent = "Task cannot be empty"; }
function clearTaskMessage() { taskMessage.textContent = ""; }

function addTask(taskText) {
  const cleanText = taskText.trim();
  if (!cleanText) return showEmptyTaskMessage();
  taskList.append(createTaskElement(cleanText, "task-" + nextTaskNumber));
  nextTaskNumber += 1;
  taskInput.value = "";
  clearTaskMessage();
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  const complete = taskItem.classList.toggle("completed");
  taskItem.dataset.state = complete ? "completed" : "pending";
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const span = taskItem.querySelector(".task-text");
  if (!span) return;
  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("edit-input");
  input.value = span.textContent;
  input.setAttribute("aria-label", "Edit task");
  span.replaceWith(input);
  taskItem.querySelector(".edit-btn").textContent = "Save";
  input.focus();
}

function saveTaskEdit(taskItem) {
  const input = taskItem.querySelector(".edit-input");
  if (!input) return;
  const cleanText = input.value.trim();
  if (!cleanText) { showEmptyTaskMessage(); return input.focus(); }
  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = cleanText;
  input.replaceWith(span);
  taskItem.querySelector(".edit-btn").textContent = "Edit";
  clearTaskMessage();
  updateTaskCounts();
}

function removeTask(taskItem) {
  taskItem.remove();
  clearTaskMessage();
  updateTaskCounts();
}

function updateTaskCounts() {
  const tasks = taskList.querySelectorAll(".task-item");
  const completed = taskList.querySelectorAll('.task-item[data-state="completed"]').length;
  totalCount.textContent = String(tasks.length);
  pendingCount.textContent = String(tasks.length - completed);
  completedCount.textContent = String(completed);
}

function handleTaskListClick(event) {
  const button = event.target;
  if (!button.matches(".complete-btn, .edit-btn, .remove-btn")) return;
  const taskItem = button.closest(".task-item");
  if (!taskItem) return;
  if (button.classList.contains("complete-btn")) toggleTaskComplete(taskItem);
  else if (button.classList.contains("remove-btn")) removeTask(taskItem);
  else if (button.textContent === "Edit") beginTaskEdit(taskItem);
  else saveTaskEdit(taskItem);
}

function loadSampleTasks() {
  const fragment = document.createDocumentFragment();
  ["Review DOM selectors", "Practice createElement", "Study event delegation"].forEach((text) => {
    fragment.append(createTaskElement(text, "task-" + nextTaskNumber));
    nextTaskNumber += 1;
  });
  taskList.append(fragment);
  clearTaskMessage();
  updateTaskCounts();
}

addTaskBtn.addEventListener("click", () => addTask(taskInput.value));
loadSamplesBtn.addEventListener("click", loadSampleTasks);
taskList.addEventListener("click", handleTaskListClick);
taskInput.addEventListener("keydown", (event) => { if (event.key === "Enter") addTask(taskInput.value); });
updateTaskCounts();
