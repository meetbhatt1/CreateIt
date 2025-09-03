import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../utils/API';

const API_BASE_URL = `${API}/auth`;

// Existing login action
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, userData);

            const { token, user, message } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userId', user._id);
            }

            return { token, user, message };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);


// New OTP verification action
export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp });
            if (response.data) {
                console.log(response?.data);
                localStorage.setItem('token', response?.data?.token);
                localStorage.setItem('user', JSON.stringify(response?.data?.user));
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
        }
    }
);

// New resend OTP action
export const resendOTP = createAsyncThunk(
    'auth/resendOTP',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/send-otp`, { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to resend OTP');
        }
    }
);

// Google auth success handler (called from callback)
export const handleGoogleCallback = createAsyncThunk(
    'auth/handleGoogleCallback',
    async (callbackData, { rejectWithValue }) => {
        try {
            // This will be called when user returns from Google OAuth
            const { token, user, isNewUser } = callbackData;

            if (token) {
                localStorage.setItem('token', token);
            }

            return { token, user, isNewUser };
        } catch (error) {
            return rejectWithValue('Google authentication failed: ', error);
        }
    }
);

// Complete profile after Google signup
export const completeGoogleProfile = createAsyncThunk(
    'auth/completeGoogleProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_BASE_URL}/signup`,  // Using signup API as requested
                profileData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Profile completion failed');
        }
    }
);

const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedToken,
    isLoading: false,
    error: null,
    otpSent: false,
    otpVerified: false,
    isGoogleUser: false,
    needsProfileCompletion: false,
    googleUserData: null
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.otpSent = false;
            state.otpVerified = false;
            state.isGoogleUser = false;
            state.needsProfileCompletion = false;
            state.googleUserData = null;

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
        },
        resetOtpState: (state) => {
            state.otpSent = false;
            state.otpVerified = false;
        },
        setGoogleUserData: (state, action) => {
            state.googleUserData = action.payload;
            state.isGoogleUser = true;
            state.needsProfileCompletion = action.payload.isNewUser;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            // OTP verification cases
            .addCase(verifyOTP.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.isLoading = false;
                state.otpVerified = true;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.otpVerified = false;
            })

            // Resend OTP cases
            .addCase(resendOTP.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resendOTP.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(resendOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Google callback cases
            .addCase(handleGoogleCallback.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(handleGoogleCallback.fulfilled, (state, action) => {
                state.isLoading = false;
                const { user, isNewUser } = action.payload;

                if (isNewUser) {
                    // New user needs to complete profile
                    state.needsProfileCompletion = true;
                    state.googleUserData = user;
                    state.isGoogleUser = true;
                } else {
                    // Existing user, log them in
                    state.user = user;
                    state.isAuthenticated = true;
                }
                state.error = null;
            })
            .addCase(handleGoogleCallback.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            // Complete Google profile cases
            .addCase(completeGoogleProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(completeGoogleProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.needsProfileCompletion = false;
                state.googleUserData = null;
                state.error = null;
            })
            .addCase(completeGoogleProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, logout, resetOtpState, setGoogleUserData } = authSlice.actions;
export default authSlice.reducer;