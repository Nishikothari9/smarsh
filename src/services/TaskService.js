import axiosInstance from "src/utils/axios";
const controller = 'task'

class TaskService {

   getAllTasks = (id) => {
    return axiosInstance.get(`/task/getMyAllTasks/${id}`)
   } 

   addOrUpdateTask = (values, isEdit) => {
    const apiPath = isEdit
    ? `/${controller}/update`
    : `/${controller}/add`;

    return axiosInstance.post(apiPath, values)
   }

}

export default new TaskService ()