import { v4 } from 'uuid'
import api from 'api'
import { getTaskById, getAlltasks } from 'reducers'
import moment from 'moment'

//utility
const nullToEmptyString = obj => {
  let newObj = { ...obj }
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === null) {
      newObj = {
        ...newObj,
        [key]: '',
      }
    }
  }
  return newObj
}

const formatDate = tasks => {
  const format = task => {
    const { createdAt, beginAt, dueAt, completedAt, modifiedAt } = task
    return {
      ...task,
      createdAt: createdAt ? moment(createdAt) : null,
      beginAt: beginAt ? moment(beginAt) : null,
      dueAt: dueAt ? moment(dueAt) : null,
      completedAt: completedAt ? moment(completedAt) : null,
      modifiedAt: modifiedAt ? moment(modifiedAt) : null,
    }
  }
  return tasks.map(task => format(task))
}

////////////////project action:
export const addProject = (title = '', group = []) => (dispatch, getState) => {
  const data = {
    id: v4(),
    title,
    group,
    creator: getState().me.id,
  }
  return dispatch({
    type: 'ADD_PROJECT',
    payload: {
      promise: api.Projects.add(data),
      data,
    },
  })
}

export const deleteProject = id => ({
  type: 'DELETE_PROJECT',
  payload: {
    promise: api.Projects.del(id),
    data: { id },
  },
})

export const editProject = (title, group, id) => {
  const data = {
    id,
    title,
    group,
  }
  return {
    //group is array of userIds
    type: 'EDIT_PROJECT',
    payload: {
      promise: api.Projects.update(data),
      data,
    },
  }
}

//no async
export const addUserToProject = (userId, projectId) => ({
  type: 'ADD_USER_TO_PROJECT',
  payload: {
    userId,
    id: projectId,
  },
})

//no async
export const removeUserFromProject = (userId, projectId) => ({
  type: 'REMOVE_USER_FROM_PROJECT',
  payload: {
    userId,
    id: projectId,
  },
})

/////////////////TASK:

export const addTask = projectId => (dispatch, getState) => {
  const id = v4()
  const { me } = getState()
  const isMe = projectId === me.id
  const data = {
    id,
    createdBy: me.id,
    assignee: isMe ? projectId : '',
    projectId: isMe ? '' : projectId,
  }

  dispatch({
    type: 'ADD_TASK',
    payload: {
      promise: api.Tasks.add(data),
      data,
    },
  })
}

//insert the task right after taskId in allIds array
export const insertTask = (projectId, taskId) => (dispatch, getState) => {
  const id = v4()
  const { me } = getState()
  const isMe = projectId === me.id
  const data = {
    id,
    createdBy: me.id,
    assignee: isMe ? projectId : '',
    projectId: isMe ? '' : projectId,
    insertAt: taskId,
  }
  dispatch({
    type: 'INSERT_TASK',
    payload: {
      promise: api.Tasks.insert(data),
      data,
    },
  })
}

export const addSubtask = taskId => (dispatch, getState) => {
  const { rootTaskId, title } = getTaskById(getState(), taskId)
  const { me } = getState()
  const data = {
    id: v4(),
    createdBy: me.id,
    upTaskId: taskId,
    rootTaskId: rootTaskId ? rootTaskId : taskId,
    upTaskTitle: title ? title : '',
  }

  dispatch({
    type: 'ADD_SUBTASK',
    payload: {
      promise: api.Tasks.addSubtask(data),
      data,
    },
  })
}
// sub-action of adding subtask
export const havingSubtask = id => ({
  type: 'HAVING_SUBTASK',
  payload: {
    id,
  },
})

export const insertSubtask = (taskId, subTaskId) => (dispatch, getState) => {
  const { rootTaskId, title } = getTaskById(getState(), taskId)
  const { me } = getState()
  const data = {
    id: v4(),
    createdBy: me.id,
    upTaskId: taskId,
    insertAt: subTaskId,
    rootTaskId: rootTaskId ? rootTaskId : taskId,
    upTaskTitle: title ? title : '',
  }
  dispatch({
    type: 'INSERT_SUBTASK',
    payload: {
      promise: api.Tasks.insertSubtask(data),
      data,
    },
  })
}

export const deleteTask = id => ({
  type: 'DELETE_TASK',
  payload: {
    promise: api.Tasks.del({ id }),
    data: { id },
  },
})

