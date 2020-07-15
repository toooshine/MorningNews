var express = require('express');
var router = express.Router();

var uid2 = require('uid2');
var SHA256 = require('crypto-js/sha256');
var encBase64 = require('crypto-js/enc-base64');

var userModel = require('../models/users');
var articleModel = require('../models/articles');

router.post('/sign-up', async function (req, res, next) {
  
  var error = [];
  var result = false;
  var saveUser = null;
  var token = null;

  var data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if (data !== null) {
    error.push('Utilsateur déjà présent')
  }

  if (req.body.usernameFront === '' || req.body.emailFromFront === '' || req.body.passwordFromFront === '') {
    error.push('Champ(s) vide(s)')
  }

  if (error == 0) {

    var salt = uid2(32);

    var newUser = new userModel({
    username: req.body.usernameFront,
    email: req.body.emailFromFront,
    password: SHA256(req.body.passwordFromFront + salt).toString(encBase64),
    token: uid2(32),
    salt: salt
  })

    saveUser = await newUser.save();
    if (saveUser) {
      result = true;
      token = saveUser.token
    }
  }

  res.json({ result, saveUser, token, error });
});

router.post('/sign-in', async function (req, res, next) {

  var error = [];
  var user = null;
  var result = false;
  var token = null;

  if (req.body.emailFromFront === '' || req.body.passwordFromFront === '') {
  error.push('Vérifiez les informations saisies')
  }
  if (error == 0) {
    user = await userModel.findOne({
      email: req.body.emailFromFront
    })

    if (user) {
      const passwordEncrypt = SHA256(req.body.passwordFromFront + user.salt).toString(encBase64);

      if (passwordEncrypt === user.password) {
        result = true;
        token = user.token;
      } else {
        result = false;
        error.push('Mot de passe incorrect')
      }
    } else {
      error.push('Email incorrect')
    }
  }

  res.json({result, user, error, token})
})

router.post('/wishlist-article', async function (req, res, next) {
  var result = false;
  var user = await userModel.findOne({
    token: req.body.token
  });

  if (user !== null) {
    var newArticle = new articleModel({
      title: req.body.name,
      description: req.body.desc,
      urlToImage: req.body.img,
      content: req.body.content,
      lang: req.body.lang,
      userId: user._id
    });

    var articleSave = await newArticle.save();

    if (articleSave.name) {
      result = true;
    }
  }

  res.json({ result });
})

router.delete('/wishlist-article', async function (req, res, next) {
  var result = false;
  var user = await userModel.findOne({
    token: req.body.token
  });

  if (user != null) {
    var returnDb = await articleModel.deleteOne({
      title: req.body.title,
      userId: user._id
    });

    if (returnDb.deletedCount == 1) {
      result = true;
    }
  }

  res.json({ result })
});

router.get('/wishlist-article', async function (req, res, next) {
  var articles = [];
  var user = await userModel.findOne({
    token: req.query.token
  });

  if (user !== null) {
    if (req.query.lang !== '') {
      articles = await articleModel.find({
        userId: user._id,
        lang: req.query.lang
      });
    } else {
      articles = await articleModel.find({
        userId: user._id
      });
    }
  }
  res.json({articles});
})

router.get('/user-lang', async function (req, res, next) {

  var lang = null;
  var user = await userModel.findOne({
    token: req.query.token
  });

  if (user !== null) {
    lang = req.query.lang
  }

  res.json({lang})
})

router.post('/user-lang', async function (req, res, next) {
  var result = false;
  var user = await userModel.updateOne({ token: req.body.token }, { lang: req.body.lang });

  if (user !== null) {
  reslut = true;
  }
  
  res.json({ result });
})

module.exports = router;
