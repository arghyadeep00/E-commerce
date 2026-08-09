import asyncHandler from '../middleware/asyncHandler.js';
import fs from 'fs';
import path from 'path';

export const imageUpload = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }
  
  const filename = path.basename(req.file.path);
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
  
  res.status(200).json({
    message: "Image uploaded successfully",
    image: fileUrl,
    url: fileUrl
  });
});

export const multipleUpload = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No images provided" });
  }
  
  const imagePaths = req.files.map(file => {
    const filename = path.basename(file.path);
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
  });
  
  res.status(200).json({
    message: "Images uploaded successfully",
    images: imagePaths,
    urls: imagePaths
  });
});

export const deleteUpload = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(404).json({ message: "File not found" });
    } else {
      res.status(200).json({ message: "Image deleted successfully" });
    }
  });
});