export const deleteSubtask = (id, upId) => ({
  type: 'DELETE_SUBTASK',
  payload: {
    promise: api.Tasks.delSub({ id, upId }),
    data: { id, upId },
  },
})

//no async
export const editTaskTitle = (title, id) => ({
  type: 'EDIT_TASK_TITLE',
  payload: {
    title,
    id,
  },
})

export const saveTaskTitle = (title, id) => ({
  type: 'SAVE_TASK_TITLE',
  payload: {
    promise: api.Tasks.editTitle({ title, id }),
    data: { id },
  },
})

//no async
export const editTaskDetail = (detail, id) => ({
  type: 'EDIT_TASK_DETAIL',
  payload: {
    detail,
    id,
  },
})

export const saveTaskDetail = (detail, id) => ({
  type: 'SAVE_TASK_DETAIL',
  payload: api.Tasks.editDetail({ detail, id }),
})

//subtasks can't change project, cuz it makes no sense
export const editTaskProject = (projectId, id) => (dispatch, getState) => {
  const data = {
    projectId,
    id,
  }
  dispatch({
    type: 'EDIT_TASK_PROJECT',
    payload: {
      promise: api.Tasks.editProject(data),
      data,
    },
  })
}

export const editTaskAssignee = (assignee, id) => {
  const data = {
    assignee,
    id,
  }
  return {
    type: 'EDIT_TASK_ASSIGNEE',
    payload: {
      promise: api.Tasks.editAssignee(data),
      data,
    },
  }
}

export const editTaskBeginAt = (beginAt, id) => {
  const data = {
    beginAt: beginAt,
    id,
  }
  return {
    type: 'EDIT_TASK_BEGINAT',
    payload: {
      promise: api.Tasks.editBeginAt(data),
      data,
    },
  }
}

export const editTaskDue = (dueAt, id) => {
  const data = {
    dueAt: dueAt,
    id,
  }
  return {
    type: 'EDIT_TASK_DUE',
    payload: {
      promise: api.Tasks.editDue(data),
      data,
    },
  }
}

export const editTaskProgress = (progress, id) => {
  const data = {
    progress,
    id,
  }
  return {
    type: 'EDIT_TASK_PROGRESS',
    payload: {
      promise: api.Tasks.editProgress(data),
      data,
    },
  }
}

export const editTaskAmount = (amount, id) => {
  const data = {
    amount,
    id,
  }
  return {
    type: 'EDIT_TASK_AMOUNT',
    payload: {
      promise: api.Tasks.editAmount(data),
      data,
    },
  }
}

export const toggleTask = id => ({
  type: 'TOGGLE_TASK',
  payload: {
    promise: api.Tasks.toggle({ id }),
    data: { id },
  },
})

//upTaskId is passed in, for convenience, esp when upTaskId can be null
export const editUptaskProgress = upTaskId => ({
  type: 'EDIT_UPTASK_PROGRESS',
  payload: {
    id: upTaskId,
  },
})

export const addTaskTag = (tag, id) => ({
  type: 'ADD_TASK_TAG',
  payload: {
    tag,
    id,
  },
})

export const changeTaskOrder = (oldIndex, newIndex) => (dispatch, getState) => {
  const tasks = getAlltasks(getState())
  const task = tasks[oldIndex]
  const target = tasks[newIndex]
  let before = true
  if (oldIndex < newIndex) {
    before = false
  }
  dispatch({
    type: 'CHANGE_TASK_ORDER',
    payload: {
      promise: api.Tasks.taskOrder({
        id: task.id,
        before,
        targetId: target.id,
      }),
      data: {
        oldIndex,
        newIndex,
      },
    },
  })
}

export const changeMyOrder = (oldIndex, newIndex) => (dispatch, getState) => {
  const tasks = getAlltasks(getState())
  const task = tasks[oldIndex]
  const target = tasks[newIndex]
  let before = true
  if (oldIndex < newIndex) {
    before = false
  }
  dispatch({
    type: 'CHANGE_MY_ORDER',
    payload: {
      promise: api.Tasks.myOrder({ id: task.id, before, targetId: target.id }),
      data: {
        oldIndex,
        newIndex,
      },
    },
  })
}

////////////Other state

