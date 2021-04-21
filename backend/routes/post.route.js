const express = require('express');
const router = express.Router();

const multer = require('multer');
const { storage } = require('../www/helpers');

const {
  getPosts,
  getPostById,
  postPosts,
  updatePost,
  deletePost } = require('../controllers/post.controller');

router.get('/', getPosts);
router.post('/', multer({storage}).single('image'), postPosts);

router.route('/:id')
  .get(getPostById)
  .delete(deletePost)
  .put(updatePost);

module.exports = router;
