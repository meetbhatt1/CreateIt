import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleGoogleCallback } from '../redux/AuthSlice';

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const token = searchParams.get('token');
        const userData = searchParams.get('user');
        const isNewUser = searchParams.get('isNewUser') === 'true';
        const error = searchParams.get('error');

        if (error) {
          console.error('Google auth error:', error);
          navigate('/auth?error=' + encodeURIComponent(error));
          return;
        }

        if (token && userData) {
          const user = JSON.parse(decodeURIComponent(userData));
          
          // Dispatch the callback action
          const result = await dispatch(handleGoogleCallback({
            token,
            user,
            isNewUser
          }));

          if (handleGoogleCallback.fulfilled.match(result)) {
            if (isNewUser) {
              // New user needs to complete profile
              navigate('/update-profile');
            } else {
              // Existing user, redirect to dashboard
              navigate('/dashboard');
            }
          } else {
            // Error occurred
            navigate('/auth?error=' + encodeURIComponent(result.payload));
          }
        } else {
          navigate('/auth?error=' + encodeURIComponent('Invalid callback data'));
        }
      } catch (error) {
        console.error('Callback handling error:', error);
        navigate('/auth?error=' + encodeURIComponent('Authentication failed'));
      }
    };

    handleCallback();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="animate-spin text-6xl mb-4">🔄</div>
        <h2 className="text-2xl font-bold text-purple-600 mb-2">
          Processing your login...
        </h2>
        <p className="text-gray-600">
          Please wait while we complete your authentication.
        </p>
        <div className="mt-6">
          <div className="animate-pulse bg-purple-200 h-2 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;