import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
export const fetchPostRequest = createAsyncThunk(
    "post/fetchPostRequest",
    async (arg, thunkAPI) => {
        try {
            const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
            const data = await res.json();
            return data;
        } catch (error) {
            return isRejectedWithValue(error.response.data)
        }

    }
)


const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: {},
        isLoading: false,
        error: null
    },

    reducers: {
        fetchPostsPending: (state, payload) => {
            state.isLoading = true;
        },

        fetchPostsFullfiled: (state, payload) => {
            state.posts = payload.posts;
        },
    },


    extraReducers: (builder) => {
        builder.addCase(fetchPostRequest.fulfilled, (state, actions) => {
            state.posts = { ...actions.payload };
        })
    }
})

export default postSlice.reducer;
export const { fetchPostsPending, fetchPostsFullfiled } = postSlice.actions;