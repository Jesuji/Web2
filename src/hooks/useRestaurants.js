import { useEffect, useState } from 'react';
import { getRestaurants } from '../services/api';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const data = await getRestaurants(); // 전체 레스토랑 가져오기
        setRestaurants(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []); // 처음 렌더링될 때만 한 번 호출

  return { restaurants, loading, error };
};