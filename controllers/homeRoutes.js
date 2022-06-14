const router = require('express').Router();
const res = require('express/lib/response');
const { Project, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const projectData = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

//     // Serialize data so the template can read it
  const blogs = projectData.map((project) => project.get({ plain: true }));


    // const blogs = [
    //   {
    //     title: "title",
    //     content: "content",
    //     author: "author",
    //     date: "6/14/22"
    //   },
    //   {
    //     title: "title",
    //     content: "content",
    //     author: "author",
    //     date: "6/14/22"
    //   },
    //   {
    //     title: "title",
    //     content: "content",
    //     author: "author",
    //     date: "6/14/22"
    //   },
    // ];

//     // Pass serialized data and session flag into template
console.log('blogs', blogs);
    res.render('homepage', { 
      blogs, 
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});


// router.get('/blogs/:id', async (req, res) => {
  
//     const userData = await User.findByPk(req.session.user_id, {
//       attributes: { exclude: ['password'] },
//       include: [{ model: Project }],
//     });

//     const user = userData.get({ plain: true });

//     res.render('profile', {
//       ...user,
//       logged_in: true
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get('/blogs/:id', async (req, res) => {
  const postData = await Post.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ['username'],
      },
      {
        model: Comment,
        include: {
          model: User,
          attributes: ['username'],
        },
      },
    ],
  });

const blog = postData.get({ plain: true});
res.render('blog-page', {
  ...blog,
  logged_in: true,
});
});
module.exports = router;
