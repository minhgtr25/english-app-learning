const User = require('../models/User');

/**
 * Danh sách avatar mặc định để user chọn (preset avatars)
 */
const PRESET_AVATARS = [
  { id: 'av1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix' },
  { id: 'av2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Luna' },
  { id: 'av3', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Max' },
  { id: 'av4', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Lily' },
  { id: 'av5', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ace' },
  { id: 'av6', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nova' },
  { id: 'av7', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Zara' },
  { id: 'av8', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Blaze' },
];

/**
 * GET /api/profile
 * Lấy thông tin hồ sơ của user đang đăng nhập
 */
async function getProfile(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('getProfile error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * PATCH /api/profile
 * Cập nhật thông tin hồ sơ
 * Body: { fullName?, bio?, avatarUrl? }
 */
async function updateProfile(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { fullName, bio, avatarUrl } = req.body;
    const updates = {};

    if (fullName !== undefined) {
      if (typeof fullName !== 'string' || fullName.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'Họ tên phải có ít nhất 2 ký tự' });
      }
      updates.fullName = fullName.trim();
    }

    if (bio !== undefined) {
      if (bio.length > 200) {
        return res.status(400).json({ success: false, message: 'Bio không quá 200 ký tự' });
      }
      updates.bio = bio.trim();
    }

    if (avatarUrl !== undefined) {
      updates.avatarUrl = avatarUrl.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'Không có thông tin nào để cập nhật' });
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    return res.status(200).json({
      success: true,
      message: 'Cập nhật hồ sơ thành công!',
      data: user,
    });
  } catch (err) {
    console.error('updateProfile error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * GET /api/profile/avatars
 * Lấy danh sách avatar preset để user chọn
 */
function getPresetAvatars(req, res) {
  return res.status(200).json({ success: true, data: PRESET_AVATARS });
}

/**
 * PATCH /api/profile/avatar
 * Chọn avatar từ danh sách preset hoặc gán URL tuỳ chỉnh
 * Body: { avatarId? } hoặc { avatarUrl? }
 */
async function updateAvatar(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { avatarId, avatarUrl } = req.body;
    let resolvedUrl = null;

    if (avatarId) {
      const preset = PRESET_AVATARS.find((a) => a.id === avatarId);
      if (!preset) {
        return res.status(400).json({ success: false, message: 'Avatar không hợp lệ' });
      }
      resolvedUrl = preset.url;
    } else if (avatarUrl) {
      resolvedUrl = avatarUrl.trim();
    } else {
      return res.status(400).json({ success: false, message: 'Cần cung cấp avatarId hoặc avatarUrl' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatarUrl: resolvedUrl },
      { new: true }
    ).select('-password');

    return res.status(200).json({
      success: true,
      message: 'Đã cập nhật avatar!',
      data: { avatarUrl: user.avatarUrl },
    });
  } catch (err) {
    console.error('updateAvatar error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * PATCH /api/profile/change-password
 * Đổi mật khẩu
 * Body: { currentPassword, newPassword }
 */
async function changePassword(req, res) {
  try {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Cần nhập mật khẩu hiện tại và mật khẩu mới' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    const bcrypt = require('bcryptjs');
    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    console.error('changePassword error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getProfile, updateProfile, getPresetAvatars, updateAvatar, changePassword };
