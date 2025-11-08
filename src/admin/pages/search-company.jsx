import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faFilter,
  faUser,
  faIndustry,
  faPhone,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import React, { useState, useEffect } from "react";
import "../../assets/css/admin/home-admin.css";
import "../../assets/css/admin/company-search.css";
import { companyService } from "../../services/companyService";
import usePaginationApi from "../../hooks/use-pagination-api";

// Components
import SearchHeader from "./company-wedget/search-header";
import SearchResults from "./company-wedget/search-results";
import SearchModal from "./company-wedget/search-modal";

// Search Company Component
const SearchCompany = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTotalPages, setSearchTotalPages] = useState(1); // Separate for search
  const [searchCurrentPage, setSearchCurrentPage] = useState(0); // Separate for search

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // Fetch companies with pagination
  const {
    data: companies = [],
    currentPage,
    totalPages,
    isLoading,
    error,
    execute: loadCompanies,
  } = usePaginationApi(
    () => companyService.getAllCompanies({ page, size }),
    true
  );

  useEffect(() => {
    loadCompanies();
  }, []);

  // Handle individual filter removal
  // In your main SearchCompany component
  const handleRemoveFilter = async (filterKey) => {
    const newFilters = { ...activeFilters };

    // Reset the specific filter based on its type
    if (
      filterKey === "companyType" ||
      filterKey === "industry" ||
      filterKey === "ownershipType"
    ) {
      newFilters[filterKey] = { id: 0 }; // Reset object filters to default
    } else {
      newFilters[filterKey] = ""; // Reset string filters to empty
    }

    setActiveFilters(newFilters);

    // Check if any filters are still active
    const hasRemainingFilters = Object.values(newFilters).some((value) => {
      if (typeof value === "string") {
        return value !== "";
      } else if (value && typeof value === "object" && value.id !== undefined) {
        return value.id > 0;
      }
      return false;
    });

    if (!hasRemainingFilters && !searchTerm) {
      // If no filters left and no search term, load all companies
      setPage(0);
      await loadCompanies();
      return;
    }
    // Perform search with updated filters
    setIsSearching(true);
    try {
      const searchParams = { ...newFilters, page: 0, size: pageSize };

      // Remove filters with default values
      Object.keys(searchParams).forEach((key) => {
        if (typeof searchParams[key] === "string" && searchParams[key] === "") {
          delete searchParams[key];
        } else if (
          searchParams[key] &&
          typeof searchParams[key] === "object" &&
          searchParams[key].id === 0
        ) {
          delete searchParams[key];
        }
      });

      const response = await companyService.searchCompanies(searchParams);
      setSearchResults(response.data.content || []);
      setPage(response.data.number || 0);
    } catch (err) {
      console.error("Filter removal search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle advanced search
  const handleAdvancedSearch = async (filters) => {
    setActiveFilters(filters);
    setIsModalOpen(false);
    setIsSearching(true);

    try {
      const response = await companyService.searchCompanies({
        page: 0,
        size: size,
        sortBy: "companyName",
        sortDir: "asc",
        filters: filters,
        searchTerm: "",
      });

      console.log(response);

      if (response) {
        // Update search-specific states
        setSearchTotalPages(response.totalPages || 1);
        setSearchCurrentPage(response.number || 0);
        setSearchResults(response.content || []);
      }
    } catch (err) {
      console.error("Advanced search error:", err);
      setSearchTotalPages(1);
      setSearchCurrentPage(0);
    } finally {
      setIsSearching(false);
    }
  };

  // Search handlers
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setActiveFilters({});
      setSearchResults([]);
      setPage(0);
      setSearchTotalPages(1);
      setSearchCurrentPage(0);
      await loadCompanies();
      return;
    }

    setIsSearching(true);
    try {
      const response = await companyService.searchCompanies({
        page: 0,
        size: size,
        sortBy: "companyName",
        sortDir: "asc",
        filters: {},
        searchTerm: searchTerm,
      });
      if (response) {
        // Update search-specific states
        setSearchTotalPages(response.totalPages || 1);
        setSearchCurrentPage(response.number || 0);
        setSearchResults(response.content || []);
        setActiveFilters({});
      }
    } catch (err) {
      console.error("Search error:", err);
      // You can set an error state here if needed
      // setSearchError("Failed to perform search. Please try again.");
      setSearchTotalPages(1);
      setSearchCurrentPage(0);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear all searches and filters
  // Also update the clearSearch function
  const clearSearch = async () => {
    setSearchTerm("");
    setActiveFilters({
      company: "",
      companyArabic: "",
      phone: "",
      email: "",
      companyStatus: "",
      companyType: { id: 0 },
      industry: { id: 0 },
      ownershipType: { id: 0 },
    });
    setSearchResults([]);
    //await handleSearch();
  };

  const loadData = async (pageToLoad = 0) => {
    try {
      setIsSearching(true);

      const baseParams = {
        page: pageToLoad,
        size,
        sortBy: "companyName",
        sortDir: "asc",
      };

      let response;
      if (hasSearch) {
        const filtersToUse = hasActiveFilters ? activeFilters : {};
        const termToUse = hasActiveFilters ? "" : searchTerm;

        response = await companyService.searchCompanies({
          ...baseParams,
          filters: filtersToUse,
          searchTerm: termToUse,
        });

        setSearchResults(response.content || []);
        setSearchTotalPages(response.totalPages || 1);
        setSearchCurrentPage(response.number || 0);
      } else {
        // response = await companyService.getAllCompanies(baseParams);
        await loadCompanies();
        // If you use the pagination hook, you can optionally skip this part
        //setPage(response.number || 0);
      }
    } catch (err) {
      console.error("Load data error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = async (newPage) => {
    if (newPage >= 0 && newPage < displayTotalPages) {
      if (hasSearch) {
        setSearchCurrentPage(newPage);
      } else {
        setPage(newPage);
      }
    }
  };

  const handleRetry = () => {
    setPage(searchCurrentPage);
    loadCompanies();
  };

  const hasActiveFilters = Object.values(activeFilters).some(
    (value) => value !== ""
  );
  const hasSearch = hasActiveFilters || searchTerm.trim();
  const displayCompanies = hasSearch ? searchResults : companies;
  const displayCurrentPage = hasSearch ? searchCurrentPage : currentPage;
  const displayTotalPages = hasSearch ? searchTotalPages : totalPages;
  const displayLoading = isLoading || isSearching;
  useEffect(() => {
    loadData(hasSearch ? searchCurrentPage : page);
  }, [page, searchCurrentPage, hasSearch, activeFilters, searchTerm]);

  return (
    <div className="search-company-page">
      <h2>Search Companies</h2>

      <SearchHeader
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        onAdvancedSearch={() => setIsModalOpen(true)}
        onClearSearch={clearSearch}
        activeFilters={activeFilters}
        isLoading={displayLoading}
        onRemoveFilter={handleRemoveFilter} // Pass the function
      />

      <SearchResults
        companies={displayCompanies}
        hasSearch={hasSearch}
        error={error}
        isLoading={displayLoading}
        currentPage={displayCurrentPage}
        totalPages={displayTotalPages} // Use the correct totalPages
        onRetry={handleRetry}
        onPageChange={handlePageChange}
      />

      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSearch={handleAdvancedSearch}
        initialFilters={activeFilters}
      />
    </div>
  );
};

export default SearchCompany;
