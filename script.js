"use strict";
const tasklist = document.getElementById('incomplete');
const complete = document.getElementById('completed');
const layout = document.querySelector('.alltasks');

tasklist.addEventListener('change', (e) => {
    layout.style.left = '0px';
})

complete.addEventListener('change', (e) => {
    layout.style.left = '-100%';
})

const fetch_task_history = () => {

    const storage = window.localStorage;
    const val = storage.getItem('tasks');
    // console.log(val);

    if (val === null) {
        // console.log('new blank array')
        return new Array();
    } else if (JSON.parse(val) instanceof Array) {
        // console.log('returning array')
        const parsevalue = JSON.parse(val);
        return parsevalue;
    } else {
        return 'error';
    }

}

const display_tasks = () => {
    const value = fetch_task_history();
    // console.log(value)
    if (value.length > 0 && value !== null) {

        const completed = value.filter((item) => {
            return item.completition === 1;
        })

        const incomplete = value.filter((item) => {
            return item.completition === 0;
        })
        // console.log(incomplete)

        let incompletetasks = '';
        let completedtasks = '';

        for (const task of incomplete) {
            incompletetasks += `
            <div class="task" >
            <div class="tasktitle">${task.title}</div>
            <div class="taskdescrip">${task.description}</div>
            <div class="allbuttons">
            <div class="icons edit" data-taskid=${task.id} onclick=edit_task(${task.id})><i class="fas fa-pen-square"></i></div>
            <div class="icons dalete" data-taskid=${task.id} onclick=delete_task(${task.id})><i class="fas fa-trash"></i></div>
            <div class="icons completed" data-taskid=${task.id} onclick=completed_task(${task.id})><i class="fas fa-check-square"></i></div>
			</div>
            </div>
            `
        }

        document.querySelector('.incompletetasks').innerHTML = incompletetasks;

        for (const task of completed) {
            completedtasks += `
                <div class="task" >
                    <div class="tasktitle">${task.title}</div>
                    <div class="taskdescrip">${task.description}</div>
                    <div class="allbuttons">
                        <div class="icons edit" data-taskid=${task.id} onclick=edit_task(${task.id})>
                        <i class="fas fa-pen-square"></i>
                        </div>
                        <div class="icons dalete" data-taskid=${task.id} onclick=delete_task(${task.id})>
                            <i class="fas fa-trash"></i>
                        </div>
                        <div class="icons redo" data-taskid=${task.id} onclick=redo_task(${task.id})>
                                <i class="fas fa-redo"></i>
                        </div>
                    </div>
                </div>
                `

        }

        document.querySelector('.completedtasks').innerHTML = completedtasks;
    } else {
        document.querySelector('.incompletetasks').innerHTML = `<h1>No Tasks To Display</h1>`;
        document.querySelector('.completedtasks').innerHTML = `<h1>No Tasks To Display</h1>`;

    }

}

display_tasks()

const resetform = () => {
    document.querySelector('#tasktitle').value = '';
    document.querySelector('#taskdescription').value = '';
    document.querySelector('#idno').value = '';

    document.querySelector('button.btn.save').style.display = 'none';
    document.querySelector('button.btn.cancel').style.display = 'none';
    document.querySelector('button.btn.addnew').style.display = 'block';

}

document.querySelector('button.btn.addnew').addEventListener('click', () => {
    const title = document.getElementById('tasktitle').value;
    const description = document.getElementById('taskdescription').value;

    if (title != '' && description != '') {
        const completition = 0;
        var date = new Date();
        var components = [
            date.getYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ];

        var id = components.join("");
        const taskArr = [{ title, description, completition, id }];
        const value = fetch_task_history();
        // console.log(value)
        if (value != 'error') {
            const updated_tasks = taskArr.concat(value);
            window.localStorage.setItem('tasks', JSON.stringify(updated_tasks));
        } else {
            alert('Some Error Occured');
        }
        display_tasks();
        resetform()
    } else {
        alert('Title & Description Should Not Be Blanked')
    }

})

document.querySelector('button.btn.save').addEventListener('click', () => {
    const new_title = document.querySelector('#tasktitle').value;
    const new_description = document.querySelector('#taskdescription').value;
    const uniq_id = document.querySelector('#idno').value;
    const valu = fetch_task_history();
    console.log(valu);
    if (valu.length > 0) {
        const index_no = valu.findIndex((item) => {
            return item.id == uniq_id;
        })
        valu[index_no].title = new_title;
        valu[index_no].description = new_description;

        window.localStorage.setItem('tasks', JSON.stringify(valu));
        display_tasks()
        resetform()
    }

})

document.querySelector('button.btn.cancel').addEventListener('click', resetform)

const edit_task = (id) => {
    console.log(id);
    const valu = fetch_task_history();
    console.log(valu);
    if (valu.length > 0) {
        const index_no = valu.findIndex((item) => {
            return item.id == id;
        })

        document.querySelector('#tasktitle').value = valu[index_no].title;
        document.querySelector('#taskdescription').value = valu[index_no].description;
        document.querySelector('#idno').value = valu[index_no].id;
        document.querySelector('button.btn.save').style.display = 'block';
        document.querySelector('button.btn.cancel').style.display = 'block';
        document.querySelector('button.btn.addnew').style.display = 'none';


    }




}

const delete_task = (id) => {

    console.log(id);
    const valu = fetch_task_history();
    console.log(valu);
    if (valu.length > 0) {
        const index_no = valu.findIndex((item) => {
            return item.id == id;
        })
        console.log(index_no);
        valu.splice(index_no, 1);
        console.log(valu);
        window.localStorage.setItem('tasks', JSON.stringify(valu));
        display_tasks()
    }
    resetform()

}

const completed_task = (id) => {
    console.log(id);
    const valu = fetch_task_history();
    console.log(valu);
    if (valu.length > 0) {
        const index_no = valu.findIndex((item) => {
            return item.id == id;
        })
        console.log(index_no);
        valu[index_no].completition = 1;
        window.localStorage.setItem('tasks', JSON.stringify(valu));
        display_tasks()
    }
}

const redo_task = (id) => {
    console.log(id);
    const valu = fetch_task_history();
    console.log(valu);
    if (valu.length > 0) {
        const index_no = valu.findIndex((item) => {
            return item.id == id;
        })
        console.log(index_no);
        valu[index_no].completition = 0;
        window.localStorage.setItem('tasks', JSON.stringify(valu));
        display_tasks()
    }
}

