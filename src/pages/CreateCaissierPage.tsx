import React from 'react';
import CreateCaissierForm from '../components/CreateCaissierForm';

const CreateCaissierPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <CreateCaissierForm />
    </div>
  );
};

export default CreateCaissierPage;
