import axiosInstance from "src/utils/axios";
const controller = 'blog'

class BlogService {
    getAllBlogs = (id) => {
        return axiosInstance.get(`/${controller}/getAllPost/${id}`)
    }

    addOrUpdateBlog = (values, isEdit) => {
        const apiPath = isEdit
        ? `${controller}/add`
        : `${controller}/edit`;

        return axiosInstance(apiPath, values)
    }
}

export default new BlogService()