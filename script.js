const form = document.getElementById("memoryForm");
const memoriesContainer = document.getElementById("memories");
let memories = [];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const fileInput = document.getElementById("file");

  const file = fileInput.files[0];
  if (!file) return alert("Vui lòng chọn ảnh hoặc video!");

  const objectURL = URL.createObjectURL(file);

  const memory = {
    id: Date.now(),
    title,
    description,
    fileURL: objectURL,
    fileType: file.type
  };

  memories.push(memory);
  form.reset();
  renderMemories();
});

function renderMemories() {
  memoriesContainer.innerHTML = "";

  memories.forEach((memory) => {
    const card = document.createElement("div");
    card.className = "memory-card";

    let mediaElement = "";
    if (memory.fileType.startsWith("video")) {
      mediaElement = `<video controls src="${memory.fileURL}"></video>`;
    } else {
      mediaElement = `<img src="${memory.fileURL}" alt="${memory.title}" />`;
    }

    card.innerHTML = `
      <h3>${memory.title}</h3>
      ${mediaElement}
      <p>${memory.description}</p>
      <div class="actions">
        <button onclick="editMemory(${memory.id})">Sửa</button>
        <button onclick="deleteMemory(${memory.id})">Xoá</button>
      </div>
    `;

    memoriesContainer.appendChild(card);
  });
}

function deleteMemory(id) {
  memories = memories.filter((m) => m.id !== id);
  renderMemories();
}

function editMemory(id) {
  const memory = memories.find((m) => m.id === id);
  const newTitle = prompt("Tiêu đề mới:", memory.title);
  const newDescription = prompt("Mô tả mới:", memory.description);

  if (newTitle !== null && newDescription !== null) {
    memory.title = newTitle.trim();
    memory.description = newDescription.trim();
    renderMemories();
  }
}
