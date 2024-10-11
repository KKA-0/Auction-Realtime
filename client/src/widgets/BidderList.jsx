import React from 'react';

const BidderList = ({ bidders }) => (
  <div style={{ width: '100%', height: '100px', overflowY: 'scroll' }}>
    {bidders.length > 0 ? (
      bidders.map((item, key) => (
        <div key={key} style={{
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey',
          border: '2px solid black',
        }}>
          <span>{item}</span>
        </div>
      ))
    ) : (
      <div style={{
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey',
        border: '2px solid black',
      }}>
        <span>No Bids yet</span>
      </div>
    )}
  </div>
);

export default BidderList;
