export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

export const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

export const isValidCreditCard = (cardNumber: string): boolean => {
  // Luhn algorithm implementation
  const sanitizedNumber = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;

  for (let i = sanitizedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitizedNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const isValidIPAddress = (ip: string): boolean => {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  if (ipv4Regex.test(ip)) {
    return ip.split('.').every((num) => parseInt(num) <= 255);
  }

  return ipv6Regex.test(ip);
};

export const isStrongPassword = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length
  if (password.length >= 12) {
    score += 2;
  } else if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password is too short');
  }

  // Character types
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  // Complexity
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Password contains repeated characters');
    score -= 1;
  }

  if (/^[a-zA-Z]+$/.test(password)) {
    feedback.push('Password contains only letters');
    score -= 1;
  }

  if (/^[0-9]+$/.test(password)) {
    feedback.push('Password contains only numbers');
    score -= 1;
  }

  // Common patterns
  const commonPatterns = [
    'password',
    '123456',
    'qwerty',
    'admin',
    'letmein',
    'welcome',
  ];
  if (commonPatterns.some((pattern) => password.toLowerCase().includes(pattern))) {
    feedback.push('Password contains common patterns');
    score -= 2;
  }

  // Normalize score
  score = Math.max(0, Math.min(5, score));

  if (score < 3) {
    feedback.push('Password is weak');
  } else if (score < 4) {
    feedback.push('Password is moderate');
  } else {
    feedback.push('Password is strong');
  }

  return { score, feedback };
};

export const validateForm = <T extends Record<string, unknown>>(
  data: T,
  rules: {
    [K in keyof T]?: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      validate?: (value: T[K]) => boolean | string;
    };
  }
): { isValid: boolean; errors: { [K in keyof T]?: string } } => {
  const errors = {} as { [K in keyof T]?: string };

  (Object.entries(rules) as [keyof T, unknown][]).forEach(([field, rule]) => {
    if (!rule || typeof rule !== 'object') return;
    const typedRule = rule as {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      validate?: (value: T[typeof field]) => boolean | string;
    };
    const value = data[field];

    if (typedRule.required && !value) {
      errors[field] = `${String(field)} is required`;
    }

    if (value) {
      if (typedRule.minLength && String(value).length < typedRule.minLength) {
        errors[field] = `${String(field)} must be at least ${typedRule.minLength} characters`;
      }

      if (typedRule.maxLength && String(value).length > typedRule.maxLength) {
        errors[field] = `${String(field)} must be no more than ${typedRule.maxLength} characters`;
      }

      if (typedRule.pattern && !typedRule.pattern.test(String(value))) {
        errors[field] = `${String(field)} is invalid`;
      }

      if (typedRule.validate) {
        const result = typedRule.validate(value);
        if (result !== true) {
          errors[field] = typeof result === 'string' ? result : `${String(field)} is invalid`;
        }
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}; 