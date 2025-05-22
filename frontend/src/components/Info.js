import axios from 'axios';
import { useState } from 'react';

function Info() {
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');

  const fetchInfo = async () => {
    try {
      const res = await axios.post('http://localhost:5000/info', { name });
      setInfo(res.data.info);
    } catch (err) {
      setInfo('Failed to fetch disease info.');
    }
  };

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter disease name"
      />
      <button onClick={fetchInfo}>Get Info</button>
      <div style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>{info}</div>
    </div>
  );
}

export default Info;
