const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js')
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

router.use('/', (err, req, res, next) => {
  if (err.status === 401) {
    res.status(err.status);
    res.json(err.errors);
  } else if (err.status === 403) {
    res.status(err.status);
    res.json(
      {
        "message": "Forbidden"
      }
    )
  }
});

module.exports = router;
