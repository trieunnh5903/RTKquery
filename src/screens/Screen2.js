/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  addNewSubject,
  fetchSubjectRequest,
  selectAllSubjects,
  selectSubjectError,
  selectSubjectStatus,
} from '../redux/slice';

const Screen2 = () => {
  const dispatch = useDispatch();
  const subjects = useSelector(selectAllSubjects);
  const [name, setName] = useState('');
  const subjectStatus = useSelector(selectSubjectStatus);
  const error = useSelector(selectSubjectError);
  //su dụng trạng thái để fetch chỉ 1 lần
  useEffect(() => {
    if (subjectStatus === 'idle') {
      dispatch(fetchSubjectRequest());
    }
  }, [dispatch, subjectStatus]);

  let content;

  if (subjectStatus === 'loading') {
    content = <Text>Loading...</Text>;
  } else if (subjectStatus === 'fulfilled') {
    content = subjects.map(subject => (
      <View
        key={subject.id}
        style={{padding: 8, flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{flex: 1, color: 'black', padding: 8}}>
          {subject.name}
        </Text>
        <TouchableOpacity
          // onPress={() => onDeletePress(subject.id)}
          style={{backgroundColor: 'red'}}>
          <Text style={{color: 'white', padding: 8}}>DELETE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          // onPress={() => onEditPress(subject)}
          style={{backgroundColor: 'cyan'}}>
          <Text style={{padding: 8}}>EDIT</Text>
        </TouchableOpacity>
      </View>
    ));
  } else if (subjectStatus === 'failed') {
    content = <Text>{error}</Text>;
  }

  const onSubmitPress = async () => {
    try {
      if (name) {
        Keyboard.dismiss();
        await dispatch(addNewSubject({name})).unwrap();
        setName('');
      }
    } catch (e) {
      console.error('Failed to save the post: ', e);
    }
  };
  return (
    <View style={{padding: 24}}>
      <Text>Name:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{borderWidth: 1, borderRadius: 10}}
      />
      <TouchableOpacity onPress={onSubmitPress} style={styles.btnSubmit}>
        <Text style={{color: 'white'}}>Submit</Text>
      </TouchableOpacity>
      <Text style={{color: 'black', fontSize: 20, marginTop: 20}}>
        All subjects
      </Text>
      {content}
    </View>
  );
};

export default Screen2;
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
