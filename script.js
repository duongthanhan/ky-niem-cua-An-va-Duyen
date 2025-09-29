// 🌸 Kết nối tới server Render (sử dụng HTTPS)
const API_URL = "https://kyniemdep.onrender.com"; // ⚠️ Đổi thành domain Render của bạn nếu khác

const form = document.getElementById("memoryForm");
const memoriesContainer = document.getElementById("memories");

// 🩷 Tải danh sách kỷ niệm khi mở trang
async function loadMemories() {
  try {
    const res = await fetch(`${API_URL}/memories`);
    const data = await res.json();
    renderMemories(data);
  } catch (error) {
    console.error("❌ Không thể kết nối tới server:", error);
    alert("⚠️ Server chưa chạy hoặc API_URL chưa đúng!");
  }
}

// 📤 Gửi kỷ niệm mới
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

// 🖼️ Hiển thị tất cả kỷ niệm
function renderMemories(memories) {
  memoriesContainer.innerHTML = "";
  memories.forEach(addMemoryToPage);
}

// 🧠 Thêm một kỷ niệm vào giao diện
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

// 🗑️ Xoá kỷ niệm
async function deleteMemory(id) {
  try {
    await fetch(`${API_URL}/memories/${id}`, { method: "DELETE" });
    loadMemories();
  } catch (error) {
    alert("❌ Không thể xoá. Thử lại sau!");
  }
}

loadMemories();
