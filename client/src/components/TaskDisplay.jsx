import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { useState } from 'react';
import { toast } from 'react-toastify';

export function TaskDisplay({ task, onTaskUpdate, onTaskRemoval }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState(task.title);
    const [newTaskDescription , setNewTaskDescription] = useState(task.description);
    const [submitting, setSubmitting] = useState(false);

    const handleUpdateTaskSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        // validate submitted data
        if( !newTaskTitle.length || !newTaskDescription.length ){
          alert("Please fill the form correctly!\nTitle and description can't be blank");
          return;
        }

        // Data is valid to be updated
        const options = {
            method: 'PUT',
            body: JSON.stringify({ title: newTaskTitle, description: newTaskDescription }),
            headers: { 'Content-Type': 'application/json' },
        };

        fetch(`/api/tasks/${task.id}`, options)
            .then((r) => r.json())
            .then((task) => {
                onTaskUpdate(task);
                setSubmitting(false);
                //close the modal
                setModalIsOpen(false);
                // Show success toast message
                toast( task.title + " updated successfully!", {
                    autoClose: 10000,
                    draggable: true,
                    theme: "colored",
                    type: "info",
                });
            });
    };

    /* const toggleCompletion = () => {
        fetch(`/api/tasks/${task.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: task.title,
                description: task.description,
                completed: !task.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((r) => r.json())
            .then(onTaskRemoval);   //Remove this task from state since we only want to display pending tasks
    }; */

    const removeTask = () => {
        fetch(`/api/tasks/${task.id}`, { method: 'DELETE' }).then(() => {
            onTaskRemoval(task);
            toast( task.title + " deleted successfully!", {
                autoClose: 10000,
                draggable: true,
                theme: "colored",
                type: "error",
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
        <div className="GoalDiv">
            <div className="GoalDetails">
                <span className="GoalTitle">{task.title + " "}</span>
                <span className="GoalDivider">|</span>
                <span className="GoalDescription">{" " + task.description}</span>
            </div>
            <div className="ButtonContainer" style={{ justifyContent: "end" }}>
                <button title="Update task" type="button" className="ButtonSmProgress" onClick={ () => setModalIsOpen(true) }>Update</button>
                <button title="Remove task" type="button" className="ButtonSm" 
                    style={{ background: "red", borderColor: "red", marginLeft: "15px" }}
                    onClick={removeTask}
                    >Delete
                </button>

                <Modal
                    isOpen={modalIsOpen}
                    // Focus on the title input for better UX
                    onAfterOpen={() => document.getElementById('updatedTaskTitleInput').focus() }
                    onRequestClose={ () => setModalIsOpen(false) }
                    style={customStyles}
                    contentLabel="Update Task"
                >
                    <div className="ModalHead">
                        Update Task
                    </div>
                    <div className='ModalBody'>
                        <form onSubmit={handleUpdateTaskSubmit}>
                            <input id="updatedTaskTitleInput" required className='SiteInput' type="text" placeholder='Enter task title'
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

            </div>
        </div>
    );
}

TaskDisplay.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        //completed: PropTypes.bool,
        completed: PropTypes.number,
    }),
    onTaskUpdate: PropTypes.func,
    onTaskRemoval: PropTypes.func,
};
