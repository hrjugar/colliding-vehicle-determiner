import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToVideosPage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/videos');
  }, [navigate]);
  
  return null;
};

export default RedirectToVideosPage;
