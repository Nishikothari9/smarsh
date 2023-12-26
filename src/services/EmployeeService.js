import axiosInstance from "src/utils/axios";
const controller = 'employee'

class EmployeeService {

    getAllUsers = () => {
        return axiosInstance.get(`${controller}`)
    }

    addOrUpdateEmployee = (values, isEdit) => {
        const apiPath = isEdit
        ? `/${controller}/update`
        : `/${controller}/add`;
    
        return  axiosInstance
        .post(apiPath, values)
    }

    getAllHR = () => {
        return axiosInstance.get(`/${controller}/getAllHR`)
    }

    getAllTL = () => {
        return axiosInstance.get(`/${controller}/getAllTL`)
    }

    getAllPM = () => {
        return axiosInstance.get(`/${controller}/getAllPM`)
    }

    getAllEmployee = () => {
        return axiosInstance.get(`/${controller}/getAllEmployee`)
    }

    getAllCountries = () => {
        return axiosInstance.get(`/region/getAllCountrys`)
    }

    getStateByCountry = (country) => {
        return axiosInstance.get(`/region/getStateByCountry/${country}`)
    }

    getCityByState = (state) => {
        return axiosInstance.get(`/region/getCityByState/${state}`)
    }
}



export default new EmployeeService ()