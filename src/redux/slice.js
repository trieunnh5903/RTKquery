import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
// lấy toàn bộ danh sách
//arg: đối số truyền vào
//thunk
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
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

//thêm một môn học
export const addNewSubject = createAsyncThunk(
  'subject/addNewSubject',
  async (arg, {rejectWithValue}) => {
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
      return rejectWithValue(error.response.data);
    }
  },
);

//EntityAdapter
const subjectAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = subjectAdapter.getInitialState({
  status: 'idle',
  error: null,
});
//

const subjectSlice = createSlice({
  name: 'subject',
  // initialState: {
  //   subjects: [],
  //   status: 'idle',
  //   error: null,
  // },
  initialState,
  reducers: {
    updateSubject: (state, action) => {
      const {id, name} = action.payload;
      const exsitingSubject = state.entities[id];
      if (exsitingSubject) {
        exsitingSubject.name = name;
      }
    },

    deleteSubject: (state, action) => {
      const id = action.payload;
      const exsitingSubject = state.entities[id];
      if (exsitingSubject) {
        subjectAdapter.removeOne(state, id);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSubjectRequest.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchSubjectRequest.fulfilled, (state, actions) => {
        state.status = 'fulfilled';
        subjectAdapter.upsertMany(state, actions.payload);
        console.log(actions.payload);
        // state.subjects = [...actions.payload];
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

export const {
  selectAll: selectAllSubjects,
  selectById: selectSubjectById,
  selectIds: selectSubjectIds,
} = subjectAdapter.getSelectors(state => state.subject);
export default subjectSlice.reducer;
export const selectSubjectStatus = state => state.subject.status;
export const selectSubjectError = state => state.subject.error;
export const {updateSubject, deleteSubject} = subjectSlice.actions;
//sử dụng create seletor để tạo các selecter có thể ghi nhớ, logic sẽ không
// thực hiện lại trừ khi output trả ra từ input truyền vào thay đổi
// export const selectAllSubjects = createSelector(
//   state => state.subject.subjects,
//   subjects => subjects.slice().sort((a, b) => a.name.localeCompare(b.name)),
// );
