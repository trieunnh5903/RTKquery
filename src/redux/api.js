import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const subjectApi = createApi({
  reducerPath: 'subjectApi',
  baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  tagTypes: ['Subject'],
  endpoints: builder => ({
    getAllSubjects: builder.query({
      query: () => '/subjects',
      providesTags: ['Subject'],
    }),

    getSubjectById: builder.query({
      query: id => `/subjects/${id}`,
    }),

    deleteSubject: builder.mutation({
      query: id => ({
        url: `/subjects/${id}`,
        method: 'DELETE',
        credentials: 'include',
        // Include the entire post object as the body of the request
      }),
      invalidatesTags: ['Subject'],
    }),

    addNewSubject: builder.mutation({
      query: initialPost => ({
        url: '/subjects',
        method: 'POST',
        // Include the entire post object as the body of the request
        body: initialPost,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }),
      invalidatesTags: ['Subject'],
    }),

    // editSubject: builder.mutation({
    //     query: subject => ({
    //         url: `/subject/${subject.id}`,
    //         method: 'PUT',
    //         body: subject
    //     })
    // })
  }),
});

export const {
  // useEditSubjectMutation,
  useGetAllSubjectsQuery,
  useGetSubjectByIdQuery,
  useDeleteSubjectMutation,
  useAddNewSubjectMutation,
} = subjectApi;