export const changeCurrentTask = (id = '') => ({
  type: 'CHANGE_CURRENT_TASK',
  id,
})

export const changeCurrentSubtask = (id = '') => ({
  type: 'CHANGE_CURRENT_SUBTASK',
  id,
})

export const changeCompleted = completed => ({
  type: 'CHANGE_COMPLETED',
  payload: {
    completed,
  },
})

//this is for persist state to localStorage so refresh browser will load the same query
export const changeSearch = search => ({
  type: 'CHANGE_SEARCH',
  payload: {
    search,
  },
})

////// Loading data /////////////////////////
//async
export const updateState = () => ({
  // update projects and users
  type: 'UPDATE_ALL',
  payload: {
    promise: Promise.all([api.Projects.all(), api.Users.all()]).then(([projects, users]) => {
      //把所有null值变成''
      const newProjects = projects.map(project => nullToEmptyString(project))
      const newUsers = users.map(user => nullToEmptyString(user))
      return {
        projects: newProjects,
        users: newUsers,
      }
    }),
  },
})

export const updateProjectTasks = id => ({
  type: 'UPDATE_PROJECT_TASKS',
  payload: {
    promise: api.Tasks.byProject(id).then(tasks => formatDate(tasks)),
    //最后这步处理是为了返回的数据结构一致，可以用一个reducer case来写。
    data: { id },
  },
})

export const updateUserTasks = id => ({
  type: 'UPDATE_MY_TASKS',
  payload: {
    promise: api.Tasks.byUser(id).then(tasks => formatDate(tasks)),
  },
})

export const updateSubtasks = id => ({
  type: 'UPDATE_SUBTASKS',
  payload: {
    promise: api.Tasks.subtasks(id).then(tasks => {
      return formatDate(tasks)
    }),
    data: {
      id,
    },
  },
})
//读取一个项目里所有的task以及他们的subtask
export const updateAllTasksByProject = id => ({
  type: 'UPDATE_ALL_TASKS_BY_PROJECT',
  payload: {
    promise: api.Tasks.allByProject(id).then(tasks => formatDate(tasks)),
  },
})

export const updateTaskById = id => ({
  type: 'UPDATE_TASK_BY_ID',
  payload: {
    promise: api.Tasks.byId(id).then(tasks => formatDate(tasks)),
    data: { id },
  },
})

export const updateRootTask = id => ({
  type: 'UPDATE_ROOTTASK',
  payload: {
    promise: api.Tasks.rootTask(id).then(tasks => formatDate(tasks)),
  },
})

export const searchTasks = (search = {}) => ({
  type: 'SEARCH_TASKS',
  payload: {
    promise: api.Tasks.bySearch(search).then(res => formatDate(res.recordset)),
  },
})

/////////////////// user & error handle

export const changeUserWarning = warning => ({
  type: 'CHANGE_USER_WARNING',
  payload: { warning },
})

export const changeMainWarning = warning => ({
  type: 'CHANGE_MAIN_WARNING',
  payload: { warning },
})

export const resetErrorMessage = () => ({
  type: 'RESET_ERROR_MESSAGE',
})

export const saveUser = (id, name) => {
  return {
    type: 'SAVE_USER',
    payload: {
      promise: api.Auth.save(id, name),
    },
  }
}

export const login = (name, password) => ({
  type: 'LOGIN',
  payload: {
    promise: api.Auth.login(name, password),
  },
})

export const logout = () => ({
  type: 'LOGOUT',
})

export const signup = (name, password, password2, slogan) => ({
  type: 'SIGNUP',
  payload: {
    promise: api.Auth.signup(name, password, password2, slogan),
  },
})

export const editMyName = (name, id) => ({
  type: 'EDIT_MY_NAME',
  payload: {
    promise: api.Users.editName({ name, id }),
    data: { name, id },
  },
})

export const editMyPassword = (oldPass, newPass, id) => ({
  type: 'EDIT_MY_PASSWORD',
  payload: api.Users.editPassword({ oldPass, newPass, id }),
})

//////////// visual

export const toggleSidebar = () => ({
  type: 'TOGGLE_SIDEBAR',
})

export const toggleUserSettings = () => ({
  type: 'TOGGLE_USERSETTINGS',
})

export const changeUserSettingsTab = tab => ({
  type: 'CHANGE_USERSETTINGS_TAB',
  tab,
})
