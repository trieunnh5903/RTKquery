import {createSelector} from '@reduxjs/toolkit';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

/*
auto refresh cache: thay đổi dựa theo tag
tagTypes: tên tag gốc
providesTags: tên tag gốc, có thể thêm id để refresh theo id
invalidTags: tag sẽ được refresh khi mutations chạy;
*/
export const subjectApi = createApi({
  reducerPath: 'subjectApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['Subject'],
  endpoints: builder => ({
    getAllSubjects: builder.query({
      query: () => '/subjects',
      providesTags: (result = [], error, arg) => {
        result = result.subjects;
        return ['Subject', ...result.map(({id}) => ({type: 'Subject', id}))];
      },
      // thời gian dữ liệu lưu trong cache nếu không có subciptions nào, đơn vị là miliseconds default 60s
      keepUnusedDataFor: 60 * 1000,
    }),

    getSubjectById: builder.query({
      query: id => `/subjects/${id}`,
      providesTags: (result, error, arg) => [{type: 'Subject', id: arg}],
    }),

    deleteSubject: builder.mutation({
      query: id => ({
        url: `/subjects/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: (result, error, arg) => [{type: 'Subject', id: arg}],
    }),

    addNewSubject: builder.mutation({
      query: initialPost => ({
        url: '/subjects',
        method: 'POST',
        body: initialPost,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }),
      invalidatesTags: ['Subject'],
    }),

    editSubject: builder.mutation({
      query: subject => ({
        url: `/subject/${subject.id}`,
        method: 'PUT',
        body: subject,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }),
      invalidatesTags: (result, error, arg) => {
        console.log(arg);
        return [{type: 'Subject', id: arg.id}];
      },
    }),
  }),
});

export const {
  useEditSubjectMutation,
  useGetAllSubjectsQuery,
  useGetSubjectByIdQuery,
  useDeleteSubjectMutation,
  useAddNewSubjectMutation,
} = subjectApi;

const selectAllSubjectResult = subjectApi.endpoints.getAllSubjects.select();

export const selectAllSubjects = createSelector(
  selectAllSubjectResult,
  usersResult => usersResult?.data ?? [],
);
