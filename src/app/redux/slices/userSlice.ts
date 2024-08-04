// store/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  responseMessage: string | null;
}

const initialState: UserState = {
  responseMessage: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setResponseMessage(state, action: PayloadAction<string | null>) {
      state.responseMessage = action.payload;
    },
  },
});

export const { setResponseMessage } = userSlice.actions;
export default userSlice.reducer;
