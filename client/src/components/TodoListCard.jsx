import { TaskDisplay } from './TaskDisplay';
import PropTypes from 'prop-types';

export function TodoListCard({ tasks, onTaskUpdate, onTaskRemoval }) {

    if (tasks === null) return 'Loading...'; 
    //else return (<div>{JSON.stringify(tasks)}</div>);

    return (
        <>
            {tasks.length === 0 && (
                <p className="text-center">No tasks yet! Click "<b>Add Task</b>" to create your first task!</p>
            )}
            {tasks.map((task) => (
                <TaskDisplay
                    key={JSON.stringify(task.id)}
                    task={task}
                    onTaskUpdate={onTaskUpdate}
                    onTaskRemoval={onTaskRemoval}
                />
            ))}
        </>
    );
}

TodoListCard.propTypes = {
    onNewTask: PropTypes.func,
    onTaskUpdate: PropTypes.func,
    onTaskRemoval: PropTypes.func,
};
