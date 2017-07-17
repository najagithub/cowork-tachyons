import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { editTaskProject } from 'actions'
import { getAllProjects, getTaskById, getProjectById } from 'reducers'
import TaskStack from './TaskStack'

class Relations extends React.Component {
  render() {
    const {
      currentProject,
      currentTask,
      task,
      getTask,
      getProject
    } = this.props
    const rootProjectId =
      task.rootTaskId &&
      getTask(task.rootTaskId) &&
      getTask(task.rootTaskId).projectId
    let rootProjectName = '无项目'
    if (rootProjectId) {
      rootProjectName = getProject(rootProjectId).title || '无项目'
    }
    return (
      <div>
        {task.upTaskId
          ? <div className="ph3 pv2 black-50">
              {rootProjectName}
            </div>
          : <Dropdown
              className="ph3 pv2 black-50 hover-thin-blue"
              value={currentProject}
              options={this.getProjectOptions()}
              onChange={this.changeProject}
              // disabled={task.upTaskId ? true : false}
            />}
        <TaskStack id={currentTask} />
      </div>
    )
  }

  changeProject = (e, data) => {
    const projectId = data.value
    const { editTaskProject, currentTask } = this.props
    editTaskProject(projectId, currentTask)
  }

  getProjectOptions = () => {
    const { allProjects } = this.props
    const projectArray = allProjects.map(project => ({
      key: project.id,
      value: project.id,
      text: project.title
    }))
    return [...projectArray, { key: 0, value: '0', text: '无项目' }]
  }
}

const mapStateToProps = (state, { match }) => {
  const allProjects = getAllProjects(state)
  const currentTask = match.params.taskId
  const task = getTaskById(state, currentTask) || {}
  const project = getProjectById(state, task.projectId) || {}
  const currentProject = project.id ? project.id : '0'
  return {
    allProjects,
    task,
    currentTask,
    currentProject,
    getTask: id => getTaskById(state, id),
    getProject: id => getProjectById(state, id)
  }
}

Relations = withRouter(connect(mapStateToProps, { editTaskProject })(Relations))

export default Relations