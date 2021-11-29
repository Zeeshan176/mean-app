const Post = require("../models/post");
const user = require("../models/user");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post
    .save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed!"
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!"
      });
    });
};
/////
// exports.likePost = (req,res)=>{
//   if (!req.body.id) {
//       res.json({ success: false, message: 'No id was provided'});
//   } else {
//       Post.findOne({ _id: req.body.id}, (err, post) => {
//         if (err) {
//           res.json({ success: false, message: 'Invalid post id'});
//         } else {
//           if (!post) {
//             res.json({ success: false, message: 'That post was not found.'});
//           } else {
//             user.findOne({ _id: req.fetchedPosts.userId}, (err, user) => {
//               if (err) {
//                 res.json({ success: false, message: 'Something went wrong.'});
//               } else {
//                 if (!user) {
//                   res.json({ success: false, message: 'Could not authenticate user'});
//                 } else {
//                   if (user.userId === post.createdPost) {
//                     res.json({ success: false, message: 'Cannot like your own post.'});
//                   } else {
//                     if (post.likedBy.includes(user.userId)) {
//                       res.json({ success: false, message: 'You already liked this post,'});
//                     } else {
//                       if (post.dislikedBy.includes(user.userId)) {
//                         post.dislikes--;
//                         const arrayIndex = post.dislikedBy.indexOf(user.userId);
//                         post.dislikedBy.splice(arrayIndex, 1);
//                         post.likes++;
//                         post.likedBy.push(user.userId);
//                         post.save((err) => {
//                           if (err) {
//                             res.json({ success: false, message: 'Something went wrong.'});
//                           } else {
//                             res.json({success: true, message: 'Post liked.'});
//                           }
//                         });
//                       } else {
//                         post.likes++;
//                         post.likedBy.push(user.userId);
//                         post.save((err) => {
//                           if (err) {
//                             res.json({ success: false, message: 'Something went wrong.'});
//                           } else {
//                             res.json({success: true, message: 'Post liked.'});
//                           }
//                         });
//                       }
//                     }
//                   }
//                 }
//               }
//             })
//           }
//         }
//       }
//     )}
// }


// exports.dislikePost = (req,res)=>{
//   if (!req.body.id) {
//       res.json({ success: false, message: 'No id was provided'});
//   } else {
//       Post.findOne({ _id: req.body.id}, (err, post) => {
//         if (err) {
//           res.json({ success: false, message: 'Invalid post id'});
//         } else {
//           if (!post) {
//             res.json({ success: false, message: 'That post was not found.'});
//           } else {
//             user.findOne({ _id: req.fetchedPosts.userId}, (err, user) => {
//               if (err) {
//                 res.json({ success: false, message: 'Something went wrong.'});
//               } else {
//                 if (!user) {
//                   res.json({ success: false, message: 'Could not authenticate user'});
//                 } else {
//                   if (user.userId === post.createdPost) {
//                     res.json({ success: false, message: 'Cannot dislike your own post.'});
//                   } else {
//                     if (post.dislikedBy.includes(user.userId)) {
//                       res.json({ success: false, message: 'You already disliked this post,'});
//                     } else {
//                       if (post.likedBy.includes(user.userId)) {
//                         post.likes--;
//                         const arrayIndex = post.likedBy.indexOf(user.userId);
//                         post.likedBy.splice(arrayIndex, 1);
//                         post.dislikes++;
//                         post.dislikedBy.push(user.userId);
//                         post.save((err) => {
//                           if (err) {
//                             res.json({ success: false, message: 'Something went wrong.'});
//                           } else {
//                             res.json({success: true, message: 'Post disliked.'});
//                           }
//                         });
//                       } else {
//                         post.dislikes++;
//                         post.dislikedBy.push(user.userId);
//                         post.save((err) => {
//                           if (err) {
//                             res.json({ success: false, message: 'Something went wrong.'});
//                           } else {
//                             res.json({success: true, message: 'Post disliked.'});
//                           }
//                         });
//                       }
//                     }
//                   }
//                 }
//               }
//             })
//           }
//         }
//       }
//     )}
// }
