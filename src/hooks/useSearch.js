import { useEffect, useState } from 'react';
import { searchRestaurants } from '../services/api';

export const useSearch = (query, isActive) => {
  const [results, setResults] = useState([]);


  useEffect(() => {
    if (isActive && query.length > 0) {
      const search = async () => {
        try {
          const data = await searchRestaurants(query); // 검색 API 호출
          setResults(data);
        } catch (error) {
          console.error('Error searching:', error);
        }
      };
      search();
    } else {
      setResults([]); // 검색어가 없거나 비활성화되면 결과 초기화
    }
  }, [query, isActive]); // 쿼리나 isActive 값이 변경될 때마다 실행

  return results;
};