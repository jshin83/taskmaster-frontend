import React, {useState, useEffect} from 'react';
import './app.scss';

// import mockData from './mock.json';

// const cors = require('cors');
const API = 'http://taskmasterjs.us-west-2.elasticbeanstalk.com/tasks';


function Tasks() {
  const [tasks, setTasks] = useState([]);
  const proxyurl = "https://cors-anywhere.herokuapp.com/";

  const _getTasks = () => {
    // setTasks(mockData)
    // fetch from api
    fetch(proxyurl + API)
    .then( data => data.json() )
    .then( allTasks => setTasks(allTasks) )
    .catch( console.error );
  };

  const _toggleStatus = (e) => {
    e.preventDefault();
    let id = e.target.id;

    // patch to my api
    fetch( proxyurl + `${API}/${id}/state`, {
      method: 'PUT'
    })
    .then(data => data.json())
    .then(task => {
      setTasks( tasks.map( (entry) => {
          return entry.id === id ? task : entry;
        }
      ));
    })
    .catch( console.error );
  };

  useEffect(_getTasks, []);

  return (
    <ul>
      {tasks.map( (task) =>
        <li key={task.id}>
          <details>
            <summary>
              <span>{task.title}</span>
              <form action={`${API}/${task.id}/images`} method="post" encType="multipart/form-data">
                <label>
                <span>Upload Image</span>
                <input name="file" type="file" />
                </label>
                <button>Save</button>
              </form>
              <span className="status" id={task.id} onClick={_toggleStatus} >{task.status}</span>

            </summary>
            <Description task={task} />
          </details>
        </li>
      )}
    </ul>
  )
}

function Description(props) {
  let task = props.task || "";
  if(task.assignee === null || task.assignee === "") {
    task.assignee = "none";
  }
  return (
    <section>
        <div key={task.id}>
          <span>{task.description}</span>
          <span>Assignee: {task.assignee}</span>
          {task.url? <img src={task.url} alt="task" />: <p>There is no image associated with this task.</p>}
        </div>
    </section>
  )
}

function AppDescription() {
  return (
    <>
      <p>This is a list of tasks. You may advance the status
        by clicking on the status, only if the task has an assignee.
      </p>
    </>
  )
}

function Footer() {
  return (
    <>
      <footer>&copy; 2019 jenshin</footer>
    </>
  );
}

function App() {
  return (
    <>
      <header>TaskMaster App</header>
      <main>
        <AppDescription />
        <Tasks />
      </main>
      <Footer />
    </>
  );
}

export default App;