import { useEffect, useState } from 'react';
import { getFaqs } from '@/lib/services/faqService';

export const useFaqs = (token) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getFaqs(token);
        setFaqs(data);
      } catch (e) {
        console.error('Failed to load FAQs', e);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchFaqs();
  }, [token]);

  return { faqs, loading };
};
