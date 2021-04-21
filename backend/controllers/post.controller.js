const { Post } = require('../models');
const { request } = require('express');

exports.getPosts = (req, res) => {

  // REVIEW: Controller Fetch All Posts
  Post.find({})
    .then(docs => {
      res.status(200).json({
        message: 'Posts fetched succesfully!',
        posts: docs
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Internal Server Error',
        posts: null
      })
    });

}

exports.getPostById = (req, res) => {

    Post.findById(req.params.id)
      .then(post => {
        res.status(200).json(post);
      })
      .catch(err => {
        res.status(404).json({ message: 'Post with ID cannt be found' })
      })
}

exports.postPosts = (req = request, res, next) => {

  const url = `${req.protocol}://${req.get('host')}`;

  // REVIEW: Controller Create Post
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: `${url}/images/${req.file.filename}`
  });

  post.save()
    .then(post => {
      res.status(201).json({
        message: 'Post added successfully',
        post: { ...post, id: post._id }
      });
    })

}

exports.updatePost = (req, res) => {

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });

  // REVIEW: Controller Update Post
  Post.findByIdAndUpdate({ _id: req.params.id }, post)
    .then(() => {
      res.status(200).json({message: 'The post has been modified' });
    })

}

exports.deletePost = (req, res) => {

  // REVIEW: Controller Delete Post
  Post.deleteOne({ _id: req.params['id'] })
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Post deleted'
      });
    });
}
