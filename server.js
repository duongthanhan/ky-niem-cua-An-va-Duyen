// 📁 server.js
// 🌸 Website Kỷ Niệm — Upload ảnh/video lưu vĩnh viễn bằng Cloudinary

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const app = express();

// ⚙️ Cloudinary (cấu hình bằng biến môi trường trong Render)
// 👉 Render > Environment > Add Environment Variable
// CLOUDINARY_CLOUD_NAME = dsziuf4qj
// CLOUDINARY_API_KEY = 575455794538716
// CLOUDINARY_API_SECRET = yyHqelslM9aYlrvrClYGDedzJAM
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ⚙️ Cho phép mọi thiết bị truy cập (kể cả Safari iPhone)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
    credentials: true,
  })
);
app.options("*", cors());

// ⚙️ Đọc JSON & phục vụ file tĩnh (HTML, CSS, JS)
app.use(express.json());
app.use(express.static(__dirname));

// 🌤️ Cấu hình Multer lưu trực tiếp lên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "kyniemdep",
    resource_type: "auto", // auto: ảnh hoặc video
    public_id: Date.now() + "-" + file.originalname,
  }),
});
const upload = multer({ storage });

// 💾 Bộ nhớ tạm để hiển thị danh sách kỷ niệm
let memories = [];

// 📤 Upload ảnh hoặc video
app.post("/upload", upload.single("file"), (req, res) => {
  const { title, description } = req.body;

  const memory = {
    id: Date.now(),
    title,
    description,
    fileUrl: req.file.path, // ✅ Link Cloudinary vĩnh viễn
    fileType: req.file.mimetype,
  };

  memories.push(memory);
  res.json(memory);
});

// 📋 Lấy danh sách kỷ niệm
app.get("/memories", (req, res) => {
  res.json(memories);
});

// ❌ Xoá kỷ niệm (chỉ xóa trong danh sách)
app.delete("/memories/:id", (req, res) => {
  const id = parseInt(req.params.id);
  memories = memories.filter((m) => m.id !== id);
  res.json({ message: "🗑️ Đã xoá kỷ niệm!" });
});

// 🏠 Hiển thị trang chủ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🚀 Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server đang chạy tại cổng ${PORT}`));
