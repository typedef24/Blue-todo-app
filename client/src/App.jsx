import { TodoListCard } from './components/TodoListCard';
import Modal from 'react-modal';
import { useCallback, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

function App() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [tasks, setTasks] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription , setNewTaskDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch('/api/tasks')
            .then((r) => r.json())
            .then(setTasks);
    }, []);

    const onNewTask = useCallback(
        (newTask) => {
            // insert new task at the begining of the array
            setTasks([newTask, ...tasks]);
        },
        [tasks],
    );

    const onTaskUpdate = useCallback(
        (task) => {
            const index = tasks.findIndex((i) => i.id === task.id);
            //alert(index);
            setTasks([
                ...tasks.slice(0, index),
                task,
                ...tasks.slice(index + 1),
            ]);
        },
        [tasks],
    );

    const onTaskRemoval = useCallback(
        (task) => {
            const index = tasks.findIndex((i) => i.id === task.id);
            setTasks([...tasks.slice(0, index), ...tasks.slice(index + 1)]);
        },
        [tasks],
    );

    const handleAddTaskSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        // validate submitted data
        if( !newTaskTitle.length || !newTaskDescription.length ){
          alert("Please fill the form correctly!\nProvide a title and description for your task");
          return;
        }

        // Data is valid to be added
        const options = {
            method: 'POST',
            body: JSON.stringify({ title: newTaskTitle, description: newTaskDescription }),
            headers: { 'Content-Type': 'application/json' },
        };

        fetch('/api/tasks', options)
            .then((r) => r.json())
            .then((task) => {
                onNewTask(task);
                setSubmitting(false);
                // reset form inputs for good UX
                setNewTaskTitle('');
                setNewTaskDescription('');
                //close the modal
                setModalIsOpen(false);
                // Show success toast message
                toast( task.title + " added successfully!", {
                    autoClose: 10000,
                    draggable: true,
                    theme: "colored",
                    type: "success",
                });
            });
    };

    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: 0,
        borderRadius: 10,
        borderColor: "#1f40e6",
        width: "50%",
      },
    };

    const disableSubmitButton = !newTaskTitle.length || !newTaskDescription.length || submitting;

    return (
        <div className="AppContainer" style={{ paddingTop: "0px"}}>

            <ToastContainer />

            <h1 className="appName">Blue Todo!</h1>
            <div className="ShadowDiv">
                <header className="PanelHead">
                    Your pending tasks
                    <button type="button" className="ButtonSm" onClick={ () => setModalIsOpen(true) }>Add Task</button>

                    <Modal
                        isOpen={modalIsOpen}
                        // Focus on the title input for better UX
                        onAfterOpen={() => document.getElementById('titleInput').focus() }
                        onRequestClose={ () => setModalIsOpen(false) }
                        style={customStyles}
                        contentLabel="Add Task"
                    >
                        <div className="ModalHead">
                            Add Task
                        </div>
                        <div className='ModalBody'>
                            <form onSubmit={handleAddTaskSubmit}>
                                <input id="titleInput" required className='SiteInput' type="text" placeholder='Enter task title'
                                    value={newTaskTitle}
                                    onChange={ (e) => setNewTaskTitle(e.target.value)}
                                />
                                <br />
                                <textarea required className='SiteInput' type="text" placeholder='Enter task description' rows="4"
                                    value={newTaskDescription}
                                    onChange={ (e) => setNewTaskDescription(e.target.value)}
                                ></textarea>
                                <br />
                                <div className="ButtonContainer">
                                    <button type="button" className="ButtonSmProgress"
                                        onClick={ () => setModalIsOpen(false) }
                                    >Close</button>
                                    <button type="submit" className="ButtonSm"
                                        style={ disableSubmitButton ? { background: "#6b80eb", borderColor: "#6b80eb", cursor: "not-allowed" } : {} }
                                        disabled={ disableSubmitButton }
                                    >
                                        {submitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>

                </header>
                <div className='PanelBody'>
                    <TodoListCard
                        tasks={tasks}
                        onTaskUpdate={onTaskUpdate}
                        onTaskRemoval={onTaskRemoval}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
