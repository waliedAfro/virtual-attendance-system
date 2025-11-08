
import { useState,useEffect } from "react";

const usePaginationApi =(apiCall, immediate = true) => {
    const [data , setData] = useState([]) ;
    const [currentPage , setCurrentPage] = useState(0) ;
    const [totalPages , setTotalPages] =useState(0);
    const [isLoading , setIsLoading] = useState(immediate);
    const [error ,setError] = useState(null) ;

    const execute = async (...args) => {
        try {
          setIsLoading(true);
          setError(null);
          const response = await apiCall(...args); 
          setData(response.content);
          setCurrentPage(response.number);
          setTotalPages(response.totalPages);
          setIsLoading(false);
          setError(null) ;
          return response;
        } catch (err) {
          setError(err.message);
          throw err;
        } finally {
            setIsLoading(false);
        }
      };
    
      
      useEffect(() => {
        if (immediate) {
          execute();
        }
      }, []);
    
      return { data, currentPage, totalPages,isLoading,error, execute };

}
export default usePaginationApi ;