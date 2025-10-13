/**
 * Email Tracker Service
 * Tracks daily email usage to stay within Gmail limits (500/day personal, 2000/day Workspace)
 */

class EmailTracker {
  constructor() {
    this.dailyCount = 0;
    this.lastReset = new Date().toDateString();
    this.limit = 500; // Gmail personal limit (adjust to 2000 for Workspace)
    this.warningThreshold = 0.8; // Alert at 80%
  }

  /**
   * Reset counter if it's a new day
   */
  checkAndReset() {
    const today = new Date().toDateString();
    if (this.lastReset !== today) {
      console.log(`📊 Email Tracker: Daily reset - Previous count: ${this.dailyCount}`);
      this.dailyCount = 0;
      this.lastReset = today;
    }
  }

  /**
   * Increment email counter
   */
  increment() {
    this.checkAndReset();
    this.dailyCount++;

    // Log warnings as we approach limit
    const usage = this.dailyCount / this.limit;
    
    if (usage >= 0.9) {
      console.warn(`⚠️  Email Tracker: CRITICAL - ${this.dailyCount}/${this.limit} emails sent today (${(usage * 100).toFixed(1)}%)`);
    } else if (usage >= this.warningThreshold) {
      console.warn(`⚠️  Email Tracker: WARNING - ${this.dailyCount}/${this.limit} emails sent today (${(usage * 100).toFixed(1)}%)`);
    }

    return this.dailyCount;
  }

  /**
   * Check if we can send more emails today
   */
  canSendEmail() {
    this.checkAndReset();
    return this.dailyCount < this.limit;
  }

  /**
   * Get remaining emails for today
   */
  getRemainingEmails() {
    this.checkAndReset();
    return Math.max(0, this.limit - this.dailyCount);
  }

  /**
   * Get current stats
   */
  getStats() {
    this.checkAndReset();
    const usage = this.dailyCount / this.limit;
    
    return {
      dailyCount: this.dailyCount,
      limit: this.limit,
      remaining: this.getRemainingEmails(),
      usagePercentage: `${(usage * 100).toFixed(2)}%`,
      date: this.lastReset,
      status: usage >= 0.9 ? 'critical' : usage >= 0.8 ? 'warning' : 'ok'
    };
  }

  /**
   * Set custom limit (for Google Workspace upgrade)
   */
  setLimit(newLimit) {
    this.limit = newLimit;
    console.log(`📧 Email Tracker: Limit updated to ${newLimit} emails/day`);
  }
}

// Singleton instance
const emailTracker = new EmailTracker();

module.exports = emailTracker;

