const User = require("../models/User");

const VIP_PLANS = {
  monthly: { label: "1 tháng", durationDays: 30, price: 49000 },
  quarterly: { label: "3 tháng", durationDays: 90, price: 129000 },
  yearly: { label: "1 năm", durationDays: 365, price: 399000 },
};

/**
 * GET /api/vip/plans
 * Return available VIP plans
 */
const getVipPlans = (req, res) => {
  try {
    const plans = Object.entries(VIP_PLANS).map(([key, val]) => ({
      id: key,
      ...val,
    }));
    return res.status(200).json({ success: true, data: plans });
  } catch (error) {
    console.error("getVipPlans error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * POST /api/vip/subscribe
 * Register a VIP subscription for authenticated user
 * Body: { planId: "monthly" | "quarterly" | "yearly" }
 */
const subscribeVip = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const plan = VIP_PLANS[planId];
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan. Choose: monthly, quarterly, or yearly.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const now = new Date();
    const currentExpiry =
      user.vipExpiresAt && user.vipExpiresAt > now ? user.vipExpiresAt : now;

    const newExpiry = new Date(currentExpiry);
    newExpiry.setDate(newExpiry.getDate() + plan.durationDays);

    user.role = "vip";
    user.vipExpiresAt = newExpiry;
    user.vipPlan = planId;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Đăng ký VIP ${plan.label} thành công!`,
      data: {
        role: user.role,
        vipPlan: user.vipPlan,
        vipExpiresAt: user.vipExpiresAt,
      },
    });
  } catch (error) {
    console.error("subscribeVip error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * GET /api/vip/status
 * Get current VIP status of authenticated user
 */
const getVipStatus = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("role vipPlan vipExpiresAt");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isVip = user.role === "vip" && user.vipExpiresAt && user.vipExpiresAt > new Date();

    return res.status(200).json({
      success: true,
      data: {
        isVip,
        role: user.role,
        vipPlan: user.vipPlan || null,
        vipExpiresAt: user.vipExpiresAt || null,
      },
    });
  } catch (error) {
    console.error("getVipStatus error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * DELETE /api/vip/cancel
 * Cancel VIP subscription (will not renew after expiry)
 */
const cancelVip = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.vipPlan = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Đã hủy tự động gia hạn gói VIP. Tài khoản VIP vẫn có hiệu lực đến hết hạn.",
    });
  } catch (error) {
    console.error("cancelVip error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getVipPlans, subscribeVip, getVipStatus, cancelVip };
