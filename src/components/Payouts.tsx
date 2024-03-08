import { useState, useEffect } from "react";
import styled from 'styled-components';
import PayoutList from "./PayoutList";

interface Payout {
  id: number;
  dateAndTime: string;
  status: string;
  value: string;
  username: string;
}

const StyledPayoutsContainer = styled.div`
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-family: "Segoe UI", sans-serif;

  h1 {
    font-size: 24px;
    margin-bottom: 15px;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
  }

  div.search{
    display:flex;
  }

  input {
    margin-right: 10px;
    height: 30px;
    padding: 0px 7px;
    width: 30%;
  }

  button.green {
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  div.pagination {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th, td {
      width: 80px;
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      white-space: wrap;
      overflow: hidden; /* Hide content that overflows */
      text-overflow: ellipsis; /* Add ellipsis for hidden content */
    }

    /* Badge styling for status */
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      color: white;
    }

    /* Apply grey color to Pending status badge */
    .status-pending {
      background-color: grey;
    }

    /* Apply green color to Paid status badge */
    .status-completed {
      background-color: #4caf50;
    }
  }

  button.reset {
    margin-left: 18px;
    padding: 8px 16px;
    background-color: #c51212;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

export const Payouts = () => {

  const [payouts, setPayouts] = useState<Payout[]>([]); //Maintains the list of payouts
  const [searchedPayouts, setsearchedPayouts] = useState<Payout[]>([]); //Maintains the list of searched payouts
  const [searchTerm, setSearchTerm] = useState<string>(''); //Maintains the Payouts searched keyword 
  const [page, setPage] = useState<number>(1); //Maintains the current page number
  const [limit] = useState<number>(10); //Maintains the number of payouts per page
  const [totalCount, setTotalCount] = useState<number>(0); //Maintains the total count of payputs fetched from API
  const [searchDone, setSearchDone] = useState<boolean>(false); //Mains the status of search
  const [loading, setLoading] = useState<boolean>(true); //Mains the status of search

  //Fetch Payouts
  const fetchData = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const response = await fetch(`https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts?page=${page}&limit=${limit}`);
      const { data, metadata } = await response.json();
      setPayouts(data);
      setTotalCount(metadata.totalCount);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payouts:', error);
    }
  };

  useEffect(() => {
    if(!searchTerm || searchTerm.trim() == "" || !searchDone ){
      fetchData(page, limit);
    }
    
  }, [page, limit]);


  //Search Payouts
  const searchPayouts = async () => {
    try {     
      //If search Term is not empty string then call the search api
      if (searchTerm && searchTerm.trim() !== '') {
        
        setSearchDone(true);
        
        const response = await fetch(`https://theseus-staging.medley.gg/api/v1/analytics/tech-test/search?query=${searchTerm}`);
        const data = await response.json();     
        console.log('-----', page, limit);
        setsearchedPayouts(data);
        if(data && data.length){
          setPayouts(data.slice(0, limit));  
        }
        console.log('--- payouts', payouts)
        setTotalCount(data.length);  
       

      } else {
        setSearchDone(false);
        fetchData(1, 10);
      }
      setLoading(false);
     
    } catch (error) {     
      console.error('Error searching payouts:', error);
      setLoading(false);
    }
  };

  //Update the searchTerm on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  //Search payouts on Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === 'Enter') {
      // setPayouts([]);
      setPage(1);
      handleSearch();
    }
  };

  const handleSearch = () => {
    // setPayouts([]);
    setLoading(true);
    setPage(1);
    searchPayouts();
  }


  // Handles the Next and Previous buttons in the pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage); 
    if(searchTerm.trim() !== ''){
      setPayouts(searchedPayouts.slice(((newPage - 1) * limit), ((newPage - 1) * limit+limit)));  
    }
  };

  const handleReset = () => {
    setPage(1);
    setSearchTerm('');
    setPayouts([]);
    setsearchedPayouts([]);
    fetchData(1,10);
    setSearchDone(false);
  }
  

  return (
    <StyledPayoutsContainer>
      <h1>Payouts</h1>
      <div className="search">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search by username"
        />
        <button className="green" onClick={handleSearch}>Search</button>
        <button className="reset" onClick={handleReset}>Reset</button>
      </div>
      {
        loading ? <p>Loading...</p> : 
        <PayoutList
        payouts={payouts}
        searchDone={searchDone}
        searchedPayouts={searchedPayouts}
        page={page}
        limit={limit}
        totalCount={totalCount}
        handlePageChange={handlePageChange}
      />
      }       
    </StyledPayoutsContainer>
  )
}