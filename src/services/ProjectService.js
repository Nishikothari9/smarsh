import axiosInstance from "src/utils/axios";
const controller = 'project';

class ProjectService {
    
    getAllProject = () => {
        return axiosInstance.get(`/${controller}/getAllProject`)
    }

    addOrUpdateProject = (values, isEdit, projectDetail) => {
        const apiPath = isEdit
        ? `/${controller}/update/${projectDetail.id}`
        : `/${controller}/add`;

        const { id, ...value} = values

        return axiosInstance.post(apiPath, value, { 
            headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
    }

}

export default new ProjectService()