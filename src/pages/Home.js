import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useCookies } from "react-cookie";
import ClosingAlert from "../components/Alert";
import Select from "react-select";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [cookie] = useCookies();
  const navigate = useNavigate();
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertColor, setAlertColor] = useState("red");
  const [tasks, setTasks] = useState(null);
  const [task, setTask] = useState("");
  const [updateTsk, setUpdateTsk] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const priorityOptions = [
    { label: "High", value: "high" },
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
  ];
  const updatePriorityOptions = [
    { label: "High", value: "high" },
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
  ];

  const [priority, setPriority] = useState({ label: "High", value: "high" });
  const [updatePriority, setUpdatePriority] = useState({
    label: "High",
    value: "high",
  });
  const addTask = async (e) => {
    e.preventDefault();
    if (task.length === 0) {
      console.log("task is ", task);
      console.log("task len ", task.length);
      setAlertColor("red");
      setAlertMsg("Write valid task.");
      return;
    }

    try {
      const response = await axios.post(
        "https://todo-list-examrat.herokuapp.com/task/add",
        {
          task: task,
          priority: priority.value,
          userId: cookie.user._id,
        },
        {
          headers: {
            authorization: "Bearer " + cookie.token,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      if (response.data.status) {
        getTodo();
      } else {
        setAlertColor("red");
        setAlertMsg(response.data.msg);
      }
    } catch (error) {
      console.log("ser err");
      console.log(error);
      setAlertColor("red");
      setAlertMsg("Server Error. Try again.");
    }
  };

  // update task function
  const updateTask = async (e) => {
    e.preventDefault();
    if (!selectedTaskId) {
      setAlertColor("red");
      setAlertMsg("Select Task.");
      return;
    }

    if (!updateTsk) {
      setAlertColor("red");
      setAlertMsg("Add some text in task.");
    }

    try {
      const response = await axios.post(
        "https://todo-list-examrat.herokuapp.com/task/update",
        {
          taskId: selectedTaskId,
          userId: cookie.user._id,
          task: updateTsk,
          priority: updatePriority.value,
        },
        {
          headers: {
            authorization: "Bearer " + cookie.token,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (response.data.status) {
        getTodo();
      } else {
        setAlertColor("red");
        setAlertMsg(response.data.msg);
      }
    } catch (error) {
      setAlertColor("red");
      setAlertMsg("server error.");
    }
  };

  const getTodo = async () => {
    try {
      var data = await axios.get("https://todo-list-examrat.herokuapp.com/task/get", {
        headers: {
          authorization: "Bearer " + cookie.token,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

      console.log(data.data);
      if (data.data.status) {
        setTasks(data.data.todo.todo);
        setAlertColor("green");
        setAlertMsg("Tasks found");
        return;
      }
      setAlertColor("red");
      setAlertMsg(data.data.msg);
    } catch (error) {
      console.log("eror");
      console.log(error);
      setAlertColor("red");
      setAlertMsg("Server Error. Try again.");
    }
  };
  useEffect(() => {
    document.title = cookie.user.name;
    getTodo();
  }, [cookie.token]);

  const columns = [
    {
      field: "task",
      headerName: "Tasks",
      width: 600,
    },
    {
      field: "priority",
      headerName: "Priority",
      renderCell: ({ row }) => {
        let color;
        if (row.priority === "low") color = "emerald-500";
        else if (row.priority === "medium") color = "cyan-500";
        else color = "rose-400";

        console.log("color is ", color);
        return <div className={`uppercase bg-${color} p-2 rounded-lg`}>{row.priority} </div>;
      },
    },
    {
      field: "isCompleted",
      headerName: "Status",
      renderCell: ({ row }) => {
        return row.isCompleted ? (
          <Button style={{ backgroundColor: "springgreen" }}>Done</Button>
        ) : (
          <Button
            style={{ backgroundColor: "yellow" }}
            onClick={async () => {
              try {
                const res = await axios.get(
                  "https://todo-list-examrat.herokuapp.com/task/mark-complete?taskId=" +
                    row._id +
                    "&userId=" +
                    cookie.user._id,
                  {
                    headers: {
                      authorization: "Bearer " + cookie.token,
                      "Content-Type": "application/json",
                      "Access-Control-Allow-Origin": "*",
                    },
                  }
                );
                if (res.data.status) {
                  getTodo();
                } else {
                  setAlertMsg(res.data.msg);
                }
              } catch (error) {
                console.log("error", error);
                setAlertColor("red");
                setAlertMsg("Server Error. Try again later.");
              }
            }}
          >
            Pending
          </Button>
        );
      },
    },
    {
      headerName: "Delete",
      renderCell: (params) => {
        console.log("row is ", params.row);
        return (
          <div>
            <Button
              onClick={async () => {
                try {
                  const res = await axios.delete(
                    "https://todo-list-examrat.herokuapp.com/task/delete?taskId=" +
                      params.row._id +
                      "&userId=" +
                      cookie.user._id,
                    {
                      headers: {
                        authorization: "Bearer " + cookie.token,
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                      },
                    }
                  );
                  if (!res.data.status) {
                    setAlertColor("red");
                    setAlertMsg(res.data.msg);
                  } else {
                    getTodo();
                  }
                } catch (error) {
                  console.log("error");
                  console.log(error);
                  setAlertColor("red");
                  setAlertMsg("Server Error.");
                }
              }}
            >
              ❌
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-slate-200">
      <div>
        {alertMsg && <ClosingAlert msg={alertMsg} alertColor={alertColor} />}
      </div>

      <div>
        <div className="flex  uppercase font-bold text-fuchsia-600 text-2xl justify-between">
          <h4>All todos</h4>
          <div>
            <Button
              onClick={async () => {
                try {
                  const res = await axios.get(
                    "https://todo-list-examrat.herokuapp.com/task/logout",
                    {
                      headers: {
                        authorization: "Bearer " + cookie.token,
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                      },
                      withCredentials: true,
                    }
                  );
                  navigate("/login");
                } catch (error) {
                  setAlertColor("red");
                  setAlertMsg("Server Error. Try again later.");
                }
              }}
            >
              Logout
            </Button>{" "}
          </div>
        </div>
        {tasks ? (
          <div className="m-4 bg-white">
            <DataGrid
              getRowId={(data) => data._id}
              columns={columns}
              rows={tasks}
              checkboxSelection
              onSelectionModelChange={(newSelectionModel) => {
                setSelectedTaskId(
                  newSelectionModel[newSelectionModel.length - 1]
                );
                console.log(
                  "selection",
                  newSelectionModel[newSelectionModel.length - 1]
                );
              }}
              autoHeight={true}
              getRowHeight={() => "auto"}
            ></DataGrid>
          </div>
        ) : (
          <span>No task found.</span>
        )}
      </div>
      <div className="flex justify-between m-4">
        <div className="w-60">
          <div className="uppercase flex justify-center">
            <h4>Add Task</h4>
          </div>
          <div className="m-2 ">
            <form onSubmit={addTask}>
              <div>
                <Select
                  value={priority}
                  onChange={(e) => {
                    setPriority({ label: e.label, value: e.value });
                  }}
                  options={priorityOptions}
                ></Select>
              </div>
              <div>
                <textarea
                  className="border-2 border-black border-y-orange-500"
                  onChange={(e) => {
                    setTask(e.target.value);
                  }}
                  placeholder="Create task.."
                  rows={5}
                  cols={28}
                ></textarea>
              </div>

              <div className="flex justify-center ">
                <Button>
                  <input
                    type="submit"
                    value={"Create"}
                    className="bg-cyan-400 p-2 rounded-lg text-white"
                  />
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-60">
          <div className="uppercase flex justify-center">
            <h4>Update Task</h4>
          </div>
          <div className="m-2">
            <form onSubmit={updateTask}>
              <div>
                <Select
                  value={updatePriority}
                  onChange={(e) => {
                    setUpdatePriority({ label: e.label, value: e.value });
                  }}
                  options={updatePriorityOptions}
                ></Select>
              </div>
              <div>
                <textarea
                  className="border-2 border-black border-y-pink-500"
                  onChange={(e) => {
                    setUpdateTsk(e.target.value);
                  }}
                  placeholder="Update task.."
                  rows={5}
                  cols={28}
                ></textarea>
              </div>

              <div className="flex justify-center ">
                <Button>
                  <input
                    type="submit"
                    value={"Update"}
                    className="bg-teal-400 p-2 rounded-lg text-white"
                  />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
