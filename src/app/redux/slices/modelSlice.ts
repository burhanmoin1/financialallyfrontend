// modelSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModelState } from '@/app/types/common';

const initialState: ModelState = {
  selectedModel: '',
};

const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    setSelectedModel(state, action: PayloadAction<string>) {
      state.selectedModel = action.payload;
    },
  },
});

export const { setSelectedModel } = modelSlice.actions;
export default modelSlice.reducer;