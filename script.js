const form = document.getElementById("memoryForm");
const memoriesContainer = document.getElementById("memories");
const API_URL = "http://localhost:3000"; // backend server

// Tải danh sách kỷ niệm khi mở trang
async function loadMemories() {
  try {
    const res = await fetch(`${API_URL}/memories`);
    const data = await res.json();
    renderMemories(data);
  } catch (error) {
    console.error("Không thể kết nối tới server:", error);
    alert("⚠️ Server chưa chạy. Hãy mở terminal và chạy: node server.js");
  }
}

// Thêm kỷ niệm mới
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const file = document.getElementById("file").files[0];

  if (!file) return alert("Vui lòng chọn ảnh hoặc video!");

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("file", file);

  try {
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const newMemory = await res.json();
    addMemoryToPage(newMemory);
    form.reset();
  } catch (error) {
    alert("Không thể tải lên. Kiểm tra lại server.");
  }
});

// Hiển thị danh sách
function renderMemories(memories) {
  memoriesContainer.innerHTML = "";
  memories.forEach(addMemoryToPage);
}

// Thêm từng kỷ niệm vào trang
function addMemoryToPage(memory) {
  const card = document.createElement("div");
  card.className = "memory-card";

  let mediaElement = "";
  if (memory.fileType.startsWith("video")) {
    mediaElement = `<video controls src="${API_URL}${memory.filePath}"></video>`;
  } else {
    mediaElement = `<img src="${API_URL}${memory.filePath}" alt="${memory.title}" />`;
  }

  card.innerHTML = `
    <h3>${memory.title}</h3>
    ${mediaElement}
    <p>${memory.description}</p>
    <div class="actions">
      <button onclick="deleteMemory(${memory.id})">Xoá</button>
    </div>
  `;

  memoriesContainer.appendChild(card);
}

// Xoá kỷ niệm
async function deleteMemory(id) {
  await fetch(`${API_URL}/memories/${id}`, { method: "DELETE" });
  loadMemories();
}

// Tải danh sách khi trang mở
loadMemories();
