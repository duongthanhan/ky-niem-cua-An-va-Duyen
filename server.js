// 📁 script.js
// ===================================
// 🌸 Website Kỷ Niệm — Giao diện kết nối tới server Render
// ===================================

// ⚠️ Đổi đường dẫn này thành link Render thật của bạn
// (Ví dụ: https://kyniemdep.onrender.com)
const API_URL = "https://kyniemdep.onrender.com";

// Lấy phần tử từ HTML
const form = document.getElementById("memoryForm");
const memoriesContainer = document.getElementById("memories");

// ================================
// 📋 Hàm tải danh sách kỷ niệm
// ================================
async function loadMemories() {
  try {
    const res = await fetch(`${API_URL}/memories`);
    const data = await res.json();
    renderMemories(data);
  } catch (error) {
    console.error("❌ Không thể kết nối tới server:", error);
    alert("⚠️ Server chưa chạy hoặc link chưa đúng.\nHãy kiểm tra lại API_URL trong script.js.");
  }
}

// ================================
// 🩷 Sự kiện khi người dùng bấm 'Thêm kỷ niệm'
// ================================
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

    if (!res.ok) throw new Error("Upload thất bại");

    const newMemory = await res.json();
    addMemoryToPage(newMemory);
    form.reset();
  } catch (error) {
    console.error("❌ Lỗi upload:", error);
    alert("⚠️ Không thể tải lên. Vui lòng thử lại.");
  }
});

// ================================
// 🖼️ Hiển thị tất cả kỷ niệm
// ================================
function renderMemories(memories) {
  memoriesContainer.innerHTML = "";
  memories.forEach(addMemoryToPage);
}

// ================================
// 🧠 Hàm thêm 1 kỷ niệm vào trang
// ================================
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

// ================================
// 🗑️ Xoá kỷ niệm
// ================================
async function deleteMemory(id) {
  try {
    await fetch(`${API_URL}/memories/${id}`, { method: "DELETE" });
    loadMemories();
  } catch (error) {
    console.error("❌ Lỗi khi xoá:", error);
    alert("Không thể xoá kỷ niệm. Vui lòng thử lại.");
  }
}

// ================================
// 🚀 Tải danh sách kỷ niệm khi trang mở
// ================================
loadMemories();
