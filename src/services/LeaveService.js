import axiosInstance from "src/utils/axios";
const controller = 'leave'

class LeaveService {

    getLeaves = (userRole,id) => {
        const API_PATH =
        userRole === ('hr' || 'tl')
          ? `${controller}/getThisMonthLeavesOfTeam/${id}`
          : `${controller}/myLeaveOfThisMonth/${id}`;
        return axiosInstance.get(API_PATH)
    }

    addOrUpdateLeaves = (values, isEdit) => {
        const apiPath = isEdit
        ? `/${controller}/update`
        : `/${controller}/add`;

        const {totalLeaveDate, ...LeaveServicevalue} = values;

        return axiosInstance.post(apiPath, {...LeaveServicevalue,
            fromDate: new Date(values.fromDate.split('/').map(Number)[2], values.fromDate.split('/').map(Number)[1] -1, values.fromDate.split('/').map(Number)[0]),
            toDate: new Date(values.toDate.split('/').map(Number)[2], values.toDate.split('/').map(Number)[1] -1, values.toDate.split('/').map(Number)[0])
        })
    }
}

export default new LeaveService ()