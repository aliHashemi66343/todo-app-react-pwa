import React, {useState,useEffect} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Item from "./Item";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios"; 

import Authenticate from "./Auth/Authenticate";
// import addNotification from "react-push-notification";
// import logo from "./images/checklist.png";

function Dashboard(props) {
    const [newItemTitle, setNewItemTitle] = useState("");
    // const [todoList, setTodoList] = useState([
    //   {id:1,body:"Get Bread",completed:false},
    //   {id:2,body:"Get jam",completed:true},
    // ]);
    const [todoList, setTodoList] = useState([]);
    const backend_host="localhost";
    const backend_port=1212;
    const [todoListSearch,setTodoListSearch]=useState([]);
    const [show, setShow] = useState(false);
    const [searchWord,setSearchWord] = useState("");
    const [user, setUser] = useState({});
    useEffect(()=>{
      const token=localStorage.getItem("jwtToken");

      console.log("token");
      console.log(token);
      const data_to_send={token:token};
      axios.post(`http://${backend_host}:${backend_port}/auth/check`,data_to_send).then((result)=>{
        if (result.data.userObj) {
          console.log("success");
          setUser(result.data.userObj);
          axios
            .get(
              `http://${backend_host}:${backend_port}/api/task/index/${result.data.userObj.id}`
            )
            .then((result) => {
              if (result.data.tasks !== undefined) {
                setTodoList([]);

                setTodoList([...result.data.tasks]);
                setTodoListSearch([...result.data.tasks]);
                console.log(todoList);
              }
            });
        }
        else{
          return
        }
      });
      console.log("before index");
      console.log(user);
      

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
    const do_login=(user)=>{
        setUser(user);
        setTodoList([]);
        axios
          .get(`http://${backend_host}:${backend_port}/api/task/index/${user.id}`)
          .then((result) => {
            if (result.data.tasks !== undefined) {
              setTodoList([...result.data.tasks]);
              console.log(todoList);
            }
          });
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
            `http://${backend_host}:${backend_port}/api/task/store/${user.id}`,
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
    const handleSignout = () => {
      localStorage.clear("jwtToken")

      setUser({});
      
    };

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
           .get(`http://${backend_host}:${backend_port}/api/task/index/${user.id}`)
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
    if (Object.keys( user).length!=0) {
  return (
    <div>
      
        <div>
        <div className="row" >
        <div className="col-6">
          <h1>{user.username}'s {props.name}</h1>
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
        <i className="fa fa-plus-circle"></i>
      </Button>
      <Button className="mt-4" variant="danger ms-3" onClick={handleSignout}>
        <i className="fa fa-sign-out"></i>
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
      
      
    </div>
  );
        }
        else{
          return(
          <Authenticate do_login={do_login} />
          );
        }
}

export default Dashboard;
