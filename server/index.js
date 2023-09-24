const args = require("yargs");
const sqlite_sync = require("sqlite-sync");
const jwt_secret_pass = "j=03945u9g-wjpnj-9uhy";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");
var crypto = require("crypto");

const express = require("express");
const app = express();

var cors = require("cors");
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

const encryptSecurityKey = "merj45j9q0grt0jw";
const decryptSecurityKey = "ji45j[jdpj95j9hi";
const sql_file = "fish.db";
var db = null;
var token = "";
const tasks_number_perPage = 10;
const http_routes = [
  { path: "/login", method: "post", auth_required: false },
  { path: "/signup", method: "post", auth_required: false },
  { path: "/auth/check", method: "post", auth_required: false },
  { path: "/api/task/index/:uid", method: "get", auth_required: false },
  { path: "/api/task/store/:uid", method: "post", auth_required: false },
  { path: "/api/task/delete/:id", method: "get", auth_required: false },
  { path: "/api/task/update/:id", method: "post", auth_required: false },
  {
    path: "/api/task/toggleCompleted/:id",
    method: "get",
    auth_required: false,
  },
  { path: "/api/user/index", method: "get", auth_required: false },
  { path: "/api/user/store", method: "post", auth_required: false },
  { path: "/api/user/delete", method: "post", auth_required: false },
  { path: "/api/user/update", method: "get", auth_required: false },
];
function generateHeapDumpAndStats() {
  //1. Force garbage collection every time this function is called
  try {
    global.gc();
  } catch (e) {
    console.log("You must run program with 'node --expose-gc'");
    process.exit();
  }

  //2. Output Heap stats
  var heapUsed = process.memoryUsage().heapUsed;
  console.log("Program is using " + heapUsed + " bytes of Heap.");
}
function showMemoryUsage() {
  global.gc();
  const used = process.memoryUsage();
  for (let key in used) {
    console.log(
      `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
    );
  }
}

// const username_password_is_valid = () => {

// }

const cmd_args = () => {
  args.positional("ip", {
    type: "string",
    default: "localhost",
    describe: "ip of http server",
    alias: "i",
  });
  args.positional("port", {
    type: "int",
    default: 8989,
    describe: "port on https server",
    alias: "p",
  });
};

function get_current_time () {
  try {
    date_ob = new Date();
    year = date_ob.getFullYear();
    month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    day = ("0" + date_ob.getDate()).slice(-2);
    hour = date_ob.getHours();
    minute = date_ob.getMinutes();
    second = date_ob.getSeconds();
    return `${year}/${month}/${day}  ${hour}:${minute}:${second}`;
  } catch (error) {
    // console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

//-------------------- db_code --------------------

insert_user_name_passwords_to_users_table = (username, password) => {
  try {
    salt = bcrypt.genSaltSync(10);
    hashed_pass = bcrypt.hashSync(password, salt);
    // console.log(`hashed pass:${hashed_pass}`);
    insert_to_table("users", { username: username, password: hashed_pass });
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

function get_auth_user_obj_if_user_name_in_db(username) {
  try {
    var task = `SELECT * FROM users WHERE username='${username}';`;

    rows = db.run(task);
    // console.log("rows in func");
    // console.log(rows);
    if (rows.length == 0) {
      return false;
    } else {
      // console.log("in func");

      return rows[0];
    }
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
}

set_task_as_delivered = (cmd_id) => {
  try {
    db.run(`UPDATE tasks SET delivered=1 WHERE id='${cmd_id}';`);
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};
update_user = (data, db) => {
  try {
    db.run(
      `UPDATE users SET token='${data.token}' WHERE id='${data.user_id}';`
    );
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

function make_db_ready(sql_file) {
  try {
    db = sqlite_sync.connect(sql_file);
    // console.log("db:");
    // console.log(db);
    createTables(db);
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
}

// users_table_populate = () => {
//     try {
//         username = ""
//         ups = []
//         while (username != "exit") {
//             username = prompt("username:")
//             if (username == "exit") {
//                 continue
//             }

//             password = prompt("password:")
//             ups.push({ "name": username, "password": password })
//         }
//         ups.forEach(userpass => {
//             insert_user_name_passwords_to_users_table(userpass.name, userpass.password)
//         });
//     } catch (error) {
//         console.log(`error:\n${error} and error stack is ${error.stack}`);

//     }
// }

function createTables(db) {
  try {
    commands = [];
    var command1 = `
      CREATE TABLE IF NOT EXISTS tasks
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        body  VARCHAR(1024) ,
        completed   VARCHAR(50) DEFAULT(0),
        priority VARCHAR(50) DEFAULT(1),
        category_id INT(16) DEFAULT(0),
        note VARCHAR(2048),
        date VARCHAR(512),
      );`;
    var command2 = `
      CREATE TABLE IF NOT EXISTS users
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username  VARCHAR(1024) ,
        password   VARCHAR(512) ,
        token VARCHAR(1024) ,
       
      );`;

    command3 = `
      CREATE TABLE IF NOT EXISTS categories
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name  VARCHAR(1024) ,
        
      );`;

    commands.push(command1, command2,command3);
    commands.forEach((command) => {
      db.run(command);
      // console.log(db);
    });
    // console.log("make db");
    // console.log(db);
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
}

function insert_to_table(tbl_name, data) {
  try {
    // console.log("data_insert:");
    // console.log(data);
    console.log("insert data:");
    console.log(data);
    // data_keys = Object.keys(data);
    // fields_str = data_keys.join(",");
    // values = [];
    // data_keys.forEach((element) => {
    //   if (
    //     typeof data[element] === "string" ||
    //     data[element] instanceof String
    //   ) {
    //     values.push(`'${data[element]}'`);
    //   } else {
    //     values.push(data[element]);
    //   }
    // });
    // values_str = values.join(",");

    

    db.insert(tbl_name, data);
    // db.run(task)
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
  // db.prepare(task).apply()
}

get_all_users = () => {
  var task = `SELECT * FROM users`;
  var users_obj = db.run(task);
  return users_obj;
};

get_user_by_id = (user_id) => {
  try {
    var task = `SELECT * FROM users WHERE id=${user_id};`;

    rows = db.run(task);
    return rows[0];
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};
get_user_by_name = (user_name) => {
  try {
    var task = `SELECT * FROM users WHERE username='${user_name}';`;

    rows = db.run(task);
    // console.log("user by name result");
    // console.log(rows);
    return rows[0];
  } catch (error) {
    // console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

get_non_result_not_delivered_tasks_by_user_id = (user_id) => {
  try {
    // db = sqlite_sync.connect('fish.db')
    var task = `SELECT * FROM tasks WHERE trojan_id=${user_id} AND result IS NULL AND delivered=0;`;

    rows = db.run(task);
    // console.log(rows);
    return rows;
  } catch (error) {
    // console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

insert_cmd_result_to_db = (task_result_json) => {
  try {
    db.run(
      `UPDATE tasks SET result='${task_result_json.result}' WHERE id='${task_result_json.id}';`
    );
    db.run(
      `UPDATE tasks SET result_time='${get_current_time()}' WHERE id='${
        task_result_json.id
      }';`
    );
  } catch (error) {
    // console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};
get_tasks_by_user_id = (user_id = 0, just_resulted = false) => {
  try {
    // db = sqlite_sync.connect('fish.db')
    if (user_id == 0 && just_resulted == false) {
      //all tasks
      var task = `SELECT * FROM tasks;`;
    } else if (user_id == 0 && just_resulted == true) {
      //all resulted tasks
      var task = `SELECT * FROM tasks WHERE result IS NOT NULL;`;
    } else if (user_id != 0 && just_resulted == false) {
      //all user tasks
      var task = `SELECT * FROM tasks WHERE trojan_id=${user_id};`;
    } else if (user_id != 0 && just_resulted == true) {
      //all resulted user tasks
      var task = `SELECT * FROM tasks WHERE trojan_id=${user_id} AND result IS NOT NULL;`;
    }
    tasks = db.run(task);
    return tasks;
  } catch (error) {
    // console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};
get_tasks_count_by_user_id = (user_id = 0, just_resulted = false) => {
  try {
    // db = sqlite_sync.connect('fish.db')
    if (user_id == 0 && just_resulted == false) {
      //all tasks
      var task = `SELECT COUNT(*) FROM tasks;`;
    } else if (user_id == 0 && just_resulted == true) {
      //all resulted tasks
      var task = `SELECT COUNT(*) FROM tasks WHERE result IS NOT NULL;`;
    } else if (user_id != 0 && just_resulted == false) {
      //all user tasks
      var task = `SELECT COUNT(*) FROM tasks WHERE trojan_id=${user_id};`;
    } else if (user_id != 0 && just_resulted == true) {
      //all resulted user tasks
      var task = `SELECT COUNT(*) FROM tasks WHERE trojan_id=${user_id} AND result IS NOT NULL;`;
    }
    tasks = db.run(task);
    tasks_count = tasks[0]["COUNT(*)"];
    return tasks_count;
  } catch (error) {
    // console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};
function get_record_by_id(tbl_name, id) {
  var command = `SELECT * FROM ${tbl_name} WHERE id=${id}`;
  record = db.run(command);

  return record[0];
}
function task_toggle_completed(task_id) {
  task = get_record_by_id("tasks", task_id);
  console.log("task");
  console.log(task);
  db.run(
    `UPDATE tasks SET completed=${
      task.completed == 1 ? 0 : 1
    } WHERE id='${task_id}';`
  );
}
get_tasks_by_user_id_by_page = (user_id = 0) => {
  try {
    // db = sqlite_sync.connect('fish.db')
    if (user_id == 0) {
      //all tasks
      var task = `SELECT * FROM tasks ORDER BY id DESC ;`;
    }
      var task = `SELECT * FROM tasks WHERE user_id=${user_id} ORDER BY id DESC ;`;


    tasks = db.run(task);
    // console.log("tasks in in=");
    // console.log(tasks);
    return tasks;
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

//-------------------- db_code end --------------------

// process_form_data = (req) => {
//     try {
//         const form = new formidable.IncomingForm();

//         form
//             .parse(req)
//             .on('fileBegin', (name, file) => {
//                 console.time('start');
//                 // console.log('name', name);
//                 file.path = `uploads/${file.name}`;
//             })
//     } catch (error) {
//         // console.log(`error:\n${error} and error stack is ${error.stack}`);

//     }
// }

//-------------------- http request handle code --------------------
//-------------------- api handle codes --------------------
api_task_index = (req, res) => {
  try {
    user_id = req.params.uid;

    // tot_tasks_length = get_tasks_count_by_user_id(uid);
    tasks = [];
    tasks = get_tasks_by_user_id_by_page(user_id);
    // console.log("task index");
    // console.log(tasks);
    cmd_res_json = {};
    if (tasks.length == 0) {
      cmd_res_json = { message: "no task" };
    } else {
      task_objs_arr = [];
      cmd_res_json = {};

      // tasks.forEach(task_obj => {

      //     task_obj['username'] = get_user_by_id(task_obj.trojan_id).name
      //     task_objs_arr.push(task_obj)
      //     get_user_by_id()
      // });

      cmd_res_json["tasks"] = tasks;
      // cmd_res_json['tot_tasks_number'] = tot_tasks_length
    }
    cmd_res_json_str = JSON.stringify(cmd_res_json);
    send_response(res, cmd_res_json_str, 200);
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

api_task_store = (req, res) => {
  try {
    user_id = req.params.uid;
    body = get_request_data(req);

    // console.log("body received");
    // console.log(body);
    json_received = body;
    json_received.user_id=parseInt(user_id);
    console.log("json_received");
    console.log(json_received);

    // json_received['trojan_id'] = json_received["user_id"]

    // delete json_received['username']

    // console.log(json_received);
    insert_to_table("tasks", json_received);
    send_response(res, "Ok", 200);
  } catch (error) {
    console.log(`error in task store:\n${error} and error stack is ${error.stack}`);
  }
};
api_task_toggleCompleted = (req, res) => {
  try {
    task_id = req.params.id;
    console.log("task_id");
    console.log(task_id);
    task_toggle_completed(task_id);
    send_response(res, "Ok", 200);
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

api_task_delete = (req, res) => {
  try {
    task_id = req.params.id;
    db.run(`DELETE FROM tasks WHERE id=${task_id};`);
    send_response(res, "Ok", 200);
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

api_task_update = (req, res) => {
  try {
    task_id = req.params.id;
    req_body = get_request_data(req);
    // console.log(req_body.body);
    db.run(
      `UPDATE tasks SET ${
        req_body.body
          ? "body"
          : req_body.date
          ? "date"
          : req_body.time
          ? "time"
          : req_body.priority
          ? "priority"
          : req_body.note
          ? "note"
          : ""
      }='${
        req_body.body
          ? req_body.body
          : req_body.date
          ? req_body.date
          : req_body.time
          ? req_body.time
          : req_body.priority
          ? req_body.priority
          : req_body.note
          ? req_body.note
          : ""
      }' WHERE id=${task_id};`
    );
    send_response(res, "Ok", 200);
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

api_user_index = (req, res) => {
  all_users_obj_ = get_all_users();
  all_users_obj = [];
  cmd_res_json = {};
  all_users_obj_.forEach((user_obj) => {
    user_id = jwt_verify_user_token_and_get_user_obj(user_obj.token);
    if (user_id != null) {
      user_obj["logged_in"] = true;
    } else {
      user_obj["logged_in"] = false;
    }
    delete user_obj["token"];
    all_users_obj.push(user_obj);
  });
  if (all_users_obj.length == 0) {
    cmd_res_json = { message: "no task" };
  } else {
    cmd_res_json["users"] = all_users_obj;
  }
  // console.log("all users objects");
  // console.log(all_users_obj);
  cmd_res_json_str = JSON.stringify(cmd_res_json);

  send_response(res, cmd_res_json_str, 200);
};

api_user_store = (req, res) => {
  try {
    body = get_request_data(req);
    // console.log(body);
    console.log(body);

    json_received = body;
    insert_user_name_passwords_to_users_table(
      json_received.username,
      json_received.password
    );
    auth_user_obj = get_auth_user_obj_if_user_name_in_db(
      json_received.username
    );
    console.log("auth_user_obj");
    console.log(auth_user_obj);
    // console.log("auth_user_obj.id");
    // console.log(auth_user_obj.id);
    token = jwt.sign({ user_id: auth_user_obj.id }, jwt_secret_pass, {
      expiresIn: "2h",
    });
    console.log("token");
    console.log(token);
    update_user({ user_id: auth_user_obj.id, token: token }, db);
    if (token != null) {
      auth_json = { message: "auth_success", token: token, userObj: auth_user_obj };
      str_auth_json = JSON.stringify(auth_json);
      // encrypted_str_auth_json = encrypt_string(
      //   str_auth_json,
      //   encryptSecurityKey
      // );
      console.log(str_auth_json);
      send_response(res, str_auth_json, 200);
    } else {
      auth_json = { message: "auth_failed" };
      str_auth_json = JSON.stringify(auth_json);
      send_response(res, str_auth_json, 200);
    }
    // insert_to_table("users", json_received)
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

api_user_delete = (req, res) => {};

api_user_update = (req, res) => {};

//-------------------- api handle codes end --------------------

handle_not_found = (req, res) => {
  try {
    res.status(200).send();
    send_response(
      res,
      `<!DOCTYPE html>
        
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h1>404 Not Found</h1>
    </body>
    </html>`,
      200
    );
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};
function insert_jwt_token_to_user_if_password_is_correct_and_get_it(user_obj) {
  try {
    if (user_obj == false) {
      return null;
    } else {
      // console.log(user_obj.password);
      is_password_valid = bcrypt.compareSync(password, user_obj.password);
      if (is_password_valid) {
        token = jwt.sign({ user_id: user_obj.id }, jwt_secret_pass, {
          expiresIn: "2h",
        });
        // console.log(token);
        update_user({ user_id: user_obj.id, token: token }, db);
        return token;
      }
    }
  } catch (error) {
    // console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
}

check_auth_and_send_uid=(req,res)=>{
  body = get_request_data(req);
  console.log("body.token");
  console.log(body.token);
  token_user = jwt_verify_user_token_and_get_user_obj(body.token);
  if (token_user) {
    auth_json = { message: "auth_success" ,userObj:token_user};
    str_auth_json = JSON.stringify(auth_json);
    // encrypted_str_auth_json = encrypt_string(str_auth_json, encryptSecurityKey);

    send_response(res, str_auth_json, 200);
    return;
  }
  else{
    auth_json = { message: "auth_failed", uid: 0 };
    str_auth_json = JSON.stringify(auth_json);
    // encrypted_str_auth_json = encrypt_string(str_auth_json, encryptSecurityKey);

    send_response(res, str_auth_json, 203);
  }
}
manage_login = (req, res) => {
  try {
    user_name = "";
    password = "";

    // console.log("body in login:");

    current_time = get_current_time();
    // console.log("decrypted string::");
    // console.log(decrypt_string(body, decryptSecurityKey));
    body = get_request_data(req);
    json_received = body;


    // console.log(json_received);
    token_user_id = jwt_verify_user_token_and_get_user_obj(json_received.token);
    if (token_user_id != null) {
      auth_json = { message: "auth_success" };
      str_auth_json = JSON.stringify(auth_json);
      encrypted_str_auth_json = encrypt_string(
        str_auth_json,
        encryptSecurityKey
      );

      send_response(res, encrypted_str_auth_json, 200);
      return;
    }
    user_name = json_received.username;
    password = json_received.password;
    // console.log(`username: ${user_name}`);
    auth_user_obj = get_auth_user_obj_if_user_name_in_db(user_name);

    token =
      insert_jwt_token_to_user_if_password_is_correct_and_get_it(auth_user_obj);
    if (token != null) {
      auth_json = { message: "auth_success", token: token,userObj:auth_user_obj };
      str_auth_json = JSON.stringify(auth_json);
      
      send_response(res, str_auth_json, 200);
    } else {
      auth_json = { message: "auth_failed" };
      str_auth_json = JSON.stringify(auth_json);
      send_response(res, str_auth_json, 200);
    }
  } catch (err) {
    console.log(err);
  }
};

jwt_verify_user_token_and_get_user_obj = (token) => {
  try {
    jwt_verify = jwt.verify(token, jwt_secret_pass);
    console.log("jwt_verify");
    console.log(jwt_verify);
    user_id = jwt_verify.user_id;
    user=get_user_by_id(user_id)
    // console.log("user_id");
    // console.log(user_id);
    return user;
  } catch (error) {
    // console.log(`error:\n${error} and error stack is ${error.stack}`);
    return null;
  }
};

jwt_verify_delete_user_token_and_get_user_id_do_logout = (user_id) => {
  try {
    user_obj = get_user_by_id(user_id);
    insert_to_table("users", { token: null });
    return user_id;
  } catch (error) {
    // console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};



//-------------------- encryption codes --------------------
decode_string_base64 = (data) => {
  try {
    let buff = new Buffer(data, "base64");
    let text = buff.toString("ascii");
    return text;
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

encode_string_base64 = (data) => {
  try {
    let buff = new Buffer(data);
    let base64data = buff.toString("base64");
    return base64data;
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

encrypt_string = (text, key) => {
  try {
    var alg = "des-ede-cbc";
    var key = new Buffer(key, "utf-8");
    var iv = new Buffer("QUJDREVGR0g=", "base64"); //This is from c# cipher iv

    var cipher = crypto.createCipheriv(alg, key, iv);
    var encoded = cipher.update(text, "ascii", "base64");
    encoded += cipher.final("base64");

    return encoded;
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

decrypt_string = (encryptedText, key) => {
  try {
    var alg = "des-ede-cbc";
    var key = new Buffer(key, "utf-8");
    var iv = new Buffer("QUJDREVGR0g=", "base64"); //This is from c# cipher iv

    var encrypted = new Buffer(encryptedText, "base64");
    var decipher = crypto.createDecipheriv(alg, key, iv);
    var decoded = decipher.update(encrypted, "binary", "ascii");
    decoded += decipher.final("ascii");

    return decoded;
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};
get_request_data = (req) => {
  return req.body;
};
function send_response(res, body, status_code = 200)  {
  res.status(status_code).send(body);
};

//-------------------- encryption codes end --------------------
//-------------------- express middleware codes --------------------
function isAuth(req, res, next) {
  body = get_request_data(req).data;
  json_received = JSON.parse(decrypt_string(body, decryptSecurityKey));
  if (jwt_verify_user_token_and_get_user_obj(json_received.token) != null) {
    return next();
  }
  send_response(res, "Not Authorized", 401);
}

//-------------------- express middleware end --------------------

config_http_request_handlers = () => {
  try {
    http_routes.forEach((route) => {
      if (route.method == "post") {
        if (route.auth_required == true) {
          app.post(route.path, isAuth, (req, res, next) => {
            express_http_routes(req, res, route.path);
          });
        } else {
          app.post(route.path, (req, res) => {
            express_http_routes(req, res, route.path);
          });
        }
      }
      if (route.method == "get") {
        if (route.auth_required == true) {
          app.get(route.path, isAuth, (req, res, next) => {
            express_http_routes(req, res, route.path);
          });
        } else {
          app.get(route.path, (req, res) => {
            express_http_routes(req, res, route.path);
          });
        }
      }
    });
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
};

function express_http_routes(req, res, path) {
  try {
    uid = req.query.uid;
    just_resulted = req.query.jr;
    page = req.query.page;

    switch (path) {
      case "/login":
        manage_login(req, res);
        break;
      case "/signup":
        api_user_store(req, res);
        break;
      case "/auth/check":
        check_auth_and_send_uid(req, res);
        break;

      case "/":
        // console.log("root");
        send_response(res, "<html>aliiiiiiiiiii</html>", 200);

        break;

      
      receive_cmd_result_and_send_it_to_db;

      //api urls
      case "/api/task/index/:uid":
        api_task_index(req, res);
        break;
      case "/api/task/toggleCompleted/:id":
        api_task_toggleCompleted(req, res);
        break;

      case "/api/task/store/:uid":
        api_task_store(req, res);
        break;
      case "/api/task/delete/:id":
        api_task_delete(req, res);
        break;
      case "/api/task/update/:id":
        api_task_update(req, res);
        break;

      case "/api/user/index":
        api_user_index(req, res);
        break;
      case "/api/user/store":
        api_user_store(req, res);
        break;
      case "/api/user/delete":
        api_user_delete(req, res);
        break;
      case "/api/user/update":
        api_user_update(req, res);
        break;
      default:
        handle_not_found(req, res);
    }
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
}

function serve_http_server() {
  try {
    app.listen(server_port, () => {
      console.log(`Express web server listening on port ${server_port}`);
    });
  } catch (error) {
    console.log(`error:\n${error} and error stack is ${error.stack}`);
  }
}

//-------------------- http request handle code end --------------------

main = () => {
  // setInterval(() => {
  //     // generateHeapDumpAndStats()
  //     showMemoryUsage()
  // }, 2000);// with flag --expose-gc
  cmd_args();

  server_host = args.argv.i;
  server_port = args.argv.p;

  make_db_ready(sql_file);

  serve_http_server();
  config_http_request_handlers();
  // console.log(jwt_verify_user_token_and_get_user_obj("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMCwiaWF0IjoxNjgzNDY1MjgxLCJleHAiOjE2ODM0NzI0ODF9.O3FxXyAgti3iRpoeQkf9pj-yx4X9vm1jRH_6cqx86QU"))
};

main();
