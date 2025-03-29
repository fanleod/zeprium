const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');

// 博客文章数据文件路径
const blogDataPath = path.join(__dirname, '../data/blog-posts.json');

// 确保博客数据文件存在
const ensureBlogDataFileExists = () => {
  if (!fs.existsSync(blogDataPath)) {
    fs.writeFileSync(blogDataPath, JSON.stringify([], null, 2), 'utf8');
  }
};

// 读取所有博客文章
router.get('/', (req, res) => {
  try {
    ensureBlogDataFileExists();
    const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
    res.json({
      success: true,
      data: blogData
    });
  } catch (error) {
    console.error('Error reading blog data:', error);
    res.status(500).json({
      success: false,
      message: 'Error reading blog data',
      error: error.message
    });
  }
});

// 获取单个博客文章
router.get('/:id', (req, res) => {
  try {
    ensureBlogDataFileExists();
    const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
    const post = blogData.find(post => post.id === req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error reading blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Error reading blog post',
      error: error.message
    });
  }
});

// 创建新的博客文章（需要认证）
router.post('/', authenticateToken, (req, res) => {
  try {
    ensureBlogDataFileExists();
    const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
    
    // 从请求体获取文章数据
    const { id, title, category, summary, content, color } = req.body;
    
    // 验证必填字段
    if (!id || !title || !category || !summary) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // 检查是否已存在同ID的文章
    if (blogData.some(post => post.id === id)) {
      return res.status(400).json({
        success: false,
        message: 'Blog post with this ID already exists'
      });
    }
    
    // 创建新文章对象
    const newPost = {
      id,
      title,
      category,
      summary,
      content: content || summary,
      color: color || '#3a3a3a',
      date: new Date().toISOString(),
      url: 'pages/blog.html',
      urlParams: `?post=${id}`,
      featured: false
    };
    
    // 添加到数据数组
    blogData.push(newPost);
    
    // 写回文件
    fs.writeFileSync(blogDataPath, JSON.stringify(blogData, null, 2), 'utf8');
    
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: newPost
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error.message
    });
  }
});

// 更新博客文章（需要认证）
router.put('/:id', authenticateToken, (req, res) => {
  try {
    ensureBlogDataFileExists();
    let blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
    
    // 找到要更新的文章索引
    const index = blogData.findIndex(post => post.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // 更新文章数据，保留原有字段
    const updatedPost = {
      ...blogData[index],
      ...req.body,
      // 确保ID不变
      id: req.params.id
    };
    
    // 更新数组
    blogData[index] = updatedPost;
    
    // 写回文件
    fs.writeFileSync(blogDataPath, JSON.stringify(blogData, null, 2), 'utf8');
    
    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog post',
      error: error.message
    });
  }
});

// 删除博客文章（需要认证）
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    ensureBlogDataFileExists();
    let blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
    
    // 查找要删除的文章
    const initialLength = blogData.length;
    blogData = blogData.filter(post => post.id !== req.params.id);
    
    if (blogData.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // 写回文件
    fs.writeFileSync(blogDataPath, JSON.stringify(blogData, null, 2), 'utf8');
    
    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog post',
      error: error.message
    });
  }
});

module.exports = router; 