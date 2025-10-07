const express = require('express');
const { login, logout, register, updateUserPassword, resetPassword } = require('../controllers/authController');
const { getAllUser, getMe, updatePhotoImage, updateUserProfile, deleteUser, unBlockUser } = require('../controllers/userController');
const upload = require('../middleware/multer');
const { auth } = require('../middleware/auth');
const { authAdmin } = require('../middleware/authAdmin');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/reset', resetPassword);

router.get('/getMe/:id', getMe);

router.use(auth);

router.get('/checkAuth', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tài khoản được cấp phép',
    user: { ...req.user, role: req.user.role },
  });
});

router.patch('/updatePhoto', upload.single('photo'), updatePhotoImage);
router.patch('/updateUserProfile', updateUserProfile);
router.patch('/updateUserPassword', updateUserPassword);

router.use(authAdmin);

router.get('/admin/getAllUsers', getAllUser);
router.patch('/admin/deleteUser/:id', deleteUser);
router.patch('/admin/unblockUser/:id', unBlockUser);

module.exports = router;
