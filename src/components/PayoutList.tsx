import React from 'react';

interface Payout {
  id: number;
  dateAndTime: string;
  status: string;
  value: string;
  username: string;
}

interface PayoutListProps {
  payouts: Payout[];
  searchedPayouts: Payout[];
  page: number;
  limit: number;
  totalCount: number;
  searchDone: boolean;
  handlePageChange: (newPage: number) => void;
}

const PayoutList: React.FC<PayoutListProps> = ({
  payouts,
  searchedPayouts,
  page,
  limit,
  totalCount,
  searchDone,
  handlePageChange,
}) => {
  console.log('---payouts', payouts, searchedPayouts);
  if (searchDone && searchedPayouts.length === 0) {
    return (
      <>
        <p>No Data found.</p>
      </>
    );
  } else {
    return (
      <>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout, index) => (
              <tr key={`${payout.id}-${index}`}>
                <td>{payout.username ? (payout.username).trim() : null}</td>
                <td>{payout.dateAndTime ? new Date(payout.dateAndTime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }).trim() : null}</td>
                <td>
                  {
                    payout.status ? 
                    <span className={`status-badge status-${payout.status.toLowerCase()}`}>{(payout.status).trim()}</span> : 
                    null
                  }
                  
                </td>
                <td>{payout.value ? (payout.value).trim() : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button className='green' onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>
          <span>{`Page ${page} of ${Math.ceil(totalCount / limit)}`}</span>
          <button className='green' onClick={() => handlePageChange(page + 1)} disabled={page * limit >= totalCount}>Next</button>
        </div>
      </>
      
    )
  
  }
};

export default PayoutList;