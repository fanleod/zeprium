const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

// 设置文件存储规则
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 根据文件类型存储在不同文件夹
    let uploadPath = path.join(__dirname, '../public/uploads');
    if (file.mimetype.startsWith('image/')) {
      uploadPath = path.join(uploadPath, 'images');
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath = path.join(uploadPath, 'videos');
    } else {
      uploadPath = path.join(uploadPath, 'documents');
    }
    
    // 确保目录存在
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名，防止覆盖
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'application/pdf'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

// 设置上传限制
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter
});

// 获取所有上传的媒体文件
router.get('/', (req, res) => {
  try {
    const mediaFiles = [];
    const baseDir = path.join(__dirname, '../public/uploads');
    
    // 确保目录存在
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
      return res.json({ success: true, data: [] });
    }
    
    // 读取不同类型的媒体文件夹
    const mediaTypes = ['images', 'videos', 'documents'];
    
    mediaTypes.forEach(type => {
      const typeDir = path.join(baseDir, type);
      
      if (fs.existsSync(typeDir)) {
        const files = fs.readdirSync(typeDir)
          .filter(file => !file.startsWith('.')) // 过滤掉隐藏文件
          .map(file => {
            const stats = fs.statSync(path.join(typeDir, file));
            return {
              name: file,
              path: `/uploads/${type}/${file}`,
              type: type,
              size: stats.size,
              lastModified: stats.mtime
            };
          });
        
        mediaFiles.push(...files);
      }
    });
    
    res.json({
      success: true,
      data: mediaFiles
    });
  } catch (error) {
    console.error('Error reading media files:', error);
    res.status(500).json({
      success: false,
      message: 'Error reading media files',
      error: error.message
    });
  }
});

// 上传新媒体文件（需要认证）
router.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    // 返回文件信息
    const fileType = req.file.mimetype.startsWith('image/') ? 'images' :
                    req.file.mimetype.startsWith('video/') ? 'videos' : 'documents';
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        name: req.file.filename,
        originalName: req.file.originalname,
        path: `/uploads/${fileType}/${req.file.filename}`,
        type: fileType,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
});

// 删除媒体文件（需要认证）
router.delete('/:type/:filename', authenticateToken, (req, res) => {
  try {
    const { type, filename } = req.params;
    
    // 验证类型参数
    if (!['images', 'videos', 'documents'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid media type'
      });
    }
    
    const filePath = path.join(__dirname, '../public/uploads', type, filename);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // 删除文件
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
});

module.exports = router; 