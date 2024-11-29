import React, { useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-root-toast";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
} from "react-native";

const App = () => {
  const [todoTask, setTodoTask] = useState("");
  const [todoTasks, setTodoTasks] = useState([]);
  const [index, setindex] = useState(-1);

  // add todoTask flow
  const handleAddtodoTask = async () => {
	// remove focus from input after add task button is clicked
    Keyboard.dismiss();
    try {
	  // expo local authentication check
      LocalAuthentication.authenticateAsync()
        .then((result) => {
          // bring back the screen to last state on click of cancel of authentication
          if (result.success === true) {
            if (todoTask) {
              // Edit existing todoTask
              if (index !== -1) {
                const updatedtodoTasks = [...todoTasks];
                updatedtodoTasks[index] = todoTask;
                setTodoTasks(updatedtodoTasks);
                Toast.show("todo Item updated successfully", {
                  duration: Toast.durations.LONG,
                });
              } else {
                // Add new todoTask
                setTodoTasks([...todoTasks, todoTask]);
                Toast.show("todo Item added successfully", {
                  duration: Toast.durations.LONG,
                });
              }
            } else {
			  //condition to delete a task if user remove all the letters from the update task and submit
              Toast.show("todo Item deleted successfully", {
                duration: Toast.durations.LONG,
              });
            }
			// reset the state
            setTodoTask("");
            setindex(-1);
          }
        })
        .catch((error) => {
          Toast.show("authentication failed", {
            duration: Toast.durations.LONG,
          });
        });
    } catch (error) {
      Toast.show(error, {
        duration: Toast.durations.LONG,
      });
    }
  };
  
  
  // Edit click todoTask
  const handleEdittodoTask = (index) => {
    const todoTaskToEdit = todoTasks[index];
    setTodoTask(todoTaskToEdit);
    setindex(index);
    if (!todoTask) {
      const updatedtodoTasks = [...todoTasks];
      updatedtodoTasks.splice(index, 1);
      setTodoTasks(updatedtodoTasks);
    }
  };
  
  
  // Delete task flow
    const handleDeletetodoTask = (index) => {
		LocalAuthentication.authenticateAsync().then(result => {
			if (result.success === true) {
				const updatedTasks = [...todoTasks];
				updatedTasks.splice(index, 1);
				setTodoTasks(updatedTasks);
				Toast.show('Task deleted successfully', {
				duration: Toast.durations.LONG,
				});
			}
		})
            .catch(error => {
              console.warn('Authentication Error: ', error)
            })
          
    };

  const renderItem = ({ item, index }) => (
    <View testID="itemsTodo" style={styles.todoItems}>
      <Text  testID="itemListTodo" style={styles.itemList}>{item}</Text>
      <View style={styles.todoItemsButtons}>
        <TouchableOpacity
          testID="updateButton"
          onPress={() => handleEdittodoTask(index)}
        >
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="deleteButton"
          onPress={() => handleDeletetodoTask(index)}
        >
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <RootSiblingParent>
      <View style={styles.container}>
        <Text style={styles.heading}>Sunny's</Text>
        <Text style={styles.title}>ToDo Application</Text>
        <TextInput
          testID="textInput"
          style={styles.input}
          placeholder="Enter todo Task"
          value={todoTask}
          onChangeText={(text) => setTodoTask(text)}
        />
        <TouchableOpacity
          testID="addTask"
          style={
            !todoTask && index === -1
              ? styles.addButtonDisabled
              : styles.addButton
          }
          onPress={handleAddtodoTask}
          disabled={!todoTask && index === -1}
        >
          <Text style={styles.addButtonText}>
            {index !== -1 ? "Update todo Task" : "Add todo Task"}
          </Text>
        </TouchableOpacity>
        <FlatList
          testID="todoTaskList"
          data={todoTasks}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        ></FlatList>
      </View>
    </RootSiblingParent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
	textAlign: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 7,
    color: "green",
	textAlign: "center",
  },
  input: {
    borderWidth: 3,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  addButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonDisabled: {
    backgroundColor: "#dddddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  todoItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    fontSize: 18,
  },
  itemList: {
    fontSize: 19,
    flexShrink: 1,
    marginRight: 3,
  },
  todoItemsButtons: {
    flexDirection: "row",
  },
  editButton: {
    marginRight: 10,
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default App;
