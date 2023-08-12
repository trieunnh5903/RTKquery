import {
  createAsyncThunk,
  createSelector,
  createSlice,
  isRejectedWithValue,
} from '@reduxjs/toolkit';
export const fetchSubjectRequest = createAsyncThunk(
  'subject/fetchSubjectRequest',
  async (arg, thunkAPI) => {
    try {
      const res = await fetch('/api/subjects');
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      return data.subjects;
    } catch (error) {
      console.log(error);
      return isRejectedWithValue(error.response.data);
    }
  },
);

export const addNewSubject = createAsyncThunk(
  'subject/addNewSubject',
  async arg => {
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.subject;
    } catch (error) {
      return isRejectedWithValue(error.response.data);
    }
  },
);

const subjectSlice = createSlice({
  name: 'subject',
  initialState: {
    subjects: [],
    status: 'idle',
    error: null,
  },

  extraReducers: builder => {
    builder
      .addCase(fetchSubjectRequest.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchSubjectRequest.fulfilled, (state, actions) => {
        state.status = 'fulfilled';
        state.subjects = [...actions.payload];
      })
      .addCase(fetchSubjectRequest.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message;
      });

    builder.addCase(addNewSubject.fulfilled, (state, action) => {
      // We can directly add the new post object to our posts array
      state.subjects.push(action.payload);
    });
  },
});

export default subjectSlice.reducer;
export const selectSubjectStatus = state => state.subject.status;
export const selectSubjectError = state => state.subject.error;

//sử dụng create seletor để tạo các selecter có thể ghi nhớ, logic sẽ không
// thực hiện lại trừ khi output trả ra từ input truyền vào thay đổi
export const selectAllSubjects = createSelector(
  state => state.subject.subjects,
  subjects => subjects.slice().sort((a, b) => a.name.localeCompare(b.name)),
);
