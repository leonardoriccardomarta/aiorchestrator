interface OnboardingData {
  storeConnected?: boolean;
  platform?: 'shopify' | 'woocommerce';
  storeUrl?: string;
  completedAt?: Date;
}

export const completeOnboarding = async (data: OnboardingData): Promise<void> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('http://localhost:4000/api/onboarding/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...data,
        completedAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save onboarding data');
    }

    // Update localStorage to mark onboarding as completed
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      parsedUserData.hasCompletedOnboarding = true;
      localStorage.setItem('userData', JSON.stringify(parsedUserData));
    }

    console.log('Onboarding completed successfully:', data);
  } catch (error) {
    console.error('Onboarding completion failed:', error);
    throw error;
  }
};