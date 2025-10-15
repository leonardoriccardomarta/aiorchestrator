const express = require('express');
const router = express.Router();
const affiliateService = require('../services/affiliateService');
const marketingMaterialsService = require('../services/marketingMaterialsService');
const { authenticateToken } = require('../middleware/auth');

// Alias for consistency
const authenticate = authenticateToken;

/**
 * @route   POST /api/affiliate/register
 * @desc    Register user as affiliate
 * @access  Private
 */
router.post('/register', authenticate, async (req, res) => {
  try {
    const { paypalEmail, bankAccount } = req.body;
    const userId = req.user.userId || req.user.id;
    
    console.log('🎯 Affiliate registration attempt:', { userId, paypalEmail, user: req.user });

    const result = await affiliateService.createAffiliate(userId, paypalEmail, bankAccount);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data,
      message: 'Affiliate account created successfully'
    });
  } catch (error) {
    console.error('❌ Affiliate registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/affiliate/stats
 * @desc    Get affiliate statistics
 * @access  Private
 */
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const result = await affiliateService.getAffiliateStats(userId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('❌ Error getting affiliate stats:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   POST /api/affiliate/payout
 * @desc    Request payout
 * @access  Private
 */
router.post('/payout', authenticate, async (req, res) => {
  try {
    const { method } = req.body;
    const userId = req.user.userId || req.user.id;

    const result = await affiliateService.requestPayout(userId, method);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data,
      message: result.message
    });
  } catch (error) {
    console.error('❌ Error requesting payout:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   PUT /api/affiliate/payment-info
 * @desc    Update payment information
 * @access  Private
 */
router.put('/payment-info', authenticate, async (req, res) => {
  try {
    const { paypalEmail, bankAccount } = req.body;
    const userId = req.user.userId || req.user.id;

    const result = await affiliateService.updatePaymentInfo(userId, paypalEmail, bankAccount);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data,
      message: 'Payment information updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating payment info:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   POST /api/affiliate/track/:code
 * @desc    Track referral signup (public endpoint)
 * @access  Public
 */
router.post('/track/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        error: 'User ID and email are required'
      });
    }

    const result = await affiliateService.trackReferral(code, userId, email);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data,
      message: 'Referral tracked successfully'
    });
  } catch (error) {
    console.error('❌ Error tracking referral:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   POST /api/affiliate/convert
 * @desc    Convert referral and calculate commission (internal)
 * @access  Private
 */
router.post('/convert', authenticate, async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'User ID and amount are required'
      });
    }

    const result = await affiliateService.convertReferral(userId, amount);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data,
      message: 'Referral converted successfully'
    });
  } catch (error) {
    console.error('❌ Error converting referral:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/affiliate/admin/payouts
 * @desc    Get all pending payouts (admin only)
 * @access  Private (Admin)
 */
router.get('/admin/payouts', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const result = await affiliateService.getPendingPayouts();

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('❌ Error getting pending payouts:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   POST /api/affiliate/admin/process-payout/:id
 * @desc    Process a payout (admin only)
 * @access  Private (Admin)
 */
router.post('/admin/process-payout/:id', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { id } = req.params;
    const { transactionId, notes } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID is required'
      });
    }

    const result = await affiliateService.processPayout(id, transactionId, notes);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.data,
      message: result.message
    });
  } catch (error) {
    console.error('❌ Error processing payout:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/affiliate/marketing-materials
 * @desc    Get marketing materials
 * @access  Private
 */
router.get('/marketing-materials', authenticate, async (req, res) => {
  try {
    const materials = marketingMaterialsService.getAllMaterials();
    
    res.json({
      success: true,
      data: materials
    });
  } catch (error) {
    console.error('❌ Error getting marketing materials:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;

