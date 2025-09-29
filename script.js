// 🌸 API server Render (đảm bảo là HTTPS)
const API_URL = "https://kyniemdep.onrender.com"; // ⚠️ Đổi nếu domain khác

const form = document.getElementById("memoryForm");
const memoriesContainer = document.getElementById("memories");

// 🩷 Tải danh sách kỷ niệm khi mở trang
async function loadMemories() {
  try {
    const res = await fetch(`${API_URL}/memories`);
    const data = await res.json();
    renderMemories(data);
  } catch (error) {
    alert("⚠️ Không thể kết nối tới server. Kiểm tra lại API_URL hoặc Render!");
  }
}

// 📤 Upload ảnh/video
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
    alert("⚠️ Lỗi upload. Thử lại sau!");
  }
});

// 🖼️ Hiển thị tất cả kỷ niệm
function renderMemories(memories) {
  memoriesContainer.innerHTML = "";
  memories.forEach(addMemoryToPage);
}

// 🧠 Thêm kỷ niệm vào giao diện
function addMemoryToPage(memory) {
  const card = document.createElement("div");
  card.className = "memory-card";

  let mediaElement = "";
  if (memory.fileType.startsWith("video")) {
    mediaElement = `<video controls src="${memory.fileUrl}"></video>`;
  } else {
    mediaElement = `<img src="${memory.fileUrl}" alt="${memory.title}" />`;
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

// 🗑️ Xoá kỷ niệm
async function deleteMemory(id) {
  await fetch(`${API_URL}/memories/${id}`, { method: "DELETE" });
  loadMemories();
}

// 🚀 Bắt đầu tải khi mở trang
loadMemories();
