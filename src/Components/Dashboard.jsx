import React, {useState,useEffect} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Item from "./Item";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
// import addNotification from "react-push-notification";
// import logo from "./images/checklist.png";

function Dashboard(props) {
    const [newItemTitle, setNewItemTitle] = useState("");
    // const [todoList, setTodoList] = useState([
    //   {id:1,body:"Get Bread",completed:false},
    //   {id:2,body:"Get jam",completed:true},
    // ]);
    const [todoList, setTodoList] = useState([]);
    const backend_host="172.20.10.5";
    const backend_port=1212;
    const [todoListSearch,setTodoListSearch]=useState([]);
    const [show, setShow] = useState(false);
    const [searchWord,setSearchWord] = useState("");
    useEffect(()=>{
      
      axios
        .get(
          `http://${backend_host}:${backend_port}/api/task/index`
        )
        .then((result) => {
          if (result.data.tasks !== undefined) {

            setTodoList([]);


            setTodoList( [...result.data.tasks]);
            setTodoListSearch([...result.data.tasks]);
            console.log(todoList);
          }
        });

        // todoList.forEach((element) => {
        //   addNotification({
        //     title: element.body,
        //     icon:logo,
            
        //   });
        // });

    },[]);

    // Methods
    const handleClose = () => setShow(false);
    const storeTaskByEnter=(event)=>{
      if (event.key === "Enter") {
        handleAddWorkAndClose();
      }
    }
    const handleAddWorkAndClose = () => {
      
      if (newItemTitle) {
        console.log();
        const new_todo_obj={body:newItemTitle,completed:false}
        // console.log([...todoList, new_todo_obj]);
        setTodoList([...todoList,new_todo_obj])
        const data_to_store = { body: newItemTitle };
        axios
          .post(
            `http://${backend_host}:${backend_port}/api/task/store`,
            data_to_store,
            {
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Accept: "application/json",
              },
              withCredentials: false,
              
            }
          )
          .then((result) => console.log(result));
      }
      setShow(false)
    };

    const handleShow = () => setShow(true);
    const findTodoById = (id)=>{
      todoList.map(
        (todo)=>{
          if (todo.id===id) {
            return todo;
          }
        }
      )
    }
    const markCompleted = (id)=>{
      console.log("in parent");
      var items=todoList.map((item)=>{
        if (item.id===id) {
          return {
            id: item.id,
            body: item.body,
            completed: !item.completed,
            date: item.date,
            time: item.time,
            priority: item.priority,
            note: item.note,
          };
        }
        else{
          return {
            id: item.id,
            body: item.body,
            completed: item.completed,
            date: item.date,
            time: item.time,
            priority: item.priority,
            note: item.note,
          };

        }

      });
      console.log("items");
      console.log(items);
      setTodoList(items);
      axios
        .get(
          `http://${backend_host}:${backend_port}/api/task/toggleCompleted/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Accept: "application/json",
            },
            withCredentials: false,
          }
        )
        .then((result) => console.log(result));
    }

    const search=(search_word)=>{
      setSearchWord(search_word)
      if (search_word.length==0) {
        setTodoList([]);
         axios
           .get(`http://${backend_host}:${backend_port}/api/task/index`)
           .then((result) => {
            
             if (result.data.tasks !== undefined) {
               setTodoList([...result.data.tasks]);
               console.log(todoList);
             }
           });
      }
      
      const result_todoList = todoListSearch.filter((todo) =>
        todo.body.toLowerCase().includes(search_word.toLowerCase())
      );
      
      setTodoList(result_todoList);
      
    }

    const deleteTask = (id) => {
      console.log("in parent");
      //delete a member from a json list
      var items = todoList.filter((item) => {
          return item.id !== id;
      });
      console.log("items");
      console.log(items);
      setTodoList(items);
      axios
        .get(
          `http://${backend_host}:${backend_port}/api/task/delete/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Accept: "application/json",
            },
            withCredentials: false,
          }
        )
        .then((result) => console.log(result));
    };
    const editDate = (id,newDate) => {
      console.log("date");
      console.log(newDate);
      var items = todoList.map((item) => {
        if (item.id === id) {
          return {
            id: item.id,
            body: item.body,
            completed: item.completed,
            date: newDate,
            time: item.time,
            priority: item.priority,
            note: item.note,
          };
        } else {
          return {
            id: item.id,
            body: item.body,
            completed: item.completed,
            date: item.date,
            time: item.time,
            priority: item.priority,
            note: item.note,
          };

        }
      });
      setTodoList(items);
      const data_to_update={date:newDate};
      axios
        .post(
          `http://${backend_host}:${backend_port}/api/task/update/${id}`,
          data_to_update,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Accept: "application/json",
            },
            withCredentials: false,
          }
        )
        .then((result) => console.log(result));

    };
    const editBody = (id,newBody) => {
      var items = todoList.map((item) => {
        if (item.id === id) {
          return {
            id: item.id,
            body: newBody,
            completed: item.completed,
            date: item.date,
            time: item.time,
            note: item.note,
          };
        } else {
          return {
            id: item.id,
            body: item.body,
            completed: item.completed,
            date: item.date,
            time: item.time,
            note: item.note,
          };
        }
      });
      setTodoList(items);
      const data_to_update={body:newBody};
      axios
        .post(
          `http://${backend_host}:${backend_port}/api/task/update/${id}`,
          data_to_update,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Accept: "application/json",
            },
            withCredentials: false,
          }
        )
        .then((result) => console.log(result));

    };
    
    const editNote = (id,newNote) => {
      var items = todoList.map((item) => {
        if (item.id === id) {
          return {
            id: item.id,
            body: item.body,
            completed: item.completed,
            date: item.date,
            time: item.time,
            note: newNote,
          };
        } else {
          return {
            id: item.id,
            body: item.body,
            completed: item.completed,
            date: item.date,
            time: item.time,
            note: item.note,
          };
        }
      });
      setTodoList(items);
      const data_to_update={note:newNote};
      axios
        .post(
          `http://${backend_host}:${backend_port}/api/task/update/${id}`,
          data_to_update,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Accept: "application/json",
            },
            withCredentials: false,
          }
        )
        .then((result) => console.log(result));

    };
    const editTime = (id, newTime) => {
      console.log("in parent");
      var items = todoList.map((item) => {
        if (item.id === id) {
          return {
            id: item.id,
            body: item.body,
            completed: item.completed,
            date: item.date,
            time: newTime,
            priority: item.priority,
            note: item.note,
          };
        } else {
          return {
            id: item.id,
            body: item.body,
            completed: item.completed,
            date: item.date,
            time: item.time,
            priority: item.priority,
            note: item.note,
          };
        }
      });
      setTodoList(items);
      const data_to_update = { time: newTime };
      axios
        .post(
          `http://${backend_host}:${backend_port}/api/task/update/${id}`,
          data_to_update,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Accept: "application/json",
            },
            withCredentials: false,
          }
        )
        .then((result) => console.log(result));
    };
    const editPriority = (id, newPriority) => {
      console.log("in parent");
      var items = todoList.map((item) => {
        if (item.id === id) {
          return {
            id: item.id,
            body: item.body,
            completed: item.completed,
            date: item.date,
            time: item.time,
            priority: newPriority,
            note: item.note,
          };
        } else {
          return {
            id: item.id,
            body: item.body,
            completed: item.completed,
            date: item.date,
            time: item.time,
            priority: item.priority,
            note: item.note,
          };
        }
      });
      setTodoList(items);
      const data_to_update = { priority: newPriority };
      axios
        .post(
          `http://${backend_host}:${backend_port}/api/task/update/${id}`,
          data_to_update,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Accept: "application/json",
            },
            withCredentials: false,
          }
        )
        .then((result) => console.log(result));
    };
    // Methods End
  return (
    <div>
      <div className="row" >
        <div className="col-6">
          <h1>{props.name}</h1>
        </div>
        <div className="col-6 text-end mt-2">
          <input
        type="searchbox"
        className="w-75"
        placeholder="Search in Tasks"
        onChange={(event) => search(event.target.value)}
      />
      </div>
      </div>
      
      

      <div id="not-completed">
        <h2 className="text-info">
          Tasks <i className="fa fa-tasks"></i>{" "}
        </h2>
        <ListGroup>
          {todoList.map((todo) => {
            if (!todo.completed) {
              return (
                <ListGroup.Item
                  key={todo.id}
                  className="mb-2"
                  variant="secondary"
                >
                  <Item
                    todo={todo}
                    markAsCompleted={markCompleted}
                    searchWord={searchWord}
                    editBody={editBody}
                    editNote={editNote}
                    editDate={editDate}
                    editTime={editTime}
                    editPriority={editPriority}
                    deleteTask={deleteTask}
                  />
                </ListGroup.Item>
              );
            }
          })}
        </ListGroup>
      </div>
      <hr />
      <div className="text-left" id="completed">
        <h2 className="text-success">
          Completed <i className="fa fa-check"></i>
        </h2>
        <ListGroup>
          {todoList.map((todo, index) => {
            if (todo.completed) {
              return (
                <ListGroup.Item
                  key={todo.id}
                  className="mb-2"
                  variant="success"
                >
                  <Item
                    todo={todo}
                    markAsCompleted={markCompleted}
                    editBody={editBody}
                    editNote={editNote}
                    editDate={editDate}
                    editTime={editTime}
                    searchWord={searchWord}
                    deleteTask={deleteTask}
                  />
                </ListGroup.Item>
              );
            }
          })}
        </ListGroup>
      </div>

      <Button className="mt-4" variant="success" onClick={handleShow}>
        Add Work
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Work Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                onChange={(event) => setNewItemTitle(event.target.value)}
                onKeyUp={storeTaskByEnter}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddWorkAndClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Dashboard;
