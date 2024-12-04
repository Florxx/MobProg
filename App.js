import React, { useState } from "react";
import { View, FlatList, Text, TouchableOpacity, Alert } from "react-native";
import { Provider as PaperProvider, TextInput as PaperInput, Dialog, Portal, Button } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Add a new student with validation
  const addStudent = () => {
    if (!studentName.trim() || !email.trim() || !idNumber.trim()) {
      setErrorMessage("All fields are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    setStudents([
      ...students,
      { id: Date.now().toString(), name: studentName, email, idNumber },
    ]);
    resetDialog();
  };

  // Edit an existing student
  const editStudent = (id, name, email, idNumber) => {
    setSelectedStudent({ id, name, email, idNumber });
    setStudentName(name);
    setEmail(email);
    setIdNumber(idNumber);
    setDialogVisible(true);
  };

  // Save updated student with validation
  const saveUpdatedStudent = () => {
    if (!studentName.trim() || !email.trim() || !idNumber.trim()) {
      setErrorMessage("All fields are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    setStudents(
      students.map(student =>
        student.id === selectedStudent.id
          ? { ...student, name: studentName, email, idNumber }
          : student
      )
    );
    resetDialog();
  };

  // Delete a student
  const deleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  // Reset dialog inputs and state
  const resetDialog = () => {
    setStudentName('');
    setEmail('');
    setIdNumber('');
    setErrorMessage('');
    setDialogVisible(false);
    setSelectedStudent(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Button mode="contained" onPress={() => setDialogVisible(true)}>
        Add Student
      </Button>

      <FlatList
        data={students}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", marginBottom: 10, alignItems: "center" }}>
            <Text style={{ flex: 1 }}>
              {item.name} - {item.email} - {item.idNumber}
            </Text>
            <TouchableOpacity onPress={() => editStudent(item.id, item.name, item.email, item.idNumber)}>
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteStudent(item.id)} style={{ marginLeft: 10 }}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />

      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={resetDialog}>
          <Dialog.Title>{selectedStudent ? "Edit Student" : "Add Student"}</Dialog.Title>
          <Dialog.Content>
            {errorMessage ? (
              <Text style={{ color: "red", marginBottom: 10 }}>{errorMessage}</Text>
            ) : null}
            <PaperInput
              label="Student Name"
              value={studentName}
              onChangeText={setStudentName}
              style={{ marginBottom: 10 }}
            />
            <PaperInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={{ marginBottom: 10 }}
            />
            <PaperInput
              label="ID Number"
              value={idNumber}
              onChangeText={setIdNumber}
              keyboardType="numeric"
              style={{ marginBottom: 10 }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={selectedStudent ? saveUpdatedStudent : addStudent}>
              {selectedStudent ? "Save" : "Add"}
            </Button>
            <Button onPress={resetDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}