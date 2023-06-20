import { createSlice } from '@reduxjs/toolkit';

const testSlice = createSlice({
    name: 'testSlice',
    initialState: {
        count: 1,
    },
    reducers: {
        increaseCount(state, action) {
            state.count += 1;
        },
        decreaseCount(state, action) {
            state.count -= 1;
        }
    }
});

export const { increaseCount, decreaseCount } = testSlice.actions;

export default testSlice.reducer;
