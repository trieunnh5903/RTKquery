/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import {
  useAddNewSubjectMutation,
  useDeleteSubjectMutation,
  useEditSubjectMutation,
  useGetAllSubjectsQuery,
} from './src/redux/api';
import { store } from './src/redux/store';
import { setUpServer } from './src/redux/fakeApi/mock_api';

if (window.server) {
  server.shutdown();
}

window.server = setUpServer();

const App = () => {
  return (
    <Provider store={store}>
      <AppComponent />
    </Provider>
  );
};

const AppComponent = () => {
  const { data, isFetching, isSuccess, isError, error } =
    useGetAllSubjectsQuery();
  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [addNewSubject] = useAddNewSubjectMutation();
  const [deleteSubject] = useDeleteSubjectMutation();
  const [editSubject] = useEditSubjectMutation();
  const [isEditing, setIsEditing] = useState(false);
  // handle delete subject mutation
  const onDeletePress = (subjectId) => {
    deleteSubject(subjectId);
  };

  const onEditPress = (subject) => {
    setId(subject.id);
    setName(subject.name);
    setIsEditing(true);
  };

  // render the subject
  let content;
  if (isFetching) {
    content = <ActivityIndicator size={'small'} />;
  } else if (isSuccess) {
    content = data.subjects.map(subject => (
      <View
        key={subject.id}
        style={{ padding: 8, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flex: 1, color: 'black', padding: 8 }}>
          ID: {subject.id} - Name:{subject.name}
        </Text>
        <TouchableOpacity onPress={() => onDeletePress(subject.id)} style={{ backgroundColor: 'red' }}>
          <Text style={{ color: 'white', padding: 8 }}>DELETE</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEditPress(subject)} style={{ backgroundColor: 'cyan' }}>
          <Text style={{ padding: 8 }}>EDIT</Text>
        </TouchableOpacity>
      </View>
    ));
  } else if (isError) {
    content = <Text>{error.toString()}</Text>;
  }

  //handle click add button
  const onSubmtPress = async () => {
    if (id && name && !isEditing) {
      try {
        await addNewSubject({ id, name }).unwrap();
        setId('');
        setName('');
        console.log('addNewSubject success');
      } catch (e) {
        console.log(e.message);
      }
    } else {
      try {
        await editSubject({ id, name }).unwrap();
        setId('');
        setName('');
        setIsEditing(false);
      } catch (e) {
        console.log(e);
      }
    }
    Keyboard.dismiss();
  };
  return (
    <View style={{ padding: 24 }}>
      <Text>ID:</Text>
      <TextInput
        value={id}
        onChangeText={setId}
        style={{ borderWidth: 1, borderRadius: 10 }}
      />
      <Text>Name:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, borderRadius: 10 }}
      />
      <TouchableOpacity onPress={onSubmtPress} style={styles.btnSubmit}>
        <Text style={{ color: 'white' }}>Submit</Text>
      </TouchableOpacity>
      <Text style={{ color: 'black', fontSize: 20, marginTop: 20 }}>
        All subjects
      </Text>
      {content}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  btnSubmit: {
    height: 50,
    marginTop: 10,
    width: '100%',
    backgroundColor: 'violet',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
