import { createSlice } from '@reduxjs/toolkit';

type Message = {
  message: {
    type: string;
    message: string;
    detail: string;
  } | null,
  open: boolean;
}

const initialState: Message = {
  message: {
    type: '',
    message: '',
    detail: '',
  },
  open: false,
}

const messageSlice = createSlice({
  name: 'message',
  initialState: initialState,
  reducers: {
    openMessageBox(state, action) {
      state.message = action.payload;
      state.open = true;
    },
    closeMessageBox(state) {
      state.open = false;
      state.message = null;
    }
  },
})

export const { openMessageBox, closeMessageBox } = messageSlice.actions;

export default messageSlice.reducer;