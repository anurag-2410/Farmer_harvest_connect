import React, { useState } from 'react';


const LicenseForm = () => {
  const [licenseCode, setLicenseCode] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch('http://localhost:4000/verifyLicense', {
      method: 'POST',
      body: JSON.stringify({ licenseCode }),
    });
    const data = await res.json();
    if (data.message === 'Valid license') {
      // Redirect to next page
    } else {
      alert(data.message); // Display error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={licenseCode}
        onChange={(e) => setLicenseCode(e.target.value)}
        placeholder="Enter license code"
      />
      <button type="submit">Verify License</button>
    </form>
  );
};

export default LicenseForm;
