import React, { useState, useRef } from "react";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import Form from "react-bootstrap/Form";
import Highlighted from "./Highlighted";
function Item(props) {
  const [showToolTip, setShowToolTip] = useState(false);
  const [showNoteToolTip, setShowNoteToolTip] = useState(false);
  const [onEditMode, setOnEditMode] = useState(false);
  const [onEditNoteMode, setOnEditNoteMode] = useState(false);
  const [todo, setTodo] = useState(props.todo);

  const target = useRef(null);
  const noteRef = useRef(null);
  const radioInput = useRef(null);

  const task_time_passed = (task_time) => {
    var lastVisit = new Date(task_time);

    // var thirtyMinutes = 30 * 60000; // 60000 being the number of milliseconds in a minute
    var now = new Date();
    // var thirtyMinutesAgo = new Date(now - lastVisit);

    if (lastVisit < now) return true;
    else return false;
  };
  //for assigning ref in react we should define it with useRef and then insert it in ref attribute of element
  const editBody = (id, updateValue) => {
    setTodo({ ...todo, body: updateValue });
    props.editBody(id, updateValue);
  };
  const editNote = (id, updateValue) => {
    setTodo({ ...todo, note: updateValue });
    props.editNote(id, updateValue);
  };
  const editDate = (id, updateValue) => {
    setTodo({ ...todo, date: updateValue });
    props.editDate(id, updateValue);
  };
  const editTime = (id, updateValue) => {
    setTodo({ ...todo, time: updateValue });
    props.editTime(id, updateValue);
  };
  const editPriority = (id, updateValue) => {
    setTodo({ ...todo, priority: updateValue });
    props.editPriority(id, updateValue);
  };
  const markAsCompleted = (id) => {
    props.markAsCompleted(id);
    //we pass the method as props of component in parent element
    radioInput.current.checked = !todo.completed;
    // setTodo({  ...todo, completed: !todo.completed });
  };

  const deleteTask = (id) => {
    props.deleteTask(id);
  };
  return (
    <div>
      <div className="row">
        <div className="col-8" onDoubleClick={() => setOnEditMode(true)}>
          <div className="row">
            <div className="col-1">
              <input
                ref={radioInput}
                //assign predefined ref to element so we can use its attribute
                type="radio"
                className="me-2"
                checked={todo.completed}
                onClick={() => markAsCompleted(todo.id)}
                onChange={() => {}}
                // onClick is correct event for radio input
              />
            </div>

            <div className="col-11">
              <div style={{ fontWeight: "bold" }}>
                <span
                  className={`${
                    todo.priority == 1
                      ? "text-success"
                      : todo.priority == 2
                      ? "text-warning"
                      : todo.priority == 3
                      ? "text-danger"
                      : ""
                  } me-3`}
                >
                  {todo.priority == 1
                    ? "!"
                    : todo.priority == 2
                    ? "!!"
                    : todo.priority == 3
                    ? "!!!"
                    : ""}
                </span>
                {!onEditMode ? (
                  <Highlighted text={todo.body} highlight={props.searchWord} />
                ) : (
                  <Form.Control
                    type="text"
                    name="title"
                    value={todo.body}
                    onChange={(event) => editBody(todo.id, event.target.value)}
                    //   onChange={(event) => setNewItemTitle(event.target.value)}
                  />
                )}
              </div>
              {todo.time && todo.date ? (
                <div
                  className={`${
                    task_time_passed(todo.date + " " + todo.time)
                      ? "text-danger"
                      : "text-secondary "
                  }`}
                >
                  Remind Time: {todo.date} | {todo.time}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div
          className="col-4 text-end"
          onClick={() => {
            if (onEditMode) {
              setOnEditMode(false);
            }
          }}
        >
          {/* Note Button */}
          {/* <button
            ref={noteRef}
            className="btn"
            onClick={() => setShowNoteToolTip(!showNoteToolTip)}
          >
            <i className="fa fa-sticky-note text-dark"></i>
          </button>
          <Overlay
            target={noteRef.current}
            show={showNoteToolTip}
            placement="left"
          >
            {(props) => (
              <Tooltip id="overlay-example" {...props}>
                {!onEditNoteMode ? (
                  todo.note
                ) : (
                  <Form.Control
                    type="text"
                    name="title"
                    value={todo.note}
                    onChange={(event) => editNote(todo.id, event.target.value)}
                    //   onChange={(event) => setNewItemTitle(event.target.value)}
                  />
                )}
              </Tooltip>
            )}
          </Overlay> */}
          {/* Note Button End*/}

          {/* Delete Button  */}
          <button
            ref={target}
            className="btn"
            onClick={() => deleteTask(todo.id)}
          >
            <i className="fa fa-trash text-danger"></i>
          </button>
          {/* Delete Button End */}

          {/* Details Button  */}
          <button
            ref={target}
            className="btn"
            onClick={() => setShowToolTip(!showToolTip)}
          >
            <i className="fa fa-info-circle"></i>
          </button>
          <Overlay target={target.current} show={showToolTip} placement="left">
            {(props) => (
              <Tooltip id="overlay-example" {...props}>
                <Form>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={todo.date}
                      onChange={(event) =>
                        editDate(todo.id, event.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Time</Form.Label>
                    <Form.Control
                      type="time"
                      step="3600"
                      name="time"
                      value={todo.time}
                      onChange={(event) =>
                        editTime(todo.id, event.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      type="time"
                      step="3600"
                      name="time"
                      value={todo.time}
                      onChange={(event) =>
                        editPriority(todo.id, event.target.value)
                      }
                    >
                      <option value="1" selected={todo.priority == 1}>
                        Low
                      </option>
                      <option value="2" selected={todo.priority == 2}>
                        Medium
                      </option>
                      <option value="3" selected={todo.priority == 3}>
                        High
                      </option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              </Tooltip>
            )}
          </Overlay>
          {/* Details Button End */}
        </div>
      </div>
    </div>
  );
}

export default Item;
