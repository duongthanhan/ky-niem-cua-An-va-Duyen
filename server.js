// 📁 server.js
// 🌤️ Lưu ảnh/video vĩnh viễn lên Cloudinary

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const app = express();

// ⚙️ Cấu hình Cloudinary từ biến môi trường (Render sẽ lưu giá trị này an toàn)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ⚙️ Cho phép truy cập từ mọi thiết bị (Safari, iPhone, Android, Chrome,...)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
    credentials: true,
  })
);
app.options("*", cors());

// 🌸 Cấu hình lưu file trực tiếp lên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "kyniemdep", // thư mục trên Cloudinary
    resource_type: "auto", // tự nhận ảnh hoặc video
    public_id: Date.now() + "-" + file.originalname,
  }),
});

const upload = multer({ storage });

// Bộ nhớ tạm
let memories = [];

// 📤 Upload ảnh hoặc video
app.post("/upload", upload.single("file"), (req, res) => {
  const { title, description } = req.body;

  const memory = {
    id: Date.now(),
    title,
    description,
    fileUrl: req.file.path, // ✅ link vĩnh viễn Cloudinary
    fileType: req.file.mimetype,
  };

  memories.push(memory);
  res.json(memory);
});

// 📋 Lấy danh sách kỷ niệm
app.get("/memories", (req, res) => {
  res.json(memories);
});

// ❌ Xoá kỷ niệm (trên danh sách, không xoá file Cloudinary)
app.delete("/memories/:id", (req, res) => {
  const id = parseInt(req.params.id);
  memories = memories.filter((m) => m.id !== id);
  res.json({ message: "🗑️ Đã xoá kỷ niệm!" });
});

// 🚀 Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server đang chạy tại cổng ${PORT}`));
